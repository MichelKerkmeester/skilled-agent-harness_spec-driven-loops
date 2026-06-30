---
title: "Feature Specification: Phase 2: framework-bakeoff"
description: "Empirically determine GLM-5.2's best prompt framework by running the model-benchmark bakeoff over the framework set on strict adversarial validators, producing a verdict + leaderboard for phase 3 to promote."
trigger_phrases:
  - "glm-5.2 framework bakeoff"
  - "prompt framework benchmark"
  - "model-benchmark glm-5.2"
  - "framework-bakeoff phase"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/120-glm-5-2-support/002-framework-bakeoff"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Bakeoff 008 ran; COSTAR best-of-tied; separable"
    next_safe_action: "Promote in 003-promote-results"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-workflows/deep-improvement/assets/model_benchmark/benchmark-profiles/"
      - ".opencode/skills/sk-prompt-models/benchmarks/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-session/002-framework-bakeoff"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Best framework for GLM-5.2 = COSTAR (best-of-tied perfect tier); RCAF weakest (benchmark 008)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 2: framework-bakeoff

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
| **Status** | Complete |
| **Created** | 2026-06-28 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 3 (core) |
| **Predecessor** | 001-model-registration |
| **Successor** | 003-promote-results |
| **Handoff Criteria** | Bakeoff produces a WINNER/TIE/INCONCLUSIVE verdict + per-framework leaderboard, with the correctness gate not silently saturating |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the glm-5-2-support specification. It mirrors `149-kimi-k2-7-code-support/002-framework-bakeoff`, **applying the lesson learned there**: 149's run 006 used easy fixtures, saturated the correctness gate, and returned an inconclusive TIE — forcing a phase-4 redo on strict validators (run 007). This phase therefore uses **invalid-dominant strict adversarial validators from the start** so the frameworks separate on the first run.

**Scope Boundary**: This phase owns the empirical prompt-framework bakeoff for `glm-5.2` only. It creates a benchmark profile and runs the deep-loop model-benchmark machinery to produce a verdict. It does NOT edit the registry or model reference doc — that promotion is Phase 003's job.

**Dependencies**:
- Phase 001 complete: `glm-5.2` is registered with framework `CRAFT` marked `default-unverified`.
- The deep-loop model-benchmark lane via `/deep:model-benchmark` and the canonical `framework-bakeoff.json` profile.
- A live GLM-5.2 slug (from phase 1) and a non-GLM LLM judge (e.g. `openai/gpt-5.5`) for grading.

**Deliverables**:
- A bakeoff profile at `.opencode/skills/deep-loop-workflows/deep-improvement/assets/model_benchmark/benchmark-profiles/glm-5.2-frameworks.json`.
- A completed run `<next>-glm-5.2-prompt-framework` with outputs under `.opencode/skills/sk-prompt-models/benchmarks/<next>-glm-5.2-prompt-framework/` (`results.json`, `aggregate.json`, `synthesis.md`).
- A verdict (WINNER | TIE | INCONCLUSIVE) and per-framework leaderboard that Phase 003 promotes.

**Changelog**:
- When this phase closes, add the matching file to ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`glm-5.2` is registered in Phase 001 with a reasoned-but-unverified framework: `recommended_frameworks.primary` is `craft` and `status` is `default-unverified` (chosen from Z.AI prompting guidance, not a benchmark). Sibling models earned their framework choices empirically (MiniMax run 003 → TIDD-EC, MiMo run 004 → COSTAR, Kimi run 007 → COSTAR). Dispatch guidance for a flagship 1M-context coding model should not rest on doc-guidance alone.

### Purpose
Empirically determine glm-5.2's best prompt framework by running the model-benchmark bakeoff over the framework set on strict adversarial validators, producing a verdict and leaderboard that Phase 003 can promote into the registry.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Create the bakeoff profile `glm-5.2-frameworks.json` cloned from `framework-bakeoff.json`, retargeted to glm-5.2 and to fixtures that exist.
- Include `CRAFT` (the default-unverified pick) in the framework set alongside the standard comparison set (`costar`, `race`, `cidi`, `tidd-ec`, `rcaf`).
- Use invalid-dominant strict validators (the 149 run-007 discriminator pattern, e.g. `validate-ipv4` + `validate-date` + `validate-semver`) so correctness separates.
- Run `/deep:model-benchmark:auto` with a fresh run-label, scorer `5dim`, a non-GLM LLM judge, multiple iterations.
- Capture the verdict, per-framework leaderboard, and synthesis under the run output folder.

### Out of Scope
- Editing `model_profiles.json` or `references/models/glm-5.2.md` — that promotion is Phase 003.
- Re-benchmarking sibling models — their runs stand.
- Changing the model-benchmark machinery itself — this phase consumes it as-is.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/deep-loop-workflows/deep-improvement/assets/model_benchmark/benchmark-profiles/glm-5.2-frameworks.json` | Create | Bakeoff profile cloned from `framework-bakeoff.json`, retargeted to glm-5.2 + strict validators |
| `.opencode/skills/sk-prompt-models/benchmarks/<next>-glm-5.2-prompt-framework/` | Create | Run outputs: `results.json`, `aggregate.json`, `synthesis.md` (written by the command) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Create the bakeoff profile retargeted to glm-5.2 | `glm-5.2-frameworks.json` exists; `models` targets the live glm-5.2 slug via cli-opencode; `frameworks` includes `craft` plus the comparison set |
| REQ-002 | Point the profile at strict, non-saturating fixtures | Every entry in `fixtures` resolves to a real file; the set is invalid-dominant strict validators so a lax-but-plausible solution scores <1.0 |
| REQ-003 | Run the bakeoff with a non-GLM LLM judge | `/deep:model-benchmark:auto <profile> --spec-folder=<this 002 folder> --run-label=<next>-glm-5.2-prompt-framework --scorer=5dim --grader=llm --model=openai/gpt-5.5 --iterations=<n>` completes |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Produce a verdict and leaderboard | Run output contains a WINNER \| TIE \| INCONCLUSIVE verdict and a per-framework leaderboard in `synthesis.md` |
| REQ-005 | Keep the correctness gate honest | The correctness gate does not silently saturate; if all frameworks pass, the ranking discriminator (token efficiency, format adherence) is named — if it saturates anyway, trigger contingency phase 004 |
| REQ-006 | Judge is a non-GLM model | The grader is not glm-5.2 or any GLM variant, avoiding self-grading bias |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Run `<next>-glm-5.2-prompt-framework` completes and writes `results.json`, `aggregate.json`, and `synthesis.md`.
- **SC-002**: The synthesis records a verdict and a per-framework leaderboard that Phase 003 can promote without re-running the bakeoff (or, on saturation, an explicit hand-off to contingency phase 004).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | live glm-5.2 slug | Bakeoff cannot dispatch the model-under-test | Re-verify with `opencode models <provider>` before the run |
| Risk | Correctness gate saturates anyway (GLM-5.2 is very strong) | Verdict crowns a winner on noise / returns TIE | Strict validators chosen up front; if still saturated, escalate to contingency phase 004 (harder fixtures) |
| Risk | Self-grading bias if judge is a GLM model | Inflated or skewed scores | Pin the LLM judge to a non-GLM model (`openai/gpt-5.5`) |
| Risk | 1M-context invites over-exploration / long dispatch | Run stalls or times out | Bound fixture scope; size timeouts conservatively; record any gotcha for contingency phase 005 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Does CRAFT (the doc-guidance default) actually win, or does a sibling-favored framework (COSTAR/TIDD-EC) edge it on strict validators for GLM-5.2?
- If the verdict is TIE/INCONCLUSIVE despite strict validators, hand off to contingency phase 004 (even harder fixtures) — confirm the trigger with the operator.
- Does GLM's `reasoning_effort` (high/max via `--variant`) interact with framework choice? (Record any interaction for phase 3 / phase 5.)
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
