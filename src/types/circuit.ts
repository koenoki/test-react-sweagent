export type ComponentType = 'battery' | 'bulb' | 'resistor' | 'switch';

export interface CircuitComponent {
    id: string;
    type: ComponentType;
    position: { x: number; y: number };
    rotation: 0 | 90 | 180 | 270;
    state?: any; // Per-type: e.g., { isClosed: boolean } for switch
    connectors: Array<{ id: string; offset: { x: number; y: number } }>;
}

export interface Wire {
    id: string;
    from: { componentId: string; connectorId: string };
    to: { componentId: string; connectorId: string };
}

export interface CircuitState {
    components: CircuitComponent[];
    wires: Wire[];
}

export interface SimulationResult {
    bulbsOn: Set<string>;
    wiresWithCurrent: Set<string>;
    inactive: Set<string>;
}