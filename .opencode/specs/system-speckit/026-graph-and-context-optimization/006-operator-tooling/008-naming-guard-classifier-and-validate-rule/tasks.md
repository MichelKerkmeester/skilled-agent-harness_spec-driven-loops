---
title: "Tasks: Naming-Guard Classifier and validate.sh SEMANTIC_NAMING Rule"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "naming guard tasks"
  - "classifier tasks"
  - "semantic naming rule tasks"
  - "spec folder naming build"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/006-operator-tooling/008-naming-guard-classifier-and-validate-rule"
    last_updated_at: "2026-06-06T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Enumerated planned tasks for items 1+2"
    next_safe_action: "Start T004 implementing the shared classifier"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/shared/spec-folder-naming.ts"
      - ".opencode/skills/system-spec-kit/scripts/rules/check-semantic-naming.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "open-008-naming-guard"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Naming-Guard Classifier and validate.sh SEMANTIC_NAMING Rule

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
## Phase 1: Setup

- [ ] T001 Confirm tsconfig include globs cover `shared/**`, `scripts/spec/**`, `mcp_server/lib/**` (.opencode/skills/system-spec-kit/*/tsconfig.json)
- [ ] T002 [P] Lock the classification record shape and ruleId constants (.opencode/skills/system-spec-kit/shared/spec-folder-naming.ts)
- [ ] T003 [P] Define fixtures: `028-026-*` HARD, `003-...-103-...` ok, `009-p2-032-...` ok, nested strict-fail child
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Implement `classifyProposedSpecFolder()` with `EMBEDDED_SIBLING_PHASE_PARENT` HARD rule reusing `isPhaseParent` (.opencode/skills/system-spec-kit/shared/spec-folder-naming.ts)
- [ ] T005 Add strict phase-child syntax HARD rule and `GENERIC_STANDALONE_SLUG` WARN rule (.opencode/skills/system-spec-kit/shared/spec-folder-naming.ts)
- [ ] T006 Add CLI wrapper emitting TSV/JSON (.opencode/skills/system-spec-kit/scripts/spec/spec-folder-naming.ts)
- [ ] T007 Add `classify_proposed_spec_folder` shell shim mirroring existing helpers (.opencode/skills/system-spec-kit/scripts/lib/shell-common.sh)
- [ ] T008 Add runtime re-export for the orchestrator (.opencode/skills/system-spec-kit/mcp_server/lib/spec/spec-folder-naming.ts)
- [ ] T009 Add `check-semantic-naming.sh` rule mirroring `check-folder-naming.sh` (.opencode/skills/system-spec-kit/scripts/rules/check-semantic-naming.sh)
- [ ] T010 Register `SEMANTIC_NAMING` (severity warn) after `FOLDER_NAMING` (.opencode/skills/system-spec-kit/scripts/lib/validator-registry.json)
- [ ] T011 Add `validateSemanticNaming(folder)` and push into orchestrator entries (.opencode/skills/system-spec-kit/mcp_server/lib/validation/orchestrator.ts)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T012 Build dist and run classifier unit fixtures (3 hard cases + 2 known-good shapes)
- [ ] T013 Parity check: rule emitted via Node orchestrator AND shell fallback (no silent skip)
- [ ] T014 Run `validate.sh <packet> --strict` and synchronize spec/plan/tasks/checklist/impl-summary
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
