---
title: "Handover: Routing Coverage, Activation & Verification (015)"
description: "Detailed resume state for the 015 program — the verified P0-foundation reframing, per-child status, the resume ladder, and the exact next action. Companion to goal.md (the standing goal) and 001-research/review-v1.md (the authoring contract)."
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/020-router-unification-program/007-unified-refactor-implementation/015-routing-coverage-activation-verification"
    last_updated_at: "2026-07-20T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Implemented + committed all ten children 002-011 behind the off flag; ran the closeout (status reconciliation + goal/handover completion update)"
    next_safe_action: "Operator: merge the worktree branch to v4; implement 013/014 to clear the P3 join gate; then the per-hub staged flip via 011's controller"
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
    completion_pct: 90
    open_questions: []
    answered_questions:
      - "Is default-on a switch-flip? No — it is a structural no-op today (bridge drops the decision, flag stripped); the real work is the P0 activation foundation."
      - "Is the build done? Yes — all ten children 002-011 are implemented and committed behind the still-OFF flag (validate --strict Errors:0, routing byte-identical to legacy, frozen scorer SHA-256 unchanged)."
      - "Is the repo default flipped? No, by design — honestly gated on siblings 013/014 and the P3 coverage-closure join gate (011 reports all 7 hubs BLOCKED). The flip is an operator decision after those land."
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

All implemented and committed on `sk-doc/0089-default-routing-cutover`, behind the still-OFF flag, `validate.sh --strict` Errors:0, routing byte-identical to legacy, frozen scorer SHA-256 unchanged.

| Child | Status |
|-------|--------|
| 001-research | Complete — 25 iterations, fresh-Opus synthesis + Sonnet adversarial verification + orchestrator review |
| 002-runtime-promotion-and-status-foundation (L3, P0) | Implemented + committed `4153cbebd8` — the P0 foundation everything consumes |
| 003-flag-propagation-and-effective-consumption (L3, P1) | Implemented + committed `a1cdb65d90` |
| 004-benchmark-compiled-lane-c (L2, P1) | Implemented + committed `8532c4b64b` |
| 005-playbooks-and-luna-acceptance (L2, P2) | Implemented + committed `d590af12be` — real GPT-5.6-LUNA-HIGH routing evidence archived |
| 006-feature-catalogs (L2, P3) | Implemented + committed `8532c4b64b` |
| 007-durable-archiving-and-serving-snapshot (L2, P2) | Implemented + committed `2a39ecb9a0` |
| 008-sk-code-alignment-and-drift-guards (L2, P3) | Implemented + committed `a1cdb65d90` |
| 009-sk-doc-template-alignment (L2, P3) | Implemented + committed `8532c4b64b` |
| 010-rollback-audit-and-non-hub-policy (L2, P1) | Implemented + committed `a1cdb65d90` |
| 011-activation-cutover-p4 (L3, P4) | Implemented (controller) + committed `3d08302771` — dry-run-proven; P3 join gate reports all 7 hubs BLOCKED (honest, gated on 013/014); repo default NOT flipped |

## Exact next action (autonomous build DONE — remainder is operator-gated)

The full build is complete: all ten children 002-011 implemented + committed (table above), each independently verified before its commit (frozen scorer SHA-256 unchanged, routing byte-identical, behind the off flag, validate --strict Errors:0). What remains is not autonomous work under this program — it is operator-gated:

1. **Merge** the worktree branch `sk-doc/0089-default-routing-cutover` into `skilled/v4.0.0.0`.
2. **Implement siblings 013/014** (create-skill onboarding + benchmark alignment) — the only inputs 011's P3 join gate is still BLOCKED on. Until they land, the join gate correctly reports all 7 hubs BLOCKED and the default must stay OFF.
3. **Run the full 7-hub × {routing, holdout} LUNA-HIGH sweep** — 005 archived a 3-scenario sample that already proves the mechanism; this is the bounded full-coverage follow-up.
4. **Then the per-hub cohort-staged flip** via 011's controller (`011-activation-cutover-p4/controller/cutover-controller.cjs`), with `SPECKIT_COMPILED_ROUTING=0` as the documented fleet-wide kill-switch. This is the P4 "enabled by default" outcome — an operator decision, never an autonomous flip.

## Guardrails (repeat at every step)

Compiled == legacy on routing fields; the 3 frozen scorer files never edited (SHA-256 pinned); every step names a byte-exact/flag rollback; no runtime read under `.opencode/specs`; the repo default does not flip until P0-P3 are green per-hub. Work only in the worktree; merge is operator-gated.
