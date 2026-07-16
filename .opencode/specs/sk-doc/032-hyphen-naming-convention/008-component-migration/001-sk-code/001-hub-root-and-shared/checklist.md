---
title: "Checklist: hub root and shared sk-code names (032 phase 008/001)"
description: "Blocking SOL verification contract for the sk-code hub/shared rename and reference closure."
trigger_phrases:
  - "hub shared naming checklist"
  - "sk-code shared rename verification"
  - "workflow symlink verification"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/032-hyphen-naming-convention/008-component-migration/001-sk-code/001-hub-root-and-shared"
_memory:
  continuity:
    packet_pointer: "sk-doc/032-hyphen-naming-convention/008-component-migration/001-sk-code/001-hub-root-and-shared"
    last_updated_at: "2026-07-14T18:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored hub shared SOL checklist"
    next_safe_action: "Verify the shared rename closure against BASE"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Checklist: Hub root and shared sk-code names

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for the hub/shared child. The report pins the candidate SHA, BASE SHA, frozen rename-map hash, commands, exit codes, path counts, symlink results, and route outcomes. A zero-file or zero-scenario check is a failure, and verification must leave no unexpected tracked mutation.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] The candidate is on the pinned BASE worktree with a clean isolated index and the shared-closure handoff is attached.
- [ ] CHK-002 [P2] The report records the BASE SHA, candidate SHA, rename-map hash, pre-change shared-name count, and symlink manifest.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-003 [P1] The change is limited to shared names and their path/reference closure; no adjacent component cleanup is included.
- [ ] CHK-004 [P0] No code identifier, JSON/YAML/TOML key, frontmatter field, tool-mandated filename, Python file/package directory, generated output, or frozen history was renamed.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-005 [P0] Every shared candidate listed in spec.md has exactly one rename/exempt/frozen/generated/tool-mandated disposition and every renamed target is kebab-case.
- [ ] CHK-006 [P0] All shared markdown links, hub path values, and workflow symlink targets resolve after the rename.
- [ ] CHK-007 [P0] Shared surface detection, fallback routing, and workflow loading produce the same outcomes as the BASE evidence.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-008 [P1] The old shared basenames have no active path consumer, and the final manifest contains no in-scope snake_case name under shared/.
- [ ] CHK-009 [P1] Symlink count, targets, link modes, and executable bits match the baseline closure.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-010 [P2] The routing allowlist, resource guard, sandbox boundary, and tool posture are unchanged except for required path literals.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-011 [P2] shared/README.md, hub docs, and the child packet record the final kebab-case paths and evidence.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-012 [P1] The rename/reference changes are committed as a dependency-closed, path-scoped batch with no unrelated files.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

Accept the child only when every P0 check passes, the frozen map and baseline are pinned, all links and symlinks resolve, shared routing remains equivalent, and the final diff is scope-clean.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

The SOL verifier signs off only after the candidate report contains the required receipts and git diff-index --quiet HEAD -- shows no unexpected tracked mutation after verification.
<!-- /ANCHOR:sign-off -->
