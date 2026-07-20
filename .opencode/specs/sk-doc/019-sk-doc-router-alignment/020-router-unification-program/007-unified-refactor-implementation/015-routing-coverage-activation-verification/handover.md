---
title: "Handover: Routing Coverage, Activation & Verification (015)"
description: "Detailed resume state for the 015 program — the verified P0-foundation reframing, per-child status, the resume ladder, and the exact next action. Companion to goal.md (the standing goal) and 001-research/review-v1.md (the authoring contract)."
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-sk-doc-router-alignment/020-router-unification-program/007-unified-refactor-implementation/015-routing-coverage-activation-verification"
    last_updated_at: "2026-07-20T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored 015 parent + research child; dispatched 002-011 child-spec authoring"
    next_safe_action: "Validate 002-011 specs, then implement in DAG order from 002"
    blockers: []
    key_files:
      - "goal.md"
      - "spec.md"
      - "001-research/review-v1.md"
      - "001-research/synthesis-v1.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "pending"
      parent_session_id: null
    completion_pct: 25
    open_questions: []
    answered_questions:
      - "Is default-on a switch-flip? No — it is a structural no-op today (bridge drops the decision, flag stripped); the real work is the P0 activation foundation."
---

# Handover — Routing Coverage, Activation & Verification (015)

## What this session did

Received a directive to research and then build the full coverage + activation + verification of the compiled skill-router. Ran a **25-iteration deep-research pass** (10 SOL-high / 3 SOL-ultra / 5 TERRA-xhigh via cli-codex; 2 GLM-max / 5 MiniMax via cli-opencode; 1 codex ∥ 1 opencode; no early convergence) → 143 findings. A **fresh Opus** synthesized to 47 (`001-research/synthesis-v1.md`), a **Sonnet** adversarially verified (all 8 spine claims CONFIRMED; `verification-v1.md`), and the orchestrator reconciled into the authoring contract (`review-v1.md`). Authored the 015 lean phase-parent + the 001-research child, then dispatched the 002-011 child-spec authoring.

## The verified spine (do NOT re-litigate — CONFIRMED against live source)

1. Default-on is a **structural no-op end-to-end**: `advisor-recommend.ts:371` attaches `compiledRoute` additively; `mk-skill-advisor-bridge.mjs:539-551` rebuilds recommendations and drops it (0 grep hits); the CLI `subprocess.ts` interface has no such field.
2. The flag is stripped from BOTH `CHILD_ENV_ALLOWLIST` sets (launcher `:99`, bridge `:58`) — it can't reach the daemon.
3. Runtime reads resolver/activation/engines from the mutable spec tree; three nested silent catches; fails legacy fleet-wide with no telemetry. ADR-003 promotion = a closure move.
4. `HUB_CHILD` is an engine-dispatch table (`011-runtime-engine/lib/compiled-route.cjs:23-31,35-62`; `loadHubEngine` requires `006-*`), not a removable allowlist. ADR-002 must split eligibility from engine-discovery.
5. Bi-state flag; no per-hub serving-status; drifted==broken; **all 7 activation manifests already `servingAuthority: compiled`** → P4 must be per-hub cohort-staged.
6. The four named coverage gaps are downstream of the P0 foundation (a P3 join gate).

Corrections/omissions folded into the plan are in `review-v1.md` §2-3 (notably: the CF-BM-4 verdict fix goes in the **non-frozen** `run-skill-benchmark.cjs:300-310`, never the frozen scorer; the 009 Phase-Map has 4 children with 1 listed, mcp-code-mode has no dir; add a durable no-spec-import CI rule; Lane C must test flag unset/0/invalid).

## Resume ladder (how to continue)

1. Read `goal.md` (the destination + invariants) and this handover.
2. Read `001-research/review-v1.md` (the authoring contract) + `synthesis-v1.md` §5-6 (the P0→P4 DAG + child breakdown).
3. Validate the child specs (below). Then implement in DAG order.

## Per-child status

| Child | Status |
|-------|--------|
| 001-research | Spec authored; supporting docs in flight (research is Complete) |
| 002-runtime-promotion-and-status-foundation (L3, P0) | Spec authoring in flight (opus) — the foundation everything depends on |
| 003-flag-propagation-and-effective-consumption (L3, P1) | Spec authoring in flight (opus) |
| 004-benchmark-compiled-lane-c (L2, P1) | Spec authoring in flight |
| 005-playbooks-and-luna-acceptance (L2, P2) | Spec authoring in flight |
| 006-feature-catalogs (L2, P3) | Spec authoring in flight |
| 007-durable-archiving-and-serving-snapshot (L2, P2) | Spec authoring in flight |
| 008-sk-code-alignment-and-drift-guards (L2, P3) | Spec authoring in flight |
| 009-sk-doc-template-alignment (L2, P3) | Spec authoring in flight |
| 010-rollback-audit-and-non-hub-policy (L2, P1) | Spec authoring in flight |
| 011-activation-cutover-p4 (L3, P4) | Spec authoring in flight (opus) — depends on all |

## Exact next action

1. When the six authoring agents return: `validate.sh --strict` each of 002-011 + 001-research → fix to Errors:0; run `generate-description.js`/`backfill-graph-metadata` per child + refresh the 015 parent `children_ids`; commit.
2. Then IMPLEMENT in DAG order: **002 first** (the P0 foundation), then 003 + 004 + 006 + 007 + 008 + 009 (consume 002, parallelizable), 010 (P1), 005 (P2), and 011 (P4) last. Each behind the still-off flag, with its named rollback, clearing every standing invariant.
3. Verify per `goal.md` §5 (tests + drift guard + compiled Lane C parity + LUNA playbook + durable archive).

## Guardrails (repeat at every step)

Compiled == legacy on routing fields; the 3 frozen scorer files never edited (SHA-256 pinned); every step names a byte-exact/flag rollback; no runtime read under `.opencode/specs`; the repo default does not flip until P0-P3 are green per-hub. Work only in the worktree; merge is operator-gated.
