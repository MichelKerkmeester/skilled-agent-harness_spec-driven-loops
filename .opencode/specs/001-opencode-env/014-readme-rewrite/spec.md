# Feature Specification: README Rewrite

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

Complete rewrite of the project README.md from 1,109 lines of structurally bloated, repetitive content to a focused ~450-500 line showcase document. The rewrite reorders features by novelty/power (leading with the Memory Engine), eliminates 5 redundant before/after comparison tables, compresses installation from 156 lines to ~30, and adds missing critical content (architecture diagram, quick start, cognitive memory walkthrough, gate system flow).

**Key Decisions**: Lead with Memory Engine as crown jewel (D1), compress to ~450-500 lines max (D8)

**Critical Dependencies**: Accurate feature inventory from codebase (22 MCP tools, 10 agents, 9 skills, 17 commands)

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-02-12 |
| **Branch** | `001-readme-rewrite` |

---

## 2. PROBLEM & PURPOSE

### Problem Statement
The current README.md (1,109 lines) suffers from five critical issues: (1) feature ordering buries the most novel capabilities (causal memory graph is a bullet point, cognitive memory is a small subsection at line 487), (2) massive repetition with 5 duplicate before/after comparison tables, (3) structural bloat with a 228-line overview and 156-line installation section, (4) missing essential content like architecture diagrams and quick start, and (5) tone inconsistency oscillating between marketing copy and reference manual.

### Purpose
Transform the README into a concise, well-structured showcase document (~450-500 lines) that leads with the project's most powerful and unique features, eliminates redundancy, and provides immediate value through a quick start guide and architecture overview.

---

## 3. SCOPE

### In Scope
- Complete restructure of README.md section ordering
- New content: Hero section, Quick Start, Architecture diagram (ASCII)
- New content: Dedicated Memory Engine section with cognitive memory walkthrough and causal graph examples
- New content: Dedicated Gate System section with flow diagram
- Consolidation of 5 before/after tables into maximum 1
- Compression of Installation section from 156 lines to ~30 lines + link
- Compression of Overview section from 228 lines to ~40 lines
- Tone normalization (engaging but not repetitive marketing)

### Out of Scope
- Detailed installation guide document (separate deliverable) - would increase scope beyond README
- API reference documentation - belongs in dedicated docs
- Changes to actual codebase functionality - documentation only
- Changelog or migration guide - not part of README rewrite
- Video/animation assets - text and ASCII only

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `README.md` | Modify | Complete rewrite from 1,109 lines to ~450-500 lines |

---

## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All 22 MCP tools documented with layer architecture | Each of L1-L7 layers listed with their tools and token budgets |
| REQ-002 | Causal memory graph has dedicated subsection with example | At least one concrete example showing causal link creation and drift-why traversal |
| REQ-003 | Cognitive memory has dedicated subsection | All 8 subsystems listed with behavioral explanation (attention-decay, co-activation, FSRS, etc.) |
| REQ-004 | Gate system has own section with flow diagram | All 3 gates documented with ASCII flow and dual-threshold validation |
| REQ-005 | Architecture diagram present | ASCII diagram showing relationships between Memory Engine, Agents, Skills, Gates, and Spec Kit |
| REQ-006 | Quick start within first 50 lines | Working installation + first command sequence in under 50 lines |
| REQ-007 | No repeated before/after comparisons (max 1) | Grep confirms 0-1 comparison tables in final document |
| REQ-008 | Total line count 400-550 lines | `wc -l README.md` returns value in range |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-009 | Installation compressed to essentials + link | Installation section <35 lines with link to detailed guide |
| REQ-010 | Engaging tone maintained throughout | Review confirms no dry reference-manual sections; voice is consistent |
| REQ-011 | All 10 agents documented with routing logic | Agent table with selection criteria |
| REQ-012 | All 9 skills documented with auto-detection | Skills table with trigger conditions |
| REQ-013 | All 17 commands listed by category | Commands organized in 4 categories (spec_kit, memory, create, utility) |
| REQ-014 | Every feature claim is codebase-accurate | Cross-reference against actual code (118 test files, 17 lib subsystems, etc.) |

---

## 5. SUCCESS CRITERIA

- **SC-001**: All 22 MCP tools documented with layer architecture (L1-L7)
- **SC-002**: Causal memory graph has dedicated subsection with at least one concrete example
- **SC-003**: Cognitive memory (8 subsystems) has dedicated subsection
- **SC-004**: Gate system has its own section with ASCII flow diagram
- **SC-005**: Architecture diagram present showing component relationships
- **SC-006**: Quick start appears within first 50 lines of README
- **SC-007**: Maximum 1 before/after comparison table (down from 5)
- **SC-008**: Installation section compressed to <35 lines with link to detailed guide
- **SC-009**: Total line count between 400-550 lines
- **SC-010**: Engaging, consistent tone throughout (no marketing/reference oscillation)

---

## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Accurate feature inventory | Incorrect claims damage credibility | Cross-reference every claim against codebase before writing |
| Dependency | Current README.md content | Need to preserve any unique insights | Read entire current README before starting rewrite |
| Risk | Scope creep into codebase changes | High - derails documentation task | Strict scope lock: README.md only, no code changes |
| Risk | Over-compression loses important detail | Medium - key features under-documented | Target 450-500 lines, verify each section covers essentials |
| Risk | Feature counts change before merge | Low - minor inaccuracies | Final verification pass against codebase before completion |
| Risk | ASCII diagrams render poorly in some viewers | Medium - reduces visual value | Test rendering in GitHub markdown preview |

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: README renders correctly in <2s on GitHub (no excessive images or embeds)

### Accessibility
- **NFR-A01**: ASCII diagrams use box-drawing characters that render in all monospace fonts
- **NFR-A02**: All sections have descriptive headings for screen reader navigation

### Maintainability
- **NFR-M01**: Section structure maps 1:1 to major system components for easy updates
- **NFR-M02**: Feature counts (22 tools, 10 agents, etc.) are stated once, not scattered

### Compatibility
- **NFR-C01**: Markdown renders correctly on GitHub, GitLab, and local editors (VS Code, Obsidian)

---

## 8. EDGE CASES

### Data Boundaries
- Empty/new user: Quick Start must work for someone with zero context about the project
- Maximum detail: Architecture diagram must be readable at 80-character terminal width

### Error Scenarios
- Outdated feature count: If codebase changes between spec and implementation, final verification task (T2) catches discrepancies
- Broken ASCII: If diagram characters don't render, provide fallback text description
- Missing install guide: Installation section links to guide that may not exist yet - use placeholder path with note

### Content Edge Cases
- User skips to specific section: Each section must be self-contained enough to understand without reading prior sections
- User copies code examples: All command examples must be copy-paste ready (no invisible characters, correct paths)

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 8/25 | Files: 1, LOC: ~500, Systems: 0 (docs only) |
| Risk | 12/25 | Auth: N, API: N, Breaking: Y (replaces entire README), Accuracy critical |
| Research | 14/20 | Must inventory all features across codebase, verify every claim |
| Multi-Agent | 6/15 | Workstreams: 2 (writing + verification) |
| Coordination | 5/15 | Dependencies: 1 (codebase accuracy) |
| **Total** | **45/100** | **Level 3 (architecture decisions drive structure)** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Feature claims inaccurate (wrong counts, missing capabilities) | H | M | Cross-reference every claim against codebase; dedicated verification task T2 |
| R-002 | README too compressed, loses essential detail | M | M | Peer review task T4 with focus on completeness; target 450-500 not 400 |
| R-003 | ASCII diagrams break on some renderers | M | L | Test on GitHub, VS Code, and Obsidian; use simple box-drawing chars only |
| R-004 | Tone inconsistency (some sections engaging, others dry) | M | M | Dedicated tone review task T4; establish voice guidelines before writing |
| R-005 | Section ordering feels arbitrary | L | L | D1 decision provides clear rationale; get feedback before finalizing |
| R-006 | Installation link points to nonexistent guide | L | H | Note in README that detailed guide is "coming soon" or create stub |

---

## 11. USER STORIES

### US-001: First-Time Visitor Understands Value (Priority: P0)

**As a** developer discovering this project for the first time, **I want** to understand what it does and why it's special within 30 seconds, **so that** I can decide whether to explore further.

**Acceptance Criteria**:
1. Given I open the README, When I read the first 20 lines, Then I understand the core value proposition
2. Given I want to try it, When I follow the Quick Start, Then I have a working setup in under 5 minutes
3. Given I want details, When I scan the table of contents, Then I can jump to any major feature

---

### US-002: Existing User Finds Feature Reference (Priority: P0)

**As an** existing user of the framework, **I want** to quickly find documentation for specific features (agents, commands, memory tools), **so that** I can use them effectively without reading the entire README.

**Acceptance Criteria**:
1. Given I need to find a specific MCP tool, When I navigate to The Memory Engine section, Then I find all 22 tools organized by layer
2. Given I need agent routing info, When I navigate to The Agent Network section, Then I find all 10 agents with selection criteria

---

### US-003: Evaluator Assesses Architecture (Priority: P1)

**As a** technical evaluator comparing AI development frameworks, **I want** to see the system architecture and unique capabilities, **so that** I can assess whether this framework fits my team's needs.

**Acceptance Criteria**:
1. Given I want to understand the architecture, When I view the Architecture Overview, Then I see a clear diagram of component relationships
2. Given I want to understand what's unique, When I read the Memory Engine section, Then the cognitive features and causal graph are clearly differentiated from simple RAG

---

### US-004: Contributor Understands System (Priority: P1)

**As a** potential contributor, **I want** to understand how the components connect, **so that** I know where to start contributing.

**Acceptance Criteria**:
1. Given I want to contribute, When I read the Architecture Overview, Then I understand the component relationships
2. Given I want to find the codebase, When I look for installation/setup info, Then I find clear instructions or links

---

## 12. OPEN QUESTIONS

- Should the detailed installation guide be created as a separate deliverable before or after the README rewrite?
- Should the README include a table of contents, or rely on GitHub's auto-generated one?
- Should code examples in Quick Start use the `opencode` CLI directly or show the underlying commands?
- What is the target audience priority order: new visitors > existing users > evaluators > contributors?

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`

---

<!--
LEVEL 3 SPEC (~165 lines)
- Core + L2 + L3 addendums
- Executive Summary, Risk Matrix, User Stories
- Full Complexity Assessment
-->
