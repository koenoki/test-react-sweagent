import React from 'react';
import { CircuitState, CircuitComponent, Wire as WireType, SimulationResult } from '../types/circuit';
import ComponentNode from './ComponentNode';
import Wire from './Wire';

interface WorkspaceProps {
    circuit: CircuitState;
    simulationResult: SimulationResult | null;
    selectedId: string | null;
    onSelectElement: (id: string | null) => void;
    onMoveComponent: (id: string, pos: { x: number; y: number }) => void;
    onToggleSwitch: (id: string) => void;
    onStartWire: (componentId: string, connectorId: string) => void;
    onCompleteWire: (componentId: string, connectorId: string) => void;
}

const Workspace: React.FC<WorkspaceProps> = ({
    circuit,
    simulationResult,
    selectedId,
    onSelectElement,
    onMoveComponent,
    onToggleSwitch,
    onStartWire,
    onCompleteWire
}) => {
    const [wiringStart, setWiringStart] = React.useState<{ componentId: string; connectorId: string } | null>(null);
    const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 });
    
    const handleConnectorClick = (componentId: string, connectorId: string) => {
        if (!wiringStart) {
            setWiringStart({ componentId, connectorId });
            onStartWire(componentId, connectorId);
        } else {
            if (wiringStart.componentId !== componentId) {
                onCompleteWire(componentId, connectorId);
            }
            setWiringStart(null);
        }
    };
    
    const handleMouseMove = (e: React.MouseEvent) => {
        const rect = (e.target as SVGElement).getBoundingClientRect();
        setMousePos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        });
    };
    
    const getConnectorPosition = (component: CircuitComponent, connectorId: string) => {
        const connector = component.connectors.find(c => c.id === connectorId);
        if (!connector) return { x: 0, y: 0 };
        
        // Apply component rotation and position
        const angle = (component.rotation * Math.PI) / 180;
        const x = component.position.x + connector.offset.x * Math.cos(angle) - connector.offset.y * Math.sin(angle);
        const y = component.position.y + connector.offset.x * Math.sin(angle) + connector.offset.y * Math.cos(angle);
        
        return { x, y };
    };
    
    return (
        <svg
            width="100%"
            height="100%"
            viewBox="0 0 800 600"
            onMouseMove={handleMouseMove}
            onClick={() => !wiringStart && onSelectElement(null)}
            style={{ backgroundColor: '#f8f9fa' }}
        >
            {/* Grid */}
            <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path
                        d="M 20 0 L 0 0 0 20"
                        fill="none"
                        stroke="#ddd"
                        strokeWidth="0.5"
                    />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            
            {/* Wires */}
            {circuit.wires.map(wire => {
                const fromComponent = circuit.components.find(c => c.id === wire.from.componentId);
                const toComponent = circuit.components.find(c => c.id === wire.to.componentId);
                
                if (!fromComponent || !toComponent) return null;
                
                const start = getConnectorPosition(fromComponent, wire.from.connectorId);
                const end = getConnectorPosition(toComponent, wire.to.connectorId);
                
                return (
                    <Wire
                        key={wire.id}
                        wire={wire}
                        start={start}
                        end={end}
                        isSelected={selectedId === wire.id}
                        hasCurrent={simulationResult?.wiresWithCurrent.has(wire.id) || false}
                        onSelect={onSelectElement}
                    />
                );
            })}
            
            {/* Components */}
            {circuit.components.map(component => (
                <ComponentNode
                    key={component.id}
                    component={component}
                    isSelected={selectedId === component.id}
                    isActive={
                        component.type === 'bulb'
                            ? simulationResult?.bulbsOn.has(component.id) || false
                            : !simulationResult?.inactive.has(component.id)
                    }
                    onSelect={onSelectElement}
                    onMove={onMoveComponent}
                    onToggleSwitch={onToggleSwitch}
                    onConnectorClick={handleConnectorClick}
                />
            ))}
            
            {/* Wire being drawn */}
            {wiringStart && (
                <path
                    d={`M ${getConnectorPosition(
                        circuit.components.find(c => c.id === wiringStart.componentId)!,
                        wiringStart.connectorId
                    ).x} ${getConnectorPosition(
                        circuit.components.find(c => c.id === wiringStart.componentId)!,
                        wiringStart.connectorId
                    ).y} L ${mousePos.x} ${mousePos.y}`}
                    stroke="#2196f3"
                    strokeWidth={1}
                    strokeDasharray="5,5"
                    fill="none"
                />
            )}
        </svg>
    );
};

export default Workspace;