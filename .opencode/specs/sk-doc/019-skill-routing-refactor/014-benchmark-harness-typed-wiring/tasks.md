---
title: "Tasks: Single-Classifier Collapse + Typed Benchmark + Sealed Holdout"
description: "Task Format: T### [P?] Description (file path). One task per plan.md Section 4 phase step for the ratified Option 3 collapse, each carrying its own verification command."
trigger_phrases:
  - "single classifier collapse tasks"
  - "unified taxonomy task list"
  - "sealed holdout task sequence"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/014-benchmark-harness-typed-wiring"
    last_updated_at: "2026-07-16T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Rewrote task list to ten phases for the Option 3 collapse (ADR-005)"
    next_safe_action: "Start T000: design note, freeze fixtures and router, capture baseline"
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
    answered_questions:
      - "Option 3 (full collapse now, holdout in the same change) was operator-ratified 2026-07-16"
---
# Tasks: Single-Classifier Collapse + Typed Benchmark + Sealed Holdout

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

- [ ] T000 Design-lock and freeze (no runtime). Author the unified-taxonomy schema design note (typed intent→pair format, mode-projection rule, policy-layer shape, abstain/DEFER contract); freeze the 19 fixtures as `stage: routing` and snapshot/freeze the router; capture the skill-benchmark vitest baseline (`npx vitest run --config .opencode/skills/system-deep-loop/deep-improvement/scripts/vitest.config.mjs skill-benchmark`) and enumerate the zero-emission cases (SD-003/015/016/018/020 + a core out-of-fixture sample) through `buildTypedResourceContract`. Verification: design note committed; frozen fixtures + baseline recorded; zero cases confirmed zero
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

Plan Section 4 Phases 2–9, dependency-ordered.

- [ ] T001 Relocate the contract library (`.opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs` → shared non-sk-doc location; repoint `router-replay.cjs`, `.opencode/commands/doctor/scripts/parent-skill-check.cjs`, and every other consumer). Verification: `rg -n "leaf-resource-contract"` shows no consumer importing from the sk-doc packet path
- [ ] T002 Harden the relocated library (`parent-skill-check.cjs`, moved `leaf-resource-contract.cjs`). Locale-independent manifest sort; `resourceContractVersion` equality cross-check. Verification: `PARENT_HUB_CHECK_STRICT=1 parent-skill-check.cjs` and existing unit + guard tests pass at the new path
- [ ] T003 Author the typed intent→pair taxonomy (`.opencode/skills/sk-doc/shared/references/smart_routing.md`). Add intents for create-benchmark/create-diff/create-skill-parent and a first-class FULL_INVENTORY intent; type each pair `(workflowMode, leafResourceId)`; allow mode-spanning and sub-mode intents. Verification: parser accepts the typed map
- [ ] T004 Build/extend the taxonomy parser and coverage check (`load-playbook-scenarios.cjs` / taxonomy parser). Verification: every registered mode in `mode-registry.json` is reachable by ≥1 intent
- [ ] T005 Rewrite the router to one scored pass (`.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs`). Score the taxonomy once; project each pair's mode from its leaf via the manifest. Verification: single-pass unit tests; the aligned fixtures still resolve their leaves
- [ ] T006 Demote the hub keyword pass to telemetry (`router-replay.cjs`, `.opencode/skills/sk-doc/hub-router.json`). Compute the hub pass into a telemetry-only field for `intentRecall`/`hubRoute`; never gate the contract; shrink `hub-router.json` to policy (outcomes/delta/bundle/defer). Verification: the hub no longer gates leaves; telemetry still computed
- [ ] T007 Enforce the coherence invariant (`.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/executor-dispatch.cjs`). Advertised `workflowModes = orderedUnique(pairs[*].workflowMode)` capped at two; every pair ∈ manifest. Verification: advertised modes equal the emitted pair modes on every fixture
- [ ] T008 Add the empty-contract tripwire + FULL_INVENTORY drive (`executor-dispatch.cjs`). An empty typed contract while raw resources are non-empty is a hard ERROR; full inventory is driven by the FULL_INVENTORY intent, not a scenario flag. Verification: SD-003/015/016/018/020 + core sample go zero→non-zero; the tripwire fires on a synthetic empty contract
- [ ] T009 Apply SD-015 option C (`.opencode/skills/sk-doc/manual_testing_playbook/**` SD-015). Add `expected_public_pairs` (both fan-out modes) and `expected_disk_targets` (deduplicated); full-inventory resolves by manifest enumeration. Verification: the topology validator accepts both surfaces; full-inventory count matches the manifest
- [ ] T010 Add the abstain/DEFER path (`router-replay.cjs`, `hub-router.json` defer contract). Non-discriminative wins (shared authoring verbs with no mode-owned margin) → `UNKNOWN_FALLBACK`/DEFER with a disambiguation checklist; honor `defaultMode: null` and `outcomes.defer`. Verification: a shared-verb-only prompt DEFERs rather than guessing
- [ ] T011 Add the negation guard (`router-replay.cjs`). A negator within N tokens suppresses the hit. Verification: "don't create a changelog, just explain it" does not fire the changelog intent
- [ ] T012 Wire the typed loader + topology gate (`.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs`, `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs`). Surface `expected_leaf_resources`/`expected_workflow_mode`/`full_inventory_intent`; call `validate-playbook-topology.cjs` pre-dispatch. Verification: loader unit test asserts typed fields; an invalid fixture blocks with zero denominators
- [ ] T013 Join gold against the taxonomy in the topology validator (`.opencode/skills/sk-doc/create-skill/scripts/validate-playbook-topology.cjs`). Join each gold pair against the authored taxonomy, not the fixture's own declaration. Verification: a deliberately-mismatched synthetic fixture is rejected
- [ ] T014 Emit + score typed pairs (`.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/live-executor.cjs`, `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs`). Live output carries typed pairs and scores real reads; the scorer consumes typed gold while keeping `intentRecall`/`hubRoute` on hub telemetry. Verification: live typed-pair emission test; aggregate vitest green on typed input
- [ ] T015 Add the vocab-class lint (new lint runner + `hub-router.json`). No vocabulary class referenced by more than ~2 sibling signals; hub-wide verbs move to a hub-identity prior. Verification: the lint fails a synthetic >2-sibling class
- [ ] T016 Add the coverage CI + reconcile the schema + shared-leaf multi-ownership (coverage lint, `.opencode/skills/sk-doc/create-skill/references/parent_skill/parent_hub_router_schema.md`, `.opencode/skills/sk-doc/leaf-aliases.json`). Every registered mode reachable by ≥1 intent; §7 reconciled with the implemented order; shared leaves allow multi-ownership / a mode-neutral type. Verification: the coverage lint fails a synthetic unreachable mode; the schema doc matches the implementation
- [ ] T017 [P] Author the sealed holdout corpus (`.opencode/skills/sk-doc/.../holdout/**`). 60–80 `stage: holdout` scenarios from user-facing capabilities and resource contents only, without sight of the taxonomy/fixtures/keywords; two reviewers assign private typed gold; disagreements resolved before any run. Verification: corpus count 60–80; two-reviewer gold recorded
- [ ] T018 [P] Leakage audit + pre-register metrics (holdout tooling). Exact-phrase, rare-phrase, n-gram and single-keyword audit; pre-register the metrics before unsealing. Verification: leakage-audit report produced; metrics pre-registered
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T019 Run the full static + unit gate: `node --check` on every changed CJS file; the contract-library unit tests at the new path; `PARENT_HUB_CHECK_STRICT=1 parent-skill-check.cjs`; the taxonomy parser, loader, topology, router single-pass, abstain and negation unit tests
- [ ] T020 Run the aggregate regression: `npx vitest run --config .opencode/skills/system-deep-loop/deep-improvement/scripts/vitest.config.mjs --no-coverage` with zero new failures beyond the captured T000 baseline (delta, not absolute), plus the vocab-class and coverage lints green
- [ ] T021 Run the offline-holdout gate and record the pre-registered metrics + the fitted-to-holdout gap; run one live interpretation-gate pass. Verification: offline gate produces a metric report; a single live interpretation run completes
- [ ] T022 Close out: `validate.sh --strict` Errors 0; reconcile completion metadata (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`); update the parent 031 Phase-Doc-Map; document Wave-2 as blocked on the offline + live gates; cross-reference the 012 record correction
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Router runs one scored pass; the hub gates nothing and survives only as telemetry (T005/T006)
- [ ] Advertised `workflowModes` equals the emitted pair modes; the empty-contract tripwire fires (T007/T008)
- [ ] Dispatcher emits non-zero mode-consistent pairs on the previously-zero cases (T008 regression green)
- [ ] Every registered mode reachable by ≥1 intent; non-discriminative wins DEFER (T004/T010)
- [ ] Offline-holdout gate reports the pre-registered metrics with an honest fitted-to-holdout gap (T021)
- [ ] Wave-2 documented as blocked on the offline + live gates (T022)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Decisions**: See `decision-record.md` (ADR-005 supersedes ADR-001)
- **Model reviews**: `reviews/sol-5.6-ultra-amendment-verdict.md`, `reviews/glm-5.2-max-amendment-review.md`, `reviews/fable-5-xhigh-parent-skill-opinion.md`
- **Sibling (record correction)**: `../012-sk-doc-routing-fixes`
<!-- /ANCHOR:cross-refs -->
