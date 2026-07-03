---
title: "Spec: Vague-Ask Routing Offer + Boosters (P1)"
description: "Phase 006 of packet 035 (implement 034 GPT-reliability fixes). Closes findings F-023, F-024, F-026 (effort S-M). Convert vague deep-loop-shaped asks from inline answers into routing or an explicit offer. Gate 2 is binary with no sub-threshold path; the phrase inventory misses the natural word"
trigger_phrases:
  - "035 phase 006"
  - "routing-offer"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/035-gpt-reliability-fixes/006-routing-offer"
    last_updated_at: "2026-07-03T13:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Phase scaffolded from 034 synthesis"
    next_safe_action: "Execute per dependency order; plan.md/tasks.md authored at execution"
    blockers: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "035-006-init"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Spec: Vague-Ask Routing Offer + Boosters (P1)

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
| **Predecessor** | [../005-progress-records/spec.md](../005-progress-records/spec.md) |
| **Closes findings** | F-023, F-024, F-026 |
| **Effort** | S-M |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Convert vague deep-loop-shaped asks from inline answers into routing or an explicit offer. Gate 2 is binary with no sub-threshold path; the phrase inventory misses the natural wordings; path tokens misroute.

Findings closed: F-023, F-024, F-026. Full mechanism + evidence in `../../034-gpt-reliability-research/research/findings-registry.md`; the ranked package in `../../034-gpt-reliability-research/research/synthesis.md`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

**In scope:** Gate 2 routing rule in the root policy; skill_advisor.py phrase inventory + deep-signal regex + path-token weighting.

**Out of scope:** none
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **REQ-001**: Add a sub-threshold 'offer the workflow' rule to Gate 2 (below invoke threshold + deep-loop-relevant → offer, don't answer inline) (F-023).
- **REQ-002**: Add noun-gated phrase boosters ('best way to handle', 'make the agent better', 'research how') + extend the deep-signal regex; verify the three vague prompts now route or offer (F-024).
- **REQ-003**: Down-weight path-derived tokens in intent scoring while keeping them as context (F-026).
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

1. the three vague prompts route or produce an explicit offer
2. casual advice questions are not over-routed

**Acceptance harness (033 behavior-benchmark cells):** ACB-003, IMB-003, RSB-004. Re-run the affected cells (gpt-fast-med + gpt-fast-high legs) after the change; record primary/secondary cause for any multi-cause cell.
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
