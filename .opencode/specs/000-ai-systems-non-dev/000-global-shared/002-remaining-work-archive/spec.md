# Feature Specification: Remaining Deferred Work

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-02-10 |
| **Branch** | `001-remaining-work` |

---

## 2. PROBLEM & PURPOSE

### Problem Statement

Two work items were deferred during the Barter AI agent system refactoring (sessions 1-6). **M-05** (token budget documentation) was deferred in session 2 during the TikTok audit bug-fix pass because it required cross-agent research. The **LinkedIn full audit** was identified during session 3 when the same class of bugs found in TikTok (scoring mismatches, missing document loading, stale cross-references) were observed in the Nigel de Lange and Pieter Bertram agents but not addressed.

### Purpose

Complete all deferred work so the Barter AI agent system has consistent quality across all 8 agents, with no known unresolved issues.

---

## 3. SCOPE

### In Scope

- **M-05: Token budget documentation** — Create a global shared token budget document at `0. Global (Shared)/system/` that all DEPTH-using agents can reference
- **LinkedIn audit (Nigel de Lange)** — Full audit of system prompt, AGENTS.md, knowledge base documents for the same 21-category bug taxonomy used in the TikTok audit (spec 003)
- **LinkedIn audit (Pieter Bertram)** — Full audit using the same taxonomy
- **LinkedIn bug fixes** — Fix all issues found during both LinkedIn audits

### Out of Scope

- New feature development for any agent — this is remediation only
- TikTok re-audit — completed in sessions 1-2, verified in session 3
- Copywriter, Barter Deals, Product Owner, Prompt Improver, Media Editor audits — not identified as having the same class of bugs
- AGENTS.md restructuring — already completed for all 8 agents in session 4

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `3. LinkedIn/Nigel de Lange/knowledge base/system/*.md` | Modify | Fix bugs found in audit |
| `3. LinkedIn/Nigel de Lange/knowledge base/rules/*.md` | Modify | Fix cross-reference and consistency issues |
| `3. LinkedIn/Nigel de Lange/knowledge base/context/*.md` | Modify | Fix stale data, missing integrations |
| `3. LinkedIn/Nigel de Lange/knowledge base/voice/*.md` | Modify | Fix voice DNA inconsistencies |
| `3. LinkedIn/Nigel de Lange/AGENTS.md` | Modify | Update section references if needed |
| `3. LinkedIn/Pieter Bertram/knowledge base/system/*.md` | Modify | Fix bugs found in audit |
| `3. LinkedIn/Pieter Bertram/knowledge base/rules/*.md` | Modify | Fix cross-reference and consistency issues |
| `3. LinkedIn/Pieter Bertram/knowledge base/context/*.md` | Modify | Fix stale data, missing integrations |
| `3. LinkedIn/Pieter Bertram/knowledge base/voice/*.md` | Modify | Fix voice DNA inconsistencies |
| `3. LinkedIn/Pieter Bertram/AGENTS.md` | Modify | Update section references if needed |
| `0. Global (Shared)/system/` | Create | New global token budget document (M-05) |
| Agent system prompts / AGENTS.md | Modify | Add loading reference to global token budget doc |

---

## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Audit Nigel de Lange agent using TikTok 21-category bug taxonomy | Audit report produced with severity ratings (CRITICAL/HIGH/MEDIUM/LOW) |
| REQ-002 | Audit Pieter Bertram agent using same taxonomy | Audit report produced with severity ratings |
| REQ-003 | Fix all CRITICAL and HIGH severity bugs in both LinkedIn agents | Zero CRITICAL/HIGH issues remaining after fix pass |
| REQ-004 | Verification sweep confirms all fixes applied correctly | 100% PASS rate on verification checks |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Fix all MEDIUM severity bugs in both LinkedIn agents | Zero MEDIUM issues remaining or user-approved deferral |
| REQ-006 | Fix all LOW severity bugs in both LinkedIn agents | Zero LOW issues remaining or user-approved deferral |
| REQ-007 | Create global token budget document at `0. Global (Shared)/system/` (M-05) | Token budget doc exists, follows Global shared file conventions, referenced by applicable agents |

---

## 5. SUCCESS CRITERIA

- **SC-001**: Both LinkedIn agents pass the same 21-category audit taxonomy with zero CRITICAL/HIGH findings
- **SC-002**: All MEDIUM/LOW findings resolved or explicitly deferred with user approval
- **SC-003**: Token budget documentation (M-05) exists as a global shared document at `0. Global (Shared)/system/` and is referenced by all DEPTH-using agents
- **SC-004**: No regressions in previously fixed agents (TikTok, Copywriter, etc.)

---

## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | TikTok audit taxonomy (spec 003) | Audit methodology reference | Already documented in specs/003-tiktok-audit/ |
| Dependency | Completed session 3-5 refactoring | LinkedIn files must reflect current state | Verify file versions before starting audit |
| Risk | LinkedIn agents may have unique bug categories not in TikTok taxonomy | Medium | Extend taxonomy if new patterns found |
| Risk | Nigel and Pieter may share templates, so fixes could cascade | Low | Audit both before fixing to identify shared patterns |

---

## L2: NON-FUNCTIONAL REQUIREMENTS

### Consistency
- **NFR-C01**: All 8 agents follow identical AGENTS.md thin orchestrator pattern
- **NFR-C02**: All metadata headers present and consistent across system prompts
- **NFR-C03**: Cross-references within each agent's knowledge base are accurate

### Completeness
- **NFR-K01**: Token budget documentation covers all agents using DEPTH processing
- **NFR-K02**: No known deferred items remain after this spec is complete

---

## L2: EDGE CASES

### Audit Findings
- Nigel and Pieter share identical bug: Fix in both, document shared root cause
- Bug exists only in one LinkedIn agent: Fix individually, note divergence
- New bug category not in TikTok taxonomy: Add to taxonomy, apply retroactively if needed

### Token Budget Documentation
- Agent does not use DEPTH: Skip token budget section for that agent
- Agent uses DEPTH but budget is undefined: Research and propose reasonable budget

---

## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 15/25 | ~20+ files across 2 LinkedIn agents + token budget docs |
| Risk | 8/25 | Low risk — documentation and consistency fixes, no architecture changes |
| Research | 12/20 | Audit requires reading all LinkedIn knowledge base files |
| **Total** | **35/70** | **Level 2** |

---

## 7. OPEN QUESTIONS

- ~~Should Nigel and Pieter audits run sequentially or in parallel?~~ **RESOLVED: Parallel** (user decision, session 6)
- ~~Does M-05 token budget documentation go inside existing system prompts or as a separate document?~~ **RESOLVED: Global shared document** at `0. Global (Shared)/system/` (user decision, session 6)
- Are there any other agents the user wants audited beyond the two LinkedIn agents?

---
