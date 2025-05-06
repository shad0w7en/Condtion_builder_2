import { Table } from '../types';

// Define your project's tables
export const projectTables: Table[] = [
  {
    id: '1',
    name: 'users',
    displayName: 'Users',
    columns: [
      { name: 'id', displayName: 'ID', dataType: 'integer', table: 'users' },
      { name: 'name', displayName: 'Name', dataType: 'string', table: 'users' },
      { name: 'email', displayName: 'Email', dataType: 'string', table: 'users' },
      { name: 'age', displayName: 'Age', dataType: 'integer', table: 'users' },
      { name: 'status', displayName: 'Status', dataType: 'enum', table: 'users', enumValues: ['active', 'inactive', 'pending'] },
      { name: 'created_at', displayName: 'Created At', dataType: 'date', table: 'users' },
      { name: 'score_mapping', displayName: 'Score Mapping', dataType: 'Mapping', table: 'users' }
    ]
  },
  {
    id: '2',
    name: 'orders',
    displayName: 'Orders',
    columns: [
      { name: 'id', displayName: 'ID', dataType: 'integer', table: 'orders' },
      { name: 'user_id', displayName: 'User ID', dataType: 'integer', table: 'orders' },
      { name: 'amount', displayName: 'Amount', dataType: 'number', table: 'orders' },
      { name: 'status', displayName: 'Status', dataType: 'enum', table: 'orders', enumValues: ['pending', 'paid', 'shipped', 'delivered', 'cancelled'] },
      { name: 'created_at', displayName: 'Created At', dataType: 'date', table: 'orders' }
    ]
  }
];

// Define default operators for different data types
export const defaultOperators = {
  string: ['=', '!=', 'LIKE', 'NOT LIKE', 'IS'],
  number: ['=', '!=', '>', '>=', '<', '<=', 'BETWEEN', 'IS'],
  integer: ['=', '!=', '>', '>=', '<', '<=', 'BETWEEN', 'IS'],
  boolean: ['=', 'IS'],
  date: ['=', '!=', '>', '>=', '<', '<=', 'BETWEEN', 'IS'],
  enum: ['=', '!=', 'IN', 'NOT IN', 'IS'],
  Mapping: ['=', '!='],
};

// Define custom validation rules if needed
export const validationRules = {
  email: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  age: (value: number) => value >= 0 && value <= 120,
  amount: (value: number) => value >= 0
};

// Export the complete configuration
export const conditionBuilderConfig = {
  tables: projectTables,
  defaultOperators,
  validationRules
}; 