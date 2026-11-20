# Iteration 1: RQ1, Phase 002 stripping rule and placement

## Focus
RQ1 for phase 002 (pasted-context stripping): which rule strips a pasted earlier reply before the task without touching a real task, measured against the routing corpora, and is the dual placement (recommend handler plus scorer entry) the only correct one? I read the rule as the plan's T002 candidate: a leading reported-speech cue or a quote, ended by a task marker. I deferred the Python fallback path and the compiled-route reads to later iterations, because the plan scopes them out.

## Actions Taken
1. Read the phase 002 plan, spec and tasks, using grep on the rule, placement and corpus lines.
2. Checked every placement anchor the plan cites in `advisor-recommend.ts`, `fusion.ts` and `semantic-shadow.ts`. Then read `semantic-shadow.ts:140-264` and `fusion.ts:1274-1303`.
3. Listed the corpus files under `runtime/scripts/routing-accuracy/` and `runtime/scripts/fixtures/`. Counted the prompt lines in each file, then ran two rg scans over the same files: one for reported-speech cues and one for task-marker colons.
4. Grepped the extension (`skill-filter.ts`, `relevance.ts`, `past-turn-summaries.ts`) for how it tells the task apart from the text around it.
5. Tried to execute the candidate rule with `node -e` across the corpora, and to run the live probes. The unattended session refused both commands with "This command requires approval" (see Edge Cases).

## Findings

1. **The dual placement is required, and the tests cannot catch a regression in it.** Confirmed from code. The handler embeds and scores the raw `input.prompt` [SOURCE: .skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:569]. The semantic lane uses the stored embedding only on exact string equality [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts:249] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts:328]. Off the fixture projection, a mismatch gives no vector and the lane returns `[]` [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts:251] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts:252]. This part is new: under vitest, `withSemanticShadowPromptEmbedding` returns `run()` without embedding [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts:145], and the lane falls back to `fixtureVector(prompt)` of whatever text the scorer holds [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts:251]. So T004's in-process check, the `GATES` vitest run and the corpus gates all pass even with a scorer-only strip. Only the live daemon path shows the semantic lane going empty. **Verdict: CHANGE.** Add to T013 (the post-rebuild probe) a check that the stripped probe's output still has a non-empty semantic-lane contribution, or a lane-health field without `disabledReason`. That probe is the only check that catches a wrong placement.

2. **The placement is not the only correct one, but it is the best one.** Inferred from code. One alternative also keeps the embedding key and the scored text equal: strip inside `withSemanticShadowPromptEmbedding` before `adapter.embed([prompt])` and `setSemanticShadowPromptEmbedding(prompt, ...)` [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts:186] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts:202], and keep the scorer-entry strip. That puts a prompt-policy dependency inside a scorer lane, which is worse cohesion than one local variable in the handler. Stripping the cache key is optional. The key comes from `input.prompt.trim()` [SOURCE: .skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:536], and the output is a deterministic function of the raw prompt, so a raw key stays correct and only shares cache entries less often. **Verdict: KEEP** the plan's handler-plus-scorer-entry placement (plan.md "Why the handler and the scorer entry"). It also needs the rule to be idempotent, which T002 already checks.

3. **The handler still reads the raw prompt for compiled routes.** Confirmed from code; the risk is inferred. `enrichCompiledRoutes(..., input.prompt, ...)` runs at [SOURCE: .skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:563] and [SOURCE: .skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:638], and the raw prompt is passed again at :564, :582 and :639. The plan scopes these out because no failure has been shown (plan.md, data flow). If the pasted reply names a command (for example `/deep:research`), the compiled-route enrichment may still surface it after the strip. To confirm, run one probe with a pasted reply that names a slash command in front of a plain task, and compare the compiled-route field with and without the strip. **Verdict: CHANGE (probe only).** Add that probe to T013. If it shows leakage, open a follow-up; this phase makes no code change for it.

4. **Corpus false-match count is 0, but that is weak evidence of precision.** Confirmed by rg. There are 701 prompt lines across 8 corpus files: command-prompts 224, labeled-prompts 195, doctor-prompts 78, holdout-prompts 63, regression-cases 42, gate2-golden 39, behaviour-fresh 36 and ambiguity-prompts 24 [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/labeled-prompts.jsonl:1] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/fixtures/gate2-golden-prompts.jsonl:1]. `rg -i '(you|assistant|claude) (replied|said|wrote|answered|responded|told me)'` matched nothing in either corpus folder, and `rg -c -i '\b(now|task|next|then) ?:'` matched nothing either. Every component the rule needs is absent, so REQ-004 passes trivially for any cue-plus-marker rule. The corpora hold no near-miss negatives, so the 0 says nothing about precision. I did not scan the policy gold-replay fixture behind `tests/prompt-policy-gold-replay.vitest.ts`. **Verdict: CHANGE.** Extend T002's one-liner check with 4 to 6 inline negative cases instead of new corpus rows, which would move more baselines. Examples: a task that opens with a quoted string (`"Fix the bug where the bot prints \"you said:\" twice"`), a task that contains `Now:` mid-sentence without a leading cue, and a cue with no task marker. Each must come back unchanged.

5. **Rule shape.** Inferred; the execution check was blocked. The smallest rule that fits the probe and the negatives:
   - Match only at the very start: an optional `earlier|previously|above` word, then `(you|the assistant|claude) (replied|said|wrote|answered|responded):`, or a leading quote character.
   - Strip from there through the end of the first `(?:^|[.!?\n]\s*)(now|task)\s*:` marker.
   - If the remainder is empty, return the input unchanged.
   - Keep `then:` and `next:` out of the marker set. They show up inside real multi-step tasks, so a rule that included them would be more likely to cut task text. That is a judgment, since the corpora hold neither marker.
   - Idempotence breaks for a nested paste, where the remainder itself starts with a cue and a marker. T002 should state that one pass is enough (no fixed-point loop) and test the nested case, so the second application is unchanged by design or the case is named as a known limit.
   
   To confirm: run the T002 one-liner on the probe pair, the `You said:` variant, the nested case and the negatives. **Verdict: KEEP** T002's candidate, adding the negative and nested cases above.

6. **The extension's way of separating the task does not transfer.** Confirmed from code. pi-context-decisions tells prompt from reply by the transcript message role (`entry.message.role === "user"` or `"assistant"`) [SOURCE: specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/context/pi-context-decisions-main/src/extension/past-turn-summaries.ts:22]. It walks back over consecutive user messages to find a prompt's start [SOURCE: specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/context/pi-context-decisions-main/src/extension/past-turn-summaries.ts:77]. No text heuristic inside a single user message turned up in `skill-filter.ts` or `relevance.ts` (grep for latest/last-user/pasted/quote matched nothing there). The advisor gets one prompt string per request, and a reply pasted into that string has no role boundary, so a text rule is the only option. **Verdict: DROP** any extension-derived alternative for phase 002.

7. **The rule's effect on the probe pair is not confirmed by execution in this iteration.** This is a missing dependency, not a finding about the plan. `node -e` and the `skill-advisor.cjs` probes were refused by the unattended session's permission layer, so the spec's Measured Behavior probes (sk-doc 0.9268 on the pasted prompt) could not be rerun here. [SOURCE: specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/005-plan-validation-research/spec.md:70]

## Questions Answered
- RQ1, with one caveat: the placement and the corpus count are confirmed. The rule's behavior on the probe pair is inferred until the orchestrator or a later iteration runs it.

## Questions Remaining
- RQ2: phase 003 floor-only ties after `67782cf23f0`, the ship rule, and what the guard returns.
- RQ3: phase 004 nested-try fallback, and the ENV-REFERENCE sentence.
- RQ4: gaps and order.

## Ruled Out
- Stripping only the advisor's own output lines. The plan already rules it out, and nothing here contradicts that.
- The extension's role-based separation, which has no input to work on in the advisor (Finding 6).

## Dead Ends
- Running `node -e` and live CLI probes from this unattended executor. Both need approval. Later iterations should use rg and Read for evidence and leave probes to the orchestrator.

## Edge Cases
- Ambiguous input: "pasted reply" could also mean a leading Markdown blockquote (`> ...`). I covered the leading-quote character in the rule shape but did not count blockquotes separately.
- Contradictory evidence: none.
- Missing dependencies: `node -e` execution and the live `advisor_recommend` probes were blocked by the permission layer. As a fallback I used rg counts for the corpus scan. Probe confirmation is deferred to the orchestrator.
- Partial success: the corpus scan and code reads succeeded; the rule execution and probes failed. Status is `complete`, because RQ1 has a cited answer, with the caveat named.

## Sources Consulted
- `specs/.../016-.../002-pasted-context-stripping/spec.md`, `plan.md`, `tasks.md` (T002 to T007, Data Flow, Risks)
- `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:515`, `:536`, `:563`, `:569`, `:638`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts:144-223`, `:249-254`, `:328`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1274-1294`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/*.jsonl` and `runtime/scripts/fixtures/*.jsonl` (rg counts)
- `specs/.../016-.../context/pi-context-decisions-main/src/extension/past-turn-summaries.ts:22`, `:77`

## Assessment
- New information ratio: 0.79
- Questions addressed: RQ1
- Questions answered: RQ1 (with the execution caveat in Finding 7)

## Reflection
- What worked and why: checking the plan's exact `file:line` anchors and then reading the surrounding function showed the vitest short-circuit at `semantic-shadow.ts:145`. The plan cites the equality check but misses that its own verification steps run under vitest.
- What did not work and why: `node -e` and the probes need interactive approval, and this executor runs unattended. rg with `-o` or `--glob` also needed approval, while plain `rg -c` and `rg -n` did not.
- What I would do differently: plan from the start for rg-only evidence, and spend the saved calls on the gold-replay fixture and on a blockquote count.

## Recommended Next Focus
RQ2: read `git show 67782cf23f0 --stat`, the fusion code that dropped floor-only ties on short prompts, and phase 003's ship rule. Find out whether "fix that too" still produces a three-way 0.82 floor tie, as the spec's Measured Behavior shows, and why, given that the commit was meant to drop such ties.
