# Feature Specification: README Style Alignment

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-02-12 |
| **Branch** | `main` |

---

## 2. PROBLEM & PURPOSE

### Problem Statement
After specs 111 (README Anchor Schema) and 112 (Memory Command README Alignment), the project had 75 active README.md files with anchor tags but inconsistent visual/structural styling. The readme_template.md defines 7 style rules (YAML frontmatter, blockquotes, HRs, TOC format, H2 numbering/emoji, section separators, TOC links) that were not universally applied.

### Purpose
Apply all 7 style rules from readme_template.md to all 75 active README.md files across the project to achieve consistent documentation styling while preserving all existing anchor tags and content.

---

## 3. SCOPE

### In Scope
- Apply 7 style rules to 75 active README.md files
- YAML frontmatter (`.opencode/skill/` files only)
- Blockquote after H1 with HR separator
- TABLE OF CONTENTS with anchor wrapper (3+ H2 sections)
- H2 format: `## N. EMOJI SECTION NAME`
- HR between sections
- TOC link format: `#n--section-name`
- Verification via 10-file spot-check
- Fix any issues discovered during verification

### Out of Scope
- `.pytest_cache` auto-generated READMEs (2 files)
- `z_archive`/`goodspec-repo` archived files (7 files)
- H3-H5 heading modifications (preserve existing structure)
- Content/prose changes
- Anchor tag modifications (preserve all existing anchors)

### Files to Change

75 active README.md files across:
- `mcp_server/lib/*` (25 files)
- `mcp_server/` remaining + `scripts/*` + `shared/*` (24 files)
- `templates/*` + skill roots + top-level (26 files)

---

## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Apply all 7 style rules to 75 active READMEs | Each file complies with readme_template.md style rules |
| REQ-002 | Preserve all existing anchor tags | No anchor tags removed or modified |
| REQ-003 | Preserve content and prose | No content changes beyond formatting |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Verification via spot-check | 10-file sample shows ≥90% compliance |
| REQ-005 | Fix discovered issues | All verification failures addressed |

---

## 5. SUCCESS CRITERIA

- **SC-001**: All 75 active README.md files comply with 7 style rules from readme_template.md
- **SC-002**: Verification spot-check shows ≥90% compliance (63/70 items passing)
- **SC-003**: No anchor tags destroyed, no content modified

---

## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Specs 111 & 112 completion | Cannot verify anchor preservation | Specs already complete, anchors in place |
| Risk | Accidental content modification | Medium | Use preservation rules, verify before commit |
| Risk | Agent parallelism errors | Low | Wave pattern with 5 agents per wave, sequential waves |

---

## 7. OPEN QUESTIONS

- None — All questions resolved during implementation

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
