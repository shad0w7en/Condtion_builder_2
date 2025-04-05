import React from 'react';
import { ConditionBuilder } from './components/ConditionBuilder';
import { conditionBuilderConfig } from './config/tables';
import { SavedCondition } from './types';

const ConditionBuilderDemo: React.FC = () => {
  const handleConditionSaved = (condition: SavedCondition) => {
    console.log('Saved condition:', condition);
    // Here you can handle the saved condition according to your needs
    // For example, send it to an API, store it in state, etc.
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
        />
      </div>
      <div>
        <h2>Orders Filter</h2>
        <ConditionBuilder 
          buttonText="Filter Orders" 
          onConditionSaved={handleConditionSaved}
          config={conditionBuilderConfig}
        />
      </div>
    </div>
  );
};

export default ConditionBuilderDemo;