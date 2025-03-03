# Drive Storage - File Management System

A modern file storage and management application built with Next.js, React, and TypeScript. This application provides a user-friendly interface for uploading, organizing, and managing files and folders.

## Features

- **User Authentication**: Secure login and signup functionality
- **File Management**: Upload, view, download, and delete files
- **Folder Organization**: Create folders and organize files within them
- **Drag and Drop**: Intuitive drag and drop interface for file uploads and organization
- **Responsive Design**: Works seamlessly across desktop and mobile devices
- **Grid and List Views**: Toggle between different view modes for your files
- **File Details**: View and edit file details in a side panel

## Tech Stack

- **Frontend**:
  - Next.js 14
  - React 18
  - TypeScript
  - Tailwind CSS
  - shadcn/ui components
  - Zustand for state management
  - React Hook Form for form handling
  - Zod for validation

- **UI Components**:
  - Radix UI primitives
  - Lucide React icons
  - Tailwind CSS for styling
  - Tailwind Merge for class name merging
  - Class Variance Authority for component variants

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm, yarn, or bun package manager

### Installation

1. Install dependencies:
   ```bash
   bun install
   ```

2. Set up environment variables:
   Create a `.env.local` file in the root directory with the following variables:
   ```
   NEXT_PUBLIC_API_URL=<your-api-url>
   ```

3. Run the development server:
   ```bash
   bun dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

- `app/`: Next.js app directory with route groups
  - `(auth)/`: Authentication-related pages (login, signup)
  - `(dashboard)/`: Main application dashboard and file management
  - `api/`: API routes for server-side operations
- `components/`: Reusable React components
  - `ui/`: UI components from shadcn/ui
- `lib/`: Utility functions and API integration
  - `api.ts`: API client for backend communication
  - `files.ts`: File management state and operations
  - `auth.ts`: Authentication utilities
- `public/`: Static assets
- `styles/`: Global styles

## API Integration

The application integrates with a backend API for file storage and management. The API endpoints include:

- Authentication (login, signup, token refresh)
- File operations (upload, download, delete)
- Folder management (create, add/remove files)

## Development

### Commands

- `bun run dev`: Start the development server
- `bun run build`: Build the application for production
- `bun run start`: Start the production server
- `bun run lint`: Run ESLint to check for code quality issues

## License

[MIT](LICENSE)

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Zustand](https://github.com/pmndrs/zustand)
- [Radix UI](https://www.radix-ui.com/) 