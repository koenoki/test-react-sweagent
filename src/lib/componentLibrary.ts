import { ComponentType } from '../types/circuit';

interface ComponentDefinition {
    connectors: Array<{ id: string; offset: { x: number; y: number } }>;
    width: number;
    height: number;
    validConnections: string[]; // List of component types that can connect to this
    svgPath: string; // SVG path data for the component
}

const componentLibrary: Record<ComponentType, ComponentDefinition> = {
    battery: {
        connectors: [
            { id: 'positive', offset: { x: 1, y: 0.5 } },
            { id: 'negative', offset: { x: 0, y: 0.5 } }
        ],
        width: 60,
        height: 40,
        validConnections: ['bulb', 'resistor', 'switch'],
        svgPath: 'M10 20h20M40 20h10M35 10v20M45 15v10' // Simple battery symbol
    },
    bulb: {
        connectors: [
            { id: 'in', offset: { x: 0, y: 0.5 } },
            { id: 'out', offset: { x: 1, y: 0.5 } }
        ],
        width: 40,
        height: 40,
        validConnections: ['battery', 'resistor', 'switch'],
        svgPath: 'M20 20a10 10 0 1 1 0 .1z' // Simple circle for bulb
    },
    resistor: {
        connectors: [
            { id: 'in', offset: { x: 0, y: 0.5 } },
            { id: 'out', offset: { x: 1, y: 0.5 } }
        ],
        width: 50,
        height: 20,
        validConnections: ['battery', 'bulb', 'switch'],
        svgPath: 'M10 10h30M15 5v10M25 5v10M35 5v10' // Simple resistor symbol
    },
    switch: {
        connectors: [
            { id: 'in', offset: { x: 0, y: 0.5 } },
            { id: 'out', offset: { x: 1, y: 0.5 } }
        ],
        width: 40,
        height: 30,
        validConnections: ['battery', 'bulb', 'resistor'],
        svgPath: 'M10 15h20l10 -10' // Simple switch symbol
    }
};

export const isValidConnection = (from: ComponentType, to: ComponentType): boolean => {
    return componentLibrary[from].validConnections.includes(to);
};

export default componentLibrary;