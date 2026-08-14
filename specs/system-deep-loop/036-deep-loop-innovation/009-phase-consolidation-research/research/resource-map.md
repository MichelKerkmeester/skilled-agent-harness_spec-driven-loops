---
title: "Resource Map — Analyze the 036 phase-parent (specs/system-deep-loop/036-deep-loop-innovation) child phase folders (currently ~50, matching ^[0-9]{3}-). Determine (1) whether merging/grouping them into fewer, larger multi-phase groups is feasible and beneficial for context optimization; (2) HOW - which child folders cluster into which fewer bigger multi-phase parents, by theme/dependency, with optimized names; (3) the full migration plan - renaming, and updating ALL references and JSONs (parent+child graph-metadata children_ids, spec.md phase documentation map, cross-refs, description.json, validate.sh manifest); (4) CRITICAL - a timeline.md design that records which spec folder was worked on first and which came after, so the chronological lineage survives any renumbering (derive order from git history and graph-metadata created/updated timestamps). Ground every proposed grouping in the actual on-disk folders and their metadata; this is research/proposal only - do not restructure anything."
description: "Auto-generated research resource map from convergence evidence."
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

## Summary

- **Total references**: 40
- **By category**: READMEs=0, Documents=14, Commands=0, Agents=0, Skills=5, Specs=15, Scripts=1, Tests=1, Config=4, Meta=0
- **Missing on disk**: 25
- **Scope**: research convergence output for 009-phase-consolidation-research
- **Generated**: 2026-08-13T07:46:35.869Z

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` · `MISSING` · `PLANNED`.

## 2. Documents

> Long-form markdown artifacts that are not READMEs: guides, specs, references, install docs, catalogs, playbooks.

| Path | Action | Status | Note |
|------|--------|--------|------|
| 44 child graph-metadata.json (created_at/last_save_at/status) | Cited | MISSING | Citations=1; Iterations=1 |
| deep-research-state.jsonl | Cited | MISSING | Citations=3; Iterations=3 |
| deltas/iter-003.jsonl | Cited | MISSING | Citations=1; Iterations=1 |
| git log --all --follow --diff-filter=A (22 spec.md paths) | Cited | MISSING | Citations=1; Iterations=1 |
| grep .opencode/specs across runtime lib+tests (18 matches) | Cited | MISSING | Citations=1; Iterations=1 |
| iteration-002.md | Cited | MISSING | Citations=1; Iterations=1 |
| iteration-003.md | Cited | MISSING | Citations=1; Iterations=1 |
| iteration-004.md | Cited | MISSING | Citations=1; Iterations=1 |
| iteration-005.md | Cited | MISSING | Citations=1; Iterations=1 |
| lineages/ds-a/timeline.md | Cited | MISSING | Citations=1; Iterations=1 |
| ls -ld .opencode/specs | Cited | MISSING | Citations=1; Iterations=1 |
| spec.md | Cited | MISSING | Citations=1; Iterations=1 |
| validate.sh:157-164,216-219,239-246 | Cited | MISSING | Citations=1; Iterations=1 |
| validate.sh:216-219,248-254 | Cited | MISSING | Citations=1; Iterations=1 |

---

## 5. Skills

> `.opencode/skills/**` including `SKILL.md`, `references/`, `assets/`, `feature-catalog/`, `manual-testing-playbook/`, `scripts/`, `shared/`, `mcp-server/`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .opencode/skills/system-spec-kit/mcp-server/lib/search/folder-discovery.ts | Cited | OK | Citations=1; Iterations=1 |
| .opencode/skills/system-spec-kit/scripts/spec/is-phase-parent.ts | Cited | OK | Citations=2; Iterations=2 |
| .opencode/skills/system-spec-kit/scripts/spec/is-phase-parent.ts:25,128-129 | Cited | MISSING | Citations=1; Iterations=1 |
| .opencode/skills/system-spec-kit/scripts/spec/validate.sh | Cited | OK | Citations=3; Iterations=3 |
| .opencode/skills/system-spec-kit/scripts/tests/recursive-child-manifest.vitest.ts | Cited | OK | Citations=2; Iterations=2 |

---

## 6. Specs

> `.opencode/specs/**` and `specs/**`. Takes precedence over `Config` for spec-folder JSON metadata.

| Path | Action | Status | Note |
|------|--------|--------|------|
| specs/descriptions.json | Cited | OK | Citations=1; Iterations=1 |
| specs/system-deep-loop/036-deep-loop-innovation/ | Cited | OK | Citations=1; Iterations=1 |
| specs/system-deep-loop/036-deep-loop-innovation/{004,006-014}/graph-metadata.json | Cited | MISSING | Citations=1; Iterations=1 |
| specs/system-deep-loop/036-deep-loop-innovation/{035,047-056}-*/ | Cited | MISSING | Citations=1; Iterations=1 |
| specs/system-deep-loop/036-deep-loop-innovation/dispositions.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-deep-loop/036-deep-loop-innovation/050-trustworthy-state-records/graph-metadata.json | Cited | OK | Citations=1; Iterations=1 |
| specs/system-deep-loop/036-deep-loop-innovation/009-phase-consolidation-research/research/lineages/ds-b/iteration-001.md | Cited | MISSING | Citations=1; Iterations=1 |
| specs/system-deep-loop/036-deep-loop-innovation/009-phase-consolidation-research/research/lineages/ds-b/iterations/iteration-002.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-deep-loop/036-deep-loop-innovation/009-phase-consolidation-research/research/lineages/ds-b/iterations/iteration-003.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-deep-loop/036-deep-loop-innovation/009-phase-consolidation-research/research/lineages/ds-b/iterations/iteration-004.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-deep-loop/036-deep-loop-innovation/009-phase-consolidation-research/research/lineages/ds-b/iterations/iteration-005.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-deep-loop/036-deep-loop-innovation/graph-metadata.json | Cited | OK | Citations=4; Iterations=4 |
| specs/system-deep-loop/036-deep-loop-innovation/manifest/phase-tree.json | Cited | OK | Citations=2; Iterations=2 |
| specs/system-deep-loop/036-deep-loop-innovation/spec.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-deep-loop/036-deep-loop-innovation/spec.md:215-258,281 | Cited | MISSING | Citations=1; Iterations=1 |

---

## 7. Scripts

> Executable or build/test scripts: `.sh`, `.js`, `.ts`, `.mjs`, `.cjs`, `.py`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| validate.sh | Cited | MISSING | Citations=1; Iterations=1 |

---

## 8. Tests

> Test files, fixtures, and snapshots. Tests take precedence over `Scripts`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| recursive-child-manifest.vitest.ts | Cited | MISSING | Citations=1; Iterations=1 |

---

## 9. Config

> Machine-readable configuration: `.json`, `.jsonc`, `.yaml`, `.yml`, `.toml`, `.env.example`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| 053-runtime-code-review/graph-metadata.json | Cited | MISSING | Citations=1; Iterations=1 |
| deep-research-config.json | Cited | MISSING | Citations=1; Iterations=1 |
| manifest/phase-tree.json | Cited | MISSING | Citations=1; Iterations=1 |
| python json probe specs/descriptions.json | Cited | MISSING | Citations=1; Iterations=1 |

---

---

## Lineage Delta Sources

| Lineage | Delta |
|---------|-------|
| ds-a | lineages/ds-a/deltas/iter-001.jsonl |
| ds-a | lineages/ds-a/deltas/iter-002.jsonl |
| ds-a | lineages/ds-a/deltas/iter-003.jsonl |
| ds-a | lineages/ds-a/deltas/iter-004.jsonl |
| ds-a | lineages/ds-a/deltas/iter-005.jsonl |
| ds-b | lineages/ds-b/deltas/iter-001.jsonl |
| ds-b | lineages/ds-b/deltas/iter-002.jsonl |
| ds-b | lineages/ds-b/deltas/iter-003.jsonl |
| ds-b | lineages/ds-b/deltas/iter-004.jsonl |
| ds-b | lineages/ds-b/deltas/iter-005.jsonl |
