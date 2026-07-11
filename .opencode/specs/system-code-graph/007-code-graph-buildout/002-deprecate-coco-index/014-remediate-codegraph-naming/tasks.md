---
title: "Tasks: Remove residual ccc references from system-code-graph docs and align doc names to code-graph's own current naming [template:level_2/tasks.md]"
description: "Task Format: T### [P?] Description (file path) — one task per affected doc + grep/validate gates"
trigger_phrases:
  - "code-graph ccc residue tasks"
  - "ccc doc cleanup tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-code-graph/007-code-graph-buildout/002-deprecate-coco-index/014-remediate-codegraph-naming"
    last_updated_at: "2026-05-25T15:05:00Z"
    last_updated_by: "main-agent"
    recent_action: "Authored task list (one per doc)"
    next_safe_action: "Execute T004 onward"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "remediate-codegraph-naming-001"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Remove residual ccc references from system-code-graph docs and align doc names to code-graph's own current naming

<!-- SPECKIT_LEVEL: 2 -->

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

- [x] T001 Enumerate complete ccc residue across system-code-graph + verify each replacement target against the real tree
- [x] T002 Create Level-2 packet on main (`--skip-branch`)
- [x] T003 Author spec/plan/tasks
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P] `mcp_server/handlers/README.md` — `ccc-status/reindex/feedback.ts` → `status.ts`/`scan.ts`/`verify.ts`; drop "ccc bridge"/"ccc handlers" prose
- [x] T005 [P] `references/runtime/tool_surface.md` — removed 3 phantom `cccStatus/cccReindex/cccFeedback` → `lib/ccc/` rows + 3 phantom "structural" duplicate rows + `ccc_bridge_integration.md` cross-ref
- [x] T006 [P] `mcp_server/tools/README.md` — dropped `ccc_*` from tool list; ghost `…retired-search-telemetry-passthrough` → `code-graph-context-handler`
- [x] T007 [P] `mcp_server/lib/shared/README.md` — removed `retired-search-path.ts` rows + "Resolves the `ccc` binary path" + broken `getstructural searchBinaryPath` row
- [x] T008 [P] `mcp_server/tests/README.md` — ghost `…retired-search-telemetry-passthrough.vitest.ts` → real test
- [x] T009 [P] `mcp_server/tests/lib/README.md` — removed `shared/retired-search-path.ts` ref
- [x] T010 [P] `mcp_server/stress_test/code-graph/README.md` — "CCC bridge" prose + ghost `ccc-integration-stress.vitest.ts`
- [x] T011 `README.md` — handler-path table (`ccc-*.ts`→real), §3.5 reframed to INDEX LIFECYCLE, removed `ccc_bridge_integration.md` row, fixed semantic-runtime/bridge prose
- [x] T012 `SKILL.md` — removed `ccc_`/`ccc` keywords, dead `structural` INTENT_SIGNAL + resource block, `ccc_bridge_integration.md` refs (×3), phantom-tool garble (×4)
- [x] T013 `feature_catalog/feature_catalog.md` — removed `07--ccc-integration` section + ToC + table row, renumbered DOCTOR 9→8, fixed counts (17→14 features, 8→7 groups), phantom-tool garble
- [x] T014 `manual_testing_playbook/manual_testing_playbook.md` — removed `07--ccc-integration` section + ToC + table row, renumbered 14–18→13–17, fixed counts (19→16 scenarios)
- [x] T018 [expanded] `ARCHITECTURE.md` — reframed "structural search bridge" subsystem → Index lifecycle, fixed diagram + topology comment, dropped false sqlite-vec/semantic-runtime claims
- [x] T019 [expanded] `feature_catalog/mcp-tool-surface/01-tool-registrations.md` — phantom `code_graph_* and detect_changes` tool name
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T015 Grep gate: `rg -i ccc system-code-graph` (excl changelog + package-lock) == 0 ✅
- [x] T016 Link check: 0 refs to `07--ccc-integration`/`ccc_bridge_integration`/`retired-search-path`/`lib/ccc`; + full sweep (phantom tool, `structural search`, `getstructural`, semantic-runtime) == 0 ✅
- [x] T017 Verified replacement targets exist + ToC↔heading consistency (feature_catalog 1–8, playbook 1–17); `validate.sh --strict`; filled checklist + implementation-summary; refreshed metadata
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Grep gate returns 0 + validate clean
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Source of findings**: `../013-post-deprecation-deep-review/review/` (iters 5–7)
<!-- /ANCHOR:cross-refs -->
