---
title: "Tasks: Injection Measurement and Rollback Harness"
description: "Completed task record for source-executed injection measurement, Gate-3 wiring verification, and per-phase rollback documentation."
status: "complete"
completion_pct: 100
trigger_phrases:
  - "injection measurement and rollback tasks"
  - "migration receipt tasks"
importance_tier: "high"
contextType: "tasks"
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
      - ".opencode/skills/system-skill-advisor/mcp-server/lib/render.ts"
      - ".opencode/skills/system-skill-advisor/mcp-server/lib/policy-plan.ts"
      - ".opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.mjs"
      - "specs/hooks/002-injection-bloat-reduction/007-guardrail-controls-and-activation/rollback-procedure.md"
    session_dedup:
      fingerprint: "sha256:feeb15b01b2852d7189fe0b8da1ac66094d8f4f6fddb5509b2f454576fe43949"
      session_id: "2026-08-09-injection-measurement-rollback"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Injection Measurement and Rollback Harness

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

- All scoped tasks are complete and evidenced with packet-local artifacts.
- `T-NNN` identifiers will remain stable within this packet.
- Task descriptions name the completed observable check and cite its artifact evidence.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T-001 Recorded the boundary between repository source-executed byte counts and unavailable provider receipts. Evidence: `scripts/measure-injection-footprint.cjs`, `scripts/verify-037-live.cjs` (4 checks passed), and `rollback-procedure.md`.
- [x] T-002 Inventoried the directive, Pi dispatch, headed-first, and headed-repeat measurement cases. Evidence: `scripts/measure-injection-footprint.cjs`, `scripts/verify-037-live.cjs` (4 checks passed), and `rollback-procedure.md`.
- [x] T-003 Implemented the source-executed measurement harness in `scripts/measure-injection-footprint.cjs`. Evidence: `scripts/measure-injection-footprint.cjs`, `scripts/verify-037-live.cjs` (4 checks passed), and `rollback-procedure.md`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T-004 Measured the canonical three-directive block at 763 bytes. Evidence: `scripts/measure-injection-footprint.cjs`, `scripts/verify-037-live.cjs` (4 checks passed), and `rollback-procedure.md`.
- [x] T-005 Measured the Pi dispatch directive at 554 bytes. Evidence: `scripts/measure-injection-footprint.cjs`, `scripts/verify-037-live.cjs` (4 checks passed), and `rollback-procedure.md`.
- [x] T-006 Measured headed-first delivery at 1,364 bytes. Evidence: `scripts/measure-injection-footprint.cjs`, `scripts/verify-037-live.cjs` (4 checks passed), and `rollback-procedure.md`.
- [x] T-007 Measured headed-repeat delivery at 42 bytes. Evidence: `scripts/measure-injection-footprint.cjs`, `scripts/verify-037-live.cjs` (4 checks passed), and `rollback-procedure.md`.
- [x] T-008 Kept provider tokenizer, billing, cache, latency, and retention claims outside the source-byte results. Evidence: `scripts/measure-injection-footprint.cjs`, `scripts/verify-037-live.cjs` (4 checks passed), and `rollback-procedure.md`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T-009 Implemented the Gate-3 wiring verifier in `scripts/verify-037-live.cjs`. Evidence: `scripts/measure-injection-footprint.cjs`, `scripts/verify-037-live.cjs` (4 checks passed), and `rollback-procedure.md`.
- [x] T-010 Verified that `shouldSuppressGate3Delivery` was exported. Evidence: `scripts/measure-injection-footprint.cjs`, `scripts/verify-037-live.cjs` (4 checks passed), and `rollback-procedure.md`.
- [x] T-011 Verified that `shouldSuppressGate3Delivery` was wired into the active Gate-3 path. Evidence: `scripts/measure-injection-footprint.cjs`, `scripts/verify-037-live.cjs` (4 checks passed), and `rollback-procedure.md`.
- [x] T-012 Ran the Gate-3 verifier and recorded four passing checks. Evidence: `scripts/measure-injection-footprint.cjs`, `scripts/verify-037-live.cjs` (4 checks passed), and `rollback-procedure.md`.
- [x] T-013 Inventoried the rollback flag for each phase from 015 through 018. Evidence: `scripts/measure-injection-footprint.cjs`, `scripts/verify-037-live.cjs` (4 checks passed), and `rollback-procedure.md`.
- [x] T-014 Documented the state-clear action for each phase from 015 through 018. Evidence: `scripts/measure-injection-footprint.cjs`, `scripts/verify-037-live.cjs` (4 checks passed), and `rollback-procedure.md`.
- [x] T-015 Documented the confirmation command for each phase from 015 through 018. Evidence: `scripts/measure-injection-footprint.cjs`, `scripts/verify-037-live.cjs` (4 checks passed), and `rollback-procedure.md`.
- [x] T-016 Completed the per-phase rollback table in `rollback-procedure.md`. Evidence: `scripts/measure-injection-footprint.cjs`, `scripts/verify-037-live.cjs` (4 checks passed), and `rollback-procedure.md`.
- [x] T-017 Confirmed that the measurement, verification, and rollback work required no runtime change. Evidence: `scripts/measure-injection-footprint.cjs`, `scripts/verify-037-live.cjs` (4 checks passed), and `rollback-procedure.md`.
- [x] T-018 Reviewed the packet-local artifacts and reconciled the five completion documents. Evidence: `scripts/measure-injection-footprint.cjs`, `scripts/verify-037-live.cjs` (4 checks passed), and `rollback-procedure.md`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- The source-executed harness reported four concrete composition byte counts.
- The Gate-3 verifier passed four export-and-wiring checks without changing runtime output.
- The Gate-3 keep and 037 behavior will be verified from source and applicable tests.
- The rollback procedure recorded the disable flag, state-clear action, and confirmation command for phases 015-018.
- The packet completed without a runtime change.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Requirements and success criteria: `spec.md`.
- Measurement sequence, counter design, and rollback: `plan.md`.
- Source-executed baseline model: `../001-measurement-and-receipts-foundation/` and `specs/hooks/001-per-prompt-injection-audit/research/research.md`.
- Migration research and fallback-rate open question: `../014-injection-surface-deprecation-research/research/research.md`.
- Per-cell rollback contract: `../007-guardrail-controls-and-activation/rollback-procedure.md`.
- Gate-3 live check: `.opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.mjs:343-364,451-467` and `../cli-external-orchestration/037-spec-gate-question-noise/checklist.md`.
<!-- /ANCHOR:cross-refs -->
