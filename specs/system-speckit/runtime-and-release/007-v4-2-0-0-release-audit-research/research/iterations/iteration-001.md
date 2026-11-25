# Iteration 1: Overlay engine and doctor overlay commands

## Focus
Overlay engine and doctor overlay commands: relayout, rollback, repin, json-entry merge, path and case handling in `.skilled/commands/doctor/scripts/overlay-engine.cjs` and its callers. Selected interpretation: the engine's command-line surface (argument parsing, `main`), the relayout run (backup, move, undo, success output), the repin rollback (`rollbackRun`, `rollbackUnderLock`, the backup writer), and the json-entry layout reader (`documentLayout`). The already-fixed case-insensitive `root/skilled` guard is out of scope. Each cited line was checked with `git blame` plus `git merge-base --is-ancestor <sha> v4.1.0.0`, so findings carry only code changed in the window. Issues in code older than v4.1.0.0 are listed under Ruled Out as pre-existing, per strategy NON-GOALS.

## Actions Taken
1. Read the prompt pack, config, state log, strategy and the archived run's `research.md`, to avoid re-reporting its M7 and B2 items.
2. Read `parseArguments` and `main` [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:8961] [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:9018]. Probed them with a nonexistent `--root`, which writes nothing.
3. Read `documentLayout`, `serializeValue`, `matchIndex` and `applyJsonOperations` [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1220] [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:2226].
4. Read the relayout run: `writeRelayoutManifest` through `relayoutUnderLock`, and `copyForBackup` [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:8698] [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:8580].
5. Read the repin rollback (`rollbackRun`, `rollbackUnderLock`) and the backup writer [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:7323] [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:6587].
6. Cross-read the route docs `overlay.md`, `doctor-overlay-repin.yaml` and `doctor-overlay-presentation.txt`.
7. Blamed every cited line and tested whether its commit predates `v4.1.0.0`.

## Findings
1. **P3 | in window (`59d26c89f38`) | The repin rollback's "list runs" remedy prints a command that fails as pasted.** `rollbackRun` builds `Next: ls <runs dir>, then rerun node .skilled/commands/doctor/scripts/overlay-engine.cjs repin --rollback <run-id> from <root>` [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:7403] [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:7404]. The trailing `from <root>` adds two positional words to the command. `parseArguments` returns `null` for any token it does not know, so the pasted line prints the usage block and exits 2 [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:8966]. Every other engine remedy uses the `Next: from <root>: <command>` form built by `nextEngine` [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:92] [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:93]. The in-window commit `e7244e53648` ("print every overlay Next command so it runs as pasted") states that goal, and this line misses it. The line prints on all three rollback refusals: a bad run id, a missing backup, and a `backup.json` that is not JSON. Confirmed by reading: the output is deterministic and `from` is not a known token. Fix: move the clause to `from <root>: ` ahead of the command, as `nextEngine` does.
2. **P3 | in window (`3aab896957e`) | A relayout backup has no restore command.** The run writes `<overlay folder>/relayout-runs/<stamp>/` and prints only `backup <label>` [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:8879]. On success it then prints `<n> moved` and a bare `run ... apply` line [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:8939]. The engine has no command that reads that backup. `COMMAND_WORDS` holds only `status`, `apply`, `repin` and `pre-commit` [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:123], and `--rollback` belongs to `repin` and reads only `repin-runs/<id>/backup.json` [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:7409]. The relayout backup holds no `backup.json`, only copied sources and the manifest [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:8858]. Undoing a finished relayout that the operator regrets is therefore manual: copy the sources back, restore the manifest, and re-point each `relinked` layout link. Neither the engine nor the presentation contract names those steps. The contract shows only `Backup: [overlay folder]/relayout-runs/[stamp]/` [SOURCE: .skilled/commands/doctor/assets/doctor-overlay-presentation.txt:305]. The automatic undo (`rollbackRelayout`) runs only inside a failed run [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:8753]. Confirmed by reading. Not tested: whether the backup's layout is enough for a hand restore when the overlay folder sits outside the tree, where it is keyed from the overlay root [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:8849].

## Ruled Out
- **Rollback writes through a linked ancestor.** It does not. `isDirectory` uses `lstat`, so a link standing where a folder was is unlinked rather than followed [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:273] [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:7381].
- **The relayout backup skips files silently.** It does not. `copyForBackup` prints a `skipped` line for each protected path it leaves out, and the failure message names them [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:8580].
- **`documentLayout` misreads the indent unit or line ending.** None found on a read of the opener-step logic. The function had six in-window fixes, and the archived run already holds M7 for it [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1220].
- **overlay.md omits `--stage` and `repin --json`.** Not drift. overlay.md documents the `/doctor:overlay` route, which uses `--stage` internally [SOURCE: .skilled/commands/doctor/overlay.md:110]. The engine's USAGE lists both flags [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:133]. A route narrower than its engine is not a contradiction.
- **Pre-existing, out of window by NON-GOALS.** Each of these was blamed to a commit that `git merge-base --is-ancestor` puts before `v4.1.0.0`. They are recorded as observations, not findings:
  - (a) `parseArguments` treats any token whose text after its first two characters is `upstream`, `to`, `stage` or `rollback` as that flag [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:8975], from commit `0bfe4d6e929`. So `auto`, `onto` and `xxto` act as `--to`. Reproduced: `repin --upstream /tmp xxto deadbeef --root /nonexistent-zz` gets past parsing to `root is not a directory` (exit 2) instead of printing usage.
  - (b) `status --json` prints plain text, not JSON, for a usage error and for a root that is not a directory [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:9020] [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:9030]. That contradicts the catch block's own comment [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:9044], from commit `f965c658d49`. Reproduced with `status --json --root /nonexistent-zz`.
  - (c) `repin --rollback` has no staleness guard. `backup.json` records only the bytes from before the run [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:6641]. `rollbackUnderLock` checks only that the backup itself is intact [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:7323]. It never checks that the live tree still holds what the run wrote. So rolling back an older run after later re-pins, applies or hand edits overwrites them and removes the paths that run created. The route's plan is only a `find` listing of the run folder [SOURCE: .skilled/commands/doctor/assets/doctor-overlay-repin.yaml:76]. This is inference and was not executed.
  - (d) The relayout's final `run node ... apply` line lacks the `from <root>:` prefix [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:8939], from commit `3d39e6a488b`. The in-window sweep `e7244e53648` left it as it was.

## Dead Ends
- Proving (c) by execution needs a live re-pin with a later edit, which writes outside this packet. It is left as inference.

## Edge Cases
- Ambiguous input: "as shipped in v4.2.0.0" could mean everything in the release or only what changed in the window. The narrower window reading was chosen, per strategy NON-GOALS. Pre-window issues are kept as observations, in case the operator wants them anyway.
- Contradictory evidence: none.
- Missing dependencies: none. A live relayout and a live rollback were not executed, because both write outside the packet.
- Partial success: the json-entry operation set (`setKeyOnItem`, `removeDroppedItems`, `restoreDroppedSets`) and the case-folding path checks were not reviewed within this iteration's budget.

## Sources Consulted
- .skilled/commands/doctor/scripts/overlay-engine.cjs:73-135, 255-280, 1160-1340, 2226-2330, 6580-6645, 7300-7470, 8580-8620, 8698-9092
- .skilled/commands/doctor/overlay.md:3, 35-36, 60-75, 99-116
- .skilled/commands/doctor/assets/doctor-overlay-repin.yaml:5-97
- .skilled/commands/doctor/assets/doctor-overlay-presentation.txt:129, 305, 493
- the archived run's `research.md`, to avoid duplicates
- `git log v4.1.0.0..v4.2.0.0`, `git blame`, and `git merge-base --is-ancestor` on each cited line

## Assessment
- New information ratio: 1.0. Both in-window findings are new, and neither appears in the archived run's 16.
- Questions addressed: Q1 (overlay engine logic bugs) and Q5 (operator UX of the new commands).
- Questions answered: none. Q1 still needs the json-entry operation set and the case-handling paths.

## Reflection
- What worked and why: blaming each cited line against `v4.1.0.0` before writing. It moved four plausible issues out of the window and kept the findings honest about NON-GOALS.
- What did not work and why: reading the largest functions first, which spent budget on code mostly older than the window. The 76 in-window commits are the better map.
- What I would do differently: list the commits in `git log v4.1.0.0..v4.2.0.0 -- overlay-engine.cjs`, then read the diff hunks of the newest fixes (`512be46971a` through `5f1af6159d0` for json, `db5bf1cd339` and `8ab99ee8106` for layout links and case) for an incomplete fix.

## Questions Answered
None. Q1 has partial evidence: two in-window UX defects in the rollback and relayout output, and no confirmed in-window logic bug yet.

## Questions Remaining
- Does the overlay engine and its doctor commands (relayout, rollback, repin, json-entry merge, path and case handling) carry logic bugs in v4.2.0.0? (json-entry ops and case handling not yet covered)
- Do the deep-loop runtime changes (fan-out, expansive frontier, frontier_drained, --extend, convergence and the append gateway) carry logic bugs or drift from their docs?
- Does the skill advisor (loop offers, the typed-only Python fallback, the common-words floor, native versus Python parity) misroute or drift from its docs?
- Do the session hooks and spec tooling (Stop decision auto-record, tail packet detection, nested sub-tracks in create, validate and relocate) carry bugs or UX friction?
- Where do the new v4.2.0.0 commands and hooks give operators bad UX: silent failures, misleading messages, unsafe defaults or dead ends?

## Recommended Next Focus
Overlay engine, diff-driven: read the in-window hunks of the json-entry fixes (`git show 512be46971a 2b9a2328922 9bee9df5cc0 a9d52c1087d cd8091a09d3 5f1af6159d0`) and the layout-link case fixes (`8ab99ee8106`, `5a6f2e211c3`, `aba8f76e97f`), and check each for an incomplete fix: a sibling call site the fix did not reach. Then move on to Q2, the deep-loop runtime.
