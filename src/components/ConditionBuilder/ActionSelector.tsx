import React, { useState } from 'react';
import { 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  List, 
  ListItemButton,
  ListItemText, 
  Divider,
  Typography
} from '@mui/material';
import { useConditionBuilder } from './ConditionBuilderContext';
import SelectConditionDialog from './SelectConditionDialog';
import { SavedCondition } from '../../types';

interface ActionSelectorProps {
  onCreateNew: () => void;
  onBack: () => void;
  onSelect?: (json: string, sql: string) => void;
}

const ActionSelector: React.FC<ActionSelectorProps> = ({ 
  onCreateNew, 
  onBack,
  onSelect
}) => {
  const { selectedTable, savedConditions, loadSavedCondition } = useConditionBuilder();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCondition, setSelectedCondition] = useState<SavedCondition | null>(null);
  
  const tableConditions = savedConditions.filter(
    c => selectedTable && c.tableId === selectedTable.id
  );
  
  const handleConditionClick = (condition: SavedCondition) => {
    setSelectedCondition(condition);
    loadSavedCondition(condition.id);
    setDialogOpen(true);
  };
  
  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedCondition(null);
  };
  
  const handleDialogConfirm = (json: string, sql: string) => {
    if (onSelect) {
      onSelect(json, sql);
    }
  };
  
  return (
    <>
      <DialogTitle id="condition-builder-dialog-title">
        {selectedTable ? `${selectedTable.displayName} Conditions` : 'Conditions'}
      </DialogTitle>
      <DialogContent id="condition-builder-dialog-description">
        <Button 
          variant="contained" 
          color="primary"
          fullWidth 
          onClick={onCreateNew}
          style={{ marginBottom: '20px' }}
          autoFocus
        >
          Create New Condition
        </Button>
        
        <Divider style={{ margin: '20px 0' }} />
        
        <Typography variant="h6">
          Select Condition
        </Typography>
        
        {tableConditions.length === 0 ? (
          <Typography variant="body2" color="textSecondary" style={{ padding: '10px 0' }}>
            No saved conditions for this table.
          </Typography>
        ) : (
          <List>
            {tableConditions.map((condition) => (
              <React.Fragment key={condition.id}>
                <ListItemButton onClick={() => handleConditionClick(condition)}>
                  <ListItemText 
                    primary={condition.name} 
                    secondary={
                      <Typography 
                        variant="body2" 
                        color="textSecondary" 
                        component="span"
                        style={{ 
                          display: 'block', 
                          whiteSpace: 'nowrap', 
                          overflow: 'hidden', 
                          textOverflow: 'ellipsis' 
                        }}
                      >
                        {condition.sqlRepresentation}
                      </Typography>
                    } 
                  />
                </ListItemButton>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        )}
      </DialogContent>
      
      <SelectConditionDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        onConfirm={handleDialogConfirm}
        condition={selectedCondition}
      />
    </>
  );
};

export default ActionSelector;