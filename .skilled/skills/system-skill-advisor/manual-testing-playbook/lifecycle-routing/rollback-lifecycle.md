---
title: "LC-005 Lifecycle-Level Rollback"
description: "Manual validation that lib/lifecycle/rollback.ts can revert lifecycle metadata changes atomically without leaving partial state."
trigger_phrases:
  - "lc-005"
  - "lifecycle rollback"
  - "atomic rollback"
  - "lifecycle revert"
version: 0.8.2.0
id: LC-005
category: lifecycle_routing
stage: routing
expected_workflow_mode: system-skill-advisor
expected_leaf_resources: []
---

# LC-005 Lifecycle-Level Rollback

Prompt: Manual validation that lib/lifecycle/rollback.ts can revert lifecycle metadata changes atomically without leaving partial state.


---

## 1. OVERVIEW

Validate that `lib/lifecycle/rollback.ts` can revert lifecycle changes (supersession, archive status, schema version) to a prior consistent state atomically without leaving partial data.

---

## 2. SCENARIO CONTRACT

- Disposable workspace copy.
- Advisor runtime built.
- Known lifecycle checkpoint or pre-change snapshot captured before the mutation under test.

---

## 3. TEST EXECUTION

### Commands

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

### Evidence

- Capture the output and exit status from each lifecycle mutation, rollback action and advisor_recommend command.
- Save the pre-mutation snapshot and post-rollback metadata, including supersession, archive status, schema version and any redirect_to or redirect_from values.
- Record the affected pair's routing response and any partial state visible to readers.

### Pass / Fail

- **Pass**: Every expected signal holds.
- **Fail**: Any expected signal differs.

### Failure Triage

| Symptom | Detection | Action |
| --- | --- | --- |
| Partial rollback | Some fields revert, others retain mutation | Block release. Rollback must be atomic. |
| Rollback leaves residue in derived | Graph-metadata derived block still reflects mutation | Audit derived-sync integration with lifecycle rollback. |
| Rollback fails silently | State does not change | Confirm rollback entry point is wired to lifecycle subsystem. |


---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Scenario [LC-004](../../manual-testing-playbook/lifecycle-routing/schema-migration.md), schema migration rollback.
- Feature [`feature-catalog/lifecycle-routing/rollback.md`](../../feature-catalog/lifecycle-routing/rollback.md).
- Source: `.skilled/skills/system-skill-advisor/runtime/lib/lifecycle/rollback.ts`.

---

## 5. SOURCE METADATA

- Group: Lifecycle Routing
- Playbook ID: LC-005
- Canonical root source: manual-testing-playbook.md
- Feature file path: lifecycle-routing/rollback-lifecycle.md
