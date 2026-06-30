---
title: "Tasks: sk-code-opencode-merger"
description: "Completed implementation task list for the sk-code-opencode merger packet."
trigger_phrases:
  - "sk-code-opencode merger tasks"
  - "single sk-code tasks"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/052-sk-code-opencode-merger"
    last_updated_at: "2026-05-03T17:45:00Z"
    last_updated_by: "opencode"
    recent_action: "Implemented merger and verified focused suites"
    next_safe_action: "Review final diff and decide whether to commit"
    blockers: []
    key_files:
      - ".opencode/specs/skilled-agent-orchestration/z_archive/052-sk-code-opencode-merger/resource-map.md"
    session_dedup:
      fingerprint: "sha256:0660660660660660660660660660660660660660660660660660660660660662"
      session_id: "066-sk-code-opencode-merger-plan"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Implementation approved and completed on 2026-05-03."
      - "All 4 open questions resolved in deep-analysis session."
      - "26 implementation tasks defined (T006-T026), 8 verification tasks (T027-T034)."
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: sk-code-opencode-merger

<!-- SPECKIT_LEVEL: 3 -->

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

- [x] T001 Create Level 3 spec folder (`.opencode/specs/skilled-agent-orchestration/z_archive/052-sk-code-opencode-merger`)
- [x] T002 Analyze `sk-code` and `sk-code-opencode` file trees (`.opencode/skills/sk-code`, `.opencode/skills/sk-code-opencode`)
- [x] T003 [P] Run exact reference searches for `sk-code-opencode`, `sk-code-*`, `GO`, and `NEXTJS` references
- [x] T004 [P] Create detailed resource map (`resource-map.md`)
- [x] T005 Get user approval before implementation (User instructed: "Continue if you have next steps")
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 Rewrite `sk-code/SKILL.md` with two-axis detection (`.opencode/skills/sk-code/SKILL.md`)
- [x] T007 Rename `stack_detection.md` → `code_surface_detection.md`, add OPENCODE detection + language sub-detection (`.opencode/skills/sk-code/references/router/code_surface_detection.md`)
- [x] T008 Move OpenCode references into `sk-code/references/opencode/` (`.opencode/skills/sk-code/references/opencode/{shared,javascript,typescript,python,shell,config}/**`)
- [x] T009 Move OpenCode checklists into `sk-code/assets/opencode/checklists/` (`.opencode/skills/sk-code/assets/opencode/checklists/**`)
- [x] T010 Move verifier scripts into `sk-code/scripts/` (`.opencode/skills/sk-code/scripts/verify_alignment_drift.py`, `test_verify_alignment_drift.py`)
- [x] T011 Add OPENCODE entries to resource loading and verification contracts in SKILL.md
- [x] T012 Delete historical changelogs (`.opencode/skills/sk-code-opencode/changelog/`; removed with obsolete directory)
- [x] T013 Delete Go branch files (`.opencode/skills/sk-code/references/go/**`, `.opencode/skills/sk-code/assets/go/**`)
- [x] T014 Delete React/NextJS branch files (`.opencode/skills/sk-code/references/nextjs/**`, `.opencode/skills/sk-code/assets/nextjs/**`)
- [x] T015 Delete `cross_stack_pairing.md` (`.opencode/skills/sk-code/references/router/cross_stack_pairing.md`)
- [x] T016 Rewrite router docs for two-axis model (`.opencode/skills/sk-code/references/router/{resource_loading,intent_classification,phase_lifecycle}.md`)
- [x] T017 Rewrite runtime agent supported-stack and overlay text (`.opencode/agents/**`, `.claude/agents/**`, `.codex/agents/**`, `.gemini/agents/**`)
- [x] T018 Rewrite `spec_kit` command YAML overlay text (`.opencode/commands/speckit/assets/*.yaml`)
- [x] T019 Rewrite `sk-code-review` contract to single-skill model (`.opencode/skills/sk-code-review/**`)
- [x] T020 Rewrite CLI skill dispatch guidance (`.opencode/skills/cli-*/SKILL.md`)
- [x] T021 Update skill advisor scorer lanes and fixtures (`.opencode/skills/system-spec-kit/mcp_server/skill_advisor/**`)
- [x] T022 Update hook/advisor tests (`.opencode/skills/system-spec-kit/mcp_server/tests/**`)
- [x] T023 Update repository docs and install guides (`README.md`, `AGENTS.md`, `.opencode/install_guides/**`, `.opencode/skills/README.md`)
- [x] T024 Regenerate telemetry JSONL (`.opencode/skills/.smart-router-telemetry/compliance.jsonl`, `smart-router-measurement-results.jsonl`)
- [x] T025 Refresh metadata and generated skill graph (`description.json`, `graph-metadata.json`, `skill-graph.json`)
- [x] T026 Delete `sk-code-opencode/` directory (final step, after live references verified clean)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T027 Run exact live reference search for `sk-code-opencode` (remaining matches are historical/spec-folder identifiers)
- [x] T028 Run exact live reference search for `sk-code-*` overlay language (only retired-model note remains)
- [x] T029 Run exact `sk-code` route search for removed `GO` and `NEXTJS` support claims (only historical changelog mentions remain)
- [x] T030 Run moved verifier tests (`scripts/tests/alignment-drift-fixture-preservation.vitest.ts`; direct verifier PASS)
- [x] T031 Run targeted skill advisor and hook vitest suites (11 files, 185 tests passed)
- [x] T032 Run spec validation for this packet (`validate.sh --strict` passed)
- [x] T033 Document any remaining historical references as intentional (metadata/spec IDs and historical changelog only)
- [x] T034 Verify two-axis detection: Webflow code routes to webflow surface, .opencode/ code routes to opencode surface (SKILL.md + router docs + advisor recommendation evidence)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All implementation tasks marked `[x]` after user approval.
- [x] No `[B]` blocked tasks remaining.
- [x] Exact live references to `sk-code-opencode` removed or classified historical.
- [x] Go and React/NextJS placeholder route references removed from `sk-code`.
- [x] Two-axis detection operational: Webflow frontend routes to webflow surface, .opencode/ code routes to opencode surface.
- [x] Language sub-detection within OPENCODE correctly selects JS/TS/Python/Shell/Config standards.
- [x] Historical changelogs deleted with obsolete skill directory.
- [x] Telemetry JSONL regenerated.
- [x] Advisor and runtime agent tests pass.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Resource Map**: See `resource-map.md`
- **Decision Record**: See `decision-record.md`
- **Verification Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->
