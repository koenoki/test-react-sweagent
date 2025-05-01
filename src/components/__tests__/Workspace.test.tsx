import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Workspace from '../Workspace';

describe('Workspace', () => {
  const mockCircuit = {
    components: [
      {
        id: 'comp1',
        type: 'battery',
        position: { x: 100, y: 100 },
        rotation: 0,
        connectors: [
          { id: 'conn1', offset: { x: 0, y: 0 } },
          { id: 'conn2', offset: { x: 1, y: 0 } }
        ]
      }
    ],
    wires: [
      {
        id: 'wire1',
        from: { componentId: 'comp1', connectorId: 'conn1' },
        to: { componentId: 'comp2', connectorId: 'conn2' }
      }
    ]
  };

  const mockSimulationResult = {
    wiresWithCurrent: new Set(['wire1']),
    bulbsOn: new Set(['bulb1']),
    inactive: new Set()
  };

  const mockProps = {
    circuit: mockCircuit,
    simulationResult: mockSimulationResult,
    selectedId: null,
    onSelectElement: vi.fn(),
    onMoveComponent: vi.fn(),
    onToggleSwitch: vi.fn(),
    onStartWire: vi.fn(),
    onCompleteWire: vi.fn(),
  };

  it('renders SVG with correct viewBox', () => {
    const { container } = render(<Workspace {...mockProps} />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('viewBox', '0 0 800 600');
  });

  it('renders grid pattern', () => {
    const { container } = render(<Workspace {...mockProps} />);
    expect(container.querySelector('pattern#grid')).toBeInTheDocument();
  });

  it('renders components', () => {
    const { container } = render(<Workspace {...mockProps} />);
    expect(container.querySelector('.component')).toBeInTheDocument();
  });

  it('renders wires', () => {
    const { container } = render(<Workspace {...mockProps} />);
    expect(container.querySelector('.wire')).toBeInTheDocument();
  });

  it('handles wire drawing', () => {
    const { container } = render(<Workspace {...mockProps} />);
    
    // Click on first connector to start wiring
    const connector = container.querySelector('circle');
    fireEvent.click(connector!);
    expect(mockProps.onStartWire).toHaveBeenCalledWith('comp1', 'conn1');
    
    // Move mouse
    const svg = container.querySelector('svg');
    fireEvent.mouseMove(svg!, { clientX: 200, clientY: 200 });
    
    // Temporary wire path should be visible
    expect(container.querySelector('path[stroke="#2196f3"]')).toBeInTheDocument();
  });

  it('deselects when clicking empty space', () => {
    const { container } = render(<Workspace {...mockProps} />);
    const svg = container.querySelector('svg');
    fireEvent.click(svg!);
    expect(mockProps.onSelectElement).toHaveBeenCalledWith(null);
  });

  it('shows active components based on simulation result', () => {
    const { container } = render(<Workspace {...mockProps} />);
    const wire = container.querySelector('.wire');
    expect(wire).toHaveClass('active');
  });
});