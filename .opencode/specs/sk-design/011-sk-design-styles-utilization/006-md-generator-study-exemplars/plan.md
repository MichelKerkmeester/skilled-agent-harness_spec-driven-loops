---
title: "Implementation Plan: bounded STUDY exemplars for design-md-generator"
description: "Reversible Phase B build plan for a pre-WRITE STUDY phase: one-bundle generation-guarded hydration via phase-004 retrieval, a de-literalized observation transformer, target-facts-bound optional prompt block wired through buildWritePrompt/buildPlan, a provenance/rights/injection envelope, and a two-signal source-leak gate in runGuided with discard-and-retry-without-STUDY."
trigger_phrases:
  - "md generator study plan"
  - "STUDY exemplar build plan"
  - "source-leak gate plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/011-sk-design-styles-utilization/006-md-generator-study-exemplars"
    last_updated_at: "2026-07-18T13:40:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the L2 STUDY-exemplars scaffold"
    next_safe_action: "Implement STUDY module after phases 004 and 005 land"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-mdgen-study-011-006"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Implementation Plan: bounded STUDY exemplars for design-md-generator

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Status** | Planned — scaffold; implementation not started |
| **Estimated cost** | ~8–12 engineer-days (Phase B) |
| **Depends on** | `../004-*` retrieval, `../005-md-generator-schema-contract/` |
| **Subject** | `.opencode/skills/sk-design/design-md-generator/` (`build-write-prompt.ts`, `guided-run.ts`) |
| **Reversibility** | STUDY is opt-in; disabling it restores the pre-STUDY WRITE path exactly |

### Overview
A new STUDY module adds a separate, reversible pre-WRITE phase to the generator. It selects exactly one coherent style bundle through the phase-004 retrieval surface under a generation guard, de-literalizes it into structural observations, binds those to the locked target-facts digest, and injects an optional prompt block AFTER the locked FACTS and before the prose task. A two-signal source-leak gate at the authored-draft boundary discards and regenerates without STUDY on any leak signal. STUDY ships only with its transformation, provenance, and leakage controls together — never as a raw few-shot shortcut.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 004 retrieval surface is available for one-bundle selection
- [ ] Phase 005 schema contract exposes a locked target-facts digest / FACTS to bind against
- [ ] The STUDY on/off switch and no-STUDY fallback contract are agreed

### Definition of Done
- [ ] STUDY-disabled output is byte-identical to the pre-STUDY WRITE path
- [ ] The de-literalized transformer emits no verbatim source values or phrases
- [ ] The two-signal leak gate discards and retries without STUDY on every seeded leak
- [ ] Provenance/rights/injection envelope accompanies every STUDY bundle
- [ ] Adversarial + counterfactual fixtures pass
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
A gated, reversible pre-WRITE stage bolted onto the existing guided WRITE pipeline. STUDY is a pure add-on: select → hydrate (guarded) → de-literalize → bind → inject → generate → leak-gate → (retry-without-STUDY on trip). The locked FACTS remain the sole authority for target-measured values; STUDY contributes shape only.

### Key Components
- **Study selector + generation-guarded hydration**: picks one coherent style via phase-004 retrieval and loads its matched DESIGN.md + token artifacts behind a generation guard.
- **De-literalized observation transformer**: converts an exemplar into structural observations, stripping verbatim values, literals, phrases, and assets.
- **Target-facts binding + prompt block**: binds observations to the locked target-facts digest; `build-write-prompt.ts::buildWritePrompt` and `guided-run.ts::buildPlan` inject the optional block after locked FACTS, before the prose task.
- **Provenance / rights / injection envelope**: travels with each STUDY bundle for auditability.
- **Two-signal source-leak gate**: exact-value + normalized-span checks at the authored-draft boundary in `runGuided`; on trip, discard and retry WITHOUT STUDY.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `design-md-generator/**/study-*.ts` | n/a (new) | STUDY selection, transformer, envelope, leak gate | Unit + adversarial fixtures pass |
| `build-write-prompt.ts::buildWritePrompt` | Assembles the WRITE prompt | Add optional STUDY block after locked FACTS | STUDY-off output unchanged; STUDY-on adds block only |
| `guided-run.ts::buildPlan` / `runGuided` | Plans + runs guided generation | Wire STUDY into plan; enforce leak gate + retry | Leak fixtures discard-and-retry-without-STUDY |
| `design-md-generator/**/__fixtures__/study-*` | n/a (new) | Adversarial + counterfactual fixtures | Gate trips and retry verified |

> All source-file edits are **proposed**; nothing is changed by this scaffold.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Selection + guarded hydration
- [ ] Build one-bundle STUDY selection over the phase-004 retrieval surface
- [ ] Add generation-guarded hydration of the matched DESIGN.md + token artifacts

### Phase 2: De-literalization + binding + injection
- [ ] Build the de-literalized observation transformer (structural observations only)
- [ ] Bind observations to the locked target-facts digest
- [ ] Inject the optional STUDY block after locked FACTS via `buildWritePrompt` / `buildPlan`
- [ ] Attach the provenance / rights / injection envelope

### Phase 3: Leak gate + retry + fixtures
- [ ] Add the two-signal (exact-value + normalized-span) leak gate in `runGuided`
- [ ] Implement discard-and-retry-without-STUDY on any leak trip
- [ ] Author adversarial + counterfactual fixtures
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- Reversibility: assert STUDY-disabled output is byte-identical to the pre-STUDY WRITE path.
- De-literalization: adversarial fixtures confirm no verbatim source values or phrases survive the transformer.
- Leak gate: seeded exact-value and normalized-span leaks each trip the gate and force a clean no-STUDY retry.
- Counterfactual: probe that removing STUDY changes only prose shape, never target-measured values.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- `../004-*` retrieval surface (one-bundle selection) — must land first.
- `../005-md-generator-schema-contract/` locked target-facts / FACTS — must land first.
- The `design-md-generator` guided WRITE pipeline (`build-write-prompt.ts`, `guided-run.ts`).
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

STUDY is opt-in and reversible by design: disable the STUDY switch and the generator runs the exact pre-STUDY WRITE path. Deleting the new study module and reverting the `buildWritePrompt` / `buildPlan` edits fully removes the feature with no residual effect on locked FACTS or target values.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Selection + hydration) ──► Phase 2 (Transform + bind + inject) ──► Phase 3 (Leak gate + retry + fixtures)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Selection + hydration | phase-004 retrieval | Transform + bind + inject |
| Transform + bind + inject | Selection + hydration, phase-005 locked FACTS | Leak gate + retry + fixtures |
| Leak gate + retry + fixtures | Transform + bind + inject | Verification |
| Verification | Leak gate + retry + fixtures | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Selection + guarded hydration | Med | 2-3 eng-days |
| Transform + bind + inject + envelope | High | 3-4 eng-days |
| Leak gate + retry + fixtures | High | 3-5 eng-days |
| **Total** | | **~8-12 eng-days** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] STUDY switch defaults to off until reversibility is proven
- [ ] STUDY-off byte-identity test is green
- [ ] Leak-gate fixtures are green

### Rollback Procedure
1. Disable the STUDY switch — the generator runs the exact pre-STUDY WRITE path.
2. Revert the `buildWritePrompt` / `buildPlan` edits and delete the study module.
3. Re-run the STUDY-off byte-identity test to confirm no residual effect.
4. No stakeholder notification needed; STUDY is internal to generation.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A — STUDY writes no persistent state; locked FACTS are untouched.
<!-- /ANCHOR:enhanced-rollback -->

---

## RELATED DOCUMENTS

- **Specification**: `spec.md`
- **Tasks**: `tasks.md`
- **Checklist**: `checklist.md`
- **Parent**: `../spec.md`
