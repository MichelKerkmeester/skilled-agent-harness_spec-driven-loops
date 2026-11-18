# Iteration 1: Q1 Receipt contents and the guard's action, with a first pass at Q2

## Focus

Q1 from the Research Brief: what a receipt holds, which turns write one, reuse versus suppress on a weak follow-up, and the test that separates a weak follow-up from a floored topic change. Q2 (the state store) got a first pass with the budget left over. I read "weak follow-up" as the brief's definition: a short work-intent prompt whose top route passes only on the confidence floor (`../011-route-receipts-build/spec.md:40`). Q0 is closed and was not rerun.

## Actions Taken

1. Read the shared handler as phase 009 leaves it: the skip gate, the CLI brief, render, directive dedup and the crash path (`hooks/claude/user-prompt-submit.ts:385-532`).
2. Read the prompt policy (`runtime/lib/prompt-policy.ts:40-254`) and its thresholds, stop words and work verbs (`jq` over `runtime/data/prompt-policy.default.json`).
3. Read the skipped-result builder (`runtime/lib/skill-advisor-brief.ts:420-443`) and the brief and fallback renderers (`runtime/lib/render.ts:514-674`).
4. Read the nine follow-up pairs and the bench's guarded/harm rule (`runtime/bench/scorer-calibration.bench.ts:94-104`, `:214-252`).
5. Searched where `confidenceFloored` travels and where the state stores put their files (one `rg` over the scorer, schema, handler, subprocess type, CLI fallback, lifecycle store and Vibe adapter).
6. Tried an in-process probe of policy token counts and floored tops on the follow-ups and the refactor task through `dist/`. The permission layer refused it ("This command requires approval"), so the token counts below are worked out by hand from the tokenizer and the policy data. See Edge Cases.

## Findings

### Q1: what the guard can see today

1. **The hook's skip gate reads the raw prompt, not the stripped text.** `skippedResult = injectedBrief ? null : skippedAdvisorResultFor(prompt)`, where `prompt` is only `normalizePrompt(input.prompt)` [SOURCE: .skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:435] [SOURCE: .skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:457], and `skippedAdvisorResultFor` calls `shouldFireAdvisor(prompt)` on it unchanged [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/skill-advisor-brief.ts:420-423]. The explicit-marker branch wins over work intent [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/prompt-policy.ts:171-191]. So the guard cannot reuse the hook's existing policy result. It has to call `shouldFireAdvisor(stripLeadingPastedReply(prompt))` itself, which is what the bench does [SOURCE: .skilled/skills/system-skill-advisor/runtime/bench/scorer-calibration.bench.ts:231]. CONFIRMED from code. This backs the provisional REQ-007 in 011.

2. **The floor flag is set in the scorer and nowhere downstream.** The scorer sets `confidenceFloored: true` on a recommendation [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1397-1414]. One `rg -n confidenceFloored` over `runtime/schemas/advisor-tool-schemas.ts`, `runtime/handlers/advisor-recommend.ts`, `runtime/lib/subprocess.ts` and `hooks/lib/skill-advisor-cli-fallback.ts` returned zero lines. CONFIRMED: today the hook cannot tell a floored top from a confident one. The five carry edits in 011's Files to Change table are needed (schema, `publicRecommendation`, `AdvisorRecommendation`, `recommendationFromCli`) and stay in.

3. **What "suppress" would emit.** A `skipped` result with `freshness: 'unavailable'` renders as `Advisor: prompt skipped.` plus the directive block [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:644-665]. A normal brief renders `Advisor: <freshness>; use <label> <conf>/<unc> pass.` [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:618-624]. Both then go through directive dedup unchanged [SOURCE: .skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:480-483]. `skippedAdvisorResultFor` returns `null` whenever the policy fires [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/skill-advisor-brief.ts:423]. A weak follow-up always fires (it is work intent by definition), so the guard cannot get its skipped result from that function. It needs the new helper built on the private `result` builder that 011 already lists as "only if 010 picks suppress". CONFIRMED from code.

4. **What "reuse" would have to rebuild.** Re-emitting the earlier route needs a full renderable recommendation: `skill`, `confidence`, `uncertainty`, `passes_threshold`, and `command`/`needsMode` for the label, plus the shared payload's `skillLabel` [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:530-561]. A receipt would have to hold all of that, and the rebuilt head would print an old confidence as if this turn had scored it. INFERRED from the render contract. A test that renders a rebuilt result against the stored head would confirm the field list.

5. **Membership tests do not separate the cases, but the prompt's shape might.** The policy floor is 3 meaningful tokens, the stop words include `it`, `the`, `with`, `for`, `to`, and `fix`, `add`, `update`, `change`, `refactor` are work verbs [SOURCE: .skilled/skills/system-skill-advisor/runtime/data/prompt-policy.default.json] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/prompt-policy.ts:95-113]. Counting by hand with that tokenizer:

   | Prompt (stripped) | Meaningful tokens | Back-reference words | Content words (meaningful minus work verbs and back-references) |
   |---|---|---|---|
   | pair 1/9 `fix that too` | 3 | that, too | 0 |
   | pair 3 `add one more task there` | 5 | there | 3 (one, more, task) |
   | pair 5 `update it again with the new name` | 4 | it, again | 2 (new, name) |
   | pair 6 `now fix the remaining ones` | 4 | remaining, ones | 1 (now) |
   | pair 7 `apply that change to the second file as well` | 7 | that, as, well | 3 (apply, second, file) |
   | pair 8 `add tests for it as well` | 4 | it, as, well | 1 (tests) |
   | false carry `Refactor the session store module to remove duplicated locking code` | 8 | none | 6 |

   Every guarded follow-up has a back-reference word and at most 3 content words. The refactor task has none and 6. A raw meaningful-token cut separates this set only narrowly (pair 7 at 7 against the refactor task at 8), so it is too brittle. INFERRED: the counts are hand-worked because the probe was refused. Running the same table through `shouldFireAdvisor` and a `tokenize` export, after a rebuild, would confirm it.

6. **The negative controls stay out without any new test.** Pair 2 `do the same for the other branch` has no work verb and reads `length_and_token_threshold`, and pair 4 `make it a bit tighter` reads `below_prompt_policy_threshold` (spec Measured Behavior, pairs 2 and 4). The stripped-reason check `== work_intent_with_meaningful_tokens` already drops both [SOURCE: .skilled/skills/system-skill-advisor/runtime/bench/scorer-calibration.bench.ts:232]. CONFIRMED from the bench rule and the recorded pair reasons.

7. **The line anchors in 011 are stale.** 011 says the hook builds the result at `:366-378` and renders at `:388` [SOURCE: specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/011-route-receipts-build/spec.md:65]. After phase 009 the build is at `:457-470`, the render at `:480-482` and the dedup at `:483` [SOURCE: .skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:457-483]. The crash path renders its fallback from `skippedResult` at `:521-523`. CONFIRMED from code. T001 has to re-anchor them.

### Q1 recommended design

- **Receipt fields:** `version: 1`, `sessionId`, `skill` (the delivered top-1 skill id, not the display label), `writtenAt` (epoch ms), `transcriptBytes` (the size the hook already reads before dedup, `user-prompt-submit.ts:326-333`, or `null`), and the lifecycle epoch or boundary token Q3 settles. No confidence, uncertainty or prompt hash: suppress does not use them, and a field nothing reads is weight. `floored` is dropped because only unfloored routes are written.
- **Turns that write:** only a turn whose result is `status: 'ok'`, whose rendered brief is non-null, and whose top-1 is not floored. A floored route never becomes a receipt, because a floored follow-up that overwrote the receipt would let a run of follow-ups drift. Skipped, degraded, fail-open, no-match and crash turns, and guarded turns, write nothing.
- **Guard predicate (all must hold):** (a) a fresh receipt exists for the session; (b) `shouldFireAdvisor(stripLeadingPastedReply(prompt)).reason === 'work_intent_with_meaningful_tokens'`; (c) the delivered top-1 is floored; (d) the top-1 differs from `receipt.skill` (pairs 7 and 8 pass through unchanged); (e) `isWeakFollowUp(stripped)`: at least one back-reference word from a closed list (`that`, `it`, `this`, `there`, `them`, `those`, `these`, `same`, `again`, `too`, `also`, `well`, `remaining`, `ones`) and at most 3 content words. The decision function is pure: (receipt, stripped prompt, policy reason, top-1, floored) to `deliver | suppress`.
- **Action on a guarded turn: suppress.** Emit the skipped result (`Advisor: prompt skipped.`) through a new exported helper that wraps the private `result` builder, with a distinct `policyReason`, for example `weak_follow_up_receipt`, so the diagnostics can count it. Reasons: a false carry under suppress withholds a route, while under reuse it pushes the wrong one; the earlier brief is already in the model's context; reuse would need four more receipt fields and would print an old score as if new. INFERRED, a judgment from the error asymmetry. The Q5 false-carry test checks it.
- **011 change:** keep the "Modify, only if 010 picks suppress" row for `runtime/lib/skill-advisor-brief.ts` and make it unconditional. Add the `isWeakFollowUp` closed list and the content-word cap to `hooks/lib/route-receipt.ts`'s description. Rewrite the hook row's anchors to `:457-483`. Add a REQ: the guard reads its policy reason from the stripped text through its own `shouldFireAdvisor` call, never the hook's `skippedResult`.

### Q2 first pass

8. **The lifecycle file store and Vibe's head receipts already share one state base.** Both resolve `SPECKIT_DIRECTIVE_LIFECYCLE_STATE_DIR`, defaulting to `join(tmpdir(), 'speckit-advisor')` [SOURCE: .skilled/skills/system-skill-advisor/hooks/lib/directive-lifecycle-file-store.ts:46-48] [SOURCE: .skilled/skills/system-skill-advisor/hooks/vibe/prompt-advisor.mjs:69-70]. Vibe writes its head with a plain `writeFileSync(target, head, { mode: 0o600 })` [SOURCE: .skilled/skills/system-skill-advisor/hooks/vibe/prompt-advisor.mjs:105]. CONFIRMED. A `route-receipts/` sibling under that base picks up the existing test override for free. That fits 011's provisional row.
9. **Leaning recommendation for Q2: a sibling folder, not the lifecycle record.** A sibling avoids the version-2 schema bump in the Python helper. The receipt is written from TypeScript after the brief is chosen, so it can use temp-file plus `rename` without the helper's lock. INFERRED, not yet closed: the concurrency case (two hosts on one session id) and the bound (011 says 64 sessions) still need the helper's lock and pruning code at `hooks/lib/directive-lifecycle-store.py:121-145`, `:357`. `.skilled/skills/.state/` is repo-scoped, and the hook's workspace root moves with `cwd` (`user-prompt-submit.ts:200-204`), so session state there could split. INFERRED.

## Questions Answered

- Q1 Receipt contents and the guard's action: what a receipt holds, which turns write one, reuse versus suppress on a weak follow-up, and the test that separates a weak follow-up from a floored topic change. Answered with a recommended design. The separator in finding 5 is hand-computed and needs the rebuilt-`dist/` probe to move from inferred to confirmed.

## Questions Remaining

- Q2: partly answered (store location leaning to a sibling folder). Atomicity under concurrent writers, the bound and pruning are still open.
- Q3, Q4, Q5: not started.

## Ruled Out

- **Floored-passing-set membership as the separator.** The refactor task's floored passing set also holds `sk-doc` (spec Measured Behavior, third block), so "receipt skill is in the follow-up's floored set" would carry a topic change.
- **A raw meaningful-token cut.** It separates pair 7 (7 tokens) from the refactor task (8) by one token, too narrow to hold.
- **Reusing the hook's `skippedResult` as the guard's policy reason.** It is computed on raw text (finding 1).

## Dead Ends

- The in-process probe through `dist/` was refused by the permission layer in this unattended run. Not a dead end for the question, only for this iteration's tool path.

## Edge Cases

- Ambiguous input: "weak follow-up" read as the 011 definition (short work-intent prompt, top passes only on the floor). The brief's candidate fields (confidence, prompt hash) were weighed and dropped, not ignored.
- Contradictory evidence: 011 and the 010 spec cite hook lines that moved after phase 009 (finding 7). The code is the authority.
- Missing dependencies: the `dist/` probe was refused, so finding 5 is hand-computed from the tokenizer source and policy data.
- Partial success: Q1 closed with an inferred separator. Q2 got a first pass only. Under this dispatch's write list, `research/research.md` is not an allowed path, so progressive synthesis was not written this iteration.

## Sources Consulted

- .skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:200-532
- .skilled/skills/system-skill-advisor/runtime/lib/prompt-policy.ts:40-254
- .skilled/skills/system-skill-advisor/runtime/data/prompt-policy.default.json (jq)
- .skilled/skills/system-skill-advisor/runtime/lib/skill-advisor-brief.ts:355-443
- .skilled/skills/system-skill-advisor/runtime/lib/render.ts:514-674
- .skilled/skills/system-skill-advisor/runtime/bench/scorer-calibration.bench.ts:85-252
- .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1397-1414
- .skilled/skills/system-skill-advisor/hooks/lib/directive-lifecycle-file-store.ts:46-51
- .skilled/skills/system-skill-advisor/hooks/vibe/prompt-advisor.mjs:69-105
- specs/.../011-route-receipts-build/spec.md:40-159
- specs/.../010-route-receipts-research/spec.md (Research Brief, Measured Behavior)

## Assessment

- New information ratio: 0.83
- Questions addressed: Q1, Q2
- Questions answered: Q1

## Reflection

- What worked and why: reading the hook end to end, before the policy and render code, showed where the guard has to sit (between `:464` and `:480`) and that the hook's own policy result is computed on raw text. That decided the stripped-text requirement from code instead of from the brief.
- What did not work and why: the inline `node -e` probe hit the permission layer in this unattended run, so the separator rests on hand tokenization.
- What I would do differently: in iteration 2, confirm the separator with a probe the permission layer accepts. Candidates are a plain `node` call with no shell variables, or a vitest invocation if that is allowed. If neither runs, read `tokenize` and the stop list again and write the check out as a frozen 011 test row instead.

## Recommended Next Focus

Q2 closure (the lifecycle helper's lock and pruning at `hooks/lib/directive-lifecycle-store.py:121-145`, `:357`, and the file store's bound), then Q3 expiry: `hooks/lib/directive-lifecycle.ts:72-74`, `:170`, `hooks/claude/directive-lifecycle-boundary.ts:36`, and the hook's three-event mapping at `user-prompt-submit.ts:227-237`, which drops `clear`. Re-attempt the separator probe from finding 5.
