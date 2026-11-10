---
title: "Acceptance Criteria: Phase 4: alignment-fixes"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "alignment fixes acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/authoring-modes-and-playbooks/005-skill-readability-refinement/014-sk-create-skill-refinements/004-alignment-fixes"
    last_updated_at: "2026-11-05T16:15:37Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "ae286a84-7880-4ce7-a5fe-7d1335e09c78"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 4: alignment-fixes

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-doc/authoring-modes-and-playbooks/005-skill-readability-refinement/014-sk-create-skill-refinements/004-alignment-fixes
**Level:** 2
**Status:** Complete
**Date:** 2026-11-05
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the final state, When `bash .skilled/commands/doctor/scripts/tests/run-all.sh` runs, Then it prints `7 suite(s) passed, 0 failed` | printed `[run-all] 7 suite(s) passed, 0 failed` before commit 5263598754 | Met | - |
| AC-002 | REQ-002 | Given the final state, When `validate_skill_package.py` runs on each of the 13 program skills, Then none prints `: FAIL`, and sk-doc and mcp-tooling print compiled-ready PASS | 0 FAIL for all 13; recheck rows `S2-skill-package` for sk-doc and mcp-tooling resolved | Met | - |
| AC-003 | REQ-003 | Given the guard tests, When `python3 -m pytest -q .skilled/skills/sk-doc/scripts/tests/test_doc_rewrite_guard.py` runs, Then it passes, including the same-name, path-citation and renumbered-section tests | 28 passed; the four new tests failed on the old guard | Met | - |
| AC-004 | REQ-004 | Given the rebuilt advisor, When `run-probes.cjs --probes RUN/probes-input.json` runs, Then it prints `fail=0` | `STATUS=OK run-probes: pass=18 fail=0 cannot_run=0` | Met | - |
| AC-005 | REQ-005 | Given run `20261105T151115Z`, When `recheck.cjs` runs over a fresh battery of its failing rows, Then it prints `new=0` and no literal finding is still open | `resolved=12 still_open=2 new=0 needs_review=20` with plain `node` after the repo-root fix; findings still_open: None. The two open rows are S9 (a gitignored database) and the S2 overflow cap | Met | - |
| AC-006 | REQ-006 | Given the phase commits, When `git log --oneline 0e88ba257b..HEAD` and `sync-skills-hermes.cjs --check` run, Then each changed skill has one commit with a changelog, and the check prints in sync | six skill commits 810a75b3aa to 57000eae12 each add `changelog/v*.md`; `PASS: 66 Hermes skill copies in sync` | Met | - |
| AC-007 | REQ-007 | Given the render tests, When `python3 -m pytest -q .skilled/skills/sk-doc/scripts/tests/test_render_checks.py` runs, Then the playbook and changelog citation tests pass | 36 passed; the playbook test failed with the old gate | Met | - |
| AC-008 | REQ-008 | Given the catalog, When `validate_catalog_package.py --strict` runs, Then no package fails and `feature-catalog.md` names Render Checks and Render Ledger And Rewrite Guard | 27 packages PASS, 0 FAIL; both headings present at 6b1d281efb | Met | - |
| AC-009 | REQ-009 | Given the worktree, When `node -e "console.log(require('./.skilled/commands/assets/local-skilled-alignment/alignment-lib.cjs').REPO_ROOT)"` runs there and in the main checkout, Then each prints its own root | printed the worktree path and the main checkout path; plain-node recheck passed all four S14 rows | Met | - |

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

Every criterion is met with evidence observed from the final state.
<!-- /ANCHOR:closure -->
