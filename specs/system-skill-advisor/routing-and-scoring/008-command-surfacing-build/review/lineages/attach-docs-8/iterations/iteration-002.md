# Review Iteration 002

## Dispatcher

- Lineage: `attach-docs-8` (fan-out child, session `fanout-attach-docs-8-1794832880917-x4m8iz`)
- Area: `attach-docs` per `review/review-scope-8.txt`
- Dimension: traceability
- Operator review focus: followed `review/review-brief-8.txt`. This iteration reads the `CONTRIBUTING.md` net change against `origin/main` with the brief's command, checks each command the file names under `.skilled/commands`, and sweeps every `argument-hint` in the command tree against the matcher's suffix union. The scorer area stays with `scorer-8`; no recorded limit is re-reported.
- Steer channel: `steer.md` does not exist in this lineage.

## Files Reviewed

- `CONTRIBUTING.md` (36, 155), the branch's only net change [SOURCE: CONTRIBUTING.md:155]
- `.skilled/commands/create/sk-skill.md`, `.skilled/commands/create/skill-parent.md`, `.skilled/commands/create/command.md`, `.skilled/commands/create/agent.md` (the four create commands the changed line names) [SOURCE: .skilled/commands/create/sk-skill.md:1]
- `.skilled/commands/doctor/setup.md`, `.skilled/commands/doctor/mcp.md` (the other two commands the file names) [SOURCE: .skilled/commands/doctor/setup.md:1]
- `.skilled/commands/*/**.md` argument hints (46 files, sweep) [SOURCE: .skilled/commands/speckit/plan.md:3]
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts` (211, 224-244) [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:211]

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
| `spec_code` | pass | The `CONTRIBUTING.md` net change is the one-line rename `origin/main`'s `/create:skill` to `/create:sk-skill`. All six commands the file names exist under `.skilled/commands` (`create/sk-skill.md`, `create/skill-parent.md`, `create/command.md`, `create/agent.md`, `doctor/setup.md`, `doctor/mcp.md`), and the old `create/skill.md` is absent, so the file does not name a retired file. The matcher's suffix set equals the documented union exactly: 46 argument hints carry 26 `:auto`, 25 `:confirm`, 3 `:autopilot`, 3 `:unattended`, 2 `:with-context`, 2 `:with-phases` and 1 `:with-research`, with no token outside the set. [SOURCE: CONTRIBUTING.md:155] [SOURCE: .skilled/commands/create/sk-skill.md:1] [SOURCE: .skilled/commands/speckit/plan.md:3] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:211] |
| `checklist_evidence` | notApplicable | The target is a phase-parent packet with no `checklist.md`; the pass-eight brief and scope file are the operative checklist. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/spec.md:1] |

## Integration Evidence

- `git -c core.fsmonitor=false diff origin/main HEAD -- CONTRIBUTING.md` is one hunk at `:155`; `git show origin/main:CONTRIBUTING.md` carries `/create:skill` at the same line. The reviewed blob carries the new name and no other stale occurrence of the old name. [SOURCE: CONTRIBUTING.md:155]
- The four create commands the changed paragraph names are tracked by the advisor's generated table (`/create:sk-skill`, `/create:skill-parent`, `/create:command`, `/create:agent`), so the renamed documentation and the live command rows agree. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:124]
- The comment's claim that the argument hints say which commands take which is supported by the documents: `complete.md` advertises all three `:with-*` modifiers, `plan.md` advertises `:with-context` and `:with-phases`, and `implement.md` advertises only the four mode suffixes. [SOURCE: .skilled/commands/speckit/complete.md:3] [SOURCE: .skilled/commands/speckit/plan.md:3] [SOURCE: .skilled/commands/speckit/implement.md:3]

## Edge Cases

- The 46-file sweep counts `:with-research` once (`complete.md`) and `:with-phases` twice (`complete.md`, `plan.md`), so the three `:with-*` alternatives are each documented somewhere even though no command documents all three plus every mode suffix.
- The `CONTRIBUTING.md` paragraph also names `/doctor:setup` and `/doctor:mcp install`; both resolve (`doctor/setup.md`, `doctor/mcp.md`), and the `install` word is the `mcp.md` sub-action, not a command file.
- A suffix followed by a file extension still reads as the command; the recorded limit stands and no new input breaks it. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:211]

## Confirmed-Clean Surfaces

- The changed sentence carries the new command name and no stale `/create:skill` remains in `CONTRIBUTING.md`. [SOURCE: CONTRIBUTING.md:155]
- The create group index also lists `/create:sk-skill` and `/create:skill-parent`, so the `CONTRIBUTING.md` rename matches the command catalog. [SOURCE: .skilled/commands/create/README.txt:57]
- The retired-name mapping still resolves `/create:skill` to `/create:sk-skill`, so a reader who follows an older post reaches the live workflow. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:217]

## Ruled Out

- A missing command name in `CONTRIBUTING.md`: each of the six names resolves to a file, and the six covered include the two doctor commands outside the changed line.
- A documented suffix the matcher refuses: the sweep of all 46 argument hints found no token outside the seven-word set, the same union phase 038's `spec_code` check recorded.
- A stale old-name surface in the changed file: `CONTRIBUTING.md` has no `/create:skill` occurrence left, and the old `create/skill.md` file is gone.

## Next Focus

- Dimension: security
- Focus area: the matcher's trust boundary (prompt text into regexes, the retired map, the no-edit gate interplay) and the documentation change's inertness.
- Reason: traceability is clean; security is the remaining lens that could change the verdict.
- Rotation status: correctness and traceability complete; security and maintainability remaining.
- Blocked/productive carry-forward: none blocked; direct file existence checks and the argument-hint sweep were productive.
- Required evidence: no prompt-controlled text compiled into a pattern; every change is inert text.

Review verdict: PASS
