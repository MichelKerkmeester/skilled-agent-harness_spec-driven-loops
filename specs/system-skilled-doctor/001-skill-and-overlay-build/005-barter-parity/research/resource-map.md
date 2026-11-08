---
title: "Resource Map — How should Skilled's vendored-copy overlay and re-pin support be improved so external repo users like Barter can adopt it? Skilled side (read in /Users/michelkerkmeester/worktrees/public/324-overlay-repin-barter-parity): .skilled/commands/doctor/overlay.md, .skilled/commands/doctor/scripts/overlay-engine.cjs and its tests, .skilled/skills/system-skilled-doctor/ (SKILL.md, README.md, references/overlays.md), .skilled/hooks/overlay-guard/, README.md section 5, doctor install/helper/setup. Barter side (read-only, /Users/michelkerkmeester/MEGA/Development/Skilled/barter/ai-speckit): skilled/barter-overlays/ (README.md runbook, overlay-manifest.json, replay.cjs, sync.cjs, sync-state.json), skilled/.skilled/hooks/overlay-sync/, README.md. Known gaps to verify and extend: Barter has no .skilled-overlays.json so /doctor:overlay status exits 2; with the setting the engine refuses barter-overlays/sk-code/sk-code-frontend/references/barter-design-tokens.md for missing protectedPaths; engine DEFAULT_RUNTIME_FOLDERS omits .dsh; no repin.exclude for .opencode/scripts; no fork-drifted state; no post-repin regenerate steps (dsh skill links, runtime mirrors, hook registrations, trigger index, advisor graph); root-file traps (AGENTS.md, REPO RULES.md); docs only advertise linking. Deliver: ranked engine changes, Barter manifest migration steps, and doc/advertising changes, each with file:line evidence."
description: "Auto-generated research resource map from convergence evidence."
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

## Summary

- **Total references**: 12
- **By category**: READMEs=1, Documents=0, Commands=4, Agents=0, Skills=4, Specs=0, Scripts=1, Tests=0, Config=1, Meta=1
- **Missing on disk**: 0
- **Scope**: research convergence output for 005-barter-parity
- **Generated**: 2026-11-07T21:52:18.640Z

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` · `MISSING` · `PLANNED`.

## 1. READMEs

| Path | Action | Status | Note |
|------|--------|--------|------|
| /Users/michelkerkmeester/MEGA/Development/Skilled/barter/ai-speckit/skilled/barter-overlays/README.md | Cited | OK | Citations=1; Iterations=1 |

---

## 3. Commands

> `.skilled/commands/**` and any runtime-specific command surfaces.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/commands/doctor/install.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/scripts/overlay-engine.cjs | Cited | OK | Citations=5; Iterations=5 |
| .skilled/commands/doctor/scripts/tests/doctor-runtime-mirrors-contract.test.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/scripts/tests/overlay-engine-repin.test.cjs | Cited | OK | Citations=1; Iterations=1 |

---

## 5. Skills

> `.skilled/skills/**` including `SKILL.md`, `references/`, `assets/`, `feature-catalog/`, `manual-testing-playbook/`, `scripts/`, `shared/`, `runtime/`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/skills/system-skilled-doctor/references/overlays.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-spec-kit/runtime/cli/dsh/sync-skills-dsh.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs | Cited | OK | Citations=1; Iterations=1 |

---

## 7. Scripts

> Executable or build/test scripts: `.sh`, `.js`, `.ts`, `.mjs`, `.cjs`, `.py`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| /Users/michelkerkmeester/MEGA/Development/Skilled/barter/ai-speckit/skilled/barter-overlays/sync.cjs | Cited | OK | Citations=1; Iterations=1 |

---

## 9. Config

> Machine-readable configuration: `.json`, `.jsonc`, `.yaml`, `.yml`, `.toml`, `.env.example`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| /Users/michelkerkmeester/MEGA/Development/Skilled/barter/ai-speckit/skilled/barter-overlays/overlay-manifest.json | Cited | OK | Citations=2; Iterations=2 |

---

## 10. Meta

> Repository-wide governance artifacts such as `AGENTS.md`, `CLAUDE.md`, `LICENSE`, and root `README.md`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| README.md | Cited | OK | Citations=2; Iterations=2 |

---
