---
title: "Explicit-pair comparison"
description: "Compares two explicit files with no stored state — the fallback for arbitrary versions or a missing baseline."
trigger_phrases:
  - "Explicit-pair comparison"
  - "compare two files directly"
  - "compare-pair before after"
  - "stateless two-file diff"
version: 1.0.0.0
---

# Explicit-pair comparison (compare-pair)

<!-- sk-doc-template: skill_asset_feature-catalog -->

## 1. OVERVIEW

Compares two explicit files with no stored state — the fallback when no baseline exists or when comparing two arbitrary versions.

This is the stateless counterpart to the snapshot flow. A caller who already has both versions in hand — or who never captured a baseline — passes them directly and gets the same report without touching the snapshot store. It is the documented recovery path when `compare` exits `4`, and the typical caller is either a one-off comparison of two arbitrary files or an automation that manages its own file pairing. Because nothing is read from or written to `.create-diff/`, there is no state to get stale.

---

## 2. HOW IT WORKS

`compare-pair --before A --after B` extracts, diffs, and renders exactly as the snapshot flow does, but reads neither the snapshot store nor writes to it. `A` is the "before" side and `B` is the "after" side. The column labels default to the file paths but can be overridden with `--label-before` and `--label-after` so the report reads naturally (for example, "draft" versus "final").

All the shared options apply: `--report` chooses the output path, `--view unified|side-by-side` selects the layout, and `--json` emits a machine-readable summary. Because it carries no state, this is the exact command the missing-baseline path recommends, and it is also the simplest way to diff two versions that were never snapshotted.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `scripts/create_diff.py` | Script | `compare-pair --before A --after B` renders the same report as the snapshot flow without reading or writing snapshot state; `--label-before`/`--label-after` set the column labels |
| `references/worked-example.md` | Shared | End-to-end walkthrough that includes an explicit-pair run on the shipped onboarding fixtures |
| `assets/fixtures/onboarding-before.md`, `assets/fixtures/onboarding-after.md` | Shared | Shipped fixture pair used as the explicit before/after inputs |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `manual-testing-playbook/manual-testing-playbook.md` | Manual playbook | CMP-001 runs `compare-pair` on the fixtures; SNAP-002 exercises the missing-baseline fallback into `compare-pair` |

---

## 4. SOURCE METADATA

- Group: SNAPSHOT LIFECYCLE
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `snapshot-lifecycle/explicit-pair-comparison.md`

Related references:
- [baseline-snapshot-and-compare.md](baseline-snapshot-and-compare.md) — the stateful flow this command falls back from
- [snapshot-state-management.md](snapshot-state-management.md) — manages the stored baselines this command deliberately bypasses
