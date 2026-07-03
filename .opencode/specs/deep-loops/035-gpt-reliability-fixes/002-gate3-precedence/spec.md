---
title: "Spec: Gate-3 Autonomous-Precedence Package (P0)"
description: "Phase 002 of packet 035 (implement 034 GPT-reliability fixes). Closes findings F-001, F-002, F-004, F-005, F-028, F-030, F-040 (effort M). Kill the most replicated GPT failure: the Gate-3 spec-folder halt on autonomous command runs, every mode, both efforts. Land FIRST — the halts otherwise mask the failures the P1 ph"
trigger_phrases:
  - "035 phase 002"
  - "gate3-precedence"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/035-gpt-reliability-fixes/002-gate3-precedence"
    last_updated_at: "2026-07-03T13:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Phase scaffolded from 034 synthesis"
    next_safe_action: "Execute per dependency order; plan.md/tasks.md authored at execution"
    blockers: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "035-002-init"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Spec: Gate-3 Autonomous-Precedence Package (P0)

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
| **Predecessor** | [../001-benchmark-harness-hardening/spec.md](../001-benchmark-harness-hardening/spec.md) |
| **Closes findings** | F-001, F-002, F-004, F-005, F-028, F-030, F-040 |
| **Effort** | M |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Kill the most replicated GPT failure: the Gate-3 spec-folder halt on autonomous command runs, every mode, both efforts. Land FIRST — the halts otherwise mask the failures the P1 phases fix on the same cells. The full design is ready in 034 iter-011 (before/after diffs verified verbatim).

Findings closed: F-001, F-002, F-004, F-005, F-028, F-030, F-040. Full mechanism + evidence in `../../034-gpt-reliability-research/research/findings-registry.md`; the ranked package in `../../034-gpt-reliability-research/research/synthesis.md`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

**In scope:** Root policy file Gate-3 + recovery sections; gate-3-classifier.ts + its tests; a new autonomous-execution-profile reference; the five presentation contracts.

**Out of scope:** Command-flattening (phase 008); injection dedupe (phase 010).
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **REQ-001**: Add the autonomous-precedence bridge to the root policy Gate-3 section: a command declaring autonomous execution with a validly bound spec_folder HAS answered Gate 3; do not emit the generic A-E prompt (F-001, F-005, F-040 deliverable 1).
- **REQ-002**: Extend the classifier to return satisfiedBy ('prebound_spec_folder' | 'prior_answer' | null) and requiresGate3Prompt, with the executionMode/boundSpecFolder/commandContract inputs and the 6 test cases incl. interactive-confirm-still-asks (F-002, F-040 deliverable 2).
- **REQ-003**: Add the 8-rule autonomous execution profile reference and wire command-scoped runs to receive it first; add the read-only/no-questions precedence line (F-028, F-030, F-040 deliverable 3).
- **REQ-004**: State in the presentation contracts that Tier-1 auto-setup resolution satisfies Gate 3, mirrored across all five commands (F-004).
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

1. classifier returns satisfied for autonomous+bound; still asks interactive+unbound (tests green)
2. the five Gate-3 cells stop halting when re-run

**Acceptance harness (033 behavior-benchmark cells):** RVB-008, RSB-008, ACB-004, IMB-004, IMB-005. Re-run the affected cells (gpt-fast-med + gpt-fast-high legs) after the change; record primary/secondary cause for any multi-cause cell.
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
