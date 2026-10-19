---
title: "AU-004 Generation-Tagged Snapshot Publication"
description: "Manual validation that generation counters bump atomically after reindex and that post-commit publication makes fresh snapshots visible to readers."
trigger_phrases:
  - "au-004"
  - "generation counter"
  - "snapshot publication"
  - "reindex commit"
version: 0.8.2.0
id: AU-004
category: auto_update_daemon
stage: routing
expected_workflow_mode: system-skill-advisor
expected_leaf_resources: []
---

# AU-004 Generation-Tagged Snapshot Publication

Prompt: Manual validation that generation counters bump atomically after reindex and that post-commit publication makes fresh snapshots visible to readers.


---

## 1. OVERVIEW

Validate that generation counter increments are atomic, persisted through temp-file rename and that post-commit snapshot publication exposes the new generation to `advisor_status` readers without partial-write leakage.

---

## 2. SCENARIO CONTRACT

- Repo root as working directory.
- Advisor runtime built.
- Daemon reachable via `advisor_status`.
- Disposable workspace copy if destructive simulation is needed. Step 3 touches a live skill file.

---

## 3. TEST EXECUTION

Run every command from the repository root.

### Commands

1. Capture baseline generation:

```text
node .skilled/bin/skill-advisor.cjs advisor_status --workspace-root /absolute/path/to/repo --format json
```

2. Touch the `SKILL.md` of an active skill in the workspace:

```bash
touch .skilled/skills/sk-git/SKILL.md
```

3. Wait for the watcher debounce plus reindex to complete.
4. Re-read status:

```text
node .skilled/bin/skill-advisor.cjs advisor_status --workspace-root /absolute/path/to/repo --format json
```

5. Call `advisor_recommend` with a prompt that maps to the touched skill and inspect `cache.generation` if present.

### Expected

- Generation increments by exactly 1 between step 1 and step 4.
- `lastScanAt` advances.
- `trustState.state` returns to `live`.
- `advisor_recommend` response reflects the new generation where generation is surfaced.
- No intermediate state exposes a generation without a matching snapshot (no partial-write leakage).

### Failure Triage

| Symptom | Detection | Action |
| --- | --- | --- |
| Generation advances without snapshot | Reader sees new generation but stale recommendations | Inspect `lib/freshness/generation.ts` publication atomicity. |
| Reader observes partial write | Recommendation missing newly-indexed skill | Check temp-file rename ordering. |
| Generation never advances | Status unchanged after touch | Combine with AU-001 to isolate watcher vs. publication fault. |

### Evidence

- Capture each command's output and exit status.
- Record `generation`, `lastScanAt` and `trustState.state` from both status reads.
- Record `cache.generation` from the recommendation response when present.
- Capture any intermediate generation and its matching snapshot.

### Pass / Fail

- **Pass**: Every expected signal holds.
- **Fail**: Any expected signal differs.

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Scenario [AU-001](../../manual-testing-playbook/auto-update-daemon/watcher-narrow-scope.md), watcher scope.
- Scenario [AU-005](../../manual-testing-playbook/auto-update-daemon/rebuild-from-source.md), recovery when snapshot unreadable.
- Feature [`feature-catalog/daemon-and-freshness/generation.md`](../../feature-catalog/daemon-and-freshness/generation.md).
- Source: `.skilled/skills/system-skill-advisor/runtime/lib/freshness/generation.ts`.

---

## 5. SOURCE METADATA

- Group: Auto Update Daemon
- Playbook ID: AU-004
- Canonical root source: manual-testing-playbook.md
- Feature file path: auto-update-daemon/generation-publication.md
