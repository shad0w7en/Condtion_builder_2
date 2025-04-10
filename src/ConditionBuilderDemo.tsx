import React, { useState } from 'react';
import { ConditionBuilder } from './components/ConditionBuilder';
import { conditionBuilderConfig } from './config/tables';
import { SavedCondition } from './types';
import { mockSavedConditions } from './mockData';

const ConditionBuilderDemo: React.FC = () => {
  const [savedConditions, setSavedConditions] = useState<SavedCondition[]>(mockSavedConditions);

  const handleConditionSaved = (condition: SavedCondition) => {
    console.log('Saved condition:', condition);
    console.log('SQL:', condition.sqlRepresentation);
    console.log('JSON:', condition.jsonRepresentation);
    // Update the saved conditions state
    setSavedConditions(prev => [...prev, condition]);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Condition Builder Demo</h1>
      <div style={{ marginBottom: '20px' }}>
        <h2>Users Filter</h2>
        <ConditionBuilder 
          buttonText="Filter Users" 
          onConditionSaved={handleConditionSaved}
          config={conditionBuilderConfig}
          savedConditions={savedConditions}
        />
      </div>
      <div>
        <h2>Orders Filter</h2>
        <ConditionBuilder 
          buttonText="Filter Orders" 
          onConditionSaved={handleConditionSaved}
          config={conditionBuilderConfig}
          savedConditions={savedConditions}
        />
      </div>
    </div>
  );
};

export default ConditionBuilderDemo;