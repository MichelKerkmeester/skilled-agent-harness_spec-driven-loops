---
title: "Acceptance Criteria: Phase 11: alignment-fixes"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "alignment fixes acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/015-quality-agnostic-gate/011-alignment-fixes"
    last_updated_at: "2026-10-27T21:00:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Met every criterion with observed evidence"
    next_safe_action: "None; the conductor commits the lane"
    blockers: []
    key_files:
      - "spec.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-10-27-skcode-015-011"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 11: alignment-fixes

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-code/015-quality-agnostic-gate/011-alignment-fixes
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
| AC-001 | REQ-001 | Given the Python scorer, When `/doctor:ci toggle`, `/doctor:ci scaffold`, `/doctor:git standards` or `/doctor:sk-code quality` is typed, Then the sibling target is the explicit intent and ranks first, and a prompt with two separate commands keeps the first | `test_skill_advisor.py` printed `PASS: typed doctor sibling target beats its bare default marker` after the fix, FAIL before it, and FAIL on the two-command case under a plain longest-marker rule (`tasks.md:45`) | Met | - |
| AC-002 | REQ-001 | Given the TypeScript ordering, When the same four prompts run, Then the sibling target leads | `doctor-ordering.vitest.ts` printed `Tests 32 passed (32)` (`tasks.md:46`) | Met | - |
| AC-003 | REQ-002 | Given a prompt that asks to run, rerun, execute, turn or switch on or off, enable or disable something and then show the result, When the classifier reads it, Then it is not read-only and no corpus row changes | `read-only-explainer.vitest.ts` prints `Tests 10 passed`, the accuracy read 154/195, 49/66 and 18/24 before and after, and the 343-row corpus diff showed 0 top-1 changes (`tasks.md:47`, `tasks.md:68`) | Met | - |
| AC-004 | REQ-003 | Given a git release prompt that names the release workflow, When the advisor routes it, Then it reaches sk-git and not `sk-code-ci` | O03 went from `sk-code/sk-code-ci` to `sk-git 0.82` and O05 to `sk-git 0.837`, while C03 and C06 still read `sk-code/sk-code-ci` (`tasks.md:48`, `tasks.md:56`) | Met | - |
| AC-005 | REQ-004 | Given a CI cost prompt, When the advisor routes it, Then it reaches `sk-code-ci`, N01 and N04 do not, and the route guard reads fresh | P04, C01 to C07, H01 to H15 and the two CI debugging prompts read `sk-code/sk-code-ci`, N01 and N04 stay off it, the flowchart, heatmap and blog-post prompts leave sk-code, and the guard printed `"failures": 0` (`tasks.md:49`, `tasks.md:50`, `tasks.md:59`) | Met | - |
| AC-006 | REQ-005 | Given the router sync verifier, When its first lines are read, Then it names its module | `grep -n MODULE` printed `verify-router-sync.cjs:3:// MODULE: Router Sync Verifier` (`tasks.md:51`) | Met | - |
| AC-007 | REQ-006 | Given the sk-code feature catalog, When the package validator runs, Then it passes with the five new entries | `validate_catalog_package.py --package sk-code` printed `PASS: 0 violations` (`tasks.md:52`) | Met | - |
| AC-008 | REQ-007 | Given the root README, When the setup line is read, Then it names the quality leg | `rg -n 'route-probe and quality checks' README.md` printed line 1254 (`tasks.md:53`) | Met | - |
| AC-009 | REQ-008 | Given phase 002, When the packet changelog folder is listed, Then it holds `changelog-015-002-builtin-runner.md` with no blocking validation error | `validate_document.py` printed `valid: true` with 0 blocking errors (`tasks.md:54`) | Met | - |
| AC-010 | REQ-004 | Given the final tree, When the sk-code setup battery runs, Then every leg passes | `sk-code-setup-check.cjs` printed `STATUS=OK legs=9` (`tasks.md:69`) | Met | - |
| AC-011 | REQ-009 | Given sk-git's release vocabulary and the tagged-release anchor, When the slice prompt and unrelated tag phrases are replayed, Then "update skilled to the latest release" stays on sk-code and no unrelated phrase reaches sk-git through them | The slice prompt reads `sk-code`, `tagged-release-intent.vitest.ts` prints `Tests 12 passed` with the newsletter, blog-post and release-notes negatives, the Python assertions fail against HEAD and pass now, G01, G02, G03, G04 and G06 do not read sk-git, and G05 reads sk-git on the word `git` alone, as V06 shows (`tasks.md:56`, `tasks.md:58`) | Met | - |
| AC-012 | REQ-009 | Given the sk-git changelog, When it is validated, Then it has 0 issues and the carrier matches | `validate_document.py` printed 0 issues and `SKILL.md` reads `version: 1.10.1.0` (`tasks.md:57`) | Met | - |

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

Every criterion is met with evidence observed on 2026-10-27.
<!-- /ANCHOR:closure -->
