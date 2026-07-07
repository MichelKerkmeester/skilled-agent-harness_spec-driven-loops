---
title: "QA Checklist: Phase 8 — routing benchmark and review"
description: "Verification checklist for the routing benchmark, the family deep-review, the harness re-layer + negative-scoring fix, and the restored canary gate."
trigger_phrases:
  - "sk-code routing benchmark checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/001-sk-code-parent/008-routing-benchmark-and-review"
    last_updated_at: "2026-07-04T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Recorded the phase 008 QA checklist with evidence"
    next_safe_action: "phase 009 cutover-and-rollout"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bootstrap-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->
# QA Checklist: Phase 8 — routing benchmark and review

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:correctness -->
## Correctness
- [x] The official record is generated from the real hub configs (`hub-router.json` + `mode-registry.json`), not a flat stand-in — evidence: `router-replay.cjs` hub branch; `benchmark/router-final/` regenerated via `loop-host.cjs`.
- [x] The re-layer preserves mode telemetry (`workflowMode` intact) — evidence: hub branch returns `routeTelemetry` from `buildHubRouteTelemetry` before surface recall.
- [x] Negative-activation scored against a real forbidden set, not the positive gold — evidence: `extractForbiddenPrefixes` + the corrected negative branch in `score-skill-benchmark.cjs`.
- [x] A no-positive/no-forbidden disambiguation scenario (RD-001) stays neutral, not penalized — evidence: `return { score: leaked ? 0 : 1, ... }` for the no-positive path.
<!-- /ANCHOR:correctness -->

---

<!-- ANCHOR:completeness -->
## Completeness
- [x] Router-mode benchmark run and official record captured — evidence: `verdict=CONDITIONAL aggregate=71 scenarios=29`.
- [x] Three-lens family deep-review complete; every P0/P1 confirmed against the real files — evidence: 9/10 apparent failures proven correct-routing; P1 canary confirmed by running the checker.
- [x] Harness re-layer fixes thin-hub resource recall — evidence: 12 scenarios improved +31..+70 (resourceRecall 0 → 0.6–0.83).
- [x] Four cheap in-family defects fixed — evidence: fixture placeholder, CR-018 link, two `smart_routing.md` paths, stale sub-file count.
<!-- /ANCHOR:completeness -->

---

<!-- ANCHOR:safety -->
## Safety / Scope
- [x] The harness re-layer is add-only and presence-gated — evidence: no-op unless `shared/references/smart_routing.md` exists; verified only `sk-code` has one (sk-design + flat skills unaffected).
- [x] Zero net-new test failures — evidence: pristine-harness baseline (three files stashed) = 8; with changes = 8 (99 tests).
- [x] The unrelated design-family test failure is pre-existing, not introduced — evidence: present in the pristine baseline.
- [x] No package.json/lock leak staged — evidence: `git checkout` before commit; explicit path staging (never `-A`).
- [x] Comment-hygiene passes on all four edited code files — evidence: rc=0 on `router-replay.cjs`, `score-skill-benchmark.cjs`, `load-playbook-scenarios.cjs`, `check-rule-copies.js`.
<!-- /ANCHOR:safety -->

---

<!-- ANCHOR:load-bearing -->
## Load-Bearing Verification
- [x] The P1 Iron-Law canary is restored — `check-rule-copies.js` exits 0 (was exit 1; CI-wired on PR→main via `rule-canary-sync.yml`).
- [x] The canary resolves the Iron-Law statement in `code-verify/SKILL.md` (where it now lives), not the thin hub `SKILL.md`.
- [x] Aggregate delta is honest, not gamed — 44 (flat) → 71 (hub); the gold was not flattened to the hub's pointer layer.
- [x] The harness vitest suite is green for the changed behavior — corrected negative test + positive-set regression both pass.
<!-- /ANCHOR:load-bearing -->

---

<!-- ANCHOR:deferred -->
## Deferred (tracked, not blocking this phase)
- [ ] Eight pre-existing harness-test failures (flat/pre-fold-layout casualties, red since 004/005) — migrate in the 009 regression pass.
- [ ] `parent-hub-vocab-sync` generalization (design-hardcoded `MODE_PREFIXES` → registry-derived) — 009; not wired into the benchmark gate, its own test passes.
- [ ] CS-003 substring matcher (`review` inside `preview`) — 009; word-boundary fix risks breaking desired substring matches; non-score-moving.
- [ ] Live-mode benchmark (D1-inter + D4 usefulness) — separate model-dispatched run, out of this phase's scope.
- [ ] Advisor-graph rebuild + memory reindex — MAIN post-merge (needs `node_modules/dist`).
<!-- /ANCHOR:deferred -->
