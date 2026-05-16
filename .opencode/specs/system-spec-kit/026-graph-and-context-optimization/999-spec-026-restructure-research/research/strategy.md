# Research Strategy — 026 Restructure for Historic Recall

> Charter for the 40-iter cli-devin SWE-1.6 deep-research run dispatched from packet 999. Read by every iter so each worker has the shared context floor.

---

## 1. Research Charter

### Goal

Produce a verified restructure proposal that consolidates the 22 children currently under `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/` into a smaller set of clearly-named child phases, optimized for historic recall.

### Non-goals

- **Do not execute the restructure.** The output of this run is advisory. A follow-on packet executes merge / delete / rename.
- **Do not edit any 026 child packet contents.** This run is read-only on the rest of the codebase.
- **Do not restructure other 0NN parents** (027, 028, etc.) — scope is 026 only.
- **Do not delete this 999 packet.** The follow-on restructure handles its own cleanup.

### Stop conditions

- 40 iter complete (no early convergence — `convergenceThreshold: 0.0`)
- Synthesis pass produces `research.md` citing every iter
- Main agent authors `resource-map.md` with target-state architecture

---

## 2. Known Context (loaded at strategy creation)

### Current state — 22 direct children of 026

```
000-release-cleanup                         (phase parent, in_progress)
001-research-and-baseline
002-resource-map-deep-loop-fix
003-continuity-memory-runtime
004-runtime-executor-hardening
005-memory-indexer-invariants
006-graph-impact-and-affordance-uplift
007-code-graph                              (phase parent)
008-skill-advisor
009-hook-parity                             (phase parent)
010-template-levels                         (phase parent)
011-cocoindex-daemon-resilience
012-causal-graph-channel-routing
013-doctor-update-orchestrator              (phase parent)
014-local-embeddings-migration                         (phase parent — hosts 056-059 arc)
015-tanstack-security-audit
```

Plus phase-parent metadata at `026/`: spec.md, resource-map.md, description.json, graph-metadata.json, scratch/, changelog/.

### Background — the shotgun arc

Across 2026-04 / 2026-05, ~60+ packets shipped against 026. Many were narrow follow-on / audit / remediation packets that solved real problems but left 026 organizationally cluttered. Packets 056-059 (under 014) are the most recent arc — root README refresh, SKILL.md realignment, cli-devin deep-loop alignment.

### Constraints

- Read-only on every 026 child
- Output lives only under `999-spec-026-restructure-research/research/`
- Per-iter immediate commit on `main` (Phase B precedent from packet 058)

---

## 3. Iter Distribution (40 iter across 10 tracks)

| Track | Iter range | Focus |
|------:|-----------:|-------|
| 1 | 001-006 | Direct-child packet inventory (6 iter spread across 22 children) |
| 2 | 007-010 | Phase-parent 014-local-embeddings-migration deep-read (4 iter — most active arc) |
| 3 | 011-014 | Phase-parent 013-doctor-update-orchestrator deep-read (4 iter) |
| 4 | 015-018 | Phase-parent 007-code-graph deep-read (4 iter) |
| 5 | 019-022 | Phase-parent 009-hook-parity deep-read (4 iter) |
| 6 | 023-026 | Cross-packet duplicate detection (4 iter — which children overlap) |
| 7 | 027-030 | Stale-context detection (4 iter — completed-unreferenced packets) |
| 8 | 031-034 | Naming-quality audit (4 iter — do names match actual work) |
| 9 | 035-038 | Target-state proposal (4 iter — consolidated phase list) |
| 10 | 039-040 | Resource-map structure proposal (2 iter — parent doc layout) |

Each iter scopes a specific RQ documented in the iter-plan.jsonl file under `999/research/iter-plan.jsonl`.

---

## 4. Per-Iter Contract

Every iter prompt uses the deep-loop iter contract from packet 059:

- **Framework**: BUILD or STAR tagged on line 1
- **Pre-planning**: ordered steps + per-step acceptance criteria + stop conditions + verification approach
- **Scoped RQ**: one research question per iter (from iter-plan.jsonl)
- **Output contract**: write to `research/iterations/iteration-NNN.md` with required headings + JSONL delta row

Recipe pinned via `--agent-config`: `.opencode/skills/cli-devin/assets/agent-config-deep-research-iter.json` substituted with `<repo-root>` resolved.

---

## 5. Synthesis Plan

After all 40 iter commit, run one final cli-devin SWE-1.6 dispatch with the synthesis recipe (`agent-config-synthesis.json`). The synthesis worker reads:

- `research/iterations/iteration-001.md` through `iteration-040.md`
- `research/deep-research-state.jsonl` (40 rows)

And emits `research/research.md` consolidated by track, with per-finding iter citation.

---

## 6. Resource Map Plan

Main agent authors `resource-map.md` from `research.md`. Required sections:

1. **Current state** — table of all 22 current children with size, status, last-activity, classification
2. **Proposed state** — target phase list with each phase's name, description, constituent children, deletions, renames
3. **Migration plan** — order of operations for the follow-on restructure packet
4. **Recall optimization** — proof points: sample queries with target lookup paths
