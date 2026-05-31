---
title: "DV-024 -- Dispatch from cli-gemini"
description: "This scenario validates a calling AI inside a cli-gemini session can dispatch a devin task and integrate the output."
---

# DV-024 -- Dispatch from cli-gemini

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `DV-024`.

---

## 1. OVERVIEW

This scenario validates cross-AI dispatch from `cli-gemini` to `cli-devin` for `DV-024`. A Gemini CLI session dispatches `devin` via Bash and integrates the output. cli-gemini is the Google-side sibling in the family.

### Why This Matters

cli-gemini is one of the four sibling CLIs. Validating dispatch from each peer proves the cli-devin contract works under each runtime's tool stack. Gemini's strengths (Google Search grounding, large context) often complement Devin's coding-specialized loop.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm a cli-gemini session can dispatch `devin` via Bash and capture the output cleanly.
- Real user request: `From inside a Gemini session, hand off a small refactor to Devin and bring back the result.`
- Prompt: `From a cli-gemini session, dispatch devin --prompt-file /tmp/devin-from-gemini.md --model swe-1.6 --permission-mode auto and confirm Gemini captures stdout and integrates the result.`
- Expected execution process: cli-gemini session loads cli-devin SKILL.md -> composes a prompt file -> dispatches `devin` via Bash with appropriate permission (cli-gemini's `--yolo` flag or equivalent) -> captures stdout -> integrates.
- Expected signals: cli-gemini's Bash invocation runs successfully. `devin` exits 0. The output integrates cleanly.
- Desired user-visible outcome: A working cross-AI dispatch demonstrating cli-gemini → cli-devin works end-to-end.
- Pass/fail: PASS if Bash exit 0 AND `devin` exit 0 AND Gemini integrates the output. FAIL otherwise.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. From a fresh cli-gemini session, load cli-devin SKILL.md.
2. Use Gemini's Bash to create the prompt file.
3. Use Gemini's Bash to dispatch `devin`.
4. Gemini reads the captured stdout and integrates.
5. Return a PASS/FAIL verdict.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DV-024 | Dispatch from cli-gemini | Verify cli-gemini → cli-devin dispatch round trip | `From a cli-gemini session, dispatch devin --prompt-file /tmp/devin-from-gemini.md --model swe-1.6 --permission-mode auto and confirm Gemini captures stdout and integrates the result.` | 1. Launch a cli-gemini session (consider `--yolo` for write permission). -> 2. Bash: `printf 'Generate a TypeScript retry(fn, attempts, backoffMs) function with exponential backoff.\n' > /tmp/devin-from-gemini.md` -> 3. Bash: `devin --prompt-file /tmp/devin-from-gemini.md --model swe-1.6 --permission-mode auto > /tmp/dv-024-output.ts 2>&1 </dev/null; echo "Devin exit: $?"` -> 4. Bash: `cat /tmp/dv-024-output.ts` -> 5. Gemini integrates the retry function. | Step 2: file written; Step 3: devin exits 0; Step 4: retry function visible; Step 5: response references the function | Prompt file, devin stdout, cli-gemini's integrated response, terminal transcript | PASS if all steps succeed AND Gemini visibly integrates the output; FAIL if any step errors | (1) Verify cli-gemini's Bash permission allows `devin` (may need `--yolo`); (2) check `</dev/null` is appended; (3) confirm Devin is on PATH from Gemini's environment |

### Optional Supplemental Checks

- Combine with cli-gemini's Google Search grounding: have Gemini research a topic, then hand off code generation to Devin.
- Test against cli-gemini's larger-context model variants (Gemini Pro vs Flash).

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../references/integration_patterns.md` (§6 Cross-CLI Patterns — from cli-gemini) | Cross-CLI dispatch guidance |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | §3 Default Invocation (the copy-paste shape Gemini uses) |
| `../../references/integration_patterns.md` (§2 Use Case 1) | External runtime → local Devin pattern |

---

## 5. SOURCE METADATA

- Group: Cross-AI Dispatch
- Playbook ID: DV-024
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `08--cross-ai-dispatch/028-from-cli-gemini.md`
