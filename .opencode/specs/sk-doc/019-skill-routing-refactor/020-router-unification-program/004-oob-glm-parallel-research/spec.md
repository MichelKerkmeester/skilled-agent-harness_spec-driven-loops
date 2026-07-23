---
title: "Feature Specification: Out-of-Box Routing Research — GLM Parallel Lineage"
description: "A parallel GLM-5.2-max out-of-box research lineage (5 iterations, non-converge, lateral) run alongside the SOL-ultra lineage in packet 021, so two models explore radical routing rethinks concurrently. Findings merge into the 021 defaultMode synthesis."
trigger_phrases:
  - "out-of-box routing glm parallel"
  - "glm-5.2 lateral routing ideas"
importance_tier: "important"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Out-of-Box Routing Research — GLM Parallel Lineage

## EXECUTIVE SUMMARY

A second, concurrent out-of-box research lineage (GLM-5.2 at max effort, via opencode) exploring the same radical/lateral agenda as the SOL-ultra lineage in the sibling packet `021`. Two models explore in parallel to diversify the idea space. Prior answer (do NOT re-derive): keep sk-prompt, flip four hubs to `defaultMode: null` with a routing-helper fallback; the full study is in `../002-default-mode-policy-research/run2-archive/research.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Research complete; findings require independent validation before implementation |
| **Created** | 2026-07-18 |
| **Context** | Research |
| **Delivery** | Five-iteration GLM lineage plus canonical root synthesis |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The prior routing study answered the practical `defaultMode` question, but that answer stayed within the existing parent-hub routing frame. A second model lineage was needed to question the frame itself and diversify the idea space without re-deriving the prior keep-versus-null conclusion.

### Purpose

Run a forced five-iteration GLM-5.2 lineage over radical alternatives to parent-hub routing, preserve the resulting evidence and negative knowledge, and provide a bounded synthesis for related routing work. The packet produces research hypotheses only; implementation and migration decisions remain outside its authority.

### Research Context

Question the FRAME of parent-hub routing, not tune within it. Runs 1-2 answered the practical defaultMode question; this lineage must be RADICAL and lateral. Each iteration proposes a genuinely out-of-the-box idea and stresses it — do not refine, diverge.

### Out-of-box agenda (extend freely)
1. **Abolish the hub-router layer** — advisor (Layer 0) picks the mode directly; hubs become pure packet containers. What breaks, what improves?
2. **Learned / adaptive routing** — weights that update from observed corrections; a deterministic-offline learned router.
3. **Cross-domain analogies** — OS schedulers, IP routers, DNS resolvers, load balancers, a human receptionist: how each handles "no clear destination," and what transfers.
4. **No-wrong-door / handoff routing** — any mode accepts then hands off; routing becomes recoverable, dissolving keep-vs-null.
5. **Routing as dialogue** — the zero-signal case as a one-turn typed negotiation, not a silent default.
6. **Confidence-first architecture** — every route carries calibrated confidence; below threshold, always defer with a card. Does this subsume the archetypes?
7. **Radical simplification** — is the INTENT_SIGNALS + RESOURCE_MAP two-layer scheme necessary, or an accident? A minimal replacement.
8. **Contrarian frame-break** — the whole defaultMode debate is a symptom of a deeper design smell; name it and the reframe.

<!-- BEGIN GENERATED: deep-research/spec-findings -->
### Generated Research Findings

- A typed handoff record is the leading candidate for making wrong mode selections recoverable and measurable.
- Routing policy may be clearer when decomposed into threshold, recovery, and provenance instead of encoded primarily through `defaultMode`.
- Uniform signal weights suggest vocabulary-to-mode assignment carries more discrimination than numeric weighting.
- The minimal-router proposal remains a single-lineage design hypothesis and requires independent validation before implementation.

Canonical synthesis: `research/research.md`.
<!-- END GENERATED: deep-research/spec-findings -->
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- In: GLM-5.2-max out-of-box research, 5 iterations, non-converge, lateral.
- Per-iteration narratives, structured deltas, lineage state, route-proof checks, findings registries, and a canonical root synthesis under `research/`.
- Source-backed observations and explicitly bounded design hypotheses for use by related routing synthesis work.

### Out of Scope

- Implementation; this packet changes no runtime routing behavior.
- Re-deriving the run-1/run-2 answer.
- Treating one GLM lineage as independent confirmation or an implementation-ready migration design.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Run the GLM lineage for five forced iterations with convergence disabled as a stop condition. | Lineage state records iterations 1-5 and a `maxIterationsReached` event. |
| REQ-002 | Keep the investigation radical and lateral rather than re-deriving the prior practical answer. | The five iterations cover abolition, cross-domain transfer, typed handoff, confidence and adaptation, and radical simplification. |
| REQ-003 | Preserve auditable output for every iteration. | Each iteration has a narrative, structured delta, and state record under `research/lineages/glm-oob/`. |
| REQ-004 | Synthesize findings, eliminated alternatives, and evidence limits. | `research/research.md` contains the canonical synthesis, recommendations, open questions, evidence limits, convergence report, and references. |
| REQ-005 | Keep research claims bounded to their evidence. | The synthesis identifies the single-lineage limitation, excludes implementation, and requires independent validation before adoption. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Preserve merge and attribution context for related routing work. | Root findings registry, fan-out attribution, orchestration summary, and resource map identify the lineage and its outputs. |
| REQ-007 | Distinguish source-backed observations from design inference. | The synthesis separates uniform-weight and advisor-precedent observations from the typed-handoff, three-axis, and minimal-router hypotheses. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Five GLM iterations are present and mechanically recorded, with all five research questions answered.
- **SC-002**: The canonical synthesis captures promoted ideas, ruled-out alternatives, recommendations, open questions, and evidence limits.
- **SC-003**: The research remains non-implementing and does not present single-lineage hypotheses as independently validated conclusions.
- **SC-004**: Related work can trace each synthesis claim to the lineage report, iteration artifacts, registries, attribution, and orchestration summary.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Single-model lineage | Architecture hypotheses may reflect one model's framing | Require independent validation before implementation or migration. |
| Risk | No live router execution | Repository reading and design inference do not prove runtime behavior | Keep recommendations at research status and evaluate behavior separately. |
| Risk | Timestamp anomalies in lineage records | Some attribution timing cannot be treated as clean subprocess evidence | Preserve the anomaly in the orchestration summary and evidence limits. |
| Dependency | Prior default-mode research | Defines the answer this lineage must not re-derive | Treat it as bounded context and focus on frame-breaking alternatives. |
| Dependency | Repository routing sources | Ground source-backed observations about weights, vocabulary, and advisor behavior | Inventory source paths in `research/resource-map.md`. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- What is the observed base rate of correct default selections?
- Is one bounded handoff cheaper than one clarification turn in latency, tokens, and operator effort?
- How can modes expose handoff without broadening their artifact contracts unsafely?
- What protects offline learning from malicious or low-quality handoff records?
- Does an independent model or executed replay support the threshold, recovery, and provenance decomposition?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Research plan**: See `plan.md`
- **Task record**: See `tasks.md`
- **Verification checklist**: See `checklist.md`
- **Delivery summary**: See `implementation-summary.md`
- **Canonical synthesis**: `research/research.md`
- **Detailed lineage report**: `research/lineages/glm-oob/research.md`
