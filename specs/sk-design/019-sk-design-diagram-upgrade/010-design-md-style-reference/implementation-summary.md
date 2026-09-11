---
title: "Implementation Summary"
description: "Open with a hook: what changed and why it matters. One paragraph, impact first."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/019-sk-design-diagram-upgrade/010-design-md-style-reference"
    last_updated_at: "2026-09-11T09:30:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Closed out the phase record against the shipped commits"
    next_safe_action: "Build the derivation-gates.cjs extension and the SKILL.md routing, or waive them"
    blockers:
      - "derivation-gates.cjs has no system=design-md handling — REQ-014/REQ-015 unmet"
      - "SKILL.md is missing the WHEN TO USE trigger, the two REFERENCES rows, and the version bump — REQ-016 unmet"
    key_files:
      - "specs/sk-design/019-sk-design-diagram-upgrade/010-design-md-style-reference/acceptance-criteria.md"
      - "specs/sk-design/019-sk-design-diagram-upgrade/010-design-md-style-reference/goal.md"
      - ".opencode/skills/sk-design/sk-design-diagram/scripts/apply-design-md.cjs"
      - ".opencode/skills/sk-design/sk-design-diagram/scripts/families/derivation-gates.cjs"
      - ".opencode/skills/sk-design/sk-design-diagram/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-010-design-md-style-reference-closeout"
      parent_session_id: null
    completion_pct: 80
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
| **Spec Folder** | 010-design-md-style-reference |
| **Completed** | Not complete — closed out 2026-09-11 against what shipped |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A diagram delivery can now be themed from a local `DESIGN.md` the same way a chart delivery already
could. `apply-design-md.cjs` reads a v3 Style Reference, derives every structural role a selected
form declares, gates each derived value before anything is written, and writes provenance into the
form's own palette block. The stock reference at `assets/style-reference/harness-diagram/` proves the
identity property: theming from it reproduces the corpus exactly, all 31 role values, every form
byte for byte.

### The two-tier amendment

The plan called for prose-based role selection only — reading a reference's `Role` column text to
pick a row. That cannot reproduce this corpus: the lightest background-tagged row in any faithful
reference of this language is the near-white `backend-fill`, not the off-white `paper`, and the
terminal skin's four darkest neutrals do not order into `paper`/`bar` the way a plain
luminance-ascending assignment reads them. The shipped script resolves each role in two tiers
instead — a reference's own `Token` cell naming a diagram role directly (`--color-<role>`,
optionally `(dark)`/`(terminal)`) fills that role verbatim; a role no `Token` cell names falls back
to the plan's prose-based rules unchanged. Tier one is what makes `--default` exact. This is
recorded as `goal.md`'s decision D15, with a pointer from `plan.md` §3.1 and the full statement in
`references/design-md-theming.md` §4.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-design/sk-design-diagram/scripts/apply-design-md.cjs` | Created | The applicator: v3 parser, two-tier role resolution, terminal conditional, whole-file literal remapping, provenance, gate-then-write staging (1,012 lines) |
| `.opencode/skills/sk-design/sk-design-diagram/references/design-md-theming.md` | Created | Command, parsed headings, the two-tier rule, the full role-mapping table, the terminal decision, and the gates (281 lines) |
| `.opencode/skills/sk-design/sk-design-diagram/assets/style-reference/harness-diagram/DESIGN.md` | Created | The stock v3 reference, curated so `--default` reproduces `diagram-palette.json` exactly |
| `.opencode/skills/sk-design/sk-design-diagram/assets/style-reference/harness-diagram/origin.md` | Created | Provenance: states plainly the reference was authored from the packet's own palette, not measured |
| `.opencode/skills/sk-design/sk-design-diagram/assets/style-reference/harness-diagram/diagram-palette.json`, `icons.html` | Moved in (later commits) | The token source and icon specimen joined the reference bundle so a "visual language" is one directory |
| `.opencode/skills/sk-design/sk-design-diagram/SKILL.md` | Modified (partially) | One HOW IT WORKS sentence points at `references/design-md-theming.md`; the activation trigger, the `apply-design-md.cjs` REFERENCES row, and the version bump were not added |
| `.opencode/skills/sk-design/sk-design-diagram/scripts/families/derivation-gates.cjs` | **Not modified** | The `system=design-md` sentinel extension this phase specified was never built |
| `.opencode/skills/sk-design/sk-design-diagram/scripts/tests/mutation-cases.cjs`, `scripts/tests/fixtures/` | **Not modified / does not exist** | The two new `derivation-gates` cases and their fixture were never added |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The applicator shipped in one commit (`78ab2b220b`), then three follow-on refactors moved its
reference bundle: `c1f109bfe4` and `9a4b60e0ed` relocated `diagram-palette.json` and `icons.html`
into the same directory as `DESIGN.md`/`origin.md`, landing the bundle at
`assets/style-reference/harness-diagram/` rather than the `assets/style-reference/diagram-stock/`
path `spec.md` names — a rename that went unrecorded until this closeout pass. `f3bf733cf4` later
repainted five forms after two new checker rules moved a chip-label colour and a legend swatch.

This closeout pass reran the applicator's own claims directly rather than trusting the commit
messages: `--default --all --out <dir>` against the live corpus, a second reference (moved accent)
against the live corpus, four refusal paths (no args, URL, missing heading, sub-gate accent), the
terminal conditional both ways (no dark declared, dark declared), `node --test scripts/tests/`, and
`node scripts/check-diagram-corpus.cjs`. It also reran the exact stress input `tasks.md` names for
T025 — the chart sibling's `evilcharts/DESIGN.md` under `--all` — which fails on a `soft`-role gate
issue the identity case never exercises (see Known Limitations).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Two-tier role resolution (D15, amendment) | Prose-based selection alone cannot reproduce this corpus's own stock values (near-white service fill vs off-white ground; terminal panel not the darkest neutral). A reference that names a diagram role in its `Token` column is used as written; everything else still goes through the plan's original selection rules |
| Whole-file literal remapping, not sentinel-only substitution | F32 already showed `link` (and, in one template, `rule-solid`/`accent-tint`) living outside the sentinel block as hard-coded literals; a sentinel-only substitution would silently leave those marks stock |
| One accent, not a four-series ladder | Most diagram forms carry a single focal mark; `series-1..5` exists only for the minority of forms that draw a categorical set, widened to five slots since the corpus's series capacity is five, not the chart's four |
| Terminal theming is conditional | A reference themes the terminal skin only when it declares dark support and supplies four distinct dark neutrals; otherwise all nine terminal roles stay stock and the run says so by name, rather than fabricating a four-layer dark chrome from a light-only table |
| No `--scheme` flag | D1 gives every diagram form exactly one skin in one sentinel block, so there is no second ground for such a flag to select |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `apply-design-md.cjs --default --all --out <dir>` | PASS — `RESULT: PASSED`, `diff -rq <dir> assets/diagrams` empty |
| A second, distinct reference (moved accent) | PASS — `RESULT: PASSED`, provenance written correctly |
| The specifically-named stress input (`evilcharts/DESIGN.md`, `--all`) | FAIL — `RESULT: FAILED`, 17 light forms fail `soft` against `textOnPaper`; a narrower `--forms starter-dark` run against the same reference passes |
| No-args / URL / missing-heading / fewer-than-four-rows refusals | PASS — each names itself, exits non-zero, writes nothing |
| Accent below `markOnPaper` | PASS — `FAILURE ... accent ratio=1.22:1 gate=markOnPaper 3:1 ... nearest clearing value #968c82` |
| Terminal conditional (no dark declared, `--all`) | PASS — terminal stays byte-identical to stock, run states the reason |
| Terminal conditional (no dark declared, `--forms starter-terminal`) | PASS — fails by name rather than falling back silently |
| `node --test scripts/tests/` | PASS (16/16) — but does not include the two `derivation-gates` cases REQ-015 asks for, because they were never written |
| `node scripts/check-diagram-corpus.cjs` | PASS — `RESULT: PASSED`, errors: 0 |
| `git diff --stat -- .opencode/skills/sk-design/sk-design-chart` | PASS — empty |
| `scripts/families/derivation-gates.cjs` `system=design-md` support | **FAIL — does not exist** |
| `SKILL.md` routing (trigger, HOW IT WORKS paragraph, two REFERENCES rows, version bump) | **FAIL — one of four present** |
| `validate.sh .../010-design-md-style-reference --strict` | See the closeout's final result line (run after this document) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **`derivation-gates.cjs` carries no `system=design-md` handling.** REQ-014's sentinel extension, and REQ-015's two mutation cases plus fixture, were never built. A themed form's palette block is gated only by the applicator's own in-memory checks at write time, never by the corpus-wide checker `check-diagram-corpus.cjs` runs. Building this stayed outside this closeout pass's write authority (scoped to the phase's spec-folder docs); it needs an implementation pass.
2. **`SKILL.md` does not route to the new capability as REQ-016 specifies.** One sentence in HOW IT WORKS points at `references/design-md-theming.md`; there is no WHEN TO USE activation trigger, no REFERENCES row for either `apply-design-md.cjs` or `design-md-theming.md`, and the frontmatter `version` never moved from `1.1.0.0`. A user has to already know the capability exists to find that one sentence.
3. **`assets/style-reference/diagram-stock/` was never built.** The reference bundle shipped at `assets/style-reference/harness-diagram/` instead, and no `tokens.json` file exists there — dark-theme support is declared through `DESIGN.md`'s own `**Theme:**` line, which the code accepts as an alternative signal. Functionally equivalent for this packet's own reference; `spec.md`'s Files-to-Change table names the wrong path and an extra file.
4. **`soft`'s documented text-gate exemption is narrower in code than in either doc.** `plan.md` §3.1 and `references/design-md-theming.md` §5 both describe `soft` as "never held to the text gate." `validateRoles()` (`apply-design-md.cjs:674`) puts `soft` in `TEXT_ROLES` and only excuses a sub-gate value when its measured ratio exactly reproduces a *recorded* departure ratio from `diagram-palette.json`. `--default` passes because the identity value reproduces the stock 3.48:1 departure exactly; a freshly-derived `soft` value that matches no recorded departure fails outright — observed live against a real second reference (17 forms, ratios as low as 1.04:1). Themed corpora that don't happen to reproduce the exact stock ratio will see this as a real failure mode, not a documentation nit.
5. **REQ-004's role-mapping table is missing a dedicated dark `link` row**, and the actual `diagram-palette.json` dark skin carries 5 roles, not the 4 this packet's own acceptance criteria assumed. The code still derives dark `link` correctly (the derivation loop is generic per role, not hard-coded per skin), so this is a table/documentation gap rather than a functional one.
6. **REQ-008 (series-capacity shortfall) and the "declares dark but too few neutrals" terminal case were not reproduced live** in this closeout pass — both refusal paths exist and were confirmed by direct code reading, but a hand-edited reference kept supplying enough fallback candidates from its remaining rows to avoid triggering either one within the time available.
<!-- /ANCHOR:limitations -->

---
