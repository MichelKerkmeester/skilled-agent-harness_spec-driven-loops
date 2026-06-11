---
title: "Implementation Plan: IPC Client Cap Hardening and Silent Bridge Skip"
description: "Raise the daemon IPC client cap to 64 (sources, dists, nine config env blocks) and debug-gate the plugin's bridge-skip banner."
trigger_phrases:
  - "ipc cap plan"
  - "max clients 64 plan"
  - "banner suppression plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/026-ipc-client-cap-hardening"
    last_updated_at: "2026-06-11T17:40:00Z"
    last_updated_by: "claude-fable"
    recent_action: "Plan executed in full"
    next_safe_action: "None; complete"
---
# Implementation Plan: IPC Client Cap Hardening and Silent Bridge Skip

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Surfaces** | Shared IPC module + code-graph copy, mk-code-graph plugin, 3 runtime configs, ENV_REFERENCE |
| **Diagnosis** | Fresh Fable 5 xhigh debug seat, empirical (parallel-connection experiment, lsof slot census) |
| **Change kind** | Config + small source constants + one emission gate; no protocol change |
| **Adoption** | New daemon spawns (cap) and new sessions (banner); no live process touched |

### Overview
Two real copies of the socket server exist (spec-kit shared, consumed by spec-memory and advisor via re-export shims, and a code-graph local copy). Both get the default raised to 64 with the durable rationale. The knob is pinned in all nine daemon env blocks so configured environments do not depend on the compiled default. The plugin's single stderr emitter becomes debug-gated.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Root cause proven empirically (1 reply + 9 instant EPIPEs at 10 parallel connections at cap)
- [x] All module copies and shims enumerated (two real copies, two re-export shims)

### Definition of Done
- [x] Sources + dists at 64; knob in all nine env blocks; ENV_REFERENCE updated
- [x] Banner silent by default, debug-gated, status-tool diagnostic intact
- [x] Packet docs complete and strict-validated

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Defense in depth for a shared-resource cap: compiled default (unconfigured environments) plus pinned env knob (configured environments) plus silent graceful degradation at the consumer.

### Key Components
- `shared/ipc/socket-server.ts` — canonical cap; spec-memory and advisor consume via re-export shims
- `system-code-graph/.../ipc/socket-server.ts` — intentional local copy, kept in lockstep
- `plugins/mk-code-graph.js` — `emitRuntimeDiagnostic` debug-gated

### Data Flow
1. Session launcher connects to the shared daemon socket and holds one persistent slot.
2. Short-lived probes (plugin bridge, CLI warm checks) open additional transient connections.
3. With the cap above fleet size, transient connections are served instead of refused; if anything still skips, the plugin no-ops silently.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Fable debug seat dispatched; root cause and falsifiers established

### Phase 2: Core Implementation
- [x] Bump both module copies to 64 with rationale comments; rebuild dists
- [x] Pin the knob in opencode.json, .claude/mcp.json, .codex/config.toml for all three daemons
- [x] Debug-gate the plugin banner emitter

### Phase 3: Verification
- [x] Compiled dists carry 64; nine knob occurrences across configs
- [x] Pre-fix sweep seats show the banner in stderr; post-fix seats clean
- [x] ENV_REFERENCE row updated

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Empirical cap probe | 10 parallel connections at saturation | node socket experiment (debug seat) |
| Grep gates | 64 in sources + dists; knob count across configs | grep |
| Banner before/after | sweep seat stderr files | grep on .err outputs |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Fable 5 debug seat diagnosis | Internal | Green | Fix would be guesswork |
| tsc builds (spec-kit, code-graph) | Internal | Green | Compiled default would lag source |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: unexpected daemon resource pressure from higher concurrency.
- **Procedure**: lower or remove the pinned env knob (config-only, next spawn); revert the two source constants and rebuild if needed. The banner gate is independently revertible.

<!-- /ANCHOR:rollback -->
