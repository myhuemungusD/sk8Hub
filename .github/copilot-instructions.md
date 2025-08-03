<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Sk8Hub Development Guidelines

## Project Overview

Sk8Hub is a modern skateboarding community hub application built with Next.js, TypeScript, and Tailwind CSS. The application serves as a platform for skateboarders to connect, share content, and discover skateboarding-related resources.

## Code Guidelines

- Use TypeScript for all code files
- Follow React best practices with functional components and hooks
- Use Tailwind CSS for styling with a mobile-first approach
- Implement responsive design patterns
- Use semantic HTML elements
- Follow accessibility (a11y) best practices

## Architecture Patterns

- Use the App Router architecture (Next.js 13+)
- Organize components in the `src/components` directory
- Keep pages in the `src/app` directory
- Use server components by default, client components when necessary
- Implement proper error boundaries and loading states

## Skateboarding Domain Context

When generating code, consider skateboarding-specific features like:

- Trick libraries and tutorials
- Spot/location sharing and reviews
- User profiles with skateboarding preferences
- Event and session planning
- Gear recommendations and reviews
- Progress tracking and achievements
- Community forums and discussions

## UI/UX Preferences

- Use a modern, clean design aesthetic
- Implement skateboarding-themed color schemes
- Include relevant iconography and imagery
- Prioritize mobile user experience
- Use smooth animations and transitions
