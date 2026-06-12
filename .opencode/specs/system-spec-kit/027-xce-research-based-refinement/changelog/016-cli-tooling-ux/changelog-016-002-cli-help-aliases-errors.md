---
title: "Changelog: 002-cli-help-aliases-errors"
description: "Added per-command offline help, generated aliases, and improved unknown-command JSON errors across the three daemon CLIs."
trigger_phrases:
  - "016 002 CLI help changelog"
  - "CLI aliases errors"
  - "per command help offline"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-11

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/016-cli-tooling-ux/002-cli-help-aliases-errors` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/016-cli-tooling-ux`

### Summary

The three daemon CLI front doors gained a consistent UX layer for command discovery and typo recovery. Per-command help prints offline, spec-memory and code-index generate snake/kebab/camel aliases, skill-advisor guards manifest alias collisions, and unknown-command errors now include a list-tools hint plus nearest canonical suggestion.

### Added

- Offline per-command help/schema output for spec-memory and code-index, matching the existing skill-advisor shape.
- Closest-match suggestions in unknown-command structured JSON errors.

### Changed

- Generated aliases from canonical snake-case command names for spec-memory and code-index.
- Added collision checks for skill-advisor manifest aliases.

### Fixed

- Unknown-command output now points users to `list-tools` and suggests a canonical command name instead of stopping at a generic error.

### Verification

| Check | Result |
|-------|--------|
| Per-command help | PASS: representative spec-memory and code-index commands print offline help |
| Alias collision tests | PASS |
| Unknown-command error | PASS: exit 64 with hint and canonical suggestion |
| list-tools counts | PASS: 37/8/9 unchanged |
| Builds and existing CLI suites | PASS per source summary |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `spec-memory-cli.ts` | Modified | Help, aliases, unknown-command hints |
| `code-index-cli.ts` | Modified | Help, aliases, unknown-command hints |
| `skill-advisor-cli.ts` | Modified | Alias collision guard and consistent error hints |
| `002-cli-help-aliases-errors/**` | Updated | Phase docs and evidence |

### Follow-Ups

- No tool logic or schemas changed; this phase only changed CLI presentation, aliases, and error recovery text.
