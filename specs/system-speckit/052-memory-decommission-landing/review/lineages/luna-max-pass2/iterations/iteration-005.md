---
title: "Iteration 5: D1 Correctness — forced-depth state integrity, executor guards and containment"
trigger_phrases: []
---

# Iteration 5: D1 Correctness — forced-depth state integrity, executor guards and containment

## Setup and route

- review_target: `.opencode/specs/system-speckit/052-memory-decommission-landing`
- review_target_type: `spec-folder`
- review_dimensions: `all`
- spec_folder: `.opencode/specs/system-speckit/052-memory-decommission-landing`
- execution_mode: `AUTONOMOUS`
- lineage_mode: `auto`
- target_agent: `deep-review`
- agent_definition_loaded: `true`
- resolved_route: `Resolved route: mode=review target_agent=deep-review`
- executor: `cli-codex model=gpt-5.6-luna`
- nested_dispatch: `false`

## Focus and method

Correctness review of forced-depth state validation, dispatch routing and artifact containment. Seven bounded implementation/test paths were directly re-read. The existing contiguous-file and recursion/symlink protections were revalidated. F010 was independently derived from the validator's use of a deduplicated state-record set, while all prior findings were carried without treating prior reports as proof.

## Scorecard

- Dimensions covered: correctness (deep-loop/state sub-slice)
- Files reviewed: 7
- New findings: P0=0 P1=0 P2=1
- Refined findings: P0=0 P1=0 P2=0
- Carried active findings: F001–F009
- New findings ratio: 1.0 for this pass
- Convergence: score 0, threshold 3; telemetry only under `max-iterations`

## Findings

### P0, Blocker

- None.

### P1, Required

- None new in this slice.

### P2, Suggestions

- **F010 — Forced-depth validation can accept duplicate state records when the full range is present.** `forcedDepthIterationViolation` builds `recorded` from every iteration record, but `sameSet` immediately applies `unique()` before comparing it with `1..cap` at `[SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:693-719]`. The exact-once comment says each iteration must run once, yet a state log containing records `1,1,2,3` with three on-disk iteration files is reduced to `1,2,3` and is not rejected by the state-record branch. The existing regression at `[SOURCE: .opencode/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts:604-613]` catches a duplicate only when it also leaves a missing number; it does not cover a duplicate alongside a complete range. The caller prefers the on-disk count when a lineage directory exists at `[SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:871-883]`, so the duplicate state record is not independently counted.
  - Recommendation: require `recorded.length === cap` and reject repeated iteration numbers before set comparison, then add a complete-range-plus-duplicate fixture with the synthesis path and a no-synthesis artifact path.

## Search and ruled-out checks

- The forced-depth file-set check still rejects gapped/out-of-range files and the unit test covers `1,2,4`; the issue is specifically duplicate state records with no missing number.
- The review YAML's autonomous `cli-codex` branch explicitly says a bound fan-out lineage must execute in-process, and the prompt carries that prohibition at `[SOURCE: .opencode/commands/deep/assets/deep-review-auto.yaml:1538-1547]`; no nested-dispatch drift was opened.
- `validateExecutorDispatchAllowed` rejects a non-empty fan-out lineage marker before stack, ancestry, environment or lockfile checks at `[SOURCE: .opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:818-850]`, with matching unit coverage at `[SOURCE: .opencode/skills/system-deep-loop/runtime/tests/unit/executor-audit.vitest.ts:694-730]`.
- Canonical containment resolves both lexical and real paths, detects escaping symlink paths and fails closed on the guarded partition at `[SOURCE: .opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:471-523,663-743]`; the symlink and ordinary nested-write fixtures at `[SOURCE: .opencode/skills/system-deep-loop/runtime/tests/unit/write-containment.vitest.ts:1222-1350]` cover the reviewed boundary. No new containment finding was opened.
- No test or repository validator was run because the user-bound write surface forbids commands that can write outside the lineage.

## Traceability checks

- `spec_code`: partial. The deep-loop contract is readable and the forced-depth validator has a targeted gap; no target packet change was made.
- `checklist_evidence`: blocked. No root `checklist.md` exists; authoritative validation was not run under the lineage-only boundary.
- `feature_catalog_code`: not applicable to this focused slice.
- `playbook_capability`: not applicable to this focused slice.

## Adversarial self-check

- Hunter: compared the validator's comments, state-record branch, on-disk branch and exact unit fixtures; traced the review YAML's in-process lineage rule through recursion and containment helpers.
- Skeptic: F010 depends on duplicate records and does not claim ordinary gapped sets pass; the current tests rule out the adjacent gap case, not the complete-range duplicate case.
- Referee: F010 remains P2 because it affects provenance/exact-once validation rather than the review work itself, while the reviewed recursion and symlink boundaries have direct source and fixture support.

## Next focus

Review the embedding provider factory/registry and shared model-selection boundaries, carrying all active findings. Continue to treat convergence as telemetry until iteration 10.

Review verdict: CONDITIONAL
