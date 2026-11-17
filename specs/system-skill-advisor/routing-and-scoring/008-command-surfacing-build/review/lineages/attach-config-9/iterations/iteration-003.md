# Review Iteration 003

## Focus

- Dimension: maintainability (the cross-reference pass completed the protocol comparison in the same iteration; the result is recorded under the protocol table below, and the finding is a maintainability finding)
- Files: the four area files, with the changed matcher and its boundary suite as the finding's evidence.

## Dispatcher

- Lineage: `attach-config-9` (fan-out child, session `fanout-attach-config-9-1794835877856-5ghgm4`)
- Area: `attach-config` per `review/review-scope-9.txt`
- Dimension: traceability and maintainability (cross-reference pass, selected in the strategy's next focus)
- Operator review focus: `review/review-brief-9.txt` governs. This iteration takes the brief's third subject, "the tests that pin child or parent sessions", and its demand that every scope file be reviewed under at least two dimensions: the four files now carry correctness, security and this pass. It also completes the brief's traceability duty -- compare the accepted suffix set with the command documents and the packet's own record, then judge whether the branch's boundary decisions are held by tests. Holdout rule honoured: no prompt store opened, no `--summary`, no CLI session text, no hook-flags file.
- Steer channel: `steer.md` still does not exist in this lineage folder.
- Sources read: `review/review-brief-9.txt`; `review/review-scope-9.txt`; the whole of the four area files at `05f776202e0`; every `argument-hint:` line under `.skilled/commands` (46 files); `speckit/{plan,complete,implement}.md` and `deep/review.md` argument hints and input tables; `goal.md:206,360-378`; `decision-record.md:65`; `spec.md:172`; `runtime/lib/scorer/text.ts:40-50`; `runtime/scripts/routing-accuracy/score-command-transcripts.mjs:608-640`; `runtime/scripts/skill_advisor.py:2997-3009`.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts` (197-244 matcher, 465-536 gate) [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:211]
- `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts` (414-470) [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:455]
- `.skilled/skills/system-skill-advisor/runtime/vitest.config.ts` (8-35) [SOURCE: .skilled/skills/system-skill-advisor/runtime/vitest.config.ts:27]
- `.skilled/skills/system-skill-advisor/runtime/tests/doctor-brief-render.vitest.ts` (60-100) [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/doctor-brief-render.vitest.ts:92]

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The suffix chain's leading anchor has no test behind it** -- `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:455` -- The matcher accepts a chain only where it starts immediately after the command name, because `MODE_SUFFIX` is anchored with `^`. Every existing negative case in the suite fails on the trailing lookahead instead: `:automation`, `:draft`, `:with-everything` and `:auto:draft` are refused by the `(?![a-z0-9_:-])` lookahead whether or not the pattern is anchored. An edit that dropped the `^` would keep the whole suite green while accepting `/speckit:complete:draft:auto` as `/speckit:complete`.
   - Finding class: missing boundary regression coverage in a changed matcher (`maintainability`)
   - Scope proof: the pattern, its comment and the boundary suite are the area's own changed surface; the evidence is the suite file at the exact test that covers unknown suffixes.
   - Affected surface hints: `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:211`, `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:459`
   - Case: a prompt reads `/speckit:complete:draft:auto the login spec`. Today the matcher returns `undefined`; with the leading anchor removed it would return `/speckit:complete`, and no assertion in `command-attach-guards.vitest.ts` would fail.

   Reproduction, run against the two shapes with the source pattern and the suite's own negative inputs:

   ```
   input                     anchored   unanchored
   ":automation notes"       no-suffix  no-suffix
   ":draft"                  no-suffix  no-suffix
   ":with-everything now"    no-suffix  no-suffix
   ":auto:draft now"         no-suffix  no-suffix
   ":draft:auto"             no-suffix  suffix        <- only case that discriminates
   ":phase-2:with-research"  no-suffix  suffix        <- only case that discriminates
   ```

   End-to-end against the area source: `/speckit:complete:draft:auto` -> `undefined`, `/speckit:complete:phase-2:with-research` -> `undefined`. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:211] [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:455]

   Why it is P2 and not P1: the shipped behavior is correct, so no reader is misled today. The defect is that the branch's second boundary decision (a chain must abut the name) has no failing assertion, which is the difference between a decision and an accident for the next editor.

   Claim adjudication:
   ```json
   {"type":"claim","claim":"An unanchored suffix search would pass every current negative test while accepting a chain that does not start at the command name, so the leading-anchor property is untested.","evidenceRefs":["command-attach.ts:211","command-attach-guards.vitest.ts:455","command-attach-guards.vitest.ts:459"],"counterevidenceSought":"Compared the anchored and unanchored pattern against all four existing negative inputs and against the end-to-end matcher; only a chain behind an unknown leading segment separates them. Also checked whether another test pins an unanchored rejection, such as a path or extension case; none contains a colon-separated suffix after a non-suffix segment.","alternativeExplanation":"The anchor may be considered self-evident from the `^` in the source and therefore not worth a test. That is a style judgement, not coverage: the assertions are what a future edit is checked against.","finalSeverity":"P2","confidence":"high","downgradeTrigger":"P2 is the lowest active tier. If a later matcher refactor makes the chain search unanchored and a stored transcript types a command with an unknown leading segment, the consequence becomes a misread command and this should be raised to P1 on that evidence."}
   ```

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | pass | The accepted vocabulary is exactly the union of the `argument-hint` suffixes under `.skilled/commands`: `:auto` in 26 files, `:confirm` in 25, `:unattended` in 3, `:autopilot` in 3, `:with-phases` in 2, `:with-context` in 2, `:with-research` in 1. No documented suffix is refused and no undocumented one is accepted. The documents classify the `:with-*` forms as workflow inputs on the same command (`speckit/complete.md:46-48`, `speckit/plan.md:46-47`), which is what the matcher reads them as. [SOURCE: .skilled/commands/speckit/complete.md:3] [SOURCE: .skilled/commands/speckit/plan.md:3] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:211] |
| `checklist_evidence` | notApplicable | The phase-parent packet has no `checklist.md`; the review's closure is the area files and the packet's goal rows. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/spec.md:1] |
| `skill_agent` | notApplicable | No skill definition or agent file is in this area's scope; the area is one runtime module, its config and two test files. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/review-scope-9.txt:5] |
| `agent_cross_runtime` | notApplicable | The matcher lives in the TypeScript runtime only; the mirrors named by the skill (`dist/runtime/lib/command-attach.js`) are build output of the same source, not a second agent definition. [SOURCE: .skilled/skills/system-skill-advisor/runtime/dist/runtime/lib/command-attach.js:186] |
| `feature_catalog_code` | notApplicable | No feature catalog entry is in scope for this area. |
| `playbook_capability` | notApplicable | No playbook entry is in scope for this area. |

The packet's own record was compared with the diff. `goal.md:206` records D-01 as `:auto`, `:confirm` and `:autopilot` reading as the command; `goal.md:365` records CRIT-4 as the `:unattended`, `:with-*` and chained-suffix extension; the diff implements exactly that, and the pins in `command-attach-guards.vitest.ts:435-453` cover each added form. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/goal.md:365]

## Integration Evidence

- Prior pass residue, resolved: the transcript scorer's `commandParts` now strips the same set, including the `:with-*` forms and a chain, so the P2 the previous pass raised in this area no longer holds. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:613]
- The scorer's pattern is end-anchored (`...$`) while the matcher's is name-anchored, so the two agree on a command-only string such as `/speckit:complete:with-research` and can differ when a route follows the command. The scorer's `commandParts` splits the route off after the name, which keeps the ordinary `COMMAND: /x:with-research → started` form aligned; the residual asymmetry is named here and left to the scorer's own area. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:622]
- Two tokenizer copies still strip only execution-mode suffixes (`lib/scorer/text.ts:45`, `scripts/skill_advisor.py:2997`). The previous pass considered and set aside keeping `:with-*` words in prompt tokenization as a separate choice, so this pass records it as a known asymmetry rather than a new finding. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/text.ts:45]
- The child/parent pins match the ADR the packet records: a dispatched child sees a surfaced command marked parent-named only unless it is a read-only run command, which is exactly what `doctor-brief-render.vitest.ts:76-84` asserts on both sides. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/decision-record.md:65]
- The build output carries the same pattern as the source, so a shipped consumer sees the chain without a rebuild gap. [SOURCE: .skilled/skills/system-skill-advisor/runtime/dist/runtime/lib/command-attach.js:186]

## Edge Cases

- The chain accepts a run of mode segments that no document advertises, such as `/deep:review:auto:confirm`, and resolves it to the command. That is lenient by design: the pattern answers "does this name the command", not "is this a legal argument list", and the command's own parser still sees the raw suffix. Recorded, not raised. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:211]
- The accepted extension-adjacent read (`/speckit:plan:with-phases.md` -> `/speckit:plan`) is recorded in the packet and remains unpinned by a test. This pass does not raise it, because the brief forbids re-reporting a recorded limit and the behaviour itself is unchanged; the missing pin is noted so a future pass that reopens the limit has the observation. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/goal.md:370]
- The added `:unattended` acceptance makes the matcher agree with `lib/scorer/text.ts:45` and `scripts/skill_advisor.py:2997` on that segment, so this branch narrows one asymmetry while it widens another. That is a net improvement on the documented set. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/text.ts:45]
- A doctor command whose tracked key embeds a subcommand accepts a suffix after the subcommand (`/doctor:env list:auto` -> `/doctor:env list`), which is consistent but worth knowing before a future key gains a trailing word.
- The `delete process.env.AI_SESSION_CHILD` is invisible to a reader of the test files: a test that asserts the child shape without stubbing would depend on a line three files away. The sweep in iteration 2 found no such test, so it is a placement note, not a defect. [SOURCE: .skilled/skills/system-skill-advisor/runtime/vitest.config.ts:27]

## Confirmed-Clean Surfaces

- Every documented suffix is accepted on every tracked command, including chained forms and the `:unattended` segment, and no undocumented segment is accepted. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:211]
- The command documents agree with the matcher on the `:with-*` forms being workflow inputs of one command rather than new commands. [SOURCE: .skilled/commands/speckit/complete.md:46]
- The prior pass's transcript-parser divergence is closed in the scorer's current parser. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:613]
- Both child and parent brief shapes are asserted, and the one test that needs the parent shape now says so explicitly instead of leaning on the ambient environment. [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/doctor-brief-render.vitest.ts:92]
- Every scope file has now been reviewed under at least two dimensions: correctness and security for all four, plus traceability and maintainability here. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:211]

## Ruled Out

- A missing documented suffix: the 46-file sweep found none; the matcher's set is the complete union. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:211]
- A per-command vocabulary requirement in the packet: no requirement narrows the suffix set per command, and the rewritten comment now states the shared-set rule instead of claiming per-command documentation. The previous pass's P2 on that comment is therefore resolved by the diff. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:206]
- Re-reporting the recorded file-extension limit as a behaviour defect: not repeated; no new input breaks the record. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/goal.md:370]
- A spec contradiction in `spec.md`: the only command-related criterion is that no typed command is ambiguous with its own owner, which `typedCommandForTop`'s ownership gate still enforces. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/spec.md:172]

## Next Focus

- Dimension: all four (confirmation pass)
- Focus area: re-read every scope file against the finding above, confirm the coverage graph and registry agree with the narrative, and decide the terminal stop.
- Reason: full dimension coverage arrives in this pass, so the stop needs one more evidence record before the coverage-age signal matures.
- Rotation status: correctness, security, traceability and maintainability all covered; this pass is the confirmation record.
- Blocked/productive carry-forward: the diff-and-document sweep and the anchored-versus-unanchored comparison stayed productive; nothing blocked.
- Required evidence: confirmation that the single P2 is the only active finding and that no scope file was left unreviewed.
- Recovery note: not in recovery.

Review verdict: PASS
