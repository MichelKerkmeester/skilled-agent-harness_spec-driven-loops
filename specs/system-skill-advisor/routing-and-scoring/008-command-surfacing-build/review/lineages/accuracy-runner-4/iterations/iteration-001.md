# Review Iteration 001

## Dispatcher

- Mode: review (fan-out lineage `accuracy-runner-4`, pass four)
- Session: `fanout-accuracy-runner-4-1794669272137-9v23rz`, generation 1, lineage mode `new`
- Dimension: D1 Correctness, first pass over the area changed since pass three
- Review target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build` (spec-folder)
- Budget profile: verify (12 review actions)
- Operator review focus bound as `review_focus`: pass-four review of command surfacing in the `accuracy-runner` area. Read `review-brief-4.txt` first; review the files whose area is `accuracy-runner` plus shared docs; check the six runtimes, whether a refusal/question/mention can attach or start a mutating command, whether the transcript scorer counts a load/followed step/offer that did not happen (Codex exec bodies, rg/grep, heredocs, cd, partner-side commands, paired arms, Wilson ranges), holdout hygiene, and docs that disagree with code. Never read or print holdout prompt text.
- How this iteration addressed the focus: it read the two pass-four producer changes (`command-offer.mjs` and the `4a622e419f` offer field) against their consumer (`score-command-transcripts.mjs`), then read the `a1c31b6f38` Codex/heredoc/`cd` reader and its tests. It found the partner-side offer field that is computed and then dropped before any run line reaches the scorer, a heredoc delimiter the new shell reader leaves in the command stream, and a shell read the new path counts as a workflow load but not as a start or a loop. Holdout rows were counted only; no holdout prompt text was printed.
- `steer.md`: absent before this iteration; no lead rulings to apply.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-offer.mjs:52-80,99-147,486-499`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs:1177-1190` (read-only producer context; unchanged since pass three)
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:643-693,718-748,913-926,975-990,1430-1438,1464-1474`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md:58-72,123,187`
- `.skilled/skills/system-skill-advisor/runtime/tests/command-offer.vitest.ts:73-113,305-350`
- `.skilled/skills/system-skill-advisor/runtime/tests/command-transcript-score.vitest.ts:177-275,2199-2252`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-prompts.jsonl` (ids, splits and row types only; no holdout prompt text)

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **The partner-side offer field is computed and then dropped by both offer writers** -- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-offer.mjs:486` -- `parseOffer` and `replayOffer` return `offeredAs` (`head` or `partner`), and the scorer's `offerOf` uses it to keep a command that sat on the partner side of an ambiguous head out of `offered` (`score-command-transcripts.mjs:1464-1473`). No writer persists that field. `backfillRunLog` copies only `offeredCommand`, `offeredPolicy`, `offerError`, `briefDelivered` and `offerBackfilled` into the new line (`command-offer.mjs:490-497`). The live runner's `appendRunLine` copies only `offeredCommand` and `offeredPolicy` from the same replay (`run-command-behaviour.mjs:1183-1187`). A real backfilled or live run line therefore has no `offeredAs`, and `offerOf` reads `undefined !== 'partner'` as `offered: true`. The README says "Each offer carries `offeredAs`, `head` or `partner`" (`README.md:123`) and separately lists the output fields without it (`README.md:187`), so the docs disagree with each other and with both writers.
Finding class: correctness / cross-consumer
Scope proof: `rg -n "offeredAs"` over the runtime shows the only producers are `failedOffer`, `parseOffer` and `replayOffer`, the only consumer is `offerOf`, and both write paths that call `replayOffer` select fields without it. `command-offer.vitest.ts:337-350`'s replay stub returns no `offeredAs`, so the backfill test cannot catch the drop.
Affected surface hints: `command-offer.mjs` `backfillRunLog`; `run-command-behaviour.mjs` `appendRunLine`; `score-command-transcripts.mjs` `offerOf`; README "Attribution on every run line" and "Backfill a finished log".
Case: a run whose head is `Advisor: live; ambiguous: sk-code 0.95/0.12 vs sk-doc → /create:manual-testing-playbook (start) 0.82/0.12 pass.` gets `offeredAs: 'partner'` from `replayOffer`; the line written by the runner or a backfill has no `offeredAs`; the scorer counts `/create:manual-testing-playbook` as `offered` and leaves `offeredAsPartner` at 0, so `startedOfOffered` and `followedOffered` treat a command the head showed on the partner side as an offer the head made.

```json
{
  "type": "claim",
  "claim": "The partner-side offer marker is added by parseOffer/replayOffer but is not copied into any run line by either producer, so the scorer's partner-side exclusion never fires on a real log.",
  "evidenceRefs": [
    ".skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-offer.mjs:70-81",
    ".skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-offer.mjs:486-497",
    ".skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs:1183-1187",
    ".skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:1464-1473",
    ".skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md:123",
    ".skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md:187"
  ],
  "counterevidenceSought": "Searched every runtime file for another writer of offeredAs (none); checked whether run-command-behaviour spreads the whole replay object (it selects two fields); checked whether the scorer can infer the partner side from offeredCommand alone (the same string can be head or partner); checked whether the backfill test's stub returns offeredAs (it does not).",
  "alternativeExplanation": "The field could be intended only for the scorer's unit tests and for a future producer, in which case the README claim and the scorer's read are the defects rather than the writers.",
  "finalSeverity": "P1",
  "confidence": 0.95,
  "downgradeTrigger": "If every run log is normalized to add offeredAs before scoring, or the scorer derives the partner side from a stored head, this becomes a P2 documentation cleanup."
}
```

### P2 Findings

1. **A heredoc whose delimiter is not a bare identifier is read as commands** -- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:647` -- `HEREDOC_BODY` matches a delimiter with `[A-Za-z_][A-Za-z0-9_]*` only. A quoted delimiter with a hyphen, such as `END-SCRIPT`, is not matched, so the body stays in the command stream and `shellReadTargets` parses its lines as commands. A body line that names a workflow document then counts as a load the run never performed. The only heredoc tests use `EOF` (`command-transcript-score.vitest.ts:2222-2223`).
Finding class: correctness / measurement
Scope proof: the regex is the only heredoc filter, `shellReadTargets` is the only shell reader, and both `followedBeforeWrite` and `ownerLoadedBeforeWrite` consume its targets. No test uses a delimiter outside the identifier grammar.
Affected surface hints: `score-command-transcripts.mjs` `HEREDOC_BODY`; `command-transcript-score.vitest.ts` heredoc cases.
Case: a Codex or Claude shell step runs `python3 - <<'END-SCRIPT'` with a body line `cat .skilled/skills/sk-doc/SKILL.md` and then writes; the body is data, but `shellReadTargets` returns the `SKILL.md` target and `workflowPath` reports `skill` although the file was never opened.

2. **A shell read counts as a workflow load but not as a start or a loop** -- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:913` -- The pass-four shell-read support is wired into `followedBeforeWrite` (`:734-736`) and `ownerLoadedBeforeWrite` (`:793`), but `readDocument` still accepts only `read` and `skill` events (`:916-923`). `startState` therefore reports `started: false` for a Codex run that `cat`s the command document, and `takenLoop` (`:1430-1438`) cannot name a loop opened the same way, so a deep-loop run that reads its document through the shell and writes without its init is not marked unsafe.
Finding class: correctness / measurement
Scope proof: `readDocument` is the single start/loop detector; the new shell readers are the only way a Codex `exec` body becomes a load; no test combines a shell read with `startState` or `takenLoop`.
Affected surface hints: `score-command-transcripts.mjs` `readDocument`, `startState`, `takenLoop`; `command-transcript-score.vitest.ts` start and loop sections.
Case: a Codex `exec` body runs `cat .skilled/commands/deep/review.md` and the run then writes into the packet's review folder; `workflowPath` says `command`, but `startState.started` is false, `takenLoop` returns null, and `unsafe` stays false even though the loop began without its lock/init.

## Traceability Checks

| Protocol | Level | Status | Evidence |
|----------|-------|--------|----------|
| `spec_code` | core | partial | The area implements the packet's command-surfacing measurement, not a spec behavior; the offer fields and the scorer are checked against their own README claims. |
| `checklist_evidence` | core | partial | The parent packet holds no checklist; no checked item names this area. |
| `skill_agent` | overlay | notApplicable | No agent definition owns `accuracy-runner`. |
| `agent_cross_runtime` | overlay | partial | The Codex session reader and the six-runtime tool tables were read; live per-runtime proof stays phase 007's. |
| `feature_catalog_code` | overlay | pending | Scheduled for iteration 3 with the README claims. |
| `playbook_capability` | overlay | pending | Scheduled for iteration 3 if reached. |

## Integration Evidence

- Producer `replayOffer` / `parseOffer`: `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-offer.mjs:70-146`.
- Producer consumer #1 `backfillRunLog`: `command-offer.mjs:486-499`.
- Producer consumer #2 `run-command-behaviour.mjs` `appendRunLine`: `run-command-behaviour.mjs:1183-1187` (read-only context; unchanged since pass three).
- Consumer `offerOf` / `scoreRun`: `score-command-transcripts.mjs:1464-1473,1533-1541`.
- Shell reader and its consumers: `score-command-transcripts.mjs:643-693,718-748,775-813`.
- Codex reader's `input` body: `.skilled/hooks/shared/session-readers/codex.mjs:99-113`.
- Tests: `command-offer.vitest.ts:98-113,280-302,305-350`; `command-transcript-score.vitest.ts:190-275,2199-2252`.
- Shared docs: `README.md:58-72,123,187`.

## Edge Cases

- Holdout rows: read by id, split and row type only; no holdout prompt text was printed. The fit/decline counts are handled in iteration 2.
- An old run line with no `offeredAs`: the scorer deliberately keeps it in `offered` so a historical log is not re-read as no offer. That is not the same as a new line never carrying the field, which is finding 1.
- A `COMMAND:` line naming a command twice: `commandLines` counts the command once per line and `repeatedCommands` counts the duplicate; not re-raised here.
- A shell command with a redirect: `redirectTargets` respects quoting; the `cat notes.md > SKILL.md` case is a write, not a read.

## Confirmed-Clean Surfaces

- `normalize` reads a Codex `exec_command` call through both `command` and `cmd`, and a bare `exec` body through `exec_command`/`cmd` or every string; the tests pin both shapes.
- `SHELL_READERS` no longer includes `rg` or `grep`; a search cannot count as a load.
- `cd` in the same command resolves a bare document name against that folder, including a quoted folder with a trailing slash.
- `offerOf` excludes a partner-side command when the line actually carries `offeredAs: 'partner'`; the unit test pins that branch.

## Ruled Out

- **A Codex body string that is not a command but names a document.** The every-string fallback only runs when no `cmd:` literal exists, and the test's list form is the intended shape; no real body in the area names a workflow document from a non-command string. Deferred as a hardening note, not a finding.
- **`rg`/`grep` counted as a load.** Removed from `SHELL_READERS`; the shell reader also ignores a search's printed path.
- **A `cd` that changes the folder for later commands.** The folder is carried across `&&`/`;` parts; the tests cover the quoted trailing-slash form.
- **A read after the first write still counted as followed.** `followedBeforeWrite` compares the event position to the boundary; the existing negative tests hold.
- **A `COMMAND:` line naming another command.** `offerSeenIn` filters through `namesCommand`; the declined-other-command test holds.

## Next Focus

- Dimension: security
- Focus area: the capture's fit/decline rows and the live holdout guard
- Reason: the fit tally is the new measurement for refusals and questions, and the brief asks whether those rows can still carry or start a mutating command; the holdout guard must be checked against the live capture, not only the committed baseline
- Rotation status: correctness complete; security next
- Required evidence: `capture-command-routing-baseline.mjs:560-700`, `command-routing-slice.vitest.ts:149-267`, `command-routing-baseline.json:1961-1984`

Review verdict: CONDITIONAL
