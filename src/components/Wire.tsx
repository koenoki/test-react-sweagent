import React from 'react';
import { Wire as WireType } from '../types/circuit';

interface WireProps {
    wire: WireType;
    start: { x: number; y: number };
    end: { x: number; y: number };
    isSelected: boolean;
    hasCurrent: boolean;
    onSelect: (id: string) => void;
}

const Wire: React.FC<WireProps> = ({
    wire,
    start,
    end,
    isSelected,
    hasCurrent,
    onSelect
}) => {
    const path = `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
    
    return (
        <g className={`wire ${isSelected ? 'selected' : ''} ${hasCurrent ? 'active' : ''}`}>
            {/* Main wire line */}
            <path
                d={path}
                stroke={isSelected ? '#2196f3' : '#000'}
                strokeWidth={isSelected ? 2 : 1}
                fill="none"
                onClick={() => onSelect(wire.id)}
                style={{ cursor: 'pointer' }}
            />
            
            {/* Current animation if active */}
            {hasCurrent && (
                <g>
                    <circle
                        cx={0}
                        cy={0}
                        r={3}
                        fill="#2196f3"
                    >
                        <animateMotion
                            dur="1s"
                            repeatCount="indefinite"
                            path={path}
                        />
                    </circle>
                </g>
            )}
            
            {/* Wider invisible line for easier selection */}
            <path
                d={path}
                stroke="transparent"
                strokeWidth={10}
                fill="none"
                onClick={() => onSelect(wire.id)}
                style={{ cursor: 'pointer' }}
            />
        </g>
    );
};

export default Wire;