# Implementation Plan: Partner Communication AI System

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown knowledge documents (no code) |
| **Framework** | ChatGPT Custom GPT (knowledge base upload) |
| **Storage** | Git repository (version-controlled knowledge base) |
| **Testing** | Manual scenario testing + quality rubric validation |

### Overview
This system implements a knowledge engineering solution for automated partner email drafting within ChatGPT Custom GPT. The technical approach uses structured markdown documents to create a deterministic response system that routes incoming emails through topic classification, intent detection, voice profile selection, and template-based drafting with quality scoring before export.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented (spec.md complete)
- [ ] Success criteria measurable (quality rubric defined)
- [ ] Dependencies identified (Global shared resources mapped)
- [ ] Sales Ops team available for voice calibration review
- [ ] ChatGPT Custom GPT platform access confirmed
- [ ] Existing Floris/Sam GPT content accessible for migration

### Definition of Done
- [ ] All acceptance criteria met (10-stage processing pipeline functional)
- [ ] Tests passing (20+ topic scenarios validated manually)
- [ ] Docs updated (spec/plan/tasks complete, no placeholders)
- [ ] Voice profiles validated by Sales Ops (Floris Dutch + Sam English)
- [ ] Quality scoring rubric produces 8+ scores consistently
- [ ] Export protocol saves files to `export/` successfully
- [ ] All symlinks to Global shared resources active
- [ ] Knowledge base uploaded to ChatGPT Custom GPT
- [ ] Interactive mode handles context gathering and error recovery
- [ ] Pre-send checklist prevents hard blocker violations
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Knowledge Engineering with Deterministic State Machine (Directed Acyclic Graph routing)

### Key Components
- **AGENTS.md (Entry Point)**: Context override, export protocol, reading instructions DAG, processing hierarchy (10 stages)
- **System Prompt**: Routing logic, command registry ($reply/$draft/$trial/$billing/$cancel/$pricing/$managed/$quick), topic registry (20+ categories), language detection (Dutch/English)
- **Communication Framework**: Topic identification, intent classification (factual vs persuasive), template selection, quality scoring engine
- **Knowledge Base Modules**: Platform knowledge, pricing/plans, trial/subscription, brand context (symlink)
- **Voice Profiles**: Floris (Dutch patterns), Sam (English patterns), human voice rules (symlink)
- **Response Templates**: 20+ topic-specific templates with variable slots
- **Communication Standards**: Email structure, formatting rules, tone switching logic
- **Quality Validators**: Email quality rubric (10 criteria), hard blockers (4 categories), pre-send checklist
- **Interactive Mode**: Context gathering questions, command detection, error recovery prompts
- **Export Protocol**: File naming convention, directory structure, metadata headers

### Data Flow
```
1. User pastes incoming email → 2. Language detection (Dutch/English) →
3. Topic identification (20+ categories) → 4. Intent classification (factual/persuasive) →
5. Voice profile selection (Floris/Sam) → 6. Load relevant KB modules →
7. Draft reply using template + context → 8. Apply quality scoring (10 criteria) →
9. Export to file (export/YYYY-MM-DD_topic_sender.md) →
10. Present summary to user (score, blockers, next steps)
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Foundation (4-6 hours)
- [ ] Create directory structure (knowledge/, memory/, export/)
- [ ] Write AGENTS.md with context override section
- [ ] Write AGENTS.md export protocol (file naming, metadata headers)
- [ ] Write AGENTS.md reading instructions DAG (System Prompt → Framework → Voice → KB)
- [ ] Write AGENTS.md processing hierarchy (10-stage pipeline)
- [ ] Write System Prompt with routing logic
- [ ] Write System Prompt command registry ($reply/$draft/$trial/$billing/$cancel/$pricing/$managed/$quick)
- [ ] Write System Prompt topic registry (20+ categories: trial, billing, cancel, pricing, managed, technical support, integration, creator matching, deal approval, payment inquiry, feature request, bug report, partnership proposal, expansion, downgrade, pause request, reactivation, compliance, data export, account deletion)
- [ ] Write System Prompt language detection rules
- [ ] Write Communication Framework topic identification logic
- [ ] Write Communication Framework intent classification (factual vs persuasive)
- [ ] Write Communication Framework template selection algorithm
- [ ] Write Communication Framework quality scoring engine (10 criteria)

### Phase 2: Knowledge Base (6-8 hours)
- [ ] Write Platform Knowledge module (how Barter works)
- [ ] Write Platform Knowledge deal types (single, multiple, recurring)
- [ ] Write Platform Knowledge creator network details
- [ ] Write Platform Knowledge onboarding flow
- [ ] Write Pricing & Plans module (quarterly EUR 129/mo, annual EUR 64/mo)
- [ ] Write Pricing & Plans Managed tier (EUR 492/quarter, 4 deals/month)
- [ ] Write Pricing & Plans discount structure
- [ ] Write Pricing & Plans upgrade/downgrade rules
- [ ] Write Trial & Subscription module (14 days or first creator acceptance)
- [ ] Write Trial & Subscription auto-start logic
- [ ] Write Trial & Subscription cancellation policy
- [ ] Write Trial & Subscription pause/reactivation rules
- [ ] Create symlink to Global Brand Context (v0.110)
- [ ] Verify symlink integrity (Brand Context accessible)

### Phase 3: Voice & Rules (8-10 hours)
- [ ] Write Floris Voice Profile (Dutch patterns)
- [ ] Write Floris Voice Profile opening patterns ("Bedankt voor je bericht")
- [ ] Write Floris Voice Profile closing patterns ("Fijne dag,", "Groet,")
- [ ] Write Floris Voice Profile tone guidelines (friendly, direct, professional)
- [ ] Write Sam Voice Profile (English patterns)
- [ ] Write Sam Voice Profile opening patterns ("Hi [name]")
- [ ] Write Sam Voice Profile closing patterns ("Kind regards", "Best")
- [ ] Write Sam Voice Profile tone guidelines (warm, helpful, concise)
- [ ] Write Response Templates module (20+ topic templates)
- [ ] Write Response Templates trial template (Dutch + English variants)
- [ ] Write Response Templates billing template (Dutch + English variants)
- [ ] Write Response Templates cancel template (Dutch + English variants)
- [ ] Write Response Templates pricing template (Dutch + English variants)
- [ ] Write Response Templates managed template (Dutch + English variants)
- [ ] Write Response Templates technical support template
- [ ] Write Response Templates integration template
- [ ] Write Response Templates creator matching template
- [ ] Write Response Templates deal approval template
- [ ] Write Response Templates payment inquiry template
- [ ] Write Response Templates feature request template
- [ ] Write Response Templates bug report template
- [ ] Write Response Templates partnership proposal template
- [ ] Write Response Templates expansion template
- [ ] Write Response Templates downgrade template
- [ ] Write Response Templates pause request template
- [ ] Write Response Templates reactivation template
- [ ] Write Response Templates compliance template
- [ ] Write Response Templates data export template
- [ ] Write Response Templates account deletion template
- [ ] Write Communication Standards module (email structure)
- [ ] Write Communication Standards formatting rules
- [ ] Write Communication Standards tone switching logic (formal vs casual)
- [ ] Write Quality Validators module (email quality rubric 10 criteria)
- [ ] Write Quality Validators hard blocker rules (4 categories: factual errors, tone violations, missing context, compliance issues)
- [ ] Write Quality Validators pre-send checklist
- [ ] Create symlink to Global Human Voice Rules (v0.101)
- [ ] Verify symlink integrity (HVR accessible)

### Phase 4: Interactive & Support (2-3 hours)
- [ ] Write Interactive Mode module (context gathering questions)
- [ ] Write Interactive Mode command detection logic
- [ ] Write Interactive Mode error recovery prompts
- [ ] Write Interactive Mode clarification templates
- [ ] Create memory/ directory structure
- [ ] Write memory README (purpose, file naming, retention policy)
- [ ] Test export protocol (create sample export file)
- [ ] Validate file naming convention (YYYY-MM-DD_topic_sender.md)
- [ ] Validate metadata headers (date, sender, topic, language, voice, score)
- [ ] Run integration test (full 10-stage pipeline with sample email)
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Manual Scenario | 20+ topic categories (trial, billing, cancel, pricing, managed, technical, integration, creator matching, deal approval, payment, feature request, bug, partnership, expansion, downgrade, pause, reactivation, compliance, data export, deletion) | ChatGPT Custom GPT interface |
| Voice Validation | Dutch (Floris) and English (Sam) pattern consistency | Sales Ops team review |
| Quality Scoring | 10 criteria rubric produces scores 1-10 | Sample email corpus (30+ emails) |
| Hard Blocker Detection | 4 blocker categories (factual errors, tone violations, missing context, compliance) | Negative test cases (15+ bad examples) |
| Export Protocol | File creation, naming, metadata headers | File system inspection |
| Template Substitution | Variable slot filling (name, plan, price, date) | Edge case testing (missing data) |
| Language Detection | Dutch/English classification accuracy | Bilingual email samples (20+) |
| Intent Classification | Factual vs persuasive routing | Labeled dataset (40+ emails) |
| Command Handling | $reply/$draft/$trial/$billing/$cancel/$pricing/$managed/$quick | Command test suite (8 commands) |
| Interactive Mode | Context gathering, clarification, error recovery | Incomplete/ambiguous email scenarios |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Global Brand Context v0.110 | External Symlink | Green | Cannot maintain brand consistency, tone violations likely |
| Global Human Voice Rules v0.101 | External Symlink | Green | Voice profiles incomplete, quality scoring unreliable |
| Global Market Context v0.110 | External Symlink | Green | Platform knowledge outdated, factual errors possible |
| ChatGPT Custom GPT platform | External Service | Green | Cannot deploy system, must use alternative (Claude Projects) |
| Sales Ops team availability | Internal Resource | Yellow | Voice calibration delayed, templates unvalidated |
| Existing Floris/Sam GPT content | Internal Resource | Yellow | Migration slowed, must create from scratch |
| Upload size limit (512MB max) | External Constraint | Green | Knowledge base must stay under limit (currently ~5MB projected) |
| Instruction length limit (32k chars) | External Constraint | Green | AGENTS.md must be concise (currently ~8k chars projected) |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Quality scoring produces <6 scores consistently, hard blocker detection fails, voice profile violations flagged by Sales Ops, export protocol creates malformed files, ChatGPT Custom GPT upload rejected
- **Procedure**: Revert to previous git commit, re-upload previous knowledge base version, notify Sales Ops of rollback, document failure reason in memory/, resume manual email drafting workflow
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Foundation) ──────┐
                           ├──► Phase 2 (Knowledge Base) ──► Phase 3 (Voice & Rules) ──► Phase 4 (Interactive)
Global Symlink Setup ──────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Foundation | None | Knowledge Base, Voice & Rules |
| Global Symlink Setup | None | Knowledge Base, Voice & Rules |
| Knowledge Base | Foundation, Global Symlinks | Voice & Rules |
| Voice & Rules | Foundation, Knowledge Base | Interactive |
| Interactive | Voice & Rules | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Foundation | High (DAG routing, 10-stage pipeline, command registry) | 4-6 hours |
| Knowledge Base | Medium (structured data, symlink setup) | 6-8 hours |
| Voice & Rules | High (20+ templates, 2 voice profiles, quality rubric) | 8-10 hours |
| Interactive & Support | Low (context gathering, memory setup) | 2-3 hours |
| **Total** | | **20-27 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup created (git commit with tag `pre-deploy-partner-email-system`)
- [ ] Feature flag configured (N/A - knowledge base deployment is atomic)
- [ ] Monitoring alerts set (manual quality checks scheduled post-deployment)
- [ ] Sales Ops team notified of deployment window
- [ ] Test corpus validated (30+ sample emails, 20+ topics covered)
- [ ] Export directory permissions verified (write access confirmed)
- [ ] Symlink integrity checked (Brand, HVR, Market contexts accessible)

### Rollback Procedure
1. **Immediate action**: Disable ChatGPT Custom GPT (unpublish or revert to previous knowledge base version)
2. **Revert code**: `git revert HEAD` or `git checkout <previous-tag>` in local repo
3. **Verify rollback**: Test 5 sample emails (trial, billing, cancel, pricing, managed) to confirm previous behavior restored
4. **Notify stakeholders**: Email Sales Ops team with rollback reason, estimated fix timeline, interim manual workflow instructions
5. **Document failure**: Create memory file `memory/rollback-YYYY-MM-DD.md` with failure mode, root cause, remediation plan

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A (knowledge base is stateless, no persistent data changes)
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────────────┐     ┌─────────────────────┐     ┌─────────────────────┐     ┌─────────────────────┐
│   Phase 1           │────►│   Phase 2           │────►│   Phase 3           │────►│   Phase 4           │
│   Foundation        │     │   Knowledge Base    │     │   Voice & Rules     │     │   Interactive       │
│   - AGENTS.md       │     │   - Platform KB     │     │   - Floris Voice    │     │   - Context Gather  │
│   - System Prompt   │     │   - Pricing KB      │     │   - Sam Voice       │     │   - Error Recovery  │
│   - Framework       │     │   - Trial KB        │     │   - 20+ Templates   │     │   - Memory Setup    │
│   - 10-stage DAG    │     │   - Brand Symlink   │     │   - Quality Rubric  │     │   - Export Test     │
└─────────────────────┘     └──────┬──────────────┘     └──────┬──────────────┘     └─────────────────────┘
                                   │                            │
                             ┌─────▼─────┐              ┌──────▼──────┐
                             │  Global   │              │  Global     │
                             │  Symlinks │              │  HVR        │
                             │  (Brand)  │              │  Symlink    │
                             └───────────┘              └─────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| AGENTS.md | None | Entry point, DAG routing, export protocol | System Prompt, Framework |
| System Prompt | AGENTS.md | Command registry, topic registry, language detection | Framework, Knowledge Base |
| Framework | AGENTS.md, System Prompt | Topic ID, intent classification, quality scoring | Knowledge Base, Voice Profiles |
| Knowledge Base | System Prompt, Framework, Global Symlinks | Platform context, pricing data, trial rules | Voice Profiles, Templates |
| Voice Profiles | Framework, Knowledge Base, Global HVR | Floris patterns, Sam patterns | Templates, Quality Validators |
| Templates | Voice Profiles, Knowledge Base | 20+ topic-specific drafts | Quality Validators, Interactive Mode |
| Quality Validators | Framework, Voice Profiles, Templates | Rubric scores, blocker detection, checklist | Interactive Mode, Export |
| Interactive Mode | Quality Validators, Templates | Context questions, error recovery | Export |
| Export Protocol | AGENTS.md, Interactive Mode | File output, metadata headers | None |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Phase 1: Foundation (AGENTS.md + System Prompt + Framework)** - 4-6 hours - CRITICAL
2. **Phase 2: Knowledge Base (Platform + Pricing + Trial + Brand Symlink)** - 6-8 hours - CRITICAL
3. **Phase 3: Voice Profiles (Floris + Sam + HVR Symlink)** - 4-5 hours (subset of Phase 3) - CRITICAL
4. **Phase 3: Templates (20+ topic templates)** - 4-5 hours (subset of Phase 3) - CRITICAL
5. **Phase 3: Quality Validators (rubric + blockers + checklist)** - 2-3 hours (subset of Phase 3) - CRITICAL
6. **Phase 4: Integration Test (full 10-stage pipeline)** - 1-2 hours (subset of Phase 4) - CRITICAL

**Total Critical Path**: 21-29 hours

**Parallel Opportunities**:
- Platform Knowledge and Pricing Knowledge can be written simultaneously (Phase 2)
- Floris Voice Profile and Sam Voice Profile can be written simultaneously (Phase 3)
- Template writing can be parallelized across topic categories (trial, billing, cancel, pricing, managed can be done concurrently)
- Quality rubric and blocker detection can be written simultaneously (Phase 3)
- Memory setup and export test can be done simultaneously (Phase 4)

**Potential Time Savings with Parallelization**: 6-8 hours (estimated total time with parallel work: 15-21 hours)
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1: Foundation Complete | AGENTS.md, System Prompt, Framework functional | 10-stage pipeline routes sample email correctly, command registry detects $reply/$draft, topic registry identifies 5+ categories, language detection works for Dutch/English | End of Phase 1 (4-6 hours) |
| M2: Knowledge Base Complete | All context modules populated, topic routing works | Platform knowledge answers "how does Barter work", pricing returns correct EUR 129/mo quarterly rate, trial rules explain 14-day or first-creator trigger, Brand symlink loads successfully | End of Phase 2 (10-14 hours cumulative) |
| M3: System Ready | All voice profiles, templates, rules validated by Sales Ops | Floris voice uses "Bedankt voor je bericht" opening, Sam voice uses "Hi [name]" opening, quality scoring produces 8+ for good emails and <6 for bad emails, hard blocker detection flags factual errors, 20+ templates tested with sample data, Sales Ops approves tone/content | End of Phase 3 (18-24 hours cumulative) |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Use ChatGPT Custom GPT Instead of Code-Based Solution

**Status**: Accepted

**Context**: The partner email drafting system needs to handle 20+ topic categories, bilingual support (Dutch/English), voice profile switching (Floris/Sam), and quality scoring. Options include building a code-based NLP system (Python/TypeScript) or using a knowledge-engineered ChatGPT Custom GPT.

**Decision**: Use ChatGPT Custom GPT with structured markdown knowledge base

**Consequences**:
- **Positive**: Zero deployment infrastructure, Sales Ops can edit knowledge base directly (markdown files in git), faster iteration on templates/rules, built-in language understanding, no code maintenance burden
- **Negative**: Platform dependency risk (ChatGPT API changes could break system), upload size limits (512MB max, 32k char instruction limit), no version control within ChatGPT UI (must rely on git for KB versioning), deterministic behavior requires careful prompt engineering (non-deterministic LLM base)

**Mitigation for Negatives**: Maintain git-versioned knowledge base with rollback tags, keep total KB size under 100MB (currently ~5MB projected), use AGENTS.md to enforce deterministic routing via DAG, implement quality scoring rubric to catch LLM hallucinations

**Alternatives Rejected**:
- **Python NLP Service (spaCy + custom rules)**: Rejected due to high development cost (80+ hours estimated), requires hosting infrastructure, harder for Sales Ops to maintain
- **TypeScript/Node Service (OpenAI API + templates)**: Rejected due to API cost concerns (EUR 0.002/email estimated), requires deployment pipeline, no built-in UI for Sales Ops testing
- **No-Code Tool (Zapier + OpenAI integration)**: Rejected due to limited customization (cannot implement 10-stage DAG routing), vendor lock-in, monthly subscription cost

---

### ADR-002: Use Directed Acyclic Graph (DAG) for Routing Instead of If-Else Logic

**Status**: Accepted

**Context**: The system must route incoming emails through a 10-stage processing pipeline (read → detect language → identify topic → classify intent → select voice → load KB → draft → score → export → present). Traditional if-else branching could lead to spaghetti logic in the AGENTS.md instruction file.

**Decision**: Implement a Directed Acyclic Graph (DAG) with explicit stage ordering in AGENTS.md reading instructions

**Consequences**:
- **Positive**: Clear execution order (no ambiguity), easier debugging (can trace which stage failed), modular design (each stage isolated), scalable (can add new stages without refactoring entire pipeline), testable (can validate each stage independently)
- **Negative**: More verbose AGENTS.md (requires explicit stage definitions), ChatGPT must follow strict ordering (risk of LLM skipping stages), requires careful prompt engineering to enforce DAG

**Mitigation for Negatives**: Use numbered stages (1-10) in AGENTS.md to reinforce ordering, add "CRITICAL" markers to non-optional stages, implement quality validators to catch stage-skipping errors

**Alternatives Rejected**:
- **If-Else Logic Tree**: Rejected due to poor maintainability (40+ branches predicted for 20+ topics), hard to debug (unclear execution path), difficult for Sales Ops to understand
- **State Machine (Finite State Automaton)**: Rejected due to complexity overhead (requires state transition table), harder to express in markdown (ChatGPT Custom GPT constraint)

---

### ADR-003: Use Symlinks for Global Shared Resources Instead of Duplication

**Status**: Accepted

**Context**: The partner email system needs Brand Context (v0.110), Human Voice Rules (v0.101), and Market Context (v0.110), which are maintained centrally in the Global shared resources folder. Options include duplicating content or using symlinks.

**Decision**: Use symlinks to Global shared resources folder

**Consequences**:
- **Positive**: Single source of truth (no sync issues), automatic updates when Global resources change, smaller knowledge base size (no duplication), easier maintenance (update once, affects all systems)
- **Negative**: Symlink breakage risk (if Global folder moves), ChatGPT Custom GPT upload must preserve symlinks (requires manual file resolution or zip upload), harder to audit knowledge base completeness (must check symlink targets)

**Mitigation for Negatives**: Add symlink integrity checks to pre-deployment checklist, document symlink paths in dependency table, use absolute paths for symlinks (not relative), verify symlinks during validation phase

**Alternatives Rejected**:
- **Duplicate Content**: Rejected due to maintenance burden (3+ copies of Brand Context to keep in sync), version drift risk (partner system uses v0.110 while Global updates to v0.111)
- **API-Based Lookup**: Rejected due to ChatGPT Custom GPT constraints (no external API calls during knowledge base upload)

---

### ADR-004: Use Quality Rubric (10 Criteria) Instead of Binary Pass/Fail

**Status**: Accepted

**Context**: The system must validate drafted emails before export. Options include binary pass/fail validation or graduated scoring with a quality rubric.

**Decision**: Use 10-criteria quality rubric with scores 1-10 (target 8+)

**Consequences**:
- **Positive**: Graduated feedback (user sees what to improve, not just "failed"), catch edge cases (email might be "acceptable but not great"), empirical validation (can measure system performance over time via score distribution), Sales Ops can set threshold (8+ for auto-send, <8 for review)
- **Negative**: More complex to implement (10 criteria vs 1 binary check), ChatGPT must compute scores consistently (risk of LLM scoring variance), harder to explain to users (why 7 instead of 8?)

**Mitigation for Negatives**: Define rubric criteria explicitly in Quality Validators module (avoid subjective terms like "good"), include scoring examples (sample email with annotated score), add hard blocker rules (4 categories) as binary gates to catch critical errors

**Alternatives Rejected**:
- **Binary Pass/Fail**: Rejected due to poor granularity (cannot distinguish "great" from "acceptable"), no actionable feedback for users
- **LLM Self-Critique (ask ChatGPT "is this good?")**: Rejected due to unreliability (LLM may be overconfident), no objective criteria
- **External API Validation (grammar check, tone analysis)**: Rejected due to ChatGPT Custom GPT constraints (no external API calls), cost concerns

---

<!-- ANCHOR:ai-execution -->
## L3+: AI EXECUTION FRAMEWORK

### Tier 1: Sequential Foundation (Architect-Led)
**Owner**: System Architect (Michel)
**Duration**: ~6 hours
**Scope**: Core architecture and routing

| Step | Task | Output |
|------|------|--------|
| 1.1 | Create directory structure (T001) | Folder hierarchy with system/, context/, rules/, voice/ |
| 1.2 | Write AGENTS.md (T002) | Entry point with 4 sections: Context Override, Export Protocol, Reading Instructions, Processing Hierarchy |
| 1.3 | Write System Prompt (T003) | Routing logic, command registry (10 shortcuts), topic registry (20+ categories), language detection |
| 1.4 | Write Communication Framework (T004) | Topic identification, intent classification, template selection, 5-dimension quality scoring |

**Gate**: Tier 1 complete when 10-stage DAG pipeline routes a sample email correctly through all stages.

### Tier 2: Parallel Knowledge Engineering
**Duration**: ~12 hours (parallel execution)

| Agent/Owner | Focus | Files | Dependencies |
|-------------|-------|-------|--------------|
| Knowledge Agent A | Platform + Pricing KB | context/Platform Knowledge, context/Pricing & Plans | T001, T003 |
| Knowledge Agent B | Trial + Subscription KB | context/Trial & Subscription, Brand symlink | T001, T003 |
| Voice Agent A | Floris Voice Profile | voice/Floris Style | T001 |
| Voice Agent B | Sam Voice Profile | voice/Sam Style | T001 |
| Rules Agent | Communication Standards + HVR symlink | rules/Communication Standards, rules/Human Voice | T001 |

**Sync Point SYNC-001**: All Tier 2 agents complete. Verify cross-references between KB modules (pricing referenced in templates, trial terms in voice examples).

### Tier 3: Integration & Templates
**Owner**: Primary Agent (with voice profile context)
**Duration**: ~8 hours

| Step | Task | Dependencies |
|------|------|-------------|
| 3.1 | Write Response Templates (T011) | T009, T010 (voice profiles) |
| 3.2 | Write Quality Validators (T013) | T004 (framework) |
| 3.3 | Write Interactive Mode (T015) | T003 (system prompt) |
| 3.4 | Integration test: full pipeline | All Tier 1-3 |

**Gate**: Tier 3 complete when 5 Dutch + 5 English sample emails produce quality score ≥40/50 with correct voice profiles.

### Tier 4: Validation & Sign-Off
**Owner**: Sales Ops Team + System Architect
**Duration**: ~6 hours

| Step | Task | Participants |
|------|------|-------------|
| 4.1 | Dutch scenario testing (T017) | Floris |
| 4.2 | English scenario testing (T018) | Sam |
| 4.3 | Topic routing validation (T019) | System Architect |
| 4.4 | Voice consistency check (T020) | Floris + Sam (blind review) |
| 4.5 | Sales Ops review round (T021) | Full team |

**Gate**: Tier 4 complete when Sales Ops signs off on all test scenarios.
<!-- /ANCHOR:ai-execution -->

---

<!-- ANCHOR:workstreams -->
## L3+: WORKSTREAM COORDINATION

### Workstream Definition

| ID | Name | Owner | Files | Status |
|----|------|-------|-------|--------|
| W-FOUNDATION | Core System Files | System Architect | AGENTS.md, System Prompt, Communication Framework | Pending |
| W-KNOWLEDGE | Context Documents | Knowledge Agent | Platform KB, Pricing KB, Trial KB, Brand symlink | Pending |
| W-VOICE | Voice Profiles | Voice Agent | Floris Style, Sam Style, Response Templates | Pending |
| W-RULES | Standards & Validators | Rules Agent | Communication Standards, Quality Validators, HVR symlink | Pending |
| W-INTERACTIVE | User Experience | Primary Agent | Interactive Mode, Memory structure, Export protocol | Pending |
| W-TESTING | Validation | Sales Ops + Architect | Test scenarios, routing validation, voice consistency | Pending |

### Sync Points

| Sync ID | Trigger | Participants | Output |
|---------|---------|--------------|--------|
| SYNC-001 | W-FOUNDATION complete | All agents | Routing verified, KB loading order confirmed |
| SYNC-002 | W-KNOWLEDGE + W-VOICE complete | Voice + Rules agents | Cross-reference check (pricing in templates, trial terms in examples) |
| SYNC-003 | W-RULES complete | Primary agent | Quality validators integrated into pipeline |
| SYNC-004 | All workstreams complete | Full team | Integration test (full 10-stage pipeline) |

### File Ownership Rules
- Each KB document owned by ONE workstream (see table above)
- Cross-workstream references (e.g., pricing in voice templates) require SYNC point verification
- Conflicts resolved at sync points by System Architect
- Version numbers updated only by file owner (no cross-workstream version bumps)
<!-- /ANCHOR:workstreams -->

---

<!-- ANCHOR:communication -->
## L3+: COMMUNICATION PLAN

### Checkpoints
- **Per Phase**: Status update in tasks.md (mark completed tasks, note blockers)
- **Per Sync Point**: Cross-reference verification meeting (15 min, async-friendly)
- **Blockers**: Immediate escalation to System Architect

### Status Reporting
| Audience | Frequency | Format | Channel |
|----------|-----------|--------|---------|
| System Architect | Per phase | tasks.md update | Git commit |
| Sales Ops Team | Weekly | Progress summary (3 bullets: done, next, blockers) | Slack/Email |
| Sales Team Lead | Bi-weekly | Milestone report | Email |

### Escalation Path
1. **KB content accuracy questions** → Finance team (pricing), Legal (terms), Product (platform features)
2. **Voice profile disputes** → Floris/Sam review with System Architect mediation
3. **Architecture concerns** → System Architect (Michel) - final decision authority
4. **Scope changes** → System Architect + Sales Team Lead joint approval required
5. **Resource constraints** → Sales Team Lead
<!-- /ANCHOR:communication -->

---

<!--
LEVEL 3+ PLAN (~700 lines)
- Core + L2 + L3 + L3+ addendums
- AI execution framework, workstream coordination
- Full communication plan
-->
