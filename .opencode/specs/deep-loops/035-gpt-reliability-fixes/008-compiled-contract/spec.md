---
title: "Spec: Compiled Per-Command Contract + Setup Loader (P2)"
description: "Phase 008 of packet 035 (implement 034 GPT-reliability fixes). Closes findings F-035, F-036, F-037, F-038, F-009 (effort L). Collapse the 14-file resolution chain (and the 3-way setup authority split) into one self-contained execution contract per command, and move model-side setup parsing into a determi"
trigger_phrases:
  - "035 phase 008"
  - "compiled-contract"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/035-gpt-reliability-fixes/008-compiled-contract"
    last_updated_at: "2026-07-03T13:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Phase scaffolded from 034 synthesis"
    next_safe_action: "Execute per dependency order; plan.md/tasks.md authored at execution"
    blockers: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "035-008-init"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Spec: Compiled Per-Command Contract + Setup Loader (P2)

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
| **Predecessor** | [../007-agent-executor-contracts/spec.md](../007-agent-executor-contracts/spec.md) |
| **Closes findings** | F-035, F-036, F-037, F-038, F-009 |
| **Effort** | L |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Collapse the 14-file resolution chain (and the 3-way setup authority split) into one self-contained execution contract per command, and move model-side setup parsing into a deterministic loader so bad inputs fail before execution.

Findings closed: F-035, F-036, F-037, F-038, F-009. Full mechanism + evidence in `../../034-gpt-reliability-research/research/findings-registry.md`; the ranked package in `../../034-gpt-reliability-research/research/synthesis.md`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

**In scope:** A new build/compile step + generated artifacts; a setup loader; command docs read the compiled artifact.

**Out of scope:** none
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **REQ-001**: Build step that flattens routing + setup + auto-YAML excerpt + bound defaults + boundaries into one compiled contract per command, with checksum drift guards; maintainers keep the layered sources (F-035, F-036, F-009).
- **REQ-002**: Type every external reference at build time (read_contract | render_template | invoke_script | dynamic_target | conditional_fanout | post_loop_save) (F-037).
- **REQ-003**: Deterministic setup loader emits one hydrated execution packet before the model sees the workflow; unresolved placeholders fail early (F-038).
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

1. executors read one compiled contract; drift guard blocks source/compiled divergence
2. unresolved setup fails before model execution

**Acceptance harness (033 behavior-benchmark cells):** Gate-inversion + render + absorbed-step classes together. Re-run the affected cells (gpt-fast-med + gpt-fast-high legs) after the change; record primary/secondary cause for any multi-cause cell.
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
