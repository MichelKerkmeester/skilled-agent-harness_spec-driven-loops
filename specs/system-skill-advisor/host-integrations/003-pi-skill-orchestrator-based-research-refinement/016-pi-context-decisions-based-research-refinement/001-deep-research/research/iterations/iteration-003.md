# Iteration 3: Additive advertising and brief churn (RQ2), context beyond the prompt (RQ3)

## Focus

The reducer's Next Focus still named RQ5/RQ6/RQ8, but iteration 2 already answered that question and the strategy box is ticked. I read that as a stale value and took the first unchecked key questions instead: RQ2 (additive per-branch advertising and brief churn) and RQ3 (previous-reply context for short follow-ups). I took them together because both ask what the advisor knows about earlier turns. RQ7 (tool and MCP filtering) is deferred to iteration 4.

## Actions Taken

1. Read the extension's additive path: `src/extension/skill-state.ts`, `src/apps/skill-additions.ts`, and the prompt boundary in `src/extension/runtime.ts` (lines 225-300).
2. Read the extension's context path: `src/extension/past-turn-summaries.ts`, the `readPreviousFinalReply` call sites and `docs/skill-picking.md:33`.
3. Read the advisor prompt policy (`runtime/lib/prompt-policy.ts`, `runtime/data/prompt-policy.default.json`), the cache header (`runtime/lib/prompt-cache.ts`) and the Claude hook's dedup block (`hooks/claude/user-prompt-submit.ts:380-450`).
4. Read the Pi hook's injection point and its dedup (`hooks/pi/prompt-advisor.ts:158-183`, `256-358`).
5. Tried to probe `skill-advisor.cjs advisor_recommend` with short follow-up prompts. The permission layer blocked the pipe both times, so the RQ3 routing claims below come from reading the code, not from running it.

## Findings

1. **The extension is additive because of where it injects, not because additive routing is better. CONFIRMED (mechanism), INFERRED (cache motive).** The extension rewrites Pi's native system-prompt skills section (`event.systemPromptOptions.skills = selected` inside `apply`) [SOURCE: specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/context/pi-context-decisions-main/src/extension/runtime.ts:274]. It rebuilds the set of advertised skills from the system sections already committed on the active branch [SOURCE: specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/context/pi-context-decisions-main/src/extension/skill-state.ts:14]. It also scores only skills that have not been advertised yet, and an advertised skill can never use up the cap [SOURCE: specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/context/pi-context-decisions-main/src/apps/skill-additions.ts:16] [SOURCE: specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/context/pi-context-decisions-main/src/apps/skill-additions.ts:112]. Retracting a skill would rewrite an earlier system section, which breaks the model's view of the session and the cached prefix. The advisor injects into the current user turn instead. The Pi hook appends the brief to `event.text` and returns `action: "transform"` [SOURCE: .skilled/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts:356]. The Claude hook emits it as `additionalContext` on `UserPromptSubmit` [SOURCE: .skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:446]. So a brief that changes between prompts never rewrites an earlier turn, and each sent brief stays fixed in history. [INFERENCE: provider prompt caches key on an unchanged prefix, so text appended to the newest turn adds only new tokens; confirm by comparing cache-read token counts on two consecutive Claude turns whose briefs differ.] Proposed change: none. Benefit: none, since our injection point has no cache problem to solve. Cost and risk of porting: an additive-only brief would keep a stale top skill on screen after the task changes. **Verdict: REJECT.** The cache problem the additive design solves does not exist at the advisor's injection point.

2. **The advisor dedups churn as text, not as skills, and nobody measures churn. CONFIRMED.** On a proven repeat, the Claude hook keeps the brief's head and drops the constant directive block [SOURCE: .skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:390] [SOURCE: .skilled/skills/system-skill-advisor/hooks/lib/directive-lifecycle.ts:121]. The Pi hook suppresses a contribution only when it is byte-identical to the last one in the same session [SOURCE: .skilled/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts:171], and it clears that memory on `session_compact` [SOURCE: .skilled/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts:252]. The exact-prompt cache is keyed on the canonical prompt with a 5-minute TTL [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/prompt-cache.ts:16] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/prompt-cache.ts:33], so it never joins different prompts in one session. The extension's counterpart is a score cache keyed on task, backend and limits, which adds next-best skills for the same task without a new call [SOURCE: specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/context/pi-context-decisions-main/src/apps/skill-additions.ts:43]. No advisor surface reports how often the top skill flips between consecutive prompts in one session. The hook already writes a per-turn `skillLabel` into its diagnostic record [SOURCE: .skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:436]. Proposed change: compute a per-session flip rate offline from those existing diagnostic records, with no new persisted field. That stays clear of the iteration-2 block on persisting surfaced skills by default. Benefit: we learn whether churn is a real problem before designing anything for it. Cost: one offline script. Risk: low. [INFERENCE: whether the diagnostic records carry a session key that can group turns is unverified; confirm by reading the diagnostic writer's record shape.] **Verdict: ADAPT.** Measure churn from data we already write before building any session memory.

3. **Session memory that hides already-surfaced skills would weaken the brief. INFERRED.** The extension can hide what it already advertised because the advertisement stays in the system prompt on that branch [SOURCE: specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/context/pi-context-decisions-main/src/extension/skill-state.ts:16]. An advisor brief is a per-turn user-message attachment, and compaction can summarize it away. That is why the Pi hook resets its dedup on compaction [SOURCE: .skilled/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts:252]. If the advisor stopped naming a skill because it surfaced N turns ago, the model could lose it after compaction. Proposed change: none. **Verdict: REJECT.** The advisor's context has no durable advertisement that suppression could rely on. Confirm by checking whether a compacted Claude transcript keeps prior `additionalContext` text.

4. **Very short follow-ups such as "continue" or "do it" do not route badly. They do not route at all. CONFIRMED (code trace).** `continue` and `do it` are not in `CASUAL_ACKNOWLEDGEMENTS` [SOURCE: .skilled/skills/system-skill-advisor/runtime/data/prompt-policy.default.json:4], and neither `do`, `continue` nor `proceed` is in `WORK_INTENT_VERBS` [SOURCE: .skilled/skills/system-skill-advisor/runtime/data/prompt-policy.default.json:20]. They sit under the 20-character and 50-character floors [SOURCE: .skilled/skills/system-skill-advisor/runtime/data/prompt-policy.default.json:84], so `shouldFireAdvisor` returns `fire: false` with `below_prompt_policy_threshold` [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/prompt-policy.ts:213]. The previous turn's brief is still in history, so the model carries the prior route forward. That is the outcome RQ3 wants, reached without any context. The extension gets the same effect differently: it sends prior context only when the task is non-empty [SOURCE: specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/context/pi-context-decisions-main/src/extension/runtime.ts:266], and an additive brief never retracts a skill. **Verdict: no change needed for very short follow-ups.** [INFERENCE: confirm by running `advisor_recommend` on "continue" and "do it" and reading `diagnostics.policyReason`; that probe was blocked this iteration.]

5. **The real RQ3 risk is mid-length follow-ups that fire with no context. CONFIRMED (code trace), INFERRED (harm).** "fix that too" fires through `work_intent_with_meaningful_tokens`. `fix` is a work verb, and `that` and `too` are not stop words, so it reaches the 3-token floor [SOURCE: .skilled/skills/system-skill-advisor/runtime/data/prompt-policy.default.json:54] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/prompt-policy.ts:182]. "yes, apply the second option" fires through `length_and_token_threshold`: 28 characters and 4 meaningful tokens [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/prompt-policy.ts:192]. Both are scored on their own words alone. A fresh brief built from "fix" or "option" can name a different skill than the one the session is using, and it lands in the newest turn, where it carries the most weight. The extension avoids this by sending the previous final reply (up to 2,000 characters) as `state.previousReply` [SOURCE: specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/context/pi-context-decisions-main/docs/skill-picking.md:33], plus up to 12 past-turn summaries of 240 characters each, capped at 2,000 characters [SOURCE: specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/context/pi-context-decisions-main/src/extension/past-turn-summaries.ts:24]. It folds both into its cache key [SOURCE: specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/context/pi-context-decisions-main/src/extension/runtime.ts:308]. On the advisor side, the Claude hook receives `transcript_path` but only stats its size for dedup [SOURCE: .skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:403]. The Pi hook passes only `prompt`, `cwd` and `hook_event_name` [SOURCE: .skilled/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts:289]. No advisor path reads prior turn content. [INFERENCE: confirm the harm with a benchmark of follow-up pairs, each holding a primed prompt and then a weak follow-up, scoring whether the follow-up's top skill contradicts the primed one.]

6. **Do not feed reply text into the lexical lanes. Use a weak-follow-up guard instead. INFERRED.** The extension's context goes to a model that is told to treat it as data [SOURCE: specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/context/pi-context-decisions-main/src/apps/relevance.ts:149]. Our lanes are lexical and derived, and an assistant reply often names several skills, gates and commands. Concatenating up to 2,000 characters of reply would drag the fusion toward whatever the reply mentioned, and it would also break the exact-prompt cache key [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/prompt-cache.ts:33]. Proposed change: a guard. When a prompt fires on weak grounds (`length_and_token_threshold`, or `work_intent` at the token floor) and its top recommendation is below the confidence bar, emit nothing rather than a context-free brief, and let the prior brief in history stand. Benefit: no contradicting brief on follow-ups, with no new data read and no privacy surface. Cost: one branch in the policy or render step. Risk: a real topic change phrased tersely gets no brief. That is the same outcome as today's silent "continue", and the user can still name a skill. **Verdict: ADAPT** the guard, after the benchmark in finding 5 shows the harm is real. **REJECT** sending previous-reply text to the local scorer. A shadow hosted lane (RQ1, iteration 1) is the only place where reply context would fit.

## Ruled Out

- Probing the live advisor CLI from this iteration. The permission layer refused the `printf | node` pipe twice. The routing claims are code traces, and each one names the probe that would confirm it.
- Porting additive-only semantics (finding 1).
- Skill-level suppression memory (finding 3).
- Concatenating previous-reply text into the lexical scorer input (finding 6).

## Dead Ends

- The advisor runtime has no `benchmarks/` directory. The grep for follow-up test fixtures found no advisor test that covers "continue" or "do it", so follow-up routing has no test coverage today. That is evidence for finding 5's benchmark recommendation.

## Edge Cases

- Ambiguous input: Next Focus named an already-answered question. I chose the first unchecked questions (RQ2, RQ3) and deferred RQ7.
- Contradictory evidence: none.
- Missing dependencies: the live CLI probe was blocked, so I traced the code instead and named the confirming probes.
- Partial success: `progressiveSynthesis` is true in the config, but this iteration's allowed-write list excludes `research/research.md`. I followed the stricter dispatch list and did not update `research.md`.

## Sources Consulted

- `specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/context/pi-context-decisions-main/src/extension/skill-state.ts:14`
- `specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/context/pi-context-decisions-main/src/apps/skill-additions.ts:43`
- `specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/context/pi-context-decisions-main/src/extension/runtime.ts:266`
- `specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/context/pi-context-decisions-main/src/extension/past-turn-summaries.ts:24`
- `specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/context/pi-context-decisions-main/docs/skill-picking.md:33`
- `.skilled/skills/system-skill-advisor/runtime/lib/prompt-policy.ts:182`
- `.skilled/skills/system-skill-advisor/runtime/data/prompt-policy.default.json:84`
- `.skilled/skills/system-skill-advisor/runtime/lib/prompt-cache.ts:16`
- `.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:390`
- `.skilled/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts:171`

## Assessment

- New information ratio: 0.83 (4 fully new findings, 2 partly overlapping iteration 1 and 2 material: (4 + 0.5 × 2) / 6)
- Questions addressed: RQ2, RQ3
- Questions answered: RQ2; RQ3 by code trace, with empirical confirmation pending (finding 5 benchmark)

## Reflection

- What worked and why: reading each side's injection point first (system section versus user-turn transform). That one difference explained the whole additive design, so the remaining reads only had to confirm it.
- What did not work and why: piping into the live advisor CLI was refused by the permission layer, so I lost the empirical check for RQ3.
- What I would do differently: in the synthesis, ask the orchestrator to run the follow-up probes. A leaf cannot get them through the permission layer.

## Questions Answered

- RQ2: no. The extension's additive design exists because of its system-prompt injection point. The advisor's user-turn injection has no cache cost from churn. Churn should be measured from existing diagnostics before any session memory is built.
- RQ3: very short follow-ups do not fire. Mid-length ones fire with no context and can contradict the prior brief. The fix to test is a weak-follow-up guard, not reply text.

## Questions Remaining

- RQ7: tool and MCP filtering.

## Recommended Next Focus

RQ7: tool and MCP filtering. Read the extension's `src/apps/tool-policy.ts`, `tool-inventory.ts`, `src/extension/tool-filter.ts` and the essentials list, then compare them with Code Mode's tool surface (`.utcp_config.json`, `mcp-code-mode`) and with how much the advisor and other hooks emit in total.

## Next Focus

RQ7: tool and MCP filtering.
