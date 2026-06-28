---
title: "Feature Specification: Phase 2: framework-bakeoff [template:level_1/spec.md]"
description: "kimi-k2.7-code shipped with an unverified RCAF default; this phase ran the model-benchmark bakeoff (run 006) to find its best prompt framework but saturated on easy fixtures (TIE). Superseded by phase 004 (run 007: COSTAR promoted, empirical)."
trigger_phrases:
  - "kimi k2.7 framework bakeoff"
  - "prompt framework benchmark"
  - "model-benchmark run 006"
  - "framework-bakeoff phase"
  - "spec core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/149-kimi-k2-7-code-support/002-framework-bakeoff"
    last_updated_at: "2026-06-15T11:40:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Bakeoff 006 complete; verdict TIE, correctness saturated"
    next_safe_action: "Phase 003 promotes the TIE finding into registry"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-workflows/deep-improvement/assets/model_benchmark/benchmark-profiles/kimi-k2.7-frameworks.json"
      - ".opencode/skills/sk-prompt-models/benchmarks/006-kimi-k2.7-prompt-framework/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/002-framework-bakeoff"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 2: framework-bakeoff

> **SUPERSEDED BY PHASE 004 (run 007).** Run 006 below DID happen and DID return a TIE, but its easy fixtures saturated the correctness gate, so it could not separate the frameworks and the verdict was inconclusive. The authoritative framework verdict for `kimi-k2.7-code` comes from phase 004's run 007 on strict adversarial validators: **COSTAR promoted (primary), TIDD-EC fallback, RCAF retired**, status **empirical**. That is what the registry (`model-profiles.json`), `kimi-k2.7-code.md`, and `_index.md` now hold. The run-006 findings here are retained as the **interim/historical** result; treat any RCAF-as-default statement below as the short-lived interim default it was, not the packet's final outcome.

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete (bakeoff 006 ran; verdict TIE, correctness saturated) |
| **Created** | 2026-06-15 |
| **Branch** | `system-speckit/027-xce-research-based-refinement` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 3 |
| **Predecessor** | 001-model-registration |
| **Successor** | 003-promote-results |
| **Handoff Criteria** | Bakeoff run 006 produces a WINNER/TIE/INCONCLUSIVE verdict plus a per-framework leaderboard, with the correctness gate not silently saturating |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the kimi-k2-7-code-support specification.

**Scope Boundary**: This phase owns the empirical prompt-framework bakeoff for `kimi-k2.7-code` only. It creates a benchmark profile and runs the deep-loop model-benchmark machinery to produce a verdict. It does NOT edit the registry or model reference doc; that promotion is Phase 003's job.

**Dependencies**:
- Phase 001 (model-registration) complete: `kimi-k2.7-code` is wired into `.opencode/skills/sk-prompt-models/assets/model-profiles.json` with framework RCAF marked `default-unverified`.
- The deep-loop model-benchmark lane via `/deep:model-benchmark` and the canonical `framework-bakeoff.json` profile.
- A live `kimi-for-coding/k2p7` slug (Kimi For Coding subscription pool) and a non-Kimi LLM judge for grading.

**Deliverables**:
- A bakeoff profile at `.opencode/skills/deep-loop-workflows/deep-improvement/assets/model_benchmark/benchmark-profiles/kimi-k2.7-frameworks.json`.
- A completed run `006-kimi-k2.7-prompt-framework` with outputs under `.opencode/skills/sk-prompt-models/benchmarks/006-kimi-k2.7-prompt-framework/` (`results.json`, `aggregate.json`, `synthesis.md`).
- A verdict (WINNER | TIE | INCONCLUSIVE) and per-framework leaderboard that Phase 003 promotes.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`kimi-k2.7-code` was registered in Phase 001 with a reasoned-but-unverified prompt framework: `recommended_frameworks.primary` is `rcaf` and `status` is `default-unverified`, with every evidence field null. Sibling models in the rotation earned their framework choices empirically (MiniMax via run `003` → TIDD-EC, MiMo via run `004` → COSTAR), so the kimi default is the only guess in the registry. Dispatch guidance for a 256k coding model should not rest on convention alone.

### Purpose
Empirically determine kimi-k2.7-code's best prompt framework by running the model-benchmark bakeoff over the full five-framework set, producing a verdict and leaderboard that Phase 003 can promote into the registry.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Create the bakeoff profile `kimi-k2.7-frameworks.json` cloned from `framework-bakeoff.json`, retargeted to kimi and to fixtures that actually exist.
- Run `/deep:model-benchmark:auto` with run-label `006-kimi-k2.7-prompt-framework`, scorer `5dim`, LLM judge, five iterations.
- Capture the verdict, per-framework leaderboard, and synthesis under the run output folder.

### Out of Scope
- Editing `model-profiles.json` or `references/models/kimi-k2.7-code.md` - that promotion is Phase 003.
- Re-benchmarking sibling models (MiniMax, MiMo) - their runs `003`/`004` stand.
- Changing the model-benchmark machinery itself - this phase consumes it as-is.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/deep-loop-workflows/deep-improvement/assets/model_benchmark/benchmark-profiles/kimi-k2.7-frameworks.json` | Create | Bakeoff profile cloned from `framework-bakeoff.json`, retargeted to kimi-k2.7-code + real fixtures |
| `.opencode/skills/sk-prompt-models/benchmarks/006-kimi-k2.7-prompt-framework/` | Create | Run outputs: `results.json`, `aggregate.json`, `synthesis.md` (written by the command) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Create the bakeoff profile retargeted to kimi-k2.7-code | `kimi-k2.7-frameworks.json` exists; `models` is `[{ "executor":"cli-opencode", "provider":"kimi-for-coding", "model_slug":"k2p7", "variant":"default" }]`; `frameworks` is the full five `["rcaf","race","cidi","tidd-ec","costar"]` |
| REQ-002 | Point the profile at fixtures that exist | Every entry in `fixtures` resolves to a real file under `benchmark-fixtures/` (e.g. `t3-bugfix-in-context`, `t3-strict-acceptance`, `harder-semver-compare`, `validate-semver`); the template's `t3-lower-bound`/`t3-compare-versions` are NOT referenced |
| REQ-003 | Run the bakeoff with an LLM judge | `/deep:model-benchmark:auto <profile> --spec-folder=<this 002 folder> --run-label=006-kimi-k2.7-prompt-framework --scorer=5dim --grader=llm --executor=cli-opencode --model=openai/gpt-5.5 --iterations=5` completes |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Produce a verdict and leaderboard | Run output contains a WINNER \| TIE \| INCONCLUSIVE verdict and a per-framework leaderboard in `synthesis.md` |
| REQ-005 | Keep the correctness gate honest | The `correctnessGate` (threshold 1.0) does not silently saturate; if all frameworks pass correctness, the ranking discriminator is named in the synthesis |
| REQ-006 | Judge is a non-Kimi model | The grader model is not kimi-k2.7-code or any Kimi variant, avoiding self-grading bias |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Run `006-kimi-k2.7-prompt-framework` completes and writes `results.json`, `aggregate.json`, and `synthesis.md` under `.opencode/skills/sk-prompt-models/benchmarks/006-kimi-k2.7-prompt-framework/`.
- **SC-002**: The synthesis records a verdict (WINNER \| TIE \| INCONCLUSIVE) and a per-framework leaderboard that Phase 003 can promote without re-running the bakeoff.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `kimi-for-coding/k2p7` live slug | Bakeoff cannot dispatch the model-under-test | Re-verify with `opencode models kimi-for-coding` before the run; slug drifts on Kimi/Moonshot |
| Risk | Correctness gate saturates (all frameworks pass) | Verdict crowns a winner on noise | Report the discriminator (format adherence, token efficiency) explicitly, as runs `003`/`004` did |
| Risk | Self-grading bias if judge is a Kimi model | Inflated or skewed scores | Pin the LLM judge to a non-Kimi model (`openai/gpt-5.5`) |
| Dependency | `kimi-for-coding` quota pool exhausted | Run stalls with no fallback | `fallback_target` is null; defer and re-run rather than retry the same pool |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- ~~If the verdict is TIE or INCONCLUSIVE, does Phase 003 keep RCAF `default-unverified` or pick the marginal leader?~~ **Resolved (interim, superseded):** verdict was TIE (correctness saturated); Phase 003 kept `default-unverified` as an interim hold. Phase 004's run 007 later superseded this and promoted COSTAR (empirical, RCAF retired).
- ~~Are the fixtures enough sample to separate frameworks if the gate saturates?~~ **Resolved + acted on:** they were not — correctness saturated across all five frameworks. The follow-up bakeoff with harder, less-saturating fixtures became phase 004 (run 007 on strict validators), which DID discriminate.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->


<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-003
REQ-004
REQ-005
REQ-006
REQ-007
REQ-008
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
