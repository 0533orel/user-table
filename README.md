# Dynamic User Management Dashboard

A high-performance, dynamic data management table built with React and TypeScript. This application demonstrates advanced state management patterns, strict typing, and rendering optimizations suitable for modern web applications.

## Overview

The goal of this project was to build a robust system allowing users to manage dynamic datasets. Unlike standard static tables, this application allows for the runtime modification of the data structure itself (adding/removing columns) while maintaining data integrity and high performance.

## Key Features

### Functional Capabilities
* **Dynamic Structure:** Users can add, rename, and remove columns dynamically.
* **Full CRUD Operations:** Complete Create, Read, Update, and Delete capabilities for both data rows and table columns.
* **Inline Editing:** Seamless transition between "Read Mode" and "Edit Mode" for efficient data entry.
* **System Protection:** Core columns (Name, Phone, ID) are flagged as "System Columns" and are protected from deletion or renaming to ensure data consistency.
* **Data Validation:**
    * Numeric-only enforcement for specific field types (Phone, ID).
    * Character limit constraints per column.
    * Duplicate column name prevention.

### Technical Highlights
* **Custom Hooks:** All business logic, state manipulation, and validation rules are encapsulated within a `useTableManager` hook, adhering to the Separation of Concerns principle.
* **Performance Optimization:**
    * **React.memo:** Implemented on the `TableRow` component to prevent unnecessary re-renders of existing rows when the table structure changes.
    * **useCallback:** utilized for all event handlers to maintain referential equality.
    * **useMemo:** Implemented for expensive calculations (e.g., real-time statistics).
* **Scoped Styling:** Uses CSS Modules to ensure style encapsulation and prevent class name collisions.

## Tech Stack

* **Core:** React 18+ (Functional Components)
* **Language:** TypeScript
* **Styling:** CSS Modules
* **Build Tool:** Vite / Create React App

## Project Structure

src/
├── components/
│   ├── UserTable/       # Main container and layout
│   ├── TableRow/        # Memoized row component
│   └── ColumnHeader/    # Header component with inline edit actions
├── hooks/
│   └── useTableManager.ts  # State logic and validation layer
├── types.ts             # Global TypeScript interfaces
├── App.tsx              # Application entry point
└── index.css            # Global styles and resets

## Installation and Setup

1.  **Clone the repository**
    git clone https://github.com/your-username/your-repo-name.git

2.  **Navigate to the project directory**
    cd your-repo-name

3.  **Install dependencies**
    npm install

4.  **Start the development server**
    npm start
    # or if using Vite:
    npm run dev

## Architecture Decisions

### Why use a Custom Hook?
The logic for managing a dynamic 2D grid (rows and columns) involves complex state updates. Extracting this to `useTableManager` keeps the UI components clean and purely presentational.

### Why React.memo?
In a table with potentially hundreds of rows, adding a single column shouldn't force every single cell to re-render. `React.memo` ensures that only rows with actual data changes are updated in the DOM.

### System Columns Implementation
To mimic real-world CRM requirements, the application implements a `isSystem` boolean flag in the Column interface. This acts as a guard clause in the delete/edit logic, preventing accidental structural damage.
