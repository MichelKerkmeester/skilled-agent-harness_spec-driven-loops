---
title: "Resource Map — Optimize the ripgrep-first retrieval design that packet specs/system-speckit/049-memory-decommission replaces the system-spec-memory MCP database with, so phases 001-trigger-index-replacement and 004-grep-convention-doc-retrofit can be expanded and improved before they are built. Read the parent spec.md, goal.md and the four phase specs first. Investigate, with evidence from this repository and from ripgrep documentation and source: (1) the generated trigger-index design over trigger_phrases frontmatter: JSON shape, phrase normalization and tokenization, multi-word and partial-phrase matching, case folding, stop-word and stemming choices that need no embeddings, lookup algorithm and cold-start latency against a 200ms budget, idempotent generation, malformed-frontmatter reporting, and how it must match or exceed the current LOWER(trigger_phrases) LIKE lane in mcp-server/lib/search/hybrid-search.ts; (2) ripgrep invocation conventions that replace memory_search, memory_context and memory_quick_search: flag choices such as --json, -l, -c, -F, -i, -w, --multiline, --glob, --type-add, --sort, --max-count, --pre, .rgignore and .ignore files to exclude z_archive and node_modules, and how to get useful ranking from rg output alone; (3) the corpus shape that makes grep precise: frontmatter key stability, one-fact-per-line, ANCHOR markers, naming grammar, what belongs in trigger_phrases and what does not; (4) what the retired MCP surface offered that grep cannot, such as continuity frontmatter writing, causal graph, resource maps, and what replaces each; (5) a parity harness design and frozen prompt set; (6) failure modes, edge cases, and measurable acceptance criteria. Produce concrete, ranked recommendations that amend the phase 001 and 004 specs, plans and tasks, each citing file paths and lines. Execution note for this lineage: you are the executor and the leaf. Perform every iteration yourself, in this session, reading files and writing the iteration, delta, state and research artifacts directly into your lineage directory. Never spawn codex exec, opencode run, or any other nested CLI or agent process for an iteration."
description: "Auto-generated research resource map from convergence evidence."
trigger_phrases: []
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

## Summary

- **Total references**: 19
- **By category**: READMEs=0, Documents=0, Commands=0, Agents=0, Skills=11, Specs=8, Scripts=0, Tests=0, Config=0, Meta=0
- **Missing on disk**: 0
- **Scope**: research convergence output for 005-ripgrep-retrieval-research
- **Generated**: 2026-09-02T17:41:42.182Z

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` · `MISSING` · `PLANNED`.

## 5. Skills

> `.opencode/skills/**` including `SKILL.md`, `references/`, `assets/`, `feature-catalog/`, `manual-testing-playbook/`, `scripts/`, `shared/`, `mcp-server/`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .opencode/skills/system-spec-kit/mcp-server/handlers/memory-context.ts | Cited | OK | Citations=1; Iterations=1 |
| .opencode/skills/system-spec-kit/mcp-server/handlers/memory-search.ts | Cited | OK | Citations=1; Iterations=1 |
| .opencode/skills/system-spec-kit/mcp-server/lib/search/anchor-metadata.ts | Cited | OK | Citations=1; Iterations=1 |
| .opencode/skills/system-spec-kit/mcp-server/lib/search/hybrid-search.ts | Cited | OK | Citations=2; Iterations=2 |
| .opencode/skills/system-spec-kit/mcp-server/stress-test/session/gate-d-benchmark-session-resume.vitest.ts | Cited | OK | Citations=1; Iterations=1 |
| .opencode/skills/system-spec-kit/mcp-server/tests/fixtures/golden-queries.json | Cited | OK | Citations=1; Iterations=1 |
| .opencode/skills/system-spec-kit/mcp-server/tests/fixtures/trigger-goldens.json | Cited | OK | Citations=1; Iterations=1 |
| .opencode/skills/system-spec-kit/mcp-server/tests/hybrid-search.vitest.ts | Cited | OK | Citations=2; Iterations=2 |
| .opencode/skills/system-spec-kit/references/memory/memory-system.md | Cited | OK | Citations=1; Iterations=1 |
| .opencode/skills/system-spec-kit/scripts/lib/frontmatter-migration.ts | Cited | OK | Citations=1; Iterations=1 |
| .opencode/skills/system-spec-kit/shared/parsing/memory-template-contract.ts | Cited | OK | Citations=1; Iterations=1 |

---

## 6. Specs

> `.opencode/specs/**` and `specs/**`. Takes precedence over `Config` for spec-folder JSON metadata.

| Path | Action | Status | Note |
|------|--------|--------|------|
| specs/system-speckit/049-memory-decommission/001-trigger-index-replacement/acceptance-criteria.md | Cited | OK | Citations=2; Iterations=2 |
| specs/system-speckit/049-memory-decommission/001-trigger-index-replacement/plan.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-speckit/049-memory-decommission/001-trigger-index-replacement/spec.md | Cited | OK | Citations=2; Iterations=2 |
| specs/system-speckit/049-memory-decommission/001-trigger-index-replacement/tasks.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-speckit/049-memory-decommission/002-memory-consumer-rewire/spec.md | Cited | OK | Citations=2; Iterations=2 |
| specs/system-speckit/049-memory-decommission/004-grep-convention-doc-retrofit/spec.md | Cited | OK | Citations=2; Iterations=2 |
| specs/system-speckit/049-memory-decommission/goal.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-speckit/049-memory-decommission/spec.md | Cited | OK | Citations=1; Iterations=1 |

---
