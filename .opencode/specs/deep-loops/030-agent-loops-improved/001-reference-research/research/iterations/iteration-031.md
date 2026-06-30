# Iteration 31: S4-06 Ideas Backlog Threshold and Rejection Cache

## Focus

[S4-06] How should the ideas backlog adopt kasper's observation-threshold plus rejected-cache so a deferred idea auto-promotes after N corroborations and a ruled-out idea is never re-promoted? This iteration maps the already-mined kasper mechanisms from S2-03 and S2-05 onto the specific deep-research `research/research-ideas.md` surface.

## Actions Taken

1. Checked prior S2-03, S2-05, and recent S4 outputs to avoid restating the generic observation-threshold and rejected-cache findings.
2. Mined kasper's manual and automatic improvement admission paths for the combined gate: rejected-pattern suppression first, minimum-observation matching second.
3. Read the deep-research agent, loop protocol, JSONL state contract, reducer, and auto workflow to locate the current ideas backlog contract and the missing machine-readable lifecycle.
4. Verified the packet has no current `research/research-ideas.md`, so this iteration maps backlog behavior to the reusable workflow surfaces rather than editing packet-local idea content.

## Findings

1. Thresholded deferred ideas should be a first-class backlog state, not an immediate promotion.

Reference mechanism: kasper validates `min_observations_for_update` as a bounded config field at `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/config.ts:46`, then filters visible improvement candidates with `w.count < ctx.config.min_observations_for_update` at `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/handlers.ts:419-429`. Exact OUR target file: `.opencode/skills/deep-loop-workflows/deep-research/references/protocol/loop_protocol.md:327-350`. Why it helps: the current ideas convention has only Deferred and Promoted sections; add a threshold rule so repeated corroborations move an idea from Deferred to Promoted only when `count >= minIdeaObservations`, while weaker single sightings remain parked. Port difficulty: easy. Tag: quick-win.

2. Rejected ideas need durable JSONL events before markdown suppression can be reliable.

Reference mechanism: kasper stores rejected patterns in durable state, dedupes exact repeats, caps the cache at `MAX_REJECTED_PATTERNS`, and marks the state dirty at `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/state.ts:502-510`; the cap is defined at `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/constants.ts:17`; disk merges preserve rejected patterns at `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/state.ts:994-997`. Exact OUR target file: `.opencode/skills/deep-loop-workflows/deep-research/references/state/state_jsonl.md:124-143`. Why it helps: `ruledOut` currently records eliminated approaches, but idea rejection needs typed `idea_rejected` records with an idea fingerprint, reason, evidence, and optional undo/reset semantics so a ruled-out idea cannot be reintroduced by a later markdown edit or resume summary. Port difficulty: med. Tag: quick-win.

3. Auto workflow should gate ideas at admission time, after reading state but before selecting next focus.

Reference mechanism: kasper's auto path filters score-card weaknesses against `ctx.rejectedPatterns` first, returns if nothing survives, then calls `findMatchingWeakness(..., config.min_observations_for_update)` and returns before side effects when no threshold-qualified aggregate match exists at `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/evaluate.ts:1659-1682`. Exact OUR target file: `.opencode/commands/deep/assets/deep_research_auto.yaml:422-444`. Why it helps: the workflow currently extracts iteration count, ratios, strategy next focus, and unanswered questions, but not an ideas index; add an admission step that reads the ideas backlog/idea events, drops rejected matches, and only promotes threshold-qualified ideas into `next_focus` or `least_explored`. Port difficulty: med. Tag: deep-rewrite.

4. The leaf agent should count corroborations or suppress matches instead of appending duplicate ideas.

Reference mechanism: kasper's `findMatchingWeakness()` skips aggregate weaknesses below the observation floor and uses mergeable matching before returning a candidate at `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/utils.ts:94-105`; the similarity helper handles exact, substring, word-overlap, and fuzzy word comparison at `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/utils.ts:13-31`. Exact OUR target file: `.opencode/agents/deep-research.md:145-147`. Why it helps: the current agent can append useful tangents to `research/research-ideas.md`, but it has no rule for "same idea seen again" or "same idea was rejected"; add instructions to emit an observation/corroboration event for a mergeable deferred idea and a suppressed observation for a mergeable rejected idea. Port difficulty: med. Tag: quick-win.

5. Promotion should be reducer-owned, with the leaf producing observations and the reducer building the ranked ideas index.

Reference mechanism: kasper's visible queue is populated only after the filtered top candidates survive threshold/rejection checks, then `weaknessToPending()` is called for each surviving candidate at `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/handlers.ts:419-475`. Exact OUR target file: `.opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs:220-227`. Why it helps: the reducer already parses iteration sections and builds deduped ruled-out directions from iteration files at `.opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs:625-688`; add a reducer-owned `buildIdeasBacklogRollup()` so leaf iterations only record observations, while the reducer ranks deferred ideas by corroboration count, suppresses rejected fingerprints, and emits promotion candidates deterministically. Port difficulty: hard. Tag: deep-rewrite.

## Questions Answered

- S4-06 is answered for target mapping: adapt kasper's threshold/rejection pattern as a three-part lifecycle for ideas: `idea_observed` increments corroboration, `idea_promoted` is reducer/workflow-owned after the threshold, and `idea_rejected` becomes a durable suppression key checked before future promotion.
- The current deep-research ideas surface is markdown-only in protocol and agent instructions; the missing layer is structured state plus reducer/workflow admission.

## Questions Remaining

- The exact matching primitive should be chosen during implementation: a cheap normalized fingerprint may be enough for idea titles, while kasper-style fuzzy text similarity is safer for paraphrased research tangents.
- The undo/reset UX for rejected ideas still needs a command-level decision. Kasper supports explicit remove/reset semantics; deep-research currently has no operator action for unrejecting an idea.

## Next Focus

S4-08 or nearest still-open UX/automation item: map how promoted/rejected ideas should appear in the dashboard and strategy so operators can see "deferred, corroborated, promoted, rejected" without reading raw JSONL.
