---
title: "Spec: Resumable Runs, Pacing, and Budget Policy (P2)"
description: "Phase 009 of packet 035 (implement 034 GPT-reliability fixes). Closes findings F-032, F-033, F-034 (effort L). Fix budget-edge deaths on the heaviest command: it does init + up to 5 loops + synthesis in one uncheckpointable invocation. Make it resumable, cache repeated prep, and add a pacin"
trigger_phrases:
  - "035 phase 009"
  - "pacing-and-resume"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/035-gpt-reliability-fixes/009-pacing-and-resume"
    last_updated_at: "2026-07-03T13:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Phase scaffolded from 034 synthesis"
    next_safe_action: "Execute per dependency order; plan.md/tasks.md authored at execution"
    blockers: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "035-009-init"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Spec: Resumable Runs, Pacing, and Budget Policy (P2)

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
| **Predecessor** | [../008-compiled-contract/spec.md](../008-compiled-contract/spec.md) |
| **Closes findings** | F-032, F-033, F-034 |
| **Effort** | L |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Fix budget-edge deaths on the heaviest command: it does init + up to 5 loops + synthesis in one uncheckpointable invocation. Make it resumable, cache repeated prep, and add a pacing contract + a conditional budget policy.

Findings closed: F-032, F-033, F-034. Full mechanism + evidence in `../../034-gpt-reliability-research/research/findings-registry.md`; the ranked package in `../../034-gpt-reliability-research/research/synthesis.md`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

**In scope:** improvement auto YAML + SKILL lineage; per-iteration caching; prompt-pack pacing lines; budget/watchdog policy.

**Out of scope:** Progress-record schema (phase 005, dependency).
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **REQ-001**: Split the heaviest command into resumable sub-invocations (setup / work --one-iteration / synthesize) sharing session id + ledger (F-032).
- **REQ-002**: Cache integration scan/profile unless target/manifest changes; materialize benchmarks once; defer repeatability analysis to synthesis (F-033).
- **REQ-003**: Add a GPT pacing contract (first-artifact deadline, budget-fraction checkpoints, pre-cap finalizer) + a conditional budget policy that extends only visible-progress runs, never stalls (F-034).
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

1. improvement resumes across sub-invocations
2. IMB-001-high completes naturally under cap
3. budget bumps only on visible progress

**Acceptance harness (033 behavior-benchmark cells):** IMB-001-high natural completion. Re-run the affected cells (gpt-fast-med + gpt-fast-high legs) after the change; record primary/secondary cause for any multi-cause cell.
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
