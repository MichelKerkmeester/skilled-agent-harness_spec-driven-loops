# Pieter Bertram LinkedIn Agent — Audit Report

**Date:** 2026-02-10
**System:** 3. LinkedIn / Pieter Bertram
**Auditor:** Orchestrator (Sequential Thinking analysis)
**Scope:** AGENTS.md, System Prompt v0.130, Voice DNA v0.122, Quality Validators v0.122, Human Voice Extensions v0.100, all knowledge base files, Global shared files, symlink integrity

---

## Executive Summary

Comprehensive audit of the Pieter Bertram LinkedIn AI agent system. 8 findings identified across 6+ files.

| Severity | Count | Description |
|----------|:-----:|-------------|
| CRITICAL | 1 | Missing Global shared file symlinks (base Human Voice, Brand, Stats Registry) |
| HIGH | 2 | Stale version reference, voice archetype label not canonicalised in Voice DNA |
| MEDIUM | 3 | US/UK English inconsistency, em dash override (working as designed), command set divergence (expected) |
| LOW | 2 | Brand terminology variant, stale CORINA placeholder |
| **TOTAL** | **8** | |

### Root Cause

**Global shared file integration never completed for the Pieter agent.** Unlike TikTok (which had symlinks created but loading instructions missing), Pieter has NO symlinks to ANY of the 5 Global shared files. The agent's AGENTS.md and System Prompt reference agent-specific files (Voice DNA, Quality Validators, Human Voice Extensions) but omit all base Global documents. This is the same root cause as TikTok C-03/C-04/C-05 and Nigel NC-01/NC-02/NC-03.

### Positive Findings

- Pieter's Hard Blocker count is **CONSISTENT**: Quality Validators says "Twelve" (12), System Prompt says "12" — no mismatch (unlike Nigel)
- Pieter's scoring weights are **CONSISTENT** between System Prompt and Quality Validators — no mismatch (unlike Nigel)
- Pieter's files are at higher versions than Nigel's: System Prompt v0.130, Voice DNA v0.122, Quality Validators v0.122 (vs Nigel's v0.100 across the board)
- Em dash override architecture is functional and correctly documented (PM-02)
- Command set personalisation reflects intentional content strategy (PM-03)

---

## CRITICAL Issues (1)

### PC-01: Base Human Voice / Brand / Stats Registry Gaps — No Global Symlinks Exist

**Files:** `3. LinkedIn/Pieter Bertram/AGENTS.md` (lines 131-133), `3. LinkedIn/Pieter Bertram/Pieter - System Prompt - v0.130.md` (line 137, Section 3.2)

AGENTS.md "Always load" lists only agent-specific files:
- Voice DNA
- Quality Validators
- Human Voice Extensions

System Prompt Section 3.2 (line 137) lists "Rules - Human Voice" as ALWAYS — but this is an ambiguous reference. It is unclear whether it means the base Global Human Voice Rules or the agent-specific Human Voice Extensions.

**No symlinks to ANY of the 5 Global shared files exist in Pieter's directory.**

| What Should Exist | Expected | Actual |
|-------------------|----------|--------|
| Base Human Voice Rules symlink | Present in directory, listed in AGENTS.md "Always load" | Missing entirely — no symlink, no loading instruction |
| Brand Context symlink | Present in directory, listed in AGENTS.md | Missing entirely — no symlink, no loading instruction |
| Canonical Stats Registry symlink | Present in directory, listed in AGENTS.md | Missing entirely — no symlink, no loading instruction |
| Industry Context symlink | Present in directory (ON-DEMAND) | Missing entirely |
| Market Context symlink | Present in directory (ON-DEMAND) | Missing entirely |

**Impact:** Base Human Voice Rules contain the full word blacklist (33 hard blockers, 16 phrase blockers, punctuation rules) that the Human Voice Extensions file assumes is already loaded. Brand context (company overview, founding story, leadership, audiences, terminology, brand safety, data governance) is completely unavailable to the agent. Stats Registry is inaccessible — the agent may fabricate statistics or use stale local copies without a canonical reference.

**Fix:** Create symlinks for all 5 Global shared files. Update AGENTS.md "Always load" to include base Human Voice Rules, Brand Context, and Canonical Stats Registry. Add Industry and Market as ON-DEMAND references.

---

## HIGH Issues (2)

### PH-01: Stats Source HTML Comment References Stale Version

**Files:** `3. LinkedIn/Pieter Bertram/Pieter - System Prompt - v0.130.md` (line 2)

| Location | Expected | Actual |
|----------|----------|--------|
| System Prompt line 2, HTML comment | `<!-- Stats source: 0. Global (Shared)/context/Context - Canonical Stats Registry - v0.110.md -->` | `<!-- Stats source: 0. Global (Shared)/Context - Canonical Stats Registry - v0.100.md -->` |

The Canonical Stats Registry was updated to v0.110 during TikTok audit remediation. The comment in Pieter's System Prompt still references v0.100 and uses the old path (without the `context/` subdirectory).

**Impact:** Maintainers following the comment will reference a non-existent file version at a non-existent path. Misleading provenance metadata that could cause confusion during future audits or updates.

**Fix:** Update comment to: `<!-- Stats source: 0. Global (Shared)/context/Context - Canonical Stats Registry - v0.110.md -->`

---

### PH-02: "Founder-Operator" Terminology Not Canonicalised in Voice DNA

**Files:** `3. LinkedIn/Pieter Bertram/Pieter - Quality Validators - v0.122.md` (line 17, Section 1), `3. LinkedIn/Pieter Bertram/Pieter - System Prompt - v0.130.md` (line 16), `3. LinkedIn/Pieter Bertram/Pieter - Voice DNA - v0.122.md` (line 17)

| Source | Voice Archetype Label | Consistent? |
|--------|----------------------|:-----------:|
| Quality Validators (line 17, Section 1) | "You must sound like a **Founder-Operator**" | Uses label |
| System Prompt (line 16) | "authentic **Founder-Operator** voice" | Uses label |
| Voice DNA (line 17) | "A genuine founder who shares real insights from the arena" | Does NOT use label |

**Note:** This is DIFFERENT from Nigel's NH-03. For Pieter, the System Prompt and Quality Validators AGREE on "Founder-Operator", but Voice DNA doesn't use that explicit label. For Nigel, Voice DNA + System Prompt agree on "Pragmatic Operator" but QV says "Founder-Operator".

**Impact:** Voice DNA is the canonical source for voice and archetype decisions. If it doesn't use the "Founder-Operator" label, that label may drift from Pieter's actual intended voice over time. An AI reasoning from Voice DNA alone would never encounter the "Founder-Operator" concept.

**Fix:** USER DECISION NEEDED (see User Decisions Needed section below).

---

## MEDIUM Issues (3)

### PM-01: US vs UK English Inconsistency

**Files:** Multiple Pieter files, `0. Global (Shared)/context/Context - Brand - v0.110.md` (Section 16)

Global Brand doc Section 16 mandates "UK English always".

| File | Examples Found | Spelling Convention |
|------|---------------|-------------------|
| AGENTS.md | "optimizing" (line 10), "behaviors" (line 27), "internalize" (line 35), "Analyzing" (line 45) | US English |
| System Prompt | "optimize" (line 121, 386), "analyze" (line 301), "rigor" (lines 21, 33, 38), "behavior" (line 63) | US English |
| Voice DNA | "optimising" in some places, "optimize" in others | MIXED |
| Nigel (all files) | Consistently UK English throughout | UK English |

**Impact:** If unintentional, posts may inconsistently mix UK/US English, creating an unprofessional impression. If intentional (Pieter as a distinct persona using US English vs Nigel's UK English), it is undocumented and would need to be formally recorded as a Human Voice Extensions override.

**Fix:** USER DECISION NEEDED (see User Decisions Needed section below).

---

### PM-02: Em Dash Override Correctly Documented

**Status: WORKING AS DESIGNED — no fix required**

**Files:** `3. LinkedIn/Pieter Bertram/Pieter - Human Voice Extensions - v0.100.md`, `3. LinkedIn/Pieter Bertram/Pieter - Voice DNA - v0.122.md` (lines 323, 635)

| Source | What It Says |
|--------|-------------|
| Global Human Voice Rules | Em dashes (---): NEVER use |
| Pieter Human Voice Extensions | Em dashes (---) are **ALLOWED** for Pieter |
| Voice DNA line 323 | "Em Dash (---) Usage: Already natural in Pieter's voice" |
| Voice DNA line 635 | "Em dashes (---): OK to use" |

This is the Extensions override mechanism working exactly as designed. The Global base sets a default prohibition; the agent-specific Extensions file overrides it for Pieter where em dashes are natural to his voice.

**Impact:** None. This finding confirms the override architecture is functional and correctly implemented.

---

### PM-03: Different Command Sets from Nigel

**Status: EXPECTED DIVERGENCE — no fix required**

| Command | Pieter | Nigel | Purpose |
|---------|:------:|:-----:|---------|
| `$creator` | Yes | No | Creator economy posts — specific to Pieter's content strategy |
| `$operations` | No | Yes | Operations content — specific to Nigel's content strategy |
| `$scaling` | No | Yes | Scaling content — specific to Nigel's content strategy |

This reflects different content strategies for different personas. Both agents share common commands and diverge only where their content focus areas differ.

**Impact:** None. This is expected and intentional personalisation.

---

## LOW Issues (2)

### PL-01: "Anti-Influency" Terminology

**Status: DOCUMENT ONLY — likely intentional brand terminology**

**Files:** `3. LinkedIn/Pieter Bertram/Pieter - Quality Validators - v0.122.md` (Section 4), `3. LinkedIn/Pieter Bertram/Pieter - System Prompt - v0.130.md` (line 56)

| Source | Term Used |
|--------|----------|
| Pieter Quality Validators Section 4 | "Anti-Influency Compliance (20 points)" |
| Pieter System Prompt line 56 | "Anti-Influency 20" |
| Nigel (all files) | "Anti-Influencer" |

The term "Anti-Influency" is used CONSISTENTLY across all Pieter files. This appears to be an intentional brand term specific to Pieter's persona (vs Nigel's "Anti-Influencer").

**Impact:** None if intentional. Minor confusion potential if accidental — someone comparing Pieter and Nigel configurations might wonder whether these refer to the same scoring dimension.

---

### PL-02: CORINA Placeholder Points to MISSING_CONTEXT.md

**Files:** `3. LinkedIn/Pieter Bertram/CORINA`

A file named CORINA exists in Pieter's directory, appearing to be a symlink or placeholder pointing to `MISSING_CONTEXT.md`. Same pattern as Nigel NL-01.

| Expected | Actual |
|----------|--------|
| Either a valid symlink to a real file, or no file at all | Dangling reference to MISSING_CONTEXT.md |

**Impact:** Clutters the knowledge base directory. May cause confusion for maintainers or AI systems attempting to load it.

**Fix:** Remove the CORINA placeholder, or resolve it to point to a valid file if it represents a planned feature.

---

## Symlink Status

| Global Shared File | Expected Symlink in Pieter Dir | Status |
|---|---|---|
| `Rules - Human Voice - v0.101.md` | `Pieter - Rules - Human Voice - v0.101.md` -> `../../../0. Global (Shared)/rules/Rules - Human Voice - v0.101.md` | MISSING |
| `Context - Brand - v0.110.md` | `Pieter - Context - Brand - v0.110.md` -> `../../../0. Global (Shared)/context/Context - Brand - v0.110.md` | MISSING |
| `Context - Industry - v0.110.md` | `Pieter - Context - Industry - v0.110.md` -> `../../../0. Global (Shared)/context/Context - Industry - v0.110.md` | MISSING |
| `Context - Market - v0.110.md` | `Pieter - Context - Market - v0.110.md` -> `../../../0. Global (Shared)/context/Context - Market - v0.110.md` | MISSING |
| `Context - Canonical Stats Registry - v0.110.md` | `Pieter - Context - Canonical Stats Registry - v0.110.md` -> `../../../0. Global (Shared)/context/Context - Canonical Stats Registry - v0.110.md` | MISSING |

**Summary:** 0 of 5 Global shared file symlinks exist. This is the worst symlink state of any audited agent (TikTok had 2 of 5, Nigel had 0 of 5).

---

## Recommended Fix Priority

### Immediate (CRITICAL fix — Do First)

1. **PC-01:** Create all 5 missing Global shared file symlinks and update AGENTS.md "Always load" to include base Human Voice Rules, Brand Context, and Canonical Stats Registry (CRITICAL, low effort)

### High Priority (Next)

2. **PH-01:** Update stale version comment in System Prompt line 2 — change v0.100 to v0.110, add `context/` to path (HIGH, trivial effort)
3. **PH-02:** Resolve "Founder-Operator" label canonicalisation in Voice DNA (HIGH, needs user decision)

### Medium Priority

4. **PM-01:** Resolve US/UK English inconsistency across all Pieter files (MEDIUM, needs user decision — potentially high effort if converting all files)

### Low Priority

5. **PL-02:** Remove or resolve CORINA placeholder (LOW, trivial effort)

### No Fix Required

- **PM-02:** Em dash override — working as designed
- **PM-03:** Command set divergence — expected personalisation
- **PL-01:** "Anti-Influency" terminology — likely intentional brand term

---

## User Decisions Needed

### Decision 1: PH-02 — "Founder-Operator" Voice Archetype Label

**Context:** System Prompt and Quality Validators both use "Founder-Operator". Voice DNA (the canonical source for voice decisions) describes "A genuine founder who shares real insights from the arena" but never uses the "Founder-Operator" label.

**Options:**
- **Option A (RECOMMENDED):** Add "Founder-Operator" label explicitly to Voice DNA Section 1.1. Rationale: System Prompt + Quality Validators already agree on this label; Voice DNA should be updated to match as the canonical source.
- **Option B:** Align System Prompt + Quality Validators to Voice DNA's phrasing ("genuine founder"). Rationale: Voice DNA is canonical; the other files should defer.

### Decision 2: PM-01 — US vs UK English

**Context:** Global Brand doc mandates "UK English always". Nigel consistently uses UK English. Pieter files predominantly use US English (with some inconsistent mixing in Voice DNA).

**Options:**
- **Option A:** Convert all Pieter files to UK English (matching Global Brand mandate and Nigel). Effort: High — requires systematic find-and-replace across all Pieter files.
- **Option B:** Document Pieter as intentionally US English. Add an explicit override in Human Voice Extensions stating Pieter uses US English as a deliberate brand differentiation from Nigel. Then fix the mixed spellings in Voice DNA to be consistently US English. Effort: Low — one line in Extensions, targeted Voice DNA fixes.
- **Option C:** Leave as-is. Risk: Continued inconsistency with no documented justification.

---

## Architectural Notes

- **AGENTS.md** = thin orchestrator that defines loading sequence
- **System Prompt** = single source of truth for routing, commands, and scoring weights
- **Voice DNA** = canonical source for voice and archetype decisions
- **Quality Validators** = canonical source for scoring criteria and hard blockers
- **Human Voice Extensions** = agent-specific overrides to Global base rules (e.g., em dashes allowed for Pieter)
- **Global Brand doc** = mandates UK English, defines brand voice values, terminology rules
- **Canonical Stats Registry** = single source of truth for all statistics across all agents
