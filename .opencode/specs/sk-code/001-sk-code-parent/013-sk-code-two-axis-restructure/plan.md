---
title: "Implementation Plan: Phase 13 sk-code two-axis restructure"
description: "Plan for the shipped two-axis sk-code restructure, surface packet move, review rename, router/registry reconciliation, and deterministic verification gates."
trigger_phrases:
  - "sk-code two-axis plan"
  - "surface packet plan"
  - "review rename plan"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/001-sk-code-parent/013-sk-code-two-axis-restructure"
    last_updated_at: "2026-07-05T00:00:00Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Backfilled strict Level 2 plan documentation for the shipped two-axis restructure."
    next_safe_action: "Use recorded gates; phase 014 owns deferred close-out"
---
# Implementation Plan: Phase 13 sk-code two-axis restructure

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, JSON, YAML, JavaScript test utilities |
| **Framework** | OpenCode skill parent hub and system-spec-kit contracts |
| **Storage** | Repository filesystem and spec-folder documentation |
| **Testing** | Parent skill checker, vocab/router sync vitests, link sweeps, router replay, rule-copy checks |

### Overview
This phase shipped a mechanical but broad restructure of sk-code into a two-axis parent hub. The plan moved evidence into read-only surface packets, slimmed workflow modes back to process contracts, folded `code-review` into `review`, and used deterministic gates to prove the router, vocabulary, links, and rename consumers stayed consistent.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Existing workflow-only sk-code layout and scattered surface evidence identified.
- [x] Target workflow axis and surface axis defined.
- [x] Rename scope for `code-review` to `review` identified.
- [x] Deferred add-only close-out work assigned to phase 014.

### Definition of Done
- [x] Surface evidence packets created and workflow modes slimmed.
- [x] Registry and router updated for the two-axis model.
- [x] Rename-affected contracts repointed.
- [x] Link repair, vocab sync, router sync, parent skill checks, rule-copy checks, and router replay passed.

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Two-axis parent hub: workflow packets perform actions; surface packets provide read-only evidence bundled by router outcome.

### Key Components
- **Workflow axis**: `implement`, `quality`, `debug`, `verify`, and `review`.
- **Surface axis**: `webflow`, `opencode`, and `animation` with read-only evidence-base contracts.
- **Registry**: `mode-registry.json` declares packet kinds, surface entries, aliases, and `extensions.surface-axis`.
- **Router**: `hub-router.json` owns surface router signals, vocabulary classes, tie-breaks, and `surfaceBundle` outcomes.
- **Replay/sync utilities**: `router-replay.cjs` and router-sync vitests verify routing behavior after the move.

### Data Flow
Advisor or user intent selects a workflow mode, then surface vocabulary can bundle zero or more read-only surface packets. For example, `review my webflow animation` resolves to review workflow plus Webflow and animation evidence packets.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Identify scattered Webflow, OpenCode, and Motion.dev evidence directories.
- [x] Identify rename consumers for `code-review`.

### Phase 2: Core Implementation
- [x] Move whole directories into `webflow/`, `opencode/`, and `animation/` packets.
- [x] Fold `code-review` into `review`.
- [x] Update registry and router for the two-axis model.
- [x] Normalize smart-routing paths and update replay/sync logic.
- [x] Author surface SKILL, README, and changelog files.

### Phase 3: Verification
- [x] Run parent skill checks in default and strict modes.
- [x] Run vocab-sync and router-sync vitests.
- [x] Repair and verify moved markdown links.
- [x] Run rule-copy checks and router replay spot check.

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Parent hub contract | sk-code registry, router, packets | `parent-skill-check sk-code`, including `PARENT_HUB_CHECK_STRICT=1` |
| Vocabulary and router sync | owned aliases, collisions, router prose/registry sync | Vocab-sync and router-sync vitests |
| Link integrity | moved sk-code evidence trees | Reverse-move resolver and dead-path sweep |
| Rename consumers | review rename contracts | `check-rule-copies.js` and its test |
| Replay | two-axis bundle behavior | `router-replay` for `review my webflow animation` |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| sk-code parent hub registry | Internal | Green | Two-axis packet metadata cannot be declared |
| sk-code hub router | Internal | Green | Surface bundle routing cannot be expressed |
| router replay utility | Internal | Green | Two-axis routing cannot be spot-checked locally |
| Rule-copy check utilities | Internal | Green | Review rename consumers cannot be verified |
| Skill graph and memory reindex | Internal | Deferred | Advisor graph may lag until phase 014 |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Deterministic gates fail after the restructure, or the remote commit needs reversal.
- **Procedure**: Revert shipped commit `90e8833411`, restoring the prior workflow-only layout and `code-review` contract paths, then re-run parent-skill-check and router/vocab sync gates.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Prior 124 cutover state | Core Implementation |
| Core Implementation | Setup | Verification |
| Verification | Core Implementation | Remote push and phase documentation |
| Phase 014 Close-out | Verification | Reindex, Lane-C re-baseline, parent roll-up |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Medium | Existing scattered evidence and rename consumers |
| Core Implementation | High | 200 files, 148 renames, three new surface packets |
| Verification | High | Multiple deterministic gates and link repair |
| **Total** | | **Large mechanical restructure** |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Deterministic gates green before push.
- [x] Remote commit SHA recorded.
- [x] Deferred add-only work separated into phase 014.

### Rollback Procedure
1. Revert commit `90e8833411` if the shipped restructure must be backed out.
2. Re-run parent-skill-check default and strict.
3. Re-run vocab-sync and router-sync vitests.
4. Re-run link and dead-path sweeps for the sk-code tree.
5. Re-run rule-copy checks for review rename consumers.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: Revert filesystem, JSON, YAML, and markdown changes from the shipped commit.

<!-- /ANCHOR:enhanced-rollback -->
