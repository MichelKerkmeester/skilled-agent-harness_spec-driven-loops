---
title: "Resource Map — Review all shipped work of the /doctor:git setup program for correctness, security, traceability and maintainability, and judge whether it is complete: commits 8d40b8c128 through 0b2414a14b on main (git log c05034a20b..0b2414a14b). Scope: .skilled/commands/doctor/scripts/git-setup-check.cjs and tests/git-setup-check.test.cjs, assets/doctor-git-setup.yaml, assets/doctor-git-presentation.txt, git.md, _routes.yaml, scripts/route-validate.py and its test, .github/scripts/check-gate-inputs.sh and its test, .skilled/skills/sk-git/assets/commit-message-template.md, sk-git SKILL.md, README.md, feature-catalog/workflow-playbooks/doctor-git-settings.md, manual-testing-playbook DOC-384, the root README.md sk-git sections, and the packets specs/sk-git/033-git-setup-customization/002-doctor-git-setup and specs/sk-git/034-standards-template-round-trip. Invariants to attack: the battery writes nothing and never runs code from the repository it inspects (any git, helper or config path a repository can steer), exit codes and the STATUS line agree, each FAIL's repair actually fixes it, each check matches what the hooks and helpers really do, tests fail when the behavior breaks, and every doc that lists /doctor:git targets names setup accurately. Every finding needs a concrete failure case and path:line evidence."
description: "Auto-generated review resource map from convergence evidence."
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

## Summary

- **Total references**: 4
- **By category**: READMEs=0, Documents=0, Commands=2, Agents=0, Skills=0, Specs=2, Scripts=0, Tests=0, Config=0, Meta=0
- **Missing on disk**: 0
- **Scope**: review convergence output for 004-final-deep-review
- **Generated**: 2026-10-15T14:48:25.846Z

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` · `MISSING` · `PLANNED`.

## 3. Commands

> `.skilled/commands/**` and any runtime-specific command surfaces.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/commands/doctor/scripts/git-setup-check.cjs | Analyzed | OK | Findings P0=0 P1=4 P2=2; Iterations=4 |
| .skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs | Analyzed | OK | Findings P0=0 P1=0 P2=1; Iterations=2 |

---

## 6. Specs

> `.opencode/specs/**` and `specs/**`. Takes precedence over `Config` for spec-folder JSON metadata.

| Path | Action | Status | Note |
|------|--------|--------|------|
| specs/sk-git/033-git-setup-customization/002-doctor-git-setup/acceptance-criteria.md | Validated | OK | Findings P0=0 P1=0 P2=0; Iterations=1 |
| specs/sk-git/033-git-setup-customization/002-doctor-git-setup/tasks.md | Validated | OK | Findings P0=0 P1=0 P2=0; Iterations=1 |

---
