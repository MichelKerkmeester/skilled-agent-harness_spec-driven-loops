---
title: "Tasks: sk-doc Router Path-Contract Fixes"
description: "Task Format: T### [P?] Description (file path). One task per research.md Section 8 fix-plan step, each carrying its own verification command from Section 9."
trigger_phrases:
  - "sk-doc routing fixes tasks"
  - "leaf resource contract task list"
  - "nine step fix plan tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/012-sk-doc-routing-fixes"
    last_updated_at: "2026-07-16T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored one task per fix-plan step with its research.md Section 9 command"
    next_safe_action: "Await operator authorization, then start T001"
    blockers:
      - "Sequenced after sibling packet 011-skill-advisor-routing-research per the 031 parent"
    key_files:
      - "tasks.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "012-sk-doc-routing-fixes-authoring"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: sk-doc Router Path-Contract Fixes

<!-- SPECKIT_LEVEL: 3 -->
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

- [B] T000 Confirm operator authorization to start implementation. Blocked on the 031 parent's sequencing against sibling packet `011-skill-advisor-routing-research`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

Fix-plan steps 1-9, dependency-ordered per research.md Section 8.

- [x] T001 Build the leaf-resource contract library (`.opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs`, `.opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs`). Pure normalization, composite-key, containment, canonical-bytes and digest functions, plus the `--write`/`--check` CLI. Verification: `node --check` on both files, then `node --test .opencode/skills/sk-doc/create-skill/scripts/tests/leaf-resource-contract.test.cjs`
- [x] T002 Add hub topology artifacts (`.opencode/skills/sk-doc/mode-registry.json`, `.opencode/skills/sk-doc/leaf-aliases.json`, `.opencode/skills/sk-doc/leaf-manifest.json`). `resourceContractVersion` field, authored shared-alias table, generated and committed manifest. No parallel leaf map in `hub-router.json`. Verification: `node .opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs --check .opencode/skills/sk-doc`
- [x] T003 Extend the parent-hub checker (`.opencode/commands/doctor/scripts/parent-skill-check.cjs`, `.opencode/commands/doctor/scripts/tests/parent-skill-check-leaf-manifest.test.cjs`). Manifest-source, byte-drift, target/collision and bidirectional selected-map reachability guards, with ordered guard codes. Verification: `PARENT_HUB_CHECK_STRICT=1 node .opencode/commands/doctor/scripts/parent-skill-check.cjs .opencode/skills/sk-doc`, then `node --test .opencode/commands/doctor/scripts/tests/parent-skill-check-leaf-manifest.test.cjs`
- [x] T004 Migrate fixtures and add the topology validator (`.opencode/skills/sk-doc/manual_testing_playbook/**` 19 scenario files, `.opencode/skills/sk-doc/create-skill/scripts/validate-playbook-topology.cjs`). Typed gold (`expected_workflow_mode` + canonical leaf) for every scenario. Schema-then-manifest-then-selected-map pre-dispatch gate. Invalid oracle blocks with zero dispatch. Verification: `npx vitest run --config .opencode/skills/system-deep-loop/deep-improvement/scripts/vitest.config.mjs .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/sk-doc-leaf-routing-contract.vitest.ts`
- [x] T005 Emit canonical pairs from replay and dispatch (`.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs`, `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/executor-dispatch.cjs`). Canonical typed-pair emission, selected-map union cap (`maxWorkflowModes: 2`), no unmapped leaves, full-inventory only by explicit intent, dual-read legacy. Verification: `npx vitest run --config .opencode/skills/system-deep-loop/deep-improvement/scripts/vitest.config.mjs .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/sk-doc-leaf-routing-contract.vitest.ts`
- [x] T006 Correct the nine affected packet maps (`create-quality-control`, `create-flowchart`, `create-feature-catalog`, `create-agent`, `create-command`, `create-manual-testing-playbook`, `create-readme`, `create-skill`, `create-changelog` under `.opencode/skills/sk-doc/`). `create-benchmark` and `create-diff` stay untouched. Verification: `PARENT_HUB_CHECK_STRICT=1 node .opencode/commands/doctor/scripts/parent-skill-check.cjs .opencode/skills/sk-doc`, then `npx vitest run --config .opencode/skills/system-deep-loop/deep-improvement/scripts/vitest.config.mjs --no-coverage`
- [ ] T007 Split the scorer and report taxonomy (`.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs`, `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/build-report.cjs`). Five error classes (`fixture_schema_error`, `fixture_topology_error`, `fixture_selection_error`, `routing_contract_error`, `routing_miss`), topology-digest snapshot with `topology_changed_during_run` abort, excluded-row reporting, fail-closed provenance. Verification: `npx vitest run --config .opencode/skills/system-deep-loop/deep-improvement/scripts/vitest.config.mjs --no-coverage`
- [x] T008 [P] Declare the `pathContract` in create-skill's authoring stack (`.opencode/skills/sk-doc/create-skill/assets/skill/skill_smart_router.md`, `.opencode/skills/sk-doc/create-skill/assets/parent_skill/parent_skill_hub_router_template.json`, `.opencode/skills/sk-doc/create-skill/references/parent_skill/parent_hub_router_schema.md`, `.opencode/skills/sk-doc/create-skill/assets/parent_skill/parent_skill_smart_routing_template.md`, `.opencode/skills/sk-doc/shared/references/smart_routing.md`). hubLoadAddress-versus-leafResourceId conversion boundary, second-layer router scaffold, sk-doc's own per-intent leaf sets plus one explicit full-inventory intent. Verification: no scripted gate in Section 9. Manual review confirms the field appears in the template and schema doc and that a freshly authored hub carries it
- [x] T009 [P] Fix the stale canon sentence (`.opencode/skills/sk-doc/create-skill/references/parent_skill/parent_skills_nested_packets.md`, lines 208-209). Remove the "~34 uncovered aliases" claim. Verification: no scripted gate in Section 9. Manual `rg -n "34" parent_skills_nested_packets.md` confirms the retired sentence is gone
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T010 Run the full static and unit gate: `node --check` on every added or changed CJS file, `generate-leaf-manifest.cjs --check`, `PARENT_HUB_CHECK_STRICT=1 parent-skill-check.cjs`, `node --test leaf-resource-contract.test.cjs`, `node --test parent-skill-check-leaf-manifest.test.cjs` (Section 9 commands 1-5)
- [ ] T011 Run the routing-contract and aggregate regression suites: `npx vitest run sk-doc-leaf-routing-contract.vitest.ts`, then `npx vitest run --no-coverage` with zero new failures (Section 9 commands 6-7)
- [ ] T012 Run a fresh Mode-B live benchmark against all 19 sk-doc fixtures. Record the report, config fingerprint and topology digest (Section 9 command 8). Compare results against the Section 10 acceptance matrix. Confirm SD-008 and SD-012 keep their clean scores
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Fresh Mode-B live run (T012) matches the Section 10 acceptance matrix, with zero regression on SD-008 and SD-012
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Research Source**: `../010-sk-doc-routing-research/research/research.md` (Sections 8-11)
<!-- /ANCHOR:cross-refs -->
