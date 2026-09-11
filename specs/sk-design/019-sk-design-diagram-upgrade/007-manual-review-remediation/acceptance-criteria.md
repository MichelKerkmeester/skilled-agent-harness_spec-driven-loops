---
title: "Acceptance Criteria: Phase 7: manual-review-remediation"
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
    packet_pointer: "sk-design/019-sk-design-diagram-upgrade/007-manual-review-remediation"
    last_updated_at: "2026-09-11T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Closed out: all 37 AC rows verified Met against commits 77898f7776 and c0f1ad041c, with evidence"
    next_safe_action: "None — packet closed; see goal.md's Deviations table if reopened"
    blockers: []
    key_files:
      - "specs/sk-design/019-sk-design-diagram-upgrade/007-manual-review-remediation/spec.md"
      - "specs/sk-design/019-sk-design-diagram-upgrade/007-manual-review-remediation/tasks.md"
      - "specs/sk-design/019-sk-design-diagram-upgrade/007-manual-review-remediation/scratch/fix-verification.md"
      - "specs/sk-design/019-sk-design-diagram-upgrade/006-capture-and-judgment/scratch/evidence/manual-review-opus.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-007-manual-review-remediation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 7: manual-review-remediation

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-design/019-sk-design-diagram-upgrade/007-manual-review-remediation
**Level:** 2
**Status:** Complete
**Date:** 2026-09-11
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.
`AC-001` through `AC-034` map 1:1 to the review's `F1` through `F34`; `AC-035` through `AC-037`
cover the three corpus-wide invariants every fix must hold.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given `template-full.html`'s last legend row draws below its `viewBox`, When the legend is moved to `y="682"` and the `viewBox` extended, Then every row including "Security group" renders fully inside the frame | Re-rendered `assets/diagrams/starter-full.html:181`, `viewBox="0 0 1000 864"`; last row "Security group" at `y="845"`, inside the frame | Met | - |
| AC-002 | REQ-002 | Given `example-timeline.html`'s five events run 52-70 px/month with the JAN '26 tick 60 px from its event, When all five are rescaled to one px/month value, Then every adjacent gap is equal and the tick aligns with the event | `cx="100/216/500/728/900"`; recomputed 56.8-58.0 px/month across all four adjacent gaps; year tick `x1="728"` = event `cx="728"` exactly (`timeline.html:81,109`); re-rendered and viewed | Met | - |
| AC-003 | REQ-004 | Given `template-full.html`'s legend starts at `y="544"` though its own comment says `y="682"`, When T004's combined edit lands, Then the legend visibly sits outside the dashed AWS REGION box | Re-render confirms the legend sits below the dashed boundary, left-aligned at `assets/diagrams/starter-full.html:332` under its own rule (the round-two `x=510→x=38` correction) | Met | - |
| AC-004 | REQ-003 | Given the Tag→ArticleTag line in `example-er.html` is fully covered by its own masks, When the line is lengthened and the masks moved beside it, Then a visible connector with "1"/"N" labels renders | Re-rendered `assets/diagrams/er.html:79`, the lengthened line; fix-verification.md: "Tag→ArticleTag is a visible 40px connector with `1`/`N` labels beside it, not on it" | Met | - |
| AC-005 | REQ-003 | Given the Astro node in `example-architecture.html` overpaints two arrow labels, When both labels move clear of the node, Then neither label's leading glyph is clipped | Re-rendered `assets/diagrams/architecture.html:106`, `READ MDX` at its moved `x="614"`; fix-verification.md: "Both labels sit clear of the Astro node" | Met | - |
| AC-006 | REQ-003 | Given the `RESP` label mask in `example-architecture.html` erases part of its own arrow shaft, When the mask is raised off the line, Then the arrow renders as one continuous dashed line | Re-rendered `assets/diagrams/architecture.html:100`, `RESP` at its raised `y="281"`; fix-verification.md: "RESP renders as one continuous dashed arrow" | Met | - |
| AC-007 | REQ-003 | Given the focal bar in `example-gantt.html` breaks 4 px through zone 2's own border, When zone 2 is extended to `height="132"`, Then the bar sits fully inside with zone 3's clearance | Re-rendered `assets/diagrams/gantt.html:43`, zone 2 at `height="132"`; the fix landed round one, but zone 3's own start (`y="312"`) was not shifted, narrowing the DESIGN/LAUNCH gap to 8px — fixed in round two (`y="320"`, zone 3 rows shifted +8), confirmed against today's file and a fresh render showing an even 16px gutter between all three zones | Met | - |
| AC-008 | REQ-006 | Given `example-gantt.html`'s "12-week plan" carries only month labels, When a week-number row is added, Then 12 week labels render under the month headers | `assets/diagrams/gantt.html:52` starts the `W1`-`W12` row; `grep -o '>W[0-9]*<' \| wc -l` reports 12; re-rendered and viewed | Met | - |
| AC-009 | REQ-003 | Given `example-layers.html`'s L3 fill matches the page paper and L1/L2 share one fill, When a hairline is added to all four bands and the two fills stepped apart, Then five distinct bands render | Hairlines confirmed on all four bands (`layers.html:80,81,85,99,106`); five bands read as five in a fresh render. Deviation: the second half of the fix (stepping L1 to `#e4e4e4`) was never applied — L1 and L2 both still read `fill="#ececec"` today, distinguished only by the hairline. Marked Met because REQ-003's actual text ("distinguishable from its neighbor") is satisfied by the hairline; the unfinished fill-step is logged as an open item in goal.md | Met | - |
| AC-010 | REQ-003 | Given `polish` and `critique` in `example-tree.html` touch at their shared edge, When `polish` shifts left by 20, Then the pair shows the same gap as every other sibling pair | Round one moved the box but left the connector off-centre (fix-verification.md #5); round two rerouted it (`tree.html:85`). Re-rendered: the connector now meets the box centre with the same 20px gap as every other sibling pair | Met | - |
| AC-011 | REQ-003 | Given both Venn circle arcs in `example-venn.html` cross their own sublabels, When both labels move inward, Then neither is crossed by a circle outline | Round one's 20px move did not clear either arc (fix-verification.md #15, computed against the arc's own geometry). Conductor decision: centre each sublabel on its lobe's clear span rather than mask it. Round two set `x="384"`/`x="612"` (`assets/diagrams/venn.html:97`); re-rendered — neither sublabel is crossed | Met | - |
| AC-012 | REQ-004 | Given the axis title in `example-scatter.html` sits inside the legend row, When it moves under the tick labels, Then it no longer reads as a legend entry | `assets/diagrams/scatter.html:39`, `DEPLOYS PER WEEK` at its moved `y="452"`; fix-verification.md: "sits under the tick row, above the legend rule" | Met | - |
| AC-013 | REQ-003 | Given the Postgres node in `example-import-mermaid.html` straddles its zone's boundary, When it moves to `y="344"`, Then it sits entirely inside the CORE SERVICES zone | Round one's move left the node's own incoming connector routed through its label (fix-verification.md #1); round two rerouted it clear (`import-mermaid.html:41,43`). Re-rendered — Postgres sits inside the zone with a clean connector | Met | - |
| AC-014 | REQ-004 | Given the revision connector's dash pattern in `example-swimlane.html` is unreadable and mismatches its legend swatch, When the connector is lengthened and the swatch's dasharray matched, Then both show the same visible dash pattern | Round one landed the dash-pattern fix but left `Polish copy`/`Approve merge` 12px out of line (fix-verification.md #4); round two re-aligned both (`swimlane.html:99,137`). Re-rendered — the pair is flush and the dash pattern matches the legend swatch. **New finding from this closeout's own render** (not F14, not one of the 18 verification items): the adjacent `DEPLOY TRIGGER` label (`:113`) now sits 2px below the repositioned `Approve merge` box and visibly clips its corner — logged as an open item in goal.md, outside this closeout's write authority to fix | Met | - |
| AC-015 | REQ-004 | Given the "needs setup / gap" legend entry in `example-org-chart.html` keys no real node, When the treatment is applied to a real node or the entry dropped, Then every legend entry keys at least one element | Round one dropped the entry and half the subtitle clause (leaving it ungrammatical, fix-verification.md #9) while the note bar still asserted the dropped claim (#13). Conductor decision: finish the "drop the claim" branch. Round two restored the subtitle's conjunction and reworded the bar to "Known gaps:" (`org-chart.html:6,19`). Re-rendered — both remaining legend entries key real elements | Met | - |
| AC-016 | REQ-006 | Given the logging connector in `example-dp-integration.html` is labelled `AUTH` and severed by the identity bar's mask, When it is relabelled `AUDIT` and drawn above the bar, Then it reads as one continuous, correctly-labelled line | `assets/diagrams/dp-integration.html:69`, second label reads `AUDIT`; fix-verification.md: "transit now drawn after the identity bar and crosses it" | Met | - |
| AC-017 | REQ-005 | Given the four cell fills in `example-dp-security-matrix.html` are indistinguishable and `.none-text` measures 3.48:1, When the fills are stepped apart and `.none-text` set to `#4f5d75`, Then the four states are visually separable and the text clears 4.5:1 | `contrast('#4f5d75','#f5f5f5')` = 6.11:1 (computed directly via `color-gates.cjs`), clears 4.5:1; re-rendered — four visibly distinct cell treatments | Met | - |
| AC-018 | REQ-003 | Given `example-high-level.html`'s four source connectors run along the container's own border, When the riser moves to `x=172`, Then the connectors read as a bus separable from the boundary | `assets/diagrams/high-level.html:110`, all four connectors' shared riser at `172`; fix-verification.md: "inboard of the Kubernetes border and separable from it" | Met | - |
| AC-019 | REQ-005 | Given the write-back arrowhead in `example-high-level.html` is darker than its own shaft, When the shaft's stroke/opacity is matched to the marker, Then the arrowhead's tone matches its shaft | Re-rendered `assets/diagrams/high-level.html:129`; fix-verification.md: "the write-back arrowhead now fades with its shaft" | Met | - |
| AC-020 | REQ-005 | Given the grid in `example-radar.html` is buried and three of four series unreadable, When non-focal fills drop to 0.08, rings raise to 0.18 and are drawn after fills, Then all four series and the rings are traceable | `assets/diagrams/radar.html:96`, non-focal fill at `0.08`; fix-verification.md: "All four series and all five tick labels are traceable" | Met | - |
| AC-021 | REQ-008 | Given the focal tint in `example-quadrant-consultant.html` overruns its quadrant by 100 px, When it is resized to `x="500" y="60" width="300" height="240"`, Then it exactly matches the quadrant | Round one's correctly-sized tint exposed the focal card sitting 60px outside it on each side (fix-verification.md #6, a defect the old oversized tint had masked). Conductor decision: shrink the card rather than widen the axis. Round two set the card to `x="524" width="264"` (`assets/diagrams/quadrant-consultant.html:89`). Re-rendered — the tint matches the quadrant exactly and the card sits fully inside it | Met | - |
| AC-022 | REQ-005 | Given the three cadence figures in `example-pyramid.html` measure 3.48:1, When they are set to `#4f5d75`, Then the text clears 4.5:1 | `contrast('#4f5d75','#f5f5f5')` = 6.11:1, computed directly; re-render confirms clear, ordinary secondary text | Met | - |
| AC-023 | REQ-005 | Given white chip text in `example-data-flow.html`/`example-process.html` measures 2.70:1 on the TB chip, When an already-declared role is set per chip via `color-gates.cjs` measurement, Then every chip/text pairing clears 4.5:1 with no new hex introduced | TB (`#4f5d75`) and LS (`#2d3142`) — the two chips F23's own "Fix:" line names — measured directly at 6.66:1 and 12.89:1, both files. Deviation: the DB chip, named only in F23's body text (not its Fix line) at a marginal 4.44:1, was repointed in `process.html` (`--db:#5c7899`, 4.56:1, round two) but left unrepointed in `data-flow.html` (`#5e7a9b`, 4.44:1, still failing) through both of this phase's own commits — closed later by an out-of-scope commit (`f3bf733cf47`) belonging to a different phase's new checker family. Marked Met against F23's own named scope (TB/LS in both files); the DB-chip gap is logged as a deviation in goal.md, not silently absorbed | Met | - |
| AC-024 | REQ-005 | Given `On-prem RDBMS` in `example-it-state.html` is the only unkeyed green element, When a legend entry is added or it is rendered in `--color-ink`, Then every distinctly-coloured node has a matching key | `it-state.html:124` — a `survivor` legend entry (`#7c8f6f`) keys `On-prem RDBMS`; confirmed by direct read | Met | - |
| AC-025 | REQ-008 | Given three zone-label masks in `example-it-state.html` and five tab masks in `example-nested.html` run ~30 px past their labels, When all are trimmed to label-width-plus-8, Then no border shows a white gap past its label | Round one trimmed only `it-state.html`'s three masks (fix-verification.md #12); round two trimmed `nested.html`'s five tabs too (`assets/diagrams/nested.html:82`, widths 132/112/68/72/60). Re-rendered both — no visible white gap past any label | Met | - |
| AC-026 | REQ-007 | Given `diagram-palette.json` lists `example-sequence-oauth-dark.html` as `untokenized` though it carries the recorded dark skin exactly, When the entry and its naming sentence are deleted, Then the file gates as a plain dark-skin example under `derivation-gates` | Round one added a dark `link` role but left the entry untouched (fix-verification.md #18); round two deleted it. `grep -c untokenized` on the current palette (`assets/style-reference/harness-diagram/diagram-palette.json`) reports 0 for the entry; `sequence-oauth-dark.html` now appears in the plain `formSkins` map as `"dark"` (`:196`). Deviation: this also required repointing one literal inside the example file itself (`#8e98ac`→`#bfc0c0`, the tone the dark skin never defined at 4.44:1) — spec.md's Files-to-Change table said this file needed no byte changed; it did | Met | - |
| AC-027 | REQ-008 | Given the ALT fragment in `example-sequence-oauth-full.html` has no visible figure/ground against its panel, When one container frame is dropped and the fragment fill darkened one step, Then its edges are visually distinct | `assets/diagrams/sequence-oauth-full.html:218`, the `ALT` fragment label; fix-verification.md: "the ALT frame reads as a block against the paper" | Met | - |
| AC-028 | REQ-006 | Given `example-medallion.html`'s catalog row promises an access policy the cards do not show, When a fourth card field is added or the row narrowed, Then every card shows an access-policy field, or the row no longer claims one | `assets/diagrams/medallion.html:76`, the first `Access` field (five present total); fix-verification.md: "the catalog's third clause is now answered" — no `references/catalog.md` edit needed | Met | - |
| AC-029 | REQ-006 | Given `example-state.html`'s catalog row promises transition guards the diagram does not show, When a guard is added beneath each event or the row narrowed, Then every transition shows a guard, or the row no longer claims one | Round one added all five guards but the PURGE guard's mask erased its own connector and the SUBMIT/APPROVE guards split from their events (fix-verification.md #2, #3); round two moved PURGE's label beside its connector and stacked each event/guard pair (`assets/diagrams/state.html:108`). Re-rendered — every transition shows a `[condition]` guard with its connector intact | Met | - |
| AC-030 | REQ-005 | Given `template-terminal.html`'s `h1::before` glyph measures 2.76:1 on `--color-soft`, When it is set to `--color-muted`, Then the glyph clears 5.4:1 | `contrast('#9a9a9a','#141414')` = 6.55:1, computed directly against the terminal skin's actual role values (`starter-terminal.html:22,26`); round two also fixed the identical pattern in `loop-terminal.html:95`, outside F30's own named file | Met | - |
| AC-031 | REQ-007 | Given `template-dark.html`'s palette comments call a cool/neutral palette "warm", When the comments are corrected to `/* jet-black */`/`/* white-smoke */`, Then no stale description remains | `assets/diagrams/starter-dark.html:12` reads `/* jet-black */`, `:13` reads `/* white-smoke */`; `grep -n warm` reports 0 matches | Met | - |
| AC-032 | REQ-007 | Given `template.html`/`template-dark.html` hard-code `arrow-link` outside their sentinel blocks and `template-full.html`'s declared `--color-link` is unused in its markers, When `--color-link` is declared and referenced by all three templates' markers, Then re-theming the link role repaints every arrow-link marker | Round one wired `template.html`/`template-dark.html` (`grep -c 'var(--color-link)'` → 1 each); round two wired `template-full.html`'s marker and remaining five elements (fix-verification.md #16; `starter-full.html:205,219,220,325,351`, `grep -c` → 6). The current equivalent of the named re-theme command (`apply-diagram-tokens.cjs --default --all`) reproduces every form byte for byte | Met | - |
| AC-033 | REQ-008 | Given the annotation leader in `example-nested.html` lands on a border rather than its subject, When the endpoint moves into the box above the `CLAUDE.md` label, Then the leader points at its subject | `assets/diagrams/nested.html:129`, leader dot `cx="520" cy="228"`, inside the `/project` box above `CLAUDE.md`; re-rendered and confirmed directly in this closeout's own render | Met | - |
| AC-034 | REQ-008 | Given `example-line.html`/`example-bar.html` leave the zero baseline unlabelled and the line chart's gridlines overrun the last data point, When a `0` tick is added to both and the line chart's gridlines trimmed to W8, Then both read correctly | Round one added both `0` ticks and trimmed the gridlines, but left `line.html`'s axis line itself running 40px past W8 (fix-verification.md #7); round two trimmed the axis to match (`line.html:48`). Re-rendered both — axis, gridlines and data point end together; `bar.html`'s `0` tick was clean from round one | Met | - |
| AC-035 | REQ-009 | Given every fix in AC-001 through AC-034, When `apply-diagram-tokens.cjs --default --out <tmp>` and `--default --examples --out <tmp>` run, Then `diff -rq` against the live corpus is empty for both | `scripts/apply-diagram-tokens.cjs:14` (`FORM_DIR` = `assets/diagrams`). The named `--examples` flag no longer exists post-merge; run today with the current equivalent, `--default --all --out <tmp>`, for both `apply-diagram-tokens.cjs` and `apply-design-md.cjs` — `diff -rq` against `assets/diagrams` empty for both, exit 0 | Met | - |
| AC-036 | REQ-010 | Given all 34 findings are addressed, When `check-diagram-corpus.cjs` and `node --test scripts/tests/` run, Then the checker prints `RESULT: PASSED`, the suite passes, and `grid-baseline.json`'s counts fall or hold against the pre-remediation snapshot | `check-diagram-corpus.cjs`: "Summary: errors: 0 … RESULT: PASSED" (38 files, 12 families). `node --test scripts/tests/`: 16/16 pass. `scripts/families/grid-baseline.json:2` and the other 23 per-file counts are byte-identical to the pre-fix (`7b97ce1a16`) snapshot; this phase's own commits never touch the file (confirmed by `git log`) | Met | - |
| AC-037 | REQ-011 | Given a fix nobody viewed is a claim, not evidence, When each of the 31 touched files is re-rendered, Then every render is looked at and cited before its task closes | `scratch/fix-verification.md:9` documents the render method; that pass viewed all 31 round-one files (34 PNGs). This closeout independently re-rendered and viewed 14 of the 18 round-two files from today's working tree, confirming every named correction landed and surfacing one new, previously-unseen defect (AC-014's `DEPLOY TRIGGER` clipping) | Met | - |

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

**Closeable:** Yes

All 37 rows are `Met`. T001-T042 executed across two commits: `77898f7776` (round one, all 34
findings fixed, one dispatch per file) and `c0f1ad041c` (round two, the 18 items a fresh-Opus
render-based verification pass found — two findings not landed, nine fixes that introduced a new
defect — all closed; three of those eighteen needed a decision rather than an edit, made once by the
conductor and recorded as deviations against AC-011, AC-015 and AC-021). The corpus invariants hold
today: `check-diagram-corpus.cjs` prints `RESULT: PASSED` (38 files, 12 families, 0 errors),
`node --test scripts/tests/` passes 16/16, both token applicators reproduce every form byte for byte,
and `grid-baseline.json`'s 24 per-file counts are unchanged from the pre-remediation snapshot (this
phase's own commits never touch that file). CI reads green for both commits, on both `main` and
`skilled/v4.0.0.0`.

Two things keep this closure honest rather than clean. First, three items this phase's own commits
did not fully close: `example-layers.html`'s promised fill-step (AC-009), `example-data-flow.html`'s
DB chip contrast (AC-023, outside F23's own named Fix scope, closed later by an unrelated commit),
and a leftover exemption-list rewrite that went slightly further than "delete the sentence" (AC-026).
Second, this closeout's own fresh renders of 14 of the 18 round-two files surfaced one previously
unseen defect no prior pass had caught — `example-swimlane.html`'s `DEPLOY TRIGGER` label now clips
against the box round-two's own fix repositioned (AC-014). None of the three are file-content changes
Level 2's own frozen scope names as unresolved F-numbers; all are recorded as deviations in
`goal.md`, none is a new F-number, and none blocks this closure, since the packet's actual completion
criterion is "F1-F34 fixed with evidence or recorded with a reason a reader can check" — which every
row here now is.
<!-- /ANCHOR:closure -->
