---
title: "Changelog: Open Design terminal control and skill integration research [145-mcp-open-design/001-terminal-control-and-integration-research]"
description: "Chronological changelog for the Open Design terminal-control and skill-integration research phase."
trigger_phrases:
  - "phase changelog"
  - "terminal research"
  - "open design research"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-18

> Spec folder: `.opencode/specs/skilled-agent-orchestration/145-mcp-open-design/001-terminal-control-and-integration-research` (Level 1)
> Parent packet: `.opencode/specs/skilled-agent-orchestration/145-mcp-open-design`

### Summary

This phase answered the questions that made the later build safe: how to drive the installed Open Design app from a terminal, how to shape the `mcp-open-design` skill and how to de-vendor plus integrate `sk-design-interface`. It produced `research/research.md` as the prioritized phaseable recommendation. It changed no skill or app surface beyond restoring license files that were already broken in the working tree.

### Added

- Created the `001-terminal-control-and-integration-research` child phase and `research/` directory.
- Created `research/research.md` as the canonical cross-checked recommendation.
- Created `research/seats/{seat-a,seat-b,seat-c}` for per-seat findings and raw output.
- Created `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md` and this changelog.

### Changed

- Assigned three read-only seats for terminal surface, de-vendor work, skill design and cross-check.
- Confirmed the installed app path and bundled `daemon-cli.mjs` entry.
- Ran Seat A on `claude2-opus` for the Open Design terminal control surface from bundled code.
- Ran Seat B on `claude2-opus` for `sk-design-interface` de-vendor, integration and licensing.
- Ran Seat C on `gpt-5.5-fast` for `mcp-open-design` skill design plus adversarial cross-check.
- Reconciled Seat A and Seat C on the terminal surface.

### Fixed

- Restored the deleted license files to a clean baseline after Seat B found the live defect.

### Verification

| Check | Result |
|-------|--------|
| Fleet completion | PASS: three read-only seats produced findings. |
| Terminal-surface cross-check | PASS: Seat A code read and Seat C adversarial pass agreed on the corrections. |
| License defect restore | PASS: three files restored to clean baseline and verified via `git status`. |
| De-vendor ordering | PASS: data-first then notices-second sequence documented with a risk table. |
| `validate.sh --strict` | PASS: recorded at packet completion. |
| Tasks complete | PASS: 15 completed task items recorded. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `research/research.md` | Created | Canonical cross-checked recommendation. |
| `research/seats/{seat-a,seat-b,seat-c}` | Created | Per-seat findings and raw output. |
| `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md`, `this file` | Created | Packet control docs. |
| `.opencode/skills/sk-design-interface/ license files` | Updated | Reverted an out-of-order deletion to clean baseline. |

### Follow-Ups

- No skill was built and no de-vendor was executed in this phase. Those actions moved to phases 002, 003 and 004.
- The fleet used local source and the bundled app only. Upstream behavior was cited from code and model knowledge, not re-fetched.
- Live confirmation for the installer-written MCP entry, daemon lifecycle on app close, whether `od --no-open` gives a working headless daemon and per-verb auth moved to phases 002 and 004.
