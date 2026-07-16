---
title: "Feature Specification: cli-external-orchestration manual-testing-playbook naming (032 phase 005.005)"
description: "The cli-external-orchestration surface contains four manual_testing_playbook roots and snake_case category/file names across hub, OpenCode, Claude Code, and Codex scenarios. This phase renames those playbook filesystem names, updates active references, and preserves scenario IDs, frontmatter fields, and test meaning."
trigger_phrases:
  - "cli-external manual playbook kebab-case"
  - "manual-testing-playbook scenario rename"
  - "cli-external phase 005 playbook naming"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/032-hyphen-naming-convention/008-component-migration/005-cli-external-orchestration/005-manual-testing-playbook"
_memory:
  continuity:
    packet_pointer: "sk-doc/032-hyphen-naming-convention/008-component-migration/005-cli-external-orchestration/005-manual-testing-playbook"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored playbook naming docs"
    next_safe_action: "Freeze the four-tree playbook map"
    blockers: []
    key_files:
      - ".opencode/skills/cli-external-orchestration/manual_testing_playbook/"
      - ".opencode/skills/cli-external-orchestration/cli-opencode/manual_testing_playbook/"
      - ".opencode/skills/cli-external-orchestration/cli-claude-code/manual_testing_playbook/"
      - ".opencode/skills/cli-external-orchestration/cli-codex/manual_testing_playbook/"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The current inventory has four playbook roots, 34 directories, and 116 files; the path census reports 150 underscore-bearing entries."
      - "All four playbook roots and their category/file descendants belong to this phase; component reference/assets remain with phases 002–004."
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: cli-external-orchestration manual-testing-playbook naming

> Phase adjacency under the cli-external-orchestration component parent: predecessor `004-cli-codex`; successor `006-benchmark`; phases 002–004 do not own any nested playbook path.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/032-hyphen-naming-convention/008-component-migration/005-cli-external-orchestration/005-manual-testing-playbook |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | cli-external-orchestration |
| **Origin** | Phase 005 of the cli-external-orchestration subtree under the 032 kebab-case filesystem-naming program |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The hub, cli-opencode, cli-claude-code, and cli-codex playbooks use `manual_testing_playbook/` roots, underscore-separated category directories, and underscore-separated scenario filenames. Their links are distributed across playbook indexes, skill/README guidance, and cross-scenario references, so renaming a category without its descendants would break manual coverage and leave stale paths.

This phase applies a complete four-tree filesystem map to kebab-case, rewrites path-valued references, and proves that scenario IDs, frontmatter fields, headings, and manual-test meaning are preserved.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Root tree `.opencode/skills/cli-external-orchestration/manual_testing_playbook/`, including `hub_routing/`, `plugins_and_hooks/`, and files such as `claude_code_second_opinion.md`, `holdout_second_opinion.md`, `opencode_full_runtime_dispatch.md`, `cli_dispatch_audit_trail.md`, and `codex_hook_parity.md`.
- OpenCode tree `cli-opencode/manual_testing_playbook/`, including `agent_routing/`, `cli_invocation/`, `cross_repo_cross_server/`, `external_dispatch/`, `integration_patterns/`, `intra_routing_recall/`, `multi_provider/`, `parallel_detached/`, `prompt_templates/`, and `session_continuity/`, plus all snake_case scenario files such as `deep_research_agent_iterations.md`, `self_invocation_guard_nested.md`, `parallel_detached_session.md`, and `deepseek_v4_direct_api.md`.
- Claude Code tree `cli-claude-code/manual_testing_playbook/`, including `agent_routing/`, `cli_invocation/`, `cost_and_background/`, `integration_patterns/`, `intra_routing_recall/`, `permission_modes/`, `prompt_templates/`, `reasoning_and_models/`, and `session_continuity/`, plus all scenario files.
- Codex tree `cli-codex/manual_testing_playbook/`, including `agent_routing/`, `built_in_tools/`, `cli_invocation/`, `codex_cloud/`, `integration_patterns/`, `prompt_templates/`, `reasoning_effort/`, `sandbox_modes/`, and `session_continuity/`, plus all scenario files such as `gpt_5_5_model_lock.md` and `mcp_server_registration.md`.
- Update playbook indexes, `SKILL.md`/README references, relative Markdown links, and any path-valued scenario or category references.

### Out of Scope
- Non-playbook component references/assets, scripts, root router files, and benchmark artifacts; phases 001–004 and 006 own them.
- Scenario IDs, frontmatter fields, JSON/YAML/TOML keys, code identifiers, prose terminology, changelog history, Python/package names, generated output, and tool-mandated names.
- Executing the migration during this authoring pass.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| Root `manual_testing_playbook/` | Rename/reference update | Map `manual_testing_playbook`, `hub_routing`, `plugins_and_hooks`, and all child files |
| `cli-opencode/manual_testing_playbook/` | Rename/reference update | Map the ten category dirs and all scenario files |
| `cli-claude-code/manual_testing_playbook/` | Rename/reference update | Map the nine category dirs and all scenario files |
| `cli-codex/manual_testing_playbook/` | Rename/reference update | Map the nine category dirs and all scenario files |
| Skill/README/index references | Reference update | Repoint active playbook paths while preserving scenario semantics |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 [P0] | Four-tree ownership is complete | Every path under the four playbook roots has exactly one source-target, exempt, protected, generated, or frozen disposition |
| REQ-002 [P0] | Playbook filesystem names are kebab-case | All four roots, category directories, and authored scenario filenames have unique hyphenated targets with no stale source path |
| REQ-003 [P0] | Active playbook references resolve | Indexes, skill/README links, relative scenario links, and path-valued references resolve after the map is applied |
| REQ-004 [P0] | Manual-test semantics are preserved | Scenario IDs, frontmatter fields, scenario count, headings, and content meaning match BASE; only filesystem path values change |
| REQ-005 [P1] | Component ownership stays separate | Non-playbook reference/assets and benchmark paths are outside the diff and handed to their owning phases |
| REQ-006 [P1] | The map is reversible | Source-target mappings are bijective, collision-free, and support a git revert |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All four manual-testing-playbook trees use kebab-case filesystem names.
- **SC-002**: All active playbook/index references resolve with no stale authored source path.
- **SC-003**: Scenario IDs, frontmatter, headings, and manual-test coverage match BASE.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

The primary risk is a partial tree rename that breaks relative links or silently drops a scenario. The phase depends on the component handoffs and 032 path-vs-content boundary; a complete four-tree ledger, scenario-ID parity check, and recursive link resolution provide the guardrail.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking. The execution census must re-count all four trees before mutation because a later authoring change could add a category or scenario.
<!-- /ANCHOR:questions -->

