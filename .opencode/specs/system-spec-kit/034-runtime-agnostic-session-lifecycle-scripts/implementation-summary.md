---
title: "Implementation Summary: Runtime-agnostic session lifecycle scripts [system-spec-kit/034-runtime-agnostic-session-lifecycle-scripts/implementation-summary]"
description: "Summary of making the session-lifecycle scripts runtime-agnostic."
trigger_phrases:
  - "runtime-agnostic lifecycle summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/034-runtime-agnostic-session-lifecycle-scripts"
    last_updated_at: "2026-05-30T12:50:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Shipped + pushed; docs reconciled"
    next_safe_action: "Optional P2 doc refresh"
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
# Implementation Summary: Runtime-agnostic session lifecycle scripts

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 034-runtime-agnostic-session-lifecycle-scripts |
| **Completed** | 2026-05-30 (code shipped + pushed; P2 doc refresh deferred) |
| **Level** | 2 |
| **Commit** | `b9a4b74962` (feat: runtime-agnostic session lifecycle scripts) |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

- **`post-commit`** messaging neutralized ("next MCP launcher boot") — mechanism was already runtime-neutral.
- **`orphan-mcp-sweeper.sh`** generalized: `build_claude_tree`/`claude_tree_pids` → `build_session_trees`/`session_tree_pids`; preserve regex now `claude|opencode|codex|gemini`; explicit operator-session preserves for `opencode run`, `codex exec`, `gemini` (beside `devin --print`); preserve string `live-claude-session-tree` → `live-session-tree`. **Closes the hard-rule gap** where an operator's `opencode run` MCP children were swept after 300s.
- **`claude-session-cleanup.sh` → `session-cleanup.sh`** (`git mv`, history preserved): multi-runtime session-PID fallback (`CLAUDE`/`OPENCODE`/`CODEX`/`GEMINI` → `PPID`), neutral log env + comments. A thin `claude-session-cleanup.sh` shim execs the renamed script.
- **Per-runtime wiring**: Claude `.claude/settings.local.json` `Stop` → `session-cleanup.sh`; Gemini `.gemini/settings.json` `SessionEnd` appends the cleanup call; new `.opencode/plugins/session-cleanup.js` runs cleanup on the OpenCode `server.instance.disposed`/`global.disposed` event. Codex/Devin documented as sweeper-covered.
- **Docs**: `.opencode/scripts/README.md` updated to the new name + per-runtime wiring table.

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Generalize the sweeper preserve-tree to all runtimes | Closes the hard-rule violation where operator `opencode run` MCP children were swept after 300s |
| Rename cleanup script + keep a back-compat shim | Reflects runtime-agnostic reality; shim keeps existing wiring + any unupdated caller working |
| New `session-cleanup.js` plugin for the OpenCode dispose path | OpenCode has no JSON SessionEnd hook; the dispose event is its real session-end equivalent |
| Document Codex/Devin as sweeper-covered, not force-wired | Neither exposes a safe session-end primitive; a forced hook could kill live MCP servers |
| Hand-author the 034 docs to template-anchor conformance | `create.sh` auto-branched + misplaced the folder via the `specs` symlink; manual authoring was the safe path |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| REQ-001 opencode-run preserve | DONE — `preserve_reason` unit test: opencode/codex/gemini/devin all → `operator-*-preserve` |
| REQ-002 Claude cleanup works | DONE — Stop wire → `session-cleanup.sh`; shim execs renamed script (rc=0) |
| bash -n / node --check | DONE — sweeper, session-cleanup, shim, post-commit, session-cleanup.js all clean |
| Multi-runtime PID fallback | DONE — CLAUDE/OPENCODE/CODEX/GEMINI → PPID |
| JSON configs valid | DONE — `.claude/settings.local.json` + `.gemini/settings.json` parse |
| comment hygiene | DONE — all changed scripts rc=0 |
| git mv history | DONE — commit shows the rename |

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:nfr-verify -->
## NFR Verification

- **NFR-S01 (best-effort cleanup)**: every wire uses `|| true` / the plugin swallows errors — teardown is never blocked. Verified by inspection of the Claude/Gemini wires and the plugin try/catch.
- **NFR-S02 (never kill live operator sessions)**: `preserve_reason` unit test confirms all four operator runtimes are preserved; multi-runtime live-session tree covers descendants.
- **NFR-S03 (history preserved)**: `git mv` rename + back-compat shim verified in the commit.

<!-- /ANCHOR:nfr-verify -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. Codex and Devin expose no session-end primitive; their MCP cleanup relies on the age-based `orphan-mcp-sweeper.sh`, not an on-exit hook.
2. `feature_catalog` + `manual_testing_playbook` still reference the old script name (P2 follow-on; the README and live wiring are updated).

<!-- /ANCHOR:limitations -->
---

<!-- ANCHOR:deviations -->
## Deviations from Plan

- Plan assumed a brand-new packet via `create.sh`; it auto-branched and created the folder at the wrong path (root `specs/` via the symlink), so the folder was authored manually at the canonical `.opencode/specs/system-spec-kit/034-...` path.
- The OpenCode wire shipped as a dedicated `session-cleanup.js` plugin after confirming the originally-named target (`mk-spec-memory.js`) does not exist; the real dispose-capable plugins are `mk-skill-advisor.js` / `mk-code-graph.js`, and a single-purpose plugin is cleaner than grafting onto them.
- A parallel session reverted operator-sensitive script edits multiple times; final delivery re-applied all changes and committed atomically.

<!-- /ANCHOR:deviations -->
