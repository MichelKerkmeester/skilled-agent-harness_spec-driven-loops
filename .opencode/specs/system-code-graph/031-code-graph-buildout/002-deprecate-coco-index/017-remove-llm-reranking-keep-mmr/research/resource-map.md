---
title: "Resource Map — What did the 014 CocoIndex + LLM-reranker deprecation arc miss? Residual couplings/references to removed CocoIndex/cross-encoder/rerank-sidecar, capability gaps, behavioral regressions in memory-search/confidence/council, and doc inaccuracies across all touched surfaces."
description: "Auto-generated research resource map from convergence evidence."
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

## Summary

- **Total references**: 34
- **By category**: READMEs=0, Documents=5, Commands=4, Agents=0, Skills=19, Specs=0, Scripts=0, Tests=2, Config=4, Meta=0
- **Missing on disk**: 11
- **Scope**: research convergence output for 017-remove-llm-reranking-keep-mmr
- **Generated**: 2026-05-26T04:42:33.670Z

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` · `MISSING` · `PLANNED`.

## 2. Documents

> Long-form markdown artifacts that are not READMEs: guides, specs, references, install docs, catalogs, playbooks.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .claude/commands/memory/ | Cited | OK | Citations=1; Iterations=1 |
| .codex/commands/memory/ | Cited | MISSING | Citations=1; Iterations=1 |
| .devin/config.json:17,20 | Cited | MISSING | Citations=1; Iterations=1 |
| .vscode/mcp.json:18,21 | Cited | MISSING | Citations=1; Iterations=1 |
| root *.md (README.md) | Cited | MISSING | Citations=1; Iterations=1 |

---

## 3. Commands

> `.opencode/commands/**` and any runtime-specific command surfaces.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .opencode/commands/memory/learn.md | Cited | OK | Citations=1; Iterations=1 |
| .opencode/commands/memory/manage.md | Cited | OK | Citations=1; Iterations=1 |
| .opencode/commands/memory/save.md | Cited | OK | Citations=1; Iterations=1 |
| .opencode/commands/memory/search.md:120-121,872,986-987 | Cited | MISSING | Citations=1; Iterations=1 |

---

## 5. Skills

> `.opencode/skills/**` including `SKILL.md`, `references/`, `assets/`, `feature_catalog/`, `manual_testing_playbook/`, `scripts/`, `shared/`, `mcp_server/`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .opencode/skills/cli-*/SKILL.md | Cited | MISSING | Citations=1; Iterations=1 |
| .opencode/skills/sk-code/references/opencode/shared/code_organization.md | Cited | OK | Citations=1; Iterations=1 |
| .opencode/skills/sk-doc/scripts/validate-doc-model-refs.js:144,160 | Cited | MISSING | Citations=1; Iterations=1 |
| .opencode/skills/system-code-graph/SKILL.md | Cited | OK | Citations=1; Iterations=1 |
| .opencode/skills/system-spec-kit/constitutional/ | Cited | OK | Citations=1; Iterations=1 |
| .opencode/skills/system-spec-kit/feature_catalog/tooling-and-scripts/04-dead-code-removal.md | Cited | OK | Citations=1; Iterations=1 |
| .opencode/skills/system-spec-kit/mcp_server/database/.doctor-update.last-run.json | Cited | OK | Citations=1; Iterations=1 |
| .opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts | Cited | OK | Citations=1; Iterations=1 |
| .opencode/skills/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:155,795 | Cited | MISSING | Citations=1; Iterations=1 |
| .opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts | Cited | OK | Citations=1; Iterations=1 |
| .opencode/skills/system-spec-kit/mcp_server/stress_test/search-quality/corpus.ts:24,109 | Cited | MISSING | Citations=1; Iterations=1 |
| .opencode/skills/system-spec-kit/mcp_server/tests/embedders/sidecar-hardening.vitest.ts | Cited | OK | Citations=1; Iterations=1 |
| .opencode/skills/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts | Cited | OK | Citations=1; Iterations=1 |
| .opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts | Cited | OK | Citations=1; Iterations=1 |
| .opencode/skills/system-spec-kit/references/memory/embedder_architecture.md | Cited | OK | Citations=1; Iterations=1 |
| .opencode/skills/system-spec-kit/references/memory/embedder_pluggability.md | Cited | OK | Citations=1; Iterations=1 |
| .opencode/skills/system-spec-kit/shared/embeddings.ts | Cited | OK | Citations=1; Iterations=1 |
| .opencode/skills/system-spec-kit/shared/embeddings/registry.ts | Cited | OK | Citations=1; Iterations=1 |
| .opencode/skills/system-spec-kit/shared/types.ts | Cited | OK | Citations=1; Iterations=1 |

---

## 8. Tests

> Test files, fixtures, and snapshots. Tests take precedence over `Scripts`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| mcp_server/tests/embedders/sidecar-hardening.vitest.ts | Cited | MISSING | Citations=1; Iterations=1 |
| sidecar-hardening.vitest.ts:545 vs sidecar-client.ts | Cited | MISSING | Citations=1; Iterations=1 |

---

## 9. Config

> Machine-readable configuration: `.json`, `.jsonc`, `.yaml`, `.yml`, `.toml`, `.env.example`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .gemini/commands/memory/learn.toml | Cited | OK | Citations=1; Iterations=1 |
| .gemini/commands/memory/manage.toml | Cited | OK | Citations=1; Iterations=1 |
| .gemini/commands/memory/save.toml | Cited | OK | Citations=1; Iterations=1 |
| .gemini/commands/memory/search.toml | Cited | OK | Citations=1; Iterations=1 |

---
