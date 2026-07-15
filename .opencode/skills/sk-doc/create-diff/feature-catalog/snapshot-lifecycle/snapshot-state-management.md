---
title: "Snapshot state management"
description: "Lists and prunes stored baselines so the local snapshot store stays bounded and safe to delete."
trigger_phrases:
  - "Snapshot state management"
  - "list stored baselines"
  - "cleanup old snapshots"
  - "status and cleanup"
version: 1.0.0.0
---

# Snapshot state management (status / cleanup)

<!-- sk-doc-template: skill_asset_feature-catalog -->

## 1. OVERVIEW

Lists and prunes stored baselines so local snapshot state stays bounded.

This is the housekeeping half of the snapshot lifecycle. A caller uses `status` to see which baselines exist and `cleanup` to remove ones they no longer need, keeping the local `.create-diff/` store from growing without limit. The store is plain files and is always safe to delete wholesale, so the main risk this feature guards against is not data loss but accidental over-deletion — handled by the `--dry-run` preview before anything is actually removed.

---

## 2. HOW IT WORKS

`status [<file>]` lists stored baselines: with no argument it reports every snapshot in the store, and with a file it scopes to that source. `--json` emits the same listing in machine-readable form, and `--state-dir` points at a non-default store.

`cleanup` prunes baselines by age or wholesale: `--older-than DAYS` keeps recent snapshots and removes older ones, `--file F` scopes the prune to a single source, and running it without an age filter clears the matching snapshots entirely. `--dry-run` prints exactly what would be removed without deleting anything, so a caller can preview a prune first. Because the whole store under `.create-diff/` is disposable, deleting it by hand is an equally valid reset.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `scripts/create_diff.py` | Script | `status` lists snapshots (all or per-file); `cleanup` prunes by `--older-than DAYS` or wholesale with a `--dry-run` preview; state lives under `.create-diff/` and is safe to delete |
| `references/workflow.md` | Shared | The snapshot storage layout and the cleanup lifecycle |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `manual-testing-playbook/manual-testing-playbook.md` | Manual playbook | SNAP-003 verifies listing, the `--dry-run` preview, and actual pruning |

---

## 4. SOURCE METADATA

- Group: SNAPSHOT LIFECYCLE
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `snapshot-lifecycle/snapshot-state-management.md`

Related references:
- [baseline-snapshot-and-compare.md](baseline-snapshot-and-compare.md) — creates the baselines this feature lists and prunes
- [explicit-pair-comparison.md](explicit-pair-comparison.md) — the stateless flow that writes no snapshot state to manage
