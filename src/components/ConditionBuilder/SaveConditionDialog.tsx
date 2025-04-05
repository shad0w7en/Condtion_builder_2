import React, { useState, useRef } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField 
} from '@mui/material';

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
  const [conditionName, setConditionName] = useState('');
  const [error, setError] = useState('');
  const dialogRef = useRef<HTMLDivElement>(null);
  
  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setConditionName(event.target.value);
    if (event.target.value.trim()) {
      setError('');
    }
  };
  
  const handleSave = () => {
    if (!conditionName.trim()) {
      setError('Please enter a name for the condition');
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
        <Button onClick={handleSave} color="primary" variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SaveConditionDialog;