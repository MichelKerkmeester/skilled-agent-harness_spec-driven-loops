# Iteration 5: Consolidation of RQ1-RQ8 verdicts and the open confirmations

## Focus

Every strategy key question was ticked by iteration 4, so Next Focus was empty. I took iteration 4's recommendation: a consolidation pass. It produces the final ADOPT, ADAPT and REJECT table in the spec's answer shape [SOURCE: specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/001-deep-research/spec.md:140]. It also settles the cheapest open confirmations carried forward from iterations 1 and 2. I deferred the optional question of whether the host skill listing makes the brief partly redundant (see Recommended Next Focus).

## Actions Taken

1. Read the state files, iterations 1-4 and the spec's Research Brief and answer-shape lines.
2. Read the threshold resolvers in `runtime/lib/compat/contract.ts`. This closes the iteration 1 finding 2 UNKNOWN.
3. Traced the Pi hook's catch path (`hooks/pi/prompt-advisor.ts:266-340`). This extends iteration 2 finding 3 beyond Claude.
4. Located the golden routing fixture and checked it for negative, abstain or empty-gold rows. This is the iteration 1 finding 7 UNKNOWN.
5. Grepped every advisor hook for `return {}`.

## Findings

1. **The advisor's default bars are 0.8 and 0.35, and an env var overrides each one. CONFIRMED.** `SKILL_ADVISOR_COMPAT_CONTRACT.defaults` sets `confidenceThreshold: 0.8` and `uncertaintyThreshold: 0.35` [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/compat/contract.ts:10-11]. `resolvedConfidenceThreshold()` and `resolvedUncertaintyThreshold()` accept `SPECKIT_ADVISOR_CONFIDENCE_THRESHOLD` and `SPECKIT_ADVISOR_UNCERTAINTY_THRESHOLD` when the value is in [0, 1], and otherwise fall back to those defaults [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/compat/contract.ts:25-35]. `fusion.ts` reads both at module load [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:72-73]. This closes iteration 1's inferred claim. It also means the advisor already has the per-deployment threshold knob the extension benchmark asks for [SOURCE: specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/context/pi-context-decisions-main/docs/benchmarks/relevance-choice-vs-score.md:298]. What is missing is a per-model key, which matters only if the shadow model lane (iteration 1 finding 5) is ever built.

2. **The silent-failure gap also exists in the Pi hook. CONFIRMED.** When the advisor module throws, the Pi hook sets `advisorFailed = true` [SOURCE: .skilled/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts:323-324]. It then delivers context only `if (!advisorFailed && context)` [SOURCE: .skilled/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts:333]. The thrown path therefore adds nothing to the user turn, and the only trace is a debug line when advisor-debug is enabled [SOURCE: .skilled/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts:329-331]. The timeout path does emit `renderAdvisorFallbackDirective` [SOURCE: .skilled/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts:309-313]. So Pi has the same split as Claude: a timeout is visible to the model, and a crash is silent. Iteration 2 finding 3's ADAPT (emit the static fallback text on the unhandled catch, inside its own try) applies to both hooks. The `return {}` grep found that literal only in the Claude hook and a DSH test [SOURCE: .skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:479]. Pi reaches the same outcome by returning no transform. I did not read the OpenCode plugin (`.opencode/plugins/system-skill-advisor.js`), so it is still UNKNOWN whether it shares the gap.

3. **The golden routing fixture has no negative-control rows. CONFIRMED that the keywords are absent; INFERRED that the rows are absent.** The fixture's `_schema` defines every case as a positive routing assertion: `expectedSkillAny` gold labels with `tier` top1 or top3 [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/fixtures/gate2-golden-prompts.jsonl:1]. Grepping it for `negative`, `abstain`, `expectNoPass`, `noRoute`, an empty `expectedSkillAny` and null-expected forms returned 0 matches. The extension benchmark has an unrelated control on which any pick counts as a false positive, and it separates `required` from `acceptable` [SOURCE: specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/context/pi-context-decisions-main/docs/benchmarks/relevance-choice-vs-score.md:83-92]. So iteration 1 finding 7 is new fixture work, not a reporting change. `expectedSkillAny` already covers part of "acceptable", but it scores an adjacent hit as a pass rather than as its own class. Reading `prompt-policy-gold-replay.vitest.ts`, which may replay non-firing prompts, would confirm whether any abstain coverage exists elsewhere.

4. **Consolidated verdict table (synthesis of iterations 1-5).** Each row cites the iteration finding that holds the extension `file:line`, the advisor `file:line`, the change, the benefit, the cost and the risk.

| # | Idea from the extension | Verdict | Reason (one sentence) | Basis | Evidence |
|---|---|---|---|---|---|
| V1 | Hosted 0-2 model score replacing fusion | REJECT | At the default policy it measured precision 0.39, and picker time of 254-5,704 ms exceeds the 3,000 ms hook budget, while the brief needs top-1 precision. | confirmed data + inferred fit | iter 1 f4 |
| V2 | Model score as a shadow tie-break lane on ambiguity clusters only | ADAPT | The `semantic_shadow` seam and the shadow sink already exist, and clusters are usually two skills, so a logged off-hook verdict is cheap to measure. | inferred | iter 1 f5 |
| V3 | One global normalized threshold (0.375) | REJECT | The extension's own sweep shows the best floor ranges from 1.0 to 1.75 by model, so any model lane needs a per-model threshold. | confirmed | iter 1 f6, iter 5 f1 |
| V4 | Floored-confidence count in diagnostics | ADAPT | The 0.82 floor collapses evidence the way the expectation score does, and counting floored passing top-1s shows how often the floor decides. | inferred | iter 1 f3 |
| V5 | Negative controls plus a required/acceptable split, pinned to an inventory hash | ADAPT | The golden fixture has no negative-control rows, so the false-positive surface goes unmeasured. | confirmed absence (keyword) | iter 1 f7, iter 5 f3 |
| V6 | Inventory floor of 8 | REJECT | The advisor never removes a host-listed skill, so there is no advertisement to protect. | inferred | iter 1 f8 |
| V7 | Additive-only per-branch advertising | REJECT | The extension's cache problem comes from rewriting the system section, and the advisor injects into the newest user turn, so the problem does not exist here. | confirmed mechanism | iter 3 f1 |
| V8 | Measure per-session top-skill flip rate from existing diagnostics | ADAPT | Churn is unmeasured today, and the per-turn `skillLabel` is already recorded, so measure before building any memory. | confirmed gap | iter 3 f2 |
| V9 | Session memory that suppresses already-surfaced skills | REJECT | A per-turn brief can be compacted away, so suppression could lose the skill. | inferred | iter 3 f3 |
| V10 | Previous-reply text in the local scorer | REJECT | Reply text names many skills and would drag the lexical lanes, and it would also break the exact-prompt cache key. | inferred | iter 3 f6 |
| V11 | Weak-follow-up guard: emit nothing when a prompt fires on weak grounds and falls below the bar | ADAPT, gated on a benchmark | Mid-length follow-ups fire with no context and can contradict the prior brief, but the harm is not yet measured. | confirmed trace, inferred harm | iter 3 f4-f6 |
| V12 | `failMode: "closed"` default by name | REJECT | The polarity inverts: an additive hint that emits nothing is already the extension's fail-closed outcome. | inferred | iter 2 f2, iter 4 f6 |
| V13 | Visible fallback on the unhandled-exception path | ADAPT | Claude and Pi both hide a crash from the model while showing a timeout. | confirmed for Claude and Pi | iter 2 f3, iter 5 f2 |
| V14 | Operator warning per failed decision | ADAPT, low priority | The rolling fail-open rate catches outages but not single crashes, and V13 covers most of the gap. | confirmed both sides | iter 2 f4 |
| V15 | Pinned always-surface skill set | REJECT | The advisor hides no skill, so a pin would only add a constant line per prompt, which is the churn the directive dedup removes. | confirmed no-hit | iter 2 f5 |
| V16 | Opt-in "why" fields (confidence, uncertainty, dominantLane) under `SKILL_ADVISOR_DEBUG` | ADAPT | After the fact, no record says why a skill surfaced, and an opt-in keeps the prompt-free default. | confirmed gap | iter 2 f6 |
| V17 | Recorded-not-inferred rule for any history view | ADOPT (as a design rule) | A re-score after a rebuild can differ from what was emitted, so history must show emit-time values or `unknown`. | confirmed (extension) | iter 2 f7 |
| V18 | Relevance-scored tool or MCP advertisement filter | REJECT | Our only native surface is seven fixed Code Mode meta-tools, so no schemas are left to withhold. | confirmed | iter 4 f2-f3 |
| V19 | Relevance-scored call gate | REJECT | A probabilistic call should not decide access, and the binding controls here are static permissions. | confirmed absence, inferred risk | iter 4 f4 |
| V20 | Static essentials floor for tools | ADAPT, no new work | The skill's `allowed-tools` frontmatter already plays this role. | confirmed | iter 4 f5 |

[INFERENCE: the table restates iterations 1-4 plus findings 1-3 above; no verdict changed, but V5 and V13 moved from partly inferred to confirmed.]

5. **The extension's two features fail in opposite directions, and that is the cross-cutting lesson. INFERRED from confirmed code on both sides.** Skill filtering defaults to fail-closed [SOURCE: specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/context/pi-context-decisions-main/src/settings.ts:67]. The tool gate blocks external calls when the registry is missing [SOURCE: specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/context/pi-context-decisions-main/src/extension/tool-filter.ts:360]. The advisor's correct polarity is fail-open with a visible signal, which the timeout path already shows [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:633-663]. Most REJECTs in the table share one root: the extension replaces or withholds an advertisement, and the advisor adds a hint on top of one. The ideas that transfer are measurement and observability ideas (V2, V4, V5, V8, V16, V17) and one failure-visibility fix (V13), not selection mechanics.

6. **Live probes the orchestrator should run, because a leaf could not get through the permission layer. INFERRED list.**
   - RQ3: run `advisor_recommend` on "continue", "do it", "fix that too" and "yes, apply the second option", and read `diagnostics.policyReason`. This confirms iteration 3 findings 4-5.
   - RQ7: measure the token size of the seven declared Code Mode tool schemas in a fresh session. This confirms iteration 4 finding 3.
   - V2/V3: run a shadow log over the golden prompts' ambiguous rows and score tie-break accuracy against gold.
   - V8: group diagnostic records by session key, if the writer stores one (unverified, iteration 3 finding 2), and compute the top-1 flip rate.
   - V13: read `.opencode/plugins/system-skill-advisor.js` for the same thrown-path behavior.

## Ruled Out

- Re-litigating any iteration 1-4 REJECT. None had new evidence against it.

## Dead Ends

- None this iteration.

## Edge Cases

- Ambiguous input: Next Focus was empty ("all resolved"). I took iteration 4's recommended consolidation pass as the narrowest evidence-backed focus.
- Contradictory evidence: none.
- Missing dependencies: I did not read the OpenCode plugin or `prompt-policy-gold-replay.vitest.ts`. Finding 2 and finding 3 name them as the confirming reads.
- Partial success: the config sets `progressiveSynthesis: true`, but the dispatch's allowed-write list excludes `research/research.md`, and that file does not exist yet. I followed the stricter list. The verdict table in finding 4 is ready for the synthesis step to lift.

## SCOPE VIOLATIONS

- `research/research.md`: I did not create it, because it is outside this dispatch's allowed-write list. Synthesis owns it.

## Sources Consulted

- specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/001-deep-research/spec.md:98-141
- research/iterations/iteration-001.md through iteration-004.md
- .skilled/skills/system-skill-advisor/runtime/lib/compat/contract.ts:1-35
- .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:72-73
- .skilled/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts:266-340
- .skilled/skills/system-skill-advisor/runtime/scripts/fixtures/gate2-golden-prompts.jsonl:1
- grep `return {}` over `.skilled/skills/system-skill-advisor/hooks`

## Assessment

- New information ratio: 0.45. Three of six findings are new evidence: f1 and f2 are fully new, and f3 is a confirmed absence, counted as new. f4-f6 are consolidation, scored 0 for f4 and 0.5 each for f5 and f6, giving (3 + 1) / 6 = 0.67. I took off about 0.2 because the main output restates settled verdicts. No simplicity bonus.
- Questions addressed: all of RQ1-RQ8, as consolidation.
- Questions answered: none newly. All were ticked before this iteration.

## Reflection

- What worked and why: grepping for the resolver definition by name across `runtime/lib` found `compat/contract.ts` in one call, after the `fusion.ts`-only grep missed it. The definition lives in a compat module, not in the scorer.
- What did not work and why: `--include=*golden*` failed under zsh glob expansion again, the same failure iteration 4 recorded. Listing files with `grep -rln` first, then grepping the one file, worked.
- What I would do differently: read the OpenCode plugin in the same call as the Pi hook, so V13 covers every runtime.

## Questions Answered

- None newly. RQ1-RQ8 were answered in iterations 1-4. This iteration confirmed three inferred sub-claims.

## Questions Remaining

- None of the tracked key questions. Open confirmations are listed in finding 6.

## Next Focus

Synthesis: lift the finding 4 table into `research/research.md`, with the finding 6 probes as follow-up work.

## Recommended Next Focus

Synthesis, as above. If the run continues, one optional new direction: whether the host-injected skill listing makes parts of the advisor brief redundant. It is host-owned and was deferred in iteration 4.
