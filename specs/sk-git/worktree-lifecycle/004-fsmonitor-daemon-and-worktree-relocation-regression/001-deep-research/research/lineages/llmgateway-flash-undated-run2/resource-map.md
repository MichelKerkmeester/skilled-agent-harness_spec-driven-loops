---
title: "Resource Map — Root-cause and fix design for git fsmonitor daemon pile-up and hangs in this repo: why the main checkout fsmonitor daemon stopped answering IPC and stalled a pre-push hook for 30 minutes, why 11 daemons accumulate across nested worktrees, what regressed sk-git/026 worktree relocation and reaper daemon handling, and how to prevent old daemons from running on. Start from specs/sk-git/035-fsmonitor-daemon-and-worktree-relocation-regression/scratch/findings.md and answer its section 8 questions."
description: "Auto-generated research resource map from convergence evidence."
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

## Summary

- **Total references**: 33
- **By category**: READMEs=1, Documents=13, Commands=0, Agents=0, Skills=13, Specs=1, Scripts=5, Tests=0, Config=0, Meta=0
- **Missing on disk**: 14
- **Scope**: research convergence output for 001-deep-research
- **Generated**: 2026-10-27T10:02:50.188Z

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` · `MISSING` · `PLANNED`.

## 1. READMEs

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/bin/README.md | Cited | OK | Citations=2; Iterations=2 |

---

## 2. Documents

> Long-form markdown artifacts that are not READMEs: guides, specs, references, install docs, catalogs, playbooks.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .gitignore | Cited | OK | Citations=1; Iterations=1 |
| ~/.config/git/hooks/pre-push | Cited | MISSING | Citations=1; Iterations=1 |
| builtin/fsmonitor--daemon.c | Cited | MISSING | Citations=1; Iterations=1 |
| compat/fsmonitor/fsm-health-darwin.c | Cited | MISSING | Citations=1; Iterations=1 |
| compat/fsmonitor/fsm-health.h | Cited | MISSING | Citations=1; Iterations=1 |
| compat/simple-ipc/ipc-unix-socket.c | Cited | MISSING | Citations=1; Iterations=1 |
| Documentation/RelNotes/2.51.0.adoc | Cited | MISSING | Citations=1; Iterations=1 |
| Documentation/RelNotes/2.52.0.adoc | Cited | MISSING | Citations=1; Iterations=1 |
| Documentation/RelNotes/2.53.0.adoc | Cited | MISSING | Citations=1; Iterations=1 |
| ls -d .worktrees/*, this session | Cited | MISSING | Citations=1; Iterations=1 |
| ls ~/worktrees, this session | Cited | MISSING | Citations=1; Iterations=1 |
| man git-fsmonitor--daemon (Git 2.50.1) | Cited | MISSING | Citations=1; Iterations=1 |
| rg spawnSync/execSync/execFileSync git under .skilled (59 files) | Cited | MISSING | Citations=1; Iterations=1 |

---

## 5. Skills

> `.skilled/skills/**` including `SKILL.md`, `references/`, `assets/`, `feature-catalog/`, `manual-testing-playbook/`, `scripts/`, `shared/`, `runtime/`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/skills/sk-code/sk-code-quality/scripts/lib/run-check.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-doc/sk-create-skill/scripts/regenerate-skill-derived.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-git/changelog/v1.5.2.0.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-git/feature-catalog/feature-catalog.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-git/scripts/hooks/git-message-gate.mjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-git/scripts/lib/message-contract.mjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-git/scripts/worktree-naming.sh | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/rules/check-source-tags-helper.mjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/validation/continuity-freshness.ts | Cited | OK | Citations=1; Iterations=1 |

---

## 6. Specs

> `.opencode/specs/**` and `specs/**`. Takes precedence over `Config` for spec-folder JSON metadata.

| Path | Action | Status | Note |
|------|--------|--------|------|
| specs/sk-git/035-fsmonitor-daemon-and-worktree-relocation-regression/scratch/findings.md | Cited | OK | Citations=2; Iterations=2 |

---

## 7. Scripts

> Executable or build/test scripts: `.sh`, `.js`, `.ts`, `.mjs`, `.cjs`, `.py`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/bin/worktree-reaper.sh | Cited | OK | Citations=2; Iterations=2 |
| .skilled/bin/worktree-session.sh | Cited | OK | Citations=2; Iterations=2 |
| .skilled/hooks/shared/hook-flags.sh | Cited | OK | Citations=1; Iterations=1 |
| git log -S config speckit.worktreeBase -- .opencode/bin/worktree-session.sh .skilled/bin/worktree-session.sh | Cited | MISSING | Citations=1; Iterations=1 |
| git show 3c7c3f83874 -- .opencode/bin/worktree-reaper.sh | Cited | MISSING | Citations=1; Iterations=1 |

---
