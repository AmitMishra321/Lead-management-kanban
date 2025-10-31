# Lead Management Kanban Board

A modern, modular React application for managing sales leads with a drag-and-drop Kanban board interface. Built with a clean component architecture for maintainability and scalability.

## Features

- **Kanban Board**: Drag-and-drop leads between pipeline stages
- **Lead Management**: Create, edit, and delete leads with detailed information
- **Stage Management**: Customize pipeline stages with custom names
- **Dashboard View**: Quick overview of all leads in the system
- **Data Export**: Export all leads to CSV format
- **Persistent Storage**: Automatically saves all data to browser localStorage
- **Agent Assignment**: Assign leads to team members
- **Priority Tracking**: Categorize leads by priority levels
- **Search & Filter**: Easily find and organize leads

## Project Structure

\`\`\`
├── app.jsx                          # Main app entry point
├── constants/
│   └── config.js                   # Configuration, agents, priorities, stages
├── utils/
│   ├── storage.js                  # LocalStorage management hook
│   └── export.js                   # CSV export functionality
├── hooks/
│   └── useLeadManager.js           # Custom hook for lead business logic
├── context/
│   └── LeadContext.js              # React Context for global state
├── components/
│   ├── KanbanBoard.jsx             # Main board orchestrator
│   ├── ui/
│   │   ├── Input.jsx               # Reusable input component
│   │   ├── Select.jsx              # Reusable select component
│   │   ├── Modal.jsx               # Reusable modal component
│   │   └── ConfirmModal.jsx        # Confirmation modal
│   └── leads/
│       ├── LeadCard.jsx            # Individual lead card
│       ├── LeadFormModal.jsx       # Lead creation/edit form
│       ├── StageManagementModal.jsx # Stage management interface
│       └── DashboardView.jsx       # Dashboard overview
└── README.md                        # This file
\`\`\`

## Getting Started

### Prerequisites

- Node.js 14+ 
- React 18+
- A modern web browser with localStorage support

### Installation

1. Clone or download the project
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Start the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

4. Open your browser and navigate to `http://localhost:3000`

## Usage

### Creating a Lead

1. Click the "New Lead" button at the top of the page
2. Fill in the lead details (name, email, phone, agent, priority)
3. Click "Create Lead" to save

### Managing Leads

- **Edit**: Click the edit icon on any lead card to modify details
- **Delete**: Click the delete icon to remove a lead
- **Drag & Drop**: Drag leads between pipeline stages
- **Search**: Use the search box to filter leads by name or email

### Customizing Pipeline Stages

1. Click "Manage Stages" button
2. Add new stages with custom names
3. Delete existing stages (leads will be moved to the first stage)
4. Reorder stages by dragging

### Dashboard

Click the "Dashboard" tab to see a summary of all leads, including:
- Total lead count
- Leads by stage
- Leads by agent
- Leads by priority

### Exporting Data

Click "Export to CSV" to download all leads as a CSV file for use in spreadsheets or other tools.

## Component Architecture

### Core Components

- **KanbanBoard**: Main component that orchestrates the entire application
- **LeadCard**: Displays individual lead information with action buttons
- **LeadFormModal**: Form for creating and editing leads
- **StageManagementModal**: Interface for managing pipeline stages
- **DashboardView**: Overview dashboard showing lead statistics

### UI Components

Reusable, presentational components that can be used throughout the app:

- **Input**: Text input field with consistent styling
- **Select**: Dropdown select component
- **Modal**: Generic modal wrapper for forms and dialogs
- **ConfirmModal**: Confirmation dialog for destructive actions

### Hooks & Context

- **useLeadManager**: Custom hook encapsulating all lead management logic
- **useLocalStorage**: Hook for persisting state to browser storage
- **LeadContext**: React Context providing global state to all components

## Data Management

All data is stored in the browser's localStorage under the key `leads`. The application automatically syncs state changes to storage.

### Lead Object Structure

\`\`\`javascript
{
  id: string,           // Unique identifier
  name: string,         // Lead name
  email: string,        // Email address
  phone: string,        // Phone number
  stage: string,        // Current pipeline stage
  agent: string,        // Assigned team member
  priority: string,     // Priority level (Low, Medium, High)
  createdAt: number     // Creation timestamp
}
\`\`\`



### Best Practices

- Keep components focused and reusable
- Use the custom hooks for business logic
- Store global state in Context
- Use utility functions for common operations

