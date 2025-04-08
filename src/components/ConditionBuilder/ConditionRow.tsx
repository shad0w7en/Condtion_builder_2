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
  SelectChangeEvent
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { SingleCondition, Operator, Column, ConditionValue, LogicalOperator } from '../../types';
import { useConditionBuilder } from './ConditionBuilderContext';

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
        return ['=', '!=', 'LIKE', 'NOT LIKE', 'IN', 'NOT IN', 'IS NULL', 'IS NOT NULL'];
      case 'number':
      case 'integer':
        return ['=', '!=', '>', '>=', '<', '<=', 'BETWEEN', 'IN', 'NOT IN', 'IS NULL', 'IS NOT NULL'];
      case 'boolean':
        return ['=', 'IS NULL', 'IS NOT NULL'];
      case 'date':
        return ['=', '!=', '>', '>=', '<', '<=', 'BETWEEN', 'IS NULL', 'IS NOT NULL'];
      case 'enum':
        return ['=', '!=', 'IN', 'NOT IN', 'IS NULL', 'IS NOT NULL'];
      default:
        return ['=', '!=', 'IS NULL', 'IS NOT NULL'];
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
    
    // For NULL operators, we don't need a value
    const newValue: ConditionValue = (newOperator === 'IS NULL' || newOperator === 'IS NOT NULL')
      ? { type: 'value', value: null }
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
    const betweenValues = Array.isArray(condition.value.value) 
      ? [...condition.value.value] 
      : ['', ''];
    
    betweenValues[index] = value;
    
    updateCondition({
      ...condition,
      value: {
        ...condition.value,
        value: betweenValues
      }
    });
  };
  
  // Handle IN values
  const handleInValueChange = (values: string[]) => {
    updateCondition({
      ...condition,
      value: {
        ...condition.value,
        value: values
      }
    });
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
    removeCondition(condition.id, parentGroupId);
  };
  
  // Render value input based on operator and column type
  const renderValueInput = () => {
    // If the operator is IS NULL or IS NOT NULL, no value input is needed
    if (condition.operator === 'IS NULL' || condition.operator === 'IS NOT NULL') {
      return null;
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
              value={Array.isArray(condition.value.value) ? condition.value.value[0] || '' : ''}
              onChange={(e) => handleBetweenValueChange(0, e.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
              disabled={isReadOnly}
            />
            <TextField
              label="To"
              type={condition.column.dataType === 'date' ? 'date' : 'text'}
              value={Array.isArray(condition.value.value) ? condition.value.value[1] || '' : ''}
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
                value={Array.isArray(condition.value.value) ? condition.value.value : []}
                onChange={(event) => handleEnumValueChange(event, null)}
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
          <Autocomplete
            multiple
            freeSolo
            options={[]}
            value={Array.isArray(condition.value.value) ? condition.value.value : []}
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
              />
            )}
            disabled={isReadOnly}
          />
        );
        
      default:
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
      
      {condition.operator !== 'IS NULL' && condition.operator !== 'IS NOT NULL' && (
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