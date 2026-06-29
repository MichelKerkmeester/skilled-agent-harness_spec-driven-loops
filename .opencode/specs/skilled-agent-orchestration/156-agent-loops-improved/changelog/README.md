---
title: "Spec 156 Changelog Index"
description: "Program-level index of all packet-local changelogs for spec 156 (agent-loops-improved), organized under nine phases that ran from reference research through deep-loop implementation to a loop-systems remediation track. Each phase links to its top rollup."
trigger_phrases:
  - "156 changelog index"
  - "156 changelog history"
  - "agent loops improved changelogs"
importance_tier: "normal"
contextType: "implementation"
---

# Spec 156 Changelog Index

Spec 156 (agent-loops-improved) mined two reference loop codebases for improvement seams and then shipped them as a phased deep-loop program. Phase 001 produced the ranked backlog. Phases 002 through 009 implemented it: a session-goal OpenCode plugin, deep-loop-runtime resilience and convergence hardening, deep-loop-workflows guardrails, a speckit autopilot lifecycle, an advisor routing projection, UX and observability surfaces, hermetic test isolation and a record-replay harness, and a remediation track that audited and fixed the shipped state. The changelog mirrors the spec tree: one directory per phase, with phase changelogs named `changelog-<phase>-<leaf>-<short-name>.md` and one per-phase rollup named `changelog-<phase>-root.md`. The packet root rollup is [changelog-156-root.md](./changelog-156-root.md) in this directory. The chronological view of the same work lives in [`../timeline.md`](../timeline.md) and the before-and-after narrative in [`../before-vs-after.md`](../before-vs-after.md).

## Phases

| Phase | Leaf changelogs | Top rollup |
|-------|-----------------|------------|
| 001 reference research | 0 | [changelog-001-root.md](./001-reference-research/changelog-001-root.md) |
| 002 goal opencode plugin | 6 | [changelog-002-root.md](./002-goal-opencode-plugin/changelog-002-root.md) |
| 003 deep loop runtime | 18 | [changelog-003-root.md](./003-deep-loop-runtime/changelog-003-root.md) |
| 004 deep loop workflows | 12 | [changelog-004-root.md](./004-deep-loop-workflows/changelog-004-root.md) |
| 005 system spec kit | 1 | [changelog-005-root.md](./005-system-spec-kit/changelog-005-root.md) |
| 006 skill interconnection | 1 | [changelog-006-root.md](./006-skill-interconnection/changelog-006-root.md) |
| 007 ux observability automation | 6 | [changelog-007-root.md](./007-ux-observability-automation/changelog-007-root.md) |
| 008 testing | 2 | [changelog-008-root.md](./008-testing/changelog-008-root.md) |
| 009 loop systems remediation | 6 | [changelog-009-root.md](./009-loop-systems-remediation/changelog-009-root.md) |

## How to read these

Each phase's top rollup is its phase parent's Included Phases table, listing every child phase with its status and a one-line summary, plus a Before vs After section framing what the phase changed. Each leaf changelog follows the canonical template: Summary, Added, Changed, Fixed, Verification, Files Changed and Follow-Ups. The deep-loop-runtime phase carries the most leaves at eighteen and the deep-loop-workflows phase is next at twelve, because the program weighted the runtime and workflow layers heaviest. Phase 001 is research only, the reference-mining pass that produced the ranked improvement backlog the later phases drew from, so it has no leaf children and its rollup is the research record itself. Every phase shipped, so the leaf Summary, the Added, Changed and Fixed rows and the per-phase rollup all describe delivered work.

## Conventions

- File names use the pattern `changelog-<phase>-<leaf>-<short-name>.md`. Per-phase rollups use the `-root.md` suffix and the packet rollup is `changelog-156-root.md`. Numbers reflect the current nine-phase spec-tree position.
- One changelog per shipped phase. Multi-candidate phases collapse their candidates into one entry.
- Voice rules are non-negotiable: no em-dashes, no semicolons in narrative, no Oxford commas.
- The directory layout mirrors `028-memory-search-intelligence/changelog/` (one directory per phase, one rollup per phase).
