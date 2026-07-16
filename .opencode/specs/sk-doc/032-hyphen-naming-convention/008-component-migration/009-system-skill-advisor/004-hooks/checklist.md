---
title: "Checklist: system-skill-advisor hooks"
description: "Blocking SOL acceptance contract for the advisor hook filename inventory, conditional rename, registration closure, and behavior parity."
trigger_phrases:
  - "advisor hooks checklist"
  - "hook registration verification"
  - "prompt submit hook checklist"
importance_tier: "critical"
contextType: "planning"
parent: "sk-doc/032-hyphen-naming-convention/008-component-migration/009-system-skill-advisor/004-hooks"
_memory:
  continuity:
    packet_pointer: "sk-doc/032-hyphen-naming-convention/008-component-migration/009-system-skill-advisor/004-hooks"
    last_updated_at: "2026-07-14T18:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored the hooks SOL verifier contract"
    next_safe_action: "Run the checklist centrally after the hooks phase executes"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/hooks"
      - ".opencode/skills/system-skill-advisor/mcp_server/tests/hooks"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The current hook tree predicts no rename; the checklist requires proof rather than assuming it."
---

# Checklist: system-skill-advisor hooks

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for phase 004. Every item is checked against the candidate SHA,
BASE SHA, and rename-map hash. The report records the complete hook inventory, registration paths, commands, exit
codes, behavior/discovery results, and fails on zero tests or unexpected tracked mutation.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Every advisor hook source and registration is listed with owner and path disposition
- [ ] CHK-002 [P0] The current kebab-case hook baseline and any conditional candidate map are pinned
- [ ] CHK-003 [P2] Cross-skill paths, tool-mandated names, and event identifiers are separated from filesystem names
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-004 [P1] Changes are limited to hook filenames and live path registrations/references
- [ ] CHK-005 [P0] user-prompt-submit.ts and skill-advisor-cli-fallback.ts remain canonical and behaviorally intact
- [ ] CHK-006 [P0] Hook event names, environment keys, TypeScript identifiers, response fields, and tool IDs are unchanged
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-007 [P0] The hook inventory reports zero unclassified in-scope snake_case filenames
- [ ] CHK-008 [P0] Every advisor-owned registration, doc path, plugin bridge path, and test fixture resolves
- [ ] CHK-009 [P0] Hook parity, timeout, fail-open, and prompt-safe output checks pass with BASE-equivalent behavior
- [ ] CHK-010 [P1] A no-rename result includes zero-candidate evidence; a rename result includes old/new path evidence
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-011 [P0] Cross-skill hook references are classified by true owner and are not silently redirected
- [ ] CHK-012 [P1] All conditional rename candidates and registration consumers are covered by the disposition ledger
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-013 [P0] Fail-open behavior, timeout bounds, prompt redaction, and diagnostic safety are unchanged
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-014 [P1] SKILL, README, INSTALL_GUIDE, hook reference, plugin docs, and tests name live advisor paths
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-015 [P1] Any rename is path-scoped and no stray implementation summary or scratch directory remains in this leaf
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase passes only when the complete hook inventory is classified, live registrations resolve, and hook behavior
matches BASE. A proven zero-rename result is a valid outcome.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier confirms the advisor hook path contract and the candidate diff contains no unrelated
runtime behavior change.
<!-- /ANCHOR:sign-off -->
