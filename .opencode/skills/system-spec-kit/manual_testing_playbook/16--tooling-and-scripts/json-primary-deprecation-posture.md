---
title: "154 -- JSON-primary deprecation posture"
description: "This scenario validates the JSON-primary deprecation posture: routine saves prefer --json/--stdin, direct positional JSON file input remains supported on the same structured path, and operator guidance reflects the JSON-first save contract."
version: 3.6.0.23
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

BLOCKED before command execution.

Observed scenario command surface:

```text
1. node .opencode/skills/system-spec-kit/scripts/dist/memory/generate-context.js --json '{"specFolder":"test","sessionSummary":"test"}' <spec-folder> -> expect exit 0
2. printf '{"specFolder":"test","sessionSummary":"test"}' | node .opencode/skills/system-spec-kit/scripts/dist/memory/generate-context.js --stdin <spec-folder> -> expect exit 0
3. node .opencode/skills/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data-<session-id>.json <spec-folder> -> expect exit 0
```

Blocking condition: command 3 requires a concrete pre-existing `/tmp/save-context-data-<session-id>.json` file, but this scenario defines no Preconditions section and provides no command that creates or identifies that file. The current task also restricts writes to this scenario file only, so creating the required `/tmp/save-context-data-<session-id>.json` fixture or allowing `generate-context.js` to write save outputs outside this file was not permitted.

### Pass / Fail

- **BLOCKED**: command 3 is missing its required concrete positional JSON input file/precondition, and the current task's allowed write path does not permit creating that fixture or running save commands that may write outside this scenario file.

### Failure Triage

Check generate-context.ts argument parsing, loader routing, and structured-input authority

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [16--tooling-and-scripts/json-primary-deprecation-posture.md](../../feature_catalog/16--tooling-and-scripts/json-primary-deprecation-posture.md)
- Source spec: [017-json-primary-deprecation/spec.md](../../../../<spec-folder>)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 154
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `16--tooling-and-scripts/json-primary-deprecation-posture.md`
- phase_018_change: direct positional JSON file input remains supported; scenario now validates JSON-first preference without claiming removal
- audited_post_018: true
