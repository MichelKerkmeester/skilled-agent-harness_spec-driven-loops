---
title: "Checklist: align the playbook generator + confirm convention docs"
description: "Verification checklist for the generator-alignment pass."
importance_tier: "important"
contextType: "implementation"
parent: "sk-doc/015-sk-doc-parent/027-catalog-naming-convention/002-deprecate-numbered-snippet-filenames"
_memory:
  continuity:
    packet_pointer: "sk-doc/015-sk-doc-parent/027-catalog-naming-convention/002-deprecate-numbered-snippet-filenames/002-generator-alignment"
    last_updated_at: "2026-07-11T17:41:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Generator slug-filename alignment shipped"
    next_safe_action: "Complete"
    blockers: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Checklist: Align the Playbook Generator + Confirm Convention Docs

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol
Every item carries a grep, dry-run, or fresh-reader evidence line.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
- [x] CHK-001 [P0] Enumerated every `AG-NNN` id/filename use site in `playbook-generator.cjs` (not just the two known line
      numbers).
- [x] CHK-002 [P0] Baseline grep of the convention docs, templates, and `/create:*` generators for numbered per-feature
      filename mandates recorded.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality
- [x] CHK-003 [P0] Slug derivation in `playbook-generator.cjs` is deterministic and readable; no leftover ordinal-based logic
      in the id/filename path.
- [x] CHK-004 [P0] The `stage:` field addition does not disturb the existing `id:` identity semantics.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing
- [x] CHK-005 [P0] Generator dry-run (`node playbook-generator.cjs`) produces slug filenames (sample output listing).
- [x] CHK-006 [P0] Generator output loads cleanly through the number-agnostic `load-playbook-scenarios.cjs` loader (load run,
      error-free).
- [x] CHK-007 [P0] `rg '^[0-9]{3}-'` over the verified/edited convention surfaces: zero surviving numbered per-feature
      mandate/example.
- [x] CHK-008 [P0] `validate.sh --strict` Errors 0 on this phase folder.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness
- [x] CHK-009 [P0] `playbook-generator.cjs` confirmed as the only code emitter of `AG-NNN` filenames, now fixed; no other
      generator found emitting the anti-pattern.
- [x] CHK-010 [P0] Convention docs, templates, and `/create:*` generators confirmed already compliant, or fixed if a gap was
      found.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security
- [x] CHK-011 [P0] No executable/config behavior changed beyond the id/filename derivation in `playbook-generator.cjs`; no
      new file-system write outside the existing staging directory.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation
- [x] CHK-012 [P1] The `stage:` field is documented as optional, default `routing`, consistent with the parent packet's
      decision record.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization
- [x] CHK-013 [P1] Edits confined to `playbook-generator.cjs` and, only if a gap was found, the affected sk-doc convention
      SKILL.md / template / generator file(s).
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary
Generator emits slug filenames only (with optional `stage:`); convention docs, templates, and `/create:*`
generators confirmed (or corrected) to already forbid numbered per-feature filenames; grep clean; validate
--strict Errors 0.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off
Generator alignment complete; safe for the execute-migration phase to rename the existing 111 files without a
live generator reintroducing the numbered-filename anti-pattern.
<!-- /ANCHOR:sign-off -->
