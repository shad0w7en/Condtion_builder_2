import React from 'react';
import ConditionBuilderButton from './ConditionBuilderButton';
import ConditionBuilderProvider from './ConditionBuilderContext';
import { SavedCondition } from '../../types';
import { ConditionBuilderConfig } from './ConditionBuilderContext';

interface ConditionBuilderProps {
  buttonText?: string;
  onConditionSaved?: (condition: SavedCondition) => void;
  onConditionLoaded?: (condition: SavedCondition) => void;
  config: ConditionBuilderConfig;
  savedConditions: SavedCondition[];
}

export const ConditionBuilder: React.FC<ConditionBuilderProps> = ({ 
  buttonText, 
  onConditionSaved,
  onConditionLoaded,
  config,
  savedConditions
}) => {
  return (
    <ConditionBuilderProvider 
      config={config}
      savedConditions={savedConditions}
      onConditionLoaded={onConditionLoaded}
    >
      <ConditionBuilderButton 
        buttonText={buttonText} 
        onConditionSaved={onConditionSaved} 
      />
    </ConditionBuilderProvider>
  );
};

export default ConditionBuilder;