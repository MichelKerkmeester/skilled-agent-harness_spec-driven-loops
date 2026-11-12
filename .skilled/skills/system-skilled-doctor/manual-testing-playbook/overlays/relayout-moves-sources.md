---
title: "SKD-009 -- Overlay relayout moves an off-layout source onto its layout path"
description: "This scenario validates that status names an off-layout source on a LAYOUT line and still passes, that apply --relayout moves the copy, rewrites the manifest and points the layout link that reached the copy at its new path, and that the plain apply and status that follow both pass."
catalog_applicable: false
version: 1.0.0.1
---

# SKD-009 -- Overlay relayout moves an off-layout source onto its layout path

This file is the canonical operator contract for moving overlay sources onto the layout path.

---

## 1. OVERVIEW

This scenario verifies that `status` prints one `LAYOUT` line for a source kept off its layout path and still passes, that `apply --relayout` moves the copy, prints the `moved` line, points the layout link that reached the copy at its new path and rewrites the manifest's `source`, and that the `apply` and `status` that follow both pass.

### Why This Matters

The layout lines are a convention and not a safety check, so a tree with sources in the wrong place still works and still reports in sync. The move is the only step that settles the convention, and it edits the manifest, so an operator needs to see the report, the move and a passing tree on the other side.

---

## 2. SCENARIO CONTRACT

- Objective: Prove status reports an off-layout source, relayout moves it, points the layout link at it and rewrites the manifest, and the tree then passes.
- Real user request: `move my overlay sources onto the layout folder`
- Prompt: `move my overlay sources onto the layout folder`
- Expected execution process: Build a temporary tree whose one directory entry keeps its source off the layout and whose one layout link reaches into that copy, run status, run the relayout, read the link and the manifest, then run the plain apply and status again.
- Expected signals: Step 7 prints `in-sync=1 overlay-edited=0 live-edited=0 both-changed=0 upstream-moved=0`, then `LAYOUT   hub-bundle: source custom/bundle belongs at skilled/skills/hub/bundle; run node .skilled/commands/doctor/scripts/overlay-engine.cjs apply --relayout`, then `checked=3 ok=3 miss=0` and `RESULT: PASSED`, and exits 0. Step 9 prints a `backup skilled-overlays/relayout-runs/<stamp>` line, then `moved custom/bundle -> skilled/skills/hub/bundle`, then `relinked .skilled/links/hub -> ../../skilled-overlays/skilled/skills/hub/bundle`, then `1 moved` and `run node .skilled/commands/doctor/scripts/overlay-engine.cjs apply`, and exits 0. Step 11 prints `../../skilled-overlays/skilled/skills/hub/bundle`. Step 12 prints `1`. Step 13 prints `0 changed` and exits 0. Step 14 prints the count lines and `RESULT: PASSED` with no `LAYOUT` line, and exits 0.
- Desired user-visible outcome: The operator sees where the source belongs, moves it with one command and gets a passing tree with no layout work left.
- Pass/fail: PASS if step 7 prints that `LAYOUT` line and exits 0, step 9 prints the `moved` and `relinked` lines and exits 0, step 11 prints the new target, step 12 prints `1`, and steps 13 and 14 exit 0 with step 14 printing no `LAYOUT` line. FAIL if the `LAYOUT` line is absent or names another path, the `moved` or `relinked` line differs, the link still names the old target, the manifest still names the old source, or either closing command fails. SKIP when Node is unavailable in the environment, with the error named.

---

## 3. TEST EXECUTION

### Exact Command Sequence

1. Run `T=$(mktemp -d)`.
2. Run `mkdir -p "$T/skilled-overlays/custom/bundle" "$T/.skilled/skills/hub/bundle" "$T/.skilled/links"`.
3. Run `printf 'readme one\n' > "$T/skilled-overlays/custom/bundle/readme.md"`.
4. Run `printf 'readme one\n' > "$T/.skilled/skills/hub/bundle/readme.md"`.
5. Run `printf '%s\n' '{"schemaVersion":1,"pin":{"upstream":"fixture","commit":"pin-one"},"layoutLinks":[{"path":".skilled/links/hub","target":"../../skilled-overlays/custom/bundle"}],"overlays":[{"id":"hub-bundle","scope":"directory","source":"custom/bundle","destination":".skilled/skills/hub/bundle"}],"regenerate":[],"verifyGenerated":[]}' > "$T/skilled-overlays/overlay-manifest.json"`.
6. Run `ln -s '../../skilled-overlays/custom/bundle' "$T/.skilled/links/hub"`.
7. Run `node .skilled/commands/doctor/scripts/overlay-engine.cjs status --root "$T"`.
8. Run `echo $?`.
9. Run `node .skilled/commands/doctor/scripts/overlay-engine.cjs apply --relayout --root "$T"`.
10. Run `echo $?`.
11. Run `readlink "$T/.skilled/links/hub"`.
12. Run `grep -c '"source":"skilled/skills/hub/bundle"' "$T/skilled-overlays/overlay-manifest.json"`.
13. Run `node .skilled/commands/doctor/scripts/overlay-engine.cjs apply --root "$T"`.
14. Run `node .skilled/commands/doctor/scripts/overlay-engine.cjs status --root "$T"`.
15. Run `echo $?`.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| SKD-009 | Moving sources onto the layout | Prove status reports an off-layout source, relayout moves it, points the layout link at it and rewrites the manifest, and the tree then passes. | `move my overlay sources onto the layout folder` | 1. `bash: T=$(mktemp -d)` -> 2. `bash: mkdir -p "$T/skilled-overlays/custom/bundle" "$T/.skilled/skills/hub/bundle" "$T/.skilled/links"` -> 3. `bash: printf 'readme one\n' > "$T/skilled-overlays/custom/bundle/readme.md"` -> 4. `bash: printf 'readme one\n' > "$T/.skilled/skills/hub/bundle/readme.md"` -> 5. `bash: printf '%s\n' '{"schemaVersion":1,"pin":{"upstream":"fixture","commit":"pin-one"},"layoutLinks":[{"path":".skilled/links/hub","target":"../../skilled-overlays/custom/bundle"}],"overlays":[{"id":"hub-bundle","scope":"directory","source":"custom/bundle","destination":".skilled/skills/hub/bundle"}],"regenerate":[],"verifyGenerated":[]}' > "$T/skilled-overlays/overlay-manifest.json"` -> 6. `bash: ln -s '../../skilled-overlays/custom/bundle' "$T/.skilled/links/hub"` -> 7. `bash: node .skilled/commands/doctor/scripts/overlay-engine.cjs status --root "$T"` -> 8. `bash: echo $?` -> 9. `bash: node .skilled/commands/doctor/scripts/overlay-engine.cjs apply --relayout --root "$T"` -> 10. `bash: echo $?` -> 11. `bash: readlink "$T/.skilled/links/hub"` -> 12. `bash: grep -c '"source":"skilled/skills/hub/bundle"' "$T/skilled-overlays/overlay-manifest.json"` -> 13. `bash: node .skilled/commands/doctor/scripts/overlay-engine.cjs apply --root "$T"` -> 14. `bash: node .skilled/commands/doctor/scripts/overlay-engine.cjs status --root "$T"` -> 15. `bash: echo $?` | Step 7 prints `in-sync=1 overlay-edited=0 live-edited=0 both-changed=0 upstream-moved=0`, then `LAYOUT   hub-bundle: source custom/bundle belongs at skilled/skills/hub/bundle; run node .skilled/commands/doctor/scripts/overlay-engine.cjs apply --relayout`, then `checked=3 ok=3 miss=0` and `RESULT: PASSED`. Step 8 prints `0`. Step 9 prints `backup skilled-overlays/relayout-runs/<stamp>`, then `moved custom/bundle -> skilled/skills/hub/bundle`, then `relinked .skilled/links/hub -> ../../skilled-overlays/skilled/skills/hub/bundle`, then `1 moved` and `run node .skilled/commands/doctor/scripts/overlay-engine.cjs apply`. Step 10 prints `0`. Step 11 prints `../../skilled-overlays/skilled/skills/hub/bundle`. Step 12 prints `1`. Step 13 prints `0 changed` and exits 0. Step 14 prints the count lines and `RESULT: PASSED` with no `LAYOUT` line, and step 15 prints `0`. | The `LAYOUT` line, the `moved` and `relinked` lines, the link target, the manifest count, and the exit statuses and reports from the closing apply and status. | PASS if step 7 prints that `LAYOUT` line and exits 0, step 9 prints the `moved` and `relinked` lines and exits 0, step 11 prints the new target, step 12 prints `1`, and steps 13 and 14 exit 0 with step 14 printing no `LAYOUT` line. FAIL if the `LAYOUT` line is absent or names another path, the `moved` or `relinked` line differs, the link still names the old target, the count is not `1`, or either closing command fails. SKIP when Node is unavailable in the environment, with the error named. | 1. Check that the entry's `destination` is the path the layout derives from and that step 6 wrote a link whose target reaches the entry's source. 2. Read the engine's `layoutMoves`, `relayoutLinkTargets` and `commandRelayout`. 3. Escalate with the status report, the relayout output, the link target and the manifest. |

### Evidence Review

The `LAYOUT` line with a passing `RESULT` carries the claim that the layout is advisory. The `moved` line names both paths, so it carries the move. The `relinked` line and the link's own target carry the link rewrite a state file with no record of that link still needs. The manifest count carries the rewritten `source`, and the closing pair carries the claim that the tree is settled: a run of `0 changed` and a status with no `LAYOUT` line.

---

## 4. SOURCE FILES

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Package policy and scenario index. |
| [Overlay reference](../../references/overlays.md) | The `LAYOUT` line, the layout path rule and what `apply --relayout` does. |
| `.skilled/commands/doctor/scripts/overlay-engine.cjs` | The engine under test. |
| `.skilled/commands/doctor/scripts/tests/overlay-engine-follow-up.test.cjs` | The regression test that pins the move and the settled tree. |

---

## 5. SOURCE METADATA

- Group: Overlays
- Playbook ID: SKD-009
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `overlays/relayout-moves-sources.md`
- Prompt equality requirement: the SCENARIO CONTRACT prompt equals the 9-column table Exact Prompt cell and the root summary prompt.
