---
title: "Feature Specification: Design — 3-layer prompt-knowledge architecture + data contract"
description: "Ratify Architecture A (sk-prompt-models as the per-model prompt-craft hub) and lock the recommended_frameworks data contract, the per-model profile template, and the single prompt-composition precedence rule that the remaining phases implement."
trigger_phrases:
  - "prompt knowledge architecture decision"
  - "recommended_frameworks schema"
  - "per-model profile template"
  - "prompt precedence rule"
  - "model-craft hub design"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/130-prompt-knowledge-layering/001-design-architecture-and-data-contract"
    last_updated_at: "2026-06-02T00:00:00Z"
    last_updated_by: "opus-orchestrator"
    recent_action: "Design ratified"
    next_safe_action: "Begin phase 002 (repair sync substrate) and phase 003 (land recommended_frameworks data)"
    blockers: []
    key_files:
      - ".opencode/skills/sk-prompt/assets/model-profiles.json"
      - ".opencode/skills/sk-prompt-models/SKILL.md"
      - ".opencode/skills/sk-prompt/assets/cli_prompt_quality_card.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-130-001-design"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Prose home -> Architecture A (sk-prompt-models/references/models/)"
      - "Model scope -> all active small models at equal depth"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Design — 3-layer prompt-knowledge architecture + data contract

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-06-02 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 8 |
| **Predecessor** | None |
| **Successor** | 002-repair-and-extend-sync-substrate |
| **Handoff Criteria** | Architecture A ratified; `recommended_frameworks` schema, per-model profile template, and precedence rule all locked below and ready for phases 002–008 to implement |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the prompt-knowledge layering spec. It is design-only: it produces the contracts the other seven phases implement. No production skill files are modified in this phase.

**Scope Boundary**: Author the architecture decision + three contracts (data schema, profile template, precedence rule). No edits to `sk-prompt`, `sk-prompt-models`, or `cli-*` source in this phase.

**Dependencies**:
- Audit findings + the user's two locked decisions (Architecture A; all active small models at equal depth).

**Deliverables**:
- The ratified architecture (§8 Architecture Decision).
- The `recommended_frameworks` JSON schema (§9).
- The per-model profile template (§10).
- The single prompt-composition precedence rule (§11).

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The remaining phases need a single, ratified design to implement against: where per-model prompt-craft prose lives, the exact shape of the `recommended_frameworks` data field, the per-model profile structure, and one delegation rule that replaces the contradictory ones in use today. Without this lock-step contract, the phases would drift.

### Purpose
Produce the ratified 3-layer architecture and the three contracts so phases 002–008 are pure implementation against a frozen design.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Architecture decision (A vs B vs C) with rationale and rejected alternatives.
- The `recommended_frameworks` schema added to `model-profiles.json` (definition only; population is phase 003).
- The per-model profile template (definition only; authoring is phases 004–005).
- The prompt-composition precedence rule (definition only; wiring is phase 007).

### Out of Scope
- Editing any `sk-prompt`, `sk-prompt-models`, or `cli-*` source file — that is phases 002–008.
- Re-running benchmarks — existing 120/003 + 126/004 evidence is reused.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| This spec.md | Author | Records the ratified design + the three contracts (the deliverable) |
| ./plan.md, ./tasks.md | Author | Phase plan + task list pointing at the downstream phases |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Ratify the prose-home architecture | §8 states Architecture A with rationale + the two rejected alternatives |
| REQ-002 | Define `recommended_frameworks` schema | §9 gives a complete, additive JSON schema with field semantics + the data↔prose round-trip seam |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Define the per-model profile template | §10 gives a fixed 6-section skeleton with front-matter `model_id` |
| REQ-004 | Define the single precedence rule | §11 gives a 3-tier rule that resolves the cli-devin-mandate vs @prompt-improver-escalation conflict |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A downstream phase can implement its slice using only §8–§11 without re-litigating the architecture.
- **SC-002**: The `recommended_frameworks` schema is additive — readers that don't know the field keep working.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Maturing sk-prompt-models from router→hub re-bloats it | Med | SKILL.md stays thin-at-entry; per-model prose loads on-demand under references/models/ |
| Risk | Carried-forward MiniMax M3 evidence presented as current | Low | `status: carried` in the schema makes inheritance explicit |
| Dependency | Benchmark synthesis docs (120/003, 126/004) | Evidence rows cite them | Reused read-only; no re-benchmark |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- For models without direct benchmark evidence (qwen3.6, deepseek-v4-pro, kimi-k2.6, glm-5.1), mark `recommended_frameworks.status` as `default-unverified` (finalized in phase 003).
<!-- /ANCHOR:questions -->

---

## 8. ARCHITECTURE DECISION (ratified)

**Decision: Architecture A — `sk-prompt-models` becomes the per-model prompt-craft content hub.**

Three layers, one owner per concept:

| Layer | Owner | Owns |
|-------|-------|------|
| Framework craft (model-agnostic) | `sk-prompt` | 7 frameworks, DEPTH, CLEAR, canonical fast-path card, `model-profiles.json` DATA |
| Per-model craft | `sk-prompt-models/references/models/<id>.md` | framework choice + scaffold + evidence + gotchas, per model |
| Executor mechanics | `cli-*` | binary flags, `--variant`/`--agent`, `</dev/null`, permissions, fallback |

**Rationale:** Cleanest orthogonal split; fork-proof for models already dispatchable from two executors (deepseek-v4-pro, kimi-k2.6, glm-5.1 run via both cli-devin and cli-opencode); matches the user's instinct and CLAUDE.md's existing "canonical home for model specifics" language. The `recommended_frameworks` DATA stays in `sk-prompt/assets/model-profiles.json` (moving it would break ~15 backlinks for no functional gain).

**Rejected alternatives:**
- **B (prose local to each cli-X):** lowest disruption, best locality, but forks per-model craft across the two executors for the already-dual-executor models. Deferred-migration trap.
- **C (prose inside sk-prompt next to the registry):** single hub without touching the sentinel, but grows `sk-prompt` past pure framework theory.

**Cost accepted:** `sk-prompt-models`'s "stay thin / content lives in the executor" ALWAYS/NEVER rules are rewritten in phase 004 (SKILL.md stays short; the weight moves to on-demand `references/models/` files).

## 9. DATA CONTRACT — `recommended_frameworks` (added to each model entry)

Additive, optional object; sibling to the existing `capability` object. IDs reference `framework-registry.json`.

```jsonc
"recommended_frameworks": {
  "primary": "tidd-ec",                 // framework id (lowercase)
  "fallback": "rcaf",                   // id, or null
  "avoid": ["cidi"],                    // ids that empirically underperform (optional)
  "preplanning_density": "dense",       // lean | medium | dense
  "evidence": {
    "benchmark": "120/003",             // spec packet id = provenance key (DATA, not a code-comment id)
    "primary_score": 0.767,
    "fallback_score": 0.742,
    "sample": "7-fixture rig, real MiniMax M2.7 runs",
    "confidence": "medium"              // low | medium | high
  },
  "profile_ref": "sk-prompt-models/references/models/minimax-m3.md",
  "carried_from": "minimax-2.7",        // optional; when a sibling's finding is inherited un-rebenchmarked
  "status": "carried"                   // empirical | carried | default-unverified
}
```

**Round-trip seam:** `recommended_frameworks.profile_ref` ↔ the profile's front-matter `model_id`. CI-checkable with `jq` + `test -f`. This is the only data→prose link; everything else references by id.

## 10. PER-MODEL PROFILE TEMPLATE (`references/models/<id>.md`)

Front-matter: `title`, `model_id` (matches `model-profiles.json` id), `profile_of` (path to the registry), `status`, `last_benchmarked`. Fixed 6-section body:

1. **Identity** — slug, context window, quota pool, executor path(s).
2. **Recommended Framework** — primary / fallback / avoid + density + the counter-intuitive note.
3. **Benchmark Evidence** — packet id, result, sample, confidence, the discriminator (correctness vs format vs tokens).
4. **Tuned Template Snippet** — the model-specific scaffold; links to the generic framework in `patterns_evaluation.md`.
5. **Dispatch Gotchas** — table sourced from `model-profiles.json` capability fields (`variant_flag`, `agent_policy`, `format_mode`, `quota_pool`) + the `</dev/null` non-TTY rule + fallback target.
6. **See Also** — canonical pointers only; no bodies copied.

## 11. PRECEDENCE RULE (one rule, identical across all 5 CLI SKILL.md)

> **Prompt-composition precedence (all cli-X):**
> 1. **Fast path (default).** Build from the canonical quality card (`sk-prompt/assets/cli_prompt_quality_card.md` via the local mirror); pick the framework from the canonical table.
> 2. **Model override (mandatory when dispatching a profiled model).** If the target model has a `recommended_frameworks` entry / a `references/models/<id>.md` profile, that profile overrides the cross-model default. *(This replaces cli-devin's bespoke "MUST use sk-prompt" mandate — the obligation becomes "honor the model profile," which generalizes to every model.)*
> 3. **Deep path (escalation).** Dispatch `@prompt-improver` (Task tool) — never load full `sk-prompt` inline — when ANY of: complexity ≥ 7/10; compliance/privacy/security signal; >1 stakeholder; >1 ambiguous requirement; or the fast-path CLEAR can't clear the floor.

---

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
