---
title: "Changelog: Native Rerun of Deferred Usefulness Cells [008-real-world-usefulness-test-planning/003-native-deferred-trial-rerun]"
description: "Chronological changelog for the Native Rerun of Deferred Usefulness Cells phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-15

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/008-real-world-usefulness-test-planning/003-native-deferred-trial-rerun` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/008-real-world-usefulness-test-planning`

### Summary

This packet turns the native rerun into a durable verdict update. The important change is not more paperwork; it is that code graph moved from sandbox-useful to native overhead because the real MCP path exposed scope drift, zero-node persistence, and parser crash failure modes.

### Added

- Created Level 2 native rerun packet with spec.md, plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md, and metadata files.
- Recorded 13 native trial-log rows covering code graph scans/queries, advisor probes, hook fixes, and compaction formatting.
- Authored synthesis report with updated verdict table classifying code graph as OVERHEAD, hooks as USEFUL, and plugin/runtime integration as DEFERRED.

### Changed

- Reused prior sandbox execution scaffold (trials/raw/, analysis/) as the local artifact structure.
- Updated parent graph-metadata.json children_ids to include 003-native-deferred-trial-rerun.
- Code graph verdict reversed from sandbox-useful to native OVERHEAD after scope-mismatched scans wiped the live index to zero nodes and recovery scans failed.
- Recommended lexical search plus targeted direct reads as the interim workflow until code graph scope/index stability defects are fixed.

### Fixed

- Verified prior sandbox backlog fix: Codex session-start smoke mode returns a valid envelope.
- Verified prior sandbox backlog fix: Copilot offline preflight emits two SPEC-KIT-COPILOT-CONTEXT markers.
- Logged three advisor routing probes as 3/3 correct (frontend motion, save context, new spec folder).

### Verification

- Native trial rows - PASS: 13 rows written to trials/trial-log.jsonl.
- P0 prior backlog fixes - PASS: Codex smoke envelope and Copilot offline preflight markers recorded.
- New P0 backlog - PASS: 3 native-derived P0 items listed in synthesis.
- Parent metadata - PASS: children_ids includes 003-native-deferred-trial-rerun.
- Strict validation - PASS: validate.sh --strict exited 0 after packet authoring.
- Tasks complete - 29 completed task item(s) recorded

### Files Changed

| File | Action | What changed |
|---|---|---|
| `description.json` | Created | Discovery metadata for the native rerun packet. |
| `graph-metadata.json` | Created | Packet graph metadata and completed status. |
| `spec.md` | Created | Scope, requirements, risks, and success criteria. |
| `plan.md` | Created | Native measurement plan and affected surfaces. |
| `tasks.md` | Created | One completed task per measurement. |
| `checklist.md` | Created | Verification gates and evidence. |
| `decision-record.md` | Created | ADRs for native product finding and interim workflow. |
| `implementation-summary.md` | Created | Summary of deliverables, verdicts, and validation. |
| `synthesis-report-native-rerun.md` | Created | Updated verdict table and backlog. |
| `trials/trial-log.jsonl` | Updated | Native measurement log. |
| `trials/raw/*.json` | Created | Raw or summarized evidence files. |
| `../graph-metadata.json` | Updated | Parent children include 003-native-deferred-trial-rerun. |

### Follow-Ups

- Plugin/runtime integration remains unmeasured. This packet does not replace a live authenticated cli-gemini, Claude Code, or OpenCode campaign.
- Compaction recovery quality is partial. The hook-cache formatting appeared, but relevance scoring still needs a controlled trigger.
- Parser crash file:line details depend on the native trial transcript. The packet preserves the crash class and count; exact file:line citations should be expanded from the native raw run when fixing structural-indexer.ts.
