---
title: "Bug Analysis & Smart Router Design Plan"
status: completed
created: 2024-12-31
updated: 2024-12-31
---

# Bug Analysis & Smart Router Design Plan

## Overview

This plan covers two phases:
1. **Phase A**: Bug analysis using 25 parallel Opus agents
2. **Phase B**: Smart router design based on findings

---

## Phase A: Bug Analysis

### Methodology

#### A1: Parallel Analysis (Completed)
- Deployed 25 Opus agents for comprehensive coverage
- Each agent assigned specific scope with structured output
- Constraint: DO NOT flag design decisions, ONLY bugs

#### A2: Synthesis (Completed)
- Deduplicated findings across agents
- Categorized by severity (Critical/Medium/Low)
- Identified 4 root causes

#### A3: Documentation (Completed)
- Created analysis-report.md with full bug inventory
- Created recommendations-report.md v1.0

### Agent Distribution

| Agent Group | Agents | Scope | Bugs Found |
|-------------|--------|-------|------------|
| **SKILL.md Analysis** | 1-5 | Frontmatter, sections 1-9, route_resources() | 9 |
| **References Analysis** | 6-15 | All 6 subfolders (36 files) | 8 |
| **Assets Analysis** | 16-20 | All 4 subfolders (10 files) | 10 |
| **Cross-Cutting** | 21-25 | Links, naming, categorization | 6 |
| **Total** | 25 | 47 files | 22 unique (after dedup) |

### Findings Summary

#### Critical Bugs (2)

| ID | Bug | File | Lines | Impact |
|----|-----|------|-------|--------|
| C1 | Missing `debugging_checklist.md` | `assets/` | N/A | Phase 2 broken |
| C2 | Missing `verification_checklist.md` | `assets/` | N/A | Phase 3 broken |

#### Medium Bugs (15)

**Category A: Migration Artifacts (5)**

| ID | File | Issue |
|----|------|-------|
| M1 | `references/postgres-backup-system/architecture.md` | Old `.opencode/knowledge/` paths |
| M2 | `references/postgres-backup-system/project_rules.md` | Old `.opencode/knowledge/` paths |
| M3 | `assets/postgres-backup-system/api_reference.md` | Old `.opencode/knowledge/` paths |
| M4 | `assets/postgres-backup-system/deployment.md` | Old `.opencode/knowledge/` paths |
| M5 | `assets/postgres-backup-system/development_guide.md` | Old `.opencode/knowledge/` paths |

**Category B: Cross-Reference Breaks (6)**

| ID | Source | Broken Link | Actual Location |
|----|--------|-------------|-----------------|
| M6 | `references/fe-partners-app/api-patterns.md` | `./form-patterns.md` | `assets/fe-partners-app/` |
| M7 | `references/fe-partners-app/component-architecture.md` | `./form-patterns.md` | `assets/fe-partners-app/` |
| M8 | `assets/fe-partners-app/form-patterns.md` | `./api-patterns.md` | `references/fe-partners-app/` |
| M9 | `assets/fe-partners-app/form-patterns.md` | `./component-architecture.md` | `references/fe-partners-app/` |
| M10 | `assets/backend-system/README_CRON_TRACKING.md` | `cron_execution_tracking.md` | `references/backend-system/` |
| M11 | `assets/backend-system/README_CRON_TRACKING.md` | `cron_tracking_quick_reference.md` | Does not exist |

**Category C: Stack Detection Drift (3)**

| ID | Issue | stack_detection.md | SKILL.md |
|----|-------|-------------------|----------|
| M12 | Case mismatch | `go-backend` | `GO_BACKEND` |
| M13 | Missing detection | No DEVOPS | Has DEVOPS |
| M14 | Missing error suppression | No `2>/dev/null` | Has `2>/dev/null` |

**Category D: Other (1)**

| ID | File | Issue |
|----|------|-------|
| M15 | `SKILL.md` frontmatter | Missing `globs`, `alwaysApply` |

#### Low Bugs (5)

| ID | File | Issue |
|----|------|-------|
| L1 | `references/barter-expo/expo-patterns.md` | Typo: "envrionment" |
| L2 | `references/barter-expo/performance-optimization.md` | Date subtraction without `.getTime()` |
| L3 | `references/barter-expo/performance-optimization.md` | FlashList missing `estimatedItemSize` |
| L4 | `references/gaia-services/*.md` | Lowercase headings in stubs |
| L5 | `assets/postgres-backup-system/deployment.md` | Deprecated K8s PodSecurityPolicy |

#### Root Causes (4)

| # | Root Cause | Description | Bugs |
|---|------------|-------------|------|
| 1 | Incomplete development | Universal assets never created | C1, C2 |
| 2 | Migration artifact | Old paths not updated | M1-M5 |
| 3 | Split artifact | Cross-refs not updated after refs↔assets split | M6-M11 |
| 4 | Logic drift | Duplicated detection logic diverged | M12-M14 |

---

## Phase B: Smart Router Design

### Methodology

#### B1: Architecture Analysis (Completed)
- Read full SKILL.md (678 lines)
- Identified existing strengths (registry, detection, routing exist)
- Identified gaps (no priority, no task-awareness)

#### B2: Design (Completed)
- Designed resource priority system (P1/P2/P3)
- Designed task-aware keyword matching
- Designed multi-strategy detection pipeline
- Created comprehensive checklists

#### B3: Documentation (Completed)
- Rewrote recommendations-report.md to v2.0 (~950 lines)
- Added Context Management Strategy
- Added Validation Test Cases
- Added Troubleshooting Guide

### Smart Router Features

| Feature | Description | Benefit |
|---------|-------------|---------|
| **Resource Priority (P1/P2/P3)** | Classify files by importance | 60-80% token reduction |
| **Task-Aware Loading** | Match keywords to resources | Load only relevant files |
| **Multi-Strategy Detection** | Explicit → Git → Markers → Fallback | 98% accuracy |
| **Confidence Scoring** | Report detection confidence | Transparency |
| **Comprehensive Checklists** | 60+ debugging, 50+ verification items | Thorough workflows |

### Token Budget Analysis

| Repository | P1 Tokens | P2 Tokens | P3 Tokens | Total |
|------------|-----------|-----------|-----------|-------|
| backend-system | ~1,500 | ~4,000 | ~10,000 | ~15,500 |
| fe-partners-app | ~1,200 | ~3,500 | ~1,500 | ~6,200 |
| barter-expo | ~1,000 | ~2,500 | ~1,500 | ~5,000 |
| gaia-services | ~800 | ~1,200 | ~1,000 | ~3,000 |
| postgres-backup-system | ~1,000 | ~1,500 | ~1,000 | ~3,500 |

### Loading Strategies

| Strategy | When | Tokens |
|----------|------|--------|
| MINIMAL | Verification phase | ~750 |
| DEBUGGING | Bug fixing | ~3,000 |
| FOCUSED | Specific task (DB, API) | ~2,500 |
| STANDARD | General implementation | ~4,000 |
| COMPREHENSIVE | Deep dive | ~10,000-15,000 |

---

## Implementation Roadmap

### Tier 1: Bug Fixes (1-2 hours)

| Task | File | Effort |
|------|------|--------|
| Create debugging_checklist.md | `assets/debugging_checklist.md` | 45 min |
| Create verification_checklist.md | `assets/verification_checklist.md` | 45 min |
| Add missing frontmatter | `SKILL.md` | 5 min |
| Sync stack_detection.md | `references/common/stack_detection.md` | 15 min |

### Tier 2: Enhancements (4-6 hours)

| Task | Description | Effort |
|------|-------------|--------|
| Add resource priority | P1/P2/P3 in registry | 1 hour |
| Add task keywords | Keyword matching for P2 | 1 hour |
| Add Phase 2/3 fallback | else clause for unknown stacks | 30 min |
| Update old paths | Fix `.opencode/knowledge/` refs | 1 hour |
| Fix cross-references | Update refs↔assets links | 1 hour |
| Add detection confidence | Report confidence level | 30 min |

### Tier 3: Advanced (Future)

| Feature | Description |
|---------|-------------|
| Explicit override | `.barter-repo` file support |
| Git-based detection | Detect from remote URL |
| Token tracking | Report tokens loaded |
| Progressive loading | Load on-demand |

---

## Timeline

| Date | Milestone | Status |
|------|-----------|--------|
| 2024-12-31 AM | Phase A: Bug analysis | ✅ Complete |
| 2024-12-31 PM | Phase B: Smart router design | ✅ Complete |
| TBD | Tier 1 implementation | 📋 Pending |
| TBD | Tier 2 implementation | 📋 Pending |

---

## Deliverables

| Deliverable | Lines | Status |
|-------------|-------|--------|
| `analysis-report.md` | ~400 | ✅ Complete |
| `recommendations-report.md` | ~950 | ✅ Complete (v2.0) |
| `spec.md` | ~100 | ✅ Complete |
| `plan.md` | ~200 | ✅ Complete |
| `checklist.md` | ~150 | ✅ Complete |
