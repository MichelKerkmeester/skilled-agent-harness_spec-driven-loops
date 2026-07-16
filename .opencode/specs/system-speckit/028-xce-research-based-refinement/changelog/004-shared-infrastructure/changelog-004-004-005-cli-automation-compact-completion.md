---
title: "Changelog: 005-cli-automation-compact-completion"
description: "Added compact and names-only list-tools output plus generated bash/zsh completion scripts for the three daemon CLIs."
trigger_phrases:
  - "004/004 005 compact completion changelog"
  - "list-tools compact names-only"
  - "daemon CLI shell completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-11

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/004-cli-tooling-ux/005-cli-automation-compact-completion` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/004-cli-tooling-ux`

### Summary

The three daemon CLIs gained automation-friendly command discovery and generated shell completion. Full `list-tools --format json` still returns schemas for 37/8/9 tools, while compact and names-only modes provide smaller payloads for scripts and humans.

### Added

- `list-tools --compact` with name, aliases, and description, omitting input schemas.
- `list-tools --names-only` with canonical tool names only.
- `completion bash|zsh` generation for spec-memory, code-index, and skill-advisor.

### Changed

- The CLI files now use existing registry sources to produce compact output and completion scripts, avoiding hand-maintained drift.

### Fixed

- None beyond the new automation UX. Full list-tools output remains schema-complete.

### Verification

| Check | Result |
|-------|--------|
| Builds | PASS in system-spec-kit, system-code-graph, and system-skill-advisor |
| Focused compact/completion tests | PASS: 6 tests each for all three CLIs |
| Existing CLI suites | PASS per source summary |
| Full schemas intact | PASS: 37/8/9 schemas present in full mode |
| Compact schemas omitted | PASS: 0 schemas in compact mode |
| Completion contents | PASS: bash/zsh output includes tool names |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `spec-memory-cli.ts` | Modified | Compact, names-only, and completion output |
| `code-index-cli.ts` | Modified | Compact, names-only, and completion output |
| `skill-advisor-cli.ts` | Modified | Compact, names-only, and completion output |
| `005-cli-automation-compact-completion/**` | Updated | Phase docs and evidence |

### Follow-Ups

- system-spec-kit alignment drift still reported two unrelated out-of-scope files in the source summary.
