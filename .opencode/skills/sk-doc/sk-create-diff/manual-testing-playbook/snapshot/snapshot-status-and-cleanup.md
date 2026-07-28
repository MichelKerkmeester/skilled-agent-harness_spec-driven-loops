---
title: "SNAP-003 -- Snapshot status and cleanup"
description: "This scenario validates snapshot status and cleanup for `SNAP-003`. It focuses on listing stored baselines and pruning them safely with a dry-run preview before deletion."
stage: routing
version: 1.0.0.0
---

# SNAP-003 -- Snapshot status and cleanup

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `SNAP-003`.

---

## 1. OVERVIEW

This scenario validates snapshot status and cleanup for `SNAP-003`. It focuses on listing stored baselines and pruning them safely with a dry-run preview before deletion.

### Why This Matters

The snapshot store accumulates baselines over time, and users need to see what is stored and reclaim space without accidentally deleting a baseline they still need. The safe contract is an accurate `status` listing plus a `cleanup` that previews exactly what it will remove under `--dry-run` before any destructive run. This scenario proves the listing is truthful and that the dry-run preview deletes nothing, so cleanup is always previewable and never a surprise.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `SNAP-003` and confirm the expected signals without contradictory evidence.

- Objective: list stored baselines and prune them safely, with a dry-run preview that deletes nothing before the real cleanup
- Real user request: `List my saved baselines and clean up the old ones.`
- Prompt: `List my saved baselines and clean up the old ones.`
- Expected execution process: the operator seeds at least one snapshot, runs `status` to list stored baselines, runs `cleanup --older-than N --dry-run` to preview removals without deleting, then runs `cleanup --older-than N` to actually remove the qualifying baselines.
- Expected signals: an accurate `status` listing, a `--dry-run` preview that reports what would be removed while leaving the store unchanged, and a real `cleanup` run that removes exactly the previewed baselines.
- Desired user-visible outcome: an accurate snapshot listing and a safe, previewable cleanup.
- Pass/fail: PASS if `status` lists the seeded baselines, the `--dry-run` preview leaves the store byte-unchanged, and the real `cleanup` removes exactly the previewed entries; FAIL if the listing is wrong, the dry-run deletes anything, or the real cleanup removes more or fewer entries than previewed.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `List my saved baselines and clean up the old ones.`

### Commands

1. `python3 scripts/create_diff.py snapshot /tmp/doc.md --state-dir /tmp/cd-store`
2. `python3 scripts/create_diff.py status --state-dir /tmp/cd-store`
3. `python3 scripts/create_diff.py cleanup --older-than N --dry-run --state-dir /tmp/cd-store`
4. `python3 scripts/create_diff.py cleanup --older-than N --state-dir /tmp/cd-store`

### Expected

Step 1 seeds at least one baseline under `/tmp/cd-store` and exits `0`. Step 2 prints a listing that includes the seeded baseline and exits `0`. Step 3, with `N` chosen so the seeded baseline qualifies (for example `0` to target all), prints a preview of what would be removed, deletes nothing, and exits `0` — the store is byte-unchanged after step 3. Step 4 removes exactly the baselines previewed in step 3 and exits `0`; a follow-up `status` would show them gone.

### Evidence

Capture the step 2 `status` listing, the step 3 dry-run preview text, a listing of `/tmp/cd-store` immediately after step 3 proving nothing was deleted, the step 4 output, and a final `status` (or store listing) confirming the previewed baselines were removed. Record the value of `N` used.

### Pass / Fail

- **Pass**: step 2 lists the seeded baseline, step 3 previews removals but leaves the store unchanged, and step 4 removes exactly the previewed entries.
- **Fail**: the step 2 listing is inaccurate, step 3 deletes anything, or step 4 removes more or fewer baselines than step 3 previewed.

### Failure Triage

1. If step 3's preview is empty, the seeded baseline does not yet qualify for the chosen `N`; lower `--older-than` (for example to `0`) or check the snapshot dates shown by `status`.
2. Compare a listing of `/tmp/cd-store` taken before and immediately after step 3; any difference means the dry-run is not honoring its no-delete contract and is an immediate FAIL.
3. Confirm the same `--state-dir` is passed to every command so `status`, the dry-run, and the real cleanup all operate on the same store.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../feature-catalog/snapshot-lifecycle/snapshot-state-management.md` | Feature-catalog source describing the implementation contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `scripts/create_diff.py` | Primary implementation anchor |
| `scripts/validate_report.py` | Validation anchor |

---

## 5. SOURCE METADATA

- Group: SNAPSHOT
- Playbook ID: SNAP-003
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `snapshot/snapshot-status-and-cleanup.md`
