---
title: "DOC-334 -- Doctor cocoindex daemon healthy"
description: "Manual scenario validating /doctor cocoindex full reindex behavior when the CocoIndex daemon is healthy."
---

# DOC-334 -- Doctor cocoindex daemon healthy

## 1. OVERVIEW

This scenario validates `/doctor cocoindex` when the CocoIndex daemon is healthy and the codebase has changed since the last semantic index rebuild.

The command should pass daemon-health checks, snapshot the CocoIndex stores, restart the daemon idempotently, run `ccc_reindex({full: true})`, and prove the rebuilt semantic index with representative search queries that each return at least five results.

---

## 2. SCENARIO CONTRACT

- Objective: Reindex CocoIndex through mutation flow with a healthy daemon.
- Playbook ID: DOC-334.
- Real user request: `Reindex cocoindex. I just renamed several modules.`
- Prompt: `Reindex cocoindex. I just renamed several modules.`
- Preconditions: CocoIndex daemon is running and responsive; `ccc_status({})` reports availability; recent codebase changes are newer than the current CocoIndex store.
- Expected execution process: Capture pre-run `ccc_status`, run `/doctor cocoindex`, capture daemon restart plus `ccc_reindex({full: true})`, then run post-rebuild semantic search gold-battery queries.
- Expected signals: daemon health probe passes; snapshot paths are emitted; `ccc_reindex({full: true})` succeeds; post-run `ccc_status` is healthy; each representative semantic search returns at least five results.
- Desired user-visible outcome: A concise applied verdict citing daemon health, reindex success, and gold-battery counts.
- Pass/fail: PASS if full reindex completes and the semantic search gold battery meets the threshold.
- Classification: Manual scenario; valid verdicts are `PASS`, `FAIL`, `SKIP`, or `UNAUTOMATABLE`.

---

## 3. TEST EXECUTION

### Prompt

```
Reindex cocoindex. I just renamed several modules.
```

### Commands

1. Confirm CocoIndex CLI availability:
   - `.opencode/skills/mcp-coco-index/mcp_server/.venv/bin/ccc --help`
2. Capture pre-run `ccc_status({})`.
3. Capture daemon status:
   - `.opencode/skills/mcp-coco-index/mcp_server/.venv/bin/ccc daemon status`
   - `pgrep -fc 'ccc run-daemon' || true`
4. Confirm a harmless recent codebase change or touched test fixture makes reindex appropriate.
5. Run `/doctor cocoindex` through the real runtime.
6. Capture the YAML asset load for `.opencode/commands/doctor/assets/doctor_cocoindex.yaml`, snapshot paths, daemon restart transcript, and `ccc_reindex({full: true})` result.
7. Capture post-run `ccc_status({})`.
8. Run the three representative semantic search queries from the gold battery with `--limit 5`.
9. Capture result counts for each query and the final state-log path.

### Expected

The command resolves mutation flow, loads `doctor_cocoindex.yaml`, verifies daemon health, snapshots the CocoIndex database directory, runs the idempotent daemon restart, and calls `ccc_reindex({full: true})`.

Post-verify reports a passing gold battery. Each representative semantic query returns at least five results, and the final status is `APPLIED` without rollback.

### Evidence

- Pre-run `ccc_status({})` output.
- Pre-run daemon status and process count.
- `/doctor cocoindex` transcript.
- Snapshot paths under `.opencode/skills/mcp-coco-index/mcp_server/database/`.
- Daemon restart transcript and post-restart healthy `ccc_status({})`.
- `ccc_reindex({full: true})` success output.
- Three semantic search query counts, each `>= 5`.
- State log showing `status: APPLIED` and `gold_battery_pass: true`.

### Pass / Fail

- **PASS**: daemon starts healthy, reindex completes, post-run daemon status remains healthy, and all representative semantic queries return at least five results.
- **FAIL**: daemon health probe fails unexpectedly, `ccc_reindex` is skipped or fails twice, any gold-battery query returns fewer than five results, or rollback occurs.
- **SKIP**: CocoIndex is not installed in the sandbox or the daemon cannot be run there.
- **UNAUTOMATABLE**: only valid if the runtime cannot invoke `/doctor cocoindex` and the CocoIndex CLI cannot be exercised directly.

### Failure Triage

If the daemon health probe fails, switch to DOC-336 if the daemon is unreachable or DOC-335 if a zombie state is reproducible. If reindex succeeds but search counts are low, inspect `.opencode/commands/doctor/assets/doctor_cocoindex.yaml` gold-battery queries, embedding model metadata, and the result files passed to `ccc_feedback`.

## 4. SOURCE FILES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Command entrypoint: [.opencode/commands/doctor/help.md](../../../../commands/doctor/help.md)
- Matching YAML asset: [.opencode/commands/doctor/assets/doctor_cocoindex.yaml](../../../../commands/doctor/assets/doctor_cocoindex.yaml)
- Design context: local doctor command contract
- Decision context: local doctor command ADRs

---

## 5. SOURCE METADATA

- Group: Doctor commands
- Playbook ID: DOC-334
- Feature name: Doctor cocoindex daemon healthy
- Command mode: `/doctor cocoindex`
- YAML asset: `doctor_cocoindex.yaml`
- Daemon state: healthy and responsive.
- Gold battery: three representative semantic queries, each with at least five results.
- Feature file path: `23--doctor-commands/334-doctor-cocoindex-daemon-healthy.md`
