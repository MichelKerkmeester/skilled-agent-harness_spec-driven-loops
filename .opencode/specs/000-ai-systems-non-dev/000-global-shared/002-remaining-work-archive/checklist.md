# Verification Checklist: Remaining Deferred Work

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

---

## Pre-Implementation

- [ ] CHK-001 [P0] All knowledge base files read for both LinkedIn agents
- [ ] CHK-002 [P0] TikTok audit taxonomy (specs/003-tiktok-audit/) loaded as reference
- [ ] CHK-003 [P1] Current file state verified (sessions 3-5 refactoring applied)

---

## Audit Quality

- [ ] CHK-020 [P0] Audit reports produced for both Nigel and Pieter with severity ratings
- [ ] CHK-021 [P0] All CRITICAL and HIGH findings fixed in both agents
- [ ] CHK-022 [P1] All MEDIUM and LOW findings fixed or user-approved deferral
- [ ] CHK-023 [P0] Verification sweep passes at 100% for both agents

---

## Token Budget Documentation (M-05)

- [ ] CHK-030 [P1] Token budget patterns researched across all DEPTH-using agents
- [ ] CHK-031 [P1] Token budget document follows Global shared file conventions (metadata header with Loading Condition, Purpose, Scope)
- [ ] CHK-032 [P1] Documentation format consistent across all agents
- [ ] CHK-033 [P0] `0. Global (Shared)/system/` directory exists
- [ ] CHK-034 [P0] `0. Global (Shared)/system/System - Token Budget - v0.100.md` exists and is well-formed
- [ ] CHK-035 [P1] Applicable agent AGENTS.md / system prompts reference the global token budget doc (symlinks or loading references)

---

## Consistency & Regression

- [ ] CHK-040 [P0] Final verification sweep passes for Nigel de Lange
- [ ] CHK-041 [P0] Final verification sweep passes for Pieter Bertram
- [ ] CHK-042 [P1] No regressions in previously fixed agents (TikTok, Copywriter, etc.)
- [ ] CHK-043 [P1] All 8 system prompts maintain consistent metadata header pattern

---

## Documentation

- [ ] CHK-050 [P1] spec.md, plan.md, tasks.md synchronized and updated to Complete
- [ ] CHK-051 [P1] Audit reports saved to spec folder
- [ ] CHK-052 [P2] Findings saved to memory/ for future reference

---

## File Organization

- [ ] CHK-060 [P1] Temp files in scratch/ only
- [ ] CHK-061 [P1] scratch/ cleaned before completion
- [ ] CHK-062 [P2] Context preserved to memory/ via generate-context.js

---

## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 0/9 |
| P1 Items | 12 | 0/12 |
| P2 Items | 2 | 0/2 |

**Verification Date**: —

---
