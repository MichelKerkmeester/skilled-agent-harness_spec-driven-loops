---
title: "AU-005 Rebuild From Source on Corrupt SQLite"
description: "Manual validation that corruption of the skill graph SQLite database triggers a rebuild-from-source recovery path without crashing the runtime."
trigger_phrases:
  - "au-005"
  - "rebuild from source"
  - "corrupt sqlite advisor"
  - "daemon recovery rebuild"
---

# AU-005 Rebuild From Source on Corrupt SQLite

<!-- sk-doc-template: manual_testing_playbook -->

---

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. SCENARIO CONTRACT](#2--scenario-contract)
- [3. TEST EXECUTION](#3--test-execution)
- [4. SOURCE FILES](#4--source-files)

---

<!-- /ANCHOR:table-of-contents -->

<!-- ANCHOR:1-overview -->
## 1. OVERVIEW

Validate the rebuild-from-source recovery path in `lib/freshness/rebuild-from-source.ts` when the advisor SQLite database is corrupted, including fail-open behavior and cache-invalidation wiring.

---

<!-- /ANCHOR:1-overview -->

<!-- ANCHOR:2-scenario-contract -->
## 2. SCENARIO CONTRACT

- Disposable workspace copy. Do not corrupt the live repo database.
- Backup of the original `skill-graph.sqlite` captured before corruption.
- MCP server reachable for the copy.
- Operator has shell access to delete or mutate the copied database.

---

<!-- /ANCHOR:2-scenario-contract -->

<!-- ANCHOR:3-test-execution -->
## 3. TEST EXECUTION

> **Structure deviation note (007-deferred-final).** This scenario uses a numbered-step plus Expected Signals plus Failure Modes shape instead of the canonical Prompt/Commands/Expected/Evidence/Pass-Fail/Failure-Triage subsections. The deviation is intentional for this skill playbook category to keep scenario semantics tightly bound to runtime output checks. See `references/deferred-decisions.md` §F34 for rationale.

1. In the disposable copy, replace `skill-graph.sqlite` with invalid bytes:

```bash
printf 'corrupt' > /tmp/path-to-copy/.opencode/skills/system-skill-advisor/mcp_server/database/skill-graph.sqlite
```

2. Detect the failure:

```text
advisor_status({"workspaceRoot":"/tmp/path-to-copy"})
```

3. Trigger rebuild via scan:

```text
skill_graph_scan({})
```

4. Re-check status and call `advisor_recommend` for a known-routable prompt.

### Expected Signals

- Step 2 status shows `freshness: "unavailable"` or an explicit trust reason citing DB failure.
- Step 3 scan completes without uncaught exceptions.
- Step 4 post-rebuild status is `live` or `stale` and `advisor_recommend` returns recommendations for the touchstone prompt.
- No stack trace in stderr and no prompt leakage in diagnostics.

### Failure Modes

| Symptom | Detection | Action |
| --- | --- | --- |
| Runtime crashes on corruption | Stack trace reaches user | Block release, rebuild must fail open. |
| Rebuild never succeeds | Status stays `unavailable` after scan | Inspect `lib/freshness/rebuild-from-source.ts` source-discovery path and file permissions. |
| Cache serves stale recommendations | Post-rebuild results still match pre-corruption cache | Verify `lib/freshness/cache-invalidation.ts` fires on generation reset. |

---

<!-- /ANCHOR:3-test-execution -->

<!-- ANCHOR:4-source-files -->
## 4. SOURCE FILES

- Scenario [OP-003](../04--operator-h5/003-unavailable-daemon.md), operator recovery flow.
- Scenario [AU-004](./004-generation-publication.md), generation publication after rebuild.
- Feature [`01--daemon-and-freshness/06-rebuild-from-source.md`](../../feature_catalog/01--daemon-and-freshness/06-rebuild-from-source.md).
- Source: `.opencode/skills/system-skill-advisor/mcp_server/lib/freshness/rebuild-from-source.ts`.

---

<!-- /ANCHOR:4-source-files -->

<!-- ANCHOR:5-source-metadata -->
## 5. SOURCE METADATA

- Group: Auto Update Daemon
- Playbook ID: AU-005
- Canonical root source: manual_testing_playbook.md
- Feature file path: 05--auto-update-daemon/005-rebuild-from-source.md

<!-- /ANCHOR:5-source-metadata -->
