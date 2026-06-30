---
title: "Feature Specification: minimax-auditor-in-loop"
description: "CONTINGENT/re-sequenced phase. A decision gate first tallies the 18 baseline FIX findings (from the 004 run, RC-8) by defect type: if >=70% are collision-type, skip standalone A4 and fund phase 004; otherwise fold the procedural-fix value into phase 001. If the tally justifies a standalone build (and only after 004), route fixes by MiniMax audit JSON booleans (not free-text regex) into a failure-only round-2 GLM repair, generator and auditor kept separate, with precision/primitive-consistency/second-auditor gates before adoption."
trigger_phrases:
  - "minimax auditor in loop"
  - "issue to fix-json adapter"
  - "failure-only round-2 repair"
  - "generator auditor separation"
  - "RC-8 audit feedback"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "anobel.com/005-glm-visual-refinement/003-minimax-auditor-in-loop"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Folded panel refinements: re-sequence via FIX-type tally, audit-boolean routing"
    next_safe_action: "Tally the 18 FIX by defect-type; build standalone A4 only if justified"
    blockers:
      - "Re-sequenced (panel 4/5): build a standalone A4 only after phase 004 ships and only if the…"
      - "Hard predecessor: phase 001-spatial-contract-and-gate must ship the gate + failure-JSON me…"
    key_files:
      - ".opencode/specs/anobel.com/004-bento-visuals/research/inputs/gen-tile.mjs"
      - ".opencode/specs/anobel.com/004-bento-visuals/research/inputs/audit-accountbeheer.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-session"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "What is the defect-type distribution of the 18 baseline FIX findings? This tally is the de…"
    answered_questions:
      - "Auditor of record is MiniMax-M3; GLM-5.2 confabulates audits (vision-audit-benchmark.md §3…"
      - "Run A4 strictly FIX-only (skip the 27 SHIP sentinels) — panel consensus: failure-only rout…"
      - "Standalone-vs-fold is resolved by the decision gate, not left open: >=70% collision -> fun…"
---
# Feature Specification: minimax-auditor-in-loop

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Contingent — Re-sequenced (build only if the §3 decision gate clears, and after phase 004) |
| **Created** | 2026-06-29 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
| **Parent Spec** | `../spec.md` (Phase 3 row: A4 — MiniMax-M3 issue->typed fix-JSON adapter) |
| **Implements** | Angle A4 (minimax-pairing) + recommended pipeline step 10 |
| **Predecessor** | `../001-spatial-contract-and-gate/` (hard — gate + failure-JSON surface) AND `../004-skeleton-first-2d/` (re-sequence — A4 runs after 004, not before) |
| **Sequencing** | 5-model panel (4/5): standalone phase-003 is mis-placed. Run the §3 decision gate first — most A4 value duplicates 001 (procedural) or belongs after 004 (collision). |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
In the 45-tile 004 run, MiniMax-M3 (auditor of record) emitted **18 specific, file-grounded FIX findings** (panel overflow, eyebrow overlapping a node, too-light bottom row) but the pipeline was single-shot generate -> gate -> audit -> STOP, so **18/45 = 40% of findings were discarded** (RC-8 in `../../004-bento-visuals/research-angles.md` §1). The findings are accurate but free-text, so GLM cannot mechanically act on them; and GLM cannot self-audit — it confabulated a non-existent "orange CTA" and `#cccccc` text in the benchmark (`vision-audit-benchmark.md` §3), so an external auditor is the only trustworthy critique channel.

### Purpose
Add pipeline step 10: an adapter that routes each MiniMax-M3 finding by the audit JSON's structured booleans (not free-text regex) into machine-readable fix-JSON (defect-type, target element, required change) fed back to GLM-5.2 for a **failure-only** round-2 repair — generator (GLM) and auditor (MiniMax) kept as **separate** models to prevent self-bias — paired with the phase-001 deterministic gate for the overflow/contrast facts MiniMax can miss, converting FIX->SHIP from findings that already exist.

**This phase is CONTINGENT.** A 5-model second-opinion panel (4/5 AGREE-WITH-CHANGES, `reviews/003-minimax-auditor-in-loop-panel.md`) found a standalone phase-003 mis-placed: most of A4's value either duplicates the phase-001 repair (procedural RC-1 overflow / RC-3 title / RC-5 contrast / RC-6 palette) or belongs after phase 004 (RC-2 collision, which GLM cannot single-shot fix). The decision gate in §3 therefore runs **before any build** and may skip A4 entirely.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- **Decision gate (run before any build)**: tally the 18 baseline FIX findings by defect type over `004-bento-visuals/research/inputs/audit-*.json`. If **>=70% are collision-type** (RC-2 — the gate-blind 2D defects GLM cannot single-shot fix), SKIP a standalone A4 and **fund phase 004** instead. If the majority are procedural (RC-1 overflow / RC-3 title / RC-5 contrast / RC-6 palette), **fold the fix value into the phase-001 repair pass** rather than building a standalone phase. A standalone A4 is in scope only if the tally clears this gate AND phase 004 has shipped (panel consensus 4/5; `reviews/003-minimax-auditor-in-loop-panel.md` "Net recommendation").
- The issue->fix-JSON **boolean router** (`routeFixes`): keys each fix off the MiniMax audit JSON booleans as the primary and only routing signal — `overflow`->RC-1, `title_at_bottom`->RC-3, `readable`->RC-5, `on_brand`->RC-6 — emitting typed fix objects with `defect_type`, `rc_ids`, `severity`, `target_region`, `required_change`, `layout_contract`, `verification`. The brittle `classifyFixes` free-text regex is **dropped** (all 5 models: a misclassified fix is worse than none). Defect dimensions with no boolean (RC-2 collision) are NOT fed to GLM as guessed fixes — they route to phase 004.
- The round-2 GLM repair prompt template (`a4RepairContract`): 9 hard invariants + `{{A4_FIXLIST_JSON}}` injection + previous code + raw MiniMax evidence (iter-r2-A4 "GLM round-2 prompt block").
- Failure-only routing: round-2 runs only for round-1 `FIX` tiles; the 27 SHIP sentinels are skipped (iter-r3 arms / `gen(t)` SHIP-skip).
- Adopt-if gate with three added safeguards: keep round-2 output only if the 001 deterministic gates (proof/contrast/geometry) **and** the MiniMax rescore SHIP pass, **and** an adapter precision gate (>=85% on a hand-labeled gold set, measured before any round-2 generation), **and** a primitive/semantic-consistency check (matrix stays matrix, routing stays routing — no silent 2D->linear flattening), **and** a second-auditor spot-check independent of the rescoring auditor; otherwise keep round-1 (iter-r2-A4 `adopt_if`; panel "Adopt-worthy improvements" 1/4/6).
- An A/B comparator: a generic "improve this" retry arm (T0) vs the structured A4 arm (T1) to prove the typed contract earns its place.

### Out of Scope
- The deterministic DOM/CSS gate, `geometry_check`, and the failure-JSON measurement surface - OWNED by phase 001 (hard predecessor); this phase consumes them.
- Global layout decomposition / coordinate skeletons - phase 004 (A5/A7); A4 must not own skeleton geometry (iter-r2-A4 synergy/conflict table).
- RC-2 collision / 2D repair - routed to phase 004; A4 does not attempt single-shot collision fixes (no audit boolean exists for them, and GLM cannot fix them in one shot).
- The dropped `classifyFixes` free-text regex classifier - replaced by boolean routing; not re-introduced even for un-booleaned defects.
- GPT-5.5 skeleton escalation - phase 005 (A6).
- Primitive routing classification - phase 002 (A3).
- House style / register (V4/M2/D6) / palette and the MiniMax auditor-of-record decision - settled, not re-litigated.
- Any implementation code - this is the planning pass only.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `004-bento-visuals/research/inputs/a4-adapter.mjs` | Create | `routeFixes` boolean fix-router (keyed on audit JSON `overflow`/`title_at_bottom`/`readable`/`on_brand`) + adapter precision gate (>=85% gold-set) + `a4RepairContract` round-2 prompt builder |
| `004-bento-visuals/research/inputs/gen-tile.mjs` | Modify | `A4_ARM`/`A4_AUDIT_JSON`/`A4_RUN_ID` switch; failure-only round-2 path in `gen(t)`; `.r2-a4.html` + `.meta.json` outputs |
| `004-bento-visuals/research/inputs/a4-rescore.mjs` | Create | Re-audit repaired tiles (MiniMax + 001 gates + primitive/semantic-consistency check + second-auditor spot-check); emit round-2 audit rows (`converted`/`false_fix`/`geometry_pass`/`contrast_exit_0`/`primitive_preserved`/`second_auditor_pass`) |
| `004-bento-visuals/research/inputs/audit-*.json` | Read-only | Round-1 MiniMax findings (incl. `overflow`/`title_at_bottom`/`readable`/`on_brand` booleans) consumed as router input + decision-gate tally source (9 concept files, present) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Decision gate precedes any build | Before any code, the 18 baseline FIX findings are tallied by defect type over `inputs/audit-*.json`; if **>=70% are collision-type (RC-2)**, A4 is not built standalone and phase 004 is funded instead; the tally and the build/fold/defer decision are recorded |
| REQ-002 | Fixes route from audit JSON booleans, not regex | `routeFixes` maps each FIX tile via `overflow`->RC-1, `title_at_bottom`->RC-3, `readable`->RC-5, `on_brand`->RC-6 and emits <=3 typed fixes (`defect_type`, `rc_ids`, `target_region`, `required_change`, `verification`) per tile; the `classifyFixes` free-text regex is removed; RC-2 collisions (no boolean) are routed to phase 004, never fed to GLM as a guessed fix |
| REQ-003 | Adapter precision gate before any round-2 generation | `routeFixes` is measured against a hand-labeled gold set of the 18 FIX rows and must reach **>=85% routing precision** before any GLM round-2 call; below 85% the phase stops (a misclassified fix is worse than none) |
| REQ-004 | Round-2 is failure-only | The 27 round-1 SHIP tiles emit `SKIP_SHIP` and trigger zero GLM round-2 calls; only the 18 FIX tiles enter repair (resolved OQ: FIX-only confirmed by the panel cost-discipline consensus) |
| REQ-005 | Generator != auditor | GLM-5.2 (z.ai) generates the repair; MiniMax-M3 (anthropic endpoint) is the rescore/adoption signal; GLM never audits its own output |
| REQ-006 | Adopt-if gate prevents false-fixes (with primitive-consistency + second-auditor spot-check) | A round-2 output is adopted only if proof_check + contrast_check + geometry pass AND MiniMax rescore = SHIP AND no regressed invariant (title position, contrast, palette, casing/glyph, product meaning) AND a primitive/semantic-consistency check confirms the tile still represents its data (matrix stays matrix, routing stays routing) AND a second-auditor spot-check independent of the rescoring auditor confirms the fix; else round-1 is kept |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Structured beats generic (prediction split by defect class) | A4 typed round-2 (T1) beats the generic "improve this" round-2 (T0) by >=3 additional FIX->SHIP conversions OR >=8 mean MiniMax points on the 2D cohort (iter-r3 decision rule). Conversions are scored in two buckets: **mechanical/procedural** (RC-1/RC-3/RC-5/RC-6, expected ~3-6 but these duplicate phase 001) vs **genuine collision/2D** (RC-2, expected ~0-1 and not single-shot fixable). The standalone case rests on the second bucket, not the first |
| REQ-008 | Deterministic pairing catches MiniMax misses | A tile MiniMax rescores SHIP but the 001 gate flags overflow/contrast (the subtle-clip false negative in vision-audit-benchmark.md §3) is NOT adopted |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001 (split prediction)**: the FIX->SHIP estimate is separated by defect class, because the two classes carry very different value: **mechanical/procedural fixes** (RC-1 overflow / RC-3 title / RC-5 contrast / RC-6 palette) convert ~3-6 tiles **but these duplicate the phase-001 repair**, so they do not justify a standalone phase; **genuine collision/2D fixes** (RC-2) convert ~0-1 and are **not single-shot fixable** by GLM. The standalone-A4 case therefore stands or falls on the collision bucket, and the net integrated contribution after A1/A3 overlap is **+1-3 SHIP tiles** at best (iter-r4 step-10 adopt table; panel "Split the prediction").
- **SC-002**: `false_fix_rate <= 1/18`, with zero title-top, uppercase-eyebrow, or off-palette regressions in any adopted output, and no 2D tile silently flattened to linear and scored as a win (primitive-consistency check) (iter-r3 false-fix gate; panel "primitive/semantic-consistency").
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Decision-gate tally (defect-type mix of the 18 FIX) | Determines whether this phase is built at all | Run the tally first; >=70% collision-type -> skip A4 and fund phase 004 (REQ-001) |
| Dependency | Phase 004 (skeleton-first-2d) shipped | A4 is re-sequenced to run after 004; collision/2D fixes are 004's | Do not build a standalone A4 before 004 (panel 4/5) |
| Dependency | Phase 001 gate + failure-JSON surface | Without it, adopt-if cannot verify geometry/contrast and cannot block false-fixes | Hard predecessor; do not start this phase until 001 ships |
| Dependency | MiniMax-M3 anthropic + GLM-5.2 z.ai endpoints (direct API; opencode `--file` is broken, bug #20802 per vision-audit-benchmark.md §2) | No external audit / no repair generation | Reuse the proven direct-API transport from the 004 harness |
| Risk | Misclassified fix instructs the wrong repair (worse than none) | Med - wrong or missing fix | Drop the free-text regex; route only from audit booleans; gate `routeFixes` at >=85% gold-set precision before generating; keep raw `evidence` and cap 3 fixes/tile (panel, all 5) |
| Risk | Same auditor diagnoses round-1 and rescores round-2 (confirmation loop) | Med - inflated SHIP signal | Second-auditor spot-check independent of the rescoring auditor on the adopted batch (panel, >=2 models) |
| Risk | Forced linear primitive flattens a 2D tile and destroys product meaning | Med - tile passes gates but misrepresents data | Primitive/semantic-consistency check in the adopt-if gate; route true 2D to phase 004 instead of flattening (panel, deepseek/kimi) |
| Risk | GLM still fails RC-1/RC-2 geometry despite typed fixes | Med - 2D holdouts stay FIX | Route hard 2D / collision tiles to phase 004 skeleton-first; do not single-shot them in A4 |
| Risk | Multiple fixes break a passing dimension (false-fix) | Low-Med | Max 3 fixes, non-regression snapshot, adopt-only-if all gates pass |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- **What is the defect-type distribution of the 18 baseline FIX findings?** This is the decision-gate input (REQ-001) and is unknown until the tally runs: >=70% collision -> fund phase 004 and skip A4; majority procedural -> fold into phase 001. The conversion ceiling is determined by this mix.

> Resolved questions moved to requirements: "run A4 strictly FIX-only" -> REQ-004 (panel: failure-only routing is correct cost discipline). "Should A4 collapse into the 001 repair pass / is the added latency justified" -> resolved by the decision gate (REQ-001) and the split prediction (SC-001), which fold procedural value into 001 unless the collision bucket justifies a standalone build.
<!-- /ANCHOR:questions -->
