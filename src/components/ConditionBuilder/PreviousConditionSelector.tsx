import React, { useState } from 'react';
import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { useConditionBuilder } from './ConditionBuilderContext';
import SelectConditionDialog from './SelectConditionDialog';

interface PreviousConditionSelectorProps {
  selectedId: string | null;
  onChange: (id: string) => void;
  onSelect?: (json: string, sql: string) => void;
}

const PreviousConditionSelector: React.FC<PreviousConditionSelectorProps> = ({ 
  selectedId, 
  onChange,
  onSelect
}) => {
  const { savedConditions, selectedTable, loadSavedCondition } = useConditionBuilder();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCondition, setSelectedCondition] = useState<string | null>(null);
  
  // Filter conditions for the current table
  const tableConditions = savedConditions.filter(
    condition => selectedTable && condition.tableId === selectedTable.id
  );
  
  const handleChange = (event: SelectChangeEvent) => {
    const conditionId = event.target.value;
    setSelectedCondition(conditionId);
    onChange(conditionId);
    loadSavedCondition(conditionId);
    setDialogOpen(true);
  };
  
  const handleDialogClose = () => {
    setDialogOpen(false);
  };
  
  const handleDialogConfirm = (json: string, sql: string) => {
    if (onSelect) {
      onSelect(json, sql);
    }
    setDialogOpen(false);
  };
  
  return (
    <>
      <FormControl fullWidth>
        <InputLabel>Select Condition</InputLabel>
        <Select
          value={selectedId || ''}
          onChange={handleChange}
          label="Select Condition"
        >
          {tableConditions.length === 0 ? (
            <MenuItem disabled>No saved conditions available</MenuItem>
          ) : (
            tableConditions.map(condition => (
              <MenuItem key={condition.id} value={condition.id}>
                {condition.name}
              </MenuItem>
            ))
          )}
        </Select>
      </FormControl>
      
      <SelectConditionDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        onConfirm={handleDialogConfirm}
        condition={selectedCondition ? savedConditions.find(c => c.id === selectedCondition) || null : null}
      />
    </>
  );
};

export default PreviousConditionSelector;