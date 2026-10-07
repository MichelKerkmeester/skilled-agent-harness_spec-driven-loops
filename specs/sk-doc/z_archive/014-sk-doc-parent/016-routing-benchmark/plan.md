---
title: "Implementation Plan: Phase 016 — Hub routing benchmark + cross-hub parity gate"
description: "Reconstructed Level 1 implementation plan for the routing benchmark and parity gate phase. It restates the spec.md problem, scope and success criteria; the original plan was never written."
trigger_phrases:
  - "sk-doc routing benchmark plan"
  - "cross-hub parity gate plan"
  - "routing gap remediation plan"
importance_tier: "normal"
contextType: "implementation"
---
> Reconstructed on 2026-10-07 from spec.md and git history. It was not written at the time.

# Implementation Plan: Phase 016 — Hub routing benchmark + cross-hub parity gate

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Advisor routing surfaces for the converted sk-doc hub, benchmarked against the sk-code/sk-design/deep-loop reference hubs |
| **Framework** | sk-doc monolith to parent-hub conversion (phase 016) |
| **Storage** | Not recorded |
| **Testing** | Routing, discovery, efficiency and canon-conformance benchmark evidence; exact commands are Not recorded |

### Overview
Benchmark the converted hub (modeled on 124's routing-benchmark phase and the CONDITIONAL parity gate): advisor routing accuracy for each create-* verb + doc-quality intent, discovery/efficiency, and canon-conformance parity vs the sk-code/sk-design/deep-loop reference hubs. Confirm the single sk-doc identity routes and the hub picks the right mode/bundle from wording. Emit a ranked, remediable Skill Benchmark Report; feed any routing gaps back to 014.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 001 deep-research rulings available
- [ ] Depends-on phases 013, 014 and 015 available

### Definition of Done
- [ ] Skill Benchmark Report (routing/discovery/efficiency/canon)
- [ ] Cross-hub parity scorecard
- [ ] Routing-gap remediation list (loop back to 014 if needed)
- [ ] `validate.sh` passes for this folder
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Not recorded — the scaffold did not record an implementation pattern.

### Key Components
- Advisor routing accuracy benchmark for each create-* verb and doc-quality intent
- Discovery/efficiency measurements
- Cross-hub canon-conformance parity scorecard
- Ranked, remediable Skill Benchmark Report

### Data Flow
Not recorded.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`; it owns task state. Phase breakdown beyond the spec-level deliverables was not recorded.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The phase's success criteria are a passing `validate.sh` for this folder and zero external-coupling breakage introduced by the phase (facades resolve). Exact benchmark commands and their output are Not recorded.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 001 deep-research rulings | Internal | Not recorded | This phase's scope may shift |
| Depends-on phases 013, 014 and 015 | Internal | Not recorded | The routing surfaces this phase benchmarks would not be settled |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Not recorded — no rollback steps were captured when the phase was scaffolded.
<!-- /ANCHOR:rollback -->
