---
title: "Decision Record: deep-agent-improvement model-benchmark mode"
description: "Architecture decisions for adding a model/prompt-framework benchmark mode to deep-agent-improvement: mode selector, pluggable seams, reuse map."
trigger_phrases:
  - "benchmark mode decision record"
  - "mode selector adr"
  - "deep-agent-improvement seams"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/121-deep-agent-improvement-benchmark-mode"
    last_updated_at: "2026-05-28T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored ADRs for the mode-selector design"
    next_safe_action: "Review ADRs; build per plan.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/121-deep-agent-improvement-benchmark-mode"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: Design: add a model/prompt-framework benchmark mode to deep-agent-improvement (port the 120/003 rig behind a mode selector)

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Add a `mode` selector to deep-agent-improvement (agent-improvement | model-benchmark)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed (design) |
| **Date** | 2026-05-28 |
| **Deciders** | repo owner + claude |

---

<!-- ANCHOR:adr-001-context -->
### Context

<!-- Voice guide: State the problem directly. "We needed to choose between X and Y because Z"
     not "A decision was required regarding the selection of an appropriate approach." -->

The 120/003 packet proved a model/prompt-framework benchmark loop works (run MiniMax against fixtures under 5 frameworks, score, hill-climb, pick TIDD-EC + dense). But that rig is packet-local and one-off. deep-agent-improvement runs the same loop shape (generate candidate, score, converge, promote) for agent definitions. We needed to decide how to make model benchmarking a reusable capability without duplicating loop infrastructure or distorting the existing agent-improvement skill.

### Constraints

- Must not change existing agent-improvement behavior (default path stays identical).
- Reuse the proven-generic loop/state/convergence/mutation scripts; don't fork them.
- The two modes score fundamentally different objects (agent-definition quality vs model task-output quality), so their scorers/rubrics cannot be unified.
- deep-loop-runtime is a read-only shared library, not a loop orchestrator, so it cannot host a mutation/promotion loop.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Add a `mode` config key to deep-agent-improvement with two values, `agent-improvement` (default, today's behavior) and `model-benchmark` (port of the 120/003 rig), dispatched through three pluggable seams.

**How it works**: The loop orchestrator reads `mode` and resolves three seams from it — a **candidate source**, a **dispatcher**, and a **scorer**. The shared plumbing (mutation coverage, state reducer, convergence, journal, fixture materializer) runs identically for both modes. Only the three seams differ.

**The three seams**:

| Seam | agent-improvement (today) | model-benchmark (new) |
|------|---------------------------|------------------------|
| Candidate source | parse `.opencode/agents/*.md` into a scored candidate | render a prompt-framework variant (port `render-variant.cjs` + variant templates from 120/003) |
| Dispatcher | none (evaluates local files) | dispatch a model via a CLI (generalize `dispatch-minimax.cjs` → `dispatch-model.cjs` taking executor + model + args, so any cli-X works) |
| Scorer | dynamic 5-dim agent rubric (`score-candidate.cjs`) | task-output 5-dim rubric + deterministic checks + grader (port `eval-rig/` + `score-variant.cjs`) |

**Reuse map** (the load-bearing finding):

| Component | Disposition |
|-----------|-------------|
| `mutation-coverage.cjs`, `reduce-state.cjs`, `converge.cjs`, `materialize-benchmark-fixtures.cjs`, `improvement-journal.cjs` | Reuse as-is (already generic; namespaced by loop_type) |
| `loop.cjs` orchestrator | Modify: read `mode`, resolve seams |
| candidate source / dispatcher / scorer | Mode-specific (factory per mode) |
| promotion + fixture adapters | Keep separate per mode (agent file-copy+mirror-sync vs synthesis-only) |
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Mode selector in deep-agent-improvement (chosen)** | ~90% infra reuse; one skill owns "iterative eval loops"; backward compatible | Adds a second mode to a focused skill; needs seam discipline | 8/10 |
| New dedicated skill (e.g. sk-model-benchmark) | Clean separation | Duplicates the loop/state/convergence plumbing; two skills to maintain | 5/10 |
| Fold into deep-loop-runtime | Already the shared-infra home | It is a read-only library, not a loop host; would need to become an orchestrator (large) | 3/10 |
| Leave packet-local (status quo) | Zero work | Re-ported by hand every time; not a capability | 2/10 |

**Why this one**: The two loops are siblings (same shape, different object). A mode selector shares the proven plumbing while keeping the genuinely-different parts (scorer, dispatch, promotion) cleanly separate, and it is non-breaking for existing agent-improvement runs.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Model/prompt benchmarking becomes a repeatable command instead of a hand-ported rig.
- ~90% of the loop infra is shared, so the new mode is mostly seams + a ported scorer, not a second engine.

**What it costs**:
- A second mode in a previously single-purpose skill. Mitigation: strict seam interfaces + a `mode` default that preserves current behavior.
- ~3-4k LOC build (see plan.md). Mitigation: phased build, port-as-is before generalizing.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Seam abstraction leaks; modes entangle | M | Interface contracts + seam tests; scorers/promotion stay separate |
| Existing agent-improvement regresses | H | `mode` defaults to agent-improvement; regression-test before merge |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | We just hand-ported the rig for 120/003; the next model benchmark would repeat that. |
| 2 | **Beyond Local Maxima?** | PASS | 4 options compared (mode selector, new skill, deep-loop-runtime, status quo). |
| 3 | **Sufficient?** | PASS | Mode selector + 3 seams is the minimum that reuses the plumbing without unifying the incompatible scorers. |
| 4 | **Fits Goal?** | PASS | Directly answers the user's ask: deep-agent-improvement should also benchmark models. |
| 5 | **Open Horizons?** | PASS | Generalized `dispatch-model.cjs` supports any cli-X model, not just MiniMax. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes** (in the follow-on BUILD packet, not here):
- deep-agent-improvement SKILL.md + `improvement_config.json` gain the `mode` selector.
- New `dispatch-model.cjs` + ported `eval-rig/` + `score-variant.cjs`.
- `loop.cjs` reads `mode` and resolves the three seams.

**How to roll back**: the build is additive behind `mode` (default `agent-improvement`). To revert: delete the new seam scripts + `eval-rig/`, remove the `mode` branch from `loop.cjs`, and drop the config keys. Existing agent-improvement runs are untouched throughout.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

## ADR-002: deep-agent-improvement is the home (not a new skill, not deep-loop-runtime)

**Status**: Proposed (design). **Date**: 2026-05-28.

**Decision**: House the model-benchmark mode inside deep-agent-improvement. deep-loop-runtime was rejected because it is a read-only shared library (executor/prompt-pack/scorer helpers consumed by deep-review/research), not a loop orchestrator with mutation + promotion. A new dedicated skill was rejected because it would duplicate the loop/state/convergence plumbing deep-agent-improvement already owns. deep-agent-improvement already has the mutation-coverage, reducer, convergence, journal, and benchmark-fixture machinery, so it is the lowest-duplication home.

**Consequence**: deep-agent-improvement's identity broadens from "agent improvement" to "iterative evaluation loops (agent improvement + model benchmarking)". Its SKILL.md description + triggers update accordingly in the build.

## ADR-003: Keep scorers, fixtures, and promotion mode-separate

**Status**: Proposed (design). **Date**: 2026-05-28.

**Decision**: Share only the proven-generic plumbing; keep the scorer (agent 5-dim rubric vs task-output 5-dim rubric + grader), the fixture adapter (agent fixtures vs task fixtures), and promotion (agent file-copy + mirror-sync vs synthesis-only) as mode-specific implementations. Do not attempt a unified rubric — the two modes score fundamentally different objects, and forcing one rubric would be a wrong abstraction.

**Consequence**: No score comparison across modes; each mode reports its own rubric. This is correct: an agent-quality 0.78 and a task-output 0.78 are not the same unit.

<!--
Level 3 Decision Record: One ADR per major decision.
Write in human voice: active, direct, specific. No em dashes, no hedging.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->

