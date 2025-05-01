import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import DeleteConfirm from '../DeleteConfirm';

describe('DeleteConfirm', () => {
  const mockProps = {
    show: true,
    position: { x: 100, y: 100 },
    onConfirm: vi.fn(),
    onCancel: vi.fn(),
  };

  it('renders nothing when show is false', () => {
    const { container } = render(<DeleteConfirm {...mockProps} show={false} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders delete and cancel buttons when show is true', () => {
    render(<DeleteConfirm {...mockProps} />);
    expect(screen.getByText('Delete')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('positions the dialog at the specified coordinates', () => {
    const { container } = render(<DeleteConfirm {...mockProps} />);
    const dialog = container.firstChild as HTMLElement;
    expect(dialog.style.left).toBe('100px');
    expect(dialog.style.top).toBe('100px');
  });

  it('calls onConfirm when Delete button is clicked', () => {
    render(<DeleteConfirm {...mockProps} />);
    fireEvent.click(screen.getByText('Delete'));
    expect(mockProps.onConfirm).toHaveBeenCalled();
  });

  it('calls onCancel when Cancel button is clicked', () => {
    render(<DeleteConfirm {...mockProps} />);
    fireEvent.click(screen.getByText('Cancel'));
    expect(mockProps.onCancel).toHaveBeenCalled();
  });

  it('has correct styling classes', () => {
    const { container } = render(<DeleteConfirm {...mockProps} />);
    const dialog = container.firstChild as HTMLElement;
    expect(dialog).toHaveClass('position-absolute', 'bg-white', 'border', 'rounded', 'shadow-sm', 'p-2');
  });
});