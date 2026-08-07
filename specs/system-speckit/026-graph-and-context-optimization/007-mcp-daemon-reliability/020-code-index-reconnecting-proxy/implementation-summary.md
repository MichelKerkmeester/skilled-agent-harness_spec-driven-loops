---
title: "Implementation Summary: mk-code-index reconnecting session proxy"
description: "mk-code-index now fronts its daemon with the same reconnecting session proxy as mk-spec-memory, so an owner death reattaches and replays read queries instead of surfacing a hard Connection closed."
trigger_phrases:
  - "code-index reconnecting proxy done"
  - "code-index connection closed fix"
  - "code-graph reconnect summary"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/007-mcp-daemon-reliability/020-code-index-reconnecting-proxy"
    last_updated_at: "2026-06-07T17:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Shipped the code-index reconnecting proxy port (61 launcher tests green)"
    next_safe_action: "Phase 021 orphan-sweeper / CLAUDE_SESSION_PID activation"
    blockers: []
    key_files:
      - ".opencode/bin/mk-code-index-launcher.cjs"
      - ".opencode/bin/lib/launcher-session-proxy.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-026-007-020-code-index-reconnecting-proxy"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 020-code-index-reconnecting-proxy |
| **Completed** | 2026-06-07 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A code-index client no longer dies when its daemon's owner does. mk-spec-memory already survived a recycle or owner change transparently through a reconnecting session proxy; mk-code-index did not — it bridged through a raw socket, so an owner death surfaced as a hard `Connection closed`. Now mk-code-index fronts its daemon with the same proxy, so the client reattaches to the respawned backend and replays in-flight read queries. This was the worst of the deferred failure modes (the code-graph daemon had no reconnect at all).

### A reusable classifier, two tool sets

The proxy decides what is safe to replay across a reattach. That decision was a hardcoded mk-spec-memory tool set. It is now a `createClassifyFrame({replayableToolNames, unsafeToolNames})` factory; the default reproduces the exact memory sets, so mk-spec-memory behavior is unchanged. mk-code-index builds its own classifier over the code-graph tools: read-only structural queries (`code_graph_query`, `code_graph_context`, `code_graph_status`, `code_graph_classify_query_intent`, `code_graph_verify`, `detect_changes`) replay, while `code_graph_scan` and `code_graph_apply` are explicitly unsafe and are never replayed — the client re-drives those itself on a retryable recycle error. All the reattach, replay, keepalive, and protocol-drift fail-closed machinery is reused unchanged.

### A testable launcher

mk-code-index previously ran from a bare trailing IIFE, so it could not be imported without spawning the daemon. It now runs behind the standard `require.main === module` guard (matching mk-spec-memory) and exports its tool sets, classifier, and bridge wrapper, so the wiring is unit-tested directly.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/bin/lib/launcher-session-proxy.cjs` | Modified | `createClassifyFrame` factory; default `classifyFrame` rebuilt from it (behavior identical); factory exported |
| `.opencode/bin/mk-code-index-launcher.cjs` | Modified | code-graph replayable/unsafe sets + `classifyCodeIndexFrame` + `bridgeStdioThroughSessionProxy`; `bridge:` wired; `require.main` guard + exports |
| `mcp_server/tests/launcher-code-index-proxy.vitest.ts` | Created | Factory mechanics + code-index classifier + set isolation + default-classifier regression |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The port needed no change to the proxy's reattach/replay core: `createSessionProxy` already accepted an injectable `classify`, so the work was a classifier factory plus a code-index wrapper that mirrors the mk-spec-memory one. Verified with `node --check` on both files, a 13-assertion require-time smoke test (which also confirmed the new `require.main` guard keeps the import inert), and the launcher vitest suite — code-index proxy + session-proxy (default classifier regression) + watchdog + reap-hardening + persistent-log, 61 tests green. Rollback is removing the `bridge:` option (raw-socket fallback) or reverting the packet.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Factory with a default that reproduces the memory sets | Generalizes replay classification for a second server without changing mk-spec-memory behavior |
| Mutating code tools (scan/apply) explicitly unsafe | Replaying a graph rebuild or apply across a reattach could corrupt or duplicate work; the client re-drives them |
| Reuse the proxy machinery, change only the classifier | The reattach/replay/keepalive/fail-closed logic is identical across servers; one implementation, two tool sets |
| Add the `require.main` guard | Makes the launcher importable for tests and consistent with mk-spec-memory; safe since it is only ever spawned as a script |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --check` session-proxy + mk-code-index | PASS |
| require-time smoke (13 assertions; guard inert) | PASS |
| `launcher-code-index-proxy.vitest.ts` | PASS |
| `launcher-session-proxy.vitest.ts` (default classifier regression) | PASS |
| launcher suite (watchdog/reap/persistent-log) | PASS (no regression) |
| comment-hygiene (durable WHY, no ids/paths) | PASS |
| cross-validation (claude2 + cli-opencode + cli-codex) | cli-opencode found `code_graph_verify` mutates on `persistBaseline=true` -> moved from replayable to the UNSAFE set + test updated |
| `validate.sh --strict` (this packet) | PASS |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Runtime-unverified this session.** Like the launcher `.cjs` changes before it, the new wiring activates on a fresh launcher, so the transparent reattach is confirmed by unit tests + the shared proxy's existing coverage, not by live observation yet.
2. **Replay set is conservative.** Only known read-only code-graph tools replay; any new code-index tool defaults to non-replayable until explicitly added.
3. **Inherits the proxy's known gaps.** The secondary-index replay caveat documented for mk-spec-memory does not apply to code-graph reads, but any future idempotency gaps in the shared proxy affect both servers.
<!-- /ANCHOR:limitations -->
