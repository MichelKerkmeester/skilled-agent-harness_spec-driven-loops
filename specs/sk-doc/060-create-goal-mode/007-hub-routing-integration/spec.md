---
title: "Feature Specification: Phase 7: hub-routing-integration"
description: "This phase registers sk-create-goal across both sk-doc routing stages and proves goal-authoring reachability without capturing session-goal requests."
trigger_phrases:
  - "sk-create-goal hub routing"
  - "create goal mode aliases"
  - "goal authoring route replay"
  - "goal mode newcomer baseline"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 7: hub-routing-integration

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-09-25 |
| **Branch** | `worktrees/068-create-goal-mode` |
| **Parent Spec** | ../spec.md |
| **Phase** | 7 of 9 |
| **Predecessor** | 006-goal-conformance-check |
| **Successor** | 008-command-and-playbook |
| **Handoff Criteria** | A real goal-authoring request routes from advisor to sk-doc to sk-create-goal, while out-of-domain session-goal and host-command probes do not select the mode. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 7** of the Create the sk-create-goal sk-doc mode that authors packet goals specification.

**Scope Boundary**: Modify the seven named sk-doc hub routing surfaces only. Do not create the mode or command, edit system-spec-kit, or change runtime goal state. The parent assigns command creation to phase 008 and keeps session objectives and runtime binding out of scope (specs/sk-doc/060-create-goal-mode/spec.md:94-109,128-129).

**Dependencies**:
- Phase 006 must satisfy the incoming handoff: each negative conformance fixture fails for its named reason and the positive fixture passes (specs/sk-doc/060-create-goal-mode/spec.md:147).
- Phases 002-006 must provide the mode packet and its goal-authoring leaves before the exact stage-two leaf set can be selected (specs/sk-doc/060-create-goal-mode/spec.md:122-127).
- The current advisor CLI, compiled-route CLI, leaf-manifest generator and explicit-path parent-skill check must be available (.skilled/skills/sk-doc/SKILL.md:54-58; .skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:240-255).

**Deliverables**:
- A synchronized `sk-create-goal` registry entry, stage-one router signal and tie-break, stage-two intent/resource map and full-inventory entry, hub advisor vocabulary, human-facing mode row/count, description update and regenerated leaf manifest (.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:222-233; specs/sk-doc/060-create-goal-mode/001-goal-inventory-and-mode-contract/scratch/wave1-mode-anatomy-audit.md:3-17).
- Before-and-after results for the same ten newcomer prompts and negative replays for session-goal phrases and `/goal-opencode` and `/goal-cursor`.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The sk-doc hub advertises fourteen modes across thirteen packets, but has no sk-create-goal route; its advisor identity, registry, hub router, surface router and human-facing mode table are distinct surfaces that must agree (.skilled/skills/sk-doc/SKILL.md:15,25-39,50-64; .skilled/skills/sk-doc/mode-registry.json:17-18; .skilled/skills/sk-doc/hub-router.json:4-21,49-50; .skilled/skills/sk-doc/ROUTER.md:20-35,136-164). Registering a mode without replays can still leave it unreachable, and the parent routing checklist requires checking every applicable surface and both stages (.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:212-259).

### Purpose
Goal-authoring requests reach sk-create-goal through both sk-doc routing stages while session-goal management requests remain outside that mode.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add one `sk-create-goal` workflow registration with `backendKind: template-scaffold`, the existing template-scaffold tool surface, `/create:goal`, a narrowly qualified alias set and `advisorRouting.routingClass: metadata` (.skilled/skills/sk-doc/mode-registry.json:488-524; .skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:64-74,112-128).
- Add the matching `routerSignals`, vocabulary class and exact `routerPolicy.tieBreak` entry, then wire the stage-two `INTENT_SIGNALS`, `RESOURCE_MAP` and `FULL_INVENTORY` in root `ROUTER.md` (.skilled/skills/sk-doc/hub-router.json:4-21,49-50,178-439; .skilled/skills/sk-doc/ROUTER.md:136-164,166-373).
- Update the hub `graph-metadata.json`, `description.json` and `SKILL.md` mode table/count, then regenerate `leaf-manifest.json` with its owning generator (.skilled/skills/sk-doc/graph-metadata.json:54-69; .skilled/skills/sk-doc/description.json:2-50; .skilled/skills/sk-doc/SKILL.md:15,25-39; .skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:229-233).
- Replay positive requests through the advisor and hub router, exercise fixed out-of-domain phrases and measure one unchanged ten-prompt newcomer corpus before and after. The prior frontmatter integration recorded zero of ten newcomer prompts at its initial measurement, then used the same corpus for its after measurement (specs/sk-doc/049-sk-create-frontmatter/010-fix-newcomer-reachability-for-sk-create-frontmatter-routing/spec.md:20-31; specs/sk-doc/049-sk-create-frontmatter/010-fix-newcomer-reachability-for-sk-create-frontmatter-routing/implementation-summary.md:89-92).

### Out of Scope
- Creating or changing the `sk-create-goal` packet, its authoring logic or goal template. Earlier phases own the packet, while system-spec-kit owns the template and existing goal validation (specs/sk-doc/060-create-goal-mode/spec.md:85-92; specs/sk-doc/060-create-goal-mode/001-goal-inventory-and-mode-contract/scratch/wave1-goal-system-audit.md:3-18).
- Creating `/create:goal`, its assets, command metadata or runtime command mirrors. Phase 008 owns these files (specs/sk-doc/060-create-goal-mode/spec.md:100-109,128-129).
- Changing session objective setting, binding, update/resend behavior, `/goal-opencode`, `/goal-cursor` or any system-spec-kit files; these belong to the existing hook/host surfaces (specs/sk-doc/060-create-goal-mode/spec.md:94-98; .skilled/skills/system-spec-kit/SKILL.md:149-160,483-485; specs/sk-doc/060-create-goal-mode/001-goal-inventory-and-mode-contract/scratch/wave1-mode-anatomy-audit.md:24-31).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-doc/mode-registry.json` | Modify | Register the workflow mode, packet, tool surface, command, narrow aliases and metadata routing class. |
| `.skilled/skills/sk-doc/hub-router.json` | Modify | Add the mode's signal, vocabulary class and tie-break position. |
| `.skilled/skills/sk-doc/ROUTER.md` | Modify | Add the stage-two intent, resource map and full-inventory leaves. |
| `.skilled/skills/sk-doc/graph-metadata.json` | Modify | Add advisor vocabulary for goal-document authoring. |
| `.skilled/skills/sk-doc/SKILL.md` | Modify | Add the mode-table row and update the mode/packet count. |
| `.skilled/skills/sk-doc/description.json` | Modify | Advertise the goal-authoring workflow and its narrow vocabulary. |
| `.skilled/skills/sk-doc/leaf-manifest.json` | Regenerate | Generate from the updated registry and packet leaves; never hand-edit. |
| `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/007-sk-doc/fixtures/canary-cases.v1.json` | Modify | Add a `sk-create-goal` canary case and re-pin any source digests the new mode changes. Operator-approved amendment, 2026-09-26. |
| The sk-doc canary harness under `.skilled/bin/lib/compiled-routing/` | Modify | Refresh its live-topology counts for fifteen modes across fourteen packets, as its own comment requires when a mode is registered. Operator-approved amendment, 2026-09-26. |
| The compiled-routing artifacts under `.skilled/bin/lib/compiled-routing/` | Regenerate | Republish through `compiled-route-manifest.cjs refresh --hub sk-doc`, `compiled-route-sync.cjs`, the status, verify and canary gates, then `--finalize`; never hand-edit. Operator-approved amendment, 2026-09-26. |
| `specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/007-sk-doc/fixtures/canary-cases.v1.json` | Modify | Mirror the same canary case into the authored source the runtime fixture is rebuilt from, so a later sync keeps it. Operator-approved amendment, 2026-09-26. |
| `specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/sk-doc/manifest.json` | Regenerate | Re-mint the authored activation manifest with `compiled-route-manifest.cjs refresh --runtime-root`, which the sync needs to resolve sk-doc; never hand-edit. Operator-approved amendment, 2026-09-26. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The registry contains exactly one entry with `workflowMode: sk-create-goal`, `packetKind: workflow`, `backendKind: template-scaffold`, `packet` and `packetSkillName` set to `sk-create-goal`, `grandfatheredFolderMismatch: false`, `command: /create:goal`, an authored tool surface matching the existing template-scaffold workflow contract, lower-case aliases unique across modes, and `advisorRouting.routingClass: metadata`; JSON parsing and the explicit sk-doc parent-skill check verify the entry. |
| REQ-002 | `hub-router.json` contains a `sk-create-goal` signal, a dedicated vocabulary class and a tie-break list that remains an exact permutation of all registry modes; the explicit sk-doc parent-skill check exits 0. |
| REQ-003 | The root `ROUTER.md` contains equal-key `INTENT_SIGNALS` and `RESOURCE_MAP` entries, the mode's existing on-disk packet leaves resolve through the generated manifest, and those leaves appear in `FULL_INVENTORY`. |
| REQ-004 | The hub graph metadata, description and SKILL.md mode table/count advertise the mode, changing the hub count from fourteen modes across thirteen packets to fifteen modes across fourteen packets, and `leaf-manifest.json` is generated by the owning generator rather than hand-edited (.skilled/skills/sk-doc/SKILL.md:15,25-39). |
| REQ-005 | At least one real goal-authoring request selects `sk-doc` at the advisor and `sk-create-goal` at the hub router; each of the six session-goal/host-command probes returns zero `sk-create-goal` targets. |
| REQ-008 | Compiled routing for sk-doc is republished through refresh, sync, the status, verify and canary gates and `--finalize`, with a `sk-create-goal` canary case in both the runtime fixture and its authored source, and refreshed harness topology counts; every hub reports `compiled-serving` and no lock or rollback directory remains. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | The same ten newcomer prompts have recorded advisor and hub-router outcomes before and after the routing changes, with a count from zero to ten for each measurement and one row per prompt. |
| REQ-007 | Strict validation of this phase folder prints `RESULT: PASSED` after the planning documents and implementation evidence are reconciled. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-doc` exits 0 and reports all hard invariants passed.
- **SC-002**: A paired advisor and compiled-route replay returns `sk-doc` then `sk-create-goal` for a goal-authoring request, while the six specified out-of-domain probes produce zero `sk-create-goal` targets.
- **SC-003**: The ten fixed newcomer prompts have ten before rows and ten after rows, with an observed mode-target count recorded for each run.
- **SC-004**: Strict validation of this phase folder prints `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phases 002-006 mode packet | Its actual leaf paths are not yet known at this planning stage; the root router cannot name verified leaves before they exist | At execution, enumerate the completed packet and use only paths that exist on disk, then regenerate the manifest (specs/sk-doc/060-create-goal-mode/spec.md:122-127). |
| Dependency | Advisor and compiled-route CLIs | Without an available advisor or route output, two-stage reachability cannot be claimed | Record the unavailable command and output, repair the transport or keep the routing claim open; do not infer a pass (.skilled/skills/sk-doc/SKILL.md:54-58; .skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:250-259). |
| Risk | A broad alias captures session-goal phrases or host commands | High; it routes runtime goal management into a file-authoring mode | Replay all six out-of-domain phrases at both stages and remove any alias that selects `sk-create-goal` (.skilled/repo-rules/skill-hub-routing.md:92-96; .skilled/skills/system-spec-kit/SKILL.md:160,483-485). |
| Risk | A mode is registered but remains unreachable or has no selected leaves | High; registration alone does not prove the two routing stages agree | Run positive replays through advisor and compiled route, then run the explicit sk-doc parent-skill check (.skilled/repo-rules/skill-hub-routing.md:43-60,81-88). |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: This phase adds routing metadata only; no latency or throughput target is introduced. Stage-one and stage-two routing remain separate contracts (.skilled/skills/sk-doc/SKILL.md:50-64).

### Security
- **NFR-S01**: Do not add aliases for session-goal setting, binding, updating or resending, or for `/goal-opencode` and `/goal-cursor` (.skilled/skills/system-spec-kit/SKILL.md:160,483-485; specs/sk-doc/060-create-goal-mode/001-goal-inventory-and-mode-contract/scratch/wave1-mode-anatomy-audit.md:24-31).

### Reliability
- **NFR-R01**: Keep stage-one and stage-two phrase intent aligned, then require one positive two-stage replay and six zero-target out-of-domain replays (.skilled/repo-rules/skill-hub-routing.md:53-60,250-266).
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty alias set: do not register the mode until a positive goal-authoring phrase is selected for both routing stages.
- Alias breadth: bare `goal` and the session verbs `set`, `bind`, `update` and `resend` are excluded from the candidate vocabulary; verify the exact negative phrases by replay (.skilled/repo-rules/skill-hub-routing.md:92-96; .skilled/skills/system-spec-kit/SKILL.md:160).
- Invalid resource path: reject any `RESOURCE_MAP` leaf that does not exist in the completed mode packet or cannot resolve through the generated manifest (.skilled/skills/sk-doc/ROUTER.md:138-143).

### Error Scenarios
- Advisor CLI failure: record the command, output and exit status; do not claim stage-one reachability without an observed response.
- Compiled-route CLI failure or legacy sentinel: use the documented fallback only when appropriate and keep the compiled route claim unverified (.skilled/skills/sk-doc/SKILL.md:54-58).
- Parent-skill check failure: correct only this mode's in-scope registration surfaces and rerun against the explicit sk-doc path (.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:240-248).

### State Transitions
- Partial integration: keep `spec.md` status Draft and do not hand off to phase 008 until both routing stages and the out-of-domain replays pass (specs/sk-doc/060-create-goal-mode/spec.md:147-149).
- Generated manifest stale after a registry or packet leaf change: regenerate it with the owning generator, never edit its JSON by hand (.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:232).
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | Seven existing hub surfaces, routing metadata and replay evidence; no mode implementation. |
| Risk | 14/25 | Shared hub vocabulary can misroute sibling or session-goal requests; positive and negative replays contain that risk. |
| Research | 10/20 | Confirm current source vocabulary, completed mode leaves, generator behavior and advisor/router outcomes. |
| **Total** | **36/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Which exact authoring-only aliases select sk-doc at stage one and sk-create-goal at stage two while all six session-goal and host-command probes remain outside the mode? Settle the candidate set by replay, not by phrase intuition.
- The exact `RESOURCE_MAP` leaf paths are UNKNOWN until phases 002-006 produce the mode packet; enumerate and verify the real leaves at execution rather than inventing paths.
- The sk-doc contract makes the mode packet's `Keyword triggers:` line the routing vocabulary source (.skilled/skills/sk-doc/SKILL.md:50-52), while this phase's frozen file list names only hub surfaces (specs/sk-doc/060-create-goal-mode/spec.md:100-109). Confirm before execution that phases 001-006 already fixed the final alias line; if not, resolve the scope boundary before editing any out-of-scope packet file.
<!-- /ANCHOR:questions -->

---


