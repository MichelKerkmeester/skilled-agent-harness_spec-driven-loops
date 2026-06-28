---
title: "Feature Specification: review model-benchmark mode hardening"
description: "Run the tri-model hardening review of the model-benchmark mode build and capture findings for remediation."
trigger_phrases:
  - "session 120 121 deep review"
  - "dual-executor deep review"
  - "model-benchmark mode review"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/121-deep-agent-improvement-benchmark-mode/007-review-model-benchmark-mode-hardening"
    last_updated_at: "2026-05-28T17:45:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Review closed; all findings remediated in 121/004 (see report §11)"
    next_safe_action: "None — review + remediation complete"
    blockers: []
    key_files:
      - "review/review-report.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "review-20260528"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: review model-benchmark mode hardening

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-05-28 |
| **Branch** | `main` |
| **Reviews** | `skilled-agent-orchestration/120-cli-opencode-minimax-optimization` + `121-deep-agent-improvement-benchmark-mode` |
| **Executors** | cli-codex `gpt-5.5` (reasoning high, tier fast) + cli-opencode `minimax/MiniMax-M2.7`, alternating odd/even |
| **Phase** | 7 of 19 |
| **Predecessor** | 006-deep-loop-empty-archive-dir |
| **Successor** | 008-add-model-benchmark-lane-selection-prompts |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
This session shipped real, committed code — the deep-agent-improvement `model-benchmark` mode (121/003: `loop-host.cjs`, `dispatch-model.cjs`, a ported 5-dim scorer, mode-aware records) plus the MiniMax provider integration (120: cli-opencode + sk-prompt skill edits). It passed unit tests and alignment checks during the build, but has not had an independent, adversarial, multi-model review for correctness, security, traceability, and maintainability.

### Purpose
Produce a converged `review/review-report.md` (P0/P1/P2 findings + verdict) from a 10-iteration deep-review loop that cross-checks the work with two independent models, so any defects or gaps are surfaced before the work is relied on.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Review the 29-file curated scope: 16 deep-agent-improvement script files (the build), 10 skill-edit files (cli-opencode / sk-prompt / sk-prompt-models MiniMax integration), and 3 key authored docs (121/001 decision-record, 121/002 research.md, 121/003 spec.md)
- Four dimensions: correctness, security, traceability, maintainability
- 10 iterations, alternating executors (odd → gpt-5.5; even → MiniMax M2.7)

### Out of Scope
- The 168 auto-generated spec/iteration artifacts under 120/121 (deep-research/benchmark workflow logs — generated, not authored; reviewing them is noise)
- Fixing any findings (review is READ-ONLY; remediation is a follow-on packet)
- The 120/003 eval-rig original source (reviewed only as the port baseline, not re-audited)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `122-session-120-121-deep-review/review/**` | Create | Loop state + `review-report.md` + findings registry |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Loop runs 10 iterations across both executors | `deep-review-state.jsonl` has 10 `type:iteration` records; executor audit shows ~5 cli-codex + ~5 cli-opencode |
| REQ-002 | Produce a converged review report | `review/review-report.md` exists with verdict, active P0/P1/P2 registry, remediation workstreams |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Each dimension reviewed by BOTH models | dimension coverage shows a gpt-5.5 pass AND a MiniMax pass per dimension |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A verdict (PASS/CONDITIONAL/FAIL) with an adjudicated, deduplicated active-finding registry covering all four dimensions.
- **SC-002**: Findings are attributable to a producing model so the two-model cross-check signal is visible.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | cli-codex gpt-5.5 + cli-opencode MiniMax M2.7 | High — no run without both | Both confirmed usable earlier this session (120/002 codex, 121/002 minimax) |
| Risk | MiniMax less reliable at the 3-artifact contract (5/7 in 121/002) | Med | post_dispatch_validate + 3-fail stuck-recovery; surface misses, don't silently drop |
| Risk | Review target spans two packets + many file types | Med | Curated 29-file scope; auto-generated artifacts explicitly excluded |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Will the two models agree on severities, or surface different finding classes? (Either is useful cross-check signal.)
- Does the review confirm the build is sound, or surface P0/P1 defects needing a remediation packet?
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->


<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-003
REQ-004
REQ-005
REQ-006
REQ-007
REQ-008
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
