---
title: "Feature Specification: spatial-contract-and-gate"
description: "Harden the GLM-5.2 bento contract into mechanical spatial invariants plus a deterministic DOM/CSS gate and one failure-only repair pass, so RC-1..RC-5 stop dropping under instruction load."
trigger_phrases:
  - "spatial contract and gate"
  - "SAFE_LINEAR_560"
  - "deterministic gate"
  - "preflight metadata"
  - "failure-only repair pass"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "anobel.com/005-glm-visual-refinement/001-spatial-contract-and-gate"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored Level 2 planning docs for phase 001 (spec/plan/tasks/checklist)"
    next_safe_action: "Implement REQ-001 SAFE_LINEAR_560 contract block in gen-tile.mjs (code phase, later)"
    blockers: []
    key_files:
      - ".opencode/specs/anobel.com/004-bento-visuals/research/inputs/gen-tile.mjs"
      - ".opencode/specs/anobel.com/004-bento-visuals/research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "plan-session"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Should the contract be parameterized on card size now (production may target 480x480) or deferred to phase 006? Default: keep SAFE_LINEAR_560 literal, parameterize later."
    answered_questions:
      - "Card size is locked at 560x480 (the existing harness), so the contract is SAFE_LINEAR_560, not 480"
      - "The deterministic gate triggers the failure-only repair pass in this phase; phase 006 owns the final adoption decision (resolved into REQ-007)"
---
# Feature Specification: spatial-contract-and-gate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Draft |
| **Created** | 2026-06-29 |
| **Branch** | TBD (set at the code phase; these planning docs were authored under an unrelated scaffold branch) |
| **Parent Spec** | `../spec.md` (Phase 1 in the PHASE DOCUMENTATION MAP) |
| **Parent Packet** | anobel.com/005-glm-visual-refinement |
| **Implements** | Research angles A1 + A2; recommended pipeline steps 1, 2, 5, 6 |
| **Predecessor** | anobel.com/004-bento-visuals (the 45-tile run + the 20-iteration research) |
| **Successor** | 002-primitive-routing (consumes this phase's failure-JSON measurement surface) |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 45-tile GLM-5.2 run (`../../004-bento-visuals`) shipped only 27/45 = 60% SHIP (mean audit 81.1). The dense prose contract *stated* the spatial rules but never *constrained* them, so they were dropped under instruction load: RC-1 vertical overflow drove the two worst tiles (accountbeheer-4 = 35, orders-facturen-4 = 52), RC-3 broke title-at-bottom on 3 tiles, RC-4 leaked `text-transform:uppercase` 3x in goedkeuringssysteem-4 despite the contract literally saying "Title case, NOT uppercase", and RC-5 produced #4e4e4e-on-navy at 1.51:1 and #8591b3-as-text at 3.14:1. There was no deterministic gate to catch any of it, and the 18 MiniMax-M3 FIX findings were produced and discarded (RC-8).

### Purpose
Convert RC-1/RC-2/RC-3/RC-4/RC-5 from stated-but-unenforced prose into checkable invariants by shipping the research's highest-ROI first move (pipeline steps 1, 2, 5, 6): (1) a short `SAFE_LINEAR_560` hard spatial contract block, (2) a required reason-then-build preflight metadata block, (3) a deterministic headless DOM/CSS gate that emits per-tile failure JSON, and (4) one failure-only typed repair pass. This phase also creates the measurement surface (the failure JSON + bbox/contrast metrics) that phases 002-006 depend on.

> **Phase scope note:** This phase is steps 1, 2, 5, 6 of the 11-step pipeline only. Primitive routing (step 3) is phase 002, MiniMax issue->fix-JSON round-2 (step 10) is phase 003, skeleton-first 2D (steps 7-9) is phase 004, GPT-5.5 skeleton author is phase 005, and the adoption gate + measured re-run (step 11) is phase 006. Source of truth: `../../004-bento-visuals/research/research.md` (A1 + A2 final recs), `research/iterations/iter-r3-A1.md` (experiment design), `research/iterations/iter-r4-pipeline.md` (steps 1, 2, 5, 6 + the highest-ROI-first-move section).

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- **(a) `SAFE_LINEAR_560` hard spatial contract block** injected into `gen-tile.mjs` before the existing `LAYOUT` section: explicit 560x480 geometry (CSS vars), a fixed visual region (`x=30..530`, `y=30..328`), a reserved bottom-title band (`x=30..530`, `y=356..456`), per-primitive row/node caps, a pre-cased eyebrow literal ("Vloot-functie", no `text-transform`), on-dark neutral tokens, no `position:absolute` for content, and `data-a1-role` attributes for gate targeting.
- **(b) Required preflight metadata block** as a "reason-then-build" rubric: selected primitive, `itemCount`, `visibleItems`, `overflowSummary`, `usesAbsoluteForContent=false`, and a contrast-token inventory. Stored as metadata, never rendered as visible content.
- **(c) Deterministic DOM/CSS gate script** (new): headless render + bbox/computed-CSS checks for title-band intrusion, visual-panel overflow/clipping, element-bbox overlap, `text-transform:uppercase`, and contrast pairs (including on-dark). Emits one machine-readable failure JSON per tile.
- **(d) One failure-only typed repair pass**: only tiles that fail the gate get exactly one GLM repair call with the failure JSON + screenshot; copy, palette, title zone, glyph, and casing are locked; no second repair.
- Arm-based output isolation across the three experiment arms - `control` (alias **C0**), `a1_prompt` (alias **T1**), and `a1_gate_repair` (alias **T2**) - so the A1 experiment (iter-r3-A1) can run paired A/B. This C0/T1/T2 mapping is canonical and used consistently across spec, plan, tasks, and checklist.

### Out of Scope
- Primitive routing before generation - phase 002 (pipeline step 3).
- MiniMax-M3 `issue`->typed fix-JSON adapter and the audit-in-loop round-2 - phase 003 (pipeline step 10).
- Skeleton-first 2D coordinate compute + best-of-3 + downgrade - phase 004 (pipeline steps 7-9).
- GPT-5.5 (`openai/gpt-5.5-fast --variant xhigh`) skeleton author - phase 005.
- Final adoption gate + measured 45-tile re-run - phase 006 (pipeline step 11).
- Writing or modifying any implementation code in this planning pass - planning only; all tasks ship later.
- Changing the approved house style, Product register (V4/M2/D6), or palette - locked.
- Changing the tile card size - locked at 560x480 (the existing harness); do not retarget 480x480.

### Files to Change
Per-phase surface only. Paths are relative to repo root.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/specs/anobel.com/004-bento-visuals/research/inputs/gen-tile.mjs` | Modify | Add `a1Block()` contract helper + preflight rubric, arm output isolation, and the failure-only repair call |
| `.opencode/specs/anobel.com/004-bento-visuals/research/inputs/a1-gate.mjs` | Create | Deterministic headless DOM/CSS gate; emits per-tile failure JSON |
| `.opencode/specs/anobel.com/004-bento-visuals/research/inputs/a1-repair.mjs` | Create | One-shot failure-only repair driver (failure JSON + screenshot -> single GLM repair call) |
| `.opencode/specs/anobel.com/004-bento-visuals/research/inputs/contrast.mjs` | Create | Computed-CSS contrast helper (WCAG AA + banned on-dark gray detection) used by the gate |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Inject the `SAFE_LINEAR_560` geometry contract (560x480 CSS vars; visual box `x=30..530`, `y=30..328`; reserved title band `x=30..530`, `y=356..456`; `data-a1-role` attrs on visual/title/description/eyebrow/shell-cta) before the `LAYOUT` section of `gen-tile.mjs`. Targets RC-1, RC-3. | Contract block present in prompt; generated tiles carry `data-a1-role` attributes; no content element uses `position:absolute` (decorative `aria-hidden`/`pointer-events:none` only) |
| REQ-002 | Encode primitive caps in the contract: matrix = header + max 3 data rows + `+N more`; approval/branch flow = max 3 cards; integration flow = max 3 nodes; legend = max 2 inline; CTA = max 2; min internal gap 10px. Targets RC-1, RC-2. | Caps stated in the contract block; gate (REQ-006) flags any tile exceeding a cap via overflow/overlap |
| REQ-003 | Pre-cased eyebrow literal ("Vloot-functie") and an explicit ban on `text-transform: uppercase`. Targets RC-4. | Contract uses the literal string; gate greps generated CSS and reports `text-transform:uppercase` count = 0 for accepted tiles |
| REQ-004 | On-dark neutral token pair (body `#E7ECF7`, muted `#B8C2D6`) and a ban on `#4e4e4e`/`#666`/`#777`/`#8591b3`/opacity-reduced gray as readable text on dark panels. Targets RC-5. | Contract states the dark tokens + banned list; gate's contrast check distinguishes a token used as text vs as a fill/stroke |
| REQ-005 | Required preflight metadata block (`dial`, `primitive`, `itemCount`, `visibleItems`, `overflowSummary`, `usesAbsoluteForContent=false`, `darkTextTokens`, contrast-pair inventory) emitted as a reason-then-build rubric and stored as metadata, not rendered. Targets RC-2, RC-5, RC-6, RC-7. | Preflight is parseable and stored to a metadata channel; it is stripped from the rendered HTML |
| REQ-006 | Deterministic DOM/CSS gate (headless render) checking: (i) any non-title/description/shell-CTA element intersecting `y=356..456`; (ii) any visual-panel element with bottom `> 328`; (iii) any readable text/card/node bbox overlap; (iv) any readable dark-panel text using a banned gray token or contrast `< 4.5:1`; (v) `text-transform:uppercase` present; (vi) any clipped CTA/legend/row/title/description. Emits one failure JSON per tile. All bbox comparisons (intrusion, overflow, overlap, clipping) apply a `+/-2px` tolerance so touching grid/flex edges do not false-positive; the gate awaits `document.fonts.ready` plus a layout settle before measuring so font metrics are deterministic. Targets RC-1..RC-5. | Gate runs on all 45 tiles; emits per-tile JSON with the six check results + offending bboxes; flags the known-bad tiles (accountbeheer-4, oci-4, goedkeuringssysteem-4) and passes the known-good (accountbeheer-5, kwartaalcijfers-2); gate is deterministic across repeat runs - tolerance + `fonts.ready` applied before any measurement (NFR-C01) |
| REQ-007 | One failure-only typed repair pass: only gate-failing tiles get exactly one GLM repair call with the failure JSON + rendered screenshot; copy, palette, title zone, glyph, and casing are locked; no second repair; final scoring uses the repaired HTML when repair fired, else the first-pass HTML. Targets RC-1..RC-5, RC-8. | Repair fires only on failures; passing tiles get zero extra calls; repaired output re-runs the gate once |
| REQ-009 | The gate's per-tile failure JSON conforms to a FROZEN schema defined in this spec (see "Failure-JSON schema (frozen)" below) - the load-bearing measurement surface phases 002-006 read; it MUST NOT be redefined downstream. Targets RC-8. | Gate emits JSON matching the frozen schema for every tile (tile id, arm, run id, per-check pass/fail, offending bboxes, contrast pairs, overflow summary, repair status, `schemaVersion`); a schema-conformance assertion runs in the gate self-test |
| REQ-010 | Treat the 560x480 tile geometry in REQ-001 as the SINGLE SOURCE OF TRUTH. The contract literals are re-derived for the 560 harness at a 500px content width (pad 30, visual `y=30..328`, title band `y=356..456`); the 480x480 A1 research block MUST NOT be copy-pasted into `a1Block()`. See "Geometry: single source of truth (560 re-derivation)" below. Targets the 480->560 provenance/copy-paste hazard. | Spec carries one geometry table + the 432->500px re-derivation; `a1Block()` emits only 560-derived literals; no 480-based literal (`--tile-w:480px`, pad 24, `y=24..328`, title-y 352, visualBox `[24,24,432,304]`) appears in the generated prompt or the gate thresholds |
| REQ-011 | Run a cheap pre-build FALSIFICATION PROBE before the full 135-generation run (3 arms x 45 tiles): (a) run the deterministic gate on the EXISTING 45 baseline tiles and emit a confusion matrix vs the known SHIP/FIX labels; (b) run a 5-tile repair probe proving the one-shot repair pass actually converts gate failures to passes. The full run is GATED on both. Targets the unvalidated-gate and unvalidated-repair risks. | Confusion matrix produced (precision/recall vs known-bad accountbeheer-4/oci-4/goedkeuringssysteem-4 and known-good accountbeheer-5/kwartaalcijfers-2); 5-tile repair probe reports a repair-success-rate; the full 135-gen run does not start until the gate's baseline precision/recall and the repair-success-rate clear their sub-gates (SC-007) |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-008 | Arm-based output isolation via `A1_ARM` (`control`/`a1_prompt`/`a1_gate_repair`) and `A1_RUN_ID`, so the paired A/B experiment (iter-r3-A1: C0 vs T1 vs T2) can run without overwriting outputs. | Each arm writes to its own `dist-<arm>-<run>/` dir; `control` reproduces the existing single-shot path |

### Geometry: single source of truth (560 re-derivation) - REQ-010

The 560x480 harness geometry below is the ONLY geometry the contract and gate may use. The 480x480 numbers from the A1 research are provenance, not values to ship. (The spec is already internally consistent at 560x480; this section closes the provenance/re-derivation hazard, not a contradiction.)

| Quantity | A1 research (480x480) | This phase (560x480) - SINGLE SOURCE |
|----------|-----------------------|--------------------------------------|
| Tile box | 480 x 480 | **560 x 480** |
| Padding | 24 | **30** |
| Content width | 480 - 24 - 24 = 432 | **560 - 30 - 30 = 500** |
| Visual region | y=24..328 (h=304) | **y=30..328 (h=298)**, x=30..530 |
| Title band | title-y 352 | **y=356..456 (h=100)**, x=30..530 |
| Bottom margin | n/a | 480 - 456 = 24 |

**Re-derivation of the per-primitive caps at the 500px content width (REQ-002):**
- The wider 500px content width (vs 432px, ~+16%) only *relaxes* horizontal caps (cards/nodes get more room), so the 480-derived caps remain safe maxima at 560.
- Vertical caps are bounded by the 298px visual height: header (~40px) + 3 data rows (~52px each) + 2 gaps (10px) ~ 216px < 298px, so "header + max 3 data rows + `+N more`" fits with breathing room; a 4th row removes the `+N more` affordance. Matrix/branch/integration caps therefore carry over unchanged; only the box/pad/title literals change to the 560 column.

**FORBIDDEN:** copy-pasting the 480x480 A1 research block (or its `visualBox [24,24,432,304]`, pad 24, title-y 352 literals) into `a1Block()`. Doing so desyncs the prompt from the 560-based gate thresholds - the headline review finding. `a1Block()` emits only the 560 column above.

### Failure-JSON schema (frozen) - REQ-009

This schema is FROZEN here (not in `plan.md`). Phases 002-006 write readers against it; any change is a spec amendment, not a downstream redefinition.

```json
{
  "tileId": "accountbeheer-4",
  "arm": "a1_gate_repair",
  "runId": "<A1_RUN_ID>",
  "primitive": "matrix",
  "pass": false,
  "checks": {
    "titleBandIntrusion": { "pass": false, "offenders": [{ "role": "row", "bbox": [30, 360, 200, 24] }] },
    "visualPanelOverflow": { "pass": false, "offenders": [{ "role": "row", "bottom": 351 }] },
    "bboxOverlap":         { "pass": true,  "offenders": [] },
    "bannedContrast":      { "pass": false, "offenders": [{ "role": "label", "token": "#4e4e4e", "on": "#043367", "ratio": 1.51, "usage": "text" }] },
    "uppercase":           { "pass": true,  "count": 0 },
    "clipping":            { "pass": true,  "offenders": [] }
  },
  "overflowSummary": { "visualBottomMax": 351, "rowsRendered": 5, "rowsCap": 3 },
  "repair": { "fired": false, "attempt": 0, "regated": null, "convertedToPass": null },
  "tolerancePx": 2,
  "fontsReady": true,
  "schemaVersion": "1.0"
}
```

Notes: `arm` is one of `control`/`a1_prompt`/`a1_gate_repair` (C0/T1/T2); `usage` distinguishes a token used as readable `text` (can fail on dark) from `fill`/`stroke` (passes); `tolerancePx` and `fontsReady` record the determinism settings (REQ-006).

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: SHIP rate lifts from the 27/45 = 60% baseline by a realistic **+7-16pp to ~30-34/45 = 67-76%** under the T2 arm (`a1_gate_repair` = A1 prompt + deterministic gate + one repair). The earlier +16-22pp / 76-82% target was over-optimistic per the 5-model panel: most of the 41pt gap closes in phases 002-005, and capping rows reclassifies tiles rather than improving 2D skill.
- **SC-002**: Diagram-vs-linear score delta narrows (the 2D/diagram worst band 35-58 lifts). This SC measures the **post-conversion primitive score**: capping rows yields *truncated* (not better) tiles, and some narrowing comes from reclassification/downgrade, so the honest narrowing in this phase is partial - report the delta with its measurement basis, not as pure 2D improvement. Deeper 2D recovery is phases 004-005.
- **SC-003**: Contrast exit-0 rate on accepted tiles reaches **95-100%** (dark-panel semantic tokens + computed-CSS contrast as a hard gate).
- **SC-004**: RC-1/RC-2/RC-3/RC-4/RC-5 failure tiles convert (overflow count, `title_at_bottom:true` rate, `text-transform:uppercase` grep = 0, enumerated text-on-navy pairs pass).
- **SC-005**: Linear-flow slice mean does NOT regress more than 3 pts (the 86-94 winners are preserved; a larger drop means the contract is over-restrictive).
- **SC-006**: The gate emits per-tile failure JSON for all 45 tiles - the measurement surface phases 002-006 read.
- **SC-007**: Repair-success-rate sub-gate - the failure-only repair pass converts at least a pre-registered fraction (target **>=50%**) of gate-failing tiles to gate-passing across the 5-tile probe (REQ-011) and the pilot; if the pilot repair-success-rate is `< 50%`, do NOT ship T2 - escalate the residual to phase 004.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Headless browser (Playwright/Puppeteer) for DOM bbox + computed CSS | No deterministic gate without it | Pin one engine in Phase 1 Setup; the gate is the load-bearing surface |
| Dependency | Z.AI GLM-5.2 multimodal endpoint (already used by `gen-tile.mjs`) | No generation/repair | Existing auth + retry loop reused as-is |
| Dependency | Contrast computation (WCAG AA + as-text vs as-fill distinction) | False pass/fail on RC-5 | Dedicated `contrast.mjs`; the high tile aangepast-assortiment-4 uses #8591b3 only as a stroke and scored 88 - must not be flagged |
| Risk | GLM emits valid preflight JSON but violates it in the HTML | Preflight alone is untrustworthy | Gate is deterministic on the rendered DOM, not on the model's self-report |
| Risk | Linearizing diagrams reduces perceived sophistication | Lower aesthetic ceiling on 2D tiles | Cap visible rows at 3 but preserve intent via `+N more`; deeper 2D recovery is phase 004 |
| Risk | Prompt-only collision prevention is weaker than browser-measured overlap | RC-2 residue | The gate's bbox overlap check is the authority; the contract only reduces exposure |
| Risk | Contract added (not replaced) inflates instruction density past the IFScale cliff | Re-introduces omission failures | Insert `SAFE_LINEAR_560` as a replacement for diffuse layout prose; keep it short (~350-450 tokens) |
| Risk | One-shot repair pass is load-bearing but unvalidated (SC-001 arithmetic depends on it) | T2 lift is overstated if repair rarely converts failures | Pre-build falsification probe (REQ-011) + repair-success-rate sub-gate (SC-007): skip T2 and escalate to phase 004 if pilot conversion `< 50%` |
| Risk | 480->560 geometry copy-pasted into `a1Block()` (provenance/copy-paste hazard) | Prompt desyncs from the 560-based gate thresholds | REQ-010 single source of truth + the 432->500px re-derivation table; forbid pasting the 480 research block |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Contract overhead ~350-450 prompt tokens (inserted as a replacement, not an addition).
- **NFR-P02**: Gate adds ~1 render pass per tile and zero model tokens; mean wall-clock <= ~1.25-1.45x control.
- **NFR-P03**: Repair costs only for failing tiles (~800-1400 extra tokens + one GLM call per failed tile); passing tiles incur zero repair cost.

### Correctness
- **NFR-C01**: The gate is deterministic - the same rendered HTML yields the same failure JSON across runs.
- **NFR-C02**: Contrast check distinguishes a neutral used as readable text (fail on dark) from the same hex used as a border/stroke/fill (pass).

### Reliability
- **NFR-R01**: A render or browser failure surfaces as an explicit gate error, never a silent pass.
- **NFR-R02**: `control` arm output is byte-reproducible against the existing single-shot harness.

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- **Over-length Dutch copy**: title/description that would push the visual panel past `y=328` must be caught as overflow, not silently clipped.
- **Token-as-fill vs token-as-text**: `#8591b3` as an SVG `stroke=`/`fill=` passes; as readable text `color:` on dark fails (the RC-5 false-negative trap).
- **Empty / single-row instrument**: a tile with fewer items than the cap is valid; caps are maxima, not minima.

### Gate Scenarios
- **Already-passing tile**: gate pass => zero repair calls (do not refine SHIP tiles).
- **Fails once**: exactly one repair call; re-run gate once on the repaired HTML.
- **Fails twice**: no second repair in this phase; record the residual failure JSON and keep the best-scoring pass (deeper recovery is phases 004-005).
- **Decorative absolute element**: `position:absolute` is allowed only with `aria-hidden="true"` + `pointer-events:none`; the gate must not flag those as content.

### Arm Scenarios
- **Control arm**: no contract, no gate, no repair - reproduces the 60% baseline for the paired comparison.
- **T1 (a1_prompt)**: contract only, no gate/repair - isolates whether prompt structure alone lifts SHIP.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | 1 modified file + 3 new harness scripts; ~200-450 LOC across gate + repair + contrast |
| Risk | 16/25 | No production code; new headless-render dependency; contrast as-text/as-fill correctness is subtle |
| Research | 8/20 | Fully grounded - A1/A2 final recs + iter-r3 experiment design; note the 480x480 research geometry is re-derived to 560 (REQ-010), NOT copy-pasted |
| **Total** | **38/70** | **Level 2** (QA-heavy: the gate is a measurement surface, so verification weight is high) |

<!-- /ANCHOR:complexity -->
---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- The experiment harness is locked at 560x480 (REQ-010 single source of truth), but the eventual production target may be 480x480 - should the contract be parameterized on card size now, or deferred until phase 006? (Default: keep `SAFE_LINEAR_560` literal; parameterize later.)

_Resolved and folded into requirements:_ "Should the gate block adoption outright, or only trigger the repair pass?" -> this phase triggers the failure-only repair pass (REQ-007); phase 006 owns the final adoption decision.

<!-- /ANCHOR:questions -->
---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Parent Spec**: `../spec.md` (Phase 1 row of the PHASE DOCUMENTATION MAP)
- **Research source**: `../../004-bento-visuals/research/research.md` (A1 + A2 final recs), `research/iterations/iter-r3-A1.md` (experiment design), `research/iterations/iter-r4-pipeline.md` (steps 1, 2, 5, 6), RC ledger in `../../004-bento-visuals/research-angles.md` §1

<!-- /ANCHOR:related-docs -->

---

<!--
LEVEL 2 SPEC
- Core + Level 2 addendum (NFRs, Edge Cases, Complexity)
- Scoped strictly to phase 001 (pipeline steps 1, 2, 5, 6 = angles A1 + A2)
- Every requirement cites an RC-id; acceptance cites the research's predicted effects
-->
