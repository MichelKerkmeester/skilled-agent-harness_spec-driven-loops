---
title: "Tasks: sk-design Dissolution — Compiled-Routing 6-Hub Re-Activation"
description: "Executable task checklist with per-step evidence for the 7->6 topology migration and 6-hub freshness ceremony."
trigger_phrases:
  - "sk-design dissolution routing tasks"
importance_tier: "normal"
contextType: "tasks"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/015-router-unification-program/023-sk-design-dissolution-routing-reactivation"
    last_updated_at: "2026-08-22T08:56:00Z"
    last_updated_by: "claude-code"
    recent_action: "P1-P4 tasks complete with evidence"
    next_safe_action: "validate --strict, commit, push v4 + main"
    blockers: []
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "023-sk-design-dissolution-routing-reactivation"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Tasks: sk-design Dissolution — Compiled-Routing 6-Hub Re-Activation

---

<!-- ANCHOR:notation -->
## Task Notation

`[ ]` todo · `[x]` done (evidence required) · `[!]` blocked.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T-00 Capture pre-change status + guard + failing-test baseline [evidence: `evidence/baseline.txt` — 7/7 stale, 2 compile-error, guard failures:7, manifest test 16 fail/26 pass]
- [x] T-01 Author packet docs (spec/plan/tasks) [evidence: this folder]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T-02 Drop sk-design from runtime + authored `HUB_CHILD`, `DEFAULT_ON_HUBS`, sync/guard `HUBS`, advisor flag, cutover order
- [x] T-03 Empty mcp-tooling `crossHubPairing` + drop harness judgment inputs (authored + runtime `build-artifacts.cjs`)
- [x] T-04 Retire authored `006-sk-design/` + `activation/sk-design/`; runtime retired via fresh build
- [x] T-05 GATE: `compiled-routing-foundation.vitest.ts` lockstep, `DEFAULT_ON_HUBS.size===6` [evidence: 34/34 pass]
- [x] T-06 Regenerate 6 hubs' compiled artifacts + `refresh` ×6 → fresh:true
- [x] T-07 Re-baseline 6 canaries; re-pin drifted `AUTHORED_*_DIGESTS`; adjudicate deltas in `009-parent-hub-rollout/ceremony-deltas.md`
- [x] T-08 Fresh no-prior `compiled-route-sync` build (55 files) → `--verify` all 6 resolve
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T-09 `compiled-route-guard.cjs` exit 0, 6/6 fresh
- [x] T-10 Update `compiled-route-manifest.test.cjs` + foundation vitest 7→6 → manifest 42/42
- [x] T-11 foundation + flag-propagation + golden-prompts vitest → 34/34 + 10/10
- [x] T-12 Zero behavioral route-gold delta (HEAD-vs-regen) [evidence: `evidence/p2-canary-adjudication.txt`]
- [x] T-13 Whole gate `run-node-tests.mjs` → node:test 794 pass / 0 fail; vitest 101/0
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

All 6 hubs resolve compiled and fresh; guard exit 0; the original 16 subtests green; whole node gate 0 fail; every delta adjudicated with zero behavioral movement; no manifest hand-edited; no engine algorithm changed. Remaining: `validate --strict`, commit by explicit pathspec, push v4 + cherry-pick main.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- `spec.md` — requirements REQ-001..007.
- `009-parent-hub-rollout/ceremony-deltas.md` — 2026-08-22 dissolution adjudication.
- `implementation-summary.md` — evidence table.
- Precedent: `034-compiled-routing-fleet-freshness`.
<!-- /ANCHOR:cross-refs -->
