# Deep Review Report — Benchmark Naming and Playbook Results

## 1. Executive Summary

- Verdict: **CONDITIONAL**
- Stop reason: `maxIterationsReached`
- Active findings: P0=0, P1=3, P2=0
- hasAdvisories: false
- Scope: the target packet, the benchmark storage authority, manual-playbook storage contract, Lane C writer/index, compiled-routing archive and snapshot integration, and the target's frozen rename map.

Five iterations completed under `stopPolicy=max-iterations`. Convergence signals were telemetry only; the review reached full primary-dimension coverage plus an adversarial-replay expansion pass but did not synthesize an early clean stop. The three active P1 findings span the default writer, the storage contract, and the snapshot consumer, and all survived counterevidence replay.

## 2. Planning Trigger

`/speckit:plan` is required before treating the packet as release-ready because three active P1 findings span the default writer, the storage contracts, and the snapshot consumer.

```json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": false,
  "activeFindings": ["P1-001", "P1-002", "P1-003"],
  "remediationWorkstreams": ["collision-safe default output allocation", "single canonical report-folder contract", "dated parity archive discovery"],
  "specSeed": ["Define same-day output collision behavior.", "Choose the canonical report-folder file set, filename, and location.", "Document and implement dated parity-baseline discovery."],
  "planSeed": ["Add collision tests for default paths.", "Align storage docs, writer outputs, and test assertions to one layout.", "Replace fixed parity-label lookup and add snapshot regression coverage."],
  "findingClasses": ["cross-consumer"],
  "affectedSurfacesSeed": ["Lane C writer", "create-benchmark", "manual testing playbook", "serving snapshot renderer"],
  "fixCompletenessRequired": true
}
```

## 3. Active Finding Registry

### P1-001 — Default dated folders can overwrite same-day evidence

- Dimension: correctness
- Evidence: `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:398-402` (with `runFolderName()` at `:112-119` and `defaultOutputsDir()` at `:138-143`)
- Impact: the default date/subject/variant name has no occupancy guard or trailing disambiguator before `fs.mkdirSync(outputsDir, { recursive: true })` and the direct report/companion writes, so a same-day run can replace prior evidence. The owning grammar (`create-benchmark/SKILL.md:312`) and the spec edge case (`spec.md:181`) both require a same-day trailing disambiguator. The archiver (`archive-compiled-routing.cjs:167-169`) IS collision-safe, so the asymmetry is real and not a project-wide convention.
- Recommendation: allocate a unique trailing suffix before creating the directory, or fail closed and require an explicit disambiguator; mirror the collision guard already present in `archive-compiled-routing.cjs`.

### P1-002 — Published report contract does not describe the emitted folder

- Dimension: traceability
- Evidence: `.opencode/skills/sk-doc/create-benchmark/SKILL.md:459-498`; `.opencode/skills/sk-doc/create-manual-testing-playbook/SKILL.md:243-256`; `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:539-563`
- Impact: the owner's "Storage Shape" (`SKILL.md:459-476`) places a run folder directly under `benchmark/<run-label>/` containing only `skill-benchmark-report.{json,md}`. The owner's "reports layer" (`SKILL.md:489-498`) declares six files including `benchmark-report.md`. The writer (`run-skill-benchmark.cjs:539-563`) emits seven files including `skill-benchmark-report.{json,md}` under `benchmark/reports/<run-label>/`. The playbook contract agrees with the writer. The owner's `benchmark-report.md` is named by no writer anywhere. Three surfaces, three different declarations.
- Recommendation: choose one canonical folder shape (six or seven files, `benchmark-report.md` or `skill-benchmark-report.md`, under `benchmark/` or under `benchmark/reports/`), then align all producer and consumer surfaces, the storage guide, the README templates, and the test assertions to that one shape.

### P1-003 — Serving snapshots still look for a retired non-dated parity label

- Dimension: traceability
- Evidence: `.opencode/skills/sk-doc/create-benchmark/scripts/render-serving-snapshot.cjs:121-134` (with the dated-discovery sibling at `:145-170`)
- Impact: `scanParityBaseline()` hardcodes `label = 'router-compiled-parity-baseline'` and reads `<skillsRoot>/<hubId>/benchmark/compiled-routing/<label>/skill-benchmark-report.json`. Under the dated grammar this packet declares, new archives are named `<YYYY-MM-DD>--<subject>--<variant>`, so a freshly archived parity run cannot satisfy the fixed lookup. The snapshot will report `parityBaseline.present = false` for a hub whose dated parity archive exists. The same file's `scanRealModelLast()` demonstrates the dated-discovery pattern is already implemented for the real-model lane, so the fix has precedent.
- Recommendation: persist or derive the dated parity-baseline label (mirror `scanRealModelLast`'s directory scan), update the snapshot schema, README, and any snapshot consumer that reads `parityBaseline`.

## 4. Remediation Workstreams

1. Make the default output allocator collision-safe and add same-day rerun coverage. Mirror the guard already present in `archive-compiled-routing.cjs:167-169`.
2. Reconcile the six-versus-seven-file contract, the `benchmark-report.md`-versus-`skill-benchmark-report.md` filename, the `benchmark/<run-label>/`-versus-`benchmark/reports/<run-label>/` location, and the test assertions. Pick one layout and align the owner, the playbook contract, the writer, the storage guide, and the README templates.
3. Replace the fixed parity-baseline lookup with dated archive discovery (mirror `scanRealModelLast` in the same file) and migrate dependent documentation and snapshot consumers.

## 5. Spec Seed

- State whether a repeated same-day execution gets a stable suffix or a fail-closed error, and require it of the default writer (not just the archiver).
- Declare the exact report-file list, the exact report filename, and whether the run folder lives under `benchmark/` or under `benchmark/reports/`. State the relationship between a raw run folder and a curated reports folder if both exist.
- Declare the parity-baseline selection rule under the dated convention; `baseline/` remains the only existing carve-out unless a second one (e.g. `router-compiled-parity-baseline`) is explicitly approved.

## 6. Plan Seed

- Add a regression that executes two default same-day runs for the same subject/variant and asserts neither output is lost.
- Add a single shared layout fixture consumed by storage docs, playbook docs, and runner tests, and assert the writer's emitted file list against it.
- Archive a dated parity run, render the serving snapshot, and assert the snapshot identifies that run via dated discovery rather than the hardcoded label.

## 7. Traceability Status

### Core Protocols

| Protocol | Status | Evidence |
|---|---|---|
| `spec_code` | fail | P1-001 through P1-003 contradict target or owner claims. |
| `checklist_evidence` | fail | Completion rows (`tasks.md:51`, `checklist.md:109-118,167-175`) assert a six-file default-path contract the writer does not produce and a default-path collision claim the writer does not guard. |

### Overlay Protocols

| Protocol | Status | Evidence |
|---|---|---|
| `playbook_capability` | fail | Manual playbook contract publishes a different report layout from the owner. |
| `feature_catalog_code` | notApplicable | No feature catalog was in the declared target. |
| `skill_agent` | notApplicable | Target is a spec folder, not an agent contract. |
| `agent_cross_runtime` | notApplicable | Target is a spec folder, not an agent contract. |

AC_COVERAGE: exempt. The packet lifecycle does not provide an active acceptance-coverage gate for this detached review.

## 8. Deferred Items

- Existing plural benchmark roots and the uppercase `SOURCE.md` question remain out of scope, as the target spec states (`spec.md:222-227`).
- No P2 advisories were recorded.

## Dimension Expansion Map

- Primary dimensions covered: correctness, security, traceability, maintainability.
- Expanded final pass: adversarial replay of all active P1 evidence, completion claims, and a missed-P0 search across path traversal, secret leakage, frozen-anchor overwrite, manifest-source spoofing, topology drift, and frozen-scorer drift.
- Completed pivots: 0. Remaining frontier: remediation verification after fixes.

## 9. Search Ledger

No search-depth state captured (legacy v1 records). Direct reads and exact repository searches were used because the code graph was unavailable.

## 10. Audit Appendix

- Iterations: 5 of 5.
- Finding trajectory: 1 P1 in correctness (iteration 1), 0 security findings (iteration 2), 2 additional traceability P1s (iteration 3), a maintainability confirmation that the focused test passes alongside all three drifts (iteration 4), then an adversarial-replay pass with no new finding classes and no missed P0 (iteration 5).
- Reducer state: three active P1 findings; all four primary dimensions covered; JSONL parsed without corruption.
- Target-facing focused test: `npx vitest run .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/run-storage-convention.vitest.ts` covers companion emitter shape, naming pattern, index behavior, and Python/JS index parity, but does not cover any of the three active drifts.
- Resource Map Coverage Gate: skipped because `resource-map.md` was absent at initialization. The lineage still emitted its delta-derived `resource-map.md` evidence artifact.
- Replay validation: recomputed `newFindingsRatio` and gate outcomes from the stored JSONL agree with the recorded synthesis event. Convergence telemetry (rolling average, MAD, dimension coverage) reached STOP territory by iteration 4 but was retained as telemetry per `stopPolicy=max-iterations`; the legal-stop decision tree correctly returned `maxIterationsReached` at iteration 5.
