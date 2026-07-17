---
title: "Checklist: system-deep-loop skill gate (032 phase 007/011)"
description: "Blocking SOL rollup contract for sibling completion, whole-subtree kebab-case cleanliness, exemption handling, and behavior evidence."
trigger_phrases:
  - "system-deep-loop skill gate checklist"
  - "deep loop subtree rollup gate"
  - "system-deep-loop naming gate"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/007-system-deep-loop/011-skill-gate"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/007-system-deep-loop/011-skill-gate"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored skill gate checklist"
    next_safe_action: "Run subtree rollup verification"
    blockers: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: System-deep-loop skill gate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL rollup contract for the system-deep-loop subtree. It does not add migration work. The report pins the candidate SHA, BASE SHA, frozen-map hash, commands, exit codes, all sibling phase reports, the whole subtree inventory, and the exemption set. Verification must leave no unexpected tracked mutation.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Phases 001–010 are attached with their required docs, reports, and status evidence; no sibling is silently skipped.
- [ ] CHK-002 [P2] The report records BASE SHA, candidate SHA, frozen-map hash, whole-subtree path inventory, protected names, and the governing exemption set.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-003 [P1] This gate performs no rename, reference repair, code change, changelog edit, or source-surface cleanup.
- [ ] CHK-004 [P0] The gate distinguishes in-scope filesystem names from Python .py files/package directories and tool-mandated names, and does not classify embedded identifiers as filesystem findings.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-005 [P0] Every sibling phase has a passing evidence row covering its candidate map, reference closure, behavior checks, and scope-clean diff.
- [ ] CHK-006 [P0] A whole-tree scan finds no remaining in-scope snake_case filesystem name outside the approved exemption set; every finding has an owner or an explicit gate failure.
- [ ] CHK-007 [P0] References, links, registries, scenario paths, benchmark paths, and report paths resolve across the complete subtree, with non-trivial behavior/parity evidence.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-008 [P1] Any failed sibling, stale basename, unresolved path, collision, or exemption ambiguity is recorded with its owning phase and blocks sign-off; the gate does not repair it.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-009 [P2] The rollup is read-only and confirms that path containment, state/artifact boundaries, tool permissions, and protected names remain intact across the subtree.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-010 [P2] The sibling evidence matrix, whole-tree scan output, exemption decisions, unresolved findings, and final rollup verdict are recorded in the phase report and packet docs.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-011 [P1] The gate diff contains only its authored rollup documentation; no sibling phase file or system-deep-loop source file is modified by this phase.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

Accept this child only when every sibling passes, the whole subtree is kebab-clean outside the exemption set, all references and behavior checks are green, and no gate-owned mutation occurred.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

The SOL verifier signs off only after the report contains the required receipts and git diff-index --quiet HEAD -- shows no unexpected tracked mutation after verification.
<!-- /ANCHOR:sign-off -->
