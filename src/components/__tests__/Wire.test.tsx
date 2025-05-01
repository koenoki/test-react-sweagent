import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Wire from '../Wire';

describe('Wire', () => {
  const mockProps = {
    wire: { id: 'wire1', from: { componentId: 'comp1', connectorId: 'conn1' }, to: { componentId: 'comp2', connectorId: 'conn2' } },
    start: { x: 0, y: 0 },
    end: { x: 100, y: 100 },
    isSelected: false,
    hasCurrent: false,
    onSelect: vi.fn(),
  };

  it('renders wire path correctly', () => {
    const { container } = render(<Wire {...mockProps} />);
    const path = container.querySelector('path');
    expect(path).toHaveAttribute('d', 'M 0 0 L 100 100');
  });

  it('applies selected class and styles when selected', () => {
    const { container } = render(<Wire {...mockProps} isSelected={true} />);
    expect(container.querySelector('.wire')).toHaveClass('selected');
    const path = container.querySelector('path');
    expect(path).toHaveAttribute('stroke', '#2196f3');
    expect(path).toHaveAttribute('stroke-width', '2');
  });

  it('applies active class and shows animation when has current', () => {
    const { container } = render(<Wire {...mockProps} hasCurrent={true} />);
    expect(container.querySelector('.wire')).toHaveClass('active');
    expect(container.querySelector('circle')).toBeInTheDocument();
    expect(container.querySelector('animateMotion')).toBeInTheDocument();
  });

  it('calls onSelect with wire id when clicked', () => {
    const { container } = render(<Wire {...mockProps} />);
    const path = container.querySelector('path');
    fireEvent.click(path!);
    expect(mockProps.onSelect).toHaveBeenCalledWith('wire1');
  });

  it('has wider invisible path for easier selection', () => {
    const { container } = render(<Wire {...mockProps} />);
    const paths = container.querySelectorAll('path');
    const widePath = paths[paths.length - 1];
    expect(widePath).toHaveAttribute('stroke', 'transparent');
    expect(widePath).toHaveAttribute('stroke-width', '10');
  });
});