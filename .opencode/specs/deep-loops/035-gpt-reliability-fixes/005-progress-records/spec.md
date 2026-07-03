---
title: "Spec: Step-Transition Progress Records (P1)"
description: "Phase 005 of packet 035 (implement 034 GPT-reliability fixes). Closes findings F-015, F-016, F-017, F-018, F-031, F-043 (effort M). Stop the watchdog from killing contract-compliant silence in the structured modes. Protocols license dark windows; require observable progress on real step transitions. Design read"
trigger_phrases:
  - "035 phase 005"
  - "progress-records"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/035-gpt-reliability-fixes/005-progress-records"
    last_updated_at: "2026-07-03T13:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Phase scaffolded from 034 synthesis"
    next_safe_action: "Execute per dependency order; plan.md/tasks.md authored at execution"
    blockers: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "035-005-init"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Spec: Step-Transition Progress Records (P1)

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
| **Predecessor** | [../004-dispatch-receipts/spec.md](../004-dispatch-receipts/spec.md) |
| **Closes findings** | F-015, F-016, F-017, F-018, F-031, F-043 |
| **Effort** | M |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Stop the watchdog from killing contract-compliant silence in the structured modes. Protocols license dark windows; require observable progress on real step transitions. Design ready in 034 iter-014 (additive schema).

Findings closed: F-015, F-016, F-017, F-018, F-031, F-043. Full mechanism + evidence in `../../034-gpt-reliability-research/research/findings-registry.md`; the ranked package in `../../034-gpt-reliability-research/research/synthesis.md`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

**In scope:** council + context auto YAML + loop protocol; the review prompt pack; state_format progress-record addition.

**Out of scope:** Budget/pacing policy (phase 009).
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **REQ-001**: Define one shared additive progress_record JSONL type (old readers ignore it) with step-transition-only semantics; started/completed pairs required for any step expected >60s without another write (F-043).
- **REQ-002**: Council persists each seat stepwise; require per-round liveness records in validation; bound the referee pass (F-015, F-016, F-018).
- **REQ-003**: Context sweep settles as each seat returns, merging survivors after timeout, instead of a full barrier-join (F-017).
- **REQ-004**: Review/improvement emit progress after each sub-step so budget-killed correct work is visible (F-031).
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

1. council/context runs emit mid-run progress; watchdog resets on real transitions only
2. stalled cells still classified as stalls

**Acceptance harness (033 behavior-benchmark cells):** ACB-004, ACB-005, CXB-004; IMB-001-high partial credit. Re-run the affected cells (gpt-fast-med + gpt-fast-high legs) after the change; record primary/secondary cause for any multi-cause cell.
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
