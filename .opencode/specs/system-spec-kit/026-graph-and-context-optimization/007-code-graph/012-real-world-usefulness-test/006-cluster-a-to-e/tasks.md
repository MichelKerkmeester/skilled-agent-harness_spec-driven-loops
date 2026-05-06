---
title: "Tasks: Code Graph + Advisor + Hooks Polish"
description: "Task breakdown for Phase 026/007/012/006 clusters A-E."
trigger_phrases:
  - "026/007/012/006 tasks"
  - "cluster a to e tasks"
importance_tier: "critical"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Code Graph + Advisor + Hooks Polish

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
## Phase 1: Planning

- [x] T001 Create Level 2 packet docs (`specs/.../006-cluster-a-to-e/`).
- [x] T002 Add Phase 006 child ID to parent graph metadata (`../graph-metadata.json`).
- [x] T003 Read source research and existing implementation/test surfaces.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:cluster-b -->
## Phase 2: Cluster B - Hook Documentation

- [x] T004 F-012 update Copilot README session-prime smoke wording (`hooks/copilot/README.md`).
- [x] T005 F-013 add Gemini SessionStart/compact/SessionEnd registrations (`hooks/gemini/README.md`).
- [x] T006 Verify hook README doc diffs are doc-only.
<!-- /ANCHOR:cluster-b -->

---

<!-- ANCHOR:cluster-d -->
## Phase 3: Cluster D - CocoIndex Interop

- [x] T007 F-016 add seed normalizer for snake_case fields (`code_graph/handlers/context.ts`).
- [x] T008 F-016 add snake_case seed regression test (`code_graph/tests/code-graph-context-handler.vitest.ts`).
- [x] T009 F-017 update CocoIndex tool reference (`mcp-coco-index/references/tool_reference.md`).
<!-- /ANCHOR:cluster-d -->

---

<!-- ANCHOR:cluster-a -->
## Phase 4: Cluster A - Read Path

- [x] T010 F-007 add readiness diagnostics fields (`code_graph/lib/ensure-ready.ts`).
- [x] T011 F-007 add blocked-read diagnostics regression test.
- [x] T012 F-018 add guarded auto-rescan policy shared by query/context handlers.
- [x] T013 F-018 add safe auto-rescan regression test.
- [x] T014 F-019 add verify scope preflight/result field (`code_graph/handlers/verify.ts`).
- [x] T015 F-019 add verify scope mismatch regression test.
<!-- /ANCHOR:cluster-a -->

---

<!-- ANCHOR:cluster-c -->
## Phase 5: Cluster C - Advisor

- [x] T016 F-014 fix `advisor_rebuild` mixed-axis predicate (`skill_advisor/handlers/advisor-rebuild.ts`).
- [x] T017 F-014 add mixed live/absent advisor rebuild test (`tests/advisor-rebuild.vitest.ts`).
- [x] T018 F-015 add startup post-index assertion (`context-server.ts`).
- [x] T019 F-015 add startup post-index assertion test (`tests/context-server.vitest.ts`).
<!-- /ANCHOR:cluster-c -->

---

<!-- ANCHOR:cluster-e -->
## Phase 6: Cluster E - Glob Fingerprints

- [x] T020 Add include/exclude glob dimensions to scope fingerprint (`code_graph/lib/index-scope-policy.ts`).
- [x] T021 Preserve v2 legacy fingerprint parsing compatibility.
- [x] T022 Add glob-only scope mismatch scan regression (`code_graph/tests/code-graph-scan.vitest.ts`).
<!-- /ANCHOR:cluster-e -->

---

<!-- ANCHOR:verification -->
## Phase 7: Verification

- [x] T023 Run targeted vitest after each cluster.
- [x] T024 Run full `npx vitest run code_graph/tests/`.
- [x] T025 Run advisor and hooks/tests vitest suites.
- [x] T026 Run `npm run build` in MCP server.
- [ ] T027 Run strict validation for child packet.
- [ ] T028 Run strict validation for parent packet.
- [ ] T029 Author `implementation-summary.md` with evidence.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All P0 checklist items verified.
- [x] No `[B]` blocked tasks remaining.
- [ ] Dist output rebuilt from TypeScript source.
- [x] Parent metadata includes `006-cluster-a-to-e`.
<!-- /ANCHOR:completion -->
