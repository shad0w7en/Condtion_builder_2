import { Table, SavedCondition } from './types';

export const mockTables: Table[] = [
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
      { name: 'created_at', displayName: 'Created At', dataType: 'date', table: 'users' }
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
  },
  {
    id: '3',
    name: 'products',
    displayName: 'Products',
    columns: [
      { name: 'id', displayName: 'ID', dataType: 'integer', table: 'products' },
      { name: 'name', displayName: 'Name', dataType: 'string', table: 'products' },
      { name: 'price', displayName: 'Price', dataType: 'number', table: 'products' },
      { name: 'category', displayName: 'Category', dataType: 'enum', table: 'products', enumValues: ['electronics', 'clothing', 'food', 'books', 'other'] },
      { name: 'in_stock', displayName: 'In Stock', dataType: 'boolean', table: 'products' }
    ]
  }
];

export const mockSavedConditions: SavedCondition[] = [
  {
    id: 'saved-1',
    name: 'Active Users',
    tableId: '1',
    condition: {
      type: 'group',
      logicalOperator: 'AND',
      conditions: [
        {
          type: 'condition',
          column: { name: 'status', displayName: 'Status', dataType: 'enum', table: 'users', enumValues: ['active', 'inactive', 'pending'] },
          operator: '=',
          value: { type: 'value', value: 'active' }
        }
      ]
    },
    sqlRepresentation: "SELECT * FROM users WHERE status = 'active'",
    jsonRepresentation: '{"type":"group","logicalOperator":"AND","conditions":[{"type":"condition","column":{"name":"status","displayName":"Status","dataType":"enum","table":"users","enumValues":["active","inactive","pending"]},"operator":"=","value":{"type":"value","value":"active"}}]}',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'saved-2',
    name: 'Recent High Value Orders',
    tableId: '2',
    condition: {
      type: 'group',
      logicalOperator: 'AND',
      conditions: [
        {
          type: 'condition',
          column: { name: 'created_at', displayName: 'Created At', dataType: 'date', table: 'orders' },
          operator: '>',
          value: { type: 'value', value: '2023-01-01' }
        },
        {
          type: 'condition',
          column: { name: 'amount', displayName: 'Amount', dataType: 'number', table: 'orders' },
          operator: '>',
          value: { type: 'value', value: 1000 }
        }
      ]
    },
    sqlRepresentation: "SELECT * FROM orders WHERE created_at > '2023-01-01' AND amount > 1000",
    jsonRepresentation: '{"type":"group","logicalOperator":"AND","conditions":[{"type":"condition","column":{"name":"created_at","displayName":"Created At","dataType":"date","table":"orders"},"operator":">","value":{"type":"value","value":"2023-01-01"}},{"type":"condition","column":{"name":"amount","displayName":"Amount","dataType":"number","table":"orders"},"operator":">","value":{"type":"value","value":1000}}]}',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];