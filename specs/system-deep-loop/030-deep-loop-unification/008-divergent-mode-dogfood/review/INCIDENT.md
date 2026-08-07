# INCIDENT: Mid-run destruction of the entire 008-divergent-mode-dogfood spec packet (review side)

**Severity: P0 — real data loss during a live dogfood run. See the sibling `research/INCIDENT.md` for the full incident writeup; this file covers what's recoverable specifically for the review loop, which lost its own artifacts in the same event but never got a chance to self-document before being cut off.**

## What happened

Between review iteration 7 completing and my (the orchestrating conversation's) next status check, the entire `008-divergent-mode-dogfood/` packet was deleted from disk by one of the two concurrently-dispatched `opencode run` CLI sessions (research iteration 9 or review iteration 7 — which one is unconfirmed; see `research/INCIDENT.md` evidence items 4-8 for the full analysis). Only `review/dispatch-receipts/dispatch-review-i7-g1.completion.json` survived — same survival pattern as the research side, for the same structural reason (receipt-writing happens in the orchestrator's post-dispatch code path, independent of whether target artifacts exist).

Unlike the research loop, the review loop's own dispatched agent did not get a chance to discover and self-document this before the conversation session was interrupted — there is no review-side incident report authored by that agent. This file is a reconstruction from the orchestrating conversation's own transcript (an earlier status update I gave the user mid-run, which quoted real findings directly from `review/deep-review-state.jsonl` before it was deleted), not from the review loop's own investigation.

## What is recoverable (from the orchestrating conversation's transcript, verbatim where quoted)

**Config** (read directly before the incident, from `review/deep-review-config.json`):
- `reviewTarget: ".opencode/skills/system-deep-loop"`, `reviewTargetType: "skill"`
- `reviewDimensions: ["correctness", "security", "traceability", "maintainability"]`
- `antiConvergence.convergenceMode: "divergent"`, `stopPolicy: "convergence"` (deliberately not `"max-iterations"`)
- `executor: cli-opencode / openai/gpt-5.6-sol-fast / high`, `timeoutSeconds: 900`

**Progress at time of loss**: 7 iterations dispatched, iterations 1-6 confirmed complete with findings, iteration 7 in flight (its dispatch-receipt is the one surviving artifact).

**Findings surfaced across iterations 1-5** (quoted from raw `deep-review-state.jsonl` records read directly in this conversation before deletion — full `evidenceRefs`, `claim`, `counterevidenceSought`, and `confidence` fields existed in the original records but are not fully reproduced here; only what was captured in the transcript is restated):

| ID | Severity | Iteration | Title |
|----|----------|-----------|-------|
| P1-001 | P1 | 1 | Divergent review has no guaranteed candidate after the clean stop that triggers it — `divergent-review-pivot.ts:203-288` |
| P1-002 | P1 | 2 | Research divergent mode has the same empty-frontier terminal fallthrough as review — `divergent-research-pivot.ts:198` |
| P1-003 | P1 | 2 | Improvement command persists benchmark evidence where the packet contract says it never lands — `deep-improvement/SKILL.md:279` |
| P1-006 | P1 | 4 | The divergent-mode checklist's completion summary contradicts its checked implementation evidence — `055-deep-loop-divergent-mode/checklist.md:135` |
| P1-007 | P1 | 4 | The deep-review skill and generated prompt require outputs the canonical LEAF agent forbids, with conflicting hard tool caps — `.opencode/agents/deep-review.md:330` |
| P2-001 | P2 | 4 | A Council playbook scenario falsely says no feature catalog exists |
| P1-008 | P1 | 5 | The shipped strategy template cannot survive the workflow's first reducer pass — `deep_review_strategy.md:39-78` |
| P1-009 | P1 | 5 | Optional graph events can permanently veto convergence — `prompt_pack_iteration.md.tmpl:78-92` |
| P2-002 | P2 | 5 | Protocol references omit the divergent convergence branch |
| P2-003 | P2 | 5 | Adding a review dimension is a broad undocumented schema migration |

**Process note also captured**: at iteration 4, the orchestrating review-loop agent discovered that iterations 1-4's `cli-opencode` dispatches never emitted `graphEvents`, leaving the coverage graph's `dimensionIds` empty and permanently `STOP_BLOCKED` regardless of real dimension progress. It self-corrected by directly backfilling `DIMENSION`/`COVERS` graph nodes via `upsert.cjs` for the three dimensions already genuinely closed by real findings (explicitly logged as an `orchestrator_note`, not done silently, and explicitly stated no fabricated coverage was added).

## What is NOT recoverable

- Iteration 6's specific findings (only its existence and "complete" status were confirmed in the transcript, not its finding details).
- Iteration 7's outcome entirely (dispatch reported clean exit; per the same Iron Law the research loop invoked, an unverified claim is not a completion — iteration 7 must be treated as UNVERIFIED, not complete).
- The exact raw JSONL records (full `evidenceRefs` arrays, `traceabilityChecks` detail, `filesReviewed` lists, `graphEvents` node/edge payloads, precise timestamps/durations) beyond what is reproduced in the table above.
- `findings-registry.json`, `deep-review-dashboard.md`, `deep-review-strategy.md`, all `deltas/*.jsonl`, all `iterations/*.md` narrative files, all `prompts/*.md` rendered prompts.
- Whether a divergent pivot fired during review at any point — no evidence either way survived; the research side's own log confirmed no pivot fired there across its 8 verified iterations.

## Recommendation

Same as `research/INCIDENT.md`: this is a live reproduction of the RM-8 destructive-scope-violation failure class already documented in `cli-opencode`'s own skill docs. Both `deep-research` and `deep-review`'s CLI executor branches dispatched directly against the live working tree with `--dangerously-skip-permissions` and no `git worktree` isolation — the documented four-layer mitigation for that known failure class was not applied to this run. Do not re-run either loop against the live tree until at least worktree isolation (or a committed clean-baseline recovery point) is in place.
