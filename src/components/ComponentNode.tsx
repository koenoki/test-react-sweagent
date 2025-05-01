import React from 'react';
import { CircuitComponent } from '../types/circuit';
import componentLibrary from '../lib/componentLibrary';

interface ComponentNodeProps {
    component: CircuitComponent;
    isSelected: boolean;
    isActive: boolean;
    onSelect: (id: string) => void;
    onMove: (id: string, pos: { x: number; y: number }) => void;
    onToggleSwitch?: (id: string) => void;
    onConnectorClick: (componentId: string, connectorId: string) => void;
}

const ComponentNode: React.FC<ComponentNodeProps> = ({
    component,
    isSelected,
    isActive,
    onSelect,
    onMove,
    onToggleSwitch,
    onConnectorClick
}) => {
    const [isDragging, setIsDragging] = React.useState(false);
    const [dragOffset, setDragOffset] = React.useState({ x: 0, y: 0 });

    const def = componentLibrary[component.type];
    const transform = `translate(${component.position.x},${component.position.y}) rotate(${component.rotation})`;

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        const rect = (e.target as SVGElement).getBoundingClientRect();
        setDragOffset({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        });
        onSelect(component.id);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        
        const newPos = {
            x: Math.round((e.clientX - dragOffset.x) / 20) * 20,
            y: Math.round((e.clientY - dragOffset.y) / 20) * 20
        };
        
        onMove(component.id, newPos);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    React.useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove as any);
            window.addEventListener('mouseup', handleMouseUp);
            return () => {
                window.removeEventListener('mousemove', handleMouseMove as any);
                window.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [isDragging]);

    return (
        <g
            transform={transform}
            onMouseDown={handleMouseDown}
            style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
            className={`component ${isSelected ? 'selected' : ''} ${isActive ? 'active' : ''}`}
        >
            {/* Component body */}
            <path
                d={def.svgPath}
                fill={isActive ? '#ffeb3b' : 'none'}
                stroke={isSelected ? '#2196f3' : '#000'}
                strokeWidth={isSelected ? 2 : 1}
            />
            
            {/* Connectors */}
            {component.connectors.map(conn => (
                <circle
                    key={conn.id}
                    cx={conn.offset.x * def.width}
                    cy={conn.offset.y * def.height}
                    r={4}
                    fill="#666"
                    stroke={isSelected ? '#2196f3' : '#000'}
                    onClick={() => onConnectorClick(component.id, conn.id)}
                    style={{ cursor: 'pointer' }}
                />
            ))}
            
            {/* Switch toggle if applicable */}
            {component.type === 'switch' && (
                <rect
                    x={10}
                    y={-10}
                    width={20}
                    height={20}
                    fill="transparent"
                    stroke="none"
                    style={{ cursor: 'pointer' }}
                    onClick={() => onToggleSwitch?.(component.id)}
                />
            )}
        </g>
    );
};

export default ComponentNode;