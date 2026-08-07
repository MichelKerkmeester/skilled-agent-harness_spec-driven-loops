---
title: "Feature Specification: Deep research — style database architecture"
description: "Ten-iteration deep research into how to give the 1,291-style sk-design library a real indexed database, mirroring the system-speckit sqlite+embeddings and system-deep-loop graph-DB patterns."
trigger_phrases:
  - "style database research"
  - "mirror speckit db for styles"
  - "style retrieval architecture"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "sk-design/012-sk-design-program/001-research/001-research-style-database"
    last_updated_at: "2026-07-22T16:57:27Z"

    last_updated_by: "spec-author"
    recent_action: "Author research-phase spec"
    next_safe_action: "Run /deep:research: 10 iterations, GPT-5.6-SOL HIGH fast"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/styles/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Deep research — style database architecture

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-19 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `012-style-database-and-interface-commands` |
| **Predecessor** | None |
| **Successor** | `002-research-design-commands` (next research phase); implementation is `003-style-database`, gated on this research |
| **Phase** | 1 of 4 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The 1,291-style library in `.opencode/skills/sk-design/styles/` is ~13k flat files with only a file-walking retrieval engine (`styles/_engine`, packet 011). It has no indexed query, no semantic "find styles like this", and no incremental sync — while the rest of the framework already runs on databases (`system-spec-kit` sqlite + embeddings; `system-deep-loop` runtime graph DBs). There is no agreed architecture for turning the flat library into a real database.

### Purpose

Run a bounded deep-research loop that produces a converged, evidence-backed recommendation for the style database: technology choice, schema, indexer/sync design, retrieval API, and the migration path from the flat folders — concrete enough for phase `003-style-database` to implement without re-deciding architecture.

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Study the `system-spec-kit` memory store (sqlite schema, embeddings, indexer, search API) and the `system-deep-loop` runtime graph DBs as reference implementations to mirror.
- Evaluate DB technology options (sqlite+embeddings, graph DB, hybrid) against the style library's shape and query needs.
- Recommend a schema, sync/indexer design, retrieval API surface, and a migration path from the flat folders — with a source-of-truth decision for the 13k files.

### Out of Scope

- Implementing the database (that is phase `003-style-database`).
- Re-extracting styles (packet 010 owns extraction; this consumes its output).

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `research.md` | Create | 001-research-style-database | Synthesized findings + convergence record |
| `implementation-summary.md` | Create | 001-research-style-database | Final recommendation and handoff to phase 003 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Grounded in real references | Every recommendation cites the actual reference implementations (`system-spec-kit` store, `system-deep-loop` graph DBs) or the style-library shape by path. |
| REQ-002 | Single converged recommendation | The synthesis names one recommended DB technology, schema, indexer, retrieval API, and migration/source-of-truth decision — not a menu. |
| REQ-003 | Migration path from flat files | The recommendation states how the 1,291 flat style folders become (or feed) the database, and what stays source-of-truth. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Options compared | sqlite+embeddings, graph DB, and hybrid are each weighed with explicit trade-offs against the style corpus's query needs. |
| REQ-005 | Engine integration seam | The recommendation states how retrieval wires into the existing `styles/_engine` so phase 003 has a concrete integration point. |
| REQ-006 | Convergence recorded | The loop records convergence (no material new findings across the final iterations) before synthesis. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- The deep-research loop converges (no material new findings) and records convergence.
- `implementation-summary.md` states a single recommended architecture with rationale and a migration path, ready for phase 003 to implement.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Dependency:** the flat style library (packet 010) and the `_engine` retrieval (packet 011) are the inputs.
- **Risk:** over-fitting to the speckit store when the style corpus has different query patterns — mitigate by evaluating options, not assuming.
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance

- The recommended design must address query latency and incremental sync over ~1,300 styles / ~13k files.

### Security

- No new external network surface; the style DB is local, mirroring the local speckit store.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which DB technology best fits the style corpus: sqlite+embeddings, graph, or hybrid? (The research answers this.)
- Do the flat style files remain source-of-truth with the DB as an index, or does the DB become authoritative?
<!-- /ANCHOR:questions -->
