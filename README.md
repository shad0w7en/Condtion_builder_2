# Condition Builder

A powerful React component for building complex database query conditions with a user-friendly interface. This component allows you to create, manage, and save complex database query conditions through an intuitive visual interface.

## Features

- 🎯 Visual condition builder interface
- 📊 Support for multiple tables and columns
- 🔄 Dynamic operators based on data types
- 🎨 Customizable validation rules
- 📝 SQL and JSON condition representations
- 🔗 Nested condition groups with AND/OR logic
- 🎮 Type-safe with TypeScript
- 🎨 Modern and responsive UI
- 💾 Save and load conditions
- 🔍 Preview SQL and JSON representations

## Local Development Setup

This project is currently in local development and not published to any artifact repository. To use it in your project:

1. Clone the repository:
```bash
git clone https://github.com/your-username/condition_builder_2.git
cd condition_builder_2/condition_builder
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. To use in another project, copy the following directories and files:
   - `src/components/ConditionBuilder/` - The main component and its subcomponents
   - `src/config/` - Configuration files
   - `src/types.ts` - TypeScript type definitions

5. Import the components and types in your project:
```tsx
import { ConditionBuilder } from './components/ConditionBuilder';
import { conditionBuilderConfig } from './config/tables';
import { SavedCondition } from './types';
```

## Project Structure

```
condition_builder/
├── src/
│   ├── components/
│   │   └── ConditionBuilder/
│   │       ├── index.tsx              # Main component
│   │       ├── ConditionBuilderContext.tsx  # Context provider
│   │       ├── BuilderInterface.tsx   # Main builder UI
│   │       ├── ConditionGroup.tsx     # Condition group component
│   │       ├── ConditionRow.tsx       # Individual condition row
│   │       ├── TableSelector.tsx      # Table selection component
│   │       ├── ActionSelector.tsx     # Action selection component
│   │       └── SaveConditionDialog.tsx # Save condition dialog
│   ├── config/
│   │   └── tables.ts                  # Table configurations
│   └── types.ts                       # TypeScript type definitions
```

## Quick Start

```tsx
import { ConditionBuilder } from './components/ConditionBuilder';
import { conditionBuilderConfig } from './config/tables';
import { SavedCondition } from './types';

const handleConditionSaved = (condition: SavedCondition) => {
  console.log('Saved condition:', condition);
  // You can:
  // - Store the condition in your database
  // - Use it to filter data
  // - Display it in your UI
  console.log('SQL:', condition.sqlRepresentation);
  console.log('JSON:', condition.jsonRepresentation);
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
| `initialSavedConditions` | `SavedCondition[]` | No | Array of previously saved conditions to initialize the builder with |

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

### Advanced Usage with Custom Validation

```tsx
const customConfig = {
  ...conditionBuilderConfig,
  validationRules: {
    ...conditionBuilderConfig.validationRules,
    age: (value: number) => value >= 0 && value <= 120,
    amount: (value: number) => value >= 0,
    customField: (value: string) => value.length >= 3
  }
};

<ConditionBuilder 
  config={customConfig}
  onConditionSaved={handleConditionSaved}
/>
```

### Using Multiple ConditionBuilders in the Same Project

You can use multiple ConditionBuilder instances in the same project, each with its own configuration, tables, and fields. Each instance maintains its own state and can be configured independently.

```tsx
// User table configuration
const userTableConfig = {
  tables: [
    {
      id: 'users',
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
    string: ['=', '!=', 'LIKE', 'NOT LIKE'],
    integer: ['=', '!=', '>', '<', '>=', '<='],
    enum: ['=', '!=', 'IN', 'NOT IN']
  }
};

// Order table configuration
const orderTableConfig = {
  tables: [
    {
      id: 'orders',
      name: 'orders',
      displayName: 'Orders',
      columns: [
        { name: 'order_id', displayName: 'Order ID', dataType: 'integer', table: 'orders' },
        { name: 'amount', displayName: 'Amount', dataType: 'number', table: 'orders' },
        { name: 'status', displayName: 'Order Status', dataType: 'enum', table: 'orders',
          enumValues: ['pending', 'completed', 'cancelled'] }
      ]
    }
  ],
  defaultOperators: {
    number: ['=', '!=', '>', '<', '>=', '<=', 'BETWEEN'],
    integer: ['=', '!=', '>', '<', '>=', '<='],
    enum: ['=', '!=', 'IN', 'NOT IN']
  }
};

const YourComponent = () => {
  const handleUserConditionSaved = (condition: SavedCondition) => {
    console.log('User filter condition:', condition);
    // Handle user filter condition
  };

  const handleOrderConditionSaved = (condition: SavedCondition) => {
    console.log('Order filter condition:', condition);
    // Handle order filter condition
  };

  return (
    <div>
      {/* Users Section */}
      <div>
        <h2>User Filters</h2>
        <ConditionBuilder 
          config={userTableConfig}
          buttonText="Configure User Filter"
          onConditionSaved={handleUserConditionSaved}
        />
      </div>

      {/* Orders Section */}
      <div>
        <h2>Order Filters</h2>
        <ConditionBuilder 
          config={orderTableConfig}
          buttonText="Configure Order Filter"
          onConditionSaved={handleOrderConditionSaved}
        />
      </div>
    </div>
  );
};
```

Key features when using multiple ConditionBuilders:

1. **Independent Configurations**: Each instance can have its own:
   - Tables and columns
   - Data types
   - Operators
   - Validation rules

2. **Separate State**: Each ConditionBuilder maintains its own state and won't interfere with other instances.

3. **Different Callbacks**: You can handle saved conditions differently for each instance.

4. **Custom Initial Conditions**: Each instance can have its own set of initial conditions:
```tsx
<ConditionBuilder 
  config={userTableConfig}
  initialSavedConditions={userSavedConditions}
  onConditionSaved={handleUserConditionSaved}
/>

<ConditionBuilder 
  config={orderTableConfig}
  initialSavedConditions={orderSavedConditions}
  onConditionSaved={handleOrderConditionSaved}
/>
```

5. **Custom UI**: Each instance can have its own button text and UI elements.

### Using Initial Saved Conditions

```tsx
const initialConditions = [
  {
    id: 'saved-1',
    name: 'Active Users',
    tableId: '1',
    condition: {
      id: 'group-1',
      type: 'group',
      logicalOperator: 'AND',
      conditions: [
        {
          id: 'cond-1',
          column: { name: 'status', displayName: 'Status', dataType: 'enum', table: 'users' },
          operator: '=',
          value: { type: 'value', value: 'active' }
        }
      ]
    },
    sqlRepresentation: "SELECT * FROM users WHERE status = 'active'",
    jsonRepresentation: '{"id":"group-1","type":"group","logicalOperator":"AND","conditions":[{"id":"cond-1","column":{"name":"status","displayName":"Status","dataType":"enum","table":"users"},"operator":"=","value":{"type":"value","value":"active"}}]}',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

<ConditionBuilder 
  config={conditionBuilderConfig}
  initialSavedConditions={initialConditions}
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
git clone https://github.com/your-username/condition_builder_2.git
cd condition_builder_2/condition_builder

# Install dependencies
npm install

# Start development server
npm run dev
```

### Building

```bash
npm run build
```

### Running Tests

```bash
npm test
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style and formatting
- Add tests for new features
- Update documentation as needed
- Use TypeScript for all new code
- Follow React best practices and hooks guidelines

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the GitHub repository or contact the maintainers.


