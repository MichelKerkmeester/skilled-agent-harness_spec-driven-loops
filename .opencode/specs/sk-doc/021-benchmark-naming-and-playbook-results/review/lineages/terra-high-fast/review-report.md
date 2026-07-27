# Deep Review Report — Benchmark Naming and Playbook Results

## 1. Executive Summary

- Verdict: **CONDITIONAL**
- Stop reason: `maxIterationsReached`
- Active findings: P0=0, P1=3, P2=0
- hasAdvisories: false
- Scope: the target packet, the benchmark storage authority, manual-playbook storage contract, Lane C writer/index, compiled-routing archive and snapshot integration, and the target's frozen rename map.

Five iterations completed under `stopPolicy=max-iterations`. Convergence signals were telemetry only; the review reached full primary-dimension coverage but did not synthesize an early clean stop.

## 2. Planning Trigger

`/speckit:plan` is required before treating the packet as release-ready because three active P1 findings span the default writer, storage contracts, and snapshot consumer.

```json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": false,
  "activeFindings": ["P1-001", "P1-002", "P1-003"],
  "remediationWorkstreams": ["collision-safe default output allocation", "single report-folder contract", "dated parity archive discovery"],
  "specSeed": ["Define same-day output collision behavior.", "Choose the canonical report-folder file set.", "Document and implement dated parity-baseline discovery."],
  "planSeed": ["Add collision tests for default paths.", "Align storage docs and writer outputs.", "Replace fixed parity-label lookup and add snapshot regression coverage."],
  "findingClasses": ["cross-consumer"],
  "affectedSurfacesSeed": ["Lane C writer", "create-benchmark", "manual testing playbook", "serving snapshot renderer"],
  "fixCompletenessRequired": true
}
```

## 3. Active Finding Registry

### P1-001 — Default dated folders can overwrite same-day evidence

- Dimension: correctness
- Evidence: `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:398`
- Impact: the default date/subject/variant name has no suffix or occupancy guard before direct writes, so a same-day run can replace prior evidence.
- Recommendation: allocate a durable suffix or fail closed before writes.

### P1-002 — Published report contract does not describe the emitted folder

- Dimension: traceability
- Evidence: `.opencode/skills/sk-doc/create-benchmark/SKILL.md:486`; `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:539`
- Impact: the owner promises six files and `benchmark-report.md`; the runtime and playbook contract describe seven files with a `skill-benchmark-report.*` pair.
- Recommendation: choose and test one canonical folder shape, then align all producer and consumer surfaces.

### P1-003 — Serving snapshots still look for a retired non-dated parity label

- Dimension: traceability
- Evidence: `.opencode/skills/sk-doc/create-benchmark/scripts/render-serving-snapshot.cjs:122`
- Impact: a dated archive cannot satisfy the fixed old-label lookup, so snapshots can report that parity evidence is absent when it exists.
- Recommendation: persist or derive the dated parity label and update its schema, README, and snapshot consumers.

## 4. Remediation Workstreams

1. Make the default output allocator collision-safe and add same-day rerun coverage.
2. Reconcile the six-versus-seven-file contract, filenames, index semantics, and test assertions.
3. Replace the fixed parity-baseline lookup with dated archive discovery and migrate dependent documentation.

## 5. Spec Seed

- State whether a repeated same-day execution gets a stable suffix or a fail-closed error.
- Declare the exact report-file list and whether the machine JSON is inside the curated folder.
- Declare the parity-baseline selection rule under the dated convention; `baseline/` remains the only existing carve-out unless a second one is explicitly approved.

## 6. Plan Seed

- Add a regression that executes two default same-day runs for the same subject/variant and asserts neither output is lost.
- Add a single shared layout fixture consumed by storage docs, playbook docs, and runner tests.
- Archive a dated parity run, render the serving snapshot, and assert the snapshot identifies that run.

## 7. Traceability Status

### Core Protocols

| Protocol | Status | Evidence |
|---|---|---|
| `spec_code` | fail | P1-001 through P1-003 contradict target or owner claims. |
| `checklist_evidence` | fail | Completion rows claim derived snapshot paths and a six-file shape without evidence matching current code. |

### Overlay Protocols

| Protocol | Status | Evidence |
|---|---|---|
| `playbook_capability` | fail | Manual playbook contract publishes a different report layout from the owner. |
| `feature_catalog_code` | notApplicable | No feature catalog was in the declared target. |
| `skill_agent` | notApplicable | Target is a spec folder, not an agent contract. |
| `agent_cross_runtime` | notApplicable | Target is a spec folder, not an agent contract. |

AC_COVERAGE: exempt. The packet lifecycle does not provide an active acceptance-coverage gate for this detached review.

## 8. Deferred Items

- Existing plural benchmark roots and the uppercase `SOURCE.md` question remain out of scope, as the target spec states.
- No P2 advisories were recorded.

## Dimension Expansion Map

- Primary dimensions covered: correctness, security, traceability, maintainability.
- Expanded final pass: adversarial replay of all active P1 evidence and completion claims.
- Completed pivots: 0. Remaining frontier: remediation verification after fixes.

## 9. Search Ledger

No search-depth state captured (legacy v1 records). Direct reads and exact repository searches were used because the code graph was unavailable.

## 10. Audit Appendix

- Iterations: 5 of 5.
- Finding trajectory: 1 P1 in correctness, 0 security findings, 2 additional traceability P1s, then two replay passes with no new finding classes.
- Reducer state: three active P1 findings; all four primary dimensions covered; JSONL parsed without corruption.
- Target-facing focused test: `npx vitest run .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/run-storage-convention.vitest.ts` exited 0.
- Resource Map Coverage Gate: skipped because `resource-map.md` was absent at initialization. The lineage still emitted its delta-derived `resource-map.md` evidence artifact.
