---
title: "VSN-029 -- Cursor CLI read"
description: "This scenario validates that Cursor's `/vision` command runs the built CLI, answers from its output, and honors the documented exit-code contract."
version: 1.0.0.0
---

# VSN-029 -- Cursor CLI read

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `VSN-029`.

---

## 1. OVERVIEW

This scenario validates that Cursor's `/vision` command runs the built CLI, answers from its output, and honors the documented exit-code contract.

### Why This Matters

Cursor is the one host where nothing can force the call. It delivers no prompt-time hook event, confirmed by live probe, so the model has to choose to run the CLI and the rule that tells it to is best-effort by construction. That makes two things worth checking directly: the CLI itself works, and the command actually reaches it. A silent regression here looks like a model that simply decided not to bother.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `VSN-029` and confirm the expected signals without contradictory evidence.

- Objective: the built CLI reads a real image, returns the documented exit codes, and Cursor's `/vision` command reaches it
- Real user request: `/vision ./scratch/error.png what is the error?`
- Prompt: `/vision <FIXTURE> what is the error?`
- Expected execution process: verify the artifact, exercise all three exit codes directly, then run the command in a live Cursor session
- Expected signals: a real image returns a `<SK-VISION EVIDENCE>` block and exit 0; a missing path exits 1 with one `SK_VISION_ERROR` line; `--from-text` with no image exits 2; the live reply quotes text from the image
- Desired user-visible outcome: Cursor answers correctly about an image it cannot natively see
- Pass/fail: PASS if all three exit codes hold and the live command answers from the block. FAIL if the artifact is missing, an exit code is wrong, diagnostics appear on stdout, or the model answers without running the CLI

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| VSN-029 | Cursor CLI read | Verify the artifact, the three exit codes, and live command reach | `/vision <FIXTURE> what is the error?` | 1. bash: `test -f .opencode/skills/sk-vision/vision-runtime/dist/vision-cli.js` -> 2. bash: `node .opencode/skills/sk-vision/vision-runtime/dist/vision-cli.js <FIXTURE>; echo "exit=$?"` -> 3. bash: `node .opencode/skills/sk-vision/vision-runtime/dist/vision-cli.js ./definitely-missing.png; echo "exit=$?"` -> 4. bash: `node .opencode/skills/sk-vision/vision-runtime/dist/vision-cli.js --from-text "no image here at all"; echo "exit=$?"` -> 5. Cursor: run `/vision <FIXTURE> what is the error?` | Step 1 exits 0. Step 2 prints a `<SK-VISION EVIDENCE>` block and `exit=0`. Step 3 prints one `SK_VISION_ERROR` line on stderr and `exit=1`. Step 4 prints `exit=2`. Step 5 quotes text actually in the image | The three exit lines, the evidence block, and the live Cursor reply | PASS if all three exit codes hold and the live command answers from the block. FAIL if the artifact is missing, an exit code is wrong, diagnostics appear on stdout, or the model answers without running the CLI | 1. Run `bun run scripts/build.ts` in `vision-runtime/` -> 2. Confirm the fixture path resolves from the Cursor workspace root -> 3. Confirm `.cursor/commands/vision.md` names `Bash` in allowed-tools -> 4. Confirm `.cursor/rules/sk-vision.md` resolves to the skill source -> 5. On a cold model, expect the first run to download weights and take minutes |

---

## 3. TEST EXECUTION

### Prompt

`/vision <FIXTURE> what is the error?`

### Commands

1. `bash`: assert `vision-runtime/dist/vision-cli.js` exists
2. `bash`: run the CLI against `<FIXTURE>` and print the exit code
3. `bash`: run it against a path that does not exist and print the exit code
4. `bash`: run `--from-text` with prose naming no image and print the exit code
5. `Cursor`: run the `/vision` command against `<FIXTURE>` in a live session

### Expected

Step 1 exits 0. Step 2 prints a `<SK-VISION EVIDENCE>` block on stdout with `exit=0`. Step 3 prints exactly one `SK_VISION_ERROR` line on stderr with `exit=1`. Step 4 prints `exit=2`. Step 5 quotes text that is actually in the image.

### Evidence

The artifact check, the three exit lines with their streams, the evidence block, and the live Cursor reply.

### Pass / Fail

PASS if all three exit codes hold and the live command answers from the block. FAIL if the artifact is missing, an exit code is wrong, diagnostics land on stdout instead of stderr, or the model answers without running the CLI.

### Failure Triage

1. Run `bun run scripts/build.ts` in `vision-runtime/`, since `dist/` is gitignored
2. Confirm the fixture path resolves from the Cursor workspace root
3. Confirm `.cursor/commands/vision.md` names `Bash` in its allowed-tools
4. Confirm `.cursor/rules/sk-vision.md` still resolves to the skill source
5. On a cold model expect the first run to download roughly 3.9 GB and take minutes

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../feature-catalog/host-adapters/vision-cli.md` | Feature-catalog source describing the implementation contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `vision-runtime/src/cli/vision-cli.ts` | The CLI under test |
| `vision-runtime/src/evidence/prompt-evidence.ts` | Shared detection and analysis core |
| `.cursor/commands/vision.md` | Cursor command that invokes the CLI |
| `.opencode/skills/sk-vision/hooks/cursor/vision-rule.md` | Always-apply rule, symlinked into `.cursor/rules/` |
| `vision-runtime/src/evidence/prompt-evidence.test.ts` | Detection and wrapper assertions |

---

## 5. SOURCE METADATA

- Group: Host adapters
- Playbook ID: VSN-029
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `host-adapters/vision-cli.md`
