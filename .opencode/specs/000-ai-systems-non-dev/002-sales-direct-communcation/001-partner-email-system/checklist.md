<!-- SPECKIT_LEVEL: 3+ -->

# Quality Assurance Checklist

**Spec:** 001-partner-email-system
**Level:** 3+ (Architecture + Governance + Non-Dev AI System)
**Last Updated:** 2026-02-15

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] **CHK-001** [P0] Sales briefing analyzed and documented in spec.md
- [ ] **CHK-002** [P0] Reference systems (1, 4, 5) analyzed for architecture patterns
- [ ] **CHK-003** [P1] All 20+ communication topics identified and categorized
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Content Quality (replaces Code Quality)

- [ ] **CHK-010** [P0] All KB documents follow naming convention: [System] - [Category] - [Name] - v[X.YYY].md
- [ ] **CHK-011** [P0] AGENTS.md has all 4 sections (Context Override, Export Protocol, Reading Instructions, Processing Hierarchy)
- [ ] **CHK-012** [P0] System Prompt has routing logic with all 20+ topics mapped to KB sections
- [ ] **CHK-013** [P0] All pricing information is accurate (EUR 129/mo quarterly, EUR 64/mo annual, EUR 492/quarter Managed)
- [ ] **CHK-014** [P0] Trial terms are accurate (14 days OR first creator acceptance, whichever first)
- [ ] **CHK-015** [P1] Human Voice Rules compliance across all KB documents (no em dashes, no semicolons, no AI-filler)
- [ ] **CHK-016** [P1] Both voice profiles complete (Floris: Dutch patterns, Sam: English patterns)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] **CHK-020** [P0] System drafts correct reply for trial explanation scenario
- [ ] **CHK-021** [P0] System drafts correct reply for cancellation scenario
- [ ] **CHK-022** [P0] System detects Dutch input and responds in Dutch
- [ ] **CHK-023** [P0] System detects English input and responds in English
- [ ] **CHK-024** [P1] All 20+ topic templates produce appropriate output
- [ ] **CHK-025** [P1] Persuasive tone used when partner considers purchase
- [ ] **CHK-026** [P1] Factual tone used when explaining platform features
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Brand Safety

- [ ] **CHK-030** [P0] "Creators" used (never "influencers") - HARD BLOCKER
- [ ] **CHK-031** [P0] EUR currency used (never USD, $, or euro symbol)
- [ ] **CHK-032** [P0] No marketing language or hype in factual explanations
- [ ] **CHK-033** [P1] Correct Barter stats used (26K+ creators, 1000+ brands)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:arch-verify -->
## Architecture Verification (L3)

- [ ] **CHK-100** [P0] Architecture decisions documented in decision-record.md (4 ADRs)
- [ ] **CHK-101** [P1] All ADRs have status and alternatives with scoring
- [ ] **CHK-102** [P1] KB structure mirrors reference systems (system/, context/, rules/, voice/)
- [ ] **CHK-103** [P2] Migration path documented for existing Floris/Sam GPTs
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:deploy-ready -->
## Deployment Readiness (L3)

- [ ] **CHK-120** [P0] Custom GPT configured with all KB documents uploaded
- [ ] **CHK-121** [P1] System instructions (AGENTS.md content) set in GPT configuration
- [ ] **CHK-122** [P1] Export folder structure created
- [ ] **CHK-123** [P2] Sales Ops onboarding guide created
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:docs-verify -->
## Documentation Verification (L3)

- [ ] **CHK-140** [P1] All spec documents synchronized (spec/plan/tasks/checklist)
- [ ] **CHK-141** [P1] KB version numbers consistent (v0.100 for new, v0.110 for shared)
- [ ] **CHK-142** [P2] Memory README.md documents auto-save triggers
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

- [ ] **CHK-110** [P1] GPT response generation completes in <30 seconds for standard partner email
- [ ] **CHK-111** [P1] Topic routing correctly identifies topic for 95%+ of test emails
- [ ] **CHK-112** [P2] Quality scoring produces consistent results (±1 point) across repeated runs
- [ ] **CHK-113** [P2] Voice profile switching works reliably with $floris/$sam commands
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [ ] **CHK-130** [P0] All pricing figures verified against finance records
- [ ] **CHK-131** [P0] Trial terms legally accurate (verified with legal if needed)
- [ ] **CHK-132** [P0] No PII stored in ChatGPT Custom GPT beyond session
- [ ] **CHK-133** [P1] Refund policy aligned with company policy
- [ ] **CHK-134** [P1] GDPR escalation path documented for data requests
- [ ] **CHK-135** [P1] Cancellation process matches actual company workflow
- [ ] **CHK-136** [P2] All KB documents use approved terminology only
- [ ] **CHK-137** [P2] Export files contain no partner PII in filenames
<!-- /ANCHOR:compliance-verify -->

---

## L3+: Documentation Verification

- [ ] **CHK-140** [P0] All 6 spec documents present and synchronized (spec/plan/tasks/checklist/decision-record/implementation-summary)
- [ ] **CHK-141** [P1] All KB documents follow naming convention: [System] - [Category] - [Name] - v[X.YYY].md
- [ ] **CHK-142** [P1] Version numbers consistent across all documents (v0.100 for new, v0.110 for shared)
- [ ] **CHK-143** [P1] Memory README.md documents auto-save triggers and archival policy
- [ ] **CHK-144** [P2] AGENTS.md reading instructions match actual KB file structure
- [ ] **CHK-145** [P2] Cross-references between KB documents are accurate and bidirectional

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Scope | Status | Date |
|----------|------|-------|--------|------|
| Michel Kerkmeester | System Architect | Architecture, KB structure, quality standards | [ ] Approved | |
| Floris | Sales Ops (Dutch) | Dutch voice profile, Dutch templates, Dutch test scenarios | [ ] Approved | |
| Sam | Sales Ops (English) | English voice profile, English templates, English test scenarios | [ ] Approved | |
| Sales Team Lead | Operations | Process integration, adoption readiness, launch approval | [ ] Approved | |
| Finance | Pricing Accuracy | Pricing figures, refund policy, billing terms | [ ] Approved | |
<!-- /ANCHOR:sign-off -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | P0 Items | P1 Items | P2 Items | Total | Completed |
|----------|----------|----------|----------|-------|-----------|
| Pre-Implementation | 2 | 1 | 0 | 3 | 0 |
| Content Quality | 5 | 2 | 0 | 7 | 0 |
| Testing | 4 | 3 | 0 | 7 | 0 |
| Brand Safety | 3 | 1 | 0 | 4 | 0 |
| Architecture Verification | 1 | 2 | 1 | 4 | 0 |
| Deployment Readiness | 1 | 2 | 1 | 4 | 0 |
| Documentation Verification (L3) | 0 | 2 | 1 | 3 | 0 |
| L3+ Performance | 0 | 2 | 2 | 4 | 0 |
| L3+ Compliance | 3 | 3 | 2 | 8 | 0 |
| L3+ Documentation | 1 | 3 | 2 | 6 | 0 |
| L3+ Sign-Off | 5 | 0 | 0 | 5 | 0 |
| **TOTAL** | **25** | **21** | **9** | **55** | **0** |

**Overall Progress:** 0% (0/55 items completed)
<!-- /ANCHOR:summary -->

---

## Priority Legend

- **P0 (HARD BLOCKER):** Must complete before deployment. Cannot defer under any circumstances.
- **P1 (Required):** Must complete OR obtain user-approved deferral with documented reason.
- **P2 (Optional):** Can defer without approval. Document in implementation-summary.md if deferred.
