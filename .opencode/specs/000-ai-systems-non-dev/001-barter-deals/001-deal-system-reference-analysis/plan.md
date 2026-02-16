# Implementation Plan: Deal System Reference Analysis Implementation

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

- **Level**: 3+

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown documentation |
| **Framework** | ChatGPT Project Knowledge Base |
| **Storage** | Local markdown files in knowledge base folder |
| **Testing** | Manual validation via system prompt testing |

### Overview

This implementation upgrades the Barter deals AI system (ChatGPT project knowledge base v0.201) by incorporating operational and sales knowledge from 4 reference sources. The technical approach is to update existing system prompt markdown files and create new documentation sections to codify 19 recommendations across 6 improvement areas. No code changes required - all work is knowledge base documentation updates.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Problem statement clear and scope documented
- [x] Success criteria measurable (19 recommendations implemented, validation passes)
- [x] Dependencies identified (validation script accessible)
- [x] Research.md analyzed and prioritization complete

### Definition of Done

- [ ] All 5 P0 recommendations (REQ-001 to REQ-005) implemented in knowledge base files
- [ ] All 10 P1 recommendations (REQ-006 to REQ-015) implemented or deferred with approval
- [ ] validate.sh passes with no errors
- [ ] All placeholder content removed from spec/plan/tasks/checklist/decision-record/implementation-summary
- [ ] Manual testing confirms new routing paths work correctly
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Knowledge Base Enhancement - ChatGPT project documentation structure with modular sections

### Key Components

- **System Prompt Core**: Main instruction file containing routing logic, standards, scoring framework
- **Deal Type Templates**: Product, Service, Gift Card (new), Subscription (new), Paid+Barter Hybrid (new)
- **Market Data Documents**: Value intelligence, follower guidance, category strategy
- **Quality Gates**: DEAL 25-point scoring + Deal Attractiveness Self-Check (new)
- **Multi-Language Framework**: Language routing and template variants (NL, DE, EN)

### Data Flow

1. User provides campaign goal (awareness/sales/reviews/UGC) - NEW
2. User provides deal brief (9 questions or URL input - future)
3. System detects language from brand country - NEW
4. System routes to deal type (Product/Service/Gift Card/Subscription/Hybrid) - ENHANCED
5. System applies campaign goal to template defaults - NEW
6. System generates deal with appropriate language template - NEW
7. DEAL scoring validates (existing 25-point framework)
8. Deal Attractiveness Self-Check validates (NEW quality gate)
9. System outputs final deal template
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Immediate Priority - Operational Fixes (P0)

- [ ] Update Standards Section 2: change title max length from 80 to 50 characters
- [ ] Update Deal Templates - Requirements Section: add standard story deliverable pattern
- [ ] Create Follower Requirement Guidance section: document 1500+ baseline, 3000-5000+ premium
- [ ] Enhance Market Data section: add value-to-application warnings (below EUR 50, EUR 50-75, EUR 75-150, EUR 150-300, EUR 300+)
- [ ] Create Campaign Goal Input section: add goal parameter with 4 options and template impact documentation

### Phase 2: Deal Quality Improvements (P1 Short-Term)

- [ ] Create Paid + Barter Hybrid routing path in Smart Routing Logic Section 4
- [ ] Create Hashtag Strategy section: document 5-10 niche hashtag guidance, generic tag flags
- [ ] Create Deal Attractiveness Self-Check section: 7-criteria quality gate before export
- [ ] Create Post-Creation Optimization Playbook section: 6-step diagnostic for low-application deals
- [ ] Create Category Selection Strategy section: document not-too-broad, not-too-narrow guidance

### Phase 3: System Expansion (P1 Medium-Term)

- [ ] Create Gift Card routing path in Smart Routing Logic Section 4
- [ ] Create Subscription routing path in Smart Routing Logic Section 4
- [ ] Create Multi-Language Support Framework section: brand country to language mapping, template variants
- [ ] Create Barter App Terminology Mapping section: platform UI labels documentation
- [ ] Create Scope Boundaries section: regulated products, sensitive categories, compliance flags

### Phase 4: Verification and Documentation

- [ ] Manual testing of all 3 new deal type routing paths
- [ ] Verify campaign goal parameter affects template output correctly
- [ ] Test multi-language routing (NL, DE, EN brand examples)
- [ ] Run validate.sh on spec folder
- [ ] Update implementation-summary.md with final changes
- [ ] Clean scratch/ folder
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Manual Validation | Test each of 3 new deal types with sample briefs | ChatGPT project testing interface |
| Campaign Goal Testing | Verify awareness/sales/reviews/UGC produce different outputs | ChatGPT project testing |
| Language Routing | Test NL, DE, EN brand inputs route to correct templates | ChatGPT project testing |
| Quality Gate Testing | Verify Deal Attractiveness Self-Check catches 7 criteria | ChatGPT project testing |
| Spec Validation | Run validate.sh on spec folder | Bash script execution |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| validate.sh script | External | Green (accessible) | Cannot verify spec completion |
| Research.md | Internal | Green (complete) | Cannot implement without source content |
| ChatGPT Project Knowledge Base | Internal | Green (accessible) | Cannot update knowledge base files |
| System Prompt v0.201 | Internal | Green (exists) | Cannot enhance without base version |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Manual testing reveals new routing paths produce incorrect outputs, or validation fails after 3+ fix attempts
- **Procedure**: Revert all knowledge base file changes to v0.201 baseline, document issues in decision-record.md, request user approval for alternative approach
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (P0 Operational Fixes) ──────┐
                                     ├──► Phase 2 (P1 Short-Term) ──► Phase 4 (Verification)
Phase 3 (P1 Medium-Term) ────────────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 1 | None | Phase 2, Phase 4 |
| Phase 3 | None | Phase 4 |
| Phase 2 | Phase 1 | Phase 4 |
| Phase 4 | Phase 1, Phase 2, Phase 3 | None |

**Note**: Phase 2 and Phase 3 can run in parallel after Phase 1 completes.
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Phase 1 (5 P0 items) | Medium | 2-3 hours (documentation + testing) |
| Phase 2 (5 P1 short-term) | Medium | 2-3 hours (new sections + quality gate) |
| Phase 3 (5 P1 medium-term) | High | 3-4 hours (multi-language framework complexity) |
| Phase 4 (Verification) | Low | 1-2 hours (validation + manual testing) |
| **Total** | | **8-12 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist

- [ ] Backup of current knowledge base files created (v0.201 baseline)
- [ ] Feature flag N/A (knowledge base changes, no flags available)
- [ ] Monitoring alerts N/A (ChatGPT project has no monitoring)

### Rollback Procedure

1. Immediate action: Stop using updated knowledge base files
2. Revert files: Restore v0.201 versions from backup folder
3. Verify rollback: Test with known-good deal brief examples
4. Notify stakeholders: Inform Sales team to use v0.201 patterns manually

### Data Reversal

- **Has data migrations?** No (knowledge base documentation only, no data)
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌────────────────────┐     ┌────────────────────┐     ┌────────────────────┐
│   Phase 1          │────►│   Phase 2          │────►│   Phase 4          │
│   P0 Operational   │     │   P1 Short-Term    │     │   Verification     │
└────────────────────┘     └────────────────────┘     └────────────────────┘
                                    ▲
                                    │
                           ┌────────┴────────┐
                           │   Phase 3       │
                           │   P1 Medium     │
                           └─────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Phase 1 - Story deliverable | None | Updated requirements template | Phase 2, Phase 4 |
| Phase 1 - Title length | None | Updated standards section | Phase 2, Phase 4 |
| Phase 1 - Follower guidance | None | New guidance section | Phase 2 |
| Phase 1 - Value warnings | None | Enhanced market data | Phase 2 |
| Phase 1 - Campaign goal | None | New input parameter | Phase 2 (affects all templates) |
| Phase 2 - Hybrid routing | Phase 1 complete | New routing path | Phase 4 |
| Phase 2 - Attractiveness check | Phase 1 complete | New quality gate | Phase 4 |
| Phase 3 - Multi-language | None | Language framework | Phase 4 |
| Phase 4 - Validation | All phases | Verified spec | None |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Phase 1 - Campaign Goal Parameter** - 1 hour - CRITICAL (affects all subsequent template generation)
2. **Phase 1 - Title Length + Story Deliverable** - 30 minutes - CRITICAL (affects all templates)
3. **Phase 2 - Deal Attractiveness Self-Check** - 1 hour - CRITICAL (new quality gate affects all deals)
4. **Phase 3 - Multi-Language Framework** - 2 hours - CRITICAL (affects template variants)
5. **Phase 4 - Validation** - 1 hour - CRITICAL (cannot claim done without validation)

**Total Critical Path**: 5.5 hours

**Parallel Opportunities**:
- Phase 1 - Follower guidance and Value warnings can run simultaneously (independent sections)
- Phase 2 - Hashtag strategy and Post-creation playbook can run simultaneously (independent sections)
- Phase 3 - Barter App terminology and Scope boundaries can run simultaneously (independent sections)
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | P0 Complete | All 5 immediate recommendations implemented, templates updated | End of Phase 1 |
| M2 | Quality Gates Active | Deal Attractiveness Self-Check + campaign goal routing functional | End of Phase 2 |
| M3 | Multi-Language Ready | NL, DE, EN template variants created and routing works | End of Phase 3 |
| M4 | Validation Passed | validate.sh passes, manual testing complete, all docs synchronized | End of Phase 4 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Campaign Goal as Primary Input Parameter

**Status**: Accepted

**Context**: References show campaign goal (awareness/sales/reviews/UGC) fundamentally changes template output, yet system does not capture this. Adding it requires changing the input workflow.

**Decision**: Add campaign goal as Question 0 (before 9-question deal brief) with 4 options. Make it optional with default to "awareness" for backward compatibility.

**Consequences**:
- Positive: Template output correctly tailored to campaign objective
- Positive: Compensation recommendations align with goal (UGC gets higher usage rights)
- Negative: Adds one more input step for users - Mitigation: Make optional with sensible default

**Alternatives Rejected**:
- Infer goal from deal brief text: Too unreliable, users often omit goal information
- Add goal as question 10 (after brief): Too late, cannot influence template generation logic

### ADR-002: Multi-Language as Routing Framework vs Translation Layer

**Status**: Accepted

**Context**: Barter operates in 4 countries (NL, BE, UK, DE) but system is hardcoded to English. Need multi-language support without breaking existing English deals.

**Decision**: Implement language routing framework with brand country detection. Create parallel template variants (NL, DE, EN) rather than runtime translation layer.

**Consequences**:
- Positive: Clean separation, no translation errors, culturally appropriate phrasing
- Positive: Easier to maintain (Sales team can review each template variant)
- Negative: 3x template maintenance overhead - Mitigation: Start with core templates only, expand as needed
- Negative: HVR rules need per-language validation - Mitigation: Document as Phase 2 work

**Alternatives Rejected**:
- Runtime translation: Loses cultural nuance, translation errors likely
- English-only with manual translation: Current state, creates inconsistency

### ADR-003: Deal Attractiveness Self-Check as Separate Quality Gate

**Status**: Accepted

**Context**: DEAL 25-point scoring validates template quality but does not catch practical issues (missing story deliverable, wrong title length, follower-to-value mismatch).

**Decision**: Create separate pre-export quality gate with 7 practical criteria. Run alongside DEAL scoring during Test phase, surface as warnings not blockers.

**Consequences**:
- Positive: Catches operational issues DEAL scoring misses
- Positive: Surfaces actionable warnings before publish
- Negative: Risk of alert fatigue if too many warnings - Mitigation: Limit to 7 high-impact criteria only
- Negative: Another validation step - Mitigation: Auto-run with DEAL scoring, no extra user action

**Alternatives Rejected**:
- Expand DEAL scoring to 32 points: Would break existing scoring calibration
- Manual checklist only: Relies on Sales team memory, inconsistent application

---

<!-- ANCHOR:ai-execution -->
## L3+: AI EXECUTION FRAMEWORK

### Pre-Task Checklist

Before claiming any task:
- [ ] Read full task description in tasks.md
- [ ] Verify no blocking dependencies (check blockedBy in task list)
- [ ] Confirm file paths accessible
- [ ] Review related ADRs in decision-record.md

### Execution Rules

| Rule | Description | Enforcement |
|------|-------------|-------------|
| **One Task at a Time** | Mark task as in_progress before starting, complete before next task | HARD BLOCKER |
| **File Ownership** | Only modify files listed in task description | HARD BLOCKER |
| **Sync Point Respect** | Wait for SYNC trigger before cross-workstream changes | HARD BLOCKER |
| **Evidence Required** | Mark checklist items with evidence/date when completed | P0 verification |

### Status Reporting Format

After each task completion:
```
TASK: T### [Task name]
STATUS: Completed
FILES CHANGED: [List paths]
EVIDENCE: [Checklist items marked, tests passed, etc.]
BLOCKERS RESOLVED: [Any dependencies unblocked]
```

### Blocked Task Protocol

If blocked:
1. Mark task status as [B] in tasks.md
2. Document blocker in decision-record.md or plan.md
3. Notify user via status report
4. Do NOT attempt workarounds without approval

### Tier 1: Sequential Foundation

**Files**: spec.md (sections 1-3), research.md analysis
**Duration**: 90 seconds
**Agent**: Primary (speckit agent)

### Tier 2: Parallel Execution

| Agent | Focus | Files |
|-------|-------|-------|
| Primary | plan.md, tasks.md | Technical approach, task breakdown |
| Primary | checklist.md | Verification items mapping to 19 recommendations |
| Primary | decision-record.md | 3 ADRs (campaign goal, multi-language, quality gate) |

**Duration**: 120 seconds (sequential given single-agent constraint)

### Tier 3: Integration

**Agent**: Primary
**Task**: Run validate.sh, fix any errors, create implementation-summary.md
**Duration**: 60 seconds

**Total Estimated Execution**: 270 seconds (4.5 minutes) for spec documentation creation
<!-- /ANCHOR:ai-execution -->

---

<!-- ANCHOR:workstreams -->
## L3+: WORKSTREAM COORDINATION

### Workstream Definition

| ID | Name | Owner | Files | Status |
|----|------|-------|-------|--------|
| W-A | P0 Operational Fixes | Primary | System Prompt Sections 0, 2, Market Data | Pending |
| W-B | P1 Short-Term Improvements | Primary | New sections (Hashtag, Attractiveness, Optimization, Category) | Pending |
| W-C | P1 Medium-Term Expansion | Primary | Smart Routing Section 4, Multi-Language Framework, Terminology, Scope | Pending |
| W-D | Verification | Primary | All knowledge base files, validate.sh execution | Blocked on W-A, W-B, W-C |

### Sync Points

| Sync ID | Trigger | Participants | Output |
|---------|---------|--------------|--------|
| SYNC-001 | W-A complete | Primary agent | Campaign goal parameter ready for W-B to use |
| SYNC-002 | W-A, W-B, W-C complete | Primary agent | All knowledge base updates ready for validation |
| SYNC-003 | W-D validation passes | Primary agent | Final spec folder ready for user review |

### File Ownership Rules

- Each knowledge base section owned by ONE workstream
- Cross-workstream changes (e.g., campaign goal affects all templates) happen at SYNC points
- Conflicts resolved during Phase 4 verification
<!-- /ANCHOR:workstreams -->

---

<!-- ANCHOR:communication -->
## L3+: COMMUNICATION PLAN

### Checkpoints

- **Per Phase**: Update tasks.md with completion status
- **Blockers**: Document in decision-record.md with mitigation strategy
- **Validation Failures**: Log error details, fix, re-validate, document in implementation-summary.md

### Escalation Path

1. Technical blockers (validation script fails) → User for script path verification
2. Scope changes (new recommendations discovered) → User for priority guidance
3. Resource issues (knowledge base files inaccessible) → User for file path verification
<!-- /ANCHOR:communication -->

---

<!--
LEVEL 3+ PLAN
- Knowledge base enhancement implementation
- 4 phases: P0 operational, P1 short-term, P1 medium-term, verification
- 19 recommendations across 6 improvement areas
- 8-12 hour estimated effort
-->
