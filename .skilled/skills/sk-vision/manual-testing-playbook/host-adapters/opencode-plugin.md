---
title: "VSN-014 -- OpenCode plugin"
description: "This scenario validates the OpenCode plugin load path, default tool silence, `/vision` activation and runtime teardown."
version: 1.0.0.0
---

# VSN-014 -- OpenCode plugin

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `VSN-014`.

---

## 1. OVERVIEW

This scenario validates the OpenCode plugin load path, default tool silence, `/vision` activation and runtime teardown.

### Why This Matters

The OpenCode plugin is the command integration. If the load path breaks, `/vision` cannot reach the latest image.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `VSN-014` and confirm the expected signals without contradictory evidence.

- Objective: the plugin load path supports `/vision` without advertising tools by default and tears down the runtime after each call
- Real user request: `Use /vision to read the latest screenshot in OpenCode without adding vision tools to the default list.`
- Prompt: `Use /vision to read the latest screenshot, then confirm that the vision runtime has closed.`
- Expected execution process: verify the built load path, confirm no vision tools are advertised with no flags, run the question and bare command forms against `<FIXTURE>`, then check that the runtime process has exited.
- Expected signals: Steps 1 and 2 exit 0. The default tool list contains no `sk_vision_*` tools. The question form returns a `<SK-VISION COMMAND>` block. Bare `/vision` returns scene, caption and OCR. The runtime process is absent after each call.
- Desired user-visible outcome: OpenCode answers the image request on demand and leaves no sk-vision runtime process.
- Pass/fail: PASS if the load path works, default tools stay unadvertised, both command forms return evidence and the runtime exits after each call. FAIL if any check fails.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| VSN-014 | OpenCode plugin | Verify the load path, default tool silence, `/vision` forms and teardown | Use `/vision` to read the latest screenshot, then confirm that the vision runtime has closed. | 1. bash: test -f .opencode/plugins/sk-vision.js && grep -q 'dist/plugin.js' .opencode/plugins/sk-vision.js -> 2. bash: test -f .opencode/skills/sk-vision/vision-runtime/dist/plugin.js -> 3. OpenCode with `SK_VISION_AUTOINSPECT` unset: confirm no `sk_vision_*` tools are advertised -> 4. OpenCode: attach `<FIXTURE>` and run `/vision What does this screenshot say?` -> 5. OpenCode: run bare `/vision` -> 6. host: check the runtime process after each call | Steps 1 and 2 exit 0. Step 3 lists no vision tools. Step 4 returns a `<SK-VISION COMMAND>` block. Step 5 returns scene, caption and OCR. Step 6 finds no runtime process | Load-path output, default tool list, both command responses and process check | PASS if the load path works, default tools stay unadvertised, both command forms return evidence and the runtime exits after each call. FAIL if any check fails. | 1. Rebuild `vision-runtime/dist` -> 2. Confirm `SK_VISION_AUTOINSPECT` is unset -> 3. Confirm the command has a recent image -> 4. Check the command hook output -> 5. Check `SK_VISION_TEARDOWN` and the runtime process |

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Use /vision to read the latest screenshot, then confirm that the vision runtime has closed.`

### Commands

1. `bash: test -f .opencode/plugins/sk-vision.js && grep -q 'dist/plugin.js' .opencode/plugins/sk-vision.js`
2. `bash: test -f .opencode/skills/sk-vision/vision-runtime/dist/plugin.js`
3. `OpenCode with SK_VISION_AUTOINSPECT unset: confirm no sk_vision_* tools are advertised`
4. `OpenCode: attach <FIXTURE> and run /vision What does this screenshot say?`
5. `OpenCode: run bare /vision`
6. `host: check the runtime process after each call`

### Expected

Steps 1 and 2 exit 0. The default tool list contains no `sk_vision_*` tools. The question form returns a `<SK-VISION COMMAND>` block. Bare `/vision` returns scene, caption and OCR. No runtime process remains after either call.

### Evidence

Load-path output, the default tool list, both command responses and the process check

### Pass / Fail

- **Pass**: the load path works, default tools stay unadvertised, both command forms return evidence and the runtime exits after each call
- **Fail**: any load-path, command, evidence or teardown check fails

### Failure Triage

1. Rebuild `vision-runtime/dist` -> 2. Confirm `SK_VISION_AUTOINSPECT` is unset -> 3. Confirm the command has a recent image -> 4. Check the command hook output -> 5. Check `SK_VISION_TEARDOWN` and the runtime process

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../feature-catalog/host-adapters/opencode-plugin.md` | Feature-catalog source describing the implementation contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/plugins/sk-vision.js` | Load-path re-export of the built runtime |
| `vision-runtime/src/plugin.ts` | Command hook and legacy activation path |
| `vision-runtime/src/opencode/command.ts` | `/vision` image read and teardown |
| `vision-runtime/src/opencode/attachments.ts` | Legacy auto-inspect injector |
| `vision-runtime/src/providers/photon.test.ts` | Content-type and bbox parsing anchors |

---

## 5. SOURCE METADATA

- Group: Host adapters
- Playbook ID: VSN-014
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `host-adapters/opencode-plugin.md`
