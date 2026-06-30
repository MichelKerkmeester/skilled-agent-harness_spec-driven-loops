---
title: "Implementation Plan: minimax-auditor-in-loop"
description: "CONTINGENT/re-sequenced. A decision gate first tallies the 18 FIX findings by defect type (>=70% collision -> fund phase 004; else fold into phase 001); only if it clears (and after 004) extend the 004 harness with a failure-only round-2 arm: a boolean fix-router (audit JSON booleans, no regex) feeds a 9-invariant GLM repair prompt, and a rescore step adopts only repairs that clear the precision, primitive-consistency, and second-auditor gates."
trigger_phrases:
  - "minimax auditor in loop"
  - "issue to fix-json adapter"
  - "failure-only round-2 repair"
  - "a4 repair contract"
  - "external auditor correction loop"
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
      - "Re-sequenced (panel 4/5): build a standalone A4 only after phase 004 and only if the dec…"
      - "Hard predecessor: phase 001 gate + failure-JSON surface"
    key_files:
      - ".opencode/specs/anobel.com/004-bento-visuals/research/inputs/gen-tile.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: minimax-auditor-in-loop

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js ESM (`.mjs`) for the harness; Python 3 for the consumed gate scripts |
| **Framework** | None - direct `fetch` to z.ai (GLM-5.2) and MiniMax anthropic endpoints (per vision-audit-benchmark.md §2) |
| **Storage** | Filesystem: `inputs/audit-*.json` + `inputs/spec-*.json` inputs; `*.r2-a4.html` + `.meta.json` outputs |
| **Testing** | Adapter unit-run on the 18 FIX rows; A/B harness arms (T0 generic vs T1 structured); MiniMax rescore + 001 deterministic gate |

### Overview
**Decision gate first (this phase is CONTINGENT).** Before any build, tally the 18 baseline FIX findings by defect type; if >=70% are collision-type (RC-2), skip a standalone A4 and fund phase 004, and if the majority are procedural, fold the value into the phase-001 repair pass (panel 4/5, `reviews/003-minimax-auditor-in-loop-panel.md`). Only if the tally clears and phase 004 has shipped, extend the existing 004 generation harness (`gen-tile.mjs`) with a failure-only round-2 repair arm: a new `a4-adapter.mjs` routes each MiniMax finding by the audit JSON booleans (no free-text regex) into typed fix-JSON; `gen-tile.mjs` gains an `A4_ARM` switch that injects the fix-JSON into a 9-invariant GLM repair prompt for `FIX` tiles only; `a4-rescore.mjs` re-audits with MiniMax + the phase-001 deterministic gate + a primitive/semantic-consistency check + a second-auditor spot-check, and adopts only repairs that also clear the >=85% adapter precision gate.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Decision gate cleared: 18 FIX findings tallied by defect type; <70% collision-type so a standalone A4 is justified, AND phase 004 has shipped (else fold into 001 / fund 004 and do not build this phase)
- [ ] Phase 001 deterministic gate + failure-JSON surface available to consume
- [ ] 18 FIX repair cohort + 27 SHIP sentinels enumerated from `inputs/audit-*.json` (incl. the `overflow`/`title_at_bottom`/`readable`/`on_brand` booleans)
- [ ] Adapter precision gate cleared: `routeFixes` >=85% on a hand-labeled gold set before any round-2 generation
- [ ] Run config pinned (glm-5.2, max_tokens 24000, temp 0.4, thinking disabled, retry depth 1, max 3 fixes/tile)

### Definition of Done
- [ ] FIX->SHIP conversion measured on the 18 FIX tiles, split by class (mechanical/procedural ~3-6 vs genuine collision/2D ~0-1); T1 beats T0
- [ ] `false_fix_rate <= 1/18` with zero title/casing/palette regressions and no 2D->linear flattening in adopted outputs (primitive-consistency + second-auditor spot-check pass)
- [ ] Round-2 audit rows emitted for the phase-006 adoption gate; docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
External-auditor correction loop - inference-time, failure-triggered, with separate generator (GLM-5.2) and refiner-auditor (MiniMax-M3) to avoid self-bias (Self-Refine multimodal variant; iter-r2-A4 source grounding).

### Key Components
- **Decision gate (pre-build, no code)**: tally the 18 FIX findings by defect type over `inputs/audit-*.json`; >=70% collision-type -> skip A4, fund phase 004; majority procedural -> fold into the phase-001 repair pass; otherwise build standalone after 004 (panel "Net recommendation").
- **`a4-adapter.mjs` / `routeFixes(row)`**: boolean fix-router turning a MiniMax audit row into <=3 typed fix objects keyed on the audit JSON booleans (`overflow`->RC-1, `title_at_bottom`->RC-3, `readable`->RC-5, `on_brand`->RC-6). The brittle `classifyFixes` free-text regex is dropped (all 5 models); RC-2 collision has no boolean and is routed to phase 004, not guessed (panel "Use the audit JSON's structured booleans").
- **`a4-adapter.mjs` / precision gate**: `routeFixes` is scored against a hand-labeled gold set of the 18 FIX rows and must reach >=85% routing precision before any round-2 generation (panel "classifyFixes precision gate").
- **`a4-adapter.mjs` / `a4RepairContract(...)`**: builds the round-2 GLM prompt - 9 hard invariants (480px canvas, 104px reserved bottom title band, diagram max-y 348, forced safe primitives, preserve title/glyph/palette, no uppercase eyebrow, contrast gate) + `{{A4_FIXLIST_JSON}}` + previous code + raw MiniMax evidence (iter-r2-A4 "GLM round-2 prompt block").
- **`gen-tile.mjs` A4 arm**: `A4_ARM` (`control`/`generic`/`a4`), `A4_AUDIT_JSON`, `A4_RUN_ID` switches in `gen(t)`; SHIP-skip; `.r2-a4.html` + `.meta.json` (token/latency/finish_reason) (iter-r3 §§2-3).
- **`a4-rescore.mjs`**: MiniMax rescore + phase-001 deterministic gate + primitive/semantic-consistency check (matrix stays matrix) + second-auditor spot-check independent of the rescoring auditor; emits round-2 audit rows with `converted`/`false_fix`/`geometry_pass`/`contrast_exit_0`/`primitive_preserved`/`second_auditor_pass`/`baseline_score`/`baseline_verdict` (iter-r3 §4 schema; panel "primitive/semantic-consistency" + "second-auditor spot-check").
- **Adopt-if decision**: combines gate result + MiniMax rescore + precision gate + primitive-consistency + second-auditor spot-check -> adopt round-2 or keep round-1 (iter-r2-A4 `adopt_if`).

### Data Flow
0. Decision gate: tally the 18 FIX findings by defect type; if >=70% collision-type, stop here and fund phase 004 (no further steps run).
1. Read per-concept `audit-*.json` (round-1 MiniMax findings incl. booleans) -> `auditByTile` map keyed by tile number.
2. For each FIX tile: `routeFixes(row)` (boolean-keyed) -> fix-JSON; gate the router at >=85% gold-set precision before generating -> `a4RepairContract` -> GLM round-2 call -> write `.r2-a4.html`. RC-2 collisions route to phase 004 instead.
3. Render `.r2-a4.html` -> run the 001 deterministic gate (overflow/title/contrast/geometry) + MiniMax rescore + primitive/semantic-consistency check + second-auditor spot-check.
4. Adopt-if all gates pass, MiniMax = SHIP, primitive preserved, second auditor confirms, and no regressed invariant; else keep the round-1 best.
5. Emit round-2 audit rows (split by mechanical vs collision class) -> handed to phase 006 adoption gate + measured re-run.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 0: Decision Gate (do this before any build)
- [ ] Tally the 18 baseline FIX findings by defect type over `inputs/audit-*.json`
- [ ] If >=70% are collision-type (RC-2): STOP — skip standalone A4 and fund phase 004 (record the decision)
- [ ] If the majority are procedural: fold the fix value into the phase-001 repair pass instead of building a standalone phase
- [ ] Build the rest of this phase only if the tally clears AND phase 004 has shipped

### Phase 1: Setup
- [ ] Confirm phase 001 deterministic gate + failure-JSON surface is available (consume, do not own)
- [ ] Snapshot the 18 FIX repair cohort + 27 SHIP sentinels from `inputs/audit-*.json` (with booleans)
- [ ] Hand-label a gold set of the 18 FIX rows for the adapter precision gate
- [ ] Pin run config (glm-5.2, max_tokens 24000, temp 0.4, thinking disabled, retry 1, max 3 fixes/tile)

### Phase 2: Core Implementation
- [ ] Build `routeFixes` boolean fix-router (audit JSON booleans -> typed fix objects; RC-2 collisions routed to 004, no regex)
- [ ] Add the adapter precision gate (>=85% on the gold set; stop below threshold)
- [ ] Build `a4RepairContract` round-2 GLM prompt template (9 hard invariants + `{{A4_FIXLIST_JSON}}`)
- [ ] Wire the A4 arm into `gen(t)` (SHIP-skip, `.r2-a4.html` + `.meta.json`)
- [ ] Build `a4-rescore.mjs` (MiniMax rescore + 001 gate + primitive/semantic-consistency check + second-auditor spot-check + audit-row schema) and the adopt-if decision
- [ ] Add the generic-retry (T0) comparator arm

### Phase 3: Verification
- [ ] Run T1 (A4 structured) + T0 (generic) on the 18 FIX tiles, alternating order by tile parity (iter-r3 blinding)
- [ ] Measure FIX->SHIP split by class (mechanical/procedural vs collision/2D), MiniMax score delta, false-fix rate, geometry/contrast pass, primitive preservation, second-auditor agreement, cost
- [ ] Confirm T1 beats T0 and the 27 SHIP sentinels are untouched; record adopt/iterate/reject verdict
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `routeFixes` on the 18 FIX rows -> schema-valid <=3 boolean-keyed fixes each; >=85% precision vs the gold set | node |
| Integration | A4 round-2 on the 18 FIX tiles + SHIP-skip on the 27 sentinels; RC-2 collisions routed to 004 | `gen-tile.mjs` harness (`A4_ARM=a4`) |
| Manual A/B | T0 generic vs T1 structured; MiniMax rescore + deterministic gate + primitive-consistency + second-auditor spot-check | `a4-rescore.mjs`, `contrast_check.py`, `proof_check.py`, 001 `geometry_check` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Decision-gate tally (>=70% collision -> skip A4) | Internal | Gate (run first) | If collision-dominated, this phase is not built; fund phase 004 instead |
| Phase 004 (skeleton-first-2d) shipped | Internal | Red (re-sequenced) | A4 runs after 004, not before; collision/2D fixes are owned by 004 |
| Phase 001 gate + failure-JSON surface | Internal | Red (until 001 ships) | A4 cannot gate false-fixes or measure geometry |
| MiniMax-M3 anthropic endpoint | External | Green | No external audit signal |
| Second auditor (independent of the rescoring MiniMax-M3) | External | Green | No independent spot-check; confirmation-loop risk unmitigated |
| GLM-5.2 z.ai endpoint | External | Green | No repair generation |
| `sk-design` `contrast_check.py` / `proof_check.py` | Internal | Green | Falls back to MiniMax-only contrast (unreliable) |
| `inputs/audit-*.json` round-1 findings (incl. booleans) | Internal | Green (present) | No router input / no decision-gate tally source |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the decision gate finds >=70% collision-type (do not build; fund phase 004), OR the adapter precision gate is <85% on the gold set (do not generate), OR A4 standalone <=1 *collision/2D* conversion, OR `false_fix_rate > 2/18`, OR a primitive-consistency / second-auditor failure on an adopted tile, OR cost >1.8x full batch without >=7 conversions (iter-r3 reject rule + panel gates).
- **Procedure**: A4 lives behind the `A4_ARM` env switch (default `control`), so round-1 outputs remain the shipped artifacts and the round-2 `.r2-a4.*` sidecars are non-destructive; on reject, route 2D holdouts to phase 004 skeleton-first instead, or fold the procedural fixes into the phase-001 repair pass. No production state to revert.
<!-- /ANCHOR:rollback -->
