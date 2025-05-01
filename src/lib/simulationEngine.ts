import { CircuitState, SimulationResult, CircuitComponent, Wire } from '../types/circuit';

interface Graph {
    [key: string]: Set<string>;
}

const buildGraph = (circuit: CircuitState): Graph => {
    const graph: Graph = {};
    
    // Initialize nodes for all components
    circuit.components.forEach(comp => {
        comp.connectors.forEach(conn => {
            const nodeId = `${comp.id}:${conn.id}`;
            graph[nodeId] = new Set();
        });
    });
    
    // Add edges for wires
    circuit.wires.forEach(wire => {
        const fromNode = `${wire.from.componentId}:${wire.from.connectorId}`;
        const toNode = `${wire.to.componentId}:${wire.to.connectorId}`;
        graph[fromNode].add(toNode);
        graph[toNode].add(fromNode);
    });
    
    return graph;
};

const findBatteryTerminals = (components: CircuitComponent[]): { positive: string, negative: string } | null => {
    const battery = components.find(c => c.type === 'battery');
    if (!battery) return null;
    
    return {
        positive: `${battery.id}:positive`,
        negative: `${battery.id}:negative`
    };
};

const bfs = (graph: Graph, start: string, end: string, switches: Set<string>): string[] | null => {
    const queue: string[] = [start];
    const visited = new Set<string>();
    const parent = new Map<string, string>();
    
    while (queue.length > 0) {
        const current = queue.shift()!;
        if (current === end) {
            // Reconstruct path
            const path: string[] = [];
            let node = end;
            while (node !== start) {
                path.unshift(node);
                node = parent.get(node)!;
            }
            path.unshift(start);
            return path;
        }
        
        for (const neighbor of graph[current]) {
            // Skip if switch is open
            if (switches.has(neighbor) && !switches.has(`${neighbor}:closed`)) continue;
            
            if (!visited.has(neighbor)) {
                visited.add(neighbor);
                parent.set(neighbor, current);
                queue.push(neighbor);
            }
        }
    }
    
    return null;
};

export const simulate = (circuit: CircuitState): SimulationResult => {
    const result: SimulationResult = {
        bulbsOn: new Set<string>(),
        wiresWithCurrent: new Set<string>(),
        inactive: new Set<string>()
    };
    
    const graph = buildGraph(circuit);
    const terminals = findBatteryTerminals(circuit.components);
    if (!terminals) return result;
    
    // Get all switches and their states
    const switches = new Set<string>();
    circuit.components
        .filter(c => c.type === 'switch')
        .forEach(s => {
            switches.add(`${s.id}:in`);
            switches.add(`${s.id}:out`);
            if (s.state?.isClosed) {
                switches.add(`${s.id}:in:closed`);
                switches.add(`${s.id}:out:closed`);
            }
        });
    
    // Find path from positive to negative terminal
    const path = bfs(graph, terminals.positive, terminals.negative, switches);
    
    if (!path) {
        // No valid path found - mark all components as inactive
        circuit.components.forEach(c => result.inactive.add(c.id));
        return result;
    }
    
    // Mark components in path as active
    for (let i = 0; i < path.length - 1; i++) {
        const [compId1] = path[i].split(':');
        const [compId2] = path[i + 1].split(':');
        
        // Find wire connecting these components
        const wire = circuit.wires.find(w => 
            (w.from.componentId === compId1 && w.to.componentId === compId2) ||
            (w.from.componentId === compId2 && w.to.componentId === compId1)
        );
        
        if (wire) {
            result.wiresWithCurrent.add(wire.id);
        }
        
        // If component is a bulb, mark it as on
        const component = circuit.components.find(c => c.id === compId1);
        if (component?.type === 'bulb') {
            result.bulbsOn.add(component.id);
        }
    }
    
    // Mark remaining components as inactive
    circuit.components.forEach(c => {
        if (!result.bulbsOn.has(c.id) && c.type === 'bulb') {
            result.inactive.add(c.id);
        }
    });
    
    return result;
};