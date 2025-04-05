import React, { useState } from 'react';
import { 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  SelectChangeEvent
} from '@mui/material';
import { useConditionBuilder } from './ConditionBuilderContext';

interface TableSelectorProps {
  onTableSelected: () => void;
}

const TableSelector: React.FC<TableSelectorProps> = ({ onTableSelected }) => {
  const { setSelectedTable, config } = useConditionBuilder();
  const [selectedTableId, setSelectedTableId] = useState<string>('');
  
  const handleTableChange = (event: SelectChangeEvent) => {
    setSelectedTableId(event.target.value);
  };
  
  const handleNext = () => {
    const selectedTable = config.tables.find(table => table.id === selectedTableId);
    if (selectedTable) {
      setSelectedTable(selectedTable);
      onTableSelected();
    }
  };
  
  return (
    <>
      <DialogTitle id="condition-builder-dialog-title">Select a Table</DialogTitle>
      <DialogContent id="condition-builder-dialog-description">
        <FormControl fullWidth margin="normal">
          <InputLabel id="table-select-label">Table</InputLabel>
          <Select
            labelId="table-select-label"
            value={selectedTableId}
            onChange={handleTableChange}
            label="Table"
            autoFocus
          >
            {config.tables.map(table => (
              <MenuItem key={table.id} value={table.id}>
                {table.displayName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button 
          disabled={!selectedTableId} 
          onClick={handleNext} 
          color="primary"
        >
          Next
        </Button>
      </DialogActions>
    </>
  );
};

export default TableSelector;