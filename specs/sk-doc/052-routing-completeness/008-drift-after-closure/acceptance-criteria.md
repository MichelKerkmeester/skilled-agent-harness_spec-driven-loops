---
title: "Acceptance Criteria: Phase 8: drift after closure"
description: "The criteria this phase must satisfy before it may be closed, each one met on observed evidence with a file and line the coverage rule can read."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "drift after closure criteria"
  - "gate rerun evidence"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/052-routing-completeness/008-drift-after-closure"
    last_updated_at: "2026-09-05T19:30:00Z"
    last_updated_by: "claude-code"
    recent_action: "Closed every criterion after the independent review, with both drifted numbers fixed at their producers"
    next_safe_action: "Close the parent packet"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-05-052-008-drift-after-closure"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "AC-001 and AC-002 are met: both gates re-ran with committed per-row artifacts, and Gate A was re-run a second time after the keyword fix."
      - "AC-003 is met: the scaffold suite is 9 of 9 and the renderer test 12 of 12 from the final tree."
      - "AC-004 is met by two fixes: one signal retired from the CLI hub, and the keyword collision that killed sk-doc's signal removed."
      - "AC-005 is met by a fix: both scorers honour the database override, the test pins the CI regime, and the pins read 109 and 102 twice."
      - "AC-006 is met after the review: nine more continuity paths and eight table rows in phase 007 repointed, the register header corrected, and the parent counts made to agree."
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 8: drift after closure

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-doc/052-routing-completeness/008-drift-after-closure
**Level:** 3
**Status:** Complete
**Date:** 2026-09-05
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the 388-signal Gate A corpus, When every signal is sent to the live daemon and classified by the phase 002 rules, Then a per-row artifact is committed with the recorded bucket beside the re-run bucket | `research/gate-a-rerun-2026-09-05.tsv:1` holds 388 rows: 343 RESOLVED, 21 DEFERRED, 16 WRONG_HUB, 7 NO_RECOMMENDATION, 1 MULTI, two rows differing from the 2026-09-04 recording. `research/gate-a-rerun-2026-09-05-after-keyword-fix.tsv:1` holds the run after ADR-003: 344 RESOLVED, one row differing, the retired signal | Met | - |
| AC-002 | REQ-001 | Given the 180-prompt Gate B corpus, When every prompt is sent to the live daemon, Then a per-row artifact records the full prompt, the top skill, the compiled target, and whether the intended mode was the top pick | `research/gate-b-rerun-2026-09-05.tsv:1`, 180 rows with the full corpus prompt in each, 0 errors: 20 intended-mode top picks, 37 owning-hub top picks, 93 empty replies. At `c328d601d8` phase 003 recorded 21 top picks and 95 empty, in `../003-gate-b-realistic-corpus/tasks.md:78` | Met | - |
| AC-003 | REQ-002 | Given a Level 3 scaffold with `--with-lazy-addons`, When `create.sh` runs, Then every document the contract names exists and the scaffold suite passes in full | Scratch packet held spec, plan, tasks, acceptance-criteria, implementation-summary, decision-record, before-after, timeline, roadmap, description.json, graph-metadata.json. `scaffold-golden-snapshots.vitest.ts:98` is the assertion that failed before the fix and passes after, 9 of 9. `inline-gate-renderer.vitest.ts:99` is the fourth loader spelling, fixed here, 12 of 12 | Met | - |
| AC-004 | REQ-003, REQ-004 | Given a Gate A row whose bucket changed, When the mechanism is read, Then the row is fixed at its producer | `spec kit runtime`: two lines removed at `.opencode/skills/cli-external-orchestration/graph-metadata.json:58` and its derived mirror, mint `already-exists`, guard fresh, live replay `system-spec-kit` 0.93 first. `trigger_phrases`: keyword removed at `.opencode/skills/system-spec-kit/SKILL.md:8`, mechanism at `fusion.ts:808`, live replay `sk-doc` 0.487 after the daemon rebuild | Met | - |
| AC-005 | REQ-003 | Given the Python and TypeScript parity suite, When it runs from the final tree, Then it passes and a local skill-graph rebuild cannot move its number | `scripts/skill_advisor.py:246` resolves the database through `SYSTEM_SKILL_ADVISOR_DB_DIR`; `python-ts-parity.vitest.ts:15` pins the regime before a dynamic import; pins at `python-ts-parity.vitest.ts:200` read 109 and 102 with seven accepted rows. Two consecutive runs: 2 passed each. Six sibling suites: 41 passed | Met | - |
| AC-006 | REQ-005 | Given phase 007's continuity and the parent's documents, When each named path and status is checked against the tree, Then every named path exists and every status and count agrees | All nine `key_files` across `../007-spec-kit-residue/implementation-summary.md:19`, `tasks.md:19` and `decision-record.md:20` exist on disk; the eight rows at `../007-spec-kit-residue/spec.md:154` name `runtime/cli/` paths. `../research/findings-register.md:14` reads forty-five. `../spec.md:271` maps eight phases Complete. `../goal.md:93` and `../spec.md:152` carry the same register tally | Met | - |

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

AC-001 to AC-003 carried the phase on measurement: both gates reproduce, and the scaffold
renders a full packet again with the same test that was red proving it. AC-004 and AC-005
were first met by recording and are now met by fixes, after two independent investigations
found the producers. AC-006 was found false by an independent review of this phase and is
met only after its findings were worked through. The one thing that leaves the packet
owned rather than fixed is the validator gap in ADR-004, which is a fleet gate change.
<!-- /ANCHOR:closure -->
