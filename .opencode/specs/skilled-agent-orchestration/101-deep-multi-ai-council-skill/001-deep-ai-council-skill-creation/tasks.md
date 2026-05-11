---
title: "Tasks: 101/001 Deep AI Council Skill Creation"
description: "Task list for creating the dedicated deep-ai-council skill, renamed runtime agents, moved council assets, and advisor routing updates."
trigger_phrases:
  - "101/001 tasks"
  - "deep-ai-council skill tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/101-deep-multi-ai-council-skill/001-deep-ai-council-skill-creation"
    last_updated_at: "2026-05-10T08:10:34Z"
    last_updated_by: "openai-gpt-5.5-opencode"
    recent_action: "Completed implementation tasks through targeted council/advisor tests"
    next_safe_action: "Index Phase 001 continuity"
    blockers: []
    key_files:
      - .opencode/skills/deep-ai-council/
      - .opencode/agents/
      - .claude/agents/
      - .codex/agents/
      - .gemini/agents/
      - .opencode/skills/system-spec-kit/mcp_server/skill_advisor/
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "101-001-skill-creation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Phase 001 excludes graph support."
      - "No compatibility shim is required by active runtime mirror evidence."
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: 101/001 Deep AI Council Skill Creation

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

- [x] T001 Scaffold parent and child phase spec folders (`101-deep-multi-ai-council-skill/`)
- [x] T002 Author Phase 001 root spec, plan, tasks, and summary stubs (`001-deep-ai-council-skill-creation/`)
- [x] T003 Inventory all old-name producers and consumers (`multi-ai-council`)
- [x] T004 Confirm whether compatibility shim is required by concrete consumer evidence
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Create `deep-ai-council` skill root (`.opencode/skills/deep-ai-council/`)
- [x] T006 Add skill metadata (`SKILL.md`, `description.json`, `graph-metadata.json`)
- [x] T007 Move/adapt council references into the new skill (`references/`)
- [x] T008 Move/adapt council assets and testing playbook (`assets/`)
- [x] T009 Move/adapt council scripts and script tests (`scripts/`)
- [x] T010 Rename OpenCode, Claude, Codex, and Gemini agent mirrors to `deep-ai-council`
- [x] T011 Update advisor metadata, aliases, generated graph, and regression fixtures
- [x] T012 Remove old council ownership from `system-spec-kit` except necessary integration notes
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Run advisor validation for council prompts
- [x] T014 Run skill graph scan and validation
- [x] T015 Run moved council script tests
- [x] T016 Run OpenCode alignment verification for touched `.opencode` surfaces
- [x] T017 Run `validate.sh --strict` on this phase folder
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Advisor routes council prompts to `deep-ai-council`
- [x] Runtime mirror names are consistent across all four runtimes
- [x] Phase 001 validation passes without warnings

---

<!-- ANCHOR:evidence -->
## Evidence

| Task | Evidence |
|------|----------|
| T003-T004 | `Glob` found no active `.opencode/.claude/.codex/.gemini` `*multi-ai-council*` runtime files; no shim added. |
| T005-T010 | `.opencode/skills/deep-ai-council/` contains `SKILL.md`, metadata, references, assets, scripts, and runtime mirrors under `deep-ai-council`. |
| T011-T015 | `npx vitest run skill_advisor/tests/scorer/native-scorer.vitest.ts tests/multi-ai-council-audit-trail.vitest.ts tests/multi-ai-council-permission-scope.vitest.ts tests/multi-ai-council-rollback.vitest.ts tests/multi-ai-council-runtime-parity.vitest.ts` passed: 5 files, 29 tests. |
| T014 | `spec_kit_memory_skill_graph_validate` passed with 18 nodes, 58 edges, 0 errors, 0 warnings. |
| T016 | `verify_alignment_drift.py --root .opencode/skills/deep-ai-council` passed with 0 findings; `--root .opencode/skills/system-spec-kit/mcp_server/skill_advisor` passed with 0 findings. |
| T017 | `validate.sh .opencode/specs/skilled-agent-orchestration/101-deep-multi-ai-council-skill/001-deep-ai-council-skill-creation --strict` passed with 0 errors and 0 warnings. Parent validation also passed with recursive child validation. |
| Typecheck | `npm run typecheck --prefix .opencode/skills/system-spec-kit` passed. |
| Advisor routing | Direct source scorer returns `topSkill: "deep-ai-council"`, confidence `0.95`, uncertainty `0.12` for `Run an AI council deliberation to compare implementation plans and persist council artifacts.` |
<!-- /ANCHOR:evidence -->
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Parent**: `../spec.md`
- **Successor**: `../002-deep-ai-council-reference-expansion/spec.md`
<!-- /ANCHOR:cross-refs -->
