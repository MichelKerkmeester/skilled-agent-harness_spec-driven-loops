---
title: "Checklist: hoisted shared script closures (032 phase 007 child 003)"
description: "Blocking SOL verifier contract for the multi-skill shared-script closure: consumer ownership, semantic targets, lockstep references, exemption protection, syntax/discovery checks, and downstream handoff."
trigger_phrases:
  - "shared script closure checklist"
  - "hoisted script verifier"
  - "phase 007 child 003 checklist"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/007-shared-and-cross-cutting-closures/003-hoisted-shared-script-closures"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/007-shared-and-cross-cutting-closures/003-hoisted-shared-script-closures"
    last_updated_at: "2026-07-14T17:28:55Z"
    last_updated_by: "codex"
    recent_action: "Authored the shared-script SOL verifier contract"
    next_safe_action: "Run the checklist against the candidate shared-script closure commit"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/shared/scripts/"
      - ".opencode/skills/sk-doc/scripts/"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The verifier must distinguish non-exempt shared scripts from Python and one-skill exemptions"
---
# Checklist: Hoisted Shared Script Closures

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for child 003. The verifier pins candidate SHA, BASE SHA, and map hash; records script, consumer, syntax, discovery, and reference counts with command exit codes; and fails on a zero-file/zero-consumer scan, an unresolved dynamic site, or unexpected tracked mutation.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] BASE, candidate worktree, phase 005 tooling receipt, and phase 006 map hash are recorded
- [ ] CHK-002 [P0] Shared script roots, façade paths, and consumer skill subtrees are enumerated with non-zero scan evidence
- [ ] CHK-003 [P1] Python/package, tool-mandated, generated, lockfile, frozen, and one-skill delegations are classified before execution
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-004 [P0] Every selected script has at least two skill consumers or an explicit delegated disposition
- [ ] CHK-005 [P1] Every renamed script has one semantic target and no code identifier, data key, or frontmatter field was changed
- [ ] CHK-006 [P1] Symlink façades and dynamic consumers are recorded for child 002 or the appropriate owning phase
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-007 [P0] Exact, case-folded, and NFC-normalized collision checks pass for every shared-script target
- [ ] CHK-008 [P0] Imports, `require`, shell `source`, registries, fixtures, and test commands resolve to the new path with zero stale source references
- [ ] CHK-009 [P0] A dynamic consumer disposition exists for every site the static checker cannot resolve
- [ ] CHK-010 [P0] Affected non-Python scripts pass `node --check` or `bash -n`, and test/discovery counts match the pinned baseline
- [ ] CHK-011 [P0] Python `.py` names, Python package directories, tool-mandated names, generated/lockfile output, and frozen surfaces remain unchanged
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-012 [P1] The closure manifest records script owner, consumers, source/target, mode, evidence, and downstream dependency
- [ ] CHK-013 [P1] Every one-skill script is explicitly handed to its phase 008 owner; none is silently absorbed here
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-014 [P2] No executable authority, shell source boundary, sandbox setting, or command allowlist changed beyond the approved script path closure
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-015 [P2] The consumer graph, dynamic-site dispositions, and downstream handoff are linked from the phase evidence
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-016 [P1] Script names and all consumers land in dependency-closed, path-scoped commits with no partial façade update
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The child passes only when every P0 check is green, every selected script has a complete multi-skill closure, syntax and discovery evidence is non-zero and green, all exemptions are preserved, and phase 008 handoffs are explicit.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier confirms the shared-script closure and `git diff-index --quiet HEAD --` shows no unexpected tracked mutation after verification.
<!-- /ANCHOR:sign-off -->
