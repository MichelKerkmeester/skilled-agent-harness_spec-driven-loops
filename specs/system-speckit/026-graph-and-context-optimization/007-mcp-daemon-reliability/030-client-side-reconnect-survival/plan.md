---
title: "Implementation Plan: Phase 30: Client-Side MCP Reconnect Survival [template:level_1/plan.md]"
description: "Evaluator-first: instrument the frontend transport drop (P0) before building any mitigation, then a measured keepalive (P1), a stdout-hygiene confirm (P2), and an HTTP/SSE transport ROI note (P3)."
trigger_phrases:
  - "client reconnect plan"
  - "mcp keepalive plan"
  - "frontend disconnect instrumentation"
  - "stdio transport survival"
  - "plan core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/007-mcp-daemon-reliability/030-client-side-reconnect-survival"
    last_updated_at: "2026-06-08T15:19:04Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Author plan from client-reconnect investigation"
    next_safe_action: "Implement P0 frontend-teardown logging in the launcher"
    blockers: []
    key_files:
      - ".opencode/bin/mk-spec-memory-launcher.cjs"
      - ".opencode/bin/lib/launcher-session-proxy.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-030-client-side-reconnect-survival"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 30: Client-Side MCP Reconnect Survival

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js (CommonJS `.cjs` launchers) |
| **Framework** | MCP stdio transport (JSON-RPC over stdio) bridging to a unix-socket daemon |
| **Storage** | N/A (transport/lifecycle only) |
| **Testing** | launcher vitest suite + manual disconnect reproduction |

### Overview
Phases 017–029 made the daemon survive session disposal; the residual is the **client↔launcher
stdio link** dropping mid-session with no client-side auto-reconnect. This plan is
**evaluator-first**: P0 instruments the launcher so the *actual* disconnect trigger is captured,
and only then does it pursue the candidate mitigations (keepalive, stdout-hygiene) and the
strategic transport question — none of which should be built on a guessed cause.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (see spec.md)
- [x] Success criteria measurable
- [x] Dependencies identified (daemon survival from 017–029 assumed working)

### Definition of Done
- [ ] P0 instrumentation merged and a real disconnect captured/classified at least once
- [ ] Keepalive shipped flag-gated OR deferred with evidence (not a guess)
- [ ] stdout hygiene confirmed; residual documented operator-facing
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
stdio launcher process (Claude's MCP server) → reconnecting session proxy → unix-socket daemon.

### Key Components
- **launcher (`mk-spec-memory-launcher.cjs` / `mk-code-index-launcher.cjs`)**: Claude's stdio MCP endpoint; owns the frontend pipe.
- **session proxy (`launcher-session-proxy.cjs`)**: queues/replays across launcher↔daemon reconnects (already robust); candidate host for a keepalive emitter.

### Data Flow
Claude ⇄ (stdio JSON-RPC) ⇄ launcher ⇄ (proxy, unix socket) ⇄ daemon. This phase touches only
the leftmost hop — the one the proxy cannot keep alive when Claude's client tears its side down.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase begins as diagnosis (instrumentation) and only mutates transport/logging behavior; all changes are additive and flag-gated where they alter runtime behavior.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| launcher stdin/stdout handlers | own Claude's frontend pipe; currently log no frontend teardown | update (add teardown logging) | reproduce a disconnect; grep launcher log for the new line |
| session proxy | absorbs launcher↔daemon reconnects | update only if P1 keepalive proceeds | flag-off byte-identical; flag-on idle stream survives |
| `writeLeaseHeldDiagnostic` (non-JSON-RPC stdout) | ops diagnostic, separate from `writeLeaseHeldJsonRpcError` | confirm unreachable on serving path; reroute to stderr if not | path trace + grep |

Required inventories:
- stdout writers: `rg -n 'process\.stdout\.write|console\.log' .opencode/bin`.
- Frontend teardown points: `rg -n "process\.stdin|\.on\('end'|\.on\('close'|EPIPE" .opencode/bin/mk-spec-memory-launcher.cjs`.
- Invariant: nothing but valid newline-delimited JSON-RPC frames may ever reach Claude's stdout.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Instrument (P0 — the gate)
- [ ] Add frontend stdin-EOF / stdout-EPIPE / write-error logging (timestamp + pid) to the persistent launcher log
- [ ] Classify the captured trigger (idle-reap vs transport error vs launcher orphan-exit)
- [ ] Do NOT build any mitigation until a real incident is captured

### Phase 2: Mitigate (P1/P2 — only what P0 justifies)
- [ ] IF idle-reap confirmed: flag-gated, default-off keepalive notification emitter
- [ ] Confirm stdout hygiene; reroute `LEASE_HELD_BY:` diagnostic off the serving path if reachable

### Phase 3: Decide & document (P3 + residual)
- [ ] HTTP/SSE transport ROI note (unlocks native auto-reconnect) — go/no-go, not implemented here
- [ ] Document the residual operator-facing (stdio = no auto-reconnect; `/mcp` recovery; zero data loss)
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | keepalive interval emitter / teardown logger (pure predicate) | vitest |
| Integration | launcher serves valid JSON-RPC with keepalive flag on/off | launcher vitest suite |
| Manual | reproduce a real client disconnect; confirm log captures it | Claude Code session + `/mcp` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Daemon survival / re-election (017–029) | Internal | Green | Assumed working; this phase is moot if the daemon doesn't survive |
| Claude Code MCP client semantics | External | Yellow | Caps the achievable fix; harness-owned, not changeable here |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: keepalive notifications destabilize any client, or instrumentation adds overhead/noise.
- **Procedure**: keepalive is flag-gated default-off (flip the flag); instrumentation logging is best-effort and additive, removable by reverting the launcher hunk. No daemon/DB state involved.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
