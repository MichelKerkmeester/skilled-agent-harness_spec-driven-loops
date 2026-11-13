# Iteration 1: Hook wall-time decomposition and the cold prompt path

## Focus
Where the measured ~205 ms Claude hook wall time actually goes, which segment can be removed without changing a recommendation, and which cold-start cap on the daemon path can exceed a runtime's hook budget. The performance-lineage steer names hook wall time (cold and warm), daemon versus no-daemon paths and cold start as its first angle, so this iteration stays on that angle and leaves token cost and cache behaviour to the next iteration.

## Actions Taken
1. Read the six state files plus `steer.md`, then the phase 005 to 008 plans and the measured evidence. The steer rulings bind: no holdout reads, no runtime CLI runs, no ollama lifecycle control, no process kills.
2. Traced the Claude per-prompt chain from `.claude/settings.json` through the spec-kit shim, the advisor hook and the CLI spawn to the daemon.
3. Timed a bare `node -e 0` process start 15 times on this machine to put a number on each process in that chain. Read-only, no repository write.
4. Read the cold-start constants on both sides of the shim boundary and compared them with the hook budgets on the other runtimes.
5. Re-read the phase 004 hook-latency files and the 008 measured file to separate the meaning lane's median cost from its tail.

## Findings
1. The Claude prompt path starts three Node processes per prompt before any scoring: the `bash -c` wrapper starts the spec-kit shim, the shim `spawnSync`s the advisor hook, and the advisor hook spawns `.skilled/bin/skill-advisor.cjs`. One bare `node -e 0` start measured 36.85 ms median (min 22.90, max 47.31, n=15) on the same machine that recorded a 205.09 ms hook median. Three starts therefore account for roughly 100 to 110 ms of that median, before any hook or scorer work. [SOURCE: .claude/settings.json:149] [SOURCE: .skilled/skills/system-spec-kit/runtime/dist/hooks/claude/user-prompt-submit.js:143] [SOURCE: .skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:253] [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/004-command-meaning-matching/scratch/hook-latency-after-3.json:1] [INFERENCE: 3 x 36.85 ms measured node start against the measured 205.09 ms hook median]

2. One of those three processes is removable without touching scoring: the hook could speak the existing JSON-RPC to the daemon in-process through the launcher bridge it already locates, instead of spawning the CLI. The CLI remains the cold-start launcher and the local-scorer fallback. The expected saving is the measured process start plus the CLI's argument and schema work, so the 205.09 ms median should land near 165 to 170 ms. The exact files are `.skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts` (add a direct bridge path beside `runCliRecommend`) and `.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts` (keep the CLI entry for cold start and fallback). [SOURCE: .skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:253] [SOURCE: .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1326] [INFERENCE: 36.85 ms measured start plus the gap between the 205.09 ms hook median and the 62.7 to 71.3 ms measured CLI call]

3. The cold-start caps on the two sides of the shim disagree, and the tighter one wins. The shim passes the advisor child a 2200 ms budget (`CHILD_TIMEOUT_MS` 2500 minus a 300 ms start margin) and kills it at 2500 ms, while the CLI may wait up to 5000 ms for a cold daemon before its local fallback answers. A daemon cold start between 2.2 s and 5 s therefore produces a fail-open prompt even though the CLI was still working correctly. A recorded sandbox run already shows the failure shape at 2508 ms. [SOURCE: .skilled/skills/system-spec-kit/runtime/dist/hooks/claude/user-prompt-submit.js:137] [SOURCE: .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:34] [SOURCE: specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/011-observation-fixes/evidence/goal-reverify/reports/pi-433.md:1]

4. The cheapest fix for finding 3 is not a bigger timeout: it is moving the cold daemon start off the prompt path. A Claude `SessionStart` group already exists with eight adapters, and none of them warms the advisor. Adding one detached `advisor_status --warm-only` call there should cost the session about 65 ms once, and remove the first-prompt cold penalty entirely. The exact files are `.claude/settings.json` (one detached SessionStart command) and, for the other runtimes, the equivalent session-start surface in `.skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md` section 2. The measurable gain is the first-prompt p95 moving from the 2500 ms timeout ceiling to the warm ~205 ms, with zero first-prompt `fail_open` outage briefs. [SOURCE: .claude/settings.json:143] [SOURCE: .claude/settings.json:149] [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/008-embedder-setup-and-cost/scratch/measured-2026-11-12.txt:18]

5. The phase 004 meaning lane moved the hook median by 5.9 ms but its p95 by 30.6 ms (middle run 199.16 to 205.09 ms median, 231.35 to 261.92 ms p95), and the warm query embedding it adds is only 6.57 ms median and 10.99 ms p95. The tail therefore belongs to something other than the steady embed, most plausibly SQLite open plus adapter variance, and no existing packet measures a cold-model prompt with the probe. That is a measurement gap, not a proven cause: the phase 008 script records the embedder's cold first call but never times a prompt against an unloaded model. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/008-embedder-setup-and-cost/scratch/measured-2026-11-12.txt:12] [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/008-embedder-setup-and-cost/scratch/measured-2026-11-12.txt:39] [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/008-embedder-setup-and-cost/scratch/measured-2026-11-12.txt:45] [INFERENCE: warm embed p95 10.99 ms cannot by itself explain a +30.6 ms p95 move]

## Ruled Out
- Treating the brief length as the first performance lever. The measured full brief is about 85 tokens and a reduced head about 17 tokens, while one command document read costs about 1,131 tokens at the median. Trimming the brief is noise beside the document read; that comparison moves to iteration 2.
- Raising the shim timeout to the CLI's 5000 ms cold wait. It would trade a fast fail-open for a 5 s stall on the first prompt, which is worse for the person than a brief that arrives on the second prompt.
- Replacing the exact prompt cache with a longer TTL as a first fix. The cache is process-local and keyed on the exact prompt, so unique prompts miss regardless of TTL; the lever is process count, not TTL.

## Dead Ends
- No live cold-daemon measurement was taken. Starting or stopping the advisor daemon writes outside this lineage and the hard rules forbid process control. The cap mismatch in finding 3 is read from source and corroborated by an existing sandbox record, and the missing number is recorded as a gap with its verification path: a sandbox socket and DB, as the launcher tests already do, then `hook-latency.mjs` once cold.

## Edge Cases
- Ambiguous input: the steer asks for "hook wall time (cold and warm)" without defining cold. Read as the first prompt of a session, when the daemon and the embedder may both be cold; the iteration separates the daemon cap from the embedder cost.
- Contradictory evidence: the phase 007 plan records a 0-of-1 smoke start rate for every runtime in `runs-smoke.jsonl`, while the growing pre-arm log now scores claude 3 of 12 and dsh 3 of 8. Not resolved here; it belongs to the cross-CLI angle and is noted for iteration 3.
- Missing dependencies: no cold daemon number exists in any packet. Recorded as a gap, not guessed.
- Partial success: the process-count and cap findings are confirmed from source, and the per-segment split is inference from one measured process start. Status is `complete` because the in-scope question is materially advanced and the remaining uncertainty is named.

## Sources Consulted
- specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/performance/steer.md
- .claude/settings.json:143-160
- .skilled/skills/system-spec-kit/runtime/dist/hooks/claude/user-prompt-submit.js:17-167
- .skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:253-291
- .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:34,1326-1360
- .skilled/skills/system-skill-advisor/runtime/lib/prompt-cache.ts:16-19
- specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/004-command-meaning-matching/scratch/hook-latency-after-3.json
- specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/008-embedder-setup-and-cost/scratch/measured-2026-11-12.txt:12-45
- specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/011-observation-fixes/evidence/goal-reverify/reports/pi-433.md
- Command output: `node -e 0` x15, median 36.85 ms, min 22.90, max 47.31

## Assessment
- New information ratio: 0.90
- Questions addressed: the hook wall-time decomposition, the cold prompt path
- Questions answered: none fully; the decomposition is measured at the process level and inferred at the segment level

## Reflection
- What worked and why: measuring a bare Node start on the same machine turned a plausible "startup is slow" story into a quantified share of the measured median. Reading both sides of the shim boundary found a concrete cap mismatch that no phase plan mentions.
- What did not work and why: the per-segment split cannot be closed without running the live hook, which would write diagnostics outside this lineage. The honest ceiling is "three measured starts plus one measured CLI call", not a profiler trace.
- What I would do differently: next time start from the cheapest removable unit (a process start) rather than the total, because the total mixes a stable measured number with an unmeasured tail.

## SCOPE VIOLATIONS
None. No out-of-scope write was attempted; the only writes are this iteration file, its delta and the gateway event.

## Recommended Next Focus
Token cost of command surfacing: measure the brief per prompt and per session from the phase 005 head form, then measure the command document read that a `start` policy causes across all 44 tracked commands. Compare that against the exact prompt cache and the directive-lifecycle dedup to decide which caching or precompute change is worth building.
