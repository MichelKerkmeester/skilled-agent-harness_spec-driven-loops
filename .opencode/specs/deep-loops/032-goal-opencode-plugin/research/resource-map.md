---
title: "Resource Map — Investigate whether related skill documentation (SKILL.md files, references/, assets/) and README files (skill READMEs, code READMEs) across the repo describe now-stale behavior for the /goal OpenCode plugin, following the phases 010-014 remediation completed in this session plus the goal_opencode.md filename correction. Context: .opencode/plugins/mk-goal.js gained new functions (recordProviderUsageLimit, archiveGoalStateFile, pruneArchive, sweepOrphanedActiveStates), new env vars (MK_GOAL_STATE_ARCHIVE_RETENTION_DAYS, MK_GOAL_STATE_ACTIVE_RETENTION_DAYS, MK_GOAL_STATE_SWEEP_INTERVAL_MS), a new store_health status field, a mutation field on /goal set output, hardened sanitizer/redaction, and the command file is now finally named .opencode/commands/goal_opencode.md (NOT goal.md -- confirm this is still the live name at execution time). Already-updated docs this session (do not re-flag, but DO verify they are still accurate): .opencode/skills/system-spec-kit/references/hooks/goal_plugin.md, .opencode/skills/system-spec-kit/SKILL.md, .opencode/skills/system-spec-kit/references/config/hook_system.md, .opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md + feature_catalog/18--ux-hooks/goal-opencode-plugin.md, .opencode/skills/system-spec-kit/manual_testing_playbook/18--ux-hooks/goal-opencode-plugin.md, .opencode/skills/system-skill-advisor/feature_catalog/07--hooks-and-plugin/goal-opencode-plugin.md + manual_testing_playbook/02--cli-hooks-and-plugin/goal-opencode-plugin.md, .opencode/skills/system-spec-kit/constitutional/goal-prompting-runtime-specific.md. Find what's still missed: (1) other skills' own SKILL.md/references/assets that mention mk-goal.js, /goal, mk_goal, or the goal plugin even in passing (e.g. cli-opencode, cli-claude-code, sk-code, sk-prompt-models, system-skill-advisor's own SKILL.md, deep-loop-workflows) and whether their mentions are still accurate; (2) any repo-level or skill-level README.md files (root README, .opencode/plugins/README.md if one exists, per-skill README.md files) that describe the goal plugin/command and might be stale on the new env vars, status fields, or command filename; (3) ENV_REFERENCE.md's completeness for the 3 new env vars; (4) any doc that still says 'usage_limited is unimplemented/dead' now that phase 013 wired it, or 'goal-state never gets cleaned up' now that phase 014 added archive/sweep. ANTI-CONVERGENCE: target exactly 10 iterations; do not converge early unless every related-skill/README avenue is genuinely exhausted. Under convergence pressure before iteration 10, rotate to an unexamined skill directory or doc class (SKILL.md vs references/ vs assets/ vs README.md vs ENV_REFERENCE.md vs feature_catalog vs manual_testing_playbook vs constitutional) instead of stopping."
description: "Auto-generated research resource map from convergence evidence."
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

## Summary

- **Total references**: 14
- **By category**: READMEs=1, Documents=2, Commands=1, Agents=0, Skills=5, Specs=3, Scripts=1, Tests=0, Config=0, Meta=1
- **Missing on disk**: 2
- **Scope**: research convergence output for 032-goal-opencode-plugin
- **Generated**: 2026-07-01T16:07:18.493Z

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` · `MISSING` · `PLANNED`.

## 1. READMEs

| Path | Action | Status | Note |
|------|--------|--------|------|
| .opencode/plugins/README.md | Cited | OK | Citations=2; Iterations=2 |

---

## 2. Documents

> Long-form markdown artifacts that are not READMEs: guides, specs, references, install docs, catalogs, playbooks.

| Path | Action | Status | Note |
|------|--------|--------|------|
| glob:.opencode/commands/*goal*.md | Cited | MISSING | Citations=1; Iterations=1 |
| glob:.opencode/commands/goal.md | Cited | MISSING | Citations=1; Iterations=1 |

---

## 3. Commands

> `.opencode/commands/**` and any runtime-specific command surfaces.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .opencode/commands/goal_opencode.md | Cited | OK | Citations=4; Iterations=4 |

---

## 5. Skills

> `.opencode/skills/**` including `SKILL.md`, `references/`, `assets/`, `feature_catalog/`, `manual_testing_playbook/`, `scripts/`, `shared/`, `mcp_server/`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .opencode/skills/system-skill-advisor/feature_catalog/07--hooks-and-plugin/goal-opencode-plugin.md | Cited | OK | Citations=1; Iterations=1 |
| .opencode/skills/system-skill-advisor/README.md | Cited | OK | Citations=2; Iterations=2 |
| .opencode/skills/system-spec-kit/constitutional/goal-prompting-runtime-specific.md | Cited | OK | Citations=1; Iterations=1 |
| .opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md | Cited | OK | Citations=2; Iterations=2 |
| .opencode/skills/system-spec-kit/mcp_server/plugin_bridges/README.md | Cited | OK | Citations=1; Iterations=1 |

---

## 6. Specs

> `.opencode/specs/**` and `specs/**`. Takes precedence over `Config` for spec-folder JSON metadata.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .opencode/specs/deep-loops/032-goal-opencode-plugin/009-speckit-command-goal-prompt-offer/handover.md | Cited | OK | Citations=1; Iterations=1 |
| .opencode/specs/deep-loops/032-goal-opencode-plugin/011-command-surface-normalization/tasks.md | Cited | OK | Citations=1; Iterations=1 |
| .opencode/specs/deep-loops/032-goal-opencode-plugin/review_archive/2026-07-01-plugin-implementation-review/README.md | Cited | OK | Citations=1; Iterations=1 |

---

## 7. Scripts

> Executable or build/test scripts: `.sh`, `.js`, `.ts`, `.mjs`, `.cjs`, `.py`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .opencode/plugins/mk-goal.js | Cited | OK | Citations=3; Iterations=3 |

---

## 10. Meta

> Repository-wide governance artifacts such as `AGENTS.md`, `CLAUDE.md`, `LICENSE`, and root `README.md`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| README.md | Cited | OK | Citations=3; Iterations=3 |

---
