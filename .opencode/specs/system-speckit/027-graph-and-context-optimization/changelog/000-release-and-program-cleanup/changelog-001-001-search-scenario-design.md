---
title: "Scenario Design Sub-Phase: 9-Scenario Corpus and Dispatch Matrix"
description: "Complete stress-test design fixture shipped: 9 scenarios across 3 features by 3 prompt types, a 5-dimension scoring rubric, per-CLI dispatch matrix with concrete shell invocations, output schema for run artifacts. Scoring methodology with tie-breaker rules included."
trigger_phrases:
  - "search scenario design changelog"
  - "9 scenario corpus design"
  - "5 dimension scoring rubric"
  - "cli dispatch matrix stress test"
  - "search query intelligence playbook"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-26

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/001-search-intelligence-stress-playbook/001-search-scenario-design` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/001-search-intelligence-stress-playbook`

### Summary

Without a fixed corpus, rubric and dispatch matrix, a stress test of the system-spec-kit Search/Query/Intelligence surfaces devolves into ad-hoc prompting that is non-reproducible and impossible to compare across CLIs or over time. This sub-phase delivered the complete design fixture: 9 scenarios arranged in a 3-feature by 3-prompt-type matrix (Search, Query, Intelligence crossed with Simple, Vague, Specific), a 5-dimension scoring rubric using a 0-2 scale (correctness, tool selection, latency, token efficiency, hallucination), a per-CLI dispatch matrix with copy-paste shell invocations, an output schema covering `meta.json` and `score.md` formats. Scoring methodology with tie-breaker rules completed the fixture. Five of the nine scenarios cross-reference known defects from sibling packet 005, so runs with different CLIs can reveal whether each CLI hits or avoids those bugs. Dispatch scripts were authored alongside the corpus design.

### Added

- 9-scenario corpus in `spec.md` covering Search S1-S3, Query Q1-Q3, Intelligence I1-I3 with prompts, expected outputs, required tool calls, scoring indicators, defect cross-references
- 5-dimension scoring rubric with 0/1/2 anchors for each dimension in `spec.md`
- Per-CLI dispatch matrix with concrete shell invocations for cli-codex, cli-copilot (gpt-5.4), cli-opencode in `spec.md`
- Output schema defining `meta.json` and `score.md` field names in `spec.md`
- Scoring methodology with single-scorer convention and second-reviewer rule for outliers in `spec.md`
- Dispatch scripts `scripts/dispatch-cli-codex.sh`, `scripts/dispatch-cli-copilot.sh`, `scripts/dispatch-cli-opencode.sh` plus orchestrator `scripts/run-all.sh`

### Changed

- None.

### Fixed

- None.

### Verification

| Check | Result |
|-------|--------|
| 9 scenarios documented | PASS. See `spec.md` section Scenario Corpus. |
| 5-dim rubric documented | PASS. See `spec.md` section Scoring Rubric. |
| Dispatch matrix per CLI | PASS. See `spec.md` section Dispatch Matrix. |
| Output schema documented | PASS. See `spec.md` section Output Schema. |
| Scoring methodology | PASS. See `spec.md` section Scoring Methodology. |
| Dispatch scripts present on disk | PASS. `scripts/dispatch-cli-codex.sh`, `dispatch-cli-copilot.sh`, `dispatch-cli-opencode.sh`, `run-all.sh` all present. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `spec.md` | Create (NEW) | Full corpus. rubric. dispatch matrix. output schema. scoring methodology. |
| `plan.md` | Create (NEW) | Authoring methodology for the sub-phase. |
| `tasks.md` | Create (NEW) | T001-T112 work units covering corpus, rubric, matrix, schema, scripts. |
| `scripts/dispatch-cli-codex.sh` | Create (NEW) | Shell wrapper to dispatch a scenario against cli-codex and capture output. |
| `scripts/dispatch-cli-copilot.sh` | Create (NEW) | Shell wrapper with concurrency guard for cli-copilot (gpt-5.4). |
| `scripts/dispatch-cli-opencode.sh` | Create (NEW) | Shell wrapper for cli-opencode agent-context invocations. |
| `scripts/run-all.sh` | Create (NEW) | Orchestrator that runs all three dispatch wrappers in sequence for a given scenario. |

### Follow-Ups

- Run a smoke test: dispatch S1 (Search-Simple) against each CLI manually and confirm output capture format matches `meta.json` and `score.md` schemas before locking corpus v1.0.0.
- Recalibrate latency thresholds (10s fast, 60s slow) after the first full sweep. All cells scoring 0 on latency would indicate the thresholds need adjustment.
- Evaluate extending cli-copilot coverage beyond gpt-5.4 to additional models in a v2 pass per the decision record.
- Consider adding N=3 repetitions per scenario (REQ-009) to separate systematic failures from variance once baseline data exists.
