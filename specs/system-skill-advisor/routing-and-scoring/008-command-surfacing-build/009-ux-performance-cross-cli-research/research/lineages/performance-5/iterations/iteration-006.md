# Iteration 6: Per-session brief cost and the dedup that almost never fires

## Focus

Turn the per-brief byte figure into a per-session cost. Iteration 3 measured 270.6 bytes mean over 1,234 briefs, but the directive-lifecycle dedup is supposed to drop the 219-byte directive after a proven repeat, so the mean is only a per-prompt figure if the dedup rarely reaches its proof. This pass measures the dedup's actual share and reads its gate.

## Actions Taken

1. Bucketed the 1,234 organic `emittedBytes` values to test for a head-only mode below the directive's 219 bytes.
2. Read the dedup gate's proof conditions: session id, session confirmation, transcript validity and growth, and clock stability.
3. Compared the gate's conditions with what a behaviour-arm turn provides.

## Findings

1. **Brief bytes are tightly clustered and almost never head-only.** p10 244, p25 260, p50 262, p75 286, p90 298, max 361 bytes. Only 9 of 1,234 briefs (0.7 percent) fall below 120 bytes, the size a head-only delivery would have; 1,221 (99.0 percent) are at or above 240 bytes. [SOURCE: $TMPDIR/speckit-skill-advisor-metrics/*.jsonl]

2. **The dedup gate needs a proven continuing session, so a fresh turn always pays the directive.** Reduced delivery requires a non-empty confirmed session id, a valid transcript with byte size, a stable state clock across two reads, and a transcript that has not shrunk; a new session, a lifecycle boundary, a changed directive set or a shrunk transcript all force the full block. [SOURCE: .skilled/skills/system-skill-advisor/hooks/lib/directive-lifecycle.ts:121-179]

3. **In an arm where every turn is a new session, the dedup cannot fire, so 270.6 bytes is the per-prompt cost, not an upper bound.** The behaviour runner starts each row as its own runtime session, and the measured population agrees: 99 percent of briefs carry the full block. [SOURCE: .skilled/skills/system-skill-advisor/hooks/lib/directive-lifecycle.ts:129-137] [INFERENCE: based on the dedup gate's session requirement and the 0.7 percent head-only share]

4. **A long-lived operator session would amortize toward a 26-90 byte head, but no row set here measures that share.** The head is a single line (median 88 bytes in segment four) and the directive is 219 bytes, so a reduced delivery would land in the 26-90 byte range depending on the head's command and score decoration. What would confirm the amortized figure: five or more prompts sharing one session id with a growing transcript, recording `emittedBytes` per prompt. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/research-segment-4.md:167] [INFERENCE: based on the head and directive byte split]

## Ruled Out

- Treating 270.6 bytes as a per-session upper bound: it is the per-prompt cost in a fresh-session population.
- Measuring the dedup's amortized effect from this data: nine head-only rows cannot support a share.

## Dead Ends

- Splitting brief bytes by `cacheHit`: a cache hit describes the recommendation cache, not the directive lifecycle, so the two fields do not partition the same population.

## Edge Cases

- Ambiguous input: none.
- Contradictory evidence: none.
- Missing dependencies: no single-session multi-prompt record exists in the folder.
- Partial success: the per-prompt cost is measured; the amortized per-session cost is inferred with its confirming test. Status `complete`.

## Sources Consulted

- `$TMPDIR/speckit-skill-advisor-metrics/*.jsonl`
- `.skilled/skills/system-skill-advisor/hooks/lib/directive-lifecycle.ts:121-179`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/research-segment-4.md:167`

## Assessment

- New information ratio: 0.72
- Questions addressed: KQ3's per-session half
- Questions answered: none new

## Reflection

- What worked and why: bucketing the bytes exposed a missing mode faster than reading the dedup code would have; the code then explained why the mode is missing.
- What did not work and why: the cache field looked like a plausible split and is not one.
- What I would do differently: bucket the outcome variable before reading the mechanism that is supposed to shape it.

## Recommended Next Focus

Iteration 7: price the process chain. Segment one estimated 100-110 ms of the Claude median as three Node starts and proposed collapsing two spawns. On the built state, measure what each spawn costs from the committed probes and state the ceiling a collapse could recover.
