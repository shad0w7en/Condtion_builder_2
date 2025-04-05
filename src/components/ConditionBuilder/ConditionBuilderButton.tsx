import React, { useState } from 'react';
import { Button, Dialog } from '@mui/material';
import TableSelector from './TableSelector';
import ActionSelector from './ActionSelector';
import BuilderInterface from './BuilderInterface';
import { useConditionBuilder } from './ConditionBuilderContext';
import { SavedCondition } from '../../types';

interface ConditionBuilderButtonProps {
  buttonText?: string;
  onConditionSaved?: (condition: SavedCondition) => void;
}

const ConditionBuilderButton: React.FC<ConditionBuilderButtonProps> = ({
  buttonText = 'Build Condition',
  onConditionSaved
}) => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<'table' | 'action' | 'builder'>('table');
  const { selectedTable, setSelectedTable, setRootCondition } = useConditionBuilder();
  
  const handleOpen = () => {
    setOpen(true);
    setStep('table');
  };
  
  const handleClose = () => {
    setOpen(false);
    setSelectedTable(null);
    // Reset the condition builder
    setRootCondition({
      id: 'root',
      type: 'group',
      logicalOperator: 'AND',
      conditions: []
    });
  };
  
  const handleTableSelected = () => {
    setStep('action');
  };
  
  const handleCreateNew = () => {
    setStep('builder');
  };
  
  const handleConditionSaved = (condition: SavedCondition) => {
    if (onConditionSaved) {
      onConditionSaved(condition);
    }
    handleClose();
  };
  
  return (
    <>
      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleOpen}
      >
        {buttonText}
      </Button>
      
      <Dialog 
        open={open} 
        onClose={handleClose}
        maxWidth="md"
        fullWidth
      >
        {step === 'table' && (
          <TableSelector onTableSelected={handleTableSelected} />
        )}
        
        {step === 'action' && (
          <ActionSelector 
            onCreateNew={handleCreateNew} 
            onBack={() => setStep('table')} 
          />
        )}
        
        {step === 'builder' && (
          <BuilderInterface 
            onBack={() => setStep('action')} 
            onSave={handleConditionSaved} 
          />
        )}
      </Dialog>
    </>
  );
};

export default ConditionBuilderButton;