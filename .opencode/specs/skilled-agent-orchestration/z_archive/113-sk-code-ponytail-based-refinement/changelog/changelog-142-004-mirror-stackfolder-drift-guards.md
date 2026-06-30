---
title: "Changelog: Phase 4: Drift Guards, Agent Mirrors and STACK_FOLDERS Binding [142-sk-code-ponytail-based-refinement/004-mirror-stackfolder-drift-guards]"
description: "Chronological changelog for the Phase 4 mirror and stack-folder drift guard work."
trigger_phrases:
  - "phase changelog"
  - "agent mirror drift"
  - "stack folders guard"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-18

> Spec folder: `.opencode/specs/skilled-agent-orchestration/z_archive/113-sk-code-ponytail-based-refinement/004-mirror-stackfolder-drift-guards` (Level 1)
> Parent packet: `.opencode/specs/skilled-agent-orchestration/z_archive/113-sk-code-ponytail-based-refinement`

### Summary

Phase 4 closed the gap between copied agent surfaces and the checks that keep them honest. A pre-flight audit found drift before the new guard existed, then the implementation separated real drift from a false positive and added changed-file-scoped enforcement. The phase also bound `STACK_FOLDERS` to the references and assets it names.

### Added

- No new additions recorded.

### Changed

- Two Opus-4.8-via-claude2 dispatches ran with `bypassPermissions`, Gate-3 pre-approved and scope locked.
- Dispatch A handled the gate, CI, stack-folders, normalizer and pre-commit edit.
- Dispatch B handled the one-row context drift fix.
- The orchestrator ran a pre-flight audit, discovered pre-existing drift, diagnosed each case as real or false-positive and independently re-verified every result.
- T-001 ran the mirror check over all 12 agents and found context plus orchestrate already drifted and committed. The chosen guard design was changed-files-scoped.
- T-002 diagnosed context and codex as real because the Tool-Inventory row was dropped, and orchestrate as a false positive because its per-runtime self-description was not allowlisted.
- T-003 added `check-agent-mirror-sync.cjs` with changed paths or `--all`, per-runtime drift output and exit 1 on drift.
- T-004 extended `.opencode/hooks/pre-commit` with an independent staged-agents-only mirror gate that is fail-safe and preserves comment hygiene.
- T-005 added `.github/workflows/agent-mirror-sync.yml` for pull requests to `main` and changed agent files.
- T-006 added `verify_stack_folders.py` for `STACK_FOLDERS` to `references/` plus `assets/` binding.

### Fixed

- T-008 fixed the real context and codex drift by restoring the dropped `Structure / Semantic and exact discovery` Tool-Inventory row to match canonical.
- All 12 agent mirrors are in sync.
- The two pre-existing drifts were fixed.
- `STACK_FOLDERS` validator passes.
- The normalizer fix is conservative.

### Verification

| Check | Result |
|-------|--------|
| Task ledger | PASS: 14 completed task item(s) recorded |
| Mirror audit | PASS: all 12 agent mirrors in sync after fixes |
| Stack folders | PASS: `STACK_FOLDERS` validator passes |
| Normalizer | PASS: verified directly with tamper control |
| Scope check | PASS: changed-files-scoped gate design confirmed |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `check-agent-mirror-sync.cjs` | Created | Added changed-file-aware agent mirror drift checker |
| `.opencode/hooks/pre-commit` | Updated | Added staged-agents-only mirror gate |
| `.github/workflows/agent-mirror-sync.yml` | Created | Added pull-request mirror sync workflow |
| `verify_stack_folders.py` | Created | Added stack-folder binding validator |
| `context` and `codex` agent mirrors | Updated | Restored dropped Tool-Inventory row |
| `_No full file-level detail recorded._` | Updated | Baseline did not record every full path |

### Follow-Ups

- The mirror gate keys on file paths. A bare agent name prints `no agent files`, which is correct because pre-commit and CI pass paths.
- The `.vitest.ts` mirror-sync test could not be re-run via the local CLI because the repo uses a non-default vitest config.
- Normalizer behavior was verified directly instead, with tamper control and the existing test reported green by the implementer.
- Not committed. Changes sat in the working tree on branch `028-mcp-to-cli-tool-transition`.
