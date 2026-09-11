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
    last_updated_at: "2026-09-11T10:15:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Re-closed against 9371f99938/76ad403c52; fixed the plan.md link row"
    next_safe_action: "Add an SKILL.md reference to scripts/apply-design-md.cjs, or waive AC-018 with a recorded ADR"
    blockers:
      - "SKILL.md never names scripts/apply-design-md.cjs — REQ-016/AC-018 still unmet on that one point"
    key_files:
      - "specs/sk-design/019-sk-design-diagram-upgrade/010-design-md-style-reference/acceptance-criteria.md"
      - "specs/sk-design/019-sk-design-diagram-upgrade/010-design-md-style-reference/goal.md"
      - ".opencode/skills/sk-design/sk-design-diagram/scripts/apply-design-md.cjs"
      - ".opencode/skills/sk-design/sk-design-diagram/scripts/families/derivation-gates.cjs"
      - ".opencode/skills/sk-design/sk-design-diagram/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-010-design-md-style-reference-recloseout"
      parent_session_id: null
    completion_pct: 95
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
| **Completed** | Not complete — re-closed 2026-09-11 against commits `9371f99938` and `76ad403c52`; one criterion (AC-018) remains |
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
| `.opencode/skills/sk-design/sk-design-diagram/SKILL.md` | Modified (commit `76ad403c52`, still partial) | Gained the WHEN TO USE activation trigger, five keyword triggers, one REFERENCES row (`design-md-theming.md`), and the version bump to `1.2.0.0`; still names `scripts/apply-design-md.cjs` nowhere |
| `.opencode/skills/sk-design/sk-design-diagram/scripts/families/derivation-gates.cjs` | Modified (commit `9371f99938`) | Accepts an optional ` system=design-md` sentinel token, requires and validates its provenance comment, skips byte-equality for that block only, keeps every gate (adding `textOnMark` for the accent role when themed) |
| `.opencode/skills/sk-design/sk-design-diagram/scripts/tests/mutation-cases.cjs`, `scripts/tests/fixtures/design-md-sample.html` | Modified / Created (commit `9371f99938`) | Two new `derivation-gates` cases (deleted provenance; accent under `textOnMark`) against a new fixture |
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

**Re-closeout pass (2026-09-11).** Three of the four gaps that prior pass left `Unmet` were closed
by commits `9371f99938` and `76ad403c52`. This pass reran all of it live rather than trusting the
task/AC evidence carried over from the prior pass: `node --test scripts/tests/` (18/18, up from
16/16), a hand-built themed delivery run through `check-diagram-corpus.cjs --extra` (fails on
deleted provenance, passes on a well-formed non-stock accent), and `SKILL.md`'s literal content
(`grep -ni "apply-design\|\.cjs" SKILL.md` — still no hits). It also fixed the fourth gap directly,
adding a dark `link` row to `plan.md` §3.1, since that document is inside this closeout's own write
authority. See `goal.md`'s LOG for the two judgment calls this pass made and one new finding (the
applicator's own write-time gate and the corpus-wide checker's `textOnMark` gate disagree).
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
| `node --test scripts/tests/` | PASS (18/18, up from 16/16) — includes the two `derivation-gates` cases REQ-015 asks for |
| `node scripts/check-diagram-corpus.cjs` | PASS — `RESULT: PASSED`, errors: 0 |
| `git diff --stat -- .opencode/skills/sk-design/sk-design-chart` | PASS — empty |
| `scripts/families/derivation-gates.cjs` `system=design-md` support | **PASS** — a themed block missing provenance fails by name; a well-formed themed block with a non-stock in-gate value passes with 0 failures (`check-diagram-corpus.cjs --extra <dir>`) |
| `SKILL.md` routing (trigger, HOW IT WORKS paragraph, two REFERENCES rows, version bump) | **PARTIAL — three of four present** (trigger, version bump, one REFERENCES row); `apply-design-md.cjs` is named nowhere in the file |
| `plan.md` §3.1 dark `link` row | **PASS** — added by this closeout pass |
| `validate.sh .../010-design-md-style-reference --strict` | See the closeout's final result line (run after this document) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **`SKILL.md` still does not fully route to the new capability as REQ-016 specifies.** Commit `76ad403c52` added the WHEN TO USE activation trigger, five keyword triggers, one REFERENCES row (`design-md-theming.md`), and the version bump to `1.2.0.0` — but `scripts/apply-design-md.cjs` is still named nowhere in the file (`grep -ni "apply-design\|\.cjs" SKILL.md` — no hits), and HOW IT WORKS still carries only its pre-existing one-sentence pointer, not a dedicated paragraph. A user can discover the capability and its reference doc, but has to open that doc to learn the script exists.
2. **`assets/style-reference/diagram-stock/` was never built.** The reference bundle shipped at `assets/style-reference/harness-diagram/` instead, and no `tokens.json` file exists there — dark-theme support is declared through `DESIGN.md`'s own `**Theme:**` line, which the code accepts as an alternative signal. Functionally equivalent for this packet's own reference; `spec.md`'s Files-to-Change table names the wrong path and an extra file.
3. **`soft`'s documented text-gate exemption is narrower in code than in either doc.** `plan.md` §3.1 and `references/design-md-theming.md` §5 both describe `soft` as "never held to the text gate." `validateRoles()` (`apply-design-md.cjs:674`) puts `soft` in `TEXT_ROLES` and only excuses a sub-gate value when its measured ratio exactly reproduces a *recorded* departure ratio from `diagram-palette.json`. `--default` passes because the identity value reproduces the stock 3.48:1 departure exactly; a freshly-derived `soft` value that matches no recorded departure fails outright — observed live against a real second reference (17 forms, ratios as low as 1.04:1). Themed corpora that don't happen to reproduce the exact stock ratio will see this as a real failure mode, not a documentation nit.
4. **REQ-008 (series-capacity shortfall) and the "declares dark but too few neutrals" terminal case were not reproduced live** — both refusal paths exist and were confirmed by direct code reading, but a hand-edited reference kept supplying enough fallback candidates from its remaining rows to avoid triggering either one within the time available.
5. **The applicator's own write-time gate and the corpus-wide checker's gate disagree on `textOnMark`.** `apply-design-md.cjs`'s `validateRoles()` never checks `textOnMark` for `accent`, only `markOnPaper` and (when `ink` exists) `accentAgainstInk`; `derivation-gates.cjs`'s themed branch (commit `9371f99938`) adds `textOnMark` as a fourth check. A moved-accent reference reran this pass wrote clean under the applicator's own `--all` run (`RESULT: PASSED`) but then failed `check-diagram-corpus.cjs --extra` on 2 of the 39 forms it wrote (`accent measures 3.70:1 ... textOnMark gate is 4.5:1`). Neither tool is wrong on its own terms, and nothing in this phase's requirements says which one governs — but a themed delivery is not provably clean until both agree, and today only the second one checks.
<!-- /ANCHOR:limitations -->

---
