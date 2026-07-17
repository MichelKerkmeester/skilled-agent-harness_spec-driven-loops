---
title: "Research: memory_context Structural Channel Routing Investigation"
description: "5-iteration deep research on fusing code_graph_query as a structural retrieval channel inside memory_context. Answered three sub-questions: intent reliability, merged response shape, SearchDecisionEnvelope coverage. Left a Planning Packet ready for an implementation phase."
trigger_phrases:
  - "memory_context structural channel routing"
  - "code_graph_query channel fusion research"
  - "structural semantic retrieval fusion"
  - "027 memory context research"
  - "split-payload response shape"
importance_tier: "important"
contextType: "research"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-29

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/027-memory-context-structural-channel-research` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings`

### Summary

The system had two parallel retrieval surfaces with no routing layer between them: `memory_context` routed only to `memory_search` flavors while `code_graph_query` answered structural questions as a standalone tool. The advisor at `context-server.ts:335-341` already detected structural intent and nudged users toward `code_graph_query`, making channel fusion a plausible next step. Before implementation, three sub-questions needed research: whether intent signals were reliable enough to route automatically (RQ1), what the right merged response shape would be (RQ2), whether the existing `SearchDecisionEnvelope` already covered the routing trace (RQ3).

Five focused deep-research iterations answered all three questions with file:line citations. The split-payload shape was recommended for RQ2 because it preserves the existing document `results` contract while keeping graph-native nodes, edges, fallback data in structured form. The `query-intent-classifier.ts` was identified as the strongest routing signal. `SearchDecisionEnvelope` was found to need only explicit `code_graph_query` channel naming rather than new fields. The loop converged at iteration 5 with a `newInfoRatio` sequence of 0.82, 0.63, 0.44, 0.28, 0.16. The final research report includes a Planning Packet that seeds a follow-on implementation phase.

### Added

None. Research-only phase.

### Changed

None. Research-only phase.

### Fixed

None. Research-only phase.

### Verification

| Check | Result |
|-------|--------|
| Artifact count | PASS: 5 iteration files present under `research/iterations/`, 5 delta files present under `research/deltas/`, final report at `research/research-report.md`, state log at `research/deep-research-state.jsonl`. This summary is also present |
| Convergence rule | PASS: `newInfoRatio` sequence was 0.82, 0.63, 0.44, 0.28, 0.16. No two consecutive ratios fell below 0.10 |
| Runtime-code boundary | PASS: no runtime code files were modified |
| Strict spec validator | PASS: `validate.sh --strict` exited 0 |
| RQ1 answered | PASS: intent-signal inventory and false-positive/false-negative analysis recorded in `iteration-001.md` and `iteration-002.md` |
| RQ2 answered | PASS: split-payload recommended with consumer-impact analysis in `iteration-003.md` |
| RQ3 answered | PASS: `SearchDecisionEnvelope` field mapping recorded in `iteration-004.md` |
| Planning Packet present | PASS: `research/research-report.md` Section 9 contains the Planning Packet for the implementation phase |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `research/iterations/iteration-001.md` | Created | Intent-rule inventory findings with `context-server.ts` and `tool-schemas.ts` citations |
| `research/iterations/iteration-002.md` | Created | Corpus false-positive and false-negative findings from v1.0.3 replay and Phase E gold battery |
| `research/iterations/iteration-003.md` | Created | Merged response shape evaluation covering flatten, discriminated union, split-payload options |
| `research/iterations/iteration-004.md` | Created | `SearchDecisionEnvelope` coverage mapping for structural fusion paths |
| `research/iterations/iteration-005.md` | Created | Synthesis findings, convergence confirmation, Planning Packet inputs |
| `research/deltas/iteration-001.jsonl` | Created | Delta metrics for iteration 1 |
| `research/deltas/iteration-002.jsonl` | Created | Delta metrics for iteration 2 |
| `research/deltas/iteration-003.jsonl` | Created | Delta metrics for iteration 3 |
| `research/deltas/iteration-004.jsonl` | Created | Delta metrics for iteration 4 |
| `research/deltas/iteration-005.jsonl` | Created | Delta metrics for iteration 5 |
| `research/research-report.md` | Created | 9-section synthesis report including Planning Packet for the follow-on implementation phase |
| `research/deep-research-state.jsonl` | Modified | Five iteration events and `synthesis_complete` event appended |
| `spec.md` | Modified | Continuity, completion status, acceptance scenarios, Phase J reference path updated |
| `plan.md` | Created | Level 2 execution plan for the research packet |
| `tasks.md` | Created | Completed task ledger for the research packet |
| `checklist.md` | Created | Verification checklist with evidence rows |
| `implementation-summary.md` | Created | Completion status, key decisions, verification, known limitations |

### Follow-Ups

- Implement the split-payload response shape in `memory_context` using the Planning Packet in `research/research-report.md` Section 9 as the implementation brief.
- Promote the structural-intent detection rule from `context-server.ts:335-341` into a shared classifier consumed by the advisor plus `memory_context`.
- Confirm the exact structural payload key (`data.structural` or `data.structuralResults`) before wiring the handler.
- Establish a confidence threshold for actionable operation planning before the routing layer dispatches `code_graph_query`.
- Validate the split-payload shape against external MCP clients not visible in this repository.
