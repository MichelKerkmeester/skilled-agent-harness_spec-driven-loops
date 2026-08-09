---
title: "Spec: Injection Measurement and Rollback Harness"
description: "Completed source-executed injection measurement, Gate-3 wiring verification, and per-phase rollback documentation without changing runtime emission."
status: "complete"
completion_pct: 100
trigger_phrases:
  - "injection measurement and rollback"
  - "fallback emission rate"
  - "migration byte receipts"
  - "Gate-3 suppression verification"
importance_tier: "high"
contextType: "spec"
parent: "hooks/002-injection-bloat-reduction"
predecessor: "001-per-prompt-injection-audit"
_memory:
  continuity:
    packet_pointer: "hooks/002-injection-bloat-reduction/019-injection-measurement-and-rollback"
    last_updated_at: "2026-08-09T14:53:04Z"
    last_updated_by: "sol"
    recent_action: "Added measurement, Gate-3, and rollback tooling"
    next_safe_action: "None; packet complete"
    blockers: []
    key_files:
      - "specs/hooks/001-per-prompt-injection-audit/research/research.md"
      - "specs/hooks/002-injection-bloat-reduction/014-injection-surface-deprecation-research/research/research.md"
      - "specs/hooks/002-injection-bloat-reduction/007-guardrail-controls-and-activation/rollback-procedure.md"
      - ".opencode/skills/system-skill-advisor/mcp-server/lib/render.ts"
      - ".opencode/skills/system-skill-advisor/mcp-server/lib/policy-plan.ts"
      - ".opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.mjs"
    session_dedup:
      fingerprint: "sha256:e99b95096254b501a8337ed6ee47be9786f47a2dd26aebffc6b74aa707e1b684"
      session_id: "2026-08-09-injection-measurement-rollback"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Spec: Injection Measurement and Rollback Harness

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Spec Folder** | 019-injection-measurement-and-rollback |
| **Status** | Complete |
| **Created** | 2026-08-09 |
| **Level** | 2 |
| **Predecessor** | 001-per-prompt-injection-audit |
| **Successor** | None |
| **Priority** | P1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The completed migration phases needed reproducible source-level injection measurements, a direct check that the Gate-3 suppression helper remained exported and wired, and a concrete rollback reference for phases 015-018.

The phase provided those artifacts without modifying runtime behavior. Provider tokenizer, billing, cache, latency, and retention measurements remained outside the repository evidence boundary.

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

In scope: `scripts/measure-injection-footprint.cjs`, `scripts/verify-037-live.cjs`, and `rollback-procedure.md`. The measurement script executed source composition paths; the verifier checked the `shouldSuppressGate3Delivery` export and wiring; the rollback document named the disable flag, state-clear action, and confirmation command for each phase from 015 through 018.

Out of scope: runtime changes, fallback-frequency instrumentation, candidate activation, provider token or billing claims, and generated metadata changes.

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **REQ-001 [P0]** Source execution had to report the three-directive, Pi dispatch, headed-first, and headed-repeat byte counts.
- **REQ-002 [P0]** The Gate-3 verifier had to confirm that `shouldSuppressGate3Delivery` was exported and wired.
- **REQ-003 [P0]** Rollback guidance had to cover every phase from 015 through 018.
- **REQ-004 [P1]** Each rollback entry had to name the disable flag, state-clear action, and confirmation command.
- **REQ-005 [P0]** The phase had to avoid runtime behavior changes.
- **REQ-006 [P1]** Repository byte results had to remain distinct from provider tokenizer, billing, cache, latency, and retention claims.
- **REQ-007 [P1]** The five completion documents had to cite only supplied artifacts and results.
- **REQ-008 [P1]** The verifier remained responsible for generated metadata.

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001** `measure-injection-footprint.cjs` reports 763 B for the three directives, 554 B for Pi dispatch, 1,364 B for headed-first, and 42 B for headed-repeat.
- **SC-002** `verify-037-live.cjs` passes four export-and-wiring checks.
- **SC-003** `rollback-procedure.md` covers phases 015-018 with a flag, state-clear action, and confirmation command for each.
- **SC-004** No runtime change is made.
- **SC-005** Provider-level metrics are not inferred from repository byte counts.

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Measurement overreach.** Source-executed byte counts do not prove provider tokenization, billing, cache, latency, or retention behavior.
- **Wiring drift.** The four-check verifier directly guards the exported and connected Gate-3 suppression helper.
- **Rollback ambiguity.** The phase-local rollback table names the exact operator action for each completed phase.
- **Dependencies.** The scripts depend on the repository's existing source composition and Gate-3 module layout.

<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

Live fallback frequency remains unmeasured because this phase did not add runtime instrumentation. Provider-level token and billing results also remain unknown.

<!-- /ANCHOR:questions -->
