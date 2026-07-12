---
title: "AU-001 Chokidar Watcher Narrow Scope"
description: "Manual validation that the daemon Chokidar watcher subscribes only to SKILL.md, graph-metadata.json and derived.key_files paths and does not fire on unrelated file changes."
trigger_phrases:
  - "au-001"
  - "watcher scope"
  - "chokidar narrow scope"
  - "auto update daemon watcher"
version: 0.8.0.14
---

# AU-001 Chokidar Watcher Narrow Scope

<!-- sk-doc-template: manual_testing_playbook -->

---

## 1. OVERVIEW

Validate that the daemon watcher in `lib/daemon/watcher.ts` subscribes only to `SKILL.md`, `graph-metadata.json` and dynamic `derived.key_files` paths and that unrelated file writes under `.opencode/` or repo root do not trigger a reindex.

---

## 2. SCENARIO CONTRACT

- Repo root is the working directory.
- MCP server has been built with `npm --prefix .opencode/skills/system-spec-kit/mcp_server run build`.
- The advisor daemon is running (either via MCP server startup or on-demand through `advisor_status`).
- `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED` is unset.
- Terminal capture is enabled so daemon stderr or structured logs are recorded.

---

## 3. TEST EXECUTION

> **Structure deviation note (007-deferred-final).** This scenario uses a numbered-step plus Expected Signals plus Failure Modes shape instead of the canonical Prompt/Commands/Expected/Evidence/Pass-Fail/Failure-Triage subsections. The deviation is intentional for this skill playbook category to keep scenario semantics tightly bound to runtime output checks. See `references/decisions/deferred_decisions.md` §F34 for rationale.

1. Capture baseline generation:

```text
advisor_status({"workspaceRoot":"/absolute/path/to/repo"})
```

2. Touch an unrelated file under `.opencode/`:

```bash
touch .opencode/plugins/spec-kit-skill-advisor.js
```

3. Wait 3 seconds and recheck status:

```text
advisor_status({"workspaceRoot":"/absolute/path/to/repo"})
```

4. Touch a tracked skill file:

```bash
touch .opencode/skills/sk-doc/SKILL.md
```

5. Wait 3 seconds and recheck status again.

### Expected Signals

- After step 2 unrelated touch, `generation` in `advisor_status` is unchanged from step 1.
- After step 4 tracked touch, `generation` increments by exactly 1.
- `freshness` returns to `live` after the debounce window.
- Daemon logs (if exposed) show a reindex event only after the SKILL.md touch, not after the plugin touch.

### Failure Modes

| Symptom | Detection | Action |
| --- | --- | --- |
| Watcher fires on unrelated paths | Generation increments after plugin touch | Inspect `lib/daemon/watcher.ts` glob patterns for over-subscription. |
| Watcher misses tracked paths | Generation unchanged after SKILL.md touch | Confirm Chokidar is active. Inspect lease and lifecycle logs. |
| Stale trust state after touch | `freshness` remains `stale` beyond debounce window | Check `lib/freshness/cache-invalidation.ts` hook-up to generation bumps. |

---

## 4. SOURCE FILES

- Scenario [AU-002](../auto_update_daemon/lease_single_writer.md), single-writer lease semantics.
- Scenario [AU-004](../auto_update_daemon/generation_publication.md), generation bump publication.
- Feature [`daemon-and-freshness/watcher.md`](../../feature_catalog/daemon_and_freshness/watcher.md).
- Source: `.opencode/skills/system-skill-advisor/mcp_server/lib/daemon/watcher.ts`.

---

## 5. SOURCE METADATA

- Group: Auto Update Daemon
- Playbook ID: AU-001
- Canonical root source: manual_testing_playbook.md
- Feature file path: auto-update-daemon/watcher-narrow-scope.md
