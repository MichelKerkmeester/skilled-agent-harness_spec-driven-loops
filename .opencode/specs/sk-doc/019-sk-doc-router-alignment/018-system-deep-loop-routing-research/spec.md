---
title: "Feature Specification: system-deep-loop Routing Research"
description: "Deep-research charter to diagnose system-deep-loop routing and apply the sk-doc typed-pair routing optimizations. system-deep-loop is a parent hub with seven workflowModes over five child packets; its per-mode pseudocode routers emit flat child-relative leaf paths that are not packet-qualified, its baseline aggregate is ~71, and zero typed gold exists across roughly 319 scenarios."
trigger_phrases:
  - "system-deep-loop routing research"
  - "deep-loop workflow mode routing"
  - "deep-loop packet-qualified leaf paths"
  - "deep-loop benchmark recall"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "sk-doc/031-sk-doc-router-alignment/018-system-deep-loop-routing-research"
    last_updated_at: "2026-07-16T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Scaffolded the system-deep-loop routing-research charter for a bound /deep:research run"
    next_safe_action: "Launch the /deep:research loop bound to this packet; it populates research/"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "018-system-deep-loop-routing-research-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: system-deep-loop Routing Research

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-16 |
| **Branch** | `018-system-deep-loop-routing-research` |
| **Track** | sk-doc |
| **Parent** | `sk-doc/031-sk-doc-router-alignment` |
| **Type** | Research packet (deep-research loop, pending) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
system-deep-loop's routing cannot be measured on the canonical typed-pair surface, and its coordinate model is structurally ambiguous. It is a parent hub with seven `workflowModes` (research, review, ai-council, alignment, and the improvement/benchmark modes) spread over five child packets. Its per-mode pseudocode routers emit flat, child-relative leaf paths that are not packet-qualified, so the same relative leaf ID (`references/README.md` and similar) is non-unique across the five children — the exact coordinate-collision class that the sk-doc research (packet 010) identified as its wrong-path-root failure. The committed baseline aggregate is roughly 71, and none of the roughly 319 playbook scenarios carry typed gold, so the typed-pair and mode-routing dimensions never compute across the largest scenario surface of any skill in the program.

### Purpose
Diagnose system-deep-loop's routing on the typed-pair surface and apply the sk-doc typed-pair routing optimizations: packet-qualify the child-relative leaf paths so `(workflowMode, leafResourceId)` pairs are unique across the five children, generate a leaf-manifest, and stand up manifest-gated typed gold on the genuine routing scenarios. This packet is the diagnosis; it hands a prioritized, implementable fix plan to a sibling implementation packet.

### Outcome (expected)
The `/deep:research` loop bound to this folder will populate `research/` with the seven-mode routing classification, the packet-qualification analysis of the flat child-relative paths, the leaf-manifest feasibility across five children, the ~319-scenario routing/non-routing partition, and a dependency-ordered fix plan. The canonical synthesis will live in `research/research.md`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Q1: whether the seven per-mode routers can be typed onto the `(workflowMode, leafResourceId)` surface across five child packets
- Q2: whether the flat child-relative leaf paths must be packet-qualified to make typed pairs unique across the five children
- Q3: whether a leaf-manifest can be generated for a hub whose leaves live under five child packets, and whether `--check` is byte-stable
- Q4: which of the ~319 playbook scenarios are genuine routing decisions versus deterministic/behavior scenarios that must be excluded from typed-gold authoring
- Q5: a prioritized, implementable fix plan tied to each diagnosed failure mode, including the packet-qualification migration

### Out of Scope
- Routing research for skills other than system-deep-loop (siblings 016, 017, 019 cover sk-design, system-code-graph, sk-prompt)
- Applying the fixes; the deliverable here is a diagnosis and fix plan handed to a sibling implementation packet
- Re-architecting the seven workflowModes or the five-child packet topology beyond the path-qualification needed for typed-pair attribution

### Files to Change
Research packet, no source changes. Deliverables live under `research/`: `research.md`, `deep-research-dashboard.md`, `findings-registry.json`, `iterations/`, `deltas/` — all created by the bound deep-research loop.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria | Status |
|----|-------------|---------------------|--------|
| REQ-001 | Classify the seven per-mode routers against the typed-pair surface across five children | Each mode's leaf set mapped to `(workflowMode, leafResourceId)` pairs with file:line evidence | Open (research pending) |
| REQ-002 | Determine whether the flat child-relative leaf paths must be packet-qualified for typed-pair uniqueness | The collision set enumerated, with a proposed qualification scheme | Open (research pending) |
| REQ-003 | Determine leaf-manifest feasibility across five child packets | A generated manifest with a byte-stable `--check`, or a documented reason it cannot be generated | Open (research pending) |
| REQ-004 | Partition the ~319 playbook scenarios into routing vs non-routing | Every genuine routing scenario identified; deterministic/behavior scenarios listed and excluded | Open (research pending) |
| REQ-005 | Deliver a prioritized, implementable fix plan | Each fix tied to a diagnosed failure mode, implementable without further research | Open (research pending) |
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
| Dependency | system-deep-loop committed baseline (~71) | Findings need grounding in a scored run | Re-run the router-mode benchmark during research to confirm the current number before diagnosing it |
| Dependency | Wave 1 typed-pair machinery and the sk-doc/015 recipe | The measurement path this packet exercises | Shipped on origin/v4; reuse the manifest-gated derivation and the packet-qualification lesson from sk-doc/010 |
| Risk | Flat child-relative leaf paths collide across five children | Typed pairs would be non-unique, mirroring sk-doc's wrong-path-root failure | Enumerate the collision set (REQ-002) and propose a packet-qualification scheme before proposing typed gold |
| Risk | The ~319-scenario surface is the largest in the program | Routing/non-routing partition is high-effort and error-prone | Partition systematically per workflowMode; document the partition rule so the sibling build can reproduce it |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Whether packet-qualification uses a child-packet prefix or a hub-root-relative address is resolved during research, informed by the sk-doc/010 coordinate-system finding.
- Whether one leaf-manifest spans all five children or each child carries its own manifest boundary is a primary feasibility question.

### Research Status
Planned. The `/deep:research` loop bound to this folder has not yet run. `research/research.md` will become the canonical synthesis and will carry the dependency-ordered fix plan handed to a sibling implementation packet.

### Research Context

An autonomous deep-research run is active for the system-deep-loop typed-pair routing investigation. `research/research.md` remains the canonical findings source; this section records only the bounded workflow anchor.

<!-- BEGIN GENERATED: deep-research/spec-findings -->
The ten-iteration research loop confirmed that canonical routing identity is `{workflowMode, leafResourceId}` with packet ownership stored separately in the registry and manifest. Five child routers expose 88 packet-local coordinates but only 79 flat IDs, including eight cross-packet collisions. The baseline score of 71 exercised no typed-gold rows.

The production loader currently recognizes 21 routing rows; repairing the hub index should yield 39 normalized rows total (35 routing and 4 browser). A proposed seven-mode seed comprises `MR-001..003`, `IL-001..003`, and new alignment scenario `DA-R01`, with 43 candidate typed pairs requiring author approval. Implementation is ordered through loader support, index repair, manifest generation, typed-gold authoring, topology validation, hub resource routing, fallback regression gates, and same-corpus benchmark comparison. `research/research.md` is canonical for the full evidence and acceptance matrix.
<!-- END GENERATED: deep-research/spec-findings -->
<!-- /ANCHOR:questions -->
