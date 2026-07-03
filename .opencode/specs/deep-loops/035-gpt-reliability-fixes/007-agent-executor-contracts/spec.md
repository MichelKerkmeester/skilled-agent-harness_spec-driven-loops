---
title: "Spec: Top-Loaded Agent Executor Contracts (P2)"
description: "Phase 007 of packet 035 (implement 034 GPT-reliability fixes). Closes findings F-019, F-020, F-021, F-022, F-039 (effort M). Un-bury the hard contracts in the long agent files (Gate-3 block at line 387 of 817; output template in the final quarter). Position-load the rules a literal executor weights first"
trigger_phrases:
  - "035 phase 007"
  - "agent-executor-contracts"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/035-gpt-reliability-fixes/007-agent-executor-contracts"
    last_updated_at: "2026-07-03T13:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Phase scaffolded from 034 synthesis"
    next_safe_action: "Execute per dependency order; plan.md/tasks.md authored at execution"
    blockers: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "035-007-init"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Spec: Top-Loaded Agent Executor Contracts (P2)

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
| **Predecessor** | [../006-routing-offer/spec.md](../006-routing-offer/spec.md) |
| **Closes findings** | F-019, F-020, F-021, F-022, F-039 |
| **Effort** | M |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Un-bury the hard contracts in the long agent files (Gate-3 block at line 387 of 817; output template in the final quarter). Position-load the rules a literal executor weights first, and codify a GPT-safe authoring profile to prevent recurrence.

Findings closed: F-019, F-020, F-021, F-022, F-039. Full mechanism + evidence in `../../034-gpt-reliability-research/research/findings-registry.md`; the ranked package in `../../034-gpt-reliability-research/research/synthesis.md`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

**In scope:** The sampled agent .md files + siblings; a new authoring-profile reference.

**Out of scope:** Compiling contracts at build time (phase 008).
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **REQ-001**: Add a top-of-file '## EXECUTOR CONTRACT' block (7-10 numbered hard rules) immediately after frontmatter in each agent file (F-019).
- **REQ-002**: Hoist Gate 3 to a Step-0 block in the first 60 lines of the orchestrator agent; move the completion-report template into the early contract block for the research agent (F-020, F-021).
- **REQ-003**: Separate ALWAYS/NEVER/ESCALATE hard rules from narrative prose (machine-readable rules header where it pays) (F-022).
- **REQ-004**: Codify the 7-rule GPT-safe authoring profile as a contract-authoring reference; retrofit order Gate 3 → council → review (F-039).
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

1. each agent file opens with an executor contract; hard rules precede narration
2. authoring profile published

**Acceptance harness (033 behavior-benchmark cells):** Cross-class (Gate-3 inversion, presentation, absorption); measured indirectly. Re-run the affected cells (gpt-fast-med + gpt-fast-high legs) after the change; record primary/secondary cause for any multi-cause cell.
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
