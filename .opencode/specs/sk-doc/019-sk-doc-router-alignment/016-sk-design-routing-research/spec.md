---
title: "Feature Specification: sk-design Routing Research"
description: "Deep-research charter to diagnose sk-design routing faults and apply the sk-doc typed-pair routing optimizations. sk-design is a parent hub with six per-mode routers whose leaf paths all resolve (D5=100), but zero playbook scenarios carry typed gold and no leaf-manifest exists, so typed-pair routing is unmeasured against a baseline aggregate of ~69 CONDITIONAL."
trigger_phrases:
  - "sk-design routing research"
  - "sk-design typed pair routing"
  - "sk-design leaf manifest gap"
  - "sk-design benchmark recall"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "sk-doc/031-sk-doc-router-alignment/016-sk-design-routing-research"
    last_updated_at: "2026-07-16T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Scaffolded the sk-design routing-research charter for a bound /deep:research run"
    next_safe_action: "Launch the /deep:research loop bound to this packet; it populates research/"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "016-sk-design-routing-research-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: sk-design Routing Research

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Research Complete |
| **Created** | 2026-07-16 |
| **Branch** | `016-sk-design-routing-research` |
| **Track** | sk-doc |
| **Parent** | `sk-doc/031-sk-doc-router-alignment` |
| **Type** | Research packet (deep-research loop complete) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
sk-design's routing cannot be measured on the canonical typed-pair surface. It is a parent hub with six per-mode routers (`interface`, `foundations`, `motion`, `audit`, `md-generator`, and the nested `design-mcp-open-design` transport). The surface router is healthy on disk: every declared leaf path resolves, so the deterministic D5 dimension scores 100. But zero playbook scenarios carry typed gold (`expected_workflow_mode` + `expected_leaf_resources`), and there is no `leaf-manifest.json`, so the typed-pair and mode-routing dimensions never compute. The committed baseline aggregate sits at roughly 69 (CONDITIONAL), a number that reflects an unmeasured routing surface rather than a diagnosed one.

### Purpose
Diagnose sk-design's routing on the typed-pair surface and apply the sk-doc typed-pair routing optimizations proven in sibling packets 010 and 015: generate a leaf-manifest, stand up manifest-gated typed gold on the genuine routing scenarios, and surface the meaningful routing-quality number. This packet is the diagnosis; it hands a prioritized, implementable fix plan to a sibling implementation packet.

### Outcome (expected)
The `/deep:research` loop bound to this folder will populate `research/` with the per-mode routing classification, the leaf-manifest feasibility check, the typed-gold derivation feasibility for a hub with six modes plus a nested transport, and a dependency-ordered fix plan. The canonical synthesis will live in `research/research.md`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Q1: whether sk-design's six per-mode routers can be typed onto the `(workflowMode, leafResourceId)` surface without editing the (D5=100) map
- Q2: whether a `leaf-manifest.json` can be generated for the hub and its nested `design-mcp-open-design` transport, and whether `--check` is byte-stable
- Q3: which playbook scenarios are genuine routing decisions versus deterministic/behavior scenarios that must be excluded from typed-gold authoring
- Q4: why the baseline aggregate sits at ~69 CONDITIONAL and whether the driver is a measurement artifact or a routing fault
- Q5: a prioritized, implementable fix plan tied to each diagnosed failure mode

### Out of Scope
- Routing research for skills other than sk-design (siblings 017-019 cover system-code-graph, system-deep-loop, sk-prompt)
- Applying the fixes; the deliverable here is a diagnosis and fix plan handed to a sibling implementation packet
- Any "correctness" edit to the sk-design RESOURCE_MAP or intent logic (the map resolves; editing it to chase a hypothesized bug is a scope-lock violation)

### Files to Change
Research packet, no source changes. Deliverables live under `research/`: `research.md`, `deep-research-dashboard.md`, `findings-registry.json`, `iterations/`, `deltas/` — all created by the bound deep-research loop.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria | Status |
|----|-------------|---------------------|--------|
| REQ-001 | Classify sk-design's six per-mode routers against the typed-pair surface | Each mode's leaf set mapped to `(workflowMode, leafResourceId)` pairs with file:line evidence | Answered |
| REQ-002 | Determine leaf-manifest feasibility for the hub plus nested transport | A generated manifest with a byte-stable `--check`, or a documented reason it cannot be generated | Answered |
| REQ-003 | Partition playbook scenarios into routing vs non-routing | Every genuine routing scenario identified; deterministic/behavior scenarios listed and excluded | Answered |
| REQ-004 | Attribute the ~69 CONDITIONAL baseline to a measurement artifact or a real fault | Per-dimension loss attribution with the driver named | Answered |
| REQ-005 | Deliver a prioritized, implementable fix plan | Each fix tied to a diagnosed failure mode, implementable without further research | Answered |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All five research questions answered with file:line evidence in `research/research.md`.
- **SC-002**: A prioritized fix plan exists where every item is implementable without further research, tied to a diagnosed failure mode and handed to a sibling implementation packet.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation / Resolution |
|------|------|--------|------|
| Dependency | sk-design committed baseline (~69 CONDITIONAL) | Findings need grounding in a scored run | Re-run the router-mode benchmark during research to confirm the current number before diagnosing it |
| Dependency | Wave 1 typed-pair machinery (loader/scorer/dispatch) and the sk-doc/015 recipe | The measurement path this packet exercises | Shipped on origin/v4; reuse the manifest-gated derivation proven on sk-code |
| Risk | The nested `design-mcp-open-design` transport complicates typed-pair attribution | Manifest generation or dominant-mode narrowing could be ambiguous | Treat the transport as a distinct mode during the manifest feasibility check; document any ambiguity rather than assuming |
| Risk | Typed gold authored by transcribing router output (gold ≡ output, measures nothing) | Would produce a meaningless number | Derive gold from each scenario's stated intent, independent of router output |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Whether the six-mode hub plus nested transport needs one leaf-manifest or a per-mode manifest boundary is resolved during the feasibility check, not assumed.
- Whether the ~69 CONDITIONAL verdict is driven by an always-loaded preamble that does not type-resolve (the sk-code pattern) or by a genuine leaf-recall gap is a primary research question.
- Diagnose sk-design skill-routing faults and apply the sk-doc typed-pair routing optimizations, including per-mode intent/resource configuration, benchmark scoring, leaf-manifest and typed-gold feasibility, and concrete optimizations.

### Research Status
Complete. The eight-iteration loop resolved all five questions at the configured hard cap. `research/research.md` is the canonical synthesis and carries the dependency-ordered fix plan for a sibling implementation packet.

### Research Context
Deep research is complete for this topic. `research/research.md` remains the canonical findings source.

<!-- BEGIN GENERATED: deep-research/spec-findings -->
- The public surface has six independent mode namespaces; the hub is not a seventh mode.
- One deterministic root manifest can represent 114 packet-local leaves across the five workflow packets and nested transport.
- The historical ~69 score is driven by D3 proxy=0; D1-inter and D4 are unscored, while D5 remains 100.
- A fresh current score is blocked by 27 unreadable playbook paths, so no current pair-level router fault is yet measured.
- Implement in order: repair topology, generate/check the manifest, author independent typed gold, validate topology, run a same-corpus typed benchmark, then make only evidence-selected router edits.
- The normative design-plus-transport composition lacks a corresponding machine-readable hub bundle rule and needs narrow implementation proof.

Canonical detail: `research/research.md`.
<!-- END GENERATED: deep-research/spec-findings -->
<!-- /ANCHOR:questions -->
