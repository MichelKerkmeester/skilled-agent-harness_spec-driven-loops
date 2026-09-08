---
title: "Implementation Summary"
description: "Two unread manifest fields and two hidden scaffold marker blocks are gone; the one marker that was secretly load-bearing is replaced by real protocol subsections in the Level 3+ plan template."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/032-recorded-findings-closure/010-manifest-dead-fields-and-coaching-markers"
    last_updated_at: "2026-09-07T15:05:51Z"
    last_updated_by: "template-author"
    recent_action: "Closed the packet with every gate observed green"
    next_safe_action: "Implement child 011"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:fe7dab172e836d0272f579280f99ff26156d829fe04f0ec16de49ee54f4b3828"
      session_id: "scaffold-010-manifest-dead-fields-and-coaching-markers"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 010-manifest-dead-fields-and-coaching-markers |
| **Completed** | Not started |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The manifest's document index carried two fields nothing read, `creationTrigger` and `absenceBehavior`, and the scaffolder appended two hidden comment blocks to every new packet. The fields are gone from all 18 entries and the guide no longer tells a maintainer to set them. The spec.md block was dead and is simply gone. The plan.md block was not: the AI protocols rule greps plan.md for four component names, and the comment block was what made a fresh Level 3+ scaffold pass. That block is gone too, and the Level 3+ plan template now carries the four components as real subsections, so a fresh scaffold passes because the skeleton is there for an author to fill.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `templates/spec-kit-docs.json` | Modified | 36 dead fields removed from 18 document entries |
| `runtime/cli/spec/create.sh` | Modified | Both marker append blocks removed |
| `templates/core/plan.md.tmpl` | Modified | Pre-Task Checklist, Execution Rules, Status Reporting Format and Blocked Task Protocol under the Level 3+ AI EXECUTION FRAMEWORK |
| `templates/EXTENSION-GUIDE.md` | Modified | The two field descriptions removed |
| `runtime/cli/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap` | Modified | Level 3+ plan snapshot refreshed |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Before any edit, a Level 3 scaffold was created in the specs tree, its two comment blocks stripped by hand, and the folder validated: the spec block changed nothing, the plan block turned the AI protocol rule from pass to warn. After the removal a Level 3+ probe failed strict on that rule, which is when the template gained the four components. Both probes then passed strict, the goldens were refreshed, and the six template and scaffold suites plus the full CLI project ran green.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Carry the protocol components in the template instead of keeping the marker | A rule satisfied by a hidden comment proves nothing; a skeleton the author fills is what the rule was written to find |
| Leave Level 3 warning | The section is a 3+ surface by design and a warning is advice, not a gate |
| Remove the spec block without a replacement | Nothing reads it and complexity stays consistent without it |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Residue grep for the four names over `.opencode` | none outside git history |
| Fresh Level 3 and Level 3+ scaffolds `validate.sh --strict` | both PASSED; 3+ reports `AI_PROTOCOLS` 4/4 |
| Marker strings in fresh scaffold spec.md and plan.md | 0 |
| Scaffold goldens, version parity, level-contract resolver, template-structure, review-record, registry coverage | 6 files, 37 tests pass |
| Full CLI project after the snapshot refresh | 140 files and 1,358 tests pass |
| `validate.sh <this child> --strict` | RESULT: PASSED |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Level 3 scaffolds warn on the AI protocol rule.** The components live in the 3+ section only; the marker had hidden that warning.
2. **Packets scaffolded before this change still carry the blocks.** They are inert comments in existing documents and were not swept.
<!-- /ANCHOR:limitations -->

---

