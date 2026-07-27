---
title: "Implementation Summary [design-interface manual-testing-playbook conformance]"
description: "Root cause confirmed (foundations retirement, commit b217d74b819); the foundations-*/motion-* residue hypothesis itself is DISPROVEN. Fixed a stale scenario count and a dead cross-reference. One real, unresolved 9-column-format gap in 18 relocated files recorded for operator decision."
trigger_phrases:
  - "manual-testing-playbook implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/002-design-interface/008-manual-testing-playbook"
    last_updated_at: "2026-07-27T20:00:00Z"
    last_updated_by: "worker-session"
    recent_action: "Confirmed root cause, disproved the residue hypothesis, fixed 2 small defects"
    next_safe_action: "Present the 18-file 9-column reformat question to the operator"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-interface/manual-testing-playbook/manual-testing-playbook.md"
      - ".opencode/skills/sk-design/design-interface/manual-testing-playbook/color/contrast-pair-inventory-before-audit.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "worker-session"
      parent_session_id: null
    completion_pct: 90
    open_questions:
      - "Should the 18 relocated foundations/motion scenario files be reformatted into the 9-column template, or is 'relocated intact' an accepted permanent exception?"
    answered_questions:
      - "Was foundations a standalone mode later merged into design-interface? YES — git show --stat b217d74b819 confirms it."
---

# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 008-manual-testing-playbook |
| **Status** | Complete (9-column reformat of 18 relocated files left open for operator) |
| **Completed** | Yes, except one operator-gated open question (9-column reformat of 18 files) |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

- **Confirmed root cause via git history**: `git show --stat b217d74b819` ("refactor(sk-design): retire the audit and foundations commands... Flatten foundations into the interface mode") proves `foundations` was a real, separate mode later consolidated into `design-interface`. REQ-001 satisfied with hard evidence, not circumstantial inference.
- **Disproved the `foundations-*` residue hypothesis itself**: despite the root cause being real, the 3 `foundations-`-prefixed `procedure-card-contract/` files are **not stale residue** to rename/merge/remove. Root `manual-testing-playbook.md` §23 already documents the naming rationale ("renamed with a `foundations-` prefix to avoid colliding with ID-018/019/020... these three cover the three foundations-owned procedure cards instead"), and the tree now also has a parallel `motion-*` trio (§24) added later by the motion merge following the **identical** naming pattern — strong evidence this is an established, intentional convention for disambiguating procedure-card families, not an oversight. Confirmed the 3 procedure cards the `foundations-*` files reference (`tweakable-design-controls.md`, `component-system-inventory.md`, `hierarchy-rhythm-review.md`) genuinely exist in `design-interface/procedures/`. **Disposition: keep all 6 prefixed files as-is.**
- **Recount, corrected**: the tree now has **25** category subdirectories (not 20 as `spec.md` measured, since the motion merge added `strategy`, `presence`, `reduced-motion`, `micro-interactions`, `decision`, `advanced-craft`) and **43** total scenario files (not measured in the original spec). Root doc's own OVERVIEW line said "30 deterministic scenarios across 19 categories" — both numbers were stale (pre-dated the motion merge's own additions being fully reconciled); corrected to "43 deterministic scenarios across 25 categories."
- **Fixed one dead cross-reference**: `color/contrast-pair-inventory-before-audit.md`'s Failure Triage cell cited `../../assets/contrast-pair-inventory.md`, missing the `foundations/` segment present everywhere else in the same file (frontmatter, body text, Source Files table) — a leftover from the "8 scenarios repointed" pass. Fixed to `../../assets/foundations/contrast-pair-inventory.md`.
- **Confirmed `ID-007`/`licensing-and-provenance/` is already resolved, not by this packet**: the directory is already absent from disk, and the root doc's section numbering already jumps 11→13 (the old §12 is gone). Sibling `001-apache-devendoring` has already executed this; nothing left for this child to protect against.
- **Found and recorded a real, unresolved gap (not fixed)**: `manual-testing-playbook-template.md:126,143` requires every scenario to use the 9-column table (`Feature ID | Feature Name | Scenario Name/Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage`). The 13 native `ID-0xx` categories and the 6 `foundations-*`/`motion-*` procedure-card-contract files all conform. The **other 18 relocated files do not** — they use an older `## Prompt` / `## Expected Process` / `## Pass Criteria` structure with no table at all: `color/{oklch-palette-and-dark-mode.md, contrast-pair-inventory-before-audit.md}`, `type/type-roles-and-measure.md`, `layout/{layout-rhythm-responsive.md, context-adaptation-matrix.md}`, `data-viz/chart-encoding-and-color.md`, `tokens/token-starter-handoff.md`, `worked-examples/worked-examples-not-presets.md`, `strategy/{purposeful-motion-plan.md, motion-pattern-card.md, async-state-machine-card.md}`, `presence/{animate-presence-exit-rules.md, animate-presence-checklist.md}`, `reduced-motion/{performance-and-reduced-motion.md, motion-performance-failure-card.md}`, `micro-interactions/micro-interactions-feedback.md`, `decision/restraint-gate.md`, `advanced-craft/advanced-craft-popover-tooltip.md`. Root doc §23/§24 frame this as the deliberate choice of relocating "intact... rather than being renumbered," but that is not the same thing as a documented template exception. **Did not reformat these 18 files** — that is substantial new-authoring work (restructuring 18 files' content into a new table shape), outside this residue-cleanup pass's blast radius, and not something to silently do without operator sign-off.
- **Verified all cross-references resolve**: wrote and ran an inline Python link-checker over every `](...)` markdown link and every `references/`, `assets/`, `procedures/`, `corpus/`-rooted path string in the whole `manual-testing-playbook/` tree (both file-relative and packet-root-relative resolution rules) — 0 broken after the one fix above.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Ran `git show --stat` on the commit hash from the task's own background context to get a primary-source confirmation rather than relying on circumstantial file comparison. Re-measured category and file counts directly against the current tree instead of trusting the spec's pre-motion-merge numbers. Read the `foundations-*` and `motion-*` procedure-card-contract files side by side with the root doc's §23/§24 explanatory text, which fully explained the naming convention — this disproved the spec's own residue hypothesis. Wrote a small inline (not persisted) Python script to resolve every relative/root-relative path reference across the whole playbook tree and confirm none are dead. Found the 9-column-format gap by diffing the table structure of a native `ID-0xx` file against several relocated files.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Disproved the `foundations-*` residue hypothesis rather than acting on it | Root `manual-testing-playbook.md` §23 already documents the exact naming rationale, and the parallel `motion-*` trio confirms it as an established convention, not an oversight — renaming/removing these files would have degraded correct, already-integrated content |
| Did not reformat the 18 non-9-column relocated files | Root-cause confirmed but disposition is a substantial new-authoring decision (restructure 18 files), not a residue fix; recorded as an open question instead of unilaterally deciding it |
| Fixed the scenario-count line and the one dead cross-reference | Both are small, unambiguous, in-scope corrections discovered during verification — the kind of residue this packet exists to close |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Category directory count | 25 (was 20 at spec-authoring time, pre-motion-merge) |
| Total scenario file count | 43 (`find -mindepth 2 -name "*.md" \| wc -l`) |
| `foundations-*`/`motion-*` root cause | Confirmed via `git show --stat b217d74b819` |
| `foundations-*` residue hypothesis | Disproven — kept as-is |
| `ID-007`/licensing-and-provenance | Confirmed already removed by sibling `001-apache-devendoring` |
| Cross-reference resolution (whole tree) | 0 broken after 1 fix |
| 9-column contract | 13 native + 6 procedure-card-contract conform; 18 relocated files do not (open question, not fixed) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **18 relocated scenario files lack the 9-column table format.** Confirmed, not fixed — awaiting operator decision on whether to reformat or formally except them.
<!-- /ANCHOR:limitations -->
