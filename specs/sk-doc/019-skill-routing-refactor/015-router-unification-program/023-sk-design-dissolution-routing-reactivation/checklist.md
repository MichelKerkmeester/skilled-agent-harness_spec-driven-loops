---
title: "QA Checklist: sk-design Dissolution — Compiled-Routing 6-Hub Re-Activation"
description: "Acceptance checklist with per-item evidence for the 7->6 topology migration and 6-hub freshness ceremony."
trigger_phrases:
  - "sk-design dissolution routing checklist"
importance_tier: "normal"
contextType: "checklist"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/015-router-unification-program/023-sk-design-dissolution-routing-reactivation"
    last_updated_at: "2026-08-22T08:55:00Z"
    last_updated_by: "claude-code"
    recent_action: "Acceptance items verified green"
    next_safe_action: "validate --strict, commit, push v4 + main"
    blockers: []
    key_files:
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "023-sk-design-dissolution-routing-reactivation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Verification Checklist: sk-design Dissolution — Compiled-Routing 6-Hub Re-Activation

---

<!-- ANCHOR:protocol -->
## Verification Protocol

Each item is marked complete only with evidence specific to that item. Evidence text is never reused across items.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Baseline captured before any change [evidence: `evidence/baseline.txt` — 7/7 stale, 2 compile-error, guard failures:7, `compiled-route-manifest.test.cjs` 16 fail / 26 pass]
- [x] CHK-002 [P1] Root cause confirmed against real symptom [evidence: `sk-design` has 0 files in git HEAD; only 6 hubs carry `mode-registry.json`; engine `HUB_CHILD` still listed 7 → every `resolveRoute` returned null]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-003 [P1] Only hub-topology constants changed; no engine algorithm modified [evidence: diff limited to `HUB_CHILD`/`DEFAULT_ON_HUBS`/`HUBS`/advisor flag set/cutover order + retired subtrees; `resolve.cjs`/`compiled-route.cjs` algorithms untouched]
- [x] CHK-004 [P2] mcp-tooling coupling severed cleanly [evidence: `crossHubPairing` emptied to `{}` in 3 entries, transport prose softened, harness judgment inputs dropped with a durable WHY comment and no ephemeral ids]
- [x] CHK-005 [P1] Topology lockstep across all four `DEFAULT_ON_HUBS` copies + `COMPILED_ROUTING_HUBS`/`HUB_CHILD` [evidence: `compiled-routing-foundation.vitest.ts` 34/34 pass]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-006 [P0] Original failing suite goes green [evidence: `compiled-route-manifest.test.cjs` 42/42 pass, was 16 fail / 26 pass]
- [x] CHK-007 [P1] Cross-system routing suites pass [evidence: foundation + flag-propagation vitest 34/34; advisor golden-prompts 10/10]
- [x] CHK-008 [P0] Whole node gate green [evidence: `run-node-tests.mjs` — node:test 794 pass / 0 fail; vitest 101 pass / 0 fail]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-009 [P0] All 6 surviving hubs refresh fresh [evidence: `compiled-route-manifest.cjs refresh --hub <h>` ×6 → `fresh:true`; 6 canaries `validate-canary.cjs` REAL-GREEN]
- [x] CHK-010 [P0] Fleet promoted and verified [evidence: fresh no-prior `compiled-route-sync` build = 55 files; `--verify` all 6 resolve, 0 reads under `.opencode/specs`; `compiled-route-guard.cjs` exit 0, 6/6 fresh]
- [x] CHK-011 [P0] Zero behavioral route-gold delta [evidence: `evidence/p2-canary-adjudication.txt` — per-scenario HEAD-vs-regen diff of action/selectionKind/targets/intents, no movement across all 6]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-012 [P1] Scorer digests never re-pinned [evidence: only `AUTHORED_*_DIGESTS` source pins updated (mechanical); `PROTECTED_DIGESTS` untouched across all canaries]
- [x] CHK-013 [P2] No manifest hand-edited [evidence: every manifest re-mint via the shipped `refresh`/`compiled-route-sync` verbs; no direct JSON edit]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-014 [P2] Delta adjudication recorded [evidence: `009-parent-hub-rollout/ceremony-deltas.md` — "Adjudication (2026-08-22) — sk-design hub dissolution" section: REMOVE sk-design, ACCEPT mcp-tooling zero-delta, MECHANICAL re-pins]
- [x] CHK-015 [P2] Decisions recorded [evidence: `decision-record.md` ADR-001..003]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-016 [P2] Retired sk-design subtrees removed [evidence: authored `009-parent-hub-rollout/006-sk-design` + `013-live-activation/activation/sk-design` git-rm'd; runtime copies removed by the fresh no-prior build]
- [x] CHK-017 [P2] Packet metadata generated [evidence: `description.json` via `generate-description.js`; `graph-metadata.json` via `backfill-graph-metadata.js`]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

All acceptance items pass with item-specific evidence. `validate --strict` reports Errors: 0. Remaining: commit by explicit pathspec, push to v4, cherry-pick to main.
<!-- /ANCHOR:summary -->
