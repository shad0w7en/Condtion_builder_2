import React from 'react';
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

interface ActionSelectorProps {
  onCreateNew: () => void;
  onBack: () => void;
}

const ActionSelector: React.FC<ActionSelectorProps> = ({ onCreateNew, onBack }) => {
  const { selectedTable, savedConditions, loadSavedCondition } = useConditionBuilder();
  
  const tableConditions = savedConditions.filter(
    c => selectedTable && c.tableId === selectedTable.id
  );
  
  const handleEditCondition = (conditionId: string) => {
    loadSavedCondition(conditionId);
    onCreateNew();
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
          Previously Saved Conditions
        </Typography>
        
        {tableConditions.length === 0 ? (
          <Typography variant="body2" color="textSecondary" style={{ padding: '10px 0' }}>
            No saved conditions for this table.
          </Typography>
        ) : (
          <List>
            {tableConditions.map((condition) => (
              <React.Fragment key={condition.id}>
                <ListItemButton onClick={() => handleEditCondition(condition.id)}>
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
      <DialogActions>
        <Button onClick={onBack} color="primary">
          Back
        </Button>
      </DialogActions>
    </>
  );
};

export default ActionSelector;