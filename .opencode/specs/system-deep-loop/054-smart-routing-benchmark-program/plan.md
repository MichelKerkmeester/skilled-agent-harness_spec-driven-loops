---
title: "Implementation Plan: Smart-Routing Benchmark Program"
description: "Phased plan (P0-P8) to build per-child + per-hub smart-routing benchmarks across sk-code and system-deep-loop, in a deterministic router Mode-A gate corroborated by a live Mode-B pass, on a reused Lane C engine."
trigger_phrases:
  - "smart routing benchmark plan"
  - "P0 P8 routing phases"
  - "mode-a mode-b plan"
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
      - ".opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/"
      - ".opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/sk-code-router-sync.vitest.ts"
      - ".opencode/skills/sk-code/shared/references/smart_routing.md"
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
# Implementation Plan: Smart-Routing Benchmark Program

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

This plan reuses the existing Lane C benchmark engine, adds per-child routers and gold where missing, and keeps the sk-code parent as a guarded union projection.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- Drift guard stays green before downstream benchmark capture.
- Mode-A remains deterministic and byte-identical where baseline invariants apply.
- Mode-B remains advisory and documented as a circularity meter.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

The sk-code parent is a projection of child routers plus a parent-owned tier; system-deep-loop children keep owning their routers directly.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

P0 through P8 remain the execution sequence: reconcile drift, ratify decisions, add child routers and gold, capture Mode-A and Mode-B evidence, then synthesize CI follow-up.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- Router replay provides the offline Mode-A gate.
- Live `cli-opencode` runs provide advisory Mode-B corroboration.
- The drift guard verifies projection, parseability, and path existence.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Status | Impact if Blocked |
|------------|--------|-------------------|
| Held `deep-loop-workflows -> system-deep-loop` migration | Blocked | Defers `deep-ai-council` normalization and deep-loop hub Type-2 route-gold |
| Concurrent `mode-registry.json` edits | Blocked | Defers deep-loop hub Type-2 capture |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A phase regresses the byte-identical sk-code hub baseline, breaks router parseability, or touches migration-entangled files.
- **Procedure**: Revert only the current phase's routing/gold/baseline changes and keep the deferred migration-gated items unchanged until their blockers clear.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:critical-path -->
## 8. CRITICAL PATH

P0 (drift reconcile) → P3 (parent projection + drift guard) → P6 (Mode-A capture). The byte-identical sk-code hub baseline gate sits on this path: nothing downstream of P3 is trustworthy until the projection is proven stable.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## 9. MILESTONES

| Milestone | Signal | State |
|-----------|--------|-------|
| M1 — architecture + guard | drift guard 7/7 green | ✅ |
| M2 — 7/8 children Mode-A PASS | aggregates 84–100 captured | ✅ |
| M3 — Mode-B corroboration | all 7 un-gated children scored live | ✅ |
| M4 — deep-ai-council + deep-loop hub Type-2 | both scored, both modes | ✅ |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:dependency-graph -->
## 10. DEPENDENCY GRAPH

The un-gated core (P0→P6 for 7 children + Mode-B) has no external dependency. The remaining targets depend on one external event: the held `deep-loop-workflows -> system-deep-loop` content migration reaching origin, which unblocks both `deep-ai-council` normalization and the `system-deep-loop` hub Type-2 route-gold (the latter also coordinates with the concurrently-edited `mode-registry.json`).
<!-- /ANCHOR:dependency-graph -->

---

## Approach

Reuse the Lane C skill-benchmark engine as-is (it already scores Type-1 intra-routing and Type-2 discoverability). Add per-child parseable routers + non-fabricated gold, keep the sk-code parent as a drift-guarded union projection, and score each target in a deterministic router Mode-A (CI gate) corroborated by a live Mode-B (advisory). Implementation is GPT-5.5-fast (via `cli-opencode`) with Sonnet-5 verification, except the drift guard and parent projection (correctness-critical), authored directly.

**Engine (no code change)**: `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/{run-skill-benchmark,router-replay,score-skill-benchmark,d5-connectivity,load-playbook-scenarios,contamination-lint,advisor-probe,build-report,live-executor,executor-dispatch}.cjs`

**Invocation**: `node .../scripts/shared/loop-host.cjs --mode=skill-benchmark --skill=<root> --outputs-dir=<path> [--trace-mode router|live] [--fixtures-dir <dir>] [--advisor-mode=python]`

---

## Phases (entry → exit)

| Phase | Description | Status |
|-------|-------------|--------|
| **P0** | Drift reconciliation — fix gold↔disk path drift; capture the `sk-code/benchmark/router-baseline/` invariant | ✅ Done |
| **P1** | Architecture ADR — ratify the six decisions; enumerate the parent-owned-tier allowlist (this packet's `decision-record.md`) | ✅ Done |
| **P2** | Per-child router creation ×8 — webflow/opencode inline slice, code-quality thin, code-review tighten, deep-ai-council normalize, deep-{research,review,improvement} verify parseable | ✅ Done (8/8) |
| **P3** | Parent projection + drift guard (sk-code) — rewrite parent `RESOURCE_MAP` as the union; extend the guard | ✅ Done |
| **P4** | Per-child Type-1 gold ×8 — sk-doc-shape playbooks, non-empty `expected_resources` | ✅ Done (8/8) |
| **P5** | Parent Type-2 route-gold ×2 — sk-code characterized + live-corroborated; deep-loop hub route-gold scored | ✅ Done |
| **P6** | Mode-A runs — capture reproducible baselines | ✅ Done (8 children + both hubs) |
| **P7** | Mode-B runs — live corroboration; A↔B divergence advisory | ✅ Done — 8 children + both hubs (full 20-run matrix) |
| **P8** | Synthesis / CI — circularity meter; roll up baselines; runbook (this packet) | ✅ Done (CI job wiring is the only follow-up) |

---

## Key architecture decision (load-bearing)

`sk-code` centralizes resource routing in the parent `smart_routing.md`; `system-deep-loop` has none (its children already own routers). So the decentralize work is **sk-code-only**: move each surface child's slice into its `SKILL.md`, rewrite the parent as the union, and enforce `parent == union(children) + tier` with the drift guard. The highest-value guardrail is that the sk-code hub Mode-A report stays **byte-identical** to the P0 baseline after the P3 rewrite. See `decision-record.md` ADR-001..ADR-006.

---

## Verification (per target, end-to-end)

1. Drift guard green (`parent == union(children) + tier`; all paths on disk).
2. `verdict` not `BLOCKED-BY-STRUCTURE/-REGISTRY/-ROUTING`; `routerParseable: true`.
3. Non-empty gold: every scenario has `expected_resources`.
4. Reproducible Mode-A (byte-identical re-run); sk-code hub run byte-identical to the P0 baseline.
5. Mode-B corroboration captured; divergence logged advisory (circularity meter).
6. Contamination-lint advisory-clean (public prompts leak no paths).

---

## AI Execution Protocol

This program runs a two-agent loop (GPT-5.5-fast implements via `cli-opencode`; Sonnet-5/Opus verifies), so the execution discipline is explicit.

### Pre-Task Checklist
- Read the target child `SKILL.md` §2b router (the gold source) before authoring any gold.
- Confirm the child paths referenced exist on disk (the drift guard also enforces this).
- Confirm the working-tree file is NOT migration-entangled before committing (mtime + `git diff` vs origin).

### Execution Rules
- TASK-SCOPE: only the path-scoped files for the current phase are added; the blast-radius gate must print "clean".
- TASK-SEQ: P0 (drift reconcile) precedes all downstream phases; P3 (projection) precedes P6 capture.
- Correctness-critical steps (drift guard, parent projection) are authored directly, not delegated.

### Status Reporting Format
- Each benchmark run reports `verdict` + `aggregate` + `D1intra`; each commit reports the blast-gate file count and the pushed SHA.
- A→B divergence is reported as advisory (circularity meter), never as a gate failure.

### Blocked Task Protocol
- On a BLOCKED gate (migration entanglement, concurrent-dirty file), DEFER the item, record the blocker in `tasks.md` + the continuity block, and continue with un-gated work — never force-commit over a concurrent change.

## Gated remainder (migration-dependent)

- `deep-ai-council` router normalization + its Type-1 gold — entangled with the held `deep-loop-workflows -> system-deep-loop` migration.
- `system-deep-loop` hub Type-2 route-gold (P5) — coordinates with the concurrently-edited `mode-registry.json`.
- Full 10-config Mode-B matrix (P7) — optional; run once the deep-loop hub is unblocked, else keep the representative-per-family sample.
