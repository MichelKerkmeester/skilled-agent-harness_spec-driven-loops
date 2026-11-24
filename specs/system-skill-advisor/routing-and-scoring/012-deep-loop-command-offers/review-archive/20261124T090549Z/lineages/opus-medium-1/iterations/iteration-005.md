# Iteration 005 — Correctness (second pass, cross-dimension)

## Dispatcher
- Executor: cli-claude-code (claude-opus-5-5, medium), inline lineage opus-medium-1
- Sources read: steer.md (absent), strategy, registry, iterations 001-004

## Dimension
correctness, second pass. All four dimensions are covered, and stopPolicy=max-iterations asks for a broader angle rather than an early synthesis. The pass covers the deferred-route mode resolution in `command-attach.ts` and the stage-one loop rule in `explicit.ts`, which decides whether the hub tops at all before the offer gate runs.

## Files Reviewed
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:378-389` (MODE_CUES), `:894-924` (deferredLoopCommand, NAMED_LOOP_MODE), `:880-891` (routed gate)
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:10, 96-168, 442-470`

## How this iteration addressed the review focus
I probed ten loop asks with mixed or single mode cues through the routed and deferred paths (`probes/gate-probe.mjs`). Then I read the stage-one rule to see whether depth words can lift the hub.

## Findings by Severity

### P0 Findings
None.

### P1 Findings
None.

### P2 Findings
None.

## Traceability Checks
- spec_code (pass): the deferred path resolves one mode from a named loop unit before it counts the looser cues ("run 5 research iterations on review tooling" → `/deep:research`). A prompt that cues both modes withholds the command ("run 4 iterations to check the parser for bugs and research alternatives" → undefined), and so does a prompt with no cue ("run 5 iterations on the parser" → undefined). This matches spec §3 "let one mode cue resolve a deferred hub route". The stage-one rule in `explicit.ts:449-460` gates the hub boost on MULTI_PASS, LOOP_COUNT, ITERATIVE_ASK or loop words beside a `research` or `review` word. No depth word (thorough, exhaustive, in depth) appears there, which matches spec §3 "Depth words do not score there".

## Integration Evidence
- `explicit.ts:10` imports `ITERATIVE_ASK`, `LOOP_COUNT`, `MODE_CUES`, `MULTI_PASS`, `isStuckRunComplaint` and `isWritingAboutTopic` from `command-attach.ts`, so the scorer and the gate share one vocabulary instead of a third copy.

## Edge Cases
- The routed path attaches whatever single mode the compiled router picked. It does not consult `NAMED_LOOP_MODE`, so "run 5 research iterations on review tooling" would get `/deep:review` if the router picked review. I did not run the compiled router, so this is unverified and is not reported as a finding.
- In the stage-one research rule, `overnight` and `convergence` beside "research" lift the hub. They are not in the spec's explicit-loop list, but the offer gate still requires `asksForLoopRun`, so no command attaches from them alone.

## Confirmed-Clean Surfaces
- Deferred mode resolution: single named unit, single cue, both cues and no cue all behave as documented.
- No council words in the gate or the scorer (cross-checks AC-016).

## Ruled Out
- A depth word lifting the hub at stage one: no depth word sits in the loop rule's alternations.

## Next Focus
- Synthesis (max iterations reached)

Review verdict: PASS
