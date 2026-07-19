---
title: "DOC-347 -- Version migration no-op"
description: "Manual scenario validating /doctor:update --migrate no-op behavior when the installed version already equals migration-manifest.json current_version."
version: 3.6.0.5
id: doctor-commands-version-migration-no-op
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# DOC-347 -- Version migration no-op

## 1. OVERVIEW

This scenario validates already-current migration behavior for `/doctor:update --migrate`. When the installed version equals `migration-manifest.json` `current_version`, the migration phase must be skipped entirely and no migration scripts should execute.

The command may continue into steady-state status or rebuild behavior according to mode policy, but the migration chain itself must be a no-op.

---

## 2. SCENARIO CONTRACT

- Objective: Already-current `--migrate` no-op.
- Playbook ID: DOC-347.
- Real user request: `Run /doctor:update --migrate from v3.4.1.0. Verify it's a no-op.`
- Prompt: `Run /doctor:update --migrate from v3.4.1.0. Verify it's a no-op.`
- Preconditions: Repository and installed spec-kit version are `3.4.1.0`; manifest `current_version` is `3.4.1.0`.
- Expected execution process: Run `/doctor:update --migrate`, capture migration Phase 0, verify source equals current, and confirm no migration scripts or fallback migration operations execute.
- Expected signals: state log shows migration skipped because source equals current version; no migration script IDs execute; command proceeds only to steady-state status or rebuild behavior.
- Desired user-visible outcome: A no-op migration verdict proving current-version users are not migrated again.
- Pass/fail: PASS if migration is explicitly skipped and no migration scripts execute.
- Classification: Manual scenario; valid verdicts are `PASS`, `FAIL`, `SKIP`, or `UNAUTOMATABLE`.

---

## 3. TEST EXECUTION

### Prompt

```
Run /doctor:update --migrate from v3.4.1.0. Verify it's a no-op.
```

### Commands

1. Confirm the repository and installed spec-kit version are `3.4.1.0`.
2. Confirm `migration-manifest.json` `current_version` is `3.4.1.0`.
3. Record pre-run DB checksums or mtimes if the scenario is intended to prove migration-only no-op behavior.
4. Run `/doctor:update --migrate` through the real runtime.
5. Capture migration Phase 0 output and final command output.
6. Inspect `.doctor-update.last-run.json` for migration skip evidence.
7. Confirm no migration script IDs or fallback migration operations were executed.

### Expected

The command loads `doctor-update.yaml`, reads `migration-manifest.json`, detects that source version equals `current_version`, and skips migration Phase 0 execution. The state log records migration skipped or no-op for `3.4.1.0`. No migration scripts, deferred migration fallback operations, or legacy cleanup actions run. The command may continue with steady-state dashboard/status behavior according to single interactive mode.

### Evidence

- Precondition check command:

```bash
node -e "const fs=require('fs'); const skill='.opencode/skills/system-spec-kit/SKILL.md'; const manifest='.opencode/specs/system-speckit/026-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/009-phase-parent-lean-trio-documentation/004-legacy-phase-parent-migration/scratch/migration-manifest.json'; const skillText=fs.readFileSync(skill,'utf8'); const version=(skillText.match(/^version:\\s*(.+)$/m)||[])[1]||'<missing>'; const data=JSON.parse(fs.readFileSync(manifest,'utf8')); console.log('system-spec-kit SKILL.md version: '+version); console.log('manifest path: '+manifest); console.log('manifest current_version: '+(Object.prototype.hasOwnProperty.call(data,'current_version')?data.current_version:'<missing>')); console.log('manifest top-level keys: '+Object.keys(data).join(', '));"
```

- Precondition check output:

```text
system-spec-kit SKILL.md version: 3.7.0.0
manifest path: .opencode/specs/system-speckit/026-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/009-phase-parent-lean-trio-documentation/004-legacy-phase-parent-migration/scratch/migration-manifest.json
manifest current_version: <missing>
manifest top-level keys: schema_version, migration, completed_at, executor, workers, totals
```

- `/doctor:update --migrate` was not invoked because the scenario preconditions were not established in the current repo state.
- Missing precondition: repository and installed spec-kit version are not `3.4.1.0`; `.opencode/skills/system-spec-kit/SKILL.md` reports `version: 3.7.0.0`.
- Missing precondition: referenced `migration-manifest.json` does not contain `current_version: 3.4.1.0`; it has no `current_version` key.

### Pass / Fail

- **BLOCKED**: the workspace cannot establish the required installed version `3.4.1.0`, and the referenced manifest lacks the required `current_version: 3.4.1.0`; running `/doctor:update --migrate` would not test the specified already-current no-op scenario.

### Failure Triage

If migration scripts run, inspect `migration-manifest.json` no-op `upgrade_paths` entry and `doctor-update.yaml` Phase 8 source/current comparison. If the command reports a gap, verify `3.4.1.0` remains listed in `valid_source_versions`. If cleanup prompts appear, inspect `cleanup_legacy` flag binding.

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- Command entrypoint: [.opencode/commands/doctor/update.md](../../../../commands/doctor/update.md)
- Matching YAML asset: [.opencode/commands/doctor/assets/doctor-update.yaml](../../../../commands/doctor/assets/doctor-update.yaml)
- Migration manifest: [.opencode/skills/system-spec-kit/mcp-server/database/migration-manifest.json](../../../../specs/system-speckit/026-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/009-phase-parent-lean-trio-documentation/004-legacy-phase-parent-migration/scratch/migration-manifest.json)
- Decision context: local doctor command ADRs

---

## 5. SOURCE METADATA

- Group: Doctor commands
- Playbook ID: DOC-347
- Feature name: Version migration no-op
- Command mode: `/doctor:update --migrate`
- YAML asset: `doctor-update.yaml`
- Manifest asset: `migration-manifest.json`
- Source version: `3.4.1.0`
- Current version: `3.4.1.0`
- Runtime policy: Real manifest no-op only.
- Destructive: No for migration phase; default update behavior may still probe or rebuild in a disposable workspace.
- Feature file path: `doctor-commands/version-migration-no-op.md`
