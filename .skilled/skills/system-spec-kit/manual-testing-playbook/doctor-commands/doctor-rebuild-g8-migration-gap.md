---
title: "DOC-341 -- Doctor rebuild G8 migration gap"
description: "Manual scenario validating /doctor:rebuild --migrate refusal when a synthetic installed version is not listed in migration-manifest.json valid_source_versions."
version: 1.6.0.5
id: doctor-commands-doctor-rebuild-g8-migration-gap
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# DOC-341 -- Doctor rebuild G8 migration gap

## 1. OVERVIEW

This scenario validates migration gap detection for `/doctor:rebuild --migrate`. It simulates an installed version such as `2.9.0.0`, verifies the orchestrator reads `migration-manifest.json`, and confirms it refuses before snapshots or database mutation because the source version has no declared upgrade path.

The important safety property is refusal without mutation. Unknown versions must not be guessed through heuristic migration logic.

---

## 2. SCENARIO CONTRACT

- Objective: Manifest-driven refusal for undeclared migration source version.
- Playbook ID: DOC-341.
- Real user request: `Run /doctor:rebuild --migrate from synthetic version 2.9.0.0. Verify manifest gap detection refuses cleanly.`
- Prompt: `Run /doctor:rebuild --migrate from synthetic version 2.9.0.0. Verify manifest gap detection refuses cleanly.`
- Preconditions: A disposable workspace can override detected installed version to `2.9.0.0`; `migration-manifest.json` does not list `2.9.0.0` in `valid_source_versions`.
- Expected execution process: Set the synthetic source-version override, run `/doctor:rebuild --migrate`, capture refusal output, and verify no SQLite DB or stateful artifact is mutated beyond a failed state log.
- Expected signals: manifest is read, `2.9.0.0` is rejected as not declared, output includes `no migration path declared from 2.9.0.0`, and no DB mutation occurs.
- Desired user-visible outcome: A clean refusal explaining that no migration path is declared from the synthetic version.
- Pass/fail: PASS if migration refuses before mutation and the DB fingerprints remain unchanged.
- Classification: Manual scenario; valid verdicts are `PASS`, `FAIL`, or `SKIP`. Record `SKIP` only when a named environment prerequisite, credential, or command binary is unavailable; a scenario that cannot be run for any other reason is a `FAIL`.

---

## 3. TEST EXECUTION

### Prompt

```
Run /doctor:rebuild --migrate from synthetic version 2.9.0.0. Verify manifest gap detection refuses cleanly.
```

### Commands

1. Create a disposable workspace with current DBs.
2. Record pre-run checksums or mtimes for all six SQLite DBs.
3. Set the supported test override for installed version to `2.9.0.0`, for example the runtime's documented version override environment variable.
4. Run `/doctor:rebuild --migrate` through the real runtime.
5. Capture refusal output and exit code.
6. Recompute DB checksums or mtimes for all six SQLite DBs.
7. Inspect `.doctor-rebuild.last-run.json` if written and confirm final status is failed before snapshot or dependency execution.

### Expected

The command loads `doctor-rebuild.yaml`, enters migration Phase 0 before snapshots, reads `migration-manifest.json`, and compares the synthetic source version with `valid_source_versions`. Since `2.9.0.0` is absent, it refuses with a message equivalent to `no migration path declared from 2.9.0.0`. No snapshots, rebuilds, cleanup prompts, or migration steps should run.

### Evidence

- Manifest excerpt showing `valid_source_versions` excludes `2.9.0.0`.
- Synthetic version override transcript.
- `/doctor:rebuild --migrate` refusal output.
- Pre-run and post-run DB checksums or mtimes proving no DB mutation.
- State log showing migration gap failure before snapshots, if state log is written.

### Pass / Fail

- **Pass**: Migration refuses before mutation and the DB fingerprints remain unchanged.
- **Fail**: The Pass condition above is not met, or any command in the sequence errors unexpectedly.

### Failure Triage

If the command proceeds, inspect `doctor-rebuild.yaml` Phase 8 and `.skilled/commands/doctor/rebuild.md` flag binding for migration ordering. If the refusal message omits the source version, inspect the manifest gap formatter. If DB fingerprints changed, treat it as a mutation-before-gap bug.

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- Command entrypoint: [.skilled/commands/doctor/rebuild.md](../../../../commands/doctor/rebuild.md)
- Matching YAML asset: [.skilled/commands/doctor/assets/doctor-rebuild.yaml](../../../../commands/doctor/assets/doctor-rebuild.yaml)
- Migration manifest: [specs/system-speckit/026-graph-and-context-optimization/.../scratch/migration-manifest.json](../../../../specs/system-speckit/026-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/009-phase-parent-lean-trio-documentation/004-legacy-phase-parent-migration/scratch/migration-manifest.json)
- Decision context: local doctor command ADRs

Provenance: manual only - /doctor:rebuild --migrate

---

## 5. SOURCE METADATA

- Group: Doctor commands
- Playbook ID: DOC-341
- Feature name: Doctor rebuild G8 migration gap
- Command mode: `/doctor:rebuild --migrate`
- YAML asset: `doctor-rebuild.yaml`
- Manifest asset: `migration-manifest.json`
- Synthetic source version: `2.9.0.0`
- Runtime policy: Real manifest-gap refusal only.
- Destructive: No; must refuse before mutation.
- Feature file path: `doctor-commands/doctor-rebuild-g8-migration-gap.md`
