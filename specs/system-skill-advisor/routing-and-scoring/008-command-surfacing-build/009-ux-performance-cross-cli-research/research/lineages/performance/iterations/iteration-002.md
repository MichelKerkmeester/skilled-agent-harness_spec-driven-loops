# Iteration 2: Cold embedder, keep-alive and the p95 tail

## Focus
The reducer's Next Focus asked for a follow-up on the phase 004 tail: the meaning lane moved the hook median 5.9 ms but its p95 30.6 ms. This iteration tests whether that tail is a cold embedder, what a cold model actually costs against phase 008's planned 750 ms deadline, and whether holding the model loaded is worth its memory. It stays inside the performance angle and inside the steer's ban on touching ollama.

## Actions Taken
1. Re-read the measured embedder file for the cold reading, the warm distribution and the loaded model's memory.
2. Read the Ollama adapter's request body, its timeout selection and its abort path to see what a 750 ms deadline can actually cancel.
3. Read the advisor's embedder registry shim to find where an adapter timeout could be injected without changing every consumer.
4. Compared the cold model cost (271 to 277 ms per the operator reading) against the 30.6 ms p95 move to test the cold-tail hypothesis.
5. Checked phase 008's tasks for the cold-after-abort check and the deadline's planned location, to avoid re-recommending what it already covers.

## Findings
1. The Ollama adapter never sends `keep_alive`, so the server's default 5-minute unload applies. The measured file confirms it: at 21:25:08 the loaded model's `expires_at` was 21:29:57, four minutes and 49 seconds later. After that gap the next prompt pays a cold embed of 271 to 277 ms against a 6.57 ms warm median, roughly a 40x tax on that call. [SOURCE: .skilled/skills/system-spec-kit/shared/embeddings/adapters/ollama.ts:343] [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/008-embedder-setup-and-cost/scratch/measured-2026-11-12.txt:12] [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/008-embedder-setup-and-cost/scratch/measured-2026-11-12.txt:36]

2. The cold embed is a latency tax, not a fail-open. Phase 008 plans a 750 ms prompt deadline, and a 271 to 277 ms cold call fits it with about 475 ms of headroom, so the prompt still gets its cosine. What the person pays is one slower prompt after every idle gap, not a lost recommendation. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/008-embedder-setup-and-cost/spec.md:130] [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/008-embedder-setup-and-cost/spec.md:174]

3. Holding the model loaded is not free: 274,302,450 bytes on disk, 335,733,063 bytes loaded (the VRAM figure equals the model size), plus a 46,256 KB `ollama serve` resident set and a 352,144 KB model runner. A keep-alive recommendation has to price that memory, not just the saved milliseconds. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/008-embedder-setup-and-cost/scratch/measured-2026-11-12.txt:3] [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/008-embedder-setup-and-cost/scratch/measured-2026-11-12.txt:5] [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/008-embedder-setup-and-cost/scratch/measured-2026-11-12.txt:9]

4. Phase 008's deadline should be passed into the adapter, not raced around it. The adapter already builds an `AbortController` per request and takes an instance `timeoutMs`, but the advisor's registry shim re-exports a `getAdapter(name)` factory with no options, so today the wrapper can only abandon a 5000 ms request. Adding an options argument to the shared `getAdapter` and constructing the prompt-time adapter with `timeoutMs: 750` makes the abort real and frees the socket for the next prompt. This refines 008's planned wrapper deadline rather than repeating it. [SOURCE: .skilled/skills/system-spec-kit/shared/embeddings/adapters/ollama.ts:129] [SOURCE: .skilled/skills/system-spec-kit/shared/embeddings/adapters/ollama.ts:137] [SOURCE: .skilled/skills/system-spec-kit/shared/embeddings/registry.ts:83] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/embedders/registry.ts:17]

5. The 30.6 ms p95 tail is not the cold model. A cold call costs 271 to 277 ms, so even three cold calls inside a 44-prompt set would push p95 to roughly 470 ms, not the observed 262 ms. The tail is steady-state variance around a 6.57 ms median embed, bounded at tens of milliseconds, and the 100 to 110 ms process-start share from iteration 1 is five times larger. The tail is therefore not the optimization target. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/008-embedder-setup-and-cost/scratch/measured-2026-11-12.txt:12] [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/008-embedder-setup-and-cost/scratch/measured-2026-11-12.txt:45] [INFERENCE: a 271 ms call cannot produce a 262 ms p95 in a 44-sample set unless it appears fewer than three times, and three would exceed the observed value]

## Ruled Out
- Preloading the model once at daemon start *instead of* a keep-alive. A preload is itself a cold call, and the server still unloads after five idle minutes, so a session that pauses mid-way pays the tax anyway. Keep-alive plus a session-start warm covers both.
- Treating the p95 tail as an embedding-lane regression to be engineered away. Its absolute size is tens of milliseconds and its cause is variance, not a cold branch.
- Recommending a blanket longer deadline to absorb a cold load. It would spend the hook budget on a call that already fits inside 750 ms.

## Dead Ends
- No live idle-and-reload measurement was taken. Forcing the model to unload needs a 5-minute wait with no prompt or an ollama lifecycle action, and the steer forbids touching ollama. The measured `expires_at` plus the adapter's missing `keep_alive` is the evidence; the live check is named in the recommendation's verification.

## Edge Cases
- Ambiguous input: "cold start" could mean the daemon or the model. Both are treated separately; the daemon cap mismatch is iteration 1's finding and the model cost is this iteration's.
- Contradictory evidence: phase 008's spec says the cold load is inside the deadline, while its risk table says a short deadline could drop a slow machine's cold load. Both are true at different machine speeds; the iteration keeps the 750 ms fit as measured here and does not claim it holds everywhere.
- Missing dependencies: no slow-machine cold number exists. Recorded as a gap and left to 008's T033 script run on that machine.
- Partial success: findings 1 to 3 are measured or read from constants; finding 4 is a code-path reading; finding 5 is an inference from four measured numbers. Status is `complete` because the follow-up question is answered with a bounded claim.

## Sources Consulted
- .skilled/skills/system-spec-kit/shared/embeddings/adapters/ollama.ts:125-149,343
- .skilled/skills/system-spec-kit/shared/embeddings/registry.ts:83
- .skilled/skills/system-skill-advisor/runtime/lib/embedders/registry.ts:17
- specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/008-embedder-setup-and-cost/scratch/measured-2026-11-12.txt:3-45
- specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/008-embedder-setup-and-cost/spec.md:130,174
- specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/008-embedder-setup-and-cost/tasks.md:49

## Assessment
- New information ratio: 0.85
- Questions addressed: cold embedder cost, the p95 tail, the 750 ms deadline's real abort path
- Questions answered: the tail follow-up and the cold-start paths question in part

## Reflection
- What worked and why: pricing the cold call against the deadline, rather than against zero, separated a latency tax from a failure. Reading the adapter's abort path turned 008's deadline from a policy into a mechanism with a concrete injection point.
- What did not work and why: the tail could not be attributed to a single cause without a profiler, and the honest result is that it is too small to chase. Saying so is more useful than inventing a cause.
- What I would do differently: check the shared registry's factory signature before assuming a timeout can be threaded through; the re-export shim made that a shared-file change rather than a local one.

## SCOPE VIOLATIONS
None. No out-of-scope write was attempted.

## Recommended Next Focus
Token cost: the brief per prompt and per session under phase 005's head form, the command document read a `start` policy causes across 44 commands, and the ask-policy turn cost. Then decide whether any caching change is worth building.
