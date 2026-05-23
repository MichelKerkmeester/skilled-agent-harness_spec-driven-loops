---
title: "DOC-325 -- Doctor memory long-pole rebuild"
description: "Manual scenario validating the /doctor memory full rebuild path with ETA prompt, snapshots, state-log duration, and gold-battery verification."
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
   - `find .opencode/skills/system-spec-kit/mcp_server/database -name 'context-index__*.sqlite' -size +0 -print -quit | grep -q .`
3. Run `/doctor memory --incremental=false` through the real runtime.
4. When the setup phase presents the long-pole ETA prompt, answer yes and keep the transcript.
5. Capture snapshot creation lines for both memory DBs.
6. Capture the Phase 3 rebuild summary, including `incremental: false` and `force: true`.
7. Capture the Phase 4 gold-battery summary and the Phase 6 state-log path.
8. Confirm at least one matching snapshot exists:
   - `ls .opencode/skills/system-spec-kit/mcp_server/database/context-index__*.sqlite.pre-doctor-memory.*.bak`

### Expected

The command emits the 5-15 minute full-rebuild warning before mutation, snapshots the live memory DBs, runs `memory_index_scan` with full rebuild parameters, records the rebuild duration in the state log, passes the gold battery, and leaves the snapshot files retained under the 30-day retention policy.

### Evidence

- ETA prompt transcript showing the 5-15 minute warning.
- Snapshot file paths and nonzero file sizes.
- State log showing `incremental: false`, `duration_seconds`, `snapshot_paths`, and final applied status.
- Gold-battery output with exit 0 or equivalent pass indicator.
- Retention evidence: snapshot filename timestamp and report text indicating cleanup applies only after 30 days.

### Pass / Fail

- **PASS**: The command prompts before the long-pole rebuild, creates nonzero snapshots, runs the full rebuild, records duration, passes gold battery, and retains the snapshot.
- **FAIL**: No ETA prompt appears, no snapshot is created, the scan runs incrementally, duration is missing, gold battery fails, or snapshots are deleted immediately.
- **SKIP**: The sandbox lacks enough disk for snapshots or cannot invoke the real memory MCP tools.
- **UNAUTOMATABLE**: Not expected; the scenario is directly executable, though long-running.

### Failure Triage

If no ETA prompt appears, inspect `.opencode/commands/doctor/help.md` setup handling for full rebuilds. If no snapshot exists, inspect Phase 2 in `doctor_memory.yaml`. If gold battery fails, compare baseline and post counts from the state log and confirm rollback behavior did not trigger.

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
- Playbook ID: DOC-325
- Command under test: `/doctor memory --incremental=false`
- Mode: single interactive mutation flow
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `23--doctor-commands/325-doctor-memory-long-pole-rebuild.md`
- Runtime policy: Real execution only; no mocked rebuild or fake snapshot.
- Destructive: Yes, but snapshot-protected and sandbox-only.
