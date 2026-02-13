# Barter Deal Templates — Decision Record

| Field | Value |
|-------|-------|
| **Version** | 1.2.0 |
| **Last Updated** | 2026-02-06 |
| **Total Decisions** | 18 (17 approved, 1 pending) |

---

## Decision Summary

| DR | Title | Status | Date |
|----|-------|--------|------|
| DR-001 | Inherit from Copywriter Architecture | Approved | 2026-02-06 |
| DR-002 | DEAL Scoring System (not MEQT) | Approved | 2026-02-06 |
| DR-003 | Two Deal Types (Product and Service) | Approved | 2026-02-06 |
| DR-004 | Knowledge Base File Count (10 files) | Approved | 2026-02-06 |
| DR-005 | Tiered Loading Strategy | Approved | 2026-02-06 |
| DR-006 | Shared HVR v0.100 (Copy, Not Symlink) | Approved | 2026-02-06 |
| DR-007 | BLOCKING Export Protocol | Approved | 2026-02-06 |
| DR-008 | "Creators" Terminology (Never "Influencers") | Approved | 2026-02-06 |
| DR-009 | Variation Scaling — Description Section Only | Approved | 2026-02-06 |
| DR-010 | DEPTH Adaptive Rounds (7/10/5/1-3) | Approved | 2026-02-06 |
| DR-011 | Context Window Budget — Tiered Loading | Approved | 2026-02-06 |
| DR-012 | Anti-AI Detection Strategy — HVR from Day One | Approved | 2026-02-06 |
| DR-013 | Minimum Viable System (MVS) — 4 Core Files | Approved | 2026-02-06 |
| DR-014 | Multi-Language Support (Future) | Pending | — |
| DR-015 | Interactive Mode — Deal-Specific Question Templates | Approved | 2026-02-06 |
| DR-016 | Command Shortcuts ($product, $service, $quick) | Approved | 2026-02-06 |
| DR-017 | Output Artifact Format — System Header + Processing Summary | Approved | 2026-02-06 |
| DR-018 | DEPTH Adaptation — RICCE Exclusion and Component Mapping | Approved | 2026-02-06 |

---

## DR-001: Inherit from Copywriter Architecture

| Field | Value |
|-------|-------|
| **Status** | Approved |
| **Date** | 2026-02-06 |
| **Context** | The Deal Templates system needs a content generation engine. Building from scratch vs inheriting from the existing Copywriter. |

### Options Considered

| Option | Pros | Cons |
|--------|------|------|
| A. Build from scratch | Clean slate, deal-optimized | Duplicates proven work, slower |
| B. Fork Copywriter | Full control, independent | Maintenance burden, drift risk |
| **C. Inherit and extend** | **Reuses proven patterns, shared HVR/Brand** | **Some Copywriter-specific logic to strip** |

### Decision

**Option C: Inherit and extend.** Reuse Copywriter architecture (AGENTS.md pattern, knowledge base structure, export protocol, DEPTH methodology) and adapt for deal-specific use cases.

### Rationale

The Copywriter has been refined to v0.821 with proven HVR compliance, DEPTH methodology, and export protocols. Inheriting this foundation saves significant development time and ensures voice consistency across the Barter ecosystem.

### Technical Debt

Must audit Copywriter patterns periodically to ensure Deal Templates stays aligned when Copywriter is updated.

---

## DR-002: DEAL Scoring System (not MEQT)

| Field | Value |
|-------|-------|
| **Status** | Approved |
| **Date** | 2026-02-06 |
| **Context** | The Copywriter uses MEQT (25-point) for general copy quality. Deal templates have different quality dimensions that need a specialized rubric. |

### Options Considered

| Option | Pros | Cons |
|--------|------|------|
| A. Use MEQT as-is | Consistent with Copywriter | Poor fit for deal evaluation |
| **B. Create DEAL rubric** | **Deal-specific dimensions, clear acronym** | **New system to maintain** |
| C. Extend MEQT | Builds on existing | Confusing, different weights needed |

### Decision

**Option B: Create DEAL rubric.** Description (6), Expectations (7), Appeal (6), Legitimacy (6) = 25 points, 19+ threshold.

### Rationale

Deal templates have fundamentally different quality dimensions than general copywriting. Description clarity, creator expectations, deal appeal, and legitimacy/trust are the four pillars that determine whether a deal will attract quality creators. The DEAL acronym is memorable and maps directly to these dimensions.

---

## DR-003: Two Deal Types (Product and Service)

| Field | Value |
|-------|-------|
| **Status** | Approved |
| **Date** | 2026-02-06 |
| **Context** | The Barter marketplace supports various exchange types. How many template types should the system support? |

### Decision

**Two types: Product-based and Service-based.** These cover 95%+ of Barter deals. Future types (event, subscription, hybrid) can be added as needed.

### Rationale

The existing template examples in `barter_deal_templates.md` demonstrate these two types (Rituals Box for product, Spaghetteria for service). Starting with two keeps the system focused while covering the vast majority of use cases.

---

## DR-004: Knowledge Base File Count (10 Files)

| Field | Value |
|-------|-------|
| **Status** | Approved |
| **Date** | 2026-02-06 |
| **Context** | How many knowledge base files should the system use? |

### Decision

**10 files** with tiered loading (3 always, 7 on-demand/trigger).

### Rationale

Mirrors the Copywriter architecture (8 files) with 2 additional deal-specific files (Deal Type Product, Deal Type Service). Keeps each file focused and loadable without exceeding context window budgets.

---

## DR-005: Tiered Loading Strategy

| Field | Value |
|-------|-------|
| **Status** | Approved |
| **Date** | 2026-02-06 |
| **Context** | Loading all 10 files every session wastes context window space. |

### Decision

**Three tiers: Always (3 files), On-demand (5 files), Trigger (2 files).**

| Tier | Files | Load Condition |
|------|-------|---------------|
| Always | System Prompt, Brand Context, HVR | Every session |
| On-demand | Deal types, DEPTH, Standards, Interactive | When task requires |
| Trigger | Market Data, Industry Modules | On specific keywords |

### Rationale

Keeps always-loaded content under ~1,550 lines (well within budget). On-demand loading allows the system to scale context based on task complexity.

---

## DR-006: Shared HVR v0.100 (Copy, Not Symlink)

| Field | Value |
|-------|-------|
| **Status** | Approved |
| **Date** | 2026-02-06 |
| **Context** | HVR v0.100 is shared across all Barter systems. Should Deal Templates use a symlink or a copy? |

### Decision

**Copy the file** into Deal Templates knowledge base.

### Rationale

Symlinks create path dependency issues across different environments and AI tool contexts. A copy ensures the file is always accessible regardless of how the project is loaded. When HVR is updated, all copies should be updated simultaneously.

---

## DR-007: BLOCKING Export Protocol

| Field | Value |
|-------|-------|
| **Status** | Approved |
| **Date** | 2026-02-06 |
| **Context** | Should deal templates be displayed in chat or exported to files? |

### Decision

**BLOCKING export to `/export/`** before any chat response. Inherited from Copywriter.

### Rationale

Consistent with the Copywriter pattern. File-based export ensures deals can be reviewed, compared, and reused. Prevents chat-based display of full templates which clutters conversation.

### Technical Debt

Export path validation needed. System should verify `/export/` exists and is writable before attempting save.

---

## DR-008: "Creators" Terminology (Never "Influencers")

| Field | Value |
|-------|-------|
| **Status** | Approved |
| **Date** | 2026-02-06 |
| **Context** | Barter brand voice uses "creators" exclusively. |

### Decision

**Always use "creators" or "content creators". Never use "influencers".**

### Rationale

Core brand identity decision inherited from Barter Brand Context v0.111. "Creators" emphasizes the content creation partnership model. "Influencers" implies a transactional, follower-count-driven approach that contradicts Barter's values.

---

## DR-009: Variation Scaling — Description Section Only

| Field | Value |
|-------|-------|
| **Status** | Approved |
| **Date** | 2026-02-06 |
| **Context** | The Copywriter applies 9/6/3 variation scaling to entire outputs. Should deals follow the same pattern? |

### Options Considered

| Option | Pros | Cons |
|--------|------|------|
| A. Full template variation | Consistent with Copywriter | Wasteful — title and requirements don't need variation |
| **B. Description section only** | **Focused, efficient, practical** | **Slight inconsistency with Copywriter** |
| C. No variations | Simplest | Loses creative options |

### Decision

**Option B with Structural Adaptation.** The 9/6/3 variation scaling applies to the description section only. Fixed sections (title, creator requirements, optional add-ons, pricing) remain constant.

### Rationale

Deal templates have fixed structural elements that don't benefit from variation. The description is the creative element where tone and approach variation adds value. Generating 9 variations of identical creator requirements would be wasteful.

---

## DR-010: DEPTH Adaptive Rounds (7/10/5/1-3)

| Field | Value |
|-------|-------|
| **Status** | Approved |
| **Date** | 2026-02-06 |
| **Context** | The Copywriter uses fixed 10-round DEPTH. Deal templates vary in complexity — some are routine, others complex. |

### Options Considered

| Option | Pros | Cons |
|--------|------|------|
| A. Fixed 10 rounds | Consistent with Copywriter | Overkill for simple deals |
| B. Fixed 5 rounds | Fast | Insufficient for complex deals |
| **C. Adaptive with defaults** | **Right-sized per deal** | **More routing logic needed** |

### Decision

**Option C with Default Override.** Adaptive rounds based on deal complexity:

| Complexity | Rounds | Trigger |
|-----------|--------|---------|
| Standard | 7 | Default for most deals |
| Complex | 10 | Multi-product, custom terms, unusual structure |
| Simple | 5 | Standard product, known brand, clear terms |
| Quick ($quick) | 1-3 | Explicit quick mode request |

### Rationale

Deals are generally less complex than open-ended copywriting tasks (the Copywriter's 10-round default). A 7-round default with the ability to scale up (complex) or down (simple/quick) provides optimal balance between quality and efficiency.

---

## DR-011: Context Window Budget — Tiered Loading

| Field | Value |
|-------|-------|
| **Status** | Approved |
| **Date** | 2026-02-06 |
| **Context** | Context window space is finite. The system needs a budget to prevent overflow. |

### Decision

**Always-loaded content: ~1,550 lines. Total session budget: ~2,000-2,500 lines.**

| Component | Lines | Strategy |
|-----------|-------|----------|
| AGENTS.md | ~180 | Always |
| System Prompt | ~400 | Always |
| Brand Context | ~200 | Always |
| HVR v0.100 | ~440 | Always |
| System overhead | ~330 | Always |
| **Always total** | **~1,550** | |
| On-demand (per session) | ~400-1,000 | As needed |

### Rationale

Modern context windows (100K-200K tokens) can easily handle 2,500 lines, but keeping the always-loaded footprint small leaves room for conversation history and on-demand modules.

---

## DR-012: Anti-AI Detection Strategy — HVR from Day One

| Field | Value |
|-------|-------|
| **Status** | Approved |
| **Date** | 2026-02-06 |
| **Context** | AI-generated deal descriptions risk being detected, undermining marketplace trust. |

### Decision

**Integrate HVR v0.100 from day one as an always-loaded dependency.** No deal template ships without HVR validation.

### Rationale

Anti-AI detection is not a nice-to-have — it's core to marketplace trust. The Barter platform depends on authentic-sounding content. HVR v0.100 provides proven rules (punctuation, structural patterns, vocabulary blacklist) that are already battle-tested in the Copywriter system. Retrofitting HVR later would risk shipping AI-detectable content in the interim.

### Integration Points

1. DEAL scoring: Legitimacy component includes 2 points for HVR compliance
2. DEPTH Test phase: HVR scan as blocking quality gate
3. Export protocol: HVR violation = export blocked
4. Hard blocker detection: Automatic rejection regardless of DEAL score

---

## DR-013: Minimum Viable System (MVS) — 4 Core Files

| Field | Value |
|-------|-------|
| **Status** | Approved |
| **Date** | 2026-02-06 |
| **Context** | Building all 10 knowledge base files before first use delays value delivery. What is the minimum system that can generate acceptable deals? |

### Decision

**4 core files constitute the MVS:**

1. **AGENTS.md** — Entry point with role override and export protocol
2. **DT - System Prompt** — Core routing, DEAL scoring, template logic
3. **DT - Brand Context** — Voice identity and positioning
4. **DT - HVR v0.100** — Human Voice Rules

### Rationale

These 4 files provide everything needed to generate a deal template: role definition (AGENTS.md), generation logic (System Prompt), voice consistency (Brand Context), and anti-AI compliance (HVR). The remaining 6 files add depth (industry modules, market data, interactive mode) but are not required for basic operation. This enables Phase 2 to deliver a functional system that can be used while Phase 3 adds context modules.

---

## DR-014: Multi-Language Support (Future)

| Field | Value |
|-------|-------|
| **Status** | Pending |
| **Date** | — |
| **Context** | Barter operates in the Netherlands. Future expansion may require Dutch/English deal templates. |

### Notes

- Not in scope for initial creation
- Architecture should not preclude future language support
- HVR rules are currently English-only
- Decision deferred until business need is confirmed

---

## DR-015: Interactive Mode — Deal-Specific Question Templates

| Field | Value |
|-------|-------|
| **Status** | Approved |
| **Date** | 2026-02-06 |
| **Context** | Every Barter AI system (Copywriter v0.412, LinkedIn Pieter v0.120, LinkedIn Nigel v0.100, TikTok v0.110) includes an Interactive Mode with structured question templates. The Deal Templates spec was missing this pattern entirely. |

### Options Considered

| Option | Pros | Cons |
|--------|------|------|
| A. No Interactive Mode | Simpler system | Inconsistent with ecosystem, poor input quality |
| **B. Deal-specific question templates** | **Consistent with all sibling systems, ensures complete input** | **Additional complexity** |
| C. Reuse Copywriter Interactive Mode as-is | No new work | Poor fit — Copywriter asks about messaging goals, not deal parameters |

### Decision

**Option B: Create deal-specific Interactive Mode with 3 question templates** — Deal Brief (default, 9 questions), Quick Deal (4 questions), Improve Existing (3 questions). Activates when user request lacks sufficient information.

### Rationale

Cross-system analysis showed every Barter AI system gathers structured requirements before generating content. The Copywriter has 5 response templates per mode, LinkedIn has Energy Level selection, TikTok has format-specific flows. Deal Templates needs deal-specific gathering: brand name, deal type, value, creator requirements. Without this, the system guesses at missing fields, producing lower DEAL scores.

---

## DR-016: Command Shortcuts ($product, $service, $quick)

| Field | Value |
|-------|-------|
| **Status** | Approved |
| **Date** | 2026-02-06 |
| **Context** | All Barter AI systems use `$mode` command shortcuts for quick access to common workflows. Copywriter: `$write`, `$blog`, `$marketing`. LinkedIn: `$personal`, `$leadership`, `$barter`. TikTok: `$blog`, `$trend`, `$seo`. Deal Templates had no command shortcuts defined. |

### Options Considered

| Option | Pros | Cons |
|--------|------|------|
| A. No shortcuts | Simpler | Inconsistent, slower workflow |
| **B. Deal-specific shortcuts** | **Consistent, fast, clear intent** | **Additional routing logic** |
| C. Reuse Copywriter shortcuts | No new work | Wrong semantics ($write doesn't mean "create a deal") |

### Decision

**Option B: 6 deal-specific command shortcuts** — `$product`, `$service`, `$quick`, `$improve`, `$score`, `$hvr`. Each maps to a specific DEPTH round count and loading strategy.

### Rationale

Command shortcuts are a proven UX pattern across the Barter ecosystem. They enable immediate intent detection (eliminating routing ambiguity), control DEPTH round scaling, and trigger appropriate on-demand file loading. The 6 commands cover all deal creation workflows.

---

## DR-017: Output Artifact Format — System Header + Processing Summary

| Field | Value |
|-------|-------|
| **Status** | Approved |
| **Date** | 2026-02-06 |
| **Context** | The Copywriter uses a standardized output artifact format with a system header (`Mode: $[mode] | Framework: [Name] | Template: v1.0`) and Processing Summary. LinkedIn and TikTok use similar patterns. Deal Templates had no output format defined. |

### Options Considered

| Option | Pros | Cons |
|--------|------|------|
| A. No standardized format | Simpler | Inconsistent, no metadata tracking |
| **B. Adapt Copywriter format** | **Consistent ecosystem pattern, useful metadata** | **Slight overhead** |
| C. Custom format | Deal-optimized | Breaks ecosystem consistency |

### Decision

**Option B: Adapt Copywriter output format** with deal-specific metadata. System header includes Mode, DEAL score, and template version. Processing Summary shows file path, score breakdown, HVR status, and variation count.

### Rationale

The system header serves as provenance metadata — it tracks which mode generated the output, the quality score, and template version. The Processing Summary replaces displaying the full template in chat (per BLOCKING export protocol), giving users the essential quality metrics without cluttering the conversation.

---

## DR-018: DEPTH Adaptation — RICCE Exclusion and Component Mapping

| Field | Value |
|-------|-------|
| **Status** | Approved |
| **Date** | 2026-02-06 |
| **Context** | The Copywriter DEPTH v0.112 integrates RICCE (Role-Instructions-Context-Constraints-Examples) as a mandatory structural validation framework, includes MEQT scoring, and uses a detailed YAML state model. When adapting DEPTH for Deal Templates, each component needs an explicit adopt/adapt/exclude decision. |

### Decision

**Selective adaptation with explicit component mapping:**

| Component | Decision | Replacement |
|-----------|----------|------------|
| RICCE framework | Exclude | DEAL scoring covers structural completeness for deals |
| MEQT scoring | Replace | DEAL 25-point rubric (DR-002) |
| YAML state management | Simplify | Track: deal_type, brand, value, depth_round, deal_score |
| Two-layer transparency | Adopt | Identical to Copywriter |
| Framework selection (10) | Exclude | Deals use fixed template structure |
| Cognitive rigor (5 techniques) | Adopt | All 5 apply with deal-specific framing |
| 10-round distribution | Adapt | 7/10/5/1-3 adaptive (DR-010) |

### Rationale

RICCE validates structural completeness for open-ended copywriting tasks where output structure is unpredictable. Deal templates have a fixed, known structure (title, description, requirements, add-ons), making RICCE redundant — the DEAL scoring system validates completeness more directly. The 10 copywriting frameworks (SVC, PSA, AIDA, etc.) similarly don't apply because deals follow a fixed template rather than choosing between messaging strategies. All other DEPTH components transfer directly or with minor adaptation.
