# Iteration 020 — NEW: 009/002 and 009/003 — Spec Without Implementation (Scaffold Halflings)

**Focus:** Children with spec/plan/tasks but no implementation-summary — the "halfling" state.
**Angle:** What does it mean when a child has planning docs but no completion evidence?

## Findings

Two 009 children are in a **"scaffold halfling"** state — planned but not implemented:

**002-fanout-timeout-override:** has `spec.md` (6.4KB), `plan.md` (4.1KB), `tasks.md` (2.4KB), `description.json`, `graph-metadata.json` — but NO `implementation-summary.md`. Phase-map correctly says "Not Started." This is the child meant to fix the CRITICAL 4h timeout cap (still live, iter 011). Its existence-as-scaffold proves the fix was scoped but not executed.

**003-runtime-hygiene-fixes:** has `spec.md` (8.7KB), `plan.md` (4.6KB), `tasks.md` (3KB) — but NO `implementation-summary.md`, NO `description.json`, NO `graph-metadata.json`. Even less complete than 002. This is the child meant to fix comment-hygiene (iter 001, still live) + salvage naming (iter 012, root cause found).

**Cross-reference to round-1 backlog:** round-1's "Immediate" priority items were: F-006 (timeout → 009/002, Not Started), F-002 (comment-hygiene → 009/003, Not Started), F-007 (native lock → 009/005, doesn't exist), F-012 (salvage naming → 009/003, Not Started). **Of round-1's 4 immediate items, only the merge fix (009/001) shipped. The other 3 are scaffolded-but-unimplemented.**

This is the single most actionable finding of round 2: the remediation roadmap exists and is correctly prioritized, but execution stalled after child 001. The operator's highest-leverage move is to implement 009/002 (critical timeout) and 009/003 (comment-hygiene + salvage naming) — both already have plans written.

## Evidence
[SOURCE: ls 009/002-fanout-timeout-override/ — no implementation-summary.md]
[SOURCE: ls 009/003-runtime-hygiene-fixes/ — no impl-summary/description/graph-metadata]
[SOURCE: 009/spec.md:116-117 — 002/003 marked "Not Started"]

## newInfoRatio: 0.9 (execution-stalled diagnosis; 3 of 4 round-1 immediate items unimplemented)
