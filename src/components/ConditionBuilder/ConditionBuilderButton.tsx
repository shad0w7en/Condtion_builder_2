import React, { useState, useRef } from 'react';
import { Button, Dialog } from '@mui/material';
import TableSelector from './TableSelector';
import ActionSelector from './ActionSelector';
import BuilderInterface from './BuilderInterface';
import { useConditionBuilder } from './ConditionBuilderContext';
import { SavedCondition } from '../../types';

interface ConditionBuilderButtonProps {
  buttonText?: string;
  onConditionSaved?: (condition: SavedCondition) => void;
  onConditionSelected?: (json: string, sql: string) => void;
}

const ConditionBuilderButton: React.FC<ConditionBuilderButtonProps> = ({
  buttonText = 'Build Condition',
  onConditionSaved,
  onConditionSelected
}) => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<'table' | 'action' | 'builder'>('table');
  const { setSelectedTable, setRootCondition, loadSavedCondition } = useConditionBuilder();
  const dialogRef = useRef<HTMLDivElement>(null);
  
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
  
  const handleConditionSelected = (json: string, sql: string) => {
    if (onConditionSelected) {
      onConditionSelected(json, sql);
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
        ref={dialogRef}
      >
        {step === 'table' && (
          <TableSelector onTableSelected={handleTableSelected} />
        )}
        
        {step === 'action' && (
          <ActionSelector
            onCreateNew={handleCreateNew}
            onBack={() => setStep('table')}
            onSelect={handleConditionSelected}
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