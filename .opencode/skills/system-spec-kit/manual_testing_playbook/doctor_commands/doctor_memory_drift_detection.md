---
title: "DOC-324 -- Doctor memory drift detection"
description: "Manual scenario validating /doctor memory drift reporting when markdown sources are edited after the memory index was populated."
version: 3.6.0.11
id: doctor-commands-doctor-memory-drift-detection
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# DOC-324 -- Doctor memory drift detection

## 1. OVERVIEW

This scenario validates the read-only drift-detection path in `/doctor memory`. It starts from a populated memory continuity-index, edits three markdown files without re-running `memory_index_scan`, then confirms the read-only diagnostic flow reports degraded freshness and recommends an incremental apply.

The command must remain diagnostic-only. The observable result is a health report that names the drifted files and recommends `/doctor memory --incremental=true`, not a silent rebuild.

---

## 2. SCENARIO CONTRACT

- Objective: Existing memory index reports drift after source markdown changes.
- Real user request: `Run memory health check. I just edited a few spec docs and want to know if the index has drift.`
- Prompt: `Run memory health check. I just edited a few spec docs and want to know if the index has drift.`
- Prompt voice: Natural-human.
- Exact command sequence: populate index -> edit three markdown files -> run `/doctor memory` -> inspect report and state log.
- Expected signals: read-only diagnostic flow, no apply mutation, status `DEGRADED` or `STALE`, three drifted paths cited, recommendation includes `/doctor memory --incremental=true`.
- Desired user-visible outcome: A concise degraded verdict with the affected file list and incremental remediation command.
- Pass/fail: PASS if all three modified files are visible in drift evidence and the command recommends incremental apply.

---

## 3. TEST EXECUTION

### Prompt

```
Run memory health check. I just edited a few spec docs and want to know if the index has drift.
```

### Commands

1. Use a disposable workspace with an existing active resolved profile database (for example, `.opencode/skills/system-spec-kit/mcp_server/database/context-index__ollama__unsloth-bge-base-en-v1.5-gguf__768__q8.sqlite` when GGUF runtime is installed, otherwise `.opencode/skills/system-spec-kit/mcp_server/database/context-index__hf-local__onnx-community_bge-base-en-v1.5-onnx__768__q8.sqlite`).
2. If the index is not populated, run `/doctor memory --incremental=true` once and wait for a successful gold-battery result.
3. Pick three markdown files under `.opencode/specs/` and append a harmless sandbox-only marker line to each file.
4. Do not run `/memory:save`, `memory_index_scan`, or `/doctor memory` after those edits.
5. Run `/doctor memory` through the real runtime.
6. Capture the diagnostic report, state log, and any `memory_drift_why` sample output.
7. Revert or discard the sandbox edits after evidence capture.

### Expected

The command resolves `intent=DIAGNOSE`, loads `.opencode/commands/doctor/assets/doctor_memory.yaml`, and stays read-only. Phase 1 classifies mtime or source/index drift for the edited markdown files. Phase 2 returns a degraded or stale status and recommends `/doctor memory --incremental=true`.

### Evidence

- BLOCKED before scenario command execution because the scenario requires writes outside the single allowed file.
- User allowed write path: `.opencode/skills/system-spec-kit/manual_testing_playbook/doctor_commands/doctor_memory_drift_detection.md (this file only)`.
- User banned operation: `Do NOT modify, create, or delete any file OTHER than the single scenario file named below.`
- Scenario Command 3 requires forbidden writes: ``Pick three markdown files under `.opencode/specs/` and append a harmless sandbox-only marker line to each file.``
- Scenario Command 7 also requires forbidden writes: `Revert or discard the sandbox edits after evidence capture.`
- No `/doctor memory` diagnostic report, state log, or `memory_drift_why` output was captured because executing the scenario exactly as written would require modifying three markdown files outside the allowed write path.

### Pass / Fail

- **BLOCKED**: The scenario cannot be executed under the current task constraints because Commands 3 and 7 require modifying files outside the only allowed write path.

### Failure Triage

Confirm the edited files are within the indexed markdown corpus and have mtimes newer than `last_index_at`. If the report is `OK`, inspect Phase 1 drift classification in `doctor_memory.yaml` and rerun with `memory_health({reportMode: "full"})`. If the command mutates the DB, treat it as an immediate contract failure because the read-only diagnostic flow is diagnostic-only.

---

## 4. SOURCE FILES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Command entrypoint: `.opencode/commands/doctor/speckit.md`
- YAML asset: `.opencode/commands/doctor/assets/doctor_memory.yaml`
- Command contract: local doctor command behavior
- Decision context: local doctor command ADRs

---

## 5. SOURCE METADATA

- Group: Doctor Commands
- Playbook ID: DOC-324
- Command under test: `/doctor memory`
- Mode: single interactive diagnostic flow
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `doctor_commands/doctor_memory_drift_detection.md`
- Runtime policy: Real execution only; source edits must be real sandbox edits.
- Destructive: No for the live workspace; sandbox edits are reverted after capture.
