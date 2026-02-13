# Feature Specification: README Template Alignment & Root README Restructuring

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-02-13 |
| **Branch** | `115-readme-template-alignment` |

---

## 2. PROBLEM & PURPOSE

### Problem Statement
The `readme_template.md` does not document several patterns that have evolved in practice (badges, architecture diagrams, Before/After comparisons, anchor placement rules, TOC consistency). The root `README.md` has structural issues: broken anchor tags (overview never closed, structure never opened), missing Quick Start (section 2) and Structure (section 3) sections, section numbering that only reaches 7 instead of the template's 9-section standard, and 2 phantom TOC links. Additionally, several key features are underrepresented or absent from the root README (local-first/privacy, Code Mode MCP, Chrome DevTools, Git Workflows, multi-stack detection, extensibility).

### Purpose
Align the README template with evolved best practices, fix structural and navigation issues in the root README, and add missing feature coverage so the root README accurately represents the full OpenCode system within a 1000-line budget.

---

## 3. SCOPE

### In Scope
- **Phase 1**: Update `readme_template.md` to document evolved patterns (badges, architecture diagrams, Before/After comparisons, anchor placement rules, TOC consistency)
- **Phase 2**: Fix root `README.md` structural issues (broken anchors, missing sections, section renumbering to 9, TOC synchronization)
- **Phase 3**: Add underrepresented feature content to root `README.md` (10 feature areas)

### Out of Scope
- Rewriting non-README documentation files - separate spec required
- Changing the underlying OpenCode system behavior - documentation only
- Updating skill-specific READMEs - covered by spec 112
- Modifying the anchor schema definition - covered by spec 111

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/workflows-documentation/references/readme_template.md` | Modify | Add evolved pattern documentation (badges, diagrams, Before/After, anchors, TOC) |
| `README.md` | Modify | Fix structural issues, renumber sections, add missing feature content |

---

## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Template documents badge patterns | `readme_template.md` includes badge usage guidelines with examples |
| REQ-002 | Template documents anchor placement rules | Template includes anchor open/close pairing rules and positioning guidance |
| REQ-003 | Root README anchors are fixed | No broken anchor tags (overview closed, structure opened properly) |
| REQ-004 | Root README has 9 numbered sections | Sections numbered 1-9, matching template standard |
| REQ-005 | TOC matches actual headings | Zero phantom links; every TOC entry resolves to a real heading |
| REQ-006 | Root README stays within 1000 lines | Final line count does not exceed 1000 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Template documents architecture diagram patterns | Section with diagram format guidelines and examples |
| REQ-008 | Template documents Before/After comparison format | Template section with Before/After pattern and when to use it |
| REQ-009 | Quick Start section (section 2) added to root README | Section with installation/setup steps present |
| REQ-010 | Structure section (section 3) added to root README | Directory tree or folder overview present |
| REQ-011 | All 10 feature areas represented in root README | Each of the 10 underrepresented features has content (paragraph, table, or subsection) |

---

## 5. SUCCESS CRITERIA

- **SC-001**: `readme_template.md` documents all 5 evolved patterns (badges, architecture diagrams, Before/After, anchor rules, TOC consistency)
- **SC-002**: Root `README.md` has exactly 9 numbered top-level sections with zero broken anchors and zero phantom TOC links
- **SC-003**: Root `README.md` total line count is between 800 and 1000 lines
- **SC-004**: All 10 underrepresented features have dedicated content in the root README

---

## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Spec 111 (anchor schema) | Anchor rules must not conflict with 111's schema | Review 111's decisions before defining anchor rules in template |
| Dependency | Spec 113 (style alignment) | Style conventions must be followed | Apply 113's style rules during all edits |
| Dependency | Spec 114 (doc reduction) | Line budget must be respected | Track line count during Phase 3 additions |
| Risk | Line budget overrun | Adding 10 feature areas may exceed 1000 lines | Use concise formats (tables, single paragraphs) and measure after each addition |
| Risk | Section renumbering breaks external links | External references to old section numbers break | Search codebase for README section references before renumbering |

---

---

## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No build or runtime impact - documentation changes only
- **NFR-P02**: README renders correctly on GitHub within 2 seconds (standard for <1000 lines)

### Security
- **NFR-S01**: No secrets, API keys, or credentials in README content
- **NFR-S02**: No internal-only URLs exposed in public README

### Reliability
- **NFR-R01**: All markdown links resolve (no 404s)
- **NFR-R02**: All anchor tags properly paired (open + close)

---

## L2: EDGE CASES

### Data Boundaries
- Empty sections: If a feature area has no meaningful content yet, use a one-line summary with a "coming soon" indicator rather than leaving blank
- Maximum section length: No single section should exceed 80 lines to maintain readability
- Anchor naming: Must follow kebab-case convention and not duplicate existing anchors

### Error Scenarios
- Conflicting anchor names with spec 111 schema: Defer to 111's naming authority
- TOC auto-generation tools: Manual TOC must be maintained; no auto-gen dependency

### State Transitions
- Phase 2 depends on Phase 1 completion (template must define rules before README applies them)
- Phase 3 can begin after Phase 2's structural fixes are in place

---

## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | 2 files, ~270-345 LOC changes, 3 phases |
| Risk | 8/25 | Documentation only, low breakage risk, but line budget constraint |
| Research | 5/20 | Need to audit current state of both files, cross-reference 4 related specs |
| **Total** | **25/70** | **Level 2** |

---

## 10. OPEN QUESTIONS

- Should Phase 3 feature content use a consistent format (e.g., all tables, all prose, or mixed)?
- Are there any external sites or READMEs that link to the root README by section number that would break with renumbering?

---
