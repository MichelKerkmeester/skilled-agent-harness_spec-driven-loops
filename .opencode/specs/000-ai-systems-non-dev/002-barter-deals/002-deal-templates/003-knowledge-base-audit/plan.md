# Implementation Plan: Knowledge Base Cross-File Audit

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.0 -->
<!-- RETROACTIVE: This plan was created after implementation to document work performed 2025-02-09 through 2025-02-10 -->

---

## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown (content files, not code) |
| **Framework** | Barter deals knowledge base (11-file instruction set) |
| **Storage** | Local filesystem (`2. Barter deals/knowledge base/`) |
| **Testing** | Manual cross-file verification (re-read after each edit) |

### Overview

This plan covers a systematic cross-file audit of the Barter deals knowledge base. The approach was: read all 11 files in full, cross-reference every shared concept (scoring thresholds, perspective names, word counts, round counts, keywords), identify all contradictions and style violations, classify by severity, obtain user approval, then apply fixes in dependency order (critical first, then moderate, then minor).

---

## 2. QUALITY GATES

### Definition of Ready
- [x] All 11 files read in full
- [x] Cross-reference matrix built (which files reference which concepts)
- [x] All issues classified by severity with exact line numbers

### Definition of Done
- [x] All 18 fixes applied
- [x] Each fix verified by re-reading the modified file
- [x] No new inconsistencies introduced
- [x] Spec folder documentation created (this document)

---

## 3. ARCHITECTURE

### Pattern
Content audit pattern: Read-Identify-Classify-Approve-Fix-Verify

### Key Components
- **System files** (Prompt, Interactive Mode, DEPTH Framework): Core instruction set, most cross-referenced
- **Rules files** (HVR Extensions, Standards): Style enforcement and quality standards
- **Context files** (Brand Ext., Industry Ext., Market Data Ext.): Supporting context with worked examples
- **Reference files** (Product, Service): Deal type templates with examples

### Data Flow
```
All 11 files read → Cross-reference analysis → Issue identification →
User approval → Fix application (Critical → Moderate → Minor) →
Per-fix verification → Final cross-check
```

---

## 4. IMPLEMENTATION PHASES

### Phase 1: Audit & Discovery
- [x] Read all 11 knowledge base files in full
- [x] Build cross-reference map of shared concepts
- [x] Identify all inconsistencies, contradictions, and violations
- [x] Classify into Critical (C), Moderate (M), Minor (L) tiers

### Phase 2: User Decisions & Approval
- [x] Present all 18 issues with exact line references
- [x] Obtain canonical source decisions (DEPTH Framework for scoring, Standards for word counts)
- [x] Obtain specific fix decisions (Example 2 math: change total)
- [x] Get blanket approval to fix all 18 issues

### Phase 3: Fix Application
- [x] Apply Critical fixes (C1-C5): Scoring thresholds, sub-dimension name, complexity keywords, math error
- [x] Apply Moderate fixes (M1-M7): Round counts, word counts, perspective names, cross-refs, table formatting
- [x] Apply Minor fixes (L1-L6): Version suffixes, enumeration counts, clarifying notes

### Phase 4: Verification
- [x] Re-read each modified file to confirm fix applied correctly
- [x] Cross-check key alignments (scoring, perspectives, word counts, DEPTH rounds)
- [x] Confirm no unintended side effects

---

## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Manual verification | Re-read edited sections after each fix | Read tool with offset/limit |
| Cross-file check | Verify shared concepts match across all files | Targeted re-reads of relevant sections |
| Formatting check | Confirm markdown tables render correctly | Visual inspection of table structure |

---

## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| DEPTH Framework as DEAL scoring authority | Internal (user decision) | Green | Cannot fix C3 without knowing canonical source |
| Standards as word count authority | Internal (user decision) | Green | Cannot fix M2a/M2b/M2c without canonical source |
| Example 2 math resolution | Internal (user decision) | Green | Two valid fixes; user must choose |

---

## 7. ROLLBACK PLAN

- **Trigger**: If a fix introduces a worse inconsistency or changes meaning unintentionally
- **Procedure**: Revert the specific edit using the original text (preserved in issue documentation). Each fix was atomic and independent, so individual rollback is possible without affecting other fixes.

---

## L2: PHASE DEPENDENCIES

```
Phase 1 (Audit) ──► Phase 2 (Decisions) ──► Phase 3 (Fixes) ──► Phase 4 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Audit & Discovery | None | Decisions |
| User Decisions | Audit complete | Fix Application |
| Fix Application | User approval | Verification |
| Verification | All fixes applied | Completion |

---

## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Audit & Discovery | High | Reading 11 files, building cross-reference map |
| User Decisions | Low | 3 decision points presented and resolved |
| Fix Application | Medium | 18 targeted edits across 10 files |
| Verification | Medium | Re-reading all edited sections |
| **Total** | | **Single extended session** |

---

## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Original text preserved for every edit (in issue documentation)
- [x] Fixes applied atomically (one edit at a time)
- [x] Each fix verified before proceeding to next

### Rollback Procedure
1. Identify the problematic fix by its ID (C1-C5, M1-M7, L1-L6)
2. Locate the original text in the issue documentation
3. Revert the specific edit using the original text
4. Re-verify the file after reversal

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: Each fix is a text replacement; reverse by swapping newString and oldString
