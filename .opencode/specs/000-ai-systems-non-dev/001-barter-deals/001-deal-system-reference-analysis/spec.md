<!-- SPECKIT_LEVEL: 3+ -->
# Feature Specification: Deal System Reference Analysis and Knowledge Base Improvements

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch + level3plus-govern | v2.2 -->

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

Analysis of 4 external reference sources (Sales Sam ChatGPT Knowledge, Floris ChatGPT Knowledge, Deal Type Templates, Sales Ops Agent Brief) against the existing Barter deals AI system v0.201 reveals 6 improvement areas requiring knowledge base documentation updates. The current system architecture (DEPTH framework, DEAL 25-point scoring, Human Voice Rules) is solid but lacks codified operational and sales knowledge. This spec documents 19 prioritized recommendations to upgrade system knowledge base files, with no code changes required.

**Key Decisions**: Implement deal type expansion (Gift Card, Subscription, Paid+Barter Hybrid routing), add campaign goal capture as core input parameter, implement multi-language support framework (NL, DE, EN)

**Critical Dependencies**: None - all changes are knowledge base markdown file updates to ChatGPT project documentation
<!-- /ANCHOR:executive-summary -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

- **Level**: 3+
- **Priority**: P0
- **Status**: Draft
- **Created**: 2026-02-15
- **Branch**: N/A (knowledge base updates only)
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The Barter deals AI system (ChatGPT project knowledge base) is architecturally strong but missing operational knowledge that exists only in sales team members' heads and scattered reference documents. This creates inconsistencies: system-generated deals miss standard deliverables (story posts), use wrong title lengths (80 vs 50 chars), lack multi-language support despite 4-country operation, and cannot route 3 distinct deal types (Gift Card, Subscription, Paid+Barter Hybrid) that sales teams regularly create.

### Purpose

Codify all operational and sales knowledge from reference sources into the Barter deals system knowledge base to ensure consistent, high-quality deal creation across all deal types, languages, and sales workflows.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Update system prompt markdown files to add 3 new deal type routing paths
- Add campaign goal capture (awareness/sales/reviews/UGC) as primary input parameter
- Document multi-language routing framework (Dutch, German, English)
- Add story deliverable to standard requirements template
- Reduce title character limit from 80 to 50
- Add follower requirement guidance (1500+ baseline)
- Add value-to-application intelligence warnings
- Add Deal Attractiveness Self-Check as new quality gate
- Document hashtag strategy guidance (5-10 niche hashtags)
- Add post-creation optimization playbook
- Document category selection strategy
- Add Barter App field terminology mapping
- Codify scope boundaries (regulated products, sensitive categories)

### Out of Scope

- Code changes (this is a non-dev spec)
- Database schema modifications
- API endpoint creation
- Automated URL-based context extraction (future enhancement)
- Partner stage awareness system (future enhancement)
- Application success prediction (future enhancement)
- Automated performance benchmarking (future enhancement)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| System Prompt - Section 4 (Smart Routing Logic) | Modify | Add Gift Card, Subscription, Paid+Barter Hybrid routing paths |
| System Prompt - Section 0 (Input Parameters) | Modify | Add campaign goal parameter (awareness/sales/reviews/UGC) |
| System Prompt - Section 2 (Standards) | Modify | Update title length from 80 to 50 characters |
| Deal Templates - Requirements Section | Modify | Add standard story deliverable pattern |
| System Prompt - Market Data | Modify | Add value-to-application intelligence warnings |
| System Prompt - New Section | Create | Add Deal Attractiveness Self-Check quality gate |
| System Prompt - New Section | Create | Add multi-language routing framework |
| System Prompt - New Section | Create | Add hashtag strategy guidance |
| System Prompt - New Section | Create | Add post-creation optimization playbook |
| System Prompt - New Section | Create | Add follower requirement guidance |
| System Prompt - New Section | Create | Add category selection strategy |
| System Prompt - New Section | Create | Add Barter App terminology mapping |
| System Prompt - New Section | Create | Add scope boundaries documentation |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Add story deliverable to standard requirements template | All deal templates include "1x Instagram Story with product tag and link" |
| REQ-002 | Update title max length to 50 characters | Standards section specifies 50 char limit, not 80 |
| REQ-003 | Add follower requirement guidance | System documents 1500+ baseline, 3000-5000+ for premium |
| REQ-004 | Add value-to-application warnings | System warns when value below EUR 50 with application rate prediction |
| REQ-005 | Add campaign goal parameter | System prompts for goal selection (awareness/sales/reviews/UGC) before deal brief |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Add Paid + Barter Hybrid deal type routing | System recognizes "payment" + product/service signals and routes to hybrid template |
| REQ-007 | Add hashtag strategy guidance | System documents 5-10 niche hashtags, flags generic high-volume tags |
| REQ-008 | Add Deal Attractiveness Self-Check | Pre-export quality gate checks 7 criteria beyond DEAL scoring |
| REQ-009 | Add post-creation optimization playbook | System provides 6-step diagnostic for low-application deals |
| REQ-010 | Add category selection guidance | System documents category strategy (not too broad, not too narrow) |
| REQ-011 | Add Gift Card deal type routing | System recognizes "gift card", "voucher", "credit" signals |
| REQ-012 | Add Subscription deal type routing | System recognizes "subscription", "membership", "year access" signals |
| REQ-013 | Add multi-language support framework | System routes to NL/DE/EN templates based on brand country |
| REQ-014 | Add Barter App terminology mapping | System documents platform UI labels (Categories not Interests) |
| REQ-015 | Add scope boundaries documentation | System flags regulated products, sensitive categories |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 19 recommendations from research.md are implemented in knowledge base documentation with zero placeholder content
- **SC-002**: validate.sh passes with no errors for the spec folder
- **SC-003**: All 5 immediate priority recommendations (REQ-001 through REQ-005) are fully documented
- **SC-004**: All 3 new deal type routing paths have documented trigger signals, template changes, and value ranges
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Multi-language HVR rules require separate validation logic per language | Medium - English-centric hard blockers may produce false violations in Dutch/German | Document as Phase 2 work, implement template variants first |
| Risk | URL-based context extraction requires technical implementation beyond knowledge base updates | Low - can defer to future enhancement | Document as out-of-scope, maintain manual 9-question flow |
| Dependency | Validation script at system-spec-kit/scripts/spec/validate.sh | High - cannot verify completion without validation | Script exists and is accessible |
| Risk | Campaign goal parameter changes fundamental system workflow | Medium - affects all deal creation flows | Document clearly in system prompt with default behavior |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: Knowledge base file updates must not increase ChatGPT project token usage beyond context window limits

### Security

- **NFR-S01**: No sensitive partner data, creator information, or pricing details in knowledge base documentation

### Reliability

- **NFR-R01**: All documentation changes must be backward-compatible with existing deal creation workflows
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries

- Empty campaign goal input: Default to "awareness" with note to user
- Multiple deal types detected: Prioritize Paid+Barter Hybrid > Gift Card > Subscription > Product/Service
- Language detection ambiguous: Default to English with option to override

### Error Scenarios

- Deal value below EUR 50 without justification: Hard warning in Deal Attractiveness Self-Check
- Missing story deliverable: Auto-add to requirements with notification
- Generic hashtags detected (#love, #instagood): Flag with niche hashtag suggestion
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 20/25 | Files: 13, Systems: 1 (ChatGPT KB), No LOC (markdown only) |
| Risk | 10/25 | No auth, no API, no breaking changes, knowledge base only |
| Research | 15/20 | 4 reference sources analyzed, 19 recommendations prioritized |
| Multi-Agent | 5/15 | Single-agent execution sufficient |
| Coordination | 8/15 | Dependencies minimal, sequential file updates |
| **Total** | **58/100** | **Level 2-3 range, using 3+ for governance** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:risk-matrix -->
## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Multi-language HVR rules conflict with English-centric validation | Medium | High | Document as Phase 2, implement template variants first without HVR changes |
| R-002 | Campaign goal parameter disrupts existing workflows | Low | Medium | Add as optional with sensible default, document backward compatibility |
| R-003 | Value-to-application warnings too aggressive | Low | Medium | Implement as soft warnings, not hard blockers |
| R-004 | Deal Attractiveness Self-Check creates alert fatigue | Medium | Low | Limit to 7 high-impact criteria, clearly distinguish from DEAL scoring |
<!-- /ANCHOR:risk-matrix -->

---

<!-- ANCHOR:user-stories -->
## 11. USER STORIES

### US-001: Story Deliverable Standard (Priority: P0)

**As a** Sales team member, **I want** all system-generated deals to include the standard story deliverable, **so that** I don't have to manually add "1x Instagram Story with product tag and link" to every deal.

**Acceptance Criteria**:
1. Given any deal type, When system generates requirements section, Then output includes story deliverable by default
2. Given Product deal, When requirements generated, Then includes both Reel/TikTok AND story deliverable
3. Given Gift Card deal, When requirements generated, Then story deliverable adapted to gift card context

**Acceptance Scenarios**:

**Given** a Product deal type, **When** the system generates the Requirements section, **Then** the output includes "1x Instagram Story with product tag and link to @[brand]" AND "1x Instagram Reel or TikTok (minimum 30 seconds)"

**Given** a Gift Card deal type, **When** the system generates the Requirements section, **Then** the output includes "1x Instagram Story showing gift card redemption" with brand tag

### US-002: Campaign Goal Routing (Priority: P0)

**As a** Sales team member creating a deal, **I want** to specify the campaign goal upfront (awareness/sales/reviews/UGC), **so that** the system generates appropriate content direction and compensation recommendations.

**Acceptance Criteria**:
1. Given deal creation start, When system prompts for input, Then campaign goal question appears before deal brief
2. Given "sales" goal selected, When deal generated, Then includes discount codes and conversion tracking guidance
3. Given "UGC" goal selected, When deal generated, Then includes higher usage rights compensation and content ownership clauses

**Acceptance Scenarios**:

**Given** user selects "sales" as campaign goal, **When** the system generates deal template, **Then** the content direction includes "Include discount code in caption" AND requirements include "Tag brand in swipe-up link"

**Given** user selects "UGC" as campaign goal, **When** the system calculates compensation, **Then** compensation includes EUR 50-100 for ad usage rights AND requirements include "Content ownership transfers to brand"

### US-003: Multi-Language Deal Creation (Priority: P1)

**As a** Sales team member working with Dutch/German brands, **I want** the system to detect brand country and route to appropriate language template, **so that** deals are created in the partner's native language.

**Acceptance Criteria**:
1. Given NL/BE brand, When deal created, Then output is in Dutch with correct terminology
2. Given DE brand, When deal created, Then output is in German with terms like "Tauschgeschäft"
3. Given UK/international brand, When deal created, Then output is in English as default

**Acceptance Scenarios**:

**Given** brand country is "Netherlands", **When** the system detects language, **Then** the language routes to Dutch template variant AND output uses "Categorieën" not "Categories"

**Given** brand country is "Germany", **When** the system generates deal template, **Then** the title uses "Tauschgeschäft" for barter deal AND requirements use "Follower Anforderungen"

### US-004: Deal Type Expansion - Paid+Barter Hybrid (Priority: P1)

**As a** Sales team member creating hybrid deals, **I want** the system to recognize paid collaboration signals and route to hybrid template, **so that** payment is structured correctly with itemized breakdown.

**Acceptance Criteria**:
1. Given "paid collaboration" or "payment" in deal brief, When system routes, Then hybrid template selected
2. Given hybrid deal, When generated, Then "What Do You Get?" section shows itemized: product value + payment + optional ad rights bonus
3. Given hybrid deal, When generated, Then WeTransfer HD video delivery is included by default

### US-005: Value Intelligence Warning (Priority: P0)

**As a** Sales team member, **I want** the system to warn me when deal value is too low for expected application volume, **so that** I can adjust value before publishing.

**Acceptance Criteria**:
1. Given deal value below EUR 50, When DEAL scoring completes, Then system warns "Below EUR 50. Expected low application rate."
2. Given deal value EUR 50-75, When scoring completes, Then system confirms "Good value range for standard deals"
3. Given follower requirement 3000+ but value only EUR 50, When scoring completes, Then system warns about follower-to-value mismatch

**Acceptance Scenarios**:

**Given** deal value is EUR 40, **When** DEAL Attractiveness Self-Check runs, **Then** system warns "Below EUR 50. Expected low application rate. Recommend EUR 50-75 or add compensation."

**Given** deal value is EUR 200 AND follower requirement is 1000+, **When** value-to-application check runs, **Then** system confirms "Premium range. Fewer applications but higher creator quality."
<!-- /ANCHOR:user-stories -->

---

<!-- ANCHOR:approval-workflow -->
## 12. APPROVAL WORKFLOW

| Checkpoint | Approver | Status | Date |
|------------|----------|--------|------|
| Spec Review | Technical Lead | Pending | |
| Design Review | N/A (knowledge base only) | N/A | |
| Implementation Review | Sales Operations Lead | Pending | |
| Launch Approval | Product Owner | Pending | |
<!-- /ANCHOR:approval-workflow -->

---

<!-- ANCHOR:compliance -->
## 13. COMPLIANCE CHECKPOINTS

### Security Compliance

- [x] Security review completed (no code changes, no data handling)
- [x] OWASP Top 10 addressed (N/A for knowledge base documentation)
- [x] Data protection requirements met (no PII in documentation)

### Code Compliance

- [x] Coding standards followed (N/A - markdown documentation only)
- [x] License compliance verified (N/A - internal knowledge base)
<!-- /ANCHOR:compliance -->

---

<!-- ANCHOR:stakeholders -->
## 14. STAKEHOLDER MATRIX

| Stakeholder | Role | Interest | Communication |
|-------------|------|----------|---------------|
| Sales Operations Team | Primary Users | High - daily workflow impact | Review before implementation |
| Product Owner | Decision Authority | High - system quality impact | Approval required for launch |
| Sales Sam | Subject Matter Expert | High - contributed reference knowledge | Review Dutch/German translations |
| Floris | Subject Matter Expert | High - contributed strategy framework | Review campaign goal implementation |
<!-- /ANCHOR:stakeholders -->

---

<!-- ANCHOR:changelog -->
## 15. CHANGE LOG

### v1.0 (2026-02-15)

**Initial specification**
- Analyzed 4 reference sources (Sales Sam KB, Floris KB, Deal Type Templates, Sales Ops Brief)
- Identified 6 improvement areas and 19 prioritized recommendations
- Documented as Level 3+ spec for governance tracking despite low technical complexity
- Prioritized 5 immediate recommendations as P0 blockers
<!-- /ANCHOR:changelog -->

---

<!-- ANCHOR:questions -->
## 16. OPEN QUESTIONS

- Should URL-based context extraction be prioritized higher if technical feasibility is confirmed?
- What is the exact validation logic for multi-language HVR rules (Dutch/German punctuation norms)?
- Should partner stage awareness (explore/trial/paid) be included in Phase 1 or deferred to Phase 2?
- What is the preferred communication plan for rolling out knowledge base changes to Sales team?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Research Analysis**: See `research.md` (source document)

---

<!--
LEVEL 3+ SPEC
- Non-development spec (knowledge base updates only)
- 19 recommendations from research.md
- 6 improvement areas: deal types, sales workflow, value optimization, operational knowledge, multi-language, quality gates
- Implementation = updating ChatGPT project markdown files
-->
