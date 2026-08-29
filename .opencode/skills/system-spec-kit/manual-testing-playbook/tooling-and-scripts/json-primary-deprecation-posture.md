---
title: "154 -- JSON-primary deprecation posture"
description: "This scenario validates the JSON-primary deprecation posture: routine saves prefer --json/--stdin, direct positional JSON file input remains supported on the same structured path, and operator guidance reflects the JSON-first save contract."
version: 3.6.0.23
id: tooling-and-scripts-json-primary-deprecation-posture
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# 154 -- JSON-primary deprecation posture

## 1. OVERVIEW

This scenario validates the phase 017 JSON-primary deprecation posture. It confirms that structured JSON is the preferred routine-save path, while direct positional JSON file input remains supported on the same structured loader path.

---

## 2. SCENARIO CONTRACT

- Objective: Verify JSON-primary preference without removing positional file input support.
- Real user request: `Please validate JSON-primary deprecation posture against the documented validation surface and tell me whether the expected signals are present: Path 1 exits 0, Path 2 exits 0, Path 3 exits 0.`
- Prompt: `Validate JSON-primary deprecation posture against the documented validation surface and report cited pass/fail evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Path 1 exits 0, Path 2 exits 0, Path 3 exits 0
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if all three paths behave as documented; FAIL if any path has unexpected behavior

---

## 3. TEST EXECUTION

### Prompt

```
Validate JSON-primary deprecation posture against the documented validation surface and report cited pass/fail evidence.
```

### Commands

1. `node .opencode/skills/system-spec-kit/scripts/dist/memory/generate-context.js --json '{"specFolder":"test","sessionSummary":"test"}' <spec-folder>` → expect exit 0
2. `printf '{"specFolder":"test","sessionSummary":"test"}' | node .opencode/skills/system-spec-kit/scripts/dist/memory/generate-context.js --stdin <spec-folder>` → expect exit 0
3. `node .opencode/skills/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data-<session-id>.json <spec-folder>` → expect exit 0

### Expected

Path 1: exit 0, Path 2: exit 0, Path 3: exit 0

### Evidence

Capture, for every step in the Commands sequence above:

- The exact command or tool call issued, its full output, and its exit status.
- The output lines that carry each expected signal listed in the Scenario Contract.
- Any deviation from the expected result, quoted verbatim from the output.
- The resolved path of every file the run reads or writes.

### Pass / Fail

- **Pass**: All three paths behave as documented.
- **Fail**: Any path has unexpected behavior.

### Failure Triage

Check generate-context.ts argument parsing, loader routing, and structured-input authority

---

## 4. SOURCE FILES
- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- Feature catalog: [tooling-and-scripts/json-primary-deprecation-posture.md](../../feature-catalog/tooling-and-scripts/json-primary-deprecation-posture.md)
- Source spec: the JSON-primary deprecation posture specification packet in this repository's spec tree
---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 154
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `tooling-and-scripts/json-primary-deprecation-posture.md`
- phase_018_change: direct positional JSON file input remains supported; scenario now validates JSON-first preference without claiming removal
- audited_post_018: true
