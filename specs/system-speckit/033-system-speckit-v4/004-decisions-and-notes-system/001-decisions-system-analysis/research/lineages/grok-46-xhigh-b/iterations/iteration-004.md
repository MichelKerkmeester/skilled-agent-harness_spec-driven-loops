---
title: "Iteration 4: Consolidate four stores; ADR roll-up; cheap prior-decision query"
trigger_phrases: []
---
# Iteration 4: Consolidate four stores; ADR roll-up; cheap prior-decision query

## Focus
Angle (c): map the four decision/steering stores to a minimal set; how per-spec ADRs roll up globally; how to query prior decisions cheaply.

## Actions Taken
- Counted `## ADR-` headings under `specs/**/decision-record.md` (read-only rg).
- Read `content-router.ts` decision category + L2 vs L3 targets.
- Cross-checked resume-ladder (iter 1), learned-triggers (iter 1), render.ts (iter 1), AGENTS.md constitutional links.

## Findings

### F-B4.1 Four stores, three jobs — do not merge them into one file
[SOURCE: iterations/iteration-001.md F-B1.7]
[SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/routing/content-router.ts:23-32,1086-1094]
[SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/resume/resume-ladder.ts:957-1027]
[SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/search/learned-feedback.ts:92-96]

This run's inventory (jobs, not files):

| Job | Current store | Keep? |
| --- | --- | --- |
| Every-turn steering (how to work) | AGENTS.md/CLAUDE.md + `render.ts` 3 capsules + Cursor alwaysApply rules | Keep. Already active. |
| Per-packet decisions (what we decided here) | `decision-record.md` ADRs (L3+) or `implementation-summary.md::decisions` (L2); content-router `insert-new-adr` | Keep. This is the system of record. Versioned spec-doc contract. |
| Packet resume (where we left off) | `_memory.continuity` in **implementation-summary.md only** (resume-ladder) | Keep. Do not treat duplicated `_memory` blocks in other templates as a decisions store (Workstream A cross-context). |
| Search-time "always-surface" rules | `constitutional/*.md` + DB tier + `includeConstitutional` | **Deprecate as a store.** Duplicate of root docs + unused always-on bus. |
| Learned search boosts | `learned_triggers` 30-day TTL | **Retire or ignore.** Dispatch asserts 0 live rows; code exists but is a relevance feature, not a decisions log. |
| Native Claude MEMORY.md | banned by constitutional rule + owner 2026-05-31 | Stay banned. |

Dispatch's "4 stores" maps cleanly to: constitutional DB, spec ADRs+continuity, learned_triggers, hardcoded/root-doc copies. Minimal set after redesign: **(1) always-on digest + root-docs, (2) per-spec ADR/continuity, (3) optional MCP index of spec docs for deep query.** Learned-triggers and constitutional tier go away.

### F-B4.2 ADR corpus is large; a global roll-up must be a digest, not a dump
This run counted **536** `decision-record.md` files under `specs/` and **1462** `## ADR-` headings (3023 `ADR-NNN` mentions). Dispatch asserted 616 ADRs — different census (possibly unique IDs or an older tree). Do not treat 616 as this-run confirmed unique-ID count.

Dumping 1462 ADRs into DECISIONS.md would explode the always-on budget (iter 2: Claude <200 lines, Cursor always-apply <<500). Roll-up rules that stay machine-contract-safe:

- Per-spec ADR remains canonical (content-router, validator anchors). **No new required spec-doc.**
- Global digest lists only: (a) repo-wide standing decisions (the unique constitutional content not already in AGENTS.md), (b) a short "recent promotions" window (e.g. last N ADRs tagged `global` / `standing`), (c) pointers not bodies (`specs/.../decision-record.md` + ADR id).
- Promotion is explicit (frontmatter flag or `/memory:learn` retargeted to append a digest entry) — not "every ADR rolls up."
- Cheap query for the rest: existing `memory_search` over spec docs (already indexes `decision-record.md`; retrieval-rescue tests assert ADR-shaped queries rank decision-record hits). That is **on-demand**, not every-turn. `includeConstitutional` is not required for this.

### F-B4.3 Cheap prior-decision query is already mostly built
[SOURCE: .opencode/skills/system-spec-kit/mcp-server/tests/retrieval-rescue.vitest.ts:176-190]
[SOURCE: AGENTS.md:346]

`memory_search` indexes spec docs including `decision-record.md`. The missing piece is not another DB tier; it is (1) an every-turn digest so the model knows to search, (2) maybe a thin command `/decisions` that wraps `memory_search({ query, includeConstitutional: false })` scoped to `decision-record.md` paths. Constitutional injection currently **pollutes** ADR queries with 20 static rules; turning `includeConstitutional` default to false is a query-quality win even before full deprecation.

## Questions Answered
Q-B3 answered: minimal set = always-on digest + per-spec ADR/continuity + on-demand spec-doc search. Constitutional tier and learned-triggers are not decisions stores worth keeping.

## Dead Ends
- A fourth SQLite "decisions" table — duplicates spec-doc ADRs and needs new validators.
- Auto-rolling every ADR into DECISIONS.md — budget failure.

## Ruled Out
- Merging ADRs into constitutional markdown.
- Using learned_triggers as a decisions log (TTL, selection-gated, 0.7x search boost, not a log).

## Assessment
- newInfoRatio: 0.62
- noveltyJustification: First quantitative ADR census this lineage (536 files / 1462 headings vs dispatch 616) and the content-router L2-vs-L3 split, which forbids a new required packet doc as the global store.
- confidence: high on architecture; medium on 616-vs-1462 reconciliation (UNKNOWN unique-ID count).

## Recommended Next Focus
Angle (d) part 1: deprecation sequence and blast radius for DB tier, /memory:learn, session-prime, includeConstitutional, learned-triggers.
