---
title: "027 XCE Research-Based Refinement — Merged Research Archive"
parts: [pt-01, pt-02, pt-03, pt-04]
total_iterations: 29
total_findings: "47 (pt-01) + cross-val (pt-02) + 56 (pt-03)"
merged_at: "2026-05-31"
status: "merged-archive; new iterations 030-039 continue below"
---

# 027 XCE Research — Merged Archive

This file is the canonical merged synthesis of all four prior research runs.
New iterations (030–039) are written by the GPT-5.5-pro deep-research run.

## Research Part 01 — XCE Adoption Matrix (9 iterations, deepseek-v4-pro)
See: [027-xce-research-pt-01/research.md](./027-xce-research-pt-01/research.md)
**Key outcomes**: 47 findings (F-001..047), verdicts ADOPT:4 ADAPT:9 DEFER:2 SKIP:6.
Proposed 5 phases for code-graph + skill-advisor (now moved to 028).
Steering pattern transfer (RQ6): ADAPT — strengthen to "MUST invoke FIRST" with per-skill action hints.
Non-adoption boundary (RQ9): 9 SKIP items including PRAT internals, SaaS hosting, unconditional steering.

## Research Part 02 — Cross-Validation (10 iterations, gpt-5.5/high/fast)
See: [027-xce-research-pt-02/research.md](./027-xce-research-pt-02/research.md)
**Key outcomes**: Cross-validated pt-01 findings; surfaced render.ts uncertainty guard gap (passes_threshold bypass).
Sub-packet amendments: Phase 004 needs REQ-007 (high-uncertainty guard), REQ-008 (fixture migration), REQ-009 (boundary fixtures). Revised LOC estimate: 80-120 (was 30).
6 open code-graph policy decisions (scoped to 028).

## Research Part 03 — Coco-Index + Memory Backend (10 iterations, gpt-5.5/high/fast)
See: [027-xce-research-pt-03/research.md](./027-xce-research-pt-03/research.md)
**Key outcomes**: 56 findings; unanimous bounded-ADAPT stance; proposed 5 new phases:
- 006-coco-intent-steering (L2, ~250-350 LOC) — pre-embedding query expansion
- 007-memory-semantic-triggers (L2/L3, ~350-520 LOC) — hybrid lexical+semantic trigger matcher
- 008-feedback-reducers (L3, ~400-650 LOC) — shared bounded reducer
- 009-retrieval-rerank-clients (L2, ~250-420 LOC) — extract RerankClient
- 010-coco-memory-context-extras (L3, ~500-800 LOC) — few-shot bank + LLM curator

## Research Part 04 — Per-Phase Audit (no iterations, final audit)
See: [027-xce-research-pt-04/research.md](./027-xce-research-pt-04/research.md)
**Key outcomes**: Per-phase verdicts: 001 REVISE_SCOPE, 002 KEEP_AS_IS, 003 REVISE_SCOPE, 004 REVISE_SCOPE, 005 MERGE, 006 REVISE_SCOPE, 007 DEFER, 008 REVISE_SCOPE, 009 REVISE_SCOPE, 010 DEFER, 011 DEFER.
5 open questions remain (see research.md §6).

## New Iterations 030–039 (GPT-5.5-pro, targeting 027 memory phases 002-008)

The 10 new iterations focus exclusively on the memory-system phases that remain in 027 after the 028 split.
Iteration files: iterations/iteration-030.md through iterations/iteration-039.md
