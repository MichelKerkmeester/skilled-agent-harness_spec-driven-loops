---
title: "Checklist: mcp-code-mode manual-testing playbook (017 component 011 phase 005)"
description: "Blocking SOL verifier contract for the complete manual-testing tree rename, link closure, and scenario parity."
trigger_phrases:
  - "mcp-code-mode manual playbook checklist"
  - "mcp-code-mode phase 005 checklist"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/008-component-migration/011-mcp-code-mode/005-manual-testing-playbook"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/008-component-migration/011-mcp-code-mode/005-manual-testing-playbook"
    last_updated_at: "2026-07-14T16:30:00Z"
    last_updated_by: "codex"
    recent_action: "Authored manual-playbook verifier contract"
    next_safe_action: "Run the playbook closure verifier"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: mcp-code-mode manual-testing playbook

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for phase 005. The report pins the candidate SHA, BASE SHA, and
rename-map hash, records the complete root/category/scenario map, link and parity commands, exit codes, and dispositions,
and fails on a missing scenario, broken active link, or unexpected tracked mutation.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Phases 001 through 004 provide their final path state and the full playbook inventory is recorded from BASE
- [ ] CHK-002 [P2] The BASE SHA, tree-map hash, scenario inventory, and active link inventory are recorded
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-003 [P1] Changes are limited to the playbook filesystem paths and active path consumers; no scenario prose cleanup is included
- [ ] CHK-004 [P0] Scenario IDs, tool names, JSON/YAML/TOML keys, frontmatter fields, Python paths, runtime filenames, and frozen changelog content are unchanged
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-005 [P0] The root and eight category mappings are complete: clickup_and_chrome_via_cm, core_tools, env_var_prefixing, manual_namespace_contract, multi_tool_workflows, plugins_and_hooks, recovery_and_config, and third_party_via_cm
- [ ] CHK-006 [P0] All 27 scenario source filenames map to kebab-case targets and the final tree contains exactly 27 scenarios across eight categories
- [ ] CHK-007 [P0] The index, category tables, scenario links, active guides, scripts, and consumers resolve without a stale old-tree path
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-008 [P1] Strict packet validation and the active Markdown link scan report zero broken links
- [ ] CHK-009 [P1] Scenario IDs, objectives, prompts, expected signals, and content parity match the pinned BASE evidence
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-010 [P2] No credentials, tool routing policy, environment variable names, executable behavior, or manual scenario semantics changed beyond path rewriting
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-011 [P2] The phase evidence records the final root/category/scenario map, scenario parity, and frozen/exempt dispositions
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-012 [P1] The root, category, index, scenario, and link updates land in dependency-closed, path-scoped commits
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete when every P0 check passes, the final tree contains all 27 scenarios with parity evidence, active
links resolve, the map matches the tracked change set, and no unexpected tracked mutation remains.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier confirms the P0 contract and the complete manual-testing playbook is internally linked.
<!-- /ANCHOR:sign-off -->
