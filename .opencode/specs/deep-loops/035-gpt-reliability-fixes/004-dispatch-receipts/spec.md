---
title: "Spec: Unforgeable Dispatch Receipts (P1)"
description: "Phase 004 of packet 035 (implement 034 GPT-reliability fixes). Closes findings F-010, F-011, F-012, F-013, F-041 (effort M). Kill role absorption + forged route proofs at medium effort. The route proof is model-authored and only presence-checked; make it a receipt written by the dispatch mechanism itself"
trigger_phrases:
  - "035 phase 004"
  - "dispatch-receipts"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/035-gpt-reliability-fixes/004-dispatch-receipts"
    last_updated_at: "2026-07-03T13:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Phase scaffolded from 034 synthesis"
    next_safe_action: "Execute per dependency order; plan.md/tasks.md authored at execution"
    blockers: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "035-004-init"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Spec: Unforgeable Dispatch Receipts (P1)

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
| **Predecessor** | [../003-presentation-render/spec.md](../003-presentation-render/spec.md) |
| **Closes findings** | F-010, F-011, F-012, F-013, F-041 |
| **Effort** | M |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Kill role absorption + forged route proofs at medium effort. The route proof is model-authored and only presence-checked; make it a receipt written by the dispatch mechanism itself. Design ready in 034 iter-012 (HMAC schema anchored).

Findings closed: F-010, F-011, F-012, F-013, F-041. Full mechanism + evidence in `../../034-gpt-reliability-research/research/findings-registry.md`; the ranked package in `../../034-gpt-reliability-research/research/synthesis.md`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

**In scope:** executor-audit + post-dispatch-validate; deep_*_auto.yaml dispatch steps + CLI branches; the two LEAF prompt packs.

**Out of scope:** none
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **REQ-001**: Emit a dispatch_receipt JSONL from the dispatch mechanism (native Task or runAuditedExecutorCommand) with a per-dispatch HMAC never exposed to the child; wire state_paths.dispatch_receipts (F-011, F-041).
- **REQ-002**: Validator requires the receipt before the state-log append and compares receipt-derived route fields; demote model-written route fields to advisory (F-012).
- **REQ-003**: Route the auto-YAML CLI branches through the audited executor wrapper so non-native executors also produce receipts (F-013).
- **REQ-004**: Add the interim prompt-pack abort line ('no receipt → stop, write nothing') as a guard while the receipt path is built (F-010).
- **REQ-005**: Migration keeps the Claude-native dispatch path green.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

1. inline work without a receipt is rejected
2. native + audited-CLI dispatch pass
3. Claude-native path unchanged

**Acceptance harness (033 behavior-benchmark cells):** RVB-007, RSB-005, RSB-007 (at medium effort). Re-run the affected cells (gpt-fast-med + gpt-fast-high legs) after the change; record primary/secondary cause for any multi-cause cell.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk / Dependency | Handling |
|---|---|
| Regressing the Claude-native path | Re-run the baseline leg; it must stay green after every change |
| Phase ordering | Depends on the parent dependency order; phase 002 (Gate-3) must land before P1 phases are verified |
| Design drift from the 034 designs | The 034 iter-011/012/013/014 designs are the reference; verify quoted current-text before applying |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Resolved at execution: exact file targets are named in the closed findings + 034 design iterations; plan.md/tasks.md are authored when this phase starts.
<!-- /ANCHOR:questions -->
