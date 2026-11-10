---
title: "Resource Map — Which lexical search techniques from sweet-search (core/search grep-side modules) would improve system-spec-kit retrieval (committed trigger index, ripgrep recipes, caller-side ranking tuple)? Hard constraint: no embeddings, no vector/BM25 fusion, no MCP, no daemon, no persistent index. Test five lessons: zero-hit fallback to git-changed files, per-file caps with elision line, meaningful-line preference over boilerplate, out-of-scope hit hint, and dedup plus final-k cut."
description: "Auto-generated research resource map from convergence evidence."
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

## Summary

- **Total references**: 27
- **By category**: READMEs=0, Documents=1, Commands=0, Agents=2, Skills=14, Specs=9, Scripts=0, Tests=0, Config=1, Meta=0
- **Missing on disk**: 2
- **Scope**: research convergence output for 002-retrieval-lessons-research
- **Generated**: 2026-11-09T14:35:34.834Z

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` · `MISSING` · `PLANNED`.

## 2. Documents

> Long-form markdown artifacts that are not READMEs: guides, specs, references, install docs, catalogs, playbooks.

| Path | Action | Status | Note |
|------|--------|--------|------|
| measured in this iteration with /usr/bin/time -p against this checkout | Cited | MISSING | Citations=1; Iterations=1 |

---

## 4. Agents

> `.skilled/agents/**`, `.claude/agents/**`, `.skilled/agents/**`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .claude/agents/deep-research.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/agents/deep-research.md | Cited | OK | Citations=1; Iterations=1 |

---

## 5. Skills

> `.skilled/skills/**` including `SKILL.md`, `references/`, `assets/`, `feature-catalog/`, `manual-testing-playbook/`, `scripts/`, `shared/`, `runtime/`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/skills/system-spec-kit/references/retrieval/retrieval-conventions.md | Cited | OK | Citations=4; Iterations=4 |
| .skilled/skills/system-spec-kit/runtime/cli/core/workflow.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/artifact.mjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/corpus.mjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/freshness.mjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/phrase-judge.mjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/rg-lane.mjs | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs | Cited | OK | Citations=6; Iterations=6 |
| .skilled/skills/system-spec-kit/runtime/cli/retrieval/README.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/retrieval/rg-wrapper.mjs | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/system-spec-kit/runtime/cli/tests/retrieval-coverage-parity.vitest.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/data/trigger-index.json | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-spec-kit/templates/examples/level-2/acceptance-criteria.md | Cited | OK | Citations=1; Iterations=1 |

---

## 6. Specs

> `.opencode/specs/**` and `specs/**`. Takes precedence over `Config` for spec-folder JSON metadata.

| Path | Action | Status | Note |
|------|--------|--------|------|
| specs/hooks-plugins-extensions/retrieval-integrations/001-sweet-search-integration/002-retrieval-lessons-research/research/deep-research-strategy.md | Cited | OK | Citations=1; Iterations=1 |
| specs/hooks-plugins-extensions/retrieval-integrations/001-sweet-search-integration/002-retrieval-lessons-research/research/iterations/iteration-004.md | Cited | OK | Citations=1; Iterations=1 |
| specs/hooks-plugins-extensions/retrieval-integrations/001-sweet-search-integration/002-retrieval-lessons-research/research/prompts/iteration-5.md | Cited | OK | Citations=1; Iterations=1 |
| specs/hooks-plugins-extensions/retrieval-integrations/001-sweet-search-integration/context/sweet-search-main/core/search/grep-allocation-rules.js | Cited | OK | Citations=1; Iterations=1 |
| specs/hooks-plugins-extensions/retrieval-integrations/001-sweet-search-integration/context/sweet-search-main/core/search/grep-line-classes.js | Cited | OK | Citations=2; Iterations=2 |
| specs/hooks-plugins-extensions/retrieval-integrations/001-sweet-search-integration/context/sweet-search-main/core/search/grep-output-shaping.js | Cited | OK | Citations=1; Iterations=1 |
| specs/hooks-plugins-extensions/retrieval-integrations/001-sweet-search-integration/context/sweet-search-main/core/search/grep-outside-probe.js | Cited | OK | Citations=1; Iterations=1 |
| specs/hooks-plugins-extensions/retrieval-integrations/001-sweet-search-integration/context/sweet-search-main/core/search/grep-unindexed-fallback.js | Cited | OK | Citations=1; Iterations=1 |
| specs/hooks-plugins-extensions/retrieval-integrations/001-sweet-search-integration/context/sweet-search-main/core/search/index-freshness.js | Cited | OK | Citations=1; Iterations=1 |

---

## 9. Config

> Machine-readable configuration: `.json`, `.jsonc`, `.yaml`, `.yml`, `.toml`, `.env.example`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| measured in this iteration against .skilled/skills/system-spec-kit/runtime/data/trigger-index.json | Cited | MISSING | Citations=1; Iterations=1 |

---
