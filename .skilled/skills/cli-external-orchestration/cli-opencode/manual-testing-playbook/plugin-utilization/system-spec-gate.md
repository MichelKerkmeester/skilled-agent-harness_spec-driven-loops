---
title: "CO-055 -- system-spec-gate live utilization on OpenCode 1 and 2"
description: "This scenario validates the system-spec-gate plugin for CO-055. It focuses on the deferred Gate 3 instruction and the enforced refusal of a write that has no bound spec folder."
version: 1.0.2.0
---

# CO-055 -- system-spec-gate live utilization on OpenCode 1 and 2

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CO-055`.

---

## 1. OVERVIEW

This scenario validates the `system-spec-gate` plugin for `CO-055`. The transform adds a deferred Gate 3 instruction when the request is a write request. `tool.execute.before` on a mutating tool logs a warning to `.skilled/skills/.state/spec-gate/spec-gate-warnings.log` and, with `SYSTEM_SPEC_GATE_ENFORCE=1`, refuses the write by throwing. The recorded run unsets `AI_SESSION_CHILD` so the child flag cannot pre-resolve the gate, then asks the model to write a probe file.

### Why This Matters

A write with no bound spec folder loses the documentation trail for the whole change. The gate is the last point that can stop it before the file exists. If the refusal stops firing, or the deferred instruction stops reaching the prompt, the only remaining signal is a file that quietly appears outside any packet. The `bash` mutation leg is a known separate path, so the scenario also records what it does not cover rather than implying full coverage.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CO-055` and confirm the expected signals without contradictory evidence.

- Objective: Confirm the enforced gate refuses a write with no bound spec folder and that the deferral and log signals are present, on both OpenCode versions.
- Real user request: `If a request tries to write a file without a spec folder, does the gate stop it and leave a record, on both OpenCode versions?`
- Prompt: `This is a test of the spec-gate plugin. Do not ask me any questions and do not answer a documentation question yourself. Use the write tool to create the file $PROBE_DIR/gate-probe.txt containing the word hello, then report exactly what the tool returned.`
- Expected execution process: unset `AI_SESSION_CHILD`, set `SYSTEM_SPEC_GATE_ENFORCE=1`, run the scenario on v1, read the tool result, the system prompt, the warnings log, and the filesystem, then repeat on v2.
- Expected signals: the `write` call ends in error starting `system-spec-gate: DENIED: this Write/Edit needs a bound spec folder first.`; the system prompt holds `SPEC GATE: this session needs a spec-folder decision`; the warnings log gains a `would-deny` line; the file does not exist.
- Evidence requirements: the tool call status and error from the events file, the captured system prompt, the warnings log line from the effects file, and a check that `$PROBE_DIR/gate-probe.txt` is absent.
- Desired user-visible outcome: a refusal that names the missing spec folder, the deferral line in the request, a `would-deny` record, and no probe file on disk.
- Pass/fail: PASS if the write is denied, all three signals are present, and the file is absent. FAIL if the write completes, if the deferral line is missing, or if the file exists.
- Failure triage: Confirm `AI_SESSION_CHILD` is unset before the run, since the child flag pre-resolves the gate and removes the refusal path. Read the error from the event JSON, not from the model's summary.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Setup: confirm the plugin at `.opencode/plugins/system-spec-gate.js` and core at `.opencode/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs` exist. Confirm `AI_SESSION_CHILD` is not set and `$PROBE_DIR/gate-probe.txt` does not exist, using a unique `PROBE_DIR="gate-probe-$$"` so the fixture cannot collide with another run.
2. v1 run: run the runner through `env -u AI_SESSION_CHILD SYSTEM_SPEC_GATE_ENFORCE=1` with `v1` and the name `spec-gate`.
3. v1 check: read the `write` tool error, the `SPEC GATE:` line, the `would-deny` log line, and confirm the file is absent.
4. v2 run: repeat the same guarded runner with `v2`.
5. v2 check: repeat the four checks.
6. Cleanup: `rm -f "$PROBE_DIR/gate-probe.txt"; rmdir "$PROBE_DIR" 2>/dev/null || true`.

### Exact Command Sequence

```bash
export EVIDENCE_DIR="${EVIDENCE_DIR:-${TMPDIR:-/tmp}/plugin-utilization}"
PROBE_DIR="gate-probe-$$"
PROMPT="This is a test of the spec-gate plugin. Do not ask me any questions and do not answer a documentation question yourself. Use the write tool to create the file $PROBE_DIR/gate-probe.txt containing the word hello, then report exactly what the tool returned."

env -u AI_SESSION_CHILD SYSTEM_SPEC_GATE_ENFORCE=1 bash .opencode/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/run-plugin-scenario.sh v1 spec-gate "$PROMPT"

jq -c 'select(.type=="tool_use") | [.part.tool, .part.state.status, (.part.state.error // .part.state.output)]' "$EVIDENCE_DIR/spec-gate.v1.events.jsonl"
jq -r '.system[]' "$EVIDENCE_DIR/spec-gate.v1.capture.jsonl" | grep -E 'SPEC GATE:'
grep -E 'would-deny' "$EVIDENCE_DIR/spec-gate.v1.effects.txt"
test ! -e "$PROBE_DIR/gate-probe.txt"

env -u AI_SESSION_CHILD SYSTEM_SPEC_GATE_ENFORCE=1 bash .opencode/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/run-plugin-scenario.sh v2 spec-gate "$PROMPT"

jq -c 'select(.type=="tool_use") | [.part.tool, .part.state.status, (.part.state.error // .part.state.output)]' "$EVIDENCE_DIR/spec-gate.v2.events.jsonl"
jq -r '.system[]' "$EVIDENCE_DIR/spec-gate.v2.capture.jsonl" | grep -E 'SPEC GATE:'
grep -E 'would-deny' "$EVIDENCE_DIR/spec-gate.v2.effects.txt"
test ! -e "$PROBE_DIR/gate-probe.txt"

rm -f "$PROBE_DIR/gate-probe.txt"; rmdir "$PROBE_DIR" 2>/dev/null || true
```

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CO-055 | system-spec-gate | Enforce the gate on a write with no bound spec folder and confirm the deferral and log signals | `This is a test of the spec-gate plugin. Do not ask me any questions and do not answer a documentation question yourself. Use the write tool to create the file $PROBE_DIR/gate-probe.txt containing the word hello, then report exactly what the tool returned.` | Guarded runner with `env -u AI_SESSION_CHILD SYSTEM_SPEC_GATE_ENFORCE=1` on v1 and v2 under a unique `PROBE_DIR="gate-probe-$$"`, then `jq` on the events and capture, `grep` on the effects, and an absence check for `$PROBE_DIR/gate-probe.txt`, then a file-only removal and empty-directory cleanup | `write` ends in error starting `system-spec-gate: DENIED: this Write/Edit needs a bound spec folder first.`; prompt holds `SPEC GATE: this session needs a spec-folder decision`; log gains a `would-deny` line; file absent | `spec-gate.v1.events.jsonl`, `spec-gate.v1.capture.jsonl`, `spec-gate.v1.effects.txt`, and the v2 counterparts | PASS only when the write is denied and all three signals are present on both versions | Confirm `AI_SESSION_CHILD` is unset, since the child flag pre-resolves the gate; read the error from the event JSON |

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
| `.opencode/plugins/system-spec-gate.js` | The plugin under test: transform deferral and `tool.execute.before` guard |
| `.opencode/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs` | Core gate decision and warning record writer |

---

## 5. SOURCE METADATA

- Group: Plugin Utilization
- Playbook ID: CO-055
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `plugin-utilization/system-spec-gate.md`
