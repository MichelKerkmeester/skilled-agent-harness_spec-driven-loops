---
title: "LC-005 Lifecycle-Level Rollback"
description: "Manual validation that lib/lifecycle/rollback.ts can revert lifecycle metadata changes atomically without leaving partial state."
trigger_phrases:
  - "lc-005"
  - "lifecycle rollback"
  - "atomic rollback"
  - "lifecycle revert"
version: 0.8.0.15
---

# LC-005 Lifecycle-Level Rollback

<!-- sk-doc-template: manual_testing_playbook -->

---

## 1. OVERVIEW

Validate that `lib/lifecycle/rollback.ts` can revert lifecycle changes (supersession, archive status, schema version) to a prior consistent state atomically without leaving partial data.

---

## 2. SCENARIO CONTRACT

- Disposable workspace copy.
- MCP server built.
- Known lifecycle checkpoint or pre-change snapshot captured before the mutation under test.

---

## 3. TEST EXECUTION

> **Structure deviation note (007-deferred-final).** This scenario uses a numbered-step plus Expected Signals plus Failure Modes shape instead of the canonical Prompt/Commands/Expected/Evidence/Pass-Fail/Failure-Triage subsections. The deviation is intentional for this skill playbook category to keep scenario semantics tightly bound to runtime output checks. See `references/decisions/deferred_decisions.md` §F34 for rationale.

1. Capture a pre-mutation snapshot of lifecycle metadata.
2. Apply a lifecycle mutation (example: mark a skill as superseded by another in graph-metadata or via admin path).
3. Trigger rollback through the documented lifecycle rollback entry point.
4. Compare post-rollback lifecycle state against the pre-mutation snapshot.
5. Call `advisor_recommend` with a prompt that exercises the affected pair and verify pre-mutation routing behavior returns.

### Expected Signals

- Post-rollback lifecycle metadata matches the pre-mutation snapshot.
- Routing behavior reverts to pre-mutation expectations (superseded pair no longer applies).
- No residual `redirect_to` or `redirect_from` metadata from the rolled-back mutation.
- No partial state (for example, half-applied supersession) observable in any reader.

### Failure Modes

| Symptom | Detection | Action |
| --- | --- | --- |
| Partial rollback | Some fields revert, others retain mutation | Block release. Rollback must be atomic. |
| Rollback leaves residue in derived | Graph-metadata derived block still reflects mutation | Audit derived-sync integration with lifecycle rollback. |
| Rollback fails silently | State does not change | Confirm rollback entry point is wired to lifecycle subsystem. |

### Evidence

- Read scenario file in full: `.opencode/skills/system-skill-advisor/manual_testing_playbook/lifecycle_routing/rollback_lifecycle.md` lines 1-72.
- MCP/file glob check for built server output:
  ```text
  No files found
  ```
- Package entry point and build scripts observed in `.opencode/skills/system-skill-advisor/mcp_server/package.json`:
  ```json
  {
    "name": "@spec-kit/system-skill-advisor",
    "private": true,
    "type": "module",
    "main": "./dist/mcp_server/advisor-server.js",
    "scripts": {
      "clean": "rm -rf dist",
      "build": "npm --prefix ../../system-spec-kit/shared run build && ../../system-spec-kit/node_modules/.bin/tsc -p tsconfig.build.json",
      "postbuild": "mkdir -p dist/mcp_server/data && cp data/*.json dist/mcp_server/data/",
      "typecheck": "../../system-spec-kit/node_modules/.bin/tsc --noEmit --composite false -p tsconfig.build.json",
      "test": "vitest run"
    },
  ```
- Referenced rollback source observed in `.opencode/skills/system-skill-advisor/mcp_server/lib/lifecycle/rollback.ts`:
  ```ts
  export function rollbackGraphMetadataFile(graphMetadataPath: string): RollbackResult {
    const parsed: unknown = JSON.parse(readFileSync(graphMetadataPath, 'utf8'));
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      throw new Error(`graph-metadata root must be an object: ${graphMetadataPath}`);
    }
    const result = rollbackDerivedBlock(parsed as Record<string, unknown>);
    writeJsonAtomic(graphMetadataPath, result.metadata);
    return result;
  }
  ```
- Scenario preconditions not satisfied or not executable under this run's constraints:
  ```text
  - Disposable workspace copy.
  - MCP server built.
  - Known lifecycle checkpoint or pre-change snapshot captured before the mutation under test.
  ```
- The scenario steps require applying a lifecycle mutation and triggering rollback against lifecycle metadata. The rollback entry point writes to the supplied graph metadata file, which would modify a file outside the allowed write path for this execution.

### Pass/Fail

BLOCKED - Missing built MCP server output (`dist/**` returned `No files found`), no known lifecycle checkpoint/pre-change snapshot was provided, and the required mutation/rollback would write outside the single allowed scenario file.

---

## 4. SOURCE FILES

- Scenario [LC-004](../lifecycle_routing/schema_migration.md), schema migration rollback.
- Feature [`lifecycle-routing/rollback.md`](../../feature_catalog/lifecycle_routing/rollback.md).
- Source: `.opencode/skills/system-skill-advisor/mcp_server/lib/lifecycle/rollback.ts`.

---

## 5. SOURCE METADATA

- Group: Lifecycle Routing
- Playbook ID: LC-005
- Canonical root source: manual_testing_playbook.md
- Feature file path: lifecycle-routing/rollback-lifecycle.md
