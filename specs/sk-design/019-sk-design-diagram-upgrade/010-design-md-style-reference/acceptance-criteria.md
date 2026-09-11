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
    last_updated_at: "2026-09-11T10:15:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Re-closed against 9371f99938/76ad403c52: AC-004/015/017 now Met; AC-018 still Unmet"
    next_safe_action: "Add apply-design-md.cjs to SKILL.md, or waive AC-018 with an ADR"
    blockers:
      - "AC-018: SKILL.md never names scripts/apply-design-md.cjs, the one part of REQ-016 that did not ship"
    key_files:
      - "specs/sk-design/019-sk-design-diagram-upgrade/010-design-md-style-reference/spec.md"
      - "specs/sk-design/019-sk-design-diagram-upgrade/010-design-md-style-reference/plan.md"
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
| AC-004 | REQ-004 | Given the full role-mapping table in `plan.md` §3.1, When checked against `assets/color/diagram-palette.json`, Then every role in every skin (light 12, dark 4, terminal 9, plus series-1..5) has exactly one table row | `diagram-palette.json`'s dark skin actually carries 5 roles (`accent`, `ink`, `link`, `muted`, `paper`), not 4 as the criterion's own parenthetical assumed. Fixed in this closeout pass: `plan.md` §3.1's single "light only" `link` row is now split into a `link`/`light` row (unchanged) and a `link`/`dark` row ("Same rule as light, run against dark `paper` and the already-chosen dark `accent`, picked independently"). Confirmed against the code, not just asserted: `deriveSkin`'s `optional('link', ...)` (apply-design-md.cjs:581-585) calls the same `chooseLink` function for every skin whose JSON declares the role, passing that skin's own `ground` and `roles.accent.value` — so dark `link` already went through this exact rule before the fix; the fix makes the table say so. `node scripts/apply-design-md.cjs --default --all --out <dir>` still reproduces every dark form byte-identical to stock (rerun this pass), which includes dark `link`'s identity value | Met | - |
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
| AC-015 | REQ-014 | Given a `system=design-md` block missing its provenance comment, When `check-diagram-corpus.cjs --extra <dir>` runs, Then the `derivation-gates` family fails naming the missing provenance, and a well-formed `system=design-md` block with an in-gate value passes without requiring byte equality to the record | Built in commit `9371f99938` and reran live this pass, both halves independently: (1) copied `scripts/tests/fixtures/design-md-sample.html` to a scratch dir, deleted its provenance comment, ran `check-diagram-corpus.cjs --extra <dir>` → `FAIL [derivation-gates] ...: the block is marked system=design-md and carries no well-formed DESIGN.md provenance comment ...`. (2) ran the same checker against the unmutated fixture → `derivation-gates: 67 assertion(s), 0 failure(s)`, `RESULT: PASSED` — and the fixture's `--color-accent: #b34a1e` differs from the token source's stock accent `#eb6c36` (confirmed by reading `diagram-palette.json`), so the pass is real, not an accidental byte match. Judgment: the brief that originally specified this criterion's verification command named a form with no palette block, themed under `--default`; `--default` is an identity reference, so `renderForm`'s `if (block.changed)` gate (apply-design-md.cjs:808) never fires and no `system=` marker is ever written — confirmed live, `grep -l system=design-md /tmp/<default-out>/*.html` returns zero files. That command could not have exercised this branch under any circumstance; building a themed fixture instead was the only way to prove it, and it is what commit `9371f99938` did | Met | - |
| AC-016 | REQ-014 | Given the existing stock `template.html` with its `--color-muted` value drifted, When `check-diagram-corpus.cjs` runs, Then `derivation-gates` still fails on byte-inequality exactly as it does today — the extension does not weaken this regression | Reran `node --test scripts/tests/`: the pre-existing `derivation-gates` case ("a template whose palette block drifts from the token source") still passes unmodified. No longer trivial — the `system=` extension now exists (`grep -c "system=" scripts/families/derivation-gates.cjs` = 3) and `!themed` gates the byte-equality check (`else if (!themed && known.value !== value) record(...)`), so a stock block (no `system=` token) is provably still held to byte equality | Met | - |
| AC-017 | REQ-015 | Given `scripts/tests/corpus-mutations.test.cjs`, When `node --test scripts/tests/` runs, Then it includes the two new `derivation-gates` cases and the completeness triple reports no family without a case | Built in commit `9371f99938`. Reran: 18/18 tests pass (up from 16), including the two new cases (`derivation-gates refuses a themed block whose provenance comment was deleted`, `derivation-gates refuses a themed block whose accent falls under the text-on-mark gate`) and the completeness triple. `scripts/tests/fixtures/design-md-sample.html` exists. Judgment on the second case's gate choice: computed both ratios directly — the fixture's stock accent `#b34a1e` measures 4.92:1 against `paper` (clears `textOnMark` 4.5 and `markOnPaper` 3.0) and 2.40:1 against `ink` (clears `accentAgainstInk` 1.5); the mutated value `#c2551f` measures 4.18:1 against `paper` (fails `textOnMark`, still clears `markOnPaper`) and 2.83:1 against `ink` (still clears `accentAgainstInk`) — the mutation isolates to exactly one failing gate, by arithmetic, not by luck. `textOnMark` is also the only one of the three accent gates gated behind `if (themed)` in `derivation-gates.cjs` (`accentAgainstInk` and `markOnPaper` run identically for stock and themed blocks); a mutation targeting either of those would not have proven anything specific to this extension, so `textOnMark` was the only gate that could demonstrate the extension "fires for its own stated reason" as REQ-015 requires | Met | - |
| AC-018 | REQ-016 | Given `SKILL.md`, When read, Then it names the Style-Reference capability in WHEN TO USE, documents it in HOW IT WORKS, links `scripts/apply-design-md.cjs` and `references/design-md-theming.md` in REFERENCES, and its frontmatter `version` is bumped from the pre-change value | Built in commit `76ad403c52`, reran live this pass. Three of four sub-clauses now hold: WHEN TO USE carries the bullet "Repainting a diagram in a product's own visual language from a measured or hand-written `DESIGN.md` Style Reference" plus five new keyword triggers (`theme diagram`, `style reference`, `DESIGN.md`, `repaint diagram`, `brand the diagram`); frontmatter `version:` reads `1.2.0.0` (`git show 76ad403c52:.../SKILL.md \| grep ^version:` → `1.2.0.0`, up from `1.1.0.0`); `## 5. REFERENCES` gained a row for `design-md-theming.md`. The fourth does not: `grep -ni "apply-design\|\.cjs" SKILL.md` returns nothing — `scripts/apply-design-md.cjs` is named nowhere in the file, not in REFERENCES, not in HOW IT WORKS (which still carries only the pre-existing one-sentence pointer to the reference doc, unchanged by either commit), not anywhere. The chart sibling's own `SKILL.md` names its script explicitly (`scripts/apply-design-md.cjs`, `references/design-md-theming.md` together, in its Resource Domains table) — the exact pattern REQ-016 asks this packet to mirror "exactly." Given/When/Then is a conjunction; one of its four required conditions is unambiguously false, so the row stays Unmet despite substantial progress | Unmet | - |
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

**Re-closeout pass (2026-09-11, against commits `9371f99938` and `76ad403c52`).** 19 of 20 rows are
now `Met`. Three criteria that a prior closeout pass found `Unmet` are fixed and reverified live in
this pass:

- **AC-004** — this closeout's own write authority covers `plan.md`; the missing dark `link` row is
  added directly (§3.1 now carries `link`/`light` and `link`/`dark` rows), confirmed against the
  code that already derived it correctly.
- **AC-015**, **AC-017** — `scripts/families/derivation-gates.cjs`'s `system=design-md` extension
  (REQ-014) and its two mutation cases plus fixture (REQ-015) shipped in commit `9371f99938` and
  both pass live: `node --test scripts/tests/` is 18/18, and a hand-built themed delivery run
  through `check-diagram-corpus.cjs --extra` fails on a deleted provenance comment and passes on a
  well-formed themed block whose accent differs from the token source.

One criterion remains `Unmet`, not waived:

- **AC-018** — `SKILL.md` (commit `76ad403c52`) gained the WHEN TO USE activation trigger, five
  keyword triggers, a REFERENCES row for `design-md-theming.md`, and the version bump to `1.2.0.0` —
  four-fifths of REQ-016's letter. It still never names `scripts/apply-design-md.cjs` anywhere in
  the file, the one part of "route to `scripts/apply-design-md.cjs` and `references/design-md-theming.md`
  ... exactly as the chart sibling's `SKILL.md` routes its own" that did not land; the chart's own
  `SKILL.md` names its script explicitly in the equivalent table. `SKILL.md` sits under `.opencode/`,
  outside this closeout pass's write authority to fix.

The applicator itself (`apply-design-md.cjs`) remains solid: identity reproduction, second-reference
theming, every refusal path, and gate-then-write staging all reran clean in this pass (see
`tasks.md` and `goal.md`'s LOG for the evidence). This packet is not closeable until one more
implementation pass adds an `apply-design-md.cjs` reference to `SKILL.md`, or the operator waives
AC-018 with a recorded ADR.
<!-- /ANCHOR:closure -->
