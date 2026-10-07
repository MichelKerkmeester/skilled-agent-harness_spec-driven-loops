## Verdict

**Recommend nowhere as written.** The proposal is mostly covered by existing rules, and its “settle after one check” wording conflicts with required verification. The rule set already includes thinking posture, evidence, restraint, diagnosis, honesty and reply guidance (`REPO RULES.md:81–94`).

## Nine points

1. **Check the request first — mostly covered.** Wrong-premise correction and avoiding silent narrowing appear in `uncertainty-and-honesty.md:81–88` and `answer-the-actual-request.md:60–65`. The mandatory recap conflicts with “Restated summaries: repeating back what you just said” (`communication.md:90–92`). **Risk:** routine recaps add filler, and “ask one question” could prompt unnecessary clarification when either interpretation leads to the same action (`uncertainty-and-honesty.md:56–57`).

2. **Finish one approach — partly covered.** Debugging rules say to stop repeating a guess without new evidence, reframe the problem and try from that framing (`root-cause-and-debugging.md:87–100`). No direct conflict, but “carry it to a conclusion” could be read as requiring exhaustion before switching. **Risk:** persevering with an unproductive approach instead of reframing.

3. **Stop after one check — conflicts.** The repository requires rechecking when facts or risks change (`AGENTS.md:185`) and says a computed answer must be derived independently a second way (`evidence-and-proof.md:143–144`). **Risk:** premature closure and skipped verification.

4. **Doubt is not evidence — mostly covered.** The rules require investigation, calibrated confidence and evidence for claims (`uncertainty-and-honesty.md:53–71`; `evidence-and-proof.md:64–76`). The absolute wording could conflict with the instruction to ask or mark `UNKNOWN` below 40% confidence (`AGENTS.md:62`). **Risk:** dismissing meaningful low confidence because it lacks a named counterexample.

5. **Do not revise just to agree — covered, with a conflict.** The repository says not to agree for conversational flow (`AGENTS.md:168`) and to correct wrong premises with evidence (`uncertainty-and-honesty.md:81–85`). But when the operator reaffirms an instruction, the existing rule says it is their decision and says not to re-litigate (`uncertainty-and-honesty.md:86–88`). **Risk:** treating a valid correction without formal evidence as a reason to challenge the user again.

6. **New evidence reopens the case — partly covered.** Material self-corrections must be stated plainly, once (`uncertainty-and-honesty.md:106–111`), and claims must be observed, derived or marked inferred (`evidence-and-proof.md:47–58`). No direct conflict. **Risk:** explaining what changed your mind for every new fact can become process narration; the existing guidance says, “Reason about the problem, not about yourself” (`uncertainty-and-honesty.md:117–121`).

7. **Verify against real checks — covered.** Claims need receipts or an `INFERRED` label, and command output and exit status must be read (`evidence-and-proof.md:47–58, 86–95`). No direct conflict if the check tests the claim. **Risk:** “let the result decide” could overstate what a check proves; a receipt only confirms a claim if it could have contradicted it (`evidence-and-proof.md:64–72`).

8. **Do not perform caution — covered, with a caveat.** Existing rules require warnings to name a real failure and hedges to change the reader’s next action (`answer-the-actual-request.md:52–56`; `uncertainty-and-honesty.md:123–129`). A strict one-line limit could conflict with “no reply rule weakens a claim, caveat or §4 verification standard” (`AGENTS.md:167`). **Risk:** compressing or omitting distinct material caveats.

9. **Correct only material earlier errors — already covered.** This is substantially the existing rule in `uncertainty-and-honesty.md:108–111`. No direct conflict. **Risk:** low; it adds no new exposure beyond the existing threshold for correcting errors.

## Four decision tests on the new parts

1. **Always-loaded test — fail as a new rule file.** Any part intended to govern every turn belongs in `AGENTS.md`; triggered details should remain in their existing rule homes (`decision-tests.md:30–51`).
2. **Scope boundary — pass.** This is thinking posture, which the router includes in scope (`REPO RULES.md:81–94`; `decision-tests.md:55–80`).
3. **Four-part refusal test — fail for a new file.** The proposal spans existing homes rather than establishing a new trigger-shaped cluster, and it lacks a distinct home-free behavior (`decision-tests.md:84–94`).
4. **Restraint test — fail on the reviewed evidence.** The remaining additions do not establish a concrete current failure that existing rules leave uncovered; the test requires one (`decision-tests.md:105–121`). **UNKNOWN:** whether incident evidence outside the reviewed sources supports a new rule.

**Destination:** Nowhere. **Draft text to add:** None. This was a read-only review; no files were changed.