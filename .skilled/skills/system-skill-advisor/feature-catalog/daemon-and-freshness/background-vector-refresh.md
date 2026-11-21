---
title: "Background Vector Refresh"
description: "Refreshes missing or stale skill and command vectors after daemon startup and watcher reindexing."
trigger_phrases:
  - "background vector refresh"
  - "skill vector refresh"
  - "command vector refresh"
  - "embedding coverage"
version: 0.8.8.0
---

# Background Vector Refresh

## 1. OVERVIEW

The advisor refreshes missing or stale skill and command vectors after startup and watcher reindexing. It keeps vector coverage current without tying index-time embedding work to the semantic lane's prompt-time weight.

---

## 2. HOW IT WORKS

After startup IPC is ready, `advisor-server.ts` starts the shared refresh without waiting. `watcher.ts` starts the same refresh after each reindex. Both paths run at any semantic lane weight. Only one refresh runs at a time. A request that arrives while one runs joins it, and the run makes one more pass once the current pass ends, so a skill a reindex added mid-run still gets its vector. A pass that throws does not cancel that extra pass, and the run rejects only when every pass threw. A pass that fails after an earlier one succeeded adds a `refresh pass failed` warning to the run's result.

`embeddingCoverage()` compares each stored vector with the active embedder and source content hash without contacting the embedder. It reports how many eligible skill and command rows are ready or need refresh. Coverage is complete when at least one embeddable skill exists and every eligible skill and command vector is current. A command-only index remains incomplete. Complete coverage skips network work. Otherwise, the refresh probes Ollama once with a 500 ms timeout when the active embedder uses Ollama, then refreshes missing or stale rows. Failed embeds keep the old vectors.

Set `SYSTEM_SKILL_ADVISOR_EMBED_REFRESH=off` to disable the refresh. The value is case-insensitive. This opt-out does not change the semantic lane's prompt-time weight.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts` | Shared | Coverage check, refresh and opt-out |
| `.skilled/skills/system-skill-advisor/runtime/advisor-server.ts` | Daemon | Starts the refresh after startup IPC is ready |
| `.skilled/skills/system-skill-advisor/runtime/lib/daemon/watcher.ts` | Daemon | Starts the refresh after each reindex |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/system-skill-advisor/runtime/tests/skill-graph/embedding-coverage.vitest.ts` | Automated test | Coverage classification for eligible skill and command vectors |

---

## 4. SOURCE METADATA

- Group: Daemon and freshness
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `daemon-and-freshness/background-vector-refresh.md`

Related references:

- [watcher.md](./watcher.md), watcher-triggered refresh.
- [lifecycle.md](./lifecycle.md), startup refresh.
