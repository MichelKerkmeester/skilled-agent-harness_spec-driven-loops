---
title: "LC-005 Lifecycle-Level Rollback"
description: "Manual validation that lib/lifecycle/rollback.ts can revert lifecycle metadata changes atomically without leaving partial state."
trigger_phrases:
  - "lc-005"
  - "lifecycle rollback"
  - "atomic rollback"
  - "lifecycle revert"
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

---

## 4. SOURCE FILES

- Scenario [LC-004](./004-schema-migration.md), schema migration rollback.
- Feature [`03--lifecycle-routing/05-rollback.md`](../../feature_catalog/03--lifecycle-routing/05-rollback.md).
- Source: `.opencode/skills/system-skill-advisor/mcp_server/lib/lifecycle/rollback.ts`.

---

## 5. SOURCE METADATA

- Group: Lifecycle Routing
- Playbook ID: LC-005
- Canonical root source: manual_testing_playbook.md
- Feature file path: 07--lifecycle-routing/005-rollback-lifecycle.md
