---
title: "Changelog: mk-code-index reconnecting session proxy [007-mcp-daemon-reliability/020-code-index-reconnecting-proxy]"
description: "Chronological changelog for the mk-code-index reconnecting session proxy phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-15

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/020-code-index-reconnecting-proxy` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability`

### Summary

A code-index client no longer dies when its daemon's owner does. mk-spec-memory already survived a recycle or owner change transparently through a reconnecting session proxy; mk-code-index did not — it bridged through a raw socket, so an owner death surfaced as a hard Connection closed. Now mk-code-index fronts its daemon with the same proxy, so the client reattaches to the respawned backend and replays in-flight read queries. This was the worst of the deferred failure modes (the code-graph daemon had no reconnect at all).

### Added

- createClassifyFrame factory in launcher-session-proxy.cjs that generalizes replay classification for multiple servers; default classifyFrame rebuilt from it with behavior preserved
- Code-graph replayable and unsafe tool sets, classifyCodeIndexFrame, and bridgeStdioThroughSessionProxy in mk-code-index-launcher.cjs
- require.main guard and module.exports on mk-code-index-launcher.cjs so the launcher is importable for tests without spawning the daemon
- launcher-code-index-proxy.vitest.ts covering factory mechanics, code-index classifier, set isolation, and default-classifier regression

### Changed

- Confirmed mk-code-index previously used the raw bridge with no bridge option and ran via an unguarded IIFE
- Wired bridge: bridgeStdioThroughSessionProxy into the lease-holder check in mk-code-index-launcher.cjs
- Ran full launcher suite green (code-index proxy plus session-proxy, watchdog, reap, persistent-log)

### Fixed

- mk-code-index had no reconnect on owner death, surfacing as a hard Connection closed; now fronts its daemon with the same reconnecting session proxy as mk-spec-memory, reattaching and replaying in-flight read queries
- code_graph_verify moved from replayable to the unsafe set after cross-validation found it mutates state on persistBaseline=true

### Verification

- node --check session-proxy + mk-code-index - PASS
- require-time smoke (13 assertions; guard inert) - PASS
- launcher-code-index-proxy.vitest.ts - PASS
- launcher-session-proxy.vitest.ts (default classifier regression) - PASS
- launcher suite (watchdog/reap/persistent-log) - PASS (no regression)
- comment-hygiene (durable WHY, no ids/paths) - PASS
- cross-validation (claude2 + cli-opencode + cli-codex) - cli-opencode found code_graph_verify mutates on persistBaseline=true -> moved from replayable to the UNSAFE set + test updated
- validate.sh --strict (this packet) - PASS

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.opencode/bin/lib/launcher-session-proxy.cjs` | Modified | createClassifyFrame factory; default classifyFrame rebuilt from it (behavior identical); factory exported |
| `.opencode/bin/mk-code-index-launcher.cjs` | Modified | code-graph replayable/unsafe sets + classifyCodeIndexFrame + bridgeStdioThroughSessionProxy; bridge: wired; require.main guard + exports |
| `mcp_server/tests/launcher-code-index-proxy.vitest.ts` | Created | Factory mechanics + code-index classifier + set isolation + default-classifier regression |

### Follow-Ups

- Runtime-unverified this session. The new wiring activates on a fresh launcher, so the transparent reattach is confirmed by unit tests and the shared proxy's existing coverage, not by live observation yet.
- Replay set is conservative. Only known read-only code-graph tools replay; any new code-index tool defaults to non-replayable until explicitly added.
- Inherits the proxy's known gaps. The secondary-index replay caveat documented for mk-spec-memory does not apply to code-graph reads, but any future idempotency gaps in the shared proxy affect both servers.
