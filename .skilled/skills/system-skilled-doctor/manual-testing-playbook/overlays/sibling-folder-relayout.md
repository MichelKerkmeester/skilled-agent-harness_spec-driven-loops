---
title: "SKD-013 -- Overlay relayout moves a sibling folder's old-layout sources onto their layout paths"
description: "This scenario validates that status on a tree whose overlay folder sits beside it prints 20 LAYOUT lines and one overflow line and still passes, that status --json lists all 21 sources in offLayout, that apply --relayout backs them up beside the tree and moves all 21, and that the plain apply and status that follow both pass with no LAYOUT line."
catalog_applicable: false
version: 1.0.1.0
---

# SKD-013 -- Overlay relayout moves a sibling folder's old-layout sources onto their layout paths

This file is the canonical operator contract for a relayout that runs against an overlay folder beside the tree.

---

## 1. OVERVIEW

This scenario verifies that `status` on a tree whose overlay folder sits beside it prints one `LAYOUT` line for each of 21 sources kept on the old layout, stops that list at 20 lines and adds one overflow line, and still passes, that `status --json` lists all 21 in `offLayout`, that `apply --relayout` backs the copies up beside the tree, moves all 21 and rewrites the manifest, and that the `apply` and `status` that follow both pass with no `LAYOUT` line left.

### Why This Matters

A direct sibling is the one place the setting file may name outside the tree, so an operator can keep the overlays in a checkout of their own. The layout convention still applies to those copies, and a large manifest makes the report long, so what an operator needs to see is the report stopping at a readable length without losing a move, the whole list in the JSON, and one command that settles all 21 copies.

---

## 2. SCENARIO CONTRACT

- Objective: Prove a sibling overlay folder's 21 old-layout sources print as 20 `LAYOUT` lines plus one overflow line, list whole in `offLayout`, move in one run and settle.
- Real user request: `move the sources in the overlay folder beside my tree onto the layout paths`
- Prompt: `move the sources in the overlay folder beside my tree onto the layout paths`
- Expected execution process: Build a temporary workspace holding the tree and an `overlays` folder beside it, write the 21 old-layout entries with two shell loops, run status, run `status --json`, run the relayout, then the plain apply and status again.
- Expected signals: Step 7 prints `0 changed` and step 8 prints `0`. Step 9 prints `in-sync=21 overlay-edited=0 live-edited=0 both-changed=0 upstream-moved=0 cannot-apply=0`, then exactly 20 lines `LAYOUT   s01: source skilled/skills/s01/SKILL.md belongs at framework/skills/s01/SKILL.md; run node .skilled/commands/doctor/scripts/overlay-engine.cjs apply --relayout` through the same line for `s20`, then `LAYOUT   … 1 more; run node .skilled/commands/doctor/scripts/overlay-engine.cjs apply --relayout`, then `  Next: from <the tree's absolute path>: node .skilled/commands/doctor/scripts/overlay-engine.cjs apply --relayout`, then `checked=22 ok=22 miss=0` and `RESULT: PASSED`, and step 10 prints `0`. Step 12 prints `0`. Step 13 prints `21`. Step 14 prints `backup ../overlays/relayout-runs/<stamp>`, then 21 lines `moved skilled/skills/s<nn>/SKILL.md -> framework/skills/s<nn>/SKILL.md`, then `21 moved` and `run node .skilled/commands/doctor/scripts/overlay-engine.cjs apply`, and step 15 prints `0`. Step 16 prints `0 changed` and step 17 prints `0`. Step 18 prints `in-sync=21 overlay-edited=0 live-edited=0 both-changed=0 upstream-moved=0 cannot-apply=0`, then `checked=22 ok=22 miss=0` and `RESULT: PASSED`, with no line starting `LAYOUT`, and step 19 prints `0`.
- Desired user-visible outcome: The operator sees the moves capped at a readable length, the whole list in one JSON report, and one command that lands all 21 copies on their layout paths with the folder beside the tree left as a backup.
- Pass/fail: PASS if step 9 prints exactly those 20 `LAYOUT` lines, the overflow line and `RESULT: PASSED` and exits 0, step 13 prints `21`, step 14 prints the `backup ../overlays/relayout-runs/<stamp>` line, 21 `moved` lines and `21 moved` and exits 0, and step 18 prints `RESULT: PASSED` with no `LAYOUT` line and exits 0. FAIL if the `LAYOUT` count is not 20, the overflow line is absent, the `offLayout` count is not 21, the `backup` line names another folder, a copy stays on its old path, a `moved` line names another destination, or either closing command fails. SKIP when Node is unavailable in the environment, with the error named.

---

## 3. TEST EXECUTION

### Exact Command Sequence

1. Run `W=$(mktemp -d)`.
2. Run `T="$W/tree"`.
3. Run `mkdir -p "$T/.skilled/skills" "$W/overlays/skilled/skills"`.
4. Run `printf '%s\n' '{"overlayDir":"../overlays"}' > "$T/.skilled-overlays.json"`.
5. Run `for i in $(seq -w 1 21); do mkdir -p "$T/.skilled/skills/s$i" "$W/overlays/skilled/skills/s$i"; printf 'skill %s\n' "$i" > "$T/.skilled/skills/s$i/SKILL.md"; printf 'skill %s\n' "$i" > "$W/overlays/skilled/skills/s$i/SKILL.md"; done`.
6. Run `{ printf '{"schemaVersion":1,"pin":{"upstream":"fixture","commit":"pin-one"},"layoutLinks":[],"overlays":['; sep=''; for i in $(seq -w 1 21); do printf '%s{"id":"s%s","scope":"file","source":"skilled/skills/s%s/SKILL.md","destination":".skilled/skills/s%s/SKILL.md"}' "$sep" "$i" "$i" "$i"; sep=','; done; printf '],"regenerate":[],"verifyGenerated":[]}\n'; } > "$W/overlays/overlay-manifest.json"`.
7. Run `node .skilled/commands/doctor/scripts/overlay-engine.cjs apply --root "$T"`.
8. Run `echo $?`.
9. Run `node .skilled/commands/doctor/scripts/overlay-engine.cjs status --root "$T"`.
10. Run `echo $?`.
11. Run `node .skilled/commands/doctor/scripts/overlay-engine.cjs status --json --root "$T" > "$W/status.json"`.
12. Run `echo $?`.
13. Run `grep -c '"field": "source"' "$W/status.json"`.
14. Run `node .skilled/commands/doctor/scripts/overlay-engine.cjs apply --relayout --root "$T"`.
15. Run `echo $?`.
16. Run `node .skilled/commands/doctor/scripts/overlay-engine.cjs apply --root "$T"`.
17. Run `echo $?`.
18. Run `node .skilled/commands/doctor/scripts/overlay-engine.cjs status --root "$T"`.
19. Run `echo $?`.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| SKD-013 | Relayout from a sibling overlay folder | Prove a sibling overlay folder's 21 old-layout sources print as 20 `LAYOUT` lines plus one overflow line, list whole in `offLayout`, move in one run and settle. | `move the sources in the overlay folder beside my tree onto the layout paths` | 1. `bash: W=$(mktemp -d)` -> 2. `bash: T="$W/tree"` -> 3. `bash: mkdir -p "$T/.skilled/skills" "$W/overlays/skilled/skills"` -> 4. `bash: printf '%s\n' '{"overlayDir":"../overlays"}' > "$T/.skilled-overlays.json"` -> 5. `bash: for i in $(seq -w 1 21); do mkdir -p "$T/.skilled/skills/s$i" "$W/overlays/skilled/skills/s$i"; printf 'skill %s\n' "$i" > "$T/.skilled/skills/s$i/SKILL.md"; printf 'skill %s\n' "$i" > "$W/overlays/skilled/skills/s$i/SKILL.md"; done` -> 6. `bash: { printf '{"schemaVersion":1,"pin":{"upstream":"fixture","commit":"pin-one"},"layoutLinks":[],"overlays":['; sep=''; for i in $(seq -w 1 21); do printf '%s{"id":"s%s","scope":"file","source":"skilled/skills/s%s/SKILL.md","destination":".skilled/skills/s%s/SKILL.md"}' "$sep" "$i" "$i" "$i"; sep=','; done; printf '],"regenerate":[],"verifyGenerated":[]}\n'; } > "$W/overlays/overlay-manifest.json"` -> 7. `bash: node .skilled/commands/doctor/scripts/overlay-engine.cjs apply --root "$T"` -> 8. `bash: echo $?` -> 9. `bash: node .skilled/commands/doctor/scripts/overlay-engine.cjs status --root "$T"` -> 10. `bash: echo $?` -> 11. `bash: node .skilled/commands/doctor/scripts/overlay-engine.cjs status --json --root "$T" > "$W/status.json"` -> 12. `bash: echo $?` -> 13. `bash: grep -c '"field": "source"' "$W/status.json"` -> 14. `bash: node .skilled/commands/doctor/scripts/overlay-engine.cjs apply --relayout --root "$T"` -> 15. `bash: echo $?` -> 16. `bash: node .skilled/commands/doctor/scripts/overlay-engine.cjs apply --root "$T"` -> 17. `bash: echo $?` -> 18. `bash: node .skilled/commands/doctor/scripts/overlay-engine.cjs status --root "$T"` -> 19. `bash: echo $?` | Step 7 prints `0 changed` and step 8 prints `0`. Step 9 prints `in-sync=21 overlay-edited=0 live-edited=0 both-changed=0 upstream-moved=0 cannot-apply=0`, then exactly 20 lines `LAYOUT   s01: source skilled/skills/s01/SKILL.md belongs at framework/skills/s01/SKILL.md; run node .skilled/commands/doctor/scripts/overlay-engine.cjs apply --relayout` through the same line for `s20`, then `LAYOUT   … 1 more; run node .skilled/commands/doctor/scripts/overlay-engine.cjs apply --relayout`, then `  Next: from <the tree's absolute path>: node .skilled/commands/doctor/scripts/overlay-engine.cjs apply --relayout`, then `checked=22 ok=22 miss=0` and `RESULT: PASSED`, and step 10 prints `0`. Step 12 prints `0`. Step 13 prints `21`. Step 14 prints `backup ../overlays/relayout-runs/<stamp>`, then 21 lines `moved skilled/skills/s<nn>/SKILL.md -> framework/skills/s<nn>/SKILL.md`, then `21 moved` and `run node .skilled/commands/doctor/scripts/overlay-engine.cjs apply`, and step 15 prints `0`. Step 16 prints `0 changed` and step 17 prints `0`. Step 18 prints `in-sync=21 overlay-edited=0 live-edited=0 both-changed=0 upstream-moved=0 cannot-apply=0`, then `checked=22 ok=22 miss=0` and `RESULT: PASSED`, with no line starting `LAYOUT`, and step 19 prints `0`. | The 20 `LAYOUT` lines with the overflow line and the passing result, the `offLayout` count from the JSON report, the `backup` folder, the 21 `moved` lines, and the exit statuses and reports from the closing apply and status. | PASS if step 9 prints exactly those 20 `LAYOUT` lines, the overflow line and `RESULT: PASSED` and exits 0, step 13 prints `21`, step 14 prints the `backup ../overlays/relayout-runs/<stamp>` line, 21 `moved` lines and `21 moved` and exits 0, and step 18 prints `RESULT: PASSED` with no `LAYOUT` line and exits 0. FAIL if the `LAYOUT` count is not 20, the overflow line is absent, the `offLayout` count is not 21, the `backup` line names another folder, a copy stays on its old path, a `moved` line names another destination, or either closing command fails. SKIP when Node is unavailable in the environment, with the error named. | 1. Check that step 4 wrote the setting file at the tree root and that the folder it names sits beside the tree, since a deeper `../` path is refused. 2. Check that the overlay folder holds the manifest and that step 6 wrote 21 entries, each with `"source"` at the dot-dropped path and `"destination"` at `.skilled/`. 3. Read the engine's `layoutMoves`, `LAYOUT_SHOWN` and `relayoutUnderLock`. 4. Escalate with the status report, the JSON report, the relayout output and the manifest. |

### Evidence Review

The 20 `LAYOUT` lines carry the report itself, and the overflow line carries the one move they leave out, so a run that lost a move would print a smaller count than the manifest holds. `RESULT: PASSED` beside them carries the claim that the layout is advisory and the tree is still in sync. The `offLayout` count from the JSON report carries the full list the plain report caps, so the two reports agree on 21. The `backup` line names the sibling folder, which carries the claim that the backup sits beside the tree rather than inside it, and each `moved` line names both paths under the folder the setting names. `21 moved` carries the count, and the closing pair carries the claim that the tree is settled: a run of `0 changed` and a status with no `LAYOUT` line.

---

## 4. SOURCE FILES

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Package policy and scenario index. |
| [Overlay reference](../../references/overlays.md) | The `LAYOUT` line, the sibling overlay folder setting and what `apply --relayout` does. |
| `.skilled/commands/doctor/scripts/overlay-engine.cjs` | The engine under test. |
| `.skilled/commands/doctor/scripts/tests/overlay-engine-follow-up.test.cjs` | The regression test that pins the overflow line and the sibling backup path. |

---

## 5. SOURCE METADATA

- Group: Overlays
- Playbook ID: SKD-013
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `overlays/sibling-folder-relayout.md`
- Prompt equality requirement: the SCENARIO CONTRACT prompt equals the 9-column table Exact Prompt cell and the root summary prompt.
