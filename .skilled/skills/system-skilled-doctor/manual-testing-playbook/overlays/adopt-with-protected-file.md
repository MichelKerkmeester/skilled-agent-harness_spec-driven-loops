---
title: "SKD-004 -- Overlay status refuses a token-named file a directory entry does not protect"
description: "This scenario validates that the overlay engine's status target, run on a tree whose own overlay folder holds a directory entry that walks an unprotected token-named file, reports one MISS line naming the protectedPaths fix, exits 1 and writes nothing."
catalog_applicable: false
version: 1.0.1.0
---

# SKD-004 -- Overlay status refuses a token-named file a directory entry does not protect

This file is the canonical operator contract for running the overlay status check where a directory entry walks a file the manifest does not protect.

---

## 1. OVERVIEW

This scenario verifies that `status` on a project tree that keeps its overlays in its own folder reports one MISS line for the directory entry that walks `tokens.css`, names the exact `protectedPaths` fix, exits 1 and leaves the tree unchanged.

### Why This Matters

A token-named file that no manifest entry protects must stop that entry and no other. A report that hid the rest of the tree, or one that passed, would either leave an operator unable to see the healthy overlays or let a read the engine should refuse look successful.

---

## 2. SCENARIO CONTRACT

- Objective: Prove a directory entry that walks an unprotected token-named file yields one MISS line naming the protectedPaths fix, exit 1 and no write.
- Real user request: `check my own overlay folder with an unprotected tokens.css file`
- Prompt: `check my own overlay folder with an unprotected tokens.css file`
- Expected execution process: Build a temporary tree whose own overlay folder holds two directory entries and an unprotected token-named file in one live folder, run `status` against it, then list the tree before and after.
- Expected signals: Step 11 prints the state count line `in-sync=1 overlay-edited=0 live-edited=0 both-changed=0 upstream-moved=0`, then the MISS line `MISS     directory-files: refusing to inspect a protected path: directory-live/tokens.css; if the overlay owns it, add "tokens.css" to this entry's protectedPaths`, then the `LAYOUT` line `LAYOUT   directory-files: source directory-source belongs at directory-live; run node .skilled/commands/doctor/scripts/overlay-engine.cjs apply --relayout`, then the `LAYOUT` line `LAYOUT   other-files: source other-source belongs at other-live; run node .skilled/commands/doctor/scripts/overlay-engine.cjs apply --relayout`, then `checked=3 ok=2 miss=1` and `RESULT: FAILED`. Step 12 prints `1`. Steps 10 and 13 list the same files, with no `sync-state.json` and no `.build-lock` added.
- Desired user-visible outcome: The operator learns which entry needs the exact `protectedPaths` addition, sees the other entry still in sync, and knows the run wrote nothing.
- Pass/fail: PASS if step 11 prints that one MISS line for `directory-files` and none for `other-files`, step 12 prints `1`, and step 13 matches step 10. FAIL if the MISS names another entry, omits the `add "tokens.css" to this entry's protectedPaths` fix, or an exit status or tree listing differs. SKIP when Node is unavailable in the environment, with the error named.

---

## 3. TEST EXECUTION

### Exact Command Sequence

1. Run `T=$(mktemp -d)`.
2. Run `mkdir -p "$T/ov/directory-source" "$T/ov/other-source" "$T/directory-live" "$T/other-live"`.
3. Run `printf 'directory one\n' > "$T/ov/directory-source/readme.md"`.
4. Run `printf 'directory one\n' > "$T/directory-live/readme.md"`.
5. Run `printf ':root {}\n' > "$T/directory-live/tokens.css"`.
6. Run `printf 'other one\n' > "$T/ov/other-source/notes.md"`.
7. Run `printf 'other one\n' > "$T/other-live/notes.md"`.
8. Run `printf '%s\n' '{"overlayDir":"ov"}' > "$T/.skilled-overlays.json"`.
9. Run `printf '%s\n' '{"schemaVersion":1,"pin":{"upstream":"fixture","commit":"pin-one"},"layoutLinks":[],"overlays":[{"id":"directory-files","scope":"directory","source":"directory-source","destination":"directory-live"},{"id":"other-files","scope":"directory","source":"other-source","destination":"other-live"}],"regenerate":[],"verifyGenerated":[]}' > "$T/ov/overlay-manifest.json"`.
10. Run `find "$T" -mindepth 1 | sort` and keep the listing.
11. Run `node .skilled/commands/doctor/scripts/overlay-engine.cjs status --root "$T"`.
12. Run `echo $?`.
13. Run `find "$T" -mindepth 1 | sort` again and compare it with step 10.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| SKD-004 | Protected-file refusal | Prove a directory entry that walks an unprotected token-named file yields one MISS line naming the protectedPaths fix, exit 1 and no write. | `check my own overlay folder with an unprotected tokens.css file` | 1. `bash: T=$(mktemp -d)` -> 2. `bash: mkdir -p "$T/ov/directory-source" "$T/ov/other-source" "$T/directory-live" "$T/other-live"` -> 3. `bash: printf 'directory one\n' > "$T/ov/directory-source/readme.md"` -> 4. `bash: printf 'directory one\n' > "$T/directory-live/readme.md"` -> 5. `bash: printf ':root {}\n' > "$T/directory-live/tokens.css"` -> 6. `bash: printf 'other one\n' > "$T/ov/other-source/notes.md"` -> 7. `bash: printf 'other one\n' > "$T/other-live/notes.md"` -> 8. `bash: printf '%s\n' '{"overlayDir":"ov"}' > "$T/.skilled-overlays.json"` -> 9. `bash: printf '%s\n' '{"schemaVersion":1,"pin":{"upstream":"fixture","commit":"pin-one"},"layoutLinks":[],"overlays":[{"id":"directory-files","scope":"directory","source":"directory-source","destination":"directory-live"},{"id":"other-files","scope":"directory","source":"other-source","destination":"other-live"}],"regenerate":[],"verifyGenerated":[]}' > "$T/ov/overlay-manifest.json"` -> 10. `bash: find "$T" -mindepth 1 \| sort` -> 11. `bash: node .skilled/commands/doctor/scripts/overlay-engine.cjs status --root "$T"` -> 12. `bash: echo $?` -> 13. `bash: find "$T" -mindepth 1 \| sort` | Step 11 prints the state count line `in-sync=1 overlay-edited=0 live-edited=0 both-changed=0 upstream-moved=0`, then the MISS line `MISS     directory-files: refusing to inspect a protected path: directory-live/tokens.css; if the overlay owns it, add "tokens.css" to this entry's protectedPaths`, then `LAYOUT   directory-files: source directory-source belongs at directory-live; run node .skilled/commands/doctor/scripts/overlay-engine.cjs apply --relayout`, then `LAYOUT   other-files: source other-source belongs at other-live; run node .skilled/commands/doctor/scripts/overlay-engine.cjs apply --relayout`, then `checked=3 ok=2 miss=1` and `RESULT: FAILED`. Step 12 prints `1`. Steps 10 and 13 list the same files, with no `sync-state.json` and no `.build-lock` added. | The MISS line, the count lines, the exit status of step 12 and the two tree listings from steps 10 and 13. | PASS if step 11 prints that one MISS line for `directory-files` and none for `other-files`, step 12 prints `1`, and step 13 matches step 10. FAIL if the MISS names another entry, omits the `add "tokens.css" to this entry's protectedPaths` fix, or an exit status or tree listing differs. SKIP when Node is unavailable in the environment, with the error named. | 1. Check that `tokens.css` sits in `directory-live` and that no entry lists it in `protectedPaths`. 2. Read the engine's `protectedPathProblem` and `commandStatus`. 3. Escalate with the MISS lines, the counts and both tree listings. |

### Evidence Review

The MISS line names the entry and the one fix, so it carries the attribution claim. The `in-sync=1` count carries the "that entry only" claim, and the identical tree listings carry the "wrote nothing" claim. All three must hold.

---

## 4. SOURCE FILES

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Package policy and scenario index. |
| [Overlay reference](../../references/overlays.md) | Where the overlay folder, the setting file and the per-entry `protectedPaths` rule are documented. |
| `.skilled/commands/doctor/scripts/overlay-engine.cjs` | The engine under test. |
| `.skilled/commands/doctor/scripts/tests/overlay-engine-fixes.test.cjs` | The regression test that pins the per-entry refusal. |

---

## 5. SOURCE METADATA

- Group: Overlays
- Playbook ID: SKD-004
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `overlays/adopt-with-protected-file.md`
- Prompt equality requirement: the SCENARIO CONTRACT prompt equals the 9-column table Exact Prompt cell and the root summary prompt.
