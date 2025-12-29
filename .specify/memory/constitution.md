<!--
Sync Impact Report:
- Version change: 1.0.0 → 1.1.0 (MINOR: New principle/section added and materially expanded guidance)
- Modified principles: [PRINCIPLE_1_NAME] → Demo-First Execution, [PRINCIPLE_2_NAME] → Spec-Driven Development, [PRINCIPLE_3_NAME] → Accuracy Grounded in Source Text, [PRINCIPLE_4_NAME] → Clarity for Technical Readers, [PRINCIPLE_5_NAME] → Reliability over Novelty, [PRINCIPLE_6_NAME] → Explainability
- Added sections: Architecture Constraints, Development Workflow
- Removed sections: None
- Templates requiring updates: ✅ .specify/templates/plan-template.md (Constitution Check updated), ✅ .specify/templates/spec-template.md (Success Criteria updated), ✅ .specify/templates/tasks-template.md (Constitution Alignment added)
- Follow-up TODOs: None
-->

# AI-Native Book with Integrated RAG Chatbot Constitution

## Core Principles

### Demo-First Execution
Prioritize a working, judge-visible system over theoretical completeness. All development efforts must focus on creating a functional demo that can be clearly presented and evaluated during judging.

### Spec-Driven Development
All outputs must align with explicit specs and contracts. Every feature, component, and system behavior must be defined in specifications before implementation begins.

### Accuracy Grounded in Source Text
All chatbot answers must derive strictly from book content. No hallucinated facts outside the indexed book corpus are allowed. Answers must cite the originating chapter or section.

### Clarity for Technical Readers
Content must be written for a developer audience (software engineers, AI practitioners) with clear, precise, and technically accurate information that serves the target audience effectively.

### Reliability over Novelty
Predictable behavior is preferred over experimental features. System must run reliably on free-tier services with acceptable performance (chatbot latency <5s typical response).

### Explainability
System behavior must be easy to explain during judging. The architecture and implementation must be straightforward enough that judges can easily understand what was built, why it matters, and how AI and specs drive the system.

## Architecture Constraints

- Frontend: Docusaurus (static site)
- Deployment: GitHub Pages
- Backend: FastAPI
- Vector database: Qdrant Cloud (Free Tier)
- Metadata / state: Neon Serverless Postgres
- AI orchestration: OpenAI Agents / ChatKit SDKs
- Indexing granularity: chapter- or section-level chunks with clear source attribution
- Scope limited to a single coherent book (no multi-book expansion)
- No manual post-processing of AI-generated content during demo

## Development Workflow

- Book content must be generated and structured using Spec-Kit Plus workflows
- Claude Code is the primary authoring agent for book content
- All chapters must be technically accurate, internally consistent, and written for a developer audience
- The RAG chatbot must answer questions using retrieved book content only, clearly refuse or qualify answers when information is not present, and support answering based on user-selected text (selection-scoped RAG)
- Retrieval must prioritize: 1) User-selected text (if provided), 2) Most semantically relevant book sections
- No external web search or non-book knowledge allowed at runtime

## Governance

All development must adhere to these constitutional principles. Changes to this constitution require explicit approval and documentation of the rationale. The system must meet all success criteria: book fully published on GitHub Pages, RAG chatbot embedded in book UI, chatbot correctly answers questions about book content, clear demo narrative showing "AI wrote the book → AI understands the book".

**Version**: 1.1.0 | **Ratified**: 2025-12-26 | **Last Amended**: 2025-12-26
