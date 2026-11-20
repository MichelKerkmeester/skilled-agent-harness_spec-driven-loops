---
title: "Resource Map — specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal"
description: "Auto-generated review resource map from convergence evidence."
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

## Summary

- **Total references**: 15
- **By category**: READMEs=0, Documents=8, Commands=1, Agents=0, Skills=1, Specs=2, Scripts=2, Tests=0, Config=1, Meta=0
- **Missing on disk**: 8
- **Scope**: review convergence output for 070-opencode-v1-removal
- **Generated**: 2026-11-20T10:27:35.951Z

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` · `MISSING` · `PLANNED`.

## 2. Documents

> Long-form markdown artifacts that are not READMEs: guides, specs, references, install docs, catalogs, playbooks.

| Path | Action | Status | Note |
|------|--------|--------|------|
| G5-DIM-CORR | Validated | MISSING | Findings P0=0 P1=0 P2=0; Iterations=2 |
| G5-P1-DR4 | Validated | MISSING | Findings P0=0 P1=0 P2=0; Iterations=2 |
| n-battery-wf | Validated | MISSING | Findings P0=0 P1=0 P2=0; Iterations=1 |
| n-corpus | Validated | MISSING | Findings P0=0 P1=0 P2=0; Iterations=1 |
| n-dualplugin | Validated | MISSING | Findings P0=0 P1=0 P2=0; Iterations=1 |
| n-iter4-maint | Validated | MISSING | Findings P0=0 P1=0 P2=0; Iterations=2 |
| n-parity-test | Validated | MISSING | Findings P0=0 P1=0 P2=0; Iterations=1 |
| n-setup-test | Validated | MISSING | Findings P0=0 P1=0 P2=0; Iterations=1 |

---

## 3. Commands

> `.skilled/commands/**` and any runtime-specific command surfaces.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/commands/doctor/scripts/opencode-version-battery.cjs | Analyzed | OK | Findings P0=0 P1=0 P2=1; Iterations=1 |

---

## 5. Skills

> `.skilled/skills/**` including `SKILL.md`, `references/`, `assets/`, `feature-catalog/`, `manual-testing-playbook/`, `scripts/`, `shared/`, `runtime/`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/skills/system-deep-loop/runtime/tests/unit/opencode-dual-dispatch.vitest.ts | Analyzed | OK | Findings P0=0 P1=0 P2=1; Iterations=1 |

---

## 6. Specs

> `.opencode/specs/**` and `specs/**`. Takes precedence over `Config` for spec-folder JSON metadata.

| Path | Action | Status | Note |
|------|--------|--------|------|
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/001-v1-runtime-code-and-tests/scratch/event-capture.txt | Analyzed | OK | Findings P0=0 P1=0 P2=1; Iterations=1 |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/001-v1-runtime-code-and-tests/tasks.md | Analyzed | OK | Findings P0=0 P1=0 P2=1; Iterations=1 |

---

## 7. Scripts

> Executable or build/test scripts: `.sh`, `.js`, `.ts`, `.mjs`, `.cjs`, `.py`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .opencode/plugins/lib/v2-bridge.js | Analyzed | OK | Findings P0=0 P1=0 P2=2; Iterations=2 |
| .skilled/hooks/cli-dispatch/lib/opencode-version.mjs | Analyzed | OK | Findings P0=0 P1=0 P2=1; Iterations=1 |

---

## 9. Config

> Machine-readable configuration: `.json`, `.jsonc`, `.yaml`, `.yml`, `.toml`, `.env.example`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .github/workflows/opencode-v2-battery.yml | Analyzed | OK | Findings P0=0 P1=0 P2=1; Iterations=1 |

---
