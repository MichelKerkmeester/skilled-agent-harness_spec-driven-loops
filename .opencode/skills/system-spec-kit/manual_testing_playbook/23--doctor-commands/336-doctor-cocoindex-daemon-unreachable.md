---
title: "DOC-336 -- Doctor cocoindex daemon unreachable"
description: "Manual scenario validating /doctor cocoindex clean refusal when the CocoIndex daemon is fully unreachable."
---

# DOC-336 -- Doctor cocoindex daemon unreachable

## 1. OVERVIEW

This scenario validates `/doctor cocoindex` when the CocoIndex daemon is fully unreachable: no daemon process is running, the socket or pid state is missing or stale, and `ccc_status({})` cannot prove readiness.

The command must refuse cleanly before snapshot or reindex. This is distinct from DOC-335's restartable zombie scenario: here the daemon is unavailable, so mutation flow should not mutate CocoIndex stores or pretend the semantic index was rebuilt.

---

## 2. SCENARIO CONTRACT

- Objective: Clean refusal when CocoIndex daemon is unreachable.
- Playbook ID: DOC-336.
- Real user request: `Reindex cocoindex. The daemon may not be available.`
- Prompt: `Reindex cocoindex. The daemon may not be available.`
- Preconditions: CocoIndex daemon is not running in a disposable sandbox, or its socket/pid state is absent such that `ccc_status({})` and `ccc daemon status` cannot establish readiness.
- Expected execution process: Capture absent daemon state, run `/doctor cocoindex`, verify refusal before snapshot or `ccc_reindex`, and confirm the index files are untouched.
- Expected signals: daemon health probe reports unreachable or unhealthy daemon; final status is `FAIL`, `DEGRADED`, or equivalent refusal; output recommends daemon restart or `/doctor:mcp install`; no `ccc_reindex({full: true})` call occurs.
- Desired user-visible outcome: A helpful refusal explaining that the daemon is unreachable and naming the recovery path.
- Pass/fail: PASS if mutation flow refuses before mutation and leaves the index untouched.
- Classification: Manual scenario; valid verdicts are `PASS`, `FAIL`, `SKIP`, or `UNAUTOMATABLE`.

---

## 3. TEST EXECUTION

### Prompt

```
Reindex cocoindex. The daemon may not be available.
```

### Commands

1. Use a disposable sandbox or machine state where stopping the CocoIndex daemon is safe.
2. Stop the daemon or confirm it is not running.
3. Capture pre-run process count:
   - `pgrep -fc 'ccc run-daemon' || true`
4. Capture pre-run `ccc_status({})` and `.opencode/skills/mcp-coco-index/mcp_server/.venv/bin/ccc daemon status`.
5. Record mtimes and sizes for files under `.opencode/skills/mcp-coco-index/mcp_server/database/`.
6. Run `/doctor cocoindex` through the real runtime.
7. Capture the YAML asset load for `.opencode/commands/doctor/assets/doctor_cocoindex.yaml` and the refusal output.
8. Capture process count, `ccc_status({})`, database file mtimes and sizes again.
9. Confirm no `ccc_reindex({full: true})` call, snapshot, or rollback occurred.

### Expected

The command detects daemon-unreachable state during the Phase 1 health probe and refuses before snapshot, restart, or reindex. The diagnostic should state that the daemon is unavailable or unhealthy and recommend a concrete recovery path such as restarting the daemon or running `/doctor:mcp install` when installation is suspect.

The CocoIndex database directory remains untouched: no index mtime or size changes caused by the refused apply run, and no state claims `APPLIED`.

### Evidence

- Pre-run process count showing no reachable daemon.
- Pre-run `ccc_status({})` and daemon status output.
- Pre-run database file mtimes and sizes.
- `/doctor cocoindex` refusal transcript.
- Refusal message recommending daemon restart or `/doctor:mcp install`.
- Post-run database file mtimes and sizes proving the index was untouched.
- Transcript evidence that `ccc_reindex({full: true})` did not run.
- Exit status or final report showing nonzero failure/refusal status.

### Pass / Fail

- **PASS**: unreachable daemon is detected, mutation flow refuses with a helpful diagnostic, the index is untouched, and no reindex call occurs.
- **FAIL**: command snapshots or reindexes despite an unreachable daemon, reports `APPLIED`, mutates index files, or emits an unclear refusal without recovery guidance.
- **SKIP**: stopping the daemon would affect active user work and no disposable sandbox is available.
- **UNAUTOMATABLE**: the runtime cannot expose daemon status or file mtimes, making mutation/no-mutation evidence impossible to collect.

### Failure Triage

If mutation flow proceeds, inspect `.opencode/commands/doctor/assets/doctor_cocoindex.yaml` Phase 1 daemon health probe and `daemon_coordination.unhealthy_signals`. If the refusal is correct but not helpful, compare the output against `.opencode/commands/doctor/speckit.md` output contract and add the missing recovery recommendation in the command implementation, not in this playbook file.

## 4. SOURCE FILES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Command entrypoint: [.opencode/commands/doctor/speckit.md](../../../../commands/doctor/speckit.md)
- Matching YAML asset: [.opencode/commands/doctor/assets/doctor_cocoindex.yaml](../../../../commands/doctor/assets/doctor_cocoindex.yaml)
- Diagnostic YAML asset: [.opencode/commands/doctor/assets/doctor_cocoindex.yaml](../../../../commands/doctor/assets/doctor_cocoindex.yaml)
- Design context: local doctor command contract
- Decision context: local doctor command ADRs

---

## 5. SOURCE METADATA

- Group: Doctor commands
- Playbook ID: DOC-336
- Feature name: Doctor cocoindex daemon unreachable
- Command mode: `/doctor cocoindex`
- YAML asset: `doctor_cocoindex.yaml`
- Expected status: refusal before snapshot or reindex.
- Recovery guidance: daemon restart or `/doctor:mcp install`.
- Feature file path: `23--doctor-commands/336-doctor-cocoindex-daemon-unreachable.md`
