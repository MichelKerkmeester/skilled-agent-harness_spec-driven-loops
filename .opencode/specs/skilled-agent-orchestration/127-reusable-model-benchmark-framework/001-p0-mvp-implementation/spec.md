---
title: "Feature Specification: P0 MVP — reusable config-driven benchmark framework (deep-improvement)"
description: "Implement the P0 MVP from the 127 research: additive profile schema + validator, a machine-readable framework registry + slot renderer, a new sweep matrix-expander, a correctness-GATE scoring adapter, a couple of T3/T4 fixtures, and a trustworthiness reporter (WINNER/TIE/INCONCLUSIVE) — built as ADDITIVE new files orchestrating the existing (unmodified) Lane B pieces so the 56 existing vitest tests stay green."
trigger_phrases:
  - "p0 mvp benchmark framework"
  - "sweep-benchmark.cjs"
  - "framework registry slot renderer"
  - "correctness gate reporter"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/127-reusable-model-benchmark-framework/001-p0-mvp-implementation"
    last_updated_at: "2026-06-02T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "P0 MVP built + verified (vitest 106); additive, Lane B untouched"
    next_safe_action: "Plan P1 from ../research roadmap (stats.cjs, dispatch envelope, loop-host hook, tiered fixtures)"
    blockers: []
    key_files:
      - ".opencode/skills/deep-improvement/scripts/model-benchmark/sweep-benchmark.cjs"
      - ".opencode/skills/deep-improvement/scripts/model-benchmark/lib/correctness-gate.cjs"
      - ".opencode/skills/sk-prompt/assets/framework-registry.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-127-001-impl"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: P0 MVP — reusable config-driven benchmark framework

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-02 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Predecessor** | ../research (the design + P0/P1/P2 roadmap) |
| **Handoff Criteria** | One profile runs `framework-bakeoff` OR `model-vs-model` by config only; correctness gates eligibility; the report emits WINNER/TIE/INCONCLUSIVE + saturation BEFORE any leaderboard; the existing 56 Lane B vitest tests stay green |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 127 research designed a reusable, config-driven benchmark framework but it is unbuilt. The one-off rigs (`120/003`, `126/004`) still require new code per model/situation, and `126/004` exposed correctness-saturation producing misleading "winners."

### Purpose
Build the P0 MVP per `../research/research.md` §11 and `../research/deltas/deltas.jsonl` (P0 deltas): make `framework-bakeoff` + `model-vs-model` a CONFIG (not new rig code), and make saturated correctness un-misreadable. **Critical safety property (research §3):** all new keys/files are additive and ignored by the legacy `run-benchmark.cjs` until the new sweep runner consumes them — so Lane B agent-improvement benchmarks and the 56 existing tests stay untouched.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope (P0 MVP — additive)
- **Framework registry + slot renderer**: `sk-prompt/assets/framework-registry.json` (RCAF/RACE/CIDI/TIDD-EC/COSTAR as data: id/description/applies_to/template/slots/output_contract) + `lib/framework-renderer.cjs` (slot interpolation + required-slot validation).
- **Profile schema + validator**: additive keys (`mode`, `models[]`, `frameworks[]`, `variants[]`, `fixtureSelection`, `scoring{dimensions,correctnessGate}`, `sampling`, `reporting`) + `lib/profile-validator.cjs` (dependency-free enum/required-key/weights-sum validation).
- **Sweep matrix-expander**: new `sweep-benchmark.cjs` — expands `models × executors × variants × frameworks × fixtures × samples` with no mode-specific branches; dispatches each cell via the existing `dispatch-model.cjs` (mock-capable); scores via the existing scorer.
- **Correctness GATE adapter**: `lib/correctness-gate.cjs` — gate eligibility on `pass_rate ≥ threshold` (default 1.0), then rank survivors on efficiency/format/reasoning; correctness never folded into the ranking once saturated.
- **Minimal stats**: `lib/sweep-stats.cjs` — `mean/median/mad/quantile/seededRandom` + a trustworthiness verdict helper (enough for WINNER/TIE/INCONCLUSIVE).
- **Reporter**: `lib/sweep-reporter.cjs` — `aggregate.json` (per groupBy: n/mean/median/saturation/top-pair-delta/verdict) + `synthesis.md` with the trust verdict + saturation table BEFORE the leaderboard.
- **T3/T4 fixtures**: a couple of harder code-task fixtures with hidden deterministic oracles; demote the artifact fixtures to T1 smoke.
- **Example profiles**: `benchmark-profiles/{framework-bakeoff.json, model-vs-model.json}` proving config-only mode switch.
- **One guarded edit**: `shared/loop-host.cjs` calls `sweep-benchmark.cjs` only when `mode` is set; legacy path unchanged.
- **Tests**: vitest for renderer, validator, stats, gate, sweep expansion, and the acceptance test (both modes from config + saturation cannot win).

### Out of Scope (P1/P2 — deferred)
- Full `stats.cjs` (paired bootstrap CI / noise-floor gating), normalized dispatch envelope + OpenCode JSON usage parsing, `model-profiles.json` capability-field promotion, mutation/hill-climb, profile inheritance, per-executor cost parsers, capability-radar reducers, the long-context/agentic fixture categories.

### Files to Change

| File Path | Change | Note |
|-----------|--------|------|
| `sk-prompt/assets/framework-registry.json` | Create | 7-framework registry (data) |
| `deep-improvement/scripts/model-benchmark/lib/{framework-renderer,profile-validator,sweep-stats,correctness-gate,sweep-reporter}.cjs` | Create | New modules |
| `deep-improvement/scripts/model-benchmark/sweep-benchmark.cjs` | Create | Matrix expander entry |
| `deep-improvement/assets/model-benchmark/benchmark-profiles/{framework-bakeoff,model-vs-model}.json` | Create | Example profiles |
| `deep-improvement/assets/model-benchmark/benchmark-fixtures/t3-*.json` | Create | T3/T4 fixtures |
| `deep-improvement/scripts/model-benchmark/tests/sweep-*.vitest.ts` | Create | New tests |
| `deep-improvement/scripts/shared/loop-host.cjs` | Modify (guarded) | Call sweep when `mode` set; legacy path unchanged |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Config-only mode switch | A `framework-bakeoff` profile and a `model-vs-model` profile both run through one `sweep-benchmark.cjs` with NO mode-specific code branches |
| REQ-002 | Correctness as a GATE | When every cell passes correctness, the reporter does NOT crown a correctness winner; ranking falls to survivors on efficiency/format |
| REQ-003 | Trustworthiness verdict | `aggregate.json` + `synthesis.md` emit WINNER/TIE/INCONCLUSIVE (with reason) BEFORE any leaderboard text |
| REQ-004 | No Lane B regression | The existing 56 model-benchmark vitest tests stay green; legacy `run-benchmark.cjs` / `default.json` path unchanged |
| REQ-005 | Data-driven frameworks | Adding a framework is a registry entry (no code); the slot renderer validates required slots |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Saturation surfaced | The reporter flags fixtures where cells saturate at 100% and recommends keep/promote/smoke/retire |
| REQ-007 | Mock-driven tests | The sweep + reporter are unit-tested deterministically via `dispatch-model.cjs` mock mode (no real CLI calls in tests) |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `npx vitest run model-benchmark/tests/` passes — existing 56 + new sweep tests, all green.
- **SC-002**: A demo run of each example profile (mock dispatch) produces an `aggregate.json` whose verdict is `TIE`/`INCONCLUSIVE` when fixtures saturate (never a spurious WINNER).
- **SC-003**: `node --check` passes on every new `.cjs`; all new JSON is `jq`-valid.
- **SC-004**: `validate.sh --strict` on this folder passes.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Breaking Lane B's 56 tests | High | Additive new files; the only existing-file edit (loop-host) is guarded on `mode`; re-run the 56 tests after |
| Risk | Comment-hygiene violation in new .cjs | Med | Durable WHY only; no spec paths / phase ids / finding ids in code comments |
| Risk | Scope sprawl into P1/P2 | Med | Strict P0 boundary above; stats is minimal-for-verdict only |
| Dependency | existing `dispatch-model.cjs` mock mode | Low | Tests use mock; no real CLI calls |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should the sweep wire into `loop-host.cjs` behind a guarded `mode` hook, or stay a standalone runner? (Deferred to P1; standalone kept the MVP 100% additive.)
- Does the minimal verdict need a full paired-bootstrap CI before it is trusted on narrow margins? (P1 stats work decides the noise-floor model.)
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-001 | Dependency-free | New modules use only Node stdlib (no new npm deps) |
| NFR-002 | Backward compatible | `mode` unset = today's Lane B behavior, byte-for-byte |
| NFR-003 | Deterministic tests | Seeded; mock dispatch; no network |
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- **All cells saturate** → verdict INCONCLUSIVE/TIE, never WINNER (the core acceptance).
- **Single sample** → verdict cannot be WINNER (insufficient_n) unless margin trivially clears with the minimal stat; default sampling N=1 yields TIE/INCONCLUSIVE.
- **Missing required slot in a framework template** → renderer throws a clear validation error (caught at validate-time, not dispatch-time).
- **Unknown executor/scorer/mode in profile** → validator rejects before any dispatch.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

Moderate-to-high: ~8 new files (~600-900 LOC) + tests, orchestrating existing Lane B modules. De-risked by the additive design (no rewrites), mock-driven deterministic tests, and the 56-test regression guard. Built in 3 verified stages: (1) config/registry/fixtures/stats, (2) sweep + gate, (3) reporter + acceptance.
<!-- /ANCHOR:complexity -->
