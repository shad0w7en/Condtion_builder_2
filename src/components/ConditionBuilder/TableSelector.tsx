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
import { mockTables } from '../../mockData';

interface TableSelectorProps {
  onTableSelected: () => void;
}

const TableSelector: React.FC<TableSelectorProps> = ({ onTableSelected }) => {
  const { setSelectedTable } = useConditionBuilder();
  const [selectedTableId, setSelectedTableId] = useState<string>('');
  
  const handleTableChange = (event: SelectChangeEvent) => {
    setSelectedTableId(event.target.value);
  };
  
  const handleNext = () => {
    const selectedTable = mockTables.find(table => table.id === selectedTableId);
    if (selectedTable) {
      setSelectedTable(selectedTable);
      onTableSelected();
    }
  };
  
  return (
    <>
      <DialogTitle>Select a Table</DialogTitle>
      <DialogContent>
        <FormControl fullWidth margin="normal">
          <InputLabel id="table-select-label">Table</InputLabel>
          <Select
            labelId="table-select-label"
            value={selectedTableId}
            onChange={handleTableChange}
            label="Table"
          >
            {mockTables.map(table => (
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