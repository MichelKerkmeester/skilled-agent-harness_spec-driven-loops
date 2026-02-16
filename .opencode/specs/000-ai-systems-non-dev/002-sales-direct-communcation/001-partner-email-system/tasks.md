# Tasks: Partner Communication AI System
<!-- SPECKIT_LEVEL: 3+ -->

## Overview

This document provides a complete task breakdown for implementing the Partner Communication AI System. Tasks are organized by implementation phase, with dependencies and parallelization opportunities clearly marked.

<!-- ANCHOR:notation -->
## Task Notation

| Symbol | Meaning                    |
|--------|---------------------------|
| [ ]    | Pending                   |
| [x]    | Completed                 |
| [P]    | Parallelizable (no deps) |
| [B]    | Blocked (has dependencies)|

**Task Format:** `T### [P?] Description (affected files/paths)`

**Estimation Legend:**
- XS: <1 hour
- S: 1-3 hours
- M: 3-8 hours
- L: 8-16 hours
- XL: >16 hours
<!-- /ANCHOR:notation -->

---

## All Tasks by Phase

<!-- ANCHOR:phase-1 -->
### Phase 1: Foundation (Core System Files)

**Goal:** Establish directory structure, system configuration, and core processing logic.

- [ ] **T001** [XS] Create directory structure
  - **Estimate:** 30 minutes
  - **Files:** `6. Sales - Direct Communication/` with subdirectories:
    - `knowledge base/system/`
    - `knowledge base/context/`
    - `knowledge base/voice/`
    - `knowledge base/rules/`
    - `export/`
    - `memory/sessions/`
    - `memory/decisions/`
    - `memory/patterns/`
    - `memory/z — Archive/`
  - **Acceptance Criteria:**
    - All directories created with correct naming
    - Permissions set appropriately
    - README.md stub placed in root directory

- [ ] **T002** [S] Write AGENTS.md configuration
  - **Estimate:** 2 hours
  - **Files:** `6. Sales - Direct Communication/AGENTS.md`
  - **Dependencies:** T001
  - **Content Requirements:**
    1. **Context Override Section:** Partner Communication Specialist role definition, scope boundaries, escalation triggers
    2. **Export Protocol:** Save all drafted emails to `export/` with timestamp naming convention
    3. **Reading Instructions:** DAG (Directed Acyclic Graph) loading order for knowledge base files
    4. **Processing Hierarchy:** 10-step email pipeline (input validation → language detection → topic identification → intent classification → knowledge retrieval → template selection → draft generation → quality check → voice validation → output)
  - **Acceptance Criteria:**
    - All 4 sections complete
    - DAG correctly sequences knowledge base loading
    - Export protocol includes filename format and metadata requirements
    - Processing hierarchy matches system prompt logic

- [ ] **T003** [M] Write System Prompt
  - **Estimate:** 5 hours
  - **Files:** `knowledge base/system/Sales - System - Prompt - v0.100.md`
  - **Dependencies:** T001, T002
  - **Content Requirements:**
    1. **Routing Logic:** Topic-to-knowledge-section mapping with fallback handling
    2. **Command Shortcuts:**
       - `$reply` (draft response to incoming email)
       - `$draft` (draft new outbound email)
       - `$trial` (trial explanation template)
       - `$billing` (billing issue template)
       - `$cancel` (cancellation handling)
       - `$pricing` (pricing inquiry)
       - `$managed` (Barter Managed pitch)
       - `$quick` (quick factual response)
       - `$floris` (force Dutch/Floris voice)
       - `$sam` (force English/Sam voice)
    3. **Confidence Thresholds:**
       - HIGH: 0.85+ (auto-send with human review)
       - MEDIUM: 0.60-0.84 (present with warnings)
       - LOW: 0.40-0.59 (escalate to human)
       - FALLBACK: <0.40 (refuse + explain)
    4. **Semantic Topic Registry:** 20+ topics mapped to KB sections:
       - Trial (explanation, extension, terms)
       - Billing (invoices, payment methods, refunds)
       - Cancellation (process, retention, data handling)
       - Pricing (plans, discounts, upgrades)
       - Platform (how it works, creator network, deal flow)
       - Managed Services (pitch, pricing, benefits)
       - Technical (bugs, features, integrations)
       - Onboarding (first steps, deal optimization)
       - Creator Communication (matching, quality, delivery)
       - Account Issues (access, settings, security)
    5. **Language Detection:** Auto-match Dutch → Floris voice, English → Sam voice, with manual override commands
  - **Acceptance Criteria:**
    - All command shortcuts functional
    - Confidence thresholds validated against test cases
    - Topic registry covers all common partner inquiries
    - Language detection works bidirectionally

- [ ] **T004** [M] Write Communication Framework
  - **Estimate:** 4 hours
  - **Files:** `knowledge base/system/Sales - Thinking - Communication Framework - v0.100.md`
  - **Dependencies:** T001, T003
  - **Content Requirements:**
    1. **Topic Identification:** Multi-pass semantic analysis (keyword scan → intent extraction → context enrichment)
    2. **Intent Classification:** Factual (information request) vs. Persuasive (sales/retention) with hybrid handling
    3. **Template Selection Logic:** Decision tree mapping (topic + intent + language) → template
    4. **Email Quality Scoring:** 5-dimension rubric:
       - **Clarity** (0-10): Clear purpose, scannable structure, no jargon
       - **Accuracy** (0-10): Correct pricing, terms, platform details
       - **Tone** (0-10): Voice profile match, appropriate formality, human warmth
       - **Actionability** (0-10): Clear next steps, links/instructions provided
       - **Language** (0-10): Grammar, spelling, natural phrasing (no AI tells)
    5. **Minimum Score Thresholds:** Total ≥40/50 to proceed, any dimension <6 triggers rewrite
  - **Acceptance Criteria:**
    - Topic identification tested on 20+ sample emails
    - Intent classification achieves >90% accuracy on test set
    - Template selection logic produces correct template for all test scenarios
    - Quality rubric validated by Floris & Sam
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
### Phase 2: Knowledge Base (Context Documents)

**Goal:** Build comprehensive knowledge repository covering platform, pricing, policies, and procedures.

- [ ] **T005** [P] [M] Write Platform Knowledge
  - **Estimate:** 6 hours
  - **Files:** `knowledge base/context/Sales - Context - Platform Knowledge - v0.100.md`
  - **Dependencies:** T001
  - **Content Requirements:**
    1. **How Barter Works:** Creator-partner collaboration model, deal flow (discovery → chat → agreement → delivery → approval)
    2. **Deal Types:**
       - **Product Deals:** Partners provide physical products, creators produce content
       - **Service Deals:** Partners provide services (hotels, restaurants), creators produce content
    3. **Creator Network:** 26,000+ creators, multi-platform (Instagram, TikTok, YouTube), verified quality metrics
    4. **Creator Matching:** Algorithm factors (audience alignment, engagement rates, past performance, content style)
    5. **Chat System:** In-platform negotiation, proposal templates, deal terms discussion
    6. **Content Delivery:** Upload process, approval workflow, revision requests, final delivery
  - **Acceptance Criteria:**
    - All 6 sections complete with examples
    - Technical accuracy verified by product team
    - Common partner questions addressed (minimum 10 FAQ equivalents)

- [ ] **T006** [P] [M] Write Pricing & Plans
  - **Estimate:** 5 hours
  - **Files:** `knowledge base/context/Sales - Context - Pricing & Plans - v0.100.md`
  - **Dependencies:** T001
  - **Content Requirements:**
    1. **Quarterly Plan:** EUR 129/month, billed EUR 387 quarterly
    2. **Annual Plan:** EUR 64/month, billed EUR 768 annually (50% savings)
    3. **Barter Managed:** EUR 492/quarter, includes 10 guaranteed video deliveries + account management
    4. **Payment Methods:** Credit card (Stripe), bank transfer (manual invoice), PayPal (on request)
    5. **Billing Cycles:** Automatic renewal, 7-day payment grace period, subscription pause not available
    6. **Invoice Download:** Settings → Subscriptions → Download Invoice (with screenshots)
  - **Acceptance Criteria:**
    - All pricing accurate and up-to-date (verified with finance)
    - Managed plan benefits clearly differentiated
    - Invoice download steps include visual guide
    - Common pricing questions addressed (discounts, refunds, proration)

- [ ] **T007** [P] [M] Write Trial & Subscription
  - **Estimate:** 4 hours
  - **Files:** `knowledge base/context/Sales - Context - Trial & Subscription - v0.100.md`
  - **Dependencies:** T001
  - **Content Requirements:**
    1. **Trial Duration:** 14 days OR until first creator accepts proposal (whichever comes first)
    2. **Trial Start Triggers:** Account creation, no credit card required
    3. **Auto-Start Paid Subscription:** Triggered when trial ends (creator acceptance or 14 days)
    4. **Cancellation Process:** Email-only (no dashboard option), must include account email, processed within 48 hours
    5. **Refund Handling:**
       - Within 7 days of charge: Full refund
       - 8-14 days: Prorated refund
       - Beyond 14 days: No refund (policy exception approval required)
    6. **Subscription Management:** Upgrade/downgrade timing, billing impact, data retention post-cancellation
  - **Acceptance Criteria:**
    - Trial terms precisely worded (legal approval if needed)
    - Cancellation process matches actual workflow
    - Refund policy aligns with company policy (verified with finance)
    - Edge cases documented (trial extension, paused accounts, reactivation)

- [ ] **T008** [P] [XS] Symlink Brand Context
  - **Estimate:** 15 minutes
  - **Files:** `knowledge base/context/Sales - Context - Brand - v0.110.md` → Global shared brand document
  - **Dependencies:** T001
  - **Content Requirements:**
    - Create symlink to global brand voice document
    - Verify brand document includes: tone guidelines, visual identity, messaging pillars, competitor positioning
  - **Acceptance Criteria:**
    - Symlink functional and points to correct global document
    - Brand document accessible and up-to-date
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
### Phase 3: Voice & Rules

**Goal:** Define voice profiles for Floris and Sam, create response templates, and establish quality standards.

- [ ] **T009** [L] Write Floris Voice Profile
  - **Estimate:** 10 hours
  - **Files:** `knowledge base/voice/Sales - Voice - Floris Style - v0.100.md`
  - **Dependencies:** T001
  - **Content Requirements:**
    1. **Dutch Communication Patterns:**
       - **Opening:** "Bedankt voor je bericht" or "Leuk om van je te horen"
       - **Closing:** "Fijne dag," or "Veel succes,"
       - **Tone:** Zakelijk-direct (business-direct), gestructureerd (structured), professioneel met lichte warmte (professional with slight warmth)
    2. **Email Structure:**
       - Short opening (1 sentence)
       - Structured body (bullets for multi-point responses)
       - Clear next step
       - Warm but concise closing
    3. **Language Characteristics:**
       - Use "je" (informal you) for existing partners, "u" (formal you) for first contact or enterprise
       - Avoid marketing jargon
       - Prefer short sentences (max 20 words)
       - Use active voice
    4. **Example Emails:** Minimum 10 complete examples covering:
       - Trial explanation
       - Cancellation handling
       - Pricing inquiry
       - Technical issue
       - Managed pitch
       - Deal optimization advice
       - Complaint response
       - Invoice request
       - Upgrade suggestion
       - Onboarding guidance
  - **Acceptance Criteria:**
    - All example emails reviewed and approved by Floris
    - Voice profile captures Floris's actual communication style (validated against 20+ real emails)
    - Language rules tested with Dutch native speaker

- [ ] **T010** [P] [L] Write Sam Voice Profile
  - **Estimate:** 10 hours
  - **Files:** `knowledge base/voice/Sales - Voice - Sam Style - v0.100.md`
  - **Dependencies:** T001
  - **Content Requirements:**
    1. **English Communication Patterns:**
       - **Opening:** "Hi [first name]," or "Thanks for reaching out"
       - **Closing:** "Kind regards," or "Best,"
       - **Tone:** Professional-direct, solution-focused, short paragraphs, conversational but business-appropriate
    2. **Email Structure:**
       - Friendly opening
       - Concise explanation (2-3 short paragraphs max)
       - Bulleted action items if multiple steps
       - Offer to help further
    3. **Language Characteristics:**
       - Use first names (never "Mr./Ms.")
       - Contractions acceptable ("we're", "you'll")
       - Avoid filler words ("actually", "basically")
       - Prefer American English spelling
    4. **Example Emails:** Minimum 10 complete examples covering same topics as Floris profile
  - **Acceptance Criteria:**
    - All example emails reviewed and approved by Sam
    - Voice profile captures Sam's actual communication style (validated against 20+ real emails)
    - Language rules tested with native English speaker

- [ ] **T011** [B:T009,T010] [XL] Write Response Templates
  - **Estimate:** 20 hours
  - **Files:** `knowledge base/voice/Sales - Voice - Response Templates - v0.100.md`
  - **Dependencies:** T009, T010 (must have voice profiles complete)
  - **Content Requirements:**
    - **20+ Topic-Specific Templates** (each in Dutch/Floris AND English/Sam versions):
      1. Trial explanation (how it works, duration, conversion)
      2. Trial extension (policy, exceptions, process)
      3. Cancellation (acknowledge, confirm, retention attempt)
      4. Refund (policy explanation, timeline, process)
      5. Invoice request (download steps, alternative delivery)
      6. Pricing inquiry (plan comparison, value proposition)
      7. Discount request (policy, exceptions, alternative offers)
      8. Payment issues (troubleshooting, alternative methods)
      9. Upgrade (benefits, timing, billing impact)
      10. Onboarding (first steps, quick wins, resources)
      11. Deal optimization (creator selection tips, proposal best practices)
      12. Creator communication (response times, negotiation tips)
      13. Creator quality concerns (vetting process, reporting issues)
      14. Content approval (process, revision requests, deadlines)
      15. Bug report (acknowledgment, troubleshooting, escalation)
      16. Feature request (roadmap mention, workarounds)
      17. Booking call (Calendly link, preparation tips)
      18. Complaint (empathy, solution, follow-up commitment)
      19. Barter Managed pitch (benefits, pricing, onboarding)
      20. Account access issues (password reset, login troubleshooting)
    - **Template Structure:**
      - Subject line suggestions (3 options per template)
      - Opening (voice-specific)
      - Body (with [VARIABLE] placeholders for personalization)
      - Closing (voice-specific)
      - Optional attachments/links
  - **Acceptance Criteria:**
    - All 20+ templates complete in both languages
    - Variables clearly marked and documented
    - Voice consistency validated by Floris & Sam
    - Templates tested with 5 real partner scenarios each

- [ ] **T012** [P] [M] Write Communication Standards
  - **Estimate:** 4 hours
  - **Files:** `knowledge base/rules/Sales - Rules - Communication Standards - v0.100.md`
  - **Dependencies:** T001
  - **Content Requirements:**
    1. **Email Structure Rules:**
       - Maximum 3 paragraphs for factual responses
       - Maximum 5 paragraphs for persuasive/complex topics
       - Use bullets for 3+ items
       - One clear call-to-action per email
    2. **Formatting Standards:**
       - NO bold text (exception: critical alerts like "URGENT")
       - NO dashes for bullets (use •)
       - NO hashtags or emojis
       - NO all-caps words
       - Maximum 1 exclamation point per email
    3. **Persuasive vs. Factual Tone Switching:**
       - **Factual:** Information requests, technical issues, policy explanations (neutral, concise)
       - **Persuasive:** Retention, upsells, onboarding (warm, benefit-focused, light urgency)
       - **Hybrid:** Complaints (empathy + solution), trial conversions (value + urgency)
    4. **Language Matching:**
       - Auto-detect incoming email language
       - Match response language unless manual override
       - Never mix languages in one email
    5. **Prohibited Patterns:**
       - AI-sounding phrases ("I'm here to help", "feel free to reach out", "happy to assist")
       - Corporate jargon ("synergy", "leverage", "touch base")
       - Excessive apologies (max 1 per email)
       - Passive voice (prefer active)
  - **Acceptance Criteria:**
    - All rules tested against 20+ email samples
    - Prohibited patterns list validated by sales ops
    - Tone switching logic produces correct tone for all test scenarios

- [ ] **T013** [B:T004] [M] Write Quality Validators
  - **Estimate:** 6 hours
  - **Files:** `knowledge base/rules/Sales - Rules - Quality Validators - v0.100.md`
  - **Dependencies:** T004 (requires Communication Framework complete)
  - **Content Requirements:**
    1. **5-Dimension Email Quality Rubric:**
       - **Clarity (0-10):** Scoring criteria for each level (10 = crystal clear purpose, 5 = somewhat vague, 0 = incomprehensible)
       - **Accuracy (0-10):** Pricing correctness, policy adherence, platform detail precision
       - **Tone (0-10):** Voice profile match, formality appropriateness, human warmth presence
       - **Actionability (0-10):** Next steps clarity, link/resource provision, decision ease
       - **Language (0-10):** Grammar, spelling, natural phrasing, AI-tell absence
    2. **Hard Blockers (Auto-Reject):**
       - Wrong pricing (incorrect EUR amounts, outdated plans)
       - Wrong trial terms (incorrect duration or conversion trigger)
       - AI-sounding language (prohibited phrases from T012)
       - Language mismatch (Dutch response to English email without reason)
       - Missing critical information (no next step, no contact info)
    3. **Pre-Send Checklist:**
       - [ ] Subject line present and relevant
       - [ ] Greeting includes correct name/formalization
       - [ ] Body addresses all points from incoming email
       - [ ] Tone matches voice profile (Floris/Sam)
       - [ ] No placeholders or [VARIABLES] remain
       - [ ] Links/attachments functional and correct
       - [ ] Closing signature present
       - [ ] Quality score ≥40/50
       - [ ] No hard blockers triggered
  - **Acceptance Criteria:**
    - Rubric tested on 30+ email samples with consistent scoring
    - Hard blockers catch all critical errors (100% detection on test set)
    - Pre-send checklist integrated into system prompt workflow

- [ ] **T014** [P] [XS] Symlink Human Voice Rules
  - **Estimate:** 15 minutes
  - **Files:** `knowledge base/rules/Sales - Rules - Human Voice - v0.101.md` → Global shared document
  - **Dependencies:** T001
  - **Content Requirements:**
    - Create symlink to global human voice rules
    - Verify global doc includes: AI-tell avoidance, natural phrasing patterns, warmth without cliche
  - **Acceptance Criteria:**
    - Symlink functional and points to correct global document
    - Global doc accessible and current
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
### Phase 4: Interactive & Support

**Goal:** Implement interactive mode for context gathering and set up memory infrastructure.

- [ ] **T015** [B:T003] [M] Write Interactive Mode
  - **Estimate:** 5 hours
  - **Files:** `knowledge base/system/Sales - System - Interactive Mode - v0.100.md`
  - **Dependencies:** T003 (requires System Prompt complete)
  - **Content Requirements:**
    1. **Context Gathering Flow:**
       - Prompt 1: "Please paste the incoming email you're responding to."
       - Prompt 2: "What's the main goal of your response? (e.g., explain trial, handle cancellation, pitch Managed)"
       - Prompt 3: "Any specific points to emphasize or avoid?"
       - (Optional) Prompt 4: "Force Floris or Sam voice? (auto-detect if not specified)"
    2. **Command Detection:**
       - Recognize shortcut commands ($reply, $draft, etc.)
       - Auto-fill context for command-triggered workflows
       - Allow mid-session command switching
    3. **Language Auto-Detect:**
       - Scan incoming email for Dutch/English markers
       - Propose voice match (Floris/Sam)
       - Allow manual override
    4. **Error Recovery:**
       - Missing incoming email → re-prompt
       - Unclear goal → suggest common scenarios
       - Low confidence → ask clarifying questions before drafting
  - **Acceptance Criteria:**
    - Interactive flow tested with 10+ user sessions
    - Command detection works for all 10 shortcuts
    - Language auto-detect achieves >95% accuracy on test emails
    - Error recovery handles all common failure modes

- [ ] **T016** [P] [S] Set up memory structure
  - **Estimate:** 3 hours
  - **Files:**
    - `memory/README.md`
    - `memory/sessions/` (session logs with timestamp)
    - `memory/decisions/` (ADRs for system changes)
    - `memory/patterns/` (recurring issues, common questions)
    - `memory/z — Archive/` (deprecated content)
  - **Dependencies:** T001
  - **Content Requirements:**
    1. **README.md:** Memory system purpose, file naming conventions, archival policy
    2. **Session Logs:** Template for capturing email context, AI decisions, human feedback
    3. **Decision Records:** ADR template for documenting system prompt changes, template updates, rule additions
    4. **Pattern Tracking:** Format for recording recurring partner questions, edge cases, system failures
  - **Acceptance Criteria:**
    - All directories created with README files
    - Templates provided for each memory type
    - Archival policy defined (>90 days old + inactive → archive)
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:phase-5 -->
### Phase 5: Testing & Validation

**Goal:** Validate system performance across languages, topics, and voice profiles.

- [ ] **T017** [B:T001-T016] [M] Test with 5 Dutch email scenarios
  - **Estimate:** 6 hours
  - **Dependencies:** All Phase 1-4 tasks complete
  - **Test Scenarios:**
    1. **Trial Question:** Partner asks how trial works and when billing starts → Expect: `$trial` template, Floris voice, clear trial terms, auto-start explanation
    2. **Cancellation Request:** Partner wants to cancel subscription → Expect: Acknowledge, process confirmation, gentle retention attempt (1 sentence), Floris tone
    3. **Pricing Inquiry:** Partner compares quarterly vs annual → Expect: Side-by-side comparison, savings calculation, no aggressive upsell
    4. **Complaint:** Partner frustrated with creator response time → Expect: Empathy opening, explanation of chat system norms, offer to escalate, follow-up commitment
    5. **Managed Pitch:** Opportunity to upsell struggling partner → Expect: Benefits-focused, concrete value (10 videos), pricing clear, soft CTA
  - **Validation Criteria:**
    - All outputs in Dutch
    - Floris voice characteristics present (opening, closing, tone)
    - Quality scores ≥40/50 for all 5
    - No hard blockers triggered
    - Floris approval on all outputs

- [ ] **T018** [B:T001-T016] [M] Test with 5 English email scenarios
  - **Estimate:** 6 hours
  - **Dependencies:** All Phase 1-4 tasks complete
  - **Test Scenarios:**
    1. **Trial Terms Question:** Partner asks about trial duration and conversion → Expect: `$trial` template, Sam voice, precise terms, friendly tone
    2. **Refund Request:** Partner wants refund 10 days after charge → Expect: Policy explanation (prorated eligible), process steps, timeline commitment
    3. **Deal Optimization:** Partner struggling to get creator responses → Expect: Tactical advice (proposal tips, pricing guidance), encouragement, resource links
    4. **Creator Quality Concern:** Partner received low-quality content → Expect: Vetting process explanation, revision request steps, quality commitment
    5. **Booking Call:** Partner wants to discuss Managed services → Expect: Calendly link, brief prep tips, enthusiasm about helping
  - **Validation Criteria:**
    - All outputs in English
    - Sam voice characteristics present (opening, closing, tone)
    - Quality scores ≥40/50 for all 5
    - No hard blockers triggered
    - Sam approval on all outputs

- [ ] **T019** [B:T003] [M] Validate topic routing accuracy across all 20+ topics
  - **Estimate:** 5 hours
  - **Dependencies:** T003 (System Prompt with topic registry)
  - **Test Method:**
    - Create 3 sample emails per topic (60+ total)
    - Run through topic identification pipeline
    - Measure correct topic assignment rate
  - **Validation Criteria:**
    - Topic routing accuracy ≥95%
    - Fallback handling works for ambiguous emails
    - Multi-topic emails handled correctly (primary topic selected)

- [ ] **T020** [B:T009,T010] [S] Validate voice profile consistency
  - **Estimate:** 3 hours
  - **Dependencies:** T009, T010 (Floris & Sam voice profiles)
  - **Test Method:**
    - Generate 10 emails each in Floris and Sam voices
    - Blind review by Floris/Sam (can they identify their own voice?)
    - Check opener/closer consistency, tone accuracy
  - **Validation Criteria:**
    - Floris correctly identifies Floris outputs ≥9/10
    - Sam correctly identifies Sam outputs ≥9/10
    - No language mixing detected
    - Correct openers/closers used 100% of the time

- [ ] **T021** [B:T017-T020] [L] Sales Ops review round
  - **Estimate:** 8 hours (includes Floris & Sam review time + iteration)
  - **Dependencies:** T017, T018, T019, T020 (all testing complete)
  - **Process:**
    1. Present system outputs for all test scenarios (10 Dutch + 10 English)
    2. Floris reviews Dutch outputs, provides feedback
    3. Sam reviews English outputs, provides feedback
    4. Collect feedback on: accuracy, tone, completeness, edge cases missed
    5. Schedule follow-up review after iteration (T022)
  - **Validation Criteria:**
    - Both Floris and Sam complete reviews
    - Feedback documented in `memory/decisions/sales-ops-review-round-1.md`
    - Sign-off received OR specific iteration requests logged

- [ ] **T022** [B:T021] [M] Iterate on templates and standards based on feedback
  - **Estimate:** 6 hours
  - **Dependencies:** T021 (requires Sales Ops feedback)
  - **Iteration Scope:**
    - Update response templates (T011) based on tone/accuracy feedback
    - Revise communication standards (T012) for missed edge cases
    - Adjust voice profiles (T009, T010) if consistency issues found
    - Re-run failed test scenarios (T017, T018)
  - **Validation Criteria:**
    - All feedback items addressed (documented in update notes)
    - Re-testing passes for previously failed scenarios
    - Final sign-off received from Floris & Sam
<!-- /ANCHOR:phase-5 -->

---

## Task Dependencies Visualization

```
Phase 1: Foundation
T001 (dir structure) → [T002, T003, T004, T005, T006, T007, T008, T009, T010, T012, T014, T016]
T002 (AGENTS.md) → T003
T003 (System Prompt) → [T004, T015, T019]
T004 (Comm Framework) → T013

Phase 2: Knowledge Base
[T005, T006, T007, T008] can run in parallel

Phase 3: Voice & Rules
T009 (Floris Voice) → [T011, T020]
T010 (Sam Voice) → [T011, T020]
T004 → T013
[T012, T014] can run in parallel

Phase 4: Interactive & Support
T003 → T015
T001 → T016

Phase 5: Testing & Validation
[T001-T016] → T017
[T001-T016] → T018
T003 → T019
[T009, T010] → T020
[T017, T018, T019, T020] → T021
T021 → T022
```

---

<!-- ANCHOR:completion -->
## Completion Criteria

The Partner Communication AI System is considered complete when:

1. **All Phase 1-4 tasks completed** (T001-T016)
   - Directory structure in place
   - All knowledge base files written and validated
   - Voice profiles approved by Floris & Sam
   - Response templates cover all 20+ topics
   - Quality validators functional

2. **All Phase 5 tests pass** (T017-T020)
   - Dutch test scenarios: 5/5 pass with Floris approval
   - English test scenarios: 5/5 pass with Sam approval
   - Topic routing accuracy: ≥95%
   - Voice profile consistency: ≥90%

3. **Sales Ops sign-off received** (T021)
   - Floris approves Dutch outputs
   - Sam approves English outputs
   - No critical feedback remaining

4. **Feedback iteration complete** (T022)
   - All feedback items addressed
   - Re-testing confirms improvements
   - Final sign-off documented
<!-- /ANCHOR:completion -->

---

## Workstream Tags

Tasks can be filtered by workstream using these tags:

- **[W:FOUNDATION]:** T001-T004
- **[W:KNOWLEDGE]:** T005-T008
- **[W:VOICE]:** T009-T011
- **[W:RULES]:** T012-T014
- **[W:INTERACTIVE]:** T015-T016
- **[W:TESTING]:** T017-T022

---

## AI Execution Protocol

### Pre-Task Checklist (Run Before Every Task)
1. **Context Load**: Read AGENTS.md architecture pattern from reference systems (1-Copywriter, 4-Pieter, 5-Nigel)
2. **Template Check**: Verify KB naming convention: `[System] - [Category] - [Name] - v[X.YYY].md`
3. **Dependency Scan**: Confirm all blocked-by tasks are complete before starting
4. **Scope Boundary**: Verify task scope matches plan.md phase definition (no scope creep)

### Execution Rules
- **One KB document per task** — do not combine multiple documents into one task
- **Version on creation** — all new files start at v0.100, shared resources use their existing version
- **Cross-reference check** — after completing any context/ or voice/ document, verify pricing/trial references are accurate
- **Export before done** — save all deliverables before marking task complete

### Status Tracking Protocol
| Status | Symbol | When to Use |
|--------|--------|-------------|
| Not Started | `[ ]` | Task not yet begun |
| In Progress | `[~]` | Actively being worked on |
| Completed | `[x]` | Done and verified |
| Blocked | `[B]` | Waiting on dependency |
| Parallelizable | `[P]` | Can run concurrently with other [P] tasks |

### Agent Assignment Matrix

| Agent Role | Assigned Tasks | Workstream |
|------------|---------------|------------|
| System Architect | T001, T002, T003, T004, T019 | W-FOUNDATION |
| Knowledge Agent A | T005, T006 | W-KNOWLEDGE |
| Knowledge Agent B | T007, T008 | W-KNOWLEDGE |
| Voice Agent A | T009 | W-VOICE |
| Voice Agent B | T010 | W-VOICE |
| Template Agent | T011 | W-VOICE |
| Rules Agent | T012, T013, T014 | W-RULES |
| Interactive Agent | T015, T016 | W-INTERACTIVE |
| Test Agent (Dutch) | T017 | W-TESTING |
| Test Agent (English) | T018 | W-TESTING |
| Validation Agent | T020 | W-TESTING |
| Review Coordinator | T021, T022 | W-TESTING |

---

## Workstream Organization

### W-FOUNDATION (Core System)
**Owner**: System Architect
**Tasks**: T001, T002, T003, T004
**Critical Path**: Yes — all other workstreams depend on W-FOUNDATION completion
**Estimated Duration**: 11.5 hours (sequential: T001 → T002 → T003 → T004)

### W-KNOWLEDGE (Context Documents)
**Owner**: Knowledge Agents A + B (parallel)
**Tasks**: T005, T006, T007, T008
**Dependencies**: T001 (directory structure)
**Estimated Duration**: 6 hours (parallel execution, longest task T005)
**Parallelization**: T005 ‖ T006 ‖ T007 ‖ T008

### W-VOICE (Voice Profiles + Templates)
**Owner**: Voice Agents A + B, then Template Agent
**Tasks**: T009, T010, T011
**Dependencies**: T001 (for T009/T010), T009 + T010 (for T011)
**Estimated Duration**: 20 hours (T009 ‖ T010 → T011)
**Parallelization**: T009 ‖ T010 (then T011 sequential)

### W-RULES (Standards + Validators)
**Owner**: Rules Agent
**Tasks**: T012, T013, T014
**Dependencies**: T001 (for T012/T014), T004 (for T013)
**Estimated Duration**: 10.25 hours (T012 ‖ T014, then T013)
**Parallelization**: T012 ‖ T014

### W-INTERACTIVE (User Experience)
**Owner**: Interactive Agent
**Tasks**: T015, T016
**Dependencies**: T003 (for T015), T001 (for T016)
**Estimated Duration**: 8 hours
**Parallelization**: T015 ‖ T016

### W-TESTING (Validation)
**Owner**: Test Agents + Review Coordinator
**Tasks**: T017, T018, T019, T020, T021, T022
**Dependencies**: All Phase 1-4 tasks complete
**Estimated Duration**: 34 hours (T017 ‖ T018 ‖ T019 ‖ T020 → T021 → T022)
**Parallelization**: T017 ‖ T018 ‖ T019 ‖ T020

### Workstream Dependency Flow
```
W-FOUNDATION ──────────┐
                       ├──► W-KNOWLEDGE ──────┐
                       ├──► W-VOICE ──────────┼──► W-TESTING
                       ├──► W-RULES ──────────┤
                       └──► W-INTERACTIVE ────┘
```

---

## Effort Summary

| Phase | Total Effort | Critical Path |
|-------|--------------|---------------|
| Phase 1: Foundation | 11.5 hours | T001 → T002 → T003 → T004 |
| Phase 2: Knowledge Base | 15.25 hours | (All parallelizable) |
| Phase 3: Voice & Rules | 40.5 hours | T009/T010 → T011 |
| Phase 4: Interactive & Support | 8 hours | T003 → T015 |
| Phase 5: Testing & Validation | 34 hours | All prior tasks → T017-T020 → T021 → T022 |
| **TOTAL** | **~109 hours** | **~13-15 days** (assuming 8-hour workdays) |

---

## Risk Mitigation

| Risk | Mitigation Strategy | Contingency |
|------|---------------------|-------------|
| Voice profiles don't capture Floris/Sam style accurately | Review 20+ real emails per person during T009/T010, iterative approval | Add Phase 5.5: Extended voice tuning with more examples |
| Template coverage incomplete (missing common scenarios) | Cross-reference against 6 months of partner support tickets | Add templates reactively during first 30 days live |
| Topic routing fails on edge cases | Build test set from real ambiguous emails, expand semantic registry | Implement confidence-based escalation (MEDIUM/LOW → human review) |
| Sales Ops feedback requires major rework | Build feedback checkpoints into each phase (T009/T010/T011 mini-reviews) | Allocate 20% time buffer for iteration (already in T022 estimate) |

---

## Next Steps After Completion

1. **Deploy to Production:**
   - Set up Claude Projects with knowledge base files
   - Configure export/ directory sync to shared drive
   - Train Floris & Sam on command shortcuts

2. **Monitoring & Iteration:**
   - Track quality scores for first 100 emails
   - Log edge cases in `memory/patterns/`
   - Monthly review of templates based on usage analytics

3. **Expansion Opportunities:**
   - Multilingual support (German, French)
   - Proactive email campaigns (onboarding sequences)
   - Integration with CRM (auto-draft responses to ticket system)

---

**Document Version:** v1.0
**Last Updated:** 2026-02-15
**Owner:** Sales Ops (Floris & Sam)
**Review Cycle:** Monthly (or after every 500 emails processed)
