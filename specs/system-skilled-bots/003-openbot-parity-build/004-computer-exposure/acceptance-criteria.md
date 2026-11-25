---
title: "Acceptance Criteria: Phase 4: computer-exposure"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "computer exposure acceptance criteria"
  - "bot working place acceptance criteria"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 4: computer-exposure

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-skilled-bots/003-openbot-parity-build/004-computer-exposure
**Level:** 2
**Status:** Draft
**Date:** 2026-11-25
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a run whose working place is `/tmp/wt` on branch `worktrees/004-bot-hello` and run folder `/state/runs/r1`, When `buildBotPrompt` runs, Then the prompt holds `Your working place is /tmp/wt on branch worktrees/004-bot-hello. This run's folder is /state/runs/r1.`; with a null branch it holds `Your working place is /tmp/wt. This run's folder is /state/runs/r1.`; and in both shapes the line sits after the spec-folder line and before the checkout line, in the shared order's working-place slot | `npm --prefix .skilled/skills/system-skilled-bots/runtime test -- dispatch` prints no `failed` and names `workingPlaceLine` in both shapes, and asserts the line's index is after the spec-folder line, before the checkout line when the prompt carries one, and before the line that starts with `[NEEDS-DECISION]` | Unmet | - |
| AC-002 | REQ-002 | Given a worktree run, When the prompt is built, Then the line names the tree and the child's `cwd` is that same path; Given a shared run, Then the line names the checkout | `npm --prefix .skilled/skills/system-skilled-bots/runtime test -- isolation` asserts the prompt holds `evidence.worktreePath` and the stub's `cwd` equals it | Unmet | - |
| AC-003 | REQ-003 | Given a shared run in a checkout on branch `main`, When the run dispatches, Then its record's `evidence.branch` is `main`, the record being the file `recordFile(stateRoot, identity, runId)` returns at `<stateRoot>/<identityKey>/records/<runId>.json`; Given a detached HEAD, Then it is null and the run still dispatches | `npm --prefix .skilled/skills/system-skilled-bots/runtime test -- runner` asserts both, and `node -e 'console.log(require(process.argv[1]).evidence.branch)' <stateRoot>/<identityKey>/records/<runId>.json` prints `main` for a real run | Unmet | - |
| AC-004 | REQ-004 | Given a last run that recorded branch `main` and no tree, When `bots status` prints, Then the row's last part is `branch main`; Given a worktree run, Then the row ends `branch worktrees/004-bot-hello` then `worktree /tmp/wt`; Given neither recorded, Then neither part prints | `node .skilled/bin/bots.cjs status` prints `branch main` on the shared row, and `npm --prefix .skilled/skills/system-skilled-bots/runtime test -- status` asserts the three cases | Unmet | - |
| AC-005 | REQ-005 | Given the same rows, When `bots status --json` runs, Then `rows[0].lastRun.branch` and `rows[0].lastRun.worktreePath` are each a string or null, and the row's key set is unchanged otherwise | `node .skilled/bin/bots.cjs status --json` prints both keys under `lastRun`, and `npm --prefix .skilled/skills/system-skilled-bots/runtime test -- status` asserts the key set | Unmet | - |
| AC-006 | REQ-006 | Given an index built before this phase, When `bots status` opens it, Then it opens and prints rows with neither part; Given a rebuilt index, Then `RunSummary` carries both fields | `node .skilled/bin/bots.cjs status` exits 0 without `--rebuild`, and `rg -n "SCHEMA_VERSION = '2'" .skilled/skills/system-skilled-bots/runtime/lib/status-index.ts` prints one line | Unmet | - |
| AC-007 | REQ-007 | Given a parked prompt that carries no working-place line, When the run resumes, Then the dispatched prompt holds the line naming the parked tree and the record's `evidence.worktreePath` is that tree | `npm --prefix .skilled/skills/system-skilled-bots/runtime test -- runner` asserts the line was added and the record names the parked tree | Unmet | - |
| AC-008 | REQ-008 | Given a run refused before dispatch, When its record is read, Then `evidence.branch` and `evidence.worktreePath` are both null | `npm --prefix .skilled/skills/system-skilled-bots/runtime test -- runner` asserts both nulls on a refusal record | Unmet | - |
| AC-009 | REQ-009 | Given the two docs, When they are read, Then `runtime/lib/README.md` names the working place on the `dispatch.ts` row and the checkout branch on the `isolation.ts` row, and `bots-status/references/status-and-inbox.md` names `branch <name>` and `worktree <path>` | `rg -n 'working place' .skilled/skills/system-skilled-bots/runtime/lib/README.md` prints one line, and `rg -n 'branch <name>' .skilled/skills/system-skilled-bots/bots-status/references/status-and-inbox.md` prints one line | Unmet | - |

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

No module carries the working-place line yet, so AC-001 is unmet and every later criterion depends on it. Nothing is waived, so no decision record carries a closure ADR.
<!-- /ANCHOR:closure -->
