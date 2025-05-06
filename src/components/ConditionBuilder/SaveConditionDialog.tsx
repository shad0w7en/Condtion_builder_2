import React, { useState, useRef } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField 
} from '@mui/material';
import { useConditionBuilder } from './ConditionBuilderContext';

interface SaveConditionDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
}

const SaveConditionDialog: React.FC<SaveConditionDialogProps> = ({ 
  open, 
  onClose, 
  onSave 
}) => {
  const { savedConditions } = useConditionBuilder();
  const [conditionName, setConditionName] = useState('');
  const [error, setError] = useState('');
  const dialogRef = useRef<HTMLDivElement>(null);
  
  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newName = event.target.value;
    setConditionName(newName);
    
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
    
    // Check for duplicate names
    if (newName.trim()) {
      const isDuplicate = savedConditions.some(
        condition => condition.name.toLowerCase() === newName.toLowerCase().trim()
      );
      if (isDuplicate) {
        setError('A condition with this name already exists');
      }
    }
  };
  
  const handleSave = () => {
    if (!conditionName.trim()) {
      setError('Please enter a name for the condition');
      return;
    }
    
    // Final check for duplicate names
    const isDuplicate = savedConditions.some(
      condition => condition.name.toLowerCase() === conditionName.toLowerCase().trim()
    );
    
    if (isDuplicate) {
      setError('A condition with this name already exists');
      return;
    }
    
    onSave(conditionName);
    setConditionName('');
  };
  
  const handleClose = () => {
    setConditionName('');
    setError('');
    onClose();
  };
  
  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      aria-labelledby="save-condition-dialog-title"
      aria-describedby="save-condition-dialog-description"
      ref={dialogRef}
      container={document.body}
      disableScrollLock={true}
      hideBackdrop={false}
      BackdropProps={{
        invisible: false,
        sx: { zIndex: -1 }
      }}
    >
      <DialogTitle id="save-condition-dialog-title">Save Condition</DialogTitle>
      <DialogContent id="save-condition-dialog-description">
        <TextField
          autoFocus
          margin="dense"
          label="Condition Name"
          fullWidth
          value={conditionName}
          onChange={handleNameChange}
          error={!!error}
          helperText={error}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button 
          onClick={handleSave} 
          color="primary" 
          variant="contained"
          disabled={!!error || !conditionName.trim()}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SaveConditionDialog;