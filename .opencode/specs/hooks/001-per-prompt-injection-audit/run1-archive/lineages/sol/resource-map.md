---
title: "Resource Map — Reduce per-prompt injection bloat across all six runtime hook adapters (Claude Code, Codex, Cursor, Devin, OpenCode, Pi). Inventory every block injected on each user turn (skill-advisor brief, the three always-on directives comment-hygiene/governor/proof-over-appearance, the spec-gate Gate-3 question, the Pi-only subagent-dispatch directive, SessionStart context) with exact owning modules; quantify per-turn token cost and value vs redundancy/staleness; research best practices for per-turn injection (concision, conditional/threshold-gated injection, cross-turn deduplication, prompt-cache-friendly placement, one-time-vs-every-turn); propose ranked, cross-runtime-consistent reductions (trim, conditionalize, consolidate, cache, drop) that preserve guardrail effectiveness, with measured before/after token estimates."
description: "Auto-generated research resource map from convergence evidence."
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

## Summary

- **Total references**: 4
- **By category**: READMEs=0, Documents=0, Commands=0, Agents=0, Skills=3, Specs=1, Scripts=0, Tests=0, Config=0, Meta=0
- **Missing on disk**: 0
- **Scope**: research convergence output for 001-per-prompt-injection-audit
- **Generated**: 2026-08-06T07:08:50.083Z

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` · `MISSING` · `PLANNED`.

## 5. Skills

> `.opencode/skills/**` including `SKILL.md`, `references/`, `assets/`, `feature-catalog/`, `manual-testing-playbook/`, `scripts/`, `shared/`, `mcp-server/`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .opencode/skills/system-skill-advisor/mcp-server/lib/render.ts | Cited | OK | Citations=1; Iterations=1 |
| .opencode/skills/system-spec-kit/mcp-server/hooks/claude/session-prime.ts | Cited | OK | Citations=1; Iterations=1 |
| .opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.mjs | Cited | OK | Citations=1; Iterations=1 |

---

## 6. Specs

> `.opencode/specs/**` and `specs/**`. Takes precedence over `Config` for spec-folder JSON metadata.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .opencode/specs/hooks/001-per-prompt-injection-audit/research/lineages/sol/iterations/iteration-008.md | Cited | OK | Citations=1; Iterations=1 |

---
