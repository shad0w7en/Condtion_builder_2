import React, { useState, useEffect } from 'react';
import { 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Typography, 
  Paper, 
  Divider,
  Tabs,
  Tab,
  Box
} from '@mui/material';
import { useConditionBuilder } from './ConditionBuilderContext';
import ConditionGroup from './ConditionGroup';
import SaveConditionDialog from './SaveConditionDialog';
import { SavedCondition } from '../../types';

interface BuilderInterfaceProps {
  onBack: () => void;
  onSave: (condition: SavedCondition) => void;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`output-tabpanel-${index}`}
      aria-labelledby={`output-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          {children}
        </Box>
      )}
    </div>
  );
};

const BuilderInterface: React.FC<BuilderInterfaceProps> = ({ onBack, onSave }) => {
  const { 
    selectedTable, 
    rootCondition, 
    generateSQL, 
    generateJSON, 
    saveCondition 
  } = useConditionBuilder();
  
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [sqlOutput, setSqlOutput] = useState('');
  const [jsonOutput, setJsonOutput] = useState('');
  
  useEffect(() => {
    setSqlOutput(generateSQL());
    setJsonOutput(generateJSON());
  }, [rootCondition, generateSQL, generateJSON]);
  
  const handleTabChange = (_: React.ChangeEvent<{}>, newValue: number) => {
    setTabValue(newValue);
  };
  
  const handleOpenSaveDialog = () => {
    setSaveDialogOpen(true);
  };
  
  const handleCloseSaveDialog = () => {
    setSaveDialogOpen(false);
  };
  
  const handleSaveCondition = async (name: string) => {
    try {
      const savedCondition = await saveCondition(name);
      setSaveDialogOpen(false);
      onSave(savedCondition);
    } catch (error) {
      console.error('Error saving condition:', error);
    }
  };
  
  return (
    <>
      <DialogTitle id="condition-builder-dialog-title">
        {selectedTable ? `Build Condition for ${selectedTable.displayName}` : 'Build Condition'}
      </DialogTitle>
      <DialogContent id="condition-builder-dialog-description">
        <Paper elevation={3} style={{ padding: '20px', marginBottom: '20px' }}>
          <Typography variant="h6" gutterBottom>
            Condition Builder
          </Typography>
          
          <ConditionGroup 
            group={rootCondition} 
            parentGroupId="" 
            level={0} 
          />
        </Paper>
        
        <Divider style={{ margin: '20px 0' }} />
        
        <Paper elevation={3}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            aria-label="condition output tabs"
          >
            <Tab label="SQL" />
            <Tab label="JSON" />
          </Tabs>
          
          <TabPanel value={tabValue} index={0}>
            <Typography variant="body2" component="pre" style={{ 
              backgroundColor: '#f5f5f5',
              padding: '10px',
              borderRadius: '4px',
              overflowX: 'auto',
              fontFamily: 'monospace'
            }}>
              {sqlOutput}
            </Typography>
          </TabPanel>
          
          <TabPanel value={tabValue} index={1}>
            <Typography variant="body2" component="pre" style={{ 
              backgroundColor: '#f5f5f5',
              padding: '10px',
              borderRadius: '4px',
              overflowX: 'auto',
              fontFamily: 'monospace'
            }}>
              {jsonOutput}
            </Typography>
          </TabPanel>
        </Paper>
      </DialogContent>
      <DialogActions>
        <Button onClick={onBack} color="primary">
          Back
        </Button>
        <Button 
          onClick={handleOpenSaveDialog} 
          color="primary" 
          variant="contained"
          disabled={rootCondition.conditions.length === 0}
          autoFocus
        >
          Save Condition
        </Button>
      </DialogActions>
      
      <SaveConditionDialog 
        open={saveDialogOpen}
        onClose={handleCloseSaveDialog}
        onSave={handleSaveCondition}
      />
    </>
  );
};

export default BuilderInterface;