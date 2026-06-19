---
title: "Spec 030 Changelog Index"
description: "Index of the packet-local changelog for spec 030 (memory-search-intelligence-impl). The packet is flat, so the changelog units are the four touched subsystems, each with one changelog under a single root rollup."
trigger_phrases:
  - "030 changelog index"
  - "030 changelog history"
  - "memory search intelligence implementation changelogs"
importance_tier: "normal"
contextType: "implementation"
---

# Spec 030 Changelog Index

Spec 030 (memory-search-intelligence-impl) shipped the Wave-0 spearhead of packet 028's research roadmap: eleven additive, reversible, no-benchmark retrieval improvements landed as scoped commits, with two candidates deferred to Wave-1. The packet is flat with no phase children, so the changelog mirrors the four touched subsystems instead of a phase tree: one changelog per subsystem under a single root rollup. The candidate truth table lives in `../spec.md` section 14, the closeout narrative in `../implementation-summary.md` and the candidate decisions in `../decision-record.md`.

## Units

| Subsystem | Changelog | Shipped candidates | Deferred |
|-----------|-----------|--------------------|----------|
| Memory search and ranking | [changelog-memory-search-ranking.md](./changelog-memory-search-ranking.md) | 2, 3, 4, 5 | none |
| Memory store and hygiene | [changelog-memory-store-hygiene.md](./changelog-memory-store-hygiene.md) | 7, 8, 9, 10 | 6, 11 |
| Code Graph | [changelog-code-graph.md](./changelog-code-graph.md) | 13 | none |
| Deep Loop | [changelog-deep-loop.md](./changelog-deep-loop.md) | 1, 12 | none |
| Root rollup | [changelog-030-memory-search-intelligence-root.md](./changelog-030-memory-search-intelligence-root.md) | all 11 | 6, 11 |

## How to read these

The root rollup lists the four subsystem units and the deferred candidates and links to each subsystem changelog. Each subsystem changelog follows the canonical template: Summary, Added, Changed, Fixed, Verification, Files Changed, Commits, then Follow-Ups. The store and hygiene changelog also carries a Deferred to Wave-1 section because both deferred candidates belong to that subsystem. Candidate numbers match `../spec.md` section 14.

## Conventions

- File names: `changelog-<subsystem>.md`. The packet rollup uses the `changelog-030-memory-search-intelligence-root.md` name.
- One changelog per subsystem. Multi-commit subsystems collapse their candidates into one entry with a Commits table.
- Voice rules are non-negotiable: no em-dashes, no semicolons in narrative, no Oxford commas.
- The two deferred candidates are shown as deferred with evidence, never disguised as incomplete or omitted.
