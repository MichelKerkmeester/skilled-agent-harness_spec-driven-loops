---
title: "Hook Parity Phase Changelogs"
description: "Index of phase-level changelogs for the 026/009 hook-parity track. Each entry tells the story of what was broken, what shipped, and what changed for operators."
trigger_phrases:
  - "hook parity changelog"
  - "hook parity history"
  - "phase changelog index"
importance_tier: "normal"
contextType: "implementation"
---

# Hook Parity Phase Changelogs

Eight main phases and four sub-phases shipped between 2026-04-21 and 2026-04-23 that together restored reliable, visible runtime hook behavior across OpenCode, Codex, Copilot, and Claude Code, then aligned the documentation to match the shipped behavior.

The 009 hook-parity track started with a 10-finding review that revealed silent no-op hook failures in OpenCode, missing hook surfaces in Codex and Copilot, a stale advisor freshness contract in Claude, and a schema crash in Copilot CLI. Each phase remediated its scoped gap, and phase 008 swept the resulting documentation drift.

## Phases (chronological)

| Phase | Date | Title | One-line story |
|-------|------|-------|----------------|
| 009/001 | 2026-04-21 | [Runtime hook parity remediation](./changelog-001-001-fix-runtime-hook-parity-findings.md) | 10 hook defects closed across OpenCode transport, Codex advisor/pre-tool, Copilot startup routing, and documentation truth-sync. |
| 009/002 | 2026-04-22 | [Copilot CLI hook parity remediation](./changelog-002-copilot-hook-parity-remediation-research-pt-03.md) | Copilot receives startup context and advisor briefs through a managed custom-instructions block because Copilot hook output cannot mutate prompts. |
| 009/002 pt-01 | 2026-04-22 | [Copilot deep-review research](./changelog-002-copilot-hook-parity-remediation-research-pt-01.md) | Research-only. Deep review confirmed Outcome B and identified the schema crash later fixed in phase 006. |
| 009/002 pt-03 | 2026-04-23 | [Copilot schema crash root cause](./changelog-002-copilot-hook-parity-remediation-research-pt-03.md) | Research-only. 8-iteration investigation traced the "Neither bash nor powershell" error to cross-runtime hook merging in `.claude/settings.local.json`. |
| 009/002 review | 2026-04-22 | [Copilot tier-2 review](./changelog-002-copilot-hook-parity-remediation-review-pt-01.md) | Review-only. Validated Outcome B implementation and surfaced findings on merge behavior and Superset routing. |
| 009/003 | 2026-04-22 | [Codex CLI native hook parity](./changelog-003-codex-hook-parity-remediation.md) | Codex now receives startup context and advisor briefs through native `hookSpecificOutput.additionalContext`. |
| 009/004 | 2026-04-23 | [Claude hook findings remediation](./changelog-004-claude-hook-findings-remediation.md) | Advisor freshness now resolves to live after scan. Claude hook settings normalized. Multi-turn regression harness documented. |
| 009/005 | 2026-04-22 | [OpenCode plugin loader remediation](./changelog-005-opencode-plugin-loader-remediation-review-pt-01.md) | OpenCode TUI crash fixed. Helper modules relocated. Skill-advisor plugin remapped to OpenCode event and system.transform hooks. |
| 009/005 review | 2026-04-22 | [OpenCode plugin loader review](./changelog-005-opencode-plugin-loader-remediation-review-pt-01.md) | Review-only. Corrected stale helper paths and closed compact-plugin P2 advisories. |
| 009/006 | 2026-04-23 | [Copilot wrapper schema fix](./changelog-006-copilot-wrapper-schema-fix.md) | Eliminated the "Neither bash nor powershell" Copilot crash by adding top-level Copilot-safe fields to Claude-style matcher wrappers. |
| 009/007 | 2026-04-23 | [Copilot writer wiring](./changelog-007-copilot-writer-wiring.md) | Copilot's `userPromptSubmitted` and `sessionStart` hooks now route to the system-spec-kit writers. Managed block refreshes per-prompt. |
| 009/008 | 2026-04-23 | [Documentation impact remediation](./changelog-008-docs-impact-remediation.md) | 13 documentation files updated to reflect the shipped hook, advisor, plugin-loader, and Copilot wrapper behavior across sub-packets 001-007. |

## How to read these

Each phase changelog follows the canonical nested-changelog template at `.opencode/skills/system-spec-kit/templates/changelog/phase.md`. Sections are:

- **Summary**: what changed and why it matters, in plain language
- **Added**: new capabilities or surfaces
- **Changed**: behavior changes to existing features
- **Fixed**: bugs closed
- **Verification**: how the change was proved
- **Files Changed**: source paths with one-line descriptions
- **Follow-Ups**: known deferred items

Voice rules per `.opencode/skills/sk-doc/references/global/hvr_rules.md` apply throughout. Technical jargon includes a parenthetical definition on first use.

## Where to find the full story

- Per-phase spec folders live under `026/009/` (main phases) and `026/009/002/research/` and `026/009/002/review/` (sub-phases).
- Implementation summaries with detailed file changes live at `<phase>/implementation-summary.md`.
- Research artifacts for the Copilot schema crash live at `026/009/002/research/002-copilot-hook-followup-deep-review-remediation/research.md`.

## Authoring conventions

- File names: `changelog-<phase>-<short-name>.md`
- One file per shipped phase, regardless of commit count
- Multi-commit phases collapse into one entry with all commits listed in Files Changed
