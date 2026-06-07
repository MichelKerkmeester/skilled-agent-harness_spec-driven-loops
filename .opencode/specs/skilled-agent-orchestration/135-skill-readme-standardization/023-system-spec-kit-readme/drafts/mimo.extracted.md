---
title: "System Spec Kit"
description: "Spec-folder documentation and persistent local memory for AI-assisted development, backed by a 37-tool MCP server with hybrid retrieval."
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

> Every file-modifying conversation gets a documented spec folder. Every session rebuilds context from what came before.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Enforcing spec-folder documentation on file changes, preserving decisions across AI sessions and searching project history by meaning |
| **Invoke with** | "spec folder", "memory save", "context preservation" or auto-routing through the skill advisor |
| **Works on** | Any project where AI assistants modify files, using a local SQLite index with five-channel hybrid retrieval |
| **Produces** | Validated spec folders (levels 1 through 3+), persistent semantic memory across sessions and structured handover for the next conversation |

---

## 2. OVERVIEW

### Why This Skill Exists

AI conversations that modify files leave no durable reasoning trail. A feature gets built, the session ends, and the architecture decisions, trade-offs and "why" behind every change vanish. Your AI assistant also starts every session from a blank slate. You explained the auth flow on Monday and by Wednesday it has forgotten everything, so you explain it again.

### What It Does

System Spec Kit closes both gaps with a documentation-and-memory loop. A spec folder captures what changed and why for every file-modifying conversation, scaled to four documentation levels based on scope and risk. A local SQLite index makes those specs searchable across sessions and tools. The next conversation rebuilds context from packet-local sources through `/speckit:resume`, then persists new decisions through `/memory:save`.

The MCP server exposes 37 tools across five retrieval channels (vector, FTS5, BM25, causal graph, degree) fused with Reciprocal Rank Fusion. Your data stays on your machine.

### How This Compares

Manual documentation is ad hoc and inconsistent. Basic RAG offers vector similarity over a stateless index. System Spec Kit replaces both with templated spec folders at four levels, validated structure and a five-channel hybrid search fused via Reciprocal Rank Fusion. Context survives through persistent semantic memory and session recovery rather than copy-paste from notes. Quality control runs through a three-layer save gate, twenty-rule validation and DQI scoring. "Why" queries are answered by a causal graph with six relationship types. Forgetting follows an FSRS power-law decay tuned by content type and importance.

### Requirements

Requires Node.js >= 20.11, TypeScript 5.0+ and Bash 4.0+. Embeddings are local-first (ADR-014): the runtime probes Ollama first (default, `nomic-embed-text`, 768d), falls through to pure-Node hf-local, and only escalates to OpenAI or Voyage when an API key is set and no local tier is available. Install [Ollama](https://ollama.com) and run `ollama pull nomic-embed-text:v1.5` for a zero-config local setup.

---

## 3. QUICK START

Create a spec folder when an AI assistant asks "Which spec folder?" at Gate 3:

```bash
bash .opencode/skills/system-spec-kit/scripts/spec/create.sh 042-my-feature
```

Save session context when your work session ends:

```bash
node .opencode/skills/system-spec-kit/scripts/dist/memory/generate-context.js \
  --json '{"specFolder":"042-my-feature","user_prompts":["Implement login form validation"],"observations":["Added client-side validation for empty email and password"],"recent_context":["Touched auth form schema and submit handler"],"toolCalls":["npm test -- auth"]}' \
  specs/042-my-feature/
```

Resume the next session from where you left off:

```text
/speckit:resume 042-my-feature
```

---

## 4. FEATURES

### SPEC FOLDER WORKFLOWS

Creates mandatory documentation for every file-modifying conversation, scaled to four levels based on scope and risk. Templates resolve the files and sections each level needs. Twenty-rule validation with strict EVIDENCE-marker linting keeps folders honest.

### MEMORY SYSTEM

A 37-tool MCP server provides persistent semantic memory across sessions, models and tools. Five retrieval channels fuse with Reciprocal Rank Fusion. FSRS decay and six importance tiers (from constitutional, 3.0x boost and never-decay, through deprecated fastest) manage what stays prominent.

### COMMANDS AND SURFACES

`/memory:save` persists context. `/speckit:resume` rebuilds it. `validate.sh` checks structure. `generate-context.js` routes continuity updates into canonical packet docs. Phase decomposition supports parent and child folders for multi-session work.

### TEMPLATES AND CONTINUITY

Manifest template architecture where each level resolves the files and sections it needs. The handover recovery ladder reads `_memory.continuity` from `implementation-summary.md`, then rebuilds context from canonical spec docs.

### CONSTITUTIONAL MEMORY

Always-surface rules with a 3.0x boost that never decay. Shared memory with deny-by-default access for teams and multi-agent setups.

---

## 5. STRUCTURE

### KEY FILES

The skill root contains `SKILL.md` (runtime instructions), `README.md` (this file), `references/` (detailed guides), `scripts/` (CLI entrypoints), `templates/` (per-level scaffolds) and `mcp_server/` (the MCP tool surface).

### HOW THE PIECES CONNECT

Spec folders live under `specs/[###-name]/`. The MCP server stores indexed records in a local SQLite database. `generate-context.js` bridges the two: it reads structured JSON, writes to canonical packet docs and indexes into the memory store. `/speckit:resume` reads both surfaces to rebuild session context.

---

## 6. CONFIGURATION

### EMBEDDING PROVIDERS

Local-first cascade (ADR-014): Ollama (default, `nomic-embed-text`, 768d), hf-local (`@huggingface/transformers` HTTP model server), OpenAI, Voyage. The runtime probes in order and uses the first available.

### ENVIRONMENT VARIABLES

Feature flags control indexing targets, search behavior and daemon lifecycle. See `references/ENV_REFERENCE.md` for the full table. Key settings include `SPECKIT_INDEX_SPEC_DOCS` (toggle spec-doc indexing), `SPECKIT_SESSION_BOOST` (working-memory scoring) and `SPECKIT_CAUSAL_BOOST` (causal-neighbor retrieval).

### MCP CONFIGURATION

The server registers in `opencode.json` under the `mk-spec-memory` key. Tool families cover memory search and context, save, CRUD, health, index, embedding, causal graph, checkpoint, ingest, retention, session, task evaluation and learning.

---

## 7. TROUBLESHOOTING

### COMMON ISSUES

The daemon fails to start with E429 or -32001: the MCP front-proxy encountered a rate limit or connection error. Wait and retry, or check embedding provider availability.

`validate.sh` exits with code 2: structural errors in the spec folder. Run with `--verbose` to see which rules failed.

`/speckit:resume` returns stale context: run `/memory:save` first to refresh canonical continuity surfaces, then retry.

Embedding reconciliation shows missing vectors: run `memory_embedding_reconcile` with mode `apply` to fix status mismatches between the index and active vector coverage.

### DIAGNOSTICS

`memory_health` reports system health across all channels. `session_health` checks session readiness and context drift. `code_graph_status` verifies structural index freshness.

---

## 8. FAQ

**Q: How does this relate to Claude Memory or the MCP reference `memory` server?**

A: It does not. This is a local indexed-continuity store backed by SQLite. The identifiers (`memory_*` tools, `/memory:*` commands, `memory_*` SQL tables) are frozen by REQ-001 and belong to this skill alone.

**Q: What happens if I skip the spec folder?**

A: Gate 3 enforces the question before any file modification. You can choose Option D (Skip) for small changes, but the skill will not create a folder or index context without your approval.

**Q: Do I need Ollama?**

A: No. The embedding cascade falls through to hf-local, OpenAI or Voyage. Ollama is recommended because it keeps all embeddings on-device with no API key.

**Q: How do I share memory across a team?**

A: Shared memory uses deny-by-default access control. Configure tenant and user boundaries on save and search operations. The causal graph and constitutional memory are scoped per tenant.

---

## 9. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime instructions and routing logic |
| [`references/ARCHITECTURE.md`](./references/ARCHITECTURE.md) | System design, ADRs and embedding cascade |
| [`references/ENV_REFERENCE.md`](./references/ENV_REFERENCE.md) | Environment variables and feature flags |
| [`references/`](./references/) | Detailed guides for memory, search, validation and more |
| [`changelog/system-spec-kit/`](./../../changelog/system-spec-kit/) | Version history |

<!-- HEADER SCHEME -->

| # | Header | Status | Rationale |
|---|--------|--------|-----------|
| 3 | QUICK START | Keep | The template's standard section for fastest path to a first result. Already present as USAGE EXAMPLES, rename to match template convention. |
| 4 | FEATURES | Keep | More descriptive than HOW IT WORKS for a reference manual with five subsections spanning workflows, memory, commands, templates and constitutional rules. |
| 5 | STRUCTURE | Keep | Standard navigation section. The template maps to INTEGRATION AND NAVIGATION but for this reference manual, STRUCTURE covers file layout and piece-connection, which readers need earlier. |
| 6 | CONFIGURATION | Keep | Essential for a skill with embedding providers, env vars and MCP setup. No equivalent in the template's nine, so it earns its own numbered section. |
| 7 | TROUBLESHOOTING | Keep | The template's standard failure-mode section. Already present with predictable issues and diagnostics. |
| 8 | FAQ | Keep | Standard high-value-answers section. Already present with nine questions. Trim to the four most frequently asked. |
| 9 | RELATED DOCUMENTS | Keep | The template's standard link-out section. Already present with stable paths. |
