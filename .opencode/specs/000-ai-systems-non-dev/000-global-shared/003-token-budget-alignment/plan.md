# Plan: Global Shared Files & Loading Condition Alignment

**Spec:** `./spec.md`
**Created:** 2026-02-12
**Approach:** 7 phases, sequential (each phase builds on prior)
**Estimated touches:** ~25 files across 8 directories

---

## Phase Overview

| Phase | Name | What Changes | Files Touched | Dependency |
|-------|------|-------------|---------------|------------|
| 1 | Symlink Needs Assessment | Decision only (no file changes) | 0 | None |
| 2 | Missing Symlinks | Create symlinks for 3 agents | 4 new symlinks | Phase 1 |
| 3 | ALWAYS-Load Audit | Identify demotion candidates | 0 (analysis only) | Phase 2 |
| 4 | Loading Condition Sync | Align AGENTS.md + System Prompt | ~8 files | Phase 3 |
| 5 | Extension Pattern Fill | Create stub Extensions files | 6 new files | Phase 2 |
| 6 | Delete Token Budget | Remove doc + all references | 8 files (1 delete + 7 edits) | Phase 4 |
| 7 | Validation & Index | Checklist + parent spec.md update | 2 files | Phase 6 |

---

## Phase 1: Symlink Needs Assessment

**Goal:** Decide which Global Shared files each agent SHOULD have, based on agent function.

### Decision Matrix

| Agent | Function | Needs Brand? | Needs Industry? | Needs Market? | Needs Stats? | Needs HV? |
|-------|----------|:---:|:---:|:---:|:---:|:---:|
| **Copywriter** | Writes brand copy, marketing content | YES (has) | YES (for industry context in copy) | YES (has) | YES (writes stats-heavy content) | YES (has) |
| **Barter Deals** | Creates deal templates for brands | YES (has) | YES (has) | YES (has) | YES (has) | YES (has) |
| **Nigel (LinkedIn)** | LinkedIn ghostwriting for COO | YES (has) | YES (has) | YES (has) | YES (has) | YES (has) |
| **Pieter (LinkedIn)** | LinkedIn ghostwriting for CEO | YES (has) | YES (has) | YES (has) | YES (has) | YES (has) |
| **TikTok** | TikTok content strategy | YES (has) | YES (creator economy overlap) | YES (has) | YES (has) | YES (has) |
| **Product Owner** | Writes tasks, stories, epics | YES (references brand terms) | NO (technical tasks, not industry) | NO (not market-facing) | NO (tasks don't cite stats) | YES (has) |
| **Prompt Improver** | Improves/refines prompts | NO (domain-agnostic) | NO (domain-agnostic) | NO (domain-agnostic) | NO (domain-agnostic) | NO (domain-agnostic) |

### Rationale Notes

**Product Owner — Brand only:** Product Owner writes tasks that reference brand terminology (creators vs influencers, EUR formatting, platform names). Brand context prevents terminology violations in task descriptions. Industry/Market/Stats are not needed because tasks describe WHAT to build, not marketing content.

**Prompt Improver — None:** Prompt Improver operates on prompt engineering patterns, not Barter-specific content. It transforms prompts regardless of domain. Adding Brand/Industry/Market context would add ~112 KB of unnecessary always-loaded context. Self-contained design is appropriate.

**TikTok — Add Industry:** TikTok content covers creator economy topics, market dynamics, and industry trends. The Industry context file contains creator economy landscape data, competitive positioning, and market dynamics directly relevant to TikTok content strategy.

### Actions

| Agent | Current Symlinks | Target Symlinks | New Symlinks Needed |
|-------|:----------------:|:---------------:|:-------------------:|
| Barter Deals | 5/5 | 5/5 | 0 |
| Nigel de Lange | 5/5 | 5/5 | 0 |
| Pieter Bertram | 5/5 | 5/5 | 0 |
| TikTok | 4/5 | 5/5 | +1 (Industry) |
| Copywriter | 3/5 | 5/5 | +2 (Industry, Stats Registry) |
| Product Owner | 1/5 | 2/5 | +1 (Brand) |
| Prompt Improver | 0/5 | 0/5 | 0 (intentional) |

**Total new symlinks: 4**

---

## Phase 2: Create Missing Symlinks

### 2.1 TikTok — Add Industry

```bash
cd "4. TikTok SEO & Creative Strategy/knowledge base/context/"
ln -s "../../../0. Global (Shared)/context/Context - Industry - v0.110.md" \
      "TikTok - Context - Industry - v0.110.md"
```

**Loading tier:** ON_COMMAND (load when industry/creator economy topics detected)

### 2.2 Copywriter — Add Industry + Stats Registry

```bash
cd "1. Copywriter/knowledge base/context/"
ln -s "../../../0. Global (Shared)/context/Context - Industry - v0.110.md" \
      "Copywriter - Context - Industry - v0.110.md"

ln -s "../../../0. Global (Shared)/context/Context - Canonical Stats Registry - v0.110.md" \
      "Copywriter - Context - Canonical Stats Registry - v0.110.md"
```

**Loading tier:** Both ON_COMMAND (load when industry context or statistics needed)

### 2.3 Product Owner — Add Brand

```bash
cd "Product Owner/knowledge base/context/"
# Create context/ directory if it doesn't exist
mkdir -p "."
ln -s "../../../0. Global (Shared)/context/Context - Brand - v0.110.md" \
      "Owner - Context - Brand - v0.110.md"
```

**Loading tier:** ON_COMMAND (load when brand terminology, creator/influencer distinction, or EUR formatting needed)

### Verification

After creating all 4 symlinks, verify each resolves:
```bash
for agent in "1. Copywriter" "4. TikTok SEO & Creative Strategy" "Product Owner"; do
  find "$agent/knowledge base" -type l -exec sh -c 'echo "{}"; ls -la "{}" | grep -o "->.*"' \;
done
```

---

## Phase 3: ALWAYS-Load Audit

**Goal:** Identify files that can be safely demoted from ALWAYS to ON_COMMAND for agents exceeding the 130 KB ceiling.

### 3.1 Agents Within Ceiling (no action needed)

| Agent | ALWAYS (full) | Status |
|-------|:------------:|--------|
| Barter Deals | ~120 KB | OK |
| Product Owner | ~87 KB | OK |
| Prompt Improver | ~76 KB | OK |

### 3.2 Nigel de Lange (~195 KB, needs -65 KB)

**Current ALWAYS files (8 local + 1 Global):**

| File | KB | Can Demote? | Rationale |
|------|---:|:-----------:|-----------|
| System Prompt v0.201 | 38.38 | NO | Core routing — must be ALWAYS |
| Voice DNA v0.101 | 28.86 | NO | Identity — must be ALWAYS |
| Interactive Mode v0.201 | 24.44 | MAYBE | Only needed for multi-turn sessions |
| Quality Validators v0.101 | 21.24 | NO | Scoring rubric needed for every output |
| Content Standards v0.101 | 19.46 | YES | Templates and format rules — only needed during content creation |
| DEPTH Framework v0.201 | 17.32 | NO | Processing methodology — needed for every response |
| Platform Strategy v0.100 | 10.89 | YES | LinkedIn algorithm data — only needed for optimization tasks |
| Engagement v0.101 | 10.20 | YES | Comment/reply guidelines — only needed for engagement tasks |
| Human Voice (Global) | 24.64 | NO | Base voice rules — must be ALWAYS |

**Recommended demotions:**

| File | KB Saved | New Tier | Trigger |
|------|---------|----------|---------|
| Content Standards v0.101 | 19.46 | ON_CREATION | Load during content generation mode |
| Platform Strategy v0.100 | 10.89 | ON_COMMAND | Load on `$optimize`, `$algorithm`, `$timing` |
| Engagement v0.101 | 10.20 | ON_COMMAND | Load on `$engage`, `$comment`, `$reply` |
| Interactive Mode v0.201 | 24.44 | INTERACTIVE | Load on multi-turn session entry |

**Result:** 195 KB - 64.99 KB = **~130 KB** (at ceiling)

### 3.3 Pieter Bertram (~180 KB, needs -50 KB)

Same pattern as Nigel. **Recommended demotions:**

| File | KB Saved | New Tier | Trigger |
|------|---------|----------|---------|
| Content Standards v0.124 | 16.87 | ON_CREATION | Load during content generation mode |
| Platform Strategy v0.110 | 14.48 | ON_COMMAND | Load on `$optimize`, `$algorithm`, `$timing` |
| Engagement v0.110 | 7.26 | ON_COMMAND | Load on `$engage`, `$comment`, `$reply` |
| Interactive Mode v0.201 | 20.15 | INTERACTIVE | Load on multi-turn session entry |

**Result:** 180 KB - 58.76 KB = **~121 KB** (under ceiling)

### 3.4 TikTok (~190 KB, needs -60 KB)

**Current ALWAYS files (6 local + 3 Global):**

| File | KB | Can Demote? | Rationale |
|------|---:|:-----------:|-----------|
| System Prompt v0.200 | 43.17 | NO | Core routing |
| DEPTH Framework v0.200 | 21.33 | NO | Processing methodology |
| Interactive Mode v0.200 | 13.87 | MAYBE | Multi-turn only |
| Language v0.111 | 14.18 | MAYBE | TikTok terminology — could be ON_CREATION |
| Audience v0.110 | 11.58 | YES | Audience profiles — only needed during content creation |
| Frameworks v0.111 | 11.27 | YES | Framework templates — only needed during content creation |
| Human Voice (Global) | 24.64 | NO | Base voice rules |
| Brand (Global) | 23.71 | YES | Brand context — could be ON_COMMAND |
| Stats Registry (Global) | 26.70 | YES | Stats — only needed when citing data |

**Recommended demotions:**

| File | KB Saved | New Tier | Trigger |
|------|---------|----------|---------|
| Stats Registry (Global) | 26.70 | ON_COMMAND | Load when citing statistics |
| Brand (Global) | 23.71 | ON_COMMAND | Load on `$barter`, brand mentions |
| Audience v0.110 | 11.58 | ON_CREATION | Load during content generation |
| Frameworks v0.111 | 11.27 | ON_CREATION | Load during content generation |

**Result:** 190 KB - 73.26 KB = **~117 KB** (under ceiling)

### 3.5 Copywriter (~165 KB, needs -35 KB)

**Recommended demotions:**

| File | KB Saved | New Tier | Trigger |
|------|---------|----------|---------|
| Brand (Global) | 23.71 | ON_COMMAND | Load on brand-related copy tasks |
| Frameworks v0.112 | 15.63 | ON_CREATION | Load during content generation |

**Result:** 165 KB - 39.34 KB = **~126 KB** (under ceiling)

### Summary After Demotions

| Agent | Before | After | Delta | Status |
|-------|-------:|------:|------:|--------|
| Nigel de Lange | ~195 KB | ~130 KB | -65 KB | AT CEILING |
| TikTok | ~190 KB | ~117 KB | -73 KB | UNDER |
| Pieter Bertram | ~180 KB | ~121 KB | -59 KB | UNDER |
| Copywriter | ~165 KB | ~126 KB | -39 KB | UNDER |
| Barter Deals | ~120 KB | ~120 KB | 0 | UNDER |
| Product Owner | ~87 KB | ~87 KB | 0 | UNDER |
| Prompt Improver | ~76 KB | ~76 KB | 0 | UNDER |

---

## Phase 4: Loading Condition Synchronization

**Goal:** Make AGENTS.md and System Prompt agree on every file's loading tier.

**Authority chain:** AGENTS.md is canonical -> System Prompt mirrors

### 4.1 Per-Agent AGENTS.md Updates

For each agent, update the AGENTS.md DAG and "Always load" / "Load on command" lists to reflect the Phase 3 demotions:

**Nigel de Lange — AGENTS.md changes:**
- Move Content Standards from DAG ALWAYS to "Load on creation"
- Move Platform Strategy from DAG ALWAYS to "Load on command: `$optimize`, `$algorithm`"
- Move Engagement from DAG ALWAYS to "Load on command: `$engage`, `$comment`"
- Move Interactive Mode from DAG ALWAYS to "Load on interactive session entry"
- Add DEPTH Framework to DAG (currently missing but loaded ALWAYS)

**Pieter Bertram — AGENTS.md changes:**
- Same 4 demotions as Nigel (Content Standards, Platform Strategy, Engagement, Interactive Mode)
- Add DEPTH Framework to DAG

**TikTok — AGENTS.md changes:**
- Move Stats Registry from ALWAYS to "Load on command: when citing statistics"
- Move Brand (Global) from ALWAYS to "Load on command: `$barter`, brand mentions"
- Move Audience from ALWAYS to "Load on creation"
- Move Frameworks from ALWAYS to "Load on creation"
- Add new Industry symlink to "Load on command: `$industry`, creator economy topics"

**Copywriter — AGENTS.md changes:**
- Move Brand (Global) from DAG ALWAYS to "Load on command: brand copy tasks"
- Move Frameworks from DAG ALWAYS to "Load on creation"
- Add new Industry and Stats Registry symlinks to "Load on command"

### 4.2 System Prompt Mirror Updates

For each agent's System Prompt, update the loading tier reference table to match the new AGENTS.md:
- Nigel System Prompt v0.201: Update Section 3.2 loading table
- Pieter System Prompt v0.201: Update Section 3.2 loading table
- TikTok System Prompt v0.200: Update ALWAYS_LOAD and ON_COMMAND tables
- Copywriter System Prompt v0.901: Update Section S2 (Token Budget) and loading table

### 4.3 Resolve Remaining Mismatches

| Mismatch | Resolution |
|----------|-----------|
| HV Extensions tier (Nigel/Pieter) | Set to ALWAYS in both AGENTS.md and System Prompt |
| Interactive Mode tier (Nigel) | Set to INTERACTIVE in both sources (per Phase 3 demotion) |
| DEPTH Framework missing from DAGs | Add to ALWAYS in AGENTS.md DAGs for Nigel, Pieter, Prompt Improver |

---

## Phase 5: Extension Pattern Fill

**Goal:** Create stub Extensions files for agents that have Global symlinks but no corresponding Extensions file.

### New Files to Create

| Agent | File | Content |
|-------|------|---------|
| TikTok | `TikTok - Context - Industry Extensions - v0.100.md` | Stub with TikTok-specific industry overrides (creator economy focus, TikTok platform emphasis) |
| Copywriter | `Copywriter - Context - Industry Extensions - v0.100.md` | Stub with Copywriter-specific industry overrides (copy angle, messaging focus) |
| Copywriter | `Copywriter - Context - Canonical Stats Registry Extensions - v0.100.md` | Stub with Copywriter-specific stat formatting rules |
| Product Owner | `Owner - Context - Brand Extensions - v0.100.md` | Stub with PO-specific brand terminology (task language, technical context) |
| Nigel de Lange | `Nigel de Lange - Context - Market Extensions - v0.100.md` | Stub with Nigel-specific market angle (COO perspective, operations lens) |
| Pieter Bertram | `Pieter Bertram - Context - Market Extensions - v0.100.md` | Stub with Pieter-specific market angle (CEO perspective, founder lens) |

**Template for stub Extensions files:**
```markdown
# [Agent] - Context - [Topic] Extensions - v0.100

**Loading Condition:** ON_COMMAND — loaded alongside the base [Topic] context
**Purpose:** Agent-specific overrides and additions to the Global [Topic] base file

---

## Agent-Specific Context

[Placeholder — add overrides as needed during content creation]

---

*This file extends `0. Global (Shared)/context/Context - [Topic] - v0.110.md` with [Agent]-specific context.*
```

**Total new files: 6 stubs**

---

## Phase 6: Delete Token Budget Document

**Goal:** Remove the Token Budget doc and all references to it. Loading tiers are fully defined in AGENTS.md (canonical) and System Prompts (mirror) — the Token Budget doc is a redundant third source that was already inaccurate.

### 6.1 Delete the File

```bash
rm "0. Global (Shared)/system/System - Token Budget - v0.100.md"
```

### 6.2 Remove HTML Comment References from All AGENTS.md Files

Remove line 1 (`<!-- Token Budget Reference: 0. Global (Shared)/system/System - Token Budget - v0.100.md -->`) from:

1. `1. Copywriter/AGENTS.md`
2. `2. Barter deals/AGENTS.md`
3. `3. LinkedIn/Nigel de Lange/AGENTS.md`
4. `3. LinkedIn/Pieter Bertram/AGENTS.md`
5. `4. TikTok SEO & Creative Strategy/AGENTS.md`
6. `Product Owner/AGENTS.md`
7. `Prompt Improver/AGENTS.md`

### 6.3 Remove Token Budget References from System Prompts

- Copywriter System Prompt v0.901: Remove Section S2 "Token Budget" reference to the Global file (keep input/output guardrails if useful)

### 6.4 Update Parent spec.md

Remove Token Budget from the Shared Files table in `../spec.md`

---

## Phase 7: Validation & Index Update

### 7.1 Validation Checklist

Create `checklist.md` in this spec folder with a runnable verification procedure:

1. **Symlink integrity:** `find [agent]/knowledge\ base -type l` -> verify all resolve
2. **Token Budget deleted:** Confirm `0. Global (Shared)/system/System - Token Budget - v0.100.md` does not exist
3. **No stale references:** `grep -r "Token Budget" */AGENTS.md` returns no results
4. **Loading condition alignment:** For each agent, compare AGENTS.md DAG vs System Prompt table (must match)
5. **ALWAYS-load ceiling:** Sum ALWAYS files per agent -> verify <= 130 KB
6. **Extension completeness:** For each symlink, verify a corresponding Extensions file exists

### 7.2 Parent spec.md Update

Update `../spec.md` Sub-Folder Index to include:
```markdown
| `003-token-budget-alignment/` | Token Budget v0.110 rewrite, ALWAYS-load audit, symlink standardization, loading condition alignment across all 7 DEPTH agents. | In Progress |
```

---

## Implementation Order

```
Phase 1: Symlink Needs Assessment          [DECISION — no file changes]
    |
Phase 2: Create 4 Missing Symlinks         [4 new symlinks]
    |
    +---> Phase 5: Create 6 Extension Stubs [6 new files, parallel with Phase 3]
    |
Phase 3: ALWAYS-Load Audit                 [ANALYSIS — identifies demotions]
    |
Phase 4: Loading Condition Sync            [~8 file edits: AGENTS.md + System Prompts]
    |
Phase 6: Delete Token Budget               [1 delete + 7 AGENTS.md edits + 1 System Prompt edit]
    |
Phase 7: Validation & Index                [2 files: checklist.md + parent spec.md]
```

**Phases 2 and 5 can run in parallel.** All other phases are sequential.

---

## Risk Mitigations

| Risk | Mitigation |
|------|-----------|
| Demotion breaks agent output quality | Demote one agent at a time; test with a sample prompt before and after |
| Symlink path error | Use `ls -la` to verify each symlink immediately after creation |
| Missed loading condition in System Prompt | Use `grep -n "ALWAYS\|ON_COMMAND\|ON_CREATION\|INTERACTIVE"` to find all tier references |
| Stale references to deleted Token Budget | Grep for "Token Budget" across all files after deletion |

---

## Success Criteria

- [ ] Token Budget v0.100 deleted and all references removed
- [ ] All 7 agents have correct symlink coverage (per Phase 1 decision matrix)
- [ ] All 4 agents under or at 130 KB ALWAYS-load ceiling
- [ ] Zero loading condition mismatches between AGENTS.md and System Prompt
- [ ] All Extensions files exist for all Global symlinks
- [ ] Validation checklist passes cleanly
- [ ] Parent spec.md index updated
