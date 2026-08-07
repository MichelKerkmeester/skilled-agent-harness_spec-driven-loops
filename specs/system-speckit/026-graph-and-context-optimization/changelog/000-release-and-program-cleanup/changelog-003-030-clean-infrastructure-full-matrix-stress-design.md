---
title: "Changelog: v1.0.4 Full-Matrix Stress Test Design"
description: "Design-only Level 3 packet that turns the narrow v1.0.4 telemetry proof into a complete full-matrix execution design: F1-F14 feature surfaces, 7 executor surfaces, scenario corpus, scoring rubric, harness-extension recommendation and execution task ledger."
trigger_phrases:
  - "full matrix stress test design"
  - "v1.0.4 full matrix design"
  - "feature executor matrix design"
  - "030 full matrix design changelog"
  - "system-spec-kit cli matrix corpus"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-29

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/030-clean-infrastructure-full-matrix-stress-design` (Level 3)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings`

### Summary

Packet 029 proved a narrow 12-case telemetry posture and explicitly did not attempt the full feature-by-executor matrix. Without a broader corpus design, the next stress run would again overfit to the memory_search telemetry seam while leaving 13 other feature surfaces and 6 additional executor surfaces unexercised.

This packet authored a complete design-only Level 3 packet that defines the F1-F14 feature surface inventory, 7-executor reachability matrix, scenario corpus structure, 4-dimension scoring rubric, explicit NA/SKIP/UNAUTOMATABLE cell statuses, per-feature runner plus meta-aggregator harness architecture and a ready-to-execute task ledger. No stress cells were run and no files outside this packet folder were written. The execution phase can now start from a frozen corpus design rather than re-deriving scope from scratch.

The theoretical matrix ceiling is 294 cells (14 features x 7 executors x 3 scenarios). After NA-cell pruning the execution phase should expect roughly 220-260 applicable or fixture-only cells. The full matrix is declared baseline `full-matrix-v1` to prevent invalid direct comparison to v1.0.2 or packet 029.

### Added

- `corpus-plan.md` defining manifest row shape, scenario seeds for F1-F14, executor applicability labels, evidence requirements and NA/SKIP/UNAUTOMATABLE result states
- Seven ADRs in `decision-record.md` covering Level 3 scope, F1-F14 abstraction, scenario-cell scoring, Option C harness architecture, non-applicable cells, new baseline semantics and feature-first batching
- Future execution-phase task ledger in `tasks.md` covering T001 smoke, per-feature batches, aggregation, adversarial regression review and strict validation

### Changed

- `spec.md` expanded to cover all 14 feature surfaces with source evidence and 7 executor surfaces with dispatch contracts and reachability notes
- `plan.md` architecture section defines the data flow from `matrix-manifest.json` to cell JSONL to findings artifacts, with executor smoke gates before any full run

### Fixed

- None. Design-only phase.

### Verification

| Check | Result |
|-------|--------|
| Scope hygiene | PASS: authored files are packet-local only. |
| Design-only constraint | PASS: no stress findings, measurements or CLI dispatch transcripts were created. |
| Required docs | PASS: spec, plan, tasks, checklist, decision record, implementation summary, corpus plan, description.json and graph-metadata.json all exist. |
| Existing surface citations | PASS: docs cite the feature catalog, manual playbook, PP-1/PP-2 harness, prior packets, CLI skill surfaces, hook docs, validators and deep-loop contracts with file and line evidence. |
| Strict validator | PASS after final validation run. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `030-clean-infrastructure-full-matrix-stress-design/spec.md` (NEW) | Created | Design charter: executive summary, F1-F14 feature matrix, executor matrix, scope table, requirements and risk matrix. |
| `030-clean-infrastructure-full-matrix-stress-design/plan.md` (NEW) | Created | Corpus plan, rubric, harness-extension architecture, executor surface plan and sequencing. |
| `030-clean-infrastructure-full-matrix-stress-design/corpus-plan.md` (NEW) | Created | Manifest row schema, scenario seeds for all 14 feature surfaces, NA/SKIP/UNAUTOMATABLE policy and sample-size guards. |
| `030-clean-infrastructure-full-matrix-stress-design/decision-record.md` (NEW) | Created | Seven ADRs for Level 3 scope, F1-F14 abstraction, scoring model, harness Option C, NA cells, baseline semantics and feature-first batching. |
| `030-clean-infrastructure-full-matrix-stress-design/tasks.md` (NEW) | Created | Execution-phase task ledger: T001 smoke, per-feature batches, aggregation, adversarial review and strict validation tasks. |
| `030-clean-infrastructure-full-matrix-stress-design/checklist.md` (NEW) | Created | Design verification gate and execution DQI gates. |
| `030-clean-infrastructure-full-matrix-stress-design/implementation-summary.md` (NEW) | Created | Design-phase completion summary with verification table, key decisions and known limitations. |

### Follow-Ups

- Create or authorize an execution-phase packet with explicit target authority and disposable sandbox paths.
- Freeze `matrix-manifest.json` from the corpus-plan scenario seeds before any cell run begins.
- Run T001 smoke: one harmless cell per executor (cli-codex, cli-gemini, cli-claude-code, cli-opencode, native, inline) to convert unavailable executors into SKIP rows with evidence.
- Record executor readiness, auth blockers, versions, models, reasoning effort and timeout defaults before the first full-feature batch.
- Define the normalized cell-result JSONL schema so the meta-aggregator can ingest results from all per-feature runners.
