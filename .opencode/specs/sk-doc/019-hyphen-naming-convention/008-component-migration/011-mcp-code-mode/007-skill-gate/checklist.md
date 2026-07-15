---
title: "Checklist: mcp-code-mode subtree skill gate (017 component 011 phase 007)"
description: "Blocking SOL verifier contract for sibling aggregation and the whole mcp-code-mode naming/reference rollup."
trigger_phrases:
  - "mcp-code-mode subtree gate checklist"
  - "mcp-code-mode phase 007 checklist"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/019-hyphen-naming-convention/008-component-migration/011-mcp-code-mode/007-skill-gate"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-hyphen-naming-convention/008-component-migration/011-mcp-code-mode/007-skill-gate"
    last_updated_at: "2026-07-14T16:30:00Z"
    last_updated_by: "codex"
    recent_action: "Authored subtree gate verifier contract"
    next_safe_action: "Run the whole-surface rollup"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: mcp-code-mode subtree skill gate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for phase 007. It aggregates the six sibling reports and reruns
the complete mcp-code-mode census. The report pins the candidate SHA, BASE SHA, all map hashes, commands, counts, and exit
codes, and fails on any incomplete sibling, in-scope snake_case name, stale active path, or new tracked mutation.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Phases 001 through 006 have passed their P0 contracts for the exact candidate tree
- [ ] CHK-002 [P2] BASE/candidate SHAs, sibling map hashes, exemption ledger, and expected path census are recorded
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-003 [P1] The rollup introduces no new migration work, repair, cleanup, or sibling-doc mutation
- [ ] CHK-004 [P0] Every remaining underscore-bearing name is classified as Python, package, tool-mandated, generated/lockfile, frozen, or non-filesystem content
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-005 [P0] All six sibling checklists have P0 pass evidence and no contradictory candidate/tree claim
- [ ] CHK-006 [P0] Recursive filesystem census reports zero in-scope snake_case names under mcp-code-mode
- [ ] CHK-007 [P0] Whole-surface stale-path and Markdown-link scans report zero active failures
- [ ] CHK-008 [P0] Node, shell, package-path, manual-playbook, scenario-parity, and changelog/version checks pass
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-009 [P1] Strict packet validation and the rollup evidence comparison pass with no missing child or unclassified path
- [ ] CHK-010 [P1] The final exemption ledger accounts for Python, tool-mandated, generated/lockfile, frozen, and content-only underscore hits
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-011 [P2] The rollup verifies routing policy, environment handling, credentials, dependency source, and executable behavior without changing them
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-012 [P2] The rollup report links every sibling result and records the final naming/reference/changelog verdict
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-013 [P1] The gate is read-only and leaves no untracked scratch or repair artifact in the component subtree
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The component is accepted only when every P0 check passes, all six sibling contracts are complete, the whole surface is
exemption-clean and link-clean, and the read-only rollup shows no unexpected mutation.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier confirms the P0 contract and the rollup is ready for the next component parent gate.
<!-- /ANCHOR:sign-off -->
