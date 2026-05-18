---
title: "DOC-335 -- Doctor cocoindex daemon zombie"
description: "Manual scenario validating /doctor cocoindex behavior for an unresponsive CocoIndex daemon and the 3.4.1.0 idempotent restart contract."
---

# DOC-335 -- Doctor cocoindex daemon zombie

## 1. OVERVIEW

This scenario validates the daemon-resilience branch for `/doctor cocoindex` when a CocoIndex daemon process exists but is unresponsive, CPU-bound, or otherwise zombie-like.

The intended regression target is the 3.4.1.0 idempotent restart fix: restarting the daemon must not create duplicate long-lived daemon processes, and the final reindex must run only after the daemon is responsive. If the sandbox cannot truthfully reproduce a zombie daemon state, the scenario must be marked `UNAUTOMATABLE` with the concrete blocker.

---

## 2. SCENARIO CONTRACT

- Objective: Validate idempotent daemon restart behavior for zombie daemon state.
- Playbook ID: DOC-335.
- Real user request: `Reindex cocoindex. The daemon has been spinning at 90% CPU since this morning.`
- Prompt: `Reindex cocoindex. The daemon has been spinning at 90% CPU since this morning.`
- Preconditions: A disposable sandbox can simulate a zombie CocoIndex daemon: a `ccc run-daemon` process exists, but `ccc_status({})` or `ccc daemon status` reports unresponsive behavior, stale pid/socket/lock state, or CPU spin.
- Expected execution process: Capture pre-run daemon process count and CPU, run `/doctor cocoindex`, verify idempotent restart behavior, then confirm reindex and gold-battery success when restart recovers the daemon.
- Expected signals: zombie state detected through status/process/log evidence; daemon restart is idempotent; process count remains one after recovery; CPU drops below 5 percent; `ccc_reindex({full: true})` completes; gold battery passes.
- Desired user-visible outcome: A concise verdict proving zombie recovery did not create duplicate daemons and reindex completed after recovery.
- Pass/fail: PASS if the zombie state is reproduced, restart is idempotent, post-restart process count is one, and reindex succeeds.
- Classification: Manual scenario; valid verdicts are `PASS`, `FAIL`, `SKIP`, or `UNAUTOMATABLE`.

---

## 3. TEST EXECUTION

### Prompt

```
Reindex cocoindex. The daemon has been spinning at 90% CPU since this morning.
```

### Commands

1. In a disposable sandbox, reproduce or attach to a real zombie-like CocoIndex daemon state without touching active user data.
2. Capture pre-run process count:
   - `pgrep -fc 'ccc run-daemon' || true`
3. Capture pre-run CPU for the daemon process with `ps` or Activity Monitor evidence.
4. Capture `ccc_status({})` and `.opencode/skills/mcp-coco-index/mcp_server/.venv/bin/ccc daemon status`.
5. Capture recent `~/.cocoindex_code/daemon.log` metadata and BrokenPipeError count without modifying the log.
6. Run `/doctor cocoindex` through the real runtime.
7. Capture the YAML asset load for `.opencode/commands/doctor/assets/doctor_cocoindex.yaml`, daemon-health classification, restart command, and `ccc_reindex({full: true})` result.
8. Capture post-run process count and CPU.
9. Capture post-run `ccc_status({})`, semantic search gold-battery counts, and final state-log path.

### Expected

The command identifies zombie daemon evidence, runs the 3.4.1.0 idempotent restart path, and does not create duplicate daemon processes. After restart, exactly one daemon process remains, CPU is below 5 percent, `ccc_status({})` reports healthy, `ccc_reindex({full: true})` completes, and the semantic search gold battery passes.

If the checked-in workflow instead classifies the reproduced zombie state as unhealthy and refuses before restart, record the refusal as a failing result for this intended recovery scenario unless the product decision has changed and the source docs are updated accordingly.

### Evidence

- Reproduction notes for the zombie daemon state.
- Pre-run daemon process count and CPU evidence.
- Pre-run `ccc_status({})`, daemon status, and daemon log metadata.
- `/doctor cocoindex` transcript.
- Restart transcript showing the idempotent restart path.
- Post-run process count proving one daemon process, not duplicates.
- Post-run CPU evidence showing less than 5 percent.
- `ccc_reindex({full: true})` success output.
- Gold-battery query counts and state log.

### Pass / Fail

- **PASS**: zombie state is reproduced, restart runs idempotently, process count is one before and after recovery, CPU drops below 5 percent, reindex completes, and gold battery passes.
- **FAIL**: duplicate daemon processes are created, CPU remains high, `ccc_reindex` runs while daemon is unresponsive, or the command claims success without proving daemon recovery.
- **SKIP**: CocoIndex is not installed or the sandbox forbids daemon process inspection.
- **UNAUTOMATABLE**: use this verdict when the sandbox cannot safely reproduce a zombie daemon state; include the exact blocker and any available healthy/unreachable daemon evidence.

### Failure Triage

If the command refuses before restart, compare the observed behavior against `.opencode/commands/doctor/assets/doctor_cocoindex.yaml` daemon coordination. The current asset lists duplicate processes, unreachable daemon status, BrokenPipeError bursts, and stale pid/socket/lock state as unhealthy signals; this scenario intentionally catches whether the intended 3.4.1.0 idempotent restart recovery is implemented for a restartable zombie state or whether the command has become refuse-only.

## 4. SOURCE FILES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Command entrypoint: [.opencode/commands/doctor.md](../../../../commands/doctor.md)
- Matching YAML asset: [.opencode/commands/doctor/assets/doctor_cocoindex.yaml](../../../../commands/doctor/assets/doctor_cocoindex.yaml)
- Read-only diagnostic YAML asset: [.opencode/commands/doctor/assets/doctor_cocoindex.yaml](../../../../commands/doctor/assets/doctor_cocoindex.yaml)
- Design context: local doctor command contract
- Decision context: local doctor command ADRs

---

## 5. SOURCE METADATA

- Group: Doctor commands
- Playbook ID: DOC-335
- Feature name: Doctor cocoindex daemon zombie
- Command mode: `/doctor cocoindex`
- YAML asset: `doctor_cocoindex.yaml`
- Regression anchor: 3.4.1.0 idempotent daemon restart behavior.
- Required sandbox note: mark `UNAUTOMATABLE` if zombie state cannot be reproduced safely.
- Feature file path: `23--doctor-commands/335-doctor-cocoindex-daemon-zombie.md`
