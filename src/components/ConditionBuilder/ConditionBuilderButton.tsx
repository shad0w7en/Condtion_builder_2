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
}

const ConditionBuilderButton: React.FC<ConditionBuilderButtonProps> = ({
  buttonText = 'Build Condition',
  onConditionSaved
}) => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<'table' | 'action' | 'builder'>('table');
  const {  setSelectedTable, setRootCondition } = useConditionBuilder();
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
        aria-labelledby="condition-builder-dialog-title"
        aria-describedby="condition-builder-dialog-description"
        disablePortal={false}
        keepMounted={false}
        disableEnforceFocus={false}
        disableAutoFocus={false}
        ref={dialogRef}
        container={document.body}
        disableScrollLock={true}
        hideBackdrop={false}
        BackdropProps={{
          invisible: false,
          sx: { zIndex: -1 }
        }}
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