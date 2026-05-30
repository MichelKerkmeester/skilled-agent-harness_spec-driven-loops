---
title: "Phase 004: Skill-benchmark mode (Lane C) design + build"
description: "Design and build Lane C (skill-benchmark) in the renamed deep-improvement skill: scenario fixtures, hint-free dispatcher capturing resource-load traces, routing/discovery/efficiency/usefulness scorer, ranked remediation report, and /deep:start-skill-benchmark-loop command."
trigger_phrases:
  - "skill-benchmark mode build"
  - "122 phase 004"
  - "Lane C skill benchmark"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/004-skill-benchmark-mode"
    last_updated_at: "2026-05-30T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored phase scaffold spec (planned)"
    next_safe_action: "Design + build Lane C from Phase 001 converged findings"
    blockers: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Phase 004 — Skill-benchmark mode (Lane C): design + build

**Parent:** `122-deep-improvement-skill-benchmark-mode`
**Type:** Implementation (new lane)
**Status:** Planned (depends on Phase 001 + Phase 002 findings + Phase 003 rename)

---

## 1. Purpose

Design and build **Lane C (skill-benchmark)** in the renamed `deep-improvement` skill: a benchmark that measures whether a *skill* is well-structured, well-routed, efficient, and useful **in practice** (how AIs actually discover/use it), and emits actionable, ranked remediation findings.

The converged design from Phase 001 is authoritative, and the Phase 002 implementation playbook is the build guide; this spec is the working frame.

## 2. Build (reusing the three pluggable seams)

- **Fixtures (candidate-source).** Per-target-skill scenario set: realistic prompt + expected activation + expected reference/asset(s) + correct-outcome rubric, including negatives (should-not-activate). Authoring approach per Phase 001 RQ4.
- **Dispatcher.** Hint-free harness (Phase 001 RQ2) that runs each scenario against an executor and captures the resource-load trace + tool trace (what was opened, order, call count). Model-agnostic, reusing the Lane B executor-routing map.
- **Scorer.** Compare actual vs expected across the dimensions confirmed in Phase 001 (routing/activation accuracy, unprompted discovery precision/recall, efficiency/bottlenecks, usefulness ablation, structural connectivity). Reuse the Lane B deterministic-checks + pluggable-grader shape.
- **Mode.** `scripts/shared/loop-host.cjs --mode=skill-benchmark`; records carry `mode: skill-benchmark`; report carries `scoringMethod`. Lane A/B remain byte-identical when the flag is absent.
- **Command.** `/deep:start-skill-benchmark-loop` (`:auto`/`:confirm`). Reuse the model-benchmark command scaffold unless Phase 001 RQ6 says otherwise.
- **Report.** Skill Benchmark Report: per-dimension scores + ranked bottlenecks + concrete remediations (Phase 001 RQ5). Diagnostic by default (no target-skill mutation); optional hand-off to Lane A.

## 3. Resources to add

- `references/skill-benchmark/*` (operator guide, evaluator/scoring contract, scenario-authoring guide).
- `assets/skill-benchmark/*` (scenario-fixture schema, report template, default profile).
- `scripts/skill-benchmark/*` (dispatch capture, scorer, report builder) + loop-host mode wiring.

Per the fixed per-lane layout: Lane C adds exactly one subdir per area (`skill-benchmark/`) under `references/`/`assets/`/`scripts/`; genuinely cross-lane logic goes in `shared/`. The Phase 002 playbook fixes the shared-vs-Lane-C module split.

## 4. Success criteria

- Lane C runs end-to-end on ≥1 real target skill and emits a ranked, actionable Skill Benchmark Report.
- Lane A/B behavior unchanged without the mode flag (regression check).
- Repeatability evidence (variance across runs) is captured, mirroring Lane B stability.
- `validate.sh --strict` green for this phase.

## 5. Out of scope

Remediating flagged skills (NG1). Replacing `sk-doc` validation or manual playbooks (NG2). `deep-loop-runtime` changes (NG3).
