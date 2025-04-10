export interface Column {
    name: string;
    displayName: string;
    dataType: 'string' | 'number' | 'integer' | 'boolean' | 'date' | 'enum';
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
  
  export interface SingleCondition {
    id: string;
    originalId?: string;
    column: Column;
    operator: Operator;
    value: ConditionValue;
    logicalOperator?: LogicalOperator;
    readonly?: boolean;
  }
  
  export interface ConditionGroup {
    id: string;
    originalId?: string;
    name?: string;
    type: 'group';
    logicalOperator: LogicalOperator;
    conditions: (SingleCondition | ConditionGroup)[];
    readonly?: boolean;
  }
  
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
  