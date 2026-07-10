---
title: "Task Breakdown: Smart-Routing Benchmark Program"
description: "Task-level status for the smart-routing benchmark program across the sk-code and system-deep-loop hubs, with commit evidence for shipped work and explicit gates on the deferred remainder."
trigger_phrases:
  - "smart routing benchmark tasks"
  - "routing benchmark status"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/054-smart-routing-benchmark-program"
    last_updated_at: "2026-07-08T20:40:28Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Completed the full 20-run routing benchmark matrix"
    next_safe_action: "Wire the Mode-A configs + drift guard into a CI job (only remaining follow-up)"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/sk-code-router-sync.vitest.ts"
      - ".opencode/skills/sk-code/shared/references/smart_routing.md"
      - ".opencode/skills/system-deep-loop/{deep-research,deep-review,deep-improvement}/manual_testing_playbook/10--intra-routing-recall/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session_01Ht7J9NZTEBBXwzTeNvras9"
      parent_session_id: null
    completion_pct: 95
    open_questions:
      - "Trim Mode-B to representative-per-family permanently, or run all 10 once the deep-loop hub unblocks?"
    answered_questions:
      - "Both hubs, each child its own router+gold, both modes — locked before build"
---
# Task Breakdown: Smart-Routing Benchmark Program

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

Legend: `[x]` done · `[~]` partial/representative · `[ ]` gated/deferred.
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- P0 reconciles drift and captures the baseline invariant.
- P1 ratifies the architecture ADRs.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- P2 through P5 add or verify child routers, parent projection, Type-1 gold, and route-gold characterization.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- P6 through P8 capture Mode-A, Mode-B, circularity-meter, and CI follow-up evidence.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Full 20-run matrix complete: all 8 children + both hubs, both modes.
- [x] deep-ai-council un-gated by committing origin-prose + INTENT-only (disjoint from the concurrent migration).
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Implementation Summary**: See `implementation-summary.md`
<!-- /ANCHOR:cross-refs -->

## P0 — Drift reconciliation
- [x] Fix `sk-code/manual_testing_playbook/01--surface-detection/webflow-detection.md` nonexistent checklist path (→ `code-webflow/assets/webflow-verification_checklist.md`) — commit `ed16475077`
- [x] Capture the `sk-code/benchmark/router-baseline/` invariant (hub Mode-A 85, no volatile timestamp) — commit `ed16475077`

## P1 — Architecture ADR
- [x] Ratify ADR-001..ADR-006; enumerate the parent-owned-tier allowlist (`decision-record.md`)

## P2 — Per-child routers (×8)
- [x] `code-opencode` inline §2b router (6 intents, 30 paths) — commit `2b0ec3de0d`
- [x] `code-webflow` inline §2b router (13 intents) — commit `2b0ec3de0d`
- [x] `code-quality` thin §2b router (QUALITY → checklist) — commit `5fcd621310`
- [x] `code-review` gold tightened to exact `assets/*` paths
- [x] `deep-research` / `deep-review` / `deep-improvement` routers verified parseable (already canonical)
- [x] `deep-ai-council` `INTENT_MODEL` → canonical `INTENT_SIGNALS` — committed clean (origin prose + INTENT block only, via `hash-object` blob; disjoint from the concurrent migration)

## P3 — Parent projection + drift guard (sk-code)
- [x] Rewrite parent `smart_routing.md` `RESOURCE_MAP` as `union(children) + tier`
- [x] Extend `sk-code-router-sync.vitest.ts` (surface projection, path-exists, self-parse) — 7/7 green, commit `3137fb72d2`
- [x] sk-code hub Mode-A byte-identical to the P0 baseline (invariant held)

## P4 — Per-child Type-1 gold (×8)
- [x] `code-opencode` playbook (8 scenarios) → Mode-A PASS 84 — commit `79812f3393`
- [x] `code-quality` playbook (1 scenario) → Mode-A PASS 89 — commit `c72367b125`
- [x] `code-webflow` playbook (13 scenarios) → Mode-A PASS 91 — commit `9ff574a5dd`
- [x] `code-review` playbook (7 scenarios) → Mode-A PASS 100 — commit `97c0f01d30`
- [x] `deep-research` playbook (8) → PASS 91 · `deep-review` (4) → PASS 93 · `deep-improvement` (10) → PASS 91 — commit `3a0c10020f`
- [x] `deep-ai-council` gold (10 scenarios, one per INTENT_SIGNALS key) → Mode-A PASS 92 (D1intra 100)

## P5 — Parent Type-2 route-gold (×2)
- [x] sk-code: characterized as a Mode-B / D1-inter advisor-probe measurement (strict `scoreHubRoute` fixtures are unscoreable in router mode — contamination bans hub keywords), and **measured live** — sk-code hub Mode-B CONDITIONAL 67 (Mode-A 85, gap 18)
- [x] `system-deep-loop` hub route-gold — scored both modes (Mode-A PASS 100, Mode-B PASS 93) against the current working tree; concurrent `mode-registry.json` edits did not block a clean run

## P6 — Mode-A runs
- [x] 4 sk-code children baselines captured — commit `2825083449`
- [x] 3 deep-loop children baselines captured — commit `3a0c10020f`
- [x] sk-code hub baseline (P0)
- [x] `system-deep-loop` hub Mode-A — PASS 100 (20 scenarios), captured under `system-deep-loop/benchmark/router-mode-a/`
- [x] `deep-ai-council` Mode-A — PASS 92, captured under `deep-ai-council/benchmark/router-mode-a/`

## P7 — Mode-B runs (advisory)
- [x] Live pipeline proven (`scoringMethod: mode-b-live`, `traceMode: live`)
- [x] All 7 un-gated children scored live — captured under each child's `benchmark/live-mode-b/`: deep-research 80, deep-review 71, deep-improvement 62, code-webflow 57, code-opencode 56, code-quality 31, code-review 0
- [x] sk-code hub Mode-B — CONDITIONAL 67 (30 scenarios), captured under `sk-code/benchmark/live-mode-b/`
- [x] `deep-ai-council` Mode-B — CONDITIONAL 76 (rr 0.91); `system-deep-loop` hub Mode-B — PASS 93 (20 scenarios)

## P8 — Synthesis / CI
- [x] Circularity meter published (Mode-A − Mode-B per target) — `decision-record.md` ADR-005 + `implementation-summary.md`
- [x] Baselines rolled up into this packet
- [ ] Wire the Mode-A configs + drift guard into CI — **follow-up**
