---
title: "CO-056 -- system-speckit-completion live utilization on OpenCode 1 and 2"
description: "This scenario validates the system-speckit-completion plugin for CO-056. It focuses on the read-only completion tool that returns a spec folder's level and checklist evidence."
version: 1.0.3.0
---

# CO-056 -- system-speckit-completion live utilization on OpenCode 1 and 2

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CO-056`.

---

## 1. OVERVIEW

This scenario validates the `system-speckit-completion` plugin for `CO-056`. The plugin registers one read-only tool, `system_speckit_completion`, and that tool returns a spec folder's inferred level and checklist completion as JSON. It never blocks and never writes. The recorded run asks the model to call the tool against an existing packet, print the first lines of its raw output, and reply `DONE`.

### Why This Matters

Completion state is the closure gate for a packet. When an operator or a dispatcher asks whether a packet is done, the answer has to come from the packet's own checklist, not from a model's summary of it. A read-only tool that returns the wrong path or a missing level gives a false closure signal with no side effects to expose it. The scenario reads the tool result from the events file so the payload, not the reply, is the evidence.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CO-056` and confirm the expected signals without contradictory evidence.

- Objective: Confirm the `system_speckit_completion` tool returns JSON with the packet path and level on both OpenCode versions.
- Real user request: `Can I ask the session how complete an existing spec packet is and get its real level and checklist state back, on both OpenCode versions?`
- Prompt: `Call the system_speckit_completion tool with specFolder 'specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/031-plugin-scanner-ast'. Print the first 8 lines of the tool's raw output, then reply DONE.`
- Expected execution process: run the scenario on v1, read the tool result from the events file, then repeat on v2 and read the result reached through the Code Mode `execute` tool.
- Expected signals: the tool result is JSON holding `"specFolder"` (the absolute packet path) and `"level"`.
- Evidence requirements: the tool call and its result from each version's events file, with the JSON fields present and the packet path resolved.
- Desired user-visible outcome: a JSON payload naming the requested packet and its inferred level, on both versions.
- Pass/fail: PASS if the tool result is JSON with `"specFolder"` and `"level"`. FAIL if the tool is missing, the call errors, or either field is absent.
- Failure triage: On v2 the model reaches plugin tools through `execute`, so the event shows `execute` rather than the tool name. Read the result payload, not the tool name alone. Confirm the packet path exists in this worktree before the run.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Setup: confirm the plugin at `.opencode/plugins/system-speckit-completion.js` exists and that `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/031-plugin-scanner-ast` is present. Export `AI_SESSION_CHILD=1`.
2. v1 run: run the runner with `v1`, the name `speckit-completion`, and the prompt.
3. v1 check: read the tool call and result from the events file and confirm the JSON fields.
4. v2 run: run the runner with `v2`, the same name and prompt.
5. v2 check: read the tool call and result from the events file, allowing `execute` as the tool name, and confirm the JSON fields.
6. Cleanup: none.

### Exact Command Sequence

```bash
export EVIDENCE_DIR="${EVIDENCE_DIR:-$(git rev-parse --show-toplevel)/.skilled/skills/.state/plugin-utilization}"
export AI_SESSION_CHILD=1

bash .opencode/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/run-plugin-scenario.sh v1 speckit-completion "Call the system_speckit_completion tool with specFolder 'specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/031-plugin-scanner-ast'. Print the first 8 lines of the tool's raw output, then reply DONE."

jq -c 'select(.type=="tool_use") | [.part.tool, .part.state.status, (.part.state.error // .part.state.output)]' "$EVIDENCE_DIR/speckit-completion.v1.events.jsonl"
jq -r 'select(.type=="tool_use") | .part.state.output' "$EVIDENCE_DIR/speckit-completion.v1.events.jsonl" | grep -E '"specFolder"|"level"'

bash .opencode/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/run-plugin-scenario.sh v2 speckit-completion "Call the system_speckit_completion tool with specFolder 'specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/031-plugin-scanner-ast'. Print the first 8 lines of the tool's raw output, then reply DONE."

jq -c 'select(.type=="tool_use") | [.part.tool, .part.state.status, (.part.state.error // .part.state.output)]' "$EVIDENCE_DIR/speckit-completion.v2.events.jsonl"
jq -r 'select(.type=="tool_use") | .part.state.output' "$EVIDENCE_DIR/speckit-completion.v2.events.jsonl" | grep -E '"specFolder"|"level"'
```

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CO-056 | system-speckit-completion | Confirm the read-only completion tool returns the packet path and level on both versions | `Call the system_speckit_completion tool with specFolder 'specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/031-plugin-scanner-ast'. Print the first 8 lines of the tool's raw output, then reply DONE.` | Runner on v1 and v2, then the `jq` tool-call read and a `grep` for `"specFolder"` and `"level"` on each events file | Tool result is JSON holding `"specFolder"` (the absolute packet path) and `"level"` | `speckit-completion.v1.events.jsonl`, `speckit-completion.v2.events.jsonl` | PASS only when both JSON fields are present on both versions | On v2 the call arrives through `execute`; read the result payload, and confirm the packet path exists first |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `plugin-utilization/run-plugin-scenario.sh` | Runs the scenario on v1 or v2 and writes the evidence files |
| `plugin-utilization/capture-proxy.mjs` | Capture proxy that records each model request's system prompt and tools |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/plugins/system-speckit-completion.js` | The plugin under test: the read-only `system_speckit_completion` tool |

---

## 5. SOURCE METADATA

- Group: Plugin Utilization
- Playbook ID: CO-056
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `plugin-utilization/system-speckit-completion.md`
