---
title: "Feature Specification: sk-prompt Routing Research"
description: "Deep-research charter to diagnose sk-prompt routing and apply the sk-doc typed-pair routing optimizations. sk-prompt is a parent hub (prompt-improve/prompt-models) where only prompt-improve has a RESOURCE_MAP (flat root-relative paths, 6/6 resolve) and prompt-models has no map; the baseline shows 100 but only the D5 dimension is scored (the routing dimensions are null/unmeasured), and none of its 32 scenarios carry typed gold."
trigger_phrases:
  - "sk-prompt routing research"
  - "prompt-improve resource map routing"
  - "prompt-models missing router map"
  - "sk-prompt benchmark typed gold"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/019-sk-prompt-routing-research"
    last_updated_at: "2026-07-16T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Scaffolded the sk-prompt routing-research charter for a bound /deep:research run"
    next_safe_action: "Launch the /deep:research loop bound to this packet; it populates research/"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "019-sk-prompt-routing-research-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: sk-prompt Routing Research

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
| **Branch** | `019-sk-prompt-routing-research` |
| **Track** | sk-doc |
| **Parent** | `sk-doc/019-skill-routing-refactor` |
| **Type** | Research packet (deep-research loop complete) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
sk-prompt's routing is only half-instrumented, and its baseline of 100 is misleading. It is a parent hub with two modes: `prompt-improve` and `prompt-models`. Only `prompt-improve` has a `RESOURCE_MAP` (flat root-relative paths, 6 of 6 resolving), while `prompt-models` has no map at all. The committed baseline reports an aggregate of 100, but that number reflects only the D5 resolution dimension being scored — the routing dimensions (intent, typed-pair, mode-routing) are null and unmeasured. None of the 32 playbook scenarios carry typed gold. A "100" that scores only whether declared paths resolve, while leaving one whole mode without a map and every routing dimension unmeasured, is a green light over an unmeasured surface.

### Purpose
Diagnose sk-prompt's routing on the typed-pair surface and apply the sk-doc typed-pair routing optimizations: author a `RESOURCE_MAP` for `prompt-models`, generate a leaf-manifest, stand up manifest-gated typed gold on the genuine routing scenarios, and surface the real routing-quality number behind the misleading 100. This packet is the diagnosis; it hands a prioritized, implementable fix plan to a sibling implementation packet.

### Outcome
The five-iteration `/deep:research` loop populated `research/` with the two-mode routing classification, a resolve-checked seven-leaf `prompt-models` candidate map, benchmark provenance and denominator analysis, a complete 32-scenario classification, a two-row typed-gold seed, and a dependency-ordered implementation plan. The canonical synthesis is `research/research.md`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Q1: whether both modes can be typed onto the `(workflowMode, leafResourceId)` surface, given `prompt-models` has no `RESOURCE_MAP`
- Q2: what a `prompt-models` `RESOURCE_MAP` should contain and whether its leaves resolve
- Q3: why the baseline reads 100 while the routing dimensions are null, and what the real routing-quality number is once they are scored
- Q4: which of the 32 playbook scenarios are genuine routing decisions eligible for typed gold, and which are behavior/command scenarios
- Q5: a prioritized, implementable fix plan tied to each diagnosed gap

### Out of Scope
- Routing research for skills other than sk-prompt (siblings 016, 017, 018 cover sk-design, system-code-graph, system-deep-loop)
- Applying the fixes; the deliverable here is a diagnosis and fix plan handed to a sibling implementation packet
- Re-authoring the `prompt-improve` `RESOURCE_MAP` beyond the path-form work needed for typed-pair attribution (its 6/6 paths already resolve)

### Files to Change
Research packet, no source changes. Deliverables live under `research/`: `research.md`, `deep-research-dashboard.md`, `findings-registry.json`, `iterations/`, `deltas/` — all created by the bound deep-research loop.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria | Status |
|----|-------------|---------------------|--------|
| REQ-001 | Classify both modes against the typed-pair surface | `prompt-improve` and `prompt-models` leaf sets mapped to `(workflowMode, leafResourceId)` pairs with file:line evidence | Answered (iterations 1 and 3) |
| REQ-002 | Specify the missing `prompt-models` RESOURCE_MAP | The map's required entries identified, with each leaf verified to resolve on disk | Answered (iteration 3; 7/7 resolve) |
| REQ-003 | Explain the misleading 100 baseline and surface the real routing number | The reason routing dimensions are null documented, with the routing-quality figure the harness reports once they are scored | Answered (iteration 4; current typed score is unmeasurable until replay) |
| REQ-004 | Partition the 32 playbook scenarios into routing vs non-routing | Every genuine routing scenario identified; behavior/command scenarios listed and excluded | Answered (iteration 5) |
| REQ-005 | Deliver a prioritized, implementable fix plan | Each fix tied to a diagnosed gap, implementable without further research | Answered (iterations 2 and 5) |
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
| Dependency | sk-prompt committed baseline (aggregate 100, routing dims null) | Findings need grounding in a scored run | Re-run the router-mode benchmark during research to confirm which dimensions actually score before diagnosing |
| Dependency | Wave 1 typed-pair machinery and the sk-doc/015 recipe | The measurement path this packet exercises | Shipped on origin/v4; reuse the manifest-gated derivation proven on sk-code |
| Risk | The 100 baseline masks an unmeasured `prompt-models` mode | Stakeholders may treat sk-prompt as healthy when one mode has no router map | Make the map-gap and the null routing dimensions explicit in the diagnosis; the real number replaces the misleading 100 |
| Risk | Typed gold authored by transcribing router output (gold ≡ output, measures nothing) | Would produce a meaningless number | Derive gold from each scenario's stated intent, independent of router output |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Whether `prompt-models` (read-only per-model profiles) is a genuine routing surface that warrants a `RESOURCE_MAP`, or whether its scenarios are lookups rather than routing decisions, is a primary research question.
- Whether the misleading 100 is a harness-scoring artifact (only D5 wired) or a genuine coverage claim is resolved during research.

### Research Status
Complete. Five native LEAF iterations ran to the configured maximum with zero reducer corruption. `research/research.md` is the canonical synthesis and carries the dependency-ordered fix plan handed to a sibling implementation packet.

### Research Context
Deep research is active for this topic. `research/research.md` remains the canonical findings source.

<!-- BEGIN GENERATED: deep-research/spec-findings -->
- Preserve both registered workflow modes and add a separate second-layer leaf router; do not convert `prompt-models` into a registry surface packet.
- `prompt-improve` exposes six unique leaves. The proposed `prompt-models` route-load map exposes seven resolving Markdown leaves: five model profiles plus `_index.md` and `pattern_index.md` lifecycle leaves.
- Hub aggregate 100 is based on four packet-selection scenarios with typed routing inactive. The child D5=16/null report is a different zero-scenario target. A real typed score requires authored gold and replay.
- The 32 scenarios classify as 7 positive leaf-routing candidates, 4 command/mode cases, 12 behavior/scoring/contract cases, and 9 guard/failure/recovery cases.
- Start typed gold with two atomic hub rows: generic prompt improvement -> `(prompt-improve, references/depth_framework.md)` and named DeepSeek -> `(prompt-models, references/models/deepseek-v4-pro.md)`.
- Implementation order: freeze baseline and fallback behavior, add the second-layer router and packet maps, generate/check the manifest, author the two-row seed, validate topology, capture the first typed baseline, then expand and tune.
<!-- END GENERATED: deep-research/spec-findings -->
<!-- /ANCHOR:questions -->
