# Cross-Agent Analysis: LinkedIn Agents (Nigel de Lange & Pieter Bertram)

**Date:** 2026-02-10
**Agents:** 3. LinkedIn / Nigel de Lange, 3. LinkedIn / Pieter Bertram
**Auditor:** Orchestrator (Cross-Agent Comparative Analysis)
**Scope:** All findings from individual agent audits, Global shared file integration, symlink integrity, inter-agent consistency, systemic patterns
**References:** `nigel-audit-report.md`, `pieter-audit-report.md` (individual agent audits), `specs/003-tiktok-audit/audit-report.md` (prior audit for pattern comparison)

---

## Executive Summary

Cross-agent analysis of both LinkedIn AI agents reveals **4 systemic issues** that span both agents and connect to patterns already identified in the TikTok audit. The dominant finding is structural: **neither LinkedIn agent has symlinks to ANY of the 5 Global shared files**, completely isolating both agents from the shared knowledge base. This is the same root cause found in the TikTok audit (C-03, C-04, C-05), confirming it as a system-wide integration gap rather than an agent-specific oversight.

Combined with the individual audits, the total finding count across both LinkedIn agents is **23 findings** (11 Nigel + 8 Pieter + 4 cross-agent). Of these, **18 are actionable** and **4 require user decisions** before fixes can proceed.

A clear maturity pattern emerges: Pieter's files (v0.122–v0.130) have significantly fewer inter-file consistency issues than Nigel's (v0.100), demonstrating that **iteration cycles resolve consistency defects**. Nigel's files, untouched since initial creation, retain 3 inter-file mismatches that Pieter's iteration cycles have already eliminated.

| Severity | Count | Description |
|----------|:-----:|-------------|
| CRITICAL | 1 | Both agents missing ALL Global symlinks |
| HIGH | 1 | Loading condition mismatch — base Human Voice Rules not in AGENTS.md |
| MEDIUM | 1 | Neither agent references Context - Market (LinkedIn algorithm data) |
| LOW | 1 | CORINA placeholder directories in both agents |
| **TOTAL** | **4** | Cross-agent findings (in addition to 19 individual findings) |

---

## Comparative Summary Table

| Dimension | Nigel de Lange | Pieter Bertram | Pattern |
|---|---|---|---|
| **CRITICAL** | 3 findings | 1 finding (consolidated) | Same root cause: missing Global symlinks |
| **HIGH** | 4 findings | 2 findings | Nigel has more inter-file inconsistencies |
| **MEDIUM** | 3 findings (all actionable) | 3 findings (1 actionable, 2 no-fix) | Pieter's overrides work correctly |
| **LOW** | 1 finding | 2 findings (1 no-fix) | Both have CORINA placeholder |
| **TOTAL** | 11 | 8 | 23 total (incl. 4 cross-agent) |
| **Actionable** | 10 | 4 | 18 total (incl. cross-agent) |
| **Document Only** | 1 (NM-02) | 3 (PM-02, PM-03, PL-01) | — |
| **User Decision** | 2 (NH-02, NM-01) | 2 (PM-01, PH-02) | 4 total decisions needed |
| File Versions | v0.100 (no iterations) | v0.122–v0.130 (iterated) | Pieter more mature |
| Hard Blockers | ❌ Mismatch (13 vs 14) | ✅ Consistent (12) | — |
| Scoring Weights | ❌ Mismatch (SP vs QV) | ✅ Consistent | — |
| Voice Archetype | ❌ Mismatch (Pragmatic vs Founder) | ⚠️ Label not in Voice DNA | Different issues |
| UK/US English | ✅ UK throughout | ⚠️ US/Mixed (user decision) | — |
| Symlinks | 0 of 5 | 0 of 5 | Systemic gap |
| CORINA placeholder | ❌ Present | ❌ Present | Both |

---

## CRITICAL Issues (1)

### XC-01: Neither Agent Has Symlinks to ANY Global Shared Files

**Agents:** Nigel de Lange, Pieter Bertram
**Related Individual Findings:** NC-01, NC-02, NC-03, NM-03 (Nigel); PC-01 (Pieter)
**Related TikTok Findings:** C-03, C-04, C-05

Both LinkedIn agent directories are completely isolated from the Global shared knowledge base. Neither agent has symlinks to any of the 5 Global shared files:

| Global File | Nigel Symlink | Pieter Symlink | Purpose |
|---|:---:|:---:|---|
| `0. Global (Shared)/rules/Rules - Human Voice - v0.101.md` | ❌ Missing | ❌ Missing | Base voice rules, word blacklist (33 hard blockers), sentence structure constraints |
| `0. Global (Shared)/context/Context - Brand - v0.110.md` | ❌ Missing | ❌ Missing | Company overview, founding story, leadership, target audiences, terminology, brand safety |
| `0. Global (Shared)/context/Context - Industry - v0.110.md` | ❌ Missing | ❌ Missing | Industry landscape, competitive positioning, market dynamics |
| `0. Global (Shared)/context/Context - Market - v0.110.md` | ❌ Missing | ❌ Missing | LinkedIn algorithm intelligence (Section 6), engagement patterns, content timing |
| `0. Global (Shared)/context/Context - Canonical Stats Registry - v0.110.md` | ❌ Missing | ❌ Missing | Single source of truth for all verified statistics |

This is the **same pattern** found in the TikTok audit (C-03, C-04, C-05), confirming this as a systemic issue across ALL agents — not an isolated oversight.

**Impact:** Both LinkedIn agents operate without access to:
- **Base voice rules** — the full word blacklist and sentence structure constraints that Extensions files assume are loaded
- **Brand positioning** — company overview, founding story, terminology rules, brand safety protocols
- **Industry context** — competitive landscape and market dynamics
- **Market intelligence** — LinkedIn-specific algorithm data, engagement patterns, content timing
- **Verified statistics** — the canonical stats registry designed to prevent stat drift

**Fix:** Create symlinks for both agents using the naming convention `{Agent Name} - {Category} - {Name} - {version}.md` → target path. All 5 symlinks must be created for each agent (10 symlinks total).

---

## HIGH Issues (1)

### XH-01: Loading Condition Mismatch — System Prompts Reference Global Base Docs as ALWAYS but AGENTS.md Doesn't List Them

**Agents:** Nigel de Lange, Pieter Bertram
**Related Individual Findings:** NC-01 (Nigel, Human Voice specifically); PC-01 (Pieter, Human Voice specifically)
**Related TikTok Findings:** C-03

Both agents exhibit the same loading condition mismatch between their System Prompt and AGENTS.md:

| Agent | System Prompt Says | AGENTS.md "Always Load" Lists |
|---|---|---|
| **Nigel** | Section 3.2 (line 163): "Human Voice Rules" = ALWAYS | Only Extensions file (lines 131–133) — not the base |
| **Pieter** | Section 3.2 (line 137): "Rules - Human Voice" = ALWAYS | Only Extensions file (lines 131–133) — not the base |

The base Human Voice Rules (Global) contains the full word blacklist that Extensions files assume is loaded. The Extensions file provides OVERRIDES to the base rules — without the base loaded, there is nothing to override.

**Impact:** When the AI agent follows AGENTS.md loading instructions:
1. It loads only the Extensions file (agent-specific additions/overrides)
2. It does NOT load the base Human Voice Rules
3. The full word blacklist (33 hard blockers, 16 phrase blockers), sentence structure rules, and core voice constraints are missing
4. Extensions overrides have no base to modify — they are applied to nothing

**Fix:** After creating symlinks (XC-01), add the base Human Voice Rules file to AGENTS.md "Always load" section for both agents.

---

## MEDIUM Issues (1)

### XM-01: Neither Agent References Context - Market

**Agents:** Nigel de Lange, Pieter Bertram
**Related TikTok Findings:** — (new finding; TikTok had H-05 for same pattern)

The Global file `0. Global (Shared)/context/Context - Market - v0.110.md` contains LinkedIn-specific algorithm intelligence in Section 6, including:
- LinkedIn algorithm signal priority ranking
- Content format performance data
- Engagement pattern timing
- Platform-specific optimisation strategies

Neither agent's System Prompt nor AGENTS.md references this file for any loading condition. The LinkedIn agents — the very agents that would benefit most from LinkedIn algorithm data — have no path to access it.

**Impact:** LinkedIn-specific algorithm data (engagement patterns, content timing, format performance) is available in the shared knowledge base but completely unused. Both agents generate LinkedIn content without access to verified LinkedIn platform intelligence.

**Fix:** Create symlinks for both agents (covered by XC-01). Add to ON COMMAND loading condition (suggested: `$optimize` command or similar trigger for algorithm-aware content refinement).

---

## LOW Issues (1)

### XL-01: CORINA Placeholder Directories in Both Agents

**Agents:** Nigel de Lange, Pieter Bertram
**Related Individual Findings:** NL-01 (Nigel); PL-02 (Pieter)

Both agent directories contain CORINA subdirectories:
- `3. LinkedIn/Nigel de Lange/CORINA`
- `3. LinkedIn/Pieter Bertram/CORINA`

Both appear to be symlinks or placeholders pointing to `MISSING_CONTEXT.md`. These are likely TODO placeholders from initial agent setup that were never resolved.

**Impact:** Directory clutter. Potential confusion during file enumeration by AI agents or human operators. No functional impact on agent behaviour.

**Fix:** Remove or resolve. Determine if CORINA context was planned and is still needed. If no longer needed, delete both directories. If needed, create the target content.

---

## Pattern Analysis

Four distinct patterns emerge from the cross-agent comparison:

### 1. Symlink Gap Pattern (Systemic)

The missing Global symlinks pattern is identical to the TikTok audit findings (C-03, C-04, C-05). This confirms a **system-wide integration gap**: when new agents are created, the step to create symlinks to Global shared files is either not documented in the setup process or consistently skipped.

| Agent System | Symlinks Present | Symlinks Missing |
|---|:---:|:---:|
| TikTok | 2 of 5 | 3 of 5 |
| Nigel (LinkedIn) | 0 of 5 | 5 of 5 |
| Pieter (LinkedIn) | 0 of 5 | 5 of 5 |

The LinkedIn agents are in worse shape than TikTok, which at least had 2 symlinks (Brand and Human Voice) created.

### 2. Inter-file Consistency Pattern

Nigel has 3 inter-file mismatches (hard blocker count, scoring weights, voice archetype label). Pieter has 0 inter-file mismatches — all were resolved during the v0.122 iteration cycle. This provides direct evidence that **iteration cycles fix consistency defects**. Files written once and never revisited accumulate inconsistencies; files that go through review-and-update cycles converge toward internal consistency.

### 3. Override Architecture Works

Pieter finding PM-02 (em dash override) confirms that the Extensions → Base override mechanism works correctly **when both files are actually loaded**. Pieter's Extensions file explicitly overrides the Global em dash prohibition with a controlled allowance. This is the intended behaviour of the layered architecture — proving the architecture is sound even when integration is incomplete.

### 4. Version Maturity Correlation

| Agent | File Versions | Individual Findings | Actionable |
|---|---|:---:|:---:|
| Pieter | v0.122–v0.130 | 8 | 4 |
| Nigel | v0.100 | 11 | 10 |

Higher version numbers (more iteration cycles) correlate with fewer findings and fewer actionable issues. This suggests a natural quality improvement curve through iteration that Nigel's files have not yet benefited from.

---

## Systemic Root Cause

### Primary Root Cause (Both Agents + TikTok)

**Incomplete integration of Global shared knowledge base files during initial agent setup.**

This manifests as:
1. **Missing symlinks** to Global shared files (affects ALL agents audited to date)
2. **Loading condition mismatches** between AGENTS.md and System Prompt (AGENTS.md written without verifying System Prompt references)
3. **Inter-file consistency gaps** suggesting files were written independently without cross-validation
4. **Stale version references** to Global files that have since been updated

The agent setup process does not enforce or verify Global file integration. Each agent is created as an island, with symlinks to the shared knowledge base treated as optional rather than mandatory.

### Secondary Root Cause (Nigel Specifically)

**No iteration cycles applied since v0.100 creation.** Pieter's files have gone through iteration cycles (reaching v0.122+) which resolved many of the inter-file consistency issues that still exist in Nigel's v0.100 files. The v0.100 designation across all of Nigel's files indicates they were created once and never reviewed or updated.

The evidence is clear: Pieter's iteration process (v0.100 → v0.122 → v0.130) naturally surfaced and resolved inconsistencies. Applying the same iteration process to Nigel's files would likely resolve NH-03 (voice archetype mismatch), NH-04 (scoring weight mismatch), and reduce the severity of NH-02 (hard blocker count mismatch).

---

## User Decisions Needed

Four findings across both agents require user input before fixes can proceed. These are decisions about **intent** — the audit cannot determine whether the current state is a bug or a deliberate choice.

### Decision 1: NH-02 (Nigel) — Hard Blocker Count

**Question:** Nigel's System Prompt lists 13 hard blockers but Quality Validators lists 14. Which is correct?

| Option | Action | Recommendation |
|---|---|---|
| **A (Recommended)** | Add blocker #14 to Quality Validators | More blockers = stricter quality. Aligns with brand safety. |
| B | Update System Prompt count to 13 | Removes a quality gate. |

### Decision 2: NM-01 (Nigel) — `$saas` Command

**Question:** Nigel's Interactive Mode defines a `$saas` command that doesn't appear in the canonical command list. Was this intentional?

| Option | Action | Recommendation |
|---|---|---|
| **A (Recommended)** | Add `$saas` to canonical command list | Evidence suggests intent — the command has a full definition. |
| B | Remove from Interactive Mode | Reduces feature set. |

### Decision 3: PM-01 (Pieter) — US vs UK English

**Question:** Pieter's files use US English spelling (e.g., "optimize", "analyze") while the brand standard appears to be UK English. Is this an intentional brand difference for Pieter's persona or a bug?

| Option | Action | Recommendation |
|---|---|---|
| A | Convert to UK English | Aligns with brand standard and Nigel. |
| **B (Needs Clarification)** | Document as intentional Extension override | Valid if Pieter's persona targets US/international audience. |

### Decision 4: PH-02 (Pieter) — "Founder-Operator" Label

**Question:** Pieter's System Prompt and Quality Validators both use "Founder-Operator" as the voice archetype label, but Voice DNA uses "genuine founder" instead. Which label should be canonical?

| Option | Action | Recommendation |
|---|---|---|
| **A (Recommended)** | Add "Founder-Operator" to Voice DNA | SP + QV agree on this label. Voice DNA is the outlier. |
| B | Change SP + QV to "genuine founder" | Requires editing 2 files instead of 1. |

---

## Recommended Remediation Roadmap

### Phase 2A: Critical Fixes (Both Agents, Same Session)

These fixes have no dependencies on user decisions and should be executed first.

| # | Finding | Action | Files Affected |
|---|---|---|---|
| 1 | XC-01, NC-01/02/03, PC-01 | Create all missing symlinks for both agents (10 total) | Knowledge base directories |
| 2 | XH-01 | Update AGENTS.md "Always load" for both agents to include base Human Voice Rules | Both AGENTS.md |
| 3 | NH-01 | Close unclosed quote in Nigel System Prompt | Nigel SP |
| 4 | PH-01 | Fix stale version comment in Pieter System Prompt | Pieter SP |

### Phase 2B: Nigel Consistency Fixes (After User Decisions)

| # | Finding | Action | Depends On |
|---|---|---|---|
| 5 | NH-04 | Align scoring weights SP → QV | — |
| 6 | NH-03 | Align voice archetype to "Pragmatic Operator" | — |
| 7 | NH-02 | Resolve hard blocker count | **Decision 1** |
| 8 | NM-01 | Resolve `$saas` command | **Decision 2** |

### Phase 2C: Pieter Fixes (After User Decisions)

| # | Finding | Action | Depends On |
|---|---|---|---|
| 9 | PH-02 | Resolve "Founder-Operator" canonicalization | **Decision 4** |
| 10 | PM-01 | Resolve US/UK English consistency | **Decision 3** |

### Phase 2D: Cleanup (Both Agents)

| # | Finding | Action | Files Affected |
|---|---|---|---|
| 11 | NL-01, PL-02, XL-01 | Remove CORINA placeholder directories | Both CORINA dirs |
| 12 | XM-01 | Add Context - Market loading condition | Both AGENTS.md |

### Phase 3: Token Budget Documentation

| # | Finding | Action |
|---|---|---|
| 13 | M-05 (from spec 005) | Create Global Token Budget system documentation |

### Phase 4: Final Verification

| # | Action |
|---|---|
| 14 | Re-audit all agents. Verify no regressions. Confirm all symlinks resolve. Confirm loading conditions match across AGENTS.md, System Prompt, and file headers. |

---

## Cross-Reference Table

| Cross-Agent ID | Nigel Related | Pieter Related | TikTok Related |
|---|---|---|---|
| XC-01 | NC-01, NC-02, NC-03, NM-03 | PC-01 | C-03, C-04, C-05 |
| XH-01 | NC-01 (Human Voice specifically) | PC-01 (Human Voice specifically) | C-03 |
| XM-01 | — | — | — (new finding) |
| XL-01 | NL-01 | PL-02 | — |

---

## Appendix: Finding ID Convention

| Prefix | Scope |
|---|---|
| `N` | Nigel de Lange individual findings (e.g., NC-01, NH-01, NM-01, NL-01) |
| `P` | Pieter Bertram individual findings (e.g., PC-01, PH-01, PM-01, PL-01) |
| `X` | Cross-agent findings spanning both LinkedIn agents (this report) |
| `C`, `H`, `M`, `L` | Severity: Critical, High, Medium, Low |
| TikTok `C-01`–`L-05` | TikTok audit findings (separate report) |
