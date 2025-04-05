import React, { useState } from 'react';
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
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Save Condition</DialogTitle>
      <DialogContent>
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