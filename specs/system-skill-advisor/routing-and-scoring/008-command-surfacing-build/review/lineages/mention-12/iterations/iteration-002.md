# Review Iteration 002 - mention-12

## Dispatcher

- Mode: review. Target agent: `@deep-review`, executed in-process by this detached fan-out lineage.
- Session: `fanout-mention-12-1794856957949-n58dw7`, generation 1, lineage `mention-12`.
- Iteration: 2 of 8. Dimensions: security and maintainability. Focus: the untrusted-prompt surface of the mention guard, and the two divergent "is this command named" boundary rules.
- Operator review focus, and how this iteration addressed it: pass twelve's brief asks for a wrapper, quote or alias case the invariance test does not cover that changes a refusal or question into a request or back. This iteration checked the security side of that question (can a crafted wrapper or homoglyph make the guard offer a command it should withhold, or make it slow) and the maintainability side (does the typed-command reader apply the same wrapper rules as the mention reader). The security probes are clean; the maintainability probe found F003.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1-549`
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:196-264` (focused reread of `typedCommandIn`, `typedCommandForTop`, `COMMAND_START_BOUNDARY`, `MODE_SUFFIX` and `RETIRED_COMMANDS`)
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:410-459` (focused reread of the mention normalizer)
- `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:476-555` (typed-command boundary cases)
- `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:421-439` (the `attachTypedCommand` consumer)
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1200-1260` (the scorer consumers)
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/review-brief-12.txt:1-10`

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

3. **The typed-command reader applies a narrower wrapper set than the mention reader** -- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:208` -- `COMMAND_START_BOUNDARY` admits only whitespace, backtick, straight quotes and an open parenthesis before a command name, while `commandOnlyMentioned` also drops asterisks and curly double quotes at line 427. A command the reader typed inside markdown bold or curly quotes is therefore not "typed" for `typedCommandIn`, and both consumers withhold the command: `attachCommand`'s deep-loop gate at line 527 requires `typedCommandIn(prompt) === commands[workflowMode]`, and `typedCommandForTop` at line 256 returns `undefined` before `handlers/advisor-recommend.ts:427` can attach it.

   - Case: `attachCommand('system-deep-loop', SINGLE('review'), '**/deep:review** the diff')` returns `undefined`, while `'/deep:review the diff'` returns `'/deep:review'`. `typedCommandForTop('sk-doc', 'run **/create:readme** for the advisor skill')` returns `undefined`, while `'run /create:readme for the advisor skill'` returns `{command:'/create:readme',policy:'start',ownerSkillId:'sk-doc'}`. Curly double quotes reproduce both. The wrapped mention itself is read correctly by `commandOnlyMentioned`, so the two readers disagree on the same prompt.
   - Finding class: cross-consumer
   - Scope proof: exercised the exported functions on the bold, curly-quote, bracket and parenthesis forms; the parenthesis form already works (`(/deep:review)` delivers) while bold and curly do not, which isolates the missing characters to `COMMAND_START_BOUNDARY`. `typedCommandForTop` and the deep-loop gate are the two consumers, and both were run.
   - Affected surface hints: `lib/command-attach.ts` `typedCommandIn`/`typedCommandForTop`; `lib/command-attach.ts:527` deep-loop gate; `handlers/advisor-recommend.ts:421-439`; `tests/command-attach-guards.vitest.ts:476-555`.

## Traceability Checks

- `spec_code` (core): pass. The scope files are unchanged by this iteration; the branch's mention fix is intact (iteration 1 evidence). F003 is a pre-existing asymmetry in the typed path that the pass-eleven wrapper test does not cover, because that test asserts `commandOnlyMentioned` parity only (`[SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:183-188]`).
- `checklist_evidence` (core): notApplicable. No packet checklist belongs to this review pass.
- `skill_agent` (overlay): pass. No agent definition is touched.
- `agent_cross_runtime` (overlay): notApplicable. No runtime mirror is touched.
- `feature_catalog_code` (overlay): partial. The wrapper contract is implemented twice with different character sets; F003 names the second implementation.
- `playbook_capability` (overlay): partial. No playbook scenario was executed; the functions were exercised directly.

## Integration Evidence

- `handlers/advisor-recommend.ts:421-439` `attachTypedCommand` calls `typedCommandForTop` and returns the output unchanged when it is `undefined`, so the top recommendation loses its `command`, `policy` and `ownerSkillId` fields for a wrapped typed command.
- `lib/scorer/fusion.ts:1230-1232` `withholdWritingCommandsOnNoEdit` also compares `typedCommandIn(promptLower)` with the row base, so a bold-wrapped typed command cannot use the "typed and asked for" exception on a no-edit prompt.
- `lib/command-attach.ts:527` the deep-loop gate treats "typed this command" as the ask; a wrapped typed command falls through to the depth-wording list instead.

## Edge Cases

- The deep-loop impact is partly masked by depth wording: `**/deep:review** the diff with a thorough pass` still offers `/deep:review` because `thorough` satisfies `DEPTH_REQUEST`, so the loss shows only on a short typed request.
- Parenthesized typed commands already work (`(/deep:review)`), so the defect is not "all markup"; it is the characters missing from the boundary class.
- The bracket form `[/deep:review]` fails at both readers: `commandOnlyMentioned` treats a bracketed mention as unled (F001) and `typedCommandIn` does not see a boundary. It is counted under F001, not here.
- Refusal phrasings outside the curated lead vocabulary (`under no circumstances run /x`, `kindly refrain from running /x`) read as requests. This is the finite-vocabulary design recorded in the module comment at lines 369-377, not a new wrapper or alias case, so it is recorded here and not reported.

## Confirmed-Clean Surfaces

- No prompt text reaches a `RegExp` constructor: the lead and name patterns are built from module constants and `escapePhrase` escapes every command name from the tracked tables.
- DoS: a 100 KB prompt with one occurrence evaluates in 3.3 ms; 2,000 occurrences in 52 KB evaluate in 289 ms, which is linear in occurrences and not an amplification.
- No secret, path or filesystem surface: the module reads only its arguments.
- Homoglyph and zero-width forms do not name a tracked command, so they cannot route to the command whose guard they would bypass.

## Ruled Out

- A ReDoS or super-linear scan from prompt-controlled repetition (measured above).
- A bypass that offers a mutating command from a prompt that never names a tracked command: the homoglyph, zero-width, fullwidth-slash and case variants do not match the tracked tables, so no route selects the command.
- `escapePhrase` drift: the command names come from trusted tables and every metacharacter in them is escaped before the regex is built.
- A regression in the retired-name or single-quote behavior of the typed path: `typedCommandIn('/create:skill:auto')` still returns `/create:sk-skill`.

## Next Focus

- Dimension: all four, as a final cross-reference and verification pass
- Focus area: verify F001, F002 and F003 still reproduce from the final tree, recheck the recorded limits, and prove the lineage state (iteration file, delta, state log, registry, strategy) agrees before synthesis.
- Reason: security and maintainability are closed; no P0 exists and the active P1 is F001, so the next pass is verification rather than another discovery angle.
- Rotation status: all four dimensions will be covered after this pass.
- Blocked/productive carry-forward: productive was exercising the exported functions over concrete prompts; carry that into the final recheck.
- Required evidence: the same prompts used in iterations 1 and 2, plus the convergence script's stop decision recorded in the state log.
- Recovery note: none.

Review verdict: CONDITIONAL
