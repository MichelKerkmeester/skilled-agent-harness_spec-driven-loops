---
title: "Implementation Summary: sk-design Dissolution — Compiled-Routing 6-Hub Re-Activation"
description: "Complete: sk-design removed from the compiled-routing topology (7->6), mcp-tooling's inert sk-design judgment coupling severed, all 6 surviving hubs re-minted and re-promoted, guard exit 0 and the whole node gate green with zero behavioral routing delta."
trigger_phrases:
  - "sk-design dissolution routing summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/015-router-unification-program/023-sk-design-dissolution-routing-reactivation"
    last_updated_at: "2026-08-22T08:56:00Z"
    last_updated_by: "claude-code"
    recent_action: "P1-P5 complete: topology 7->6, freshness ceremony, promote, whole gate 794/0, validate Errors:0"
    next_safe_action: "Commit by explicit pathspec, push v4 + cherry-pick main"
    blockers: []
    key_files:
      - "spec.md"
      - "evidence/baseline.txt"
      - "evidence/p2-canary-adjudication.txt"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "023-sk-design-dissolution-routing-reactivation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "mcp-tooling coupling: removed (crossHubPairing emptied), not repointed — sk-design-md-generator is a standalone skill with no mode-registry the compiler can consume"
---
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Implementation Summary: sk-design Dissolution — Compiled-Routing 6-Hub Re-Activation

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Status** | Complete |
| **Created** | 2026-08-22 |
| **Track** | sk-doc |
| **Level** | 2 |
| **Completion** | 100% — all gates green; validate Errors:0; commit/push remaining |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The `sk-design` hub was dissolved from the skill tree after this program shipped, leaving the compiled-routing engine on a stale 7-hub topology. The whole fleet had gone red — `compiled-route-manifest.test.cjs` failed 16 subtests because every hub's `resolveRoute` returned null (5 stale-manifest; `sk-design` + `mcp-tooling` `compile-error` on the deleted sk-design source). This packet migrated the engine to the 6 surviving hubs and re-ran the shipped freshness ceremony.

- **Topology 7→6:** `sk-design` removed from runtime + authored `HUB_CHILD` (`compiled-route.cjs`), runtime + authored `DEFAULT_ON_HUBS` (`resolve.cjs`), `compiled-route-sync.cjs` and `compiled-route-guard.cjs` `HUBS`, advisor `COMPILED_ROUTING_HUBS` + `DEFAULT_ON_HUBS` (the compiled dist was already at 6; the source now matches), and the cutover-controller `RECOMMENDED_ORDER`. The `009-parent-hub-rollout/006-sk-design` and `013-live-activation/activation/sk-design` subtrees were retired.
- **mcp-tooling coupling severed:** its snapshot enumerated `sk-design/{SKILL.md,mode-registry.json}` as a cross-hub judgment registry (the ENOENT). Its live registry actually paired transports to `sk-design-md-generator`, a standalone skill with no `mode-registry.json` the compiler can consume, and the pairing was already inert for routing. The `crossHubPairing` map was emptied and the harness judgment inputs dropped; mcp-tooling compiles with a byte-identical route-gold.
- **Freshness ceremony:** each authored manifest refreshed to its current compiled identity via the shipped `refresh` verb (no manifest hand-edited); all 6 canaries re-baselined GREEN after regenerating compiled artifacts and re-pinning drifted `AUTHORED_*_DIGESTS`; the serving root rebuilt fresh (55 files); `--verify` reports all 6 resolve with 0 reads under `.opencode/specs`.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Followed the `034-compiled-routing-fleet-freshness` precedent and its hard rules: shipped `refresh`/`sync` verbs only (no hand-edited manifest), every canary delta adjudicated in writing (`009-parent-hub-rollout/ceremony-deltas.md`, 2026-08-22) before gold moved, every gate checked by exit code. The only engine code changed was the hub-topology constants. The over-a-prior build cannot remove a hub (it ENOENT'd on the retired closure, then rejected sk-design's leftover manifest as a conflicting external one), so the serving root was rebuilt via a no-prior build — safe because the fleet served all-legacy and the prior root is git-tracked.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- **ADR-001** Remove sk-design from the topology rather than park it — a hub with no skill source cannot be compiled or legacy-routed.
- **ADR-002** Sever the mcp-tooling judgment coupling (empty `crossHubPairing`, keep prose) rather than repoint — the target is a standalone skill with no consumable mode-registry, and the pairing was already inert.
- **ADR-003** Re-mint via shipped verbs and rebuild the serving root fresh (no-prior) — the sync tool has no first-class hub-removal path.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Baseline (pre-change) | 7/7 stale, 2 compile-error, guard failures:7, manifest test 16 fail/26 pass (`evidence/baseline.txt`) |
| Topology lockstep | foundation + flag-propagation vitest 34/34 pass |
| 6 manifests refreshed | all `fresh:true`, identities match `compiledRoute` |
| 6 canaries | all GREEN/real-green (byte-identical recompile) |
| Behavioral route-gold delta | **zero** across all 6 (`evidence/p2-canary-adjudication.txt`) |
| Promote + verify | 55 files; all 6 hubs resolve; 0 reads under `.opencode/specs` |
| Guard | exit 0, 6/6 fresh |
| Original failing test | `compiled-route-manifest.test.cjs` 42/42 |
| Advisor golden prompts | 10/10 |
| Whole node gate | node:test 794 pass / 0 fail; vitest 101 pass / 0 fail |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- No-prior build retains no rollback dir; git is the rollback (`git restore .opencode/bin/lib/compiled-routing`).
- `compiled-route-sync` still lacks a first-class "retire a hub" path; the clean-root rebuild is the current workaround.
- The mcp-tooling→sk-design-md-generator design-reference handoff remains documented in the transport-axis prose only (not a compiled judgment pairing).
<!-- /ANCHOR:limitations -->

