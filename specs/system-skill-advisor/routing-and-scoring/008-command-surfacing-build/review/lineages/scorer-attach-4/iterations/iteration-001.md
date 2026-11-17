# Review Iteration 001

## Dispatcher

- Run: `fanout-scorer-attach-4-1794669272137-9v23rz` (lineage `scorer-attach-4`, pass four, area `scorer-attach`)
- Mode: review; executor: in-process (no nested dispatch)
- Dimension: correctness
- Review focus addressed: the operator focus asks whether a refusal, a question or a bare mention of a command can still attach or start a mutating command. This iteration takes the refusal half of that question against the three new attach guards: the mention reader's lead lists, the retired-command map and the small-edit gate. The transcript scorer, the renderer and the six live runtimes are named as out of this lineage's scope below; the handler and attach modules reviewed here carry no runtime branch. Budget profile: `verify` (11-13 calls), used 12.
- Prior state: iteration 1 of 4, no prior findings in this lineage; pass-three report and pass-four brief read.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1-522` (whole file, changed)
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:860-960,1120-1260,1580-1620` (changed scorer gates and their call sites)
- `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:429-514,620-710` (attach paths and handler return)
- `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:39-56,135-432` (changed mention/small-edit tables)
- `.skilled/skills/system-skill-advisor/runtime/tests/command-meaning-anchor.vitest.ts:155-190,382-482` (changed scorer-gate tables)
- Probe: `lineage/probes/probe-scorer.vitest.ts` (read-only source probe; writes nothing outside the lineage)
- Executed: `vitest run --cache=false` on the six changed test files → 6 files, 191 tests, exit 0.

## Findings - New

### P1 Findings

1. **A refusal typed with the retired command name still delivers the live mutating command** -- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:240` -- `typedCommandIn` rewrites `/create:skill` to `/create:sk-skill` before `typedCommandForTop` asks `commandOnlyMentioned` (`:256`). The mention reader then searches for the live name, finds no occurrence, and returns false, so the refusal never reaches the guard. `attachTypedCommand` (`handlers/advisor-recommend.ts:494-510`) copies the returned `{command, policy, ownerSkillId}` onto the top row, and the top row for the probe prompt is `sk-doc`, which owns the command. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:240]
   Finding class: guard_gap
   Scope proof: both files are inside the declared `scorer-attach` scope; the prompt is the same one `typedCommandIn` is contracted to read, and the handler is the only production caller of `typedCommandForTop`.
   Affected surface hints: typed-command attach, retired-command map, `sk-doc` command offer, `/create:sk-skill` start policy.
   Case: `typedCommandForTop('sk-doc', 'do not run /create:skill')` returns `{command: '/create:sk-skill', policy: 'start', ownerSkillId: 'sk-doc'}` and `scoreAdvisorPrompt('do not run /create:skill')` puts `sk-doc` first, so the public recommendation carries the mutating command the reader refused.
   Claim adjudication:
   ```json
   {"type":"claim","claim":"A refusal written with the retired command name still attaches the live command because the retired-name rewrite runs before the mention guard.","evidenceRefs":[".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:240",".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:256",".skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:500"],"counterevidenceSought":"Read the compiled-route path for the same prompt; it returns action defer, so the typed path is the only caller that reaches the gap, and the probe confirms that path is live.","alternativeExplanation":"The retired name may be treated as a different command, so a refusal of the old name would not refuse the replacement. The map's own comment says the old name reads as the replacement, so the two are the same command for every other guard.","finalSeverity":"P1","confidence":0.92,"downgradeTrigger":"Downgrade to P2 if the retired name is deliberately excluded from the live command's refusal semantics."}
   ```
2. **A coordinated refusal names the second command without a lead, so the typed path still delivers it** -- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:414` -- `commandOnlyMentioned` requires every occurrence of the command to sit directly after a lead (`:419-421`). In `do not run /deep:review or /deep:research`, the second occurrence is preceded by `do not run /deep:review or `, and neither lead list can cross the first command token: the use-verb lead's gap is plain words only (`:360`), and the second lead rejects a use verb (`:373`). The function returns false, so `typedCommandForTop` delivers `/deep:research`; the handler's top row is `system-deep-loop` for this prompt. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:414]
   Finding class: guard_gap
   Scope proof: the prompt is an ordinary refusal of two tracked commands; the typed path and the handler are inside the declared scope, and no other module rewrites the lead before this guard.
   Affected surface hints: typed-command attach, multi-command refusals, deep-loop ask policies (`/deep:research`).
   Case: `typedCommandForTop('system-deep-loop', 'do not run /deep:review or /deep:research')` returns `{command: '/deep:research', policy: 'ask', ownerSkillId: 'system-deep-loop'}`; `scoreAdvisorPrompt` puts `system-deep-loop` first. The compiled-route call returns `defer`, so the typed path is the live attach.
   Claim adjudication:
   ```json
   {"type":"claim","claim":"A refusal that coordinates two command names attaches the second one because the mention reader requires a separate lead before each occurrence.","evidenceRefs":[".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:414",".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:419",".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:360"],"counterevidenceSought":"Probed the compiled route for the same prompt (defer) and the scorer rows (top skill system-deep-loop), so the typed path is the only attach. Also tested a comma variant where only one command is refused; the guard correctly leaves that one withheld.","alternativeExplanation":"The reader may have refused only the first command and merely named the second. The prompt says 'do not run A or B', which refuses both; the same wording with 'or' is the ordinary coordinated refusal.","finalSeverity":"P1","confidence":0.9,"downgradeTrigger":"Downgrade to P2 if a coordinated refusal is judged a mention of both commands rather than a refusal of both."}
   ```
3. **A correction inside one document still attaches the creation workflow when the sentence carries a generic creation word** -- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:487` -- The small-edit gate stands down whenever `CREATION_REQUEST` matches (`:331`). That regex includes `mak(?:e|es|ing)`, `new`, `add an?` and `need an?`, so ordinary correction clauses such as `make sure`, `add a missing link` and `the new readme` are read as a request to write the whole document. The compiled router routes all four prompts to `sk-create-readme`, and `attachCommand` returns `/create:readme` for each. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:487]
   Finding class: guard_gap
   Scope proof: all four prompts are correction requests inside an existing readme, the exact class the phase's purpose names; the route is the compiled route for the `sk-doc` hub, and the attach function is the declared target.
   Affected surface hints: small-edit gate, `/create:readme` start policy, correction prompts that mention a verification or a missing item.
   Case: `attachCommand('sk-doc', {action:'route',selectionKind:'single',targets:[{workflowMode:'sk-create-readme'}]}, 'fix the typo in the readme and make sure the grammar is right')` returns `/create:readme`; the same holds for `fix the typo in the readme, add a missing link` and `fix the typo in the new readme`.
   Claim adjudication:
   ```json
   {"type":"claim","claim":"The small-edit gate treats generic creation words inside a correction clause as a request to create the whole document, so a correction prompt still receives /create:readme.","evidenceRefs":[".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:331",".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:487"],"counterevidenceSought":"Ran the compiled route for each prompt and read the two REQ-004 control prompts; the controls return no command, so the gap is specific to the generic creation words. Read the phase 020 Out of Scope: it excludes edits that name no correction word; these name a typo or a grammar error.","alternativeExplanation":"The word 'new' or 'make sure' could be read as a request to author a fresh document. The sentence's verb is 'fix', and the object is an existing readme; the creation word is an adjective or a verification clause.","finalSeverity":"P1","confidence":0.88,"downgradeTrigger":"Downgrade to P2 if the creation-request guard is intentionally broad and these clauses are judged outside the correction class."}
   ```

### P2 Findings

None.

## Traceability Checks

- `spec_code` -- partial. Phase 020's purpose says a correction inside an existing document carries no writing command; finding 3 names the generic-word path that still carries one. `REQ-004`'s two exact control prompts pass (`update the README typo in line 3` and `fix the typo in the README` return no command). Phase 024's mention reader is present and its tested cases pass; findings 1 and 2 are inputs the phase's purpose names but its tables do not cover.
- `checklist_evidence` -- pending. No packet checklist claim is under review in this iteration; the phase 020 checklist rows are read at the traceability iteration.
- `feature_catalog_code` -- pending. The `command-meaning-matching.md` and `advisor-recommend.md` claims are deferred to iteration 3.
- `agent_cross_runtime` -- partial. `command-attach.ts` and `advisor-recommend.ts` carry no runtime branch; the typed-command attach is shared by every runtime's handler call. Live per-runtime proof is not available in this lineage and belongs to the phase 007 arm.
- `skill_agent`, `playbook_capability` -- notApplicable for this iteration; no playbook surface changed.

## Integration Evidence

- `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:704` calls `attachTypedCommand` on every handler return, after compiled-route enrichment. That is the production caller for findings 1 and 2.
- `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:474` calls `attachCommand` inside `enrichCompiledRoutes`; that is the production caller for finding 3.
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1611-1613` applies `withholdMentionedCommands` and `withholdWritingCommandsOnNoEdit` before the passing set is computed, so the scorer path is a second caller of the same mention reader. The gaps above are consistent across both callers because both depend on the same `commandOnlyMentioned` contract.
- The compiled-route front door `.skilled/bin/compiled-route.cjs` was run for each probe prompt; the refusal and retired-name prompts return `action: defer`, which is why the typed path is the only live attach for findings 1 and 2. The correction prompts return a single `sk-create-readme` route, which is the live attach for finding 3.
- Runtime map: claude, codex, opencode, pi, devin and dsh all reach `handleAdvisorRecommend` through their own hook or CLI front door; none of the changed files branches on the runtime. The change therefore applies uniformly, and a runtime-specific gap would live in the renderer/plugin lineage, which this lineage does not review.

## Edge Cases

- **Retired name versus live name.** The map intentionally makes `/create:skill` read as `/create:sk-skill`; the guard gap is a consequence of doing the rewrite before the mention check, not of the rewrite itself. A fix can carry the typed key alongside the mapped value so the guard reads the words the reader wrote.
- **Compiled route returns defer for the refusal prompts.** The hub attach path is therefore not the live path for findings 1 and 2; the typed path is. This is why the findings cite `attachTypedCommand`, not `enrichCompiledRoutes`.
- **Correction prompt with a genuine creation clause.** `create a readme for the payments module, check it for typos when done` should still attach `/create:readme`; the existing control covers it. The finding is limited to corrections whose creation words are adjectives or verification clauses.
- **Policy limits the blast radius.** `/create:readme` and `/create:sk-skill` carry `start`, and `/deep:research` carries `ask`, so each command asks before it writes. That is why the findings are P1 rather than P0: the refusal is still overridden, but the command does not write without a second confirmation.

## Confirmed-Clean Surfaces

- `command-attach.ts:218-242` -- mode-suffix handling: `/deep:review:auto`, `/speckit:plan:confirm` and `/speckit:implement:autopilot` are read as the base command; `/deep:review:automation` and `/create:readme:draft` are rejected. The changed tests cover both sides and pass.
- `command-attach.ts:405-432` -- the mention reader's tested tables: `REFUSE8`, `QUESTION2`, `REQUEST6`, `CONTROL5` and the question-mark cases all pass; the single-command and curly-apostrophe cases hold.
- `command-attach.ts:478-492` -- the exact `REQ-004` controls (`update the README typo in line 3`, `fix the typo in the README`) return no command; the gate's direction is right even where its vocabulary is too broad.
- `fusion.ts:1200-1231` -- the scorer gates return new objects and leave the input arrays untouched; the `withholdMentionedCommands` case for `/doctor:env` by base and the read-only survivor in `withholdWritingCommandsOnNoEdit` both pass.
- `advisor-recommend.ts:478-483` -- the head/partner command rule is deliberate: a head keeps its command under every request shape, while a non-head pair still suppresses the duplicate.

## Ruled Out

- **The retired-name rewrite itself is wrong.** Ruled out: `typedCommandIn('/create:skill')` returning `/create:sk-skill` is the phase's stated behavior, and the changed test pins it. The finding is the guard ordering, not the mapping.
- **The compiled route can attach the refused command.** Ruled out for the exact probe prompts: `compiled-route.cjs` returns `action: defer` for `do not run /create:skill` and for `do not run /deep:review or /deep:research`. The live attach is the typed path.
- **The small-edit gate can withhold a genuine creation request.** Ruled out for the control prompts: `write a readme for the doctor scripts folder` and `create a readme for the payments module, check it for typos when done` still return `/create:readme`; the existing tests cover both.
- **`commandOnlyMentioned` can read a longer command as the shorter one.** Ruled out by `(?![a-z0-9_-])` and the changed test for `/create:sk-skill-parent`; the guard returns false for the shorter name.

## Next Focus

- Dimension: security
- Focus area: the question and mention half of the operator focus -- `commandOnlyMentioned` against a doctor command row that passes on the typed name, and the no-edit/read-only split between `attachCommand` and `withholdWritingCommandsOnNoEdit`.
- Reason: iteration 1 covered refusals; the question and bare-mention cases are the remaining half of the same brief, and the scorer path is where a command row can survive a question.
- Rotation status: correctness complete (CONDITIONAL, three P1s), security next.
- Blocked/productive carry-forward: correctness was productive; no blocked approach.
- Required evidence: a `scoreAdvisorPrompt` row dump for `Is the /doctor:update command safe?` and `The /doctor:update command is documented in the README`, plus a holdout-hygiene check that no changed path reads prompt text.

Review verdict: CONDITIONAL
