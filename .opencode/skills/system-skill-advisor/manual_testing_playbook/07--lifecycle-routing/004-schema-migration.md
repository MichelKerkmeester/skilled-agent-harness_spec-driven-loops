---
title: "LC-004 Schema v1 to v2 Additive Backfill"
description: "Manual validation that schema migration from v1 to v2 is additive, preserves existing data and supports rollback without data loss."
trigger_phrases:
  - "lc-004"
  - "schema migration"
  - "v1 to v2 backfill"
  - "additive migration"
---

# LC-004 Schema v1 to v2 Additive Backfill

<!-- sk-doc-template: manual_testing_playbook -->

---

## 1. OVERVIEW

Validate that `lib/lifecycle/schema-migration.ts` performs additive backfill from the v1 schema to v2 without dropping or mutating existing fields and that a rollback to v1 leaves original data intact.

---

## 2. SCENARIO CONTRACT

- Disposable workspace copy containing a v1 schema seed of `skill-graph.sqlite` or `graph-metadata.json` entries.
- MCP server built.
- Ability to invoke migration logic on startup or via the exposed management interface.

---

## 3. TEST EXECUTION

> **Structure deviation note (007-deferred-final).** This scenario uses a numbered-step plus Expected Signals plus Failure Modes shape instead of the canonical Prompt/Commands/Expected/Evidence/Pass-Fail/Failure-Triage subsections. The deviation is intentional for this skill playbook category to keep scenario semantics tightly bound to runtime output checks. See `references/decisions/deferred_decisions.md` §F34 for rationale.

1. Snapshot the v1 state:

```bash
cp /tmp/path-to-copy/.opencode/skills/system-skill-advisor/mcp_server/database/skill-graph.sqlite /tmp/pre-v1.sqlite
```

2. Trigger migration by bringing up the daemon against the v1 workspace:

```text
advisor_status({"workspaceRoot":"/tmp/path-to-copy"})
```

3. Inspect the post-migration state and verify new v2 fields are populated while v1 fields remain identical.
4. Trigger rollback (per documented rollback path) and confirm v1 state.

### Expected Signals

- All v1 fields remain present and byte-identical after migration.
- New v2 fields are populated with default or computed values.
- `schemaVersion` (or equivalent) reports v2 after migration and v1 after rollback.
- No migration errors in logs.

### Failure Modes

| Symptom | Detection | Action |
| --- | --- | --- |
| Data loss during migration | v1 field missing in post state | Block release. Migration must be additive. |
| Rollback leaves v2 residue | Rollback state contains v2 columns | Audit rollback path in `lib/lifecycle/rollback.ts`. |
| Migration errors surface to user | Error echoed in envelope | Confirm migration runs internally and fails open. |

---

## 4. SOURCE FILES

- Scenario [LC-005](./005-rollback-lifecycle.md), lifecycle rollback.
- Scenario [AU-005](../05--auto-update-daemon/005-rebuild-from-source.md), rebuild-from-source.
- Feature [`03--lifecycle-routing/04-schema-migration.md`](../../feature_catalog/03--lifecycle-routing/04-schema-migration.md).
- Source: `.opencode/skills/system-skill-advisor/mcp_server/lib/lifecycle/schema-migration.ts`.

---

## 5. SOURCE METADATA

- Group: Lifecycle Routing
- Playbook ID: LC-004
- Canonical root source: manual_testing_playbook.md
- Feature file path: 07--lifecycle-routing/004-schema-migration.md
