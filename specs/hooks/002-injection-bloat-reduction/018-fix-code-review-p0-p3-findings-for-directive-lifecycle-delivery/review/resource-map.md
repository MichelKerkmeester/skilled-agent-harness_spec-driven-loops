---
title: "Resource Map — Review the completed phase 018 directive-lifecycle implementation and packet evidence for correctness, security, traceability, maintainability, and regression-proof honesty. Treat unrelated dirty-tree changes as out of scope. Bind all review state to the packet and do not modify implementation files."
description: "Auto-generated review resource map from convergence evidence."
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

## Summary

- **Total references**: 13
- **By category**: READMEs=0, Documents=1, Commands=0, Agents=0, Skills=1, Specs=0, Scripts=5, Tests=3, Config=3, Meta=0
- **Missing on disk**: 11
- **Scope**: review convergence output for 018-fix-code-review-p0-p3-findings-for-directive-lifecycle-delivery
- **Generated**: 2026-08-11T20:54:53.620Z

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` · `MISSING` · `PLANNED`.

## 2. Documents

> Long-form markdown artifacts that are not READMEs: guides, specs, references, install docs, catalogs, playbooks.

| Path | Action | Status | Note |
|------|--------|--------|------|
| checklist.md | Analyzed | MISSING | Findings P0=0 P1=0 P2=3; Iterations=2 |

---

## 5. Skills

> `.opencode/skills/**` including `SKILL.md`, `references/`, `assets/`, `feature-catalog/`, `manual-testing-playbook/`, `scripts/`, `shared/`, `mcp-server/`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .opencode/skills/system-spec-kit/mcp-server/hooks/claude/directive-lifecycle-boundary.ts | Validated | OK | Findings P0=0 P1=0 P2=0; Iterations=1 |

---

## 7. Scripts

> Executable or build/test scripts: `.sh`, `.js`, `.ts`, `.mjs`, `.cjs`, `.py`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .opencode/plugins/mk-skill-advisor.js | Validated | OK | Findings P0=0 P1=0 P2=0; Iterations=1 |
| devin/post-compaction.cjs | Analyzed | MISSING | Findings P0=0 P1=1 P2=0; Iterations=1 |
| directive-lifecycle-boundary.js | Analyzed | MISSING | Findings P0=0 P1=0 P2=1; Iterations=1 |
| directive-lifecycle-file-store.ts | Analyzed | MISSING | Findings P0=0 P1=0 P2=5; Iterations=2 |
| directive-lifecycle-store.py | Analyzed | MISSING | Findings P0=0 P1=0 P2=1; Iterations=1 |

---

## 8. Tests

> Test files, fixtures, and snapshots. Tests take precedence over `Scripts`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| claude-user-prompt-submit-hook.vitest.ts | Analyzed | MISSING | Findings P0=0 P1=0 P2=1; Iterations=1 |
| directive-lifecycle.vitest.ts | Analyzed | MISSING | Findings P0=0 P1=0 P2=1; Iterations=1 |
| policy-observation-sink.vitest.ts | Analyzed | MISSING | Findings P0=0 P1=0 P2=1; Iterations=1 |

---

## 9. Config

> Machine-readable configuration: `.json`, `.jsonc`, `.yaml`, `.yml`, `.toml`, `.env.example`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| description.json | Analyzed | MISSING | Findings P0=0 P1=0 P2=1; Iterations=1 |
| graph-metadata.json | Analyzed | MISSING | Findings P0=0 P1=1 P2=1; Iterations=2 |
| parent/graph-metadata.json | Analyzed | MISSING | Findings P0=0 P1=0 P2=1; Iterations=1 |

---
