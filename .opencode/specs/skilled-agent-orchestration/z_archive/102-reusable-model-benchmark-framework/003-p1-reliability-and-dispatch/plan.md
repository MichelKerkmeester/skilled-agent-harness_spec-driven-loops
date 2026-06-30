---
title: "Implementation Plan: P1 reliability tier — statistical rigor, dispatch envelope, capability table + tiered fixtures"
description: "Harden the P0 benchmark framework to publication-grade reliability in three additive stages over the existing Lane B: paired-bootstrap-CI + noise-floor gating the trust verdict, a normalized dispatch envelope with latency + nullable tokens/cost + OpenCode JSON usage parsing, and machine-readable provider capability fields + a tiered fixture taxonomy + an A-F modes guide — all without breaking the 56-test Lane B baseline."
trigger_phrases:
  - "p1 reliability plan"
  - "ci verdict dispatch envelope plan"
  - "capability table tiered fixtures plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/102-reusable-model-benchmark-framework/003-p1-reliability-and-dispatch"
    last_updated_at: "2026-06-02T05:46:00Z"
    last_updated_by: "claude-opus"
    recent_action: "P1 reliability tier shipped (vitest 143); CI verdict + dispatch envelope + capability fields"
    next_safe_action: "Capability-discrimination follow-on (004) underway"
    blockers: []
    key_files:
      - ".opencode/skills/deep-improvement/scripts/model-benchmark/lib/sweep-stats.cjs"
      - ".opencode/skills/deep-improvement/scripts/model-benchmark/dispatch-model.cjs"
      - ".opencode/skills/sk-prompt/assets/model-profiles.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-127-003-plan"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: P1 reliability tier — statistical rigor, dispatch envelope, capability + tiered fixtures

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node `.cjs` benchmark modules (`model-benchmark/`) + JSON profiles/fixtures + markdown operator docs |
| **Framework** | Existing Lane B sweep rig (`sweep-stats.cjs` / `sweep-reporter.cjs` / `dispatch-model.cjs` / `sweep-benchmark.cjs`); vitest for unit coverage; dependency-free Node stdlib for bootstrap/CI |
| **Storage** | `aggregate.json` sweep output (now carries `verdict.ci`/`n_samples`/`noise_floor`); sweep rows capture the dispatch envelope; `model-profiles.json` carries capability objects; `benchmark-fixtures/*.json` tiered taxonomy |
| **Testing** | `npx vitest run model-benchmark/tests/` — original 56 Lane B + new `sweep-stats-ci.vitest.ts` (19) + `dispatch-envelope.vitest.ts` (18); `node --check` on touched .cjs; `jq` on touched JSON; `validate.sh --strict` |

### Overview
Harden the P0 MVP to publication-grade reliability per the 127 research roadmap (§5 stats, §6 dispatch, §4 fixtures) in three additive stages, with the 56-test Lane B baseline staying green throughout. Stage A makes the trust verdict statistically defensible: a paired bootstrap CI + MAD noise-floor gate WINNER so it only fires when `N>=k AND margin>noiseFloor AND the paired 90% CI excludes zero`, otherwise TIE/INCONCLUSIVE with a reason. Stage B replaces word-count "efficiency" with a real normalized dispatch envelope (latency + nullable tokens/cost) and parses the OpenCode `--format json` event stream for usage — never fabricating it. Stage C turns provider quirks into machine-readable capability fields, adds a tiered fixture taxonomy, ships an A-F modes operator guide, and calibrates `repeatabilityTolerance`. A real-dispatch smoke later confirmed the OpenCode usage parser works on a live stream, closing the research's "usage unverified" caveat.
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
Additive hardening over a proven rig — every change extends an existing Lane B module's exports or return shape rather than rewriting it, so the 56-test baseline keeps passing at every stage and the only real-risk edit (the dispatcher) is constrained to additive return fields.

### Key Components
- **lib/sweep-stats.cjs** (stage A): adds `bootstrapPairedDeltaCi`, `pairedWinRate`, `noiseFloorMad`, and `trustVerdictCI` — the verdict gate that requires N>=k AND margin>noiseFloor AND a paired 90% CI excluding zero, else TIE/INCONCLUSIVE with a reason.
- **lib/sweep-reporter.cjs** (stage A): computes the top-pair CI and uses the gated verdict; `aggregate.json.verdict` now carries `ci`/`n_samples`/`noise_floor`.
- **dispatch-model.cjs** (stage B): a normalized envelope of additive return fields (`latency_ms`, `executor`, `provider`, `model`, `variant`, `tokens_in`, `tokens_out`, `cost_usd`, `output`, `usage_parser_status`) plus `parseOpencodeStream` (an OpenCode `--format json` event parser) — every existing return key, the `--agent`-omission, and `--variant` forwarding preserved.
- **sweep-benchmark.cjs** (stage B): captures the dispatch envelope into per-combo rows so the reporter can rank on a real efficiency dimension.
- **sk-prompt/assets/model-profiles.json** (stage C): machine-readable `capability` objects (`model_slug`/`default_variant`/`variant_flag`/`agent_policy`/`format_mode`/`quota_pool` + honest `variant_status`) on `minimax-m3`/`minimax-2.7`/`mimo-v2.5-pro`.
- **benchmark-fixtures/** + **MODES.md** + **default.json** (stage C): tiered fixtures `t1-smoke-echo.json` + `t4-adversarial-tokenizer.json` (oracles validated through the real scorer), a `MODES.md` mapping the six A-F modes to profile shapes, and a calibrated `repeatabilityTolerance` (0 -> 0.03 with a note).

### Data Flow
sweep rows (per combo) -> dispatch returns the normalized envelope (latency + parsed-or-null tokens/cost) -> rows capture the envelope -> `sweep-stats` computes paired bootstrap CI + noise-floor -> `trustVerdictCI` gates WINNER/TIE/INCONCLUSIVE -> `sweep-reporter` writes `aggregate.json.verdict` with `ci`/`n_samples`/`noise_floor`; capability fields + tiered fixtures + MODES.md feed profile selection and the operator guide.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

Stage B edits a shared Lane B dispatcher and stage C edits a shared schema (`model-profiles.json`), so the affected-surface inventory applies.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `model-benchmark/dispatch-model.cjs` | Shared Lane B dispatcher (56 tests depend on its return keys) | Add envelope fields + `parseOpencodeStream`; preserve every existing key, `--agent` omission, `--variant` forwarding | `npx vitest run model-benchmark/tests/` stays green; `node --check` passes |
| `model-benchmark/lib/sweep-stats.cjs` | Shared stats helpers | Add `bootstrapPairedDeltaCi`/`pairedWinRate`/`noiseFloorMad`/`trustVerdictCI` (additive exports) | `sweep-stats-ci.vitest.ts` (19) green; existing exports unchanged |
| `model-benchmark/lib/sweep-reporter.cjs` | Shared reporter | Compute top-pair CI; emit gated verdict with `ci`/`n_samples`/`noise_floor` | `aggregate.json.verdict` shape verified; suite green |
| `sk-prompt/assets/model-profiles.json` | Producer — model registry | Add `capability` objects to 3 token-plan providers; preserve entry shape | `jq .` valid; existing keys unchanged |

Required inventories:
- Dispatcher consumers: `rg -n "dispatch-model" .opencode/skills/deep-improvement/scripts/model-benchmark` — `sweep-benchmark.cjs` is the row-capture consumer; all existing return keys preserved.
- Registry consumers: `rg -n "model-profiles" .opencode/skills --glob '*.ts' --glob '*.md'` — capability fields are additive; the registry `id` keys are unchanged.
- Invariant: `model-profiles.json` stays valid JSON; the new tiered fixtures pass `jq`; oracles validated through the real scorer.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Stage A — statistical rigor
- [x] Extend `lib/sweep-stats.cjs` with `bootstrapPairedDeltaCi`, `pairedWinRate`, `noiseFloorMad`, `trustVerdictCI` (gate WINNER on N>=k AND margin>noiseFloor AND paired 90% CI excludes zero; else TIE/INCONCLUSIVE with reason)
- [x] Upgrade `lib/sweep-reporter.cjs` to compute the top-pair CI and emit the gated verdict (`aggregate.json.verdict` carries `ci`/`n_samples`/`noise_floor`)
- [x] Add `tests/sweep-stats-ci.vitest.ts` (19); confirm WINNER<->TIE flips with separation; vitest 125

### Phase 2: Stage B — dispatch envelope
- [x] Extend `dispatch-model.cjs` with the normalized envelope (additive fields: `latency_ms`/`executor`/`provider`/`model`/`variant`/`tokens_in`/`tokens_out`/`cost_usd`/`output`/`usage_parser_status`) + `parseOpencodeStream`; preserve every existing key, `--agent` omission, `--variant` forwarding
- [x] Capture the envelope into sweep rows in `sweep-benchmark.cjs`
- [x] Add `tests/dispatch-envelope.vitest.ts` (18); vitest 143; real-dispatch smoke confirms the OpenCode parser on a live stream (39,395 in / 63 out, cost 0) — "usage unverified" caveat closed

### Phase 3: Stage C — capability table + tiered fixtures + modes guide
- [x] Add machine-readable `capability` objects to `minimax-m3`/`minimax-2.7`/`mimo-v2.5-pro` in `sk-prompt/assets/model-profiles.json` (model_slug/default_variant/variant_flag/agent_policy/format_mode/quota_pool + honest variant_status)
- [x] Add tiered fixtures `t1-smoke-echo.json` + `t4-adversarial-tokenizer.json` (oracles validated through the real scorer); create `MODES.md` (six A-F modes as profile shapes); calibrate `default.json` `repeatabilityTolerance` 0 -> 0.03 with a note
- [x] Verify: `npx vitest run model-benchmark/tests/` -> 143 passed; all new JSON jq-valid; Lane B behavior unchanged; `validate.sh --strict` on 003
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Stats unit | Paired bootstrap CI + noise-floor + verdict gating (WINNER/TIE/INCONCLUSIVE) | `tests/sweep-stats-ci.vitest.ts` (19), seeded resampling |
| Dispatch unit | Envelope fields + OpenCode JSON usage parsing (parsed-or-null, never fabricated) | `tests/dispatch-envelope.vitest.ts` (18), mock dispatch |
| Regression | Original 56 Lane B tests stay green at every stage | `npx vitest run model-benchmark/tests/` -> 143 total |
| Real-dispatch smoke | Live OpenCode `--format json` usage capture | One live dispatch — 39,395 in / 63 out, cost 0 |
| Static + data | `node --check` touched .cjs; `jq` touched JSON; fixture oracles | `node --check`, `jq`, the real scorer |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| P0 MVP (`001-p0-mvp-implementation`) | Internal | Green | The config-driven rig + correctness gate this hardens |
| Lane B 56-test baseline | Internal | Green | Must stay green; additive-only changes guarantee it |
| 127 research roadmap (§5/§6/§4 + P1 deltas) | Internal | Green | Source of the stage A/B/C requirements |
| Live OpenCode binary (`--format json`) | External | Green | Needed for the usage-parser smoke; confirmed on a live stream |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A stage breaks the Lane B suite, or fabricated/incorrect usage data appears, or `aggregate.json.verdict` regresses.
- **Procedure**: All changes are additive over tracked files. `git checkout -- <touched .cjs / .json / MODES.md>` reverts any single stage; the tiered fixtures are new files that can be removed wholesale. No migrations, no runtime state.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Stage A (statistical rigor) ──► Stage B (dispatch envelope) ──► Stage C (capability/fixtures/modes)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Stage A | P0 MVP, Lane B baseline | Stage B |
| Stage B | Stage A (verdict consumes envelope rows) | Stage C |
| Stage C | Stage B (capability/fixtures build on real envelope) | None (004 successor) |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Stage A | Med | Bootstrap/CI/noise-floor math + verdict gate + 19 tests |
| Stage B | Med-High | Only real-risk edit (Lane B dispatcher) + OpenCode parser + 18 tests + live smoke |
| Stage C | Low-Med | Capability objects + 2 tiered fixtures + MODES.md + tolerance calibration |
| **Total** | | **Single focused session, three verified stages** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Every change additive over existing Lane B exports/return keys (NFR-002)
- [x] Suite green at every stage (vitest 125 -> 143)
- [x] Tokens/cost nullable; never fabricated (real-dispatch smoke confirmed parser)

### Rollback Procedure
1. Revert stats: `git checkout -- .opencode/skills/deep-improvement/scripts/model-benchmark/lib/sweep-stats.cjs .opencode/skills/deep-improvement/scripts/model-benchmark/lib/sweep-reporter.cjs`
2. Revert dispatch: `git checkout -- .opencode/skills/deep-improvement/scripts/model-benchmark/dispatch-model.cjs .opencode/skills/deep-improvement/scripts/model-benchmark/sweep-benchmark.cjs`
3. Revert data/docs: `git checkout -- .opencode/skills/sk-prompt/assets/model-profiles.json`; remove new `benchmark-fixtures/t1-smoke-echo.json` + `t4-adversarial-tokenizer.json` + `MODES.md`
4. Verify: `npx vitest run model-benchmark/tests/` back to the 56-test baseline; `jq .` on `model-profiles.json`

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A — no schema migrations, no runtime state; `aggregate.json` regenerates on the next sweep
<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN (~140 lines)
- Core + Verification additions
- Phase dependencies, effort estimation
- Enhanced rollback procedures
-->
