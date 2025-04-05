import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { useConditionBuilder } from './ConditionBuilderContext';

interface PreviousConditionSelectorProps {
  selectedId: string | null;
  onChange: (id: string) => void;
}

const PreviousConditionSelector: React.FC<PreviousConditionSelectorProps> = ({ 
  selectedId, 
  onChange 
}) => {
  const { savedConditions, selectedTable } = useConditionBuilder();
  
  // Filter conditions for the current table
  const tableConditions = savedConditions.filter(
    condition => selectedTable && condition.tableId === selectedTable.id
  );
  
  const handleChange = (event: SelectChangeEvent) => {
    onChange(event.target.value);
  };
  
  return (
    <FormControl fullWidth>
      <InputLabel>Previous Condition</InputLabel>
      <Select
        value={selectedId || ''}
        onChange={handleChange}
        label="Previous Condition"
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
  );
};

export default PreviousConditionSelector;