# Review Iteration 003

## Dispatcher

- Lineage: `attach-config-7` (fan-out child, session `fanout-attach-config-7-1794829999759-g4q8yp`)
- Area: `attach-config` per `review/review-scope-7.txt`
- Dimension: security and maintainability (cross-reference pass; two dimensions remained under the three-iteration cap)
- Operator review focus: the reviewer followed `review/review-brief-7.txt` for the last time. This iteration covers the vitest config's environment handling as a trust boundary and the maintainability of the changed comment and tests. The scorer and docs areas stay with their lineages. No recorded limit is re-reported.
- Steer channel: `steer.md` still does not exist.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/vitest.config.ts` (1-40) [SOURCE: .skilled/skills/system-skill-advisor/runtime/vitest.config.ts:23]
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts` (comment 203-210, matcher 220-244) [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:203]
- `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts` (436-470) [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:442]
- `.skilled/skills/system-skill-advisor/runtime/tests/doctor-brief-render.vitest.ts` (61-96) [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/doctor-brief-render.vitest.ts:92]
- `.skilled/skills/system-skill-advisor/runtime/tests/command-behaviour-guards.vitest.ts` (753-798) [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/command-behaviour-guards.vitest.ts:782]
- `.skilled/commands/deep/review.md`, `.skilled/commands/create/sk-skill.md`, `.skilled/commands/speckit/plan.md` (argument-hints, context evidence) [SOURCE: .skilled/commands/deep/review.md:3] [SOURCE: .skilled/commands/create/sk-skill.md:3] [SOURCE: .skilled/commands/speckit/plan.md:3]

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The matcher applies one shared suffix vocabulary to commands that advertise no `:with-*` modifier, and the comment states the opposite** -- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:203` -- The comment says a `:with-*` modifier is "how the command documents say to type a command", but only `/speckit:complete` advertises `:with-research` and only `/speckit:complete` and `/speckit:plan` advertise a `:with-*` modifier at all. Every other command, including `/deep:review` and `/create:sk-skill`, has the full set read as its end.
   - Finding class: documentation accuracy for a shared routing vocabulary (`maintainability`)
   - Scope proof: the comment and the shared set both live in `command-attach.ts`; the contradicting documents are cited as context, not modified.
   - Affected surface hints: `.skilled/commands/deep/review.md:3`, `.skilled/commands/create/sk-skill.md:3`, `.skilled/commands/speckit/plan.md:3`
   - Case: a reader types `/speckit:plan:with-research add a login page`, carrying the modifier over from `/speckit:complete`. The matcher returns `/speckit:plan` because `with-research` is in the shared set, while `plan.md:3` advertises only `:with-context` and `:with-phases`. The advisor therefore presents the text as a valid invocation of a command that does not document that argument.

   [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:203] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:210] [SOURCE: .skilled/commands/speckit/plan.md:3]

   Why it is P2 and not P1: the matcher still identifies the command the reader typed, and the per-command parsing belongs to the command, not to the advisor. The defect is the stated scope of the vocabulary, which a follow-on editor would trust and widen further.

   Fix recommendation: either derive the accepted suffix set per command from each `argument-hint`, or reword the comment to say the set is the union of modifiers any command advertises and is accepted after every command.

   Claim adjudication:
   ```json
   {"type":"claim","claim":"The comment claims per-command documentation drives the accepted suffixes, while the code applies one shared set to commands whose documents advertise no :with-* modifier.","evidenceRefs":["command-attach.ts:203","command-attach.ts:210","deep/review.md:3","create/sk-skill.md:3","speckit/plan.md:3"],"counterevidenceSought":"Checked whether another layer narrows the set per command before the suffix is consumed. typedCommandIn and typedCommandForTop both use the same constant, so no layer narrows it.","alternativeExplanation":"The shared set may be deliberate, since a modifier that one command documents is harmless on another command. If so, only the comment is wrong, which is the fix the finding names.","finalSeverity":"P2","confidence":"high","downgradeTrigger":"P2 is the lowest active tier. If the command parser rejects an undocumented modifier outright, impact grows to a user-visible misread and this should be raised to P1 on the next pass."}
   ```

## Security Checks

- No user-controlled text is compiled into a pattern in the changed code. The suffix pattern is a constant, and `commandOnlyMentioned` escapes the command phrase before building its pattern. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:315]
- `delete process.env.AI_SESSION_CHILD` runs only in the vitest config process. Production still reads the flag at the renderer boundary, so the test change cannot weaken the dispatched-child gate. [SOURCE: .skilled/skills/system-skill-advisor/runtime/vitest.config.ts:27] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:529]
- The per-run temp folder is created with `mkdtempSync`, which gives an owner-only directory on POSIX, and it replaces a shared system temp path for the suite's health records. That moves suite records out of a shared location rather than into one. [SOURCE: .skilled/skills/system-skill-advisor/runtime/vitest.config.ts:17]
- The arena premise check runs `git ls-files -z` with a fixed argument vector and no shell, so the fixture adds no injection surface. [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/command-behaviour-guards.vitest.ts:784]

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | pass | The accepted set matches the documented union; the per-command scope is recorded as the P2 above rather than as a spec contradiction. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:210] |
| `checklist_evidence` | notApplicable | Phase-parent packet has no `checklist.md`; scope is the five area files. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/spec.md:1] |

## Integration Evidence

- The parent-shape tests in `doctor-brief-render.vitest.ts` now pass `{ childSession: false }` on the one assertion that names `(ask)`, matching the pattern already used by `command-head-length.vitest.ts`. [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/doctor-brief-render.vitest.ts:92]
- The remaining `doctor-brief-render` assertions that omit `childSession` are safe because the config clears the inherited flag, and their expected labels are read-only or carry no policy word. [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/doctor-brief-render.vitest.ts:67]
- The arena premise check hardcodes `1024 * 1024`, which is the `spawnSync` default buffer, so the assertion tests the intended boundary rather than an arbitrary size. [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/command-behaviour-guards.vitest.ts:786]

## Edge Cases

- The positive tests pin `:with-research` and `:with-context` but never `:with-phases`, so a future edit that drops `phases` from the alternation would pass the suite. This is a coverage gap with no current wrong input; it is recorded here rather than as a finding. [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:442]
- The exit handler does not run after a signal, so a signal-killed suite leaves its `sav-` folder behind. The config comment states the limit. [SOURCE: .skilled/skills/system-skill-advisor/runtime/vitest.config.ts:13]
- The `:with-*` words stay in prompt tokenization on purpose, because they name extra work. That choice is deliberate and is not the same defect as the parser divergence found in iteration 2. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/text.ts:43]

## Confirmed-Clean Surfaces

- The new comment's chain example is accurate for `/speckit:complete`, the one command that advertises both a mode and a `:with-*` modifier. [SOURCE: .skilled/commands/speckit/complete.md:3]
- The config clears the inherited flag after creating the temp folder and before any worker starts, so both effects reach the workers. [SOURCE: .skilled/skills/system-skill-advisor/runtime/vitest.config.ts:17]
- The matcher's negative lookahead still rejects a longer word after a modifier, so `:unattendedx` is not read as `:unattended`. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:210]

## Ruled Out

- A security regression from the deleted child flag: the deletion is test-process only and production reads the flag at `render.ts:529`. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:529]
- A temp-folder exposure: `mkdtempSync` creates the folder owner-only and the exit handler removes it on normal exit. [SOURCE: .skilled/skills/system-skill-advisor/runtime/vitest.config.ts:17]
- Re-reporting the macOS-only `isolation-check.sh` limit or the `started of offered` limit: neither is touched by this area, and no new input breaks them.

## Next Focus

- Dimension: none remaining; all four configured dimensions are covered.
- Focus area: synthesis.
- Reason: iteration 3 reaches `maxIterations: 3`; the cap is a legal terminal stop and the remaining findings are P2 advisories.
- Rotation status: correctness, traceability, security and maintainability complete.
- Blocked/productive carry-forward: none blocked; direct read plus source-reproduced probes were productive in all three passes.
- Required evidence: none further; the two P2 findings carry file:line and a concrete input.
- Recovery note: not in recovery.

Review verdict: PASS
