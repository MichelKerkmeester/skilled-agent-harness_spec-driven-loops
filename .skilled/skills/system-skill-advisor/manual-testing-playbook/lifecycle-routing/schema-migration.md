---
title: "LC-004 Schema v1 to v2 Additive Backfill"
description: "Manual validation that schema migration from v1 to v2 is additive, preserves existing data and supports rollback without data loss."
trigger_phrases:
  - "lc-004"
  - "schema migration"
  - "v1 to v2 backfill"
  - "additive migration"
version: 0.8.1.0
id: LC-004
category: lifecycle_routing
stage: routing
expected_workflow_mode: system-skill-advisor
expected_leaf_resources: []
---

# LC-004 Schema v1 to v2 Additive Backfill

Prompt: Manual validation that schema migration from v1 to v2 is additive, preserves existing data and supports rollback without data loss.


---

## 1. OVERVIEW

Validate that `lib/lifecycle/schema-migration.ts` performs additive backfill from the v1 schema to v2 without dropping or mutating existing fields and that a rollback to v1 leaves original data intact.

---

## 2. SCENARIO CONTRACT

- Disposable workspace copy containing a v1 schema seed of `skill-graph.sqlite` or `graph-metadata.json` entries.
- Advisor runtime built.
- Ability to invoke migration logic on startup or via the exposed management interface.

---

## 3. TEST EXECUTION

### Commands

1. Snapshot the v1 state:

```bash
cp /tmp/path-to-copy/.opencode/skills/system-skill-advisor/runtime/database/skill-graph.sqlite /tmp/pre-v1.sqlite
```

2. Trigger migration by bringing up the daemon against the v1 workspace:

```text
node .skilled/bin/skill-advisor.cjs advisor_status --workspace-root /tmp/path-to-copy --format json
```

3. Inspect the post-migration state and verify new v2 fields are populated while v1 fields remain identical.
4. Trigger rollback (per documented rollback path) and confirm v1 state.

### Expected Signals

- All v1 fields remain present and byte-identical after migration.
- New v2 fields are populated with default or computed values.
- `schemaVersion` (or equivalent) reports v2 after migration and v1 after rollback.
- No migration errors in logs.

### Evidence

- Capture the output and exit status from the v1 snapshot copy and advisor_status commands.
- Save the v1 snapshot and post-migration and post-rollback states. Record retained v1 fields, new v2 fields, schemaVersion and migration log output.

### Pass / Fail

- **Pass**: Every expected signal holds.
- **Fail**: Any expected signal differs.

### Failure Triage

| Symptom | Detection | Action |
| --- | --- | --- |
| Data loss during migration | v1 field missing in post state | Block release. Migration must be additive. |
| Rollback leaves v2 residue | Rollback state contains v2 columns | Audit rollback path in `lib/lifecycle/rollback.ts`. |
| Migration errors surface to user | Error echoed in envelope | Confirm migration runs internally and fails open. |

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Scenario [LC-005](../../manual-testing-playbook/lifecycle-routing/rollback-lifecycle.md), lifecycle rollback.
- Scenario [AU-005](../../manual-testing-playbook/auto-update-daemon/rebuild-from-source.md), rebuild-from-source.
- Feature [`lifecycle-routing/schema-migration.md`](../../feature-catalog/lifecycle-routing/schema-migration.md).
- Source: `.skilled/skills/system-skill-advisor/runtime/lib/lifecycle/schema-migration.ts`.

---

## 5. SOURCE METADATA

- Group: Lifecycle Routing
- Playbook ID: LC-004
- Canonical root source: manual-testing-playbook.md
- Feature file path: lifecycle-routing/schema-migration.md
