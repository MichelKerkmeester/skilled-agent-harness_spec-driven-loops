---
title: "Feature Specification: FIX-5 Decision Checkpoint"
description: "Apply research/research.md's cross-validated (6/6 lineages) negative gate against phase 012's benchmark results to decide whether phase 006 (host hard identity / FIX-5) stays permanently parked or gets unparked. This phase does not implement FIX-5 itself — it only evaluates the gate and updates 006's decision-record.md accordingly."
trigger_phrases:
  - "fix5 checkpoint"
  - "fix5 unpark decision"
  - "host hard identity gate"
importance_tier: "high"
contextType: "implementation"
predecessor_research: "../007-gpt-behavioral-hardening-research/research/research.md"
_memory:
  continuity:
    packet_pointer: "deep-loops/031-deep-loop-gpt-reliability/002-routing-dispatch-and-identity/009-fix5-checkpoint"
    last_updated_at: "2026-07-01T17:15:00Z"
    last_updated_by: "claude-code"
    recent_action: "Gate applied against phase 012's results; FIX-5 closed"
    next_safe_action: "None -- packet complete"
    blockers: []
    key_files:
      - "../007-gpt-behavioral-hardening-research/research/research.md"
      - "../006-host-hard-identity-fix5/decision-record.md"
      - "../012-gpt-claude-benchmark/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "031-013-init"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The gate criterion itself is already settled by research (very high confidence, 6/6 cross-model): unpark only if, after cheaper fixes land and the benchmark runs, GPT still shows semantic wrong-mode artifacts, a route-proof mismatch, or disproportionate stuck/latency failures on any mode while Claude passes."
      - "Gate applied against phase 012's real results: zero semantic wrong-mode artifacts, zero route-proof mismatches. 2 timeout_latency cells observed but neither confirmed genuinely stuck, and FIX-5 would not remedy raw model-inference latency regardless. Outcome: CLOSE. See ../006-host-hard-identity-fix5/decision-record.md Final Resolution."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: FIX-5 Decision Checkpoint

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 (conditional — not actionable until phase 012 completes) |
| **Status** | Complete — FIX-5 closed |
| **Created** | 2026-07-01 |
| **Parent Packet** | `031-deep-loop-issues-with-gpt-opencode` |
| **Predecessor** | `../012-gpt-claude-benchmark/` |
| **Successor** | None — this is the final phase in the current chain. If triggered, its output is an updated `../006-host-hard-identity-fix5/decision-record.md`, which would then need its own follow-on implementation phase. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Phase 006 parked FIX-5 (host hard identity / process-isolation) behind a trigger defined before this packet's follow-up research existed. Research/research.md (§1, §3, both rounds, all 6 lineages) independently re-derived and sharpened that same trigger with much higher confidence than 006's original wording, converging via 3 non-GPT-biased lineages (`glm-max`, `sonnet-critical`, `opus-critical`) plus GPT's own self-critical agreement (`gpt-critical`) — a stronger evidentiary basis than 006 had when it was written.

### Purpose

Once phase 012 produces real benchmark results, apply research's sharpened negative gate against them and update `../006-host-hard-identity-fix5/decision-record.md` with the outcome: either close 006 permanently ("agent-layer fix sufficient") or unpark it with the specific evidence that triggered the unpark. This phase does no FIX-5 implementation work itself.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Read phase 012's benchmark results.
- Apply the gate: does GPT, on any mode, show a semantic wrong-mode artifact, a route-proof mismatch, or disproportionate stuck/latency failures, while Claude passes the same mode?
- Update `../006-host-hard-identity-fix5/decision-record.md` with the evaluation outcome and the specific evidence (or absence of evidence) that decided it.
- If triggered: do NOT implement FIX-5 in this phase — flag that a new follow-on implementation phase is needed, and stop.
- If not triggered: close 006 as "agent-layer fix sufficient," per 006's own already-documented alternative.

### Out of Scope

- Any FIX-5 implementation work (host hard identity, process isolation) — deferred to a new phase if this checkpoint triggers it.
- Re-running or redesigning phase 012's benchmark — this phase consumes its results, it doesn't re-derive them.

### Files Likely to Change

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `../006-host-hard-identity-fix5/decision-record.md` | Modify | Record the gate evaluation outcome |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Gate applied against real results only | This phase's evaluation never runs against speculative or partial phase-012 output — only completed benchmark results. |
| REQ-002 | Outcome recorded in 006, not just here | `../006-host-hard-identity-fix5/decision-record.md` is updated with the specific outcome and evidence, since that's the packet's canonical FIX-5 decision record. |
| REQ-003 | No FIX-5 implementation smuggled into this phase | If the gate triggers, this phase stops at "unpark, needs a new phase" rather than starting host-identity implementation work under this phase's scope. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `../006-host-hard-identity-fix5/decision-record.md` reflects a clear, evidence-backed final outcome (closed or unparked) after this phase runs.
- **SC-002**: `validate.sh --strict` passes for this phase folder once this evaluation is recorded.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 012 benchmark results | This phase cannot run at all without them | Hard sequencing; do not evaluate early |
| Risk | Ambiguous benchmark results (e.g., GPT fails on one mode but the failure is a known, already-fixed Mode-D case) | Gate misapplied, wrong unpark/close decision | Cross-check against phase 012's own failure-classification schema before applying the gate — a `phase0_self_check` failure should not, by itself, trigger unpark, since FIX-5 doesn't fix that class of failure either (research.md §1) |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None — the gate criterion itself is settled (frontmatter `answered_questions`). The only open item is phase 012's not-yet-existing results.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Research (gate criterion)**: `../007-gpt-behavioral-hardening-research/research/research.md` §1, §3 (FIX-5 unpark decision row)
- **FIX-5 decision record (to be updated)**: `../006-host-hard-identity-fix5/decision-record.md`
- **Predecessor (produces the evidence this phase evaluates)**: `../012-gpt-claude-benchmark/`
- **Parent Spec**: `../spec.md`
