---
title: "Iteration 1: Correctness — retirement contract and validation fixtures"
trigger_phrases: []
---
# Iteration 1: Correctness — retirement contract and validation fixtures

## Dispatcher
- Executor binding: `cli-pi` / `gpt-5.6-luna` / xhigh.
- Resolved route: `mode=review target_agent=deep-review`.
- Packet root: `specs/system-speckit/036-spec-doc-template-reduction/010-checklist-full-retirement/review/lineages/luna-xhigh-r2`.
- Budget profile: scan; bounded direct reads and exact searches.
- The external cli-pi binary was not recursively invoked because this review is already running inside Pi and the cli-pi self-invocation guard forbids that route.

## Dimension
Correctness. This pass checks whether the retirement contract is reflected in the live producer/consumer and test surfaces.

## Files Reviewed
- `specs/system-speckit/036-spec-doc-template-reduction/010-checklist-full-retirement/spec.md:126-143`
- `specs/system-speckit/036-spec-doc-template-reduction/010-checklist-full-retirement/tasks.md:35-64`
- `specs/system-speckit/036-spec-doc-template-reduction/010-checklist-full-retirement/acceptance-criteria.md:52-71`
- `.opencode/skills/system-spec-kit/scripts/spec/upgrade-level.sh:729-744`
- `.opencode/skills/system-spec-kit/templates/spec-kit-docs.json:545-585`
- `.opencode/skills/system-spec-kit/scripts/tests/test-validation-system.cjs:290-297,410-417`
- `.opencode/skills/system-spec-kit/scripts/package.json:14-18`
- `.opencode/skills/system-spec-kit/mcp-server/lib/templates/level-contract-resolver.ts:37-80`
- `.opencode/skills/system-spec-kit/scripts/tests/level-contract-resolver.vitest.ts:28-50`

## Findings by Severity

### P0 Findings
- None. No destructive data loss, authentication bypass, or immediate security compromise was established in this pass.

### P1 Findings

1. **The active validation-system test harness still asserts that Level 2 creates `checklist.md`** — `.opencode/skills/system-spec-kit/scripts/tests/test-validation-system.cjs:290-297,410-417` — the shared `createTestSpecFolder` helper writes `checklist.md` for every level 2-or-higher fixture, and the Level 2 file-existence test explicitly passes only when that file exists. `.opencode/skills/system-spec-kit/scripts/package.json:14-18` includes this file in `test:validation`, so the contradiction is part of the shipped test command rather than an archived example. The retirement requirement says the upgrade path, contract, and templates must no longer produce or require the standalone document (`spec.md:126-143`; `tasks.md:43-52`), while the live contract now lists only `acceptance-criteria.md` as the Level 2 add-on (`spec-kit-docs.json:545-585`; `level-contract-resolver.vitest.ts:28-50`). This fixture harness can therefore remain green while preserving the retired Level 2 behavior and gives no regression protection for the new no-checklist contract.

   - Finding class: `test-isolation`
   - Scope proof: `scripts/package.json:14-18` wires `test-validation-system.cjs` into the scripts test command; direct reads of the helper and its Level 2 assertion show both the producer and the expectation are local to this active suite.
   - Affected surface hints: `["scripts/tests/test-validation-system.cjs", "scripts/package.json test:validation", "level-contract-resolver", "Level 2 fixture contract"]`
   - Claim-adjudication packet:

```json
{
  "findingId": "F001",
  "claim": "The active validation-system test harness still treats checklist.md as a required Level 2 artifact after the retirement contract removed it.",
  "evidenceRefs": [
    ".opencode/skills/system-spec-kit/scripts/tests/test-validation-system.cjs:290-297",
    ".opencode/skills/system-spec-kit/scripts/tests/test-validation-system.cjs:410-417",
    ".opencode/skills/system-spec-kit/scripts/package.json:14-18",
    ".opencode/skills/system-spec-kit/templates/spec-kit-docs.json:545-585"
  ],
  "counterevidenceSought": "Read the scripts package test wiring, the helper's Level 2 creation branch, the explicit Level 2 assertion, and the current manifest/resolver contract; no exclusion or retirement-specific replacement was found.",
  "alternativeExplanation": "The file may be intended as a legacy validation fixture rather than a product contract, but it is still executed by the package test command and labels the retired behavior as passing.",
  "finalSeverity": "P1",
  "confidence": 0.96,
  "downgradeTrigger": "If the file is removed from every active test command or its Level 2 cases are rewritten to assert acceptance-criteria.md without checklist.md."
}
```

### P2 Findings
- None established in this pass.

## Traceability Checks
- `spec_code`: partial — the primary producer and manifest are aligned with retirement, but the active validation harness contradicts that contract.
- `checklist_evidence`: pending — dedicated evidence-item reconciliation is reserved for the traceability iteration.
- `feature_catalog_code`: pending — reserved for the traceability iteration.
- `playbook_capability`: pending — reserved for the traceability iteration.
- `resource-map.md`: not present at initialization; coverage gate skipped.

## Integration Evidence
- Upgrade producer: `.opencode/skills/system-spec-kit/scripts/spec/upgrade-level.sh:729-744` creates `acceptance-criteria.md` and contains no checklist creation branch.
- Contract consumer: `.opencode/skills/system-spec-kit/templates/spec-kit-docs.json:545-585` and `.opencode/skills/system-spec-kit/scripts/tests/level-contract-resolver.vitest.ts:28-50` exclude `checklist.md` from the current Level 2 contract.
- Active test entry point: `.opencode/skills/system-spec-kit/scripts/package.json:14-18` executes the contradictory validation harness.

## Edge Cases
- The test helper's generated checklist is temporary fixture content, not a production write path. The P1 is the active assertion of a retired contract and the loss of regression coverage, not a claim that this helper writes into tracked packets.
- The current packet's own `tasks.md` verification section has an unchecked deferred P1 row; that closure-evidence question is not adjudicated in this correctness pass and is carried to traceability.
- Prior sibling-lineage findings about fingerprint omission and path confinement were not copied. Current source lines were reread; the fingerprint source list now includes `acceptance-criteria.md`, and the current generation test includes a future-marker case.
- Code graph and semantic memory were unavailable. Direct file reads and bounded exact searches were used.

## Confirmed-Clean Surfaces
- The Level 1-to-Level 2 production block creates `acceptance-criteria.md` only.
- The current level manifest and resolver tests do not list `checklist.md` in the Level 2 add-on bucket.
- No P0 candidate was found, so Hunter/Skeptic/Referee escalation was not required.

## Ruled Out
- Live upgrade producer still creates `checklist.md`: ruled out by `.opencode/skills/system-spec-kit/scripts/spec/upgrade-level.sh:729-744`.
- Current manifest still includes a checklist add-on: ruled out by `.opencode/skills/system-spec-kit/templates/spec-kit-docs.json:545-585` and `.opencode/skills/system-spec-kit/scripts/tests/level-contract-resolver.vitest.ts:28-50`.
- The F001 issue is not a duplicate of the earlier stale `check-ac-coverage.sh`, `level-contract-resolver.vitest.ts`, or `test-integration.vitest.ts` findings: this finding concerns the separate active `test-validation-system.cjs` helper and its Level 2 assertion.

## Next Focus
- dimension: security
- focus area: canonical path confinement, symlink handling, fingerprint-generation trust boundaries, and repair writes
- reason: retirement changes generated metadata and filesystem boundaries; review those paths independently before traceability reconciliation
- rotation status: correctness complete for this pass
- blocked/productive carry-forward: retain F001 as active; do not retry the already-clean producer and manifest searches
- required evidence: current path checks, generation comparisons, and write-boundary code
- recovery note: none

## Verdict
- New findings: P0=0, P1=1, P2=0.
- New findings ratio: 1.0.
- Provisional iteration verdict: CONDITIONAL.

Review verdict: CONDITIONAL
