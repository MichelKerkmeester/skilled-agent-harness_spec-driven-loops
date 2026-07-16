---
title: "Fix validate.sh --recursive orchestrator-path silent no-op so phase children are validated"
description: "The --recursive flag quietly validated only the parent and skipped every phase child when the compiled orchestrator was present. The orchestrator path now recurses over phase children so the full phase tree is checked."
trigger_phrases:
  - "validate recursive orchestrator"
  - "validate.sh phase children no-op"
  - "run_node_orchestrator recursion"
  - "recursive validation orchestrator path"
  - "phase children silently skipped"
importance_tier: "important"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-01

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/005-validate-recursive-orchestrator-fix` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals`

### Summary

`validate.sh --recursive` now validates phase children when the compiled orchestrator is present. Before this fix, `run_node_orchestrator` ran the orchestrator on the parent and immediately called `exit $?`, which fired before the main function reached its recursive block. Every checkout with the compiled orchestrator quietly validated only the parent. The shell fallback already recursed so only the orchestrator path was broken, which made the gap easy to miss.

### Added

- Orchestrator-path recursion over phase children when `--recursive` is set, matching the shell fallback behavior
- Phase children lacking both `spec.md` and `description.json` are skipped during recursive validation on the orchestrator path

### Changed

- `run_node_orchestrator` resolves the orchestrator base once, builds flags once, validates the parent, then enumerates child phases before exit
- Exit code aggregation uses worst-code-wins so a failing child is never masked by a passing parent

### Fixed

- `validate.sh --recursive` no longer silently validates only the parent and skips every phase child when the compiled orchestrator is present

### Verification

- `bash -n validate.sh` passed (syntax check clean)
- Non-recursive behavior review passed. Parent is run with the same flags and the return code matches the orchestrator return
- No-orchestrator fallback review passed. The function still returns 1 before any invocation when no orchestrator is available
- `validate.sh --strict` on this packet passed

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-spec-kit/scripts/spec/validate.sh` | Modified | Reworked to recurse over phase children on the orchestrator path and aggregate the worst exit code before a single final exit |

### Follow-Ups

- No automated regression test was added. Verification was static plus diff review and a packet self-validate. A live phase-parent fixture run with the orchestrator present was not added so future regressions in child enumeration rely on the same manual checks.
