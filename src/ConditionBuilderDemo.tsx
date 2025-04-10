import React, { useState } from 'react';
import { ConditionBuilder } from './components/ConditionBuilder';
import { conditionBuilderConfig } from './config/tables';
import { SavedCondition } from './types';
import { mockSavedConditions } from './mockData';

const ConditionBuilderDemo: React.FC = () => {
  const [savedConditions, setSavedConditions] = useState<SavedCondition[]>(mockSavedConditions);
  const [lastLoadedCondition, setLastLoadedCondition] = useState<SavedCondition | null>(null);

  const handleConditionSaved = (condition: SavedCondition) => {
    console.log('Saved condition:', condition);
    console.log('SQL:', condition.sqlRepresentation);
    console.log('JSON:', condition.jsonRepresentation);
    // Update the saved conditions state
    setSavedConditions(prev => [...prev, condition]);
  };

  const handleConditionLoaded = (condition: SavedCondition) => {
    console.log('Loaded condition:', condition);
    console.log('SQL:', condition.sqlRepresentation);
    console.log('JSON:', condition.jsonRepresentation);
    setLastLoadedCondition(condition);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Condition Builder Demo</h1>
      {lastLoadedCondition && (
        <div style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}>
          <h3>Last Loaded Condition</h3>
          <p><strong>Name:</strong> {lastLoadedCondition.name}</p>
          <p><strong>Table:</strong> {lastLoadedCondition.tableId}</p>
          <p><strong>SQL:</strong> {lastLoadedCondition.sqlRepresentation}</p>
        </div>
      )}
      <div style={{ marginBottom: '20px' }}>
        <h2>Users Filter</h2>
        <ConditionBuilder 
          buttonText="Filter Users" 
          onConditionSaved={handleConditionSaved}
          onConditionLoaded={handleConditionLoaded}
          config={conditionBuilderConfig}
          savedConditions={savedConditions}
        />
      </div>
      <div>
        <h2>Orders Filter</h2>
        <ConditionBuilder 
          buttonText="Filter Orders" 
          onConditionSaved={handleConditionSaved}
          onConditionLoaded={handleConditionLoaded}
          config={conditionBuilderConfig}
          savedConditions={savedConditions}
        />
      </div>
    </div>
  );
};

export default ConditionBuilderDemo;