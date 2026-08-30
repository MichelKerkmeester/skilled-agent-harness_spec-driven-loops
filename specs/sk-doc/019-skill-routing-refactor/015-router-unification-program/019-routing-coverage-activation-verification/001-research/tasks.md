---
title: "Tasks: Routing Coverage — Deep Research"
description: "Task breakdown for the 25-iteration deep-research loop across four models and the fresh-Opus synthesis, Sonnet adversarial verification, and orchestrator reconciliation that produced the 002-011 authoring brief."
trigger_phrases:
  - "routing coverage research tasks"
  - "deep research loop task list"
importance_tier: "critical"
contextType: "implementation"
---
# Tasks: Routing Coverage — Deep Research

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Authenticate and smoke-test all four models (`gpt-5.6-sol`, `gpt-5.6-terra` via `cli-codex`; `minimax/MiniMax-M3`, `zai-coding-plan/glm-5.2` via `cli-opencode`); catch and correct the MiniMax Token-Plan-vs-Direct-API slug mismatch before launch.
- [x] T002 Fix the 25-iteration model/effort/focus schedule across the two dispatch queues, recorded per-iteration in `deep-research-state.jsonl`'s `model`/`effort`/`focus` fields.
- [x] T003 Initialize `research/deep-research-state.jsonl`, `research/iterations/`, `research/findings-registry.json`, and `research/progress.log`.

**Evidence**: All 4 models ran with `exit_code=0` on every iteration; the corrected MiniMax slug appears throughout `deep-research-state.jsonl` (`"model":"minimax/MiniMax-M3"`); the four state artifacts exist and are populated for all 25 iterations.

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Run the `cli-codex` queue: 10 `gpt-5.6-sol` high, 3 `gpt-5.6-sol` ultra, 5 `gpt-5.6-terra` xhigh (18 iterations total).
- [x] T005 Run the `cli-opencode` queue: 5 `minimax/MiniMax-M3`, 2 `zai-coding-plan/glm-5.2` (7 iterations total).
- [x] T006 Append each iteration's `key_findings` to `findings-registry.json`, its full output to `research/iterations/iteration-NNN.md`, and its LAUNCH/DONE pair to `progress.log`.
- [x] T007 Confirm no early-convergence stop and zero weak/0-finding iterations across all 25, per `progress.log`'s 25/25 DONE entries (minimum single-iteration count 3, at iterations 17 and 23).

**Evidence**: `progress.log` shows 25 DONE entries with `exit_code=0`, findings growing monotonically 5 → 143 (iteration 2 total=5 ... iteration 25 total=143), `opencode queue drained` at iteration 14 (20:06:46Z), `codex queue drained` at iteration 25 (20:45:56Z), and `=== harness COMPLETE ===`. `deep-research-state.jsonl` confirms the exact per-iteration model/effort assignment: SOL-high ×10 (iterations 1,3,5,9,13,16,19,21,24,25), SOL-ultra ×3 (15,18,22), TERRA-xhigh ×5 (7,11,17,20,23), MiniMax ×5 (4,6,8,10,12), GLM-max ×2 (2,14).

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Fresh-Opus synthesis: consolidate 143 raw findings into ranked, deduplicated findings across 7 workstream tables plus an unnamed-gaps ranking, a P0→P4 enable-by-default safety dependency graph, a confirmed 002-011 child-spec breakdown, and an ordered, reversible build sequence (`synthesis-v1.md`).
- [x] T009 Fresh Sonnet 5 adversarial verification with no prior context: re-open every file cited by the 8 must-verify spine claims plus 12 more top recommendations using exact `sed -n`/Read line ranges, not grep-only; cross-check all 143 raw findings programmatically against the synthesis's own tables; read `iteration-025.md` (the run's own completeness critic) in full (`verification-v1.md`).
- [x] T010 Orchestrator reconciliation: fold in the corrections (CF-BM-4 fix-site, the findings-count error, the 009 Phase Map mischaracterization, line-drift tolerance), add the 3 omitted requirements (F-15-3→004, F-16-4→002, F-25-8→004/010), confirm the 002-011 child-spec breakdown, and issue the authoring directives for every 015 child (`review-v1.md`).

**Evidence**: `synthesis-v1.md` §1 states 8 highest-impact conclusions and §2 tabulates `CF-ACT-*`/`CF-BM-*`/`CF-PB-*`/`CF-CAT-*`/`CF-ARC-*`/`CF-SC-*`/`CF-TPL-*` findings. `verification-v1.md` VERDICT states "SPEC-READY-WITH-CORRECTIONS... All 8 must-verify claims are CONFIRMED" and its §1 table shows all 8 claims individually CONFIRMED (claim 6 upgraded from the synthesis's own 1/7-plus-6-inferred to a full 7/7 CONFIRMED by directly `cat`-ing all 7 activation manifests). `review-v1.md` §4 confirms the 10-child `002`-`011` breakdown and §5 states the authoring directives every child must follow.

<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] 25/25 iterations completed, `exit_code=0` on all, zero weak/0-finding iterations.
- [x] 143 raw findings consolidated into a corrected 47-count (`review-v1.md` §2 corrects the synthesis's own "48" miscount to "~47 consolidated findings (44 CF-IDs + 3 standalone)").
- [x] All 8 must-verify spine claims CONFIRMED against live source, two upgraded from INFERRED to CONFIRMED.
- [x] Verdict: SPEC-READY-WITH-CORRECTIONS.
- [x] Zero recommendations edit any of the three frozen scorer files or change a routing decision — confirmed explicitly in `synthesis-v1.md` §4 ("No finding proposes editing the frozen scorer or changing a routing decision") and re-confirmed in `verification-v1.md` §5.
- [x] The confirmed 002-011 child-spec breakdown and authoring directives are recorded (`review-v1.md` §4-5).
- [x] Strict Level-2 packet validation on this phase folder.

**Evidence**: The reconciled verdict, the corrected findings count, and the confirmed child-spec breakdown together constitute the authoring brief this 015 packet's children (`002`-`011`, including the sibling `006-feature-catalogs` and `007-durable-archiving-and-serving-snapshot` packets) are built from.

<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification checklist**: See `checklist.md`
- **Completion record**: See `implementation-summary.md`
- **Synthesis**: `synthesis-v1.md`
- **Adversarial verification**: `verification-v1.md`
- **Orchestrator review / authoring brief**: `review-v1.md`
- **Raw research state**: `research/` (iterations, deltas, findings-registry, progress log)
<!-- /ANCHOR:cross-refs -->
