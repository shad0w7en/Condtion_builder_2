import React, { useState } from 'react';
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
  Paper
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { SingleCondition, Operator, Column, ConditionValue, LogicalOperator } from '../../types';
import { useConditionBuilder } from './ConditionBuilderContext';

interface ConditionRowProps {
  condition: SingleCondition;
  parentGroupId: string;
  hideDelete?: boolean;
}

const ConditionRow: React.FC<ConditionRowProps> = ({ condition, parentGroupId, hideDelete }) => {
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
  const handleEnumValueChange = (event: SelectChangeEvent) => {
    updateCondition({
      ...condition,
      value: {
        ...condition.value,
        value: event.target.value
      }
    });
  };
  
  // Handle delete condition
  const handleDeleteCondition = () => {
    removeCondition(condition.id, parentGroupId);
  };
  
  if (condition.readonly) {
    return (
      <Paper 
        elevation={0}
        sx={{ 
          p: 2,
          mb: 1,
          backgroundColor: '#f8f9fa',
          border: '1px solid #e9ecef',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Box display="flex" alignItems="center">
          <Box 
            component="span" 
            sx={{ 
              color: 'text.secondary',
              mr: 1,
              fontSize: '0.875rem'
            }}
          >
            Condition:
          </Box>
          <Box 
            component="span" 
            sx={{ 
              fontWeight: 500,
              fontSize: '0.875rem'
            }}
          >
            {`${condition.column.displayName} ${condition.operator} ${condition.value.value}`}
          </Box>
        </Box>
        {!hideDelete && (
          <IconButton
            size="small"
            onClick={() => removeCondition(condition.id, parentGroupId)}
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
      </Paper>
    );
  }
  
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
            />
            <TextField
              label="To"
              type={condition.column.dataType === 'date' ? 'date' : 'text'}
              value={Array.isArray(condition.value.value) ? condition.value.value[1] || '' : ''}
              onChange={(e) => handleBetweenValueChange(1, e.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        );
        
      case 'IN':
      case 'NOT IN':
        if (condition.column.dataType === 'enum' && condition.column.enumValues) {
          return (
            <Autocomplete
              multiple
              options={condition.column.enumValues}
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
                  placeholder="Add values"
                />
              )}
            />
          );
        } else {
          return (
            <TextField
              label="Values (comma separated)"
              value={Array.isArray(condition.value.value) ? condition.value.value.join(', ') : condition.value.value || ''}
              onChange={(e) => handleInValueChange(e.target.value.split(',').map(v => v.trim()))}
              fullWidth
            />
          );
        }
          
      default:
        if (condition.column.dataType === 'boolean') {
          return (
            <FormControl fullWidth>
              <InputLabel>Value</InputLabel>
              <Select
                value={condition.value.value === null ? '' : String(condition.value.value)}
                onChange={(e) => updateCondition({
                  ...condition,
                  value: { ...condition.value, value: e.target.value === 'true' }
                })}
                label="Value"
              >
                <MenuItem value="true">True</MenuItem>
                <MenuItem value="false">False</MenuItem>
              </Select>
            </FormControl>
          );
        } else if (condition.column.dataType === 'enum' && condition.column.enumValues) {
          return (
            <FormControl fullWidth>
              <InputLabel>Value</InputLabel>
              <Select
                value={condition.value.value || ''}
                onChange={handleEnumValueChange}
                label="Value"
              >
                {condition.column.enumValues.map(value => (
                  <MenuItem key={value} value={value}>
                    {value}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          );
        } else if (condition.column.dataType === 'date') {
          return (
            <TextField
              label="Value"
              type="date"
              value={condition.value.value || ''}
              onChange={handleValueChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          );
        } else if (condition.column.dataType === 'integer' || condition.column.dataType === 'number') {
          return (
            <TextField
              label="Value"
              type="number"
              value={condition.value.value || ''}
              onChange={handleValueChange}
              fullWidth
            />
          );
        } else {
          return (
            <TextField
              label="Value"
              value={condition.value.value || ''}
              onChange={handleValueChange}
              fullWidth
            />
          );
        }
    }
  };
  
  if (!selectedTable) return null;
  
  return (
    <Box display="flex" alignItems="center" gap={1}>
      <FormControl size="small" sx={{ minWidth: 120 }} disabled={condition.readonly}>
        <InputLabel>Column</InputLabel>
        <Select
          value={condition.column.name}
          onChange={handleColumnChange}
          label="Column"
        >
          {selectedTable?.columns.map(column => (
            <MenuItem key={column.name} value={column.name}>
              {column.displayName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 120 }} disabled={condition.readonly}>
        <InputLabel>Operator</InputLabel>
        <Select
          value={condition.operator}
          onChange={handleOperatorChange}
          label="Operator"
        >
          {getValidOperators(condition.column).map(operator => (
            <MenuItem key={operator} value={operator}>
              {operator}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {condition.operator !== 'IS NULL' && condition.operator !== 'IS NOT NULL' && (
        <>
          <FormControl size="small" sx={{ minWidth: 120 }} disabled={condition.readonly}>
            <InputLabel>Value Type</InputLabel>
            <Select
              value={valueType}
              onChange={handleValueTypeChange}
              label="Value Type"
            >
              <MenuItem value="value">Value</MenuItem>
              <MenuItem value="column">Column</MenuItem>
            </Select>
          </FormControl>

          {valueType === 'value' ? (
            condition.operator === 'BETWEEN' ? (
              <Box display="flex" gap={1}>
                <TextField
                  size="small"
                  value={Array.isArray(condition.value.value) ? condition.value.value[0] : ''}
                  onChange={(e) => handleBetweenValueChange(0, e.target.value)}
                  disabled={condition.readonly}
                />
                <TextField
                  size="small"
                  value={Array.isArray(condition.value.value) ? condition.value.value[1] : ''}
                  onChange={(e) => handleBetweenValueChange(1, e.target.value)}
                  disabled={condition.readonly}
                />
              </Box>
            ) : condition.operator === 'IN' || condition.operator === 'NOT IN' ? (
              <Autocomplete
                multiple
                size="small"
                options={condition.column.enumValues || []}
                value={Array.isArray(condition.value.value) ? condition.value.value : []}
                onChange={(_, newValue) => handleInValueChange(newValue)}
                renderInput={(params) => <TextField {...params} />}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      label={option}
                      {...getTagProps({ index })}
                      onDelete={condition.readonly ? undefined : getTagProps({ index }).onDelete}
                    />
                  ))
                }
                disabled={condition.readonly}
              />
            ) : condition.column.dataType === 'enum' ? (
              <FormControl size="small" sx={{ minWidth: 120 }} disabled={condition.readonly}>
                <InputLabel>Value</InputLabel>
                <Select
                  value={condition.value.value}
                  onChange={handleEnumValueChange}
                  label="Value"
                >
                  {condition.column.enumValues?.map(value => (
                    <MenuItem key={value} value={value}>
                      {value}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              <TextField
                size="small"
                value={condition.value.value}
                onChange={handleValueChange}
                disabled={condition.readonly}
              />
            )
          ) : (
            <FormControl size="small" sx={{ minWidth: 120 }} disabled={condition.readonly}>
              <InputLabel>Column</InputLabel>
              <Select
                value={condition.value.columnReference || ''}
                onChange={handleColumnReferenceChange}
                label="Column"
              >
                {getSameTypeColumns().map(column => (
                  <MenuItem key={column.name} value={column.name}>
                    {column.displayName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </>
      )}

      {!condition.readonly && (
        <IconButton 
          size="small" 
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