---
title: "Checklist: align the playbook generator + confirm convention docs"
description: "Verification checklist for the generator-alignment pass."
importance_tier: "important"
contextType: "implementation"
parent: "sk-doc/014-sk-doc-parent/026-deprecate-numbered-snippet-filenames"
_memory:
  continuity:
    packet_pointer: "sk-doc/014-sk-doc-parent/026-deprecate-numbered-snippet-filenames/002-generator-alignment"
    last_updated_at: "2026-07-11T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Phase checklist authored"
    next_safe_action: "Implement the generator fix (playbook-generator.cjs id/filename derivation)"
    blockers: []
    completion_pct: 0
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
- [ ] Enumerated every `AG-NNN` id/filename use site in `playbook-generator.cjs` (not just the two known line
      numbers).
- [ ] Baseline grep of the convention docs, templates, and `/create:*` generators for numbered per-feature
      filename mandates recorded.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality
- [ ] Slug derivation is deterministic and readable; no leftover ordinal-based logic in the id/filename path.
- [ ] The `stage:` field addition does not disturb the existing `id:` identity semantics.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing
- [ ] Generator dry-run produces slug filenames (evidence: sample output listing).
- [ ] Generator output loads cleanly through the number-agnostic benchmark loader (evidence: load run,
      error-free).
- [ ] Grep: zero surviving numbered per-feature mandate/example in the verified/edited convention surfaces.
- [ ] `validate.sh --strict` Errors 0 on this phase folder.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness
- [ ] `playbook-generator.cjs` confirmed as the only code emitter of `AG-NNN` filenames, now fixed; no other
      generator found emitting the anti-pattern.
- [ ] Convention docs, templates, and `/create:*` generators confirmed already compliant, or fixed if a gap was
      found.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security
- [ ] No executable/config behavior changed beyond the id/filename derivation; no new file-system write outside
      the existing staging directory.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation
- [ ] The `stage:` field is documented as optional, default `routing`, consistent with the parent packet's
      decision record.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization
- [ ] Edits confined to `playbook-generator.cjs` and, only if a gap was found, the affected sk-doc convention
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
