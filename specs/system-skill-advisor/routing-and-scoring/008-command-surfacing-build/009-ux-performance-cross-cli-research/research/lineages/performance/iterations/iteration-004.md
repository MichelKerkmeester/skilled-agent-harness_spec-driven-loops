# Iteration 4: Cache, precompute and the per-runtime cost architecture

## Focus
The two remaining key questions: which caching or precompute change pays for itself, and which per-runtime architecture spends the least per prompt. This iteration also checks whether the cache question can be answered from field data at all, and it compares the four host-hook runtimes with the three plugin runtimes on process count and timeout headroom.

## Actions Taken
1. Read the exact prompt cache's TTL, capacity and key composition, and traced where it is instantiated.
2. Looked for field diagnostics and metrics for this checkout to estimate a real cache hit rate, and found where persistence is gated.
3. Read the Codex, Devin and Cursor hook registrations and their adapter delegation to count processes and compare timeout budgets.
4. Confirmed the plugin runtimes (OpenCode, Pi, DSH) run the advisor in the host process and spawn only the CLI.
5. Checked what is already precomputed (command and skill vectors) before proposing any precompute work.

## Findings
1. The exact prompt cache is in-memory in the daemon, capped at 1000 entries, with a 5-minute TTL and a key over the canonical prompt, source signature, workspace root, runtime label, token cap and thresholds. A unique prompt misses by construction, and the only dataset in this packet is the 44-distinct-prompt latency probe, where the hit rate is zero by design. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/prompt-cache.ts:16] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/prompt-cache.ts:81] [SOURCE: .skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:557]

2. The cache's value cannot be measured from field data today: diagnostic persistence is gated behind `SKILL_ADVISOR_DEBUG` and the cache hit/miss counters behind the metrics enable flag, and the per-workspace diagnostics file for this checkout is absent. Any recommendation to change the cache would rest on no evidence, which is itself the finding. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/metrics.ts:319] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/metrics.ts:487] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/prompt-cache.ts:131]

3. A semantic or near-duplicate cache does not pay: deciding a hit costs one query embedding (6.57 ms median, 10.99 ms p95) and then saves the scorer work, not the embedding it just paid, while a wrong near-duplicate hit changes the recommendation. The exact cache already covers retries, and the daemon recycles on a build-staleness check rather than per prompt, so persistence across restarts buys little. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/008-embedder-setup-and-cost/scratch/measured-2026-11-12.txt:12] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/prompt-cache.ts:16]

4. All four host-hook runtimes run three Node processes per prompt: the host registration starts an adapter or shim, that adapter `spawnSync`s the Claude advisor hook, and the advisor hook spawns the CLI. Codex's adapter passes a 2800 ms timeout and Devin and Cursor pass 10 s host budgets, while Claude's shim passes 2200 ms and Codex's host kills at 3 s. [SOURCE: .skilled/skills/system-spec-kit/runtime/dist/hooks/codex/shared.js:54] [SOURCE: .skilled/skills/system-spec-kit/runtime/dist/hooks/codex/user-prompt-submit.js:12] [SOURCE: .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:54]

5. The three plugin runtimes run two processes: the host process imports the advisor hook and only the CLI is an extra process. Pi already calls the exported `handleClaudeUserPromptSubmit` in-process with its own deadline, so the in-process path is proven in production, not hypothetical. [SOURCE: .skilled/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts:269] [SOURCE: .skilled/skills/system-skill-advisor/hooks/dsh/prompt-advisor.mjs:122]

6. The common removable unit across the six runtimes is the delegated advisor-hook spawn in the four host-hook adapters, not the CLI spawn. Replacing each `spawnSync(...advisor hook...)` with an in-process import of the same exported handler saves one measured Node start (36.85 ms median) per prompt on Claude, Codex, Devin and Cursor, and leaves the adapter's payload translation intact. [SOURCE: .skilled/skills/system-spec-kit/runtime/dist/hooks/codex/shared.js:59] [SOURCE: .skilled/skills/system-spec-kit/runtime/dist/hooks/claude/user-prompt-submit.js:143] [INFERENCE: the Pi path imports the same handler without a spawn, so the delegation is not required by the handler]

7. The cold-daemon headroom is not uniform: the 5000 ms cold wait fits under Devin's and Cursor's 10 s budgets but not under Claude's 2200 ms child budget or Codex's 2800 ms adapter timeout. The fail-open risk is therefore specific to Claude and Codex, and a single SessionStart warm call removes it on both. [SOURCE: .skilled/skills/system-spec-kit/runtime/dist/hooks/codex/user-prompt-submit.js:12] [SOURCE: .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:56] [SOURCE: .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:34]

8. Nothing further is worth precomputing: the 45 command vectors and 14 skill vectors are already built, the brief's directive block is a constant, and the only remaining precompute is the once-per-session warm call. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/008-embedder-setup-and-cost/scratch/measured-2026-11-12.txt:23]

## Ruled Out
- A semantic or near-duplicate prompt cache. It pays one embedding to decide a hit and risks a wrong recommendation.
- Persisting the exact cache across daemon restarts. The daemon recycles on build staleness, not per prompt, so the saving is rare.
- Any new precompute of command or skill vectors. Both are already built and the brief's constant block is already deduped.
- Treating all six runtimes as one cold-start risk. Only Claude and Codex have a budget tighter than the CLI's cold wait.

## Dead Ends
- No field cache hit rate exists to report. The diagnostics and metrics surfaces are opt-in and this checkout has no persisted diagnostics file, so the hit-rate question is closed as unmeasured rather than answered with a guess.

## Edge Cases
- Ambiguous input: "caching" could mean the daemon cache, the OpenCode plugin cache or the directive dedup. All three are covered; the plugin cache is the same exact-key design with the same conclusion.
- Contradictory evidence: the hook document lists Cursor with a 10 s hook, while phase 006's plan calls Cursor's brief dormant. The registration exists and the delivery is version-dependent; this iteration counts Cursor's process cost but does not claim its brief arrives.
- Missing dependencies: a real prompt corpus with repeats would settle the hit-rate question. Reading one is forbidden here and no committed aggregate exists.
- Partial success: findings 1, 2, 4, 5, 7 and 8 are read from code or measured constants; findings 3 and 6 are cost inferences. Status is `complete`.

## Sources Consulted
- .skilled/skills/system-skill-advisor/runtime/lib/prompt-cache.ts:16-160
- .skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:557-587
- .skilled/skills/system-skill-advisor/runtime/lib/metrics.ts:319,487
- .skilled/skills/system-spec-kit/runtime/dist/hooks/codex/shared.js:54-76
- .skilled/skills/system-spec-kit/runtime/dist/hooks/codex/user-prompt-submit.js:12
- .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:54-56
- .skilled/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts:269-329
- .skilled/skills/system-skill-advisor/hooks/dsh/prompt-advisor.mjs:122
- specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/008-embedder-setup-and-cost/scratch/measured-2026-11-12.txt:12,23

## Assessment
- New information ratio: 0.85
- Questions addressed: caching, precompute, per-runtime architecture
- Questions answered: both remaining key questions

## Reflection
- What worked and why: counting processes from the registrations rather than from documentation found that Codex, Devin and Cursor share the Claude three-process chain, which widens one fix from one runtime to four.
- What did not work and why: the cache hit-rate question cannot be answered because both telemetry surfaces are off by default. Reporting that as the finding is more useful than an assumed hit rate.
- What I would do differently: check telemetry gating before designing a cache measurement, so the "no field data" conclusion arrives before the analysis rather than after it.

## SCOPE VIOLATIONS
None. No out-of-scope write was attempted.

## Recommended Next Focus
Consolidate: audit every recommendation against phases 005 to 008 for overlap, compute the aggregate expected gain and the one measurement gap, and state which recommendations are post-008 work and which are declined with a reason.
