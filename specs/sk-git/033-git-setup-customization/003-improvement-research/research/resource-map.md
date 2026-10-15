---
title: "Resource Map — How can the read-only /doctor:git setup check and the /doctor:git command family be improved further? Study the shipped work: .skilled/commands/doctor/scripts/git-setup-check.cjs and its test, .skilled/commands/doctor/git.md, _routes.yaml, assets/doctor-git-setup.yaml, assets/doctor-git-presentation.txt, the sk-git skill (.skilled/skills/sk-git/SKILL.md, scripts/, hard-rules.json, feature-catalog/workflow-playbooks/doctor-git-settings.md, manual-testing-playbook DOC-384) and the packets specs/sk-git/033-git-setup-customization (001 research, 002 build) and specs/sk-git/034-standards-template-round-trip. Find concrete improvements: checks still missing, failure modes the battery reads as healthy, repairs that could be wrong, untrusted-repository vectors not yet closed (any git or helper path a repository config can steer), drift between docs and behavior, test gaps, and the deferred items (a per-repository hard-rules.json overlay, the remaining CI failures in Gate Inputs hook tests and sk-doc Script Tests). Rank each with impact and effort and cite path:line for every claim. End with proposed implementation phases."
description: "Auto-generated research resource map from convergence evidence."
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

## Summary

- **Total references**: 31
- **By category**: READMEs=1, Documents=0, Commands=10, Agents=0, Skills=8, Specs=6, Scripts=4, Tests=1, Config=1, Meta=0
- **Missing on disk**: 0
- **Scope**: research convergence output for 003-improvement-research
- **Generated**: 2026-10-15T14:21:34.880Z

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` · `MISSING` · `PLANNED`.

## 1. READMEs

| Path | Action | Status | Note |
|------|--------|--------|------|
| .github/workflows/README.md | Cited | OK | Citations=1; Iterations=1 |

---

## 3. Commands

> `.skilled/commands/**` and any runtime-specific command surfaces.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/commands/doctor/_routes.yaml | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/assets/doctor-git-hooks.yaml | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/assets/doctor-git-presentation.txt | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/assets/doctor-git-setup.yaml | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/assets/doctor-git-standards.yaml | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/scripts/git-hook-gates.cjs | Cited | OK | Citations=2; Iterations=2 |
| .skilled/commands/doctor/scripts/git-setup-check.cjs | Cited | OK | Citations=4; Iterations=4 |
| .skilled/commands/doctor/scripts/git-standards.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs | Cited | OK | Citations=2; Iterations=2 |
| .skilled/commands/doctor/update.md | Cited | OK | Citations=1; Iterations=1 |

---

## 5. Skills

> `.skilled/skills/**` including `SKILL.md`, `references/`, `assets/`, `feature-catalog/`, `manual-testing-playbook/`, `scripts/`, `shared/`, `runtime/`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .opencode/skills/sk-doc/scripts/tests/run-script-tests.sh | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-doc/scripts/tests/test_readme_manifest.py | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-doc/scripts/tests/test_readme_verdict_parity.py | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-git/hard-rules.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-git/manual-testing-playbook/doctor-commands/doctor-git-setup-check.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/sk-git/scripts/lib/message-contract.mjs | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/sk-git/scripts/worktree-naming.sh | Cited | OK | Citations=1; Iterations=1 |

---

## 6. Specs

> `.opencode/specs/**` and `specs/**`. Takes precedence over `Config` for spec-folder JSON metadata.

| Path | Action | Status | Note |
|------|--------|--------|------|
| specs/sk-git/033-git-setup-customization/003-improvement-research/research/deep-research-strategy.md | Cited | OK | Citations=1; Iterations=1 |
| specs/sk-git/033-git-setup-customization/003-improvement-research/research/iterations/iteration-001.md | Cited | OK | Citations=1; Iterations=1 |
| specs/sk-git/033-git-setup-customization/003-improvement-research/research/iterations/iteration-003.md | Cited | OK | Citations=1; Iterations=1 |
| specs/sk-git/033-git-setup-customization/003-improvement-research/research/iterations/iteration-004.md | Cited | OK | Citations=1; Iterations=1 |
| specs/sk-git/034-standards-template-round-trip/implementation-summary.md | Cited | OK | Citations=2; Iterations=2 |
| specs/sk-git/034-standards-template-round-trip/tasks.md | Cited | OK | Citations=2; Iterations=2 |

---

## 7. Scripts

> Executable or build/test scripts: `.sh`, `.js`, `.ts`, `.mjs`, `.cjs`, `.py`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .github/scripts/check-gate-inputs.sh | Cited | OK | Citations=2; Iterations=2 |
| .skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs | Cited | OK | Citations=2; Iterations=2 |
| .skilled/scripts/git-hooks/lib/commit-id-policy.sh | Cited | OK | Citations=1; Iterations=1 |
| .skilled/scripts/install-git-hooks.sh | Cited | OK | Citations=1; Iterations=1 |

---

## 8. Tests

> Test files, fixtures, and snapshots. Tests take precedence over `Scripts`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .github/scripts/tests/check-gate-inputs.test.sh | Cited | OK | Citations=2; Iterations=2 |

---

## 9. Config

> Machine-readable configuration: `.json`, `.jsonc`, `.yaml`, `.yml`, `.toml`, `.env.example`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .github/workflows/sk-doc-script-tests.yml | Cited | OK | Citations=2; Iterations=2 |

---
