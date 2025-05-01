import React from 'react';
import { ComponentType } from '../types/circuit';

interface ToolbarProps {
    onAddComponent: (type: ComponentType) => void;
    onClearAll: () => void;
    onSimulate: () => void;
    onResetSimulation: () => void;
    isSimulating: boolean;
}

const Toolbar: React.FC<ToolbarProps> = ({
    onAddComponent,
    onClearAll,
    onSimulate,
    onResetSimulation,
    isSimulating
}) => {
    return (
        <div className="d-flex flex-wrap gap-2 p-2 bg-light border-bottom">
            <div className="btn-group">
                <button
                    className="btn btn-outline-primary"
                    onClick={() => onAddComponent('battery')}
                >
                    Battery
                </button>
                <button
                    className="btn btn-outline-primary"
                    onClick={() => onAddComponent('bulb')}
                >
                    Bulb
                </button>
                <button
                    className="btn btn-outline-primary"
                    onClick={() => onAddComponent('resistor')}
                >
                    Resistor
                </button>
                <button
                    className="btn btn-outline-primary"
                    onClick={() => onAddComponent('switch')}
                >
                    Switch
                </button>
            </div>
            
            <div className="btn-group ms-auto">
                <button
                    className="btn btn-primary"
                    onClick={isSimulating ? onResetSimulation : onSimulate}
                >
                    {isSimulating ? 'Reset' : 'Simulate'}
                </button>
                <button
                    className="btn btn-danger"
                    onClick={onClearAll}
                >
                    Clear All
                </button>
            </div>
        </div>
    );
};

export default Toolbar;