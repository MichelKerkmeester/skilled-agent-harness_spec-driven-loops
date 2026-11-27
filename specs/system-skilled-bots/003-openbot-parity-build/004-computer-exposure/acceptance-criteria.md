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
| AC-001 | REQ-001 | Given a run whose working place is `/tmp/wt` on branch `worktrees/004-bot-hello` and run folder `/state/runs/r1`, When `buildBotPrompt` runs, Then the prompt holds `Your working place is /tmp/wt on branch worktrees/004-bot-hello. This run's folder is /state/runs/r1.` With a null branch it holds `Your working place is /tmp/wt. This run's folder is /state/runs/r1.`. In both shapes the line sits after the spec-folder line and before the checkout line, in the shared order's working-place slot | `npm --prefix .skilled/skills/system-skilled-bots/runtime test -- dispatch -t "^working place line both shapes$"` prints `Tests  1 passed`, and `npm --prefix .skilled/skills/system-skilled-bots/runtime test -- dispatch -t "^working place line slot$"` prints `Tests  1 passed` Observed 2026-11-27: both filters printed `Tests  1 passed | 20 skipped (21)`, and the slot test also compares `prompt.worktree.txt` line by line | Met | - |
| AC-002 | REQ-002 | Given a worktree run, When the prompt is built, Then the line names the tree and the child's `cwd` is that same path. Given a shared run, Then the line names the checkout | `npm --prefix .skilled/skills/system-skilled-bots/runtime test -- isolation -t "^working place line worktree run$"` prints `Tests  1 passed` Observed 2026-11-27: the filter printed `Tests  1 passed | 26 skipped (27)`. The shared shape is `working place shared run branch` in AC-003 | Met | - |
| AC-003 | REQ-003 | Given a shared run in a checkout on branch `main`, When the run dispatches, Then its record's `evidence.branch` is `main`, the record being the file `recordFile(stateRoot, identity, runId)` returns at `<stateRoot>/<identityKey>/records/<runId>.json`. Given a detached HEAD, Then it is null and the run still dispatches. Given a git read that exits non-zero, returns a null status or prints nothing, Then it is null and the run still dispatches | `npm --prefix .skilled/skills/system-skilled-bots/runtime test -- runner -t "^working place shared run branch$"` prints `Tests  1 passed`, `npm --prefix .skilled/skills/system-skilled-bots/runtime test -- runner -t "^working place detached head$"` prints `Tests  1 passed` and `npm --prefix .skilled/skills/system-skilled-bots/runtime test -- runner -t "^working place unreadable branch$"` prints `Tests  1 passed`. Each test reads the record through `recordFile` and asserts `evidence.branch` on it Observed 2026-11-27: each of the three filters printed `Tests  1 passed | 50 skipped (51)`, each reading the record at `recordFile`. The unreadable case runs a PATH `git` wrapper that exits 1 on `--abbrev-ref`, and the run still completed | Met | - |
| AC-004 | REQ-004 | Given a last run that recorded branch `main` and no tree, When `bots status` prints, Then the row's last part is `branch main`. Given a worktree run, Then the row ends `branch worktrees/004-bot-hello` then `worktree /tmp/wt`. Given neither recorded, Then neither part prints | `npm --prefix .skilled/skills/system-skilled-bots/runtime test -- status -t "^working place row parts$"` prints `Tests  1 passed`, and `T=$(mktemp -d) && mkdir -p "$T/checkout/bots" && printf '{"stateRoot":"%s/state"}\n' "$T" > "$T/checkout/bots/config.json" && node .skilled/bin/bots.cjs status --repo "$T/checkout"` exits 0 against that scratch root Observed 2026-11-27: the filter printed `Tests  1 passed | 40 skipped (41)`, matching all seven lines of `status-rows.txt`, and the scratch `bots status` exited 0 printing `no bots and no open needs-you items` | Met | - |
| AC-005 | REQ-005 | Given the same rows, When `bots status --json` runs, Then `rows[0].lastRun.branch` and `rows[0].lastRun.worktreePath` are each a string or null, and the row's key set is unchanged otherwise | `npm --prefix .skilled/skills/system-skilled-bots/runtime test -- status -t "^working place json keys$"` prints `Tests  1 passed`, and `T=$(mktemp -d) && mkdir -p "$T/checkout/bots" && printf '{"stateRoot":"%s/state"}\n' "$T" > "$T/checkout/bots/config.json" && node .skilled/bin/bots.cjs status --json --repo "$T/checkout"` exits 0 against that scratch root Observed 2026-11-27: the filter printed `Tests  1 passed | 40 skipped (41)`, and the scratch `bots status --json` exited 0 | Met | - |
| AC-006 | REQ-006 | Given an index built before this phase, When `bots status` opens it, Then it opens and prints rows with neither part, because `lastRunOf` reads each summary field as the value when it is a string and as null otherwise. Given a rebuilt index, Then `RunSummary` carries both fields | `npm --prefix .skilled/skills/system-skilled-bots/runtime test -- status -t "^working place old index$"` prints `Tests  1 passed`, and `rg -n "SCHEMA_VERSION = '2'" .skilled/skills/system-skilled-bots/runtime/lib/status-index.ts` prints one line Observed 2026-11-27: the filter printed `Tests  1 passed | 40 skipped (41)` over an index whose stored summary had both keys deleted and was not rebuilt, and `rg` printed `55:const SCHEMA_VERSION = '2';` | Met | - |
| AC-007 | REQ-007 | Given a parked prompt that carries no working-place line, When the run resumes, Then the dispatched prompt holds the line naming the parked tree and the record's `evidence.worktreePath` is that tree. Given a parked prompt whose line names the same path, Then the parked line is replaced with the current line, so the prompt names the current run folder and the line appears exactly once. Given a parked prompt whose line names another path, Then the run is refused `resume-item-invalid` with detail `the parked prompt names another working place` | `npm --prefix .skilled/skills/system-skilled-bots/runtime test -- runner -t "^working place parked prompt gains the line$"` prints `Tests  1 passed`, `npm --prefix .skilled/skills/system-skilled-bots/runtime test -- runner -t "^working place parked prompt same path$"` prints `Tests  1 passed` and `npm --prefix .skilled/skills/system-skilled-bots/runtime test -- runner -t "^working place parked prompt another path$"` prints `Tests  1 passed` Observed 2026-11-27: each of the three filters printed `Tests  1 passed | 50 skipped (51)` | Met | - |
| AC-008 | REQ-008 | Given a run refused before the isolation step, When its record is read, Then `evidence.branch` and `evidence.worktreePath` are both null. Given a run refused at the isolation step, Then its record keeps the half-provisioned tree it kept, as it does today | `npm --prefix .skilled/skills/system-skilled-bots/runtime test -- runner -t "^working place refusal records neither$"` prints `Tests  1 passed`, and `npm --prefix .skilled/skills/system-skilled-bots/runtime test -- isolation -t "^working place refusal keeps the tree$"` prints `Tests  1 passed` Observed 2026-11-27: the runner filter printed `Tests  1 passed | 50 skipped (51)` and the isolation filter printed `Tests  1 passed | 26 skipped (27)` | Met | - |
| AC-009 | REQ-009 | Given the two docs, When they are read, Then `runtime/lib/README.md` names the working place on the `dispatch.ts` row and the checkout branch on the `isolation.ts` row, and `bots-status/references/status-and-inbox.md` names `branch <name>` and `worktree <path>` | `rg -n 'working place' .skilled/skills/system-skilled-bots/runtime/lib/README.md` prints one line, and `rg -n 'branch <name>' .skilled/skills/system-skilled-bots/bots-status/references/status-and-inbox.md` prints one line Observed 2026-11-27: the README `rg` printed one line, 63, the `dispatch.ts` row, and the status reference `rg` printed one line, 49 | Met | - |
| AC-010 | REQ-010 | Given the design folder, When it is read, Then it holds six documents and twelve goldens, every golden parses and `design/fixtures/README.md` names the test that reads each one. Given a shape change, Then the golden for that shape is edited in the same change | `ls specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/design` prints six documents and `fixtures`, `ls specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/design/fixtures` prints twelve goldens and `README.md` and every `.json` golden parses under `node -e 'JSON.parse(require("fs").readFileSync(process.argv[1],"utf8"))'` Observed 2026-11-27: `ls design` printed six documents and `fixtures`, `ls design/fixtures` printed 13 entries (twelve goldens and `README.md`) and every `.json` golden parsed | Met | - |

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
waiver is treated as an unmet criterion rather than as a pass.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** Yes

All ten criteria are Met, each with the output observed on 2026-11-27 in its Verification cell. The whole runtime suite passed 39 files and 472 tests against the 39 files and 456 tests it passed before the change, and `npm run typecheck` exited 0. Nothing is waived, so no decision record carries a closure ADR.
<!-- /ANCHOR:closure -->
