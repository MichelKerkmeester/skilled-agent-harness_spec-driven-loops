---
title: "Feature Specification: MiniMax 2.7 prompt-framework benchmark"
description: "Benchmark prompt frameworks (RCAF/RACE/CIDI/TIDD-EC/COSTAR) against coding fixtures with real MiniMax M2.7 calls (reusing the 113 eval rig), pick the empirically-best framework, and integrate it into the cli-opencode / sk-prompt-models dispatch path."
trigger_phrases:
  - "minimax prompt framework benchmark"
  - "minimax eval rig"
  - "minimax framework bake-off"
  - "best prompt framework minimax"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/019-cli-opencode-minimax-optimization/003-minimax-prompt-framework-benchmark"
    last_updated_at: "2026-05-28T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Benchmark complete; winner TIDD-EC+dense integrated"
    next_safe_action: "Optional: re-run for tighter confidence or cross-model validation"
    blockers: []
    key_files:
      - "eval-loop/synthesis.md"
      - ".opencode/skills/cli-opencode/assets/prompt_templates.md"
      - ".opencode/skills/sk-prompt/assets/model-profiles.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/003-minimax-prompt-framework-benchmark"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 1: minimax-prompt-framework-benchmark

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-05-28 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 3 |
| **Predecessor** | 002-minimax-efficiency-deep-research |
| **Successor** | None |
| **Handoff Criteria** | `eval-loop/synthesis.md` names a winning framework with scores; winner integrated into cli-opencode prompt assets + sentinel; slug corrected; strict validate passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the Benchmark prompt frameworks for MiniMax 2.7 against coding fixtures and integrate the empirically-best framework specification.

**Scope Boundary**: Benchmark + integrate the winning prompt framework for MiniMax M2.7 via cli-opencode. Reuse the 113 eval rig (fixtures, rubric, deterministic checks, grader, loop) — only the dispatch layer is new. No cross-model validation (113 Phase 6/7 equivalent) unless requested later.

**Dependencies**:
- 113's `002-eval-rig/` + `003-eval-loop/scripts/` (the reusable rig + loop)
- Live MiniMax provider via cli-opencode (`minimax/MiniMax-M2.7`, auth in `~/.local/share/opencode/auth.json`)
- claude grader via cli-claude-code; the 7 sk-prompt frameworks in `sk-prompt/references/patterns_evaluation.md`

**Deliverables**:
- A ported eval rig + `dispatch-minimax.cjs` + 5 framework variants
- `eval-loop/synthesis.md` ranking the frameworks + naming the winner
- Winner integrated into cli-opencode prompt assets + sentinel pattern-index + sk-prompt card; slug corrected to `minimax/MiniMax-M2.7`

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
120/002's research recommended a prompt framework for MiniMax 2.7 by desk analysis only — it never ran the model, so the recommendation is unvalidated. For SWE-1.6 (packet 113) the best framework (RCAF) was found empirically by running the model against fixtures and scoring. MiniMax has no such empirical result.

### Purpose
Determine the empirically-best prompt framework for MiniMax M2.7 by running it against the 113 coding fixtures under each candidate framework, then integrate the winner into the dispatch path.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Port the 113 eval rig (fixtures + 5-dim rubric + deterministic checks + claude grader + cache + dry-run + loop) into this folder
- Add `dispatch-minimax.cjs` (opencode run `minimax/MiniMax-M2.7`) + seed 5 framework variants (RCAF/RACE/CIDI/TIDD-EC/COSTAR)
- Run the benchmark (~50-60 real MiniMax calls), converge, synthesize a ranked result + winner
- Integrate the winner into cli-opencode prompt assets + sentinel pattern-index + sk-prompt card; correct the MiniMax slug + context_length

### Out of Scope
- Cross-model validation of the winner against other models (113 Phase 6/7) - separate effort if wanted
- Rebuilding the rig from scratch - we reuse 113's
- The `-highspeed` variant - benchmark uses standard `minimax/MiniMax-M2.7`

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `120/003/eval-rig/**` + `eval-loop/**` | Create | Ported rig + loop + new `dispatch-minimax.cjs` + variant seeds + state |
| `.opencode/skills/cli-opencode/assets/prompt_templates.md` | Modify | MiniMax winning-framework section + per-model contract |
| `.opencode/skills/cli-opencode/assets/prompt_quality_card.md` | Modify | MiniMax framework-selection row (empirical winner) |
| `.opencode/skills/sk-prompt-models/references/pattern-index.md` | Modify | MiniMax prompt-framework row(s) |
| `.opencode/skills/sk-prompt/assets/cli_prompt_quality_card.md` | Modify | Cross-CLI MiniMax note |
| `.opencode/skills/sk-prompt/assets/model-profiles.json` + `cli-opencode/{SKILL.md,references/cli_reference.md}` | Modify | Correct slug `minimax/minimax-2.7` → `minimax/MiniMax-M2.7`; set `context_length: 204800` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Ported rig passes dry-run before any real call | `dry-run.cjs` exits 0 on canned outputs |
| REQ-002 | Benchmark runs real MiniMax M2.7 and ranks frameworks | `eval-loop/` JSONL has scored iterations; `synthesis.md` ranks 5 frameworks + names a winner; dispatch count ≤ budget cap |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Winner integrated + slug corrected | cli-opencode prompt assets + sentinel show the winner; `rg "minimax/MiniMax-M2.7"` present and `minimax/minimax-2.7` gone; `jq .` valid on model-profiles.json |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A clear winning framework emerges with a score margin above the fixture-set noise floor (~0.02-0.08), documented in `synthesis.md`
- **SC-002**: The winner is integrated into the cli-opencode/MiniMax dispatch path (mirroring 113's cli-devin uplift) and the slug/context config is corrected; 003 + 120 strict-validate pass
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Live MiniMax M2.7 via cli-opencode | High — no benchmark without it | Confirmed live (`opencode models minimax`); 429-backoff + pause/resume from 113 loop |
| Dependency | claude grader via cli-claude-code | Med — drops D4 dimension if down | Confirm at dry-run; fall back to deterministic-only scoring |
| Risk | Pay-as-you-go cost on ~50-60 calls | Med | Budget cap enforced in loop config; cache dedups repeat (variant,fixture) pairs |
| Risk | Fixtures are SWE/cli-devin-flavored | Low-Med | Reuse as-is (general coding failure modes); retune only fix-001's flag allowlist |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Will MiniMax M2.7 favor the same framework as SWE-1.6 (RCAF), or a different one? (The whole point of running it.)
- Does `--variant high` change MiniMax behavior? (113-style ablation could be folded in as a hill-climb axis once a framework leader emerges.)
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
