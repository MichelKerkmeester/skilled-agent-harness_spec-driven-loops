---
title: "Changelog: 003-cli-reference-and-skill-docs"
description: "Added a unified daemon CLI reference page and linked system skill docs to exact recovery commands, exit taxonomy, and jsonl behavior."
trigger_phrases:
  - "004/004 003 daemon CLI reference changelog"
  - "CLI reference skill docs"
  - "jsonl single line payload"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-11

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/004-cli-tooling-ux/003-cli-reference-and-skill-docs` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/004-cli-tooling-ux`

### Summary

A canonical daemon CLI reference now covers the three CLI shims. The system-spec-kit, system-code-graph, and system-skill-advisor SKILL files link to it and carry concise recovery invocations, exit taxonomy, and format warnings for agents that read SKILL.md first.

### Added

- `.opencode/skills/system-spec-kit/references/cli/daemon_cli_reference.md`.
- Local recovery command pointers in the three system skill `SKILL.md` files.

### Changed

- Documented invocation forms, `--format json|text|jsonl`, exit codes, warm-only policy, stale-dist recovery, per-command help, offline smoke, and safety rules in one canonical page.

### Fixed

- Clarified that `--format jsonl` returns one complete JSON payload on one stdout line and is not streaming JSON Lines.

### Verification

| Check | Result |
|-------|--------|
| Reference coverage | PASS: all requested CLI topics present |
| Tool counts | PASS: offline smoke returned 37, 8, 9 daemon-free |
| Representative help | PASS: `memory_stats`, `code_graph_status`, and `advisor_status` show help |
| jsonl note | PASS: one parseable JSON line for all three CLIs |
| Strict validation | PASS: child phase strict validation passed |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `system-spec-kit/references/cli/daemon_cli_reference.md` | Created | Canonical daemon CLI reference |
| `system-spec-kit/SKILL.md` | Modified | Spec-memory CLI recovery and reference link |
| `system-code-graph/SKILL.md` | Modified | Code-index CLI recovery and reference link |
| `system-skill-advisor/SKILL.md` | Modified | Skill-advisor CLI recovery and reference link |
| `003-cli-reference-and-skill-docs/**` | Updated | Phase docs and evidence |

### Follow-Ups

- None identified in the source implementation summary.
