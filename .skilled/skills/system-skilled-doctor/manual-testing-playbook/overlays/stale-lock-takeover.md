---
title: "SKD-008 -- Overlay apply takes over a lock a killed run left behind"
description: "This scenario validates that apply takes over a lock file whose owner line names a dead process on this host, prints one note naming that lock and removes the file, takes over a lock line in the previous release's shape, which holds a dead pid and no host, and refuses a lock whose process is still alive."
catalog_applicable: false
version: 1.0.0.1
---

# SKD-008 -- Overlay apply takes over a lock a killed run left behind

This file is the canonical operator contract for the overlay lock and its takeover.

---

## 1. OVERVIEW

This scenario verifies that `apply` takes over a lock file whose owner line names a process that has ended on this host, prints one `note:` line naming the lock it took over, removes the file and finishes its work, takes over a line in the previous release's shape in the same way, then refuses a lock whose process is still alive and leaves that file alone.

### Why This Matters

A run that is killed leaves its lock file behind, and every later run then refuses until someone deletes the file by hand. The engine clears such a lock only when it can show the writer has ended, so the takeover and the refusal are one rule with two outcomes. A wrong takeover would let two runs write the same tree, and a missing one would block the project after every crash.

---

## 2. SCENARIO CONTRACT

- Objective: Prove a dead owner's lock is taken over with one note and a live owner's lock is kept with a refusal.
- Real user request: `my overlay run died and left a lock file, can a new run take it over`
- Prompt: `my overlay run died and left a lock file, can a new run take it over`
- Expected execution process: Build a temporary tree with one file overlay, write a lock file naming a process that has ended on this host, run apply, then write a lock naming the live shell and run apply again, then write a lock line in the previous release's shape, with a dead pid and no host, and run apply once more.
- Expected signals: Step 10 prints `overlay-engine apply pid=<the pid from step 8> host=<the host name from step 6> <the stamp from step 7>`. Step 11 prints `note: took over the overlay lock of a run that has ended: ` followed by that same line, then `1 changed`, and exits 0. Step 13 prints `AGENTS.md`, `overlay-manifest.json` and `sync-state.json`, so the lock file is gone. Step 15 prints `refuse: the overlay lock is held: ` followed by the lock line from step 14, then `  remove <the lock file's absolute path> by hand once that run has ended`, and exits 2. Step 17 prints the same line as step 14. Step 19 prints `overlay-engine apply pid=<the pid from step 8> <the stamp from step 7>`, with no `host=` token. Step 20 prints `note: took over the overlay lock of a run that has ended: ` followed by that same line, then `0 changed`, and step 21 prints `0`. Step 22 prints `AGENTS.md`, `overlay-manifest.json` and `sync-state.json`, so the lock file is gone again.
- Desired user-visible outcome: The operator's next run proceeds after a crash, and two live runs never share the tree.
- Pass/fail: PASS if step 11 exits 0 with the one `note:` line and the lock file is gone from step 13, and step 15 exits 2 with the refusal while step 17 still holds the line, and step 20 takes over the host-less line with one `note:` and exits 0. FAIL if step 11 refuses, prints more than one `note:` line or leaves the lock, or step 15 proceeds and drops the lock, or step 20 refuses the previous release's line. SKIP when Node is unavailable in the environment, with the error named.

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

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| SKD-008 | Lock takeover | Prove a dead owner's lock is taken over with one note and a live owner's lock is kept with a refusal. | `my overlay run died and left a lock file, can a new run take it over` | 1. `bash: T=$(mktemp -d)` -> 2. `bash: mkdir -p "$T/skilled-overlays"` -> 3. `bash: printf 'project agents\n' > "$T/skilled-overlays/AGENTS.md"` -> 4. `bash: printf 'upstream agents\n' > "$T/AGENTS.md"` -> 5. `bash: printf '%s\n' '{"schemaVersion":1,"pin":{"upstream":"fixture","commit":"pin-one"},"layoutLinks":[],"overlays":[{"id":"agents-file","scope":"file","source":"AGENTS.md","destination":"AGENTS.md","pinnedSha256":"27d2f5308b5bf9210c97aaf21d2a88d27ddadf744a5ef3f1cc65d5bde54d7e16"}],"regenerate":[],"verifyGenerated":[]}' > "$T/skilled-overlays/overlay-manifest.json"` -> 6. `bash: HOST=$(hostname)` -> 7. `bash: STAMP=$(date -u +%Y-%m-%dT%H:%M:%S.000Z)` -> 8. `bash: DEAD=$(node -e 'console.log(process.pid)')` -> 9. `bash: printf 'overlay-engine apply pid=%s host=%s %s\n' "$DEAD" "$HOST" "$STAMP" > "$T/skilled-overlays/.build-lock"` -> 10. `bash: cat "$T/skilled-overlays/.build-lock"` -> 11. `bash: node .skilled/commands/doctor/scripts/overlay-engine.cjs apply --root "$T"` -> 12. `bash: echo $?` -> 13. `bash: ls -A "$T/skilled-overlays"` -> 14. `bash: printf 'overlay-engine apply pid=%s host=%s %s\n' "$$" "$HOST" "$STAMP" > "$T/skilled-overlays/.build-lock"` -> 15. `bash: node .skilled/commands/doctor/scripts/overlay-engine.cjs apply --root "$T"` -> 16. `bash: echo $?` -> 17. `bash: cat "$T/skilled-overlays/.build-lock"` -> 18. `bash: printf 'overlay-engine apply pid=%s %s\n' "$DEAD" "$STAMP" > "$T/skilled-overlays/.build-lock"` -> 19. `bash: cat "$T/skilled-overlays/.build-lock"` -> 20. `bash: node .skilled/commands/doctor/scripts/overlay-engine.cjs apply --root "$T"` -> 21. `bash: echo $?` -> 22. `bash: ls -A "$T/skilled-overlays"` | Step 10 prints the lock line, which holds the pid step 8 printed, the host name and the stamp. Step 11 prints `note: took over the overlay lock of a run that has ended: ` followed by that same line, then `1 changed`, and step 12 prints `0`. Step 13 prints `AGENTS.md`, `overlay-manifest.json` and `sync-state.json`, so the lock file is gone. Step 14 writes a lock whose pid is the live shell's. Step 15 prints `refuse: the overlay lock is held: ` followed by that line, then a second line starting with two spaces, `remove `, the lock file's absolute path and ` by hand once that run has ended`, and step 16 prints `2`. Step 17 prints the same line as step 14. Step 19 prints the lock line in the previous release's shape, with the pid from step 8 and the stamp from step 7 and no `host=` token. Step 20 prints `note: took over the overlay lock of a run that has ended: ` followed by that same line, then `0 changed`, and step 21 prints `0`. Step 22 holds no lock file. | The lock line, the `note:` line, the folder listing, the refusal lines and the exit statuses from steps 12 and 16. | PASS if step 12 prints `0`, step 11 printed exactly one `note:` line, step 13 holds no lock file, step 16 prints `2` and step 17 still holds the line, and step 20 takes over the host-less line with one `note:` and step 21 prints `0`. FAIL if apply refuses a dead owner's lock, prints more than one `note:` line, leaves the file, drops a live owner's lock, or refuses the previous release's line. SKIP when Node is unavailable in the environment, with the error named. | 1. Check that the pid step 8 printed no longer answers and that step 6 printed this host's name. 2. For the host-less line, check that step 19 printed no `host=` token and that its pid is the one from step 8. 3. Read the engine's `isLockOwnerGone` and `acquireLock`. 4. Escalate with the lock lines, the folder listings and the exit statuses. |

### Evidence Review

The `note:` line carries the takeover and names the lock it cleared. The folder listing carries the claim that the file is gone rather than merely ignored, and the second run's refusal plus the unchanged file carries the claim that a live owner keeps its lock. One `note:` and not two matters: the operator has to be able to tell which lock was cleared. The host-less step carries the claim that a line written before the engine recorded the host is still probed here, so an upgrade is never blocked behind a hand delete.

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
