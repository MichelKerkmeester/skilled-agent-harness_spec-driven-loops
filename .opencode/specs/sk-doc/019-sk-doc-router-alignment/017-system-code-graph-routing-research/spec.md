---
title: "Feature Specification: system-code-graph Routing Research"
description: "Deep-research charter to diagnose system-code-graph routing and apply the sk-doc typed-pair routing optimizations. system-code-graph is a standalone single-mode skill whose routing lives as embedded pseudocode (INTENT_SIGNALS plus RESOURCE_DOMAINS pointing at dir-prefixes and filename-stems, not enumerable leaf paths); it has no benchmark baseline and 28 playbook scenarios with zero typed gold."
trigger_phrases:
  - "system-code-graph routing research"
  - "code-graph intent signals routing"
  - "code-graph resource domains leaf paths"
  - "system-code-graph benchmark baseline"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "sk-doc/031-sk-doc-router-alignment/017-system-code-graph-routing-research"
    last_updated_at: "2026-07-16T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Scaffolded the system-code-graph routing-research charter for a bound /deep:research run"
    next_safe_action: "Launch the /deep:research loop bound to this packet; it populates research/"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "017-system-code-graph-routing-research-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: system-code-graph Routing Research

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-16 |
| **Branch** | `017-system-code-graph-routing-research` |
| **Track** | sk-doc |
| **Parent** | `sk-doc/031-sk-doc-router-alignment` |
| **Type** | Research packet (deep-research loop, complete) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
system-code-graph's routing cannot be measured on the canonical typed-pair surface, and unlike its sibling hubs it has no measurement scaffolding at all. It is a standalone single-mode skill: its routing lives as embedded pseudocode (`INTENT_SIGNALS` plus `RESOURCE_DOMAINS`) that points at directory prefixes and filename stems rather than enumerable leaf paths. There is no committed benchmark baseline, and none of its 28 playbook scenarios carry typed gold (`expected_workflow_mode` + `expected_leaf_resources`). Because the resource targets are prefix/stem globs, there is not even a discrete leaf set from which to build a `leaf-manifest.json` — the precondition for the typed-pair surface is itself missing.

### Purpose
Diagnose system-code-graph's routing and determine what it would take to bring it onto the typed-pair measurement standard proven for sk-doc: whether the prefix/stem `RESOURCE_DOMAINS` can be enumerated into a discrete leaf set, whether a leaf-manifest is generatable, and how a first benchmark baseline should be established for a single-mode skill. This packet is the diagnosis; it hands a prioritized, implementable fix plan to a sibling implementation packet.

### Outcome (expected)
The `/deep:research` loop bound to this folder will populate `research/` with the enumerability analysis of the `RESOURCE_DOMAINS` globs, a leaf-manifest feasibility verdict, a proposal for the first benchmark baseline, and a dependency-ordered fix plan. The canonical synthesis will live in `research/research.md`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Q1: whether the embedded `INTENT_SIGNALS` + `RESOURCE_DOMAINS` pseudocode can be mapped onto the `(workflowMode, leafResourceId)` surface for a single-mode skill
- Q2: whether the prefix/stem resource targets can be enumerated into a discrete, resolvable leaf set (the precondition for a leaf-manifest)
- Q3: how a first benchmark baseline should be established given that none exists today
- Q4: which of the 28 playbook scenarios are genuine routing decisions eligible for typed gold, and which are behavior/command scenarios
- Q5: a prioritized, implementable fix plan tied to each diagnosed gap

### Out of Scope
- Routing research for skills other than system-code-graph (siblings 016, 018, 019 cover sk-design, system-deep-loop, sk-prompt)
- Applying the fixes; the deliverable here is a diagnosis and fix plan handed to a sibling implementation packet
- Re-architecting the `INTENT_SIGNALS`/`RESOURCE_DOMAINS` pseudocode beyond the path-form enumeration needed for typed-pair attribution

### Files to Change
Research packet, no source changes. Deliverables live under `research/`: `research.md`, `deep-research-dashboard.md`, `findings-registry.json`, `iterations/`, `deltas/` — all created by the bound deep-research loop.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria | Status |
|----|-------------|---------------------|--------|
| REQ-001 | Map the embedded routing pseudocode onto the typed-pair surface | `INTENT_SIGNALS` + `RESOURCE_DOMAINS` classified into `(workflowMode, leafResourceId)` pairs with file:line evidence | Complete (`research/research.md` Sections 4-7) |
| REQ-002 | Determine whether the prefix/stem resource targets can be enumerated into a discrete leaf set | A resolvable leaf list, or a documented reason the globs cannot be enumerated | Complete (55 physical / 53 proposed typed leaves) |
| REQ-003 | Propose how to establish the first benchmark baseline | A concrete baseline procedure for a single-mode skill with no existing report | Complete (`research/research.md` Section 8) |
| REQ-004 | Partition the 28 playbook scenarios into routing vs non-routing | Every genuine routing scenario identified; behavior/command scenarios listed and excluded | Complete (23 routing / 5 non-routing) |
| REQ-005 | Deliver a prioritized, implementable fix plan | Each fix tied to a diagnosed gap, implementable without further research | Complete (`research/research.md` Sections 12, 15, and 16) |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All five research questions answered with file:line evidence in `research/research.md`.
- **SC-002**: A prioritized fix plan exists where every item is implementable without further research, tied to a diagnosed gap and handed to a sibling implementation packet.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation / Resolution |
|------|------|--------|------|
| Dependency | Absence of any committed benchmark baseline | No ground-truth number to anchor the diagnosis | Establishing the first baseline is itself a research question (REQ-003); the loop proposes the procedure before diagnosing |
| Dependency | Wave 1 typed-pair machinery and the sk-doc/015 recipe | The measurement path this packet targets | Shipped on origin/v4; the manifest-gated derivation is the reuse target if enumeration succeeds |
| Risk | The prefix/stem `RESOURCE_DOMAINS` globs are not cleanly enumerable | A leaf-manifest may not be generatable at all | Treat enumerability as an open verdict (REQ-002); if it fails, the fix plan proposes an alternative measurement surface rather than forcing a manifest |
| Risk | Single-mode framing makes the typed pair degenerate (one mode) | The typed-pair number may add little over flat recall | Document the marginal value honestly; the meaningful metric may remain a live-mode sample |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Whether the prefix/stem `RESOURCE_DOMAINS` targets should be enumerated to concrete files or kept as globs with a different scoring contract is a primary research question, not assumed.
- Whether a single-mode skill benefits from the typed-pair surface at all, or whether a live-mode routing sample is the only meaningful metric here, is resolved during research.

### Research Status
Complete. The bound `/deep:research` loop ran eight validated iterations and produced the canonical synthesis at `research/research.md`, the evidence inventory at `research/resource-map.md`, and the dependency-ordered handoff for a sibling implementation packet.

### Research Context
Deep research is active for this topic. `research/research.md` remains the canonical findings source.

<!-- BEGIN GENERATED: deep-research/spec-findings -->
The eight-iteration loop completed at the configured maximum with all five research questions answered and zero route-proof or reducer corruption failures. The current router is physically enumerable but untyped: 55 Markdown files reduce to a proposed 53-leaf non-index manifest, while the live router emits broad path unions without a canonical mode or typed leaf pairs.

The recommended target is a standalone `system-code-graph` mode, a versioned four-root leaf contract, deterministic standalone manifest generation, one explicit intent-to-path `RESOURCE_MAP`, and separate compatibility, selected-leaf, support, and navigation channels. Twenty-three of 28 scenarios are eligible for positive typed gold; five remain behavior/integration coverage. No numeric baseline is claimed. The dependency-ordered implementation and promotion gates are canonical in `research/research.md`.
<!-- END GENERATED: deep-research/spec-findings -->
<!-- /ANCHOR:questions -->
