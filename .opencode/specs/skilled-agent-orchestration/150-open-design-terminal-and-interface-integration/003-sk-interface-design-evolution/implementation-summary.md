---
title: "Implementation Summary: sk-interface-design evolution"
description: "De-vendored sk-interface-design from the MIT ui-ux-pro-max repo to an Apache-2.0-only v1.1.0 (data first, MIT notices second, Apache base kept) and wired the Open Design integration through the live-read-only claude_design_parity.md loop. Shipped as commit b12ffd3d76."
trigger_phrases:
  - "sk-interface-design de-vendor summary"
  - "ui-ux-pro-max removal outcome"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/150-open-design-terminal-and-interface-integration/003-sk-interface-design-evolution"
    last_updated_at: "2026-06-14T16:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "sk-interface-design v1.1.0 shipped in commit b12ffd3d76, record authored"
    next_safe_action: "Operator reviews the record, then phase 004 validation follows"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:22ea1a3c0821c518cff9fe87646e86858474d9b7392561fb62e4cef587fc52e1"
      session_id: "session-150-003-sk-interface-design-evolution"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | skilled-agent-orchestration/150-open-design-terminal-and-interface-integration/003-sk-interface-design-evolution |
| **Completed** | 2026-06-14 |
| **Level** | 2 |
| **Commit** | `b12ffd3d76` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This packet records the de-vendoring of `sk-interface-design` from the MIT `ui-ux-pro-max` repo to an Apache-2.0-only v1.1.0 and the wiring of its Open Design integration. It shipped as commit `b12ffd3d76` (thirty files, mostly removals) and the deliverable lives at `.opencode/skills/sk-interface-design/`. This is a retroactive record of completed work and does not re-do the de-vendor or edit the skill.

### The ordered de-vendor
The licensing cleanup ran in the legally safe order. The MIT-derived data went first: the nine CSV inventories (colors, typography, products, ui-reasoning, ux-guidelines, charts, styles, landing, app-interface), the data README, and the two `design_search` scripts that queried them. The MIT notices came second: `LICENSE-ui-ux-pro-max.txt` and `THIRD-PARTY-NOTICES.md`. Removing the derived data before its attribution keeps the cleanup ordered, so no derived data was ever left in the tree without its notice.

### The kept Apache base
The Apache-2.0 base stayed. `LICENSE.txt` and the verbatim Apache-2.0 Anthropic `design_principles.md` were retained, and the skill is now licensed Apache-2.0 only (`license: Apache-2.0; see LICENSE.txt`). `LICENSE.txt` must stay because `design_principles.md` is verbatim Apache content that carries its terms.

### The Open Design integration
The integration was wired through the shared `claude_design_parity.md` loop, the seam between this judgment skill, `mcp-magicpath`, and `mcp-open-design`. The loop grounds design work on a real design system: for an installed Open Design app it reads a matching system live via `mcp-open-design` (`get_file`/`search_files`, or `od tools design-systems read`), reusing the system's `tokens.css` tokens and `components.html` components before authoring net-new. That content is read live and never copied into the repo, so no new license attaches. `design_inventory.md` was reframed to match.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `assets/data/*.csv` (nine files) | Removed | The MIT-derived data inventory, deleted first |
| `assets/data/README.md` | Removed | The vendored data README |
| `scripts/design_search.py`, `scripts/design_search_core.py` | Removed | The scripts that queried the vendored data |
| `LICENSE-ui-ux-pro-max.txt` | Removed | The MIT notice, removed after the data |
| `THIRD-PARTY-NOTICES.md` | Removed | The MIT third-party notices, removed after the data |
| `references/claude_design_parity.md` | Modified | Open Design live-read integration through the parity loop |
| `references/design_inventory.md` | Modified | Reframed around live Open Design systems |
| `SKILL.md` | Modified | Apache-2.0 only, Open Design grounding, version 1.1.0 |
| `feature_catalog/` (grounding section) | Modified | Open Design live-read grounding replaces the data-search feature |
| `manual_testing_playbook/` (licensing, grounding) | Modified | Licensing-integrity and grounding scenarios reframed |
| `changelog/v1.1.0.0.md` | Created | De-vendor and integration changelog |
| `graph-metadata.json` | Modified | Topics, edges, source docs |
| `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, this file | Created | Packet control docs (this retroactive record) |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

An ordered de-vendor followed by a shared-loop integration. The phase 001 research fixed the sequence (data first, MIT notices second, keep the Apache base) and the integration contract. The MIT-derived data and scripts were deleted first, then the MIT notices, leaving the Apache-2.0 base intact. The grounding was reframed around live Open Design reads through `claude_design_parity.md`, with `design_inventory.md` updated to match, and the skill was bumped to v1.1.0 with a changelog. It shipped as commit `b12ffd3d76`. A later deep review (recorded in phase 004) found and fixed stale MIT-attribution wording in the playbook index. The shipped license state was Apache-2.0 only throughout.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Delete the MIT-derived data before the MIT notices | The legally ordered sequence never leaves derived data in the tree without its attribution |
| Keep `LICENSE.txt` and `design_principles.md` | They are verbatim Apache-2.0 Anthropic content, so the license file carries their terms |
| Ground on live Open Design reads, never cached | Reading live via `mcp-open-design` means no Open Design content is copied into the repo and no new license attaches |
| Route the integration through `claude_design_parity.md` | The shared loop is the existing seam between the judgment skill and the transport skills |
| Replace the data-search feature with live grounding | The vendored inventory was both a license liability and the templated default the skill resists |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `package_skill.py --check` | PASS, skill valid |
| Licensing grep | PASS, no MIT-derived data, script, or notice residue |
| Apache base retained | PASS, `LICENSE.txt` and `design_principles.md` kept, skill is Apache-2.0 only |
| Live-read integration | PASS, the parity loop reads Open Design via `mcp-open-design` and caches nothing |
| Voice sweep | PASS, no em dashes, no new prose semicolons |
| Shipped | PASS, commit `b12ffd3d76` (thirty files) |
| `validate.sh --strict` (this packet) | PASS, 0 errors |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Asset removal plus documentation, not a code change.** The skill is markdown and data, so the de-vendor lands by removing assets and reframing what an agent reads, not by changing a binary.
2. **Stale wording surfaced later.** A deep review (phase 004) found stale MIT-attribution text in the playbook index and a stale data-precondition, both fixed there. The shipped license state was correct, and only descriptive wording lagged.
3. **The reciprocal graph edge was completed in review.** The deep review added the missing `mcp-open-design` reciprocal edge to this skill's graph-metadata so the link is symmetric.
<!-- /ANCHOR:limitations -->
