---
title: "Implementation Plan: spatial-contract-and-gate"
description: "Inject a SAFE_LINEAR_560 contract + preflight rubric into gen-tile.mjs, add a deterministic headless DOM/CSS gate that emits per-tile failure JSON, and wire one failure-only repair pass."
trigger_phrases:
  - "spatial contract and gate"
  - "SAFE_LINEAR_560"
  - "deterministic gate"
  - "a1-gate.mjs"
  - "failure-only repair"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "anobel.com/005-glm-visual-refinement/001-spatial-contract-and-gate"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored Level 2 plan for phase 001"
    next_safe_action: "Phase 1 Setup: pin the headless-render engine and add arm output isolation to gen-tile.mjs"
    blockers: []
    key_files:
      - ".opencode/specs/anobel.com/004-bento-visuals/research/inputs/gen-tile.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "plan-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: spatial-contract-and-gate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js ESM (`.mjs`); no framework |
| **Generation model** | GLM-5.2 via the Z.AI coding endpoint (`https://api.z.ai/api/coding/paas/v4/chat/completions`), `thinking:{type:'disabled'}`, `temperature:0.4`, `max_tokens:24000` (existing in `gen-tile.mjs`) |
| **Gate runtime** | Headless browser (Playwright or Puppeteer) for DOM bbox + computed CSS |
| **Testing** | Node assertions for bbox/contrast math; gate self-test against known-bad/known-good tiles |

### Overview
Replace the diffuse layout prose in `gen-tile.mjs` with a short `SAFE_LINEAR_560` hard spatial contract plus a required reason-then-build preflight, add a standalone deterministic gate (`a1-gate.mjs`) that renders each tile headless and emits per-tile failure JSON, and add a one-shot failure-only repair driver (`a1-repair.mjs`). GLM stays the renderer; the gate is the authority. This is pipeline steps 1, 2, 5, 6 - the highest-ROI first move that also produces the measurement surface phases 002-006 read.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented (spec.md)
- [ ] Success criteria measurable and honest (SHIP +7-16pp -> ~30-34/45 = 67-76%, contrast 95-100%, repair-success-rate >=50% sub-gate)
- [ ] Dependencies identified (headless engine, Z.AI endpoint, contrast helper)
- [ ] Failure-JSON schema frozen in spec.md (REQ-009), not plan.md (the measurement surface)
- [ ] Falsification probe planned: gate-on-baseline confusion matrix + 5-tile repair probe gate the 135-gen run (REQ-011)

### Definition of Done
- [ ] All P0 acceptance criteria met (REQ-001..REQ-007, REQ-009..REQ-011)
- [ ] Gate flags known-bad and passes known-good tiles
- [ ] Falsification probe cleared before the full run; repair-success-rate met (or T2 deferred to phase 004)
- [ ] Docs synchronized (spec/plan/tasks/checklist)

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Pipeline stages around an unchanged GLM renderer: `contract -> generate -> render -> gate -> (repair once if failed) -> rescore`. Deterministic checks own acceptance; the model never self-certifies.

### Key Components
- **`a1Block(t)` (in `gen-tile.mjs`)**: emits the `SAFE_LINEAR_560` contract + the internal preflight plan; selects a primitive hint from the treatment brief.
- **Preflight metadata**: the reason-then-build JSON (dial, primitive, itemCount, visibleItems, overflowSummary, usesAbsoluteForContent, darkTextTokens, contrast inventory); parsed and stored, never rendered.
- **`a1-gate.mjs` (new)**: headless render -> await `document.fonts.ready` + layout settle -> DOM bbox + computed CSS -> six deterministic checks (`+/-2px` bbox tolerance) -> per-tile failure JSON conforming to the frozen REQ-009 schema.
- **`contrast.mjs` (new)**: WCAG-AA contrast over computed colors; distinguishes a hex used as readable text from the same hex used as fill/stroke.
- **`a1-repair.mjs` (new)**: for failing tiles only, one GLM call with failure JSON + screenshot; locks copy/palette/title/glyph/casing; re-runs the gate once.

### Data Flow
1. `gen-tile.mjs` builds the prompt = `a1Block()` + existing LAYOUT/palette contract.
2. GLM returns preflight JSON + HTML; harness strips/stores preflight, writes HTML to the arm's `dist-<arm>-<run>/` dir.
3. `a1-gate.mjs` renders the HTML headless, waits for `document.fonts.ready` + a layout settle, computes bboxes (`+/-2px` tolerance) + contrast, writes `<tile>.gate.json` per the frozen REQ-009 schema.
4. If `gate.fail`, `a1-repair.mjs` makes one repair call; the repaired HTML re-enters the gate once.
5. Final scoring uses the repaired HTML when repair fired, else the first-pass HTML.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase touches the layout contract, render boundary, and a new acceptance gate - so the producer/consumer surfaces are enumerated.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `gen-tile.mjs` `contract()` / `gen()` | Produces the per-tile prompt + HTML | Update: prepend `a1Block()`, add preflight parse/store, arm output paths | `rg -n "a1Block\|data-a1-role\|A1_ARM" gen-tile.mjs`; generated HTML carries `data-a1-role` |
| `a1-gate.mjs` | (does not exist) | Create: headless DOM/CSS gate emitting failure JSON | Gate flags accountbeheer-4 / oci-4 / goedkeuringssysteem-4; passes accountbeheer-5 / kwartaalcijfers-2 |
| `contrast.mjs` | (does not exist) | Create: computed-CSS contrast + as-text/as-fill distinction | Unit: #4e4e4e-on-#043367 -> fail; #8591b3 as stroke -> pass |
| `a1-repair.mjs` | (does not exist) | Create: one-shot failure-only repair | Repair fires only on `gate.fail`; passing tiles get 0 calls |
| `audit-*.json` (MiniMax baseline) | Records the 60% / ~41-pt baseline | Read-only - not a consumer, never modified | Baseline numbers cited, files untouched |
| `dist-*/` outputs | Generated tile HTML | Add per-arm dirs | `control` byte-reproduces the existing single-shot path |

Required inventories before implementation:
- Confirm the only generation entrypoint: `rg -n "fetch\(EP" .opencode/specs/anobel.com/004-bento-visuals/research/inputs/gen-tile.mjs`.
- Confirm banned-token usage to gate: `rg -n "#4e4e4e|#8591b3|text-transform" <generated-dist>`.
- Algorithm invariant (gate): for every readable text node on a dark panel, computed contrast >= 4.5:1 AND the color token is not in the banned-gray set; a node with `aria-hidden="true"` or non-text role is exempt.

<!-- /ANCHOR:affected-surfaces -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Pin one headless-render engine (Playwright or Puppeteer) and add it to the harness deps
- [ ] Add `A1_ARM` / `A1_RUN_ID` env scaffolding + per-arm output paths to `gen-tile.mjs`
- [ ] Define and document the per-tile failure-JSON schema (the measurement surface)

### Phase 2: Core Implementation
- [ ] `a1Block()` contract helper (geometry vars, visual box, reserved title band, primitive caps, dark tokens, `data-a1-role` attrs)
- [ ] Required preflight metadata block (reason-then-build), parse + store + strip from render
- [ ] `contrast.mjs` (computed-CSS contrast + as-text/as-fill distinction)
- [ ] `a1-gate.mjs` (six deterministic checks -> per-tile failure JSON)
- [ ] `a1-repair.mjs` (one-shot failure-only repair, locks copy/palette/title/glyph/casing)

### Phase 3: Verification
- [ ] Gate self-test: known-bad tiles fail, known-good tiles pass
- [ ] Falsification probe (REQ-011), GATES the full run: (a) run the gate on the existing 45 baseline tiles -> confusion matrix vs known SHIP/FIX labels; (b) 5-tile repair probe -> repair-success-rate
- [ ] Only if the probe clears its sub-gates: pilot run all 45 cells across the C0 / T1 / T2 arms (control / a1_prompt / a1_gate_repair)
- [ ] Measure SHIP rate (target +7-16pp), diagram-vs-linear delta (post-conversion basis), contrast exit-0, and repair-success-rate (>=50% sub-gate); compare to baseline + adoption thresholds

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Bbox overlap math, title-band intrusion, contrast (as-text vs as-fill), `primitiveForBrief` | Node assertions |
| Integration | Gate on known-bad (accountbeheer-4, oci-4, goedkeuringssysteem-4) -> FAIL; known-good (accountbeheer-5, kwartaalcijfers-2) -> PASS | `a1-gate.mjs` self-test |
| Experiment | Paired A/B: C0 vs T1 vs T2 across all 45 cells; metrics per iter-r3-A1 | `gen-tile.mjs` arms + gate |
| Manual | Visual review of repaired 2D tiles for residual slop/collision | Browser |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Headless browser (Playwright/Puppeteer) | External | Yellow | No deterministic gate - the load-bearing surface |
| Z.AI GLM-5.2 endpoint | External | Green | No generation/repair (reuses existing auth + retry) |
| Contrast computation (`contrast.mjs`) | Internal | Yellow | RC-5 false pass/fail without it |
| 45 baseline specs (`spec-*.json`) + reference shells | Internal | Green | Already present in `research/inputs/` |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: T2 regresses linear-flow tiles by more than 5 pts, or SHIP lift is below +5pp, or the pilot repair-success-rate is below 50% (skip T2, escalate to phase 004), or the gate is non-deterministic.
- **Procedure**: Revert `gen-tile.mjs` to the `control` path (the contract is a replacement block guarded by `A1_ARM`), and quarantine `a1-gate.mjs` / `a1-repair.mjs` without deleting the failure-JSON already collected.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──────┐
                      ├──> Phase 2 (Core) ──> Phase 3 (Verify)
schema + arm paths ───┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core, Verify |
| Core (contract/preflight/gate/repair) | Setup | Verify |
| Verify (self-test + 45-tile pilot) | Core | Phase 002 (consumes the failure JSON) |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup (engine pin + arm paths + schema) | Low | 1-2 hours |
| Core: contract + preflight | Low | 1-2 hours |
| Core: gate + contrast | Medium | 3-5 hours |
| Core: repair pass | Low | 1-2 hours |
| Verification: self-test + 45-tile pilot | Medium | 2-4 hours |
| **Total** | | **8-15 hours** |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Baseline `control`-arm output captured for the paired comparison
- [ ] `A1_ARM` env guard verified (control path is byte-reproducible)
- [ ] Failure-JSON schema frozen in spec.md (REQ-009) before the 45-tile pilot
- [ ] Falsification probe passed (gate-on-baseline confusion matrix + 5-tile repair-success-rate) before the 135-gen run

### Rollback Procedure
1. **Immediate**: set `A1_ARM=control` to disable the contract/gate/repair path.
2. **Revert code**: restore `gen-tile.mjs` `contract()` to the pre-`a1Block` form.
3. **Quarantine**: move `a1-gate.mjs` / `a1-repair.mjs` aside; keep collected `*.gate.json`.
4. **Verify**: re-run one concept spec under `control` and diff against the prior run.

### Data Reversal
- **Has data migrations?** No (only generated HTML + JSON artifacts under `research/inputs/dist-*`).
- **Reversal procedure**: delete the per-arm `dist-<arm>-<run>/` dirs; baseline `dist/` is untouched.

<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN
- Core + Level 2 addendum (phase deps, effort, enhanced rollback)
- FIX ADDENDUM included: this phase adds a new acceptance gate over a render boundary
- Exact files + the deterministic gate as the load-bearing measurement surface
-->
