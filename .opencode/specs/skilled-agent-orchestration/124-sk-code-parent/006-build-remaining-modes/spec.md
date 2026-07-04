---
title: "Feature Specification: Phase 6 — build remaining modes"
description: "Author the four remaining sk-code mode contracts (implement, quality, debug, verify) by distributing the pre-hub flat doctrine into each packet, mirroring the sk-design mode shape, consuming shared surface detection, and pinning each mode's registry tool surface."
trigger_phrases:
  - "sk-code build remaining modes"
  - "code-implement quality debug verify contracts"
  - "sk-code mode SKILL contracts"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/124-sk-code-parent/006-build-remaining-modes"
    last_updated_at: "2026-07-04T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored and verified the four remaining mode contracts and READMEs"
    next_safe_action: "phase 007 advisor-and-integration"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bootstrap-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 6 — build remaining modes

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Accepted / Complete |
| **Created** | 2026-07-04 |
| **Branch** | Worktree for `124-sk-code-parent` build work |
| **Parent Spec** | ../spec.md |
| **Phase** | 6 of 9 |
| **Predecessor** | ../005-foldin-review/spec.md |
| **Successor** | ../007-advisor-and-integration/spec.md (planned) |
| **Handoff Criteria** | The four remaining mode packets carry full contract SKILL.md files with registry-exact tool surfaces, consume shared surface detection, point at their relocated material, and pass link/hygiene/one-identity checks |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 6** of the sk-code parent-skill conversion. It is the **mode-contract build step** after phase 004 relocated the flat sk-code content and phase 005 folded `sk-code-review` into the `code-review` mode.

Before this phase, the four non-review mode packets (`code-implement`, `code-quality`, `code-debug`, `code-verify`) held only placeholder skeleton `SKILL.md` files plus their relocated reference, asset, and script material. The pre-hub flat `sk-code/SKILL.md` (recovered from history) held the Phase 0/1/1.5/2/3 workflow doctrine. This phase distributed that doctrine into the four mode packets so each packet owns exactly one phase contract.

Each authored contract mirrors the `sk-design` mode shape, **consumes** surface detection from `../shared/` rather than re-authoring it, points its resource-loading table at that packet's own relocated files, and pins its `allowed-tools` to the exact tool surface declared in `mode-registry.json`. The `code-review` mode was completed in phase 005 and was not rebuilt here.

**Scope Boundary**: author the four mode contracts and their READMEs only. Do not touch the hub SKILL.md, `mode-registry.json`, `hub-router.json`, the hub `graph-metadata.json`, `shared/`, the `code-review` packet, or any other phase's spec folder. Do not create packet-local `graph-metadata.json`. Do not rewrite the relocated reference material.

**Dependencies**:
- Predecessor relocation phase: `../004-onboard-implement/spec.md` (moved the content the contracts point at).
- Predecessor fold-in phase: `../005-foldin-review/spec.md` (built the sibling `code-review` contract the others cross-reference).
- Next phase: `007-advisor-and-integration` (merges review keywords into the hub node and rebuilds the advisor graph).

**Deliverables**:
- Full contract `SKILL.md` for `code-implement`, `code-quality`, `code-debug`, `code-verify`.
- Rewritten `README.md` for each of the four modes.
- Phase 006 documentation and metadata.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The hub is routing-only and the surface detection lives in `shared/`, but the four non-review mode packets were still 57-line placeholders. Without real contracts, the hub could route to a mode that carried no workflow doctrine, evidence rules, or tool-permission discipline, so the family was not yet functional.

### Purpose
Turn each placeholder into a complete, self-contained mode contract that owns one lifecycle phase, consumes the shared surface router, loads only its own resources, and enforces its exact tool surface — so the parent hub can route a code request to a mode that actually knows how to do the work.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Distribute the recovered flat doctrine into the four mode contracts by lifecycle phase (implement = Phase 0/1; quality = Phase 1.5; debug = Phase 2; verify = Phase 3).
- Author each `SKILL.md` in the sk-design mode shape (§1 WHEN TO USE, §2 SMART ROUTING, §3 HOW IT WORKS, §4 RULES, §5 SUCCESS CRITERIA, §6 INTEGRATION POINTS, §7 REFERENCES).
- Pin each `allowed-tools` line to the registry tool surface for that mode.
- Point each resource-loading table at that packet's relocated references, assets, and scripts, plus the shared references it consumes.
- Rewrite the four mode READMEs and version-stamp all four packets.
- Document the completed phase 006 build.

### Out of Scope
- The hub SKILL.md, `mode-registry.json`, `hub-router.json`, and hub `graph-metadata.json` (unchanged this phase).
- The `code-review` packet (built in phase 005).
- `shared/` content and the relocated reference material (consumed, not rewritten).
- Per-mode manual-testing playbooks (deferred; the hub playbook and the folded `code-review` playbook remain) and per-mode changelogs (deferred to the 009 cutover version bumps).
- `command-metadata.json` and the advisor graph rebuild (phase 007).

### Files Changed

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-code/code-implement/SKILL.md` | Update | Placeholder → full implement (Phase 0/1) contract |
| `.opencode/skills/sk-code/code-implement/README.md` | Update | Mode orientation doc |
| `.opencode/skills/sk-code/code-quality/SKILL.md` | Update | Placeholder → full quality-gate (Phase 1.5) contract |
| `.opencode/skills/sk-code/code-quality/README.md` | Update | Mode orientation doc |
| `.opencode/skills/sk-code/code-debug/SKILL.md` | Update | Placeholder → full debug (Phase 2) contract |
| `.opencode/skills/sk-code/code-debug/README.md` | Update | Mode orientation doc |
| `.opencode/skills/sk-code/code-verify/SKILL.md` | Update | Placeholder → full verify (Phase 3, non-mutating) contract |
| `.opencode/skills/sk-code/code-verify/README.md` | Update | Mode orientation doc |
| `.opencode/specs/skilled-agent-orchestration/124-sk-code-parent/006-build-remaining-modes/` | Create | Phase 006 documentation and metadata |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Full contract per mode | Each of the four `SKILL.md` files carries the sk-design section set and its owned phase workflow, not a placeholder |
| REQ-002 | Registry-exact tool surface | Each `allowed-tools` line equals the mode's `toolSurface.allowed` in `mode-registry.json` exactly; `code-verify` stays non-mutating (`Read, Bash, Grep, Glob`) |
| REQ-003 | One-identity preserved | No mode packet gains a `graph-metadata.json`; exactly one remains under `sk-code`, at the hub |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Consume shared, do not re-author | Each contract defers surface detection to `../shared/` and does not re-implement detection logic |
| REQ-005 | Links resolve | Every relative link in the four SKILL.md + four README.md files resolves from its own location |
| REQ-006 | Comment hygiene | No spec paths, packet ids, phase ids, or REQ/task/finding ids embedded inside code fences |
| REQ-007 | Coherent handoff chain | Each mode's When-NOT-to-use and integration points route correctly to the four sibling modes |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `code-implement` (265 lines) carries `allowed-tools: [Read, Write, Edit, Bash, Grep, Glob, Task]`, owns Phase 0 research + Phase 1 implementation and the WEBFLOW/OPENCODE/UNKNOWN authoring workflows, and points at its motion_dev/webflow/opencode references.
- **SC-002**: `code-quality` (263 lines) carries `allowed-tools: [Read, Edit, Bash, Grep, Glob]`, owns the Phase 1.5 gate, the P0/P1/P2 model, the comment-hygiene enforcement layers, and the target-path authoring-checklist map.
- **SC-003**: `code-debug` (237 lines) carries `allowed-tools: [Read, Edit, Bash, Grep, Glob, Task]`, owns Phase 2 root-cause debugging, the one-cause-fix rule, the bounded-Task boundary, and the three-strike escalation discipline.
- **SC-004**: `code-verify` (272 lines) carries `allowed-tools: [Read, Bash, Grep, Glob]`, owns Phase 3, the Iron Law, the verification ladder, the mutation/claim-falsifier ritual, the baseline/delta contract, and an explicit non-mutating boundary.
- **SC-005**: All four `allowed-tools` lines match the registry; no packet-local `graph-metadata.json`; all relative links resolve; no comment-hygiene violation in code fences.
- **SC-006**: Phase 006 docs record the distribution map, the verified facts, and the noted deferrals.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:research-questions -->
## 6. RESEARCH QUESTIONS (Track R) & CONTEXT TARGETS (Track C)

### Track R — deep-research
- The mode taxonomy, tool surfaces, and build sequence were already fixed by the 002 architecture decision; this phase did not reopen them.

### Track C — deep-context
- Confirm each mode owns exactly one lifecycle phase and does not duplicate hub routing or shared surface detection.
- Confirm each resource-loading table points only at files that exist in that packet or in `../shared/`.
- Confirm the four contracts cross-reference each other and `code-review` correctly.
<!-- /ANCHOR:research-questions -->

---

<!-- ANCHOR:risks -->
## 7. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Tool surface widened during authoring | A mode gains unintended mutation authority | Pin each `allowed-tools` to the registry and verify equality per mode |
| Risk | Surface detection re-authored in a mode | Two sources of truth drift | Require each contract to consume `../shared/` and forbid re-detection |
| Risk | Resource-loading table points at moved/absent files | Broken guidance links | Deterministic relative-link resolution over all eight authored files |
| Risk | Contract becomes a copy of its references | Bloat and duplication | Cap depth near the mirror and require pointing, not pasting |
| Dependency | Phase 004 relocation | Complete | Contracts point at the relocated references/assets/scripts |
| Dependency | Phase 005 code-review contract | Complete | The four contracts cross-reference the review sibling |
| Dependency | Phase 007 advisor rebuild | Pending | Advisor keyword merge and graph rebuild happen next |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 8. OPEN QUESTIONS

- None for this completed build phase. Per-mode playbooks/changelogs and the advisor rebuild are known later-phase boundaries, not open questions.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
