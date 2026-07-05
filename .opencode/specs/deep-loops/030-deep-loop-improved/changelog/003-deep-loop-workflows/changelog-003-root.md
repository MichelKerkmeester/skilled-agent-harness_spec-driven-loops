---
title: "Changelog: Implementation: Deep-Loop-Workflows Improvements [003-deep-loop-workflows/root]"
description: "Chronological changelog for the Implementation: Deep-Loop-Workflows Improvements spec root."
trigger_phrases:
  - "root changelog"
  - "packet changelog"
  - "nested changelog"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/root.md | v1.0 -->

## 2026-06-29

> Spec folder: `.opencode/specs/deep-loops/030-deep-loop-improved/003-deep-loop-workflows` (Level 2)

### Summary

Phase 004 shipped workflow governance improvements across convergence policy, question provenance, rejected-idea suppression, idea lifecycle, coverage seeding, improvement promotion and fanout shape. It made loops more explicit about stop logic, provenance, repeated observations, accepted versus shipped candidates and future wave planning while preserving current defaults where required.

### Before vs After

**Before**

The workflows did not have a shared convergence-profile schema, a cross-mode anti-convergence contract or a minimum-iteration floor for deep research. Question origin provenance was not propagated through the reducer, generated key questions had no conflict resolver and rejected ideas had no bounded cache. Ideas did not move through an observed, promoted and rejected lifecycle, coverage graphs were not seeded from code graph at loop init and improvement promotion did not separate accepted candidates from shipped candidates.

**After**

Deep research now has a gated minimum-iteration STOP guard and convergence mode, while the workflow stack has a shared convergence-profile schema and explicit anti-convergence blocks across modes. Runtime capabilities enforce fail-closed stop policy where configured. The reducer now carries question origin provenance, resolves generated-question conflicts and records rejected ideas with exact plus fuzzy suppression and reversal events. Ideas now start as observed and promote only after enough observations. Coverage graphs can seed from code graph with source and confidence fields. Deep improvement now emits outcome score deltas and fixture deltas, gates promotion on deltas, separates accept from ship, preserves branches on failure and has rollback support. Lane-D packaging, a self-target guard and dormant wave-fanout schema landed with flat-pool behavior preserved by default.

**Impact**

The workflows now converge with more explicit policy and better evidence. A loop can explain where a question came from, avoid repeating rejected ideas, promote ideas only after repeated observation and distinguish a promising candidate from a shipped one. Coverage starts with better structural context and future wave planning has a schema without disturbing the current flat-pool path.

### Included Phases

| Phase | Status | Summary |
|---|---|---|
| `001-anti-convergence-floor` | Complete | Added minIterations(3)+convergenceMode to deep_research_config.json plus a min-iteration STOP guard in deep_research_auto.yaml (gated; default maxIterations behavior and convergence parity preserved). Runtime tests incl. parity pass. |
| `002-convergence-profile-unification-adr` | Complete | Defined a shared convergence-profile schema (threshold/weight/role/direction/normalizer) plus schema comment blocks across the three convergence implementations (additive, no behavior change), pinned current traces with a parity test (14/14 pass), and recorded the ADR rejecting a single universal convergence formula. |
| `003-cross-mode-anti-convergence-adr` | Complete | antiConvergence block across the 4 mode configs (council=minRounds), stopPolicy:fail-closed in 3 per-mode runtime_capabilities, contract enforcement in runtime-capabilities.cjs, and a convergenceMode-locked invariant group in the optimizer manifest. Parity 45/45 + typecheck green; reconciled with the 003/001 floor. |
| `004-injection-inbox-provenance` | Complete | Propagate question origin provenance through reduce-state.cjs and document the inbox.jsonl injection surface in deep_research_strategy.md. Tests pass; hygiene + drift green. |
| `005-anchor-ownership-conflict-adr` | Complete | Added resolveQuestionConflicts() to deep-research reduce-state.cjs and treat key-questions as a generated projection (+ strategy + reducer-registry docs + yaml). Tests pass; parity green; hygiene/drift clean. |
| `006-rejected-pattern-cache` | Complete | Bounded rejected-idea index with exact + fuzzy suppression and reversal events in deep-research reduce-state.cjs (+ state_jsonl/loop_protocol docs + yaml). Reduce-state tests 12/12; hygiene/drift clean. |
| `007-ideas-backlog-lifecycle` | Complete | observed/promoted/rejected idea events: leaf emits observed-only, the reducer promotes after a minIdeaObservations threshold (reduce-state.cjs + protocol/state docs + yaml + agent). Reduce-state tests pass; hygiene/drift clean. |
| `008-code-graph-coverage-bridge` | Complete | Seed coverage-graph from code-graph at loop init: seed_source/seed_confidence DB schema in coverage-graph-db.ts + --seed-source/--seed-confidence on upsert.cjs + init seed steps in deep_context_auto.yaml/deep_review_auto.yaml. Tests pass; typecheck/hygiene/drift green. |
| `009-loop-quality-benchmark` | Complete | Emit outcomeScoreDelta + fixtureDeltas[] helped/hurt plus a delta promotion gate across run-benchmark.cjs / shared reduce-state.cjs / promote-candidate.cjs. 388 deep-improvement tests pass; hygiene/drift clean. |
| `010-deep-improvement-accepted-vs-shipped` | Complete | Two-phase promotion (accept vs ship) with branch-preserved failure + a new rollback-candidate.cjs, in promote-candidate.cjs (+ promotion gate/rules docs + config). 388 deep-improvement tests pass; hygiene/drift clean. |
| `011-meta-loop-lane-d-packaging` | Complete | Lane-D packaging: deep-loop-runtime profile JSON + packaging schema + loop_contract refresh + --self-target guard in ai-system-improvement. Contract test passes; strict validate + hygiene/drift clean. |
| `012-push-wave-fanout` | Complete | depends_on/touches/assignment_model schema in executor-config.ts + flat_pool guard + dormant wave-planner interface stub in fanout-pool/fanout-run. Default flat_pool keeps existing behavior; typecheck + fanout tests 97/97; drift clean. |

### Added

- No new additions recorded.

### Changed

- No broader packet changes recorded. The shipped changes are recorded in the phase rollups and leaf changelogs.

### Fixed

- No fixes recorded.

### Verification

- No explicit verification recorded.

### Files Changed

_No file-level detail recorded._

### Follow-Ups

- None recorded.
