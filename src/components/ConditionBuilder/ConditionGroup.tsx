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
  Tooltip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import HistoryIcon from '@mui/icons-material/History';
import { useConditionBuilder } from './ConditionBuilderContext';
import { ConditionGroup as ConditionGroupType, SingleCondition, LogicalOperator } from '../../types';
import ConditionRow from './ConditionRow';
import PreviousConditionSelector from './PreviousConditionSelector';
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
    addGroup, 
    removeGroup, 
    updateGroupLogicalOperator,
    selectedTable,
    savedConditions,
    addPreviousCondition
  } = useConditionBuilder();
  
  const [previousConditionDialogOpen, setPreviousConditionDialogOpen] = useState(false);
  const [selectedPreviousConditionId, setSelectedPreviousConditionId] = useState<string | null>(null);
  
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
    setPreviousConditionDialogOpen(true);
  };

  const handlePreviousConditionSelect = (conditionId: string) => {
    setSelectedPreviousConditionId(conditionId);
  };

  const handlePreviousConditionConfirm = () => {
    if (selectedPreviousConditionId) {
      addPreviousCondition(group.id, selectedPreviousConditionId);
      setPreviousConditionDialogOpen(false);
      setSelectedPreviousConditionId(null);
    }
  };

  const handlePreviousConditionCancel = () => {
    setPreviousConditionDialogOpen(false);
    setSelectedPreviousConditionId(null);
  };
  
  const isRootGroup = group.id === 'root';
  
  return (
    <>
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
          <Box mr={1}>
            <FormControl size="small">
              <Select
                value={group.logicalOperator}
                onChange={handleLogicalOperatorChange}
                sx={{ minWidth: 100 }}
              >
                <MenuItem value="AND">AND</MenuItem>
                <MenuItem value="OR">OR</MenuItem>
              </Select>
            </FormControl>
          </Box>
          
          <Box flex={1} />
          
          <Box display="flex" gap={1}>
            <Tooltip title="Add Condition">
              <Button
                variant="outlined"
                size="small"
                startIcon={<AddIcon />}
                onClick={handleAddCondition}
                sx={{ 
                  borderRadius: '4px',
                  textTransform: 'none',
                  fontWeight: 500,
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                }}
              >
                Condition
              </Button>
            </Tooltip>
            
            <Tooltip title="Add Group">
              <Button
                variant="outlined"
                size="small"
                startIcon={<AddIcon />}
                onClick={handleAddGroup}
                sx={{ 
                  borderRadius: '4px',
                  textTransform: 'none',
                  fontWeight: 500,
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                }}
              >
                Group
              </Button>
            </Tooltip>
            
            <Tooltip title="Add Previous Condition">
              <Button
                variant="outlined"
                size="small"
                startIcon={<HistoryIcon />}
                onClick={handleAddPreviousCondition}
                disabled={!selectedTable || savedConditions.filter(c => c.tableId === selectedTable.id).length === 0}
                sx={{ 
                  borderRadius: '4px',
                  textTransform: 'none',
                  fontWeight: 500,
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                }}
              >
                Previous
              </Button>
            </Tooltip>
            
            {!isRootGroup && (
              <Tooltip title="Delete Group">
                <IconButton 
                  size="small" 
                  onClick={handleDeleteGroup}
                  sx={{ 
                    color: 'error.main',
                    '&:hover': {
                      backgroundColor: 'rgba(211, 47, 47, 0.04)'
                    }
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Box>

        {group.conditions.map((condition, index) => (
          <React.Fragment key={condition.id}>
            {index > 0 && <Box my={1} />}
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
          </React.Fragment>
        ))}
      </Paper>

      <Dialog 
        open={previousConditionDialogOpen} 
        onClose={handlePreviousConditionCancel}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Select Previous Condition</DialogTitle>
        <DialogContent>
          <Box mt={2}>
            <PreviousConditionSelector
              selectedId={selectedPreviousConditionId}
              onChange={handlePreviousConditionSelect}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePreviousConditionCancel}>Cancel</Button>
          <Button 
            onClick={handlePreviousConditionConfirm}
            variant="contained"
            disabled={!selectedPreviousConditionId}
          >
            Add Condition
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ConditionGroup;