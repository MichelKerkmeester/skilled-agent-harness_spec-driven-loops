---
title: "Implementation Summary: sk-design shared Brand-vs-Product operating register"
description: "Executed. Built the shared sk-design operating register and its one-page routing card under sk-design/shared/, gating the six downstream dials from a single Brand-vs-Product declaration. The sk-design hub passes package_skill --check."
trigger_phrases:
  - "sk-design shared register status"
  - "brand vs product register outcome"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/010-shared-register"
    last_updated_at: "2026-06-26T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Built shared/register.md and register_card.md, sk-design check passes"
    next_safe_action: "Execute 011-interface-audit-core (depends on this register)"
    blockers: []
    key_files:
      - "spec.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "author-154-010-shared-register"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Dial vocabulary fixed to the six dials grounded in the 009 corpus sources"
      - "Card lists each register's dial defaults inline in a single-page table"
---
# Implementation Summary: sk-design shared Brand-vs-Product operating register

<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 154-sk-design-parent/010-shared-register |
| **Completed** | Executed: register + card built under sk-design/shared/; hub check passes |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Two shared files under `.opencode/skills/sk-design/shared/`:

- `shared/register.md` (79 lines) declares whether a design IS the product (Brand: marketing, landing, campaign, portfolio) or SERVES the product (Product: app UI, admin, dashboard, tool), gives a first-match-wins pick rule (task cue, surface in focus, declared register), and gates six downstream dials from that one declaration: density, motion budget, color dosage, copy register, anti-slop strictness, and audit severity. It also carries the four-step color-strategy axis (Restrained, Committed, Full palette, Drenched) and a per-mode usage map.
- `shared/assets/register_card.md` (57 lines) is the one-page fill-in: set-the-register questions, a Brand-vs-Product dial table to copy from, and a hand-off list per mode.

Both are shared content the interface, audit, foundations, motion, and md-generator modes reference. They are not a sixth mode.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The register was authored first (it is the prerequisite the card and the downstream phases read), then the card, then the card was cross-checked against the register so the two stay consistent. Content is grounded in the 009 research and its cited corpus: the Brand-vs-Product model and color-strategy axis from `impeccable`, the per-register color behavior from `colorize`, and the per-register motion behavior from `animate`. Both files match the existing `shared/` format (frontmatter plus numbered sections) and the family's Human Voice Rules (no em dashes, semicolons, or Oxford commas).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Built `shared/register.md` before the card and before any consuming mode | The register is the single declaration the card and the downstream dials read; it had to exist first |
| Kept the register as shared content, not a sixth sub-skill | The 009 research is explicit: author-once shared content referenced by the modes |
| Fixed the six dials and the color-strategy axis from the corpus, not invented | Grounds each default in `impeccable`, `colorize`, and `animate` rather than a fashionable preset |
| Card lists each register's defaults inline in one table | Keeps the card to a single page and removes a per-mode lookup hop |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `shared/register.md` created | PASS (79 lines) |
| Register gates the six downstream dials | PASS (Section 3 dial table, Brand and Product columns) |
| `shared/assets/register_card.md` created (one-page fill-in) | PASS (57 lines) |
| Register and card are shared content, not a sub-skill | PASS (no graph-metadata; referenced by the modes) |
| `sk-design` hub `package_skill --check` | PASS (exit 0) |
| `validate.sh --strict` on this packet | PASS (0 errors, 0 warnings) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The register is content, not enforcement.** Each mode must read and apply it; this phase does not wire an automatic gate into the mode workflows.
2. **Downstream phases consume it next.** `011-interface-audit-core` is the first consumer; the register-gated transform verbs there depend on this file.
3. **The card defaults mirror the register.** If the register's dials change later, the card table must be updated in lockstep.
<!-- /ANCHOR:limitations -->
