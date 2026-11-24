# Iteration 2 - security

## Dispatcher

- Lineage: `deepseek-max-1`, generation 10, run `fanout-deepseek-max-1-1795556727682-axtzf8`
- Dimension: security
- Review target: `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers`
- Operator focus addressed: the security pass reads the trust boundary the focus names: the 10,000-unit prompt head both copies read, the bounded lead windows, and the brief's subprocess command vetting, then traces what a child-supplied row can still print.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:296` (`TRACKED_COMMANDS`)
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:313` (`trackedCommandForOwner` and the values it returns)
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:770` (`RUN_ASK_REFUSAL_GAP`, `LEAD_WINDOW`, `endsBefore`)
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:978` (`RUN_REFUSED`)
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1694` (`attachCommand` guards)
- `.skilled/skills/system-skill-advisor/runtime/lib/skill-advisor-brief.ts:184` (`ownedCommandRecommendation`)
- `.skilled/skills/system-skill-advisor/runtime/lib/skill-advisor-brief.ts:437` (`shouldFireAdvisor` and the head cap)
- `.skilled/skills/system-skill-advisor/runtime/lib/skill-advisor-brief.ts:493` (`routedPrompt` cut)
- `.skilled/skills/system-skill-advisor/runtime/lib/render.ts:163` (`sanitizeSkillLabel`)
- `.skilled/skills/system-skill-advisor/runtime/lib/render.ts:208` (`policyWord`)
- `.skilled/skills/system-skill-advisor/runtime/lib/render.ts:227` (`commandLabel`)
- `.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1558` (`typed.policy` on the degraded path)
- `.skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts:257` (`ADVISOR_PROMPT_MAX_CHARS`)
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:888` (`_advisor_prompt_head`)
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:1056` (the head handed to the native handler)
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5120` (`_fold_quotes`)
- `.skilled/skills/system-skill-advisor/runtime/tests/brief-command-owner-check.vitest.ts:89` (the two ownership cases)

## Findings - New

### P0 Findings

None.

### P1 Findings

None new. Carried forward: `L1-P1-001` (a refused run ask after a loop question is read as an ask) is still active and keeps this iteration at `CONDITIONAL`.

### P2 Findings

1. **The hook brief vets a child-supplied command but still trusts the child's policy and owner** -- `.skilled/skills/system-skill-advisor/runtime/lib/skill-advisor-brief.ts:191` -- `ownedCommandRecommendation` calls `trackedCommandForOwner(skill, command)` and, when the command is tracked for the row's skill, returns the *original* recommendation unchanged. The helper returns the tracked table's `{command, policy, ownerSkillId}`, and the CLI degraded path consumes those returned values (`.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1558`), so a row whose command is accepted still carries the child's own `policy` and `ownerSkillId` into `commandLabel`. A subprocess row `{skill: "system-deep-loop", command: "/deep:review", policy: "run", ownerSkillId: "sk-code"}` renders as `use sk-code → /deep:review (run)`: the owner is another skill's name and the policy says the long run starts without asking, while the tracked table says `ask` and `system-deep-loop`. The comment beside `commandLabel` says the recommendation's own fields are authoritative because a caller that already resolved the command is never second-guessed; a subprocess row is exactly the caller that has not been resolved.
   - Finding class: `cross-consumer`
   - Scope proof: `skill-advisor-brief.ts`, `command-attach.ts`, `render.ts`, `skill-advisor-cli.ts`, the schema and the ownership test are all on `review-scope-files.txt`; the helper's return value, both consumers and the renderer were read at this revision, and the test at `.skilled/skills/system-skill-advisor/runtime/tests/brief-command-owner-check.vitest.ts:89` pins only the command's presence, never the policy or the owner.
   - Affected surface hints: `ownedCommandRecommendation`, `trackedCommandForOwner`, `commandLabel`, `policyWord`, the CLI degraded builder, the brief ownership test
   - Case: a fallback row that names a tracked `/deep:review` but says `policy: "run"` and `ownerSkillId: "sk-code"` reaches the brief; the reader sees a run-policy command attributed to the code skill, although NFR-S01 says both deep commands keep `ask` and the tracked table names `system-deep-loop`.
   - Fix direction: return `{ ...recommendation, ...trackedCommandForOwner(skill, command) }` (keeping the child's other fields), or at least override `policy` and `ownerSkillId` from the helper's return.
   - Claim adjudication:
     - `type`: `trusted_child_field_passthrough`
     - `claim`: the brief path checks the child's command string against the tracked table but keeps the child's policy and owner on an accepted row, so those fields can disagree with the table the check read.
     - `evidenceRefs`: `.skilled/skills/system-skill-advisor/runtime/lib/skill-advisor-brief.ts:191`, `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:313`, `.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1558`, `.skilled/skills/system-skill-advisor/runtime/lib/render.ts:232`, `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:76`
     - `counterevidenceSought`: checked whether the child's policy is validated elsewhere on the brief path (it is not; `passingRecommendations` filters only confidence and uncertainty), checked whether `commandLabel` ignores the recommendation's policy when a tracked row exists (it prefers the recommendation's field), and checked whether the CLI path shares the gap (it does not, because it uses the returned `typed.policy`).
     - `alternativeExplanation`: the child is the repository's own Python fallback, not a remote peer, so a forged policy needs a bug or a compromise below the gate; that is why this is filed as hardening rather than as an exploitable P1.
     - `finalSeverity`: P2
     - `confidence`: 0.88
     - `downgradeTrigger`: if `skill-advisor-brief.ts` documents that the child's policy and owner are intentional overrides, the finding becomes a test-coverage note on the ownership case.

## Traceability Checks

- `spec_code` — partial. The security-relevant requirements were mapped: REQ-030's 10,000-code-unit head at `.skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts:257` and `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:888`, which counts astral characters as two units the way JavaScript does; REQ-030's bounded windows at `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:799` and `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5210`; REQ-038's degraded-path check at `.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1558`; REQ-058's brief check at `.skilled/skills/system-skill-advisor/runtime/lib/skill-advisor-brief.ts:184`; NFR-S01's `ask` policy rows at `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:76`. REQ-031 and the rest of REQ-001 to REQ-053 remain unmapped in this lineage, so the protocol stays `partial`.
- `checklist_evidence` — partial. AC-061 and AC-066 were read against their symbols; the policy/owner gap is not covered by either row, and the ownership test's second case asserts the child's own `policy: "start"` and `ownerSkillId: "sk-doc"` survive, which is the behavior the finding qualifies. The task checklist is not complete yet.

## Integration Evidence

- Hook surface: `.skilled/skills/system-skill-advisor/runtime/lib/skill-advisor-brief.ts:479` is the brief producer the hook calls; its rows come from `runAdvisorSubprocess` and are not resolved by the CLI builder.
- CLI surface: `.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1558` consumes `typedCommandForOwner`'s returned policy, so the two consumers differ on the same question.
- Renderer surface: `.skilled/skills/system-skill-advisor/runtime/lib/render.ts:227` makes the recommendation's `policy` and `ownerSkillId` win over the generated row, which is the line the finding turns on.
- Command surface: `/deep:review` (`.skilled/commands/deep/review.md`) is the command whose `ask` policy NFR-S01 protects; no command file was changed.

## Edge Cases

- A row whose command is not tracked for its skill is stripped of `command`, `policy` and `ownerSkillId` by `ownedCommandRecommendation`, so the renderer cannot regress to a generated row for the skills this packet changes (`system-deep-loop` and `sk-code` have no `COMMAND_ROWS` entry).
- A row whose skill *is* a `COMMAND_ROWS` key (for example `command-deep-review`) can fall back to that row's command after the strip. The fallback command is a tracked command for that skill id, so it is not a forged command; the case is recorded here rather than filed.
- The head cap is applied to `routedPrompt` after `shouldFireAdvisor` has read the whole prompt; the policy decision is linear in the prompt length and the handler refuses a prompt over 10,000 units, so this is not a denial-of-service path. Recorded as a clean surface, not a finding.
- `LOOP_RUN_BY_PRONOUN` and the refusal grammar were re-read here for a security angle; no path lets prompt text select a command other than the tracked one.

## Confirmed-Clean Surfaces

- `.skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts:257` and `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:52` -- both caps are 10,000, and `_advisor_prompt_head` counts a surrogate pair as two units so the Python copy cannot hand the native schema a longer prompt than it accepts.
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:799` and `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5210` -- both lead windows are 400 characters and both search from the window bound, so the prefix scans are bounded rather than quadratic.
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:313` -- `trackedCommandForOwner` checks `Object.hasOwn(TRACKED_COMMANDS, command)` before reading the table, so an inherited key such as `__proto__` is not a tracked command.
- `.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1558` -- the degraded path uses the policy and owner the tracked table returns, so the CLI cannot print a child-supplied policy.
- `.skilled/skills/system-skill-advisor/runtime/lib/render.ts:163` -- `sanitizeSkillLabel` rejects line breaks, control characters and instruction-shaped labels before any label reaches the brief.

## Ruled Out

- "The Python gate reads more than the native schema accepts": ruled out. `_advisor_prompt_head` counts UTF-16 units and returns the prefix at 10,000, which is the same bound the zod schema enforces.
- "A long prompt with repeated refusals makes the Python gate quadratic": ruled out for the gate. The refusal leads are read through `_ends_before` on a 400-unit window, and the one unanchored clause search runs once per reading.
- "A child can forge a command the table does not track": ruled out. The brief strips the command when `trackedCommandForOwner` returns undefined, and the dropped fields are `command`, `policy` and `ownerSkillId`.
- "Prompt text can select a command other than the one the gate attaches": ruled out at the attach layer. `attachCommand` reads the command from the route's table and only decides whether to offer it; the prompt never supplies the string.
- "The `doctor` row can be forced by a stuck-run phrase": ruled out. The doctor row is withheld on a refused run (`isRunRefused`) and on a no-edit request, and the gate keeps the typed row only when the prompt typed it.

## Next Focus

- Dimension: maintainability
- Focus area: the thirteenth round's test and projection surfaces: the drift-guard tables, the brief ownership test, the reducer's unit cases, and the closure rows that describe them.
- Reason: the security pass found a test that pins the wrong half of the ownership contract; the next strongest risk is whether the guards and closure rows describe the tree that now exists.
- Rotation status: correctness and security done; traceability and maintainability remain.
- Blocked/productive carry-forward: productive -- the helper/consumer comparison produced the P2 without a test run; the two-copy head and window bounds were checked directly.
- Required evidence: file:line for each guard table, each new unit case, and each closure row the 13th round added.
- Recovery note: none.

Review verdict: CONDITIONAL
