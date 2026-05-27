---
title: "Implementation Plan: PC-005 Bench Doc + Gate Calibration (F2)"
description: "Add --dataset to the PC-005 doc and recalibrate warm/cold p95 gates to the documented envelope + subprocess scope; keep stress vitest aligned."
trigger_phrases:
  - "F2 plan bench gates"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-skill-advisor-playbook-run/005-finding-remediation/003-pc005-bench-doc-and-gates"
    last_updated_at: "2026-05-26T20:40:00Z"
    last_updated_by: "deep-research-remediation"
    recent_action: "Specced approach"
    next_safe_action: "Implement"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "028-005-003"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: PC-005 Bench Doc + Gate Calibration (F2)

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Python (bench) + Markdown doc + vitest |
| **Framework** | skill_advisor_bench.py |
| **Storage** | regression fixture JSONL |
| **Testing** | manual bench run + python-bench-runner-stress.vitest.ts |

### Overview
Doc-and-threshold change: correct the documented invocation and align the script's default gates to the documented 50 ms warm envelope + subprocess-scoped/advisory cold gate, keeping throughput_multiplier as the regression gate.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Root cause confirmed (research §3 F2)
- [x] Gate semantics + envelope identified

### Definition of Done
- [ ] Doc runs as written (--dataset present)
- [ ] Gates recalibrated + stress vitest aligned
- [ ] A nominal run reports passing/advisory gates
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Documentation + threshold calibration; no scorer change.

### Key Components
- **005-bench-runner.md**: documented invocation
- **skill_advisor_bench.py**: gate defaults (warm/cold p95, throughput)
- **python-bench-runner-stress.vitest.ts**: contract guard

### Data Flow
Doc command → bench script → gates {warm_p95, cold_p95, throughput_multiplier}; recalibrated so warm=50 ms envelope, cold advisory/subprocess-scoped.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `005-bench-runner.md:33,36` | documented invocation | add --dataset + smoke note | command runs |
| `skill_advisor_bench.py:246,247` | gate defaults | warm→50ms; cold advisory/renamed | nominal run gates |
| `python-bench-runner-stress.vitest.ts:93,97` | contract guard | align to chosen gates | vitest passes |

Inventory: confirm no CI invokes the bench with the old 20 ms warm gate as a hard pass condition.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Read bench argparse defaults + the stress vitest contract + feature-catalog envelope
- [ ] Decide cold p95: advisory vs subprocess-scoped budget (open question)

### Phase 2: Core Implementation
- [ ] Update PC-005 doc with --dataset + --runs 1 smoke note
- [ ] Set warm p95 default to 50 ms; make cold p95 advisory or rename to subprocess scope
- [ ] Align python-bench-runner-stress.vitest.ts

### Phase 3: Verification
- [ ] Run the corrected documented command; confirm exit 0 + gate report
- [ ] Run the stress vitest
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Manual | corrected bench invocation | skill_advisor_bench.py |
| Unit | gate contract | python-bench-runner-stress.vitest.ts |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| regression fixture | Internal | Green | dataset for the bench |
| host calibration | External | Yellow | cold p95 budget; mitigate by advisory |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: recalibrated gates pass spuriously or hide a regression.
- **Procedure**: revert the gate defaults in bench.py; doc change is harmless and can stay.
<!-- /ANCHOR:rollback -->
