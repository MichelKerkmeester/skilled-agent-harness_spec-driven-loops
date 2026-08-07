---
title: "Checklist: system-skill-advisor subtree skill gate"
description: "Blocking SOL rollup contract for sibling evidence aggregation, scope-aware naming/reference checks, runtime/documentation parity, and the no-new-migration gate."
trigger_phrases:
  - "system-skill-advisor gate checklist"
  - "subtree rollup verification"
  - "advisor naming gate"
importance_tier: "critical"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/009-system-skill-advisor/008-skill-gate"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/009-system-skill-advisor/008-skill-gate"
    last_updated_at: "2026-07-14T18:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored the subtree-gate SOL verifier contract"
    next_safe_action: "Run the rollup centrally after all sibling phases produce receipts"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor"
      - ".opencode/specs/sk-doc/020-hyphen-naming-convention/008-component-migration/009-system-skill-advisor"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "This authoring pass does not run the naming gate or perform migration work."
---

# Checklist: system-skill-advisor subtree skill gate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for phase 008. The report pins every sibling candidate SHA, BASE
SHA, map hash, command, exit code, discovery count, aggregate classification ledger, and final scope-aware scan. It
fails on any missing receipt, unknown disposition, zero scenario/test result, or unexpected tracked mutation.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Sibling phases 001–007 contain required L2 docs, checklists, and declared decision records
- [ ] CHK-002 [P0] Every sibling P0 receipt includes candidate SHA, BASE SHA, map hash, commands, exit codes, and counts
- [ ] CHK-003 [P2] Exemption, generated, tool-mandated, Python, frozen-history, and intentional-mention rules are loaded
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-004 [P0] The aggregate ledger has no unknown classification across package, scripts, references, hooks, catalog, playbook, and release surfaces
- [ ] CHK-005 [P1] The rollup performs no new rename, source edit, changelog authoring, or exemption change
- [ ] CHK-006 [P1] Remaining old strings are distinguished as identifiers/keys/history/non-path prose versus live path debt
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-007 [P0] Every sibling P0 checklist passes and no sibling reports an unresolved candidate
- [ ] CHK-008 [P0] The scope-aware filesystem scan reports zero in-scope snake_case names outside approved exemptions
- [ ] CHK-009 [P0] The live old-path scan and whole-surface link/reference checks report no blocking target
- [ ] CHK-010 [P0] Package/launcher, scripts, hooks, catalog, playbook, and release/version checks retain BASE parity
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-011 [P0] The aggregate ledger covers every underscore-bearing path and every live consumer hit in the advisor subtree
- [ ] CHK-012 [P1] Candidate/BASE/map receipts and sibling handoffs are cross-consistent
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-013 [P1] The scope-aware gate preserves Python/tool/generated/lockfile/frozen boundaries and does not broaden roots
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-014 [P1] Parent map, sibling docs, final gate report, changelog entry, and version metadata are mutually consistent
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-015 [P1] Every assigned leaf lacks stray implementation-summary.md and scratch/ artifacts; the rollup changes evidence only
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The subtree passes only when all sibling P0 contracts, aggregate classifications, scope-aware naming/reference scans,
runtime/documentation parity checks, and release evidence are green with pinned receipts.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier confirms the whole system-skill-advisor naming surface is clean within the program
exemption boundary and the rollup diff contains no new migration work.
<!-- /ANCHOR:sign-off -->
