---
title: "Acceptance Criteria: Phase 11: full-page-capture"
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
    packet_pointer: "sk-design/019-sk-design-diagram-upgrade/011-full-page-capture"
    last_updated_at: "2026-09-11T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored the acceptance criteria for phase 11"
    next_safe_action: "Meet, waive or supersede the open criteria once T001-T016 execute"
    blockers: []
    key_files:
      - "specs/sk-design/019-sk-design-diagram-upgrade/011-full-page-capture/spec.md"
      - "specs/sk-design/019-sk-design-diagram-upgrade/011-full-page-capture/plan.md"
      - ".opencode/skills/sk-design/shared/scripts/render-screenshots.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-011-full-page-capture"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 11: full-page-capture

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-design/019-sk-design-diagram-upgrade/011-full-page-capture
**Level:** 2
**Status:** In Progress
**Date:** 2026-09-11
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given `render-screenshots.cjs` captures at a fixed `1280x900` today, When `--full-page` is added as an opt-in flag, Then omitting the flag leaves capture byte-identical to today | `render-screenshots.cjs:175` (`const fullPage = args.includes('--full-page')`) short-circuits before `measureContentHeight`; fresh unflagged render of `sk-design-chart/assets` into a scratch dir, `diff -rq` against committed `sk-design-chart/screenshots/`, empty (re-verified 2026-09-11) | Met | - |
| AC-002 | REQ-002 | Given no full-page flag exists today, When `--full-page` is set, Then each file's window height is its own measured `document.documentElement.getBoundingClientRect().height`, read from a temp-copy `--dump-dom` pass, with the technique documented in a comment beside the code | `render-screenshots.cjs:104-111` (doc comment), `:113` (`measureContentHeight`), `:131` (`getBoundingClientRect` in the injected probe); fresh `--full-page` render reproduced committed heights exactly (`starter-full.png` 1561px, `sequence-oauth-full.png` 1399px) | Met | - |
| AC-003 | REQ-003 | Given the renderer is shared with `sk-design-chart` and D12 forbids changing that skill, When the chart's unflagged invocation runs after this phase, Then its output is byte-identical to its committed screenshots | Fresh unflagged render into a scratch dir, `diff -rq` against `sk-design-chart/screenshots/`, empty (re-verified 2026-09-11); implementation-time proof by spawn instrumentation cited in commit `08ae181702` | Met | - |
| AC-004 | REQ-004 | Given `assets/diagrams/` and `assets/icons.html` are the full corpus, When the reshoot runs with `--full-page`, Then every source has exactly one PNG under `screenshots/diagrams/` or `screenshots/icons.png`, and the pre-merge `screenshots/examples/`/`screenshots/templates/` directories no longer exist | `screenshots/diagrams/*.png` = 38 files = `assets/diagrams/*.html` count; `assets/icons.html` relocated pre-phase to `assets/style-reference/harness-diagram/icons.html`, captured to `screenshots/style-reference/harness-diagram/icons.png` (present, byte-identical on fresh render); `test -d screenshots/examples` / `screenshots/templates` both fail (2026-09-11) | Met | - |
| AC-005 | REQ-005 | Given every form now captures at its true content height, When each regenerated PNG's pixel height is compared to its source's independently measured height, Then the two agree for every file, with zero mismatches | Fresh `--full-page` render of the whole corpus, `diff -rq screenshots/diagrams` and `diff -rq screenshots/style-reference` both empty against committed (2026-09-11) — every PNG's height equals what the measurement pipeline derives today, zero mismatches across 38 files + icons.png | Met | - |
| AC-006 | REQ-006 | Given the playbook's Result Persistence contract names `run-manual-playbook-scenario.cjs` as the only path that may write a CAP-001 report, When CAP-001 reruns against the full-page captures, Then a new report folder exists under `benchmark/reports/`, generated Markdown only | `benchmark/reports/2026-09-11--manual-testing-playbook--capture-review-2/skill-benchmark-report.json:1-4` (`scenarioId: "CAP-001"`); `skill-benchmark-report.md:1` carries "Rendered from report.json (do not hand-edit)" | Met | - |
| AC-007 | REQ-007 | Given the first report recorded five findings (dp-integration, venn, template-full focal balance; swimlane HANDOFF mask overflow; the renderer crop), When the second report is read, Then each of the five is stated as closed-with-evidence or carried-forward-with-a-reason, and no `SKIP` anywhere in the run has an empty reason | `benchmark/reports/.../capture-review-2/results.csv:2` names all five by result (dp-integration, venn, starter-full open; swimlane mask closed not-real; crop closed); the one `SKIP` (step 2, playwright) reads "install with 'pip install playwright' then 'playwright install chromium'" | Met | - |
| AC-008 | REQ-008 | Given S10 named the crop as something a future reviewer would otherwise rediscover, When the playbook is updated, Then it carries a note that a capture review reads full-page images, citing S10 | `grep -rln "S10\|full-page" manual-testing-playbook/` finds nothing 2026-09-11; neither `manual-testing-playbook.md` nor `capture-review/capture-review.md` was touched by `08ae181702`/`76ad403c52`/`6012ec5c7d` | Unmet | - |
| AC-009 | REQ-009 | Given the diagram packet's own regeneration command must match what it now actually does, When `sk-design-diagram/README.md` is updated, Then its snippet shows `--full-page`, while `sk-design-chart/README.md`'s snippet is untouched | `sk-design-diagram/README.md:163` carries `--full-page` (landed via `9a4b60e0ed4`, ahead of this phase's own commits); `sk-design-chart/README.md` has no `--full-page` anywhere (checked 2026-09-11) | Met | - |
| AC-010 | Phase gate | Given the flag, the reshoot, the byte-identity proof and the CAP-001 rerun all exist, When this phase closes, Then no committed screenshot is cut off, `sk-design-chart`'s images are unchanged, and the second capture report exists with no hand-authored markdown and no empty-reason skip — the literal 011 closure bar from `../011.md` | AC-001 through AC-009: 8/9 `Met`, AC-008 `Unmet`; `node scripts/check-diagram-corpus.cjs` reports `RESULT: PASSED` (re-run 2026-09-11) — gate blocked solely on AC-008 | Unmet | - |

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

This packet carries no separate `decision-record.md` file, and none of the two unmet rows below is waived — a waiver was never proposed, so both stay open rather than being written off.

Execution (T001-T016 in `tasks.md`) ran. AC-001 through AC-007 and AC-009 are `Met`: the `--full-page` flag is opt-in and proven byte-identical to the old path when absent (`sk-design-chart`'s screenshots diff empty against a fresh unflagged render); the measurement technique is implemented, commented, and reproducible; the corpus reshoot covers every source with zero PNGs at the old 900px crop signature and zero height mismatches against independent measurement; a second, distinct CAP-001 report exists, generated by the runner, addressing all five prior findings by name; and the diagram README documents `--full-page` while the chart README stays untouched.

AC-008 is `Unmet`: no note citing S10 was ever added to `manual-testing-playbook.md` or `capture-review/capture-review.md`. Nothing in the phase's three commits (`08ae181702`, `76ad403c52`, `6012ec5c7d`) touches either file. AC-010, the phase gate, is therefore also `Unmet` — it requires AC-001 through AC-009 all `Met`, and one is not.

One further gap surfaced during verification, narrower than AC-008 but real: T013's own text called for `executionContext.supersedes` in the second report to name the first report's folder; the field is present but empty (`[]`). AC-006 and AC-007 still read `Met` because their own Given/When/Then does not require that specific field, and the report's prose does name and address all five findings by content.

The second CAP-001 report also carries its own finding: three swimlane arrow-label masks sat on their own connectors and a fourth was overpainted by a box, on the run that reads FAIL. Those were fixed in `76ad403c52`, and a visual spot-check this session confirms the fix on disk, but no third CAP-001 run has re-verified it — the corrected swimlane render has not itself been through the judged six-reads process again.

This phase carries no separate `decision-record.md` file. AC-008 needs either the note written or an explicit waiver decision before this packet can close.
<!-- /ANCHOR:closure -->
