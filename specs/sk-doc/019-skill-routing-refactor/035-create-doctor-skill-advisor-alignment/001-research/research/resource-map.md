---
title: "Resource Map — align create/doctor commands with skill-advisor index for easy skill creation"
description: "Auto-generated research resource map from convergence evidence."
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

## Summary

- **Total references**: 10
- **By category**: READMEs=0, Documents=1, Commands=3, Agents=0, Skills=5, Specs=0, Scripts=1, Tests=0, Config=0, Meta=0
- **Missing on disk**: 4
- **Scope**: research convergence output for 001-research
- **Generated**: 2026-07-30T20:26:55.899Z

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` · `MISSING` · `PLANNED`.

## 2. Documents

> Long-form markdown artifacts that are not READMEs: guides, specs, references, install docs, catalogs, playbooks.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .pi/{agents,prompts} | Cited | MISSING | Citations=1; Iterations=1 |

---

## 3. Commands

> `.opencode/commands/**` and any runtime-specific command surfaces.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .opencode/commands/doctor/_routes.yaml | Cited | OK | Citations=2; Iterations=2 |
| .opencode/commands/doctor/assets/doctor-runtime-mirrors.yaml | Cited | OK | Citations=3; Iterations=3 |
| .opencode/commands/doctor/scripts/parent-skill-check.cjs | Cited | OK | Citations=1; Iterations=1 |

---

## 5. Skills

> `.opencode/skills/**` including `SKILL.md`, `references/`, `assets/`, `feature-catalog/`, `manual-testing-playbook/`, `scripts/`, `shared/`, `mcp-server/`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .opencode/skills/sk-doc/sk-create-skill/references/shared/skill-root-metadata-contract.md | Cited | OK | Citations=1; Iterations=1 |
| .opencode/skills/system-deep-loop/{description,graph-metadata,mode-registry,hub-router,leaf-manifest}.json | Cited | MISSING | Citations=1; Iterations=1 |
| .opencode/skills/system-spec-kit/scripts/{runtime-mirrors,codex,pi}/*.cjs | Cited | MISSING | Citations=1; Iterations=1 |
| .opencode/skills/system-spec-kit/scripts/pi/{sync-agents-pi.cjs,sync-prompts-pi.cjs} | Cited | MISSING | Citations=1; Iterations=1 |
| .opencode/skills/system-spec-kit/scripts/runtime-mirrors/sync-runtime-mirrors.cjs | Cited | OK | Citations=1; Iterations=1 |

---

## 7. Scripts

> Executable or build/test scripts: `.sh`, `.js`, `.ts`, `.mjs`, `.cjs`, `.py`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .opencode/bin/install-codex-hooks.mjs | Cited | OK | Citations=2; Iterations=2 |

---
