# Condition Builder

A powerful React component for building complex database query conditions with a user-friendly interface.

## Features

- 🎯 Visual condition builder interface
- 📊 Support for multiple tables and columns
- 🔄 Dynamic operators based on data types
- 🎨 Customizable validation rules
- 📝 SQL and JSON condition representations
- 🔗 Nested condition groups with AND/OR logic
- 🎮 Type-safe with TypeScript
- 🎨 Modern and responsive UI

## Local Development Setup

This project is currently in local development and not published to any artifact repository. To use it in your project:

1. Clone the repository:
```bash
git clone [repository-url]
```

2. Copy the `src` directory into your project
3. Import the components and types as needed:
```tsx
import { ConditionBuilder } from './components/ConditionBuilder';
import { conditionBuilderConfig } from './config/tables';
import { SavedCondition } from './types';
```

## Quick Start

```tsx
import { ConditionBuilder } from './components/ConditionBuilder';
import { conditionBuilderConfig } from './config/tables';
import { SavedCondition } from './types';

const handleConditionSaved = (condition: SavedCondition) => {
  console.log('Saved condition:', condition);
};

function App() {
  return (
    <ConditionBuilder 
      config={conditionBuilderConfig}
      onConditionSaved={handleConditionSaved}
      buttonText="Open Condition Builder"
    />
  );
}
```

## Configuration

The Condition Builder requires a configuration object that defines your tables, operators, and validation rules:

```typescript
interface ConditionBuilderConfig {
  tables: Table[];
  defaultOperators: {
    [key: string]: Operator[];
  };
  validationRules?: {
    [key: string]: (value: any) => boolean;
  };
}
```

### Table Configuration

```typescript
interface Table {
  id: string;
  name: string;
  displayName: string;
  columns: Column[];
}

interface Column {
  name: string;
  displayName: string;
  dataType: 'string' | 'number' | 'integer' | 'boolean' | 'date' | 'enum';
  table: string;
  enumValues?: string[];
}
```

### Example Configuration

```typescript
const conditionBuilderConfig = {
  tables: [
    {
      id: '1',
      name: 'users',
      displayName: 'Users',
      columns: [
        { name: 'id', displayName: 'ID', dataType: 'integer', table: 'users' },
        { name: 'name', displayName: 'Name', dataType: 'string', table: 'users' },
        { name: 'email', displayName: 'Email', dataType: 'string', table: 'users' },
        { name: 'status', displayName: 'Status', dataType: 'enum', table: 'users', 
          enumValues: ['active', 'inactive', 'pending'] }
      ]
    }
  ],
  defaultOperators: {
    string: ['=', '!=', 'LIKE', 'NOT LIKE', 'IS NULL', 'IS NOT NULL'],
    number: ['=', '!=', '>', '>=', '<', '<=', 'BETWEEN', 'IS NULL', 'IS NOT NULL'],
    enum: ['=', '!=', 'IN', 'NOT IN', 'IS NULL', 'IS NOT NULL']
  },
  validationRules: {
    email: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  }
};
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `config` | `ConditionBuilderConfig` | Yes | Configuration object for tables, operators, and validation rules |
| `onConditionSaved` | `(condition: SavedCondition) => void` | No | Callback function when a condition is saved |
| `buttonText` | `string` | No | Custom text for the condition builder button |

## Saved Condition Type

```typescript
interface SavedCondition {
  id: string;
  name: string;
  tableId: string;
  condition: ConditionGroup;
  sqlRepresentation: string;
  jsonRepresentation: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## Usage Examples

### Basic Usage

```tsx
<ConditionBuilder 
  config={conditionBuilderConfig}
  onConditionSaved={(condition) => {
    // Handle the saved condition
    console.log(condition.sqlRepresentation);
  }}
/>
```

### With Custom Button Text

```tsx
<ConditionBuilder 
  config={conditionBuilderConfig}
  buttonText="Create New Filter"
  onConditionSaved={handleConditionSaved}
/>
```

## Development

### Prerequisites

- Node.js 16+
- npm or yarn

### Setup

```bash
# Clone the repository
git clone [repository-url]

# Install dependencies
npm install

# Start development server
npm run dev
```

### Building

```bash
npm run build
```

## Contributing



## License


