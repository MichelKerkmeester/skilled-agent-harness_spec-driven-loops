---
title: "Code Graph Playbook 001: OpenCode Live-Runtime Scenario Validation"
description: "15 live-runtime code-graph playbook scenarios dispatched through cli-opencode (deepseek-v4-pro). Result: 11 PASS, 0 FAIL, 4 SKIP. The 4 skips share one root cause: tree-sitter parser quarantine (F-RUNTIME-2) blocked fresh-workspace scans after Batch A. All readiness-gate logic was confirmed working through scenarios 007 and 008."
trigger_phrases:
  - "opencode runtime scenario validation"
  - "code graph playbook 001"
  - "parser quarantine finding"
  - "live mcp scenario dispatch"
  - "deepseek code graph scenarios"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-27

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/010-playbook-validation-and-hardening/001-opencode-runtime-scenarios` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/010-playbook-validation-and-hardening`

### Summary

The code-graph MCP tools (`mk_code_index` scan, query, verify, status, context, detect_changes) are not registered in the Claude Code runtime, so 15 of 22 playbook scenarios could not be run from the orchestrating agent directly. A dispatch harness using `cli-opencode` with `deepseek/deepseek-v4-pro` was built to run those 15 scenarios inside the full OpenCode MCP runtime and capture per-scenario evidence.

The run produced 11 PASS, 0 FAIL. 4 scenarios were skipped (002, 005, 022, 024). All 4 skips share a single root cause: after Batch A successfully indexed 52 files and 1996 nodes, subsequent fresh-workspace scan attempts returned `zero_node_scan_rejected` because the tree-sitter parser became globally quarantined (F-RUNTIME-2). Readiness-gate logic that the skipped scenarios were meant to test was confirmed working through scenarios 007 and 008, which exercised the same broad-stale block path via a different precondition route.

Two additional findings were logged: F-RUNTIME-1 (scope-safety, `code_graph_scan` refuses `/tmp` paths so disposable workspaces must live under the repo root) and F-011-1 (a stale playbook expectation for `code_graph_verify` with a `rating` field that no longer exists in the schema).

### Added

- `evidence.md` verdict table with 15 rows. Each row carries a PASS/FAIL/SKIP verdict with a reason linked to a `scratch/evidence-*.json` file
- `scratch/dispatch-*.md` rendered dispatch prompts for each batch (9 files)
- `scratch/evidence-*.json` and `scratch/evidence-*.log` captured JSON event streams and stderr logs (14 files across batches 006, A, B, B2, B3, C, E)
- Two runtime findings logged in `evidence.md`: F-RUNTIME-1 (scope-safety) and F-RUNTIME-2 (parser quarantine)

### Changed

- None. Evidence-capture only phase.

### Fixed

- None. Evidence-capture only phase.

### Verification

| Check | Result |
|-------|--------|
| 15/15 scenario verdicts recorded | PASS (11 PASS, 0 FAIL, 4 SKIP) |
| Each SKIP cites root cause | PASS (all 4 cite F-RUNTIME-2) |
| Each PASS cites JSON field evidence | PASS (all cite `scratch/evidence-*.json`) |
| No secrets in dispatch prompts | PASS (no API keys echoed) |
| No `--dangerously-skip-permissions` used | PASS |
| No live source files edited | PASS |
| Mutating scenarios (003, 004) ran on disposable workspace | PASS |
| Malformed-call scenario 011 shows field-specific errors | PASS (F-011-1 finding logged) |

### Files Changed

| File | What changed |
|------|--------------|
| `001-opencode-runtime-scenarios/evidence.md` (NEW) | 15-row verdict table with per-scenario PASS/FAIL/SKIP verdicts. Each row cites a reason and evidence link. |
| `001-opencode-runtime-scenarios/scratch/dispatch-006-status-readonly.md` (NEW) | Dispatch prompt for scenario 006 |
| `001-opencode-runtime-scenarios/scratch/dispatch-batchA-004-003.md` (NEW) | Dispatch prompt for Batch A (scenarios 003, 004) |
| `001-opencode-runtime-scenarios/scratch/dispatch-batchB-001-002-005.md` (NEW) | Dispatch prompt for Batch B (scenarios 001, 002, 005) |
| `001-opencode-runtime-scenarios/scratch/dispatch-batchC-007-008.md` (NEW) | Dispatch prompt for Batch C (scenarios 007, 008) |
| `001-opencode-runtime-scenarios/scratch/dispatch-batchE-011-023.md` (NEW) | Dispatch prompt for Batch E (scenarios 011, 023) |
| `001-opencode-runtime-scenarios/scratch/evidence-batchA-stdout.json` (NEW) | Captured JSON from Batch A (scenarios 003, 004) |
| `001-opencode-runtime-scenarios/scratch/evidence-batchC-stdout.json` (NEW) | Captured JSON from Batch C (scenarios 007, 008) |
| `001-opencode-runtime-scenarios/scratch/evidence-batchE-stdout.json` (NEW) | Captured JSON from Batch E (scenarios 011, 023) |
| `001-opencode-runtime-scenarios/scratch/evidence-006-stdout.json` (NEW) | Captured JSON from scenario 006 |

### Follow-Ups

- Investigate tree-sitter parser quarantine trigger threshold and whether quarantine should auto-recover. Scenarios 002, 005, 022 and 024 must be re-run after parser recovery is confirmed.
- Update the playbook's scenario 011 verify sub-check to remove the stale `rating` field expectation (F-011-1).
- Confirm that disposable workspaces live under the repo root (gitignored `tmp/`) rather than under `/tmp`. Update any playbook docs that imply `/tmp` is safe (F-RUNTIME-1).
