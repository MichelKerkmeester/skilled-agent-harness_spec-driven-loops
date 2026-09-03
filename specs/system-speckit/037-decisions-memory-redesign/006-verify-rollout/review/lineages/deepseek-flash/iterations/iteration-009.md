---
title: "Iteration 9: Broaden — REQ evidence surfaces, packet metadata consistency"
trigger_phrases: []
---
# Iteration 9: Broaden — REQ evidence surfaces, packet metadata consistency

## Focus
Broaden beyond the census: 006 REQ-001/REQ-004 evidence surfaces (negative-control test mapping, spec golden snapshot / required-doc check), steering-parity substance (REQ-005 intent), advisor DECISIONS.md absence (005 REQ-004), packet metadata staleness (graph-metadata.json, description.json), no-stray-files state.

## Scorecard
- Dimensions covered: traceability, maintainability
- Files reviewed: 8
- New findings: P0=0 P1=0 P2=1
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.05

## Findings

### P2, Suggestion
- **F014**: Packet metadata is stale vs the executed deprecation: `graph-metadata.json` still reports `"status": "draft"` (line 42) with template-derived entities ("Clean Architecture", "Task Notation", "Phase 1: Setup"), `last_save_at` 2026-08-26T08:01:39 (line 197) — hours before the 22:15 execution writes — and `description.json` `lastUpdated` 2026-08-26T08:01:12 with `memorySequence: 0`. Neither was refreshed after the deprecation landed, so graph consumers see a pre-execution draft view of a phase whose siblings executed.
  - Dimension: maintainability

## Confirmed-Good Checks
- 006 REQ-004 (spec golden snapshots / no required per-packet doc): the 006 folder contains only the standard Level-1 doc set (spec/plan/tasks/implementation-summary + description/graph-metadata); no `checklist.md`, no `decision-record.md`, no `resource-map.md` added — consistent with "no required per-packet spec-doc" (goal-file-manifest.txt + review/ + scratch/ are review-infrastructure artifacts, not packet docs).
- 005 REQ-004 (no new surface referenced): zero `DECISIONS.md` references anywhere under `.opencode/skills/system-skill-advisor/` ✓.
- Steering parity substance (006 REQ-005 intent): AGENTS.md:41 inlines the comment-hygiene rule text and only appends a pointer (`AGENTS.md:41-43`) — the every-turn steering load lives in the root docs as designed by 002; intent satisfiable, wording stale (F007).
- 006 REQ-001/REQ-002 evidence surface: 65 test files exercise constitutional behavior (broad negative-control coverage, e.g. `spec-folder-prefilter.vitest.ts:351`, `full-spec-doc-indexing.vitest.ts:97-98,302-303`); however the spec's own open question — "which existing mcp-server tests double as the steering-parity and negative-control evidence" — is unanswered in the packet (no decision recorded) — folded into F010 remediation.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | REQ-004 shape consistent; REQ-001/002 evidence surface exists but unlinked | F007, F010 |

## Assessment
- New findings ratio: 0.05
- Dimensions addressed: traceability, maintainability
- Novelty justification: F014 metadata staleness; positive confirmations for REQ-004 shape and 005 REQ-004.

## Ruled Out
- "006 added stray required docs": ruled out — standard Level-1 doc set only.

## Dead Ends
- Answering 006's open question (which test is the negative control) from static evidence: multiple candidates exist; the packet never recorded the choice — defer to operator.

## Recommended Next Focus
Iteration 10 — Final sweep: adversarial replay of all P0/P1 claims; registry reconciliation (P1=4, P2=9); convergence telemetry; close-out.

Review verdict: PASS
