---
title: "Tasks: Deep Review - Sealed Reference Artifacts"
description: "Tasks for binding Deep Review scope, per-dimension evidence, convergence witnesses, review-report outputs, resume references, and save handoffs to the shared sealed-artifact contract."
trigger_phrases:
  - "deep review sealed artifacts tasks"
  - "deep-review verified read tasks"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/002-mode-and-lane-migrations/002-deep-review/003-sealed-artifacts"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/002-mode-and-lane-migrations/002-deep-review/003-sealed-artifacts"
    last_updated_at: "2026-08-15T09:40:08Z"
    last_updated_by: "codex"
    recent_action: "Completed and verified the Deep Review artifact-set lifecycle"
    next_safe_action: "Consume the exported set in later separately scoped integration work"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-review-sealed-artifacts/deep-review-artifact-set.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/deep-review-sealed-artifacts.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Deep Review - Sealed Reference Artifacts

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm the shared review-loop contract and write-set conflict graph, and verify the reducer sibling owns findings and report projections [EVIDENCE: completed sibling contracts reviewed; focused Vitest 20/20]
- [x] T002 Inventory Deep Review scope, target, context, dimension, candidate, convergence, synthesis, resume, and save shapes [EVIDENCE: focused Vitest 20/20; 14-kind registry and 21-member run fixture]
- [x] T003 Freeze the mode artifact-kind matrix, shared descriptor fields, canonicalization profiles, media types, digest-reference roles, and deterministic reference ordering [EVIDENCE: focused Vitest 20/20; repeated complete-set builds are byte-identical]
- [x] T004 Define typed seal/read failures, target-drift dispositions, append-only supersession, report/handoff refusal, and additive-dark rollback behavior [EVIDENCE: focused Vitest 20/20; missing, reorder, stale, unknown-kind, substitution, and corruption fixtures]
- [x] T005 Confirm the mode consumes shared sealing primitives and introduces no mode-local digest, blob store, or verifier [EVIDENCE: `reference_set_digest` is the sole set identity; scoped source audit]
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 Register Deep Review scope, target snapshot, review-contract, context, capability, prompt/rubric, and replay-input artifact kinds through the shared sealer [EVIDENCE: focused Vitest 20/20; all-kind fixture]
- [x] T007 Add scope seal-on-write and bind one verified initial reference set before the first dimension dispatch [EVIDENCE: focused Vitest 20/20; all seven scope kinds are mandatory before replay]
- [x] T008 Add per-dimension sealing for selected targets, search/depth ledger, diagnostics, raw observations, graph events, iteration markdown, JSONL delta, and candidate evidence [EVIDENCE: focused Vitest 20/20; four ordered dimension-pass fixtures]
- [x] T009 Add immutable candidate/adjudication sealing for intermediate facts, evidence classes, reproduction/refutation outputs, raw scores, confidence, impact, reachability, exploitability, evidence strength, and evidence scope [EVIDENCE: focused Vitest 20/20; ordered P0/P1/P2 candidate and adjudication fixtures]
- [x] T010 Add a convergence witness over one verified state and findings snapshot, coverage, graph result, nine legal-stop gate results, and blocked-stop or recovery decision [EVIDENCE: focused Vitest 20/20; required convergence kind and existing nine-gate validator]
- [x] T011 Seal the findings/dashboard materialized view, optional resource-map coverage, unresolved obligations, verdict metadata, `review-report.md`, and ordered input digest set [EVIDENCE: focused Vitest 20/20; synthesis view and report are required]
- [x] T012 Add resume-facing comparison over target, contract, and evidence digests, preserving old references and naming affected finding/report views without silent rebaseline [EVIDENCE: focused Vitest 20/20; stale context rejects and prior seals remain publish-once]
- [x] T013 Add the verified continuity-save or handoff reference package and refuse trusted output when any referenced artifact fails verification [EVIDENCE: focused Vitest 20/20; resume handoff is required and corrupt replay releases no bytes]
- [x] T014 Bind mode artifact references into typed events, reducers and projections, replay fingerprints, compatibility adapters, shadow parity, and rollback handling [EVIDENCE: `deep-review-sealed-artifacts.vitest.ts` test "builds byte-identical complete review sets and shared replay inputs"; `git diff --name-only` leaves completed sibling runtimes unchanged]
- [x] T015 Preserve the shared review-loop contract and ensure Deep Review adds no mode-local scope, lineage, convergence, or report fork [EVIDENCE: `git diff --name-only`; only artifact-set binding over existing mode and shared types was added]
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T016 Verify every mode artifact kind uses shared canonicalization, seal-on-write, algorithm-qualified digest references, and the shared verified reader [EVIDENCE: focused Vitest 20/20; all 14 kinds]
- [x] T017 Verify scope and dimension fixtures reject mutable-only, missing, changed, truncated, substituted, wrong-kind, wrong-size, corrupted, and unsupported inputs [EVIDENCE: focused Vitest 20/20; existing closed-binding matrix plus new complete-set negatives]
- [x] T018 Verify pass and candidate fixtures preserve raw observations, intermediate facts, evidence classes, orthogonal evidential fields, lineage, and append-only supersession [EVIDENCE: focused Vitest 20/20; closed material validation and publish-once store]
- [x] T019 Verify convergence rejects mixed watermarks and synthesis reproduces identical findings views, dashboard, report, verdict metadata, and optional resource-map bytes from identical verified inputs [EVIDENCE: focused Vitest 20/20; stale-tail rejection and byte-identical complete-set builds]
- [x] T020 Verify changed-target and resume fixtures classify drift, preserve historical seals, identify affected findings or report views, and never silently rebaseline [EVIDENCE: focused Vitest 20/20; stale run context rejects; existing drift material remains closed]
- [x] T021 Verify continuity-save or handoff releases no trusted content after a failed seal or read and emits no silent completion evidence [EVIDENCE: focused Vitest 20/20; handoff required before replay; corruption returns byte-free typed error]
- [x] T022 Verify replay and shadow parity require the same ordered verified reference set before comparing effective events, projections, report views, or verdicts [EVIDENCE: focused Vitest 20/20; shared replay re-resolution and exact mode-set comparator]
- [x] T023 Verify seal/read failure blocks dark evidence and leaves legacy output, state, schema, report behavior, and authority unchanged [EVIDENCE: `deep-review-sealed-artifacts.vitest.ts` tests "rejects stale context and post-build corruption during replay" and "fails closed when sealed bytes no longer match their digest"; `git diff --name-only` contains no legacy or authority path]
- [x] T024 Verify the independent Deep Review phase-local gate without invoking certificate or authority semantics owned by later phases [EVIDENCE: non-equivalent sets return `INPUT_EQUIVALENCE_FAILURE`; no certificate or authority API added]
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks complete
- [x] All requirements in spec.md met with evidence
- [x] Phase gate green (validate/build/test as applicable)
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
