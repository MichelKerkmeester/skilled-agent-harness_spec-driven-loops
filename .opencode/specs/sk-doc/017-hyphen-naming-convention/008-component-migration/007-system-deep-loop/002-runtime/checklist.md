---
title: "Checklist: system-deep-loop runtime names (017 phase 007/002)"
description: "Blocking SOL verification contract for the runtime directory/file rename, package workspace closure, catalog/playbook discovery, and runtime parity."
trigger_phrases:
  - "system-deep-loop runtime checklist"
  - "runtime naming verification"
  - "deep loop runtime path check"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/008-component-migration/007-system-deep-loop/002-runtime"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/008-component-migration/007-system-deep-loop/002-runtime"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored runtime checklist"
    next_safe_action: "Verify the runtime rename closure"
    blockers: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: System-deep-loop runtime names

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for the runtime child. The report pins candidate SHA, BASE SHA, frozen-map hash, commands, exit codes, six-directory/108-file counts, workspace realpaths, discovery counts, and behavior outcomes. A zero-file or zero-test result is a failure, and verification must leave no unexpected tracked mutation.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] The candidate is on the pinned BASE worktree with the runtime package, test, symlink, and database manifests attached.
- [ ] CHK-002 [P2] The report records BASE SHA, candidate SHA, frozen-map hash, six directory candidates, 108 file candidates, and workspace baseline.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-003 [P1] The change is limited to runtime names and their package/script/test/reference closure; no sibling component migration is included.
- [ ] CHK-004 [P0] `package-lock.json`, `tsconfig.json`, `vitest.config.ts`, state markers, database names, identifiers, keys, Python/package, generated, tool-mandated, and frozen names were not renamed.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-005 [P0] Every runtime candidate has exactly one disposition and all renamed targets pass exact/casefold/NFC collision checks.
- [ ] CHK-006 [P0] Runtime imports/requires, Markdown links, resource maps, script paths, fixtures, package path values, and catalog/playbook indexes resolve.
- [ ] CHK-007 [P0] The isolated worktree resolves the declared package workspace and test discovery with BASE-equivalent realpaths and non-zero counts.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-008 [P1] The old runtime basenames have no active consumer, catalog/playbook leaves remain discoverable, and runtime unit/integration/script checks match BASE.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-009 [P2] Runtime path containment, script allowlists, hook boundaries, database access, and executable/link modes are unchanged except for required path values.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-010 [P2] The runtime candidate map, package realpath evidence, catalog/playbook counts, and protected-name dispositions are recorded in the phase report.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-011 [P1] Runtime renames and reference rewrites are committed as dependency-closed, path-scoped batches with no unrelated files.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

Accept this child only when every P0 item passes, runtime paths and workspace resolution are green, catalog/playbook and test discovery are non-zero and parity-safe, and the final diff is scope-clean.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

The SOL verifier signs off only after the report contains the required receipts and `git diff-index --quiet HEAD --` shows no unexpected tracked mutation after verification.
<!-- /ANCHOR:sign-off -->
