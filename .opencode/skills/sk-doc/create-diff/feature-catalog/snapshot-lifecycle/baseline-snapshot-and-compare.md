---
title: "Baseline snapshot and compare"
description: "Captures a baseline copy before an edit, then compares the edited file against it — the capture-before-edit invariant."
trigger_phrases:
  - "Baseline snapshot and compare"
  - "capture baseline before editing"
  - "snapshot then compare"
  - "compare against latest baseline"
version: 1.0.0.0
---

# Baseline snapshot and compare (snapshot / compare)

<!-- sk-doc-template: skill_asset_feature-catalog -->

## 1. OVERVIEW

Captures a baseline copy of a document before an edit, then compares the edited file against that baseline — the capture-before-edit invariant.

This is the primary lifecycle for reviewing an edit whose "before" state would otherwise be lost. A caller runs `snapshot` on a file first, lets an edit happen, then runs `compare` to see what changed against the stored baseline. The store is local and content-addressed, and the source file is only ever read, so the invariant a caller relies on is that snapshotting can never mutate or lose their document. The main failure mode — running `compare` with no baseline captured — exits `4` and routes to the explicit-pair fallback rather than guessing.

---

## 2. HOW IT WORKS

`snapshot <file>` copies the source into a local snapshot store — `./.create-diff/` by default, overridable with `--state-dir`. Each source gets its own subdirectory keyed by the sha256 of its absolute path, holding a content-addressed blob plus a `manifest.json`. Writes are atomic (temp file then `os.replace`), and the source document is only read, never written, which is what upholds the capture-before-edit invariant.

`compare <file>` then diffs the current file against its latest stored baseline: the baseline is the "before" side and the current file is the "after" side. It reuses the same extraction, deterministic diff, and self-contained report path as every other comparison, so the output is identical in form to an explicit-pair run. If no baseline exists for the file, `compare` exits `4` with guidance toward `compare-pair`.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `scripts/create_diff.py` | Script | `snapshot` captures a content-addressed baseline under `.create-diff/` with atomic writes; `compare` diffs the current file against its latest baseline and exits `4` when none exists |
| `references/workflow.md` | Shared | The capture-before-edit invariant, the snapshot flow, and the snapshot storage layout |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `manual-testing-playbook/manual-testing-playbook.md` | Manual playbook | SNAP-001 (baseline capture then compare) and SAFE-003 (source file never mutated) |

---

## 4. SOURCE METADATA

- Group: SNAPSHOT LIFECYCLE
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `snapshot-lifecycle/baseline-snapshot-and-compare.md`

Related references:
- [explicit-pair-comparison.md](explicit-pair-comparison.md) — the stateless fallback when no baseline was captured
- [snapshot-state-management.md](snapshot-state-management.md) — lists and prunes the baselines this flow creates
