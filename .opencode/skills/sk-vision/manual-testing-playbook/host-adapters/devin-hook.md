---
title: "VSN-028 -- Devin prompt-time injection"
description: "This scenario validates that the Devin hook analyzes an image named in a prompt and injects the evidence into the same turn, without the model asking."
version: 1.0.0.0
---

# VSN-028 -- Devin prompt-time injection

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `VSN-028`.

---

## 1. OVERVIEW

This scenario validates that the Devin hook analyzes an image named in a prompt and injects the evidence into the same turn, without the model asking.

### Why This Matters

Devin often runs a text-only model that cannot see an attached image. A model that cannot see an image also cannot know to ask about it, so an instruction to call a tool is the weakest possible guarantee. Injection removes that dependency: the evidence is in the turn before the model reads the message. If the hook silently stops firing, the model answers from the filename and sounds confident doing it.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `VSN-028` and confirm the expected signals without contradictory evidence.

- Objective: the hook is registered, fires on a prompt naming a resolvable image, injects a `<SK-VISION EVIDENCE>` block, and stays silent otherwise
- Real user request: `What does ./scratch/error.png say?`
- Prompt: `What does <FIXTURE> say?`
- Expected execution process: verify the registration and the built core, drive the adapter directly with a payload, then run a live Devin session naming the fixture and one naming no image
- Expected signals: the registration exists; the adapter returns `hookSpecificOutput.additionalContext` containing the evidence marker; the live reply quotes text from the image; a prompt naming no image yields `{}` and no GPU spin
- Desired user-visible outcome: Devin answers correctly about an image nobody told it to inspect
- Pass/fail: PASS if the hook injects on a resolvable path, the model answers from that evidence, and the no-image case stays silent. FAIL on a missing registration, an empty envelope for a real image, or any stderr output

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| VSN-028 | Devin prompt-time injection | Verify registration, injection on a real image, and silence otherwise | What does `<FIXTURE>` say? | 1. bash: `node -e 'const h=require("./.devin/hooks.v1.json"); const hit=h.UserPromptSubmit[0].hooks.some(x=>x.command.includes("sk-vision.mjs")); if(!hit) throw new Error("not registered"); console.log("registered")'` -> 2. bash: `test -f .opencode/skills/sk-vision/vision-runtime/dist/prompt-evidence.js` -> 3. bash: `echo '{"prompt":"what does <FIXTURE> say?","cwd":"'$PWD'","hook_event_name":"UserPromptSubmit"}' \| node .opencode/skills/sk-vision/hooks/devin/sk-vision.mjs` -> 4. Devin: start a session in this repo and send the prompt naming `<FIXTURE>` -> 5. Devin: send a prompt naming no image | Step 1 prints `registered`. Step 2 exits 0. Step 3 prints an envelope whose `additionalContext` starts with `<SK-VISION EVIDENCE>`. Step 4 quotes text actually in the image. Step 5 produces no vision block and no GPU spin | Registration output, the adapter envelope, the live reply, and the silent no-image turn | PASS if the hook injects on a resolvable path, the model answers from that evidence, and the no-image case stays silent. FAIL on a missing registration, an empty envelope for a real image, or any stderr output | 1. Confirm the registration in `.devin/hooks.v1.json` -> 2. Run `bun run scripts/build.ts` in `vision-runtime/` -> 3. Confirm the path in the prompt resolves from `cwd` -> 4. Check `SYSTEM_SK_VISION_DISABLED` and `SYSTEM_HOOKS_DISABLED` -> 5. On a cold model, expect the 60-second timeout to skip the first turn |

---

## 3. TEST EXECUTION

### Prompt

`What does <FIXTURE> say?`

### Commands

1. `bash`: assert the adapter is registered on `UserPromptSubmit` in `.devin/hooks.v1.json`
2. `bash`: assert `vision-runtime/dist/prompt-evidence.js` exists
3. `bash`: pipe a payload naming `<FIXTURE>` into `hooks/devin/sk-vision.mjs`
4. `Devin`: send the prompt naming `<FIXTURE>` in a live session
5. `Devin`: send a prompt naming no image

### Expected

Step 1 prints `registered`. Step 2 exits 0. Step 3 returns an envelope with `hookEventName: UserPromptSubmit` and an `additionalContext` opening with `<SK-VISION EVIDENCE>`. Step 4 quotes text that is actually in the image. Step 5 returns `{}` with no runtime spawned.

### Evidence

The registration assertion, the raw adapter envelope, the live Devin reply, and the silent no-image turn.

### Pass / Fail

PASS if the hook injects on a resolvable path, the model answers from that evidence, and the no-image case stays silent. FAIL on a missing registration, an empty envelope for a real image, or any bytes on stderr.

### Failure Triage

1. Confirm the registration entry in `.devin/hooks.v1.json`
2. Run `bun run scripts/build.ts` in `vision-runtime/`, since `dist/` is gitignored
3. Confirm the path in the prompt resolves relative to the payload's `cwd`
4. Check `SYSTEM_SK_VISION_DISABLED` and `SYSTEM_HOOKS_DISABLED`
5. On a cold model expect the 60-second timeout to skip the first turn; retry once warm

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../feature-catalog/host-adapters/devin-hook.md` | Feature-catalog source describing the implementation contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skills/sk-vision/hooks/devin/sk-vision.mjs` | The adapter under test |
| `.devin/hooks.v1.json` | Devin registration on `UserPromptSubmit` |
| `vision-runtime/src/evidence/prompt-evidence.ts` | Shared detection and analysis core |
| `.opencode/skills/sk-vision/hooks/devin/sk-vision-devin.test.mjs` | Fail-open and wiring assertions |

---

## 5. SOURCE METADATA

- Group: Host adapters
- Playbook ID: VSN-028
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `host-adapters/devin-hook.md`
