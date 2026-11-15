---
title: "Resource Map — files changed in commits 169da2e8cba..1c7bc3d9d63: the history lookup engine move into .skilled/hooks/session-handover/history and everything that followed it"
description: "Auto-generated review resource map from convergence evidence."
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

## Summary

- **Total references**: 9
- **By category**: READMEs=0, Documents=2, Commands=0, Agents=0, Skills=3, Specs=0, Scripts=1, Tests=1, Config=2, Meta=0
- **Missing on disk**: 2
- **Scope**: review convergence output for 001-history-lookup-handover-integration
- **Generated**: 2026-11-15T18:11:11.627Z

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` · `MISSING` · `PLANNED`.

## 2. Documents

> Long-form markdown artifacts that are not READMEs: guides, specs, references, install docs, catalogs, playbooks.

| Path | Action | Status | Note |
|------|--------|--------|------|
| N-DIM-MAINT-I4 | Validated | MISSING | Findings P0=0 P1=0 P2=0; Iterations=3 |
| N-INV-BOUNDS-I4 | Validated | MISSING | Findings P0=0 P1=0 P2=0; Iterations=1 |

---

## 5. Skills

> `.skilled/skills/**` including `SKILL.md`, `references/`, `assets/`, `feature-catalog/`, `manual-testing-playbook/`, `scripts/`, `shared/`, `runtime/`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/compaction-history-lookup.md | Analyzed | OK | Findings P0=0 P1=0 P2=2; Iterations=1 |
| .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/hop-recall-conversation.md | Analyzed | OK | Findings P0=0 P1=0 P2=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/hooks/claude/hook-state.ts | Analyzed | OK | Findings P0=0 P1=0 P2=1; Iterations=1 |

---

## 7. Scripts

> Executable or build/test scripts: `.sh`, `.js`, `.ts`, `.mjs`, `.cjs`, `.py`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/hooks/session-handover/history/lib/lookup-offer.ts | Analyzed | OK | Findings P0=0 P1=0 P2=1; Iterations=1 |

---

## 8. Tests

> Test files, fixtures, and snapshots. Tests take precedence over `Scripts`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/hooks/shared/tests/session-readers/project.test.mjs | Analyzed | OK | Findings P0=0 P1=0 P2=1; Iterations=1 |

---

## 9. Config

> Machine-readable configuration: `.json`, `.jsonc`, `.yaml`, `.yml`, `.toml`, `.env.example`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .github/workflows/spec-kit-check.yml | Analyzed | OK | Findings P0=0 P1=0 P2=1; Iterations=1 |
| .skilled/hooks/session-handover/history/package.json | Analyzed | OK | Findings P0=0 P1=1 P2=0; Iterations=1 |

---
