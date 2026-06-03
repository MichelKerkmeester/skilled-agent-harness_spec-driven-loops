---
title: "Implementation Plan: P0 MVP — reusable config-driven benchmark framework"
description: "Build the P0 MVP as ADDITIVE new files orchestrating the existing (unmodified) Lane B model-benchmark pieces: a framework registry + slot renderer, an additive profile schema + validator, a sweep matrix-expander with no mode branches, a correctness-GATE scorer, a trust reporter (WINNER/TIE/INCONCLUSIVE before the leaderboard), T3 fixtures, and example profiles — so framework-bakeoff and model-vs-model are config, not new rig code, and the 56 existing vitest tests stay green."
trigger_phrases:
  - "p0 mvp benchmark framework plan"
  - "sweep-benchmark matrix expander plan"
  - "config-driven benchmark framework plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/127-reusable-model-benchmark-framework/002-p0-mvp-implementation"
    last_updated_at: "2026-06-02T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored P0 MVP implementation plan"
    next_safe_action: "MVP complete; P1 reliability tier (003) underway"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-127-001-plan"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: P0 MVP — reusable config-driven benchmark framework

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node `.cjs` modules (stdlib only, no new npm deps) + JSON data assets + vitest tests |
| **Framework** | New `sweep-benchmark.cjs` matrix-expander orchestrating the EXISTING (unmodified) `dispatch-model.cjs` + scorer; mock-capable dispatch; deterministic seeded stats; no LLM-judge |
| **Storage** | Run outputs written to `--out-dir`: `results.json` (raw rows), `aggregate.json` (grouped + verdict), `synthesis.md` (human) |
| **Testing** | vitest under `model-benchmark/tests/` — foundation/runtime/acceptance suites added alongside the 56 existing Lane B tests; `node --check` on every new `.cjs`; `jq` on every new JSON; `validate.sh --strict` |

### Overview
Build the P0 MVP from the `../001-design-research/research/research.md` roadmap as ADDITIVE new files that orchestrate the existing, unmodified Lane B model-benchmark pieces (`run-benchmark.cjs`, `dispatch-model.cjs`, `scorer/score-model-variant.cjs`, `shared/loop-host.cjs`). The frameworks (RCAF/RACE/CIDI/TIDD-EC/COSTAR) become DATA in `sk-prompt/assets/framework-registry.json` rendered by a slot renderer; profiles gain additive keys validated by a dependency-free validator; a new `sweep-benchmark.cjs` expands `models × variants × frameworks × fixtures × samples` with NO mode-specific branches so `framework-bakeoff` and `model-vs-model` run through one code path; a correctness-GATE adapter gates eligibility before ranking survivors on efficiency/format/reasoning so saturated easy fixtures cannot crown a winner; and a reporter emits the WINNER/TIE/INCONCLUSIVE verdict and saturation status BEFORE the leaderboard. The additive design keeps the 56 existing Lane B tests green and runs `sweep-benchmark.cjs` standalone (no edit to `loop-host.cjs`), keeping the build 100% additive.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Additive orchestration — the existing Lane B modules are model-agnostic in shape and stay byte-for-byte unchanged by this build. The new sweep layer sits ON TOP: it expands a config matrix, renders framework prompts from the registry, dispatches each cell through the existing `dispatch-model.cjs` (mock-capable), scores through the code-task scorer, gates correctness, and reports trust. One code path serves both modes; `mode` only sets sensible defaults, never branches the expander.

### Key Components
- **sk-prompt/assets/framework-registry.json**: 5 frameworks (rcaf/race/cidi/tidd-ec/costar) as data — id/description/applies_to/template/slots/output_contract. Adding a framework is a registry entry, no code.
- **lib/framework-renderer.cjs**: slot interpolation + required-slot validation; throws a clear error at validate-time when a template slot is missing.
- **lib/profile-validator.cjs**: dependency-free enum/required-key/weights-sum validation of the additive profile keys (`mode`, `models[]`, `frameworks[]`, `variants[]`, `fixtureSelection`, `scoring{dimensions,correctnessGate}`, `sampling`, `reporting`).
- **sweep-benchmark.cjs**: matrix expander — `axisModels × axisVariants × axisFrameworks × fixtures × samples`, each absent axis collapsing to a singleton so the product is uniform; NO branch on `profile.mode`. Dispatches each cell, scores each row, emits.
- **lib/code-task-scorer.cjs**: code-task scoring adapter producing the per-cell dimensions consumed by the gate and reporter.
- **lib/correctness-gate.cjs**: gates eligibility on `pass_rate ≥ threshold` (default 1.0), then ranks survivors on efficiency/format/reasoning; once correctness saturates, `ranking_key` moves off correctness so saturation cannot crown a winner.
- **lib/sweep-stats.cjs**: `mean/median/mad/quantile/seededRandom` + the trust verdict helper (enough for WINNER/TIE/INCONCLUSIVE, with an insufficient-n floor).
- **lib/sweep-reporter.cjs**: builds `aggregate.json` (per-groupBy n/mean/median/saturation/top-pair-delta/verdict) + `synthesis.md` with the trust verdict and saturation status ordered BEFORE the leaderboard.
- **Example profiles + T3 fixtures**: `benchmark-profiles/{framework-bakeoff,model-vs-model}.json` prove the config-only mode switch; `benchmark-fixtures/{t3-bugfix-in-context,t3-strict-acceptance}.json` are harder code-task fixtures with hidden oracles.

### Data Flow
profile → validate → expand matrix (no mode branch) → per cell: render framework prompt from registry → dispatch (mock or real) → score code task → row → gate correctness (saturated? move ranking_key) → trust verdict on ranking_key → `results.json` (raw rows) + `aggregate.json` (grouped + verdict) + `synthesis.md` (verdict + saturation BEFORE leaderboard).
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

The build orchestrates shared Lane B modules and adds a shared registry asset consumed by `sk-prompt`, so the affected-surface inventory applies even though every Lane B module stays unmodified.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `model-benchmark/run-benchmark.cjs` | Lane B legacy runner | NONE — unchanged | `git diff` shows no sweep-build edit; 56 Lane B tests stay green |
| `model-benchmark/dispatch-model.cjs` | Universal dispatcher (mock-capable) | NONE by this build — consumed as-is | sweep imports it; no sweep-build edit to its dispatch logic |
| `model-benchmark/scorer/score-model-variant.cjs` | Lane B scorer | NONE — unchanged | consumed as-is; Lane B scorer tests stay green |
| `shared/loop-host.cjs` | Lane B loop host | NONE — sweep runs standalone | MVP runs `sweep-benchmark.cjs` directly; build stays 100% additive |
| `sk-prompt/assets/framework-registry.json` | Producer — framework data (new) | Create | `jq .` valid; 5 framework ids present; renderer validates slots |

Required inventories:
- Lane B regression guard: `npx vitest run model-benchmark/tests/` — the 56 existing tests stay green alongside the new sweep tests.
- Registry consumer: the renderer resolves the registry by path from `sweep-benchmark.cjs`; `jq` confirms the 5 framework ids (rcaf/race/cidi/tidd-ec/costar).
- Invariant: every Lane B module stays byte-for-byte unchanged by this build; the only new shared asset is the additive registry, ignored by the legacy path.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Registry, renderer, validator, fixtures, stats
- [x] Author `sk-prompt/assets/framework-registry.json` (5 frameworks as data) + `lib/framework-renderer.cjs` (slot interpolation + required-slot validation)
- [x] Author `lib/profile-validator.cjs` (dependency-free enum/required-key/weights-sum validation of additive profile keys)
- [x] Author `lib/sweep-stats.cjs` (`mean/median/mad/quantile/seededRandom` + verdict helper) and the T3 fixtures `benchmark-fixtures/{t3-bugfix-in-context,t3-strict-acceptance}.json`

### Phase 2: Sweep expander + correctness gate
- [x] Author `sweep-benchmark.cjs` — matrix expander over `models × variants × frameworks × fixtures × samples` with NO mode-specific branches; dispatch each cell via the existing `dispatch-model.cjs` (mock-capable); score via `lib/code-task-scorer.cjs`
- [x] Author `lib/correctness-gate.cjs` — gate eligibility on `pass_rate ≥ threshold` (default 1.0), rank survivors off correctness once saturated
- [x] Author the example profiles `benchmark-profiles/{framework-bakeoff,model-vs-model}.json` proving the config-only mode switch

### Phase 3: Reporter + acceptance + verify
- [x] Author `lib/sweep-reporter.cjs` — `aggregate.json` (grouped + verdict) + `synthesis.md` with the trust verdict + saturation BEFORE the leaderboard
- [x] Author vitest suites `tests/{sweep-foundation,sweep-runtime,sweep-acceptance}.vitest.ts`; assert both modes from config, saturation-cannot-win, verdict-before-leaderboard, and a real-winner case
- [x] `npx vitest run model-benchmark/tests/` (106 passed), `node --check` on every new `.cjs`, `jq` on every new JSON, CLI smoke run, `validate.sh --strict` on 001
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Foundation | Renderer slots, validator enums/weights, stats, gate eligibility | `tests/sweep-foundation.vitest.ts` |
| Runtime | Matrix expansion (no mode branch), mock dispatch, reporter outputs | `tests/sweep-runtime.vitest.ts` |
| Acceptance | Both modes from one path; saturation cannot win; verdict before leaderboard; real-winner on efficiency | `tests/sweep-acceptance.vitest.ts` |
| Regression | Lane B's 56 existing tests stay green | `npx vitest run model-benchmark/tests/` (full suite) |
| Static | `node --check` on new `.cjs`; `jq` on new JSON; CLI smoke run producing the three outputs | shell |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Existing `dispatch-model.cjs` mock mode | Internal | Green | Tests run mock; no real CLI calls; consumed unchanged by the sweep |
| Existing Lane B scorer | Internal | Green | Consumed as-is; sweep adds its own code-task scorer adapter on top |
| `../001-design-research/research/research.md` P0 roadmap | Internal | Green | P0 scope (registry/renderer/validator/sweep/gate/reporter) is the design source |
| Node stdlib only (NFR-001) | External | Green | No new npm deps; deterministic seeded tests, no network |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The sweep produces a spurious WINNER on saturated fixtures, the 56 Lane B tests regress, or a new JSON/`.cjs` fails its static check.
- **Procedure**: The build is 100% additive — every new file is removable wholesale (`git rm` / `git checkout --` on the new paths) with zero edit to any Lane B module to revert. No migrations, no runtime wiring into `loop-host.cjs`. The legacy `run-benchmark.cjs` / `default.json` path is untouched and keeps working.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Registry/renderer/validator/fixtures/stats) ──► Phase 2 (Sweep expander + gate) ──► Phase 3 (Reporter + acceptance + verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Registry/renderer/validator/fixtures/stats | research P0 roadmap | Sweep expander + gate |
| Sweep expander + gate | Phase 1 foundation | Reporter + acceptance + verify |
| Reporter + acceptance + verify | Sweep expander + gate | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Registry/renderer/validator/fixtures/stats | Med | 4 modules + 1 registry + 2 fixtures + foundation tests |
| Sweep expander + gate | Med | Matrix expander (no mode branch) + gate + 2 example profiles |
| Reporter + acceptance + verify | Med | Reporter + acceptance suite + 106-test regression + smoke run + strict validate |
| **Total** | | **Single focused session, 3 verified stages** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Every new file is additive; no Lane B module edited by this build
- [x] Sweep runs standalone (no `loop-host.cjs` wiring), keeping the build 100% additive
- [x] CLI smoke run + reproducibility commands recorded in `implementation-summary.md` and `SWEEP.md`

### Rollback Procedure
1. Remove the new sweep files: `git rm` / `git checkout --` on `sweep-benchmark.cjs`, `lib/{framework-renderer,profile-validator,sweep-stats,code-task-scorer,correctness-gate,sweep-reporter}.cjs`, the new tests, the example profiles, the T3 fixtures, and `sk-prompt/assets/framework-registry.json`
2. No Lane B module needs reverting (none was edited by this build)
3. Verify: `npx vitest run model-benchmark/tests/` shows the 56 Lane B tests green; legacy `run-benchmark.cjs` path unchanged

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A — no runtime wiring, no schema migrations; run outputs (`results.json`/`aggregate.json`/`synthesis.md`) are written only under the operator's `--out-dir`
<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN (~140 lines)
- Core + Verification additions
- Phase dependencies, effort estimation
- Enhanced rollback procedures
-->
