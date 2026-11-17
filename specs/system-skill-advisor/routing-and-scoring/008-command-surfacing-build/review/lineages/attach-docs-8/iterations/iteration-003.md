# Review Iteration 003

## Dispatcher

- Lineage: `attach-docs-8` (fan-out child, session `fanout-attach-docs-8-1794832880917-x4m8iz`)
- Area: `attach-docs` per `review/review-scope-8.txt`
- Dimension: security
- Operator review focus: followed `review/review-brief-8.txt`. This iteration treats the matcher as a trust boundary: prompt text enters `typedCommandIn`, the retired map and `commandOnlyMentioned`, and the documentation change is inert text. The scorer area stays with `scorer-8`; no recorded limit is re-reported.
- Steer channel: `steer.md` does not exist in this lineage.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts` (211 constant, 221-245 matcher, 243 retired map, 351 no-edit pattern, 417-445 mention guard, 484-497 attach gate) [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:211]
- `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts` (435-484) [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:455]
- `CONTRIBUTING.md:155` (inert text change) [SOURCE: CONTRIBUTING.md:155]

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | pass | NFR-R01 requires every gate to fail toward no offer. The suffix branch only widens recognition of a typed command; it does not touch the no-edit gate, the owner check or the mention guard. A suffix-bearing no-edit prompt still returns no command. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/spec.md:1] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:486] |
| `checklist_evidence` | notApplicable | The target is a phase-parent packet with no `checklist.md`; the pass-eight brief and scope file are the operative checklist. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/spec.md:1] |

## Security Checks

- No prompt text is compiled into a pattern in the changed code. `MODE_SUFFIX` is a constant, `RETIRED_COMMANDS` is a constant table, and `commandOnlyMentioned` escapes the command phrase with `escapePhrase` before building its pattern. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:211] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:424]
- The suffix branch changes only the boundary decision after a recognised command. The no-edit gate runs before it and still wins: `attachCommand('sk-doc', SINGLE('sk-create-skill'), 'run /create:sk-skill:auto make a skill called x, do not change anything yet')` returns `undefined`. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:486]
- The retired map is a fixed two-entry object and rewrites only an exact typed name; it cannot be steered by prompt text and returns no command for a path-shaped occurrence. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:217]
- The changed documentation line is inert prose; it adds no executable instruction, link target, or credential surface. [SOURCE: CONTRIBUTING.md:155]
- The suffix tests import only `vitest` and the matcher module; they add no fixture path, network call or environment read. [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:12]

## Integration Evidence

- The typed-command owner gate runs after the suffix is consumed, so a suffix cannot make a command attach to a hub that does not own it: `/create:sk-skill:auto` attaches only to `sk-doc`. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:258]
- The deep-loop gate still requires the typed command to be the one being attached or depth wording; `/deep:review:auto` qualifies through the typed branch, while another deep-loop command does not. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:513]

## Edge Cases

- A retired name typed in a question or refusal still attaches its successor, because the typed name resolves before the mention guard reads the live name. The packet records this as an accepted limit of phase 020 (`spec.md` edge cases and decision P045), so it stays out of the active findings; iteration 3 reproduced it only to confirm no new input breaks the accepted boundary. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/020-command-offer-fit-guards/spec.md:242]
- A suffix followed by a file extension still reads as the command; the recorded limit stands and is not re-reported. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:211]
- `isNoEditRequest` is not consulted by `typedCommandForTop`, only by `attachCommand`. That split predates this branch and the typed path still carries the command's own `ask`/`start` policy, so it is not a new exposure from the suffix change. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:256]

## Confirmed-Clean Surfaces

- `escapePhrase` escapes every metacharacter class before a command phrase becomes a pattern, so a command name cannot inject a group or an assertion. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:316]
- `commandOnlyMentioned` normalises the prompt and then tests leads and or-lists against the escaped name; the suffix colon is outside its lookahead class, so the mention guard still sees a suffixed command as the same command. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:417]
- The matcher's only environment-adjacent input is the prompt string; the module imports nothing and performs no file, process or network access. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1]

## Ruled Out

- A prompt-controlled regex injection through the suffix path: the suffix pattern is a constant and no prompt substring is interpolated into it.
- A suffix that escapes the no-edit gate: the gate is consulted first and a suffix-bearing no-edit prompt returns no command.
- A suffix that promotes a non-owner command: the owner check runs after `typedCommandIn` returns the mapped name, and a non-owner top skill still withholds it.
- A new exposure from the retired map: the map is fixed data and the accepted limit covers its mention-guard behavior.

## Next Focus

- Dimension: maintainability
- Focus area: the comment's accuracy against the tests, the `:with-phases` test gap, and the documentation quality of the changed `CONTRIBUTING.md` sentence.
- Reason: security is clean; maintainability is the last uncovered dimension and the place the reworded comment and its tests belong.
- Rotation status: correctness, traceability and security complete; maintainability remaining.
- Blocked/productive carry-forward: none blocked; the no-edit probe and the constant-table read were productive.
- Required evidence: every claim in the comment has a matching test, or the gap is recorded with its reach.

Review verdict: PASS
