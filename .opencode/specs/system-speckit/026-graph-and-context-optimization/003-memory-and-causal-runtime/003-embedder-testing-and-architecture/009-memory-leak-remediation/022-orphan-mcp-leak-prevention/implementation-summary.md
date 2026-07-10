---
title: "Implementation Summary: Orphan MCP Leak Prevention"
description: "Dry-run-first MCP process cleanup, repo-local Claude Stop cleanup, and MCP server idle self-exit are implemented for review."
trigger_phrases:
  - "orphan mcp leak prevention implementation"
  - "mcp leak prevention summary"
  - "orphan sweeper rollout summary"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/022-orphan-mcp-leak-prevention"
    last_updated_at: "2026-05-24T07:17:45Z"
    last_updated_by: "codex"
    recent_action: "implemented dry-run MCP leak prevention"
    next_safe_action: "operator reviews dry-run output, then separately approves LaunchAgent activation if desired"
    blockers: []
    key_files:
      - ".opencode/scripts/orphan-mcp-sweeper.sh"
      - ".opencode/scripts/claude-session-cleanup.sh"
      - ".opencode/scripts/launchagents/com.michelkerkmeester.orphan-sweep.plist"
      - ".claude/settings.local.json"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/ipc/launcher-idle-timeout.ts"
      - ".opencode/skills/system-skill-advisor/mcp_server/lib/ipc/launcher-idle-timeout.ts"
      - ".opencode/skills/system-code-graph/mcp_server/lib/ipc/launcher-idle-timeout.ts"
    session_dedup:
      fingerprint: "sha256:0220220220220220220220220220220220220220220220220220220220220220"
      session_id: "2026-05-24-orphan-mcp-leak-prevention-implemented"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "LaunchAgent activation remains operator-approved follow-up."
    answered_questions:
      - "Layers 1, 2, and 3 were implemented in this packet."
      - "No home-level Claude config or LaunchAgent install was performed."
      - "No branch, stage, commit, or launchctl load was performed."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Orphan MCP Leak Prevention

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 022-orphan-mcp-leak-prevention |
| **Completed** | 2026-05-24 |
| **Level** | 3 |
| **Rollout State** | Implemented, dry-run only |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This packet turns the manual orphan MCP cleanup into reviewable automation without enabling system-level rollout yet. The sweeper, Claude Stop cleanup, and MCP idle self-exit are versioned in the repo; LaunchAgent activation and home-level config changes remain separate operator decisions.

### Dry-Run Sweeper

`.opencode/scripts/orphan-mcp-sweeper.sh` scans the live process table for stale MCP classes, logs preserved and kill-candidate processes, and supports `--dry-run`, `--verbose`, `--log-path`, `ORPHAN_AGE_MIN_SEC`, and `ORPHAN_TMP_AGE_HOURS`. It preserves devin, `/tmp/devin-*`, `/tmp/codex-browser-use`, Ollama, non-MCP TCP listeners, live Claude Code descendants, and the freshest young MCP instance per class. In non-dry-run mode it sends SIGTERM, waits 5 seconds, then sends SIGKILL to survivors.

The first dry-run found a Bash 3 plus `set -u` empty-array bug that suppressed preserve checks when no Claude tree was present. That was fixed before final verification, and sequential-thinking wrapper/server processes are now classified separately so a fresh wrapper-child pair can be preserved together.

### Claude Stop Cleanup

`.opencode/scripts/claude-session-cleanup.sh` walks only the current Claude session descendant tree using `CLAUDE_SESSION_PID` or `PPID`, logs to `~/.local/share/claude-stop-hook.log`, and sends SIGTERM only to matching MCP helpers. `.claude/settings.local.json` keeps the existing single nested `Stop` hook and chains this cleanup after the canonical `session-stop.js` command while preserving the original command exit status.

### MCP Idle Self-Exit

Spec Kit Memory, Skill Advisor, and Code Graph MCP servers now install a server-side idle monitor. `SPECKIT_LAUNCHER_IDLE_TIMEOUT_MIN` defaults to `30`, accepts fractional values for tests, and `0` disables the monitor. Primary stdio input and secondary IPC connect/data/write events refresh activity; active secondary IPC clients keep the server alive past the timeout. Idle shutdown closes IPC bridges through existing server shutdown paths, so the CJS launchers continue to clear lease files from their child-process exit handlers.

### LaunchAgent Template

`.opencode/scripts/launchagents/com.michelkerkmeester.orphan-sweep.plist` is a versioned template that runs the sweeper every 600 seconds. It was not copied to `~/Library/LaunchAgents` and was not loaded with `launchctl`.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementation stayed on `main` and did not stage, commit, branch, load launchd, or edit home-level Claude config. Builds were run after implementation so the `dist` MCP entrypoints used by the launchers include the idle monitor. The spec-kit MCP build initially failed because production compilation included `tests/fixtures/**/*.ts`; the build config now excludes test fixtures, which lets production artifacts emit cleanly.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:documentation-index -->
## Documentation Index

The implementation details remain in this packet. Operator and AI wayfinding now lives in the reusable repo docs:

| Surface | Link | Purpose |
|---|---|---|
| Root README | [README.md](../../../../../../../README.md) | Quick-start and related-doc pointers for the native MCP lifecycle guardrails. |
| Scripts runbook | [.opencode/scripts/README.md](../../../../../../scripts/README.md) | Dry-run sweeper command, preservation rules, Claude cleanup, and LaunchAgent template boundary. |
| Spec Kit MCP runtime README | [mcp_server/README.md](../../../../../../skills/system-spec-kit/mcp_server/README.md) | Runtime lifecycle guardrail summary and canonical env reference links. |
| Feature catalog | [orphan sweeper](../../../../../../skills/system-spec-kit/feature_catalog/16--tooling-and-scripts/orphan-mcp-sweeper-and-launchagent-template.md), [idle timeout](../../../../../../skills/system-spec-kit/feature_catalog/19--feature-flag-reference/launcher-idle-timeout.md) | Planning-time feature discovery for AI agents. |
| Manual playbook | [419 orphan MCP runtime lifecycle guardrails](../../../../../../skills/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/orphan-mcp-runtime-lifecycle-guardrails.md) | Manual dry-run, plist lint, script syntax, and discoverability checks. |

<!-- /ANCHOR:documentation-index -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep rollout dry-run only | Process cleanup is high blast-radius, and the user explicitly separated review from launchd activation. |
| Chain Claude cleanup inside the existing Stop hook | Existing tests enforce one nested `Stop` hook shape, and chaining avoids parallel hook fan-out. |
| Put idle self-exit in MCP servers, not CJS launchers | The servers can observe stdio and IPC activity directly, while launchers already own lease cleanup after child exit. |
| Preserve freshest young instances by class | This protects current respawn stacks without permanently preserving stale duplicates. |
| Exclude spec-kit MCP test fixtures from production build | Fixture-only imports were blocking `tsc --build`; production builds should not compile test fixture sources. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `python3 -m json.tool .claude/settings.local.json` | PASS |
| `bash -n .opencode/scripts/orphan-mcp-sweeper.sh` | PASS |
| `bash -n .opencode/scripts/claude-session-cleanup.sh` | PASS |
| `plutil -lint .opencode/scripts/launchagents/com.michelkerkmeester.orphan-sweep.plist` | PASS |
| Sweeper dry-run | PASS. `--dry-run --verbose` logged stale kill candidates and `/tmp` removals without mutation; `/tmp/codex-browser-use` and `/tmp/devin-*` were preserved. Earlier dry-run also verified freshest young MCP preserve logging before those live processes aged past the 300-second threshold. |
| Spec Kit MCP idle/socket vitest | PASS. `launcher-idle-timeout.vitest.ts` and `ipc-socket-activity.vitest.ts`: 2 files, 6 tests. |
| Skill Advisor idle/settings parity vitest | PASS. `launcher-idle-timeout.vitest.ts` plus `settings-driven-invocation-parity.vitest.ts`: 2 files, 45 tests. |
| Code Graph idle vitest | PASS. `launcher-idle-timeout.vitest.ts`: 1 file, 5 tests. |
| Typechecks | PASS for `system-spec-kit/mcp_server`, `system-skill-advisor/mcp_server`, and `system-code-graph`. |
| Builds | PASS for `system-spec-kit`, `system-skill-advisor/mcp_server`, and `system-code-graph`. |
| `verify_alignment_drift.py` | PASS with 0 errors and 15 pre-existing warnings outside this packet's new files. |
| Strict spec validation | PASS for child `022-orphan-mcp-leak-prevention` and parent `009-memory-leak-remediation`. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **LaunchAgent is not active.** The plist is only a repo template. Activation still requires an operator-approved copy/load step.
2. **Claude cleanup has not been exercised by ending a live Claude Code session in this run.** Schema parity passed and the script is session-scoped, but the pass stopped short of closing a live operator session.
3. **Dry-run process age is time-sensitive.** The final dry-run ran after the freshest observed MCP stack had aged beyond 300 seconds, so no process-level freshest preserves appeared in that final output. A prior dry-run in the same implementation did show freshest-preserve logging while those processes were still below threshold.
4. **Spec-kit build config changed to exclude fixtures.** This is required for production build success; fixture tests remain runnable through Vitest, not through the production composite build.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
