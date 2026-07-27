---
title: "Tasks: Deprecate cli-codex skill and operational references"
description: "Task breakdown for retiring cli-codex from active skill, executor, command, advisor, agent, doc, and metadata surfaces."
trigger_phrases:
  - "cli-codex deprecation tasks"
  - "codex cli retirement tasks"
  - "executor cleanup tasks"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/cli-external-orchestration/025-cli-codex-deprecation"
    last_updated_at: "2026-06-30T15:05:00Z"
    last_updated_by: "opencode"
    recent_action: "Added Codex Desktop App project bridge amendment"
    next_safe_action: "Validate TOML, symlink resolution, and strict packet validation"
    blockers: []
    key_files:
      - ".opencode/skills/cli-codex/"
      - ".opencode/skills/deep-loop-runtime/"
      - ".opencode/skills/system-skill-advisor/"
      - ".opencode/commands/deep/assets/"
    session_dedup:
      fingerprint: "sha256:951b82df8b7b03d01f3aecac83cfb367798059f3291c5484a195365fe50d8a33"
      session_id: "159-cli-codex-deprecation-plan"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Plan first, implement through separate workflow."
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Deprecate cli-codex skill and operational references

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

- [x] T001 Run `/speckit:plan:auto` contract and read workflow assets (`.opencode/commands/speckit/assets/speckit_plan_auto.yaml`)
- [x] T002 Scaffold Level 3 packet at `.opencode/specs/cli-external-orchestration/025-cli-codex-deprecation`
- [x] T003 [P] Inventory active `cli-codex` references with scoped grep and context agents
- [x] T004 Capture baseline active grep count immediately before implementation edits
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

This phase mirrors the Gemini deprecation sequence: skill deletion, command-layer cleanup, full executor/advisor purge, and runtime/model boundary review.

- [x] T005 Remove `.opencode/skills/cli-codex/` from active skill discovery
- [x] T006 Remove `cli-codex` executor kind from `.opencode/skills/deep-loop-runtime/**`
- [x] T007 Remove `cli-codex` model/skill benchmark references from `.opencode/skills/deep-loop-workflows/deep-improvement/**`
- [x] T008 Remove `cli-codex` matrix adapter and manifest cells from `.opencode/skills/system-spec-kit/mcp_server/matrix_runners/**`
- [x] T009 Remove `cli-codex` options from `.opencode/commands/deep/assets/**`
- [x] T010 Remove advisor scoring, fixture, and graph routes from `.opencode/skills/system-skill-advisor/**`
- [x] T011 Update canonical `.opencode/agents/**` prompts and `.claude/agents/**` mirrors
- [x] T012 Update root docs, install guides, skill README/catalog docs, feature catalogs, and manual playbooks
- [x] T013 Refresh or regenerate skill graph metadata after source cleanup
- [x] T013a Remove residual empty `.opencode/skills/cli-codex/` directories from disk after tracked-file deletion
- [x] T013b Ask AI Council for active generic Codex runtime cleanup plan before destructive hook deletion
- [x] T013c Delete Codex hook trees and remove active Codex references from `README.md`, `.opencode/hooks`, `.opencode/commands`, and active `.opencode/skills/**`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T014 Run targeted advisor tests/typecheck for changed scorer and graph fixtures
- [x] T015 Run targeted deep-loop runtime and deep-improvement tests/typecheck
- [x] T016 Run matrix runner compile/test coverage for removed adapter cells
- [x] T017 Run OpenCode alignment drift verifier for changed `.opencode` scopes
- [x] T018 Run final scoped grep and document remaining archival exceptions
- [x] T019 Run strict SpecKit validation for this packet
- [x] T020 Update `implementation-summary.md` and checklist with evidence
- [x] T021 Run post-expansion typechecks and targeted tests for system-spec-kit, system-code-graph, system-skill-advisor, and deep-loop-runtime
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Desktop App Bridge Amendment

- [x] T022 Research Codex Desktop App project-local configuration, skills, MCP, hooks, AGENTS.md, and subagent expectations from OpenAI docs
- [x] T023 Restore `.codex/config.toml` with Codex-compatible MCP server tables for this workspace
- [x] T024 Add `.codex/specs` and `.codex/changelog` symlinks to canonical `.opencode` context
- [x] T025 Restore `.agents -> .codex` and add `.codex/skills` symlink to canonical `.opencode/skills` for Codex repository skill discovery
- [x] T026 Document why `.codex/agents` is not symlinked from Markdown agent mirrors
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All P0 tasks marked `[x]` with evidence in `checklist.md` or `implementation-summary.md`
- [x] No `[B]` blocked tasks remaining
- [x] Final active grep has zero unapproved operational `codex` or `cli-codex` references in requested active paths
- [x] Codex Desktop App bridge parses and symlink smoke tests pass without restoring `cli-codex` delegation
- [x] Strict packet validation passes
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decision Record**: See `decision-record.md`
<!-- /ANCHOR:cross-refs -->
