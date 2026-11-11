**Verdict.** Skilled delivered what the handover asked, but the brief's setting is out of date, and `main` carries a red CI check that this change caused. Barter did not stay paused. On 2026-11-11 it re-pinned to `3d665d103d`, turned strict writes on, deleted `sync.cjs`, `replay.cjs` and its per-runtime overlay hooks, and moved every overlay source to the engine's layout (Barter commit `00bbf53ed`). The handover file at the path you gave now holds a new, open handover with six engine items (Barter commit `12f3cd4d4`, not pushed). The original text is in `git show 00bbf53ed:<that path>`, and I checked the delivery against that. One optional piece of the original was left out, and nothing in Skilled has started on the six new items.

Engine line numbers below refer to `.skilled/commands/doctor/scripts/overlay-engine.cjs` at `3d665d103d`. Test line numbers refer to `tests/overlay-engine-strict-writes.test.cjs` beside it.

## Request-by-request check

**Build requests**

1. **Strict guard: met.** `strictWriteRefusal` at `:3598` refuses a new file or an unowned edit under a vendored root and names the overlay path or the adopt command. It is tested at `:133` and `:149`, and I watched it refuse on Barter's live tree.
2. **Adopt: met, in a different form.** It is `apply --adopt <path>` (`:3695`), not an `adopt` target. An upstream file is pinned from the upstream bytes (`:3745-3759`). A folder's token-named files go into `protectedPaths` (`:3769`). A single file needs none, because a file entry's exact path is already exempt (`:1604`).
3. **`generated` list: met, with one defect.** Guard (`:3606`), adopt (`:3719`) and the commit check (`:3845`) all honour it. The defect is in `globToRegExp` (`:3515`): `**/name` matches any file whose name ends in `name`.
4. **`pre-commit`: met.** The check is at `:3817`, with the pin skip at `:3839` and the upstream-equal pass at `:3851`. It is tested at `:297`.
5. **Root files: partly met.** The re-pin report names each changed root file (`:3080`, test `:339`). `status` does not flag a stale root-file overlay (`:2099`). The handover called the report line the minimum, so this is the one piece dropped.

**Constraints**

1. **Off by default: met.** `isStrictWrites` (`:3503`) and the test at `:193` cover it. Skilled has no overlay setting file or folder, and the hook allows before it loads the engine (`overlay-guard.cjs:113`).
2. **One owner: partly met.** The engine judges and the hook core forwards every path unchanged. `.skilled/hooks/overlay-guard/` has no OpenCode adapter, so Barter still keeps its own OpenCode guard. The handover did not ask for one.
3. **Dotenv and token rule: met.** `isRefusedAdoptName` (`:3656`) refuses by name before any read, tested at `:270`.
4. **No spec ids in comments: met**, by my read of the new engine section and the test file.
5. **Docs: met.** `overlay.md`, `_routes.yaml`, the presentation text and `references/overlays.md` describe the setting, adopt and the commit check.

**Done-when**

1. **Existing tests pass: met.** CI ran the doctor suites on Node 22.23.4 at `3b787637e1`: 1,100 tests, 0 failed. That closes the Node 22 open point for the converter fix.
2. **Seven named tests: met.** They are at `:133`, `:149`, `:176`, `:214`, `:244`, `:297` and `:339`.
3. **Strict packet validation: reported met.** The Changed Packet Validation run is green. I did not rerun the validator.

## What the deviations cost Barter

Barter has already switched, so this is what it changed, per its implementation summary and my check of the end state.

**Layout and manifest**

- **Source layout.** Adopt puts the copy at the destination path minus the leading dot (`:3562`). Barter moved 114 sources with a one-off script and rewrote `source`, `base` and `fragment`, because the engine has no relayout.
- **`generated` format.** The engine wants flat globs, so Barter flattened its grouped list to 33 globs and keeps the generator names in its README.
- **Setting location.** `strictWrites` lives in the manifest. `.skilled-overlays.json` holds only the folder name.

**Hooks and wiring**

- **Commit hook.** `skilled/.opencode/scripts/git-hooks/pre-commit` now runs the engine's `status`, then `pre-commit`.
- **Auto-apply removed.** A hook-killed apply left a stale lock twice, so applying is now a manual command.
- **No runtime-mirror message.** A new file in a runtime folder outside the globs is told to adopt it. I saw this for `.claude/settings.local.json`.

## Recommended work: Skilled

**Fix now**

1. **Turn `main` green.** `references/overlays.md` has 10 trigger phrases and the contract allows 3 to 8. This change added two. Skill Doc Frontmatter failed on `3b787637e1`, and the bot commit `3d665d103d` that carries the tag ran only CodeQL, so nothing has cleared it. Cut two phrases. Done when that workflow passes on `main`.

**Asked by the open handover**

2. **Three engine bugs.** A killed run leaves a lock nothing clears (`:1980`). The engine refuses to retarget its own layout link (`:1481`). `appendItems` never removes an item it added (`:811`). I confirmed all three by reading. Done when the handover's listed tests pass.
3. **Three gaps.** A `relayout` target plus an off-layout line in `status`, an OpenCode adapter for `overlay-guard`, and `status` flagging a stale root-file overlay. No packet exists yet: the folder stops at `008`.

**Defects this review found**

4. **Glob over-match.** On Barter's tree the guard allowed `.skilled/skills/sk-code/my-leaf-manifest.json` through the glob `.skilled/skills/**/leaf-manifest.json`. Fix at `:3515`. Done when a test shows that path refused.
5. **`repin.exclude` is ignored by strict writes.** The guard refused `.opencode/scripts/new-thing.sh` in Barter, although a re-pin never touches that folder. For an existing file there, the message "a re-pin would overwrite this edit" (`:3627`) is false. Exempt excluded paths or reword. Done when a guard test on an excluded path shows the chosen behaviour.
6. **No whole-tree drift check.** Strict writes gate new writes only, and a re-pin checks only paths upstream touched. Barter's tree lacks five upstream links that nothing owns, and no engine command reports them. Add an audit to `status` or a flag. Done when it lists those five on Barter's tree.
7. **Commit check compares blob ids.** Under Barter's `* text=auto`, an upstream file with CRLF endings gets a different staged blob (`:3851`). `icons.html` under `sk-design-diagram` shows it: the working bytes equal upstream and the index blob does not. Staging it outside a re-pin commit would be refused. Done when a test stages such a file and it passes.

**Tests and docs**

8. **Untested paths.** These have no test:
   - the flow the guard itself prescribes, where the file is created in the overlay folder and then adopted (`:3726`);
   - the commit check with the tree below the git top level, which is Barter's shape (`:3822`);
   - the commit check without an upstream checkout (`:3846`);
   - three adopt refusals (`:3727`, `:3736`, `:3749`).
9. **Hook tests are outside CI.** No workflow names `overlay-guard.test.cjs` or the DSH test, and the hooks vitest config skips them. Done when a CI log shows them running.
10. **Playbook.** No manual scenario covers strict writes, adopt, the commit check or root files. The doctor skill has no feature catalog, so nothing is owed there.

## Recommended work: Barter

1. **Push `12f3cd4d4`.** The branch `skilled/v4.0.2.1` is one commit ahead of origin, and that commit is the handover Skilled needs. Done when `git status -sb` shows no "ahead".
2. **Settle the five missing links.** They sit under `skilled/.skilled/hooks/dist-freshness/`: four `check-dist-staleness.sh` links and one OpenCode plugin link. Restore them or add a removal row in `skilled/barter-overlays/overlay-manifest.json`. Otherwise the next re-pin refuses as soon as upstream changes one of them.
3. **Ignore the lock.** `skilled/barter-overlays/.build-lock` is not in `.gitignore`, so a stale lock can be staged. Done when `git check-ignore` matches it.
4. **After Skilled ships the six items,** follow the handover's own list: re-pin through `/doctor:overlay repin`, delete `barter-overlays/opencode/plugins/barter-overlay-guard.js`, its test, `barter-overlays/skilled/hooks/barter-overlay-guard/` and their two manifest entries, register the upstream adapter, then run `status`.

## Risks neither side wrote down

- **A commit that moves the pin skips the whole commit check** (`:3839`). Barter's conversion commit moved the pin and carried 727 files, so none of it was checked. My audit found it clean apart from the five links.
- **The edit hook fails open.** An engine error or timeout allows the write with a stderr note (`overlay-guard.cjs:90-93`). A malformed `strictWrites` value therefore disables the edit-time check, and only the commit check still blocks. Timeouts are unlikely: the guard took about 100 ms on Barter's tree against a 3 s limit.
- **Items 5, 6 and 7 above** are also unrecorded in either packet.

## Confirmed and inferred

**Confirmed by running or reading**

- **Barter's state.** Clean tree, pin `3d665d103d`, `strictWrites` true, engine byte-identical to upstream, no lock file.
- **Guard and commit check on Barter's tree.** Sixteen guard probes behaved as documented, and `pre-commit` printed `allow` with exit 0.
- **Drift audit.** Of 20,447 tracked vendored files, 19,885 equal upstream at the pin. Every difference is owned or allowed by the guard, except the five links and the one line-ending case.
- **CI.** The failing check and its message, and the Node 22 doctor run.
- **The three handover bugs,** by reading the cited lines.

**Inferred**

- **Barter's `status` passes today.** I did not run it, because it executes generator checks from Barter's manifest and I could not be sure they write nothing. Running it and reading `RESULT: PASSED` confirms it.
- **Adopt from an overlay-side source, and a commit-check refusal below the git top level, both work.** I read the code only. The tests in item 8 confirm them.
- **Strict validation of the Skilled packet passes.** Rerun `validate.sh --strict` on it.
- **Whether the missing links break Barter's dist-freshness hook.** Read Barter's hook registry entries for it.

**Status.** Nothing was edited, created or staged in either repository, and no plan file was written. Skill routing: `sk-code`, review mode. The next action is yours: cut two trigger phrases from `.skilled/skills/system-skilled-doctor/references/overlays.md` so `main` goes green, then dispatch the open handover.
