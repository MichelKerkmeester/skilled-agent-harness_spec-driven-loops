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
**Status:** Draft
**Date:** 2026-09-11
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given `render-screenshots.cjs` captures at a fixed `1280x900` today, When `--full-page` is added as an opt-in flag, Then omitting the flag leaves capture byte-identical to today | Fresh unflagged render of `sk-design-chart/assets` into a scratch dir, `diff -rq` against committed `sk-design-chart/screenshots/`, empty | Unmet | - |
| AC-002 | REQ-002 | Given no full-page flag exists today, When `--full-page` is set, Then each file's window height is its own measured `document.documentElement.getBoundingClientRect().height`, read from a temp-copy `--dump-dom` pass, with the technique documented in a comment beside the code | Manual run of the new measurement function against `template-full.html` returns `1364`; `grep -n "getBoundingClientRect" render-screenshots.cjs` finds the comment | Unmet | - |
| AC-003 | REQ-003 | Given the renderer is shared with `sk-design-chart` and D12 forbids changing that skill, When the chart's unflagged invocation runs after this phase, Then its output is byte-identical to its committed screenshots | Fresh unflagged render into a scratch dir, `diff -rq` against `sk-design-chart/screenshots/`, empty | Unmet | - |
| AC-004 | REQ-004 | Given `assets/diagrams/` and `assets/icons.html` are the full corpus, When the reshoot runs with `--full-page`, Then every source has exactly one PNG under `screenshots/diagrams/` or `screenshots/icons.png`, and the pre-merge `screenshots/examples/`/`screenshots/templates/` directories no longer exist | `render-screenshots.cjs ... --check` reports zero missing; `test -d screenshots/examples` and `test -d screenshots/templates` both fail | Unmet | - |
| AC-005 | REQ-005 | Given every form now captures at its true content height, When each regenerated PNG's pixel height is compared to its source's independently measured height, Then the two agree for every file, with zero mismatches | Per-file `sips -g pixelHeight` vs. independent height measurement, tabulated for the whole corpus | Unmet | - |
| AC-006 | REQ-006 | Given the playbook's Result Persistence contract names `run-manual-playbook-scenario.cjs` as the only path that may write a CAP-001 report, When CAP-001 reruns against the full-page captures, Then a new report folder exists under `benchmark/reports/`, generated Markdown only | New folder distinct from `2026-09-11--manual-testing-playbook--capture-review`; `skill-benchmark-report.json` carries `scenarioId: "CAP-001"`; `README.md`/`skill-benchmark-report.md` are runner output, not hand-edited | Unmet | - |
| AC-007 | REQ-007 | Given the first report recorded five findings (dp-integration, venn, template-full focal balance; swimlane HANDOFF mask overflow; the renderer crop), When the second report is read, Then each of the five is stated as closed-with-evidence or carried-forward-with-a-reason, and no `SKIP` anywhere in the run has an empty reason | Direct read of the second report's scenario reason field naming all five findings by name | Unmet | - |
| AC-008 | REQ-008 | Given S10 named the crop as something a future reviewer would otherwise rediscover, When the playbook is updated, Then it carries a note that a capture review reads full-page images, citing S10 | `grep -n "S10"` in `manual-testing-playbook.md` or `capture-review/capture-review.md` finds the added note | Unmet | - |
| AC-009 | REQ-009 | Given the diagram packet's own regeneration command must match what it now actually does, When `sk-design-diagram/README.md` is updated, Then its snippet shows `--full-page`, while `sk-design-chart/README.md`'s snippet is untouched | `grep -n -- "--full-page" sk-design-diagram/README.md` finds it; `git diff` over `sk-design-chart/README.md` is empty | Unmet | - |
| AC-010 | Phase gate | Given the flag, the reshoot, the byte-identity proof and the CAP-001 rerun all exist, When this phase closes, Then no committed screenshot is cut off, `sk-design-chart`'s images are unchanged, and the second capture report exists with no hand-authored markdown and no empty-reason skip — the literal 011 closure bar from `../011.md` | AC-001 through AC-009 all `Met`; `node scripts/check-diagram-corpus.cjs` still reports `RESULT: PASSED` | Unmet | - |

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

This packet carries no separate `decision-record.md` file — no criterion here anticipates a waiver, so none is needed unless execution surfaces one. All ten criteria are `Unmet` as authored, since execution (T001-T016 in `tasks.md`) has not yet run. Write the real closure sentence here once AC-001 through AC-010 are settled: which criteria carried the phase, and what — if anything — was carried forward with a reason rather than closed outright.
<!-- /ANCHOR:closure -->
