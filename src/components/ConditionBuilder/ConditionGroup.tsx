import React, { useState } from 'react';
import { 
  Paper, 
  FormControl, 
  Select, 
  MenuItem, 
  IconButton,
  Box,
  Button,
  SelectChangeEvent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import HistoryIcon from '@mui/icons-material/History';
import { useConditionBuilder } from './ConditionBuilderContext';
import { ConditionGroup as ConditionGroupType, SingleCondition, LogicalOperator, SavedCondition } from '../../types';
import ConditionRow from './ConditionRow';
import { v4 as uuidv4 } from 'uuid';

interface ConditionGroupProps {
  group: ConditionGroupType;
  parentGroupId: string;
  level: number;
  onDelete?: () => void;
}

const ConditionGroup: React.FC<ConditionGroupProps> = ({ 
  group, 
  parentGroupId, 
  level,
  onDelete 
}) => {
  const { 
    addCondition, 
    removeCondition, 
    addGroup, 
    removeGroup, 
    updateGroupLogicalOperator,
    selectedTable,
    savedConditions,
    addPreviousCondition
  } = useConditionBuilder();
  
  const handleLogicalOperatorChange = (event: SelectChangeEvent<LogicalOperator>) => {
    updateGroupLogicalOperator(group.id, event.target.value as LogicalOperator);
  };
  
  const handleAddCondition = () => {
    if (!selectedTable || !selectedTable.columns.length) return;
    
    const newCondition: SingleCondition = {
      id: uuidv4(),
      column: selectedTable.columns[0],
      operator: '=',
      value: { type: 'value', value: '' }
    };
    
    addCondition(group.id, newCondition);
  };
  
  const handleAddGroup = () => {
    addGroup(group.id);
  };
  
  const handleDeleteGroup = () => {
    if (onDelete) {
      onDelete();
    } else if (parentGroupId) {
      removeGroup(group.id, parentGroupId);
    }
  };
  
  const handleAddPreviousCondition = () => {
    // Find the first saved condition for the current table
    const tableConditions = savedConditions.filter(c => c.tableId === selectedTable?.id);
    if (tableConditions.length > 0) {
      addPreviousCondition(group.id, tableConditions[0].id);
    }
  };
  
  const isRootGroup = group.id === 'root';
  
  return (
    <Paper 
      elevation={level === 0 ? 0 : 1} 
      sx={{ 
        padding: '10px', 
        marginTop: level > 0 ? '10px' : 0,
        border: level > 0 ? '1px solid #e0e0e0' : 'none',
        backgroundColor: level % 2 === 0 ? '#f9f9f9' : 'white'
      }}
    >
      <Box display="flex" alignItems="center" mb={1}>
        {!isRootGroup && (
          <Box mr={1}>
            (
          </Box>
        )}
        
        <FormControl sx={{ minWidth: 120, mr: 1 }}>
          <Select
            value={group.logicalOperator}
            onChange={handleLogicalOperatorChange}
            size="small"
          >
            <MenuItem value="AND">AND</MenuItem>
            <MenuItem value="OR">OR</MenuItem>
          </Select>
        </FormControl>
        
        {!isRootGroup && (
          <>
            <Box mr={1}>
              )
            </Box>
            <IconButton 
              size="small" 
              color="error" 
              onClick={handleDeleteGroup}
              sx={{ marginLeft: 'auto' }}
            >
              <DeleteIcon />
            </IconButton>
          </>
        )}
      </Box>
      
      {group.conditions.map((condition) => (
        <Box key={condition.id} mb={1}>
          {'type' in condition && condition.type === 'group' ? (
            <ConditionGroup 
              group={condition} 
              parentGroupId={group.id} 
              level={level + 1}
              onDelete={() => removeGroup(condition.id, group.id)}
            />
          ) : (
            <ConditionRow 
              condition={condition as SingleCondition} 
              parentGroupId={group.id} 
            />
          )}
        </Box>
      ))}
      
      <Box display="flex" gap={1} mt={2}>
        <Button 
          size="small" 
          variant="outlined" 
          startIcon={<AddIcon />} 
          onClick={handleAddCondition}
        >
          Add Condition
        </Button>
        <Button 
          size="small" 
          variant="outlined" 
          startIcon={<AddIcon />} 
          onClick={handleAddGroup}
        >
          Add Group
        </Button>
        <Button 
          size="small" 
          variant="outlined" 
          startIcon={<HistoryIcon />} 
          onClick={handleAddPreviousCondition}
        >
          Add Previous Condition
        </Button>
      </Box>
    </Paper>
  );
};

export default ConditionGroup;