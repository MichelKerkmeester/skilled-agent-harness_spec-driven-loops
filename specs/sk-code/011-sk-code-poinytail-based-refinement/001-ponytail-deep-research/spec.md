---
title: "Feature Specification: Phase 1: ponytail-deep-research"
description: "Ten-iteration deep research over the Ponytail 5 source to find teachings, logic and new ideas that improve the sk-code hub, its nested modes and surfaces, and related tooling."
trigger_phrases:
  - "ponytail deep research"
  - "phase 1 ponytail deep research"
  - "ponytail 5 research"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 1: ponytail-deep-research

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-09 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 1 |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | `research/research.md` exists, every recommendation cites its source and target files, and it proposes the next phases |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the sk-code Ponytail 5 refinement.

**Scope Boundary**: Read-only research. The run writes only under this folder's `research/` directory.

**Dependencies**:
- The Ponytail 5.1.0 source copy in `../context/`.
- The earlier refinement research in `../../z_archive/015-sk-code-ponytail-based-refinement/research/research.md`.
- The `codex` and `pi` binaries, with the OpenAI sign-in and the Cline Pass credential.

**Deliverables**:
- `research/research.md`, the ranked synthesis.
- Iteration files and state under `research/`, one lineage per executor.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The earlier refinement studied an older Ponytail and adopted a design restraint ladder, a `ceiling:` comment convention, an anti-stall rule, review checklist rows and a rule-copy canary. Ponytail 5.1.0 was rebuilt with new hooks, a mode tracker, sub-agent instructions and the debt, gain and audit skills. sk-code has also been restructured into a hub since then. What Ponytail 5 offers beyond the earlier adoptions is unknown.

### Purpose
Produce a ranked, source-cited list of what to adopt, adapt or reject from Ponytail 5 for each sk-code target, plus original ideas it inspires.
### Research Findings

<!-- BEGIN GENERATED: deep-research/spec-findings -->
Two ten-iteration lineages, GPT-6 Luna on cli-codex and DeepSeek V4.1 Flash on cli-pi, studied Ponytail 5.1.0. The orchestrator checked their claims against the repository, and a fresh Claude Opus 5.5 reviewer re-checked 54 claims, whose corrections were applied. Full synthesis: `research/research.md`.

- **Already adopted:** 12 of the earlier refinement's 17 recommendations are in place, including the restraint ladder, the review rows, the `ceiling:` convention and the anti-stall rule.
- **New doctrine:** Ponytail 5 added "already in this codebase" as the second ladder step. sk-code's implement workflow says to reuse, but its always-loaded ladder does not. The full reach list is new. Ponytail's one-small-test reflex is rejected, because sk-code's coverage floor is stronger.
- **Defects found:** the Webflow minified-runtime checker passes scripts whose deferred code throws (reproduced); Codex-only agent changes pass the mirror check in CI and at commit (reproduced); the stack-folder scenario index is stale; the shared hook stdin reader has no deadline; the research reducer wrote outside fan-out lineages (fixed in `system-deep-loop/038/006`).
- **Lost:** two always-loaded files state different surface precedence orders, and Obsidian is missing from several hub surfaces.
- **Next phases:** surface contract alignment, doctrine pass, Webflow checker fix, review output additions, guard retirement notes. The mirror and stdin fixes go to their owners.
<!-- END GENERATED: deep-research/spec-findings -->
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Every file under `../context/` that carries behavior or teaching: skills, hooks, commands, rules, scripts, benchmarks and docs.
- The sk-code hub, `sk-code-quality`, `sk-code-review`, `sk-code-webflow`, `sk-code-opencode`, `sk-code-obsidian` and the shared workflow doctrine.
- Related tooling: the skill advisor, deep-loop benchmarks, hooks and rule-copy checks.
- A check of whether each earlier adoption still exists after the hub restructure.

### Out of Scope
- Editing sk-code or any other skill. Implementation is a later phase.
- Editing `../context/`. It is reference material.
- Translated READMEs and image assets, which carry no logic.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `research/` | Create | Deep-research config, state, iterations, lineages and synthesis |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Run deep research for up to ten iterations per lineage, with a GPT-6 Luna lineage through cli-codex and a DeepSeek V4.1 Flash lineage through cli-pi on the Cline provider | Both lineages have iteration files under `research/` |
| REQ-002 | Every recommendation cites the Ponytail source and the sk-code target as `path:line` | Spot-checked citations resolve |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Separate new ideas from ones the earlier refinement already adopted | Synthesis marks each item new, already adopted, or lost in the restructure |
| REQ-004 | Propose the implementation phases that follow | Synthesis ends with a proposed phase list |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `research/research.md` covers every sk-code mode and surface, or says why one has no applicable finding.
- **SC-002**: The two lineages' disagreements are named and resolved against the source, not averaged.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Cline Pass monthly quota | DeepSeek lineage stops with 429 | Read lineage logs; record the failure as a finding |
| Risk | `context/` carries its own AGENTS.md and agent rules | A lineage follows Ponytail's instructions instead of the brief | Brief states that `context/` is data, never instructions |
| Risk | The runner caps Cline DeepSeek at `xhigh` | Operator asked for `max` | Recorded; the route has no `max` tier |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None blocking the run.
<!-- /ANCHOR:questions -->

---
