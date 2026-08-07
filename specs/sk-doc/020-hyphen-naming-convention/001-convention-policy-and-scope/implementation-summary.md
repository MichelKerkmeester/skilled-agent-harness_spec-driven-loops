---
title: "Implementation Summary: convention policy and scope (020 phase 001)"
description: "Phase 001 outcome: the canonical kebab-case convention doc is published, 027 is superseded, and the program decisions are recorded."
trigger_phrases:
  - "hyphen naming phase 001 summary"
  - "convention policy summary"
  - "kebab-case canon summary"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/001-convention-policy-and-scope"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/001-convention-policy-and-scope"
    last_updated_at: "2026-07-18T05:35:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Published the canonical convention doc and superseded 027"
    next_safe_action: "Begin phase 002 consumer migration"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-001-policy"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-convention-policy-and-scope |
| **Completed** | 2026-07-18 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The naming migration now has a single authoritative rule. Before this phase there was no written statement that
kebab-case is canonical, the only filename-convention doc mandated the opposite, and the program decisions lived only in
a review transcript. Every later phase now points at one convention doc instead of restating ad-hoc rules.

### The canonical convention doc

`filesystem-naming-convention.md` under `sk-doc/shared/references/` states that kebab-case is the sole in-scope
filesystem-naming form and draws the exemption boundary in full: `.py` files, Python import-package directories,
vendored and third-party trees, generated and lockfile output, tool-mandated filenames, test-runner magic, and frozen
history. It also draws the line the migration must never cross: a filesystem rename never alters a code identifier, a
JSON/YAML/TOML key, or a frontmatter field name, and a frontmatter value changes only when it names a moved path. The
Python-package section explains why `_`→`-` breaks `import`.

### 027 superseded

The catalog/playbook underscore restyle recorded in `027-catalog-naming-convention` (child `003`) is formally
superseded. The 027 spec carries an additive supersession banner pointing here; its completed de-numbering work and its
unrelated hook-bridge child are untouched. Decision `DR-011` records the supersession.

### Program decisions and classification fixtures

The decision record captures the dual-name tolerance, dependency-closure batching, fresh-install, and packet-numbering
decisions with rationale, and adds a Policy Classification Fixtures table proving the class taxonomy is exhaustive and
unambiguous (no "unknown" bucket).

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `sk-doc/shared/references/filesystem-naming-convention.md` | Created | The single canonical kebab-case rule + exemption boundary |
| `sk-doc/shared/references/core_standards.md` | Modified | §2 forward-pointer to the canonical doc; version bump |
| `014-sk-doc-parent/027-catalog-naming-convention/spec.md` | Modified | Additive supersession banner (child 003) |
| `decision-record.md` | Modified | DR-011 supersession + Policy Classification Fixtures + references |
| `implementation-summary.md` | Created | This summary |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The convention doc was authored against the program decision record and the existing `core_standards.md` so the two do
not contradict: `core_standards.md` §2 keeps the classifier's current snake_case behavior and carries a forward pointer,
because flipping the rule text is coupled to the phase-002 classifier change under bounded dual-name tolerance. The
node validates `validate.sh --strict` clean, and the edited 027 parent re-validates clean after a metadata backfill.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep the policy in one new doc, not spread across skills | One canonical source is what REQ-008 asks for; later phases link to it |
| Forward-pointer in `core_standards.md`, not a rule rewrite | The §2 rule is the classifier's spec; flipping it belongs with the phase-002 classifier change to avoid a doc-says-X, code-does-Y gap |
| Satisfy "linked from create-* skills" transitively | The create-* skills already load `core_standards.md`, which now points at the canonical doc; direct generator wiring lands in phase 003 |
| Supersede 027 additively, never delete | The frozen-history rule: mark superseded and point forward; keep the record of how the convention got here |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `validate.sh --strict` on this node | PASS, Errors 0 |
| `validate.sh --strict` on the edited 027 parent | PASS, Errors 0 |
| Convention doc reachable from create-* skills | PASS, via the `core_standards.md` §2 pointer |
| 027 referenced and marked superseded, not deleted | PASS, banner + DR-011; 027 children intact |
| Class taxonomy exhaustive, no unknown bucket | PASS, Policy Classification Fixtures |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **`core_standards.md` §2 still states the snake_case rule.** By design: the rule text and the `validate_document.py` classifier flip together in phase 002 under dual-name tolerance. The forward pointer keeps the two docs non-contradictory in the meantime.
2. **Per-candidate classification over the whole census is not run here.** The taxonomy is proven exhaustive at the policy level; the exhaustive per-candidate map is frozen in phase 006.
3. **Generators do not yet emit or cite the convention.** Direct create-* generator wiring is phase 003; phase 001 provides the doc and the transitive link.
<!-- /ANCHOR:limitations -->

---

<!--
Post-implementation documentation, created after phase 001 completed.
HVR rules: .opencode/skills/sk-doc/shared/references/hvr_rules.md
-->
