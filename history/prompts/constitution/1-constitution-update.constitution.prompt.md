---
id: 1
title: Constitution Update
stage: constitution
date: 2025-12-26
surface: agent
model: Claude Sonnet 4.5
feature: none
branch: master
user: user
command: /sp.constitution
labels: [constitution,spec-driven-development,rag-chatbot]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - .specify/memory/constitution.md
 - .specify/templates/plan-template.md
 - .specify/templates/spec-template.md
 - .specify/templates/tasks-template.md
tests:
 - null
---

## Prompt

 /sp.constitution

Project: AI-Native Book with Integrated RAG Chatbot

Description:
Build a unified, AI-authored technical book using Spec-Kit Plus and Claude Code, published with Docusaurus and deployed to GitHub Pages, with an embedded Retrieval-Augmented Generation (RAG) chatbot capable of answering questions about the book's content, including context-limited answers based on user-selected text.

Core principles:
- Demo-first execution: prioritize a working, judge-visible system over theoretical completeness
- Spec-driven development: all outputs must align with explicit specs and contracts
- Accuracy grounded in source text: answers must derive strictly from book content
- Clarity for technical readers (software engineers, AI practitioners)
- Reliability over novelty: predictable behavior is preferred over experimental features
- Explainability: system behavior must be easy to explain during judging

Key standards:
- Book content must be generated and structured using Spec-Kit Plus workflows
- Claude Code is the primary authoring agent for book content
- All chapters must be:
  - Technically accurate
  - Internally consistent
  - Written for a developer audience
- The RAG chatbot must:
  - Answer questions using retrieved book content only
  - Clearly refuse or qualify answers when information is not present
  - Support answering based on user-selected text (selection-scoped RAG)
- No hallucinated facts outside the indexed book corpus
- Prompts and system behavior must be deterministic and auditable

Architecture constraints:
- Frontend: Docusaurus (static site)
- Deployment: GitHub Pages
- Backend: FastAPI
- Vector database: Qdrant Cloud (Free Tier)
- Metadata / state: Neon Serverless Postgres
- AI orchestration: OpenAI Agents / ChatKit SDKs
- Indexing granularity: chapter- or section-level chunks with clear source attribution

Data & retrieval rules:
- All chatbot answers must cite the originating chapter or section
- Retrieval must prioritize:
  1. User-selected text (if provided)
  2. Most semantically relevant book sections
- No external web search or non-book knowledge allowed at runtime

Constraints:
- Scope limited to a single coherent book (no multi-book expansion)
- Chatbot latency must be acceptable for live demo (<5s typical response)
- System must run reliably on free-tier services
- No manual post-processing of AI-generated content during demo

Success criteria:
- Book is fully published and accessible via GitHub Pages
- RAG chatbot is embedded directly in the book UI
- Chatbot correctly answers questions about the book content
- Chatbot correctly limits answers to selected text when provided
- Clear demo narrative: "AI wrote the book → AI understands the book"
- Judges can easily understand:
  - What was built
  - Why it matters
  - How AI and specs drive the system

Failure conditions:
- Chatbot hallucinating information not present in the book
- Broken deployment or inaccessible demo
- Overly complex architecture that cannot be explained clearly
- Missing integration between book content and chatbot retrieval

## Response snapshot

Updated the project constitution to reflect the AI-Native Book with Integrated RAG Chatbot project requirements. The constitution now includes six core principles: Demo-First Execution, Spec-Driven Development, Accuracy Grounded in Source Text, Clarity for Technical Readers, Reliability over Novelty, and Explainability. Added Architecture Constraints and Development Workflow sections with specific technology stack and implementation requirements. Updated related templates (.specify/templates/plan-template.md, .specify/templates/spec-template.md, .specify/templates/tasks-template.md) to align with the new constitution principles, including adding constitution checks to ensure all development work adheres to the established principles.

## Outcome

- ✅ Impact: Updated constitution to reflect project requirements and aligned templates for consistent application of principles
- 🧪 Tests: No tests required for constitution update
- 📁 Files: Updated constitution and 3 template files to maintain consistency
- 🔁 Next prompts: Ready to proceed with feature specification and planning
- 🧠 Reflection: Constitution now clearly defines project principles and constraints for all future development work

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): Not applicable
- Prompt variant (if applicable): Not applicable
- Next experiment (smallest change to try): Begin feature specification work aligned with new constitution