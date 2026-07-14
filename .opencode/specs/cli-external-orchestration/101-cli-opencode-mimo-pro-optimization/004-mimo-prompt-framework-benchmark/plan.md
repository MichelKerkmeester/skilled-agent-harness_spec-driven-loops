---
title: "Implementation Plan: MiMo-V2.5-Pro prompt-framework benchmark"
description: "Build a lean self-contained prompt-framework bake-off (port of the 120/003 MiniMax rig), run a 5-framework benchmark against deterministic coding fixtures with real MiMo-V2.5-Pro calls, then integrate the winning framework into the cli-opencode MiMo dispatch path."
trigger_phrases:
  - "mimo benchmark plan"
  - "mimo eval rig port"
  - "mimo-v2.5-pro dispatch bench"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/101-cli-opencode-mimo-pro-optimization/004-mimo-prompt-framework-benchmark"
    last_updated_at: "2026-06-01T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored phase-004 plan"
    next_safe_action: "Stand up eval/ rig + framework variants; probe live dispatch"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-126-004-plan"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 4: mimo-prompt-framework-benchmark

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node `.cjs` rig scripts (lean self-contained port of `120/003`) + markdown skill docs |
| **Framework** | Self-contained harness `run-mimo-bench.cjs`; cli-opencode dispatch (`opencode run ... --format json`, NO `--agent`); deterministic JS scoring only (no LLM-judge) |
| **Storage** | Packet-local `eval/` — `runs/*.json` (raw per-dispatch), `results.json` (per-combo scores), `synthesis.md` (ranking) |
| **Testing** | Hidden JS test suites run in isolated child processes (`runner-child.cjs`) → assertion-pass + format-adherence + length → `validate.sh --strict` |

### Overview
Build a leaner self-contained bake-off under `eval/` (port of the `120/003` MiniMax rig): 5 framework variants (RCAF/RACE/CIDI/TIDD-EC/COSTAR) x 2 deterministic JS fixtures (chunk, parseRange). A harness dispatches each combo to the real model `xiaomi-token-plan-ams/mimo-v2.5-pro` via `opencode run ... --format json` (no `--agent`), extracts the function from the assistant message, runs hidden test suites in isolated child processes, and scores assertion-pass + format-adherence + output-length. Run the bake-off (1 real dispatch per combo = 10 total), rank the frameworks, write `synthesis.md`, then integrate the winner into the cli-opencode MiMo dispatch path mirroring `120/003`'s integration shape.
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
Lean port-and-swap — the `120/003` rig is model-agnostic in shape; this build re-implements the same framework-variants + deterministic-scorer + synthesis pattern in a smaller self-contained form scoped to MiMo and 2 fixtures.

### Key Components
- **eval/frameworks.cjs**: 5 framework scaffolds (RCAF/RACE/CIDI/TIDD-EC/COSTAR); only the framework block varies, the fixture task is held constant
- **eval/fixtures.cjs**: 2 deterministic pure-function fixtures (chunk, parseRange) + hidden test suites beyond the stated examples (overfitting guard)
- **eval/run-mimo-bench.cjs** (harness): dispatches `gtimeout 120 opencode run --model xiaomi-token-plan-ams/mimo-v2.5-pro --format json --dir <workdir> "<prompt>" </dev/null` (NO `--agent` — 1.15.13 rejects/falls back on `--agent general`); extracts the function; scores
- **eval/extract.cjs / runner-child.cjs / runtests.cjs**: function extraction, isolated one-process-per-test execution with per-case hard timeout, deep-equality vs hidden expected outputs
- **Scoring**: `assertion_pass_rate` (primary) + `format_adherence` (returned ONLY inline code?) + `length_efficiency` (words; MiMo is token-efficient -> lower is better)

### Data Flow
framework x fixture -> render prompt -> dispatch MiMo (real) -> extract function -> run hidden suite in isolated child -> assertion-pass + format + length -> composite per combo -> `results.json` + `runs/*.json` -> rank -> `synthesis.md` -> integration.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

Integration touches shared skill files + a shared schema (model-profiles.json) + the live model slug, so the affected-surface inventory applies.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `cli-opencode/assets/prompt_templates.md` | Docs — prompt guidance (no MiMo per-model section yet) | add MiMo-V2.5-Pro COSTAR scaffold (Template 15) | `rg "MiMo"` / `rg "COSTAR"` shows new section |
| `cli-opencode/assets/prompt_quality_card.md` | Docs — per-model overrides | add MiMo override -> COSTAR default, RACE fallback, MiMo != MiniMax note | `rg "COSTAR"` shows MiMo override row |
| `sk-prompt-models/references/pattern-index.md` | Sentinel index (link-only) | add MiMo prompt-framework row -> cli-opencode canonical location | `rg -i "mimo"` shows row pointing to cli-opencode |
| `sk-prompt/assets/model-profiles.json` | Producer — model registry | update `mimo-v2.5-pro` notes -> COSTAR/RACE-lean finding | `jq .` valid; entry shape unchanged |

Required inventories:
- Framework consumers: `rg -n "mimo-v2.5-pro|xiaomi-token-plan-ams" .opencode/skills` — every prompt-guidance hit reflects the COSTAR default.
- Registry consumers: `rg -n "model-profiles" .opencode/skills --glob '*.ts' --glob '*.md'`.
- Invariant: model-profiles.json stays valid JSON; the `mimo-v2.5-pro` registry `id` (internal key) is unchanged — only the human-facing strengths note updates.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Stand up the rig
- [x] Build `eval/` lean self-contained port of `120/003`: `frameworks.cjs` (5 scaffolds), `fixtures.cjs` (2 fixtures + hidden suites)
- [x] Write `run-mimo-bench.cjs` (dispatch to `xiaomi-token-plan-ams/mimo-v2.5-pro`, no `--agent`, timeout + retry), `extract.cjs`, `runner-child.cjs`, `runtests.cjs`
- [x] Seed 5 framework variants (RCAF/RACE/CIDI/TIDD-EC/COSTAR) + lean/medium/dense pre-planning framing

### Phase 2: Run the benchmark
- [x] Run all 10 combos (5 frameworks x 2 fixtures), 1 real dispatch each, budget ~10 calls
- [x] Score (deterministic: assertion-pass + format + length); handle `cidi__chunk` transient retry
- [x] Write `eval/synthesis.md` (ranked + winner + key findings + caveats)

### Phase 3: Integrate + verify
- [x] Integrate winner into cli-opencode prompt assets + sentinel pattern-index + sk-prompt card
- [x] `jq`/`rg` verification of integration; record reproducibility commands
- [x] `validate.sh --strict` on 004
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Rig sanity | Function extraction + isolated test execution | `runner-child.cjs` / `runtests.cjs` on captured outputs |
| Live benchmark | 5 frameworks x 2 fixtures on MiMo-V2.5-Pro | `run-mimo-bench.cjs` + deterministic scoring |
| Integration | Winner present + slug correct | `rg` / `jq` / `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `120/003` eval rig pattern | Internal | Green | Proven bake-off shape exists; ported leaner |
| Live MiMo-V2.5-Pro (cli-opencode) | External | Green | Confirmed via live probe; 10/10 dispatches succeeded |
| 002 dispatch fix (no `--agent general`) | Internal | Green | Required so dispatch does not fall back; completed first |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Benchmark produces no clear winner, or integration breaks validation/JSON.
- **Procedure**: Rig/state lives only under `126/004/eval/` (additive). Integration edits are to ~4 tracked cli-opencode + sk-prompt files — `git checkout -- <files>` reverts. No migrations, no runtime code.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Stand up rig) ──► Phase 2 (Run benchmark) ──► Phase 3 (Integrate + verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Stand up rig | 002 dispatch fix | Run benchmark |
| Run benchmark | Stand up rig, live MiMo | Integrate + verify |
| Integrate + verify | Run benchmark (winner) | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Stand up rig | Med | Port + scorer + harness |
| Run benchmark | Med | 10 real dispatches, avg ~18s each (+1 retry) |
| Integrate + verify | Low | 4 doc/schema edits + strict validate |
| **Total** | | **Single focused session** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Rig + state confined to `eval/` (additive, no shared-state writes)
- [x] Integration edits limited to 4 named files
- [x] Reproducibility commands recorded in `synthesis.md`

### Rollback Procedure
1. Revert the 4 integration files: `git checkout -- cli-opencode/assets/prompt_templates.md cli-opencode/assets/prompt_quality_card.md sk-prompt-models/references/pattern-index.md sk-prompt/assets/model-profiles.json`
2. `eval/` may be left in place (additive evidence) or removed wholesale
3. Verify: `jq .` on model-profiles.json; `rg "COSTAR"` shows no MiMo override

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A — no runtime code, no schema migrations
<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN (~140 lines)
- Core + Verification additions
- Phase dependencies, effort estimation
- Enhanced rollback procedures
-->
