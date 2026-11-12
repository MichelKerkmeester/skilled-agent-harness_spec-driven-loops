---
title: "SKD-008 -- Overlay apply takes over a dead run's lock and repin --stage runs past it"
description: "This scenario validates that apply takes over a lock file whose owner line names a dead process on this host, prints one note naming that lock and removes the file, takes over a lock line in the previous release's shape, which holds a dead pid and no host, and refuses a lock whose process is still alive, and that repin --stage reads that dead owner line, prints its own note and runs the stage while leaving the lock file in place."
catalog_applicable: false
version: 1.0.1.0
---

# SKD-008 -- Overlay apply takes over a dead run's lock and repin --stage runs past it

This file is the canonical operator contract for the overlay lock and its takeover.

---

## 1. OVERVIEW

This scenario verifies that `apply` takes over a lock file whose owner line names a process that has ended on this host, prints one `note:` line naming the lock it took over, removes the file and finishes its work, takes over a line in the previous release's shape in the same way, then refuses a lock whose process is still alive and leaves that file alone, and that `repin --stage` reads that same dead owner line, prints its own `note:` line, stages the tree and leaves the lock file where it is.

### Why This Matters

A run that is killed leaves its lock file behind, and every later run then refuses until someone deletes the file by hand. The engine clears such a lock only when it can show the writer has ended, so the takeover and the refusal are one rule with two outcomes. A wrong takeover would let two runs write the same tree, and a missing one would block the project after every crash.

---

## 2. SCENARIO CONTRACT

- Objective: Prove a dead owner's lock is taken over with one note on the apply and the stage path, and a live owner's lock is kept with a refusal.
- Real user request: `my overlay run died and left a lock file, can a new run take it over`
- Prompt: `my overlay run died and left a lock file, can a new run take it over`
- Expected execution process: Build a temporary tree with one file overlay, write a lock file naming a process that has ended on this host, run apply, then write a lock naming the live shell and run apply again, then write a lock line in the previous release's shape, with a dead pid and no host, and run apply once more, then build a second tree pinned one upstream commit behind its upstream and run `repin --stage` under a lock file naming a process that has ended on this host.
- Expected signals: Step 10 prints `overlay-engine apply pid=<the pid from step 8> host=<the host name from step 6> <the stamp from step 7>`. Step 11 prints `note: took over the overlay lock of a run that has ended: ` followed by that same line, then `1 changed`, and exits 0. Step 13 prints `AGENTS.md`, `overlay-manifest.json` and `sync-state.json`, so the lock file is gone. Step 15 prints `refuse: the overlay lock is held: ` followed by the lock line from step 14, then `  remove <the lock file's absolute path> by hand once that run has ended`, and exits 2. Step 17 prints the same line as step 14. Step 19 prints `overlay-engine apply pid=<the pid from step 8> <the stamp from step 7>`, with no `host=` token. Step 20 prints `note: took over the overlay lock of a run that has ended: ` followed by that same line, then `0 changed`, and step 21 prints `0`. Step 22 prints `AGENTS.md`, `overlay-manifest.json` and `sync-state.json`, so the lock file is gone again. Step 33 prints `overlay-engine apply pid=<the pid from step 8> host=<the host name from step 6> <the stamp from step 7>`. Step 34 prints `note: the overlay lock belongs to a run that has ended: ` followed by that same line, then `staged a copy of the tree in ` and the stage folder, then `backup of 2 paths in skilled-overlays/repin-runs/` and a run folder, then `copy 1 paths, delete 0 paths`, two `0 changed` lines, `checked=1 ok=1 miss=0` and `RESULT: STAGED`, and step 35 prints `0`. Step 36 prints the same line as step 33, step 37 prints `.build-lock` and `overlay-manifest.json`, so the lock file is still there, and step 38 prints `router v2`.
- Desired user-visible outcome: The operator's next run proceeds after a crash, and two live runs never share the tree.
- Pass/fail: PASS if step 11 exits 0 with the one `note:` line and the lock file is gone from step 13, and step 15 exits 2 with the refusal while step 17 still holds the line, and step 20 takes over the host-less line with one `note:` and exits 0, and step 34 exits 0 with one line starting `note: the overlay lock belongs to a run that has ended: ` and `RESULT: STAGED` while step 36 still holds the line from step 33 and step 38 prints `router v2`. FAIL if step 11 refuses, prints more than one `note:` line or leaves the lock, or step 15 proceeds and drops the lock, or step 20 refuses the previous release's line, or step 34 refuses the dead owner's line, stages nothing, prints more than one such `note:` line or drops the lock file. SKIP when Node or git is unavailable in the environment, with the error named.

---

## 3. TEST EXECUTION

### Exact Command Sequence

1. Run `T=$(mktemp -d)`.
2. Run `mkdir -p "$T/skilled-overlays"`.
3. Run `printf 'project agents\n' > "$T/skilled-overlays/AGENTS.md"`.
4. Run `printf 'upstream agents\n' > "$T/AGENTS.md"`.
5. Run `printf '%s\n' '{"schemaVersion":1,"pin":{"upstream":"fixture","commit":"pin-one"},"layoutLinks":[],"overlays":[{"id":"agents-file","scope":"file","source":"AGENTS.md","destination":"AGENTS.md","pinnedSha256":"27d2f5308b5bf9210c97aaf21d2a88d27ddadf744a5ef3f1cc65d5bde54d7e16"}],"regenerate":[],"verifyGenerated":[]}' > "$T/skilled-overlays/overlay-manifest.json"`.
6. Run `HOST=$(hostname)`.
7. Run `STAMP=$(date -u +%Y-%m-%dT%H:%M:%S.000Z)`.
8. Run `DEAD=$(node -e 'console.log(process.pid)')`.
9. Run `printf 'overlay-engine apply pid=%s host=%s %s\n' "$DEAD" "$HOST" "$STAMP" > "$T/skilled-overlays/.build-lock"`.
10. Run `cat "$T/skilled-overlays/.build-lock"`.
11. Run `node .skilled/commands/doctor/scripts/overlay-engine.cjs apply --root "$T"`.
12. Run `echo $?`.
13. Run `ls -A "$T/skilled-overlays"`.
14. Run `printf 'overlay-engine apply pid=%s host=%s %s\n' "$$" "$HOST" "$STAMP" > "$T/skilled-overlays/.build-lock"`.
15. Run `node .skilled/commands/doctor/scripts/overlay-engine.cjs apply --root "$T"`.
16. Run `echo $?`.
17. Run `cat "$T/skilled-overlays/.build-lock"`.
18. Run `printf 'overlay-engine apply pid=%s %s\n' "$DEAD" "$STAMP" > "$T/skilled-overlays/.build-lock"`.
19. Run `cat "$T/skilled-overlays/.build-lock"`.
20. Run `node .skilled/commands/doctor/scripts/overlay-engine.cjs apply --root "$T"`.
21. Run `echo $?`.
22. Run `ls -A "$T/skilled-overlays"`.
23. Run `S=$(mktemp -d)`.
24. Run `mkdir -p "$S/upstream/.skilled/skills/hub" "$S/tree/.skilled/skills/hub" "$S/tree/skilled-overlays"`.
25. Run `git -C "$S/upstream" init -q && git -C "$S/upstream" config user.name fixture && git -C "$S/upstream" config user.email fixture@example.com`.
26. Run `printf 'router v1\n' > "$S/upstream/.skilled/skills/hub/ROUTER.md"`.
27. Run `git -C "$S/upstream" add -A && git -C "$S/upstream" commit -q -m 'pinned copy' && OLD=$(git -C "$S/upstream" rev-parse HEAD)`.
28. Run `printf 'router v2\n' > "$S/upstream/.skilled/skills/hub/ROUTER.md"`.
29. Run `git -C "$S/upstream" add -A && git -C "$S/upstream" commit -q -m 'moved on' && NEW=$(git -C "$S/upstream" rev-parse HEAD)`.
30. Run `printf 'router v1\n' > "$S/tree/.skilled/skills/hub/ROUTER.md"`.
31. Run `printf '%s\n' '{"schemaVersion":1,"pin":{"upstream":"fixture","commit":"'"$OLD"'"},"layoutLinks":[],"overlays":[],"regenerate":[],"verifyGenerated":[]}' > "$S/tree/skilled-overlays/overlay-manifest.json"`.
32. Run `printf 'overlay-engine apply pid=%s host=%s %s\n' "$DEAD" "$HOST" "$STAMP" > "$S/tree/skilled-overlays/.build-lock"`.
33. Run `cat "$S/tree/skilled-overlays/.build-lock"`.
34. Run `node .skilled/commands/doctor/scripts/overlay-engine.cjs repin --upstream "$S/upstream" --to "$NEW" --stage "$S/stage" --root "$S/tree"`.
35. Run `echo $?`.
36. Run `cat "$S/tree/skilled-overlays/.build-lock"`.
37. Run `ls -A "$S/tree/skilled-overlays"`.
38. Run `cat "$S/stage/.skilled/skills/hub/ROUTER.md"`.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| SKD-008 | Lock takeover | Prove a dead owner's lock is taken over with one note on the apply and the stage path, and a live owner's lock is kept with a refusal. | `my overlay run died and left a lock file, can a new run take it over` | 1. `bash: T=$(mktemp -d)` -> 2. `bash: mkdir -p "$T/skilled-overlays"` -> 3. `bash: printf 'project agents\n' > "$T/skilled-overlays/AGENTS.md"` -> 4. `bash: printf 'upstream agents\n' > "$T/AGENTS.md"` -> 5. `bash: printf '%s\n' '{"schemaVersion":1,"pin":{"upstream":"fixture","commit":"pin-one"},"layoutLinks":[],"overlays":[{"id":"agents-file","scope":"file","source":"AGENTS.md","destination":"AGENTS.md","pinnedSha256":"27d2f5308b5bf9210c97aaf21d2a88d27ddadf744a5ef3f1cc65d5bde54d7e16"}],"regenerate":[],"verifyGenerated":[]}' > "$T/skilled-overlays/overlay-manifest.json"` -> 6. `bash: HOST=$(hostname)` -> 7. `bash: STAMP=$(date -u +%Y-%m-%dT%H:%M:%S.000Z)` -> 8. `bash: DEAD=$(node -e 'console.log(process.pid)')` -> 9. `bash: printf 'overlay-engine apply pid=%s host=%s %s\n' "$DEAD" "$HOST" "$STAMP" > "$T/skilled-overlays/.build-lock"` -> 10. `bash: cat "$T/skilled-overlays/.build-lock"` -> 11. `bash: node .skilled/commands/doctor/scripts/overlay-engine.cjs apply --root "$T"` -> 12. `bash: echo $?` -> 13. `bash: ls -A "$T/skilled-overlays"` -> 14. `bash: printf 'overlay-engine apply pid=%s host=%s %s\n' "$$" "$HOST" "$STAMP" > "$T/skilled-overlays/.build-lock"` -> 15. `bash: node .skilled/commands/doctor/scripts/overlay-engine.cjs apply --root "$T"` -> 16. `bash: echo $?` -> 17. `bash: cat "$T/skilled-overlays/.build-lock"` -> 18. `bash: printf 'overlay-engine apply pid=%s %s\n' "$DEAD" "$STAMP" > "$T/skilled-overlays/.build-lock"` -> 19. `bash: cat "$T/skilled-overlays/.build-lock"` -> 20. `bash: node .skilled/commands/doctor/scripts/overlay-engine.cjs apply --root "$T"` -> 21. `bash: echo $?` -> 22. `bash: ls -A "$T/skilled-overlays"` -> 23. `bash: S=$(mktemp -d)` -> 24. `bash: mkdir -p "$S/upstream/.skilled/skills/hub" "$S/tree/.skilled/skills/hub" "$S/tree/skilled-overlays"` -> 25. `bash: git -C "$S/upstream" init -q && git -C "$S/upstream" config user.name fixture && git -C "$S/upstream" config user.email fixture@example.com` -> 26. `bash: printf 'router v1\n' > "$S/upstream/.skilled/skills/hub/ROUTER.md"` -> 27. `bash: git -C "$S/upstream" add -A && git -C "$S/upstream" commit -q -m 'pinned copy' && OLD=$(git -C "$S/upstream" rev-parse HEAD)` -> 28. `bash: printf 'router v2\n' > "$S/upstream/.skilled/skills/hub/ROUTER.md"` -> 29. `bash: git -C "$S/upstream" add -A && git -C "$S/upstream" commit -q -m 'moved on' && NEW=$(git -C "$S/upstream" rev-parse HEAD)` -> 30. `bash: printf 'router v1\n' > "$S/tree/.skilled/skills/hub/ROUTER.md"` -> 31. `bash: printf '%s\n' '{"schemaVersion":1,"pin":{"upstream":"fixture","commit":"'"$OLD"'"},"layoutLinks":[],"overlays":[],"regenerate":[],"verifyGenerated":[]}' > "$S/tree/skilled-overlays/overlay-manifest.json"` -> 32. `bash: printf 'overlay-engine apply pid=%s host=%s %s\n' "$DEAD" "$HOST" "$STAMP" > "$S/tree/skilled-overlays/.build-lock"` -> 33. `bash: cat "$S/tree/skilled-overlays/.build-lock"` -> 34. `bash: node .skilled/commands/doctor/scripts/overlay-engine.cjs repin --upstream "$S/upstream" --to "$NEW" --stage "$S/stage" --root "$S/tree"` -> 35. `bash: echo $?` -> 36. `bash: cat "$S/tree/skilled-overlays/.build-lock"` -> 37. `bash: ls -A "$S/tree/skilled-overlays"` -> 38. `bash: cat "$S/stage/.skilled/skills/hub/ROUTER.md"` | Step 10 prints the lock line, which holds the pid step 8 printed, the host name and the stamp. Step 11 prints `note: took over the overlay lock of a run that has ended: ` followed by that same line, then `1 changed`, and step 12 prints `0`. Step 13 prints `AGENTS.md`, `overlay-manifest.json` and `sync-state.json`, so the lock file is gone. Step 14 writes a lock whose pid is the live shell's. Step 15 prints `refuse: the overlay lock is held: ` followed by that line, then a second line starting with two spaces, `remove `, the lock file's absolute path and ` by hand once that run has ended`, and step 16 prints `2`. Step 17 prints the same line as step 14. Step 19 prints the lock line in the previous release's shape, with the pid from step 8 and the stamp from step 7 and no `host=` token. Step 20 prints `note: took over the overlay lock of a run that has ended: ` followed by that same line, then `0 changed`, and step 21 prints `0`. Step 22 holds no lock file. Step 33 prints the lock line in the same shape as step 10. Step 34 prints `note: the overlay lock belongs to a run that has ended: ` followed by that same line, then `staged a copy of the tree in ` and the stage folder, then `backup of 2 paths in skilled-overlays/repin-runs/` and a run folder, then `copy 1 paths, delete 0 paths`, two `0 changed` lines, `checked=1 ok=1 miss=0` and `RESULT: STAGED`, and step 35 prints `0`. Step 36 still holds the line from step 33, step 37 still lists `.build-lock` and `overlay-manifest.json`, and step 38 prints `router v2`. | The lock lines, the `note:` lines, the folder listings, the refusal lines, the staged router and the exit statuses from steps 12, 16, 21 and 35. | PASS if step 12 prints `0`, step 11 printed exactly one `note:` line, step 13 holds no lock file, step 16 prints `2` and step 17 still holds the line, step 20 takes over the host-less line with one `note:` and step 21 prints `0`, and step 35 prints `0`, step 34 printed exactly one line starting `note: the overlay lock belongs to a run that has ended: ` and `RESULT: STAGED`, step 36 still holds the line from step 33 and step 38 prints `router v2`. FAIL if apply refuses a dead owner's lock, prints more than one `note:` line, leaves the file, drops a live owner's lock, or refuses the previous release's line, or the stage refuses a dead owner's lock, stages nothing, prints more than one such `note:` line or drops the lock file. SKIP when Node or git is unavailable in the environment, with the error named. | 1. Check that the pid step 8 printed no longer answers and that step 6 printed this host's name. 2. For the host-less line, check that step 19 printed no `host=` token and that its pid is the one from step 8. 3. For the stage, check that step 30 wrote `router v1` into the tree, that the stage folder from step 34 sits outside the tree, and that the lock file names a dead pid on this host. 4. Read the engine's `isLockOwnerGone` and `acquireLock`, then `repinRun` and `copyTreeForStage`. 5. Escalate with the lock lines, the folder listings and the exit statuses. |

### Evidence Review

The `note:` line carries the takeover and names the lock it cleared. The folder listing carries the claim that the file is gone rather than merely ignored, and the second run's refusal plus the unchanged file carries the claim that a live owner keeps its lock. One `note:` and not two matters: the operator has to be able to tell which lock was cleared. The host-less step carries the claim that a line written before the engine recorded the host is still probed here, so an upgrade is never blocked behind a hand delete. The stage steps carry the opposite claim on purpose: its `note:` line, the still-listed lock file and the staged router together show that a stage reads the dead owner's line and does its work without taking the lock, because a stage writes nothing in the live tree.

---

## 4. SOURCE FILES

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Package policy and scenario index. |
| [Overlay reference](../../references/overlays.md) | The lock file, the owner line and the takeover rule. |
| `.skilled/commands/doctor/scripts/overlay-engine.cjs` | The engine under test. |
| `.skilled/commands/doctor/scripts/tests/overlay-engine-follow-up.test.cjs` | The regression test that pins the takeover and the refusals. |

---

## 5. SOURCE METADATA

- Group: Overlays
- Playbook ID: SKD-008
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `overlays/stale-lock-takeover.md`
- Prompt equality requirement: the SCENARIO CONTRACT prompt equals the 9-column table Exact Prompt cell and the root summary prompt.
