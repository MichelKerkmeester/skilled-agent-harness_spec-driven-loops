---
title: "Feature Specification: MiMo-V2.5-Pro prompt-framework benchmark"
description: "Empirically benchmark which prompt framework (RCAF/RACE/CIDI/TIDD-EC/COSTAR) works best when MiMo-V2.5-Pro is driven by another AI through cli-opencode, using real model dispatches via the deep-improvement model-benchmark lane, then integrate the winning framework into the cli-opencode MiMo dispatch path."
trigger_phrases:
  - "mimo prompt framework benchmark"
  - "mimo-v2.5-pro best framework"
  - "mimo tidd-ec rcaf benchmark"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/126-cli-opencode-mimo-pro-optimization/004-mimo-prompt-framework-benchmark"
    last_updated_at: "2026-06-01T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Phase-004 benchmark complete; COSTAR winner integrated; strict validate PASSED"
    next_safe_action: "Packet complete — close 126"
    blockers: []
    key_files:
      - ".opencode/skills/cli-opencode/assets/prompt_templates.md"
      - ".opencode/skills/cli-opencode/assets/prompt_quality_card.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-126-004"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 4: mimo-prompt-framework-benchmark

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-01 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 (follows 003 research; mirrors `120/003`) |
| **Predecessor** | 003-mimo-efficiency-deep-research |
| **Successor** | None |
| **Handoff Criteria** | Winning prompt framework for MiMo-V2.5-Pro identified from real dispatches; `synthesis.md` ranks all frameworks; winner integrated into the cli-opencode MiMo dispatch path (prompt template + quality card + pattern-index) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

Mirrors `120/003` (the MiniMax prompt-framework benchmark, which found TIDD-EC + dense pre-planning beat RCAF). The user wants the same treatment for MiMo: "what prompting techniques work best for MiMo if used by another AI through cli-opencode," like the SWE-1.6 and MiniMax-2.7 benchmarks. Phase 002 ensures MiMo dispatches cleanly through the deep-improvement model-benchmark lane (no `--agent general`), and a live probe confirmed `xiaomi-token-plan-ams/mimo-v2.5-pro` responds — so **real dispatches are feasible**, not scaffold-only.

**Vehicle**: the generalized model-benchmark lane (Lane B) of `deep-improvement` (packet 121) is the intended harness ("check deep-improvement skill"); the `120/003` eval-rig pattern (framework variants + grader + synthesis) is the proven fallback shape if Lane B's fixture model does not fit a prompt-framework bake-off.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
We have no empirical evidence for which prompt framework yields the best MiMo-V2.5-Pro output when another AI drives it through cli-opencode. The 001 prompt template carries a placeholder framework. Per-model framework winners diverge (SWE-1.6 → RCAF; MiniMax → TIDD-EC + dense), so MiMo's best framework must be measured, not assumed.

### Purpose
Benchmark candidate prompt frameworks (RCAF, RACE, CIDI, TIDD-EC, COSTAR) on real MiMo-V2.5-Pro dispatches, rank them, pick the empirically-best framework + pre-planning density, and integrate the winner into the cli-opencode MiMo dispatch path.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Stand up (or reuse) an eval rig with coding fixtures + a deterministic checks + grader harness, parameterized for the `xiaomi-token-plan-ams/mimo-v2.5-pro` dispatch.
- Seed framework variants (RCAF/RACE/CIDI/TIDD-EC/COSTAR) + a small pre-planning-density hill-climb.
- Run real MiMo dispatches (or a reduced-fixture subset for cost), score, and write `synthesis.md` with the ranking + winner + key findings + caveats.
- Integrate the winner into `cli-opencode/assets/prompt_templates.md` (MiMo template), `prompt_quality_card.md` (per-model override), and `sk-prompt-models/references/pattern-index.md`.

### Out of Scope
- Re-deriving the benchmark harness from scratch if Lane B / the `120/003` rig can be reused.
- TTS/omni MiMo models.
- Cross-CLI propagation (MiMo is reachable only via cli-opencode; the override belongs in cli-opencode + sk-prompt master).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `004-.../eval-rig/**`, `eval-loop/**` | Create | Fixtures, variants, scorer, run state, `synthesis.md` |
| `.opencode/skills/cli-opencode/assets/prompt_templates.md` | Modify | MiMo template → winning framework |
| `.opencode/skills/cli-opencode/assets/prompt_quality_card.md` | Modify | MiMo per-model override → winning framework |
| `.opencode/skills/sk-prompt-models/references/pattern-index.md` | Modify | MiMo prompt-framework row |
| `.opencode/skills/sk-prompt/assets/model-profiles.json` | Modify | MiMo strengths note → responds best to <winner> |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Frameworks benchmarked on real MiMo dispatches | `synthesis.md` ranks ≥5 frameworks with scores from real `mimo-v2.5-pro` runs (or a documented reduced subset); winner named |
| REQ-002 | Winner integrated into cli-opencode | MiMo prompt template + quality-card override name the winning framework with the evidence pointer |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Caveats documented | `synthesis.md` records sample size, grader mode, noise floor, and any hard-gated fixtures |
| REQ-004 | Deep-improvement Lane B evaluated | A note on whether Lane B hosted the run or the `120/003` rig pattern was used, and why |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `synthesis.md` present with a full framework ranking + named winner + caveats.
- **SC-002**: cli-opencode MiMo dispatch path carries the winning framework + evidence pointer.
- **SC-003**: If live dispatch is blocked (quota/credits), the rig is left ready-to-run with a documented HALT and a clear re-run command.
- **SC-004**: `validate.sh --strict` on this folder passes (Exit 0).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Token-plan quota/credits exhausted mid-run | Med — partial results | Use free `opencode/mimo-v2.5-free` for iteration; reduced fixture subset; document HALT + re-run command |
| Risk | Single-sample noise | Med — close margins | Report noise floor; flag margins under threshold as directional |
| Dependency | 002 dispatch fix (no `--agent general`) | High — benchmark dispatch fails otherwise | 002 completes first |
| Dependency | 003 research (framework seeds, context budget) | Low — improves seeding | 003 completes first |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Does MiMo-V2.5-Pro favor guardrail-heavy framing (TIDD-EC) like MiniMax, or a leaner framework (RCAF) like SWE-1.6? (The benchmark answers this.)
- Is dense or medium pre-planning better for MiMo? (Hill-climb settles it.)
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-001 | Reproducibility | `synthesis.md` records the exact dispatch command, fixture set, and scorer/grader mode |
| NFR-002 | Cost transparency | Number of real dispatches + which model (pro vs free) recorded |
| NFR-003 | No secrets | Dispatch uses configured provider auth; no keys in artifacts |
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- **Live dispatch blocked**: leave the rig ready-to-run; document the HALT + re-run command; mark REQ-001 as deferred-with-reason.
- **Grader fallback**: if the grader returns fenced output, handle via the documented fallback and mark the dimension directional.
- **Tie within noise**: prefer the simpler framework (fewer tokens) and note the tie.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

Moderate-to-high. Real model dispatches, a scoring harness, framework-variant management, and integration of the winner across three skill surfaces. De-risked by reusing the `120/003` rig pattern / deep-improvement Lane B and by the confirmed-live probe, but live-run cost and single-sample noise are the main uncertainties.
<!-- /ANCHOR:complexity -->
