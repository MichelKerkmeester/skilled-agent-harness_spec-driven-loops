# Feature Specification: Partner Communication AI System

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch + level3plus-govern | v2.2 -->

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

The Partner Communication AI System standardizes Sales Ops email drafting using ChatGPT Custom GPT with a structured knowledge base architecture. System consolidates two existing GPTs (Floris, Sam) into one systematic platform with quality validation, formal routing, and version-controlled communication patterns across 20+ partner inquiry topics.

**Key Decisions**: ChatGPT Custom GPT platform, CORE + ADDENDUM KB architecture (mirrors Systems 1/4/5), dual voice profiles (Floris Dutch-formal, Sam English-direct)

**Critical Dependencies**: ChatGPT Custom GPT access, existing communication pattern uploads from Floris/Sam GPTs
<!-- /ANCHOR:executive-summary -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3+ |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-02-15 |
| **Branch** | `001-partner-email-system` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Sales Ops manually pastes incoming partner emails into ChatGPT with brief directions. Two separate GPTs exist (Floris, Sam) without systematic knowledge base organization, no quality scoring, no formal routing, no version control. Communication patterns exist only as scattered ChatGPT uploads. Output quality is inconsistent across team members and topics.

### Purpose
Create a standardized Partner Communication AI System that produces consistent, high-quality email drafts and replies across all 20+ partner inquiry topics with proper voice matching, quality validation, and version-controlled knowledge base.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- ChatGPT Custom GPT configuration with structured knowledge base
- ~15 KB documents covering system prompts, context modules, rules, voice profiles
- Dual voice profiles: Floris (Dutch-first, formal-warm) and Sam (English-first, direct-solution)
- Communication framework covering 20+ topics (trial, cancellation, refunds, invoices, pricing, discounts, payment issues, upgrades, onboarding, deal optimization, creator issues, content approval, bugs, calls, complaints, Barter Managed)
- Interactive mode for tone selection (factual, persuasive, solution-focused)
- Quality validators and communication standards
- Brand context, platform knowledge, pricing & plans documentation
- Export directory for output tracking
- Memory structure (sessions/, decisions/, patterns/)

### Out of Scope
- Automated email sending (system drafts only, human sends)
- Integration with Barter platform backend (standalone GPT)
- Real-time ticket routing (manual paste workflow)
- Multi-language beyond Dutch/English
- Customer-facing chatbot functionality (Sales Ops internal tool only)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| 6. Sales - Direct Communication/AGENTS.md | Create | Agent routing and workflow documentation |
| 6. Sales - Direct Communication/knowledge base/system/System Prompt.md | Create | Core GPT system prompt with capabilities |
| 6. Sales - Direct Communication/knowledge base/system/Interactive Mode.md | Create | Tone selection interface (factual/persuasive/solution) |
| 6. Sales - Direct Communication/knowledge base/system/Communication Framework.md | Create | DEPTH framework adaptation for partner comms |
| 6. Sales - Direct Communication/knowledge base/context/Brand.md | Create | Barter brand voice and positioning |
| 6. Sales - Direct Communication/knowledge base/context/Platform Knowledge.md | Create | Product features and capabilities |
| 6. Sales - Direct Communication/knowledge base/context/Pricing & Plans.md | Create | EUR 129/mo quarterly, EUR 64/mo annual, Managed EUR 492/quarter |
| 6. Sales - Direct Communication/knowledge base/context/Trial & Subscription.md | Create | 14-day trial rules, cancellation process |
| 6. Sales - Direct Communication/knowledge base/rules/Human Voice.md | Create | Active voice, concise, no fluff, no AI-filler |
| 6. Sales - Direct Communication/knowledge base/rules/Communication Standards.md | Create | Response quality criteria |
| 6. Sales - Direct Communication/knowledge base/rules/Quality Validators.md | Create | Checklist for output validation |
| 6. Sales - Direct Communication/knowledge base/voice/Floris Style.md | Create | Dutch-first, formal-warm tone profile |
| 6. Sales - Direct Communication/knowledge base/voice/Sam Style.md | Create | English-first, direct-solution tone profile |
| 6. Sales - Direct Communication/knowledge base/voice/Response Templates.md | Create | 20+ topic-specific templates |
| 6. Sales - Direct Communication/memory/.gitkeep | Create | Session history, decisions, patterns subdirectories |
| 6. Sales - Direct Communication/export/.gitkeep | Create | Output tracking directory |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | ChatGPT Custom GPT configured with knowledge base | GPT loads all KB files, responds to test prompts |
| REQ-002 | System Prompt defines core capabilities | Prompt includes voice selection, topic routing, quality validation |
| REQ-003 | Dual voice profiles implemented | Floris (Dutch-formal) and Sam (English-direct) profiles documented with examples |
| REQ-004 | Pricing & Plans documentation accurate | EUR 129/mo quarterly (387/quarter), EUR 64/mo annual (768/year), Managed EUR 492/quarter verified |
| REQ-005 | Trial & Subscription rules documented | 14-day trial or until first creator acceptance, cancellation steps |
| REQ-006 | Communication Standards defined | Active voice, concise, no fluff, no marketing language, no AI-filler rules |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Interactive Mode for tone selection | GPT prompts for factual/persuasive/solution tone when appropriate |
| REQ-008 | 20+ topic response templates | Coverage for trial, cancellation, refunds, invoices, pricing, discounts, payment issues, upgrades, onboarding, deal optimization, creator issues, content approval, bugs, calls, complaints, Barter Managed |
| REQ-009 | Quality Validators checklist | Pre-send validation criteria documented |
| REQ-010 | Platform Knowledge context | Product features and capabilities documented |
| REQ-011 | Brand voice documentation | Barter positioning and voice guidelines |
| REQ-012 | Memory structure established | sessions/, decisions/, patterns/ subdirectories created |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Sales Ops can paste partner email into GPT and receive draft response matching appropriate voice profile (Floris/Sam) and tone (factual/persuasive/solution) in <30 seconds
- **SC-002**: 90%+ of generated drafts require minimal editing (1-2 sentence adjustments max) before sending
- **SC-003**: All 20+ partner inquiry topics have documented response templates with accurate information
- **SC-004**: Quality validators checklist reduces inconsistencies to <5% of outputs
- **SC-005**: Knowledge base follows CORE + ADDENDUM architecture matching Systems 1/4/5 structure
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | ChatGPT Custom GPT access | Cannot build system without platform | Verify access before starting KB creation |
| Dependency | Existing Floris/Sam GPT communication patterns | Missing historical context | Export existing uploads before consolidation |
| Risk | Pricing information becomes outdated | Incorrect information to partners | Version control in KB, quarterly review process |
| Risk | Voice profiles insufficiently distinct | Wrong tone for user/context | Document 5+ examples per profile, test with Sales Ops |
| Risk | 20+ topic coverage too broad for initial launch | Quality dilution | Prioritize top 10 topics (trial, cancellation, refunds, pricing) for Phase 1 |
| Dependency | Sales Ops workflow adoption | Manual paste step may create friction | Include Interactive Mode for guided experience |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: GPT response generation <30 seconds for standard partner email

### Security
- **NFR-S01**: No PII storage in ChatGPT (Sales Ops pastes sanitized emails, exports saved locally)

### Reliability
- **NFR-R01**: Knowledge base version controlled (git) for rollback capability
- **NFR-R02**: GPT configuration backed up monthly

### Usability
- **NFR-U01**: Interactive Mode guides user through tone selection in <3 prompts
- **NFR-U02**: Voice profile selection unambiguous (Floris = Dutch queries, Sam = English queries)
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- Multi-topic email (e.g., trial + refund request): System prompts user to split into two drafts
- Ambiguous language (Dutch email with English partner name): Default to Floris (Dutch-formal) unless explicitly requested
- Out-of-scope topic (legal threat, GDPR request): System flags "escalate to management" instead of drafting

### Error Scenarios
- Missing pricing context: GPT cites EUR 129/mo quarterly as default, flags uncertainty
- Conflicting voice selection (English email but Floris profile requested): System asks for clarification
- Extremely long partner email (>1000 words): System requests summary from Sales Ops before drafting

### Language Handling
- Mixed Dutch/English email: System matches dominant language (>60% word count)
- Typos in partner email: GPT corrects implicitly without calling out errors
- Formal vs. informal Dutch ("u" vs. "je"): Default to formal ("u") unless partner uses informal
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 18/25 | Files: 15, LOC: ~6000 (15 KB docs), Systems: 1 (ChatGPT GPT) |
| Risk | 15/25 | Auth: N, API: N, Breaking: N, Quality Risk: Y (partner-facing content) |
| Research | 12/20 | Investigation: Voice profile differentiation, CORE+ADDENDUM KB architecture adaptation |
| Multi-Agent | 0/15 | Workstreams: 1 (single GPT, no parallel agents) |
| Coordination | 8/15 | Dependencies: 2 (existing GPT exports, ChatGPT access), Teams: 1 (Sales Ops) |
| **Total** | **53/100** | **Level 3+** (governance added for stakeholder coordination and compliance tracking) |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:risk-matrix -->
## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Outdated pricing information sent to partners | High (revenue/trust) | Medium (quarterly changes) | Version control KB, quarterly pricing review, explicit version dates |
| R-002 | Voice profiles too similar, causing confusion | Medium (UX friction) | Medium (subjective distinctions) | Document 5+ examples per profile, Sales Ops testing, explicit language triggers (Dutch→Floris, English→Sam) |
| R-003 | Quality validators ignored by Sales Ops | High (inconsistent output) | Low (if checklist is simple) | 3-item checklist max, integrate into Interactive Mode |
| R-004 | 20+ topics create maintenance burden | Medium (stale content) | High (broad scope) | Phase 1 = 10 priority topics, Phase 2 = remaining 10 |
| R-005 | ChatGPT Custom GPT file upload limits | Low (workaround exists) | Low (15 files planned) | Consolidate if needed, test upload during setup |
| R-006 | Existing GPT migration loses valuable patterns | Medium (lost knowledge) | Medium (manual export) | Export all Floris/Sam uploads before consolidation, archive in memory/ |
<!-- /ANCHOR:risk-matrix -->

---

<!-- ANCHOR:user-stories -->
## 11. USER STORIES

### US-001: Factual Trial Response (Priority: P0)

**As a** Sales Ops agent, **I want** to receive a factual reply draft when a partner asks about trial details, **so that** I can send accurate information without hunting for documentation.

**Acceptance Criteria**:
1. Given partner email "How long is the trial?", When GPT drafts response, Then output states "14 days or until first creator acceptance" with correct pricing context
2. Given Floris voice profile, When drafting Dutch trial email, Then tone is formal-warm with "u" form
3. Given Sam voice profile, When drafting English trial email, Then tone is direct-solution with concise bullet points

---

### US-002: Persuasive Purchase Response (Priority: P0)

**As a** Sales Ops agent, **I want** to receive a persuasive reply draft when a partner is considering purchase, **so that** I can highlight value without sounding pushy.

**Acceptance Criteria**:
1. Given partner email "Still thinking about it", When Interactive Mode prompts for tone and user selects "persuasive", Then output includes benefits (ROI, creator network) without marketing fluff
2. Given price objection, When GPT drafts response, Then output compares quarterly (EUR 129/mo) vs. annual (EUR 64/mo) savings
3. Given persuasive tone, When validating output, Then Quality Validator checks for active voice and no AI-filler phrases

---

### US-003: Dutch Email Routing (Priority: P0)

**As a** Sales Ops agent, **I want** Dutch emails to automatically use Floris style, **so that** tone matches partner expectations without manual selection.

**Acceptance Criteria**:
1. Given partner email in Dutch, When GPT analyzes language, Then Floris voice profile is default
2. Given Floris profile, When drafting response, Then output uses formal "u" form and warm closing
3. Given mixed Dutch/English email (>60% Dutch), When drafting, Then Dutch response with Floris style

---

### US-004: Cancellation Request Handling (Priority: P1)

**As a** Sales Ops agent, **I want** to receive solution-focused draft when partner requests cancellation, **so that** I can provide proper steps with subtle retention messaging.

**Acceptance Criteria**:
1. Given cancellation email, When GPT drafts response, Then output includes cancellation steps AND subtle value reminder (e.g., "You'll retain access until [date]")
2. Given cancellation reason "too expensive", When drafting, Then output mentions annual plan savings (EUR 64/mo vs. EUR 129/mo)
3. Given solution-focused tone, When validating, Then Quality Validator ensures no guilt-tripping or aggressive retention

---

### US-005: Pricing Explanation (Priority: P0)

**As a** Sales Ops agent, **I want** accurate pricing comparisons in draft responses, **so that** partners receive correct financial information.

**Acceptance Criteria**:
1. Given pricing question, When GPT drafts response, Then output cites EUR 129/mo quarterly (387/quarter), EUR 64/mo annual (768/year), Managed EUR 492/quarter
2. Given currency confusion (USD mentioned), When drafting, Then output clarifies EUR pricing only
3. Given pricing in response, When validating, Then Quality Validator confirms figures match Pricing & Plans.md

---

### US-006: Complaint Resolution (Priority: P1)

**As a** Sales Ops agent, **I want** solution-focused draft for partner complaints, **so that** I can de-escalate professionally without over-apologizing.

**Acceptance Criteria**:
1. Given complaint email, When GPT drafts response, Then output acknowledges issue + proposes solution without excessive apologies
2. Given bug complaint, When drafting, Then output includes timeline for fix (if known) or escalation path
3. Given solution-focused tone, When validating, Then Quality Validator ensures active voice and concrete next steps

---

### US-007: Proactive Outreach (Priority: P1)

**As a** Sales Ops agent, **I want** to draft proactive re-engagement emails, **so that** I can reach inactive partners without sounding spammy.

**Acceptance Criteria**:
1. Given re-engagement request, When GPT drafts email, Then output includes personalized context (e.g., "last active 3 months ago") + low-pressure CTA
2. Given proactive outreach, When drafting, Then tone is warm-professional without marketing language
3. Given re-engagement draft, When validating, Then Quality Validator checks for no AI-filler and clear CTA

---

### US-008: Refund Request Processing (Priority: P1)

**As a** Sales Ops agent, **I want** factual draft explaining refund policy, **so that** I can communicate policy clearly without ambiguity.

**Acceptance Criteria**:
1. Given refund request, When GPT drafts response, Then output cites exact refund policy from Trial & Subscription.md
2. Given refund outside policy, When drafting, Then output explains "no refunds after 14 days" with empathetic but firm tone
3. Given factual tone, When validating, Then Quality Validator ensures no hedging language ("we'll try", "maybe")
<!-- /ANCHOR:user-stories -->

---

<!-- ANCHOR:approval-workflow -->
## 12. APPROVAL WORKFLOW

| Checkpoint | Approver | Status | Date |
|------------|----------|--------|------|
| Spec Review | Michel Kerkmeester (System Architect) | Approved | 2026-02-15 |
| KB Architecture Review | Michel Kerkmeester (System Architect) | Pending | |
| Voice Profile Validation | Floris (Sales Ops, Dutch) | Pending | |
| Voice Profile Validation | Sam (Sales Ops, English) | Pending | |
| Template Accuracy Review | Sales Ops Team | Pending | |
| Integration Test Sign-Off | Michel Kerkmeester (System Architect) | Pending | |
| Launch Approval | Sales Team Lead | Pending | |
<!-- /ANCHOR:approval-workflow -->

---

<!-- ANCHOR:compliance -->
## 13. COMPLIANCE CHECKPOINTS

### Content Compliance
- [ ] All pricing figures verified against finance records (EUR 129/mo quarterly, EUR 64/mo annual, EUR 492/quarter Managed)
- [ ] Trial terms legally accurate (14 days OR first creator acceptance)
- [ ] Cancellation process matches actual company workflow
- [ ] Refund policy aligned with company policy (verified with finance)
- [ ] No unauthorized promises or commitments in templates

### Brand Compliance
- [ ] "Creators" terminology enforced (never "influencers") - HARD BLOCKER
- [ ] EUR currency only (never USD, $, or euro symbol) - HARD BLOCKER
- [ ] Human Voice Rules compliance across all KB documents
- [ ] No marketing hyperbole in factual explanations
- [ ] Barter stats accurate and up-to-date (26K+ creators, 1000+ brands)

### Data Protection
- [ ] No PII stored in ChatGPT Custom GPT
- [ ] Partner email content not retained beyond session
- [ ] Export files saved to local system only (not cloud-synced without approval)
- [ ] GDPR escalation path documented for data requests
<!-- /ANCHOR:compliance -->

---

<!-- ANCHOR:stakeholders -->
## 14. STAKEHOLDER MATRIX

| Stakeholder | Role | Interest | Communication | Decision Authority |
|-------------|------|----------|---------------|-------------------|
| Michel Kerkmeester | System Architect | High - Architecture, KB structure, quality standards | Async review of all KB documents | Final approval on architecture decisions (ADR-001 through ADR-004) |
| Floris | Sales Ops (Dutch) | High - Daily user, Dutch voice profile owner | Weekly sync during build, daily during testing | Approval authority on Dutch voice profile and templates |
| Sam | Sales Ops (English) | High - Daily user, English voice profile owner | Weekly sync during build, daily during testing | Approval authority on English voice profile and templates |
| Sales Team Lead | Operations | Medium - Process efficiency, adoption metrics | Bi-weekly status updates | Launch approval, resource allocation |
| Finance | Pricing accuracy | Low - Consulted for pricing/refund policy verification | Ad-hoc verification requests | Veto authority on pricing/refund information |
<!-- /ANCHOR:stakeholders -->

---

<!-- ANCHOR:changelog -->
## 15. CHANGE LOG

### v1.0 (2026-02-15)
**Initial specification** - Level 3 spec created with 8 user stories, 12 requirements, 6 risks, complexity score 53/100.

### v1.1 (2026-02-15)
**Upgraded to Level 3+** - Added Approval Workflow, Compliance Checkpoints, Stakeholder Matrix, Change Log sections for governance oversight.
<!-- /ANCHOR:changelog -->

---

<!-- ANCHOR:questions -->
## 16. OPEN QUESTIONS

- Should system support multi-topic emails in one draft, or enforce single-topic responses?
- What is the escalation path for legal/GDPR requests that are out of scope?
- Should Interactive Mode be mandatory for all queries, or only when tone is ambiguous?
- How frequently should pricing documentation be reviewed (quarterly vs. monthly)?
- Should voice profiles support blended Floris-Sam for bilingual partners, or enforce strict language routing?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`

---

<!--
LEVEL 3+ SPEC (~400 lines)
- Core + L2 + L3 + L3+ addendums
- Approval Workflow, Compliance, Stakeholders
- Full governance controls
-->
