# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npx ampx sandbox` - Deploy backend

## Lint/Format Commands
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Code Standards
- TypeScript with strict mode enabled
- React functional components with hooks for state management
- AWS Amplify for authentication and storage
- ESLint + Prettier for code style enforcement

## Naming Conventions
- PascalCase for React components
- camelCase for variables, functions, and methods
- Descriptive function/variable names
- Type interfaces with `I` prefix or `Type` suffix

## Import Order
- React/external libraries first
- AWS services second
- Local components/utilities last

## Error Handling
- Use try/catch blocks with specific error handling
- Log meaningful error messages
- Provide user-friendly error states in UI