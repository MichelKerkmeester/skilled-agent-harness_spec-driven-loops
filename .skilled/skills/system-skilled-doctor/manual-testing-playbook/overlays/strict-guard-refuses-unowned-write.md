---
title: "SKD-005 -- Overlay guard refuses a write under a vendored root that no overlay owns"
description: "This scenario validates that the overlay guard, with strictWrites set, refuses a new file and an unowned upstream file under a vendored root, and allows a path a generated glob covers and a path under repin.exclude."
catalog_applicable: false
version: 1.0.0.0
---

# SKD-005 -- Overlay guard refuses a write under a vendored root that no overlay owns

This file is the canonical operator contract for the guard's write checks with `strictWrites` turned on.

---

## 1. OVERVIEW

This scenario verifies that `--guard` exits 1 for a write under a vendored root that no overlay owns, and exits 0 with `allow` for a path a `generated` glob covers and for a path under a `repin.exclude` folder.

### Why This Matters

With the setting off the guard allows every write it cannot attribute, and the loss only shows at the next re-pin. The four paths here are the whole rule in one run: two refusals that name the fix, and two allows that keep a generator's output and a project-owned folder out of the way.

---

## 2. SCENARIO CONTRACT

- Objective: Prove the guard refuses an unowned write and allows a generated path and an excluded path.
- Real user request: `stop me writing into the vendored skilled tree where no overlay owns the file`
- Prompt: `stop me writing into the vendored skilled tree where no overlay owns the file`
- Expected execution process: Build a temporary tree whose manifest turns `strictWrites` on, then ask the guard about four paths and read each exit status.
- Expected signals: Step 6 prints `refuse: .skilled/skills/brand/new.md is a new file in the vendored tree, which a re-pin would not carry; create it as skilled-overlays/skilled/skills/brand/new.md, then run node .skilled/commands/doctor/scripts/overlay-engine.cjs apply --adopt .skilled/skills/brand` and step 7 prints `1`. Step 8 prints `refuse: .skilled/skills/hub/help.md is a vendored file no overlay owns, so a re-pin would overwrite this edit; run node .skilled/commands/doctor/scripts/overlay-engine.cjs apply --adopt .skilled/skills/hub/help.md, then edit skilled-overlays/skilled/skills/hub/help.md` and step 9 prints `1`. Steps 10 and 12 print `allow`, and steps 11 and 13 print `0`.
- Desired user-visible outcome: The operator learns which two writes need an overlay first and which two the manifest leaves alone.
- Pass/fail: PASS if steps 6 and 8 print those two refusal lines and exit 1, and steps 10 and 12 print `allow` and exit 0. FAIL if any printed line, exit status or tree state differs. SKIP when Node is unavailable in the environment, with the error named.

---

## 3. TEST EXECUTION

### Exact Command Sequence

1. Run `T=$(mktemp -d)`.
2. Run `mkdir -p "$T/skilled-overlays/skilled/skills/own" "$T/.skilled/skills/hub"`.
3. Run `printf 'project skill\n' > "$T/skilled-overlays/skilled/skills/own/SKILL.md"`.
4. Run `printf 'help v1\n' > "$T/.skilled/skills/hub/help.md"`.
5. Run `printf '%s\n' '{"schemaVersion":1,"pin":{"upstream":"fixture","commit":"pin-one"},"strictWrites":true,"generated":[".claude/agents/**"],"repin":{"runtimeFolders":[".claude"],"rootFiles":[],"exclude":[".skilled/local/"]},"layoutLinks":[],"overlays":[{"id":"own-skill","scope":"directory","source":"skilled/skills/own","destination":".skilled/skills/own"}],"regenerate":[],"verifyGenerated":[]}' > "$T/skilled-overlays/overlay-manifest.json"`.
6. Run `node .skilled/commands/doctor/scripts/overlay-engine.cjs --guard "$T/.skilled/skills/brand/new.md" --root "$T"`.
7. Run `echo $?`.
8. Run `node .skilled/commands/doctor/scripts/overlay-engine.cjs --guard "$T/.skilled/skills/hub/help.md" --root "$T"`.
9. Run `echo $?`.
10. Run `node .skilled/commands/doctor/scripts/overlay-engine.cjs --guard "$T/.claude/agents/helper.md" --root "$T"`.
11. Run `echo $?`.
12. Run `node .skilled/commands/doctor/scripts/overlay-engine.cjs --guard "$T/.skilled/local/scratch.sh" --root "$T"`.
13. Run `echo $?`.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| SKD-005 | Strict guard refusals | Prove the guard refuses an unowned write and allows a generated path and an excluded path. | `stop me writing into the vendored skilled tree where no overlay owns the file` | 1. `bash: T=$(mktemp -d)` -> 2. `bash: mkdir -p "$T/skilled-overlays/skilled/skills/own" "$T/.skilled/skills/hub"` -> 3. `bash: printf 'project skill\n' > "$T/skilled-overlays/skilled/skills/own/SKILL.md"` -> 4. `bash: printf 'help v1\n' > "$T/.skilled/skills/hub/help.md"` -> 5. `bash: printf '%s\n' '{"schemaVersion":1,"pin":{"upstream":"fixture","commit":"pin-one"},"strictWrites":true,"generated":[".claude/agents/**"],"repin":{"runtimeFolders":[".claude"],"rootFiles":[],"exclude":[".skilled/local/"]},"layoutLinks":[],"overlays":[{"id":"own-skill","scope":"directory","source":"skilled/skills/own","destination":".skilled/skills/own"}],"regenerate":[],"verifyGenerated":[]}' > "$T/skilled-overlays/overlay-manifest.json"` -> 6. `bash: node .skilled/commands/doctor/scripts/overlay-engine.cjs --guard "$T/.skilled/skills/brand/new.md" --root "$T"` -> 7. `bash: echo $?` -> 8. `bash: node .skilled/commands/doctor/scripts/overlay-engine.cjs --guard "$T/.skilled/skills/hub/help.md" --root "$T"` -> 9. `bash: echo $?` -> 10. `bash: node .skilled/commands/doctor/scripts/overlay-engine.cjs --guard "$T/.claude/agents/helper.md" --root "$T"` -> 11. `bash: echo $?` -> 12. `bash: node .skilled/commands/doctor/scripts/overlay-engine.cjs --guard "$T/.skilled/local/scratch.sh" --root "$T"` -> 13. `bash: echo $?` | Step 6 prints `refuse: .skilled/skills/brand/new.md is a new file in the vendored tree, which a re-pin would not carry; create it as skilled-overlays/skilled/skills/brand/new.md, then run node .skilled/commands/doctor/scripts/overlay-engine.cjs apply --adopt .skilled/skills/brand` and step 7 prints `1`. Step 8 prints `refuse: .skilled/skills/hub/help.md is a vendored file no overlay owns, so a re-pin would overwrite this edit; run node .skilled/commands/doctor/scripts/overlay-engine.cjs apply --adopt .skilled/skills/hub/help.md, then edit skilled-overlays/skilled/skills/hub/help.md` and step 9 prints `1`. Steps 10 and 12 print `allow`, and steps 11 and 13 print `0`. | The refusal lines, the two `allow` lines and every exit status from steps 7, 9, 11 and 13. | PASS if steps 6 and 8 print those two refusal lines and exit 1, and steps 10 and 12 print `allow` and exit 0. FAIL if a refusal names another path, omits the command it tells the operator to run, or a printed line or exit status differs. SKIP when Node is unavailable in the environment, with the error named. | 1. Check that the manifest holds `"strictWrites": true`. 2. Read the engine's `strictWriteRefusal` and `writeCheckSettings`. 3. Escalate with the printed lines and the four exit statuses. |

### Evidence Review

Each exit status carries its refusal or its allow, so a run that printed the right words and returned zero still fails here. The two allowed paths carry the exemption claim, and each one differs in kind: a `generated` glob covers the first and a `repin.exclude` folder covers the second.

---

## 4. SOURCE FILES

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Package policy and scenario index. |
| [Overlay reference](../../references/overlays.md) | The `strictWrites` rule, the refusals it produces and the two exemptions. |
| `.skilled/commands/doctor/scripts/overlay-engine.cjs` | The engine under test. |
| `.skilled/commands/doctor/scripts/tests/overlay-engine-strict-writes.test.cjs` | The regression test that pins the strict refusals. |

---

## 5. SOURCE METADATA

- Group: Overlays
- Playbook ID: SKD-005
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `overlays/strict-guard-refuses-unowned-write.md`
- Prompt equality requirement: the SCENARIO CONTRACT prompt equals the 9-column table Exact Prompt cell and the root summary prompt.
