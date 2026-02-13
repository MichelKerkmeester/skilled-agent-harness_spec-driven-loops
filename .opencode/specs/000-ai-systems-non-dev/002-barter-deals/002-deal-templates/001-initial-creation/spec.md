# Barter Deal Templates — Specification

| Field | Value |
|-------|-------|
| **Version** | 1.1.0 |
| **Status** | Approved |
| **Owner** | Michel Kerkmeester |
| **Created** | 2026-02-06 |
| **Last Updated** | 2026-02-06 |
| **Revision Note** | v1.1.0 — Added Interactive Mode, Command Shortcuts, Output Artifact Format, Smart Routing Logic. Expanded DEAL scoring with granular questions. Cross-system alignment with Copywriter, LinkedIn and TikTok patterns. |
| **Documentation Level** | Level 3+ (19 items) |

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Problem Statement](#2-problem-statement)
3. [Goals and Objectives](#3-goals-and-objectives)
4. [Scope](#4-scope)
5. [System Architecture](#5-system-architecture)
6. [Knowledge Base Structure](#6-knowledge-base-structure)
7. [Non-Functional Requirements](#7-non-functional-requirements)
8. [Error Handling](#8-error-handling)
9. [DEAL Scoring System](#9-deal-scoring-system)
10. [DEPTH Integration](#10-depth-integration)
11. [Variation Scaling](#11-variation-scaling)
12. [Export Protocol](#12-export-protocol)
13. [Cross-System Dependencies](#13-cross-system-dependencies)
14. [Success Criteria](#14-success-criteria)
15. [Interactive Mode](#15-interactive-mode)
16. [Command Shortcuts](#16-command-shortcuts)
17. [Output Artifact Format](#17-output-artifact-format)
18. [Smart Routing Logic](#18-smart-routing-logic)
19. [Documentation Level](#19-documentation-level)

---

## 1. Executive Summary

The Barter Deal Templates system is a specialized AI content agent that generates high-quality barter deal descriptions for the Barter creator-brand marketplace. It inherits core infrastructure from the Barter Copywriter (v0.821) while adding deal-specific knowledge, a DEAL scoring rubric, and structured template generation. The system produces product-based and service-based deal templates that comply with Human Voice Rules (HVR v0.100) and follow the DEPTH cognitive methodology with adaptive round scaling.

---

## 2. Problem Statement

Creating compelling barter deal descriptions is currently a manual, inconsistent process. Deals vary widely in quality, often lacking key information (value proposition, creator requirements, brand context) or containing AI-detectable patterns that undermine authenticity. There is no standardized scoring system to evaluate deal template quality before publication, and no structured methodology to ensure deals are optimized for creator engagement.

### Impact

- Inconsistent deal quality reduces creator application rates
- Missing information (pricing, requirements, brand context) causes confusion
- AI-detectable language undermines trust in the marketplace
- No quality gate means low-quality deals reach creators unchecked

---

## 3. Goals and Objectives

### Primary Goals

| ID | Goal | Metric |
|----|------|--------|
| G-001 | Standardize deal template creation | 100% of deals follow structured templates |
| G-002 | Ensure human-sounding output | 0 HVR hard blocker violations per deal |
| G-003 | Enforce quality gates | All published deals score DEAL 19+/25 |
| G-004 | Support both deal types | Product-based and service-based templates |

### Secondary Goals

| ID | Goal | Metric |
|----|------|--------|
| G-005 | Reduce deal creation time | < 2 minutes per deal with AI assistance |
| G-006 | Cross-system voice consistency | Voice matches Copywriter and LinkedIn systems |
| G-007 | Context window efficiency | Always-loaded content under 2,000 lines |

---

## 4. Scope

### In Scope

- Deal template generation (product-based and service-based)
- DEAL scoring system (25-point rubric)
- DEPTH methodology integration with adaptive rounds
- HVR v0.100 compliance enforcement
- Export protocol to `/export/` directory
- Knowledge base architecture (10 files)
- Brand context integration from Copywriter system
- Variation scaling for deal descriptions (9/6/3)

### Out of Scope

- Deal pricing optimization or recommendations
- Creator matching algorithms
- Campaign analytics or reporting
- Payment processing
- Direct integration with Barter platform API
- Multi-language support (Dutch/English only in future phases)

---

## 5. System Architecture

### Component Overview

```
┌─────────────────────────────────────────────┐
│             AGENTS.md (Entry Point)          │
│  Role definition, export protocol, reading   │
│  instructions, processing hierarchy          │
├─────────────────────────────────────────────┤
│           System Prompt (Core Logic)         │
│  Smart routing, DEAL scoring, DEPTH config,  │
│  template selection, variation scaling       │
├─────────────────────────────────────────────┤
│           Knowledge Base (10 files)          │
│  ┌──────────────┐  ┌──────────────────────┐ │
│  │ Always Load  │  │    On-Demand Load    │ │
│  │ - System     │  │ - Deal Type Context  │ │
│  │   Prompt     │  │ - Industry Modules   │ │
│  │ - Brand Ctx  │  │ - Market Data        │ │
│  │ - HVR v0.100 │  │ - Framework Select   │ │
│  └──────────────┘  └──────────────────────┘ │
├─────────────────────────────────────────────┤
│              /export/ Output                  │
│  [###] - deal-[type]-[brand].md              │
└─────────────────────────────────────────────┘
```

### MVS (Minimum Viable System) — DR-013

The system can operate with 4 core files for basic functionality:

1. **AGENTS.md** — Entry point with role override and export protocol
2. **System Prompt** — Core routing logic and DEAL scoring
3. **Brand Context** — Barter voice identity and positioning
4. **HVR v0.100** — Human Voice Rules (shared across all Barter systems)

Additional knowledge base files add depth but are not required for MVP operation.

---

## 6. Knowledge Base Structure

### File Inventory

| # | File | Load Strategy | Purpose | Est. Lines |
|---|------|--------------|---------|-----------|
| 1 | System Prompt | Always | Core routing, DEAL scoring, DEPTH config | ~400 |
| 2 | Brand Context | Always | Voice identity, Barter positioning | ~200 |
| 3 | HVR v0.100 | Always | Human Voice Rules (shared) | ~440 |
| 4 | Deal Type Context — Product | On-demand | Product deal templates, examples | ~200 |
| 5 | Deal Type Context — Service | On-demand | Service deal templates, examples | ~200 |
| 6 | Industry Modules | On-demand | Industry-specific terminology, examples | ~300 |
| 7 | DEPTH Framework (Deal) | On-demand | Adapted DEPTH for deal creation | ~200 |
| 8 | Market Data | Trigger | Pricing benchmarks, competitor data | ~150 |
| 9 | Standards & Formatting | On-demand | Output formatting, artifact standards | ~150 |
| 10 | Interactive Mode | On-demand | Clarification flows for ambiguous requests | ~150 |

### Context Window Budget — DR-011

| Category | Est. Lines | Load Strategy |
|----------|-----------|---------------|
| Always-loaded (files 1-3) | ~1,040 | Every session |
| AGENTS.md | ~180 | Every session |
| System overhead | ~330 | Every session |
| **Always-loaded subtotal** | **~1,550** | |
| Per-session on-demand (2 files avg) | ~350-400 | As needed |
| **Total typical session** | **~1,900-1,950** | Mixed |

---

## 7. Non-Functional Requirements

| ID | Requirement | Target | Rationale |
|----|------------|--------|-----------|
| NFR-001 | Deal creation time | < 2 minutes per deal | User productivity |
| NFR-002 | Context window usage | < 2,000 always-loaded lines | Model efficiency |
| NFR-003 | Export format | Markdown (.md) to /export/ | Consistency with Copywriter |
| NFR-004 | Voice compliance | 0 HVR hard blocker violations | Anti-AI detection |
| NFR-005 | Concurrent sessions | Independent state per session | Multi-user support |

---

## 8. Error Handling

| ID | Error Condition | Detection | Recovery Action |
|----|----------------|-----------|-----------------|
| EH-001 | DEAL score below 19/25 | Post-generation scoring | Auto-improvement cycle (max 3 iterations) |
| EH-002 | Missing required fields | Pre-generation validation | Prompt user for missing information |
| EH-003 | Export path inaccessible | File system check | Warn user, display content inline as fallback |
| EH-004 | Unknown deal type | Input classification | Default to product-based, ask for confirmation |
| EH-005 | Unknown industry | Industry module lookup | Use general template, flag for user review |

---

## 9. DEAL Scoring System

### 25-Point Quality Rubric

| Component | Points | Key Questions | Minimum |
|-----------|--------|---------------|---------|
| **D**escription | 6 | Is the product/service clear? Is value stated? Is the brand introduced? | 4 |
| **E**xpectations | 7 | Are creator requirements specific? Is content format defined? Are deliverables clear? | 5 |
| **A**ppeal | 6 | Would creators want this? Is the value compelling? Is the tone engaging? | 4 |
| **L**egitimacy | 6 | Is pricing transparent? Are terms clear? Does it sound human (HVR)? | 4 |
| **TOTAL** | **25** | Combined assessment | **19** |

### Granular Scoring Breakdown

**D — Description (6 points)**

| Pts | Criterion | Evaluation Question |
|-----|-----------|-------------------|
| 1 | Brand identity | Is the brand clearly introduced with 1-2 sentences of context? |
| 1 | Product/service clarity | Can a creator immediately understand what they will receive? |
| 1 | Explicit value | Is the EUR value stated in both title and description? |
| 1 | Use case framing | Is it clear what type of content this deal supports? |
| 1 | Specificity | Are exact items, quantities or experience details listed? |
| 1 | Audience fit | Is the ideal creator niche identified? |

**E — Expectations (7 points)**

| Pts | Criterion | Evaluation Question |
|-----|-----------|-------------------|
| 1 | Platform specified | Is at least one platform (Instagram Reel, TikTok) named? |
| 1 | Format defined | Is the content format clear (video, reel, story, photo)? |
| 1 | Minimum duration | Is a minimum length specified (e.g. "minimum 30 seconds")? |
| 1 | Content guidance | Does it describe what to show (try-on, unboxing, experience)? |
| 1 | Brand tagging | Are specific handle(s) to tag provided? |
| 1 | Deliverable clarity | Is the delivery method defined (Spark Ad code, WeTransfer, etc.)? |
| 1 | Style direction | Is "authentic and in your own style" or equivalent guidance included? |

**A — Appeal (6 points)**

| Pts | Criterion | Evaluation Question |
|-----|-----------|-------------------|
| 1 | Creator benefit | Is what the creator gets clearly framed as a benefit? |
| 1 | Content potential | Is it obvious what kind of engaging content can be made? |
| 1 | Tone match | Does the tone match the deal type (informative for product, experiential for service)? |
| 1 | Niche targeting | Does it speak to a specific creator niche (food, fashion, lifestyle)? |
| 1 | Shareability | Does the deal naturally produce shareable, engaging moments? |
| 1 | Excitement factor | Would a creator feel genuinely excited to participate? |

**L — Legitimacy (6 points)**

| Pts | Criterion | Evaluation Question |
|-----|-----------|-------------------|
| 1 | Pricing transparency | Are all EUR values clearly stated with no hidden costs? |
| 1 | Terms clarity | Are usage rights, compensation, and restrictions clear? |
| 1 | HVR word compliance | Are zero hard blocker words present? |
| 1 | HVR structural compliance | Are zero structural violations present (em dashes, semicolons, 3-item lists)? |
| 1 | Professional tone | Does it read as a trustworthy business proposition? |
| 1 | Completeness | Are all required template sections present and filled? |

### Score-Based Actions

| Score Range | Action |
|-------------|--------|
| 23-25 | Ship immediately |
| 20-22 | Minor tweaks only |
| 17-19 | Strengthen weak areas |
| 14-16 | Major revision needed |
| < 14 | Complete restart |

### HVR Integration

- **Legitimacy** includes 2 points for Human Voice compliance
- Hard blocker violation = automatic DEAL score rejection regardless of total
- Soft deduction words reduce Legitimacy score (-1 per occurrence, max -2)

---

## 10. DEPTH Integration

### Adaptive Round Scaling — DR-010

| Complexity | Rounds | When |
|-----------|--------|------|
| Standard deal | 7 | Most deals |
| Complex deal (multi-product, custom terms) | 10 | Edge cases |
| Simple deal (single product, standard terms) | 5 | Routine deals |
| Quick mode ($quick) | 1-3 | Fast drafts |

### Phase Distribution (7-Round Standard)

| Phase | Rounds | Focus |
|-------|--------|-------|
| **D**iscover | 1-2 | Brand analysis, deal type classification, audience targeting |
| **E**ngineer | 3-4 | Template selection, variation planning, framework fit |
| **P**rototype | 5 | Deal draft generation with variation scaling |
| **T**est | 6 | DEAL scoring, HVR validation, format compliance |
| **H**armonize | 7 | Final polish, export preparation |

### Cognitive Rigor (Inherited from Copywriter)

- Multi-perspective analysis: minimum 3 perspectives (creator, brand, marketplace), target 5
- Assumption audit: flag critical dependencies with `[Assumes: X]`
- Mechanism first: WHY this deal works before WHAT it contains
- Perspective inversion: consider why a creator might skip this deal
- Constraint reversal: what would make this deal fail?

### DEPTH Adaptation from Copywriter v0.112

The Copywriter DEPTH v0.112 (1,544 lines) contains components that require explicit adaptation decisions for Deal Templates:

| Copywriter Component | Deal Templates Adaptation | Rationale |
|---------------------|--------------------------|-----------|
| RICCE framework (Role-Instructions-Context-Constraints-Examples) | **Excluded** — replaced by DEAL scoring | RICCE validates structural completeness for general copy. DEAL scoring serves this purpose for deals with deal-specific dimensions. |
| MEQT scoring references | **Replaced** with DEAL scoring throughout | All MEQT thresholds, checks and references in DEPTH phases must reference DEAL 19+ instead. |
| State management YAML | **Simplified** — deal state tracks: deal_type, brand, value, depth_round, deal_score | Full Copywriter YAML state is over-engineered for structured deal templates. |
| Two-layer transparency | **Adopted** — internal DEPTH rigor runs silently, user sees concise updates only | Identical pattern to Copywriter. See Section 15 (Interactive Mode). |
| Framework selection (10 frameworks: SVC, PSA, AIDA...) | **Excluded** — deals use fixed template structure | Copywriting frameworks apply to open-ended messaging. Deals have a fixed structure (title, description, requirements, add-ons). |
| 10-round phase distribution | **Adapted** to 7/10/5/1-3 adaptive (DR-010) | See phase distribution table above. |
| Cognitive rigor techniques (5) | **Adopted** with deal-specific framing | All 5 techniques apply. "Mechanism first" becomes "why this deal attracts creators." |

---

## 11. Variation Scaling — DR-009

### Description Section Only

The 9/6/3 variation scaling applies to the **description section only**, not the full template. Fixed sections (title, creator requirements, optional add-ons) remain constant across variations.

| Description Word Count | Variations | Distribution |
|-----------------------|------------|-------------|
| 1-30 words | 9 | 3 concise, 3 valuable, 3 authentic |
| 31-150 words | 6 | 2 concise, 2 valuable, 2 authentic |
| 151+ words | 3 | 1 concise, 1 valuable, 1 authentic |

### Fixed vs Variable Sections

| Section | Type | Notes |
|---------|------|-------|
| Title | Fixed | "[Product/Service] (value)" format |
| Deal Description | **Variable** | Variation scaling applies here |
| Creator Requirements | Fixed | Standardized per deal type |
| Optional Add-ons | Fixed | Spark Ads, usage rights, compensation |
| Value/Pricing | Fixed | Exact amounts, EUR only |

---

## 12. Export Protocol

### BLOCKING Requirement (Inherited from Copywriter)

All deal templates MUST be saved to `/export/` BEFORE any response in chat.

### File Naming Convention

```
/export/[###] - deal-[type]-[brand].md
```

**Examples:**
- `/export/001 - deal-product-rituals.md`
- `/export/002 - deal-service-spaghetteria.md`
- `/export/003 - deal-product-hema.md`

### Export Sequence (Strict Order)

1. Generate deal template internally
2. Run DEAL scoring (19+ required)
3. Run HVR validation (0 hard blockers)
4. Save to `/export/[###] - deal-[type]-[brand].md` (BLOCKING)
5. Verify file saved successfully
6. Respond with file path + brief summary (NOT full content)

---

## 13. Cross-System Dependencies

### Inherited from Barter Copywriter (v0.821)

| Component | Source | Adaptation |
|-----------|--------|-----------|
| HVR v0.100 | Shared across all Barter systems | No changes |
| Brand Context | Copywriter knowledge base | Deal-specific voice additions |
| DEPTH Framework | Copywriter DEPTH v0.112 | Adaptive rounds (7/10/5/1-3) |
| Export Protocol | AGENTS.md pattern | Deal-specific naming |
| Voice Identity | Context - Brand v0.111 | Same voice DNA |

### Sibling Systems

| System | Version | Relationship |
|--------|---------|-------------|
| Barter Copywriter | v0.821 | Parent system, shares HVR and Brand Context |
| LinkedIn — Pieter Bertram | v0.130 | Sibling, shares HVR |
| LinkedIn — Nigel de Lange | v0.100 | Sibling, shares HVR |
| TikTok SEO | TBD | Sibling, shares HVR |

---

## 14. Success Criteria

| Criteria | Target | Measurement |
|----------|--------|-------------|
| All deals pass DEAL 19+/25 | 100% | Automated scoring |
| Zero HVR hard blocker violations | 0 per deal | HVR validation scan |
| Deal creation under 2 minutes | < 120 seconds | User timing |
| Both deal types supported | Product + Service | Template coverage |
| Voice consistency with Copywriter | Match Barter voice DNA | Manual review |
| Context window under budget | < 2,000 always-loaded lines | Line count audit |

---

## 15. Interactive Mode

### Purpose

Every Barter AI system includes an Interactive Mode that gathers requirements before generating content. Deal Templates follows this pattern with deal-specific question flows. Interactive Mode activates when a user request lacks sufficient information to generate a quality deal template.

### Activation Triggers

| Trigger | Example | Action |
|---------|---------|--------|
| No brand specified | "Create a deal" | Ask brand name + type |
| No deal type | "Make a deal for Rituals" | Ask product or service |
| No value stated | "Product deal for HEMA" | Ask approximate EUR value |
| Ambiguous requirements | "Deal with content" | Ask platform, format, deliverables |

### Question Templates

**Template 1: Deal Brief (Default)**

When a user requests a deal template, gather:

| # | Question | Required | Default |
|---|----------|----------|---------|
| 1 | What is the brand name? | Yes | — |
| 2 | Is this a product deal or a service/experience deal? | Yes | — |
| 3 | What will the creator receive? (specific items or experience) | Yes | — |
| 4 | What is the approximate EUR value? | Yes | — |
| 5 | Which platform(s)? (Instagram Reel, TikTok, both) | No | Both |
| 6 | What should the creator show? (try-on, unboxing, review, experience) | No | Inferred from deal type |
| 7 | Brand social handle(s) for tagging? | No | @brandname |
| 8 | Include Spark Ads / Partnership Ads option? | No | Yes |
| 9 | Include content usage rights option? | No | Yes |

**Template 2: Quick Deal**

When using `$quick` mode, gather only:

| # | Question | Required |
|---|----------|----------|
| 1 | Brand name | Yes |
| 2 | Product or service? | Yes |
| 3 | What does the creator receive? | Yes |
| 4 | EUR value? | Yes |

All other fields use sensible defaults.

**Template 3: Improve Existing**

When using `$improve` mode, gather:

| # | Question | Required |
|---|----------|----------|
| 1 | Paste or reference the existing deal text | Yes |
| 2 | What should improve? (all, description, requirements, appeal) | No |
| 3 | Target DEAL score? | No |

### Response Format

Interactive Mode questions follow this pattern (inherited from Copywriter Interactive Mode v0.412):

```
Before I create this deal template, I need a few details:

1. **Brand name:** [ask or confirm]
2. **Deal type:** Product or service/experience?
3. **What the creator receives:** [specific items or experience details]
4. **Approximate value:** €[amount]

Optional (I'll use defaults if you skip these):
5. **Platform:** Instagram Reel, TikTok, or both?
6. **Brand handle:** @[handle] for tagging
```

### Two-Layer Transparency

Inherited from all Barter systems:
- **Internal layer:** Full DEPTH rigor runs silently (all rounds, scoring, HVR checks)
- **External layer:** User sees concise updates only ("Generating deal template..." → "DEAL Score: 21/25 — PASS" → file path)

---

## 16. Command Shortcuts

### Overview

Command shortcuts provide quick access to common deal creation modes. These follow the `$mode` pattern used across all Barter AI systems (Copywriter: `$write`, `$blog`; LinkedIn: `$personal`, `$leadership`; TikTok: `$blog`, `$trend`).

### Deal Template Commands

| Command | Mode | DEPTH Rounds | Description |
|---------|------|-------------|-------------|
| `$product` | Product Deal | 7 (standard) | Generate a product-based deal template |
| `$service` | Service Deal | 7 (standard) | Generate a service/experience-based deal template |
| `$quick` | Quick Draft | 1-3 | Fast deal draft with minimal questions |
| `$improve` | Improve Existing | 5 | Refine an existing deal template |
| `$score` | Score Only | 1 | Run DEAL scoring on existing text without generating |
| `$hvr` | HVR Check | 1 | Run HVR compliance check only |

### Command Behavior

**$product [brand] [value]**
- Activates product deal template flow
- Loads: Deal Type Product + Standards (on-demand)
- If brand/value provided inline, skips Interactive Mode questions for those fields
- Example: `$product HEMA €95` → skips questions 1, 2, 4

**$service [brand] [value]**
- Activates service deal template flow
- Loads: Deal Type Service + Standards (on-demand)
- If brand/value provided inline, skips Interactive Mode questions for those fields
- Example: `$service "De Foodhallen" €170`

**$quick [brand]**
- Minimal Interactive Mode (4 questions only)
- DEPTH rounds: 1-3 (fast)
- Generates single variation (no 9/6/3 scaling)
- Useful for drafts and iterations

**$improve**
- Takes existing deal text as input
- Runs DEAL scoring first to identify weak areas
- Applies targeted improvements
- Shows before/after DEAL scores

**$score**
- Runs the 25-point DEAL rubric on provided text
- Returns granular breakdown per component
- No content generation

**$hvr**
- Scans provided text for HVR violations
- Returns violation count and specific findings
- No content generation

---

## 17. Output Artifact Format

### System Header

Every deal template output includes a system header (inherited from Copywriter Standards v0.111):

```
Mode: $[mode] | Scoring: DEAL [score]/25 | Template: v1.0
```

Examples:
- `Mode: $product | Scoring: DEAL 21/25 | Template: v1.0`
- `Mode: $service | Scoring: DEAL 22/25 | Template: v1.0`
- `Mode: $quick | Scoring: DEAL 19/25 | Template: v1.0`

### Export File Structure

Each exported deal template file follows this structure:

```markdown
<!-- Mode: $product | Scoring: DEAL 21/25 | Template: v1.0 -->

## [Title]

[Deal Description — variable section]

**You will receive:** [explicit value statement]

**Creator Requirements:**

**What we ask in return:**
- [requirement 1]
- [requirement 2]
- [requirement 3]
- [requirement 4]
- [requirement 5]

**Optional Add-ons:**
- **Spark Ads / Partnership Ads**
    [explanation]
- **Content usage rights**
    [explanation]
```

### Processing Summary

After export, the chat response includes a Processing Summary (not the full template):

```
Deal template exported.

File: /export/[###] - deal-[type]-[brand].md
DEAL Score: [score]/25
  D: [x]/6 | E: [x]/7 | A: [x]/6 | L: [x]/6
HVR: CLEAN (0 violations)
Variations: [count] generated
```

### Variation Labeling

When multiple description variations are generated, they are labeled:

```
**Most concise:**
[description text]

**Most valuable:**
[description text]

**Most authentic:**
[description text]
```

---

## 18. Smart Routing Logic

### Deal Type Detection

The system automatically classifies deal type based on input signals:

| Signal | Product Deal | Service Deal |
|--------|-------------|-------------|
| Physical items mentioned | Yes | No |
| Experience/visit/event mentioned | No | Yes |
| "Box", "package", "set" language | Yes | No |
| "Dinner", "tour", "spa", "visit" language | No | Yes |
| Location/venue mentioned | Unlikely | Yes |
| Shipping/delivery mentioned | Yes | No |
| Guest/companion included | Unlikely | Yes |
| Financial compensation alongside | Rare | Common |

### Routing Decision Tree

```
Input received
├── $product command? → Product deal flow
├── $service command? → Service deal flow
├── $quick command? → Quick mode (ask type if unclear)
├── $improve command? → Improvement flow
├── $score command? → Score-only flow
├── $hvr command? → HVR-only flow
└── No command?
    ├── Brand + items mentioned → Product deal (confirm)
    ├── Brand + experience mentioned → Service deal (confirm)
    ├── Brand only → Interactive Mode (ask type)
    └── No brand → Interactive Mode (full brief)
```

### Confidence Thresholds

| Confidence | Action |
|-----------|--------|
| High (90%+) | Route directly, state assumption |
| Medium (60-89%) | Route with confirmation: "This looks like a product deal. Correct?" |
| Low (< 60%) | Ask via Interactive Mode |

### Fallback Chain

1. If deal type unclear → default to product deal + ask for confirmation
2. If brand unknown → enter Interactive Mode
3. If value missing → ask before generating (required field)
4. If industry unrecognized → use general template, flag for review

---

## 19. Documentation Level

**Level 3+ Compliance (19 items):**

| # | Artifact | Status |
|---|----------|--------|
| 1 | spec.md (this file) | Complete |
| 2 | plan.md | Complete |
| 3 | decision-record.md | Complete |
| 4 | tasks.md | Complete |
| 5 | checklist.md | Complete |
| 6 | style-guide.md | Complete |
| 7 | examples.md | Complete |
| 8 | Executive Summary | Complete (Section 1) |
| 9 | Table of Contents | Complete |
| 10 | Non-Functional Requirements | Complete (Section 7) |
| 11 | Error Handling | Complete (Section 8) |
| 12 | Formal Data Schemas (DEAL) | Complete (Section 9) |
| 13 | Cross-System Dependencies | Complete (Section 13) |
| 14 | Success Criteria | Complete (Section 14) |
| 15 | Interactive Mode | Complete (Section 15) |
| 16 | Command Shortcuts | Complete (Section 16) |
| 17 | Output Artifact Format | Complete (Section 17) |
| 18 | Smart Routing Logic | Complete (Section 18) |
| 19 | Memory context file | Complete |
