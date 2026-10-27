---
title: "Acceptance Criteria: Router reach check scores the shipped fleet and notes operator-local ties"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "router reach local ties acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/017-portable-code-modes/013-router-reach-local-ties"
    last_updated_at: "2026-10-27T23:30:00Z"
    last_updated_by: "implementer"
    recent_action: "Met every criterion with live runs against the main and worktree advisors"
    next_safe_action: "Conductor adds the child to the parent phase table and commits"
    blockers: []
    key_files:
      - ".skilled/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs"
      - ".skilled/skills/sk-doc/sk-create-skill/scripts/tests/ci-router-vocabulary-reach.test.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "router-reach-local-ties-implementer"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Router reach check scores the shipped fleet and notes operator-local ties

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** `013-router-reach-local-ties`
**Level:** 2
**Status:** Complete
**Date:** 2026-10-27
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the main checkout with its private links, When the changed check runs over the whole fleet against the main advisor, Then it prints `RESULT: PASSED` and exits 0 with both phrases as notes | Before, unchanged script at generation 1779: `outranked  browser agent` and `outranked  css extraction`, `RESULT: FAILED`, exit 1. After, same generation: `outranked=0`, `operator-local=2`, `probe-error=0`, `RESULT: PASSED`, exit 0, with `note       browser agent  operator-local=0.8200, mcp-tooling=0.8200` and `note       css extraction  operator-local=0.8357, sk-design=0.8248`. Ranking: `.skilled/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs:92` | Met | - |
| AC-002 | REQ-002 | Given a private surface at 0.90, `sk-code` at 0.85 and the declaring hub at 0.82, When the check runs, Then the row is outranked by `sk-code` and the run exits 1 | `testPrivateSurfaceCannotMaskAShippedWinner` passes: `RESULT: FAILED`, exit 1, row `outranked ... sk-code=0.8500, mcp-tooling=0.8200`. Test: `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/ci-router-vocabulary-reach.test.cjs:119` | Met | - |
| AC-003 | REQ-003 | Given any private surface in a ranking, When the check prints text or `--json`, Then no line carries its id | `testPrivateTieIsANote` and `testPrivateTieInJson` assert the id is absent from stdout and stderr; the live main-checkout run prints `operator-local=` with no name. Note row: `.skilled/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs:248` | Met | - |
| AC-004 | REQ-004 | Given the new test, When it runs against the unchanged and the changed check, Then it fails and then passes | `HEAD` copy of the check: `a private tie must not fail the run`, `outranked= 75`, exit 1. Changed check: `[sk-doc] router reach shipped-fleet ranking passed`, exit 0. Test: `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/ci-router-vocabulary-reach.test.cjs:91` | Met | - |
| AC-005 | REQ-005 | Given the change, When the advisor and doctor suites run, Then they pass with the baseline counts | Advisor vitest before and after: `Test Files 153 passed (153)`, `Tests 1301 passed / 8 skipped (1309)`, exit 0. `test_skill_advisor.py`: `pass=87, fail=0`, exit 0. `doctor-phrase-reach.cjs`: `STATUS=OK phrases=118 bridges=22`, exit 0, in both checkouts. All 19 sk-create-skill script tests exit 0. Worktree reach run: `RESULT: PASSED`, `operator-local=0`. Failing kinds: `.skilled/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs:321` | Met | - |
| AC-006 | REQ-006 | Given the two owning skills, When their entries are validated and Hermes is resynced, Then each reports 0 issues and the carriers match | `validate_document.py --json` `"total_issues": 0` for `v1.5.11.0.md` and `v0.17.13.0.md`; `.skilled/skills/sk-doc/sk-create-skill/SKILL.md:5` reads `1.5.11.0` and `.skilled/skills/system-skill-advisor/SKILL.md:5` reads `0.17.13.0`; `sync-skills-hermes.cjs` wrote 2 copies, exit 0; `parent-skill-check.cjs .skilled/skills/sk-doc` passed | Met | - |

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

Every criterion is met with observed runs against the main checkout's advisor and the worktree's.
<!-- /ANCHOR:closure -->
