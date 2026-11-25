# Iteration 7: Phases 009-skills and 012-manual-testing-scenarios — the proposal path and the scenario corpus

## Focus
Whether 009's skill loading and proposal review are planned deeply enough to one-shot, and whether 012's 33-scenario corpus is a real proof or prose. 012 is the packet's only end-to-end evidence, so its contract with the phases it proves matters as much as its own files.

## Actions Taken
1. Read `009-skills/spec.md:95-175` (scope, 25 files to change, REQ-001..REQ-011).
2. Read `012-manual-testing-scenarios/spec.md:1-60` (metadata, phase context, dependencies, deliverables) and `:168-200` (the scenario inventory tail and REQ-001..REQ-010).
3. Read the full 33-row scenario inventory at `012/spec.md:140-170`.
4. Grepped `needs-you.ts` for the item shape and any `kind` field, and grepped every phase spec for who adds `kind` to the item.
5. Read `005-memory/spec.md:152-154` and `:265` for the recorded decision on the item's `kind` and the sentinel, and `014-deep-review/spec.md:3,41,53` for what runs after 012.

## Findings

1. **P1 — the skill-name grammar is referenced three times and defined nowhere.** `009/spec.md:122` ("the name grammar" as `skills.ts`'s first responsibility), `:138` (a unit test for "the name grammar"), and `:172` (REQ-008 refuses "a name outside the skill-name grammar" as `skills-name-invalid`). No allowed characters, length bound or leading-character rule is stated. Lower severity than 008's equivalent because a skill name is also a folder name under `.skilled/skills/`, so the existing tree supplies examples a builder can imitate — but the loader joins the name onto a path, so the grammar is also the traversal guard, and `skills-name-invalid` cannot be implemented without it. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:172] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:122]

2. **P1 — `bots skill propose <run-id>` with no `--name` has no stated default.** REQ-004 writes the flag as optional and never says what the target skill name is when it is absent: the bot id, a name derived from the run, or a refusal. The target path recorded in `proposal.json` and the review item's question both depend on the answer, so the omission propagates into two artifacts. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:163]

3. **P1 — 005 and 009 contradict each other on whether 009 reserves a second sentinel.** 005's recorded decision says "009 sets `kind` to `skill-proposal` and adds no id of its own" (`005-memory/spec.md:265`), while 009's REQ-005 sets the item's `botId` to "the reserved `skill-proposals`" and 009's files table adds `skill-proposals` to `RESERVED_BOT_IDS` (`009/spec.md:130`). Both cannot hold. A builder who follows 009 contradicts the packet's own decision record; a builder who follows 005 leaves the item's `botId` naming a sentinel no definition is barred from taking. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:265] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:164] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:130]

4. **P1 — `proposal.json`'s five fields are prose, not keys, and `revisionRead` is ambiguous.** REQ-004 names "the target path, the revision read, the run id, the bot id and the creation instant" with no key names, no version field and no statement of what the revision holds. REQ-006 then compares "a target whose current digest differs from `revisionRead`", which implies the field holds a digest, while its name says revision — a git revision and a body digest are different values and only one makes the stale check work. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:163] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:165]

5. **P2 — the draft `SKILL.md`'s own shape is unstated.** `proposal.json` is specified field by field; the draft beside it is not. Nothing says the draft carries frontmatter, satisfies the skill package validator, or follows a template, so a builder writes free prose and the operator receives a file that may not load as a skill at all. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:163]

6. **P1 — 012 can close with 33 recorded FAILs.** REQ-006 requires every `FAIL` to be "fixed in the scenario or filed as a defect naming the phase, the requirement and the observed line, and no `FAIL` is left unnamed" — naming is the whole obligation. The phase's handoff criteria are "every row in `acceptance-criteria.md` is Met", and those rows assert that scenarios were written and executed, not that they passed. So the packet's only end-to-end proof can record that the build is broken and still close. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/012-manual-testing-scenarios/spec.md:181] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/012-manual-testing-scenarios/spec.md:30]

7. **P2 — the scenario inventory names the phase and the requirement per scenario but no fixture or precondition.** The 33-row table at `012/spec.md:140-170` is the packet's best traceability artifact — id, category, owning phase, the requirement line it proves — but a scenario file read alone does not say which bot, state root or stub executor it needs; REQ-007 puts preconditions in the root index instead. That is a defensible split, and it means the per-scenario file is not self-contained. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/012-manual-testing-scenarios/spec.md:140] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/012-manual-testing-scenarios/spec.md:186]

8. **P1 — 012's recorded results go stale before the packet closes, and nothing requires a re-run.** 012 runs after 011 and before 013 and 014; 014 is defined as "an expanded deep review over every code and doc phase 001 to 013 built ... with every P0 and P1 fixed and the affected tests re-run" (`014/spec.md:3`, `:41`, `:53`). So the corpus executes against a build that 014 then changes, and no requirement in 012 or 014 says the corpus is re-executed after a fix. The packet's end-to-end evidence is therefore a snapshot of a superseded build. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/014-deep-review/spec.md:3] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/014-deep-review/spec.md:41] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/012-manual-testing-scenarios/spec.md:30]

## Ruled Out
- Reading 012 as under-planned. It has a 33-row inventory with a requirement citation per row, a package validator as its gate, a single writer for the run folder (`record-playbook-run.cjs`), a FAIL-handling requirement, a SKIP rule for a missing channel account, and a wave plan. It needs no child phase; it needs two rules added (findings 6 and 8).
- Reading 009 as needing a phase parent. Its 25 files are one loader plus one proposal path, and its caps, overflow rule, wrapper format and digest chain are all pinned. The gaps are four additions to the existing documents.

## Dead Ends
- Looking for a `kind` field on `NeedsYouItem` today: `needs-you.ts:29-48` has no such field and `ITEM_KEYS` does not list it, so 005's REQ-009 is what introduces it. That confirms the field is 005's to define and makes finding 3 a contradiction between two phases rather than a missing field.
- Looking for a skill-name grammar in `bot-check.cjs` to cite: the checker has no name-grammar helper, so 009 has nothing to reuse.

## Edge Cases
- Ambiguous input: none. Both phases name their files and refusals.
- Contradictory evidence: finding 3 — 005's decision record and 009's REQ-005 disagree on the sentinel. Both sides cited; unresolved, and the resolution is a one-line edit to whichever document the operator prefers.
- Missing dependencies: none.
- Partial success: none. All five research actions returned evidence.

## Questions Answered
- Is 009 planned deeply enough to one-shot? No — one P1 grammar gap, one P1 default gap, one P1 cross-phase contradiction, one P1 schema gap.
- Is 012 planned deeply enough to one-shot? Nearly — it needs a FAIL-blocks-close rule and a re-run rule after 014, and no child phase.

## Questions Remaining
- Whether 013 and 014 have the same "closes without proving anything" shape as 012's FAIL rule.
- Whether the packet has any phase that owns the refusal-name registry, since 008 and 009 both mint names in three document layers.

## Sources Consulted
- specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:95-175
- specs/system-skilled-bots/003-openbot-parity-build/012-manual-testing-scenarios/spec.md:1-60, :140-200
- specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:152-154, :265
- specs/system-skilled-bots/003-openbot-parity-build/014-deep-review/spec.md:3, :31, :41, :53
- .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:29-48, :51, :97, :263-297
- .skilled/skills/system-skilled-bots/scripts/bot-check.cjs (no name-grammar helper)

## Assessment
- New information ratio: 0.88
- Questions addressed: 009's and 012's one-shot readiness; the cross-phase ownership of the item's `kind` and sentinel; the corpus's contract with 014.
- Questions answered: both.

## Reflection
- What worked and why: grepping every phase spec for `kind` and `ITEM_KEYS` at once. That single search turned a suspected missing field into a documented contradiction between 005's decision record and 009's requirement, which is a stronger and more actionable finding.
- What did not work and why: assuming 012's FAIL rule was absent. REQ-006 covers it; the real gap is that naming a FAIL satisfies the rule, which only showed up after reading the handoff criteria beside it.
- What I would do differently: read the handoff criteria of every phase first. Both of this iteration's structural findings (6 and 8) came from comparing a phase's obligations to its close condition rather than from its requirements.

## Recommended Next Focus
Phases 013-skilled-and-doc-alignment and 014-deep-review: whether the two closing phases can actually prove the packet, and whether 014's five-lineage review has a defined input, a merge rule and a fix-verification loop.
