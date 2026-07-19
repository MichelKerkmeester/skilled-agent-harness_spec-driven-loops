---
title: "DOC-325 -- Doctor memory long-pole rebuild"
description: "Manual scenario validating the /doctor memory full rebuild path with ETA prompt, snapshots, state-log duration, and gold-battery verification."
version: 3.6.0.10
id: doctor-commands-doctor-memory-long-pole-rebuild
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# DOC-325 -- Doctor memory long-pole rebuild

## 1. OVERVIEW

This scenario validates the long-pole `/doctor memory --incremental=false` path. It proves the command warns about the 5-15 minute full rebuild, snapshots the memory databases with `VACUUM INTO`, runs a forced `memory_index_scan`, records duration, and passes the post-rebuild gold battery.

The behavior is intentionally slower than an incremental refresh. The user-observable value is operational confidence: the command makes the long runtime explicit and leaves rollback snapshots available.

---

## 2. SCENARIO CONTRACT

- Objective: Full memory continuity-index rebuild with snapshot and post-verify.
- Real user request: `Force a full rebuild of the memory index. I changed embedding provider and need fresh vectors.`
- Prompt: `Force a full rebuild of the memory index. I changed embedding provider and need fresh vectors.`
- Prompt voice: Natural-human.
- Exact command sequence: confirm populated index -> run `/doctor memory --incremental=false` -> accept ETA prompt -> verify snapshots, duration, and gold battery.
- Expected signals: 5-15 minute ETA prompt, `VACUUM INTO` snapshot files, `memory_index_scan({incremental:false, force:true})`, state-log `duration_seconds`, gold-battery exit 0, snapshot retention note.
- Desired user-visible outcome: A concise applied verdict with rebuild duration, snapshot paths, and gold-battery result.
- Pass/fail: PASS if the rebuild completes from snapshots through gold-battery verification without rollback.

---

## 3. TEST EXECUTION

### Prompt

```
Force a full rebuild of the memory index. I changed embedding provider and need fresh vectors.
```

### Commands

1. Use a disposable workspace with a populated active resolved profile database and vector DB.
2. Confirm precondition:
   - `find .opencode/skills/system-spec-kit/mcp-server/database -name 'context-index__*.sqlite' -size +0 -print -quit | grep -q .`
3. Run `/doctor memory --incremental=false` through the real runtime.
4. When the setup phase presents the long-pole ETA prompt, answer yes and keep the transcript.
5. Capture snapshot creation lines for both memory DBs.
6. Capture the Phase 3 rebuild summary, including `incremental: false` and `force: true`.
7. Capture the Phase 4 gold-battery summary and the Phase 6 state-log path.
8. Confirm at least one matching snapshot exists:
   - `ls .opencode/skills/system-spec-kit/mcp-server/database/context-index__*.sqlite.pre-doctor-memory.*.bak`

### Expected

The command emits the 5-15 minute full-rebuild warning before mutation, snapshots the live memory DBs, runs `memory_index_scan` with full rebuild parameters, records the rebuild duration in the state log, passes the gold battery, and leaves the snapshot files retained under the 30-day retention policy.

### Evidence

- Populated-index precondition command was run exactly as written:
  ```
  find .opencode/skills/system-spec-kit/mcp-server/database -name 'context-index__*.sqlite' -size +0 -print -quit | grep -q .
  ```
  Output:
  ```
  (no output)
  ```
- The real `/doctor memory --incremental=false` workflow contract in `.opencode/commands/doctor/assets/doctor-memory.yaml` is diagnostic-only, so the required full rebuild path, ETA prompt, snapshot creation, forced `memory_index_scan`, Phase 4 gold battery, and Phase 6 state-log path are not present in the current command implementation. Actual file content observed:
  ```yaml
  purpose: Read-only health check + drift detection with user review gates. No mutations. Report goes to packet-local scratch.
  intent: DIAGNOSE  # never APPLY in this YAML
  ```
  ```yaml
  memory_doctor_invariant: |
    Memory doctor is read-only by contract. It treats the canonical
    context-index.sqlite DB as the memory-owned store it diagnoses but never
    mutates. Rebuilds are owned by the /doctor:update orchestrator, which relies on
    the per-file memory_index_scan transaction model so SIGINT uses the ~5 sec settle
    window before restoring snapshots for cross-file consistency.
  ```
  ```yaml
  memory_doctor_philosophy:
    principle: "Detect drift before it breaks memory_search; this command never mutates — rebuilds run through /doctor:update"
    approach: "Read memory_health + memory_stats → classify drift signals → emit recommendations"
    mandate: "This command is read-only by contract."
  ```
  ```yaml
  user_inputs:
    execution_mode: "[EXECUTION_MODE] - INTERACTIVE (this YAML)"
    intent: "[INTENT] - DIAGNOSE (this YAML)"
    incremental: "[INCREMENTAL] - true|false (informational; no rebuild in this command)"
  ```
  ```yaml
  mutation_boundaries:
    allowed_targets:
      - "mcp-server/database/context-index.sqlite"  # canonical memory DB
      - "mcp-server/database/context-index*.sqlite.pre-doctor-memory.*.bak"  # memory snapshot files only
  ```
  ```yaml
    enforcement: "This command is READ-ONLY by contract. No mutation phases exist in this YAML. Any attempted write halts with STATUS=FAIL and ERROR='confirm-mode-mutation-violation'."
  ```
- The exact snapshot existence command from the playbook was run:
  ```
  ls .opencode/skills/system-spec-kit/mcp-server/database/context-index__*.sqlite.pre-doctor-memory.*.bak
  ```
  Output:
  ```
  zsh:1: no matches found: .opencode/skills/system-spec-kit/mcp-server/database/context-index__*.sqlite.pre-doctor-memory.*.bak
  ```
- No ETA prompt transcript, snapshot file paths, `duration_seconds`, `snapshot_paths`, gold-battery output, or 30-day retention text were observed for `/doctor memory --incremental=false` because the current repo's real `/doctor memory` workflow is read-only and delegates rebuilds to `/doctor:update`.

### Pass / Fail

- **BLOCKED**: The populated-index precondition passed, but the current repo's real `/doctor memory --incremental=false` workflow is read-only (`intent: DIAGNOSE`, `never APPLY`, `No mutation phases exist`) and therefore does not expose the scenario's required full-rebuild ETA prompt, snapshot creation, forced `memory_index_scan`, duration-bearing rebuild state log, gold-battery phase, or 30-day snapshot-retention output.

### Failure Triage

If no ETA prompt appears, inspect `.opencode/commands/doctor/speckit.md` setup handling for full rebuilds. If no snapshot exists, inspect Phase 2 in `doctor-memory.yaml`. If gold battery fails, compare baseline and post counts from the state log and confirm rollback behavior did not trigger.

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- Command entrypoint: `.opencode/commands/doctor/speckit.md`
- YAML asset: `.opencode/commands/doctor/assets/doctor-memory.yaml`
- Command contract: local doctor command behavior
- Decision context: local doctor command ADRs

---

## 5. SOURCE METADATA

- Group: Doctor Commands
- Playbook ID: DOC-325
- Command under test: `/doctor memory --incremental=false`
- Mode: single interactive mutation flow
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `doctor-commands/doctor-memory-long-pole-rebuild.md`
- Runtime policy: Real execution only; no mocked rebuild or fake snapshot.
- Destructive: Yes, but snapshot-protected and sandbox-only.
