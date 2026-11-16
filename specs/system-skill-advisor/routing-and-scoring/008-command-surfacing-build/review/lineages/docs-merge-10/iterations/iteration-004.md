# Review Iteration 004

## Dispatcher

- Lineage: `docs-merge-10`, area `docs-merge`.
- Review target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build` (spec-folder).
- Focus: correctness and traceability, run as the recovery pass after `convergence.cjs` returned `STUCK_RECOVERY` at iteration 3. The recovery changes the unit of evidence from file-level claim checks to token-level checks of the changelog's suffix rules, because the filenames and counts were already exhausted.
- `steer.md` does not exist in the lineage directory, so no lead ruling applied.
- The holdout rule and the recorded limits were honoured exactly as in the earlier iterations.

## Files Reviewed

| File | Lines read | What was checked |
|------|-----------|------------------|
| `.skilled/skills/system-skill-advisor/changelog/v1.1.0.0.md` | 92-106 | Every sentence of "Brief Commands": deep-loop naming, file-name rule, mode suffix rule, retired name |
| `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts` | 208-245 | `COMMAND_START_BOUNDARY`, `COMMAND_CONTINUATION`, `MODE_SUFFIX`, `RETIRED_COMMANDS` and `typedCommandIn` |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts` | 425-495 | The typed-command cases that pin the suffix and retired-name behaviour |
| `.skilled/skills/system-skill-advisor/README.md` | 176 | The 47-row sentence as a carried-clean control |

## Findings - New

### P0 Findings

None.

### P1 Findings

None new. Carried active: F001.

### P2 Findings

1. **The suffix list in the changelog is narrower than the parser** -- `.skilled/skills/system-skill-advisor/changelog/v1.1.0.0.md:102` -- The sentence names `:auto`, `:confirm` and `:autopilot`, then says "Any other suffix reads as no command." `MODE_SUFFIX` at `command-attach.ts:210` also accepts `:unattended` and the chained `:with-context`, `:with-phases` and `:with-research` modifiers, and the guard test asserts both `/speckit:implement:unattended` and `/speckit:complete:with-context` resolve to their commands (`command-attach-guards.vitest.ts:453,458`). The documented rule is therefore false for five accepted suffixes.
Finding class: doc-claim-accuracy
Scope proof: The changelog sentence, the `MODE_SUFFIX` regex and the two test expectations were read at HEAD; the regex's alternation is `auto|confirm|autopilot|unattended|with-(context|phases|research)`.
Affected surface hints: `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts`, `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts`
Case: A reader types `/speckit:implement:unattended the login spec`; the advisor attaches `/speckit:implement`, although the changelog says any suffix outside `:auto`, `:confirm` and `:autopilot` reads as no command.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | notApplicable | No spec implementation surface maps to this docs area. |
| `checklist_evidence` | notApplicable | No `checklist.md`; the brief and scope file are the checklist. |
| `skill_agent` | pass | The sk-doc hub and router still name `/create:sk-skill`; no change in this iteration. |
| `agent_cross_runtime` | pass | The runtime adapter set is unchanged; the Vibe adapter still proxies the shared handler. |

## Integration Evidence

- **Suffix parser:** `MODE_SUFFIX` at `command-attach.ts:210` matches `:auto`, `:confirm`, `:autopilot`, `:unattended` and the three `:with-*` words, in any chain, and only when the suffix ends the name.
- **Suffix tests:** `command-attach-guards.vitest.ts:453` expects `/speckit:implement:unattended the login spec` → `/speckit:implement`; `:458` expects `/speckit:complete:with-context the login spec` → `/speckit:complete`.
- **File-name rule:** `:430` expects `see /create:sk-skill.md for details` → undefined, matching the changelog's file-name sentence.
- **Retired name:** `RETIRED_COMMANDS` maps only `/create:skill` → `/create:sk-skill`, and `:483-493` cover the live and path cases, matching the changelog.
- **Recovery event:** `deep_review.recovery_started` was recorded for iteration 3 through the gateway; `convergence.cjs` resets `stuckCount` on that row.

## Edge Cases

- Recovery mode: the unit of evidence changed from files and counts to the parser's token rules; the iteration is a new read, not a repeat of the earlier claim sweep.
- The suffix sentence is a documentation defect only; the parser's permissiveness is intentional, and the test pins it.
- The `:with-*` suffix list lives in `MODE_SUFFIX` and in the `command-attach.ts` comment, but not in the changelog; the fix is to widen the sentence, not to narrow the parser.
- No new security surface; the changed file is prose.

## Confirmed-Clean Surfaces

- **File-name rule:** `/create:sk-skill.md` reads as no command.
- **Retired name:** `/create:skill` reads as `/create:sk-skill`, and a path such as `docs/create:skill.md` does not.
- **Deep-loop naming:** the changelog's `/deep:review` vs `/deep:research` sentence matches the depth-wording gate.
- **README row count:** unchanged and exact at 47.

## Ruled Out

- **A wrong file-name rule:** the test and regex agree.
- **A wrong retired-name mapping:** only the one retired key exists.
- **A parser that accepts any suffix:** the regex rejects a suffix outside its alternation, so the defect is the doc's narrower list, not an open parser.

## Next Focus

- Dimension: traceability
- Focus area: the remaining "Command Fit" and "No-Edit Prompts" sentences as token-level claims
- Reason: the recovery pass found one doc-claim mismatch in "Brief Commands"; the same token-level method has not yet been applied to the neighbouring sections
- Rotation status: correctness and traceability covered; security and maintainability swept
- Required evidence: one parser or gate read per sentence, plus a test or concrete input
- Recovery note: this iteration is itself the recovery pass for the iteration-3 stuck decision

Review verdict: CONDITIONAL
