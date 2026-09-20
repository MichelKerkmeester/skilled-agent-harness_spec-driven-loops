---
title: "System Spec Kit"
description: "Unified spec-folder documentation and persistent context preservation: template-backed levels, validated structure and local-first searchable memory across AI sessions."
trigger_phrases:
  - "spec kit"
  - "spec folder"
  - "memory system"
  - "hybrid search"
  - "context preservation"
  - "documentation levels"
  - "memory save"
  - "spec folder workflow"
---

# System Spec Kit

> Documentation and memory for AI-assisted development. Every file change gets a spec folder. Every session gets persistent context.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Capturing why code changed and resuming that reasoning across sessions |
| **Invoke with** | "spec kit", "spec folder", "memory save", "speckit resume" or automatic Gate 3 routing |
| **Works on** | File-modifying AI conversations that need a documentation trail and cross-session memory |
| **Produces** | Templated spec folders at four levels, a validated file structure and a searchable local index |

---

## 2. OVERVIEW

### Why This Skill Exists

AI conversations that modify files leave no reasoning trail. The session ends and the why behind every decision vanishes. AI assistants also start every session from a blank slate, so the architecture you explained on Monday is gone by Wednesday. Without enforced documentation and a persistent memory, one session cannot build on another.

### What It Does

System Spec Kit captures every file-modifying conversation in a templated spec folder, indexed at one of four documentation levels matched to task complexity. The local SQLite index makes those decisions searchable across sessions using five fused retrieval channels, and `/speckit:resume` rebuilds the active context from the packet-local handover chain. `/memory:save` routes session updates into canonical documentation surfaces so the next session picks up where the last one left off, regardless of which AI model or tool you use.

### How This Compares

Manual documentation is ad hoc and inconsistent. Basic RAG offers vector similarity over a stateless index. System Spec Kit replaces both with templated spec folders at four levels, validated structure and a five-channel hybrid search fused via Reciprocal Rank Fusion. Context survives across sessions through a local indexed-continuity store rather than copy-paste from notes. Decay follows an FSRS power-law curve tuned by content type and importance, not a flat "remember everything" or naive exponential.

### Requirements

Requires Node.js >= 20.11, TypeScript 5.0+ and Bash 4.0+. Embeddings are local-first (ADR-014): the runtime probes Ollama first (default, `nomic-embed-text`, 768-dim), falls through to pure-Node hf-local and only escalates to OpenAI or Voyage when an API key is set and no local tier is available. The recommended new-user setup is installing Ollama and running `ollama pull nomic-embed-text:v1.5` — the cascade auto-detects it, no API keys required and all embeddings stay on-device.

<!-- HEADER SCHEME -->

| Section | Header | Recommendation | Rationale |
|---|---|---|---|
| 3 | QUICK START | Keep | Walks a reader from first spec folder to validation in one flow with real commands and expected output — the fastest path to a first result |
| 4 | FEATURES | Keep | The core reference catalog at 386 lines of verified capability depth — renaming to HOW IT WORKS would mislead readers expecting a single narrative lifecycle |
| 5 | STRUCTURE | Keep | File tree and key-file reference essential for navigating a 1084-line manual with multiple packages, scripts and references |
| 6 | CONFIGURATION | Keep | Stable environment-variable and MCP-configuration reference that operators consult repeatedly |
| 7 | USAGE EXAMPLES | Keep | Concrete walkthroughs that demonstrate the reference concepts in action — the bridge between the catalog and real sessions |
| 8 | TROUBLESHOOTING | Keep | Scenario-based error reference with causes, fixes and diagnostic commands — a predictable lookup surface |
| 9 | FAQ | Keep | Nine direct answers to the questions readers actually ask, including "why this instead of" and boundary clarifications |
```
