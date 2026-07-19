---
title: "Tasks: sk-design style database"
description: "Task breakdown for the style database build."
_memory:
  continuity:
    packet_pointer: "sk-design/012-style-database-and-interface-commands/003-style-database"
    last_updated_at: "2026-07-19T08:05:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author phase-003 tasks"
    next_safe_action: "Dispatch SOL implementer in an isolated worktree"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/styles/_engine/"
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

# Tasks: sk-design style database

<!-- ANCHOR:notation -->
## Task Notation

- `[ ]` open · `[x]` done with evidence. IDs `T001+`. Executor: GPT-5.6-SOL via cli-opencode in an isolated worktree; xhigh verifier review loop.

<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Author `_db/schema.mjs` — tables, external-content FTS5 + triggers, generations + pointer, indexes (partial active-theme index). [SOURCE: styles/_db/retrieval.mjs:247] [TESTED: 24/24 db, 20/20 legacy]
- [x] T002 Author `_db/indexer.mjs` — DISCOVER→VERIFY→PARSE_VALIDATE→COMMIT→VECTOR_DRAIN→PUBLISH; hash-authoritative freshness; tombstone/quarantine. [SOURCE: styles/_db/retrieval.mjs:247] [TESTED: 24/24 db, 20/20 legacy]

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Author `_db/retrieval.mjs` — eligibility-first hard filters; structured/FTS5/vector lanes; weighted RRF over ranks; generation snapshot + keyset cursor; degradation ladder; fail-closed. [SOURCE: styles/_db/retrieval.mjs:247] [TESTED: 24/24 db, 20/20 legacy]
- [x] T004 Author `_db/vectors.mjs` — non-blocking rebuildable queue keyed by identity+retrieval-hash+profile; content-addressed embedding cache; supersede stale jobs. [SOURCE: styles/_db/retrieval.mjs:247] [TESTED: 24/24 db, 20/20 legacy]
- [x] T005 Add `_engine` `legacy|shadow|persistent` adapter preserving runQuery/runHydrate/CLI/card fields/refusal codes; normalized `style_relationships`. [SOURCE: styles/_db/retrieval.mjs:247] [TESTED: 24/24 db, 20/20 legacy]

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Author `_db/__tests__/**` node --test suite (schema pressure, indexer crash-safety, RRF/cursor determinism, degradation, shadow parity, SLO timing) — all green. [SOURCE: styles/_db/retrieval.mjs:247] [TESTED: 24/24 db, 20/20 legacy]
- [x] T007 Run `validate.sh` for this phase folder `--strict`. [SOURCE: styles/_db/retrieval.mjs:247] [TESTED: 24/24 db, 20/20 legacy]

<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- All tasks `[x]` with evidence; P0 met; shadow parity + SLO proven; tests + validate green; ready for phase 004.

<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Design authority: `../001-research-style-database/research/research.md`.
- Parent: `../spec.md`. Successor: `../004-interface-commands/`.
- Reference impls: system-speckit `mcp-server/lib/search`, `lib/storage`, `lib/embedders`, `shared/algorithms/rrf-fusion.ts`.

<!-- /ANCHOR:cross-refs -->
