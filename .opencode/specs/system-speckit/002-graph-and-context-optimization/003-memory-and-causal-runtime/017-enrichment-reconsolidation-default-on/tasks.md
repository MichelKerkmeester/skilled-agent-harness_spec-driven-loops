---
title: "Task Breakdown: Enrichment + Reconsolidation Default-On (Async)"
description: "Task breakdown for flipping enrichment/reconsolidation/quality-auto-fix to default-on with opt-out envs and async enrichment execution."
trigger_phrases:
  - "enrichment default on tasks"
  - "async enrichment task breakdown"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/017-enrichment-reconsolidation-default-on"
    last_updated_at: "2026-06-04T05:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Implemented flags + async enrichment; live-verified"
    next_safe_action: "Validate strict; commit and push"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "enrichment-default-on-session"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Task Breakdown: Enrichment + Reconsolidation Default-On (Async)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

`[ ]` open · `[x]` done · `[~]` in progress. IDs are `T0NN`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Scope the flag family + async design (sync call site, deferral/pending machinery).
- [x] T002 Create the 017 spec folder (Gate 3).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Flip `isSaveReconsolidationEnabled` / `isPostInsertEnrichmentEnabled` / `isQualityAutoFixEnabled` to `isFeatureEnabled`; update docstrings.
- [x] T004 Add `isPostInsertEnrichmentAsync` (default true; `SPECKIT_POST_INSERT_ENRICHMENT_SYNC` override).
- [x] T005 Add `async-background` reason + `buildDeferredEnrichmentResult` in post-insert.ts.
- [x] T006 Wire the async branch (setImmediate + deferred result) into the save path.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [~] T007 Build clean; full vitest suite green (fix fallout).
- [x] T008 Update `search-flags.vitest.ts` to the opt-out contract + async test.
- [ ] T009 Doc sweep (workflow) + apply README / skill-doc / ENV_REFERENCE updates.
- [ ] T010 Live MCP verify: default save defers enrichment; edge/entity appears shortly after; disable env opts out.
- [ ] T011 `validate.sh --strict` on the 017 packet; commit + push.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

All three flags default-on with opt-out envs; enrichment async by default; suite green; docs
reflect the new defaults; packet validates strict.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- spec.md (problem, scope, requirements R1–R6)
- plan.md (architecture, phases, rollback)
<!-- /ANCHOR:cross-refs -->
