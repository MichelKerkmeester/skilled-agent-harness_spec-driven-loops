---
title: "Spec: Dispatch Receipts and Progress Records"
description: "Phase 004 of packet 035 (unified command-contract architecture). Two dispatch-integrity contracts referenced by the phase-003 compiled contract: engine-held HMAC dispatch receipts (the key never leaves the engine process — plan-review GAP-23 blocker) and step-transition progress records with a work-anchored schema. Closes F-010/011/012/013/041 (receipts) and F-015/016/017/031/043 (progress). Absorbs GAP-13/15/23/24/25/26/27/28/29/30/31/32/34/35/36."
trigger_phrases:
  - "035 phase 004"
  - "dispatch receipts progress records"
  - "hmac dispatch receipt"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/035-gpt-reliability-fixes/004-dispatch-receipts-and-progress"
    last_updated_at: "2026-07-03T16:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored: dispatch receipts + progress"
    next_safe_action: "Execute after 003; author the receipt + progress contracts the compiled contract references"
    blockers: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "035-004-restructure"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Spec: Dispatch Receipts and Progress Records

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-03 |
| **Parent Packet** | ../ (035-gpt-reliability-fixes) |
| **Parent Spec** | ../spec.md |
| **Predecessor** | [../003-command-contract-compiler/spec.md](../003-command-contract-compiler/spec.md) |
| **Successor** | [../005-retrofit-pacing-and-rollout-completion/spec.md](../005-retrofit-pacing-and-rollout-completion/spec.md) |
| **Closes findings** | F-010, F-011, F-012, F-013, F-015, F-016, F-017, F-031, F-041, F-043 |
| **Effort** | L |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Two dispatch-integrity mechanisms the compiled contract references. Receipts: GPT executors absorb LEAF roles and fabricate route proofs, so dispatches need an unforgeable receipt — but the 034 design leaked the HMAC key into the command string where any process can read it (GAP-23 blocker), and the wrapper it depends on isn't wired into any command. Progress: structured modes go dark for minutes and the watchdog kills compliant work, so real step transitions need lightweight liveness records — but the design's safety rule (a reducer allowlist) was never made a requirement, and nothing stops no-op heartbeats.

Findings closed: F-010, F-011, F-012, F-013, F-041 (receipts); F-015, F-016, F-017, F-031, F-043 (progress). Absorbs GAP-13, GAP-15, GAP-23, GAP-24, GAP-25, GAP-26, GAP-27, GAP-28, GAP-29, GAP-30, GAP-31, GAP-32, GAP-34, GAP-35, GAP-36. F-018 (council convergence rule) is NOT here — it moves to phase 005 (GAP-33).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

**In scope:** `executor-audit` + `post-dispatch-validate.ts`; the `deep_*_auto.yaml` dispatch steps + CLI branches (copilot/claude-code/opencode × review/research/context/ai-council); the LEAF prompt packs; the council/context liveness records; the shared `progress_record` JSONL type. Both mechanisms are referenced by the phase-003 compiled contract.

**Out of scope:** the council two-of-three convergence rule (F-018 → phase 005); the pacing/budget policy (F-032/033/034 → phase 005).
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **REQ-001**: The HMAC key stays in the engine process — computed engine-side from pre-dispatch facts, never interpolated into any `command:` template; the audited wrapper RETURNS post-dispatch facts (child pid/exit/sessionId) for the engine to countersign (F-041, GAP-23 blocker). Key derived from a run-master secret + dispatchId so receipts are re-verifiable on resume without persisting per-dispatch keys (GAP-28, GAP-13).
- **REQ-002**: Split the receipt into a pre-dispatch INTENT record (engine-signed, no child id) and a post-dispatch COMPLETION countersign written after the dispatch returns the real child id; the validator binds the two (F-010/011/012, GAP-25). Receipts written to a parent-owned, child-unwritable path; atomic write with a distinct `dispatch_receipt_write_failed` class ≠ `missing` (GAP-26, GAP-29).
- **REQ-003**: Route the auto-YAML CLI branches through the audited wrapper — scoped per-branch × per-YAML ({copilot, claude-code, opencode} × {review, research, context, ai-council}) with a regression cell per branch (F-013, GAP-24).
- **REQ-004**: Migrate route-proof: enumerate every `assert_jsonl_fields` + reader of `target_agent`/`resolved_route`/`agent_definition_loaded`, remove them from required lists across all 4 YAMLs, and repoint the validator to receipt-derived values (F-012, GAP-27). A dispatch omitting the model-written fields passes when a valid receipt exists.
- **REQ-005**: One shared additive `progress_record` JSONL type with step-transition-only semantics; started/completed pairs required for any step expected >T without another write, where T is derived from the watchdog window (GAP-34). A work-anchored field (`progress_delta` / `artifact_path`) the validator cross-checks so a zero-delta no-op pair is rejected (GAP-35, F-043).
- **REQ-006**: The reducer safety allowlist is a REQ: every completion reducer uses an explicit allowlist and ignores `type:'progress'` for completion math; a test feeds a reducer only progress lines and asserts null completion (GAP-30). Council persists each seat stepwise via a named writer (incremental flag or `seat_dir/*.json` contract) + per-seat contract test (F-015/016, GAP-32); in-CLI council breaks STEP 2 into per-seat sub-steps or documents watchdog-only bounding (GAP-36). Context sweep settles per seat (F-017).
- **REQ-007**: Review/improvement emit progress after each sub-step; scope the improvement leg consistently with phase 005's pacing (F-031, GAP-31 — IMB-001-high partial credit is earned here, natural completion in 005).
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

1. The HMAC key never appears in any command string or child-readable file (asserted); a forged receipt is rejected; receipts re-verify on resume.
2. Every CLI branch routes through the wrapper with a passing regression cell; route-proof migration leaves no YAML requiring the demoted fields.
3. Progress records are step-anchored (zero-delta pairs rejected); the reducer allowlist test passes; council persists per seat.

**Acceptance harness (033 cells):** RVB-007, RSB-005, RSB-007 (absorption, med), ACB-004-high, ACB-005, CXB-004 (stall→liveness); IMB-001-high partial credit. N≥3 for the contested stalls. Ship behind the phase-001 feature flag.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk / Dependency | Handling |
|---|---|
| GAP-23 (blocker) — key leaks via command string | Key stays engine-side; wrapper returns facts to countersign |
| GAP-24 — wrapper unreachable (12-branch migration) | REQ-003 per-branch × per-YAML with a cell each |
| GAP-27 — route-field demotion breaks 4 YAMLs | REQ-004 enumerates every consumer |
| GAP-28 — key lifecycle on resume | Derived key (run-master + dispatchId), non-persisted |
| GAP-35 — no-op heartbeats mask stalls | Work-anchored schema field, validator-checked |
| GAP-30 — reducer allowlist not enforced | REQ-006 makes it a requirement + test |
| Depends on 003 contract refs | Receipt + progress contracts are referenced by the compiled contract |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- The exact progress threshold T and the run-master secret storage are resolved at execution against the watchdog window and the sealed-store options.
<!-- /ANCHOR:questions -->
