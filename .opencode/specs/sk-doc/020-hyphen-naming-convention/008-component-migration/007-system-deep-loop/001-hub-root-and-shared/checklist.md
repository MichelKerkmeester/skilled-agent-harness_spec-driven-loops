---
title: "Checklist: system-deep-loop hub root and shared names (020 phase 007/001)"
description: "Blocking SOL verification contract for the system-deep-loop hub/shared boundary, including the current no-candidate result, exact-name protections, and routing/helper parity."
trigger_phrases:
  - "system-deep-loop hub shared checklist"
  - "deep loop shared naming verification"
  - "hub root exact-name check"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/007-system-deep-loop/001-hub-root-and-shared"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/007-system-deep-loop/001-hub-root-and-shared"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored hub shared checklist"
    next_safe_action: "Verify the hub shared boundary"
    blockers: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: System-deep-loop hub root and shared names

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for the hub/shared child. The report pins candidate SHA, BASE SHA, frozen-map hash, commands, exit codes, root/shared path counts, and routing/helper outcomes. A zero-file or zero-scenario result is a failure, and verification must leave no unexpected tracked mutation.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] The candidate is on the pinned BASE worktree with a clean isolated index and the root/shared ownership boundary is attached.
- [ ] CHK-002 [P2] The report records BASE SHA, candidate SHA, frozen-map hash, root/shared inventory counts, and exact-name manifest.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-003 [P1] The change is limited to the hub root/shared path closure; no runtime, workflow, root-playbook, or root-benchmark cleanup is included.
- [ ] CHK-004 [P0] `SKILL.md`, router/registry, metadata names, identifiers, JSON keys, frontmatter fields, Python/package, generated, tool-mandated, and frozen names were not renamed.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-005 [P0] Every root/shared path has exactly one rename/exempt/frozen/generated/tool-mandated disposition and no unknown row.
- [ ] CHK-006 [P0] The current no-candidate result is evidenced, or every pinned-baseline candidate has an exact kebab-case target with collision proof.
- [ ] CHK-007 [P0] Hub/router paths, shared Markdown links, and helper fixtures resolve to the expected targets.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-008 [P1] Root routing and shared behavior/helper outcomes match BASE with non-zero checks and no stale candidate basename.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-009 [P2] Router guards, path containment, helper permissions, and the one-graph-metadata boundary are unchanged except for required path values.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-010 [P2] The root/shared manifest, no-op/candidate rationale, and final path evidence are recorded in the phase report and packet docs.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-011 [P1] Any rename/reference change is one dependency-closed, path-scoped batch with no sibling-surface files.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

Accept this child only when every P0 item passes, the no-op or conditional rename result is evidenced, root/shared paths resolve, routing/helper parity is green, and the final diff is scope-clean.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

The SOL verifier signs off only after the report contains the required receipts and `git diff-index --quiet HEAD --` shows no unexpected tracked mutation after verification.
<!-- /ANCHOR:sign-off -->
