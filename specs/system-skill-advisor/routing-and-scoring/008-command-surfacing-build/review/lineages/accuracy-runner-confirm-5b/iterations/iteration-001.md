# Review Iteration 1 - accuracy-runner-confirm-5b

## Dispatcher

- Target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build` (spec folder)
- Lineage: `accuracy-runner-confirm-5b`, area `accuracy-runner`, range `2a1a42263cc..d21dbc1cafe`
- Brief: `review/review-brief-5b.txt` read first; scope file `review/review-scope-5b.txt` read; verification
  report `review/verify-5/report.md` read; decision D13 of
  `032-review-pass-five-remediation/plan.md:169-184` read; limits in
  `032-review-pass-five-remediation/scratch/review/report-2.txt:2,10` and `report-3.txt:2` read.
- Dimension: correctness (write reader, COMMAND line reader).
- Operator review focus addressed this iteration: the focus asks whether "the shell write reader misses
  no in-place edit" and whether "the COMMAND reader reads only a line the model printed as its own".
  Both readers are the whole of this iteration, exercised through `normalize` and `commandLines` on
  one-call Claude records.
- No prompt corpus file was opened. No code was changed. No build, test suite or generator ran; the
  reader probes below import the changed module and call its exported functions in memory.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:267-335` (redirect reader, event shape)
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:372-438` (`normalize` write branch)
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:498-575` (`COMMAND_LINE`, fence and quote skip, tally)
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:708-793` (`insideCheckout`, `firstWritePosition`, `shellReadTargets`)
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:795-1157` (whole new writer block)
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:1477-1493` (`startState`)
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:1558-1591` (`deepLoopInit`)
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:1965-1975` (`repeatedCommands`)
- `.skilled/skills/system-skill-advisor/runtime/tests/command-transcript-score.vitest.ts:382-470` and `:707-714` (write-reader and long-target cases)

Probe (read-only, in-memory): one Claude `Bash` call per spelling through `normalize`, and one assistant
text block per marker spelling through `commandLines`. Results quoted in the findings below.

## Findings - New

### P0 Findings

None.

### P1 Findings

None. Every writer spelling the fix names in decision D1 produces a `write` event in the probe, and
every marker spelling decision D4 names is read or refused as D4 says.

### P2 Findings

1. **A `--target-directory` copy records the source as the file it changed** -- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:1040` -- `writtenWords` keeps only the last bare word for `cp` and `mv`, and only the short `-t` spelling is special-cased (:1016-1022). The long `--target-directory` option is dropped as a flag, so the source word is what survives as the target.
   Finding class: correctness
   Scope proof: `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:1010-1041` (new block, inside the lineage's declared accuracy-runner path).
   Affected surface hints: `normalize` write events (:399-417), `firstWritePosition`/`insideCheckout` (:726-735, :708-724), `startState.unsafe` (:1490-1492), `deepLoopInit` (:1582-1585).
   Case: `cp --target-directory=specs/x/review /private/tmp/notes.md` prints `kinds=write path=/private/tmp/notes.md`; the created `specs/x/review/notes.md` is never named, and because `/private/tmp` is a scratch prefix the boundary write is discarded and an `ask` row prints `unsafe=false`. The same happens with the separated spelling `cp --target-directory specs/x/review /private/tmp/notes.md`.
   Note: the test named "reads a long target option as a write" (`command-transcript-score.vitest.ts:707-714`) asserts only that a write exists, not which path, so it passes with the source path.

2. **A background `&` is folded into the writer's argument list** -- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:895-899` -- `shellSegments` appends a lone `&` to the current word and never ends the segment, so the words of the command after it are handed to the writer as file names.
   Finding class: correctness
   Scope proof: `score-command-transcripts.mjs:839-914` (the new scanner), used only by the new `shellWriteTargets` (:1120-1157).
   Affected surface hints: write events and the goal log's write rows; `deepLoopInit`'s folder test and `completeLoopInit`'s `outside` marker read every write path.
   Case: `touch a.md & echo done` prints four write events, `["a.md"]`, `["&"]`, `["echo"]`, `["done"]`; the last three name no file. `plainSplit` (:925-927) has the same gap on the unclosed-quote fallback.

3. **A three-backtick line closes a four-backtick fence** -- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:515` -- `FENCE_LINE` captures a fence of three or more characters, but the toggle compares only `fenceMatch[1][0]` (:549-556), so a shorter fence closes a longer one.
   Finding class: correctness
   Scope proof: `score-command-transcripts.mjs:505-575`, the new fence and quote gate in `commandLines`.
   Affected surface hints: `commandLines` start/offer reporting, `offerSeenIn` and `reportedStart` counters, and `repeatedCommands` (:1969-1974).
   Case: an assistant block that quotes a transcript inside four backticks, with a three-backtick block holding `COMMAND: /deep:review → started`, prints `started` for `/deep:review`; per the reader's own rule the inner fence is literal text inside the outer fence and the line is shown, not printed.

4. **In-place editors outside the fix's writer list stay invisible** -- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:822-831` -- `isShellWriter` covers `cp`, `mv`, `tee`, `rm`, `mkdir`, `touch`, `sed -i` and `perl -i`, which is exactly the verifier's list that decision D1 adopted. A `git rm` or a `git checkout -- <path>` that changes a tracked file in place, and `install`/`truncate`/`rsync` spellings, still emit only a `shell` event.
   Finding class: correctness
   Scope proof: `score-command-transcripts.mjs:822-831`, inside the declared accuracy-runner path; decision D1 at `032-review-pass-five-remediation/plan.md:70-87` and D13 at `:169-184` name neither `git` nor `install`/`truncate`.
   Affected surface hints: `startState.unsafe` (:1490-1492), `loopInit`, and the goal-log unsafe count.
   Case: `git rm specs/x/review/report.md` prints `kinds=shell unsafe=false` on an `ask` row although the tracked report is deleted; `truncate -s 0 specs/x/review/report.md` and `install -m 644 a.md specs/x/review/report.md` read the same way. This is a scope question rather than a defect in the adopted list, so it is advisory.

## Traceability Checks

- `spec_code`: partial. Decision D1's eight writers each produce a write in the probe (`sed -i`, `sed --in-place=.bak`, `perl -pi`, `perl -i.bak`, `tee`, `cp`, `mv`, `rm`, `mkdir`, `touch`), and the `cd` prefix, quoted folder, nested `sh -c`, `eval`, `command`-runner and assignment cases match D1's prose. The long `--target-directory` spelling is not in D1's table and behaves as finding 1 records. Decision D4's anchor (list marker, number with dot or bracket, heading run, checkbox, emphasis/backtick/bracket run), fence skip and blockquote skip all match the code, except the fence-length case in finding 3.
- `checklist_evidence`: pending. The lane A task rows that claim these fixes (`032-review-pass-five-remediation/tasks.md`) are read in the traceability iteration.
- `skill_agent`: notApplicable. No agent definition changed in this area.
- `agent_cross_runtime`: notApplicable. No runtime branch changed in the two readers.
- `feature_catalog_code`: notApplicable. No feature-catalog page describes the scorer or the arena builder.
- `playbook_capability`: notApplicable. No playbook surface changed in this area.

## Integration Evidence

- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:399-417`: the only producer of `write` events from a shell call; every consumer below reads them.
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:1477-1493`: `startState`, whose `unsafe` is `selfAuto || (guarded && wrote)` and whose `wrote` is `firstWritePosition !== null`.
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:1558-1591`: `deepLoopInit`, which reads `write` paths against `(?:^|/)(?:research|review)/`.
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:541-575`: `commandLines`, consumed by `reportedStart`, `offerSeenIn` and the summary's command-line rate.
- `.skilled/skills/system-skill-advisor/runtime/tests/command-transcript-score.vitest.ts:382-470,707-714`: the new reader cases, read as evidence of intent only; no test was executed.

## Edge Cases

- Unclosed quote: `sed -i "s/a/b/ f.md` falls back to `plainSplit` and still names `f.md`; the probe's `#`-comment and unclosed-quote cases in the test file match the code.
- Recorded, not re-reported: the wrapper class (`sudo rm`, `timeout 5 rm`, `command sed -i`, `find -exec`, `xargs`, `ssh`, `watch`) reads as no write. `report-3.txt:2` graded the class P2 and the plan's D13 records it; this round names it and does not raise it again.
- Recorded, not re-reported: `**COMMAND:** /x` and an indented report line stay unreadable/readable respectively, per D13 and the code's own comment at :498-511.
- A `cp -t dir` call names the folder `dir`, not `dir/<basename>`; the test pins that reading at `command-transcript-score.vitest.ts:455-465`, so it is intent rather than defect.

## Confirmed-Clean Surfaces

- `sed -i` / `sed -i ''` / `sed --in-place=.bak -e` / `perl -pi -e` / `perl -i.bak -pe` each produce one write naming the edited file.
- `tee f.md < in.txt`, `cp a.md b.md`, `cp -Rc src dist`, `cp -t specs/x a.md b.md`, `mv a.md b.md`, `rm -f a.md b.md` (two writes), `mkdir -p specs/x/y`, `touch -t 202601010101 f.md` all name the right target.
- `cd specs/x && sed -i 's/a/b/' report.md` names `specs/x/report.md`; `cat doc.md | tee notes.md` names `notes.md`.
- `grep -rn 'rm a.md' f.md`, `echo 'cp a b'`, `sed -n '1,5p' f.md`, `git commit -m "docs; rm stale notes"` produce no write.
- `sh -c 'rm a.md'` and `bash -lc "sed -i 's/a/b/' f.md"` reach the nested command.
- `commandLines`: plain, numbered, numbered-with-bracket, heading, checkbox, bold-wrapped and inline-code reports are read; a prose quote, blockquote, three-backtick fence, tilde fence and a fenced report are skipped; `/deep:review` plus `/deep:review:auto` tally as two lines of one command and `repeatedCommands` returns 1.

## Ruled Out

- "A refusal or a sentence that quotes the marker is read as a start": ruled out. `The model printed COMMAND: /deep:review → started in its reply.` returns no line, and a line that opens with `>` returns none.
- "`sed -i.bak` or `perl -i.bak` loses the edited file": ruled out. The script word is marked and the file survives in both readers.
- "`cp -t dest src.md` names the source": ruled out; the probe prints `dest` and the test pins it.
- "The mode-suffix tally double-counts one command": ruled out; `commandLines` and `repeatedCommands` both key on namespace and name.
- "A quoted separator inside a commit message becomes a write": ruled out; `git commit -m "docs; rm stale notes"` emits no write.
- "The new write branch drops a redirect target": ruled out; a call with both a redirect and an in-place writer emits the redirect target first, then the writer's targets.

## Next Focus

- Dimension: security
- Focus area: `prepare-behaviour-arena.mjs` source checks and `run-command-behaviour.mjs` live-turn guard
- Reason: the brief's next three checks are provenance (dirty source, stale build, escaping/absolute link,
  JSON line on a failed check) and the every-turn remote check with no network push
- Rotation status: first pass on these files this round
- Required evidence: the refusal order in `main`, the marker lines and their readers, `turnRefusal`'s call
  site and the `childEnv` overrides, plus the README rows that describe them
- Recovery note: not applicable

Review verdict: PASS
