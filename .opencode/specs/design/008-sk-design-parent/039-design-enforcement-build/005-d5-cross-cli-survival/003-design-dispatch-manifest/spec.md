---
title: "Feature Specification: D5-R3 — DESIGN_DISPATCH_MANIFEST v1 schema + present-or-ASK pass-through"
description: "A dispatched child cannot know which register, mode bundle, or files the parent resolved, so design context is reconstructed by guesswork; define a structured manifest the parent carries and ASK rather than launch when it cannot be assembled."
trigger_phrases:
  - "d5-r3 design dispatch manifest"
  - "dispatch manifest design build"
importance_tier: "normal"
contextType: "general"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/005-d5-cross-cli-survival/003-design-dispatch-manifest"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Upgrade spec to Level 2 contract; mark phase complete"
    next_safe_action: "Regenerate description.json and graph-metadata.json"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/shared/context_loading_contract.md"
      - ".opencode/skills/cli-codex/SKILL.md"
      - ".opencode/skills/cli-claude-code/SKILL.md"
      - ".opencode/skills/cli-opencode/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "d5-r3-impl"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: D5-R3 — DESIGN_DISPATCH_MANIFEST v1 schema + present-or-ASK pass-through

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-28 |
| **Completed** | 2026-06-29 |
| **Branch** | `003-design-dispatch-manifest` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A dispatched child CLI cannot know which register, mode bundle, or design-context files the parent resolved before handing off design or UI work. The Gate-3 spec-folder pass-through already proves a parent-resolved handoff can survive dispatch, but design has no equivalent structured carry, so the child reconstructs context by guesswork. Worse, codex and claude-code children cannot resolve skill paths, so any context passed by reference arrives empty.

### Purpose
Define `DESIGN_DISPATCH_MANIFEST v1` in `sk-design/shared/context_loading_contract.md` — the structured block a parent emits when dispatching design work, naming exactly what context, standards, and proof the child must carry — and append a present-or-ASK pass-through to the three cli-* SKILLs modeled on the Gate-3 spec-folder rule. The manifest carries the load-time `Design Standards Loading` resolution forward as data and its digest is the return-path `designManifestDigest`, completing the request half of the cross-CLI survival spine.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Author the `DESIGN_DISPATCH_MANIFEST v1` field schema (`version`, `surface`, `taskType`, `skDesignLoaded`, `workflowModes`, `register`, `dials`, `loadedFiles`, `proofDemandBack`) plus validity rules in `context_loading_contract.md`.
- Append one present-or-ASK manifest pass-through ALWAYS rule to each of the three cli-* SKILLs, inserted after the existing `Design Standards Loading` rule, append-only.
- Bind the manifest to the inline payload and reconcile its digest against the return-path `designManifestDigest`; cite the proof-token, return-path, and mode-registry contracts without redefining them.

### Out of Scope
- The static token lint and route-replay fixtures that assert the manifest in dispatch payloads — that is the sibling fixture phase.
- Any change to the proof-token, return-path, or mode-registry contracts beyond citation.
- The separate GLM-5.2 workstream changes to `cli-opencode/SKILL.md` Model Selection and `cli-opencode/references/cli_reference.md`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-design/shared/context_loading_contract.md` | Modify | Append `## 7. DESIGN DISPATCH MANIFEST`: the v1 field table, validity rules, inline-payload note, `designManifestDigest` reconcile note, named residual |
| `.opencode/skills/cli-codex/SKILL.md` | Modify | Append the present-or-ASK manifest rule after `Design Standards Loading`; renumber trailing items by one digit |
| `.opencode/skills/cli-claude-code/SKILL.md` | Modify | The same present-or-ASK manifest rule; renumber trailing items by one digit |
| `.opencode/skills/cli-opencode/SKILL.md` | Modify | The same present-or-ASK manifest rule, stacked on top of concurrent GLM WIP; renumber trailing items by one digit |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `DESIGN_DISPATCH_MANIFEST v1` schema defined | the field table names `surface`, `taskType`, `skDesignLoaded`, `workflowModes`, `register`, `dials`, `loadedFiles`, `proofDemandBack` |
| REQ-002 | Validity rules enforceable at dispatch | `skDesignLoaded` true, `register` resolved (never `unknown`), `workflowModes` non-empty + registry-valid, `loadedFiles` non-empty; a failing manifest is non-dispatchable |
| REQ-003 | All three cli-* carry the present-or-ASK rule | a missing manifest maps to an explicit ASK branch, not a silent launch, in each cli-* |
| REQ-004 | Manifest travels INLINE and reconciles on the return path | the rule + section state inline-payload carry; the manifest digest is the return-path `designManifestDigest` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Proof-token, return-path, and mode-registry contracts cited, not redefined | the `loadedFiles` convention, `designManifestDigest`, and `mode-registry.json` are referenced, not restated |
| REQ-006 | The unmodifiable-child residual named | a residual paragraph states the parent-side floor and claims no deterministic guarantee over a child that ignores the manifest |
| REQ-007 | Append-only / no-clobber held | each cli-* diff is the inserted rule + the declared renumber; the GLM WIP in cli-opencode is untouched |
| REQ-008 | Deliverable is evergreen | no spec path / packet / phase / ADR / REQ / task / finding ID in the schema section or the inserted rule |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A static read finds the `DESIGN_DISPATCH_MANIFEST` block with all required fields, and a dispatch missing the manifest triggers an ASK rather than a silent launch in every cli-*.
- **SC-002**: The manifest carries the `Design Standards Loading` resolution forward and its digest is the value the return-path transport-result contract reconciles, with `register=unknown` rejected at dispatch.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | An unmodifiable child CLI may ignore the inlined manifest | The parent cannot force it to load the named files or honor the register | Name the parent-side floor (present-or-ASK gate + return-path demand-back) as the only deterministic guarantee; do not overstate |
| Risk | Path-resolvability ceiling: codex/claude-code children cannot resolve skill paths | A manifest passed by reference would arrive empty | Require the manifest to travel INLINE in the dispatch payload; even inlined, a child that drops it is covered only by the demand-back floor |
| Risk | Concurrent GLM workstream editing `cli-opencode` | A bulk stage could clobber GLM WIP | Locate the anchor by content, insert append-only, stage by explicit path; GLM markers verified intact (13 → 27 lines, pure addition) |
| Dependency | `context_loading_contract.md` §3/§4 vocabulary | Reused | Green — exists; the manifest is the structured form of the CONTEXT MANIFEST vocabulary |
| Dependency | `Design Standards Loading` ALWAYS rule (3 cli-*) | Insertion anchor + reconcile | Green — landed; the manifest carries its resolution forward |
| Dependency | Return-path contract (`designManifestDigest`) | Cited | Green — exists; the manifest digest is the value it reconciles |
| Dependency | `mode-registry.json` (workflowModes validity) | Cited | Green — exists; the source of registry-valid modes |
| Dependency | Sibling static token lint + route-replay fixtures | Consumer | Out of scope here; that phase asserts the manifest in dispatch payloads |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Maintainability
- **NFR-M01**: The schema reuses the §3 CONTEXT MANIFEST vocabulary and cites the proof-token / return-path / mode-registry contracts, so each rule has a single source of truth and the copies cannot drift.
- **NFR-M02**: The deliverable is evergreen — no ephemeral artifact IDs — so it survives doc reorganization.

### Safety
- **NFR-S01**: A manifest that fails any validity rule is non-dispatchable; the parent ASKs rather than launching a silent design dispatch.
- **NFR-S02**: The cli-* insertions are append-only; the concurrent GLM WIP must not be staged or clobbered.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Unresolved register
- `register` resolves to `unknown`: the manifest is non-dispatchable; the parent ASKs for Brand or Product before launching.

### Path-resolvability ceiling
- A codex or claude-code child cannot resolve skill paths: the manifest MUST be inlined in the payload, never referenced by path, or the child receives nothing.

### Unmodifiable child
- A third-party child ignores the inlined manifest entirely: the parent cannot force compliance; the return-path demand-back is the only enforcement, with no deterministic guarantee on the child side.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 9/25 | One additive schema section + three append-only cli-* rule insertions, no running code |
| Risk | 12/25 | No code/DB; risk is the concurrent GLM WIP and the honest residual / citation discipline |
| Research | 6/20 | Reuses the §3 vocabulary and the Gate-3 present-or-ASK shape |
| **Total** | **27/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None outstanding. The unmodifiable-child residual and the path-resolvability ceiling (manifest must travel inline) are documented design boundaries, not open defects. The static token lint + route-replay fixtures are the sibling consumer phase, not a gap in this contract.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
