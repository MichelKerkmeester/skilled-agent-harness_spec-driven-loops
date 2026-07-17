---
title: "Implementation Plan: cli-external-orchestration manual-testing-playbook naming (032 phase 005.005)"
description: "Implementation plan for the four cli-external-orchestration playbook trees: build a complete directory/file map, rename scenario paths in dependency order, update links, and prove scenario and frontmatter parity."
trigger_phrases:
  - "cli-external manual playbook implementation plan"
  - "manual-testing-playbook path map plan"
  - "cli-external phase 005 plan"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/005-cli-external-orchestration/005-manual-testing-playbook"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/005-cli-external-orchestration/005-manual-testing-playbook"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored playbook path plan"
    next_safe_action: "Enumerate all four playbook trees"
    blockers: []
    key_files:
      - ".opencode/skills/cli-external-orchestration/manual_testing_playbook/"
      - ".opencode/skills/cli-external-orchestration/cli-opencode/manual_testing_playbook/"
      - ".opencode/skills/cli-external-orchestration/cli-claude-code/manual_testing_playbook/"
      - ".opencode/skills/cli-external-orchestration/cli-codex/manual_testing_playbook/"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The current four-tree inventory is 34 directories and 116 files."
      - "Component reference/assets are separate ownership from their nested playbooks."
---
# Implementation Plan: cli-external-orchestration manual-testing-playbook naming

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | Four `manual_testing_playbook/` roots and all category/scenario descendants |
| **Change class** | Dependency-closed authored path rename and recursive reference closure |
| **Execution** | Pinned BASE, four-tree map, link resolution, scenario/frontmatter parity |

### Overview
The current inventory spans 34 directories and 116 files: the hub root has `hub_routing/` and `plugins_and_hooks/`; cli-opencode has ten categories; cli-claude-code has nine; and cli-codex has nine. The plan maps each root/category/file segment explicitly, then updates links while treating scenario IDs and frontmatter as content contracts.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phases 001–004 have handed off their ownership boundaries and the 032 exemption record is available.
- [ ] Candidate/BASE SHAs and all four recursive inventories are captured.
- [ ] Every category and file has a single owner and a rename/protected/exempt disposition.

### Definition of Done
- [ ] All in-scope playbook paths have unique kebab-case targets and no stale source references.
- [ ] Scenario IDs, frontmatter, headings, and file counts match BASE.
- [ ] Non-playbook component paths and benchmark ownership remain outside the diff.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Use a four-root dependency map: rename child files before or with their parent directory targets, then resolve every path-valued reference against the final map. Never substitute underscores in prose, identifiers, or frontmatter fields.

### Key Components
- **Hub playbook**: `hub_routing/` → `hub-routing/`, `plugins_and_hooks/` → `plugins-and-hooks/`; files include `claude_code_second_opinion.md`, `holdout_second_opinion.md`, `opencode_full_runtime_dispatch.md`, `cli_dispatch_audit_trail.md`, and `codex_hook_parity.md`.
- **OpenCode categories**: `agent_routing`, `cli_invocation`, `cross_repo_cross_server`, `external_dispatch`, `integration_patterns`, `intra_routing_recall`, `multi_provider`, `parallel_detached`, `prompt_templates`, `session_continuity`; observed files include `deep_research_agent_iterations.md`, `self_invocation_guard_nested.md`, `parallel_detached_session.md`, `kimi_k2_7_direct_with_sk_prompt_models.md`, and `resume_by_session_id.md`.
- **Claude categories**: `agent_routing`, `cli_invocation`, `cost_and_background`, `integration_patterns`, `intra_routing_recall`, `permission_modes`, `prompt_templates`, `reasoning_and_models`, `session_continuity`; observed files include `context_agent_codebase_exploration.md`, `max_budget_usd_cap.md`, `structured_output_with_json_schema.md`, and `continue_previous_conversation.md`.
- **Codex categories**: `agent_routing`, `built_in_tools`, `cli_invocation`, `codex_cloud`, `integration_patterns`, `prompt_templates`, `reasoning_effort`, `sandbox_modes`, `session_continuity`; observed files include `mcp_server_registration.md`, `gpt_5_5_model_lock.md`, `high_xhigh_override.md`, `workspace_write_sandbox.md`, and `session_resume_fork.md`.

### Data Flow
Four-tree BASE inventory → ownership/classification ledger → segment-aware source-target map → directory/file rename → recursive path-reference rewrite → scenario/link/content parity checks.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Capture all four roots, 34 directories, 116 files, category names, scenario names, scenario IDs, and frontmatter baselines.
- [ ] Search skill/README/index files and every playbook document for relative path consumers.
- [ ] Build the map with one row per path and record exempt/protected/content-only tokens separately.

### Phase 2: Implementation
- [ ] Rename each category and authored file to its explicit kebab-case target, preserving tree ownership.
- [ ] Update root/component skill links, playbook indexes, relative Markdown links, and path-valued scenario references.
- [ ] Preserve scenario IDs, frontmatter fields, headings, content keys, and scenario meaning.

### Phase 3: Verification
- [ ] Re-enumerate all four trees and reconcile every path with the map.
- [ ] Resolve recursive Markdown/path references and search for stale source segments.
- [ ] Compare scenario IDs, frontmatter, headings, file counts, and scope boundaries with BASE.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Compare every path under all four roots with the single ownership/disposition ledger; fail on unknown or duplicate ownership |
| REQ-002 | Check every root/category/file target for kebab-case and search for stale source segments |
| REQ-003 | Resolve all playbook links and path-valued references from skill, README, index, and scenario documents |
| REQ-004 | Compare scenario IDs, frontmatter fields, headings, file counts, and content semantics with BASE |
| REQ-005 | Review the diff against component references/assets, benchmark paths, code identifiers, keys, and frozen history |
| REQ-006 | Confirm map bijection, casefold/NFC collision absence, and git-revert reversibility |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The phase depends on phases 001–004 for root and component ownership boundaries and hands its complete playbook map to phase 006. Phase 007 later checks release evidence; the 032 exemption record governs frontmatter, identifiers, Python names, and frozen history.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the dependency-closed playbook rename/reference commits if a link, scenario-ID, frontmatter, collision, or ownership check fails. If a new category appears or a path crosses into component reference ownership, stop before mutation and amend the ledger through the owning phase.
<!-- /ANCHOR:rollback -->

