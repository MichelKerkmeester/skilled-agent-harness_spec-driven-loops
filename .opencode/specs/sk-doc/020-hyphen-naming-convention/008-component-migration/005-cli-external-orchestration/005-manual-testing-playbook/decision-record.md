---
title: "Decision Record: cli-external-orchestration manual-testing-playbook naming (020 phase 005.005)"
description: "Design decisions for the four-tree playbook rename: keep one ownership map across hub and CLI components, rename path segments without changing scenario contracts, and resolve references against the final tree."
trigger_phrases:
  - "cli-external manual playbook decision record"
  - "manual-testing-playbook scenario boundary"
  - "cli-external phase 005 decisions"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/005-cli-external-orchestration/005-manual-testing-playbook"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/005-cli-external-orchestration/005-manual-testing-playbook"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Recorded playbook boundary decisions"
    next_safe_action: "Apply the four-tree playbook map"
    blockers: []
    key_files:
      - ".opencode/skills/cli-external-orchestration/manual_testing_playbook/"
      - ".opencode/skills/cli-external-orchestration/cli-opencode/manual_testing_playbook/"
      - ".opencode/skills/cli-external-orchestration/cli-claude-code/manual_testing_playbook/"
      - ".opencode/skills/cli-external-orchestration/cli-codex/manual_testing_playbook/"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "All four playbook roots are owned by this phase; component reference/assets are not."
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

# Decision Record: cli-external-orchestration manual-testing-playbook naming

<!-- ANCHOR:context -->
## Context

The skill has four independent manual-testing-playbook trees: one hub tree and one under each CLI workflow component. Their roots, category directories, and scenario files use underscore-separated names, while relative links and index documents connect the trees to skill guidance. The playbooks also contain scenario IDs, frontmatter fields, CLI values, and prose that are not filesystem names.
<!-- /ANCHOR:context -->

<!-- ANCHOR:decisions -->
## Decisions

### DR-001 — Use one four-tree ownership map

Phase 005 owns the root and all three component `manual_testing_playbook/` trees, including category directories and scenario filenames. Phases 002–004 own only non-playbook component references/assets, preventing competing maps for nested paths.

### DR-002 — Rename filesystem path segments without changing scenario contracts

Map directory and filename segments such as `hub_routing` → `hub-routing`, `cross_repo_cross_server` → `cross-repo-cross-server`, `cost_and_background` → `cost-and-background`, `built_in_tools` → `built-in-tools`, and `gpt_5_5_model_lock.md` → `gpt-5-5-model-lock.md`. Preserve scenario IDs, frontmatter fields, headings, content keys, provider values, and manual-test meaning.

### DR-003 — Resolve references against the final tree

Update skill/README/index links, relative Markdown links, and path-valued scenario references only after the complete four-tree map exists. A stale source path, missing scenario, or newly introduced category blocks sign-off rather than being silently repaired outside the ledger.
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:consequences -->
## Consequences

- The phase needs a recursive ledger and scenario/frontmatter baseline, not a directory-only rename.
- The same category name under different components remains a distinct source path and receives an independently checked target.
- A changed underscore in prose or a frontmatter field is a content defect, not a successful filesystem migration.
<!-- /ANCHOR:consequences -->

<!-- ANCHOR:references -->
## References

- Program naming rules and exemptions: `.opencode/specs/sk-doc/020-hyphen-naming-convention/001-convention-policy-and-scope/decision-record.md`.
- Live playbook roots: `.opencode/skills/cli-external-orchestration/manual_testing_playbook/`, `cli-opencode/manual_testing_playbook/`, `cli-claude-code/manual_testing_playbook/`, and `cli-codex/manual_testing_playbook/`.
- Component ownership map: `../spec.md` and the phase 002–004 scope sections.
<!-- /ANCHOR:references -->

