# Barter Deal Templates — Implementation Plan

| Field | Value |
|-------|-------|
| **Version** | 1.2.0 |
| **Status** | Approved |
| **Owner** | Michel Kerkmeester |
| **Created** | 2026-02-06 |
| **Last Updated** | 2026-02-06 |
| **Revision Note** | v1.2.0 — Added Interactive Mode, Command Shortcuts, Output Artifact Format and Smart Routing references to System Prompt and Standards tasks. Cross-system alignment with Copywriter, LinkedIn and TikTok patterns. |

---

## Table of Contents

1. [Overview](#1-overview)
2. [Prerequisites](#2-prerequisites)
3. [Knowledge Base Design](#3-knowledge-base-design)
4. [Implementation Timeline](#4-implementation-timeline)
5. [Phase 1 — Core Setup](#5-phase-1--core-setup)
6. [Phase 2 — Core Knowledge Base (MVS)](#6-phase-2--core-knowledge-base-mvs)
7. [Phase 3 — Context Modules](#7-phase-3--context-modules)
8. [Phase 4 — Quality and Validation](#8-phase-4--quality-and-validation)
9. [Phase 5 — Integration Testing](#9-phase-5--integration-testing)
10. [Deployment and Rollout Strategy](#10-deployment-and-rollout-strategy)
11. [Resource Allocation](#11-resource-allocation)
12. [Post-Launch Success Metrics](#12-post-launch-success-metrics)
13. [Context Window Analysis](#13-context-window-analysis)
14. [Risk Register](#14-risk-register)

---

## 1. Overview

### Objective

Build a specialized Barter Deal Templates AI agent that generates high-quality product-based and service-based deal descriptions, scored against a 25-point DEAL rubric, with HVR v0.100 compliance and DEPTH cognitive methodology.

### Approach

Inherit proven architecture from the Barter Copywriter (v0.821) and adapt it for deal-specific use cases. The system reuses shared components (HVR, Brand Context) and adds deal-specific knowledge (DEAL scoring, template structures, industry modules).

### Total Effort

**~11 hours** across 5 phases (revised from 8-10 hours after cross-system alignment added DEPTH adaptation detail, Interactive Mode design, and expanded Standards scope).

---

## 2. Prerequisites

### Required Before Starting

| # | Prerequisite | Source | Status |
|---|-------------|--------|--------|
| 1 | Barter Copywriter System Prompt v0.821 | `/Barter/Copywriter/knowledge base/` | Available |
| 2 | HVR v0.100 | `/Barter/Copywriter/knowledge base/` | Available |
| 3 | Brand Context v0.111 | `/Barter/Copywriter/knowledge base/` | Available |
| 4 | DEPTH Framework v0.112 | `/Barter/Copywriter/knowledge base/` | Available |
| 5 | Deal template examples | `/Barter/Deal Templates/context/` | Available |
| 6 | Existing AGENTS.md | `/Barter/Deal Templates/AGENTS.md` | Available |

### Folder Structure

```
/Barter/Deal Templates/
├── AGENTS.md                          (exists — update needed)
├── README.md                          (exists)
├── context/
│   └── barter_deal_templates.md       (exists — template reference)
├── knowledge base/
│   ├── DT - System Prompt.md          (to create)
│   ├── DT - Brand Context.md          (to create, extend from Copywriter)
│   ├── DT - HVR v0.100.md            (symlink or copy from Copywriter)
│   ├── DT - Deal Type Product.md      (to create)
│   ├── DT - Deal Type Service.md      (to create)
│   ├── DT - Industry Modules.md       (to create)
│   ├── DT - DEPTH Framework.md        (to create, adapt from Copywriter)
│   ├── DT - Market Data.md            (to create)
│   ├── DT - Standards.md              (to create)
│   └── DT - Interactive Mode.md       (to create)
├── export/                            (output directory)
└── memory/
    └── README.md                      (exists)
```

---

## 3. Knowledge Base Design

### File Inventory (10 Files)

| # | File | Source | Load Strategy | Est. Lines | Priority |
|---|------|--------|--------------|-----------|----------|
| 1 | DT - System Prompt | New (adapt from Copywriter) | Always | ~400 | P0 (MVS) |
| 2 | DT - Brand Context | Extend from Copywriter Brand | Always | ~200 | P0 (MVS) |
| 3 | DT - HVR v0.100 | Copy from Copywriter HVR | Always | ~440 | P0 (MVS) |
| 4 | DT - Deal Type Product | New (from template examples) | On-demand | ~200 | P1 |
| 5 | DT - Deal Type Service | New (from template examples) | On-demand | ~200 | P1 |
| 6 | DT - Industry Modules | New | On-demand | ~300 | P2 |
| 7 | DT - DEPTH Framework | Adapt from Copywriter DEPTH | On-demand | ~200 | P1 |
| 8 | DT - Market Data | New (from Copywriter Market) | Trigger | ~150 | P2 |
| 9 | DT - Standards | New (from Copywriter Standards) | On-demand | ~150 | P1 |
| 10 | DT - Interactive Mode | Adapt from Copywriter Interactive | On-demand | ~150 | P2 |

### Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| HVR sharing | Copy (not symlink) | Avoids path dependency issues |
| Brand Context | Extend, not copy | Adds deal-specific voice guidance |
| DEPTH adaptation | Adaptive rounds (7/10/5/1-3) | Deals are simpler than general copy |
| Variation scaling | Description section only | Fixed sections don't need variation |
| Scoring system | DEAL (not MEQT) | Deal-specific quality dimensions |
| MVS scope | 4 files (AGENTS, System Prompt, Brand, HVR) | Minimum for functional system |

---

## 4. Implementation Timeline

| Phase | Description | Duration | Dependencies |
|-------|------------|----------|-------------|
| Phase 1 | Core Setup | 1 hour | Prerequisites available |
| Phase 2 | Core KB (MVS) | 3-4 hours | Phase 1 complete |
| Phase 3 | Context Modules | 2-3 hours | Phase 2 complete |
| Phase 4 | Quality and Validation | 1-2 hours | Phase 3 complete |
| Phase 5 | Integration Testing | 1 hour | Phase 4 complete |
| **Total** | | **~11 hours** | |

---

## 5. Phase 1 — Core Setup (1 hour)

### Objectives

- Create folder structure for knowledge base
- Update AGENTS.md with deal-specific configuration
- Create README.md with system overview

### Tasks

| Task | Description | Output |
|------|------------|--------|
| T1.1 | Create `/knowledge base/` folder structure | Empty folders ready |
| T1.2 | Update AGENTS.md | Deal-specific role, export protocol, reading instructions |
| T1.3 | Update README.md | System overview, file inventory, quick start |

### AGENTS.md Key Changes

- Role: "Senior content strategist for Barter, creating compelling deal templates"
- Step 1: Read `DT - System Prompt` (primary instruction set)
- Step 2 Always Load: HVR v0.100, Brand Context
- Step 2 Deal Tasks: Deal Type Product/Service, Standards
- Export path: `/export/[###] - deal-[type]-[brand].md`

---

## 6. Phase 2 — Core Knowledge Base (MVS) (2-3 hours)

### Objectives

- Create the 4 MVS files (System Prompt, Brand Context, HVR, DEPTH)
- Establish DEAL scoring system
- Configure smart routing for deal types

### Tasks

| Task | Description | Output | Est. Time |
|------|------------|--------|-----------|
| T2.1 | Create DT - System Prompt | Core smart routing logic (confidence thresholds, fallback chain), DEAL scoring (25-point with granular breakdown), DEPTH config, command shortcut dispatch | 75 min |
| T2.2 | Create DT - Brand Context | Extended voice guide with deal-specific patterns | 30 min |
| T2.3 | Copy DT - HVR v0.100 | Human Voice Rules (from Copywriter) | 10 min |
| T2.4 | Create DT - DEPTH Framework | Adapt from Copywriter v0.112: replace MEQT with DEAL, exclude RICCE (DR-018), simplify state YAML, keep cognitive rigor and two-layer transparency | 60 min |
| T2.5 | Create DT - Standards | Output artifact format (system header, Processing Summary), command shortcuts ($product/$service/$quick/$improve/$score/$hvr), variation labeling, export file structure | 30 min |

### System Prompt Key Sections

1. Objective and role definition
2. Critical rules (deal-specific)
3. DEAL scoring system (25-point rubric with granular breakdown)
4. Smart routing logic (product vs service detection + confidence thresholds)
5. Variation scaling (description section only, 9/6/3)
6. Template structure (fixed vs variable sections)
7. Export protocol integration
8. DEPTH configuration (adaptive rounds)
9. Command shortcuts ($product, $service, $quick, $improve, $score, $hvr)
10. Output artifact format (system header + Processing Summary)

---

## 7. Phase 3 — Context Modules (2-3 hours)

### Objectives

- Create deal-type-specific context files
- Build industry modules for common verticals
- Set up market data and interactive mode

### Tasks

| Task | Description | Output | Est. Time |
|------|------------|--------|-----------|
| T3.1 | Create DT - Deal Type Product | Product deal templates, examples, patterns | 45 min |
| T3.2 | Create DT - Deal Type Service | Service deal templates, examples, patterns | 45 min |
| T3.3 | Create DT - Industry Modules | Industry-specific vocabulary and examples | 45 min |
| T3.4 | Create DT - Market Data | Pricing benchmarks, value ranges | 20 min |
| T3.5 | Create DT - Interactive Mode | Deal-specific question templates (Deal Brief, Quick Deal, Improve Existing), activation triggers, two-layer transparency | 30 min |

### Deal Type Context Structure

Each deal type file contains:
- Template structure with section-by-section guidance
- 2-3 annotated examples
- Common pitfalls and fixes
- Recommended value ranges
- Creator requirement patterns

### Industry Modules

Initial industries to cover:
- Fashion and beauty (HEMA, Rituals)
- Food and hospitality (restaurants, events)
- Tech and gadgets
- Health and wellness
- Home and lifestyle

---

## 8. Phase 4 — Quality and Validation (1-2 hours)

### Objectives

- End-to-end testing with sample deals
- DEAL scoring calibration
- HVR compliance verification
- Export protocol testing

### Tasks

| Task | Description | Output | Est. Time |
|------|------------|--------|-----------|
| T4.1 | Test product deal generation | 3 sample deals, scored | 30 min |
| T4.2 | Test service deal generation | 3 sample deals, scored | 30 min |
| T4.3 | HVR compliance audit | Scan all outputs for violations | 15 min |
| T4.4 | Export protocol verification | Verify naming, path, sequence | 10 min |
| T4.5 | DEAL scoring calibration | Verify scores match expectations | 15 min |

### Test Cases

| # | Deal Type | Brand | Value | Expected DEAL |
|---|----------|-------|-------|--------------|
| 1 | Product | HEMA Fashion | ~95 | 20+ |
| 2 | Product | Rituals Box | ~150 | 21+ |
| 3 | Service | De Foodhallen | ~120+50 | 21+ |
| 4 | Service | Spa Experience | ~200 | 20+ |
| 5 | Product | Low-value item | ~30 | 15-18 (test rejection) |
| 6 | Product | Missing info | N/A | EH-002 triggered |

---

## 9. Phase 5 — Integration Testing (1 hour)

### Objectives

- Cross-system voice consistency check
- Context window budget verification
- End-to-end workflow validation

### Tasks

| Task | Description | Output |
|------|------------|--------|
| T5.1 | Cross-system voice audit | Compare outputs with Copywriter and LinkedIn |
| T5.2 | Context window measurement | Verify always-loaded < 2,000 lines |
| T5.3 | Full workflow test | Request to export, timed |

---

## 10. Deployment and Rollout Strategy

### Phase A — Internal Testing (Day 1)

- Deploy to Deal Templates folder
- Run 5+ test deals across both types
- Verify DEAL scoring calibration
- Fix any HVR violations

### Phase B — Limited Use (Days 2-3)

- Use for real deal creation (supervised)
- Monitor DEAL scores and user satisfaction
- Collect feedback on template quality
- Iterate on industry modules

### Phase C — Full Deployment (Day 4+)

- Enable for all deal creation
- Remove supervision requirement
- Monitor ongoing quality metrics

### Rollback Triggers

| Trigger | Action |
|---------|--------|
| DEAL scores consistently < 17 | Pause, recalibrate scoring |
| HVR hard blocker in 3+ consecutive deals | Pause, audit HVR integration |
| Export failures | Fix path/permission issues |
| User reports "sounds like AI" | Audit and strengthen HVR checks |

---

## 11. Resource Allocation

### Work Distribution

| Phase | Primary Work | Skills Needed |
|-------|-------------|--------------|
| Phase 1 | Folder structure, AGENTS.md | System architecture |
| Phase 2 | System Prompt, Brand Context, DEPTH | Copywriting, AI systems |
| Phase 3 | Deal type files, industry modules | Domain knowledge, templates |
| Phase 4 | Testing, scoring calibration | Quality assurance |
| Phase 5 | Integration testing | Cross-system knowledge |

### Tool Requirements

| Tool | Purpose |
|------|---------|
| AI coding assistant | File creation and editing |
| Barter Copywriter | Reference for voice and patterns |
| Template examples | Reference for deal structures |

---

## 12. Post-Launch Success Metrics

| Metric | 30-Day Target | 90-Day Target |
|--------|--------------|--------------|
| Average DEAL score | 20+/25 | 21+/25 |
| HVR violations per deal | < 0.5 | 0 |
| Deal creation time | < 3 min | < 2 min |
| Creator application rate | Baseline | +10% vs baseline |
| Template reuse rate | 60% | 80% |
| User satisfaction (1-5) | 3.5+ | 4.0+ |

---

## 13. Context Window Analysis

### Always-Loaded Content

| Component | Est. Lines | Notes |
|-----------|-----------|-------|
| AGENTS.md | ~180 | Role, export protocol, reading instructions |
| DT - System Prompt | ~400 | Core routing, DEAL scoring |
| DT - Brand Context | ~200 | Voice identity |
| DT - HVR v0.100 | ~440 | Human Voice Rules |
| System overhead | ~330 | Conversation context |
| **Subtotal (always)** | **~1,550** | Under 2,000 line budget |

### Per-Session On-Demand

| Scenario | Additional Files | Est. Lines |
|----------|-----------------|-----------|
| Product deal | Deal Type Product + Standards | ~350 |
| Service deal | Deal Type Service + Standards | ~350 |
| Complex deal | + DEPTH + Industry Module | +500 |
| Market comparison | + Market Data | +150 |

### Typical Session Total

- Simple deal: ~1,900 lines (within budget)
- Standard deal: ~2,050 lines (slightly over, acceptable)
- Complex deal: ~2,550 lines (manageable with modern context windows)

---

## 14. Risk Register

| # | Risk | Probability | Impact | Mitigation |
|---|------|------------|--------|-----------|
| R1 | DEAL scores too lenient | Medium | High | Calibrate with manual review of 10+ deals |
| R2 | HVR violations slip through | Low | High | Double-pass validation (DEPTH Test + Harmonize) |
| R3 | Context window overflow | Low | Medium | Tiered loading, monitor line counts |
| R4 | Voice drift from Copywriter | Medium | Medium | Regular cross-system audits |
| R5 | Industry modules too generic | Medium | Low | Iterate based on real deal feedback |
| R6 | Export path issues | Low | Low | Validate path before write, fallback to inline |
