# Copywriter System Audit Report

**Spec:** 001-copywriter-system-audit  
**Date:** 2026-02-10  
**Scope:** Full system scan of "1. Copywriter" agent — symlinks, loading logic, reference integrity, data accuracy  
**Files Audited:** 12 files across 4 directories + 3 symlinks  

---

## Executive Summary

**30 issues found** across the Copywriter agent system. The most critical cluster is a **loading logic contradiction** where AGENTS.md actively undermines the System Prompt's ALWAYS-load tier for Interactive Mode and DEPTH Framework — the exact concern that triggered this audit.

| Severity | Count | Theme |
|----------|-------|-------|
| CRITICAL | 5 | Loading contradictions, wrong MEQT model, alias gaps |
| HIGH | 7 | Symlink version mismatch, data errors, missing definitions |
| MEDIUM | 10 | Undefined functions, naming mismatches, stale references |
| LOW | 8 | Cosmetic naming, version pinning style |

---

## CRITICAL Issues (5)

### C-01: Interactive Mode Loading Condition Contradicts Itself

The same document is classified three different ways:

| Source | Classification |
|--------|---------------|
| Interactive Mode file header (line 5) | `TRIGGER` |
| System Prompt knowledge base table (line 111) | `ALWAYS` |
| System Prompt loading strategy (line 317) | `ALWAYS` |
| AGENTS.md line 139 | `(default)` — ambiguous |
| AGENTS.md lines 144-146 | Only for `CLARIFICATION tasks` |

**Impact:** An AI following Interactive Mode's own header would NOT auto-load it. An AI following the System Prompt WOULD. Three different behaviors depending on which authority wins.

### C-02: AGENTS.md Conditional Loading Contradicts System Prompt ALWAYS Tier

AGENTS.md Step 2 (lines 141-146) creates an explicit fork:
- "For CREATION tasks" → load DEPTH Framework
- "For CLARIFICATION tasks" → load Interactive Mode

The System Prompt classifies BOTH as **ALWAYS** (lines 110-111, 316-317). Following AGENTS.md literally, a creation task never loads Interactive Mode, and a clarification task never loads DEPTH. **This is the root cause of the user's concern about Interactive Mode and DEPTH not being default.**

### C-03: DEPTH Framework Uses Wrong MEQT Dimension Model

DEPTH repeatedly states "each dimension 4+/5" but the actual MEQT rubric has variable maximums:

| Dimension | Actual Max | DEPTH Claims | System Prompt Floor |
|-----------|-----------|-------------|-------------------|
| M (Message Clarity) | **4** | 5 | 3 |
| E (Effectiveness) | **8** | 5 | 6 |
| Q (Quality) | **6** | 5 | 5 |
| T (Targeting) | **4** | 5 | 3 |
| D (Differentiation) | **3** | 5 | 2 |
| **Total** | **25** | 25 | 19 |

"4+/5" is impossible for Differentiation (max 3) and meaningless for Effectiveness (max 8). The quality enforcement engine operates from a wrong model.

### C-04: `$q` Alias Recognised by Interactive Mode but NOT System Prompt

| Source | `$q` recognised? |
|--------|-----------------|
| Interactive Mode state machine | Yes |
| Interactive Mode command detection | Yes |
| System Prompt `detect_mode()` | **No** — only `$quick` |
| AGENTS.md | **No** — only `$quick` |

User typing `$q` gets routed to default/interactive mode by System Prompt, but Interactive Mode's own state machine recognises it as quick mode.

### C-05: PRELOAD_GROUPS Replaces ALWAYS-Load Instead of Supplementing

System Prompt's `copywriting_workflow()` does:
```python
documents = PRELOAD_GROUPS.get(f"{mode}_creation", PRELOAD_GROUPS["interactive"])
```

This **replaces** the document list. For `write_creation` mode, the PRELOAD_GROUP includes Frameworks, Standards, HVR, DEPTH but NOT Interactive Mode or Brand. The ALWAYS tier says both should load for every request.

---

## HIGH Issues (7)

### H-01: Symlink Version Mismatch (Human Voice Rules)

Symlink name: `Copywriter - Rules - Human Voice - v0.110.md`  
Target file: `Rules - Human Voice - v0.100.md`  
The name claims v0.110 but the actual file is v0.100.

### H-02: "30-Day Free Trial" Contradicts Brand (Should Be 14 Days)

Market Extensions v0.102 line 121 says "30-day free trial".  
Brand v0.110 says "Free for 14 days" (lines 66, 232, 336, 364).  
**Factual error in customer-facing copy templates.**

### H-03: "500+ Brands" Is Deprecated (Should Be 1,000+)

Brand Extensions v0.102 line 97 says "500+ brands".  
Brand v0.110 Data Governance explicitly marks this as deprecated: use "1,000+ brands".  
**Stale statistic that would produce wrong copy.**

### H-04: Per-Dimension MEQT Floor Definitions Conflict

- System Prompt: `M:3 / E:6 / Q:5 / T:3 / D:2` (variable, correct)
- DEPTH Framework: All dimensions threshold `4` (flat, wrong)
- Interactive Mode: `19+ required` (total only, no per-dimension)

Different quality gates depending on which document the AI follows.

### H-05: `$authentic` Tone Missing from System Prompt Table

Present in: AGENTS.md, System Prompt `detect_tone()` code, Interactive Mode  
Absent from: System Prompt Tone System table (the canonical reference, 7 tones listed)

### H-06: Quick Mode Rounds Hardcoded (No Auto-Scaling)

System Prompt line 532: `rounds = 10 if not is_quick else 5`  
Documentation says "1-5 rounds with auto-scale by complexity" but code always sets 5.

### H-07: AGENTS.md ALWAYS-Load List Incomplete

AGENTS.md lists 3 ALWAYS items (HVR, HVR Extensions, Brand).  
System Prompt lists 5 ALWAYS items (adds Interactive Mode, DEPTH Framework, Brand Extensions, System Prompt itself).  
AGENTS.md omits 4 documents from its ALWAYS tier.

---

## MEDIUM Issues (10)

| ID | Issue | Location |
|----|-------|----------|
| M-01 | `interactive_flow()` function never defined in pseudocode | System Prompt line 524 |
| M-02 | State machine has no formal error state | Interactive Mode Section 3 |
| M-03 | DEPTH Framework title/filename mismatch ("Writer" vs "Copywriter", word order) | DEPTH filename vs line 1 |
| M-04 | AGENTS.md bypasses symlinks with direct Global paths | AGENTS.md lines 127, 129 |
| M-05 | Brand Extensions not mentioned in AGENTS.md ALWAYS-load | AGENTS.md loading table |
| M-06 | Cognitive rigor technique count varies (4, 5, or 6 depending on source) | System Prompt vs DEPTH |
| M-07 | No mechanism for context/ folder materials to influence routing | AGENTS.md Step 0 |
| M-08 | Sequential Thinking MCP dependency with no fallback defined | AGENTS.md lines 39-61 |
| M-09 | "PAS" typo should be "PSA" in Frameworks tone table | Frameworks v0.111 line 290 |
| M-10 | "partnerships" preferred over "collaborations" contradicts Brand v0.110 | HVR Extensions line 53 |

---

## LOW Issues (8)

| ID | Issue |
|----|-------|
| L-01 | Interactive Mode title uses "Barter" prefix, filename uses "Copywriter" |
| L-02 | Version pinning inconsistency (AGENTS.md pins, System Prompt uses generic names) |
| L-03 | Fallback chain display names don't match actual filenames |
| L-04 | System Prompt silent on MEQT 20+ aspirational target (only mentions 19+ threshold) |
| L-05 | MEQT 18 simultaneously "acceptable" (variation scaling) and "needs revision" (score actions) |
| L-06 | Cross-reference to wrong section number (Section 4.3 should be 9.3) |
| L-07 | PRELOAD_GROUPS key naming relies on string construction that breaks for "interactive" mode |
| L-08 | Extension file companion references omit version numbers |

---

## Symlink Status

| Symlink | Target | Status |
|---------|--------|--------|
| `Copywriter - Context - Brand - v0.110.md` | `0. Global/context/Context - Brand - v0.110.md` | **OK** |
| `Copywriter - Context - Market - v0.110.md` | `0. Global/context/Context - Market - v0.110.md` | **OK** |
| `Copywriter - Rules - Human Voice - v0.110.md` | `0. Global/rules/Rules - Human Voice - v0.100.md` | **FUNCTIONAL but VERSION MISMATCH** |

Missing symlinks (not linked from Global):
- Canonical Stats Registry v0.110 — not linked (may be intentional)
- Industry v0.110 — not linked (may be intentional)

---

## The Interactive Mode & DEPTH Default Question

**User concern:** "Interactive mode and DEPTH thinking should always be loaded by default unless overridden by a command."

**Finding:** The System Prompt INTENDS this (both classified ALWAYS). But three mechanisms undermine it:

1. **AGENTS.md creates conditional loading** (C-02): DEPTH only for creation, Interactive only for clarification
2. **Interactive Mode's own header says TRIGGER** (C-01): contradicts System Prompt's ALWAYS
3. **PRELOAD_GROUPS replaces the ALWAYS set** (C-05): mode-specific groups omit one or both

**Root cause:** No single authoritative loading manifest. Three documents (AGENTS.md, System Prompt, individual file headers) each define loading conditions differently, and AGENTS.md — which is read first — creates the narrowest interpretation.

**Fix:** Unify the loading logic. AGENTS.md should list both Interactive Mode and DEPTH Framework in its ALWAYS tier unconditionally, and individual file headers should say `Loading Condition: ALWAYS`.

---

## Recommended Fix Priority

### Immediate (Data Accuracy)
1. Fix "30-day" → "14-day" in Market Extensions
2. Fix "500+ brands" → "1,000+ brands" in Brand Extensions
3. Fix "partnerships" vs "collaborations" in HVR Extensions

### High Priority (Loading Logic)
4. Unify AGENTS.md ALWAYS tier with System Prompt (add Interactive Mode + DEPTH)
5. Change Interactive Mode header from TRIGGER to ALWAYS
6. Fix DEPTH Framework MEQT model (variable dimensions, not 5x5)
7. Add `$q` alias to System Prompt and AGENTS.md

### Medium Priority (Consistency)
8. Rename symlink to match target version (v0.100)
9. Fix PAS → PSA typo
10. Define interactive_flow() or remove the call
11. Add error state to Interactive Mode state machine
12. Align cognitive rigor technique counts

### Low Priority (Cosmetic)
13. Standardise file title/filename prefixes
14. Add version numbers to extension companion references
15. Fix cross-reference section numbers
