---
title: "Feature Specification: Phase 3 — scaffold hub"
description: "Convert the flat sk-code skill into an additive nested parent-hub scaffold: one routing-only hub, five mode-packet skeletons, a registry/router contract, and exactly one advisor graph identity."
trigger_phrases:
  - "sk-code scaffold hub"
  - "sk-code parent hub scaffold"
  - "sk-code five mode scaffold"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/017-sk-code-parent/003-scaffold-hub"
    last_updated_at: "2026-07-03T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Documented the completed scaffold-hub phase"
    next_safe_action: "Proceed to 004-onboard-implement to relocate implement, quality, debug, and verify contracts into packets and shared/"
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
# Feature Specification: Phase 3 — scaffold hub

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
| **Created** | 2026-07-03 |
| **Branch** | Worktree for `124-sk-code-parent` scaffold work |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 9 |
| **Predecessor** | ../002-architecture-decision/spec.md |
| **Successor** | ../004-onboard-implement/spec.md (planned) |
| **Handoff Criteria** | Thin hub scaffold exists, 5 mode-packet skeletons exist, one advisor graph identity remains, and relocation/fold-in work is explicitly deferred |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the sk-code parent-skill conversion. It is the **scaffold step** from the accepted architecture decision: create the nested parent-hub shape before moving any existing content.

Phase 003 delivered the verified 14-file scaffold that converted `.opencode/skills/sk-code/` from a flat skill into a routing-only parent scaffold. The change was additive with respect to skill content: no existing references, assets, scripts, benchmark material, manual testing playbook, or description metadata were relocated in this phase.

**5-mode scaffold contract:**
- `implement` -> `code-implement/`, backend `surface-router`, mutating implementation tool surface.
- `quality` -> `code-quality/`, backend `surface-router`, author-side quality gate tool surface.
- `debug` -> `code-debug/`, backend `surface-router`, mutating root-cause debugging tool surface.
- `verify` -> `code-verify/`, backend `surface-router`, non-mutating verification tool surface.
- `review` -> `code-review/`, backend `review-cache`, read-only review workflow plus limited cache write surface.

**Invariants delivered:**
- One public advisor identity: `.opencode/skills/sk-code/graph-metadata.json` only.
- One hub `SKILL.md`, version `4.0.0.0`, with routing-only instructions and no per-mode workflow contract.
- One `mode-registry.json` containing all five modes with `advisorRouting.routingClass: "metadata"` and folder-equals-`packetSkillName`.
- One `hub-router.json` preserving existing sk-code routing vocabulary classes and defaulting ambiguous code work to `implement`.
- Five mode-packet skeletons, each with `SKILL.md` + `README.md`, and no packet-local `graph-metadata.json`.

**Deliberate deviation:** `command-metadata.json` was not created in this phase even though decision-record §5.2 listed it. The reason is concrete: `sk-code` has no `/code:*` slash-command surface and `parent-skill-check.cjs` does not require `command-metadata.json`. The item is deferred to phase 007, where advisor rebuild, review-keyword merge, command metadata, and integration surfaces are handled together.

**Scope Boundary**: scaffold only. Do not relocate the implement/quality/debug/verify content, do not fold `sk-code-review` into `code-review`, and do not rebuild advisor/toolchain metadata in this phase.

**Dependencies**:
- Binding architecture: `../002-architecture-decision/decision-record.md`.
- Built scaffold: `.opencode/skills/sk-code/SKILL.md`, `mode-registry.json`, `hub-router.json`, `graph-metadata.json`, `README.md`, `shared/README.md`, `changelog/v4.0.0.0.md`, and five `code-*` packets.
- Next relocation phase: `004-onboard-implement`.

**Deliverables**:
- A thin `sk-code` hub scaffold with a single graph identity.
- Registry/router files that encode the 5-mode contract.
- Skeleton packets for `code-implement`, `code-quality`, `code-debug`, `code-verify`, and `code-review`.
- Static routing-parity fixture expectations for later baseline capture on `main`.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The accepted architecture needed a safe intermediate state before content relocation. Moving contracts and folding `sk-code-review` directly would mix structural routing changes with content movement and make regressions harder to isolate.

### Purpose
Establish the nested `sk-code` parent-hub scaffold in a regression-first, additive way: one routing hub, five empty mode packets, one graph identity, and no content relocation until phase 004.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rewrite `.opencode/skills/sk-code/SKILL.md` into a thin routing-only hub.
- Create `mode-registry.json` for the five accepted modes and their tool surfaces.
- Create `hub-router.json` with router policy, signals, and vocabulary classes seeded from the existing `sk-code` identity.
- Rewrite `graph-metadata.json` into the single hub identity while preserving existing edges, domains, and intent signals and extending only derived hub fields.
- Create hub docs, changelog, shared placeholder, and five mode-packet skeletons.
- Verify scaffold invariants and revert out-of-scope runtime side effects.

### Out of Scope
- Relocating existing `sk-code` references, assets, scripts, or contracts into `code-implement`, `code-quality`, `code-debug`, `code-verify`, or `shared/` (phase 004).
- Folding `.opencode/skills/sk-code-review/` into `code-review` (phase 005).
- Advisor rebuild, review-keyword merge, command metadata, agent repointing, or integration cutover (phase 007+).

### Files Changed

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-code/SKILL.md` | Rewrite | Thin routing-only hub, version `4.0.0.0` |
| `.opencode/skills/sk-code/mode-registry.json` | Create | Five-mode registry with discriminator, backend kind, advisor routing, and tool surfaces |
| `.opencode/skills/sk-code/hub-router.json` | Create | Hub-local routing policy, signals, and vocabulary classes |
| `.opencode/skills/sk-code/graph-metadata.json` | Rewrite | Single preserved hub identity with derived scaffold extensions |
| `.opencode/skills/sk-code/README.md` | Create | Hub overview and navigation |
| `.opencode/skills/sk-code/changelog/v4.0.0.0.md` | Create | Scaffold release note |
| `.opencode/skills/sk-code/shared/README.md` | Create | Placeholder for shared router/helpers |
| `.opencode/skills/sk-code/code-*/SKILL.md` | Create | Five mode-packet skeleton contracts |
| `.opencode/skills/sk-code/code-*/README.md` | Create | Five skeleton packet READMEs |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Hub is routing-only | `sk-code/SKILL.md` routes by `workflowMode` through `mode-registry.json` and states that mode contracts live in packets |
| REQ-002 | One advisor graph identity remains | Exactly one `graph-metadata.json` exists under `.opencode/skills/sk-code/`, at the hub root |
| REQ-003 | Five-mode registry exists | `mode-registry.json` contains implement, quality, debug, verify, and review with metadata routing and the agreed backend/tool surfaces |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Hub router preserves routing intent | `hub-router.json` includes router policy, five router signals, and vocabulary classes seeded from existing sk-code identity |
| REQ-005 | Skeleton packets are native packets | Each `code-*` folder has `SKILL.md` + `README.md`, matching folder and packet skill name, with no packet graph metadata |
| REQ-006 | Scope remains scaffold-only | Existing content is not relocated; banned paths stay untouched; package runtime side effect is reverted |
| REQ-007 | Command metadata deferral is explicit | The absence of `command-metadata.json` is documented as a deliberate phase-007 deferral |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The scaffold exposes `sk-code` as one hub identity with five mode packets and no packet-local graph metadata.
- **SC-002**: Registry and router files preserve the accepted 5-mode taxonomy and current routing vocabulary without relocating old content.
- **SC-003**: Verification confirms JSON validity, one graph identity, untouched banned paths, untouched `sk-code-review`, no comment-hygiene leaks, and reverted out-of-scope package files.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:research-questions -->
## 6. RESEARCH QUESTIONS (Track R) & CONTEXT TARGETS (Track C)

### Track R — deep-research
- The architecture was already accepted in phase 002: five phase/activity modes over one shared surface router, with `code-review` as the future fold-in target.
- This phase did not reopen taxonomy research.

### Track C — deep-context
- Confirm the scaffold created only the structural hub files and packet skeletons.
- Confirm relocation, fold-in, advisor rebuild, and integration work remain for later phases.
- Preserve fixture expectations so later routing-parity capture can compare current intent to post-cutover behavior.
<!-- /ANCHOR:research-questions -->

---

<!-- ANCHOR:risks -->
## 7. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Hub gains workflow logic too early | Parent becomes another monolith | Keep hub routing-only; contracts move into packets in later phases |
| Risk | Packet-local graph metadata appears | Advisor discovers multiple code identities | Enforce exactly one `graph-metadata.json` under `sk-code/` |
| Risk | Command metadata omission is mistaken for a miss | Phase 003 appears incomplete against decision-record §5.2 | Document the slash-command absence and defer `command-metadata.json` to phase 007 |
| Dependency | Phase 004 relocation | Skeleton packets are not complete runtime contracts yet | Next phase onboards implement/quality/debug/verify content into packets and `shared/` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 8. OPEN QUESTIONS

- None for this completed scaffold phase. `command-metadata.json` is a known deferral, not an open question.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
