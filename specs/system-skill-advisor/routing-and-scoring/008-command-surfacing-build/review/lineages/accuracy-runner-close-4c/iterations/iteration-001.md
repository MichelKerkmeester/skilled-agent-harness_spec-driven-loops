# Review Iteration 1

- Mode: review
- Lineage: `accuracy-runner-close-4c`
- Run: `fanout-accuracy-runner-close-4c-1794682797954-pcdanq`
- Iteration: 1 of 2
- Dimension: correctness and security
- Budget profile: verify (11-13 read actions)
- Sources read: `review-brief-4c.txt`, `review-scope-4c.txt`, `review/verify-4/report.md`,
  `027-review-pass-four-remediation/scratch/review-rounds.txt`, `027` task rows, the iteration-1
  strategy, `steer.md` (absent)

## Dispatcher

`/deep:review` fan-out lineage `accuracy-runner-close-4c`. The closing round checks the 4c fix
range `48f03b5013..868b185e76` and the pass-four fixes this area's code already carries. The
changed accuracy-runner path in the scope file is the routing-accuracy `README.md`; the brief's
checks name the run-log writers, the transcript scorer, the Codex reader and the holdout guard as
verification surfaces. The mention reader is the sibling lineage's surface and is read only as
context.

Operator focus addressed: the correctness and security half of the 4c checks — both writers keep
`offeredAs`, the heredoc end word, the shell-read start, the Codex resolved read and the live
holdout guard.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-offer.mjs:414-508`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs:815-826,1170-1206`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:640-694,910-930`
- `.skilled/hooks/shared/session-readers/codex.mjs:142-190`
- `.skilled/skills/system-skill-advisor/runtime/tests/command-routing-slice.vitest.ts:130-215`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md:63-85,120-126,185-188`

Context reads: `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:373-380,422-439`
and `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:158-179` for
the sibling or-list check; `027-review-pass-four-remediation/tasks.md:84-110` for the fix evidence.

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **A `2>` or `&>` redirect target that names a command document still counts as a start** -- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:677` -- `shellReadTargets` clears the candidate only when a word starts with `>`. `2>` and `&>` are redirect operators that do not start with `>`, so a target ending in `.md`, `.yaml` or `.yml` after either one is pushed as a read target. Since `readDocument` now treats a shell target that tails a command document as a start (`:922`), a reader command whose only relation to the document is a redirect is counted as a start. The brief's redirect check is therefore met for `>` but not for these two forms. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:677]
   Finding class: correctness
   Scope proof: `score-command-transcripts.mjs` is a named verification surface in the 4c brief; the shell branch at `:922` is the T009 fix this round checks, and `:677` is the redirect guard it relies on.
   Affected surface hints: `startRate`, `startedOfOffered`, `loops`/`unsafe`, command documents, stderr redirects.
   Case: `head -n 1 2> .skilled/commands/create/readme.md` followed by a `Write`; `shellReadTargets` returns the document path because `2>` is not recognized, `readDocument` returns true, and `startState.started` is true although the command read stdin and only wrote stderr to the document.

## Traceability Checks

- `spec_code` -- partial. Phase 027 T006, T007, T008, T009, T010, T011 and T030 are marked `[x]` with evidence. Reading the fixed files confirms the offeredAs writers, the heredoc end word, the shell-read start, the Codex resolved read and the live holdout guard. T009's redirect claim is only met for a bare `>`; `2>` and `&>` remain counted.
- `checklist_evidence` -- partial. AC-003's four inputs (`cat`, `rg`, in-place `sed`, heredoc) read as the task describes, and `CHK-040`'s offeredAs claim is met by both writers. The brief's redirect input is not in AC-003's table, and the `2>` form is the remaining gap.
- `skill_agent` -- notApplicable. No agent definition changed in this area.
- `agent_cross_runtime` -- notApplicable. The Codex reader is a shared session reader, not an agent definition; its resolved-path read is checked directly.
- `feature_catalog_code` -- notApplicable. No feature-catalog page describes the changed accuracy-runner lines.
- `playbook_capability` -- notApplicable. No playbook surface changed.

## Integration Evidence

- The 4c brief's checks map to the fixed surfaces: T006/T007 (`command-offer.mjs:496`,
  `run-command-behaviour.mjs:820-826,1203`), T008 (`score-command-transcripts.mjs:648`), T009
  (`:916-929`), T010 (`codex.mjs:163-169`), T011
  (`command-routing-slice.vitest.ts:134-149,201-210`) and T030 (`README.md:70,76,125`).
- The shell branch at `:922` feeds `startState` and the loop readers, so the redirect edge reaches
  `startRate`, `startedOfOffered` and the loop-safety counts, not only a diagnostic.
- The sibling `scorer-attach-close-4c` lineage owns `command-attach.ts`. Reading the fixed
  `COMMAND_OR_LIST` at `:380` and its three uses at `:427-439` shows a refusal, a question and a
  request behave as the brief asks; no finding is raised against that surface here.

## Edge Cases

- `2>` and `&>` are recorded as the P2 finding above. A redirect placed before a real operand
  (`cat > out.md prompts/x.md`) clears every later word, so a real read is missed; that is a false
  negative and no current start figure depends on it, so it is recorded as a parser limit rather
  than a second finding.
- A bare document name is resolved through the last `cd` in the same shell command. A path with a
  quoted space is unquoted before the `.md` test, so a quoted bare name is still matched; an
  unquoted name with a space is not a valid one-word target.
- Nested heredocs are not modeled. The pattern closes the first matching end word, which is the
  shell's own rule for the opening delimiter; the T008 cases cover a hyphen and a dot end word.
- The head-moved line intentionally carries none of the four attribution fields
  (`run-command-behaviour.mjs:1180-1184`). `README.md:70` now states that exception, so
  AR4B-P2-002 is confirmed fixed rather than re-reported.
- The Codex reader keeps `recordedSessionId(lines, transcriptPath)` on the caller's locator while
  reading `storePath`. The T010 test pins the link case; no new input was found that mismatches the
  recorded id.

## Confirmed-Clean Surfaces

- Both run-log writers keep `offeredAs`: `command-offer.mjs:496` and
  `run-command-behaviour.mjs:820-826,1203`.
- A heredoc end word with a hyphen or a dot closes: `score-command-transcripts.mjs:648` accepts
  `[A-Za-z_][A-Za-z0-9_.-]*` and matches the same text as the end word.
- A search and an in-place `sed` are excluded: `:671` limits readers to `SHELL_READERS`, and `:673`
  drops a `sed` with `--in-place`, `--in-place=`, or a clustered `-i` flag.
- The Codex reader opens the containment-resolved file: `codex.mjs:163-169`.
- The holdout guard reads the live capture: `command-routing-slice.vitest.ts:201-210` checks
  `publishedHoldoutIds(live, holdoutIds)` as well as the committed baseline.
- The two 4b accuracy-runner findings are fixed: `README.md:76` says four fields, `:125` lists
  `offeredAs`, and `:70` names the head-moved line's four-field exception.

## Ruled Out

- **`offeredAs` is still dropped by a writer.** Ruled out: the backfill writes it at
  `command-offer.mjs:496`, the live turn spreads it at `run-command-behaviour.mjs:1203`, and the
  brief-only branch copies the input line's fields unchanged.
- **A hyphen or dot heredoc end word is read as a command.** Ruled out:
  `score-command-transcripts.mjs:648` captures the end word with `[A-Za-z0-9_.-]*`.
- **The Codex reader still opens the caller's link.** Ruled out: `codex.mjs:169` reads
  `storePath`, the path containment resolved.
- **The holdout guard still checks only the committed baseline.** Ruled out:
  `command-routing-slice.vitest.ts:206-210` checks the live capture too.
- **A refusal or question over an or-list carries a command.** Ruled out in the sibling area by
  `command-attach.ts:380,427-439`; this lineage raises no finding against it.
- **A stored run line can never carry `offeredAs`.** Not ruled out as a doc statement; it is the
  iteration-2 traceability check, where the README sentence at `:123` is read against the fixed
  writers.

## Next Focus

- Dimension: traceability and maintainability
- Focus area: the routing-accuracy README sentences that describe `offeredAs`, the backfill
  fields and the `--brief-only` path, including the T030 edits at `:70`, `:76` and `:125`
- Reason: the code-side checks are confirmed; the remaining risk is a doc sentence that the
  offeredAs writers made false
- Rotation status: correctness and security complete; traceability and maintainability next
- Required evidence: `README.md:63-85,120-126,185-188`, `command-offer.mjs:440-508`,
  `run-command-behaviour.mjs:815-826,1187-1206`
- Blocked/productive carry-forward: the redirect parser edge is carried as a P2, not re-opened as
  a code change
- Recovery note: none

## Verdict

No active P0 or P1 finding. One P2 correctness edge remains active; the verdict is PASS with
advisories.

Review verdict: PASS
