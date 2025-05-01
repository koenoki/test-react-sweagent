import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ComponentNode from '../ComponentNode';

describe('ComponentNode', () => {
  const mockComponent = {
    id: 'comp1',
    type: 'battery',
    position: { x: 100, y: 100 },
    rotation: 0,
    connectors: [
      { id: 'conn1', offset: { x: 0, y: 0 } },
      { id: 'conn2', offset: { x: 1, y: 0 } }
    ]
  };

  const mockProps = {
    component: mockComponent,
    isSelected: false,
    isActive: false,
    onSelect: vi.fn(),
    onMove: vi.fn(),
    onToggleSwitch: vi.fn(),
    onConnectorClick: vi.fn(),
  };

  it('renders component with correct transform', () => {
    const { container } = render(<ComponentNode {...mockProps} />);
    const group = container.querySelector('g');
    expect(group).toHaveAttribute('transform', 'translate(100,100) rotate(0)');
  });

  it('applies selected class and styles when selected', () => {
    const { container } = render(<ComponentNode {...mockProps} isSelected={true} />);
    const group = container.querySelector('g');
    expect(group).toHaveClass('selected');
    const path = container.querySelector('path');
    expect(path).toHaveAttribute('stroke', '#2196f3');
    expect(path).toHaveAttribute('stroke-width', '2');
  });

  it('applies active class and fill when active', () => {
    const { container } = render(<ComponentNode {...mockProps} isActive={true} />);
    const group = container.querySelector('g');
    expect(group).toHaveClass('active');
    const path = container.querySelector('path');
    expect(path).toHaveAttribute('fill', '#ffeb3b');
  });

  it('renders connectors', () => {
    const { container } = render(<ComponentNode {...mockProps} />);
    const connectors = container.querySelectorAll('circle');
    expect(connectors).toHaveLength(2);
  });

  it('calls onConnectorClick when connector is clicked', () => {
    const { container } = render(<ComponentNode {...mockProps} />);
    const connector = container.querySelector('circle');
    fireEvent.click(connector!);
    expect(mockProps.onConnectorClick).toHaveBeenCalledWith('comp1', 'conn1');
  });

  it('handles mouse events for dragging', () => {
    const { container } = render(<ComponentNode {...mockProps} />);
    const group = container.querySelector('g');
    
    // Start drag
    fireEvent.mouseDown(group!, { clientX: 100, clientY: 100 });
    expect(mockProps.onSelect).toHaveBeenCalledWith('comp1');
    
    // Move
    fireEvent.mouseMove(group!, { clientX: 120, clientY: 120 });
    expect(mockProps.onMove).toHaveBeenCalled();
    
    // End drag
    fireEvent.mouseUp(group!);
  });

  it('renders switch toggle button for switch components', () => {
    const switchComponent = {
      ...mockComponent,
      type: 'switch'
    };
    const { container } = render(<ComponentNode {...mockProps} component={switchComponent} />);
    const toggleButton = container.querySelector('rect[style*="cursor: pointer"]');
    expect(toggleButton).toBeInTheDocument();
    
    fireEvent.click(toggleButton!);
    expect(mockProps.onToggleSwitch).toHaveBeenCalledWith('comp1');
  });
});