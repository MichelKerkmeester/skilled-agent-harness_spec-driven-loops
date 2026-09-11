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
| AC-001 | REQ-001 | Given `apply-design-md.cjs` with no arguments, When it is run, Then it refuses with an error naming the missing reference path, offers no force flag, and refuses any URL argument | `node apply-design-md.cjs` and `node apply-design-md.cjs https://example.com/DESIGN.md --all --out /tmp/x` both exit non-zero and name the refusal | Unmet | - |
| AC-002 | REQ-002 | Given a reference missing `## Tokens — Colors`, When the script parses it, Then it fails naming that exact heading and writes no file | `node apply-design-md.cjs <malformed> --all --out <dir>` prints a `Missing section` line and creates no `<dir>` | Unmet | - |
| AC-003 | REQ-003 | Given a selected form declaring four roles in its sentinel block, When the script derives its palette, Then only those four roles (plus any literal-only roles the file uses, per T014) are derived — no undeclared role is invented | `apply-design-md.cjs`'s stdout `MAPPING` lines for that form list exactly the roles the file actually uses | Unmet | - |
| AC-004 | REQ-004 | Given the full role-mapping table in `plan.md` §3.1, When checked against `assets/color/diagram-palette.json`, Then every role in every skin (light 12, dark 4, terminal 9, plus series-1..5) has exactly one table row | Direct comparison: `plan.md`'s table row count and `diagram-palette.json`'s role keys reconcile 1:1 per skin | Unmet | - |
| AC-005 | REQ-005 | Given a themed `ink` and `muted` value, When `rule` and `rule-solid` are written, Then their alpha and base colour equal `ink`/`muted` exactly, with no reference-table lookup involved | `derivation-gates.cjs` re-derives `rule`/`rule-solid` from the block's own `ink`/`muted` and reports no mismatch | Unmet | - |
| AC-006 | REQ-006 | Given a reference with no declared dark support, When a terminal-skinned form is themed under `--all`, Then the terminal skin stays fully stock and the run prints a note naming the reason | Run against a light-only reference; terminal form's written bytes equal its stock source; a `NOTE`/`SKIP` line names the missing dark support | Unmet | - |
| AC-007 | REQ-006 | Given a reference that declares dark support but supplies only two distinct dark neutrals, When a terminal-skinned form is named explicitly via `--forms`, Then the run fails by name rather than reusing a neutral twice | `node apply-design-md.cjs <ref> --forms starter-terminal --out <dir>` exits non-zero naming the neutral-count shortfall | Unmet | - |
| AC-008 | REQ-007 | Given a reference whose most-saturated chromatic row does not clear `markOnPaper` (3.0:1), When `accent` is derived, Then the run fails by name with the measured ratio, the gate, and the nearest clearing row | Constructed reference with only sub-gate chromatic rows; `FAILURE` line names `accent`, its ratio, and `markOnPaper` | Unmet | - |
| AC-009 | REQ-008 | Given a reference with only three chromatic-or-neutral candidates clearing the series gate, When a form declaring `series-3` is named, Then that form fails by name (or is skipped with a note under `--all`) while unrelated forms still theme | Targeted `--forms` run against the short reference fails only the series-using form; `--all` run against it prints a `SKIP`/`NOTE` line for that form and still writes the rest | Unmet | - |
| AC-010 | REQ-009 | Given a successful run, When a themed form is written, Then its sentinel block reads `DIAGRAM_PALETTE:BEGIN skin=<skin> system=design-md` immediately followed by a provenance comment carrying the repository-relative input path and the input file's SHA-256 | `grep -A1 "DIAGRAM_PALETTE:BEGIN.*system=design-md" <written form>` shows both lines in the expected shape | Unmet | - |
| AC-011 | REQ-010 | Given any single role fails its gate anywhere among the selected forms, When the run completes, Then `RESULT: FAILED` is printed and no form is written to `--out` | Constructed failing reference; `--out` directory does not exist (or is empty) after the run | Unmet | - |
| AC-012 | REQ-011 | Given `references/design-md-theming.md`, When read, Then it documents the command, the three parsed headings, the full role-mapping table (or a pointer to `plan.md`'s), the terminal decision, and the gates | Manual read against the five required sections; each present | Unmet | - |
| AC-013 | REQ-012 | Given `assets/style-reference/diagram-stock/origin.md`, When read, Then it states plainly the reference was authored from `assets/color/diagram-palette.json` and was not measured from an external product | Manual read; the sentence is present and unambiguous | Unmet | - |
| AC-014 | REQ-013 | Given `--default --all --out <dir>`, When run, Then every derived role equals the corresponding value in `assets/color/diagram-palette.json`, and every written file is byte-identical to its stock source | `diff -rq <dir> <stock forms dir>` reports no differences | Unmet | - |
| AC-015 | REQ-014 | Given a `system=design-md` block missing its provenance comment, When `check-diagram-corpus.cjs --extra <dir>` runs, Then the `derivation-gates` family fails naming the missing provenance, and a well-formed `system=design-md` block with an in-gate value passes without requiring byte equality to the record | Two constructed fixtures, one per direction, both exercised via `--extra` | Unmet | - |
| AC-016 | REQ-014 | Given the existing stock `template.html` with its `--color-muted` value drifted, When `check-diagram-corpus.cjs` runs, Then `derivation-gates` still fails on byte-inequality exactly as it does today — the extension does not weaken this regression | The pre-existing `mutation-cases.cjs` "a template whose palette block drifts from the token source" case still passes unmodified | Unmet | - |
| AC-017 | REQ-015 | Given `scripts/tests/corpus-mutations.test.cjs`, When `node --test scripts/tests/` runs, Then it includes the two new `derivation-gates` cases and the completeness triple reports no family without a case | `node --test scripts/tests/` output lists both new case names and all three completeness-triple tests passing | Unmet | - |
| AC-018 | REQ-016 | Given `SKILL.md`, When read, Then it names the Style-Reference capability in WHEN TO USE, documents it in HOW IT WORKS, links `scripts/apply-design-md.cjs` and `references/design-md-theming.md` in REFERENCES, and its frontmatter `version` is bumped from the pre-change value | `grep -n "design-md" SKILL.md` finds all four; `git diff SKILL.md` shows the version-line change | Unmet | - |
| AC-019 | SC-005 | Given the untouched stock corpus, When `check-diagram-corpus.cjs` runs after this phase's changes land, Then it still prints `RESULT: PASSED` with the same or fewer failures than the pre-change baseline | `node check-diagram-corpus.cjs` exit `0`, `RESULT: PASSED` line present | Unmet | - |
| AC-020 | SC-006 | Given this phase's full diff, When `git diff` is scoped to `sk-design-chart/`, Then it is empty | `git diff --stat -- .opencode/skills/sk-design/sk-design-chart` prints nothing | Unmet | - |

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

Not yet executed. This document was authored alongside `spec.md`, `plan.md`, `tasks.md`, and
`goal.md`; every row above is `Unmet` pending T001-T026. Write the closure sentence here once the
run against a real `--out` directory, the extended `derivation-gates` mutation cases, and the
corpus regression check have all been observed, not before.
<!-- /ANCHOR:closure -->
