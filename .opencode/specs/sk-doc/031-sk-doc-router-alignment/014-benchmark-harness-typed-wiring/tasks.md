---
title: "Tasks: Benchmark-Harness Typed-Wiring + Selection-Architecture Fix"
description: "Task Format: T### [P?] Description (file path). One task per plan.md Section 4 phase step, each carrying its own verification command."
trigger_phrases:
  - "benchmark harness typed wiring tasks"
  - "selection architecture fix task list"
  - "holdout corpus task sequence"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/031-sk-doc-router-alignment/014-benchmark-harness-typed-wiring"
    last_updated_at: "2026-07-16T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored one task per phase step with its verification command"
    next_safe_action: "Start T001 (couple leaf selection to hub modes in router-replay)"
    blockers: []
    key_files:
      - "tasks.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "014-benchmark-harness-typed-wiring-authoring"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Benchmark-Harness Typed-Wiring + Selection-Architecture Fix

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

- [ ] T000 Capture the current skill-benchmark vitest failure baseline (`npx vitest run --config .opencode/skills/system-deep-loop/deep-improvement/scripts/vitest.config.mjs skill-benchmark`) and enumerate the zero-emission cases (SD-003/015/016 + a core out-of-fixture sample). Verification: baseline count recorded; the zero cases confirmed zero through `buildTypedResourceContract`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

Phase steps 1-7, dependency-ordered per plan.md Section 4.

- [ ] T001 Couple the surface leaf classifier to the hub-selected capped modes (`.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs`, `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/executor-dispatch.cjs`). Intersect leaf output with the capped hub modes so the 2-mode cap keeps correct leaves instead of filtering them to zero. Verification: new regression vitest pins SD-003/015/016 + core sample from zero to non-zero, mode-consistent pairs
- [ ] T002 Read typed gold in the loader (`.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs`). Surface `expected_leaf_resources`, `expected_workflow_mode`, `full_inventory_intent` alongside legacy fields. Verification: loader unit test asserts the typed fields are surfaced for a typed fixture
- [ ] T003 Add the pre-dispatch topology gate to the runner (`.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs`). Invoke `validate-playbook-topology.cjs` before dispatch; an invalid fixture blocks with zero denominators. Verification: synthetic invalid fixture blocks dispatch
- [ ] T004 Emit typed pairs and score real reads in the live executor (`.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/live-executor.cjs`, `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs`). Live output carries typed pairs; scoring weights actual reads over stated resources; the 5-class taxonomy consumes typed gold. Verification: live typed-pair emission test; aggregate vitest with taxonomy tests green on typed input
- [ ] T005 Join gold against the authored router in the topology validator (`.opencode/skills/sk-doc/create-skill/scripts/validate-playbook-topology.cjs`). Join each gold pair against `smart_routing.md`'s `RESOURCE_MAP`, not the fixture's own declaration. Verification: a deliberately-mismatched synthetic fixture is rejected
- [ ] T006 Relocate the contract library and repoint consumers (`.opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs` → shared location, `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs`, `.opencode/commands/doctor/scripts/parent-skill-check.cjs`). Locale-independent manifest sort; `resourceContractVersion` equality cross-check. Verification: `rg -n "leaf-resource-contract"` shows no consumer importing from the sk-doc packet path; `PARENT_HUB_CHECK_STRICT=1 parent-skill-check.cjs` and existing unit tests pass
- [ ] T007 Apply SD-015 option C (`.opencode/skills/sk-doc/manual_testing_playbook/**` SD-015). Add `expected_public_pairs` (both fan-out modes) and `expected_disk_targets` (deduplicated); full-inventory resolves by manifest enumeration. Verification: topology validator accepts both surfaces; full-inventory count matches the manifest
- [ ] T008 [P] Build the sealed holdout corpus and leakage audit (`.opencode/skills/sk-doc/.../holdout/**`, holdout tooling). Freeze the 19 fixtures as `stage: routing` and freeze the router; author 60–80 `stage: holdout` scenarios without router sight; two reviewers assign private typed gold; run the leakage audit; pre-register metrics. Verification: corpus count 60–80, leakage-audit report produced, metrics pre-registered before unsealing
- [ ] T009 Stand up the offline-holdout gate and live 3-gate (holdout runner, `run-skill-benchmark.cjs` live). Offline gate replays the frozen router over the sealed corpus and emits pre-registered metrics + fitted-to-holdout gap; the live 3-gate (interpretation, end-to-end, outcome) is runnable. Verification: offline gate produces a metric report; a single live interpretation-gate run completes
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T010 Run the full static and unit gate: `node --check` on every changed CJS file, the contract-library unit tests at the new path, `PARENT_HUB_CHECK_STRICT=1 parent-skill-check.cjs`, and the loader/topology unit tests
- [ ] T011 Run the aggregate regression: `npx vitest run --config .opencode/skills/system-deep-loop/deep-improvement/scripts/vitest.config.mjs --no-coverage` with zero new failures beyond the captured T000 baseline (delta, not absolute)
- [ ] T012 Run the offline-holdout gate and record the pre-registered metrics + the fitted-to-holdout gap; run one live interpretation-gate pass. Cross-reference the 012 record correction (the "18/19 fixed" relabel lives in 012)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Dispatcher emits non-zero mode-consistent pairs on the previously-zero cases (T001 regression green)
- [ ] Offline-holdout gate reports the pre-registered metrics with an honest fitted-to-holdout gap
- [ ] Wave-2 documented as blocked on the offline + live gates
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Decisions**: See `decision-record.md`
- **Sibling (record correction)**: `../012-sk-doc-routing-fixes`
<!-- /ANCHOR:cross-refs -->
