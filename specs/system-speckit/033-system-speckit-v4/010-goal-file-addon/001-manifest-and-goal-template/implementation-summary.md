---
title: "Implementation Summary: Manifest Entry and Goal Template"
description: "The goal document entered the Level contract as a lazy add-on and its gated template shipped, so a packet can now scaffold a durable directive with a binding block and a separated log."
trigger_phrases:
  - "goal manifest entry"
  - "goal template shipped"
  - "lazy add-on goal"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/010-goal-file-addon/001-manifest-and-goal-template"
    last_updated_at: "2026-08-30T04:17:55Z"
    last_updated_by: "claude-code"
    recent_action: "Shipped the contract entry, the gated template and the document-to-template mapping"
    next_safe_action: "Build the shape validator in the next phase"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/templates/addons/goal.md.tmpl"
    session_dedup:
      fingerprint: "sha256:af0c94d41efcd41e3f030766b0b1aab265e8236532c40ed20ad447b3879a23eb"
      session_id: "2026-08-29-042-001-manifest-and-goal-template"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-manifest-and-goal-template |
| **Completed** | 2026-08-29 |
| **Level** | 2 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A packet can now carry a goal document, and the documentation-level contract knows what one is. Before this, a packet that wanted a durable directive had to invent both the file and its conventions; the last packet that tried reached 15,028 bytes with no separation between the directive an operator sets and the log that accumulates underneath it.

### The goal document

The template renders at Levels 1, 2, 3, 3+ and phase, and at no other level. It separates a durable directive from a volatile log by heading, so a later rule can measure one without the other. A phase-parent rendering additionally carries a binding block naming each child's goal document, its precedence rule, and the reminder that only the parent's completion criteria decide whether the packet is done.

The document is a lazy add-on rather than an optional one. That is not a stylistic choice: the structure validator's document collector spreads the required, lifecycle and lazy buckets and skips the optional bucket except for two hardcoded names. An optional entry would have needed a third hardcoded branch to be seen at all.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `templates/addons/goal.md.tmpl` | Created | The gated document, with the binding block scoped to phase parents |
| `templates/spec-kit-docs.json` | Modified | Document entry, version, section gates, lazy listing at five levels |
| `scripts/utils/template-structure.js` | Modified | Document-to-template mapping, without which drift is undetectable |
| `scripts/tests/level-contract-resolver.vitest.ts` | Modified | Lazy-bucket expectations, with review left unchanged |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The template was rendered at every level and the counts recorded before anything else was wired. The contract entry followed, then the mapping, then a resolver probe at each level. The document was then authored into this packet's own parent, which is a phase parent, so the binding block was exercised on a real four-phase map rather than on a fixture.

Two things surfaced only because of that dogfooding. The document needed a continuity block like every other spec document, which the template now carries. And the durable slice came out at 2,371 characters against the 2,000 the research proposed, which is recorded as an open question for the phase that will enforce it.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Lazy add-on, not optional | The document collector walks lazy and skips optional except two hardcoded names |
| Binding block gated to phase parents | A leaf packet has no children to bind, so the block would be noise |
| Review level excluded | A review record has no phases and no directive to carry |
| Template prose kept terse | The template's own instructional text counts against the durable budget an author has to work within |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Per-level render | PASS - 53 lines at Levels 1, 2, 3 and 3+, 68 at phase, 0 at review |
| Binding block scoping | PASS - present once at phase, absent at Level 2 |
| Template resolution | PASS - a path at the five carrying levels, null at review |
| Required document sets | PASS - unchanged at every level |
| Existing packets without the document | PASS - two sampled packets validate exactly as before |
| Contract resolver suite | PASS - 7 passed |
| Validation system suite | PASS - 114 passed, 0 failed |
| Closure gate on this phase | PASS - 5/5 criteria met, packet closeable |
| Recursive strict validation | PASS - exit 0, five folders, 0 errors and 0 warnings |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The durable budget is unenforced and possibly too tight.** The template's own instructional prose occupies 1,276 characters at phase level, leaving roughly 724 for an author under a 2,000-character budget. The parent authored here needed trimming to fit. The phase that builds the rule must decide whether the budget measures the whole durable slice or only authored content.
2. **Nothing yet checks the document's shape.** A malformed goal document renders and validates today; that gate is the next phase.
3. **Four golden snapshots are failing for an unrelated reason.** Another session changed the specification templates without regenerating them; the failures reproduce with this work stashed and are not caused by it.
<!-- /ANCHOR:limitations -->

---
