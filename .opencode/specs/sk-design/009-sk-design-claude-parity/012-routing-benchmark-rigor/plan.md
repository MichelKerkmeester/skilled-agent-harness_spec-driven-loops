---
title: "Implementation Plan: Phase 012 - Rigorous Routing Benchmark and Skill-Advisor Verification"
description: "Plan for updating the sk-design Lane-C benchmark corpus for Phases 006-011, freezing a post-011 baseline, and running a numerically-gated routing-accuracy benchmark across advisor confidence, hub mode-resolution, and procedure-card selection."
trigger_phrases:
  - "phase 012 plan"
  - "routing benchmark plan"
  - "post-011 baseline"
  - "advisor confidence extension"
importance_tier: "high"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/012-routing-benchmark-rigor"
    last_updated_at: "2026-07-06T00:00:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Reconciled to accepted-narrower-evidence closeout per ADR-003; phases below unexecuted"
    next_safe_action: "No further action required; future phase may pick up ADR-003 descoped work"
---
# Implementation Plan: Phase 012 - Rigorous Routing Benchmark and Skill-Advisor Verification

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown scenario files, JSON benchmark reports/config, CommonJS harness scripts (`.cjs`) |
| **Framework** | Spec Kit Level 3 packet planning an extension of the existing `deep-loop-workflows` Lane-C skill-benchmark harness against `sk-design`'s `manual_testing_playbook` |
| **Storage** | File-based spec packet, benchmark report folders under `.opencode/skills/sk-design/benchmark/`, and playbook scenario files under `manual_testing_playbook/` |
| **Testing** | Spec strict validation now; once implemented, `run-skill-benchmark.cjs` in router and live trace modes, plus manual reviewer verification of advisor-confidence and card-selection scenarios |

### Overview

This phase plans an update to the `sk-design` Lane-C benchmark corpus and scenarios for Phases 006-011's changes, the freezing of a new `baseline-post-011/` comparison anchor once those phases land, and a rigorous, materially larger routing-accuracy benchmark covering skill-advisor top-1 confidence and gap-to-second, hub mode-resolution accuracy, and procedure-card selection accuracy per mode, in both router and live trace modes. Numeric "near-perfect routing" floors and a remediation loop are defined as release-gate decisions in `decision-record.md`. **This plan was not executed as originally written.** Per `decision-record.md` ADR-003 (Accepted, 2026-07-06), Phase 012 closes instead on the existing, real `benchmark/after-012-routing-rigor/report.{json,md}` Mode A router-mode evidence (verdict PASS, aggregate 100/100), which scores the same non-expanded 24-scenario corpus as `benchmark/after-009/`. The corpus expansion, `07--procedure-card-selection/` and `08--advisor-confidence-battery/` categories, `advisor-probe.cjs`/`score-skill-benchmark.cjs` harness extension, live-mode rerun, and `benchmark/baseline-post-011/` promotion described in the remainder of this plan were never built; they remain descoped, open work for a future phase, not silently claimed as done. The sections below are retained as historical planning context.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

> **Reconciliation note (2026-07-06)**: Per `decision-record.md` ADR-003, the checkboxes below describe the original expanded-battery plan and are left unchecked where that work was never executed. Phase 012 closed instead on the existing narrower Mode A evidence; see `checklist.md` for the honest, item-by-item PASS/UNSCORED verdicts and `implementation-summary.md` for the closeout evidence actually used.

### Definition of Ready
- [ ] Phases 006-011 are independently validated (`validate.sh --strict`) and each phase's `implementation-summary.md` confirms completion. **Not fully met**: Phases 006, 007, 008, 009, and 011 each have a Complete `implementation-summary.md`; Phase 010 (`010-feature-catalog-completeness/`) has none at the time of this reconciliation. This gap is not resolved by this reconciliation; it is named here and in `implementation-summary.md` Known Limitations.
- [ ] The release owner has confirmed the corpus scope: which Phases 006-011 change surfaces require a scenario update versus a net-new scenario. **Not executed** — no change-surface audit was performed; descoped per ADR-003.
- [ ] `benchmark/baseline/` and `benchmark/after-009/` have been read and their scenario ids, dimension scores, and conventions are understood as the immutable comparison history. **Not executed for this reconciliation** — this pass reads `benchmark/after-012-routing-rigor/` directly instead; no comparison against `baseline/`/`after-009/` scenario ids was performed.
- [ ] `advisor-probe.cjs` and `score-skill-benchmark.cjs` have been read in full so the confidence/gap-to-second extension is additive, not a rewrite. **Not executed** — confirmed via `git status` that neither file has any diff; the extension itself was never built.

### Definition of Done
- [ ] The corpus and `manual_testing_playbook` scenarios reflect every Phases 006-011 change surface, traced to each phase's file list. **Not executed** — descoped per ADR-003.
- [ ] `benchmark/baseline-post-011/` exists only after explicit release-owner confirmation and promotion; `benchmark/baseline/` and `benchmark/after-009/` are untouched. **Not executed** — no `baseline-post-011/` folder was created; `baseline/` and `after-009/` remain untouched (confirmed, no promotion attempted).
- [ ] The combined battery totals at least 60 scenarios/prompts across mode-routing, procedure-card-selection, and advisor-confidence categories. **Not met** — the accepted `after-012-routing-rigor/` report scores 24 total scenarios (18 scored, 6 routed to browser), unchanged from `after-009/`.
- [ ] `dims.d1inter` reports `topConfidence` and `gapToSecond` for every scenario with a successful advisor probe, rendered in `report.md`. **Not met** — `report.json`'s `dimensionScores.D1inter` still only carries `score`/`status` (`unscored-mode-a`); no `topConfidence`/`gapToSecond` field exists.
- [ ] Every procedure card active after Phases 006-011 land has a router-mode and live-mode selection scenario. **Not met** — no `07--procedure-card-selection/` category exists in the accepted report's corpus.
- [x] `decision-record.md` states numeric floors for D1 intra, D1 inter, D2, D5, advisor confidence, gap-to-second, and procedure-card selection accuracy, plus a remediation loop with owner and cadence. **Met** — ADR-001 states all seven floors plus router/live reconciliation; ADR-002 states the remediation loop (owner: release owner per Phase 005 precedent).
- [x] Strict validation for this phase packet has been run; the exit code is recorded in a future `implementation-summary.md` once implementation begins. **Met** — recorded in `implementation-summary.md` after this reconciliation's content edits and metadata regeneration.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Additive benchmark-corpus expansion plus an additive harness-scoring extension, gated by an explicit numeric release decision.

### Key Components
- **Corpus/scenario audit**: A traceability pass mapping every Phases 006-011 change surface to a corpus/scenario update, sourced from each phase's `implementation-summary.md`.
- **Expanded battery**: New `manual_testing_playbook` categories (`07--procedure-card-selection/`, `08--advisor-confidence-battery/`) plus updates to existing categories, bringing the total scenario/prompt count to at least 60.
- **Advisor confidence/gap-to-second extension**: Additive fields on `advisor-probe.cjs`'s `scoreD1Inter` output and `score-skill-benchmark.cjs`'s `dims.d1inter`, computed from the already-available ranked `recommendations` array (`recs[0].confidence`, `recs[1].confidence`).
- **Post-011 baseline**: A new, explicitly promoted `benchmark/baseline-post-011/` folder that becomes the comparison anchor for Phase 013 onward, appended alongside (not replacing) `benchmark/baseline/` and `benchmark/after-009/`.
- **Release-gate decision**: Numeric floors and a remediation loop recorded in `decision-record.md`, following Phase 005's release-authority precedent.

### Data Flow

Once Phases 006-011 land, the corpus/scenario audit reads each phase's file list and updates or adds scenarios. `run-skill-benchmark.cjs` runs the expanded battery in router mode (deterministic replay against `hub-router.json`/`mode-registry.json`/procedure-card triggers) and in live mode (real dispatch, including the advisor probe for D1-inter). The harness's advisor-probe/scoring layer emits `topConfidence` and `gapToSecond` alongside the existing rank-weighted score. The release owner compares the fresh run against the defined numeric floors, promotes a passing run to `benchmark/baseline-post-011/`, and records any remediation loop invocation in `decision-record.md`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Planned Action | Verification |
|---------|--------------|--------|--------------|
| Phase 012 spec packet | Planning and continuity surface | Authored Level 3 docs describing future work; no implementation yet | `validate.sh <phase-root> --strict` |
| `sk-design` benchmark corpus | Frozen Phase 005 evidence (`baseline/`, `after-009/`) | Planned expansion and new post-011 baseline, appended not overwritten | Sibling-folder append-only review |
| `manual_testing_playbook` | Six existing categories (01-06) | Planned two new categories (07, 08) plus updates to existing categories | Root playbook index review |
| `advisor-probe.cjs` / `score-skill-benchmark.cjs` | Rank-weighted D1-inter scoring only (`score`, `rank`, `topSkill`) | Planned additive fields (`topConfidence`, `gapToSecond`) | Diff review confirms no removed/renamed existing field |
| `skill_advisor.py` and other advisor scoring source | Skill-advisor's own ranking implementation | Unchanged by this phase | Boundary review confirms no Phase 012 edit |
| Five `sk-design` modes and their procedure cards | Owners of routing/procedure behavior | Unchanged by this phase; only benchmarked | Boundary review confirms no mode/registry/procedure-card edit |

Required inventories:
- Same-class producers: List every Phases 006-011 change surface and classify each as requiring a scenario update, a net-new scenario, or no benchmark impact.
- Consumers of changed symbols: Review any existing consumer of `dims.d1inter.score`/`rank`/`topSkill` before adding fields, to confirm the addition is non-breaking.
- Matrix axes: Owning mode, procedure card, trigger, trace mode (router/live), dimension (D1 intra/inter, D2, D5, confidence, gap-to-second), and floor.
- Algorithm invariant: A benchmark or scenario change may add measurement surface, but it may not change `sk-design`'s public routing behavior or `skill_advisor.py`'s scoring implementation.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

> **Reconciliation note (2026-07-06)**: None of Task Phases 1-4 below were executed. Phase 012 closed via `decision-record.md` ADR-003's acceptance of the existing `benchmark/after-012-routing-rigor/` evidence instead. Every checkbox below is left unchecked as an honest record that this specific corpus-expansion/harness-extension/baseline-promotion work remains open for a future phase.

### Phase 1: Corpus and Change-Surface Audit
- [ ] Confirm Phases 006-011 are complete via each phase's `implementation-summary.md` and strict validation.
- [ ] Read `benchmark/baseline/`, `benchmark/after-009/`, and `benchmark/README.md` to capture the existing scenario ids, dimension scores, and conventions.
- [ ] Build the change-surface inventory mapping each Phases 006-011 file-list entry to a scenario update, a net-new scenario, or no benchmark impact.
- [ ] Read `advisor-probe.cjs` and `score-skill-benchmark.cjs` in full to confirm the confidence/gap-to-second extension points.

### Phase 2: Battery Expansion and Harness Extension
- [ ] Update existing `manual_testing_playbook` categories for Phases 006-011 changes identified in Phase 1.
- [ ] Add `07--procedure-card-selection/` scenarios for every active procedure card, proving router-mode and live-mode selection by trigger.
- [ ] Add `08--advisor-confidence-battery/` scenarios (at least 40 prompts) distinct from mode-routing scenarios, covering plausible neighbor-skill ambiguity.
- [ ] Extend `advisor-probe.cjs`'s `scoreD1Inter` to compute and return `topConfidence` and `gapToSecond` from the existing ranked `recommendations` array.
- [ ] Thread the new fields through `score-skill-benchmark.cjs`'s `dims.d1inter` and `build-report.cjs`'s rendering, additively.

### Phase 3: Rigorous Benchmark Run and Numeric Gate
- [ ] Run the expanded battery in router mode; capture `after-011/report.json` and `report.md`.
- [ ] Run the expanded battery in live mode; capture `after-011-live/report.json` and `report.md`, including D1-inter, advisor confidence, gap-to-second, and browser-class scenarios.
- [ ] Reconcile router-mode and live-mode results per scenario; document any divergence as a routing risk.
- [ ] Compare results against the numeric floors defined in `decision-record.md` ADR-001.
- [ ] Invoke the remediation loop (ADR-002) for any scenario or dimension below its floor; re-run only the affected scope and record the outcome.

### Phase 4: Baseline Promotion and Handoff
- [ ] Obtain explicit release-owner confirmation that Phases 006-011 are complete and the rigorous pass meets its floors (or has documented accepted risk).
- [ ] Promote the passing run to `benchmark/baseline-post-011/` as a new, appended sibling folder.
- [ ] Update `benchmark/README.md` with the new corpus size, new metrics, and the new baseline pointer.
- [ ] Update this phase's own docs (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`) with final evidence and add `implementation-summary.md`.
- [ ] Run strict spec validation and record the exit code.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Spec validation (this packet, now) | Required Level 3 docs and metadata for the planning packet itself | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <phase-root> --strict` |
| Router-mode benchmark (future) | Full expanded battery, deterministic replay | `node run-skill-benchmark.cjs --skill .opencode/skills/sk-design --trace-mode router --output <dir>/after-011/report.json` |
| Live-mode benchmark (future) | D1-inter, advisor confidence, gap-to-second, D4, browser-class scenarios | `node run-skill-benchmark.cjs --skill .opencode/skills/sk-design --trace-mode live --output <dir>/after-011-live/report.json` |
| Advisor probe unit check (future) | `topConfidence`/`gapToSecond` computed correctly from ranked recommendations | Direct `advisor-probe.cjs` CLI invocation against known prompts with a known second candidate |
| Boundary audit (this packet, now) | No edits outside Phase 012 root during packet creation | `git diff -- .opencode/specs/sk-design/009-sk-design-claude-parity/012-routing-benchmark-rigor` |
| Router/live reconciliation (future) | Every scenario id scored in both trace modes | Per-scenario comparison table in the release report |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phases 006-011 | Internal phases | Not yet landed at the time this plan was authored | Blocks all corpus, baseline, and rigorous-benchmark execution; this plan only authors the intended approach |
| Phase 005 parity-benchmark release gate | Internal phase | Complete per verified grounding facts | Supplies the existing `baseline/`, `after-009/`, and append-only baseline conventions this phase extends |
| `deep-loop-workflows` Lane-C harness | Shared script surface | Existing and stable | Blocks the advisor confidence/gap-to-second extension if the harness's D1-inter scoring shape changes upstream first |
| `system-skill-advisor` `skill_advisor.py` CLI | External read-only dependency | Existing and stable; not modified by this phase | Blocks accurate confidence/gap-to-second measurement if its ranked-output contract changes |
| Release owner authority | Human dependency | Named per Phase 005 precedent (repository owner, delegated to executing session) | Blocks baseline promotion and remediation-loop closure without a named authority |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Phase packet validation fails in a way that cannot be corrected within the packet boundary, or Phases 006-011 do not land in a state this plan can benchmark against.
- **Procedure**: Revert only the Phase 012 child folder additions; no benchmark run, harness edit, or playbook scenario has been created yet, so there is nothing outside this folder to roll back at the planning stage.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Phases 006-011 (external, not yet landed) -> Phase 012 Task Phase 1 (audit) -> Task Phase 2 (battery + harness) -> Task Phase 3 (rigorous run + gate) -> Task Phase 4 (promotion + handoff)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Corpus and Change-Surface Audit | Phases 006-011 complete, Phase 005 conventions | Battery Expansion and Harness Extension |
| Battery Expansion and Harness Extension | Change-surface inventory | Rigorous Benchmark Run and Numeric Gate |
| Rigorous Benchmark Run and Numeric Gate | Expanded battery, harness extension, numeric floors (decision-record.md) | Baseline Promotion and Handoff |
| Baseline Promotion and Handoff | Passing (or accepted-risk) rigorous run | Phase 013 |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Corpus and Change-Surface Audit | Medium | 2-3 hours |
| Battery Expansion and Harness Extension | High | 5-8 hours |
| Rigorous Benchmark Run and Numeric Gate | High | 3-5 hours |
| Baseline Promotion and Handoff | Medium | 1-2 hours |
| **Total** | | **11-18 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Confirm Phases 006-011 are independently validated and complete before any corpus or baseline work begins.
- [ ] Confirm no parent, sibling, external, or research folders are modified during packet creation.
- [ ] Confirm the advisor-probe/scoring extension location is reviewed before any implementation write.

### Rollback Procedure
1. Stop implementation if Phases 006-011 are not confirmed complete or the release owner is unavailable.
2. Revert any playbook scenario or benchmark report files introduced by the phase.
3. Revert the `advisor-probe.cjs`/`score-skill-benchmark.cjs` extension if it is found to be non-additive.
4. Re-run strict spec validation and any harness-level tests used by the implementation.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: Remove or revert benchmark reports, playbook scenarios, and the harness-scoring extension only; no persisted user data is involved.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
Phases 006-011 (external)
        |
        v
Corpus/change-surface audit ---> Battery expansion + harness extension ---> Rigorous run + numeric gate ---> Baseline promotion
        ^                                      |                                    |
        |                                      v                                    v
Phase 005 conventions ------------------> Playbook categories 07/08          decision-record.md ADR-001/ADR-002
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Corpus/change-surface audit | Phases 006-011 file lists, Phase 005 conventions | Change-surface inventory | Battery expansion |
| Battery expansion | Change-surface inventory | Expanded scenario set (>=60) | Rigorous run |
| Advisor confidence/gap-to-second extension | Existing `probeAdvisor` ranked recommendations | `topConfidence`/`gapToSecond` fields | Rigorous run's advisor dimension |
| Rigorous run (router + live) | Expanded battery, harness extension | Fresh reports, per-scenario reconciliation | Numeric gate comparison |
| Numeric gate comparison | Decision-record floors, fresh reports | Pass/remediate verdict | Baseline promotion |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Corpus and change-surface audit** - 2-3 hours - CRITICAL
2. **Battery expansion and harness extension** - 5-8 hours - CRITICAL
3. **Rigorous benchmark run and numeric gate** - 3-5 hours - CRITICAL
4. **Baseline promotion and handoff** - 1-2 hours - CRITICAL

**Total Critical Path**: 11-18 hours

**Parallel Opportunities**:
- Procedure-card-selection scenario drafting and advisor-confidence-battery drafting can run in parallel once the change-surface inventory is stable.
- The harness's advisor-probe extension and the playbook scenario drafting can proceed in parallel; they only join at the rigorous-run phase.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Audit ready | Change-surface inventory maps every Phases 006-011 surface to a scenario action | After Phases 006-011 confirmed complete |
| M2 | Battery ready | Combined battery reaches at least 60 scenarios/prompts across mode-routing, card-selection, and advisor-confidence categories | After scenario drafting |
| M3 | Harness ready | `dims.d1inter` reports `topConfidence` and `gapToSecond` without breaking existing fields | Before the rigorous run |
| M4 | Gate ready | Rigorous run compared against numeric floors, remediation loop invoked if needed | Before baseline promotion |
| M5 | Phase ready | `benchmark/baseline-post-011/` promoted, `benchmark/README.md` updated, strict validation passes | Phase completion |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISIONS

| Decision | Rationale | Consequence |
|----------|-----------|-------------|
| Additive harness extension over a new parallel scorer | Keeps a single source of truth for D1-inter scoring and avoids divergent implementations | The extension must be reviewed for non-breaking compatibility with existing consumers |
| New sibling baseline folder over overwriting `after-009/` | Preserves Phase 005's append-only comparison history | Adds one more folder to track, but keeps every prior verdict recoverable |
| Numeric floors over a qualitative verdict | Prevents a future release claim from resting on an easy corpus or route-only success | Requires the release owner to accept explicit numbers instead of an impression |
| Remediation routed to a new phase when it needs registry/procedure-card/advisor-source changes | Keeps Phase 012's write boundary limited to benchmark and routing-test surfaces | A found routing gap may not be fixable inside this phase alone |

## AI EXECUTION PROTOCOL

### Pre-Task Checklist
- Confirm Phases 006-011 are independently validated and complete before any corpus, baseline, or harness work begins.
- Confirm the current task scope permits edits to the benchmark, playbook, and named harness files before implementation begins.
- Confirm the release owner is available to gate baseline promotion and any remediation-loop decision.

### Execution Rules
| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Complete the change-surface audit before drafting any new scenario. |
| TASK-SCOPE | Keep edits inside `sk-design/benchmark/**`, `manual_testing_playbook/**`, and the two named harness files; do not touch `mode-registry.json`, `hub-router.json`, procedure cards, or `skill_advisor.py`. |
| TASK-GATE | Do not promote `benchmark/baseline-post-011/` without explicit release-owner confirmation. |

### Status Reporting Format
Use `STATUS=<planned|blocked|validated> PHASE=012 DETAIL=<short detail>` for handoff updates.

### Blocked Task Protocol
Phase 012 implementation remains blocked until Phases 006-011 are confirmed complete. If any task requires a mode-registry, hub-router, procedure-card, or `skill_advisor.py` change to close a routing gap, that task is out of this phase's scope and must be handed to a new remediation phase instead of silently expanding Phase 012's write boundary.
