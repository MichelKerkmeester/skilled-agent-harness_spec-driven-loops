---
title: "Resource Map — Design a doctor-style setup path for sk-git that lets a repository user adapt sk-git to their own repository, the way /doctor:sk-code setup lets them adapt sk-code. Study the sk-code precedent first; map every customizable part of sk-git and /doctor:git; recommend setup command placement, rejected ideas, read-only proof requirements, and implementation phases."
description: "Auto-generated research resource map from convergence evidence."
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

## Summary

- **Total references**: 42
- **By category**: READMEs=0, Documents=7, Commands=11, Agents=0, Skills=20, Specs=2, Scripts=2, Tests=0, Config=0, Meta=0
- **Missing on disk**: 20
- **Scope**: research convergence output for 001-deep-research
- **Generated**: 2026-10-15T05:54:01.481Z

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` · `MISSING` · `PLANNED`.

## 2. Documents

> Long-form markdown artifacts that are not READMEs: guides, specs, references, install docs, catalogs, playbooks.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs:12-23,259-282 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/scripts/git-hooks/commit-msg | Cited | OK | Citations=1; Iterations=1 |
| .skilled/scripts/git-hooks/lib/gate-config.sh:5-16,20-39 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/scripts/git-hooks/pre-commit | Cited | OK | Citations=2; Iterations=2 |
| .skilled/scripts/git-hooks/prepare-commit-msg:97-119,303-313 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/scripts/git-hooks/prepare-commit-msg:103-119,286-313 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/scripts/install-git-hooks.sh:29-50,96-149 | Cited | MISSING | Citations=1; Iterations=1 |

---

## 3. Commands

> `.skilled/commands/**` and any runtime-specific command surfaces.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/commands/doctor/_routes.yaml:27-30,236-267 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/commands/doctor/assets/doctor-git-hooks.yaml | Cited | OK | Citations=2; Iterations=2 |
| .skilled/commands/doctor/assets/doctor-git-hooks.yaml:22-42,63-72 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/commands/doctor/assets/doctor-git-standards.yaml | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/assets/doctor-sk-code-setup.yaml | Cited | OK | Citations=2; Iterations=2 |
| .skilled/commands/doctor/assets/doctor-sk-code-setup.yaml:12-28,46-52 | Cited | MISSING | Citations=2; Iterations=2 |
| .skilled/commands/doctor/git.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/git.md:39-67,82-87 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/commands/doctor/scripts/sk-code-setup-check.cjs:97-149,252-310 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/commands/doctor/sk-code.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/sk-code.md:8-16,29-50 | Cited | MISSING | Citations=1; Iterations=1 |

---

## 5. Skills

> `.skilled/skills/**` including `SKILL.md`, `references/`, `assets/`, `feature-catalog/`, `manual-testing-playbook/`, `scripts/`, `shared/`, `runtime/`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/skills/sk-code/README.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-git/assets/commit-message-template.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/sk-git/hard-rules.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-git/references/remote-branch-policy.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-git/scripts/commit-id-naming.sh:5-18,30-48,190-231 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs:13-20,57-69,76-115 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs:13-20,107-115 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/skills/sk-git/scripts/hooks/README.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/sk-git/scripts/hooks/README.md:18-35,71-84 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/skills/sk-git/scripts/lib/message-contract.mjs | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/sk-git/scripts/remote-branch-allowlist.txt | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-git/scripts/validate-message.mjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-git/scripts/validate-message.mjs:125-136,192-197 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/skills/sk-git/scripts/worktree-naming.sh | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-git/scripts/worktree-naming.sh:11-17,58-77 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/skills/sk-git/scripts/worktree-naming.sh:58-77,508-559 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/skills/sk-git/scripts/worktree-naming.sh:398-425,508-559 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/skills/sk-git/scripts/worktree-provision-paths.txt | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-git/SKILL.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/sk-git/SKILL.md:230-248,308-318 | Cited | MISSING | Citations=1; Iterations=1 |

---

## 6. Specs

> `.opencode/specs/**` and `specs/**`. Takes precedence over `Config` for spec-folder JSON metadata.

| Path | Action | Status | Note |
|------|--------|--------|------|
| specs/sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/005-external-user-guide/spec.md | Cited | OK | Citations=1; Iterations=1 |
| specs/sk-code/011-sk-code-poinytail-based-refinement/029-surface-setup-build/002-doctor-sk-code-setup/spec.md | Cited | OK | Citations=1; Iterations=1 |

---

## 7. Scripts

> Executable or build/test scripts: `.sh`, `.js`, `.ts`, `.mjs`, `.cjs`, `.py`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/scripts/git-hooks/lib/commit-id-policy.sh | Cited | OK | Citations=2; Iterations=2 |
| .skilled/scripts/install-git-hooks.sh | Cited | OK | Citations=1; Iterations=1 |

---
