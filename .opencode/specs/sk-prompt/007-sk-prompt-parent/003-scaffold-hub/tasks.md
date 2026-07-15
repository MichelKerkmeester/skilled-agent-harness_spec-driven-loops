---
title: "Tasks: Phase 3: scaffold-hub"
description: "Pending execution tasks for the additive sk-prompt parent-hub skeleton. No content relocation, command rebinding, benchmark path update, or advisor integration update belongs to this phase."
trigger_phrases:
  - "sk-prompt scaffold hub tasks"
  - "prompt parent hub tasks"
  - "prompt-improve prompt-models scaffold tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-prompt/007-sk-prompt-parent/003-scaffold-hub"
    last_updated_at: "2026-07-09T15:42:00Z"
    last_updated_by: "claude"
    recent_action: "Executed all scaffold tasks, T001-T018 complete"
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
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 3: scaffold-hub

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read `.opencode/skills/sk-doc/create-skill/assets/parent_skill/parent_skill_hub_template.md` before rewriting the hub `SKILL.md`. — Evidence: template read in full before authoring.
- [x] T002 Read `.opencode/skills/sk-doc/create-skill/assets/parent_skill/parent_skill_registry_template.json` before creating `mode-registry.json`. — Evidence: template read; also modeled on the live `sk-doc/mode-registry.json` zero-extension precedent.
- [x] T003 Read `.opencode/skills/sk-doc/create-skill/assets/parent_skill/parent_skill_hub_router_template.json` before creating `hub-router.json`. — Evidence: template read; modeled on `sk-doc/hub-router.json`.
- [x] T004 Read `.opencode/skills/sk-doc/create-skill/assets/parent_skill/parent_skill_description_template.json` and `.opencode/skills/sk-doc/create-skill/assets/parent_skill/parent_skill_graph_metadata_template.json` before rewriting `description.json` and `graph-metadata.json`. — Evidence: both templates read.
- [x] T005 Confirm the execution scope excludes content relocation, `/prompt` command rebinding, `/deep:model-benchmark` path repointing, advisor runtime path joins, prompt-card CI updates, install guides, and prose referrers. — Evidence: only the 5 hub-root files + 2 empty dirs touched this phase.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 Create `.opencode/skills/sk-prompt/mode-registry.json` with exactly two workflow modes: `prompt-improve` and `prompt-models`. — Evidence: `mode-registry.json` created, `parent-skill-check.cjs` 3b confirms 2 modes.
- [x] T007 Define `prompt-improve` in the registry as the default mutating workflow mode, with `packet` and `packetSkillName` both set to `prompt-improve`. — Evidence: `mode-registry.json` modes[0], `hub-router.json routerPolicy.defaultMode`.
- [x] T008 Define `prompt-models` in the registry as a read-only workflow mode, with `packet` and `packetSkillName` both set to `prompt-models`, `mutatesWorkspace:false`, and `Write`, `Edit`, and `Task` forbidden. — Evidence: `mode-registry.json` modes[1] toolSurface.
- [x] T009 Create `.opencode/skills/sk-prompt/hub-router.json` with `defaultMode: "prompt-improve"`, `tieBreak` ordered as `prompt-improve` then `prompt-models`, bidirectional `routerSignals`, and only `single`, `orderedBundle`, and `defer` outcomes. — Evidence: `parent-skill-check.cjs` 5b/5e/5g/5h/5i all PASS.
- [x] T010 Rewrite `.opencode/skills/sk-prompt/SKILL.md` as a thin routing-only parent hub that points to `mode-registry.json`, `hub-router.json`, and the two packet directories without embedding packet-local contracts. — Evidence: `SKILL.md` rewritten, `parent-skill-check.cjs` 3j PASS (tool-surface union).
- [x] T011 Rewrite `.opencode/skills/sk-prompt/description.json` as the advisor-facing hub descriptor for both workflow modes. — Evidence: `description.json` created, `parent-skill-check.cjs` 8a/8b PASS.
- [x] T012 Rewrite `.opencode/skills/sk-prompt/graph-metadata.json` as the single surviving graph identity. — Evidence: `graph-metadata.json` rewritten preserving `skill_id: sk-prompt`; folding in `sk-prompt-models`' own edges/domains is deliberately deferred to phase 005 (identity dissolution happens when the packet is actually folded in, per the parent spec.md phase table), not duplicated early.
- [x] T013 Create empty `.opencode/skills/sk-prompt/prompt-improve/` and `.opencode/skills/sk-prompt/prompt-models/` directories without moving any existing files. — Evidence: both directories created via `mkdir -p`, zero files inside either.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T014 Run `PARENT_HUB_CHECK_STRICT=0 node .opencode/commands/doctor/scripts/parent-skill-check.cjs .opencode/skills/sk-prompt` and record the structural result; empty-packet warnings are acceptable for this phase. — Evidence: 2 expected FAILs (packet dirs not yet populated, phase 004/005's job) + 2 expected WARNs (router resource paths, missing benchmark baseline); every structural check (registry shape, tool surface, router policy, graph identity) PASSED.
- [x] T015 Confirm `.opencode/skills/sk-prompt/prompt-improve/` and `.opencode/skills/sk-prompt/prompt-models/` are empty relocation targets. — Evidence: `ls -la` on both shows zero files.
- [x] T016 Confirm no content was moved from existing `.opencode/skills/sk-prompt/` locations into the packet directories and no content was moved from `.opencode/skills/sk-prompt-models/`. — Evidence: `sk-prompt-models/` untouched; `sk-prompt/`'s pre-existing `references/`, `assets/`, `changelog/`, `manual_testing_playbook/`, `README.md` remain at hub root, not yet moved.
- [x] T017 Confirm `/prompt` command files, `/deep:model-benchmark` command/assets, advisor runtime path joins, `.github/workflows/prompt-card-sync.yml`, install guides, and broad prose referrers are unchanged in this phase. — Evidence: zero edits issued outside `.opencode/skills/sk-prompt/{mode-registry.json,hub-router.json,description.json,SKILL.md,graph-metadata.json,prompt-improve/,prompt-models/}`.
- [x] T018 Confirm exactly one graph metadata file exists for the future hub tree: `.opencode/skills/sk-prompt/graph-metadata.json`, with no packet-local graph metadata. — Evidence: `parent-skill-check.cjs` 1a/2a PASS.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` — Evidence: T001-T018 all checked above.
- [x] No `[B]` blocked tasks remaining — Evidence: none carry the `[B]` prefix.
- [x] Parent-hub structural validation passed with `PARENT_HUB_CHECK_STRICT=0`; any remaining warnings are limited to intentionally empty packet directories — Evidence: T014.
- [x] Phase 003 stayed additive-only: hub skeleton and empty directories created, with zero content relocation and zero command rebinding — Evidence: T016, T017.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
