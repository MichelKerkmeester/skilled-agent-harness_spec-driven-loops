# Iteration 5: Traceability overlay - the suite's guard wrappers prove only the shipped tree

## Dimension

Traceability, overlay protocol `feature_catalog_code`. The four catalog leaves the packet added, the test files those leaves name as their automated evidence, and the leaf claims that depend on those tests.

## Files Reviewed

- `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/example-drift-guard.md:18-52`
- `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/spec-authoring-card.md:26-60`
- `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/template-section-fill-guidance.md:18-30`
- `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/versioned-placeholder-gate.md` (index row only)
- `.skilled/skills/system-spec-kit/runtime/cli/tests/example-drift.vitest.ts:1-14`
- `.skilled/skills/system-spec-kit/runtime/cli/tests/card-sync.vitest.ts:1-16`
- `.skilled/skills/system-spec-kit/feature-catalog/feature-catalog.md` (index rows for the four leaves)

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **Both guard wrappers in the suite assert only that today's tree passes** - `.skilled/skills/system-spec-kit/runtime/cli/tests/example-drift.vitest.ts:8` - The example-drift wrapper holds one test, `passes on the shipped examples`, and its only assertion is that stdout trims to `EXAMPLE_DRIFT_OK` ([SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/example-drift.vitest.ts:8-13]). The card-sync wrapper is built the same way: one test, one assertion, `toContain('CARD SYNC OK')` ([SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/card-sync.vitest.ts:12-15]). Neither test ever presents the guard with drift, so a regression that makes either script print its success line unconditionally keeps the suite green. The failure behavior exists only in the manual scenarios - 479 for the drift guard and 482 for the card sync guard - which the catalog leaves themselves name as the coverage ([SOURCE: .skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/example-drift-guard.md:47-49]). The leaf's sentence "A vitest wrapper runs it in the suite" ([SOURCE: .skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/example-drift-guard.md:34]) is true and reads stronger than the test it describes.
   Finding class: test-coverage-gap
   Scope proof: both test files read in full; each holds exactly one `it` block with one positive assertion, and the leaves' own source tables name only these two wrappers as automated coverage.
   Affected surface hints: example drift guard test, card sync guard test, both catalog leaves, phase 004 and 005 handoff criteria
   Case: change `check-example-drift.sh` so line 43 always runs `echo EXAMPLE_DRIFT_OK`; `vitest run example-drift` still passes.

## Traceability Checks

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| `spec_code` | partial | hard | `example-drift.vitest.ts:8-13`; `card-sync.vitest.ts:12-15` | The automated evidence for two shipped guards covers one branch each. |
| `checklist_evidence` | pending | hard | phase 004 and 005 acceptance rows | The checklist-evidence pass reads those rows in a later iteration. |
| `skill_agent` | pass | advisory | `SKILL.md` intent rows; `spec-authoring-card.md:20-24` | The leaf's router claim matches the router. |
| `agent_cross_runtime` | notApplicable | advisory | - | No agent definition reviewed this iteration. |
| `feature_catalog_code` | partial | advisory | four leaves, their index rows, 48 tooling leaves path-scanned | All four leaves exist, are indexed exactly once, and name no missing path. The only gap is the strength of the tests they name. |
| `playbook_capability` | pass | advisory | scenarios 479, 481, 482, 483 referenced by the leaves | Each leaf that claims a scenario names one that exists. |

## Verdict

One P2 finding. The catalog side of the packet is internally consistent - four leaves, one index row each, no dangling path, claims that match their documents - and the only weakness is that the two automated tests the leaves rely on prove the happy path alone.

Ruled out this iteration, with evidence: a path scan over all 48 tooling leaves found two missing paths, both in leaves this packet never touched (`core-workflow-infrastructure.md`, `spec-validation-rule-engine.md`), so neither is reported; the four new leaves each appear exactly once in `feature-catalog.md`; and the addon-template fill-line coverage question belongs to the wave-1 finding already on record, so it is not re-entered here.

## Next Dimension

Correctness. The benchmark harness that produced the deciding evidence: `run-final.sh` and `justified-anchors.sh`, read as programs.

Review verdict: PASS
