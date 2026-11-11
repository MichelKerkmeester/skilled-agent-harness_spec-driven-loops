---
title: "SKD-006 -- Overlay adopt takes an unowned upstream file into the overlay folder"
description: "This scenario validates that apply --adopt on an upstream file no overlay owns appends the manifest entry, copies the edited live file into the overlay folder, pins the upstream bytes and leaves a tree whose status passes."
catalog_applicable: false
version: 1.0.0.0
---

# SKD-006 -- Overlay adopt takes an unowned upstream file into the overlay folder

This file is the canonical operator contract for adopting an upstream file that no overlay owns.

---

## 1. OVERVIEW

This scenario verifies that `apply --adopt` on an upstream file no overlay owns appends one file entry to the manifest, copies the edited live file into the overlay folder, pins upstream's own bytes at the manifest's pin, and leaves `status` passing.

### Why This Matters

An edit to an upstream file that no overlay owns is lost at the next re-pin, and the guard refuses it. Adopt is the way out, so it has to keep the edit, record where the copy lives and make the tree pass the check afterwards. A run that copied the wrong bytes, or pinned the project edit as upstream's, would look healthy until the re-pin.

---

## 2. SCENARIO CONTRACT

- Objective: Prove adopt keeps the project edit, appends the entry and leaves a passing tree.
- Real user request: `adopt an upstream skill file i edited in place so a re-pin keeps my change`
- Prompt: `adopt an upstream skill file i edited in place so a re-pin keeps my change`
- Expected execution process: Build a temporary workspace holding the project tree and a real upstream checkout side by side, edit the vendored copy of an upstream file in place, adopt it, then read the manifest, the overlay copy and the status report.
- Expected signals: Step 12 prints `adopted .skilled/skills/hub/help.md as skilled-overlays/skilled/skills/hub/help.md (file entry adopted-skilled-skills-hub-help-md)` and `1 changed`, then exits 0. Step 13 prints `1`. Step 14 prints `help v1 edited in place`. Step 15 prints the count line `in-sync=2 overlay-edited=0 live-edited=0 both-changed=0 upstream-moved=0`, then `checked=3 ok=3 miss=0` and `RESULT: PASSED`, and exits 0.
- Desired user-visible outcome: The operator keeps the edit, sees the new overlay copy and gets a passing check.
- Pass/fail: PASS if steps 12 and 15 exit 0 with those lines, step 13 prints `1` and step 14 prints the edited line. FAIL if the adopt line is absent, the entry count is not `1`, the overlay copy holds different bytes or the status fails. SKIP when Node or git is unavailable in the environment, with the error named.

---

## 3. TEST EXECUTION

### Exact Command Sequence

1. Run `W=$(mktemp -d)`.
2. Run `T="$W/tree"`.
3. Run `mkdir -p "$T/skilled-overlays/skilled/skills/own" "$T/.skilled/skills/hub" "$W/upstream/.skilled/skills/hub"`.
4. Run `printf 'project skill\n' > "$T/skilled-overlays/skilled/skills/own/SKILL.md"`.
5. Run `printf 'help v1\n' > "$W/upstream/.skilled/skills/hub/help.md"`.
6. Run `git -C "$W/upstream" init -q`.
7. Run `git -C "$W/upstream" add -A`.
8. Run `git -C "$W/upstream" -c user.name=Fixture -c user.email=fixture@example.invalid -c commit.gpgsign=false commit -q -m pin-one`.
9. Run `PIN=$(git -C "$W/upstream" rev-parse HEAD)`.
10. Run `printf 'help v1 edited in place\n' > "$T/.skilled/skills/hub/help.md"`.
11. Run `printf '%s\n' "{\"schemaVersion\":1,\"pin\":{\"upstream\":\"fixture\",\"checkout\":\"$W/upstream\",\"commit\":\"$PIN\"},\"strictWrites\":true,\"generated\":[],\"repin\":{\"runtimeFolders\":[\".claude\"],\"rootFiles\":[]},\"layoutLinks\":[],\"overlays\":[{\"id\":\"own-skill\",\"scope\":\"directory\",\"source\":\"skilled/skills/own\",\"destination\":\".skilled/skills/own\"}],\"regenerate\":[],\"verifyGenerated\":[]}" > "$T/skilled-overlays/overlay-manifest.json"`.
12. Run `node .skilled/commands/doctor/scripts/overlay-engine.cjs apply --adopt .skilled/skills/hub/help.md --root "$T"`.
13. Run `grep -c 'adopted-skilled-skills-hub-help-md' "$T/skilled-overlays/overlay-manifest.json"`.
14. Run `cat "$T/skilled-overlays/skilled/skills/hub/help.md"`.
15. Run `node .skilled/commands/doctor/scripts/overlay-engine.cjs status --root "$T"`.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| SKD-006 | Adopting an unowned file | Prove adopt keeps the project edit, appends the entry and leaves a passing tree. | `adopt an upstream skill file i edited in place so a re-pin keeps my change` | 1. `bash: W=$(mktemp -d)` -> 2. `bash: T="$W/tree"` -> 3. `bash: mkdir -p "$T/skilled-overlays/skilled/skills/own" "$T/.skilled/skills/hub" "$W/upstream/.skilled/skills/hub"` -> 4. `bash: printf 'project skill\n' > "$T/skilled-overlays/skilled/skills/own/SKILL.md"` -> 5. `bash: printf 'help v1\n' > "$W/upstream/.skilled/skills/hub/help.md"` -> 6. `bash: git -C "$W/upstream" init -q` -> 7. `bash: git -C "$W/upstream" add -A` -> 8. `bash: git -C "$W/upstream" -c user.name=Fixture -c user.email=fixture@example.invalid -c commit.gpgsign=false commit -q -m pin-one` -> 9. `bash: PIN=$(git -C "$W/upstream" rev-parse HEAD)` -> 10. `bash: printf 'help v1 edited in place\n' > "$T/.skilled/skills/hub/help.md"` -> 11. `bash: printf '%s\n' "{\"schemaVersion\":1,\"pin\":{\"upstream\":\"fixture\",\"checkout\":\"$W/upstream\",\"commit\":\"$PIN\"},\"strictWrites\":true,\"generated\":[],\"repin\":{\"runtimeFolders\":[\".claude\"],\"rootFiles\":[]},\"layoutLinks\":[],\"overlays\":[{\"id\":\"own-skill\",\"scope\":\"directory\",\"source\":\"skilled/skills/own\",\"destination\":\".skilled/skills/own\"}],\"regenerate\":[],\"verifyGenerated\":[]}" > "$T/skilled-overlays/overlay-manifest.json"` -> 12. `bash: node .skilled/commands/doctor/scripts/overlay-engine.cjs apply --adopt .skilled/skills/hub/help.md --root "$T"` -> 13. `bash: grep -c 'adopted-skilled-skills-hub-help-md' "$T/skilled-overlays/overlay-manifest.json"` -> 14. `bash: cat "$T/skilled-overlays/skilled/skills/hub/help.md"` -> 15. `bash: node .skilled/commands/doctor/scripts/overlay-engine.cjs status --root "$T"` | Step 12 prints `adopted .skilled/skills/hub/help.md as skilled-overlays/skilled/skills/hub/help.md (file entry adopted-skilled-skills-hub-help-md)` and `1 changed`, then exits 0. Step 13 prints `1`. Step 14 prints `help v1 edited in place`. Step 15 prints `in-sync=2 overlay-edited=0 live-edited=0 both-changed=0 upstream-moved=0`, then `checked=3 ok=3 miss=0` and `RESULT: PASSED`, and exits 0. | The adopt line, the entry count, the overlay copy's bytes and the status report with its exit status. | PASS if steps 12 and 15 exit 0 with those lines, step 13 prints `1` and step 14 prints the edited line. FAIL if the adopt line is absent, the entry count is not `1`, the overlay copy holds different bytes or the status prints `RESULT: FAILED`. SKIP when Node or git is unavailable in the environment, with the error named. | 1. Check that `pin.checkout` names the checkout that holds `pin.commit`. 2. Read the engine's `adoptUnderLock` and `pinnedUpstreamBytes`. 3. Escalate with the adopt line, the count, the copied bytes and the status report. |

### Evidence Review

The adopt line carries the entry id and the copy path. The copy's bytes carry the claim that the edit survived, and the entry count carries the claim that the manifest gained exactly one entry. The status report carries the claim that the tree passes after the run.

---

## 4. SOURCE FILES

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Package policy and scenario index. |
| [Overlay reference](../../references/overlays.md) | What adopt copies, and which upstream bytes it pins the entry to. |
| `.skilled/commands/doctor/scripts/overlay-engine.cjs` | The engine under test. |
| `.skilled/commands/doctor/scripts/tests/overlay-engine-strict-writes.test.cjs` | The regression test that pins adopt's copy, entry and pin. |

---

## 5. SOURCE METADATA

- Group: Overlays
- Playbook ID: SKD-006
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `overlays/adopt-an-unowned-file.md`
- Prompt equality requirement: the SCENARIO CONTRACT prompt equals the 9-column table Exact Prompt cell and the root summary prompt.
