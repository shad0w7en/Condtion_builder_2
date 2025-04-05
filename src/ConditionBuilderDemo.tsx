import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import ConditionBuilder from './components/ConditionBuilder';
import { SavedCondition } from './types';

const ConditionBuilderDemo: React.FC = () => {
  const [savedConditions, setSavedConditions] = useState<SavedCondition[]>([]);

  const handleConditionSaved = (condition: SavedCondition) => {
    setSavedConditions(prev => [...prev, condition]);
    console.log('Condition saved:', condition);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Build SQL-like conditions with a visual interface
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Click the button below to start building a condition. You can create complex conditions with AND/OR logic, 
        nested groups, and various data type validations.
      </Typography>
      
      <ConditionBuilder onConditionSaved={handleConditionSaved} />
      
      {savedConditions.length > 0 && (
        <Box mt={4}>
          <Typography variant="h6" gutterBottom>
            Saved Conditions
          </Typography>
          {savedConditions.map((condition, index) => (
            <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
              <Typography variant="subtitle1">{condition.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                SQL: {condition.sqlRepresentation}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default ConditionBuilderDemo;