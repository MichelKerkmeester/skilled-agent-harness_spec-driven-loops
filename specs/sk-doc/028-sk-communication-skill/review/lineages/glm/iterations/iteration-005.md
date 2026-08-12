# Iteration 5: Stabilization / adversarial replay + broaden to under-reviewed surfaces

## Focus
Stabilization pass under `stopPolicy=max-iterations` (convergence is telemetry only). (1) Adversarially re-verify the two active P1 findings (F001, F004) against the cited evidence to confirm they are not false positives. (2) Broaden to under-reviewed surfaces: `description.json`, per-feature catalog files, per-scenario playbook files, `leaf-aliases.json` content — to ensure no missed P0/P1 before synthesis.

## Scorecard
- Dimensions covered: traceability + maintainability (stabilization)
- Files reviewed: 6
- New findings: P0=0 P1=0 P2=0
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.07

## Findings

### P0, Blocker
(none)

### P1, Required
(none — both existing P1 findings (F001, F004) re-confirmed active; no new P1.)

### P2, Suggestion
(none new this iteration.)

## Adversarial P1 Replay

### F001 replay (correctness, P1)
- **Re-read evidence**: `rg -n '"\./clients"' packages/cli-communication-projection/package.json` → no match. `./clients` is still absent from the package.json exports map. `SKILL.md:130` and `README.md:61` still list `./clients` as a public subpath export. `src/clients/` still exists on disk but is not exported.
- **Counterevidence sought**: Checked whether a `./clients` export was added since iteration 1 — no. Checked whether the sentence at SKILL.md:130 was rephrased to describe internal subsystem paths rather than public subpath exports — no, it still says "subpath exports".
- **Alternative explanation reconsidered**: Could the package be intending to export `./clients` in a future release? Even if so, the current package.json does not export it, so the current skill doc is wrong against the current package. Rejected.
- **Verdict**: F001 stands at P1. Not a false positive.

### F004 replay (traceability, P1)
- **Re-read evidence**: `ls .opencode/skills/sk-communication/benchmark/reports/` → only `README.md`, no dated-run-label directory. `tasks.md:68` still claims `[evidence: ... advisor returns sk-communication as the top match]` as prose, not a persisted artifact. `playbook.md:11-12` still requires persistence via `run-manual-playbook-scenario.cjs`.
- **Counterevidence sought**: Checked whether a dated run directory was created since iteration 3 — no. Checked whether tasks.md:68 evidence was rephrased to cite a warm advisor capture — no.
- **Alternative explanation reconsidered**: Could the interactive advisor smoke during authoring count as evidence without persistence? Rejected: the playbook's MANUAL_PLAYBOOK_RESULT_PERSISTENCE_CONTRACT explicitly requires persistence for completion.
- **Verdict**: F004 stands at P1. Not a false positive.

## Broadening to Under-Reviewed Surfaces

### `specs/sk-doc/028-sk-communication-skill/description.json`
- Well-formed: `level: 1`, `specFolder: sk-doc/028-sk-communication-skill`, `specId: 028`, `parentChain: ["sk-doc"]`, `keywords` populated, `lastUpdated` set. No P0/P1 issues.

### Per-feature catalog files (spot check)
- `feature-catalog/runtime-adapters/six-runtime-adapter-matrix.md` — 67 lines, substantive (not a stub).
- `feature-catalog/evaluation-and-observability/content-free-observability.md` — 62 lines, substantive, cites `src/observability/redaction.ts`.
- Confirms `feature_catalog_code` pass at the per-file level, not just the index.

### Per-scenario playbook files (spot check)
- `manual-testing-playbook/release-gating/human-certified-bundle-gates-release.md` — 80 lines, substantive (prompt, commands, signals, verdict criteria).
- Confirms `playbook_capability` scenarios are backed by real per-scenario files.

### `leaf-aliases.json` content
- 20 entries, each with `workflowMode`, `leafResourceId`, `diskPath`. Parity with `leaf-manifest.json` 20 leaves holds. No P0/P1 issues.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | F001 re-confirmed | P1 stands |
| checklist_evidence | fail | hard | F004 re-confirmed | P1 stands |
| feature_catalog_code | pass | advisory | per-file spot check | 11 files substantive |
| playbook_capability | partial | advisory | per-file spot check | 8 files substantive; F008 coverage gap stands |

## Assessment
- New findings ratio: 0.07
- Dimensions addressed: traceability + maintainability (stabilization)
- Novelty justification: Stabilization pass re-confirms both P1 findings against cited evidence (neither is a false positive) and broadens to under-reviewed surfaces (description.json, per-feature files, per-scenario files, leaf-aliases content). No new P0/P1 surfaced. All four dimensions are covered; composite convergenceScore ~0.82 (telemetry only, does not end run under max-iterations). Ready for synthesis.

## Ruled Out
- F001 as false positive: `./clients` still absent from package.json exports; P1 stands.
- F004 as false positive: no persisted advisor run in benchmark/reports/; P1 stands.
- Per-feature catalog files as stubs: spot-checked files are 62–67 lines, substantive.
- Per-scenario playbook files as stubs: spot-checked file is 80 lines, substantive.
- description.json malformed: well-formed, level 1, parentChain set.

## Dead Ends
- None this iteration.

## Recommended Next Focus
Synthesis — compile `review-report.md` (9 core sections; Resource Map Coverage Gate skipped because `resource_map_present=false`). Verdict: CONDITIONAL (active P1 F001, F004; no P0). Release-readiness: in-progress (blocked from converged by active P1).

Review verdict: PASS
