---
title: "AU-004 Generation-Tagged Snapshot Publication"
description: "Manual validation that generation counters bump atomically after reindex and that post-commit publication makes fresh snapshots visible to readers."
trigger_phrases:
  - "au-004"
  - "generation counter"
  - "snapshot publication"
  - "reindex commit"
version: 0.8.0.14
id: AU-004
category: auto_update_daemon
stage: routing
expected_workflow_mode: system-skill-advisor
expected_leaf_resources: []
---

# AU-004 Generation-Tagged Snapshot Publication

Prompt: Manual validation that generation counters bump atomically after reindex and that post-commit publication makes fresh snapshots visible to readers.


<!-- sk-doc-template: manual_testing_playbook -->

---

## 1. OVERVIEW

Validate that generation counter increments are atomic, persisted through temp-file rename and that post-commit snapshot publication exposes the new generation to `advisor_status` readers without partial-write leakage.

---

## 2. SCENARIO CONTRACT

- Repo root as working directory.
- MCP server built.
- Daemon reachable via `advisor_status`.
- Disposable workspace copy if destructive simulation is needed. Step 3 touches a live skill file.

---

## 3. TEST EXECUTION

> **Structure deviation note (007-deferred-final).** This scenario uses a numbered-step plus Expected Signals plus Failure Modes shape instead of the canonical Prompt/Commands/Expected/Evidence/Pass-Fail/Failure-Triage subsections. The deviation is intentional for this skill playbook category to keep scenario semantics tightly bound to runtime output checks. See `references/decisions/deferred-decisions.md` §F34 for rationale.

1. Capture baseline generation:

```text
advisor_status({"workspaceRoot":"/absolute/path/to/repo"})
```

2. Touch the `SKILL.md` of an active skill in the workspace:

```bash
touch .opencode/skills/sk-git/SKILL.md
```

3. Wait for the watcher debounce plus reindex to complete.
4. Re-read status:

```text
advisor_status({"workspaceRoot":"/absolute/path/to/repo"})
```

5. Call `advisor_recommend` with a prompt that maps to the touched skill and inspect `cache.generation` if present.

### Expected Signals

- Generation increments by exactly 1 between step 1 and step 4.
- `lastScanAt` advances.
- `trustState.state` returns to `live`.
- `advisor_recommend` response reflects the new generation where generation is surfaced.
- No intermediate state exposes a generation without a matching snapshot (no partial-write leakage).

### Failure Modes

| Symptom | Detection | Action |
| --- | --- | --- |
| Generation advances without snapshot | Reader sees new generation but stale recommendations | Inspect `lib/freshness/generation.ts` publication atomicity. |
| Reader observes partial write | Recommendation missing newly-indexed skill | Check temp-file rename ordering. |
| Generation never advances | Status unchanged after touch | Combine with AU-001 to isolate watcher vs. publication fault. |

### Evidence

Baseline `advisor_status({"workspaceRoot":"/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public","checkArtifactIntegrity":true})` output:

```json
{
  "status": "ok",
  "data": {
    "freshness": "unavailable",
    "generation": 9476,
    "trustState": {
      "state": "stale",
      "reason": "SIGTERM",
      "generation": 9476,
      "checkedAt": "2026-07-03T02:11:56.562Z",
      "lastLiveAt": null
    },
    "lastGenerationBump": "2026-07-02T05:27:14.803Z",
    "lastScanAt": "2026-07-02T05:27:14.803Z",
    "skillCount": 26,
    "laneWeights": {
      "explicit_author": 0.42,
      "lexical": 0.28,
      "graph_causal": 0.13,
      "derived_generated": 0.12,
      "semantic_shadow": 0.05
    }
  }
}
```

Step 2 was not executed because the scenario command requires this write outside the allowed path:

```bash
touch .opencode/skills/sk-git/SKILL.md
```

Allowed write paths for this run only permitted:

```text
.opencode/skills/system-skill-advisor/manual-testing-playbook/auto-update-daemon/generation-publication.md
```

### Pass/Fail

BLOCKED - Step 2 requires modifying `.opencode/skills/sk-git/SKILL.md`, but this run explicitly allowed writes only to `.opencode/skills/system-skill-advisor/manual-testing-playbook/auto-update-daemon/generation-publication.md`; the daemon was also not live at baseline (`freshness`: `unavailable`, `trustState.state`: `stale`, `trustState.reason`: `SIGTERM`).

---

## 4. SOURCE FILES

- Scenario [AU-001](../../manual-testing-playbook/auto-update-daemon/watcher-narrow-scope.md), watcher scope.
- Scenario [AU-005](../../manual-testing-playbook/auto-update-daemon/rebuild-from-source.md), recovery when snapshot unreadable.
- Feature [`daemon-and-freshness/generation.md`](../../feature-catalog/daemon-and-freshness/generation.md).
- Source: `.opencode/skills/system-skill-advisor/mcp-server/lib/freshness/generation.ts`.

---

## 5. SOURCE METADATA

- Group: Auto Update Daemon
- Playbook ID: AU-004
- Canonical root source: manual-testing-playbook.md
- Feature file path: auto-update-daemon/generation-publication.md
