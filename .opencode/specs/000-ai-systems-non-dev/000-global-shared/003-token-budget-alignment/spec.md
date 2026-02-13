# Spec: Global Shared Files & Loading Condition Alignment

**Level:** 2 (Multi-system refactor with cross-file coordination)
**Status:** Draft
**Created:** 2026-02-12
**Scope:** All 7 DEPTH framework AI agents
**Prior Work:** `../cross-agent-analysis.md` (LinkedIn audit, 2026-02-10), `../001-human-voice-rules/` (HVR refinement, complete), `../002-remaining-work-archive/` (archived tasks, complete)

---

## 1. Overview

Align all 7 DEPTH framework AI systems with the Global (Shared) files architecture. Delete the Token Budget document (v0.100) — it's a second source of truth that was already stale on arrival and adds maintenance burden without enforcement. Loading tiers are already defined in each agent's AGENTS.md and System Prompt; that's the canonical source. The remaining work: fix inconsistent symlink coverage, resolve loading condition misalignments between AGENTS.md and System Prompts, and bring 4 agents under the 130 KB ALWAYS-load ceiling.

**Note:** Since the cross-agent analysis (2026-02-10), the LinkedIn agents have been fixed — both Nigel and Pieter now have 5/5 Global symlinks. This spec addresses the remaining system-wide gaps.

---

## 2. Problem Statement

### 2.1 Token Budget Document — Delete

The Token Budget v0.100 (`0. Global (Shared)/system/System - Token Budget - v0.100.md`) is a 16 KB reference document that:
- Was already inaccurate within days of creation (LinkedIn agents underreported by 76-79 KB)
- Duplicates information already defined in AGENTS.md and System Prompts
- Has no enforcement mechanism — nobody checks it before making changes
- Drifts the moment any knowledge base file changes

**Decision:** Delete the file. Loading tiers live in AGENTS.md (canonical) and System Prompts (mirror). File sizes can be measured any time with `wc -c`. Remove the HTML comment references (`<!-- Token Budget Reference: ... -->`) from all 7 AGENTS.md files.

**Measured ALWAYS-load sizes (for reference, verified 2026-02-12):**

| Agent | Measured Local ALWAYS | + Global Symlinks (ALWAYS) | Actual Total ALWAYS |
|-------|----------------------|---------------------------|---------------------|
| Nigel de Lange | 170.77 KB (8 files) | +24.64 KB (HV) | **~195 KB** |
| Pieter Bertram | 155.80 KB (8 files) | +24.64 KB (HV) | **~180 KB** |
| TikTok | 115.40 KB (6 local) | +75.05 KB (HV+Brand+Stats) | **~190 KB** |
| Copywriter | 116.25 KB (6 local) | +48.35 KB (HV+Brand) | **~165 KB** |
| Barter Deals | 95.53 KB (4 local) | +24.64 KB (HV) | **~120 KB** |
| Product Owner | 62.70 KB (3 local) | +24.64 KB (HV) | **~87 KB** |
| Prompt Improver | 75.75 KB (3 local) | +0 KB (no Global) | **~76 KB** |

### 2.2 Inconsistent Global Shared File Coverage

Verified symlink matrix (2026-02-12 — all existing symlinks valid, 0 broken):

| Agent | Human Voice | Brand | Industry | Market | Stats Registry | Score |
|-------|:-----------:|:-----:|:--------:|:------:|:--------------:|:-----:|
| Barter Deals | symlink | symlink | symlink | symlink | symlink | **5/5** |
| Nigel de Lange | symlink | symlink | symlink | symlink | symlink | **5/5** |
| Pieter Bertram | symlink | symlink | symlink | symlink | symlink | **5/5** |
| TikTok | symlink | symlink | -- | symlink | symlink | **4/5** |
| Copywriter | symlink | symlink | -- | symlink | -- | **3/5** |
| Product Owner | symlink | -- | -- | -- | -- | **1/5** |
| Prompt Improver | -- | -- | -- | -- | -- | **0/5** |

**Gap analysis:**
- **TikTok** missing Industry (content covers creator economy topics — would benefit)
- **Copywriter** missing Industry and Stats Registry (writes brand copy with stats — needs registry)
- **Product Owner** missing Brand, Industry, Market, Stats Registry (writes tasks referencing brand context)
- **Prompt Improver** has 0 symlinks (may be intentional — operates on prompts, not brand content)

### 2.3 Loading Condition Misalignments

Mismatches found between the 2 canonical sources (AGENTS.md DAG vs System Prompt loading tables):

**Critical mismatches (AGENTS.md and System Prompt disagree):**

| File | Agents Affected | AGENTS.md Says | System Prompt Says | Issue |
|------|----------------|----------------|-------------------|-------|
| DEPTH Framework | Nigel, Pieter, Prompt Improver | Missing from DAG | ALWAYS | System Prompt loads it but AGENTS.md doesn't list it |
| Interactive Mode | Nigel | ALWAYS (implied) | ALWAYS | Should be INTERACTIVE (only needed for multi-turn) |
| Interactive Mode | Prompt Improver | "load if ambiguous" | ALWAYS | Contradictory — needs one definitive answer |

**Note:** After deleting the Token Budget doc, the mismatches previously attributed to it (Brand as ON_COMMAND, Stats Registry as ON_COMMAND, HV Extensions as ON_COMMAND) are no longer relevant — those were doc-only discrepancies.

### 2.4 ALWAYS-Load Ceiling Violations

Recommended ceiling: **<= 130 KB** (~32,500 tokens) — leaves room for conversation, ON_COMMAND files, and model reasoning in 128K-200K context models.

| Agent | Measured ALWAYS (full) | Over Ceiling | Severity |
|-------|----------------------|--------------|----------|
| Nigel de Lange | ~195 KB | +65 KB (50%) | HIGH |
| TikTok | ~190 KB | +60 KB (46%) | HIGH |
| Pieter Bertram | ~180 KB | +50 KB (38%) | HIGH |
| Copywriter | ~165 KB | +35 KB (27%) | MEDIUM |
| Barter Deals | ~120 KB | Within ceiling | OK |
| Product Owner | ~87 KB | Within ceiling | OK |
| Prompt Improver | ~76 KB | Within ceiling | OK |

### 2.5 Extension Pattern Gaps

| Agent | HV Ext | Brand Ext | Industry Ext | Market Ext | Complete? |
|-------|:------:|:---------:|:------------:|:----------:|:---------:|
| Barter Deals | v0.100 | v0.100 | v0.100 | v0.100 | YES |
| Copywriter | v0.102 | v0.103 | -- | v0.103 | Missing Industry Ext |
| Nigel de Lange | v0.100 | v0.100 | v0.100 | -- | Missing Market Ext |
| Pieter Bertram | v0.102 | v0.100 | v0.100 | -- | Missing Market Ext |
| TikTok | v0.110 | v0.110 | -- | -- | Missing Industry + Market Ext |
| Product Owner | -- | -- | -- | -- | No Extensions files |
| Prompt Improver | -- | -- | -- | -- | No Extensions files |

---

## 3. Measured File Sizes (byte-accurate, 2026-02-12)

### 3.1 Global Shared Files

| File | Bytes | KB |
|------|------:|---:|
| Context - Market - v0.110.md | 37,703 | 36.82 |
| Context - Industry - v0.110.md | 27,425 | 26.78 |
| Context - Canonical Stats Registry - v0.110.md | 27,339 | 26.70 |
| Rules - Human Voice - v0.101.md | 25,232 | 24.64 |
| Context - Brand - v0.110.md | 24,275 | 23.71 |
| ~~System - Token Budget - v0.100.md~~ | ~~16,351~~ | ~~15.97~~ | **DELETE** |
| **Total (after deletion)** | **141,974** | **138.65** |

### 3.2 Per-Agent Summaries

| Agent | ALWAYS Local (KB) | ON_COMMAND Local (KB) | Total Local (KB) |
|-------|------------------:|---------------------:|-----------------:|
| Nigel de Lange | 170.77 | 25.63 | 196.41 |
| Pieter Bertram | 155.80 | 19.49 | 175.28 |
| TikTok | 115.40 | 39.70 | 155.10 |
| Copywriter | 116.25 | 16.06 | 134.31 |
| Barter Deals | 95.53 | 41.62 | 137.15 |
| Prompt Improver | 75.75 | 227.03 | 302.77 |
| Product Owner | 62.70 | 112.04 | 174.74 |

---

## 4. Target State

### 4.1 Token Budget Doc Deleted
- `System - Token Budget - v0.100.md` removed from `0. Global (Shared)/system/`
- HTML comment references removed from all 7 AGENTS.md files
- Loading tiers defined solely in AGENTS.md (canonical) and System Prompt (mirror)

### 4.2 Rational Symlink Coverage
- Each agent has symlinks to the Global files it NEEDS (justified per agent function)
- Decision matrix documents rationale for each agent's Global file set
- Prompt Improver explicitly documented as intentionally self-contained (if confirmed)

### 4.3 Loading Condition Alignment
- Zero mismatches between AGENTS.md and System Prompt for all 7 agents
- Authority chain: AGENTS.md is canonical -> System Prompt mirrors

### 4.4 ALWAYS-Load Optimization
- All agents at or below 130 KB ALWAYS-load ceiling, OR justified exception documented
- Candidates for demotion to ON_COMMAND identified and moved where safe

### 4.5 Extension Pattern Completion
- All agents with Global symlinks have corresponding Extensions files
- Extensions files can be minimal stubs if no overrides needed yet

---

## 5. Scope

### In Scope
- Delete Token Budget v0.100 and remove all references
- Missing symlink creation (with rationale per agent)
- Loading condition alignment between AGENTS.md and System Prompt
- ALWAYS-load audit and demotion recommendations
- Extension pattern gap-fill
- Validation checklist for ongoing maintenance

### Out of Scope
- Media Editor, Notion, CapCut (non-DEPTH frameworks)
- Creating new Global Shared files (only linking existing ones)
- Modifying knowledge base file CONTENT (only loading/linking metadata)
- System Prompt routing logic changes (separate scope)
- File version bumps or content updates

---

## 6. Acceptance Criteria

1. Token Budget v0.100 deleted; no HTML comment references remain in any AGENTS.md
2. Loading conditions consistent between AGENTS.md and System Prompt for all 7 agents (zero mismatches)
3. Symlink matrix documented with rationale for each agent's Global file needs
4. All agents either meet 130 KB ALWAYS-load ceiling or have documented justification
5. Validation checklist runnable to verify ongoing compliance
6. No broken symlinks introduced
7. Parent spec.md index updated with this sub-spec entry

---

## 7. Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Changing loading conditions breaks agent behavior | Medium | High | Change one agent at a time; test after each change |
| ALWAYS-load demotion degrades content quality | Low | Medium | Only demote genuinely conditional files; preserve identity files |
| Symlink path errors | Low | High | Use relative paths matching existing patterns; verify each |
| AGENTS.md/System Prompt drift over time | Medium | Medium | Validation checklist as maintenance gate |
| Prompt Improver scope creep | Low | Low | Confirm Prompt Improver's self-contained design is intentional before adding symlinks |
