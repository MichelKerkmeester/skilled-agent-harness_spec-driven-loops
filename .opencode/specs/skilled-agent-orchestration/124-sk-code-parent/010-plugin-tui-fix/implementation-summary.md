---
title: "Implementation Summary: plugin TUI-overlay fix"
description: "Rechanneled mk-dist-freshness-guard off console.* onto experimental.chat.system.transform + an append-only log, retargeted the regression test to assert zero terminal writes, updated the two README channel descriptions, and landed the durable no-TUI-overlay rule in the sk-code OpenCode surface (quality standards §10 + JS checklist P0)."
trigger_phrases:
  - "mk-dist-freshness-guard TUI overlay fix"
  - "opencode plugin no stdout stderr rule"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/124-sk-code-parent/010-plugin-tui-fix"
    last_updated_at: "2026-07-04T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Rechanneled the plugin, retargeted the test (passing), updated both READMEs and the sk-code rule homes"
    next_safe_action: "Commit file-scoped; full Level-2 docs + strict-validate finalized in phase 014 roll-up"
    blockers: []
    key_files:
      - ".opencode/plugins/mk-dist-freshness-guard.js"
      - ".opencode/plugins/tests/mk-dist-freshness-guard.test.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bootstrap-session"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: plugin TUI-overlay fix

<!-- SPECKIT_LEVEL: 2 -->

## What shipped

- **Plugin rechannel** (`mk-dist-freshness-guard.js`) — removed all three
  `console.*` emissions. Stale dist now reaches the agent through a bounded
  `experimental.chat.system.transform` push (per-turn, TTL-cached to avoid
  re-hashing every package each turn) and is appended to
  `.opencode/logs/dist-freshness-guard.log`. `tool.execute.before` (risky bash)
  and `session.created` force-refresh the cache and log. Single default export,
  session dedupe, and fail-open (never throws) preserved.
- **Test retarget** (`mk-dist-freshness-guard.test.cjs`) — a `runTrapped` helper
  traps `console.warn/error/log`; all 7 behavioral cases now assert **zero**
  console calls plus log-line deltas and the transform injection. The header
  documents the regression it pins.
- **Docs** — `plugins/README.md` and `bin/README.md` §6 now describe the
  injection + log channels and state the signal is "never written to
  stdout/stderr, which OpenCode's TUI would paint over the chat input."
- **Durable rule** — `quality_standards.md` §10 gained a "Runtime Output — Never
  Overlay the TUI" subsection (channel table + stderr-behind-debug-flag rule);
  `javascript_checklist.md` gained a P0 checkbox mirror. These are the two
  router-loaded homes for the OpenCode+JS surface (they relocate in phase 013;
  the rule travels with them).

## Evidence

- `node .opencode/plugins/tests/mk-dist-freshness-guard.test.cjs` →
  "all assertions passed".
- `checkAllFreshness()` over all 7 watched packages → every package `stale:false`.
- Advisor CLI shim resolves `dist/mcp_server/skill-advisor-cli.js` (native
  entrypoint present; no `NATIVE_DIST_MISSING` fallback).

## Deferred (per program plan)

- Full Level-2 doc set (plan.md / tasks.md / checklist.md), `description.json`,
  `graph-metadata.json`, and `validate.sh --strict` exit-0 are finalized in the
  phase 014 close-out roll-up (which also runs the canonical reindex), to avoid
  touching the shared memory DB while a concurrent session shares the branch.
- Live TUI smoke (observing zero overlay inside an actual OpenCode TUI) is not
  reproducible from this runtime; the trapped-console unit test is the standing
  proof that no terminal write path remains.
