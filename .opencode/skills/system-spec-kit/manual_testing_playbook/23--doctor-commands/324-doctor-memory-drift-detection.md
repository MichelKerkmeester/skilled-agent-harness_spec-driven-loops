---
title: "DOC-324 -- Doctor memory drift detection"
description: "Manual scenario validating /doctor memory drift reporting when markdown sources are edited after the memory index was populated."
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

- Pre-run populated-index evidence, such as `memory_stats({})` total records or a prior successful apply transcript.
- Diff or shell transcript showing the three markdown files changed after indexing.
- `/doctor memory` report citing the three modified file paths.
- State log with nonzero drift class counts and no apply phase.
- Recommendation text containing `/doctor memory --incremental=true`.

### Pass / Fail

- **PASS**: Diagnostic mode returns `DEGRADED` or `STALE`, cites all three modified files or their record IDs, and recommends `/doctor memory --incremental=true`.
- **FAIL**: The command reports `OK`, omits the edited files, mutates the index, or recommends a full rebuild when only source mtime drift is present.
- **SKIP**: The sandbox cannot produce a populated index or cannot invoke the real memory MCP tools.
- **UNAUTOMATABLE**: Not expected; the scenario is runnable with real markdown edits in a disposable workspace.

### Failure Triage

Confirm the edited files are within the indexed markdown corpus and have mtimes newer than `last_index_at`. If the report is `OK`, inspect Phase 1 drift classification in `doctor_memory.yaml` and rerun with `memory_health({reportMode: "full"})`. If the command mutates the DB, treat it as an immediate contract failure because the read-only diagnostic flow is diagnostic-only.

---

## 4. SOURCE FILES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Command entrypoint: `.opencode/commands/doctor/help.md`
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
- Feature file path: `23--doctor-commands/324-doctor-memory-drift-detection.md`
- Runtime policy: Real execution only; source edits must be real sandbox edits.
- Destructive: No for the live workspace; sandbox edits are reverted after capture.
