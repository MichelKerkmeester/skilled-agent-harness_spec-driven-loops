---
title: "DOC-339 -- Doctor update G6 concurrent refusal"
description: "Manual scenario validating /doctor:update concurrent dispatch protection through .doctor-update.flock refusal."
version: 3.6.0.5
---

# DOC-339 -- Doctor update G6 concurrent refusal

## 1. OVERVIEW

This scenario validates single-instance protection for `/doctor:update`. It launches two invocations within one second and verifies the first process owns `.doctor-update.flock` while the second refuses with a helpful message that includes the holding PID and start timestamp.

The behavior protects every database in the update DAG from concurrent mutation. The pass condition depends on proving only one process touched the DBs.

---

## 2. SCENARIO CONTRACT

- Objective: Concurrent `/doctor:update` refusal through flock.
- Playbook ID: DOC-339.
- Real user request: `Launch two /doctor:update invocations concurrently. Verify the second is refused via flock.`
- Prompt: `Launch two /doctor:update invocations concurrently. Verify the second is refused via flock.`
- Preconditions: A disposable workspace can run two real command invocations and one invocation can be kept active long enough for lock contention.
- Expected execution process: Start one `/doctor:update`, launch a second within one second, capture the second refusal, and inspect state/log evidence to prove only one process mutated databases.
- Expected signals: first process acquires `.doctor-update.flock`; second process refuses with holding PID and start timestamp; only one state log writer and one mutation chain is observed.
- Desired user-visible outcome: A refusal verdict proving concurrent update attempts are blocked before DB mutation.
- Pass/fail: PASS if the second invocation is refused by the flock and only the first process touches the DBs.
- Classification: Manual scenario; valid verdicts are `PASS`, `FAIL`, `SKIP`, or `UNAUTOMATABLE`.

---

## 3. TEST EXECUTION

### Prompt

```
Launch two /doctor:update invocations concurrently. Verify the second is refused via flock.
```

### Commands

1. Create a disposable workspace with real spec-kit databases.
2. Start `/doctor:update` in terminal A and capture its PID and transcript.
3. Within one second, start `/doctor:update` in terminal B.
4. Capture terminal B refusal output and exit code.
5. While terminal A is running, verify `.opencode/skills/system-spec-kit/mcp_server/database/.doctor-update.flock` is held or represented by the command output.
6. After terminal A exits, capture `.doctor-update.last-run.json`.
7. Compare database mtimes or state log entries to confirm only terminal A performed mutation or validation work.

### Expected

The first invocation loads `doctor_update.yaml` and acquires the exclusive non-blocking flock at `.doctor-update.flock`. The second invocation refuses before probing or mutating any DB and reports the holding PID plus start timestamp. There must be no second snapshot set, no second dependency execution chain, and no competing state log write from terminal B.

### Evidence

- Terminal A transcript showing lock acquisition and PID.
- Terminal B transcript showing refusal with holding PID and start timestamp.
- Exit code from terminal B.
- State log or file mtimes proving only one process touched the DBs.
- Snapshot listing showing no duplicate concurrent snapshot set from terminal B.

### Pass / Fail

- **PASS**: terminal B refuses because the flock is held, the refusal includes holding PID and start timestamp, and only terminal A touches DBs.
- **FAIL**: both invocations proceed, refusal lacks actionable lock metadata, terminal B mutates any DB, or the state log is overwritten by the refused process.
- **SKIP**: the runtime cannot hold the first process active long enough to create contention.
- **UNAUTOMATABLE**: the environment cannot run two real `/doctor:update` invocations concurrently.

### Failure Triage

If both commands proceed, inspect `doctor_update.yaml` Phase 1 and the command's lock acquisition order. If the second refusal lacks PID or start timestamp, inspect the flock refusal message contract in `.opencode/commands/doctor/update.md` and the PID-file fallback path.

## 4. SOURCE FILES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Command entrypoint: [.opencode/commands/doctor/update.md](../../../../commands/doctor/update.md)
- Matching YAML asset: [.opencode/commands/doctor/assets/doctor_update.yaml](../../../../commands/doctor/assets/doctor_update.yaml)
- Migration manifest: [.opencode/skills/system-spec-kit/mcp_server/database/migration-manifest.json](../../../../specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/009-phase-parent-lean-trio-documentation/004-legacy-phase-parent-migration/scratch/migration-manifest.json)
- Decision context: local doctor command ADRs

---

## 5. SOURCE METADATA

- Group: Doctor commands
- Playbook ID: DOC-339
- Feature name: Doctor update G6 concurrent refusal
- Command mode: `/doctor:update`
- YAML asset: `doctor_update.yaml`
- Lock path: `.doctor-update.flock`
- Runtime policy: Real concurrent execution only.
- Destructive: Potentially; disposable workspace only.
- Feature file path: `23--doctor-commands/doctor-update-G6-concurrent.md`
