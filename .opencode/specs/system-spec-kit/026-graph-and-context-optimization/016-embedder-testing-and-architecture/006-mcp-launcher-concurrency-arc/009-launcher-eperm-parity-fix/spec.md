---
title: "Launcher EPERM Parity Fix (mk-spec-memory + mk-code-index)"
description: "Propagate skill-advisor's EPERM handling in leaseHeldFromFile to mk-spec-memory and mk-code-index launchers. Closes the -32000 MCP reconnect failure where process.kill(pid, 0) returns EPERM in the Claude/Codex sandbox and the two launchers crash because they only handle ESRCH."
trigger_phrases:
  - "EPERM launcher lease"
  - "mcp reconnect -32000"
  - "launcher EPERM parity"
  - "009 eperm parity"
importance_tier: "useful"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/006-mcp-launcher-concurrency-arc/009-launcher-eperm-parity-fix"
    last_updated_at: "2026-05-18T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Applied EPERM handling to spec-memory + code-index launchers per RCA"
    next_safe_action: "Commit + push on main"
    blockers: []
    key_files:
      - ".opencode/bin/mk-spec-memory-launcher.cjs"
      - ".opencode/bin/mk-code-index-launcher.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000009"
      session_id: "009-launcher-eperm-parity-fix"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Fix approach: mirror skill-advisor's EPERM branch verbatim (RCA confirmed this is the canonical pattern)"
---
# Launcher EPERM Parity Fix

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

The skill-advisor launcher handles `EPERM` from `process.kill(pid, 0)`; the spec-memory + code-index launchers did not. Closing that parity gap fixes the `-32000` MCP reconnect failure.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-05-18 |
| **Branch** | `main` |
| **Parent Arc** | 006-mcp-launcher-concurrency-arc |
| **Predecessor** | 007-skill-advisor-zombie-launcher-fix (shipped the EPERM handler on skill-advisor) |
| **RCA source** | `<arc>/005-cross-cutting-quality/005-cocoindex-install-hygiene/scratch/mcp-disconnect-rca.md` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The Claude/Codex sandbox makes `process.kill(pid, 0)` return `EPERM` rather than success when probing live lease owners owned by other sandbox sessions. `mk-spec-memory-launcher.cjs:137-141` and `mk-code-index-launcher.cjs:171-175` only handle `ESRCH`; `EPERM` propagates as an unhandled throw → launcher exits 1 → no MCP stdio child → Claude reports JSON-RPC `-32000`.

Smoke evidence (per RCA):
```
mk-spec-memory: Error: kill EPERM ... mk-spec-memory-launcher.cjs:137
mk-code-index:  Error: kill EPERM ... mk-code-index-launcher.cjs:171
mk-skill-advisor: LEASE_HELD_BY:7711 ... exit 0
```

The skill-advisor launcher already handles `EPERM` (shipped in 007-skill-advisor-zombie-launcher-fix at `mk-skill-advisor-launcher.cjs:171-180` + `lease.ts:226-254`). The cross-launcher propagation was never done.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### Files to Change

| File | Why | Change |
|------|-----|--------|
| `.opencode/bin/mk-spec-memory-launcher.cjs` | Hosts `leaseHeldFromFile` at line 132 with the ESRCH-only handler | Add `EPERM → held: true` branch mirroring skill-advisor |
| `.opencode/bin/mk-code-index-launcher.cjs` | Same handler shape at line 166 | Same patch |

### Out of Scope

- skill-advisor launcher (already correct)
- Other launcher-parity gaps (artifact freshness asymmetry, etc.) — note in §6 RCA secondary hypotheses
- Stale copied shared dist under `system-code-graph/dist/system-spec-kit/shared/embeddings/` (RCA flagged this as latent; out of this packet's scope)
- New tests — existing vitest suites cover the path; this is a 1-line addition mirroring known-good code
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### REQ-001: EPERM → held: true in both launchers

- **What**: `leaseHeldFromFile()` returns `{held: true, ownerPid: lease.pid, staleReclaimable: false, ...}` when `process.kill(pid, 0)` throws `EPERM`.
- **Acceptance**: source inspection shows `if (error.code === 'EPERM') return { held: true, ... };` in both launchers, byte-equivalent to skill-advisor's pattern.
- **Verification**: `node --check` passes; smoke-running each launcher under a stale lease no longer exits 1 with `Error: kill EPERM`.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node --check .opencode/bin/mk-spec-memory-launcher.cjs` and `node --check .opencode/bin/mk-code-index-launcher.cjs` both exit 0.
- **SC-002**: `grep -n 'EPERM' .opencode/bin/mk-spec-memory-launcher.cjs .opencode/bin/mk-code-index-launcher.cjs` shows the new lines.
- **SC-003**: After daemon restart, `/mcp` no longer reports `-32000` for `mk_code_index` or `mk-spec-memory` (when the lease probe encounters another sandbox's PID).
- **SC-004**: Strict spec validate passes `RESULT: PASSED` (0/0).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Treating EPERM as live lease masks a genuine permission misconfiguration | low | confusing diagnostics | matches skill-advisor pattern that has been live for days without issue |
| `pgrep` / `ps` are also blocked in the Codex sandbox so we cannot independently verify the live-PID assumption | low | only matters for human debugging | the lease file itself carries `pid` + `startedAt`; operator inspection works fine |
| Stale copied dist under `system-code-graph/` still has no `ollama` provider (RCA secondary) | none for this packet | future code paths might hit it | document for follow-on; out of scope here |

**Dependencies**: none. Pure code-level fix.
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None. RCA was clear-cut; fix is mechanical and byte-mirrors skill-advisor.
<!-- /ANCHOR:questions -->
