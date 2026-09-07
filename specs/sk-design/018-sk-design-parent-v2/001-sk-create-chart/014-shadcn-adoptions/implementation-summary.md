---
title: "Implementation Summary"
description: "Three checker-held chart contracts now keep named series, tooltip readouts and time-path curves explicit across the standalone corpus."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/018-sk-design-parent-v2/001-sk-create-chart/014-shadcn-adoptions"
    last_updated_at: "2026-09-07T20:41:13Z"
    last_updated_by: "codex"
    recent_action: "Recorded final implementation and verification evidence"
    next_safe_action: "Conductor review and commit the scoped packet"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:8d567ba60e38f61a5ff9595d2b134fa8ed930f4e9a01095f49d0811b121ff603"
      session_id: "codex-phase-014-shadcn-adoptions"
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
| **Spec Folder** | 014-shadcn-adoptions |
| **Completed** | 2026-09-07 |
| **Level** | 2 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The standalone chart corpus now states the decisions that were previously left to template habit:
named series own palette tokens, tooltip forms own their readout formatters and datum-field key,
and time paths state the interpolation that matches their data. The checker makes those declarations
fail closed, so a future edit cannot silently split a series definition from its paint, reintroduce
ad hoc tooltip formatting or choose an unreviewed curve.

### shadcn adoptions

The six named multi-series forms use one `CHART_SERIES` block beside `CHART_DATA`; the 18 tooltip
forms use one `READOUT` block, and the four time-path deliveries/forms use `CURVE` with a one-line
rationale. The three reference files explain the same contracts in author-facing language, while
the catalog and colour-system notes retain phase 13's radar/pie omissions and measured palette
comparison. No new chart form, external resource, natural interpolation or policy-gated assertion
was introduced.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs` | Modified | Adds keyed series ownership checks, semantic `READOUT` key wiring within `number-format` and `curve-contract`, while preserving existing gates. |
| `.opencode/skills/sk-design/sk-design-chart/assets/templates/*.html` (19 changed of 26) | Modified | Declares the six keyed series maps, 18 local readout blocks and three time-path curve blocks; tooltip registrations read their datum field and path builders read `CURVE`. |
| `.opencode/skills/sk-design/sk-design-chart/assets/examples/*.html` (6 reviewed; 4 changed) | Modified | Brings the four tooltip deliveries and the daily-line delivery into the applicable local contracts; the two single-metric deliveries need no new block. |
| `.opencode/skills/sk-design/sk-design-chart/assets/gallery.html` | Regenerated, no content delta | Re-runs the 26-form, 52-frame gallery build after template changes. |
| `.opencode/skills/sk-design/sk-design-chart/references/template-contract.md` | Modified | Documents the three author-facing contracts and their placement. |
| `.opencode/skills/sk-design/sk-design-chart/references/catalog.md` | Modified | Records the phase 13 radar and pie omissions and countable substitutions. |
| `.opencode/skills/sk-design/sk-design-chart/references/color-system.md` | Modified | Records the phase 13 measured shadcn-versus-standalone palette comparison and retained token indirection. |
| `specs/.../014-shadcn-adoptions/scratch/inventory.md` | Created | Records the keyed, tooltip and time-path inventories. |
| `specs/.../014-shadcn-adoptions/scratch/mutations.md` | Created | Records exact failure lines for the three negative controls. |
| `specs/.../014-shadcn-adoptions/scratch/mutation-*/` | Created | Keeps the three isolated mutated chart-package copies under packet scratch only. |
| `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`, `goal.md` | Modified | Closes the packet docs against observed implementation and verification evidence. |
| `implementation-summary.md`, `description.json`, `graph-metadata.json` | Modified/regenerated | Records delivery, verification, continuity and generated packet metadata. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The binding work was implemented in the checker first and then applied to the corpus. The static
checker passed all 35 scanned files (26 templates), and the contract checks were exercised against
isolated mutations: a missing series token, a missing `READOUT` block, `CURVE = 'natural'` and the
decorative `READOUT.key` alias pattern. The gallery was regenerated with `scripts/build-gallery.cjs`,
and the packet metadata was regenerated twice after the document close-out.

The `sk-code` smart route resolved the surface as WEBFLOW/standalone HTML with implementation as
the primary intent and verification as the secondary intent. The loaded guidance was the webflow
implementation trio plus the HTML style/quality, JavaScript naming/structure and cross-language
references; the chart skill and its template-contract, catalog and colour-system references were
also applied.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Named series use `CHART_SERIES` keys and one palette token | Keyed ownership makes the declaration and paint auditable while ordered ladders, sign classes and state classes keep their existing indexed contracts. |
| Tooltip forms use local `READOUT` knobs | Label formatter, value formatter and datum-field key are semantic choices of the form, so the checker keeps them beside the data instead of allowing scattered formatting. |
| `READOUT.key` is wired to the registered datum | Every card registration passes its row or a small record with the literal keyed field, and the card reads `READOUT.label(datum[READOUT.key])`; computed labels keep their existing visible text without a dynamic alias object. |
| Time paths use declared `CURVE` intent | Measured trends default to honest `linear` paths; the contract permits `step` and `monotone` only when their data meaning and rationale justify them, and excludes `natural`. |
| Radar and pie remain out; palette gates remain unchanged | Phase 13's synthesis selected parallel axes and countable unit-grid/unit-ring substitutions and measured the standalone categorical palette as the stronger separation; the four policy-gated items remain operator decisions. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node .opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs` | PASS — `Summary: errors: 0`; `RESULT: PASSED`. Key paths: `curve-contract: 16 assertion(s), 0 failure(s)`, `number-format: 320 assertion(s), 0 failure(s)`, `series-mapping: 128 assertion(s), 0 failure(s)`, `no-external: 210 assertion(s), 0 failure(s)`. |
| `node --check .opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs` | PASS — exit 0. |
| Mutation: missing series token | PASS negative control — exit 1; `FAIL [series-mapping] ... series key "orders" has no palette token. Each key resolves to exactly one --chart-series-N token`. |
| Mutation: missing `READOUT` | PASS negative control — exit 1; `FAIL [number-format] ... the file carries a hover card and defines no READOUT block. Tooltip label, value and key alias belong beside CHART_DATA`. |
| Mutation: decorative `READOUT.key` alias | PASS negative control — exit 1; `FAIL [number-format] assets/templates/box-plot.html: tooltip readout code builds an object keyed by READOUT.key and immediately reads that alias back. The card must read READOUT.key from the registered datum`. |
| Mutation: `CURVE = 'natural'` | PASS negative control — exit 1; `FAIL [curve-contract] ... CURVE "natural" is outside {linear, step, monotone}. Natural interpolation is not a declared intent`. |
| `scripts/build-gallery.cjs` | PASS — `wrote assets/gallery.html: 26 forms, 52 frames`. |
| `grep` block counts | PASS — 18 template `READOUT` blocks, four delivery `READOUT` blocks, three template `CURVE` blocks and one delivery `CURVE` block. |
| `node .opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs --render` | UNKNOWN — exit 1; Chrome was present but every render invocation returned no document, and a direct local-file invocation aborted with exit 134. |
| `bash .opencode/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/014-shadcn-adoptions --strict` | PASS — `RESULT: PASSED`. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Render runtime unavailable.** The installed Chrome binary aborts before returning a document, so card-readout, pointer-reach, screenshot and theme-render checks are unknown. Static checker, script parsing and mutation evidence remain available.
2. **Policy-gated decisions remain open.** Keyboard/pointer release gating, colour-vision-deficiency thresholds, data-accuracy metadata and retargetability manifests were intentionally not implemented.
3. **Mutation chronology note.** The semantic readout assertion was authored before the consumer refresh, and its isolated negative control was captured before the final verification gate. The exact failure and final pass are retained as evidence.
<!-- /ANCHOR:limitations -->

---
