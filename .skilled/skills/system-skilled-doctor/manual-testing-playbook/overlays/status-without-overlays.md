---
title: "SKD-003 -- Overlay status on a tree with no overlays names the missing manifest"
description: "This scenario validates that the overlay engine's status target, run on a tree that keeps no overlays, names the manifest it looked for and writes nothing."
catalog_applicable: false
version: 1.0.1.0
---

# SKD-003 -- Overlay status on a tree with no overlays names the missing manifest

This file is the canonical operator contract for running the overlay status check where no overlays exist.

---

## 1. OVERVIEW

This scenario verifies that `status` on an empty tree exits 2, names the default manifest path it looked for, and leaves the tree empty.

### Why This Matters

A project that never set up overlays must get a clear answer naming the default folder, not a silent pass that reads as "everything in sync".

---

## 2. SCENARIO CONTRACT

- Objective: Prove `status` names the missing manifest and writes nothing.
- Real user request: `check my vendored skilled overlays in a folder that has none`
- Prompt: `check my vendored skilled overlays in a folder that has none`
- Expected execution process: Make an empty folder, run `status` against it, then list the folder.
- Expected signals: Step 2 prints `no overlay manifest at skilled-overlays/overlay-manifest.json` and exits 2. Step 3 lists nothing.
- Desired user-visible outcome: The operator learns that the tree has no overlay manifest and where one would go.
- Pass/fail: PASS if step 2 exits 2 with that message and step 3 lists nothing. FAIL if step 2 exits 0 or 1, or step 3 lists any file. SKIP when Node is unavailable in the environment, with the error named.

---

## 3. TEST EXECUTION

### Exact Command Sequence

1. Run `T=$(mktemp -d)`.
2. Run `node .skilled/commands/doctor/scripts/overlay-engine.cjs status --root "$T"`.
3. Run `ls -A "$T"`.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| SKD-003 | Status without overlays | Prove `status` names the missing manifest and writes nothing. | `check my vendored skilled overlays in a folder that has none` | 1. `bash: T=$(mktemp -d)` -> 2. `bash: node .skilled/commands/doctor/scripts/overlay-engine.cjs status --root "$T"` -> 3. `bash: ls -A "$T"` | Step 2 prints `no overlay manifest at skilled-overlays/overlay-manifest.json` and exits 2. Step 3 lists nothing. | The output and exit status of steps 2 and 3. | PASS if step 2 exits 2 with that message and step 3 lists nothing. FAIL if step 2 exits 0 or 1, or step 3 lists a file. SKIP when Node is unavailable in the environment, with the error named. | 1. Check for a `.skilled-overlays.json` the engine could have read. 2. Read the engine's `resolveOverlayDir`. 3. Escalate with both outputs. |

### Evidence Review

The exit code carries the claim: 2 is a precondition failure, and 0 would wrongly say the tree is in sync.

---

## 4. SOURCE FILES

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Package policy and scenario index. |
| [Overlay reference](../../references/overlays.md) | Where the overlay folder and its manifest are found. |
| `.skilled/commands/doctor/scripts/overlay-engine.cjs` | The engine under test. |

---

## 5. SOURCE METADATA

- Group: Overlays
- Playbook ID: SKD-003
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `overlays/status-without-overlays.md`
- Prompt equality requirement: the SCENARIO CONTRACT prompt equals the 9-column table Exact Prompt cell and the root summary prompt.
