import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
} from '@mui/material';
import { useConditionBuilder } from './ConditionBuilderContext';
import ConditionGroup from './ConditionGroup';
import { SavedCondition } from '../../types';

interface SelectConditionDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (json: string, sql: string) => void;
  condition: SavedCondition | null;
}

const SelectConditionDialog: React.FC<SelectConditionDialogProps> = ({
  open,
  onClose,
  onConfirm,
  condition,
}) => {
  const { generateSQL, generateJSON } = useConditionBuilder();

  const handleConfirm = () => {
    const json = generateJSON();
    const sql = generateSQL();
    onConfirm(json, sql);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Select Condition</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          {condition && (
            <ConditionGroup
              group={condition.condition}
              parentGroupId="root"
              level={0}
              isReadOnly={true}
            />
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>No</Button>
        <Button onClick={handleConfirm} variant="contained" color="primary">
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SelectConditionDialog; 