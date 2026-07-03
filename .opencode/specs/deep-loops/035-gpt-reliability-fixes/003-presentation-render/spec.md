---
title: "Spec: Verbatim Setup-Render Contract (P1)"
description: "Phase 003 of packet 035 (implement 034 GPT-reliability fixes). Closes findings F-006, F-007, F-042 (effort S). Stop GPT paraphrasing the setup prompt on bare-command halts. The setup block is a referenced asset rendered by convention; make it a copy/fill contract. Design ready in 034 iter-0"
trigger_phrases:
  - "035 phase 003"
  - "presentation-render"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/035-gpt-reliability-fixes/003-presentation-render"
    last_updated_at: "2026-07-03T13:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Phase scaffolded from 034 synthesis"
    next_safe_action: "Execute per dependency order; plan.md/tasks.md authored at execution"
    blockers: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "035-003-init"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Spec: Verbatim Setup-Render Contract (P1)

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
| **Predecessor** | [../002-gate3-precedence/spec.md](../002-gate3-precedence/spec.md) |
| **Closes findings** | F-006, F-007, F-042 |
| **Effort** | S |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Stop GPT paraphrasing the setup prompt on bare-command halts. The setup block is a referenced asset rendered by convention; make it a copy/fill contract. Design ready in 034 iter-013 (boundaries verified).

Findings closed: F-006, F-007, F-042. Full mechanism + evidence in `../../034-gpt-reliability-research/research/findings-registry.md`; the ranked package in `../../034-gpt-reliability-research/research/synthesis.md`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

**In scope:** The five deep command presentation assets + command docs; benchmark presentation-marker assertions.

**Out of scope:** Machine-readable presentation source (deferred, F-009 → phase 008).
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **REQ-001**: Wrap the consolidated setup block in SETUP_PROMPT_START/END markers in each presentation asset (F-007, F-042).
- **REQ-002**: Add 'render only the marked block verbatim; do not paraphrase, summarize, or reorder' + a halt-render rule to the command docs' mode-routing section (F-006, F-042).
- **REQ-003**: Apply the mechanical mirror checklist across all five command surfaces; add benchmark marker assertions in the D2 vocabulary.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

1. marked block renders verbatim on a halt
2. D2 presentation markers assert exact block

**Acceptance harness (033 behavior-benchmark cells):** RVB-002, CXB-002, IMB-003 (D2). Re-run the affected cells (gpt-fast-med + gpt-fast-high legs) after the change; record primary/secondary cause for any multi-cause cell.
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
