---
title: "Implementation Plan: Phase 8 — routing benchmark and review"
description: "Run the deterministic router-mode benchmark and a three-lens family deep-review, root-cause the low first score to a measurement artifact, re-layer the shared harness for thin hubs and correct its negative-scoring with a pristine baseline, restore the merge-blocking canary, and capture the honest record."
trigger_phrases:
  - "sk-code routing benchmark plan"
  - "skill-benchmark re-layer plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/001-sk-code-parent/008-routing-benchmark-and-review"
    last_updated_at: "2026-07-04T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Documented the benchmark + review + harness re-layer plan"
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
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 8 — routing benchmark and review

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context
| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node CJS harness (`router-replay`, `score`, `load-playbook-scenarios`), vitest, skill/agent markdown + JSON routers |
| **Framework** | deep-improvement Lane C skill-benchmark (router mode) + three-lens deep-review |
| **Storage** | `benchmark/router-final/` official record; hub `hub-router.json` + `mode-registry.json` + `shared/references/smart_routing.md` |
| **Testing** | Deterministic router-mode replay, vitest suite, pristine-harness regression baseline, comment-hygiene gate |

### Overview
Run the offline benchmark and a family review; treat every finding as a hypothesis and confirm it against the real files. Root-cause the low first score: the router picks the right mode, but the harness measures resources at the abandoned flat layer and inverts the negative-activation gold. Fix the instrument (add-only surface-layer recall + a real forbidden set), not the gold, and prove no collateral damage with a pristine baseline. Restore the one real merge-blocker (the canary), fix four cheap defects, and capture the honest record.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] 007 advisor integration complete; hub router + registry are the benchmark inputs.
- [x] The skill-benchmark harness runs in router mode against `sk-code`.
- [x] A pristine-harness baseline procedure is defined (stash my files, count failures, pop).

### Definition of Done
- [x] Official router-mode record captured (aggregate 71) from the real hub configs.
- [x] Family deep-review complete; every P0/P1 confirmed against the real files.
- [x] Harness re-layer add-only + presence-gated; mode telemetry preserved.
- [x] Negative-scoring corrected with vitest coverage; zero net-new failures vs baseline.
- [x] P1 canary restored (exit 0); four cheap defects fixed; hygiene clean.
- [x] Deferrals (8 test failures, vocab-sync, CS-003) documented for 009.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Instrument-repair, not gold-flattening: when a benchmark under-scores a correctly-restructured system, fix the layer the instrument measures rather than rewriting the gold to match the instrument (which would erase the discrimination the suite exists for).

### Key Components
- **`router-replay.cjs`** — for a hub, selects the mode from `hub-router.json` (telemetry preserved) and recalls resources from the surface router (`shared/references/smart_routing.md`) via `loadSurfaceRouter` + `assembleResources` over packet/shared existence roots (`registryPacketRoots`). Add-only: returns unchanged unless a surface router doc exists.
- **`load-playbook-scenarios.cjs`** — parses the "Expected NOT loaded" block into a forbidden-prefix set (`extractForbiddenPrefixes`, glob-prefix aware).
- **`score-skill-benchmark.cjs`** — scores a suppression scenario on positive-set recall, failing only on a real forbidden-prefix leak; a no-positive/no-forbidden scenario stays neutral.
- **Pristine baseline** — `git stash push` on the three harness files isolates my-caused vs pre-existing failures.

### Data Flow
Run benchmark → CONDITIONAL 51 → three-lens review root-causes it as an artifact → re-layer replay (surface recall) → parse forbidden set + fix scorer → re-run + vitest + pristine baseline → aggregate 71, zero net-new failures → capture official record → restore canary + cheap fixes → document.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `router-replay.cjs` | Router-mode resource recall | Surface-layer recall for hubs (add-only) | 12 scenarios +31..+70; no-op for non-hub skills |
| `score` + `load-playbook-scenarios` | Negative-activation scoring | Real forbidden set + positive-set recall | 5 mis-scored scenarios corrected; RD-001 neutral |
| `tests/skill-benchmark.vitest.ts` | Harness self-tests | Correct negative test + add positive-set regression | both green; zero net-new failures |
| `check-rule-copies.js` | Iron-Law canary (CI on PR→main) | Repoint to `code-verify`; relax matcher | exit 0 |
| fixture/link/count/path docs | Playbook + README integrity | Four cheap fixes | placeholder substituted; link/paths/count correct |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Run the router-mode benchmark against the hub; record the CONDITIONAL 51 first result.
- [x] Dispatch three independent read-only review lenses (contracts/invariants, doctrine/reference, routing root-cause).
- [x] Confirm every finding against the real files; separate artifacts from defects.

### Phase 2: Core
- [x] Re-layer `router-replay.cjs` for hubs (surface-router recall, packet/shared roots) — add-only, presence-gated.
- [x] Parse the forbidden set in `load-playbook-scenarios.cjs`; correct the negative branch in `score-skill-benchmark.cjs`.
- [x] Update the negative-scoring vitest test + add a positive-set regression test.
- [x] Restore the P1 canary (`check-rule-copies.js`); fix the four cheap defects.

### Phase 3: Verification
- [x] Re-run the benchmark; capture the official record (aggregate 71) under `benchmark/router-final/`.
- [x] Pristine-harness baseline (stash → count → pop): 8 failures pristine, 8 with changes → zero net-new.
- [x] Run the canary (exit 0) and comment-hygiene on all four edited code files (clean).
- [x] Confirm deferrals (8 test failures, vocab-sync, CS-003) are documented for 009.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
| Test Type | Scope | Tools |
|-----------|-------|-------|
| Router-mode benchmark | Full playbook vs hub configs | `loop-host.cjs --trace-mode=router` |
| Harness unit tests | re-layer + negfix | vitest (`skill-benchmark/tests/`) |
| Regression baseline | my-caused vs pre-existing failures | `git stash push/pop` on the three harness files |
| Canary gate | Iron-Law rule-copy sync | `check-rule-copies.js` (exit code) |
| Comment hygiene | Edited `.cjs`/`.js` files | `code-quality/scripts/check-comment-hygiene.sh` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 007 advisor integration | Internal | Complete | No hub router/registry to benchmark |
| deep-improvement Lane C harness | Internal | In-repo | No deterministic instrument (also the repair target) |
| 009 cutover | Internal | Pending | Consumes this verdict before removing the alias |
| Advisor rebuild + reindex (main) | Internal | Pending | Live-graph identity still folded until run |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
- **Trigger**: The re-layer misscores a skill, or a review-driven fix is wrong before 009.
- **Procedure**: All edits are additive JS/JSON/markdown in a git-tracked worktree; `git checkout`/`git reset` to the pre-008 commit reverts them. The harness branch is presence-gated, so reverting it restores exact prior behavior for every skill. The benchmark record is regenerable from `loop-host.cjs`. No destructive filesystem operation occurs in this phase.
<!-- /ANCHOR:rollback -->
