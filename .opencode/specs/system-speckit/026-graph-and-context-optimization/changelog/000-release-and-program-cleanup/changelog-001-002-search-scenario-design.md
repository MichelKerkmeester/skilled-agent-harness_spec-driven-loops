---
title: "Changelog: Scenario Design Sub-Phase [001-search-intelligence-stress-playbook/002-search-scenario-design]"
description: "Chronological changelog for the Scenario Design Sub-Phase phase."
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

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/001-search-intelligence-stress-playbook/002-search-scenario-design` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/001-search-intelligence-stress-playbook`

### Summary

The complete design fixture for the parent stress-test playbook: 9 scenarios across 3 features (Search/Query/Intelligence) × 3 prompt-types (Simple/Vague/Specific), a 5-dimension scoring rubric (correctness, tool selection, latency, token efficiency, hallucination), a per-CLI dispatch matrix with concrete invocation templates, an output schema for run artifacts, and a scoring methodology with tie-breaker rules.

### Added

- Authored 9 scenarios across 3 features (Search/Query/Intelligence) × 3 prompt-types (Simple/Vague/Specific) with concrete prompts, expected outcomes, target tools, success indicators, and cross-references to known defects from the 005 stress-test findings.
- Designed a 5-dimension scoring rubric (correctness, tool selection, latency, token efficiency, hallucination) on a 0-2 scale with concrete behavior anchors per level.
- Defined per-CLI dispatch matrix with model IDs, reasoning effort, sandbox/agent profiles, and copy-paste-runnable invocation templates for cli-codex, cli-copilot, and cli-opencode.
- Specified output schema defining per-run artifact structure (prompt.md, output.txt, meta.json, score.md) and aggregate findings format.
- Documented scoring methodology with tie-breaker rules and secondary-reviewer protocol.

### Changed

- Read all 3 CLI skill SKILL.md files to map default invocations, concurrency caps, and constraints before designing the matrix.
- Anchored 5 of 9 scenarios in real known defects from sibling 005 packet to reveal whether each CLI hits or avoids the bug.

### Fixed

- None.

### Verification

- 9 scenarios documented - PASS — see spec.md §Scenario Corpus
- 5-dim rubric documented - PASS — see spec.md §Scoring Rubric
- Dispatch matrix per CLI - PASS — see spec.md §Dispatch Matrix
- Output schema documented - PASS — see spec.md §Output Schema
- Scoring methodology - PASS — see spec.md §Scoring Methodology
- Dispatch scripts authored - PENDING — T109-T112
- Strict validation - PENDING — runs at packet close
- Tasks complete - 12 completed task item(s) recorded

### Files Changed

| File | Action | What changed |
|---|---|---|
| `spec.md` | Create | Full corpus + rubric + matrix + output schema + methodology |
| `plan.md` | Create | Authoring methodology |
| `tasks.md` | Create | T001-T112 work units |
| `implementation-summary.md` | Create | This file |
| `description.json` | Create | Indexer metadata |
| `graph-metadata.json` | Create | Graph traversal metadata |
| `scripts/` | Pending | Dispatch script wrappers (T109-T112) |

### Follow-Ups

- Author dispatch script scripts/dispatch-cli-codex.sh
- [P] Author dispatch script scripts/dispatch-cli-copilot.sh (with concurrency guard)
- [P] Author dispatch script scripts/dispatch-cli-opencode.sh
- Author orchestrator scripts/run-all.sh
- bash -n scripts/*.sh syntax check passes
- Smoke test: dispatch S1 against each CLI manually; verify output capture
