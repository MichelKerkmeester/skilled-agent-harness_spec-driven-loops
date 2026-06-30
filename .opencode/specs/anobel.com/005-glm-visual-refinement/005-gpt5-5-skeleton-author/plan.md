---
title: "Implementation Plan: GPT-5.5 Layout-Template Selector (Contingent 2D-Risk Skeleton Escalation)"
description: "Add a contingent, cost-capped escalation to the phase-004 skeleton service: GPT-5.5-fast (xhigh) selects a pre-validated layout template + params for residual high-risk 2D tiles, a deterministic engine expands it to the phase-004 skeleton, a deterministic spatial validator checks it with one repair before GLM renders, measured per dollar vs downgrade-to-linear."
trigger_phrases:
  - "gpt-5.5 skeleton author"
  - "2d escalation plan"
  - "cost-capped dispatch"
  - "opencode gpt-5.5-fast xhigh"
  - "geometry skeleton dispatch"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "anobel.com/005-glm-visual-refinement/005-gpt5-5-skeleton-author"
    last_updated_at: "2026-06-29T12:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Folded panel: template-selection reframe, spatial validator, contingent on 004"
    next_safe_action: "Hold build until phase 004 reports its residual; then run the funnel probe"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "planning-session"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Exact layout-template registry contents (8-12 layouts) — derive from phase 004's residua…"
    answered_questions:
      - "Dispatch = opencode run --model openai/gpt-5.5-fast --variant xhigh (paid, escalation-on…"
      - "GPT-5.5 selects template + params; a deterministic engine places coordinates"
      - "One selection + one validator-driven repair, not blind best-of-2"
      - "$/recovered-tile is measured against downgrade-to-linear, not deterministic-only"
---
# Implementation Plan: GPT-5.5 Layout-Template Selector (Contingent 2D-Risk Skeleton Escalation)

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js ESM (the bento generation harness, `gen-tile.mjs`) |
| **Framework** | None - file-emitting CLI harness; renderer is GLM-5.2 |
| **Storage** | None - tile artifacts + per-tile skeleton/gate JSON on disk |
| **Testing** | Phase-001 deterministic gate + a deterministic spatial validator + a score-lift-per-dollar A/B holdout harness |
| **Escalation model** | GPT-5.5-fast via cli-opencode (`openai` provider, paid) - layout-template selector only |
| **Deterministic engine** | Template-expander (selection -> coordinates) + spatial validator (containment/overlap/title-zone/row-cap) - code, not a model |
| **Renderer model** | GLM-5.2 via Z.AI Coding Plan (subscription, dispatch cost 0) |

### Overview
This phase is CONTINGENT: build it only if phase 004's measured residual leaves dense-2D failures worth paid recovery. When the deterministic skeleton path (phase 004, including its recompute) fails the phase-001 spatial gate on a residual high-risk 2D tile, dispatch GPT-5.5-fast at `--variant xhigh` to SELECT a pre-validated layout template plus parameters (e.g. `{template:'matrix-3col-4row', params:{...}}`) from a finite registry — the model never emits raw coordinates. A deterministic template-expander turns that selection into the existing phase-004 JSON skeleton, then a deterministic spatial validator (bbox containment + pairwise overlap + title-zone clear + row cap) checks it; on violation it re-dispatches ONCE with the violated-rule IDs, and downgrades-to-linear if the repair also fails. A passing skeleton flows through the unchanged phase-004 compile + GLM-5.2 render + phase-001 gate path, with a post-render scaffold-compliance check. The branch is cost-capped (`<=1` selection + `<=1` repair call and a hard token cap per call, batch budget gated on the pre-spend `N_2D` count) and measured per GPT-5.5 dollar against downgrade-to-linear (the real comparator), provisionally accepting at +2 over the 004 residual. Any GPT-5.5 timeout / non-JSON / schema-fail falls through to downgrade without blocking the batch.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 004's measured residual is reported and qualifies this phase as worth building (the contingency gate)
- [ ] Phase 004 skeleton service + JSON schema exist and emit/consume the skeleton contract
- [ ] Phase 001 gate emits per-tile failure-JSON; phase 002 router labels tiles linear vs 2D-positioned
- [ ] `openai` provider configured and confirmed via `opencode models openai` (slug `openai/gpt-5.5-fast` is documented-live)
- [ ] The layout-template registry (8-12 pre-validated layouts) is derived from 004's residual failure taxonomy
- [ ] The 5-tile funnel probe (parses -> valid template -> expands -> validates -> compiles -> passes 001 gate) ran before the full build

### Definition of Done
- [ ] Escalation fires only on residual high-risk 2D failures; zero calls on linear/SHIP tiles
- [ ] GPT-5.5 emits `{template, params}` only; the deterministic expander places coordinates
- [ ] The deterministic spatial validator + one conditional repair gate every skeleton before GLM
- [ ] Per-tile + batch cost caps (hard token limit) enforced and logged; GPT-5.5 failures fall through to downgrade without blocking the batch
- [ ] Score-lift-per-dollar A/B run on 2D holdouts vs downgrade-to-linear; provisional-accept (>=+2 over the 004 residual under the `$/recovered-tile` floor) recorded with the failure-taxonomy tags
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Contingent escalation provider behind a deterministic default (strategy + failure-triggered fallback), with the model bounded to discrete choices and a deterministic engine owning the math. The deterministic skeleton author stays the default; GPT-5.5 is the escalation TEMPLATE SELECTOR, fired only after deterministic failure on a qualifying tile, and only if 004's measured residual justifies the build (AdaCoder adaptive-planning principle, iter-r2-A6; template-selection converges with 004's A7 renderer-first path).

### Key Components
- **EscalationClassifier**: applies `trigger_gpt55_if` / `skip_gpt55_if` to the tile's primitive, item count, connector needs, and the phase-004 failure state; emits a per-tile decision + reason.
- **Gpt55TemplateSelector**: builds the template-selection prompt (registry enum + params + the tile content payload), runs the cli-opencode dispatch, and validates the returned `{template, params}` against the selection schema (a finite enum, not free-form coordinates).
- **TemplateExpander** (deterministic): expands the validated `{template, params}` into the phase-004 coordinate skeleton — the engine, not the model, places coordinates.
- **SpatialValidator** (deterministic): checks the expanded skeleton for bbox containment + pairwise overlap + title-zone clearance + row cap; emits named violations (e.g. "node#3 overlaps node#5 by 18px") for repair.
- **RepairLoop**: on validator failure, re-dispatches GPT-5.5 ONCE with the violated-rule IDs; if the repair still fails the validator, downgrade-to-linear (no blind best-of-2).
- **CostCapAccountant**: enforces `<=1` selection + `<=1` repair call and the hard token cap per call, plus the batch budget derived from the pre-spend `N_2D`; refuses + logs over-cap calls.
- **EscalationRouter**: in `gen-tile.mjs`, routes the 2D skeleton step deterministic-author -> (on failure + escalate) template-selector -> expander -> validator -> (on violation) one repair -> (on failure / GPT-5.5 error) downgrade-to-linear (phase 004).

### Data Flow
1. Phase 002 labels the tile 2D-positioned; phase 004 computes the deterministic skeleton; GLM renders; phase 001 gate runs.
2. On gate failure, phase 004's recompute runs; if it still fails, control reaches the EscalationClassifier (and only if 004's recorded residual qualifies this phase to run at all).
3. If `trigger_gpt55_if` holds and `skip_gpt55_if` does not, and the batch budget allows, dispatch GPT-5.5 to SELECT `{template, params}`. A timeout / non-JSON / schema-fail / over-cap downgrades this single tile and continues the batch.
4. The TemplateExpander turns the selection into the phase-004 skeleton; the SpatialValidator checks it. On violation, the RepairLoop re-dispatches once with the violated-rule IDs and re-validates.
5. A validated skeleton -> hand to the unchanged phase-004 compile + GLM-render path -> re-run the phase-001 gate + a post-render scaffold-compliance DOM check.
6. Pass -> SHIP (tagged `recovered-2D`); fail / repair-exhausted -> downgrade-to-linear (phase 004, tagged `downgraded`). Either way the CostCapAccountant records the spend and the failure-taxonomy tag.

### Exact dispatch (cli-opencode)
Dispatched from the bento generation harness (a Node process), which is the legitimate external-dispatch use case - not an OpenCode self-invocation. If the harness ever runs inside OpenCode, route the openai dispatch through a sibling cli-* / fresh shell per the cli-opencode self-invocation guard.

```bash
# Provider auth pre-flight first (once per run): require openai; never substitute silently.
PROVIDERS=$(opencode providers list 2>&1)
echo "$PROVIDERS" | grep -q "openai" && OPENAI_OK=1 || OPENAI_OK=0
# OPENAI_OK=0 -> disable escalation, fall back to deterministic skeleton + downgrade-to-linear, ASK operator.
# Slug is confirmed-live: openai/gpt-5.5-fast --variant xhigh is documented in cli-opencode/SKILL.md
# (Fast variant, OpenAI priority tier; opencode models openai resolves the slug directly).

opencode run \
  --model openai/gpt-5.5-fast \
  --variant xhigh \
  --format json \
  --dir "$REPO_ROOT" \
  "$TEMPLATE_SELECT_PROMPT" </dev/null
# Notes:
#   - openai/gpt-5.5-fast = low-latency Fast variant (OpenAI priority service tier); paid premium provider.
#   - --variant xhigh = max reasoning effort (gpt-5.5 effort range tops out at xhigh).
#   - omit --agent (top-level --agent is rejected); the selector role is stated in the prompt body.
#   - </dev/null gives stdin EOF so a non-interactive run does not hang.
#   - Enforce a HARD token cap (structured-output / max-tokens bound); template-selection output is ~150 tokens, well under cap.
#   - Wrap in a timeout; on timeout / non-JSON / schema-fail, downgrade THIS tile and continue the batch.
```

### Template-selection prompt (returns `{template, params}` JSON; never coordinates, never tile code)
Faithful to iter-r2-A6 as revised by the panel: the model picks from the registry, the deterministic expander owns the geometry, and the tile content drives the choice.

```text
You are the layout-template selector for a 480px-high maritime B2B dashboard bento tile.
You do not write UI code and you do not output coordinates. You SELECT exactly one layout
template from the registry and fill its parameters; a deterministic engine places every pixel.

Tile content (author the layout for THIS content):
- brief: <tile brief>
- items: <items / nodes / rows with their labels>
- relationships: <edges / cross-links / branches / overlays the content implies>

Registry (choose exactly one `template`):
- matrix-Ncol-Mrow, hub-spoke, branch-tree, connector-map, popover-stack, ... (8-12 pre-validated templates)

Parameters are a finite, documented set per template (e.g. matrix: { cols, rows, cellLabels[], emphasis }).
Constraints the engine enforces for you: at most 4 visible rows (collapse remainder to "+N more");
the title renders bottom-left and the diagram never enters the title zone; Title Case eyebrow (no CSS uppercase).

Return JSON only: { "template": "<id>", "params": { ... } }. No prose, no coordinates.
```

The deterministic TemplateExpander turns `{template, params}` into the phase-004 skeleton schema (`layoutPrimitive`, `riskFlags`, `zones {diagramFrame, titleFrame}`, `coordinateSystem`, `nodes[]`, `rows[]`, `edges[]`, `overflowPlan`, `textRules`, `validation`); the SpatialValidator then checks containment / pairwise overlap / title-zone clearance / row cap before GLM. Because the model never emits coordinates, the prior absolute-vs-relative coordinate-framing hazard is removed.

### Escalation trigger + spatial validation + cost cap
Source: iter-r2-A6 `trigger_gpt55_if` / `skip_gpt55_if` / `cost_caps`; batch ceiling from iter-r4-risk; spatial validator + comparator + bar from the 5-model panel consensus.

```yaml
escalation:
  # Build precondition: this phase runs at all only if phase 004's measured residual leaves dense-2D failures worth paid recovery.
  # Per-tile precondition: tile is 2D-positioned AND the deterministic skeleton path (incl. recompute) failed the phase-001 gate.
  trigger_gpt55_if:
    - layoutPrimitive in [matrix, flow, hub, branch, popover, node-diagram, network, connector-map]
    - itemCount > 4 and layoutPrimitive not in [linear, stack, simple-kpi, text-card, timeline]
    - brief requires cross-links, connector lines, branching, overlays, pills, edge labels, or popovers
  skip_gpt55_if:
    - layoutPrimitive in [linear, stack, simple-kpi, text-card, timeline]
    - no connector geometry
    - no more than 4 visible rows
    - tile already passes the phase-001 gate

spatial_validation:
  # Deterministic; runs between the expanded skeleton and GLM. Replaces blind best-of-2.
  checks: [bbox_containment, pairwise_overlap, title_zone_clear, row_cap]
  on_violation: re-dispatch ONCE with the violated-rule IDs; downgrade-to-linear if the repair also fails

cost_caps:
  max_gpt55_selection_calls_per_2d_tile: 1
  max_gpt55_repair_calls_per_2d_tile: 1
  hard_token_cap_per_call: true            # enforced via structured-output / max-tokens; template-selection output is ~150 tokens
  no_gpt55_for_linear_tiles: true
  on_gpt55_failure: downgrade_to_linear_without_blocking_batch   # timeout / non-JSON / schema-fail / over-cap
  # Batch: report N_2D (qualifying failed tiles) BEFORE spend; abort if projected paid calls exceed 2 x N_2D (one selection + at most one repair).
  # GLM render cost = 0 (Z.AI Coding Plan subscription); GPT-5.5 (openai) is paid.
  # Exact dollar ceiling is UNKNOWN without live token prices: track paid_calls x avg_tokens x provider_price.

measurement:
  comparator: downgrade_to_linear          # NOT deterministic-only: a recovered 2D tile at 70 vs its linear version at 80 is a loss
  provisional_accept_at: +2                 # recovered over the 004 residual (the +3 bar equals the predicted ceiling, ~33% self-rejection)
  floor: per_recovered_tile_dollar          # threshold pending live token prices + the 004 downgrade baseline
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 0: Contingency gate + funnel probe (do this before building)
- [ ] Confirm phase 004's measured residual qualifies this phase (else do not build; stay on deterministic skeleton + downgrade-to-linear)
- [ ] Derive the layout-template registry (8-12 pre-validated layouts) from 004's residual failure taxonomy
- [ ] Run the 5-tile funnel probe on the worst tiles: parses -> valid template -> expands -> validates -> compiles -> passes 001 gate (if c->d <50%, the mechanism is broken: stop)

### Phase 1: Setup
- [ ] Run the openai provider auth pre-flight (slug `openai/gpt-5.5-fast --variant xhigh` is confirmed-live in cli-opencode/SKILL.md)
- [ ] Lock the canvas contract + skeleton JSON schema by reusing phase 004's (no new schema)
- [ ] Define the cost-cap constants (`<=1` selection + `<=1` repair call, hard token cap, batch = `N_2D`)

### Phase 2: Core Implementation
- [ ] Implement the EscalationClassifier (`trigger_gpt55_if` / `skip_gpt55_if` + per-tile reason)
- [ ] Implement the Gpt55TemplateSelector dispatch (exact cli-opencode invocation; prompt carries the tile content payload) + `{template, params}` enum/params validation
- [ ] Implement the deterministic TemplateExpander (`{template, params}` -> phase-004 skeleton; the engine places coordinates)
- [ ] Implement the deterministic SpatialValidator (containment / overlap / title-zone / row cap) + the RepairLoop (one re-dispatch with violated-rule IDs)
- [ ] Implement the CostCapAccountant (per-tile + batch budget, hard token limit; refuse + log over-cap) and the GPT-5.5-failure fall-through to downgrade-to-linear
- [ ] Wire the EscalationRouter into `gen-tile.mjs` behind the deterministic author, ahead of downgrade-to-linear

### Phase 3: Verification
- [ ] 45-tile dry run: assert 0 GPT-5.5 calls on linear or already-SHIP tiles; classifier decision logged per tile
- [ ] Failure-injection: a simulated timeout and a malformed-JSON response each downgrade one tile and continue the batch (zero abort)
- [ ] A/B on the 2D holdout set: GPT-5.5 template-selection vs downgrade-to-linear on the same failed cases, with the post-render scaffold-compliance check
- [ ] Compute recovered-tile count and `$/recovered-tile`; record provisional-accept (`>=+2` over the 004 residual under the floor) with the failure-taxonomy tags
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | EscalationClassifier decisions; `{template, params}` enum/params validation; TemplateExpander (selection -> coordinates); SpatialValidator (containment/overlap/title-zone/row-cap); CostCapAccountant caps | Node test runner |
| Integration | gen-tile.mjs escalation branch end to end (deterministic fail -> selector -> expander -> validator -> one repair -> compile -> render -> gate), plus GPT-5.5-failure fall-through to downgrade | Harness on the 2D holdout set |
| Manual | A/B `$/recovered-tile` review vs downgrade-to-linear; failure-taxonomy tally; post-render scaffold-compliance DOM check; linear no-regression spot-check | Phase-001 gate + audit |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 004 measured residual (contingency gate) | Internal | Yellow | Cannot decide whether to build this phase - build is contingent on the recorded residual |
| openai provider (GPT-5.5-fast, paid) | External | Yellow | No escalation; deterministic skeleton + downgrade-to-linear remains |
| Phase 004 skeleton service + schema | Internal | Yellow | Cannot expand/compile a skeleton - hard predecessor |
| Phase 001 deterministic gate (failure-JSON) | Internal | Yellow | Cannot detect 2D failures to escalate - hard predecessor |
| Phase 002 primitive router | Internal | Yellow | Cannot label tiles 2D-positioned - hard predecessor |
| cli-opencode dispatch contract | Internal | Green | `.opencode/skills/cli-opencode/SKILL.md` (model + flags + pre-flight; `openai/gpt-5.5-fast --variant xhigh` confirmed-live) |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: phase 004's residual does not qualify the build, or 2D recovery is below the +2 provisional-accept bar, or `$/recovered-tile` loses to downgrade-to-linear, or paid spend exceeds the batch budget, or GPT-5.5 selections regress linear tiles.
- **Procedure**:
  1. Disable the escalation feature flag (deterministic skeleton + downgrade-to-linear continues; zero paid calls).
  2. Revert the EscalationRouter wiring in `gen-tile.mjs`.
  3. Keep the A/B report (recovered-tile count, `$/recovered-tile` vs downgrade, failure-taxonomy tags) as the rejection evidence for the parent open question.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
-->
