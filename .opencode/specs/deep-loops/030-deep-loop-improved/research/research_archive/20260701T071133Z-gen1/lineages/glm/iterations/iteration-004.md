# Iteration 004: Deep-Review Lineage CONDITIONAL Verdicts + Stale Finding Registries

## Focus
- Scope: codex + glm deep-review fan-out lineages — verdict status, finding registry freshness, and registry update gap after 007-fan-out-hardening fixes
- Question: Were deep-review finding registries updated after 007-fan-out-hardening fixes?

## Findings

### F-004: Both review lineages ended with CONDITIONAL verdicts; finding registries were never dispositioned

**Severity: High (review debt — fixes applied but never closed out)**

**GLM review lineage (11 iterations):**
- 7 of 11 dimensions ended **CONDITIONAL**:
  - workflow-state-integrity: CONDITIONAL
  - fanout-lineage-isolation: CONDITIONAL
  - correctness: CONDITIONAL
  - security: CONDITIONAL
  - traceability: CONDITIONAL
  - maintainability: CONDITIONAL
  - resource-map-coverage: CONDITIONAL
- Only 3 dimensions PASS (cross-runtime-parity, observability, test-adequacy)
- synthesis-readiness: PARTIAL (iteration 011 had no JSONL delta)
[SOURCE: `review/lineages/glm/deep-review-dashboard.md`]

**GLM findings registry (9 findings):**
ALL 9 findings have `status: "?"` (unset/null). None were dispositioned:
| ID | Severity | Title |
|----|----------|-------|
| P1-001 | P1 | Detached CLI fan-out prompt omits required review init bindings |
| P1-002 | P1 | Unrecoverable iteration salvage can still produce a fulfilled lineage |
| P1-003 | P1 | Mixed salvage/missing-artifact failures skip the transient retry path |
| P1-004 | P1 | Detached OpenCode lineages run with prompt-only write isolation |
| P1-005 | P1 | Fan-out adversarial playbook claims exit-0/no-artifact coverage, but reference... |
| P1-006 | P1 | 009 remediation parent marked complete while parent docs contain scaffolds |
| P1-007 | P1 | Parent and remediation discovery metadata omit fan-out/remediation surfaces |
| P2-009-001 | P2 | Lag-ceiling observability events normalize to unknown status |
| P1-011-001 | P1 | Leaf-only GLM lineage skipped by registry-only fan-out merge |
[SOURCE: `review/lineages/glm/deep-review-findings-registry.json`]

**Codex review lineage (50 iterations):**
- Findings registry: **0 findings** — despite running 50 iterations, no findings were saved to the registry
- State log: stopped at `maxIterationsReached` (never converged)
[SOURCE: `review/lineages/codex/deep-review-findings-registry.json` (total: 0)]
[SOURCE: `review/lineages/codex/deep-review-state.jsonl` (last: maxIterationsReached)]

**Critical gap: 007-fan-out-hardening fixes were applied but registries never updated**

Phase `008/007-fan-out-hardening` claims Complete with `completion_pct: 100`. Its spec describes hardening fan-out init bindings, salvage paths, and write isolation — directly addressing P1-001 through P1-004. But:
- The GLM findings registry still shows all P1s as active (`status: "?"`)
- The codex registry is empty
- Neither registry was updated to mark findings as "resolved" or "fixed"
[SOURCE: `008-loop-systems-remediation/007-fan-out-hardening/spec.md:28` (completion_pct: 100)]
[SOURCE: `review/lineages/glm/deep-review-findings-registry.json` (all status: "?")]

**Root cause:** The fan-out hardening phase shipped code fixes but there is no workflow step that closes the loop back to the review finding registry. The `speckit:complete` workflow does not check whether open review findings in the same packet have been dispositioned.

**Impact:**
1. A future operator reviewing the packet sees 7 CONDITIONAL dimensions + 9 active P1s and has no way to know the fixes already shipped
2. The next deep-review pass will re-discover the same P1s (wasted iterations)
3. The codex registry being empty means 50 iterations of review work produced zero traceable findings

**Recommendation:**
1. Add a `step_review_registry_disposition` to the remediation complete workflow that reads open findings from `review/lineages/*/deep-review-findings-registry.json` and marks them resolved/fixed with evidence when the remediation child phase ships
2. Backfill the GLM registry: mark P1-001 through P1-004 as "resolved" with evidence from `007-fan-out-hardening/implementation-summary.md`
3. Investigate why the codex lineage produced 0 registry findings despite 50 iterations — likely a reducer bug or missing `step_save_findings` in the codex YAML path
4. Update the GLM dashboard to reflect post-hardening verdicts

## Novelty Justification
Confirmed all 9 GLM findings have unset status AND discovered the codex registry is completely empty (0 findings from 50 iterations). The "fixes shipped but registry never updated" gap is a systemic workflow omission, not a one-off oversight.

## What Was Tried and Failed
- Checked if a separate disposition file existed (it did not)
- Checked if the dashboard was updated (it was not — still shows CONDITIONAL)

## Ruled-Out Directions
- The CONDITIONAL verdicts are NOT still accurate post-hardening (the fan-out hardening phase directly addresses P1-001 through P1-004)
