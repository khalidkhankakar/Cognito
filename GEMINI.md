# Boter (Cognito) - Project Context

Boter (referred to as Cognito in the UI) is a modern AI assistant application built with Next.js, React 19, and the Vercel AI SDK. It provides an interactive chat interface powered by Google's Gemini models and integrated with custom tools.

## Project Overview

- **Purpose:** A sophisticated AI dialogue and content creation platform.
- **Main Technologies:**
  - **Framework:** Next.js (App Router)
  - **Frontend:** React 19, Tailwind CSS 4
  - **AI Integration:** [Vercel AI SDK](https://sdk.vercel.ai/docs), `@ai-sdk/google`, `@ai-sdk/react`
  - **UI Components:** Radix UI, Shadcn UI, Lucide Icons
  - **Markdown Rendering:** `react-markdown`, `remark-gfm`, `rehype-katex`, `react-syntax-highlighter`
- **Architecture:**
  - **Frontend:** `components/chat/chat-page.tsx` uses the `useChat` hook from `@ai-sdk/react` to manage the chat state.
  - **Backend:** `app/api/chat/route.ts` handles POST requests, uses `streamText` to communicate with the Google AI model, and returns a stream of UI messages.
  - **Tools:** Custom tools are defined in `lib/tools.ts` (e.g., a weather tool).
  - **Models:** Model configuration and selection (persisted via cookies) are handled in `lib/models.ts` and `lib/constant.ts`.

## Building and Running

The project uses standard npm scripts:

- **Development:** `npm run dev` - Starts the development server at `http://localhost:3000`.
- **Build:** `npm run build` - Builds the application for production.
- **Start:** `npm run start` - Starts the production server.
- **Lint:** `npm run lint` - Runs ESLint for code quality checks.

## Recent Improvements & Bug Fixes
- **Unified Messaging:** Refactored `ChatTextarea.tsx` to prevent double-sending messages when files are attached.
- **Model Synchronization:** Re-enabled and improved model selection persistence between the client and server using cookies.
- **Security:** Migrated hardcoded API keys to environment variables (`RAPIDAPI_KEY`, `GOOGLE_GENERATIVE_AI_API_KEY`).
- **Memory Safety:** Optimized file preview handling to prevent object URL memory leaks.
- **Valid Model IDs:** Updated the system to use official Gemini model IDs (`gemini-1.5-flash`, `gemini-2.0-flash-exp`).

## Setup & Configuration
To run the project, ensure you have a `.env` file with the following keys:
- `GOOGLE_GENERATIVE_AI_API_KEY`: Your Google AI SDK key.
- `RAPIDAPI_KEY`: Required for the weather tool functionality.

## Key Files & Directories

- `app/api/chat/route.ts`: Core AI streaming logic.
- `components/chat/`: Contains components for the chat interface (`ChatPage`, `ChatMessages`, `ChatTextarea`).
- `lib/tools.ts`: Definitions for AI-callable tools.
- `lib/models.ts`: Utilities for managing model selection and persistence.
- `lib/constant.ts`: Application constants, including supported models.
- `components/markdown/`: Custom markdown rendering logic for AI responses.
