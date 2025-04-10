import React, { createContext, useContext, useState, ReactNode } from 'react';
import { 
  Table, 
  ConditionGroup, 
  SingleCondition, 
  SavedCondition,
  LogicalOperator
} from '../../types';
import { v4 as uuidv4 } from 'uuid';

export interface ConditionBuilderConfig {
  tables: Table[];
  defaultOperators?: {
    string?: string[];
    number?: string[];
    integer?: string[];
    boolean?: string[];
    date?: string[];
    enum?: string[];
  };
  customOperators?: Record<string, string[]>;
  validationRules?: Record<string, (value: any) => boolean>;
}

interface ConditionBuilderContextType {
  selectedTable: Table | null;
  setSelectedTable: (table: Table | null) => void;
  
  rootCondition: ConditionGroup;
  setRootCondition: (condition: ConditionGroup) => void;
  
  savedConditions: SavedCondition[];
  setSavedConditions: (conditions: SavedCondition[]) => void;
  
  addCondition: (parentGroupId: string, condition: SingleCondition) => void;
  removeCondition: (conditionId: string, parentGroupId: string) => void;
  updateCondition: (condition: SingleCondition) => void;
  
  addGroup: (parentGroupId: string) => void;
  removeGroup: (groupId: string, parentGroupId: string) => void;
  updateGroupLogicalOperator: (groupId: string, operator: LogicalOperator) => void;
  
  addPreviousCondition: (parentGroupId: string, savedConditionId: string) => void;
  
  generateSQL: () => string;
  generateJSON: () => string;
  
  saveCondition: (name: string) => Promise<SavedCondition>;
  loadSavedCondition: (conditionId: string) => void;

  config: ConditionBuilderConfig;
}

const ConditionBuilderContext = createContext<ConditionBuilderContextType | null>(null);

interface ConditionBuilderProviderProps {
  children: ReactNode;
  config: ConditionBuilderConfig;
  savedConditions: SavedCondition[];
}

export const ConditionBuilderProvider: React.FC<ConditionBuilderProviderProps> = ({ 
  children,
  config,
  savedConditions: initialSavedConditions
}) => {
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [rootCondition, setRootCondition] = useState<ConditionGroup>(() => ({
    id: 'root',
    type: 'group',
    logicalOperator: 'AND',
    conditions: []
  }));
  const [savedConditions, setSavedConditions] = useState<SavedCondition[]>(() => 
    Array.isArray(initialSavedConditions) ? initialSavedConditions : []
  );
  
  // Function to add a condition to a specific group
  const addCondition = (parentGroupId: string, condition: SingleCondition) => {
    setRootCondition(prevRoot => {
      const updateGroup = (group: ConditionGroup): ConditionGroup => {
        if (group.id === parentGroupId) {
          // If this is the first condition in the group, ensure it has the group's logical operator
          const isFirstCondition = group.conditions.length === 0;
          const newCondition = isFirstCondition ? {
            ...condition,
            id: `cond-${uuidv4()}`,
            logicalOperator: group.logicalOperator
          } : {
            ...condition,
            id: `cond-${uuidv4()}`
          };

          return {
            ...group,
            conditions: [...group.conditions, newCondition]
          };
        }
        
        return {
          ...group,
          conditions: group.conditions.map(cond => {
            if ('type' in cond && cond.type === 'group') {
              return updateGroup(cond);
            }
            return cond;
          })
        };
      };
      
      return updateGroup(prevRoot);
    });
  };
  
  // Function to remove a condition from a group
  const removeCondition = (conditionId: string, parentGroupId: string) => {
    setRootCondition(prevRoot => {
      const updateGroup = (group: ConditionGroup): ConditionGroup => {
        if (group.id === parentGroupId) {
          return {
            ...group,
            conditions: group.conditions.filter(cond => {
              if ('type' in cond && cond.type === 'group') {
                return cond.id !== conditionId;
              }
              return cond.id !== conditionId;
            })
          };
        }
        
        return {
          ...group,
          conditions: group.conditions.map(cond => {
            if ('type' in cond && cond.type === 'group') {
              return updateGroup(cond);
            }
            return cond;
          })
        };
      };
      
      return updateGroup(prevRoot);
    });
  };
  
  // Function to update an existing condition
  const updateCondition = (updatedCondition: SingleCondition) => {
    setRootCondition(prevRoot => {
      const updateConditionInGroup = (group: ConditionGroup): ConditionGroup => {
        return {
          ...group,
          conditions: group.conditions.map(cond => {
            if ('type' in cond && cond.type === 'group') {
              return updateConditionInGroup(cond);
            }
            if (cond.id === updatedCondition.id) {
              return updatedCondition;
            }
            return cond;
          })
        };
      };
      
      return updateConditionInGroup(prevRoot);
    });
  };
  
  // Function to add a new group
  const addGroup = (parentGroupId: string) => {
    const newGroup: ConditionGroup = {
      id: `group-${uuidv4()}`,
      type: 'group',
      logicalOperator: 'AND',
      conditions: []
    };
    
    setRootCondition(prevRoot => {
      const updateGroup = (group: ConditionGroup): ConditionGroup => {
        if (group.id === parentGroupId) {
          return {
            ...group,
            conditions: [...group.conditions, newGroup]
          };
        }
        
        return {
          ...group,
          conditions: group.conditions.map(cond => {
            if ('type' in cond && cond.type === 'group') {
              return updateGroup(cond);
            }
            return cond;
          })
        };
      };
      
      return updateGroup(prevRoot);
    });
  };
  
  // Function to remove a group
  const removeGroup = (groupId: string, parentGroupId: string) => {
    setRootCondition(prevRoot => {
      const updateGroup = (group: ConditionGroup): ConditionGroup => {
        if (group.id === parentGroupId) {
          return {
            ...group,
            conditions: group.conditions.filter(cond => {
              if ('type' in cond && cond.type === 'group') {
                return cond.id !== groupId;
              }
              return true;
            })
          };
        }
        
        return {
          ...group,
          conditions: group.conditions.map(cond => {
            if ('type' in cond && cond.type === 'group') {
              return updateGroup(cond);
            }
            return cond;
          })
        };
      };
      
      return updateGroup(prevRoot);
    });
  };
  
  // Function to update a group's logical operator
  const updateGroupLogicalOperator = (groupId: string, operator: LogicalOperator) => {
    setRootCondition(prevRoot => {
      const updateGroup = (group: ConditionGroup): ConditionGroup => {
        if (group.id === groupId) {
          return {
            ...group,
            logicalOperator: operator
          };
        }
        
        return {
          ...group,
          conditions: group.conditions.map(cond => {
            if ('type' in cond && cond.type === 'group') {
              return updateGroup(cond);
            }
            return cond;
          })
        };
      };
      
      return updateGroup(prevRoot);
    });
  };

  // Function to add a previous condition to a group
  const addPreviousCondition = (parentGroupId: string, savedConditionId: string) => {
    const savedCondition = savedConditions.find(c => c.id === savedConditionId);
    if (!savedCondition) return;
    
    // Create new IDs for rendering while preserving original IDs
    const createNewIds = (condition: any): any => {
      if (condition.type === 'group') {
        return {
          ...condition,
          id: `group-${uuidv4()}`, // New ID for rendering
          originalId: condition.id, // Preserve original ID
          conditions: condition.conditions.map(createNewIds)
        };
      } else {
        return {
          ...condition,
          id: `cond-${uuidv4()}`, // New ID for rendering
          originalId: condition.id // Preserve original ID
        };
      }
    };
    
    const conditionWithNewIds = createNewIds(savedCondition.condition);
    
    // Add the condition with new IDs to the parent group
    setRootCondition(prevRoot => {
      const updateGroup = (group: ConditionGroup): ConditionGroup => {
        if (group.id === parentGroupId) {
          return {
            ...group,
            conditions: [...group.conditions, conditionWithNewIds]
          };
        }
        
        return {
          ...group,
          conditions: group.conditions.map(cond => {
            if ('type' in cond && cond.type === 'group') {
              return updateGroup(cond);
            }
            return cond;
          })
        };
      };
      
      return updateGroup(prevRoot);
    });
  };

  // Helper function to format SQL values based on column type
  const formatSqlValue = (value: any, dataType: string): string => {
    if (value === null || value === undefined || value === '' || value === 'NULL') {
      return 'NULL';
    }
    
    switch (dataType) {
      case 'string':
      case 'date':
      case 'enum':
        return `'${value}'`;
      case 'number':
      case 'integer':
        return isNaN(Number(value)) ? 'NULL' : String(value);
      case 'boolean':
        return value ? 'TRUE' : 'FALSE';
      default:
        return String(value);
    }
  };
  
  // Recursive function to generate SQL for a condition group
  const generateSqlForGroup = (group: ConditionGroup): string => {
    if (group.conditions.length === 0) {
      return '';
    }
    
    const conditionsSql = group.conditions.map(condition => {
      if ('type' in condition && condition.type === 'group') {
        const nestedSql = generateSqlForGroup(condition);
        return nestedSql ? `(${nestedSql})` : '';
      } else {
        const singleCondition = condition as SingleCondition;
        const { column, operator, value } = singleCondition;
        
        let sqlValue = '';
        if (value.type === 'column' && value.columnReference) {
          // For column comparison, use the referenced column name
          sqlValue = value.columnReference;
        } else {
          // For regular values
          sqlValue = formatSqlValue(value.value, column.dataType);
        }
        
        let conditionSql = '';
        if (operator === 'BETWEEN' && Array.isArray(value.value)) {
          conditionSql = `${column.name} BETWEEN ${formatSqlValue(value.value[0], column.dataType)} AND ${formatSqlValue(value.value[1], column.dataType)}`;
        } else if (operator === 'IN' || operator === 'NOT IN') {
          const values = Array.isArray(value.value) ? value.value : [value.value];
          const formattedValues = values.map(v => formatSqlValue(v, column.dataType)).join(', ');
          conditionSql = `${column.name} ${operator} (${formattedValues})`;
        } else if (operator === 'IS NULL' || operator === 'IS NOT NULL') {
          conditionSql = `${column.name} ${operator}`;
        } else if (value.value === null || value.value === 'NULL') {
          conditionSql = `${column.name} IS NULL`;
        } else {
          conditionSql = `${column.name} ${operator} ${sqlValue}`;
        }
        
        return conditionSql;
      }
    }).filter(Boolean);
    
    // Join conditions with the group's logical operator
    return conditionsSql.join(` ${group.logicalOperator} `);
  };
  
  // Function to generate SQL from the current condition
  const generateSQL = (): string => {
    if (!selectedTable || rootCondition.conditions.length === 0) {
      return '';
    }
    
    const whereClause = generateSqlForGroup(rootCondition);
    return `SELECT * FROM ${selectedTable.name}${whereClause ? ` WHERE ${whereClause}` : ''}`;
  };
  
  // Function to generate JSON from the current condition
  const generateJSON = (): string => {
    const processCondition = (condition: any): any => {
      if (condition.type === 'group') {
        return {
          ...condition,
          id: condition.originalId || '', // Use original ID if exists, otherwise empty
          conditions: condition.conditions.map(processCondition)
        };
      } else {
        return {
          ...condition,
          id: condition.originalId || '' // Use original ID if exists, otherwise empty
        };
      }
    };

    const processedRoot = processCondition(rootCondition);
    return JSON.stringify(processedRoot, null, 2);
  };
  
  // Function to save a condition with a name
  const saveCondition = async (name: string): Promise<SavedCondition> => {
    const sql = generateSQL();
    const json = generateJSON();
    
    const newSavedCondition: SavedCondition = {
      id: `saved-${uuidv4()}`,
      name,
      tableId: selectedTable?.id || '',
      condition: rootCondition,
      sqlRepresentation: sql,
      jsonRepresentation: json,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // In a real app, you would save this to a backend
    setSavedConditions(prev => [...prev, newSavedCondition]);
    
    return newSavedCondition;
  };
  
  // Function to load a saved condition
  const loadSavedCondition = (conditionId: string) => {
    const condition = savedConditions.find(c => c.id === conditionId);
    if (condition) {
      setRootCondition(condition.condition);
    }
  };
  
  const value = {
    selectedTable,
    setSelectedTable,
    rootCondition,
    setRootCondition,
    savedConditions,
    setSavedConditions,
    addCondition,
    removeCondition,
    updateCondition,
    addGroup,
    removeGroup,
    updateGroupLogicalOperator,
    addPreviousCondition,
    generateSQL,
    generateJSON,
    saveCondition,
    loadSavedCondition,
    config
  };
  
  return (
    <ConditionBuilderContext.Provider value={value}>
      {children}
    </ConditionBuilderContext.Provider>
  );
};

export const useConditionBuilder = () => {
  const context = useContext(ConditionBuilderContext);
  if (!context) {
    throw new Error('useConditionBuilder must be used within a ConditionBuilderProvider');
  }
  return context;
};

export default ConditionBuilderProvider;