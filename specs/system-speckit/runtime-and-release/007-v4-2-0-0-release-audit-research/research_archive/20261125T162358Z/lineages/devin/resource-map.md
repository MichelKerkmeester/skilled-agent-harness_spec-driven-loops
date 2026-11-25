---
title: "Resource Map — Audit the Skilled v4.2.0.0 release notes against the work shipped since v4.1.0.0, and report what is missing, what has drifted and what is broken. Inputs, read-only: - Release notes: .skilled/changelog/skilled/v4.2.0.0.md (926 lines, not tagged yet). - Window: git range v4.1.0.0..HEAD. The 1084 non-merge commits, one per line as \"hash date subject\", are in specs/system-speckit/runtime-and-release/007-v4-2-0-0-release-audit-research/scratch/window-commits.txt. Use git show, git log -- <path> and git diff on that range for detail. - Recently touched packets: specs/system-speckit/runtime-and-release/007-v4-2-0-0-release-audit-research/scratch/recent-packets.txt (21 spec folders; read their spec.md and implementation-summary.md). Definitions: - MISSING: a user-visible change in the window (a new or removed command, flag, skill, mode, hook, script, default or behavior) that the release notes never mention. - DRIFT: a release-note claim (a flag, path, count, default, version, test number or behavior) that the current code or docs contradict. - BUG: a defect in code changed in the window, shown by reading the code or running a read-only command. Key questions: 1. Which commits in the window change user-visible behavior with no entry in the notes? Check each notes section in turn: Deep Loop, Fan-Out Runs, Dispatch and Safety, Skill Advisor, Installs and Overlays, OpenCode, Browser Use, Skills and Worktrees, How It Was Checked, Upgrade Notes. 2. Which of the 21 recent packets shipped work the notes do not cover, or describe the shipped work differently from the notes? 3. Which concrete claims in the notes (flags, paths, counts, test results, removed items) no longer match HEAD, including work that landed after a section was written? 4. Which changes in the window introduced a bug, a dead reference or a broken cross-link? Rules: cite a commit hash and a file:line for every finding, plus the release-notes line it concerns. Mark each finding MISSING, DRIFT or BUG with a severity of P0, P1 or P2. Say when you could not confirm something. Do not edit any file outside your own research lineage folder."
description: "Auto-generated research resource map from convergence evidence."
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

## Summary

- **Total references**: 16
- **By category**: READMEs=0, Documents=1, Commands=0, Agents=0, Skills=12, Specs=1, Scripts=0, Tests=1, Config=1, Meta=0
- **Missing on disk**: 0
- **Scope**: research convergence output for 007-v4-2-0-0-release-audit-research
- **Generated**: 2026-11-25T08:19:16.982Z

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` · `MISSING` · `PLANNED`.

## 2. Documents

> Long-form markdown artifacts that are not READMEs: guides, specs, references, install docs, catalogs, playbooks.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/changelog/skilled/v4.2.0.0.md | Cited | OK | Citations=6; Iterations=6 |

---

## 5. Skills

> `.skilled/skills/**` including `SKILL.md`, `references/`, `assets/`, `feature-catalog/`, `manual-testing-playbook/`, `scripts/`, `shared/`, `runtime/`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/skills/sk-code/changelog/v3.12.5.0.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-code/ROUTER.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-code/SKILL.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-doc/hub-router.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-doc/SKILL.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-git/scripts/worktree-naming.sh | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/lexical.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/lib/track-roots.mjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/hooks/claude/session-stop.ts | Cited | OK | Citations=1; Iterations=1 |

---

## 6. Specs

> `.opencode/specs/**` and `specs/**`. Takes precedence over `Config` for spec-folder JSON metadata.

| Path | Action | Status | Note |
|------|--------|--------|------|
| specs/system-speckit/runtime-and-release/007-v4-2-0-0-release-audit-research/scratch/recent-packets.txt | Cited | OK | Citations=1; Iterations=1 |

---

## 8. Tests

> Test files, fixtures, and snapshots. Tests take precedence over `Scripts`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/hooks/overlay-guard/lib/overlay-guard.test.cjs | Cited | OK | Citations=1; Iterations=1 |

---

## 9. Config

> Machine-readable configuration: `.json`, `.jsonc`, `.yaml`, `.yml`, `.toml`, `.env.example`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .pi/settings.json | Cited | OK | Citations=1; Iterations=1 |

---
