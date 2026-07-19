---
title: "Feature Specification: sk-design style database + interface command redesign"
description: "Give sk-design a real indexed style database (mirroring system-speckit / deep-loop-runtime) and rebuild the design commands into genuinely useful creation prompts under an /interface namespace."
trigger_phrases:
  - "style database"
  - "design command overhaul"
  - "interface commands"
  - "mirror system-speckit db for styles"
  - "design creation prompts"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/012-style-database-and-interface-commands"
    last_updated_at: "2026-07-19T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author phase-parent root goal for the style-DB + interface-command program"
    next_safe_action: "Align sk-design docs; final validate --recursive; commit + push"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/styles/"
      - ".opencode/commands/design/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Style-DB tech: sqlite+embeddings (memory-MCP model) vs graph DB (deep-loop model) vs hybrid"
      - "Final command set + names — the operator's five are a starting proposal, phase 002 may refine"
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT — root purpose + sub-phase map only; no plan/tasks/checklist/decision/impl-summary here (those live in child phase folders). -->

# Feature Specification: sk-design style database + interface command redesign

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Structure** | Phase Parent lean trio |
| **Priority** | P1 |
| **Status** | Complete — code (003/004) built + verified (tests pass); research (001/002) delivered its recommendations (001 ran 7 of 10; 002 GLM out of quota, SOL sole source) |
| **Created** | 2026-07-19 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | None; root packet under the design track |
| **Parent Packet** | `sk-design` |
| **Predecessor** | `sk-design/011-sk-design-styles-utilization` (file-based styles retrieval engine) |
| **Successor** | None |
| **Handoff Criteria** | Each research child converges and validates before its paired implementation child begins; each phase validates independently under `validate.sh` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Two parts of `sk-design` are underpowered for their job — actually helping a person create good designs.

**1. The style library is 13k flat files with no real database.** Packet 010 extracted **1,291 style folders** into `.opencode/skills/sk-design/styles/` (each ~10 files: DESIGN.md, tokens, tailwind, css-vars, provenance), and packet 011 added a file-walking retrieval engine (`styles/_engine`). But the rest of the framework already runs on real databases: `system-spec-kit` indexes spec docs and memory into a sqlite store (`mcp_server/database/speckit-eval.db`) with an embeddings schema for semantic search, and `system-deep-loop`'s runtime keeps graph databases (`council-graph-db`, `coverage-graph-db`). The style library has none of that — no indexed query, no semantic "find styles like X", no incremental sync. It is the largest structured dataset in `sk-design` and the only one still trapped in flat files.

**2. The design commands route but do not help create.** The five commands under `.opencode/commands/design/` (`interface`, `audit`, `foundations`, `motion`, `md-generator`) are thin routers: each resolves an execution mode and defers to the `sk-design` hub. They carry routing contracts, sibling discriminators, and preconditions — but no generative scaffolding. There is no structured design-brief intake, no exemplar-driven prompting, no scaffolded build flow of the kind Claude's design tooling, Open Design, and the aura.build skills provide. A user invoking `/design:interface` gets a router, not a design partner.

### Purpose

Stand up (1) a real indexed **style database** for the 1,291-style library, mirroring the sqlite+embeddings pattern `system-spec-kit` uses and the graph-DB pattern `system-deep-loop` uses, with semantic retrieval wired into the existing styles engine; and (2) a rebuilt **design command surface** under an `/interface` namespace whose prompts are genuine creation templates, modeled on Claude design / Open Design / aura.build patterns. The parent defines the child-phase map and high-level outcome only; every schema decision, prompt template, and verification lives in the child phase folders.

> **Phase-parent note:** This `spec.md` is the only authored markdown document at the parent level. The root stays lean: `spec.md`, `description.json`, `graph-metadata.json`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- A **style database** for the 1,291-style library: schema, indexer/sync from the flat folders, and a retrieval API (semantic + structured) wired into `styles/_engine`, following the `system-spec-kit` sqlite+embeddings and `system-deep-loop` graph-DB models.
- A **command namespace rename** `commands/design/` → `commands/interface/`, with per-file renames so the surface reads `/interface:design`, `/interface:design-audit`, `/interface:design-foundations`, `/interface:design-motion`, `/interface:design-md-creation`.
- A **command prompt redesign** so each command is a real creation template (brief intake, exemplar grounding, scaffolded build flow), modeled on Claude design, Open Design, and aura.build/skills — not a thin router.
- Two research phases that precede and drive the two implementation phases, run on the models the operator specified.

### Out of Scope

- Re-extracting or re-crawling refero styles (packet 010 owns extraction; this consumes its output).
- Changing the `sk-design` design judgment itself (mode taste, numeric laws, audit rubric) — the DB and commands serve those modes, they do not redefine them.
- Any migration of the repo-wide snake→hyphen naming program (tracked separately under `sk-doc`).

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.opencode/skills/sk-design/styles/**` (DB store + indexer + retrieval) | Create | 003-style-database | Indexed style database + sync from the flat library, wired into `_engine` |
| `.opencode/skills/sk-design/styles/_engine/**` | Modify | 003-style-database | Point retrieval at the database backend |
| `.opencode/commands/design/` → `.opencode/commands/interface/` | Rename | 004-interface-commands | Namespace rename `design`→`interface` |
| `.opencode/commands/interface/{design,design-audit,design-foundations,design-motion,design-md-creation}.md` | Create/Rewrite | 004-interface-commands | Renamed + redesigned creation-template command prompts |
| `.opencode/skills/sk-design/command-metadata.json`, `hub-router.json` | Modify | 004-interface-commands | Command-surface registration for the new namespace |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> Phased decomposition. Each phase is an independently executable child spec folder; all plan/tasks/checklist/decisions/continuity live inside the children. The two research phases can run in parallel and each gates its paired implementation phase.

| Phase | Folder | Focus | Model / Effort | Status |
|-------|--------|-------|----------------|--------|
| 1 | `001-research-style-database/` | Deep research: mirror system-speckit sqlite+embeddings and deep-loop graph-DB patterns for the 1,291-style library (schema, indexing, retrieval, migration) | GPT-5.6-SOL, HIGH, fast — 10 iters (ran 7, converged) | **Complete** |
| 2 | `002-research-design-commands/` | Deep research: why the current commands don't help create designs; how Claude design / Open Design / aura.build/skills template prompts work; the redesigned command set + prompt scaffolding | GPT-5.6-SOL, HIGH fast — 20 iters (SOL; GLM lineage failed) | **Complete** |
| 3 | `003-style-database/` | Implement the style database + retrieval per phase 001 | GPT-5.6-SOL via cli-opencode | **Complete** (24/24 db, 20/20 legacy) |
| 4 | `004-interface-commands/` | Build the five /interface:* creation commands + shared contract + /design:* aliases per phase 002 | GPT-5.6-SOL via cli-opencode | **Complete** (16/16 tests, 4 checkers) |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before its successor begins.
- Research phases 001 and 002 are independent and may run concurrently.
- No implementation phase is authored until its paired research phase records a converged recommendation.
- Resume a specific phase with `/speckit:resume [parent]/[NNN-phase]/`; validate the whole program with `validate.sh --recursive` on the parent.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001 research | 003 style-database | Research converges on a recommended DB technology, schema, indexer/sync design, retrieval API, and a migration path from the flat library, with evidence | `research.md` synthesis + convergence log |
| 002 research | 004 interface-commands | Research converges on the final command set, names, and per-command creation-prompt templates grounded in Claude design / Open Design / aura.build patterns | `research.md` synthesis + convergence log |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- **Style-DB technology:** sqlite + embeddings (mirror the memory MCP), a graph DB (mirror deep-loop runtime), or a hybrid — resolved by phase 001.
- **Flat files vs DB:** do the 13k flat style files remain the source of truth with the DB as an index, get replaced by the DB, or become a build artifact — resolved by phase 001.
- **DB home + surface:** does the style DB live under `sk-design/styles/` or a dedicated mcp-server, and does it get its own MCP tool surface — resolved by phase 001.
- **Final command set + names:** the operator's five (`design`, `design-audit`, `design-foundations`, `design-motion`, `design-md-creation`) are the starting proposal; phase 002 may refine the set, names, or split/merge commands.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Predecessor:** `.opencode/specs/sk-design/011-sk-design-styles-utilization/` — the file-based `styles/_engine` retrieval this database backs.
- **Data source:** `.opencode/specs/sk-design/010-sk-design-styles-from-refero/` — the extraction that produced the 1,291-style library.
- **DB models:** `system-spec-kit` memory store (`mcp_server/database/`, embeddings schema) and `system-deep-loop` runtime graph DBs (`runtime/lib/council/council-graph-db.ts`, `runtime/lib/coverage-graph/coverage-graph-db.ts`).
- **Command research inputs:** Claude design template prompts, Open Design, and `https://www.aura.build/skills`.
- **Phase children:** sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md.
- **Graph Metadata:** `graph-metadata.json` (`derived.last_active_child_id` resume pointer).
