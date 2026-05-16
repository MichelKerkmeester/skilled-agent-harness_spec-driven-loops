---
title: "Tasks: Memory search Clusters 4-7 remediation"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "memory search clusters 4-7 tasks"
  - "causal-stats output hygiene tasks"
  - "folder discovery threshold tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/003-continuity-memory-runtime/006-search-clusters-4-7-remediation"
    last_updated_at: "2026-05-08T21:25:00Z"
    last_updated_by: "codex-gpt-5.5"
    recent_action: "Implemented Clusters 4-7 remediation and ran packet-focused verification"
    next_safe_action: "Resolve repo-wide Vitest baseline failures outside this packet if full-suite green is required"
    blockers: []
    key_files:
      - "plan.md"
      - "checklist.md"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/query-router.ts"
    session_dedup:
      fingerprint: "sha256:064afa1687c8c6cb6838c7eb061ce2a449a6d46d29a83a82d595f20746627a5b"
      session_id: "memory-clusters-4-7-2026-05-08"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Memory search Clusters 4-7 remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read authored packet spec (`spec.md`)
- [x] T002 [P] Read predecessor audit requirements (`../005-memory-search-runtime-bugs/spec.md`)
- [x] T003 [P] Read predecessor cluster plan (`../005-memory-search-runtime-bugs/plan.md`)
- [x] T004 [P] Read Level 2 templates (`.opencode/skills/system-spec-kit/templates/manifest/*.tmpl`)
- [x] T005 [P] Read live MCP handler/search surfaces before editing (`mcp_server/handlers`, `mcp_server/lib/search`)
- [x] T006 Author Level 2 plan (`plan.md`)
- [x] T007 Author Level 2 tasks (`tasks.md`)
- [x] T008 Author Level 2 checklist (`checklist.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T009 [P] Normalize memory causal graph stats relation output, health, and hints (`mcp_server/handlers/causal-graph.ts`)
- [x] T010 [P] Add per-relation coverage tracker (`mcp_server/lib/causal/relation-coverage.ts`)
- [x] T011 [P] Thread stable memory session id and cold-start hint policy (`mcp_server/handlers/memory-context.ts`)
- [x] T012 [P] Extend session dedup metadata to trigger and constitutional channels (`mcp_server/handlers/memory-search.ts`, `mcp_server/lib/search/session-state.ts`)
- [x] T013 [P] Add per-token folder-discovery threshold (`mcp_server/lib/search/folder-discovery.ts`)
- [x] T014 [P] Add CocoIndex daemon probe (`mcp_server/lib/cocoindex/daemon-probe.ts`)
- [x] T015 [P] Surface CocoIndex status from `memory_health` (`mcp_server/handlers/memory-crud-health.ts`)
- [x] T016 [P] Expose quality-gap fallback engagement in router/query plan (`mcp_server/lib/search/query-router.ts`, `mcp_server/handlers/memory-search.ts`)
- [x] T017 [P] Formalize intent classifier corpus exports/test surface (`mcp_server/lib/search/intent-classifier.ts`)
- [x] T018 [P] Document custom-answer routing, dedup behavior, and naming disambiguation (`commands/memory/search.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T019 [P] Add intent classifier corpus test (`mcp_server/tests/intent-classifier-corpus.vitest.ts`)
- [x] T020 [P] Add causal stats output schema test (`mcp_server/tests/causal-stats-output.vitest.ts`)
- [x] T021 [P] Add folder discovery threshold test (`mcp_server/tests/folder-discovery-threshold.vitest.ts`)
- [x] T022 [P] Add CocoIndex daemon probe test (`mcp_server/tests/cocoindex-daemon-probe.vitest.ts`)
- [x] T023 Run TypeScript compile (`node ../node_modules/typescript/lib/tsc.js --noEmit --composite false -p tsconfig.json`; requested `pnpm tsc --noEmit` wrapper failed because `tsc` is not linked in `mcp_server/node_modules/.bin`)
- [x] T024 Run full Vitest suite (`pnpm vitest run`; executed and failed on repo-wide baseline failures, see `implementation-summary.md`)
- [x] T025 Run strict spec validation (`validate.sh .../006-search-clusters-4-7-remediation --strict`)
- [x] T026 Author implementation summary (`implementation-summary.md`)
- [x] T027 Update packet metadata to complete (`description.json`, `graph-metadata.json`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] TypeScript compile clean
- [ ] Full Vitest suite passes with four new tests included
- [x] Strict spec validation exits 0
- [x] `implementation-summary.md` lists reqs closed and deferred
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Predecessor Audit**: See sibling `005-memory-search-runtime-bugs/spec.md`
- **Predecessor Cluster Plan**: See sibling `005-memory-search-runtime-bugs/plan.md`
<!-- /ANCHOR:cross-refs -->
