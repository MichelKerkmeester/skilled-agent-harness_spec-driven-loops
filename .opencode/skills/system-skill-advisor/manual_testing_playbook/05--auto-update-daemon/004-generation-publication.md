---
title: "AU-004 Generation-Tagged Snapshot Publication"
description: "Manual validation that generation counters bump atomically after reindex and that post-commit publication makes fresh snapshots visible to readers."
trigger_phrases:
  - "au-004"
  - "generation counter"
  - "snapshot publication"
  - "reindex commit"
---

# AU-004 Generation-Tagged Snapshot Publication

<!-- sk-doc-template: manual_testing_playbook -->

---

<!-- ANCHOR:1-overview -->
## 1. OVERVIEW

Validate that generation counter increments are atomic, persisted through temp-file rename and that post-commit snapshot publication exposes the new generation to `advisor_status` readers without partial-write leakage.

---

<!-- /ANCHOR:1-overview -->

<!-- ANCHOR:2-scenario-contract -->
## 2. SCENARIO CONTRACT

- Repo root as working directory.
- MCP server built.
- Daemon reachable via `advisor_status`.
- Disposable workspace copy if destructive simulation is needed. Step 3 touches a live skill file.

---

<!-- /ANCHOR:2-scenario-contract -->

<!-- ANCHOR:3-test-execution -->
## 3. TEST EXECUTION

> **Structure deviation note (007-deferred-final).** This scenario uses a numbered-step plus Expected Signals plus Failure Modes shape instead of the canonical Prompt/Commands/Expected/Evidence/Pass-Fail/Failure-Triage subsections. The deviation is intentional for this skill playbook category to keep scenario semantics tightly bound to runtime output checks. See `references/deferred-decisions.md` §F34 for rationale.

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

---

<!-- /ANCHOR:3-test-execution -->

<!-- ANCHOR:4-source-files -->
## 4. SOURCE FILES

- Scenario [AU-001](./001-watcher-narrow-scope.md), watcher scope.
- Scenario [AU-005](./005-rebuild-from-source.md), recovery when snapshot unreadable.
- Feature [`01--daemon-and-freshness/04-generation.md`](../../feature_catalog/01--daemon-and-freshness/04-generation.md).
- Source: `.opencode/skills/system-skill-advisor/mcp_server/lib/freshness/generation.ts`.

---

<!-- /ANCHOR:4-source-files -->

<!-- ANCHOR:5-source-metadata -->
## 5. SOURCE METADATA

- Group: Auto Update Daemon
- Playbook ID: AU-004
- Canonical root source: manual_testing_playbook.md
- Feature file path: 05--auto-update-daemon/004-generation-publication.md

<!-- /ANCHOR:5-source-metadata -->
