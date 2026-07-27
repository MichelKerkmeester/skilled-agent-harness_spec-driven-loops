---
title: "PI-002 -- Headless exit-code and event semantics"
description: "This scenario validates that Pi headless success and auth or dispatch failure are classified from stdout, stderr, and JSON events rather than from an exit code alone for `PI-002`."
version: 1.0.0.0
---

# PI-002 -- Headless exit-code and event semantics

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `PI-002`.

---

## 1. OVERVIEW

This scenario covers print mode, JSON event mode, and RPC framing while guarding against a false success caused by Pi's inconsistent unauthenticated exit codes.

### Why This Matters

The local Pi contract record captured identical unauthenticated dispatches returning `0` on one run and `1` on later runs. The reliable signal is the output content, such as `No API key found for the selected model`, not a numeric exit code.

---

## 2. SCENARIO CONTRACT

- Objective: Prove that a headless dispatcher inspects output or JSON event content for both success and auth/dispatch failure.
- Real user request: `Check Pi's print, JSON, and RPC behavior, and make sure a missing provider key is not reported as a successful model response just because the process exits zero.`
- Prompt: `Run a bounded Pi headless probe in print and JSON modes. Capture stdout, stderr, JSONL events, and exit codes. Classify provider failure from the emitted content, never from the exit code alone.`
- Expected execution process: Run the print probe -> capture output and exit code -> run the JSON probe -> parse one event per line -> inspect the RPC contract without treating it as one-shot print mode.
- Expected signals: Failure output contains `No API key found for the selected model`; identical failure attempts may have different exit codes; successful classification requires a response or success event, not only exit `0`.
- Desired user-visible outcome: A reliable PASS/FAIL/SKIP classification that cannot mistake an auth failure for a model result.
- Pass/fail: PASS if the classifier uses output/event content and records exit code only as supporting evidence. SKIP the successful-provider branch with blocker `provider credentials are absent on this machine`. FAIL if exit code alone controls the verdict or if auth text is ignored.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Confirm `command -v pi` and isolate `PI_CODING_AGENT_DIR`.
2. Run a print-mode failure probe and save stdout/stderr.
3. Run a JSONL probe and validate each line as JSON before classifying it.
4. Record the known inconsistent exit-code evidence from the local contract record.
5. Mark the success-path turn SKIP until credentials are available.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| PI-002 | Headless exit-code and event semantics | Classify auth/dispatch outcome from content, not exit code | `Run a bounded Pi headless probe in print and JSON modes. Capture stdout, stderr, JSONL events, and exit codes. Classify provider failure from the emitted content, never from the exit code alone.` | `command -v pi` -> `PI_CODING_AGENT_DIR=<tmp> pi --offline --approve -p "list your available tools" </dev/null > /tmp/pi-002-print.txt 2>&1` -> `PI_CODING_AGENT_DIR=<tmp> pi --offline --approve --mode json -p "list your available tools" </dev/null > /tmp/pi-002-jsonl.txt 2>/tmp/pi-002-jsonl.err` -> parse each JSONL line -> inspect output text | Auth text is visible; exit codes are recorded but not authoritative; JSON lines are parsed individually | Existing contract evidence records the exact auth message `No API key found for the selected model...` and exit-code sequence `0` then `1` for equivalent failures. Successful-provider execution is blocked by absent credentials. | PASS for output-first classification. SKIP the successful model turn with blocker `provider credentials are absent on this machine`. FAIL if a zero exit is treated as success without response/event evidence. | Check stdout and stderr separately, confirm `--mode json` is not being mistaken for RPC, and preserve the failing transcript before retrying. |

### Optional Supplemental Checks

- Use a disposable provider fixture only when the operator supplies credentials through the normal environment, never in the prompt or command text.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Output-first evidence rule and headless command notation |
| `../../SKILL.md` | Print, JSON, RPC, provider preflight, and exit-code guardrails |
| `../../references/cli-reference.md` | Confirmed mode distinctions and failure text |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/cli-reference.md` | Records the observed inconsistent failure exit codes |
| `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts` | Runtime model allowlist used when a successful dispatch is later available |

---

## 5. SOURCE METADATA

- Group: CLI Invocation
- Playbook ID: PI-002
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `cli-invocation/headless-exit-code-and-event-semantics.md`
