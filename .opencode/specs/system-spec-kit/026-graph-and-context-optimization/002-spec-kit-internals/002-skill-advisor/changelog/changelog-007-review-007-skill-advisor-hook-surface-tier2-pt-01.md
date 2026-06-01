---
title: "Review 007/007: Skill advisor hook surface tier2 pt-01"
description: "Single-pass deep review of the 007 hook surface. Verdict CONDITIONAL with 0 P0, 2 P1, 1 P2 findings on Copilot current-turn contract and pending checklist."
trigger_phrases:
  - "review 007 tier2 pt-01 changelog"
  - "hook surface review tier2"
importance_tier: "normal"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-19

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor` (Level 2)
> Parent packet: `026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor`

### Summary

A single-pass deep review of the 007 skill-advisor hook surface found 2 P1 findings and 1 P2. The subprocess timeout concern from earlier reviews is closed because the OpenCode plugin now sends SIGTERM, escalates to SIGKILL, and resolves on close. The release risk is contract-level: Copilot's adapter computes an advisor brief for the current prompt but writes it into custom instructions that Copilot reads on the next prompt. That does not satisfy the same-current-turn semantics promised by the packet.

### Added

None - review-only phase.

### Changed

None - review-only phase.

### Fixed

None - review-only phase.

### Verification

- Review report: `review/004-advisor-hook-surface-integration-tier2-pt-01/review-report.md`
- Findings: 0 P0, 2 P1, 1 P2
- P1-001: Copilot advisor brief is one prompt late (not current-turn equivalent).
- P1-002: Release evidence claims completion while Level 3 checklist remains fully unchecked.
- P2-001: Subprocess timeout gap is now closed for this surface.

### Files Changed

| File | What changed |
|------|--------------|
| (none) | Review-only phase produced no file modifications. |

### Follow-Ups

- Define and test Copilot current-turn vs next-turn contract.
- Update stale release/checklist evidence.
- Add a real or replayed Copilot host contract fixture.
