---
title: "492 -- Spec packet relocation and renumbering"
description: "This scenario validates spec packet relocation for `492`. It focuses on the relocate.mjs dry run, a refused move onto an archived number, an applied renumber, exit status 3 and a rerun after a failed late step, all inside a throwaway copy of the checkout."
version: 1.0.1.0
---

# 492 -- Spec packet relocation and renumbering

This document captures the throwaway-copy manual validation contract for `relocate.mjs`.

---

## 1. OVERVIEW

This scenario validates spec packet relocation for `492`. It focuses on the `relocate.mjs` dry run, a refused move onto an archived number, an applied renumber, exit status 3 and a rerun after a failed late step. Every command runs inside a throwaway copy of the checkout under the operating-system temp directory. It never moves or rewrites anything in this checkout's `specs/` tree.

### Why This Matters

A packet's path is recorded in its own `description.json` and `graph-metadata.json`, in other packets' references, in the track root and in the relocation ledger. A folder moved by hand leaves most of those naming the old place. The tool is dry by default and refuses before the first write, so an operator can read the whole plan before anything changes.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `492` and confirm each outcome without contradictory evidence.

- Objective: Prove that `relocate.mjs` prints a complete plan and writes nothing without `--apply`, refuses a destination number that an archived packet holds, moves the folders when `--apply` is passed in a throwaway copy, exits 3 when the only failure is a moved packet's own `RESULT: FAILED`, and finishes a run that stopped on a failed late step when the same command runs again.
- Real user request: `The demo track has gaps in its packet numbers. Show me what a renumber would change before anything moves, then apply it in a throwaway copy and tell me where the packets ended up.`
- Prompt: `Renumber the demo track with relocate.mjs in a throwaway copy of this checkout. Show the dry run first, confirm a move onto the archived number 002 is refused, then apply the renumber and report where each packet landed. Then move a packet that fails its own validation, and rerun a move whose trigger index step failed once. Return PASS or FAIL with the copy path and the exit codes.`
- Expected execution process: Copy the checkout without its `specs/` tree into the operating-system temp directory, build a small `demo` track there, commit it, run the dry runs and the refused move, apply the renumber, list the folders and rerun the dry run, then move a packet with a missing required file and rerun a move after its trigger index step failed once.
- Expected signals: The dry runs exit `1` and print `relocate: dry run, nothing written (pass --apply to write)`. The refused move exits `2` and prints `relocate: nothing was written`. The applied run prints `relocate: applied 2 move(s)`, and the rerun prints `relocate: no moves to make; nothing to do` with exit `0`. The move of the broken packet exits `3`, and its dry rerun prints `relocate: nothing to do`. The move whose trigger index step fails exits `2`, its rerun exits `0` with `finished 1 earlier move(s)`, and the dry run after it prints `relocate: nothing to do`.
- Desired user-visible outcome: A concise `PASS` with the copy path and the exit codes, or a `FAIL` that names the first violated check.
- Pass/fail: PASS if every condition in Section 3 Pass / Fail holds, FAIL if any one does not.

---

## 3. TEST EXECUTION

### Prompt

```text
Renumber the demo track with relocate.mjs in a throwaway copy of this checkout. Show the dry run first, confirm a move onto the archived number 002 is refused, then apply the renumber and report where each packet landed. Then move a packet that fails its own validation, and rerun a move whose trigger index step failed once. Return PASS or FAIL with the copy path and the exit codes.
```

### Commands

1. From the repository root, copy the checkout without its `specs/` tree and its git data into a fresh temp directory. Confirm the printed path begins with the operating-system temp directory and is not the repository root. The copy carries the tooling because an applied run also rebuilds the trigger index, and that writer resolves its repository from the script's own location.

   ```bash
   export RELOCATE_REPO="$(pwd -P)"
   export RELOCATE_COPY="$(cd "$(mktemp -d "${TMPDIR:-/tmp}/relocate-manual.XXXXXX")" && pwd -P)"
   rsync -a --exclude .git --exclude specs "$RELOCATE_REPO/" "$RELOCATE_COPY/"
   printf 'RELOCATE_COPY=%s\n' "$RELOCATE_COPY"
   ```

2. Build the fixture track inside the copy with `create.sh` and `archive.sh`. It holds three live packets numbered `001`, `004` and `006`, and one archived packet numbered `002`. The first packet names `specs/demo/004-beta` in its text. `git init` comes first, so the copy is its own git work tree before the scripts run. Do not write the packets by hand. A hand-written `graph-metadata.json` with no `manual` or `derived` object stops step 7 at the identity step with `Invalid graph metadata` and `relocate: stopped`.

   ```bash
   cd "$RELOCATE_COPY"
   mkdir -p specs/demo
   printf '{"level":"track","specFolder":"demo","description":"Fixture track."}\n' > specs/demo/description.json
   printf '{"schema_version":1,"packet_id":"demo","spec_folder":"demo","parent_id":null,"children_ids":[]}\n' > specs/demo/graph-metadata.json
   git init --quiet
   for p in 001-alpha 004-beta 006-gamma 002-old; do bash .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh --path specs/demo/$p --level 1 "Fixture packet $p" > /dev/null; done
   bash .skilled/skills/system-spec-kit/runtime/cli/spec/archive.sh --force specs/demo/002-old
   printf '\nFollow-up work lives in specs/demo/004-beta.\n' >> specs/demo/001-alpha/spec.md
   ```

3. Commit the fixture. The tool refuses a run that would rewrite a file with uncommitted changes, and an untracked file counts as one.

   ```bash
   cd "$RELOCATE_COPY" && git add -f specs
   git -c commit.gpgsign=false -c user.name=Fixture -c user.email=fixture@example.com commit --quiet --no-verify -m fixture
   ```

4. Dry-run the renumber of the whole track.

   ```bash
   cd "$RELOCATE_COPY" && node .skilled/skills/system-spec-kit/runtime/cli/spec/relocate.mjs --renumber demo
   echo "RENUMBER_DRY_EXIT=$?"
   ```

5. Dry-run a single move with `--from` and `--to`.

   ```bash
   cd "$RELOCATE_COPY" && node .skilled/skills/system-spec-kit/runtime/cli/spec/relocate.mjs --from demo/006-gamma --to demo/005-gamma
   echo "MOVE_DRY_EXIT=$?"
   ```

6. Ask for a move onto the number the archived packet holds, then list the track to confirm nothing moved.

   ```bash
   cd "$RELOCATE_COPY" && node .skilled/skills/system-spec-kit/runtime/cli/spec/relocate.mjs --from demo/006-gamma --to demo/002-gamma
   echo "REFUSED_EXIT=$?"
   ls specs/demo specs/demo/z_archive
   ```

7. Apply the renumber inside the copy, then list the track again.

   ```bash
   cd "$RELOCATE_COPY" && node .skilled/skills/system-spec-kit/runtime/cli/spec/relocate.mjs --renumber demo --apply
   echo "APPLY_EXIT=$?"
   ls specs/demo specs/demo/z_archive
   ```

8. Rerun the dry run. A track with no gap left has no moves to make.

   ```bash
   cd "$RELOCATE_COPY" && node .skilled/skills/system-spec-kit/runtime/cli/spec/relocate.mjs --renumber demo
   echo "RERUN_EXIT=$?"
   ```

9. Commit the renumber, then remove a required file from `004-gamma` and commit that too, so the packet fails its own strict validation.

   ```bash
   cd "$RELOCATE_COPY" && git add -A specs && git -c commit.gpgsign=false -c user.name=Fixture -c user.email=fixture@example.com commit --quiet --no-verify -m renumber
   rm specs/demo/004-gamma/tasks.md
   git add -A specs && git -c commit.gpgsign=false -c user.name=Fixture -c user.email=fixture@example.com commit --quiet --no-verify -m break
   ```

10. Move the broken packet, then dry-run the same move. The move lands and only the packet's own validation fails, so the run exits `3` and the dry run finds nothing left.

    ```bash
    cd "$RELOCATE_COPY" && node .skilled/skills/system-spec-kit/runtime/cli/spec/relocate.mjs --from demo/004-gamma --to demo/005-gamma --apply
    echo "STATUS3_EXIT=$?"
    node .skilled/skills/system-spec-kit/runtime/cli/spec/relocate.mjs --from demo/004-gamma --to demo/005-gamma
    echo "STATUS3_RERUN_EXIT=$?"
    ```

11. Commit, then make the copy's trigger index writer fail for one run and move a healthy packet. The run stops at that late step. Put the writer back afterwards.

    ```bash
    cd "$RELOCATE_COPY" && git add -A specs && git -c commit.gpgsign=false -c user.name=Fixture -c user.email=fixture@example.com commit --quiet --no-verify -m status3
    T=.skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs
    cp "$T" "$T.keep" && printf 'process.exit(1);\n' > "$T"
    node .skilled/skills/system-spec-kit/runtime/cli/spec/relocate.mjs --from demo/003-beta --to demo/007-beta --apply
    echo "LATE_FAIL_EXIT=$?"
    mv "$T.keep" "$T"
    ```

12. Run the same move again to finish it, then dry-run it.

    ```bash
    cd "$RELOCATE_COPY" && node .skilled/skills/system-spec-kit/runtime/cli/spec/relocate.mjs --from demo/003-beta --to demo/007-beta --apply
    echo "LATE_RERUN_EXIT=$?"
    node .skilled/skills/system-spec-kit/runtime/cli/spec/relocate.mjs --from demo/003-beta --to demo/007-beta
    echo "LATE_FINAL_EXIT=$?"
    ```

13. Remove the copy.

   ```bash
   cd "$RELOCATE_REPO" && rm -rf "$RELOCATE_COPY"
   ```

### Expected

Step 4 prints this plan and `RENUMBER_DRY_EXIT=1`. The live packet after the gap moves to `003`, not `002`, because the archived packet still owns `002`.

```text
relocate: dry run, nothing written (pass --apply to write)
  move     specs/demo/004-beta -> specs/demo/003-beta
  move     specs/demo/006-gamma -> specs/demo/004-gamma
  rewrite  specs/demo/001-alpha/spec.md: 1 reference(s)
  rewrite  specs/demo/003-beta/description.json (moved): 1 reference(s)
  rewrite  specs/demo/003-beta/graph-metadata.json (moved): 2 reference(s)
  rewrite  specs/demo/004-gamma/description.json (moved): 1 reference(s)
  rewrite  specs/demo/004-gamma/graph-metadata.json (moved): 2 reference(s)
  rewrite  specs/demo/graph-metadata.json: 2 reference(s)
  identity specs/demo/003-beta: moved -> migrate-generated-json --only, repair-derived --apply
  identity specs/demo/004-gamma: moved -> migrate-generated-json --only, repair-derived --apply
  re-derive specs/demo/001-alpha (references rewritten)
  roots    demo -> refresh-track-roots --apply
  ledger   .skilled/skills/sk-doc/shared/scripts/relocation-ledger.json: record 2 move(s)
  then     cite-drift-scan --rebuild-redirects, generate-trigger-index, sweep-track-roots, validate.sh --strict on 2 moved packet(s)

moves=2 moved=0 rewrites=6 identity=2 roots=1 ledger=2
```

Step 5 prints this plan and `MOVE_DRY_EXIT=1`.

```text
relocate: dry run, nothing written (pass --apply to write)
  move     specs/demo/006-gamma -> specs/demo/005-gamma
  rewrite  specs/demo/005-gamma/description.json (moved): 1 reference(s)
  rewrite  specs/demo/005-gamma/graph-metadata.json (moved): 2 reference(s)
  rewrite  specs/demo/graph-metadata.json: 1 reference(s)
  identity specs/demo/005-gamma: moved -> migrate-generated-json --only, repair-derived --apply
  roots    demo -> refresh-track-roots --apply
  ledger   .skilled/skills/sk-doc/shared/scripts/relocation-ledger.json: record 1 move(s)
  then     cite-drift-scan --rebuild-redirects, generate-trigger-index, sweep-track-roots, validate.sh --strict on 1 moved packet(s)

moves=1 moved=0 rewrites=3 identity=1 roots=1 ledger=1
```

Step 6 prints the refusal, `REFUSED_EXIT=2` and an unchanged listing.

```text
relocate: refused: to specs/demo/002-gamma: number 002 is already used by specs/demo/z_archive/002-old
relocate: nothing was written
```

```text
specs/demo:
001-alpha
004-beta
006-gamma
description.json
graph-metadata.json
z_archive

specs/demo/z_archive:
002-old
```

Step 7 opens with `relocate: applying` and repeats the step 4 plan. It then prints one `step` line per stage, the applied line, the closing sweep and one closing validation for each moved packet. `APPLY_EXIT` is `0` and both closing validations print `RESULT: PASSED`.

```text
step declare sub-tracks: ok (0)
step move: ok (2 folder(s))
step rewrite references: ok (6 file(s))
step description identity (migrate-generated-json --only): ok
step graph identity and pointers specs/demo/003-beta (repair-derived): ok
step graph identity and pointers specs/demo/004-gamma (repair-derived): ok
step re-derive packets whose references changed (repair-derived): ok
step track roots (refresh-track-roots): ok
step ledger: ok (2 move(s))
step redirect table (cite-drift-scan --rebuild-redirects): ok
step trigger index (generate-trigger-index): ok
relocate: applied 2 move(s)

close sweep-track-roots: ok
close validate specs/demo/003-beta: RESULT: PASSED
close validate specs/demo/004-gamma: RESULT: PASSED
APPLY_EXIT=0
```

The listing shows the two moved packets on `003` and `004`, with `002-old` still archived.

```text
specs/demo:
001-alpha
003-beta
004-gamma
description.json
graph-metadata.json
z_archive

specs/demo/z_archive:
002-old
```

Step 8 prints `relocate: no moves to make; nothing to do` and `RERUN_EXIT=0`.

Step 10 applies the move, then closes on the packet's own failed validation and `STATUS3_EXIT=3`. The dry run then prints `relocate: nothing to do` and `STATUS3_RERUN_EXIT=0`.

```text
relocate: applied 1 move(s)

close sweep-track-roots: ok
    x FILE_EXISTS: Missing 1 required file(s) for Level 1
    x LEVEL_MATCH: Level consistency errors
    Summary: Errors: 2  Warnings: 4
close validate specs/demo/005-gamma: RESULT: FAILED
STATUS3_EXIT=3
relocate: dry run, nothing written (pass --apply to write)
  moved    specs/demo/004-gamma -> specs/demo/005-gamma (already at its destination)

moves=0 moved=1 rewrites=0 identity=0 roots=0 ledger=0
relocate: nothing to do
STATUS3_RERUN_EXIT=0
```

Step 11 lands every step up to the trigger index, then stops with `LATE_FAIL_EXIT=2`.

```text
step redirect table (cite-drift-scan --rebuild-redirects): ok
step trigger index (generate-trigger-index): FAILED exit 1: 
relocate: stopped; the report above names the failed step. Rerun the same map to finish it.
LATE_FAIL_EXIT=2
```

Step 12 finishes the earlier move without moving anything again, and the dry run after it finds nothing left.

```text
relocate: applying
  moved    specs/demo/003-beta -> specs/demo/007-beta (already at its destination)
  re-derive specs/demo/007-beta (finishing an earlier run)
  re-derive specs/demo/001-alpha (names a moved packet; finishing an earlier run)
  then     cite-drift-scan --rebuild-redirects, generate-trigger-index, sweep-track-roots, validate.sh --strict on 1 moved packet(s)
...
step trigger index (generate-trigger-index): ok
relocate: applied 0 move(s), finished 1 earlier move(s)

close sweep-track-roots: ok
close validate specs/demo/007-beta: RESULT: PASSED
LATE_RERUN_EXIT=0
...
relocate: nothing to do
LATE_FINAL_EXIT=0
```

### Evidence

Capture the printed `RELOCATE_COPY` path, the full output of steps 4 to 12 and each `_EXIT` line. Inspect evidence only under the printed copy path.

The transcripts for steps 4 to 12 above were recorded from one run of this fixture, built with the step 2 and step 3 commands. Capture the full step 7 output on every run and keep it with the result.

### Pass / Fail

- **Pass**: `RENUMBER_DRY_EXIT=1` and `MOVE_DRY_EXIT=1` with the plans above, `REFUSED_EXIT=2` with both refusal lines and an unchanged listing, the step 7 output carries `relocate: applied 2 move(s)` with every `step` line reading `ok`, both `close validate` lines read `RESULT: PASSED` and `APPLY_EXIT=0`, the step 7 listing shows `003-beta` and `004-gamma` with `002-old` still archived, and `RERUN_EXIT=0` with the nothing-to-do line, `STATUS3_EXIT=3` with `close validate specs/demo/005-gamma: RESULT: FAILED` and `STATUS3_RERUN_EXIT=0` with `relocate: nothing to do`, `LATE_FAIL_EXIT=2` with the trigger index step reading `FAILED`, `LATE_RERUN_EXIT=0` with `finished 1 earlier move(s)`, and `LATE_FINAL_EXIT=0` with `relocate: nothing to do`.
- **Fail**: a dry run exits `0` or changes the listing, the refused move exits anything other than `2` or moves a folder, the applied run prints `relocate: stopped` or a `step` line that reads `FAILED`, a `close validate` line reads `RESULT: FAILED`, `APPLY_EXIT` is anything other than `0`, a live packet lands on `002`, the rerun still finds a move to make, the broken packet's move exits anything other than `3`, or a rerun after step 10 or step 12 still finds work.

### Failure Triage

1. A dry run that prints `relocate: refused: ... has uncommitted changes` means step 3 did not commit the fixture. Run `git status --short specs` in the copy and commit what it lists.
2. A `missing tool:` or `run this from the repository root` message means the command did not run from the copy root, or step 1 did not copy `.skilled`. Confirm `pwd -P` prints the `RELOCATE_COPY` path.
3. A `step <name>: FAILED` line names the stage that stopped the applied run. The script prints `Rerun the same map to finish it`, so read the failure text, fix its cause in the copy and repeat step 7.
4. If a live packet lands on `002`, read `renumberEntries` in `runtime/cli/spec/relocate.mjs`, which counts the numbers held in `z_archive/` as taken.
5. If `LATE_RERUN_EXIT` is not `0` or `LATE_FINAL_EXIT` still finds work, read the late-step flags in the relocation ledger batch for the move. A rerun treats the move as unfinished until the redirect table, trigger index and sweep flags are all set.
6. Run `npx vitest run runtime/cli/tests/relocate.vitest.ts` from `.skilled/skills/system-spec-kit` and read its first failing assertion before changing this scenario.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario registration |
| [spec-packet-relocation.md](../../feature-catalog/tooling-and-scripts/spec-packet-relocation.md) | Matching current-state feature reference |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/relocate.mjs` | Plan builder, refusals, the applied steps and the closing sweep and validation |
| `.skilled/skills/system-spec-kit/runtime/cli/lib/track-roots.mjs` | Track and sub-track layout the plan is checked against |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/relocate.vitest.ts` | Move, renumber, re-parent, refusal, close status and idempotence cases |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/relocate-real-pipeline.vitest.ts` | The same tool with the true store writers, including a resume after a late step fails once |

Provenance: manual only - node .skilled/skills/system-spec-kit/runtime/cli/spec/relocate.mjs --renumber demo

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 492
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `tooling-and-scripts/spec-packet-relocation.md`
- Destructive: Yes, inside the throwaway copy only. Step 7 moves folders and rewrites files under the directory step 1 created, steps 10 to 12 move folders and replace one tooling file there, and step 13 removes that directory. Never run steps 7 to 12 from this checkout.
