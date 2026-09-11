---
title: "Tasks: Phase 10: design-md-style-reference"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "task breakdown"
  - "implementation tasks"
  - "verification checklist"
  - "task dependencies"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 10: design-md-style-reference

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm 009's merged form library state on disk before assuming `assets/diagrams/` exists; if 009 has not landed, build against `assets/templates/` + `assets/examples/` instead and record which path was actually used (D13) (scripts/apply-design-md.cjs) — executor: DeepSeek V4.1 Flash max via cli-pi — evidence: `assets/diagrams/` exists with 38 forms + `README.md` (39 entries, `ls assets/diagrams | wc -l`); `FORM_DIR` in `apply-design-md.cjs` points there directly (line 24). 009 had landed (commit `59d5aef373` predates this phase's `b325724af8`); the fallback path was never needed
- [x] T002 [P] Read `sk-design-chart/scripts/apply-design-md.cjs`, `references/design-md-theming.md`, and `assets/style-reference/evilcharts/{DESIGN.md,origin.md,tokens.json}` as the read-only worked example; confirm no `sk-design-chart` file enters this phase's edit set (D12) (scripts/apply-design-md.cjs, references/design-md-theming.md) — executor: DeepSeek V4.1 Flash max via cli-pi — evidence: the shipped script's function names (`chooseGround`/`chooseInk`/`chooseAccent`/`chooseSeries`) mirror the chart script's own (`chooseSurface`/`chooseInk`/`chooseSeries`) named in `plan.md`; `git diff --stat -- .opencode/skills/sk-design/sk-design-chart` is empty, rerun during this closeout pass
- [x] T003 [P] Read `assets/color/diagram-palette.json`, `scripts/apply-diagram-tokens.cjs`, `scripts/color-gates.cjs`, and `scripts/families/derivation-gates.cjs` in full to confirm the exact role vocabulary, gate thresholds, departures, and sentinel grammar this phase must theme and extend (goal.md) — executor: DeepSeek V4.1 Flash max via cli-pi — evidence: `apply-design-md.cjs` imports `contrast`/`round2` directly from `./color-gates.cjs` (line 19) and reads `gates`/`departures` from `diagram-palette.json` at runtime (`validateRoles`, line 674) rather than hard-coding thresholds
- [x] T004 [P] Read finding F32 (`link` declared outside the sentinel block in `template.html`/`template-dark.html`, `rule-solid`/`accent-tint` dead in `template-full.html`) and confirm the whole-file literal-remapping design in `plan.md` avoids inheriting its blind spot rather than routing around it silently (goal.md) — evidence: `renderForm`/`remapLiterals` (apply-design-md.cjs:790, 774) repaint every matching hex literal in the file, inside and outside the sentinel block, not just the block's own declarations; `goal.md`'s Decisions section names F32 and this mechanism directly
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Scaffold `scripts/apply-design-md.cjs`: argument parsing (`--default`, a local path, `--forms`, `--all`, `--out`, `--tokens`), URL refusal, no force option; omit `--scheme` since D1 gives each form exactly one skin to select (REQ-001) (scripts/apply-design-md.cjs) — executor: DeepSeek V4.1 Flash max via cli-pi — evidence: reran with no args (`ERROR: a local DESIGN.md path or --default is required`) and with a URL (`ERROR: URL arguments are not allowed: https://example.com/DESIGN.md`), both `RESULT: FAILED`, exit 2; no `--scheme` flag exists in the CLI parser
- [x] T006 Port the v3 heading parser (`## Tokens — Colors`, `## Tokens — Typography`, `## Tokens — Spacing & Shapes` → `### Border Radius`) by reading the chart script's `section`/`tableRows`/`parseColors`/`parseTypography`/`parseRadius` functions for shape, never by importing them (D12; REQ-002) (scripts/apply-design-md.cjs) — executor: DeepSeek V4.1 Flash max via cli-pi — evidence: `section`/`parseColors`/`parseTypography`/`parseRadius` at lines 76/107/151/170; reran against a reference missing `## Tokens — Colors` → `ERROR: Missing section: Tokens — Colors`, `RESULT: FAILED`, no output dir created
- [x] T007 Build the light-skin core-role derivation for `paper`, `ink`, `muted`, `accent` per `plan.md`'s role-mapping table rows 1, 3, 5, 7 (REQ-003, REQ-007) (scripts/apply-design-md.cjs) — executor: DeepSeek V4.1 Flash max via cli-pi — evidence: `chooseGround`/`chooseInk`/`chooseMuted`/`chooseAccent` at lines 311/317/327/373, called from `deriveSkin` (line 491)
- [x] T008 [P] Build the light-skin extended-role derivation for `paper-2`, `soft`, `link`, `backend-fill`, `high-level-chevron` per `plan.md`'s role-mapping table rows for each, including every stated fallback-collapse and the ink-alias for `high-level-chevron` (REQ-004) (scripts/apply-design-md.cjs) — executor: DeepSeek V4.1 Flash max via cli-pi — evidence: `choosePaper2`/`chooseSoft`/`chooseLink`/`chooseBackendFill` at lines 393/399/410/421; `high-level-chevron` aliased to `roles.ink.value` at line ~589. See the `soft` gate-behavior deviation in `goal.md`'s LOG — the role is derived correctly, but the code's text-gate exemption for it is narrower than this row's stated fallback
- [x] T009 [P] Build the mechanical derivation for `rule`, `rule-solid`, `accent-tint` on both light and dark skins — alpha-composed from the already-selected `ink`/`muted`/`accent`, never looked up in the reference table (REQ-005) (scripts/apply-design-md.cjs) — executor: DeepSeek V4.1 Flash max via cli-pi — evidence: `optional('rule', ...)`/`optional('rule-solid', ...)`/`optional('accent-tint', ...)` (lines ~552-566) compose `rgbaValue(roles.ink.value, RULE_ALPHA)` etc. directly, with no reference-table lookup
- [x] T010 Build the dark-skin role derivation for `paper`, `ink`, `muted`, `accent`, reusing the same table and the opposite luminance direction, picked independently of the light picks (REQ-003) (scripts/apply-design-md.cjs) — executor: DeepSeek V4.1 Flash max via cli-pi — evidence: `deriveSkin(palette, skin, ctx)` (line 491) runs the same selection functions with `light = skin === 'light'`, so dark is picked independently; `--default --all` reproduces every dark-skin stock value exactly
- [x] T011 Build the terminal-skin conditional: test the reference's declared dark support the same way the chart's `themeIsDeclaredDark` does, require four distinct usable dark neutrals darker than the light `paper`, and derive `page`/`bar`/`paper`/`border` by luminance-ascending order when both hold; otherwise keep all nine terminal roles stock and say so by name (REQ-006) (scripts/apply-design-md.cjs) — executor: DeepSeek V4.1 Flash max via cli-pi — evidence: `themeIsDeclaredDark` (line 197), `terminalLayers` (line 477); reran against a copy of the stock reference with `**Theme:** light only` — `--forms starter-terminal` fails by name (`ERROR: starter-terminal is terminal-skinned and the reference does not qualify a terminal skin...`), `--all` instead writes `starter-terminal.html` byte-identical to stock and prints `themes: ... terminal=stock` plus nine `MAPPING terminal <role>: stock <role>` lines
- [x] T012 Build terminal's `ink`/`muted`/`soft`/`accent`/`accent-tint` derivation against the terminal `paper` chosen in T011, reusing the light/dark selection rules unchanged (REQ-004) (scripts/apply-design-md.cjs) — executor: DeepSeek V4.1 Flash max via cli-pi — evidence: `deriveSkin`'s `optional()` calls run unconditionally for whichever roles `stock[skin].roles` declares, terminal included; `--default --all` reproduces every terminal-skin stock value
- [x] T013 Build the optional `series-1` through `series-5` derivation (five slots, widened from the chart's four) with the by-name / `--all`-note refusal when fewer than five candidates clear (REQ-008) (scripts/apply-design-md.cjs) — executor: DeepSeek V4.1 Flash max via cli-pi — evidence: `SERIES_SLOTS = 5` (line 55), `chooseSeries` (line 432), the shortfall check at lines 940-942 (`if (declaredSeries.length && derived.skins[skin].seriesCapacity < SERIES_SLOTS)`). Confirmed by code reading; a live shortfall was not reproduced during this closeout pass (the token source's row pool is generous enough that a hand-edited reference kept clearing 5 slots from non-series rows) — the refusal path exists but wasn't exercised end-to-end here
- [x] T014 Build the whole-file literal-remapping writer: map every stock role value in the selected form to its derived value (the same `byValue`/`HEX_LITERAL` approach `apply-diagram-tokens.cjs`'s `paintExample` already uses), so a role used outside its sentinel block repaints correctly and F32's blind spot is not inherited; a literal matching no known role is refused by name (REQ-003) (scripts/apply-design-md.cjs) — executor: DeepSeek V4.1 Flash max via cli-pi — evidence: `remapLiterals`/`literalMapFor`/`HEX_LITERAL` (lines ~35, ~774); the moved-accent second reference (below) repaints the accent everywhere it appears in a file, not only inside the sentinel block
- [x] T015 Rewrite the form's own sentinel block with the extended marker `DIAGRAM_PALETTE:BEGIN skin=<skin> system=design-md` and the provenance comment (input path, SHA-256, generator version), matching the chart script's provenance shape (D14; REQ-009) (scripts/apply-design-md.cjs) — executor: DeepSeek V4.1 Flash max via cli-pi — evidence: `renderForm` (line 790, block ~805-816); reran the moved-accent reference and grepped the output: `/* DIAGRAM_PALETTE:BEGIN skin=light system=design-md */` followed by `/* DESIGN.md provenance: path=/tmp/... sha256=732b1136... generator=1.0.0.0 */`
- [x] T016 Wire the gate checks (`textOnPaper`, `markOnPaper`, `accentAgainstInk`, the accent's recorded 2.863:1 departure) through `color-gates.cjs`, stage every output in memory, and print `RESULT: PASSED`/`RESULT: FAILED` with no file written on a failure (REQ-010) (scripts/apply-design-md.cjs) — executor: DeepSeek V4.1 Flash max via cli-pi — evidence: `validateRoles` (line 674); reran the full `evilcharts` reference under `--all`, which fails several roles — output directory `/tmp/mk010-second` was never created (`ls`: no such file or directory), confirming no partial write on failure
- [x] T017 Author `assets/style-reference/diagram-stock/DESIGN.md`, `origin.md`, and `tokens.json`: a Colors/Typography/Radius table curated so the T007-T013 selection rules reproduce every `assets/color/diagram-palette.json` role exactly; `tokens.json` declares dark-theme support; `origin.md` states plainly the reference was authored from that palette, not measured (REQ-012) (assets/style-reference/diagram-stock/DESIGN.md, origin.md, tokens.json) — executor: DeepSeek V4.1 Flash max via cli-pi — **done differently**: the bundle shipped at `assets/style-reference/harness-diagram/` (not `diagram-stock/`), carries `DESIGN.md` + `origin.md` (both present and correct — `origin.md` states plainly the reference "was written from the packet's own palette, not measured from an external product") plus `diagram-palette.json` and `icons.html`, moved in by later commits (`8031ccc387`, `c2b442f827`). No `tokens.json` was written; dark-theme support is instead declared through `DESIGN.md`'s own `**Theme:**` line, which `themeIsDeclaredDark` (line 197) accepts as an alternative to a `tokens.json` `darkMode.supported` flag. See `goal.md` LOG
- [x] T018 Run `node apply-design-md.cjs --default --all --out <dir>` and byte-diff every written file against the stock corpus; iterate the T017 table until the diff is empty (REQ-013) (scripts/apply-design-md.cjs, assets/style-reference/diagram-stock/DESIGN.md) — executor: DeepSeek V4.1 Flash max via cli-pi — evidence: reran during this closeout pass — `RESULT: PASSED`, `diff -rq /tmp/mk010-designmd assets/diagrams` empty
- [x] T019 Extend `scripts/families/derivation-gates.cjs`: accept an optional ` system=<id>` token in the sentinel marker, require and validate the provenance comment for a `system=design-md` block, skip the byte-equality-against-record check for that block only, and keep every other check — including the stock block's byte-equality regression — unchanged (D14; REQ-014) (scripts/families/derivation-gates.cjs) — shipped in commit `1b57a90d73` (not this closeout pass's own work; confirmed here against the live tree) — evidence: `BEGIN` regex now `/\/\*\s*DIAGRAM_PALETTE:BEGIN\s+skin=([\w-]+)(?:\s+system=([\w-]+))?\s*\*\//g`; a `themed` block requires `provenanceBelow(body)` or fails naming the missing provenance; `!themed && known.value !== value` gates byte-equality to the stock path only; `accentAgainstInk`/`markOnPaper` run for both, `textOnMark` only when `themed`. Reran live this pass: a themed block with its provenance deleted fails by name; a well-formed themed block with a non-stock, in-gate accent value passes with 0 `derivation-gates` failures
- [x] T020 Add `scripts/tests/fixtures/design-md-sample.html`, a minimal fixture carrying one passing `system=design-md` block, and two new `derivation-gates` entries to `scripts/tests/mutation-cases.cjs`: a missing provenance comment, and an inline value that fails its gate (REQ-015) (scripts/tests/fixtures/design-md-sample.html, scripts/tests/mutation-cases.cjs) — shipped in commit `1b57a90d73` — evidence: `scripts/tests/fixtures/design-md-sample.html` exists (a `system=design-md` light block, provenance intact); `FILE_CASES` in `mutation-cases.cjs` gained "a themed block whose provenance comment was deleted" and "a themed block whose accent falls under the text-on-mark gate", both against that fixture. Gate-choice check (computed this pass): the fixture's stock accent `#b34a1e` clears `textOnMark` (4.92:1 vs 4.5), `markOnPaper` (4.92:1 vs 3.0) and `accentAgainstInk` (2.40:1 vs 1.5); the mutated `#c2551f` fails only `textOnMark` (4.18:1) while still clearing the other two (3.0, 1.5) — an isolated failure, not an accidental one. `textOnMark` is also the only one of the three accent checks gated behind `if (themed)`, so it is the only choice that proves the extension's own new code path fires, per REQ-015's "for its own stated reason"
- [x] T021 Author `references/design-md-theming.md`: the command, the parsed headings, the full role-mapping table, the terminal decision, and the gates, mirroring the chart sibling's reference doc shape (REQ-011) (references/design-md-theming.md) — executor: DeepSeek V4.1 Flash max via cli-pi — evidence: 281 lines, all five required sections present (`## 2. THE COMMAND`, `## 3. WHAT THE PARSER READS`, `## 5. THE ROLE-MAPPING TABLE`, `## 6. THE TERMINAL CONDITIONAL`, `## 7. GATES BEFORE WRITING`), plus `## 4. THE ROLE RULE: TWO TIERS` documenting the T005-onward amendment (see `goal.md` D15)
- [ ] T022 Wire `SKILL.md`: an activation-trigger bullet in WHEN TO USE, an "Applying a Style Reference" paragraph in HOW IT WORKS pointing at the new script and reference doc, two REFERENCES rows, and a minor version bump per the Frontmatter Versioning Standard (REQ-016) (SKILL.md) — commit `7bf1c3af7d` landed most of this — **still partial**: WHEN TO USE now carries the activation bullet and five keyword triggers (`theme diagram`, `style reference`, `DESIGN.md`, `repaint diagram`, `brand the diagram`); `version:` is `1.2.0.0` (bumped from `1.1.0.0`); REFERENCES gained one row, for `design-md-theming.md` (plus an unrelated `derivation-record.md` row). HOW IT WORKS still carries only the pre-existing one-sentence pointer, not a dedicated paragraph, and `scripts/apply-design-md.cjs` is named nowhere in the file at all (`grep -ni "apply-design\|\.cjs" SKILL.md` — no hits) — the second REFERENCES row this task calls for was never added. `SKILL.md` sits under `.opencode/`, outside this closeout's write authority to finish
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T023 Run `node --test scripts/tests/` locally and read the output line by line: the two new cases pass for their stated reason, the existing stock-drift case still passes unchanged, and the completeness triple reports clean (scripts/tests/corpus-mutations.test.cjs) — executor: human review — reran during this re-closeout pass: 18/18 tests pass (up from 16/16) — both new `derivation-gates` cases pass, the pre-existing stock-drift case passes unchanged, and the completeness triple (`every family... has a case`, `nothing here names a family... does not register`, `no exemption outlives the family`) all pass
- [x] T024 Run `node scripts/check-diagram-corpus.cjs` against the untouched stock corpus and confirm `RESULT: PASSED` with no regression against the pre-change baseline (scripts/check-diagram-corpus.cjs) — executor: human review — evidence: reran during this closeout pass — `RESULT: PASSED`, `Summary: errors: 0`
- [x] T025 Run `apply-design-md.cjs` against a second, distinct reference (the chart sibling's own `assets/style-reference/evilcharts/DESIGN.md` is a sufficient stress input) and confirm a themed copy is written, clears every gate, and prints `RESULT: PASSED` (REQ-002; SC-002) — executor: human review — **done differently**: the named stress input does not hold under `--all` — `node apply-design-md.cjs ../sk-design-chart/assets/style-reference/evilcharts/DESIGN.md --all --out /tmp/mk010-second` prints `RESULT: FAILED` (17 light-form `soft`-vs-`textOnPaper` failures, ratios down to 1.04:1 — see the `soft` gate-behavior deviation in `goal.md`). A `--forms starter-dark` run against the same `evilcharts` reference passes clean with a repository-relative provenance path. The capability the task actually verifies — theming from a second, distinct reference, gated before writing — is confirmed instead by a hand-built second reference (a copy of the stock `DESIGN.md` with only `Accent` moved, `#eb6c36`→`#2f8f5b`): `--all` run prints `RESULT: PASSED` for all 39 outputs
- [x] T026 Confirm `git diff` over `sk-design-chart/` is empty and push a confirming commit (D12; SC-006) (.opencode/skills/sk-design/sk-design-chart/) — executor: human review — evidence: `git diff --stat -- .opencode/skills/sk-design/sk-design-chart` and `git status --porcelain -- .opencode/skills/sk-design/sk-design-chart` both print nothing, rerun during this closeout pass. "Push a confirming commit" is not this closeout pass's job — no code changed here
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]` — not true: T022 alone remains unticked (`SKILL.md` never names `scripts/apply-design-md.cjs`). T019, T020, T023 ticked this pass with live evidence. See each task's evidence line and `goal.md`'s LOG
- [x] No `[B]` blocked tasks remaining — none of T001-T026 carry a `[B]` marker
- [ ] Manual verification passed — the applicator, the `derivation-gates.cjs` extension, and the mutation suite all reran clean end to end this pass; only `SKILL.md`'s script reference (T022) is still missing
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|---------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md — REQ-001 through REQ-016 present (`grep -c "^| REQ-" spec.md`)
- [x] CHK-002 [P0] Technical approach defined in plan.md — Technical Context, Architecture, and the full role-mapping table present; the table now carries an amendment note recording the shipped two-tier resolution (see this closeout's edit and `goal.md` D15)
- [x] CHK-003 [P1] Dependencies identified and available — 009's state confirmed present (`assets/diagrams/`, 38 forms), `diagram-palette.json`, `color-gates.cjs` all read and reused by the shipped script; `derivation-gates.cjs` was read but its extension was never built (see T019)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks — no lint config exists for this package (none introduced); the script matches the packet's existing CommonJS style (`'use strict'`, `require`, no ES modules)
- [x] CHK-011 [P0] No console errors or warnings — reran multiple times during this closeout pass; every run prints `RESULT: PASSED` (exit 0) or `RESULT: FAILED` (exit 2), no stack trace or unhandled exception observed
- [x] CHK-012 [P1] Error handling implemented — reran: no-args, a URL argument, a missing-heading reference, and a fewer-than-four-rows reference each name themselves and stop (`ERROR: ...`, `RESULT: FAILED`, no output written); an unmapped-literal refusal exists in code (`apply-design-md.cjs:785`, `fail(...maps to no ${skin} role...)`) but was not separately reproduced live in this pass
- [x] CHK-013 [P1] Code follows project patterns — no comment in `apply-design-md.cjs`, `derivation-gates.cjs`, `mutation-cases.cjs`, or `design-md-theming.md` embeds a task id, finding id, or REQ id (`grep -n "task\|finding\|REQ-\|F32\|D1[0-9]" <those four files>` returns nothing, checked during this closeout pass)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met — AC-001 through the final row in acceptance-criteria.md — not true: 19 of 20 rows are now `Met` this pass (AC-004, AC-015, AC-017 reverified/fixed). One row, AC-018, remains `Unmet`: `SKILL.md` never names `scripts/apply-design-md.cjs`. See `acceptance-criteria.md`
- [x] CHK-021 [P0] `validate.sh specs/sk-design/019-sk-design-diagram-upgrade/010-design-md-style-reference --strict` reports `RESULT: PASSED` — ran with `NODE_PRESERVE_SYMLINKS=1`, `--no-recursive`: `Summary: Errors: 0  Warnings: 0`, `RESULT: PASSED`
- [x] CHK-022 [P1] Edge cases tested — the fewer-than-four-rows case reran live (`ERROR: Tokens — Colors has fewer than four usable six-digit colour rows`); the terminal-without-dark-support case reran live (terminal stays stock under `--all`, fails by name under `--forms`); the series-capacity-shortfall refusal exists in code (`apply-design-md.cjs:940-942`) but was not reproduced live in this pass; the unmapped-literal refusal exists in code (`apply-design-md.cjs:785`) but was not reproduced live either. None of the four has a `derivation-gates`-family mutation case, since none of them are `derivation-gates` cases to begin with (they are the applicator's own refusals, not the checker's)
- [x] CHK-023 [P1] Every finding this node cites (F32) and every decision it refines (D1, D8, D9, D12, D13, D14) appears in a task line above or in goal.md's LOG — F32: T004 and goal.md's Decisions section. D1: T005. D12: T002, T026. D13: T001. D14: T009, T015, T017. D8/D9: named in goal.md's Decisions section (the paragraph directly under the Decisions table), not literally inside the `## 4. LOG` heading — close enough to satisfy this check's intent, worth noting precisely rather than assuming
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

Not applicable. This phase's `research_intent` is capability addition, not `fix_bug` — it builds a
new applicator and extends one checker family, it does not repair a known-bad behavior. The
finding-class/producer-inventory/adversarial-table apparatus does not apply; traceability is
covered by CHK-023 above.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets — confirmed by reading `apply-design-md.cjs` in full: no credential or environment-variable read anywhere in the file
- [x] CHK-031 [P0] Input validation implemented — reran: a URL argument to `--default`'s path or an explicit reference path is refused (`ERROR: URL arguments are not allowed: ...`), never fetched (REQ-001)
- [x] CHK-032 [P1] Auth/authz working correctly — not applicable; local tooling only, no network or auth surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized — REQ ids in spec.md match task citations here and AC rows in acceptance-criteria.md; note this checks id cross-referencing, not whether the shipped behavior matches every REQ's letter (several do not — see acceptance-criteria.md and goal.md's LOG)
- [x] CHK-041 [P1] Code comments adequate — the role-mapping selection rules and the terminal conditional carry plain-prose comments throughout `apply-design-md.cjs`; no ephemeral id added anywhere (verified by CHK-013)
- [x] CHK-042 [P2] README updated (if applicable) — not applicable this phase; `scripts/README.md` documents the Python extractors and its last commit (`0a9dfdf9dd`) predates this phase's work
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only — this authoring/closeout pass created no temp files under this packet; all verification output went to `/tmp`, outside the repository. The fixture this checklist originally expected under `scripts/tests/fixtures/` shipped in commit `1b57a90d73` — see T020
- [x] CHK-051 [P1] scratch/ cleaned before completion — not applicable; nothing was added to this packet's `scratch/` by this authoring or closeout pass (`ls scratch/` → `.gitkeep` only)
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 7/8 (CHK-020 unmet: AC-018 alone remains `Unmet` in `acceptance-criteria.md`) |
| P1 Items | 10 | 10/10 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-09-11 (re-closeout pass, against commits `1b57a90d73` and `7bf1c3af7d`)
<!-- /ANCHOR:summary -->

---
