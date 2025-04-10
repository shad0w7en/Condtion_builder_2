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
  Typography,
  IconButton,
  Box,
  Dialog
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useConditionBuilder } from './ConditionBuilderContext';
import { SavedCondition } from '../../types';

interface ActionSelectorProps {
  onCreateNew: () => void;
  onBack: () => void;
  onClose: () => void;
}

const ActionSelector: React.FC<ActionSelectorProps> = ({ onCreateNew, onBack, onClose }) => {
  const { selectedTable, savedConditions = [], loadSavedCondition } = useConditionBuilder();
  const [selectedCondition, setSelectedCondition] = useState<SavedCondition | null>(null);
  
  const tableConditions = savedConditions.filter(
    c => selectedTable && c.tableId === selectedTable.id
  );
  
  const handleSelectCondition = (condition: SavedCondition) => {
    setSelectedCondition(condition);
  };

  const handleConfirmUse = () => {
    if (selectedCondition) {
      loadSavedCondition(selectedCondition.id);
      setSelectedCondition(null);
      onClose();
    }
  };

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
                <ListItemButton onClick={() => handleSelectCondition(condition)}>
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
                  <IconButton 
                    edge="end" 
                    aria-label="edit"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditCondition(condition.id);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
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

      {/* Confirmation Dialog */}
      <Dialog
        open={!!selectedCondition}
        onClose={() => setSelectedCondition(null)}
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
      >
        <DialogTitle id="confirm-dialog-title">
          Use Selected Condition?
        </DialogTitle>
        <DialogContent>
          {selectedCondition && (
            <>
              <Typography variant="body1" gutterBottom>
                <strong>Name:</strong> {selectedCondition.name}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                <strong>SQL:</strong> {selectedCondition.sqlRepresentation}
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedCondition(null)} color="primary">
            Back
          </Button>
          <Button onClick={handleConfirmUse} color="primary" variant="contained">
            Use Condition
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ActionSelector;