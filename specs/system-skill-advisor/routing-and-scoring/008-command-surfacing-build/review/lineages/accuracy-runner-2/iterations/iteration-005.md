# Review Iteration 005

## Dispatcher

- Mode: review (fan-out lineage `accuracy-runner-2`, pass two)
- Session: `fanout-accuracy-runner-2-1794570021136-noekp0`, generation 1, lineage mode `new`
- Dimension: D4 Maintainability
- Review target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build` (spec-folder)
- Budget profile: verify (11 review actions)
- Operator review focus bound as `review_focus`: pass-two review of command surfacing in the `accuracy-runner` area; look for new defects in the rest of the area, including the files not changed since pass one, and check that their contracts still describe what they do.
- How this iteration addressed the focus: it read the restore helper end to end (a pass-one clean surface) and probed `git status --porcelain` quoting in a throwaway repository inside the lineage, then re-read the scorer's module header against the summary it actually prints. Two P2s: a restore path that cannot act on a quoted file name, and a header that promises an ordered read/write report the CLI never emits.
- `steer.md`: absent before this iteration; no lead rulings to apply.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/worktree-restore.mjs:1-122`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs:1140-1189`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:1-43,1247-1280,1392-1427`
- `.skilled/skills/system-skill-advisor/runtime/tests/worktree-restore.vitest.ts:1-122`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md:100-125`
- `.skilled/skills/system-skill-advisor/runtime/tests/legacy/advisor-corpus-parity.vitest.ts:1-198`
- `.skilled/skills/system-skill-advisor/runtime/tests/legacy/advisor-observability.vitest.ts` (health assertions only)
- `.skilled/skills/system-skill-advisor/runtime/scripts/measure-embedder-cost.mjs` (README claim only)

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **A file name git quotes cannot be restored, so one space in a created path stops the arm and leaves the file** -- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/worktree-restore.mjs:54` -- `statusSnapshot` reads `git status --porcelain` and keys each path with `line.slice(3)`. Git quotes a path that contains a space (probe inside the lineage: `?? "a b.txt"`), so the map key is `"a b.txt"` including both quote characters. `restorePath` then asks `git cat-file -e 'HEAD:"a b.txt"'`, which is not a path git knows; `git rm --cached --ignore-unmatch -- '"a b.txt"'` also matches nothing; and `rmSync(resolve(cwd, '"a b.txt"'))` deletes a differently named file at most. The turn's file therefore stays, `leftoverPaths` reports the quoted key, and `restoreTurn` returns `restored: false`, so `runTurn` ends the arm with `restore_failed`. The failure is safe but unrecoverable by the runner: the next live arm refuses `worktree_dirty` on the leftover until someone deletes it by hand.
Finding class: correctness / restore-completeness
Scope proof: the finding is inside the restore helper and its only caller; the probe wrote only inside the lineage's `logs/quotepath-probe` directory.
Affected surface hints: `worktree-restore.mjs` `statusSnapshot` and `restorePath`; `run-command-behaviour.mjs` `runTurn`'s `restore_failed` branch; `tests/worktree-restore.vitest.ts`.
Case: a measured turn writes `notes draft.md` in the arena root; `git status --porcelain` prints `?? "notes draft.md"`; after the turn the restore leaves the file, reports `restore_failed` with `paths: ["\"notes draft.md\""]`, and the next arm refuses `worktree_dirty` until the operator removes it.

2. **The transcript scorer's header promises an ordered read/write report the CLI does not print** -- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:5` -- The header says the tool "reports what a model did with the commands a turn offered it: the `COMMAND:` lines it printed, the reads and writes in order, and whether a started loop ran its init first." The CLI has two outputs: `--summary` prints per-arm counts (`writeSummary`, line 1392-1427) and `--runtime --locator` prints a record count (`scoreSession`, line 885-901). The ordered read/write stream exists only inside `normalize` as an internal event list; no mode prints it. A maintainer looking for the ordered report the header names will search for an output path that does not exist, and may add a third mode instead of using `normalize` directly.
Finding class: maintainability / documentation drift
Scope proof: the header and both output modes are in the declared area.
Affected surface hints: `score-command-transcripts.mjs` module header and `writeSummary`; any future maintainer adding a per-session report.
Case: a maintainer needs the write order for one session and reads the header; they expect the CLI to print it, find only counts and unscored reasons, and either add a redundant printer or read `normalize` from a test harness.

## Traceability Checks

- `spec_code`: pass. No new number claim was made this iteration; the five floors re-derived in iteration 4 still hold.
- `checklist_evidence`: partial. No parent checklist; phase 007's open rows remain.
- `skill_agent`: notApplicable.
- `agent_cross_runtime`: partial. The restore defect is runtime-independent; the per-runtime proof stays phase 007's.
- `feature_catalog_code`: pass (carried from iteration 4).
- `playbook_capability`: partial (root playbook statements carry iteration 4's findings; NC-011 holds).

## Integration Evidence

- `worktree-restore.mjs` ↔ `run-command-behaviour.mjs`: `runTurn` treats `restored: false` as `restore_failed` and stops the arm, which is why the quoted-path defect surfaces as a blocked arm rather than a silent leftover.
- `worktree-restore.mjs` ↔ `tests/worktree-restore.vitest.ts`: the test covers staged, deleted and inherited paths but no path with a space or a quote, which is why the defect survives a green suite.
- `score-command-transcripts.mjs` ↔ `README.md:112`: the README describes the counts the CLI prints, while the module header describes a stream; the README is the accurate of the two.

## Edge Cases

- **The probe was local and minimal.** A throwaway `git init` inside the lineage's `logs/quotepath-probe` folder showed the quoting for a space and a quote; it wrote nothing outside the lineage and remains there as a local artifact, since this review changes no file by deletion.
- **The restore still fails safe.** The leftover is reported and the arm stops, so no wrong score is recorded; the cost is that a legitimate write blocks the next arm until a human intervenes.
- **A renamed path is handled.** `statusSnapshot` splits on ` -> `, so both sides of a rename are restored; only the quoting is unhandled.
- **The header finding is not a behaviour bug.** It costs maintainer time, not a wrong run, which is why it stays P2.

## Confirmed-Clean Surfaces

- The restore's HEAD-versus-index rule: a path HEAD knows is checked out from HEAD, a path HEAD does not know loses its index entry and its file.
- The pre-turn snapshot rule that never reverts a path inherited from another worker.
- The per-arm summary's printed counts and the `policy` lines; the README's field list matches them.
- The legacy parity test's 195-row corpus and its accepted-divergence list (unchanged since pass one; no new contradiction found).
- `measure-embedder-cost.mjs`'s README sentence: the run spawns the advisor CLI but starts no model server, and the README says the model server is the subject.

## Ruled Out

- **A restore gap for staged new files.** Ruled out: `restorePath` drops the index entry and deletes the file, and the test covers it.
- **A rename restored on one side only.** Ruled out: both sides of the porcelain ` -> ` pair are keys.
- **The legacy parity test's accepted list contradicting its comment.** Ruled out: the list is explicitly "reviewed-accepted top-1 divergence", so `rr-iter3-105`'s presence matches "accepted as a divergence, not as correct".
- **The legacy parity test's expectation history missing a step.** Ruled out: the final sentence records the `rr-iter3-076` move that takes the pair from 116/111 to 117/112.
- **`measure-embedder-cost.mjs` claiming it starts nothing while spawning the CLI.** Ruled out: the claim is about the model server, and the script starts none.

## Next Focus

- Dimension: cross-cutting stabilization
- Focus area: re-read the two P2 findings' lines, re-run the two guard test files, and confirm every dimension has at least one full pass before the loop's last iteration
- Reason: all four dimensions are covered; one stabilization pass is required before a legal stop
- Rotation status: D1-D4 complete; stabilization pass next
- Blocked/productive carry-forward: productive (restore probe, header comparison); blocked (no live arm)
- Required evidence: the findings still active at their cited lines, and no new defect in the areas already covered

Review verdict: PASS
