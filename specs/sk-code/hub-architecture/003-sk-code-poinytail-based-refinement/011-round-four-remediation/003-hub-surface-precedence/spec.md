---
title: "Feature Specification: Phase 3: hub-surface-precedence"
description: "The sk-code hub router orders a multi-surface bundle by its tie-break list, which puts Webflow before OpenCode and Obsidian, so the prompt `obsidian plugin webflow implementation` lists Webflow first against the documented precedence OPENCODE > OBSIDIAN > WEBFLOW."
trigger_phrases:
  - "hub surface precedence"
  - "phase 3 hub surface precedence"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 3: hub-surface-precedence

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-10-10 |
| **Branch** | `scaffold/003-hub-surface-precedence` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 7 |
| **Predecessor** | 002-webflow-labels-and-playbook |
| **Successor** | 004-quality-obsidian-coverage |
| **Handoff Criteria** | `obsidian plugin webflow implementation` routes Obsidian first, the new canary case passes in both fixture copies and every hub canary keeps its baseline |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the Round four children specification.

**Scope Boundary**: The surface order inside an sk-code bundle, the sk-code canary fixture and its archive copy, and the hub version bump that the hub data change needs.

**Dependencies**:
- The record in `../../010-round-three-remediation/005-opencode-and-guards/plan.md` section 3, "Not a defect here, recorded", and the "Not built" row of `../../010-round-three-remediation/goal.md`
- The documented precedence in `.skilled/skills/sk-code/shared/references/stack-detection.md` section 2 and its reason under "Why OBSIDIAN sits above WEBFLOW"

**Deliverables**:
- A reordered `routerPolicy.tieBreak` in the hub `hub-router.json`
- One implementation-phrased canary case in the live fixture and its archive copy
- One sentence in the hub `SKILL.md` that says why the order reads that way
- Hub release 2.2.6.0 across the six hub-root carriers, plus `changelog/v2.2.6.0.md`

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The canary router keeps every mode within the ambiguity delta and sorts the kept set by `routerPolicy.tieBreak` (`.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/lib/canary-router.cjs:264`). The hub list is quality, review, webflow, opencode, obsidian (`.skilled/skills/sk-code/hub-router.json:7`), so `obsidian plugin webflow implementation`, where Obsidian and Webflow score 8 each, routes to `orderedBundle` `sk-code-webflow,sk-code-obsidian`. The live front door returns the same order. The hub documents OPENCODE > OBSIDIAN > WEBFLOW (`shared/references/stack-detection.md:39`), and a review-phrased prompt already routes Obsidian first only because review takes the first slot.

### Purpose
Any sk-code bundle that holds two or more surfaces lists them in the documented detection precedence, and a canary case keeps it that way.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Reorder the surfaces in `routerPolicy.tieBreak` to opencode, obsidian, webflow, with the two workflow modes still first
- Add the canary case `surface-collision-obsidian-over-webflow-implementation` after the review-phrased collision case, in the live fixture and in its archive copy
- State the ordering rule in one sentence of the hub `SKILL.md`
- Bump the hub from 2.2.5.0 to 2.2.6.0 in `SKILL.md`, `ROUTER.md`, `README.md`, `description.json`, `hub-router.json` and `mode-registry.json`, and add `changelog/v2.2.6.0.md`

### Out of Scope
- Shared router code under `.skilled/bin/lib/` - hub data fixes it, and shared code serves every hub
- Keyword weights and the ambiguity delta - the order is the defect, not the scores
- The `extensions.surface-axis.surfaces` list in `mode-registry.json` - no router reads it for order
- The archived `compiled/route-gold.typed.json` - earlier rounds added canary cases without rebuilding it, and router-sync check 3 only reads its destinations
- The pre-existing `jev-transport-single` canary failure in the cli-external-orchestration hub - not an sk-code file

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-code/hub-router.json` | Modify | `tieBreak` order and version |
| `.skilled/skills/sk-code/mode-registry.json` | Modify | Version |
| `.skilled/skills/sk-code/description.json` | Modify | Version |
| `.skilled/skills/sk-code/SKILL.md` | Modify | Version and the ordering sentence |
| `.skilled/skills/sk-code/ROUTER.md` | Modify | Version |
| `.skilled/skills/sk-code/README.md` | Modify | Version |
| `.skilled/skills/sk-code/changelog/v2.2.6.0.md` | Create | Hub release entry |
| `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json` | Modify | Implementation-phrased collision case |
| `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json` | Modify | Byte copy of the live fixture |
| `.skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-code/manifest.json` | Modify | Orchestrator re-mint only |
| `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/sk-code/manifest.json` | Modify | Orchestrator copy of the re-mint only |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Implementation phrasing follows the precedence | The planning probe prints `orderedBundle sk-code-obsidian,sk-code-webflow` for `obsidian plugin webflow implementation`, and opencode before obsidian and webflow for the other surface pairs |
| REQ-002 | A canary case pins it in both fixture copies | The canary assertion prints `OK surface-collision-obsidian-over-webflow-implementation route orderedBundle sk-code-obsidian,sk-code-webflow` and `cases 13 failures 0`, the same case failed against the old order, and `cmp` of the two fixture copies exits 0 |
| REQ-003 | Every hub canary keeps its baseline | The all-hub canary run prints `001-sk-code cases 13 failures 0` and no FAIL line other than the baseline's `004-cli-external-orchestration jev-transport-single` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Hub guards stay green | Router-sync prints `5/5`, doc-claims `4/4`, parent-skill-check `OK` with 5e and 5i PASS, and the leaf manifest `--check` is unchanged |
| REQ-005 | Advisor routing is not worse | The SA-001 battery replay prints the same `positives 13/17 negatives-false-positive 2/5` line before and after |
| REQ-006 | One hub release | Six carriers read 2.2.6.0, the changelog validates with 0 issues and 0 voice hard blockers, and `SKILL.md` keeps 0 issues and its 36 baseline hard blockers |
| REQ-007 | Compiled routing serves the new order | After the orchestrator re-mint, `compiled-route-guard.cjs` prints `sk-code fresh` and the front door returns `sk-code-obsidian` before `sk-code-webflow` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: No sk-code bundle lists a lower-precedence surface before a higher one: each of the four surface-combination probes in `tasks.md` follows OPENCODE > OBSIDIAN > WEBFLOW
- **SC-002**: Routing outside surface order is unchanged: the twelve existing sk-code canary cases, every other hub's canary and the advisor battery match their baselines
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Orchestrator re-mint of the compiled sk-code manifest | Until it runs, the guard reads `stale-manifest` and the front door serves the legacy sentinel | Orchestrator task T024 and T025, verified by T035 |
| Dependency | Incoming hub-file handoffs from children 001, 002, 004 or 005 | They change `SKILL.md` or other hub files after this plan | They join this build as extra units under the same 2.2.6.0 release, and the changelog gains a bullet for each reader-visible one |
| Risk | Reordering changes every two-surface bundle, not only Obsidian plus Webflow | Low | Intended: every pair now follows the documented precedence. The planner dry run showed all 12 existing cases unchanged |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The documented precedence decides the order, so no operator choice is open.
<!-- /ANCHOR:questions -->

---
