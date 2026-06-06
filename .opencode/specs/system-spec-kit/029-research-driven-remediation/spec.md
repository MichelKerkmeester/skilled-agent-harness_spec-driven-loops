---
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/029-research-driven-remediation"
    last_updated_at: "2026-06-06T09:40:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Landed 4 research-driven code fixes; builds + targeted tests green"
    next_safe_action: "Recycle mk-spec-memory + reconnect code-graph to activate dists"
    blockers: []
    key_files:
      - "spec.md"
      - "implementation-summary.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Feature Specification: Research-Driven Remediation

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-06 |
| **Updated** | 2026-06-06 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The 028 three-model deep research surfaced concrete code defects in the spec-kit runtime, mixed with exploratory hypotheses. Left unaddressed, the defects cause silent staleness (causal edges not invalidating graph caches), lost dispatch fidelity (MiniMax variant stripped), a latent test blind spot (launcher fixture missing its lib tree), and an unobservable truncation (code-graph blast-radius cut at maxDepth with no signal).

### Purpose

Land only the verified, fixable defects, each verify-first and with build plus targeted tests, while explicitly excluding the measurement experiments that are runs rather than fixes.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Causal link/unlink post-mutation cache invalidation (`mcp_server/handlers/causal-graph.ts`).
- MiniMax `--variant` forwarding (`deep-improvement/scripts/skill-benchmark/live-executor.cjs`).
- Launcher test fixture `lib/` copy (`mcp_server/tests/launcher-ipc-bridge.vitest.ts`).
- Code-graph `depthTruncated` completeness signal (`system-code-graph/.../handlers/query.ts`).

### Out of Scope

- The 028 measurement backlog (q8/fp16 bench, cloud-vs-local A/B, RSS calibration, fan-out diversity, routing calibration). These are research runs, not code fixes.

### Files to Change

- `mcp_server/handlers/causal-graph.ts`
- `deep-improvement/scripts/skill-benchmark/live-executor.cjs`
- `mcp_server/tests/launcher-ipc-bridge.vitest.ts`
- `system-code-graph/mcp_server/handlers/query.ts` (+ its query-handler test)
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

- Each finding is verified against the source before any edit; refuted findings are not "fixed".
- Each fix builds its dist (where applicable) and passes its targeted test suite.

### P1 - Required (complete OR user-approved deferral)

- Two research findings corrected during verification (causal cache class; launcher suite count).
- One verified in-file drift fix (stale relation vocabulary) folded in and disclosed.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- All four fixes committed with green builds + targeted tests.
- No out-of-scope behavioral change ships unverified.
- Measurement experiments left explicitly deferred, not silently dropped.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- Removing the MiniMax variant exception could break dispatches if the model rejected the flag — mitigated by a live acceptance test before editing.
- Rebuilt dists are inert until runtime activation (mk-spec-memory recycle, code-graph reconnect).
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The measurement backlog is tracked in `028-026-program-research/research/research.md`, not here.
<!-- /ANCHOR:questions -->
