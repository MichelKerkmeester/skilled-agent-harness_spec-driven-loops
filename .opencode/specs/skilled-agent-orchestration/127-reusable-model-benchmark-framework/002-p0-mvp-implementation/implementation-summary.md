---
title: "Implementation Summary: P0 MVP — reusable config-driven benchmark framework"
description: "Built the P0 MVP as additive new files orchestrating the existing (unmodified) Lane B model-benchmark pieces: a framework registry + slot renderer, an additive profile schema + validator, a sweep matrix-expander with no mode branches, a correctness-GATE scorer, a trust reporter (WINNER/TIE/INCONCLUSIVE before the leaderboard), T3 fixtures, and example profiles. framework-bakeoff and model-vs-model now run through one code path by config alone; saturated easy fixtures can no longer crown a winner. 106 vitest tests pass (56 Lane B + 50 new)."
trigger_phrases:
  - "p0 mvp benchmark summary"
  - "sweep-benchmark correctness gate"
  - "config-driven benchmark framework summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/127-reusable-model-benchmark-framework/002-p0-mvp-implementation"
    last_updated_at: "2026-06-02T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "P0 MVP built + verified (vitest 106); additive, Lane B untouched"
    next_safe_action: "MVP complete; P1 reliability tier (003) underway"
    blockers: []
    key_files:
      - ".opencode/skills/deep-improvement/scripts/model-benchmark/sweep-benchmark.cjs"
      - ".opencode/skills/deep-improvement/scripts/model-benchmark/lib/correctness-gate.cjs"
      - ".opencode/skills/deep-improvement/scripts/model-benchmark/lib/sweep-reporter.cjs"
      - ".opencode/skills/sk-prompt/assets/framework-registry.json"
      - ".opencode/skills/deep-improvement/scripts/model-benchmark/SWEEP.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-127-001-impl"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-p0-mvp-implementation |
| **Completed** | 2026-06-02 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

<!-- Voice guide:
     Open with a hook: what changed and why it matters. One paragraph, impact first.
     Then use ### subsections per feature. Each subsection: what it does + why it exists.
     Write "You can now inspect the trace" not "Trace inspection was implemented."
     NO "Files Changed" table for Level 3/3+. The narrative IS the summary.
     For Level 1-2, a Files Changed table after the narrative is fine.
     Reference: specs/system-spec-kit/020-mcp-working-memory-hybrid-rag/implementation-summary.md -->

A benchmark used to mean new code. Every time you wanted to compare frameworks, or pit one model against another, someone wrote a fresh rig — and `126/004` showed the sharper risk: when an easy fixture saturates at 100% correctness, a naive ranking crowns a "winner" that the data never earned. The P0 MVP closes both gaps. You now describe a sweep in ONE profile, run it through ONE code path, and read a trust verdict that refuses to name a winner the evidence cannot support. `framework-bakeoff` and `model-vs-model` differ only in which config axis carries more than one value — there is no mode-specific code branch separating them.

The whole thing was built ADDITIVE. The existing Lane B pieces — `run-benchmark.cjs`, `dispatch-model.cjs`, `scorer/score-model-variant.cjs`, `shared/loop-host.cjs` — were not touched by this build; the new sweep layer sits on top and orchestrates them. That is what keeps Lane B's 56 vitest tests green and let the MVP ship without wiring anything into the legacy loop.

### Config-only mode switch (one path, no branches)

You can now run a five-framework bake-off or a three-model head-to-head from a single profile. `sweep-benchmark.cjs` expands `models × variants × frameworks × fixtures × samples` into a uniform cartesian product — any axis you omit collapses to a singleton, so the product expression never special-cases a mode. `mode` only sets sensible defaults. A test proves it: strip `mode` off a profile and the cell count is identical. The `framework-bakeoff` profile is 5 frameworks × 1 model × 2 fixtures × 3 samples; the `model-vs-model` profile is 1 framework × 3 models × 2 fixtures × 3 samples. Same `runSweep`/`expandCells` code, different axis.

### Correctness as a GATE, not a score

Correctness no longer competes in the ranking once it saturates. `correctness-gate.cjs` gates eligibility on `pass_rate ≥ threshold` (default 1.0), then ranks the survivors on efficiency, format, and reasoning. When every cell passes — the exact failure mode from `126/004` — the gate flags `correctness_saturated`, moves `ranking_key` off correctness, and the verdict can only be TIE or INCONCLUSIVE, never a correctness WINNER. A saturation test asserts all three facts at once.

### Frameworks as data

Adding a framework is now a registry entry, not a code change. The five frameworks (RCAF, RACE, CIDI, TIDD-EC, COSTAR) live as data in `sk-prompt/assets/framework-registry.json` — id, description, applies_to, template, slots, output_contract — and `framework-renderer.cjs` interpolates the slots and validates that every required slot is present, throwing a clear error at validate-time rather than failing mid-dispatch.

### A report you can trust at a glance

`sweep-reporter.cjs` writes the trust verdict and the saturation status BEFORE the leaderboard, every time. A reader can never see a ranked "winner" before seeing whether that ranking is trustworthy. The synthesis orders `## Trust verdict` → `## Saturation status` → `## Leaderboard`; an acceptance test asserts the verdict text precedes any leaderboard text. The verdict measures its margin on the gate's chosen `ranking_key` and applies an insufficient-n floor, so a single sample cannot produce a WINNER.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `sk-prompt/assets/framework-registry.json` | Created | 5 frameworks (rcaf/race/cidi/tidd-ec/costar) as data — id/description/applies_to/template/slots/output_contract |
| `model-benchmark/sweep-benchmark.cjs` | Created | Matrix expander entry — `models × variants × frameworks × fixtures × samples`, no mode branch; dispatches via the existing `dispatch-model.cjs`; writes `results.json` (+ report) to `--out-dir` |
| `model-benchmark/lib/framework-renderer.cjs` | Created | Slot interpolation + required-slot validation |
| `model-benchmark/lib/profile-validator.cjs` | Created | Dependency-free enum/required-key/weights-sum validation of the additive profile keys |
| `model-benchmark/lib/code-task-scorer.cjs` | Created | Code-task scoring adapter feeding the gate + reporter dimensions |
| `model-benchmark/lib/correctness-gate.cjs` | Created | Gates eligibility on pass_rate ≥ threshold, ranks survivors off correctness once saturated |
| `model-benchmark/lib/sweep-stats.cjs` | Created | mean/median/mad/quantile/seededRandom + the trust verdict helper |
| `model-benchmark/lib/sweep-reporter.cjs` | Created | aggregate.json (grouped + verdict) + synthesis.md with verdict + saturation BEFORE the leaderboard |
| `model-benchmark/assets/.../benchmark-profiles/{framework-bakeoff,model-vs-model}.json` | Created | Example profiles proving the config-only mode switch |
| `model-benchmark/assets/.../benchmark-fixtures/{t3-bugfix-in-context,t3-strict-acceptance}.json` | Created | T3 code-task fixtures with hidden deterministic oracles (ids t3-lower-bound / t3-compare-versions) |
| `model-benchmark/tests/{sweep-foundation,sweep-runtime,sweep-acceptance}.vitest.ts` | Created | 50 new tests: renderer/validator/stats/gate, matrix expansion, both-modes + saturation-cannot-win + verdict-before-leaderboard + real-winner |
| `model-benchmark/SWEEP.md` | Created | Operator quickstart for the config-driven sweep framework |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

<!-- Voice guide:
     Tell the delivery story. What gave you confidence this works?
     "All features shipped behind feature flags" not "Feature flags were used."
     For Level 1: a single sentence is enough.
     For Level 3+: describe stages (testing, rollout, verification). -->

Built in three verified stages: first the foundation (registry, renderer, validator, stats, fixtures), then the sweep expander and the correctness gate, then the reporter and the acceptance suite. The deciding constraint was "do not touch Lane B," so the sweep runs standalone — no edit to `loop-host.cjs`, no migration, nothing wired into the legacy loop. That choice is what made the build 100% additive and let the 56 Lane B tests stay green throughout. Every new `.cjs` passed `node --check`, every new JSON is `jq`-valid, the CLI smoke run produced all three outputs end-to-end with the verdict ahead of the leaderboard, and the full suite finished at 106 passed across 9 files (the original 56 plus 50 new). The tests run deterministically: per-cell mock output is injected through the dispatcher's mock path, so there are no real CLI calls and no network in the suite.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

<!-- Voice guide: "Why" column should read like you're explaining to a colleague.
     "Chose X because Y" not "X was selected due to Y." -->

| Decision | Why |
|----------|-----|
| Build additive on top of unmodified Lane B instead of refactoring it | The whole point of the P0 safety property is that the 56 Lane B tests stay green and the legacy `run-benchmark.cjs` path keeps working; a new sweep layer orchestrating the existing modules is lower-risk than rewriting them |
| One code path, `mode` sets defaults only | The mode-branch is exactly the kind of divergence that makes a benchmark rig fragile; collapsing every axis to a uniform product means framework-bakeoff and model-vs-model cannot drift apart, and a strip-`mode` test guards it |
| Correctness is a GATE, not a ranking dimension | `126/004` proved that saturated easy fixtures crown misleading winners; gating eligibility and then ranking survivors off correctness is the direct fix, and once saturated the verdict can only be TIE/INCONCLUSIVE |
| Verdict + saturation print BEFORE the leaderboard | A reader should never see a "winner" before seeing whether the ranking is trustworthy; ordering the synthesis verdict-first makes the saturation caveat impossible to miss |
| Frameworks as registry data, not code | Adding a framework should be a data edit; the slot renderer validating required slots at validate-time keeps a malformed framework from failing silently mid-dispatch |
| Run `sweep-benchmark.cjs` standalone (skip the `loop-host.cjs` hook) | The guarded loop-host hook was deferred to P1 specifically so the MVP could stay 100% additive — standalone invocation delivers the full sweep without touching the legacy loop |
| Minimal stats, enough for a trustworthy verdict | Full paired-bootstrap CI is P1; the MVP only needs mean/median/mad/quantile/seeded plus an insufficient-n floor to emit WINNER/TIE/INCONCLUSIVE honestly |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

<!-- Voice guide: Be honest. Show failures alongside passes.
     "FAIL, TS2349 error in benchmarks.ts" not "Minor issues detected." -->

| Check | Result |
|-------|--------|
| Full vitest suite | PASS — `npx vitest run model-benchmark/tests/` → 106 passed (9 files) = 56 Lane B + 50 new, all green |
| No mode branch (REQ-001) | PASS — a test strips `mode` from a profile and asserts identical cell count; both example profiles run the same `runSweep`/`expandCells` path |
| Correctness gate (REQ-002) | PASS — saturation test asserts `correctness_saturated===true`, `ranking_key !== 'correctness'`, verdict ∈ {TIE, INCONCLUSIVE} (never a correctness WINNER) |
| Trust verdict ordering (REQ-003) | PASS — synthesis writes verdict + saturation before the leaderboard; acceptance test asserts verdict text precedes any leaderboard text |
| No Lane B regression (REQ-004) | PASS — the 56 existing model-benchmark tests stay green; this build edited no Lane B module |
| Data-driven frameworks (REQ-005) | PASS — `jq` confirms 5 framework ids in the registry; a real-winner test proves a trustworthy WINNER on the efficiency axis (margin 60 > noise floor 0, n=3) while correctness stays gated |
| Static checks (SC-003) | PASS — `node --check` OK on `sweep-benchmark.cjs` + all six `lib/*.cjs`; all new JSON `jq`-valid |
| CLI smoke run (SC-002) | PASS — end-to-end run produced `results.json` (30 rows / 10 cells for framework-bakeoff) + `aggregate.json` + `synthesis.md` with the verdict before the leaderboard |
| `validate.sh --strict` 001 | PASS — Exit 0 (see RESULT line in the closing report) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

<!-- Voice guide: Number them. Be specific and actionable.
     "Adaptive fusion is enabled by default. Set SPECKIT_ADAPTIVE_FUSION=false to disable."
     not "Some features may require configuration."
     Write "None identified." if nothing applies. -->

1. **P0 scope only — P1/P2 deferred.** Full `stats.cjs` (paired bootstrap CI / noise-floor gating), the normalized dispatch envelope + OpenCode JSON token/cost parsing, `model-profiles.json` capability fields, the guarded `loop-host.cjs` hook, mutation/hill-climb, profile inheritance, capability-radar reducers, and the long-context/agentic fixture categories all remain on the `../001-design-research/research/research.md` roadmap.
2. **Standalone runner, not loop-integrated yet.** The MVP runs `sweep-benchmark.cjs` directly. Wiring it behind the guarded `mode` hook in `loop-host.cjs` is P1; running standalone is what kept this build 100% additive.
3. **Minimal stats.** The verdict uses mean/median/mad/quantile/seeded plus an insufficient-n floor — enough for an honest WINNER/TIE/INCONCLUSIVE, but not yet a paired-bootstrap confidence interval. Treat narrow margins as ties until P1 lands the full CI.
4. **Two T3 fixtures.** `t3-bugfix-in-context` and `t3-strict-acceptance` exercise the gate and the saturation path; the tiered T-taxonomy (more T3/T4 plus long-context/agentic categories) is P2.
5. **Working-tree note on `dispatch-model.cjs`.** This build added no edit to any Lane B module. A separate, unrelated working-tree change to `dispatch-model.cjs` (the `--agent general` dispatch fix from other work) exists in the tree but is not part of the sweep MVP and does not touch the dispatcher behavior the sweep relies on; the 56 Lane B tests stay green with it present.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
