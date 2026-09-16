---
title: "Acceptance Criteria: Phase 11: verification-and-rollout"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record or superseded by one."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "ac traceability"
  - "waiver adr"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/011-verification-and-rollout"
    last_updated_at: "2026-09-16T22:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Authored one criterion per requirement, each mapped to a parent completion criterion"
    next_safe_action: "Start when phase 010 validates PASSED, then meet the criteria in task order"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "041-011-plan"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 11: verification-and-rollout

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/011-verification-and-rollout
**Level:** 2
**Status:** Draft
**Date:** 2026-09-16
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. The Parent column names the completion criterion in `../goal.md:86-91` that the row proves, counted from the top. `$EV`, `$P` and `TIP` are defined in `plan.md` §4.1 and §4.2.

| AC-ID | REQ | Parent | Given / When / Then | Verification | Status | Waiver |
|-------|-----|--------|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | 3 | Given canary tokens planted under `.skilled/` at `TIP`, When each of the seven runtimes runs its skill, command and agent cells and its negative control, Then all 21 cells return their own token through the recorded consumption path and no negative control returns a `SKILLED-011-` token | `$EV/smoke-*.log` per plan §5.1: each cell log holds exactly its token, each negative log holds none, the realpath census resolves under `.skilled/`, generated copies pass their generator `--check` and fork cells pass `check-agent-mirror-sync.cjs --all` | Unmet | - |
| AC-002 | REQ-002 | 4 | Given `TIP` pinned and the `.pytest_cache` count at 0, When G01 to G13 run from the worktree, Then every gate prints its affirmative marker and no verdict rests on an exit status alone | `$EV/g01-drift-guards.log` to `$EV/g13-packet-validation.log` holding the plan §5.2 markers: `run-all-drift-guards: all 2 guards PASSED`, `checked=13 passed=13 failed=0 fixed=0`, the naming `PASS:` line, `trigger index published` with four silent `cmp` runs, `Test Files  6 passed (6)`, 0 failed at or above baseline for G06 to G08 and a first `RESULT: PASSED` for G13 | Unmet | - |
| AC-003 | REQ-003 | 2 | Given phase 004's kept set, When the tree is listed at `TIP`, Then `.skilled/` holds the ten authored directories named in `../spec.md:80` and `.opencode/` holds exactly the kept set with no dangling link | `git ls-tree --name-only "$TIP" .skilled/` listing all ten, `git ls-tree -r --name-only "$TIP" -- .opencode` diffed against 004's list with an empty diff and `find -L .opencode -maxdepth 2 -type l` printing nothing (plan §5.3) | Unmet | - |
| AC-004 | REQ-004 | 5 | Given every `.opencode` hit enumerated with `git grep -a` at `TIP`, When the units classify each line and the orchestrator reconciles, Then zero files remain `residue` and the planted positive control was found | `$EV/residue-hits.txt` line count equal to the summed rows of the unit TSVs, the deterministic reclassifier reporting 0 unresolved disagreements, every `residue` row opened and cleared and both planted lines present in the control run (plan §5.3) | Unmet | - |
| AC-005 | REQ-005 | 4 | Given phase 005's independent check, When it runs on the control clone and on each mutant clone, Then the control passes and every mutant exits non-zero and names its mutated path | Logs for `indep-control`, `indep-dangling-link`, `indep-missing-file`, `indep-stale-reference`, `indep-gate-disengaged` and, when 005's contract covers derived state, `indep-stale-generated` (plan §5.4) | Unmet | - |
| AC-006 | REQ-006 | 4 | Given the review cleared and both pairing prechecks clean, When `TIP` is pushed to `skilled/v4.0.0.0` and then to `main`, Then both remote refs equal `TIP` and every expected CI run for `TIP` concludes `success` with its marker present and no skip line | `git rev-parse origin/skilled/v4.0.0.0` and `git rev-parse origin/main` both printing `TIP`, `$EV/ci-runs.txt` matching the expected table in plan §5.5 and the skip grep over `$EV/ci-*.log` returning nothing | Unmet | - |
| AC-007 | REQ-007 | 6 | Given both branches at `TIP`, When the primary checkout is reconciled per Step 5b, Then it carries `TIP` and all seven global hook links and every recorded home-config path resolve | `git -C "$P" rev-parse HEAD` printing `TIP` or a descendant, the hook loop in plan §4.4 printing `resolves` seven times and `DANGLING` never, each recorded config path passing `test -e` and G13 passing in the primary | Unmet | - |
| AC-008 | REQ-008 | 1 | Given all phase work done, When each of the eleven phases is validated on its own strict run, Then every first `RESULT:` line reads `RESULT: PASSED` and the parent goal's six criteria are checked with receipts | The eleven first `RESULT:` lines recorded by T038 and the completion section of `../goal.md` with all six boxes checked and one cited receipt each | Unmet | - |
| AC-009 | REQ-009 | 3, 4 and 5, supporting | Given the evidence folder complete, When GPT-5.6 on cli-codex reviews AC-001 to AC-008, Then no row comes back `contradicted` and every `unsupported` row was re-run before the first push | `$EV/review-gpt-5-6.md` verdict table and the T030 re-run logs | Unmet | - |
| AC-010 | REQ-010 | None, phase hygiene | Given the evidence digest written, When cleanup runs, Then `$EV`, every clone and every `.pytest_cache` are gone and worktree 055 is removed after the operator's yes | `find` counting 0 `.pytest_cache` directories in both checkouts, `test ! -e "$EV"`, `git worktree list` without `055-skilled-source-root-migration` and the operator's yes recorded in the parent goal log | Unmet | - |

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

No criterion is met yet, because the phase has not started. This statement is rewritten when the phase closes.
<!-- /ANCHOR:closure -->
