import React from 'react';
import ConditionBuilderButton from './ConditionBuilderButton';
import ConditionBuilderProvider from './ConditionBuilderContext';
import { SavedCondition } from '../../types';
import { ConditionBuilderConfig } from './ConditionBuilderContext';

interface ConditionBuilderProps {
  buttonText?: string;
  onConditionSaved?: (condition: SavedCondition) => void;
  config: ConditionBuilderConfig;
}

export const ConditionBuilder: React.FC<ConditionBuilderProps> = ({ 
  buttonText, 
  onConditionSaved,
  config
}) => {
  return (
    <ConditionBuilderProvider config={config}>
      <ConditionBuilderButton 
        buttonText={buttonText} 
        onConditionSaved={onConditionSaved} 
      />
    </ConditionBuilderProvider>
  );
};

export default ConditionBuilder;