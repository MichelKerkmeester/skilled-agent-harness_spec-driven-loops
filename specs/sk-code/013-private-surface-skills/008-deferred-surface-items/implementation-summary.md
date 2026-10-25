---
title: "Implementation Summary"
description: "The skill-root metadata gate now rejects a broken external surface_detection block, and the two private surface skills declare blocks that rank them ahead of SKILLED. The overlay and allowlist items are in progress."
trigger_phrases:
  - "deferred surface items implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/013-private-surface-skills/008-deferred-surface-items"
    last_updated_at: "2026-10-25T20:36:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Field validation and the private blocks done"
    next_safe_action: "Finish the overlay and allowlist items, then T009 and T010"
    blockers: []
    key_files:
      - "spec.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-10-25-013-008-deferred-surface-items"
      parent_session_id: null
    completion_pct: 50
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.3 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 008-deferred-surface-items |
| **Completed** | In progress, started 2026-10-25 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A skill that an adopting repository adds to the sk-code family can no longer ship a broken `surface_detection` block unnoticed. The metadata gate now fails it at commit and CI time. Before, the gate accepted the block and every detection reader silently ignored it.

### Phase 8: deferred-surface-items

The gate checks four rules on an external block: a label that is not blank, the role `specific`, at least one marker array, and markers that are all non-blank strings. The operator's two private surface skills now declare blocks too, so a request that touches their stack and a hub file leads with their surface and keeps SKILLED as second evidence.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs` | Modified | The four field rules, one finding per broken rule |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/skill-root-metadata-contract.test.cjs` | Modified | Six new tests covering each rule, a valid block and the absent key |
| `.skilled/skills/sk-code/shared/references/stack-detection.md` | Modified | Section 2 states the rules and the `local-*` skip |
| `local-webflow/graph-metadata.json`, `local-obsidian/graph-metadata.json` | Modified (private, untracked here) | One specific block each |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The contract test file ran before and after the change, and its new cases fail against the old check. The gate then ran in the form `routing-registry-drift.yml` uses. The private blocks were backed up first and checked with the two detection readers in the main checkout.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Reuse `GRAPH_METADATA_INVALID_SURFACE_DETECTION` with a message per rule | The gate already reuses one code for several causes, and a reader learns which rule broke from the message |
| A marker made only of whitespace fails | A blank marker would match nearly every path or request and make its surface lead everywhere |
| Leave the gate's `local-*` skip alone | Every tracked-output writer skips `local-*` by the packet's D5, so the rules protect the skills an adopting repository adds |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Contract test file | PASS, 40 of 40, exit 0 (34 of 34 before) |
| Gate in its CI form | PASS, `checked=14 passed=14 failed=0`, exit 0 |
| Leaf manifest and derived freshness | PASS, `checked=14 fresh=14`, exit 0 each |
| Detection readers on the private blocks | PASS, each surface leads SKILLED for a mixed request, exit 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A subfolder workspace gets no surface hint.** A path marker matches a workspace that holds it or sits inside it, so a session opened below the marker's folder gets no hint. Request text that names a marker still routes. Start the session at the repository root.
<!-- /ANCHOR:limitations -->

---
