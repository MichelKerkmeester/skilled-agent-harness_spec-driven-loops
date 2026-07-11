---
title: "Resource Map — Audit the shipped /goal OpenCode plugin implementation in packet deep-loops/032-goal-opencode-plugin (phases 001-state-store through 008-system-spec-kit-integration only; EXCLUDE phase 009-speckit-command-goal-prompt-offer, which is actively owned by a separate in-flight OpenCode session). Review dimensions: correctness (does .opencode/plugins/mk-goal.js match its own phase spec/plan claims), security (prompt-injection sanitization, secret redaction in evidence/logs), spec-alignment/traceability (drift between the 8 phase docs and the live .opencode/plugins/mk-goal.js / .opencode/commands/opencode_goal.md / test suite), completeness/maintainability (missing test coverage, dead code, UX gaps, automation/integration gaps)."
description: "Auto-generated review resource map from convergence evidence."
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

## Summary

- **Total references**: 9
- **By category**: READMEs=0, Documents=0, Commands=1, Agents=0, Skills=2, Specs=3, Scripts=1, Tests=2, Config=0, Meta=0
- **Missing on disk**: 1
- **Scope**: review convergence output for 032-goal-opencode-plugin
- **Generated**: 2026-07-01T09:39:56.416Z

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` · `MISSING` · `PLANNED`.

## 3. Commands

> `.opencode/commands/**` and any runtime-specific command surfaces.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .opencode/commands/opencode_goal.md | Analyzed | MISSING | Findings P0=0 P1=1 P2=1; Iterations=3 |

---

## 5. Skills

> `.opencode/skills/**` including `SKILL.md`, `references/`, `assets/`, `feature_catalog/`, `manual_testing_playbook/`, `scripts/`, `shared/`, `mcp_server/`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .opencode/skills/system-skill-advisor/feature_catalog/hooks-and-plugin/goal-opencode-plugin.md | Analyzed | OK | Findings P0=0 P1=1 P2=0; Iterations=1 |
| .opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md | Analyzed | OK | Findings P0=0 P1=1 P2=0; Iterations=1 |

---

## 6. Specs

> `.opencode/specs/**` and `specs/**`. Takes precedence over `Config` for spec-folder JSON metadata.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .opencode/specs/deep-loops/032-goal-opencode-plugin/003-goal-command/tasks.md | Analyzed | OK | Findings P0=0 P1=1 P2=0; Iterations=1 |
| .opencode/specs/deep-loops/032-goal-opencode-plugin/004-lifecycle-tracking/graph-metadata.json | Analyzed | OK | Findings P0=0 P1=0 P2=1; Iterations=2 |
| .opencode/specs/deep-loops/032-goal-opencode-plugin/review/deep-review-findings-registry.json | Validated | OK | Findings P0=0 P1=0 P2=0; Iterations=1 |

---

## 7. Scripts

> Executable or build/test scripts: `.sh`, `.js`, `.ts`, `.mjs`, `.cjs`, `.py`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .opencode/plugins/mk-goal.js | Analyzed | OK | Findings P0=0 P1=5 P2=1; Iterations=7 |

---

## 8. Tests

> Test files, fixtures, and snapshots. Tests take precedence over `Scripts`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .opencode/plugins/tests/mk-goal-export-contract.test.cjs | Analyzed | OK | Findings P0=0 P1=1 P2=1; Iterations=2 |
| .opencode/plugins/tests/mk-goal-state.test.cjs | Analyzed | OK | Findings P0=0 P1=2 P2=0; Iterations=2 |

---
