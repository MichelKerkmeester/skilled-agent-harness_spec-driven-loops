# Iteration 5: The cold first prompt — measured load versus waiting bounds

## Focus

Bound the cold first prompt on the built state. Iteration 4 established that live organic rows are mostly cache hits, and iteration 3 established that the fail-open path records no elapsed time, so the cold path is exactly the path neither instrument can price. This pass reads the phase 008 measurement, the cascade probe default, the CLI's cold wait and the hook budget and composes them into one chain.

## Actions Taken

1. Read the phase 008 committed measurement for the cold embedding and cold CLI calls.
2. Read the cascade probe default, the CLI cold-start wait, the local-scorer deadline and the Claude hook timeout in the current code.
3. Composed the worst-case cold chain per bound and compared it with the measured cold work.
4. Re-read the `unavailable` population in the health records to see what the instrument records for a cold failure.

## Findings

1. **The measured cold work is about 690 ms: 271-277 ms for a cold embedding call plus 413 ms for the advisor CLI with the model cold.** Against the 2,500 ms Claude hook budget that is 27.6 percent, so a cold first prompt does not by itself exhaust the budget. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/008-embedder-setup-and-cost/spec.md:132]

2. **The cascade probe's default 2,500 ms can consume the whole hook child budget before any scoring work starts.** `SPECKIT_CASCADE_PROBE_TIMEOUT_MS` defaults to 2,500 ms inside `auto-select.ts`, while the Claude shim kills its child at 2,500 ms. A probe that runs to its default therefore leaves zero time for the CLI, and the failure mode is a fail-open brief, not a slow brief. [SOURCE: .skilled/skills/system-spec-kit/shared/embeddings/auto-select.ts:116-119] [SOURCE: .skilled/hooks/skill-advisor/claude/user-prompt-submit.ts:160]

3. **Both cold waits on the server side are twice the caller's budget.** The CLI waits up to 5,000 ms for a cold daemon (`COLD_START_WAIT_MS`), and the local scorer has a 5,000 ms deadline (`LOCAL_SCORER_TIMEOUT_MS`); the hook that called them gives up at 2,500 ms. A path that honours its own 5 s wait can only ever be observed from the caller as a timeout. [SOURCE: .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:33-36] [SOURCE: .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:43-45]

4. **The production record prices the cold failure at zero.** The 664 `unavailable` rows have p50 0 ms and p95 2 ms, so a cold first prompt that fails open contributes the cheapest possible row to every aggregate; the population that should carry the cold cost carries none of it. [SOURCE: $TMPDIR/speckit-skill-advisor-metrics/*.jsonl]

5. **What would confirm the bound: one sandbox cold start with the model unloaded.** Unload the embed model, wait past its five-minute keep-alive, run one prompt through the real hook and record wall time, the cascade probe's own duration and the fail-open reason. Absent that, 690 ms is measured work and 2,500 ms is a waiting bound, not a first-prompt cost. [INFERENCE: based on findings 1-4]

## Ruled Out

- Reading a cold first-prompt cost from the health records: the fail-open branch writes 0 ms, so the record cannot carry it.
- Treating 2,500 ms as the cold cost: it is the cascade probe's ceiling, and the measured cold work is 690 ms.

## Dead Ends

- The phase 008 committed cost script needs the model unloaded to reproduce the cold numbers, and unloading is a process action this read-only lane may not take.

## Edge Cases

- Ambiguous input: none.
- Contradictory evidence: the measured cold work (690 ms) and the 2,500 ms probe default describe different things and are not in conflict; the second is a bound on the first.
- Missing dependencies: no cold-start run was possible; recorded as an inference with its confirming test.
- Partial success: all four actions produced evidence; the cold number stays an inference. Status `complete`.

## Sources Consulted

- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/008-embedder-setup-and-cost/spec.md:132, 159-160`
- `.skilled/skills/system-spec-kit/shared/embeddings/auto-select.ts:116-119`
- `.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:33-45`
- `.skilled/hooks/skill-advisor/claude/user-prompt-submit.ts:160`
- `$TMPDIR/speckit-skill-advisor-metrics/*.jsonl`

## Assessment

- New information ratio: 0.70
- Questions addressed: KQ5's cold-path half (which path the instrument misses)
- Questions answered: none new; this prices a path the answered question named

## Reflection

- What worked and why: composing the bounds from four files produced a sharper claim than any one file — the risk is a probe ceiling, not the model load, and that reorders what a fix should target.
- What did not work and why: no committed artifact records a cold hook wall time, so the composition remains an inference.
- What I would do differently: look for the cascade probe's own timing record before composing bounds; if one exists it would replace the inference.

## Recommended Next Focus

Iteration 6: measure per-session brief cost. The directive-lifecycle dedup drops the 219-byte directive after the first proven repeat, so the 270.6-byte mean is not what a session pays per prompt. Count head-only versus full briefs from the organic `emittedBytes` distribution and read the dedup gate.
