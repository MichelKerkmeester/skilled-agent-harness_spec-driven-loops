# Feature Specification: Create Folder README Alignment

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
| **Branch** | `117-create-folder-readme-alignment` |

---

## 2. PROBLEM & PURPOSE

### Problem Statement
The `/create:folder_readme` command pipeline has 10 alignment gaps across its three files: `readme_template.md` (canonical 14-section standard, updated in spec 115), `create_folder_readme.yaml` (765-line YAML execution asset), and `folder_readme.md` (463-line command entry point). These gaps cause inconsistent section structures, conflicting DQI targets, emoji mismatches, broken key references, and confusing step numbering — leading to unpredictable README output quality.

### Purpose
Align `create_folder_readme.yaml` and `folder_readme.md` to faithfully implement the canonical `readme_template.md` standard, eliminating all 10 documented gaps so the `/create:folder_readme` command produces consistent, template-compliant READMEs.

---

## 3. SCOPE

### In Scope
- Fix all 10 alignment gaps (3 HIGH, 3 MEDIUM, 4 LOW) across the two target files
- Ensure YAML type-specific sections map to the template's 14-section standard
- Remove/replace embedded conflicting templates in YAML (~140 lines)
- Fix broken `notes.*` key references in `folder_readme.md`
- Standardize DQI target across all three files
- Align emoji usage between YAML `emoji_conventions` and actual usage
- Correct step numbering and command name references

### Out of Scope
- Modifying `readme_template.md` itself — it is the canonical source (updated in spec 115)
- Adding new README types beyond what currently exists in the YAML
- Refactoring the YAML structure beyond alignment fixes
- Changes to the @write agent's DQI enforcement logic

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/command/create/assets/create_folder_readme.yaml` | Modify | Fix section structures, remove embedded templates, align emojis, fix step naming |
| `.opencode/command/create/folder_readme.md` | Modify | Fix broken key refs, standardize DQI target, correct step numbering, fix command name |

---

## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | YAML type-specific sections match template's 14-section standard | Each README type in YAML uses section names/order from `readme_template.md` |
| REQ-002 | Remove/replace conflicting embedded templates (~140 lines) | YAML references `readme_template.md` instead of embedding duplicate structures |
| REQ-003 | Fix broken `notes.*` key references in `folder_readme.md` | All YAML key references in `folder_readme.md` resolve to actual YAML keys |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Standardize DQI target across files | Single consistent DQI target value used in both YAML and command file |
| REQ-005 | Align emoji usage between YAML conventions and actual usage | `emoji_conventions` section matches emojis used in section definitions |
| REQ-006 | Fix 5-step vs 6-step naming confusion | `sequential_5_step` either renamed to `sequential_6_step` or reduced to 5 steps |
| REQ-007 | Correct command name in examples | All examples use `/create:folder_readme` consistently |
| REQ-008 | Fix step numbering in `folder_readme.md` | Steps numbered sequentially from 1 (not starting at 4) |
| REQ-009 | Add missing template evolution pattern references | YAML references anchors, TOC format, badges, diagrams from template |
| REQ-010 | Fix emoji mismatches (features: use correct emoji, troubleshooting: use correct emoji) | Emojis in YAML match those defined in `readme_template.md` |

---

## 5. SUCCESS CRITERIA

- **SC-001**: Zero alignment gaps between `create_folder_readme.yaml` / `folder_readme.md` and `readme_template.md`
- **SC-002**: All YAML key references in `folder_readme.md` resolve to actual YAML keys (no broken refs)
- **SC-003**: Consistent DQI target, emoji set, and section structure across the pipeline

---

## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Spec 115 (readme_template.md update) | Template must be stable | Spec 115 is complete; template is canonical |
| Risk | YAML structural changes may break existing README generation | Medium | Test with all README types after changes |
| Risk | Removing embedded templates may lose type-specific nuance | Low | Cross-reference with template before removal |
| Dependency | `readme_template.md` at `.opencode/skill/workflows-documentation/assets/documentation/readme_template.md` | Must exist and be current | Verified as 1058 lines / 14 sections from spec 115 |

---

---

## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No performance impact — these are static documentation/config files
- **NFR-P02**: N/A

### Security
- **NFR-S01**: No security implications — documentation tooling only
- **NFR-S02**: N/A

### Reliability
- **NFR-R01**: README generation must produce valid markdown after changes
- **NFR-R02**: No broken YAML syntax after modifications

---

## L2: EDGE CASES

### Data Boundaries
- Empty README type: YAML should have a fallback/default section set
- Maximum section count: Template defines 14 sections; types may use a subset but not exceed

### Error Scenarios
- Missing YAML key referenced by command: Must produce clear error, not silent failure
- Malformed YAML after edits: Validate YAML syntax after all changes

### State Transitions
- N/A — static configuration files, no runtime state

---

## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | 2 files, ~1228 combined LOC, 10 gaps to fix |
| Risk | 8/25 | Low risk — documentation tooling, no runtime impact |
| Research | 5/20 | Analysis complete (gap analysis provided), minimal research needed |
| **Total** | **25/70** | **Level 2** |

---

## 10. OPEN QUESTIONS

- What should the standardized DQI target be? (YAML says 70, folder_readme.md says 90+, @write says 75+) — recommend aligning to template/YAML owner's intent
- Should `sequential_5_step` be renamed to `sequential_6_step` or should one step be removed?

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
