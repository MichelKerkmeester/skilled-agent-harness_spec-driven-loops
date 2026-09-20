---
title: "Tasks: sk-design structural anomalies"
description: "Task breakdown for the four independent structural items: stub removal, missing benchmark index, .mjs relocation record, and two legitimate-absence records."
trigger_phrases:
  - "sk-design structural anomalies tasks"
  - "design-mcp-open-design loose executables tasks"
  - "compiled-routing missing index tasks"
  - "vestigial node_modules stub tasks"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/008-structural-anomalies"
    last_updated_at: "2026-07-27T19:00:00Z"
    last_updated_by: "structural-anomalies-executor"
    recent_action: "Relocated four Open Design transport modules into transport/ and updated all references"
    next_safe_action: "Remove the vestigial design-md-generator/node_modules stub (item 1, still Planned)"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-md-generator/node_modules/"
      - ".opencode/skills/sk-design/benchmark/reports/compiled-routing/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "structural-anomalies-session"
      parent_session_id: null
    completion_pct: 50
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->
# Tasks: sk-design structural anomalies
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

**Task Format**: `T### [P?] Description (file path) [effort]`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup [stub removal, ~10m]

- [ ] T001 [P] Confirm `design-md-generator/node_modules/` contains only `.vite/vitest/<empty-sha>/results.json` (`design-md-generator/node_modules/`) [3m]
- [ ] T002 Remove `design-md-generator/node_modules/` (`design-md-generator/node_modules/`) [2m]
- [ ] T003 Confirm `design-md-generator/backend/node_modules/` (the real install) is untouched (`design-md-generator/backend/node_modules/`) [3m]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation [benchmark index + `.mjs` relocation, ~110m]

**Item 2 — missing benchmark index (still Planned):**

- [ ] T004 [P] Read `benchmark/baseline/README.md` as the sibling format model (`benchmark/baseline/README.md`) [5m]
- [ ] T005 [P] List current run subdirectories under `benchmark/compiled-routing/` (`benchmark/compiled-routing/`) [3m]
- [ ] T006 Author `benchmark/compiled-routing/README.md` indexing those subdirectories (`benchmark/compiled-routing/README.md`) [10m]

**Item 3 — `.mjs` placement ruling and relocation (EXECUTED):**

- [x] T007 Read all four modules; establish kind, exports, and full repo-wide consumer map (`design-mcp-open-design/`) [20m]
- [x] T008 Read `create-skill/references/shared/overview.md` §2 and compare against `design-interface/corpus/`, `design-md-generator/backend/`, and `shared/corpus-context/` (`sk-doc/create-skill/`) [15m]
- [x] T009 Capture gate baselines before editing: 37/37 tests, `parent-skill-check` OK/0 warnings, `package_skill --check` PASS (`design-mcp-open-design/`) [10m]
- [x] T010 Rule on the merits: relocate all four to `transport/`, not `scripts/` (`spec.md` §7) [10m]
- [x] T011 Create `transport/` and move the four modules together (`design-mcp-open-design/transport/`) [5m]
- [x] T012 Repoint the three cross-boundary imports: `grounding-receipt.mjs` ×2 to `../../shared/corpus-context/`, `offline-gate.mjs` ×1 to `../fixtures/` (`transport/`) [5m]
- [x] T013 Repoint `fixtures/offline-fixtures.mjs` (2 imports) and `tests/transport-grounding.test.mjs` (4 imports) (`fixtures/`, `tests/`) [5m]
- [x] T014 Update `fixtures/README.md`, `tests/README.md`, and the hub `per-mode-consumers.md` paths (`design-mcp-open-design/`) [10m]
- [x] T015 Author `transport/README.md` matching the sibling code-README shape (`transport/README.md`) [10m]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification [record-only items + regression gates, ~20m]

- [x] T016 Confirm the two legitimate absences (`design-mcp-open-design/procedures/`, `design-motion/scripts/`) are recorded with no fix task attached (`spec.md`) [5m]
- [x] T017 Re-run all four gates and compare to the T009 baseline — all identical (`design-mcp-open-design/`) [5m]
- [x] T018 Diff each moved file against its `HEAD` content to prove only import-path lines changed (`transport/`) [5m]
- [x] T019 Repo-wide sweep for dangling references to the old root paths — zero hits on live surfaces (`.opencode/`) [5m]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All Phase 1-2 tasks marked `[x]` (items 1 and 2 remain Planned — outside this session's ownership)
- [ ] No `[B]` blocked tasks remaining on Phase 1-2
- [x] All Phase 3 and 3b tasks marked `[x]`
- [x] The `.mjs` placement question is ruled on the evidence and the reasoning is recorded in `spec.md` §7
- [x] The four `.mjs` files live under `transport/` with every reference updated and all gates at baseline
- [x] The two legitimate absences remain recorded with no fabricated fix
- [ ] Checklist.md fully verified for the items in scope
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->
