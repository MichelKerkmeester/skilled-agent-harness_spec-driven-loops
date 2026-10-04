---
title: "Resource Map — Is /doctor:update perfected? Audit the whole /doctor:update surface end to end: the router .skilled/commands/doctor/update.md, the workflows doctor-update-check.yaml, doctor-update-align.yaml and doctor-update-apply.yaml, doctor-update-presentation.txt, the engine .skilled/commands/doctor/scripts/release-update.cjs and its tests. Find every remaining defect, gap, unsafe path and drift: workflow promises the engine does not keep, engine behaviour the workflows do not describe, real operator scenarios that break (vendored tree without tags, offline, prereleases, renamed, deleted, binary or generated files, partial or interrupted apply, rollback, customized skills), sk-create-command contract violations, missing tests. Rank the fixes that would make it perfect. Ground every claim in file and line evidence from this repository."
description: "Auto-generated research resource map from convergence evidence."
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

## Summary

- **Total references**: 17
- **By category**: READMEs=3, Documents=2, Commands=10, Agents=0, Skills=2, Specs=0, Scripts=0, Tests=0, Config=0, Meta=0
- **Missing on disk**: 2
- **Scope**: research convergence output for 005-doctor-update-research
- **Generated**: 2026-10-03T19:48:30.696Z

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` · `MISSING` · `PLANNED`.

## 1. READMEs

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/bin/README.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/changelog/skilled/README.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/scripts/README.md | Cited | OK | Citations=1; Iterations=1 |

---

## 2. Documents

> Long-form markdown artifacts that are not READMEs: guides, specs, references, install docs, catalogs, playbooks.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/changelog/skilled/v4.0.0.3.md | Cited | OK | Citations=1; Iterations=1 |
| PUBLIC-RELEASE.md | Cited | OK | Citations=1; Iterations=1 |

---

## 3. Commands

> `.skilled/commands/**` and any runtime-specific command surfaces.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/commands/doctor/assets/doctor-rebuild.yaml | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/assets/doctor-update-align.yaml | Cited | OK | Citations=4; Iterations=4 |
| .skilled/commands/doctor/assets/doctor-update-apply.yaml | Cited | OK | Citations=5; Iterations=5 |
| .skilled/commands/doctor/assets/doctor-update-check.yaml | Cited | OK | Citations=2; Iterations=2 |
| .skilled/commands/doctor/assets/doctor-update-presentation.txt | Cited | OK | Citations=4; Iterations=4 |
| .skilled/commands/doctor/assets/workflows/doctor-update-align.yaml | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/commands/doctor/assets/workflows/doctor-update-apply.yaml | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/commands/doctor/scripts/release-update.cjs | Cited | OK | Citations=6; Iterations=6 |
| .skilled/commands/doctor/scripts/tests/release-update.test.cjs | Cited | OK | Citations=4; Iterations=4 |
| .skilled/commands/doctor/update.md | Cited | OK | Citations=4; Iterations=4 |

---

## 5. Skills

> `.skilled/skills/**` including `SKILL.md`, `references/`, `assets/`, `feature-catalog/`, `manual-testing-playbook/`, `scripts/`, `shared/`, `runtime/`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/skills/sk-doc/sk-create-command/assets/command-contract.json | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/sk-doc/sk-create-command/SKILL.md | Cited | OK | Citations=3; Iterations=3 |

---
