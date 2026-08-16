---
title: "VSN-014 -- OpenCode plugin"
description: "This scenario validates OpenCode plugin for `VSN-014`. It focuses on the plugin load path re-exports the built runtime with the 13 tools."
version: 1.0.0.0
---

# VSN-014 -- OpenCode plugin

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `VSN-014`.

---

## 1. OVERVIEW

This scenario validates OpenCode plugin for `VSN-014`. It focuses on the plugin load path re-exports the built runtime with the 13 tools.

### Why This Matters

The OpenCode plugin is the primary integration: if the load path breaks, no agent in OpenCode sees the tools.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `VSN-014` and confirm the expected signals without contradictory evidence.

- Objective: the plugin load path re-exports the built runtime and exposes the 13 tools
- Real user request: `Make sure sk-vision is available in OpenCode.`
- Prompt: `Make sure sk-vision is loaded as an OpenCode plugin and list its tools.`
- Expected execution process: run the deterministic command sequence exactly as written, keep the model warm between requests, and capture the response lines as evidence.
- Expected signals: Step 1: `test -f` exits 0 and the grep finds the `dist/plugin.js` re-export; Step 2: the built plugin bundle exists as a regular file; Step 3: the loop completes and prints `13 tools present`
- Desired user-visible outcome: a concise, accurate answer a real user would understand.
- Pass/fail: PASS if all three commands exit 0 and the bundle contains all 13 tool names; FAIL if any command exits non-zero (missing file, missing re-export, or missing tool name)

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| VSN-014 | OpenCode plugin | Verify the plugin load path re-exports the built runtime with the 13 tools | Make sure sk-vision is loaded as an OpenCode plugin and list its tools. | 1. bash: test -f .opencode/plugins/sk-vision.js && grep -q 'dist/plugin.js' .opencode/plugins/sk-vision.js -> 2. bash: test -f .opencode/skills/sk-vision/vision-runtime/dist/plugin.js -> 3. bash: for t in sk_vision_inspect sk_vision_detect sk_vision_point sk_vision_ocr sk_vision_status sk_vision_segment sk_vision_metadata sk_vision_crop sk_vision_zoom sk_vision_colors sk_vision_diff sk_vision_annotate sk_vision_reverse; do grep -q "$t" .opencode/skills/sk-vision/vision-runtime/dist/plugin.js \|\| exit 1; done; echo '13 tools present' | Step 1: `test -f` exits 0 and the grep finds the `dist/plugin.js` re-export; Step 2: the built plugin bundle exists as a regular file; Step 3: the loop completes and prints `13 tools present` | Exit codes for each command plus the `13 tools present` output line | PASS if all three commands exit 0 and the bundle contains all 13 tool names; FAIL if any command exits non-zero (missing file, missing re-export, or missing tool name) | 1. If the bundle is missing, rebuild with `bun run build` inside `vision-runtime/` -> 2. If a tool name is missing, rebuild after a code change; check `src/plugin.ts` -> 3. Verify `opencode.json` has no plugin array -> 4. Open an OpenCode session and confirm the 13 tools appear |

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Make sure sk-vision is loaded as an OpenCode plugin and list its tools.`

### Commands

1. `bash: test -f .opencode/plugins/sk-vision.js && grep -q 'dist/plugin.js' .opencode/plugins/sk-vision.js`
2. `bash: test -f .opencode/skills/sk-vision/vision-runtime/dist/plugin.js`
3. `bash: for t in sk_vision_inspect sk_vision_detect sk_vision_point sk_vision_ocr sk_vision_status sk_vision_segment sk_vision_metadata sk_vision_crop sk_vision_zoom sk_vision_colors sk_vision_diff sk_vision_annotate sk_vision_reverse; do grep -q "$t" .opencode/skills/sk-vision/vision-runtime/dist/plugin.js || exit 1; done; echo '13 tools present'`

### Expected

Step 1: `test -f` exits 0 and the grep finds the `dist/plugin.js` re-export; Step 2: the built plugin bundle exists as a regular file; Step 3: the loop completes and prints `13 tools present`

### Evidence

Exit codes for each command plus the `13 tools present` output line

### Pass / Fail

- **Pass**: all three commands exit 0 and the bundle contains all 13 tool names
- **Fail**: any command exits non-zero (missing file, missing re-export, or missing tool name)

### Failure Triage

1. If the bundle is missing, rebuild with `bun run build` inside `vision-runtime/` -> 2. If a tool name is missing, rebuild after a code change; check `src/plugin.ts` -> 3. Verify `opencode.json` has no plugin array -> 4. Open an OpenCode session and confirm the 13 tools appear

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
| `vision-runtime/src/plugin.ts` | Plugin definition registering the tools |
| `vision-runtime/src/opencode/attachments.ts` | Auto-inspect injector |
| `vision-runtime/src/providers/photon.test.ts` | Content-type and bbox parsing anchors |

---

## 5. SOURCE METADATA

- Group: Host adapters
- Playbook ID: VSN-014
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `host-adapters/opencode-plugin.md`
