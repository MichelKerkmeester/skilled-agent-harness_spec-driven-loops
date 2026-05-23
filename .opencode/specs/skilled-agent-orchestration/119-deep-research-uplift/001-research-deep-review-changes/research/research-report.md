---
title: "Deep-Research Uplift from Deep-Review Learnings - Research Report"
description: "Iteration-9 synthesis for the 10-iteration deep-research investigation. Verdict: arc 118 deep-review upgrades mostly already shipped for deep-research; small uplift queue remains."
verdict: "PASS-WITH-UPLIFT"
total_iters: 10
recommendation_packets: 3
---

# Research Report

## Executive Summary

The evidence supports `PASS-WITH-UPLIFT`: arc 118's deep-loop runtime relocation, MCP removal, script cutover, test migration, and version/changelog work are already present for deep-research through the shared `deep-loop-runtime` release and the deep-research `v1.12.0.0` changelog. Iteration 3 confirmed all 27 `ALREADY-DONE` mappings from iteration 2, and iteration 6 found 0 factual errors in the deep-research `v1.12.0.0` changelog. After iteration 7 adjudication and iteration 8 re-verification, the actionable uplift queue is narrow: 2 P1 remediation findings (`DR-003`, `DR-006`) and 3 P2 follow-ups (`C-008`, `DR-005`, `DR-008`). Sources: `iterations/iteration-002.md`, `iterations/iteration-003.md`, misplaced iteration-6 outputs at `.opencode/skills/deep-research/review/iterations/iteration-006.md` plus `logs/iter-006-devin.log`, `iterations/iteration-007.md`, `iterations/iteration-008.md`, and `deltas/iter-002.jsonl`, `deltas/iter-003.jsonl`, `.opencode/skills/deep-research/review/deltas/iter-006.jsonl`, `deltas/iter-007.jsonl`, `deltas/iter-008.jsonl`.

## Methodology

| Iteration | Executor | Focus | Outcome | Primary Sources |
| --- | --- | --- | --- | --- |
| 1 | cli-devin SWE-1.6 | Catalogued arc 118 and related changes | 47 changes catalogued across runtime relocation, MCP removal, YAML, tests, docs, companions, and fix-pack hardening | `iterations/iteration-001.md`, `deltas/iter-001.jsonl` |
| 2 | cli-devin SWE-1.6 | Mapped each `C-NNN` item to deep-research applicability | 3 `APPLY`, 7 `ADAPT`, 10 `SKIP`, 27 `ALREADY-DONE` | `iterations/iteration-002.md`, `deltas/iter-002.jsonl` |
| 3 | cli-devin SWE-1.6 | Verified the 27 `ALREADY-DONE` mappings | 27 confirmed, 0 partial, 0 misclassified | `iterations/iteration-003.md`, `deltas/iter-003.jsonl` |
| 4 | cli-devin SWE-1.6 | Audited deep-research-specific semantics | Surfaced `DR-001` through `DR-005`: 3 P1 and 2 P2 | `iterations/iteration-004.md`, `deltas/iter-004.jsonl` |
| 5 | cli-devin SWE-1.6 | Adversarial pass on code/docs/YAML/test surfaces | Surfaced `DR-006` through `DR-008`: 1 P1 and 2 P2 | `iterations/iteration-005.md`, `deltas/iter-005.jsonl` |
| 6 | cli-devin SWE-1.6 | Changelog and version accuracy cross-check | 0 P0, 0 P1, 0 P2; six major changelog assertions verified | `logs/iter-006-devin.log`, `.opencode/skills/deep-research/review/iterations/iteration-006.md`, `.opencode/skills/deep-research/review/deltas/iter-006.jsonl` |
| 7 | cli-devin SWE-1.6 | Cross-finding adjudication | Kept `DR-003` and `DR-006`; dropped outdated/false-positive items; reclassified `C-008` and `DR-008` as P2 | `iterations/iteration-007.md`, `deltas/iter-007.jsonl` |
| 8 | cli-devin SWE-1.6 | Final adversarial pass on assets, references, and a recent run packet | Re-confirmed `DR-003` and `DR-006`; found 0 new remediation findings | `iterations/iteration-008.md`, `deltas/iter-008.jsonl` |
| 9 | cli-codex GPT-5.5 high | Synthesis quality pass | This report and `deltas/iter-009.jsonl` | `research-report.md`, `deltas/iter-009.jsonl` |
| 10 | cli-codex GPT-5.5 high | Reserved final validation/synthesis pass | Planned by the 10-iteration run configuration, not yet evidenced by an iteration artifact | `deep-research-state.jsonl` |

## Findings Summary (after adjudication)

| Class | Count | Findings | Basis |
| --- | ---: | --- | --- |
| P0 remediation | 0 | None | No prior iteration reported a retained P0; iteration 6 also reported 0 P0 in changelog verification |
| P1 remediation | 2 | `DR-003`, `DR-006` | Iteration 7 marked both `CONFIRMED`; iteration 8 re-confirmed both |
| P2 follow-up | 3 | `C-008`, `DR-005`, `DR-008` | `C-008` and `DR-008` were marked `MISCATEGORIZED` by iteration 7 and retained as P2 per the synthesis rule; `DR-005` was surfaced as P2 in iteration 4 and was not adjudicated |
| Dropped as outdated | 4 | `C-020`, `C-021`, `C-022`, `DR-007` | Iteration 7 marked each `OUTDATED` |
| Dropped as false-positive | 9 | `C-036`, `C-039`, `C-040`, `C-041`, `C-042`, `C-043`, `DR-001`, `DR-002`, `DR-004` | Iteration 7 marked each `FALSE-POSITIVE` |
| Confirmed already done | 27 | `C-001`, `C-003`, `C-004`, `C-005`, `C-006`, `C-007`, `C-009`, `C-010`, `C-011`, `C-012`, `C-013`, `C-014`, `C-015`, `C-016`, `C-017`, `C-018`, `C-019`, `C-023`, `C-026`, `C-027`, `C-030`, `C-032`, `C-033`, `C-037`, `C-044`, `C-045`, `C-046` | Iteration 3 confirmed all 27 `ALREADY-DONE` mappings from iteration 2 |
| Health observations, no packet | 3 | `f-iter008-001`, `f-iter008-002`, `f-iter008-003` | Iteration 8 labelled these as P2 records, but the narrative says assets, references, and recent run output were healthy and produced 0 new findings |

## Final Status Ledger

| Finding | Final Status | Severity | Rationale | Evidence |
| --- | --- | --- | --- | --- |
| `C-008` | Keep as verification follow-up | P2 | Iteration 2 raised workflow YAML script verification as P1; iteration 7 found the YAMLs invoke the scripts correctly and reclassified the item as verification-only P2 | `iterations/iteration-002.md`, `deltas/iter-002.jsonl`, `iterations/iteration-007.md`, `deltas/iter-007.jsonl` |
| `C-020` | Drop | - | Iteration 7 found `feature_catalog/` already exists with 16 files | `iterations/iteration-007.md`, `deltas/iter-007.jsonl` |
| `C-021` | Drop | - | Iteration 7 found the manual playbook already exists with 34 scenarios, including graph-aware scenarios | `iterations/iteration-007.md`, `deltas/iter-007.jsonl` |
| `C-022` | Drop | - | Iteration 7 found `references/` already exists with 6 files | `iterations/iteration-007.md`, `deltas/iter-007.jsonl` |
| `C-036` | Drop | - | Iteration 7 found deep-research state fields intentionally differ from deep-review/runtime state fields | `iterations/iteration-007.md`, `deltas/iter-007.jsonl` |
| `C-039` | Drop | - | Iteration 7 found canonical path resolution already uses shared `resolveArtifactRoot` utilities | `iterations/iteration-007.md`, `deltas/iter-007.jsonl` |
| `C-040` | Drop | - | Iteration 7 found `reduce-state.cjs` does not directly access the coverage-graph DB | `iterations/iteration-007.md`, `deltas/iter-007.jsonl` |
| `C-041` | Drop | - | Iteration 7 found `.deep-research.lock` is already acquired and released by the YAML workflow | `iterations/iteration-007.md`, `deltas/iter-007.jsonl` |
| `C-042` | Drop | - | Iteration 7 found deep-research has no direct DB access for prepared-statement reuse to affect | `iterations/iteration-007.md`, `deltas/iter-007.jsonl` |
| `C-043` | Drop | - | Iteration 7 found deep-research inherits shared executor config hardening from `deep-loop-runtime` | `iterations/iteration-007.md`, `deltas/iter-007.jsonl` |
| `DR-001` | Drop | - | Iteration 7 found single-dimension behavior is architectural and has no multi-dimension reducer pattern to reject | `iterations/iteration-004.md`, `deltas/iter-004.jsonl`, `iterations/iteration-007.md`, `deltas/iter-007.jsonl` |
| `DR-002` | Drop | - | Iteration 7 found progressive synthesis structure is workflow-owned, not reducer-owned | `iterations/iteration-004.md`, `deltas/iter-004.jsonl`, `iterations/iteration-007.md`, `deltas/iter-007.jsonl` |
| `DR-003` | Keep | P1 | Iteration 4 surfaced missing uncovered-question tracking; iteration 7 confirmed no `uncoveredQuestions` surface; iteration 8 re-confirmed the gap | `iterations/iteration-004.md`, `deltas/iter-004.jsonl`, `iterations/iteration-007.md`, `deltas/iter-007.jsonl`, `iterations/iteration-008.md`, `deltas/iter-008.jsonl` |
| `DR-004` | Drop | - | Iteration 7 found charter validation is workflow initialization responsibility, not reducer responsibility | `iterations/iteration-004.md`, `deltas/iter-004.jsonl`, `iterations/iteration-007.md`, `deltas/iter-007.jsonl` |
| `DR-005` | Keep unconfirmed | P2 | Iteration 4 surfaced missing cross-iteration deduplication for `ruledOut`; iteration 7 did not adjudicate it | `iterations/iteration-004.md`, `deltas/iter-004.jsonl`, `iterations/iteration-007.md`, `deltas/iter-007.jsonl` |
| `DR-006` | Keep | P1 | Iteration 5 surfaced lexical iteration sorting; iteration 7 confirmed `.sort()` causes `iteration-10.md` before `iteration-2.md`; iteration 8 re-confirmed the ordering bug | `iterations/iteration-005.md`, `deltas/iter-005.jsonl`, `iterations/iteration-007.md`, `deltas/iter-007.jsonl`, `iterations/iteration-008.md`, `deltas/iter-008.jsonl` |
| `DR-007` | Drop | - | Iteration 7 found confirm-mode resource-map asymmetry intentional and not a gap | `iterations/iteration-005.md`, `deltas/iter-005.jsonl`, `iterations/iteration-007.md`, `deltas/iter-007.jsonl` |
| `DR-008` | Keep as hygiene follow-up | P2 | Iteration 5 surfaced possible stale allowed-tools; iteration 7 found the listed tools are active and no removed deep-loop MCP tools are referenced, so this is hygiene verification rather than a bug | `iterations/iteration-005.md`, `deltas/iter-005.jsonl`, `iterations/iteration-007.md`, `deltas/iter-007.jsonl` |

## Uplift Themes

### Theme A - Chronological State Correctness

- Findings: `DR-006`
- Severity: 0 P0 / 1 P1 / 0 P2
- Effort: S
- Dependency: Blocks reliable chronological dashboards and any synthesis logic that reads iteration files in filesystem sort order.
- Risk if not fixed: Iteration 10+ files can be ordered before iteration 2, which can distort dashboards and chronological analysis.
- Recommended packet: `120-deep-research-iteration-ordering-fix`
- Evidence: `DR-006` was surfaced by iteration 5, confirmed by iteration 7, and re-confirmed by iteration 8.

### Theme B - Convergence Transparency

- Findings: `DR-003`
- Severity: 0 P0 / 1 P1 / 0 P2
- Effort: M
- Dependency: Does not block execution, but it blocks debuggable question-entropy convergence because the remaining unanswered questions are not surfaced.
- Risk if not fixed: Operators can see an 85% question-coverage convergence rule in the docs without seeing which questions remain uncovered.
- Recommended packet: `121-deep-research-uncovered-questions`
- Evidence: `DR-003` was surfaced by iteration 4, confirmed by iteration 7, and re-confirmed by iteration 8.

### Theme C - Low-Priority Hygiene and Dedup Follow-Up

- Findings: `C-008`, `DR-005`, `DR-008`
- Severity: 0 P0 / 0 P1 / 3 P2
- Effort: M
- Dependency: Should follow Themes A and B because none of these items is execution-blocking after adjudication.
- Risk if not fixed: `DR-005` can leave duplicate negative-knowledge rows in synthesis; `C-008` and `DR-008` leave low-grade verification debt even though iteration 7 found no current script invocation or allowed-tools defect.
- Recommended packet: `122-deep-research-hygiene-fix-pack`
- Evidence: `C-008` was surfaced by iteration 2 and reclassified by iteration 7; `DR-005` was surfaced by iteration 4 and remains unadjudicated; `DR-008` was surfaced by iteration 5 and reclassified by iteration 7.

## Cross-References

- Iteration narratives: `research/iterations/iteration-001.md`, `iteration-002.md`, `iteration-003.md`, `iteration-004.md`, `iteration-005.md`, `iteration-007.md`, `iteration-008.md`.
- Iteration 6 provenance: packet-local `iteration-006.md` and `deltas/iter-006.jsonl` are absent; the packet log records completion, and identical misplaced outputs exist at `.opencode/skills/deep-research/review/iterations/iteration-006.md`, `.claude/skills/deep-research/review/iterations/iteration-006.md`, `.opencode/skills/deep-research/review/deltas/iter-006.jsonl`, and `.claude/skills/deep-research/review/deltas/iter-006.jsonl`.
- Delta records: `research/deltas/iter-001.jsonl`, `iter-002.jsonl`, `iter-003.jsonl`, `iter-004.jsonl`, `iter-005.jsonl`, `iter-007.jsonl`, `iter-008.jsonl`, plus misplaced `.opencode/skills/deep-research/review/deltas/iter-006.jsonl`.
- Arc 118 source packet: `.opencode/specs/skilled-agent-orchestration/118-deep-loop-full-isolation-no-mcp/spec.md`, which states the arc is complete with 8/8 child phases shipped.
- Deep-research release evidence: `.opencode/skills/deep-research/changelog/v1.12.0.0.md`, which documents deep-research rebinding to `deep-loop-runtime`, direct `.cjs` graph-operation scripts, test discovery, and version frontmatter reconciliation.

## Recommendation

Ship three follow-on packets in this order. First, fix `DR-006` because it is a small correctness bug with direct chronological impact. Second, add `DR-003` uncovered-question tracking because it improves convergence explainability and operator recovery behavior. Third, bundle the P2 hygiene work: deduplicate `ruledOut` negative knowledge for `DR-005`, record a lightweight script-invocation verification for `C-008`, and close the allowed-tools hygiene check for `DR-008`.

Do not create packets for canonical companions, runtime relocation, MCP removal, DB lifecycle, path guards, executor config hardening, changelog accuracy, or assets/reference quality: iterations 3, 6, 7, and 8 either confirmed those shipped, confirmed they are inherited from `deep-loop-runtime`, or found them healthy.
