---
title: "Implementation Summary: Fingerprint Docset Enforcement"
description: "The drift gate was inert on nine packets in ten. One repository-wide refresh and one rule change make it compare everything that carries a digest."
trigger_phrases:
  - "implementation"
  - "summary"
  - "template"
  - "impl summary core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/036-spec-doc-template-reduction/012-fingerprint-docset-enforcement"
    last_updated_at: "2026-08-30T13:58:21Z"
    last_updated_by: "template-author"
    recent_action: "Refreshed the fleet and made the marker mandatory beside a digest"
    next_safe_action: "None; the packet is complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-012-fingerprint-docset-enforcement"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Status** | Complete |
| **Level** | 2 |
| **Date** | 2026-08-30 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The generation marker shipped optional, and the integrity rule skipped whenever it was absent.
That was almost always: 3,844 packets carried a digest and 355 carried a marker, so the drift
gate did nothing on nine packets in ten. Deleting the field reached the same silence and stayed
within the schema, which made it a suppression vector as well as a gap.

Two changes. A repository-wide refresh re-derived every packet, which both stamps the marker and
brings each digest back into agreement with its documents — 3,595 of 3,621 folders changed, none
failed. The integrity rule then reports `SOURCE_FINGERPRINT_DOCSET_MISSING` for a digest that
names no document set, so the gate is live everywhere and cannot be switched off by removing a
key.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Migration first, rule second. The rule rejects a combination that 3,496 packets were in, so
landing it first would have failed the repository at once.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

**The plan was reversed after measuring it.** This packet specified a stamp-only migration so the
hidden drift would surface. At a 50% drift rate that meant roughly 1,750 blocking failures whose
only remediation is the refresh stamping was avoiding. See the decision record.

**Enforcement lives in the integrity rule, not the schema.** A schema failure would say a
document is malformed. The rule says which property is missing and why it matters.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Fleet refresh | 3,621 folders, 3,595 changed, 9 created, 0 failed |
| Marker coverage | 3,861 packets carry a digest, 3,621 carry a marker |
| The 240 remainder | Track roots and archived folders; measured to validate PASSED, unaffected by the rule |
| `scripts/tests/fingerprint-docset-generation.sh` | 7/7, including the inverted absent-marker case |
| Packet sample under `--strict` | 6/6 PASSED, 0 occurrences of the new violation |
| Surrounding suites | ac-coverage 16/16, ac-closure 29/29, containment 8/8, symlink-refusal 7/7 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The pre-existing drift was absorbed, not reviewed.** Deliberate, measured, and recorded in the decision record.
2. **240 files carry a digest without a marker.** They are track roots and archived folders that the walk does not treat as packets, and the rule does not reach them either. If either ever becomes a validated packet, it will need a refresh first.
3. **`system-deep-loop/037-graph-engineering` fails validation** on a missing template-source header. Pre-existing and unrelated: the refresh writes only graph metadata.
<!-- /ANCHOR:limitations -->
