import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Toolbar from '../Toolbar';

describe('Toolbar', () => {
  const mockProps = {
    onAddComponent: vi.fn(),
    onClearAll: vi.fn(),
    onSimulate: vi.fn(),
    onResetSimulation: vi.fn(),
    isSimulating: false,
  };

  it('renders all component buttons', () => {
    render(<Toolbar {...mockProps} />);
    expect(screen.getByText('Battery')).toBeInTheDocument();
    expect(screen.getByText('Bulb')).toBeInTheDocument();
    expect(screen.getByText('Resistor')).toBeInTheDocument();
    expect(screen.getByText('Switch')).toBeInTheDocument();
  });

  it('calls onAddComponent with correct type when component buttons are clicked', () => {
    render(<Toolbar {...mockProps} />);
    
    fireEvent.click(screen.getByText('Battery'));
    expect(mockProps.onAddComponent).toHaveBeenCalledWith('battery');
    
    fireEvent.click(screen.getByText('Bulb'));
    expect(mockProps.onAddComponent).toHaveBeenCalledWith('bulb');
    
    fireEvent.click(screen.getByText('Resistor'));
    expect(mockProps.onAddComponent).toHaveBeenCalledWith('resistor');
    
    fireEvent.click(screen.getByText('Switch'));
    expect(mockProps.onAddComponent).toHaveBeenCalledWith('switch');
  });

  it('shows Simulate button when not simulating', () => {
    render(<Toolbar {...mockProps} />);
    expect(screen.getByText('Simulate')).toBeInTheDocument();
    expect(screen.queryByText('Reset')).not.toBeInTheDocument();
  });

  it('shows Reset button when simulating', () => {
    render(<Toolbar {...mockProps} isSimulating={true} />);
    expect(screen.getByText('Reset')).toBeInTheDocument();
    expect(screen.queryByText('Simulate')).not.toBeInTheDocument();
  });

  it('calls correct function when Simulate/Reset button is clicked', () => {
    const { rerender } = render(<Toolbar {...mockProps} />);
    
    fireEvent.click(screen.getByText('Simulate'));
    expect(mockProps.onSimulate).toHaveBeenCalled();
    
    rerender(<Toolbar {...mockProps} isSimulating={true} />);
    fireEvent.click(screen.getByText('Reset'));
    expect(mockProps.onResetSimulation).toHaveBeenCalled();
  });

  it('calls onClearAll when Clear All button is clicked', () => {
    render(<Toolbar {...mockProps} />);
    fireEvent.click(screen.getByText('Clear All'));
    expect(mockProps.onClearAll).toHaveBeenCalled();
  });
});