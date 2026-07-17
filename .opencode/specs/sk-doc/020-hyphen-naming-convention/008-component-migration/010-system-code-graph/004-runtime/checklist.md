---
title: "Checklist: system-code-graph runtime"
description: "Blocking SOL acceptance contract for the code-graph runtime inventory, conditional path rename, hook/library reference closure, behavior parity, and verified no-op result."
trigger_phrases:
  - "system-code-graph runtime checklist"
  - "code graph runtime path verification"
  - "freshness runtime naming checklist"
importance_tier: "critical"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/010-system-code-graph/004-runtime"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/010-system-code-graph/004-runtime"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored runtime SOL contract"
    next_safe_action: "Run the checklist centrally after runtime phase"
    blockers: []
    key_files:
      - ".opencode/skills/system-code-graph/runtime"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "This authoring pass does not rename runtime paths or run runtime checks."
---

# Checklist: system-code-graph runtime

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for phase 004. Every item is checked against the candidate SHA,
BASE SHA, and rename-map hash. The report records the complete runtime inventory, registration/path consumers,
commands, exit codes, behavior/discovery results, and fails on zero tests or unexpected tracked mutation.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Every runtime source, directory, test, and live consumer is listed with owner and disposition
- [ ] CHK-002 [P0] The current kebab-case runtime baseline and any conditional candidate map are pinned
- [ ] CHK-003 [P2] Cross-phase paths, tool names, hook events, environment keys, and identifiers are separated from filesystem names
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-004 [P1] Changes are limited to runtime filesystem names and live path references
- [ ] CHK-005 [P0] The four current runtime files remain canonical, or any conditional target is explicitly mapped
- [ ] CHK-006 [P0] Hook events, environment keys, TypeScript/CommonJS identifiers, response fields, test IDs, and tool IDs are unchanged
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-007 [P0] The runtime inventory reports zero unclassified in-scope snake_case filesystem names
- [ ] CHK-008 [P0] Every runtime hook/library/test/documentation path resolves to the actual target
- [ ] CHK-009 [P0] Node syntax, freshness behavior, fail-open/timeout checks, and runtime discovery pass with BASE parity
- [ ] CHK-010 [P1] A no-rename result includes zero-candidate evidence; a rename result includes old/new path evidence
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-011 [P0] Every runtime candidate has exactly one rename, exempt, generated, tool-mandated, or already-compliant disposition
- [ ] CHK-012 [P1] All conditional rename candidates and live path consumers are covered by the disposition ledger
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-013 [P0] Fail-open behavior, timeout bounds, path containment, diagnostic safety, and hook trust boundaries are unchanged
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-014 [P1] SKILL, README, ARCHITECTURE, INSTALL_GUIDE, runtime examples, tests, and playbook paths name live runtime files
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-015 [P1] Any conditional rename is path-scoped and no stray implementation summary or scratch directory remains in this leaf
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase passes only when the complete runtime inventory is classified, live paths resolve, behavior matches BASE,
and a proven zero-rename result is accepted when the current tree is already clean.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier confirms the runtime path contract and the candidate diff contains no unrelated
behavior change, including a valid no-op receipt where applicable.
<!-- /ANCHOR:sign-off -->
