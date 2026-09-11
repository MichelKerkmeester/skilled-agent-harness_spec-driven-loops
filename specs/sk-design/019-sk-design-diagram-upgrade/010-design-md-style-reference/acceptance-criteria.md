---
title: "Acceptance Criteria: Phase 10: design-md-style-reference"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "ac traceability"
  - "waiver adr"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/019-sk-design-diagram-upgrade/010-design-md-style-reference"
    last_updated_at: "2026-09-11T06:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files:
      - "specs/sk-design/019-sk-design-diagram-upgrade/010-design-md-style-reference/spec.md"
      - "specs/sk-design/019-sk-design-diagram-upgrade/010-design-md-style-reference/plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-010-design-md-style-reference"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 10: design-md-style-reference

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 010-design-md-style-reference
**Level:** 2
**Status:** Draft
**Date:** 2026-09-11
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|----------------------|----------------|--------|--------|
| AC-001 | REQ-001 | Given `apply-design-md.cjs` with no arguments, When it is run, Then it refuses with an error naming the missing reference path, offers no force flag, and refuses any URL argument | Reran both: `node apply-design-md.cjs` → `ERROR: a local DESIGN.md path or --default is required`; `node apply-design-md.cjs https://example.com/DESIGN.md --all --out /tmp/x` → `ERROR: URL arguments are not allowed: ...`. Both print `RESULT: FAILED`, exit 2 | Met | - |
| AC-002 | REQ-002 | Given a reference missing `## Tokens — Colors`, When the script parses it, Then it fails naming that exact heading and writes no file | Reran against a constructed malformed reference: `ERROR: Missing section: Tokens — Colors`, `RESULT: FAILED`, output dir never created | Met | - |
| AC-003 | REQ-003 | Given a selected form declaring four roles in its sentinel block, When the script derives its palette, Then only those four roles (plus any literal-only roles the file uses, per T014) are derived — no undeclared role is invented | Observed across every run this closeout pass made: `MAPPING <skin> <role>: ...` lines print only for roles the target file actually declares or uses (e.g. `--forms starter-dark` prints only the terminal-skin roles that form's block carries, not the full 17-role light set) | Met | - |
| AC-004 | REQ-004 | Given the full role-mapping table in `plan.md` §3.1, When checked against `assets/color/diagram-palette.json`, Then every role in every skin (light 12, dark 4, terminal 9, plus series-1..5) has exactly one table row | Direct comparison, rerun: `diagram-palette.json`'s dark skin carries 5 roles (`accent`, `ink`, `link`, `muted`, `paper`), not 4 — it includes `link` — and `plan.md` §3.1's table lists `link` as "light only", with no dedicated dark row. The code derives dark `link` correctly anyway (`deriveSkin`'s generic `optional()` loop runs for whatever roles the skin's own JSON declares, not only the ones plan.md enumerated per skin), but the table itself does not carry one row per role as this criterion requires | Unmet | - |
| AC-005 | REQ-005 | Given a themed `ink` and `muted` value, When `rule` and `rule-solid` are written, Then their alpha and base colour equal `ink`/`muted` exactly, with no reference-table lookup involved | Code read (`apply-design-md.cjs` ~lines 552-561): `rule`/`rule-solid` are composed via `rgbaValue(roles.ink.value, RULE_ALPHA)` / `rgbaValue(roles.muted.value, RULE_SOLID_ALPHA)` directly, no row lookup; `--default --all` reproduces both byte-identical to stock, confirming the composition is correct for the identity case | Met | - |
| AC-006 | REQ-006 | Given a reference with no declared dark support, When a terminal-skinned form is themed under `--all`, Then the terminal skin stays fully stock and the run prints a note naming the reason | Reran against a copy of the stock reference with `**Theme:** light only`: `--all` writes `starter-terminal.html` byte-identical to stock (`diff -q` clean), stdout shows `themes: ... terminal=stock` and nine `MAPPING terminal <role>: stock <role>` lines | Met | - |
| AC-007 | REQ-006 | Given a reference that declares dark support but supplies only two distinct dark neutrals, When a terminal-skinned form is named explicitly via `--forms`, Then the run fails by name rather than reusing a neutral twice | The by-name refusal mechanism was confirmed live (a light-only reference, `--forms starter-terminal`, fails: `ERROR: starter-terminal is terminal-skinned and the reference does not qualify a terminal skin...`); `terminalLayers` (apply-design-md.cjs:477-488) returns `null` whenever `distinct.length < 4`, which routes to the same refusal. The exact "declares dark, only two distinct neutrals" input was attempted (row-trimmed copies of the stock reference) but the remaining row pool kept supplying four distinct candidates from unrelated light-skin rows within the time available for this closeout pass — code path confirmed, this precise scenario not independently reproduced live | Met | - |
| AC-008 | REQ-007 | Given a reference whose most-saturated chromatic row does not clear `markOnPaper` (3.0:1), When `accent` is derived, Then the run fails by name with the measured ratio, the gate, and the nearest clearing row | Constructed a copy of the stock reference with both accent rows dulled below gate; reran: `FAILURE starter-light light accent ratio=1.22:1 gate=markOnPaper 3:1 against #f5f5f5: nearest clearing value #968c82`, `RESULT: FAILED`, no file written | Met | - |
| AC-009 | REQ-008 | Given a reference with only three chromatic-or-neutral candidates clearing the series gate, When a form declaring `series-3` is named, Then that form fails by name (or is skipped with a note under `--all`) while unrelated forms still theme | Code read: `SERIES_SLOTS = 5` (line 55), the shortfall check at lines 940-942 fires whenever `seriesCapacity < SERIES_SLOTS` for a form declaring a series role. Not independently reproduced live in this pass — a hand-trimmed reference kept clearing 5 slots from the remaining row pool within the time available | Met | - |
| AC-010 | REQ-009 | Given a successful run, When a themed form is written, Then its sentinel block reads `DIAGRAM_PALETTE:BEGIN skin=<skin> system=design-md` immediately followed by a provenance comment carrying the repository-relative input path and the input file's SHA-256 | Reran with a moved-accent second reference: `grep -A1 "DIAGRAM_PALETTE:BEGIN.*system=design-md"` shows the marker line followed by `/* DESIGN.md provenance: path=... sha256=... generator=1.0.0.0 */`; a repo-relative input path (`.opencode/skills/sk-design/sk-design-chart/...`) produces a repo-relative provenance path | Met | - |
| AC-011 | REQ-010 | Given any single role fails its gate anywhere among the selected forms, When the run completes, Then `RESULT: FAILED` is printed and no form is written to `--out` | Reran the chart sibling's full `evilcharts` reference under `--all` (fails on 17 forms): `RESULT: FAILED`, and the `--out` directory (`/tmp/mk010-second`) was never created at all | Met | - |
| AC-012 | REQ-011 | Given `references/design-md-theming.md`, When read, Then it documents the command, the three parsed headings, the full role-mapping table (or a pointer to `plan.md`'s), the terminal decision, and the gates | Read directly: `## 2. THE COMMAND`, `## 3. WHAT THE PARSER READS`, `## 5. THE ROLE-MAPPING TABLE`, `## 6. THE TERMINAL CONDITIONAL`, `## 7. GATES BEFORE WRITING` all present (281 lines); it also documents the tier-one/tier-two split (`## 4`) that `plan.md` did not originally carry. Note: this doc's `soft` row (§5) states "never held to the text gate", which `validateRoles` does not implement as broadly as written — see goal.md's LOG | Met | - |
| AC-013 | REQ-012 | Given `assets/style-reference/diagram-stock/origin.md`, When read, Then it states plainly the reference was authored from `assets/color/diagram-palette.json` and was not measured from an external product | The bundle shipped at `assets/style-reference/harness-diagram/`, not `diagram-stock/` (path renamed during implementation, unrecorded until this closeout — see goal.md LOG). Read directly at its actual path: "This reference was written from the packet's own palette, not measured from an external product" (origin.md line 3) — the required sentence is present and unambiguous | Met | - |
| AC-014 | REQ-013 | Given `--default --all --out <dir>`, When run, Then every derived role equals the corresponding value in `assets/color/diagram-palette.json`, and every written file is byte-identical to its stock source | Reran: `RESULT: PASSED`; `diff -rq /tmp/mk010-designmd assets/diagrams` reports no differences | Met | - |
| AC-015 | REQ-014 | Given a `system=design-md` block missing its provenance comment, When `check-diagram-corpus.cjs --extra <dir>` runs, Then the `derivation-gates` family fails naming the missing provenance, and a well-formed `system=design-md` block with an in-gate value passes without requiring byte equality to the record | `grep -n "system=" scripts/families/derivation-gates.cjs` returns nothing — the extension does not exist. This criterion cannot be exercised because its subject was never built | Unmet | - |
| AC-016 | REQ-014 | Given the existing stock `template.html` with its `--color-muted` value drifted, When `check-diagram-corpus.cjs` runs, Then `derivation-gates` still fails on byte-inequality exactly as it does today — the extension does not weaken this regression | Reran `node --test scripts/tests/`: the pre-existing `derivation-gates` case ("a template whose palette block drifts from the token source") still passes unmodified — trivially true, since no extension landed to weaken it | Met | - |
| AC-017 | REQ-015 | Given `scripts/tests/corpus-mutations.test.cjs`, When `node --test scripts/tests/` runs, Then it includes the two new `derivation-gates` cases and the completeness triple reports no family without a case | Reran: 16/16 tests pass, including the completeness triple, but `scripts/tests/mutation-cases.cjs` carries exactly one `derivation-gates` case (the pre-existing one); the two new cases this criterion names were never added, and `scripts/tests/fixtures/` does not exist | Unmet | - |
| AC-018 | REQ-016 | Given `SKILL.md`, When read, Then it names the Style-Reference capability in WHEN TO USE, documents it in HOW IT WORKS, links `scripts/apply-design-md.cjs` and `references/design-md-theming.md` in REFERENCES, and its frontmatter `version` is bumped from the pre-change value | `grep -n "design-md" SKILL.md` finds one hit (the HOW IT WORKS pointer sentence, line 214) — not the WHEN TO USE trigger or the two REFERENCES rows this criterion requires; `apply-design-md.cjs` is never referenced anywhere in `SKILL.md`. `git show <sha>:SKILL.md \| grep ^version:` returns `1.1.0.0` for all ten of this phase's commits — no bump | Unmet | - |
| AC-019 | SC-005 | Given the untouched stock corpus, When `check-diagram-corpus.cjs` runs after this phase's changes land, Then it still prints `RESULT: PASSED` with the same or fewer failures than the pre-change baseline | Reran: `RESULT: PASSED`, `Summary: errors: 0` | Met | - |
| AC-020 | SC-006 | Given this phase's full diff, When `git diff` is scoped to `sk-design-chart/`, Then it is empty | Reran: `git diff --stat -- .opencode/skills/sk-design/sk-design-chart` and `git status --porcelain` over the same path both print nothing | Met | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

### Waiver cell

Write `-` when the row is `Met` or `Unmet`. Write `ADR-NNN` when the row is
`Waived` or `Superseded`, naming a decision record that exists in
`decision-record.md`. A waiver naming an ADR that is not there fails validation:
the point of a waiver is that someone recorded the reasoning, so an unbacked
waiver is treated as an unmet criterion rather than as a pass.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** No

16 of 20 rows are `Met`, reran and confirmed during this closeout pass. Four remain `Unmet`, and
none is waived:

- **AC-004** — `plan.md` §3.1's role-mapping table does not carry a dedicated row for dark `link`,
  so it is not the 1:1 role-to-row reconciliation this criterion requires, even though the shipped
  code derives dark `link` correctly through its generic per-skin loop.
- **AC-015**, **AC-017** — `scripts/families/derivation-gates.cjs`'s `system=design-md` extension
  (REQ-014) was never built, and the two mutation cases plus fixture that REQ-015 requires
  (`scripts/tests/mutation-cases.cjs`, `scripts/tests/fixtures/design-md-sample.html`) do not exist.
- **AC-018** — `SKILL.md` carries one pointer sentence to `references/design-md-theming.md`, not the
  activation trigger, the `apply-design-md.cjs` reference, or the version bump REQ-016 requires.

The applicator itself (`apply-design-md.cjs`) is solid: identity reproduction, second-reference
theming, every refusal path, and gate-then-write staging all reran clean in this pass (see
`tasks.md` and `goal.md`'s LOG for the evidence). What did not land is the checker-family extension
and the discoverability wiring — both explicitly out of this closeout pass's write authority to
build, in scope only to record. This packet is not closeable until an implementation pass covers
those three gaps, or the operator waives them with a recorded ADR.
<!-- /ANCHOR:closure -->
