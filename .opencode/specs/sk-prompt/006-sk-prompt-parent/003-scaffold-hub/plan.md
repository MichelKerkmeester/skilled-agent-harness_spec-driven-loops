---
title: "Implementation Plan: Phase 3: scaffold-hub"
description: "Plan the additive sk-prompt hub skeleton: create the registry, router, advisor descriptor, thin hub SKILL.md, single graph metadata, and two empty workflow packet directories before any content relocation."
trigger_phrases:
  - "sk-prompt scaffold hub plan"
  - "prompt parent hub plan"
  - "prompt-improve prompt-models registry"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-prompt/006-sk-prompt-parent/003-scaffold-hub"
    last_updated_at: "2026-07-09T15:42:00Z"
    last_updated_by: "claude"
    recent_action: "Executed the hub skeleton exactly as planned"
    next_safe_action: "Proceed to phase 004"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/003-scaffold-hub"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 3: scaffold-hub

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | OpenCode skill markdown and JSON metadata |
| **Framework** | Parent-hub nested-packet pattern from `sk-doc/create-skill` templates |
| **Storage** | `.opencode/skills/sk-prompt/` hub root plus empty `prompt-improve/` and `prompt-models/` packet directories |
| **Testing** | `parent-skill-check.cjs` structural validation with `PARENT_HUB_CHECK_STRICT=0`; manual scope check for zero relocation |

### Overview
Implement only the scaffold layer for the approved `sk-prompt` parent hub. The execution pass will start from the five parent-skill template sources, create or rewrite the five hub-root files, create two empty packet directories, and stop before any content relocation or command rebinding.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 002 decision shape is available to the executor: `prompt-improve` and `prompt-models` are both workflow modes, `defaultMode` is `prompt-improve`, and there are zero extensions.
- [ ] Parent-hub template files have been read before authoring the scaffold files.
- [ ] Execution scope is limited to the five hub-root files and two empty packet directories listed in `spec.md`.

### Definition of Done
- [ ] `mode-registry.json`, `hub-router.json`, `description.json`, `SKILL.md`, and `graph-metadata.json` exist at `.opencode/skills/sk-prompt/` with the planned hub-only shape.
- [ ] `prompt-improve/` and `prompt-models/` exist as empty directories and contain no relocated content.
- [ ] `PARENT_HUB_CHECK_STRICT=0 node .opencode/commands/doctor/scripts/parent-skill-check.cjs .opencode/skills/sk-prompt` passes structural checks, with empty-packet warnings accepted for this phase.
- [ ] No command rebinding, benchmark path update, advisor runtime path update, CI update, or prose referrer update is included in this phase.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Workflow-only parent hub: one advisor-routable `sk-prompt` identity routes to two nested workflow packets through `mode-registry.json` and `hub-router.json`. The hub remains routing-only and the packets are empty placeholders until phases 004 and 005 move content.

### Key Components
- **Hub `SKILL.md`**: Thin routing entry point that explains the two modes and delegates all packet-local behavior.
- **`mode-registry.json`**: Declarative packet registry for `prompt-improve` and `prompt-models`, including backend kind, tool surface, packet identity, folder/name match, and advisor routing.
- **`hub-router.json`**: Workflow-first router with base-three outcomes, bidirectional router signals, and vocabulary classes for prompt improvement versus small-model prompt-craft profile lookup.
- **`description.json`**: Advisor-facing hub descriptor for the single `sk-prompt` identity.
- **`graph-metadata.json`**: The surviving graph identity, rewritten to carry the folded domain, intent-signal, and `enhances -> cli-opencode` relationship content.
- **Empty packet directories**: `prompt-improve/` and `prompt-models/`, reserved for future relocation.

### Data Flow
Advisor routes a prompt-related request to the single `sk-prompt` hub identity. The hub scores request language through `hub-router.json`, resolves the selected `workflowMode` in `mode-registry.json`, and loads the corresponding packet once phases 004 and 005 populate those packet directories.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase affects only the future scaffold surface under `.opencode/skills/sk-prompt/`. It deliberately leaves current prompt-improvement content, the current `sk-prompt-models` tree, commands, benchmark paths, runtime path joins, CI, and broad documentation referrers unchanged.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/skills/sk-prompt/SKILL.md` | Existing flat prompt-improvement skill entry point | Rewrite to thin routing-only hub | Manual read plus parent-skill-check confirms hub metadata exists |
| `.opencode/skills/sk-prompt/mode-registry.json` | New hub registry | Create from parent registry template | JSON parse and parent-skill-check registry checks |
| `.opencode/skills/sk-prompt/hub-router.json` | New hub router | Create from parent router template | Router signals match registry modes; outcomes are `single`, `orderedBundle`, `defer` |
| `.opencode/skills/sk-prompt/description.json` | Existing prompt skill advisor descriptor | Rewrite as hub descriptor | Manual read confirms single `sk-prompt` identity and two workflow modes |
| `.opencode/skills/sk-prompt/graph-metadata.json` | Existing prompt skill graph identity | Rewrite as the sole hub graph metadata | `graph-metadata.json` exists only at hub root; folded `cli-opencode` enhance edge retained |
| `.opencode/skills/sk-prompt/prompt-improve/` | New packet directory | Create empty directory | Directory exists; no relocated files present |
| `.opencode/skills/sk-prompt/prompt-models/` | New packet directory | Create empty directory | Directory exists; no relocated files present |

Required inventories:
- Hub-root scaffold files: confirm the final diff is limited to the five files and two directories listed in `spec.md`.
- Non-relocation check: confirm no files are moved from current `sk-prompt` locations or from `.opencode/skills/sk-prompt-models/`.
- Deferred integration check: confirm `/prompt`, `/deep:model-benchmark`, advisor path joins, prompt-card CI, install guides, and prose referrers remain untouched.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Read `.opencode/skills/sk-doc/create-skill/assets/parent_skill/parent_skill_hub_template.md` for the thin hub `SKILL.md` shape.
- [ ] Read `.opencode/skills/sk-doc/create-skill/assets/parent_skill/parent_skill_registry_template.json` for the `mode-registry.json` scaffold and required per-mode fields.
- [ ] Read `.opencode/skills/sk-doc/create-skill/assets/parent_skill/parent_skill_hub_router_template.json` for router policy, router signals, vocabulary classes, and base outcomes.
- [ ] Read `.opencode/skills/sk-doc/create-skill/assets/parent_skill/parent_skill_description_template.json` and `parent_skill_graph_metadata_template.json` for advisor descriptor and graph identity shapes.
- [ ] Confirm execution scope still excludes relocation, `/prompt` rebinding, benchmark path repointing, runtime path joins, CI changes, and prose referrers.

### Phase 2: Core Implementation
- [ ] Create `.opencode/skills/sk-prompt/mode-registry.json` with `skill: "sk-prompt"`, versioned hub description, and exactly two `modes[]` entries: `prompt-improve` and `prompt-models`.
- [ ] Give `prompt-improve` a mutating workflow tool surface appropriate for the existing prompt-improvement engine and bind it as the default mode.
- [ ] Give `prompt-models` a read-only workflow tool surface with `allowed` limited to `Read`, `Grep`, and `Glob`, `forbidden` including `Write`, `Edit`, and `Task`, and `mutatesWorkspace:false`.
- [ ] Create `.opencode/skills/sk-prompt/hub-router.json` with `routerPolicy.defaultMode: "prompt-improve"`, `tieBreak: ["prompt-improve", "prompt-models"]`, and only the base-three outcomes.
- [ ] Rewrite `.opencode/skills/sk-prompt/SKILL.md` as a thin routing-only hub using the parent hub template, with no packet-local prompt-improvement framework details or model-profile content.
- [ ] Rewrite `.opencode/skills/sk-prompt/description.json` as the hub advisor descriptor covering both workflow modes.
- [ ] Rewrite `.opencode/skills/sk-prompt/graph-metadata.json` as the sole graph identity and fold in the `sk-prompt-models` domain, intent-signal, and `enhances -> cli-opencode` content.
- [ ] Create empty `.opencode/skills/sk-prompt/prompt-improve/` and `.opencode/skills/sk-prompt/prompt-models/` directories without moving any existing files.

### Phase 3: Verification
- [ ] Run `PARENT_HUB_CHECK_STRICT=0 node .opencode/commands/doctor/scripts/parent-skill-check.cjs .opencode/skills/sk-prompt` and record the structural result; empty packet warnings are acceptable in this phase.
- [ ] Confirm `.opencode/skills/sk-prompt/prompt-improve/` and `.opencode/skills/sk-prompt/prompt-models/` are empty relocation targets.
- [ ] Confirm no files under the existing `sk-prompt` content tree were moved into packet directories and no `.opencode/skills/sk-prompt-models/` content was moved.
- [ ] Confirm `/prompt` command files, `/deep:model-benchmark` assets, advisor runtime path joins, prompt-card CI, install guides, and prose referrers are unchanged by this phase.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| JSON validity | `mode-registry.json`, `hub-router.json`, `description.json`, `graph-metadata.json` | Node JSON parsing via parent-skill-check |
| Structural | Hub registry/router/graph identity invariants | `PARENT_HUB_CHECK_STRICT=0 node .opencode/commands/doctor/scripts/parent-skill-check.cjs .opencode/skills/sk-prompt` |
| Scope | Empty packet directories and zero relocation | Manual path inspection of `prompt-improve/`, `prompt-models/`, existing `sk-prompt` content, and `.opencode/skills/sk-prompt-models/` |
| Deferred integration | Commands, benchmark path, advisor runtime path joins, CI, prose referrers | Not run in phase 003; assigned to later phases |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 002 accepted architecture | Internal | Green | Without it, mode taxonomy and default routing would be unbound |
| Parent-skill template assets | Internal | Green | Without them, hub files could drift from the parent-hub validator contract |
| `parent-skill-check.cjs` | Internal | Green | Without it, structural conformance would rely only on manual inspection |
| Phases 004 and 005 | Internal | Pending | Empty packet directories remain non-functional until content relocation occurs |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Parent-hub structural validation fails in a way that cannot be corrected within the five hub-root files and two empty directories, or any content relocation accidentally lands in phase 003.
- **Procedure**: Revert only the phase-003 scaffold edits under `.opencode/skills/sk-prompt/`: remove the new registry/router files and empty packet directories, and restore the prior `SKILL.md`, `description.json`, and `graph-metadata.json` content. Because no content relocation is allowed, rollback does not need to reconstruct moved files.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
