---
title: "VSN-027 -- Pi /vision command"
description: "This scenario validates the Pi `/vision` command, hidden tool registration and runtime teardown."
version: 1.0.0.0
---

# VSN-027 -- Pi /vision command

This document captures the user-testing contract, current behavior, execution flow, source anchors and metadata for the Pi `/vision` command.

---

## 1. OVERVIEW

This scenario validates question and bare `/vision` forms in Pi. It also checks that the default tools stay hidden and that each call tears down the runtime.

### Why This Matters

Pi should remain idle until the user asks for image evidence. The hidden tool still needs to answer the command without entering the default tool list.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `VSN-027` and confirm the expected signals without contradictory evidence.

- Objective: the Pi extension registers hidden tools, supports both `/vision` forms and tears down the runtime
- Real user request: `Use /vision to read the latest screenshot in Pi without adding vision tools to the default list.`
- Prompt: `Use /vision to read the latest screenshot, then confirm that the vision runtime has closed.`
- Preconditions: the Pi extension is loaded, `SK_VISION_AUTOINSPECT` is unset, `SK_VISION_TEARDOWN` is unset or set to `close` and `<FIXTURE>` is the most-recent session image.
- Expected execution process: confirm the 13 tools are hidden, run `/vision <question>`, run bare `/vision`, capture the evidence and check the runtime process after each call.
- Expected signals: the default tool list omits the hidden tools. The question form returns evidence. Bare `/vision` asks in the conversation or returns a full read because a prompt file cannot open a UI input box. No runtime process remains after either call.
- Desired user-visible outcome: Pi answers the image request on demand without visible tool clutter or a lingering runtime.
- Pass/fail: PASS if the tools stay hidden, both command forms behave as documented and the runtime exits after each call. FAIL if any check fails.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| VSN-027 | Pi `/vision` command | Verify hidden tools, question and bare forms and teardown | Use `/vision` to read the latest screenshot, then confirm that the vision runtime has closed. | 1. bash: `test -L .pi/extensions/sk-vision.ts && readlink .pi/extensions/sk-vision.ts` -> 2. bash: `grep -c 'pi.registerTool' .opencode/skills/sk-vision/pi/sk-vision.ts` -> 3. Pi with `SK_VISION_AUTOINSPECT` unset: confirm the 13 tools are hidden -> 4. Pi: attach `<FIXTURE>` and run `/vision What does this screenshot say?` -> 5. Pi: run bare `/vision` -> 6. host: check the runtime process after each call | Step 1 exits 0. Step 2 prints `13`. Step 3 shows hidden tools. Step 4 returns evidence. Step 5 asks in the conversation or returns a full read. Step 6 finds no runtime process | Symlink output, registration count, hidden-tool view, both command responses and process checks | PASS if all six steps produce the expected signals. FAIL if the extension is missing, tools are visible, evidence is missing or a runtime process remains. | 1. Confirm the symlink and factory -> 2. Confirm `SK_VISION_AUTOINSPECT` is unset -> 3. Confirm hidden registration -> 4. Confirm `<FIXTURE>` is the latest image -> 5. Check `SK_VISION_TEARDOWN` and the process list |

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Use /vision to read the latest screenshot, then confirm that the vision runtime has closed.`

### Commands

1. `bash: test -L .pi/extensions/sk-vision.ts && readlink .pi/extensions/sk-vision.ts`
2. `bash: grep -c 'pi.registerTool' .opencode/skills/sk-vision/pi/sk-vision.ts`
3. `Pi with SK_VISION_AUTOINSPECT unset: confirm the 13 tools are hidden`
4. `Pi: attach <FIXTURE> and run /vision What does this screenshot say?`
5. `Pi: run bare /vision`
6. `host: check the runtime process after each call`

### Expected

The default Pi tool list hides the 13 tools. The question form returns evidence. Bare `/vision` asks in the conversation or returns a full read. No runtime process remains after either call.

### Evidence

Capture the symlink output, registration count, hidden-tool view, both command responses and the process checks.

### Pass / Fail

- **Pass**: the tools stay hidden, both command forms behave as documented and the runtime exits after each call
- **Fail**: the extension is missing, tools are visible, evidence is missing or a runtime process remains

### Failure Triage

1. Confirm the symlink and factory -> 2. Confirm `SK_VISION_AUTOINSPECT` is unset -> 3. Confirm hidden registration -> 4. Confirm `<FIXTURE>` is the latest image -> 5. Check `SK_VISION_TEARDOWN` and the process list

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../feature-catalog/host-adapters/pi-extension.md` | Feature catalog source for the Pi adapter |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.pi/extensions/sk-vision.ts` | Pi load path |
| `.opencode/skills/sk-vision/pi/sk-vision.ts` | Hidden tool registration and command path |
| `.pi/prompts/vision.md` | Pi `/vision` prompt |
| `vision-runtime/python/runtime.test.ts` | Runtime behavior the hidden tool proxies |

---

## 5. SOURCE METADATA

- Group: Host adapters
- Playbook ID: VSN-027
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `host-adapters/pi-vision-command.md`
