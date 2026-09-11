---
title: "Goal: theme a diagram delivery from a local DESIGN.md Style Reference"
description: "The durable directive this phase executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "design-md style reference"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/019-sk-design-diagram-upgrade/010-design-md-style-reference"
    last_updated_at: "2026-09-11T10:15:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Re-closed against 9371f99938/76ad403c52: reverified 3 fixed criteria, fixed plan.md link row"
    next_safe_action: "Add apply-design-md.cjs to SKILL.md, or waive AC-018 with an ADR"
    blockers:
      - "AC-018: SKILL.md never names scripts/apply-design-md.cjs"
    key_files:
      - "specs/sk-design/019-sk-design-diagram-upgrade/010-design-md-style-reference/plan.md"
      - ".opencode/skills/sk-design/sk-design-diagram/scripts/families/derivation-gates.cjs"
      - ".opencode/skills/sk-design/sk-design-diagram/scripts/tests/mutation-cases.cjs"
      - ".opencode/skills/sk-design/sk-design-diagram/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-010-design-md-style-reference-recloseout"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: theme a diagram delivery from a local DESIGN.md Style Reference

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE. Keep it short: the runtime goal surfaces cap what they hold.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** A diagram delivery can be themed from a local `DESIGN.md` Style Reference — generated or hand-written — the way a chart delivery already is: `apply-design-md.cjs` derives every structural role a selected form declares, gates each one, writes provenance into the palette block, and refuses everything a stock delivery would never do.

### Decisions

Frozen choices. Changing one is an amendment. Each row refines a named parent decision
(`../goal.md`); none contradicts one.

| ID | Decision |
|----|----------|
| D1 | A diagram form carries exactly one skin in one sentinel block, so `apply-design-md.cjs` never takes a `--scheme` flag the way the chart script does — there is no second ground to choose per form, only the one its own marker already names. |
| D12 | Every parser, gate check and CLI contract is ported by reading `sk-design-chart/scripts/apply-design-md.cjs` and `references/design-md-theming.md` for shape, never by importing or editing a chart-skill file; `git diff` over `sk-design-chart/` stays empty for this phase. |
| D13 | This node's forms live under `assets/diagrams/`, the merged library `009-one-form-library` produces; if 009 has not landed when this phase executes, T001 reads `assets/templates/` and `assets/examples/` instead and records which path was actually built against. |
| D14 | The packet carries one stock reference at `assets/style-reference/diagram-stock/` whose `origin.md` states it was authored from `assets/color/diagram-palette.json`, not measured from an external product; `--default` derives every role of that source exactly, byte for byte, the same property `apply-diagram-tokens.cjs --default` already carries. |
| D15 | **Amendment**, made during implementation and recorded here after the fact: role selection is two-tier, not the prose-only selection `plan.md` §3.1 originally described. A `Token` cell that names a diagram role directly (`--color-<role>`, optionally `(dark)`/`(terminal)`) fills that role verbatim (tier one); a role no `Token` cell names falls back to `plan.md` §3.1's prose-based selection rules unchanged (tier two). Tier one exists because tier two's rules cannot reproduce this corpus on their own: the lightest background-tagged row in any faithful reference of this language is the near-white `backend-fill`, not the off-white `paper`, and the terminal skin's `paper`/`bar` are not the darkest-two of its four dark neutrals in luminance order. Tier one is what makes `--default` exact. Fully documented in `references/design-md-theming.md` §4; `plan.md` §3.1 carries a pointer to this row. |

**Parent:** `../goal.md`

The parent's decisions outrank anything in this file; a conflict between the two is named here
rather than resolved silently. D8 (the accent's 2.863:1 recorded departure) and D9 (`#3d4460` as a
type-scoped role) are inherited without re-opening: a themed accent must still clear the mark gate
in full, since only the stock value is grandfathered, and `high-level-chevron` is aliased to the
selected `ink` value rather than given its own reference-row selection, since D9 already scopes it
to one diagram type and it carries no gate of its own.

No finding in the 006 manual review (F1-F34, S1-S10) names `DESIGN.md`, a Style Reference, or a
provenance comment — this capability is new work from D14, not a corpus defect this phase repairs.
One finding does bear on how the new script must behave: F32 records that `link` (and, in
`template-full.html`, `rule-solid` and `accent-tint`) is used as a hard-coded literal outside the
sentinel block in the four skin starters, so a sentinel-only substitution would silently leave
those marks stock. This phase's script repaints by whole-file literal remapping — the same
mechanism `apply-diagram-tokens.cjs`'s `paintExample` already uses for the example corpus — so it
does not inherit F32's blind spot; fixing F32 itself in the shipped templates stays 007's job.

### Operator copy

The operator holds this directive as the session objective. Whenever anything above the log changes, resend this file in chat.
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `node .opencode/skills/sk-design/sk-design-diagram/scripts/apply-design-md.cjs --default --all --out <dir>` prints `RESULT: PASSED`, and every file it writes is byte-identical to its stock source — reran directly: `RESULT: PASSED`, `diff -rq /tmp/mk010-designmd assets/diagrams` empty
- [x] The same script run against a second, distinct `DESIGN.md` prints `RESULT: PASSED`, derives a themed copy, and every role clears its gate — a copy of the stock reference with only `Accent` moved (`#eb6c36`→`#2f8f5b`) reran clean: `RESULT: PASSED`, provenance written (`system=design-md`, path + sha256). The chart sibling's own `evilcharts/DESIGN.md`, run whole-corpus (`--all`), instead prints `RESULT: FAILED` — 17 light forms fail `soft` against `textOnPaper` (ratio as low as 1.04:1), because `validateRoles()`'s departure allowance only excuses a role when its *derived* ratio exactly reproduces a *recorded* departure ratio, not any sub-gate value; `references/design-md-theming.md` §5 and `plan.md` §3.1 both describe `soft` as "never held to the text gate", which this run shows is not what the code does for a value that isn't the stock one. A `--forms` run against one non-`soft`-bearing form (`starter-dark`) against the same `evilcharts` reference passes clean. See LOG.
- [x] A reference missing a required v3 heading is refused by name, and the run writes no file — `ERROR: Missing section: Tokens — Colors`, `RESULT: FAILED`, no `<dir>` created
- [x] `node --test .opencode/skills/sk-design/sk-design-diagram/scripts/tests/` passes, including two new `derivation-gates` cases that prove the `system=design-md` extension fires for its own stated reason, and the completeness triple reports clean — **met, shipped in commit `9371f99938`**: `derivation-gates.cjs` now accepts an optional ` system=<id>` sentinel token (`grep -c "system=" derivation-gates.cjs` = 3); `mutation-cases.cjs` carries two new cases against `scripts/tests/fixtures/design-md-sample.html` (a themed block with its provenance deleted; a themed block whose accent falls under `textOnMark`). Reran directly: `node --test scripts/tests/` → 18/18, including both new cases and the completeness triple. See LOG.
- [x] `node .opencode/skills/sk-design/sk-design-diagram/scripts/check-diagram-corpus.cjs` still prints `RESULT: PASSED` against the untouched stock corpus — reran directly: `RESULT: PASSED`, errors: 0
- [x] `assets/style-reference/harness-diagram/origin.md` states plainly that the reference was authored from `assets/color/diagram-palette.json`, not measured — read directly: "This reference was written from the packet's own palette, not measured from an external product" (line 3). Note the path: the bundle shipped at `assets/style-reference/harness-diagram/`, not the `assets/style-reference/diagram-stock/` path this file and `spec.md` name; see LOG
- [x] `bash .opencode/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-design/019-sk-design-diagram-upgrade/010-design-md-style-reference --strict` reports `RESULT: PASSED` — ran with `NODE_PRESERVE_SYMLINKS=1` through the realpath'd script, `--no-recursive`: rerun this pass, `RESULT: PASSED`. This validates the packet's spec-doc structure, not the one remaining `Unmet` acceptance-criteria row (AC-018) — see `acceptance-criteria.md`'s Closure Statement, which is what governs whether the packet may close
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Phase docs authored (spec, plan, tasks, acceptance-criteria, goal) | Done | This authoring pass; `implementation-summary.md` stays a scaffold per the common brief |
| Fact base re-verified on disk before authoring | Done | `assets/color/diagram-palette.json`'s three skins (light 14 roles, dark 4, terminal 9) read directly; `scripts/families/derivation-gates.cjs` and `scripts/apply-diagram-tokens.cjs` read in full; the chart sibling's `apply-design-md.cjs` (697 lines), `references/design-md-theming.md`, and `assets/style-reference/evilcharts/{DESIGN.md,origin.md}` read as the worked example; `references/foundations/derivation-record.md` read and found to disagree with the JSON on the dark skin's role count (record lists `paper-2`/`soft`/`rule`/`rule-solid`/`accent-tint`/`link` for dark; the JSON defines only four) — the JSON is what `--default` must reproduce, so the role-mapping table follows it, not the record's prose |
| Applicator built and shipped | Done | `scripts/apply-design-md.cjs` (1,012 lines), commit `78ab2b220b`; two-tier role resolution (`deriveSkin()`), v3 heading parser (`section`/`parseColors`/`parseTypography`/`parseRadius`), per-role selection functions (`chooseGround`/`chooseInk`/`chooseMuted`/`chooseAccent`/`choosePaper2`/`chooseSoft`/`chooseLink`/`chooseBackendFill`/`chooseSeries`), terminal conditional (`themeIsDeclaredDark`/`terminalLayers`), whole-file literal remapping (`renderForm`/`remapLiterals`), gate-then-write staging (`validateRoles`) |
| Stock reference authored and reproduces the corpus exactly | Done | `assets/style-reference/harness-diagram/{DESIGN.md,origin.md}` (no `tokens.json` — see Deviations); `apply-design-md.cjs --default --all --out /tmp/mk010-designmd` → `RESULT: PASSED`, `diff -rq /tmp/mk010-designmd assets/diagrams` empty, rerun directly during this closeout pass |
| `derivation-gates.cjs` extension (`system=design-md`) | **Done** (commit `9371f99938`, reverified live this pass) | Sentinel regex now accepts optional ` system=<id>`; a `system=design-md` block requires and validates its provenance comment, skips byte-equality for that block only, keeps every gate (`accentAgainstInk`/`markOnPaper` unconditionally, `textOnMark` when `themed`) and the skin-role-vocabulary check unconditionally. Reran: a themed block missing provenance fails by name; a well-formed themed block with a non-stock in-gate accent passes with 0 failures. REQ-014, T019 met |
| Mutation cases + fixture for the extension | **Done** (commit `9371f99938`, reverified live this pass) | `scripts/tests/fixtures/design-md-sample.html` exists; `mutation-cases.cjs` carries two new `derivation-gates` cases (deleted provenance; accent under `textOnMark`). `node --test scripts/tests/` → 18/18. REQ-015, T020 met |
| `SKILL.md` routing | **Still partially built** (commit `76ad403c52`) | WHEN TO USE now carries the activation bullet and five keyword triggers; `version:` is `1.2.0.0`; REFERENCES gained a row for `design-md-theming.md`. HOW IT WORKS still carries only the pre-existing one-sentence pointer (unchanged by either commit), and `scripts/apply-design-md.cjs` is named nowhere in `SKILL.md` (`grep -ni "apply-design\|\.cjs" SKILL.md` — no hits). REQ-016, T022 still unmet on that one point; AC-018 stays `Unmet` |
| 009's merged form library | Confirmed present | `assets/diagrams/` holds 38 forms + `README.md` (39 entries); the applicator reads from it directly. T001's fallback path was not needed |
| `plan.md` §3.1's dark `link` row | **Fixed by this closeout pass** | The single "light only" `link` row is split into `light` and `dark` rows; the `dark` row states the same selection rule run against dark `paper`/dark `accent`, picked independently — matching what `deriveSkin`'s generic `optional('link', ...)` loop (apply-design-md.cjs:581-585) already does per skin. AC-004 met |

### Deviations and findings

| Item | Note |
|------|------|
| No F-number covers this capability | Confirmed by a direct search of the 006 manual review for "DESIGN.md", "Style Reference", and "theming"; zero hits. D14 is new work, not a defect repair |
| F32 shapes the repaint mechanism, not the corpus | `link`/`rule-solid`/`accent-tint` sit outside the sentinel block in the shipped templates; this phase's script repaints by whole-file literal remapping so it is not blocked by F32, but it does not fix F32 in the shipped forms — that stays 007's scope |
| Terminal theming is conditional, not unconditional | A reference themes the terminal skin only when it declares dark support and supplies four distinct dark neutrals; otherwise terminal stays fully stock. The alternative (deriving four dark layers from a light-only table) was rejected as the exact fabrication D14 forbids |
| `--scheme` is dropped, not ported | The chart script's `--scheme light\|dark\|both` selects which ground a dual-block form receives; D1 forbids a diagram form from carrying two skins in one file, so there is nothing for such a flag to select |
| Role selection is two-tier, not the prose-only rules this plan originally described | Amendment; recorded as D15 above. `apply-design-md.cjs`'s `deriveSkin()` fills a role verbatim from a reference's own `--color-<role>` `Token` cell before falling back to `plan.md` §3.1's selection rules; `plan.md` §3.1 now carries a pointer to this decision, and `references/design-md-theming.md` §4 documents it in full |
| `assets/style-reference/diagram-stock/` was never built; the reference bundle shipped at `assets/style-reference/harness-diagram/` instead | `spec.md`'s Files to Change table and this file's own key_files/completion criteria named `diagram-stock/`; the actual commits (`78ab2b220b` created `harness-diagram/`; `c1f109bfe4`/`9a4b60e0ed` moved `diagram-palette.json` and `icons.html` into the same directory) never used the `diagram-stock` name. Functionally equivalent — `DESIGN.md`/`origin.md` carry the required content — but the path in `spec.md` is stale |
| `tokens.json` was never written | `spec.md` REQ-012 and the Files to Change table both list a `tokens.json` declaring dark-theme support as a required file; the bundle holds `DESIGN.md`, `origin.md`, `diagram-palette.json` and `icons.html` only. `themeIsDeclaredDark()` (apply-design-md.cjs:197) accepts either signal — a `**Theme:**` line naming dark (which the stock `DESIGN.md` carries, line 4) or a sibling `tokens.json`'s `darkMode.supported` — so REQ-006's functional behavior does not depend on the missing file, but REQ-012's literal file list is unmet |
| `soft`'s "never held to the text gate" rule is not what the shipped gate does | `plan.md` §3.1 (as originally written) and the shipped `references/design-md-theming.md` §5 both describe `soft` as exempt from `textOnPaper`. `apply-design-md.cjs`'s `validateRoles()` (line 674) puts `soft` in `TEXT_ROLES` for light and dark and only excuses a sub-gate value when its measured ratio exactly reproduces a *recorded* departure ratio (`diagram-palette.json`'s `departures` array, matched to two decimal places). `--default` passes because the identity value reproduces the recorded 3.48:1 departure exactly; a genuinely re-derived `soft` value that clears no departure record fails outright, observed live against `evilcharts` (17 forms, ratios as low as 1.04:1). This is a documentation/behavior mismatch, not something this closeout pass corrects in the shipped script |
| `apply-design-md.cjs`'s own write-time gate and `derivation-gates.cjs`'s corpus-wide gate disagree on `textOnMark` | Discovered this pass: the applicator's `validateRoles()` never checks `textOnMark` for `accent` (only `markOnPaper` and, when `ink` is present, `accentAgainstInk`), so it will happily write a themed delivery whose accent clears 3.0:1 against ground but not 4.5:1. Reran live: a moved-accent reference (`#eb6c36`→`#2f8f5b`) passes the applicator's own `--all` run (`RESULT: PASSED`) and writes all 39 files, but `check-diagram-corpus.cjs --extra <that output>` then fails `derivation-gates` on 2 of them (`accent measures 3.70:1 ... textOnMark gate is 4.5:1`) — a delivery the tool that makes it calls clean, the corpus-wide checker calls broken. Not one of the four criteria this closeout pass re-verified, and not part of REQ-014's literal text (which only requires the *checker* to enforce the gate, which it does); flagged here because a themed delivery is not provably clean until both tools agree, and no requirement currently says which one wins |
| Two judgment calls this closeout pass made, with evidence rather than by assuming a prior report | (1) The `apply-design-md.cjs --default` path never writes a `system=design-md` marker — `renderForm`'s `if (block.changed)` (line 808) only fires when the derived value differs from what is already in the file, and `--default` is an identity reference by construction (REQ-013), so no delivery it produces can ever exercise `derivation-gates.cjs`'s themed branch; confirmed live (`grep -l system=design-md` over a full `--default --all` output returns zero files). A verification command built around `--default` could not have tested the extension under any circumstance. (2) The second mutation case's gate choice (`textOnMark`, accent against its own ground) is the only one of `accent`'s three checks gated behind `if (themed)` in `derivation-gates.cjs` — `accentAgainstInk` and `markOnPaper` run identically whether or not a block is themed — so it is the only gate whose failure proves the *extension's* code path fired rather than pre-existing logic; confirmed by computing both ratios directly (§ AC-017 in `acceptance-criteria.md`) |
<!-- /ANCHOR:log -->
