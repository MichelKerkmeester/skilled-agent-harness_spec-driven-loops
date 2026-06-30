---
title: "Feature Specification: glm-visual-refinement"
description: "Phase parent: implement the GLM-5.2 visual-refinement research recommendations to lift bento-tile quality"
trigger_phrases:
  - "005-glm-visual-refinement"
  - "glm visual refinement"
  - "bento refinement pipeline"
  - "spatial contract"
  - "skeleton-first 2d"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "anobel.com/005-glm-visual-refinement"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffolded phase parent + 6 children from the GLM-refinement research"
    next_safe_action: "Plan child 001-spatial-contract-and-gate (highest-ROI first move)"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-session"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Does skeleton-first 2D recover enough diagram tiles to justify the GPT-5.5 escalation cost?"
    answered_questions:
      - "Root cause is the layout PRIMITIVE (2D-constraint vs linear-flow), not the treatment label — see 004/research/research.md"
      - "Executor for any GPT-5.5 role = cli-opencode openai/gpt-5.5-fast --variant xhigh (fast variant confirmed)"
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN: merge/migration narratives, heavy docs (plan/tasks/checklist/decision-record/implementation-summary) — those live in child phase folders.
  REQUIRED: root purpose, sub-phase list, high-level outcome.
-->

# Feature Specification: glm-visual-refinement

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-06-29 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | anobel.com/005-glm-visual-refinement |
| **Predecessor** | anobel.com/004-bento-visuals (the generation run + the research that grounds this) |
| **Successor** | None |
| **Handoff Criteria** | Each child plans + validates independently; child 001 ships the contract + gate + measurement surface the later phases depend on |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 45-tile GLM-5.2 vision-to-code run (`../004-bento-visuals`) shipped only **27/45 = 60% SHIP** (mean audit 81.1). A 20-iteration GPT-5.5 research effort (`../004-bento-visuals/research/research.md`) found the gap is **one dominant cause, not many**: GLM-5.2 cannot self-resolve **2-D constraint layout** (coordinate placement + collision avoidance + a height budget). Tiles needing it — matrix / node / routing / funnel — score **35–58**; linear-flow tiles (table / timeline / list / donut) score **86–94**, a **~41-point primitive gap**. The audit also found 18 MiniMax-M3 FIX findings were produced and then discarded (single-shot pipeline, no feedback pass).

### Purpose
Implement the research program that closes that gap: stop asking GLM to *invent* geometry from prose, and instead (1) harden the text contract into mechanical invariants + a deterministic gate, (2) route tiles by layout primitive, (3) feed MiniMax-M3 findings back to GLM, (4) hand 2D-positioned tiles a pre-computed coordinate skeleton, (5) escalate the hardest skeletons to a GPT-5.5 author, and (6) gate adoption + re-measure. Target: SHIP **60% → 80–90%**, diagram-vs-linear delta **~41 → 8–20 pts**.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, tasks, and decisions live in the child phase folders below. Source of truth for every recommendation: `../004-bento-visuals/research/research.md` + `research/iterations/iter-r2-A*.md`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A six-phase implementation of the 7 research angles (A1–A7) + the 11-step recommended pipeline.
- Changes to the bento generation harness (`004-bento-visuals/scratch/.../gen-tile.mjs` + a new deterministic gate, primitive router, MiniMax fix-adapter, skeleton service).
- A final adoption gate + a measured re-run of the 45 tiles to verify the predicted lift.

### Out of Scope
- Implementation in this scaffolding pass (planning only — no code yet).
- Changing the approved house style, Product register (V4/M2/D6), or palette.
- Re-litigating the MiniMax-M3 auditor-of-record decision (settled).
- Non-bento surfaces / Open Design transport mechanics.

### Files to Change
Aggregate surface across phases; per-phase detail lives in each child's plan.md.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `004-bento-visuals/research/inputs/gen-tile.mjs` | Modify | 001,002,004,005 | The generator (durable copy; `dist/` holds the output tiles). Contract block, primitive routing, skeleton input |
| `.../research/inputs/` gate + adapter scripts (new) | Create | 001,003 | Deterministic DOM/CSS gate; MiniMax issue→fix-JSON adapter |
| skeleton service (new) | Create | 004,005 | Coordinate/safe-zone skeleton compute + GPT-5.5 author |
| adoption-gate + rerun harness (new) | Create | 006 | Final gate + measured 45-tile re-run |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> Each phase is an independently executable child spec folder. Implementation details live in the children. Ordered by the recommended pipeline + lift-per-effort; 001 is the highest-ROI first move and creates the measurement surface the rest depend on.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-spatial-contract-and-gate/ | A1+A2 — `SAFE_LINEAR_560` hard spatial contract (height budget, reserved title band, pre-cased eyebrow, on-dark token, no content `absolute`) + preflight metadata + deterministic DOM/CSS gate (overflow, title-zone, contrast, casing) + one failure-only repair pass | Draft |
| 2 | 002-primitive-routing/ | A3 — route tiles by layout primitive (linear-flow vs 2D-positioned) before generation; primitive-routed repair contract | Draft |
| 3 | 003-minimax-auditor-in-loop/ | A4 — MiniMax-M3 `issue`→audit-boolean fix router fed back to GLM (failure-only, generator≠auditor). **CONTINGENT / re-sequenced** (panel): tally the 18 FIX by defect-type first — if ≥70% are collisions, skip standalone A4 and fund 004; build only after 004 | Draft |
| 4 | 004-skeleton-first-2d/ | **A7 renderer-first** (panel-resolved): GLM emits a semantic plan; a deterministic renderer owns all pixel geometry for 2D-positioned tiles. Phase-0 plan-obedience pilot gates the build; best-of-3 varies a named axis → downgrade-to-linear (the geometry kernel) | Draft |
| 5 | 005-gpt5-5-skeleton-author/ | A6 — GPT-5.5 (cli-opencode `openai/gpt-5.5-fast --variant xhigh`) as a layout-**template selector** (not raw coordinates) + deterministic spatial validator. **CONTINGENT on 004's measured residual**; cost-capped escalation | Draft |
| 6 | 006-adoption-gate-and-rerun/ | Step 11 + validation — final adoption gate; measured re-run of the 45 tiles; verify SHIP-rate + diagram-delta lift vs the 60% / ~41-pt baseline | Draft |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next begins.
- 001 is a hard predecessor of 002–006 (it ships the gate + failure-JSON measurement surface).
- Run `validate.sh --recursive` on the parent to validate all phases as an integrated unit.
- Use `/speckit:resume anobel.com/005-glm-visual-refinement/[NNN-phase]/` to resume a specific phase.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001 | 002 | Contract + deterministic gate live; failure-JSON emitted per tile | Gate runs on the 45 tiles; SHIP/overflow/contrast measured |
| 002 | 003/004 | Tiles correctly classified linear vs 2D-positioned | Router output matches the manual primitive labels |
| 004 | 005 | Skeleton-first renders 2D tiles without GLM inventing coordinates | Overflow/collision metrics improve on 2D holdouts |
| 005 | 006 | GPT-5.5 skeleton escalation wired + cost-capped | A2 escalation only fires on 2D failures |
| 006 | (done) | Re-run shows SHIP ≥ ~80% and diagram-delta ≤ ~20 pts | Measured against the 60% / ~41-pt baseline |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Does skeleton-first 2D (phase 004) recover enough diagram tiles that the GPT-5.5 escalation (005) is worth its paid cost, or is the deterministic skeleton sufficient?
- Should the deterministic gate (001) block adoption outright or only trigger the repair pass?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Research source**: `../004-bento-visuals/research/research.md` (+ `research/iterations/iter-r2-A*.md` per-angle final recs, `iter-r3-A*.md` experiment designs)
- **Second-opinion panel** (5 models — GLM-5.2, MiMo, DeepSeek, Kimi, MiniMax): `reviews/SUMMARY.md` + `reviews/<phase>-panel.md`. All phases endorsed (AGREE-WITH-CHANGES); the panel refinements are folded into the children above.
- **Predecessor packet**: `../004-bento-visuals/` (the generation run + the angles doc `research-angles.md`)
- **GLM model facts**: `.opencode/skills/sk-prompt-models/references/models/glm-5.2.md` (§7 vision, thinking-disabled), `.../vision-audit-benchmark.md`
- **Phase children**: sub-folders `[0-9][0-9][0-9]-*/`
- **Graph Metadata**: `graph-metadata.json` (`derived.last_active_child_id`)
