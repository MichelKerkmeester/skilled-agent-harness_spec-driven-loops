# TikTok SEO & Creative Strategy — Audit Report

**Date:** 2026-02-10
**System:** 4. TikTok SEO & Creative Strategy
**Auditor:** Orchestrator (Sequential Thinking analysis)
**Scope:** AGENTS.md, System Prompt v0.121, DEPTH Framework v0.111, Interactive Mode v0.110, all knowledge base files, Global shared files, symlink integrity

---

## Executive Summary

Comprehensive audit of the TikTok SEO & Creative Strategy AI agent system. 21 findings identified across 12+ files.

| Severity | Count | Description |
|----------|:-----:|-------------|
| CRITICAL | 5 | Scoring contradictions, missing document loading, registry disconnect |
| HIGH | 5 | Brand voice mismatch, rule violations in examples, stat conflicts |
| MEDIUM | 6 | Validation ordering, version drift, fragile references |
| LOW | 5 | Naming conventions, UX issues, minor overlaps |
| **TOTAL** | **21** | |

### Root Cause

**Multi-document architecture without single-source-of-truth enforcement.** The same information (statistics, loading conditions, scoring totals, voice values) exists in multiple documents. Updates to one document don't propagate to others. The Global Canonical Stats Registry was designed to solve this for statistics but was never integrated into the TikTok system.

---

## CRITICAL Issues (5)

### C-01: CONTENT Score 35 vs 37 Contradiction

**Files:** System Prompt v0.121 (Sections 2, 7, 11)

The CONTENT scoring system has three contradictory values within the same document:

| Location | What It Says | Correct Value |
|----------|-------------|---------------|
| Section 7: 37-Point Breakdown | O(riginality) = 7 points, Total = 37 | ✅ Correct |
| Section 2 Rule 30: Artifact Format | `CONTENT: Z/35` | ❌ Should be Z/37 |
| Section 11: Quick Check | Each dimension /5, Total __/35 | ❌ O should be /7, Total /37 |

**Impact:** AI agent may score content against /35 maximum, making scores appear higher than they are. A piece scoring 30/37 (81%) would appear as 30/35 (86%), potentially shipping below-quality content.

**Fix:** Replace all "/35" with "/37" in System Prompt. Update Quick Check to show O as "/7".

---

### C-02: Interactive Mode Loading Condition Contradiction

**Files:** Interactive Mode v0.110 (header) vs System Prompt v0.121 (Section 4) vs AGENTS.md (Step 1)

| Source | Says |
|--------|------|
| Interactive Mode file header | `Loading Condition: TRIGGER` |
| System Prompt Section 4 | Loading: **ALWAYS** |
| AGENTS.md Step 1 | Listed as mandatory reading (implies ALWAYS) |

**Impact:** If an AI system follows the file's own header, it may skip loading Interactive Mode when no trigger fires, breaking the conversation flow for all non-triggered sessions.

**Fix:** Change Interactive Mode file header from `Loading Condition: TRIGGER` to `Loading Condition: ALWAYS`.

---

### C-03: Base Human Voice Rules Missing from AGENTS.md

**Files:** AGENTS.md Step 1

AGENTS.md Step 1 mandatory reading list includes:
- ✅ `TikTok - Rules - Human Voice Extensions - v0.100.md`
- ❌ Missing: `TikTok - Rules - Human Voice - v0.110.md` (symlink → Global Rules - Human Voice)

The System Prompt Section 4 lists "TikTok - Rules - Human Voice" as **ALWAYS** load.

**Impact:** AI loads only the Extensions file (TikTok-specific additions) but not the base Human Voice Rules containing the full word blacklist (33 hard blockers, 16 phrase blockers, punctuation rules). The Extensions file assumes the base is already loaded.

**Fix:** Add `TikTok - Rules - Human Voice - v0.110.md` to AGENTS.md Step 1 mandatory reading list.

---

### C-04: Base Brand Context Missing from AGENTS.md

**Files:** AGENTS.md Step 1

AGENTS.md Step 1 mandatory reading list includes:
- ✅ `TikTok - Context - Brand Extensions - v0.100.md`
- ❌ Missing: `TikTok - Context - Brand - v0.110.md` (symlink → Global Context - Brand)

The System Prompt Section 4 lists "TikTok - Context - Brand" as **ALWAYS** load.

**Impact:** AI loads only the Brand Extensions (TikTok-specific brand overrides) but not the base Brand Context containing company overview, founding story, leadership team, target audiences, terminology rules, brand safety, and data governance. The Extensions file assumes the base is already loaded.

**Fix:** Add `TikTok - Context - Brand - v0.110.md` to AGENTS.md Step 1 mandatory reading list.

---

### C-05: Canonical Stats Registry Not Integrated

**Files:** Global `Context - Canonical Stats Registry - v0.110.md`, System Prompt v0.121 (Section 9), DEPTH Framework v0.111

The Global Canonical Stats Registry explicitly states:
> "All systems MUST reference this registry rather than maintaining local copies of statistics."
> Loading Condition: ALWAYS

**Current state:**
- No symlink from TikTok knowledge base to Canonical Stats Registry
- No reference in AGENTS.md or System Prompt to load the registry
- System Prompt Section 9 maintains its own local copy of 10 statistics
- DEPTH Framework has hardcoded stats in state management YAML
- One confirmed conflict exists (C-03 in HIGH: Gen Z search 64% vs 40-74%)

**Impact:** Statistics can drift between the registry and local copies. Updates to the registry don't propagate. This is exactly the failure mode the registry was designed to prevent.

**Fix:** Create symlink `knowledge base/context/TikTok - Context - Canonical Stats Registry - v0.110.md` → Global registry. Update AGENTS.md to reference it. Mark local stats as "verified against registry" with dates.

---

## HIGH Issues (5)

### H-01: Brand Voice Values Mismatch

**Files:** AGENTS.md Section 4 vs Global Context - Brand v0.110 Section 7

| Source | Brand Voice Values |
|--------|-------------------|
| AGENTS.md Section 4 (ALWAYS list) | "Simple, **Scalable**, **Effective**" |
| Global Brand Context Section 7 | "Simple, **Empowering**, **Real**" |
| System Prompt Section 1 (TikTok Voice Trinity) | "Authoritative, Actionable, Platform-Native" |

**Analysis:** The Global Brand file is the canonical source. "Simple, Empowering, Real" is the official brand voice. "Scalable" and "Effective" do not appear in the Brand voice definition. The TikTok Voice Trinity is a separate, system-specific overlay (correct by design).

**Impact:** AI may use "scalable" and "effective" as voice guidance when the actual brand values are "empowering" and "real", leading to content that sounds corporate rather than authentic.

**Fix:** Change AGENTS.md Section 4 from "Simple, Scalable, Effective" to "Simple, Empowering, Real".

---

### H-02: Em Dash in Voice Example Violates Own Rules

**Files:** System Prompt v0.121 Section 2

The voice example reads:
> "Creator content outperforms brand content by 159%**—**and most brands are ignoring this."

The Human Voice Rules (both Global and Extensions) explicitly prohibit em dashes:
> "Em dashes (—): NEVER use. Use periods, commas, parentheses instead."

**Impact:** AI may learn the em dash pattern from the example and replicate it in output, then either: (a) use em dashes in violation, or (b) catch the violation in self-review and waste a correction cycle.

**Fix:** Rewrite example: "Creator content outperforms brand content by 159%. And most brands are ignoring this."

---

### H-03: Gen Z Search Statistic Conflict

**Files:** DEPTH Framework v0.111 (state YAML) vs System Prompt v0.121 (Section 9) vs Global Canonical Stats Registry

| Source | Value |
|--------|-------|
| DEPTH Framework state YAML | `gen_z_search: "40-74% use TikTok for search"` |
| System Prompt Section 9 | `64% (Adobe Survey, 2024)` |
| Canonical Stats Registry Section 5 | `64% (Adobe Survey, 2024)` |

**Impact:** If AI references the DEPTH Framework's state YAML for quick stat access (which it likely does since it's ALWAYS loaded), it may cite "40-74%" instead of the verified "64%", publishing inaccurate data.

**Fix:** Update DEPTH Framework state YAML to `gen_z_search: "64% (Adobe Survey, 2024)"`.

---

### H-04: Statistics Duplicated Without Sync Mechanism

**Files:** System Prompt Section 9, DEPTH Framework state YAML, Global Canonical Stats Registry

Statistics appear in 3+ locations with no sync mechanism:

| Stat | System Prompt | DEPTH Framework | Registry | Consistent? |
|------|:---:|:---:|:---:|:---:|
| Creator CTR +70% | ✅ | ✅ | ✅ | ✓ |
| Creator engagement +159% | ✅ | ✅ | ✅ | ✓ |
| Gen Z search | 64% | **40-74%** | 64% | ❌ |
| Creator watch time 17.8s/7.9s | ✗ | ✗ | ✅ | Missing |
| Spark Ads 6-second +157% | ✗ | ✗ | ✅ | Missing |
| Product discovery 72% | ✗ | ✗ | ✅ | Missing |
| Purchase likelihood 2.4x | ✗ | ✗ | ✅ | Missing |

**Impact:** One confirmed conflict. Multiple useful stats in registry not available to TikTok system. No mechanism to detect future drift.

**Fix:** After C-05 (registry symlink), mark local stats as "subset, see registry for complete data" and add sync verification to maintenance.

---

### H-05: Global Market File Contains TikTok Data Without Loading Path

**Files:** Global `Context - Market - v0.110.md`

The Global Market file contains extensive TikTok-specific intelligence:
- TikTok algorithm signal priority ranking
- TikTok SEO keyword placement priority
- TikTok brand preference data (68.8%)
- Platform shift data and trends

This data partially overlaps with TikTok's own Context - Platform and Context - Strategy files but may contain additional or updated information. No symlink or loading instruction exists.

**Impact:** TikTok system may have incomplete or outdated algorithm/SEO intelligence when the Global Market file has more current data.

**Fix:** Either create a symlink or document cross-reference. Verify no conflicts between Market file TikTok sections and TikTok-specific context files.

---

## MEDIUM Issues (6)

| ID | Issue | Files | Description | Fix |
|----|-------|-------|-------------|-----|
| M-01 | Validation order in processing hierarchy | AGENTS.md §5 | Validation (step 8) placed after Response (step 7). DEPTH requires validation before delivery. | Move validation before response in hierarchy |
| M-02 | Version drift on extensions | Brand Extensions v0.100, HV Extensions v0.100 | Three files at v0.100 while system is v0.110+. May contain stale references to older base document versions. | Review and bump to v0.110 if content is current |
| M-03 | Semantic Topic Registry fragility | System Prompt §10.3 | Hardcoded section IDs (e.g., context_platform.1) with no validation. Document edits silently break references. | Add section anchors/IDs to target documents or add validation note |
| M-04 | $quick perspective rule contradiction | System Prompt §2 Rules 4 vs 7 | Rule 7 says "cannot skip" perspectives. Rule 4 creates $quick exception. DEPTH Framework doesn't mention exception. | Add explicit $quick exception note to Rule 7 and DEPTH Framework |
| M-05 | Token budget vs ALWAYS loading | AGENTS.md §4, System Prompt §4 | "Don't load all at once" instruction conflicts with 5 ALWAYS-load documents (~130K tokens for Step 1). | Document estimated token cost per document; consider tiered ALWAYS loading |
| M-06 | Brand Extensions staleness | Brand Extensions v0.100 | Extensions written for v0.100 base; base is now v0.110. Overrides or references may be stale. | Review extensions against current v0.110 base |

---

## LOW Issues (5)

| ID | Issue | Files | Description | Fix |
|----|-------|-------|-------------|-----|
| L-01 | Export naming inconsistency | Export files 001-005 | File 002 uses "blog" (command), file 005 uses "insight" (framework). Convention not standardised. | Document convention: use framework name (lowercase) |
| L-02 | Empty context folder UX | AGENTS.md Step 0 | Step 0 asks user about checking context/ folder every session, but folder has no content files. | Make Step 0 conditional on folder having non-README content |
| L-03 | Duplicate framework definitions | System Prompt §6, Context - Frameworks | Framework structures (INSIGHT, TREND, GUIDE, NEWS) defined in both files with different detail levels. | Designate Context - Frameworks as canonical; System Prompt references it |
| L-04 | Sequential Thinking MCP disconnected | AGENTS.md §1 | Sequential Thinking Protocol mentioned but not integrated with DEPTH workflow. Unclear when to use each. | Document relationship: DEPTH = content methodology, Sequential Thinking = complex planning |
| L-05 | SCOPE vs CONTENT naming overlap | DEPTH Framework §§5,8 | Both use "Context" and "Engagement" dimensions with different meanings. Could confuse AI. | Add clarifying note distinguishing SCOPE-Context from CONTENT-Context |

---

## Symlink Status

| Symlink | Target | Status | Notes |
|---------|--------|--------|-------|
| `TikTok - Context - Brand` | `Global/Context - Brand - v0.110.md` | ✅ OK | Symlink exists and target valid |
| `TikTok - Rules - Human Voice` | `Global/Rules - Human Voice - v0.100.md` | ⚠️ VERSION | Symlink works but points to v0.100 while other docs reference v0.110 |
| Canonical Stats Registry | (none) | ❌ MISSING | No symlink exists; should be ALWAYS loaded per registry rules |
| Context - Industry | (none) | ℹ️ OPTIONAL | ON-DEMAND; symlink recommended but not required |
| Context - Market | (none) | ⚠️ RECOMMENDED | Contains TikTok-specific data not available through other paths |

---

## Recommended Fix Priority

### Immediate (CRITICAL fixes — Do First)

1. **C-01:** Fix 35→37 scoring in System Prompt (Sections 2, 11)
2. **C-02:** Change Interactive Mode loading condition from TRIGGER to ALWAYS
3. **C-03:** Add base Human Voice Rules to AGENTS.md Step 1
4. **C-04:** Add base Brand Context to AGENTS.md Step 1
5. **C-05:** Create Canonical Stats Registry symlink and update AGENTS.md

### High Priority (Next)

6. **H-01:** Fix brand voice values in AGENTS.md ("Empowering, Real" not "Scalable, Effective")
7. **H-02:** Remove em dash from System Prompt voice example
8. **H-03:** Fix Gen Z search stat in DEPTH Framework (64%, not 40-74%)
9. **H-04:** Mark local stats as "see registry for canonical values"
10. **H-05:** Cross-reference Global Market TikTok data with local context files

### Medium Priority

11. **M-01:** Fix validation order in AGENTS.md processing hierarchy
12. **M-02 + M-06:** Review and version-bump v0.100 extension files
13. **M-03:** Add section anchors or validation note for Semantic Topic Registry
14. **M-04:** Add $quick exception to DEPTH Framework perspective rules
15. **M-05:** Document token budget estimates for ALWAYS-load documents

### Low Priority

16. **L-01:** Standardise export naming convention
17. **L-02:** Make Step 0 conditional on folder content
18. **L-03:** Designate single canonical source for framework definitions
19. **L-04:** Document Sequential Thinking MCP vs DEPTH relationship
20. **L-05:** Add SCOPE/CONTENT disambiguation note

---

## Resolutions

### CHK-09 Resolution: Global Market Cross-Reference

**Decision:** No formal comparison document required.

**Rationale:** The TikTok Market context file (`TikTok - Context - Strategy - v0.110.md`) is a symlink to the Global Market file in `0. Global (Shared)/`. Since both point to identical content, no conflict is possible by design. A separate comparison document would be redundant.

**Date:** 2026-02-11
**Status:** RESOLVED — N/A by architecture
