---
title: "VSN-026 -- OpenCode /vision command"
description: "This scenario validates the OpenCode `/vision` command, default tool silence and runtime teardown."
version: 1.0.0.0
---

# VSN-026 -- OpenCode /vision command

This document captures the user-testing contract, current behavior, execution flow, source anchors and metadata for the OpenCode `/vision` command.

---

## 1. OVERVIEW

This scenario validates question and bare `/vision` forms in OpenCode. It also checks that the default plugin advertises no vision tools and that each call tears down the runtime.

### Why This Matters

OpenCode should remain idle until the user asks for image evidence. The command must still provide a complete read when the user needs one.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `VSN-026` and confirm the expected signals without contradictory evidence.

- Objective: the OpenCode plugin supports both `/vision` forms without default tool advertisement and tears down the runtime
- Real user request: `Use /vision to read the latest screenshot in OpenCode without adding vision tools to the default list.`
- Prompt: `Use /vision to read the latest screenshot, then confirm that the vision runtime has closed.`
- Preconditions: the built OpenCode plugin is loaded, `SK_VISION_AUTOINSPECT` is unset, `SK_VISION_TEARDOWN` is unset or set to `close` and `<FIXTURE>` is the most-recent session image.
- Expected execution process: confirm the default tool list is quiet, run `/vision <question>`, run bare `/vision`, capture both evidence blocks and check the runtime process after each call.
- Expected signals: no `sk_vision_*` tools are advertised by default. The question form returns a `<SK-VISION COMMAND>` block. Bare `/vision` returns scene, caption and OCR. No runtime process remains after either call.
- Desired user-visible outcome: OpenCode answers the image request on demand and leaves no sk-vision runtime process.
- Pass/fail: PASS if the default tool list is quiet, both command forms return the expected evidence and the runtime exits after each call. FAIL if any check fails.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| VSN-026 | OpenCode `/vision` command | Verify default tool silence, question and bare forms and teardown | Use `/vision` to read the latest screenshot, then confirm that the vision runtime has closed. | 1. bash: `test -f .opencode/plugins/sk-vision.js && grep -q 'dist/plugin.js' .opencode/plugins/sk-vision.js` -> 2. OpenCode with `SK_VISION_AUTOINSPECT` unset: confirm no `sk_vision_*` tools are advertised -> 3. OpenCode: attach `<FIXTURE>` and run `/vision What does this screenshot say?` -> 4. OpenCode: run bare `/vision` -> 5. host: check the runtime process after each call | Step 1 exits 0. Step 2 lists no vision tools. Step 3 returns a `<SK-VISION COMMAND>` block. Step 4 returns scene, caption and OCR. Step 5 finds no runtime process | Load-path output, default tool list, both command responses and process checks | PASS if all five steps produce the expected signals. FAIL if the plugin is missing, a tool is advertised, evidence is missing or a runtime process remains. | 1. Rebuild `vision-runtime/dist` -> 2. Confirm `SK_VISION_AUTOINSPECT` is unset -> 3. Confirm `<FIXTURE>` is the latest image -> 4. Check the command hook output -> 5. Check `SK_VISION_TEARDOWN` and the process list |

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Use /vision to read the latest screenshot, then confirm that the vision runtime has closed.`

### Commands

1. `bash: test -f .opencode/plugins/sk-vision.js && grep -q 'dist/plugin.js' .opencode/plugins/sk-vision.js`
2. `OpenCode with SK_VISION_AUTOINSPECT unset: confirm no sk_vision_* tools are advertised`
3. `OpenCode: attach <FIXTURE> and run /vision What does this screenshot say?`
4. `OpenCode: run bare /vision`
5. `host: check the runtime process after each call`

### Expected

The default OpenCode tool list contains no `sk_vision_*` tools. The question form returns a `<SK-VISION COMMAND>` block. Bare `/vision` returns scene, caption and OCR. No runtime process remains after either call.

### Evidence

Capture the load-path check, default tool list, both command responses and the process checks.

### Pass / Fail

- **Pass**: the default tool list is quiet, both command forms return the expected evidence and the runtime exits after each call
- **Fail**: the plugin is missing, a tool is advertised, evidence is missing or a runtime process remains

### Failure Triage

1. Rebuild `vision-runtime/dist` -> 2. Confirm `SK_VISION_AUTOINSPECT` is unset -> 3. Confirm `<FIXTURE>` is the latest image -> 4. Check the command hook output -> 5. Check `SK_VISION_TEARDOWN` and the process list

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../feature-catalog/host-adapters/opencode-plugin.md` | Feature catalog source for the OpenCode adapter |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/plugins/sk-vision.js` | OpenCode load path |
| `vision-runtime/src/plugin.ts` | Command hook and default registration posture |
| `vision-runtime/src/opencode/command.ts` | `/vision` image read and teardown |
| `vision-runtime/src/opencode/attachments.ts` | Legacy auto-inspect path |

---

## 5. SOURCE METADATA

- Group: Host adapters
- Playbook ID: VSN-026
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `host-adapters/opencode-vision-command.md`
