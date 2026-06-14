---
title: "Phase Parent Rollup: cli-tooling-ux"
description: "Rollup of the 5 child phases under 004/004, which polished the daemon-CLI front doors: a freshness-gate fix and offline smoke, per-command help/aliases/errors, a unified daemon CLI reference and skill docs, the fallback envelope and bridge allowlist, and compact output with shell completion. Children are summarized inline."
trigger_phrases:
  - "004-cli-tooling-ux rollup"
  - "daemon cli ux changelog"
  - "cli help aliases completion"
  - "027 004/004 shipped"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/root.md | v1.0 -->

## 2026-06-11

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/004-cli-tooling-ux` (Level 2, Phase Parent)

### Summary

The dual-stack CLI front doors that 004/001 shipped over the spec-memory, code-index, and skill-advisor daemons worked, but the operator experience around them had rough edges. This phase parent polished that surface across five children: it fixed the freshness gate and added an offline smoke check, gave each command real per-command help with aliases and clear errors, consolidated the daemon CLI reference and the skill docs into one consistent story, hardened the fallback envelope and the bridge environment allowlist, and added compact machine-readable output plus shell completion. The CLI tool surface stays at full parity with the daemons (spec-memory 37, code-index 8, skill-advisor 9).

This rollup is the authoritative child inventory for 004/004. The five children are summarized inline in the Included Phases table below and do not carry separate per-child leaf changelogs.

### Included Phases

| Phase | Outcome |
|-------|---------|
| [001-cli-freshness-and-smoke](../../004-shared-infrastructure/004-cli-tooling-ux/001-cli-freshness-and-smoke/spec.md) | Freshness-gate fix plus an offline smoke check over the CLI surface |
| [002-cli-help-aliases-errors](../../004-shared-infrastructure/004-cli-tooling-ux/002-cli-help-aliases-errors/spec.md) | Per-command help, command aliases, and clear error messages |
| [003-cli-reference-and-skill-docs](../../004-shared-infrastructure/004-cli-tooling-ux/003-cli-reference-and-skill-docs/spec.md) | A unified daemon CLI reference and aligned skill docs |
| [004-cli-fallback-envelope-and-bridge](../../004-shared-infrastructure/004-cli-tooling-ux/004-cli-fallback-envelope-and-bridge/spec.md) | Hardened CLI fallback envelope and the bridge environment allowlist |
| [005-cli-automation-compact-completion](../../004-shared-infrastructure/004-cli-tooling-ux/005-cli-automation-compact-completion/spec.md) | Compact machine-readable output and shell completion for automation |

### Added

- None at the parent level. Detail lives in the child phase spec docs.

### Changed

- None at the parent level. Each child polished one slice of the CLI front-door experience.

### Fixed

- None at the parent level. Detail lives in the child phase spec docs.

### Verification

- The CLI offline smoke stayed at full daemon parity (spec-memory 37, code-index 8, skill-advisor 9) across the phase. Each child shipped with its own spec docs and verification.

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `004-cli-tooling-ux/` (child phases) | n/a | Rollup of 5 child phases polishing the daemon-CLI front-door surface |

### Follow-Ups

- None.
