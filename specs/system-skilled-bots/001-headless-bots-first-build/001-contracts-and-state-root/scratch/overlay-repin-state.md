# T018 and T023: what doctor does to `.skilled/skills/.state/`

Evidence for T018 (REQ-017) and T023. Gathered 2026-11-22 in the worktree `/Users/michelkerkmeester/worktrees/public/system-skilled-bots`. Paths are relative to that root unless absolute. `E` below means `.skilled/commands/doctor/scripts/overlay-engine.cjs` (8,993 lines) and `S` means `.skilled/commands/doctor/scripts/symlink-engine.cjs` (1,870 lines).

## Answers

- **T018, re-pin (observed):** a staged re-pin and a live re-pin each kept `.skilled/skills/.state/system-skilled-bots/x/runs/r1/evidence.txt` byte-identical. The sha256 was `809570dfd95cdd6ef74b7ebe463e6a6e6d7d66e3c3cc606cf565a617755280b2` before, in the stage copy and after the live run. That held while the same re-pin copied a tracked `.state` README beside it and deleted a tracked `.state` file in the same folder.
- **T018, reinstall (code-read):** of the flows read, none replaces a vendored tree wholesale. `/doctor:install` writes nothing, the re-pin writes per touched path, `/doctor:update` writes per plan path, and the overlay `relayout` moves overlay copies. A tree rebuilt from an upstream archive or a fresh clone carries no gitignored file, so run folders are lost unless the operator moves them across.
- **T018, `/doctor:symlink` retarget (code-read, plus one observation):** run folders sit in the linked Skilled checkout, not in the consumer. A retarget leaves them in the old checkout, hidden from the consumer, not deleted. Observed: `git check-ignore` on a path below a symlinked `.skilled` fails with exit 128.
- **T023: yes for a linked consumer, conditionally; no for a copied one.** The production code is `S:1017-1029` in `.skilled/commands/doctor/scripts/symlink-engine.cjs` (`buildPlan`): `/doctor:symlink link` writes one `/<link path>` line per link it creates or replaces. For a whole link that line is `/.skilled`, which covers `.state`. In merge mode over an existing real `.skilled/skills/`, the line can be `/.skilled/skills/.state` itself (code-read). The lines go to `<git-dir>/info/exclude` by default (`S:1013`, `S:384-389`) and to `.gitignore` only with `--ignore gitignore` (`S:383`). No doctor flow writes a `.state` line for a copied (vendored) tree. REQ-014's `run-folder-not-ignored` refusal stays the guard.

## T018: code read of the re-pin

Line numbers were checked against the file on 2026-11-22. The task's `6198-6213` is right. The function closes at 6214.

- `E:116` `VENDOR_ROOT = '.skilled'`. `E:117` `DEFAULT_RUNTIME_FOLDERS = ['.claude', '.codex', '.cursor', '.devin', '.dsh', '.opencode', '.pi', '.vibe']`.
- `E:6198-6214` `touchedPaths(job)` builds the only two lists the write step uses:
  - copy: paths that `git diff --diff-filter=AMT old new -- .skilled` names and that are blobs in the new commit (`E:6202-6204`), plus every new-commit blob under a runtime folder (`E:6205-6207`);
  - delete: paths that `git diff --diff-filter=D` names under the roots and that were blobs in the old commit and are not in the new one (`E:6208-6209`);
  - both drop paths under `repin.exclude` (`E:6200`, `E:6211-6212`).
- `E:6101-6111` `listBlobs` reads `git ls-tree -r` of an upstream commit. `E:6113-6117` `diffNames` reads `git diff --name-only` between two upstream commits. Both read the upstream checkout only, never the vendored tree. A gitignored file in the tree is never a blob in either commit, so it is in neither list.
- `E:6879-6888` `repinWrites` deletes each `touched.delete` path, then copies each `touched.copy` path. Nothing else in the tree is written or removed.
- `E:6548-6553` `pruneEmptyParents` removes a parent folder after a delete only while that folder is empty. It stops at the first non-empty folder, so a run folder keeps its parents.
- `E:434-445` `removePath` would remove a folder recursively, but it is called only on `touched.delete` entries, which are old-commit blob paths.
- `E:6555-6570` `copyUpstreamEntry` unlinks and rewrites one path.
- `E:6319-6356` `treeShapeProblems` refuses the run when a copied path would land where the tree holds a folder or sits below a file or link. So an upstream file named like a run folder stops the re-pin instead of overwriting the folder.
- `E:6284-6309` `unownedDrift` checks only touched paths.
- `E:6365-6390` `extractNewCommit` reads the new commit through `git archive` (`E:6374`).
- `E:6157-6159`: root files such as the consumer's `.gitignore` are never copied by a re-pin.
- Tracked `.state` files can be copied. This checkout tracks nine, for example `.skilled/skills/.state/doctor-update/README.md` (`git ls-files .skilled/skills/.state`). A future tracked `.skilled/skills/.state/system-skilled-bots/README.md` would be copied by a re-pin. The run below shows that copy leaves an untracked neighbor alone.
- Stage mode: `E:7172-7211` copies the live tree into an empty stage folder with `copyTreeForStage` (`E:7098` on), which copies every file except the lock file and `.env` files, gitignored files included. It then re-pins the copy. `E:7075-7088` refuses a stage folder inside the tree. `E:6891-6898` skips the regenerate and verify steps in a stage. A stage never writes the live tree.
- Rollback: `E:7224-7301` restores only the paths in the run's `backup.json` and removes only the paths the run created. Those are touched paths, so rollback does not reach an untracked run folder either.

## T018: staged re-pin, observed

The model was the fixture in `.skilled/commands/doctor/scripts/tests/overlay-engine-repin.test.cjs:150-223` (`createRepinFixture`): an upstream git repository with two commits, the old commit extracted as the vendored tree, then `apply` and `status` before the re-pin. The script used the fixture's git `-c` flags, including `core.excludesFile=/dev/null`, so a global ignore could not drop `.state` from the commits.

The run is built so that it could fail. The re-pin touches the evidence file's own subtree. The old commit ships a tracked `.skilled/skills/.state/system-skilled-bots/old.md`. The new commit deletes it, adds a tracked `.skilled/skills/.state/system-skilled-bots/README.md` and changes `.skilled/skills/hub/a.md`. So the delete, the `pruneEmptyParents` walk and a copy all happen in the folder above the run folder.

The script lived in a `mktemp -d` folder outside the worktree, removed after the run. It made its own `mktemp -d` workspace and removed it at the end. It was run with `bash`.

```bash
#!/usr/bin/env bash
# Staged and live overlay re-pin against a vendored tree holding a gitignored .state file.
set -u
ENGINE=/Users/michelkerkmeester/worktrees/public/system-skilled-bots/.skilled/commands/doctor/scripts/overlay-engine.cjs
WS=$(mktemp -d)
G=(git -c user.name=Fixture -c user.email=fixture@example.invalid -c commit.gpgsign=false
   -c core.hooksPath=/dev/null -c init.defaultBranch=main -c core.excludesFile=/dev/null)
UP="$WS/upstream"; TREE="$WS/tree"; STAGE="$WS/stage"
REL=.skilled/skills/.state/system-skilled-bots/x/runs/r1/evidence.txt
echo "workspace=$WS"

# Upstream: old commit ships a.md v1 and a tracked .state file; new commit
# changes a.md, deletes the tracked .state file, and adds a tracked .state README.
mkdir -p "$UP"; "${G[@]}" -C "$UP" init -q
mkdir -p "$UP/.skilled/skills/hub" "$UP/.skilled/skills/.state/system-skilled-bots"
printf 'a v1\n' > "$UP/.skilled/skills/hub/a.md"
printf 'old tracked state\n' > "$UP/.skilled/skills/.state/system-skilled-bots/old.md"
"${G[@]}" -C "$UP" add -A; "${G[@]}" -C "$UP" commit -q -m old
OLD=$("${G[@]}" -C "$UP" rev-parse HEAD)
printf 'a v2\n' > "$UP/.skilled/skills/hub/a.md"
rm "$UP/.skilled/skills/.state/system-skilled-bots/old.md"
printf 'tracked readme\n' > "$UP/.skilled/skills/.state/system-skilled-bots/README.md"
"${G[@]}" -C "$UP" add -A; "${G[@]}" -C "$UP" commit -q -m new
NEW=$("${G[@]}" -C "$UP" rev-parse HEAD)
echo "old=$OLD new=$NEW"
echo "--- upstream diff old..new"; "${G[@]}" -C "$UP" diff --name-status "$OLD" "$NEW"

# Vendored tree: the old commit, extracted, plus an overlay folder with an empty manifest.
mkdir -p "$TREE"; "${G[@]}" -C "$UP" archive --format=tar "$OLD" | tar -xf - -C "$TREE"
mkdir -p "$TREE/skilled-overlays"
cat > "$TREE/skilled-overlays/overlay-manifest.json" <<JSON
{"schemaVersion": 1, "pin": {"upstream": "fixture", "commit": "$OLD"},
 "layoutLinks": [], "overlays": [], "regenerate": [], "verifyGenerated": []}
JSON
# Consumer repository around the tree, with the ignore line, then the evidence file.
printf '.skilled/skills/.state/*/*\nskilled-overlays/sync-state.json\nskilled-overlays/.build-lock\nskilled-overlays/repin-runs/\n' > "$TREE/.gitignore"
"${G[@]}" -C "$TREE" init -q; "${G[@]}" -C "$TREE" add -A; "${G[@]}" -C "$TREE" commit -q -m vendored
mkdir -p "$TREE/$(dirname $REL)"; printf 'run r1 evidence\nline two\n' > "$TREE/$REL"
echo "--- git check-ignore -v (consumer)"; "${G[@]}" -C "$TREE" check-ignore -v "$REL"; echo "exit=$?"
echo "--- git status --short --ignored (consumer)"; "${G[@]}" -C "$TREE" status --short --ignored
BEFORE=$(shasum -a 256 "$TREE/$REL" | cut -d' ' -f1); echo "sha256 before=$BEFORE"

cd "$WS"
echo "--- apply"; node "$ENGINE" apply --root "$TREE"; echo "exit=$?"
echo "--- status"; node "$ENGINE" status --root "$TREE"; echo "exit=$?"
echo "--- repin --stage"; node "$ENGINE" repin --upstream "$UP" --to "$NEW" --stage "$STAGE" --root "$TREE"; echo "exit=$?"
echo "--- stage listing"; (cd "$STAGE" && find .skilled -type f | sort)
echo "sha256 staged=$(shasum -a 256 "$STAGE/$REL" 2>&1 | cut -d' ' -f1)"
echo "sha256 live after stage=$(shasum -a 256 "$TREE/$REL" | cut -d' ' -f1)"
cmp "$TREE/$REL" "$STAGE/$REL"; echo "cmp staged exit=$?"
echo "--- repin (live, in the temp tree)"; node "$ENGINE" repin --upstream "$UP" --to "$NEW" --root "$TREE"; echo "exit=$?"
echo "--- live listing"; (cd "$TREE" && find .skilled -type f | sort)
AFTER=$(shasum -a 256 "$TREE/$REL" | cut -d' ' -f1); echo "sha256 live after repin=$AFTER"
[ "$BEFORE" = "$AFTER" ] && echo "BYTE-IDENTICAL: yes" || echo "BYTE-IDENTICAL: no"
echo "--- git status --short --ignored (consumer, after live repin)"; "${G[@]}" -C "$TREE" status --short --ignored
rm -rf "$WS"; echo "removed workspace: $([ -e "$WS" ] && echo no || echo yes)"
```

Output, verbatim (`bash repin-state.sh; echo "script-exit=$?"`):

```
workspace=/var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/tmp.rLT1hCSQ4d
old=f4bc0d1d9d77d4d716bed029b0991f0f2bdb01b0 new=5f4c8a9beb0ddd3a8a7c75d620f52e80f3a6baaa
--- upstream diff old..new
A	.skilled/skills/.state/system-skilled-bots/README.md
D	.skilled/skills/.state/system-skilled-bots/old.md
M	.skilled/skills/hub/a.md
--- git check-ignore -v (consumer)
.gitignore:1:.skilled/skills/.state/*/*	.skilled/skills/.state/system-skilled-bots/x/runs/r1/evidence.txt
exit=0
--- git status --short --ignored (consumer)
!! .skilled/skills/.state/
sha256 before=809570dfd95cdd6ef74b7ebe463e6a6e6d7d66e3c3cc606cf565a617755280b2
--- apply
0 changed
exit=0
--- status
in-sync=0 overlay-edited=0 live-edited=0 both-changed=0 upstream-moved=0 cannot-apply=0
checked=1 ok=1 miss=0
RESULT: PASSED
exit=0
--- repin --stage
staged a copy of the tree in /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/tmp.rLT1hCSQ4d/stage
backup of 4 paths in skilled-overlays/repin-runs/20261122T153817Z-f7f70d
copy 2 paths, delete 1 paths
0 changed
0 changed
checked=1 ok=1 miss=0
RESULT: STAGED
exit=0
--- stage listing
.skilled/skills/.state/system-skilled-bots/README.md
.skilled/skills/.state/system-skilled-bots/x/runs/r1/evidence.txt
.skilled/skills/hub/a.md
sha256 staged=809570dfd95cdd6ef74b7ebe463e6a6e6d7d66e3c3cc606cf565a617755280b2
sha256 live after stage=809570dfd95cdd6ef74b7ebe463e6a6e6d7d66e3c3cc606cf565a617755280b2
cmp staged exit=0
--- repin (live, in the temp tree)
backup of 4 paths in skilled-overlays/repin-runs/20261122T153818Z-130fc1
copy 2 paths, delete 1 paths
0 changed
0 changed
checked=1 ok=1 miss=0
RESULT: PASSED
exit=0
--- live listing
.skilled/skills/.state/system-skilled-bots/README.md
.skilled/skills/.state/system-skilled-bots/x/runs/r1/evidence.txt
.skilled/skills/hub/a.md
sha256 live after repin=809570dfd95cdd6ef74b7ebe463e6a6e6d7d66e3c3cc606cf565a617755280b2
BYTE-IDENTICAL: yes
--- git status --short --ignored (consumer, after live repin)
 M .skilled/skills/hub/a.md
 M skilled-overlays/overlay-manifest.json
!! .skilled/skills/.state/
!! skilled-overlays/repin-runs/
!! skilled-overlays/sync-state.json
removed workspace: yes
script-exit=0
```

What it shows:
- `copy 2 paths, delete 1 paths` matches the upstream diff: `a.md` and the new `.state` README copied, `old.md` deleted. The re-pin really worked inside `.skilled/skills/.state/system-skilled-bots/`.
- `evidence.txt` is in both listings and its sha256 never changed, in the stage copy (`cmp` exit 0) or the live tree after the live run. `old.md` is gone and its folder stayed, because the run folder kept it non-empty.
- The live tree was untouched by the stage run (sha256 unchanged after the stage, and the live run then still had work to do).
- After the live run, the consumer's `git status` lists only the two intended tracked changes. The `.state` subtree stays ignored (`!!`), the copied README included, because the consumer's line `.skilled/skills/.state/*/*` also matches it.
- Limits: the stage skipped regenerate and verify (`E:6891-6898`). The fixture manifest had no overlays, so no overlay apply was exercised. The tree was not under `repin.exclude`. One run, on git 2.50.1 (Apple Git-155) and macOS.

## T018: reinstall that replaces the tree (code-read, not observed)

- `/doctor:install` writes nothing. `.skilled/commands/doctor/install.md:10` says "It writes nothing. Every step that writes is printed for the operator to run", and `install.md:18` says it "never runs a target that writes". Its steps are the `symlink-engine.cjs` check and printed commands (`install.md:72-75`).
- Of the doctor flows read, none replaces a vendored `.skilled` wholesale:
  - The re-pin is the doctor path for moving a vendored tree, and it writes only touched paths (above).
  - The overlay `relayout` (`E:8397` `planRelayout`, `E:8849` `commandRelayout`) is documented as "Move the off-layout copies a manifest keeps onto their layout paths" (`E:8845`). It moves overlay copies, not the tree. Its body was not read line by line.
  - `/doctor:update` (`release-update.cjs`) writes one plan path at a time through `writeAtomic` (`.skilled/commands/doctor/scripts/release-update.cjs:2267-2292`), which removes a path only when the plan entry is empty (`:2275-2277`). Its workflow rule allows "release writes only when the exact path appears in the engine plan" (`.skilled/commands/doctor/assets/doctor-update-apply.yaml:85`). The same rule names lane cleanup deletes of "fixed names under resolved roots"; those names were not read. `release-update.cjs` keeps its own state under `.skilled/skills/.state/doctor-update` (`release-update.cjs:23`).
  - Searches: `rg -n "^function \w*[Rr]elayout\w*\(" E` (exit 0, ten functions from `E:8397` to `E:8849`) and `rg -n "rmSync|.clean.|.reset.|.checkout.|.restore." .skilled/commands/doctor/scripts/release-update.cjs` (exit 0; every `rmSync` hit is a temp file, a lock file or `writeAtomic`'s single destination, at lines 1600, 2210, 2239, 2276, 2290, 2405, 2591, 2686).
- An operator reinstall outside doctor, such as deleting `.skilled` and extracting a new archive or cloning again, starts from committed blobs only. `git archive`, as the engine itself uses it (`E:6374`), carries no gitignored file. Every run folder under `.skilled/skills/.state/system-skilled-bots/` is lost unless it is moved across by hand. Inferred from how archives and clones work, not run here.
- Consequence for this phase: the run record and index live user-level (spec REQ-003, REQ-014), so a lost run folder loses evidence, not the record. A record whose folder is gone reads back with the folder reported missing (REQ-014).

## T018: `/doctor:symlink` retarget (code-read, plus one observation)

- A linked consumer holds `.skilled` as a link into a Skilled checkout. That is a whole link (`S:968-972`), or in merge mode a real folder whose missing children are each linked (`S:962-967`, `S:882-885`). Either way `.skilled/skills/.state/` resolves into the checkout. Run folders written through it land in that checkout's `.state`, which the checkout's own root `.gitignore:135` ignores. `S:560-561` `UNMIRRORED_PATHS` excludes only `.skilled/output` and `.claude/worktrees` from merge linking, not `.state`.
- There is no retarget action. For an existing link, `S:979-989` skips a link that already points at this checkout (`S:981`), replaces only a broken link whose text points into this checkout (`S:982-985`), and otherwise refuses with `'a foreign or non-source broken link exists'` (`S:987`). A link to a different, live checkout is therefore refused. A retarget means `unlink`, which removes only the links one run recorded (`.skilled/commands/doctor/symlink.md:92`), then `link` against the other checkout.
- Effect on run folders: nothing in `unlink` or `link` touches the target checkout's files. The run folders stay in the old checkout's `.state`, hidden from the consumer after the retarget, not deleted. In whole mode one checkout's `.state` is shared by every consumer linked to it, which is why the run root keys folders by identity (`<identity key>/runs/<run id>/`).
- Observation, run 2026-11-22 with `bash link-ignore.sh` from a `mktemp -d` folder, since removed. It builds a temp consumer whose `.skilled` is a whole link, as `link` makes it:

```bash
#!/usr/bin/env bash
set -u
WS=$(mktemp -d)
G=(git -c core.excludesFile=/dev/null -c init.defaultBranch=main)
mkdir -p "$WS/checkout/.skilled/skills/.state" "$WS/consumer"
"${G[@]}" -C "$WS/consumer" init -q
ln -s "$WS/checkout/.skilled" "$WS/consumer/.skilled"
printf '/.skilled\n' >> "$WS/consumer/.git/info/exclude"
REL=.skilled/skills/.state/system-skilled-bots/x/runs/r1/evidence.txt
echo "--- check-ignore on the link itself"; "${G[@]}" -C "$WS/consumer" check-ignore -v .skilled; echo "exit=$?"
echo "--- check-ignore on a path below the link"; "${G[@]}" -C "$WS/consumer" check-ignore -v "$REL"; echo "exit=$?"
echo "--- same, with the ignore line in .gitignore instead"; : > "$WS/consumer/.git/info/exclude"
printf '.skilled/skills/.state/*/*\n' > "$WS/consumer/.gitignore"
"${G[@]}" -C "$WS/consumer" check-ignore -v "$REL"; echo "exit=$?"
rm -rf "$WS"; echo "removed workspace: $([ -e "$WS" ] && echo no || echo yes)"
```

Output (`bash link-ignore.sh 2>&1; echo "script-exit=$?"`):

```
--- check-ignore on the link itself
.git/info/exclude:7:/.skilled	.skilled
exit=0
--- check-ignore on a path below the link
fatal: pathspec '.skilled/skills/.state/system-skilled-bots/x/runs/r1/evidence.txt' is beyond a symbolic link
exit=128
--- same, with the ignore line in .gitignore instead
fatal: pathspec '.skilled/skills/.state/system-skilled-bots/x/runs/r1/evidence.txt' is beyond a symbolic link
exit=128
removed workspace: yes
script-exit=0
```

  Asked from the consumer, git cannot answer for a path below the link. It exits 128, not 0 or 1. The REQ-014 guard must treat that as its own case, or ask git in the repository that really holds the file (the checkout the link resolves to). This is an open item for the resolver design, not part of T018's question.

## T023: does a doctor flow add `.skilled/skills/.state/` to a consumer's `.gitignore`?

**Yes for a linked consumer, conditionally. No for a copied (vendored) one.** No doctor flow writes the literal `.skilled/skills/.state/` line the test fixture writes. One flow writes a line that covers it.

The production code that adds it:
- `/doctor:symlink link`, through `S` `apply`, planned in `buildPlan` at `S:1017-1029`. The plan collects the link paths it creates or replaces (`ignoreCandidates`, `S:948`, `S:971`, `S:985`, `S:884`, `S:892`). It adds `'/' + relative` for each one git does not already ignore (`S:1017-1022`) as one `ignore-add` action (`S:1029`).
- Which line: for a whole link it is `/.skilled`, which covers `.state` because it covers the whole link. In merge mode, when the consumer already holds a real `.skilled/skills/` folder, `planMergeTree` recurses into it (`S:898-900`), links the absent `.state` child to the checkout (`S:882-885`) and queues `/.skilled/skills/.state` itself. That merge-mode case is code-read, not run.
- Which file: `<git-dir>/info/exclude` by default (`S:1013`, `S:384-389`), `.gitignore` only with `--ignore gitignore` (`S:383`), and none with `--ignore none` (`S:1008-1009`). It writes nothing when the root is not a git work tree (`S:1010-1011`). `.skilled/commands/doctor/symlink.md:61` documents the flag, `.skilled/commands/doctor/scripts/README.markdown:228` documents the writes.
- In both cases the covered files physically live in the linked checkout, and asking git about a path below the link from the consumer exits 128 (observed above).

What does not add it:
- `/doctor:install` writes nothing (`install.md:10`, `install.md:18`).
- The overlay engine only reads ignore state: `E:7452-7454` `isIgnoredByGit` runs `git check-ignore`. Its one caller is `strictWriteRefusal` (`E:7511-7519`), called from `commandGuard` (`E:5966`, call at `E:6000`). With `strictWrites` on, a write to a vendored key under `.skilled/` is refused unless it is generated or git-ignored. That is why the test fixture writes the line itself (`.skilled/commands/doctor/scripts/tests/overlay-engine-strict-writes.test.cjs:94`). The fixture is test setup, not product behavior.
- A copied (vendored) tree gets no ignore line from any doctor flow. This checkout's own coverage is its root `.gitignore:134-137` (`.skilled/skills/.state/*/*` with a README negation) and `.gitignore:274` (`/*/**/.skilled/skills/.state/`). A root file is never copied by a re-pin (`E:6157-6159`). No tracked `.gitignore` sits under `.skilled/` that would cover `.state`. The only two under `.skilled/` are `.skilled/skills/sk-design/sk-design-md-generator/styles/database/.gitignore` and `.skilled/skills/system-skill-advisor/runtime/database/.gitignore`.

So a vendored consumer is ignored only if its owner added the line. REQ-014's `run-folder-not-ignored` refusal stays the guard, as T023 expects.

Searches run (each under `bash -c` from the worktree root, `echo "exit=$?"` after the unpiped command):

```
$ rg -n --no-heading "gitignore" .skilled/commands/doctor/scripts --glob "!tests/**" --glob "!*.md*"
```
That glob did not exclude the tests folder. Its non-test hits were only `symlink-engine.cjs:192` (flag check) and `symlink-engine.cjs:383` (`return '.gitignore'`). Test hits that write a `.gitignore`: `overlay-engine-strict-writes.test.cjs:94` and `:127`, `release-update.test.cjs:263` and `:1897`, `overlay-engine-follow-up.test.cjs:2309`, `agents-md-embed.test.cjs:1035`, `doctor-update-compat-integration.test.cjs:136`.

```
$ rg -n "gitignore|check-ignore" .skilled/commands/doctor/scripts --glob "!**/tests/**"
.skilled/commands/doctor/scripts/README.markdown:228:| `symlink-engine.cjs` | ... the ignore lines its `--ignore` choice names in `.gitignore` or the repository's `info/exclude` ...
.skilled/commands/doctor/scripts/agents-md-embed.cjs:974:  const ignored = spawnSync('git', ['-C', root, '-c', 'core.fsmonitor=false', 'check-ignore', '-q', probe], {
.skilled/commands/doctor/scripts/overlay-engine.cjs:7453:  return runGit(root, ['check-ignore', '-q', '--', filePath]).status === 0;
.skilled/commands/doctor/scripts/symlink-engine.cjs:192:  if (['plan', 'apply'].includes(options.command) && !['exclude', 'gitignore', 'none'].includes(options.ignore)) {
.skilled/commands/doctor/scripts/symlink-engine.cjs:383:  if (kind === 'gitignore') return '.gitignore';
.skilled/commands/doctor/scripts/symlink-engine.cjs:399:  const result = git(root, ['check-ignore', '-q', '--', relative.split(path.sep).join('/')]);
.skilled/commands/doctor/scripts/symlink-engine.cjs:402:  throw new PreconditionError('git check-ignore failed for ' + relative + ': ' + (result.stderr || '').trim());
exit=0

$ rg -n "skills/\.state|gitignore|check-ignore" .skilled/commands/doctor/scripts/release-update.cjs
23:const STATE_DIR = '.skilled/skills/.state/doctor-update';

$ rg -n "strictWriteRefusal\(" .skilled/commands/doctor/scripts/overlay-engine.cjs
6000:  const refusal = strictWriteRefusal(ctx, manifest, inputPath);
7511:function strictWriteRefusal(ctx, manifest, inputPath) {
exit=0

$ git -C /Users/michelkerkmeester/worktrees/public/system-skilled-bots ls-files | rg "(^|/)\.gitignore$"
(43 paths; the root .gitignore, three under .pi/, the two under .skilled/ named above, the rest under specs/)
exit=0

$ rg -n "\.state" /Users/michelkerkmeester/worktrees/public/system-skilled-bots/.gitignore
131:# Excluding the .state directories themselves would make the README negation
134:.opencode/skills/.state/*/*
135:.skilled/skills/.state/*/*
136:!.opencode/skills/.state/*/README.md
137:!.skilled/skills/.state/*/README.md
269:# Runtime state was consolidated under .state/, but the leak these rules catch
272:# it. Nested only - the real .state/ at the repository root stays visible.
273:/*/**/.opencode/skills/.state/
274:/*/**/.skilled/skills/.state/
exit=0
```

(Line 272 holds an em dash in the file; it is shown here with a hyphen.)

```
$ rg -n -i -l "gitignore" .skilled/commands/doctor --glob "!**/tests/**"
.skilled/commands/doctor/_routes.yaml
.skilled/commands/doctor/symlink.md
.skilled/commands/doctor/scripts/symlink-engine.cjs
.skilled/commands/doctor/assets/agents-md-manifest.json
.skilled/commands/doctor/assets/doctor-symlink-link.yaml
.skilled/commands/doctor/assets/doctor-update-apply.yaml
.skilled/commands/doctor/scripts/README.markdown
.skilled/commands/doctor/assets/doctor-update-align.yaml
.skilled/commands/doctor/assets/doctor-symlink-presentation.txt
exit=0

$ rg -n "skills/\.state" .skilled/commands/doctor/scripts/symlink-engine.cjs .skilled/commands/doctor/scripts/overlay-engine.cjs
exit=1
```

The line-level hits in those files were read from an earlier run of the same search with `-n` instead of `-l`, piped through `head`, so that run's exit status was not captured. Apart from `symlink-engine.cjs`, the files matched only documentation of the symlink `--ignore` flag (`_routes.yaml:587`, `assets/doctor-symlink-presentation.txt:76` and `:305`, `assets/doctor-symlink-link.yaml:30` and `:56`, `symlink.md:61`), the doctor-update run-directory rules (`assets/doctor-update-align.yaml:18`, `:29`, `:103`, `assets/doctor-update-apply.yaml:85`, `:111`), and AGENTS.md text embedded in `assets/agents-md-manifest.json`. None adds an ignore line for `.state`. The doctor-update rules require their own run folder under `.skilled/skills/.state/doctor-update/runs` to already be gitignored; they check, they do not add.

## Not observed

- A re-pin with a real overlay set, with `strictWrites` on, or with regenerate and verify steps running. The live run had empty overlays and generators.
- A reinstall that replaces the tree. No doctor flow does it, and none was run.
- A `/doctor:symlink` unlink and relink cycle. The retarget case is code-read. Only the `git check-ignore` behavior below a link was run.
- `/doctor:update` was read only at `writeAtomic`, its constants and the apply workflow's path rule. Its lane cleanup names and the overlay `relayout` body were not read line by line.
- The merge-mode `/.skilled/skills/.state` ignore line is code-read, not run.
