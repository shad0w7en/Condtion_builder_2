import React from 'react';
import ConditionBuilderButton from './ConditionBuilderButton';
import ConditionBuilderProvider from './ConditionBuilderContext';
import { SavedCondition } from '../../types';
import { ConditionBuilderConfig } from './ConditionBuilderContext';

interface ConditionBuilderProps {
  buttonText?: string;
  onConditionSaved?: (condition: SavedCondition) => void;
  onConditionSelected?: (json: string, sql: string) => void;
  config: ConditionBuilderConfig;
  initialSavedConditions?: SavedCondition[];
}

export const ConditionBuilder: React.FC<ConditionBuilderProps> = ({ 
  buttonText, 
  onConditionSaved,
  onConditionSelected,
  config,
  initialSavedConditions
}) => {
  return (
    <ConditionBuilderProvider 
      config={config}
      initialSavedConditions={initialSavedConditions}
    >
      <ConditionBuilderButton 
        buttonText={buttonText} 
        onConditionSaved={onConditionSaved}
        onConditionSelected={onConditionSelected}
      />
    </ConditionBuilderProvider>
  );
};

export default ConditionBuilder;