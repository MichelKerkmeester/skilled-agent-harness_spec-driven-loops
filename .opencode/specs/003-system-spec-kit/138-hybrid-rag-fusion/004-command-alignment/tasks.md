# Tasks: Command Alignment for Spec 138 Features

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

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
## Phase 1: Create Command Updates

- [x] T001 [P] Update `/create:skill` command with graph architecture decision gate (`.opencode/command/create/skill.md`)
- [x] T002 [P] Update `create_skill_auto.yaml` Steps 5/6/8 with graph scaffolding (`.opencode/command/create/assets/create_skill_auto.yaml`)
- [x] T003 [P] Update `create_skill_confirm.yaml` Steps 5/6/8 with graph scaffolding (`.opencode/command/create/assets/create_skill_confirm.yaml`)
- [x] T004 [P] Update `/create:skill_reference` Step 5 for graph-mode detection (`.opencode/command/create/skill_reference.md`)
- [x] T005 [P] Update `create_skill_reference_auto.yaml` Step 5 graph detection (`.opencode/command/create/assets/create_skill_reference_auto.yaml`)
- [x] T006 [P] Update `create_skill_reference_confirm.yaml` Step 5 graph detection (`.opencode/command/create/assets/create_skill_reference_confirm.yaml`)
- [x] T007 [P] Update `/create:skill_asset` Step 5 + add graph node asset type (`.opencode/command/create/skill_asset.md`)
- [x] T008 [P] Update `create_skill_asset_auto.yaml` Step 5 + graph node type (`.opencode/command/create/assets/create_skill_asset_auto.yaml`)
- [x] T009 [P] Update `create_skill_asset_confirm.yaml` Step 5 + graph node type (`.opencode/command/create/assets/create_skill_asset_confirm.yaml`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Memory Command Updates

- [x] T010 [P] Update `/memory:context` with graph weight dimension, SPECKIT_GRAPH_* flags, intent-to-subgraph routing documentation (`.opencode/command/memory/context.md`)
- [x] T011 [P] Update `/memory:manage` with SPECKIT_GRAPH_* flags, graph health/stats info (`.opencode/command/memory/manage.md`)
- [x] T012 [P] Update `/memory:continue` adaptive fusion note from 2-channel to 3-channel (`.opencode/command/memory/continue.md`)
- [x] T013 [P] Update `/memory:learn` consolidation pipeline note with graph channel (`.opencode/command/memory/learn.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: System Config + Verification

- [x] T014 Update `system-spec-kit/SKILL.md` feature flag table with 3 SPECKIT_GRAPH_* flags (`.opencode/skill/system-spec-kit/SKILL.md`)
- [x] T015 Verify all auto/confirm YAML pairs are consistent
- [x] T016 Verify no broken markdown structure or YAML syntax
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed (all 14 files correctly modified)
- [x] Auto/confirm pairs contain identical changes
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent Spec**: See `../spec.md` (138-hybrid-rag-fusion)
- **Phase 002 (Skill Graph)**: See `../002-skill-graph-integration/implementation-summary.md`
- **Phase 003 (Unified Graph)**: See `../003-unified-graph-intelligence/implementation-summary.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
