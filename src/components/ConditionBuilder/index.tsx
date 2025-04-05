import React from 'react';
import ConditionBuilderButton from './ConditionBuilderButton';
import ConditionBuilderProvider from './ConditionBuilderContext';
import { SavedCondition } from '../../types';

interface ConditionBuilderProps {
  buttonText?: string;
  onConditionSaved?: (condition: SavedCondition) => void;
}

const ConditionBuilder: React.FC<ConditionBuilderProps> = ({ 
  buttonText, 
  onConditionSaved 
}) => {
  return (
    <ConditionBuilderProvider>
      <ConditionBuilderButton 
        buttonText={buttonText} 
        onConditionSaved={onConditionSaved} 
      />
    </ConditionBuilderProvider>
  );
};

export default ConditionBuilder;