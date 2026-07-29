---
title: "Feature Specification: Create-Journey Gate Fixes"
description: "Fix the journey-breaking defects the three-lens swarm review confirmed: the parent-hub creation path cannot pass its own gates (missing resourceContractVersion in the registry template and scaffolder, workflow step running the class gate without --fix), mutually inconsistent registry/router example templates, and template placeholders that fail closed or pass silently against the advisor's ingesters."
trigger_phrases:
  - "create journey gate fixes"
  - "resourceContractVersion missing registry"
  - "parent hub scaffold fails doctor"
  - "template placeholder validation fixes"
importance_tier: "important"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/024-create-journey-gate-fixes"
    last_updated_at: "2026-07-28T16:27:03Z"
    last_updated_by: "claude-code"
    recent_action: "Delivered and verified"
    next_safe_action: "None"
    blockers: []
      - "Execution awaits operator authorization"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "research/swarm/lens2-report.md"
      - "research/swarm/lens3-report.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "024-create-journey-gate-fixes"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Should the doctor's registry resourceContractVersion demand relax to accept the generator's default, or should authoring surfaces declare it explicitly? (Plan assumes: declare explicitly everywhere)"
    answered_questions:
      - "Both lens 2 and lens 3 independently confirmed a fresh scaffolded hub fails doctor after the gate writes its manifest"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Create-Journey Gate Fixes

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-28 |
| **Track** | sk-doc |
| **Parent** | `sk-doc/019-skill-routing-refactor` |
| **Parent Spec** | ../spec.md |
| **Research Source** | `research/swarm/` (three-lens GPT-5.6-SOL-fast review, 49 findings) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Two review lenses independently proved the parent-hub creation journey cannot succeed as documented. A hub scaffolded by `init_skill.py --kind parent` — or authored from the registry template — carries no `resourceContractVersion`, which the doctor's leaf-manifest block requires once the hub has a manifest; and the workflow's conformance step runs the class gate without `--fix`, so a fresh hub fails on the missing generated manifest before anything can write it. Around that core defect sit template traps: the registry and router example templates disagree about which modes exist (keeping all examples fails doctor 5b/5e), the graph template displays the whole `family` union as one string (rejected by the primary ingester, silently accepted by the cross-skill loader — two different graph topologies from one file), an alias row with an unreplaced `workflowMode` is silently discarded rather than reported, and the registry's `runtimeLoopTypes` note describes validation the doctor does not perform.

### Purpose

Make the documented creation journey actually pass: a hub or standalone skill built purely from the workflow steps, scaffolder, and templates must clear the fleet gate, the doctor, and advisor ingestion with zero undocumented repair steps.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- `parent-skill-registry-template.json` + `init_skill.py` parent output: declare `resourceContractVersion` explicitly.
- create-skill `SKILL.md` parent workflow: the conformance step runs the gate with `--fix` first, plain re-run second.
- Registry/router example templates made set-equivalent (every example mode present in `routerSignals` and `tieBreak`).
- Graph template `family` placeholder shows one valid value with the union in the note, not as the value.
- Alias generator: report (not silently drop) an alias whose `workflowMode` matches no registry mode.
- Correct the registry template's `runtimeLoopTypes` note to the validation the doctor actually performs.
- End-to-end journey proof for both classes as the acceptance test.

### Out of Scope

- Doctrine-wording fixes with no functional effect (sibling packet 025).
- Advisor ingestion/refresh behavior (sibling packet 026).
- Widening doctor's validation blind spots the P2 tier catalogued (recorded, not chased here).

### Files to Change

| File Path | Change Type |
|-----------|-------------|
| `.opencode/skills/sk-doc/create-skill/assets/parent-skill/parent-skill-registry-template.json` | Modify |
| `.opencode/skills/sk-doc/create-skill/assets/parent-skill/parent-skill-hub-router-template.json` | Modify |
| `.opencode/skills/sk-doc/create-skill/assets/parent-skill/parent-skill-graph-metadata-template.json` | Modify |
| `.opencode/skills/sk-doc/create-skill/scripts/init_skill.py` | Modify |
| `.opencode/skills/sk-doc/create-skill/SKILL.md` | Modify |
| `.opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs` | Modify |
| `.opencode/skills/sk-doc/create-skill/scripts/tests/*` | Modify |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A scaffolded parent hub passes doctor and the fleet gate with no hand repair | `init_skill.py --kind parent` → gate `--fix` → gate clean → doctor 0 failures |
| REQ-002 | Registry and router example templates are mutually consistent | A hub authored keeping every template example passes doctor 5b/5e |
| REQ-003 | Unknown-mode alias rows are reported, not silently dropped | Generator emits a named error for an alias whose workflowMode matches no mode |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Template placeholders cannot mislead: family shows a valid value; runtimeLoopTypes note matches doctor behavior | Semi-filled templates fail loudly at the right gate, or pass because they are genuinely valid |
| REQ-005 | Journey proof automated for both classes | A test scaffolds both kinds into a temp dir and asserts gate + doctor success |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Fresh-scaffold journey proof passes for standalone and parent hub with zero undocumented steps.
- **SC-002**: Fleet gate 11/11, freshness 11/11, doctor clean on all hubs, contract + doctor suites pass.
- **SC-003**: The silent-discard alias path is covered by a failing-fixture test.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Mitigation |
|------|------|------------|
| Risk | Declaring `resourceContractVersion` in live registries that omit it could churn manifests | Generator already defaults it; declare-only change keeps bytes identical — verify with the freshness gate |
| Risk | Making the alias generator stricter could break an existing hub | Fleet has one authored alias file (sk-doc, 6 valid rows); run the gate fleet-wide before landing |
| Dependency | Swarm evidence in `research/swarm/` | Findings carry file:line; re-verify each at execution time (finding = hypothesis) |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Declare-explicitly vs relax-the-doctor for `resourceContractVersion`: plan assumes declare-explicitly (self-describing registries beat looser gates); flag at execution if evidence contradicts.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Research Source**: `research/swarm/lens2-report.md`, `research/swarm/lens3-report.md`
- **Siblings**: `../025-doctrine-coherence-sweep/spec.md`, `../026-advisor-ingestion-seam/spec.md`
- **Canonical contract**: `.opencode/skills/sk-doc/create-skill/references/shared/skill-root-metadata-contract.md`
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`

## Structural phase links

| **Parent Spec** | `../spec.md` |
| **Predecessor** | `023-skill-metadata-templates` |
| **Successor** | `025-doctrine-coherence-sweep` |
