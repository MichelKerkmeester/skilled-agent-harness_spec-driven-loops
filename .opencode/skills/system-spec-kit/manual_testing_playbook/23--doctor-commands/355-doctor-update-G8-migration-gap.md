---
title: "DOC-341 -- Doctor update G8 migration gap"
description: "Manual scenario validating /doctor:update --migrate refusal when a synthetic installed version is not listed in migration-manifest.json valid_source_versions."
---

# DOC-341 -- Doctor update G8 migration gap

## 1. OVERVIEW

This scenario validates migration gap detection for `/doctor:update --migrate`. It simulates an installed version such as `2.9.0.0`, verifies the orchestrator reads `migration-manifest.json`, and confirms it refuses before snapshots or database mutation because the source version has no declared upgrade path.

The important safety property is refusal without mutation. Unknown versions must not be guessed through heuristic migration logic.

---

## 2. SCENARIO CONTRACT

- Objective: Manifest-driven refusal for undeclared migration source version.
- Playbook ID: DOC-341.
- Real user request: `Run /doctor:update --migrate from synthetic version 2.9.0.0. Verify manifest gap detection refuses cleanly.`
- Prompt: `Run /doctor:update --migrate from synthetic version 2.9.0.0. Verify manifest gap detection refuses cleanly.`
- Preconditions: A disposable workspace can override detected installed version to `2.9.0.0`; `migration-manifest.json` does not list `2.9.0.0` in `valid_source_versions`.
- Expected execution process: Set the synthetic source-version override, run `/doctor:update --migrate`, capture refusal output, and verify no SQLite DB or stateful artifact is mutated beyond a failed state log.
- Expected signals: manifest is read, `2.9.0.0` is rejected as not declared, output includes `no migration path declared from 2.9.0.0`, and no DB mutation occurs.
- Desired user-visible outcome: A clean refusal explaining that no migration path is declared from the synthetic version.
- Pass/fail: PASS if migration refuses before mutation and the DB fingerprints remain unchanged.
- Classification: Manual scenario; valid verdicts are `PASS`, `FAIL`, `SKIP`, or `UNAUTOMATABLE`.

---

## 3. TEST EXECUTION

### Prompt

```
Run /doctor:update --migrate from synthetic version 2.9.0.0. Verify manifest gap detection refuses cleanly.
```

### Commands

1. Create a disposable workspace with current DBs.
2. Record pre-run checksums or mtimes for all six SQLite DBs.
3. Set the supported test override for installed version to `2.9.0.0`, for example the runtime's documented version override environment variable.
4. Run `/doctor:update --migrate` through the real runtime.
5. Capture refusal output and exit code.
6. Recompute DB checksums or mtimes for all six SQLite DBs.
7. Inspect `.doctor-update.last-run.json` if written and confirm final status is failed before snapshot or dependency execution.

### Expected

The command loads `doctor_update.yaml`, enters migration Phase 0 before snapshots, reads `migration-manifest.json`, and compares the synthetic source version with `valid_source_versions`. Since `2.9.0.0` is absent, it refuses with a message equivalent to `no migration path declared from 2.9.0.0`. No snapshots, rebuilds, cleanup prompts, or migration steps should run.

### Evidence

- Manifest excerpt showing `valid_source_versions` excludes `2.9.0.0`.
- Synthetic version override transcript.
- `/doctor:update --migrate` refusal output.
- Pre-run and post-run DB checksums or mtimes proving no DB mutation.
- State log showing migration gap failure before snapshots, if state log is written.

### Pass / Fail

- **PASS**: the command refuses because no migration path is declared from `2.9.0.0`, exits nonzero, and DB fingerprints are unchanged.
- **FAIL**: the command guesses a migration path, mutates any DB, creates snapshots after the gap, omits the source version from the refusal, or reports success.
- **SKIP**: no supported installed-version override is available in the runtime.
- **UNAUTOMATABLE**: the real `/doctor:update --migrate` command cannot be invoked in the environment.

### Failure Triage

If the command proceeds, inspect `doctor_update.yaml` Phase 8 and `.opencode/commands/doctor/update.md` flag binding for migration ordering. If the refusal message omits the source version, inspect the manifest gap formatter. If DB fingerprints changed, treat it as a mutation-before-gap bug.

## 4. SOURCE FILES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Command entrypoint: [.opencode/commands/doctor/update.md](../../../../commands/doctor/update.md)
- Matching YAML asset: [.opencode/commands/doctor/assets/doctor_update.yaml](../../../../commands/doctor/assets/doctor_update.yaml)
- Migration manifest: [.opencode/skills/system-spec-kit/mcp_server/database/migration-manifest.json](../../mcp_server/database/migration-manifest.json)
- Decision context: local doctor command ADRs

---

## 5. SOURCE METADATA

- Group: Doctor commands
- Playbook ID: DOC-341
- Feature name: Doctor update G8 migration gap
- Command mode: `/doctor:update --migrate`
- YAML asset: `doctor_update.yaml`
- Manifest asset: `migration-manifest.json`
- Synthetic source version: `2.9.0.0`
- Runtime policy: Real manifest-gap refusal only.
- Destructive: No; must refuse before mutation.
- Feature file path: `23--doctor-commands/355-doctor-update-G8-migration-gap.md`
