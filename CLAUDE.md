# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Start Development Servers
```bash
# Start both frontend and backend servers concurrently
make dev

# Or start individually:
make dev-frontend  # Vite dev server on http://localhost:5173
make dev-backend   # LangGraph dev server on http://127.0.0.1:2024
```

### Backend Commands
```bash
cd backend
pip install .              # Install dependencies
langgraph dev              # Start LangGraph development server
python examples/cli_research.py "query"  # Run CLI research example
```

### Frontend Commands
```bash
cd frontend
npm install                # Install dependencies
npm run dev               # Start Vite development server
npm run build             # Build for production (TypeScript compile + Vite build)
npm run lint              # Run ESLint
npm run preview           # Preview production build
```

### Backend Linting/Testing
```bash
cd backend
ruff check .              # Run linting (configured in pyproject.toml)
pytest                    # Run tests (if any exist)
```

## Project Architecture

This is a fullstack research agent application with clear separation between frontend and backend:

### Backend: LangGraph Research Agent
- **Framework**: LangGraph + FastAPI with Google Gemini integration
- **Main Graph**: `backend/src/agent/graph.py` - Defines the research workflow as a state machine
- **Entry Point**: `backend/src/agent/app.py` - FastAPI application
- **Configuration**: `backend/langgraph.json` - LangGraph service configuration

#### Research Flow (State Machine):
1. `generate_query` → Generates initial search queries from user input using Gemini
2. `web_research` → Executes parallel web searches using Google Search API + Gemini
3. `reflection` → Analyzes results for knowledge gaps using structured output
4. `evaluate_research` → Routes to either more research or finalization
5. `finalize_answer` → Synthesizes final answer with citations

#### Key Backend Files:
- `state.py` - TypedDict definitions for graph state management
- `configuration.py` - Configurable parameters (models, loop limits, etc.)
- `tools_and_schemas.py` - Pydantic schemas for structured LLM outputs
- `prompts.py` - Prompt templates for different agent phases
- `utils.py` - Citation handling and URL resolution utilities

### Frontend: React + LangGraph SDK
- **Framework**: React 19 + Vite + TypeScript
- **Styling**: Tailwind CSS 4.x + Radix UI components (Shadcn)
- **LangGraph Integration**: `@langchain/langgraph-sdk/react` for streaming
- **Router**: React Router v7

#### Core Frontend Components:
- `App.tsx` - Main application with streaming integration and event processing
- `ChatMessagesView.tsx` - Message display with markdown support
- `ActivityTimeline.tsx` - Real-time research progress visualization
- `InputForm.tsx` - User input with configuration options
- `WelcomeScreen.tsx` - Initial interface before conversations

#### API Integration:
- Development: `http://localhost:2024` (LangGraph dev server)
- Production: `http://localhost:8123` (Docker compose setup)
- Streaming: Real-time agent events via LangGraph SDK

### Environment Setup
- Backend requires `GEMINI_API_KEY` in `backend/.env`
- Production deployment uses Docker with Redis + Postgres
- LangSmith integration available for monitoring

### State Management
The application uses LangGraph's state system with TypedDict classes:
- `OverallState` - Main graph state with accumulated research data
- `ReflectionState` - Decision state for research continuation
- `QueryGenerationState`, `WebSearchState` - Node-specific states

### Development Workflow
1. Backend changes trigger automatic reload via `langgraph dev`
2. Frontend uses Vite HMR for instant updates
3. Both services run concurrently during development
4. LangGraph Studio UI available for graph debugging and visualization