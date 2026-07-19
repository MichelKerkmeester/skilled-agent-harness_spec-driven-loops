---
title: "Checklist: deep-research filesystem names (020 phase 007/003)"
description: "Blocking SOL verification contract for the deep-research resource, state, artifact, catalog, playbook, and reference rename closure."
trigger_phrases:
  - "deep-research checklist"
  - "deep research naming verification"
  - "research packet path check"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/007-system-deep-loop/003-deep-research"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/007-system-deep-loop/003-deep-research"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored deep research checklist"
    next_safe_action: "Verify the deep research rename closure"
    blockers: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: Deep-research filesystem names

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for the deep-research child. The report pins candidate SHA, BASE SHA, frozen-map hash, commands, exit codes, 13-directory/103-file counts, resource/state/artifact counts, and research outcomes. A zero-file or zero-scenario result is a failure, and verification must leave no unexpected tracked mutation.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] The candidate is on the pinned BASE worktree with research resource, state, artifact, scenario, and dynamic-path baselines attached.
- [ ] CHK-002 [P2] The report records BASE SHA, candidate SHA, frozen-map hash, 13 directory candidates, 103 file candidates, and scenario/resource counts.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-003 [P1] The change is limited to deep-research names and their reference closure; no runtime, sibling packet, root playbook, or root benchmark cleanup is included.
- [ ] CHK-004 [P0] State/event keys, convergence values, identifiers, JSON/YAML/TOML keys, frontmatter fields, generated output, Python/package, tool-mandated, and frozen names were not renamed.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-005 [P0] Every research candidate has exactly one disposition and all renamed targets pass collision checks.
- [ ] CHK-006 [P0] Resource maps, assets, references, catalog/playbook indexes, Markdown links, command/agent paths, state paths, and artifact paths resolve.
- [ ] CHK-007 [P0] Catalog/resource leaves, playbook scenario IDs, behavior-benchmark IDs, state reconstruction, and research routing match BASE with non-zero discovery.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-008 [P1] Every dynamic artifact/state path site is exercised or dispositioned, and no old basename remains in an active consumer.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-009 [P2] Research path guards, artifact-root containment, tool permissions, and state write boundaries are unchanged except for required path values.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-010 [P2] The research map, dynamic-path ledger, scenario/resource parity, and protected-contract evidence are recorded in the phase report.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-011 [P1] Research renames and reference rewrites are dependency-closed, path-scoped, and free of sibling-surface files.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

Accept this child only when every P0 item passes, resource/state/artifact paths resolve, non-zero scenario/resource and research checks match BASE, and the final diff is scope-clean.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

The SOL verifier signs off only after the report contains the required receipts and `git diff-index --quiet HEAD --` shows no unexpected tracked mutation after verification.
<!-- /ANCHOR:sign-off -->
