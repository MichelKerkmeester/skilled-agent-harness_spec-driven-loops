---
title: "VSN-015 -- Pi extension"
description: "This scenario validates the Pi extension symlink, hidden tool registration, `/vision` activation and runtime teardown."
version: 1.0.0.0
---

# VSN-015 -- Pi extension

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `VSN-015`.

---

## 1. OVERVIEW

This scenario validates the Pi extension symlink, hidden tool registration, `/vision` activation and runtime teardown.

### Why This Matters

The Pi extension gives the CLI host on-demand image evidence. A broken symlink or factory removes the `/vision` path.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `VSN-015` and confirm the expected signals without contradictory evidence.

- Objective: the extension symlink resolves inside the skill tree, the factory registers hidden tools and `/vision` tears down its runtime
- Real user request: `Use /vision to read the latest screenshot in Pi without adding vision tools to the default list.`
- Prompt: `Use /vision to read the latest screenshot, then confirm that the vision runtime has closed.`
- Expected execution process: verify the extension path and 13 registrations, confirm the tools are hidden in a default Pi session, run the question and bare command forms against `<FIXTURE>`, then check that the runtime process has exited.
- Expected signals: Steps 1 and 2 exit 0. Step 3 prints `13`. The default tool list omits the hidden tools. The question form returns evidence. Bare `/vision` asks in the conversation or returns a full read. No runtime process remains after each call.
- Desired user-visible outcome: Pi answers the image request on demand without visible tool clutter or a lingering runtime.
- Pass/fail: PASS if the path works, the tools are hidden, both command forms behave as documented and the runtime exits after each call. FAIL if any check fails.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| VSN-015 | Pi extension | Verify the extension path, hidden registrations, `/vision` forms and teardown | Use `/vision` to read the latest screenshot, then confirm that the vision runtime has closed. | 1. bash: test -L .pi/extensions/sk-vision.ts && readlink .pi/extensions/sk-vision.ts -> 2. bash: test -f .opencode/skills/sk-vision/pi/sk-vision.ts -> 3. bash: grep -c 'pi.registerTool' .opencode/skills/sk-vision/pi/sk-vision.ts -> 4. Pi with `SK_VISION_AUTOINSPECT` unset: confirm the 13 tools are hidden -> 5. Pi: attach `<FIXTURE>` and run `/vision What does this screenshot say?` -> 6. Pi: run bare `/vision` -> 7. host: check the runtime process after each call | Steps 1 and 2 exit 0. Step 3 prints `13`. Step 4 shows hidden tools. Step 5 returns evidence. Step 6 asks in the conversation or returns a full read. Step 7 finds no runtime process | Symlink output, grep count, hidden-tool view, both command responses and process check | PASS if the path works, the tools are hidden, both command forms behave as documented and the runtime exits after each call. FAIL if any check fails. | 1. Confirm the symlink and factory -> 2. Confirm `SK_VISION_AUTOINSPECT` is unset -> 3. Confirm the hidden registration -> 4. Confirm the command has a recent image -> 5. Check `SK_VISION_TEARDOWN` and the runtime process |

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Use /vision to read the latest screenshot, then confirm that the vision runtime has closed.`

### Commands

1. `bash: test -L .pi/extensions/sk-vision.ts && readlink .pi/extensions/sk-vision.ts`
2. `bash: test -f .opencode/skills/sk-vision/pi/sk-vision.ts`
3. `bash: grep -c 'pi.registerTool' .opencode/skills/sk-vision/pi/sk-vision.ts`
4. `Pi with SK_VISION_AUTOINSPECT unset: confirm the 13 tools are hidden`
5. `Pi: attach <FIXTURE> and run /vision What does this screenshot say?`
6. `Pi: run bare /vision`
7. `host: check the runtime process after each call`

### Expected

Steps 1 and 2 exit 0. Step 3 prints `13`. The default tool list hides the 13 tools. The question form returns evidence. Bare `/vision` asks in the conversation or returns a full read. No runtime process remains after either call.

### Evidence

Symlink output, grep count, hidden-tool view, both command responses and the process check

### Pass / Fail

- **Pass**: the path works, the tools are hidden, both command forms behave as documented and the runtime exits after each call
- **Fail**: any path, registration, command, evidence or teardown check fails

### Failure Triage

1. Confirm the symlink and factory -> 2. Confirm `SK_VISION_AUTOINSPECT` is unset -> 3. Confirm the hidden registration -> 4. Confirm the command has a recent image -> 5. Check `SK_VISION_TEARDOWN` and the runtime process

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
| `.opencode/skills/sk-vision/pi/sk-vision.ts` | ExtensionFactory registering the 13 hidden tools and command path |
| `.pi/prompts/vision.md` | Pi `/vision` prompt |
| `vision-runtime/python/runtime.test.ts` | Runtime behavior the factory proxies |

---

## 5. SOURCE METADATA

- Group: Host adapters
- Playbook ID: VSN-015
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `host-adapters/pi-extension.md`
