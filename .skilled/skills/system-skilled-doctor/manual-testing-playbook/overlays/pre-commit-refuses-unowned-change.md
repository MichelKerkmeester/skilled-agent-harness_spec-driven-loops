---
title: "SKD-007 -- Overlay pre-commit refuses a staged change no overlay owns"
description: "This scenario validates that the pre-commit check exits 1 and names a staged vendored change no overlay owns, then exits 0 once the change is adopted and staged again."
catalog_applicable: false
version: 1.0.0.0
---

# SKD-007 -- Overlay pre-commit refuses a staged change no overlay owns

This file is the canonical operator contract for the commit check on a vendored file no overlay owns.

---

## 1. OVERVIEW

This scenario verifies that `pre-commit` exits 1 and prints one `refuse:` line for a staged vendored change that no overlay owns, then exits 0 with `allow` once that change is adopted and staged again.

### Why This Matters

A write hook only sees an agent's write tools. An edit made by a script, a formatter or a person reaches the commit unchecked, and the next re-pin overwrites it. The commit check is the last place that catches it, so it has to name the path and pass once the path is owned.

---

## 2. SCENARIO CONTRACT

- Objective: Prove the commit check refuses a staged unowned vendored change and passes once it is adopted.
- Real user request: `block the commit while a vendored file no overlay owns is staged`
- Prompt: `block the commit while a vendored file no overlay owns is staged`
- Expected execution process: Build a temporary workspace holding the vendored tree and a real upstream checkout side by side, commit the tree to a repository of its own, edit an upstream file no overlay owns, stage it, run the commit check, adopt the file, stage again and run the check again.
- Expected signals: Step 17 prints `refuse: staged change to .skilled/skills/hub/help.md is under a vendored root and no overlay owns it`, then `  bring each path under an overlay with node .skilled/commands/doctor/scripts/overlay-engine.cjs apply --adopt <path>, add a generator's output to the manifest's generated list, or unstage it`, then exits 1. Step 19 prints `adopted .skilled/skills/hub/help.md as skilled-overlays/skilled/skills/hub/help.md (file entry adopted-skilled-skills-hub-help-md)` and `1 changed`, then exits 0. Step 21 prints `allow` and exits 0.
- Desired user-visible outcome: The operator cannot commit an unowned vendored change, and the same commit passes after one adopt.
- Pass/fail: PASS if step 17 exits 1 with both refusal lines, step 19 exits 0 with the adopt line, and step 21 prints `allow` and exits 0. FAIL if step 17 exits 0, names another path, omits the `apply --adopt` fix, or step 21 refuses. SKIP when Node or git is unavailable in the environment, with the error named.

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
10. Run `printf 'help v1\n' > "$T/.skilled/skills/hub/help.md"`.
11. Run `printf '%s\n' "{\"schemaVersion\":1,\"pin\":{\"upstream\":\"fixture\",\"checkout\":\"$W/upstream\",\"commit\":\"$PIN\"},\"strictWrites\":true,\"generated\":[],\"repin\":{\"runtimeFolders\":[\".claude\"],\"rootFiles\":[]},\"layoutLinks\":[],\"overlays\":[{\"id\":\"own-skill\",\"scope\":\"directory\",\"source\":\"skilled/skills/own\",\"destination\":\".skilled/skills/own\"}],\"regenerate\":[],\"verifyGenerated\":[]}" > "$T/skilled-overlays/overlay-manifest.json"`.
12. Run `git -C "$T" init -q`.
13. Run `git -C "$T" add -A`.
14. Run `git -C "$T" -c user.name=Fixture -c user.email=fixture@example.invalid -c commit.gpgsign=false commit -q -m vendored`.
15. Run `printf 'help v1 edited in place\n' > "$T/.skilled/skills/hub/help.md"`.
16. Run `git -C "$T" add -A`.
17. Run `node .skilled/commands/doctor/scripts/overlay-engine.cjs pre-commit --root "$T"`.
18. Run `echo $?`.
19. Run `node .skilled/commands/doctor/scripts/overlay-engine.cjs apply --adopt .skilled/skills/hub/help.md --root "$T"`.
20. Run `git -C "$T" add -A`.
21. Run `node .skilled/commands/doctor/scripts/overlay-engine.cjs pre-commit --root "$T"`.
22. Run `echo $?`.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| SKD-007 | Pre-commit refusal | Prove the commit check refuses a staged unowned vendored change and passes once it is adopted. | `block the commit while a vendored file no overlay owns is staged` | 1. `bash: W=$(mktemp -d)` -> 2. `bash: T="$W/tree"` -> 3. `bash: mkdir -p "$T/skilled-overlays/skilled/skills/own" "$T/.skilled/skills/hub" "$W/upstream/.skilled/skills/hub"` -> 4. `bash: printf 'project skill\n' > "$T/skilled-overlays/skilled/skills/own/SKILL.md"` -> 5. `bash: printf 'help v1\n' > "$W/upstream/.skilled/skills/hub/help.md"` -> 6. `bash: git -C "$W/upstream" init -q` -> 7. `bash: git -C "$W/upstream" add -A` -> 8. `bash: git -C "$W/upstream" -c user.name=Fixture -c user.email=fixture@example.invalid -c commit.gpgsign=false commit -q -m pin-one` -> 9. `bash: PIN=$(git -C "$W/upstream" rev-parse HEAD)` -> 10. `bash: printf 'help v1\n' > "$T/.skilled/skills/hub/help.md"` -> 11. `bash: printf '%s\n' "{\"schemaVersion\":1,\"pin\":{\"upstream\":\"fixture\",\"checkout\":\"$W/upstream\",\"commit\":\"$PIN\"},\"strictWrites\":true,\"generated\":[],\"repin\":{\"runtimeFolders\":[\".claude\"],\"rootFiles\":[]},\"layoutLinks\":[],\"overlays\":[{\"id\":\"own-skill\",\"scope\":\"directory\",\"source\":\"skilled/skills/own\",\"destination\":\".skilled/skills/own\"}],\"regenerate\":[],\"verifyGenerated\":[]}" > "$T/skilled-overlays/overlay-manifest.json"` -> 12. `bash: git -C "$T" init -q` -> 13. `bash: git -C "$T" add -A` -> 14. `bash: git -C "$T" -c user.name=Fixture -c user.email=fixture@example.invalid -c commit.gpgsign=false commit -q -m vendored` -> 15. `bash: printf 'help v1 edited in place\n' > "$T/.skilled/skills/hub/help.md"` -> 16. `bash: git -C "$T" add -A` -> 17. `bash: node .skilled/commands/doctor/scripts/overlay-engine.cjs pre-commit --root "$T"` -> 18. `bash: echo $?` -> 19. `bash: node .skilled/commands/doctor/scripts/overlay-engine.cjs apply --adopt .skilled/skills/hub/help.md --root "$T"` -> 20. `bash: git -C "$T" add -A` -> 21. `bash: node .skilled/commands/doctor/scripts/overlay-engine.cjs pre-commit --root "$T"` -> 22. `bash: echo $?` | Step 17 prints `refuse: staged change to .skilled/skills/hub/help.md is under a vendored root and no overlay owns it`, then `  bring each path under an overlay with node .skilled/commands/doctor/scripts/overlay-engine.cjs apply --adopt <path>, add a generator's output to the manifest's generated list, or unstage it`, and step 18 prints `1`. Step 19 prints `adopted .skilled/skills/hub/help.md as skilled-overlays/skilled/skills/hub/help.md (file entry adopted-skilled-skills-hub-help-md)` and `1 changed`. Step 21 prints `allow`, and step 22 prints `0`. | The refusal lines, the adopt line and the exit statuses from steps 18 and 22. | PASS if step 17 exits 1 with both refusal lines, step 19 exits 0 with the adopt line, and step 21 prints `allow` and step 22 prints `0`. FAIL if step 17 exits 0, names another path, omits the `apply --adopt` fix, or step 21 refuses. SKIP when Node or git is unavailable in the environment, with the error named. | 1. Check that the vendored file is staged and that no entry names it as a destination. 2. Read the engine's `commandPreCommit` and `strictWriteRefusal`. 3. Escalate with both runs' printed lines and exit statuses. |

### Evidence Review

The refusal line carries the path and the attribution, and the exit status carries the block. The second run carries the closure claim: the same staged path passes once an entry owns it, so the check judges ownership and not the act of editing.

---

## 4. SOURCE FILES

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Package policy and scenario index. |
| [Overlay reference](../../references/overlays.md) | What the commit check judges and how a project calls it from its hook. |
| `.skilled/commands/doctor/scripts/overlay-engine.cjs` | The engine under test. |
| `.skilled/commands/doctor/scripts/tests/overlay-engine-strict-writes.test.cjs` | The regression test that pins the commit check's refusals and allows. |

---

## 5. SOURCE METADATA

- Group: Overlays
- Playbook ID: SKD-007
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `overlays/pre-commit-refuses-unowned-change.md`
- Prompt equality requirement: the SCENARIO CONTRACT prompt equals the 9-column table Exact Prompt cell and the root summary prompt.
