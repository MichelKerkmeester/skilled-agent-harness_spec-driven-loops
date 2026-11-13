# Iteration 5: The cost ledger — what the brief, the hook and the embedder actually cost

## Focus

What the brief and the hook cost per prompt and per session, which part of that cost is invisible to the person paying it, and which measured number is still missing before a budget can be set. Chosen as the last unchecked key question; it also closes the performance half of the lineage angle.

## Actions Taken

1. Ran the real Claude `UserPromptSubmit` hook 40 times over eight public probe prompts (five repetitions each), timing each call and measuring the emitted `additionalContext` bytes.
2. Read the CLI fallback timeout resolution to see whether the hook's inner budget is smaller than the measured tail.
3. Read the hook health aggregation and the status handler's data shape to see what is computed and what is surfaced.
4. Re-read the recorded warm-embed, CLI and hook numbers from the phase 004 and 008 measurement files.
5. Checked the head and directive constants against the measured payload.

## Findings

1. **Steady-state cost is small enough that latency is not the constraint.** Over 40 samples the hook measured a **196.2 ms median, 352.4 ms p95, 94.8 ms minimum and 371.2 ms maximum**, with a **273-byte mean payload** (242 to 298 bytes, about 61 to 75 tokens). The Claude shim gives the child 2,200 ms inside a 2,500 ms hook, so the p95 uses 16 percent of the budget and the worst sample uses 17 percent. The advisor CLI alone measured 62.7 to 71.3 ms and a warm prompt embedding 6.57 ms median. The expensive prompt is the cold first one, not the steady state. [SOURCE: .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:38] [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/008-embedder-setup-and-cost/scratch/measured-2026-11-12.txt:12]

2. **The payload is dominated by a block that has nothing to do with the prompt.** The comment-hygiene directive is 233 bytes; the measured payload is 242 to 298 bytes, so the directive is 78 to 96 percent of a short brief and the command-bearing head is the remaining 25 percent or less. The head cap is 320 bytes (80 tokens) and the longest measured head is 96 bytes, so three quarters of the allowed head is unused on every prompt. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:97] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:162]

3. **The cost is measured but never shown.** Each invocation records `durationMs`, `cacheHit` and `emittedBytes`, and `buildAdvisorHookHealth` rolls them into `advisor-hook-health` with a rolling p95, cache-hit rate and fail-open rate. `advisor_status` returns freshness, generation, staleness, lane weights, skill count and trust state — no hook health, no bytes. The only tool that returns the health section is `advisor_validate`, which just `/doctor:skill-advisor tune` calls, and no `/doctor:setup` leg prints it. A person cannot see that a prompt costs 196 ms and 273 bytes. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/metrics.ts:472] [SOURCE: .skilled/skills/system-skill-advisor/runtime/handlers/advisor-validate.ts:624]

4. **No session-total cost is recorded.** The pieces are measured separately — hook per call, embedder per call, CLI per call — and no committed script reports a session-shaped total of N prompts plus one daemon start plus one embedder load. At the measured mean, twenty prompts cost about 5,460 bytes (about 1,365 tokens) of injected context and 3.9 seconds of hook time, but that number is an inference from two means, not a recorded measurement. [INFERENCE: 20 × 273 bytes and 20 × 196.2 ms from the 40-sample run]

## Recommendations

1. **Surface the hook cost in `advisor_status` and in one `/doctor:setup` row.** In `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-status.ts`, include the existing `advisor-hook-health` section (rolling p95, cache-hit rate, fail-open rate) plus a mean of `emittedBytes` over the same window; in `.skilled/commands/doctor/assets/doctor-setup.yaml`, add the p95 and mean bytes to the advisor leg's presentation line only. Gain: the person sees `p95 352 ms, 273 bytes per prompt` on demand instead of needing `/doctor:skill-advisor tune`; a regression is visible without a heavy route. Verify: `node .skilled/bin/skill-advisor.cjs advisor_status --workspace-root "$PWD" --format json | jq '.data.hookHealth.rollingP95Ms'` prints a number, and the setup leg's line carries the same number.
2. **Commit a session-shaped cost script.** Add `.skilled/skills/system-skill-advisor/runtime/scripts/measure-brief-cost.mjs` following the shape of `measure-embedder-cost.mjs`: run N public prompts through the real hook, print `n`, `medianMs`, `p95Ms`, `meanBytes`, `estimatedTokens`, and a `session20` estimate, and write and unload nothing. Gain: a reproducible number for the token and latency cost of a session, which is what a budget needs; today it does not exist. Verify: `node …/measure-brief-cost.mjs | jq -c '[.n,.medianMs,.p95Ms,.meanBytes,.session20]'` prints five numbers and `git status --short` is unchanged.
3. **Guard the head length across all 44 command-bearing heads.** Extend phase 005's golden-head matrix to one row per tracked command and assert each head stays at or under 140 bytes. Gain: a future field cannot silently add bytes to every prompt; the measured worst case today is 96 bytes plus about 40 for a document path, leaving 4 bytes of slack under the guard. Verify: the matrix reports 44 rows and a fixture head of 141 bytes fails.

## Ruled Out

- **Reducing the hook's process count to save latency.** The shim, handler and CLI are three Node starts inside a 196 ms median, but the p95 uses 16 percent of the budget; a refactor would buy milliseconds the person cannot feel while touching the process boundary that owns the timeout. Recorded as an available gain, not a recommendation.
- **Lowering the 250 ms CLI fallback default.** `resolveSkillAdvisorCliFallbackTimeoutMs` already returns the caller's 2,200 ms budget when one is passed, so the 250 ms default never applies to the Claude hook; lowering it would fix nothing. [SOURCE: .skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:162]
- **Trimming the directive block to cut tokens.** Same reason as iteration 1: it carries a repo hard block and is deliberately injected.

## Dead Ends

- Looking for a committed session-cost script: none exists; the hook probe in the phase 004 scratch prints latency only, and its row file is not part of the checkout.
- Looking for a cold-start measurement: the running daemon cannot be stopped under the lineage rules, so the cold number stays a gap and iteration 4's bound stands.

## Edge Cases

- Ambiguous input: none. The key question named the cost ledger.
- Contradictory evidence: the recorded phase 004 hook numbers (199 to 206 ms median, 224 to 269 ms p95) are lower than this run's 196 ms median and 352 ms p95. Both were taken under a load average near 8; the difference is the machine's state, and the conclusion (well inside budget) holds for either.
- Missing dependencies: the cold start and the cold embed remain unmeasured; 008's T033 plans the cold embed sample after the natural 5-minute unload.
- Partial success: finding 1 is a fresh measurement; finding 4 is an inference from two means and is marked as such.

## Sources Consulted

- Live 40-sample hook probe through `.skilled/skills/system-spec-kit/runtime/dist/hooks/claude/user-prompt-submit.js`
- `.skilled/skills/system-skill-advisor/runtime/lib/render.ts:97,162`
- `.skilled/skills/system-skill-advisor/runtime/lib/metrics.ts:472`
- `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-validate.ts:624`
- `.skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:162`
- `.skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:38`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/008-embedder-setup-and-cost/scratch/measured-2026-11-12.txt:12`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/004-command-meaning-matching/scratch/hook-latency-after-{1,2,3}.json`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/ux/steer.md`

## Assessment

- New information ratio: 0.88
- Questions addressed: KQ5 (measured cost and what stays invisible)
- Questions answered: KQ5 — steady state is cheap and bounded; the cost is real but invisible; the missing number is the cold start and the session total

## Reflection

- What worked and why: a fresh 40-sample run with byte measurement produced both halves of the cost in one pass, and reading the timeout resolver prevented a false "250 ms cliff" claim that the p95 would otherwise have suggested.
- What did not work and why: the committed probe in the phase 004 scratch depends on a row file that is not in the checkout, so it cannot be rerun as-is; the measurement had to be rebuilt inline.
- What I would do differently: measure bytes and time in the same script from the start, since the two costs answer different questions.

## Recommended Next Focus

None. Five iterations are complete and four of five key questions are answered; the synthesis consolidates the recommendations and names the open gaps.
