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

- [ ] T001 Confirm 009's merged form library state on disk before assuming `assets/diagrams/` exists; if 009 has not landed, build against `assets/templates/` + `assets/examples/` instead and record which path was actually used (D13) (scripts/apply-design-md.cjs) — executor: DeepSeek V4.1 Flash max via cli-pi
- [ ] T002 [P] Read `sk-design-chart/scripts/apply-design-md.cjs`, `references/design-md-theming.md`, and `assets/style-reference/evilcharts/{DESIGN.md,origin.md,tokens.json}` as the read-only worked example; confirm no `sk-design-chart` file enters this phase's edit set (D12) (scripts/apply-design-md.cjs, references/design-md-theming.md) — executor: DeepSeek V4.1 Flash max via cli-pi
- [ ] T003 [P] Read `assets/color/diagram-palette.json`, `scripts/apply-diagram-tokens.cjs`, `scripts/color-gates.cjs`, and `scripts/families/derivation-gates.cjs` in full to confirm the exact role vocabulary, gate thresholds, departures, and sentinel grammar this phase must theme and extend (goal.md) — executor: DeepSeek V4.1 Flash max via cli-pi
- [ ] T004 [P] Read finding F32 (`link` declared outside the sentinel block in `template.html`/`template-dark.html`, `rule-solid`/`accent-tint` dead in `template-full.html`) and confirm the whole-file literal-remapping design in `plan.md` avoids inheriting its blind spot rather than routing around it silently (goal.md)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Scaffold `scripts/apply-design-md.cjs`: argument parsing (`--default`, a local path, `--forms`, `--all`, `--out`, `--tokens`), URL refusal, no force option; omit `--scheme` since D1 gives each form exactly one skin to select (REQ-001) (scripts/apply-design-md.cjs) — executor: DeepSeek V4.1 Flash max via cli-pi
- [ ] T006 Port the v3 heading parser (`## Tokens — Colors`, `## Tokens — Typography`, `## Tokens — Spacing & Shapes` → `### Border Radius`) by reading the chart script's `section`/`tableRows`/`parseColors`/`parseTypography`/`parseRadius` functions for shape, never by importing them (D12; REQ-002) (scripts/apply-design-md.cjs) — executor: DeepSeek V4.1 Flash max via cli-pi
- [ ] T007 Build the light-skin core-role derivation for `paper`, `ink`, `muted`, `accent` per `plan.md`'s role-mapping table rows 1, 3, 5, 7 (REQ-003, REQ-007) (scripts/apply-design-md.cjs) — executor: DeepSeek V4.1 Flash max via cli-pi
- [ ] T008 [P] Build the light-skin extended-role derivation for `paper-2`, `soft`, `link`, `backend-fill`, `high-level-chevron` per `plan.md`'s role-mapping table rows for each, including every stated fallback-collapse and the ink-alias for `high-level-chevron` (REQ-004) (scripts/apply-design-md.cjs) — executor: DeepSeek V4.1 Flash max via cli-pi
- [ ] T009 [P] Build the mechanical derivation for `rule`, `rule-solid`, `accent-tint` on both light and dark skins — alpha-composed from the already-selected `ink`/`muted`/`accent`, never looked up in the reference table (REQ-005) (scripts/apply-design-md.cjs) — executor: DeepSeek V4.1 Flash max via cli-pi
- [ ] T010 Build the dark-skin role derivation for `paper`, `ink`, `muted`, `accent`, reusing the same table and the opposite luminance direction, picked independently of the light picks (REQ-003) (scripts/apply-design-md.cjs) — executor: DeepSeek V4.1 Flash max via cli-pi
- [ ] T011 Build the terminal-skin conditional: test the reference's declared dark support the same way the chart's `themeIsDeclaredDark` does, require four distinct usable dark neutrals darker than the light `paper`, and derive `page`/`bar`/`paper`/`border` by luminance-ascending order when both hold; otherwise keep all nine terminal roles stock and say so by name (REQ-006) (scripts/apply-design-md.cjs) — executor: DeepSeek V4.1 Flash max via cli-pi
- [ ] T012 Build terminal's `ink`/`muted`/`soft`/`accent`/`accent-tint` derivation against the terminal `paper` chosen in T011, reusing the light/dark selection rules unchanged (REQ-004) (scripts/apply-design-md.cjs) — executor: DeepSeek V4.1 Flash max via cli-pi
- [ ] T013 Build the optional `series-1` through `series-5` derivation (five slots, widened from the chart's four) with the by-name / `--all`-note refusal when fewer than five candidates clear (REQ-008) (scripts/apply-design-md.cjs) — executor: DeepSeek V4.1 Flash max via cli-pi
- [ ] T014 Build the whole-file literal-remapping writer: map every stock role value in the selected form to its derived value (the same `byValue`/`HEX_LITERAL` approach `apply-diagram-tokens.cjs`'s `paintExample` already uses), so a role used outside its sentinel block repaints correctly and F32's blind spot is not inherited; a literal matching no known role is refused by name (REQ-003) (scripts/apply-design-md.cjs) — executor: DeepSeek V4.1 Flash max via cli-pi
- [ ] T015 Rewrite the form's own sentinel block with the extended marker `DIAGRAM_PALETTE:BEGIN skin=<skin> system=design-md` and the provenance comment (input path, SHA-256, generator version), matching the chart script's provenance shape (D14; REQ-009) (scripts/apply-design-md.cjs) — executor: DeepSeek V4.1 Flash max via cli-pi
- [ ] T016 Wire the gate checks (`textOnPaper`, `markOnPaper`, `accentAgainstInk`, the accent's recorded 2.863:1 departure) through `color-gates.cjs`, stage every output in memory, and print `RESULT: PASSED`/`RESULT: FAILED` with no file written on a failure (REQ-010) (scripts/apply-design-md.cjs) — executor: DeepSeek V4.1 Flash max via cli-pi
- [ ] T017 Author `assets/style-reference/diagram-stock/DESIGN.md`, `origin.md`, and `tokens.json`: a Colors/Typography/Radius table curated so the T007-T013 selection rules reproduce every `assets/color/diagram-palette.json` role exactly; `tokens.json` declares dark-theme support; `origin.md` states plainly the reference was authored from that palette, not measured (REQ-012) (assets/style-reference/diagram-stock/DESIGN.md, origin.md, tokens.json) — executor: DeepSeek V4.1 Flash max via cli-pi
- [ ] T018 Run `node apply-design-md.cjs --default --all --out <dir>` and byte-diff every written file against the stock corpus; iterate the T017 table until the diff is empty (REQ-013) (scripts/apply-design-md.cjs, assets/style-reference/diagram-stock/DESIGN.md) — executor: DeepSeek V4.1 Flash max via cli-pi
- [ ] T019 Extend `scripts/families/derivation-gates.cjs`: accept an optional ` system=<id>` token in the sentinel marker, require and validate the provenance comment for a `system=design-md` block, skip the byte-equality-against-record check for that block only, and keep every other check — including the stock block's byte-equality regression — unchanged (D14; REQ-014) (scripts/families/derivation-gates.cjs) — executor: DeepSeek V4.1 Flash max via cli-pi
- [ ] T020 Add `scripts/tests/fixtures/design-md-sample.html`, a minimal fixture carrying one passing `system=design-md` block, and two new `derivation-gates` entries to `scripts/tests/mutation-cases.cjs`: a missing provenance comment, and an inline value that fails its gate (REQ-015) (scripts/tests/fixtures/design-md-sample.html, scripts/tests/mutation-cases.cjs) — executor: DeepSeek V4.1 Flash max via cli-pi
- [ ] T021 Author `references/design-md-theming.md`: the command, the parsed headings, the full role-mapping table, the terminal decision, and the gates, mirroring the chart sibling's reference doc shape (REQ-011) (references/design-md-theming.md) — executor: DeepSeek V4.1 Flash max via cli-pi
- [ ] T022 Wire `SKILL.md`: an activation-trigger bullet in WHEN TO USE, an "Applying a Style Reference" paragraph in HOW IT WORKS pointing at the new script and reference doc, two REFERENCES rows, and a minor version bump per the Frontmatter Versioning Standard (REQ-016) (SKILL.md) — executor: DeepSeek V4.1 Flash max via cli-pi
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T023 Run `node --test scripts/tests/` locally and read the output line by line: the two new cases pass for their stated reason, the existing stock-drift case still passes unchanged, and the completeness triple reports clean (scripts/tests/corpus-mutations.test.cjs) — executor: human review
- [ ] T024 Run `node scripts/check-diagram-corpus.cjs` against the untouched stock corpus and confirm `RESULT: PASSED` with no regression against the pre-change baseline (scripts/check-diagram-corpus.cjs) — executor: human review
- [ ] T025 Run `apply-design-md.cjs` against a second, distinct reference (the chart sibling's own `assets/style-reference/evilcharts/DESIGN.md` is a sufficient stress input) and confirm a themed copy is written, clears every gate, and prints `RESULT: PASSED` (REQ-002; SC-002) — executor: human review
- [ ] T026 Confirm `git diff` over `sk-design-chart/` is empty and push a confirming commit (D12; SC-006) (.opencode/skills/sk-design/sk-design-chart/) — executor: human review
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
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

- [ ] CHK-001 [P0] Requirements documented in spec.md — REQ-001 through REQ-016 present
- [ ] CHK-002 [P0] Technical approach defined in plan.md — Technical Context, Architecture, and the full role-mapping table present
- [ ] CHK-003 [P1] Dependencies identified and available — 009's state, `diagram-palette.json`, `color-gates.cjs`, `derivation-gates.cjs`, and the chart sibling's applicator/reference/stock-reference all read and cited
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Code passes lint/format checks — the new script and the checker extension follow the packet's existing CommonJS style; no new lint config introduced
- [ ] CHK-011 [P0] No console errors or warnings — the script prints `RESULT: PASSED` or `RESULT: FAILED` and a matching exit code, mirroring the chart's own contract
- [ ] CHK-012 [P1] Error handling implemented — a missing heading, a URL argument, an unmapped literal, or a failing gate names itself and stops the run rather than crashing or guessing
- [ ] CHK-013 [P1] Code follows project patterns — no comment in `apply-design-md.cjs`, `derivation-gates.cjs`, `mutation-cases.cjs`, or `design-md-theming.md` embeds a task id, finding id, or REQ id (comment-hygiene hard block)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met — AC-001 through the final row in acceptance-criteria.md
- [ ] CHK-021 [P0] `validate.sh specs/sk-design/019-sk-design-diagram-upgrade/010-design-md-style-reference --strict` reports `RESULT: PASSED` (run by the orchestrator, not this authoring pass)
- [ ] CHK-022 [P1] Edge cases tested — the fewer-than-four-rows, terminal-without-dark-support, series-capacity-shortfall, and unmapped-literal cases from spec.md §8 EDGE CASES each map to a refusal or a mutation case
- [ ] CHK-023 [P1] Every finding this node cites (F32) and every decision it refines (D1, D8, D9, D12, D13, D14) appears in a task line above or in goal.md's LOG
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

- [ ] CHK-030 [P0] No hardcoded secrets — no script this phase touches reads a credential or an environment variable
- [ ] CHK-031 [P0] Input validation implemented — a URL argument to `--default`'s path or an explicit reference path is refused rather than fetched (REQ-001)
- [ ] CHK-032 [P1] Auth/authz working correctly — not applicable; local tooling only, no network or auth surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized — REQ ids in spec.md match task citations here and AC rows in acceptance-criteria.md
- [ ] CHK-041 [P1] Code comments adequate — the role-mapping selection rules and the terminal conditional carry plain-prose comments; no ephemeral id added anywhere (verified by CHK-013)
- [ ] CHK-042 [P2] README updated (if applicable) — not applicable this phase; `scripts/README.md` documents the Python extractors and is unmodified by this phase's addition
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only — this authoring pass created no temp files; the new fixture lives under `scripts/tests/fixtures/`, a committed directory, not a scratch artifact
- [ ] CHK-051 [P1] scratch/ cleaned before completion — not applicable; nothing was added to this packet's scratch/ by this authoring pass
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 0/11 |
| P1 Items | 12 | 0/12 |
| P2 Items | 2 | 0/2 |

**Verification Date**: 2026-09-11
<!-- /ANCHOR:summary -->

---
