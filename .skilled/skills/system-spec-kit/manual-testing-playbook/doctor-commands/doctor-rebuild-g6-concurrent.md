---
title: "DOC-339 -- Doctor rebuild G6 concurrent refusal"
description: "Manual scenario validating /doctor:rebuild concurrent dispatch protection through .doctor-rebuild.flock refusal."
version: 1.6.0.5
id: doctor-commands-doctor-rebuild-g6-concurrent
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# DOC-339 -- Doctor rebuild G6 concurrent refusal

## 1. OVERVIEW

This scenario validates single-instance protection for `/doctor:rebuild`. It launches two invocations within one second and verifies the first process owns `.doctor-rebuild.flock` while the second refuses with a helpful message that includes the holding PID and start timestamp.

The behavior protects every database in the update DAG from concurrent mutation. The pass condition depends on proving only one process touched the DBs.

---

## 2. SCENARIO CONTRACT

- Objective: Concurrent `/doctor:rebuild` refusal through flock.
- Playbook ID: DOC-339.
- Real user request: `Launch two /doctor:rebuild invocations concurrently. Verify the second is refused via flock.`
- Prompt: `Launch two /doctor:rebuild invocations concurrently. Verify the second is refused via flock.`
- Preconditions: A disposable workspace can run two real command invocations and one invocation can be kept active long enough for lock contention.
- Expected execution process: Start one `/doctor:rebuild`, launch a second within one second, capture the second refusal, and inspect state/log evidence to prove only one process mutated databases.
- Expected signals: first process acquires `.doctor-rebuild.flock`; second process refuses with holding PID and start timestamp; only one state log writer and one mutation chain is observed.
- Desired user-visible outcome: A refusal verdict proving concurrent update attempts are blocked before DB mutation.
- Pass/fail: PASS if the second invocation is refused by the flock and only the first process touches the DBs.
- Classification: Manual scenario; valid verdicts are `PASS`, `FAIL`, or `SKIP`. Record `SKIP` only when a named environment prerequisite, credential, or command binary is unavailable; a scenario that cannot be run for any other reason is a `FAIL`.

---

## 3. TEST EXECUTION

### Prompt

```
Launch two /doctor:rebuild invocations concurrently. Verify the second is refused via flock.
```

### Commands

1. Create a disposable workspace with real spec-kit databases.
2. Start `/doctor:rebuild` in terminal A and capture its PID and transcript.
3. Within one second, start `/doctor:rebuild` in terminal B.
4. Capture terminal B refusal output and exit code.
5. While terminal A is running, verify `.skilled/skills/system-skill-advisor/runtime/database/.doctor-rebuild.flock` is held or represented by the command output.
6. After terminal A exits, capture `.doctor-rebuild.last-run.json`.
7. Compare database mtimes or state log entries to confirm only terminal A performed mutation or validation work.

### Expected

The first invocation loads `doctor-rebuild.yaml` and acquires the exclusive non-blocking flock at `.doctor-rebuild.flock`. The second invocation refuses before probing or mutating any DB and reports the holding PID plus start timestamp. There must be no second snapshot set, no second dependency execution chain, and no competing state log write from terminal B.

### Evidence

- Terminal A transcript showing lock acquisition and PID.
- Terminal B transcript showing refusal with holding PID and start timestamp.
- Exit code from terminal B.
- State log or file mtimes proving only one process touched the DBs.
- Snapshot listing showing no duplicate concurrent snapshot set from terminal B.

### Pass / Fail

- **Pass**: The second invocation is refused by the flock and only the first process touches the DBs.
- **Fail**: The Pass condition above is not met, or any command in the sequence errors unexpectedly.

### Failure Triage

If both commands proceed, inspect `doctor-rebuild.yaml` Phase 1 and the command's lock acquisition order. If the second refusal lacks PID or start timestamp, inspect the flock refusal message contract in `.skilled/commands/doctor/rebuild.md` and the PID-file fallback path.

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- Command entrypoint: [.skilled/commands/doctor/rebuild.md](../../../../commands/doctor/rebuild.md)
- Matching YAML asset: [.skilled/commands/doctor/assets/doctor-rebuild.yaml](../../../../commands/doctor/assets/doctor-rebuild.yaml)
- Migration manifest: [specs/system-speckit/026-graph-and-context-optimization/.../scratch/migration-manifest.json](../../../../specs/system-speckit/026-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/009-phase-parent-lean-trio-documentation/004-legacy-phase-parent-migration/scratch/migration-manifest.json)
- Decision context: local doctor command ADRs

Provenance: manual only - /doctor:rebuild

---

## 5. SOURCE METADATA

- Group: Doctor commands
- Playbook ID: DOC-339
- Feature name: Doctor rebuild G6 concurrent refusal
- Command mode: `/doctor:rebuild`
- YAML asset: `doctor-rebuild.yaml`
- Lock path: `.doctor-rebuild.flock`
- Runtime policy: Real concurrent execution only.
- Destructive: Potentially; disposable workspace only.
- Feature file path: `doctor-commands/doctor-rebuild-g6-concurrent.md`
