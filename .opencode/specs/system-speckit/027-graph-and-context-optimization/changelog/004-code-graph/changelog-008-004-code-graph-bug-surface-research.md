---
title: "Changelog: Deep Research Issues [008-real-world-usefulness-test-planning/004-code-graph-bug-surface-research]"
description: "Chronological changelog for the Deep Research Issues phase."
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

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/008-real-world-usefulness-test-planning/004-code-graph-bug-surface-research` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/008-real-world-usefulness-test-planning`

### Summary

This packet turns the completed 10-iteration research loop into an implementation-ready backlog. The corrected headline is narrower than the original synthesis: code graph default scope is working as designed for end-user project code, while destructive empty-scan promotion and parser-error persistence still need P0 reliability fixes.

### Added

- Canonical research report at research/research.md with executive summary, methodology, severity view, axis view, primary answers, remediation scope, env snippet, negative knowledge, iteration index, and convergence note.
- Resource map at research/resource-map.md cataloging finding citations by subsystem.
- ADR-004 documenting default-scope design intent in decision-record.md.
- Root packet artifacts: description.json, graph-metadata.json, spec.md, plan.md, tasks.md, checklist.md, implementation-summary.md.
- Default/no-env and maintainer-mode env snippets replacing the prior new-user recommendation.

### Changed

- Findings deduplicated by root cause across 10 iterations: corrected counts are P0=2, P1=16, P2=12, DESIGN-INTENT closed=1 (down from raw P0=3, P1=19, P2=13).
- F-001 reclassified as design-intent closed because default .opencode/** exclusion is correct for template users indexing their own project code.
- F-004 and F-005 demoted to maintainer-only P2 since env-token validation and .codex/config.toml parity matter for framework contributors, not default end-user setup.

### Fixed

- None. This packet is read-only synthesis and documentation.

### Verification

- Iteration artifacts present - PASS: 10 markdown reports and 10 delta JSONL files read
- Required synthesis sections - PASS: research/research.md contains the requested sections
- Parent metadata updated - PASS: parent children_ids includes this packet
- Strict spec validation - PASS: validate.sh --strict exited 0
- Framing correction applied - PASS: F-001 closed as DESIGN-INTENT; F-004/F-005 demoted to maintainer-only P2
- Tasks complete - 30 completed task item(s) recorded

### Files Changed

| File | Action | What changed |
|---|---|---|
| `description.json` | Created | Packet identity metadata |
| `graph-metadata.json` | Created | Packet graph metadata |
| `spec.md` | Created | Research packet specification |
| `plan.md` | Created | Completed execution plan |
| `tasks.md` | Created | Completed task ledger |
| `checklist.md` | Created | Verification checklist |
| `implementation-summary.md` | Created | Delivery summary |
| `decision-record.md` | Created | Supplemental ADRs |
| `research/research.md` | Created | Canonical final report |
| `research/resource-map.md` | Created | Citation ledger |
| `../graph-metadata.json` | Updated | Parent child link |

### Follow-Ups

- No remediation implemented. This packet is read-only synthesis; the two P0 fixes (zero-node scan safety, parser-error persistence) belong in a follow-up remediation packet.
- Parser OOB filenames remain unknown. The native artifacts preserved crash count and message, but not the affected file list.
