---
title: "Stress-Test Playbook 002: Search Scenario Execution"
description: "30-cell cross-CLI stress-test executed against the 001 dispatch matrix. All cells scored and synthesized into findings.md. One net-new defect class discovered: model-side hallucination when memory_search returns low-confidence results."
trigger_phrases:
  - "search scenario execution stress test"
  - "cross-CLI scoring stress playbook"
  - "model hallucination weak retrieval findings"
  - "MCP runtime stress execution results"
  - "cli-opencode cli-codex cli-copilot playbook run"
importance_tier: "important"
contextType: "research"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-18

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/001-search-intelligence-stress-playbook/002-search-scenario-execution` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/001-search-intelligence-stress-playbook`

### Summary

The 001 design packet defined the corpus, rubric and dispatch matrix but produced no signal without an execution harness. This sub-phase scaffolded the four-stage run contract (pre-flight, dispatch loop, manual scoring, findings aggregation) and then executed the full sweep.

All 30 cells completed with zero dispatch failures: 27 base cells (9 scenarios across cli-codex, cli-copilot and cli-opencode) plus 3 cli-opencode --pure ablation cells in 43 minutes wall-clock. Per-CLI averages under the initial rubric (v1.0.0) were cli-codex 5.67/10, cli-opencode 5.67/10, cli-opencode --pure 5.33/10 and cli-copilot 4.22/10. A rubric amendment (v1.0.1) dropped the unreachable Token Efficiency dimension and recalibrated Latency thresholds, raising the field mean to 77% and narrowly placing cli-opencode first at 6.67/8.

The synthesis surfaced one net-new defect class not captured in 005: when `memory_search` returns `recovery.status="low_confidence"` with no suggested queries, cli-opencode fabricated file paths and packet IDs rather than broadening or stopping. A second process-safety finding flagged cli-copilot in `--allow-all-tools` mode as dangerous for vague-intent prompts after the I1 cell consumed 2.1M tokens and mutated an unrelated spec folder.

### Added

None. Research-only phase.

### Changed

None. Research-only phase.

### Fixed

None. Research-only phase.

### Verification

| Check | Result |
|-------|--------|
| All 30 cells in `runs/` have `meta.json` with `exit_code 0` | PASS |
| All 30 cells have `score.md` with rubric scores and narrative | PASS |
| `findings.md` present with all required sections | PASS. Sections: Executive Summary, Per-Scenario Comparison, Top 3 Wins per CLI, Top 3 Failures per CLI, Cross-Reference to 005 Defects, Recommendations |
| Per-CLI averages computed and documented | PASS. cli-codex 5.67/10, cli-opencode 5.67/10, cli-opencode --pure 5.33/10, cli-copilot 4.22/10 (v1.0.0). v1.0.1 normalized: opencode 83.3%, codex 81.9%, copilot 63.9% |
| Net-new insight not already in 005 | PASS. Model-side hallucination on weak retrievals identified as candidate 005/REQ-018 |
| I1/cli-copilot unrelated-folder mutation reverted | PASS. Documented in findings.md Recommendation 2 |
| Strict spec validation (`validate.sh --strict`) | 0 errors, 1 non-blocking warning (custom domain section headers in spec.md) |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `spec.md` | Create | Execution scaffold, run schema, findings format |
| `plan.md` | Create | 4-stage flow, concurrency strategy, scoring workflow |
| `tasks.md` | Create | T001-T504 work units (T001-T006 scaffold complete, T101-T504 executed by sweep) |
| `implementation-summary.md` | Create | Sub-phase outcome summary |
| `description.json` | Create | Indexer metadata |
| `graph-metadata.json` | Create | Graph traversal metadata |
| `runs/*/cli-*-1/prompt.md` (NEW) | Create | 30 captured prompts, one per cell |
| `runs/*/cli-*-1/output.txt` (NEW) | Create | 30 captured CLI stdout and stderr, one per cell |
| `runs/*/cli-*-1/meta.json` (NEW) | Create | 30 timing, token and exit-code records |
| `runs/*/cli-*-1/score.md` (NEW) | Create | 30 manual rubric scores with narrative |
| `runs/run-all.log` (NEW) | Create | Sweep orchestrator log, 43 minutes wall-clock |
| `findings.md` (NEW) | Create | Cross-CLI synthesis with per-CLI averages, per-scenario table, top wins and failures, 005 cross-reference table, rubric v1.0.1 amendment and 6 recommendations |

### Follow-Ups

- File the model-side hallucination defect (suggested 005/REQ-018) for the next remediation packet. This is a distinct failure mode from REQ-007 (broaden) and REQ-008 (no auto-bind).
- Tighten cli-copilot dispatch to scoped prompts or read-only mode for vague-intent cells. The I1 mutation of 048-cli-testing-playbooks is a process-safety regression risk in real workflows.
- Re-run the sweep after 005 Cluster 1-3 P0 fixes go live in the running daemon (dist rebuild plus daemon restart). The current sweep measured the pre-fix runtime.
- Calibrate Latency thresholds based on the observed distribution. Under v1.0.0, zero cells scored above 0 on Latency. v1.0.1 recalibration addresses this gap.
- Expand to N=3 per cell if signal proves noisy across multiple sweeps, per parent REQ-009.
