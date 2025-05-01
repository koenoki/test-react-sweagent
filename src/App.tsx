import React from 'react';
import { CircuitState, ComponentType, SimulationResult } from './types/circuit';
import Toolbar from './components/Toolbar';
import Workspace from './components/Workspace';
import DeleteConfirm from './components/DeleteConfirm';
import { simulate } from './lib/simulationEngine';
import './App.css';

function App() {
  const [circuit, setCircuit] = React.useState<CircuitState>({
    components: [
      {
        id: 'battery1',
        type: 'battery',
        position: { x: 100, y: 300 },
        rotation: 0,
        connectors: [
          { id: 'positive', offset: { x: 1, y: 0.5 } },
          { id: 'negative', offset: { x: 0, y: 0.5 } }
        ]
      },
      {
        id: 'bulb1',
        type: 'bulb',
        position: { x: 300, y: 300 },
        rotation: 0,
        connectors: [
          { id: 'in', offset: { x: 0, y: 0.5 } },
          { id: 'out', offset: { x: 1, y: 0.5 } }
        ]
      }
    ],
    wires: [
      {
        id: 'wire1',
        from: { componentId: 'battery1', connectorId: 'positive' },
        to: { componentId: 'bulb1', connectorId: 'in' }
      },
      {
        id: 'wire2',
        from: { componentId: 'bulb1', connectorId: 'out' },
        to: { componentId: 'battery1', connectorId: 'negative' }
      }
    ]
  });

  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [simulationResult, setSimulationResult] = React.useState<SimulationResult | null>(null);
  const [deleteConfirm, setDeleteConfirm] = React.useState<{ show: boolean; position: { x: number; y: number } }>({
    show: false,
    position: { x: 0, y: 0 }
  });

  const handleAddComponent = (type: ComponentType) => {
    const id = `${type}${circuit.components.length + 1}`;
    setCircuit(prev => ({
      ...prev,
      components: [
        ...prev.components,
        {
          id,
          type,
          position: { x: 400, y: 300 },
          rotation: 0,
          connectors: type === 'battery'
            ? [
                { id: 'positive', offset: { x: 1, y: 0.5 } },
                { id: 'negative', offset: { x: 0, y: 0.5 } }
              ]
            : [
                { id: 'in', offset: { x: 0, y: 0.5 } },
                { id: 'out', offset: { x: 1, y: 0.5 } }
              ],
          state: type === 'switch' ? { isClosed: false } : undefined
        }
      ]
    }));
  };

  const handleMoveComponent = (id: string, newPos: { x: number; y: number }) => {
    setCircuit(prev => ({
      ...prev,
      components: prev.components.map(comp =>
        comp.id === id ? { ...comp, position: newPos } : comp
      )
    }));
  };

  const handleToggleSwitch = (id: string) => {
    setCircuit(prev => ({
      ...prev,
      components: prev.components.map(comp =>
        comp.id === id
          ? {
              ...comp,
              state: { isClosed: !comp.state?.isClosed }
            }
          : comp
      )
    }));
  };

  const handleStartWire = (componentId: string, connectorId: string) => {
    // Wire starting logic will be handled in Workspace component
  };

  const handleCompleteWire = (toComponentId: string, toConnectorId: string) => {
    const id = `wire${circuit.wires.length + 1}`;
    setCircuit(prev => ({
      ...prev,
      wires: [
        ...prev.wires,
        {
          id,
          from: { componentId: selectedId!, connectorId: 'out' },
          to: { componentId: toComponentId, connectorId: toConnectorId }
        }
      ]
    }));
    setSelectedId(null);
  };

  const handleDelete = () => {
    if (!selectedId) return;

    setCircuit(prev => {
      if (prev.components.some(c => c.id === selectedId)) {
        // Delete component and its connected wires
        return {
          components: prev.components.filter(c => c.id !== selectedId),
          wires: prev.wires.filter(w =>
            w.from.componentId !== selectedId && w.to.componentId !== selectedId
          )
        };
      } else {
        // Delete wire
        return {
          ...prev,
          wires: prev.wires.filter(w => w.id !== selectedId)
        };
      }
    });
    setSelectedId(null);
    setDeleteConfirm({ show: false, position: { x: 0, y: 0 } });
  };

  const handleSimulate = () => {
    const result = simulate(circuit);
    setSimulationResult(result);
  };

  const handleResetSimulation = () => {
    setSimulationResult(null);
  };

  const handleClearAll = () => {
    setCircuit({ components: [], wires: [] });
    setSelectedId(null);
    setSimulationResult(null);
  };

  return (
    <div className="vh-100 d-flex flex-column">
      <Toolbar
        onAddComponent={handleAddComponent}
        onClearAll={handleClearAll}
        onSimulate={handleSimulate}
        onResetSimulation={handleResetSimulation}
        isSimulating={simulationResult !== null}
      />
      
      <div className="flex-grow-1 position-relative">
        <Workspace
          circuit={circuit}
          simulationResult={simulationResult}
          selectedId={selectedId}
          onSelectElement={setSelectedId}
          onMoveComponent={handleMoveComponent}
          onToggleSwitch={handleToggleSwitch}
          onStartWire={handleStartWire}
          onCompleteWire={handleCompleteWire}
        />
        
        <DeleteConfirm
          show={deleteConfirm.show}
          position={deleteConfirm.position}
          onConfirm={handleDelete}
          onCancel={() => setDeleteConfirm({ show: false, position: { x: 0, y: 0 } })}
        />
      </div>
    </div>
  );
}

export default App;
