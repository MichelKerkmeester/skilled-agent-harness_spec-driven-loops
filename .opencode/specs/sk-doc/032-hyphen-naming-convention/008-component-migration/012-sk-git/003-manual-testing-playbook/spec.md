---
title: "Feature Specification: sk-git manual testing playbook (032 phase 008/012/003)"
description: "SUPERSEDED by concurrent v4 work, which already renamed the sk-git manual-testing-playbook tree to kebab-case (committed on skilled/v4). This phase is now VERIFY-ONLY: confirm the seven category dirs and scenario files are kebab, the GIT-001..041 identities are intact, and every index/link resolves. Re-verify the entry count against v4's actual tree (v4 release evidence = 42 files / 8 dirs vs the 49-entry authoring map)."
trigger_phrases:
  - "sk-git manual testing kebab-case"
  - "032 manual playbook rename"
  - "manual scenario path closure"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/032-hyphen-naming-convention/008-component-migration/012-sk-git/003-manual-testing-playbook"
_memory:
  continuity:
    packet_pointer: "sk-doc/032-hyphen-naming-convention/008-component-migration/012-sk-git/003-manual-testing-playbook"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Reconciled to verify-only after v4 committed the sk-git kebab migration"
    next_safe_action: "Verify the manual-playbook tree is already kebab on v4 and re-count against its actual entries"
    blockers: []
    key_files:
      - ".opencode/skills/sk-git/manual-testing-playbook/manual-testing-playbook.md"
      - ".opencode/skills/sk-git/manual-testing-playbook/"
      - ".opencode/skills/sk-git/SKILL.md"
      - ".opencode/skills/sk-git/README.md"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: sk-git manual testing playbook

> Phase adjacency under the sk-git component parent: predecessor 002-assets; successor 004-benchmark. The siblings are independently scoped; the adjacency is an execution ordering hint for the component rollup.

> **SUPERSEDED — VERIFY-ONLY (v4 reconciliation, 2026-07-15).** Concurrent v4 work already renamed this tree to kebab-case (committed on `skilled/v4.0.0.0`); the live sk-git manual-testing-playbook is fully kebab. This phase performs **no rename** — it VERIFIES the completed state (kebab category dirs + scenario files, GIT-001..041 identities intact, root index `manual-testing-playbook.md` and every link resolving) and adopts v4's names as the baseline. **Re-count required:** the 49-entry authoring map must be reconciled with v4's actual tree (v4 release evidence records 42 files across 8 directories). Rationale and full inventory: the packet's v4-reconciliation-inventory.md.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/032-hyphen-naming-convention/008-component-migration/012-sk-git/003-manual-testing-playbook |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | sk-git |
| **Origin** | Phase 003 of the sk-git component migration under the 032 kebab-case filesystem-naming program |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The manual-testing-playbook tree contains seven historical snake_case category directories and 41 scenario files whose source names used underscores. **Concurrent v4 work has now committed the full kebab rename of this tree**, so the live checkout contains only hyphenated directory and file names, including the root index `manual-testing-playbook.md`. This phase therefore verifies — rather than executes — the completed migration: the tree is fully kebab, the root index and scenario cross-references resolve (no surviving `manual_testing_playbook/`, `worktree_setup/`, or `fresh_feature_isolated_worktree.md` spellings), and the playbook is not populated-yet-broken.

The purpose is to prove the entire manual-testing-playbook tree is kebab-case, all GIT-001 through GIT-041 scenario identities and content are intact, and every index, link, package-artifact entry, and path-valued pointer resolves. The phase performs no rename and must NOT reverse any of v4's already-migrated paths. The authoring-time 49-entry map is a verification reference and must be reconciled against v4's actual entry count.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Verify the root index is `manual-testing-playbook.md` (v4 renamed it from `manual_testing_playbook.md`).
- Verify the seven category directories are kebab (v4 renamed them): commit_formation -> commit-formation; cross_cli_orchestration -> cross-cli-orchestration; integration_and_pr -> integration-and-pr; owner_first_worktree_tooling -> owner-first-worktree-tooling; recovery_and_edge_cases -> recovery-and-edge-cases; safety_refusals -> safety-refusals; worktree_setup -> worktree-setup.
- Verify all 41 scenario files are kebab with GIT-001 through GIT-041 IDs and scenario metadata intact.
- Confirm the root playbook index, category links, scenario links, package-artifact lists, SKILL.md/README.md pointers, and in-tree Markdown paths all resolve — no active source spelling survives.
- Reconcile the authoring-time 49-entry map against v4's actual tree (v4 release evidence = 42 files / 8 dirs); adopt v4's names as baseline; do NOT re-rename or reverse any path.

### Observed Scenario Basenames
The 41 source basenames observed in the sk-git history are grouped by their source category directory:
- commit_formation/: co_authored_by_footer.md, conventional_commit_from_diff.md, mixed_concerns_split_or_warn.md, scope_inference_skill_folder.md.
- cross_cli_orchestration/: cli_opencode_and_cli_copilot_handback.md, cli_opencode_delegation.md, native_claude_code_invocation.md.
- integration_and_pr/: branch_cleanup_after_merge.md, failing_tests_block_merge.md, finish_create_pr_with_template.md, finish_merge_to_main.md.
- owner_first_worktree_tooling/: create_owner_first_and_detached_worktrees.md, locked_unique_number_allocation.md, orchestrated_child_execs_in_place.md, owner_slug_branch_pair_validation.md, prepush_fail_open_on_broken_validator.md, prepush_gates_only_new_branches.md, prepush_migration_tolerance.md, prepush_never_blocks_release_branches.md, prepush_rejects_wrapper_ref.md, prepush_skip_env_bypass.md, reaper_auto_reap_qualifying_wrapper.md, reaper_dry_run_no_mutation.md, reaper_keeps_non_qualifying_worktrees.md, reaper_orphan_daemon_report_only.md, runtime_identity_validation.md, session_activity_marker.md, shared_artifact_symlink_containment.md, top_level_session_isolation.md, wrapper_lane_exemption_vs_illegal_owner.md.
- recovery_and_edge_cases/: accidental_commit_wrong_branch.md, empty_commit_or_no_changes.md, merge_conflict_resolution.md, rebase_vs_merge_decision.md.
- safety_refusals/: amend_published_commit_refused.md, force_push_to_main_refused.md, no_verify_bypass_refused.md, secrets_in_diff_refused.md.
- worktree_setup/: current_branch_no_worktree.md, fresh_feature_isolated_worktree.md, stay_on_main_no_feature_branches.md.

### Out of Scope
- Feature-catalog paths, references, assets, benchmark profiles/artifacts, changelog files, scripts, code, Python names, Python package directories, and tool-mandated names.
- Changing scenario IDs, scenario semantics, frontmatter fields, JSON/YAML/TOML keys, commands, or non-path prose.
- Executing manual scenarios as a behavior change; this phase proves path and discovery integrity only.
- Any migration outside the sk-git skill or any sibling 032 component phase.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .opencode/skills/sk-git/manual-testing-playbook/manual-testing-playbook.md | Verify | Confirm the root index exists (renamed by v4) and its path table resolves. |
| .opencode/skills/sk-git/manual-testing-playbook/{seven category dirs} | Verify | Confirm category directories are kebab (v4 renamed them). |
| .opencode/skills/sk-git/manual-testing-playbook/{41 scenario files} | Verify | Confirm scenario files are kebab with IDs/contracts intact. |
| .opencode/skills/sk-git/SKILL.md and README.md | Verify | Confirm pointers into the playbook tree resolve. |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The complete manual-playbook map covers the root index, seven category directories, and 41 scenario files. | The candidate report contains 49 path entries, each with one rename or baseline no-op disposition and no unknown bucket. |
| REQ-002 | All manual-playbook path consumers use kebab-case. | The root index, category links, scenario links, package-artifact list, SKILL.md, README.md, and in-tree references resolve with zero broken links and zero active source pointers. |
| REQ-003 | Scenario discoverability and identity are preserved. | The index still enumerates exactly GIT-001 through GIT-041 once each; category membership and scenario frontmatter remain unchanged apart from path values. |
| REQ-004 | The phase does not alter the content contract. | Scenario bodies, IDs, commands, keys, frontmatter fields, and non-path values are byte- or field-parity equivalent before and after. |
| REQ-005 | The phase honors the 032 exemption boundary and stays within sk-git. | No Python/tool-mandated name, code identifier, feature-catalog path, sibling surface, or frozen content is in the candidate diff. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The 49-entry manual-playbook map is fully dispositioned and the tree contains only kebab-case in-scope names.
- **SC-002**: The root index and every GIT-001 through GIT-041 link resolve to exactly one scenario.
- **SC-003**: Scenario IDs, category membership, content contracts, exemptions, and scope boundaries remain intact.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

The phase depends on the frozen 032 map and the reference checker from phase 005. The highest risks are renaming a category without its nested scenario closure, changing an ID while repairing a path, and leaving stale underscore paths in the root index or package-artifact list. The checklist therefore checks the 49-entry map, 41-ID parity, zero broken links, and a path-scoped diff.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking. The current baseline's already-hyphenated targets are handled through explicit no-op dispositions while the source-pointer closure is still required.
<!-- /ANCHOR:questions -->
