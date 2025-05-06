import React, { useState, ReactNode } from 'react';
import { 
  Box, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  TextField, 
  IconButton,
  Chip,
  Autocomplete,
  SelectChangeEvent,
  Button
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { SingleCondition, Operator, Column, ConditionValue, LogicalOperator } from '../../types';
import { useConditionBuilder } from './ConditionBuilderContext';
import * as XLSX from 'xlsx';

interface ConditionRowProps {
  condition: SingleCondition;
  parentGroupId: string;
  isReadOnly?: boolean;
}

const ConditionRow: React.FC<ConditionRowProps> = ({ 
  condition, 
  parentGroupId,
  isReadOnly = false 
}) => {
  const { selectedTable, updateCondition, removeCondition } = useConditionBuilder();
  const [valueType, setValueType] = useState<'value' | 'column'>(
    condition.value.type
  );
  
  // Get valid operators based on column type
  const getValidOperators = (column: Column): Operator[] => {
    switch (column.dataType) {
      case 'string':
        return ['=', '!=', 'LIKE', 'NOT LIKE', 'IN', 'NOT IN', 'IS'];
      case 'number':
      case 'integer':
        return ['=', '!=', '>', '>=', '<', '<=', 'BETWEEN', 'IN', 'NOT IN', 'IS'];
      case 'boolean':
        return ['=', 'IS'];
      case 'date':
        return ['=', '!=', '>', '>=', '<', '<=', 'BETWEEN', 'IS'];
      case 'enum':
        return ['=', '!=', 'IN', 'NOT IN', 'IS'];
      default:
        return ['=', '!=', 'IS'];
    }
  };
  
  // Get columns with the same data type for column comparison
  const getSameTypeColumns = (): Column[] => {
    if (!selectedTable || !condition.column) return [];
    
    return selectedTable.columns.filter(
      col => col.dataType === condition.column.dataType && col.name !== condition.column.name
    );
  };
  
  // When column changes, check if operator is still valid
  React.useEffect(() => {
    const validOperators = getValidOperators(condition.column);
    if (!validOperators.includes(condition.operator)) {
      updateCondition({
        ...condition,
        operator: validOperators[0],
        value: { type: 'value', value: '' }
      });
      setValueType('value');
    }
    // Ensure Mapping datatype always uses value type
    if (condition.column.dataType === 'Mapping' && valueType !== 'value') {
      setValueType('value');
      updateCondition({
        ...condition,
        value: { type: 'value', value: '' }
      });
    }
  }, [condition.column]);
  
  // Handle column change
  const handleColumnChange = (event: SelectChangeEvent) => {
    const columnName = event.target.value;
    const newColumn = selectedTable?.columns.find(col => col.name === columnName);
    
    if (newColumn) {
      const validOperators = getValidOperators(newColumn);
      updateCondition({
        ...condition,
        column: newColumn,
        operator: validOperators[0],
        value: { type: 'value', value: '' }
      });
      setValueType('value');
    }
  };
  
  // Handle operator change
  const handleOperatorChange = (event: SelectChangeEvent) => {
    const newOperator = event.target.value as Operator;
    
    // For IS operator, set initial value to NULL
    const newValue: ConditionValue = newOperator === 'IS'
      ? { type: 'value', value: 'NULL' }
      : condition.value;
    
    updateCondition({
      ...condition,
      operator: newOperator,
      value: newValue
    });
  };
  
  // Handle value type change (value, column)
  const handleValueTypeChange = (event: SelectChangeEvent) => {
    const newValueType = event.target.value as 'value' | 'column';
    setValueType(newValueType);
    
    // Reset value based on new type
    let newValue: ConditionValue;
    
    switch (newValueType) {
      case 'column':
        newValue = { 
          type: 'column', 
          value: null, 
          columnReference: undefined 
        };
        break;
      default:
        newValue = { type: 'value', value: '' };
    }
    
    updateCondition({
      ...condition,
      value: newValue
    });
  };
  
  // Handle basic value change
  const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateCondition({
      ...condition,
      value: {
        ...condition.value,
        value: event.target.value
      }
    });
  };
  
  // Handle column reference change
  const handleColumnReferenceChange = (event: SelectChangeEvent) => {
    updateCondition({
      ...condition,
      value: {
        ...condition.value,
        columnReference: event.target.value
      }
    });
  };
  
  // Handle BETWEEN values
  const handleBetweenValueChange = (index: number, value: string) => {
    // Convert the current value to an array for UI, but store as comma-separated string
    let betweenValues: string[] = [];
    if (typeof condition.value.value === 'string') {
      betweenValues = condition.value.value.split(',');
      if (betweenValues.length < 2) betweenValues = ['', ''];
    } else {
      betweenValues = ['', ''];
    }
    betweenValues[index] = value;
    updateCondition({
      ...condition,
      value: {
        ...condition.value,
        value: betweenValues.join(',')
      }
    });
  };
  
  // Handle IN values
  const handleInValueChange = (values: string[]) => {
    // Filter out empty strings
    const nonEmptyValues = values.filter(value => value.trim() !== '');
    updateCondition({
      ...condition,
      value: {
        ...condition.value,
        value: nonEmptyValues.join(',') // Convert array to comma-separated string
      }
    });
  };
  
  // Handle Excel file upload
  const handleExcelUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const fileData = e.target?.result;
        if (!fileData) return;

        const excelWorkbook = XLSX.read(fileData, { type: 'array' });
        const firstExcelSheet = excelWorkbook.Sheets[excelWorkbook.SheetNames[0]];
        
        // Convert sheet to JSON array
        const excelJsonData = XLSX.utils.sheet_to_json(firstExcelSheet, { header: 1 });
        
        // Get all non-empty values from all columns
        const values = excelJsonData
          .flat() // Flatten the array to handle multiple columns
          .filter((value): value is string | number => {
            // Convert numbers to strings and filter out empty values
            if (typeof value === 'number') return true;
            if (typeof value === 'string') return value.trim() !== '';
            return false;
          })
          .map(value => String(value).trim()); // Convert all values to strings and trim whitespace
        
        // Update the condition with the new values
        handleInValueChange(values);
      } catch (error) {
        console.error('Error reading Excel file:', error);
        // You might want to show an error message to the user here
      }
    };
    reader.readAsArrayBuffer(file);
  };
  
  // Handle enum value selection
  const handleEnumValueChange = (event: SelectChangeEvent<string[]>, child: ReactNode) => {
    const newValue = event.target.value;
    updateCondition({
      ...condition,
      value: {
        type: 'value',
        value: Array.isArray(newValue) ? newValue : [newValue]
      }
    });
  };
  
  // Handle delete condition
  const handleDeleteCondition = () => {
    if (condition.id) {
      removeCondition(condition.id, parentGroupId);
    }
  };
  
  // Render value input based on operator and column type
  const renderValueInput = () => {
    // If the operator is IS, show NULL/NOT NULL selection
    if (condition.operator === 'IS') {
      return (
        <FormControl fullWidth>
          <InputLabel>Value</InputLabel>
          <Select
            value={condition.value.value || ''}
            onChange={(event) => handleValueChange(event as any)}
            label="Value"
            disabled={isReadOnly}
          >
            <MenuItem value="NULL">NULL</MenuItem>
            <MenuItem value="NOT NULL">NOT NULL</MenuItem>
          </Select>
        </FormControl>
      );
    }
    
    // If value type is column reference
    if (valueType === 'column') {
      const sameTypeColumns = getSameTypeColumns();
      return (
        <FormControl fullWidth>
          <InputLabel>Column</InputLabel>
          <Select
            value={condition.value.columnReference || ''}
            onChange={handleColumnReferenceChange}
            label="Column"
            disabled={isReadOnly}
          >
            {sameTypeColumns.map(col => (
              <MenuItem key={col.name} value={col.name}>
                {col.displayName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      );
    }
    
    // Otherwise, render appropriate input based on operator and column type
    switch (condition.operator) {
      case 'BETWEEN':
        return (
          <Box display="flex" gap={1} alignItems="center" width="100%">
            <TextField
              label="From"
              type={condition.column.dataType === 'date' ? 'date' : 'text'}
              value={typeof condition.value.value === 'string' ? (condition.value.value.split(',')[0] || '') : ''}
              onChange={(e) => handleBetweenValueChange(0, e.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
              disabled={isReadOnly}
            />
            <TextField
              label="To"
              type={condition.column.dataType === 'date' ? 'date' : 'text'}
              value={typeof condition.value.value === 'string' ? (condition.value.value.split(',')[1] || '') : ''}
              onChange={(e) => handleBetweenValueChange(1, e.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
              disabled={isReadOnly}
            />
          </Box>
        );
        
      case 'IN':
      case 'NOT IN':
        if (condition.column.dataType === 'enum' && condition.column.enumValues) {
          return (
            <FormControl fullWidth>
              <InputLabel>Values</InputLabel>
              <Select<string[]>
                multiple
                value={typeof condition.value.value === 'string' ? condition.value.value.split(',').filter(v => v.trim() !== '') : []}
                onChange={(event) => handleEnumValueChange(event, null as unknown as React.ReactNode)}
                label="Values"
                disabled={isReadOnly}
                renderValue={(selected: string[]) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
              >
                {condition.column.enumValues.map(value => (
                  <MenuItem key={value} value={value}>
                    {value}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          );
        }
        
        return (
          <Box display="flex" flexDirection="column" gap={1} width="100%">
            <Autocomplete
              multiple
              freeSolo
              options={[]}
              value={typeof condition.value.value === 'string' ? condition.value.value.split(',').filter(v => v.trim() !== '') : []}
              onChange={(_, newValue) => handleInValueChange(newValue)}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    label={option}
                    {...getTagProps({ index })}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Values"
                  disabled={isReadOnly}
                  placeholder="Enter values or upload Excel"
                />
              )}
              disabled={isReadOnly}
            />
            <Button
              variant="outlined"
              component="label"
              startIcon={<CloudUploadIcon />}
              disabled={isReadOnly}
            >
              Upload Excel
              <input
                type="file"
                hidden
                accept=".xlsx,.xls"
                onChange={handleExcelUpload}
              />
            </Button>
          </Box>
        );
        
      default:
        // Special handling for Mapping datatype
        if (condition.column.dataType === 'Mapping') {
          return (
            <Box display="flex" gap={1} alignItems="center" width="100%">
              <TextField
                label="From"
                type="text"
                value={typeof condition.value.value === 'string' ? (condition.value.value.split(',')[0] || '') : ''}
                onChange={(e) => handleBetweenValueChange(0, e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
                disabled={isReadOnly}
              />
              <TextField
                label="To"
                type="text"
                value={typeof condition.value.value === 'string' ? (condition.value.value.split(',')[1] || '') : ''}
                onChange={(e) => handleBetweenValueChange(1, e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
                disabled={isReadOnly}
              />
            </Box>
          );
        }
        
        if (condition.column.dataType === 'enum' && condition.column.enumValues) {
          return (
            <FormControl fullWidth>
              <InputLabel>Value</InputLabel>
              <Select
                value={condition.value.value || ''}
                onChange={(event) => handleEnumValueChange(event, null)}
                label="Value"
                disabled={isReadOnly}
              >
                {condition.column.enumValues.map(value => (
                  <MenuItem key={value} value={value}>
                    {value}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          );
        }
        
        return (
          <TextField
            label="Value"
            type={condition.column.dataType === 'date' ? 'date' : 'text'}
            value={condition.value.value || ''}
            onChange={handleValueChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
            disabled={isReadOnly}
          />
        );
    }
  };
  
  return (
    <Box display="flex" gap={1} alignItems="center" width="100%">
      <FormControl sx={{ minWidth: 200 }}>
        <InputLabel>Column</InputLabel>
        <Select
          value={condition.column.name}
          onChange={handleColumnChange}
          label="Column"
          disabled={isReadOnly}
        >
          {selectedTable?.columns.map(column => (
            <MenuItem key={column.name} value={column.name}>
              {column.displayName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      
      <FormControl sx={{ minWidth: 120 }}>
        <InputLabel>Operator</InputLabel>
        <Select
          value={condition.operator}
          onChange={handleOperatorChange}
          label="Operator"
          disabled={isReadOnly}
        >
          {getValidOperators(condition.column).map(operator => (
            <MenuItem key={operator} value={operator}>
              {operator}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      
      {condition.operator !== 'IS' && condition.column.dataType !== 'Mapping' && (
        <FormControl sx={{ minWidth: 100 }}>
          <InputLabel>Type</InputLabel>
          <Select
            value={valueType}
            onChange={handleValueTypeChange}
            label="Type"
            disabled={isReadOnly}
          >
            <MenuItem value="value">Value</MenuItem>
            <MenuItem value="column">Column</MenuItem>
          </Select>
        </FormControl>
      )}
      
      <Box flex={1}>
        {renderValueInput()}
      </Box>
      
      {!isReadOnly && (
        <IconButton 
          onClick={handleDeleteCondition}
          sx={{ 
            color: 'error.main',
            '&:hover': {
              backgroundColor: 'rgba(211, 47, 47, 0.04)'
            }
          }}
        >
          <DeleteIcon />
        </IconButton>
      )}
    </Box>
  );
};

export default ConditionRow;