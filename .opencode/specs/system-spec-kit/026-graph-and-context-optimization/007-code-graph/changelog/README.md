---
title: "Code Graph Phase Changelogs"
description: "Index of phase-level changelogs for the 026/007 code-graph track. Each entry tells the story of what was broken before the phase, what shipped, and what changed for users in plain terms."
trigger_phrases:
  - "code graph changelog"
  - "code graph history"
  - "phase changelog index"
importance_tier: "normal"
contextType: "implementation"
---

# Code Graph Phase Changelogs

Six phases shipped between 2026-05-02 and 2026-05-06 that together hardened the code-graph system from "could be wiped by a bad scan and silently dropped 60-80% of symbols in production" to "crashes 0.72% of files in broad-scope mode and recovers cleanly from scope changes."

The code-graph is the SQLite-backed index of every symbol (functions, classes, variables, imports) and the edges between them (calls, exports, imports, etc.) that the MCP server uses to answer queries like "what calls this function" or "give me the outline of this file."

## Phases (chronological)

| Phase | Date | Title | One-line story |
|-------|------|-------|----------------|
| 009 | 2026-05-02 | [End-user scope by default](./changelog-009-end-user-scope-default.md) | Default scans now index your code only. Framework internals are opt-in. |
| 011 | 2026-05-03 | [Parser path fix from dist](./changelog-011-broader-scope-excludes.md) | The parser was silently failing in production and dropping 60-80% of symbols. Now it loads correctly from the compiled output. |
| 012/004 | 2026-05-06 | [Index can no longer be wiped](./changelog-012-004-remediation.md) | A scan that returned zero nodes used to overwrite a populated 56k-node graph. Now zero-node scans are rejected. |
| 012/005 | 2026-05-06 | [Scope changes need explicit consent](./changelog-012-005-scope-guard.md) | Scoping a smaller scan over a larger index used to silently shrink it. Now scope changes require an explicit flag. |
| 012/006 | 2026-05-06 | [Cluster A to E polish](./changelog-012-006-cluster-a-to-e.md) | Five medium-priority findings closed, including diagnostics surfacing, auto-rescan policy, and a verify endpoint that pointed at a non-existent path. |
| 012/007 | 2026-05-06 | [Tree-sitter parser resilience](./changelog-012-007-tree-sitter-parser-resilience.md) | Broad-scope scans crashed on 17.5% of files. After a 7-iteration deep research and a skip-list fix, the rate dropped to 0.72%. |

## How to read these

Each phase changelog follows the canonical nested-changelog template at `.opencode/skill/system-spec-kit/templates/changelog/phase.md`. Sections are:

- **Summary**: what changed and why it matters, in plain language
- **Added**: new capabilities or surfaces
- **Changed**: behavior changes to existing features
- **Fixed**: bugs closed
- **Verification**: how we proved the change works
- **Files Changed**: source paths with one-line descriptions
- **Follow-Ups**: known deferred items

Voice rules per `.opencode/skill/sk-doc/references/global/hvr_rules.md` apply throughout. Technical jargon includes a parenthetical definition on first use.

## Where to find the full story

- Per-phase spec folders live under `026/007/` and `026/007/012/` for the test-track sub-phases.
- Deep-research output for phase 012/007 lives at `012/007/research/research.md` (459 lines, 17 sections, file:line citations).
- Implementation summaries with detailed file changes live at `<phase>/implementation-summary.md`.

## Authoring conventions

- File names: `changelog-<phase>-<short-name>.md`
- One file per shipped phase, regardless of commit count
- Multi-commit phases collapse into one entry with all commits listed in Files Changed
- HVR rules are non-negotiable: no em-dashes, no semicolons, no Oxford commas in narrative prose
