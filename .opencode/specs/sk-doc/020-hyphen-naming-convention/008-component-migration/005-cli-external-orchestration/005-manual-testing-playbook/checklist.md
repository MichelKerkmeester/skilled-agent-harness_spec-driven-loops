---
title: "Checklist: cli-external-orchestration manual-testing-playbook naming (032 phase 005.005)"
description: "Blocking SOL verifier contract for the four cli-external-orchestration playbook trees: complete path map, recursive reference closure, scenario parity, and ownership protection."
trigger_phrases:
  - "cli-external manual playbook checklist"
  - "manual-testing-playbook verifier"
  - "cli-external phase 005 acceptance"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/005-cli-external-orchestration/005-manual-testing-playbook"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/005-cli-external-orchestration/005-manual-testing-playbook"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored playbook verifier"
    next_safe_action: "Run the four-tree playbook checklist"
    blockers: []
    key_files:
      - ".opencode/skills/cli-external-orchestration/manual_testing_playbook/"
      - ".opencode/skills/cli-external-orchestration/cli-opencode/manual_testing_playbook/"
      - ".opencode/skills/cli-external-orchestration/cli-claude-code/manual_testing_playbook/"
      - ".opencode/skills/cli-external-orchestration/cli-codex/manual_testing_playbook/"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The current four-tree baseline is 34 directories and 116 files."
---
# Checklist: cli-external-orchestration manual-testing-playbook naming

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for phase 005. The verifier pins candidate and BASE SHAs, records the four-tree path/disposition ledger and map hash, captures commands and exit codes, and fails on an unknown path, stale link, scenario drift, ownership overlap, or unexpected tracked mutation.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Phases 001–004 have handed off their boundaries and the four playbook inventories are captured before mutation
- [ ] CHK-002 [P1] Candidate SHA, BASE SHA, four-tree map hash, scenario baseline, and file counts are recorded
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-003 [P0] Every path under the root, cli-opencode, cli-claude-code, and cli-codex playbook roots has one disposition and a unique kebab-case target where renamed
- [ ] CHK-004 [P0] Only filesystem path values changed; scenario IDs, frontmatter fields, headings, content keys, prose meaning, and manual-test behavior did not
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-005 [P0] All four playbook roots, category directories, and authored scenario files are kebab-case with no stale source segment
- [ ] CHK-006 [P0] Indexes, skill/README links, relative Markdown links, and path-valued scenario references resolve recursively
- [ ] CHK-007 [P0] Scenario IDs and frontmatter-field inventories match BASE, and root/OpenCode/Claude/Codex scenario counts remain equal
- [ ] CHK-008 [P1] The map covers the current 34 directories and 116 files, plus any execution-time additions, without an unknown class
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-009 [P1] Component references/assets, benchmark paths, Python/package names, tool-mandated names, generated output, and frozen history are outside the diff
- [ ] CHK-010 [P1] The four-tree map is bijective, collision-free, reversible, and handed to phase 006 with stale-link evidence
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-011 [P2] No approval policy, sandbox mode, CLI invocation contract, tool allowlist, or executable behavior changed through a content rewrite
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-012 [P1] Evidence identifies every playbook root/category disposition, scenario baseline, reference scan, and phase 006 handoff
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-013 [P1] Only four-tree playbook paths and their active references changed; no implementation-summary scaffold file or scratch directory remains
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase passes when all four playbook trees are kebab-clean, recursive links resolve, scenario/frontmatter parity is proven, and no non-playbook or exempt surface was absorbed.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier confirms the P0 contract, central validation is green, and `git diff-index --quiet HEAD --` shows no unassigned playbook mutation.
<!-- /ANCHOR:sign-off -->

