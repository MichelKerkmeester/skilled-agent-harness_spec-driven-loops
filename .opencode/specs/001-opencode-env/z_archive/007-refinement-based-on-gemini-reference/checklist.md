# Verification Checklist: AGENTS.md Coding Behavior Refinement

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist + level3-arch | v2.0 -->

---

## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

---

## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P0] Decision records created for major choices

---

## Phase 1: Coding Lenses Section

- [ ] CHK-010 [P0] Coding Analysis Lenses section added to AGENTS.md
- [ ] CHK-011 [P0] All 6 lenses defined: CLARITY, SYSTEMS, BIAS, SUSTAINABILITY, VALUE, SCOPE
- [ ] CHK-012 [P0] Each lens has coding-focused detection questions
- [ ] CHK-013 [P0] "Apply silently" instruction included
- [ ] CHK-014 [P0] Anti-pattern detection table added with 6 patterns
- [ ] CHK-015 [P1] Trigger phrases are realistic user language

---

## Phase 2: Integration

- [ ] CHK-020 [P0] SYSTEMS lens integrated into Request Analysis flow (Section 5)
- [ ] CHK-021 [P1] BIAS lens integrated for wrong-problem detection
- [ ] CHK-022 [P1] CLARITY triggers added to Simplicity First principle
- [ ] CHK-023 [P1] SCOPE lens connected to scope discipline
- [ ] CHK-024 [P1] Flow diagram updated with lens steps

---

## Phase 3: Common Failure Patterns

- [ ] CHK-030 [P0] 4 coding anti-patterns added (Cargo Culting, Gold-Plating, Wrong Abstraction, Premature Optimization)
- [ ] CHK-031 [P1] Patterns use consistent format with existing table
- [ ] CHK-032 [P1] Lens references included in response actions

---

## Phase 4: Quality Gate & Sync

- [ ] CHK-040 [P0] Lens validation added to Phase 1.5 Code Quality Gate
- [ ] CHK-041 [P0] AGENTS.md synced with AGENTS.md changes
- [ ] CHK-042 [P1] Test prompts verify lens behavior
- [ ] CHK-043 [P1] Responses are natural (no lens announcements)

---

## Code Quality

- [ ] CHK-050 [P0] Markdown syntax valid (no broken formatting)
- [ ] CHK-051 [P0] No internal contradictions in document
- [ ] CHK-052 [P1] New sections integrate naturally with existing content

---

## Documentation

- [ ] CHK-060 [P0] Spec/plan/tasks synchronized
- [ ] CHK-061 [P1] Decision records complete for lens system
- [ ] CHK-062 [P1] Implementation summary created after completion
- [ ] CHK-063 [P2] Memory file saved with session context

---

## L3: ARCHITECTURE VERIFICATION

- [ ] CHK-100 [P0] Architecture decisions documented in decision-record.md
- [ ] CHK-101 [P0] All ADRs have status (Proposed/Accepted)
- [ ] CHK-102 [P1] Alternatives documented with rejection rationale

---

## L3: CODING BEHAVIOR VERIFICATION

- [ ] CHK-110 [P0] Over-engineering detection triggers defined
- [ ] CHK-111 [P0] Wrong-problem detection questions are practical
- [ ] CHK-112 [P1] Solution complexity matching examples provided
- [ ] CHK-113 [P1] Anti-pattern responses are actionable

---

## Acceptance Criteria Verification

| Req ID | Requirement | Verified | Evidence |
|--------|-------------|----------|----------|
| REQ-001 | 6 coding-focused lenses documented | [ ] | |
| REQ-002 | Over-engineering detection added | [ ] | |
| REQ-003 | Solution complexity matching framework | [ ] | |
| REQ-004 | Integrated with Code Quality Gate | [ ] | |
| REQ-005 | Code anti-pattern detection added | [ ] | |
| REQ-006 | Dependency analysis lens integrated | [ ] | |
| REQ-007 | Wrong-problem detection added | [ ] | |
| REQ-008 | Simplicity First enhanced with triggers | [ ] | |
| REQ-009 | Trade-off evaluation guidance | [ ] | |

---

## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 16 | [ ]/16 |
| P1 Items | 13 | [ ]/13 |
| P2 Items | 1 | [ ]/1 |

**Verification Date**: [YYYY-MM-DD]

---

## Success Criteria Verification

| SC ID | Criteria | Met | Evidence |
|-------|----------|-----|----------|
| SC-001 | 6 coding-focused lenses documented | [ ] | |
| SC-002 | Over-engineering triggers defined | [ ] | |
| SC-003 | Solution complexity matching integrated | [ ] | |
| SC-004 | Code anti-pattern detection added | [ ] | |
| SC-005 | Lenses integrated with Code Quality Gate | [ ] | |

---

<!--
Level 3 checklist - Full verification + architecture + coding behaviors
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
