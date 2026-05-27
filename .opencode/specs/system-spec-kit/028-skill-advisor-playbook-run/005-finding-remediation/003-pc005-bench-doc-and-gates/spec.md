---
title: "Feature Specification: PC-005 Bench Doc + Gate Calibration (F2)"
description: "Fix the PC-005 bench scenario doc (missing required --dataset) and recalibrate the warm/cold p95 latency gates so they reflect the documented envelope and subprocess scope rather than failing spuriously."
trigger_phrases:
  - "PC-005 bench fix"
  - "F2 bench gate calibration"
  - "skill_advisor_bench dataset flag"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-skill-advisor-playbook-run/005-finding-remediation/003-pc005-bench-doc-and-gates"
    last_updated_at: "2026-05-26T20:40:00Z"
    last_updated_by: "deep-research-remediation"
    recent_action: "Specced F2 bench doc + gate calibration"
    next_safe_action: "Implement via /speckit:implement"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor_bench.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "028-005-003"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: PC-005 Bench Doc + Gate Calibration (F2)

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Planned |
| **Created** | 2026-05-26 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
PC-005 fails two ways that are not a scorer regression (the native scorer bench passes at 3.69/6.71 ms). (1) The scenario doc (`10--python-compat/005-bench-runner.md:33,36`) omits the required `--dataset` flag (`skill_advisor_bench.py:241`). (2) The `--max-warm-p95-ms` default is 20 ms (`skill_advisor_bench.py:246`) — tighter than the documented 50 ms envelope (`feature_catalog/08--python-compat/03-bench-runner.md:21`) and the machine's measured 25.26 ms — and `--max-cold-p95-ms` (60 ms) is applied to a per-prompt subprocess cold-start (876 ms), conflating Python+Node startup with native-scorer latency.

### Purpose
Make PC-005 a meaningful, reproducible bench check: correct invocation + gates that reflect the documented envelope and subprocess scope, keeping `throughput_multiplier` as the real Python-surface regression gate.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Update PC-005 doc to include `--dataset <regression fixture>` + `--runs 1` smoke guidance.
- Recalibrate `--max-warm-p95-ms` to the documented 50 ms envelope; make cold-p95 advisory/opt-in or rename to reflect subprocess scope.
- Keep `stress_test/.../python-bench-runner-stress.vitest.ts` aligned with the chosen contract.

### Out of Scope
- Native TypeScript scorer perf (not regressing).
- Hard-coding a new cold-subprocess budget without host calibration (left as guidance).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-skill-advisor/manual_testing_playbook/10--python-compat/005-bench-runner.md` | Modify | Add `--dataset` + smoke guidance |
| `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor_bench.py` | Modify | Warm p95 default 50 ms; cold p95 advisory/renamed |
| `.opencode/skills/system-skill-advisor/mcp_server/stress_test/skill-advisor/python-bench-runner-stress.vitest.ts` | Modify | Align to chosen gate contract |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | PC-005 doc runs as written | Documented command includes `--dataset` and exits 0 on a clean run |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Gates reflect intent | warm p95 gate = 50 ms envelope; cold p95 advisory or subprocess-scoped; throughput_multiplier stays the regression gate |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The corrected PC-005 documented invocation completes without the `--dataset` error and reports gates that pass on a nominal workstation.
- **SC-002**: The stress vitest and the script agree on the gate contract (no doc/code drift).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Loosening gates hides a real future regression | Missed perf drift | Keep throughput_multiplier strict; document envelope rationale |
| Dependency | Host calibration for cold p95 | Budget unknown | Make cold p95 advisory until calibrated on the intended host |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Is PC-005 a manual smoke test of the Python bench runner, or a stable-host performance certification? The chosen answer sets whether cold p95 is advisory or enforced.
<!-- /ANCHOR:questions -->
