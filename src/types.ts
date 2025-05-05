export interface Column {
    name: string;
    displayName: string;
    dataType: 'string' | 'number' | 'integer' | 'boolean' | 'date' | 'enum' | 'Mapping';
    table: string;
    enumValues?: string[];
  }
  
  export interface Table {
    id: string;
    name: string;
    displayName: string;
    columns: Column[];
  }
  
  export type Operator = 
    | '=' | '!=' | '>' | '>=' | '<' | '<=' 
    | 'LIKE' | 'NOT LIKE' 
    | 'IN' | 'NOT IN' 
    | 'IS NULL' | 'IS NOT NULL' 
    | 'BETWEEN';
  
  export type LogicalOperator = 'AND' | 'OR';
  
  export interface ConditionValue {
    type: 'value' | 'column';
    value: any;
    columnReference?: string;
    columnDataType?: string;
  }
  
  // Base interface for all conditions
  export interface BaseCondition {
    id?: string; // Optional since it's only needed for UI state
  }
  
  export interface SingleCondition extends BaseCondition {
    type: 'condition';
    column: Column;
    operator: Operator;
    value: ConditionValue;
  }
  
  export interface ConditionGroup extends BaseCondition {
    type: 'group';
    logicalOperator: LogicalOperator;
    conditions: (SingleCondition | ConditionGroup)[];
  }
  
  // Union type for any condition
  export type Condition = SingleCondition | ConditionGroup;
  
  export interface SavedCondition {
    id: string;
    name: string;
    tableId: string;
    condition: ConditionGroup;
    sqlRepresentation: string;
    jsonRepresentation: string;
    createdAt: Date;
    updatedAt: Date;
  }
  