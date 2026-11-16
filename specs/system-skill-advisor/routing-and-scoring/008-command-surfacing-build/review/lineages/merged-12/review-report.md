# Review Report — merged-12

**Lineage:** `merged-12` (detached fan-out, review pass twelve)
**Review target:** `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build`
**Session:** `fanout-merged-12-1794856957949-n58dw7`
**Stop reason:** `converged` (all dimensions clean, 6 iterations)
**Artifact dir:** `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/lineages/merged-12`

## 1. Executive Summary

- **Overall verdict:** PASS
- **hasAdvisories:** true
- **P0/P1/P2 counts the verdict used:** P0=0, P1=0, P2=1
- **Iterations:** 6 (four dimension passes, one protocol-completion pass, one residual sweep; two recovery starts after zero-ratio pairs)
- **Review scope:** the four `merged` paths of `review-scope-12.txt` — `.skilled/skills/sk-doc/ROUTER.md`, `.skilled/skills/sk-doc/SKILL.md`, `.skilled/skills/sk-doc/graph-metadata.json` and `.skilled/commands/doctor/scripts/tests/doctor-install-contract.test.cjs` — reviewed under all four dimensions.
- **Operator review focus:** review pass twelve, area `merged`, per `review/review-brief-12.txt`: the two `origin/main` merges must leave sk-doc's ROUTER/SKILL equal to main except the branch's README phrase narrowings and `/create:sk-skill`, the generated intent signals must follow the router, and the doctor contract test must check the presentation and the workflow against the link manifest.

### Self-check outcomes

| Finding | Call |
|---------|------|
| `MRG12-P2-001` | Confirmed as P2; re-read at line level in iteration 4 and re-swept in iteration 6. No live desync exists, so no upgrade; no counterevidence reduces it either. |

### Headline

The two `origin/main` merges are clean for the reviewed sk-doc surface: every difference from `640cd0a2499` is a README phrase narrowing, a version bump, or the `/create:sk-skill` rename, and the generated intent signals follow the router with zero missing phrases and zero orphans. The doctor contract test is green (17/17) and its presentation leg derives its expectation from the link manifest — but its workflow leg asserts only that one field lacks the phrase `is not offered`, a field that names no runtime, so the test's title claims more than it enforces (`MRG12-P2-001`, advisory).

## 2. Planning Trigger

`/speckit:plan` is not required: the verdict is PASS with one advisory, and no active P0 or P1 remains.

```json
{
  "triggered": false,
  "verdict": "PASS",
  "hasAdvisories": true,
  "activeFindings": ["MRG12-P2-001"],
  "remediationWorkstreams": [
    {
      "id": "WS-1",
      "priority": "P2",
      "findings": ["MRG12-P2-001"],
      "action": "Extend the runtime-name contract test to assert the workflow's Ask-step list against the runtimes in symlink-manifest.json (or assert the same manifest-derived name for each runtime in WORKFLOW_TEXT), and drop the phrase-absence assertion that stands in for it."
    }
  ],
  "specSeed": [
    "REQ-006 should state which workflow surface the contract test must assert: the Ask-step runtime list, not the `inputs.runtimes` string.",
    "If the test title is meant to stay, name the link manifest as the single source for both the presentation and the workflow assertion."
  ],
  "planSeed": [
    "Add a failing case first: remove `dsh` from `doctor-install.yaml`'s Ask list and confirm the contract test stays green.",
    "Derive the runtime list from `symlink-manifest.json` once and assert each name in `WORKFLOW_TEXT` (or the exact Ask sentence) and in the presentation sentence.",
    "Drop `assert.doesNotMatch(WORKFLOW.inputs.runtimes, /is not offered/)` once the real workflow assertion exists."
  ],
  "findingClasses": [
    "correctness: a contract-guard assertion that cannot fail for the mismatch its test names"
  ],
  "affectedSurfacesSeed": [
    ".skilled/commands/doctor/scripts/tests/doctor-install-contract.test.cjs:239",
    ".skilled/commands/doctor/assets/doctor-install.yaml:46,60",
    ".skilled/commands/doctor/assets/symlink-manifest.json:5-13",
    ".skilled/commands/doctor/assets/doctor-install-presentation.txt:78"
  ],
  "fixCompletenessRequired": false
}
```

## 3. Active Finding Registry

| ID | Severity | Title | Dimension | File:line | Evidence | Impact | Fix recommendation | Disposition | Finding class | Scope proof | Affected surface hints |
|----|----------|-------|-----------|-----------|----------|--------|--------------------|-------------|--------------|-------------|------------------------|
| `MRG12-P2-001` | P2 | The runtime-name contract test's workflow half cannot fail | correctness | `.skilled/commands/doctor/scripts/tests/doctor-install-contract.test.cjs:239` | Test `:237-240`; `doctor-install.yaml:46` (`inputs.runtimes` names no runtime), `:60` (the real list); `symlink-manifest.json:5-13`; 17/17 test run | Drop `dsh` from the Ask list and the suite stays green while the operator prompt disagrees with the manifest | Assert the workflow list against the manifest; drop the phrase-absence line | Open (advisory) | Correctness: guard assertion cannot fail for the named mismatch | Changed lines `239-240`; integration surfaces named by the review brief | Contract test runtime guard, Ask prompt, link manifest |

No finding was resolved or downgraded during the run.

## 4. Remediation Workstreams

**P0:** none.

**P1:** none.

**P2 — advisory, separate from any release gate:**

1. **WS-1 — workflow runtime coverage** (`MRG12-P2-001`). Replace the phrase-absence assertion with a manifest-derived assertion over the workflow's Ask-step list; add the failing case first (drop a runtime name, watch the test stay green), then fix.

## 5. Spec Seed

- REQ-006's doctor clause should name the workflow surface the test must assert; the Ask step (`doctor-install.yaml:60`) is the surface that names runtimes, while `inputs.runtimes` is a help string.
- Keep `symlink-manifest.json` as the single source for both the presentation and the workflow expectation, as the test already does for the presentation.
- The test title "the presentation and the workflow name the accepted runtimes instead of a count" is a good contract; make the assertion match it.

## 6. Plan Seed

1. Add a failing case: remove `dsh` from the Ask list and confirm the contract test still passes (the observed gap).
2. Derive `named` from `symlink-manifest.json` once; assert each name appears in the workflow's Ask step (or assert the exact sentence) and keep the presentation sentence assertion.
3. Delete `assert.doesNotMatch(WORKFLOW.inputs.runtimes, /is not offered/)`; the real assertion subsumes it.
4. Rerun `node --test tests/doctor-install-contract.test.cjs` and keep 17/17 (adding the workflow case raises the count).

## 7. Traceability Status

### Core Protocols

| Protocol | Status | Evidence | Unresolved drift |
|----------|--------|----------|------------------|
| `spec_code` | pass | `039-main-sk-doc-routing-repair/spec.md:133` (REQ-005), `:134` (REQ-006); `generate-router-intent-signals.cjs --check --hub sk-doc` (`added=0, orphans=0`); `skill-graph-freshness.cjs --strict` exit 0; `doctor-install-presentation.txt:78`, `doctor-install.yaml:60`, `symlink-manifest.json:5-13`, `doctor-install-contract.test.cjs:237-240`; 17/17 test run | None for the requirement's observable outcome; the workflow-leg guard is the P2. |
| `checklist_evidence` | pass | `039-main-sk-doc-routing-repair/tasks.md:61` (T011), `:65` (T015); `acceptance-criteria.md:59` (AC-006, `Met`) | T015's wording is wider than the assertion; tracked as `MRG12-P2-001`. |

`AC_COVERAGE`: pass on the packet's own rows; AC-006's evidence is the contract's pass count, which this run reproduces at 17/17.

### Overlay Protocols

| Protocol | Status | Note |
|----------|--------|------|
| `skill_agent` | notApplicable | No agent definition owns or mirrors the sk-doc hub or the doctor contract test. |
| `agent_cross_runtime` | notApplicable | No runtime-mirrored copies for these four files. |
| `feature_catalog_code` | notApplicable | No feature-catalog row describes the merged intents or the test. |
| `playbook_capability` | notApplicable | No playbook scenario covers these files. |

## 8. Deferred Items

- **Out-of-scope merge residue (for lead routing).** The same merge changed `.skilled/skills/sk-doc/sk-create-readme/ROUTER.md`, which still says a repository's install guide is in scope and that the `readme` intent selects "a root-guide template for an install guide" (`:23`, `:47`) after the install template, row and keyword were removed. `.skilled/skills/sk-doc/hub-router.json:254` still lists `security policy` while the hub's `SECURITY_POLICY` intent fires on `security.md` only. Neither path is a `merged` row of `review-scope-12.txt`, so it is recorded here rather than filed as a finding.
- The two `origin/main` merges also regenerated `.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json` and the trigger index; both are outside this area and their freshness checks pass (`--strict` exit 0).
- The open P2 list in `038-alignment-p1-remediation/scratch/alignment-final-dispositions.md` and the open P2 of review passes ten and eleven are already recorded and were not re-reported.
- The recorded limits in `review-brief-12.txt` (suffix-plus-extension, `node -e` arrow, macOS-only isolation, underscore emphasis, textless baseline rows, count-only holdout gate) were treated as settled and not re-opened.

## 9. Dimension Expansion Map

- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated directions: correctness, security, traceability and maintainability were each covered in iterations 1-4; iterations 5 and 6 were protocol completion and residual sweep, producing no new finding.
- Selected review directions: merge equality versus `origin/main` (correctness), authority and disclosure (security), REQ-005/REQ-006 evidence (traceability), clarity and guard cost (maintainability).
- Remaining frontier: none inside the declared scope; the one advisory is a test-strength fix.

## 10. Search Ledger

*No search-depth state captured (legacy v1 record).*

`searchDebt` is empty. Ruled-out directions: a dropped sk-doc mode, a dead `RESOURCE_MAP` path, a stale `intent_signals_generated` orphan, a second command-name divergence, authority widening, a test-side path injection, a false AC-006 mark, a merge-introduced graph drift, a third branch-local merge, a post-merge edit, and a second doctor-test finding. Each was checked by direct read or by the named command.

## 11. Audit Appendix

### Convergence summary

- Stop reason: `converged`, reason detail `all_dimensions_clean`.
- Stop decision at iteration 6: `decision: STOP`, `graphDecision: STOP_ALLOWED`, `blockedBy: []`.
- Iteration ratios: 1.0, 0.0, 0.0, 0.0, 0.0, 0.0. Two `stuckRecovery` passes reflected the trailing zero-ratio window; each recovery start reset the counter, and iteration 6's stop pass found coverage complete.
- Graph: `dimensionCoverage 1.0`, `findingStability 1`, `p0ResolutionRate 1`, `evidenceDensity 1`, `hotspotSaturation 1`.

### Coverage summary

- Dimensions: 4/4 covered.
- Scope files: 4/4, each under all four dimensions.
- Registry: 1 active finding (0 P0, 0 P1, 1 P2), 0 resolved.
- Iterations 1-6: narrative and delta present for each; the state log carries one canonical iteration record per pass plus one graph-convergence event per pass and two recovery-start events.
- The initial coverage graph split each dimension across a seed id (`d-*`) and an iteration id (`dimension:*`), which under-counted coverage (5/8). Iteration 5 added the 16 missing `COVERS` edges for the seed ids; the graph then measured 8/8.

### Ruled-out claims

Listed in section 10; each was tested with a concrete input or source read, not assumed.

### Sources reviewed

- `.skilled/skills/sk-doc/ROUTER.md`
- `.skilled/skills/sk-doc/SKILL.md`
- `.skilled/skills/sk-doc/graph-metadata.json`
- `.skilled/commands/doctor/scripts/tests/doctor-install-contract.test.cjs`
- Context evidence: `.skilled/commands/doctor/assets/symlink-manifest.json`, `doctor-install-presentation.txt`, `doctor-install.yaml`, `.skilled/skills/sk-doc/sk-create-skill/scripts/generate-router-intent-signals.cjs`, `.skilled/commands/doctor/scripts/skill-graph-freshness.cjs`, `039-main-sk-doc-routing-repair/{spec.md,acceptance-criteria.md,tasks.md,implementation-summary.md}`.

### Cross-reference appendix — Core Protocols

`spec_code` and `checklist_evidence`, both pass, with the evidence in section 7 and the advisory caveat in `MRG12-P2-001`.

### Cross-reference appendix — Overlay Protocols

All four overlay protocols are `notApplicable`, with reasons in section 7.

### Caveat for the release decision

The verdict is PASS with `hasAdvisories: true`; the advisory does not block a release gate but should be fixed before the test is treated as the workflow's runtime guard. The authoritative rollup for the fan-out is the cross-lineage merge, which recomputes from the findings registries.

### Dispatch-bound deviation

The workflow's `phase_save` continuity call (`generate-context.js`) was not run: this lineage's dispatch binds every write inside `review/lineages/merged-12` and explicitly forbids that script. The review packet is complete and the lineage files carry the continuity record; the canonical packet continuity save remains for the lead's post-merge step.

### Holdout hygiene

No holdout prompt text was read or printed at any point; no command-prompt corpus was opened, and the holdout gate was read by count only. No `.skilled/hooks/hook-flags.env` read or write occurred.
