# Feature Specification: Product Owner — DEPTH Energy Migration

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

The Product Owner system requires migration from legacy rounds-based DEPTH to the energy-level model already adopted by other systems. The DEPTH Framework file (v0.200) was already migrated and is clean, but the System Prompt (v0.956) and Interactive Mode (v0.320) still contain extensive legacy round and RICCE references that contradict the framework.

**Key Decisions**: Target System Prompt and Interactive Mode as migration files; preserve DEPTH Framework as-is (already clean)

**Critical Dependencies**: Copywriter DEPTH v0.200 as proven migration template

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Draft |
| **Created** | 2025-02-11 |
| **Branch** | `006-product-owner` |

---

## 2. PROBLEM & PURPOSE

### Problem Statement

The Product Owner system has a cross-file contradiction: the DEPTH Framework (v0.200) was migrated to energy levels (0 rounds, 0 RICCE), but the System Prompt (v0.956) still contains 16+ round references and 5 RICCE references, and the Interactive Mode (v0.320) still contains 5+ `depth_rounds` references. This means the three KB files describe two incompatible systems.

### Purpose

Align all Product Owner KB files to the energy-level model so that DEPTH Framework, System Prompt, and Interactive Mode describe the same system — zero rounds, zero RICCE, four energy levels (Raw/Quick/Standard/Deep).

---

## 3. SCOPE

### In Scope

- Full system audit (21-category bug taxonomy)
- System Prompt migration: v0.956 → v1.000
- Interactive Mode migration: v0.320 → v0.400
- Cross-file verification (zero violations)
- Audit fix implementation

### Out of Scope

- DEPTH Framework rewrite — already clean, minor review only
- Template changes (5 modes preserved as-is)
- Scoring system changes (6-dimension self-rating preserved as-is)

### Files to Change

| File | Change Type | Description |
|------|-------------|-------------|
| System Prompt v0.956 | Modify | Remove 16+ round refs, 5 RICCE refs, align Quick Reference with energy levels |
| Interactive Mode v0.320 | Modify | Remove 5+ depth_rounds refs, update command configs |
| DEPTH Framework v0.200 | Review | Verify clean state, version bump only if structural changes needed |

---

## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Full system audit with 21-category taxonomy | Audit report with severity ratings produced |
| REQ-002 | System Prompt v1.000: zero round references | `grep -ci "round" system-prompt.md` returns 0 relevant hits |
| REQ-003 | System Prompt v1.000: zero RICCE references | `grep -ci "ricce" system-prompt.md` returns 0 |
| REQ-004 | Interactive Mode v0.400: zero depth_rounds refs | `grep -ci "depth_rounds\|10 rounds" interactive-mode.md` returns 0 |
| REQ-005 | Energy levels consistent across all 3 files | Raw/Quick/Standard/Deep terminology in all files |
| REQ-006 | 6-dimension self-rating preserved | All 6 dimensions present and functional |
| REQ-007 | Checkbox syntax corrected | `[ ]` (with space) consistently, not `[]` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-008 | All MEDIUM/LOW audit findings fixed | Audit report shows all items resolved |
| REQ-009 | 5 templates preserved | Task/Bug/Story/Epic/Doc all functional |
| REQ-010 | 7 voice patterns preserved | Voice examples intact |
| REQ-011 | BLOCKING export protocol preserved | Export still blocks, sequential numbering intact |
| REQ-012 | AGENTS.md version references updated | Versions match actual file versions |

---

## 5. SUCCESS CRITERIA

- **SC-001**: Zero rounds/RICCE/depth_rounds references across all 3 KB files
- **SC-002**: All 4 energy levels (Raw/Quick/Standard/Deep) consistently referenced
- **SC-003**: All CRITICAL/HIGH audit findings resolved

---

## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Copywriter DEPTH v0.200 | Migration template reference | Already completed — stable |
| Risk | Two-Layer Processing breaks during migration | High | Preserve all Product Owner-specific logic |
| Risk | Quick Reference section has deep rounds integration | Medium | Map each rounds-based row to energy equivalent |

---

## 7. CURRENT FILE STATE

| File | Version | Lines | Round Refs | RICCE Refs | depth_rounds | Status |
|------|---------|-------|-----------|------------|-------------|--------|
| DEPTH Framework | v0.200 | 398 | 0 | 0 | 0 | **Clean** |
| System Prompt | v0.956 | 567 | 16+ | 5 | 2 | **Legacy** |
| Interactive Mode | v0.320 | 421 | 1 | 0 | 5+ | **Legacy** |

---

## 8. KEY CHARACTERISTICS (preserve)

| Attribute | Value | Notes |
|-----------|-------|-------|
| **Scoring** | 6-dimension self-rating | Completeness, Clarity, Actionability, Accuracy, Relevance, Mechanism Depth |
| **Templates** | 5 modes | Task, Bug, Story, Epic, Doc |
| **Energy Levels** | 4 levels | Raw, Quick, Standard, Deep (includes "Raw" — Product Owner-specific) |
| **Voice** | 7 example patterns | Human Voice Rules integration |
| **Export** | BLOCKING protocol | Sequential numbering |
| **Processing** | Two-Layer | Product Owner-specific feature |

---

## 9. DETAILED BUG REFERENCE

### System Prompt v0.956 — Round References (16+)

| Line | Content | Type |
|------|---------|------|
| 20 | "comprehensive 10-round DEPTH analysis" | round |
| 21 | "Auto-scale DEPTH to 1-5 rounds" | round |
| 53 | "integration with rounds" | round |
| 333 | `depth_rounds` in pseudocode | depth_rounds |
| 388 | `depth_rounds` in pseudocode | depth_rounds |
| 433 | Quick Ref table "Rounds" column | round |
| 435-439 | Round numbers 1-2, 3-5, 6-7, 8-9, 10 | round |
| 463 | "Full DEPTH (10 rounds)" | round |
| 492-495 | "Rounds 1-2", "Rounds 1-5", "Rounds 3-5", "Rounds 6-10" | round |
| 500 | "10 rounds, 1-5 for $quick" | round |
| 549 | "10 rounds / 1-5 for $quick" | round |

### System Prompt v0.956 — RICCE References (5)

| Line | Content |
|------|---------|
| 31 | Rule: "DEPTH/RICCE transparency" |
| 37 | Rule: "RICCE validation" |
| 133 | Loading table: "RICCE integration" |
| 441-449 | Full "RICCE Structure" table |
| 508 | Must-have: "Validate RICCE structure" |

### Interactive Mode v0.320 — depth_rounds References (5+)

| Line | Content |
|------|---------|
| 39 | "complete DEPTH (10 rounds)" |
| 208 | `depth_rounds: 10` |
| 210 | `depth_rounds: auto_scale_1_to_5` |
| 216 | `depth_rounds: auto_scale_1_to_5` |
| 243 | "DEPTH rounds: 10" |

### System Prompt v0.956 — Other Issues

| Issue | Location | Fix |
|-------|----------|-----|
| Checkbox syntax `[]` vs `[ ]` | Rule 27, line 71 | Change to `[ ]` |
| `depth_rounds` in pseudocode | Lines 333, 388 | Replace with energy_level |
| Quick Reference duplicates DEPTH content | Section 4 | Align with energy levels |

---

## 10. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 18/25 | Files: 3, LOC: ~1400, Systems: 1 |
| Risk | 12/25 | Breaking: Y (cross-file refs), Auth: N, API: N |
| Research | 8/20 | Audit needed, line-level analysis done |
| Multi-Agent | 3/15 | Single workstream |
| Coordination | 5/15 | 3-file cross-dependency |
| **Total** | **46/100** | **Level 3** |

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
