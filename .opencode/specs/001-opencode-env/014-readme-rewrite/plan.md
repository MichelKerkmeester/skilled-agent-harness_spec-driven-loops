# Implementation Plan: README Rewrite

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2 -->

---

## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown (documentation) |
| **Framework** | OpenCode Spec Kit Framework |
| **Storage** | Git repository (single file: README.md) |
| **Testing** | Manual review, line count verification, codebase cross-reference |

### Overview
This plan covers the complete rewrite of README.md from 1,109 lines to ~450-500 lines. The approach is: (1) inventory all features from the codebase for accuracy, (2) write the new README following the 11-section structure with Memory Engine as the lead feature, (3) verify every claim against the codebase, and (4) review for tone consistency and line count compliance. The @write agent handles content creation; verification is a separate phase.

---

## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (spec.md complete)
- [x] Success criteria measurable (10 criteria with concrete metrics)
- [x] Dependencies identified (codebase accuracy is the sole critical dependency)
- [x] 8 architectural decisions documented (decision-record.md)
- [x] New section structure defined (11 sections with line budgets)

### Definition of Done
- [ ] All 10 success criteria met
- [ ] Line count verified (400-550 range)
- [ ] Every feature claim cross-referenced against codebase
- [ ] Tone review passed (no marketing/reference oscillation)
- [ ] All code examples tested for correctness
- [ ] Docs updated (spec/plan/tasks marked complete)

---

## 3. ARCHITECTURE

### Pattern
Document Architecture: Hero-first progressive disclosure with feature-ordered sections

### Key Components
- **Hero Section + Quick Start**: Immediate value delivery (first 50 lines)
- **Architecture Overview**: ASCII diagram establishing mental model for entire document
- **The Memory Engine**: Crown jewel section - 22 tools, cognitive features, causal graphs
- **The Agent Network**: 10 agents with routing intelligence and enterprise patterns
- **The Gate System**: 3 mandatory gates with dual-threshold validation
- **Supporting Sections**: Spec Kit, Skills, Commands, Installation (compressed)

### Data Flow
Reader enters at Hero → Quick Start gives hands-on taste → Architecture provides mental model → Feature sections deliver depth in order of novelty → Supporting sections provide reference material → Installation enables action → What's Next provides next steps.

---

## 4. IMPLEMENTATION PHASES

### Phase 1: Research & Inventory
- [ ] Read current README.md completely (1,109 lines)
- [ ] Inventory all MCP tools from codebase (verify 22 tools across 7 layers)
- [ ] Inventory all agents (verify 10 agents: 8 custom + 2 built-in)
- [ ] Inventory all skills (verify 9 skills)
- [ ] Inventory all commands (verify 17 commands across 4 categories)
- [ ] Verify test count (118 files, 3,872 tests)
- [ ] Document any discrepancies between current README claims and codebase reality

### Phase 2: Content Creation
- [ ] Write Hero Section (~20 lines): name, description, badges, value prop
- [ ] Write Quick Start (~30 lines): install + first commands
- [ ] Write Architecture Overview (~40 lines): ASCII diagram + component summary
- [ ] Write The Memory Engine (~80 lines): 22 tools, 7 layers, cognitive features, causal graph
- [ ] Write The Agent Network (~60 lines): 10 agents, routing, enterprise patterns
- [ ] Write The Gate System (~40 lines): 3 gates, dual-threshold, flow diagram
- [ ] Write Spec Kit Documentation (~50 lines): 4 levels, CORE+ADDENDUM, validation
- [ ] Write Skills Library (~40 lines): 9 skills, auto-detection
- [ ] Write Commands (~30 lines): 17 commands, 4 categories
- [ ] Write Installation (~30 lines): essentials + link
- [ ] Write What's Next / Contributing (~20 lines)

### Phase 3: Verification & Review
- [ ] Cross-reference all feature claims against codebase (T2)
- [ ] Test all code examples and commands (T3)
- [ ] Review for tone consistency (T4)
- [ ] Verify line count target (T5)
- [ ] Check ASCII diagram rendering on GitHub

---

## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Accuracy | All feature claims (tool counts, agent names, command lists) | Grep/Glob against codebase |
| Functional | Code examples and commands in Quick Start | Manual execution in terminal |
| Rendering | ASCII diagrams, tables, markdown formatting | GitHub preview, VS Code preview |
| Metrics | Line count, section lengths, comparison table count | `wc -l`, manual count |
| Quality | Tone consistency, engagement, no marketing repetition | Manual review with tone checklist |

---

## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Current README.md (1,109 lines) | Internal | Green | Cannot identify content to preserve |
| Codebase feature inventory | Internal | Green | Feature claims may be inaccurate |
| MCP server tool definitions | Internal | Green | Tool counts and layer architecture wrong |
| Agent configuration files | Internal | Green | Agent list incomplete |
| Skill SKILL.md files | Internal | Green | Skill descriptions inaccurate |

---

## 7. ROLLBACK PLAN

- **Trigger**: README rewrite introduces critical inaccuracies or stakeholder rejects new structure
- **Procedure**: `git checkout main -- README.md` restores the original 1,109-line version

---

## L2: PHASE DEPENDENCIES

```
Phase 1 (Research) ──────► Phase 2 (Content) ──────► Phase 3 (Verify)
    │                          │                          │
    └─ Inventory all           └─ Write all 11            └─ Cross-reference
       features from              sections using              every claim,
       codebase                   inventory data              test examples
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Research & Inventory | None | Content Creation |
| Content Creation | Research & Inventory | Verification & Review |
| Verification & Review | Content Creation | None (final phase) |

---

## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Research & Inventory | Medium | 1-2 hours |
| Content Creation | High | 3-5 hours |
| Verification & Review | Medium | 1-2 hours |
| **Total** | | **5-9 hours** |

---

## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Current README.md committed to git (backup via version control)
- [ ] Feature inventory documented in scratch/ for reference
- [ ] New README reviewed before replacing old one

### Rollback Procedure
1. Immediate: `git checkout main -- README.md` (restore previous version)
2. Verify: Confirm original README renders correctly
3. Investigate: Review what went wrong with new version
4. Iterate: Fix issues and re-attempt with corrections

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A (single file replacement via git)

---

## L3: DEPENDENCY GRAPH

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Phase 1       │────►│   Phase 2       │────►│   Phase 3       │
│   Research &    │     │   Content       │     │   Verification  │
│   Inventory     │     │   Creation      │     │   & Review      │
└────────┬────────┘     └────────┬────────┘     └─────────────────┘
         │                       │
         │                       ├──► T1: Write README (sequential sections)
         │                       │
         ├──► T2-prep: Feature   ├──► Can draft sections in parallel
         │    inventory          │    (Hero, Quick Start, Architecture
         │                       │     can be written simultaneously)
         ├──► Verify counts      │
         │    (22 tools, 10      └──► But Memory Engine section depends
         │     agents, 9 skills)      on completed feature inventory
         │
         └──► Document findings
              in scratch/
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Feature Inventory (Phase 1) | Codebase access | Verified feature lists | All content sections |
| Hero + Quick Start | General project knowledge | Opening 50 lines | Nothing (can write early) |
| Architecture Diagram | Feature inventory | Visual mental model | Nothing (informational) |
| Memory Engine Section | Complete MCP tool inventory | Crown jewel content | Verification |
| Agent Network Section | Agent config inventory | Agent documentation | Verification |
| Gate System Section | AGENTS.md gate definitions | Gate documentation | Verification |
| Verification (Phase 3) | All content written | Final validated README | None |

---

## L3: CRITICAL PATH

1. **Feature Inventory (Phase 1)** - 1-2 hours - CRITICAL (all content depends on accurate data)
2. **Memory Engine Section (Phase 2)** - 1-1.5 hours - CRITICAL (largest section, most complex content)
3. **Full Codebase Verification (Phase 3)** - 1-2 hours - CRITICAL (accuracy is P0 requirement)

**Total Critical Path**: 3-5.5 hours

**Parallel Opportunities**:
- Hero, Quick Start, and Architecture Overview can be drafted while inventory completes
- Agent Network and Gate System sections can be written in parallel
- Skills, Commands, Installation, and What's Next can be written in parallel
- Tone review (T4) and line count check (T5) can run simultaneously

---

## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Feature Inventory Complete | All feature counts verified against codebase | End of Phase 1 |
| M2 | Draft README Complete | All 11 sections written with content | End of Phase 2 |
| M3 | Verification Passed | All claims accurate, line count in range, tone consistent | End of Phase 3 |

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Feature Ordering — Lead with Memory Engine

**Status**: Accepted

**Context**: Current README buries the most novel features. The MCP Memory Server with cognitive features and causal graphs is unique in the ecosystem but appears only as bullet points.

**Decision**: Restructure README to lead with Memory Engine as "The Crown Jewel" section, immediately after Architecture Overview.

**Consequences**:
- Visitors immediately see the most differentiated feature
- May confuse users who expect conventional README structure (install first)
- Mitigation: Quick Start before deep features provides immediate actionability

**Alternatives Rejected**:
- Alphabetical ordering: No prioritization of novel features
- Installation-first: Buries differentiators below setup boilerplate

---

### ADR-002: Line Count Target ~450-500

**Status**: Accepted

**Context**: Current README at 1,109 lines is bloated with repetition and excessive detail. Need a target that's comprehensive but focused.

**Decision**: Target 450-500 lines with hard bounds of 400-550.

**Consequences**:
- Forces disciplined writing and section budgets
- Some detail must move to linked documents
- Mitigation: Link to detailed guides for installation, API reference

**Alternatives Rejected**:
- No line target (organic length): Risk of re-bloating
- <300 lines: Too aggressive, would sacrifice essential content

---

<!--
LEVEL 3 PLAN (~200 lines)
- Core + L2 + L3 addendums
- Dependency graphs, milestones
- Architecture decision records
-->
