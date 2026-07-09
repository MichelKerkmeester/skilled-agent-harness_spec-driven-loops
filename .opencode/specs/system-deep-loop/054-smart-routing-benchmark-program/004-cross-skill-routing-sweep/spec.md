---
title: "Feature Specification: Cross-Skill Routing Sweep"
description: "Apply the code-review routing-optimization playbook across the remaining skills the audit flagged: wire genuinely-routable orphan references into meaningful intents, exempt/prune non-routable index files, gold-align pure DEFAULT-tier over-routing artifacts, and intent-gate genuine over-routing — driven by a non-scoring D3 diagnostic and two fresh reviews."
trigger_phrases:
  - "cross-skill routing sweep"
  - "orphan wiring sweep"
  - "d3 ex-default diagnostic"
  - "routing optimization phase 2"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/054-smart-routing-benchmark-program/004-cross-skill-routing-sweep"
    last_updated_at: "2026-07-09T06:41:48Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Ran Phase 0 read-only triage for the cross-skill routing sweep"
    next_safe_action: "Hand-sweep deep-improvement, then build the optimizer from two shapes"
    blockers: []
    key_files:
      - ".opencode/specs/system-deep-loop/054-smart-routing-benchmark-program/003-routing-optimization-mode/assets/cross-skill-routing-audit.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session_01Ht7J9NZTEBBXwzTeNvras9"
      parent_session_id: null
    completion_pct: 45
    open_questions: []
    answered_questions:
      - "D3 = Option G + non-scoring diagnostic; detector-first / hand-sweep-hardest — two fresh reviews converged"
---
# Feature Specification: Cross-Skill Routing Sweep

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

## 1. METADATA
<!-- ANCHOR:metadata -->

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-07-09 |
| **Branch** | `004-cross-skill-routing-sweep` |
<!-- /ANCHOR:metadata -->

---

## 2. PROBLEM & PURPOSE
<!-- ANCHOR:problem -->

### Problem Statement
The 003 audit flagged routing defects beyond code-review: orphan references (deep-improvement 18, deep-research/deep-review 4 each, deep-ai-council 1) and D3 over-routing below 100 across ~6 skills. Applying the code-review recipe blindly would be wrong — two fresh reviews (Opus 4.8 + Sonnet 5) converged that (a) ~39% of deep-improvement's orphans are non-routable index files that must NOT be wired, (b) D3<100 is a mix of the harmless DEFAULT-tier artifact and genuine over-routing that need different fixes, and (c) automating from the one easy example would codify a wrong heuristic.

### Purpose
Every flagged skill is remediated by the CORRECT fix class — orphan-wire / exempt / prune / gold-align / intent-gate — established by a computed diagnostic and a hand-swept hardest case, not by a blind sweep.
<!-- /ANCHOR:problem -->

---

## 3. SCOPE
<!-- ANCHOR:scope -->

### In Scope
- A non-scoring `D3-ex-default` diagnostic (thread the skill's DEFAULT tier through the report; no scored-baseline change).
- Per-skill triage into orphan-wire / exempt (intentionally-unrouted allowlist) / prune / gold-align / intent-gate.
- Hand-sweep deep-improvement (the hardest case), then the remaining skills.
- A negative acceptance test before any optimizer automation.

### Out of Scope
- The general `D3-excludes-DEFAULT` engine change (rejected by both reviews — it hides genuine over-routing and inverts the anti-bloat guardrail).
- Changing any skill's thoroughness contract.
- Wiring non-routable index/catalog files into intents (that is the gaming the methodology forbids).

### Files to Change
| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `deep-improvement/scripts/skill-benchmark/**` | Modify | Non-scoring D3 diagnostic; later the optimizer |
| `system-deep-loop/{deep-improvement,deep-research,deep-review,deep-ai-council}/SKILL.md` + gold | Modify | Per-skill remediation (orphan-wire / gold-align) |
| `sk-code/code-opencode/SKILL.md` | Modify | Intent-gate genuine over-routing |
| `deep-improvement/references/skill_benchmark/routing_optimization.md` | Modify | Doctrine update for the diagnostic |
<!-- /ANCHOR:scope -->

---

## 4. REQUIREMENTS
<!-- ANCHOR:requirements -->

### P0 - Blockers (MUST complete)
| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Correct fix class per skill | Each remediation matches the diagnostic (artifact→gold-align, genuine→intent-gate) and the orphan classification (routable→wire, index→exempt) |
| REQ-002 | No metric gaming | No non-routable index file is wired into an intent; no gold=router-output tautology; every new intent has an adversarial sibling scenario + passes contamination-lint |
| REQ-003 | No regression | Parent union stays consistent + re-benchmarked per skill; Mode-A verdict unchanged-or-better |

### P1 - Required (complete OR user-approved deferral)
| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Automation proven on ≥2 shapes | The optimizer reproduces code-review AND deep-improvement + passes a negative (planted over-router) test before any fan-out |
<!-- /ANCHOR:requirements -->

---

## 5. SUCCESS CRITERIA
<!-- ANCHOR:success-criteria -->

- **SC-001**: Phase-0 triage table + orphan classification produced (read-only). — done this phase
- **SC-002**: deep-improvement hand-swept with independent sign-off. — target
- **SC-003**: Remaining skills remediated by the correct class; parent + swept skills re-baselined. — target
<!-- /ANCHOR:success-criteria -->

---

## 6. RISKS & DEPENDENCIES
<!-- ANCHOR:risks -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Wiring an index README into a fake intent (gaming) | High | Orphan classification + exempt allowlist; index files stay unrouted |
| Risk | Gold=design tautology on a bloated DEFAULT tier | Medium | Phase-0 leanness check — all flagged skills here have a 1-2 file DEFAULT tier (not bloated) |
| Risk | Automating a wrong heuristic from one shape | High | Detector-first; hand-sweep the hardest case; optimizer proven on 2 shapes + a negative test |
| Dependency | 001/002/003 (scorer fix, parser fix, methodology, command) | Met | Shipped |
<!-- /ANCHOR:risks -->

---

## 7. OPEN QUESTIONS
<!-- ANCHOR:questions -->

- D5 CI-gate policy: ship as `orphans ⊆ allowlist`, or keep D5 a warning as designed and gate only on regressions? (operator call)
<!-- /ANCHOR:questions -->
