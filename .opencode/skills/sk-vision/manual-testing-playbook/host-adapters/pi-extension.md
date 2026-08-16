---
title: "VSN-015 -- Pi extension"
description: "This scenario validates Pi extension for `VSN-015`. It focuses on the extension symlink resolves and the factory registers the 13 tools."
version: 1.0.0.0
---

# VSN-015 -- Pi extension

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `VSN-015`.

---

## 1. OVERVIEW

This scenario validates Pi extension for `VSN-015`. It focuses on the extension symlink resolves and the factory registers the 13 tools.

### Why This Matters

The Pi extension gives the CLI host the same 13 tools; a broken symlink or factory silently removes the whole surface.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `VSN-015` and confirm the expected signals without contradictory evidence.

- Objective: the extension symlink resolves inside the skill tree and the factory registers the 13 tools
- Real user request: `Make sure sk-vision is available in Pi.`
- Prompt: `Make sure sk-vision is loaded as a Pi extension and list its tools.`
- Expected execution process: run the deterministic command sequence exactly as written, keep the model warm between requests, and capture the response lines as evidence.
- Expected signals: Step 1: `test -L` exits 0 and `readlink` prints a relative target inside the skill tree; Step 2: the owned factory file exists; Step 3: grep prints `13` (one registration per tool)
- Desired user-visible outcome: a concise, accurate answer a real user would understand.
- Pass/fail: PASS if the symlink resolves inside the skill tree, the factory exists, and exactly 13 `pi.registerTool` calls are present; FAIL if the symlink is dangling, the factory is missing, or the count differs from 13

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| VSN-015 | Pi extension | Verify the extension symlink resolves and the factory registers the 13 tools | Make sure sk-vision is loaded as a Pi extension and list its tools. | 1. bash: test -L .pi/extensions/sk-vision.ts && readlink .pi/extensions/sk-vision.ts -> 2. bash: test -f .opencode/skills/sk-vision/pi/sk-vision.ts -> 3. bash: grep -c 'pi.registerTool' .opencode/skills/sk-vision/pi/sk-vision.ts | Step 1: `test -L` exits 0 and `readlink` prints a relative target inside the skill tree; Step 2: the owned factory file exists; Step 3: grep prints `13` (one registration per tool) | The readlink output and grep count with exit codes | PASS if the symlink resolves inside the skill tree, the factory exists, and exactly 13 `pi.registerTool` calls are present; FAIL if the symlink is dangling, the factory is missing, or the count differs from 13 | 1. If the symlink dangles, recreate it pointing at `../../.opencode/skills/sk-vision/pi/sk-vision.ts` -> 2. If the count differs from 13, diff the tool list against the locked 13 names -> 3. Start `pi --offline --approve` and confirm the extension loads -> 4. Confirm relative imports resolve from the symlink directory |

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Make sure sk-vision is loaded as a Pi extension and list its tools.`

### Commands

1. `bash: test -L .pi/extensions/sk-vision.ts && readlink .pi/extensions/sk-vision.ts`
2. `bash: test -f .opencode/skills/sk-vision/pi/sk-vision.ts`
3. `bash: grep -c 'pi.registerTool' .opencode/skills/sk-vision/pi/sk-vision.ts`

### Expected

Step 1: `test -L` exits 0 and `readlink` prints a relative target inside the skill tree; Step 2: the owned factory file exists; Step 3: grep prints `13` (one registration per tool)

### Evidence

The readlink output and grep count with exit codes

### Pass / Fail

- **Pass**: the symlink resolves inside the skill tree, the factory exists, and exactly 13 `pi.registerTool` calls are present
- **Fail**: the symlink is dangling, the factory is missing, or the count differs from 13

### Failure Triage

1. If the symlink dangles, recreate it pointing at `../../.opencode/skills/sk-vision/pi/sk-vision.ts` -> 2. If the count differs from 13, diff the tool list against the locked 13 names -> 3. Start `pi --offline --approve` and confirm the extension loads -> 4. Confirm relative imports resolve from the symlink directory

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../feature-catalog/host-adapters/pi-extension.md` | Feature-catalog source describing the implementation contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.pi/extensions/sk-vision.ts` | Load-path symlink to the owned factory |
| `.opencode/skills/sk-vision/pi/sk-vision.ts` | ExtensionFactory registering the 13 tools |
| `vision-runtime/python/runtime.test.ts` | Runtime behavior the factory proxies |

---

## 5. SOURCE METADATA

- Group: Host adapters
- Playbook ID: VSN-015
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `host-adapters/pi-extension.md`
