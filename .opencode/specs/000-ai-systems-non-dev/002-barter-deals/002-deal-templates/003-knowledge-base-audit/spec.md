# Feature Specification: Knowledge Base Cross-File Audit

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.0 -->
<!-- RETROACTIVE: This spec was created after implementation to document work performed 2025-02-09 through 2025-02-10 -->

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2025-02-10 (retroactive) |
| **Branch** | N/A (direct edits to knowledge base content files) |

---

## 2. PROBLEM & PURPOSE

### Problem Statement

The Barter deals knowledge base (11 markdown files across system/, rules/, context/, and reference/ directories) had accumulated internal inconsistencies, contradictions, and style violations after two rounds of creation and refinement (001-initial-creation, 002-deal-system-refinement). No cross-file audit had been performed to verify alignment between documents that reference each other.

### Purpose

Achieve 100% internal consistency across all 11 knowledge base files by identifying and fixing every cross-file contradiction, misalignment, and style violation in a single systematic audit pass.

---

## 3. SCOPE

### In Scope

- Full cross-reference audit of all 11 knowledge base files
- Identification and classification of all inconsistencies (Critical, Moderate, Minor)
- User-approved fixes for all identified issues
- Verification that fixes do not introduce new inconsistencies

### Out of Scope

- Content strategy changes (tone, voice direction) - existing voice preserved
- Adding new features or sections to the knowledge base
- Filename or version number changes
- Changes to the export/ directory or AGENTS.md structure (beyond bug fixes)

### Files Audited

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `AGENTS.md` | Modified | Fixed broken pipe char in `$batch` row (M7), added ALWAYS-loaded docs note (L5) |
| `system/System - Prompt - v0.101.md` | Modified | DEAL scoring thresholds (C3), complexity keywords (C4), Cognitive Rigor table (M3), cross-ref (M4), DEPTH trigger (M5), `$batch` pipe (M7) |
| `system/Interactive Mode - v0.101.md` | Modified | DEPTH rounds alignment (M1), filename version suffixes (L1) |
| `system/DEPTH Framework - v0.101.md` | Modified | Perspective name alignment in Quick Reference (M6) |
| `rules/Human Voice Extensions - v0.100.md` | Modified | Wrong sub-dimension name in scoring table (C2) |
| `rules/Standards - v0.100.md` | Modified | Template version field clarification (L6) |
| `context/Brand Extensions - v0.100.md` | Modified | Word count alignment to Standards tiers (M2c) |
| `context/Industry Extensions - v0.100.md` | Modified | 3-item enumeration in worked example (L4) |
| `reference/Deal Type Product - v0.100.md` | Modified | Word count alignment (M2b), content type enumeration (L2) |
| `reference/Deal Type Service - v0.100.md` | Modified | Math error in Example 2 (C5), word count alignment (M2a), niche enumeration (L3) |

---

## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | DEAL scoring thresholds in System Prompt must match DEPTH Framework Section 5 | System Prompt 3-tier table uses PASS/REVISION NEEDED/REJECTED with same score ranges as DEPTH Framework |
| REQ-002 | All perspective name lists must be consistent across files | System Prompt, DEPTH Framework, and HVR Extensions all use: Creator, Brand, Marketplace, Content, Trust |
| REQ-003 | Service Reference Example 2 math must be correct | 3 treatments x EUR 80 = EUR 240 total |
| REQ-004 | HVR Extensions scoring sub-dimensions must match body definitions | Line 25 uses "Expectations" not "Engagement" |
| REQ-005 | Complexity detection must not include "standard" as a simple-deal keyword | "standard" removed from simple keywords list to avoid false downgrades |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | All word count references must point to Standards variation tiers | Service Ref, Product Ref, and Brand Extensions reference "per Standards variation tiers (60-80 concise / 120-150 authentic / 180-220 valuable)" |
| REQ-007 | DEPTH round counts must be consistent | Interactive Mode shows 5 rounds for `$improve` in both YAML config and Quick Reference |
| REQ-008 | All markdown tables must render correctly | No unescaped pipe characters inside table cells |
| REQ-009 | Cognitive Rigor table must include all 5 DEPTH perspectives | Content perspective row added between Marketplace and Trust |
| REQ-010 | Cross-references must point to correct section numbers | DEPTH Configuration reference updated from Section 7 to Section 6 |
| REQ-011 | DEPTH Framework loading trigger must be accurate | Changed from "Complex deals, standard+ processing" to "Complex deals" |
| REQ-012 | All enumerations in examples must follow HVR 4-item rule | 3-item lists expanded to 4 items in Product Ref, Service Ref, and Industry Extensions |

---

## 5. SUCCESS CRITERIA

- **SC-001**: All 18 identified issues fixed with exact edits verified
- **SC-002**: Zero new inconsistencies introduced (cross-file alignment maintained)
- **SC-003**: DEAL scoring, perspective names, word counts, and DEPTH rounds are consistent across all files that reference them

---

## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Fixing one file could break alignment with a third file | High | Cross-reference every fix against all 11 files before applying |
| Risk | Retroactive edits could alter intended content meaning | Medium | Preserve exact wording except for the specific inconsistency being fixed |
| Dependency | DEPTH Framework as canonical source for DEAL scoring | High | User decision: DEPTH Framework is authoritative; System Prompt defers to it |
| Dependency | Standards document as canonical source for word counts | Medium | User decision: All word count references point to Standards variation tiers |

---

## L2: NON-FUNCTIONAL REQUIREMENTS

### Content Integrity
- **NFR-C01**: No fix should change the intended meaning of surrounding content
- **NFR-C02**: Markdown formatting must remain valid after all edits
- **NFR-C03**: All table structures must render correctly

### Consistency
- **NFR-K01**: Every cross-file reference must resolve to the correct target
- **NFR-K02**: Terminology must be identical across all files (no synonyms for canonical terms)

### Style Compliance
- **NFR-S01**: All examples must comply with HVR rules (no 3-item enumerations, no AI vocabulary)
- **NFR-S02**: No em dashes or semicolons in any worked example

---

## L2: EDGE CASES

### Overlapping Fixes
- Two fixes affecting the same file section: Apply in dependency order, verify after each
- Fix that changes a value referenced by multiple files: Update all referencing files in the same batch

### Ambiguous Canonical Source
- When two files disagree and neither is clearly authoritative: Escalate to user for decision
- Applied for: DEAL scoring (user chose DEPTH Framework), Example 2 math (user chose "change total to EUR 240")

### Formatting Sensitivity
- Pipe characters inside markdown table cells: Replace `|` with `/` to prevent column breaks
- Version suffixes in filenames vs document versions: Add clarifying note rather than changing values

---

## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | 10 files modified, 18 discrete fixes, all content (not code) |
| Risk | 15/25 | Cross-file dependencies, meaning preservation required |
| Research | 12/20 | Full audit required reading all 11 files and cross-referencing |
| **Total** | **45/70** | **Level 2** |

---

## 7. OPEN QUESTIONS

None remaining. All questions were resolved during the audit:
- DEPTH Framework confirmed as canonical DEAL scoring source
- Service Reference Example 2: "change total to EUR 240" (not change wording)
- All 18 fixes approved by user before implementation
