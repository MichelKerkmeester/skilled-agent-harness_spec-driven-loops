---
title: "Checklist: sk-doc Template Alignment"
description: "QA gate for the trigger_phrases claim fix, topology quote-tolerance, the 12-value test-type taxonomy, the strict package validator, and the P4 lockstep directive-surface manifest (Planned; not yet verified)."
trigger_phrases:
  - "sk-doc template alignment checklist"
  - "lockstep manifest QA gate"
importance_tier: "critical"
contextType: "implementation"
---
# Checklist: sk-doc Template Alignment

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|--------------------|
| **[P0]** | HARD BLOCKER | Cannot claim this child complete until verified |
| **[P1]** | Required | Must verify or state the deferred/gated boundary |
| **[P2]** | Optional | May defer with an explicit reason |

<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Authoritative evidence (`review-v1.md` §4, `synthesis-v1.md` §2.7/§6, `verification-v1.md`) was read before authoring this plan.
  - **Evidence**: citations in `spec.md`; ±2–10-line drift acknowledged, to be re-anchored on the symbol at build time.
- [ ] CHK-002 [P0] All planned writes stay inside this child's real target files; no edit to the frozen scorer trio is planned.
  - **Evidence**: `spec.md` Files to Change table lists only template/validator/manifest/test targets.
- [ ] CHK-003 [P1] `.opencode/skills/sk-doc/scripts/validate_document.py`'s symlink relationship to `shared/scripts/validate_document.py` is confirmed before editing.
  - **Evidence**: `ls -la` confirms the symlink; only the shared copy is edited.

<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `validate_catalog_package.py` has zero new external dependencies beyond the Python standard library and existing sk-doc validator conventions.
- [ ] CHK-011 [P0] The topology validator's quote-tolerance change does not alter parsed output for any previously-passing unquoted fixture.
- [ ] CHK-012 [P1] `compiled-routing-lockstep-surfaces.json` follows a documented, versioned schema (not an ad hoc shape).

<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] The strict package validator's bijection check has both a positive fixture (clean 7-hub set) and a negative fixture (seeded orphan).
- [ ] CHK-021 [P0] The lockstep-parity test fails by naming the specific drifted surface, not a generic diff.
- [ ] CHK-022 [P0] The 12-value taxonomy has zero unmapped stragglers against the fresh corpus census.
- [ ] CHK-023 [P1] The harvester-extension invariance test (if shipped) proves zero score/rank change for existing harvested docs.

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-030 [P0] No sk-doc catalog template claims trigger_phrases drives routing unless the harvester extension (REQ-006) has actually shipped.
- [ ] CHK-031 [P0] The topology validator accepts quoted and unquoted typed-gold fixtures identically.
- [ ] CHK-032 [P0] The strict package validator and the lockstep manifest are both present and internally consistent with the live corpus at completion time.

<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-040 [P0] No live routing file, manifest, or `selectedPolicy` is touched by any change in this child.
- [ ] CHK-041 [P0] The shared benchmark scorer is untouched; digests unchanged pre/post.
- [ ] CHK-042 [P1] No network, package install, credential, or dynamic-code surface is introduced by `validate_catalog_package.py` or the new test.

<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-050 [P0] Spec, plan, tasks, checklist, and summary agree on Planned status and the P0/P1 requirement split.
- [ ] CHK-051 [P1] No file in this packet claims work is done that has not been done; every Planned item stays unchecked.
- [ ] CHK-052 [P0] Strict Level-2 packet validation passes on this phase folder.

<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-060 [P0] All five spec docs for this child live under `009-sk-doc-template-alignment/`; nothing was written outside it (or outside the sibling `008`/`010` folders in this same authoring pass).
- [ ] CHK-061 [P1] Real implementation targets (`feature-catalog-snippet-template.md`, `validate_document.py`, etc.) are named by their actual repo path, not an invented path.

<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 0/13 (Planned) |
| P1 Items | 7 | 0/7 (Planned) |
| P2 Items | 0 | 0/0 |

**Verification Date**: Not yet started — Status: Planned.
**Verification Scope**: This checklist covers the trigger_phrases claim fix, the topology quote-tolerance fix, the 12-value test-type taxonomy, the strict package validator, and the P4 lockstep directive-surface manifest with its parity test.
**Completion Boundary**: No item is claimed verified in this planning pass; this checklist becomes actionable once implementation starts.

<!-- /ANCHOR:summary -->
