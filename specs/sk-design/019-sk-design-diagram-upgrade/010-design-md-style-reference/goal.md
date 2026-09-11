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
    last_updated_at: "2026-09-11T06:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored the phase 10 planning documents"
    next_safe_action: "Dispatch T001 once 009's merged form library state is confirmed"
    blockers: []
    key_files:
      - "specs/sk-design/019-sk-design-diagram-upgrade/010-design-md-style-reference/plan.md"
      - ".opencode/skills/sk-design/sk-design-chart/references/design-md-theming.md"
      - ".opencode/skills/sk-design/sk-design-chart/scripts/apply-design-md.cjs"
      - ".opencode/skills/sk-design/sk-design-diagram/assets/color/diagram-palette.json"
      - ".opencode/skills/sk-design/sk-design-diagram/scripts/apply-diagram-tokens.cjs"
      - ".opencode/skills/sk-design/sk-design-diagram/scripts/families/derivation-gates.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-010-design-md-style-reference"
      parent_session_id: null
    completion_pct: 15
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

- [ ] `node .opencode/skills/sk-design/sk-design-diagram/scripts/apply-design-md.cjs --default --all --out <dir>` prints `RESULT: PASSED`, and every file it writes is byte-identical to its stock source
- [ ] The same script run against a second, distinct `DESIGN.md` prints `RESULT: PASSED`, derives a themed copy, and every role clears its gate
- [ ] A reference missing a required v3 heading is refused by name, and the run writes no file
- [ ] `node --test .opencode/skills/sk-design/sk-design-diagram/scripts/tests/` passes, including two new `derivation-gates` cases that prove the `system=design-md` extension fires for its own stated reason, and the completeness triple reports clean
- [ ] `node .opencode/skills/sk-design/sk-design-diagram/scripts/check-diagram-corpus.cjs` still prints `RESULT: PASSED` against the untouched stock corpus
- [ ] `assets/style-reference/diagram-stock/origin.md` states plainly that the reference was authored from `assets/color/diagram-palette.json`, not measured
- [ ] `bash .opencode/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-design/019-sk-design-diagram-upgrade/010-design-md-style-reference --strict` reports `RESULT: PASSED` (run by the orchestrator, not this authoring pass)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Phase docs authored (spec, plan, tasks, acceptance-criteria, goal) | Done | This authoring pass; `implementation-summary.md` stays a scaffold per the common brief |
| Fact base re-verified on disk before authoring | Done | `assets/color/diagram-palette.json`'s three skins (light 14 roles, dark 4, terminal 9) read directly; `scripts/families/derivation-gates.cjs` and `scripts/apply-diagram-tokens.cjs` read in full; the chart sibling's `apply-design-md.cjs` (697 lines), `references/design-md-theming.md`, and `assets/style-reference/evilcharts/{DESIGN.md,origin.md}` read as the worked example; `references/foundations/derivation-record.md` read and found to disagree with the JSON on the dark skin's role count (record lists `paper-2`/`soft`/`rule`/`rule-solid`/`accent-tint`/`link` for dark; the JSON defines only four) — the JSON is what `--default` must reproduce, so the role-mapping table follows it, not the record's prose |
| T001-onward mechanical execution | Pending | Drafted in `tasks.md`; execution depends on 009's merge landing or T001's fallback read |

### Deviations and findings

| Item | Note |
|------|------|
| No F-number covers this capability | Confirmed by a direct search of the 006 manual review for "DESIGN.md", "Style Reference", and "theming"; zero hits. D14 is new work, not a defect repair |
| F32 shapes the repaint mechanism, not the corpus | `link`/`rule-solid`/`accent-tint` sit outside the sentinel block in the shipped templates; this phase's script repaints by whole-file literal remapping so it is not blocked by F32, but it does not fix F32 in the shipped forms — that stays 007's scope |
| Terminal theming is conditional, not unconditional | A reference themes the terminal skin only when it declares dark support and supplies four distinct dark neutrals; otherwise terminal stays fully stock. The alternative (deriving four dark layers from a light-only table) was rejected as the exact fabrication D14 forbids |
| `--scheme` is dropped, not ported | The chart script's `--scheme light\|dark\|both` selects which ground a dual-block form receives; D1 forbids a diagram form from carrying two skins in one file, so there is nothing for such a flag to select |
<!-- /ANCHOR:log -->
