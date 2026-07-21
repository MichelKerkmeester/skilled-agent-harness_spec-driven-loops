---
title: "Tasks: Compiled-Routing Playbooks — Scenario Matrix & LUNA-High Acceptance"
description: "Task breakdown for the 7-hub compiled-routing scenario matrix, its evidence contract, the non-frozen validators/executor, and the two-plane LUNA-High acceptance stage. Not yet started."
trigger_phrases:
  - "compiled routing playbook tasks"
  - "luna high acceptance task list"
importance_tier: "critical"
contextType: "implementation"
---
# Tasks: Compiled-Routing Playbooks — Scenario Matrix & LUNA-High Acceptance

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

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

- [x] T001 Reconciled evidence-contract field names against `004`'s real `row.compiledParity` + `002`'s status probe (siblings exist on disk).
- [x] T002 [P] Read all 7 hubs' `manual-testing-playbook.md` structure, leaf-manifest modes, and evidence-field conventions.
- [x] T003 [P] Read `validate-playbook-topology.cjs` — it already recurses; the gap was the unified verdict enum.
- [x] T004 [P] Confirmed the activation manifest shape (`servingAuthority`/`selectedPolicy.effectivePolicyHash`) as the direct-read serving-status source.

**Evidence**: sibling contracts read from real code; gold derived from live router output per hub before authoring.

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Authored the `sk-code` surfaceBundle scenario with the full 7-field evidence contract.
- [x] T006 [P] Authored the `mcp-tooling` ordered-bundle scenario (design-transport, clean compiled==legacy on `mcp-refero`).
- [x] T007 [P] Authored the `system-deep-loop` ordered-bundle scenario (`research`).
- [x] T008 [P] Authored the `cli-external-orchestration` ordered-bundle scenario (`cli-opencode`).
- [x] T009 [P] Authored the `sk-prompt` default-mode scenario (`prompt-improve`).
- [x] T010 [P] Authored the `sk-design` bundle-rules scenario (`md-generator`).
- [x] T011 [P] Authored the `sk-doc` bundle-rules scenario (`create-skill`).
- [x] T012 Authored `validate-compiled-routing-scenarios.cjs` (non-frozen content validator; full field + evidence contract).
- [x] T013 Modified `validate-playbook-topology.cjs`: added the unified PASS/FAIL/SKIP verdict enum additively; recursion made explicit + fixture-proven.
- [x] T014 Authored `cutover-playbook-executor.cjs` (non-frozen; gates on routing-decision parity + serving authority from captured evidence).
- [x] T015 Authored `luna-acceptance.cjs`: orchestrator-owned map, `openai/gpt-5.6-luna` variant `high`, stdout/stderr separate, timeout → `SKIP`.
- [x] T016 Added a gold-bearing held-out paraphrase per hub (7/7 total) in the `luna-acceptance.cjs` SCENARIO_MAP; routes audit as withheld.
- [x] T017 [P] Re-anchored the `sk-doc` root playbook off the retired flat RESOURCE_MAP onto `mode-registry.json`/`hub-router.json`.
- [x] T018 [P] Promoted `mcp-tooling`'s Figma+Refero design-transport bundle to a primary evidence row.
- [x] T019 [P] Documented `sk-prompt`'s `orderedBundle` as unproven (empty `bundleRules`; the claim lives in off-limits `hub-router.json`).
- [x] T020 Kept the primary matrix at one scenario per hub; holdouts live in the `luna-acceptance.cjs` orchestrator map, not a duplicate deterministic matrix.

**Evidence**: all writes scoped to the Files-to-Change paths; frozen scorer trio byte-identical; 7/7 content + topology + route-gold + cutover PASS.

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T021 Content validator fixture sweep PASS: id-only rejected, missing-field rejected, holdout-leak flagged, complete accepted; 7/7 real scenarios PASS.
- [x] T022 Topology recursion fixture in `compiled-routing-cutover-luna.test.cjs` PASSES: a nested per-feature defect fails the run verdict while the clean root leaf passes.
- [x] T023 Cutover executor dry run: 7/7 hubs `join-gate: PASS`, evidence-derived; branch fixtures cover match/drift/vacuous/defer/skip/throw.
- [x] T024 LUNA-HIGH seeded-timeout fixture PASS: classifies `SKIP`, stdout/stderr distinct.
- [x] T025 Holdout audit: all 7 map holdouts audit `withheld=true`; live sk-code + sk-doc holdouts routed-to-gold.
- [x] T026 Root-playbook realignment verified across `sk-doc`, `mcp-tooling`, `sk-prompt`; the 3 hubs still load unchanged.
- [x] T027 `validate.sh --strict` on this phase folder → Errors: 0.

**Evidence**: bounded LUNA-High live run `luna-high-acceptance-1784596615522` (sk-code routing+holdout, sk-doc holdout) all PASS, archived via `007`; frozen trio byte-identical; ephemeral-id scan 0.

<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All 7 eligible hubs have exactly one compiled-routing scenario file with the full evidence contract.
- [x] Content and topology validators pass their fixture sweeps.
- [x] The cutover executor's gating is evidence-derived, proven on a 7/7 dry run.
- [x] The LUNA-HIGH stage classifies timeout as `SKIP` (fixture) and every hub has a gold-bearing holdout.
- [x] Root-playbook realignment lands for `sk-doc`, `mcp-tooling`, `sk-prompt`.
- [x] Strict Level-2 packet validation passes on this phase folder.

**Evidence**: Implemented and verified 2026-07-21; the full 7-hub LUNA-High live sweep is a documented bounded follow-up on top of the proven 3-scenario live sample.

<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification checklist**: See `checklist.md`
- **Completion record**: See `implementation-summary.md`
- **Upstream research**: `../001-research/{review-v1.md, synthesis-v1.md}` §2.3 (CF-PB-1..5), §2.2 (CF-BM-7)
- **Sibling dependency**: `../004-benchmark-compiled-lane-c/`

<!-- /ANCHOR:cross-refs -->
