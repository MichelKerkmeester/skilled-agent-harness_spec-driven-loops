---
title: "Acceptance Criteria: Phase 4: worktree-isolation-and-delivery"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "worktree isolation and delivery acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/001-headless-bots-first-build/004-worktree-isolation-and-delivery"
    last_updated_at: "2026-11-23T08:40:00Z"
    last_updated_by: "phase-builder"
    recent_action: "Added the parked-resume row and moved every citation to the fixed code"
    next_safe_action: "Review and commit the phase"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-004-worktree-isolation-and-delivery"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 4: worktree-isolation-and-delivery

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** `system-skilled-bots/001-headless-bots-first-build/004-worktree-isolation-and-delivery`
**Level:** 2
**Status:** In Progress
**Date:** 2026-11-22
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a bot that declares `isolation: worktree`, When `bots run <id>` runs it, Then the tree sits outside `git rev-parse --show-toplevel`, its provisioned links exist before dispatch and the run record names its path and branch | `.skilled/skills/system-skilled-bots/runtime/tests/isolation.vitest.ts:162` placement case passed (tree under the configured base and outside the toplevel, branch `worktrees/001-bot-nightly`, links equal the recorded set when the tree is handed back); `.skilled/skills/system-skilled-bots/runtime/tests/isolation.vitest.ts:393` runner case passed (the stub ran with its cwd set to the tree). T017: `bots run worktree-posture` with the stub executor exited 0; its record holds `worktreePath` `<temp>/wtbase/001-bot-worktree-posture`, outside `git rev-parse --show-toplevel`, and branch `worktrees/001-bot-worktree-posture` (implementation-summary.md, Verification) | Met | - |
| AC-002 | REQ-002 | Given a clean, unchanged hub worktree, When it is removed, Then every link is unlinked first and the main checkout's dependency folders hold the same entry count as before | `.skilled/skills/system-skilled-bots/runtime/tests/isolation.vitest.ts:232` removal case passed: the fake `node_modules` lists alpha, beta and gamma before and after, and the tree and branch are gone. The unlink at `.skilled/skills/system-skilled-bots/runtime/lib/isolation.ts:683` runs before `git worktree remove` at `.skilled/skills/system-skilled-bots/runtime/lib/isolation.ts:695`. Mutation check: with the unlink dropped, this case failed | Met | - |
| AC-003 | REQ-003 | Given a dirty or unmerged tree, When the run ends, Then the tree is not removed, `git worktree list` still shows it and the record and notice report it as kept with its reason | `.skilled/skills/system-skilled-bots/runtime/tests/isolation.vitest.ts:245` kept-state rows passed (dirty untracked, dirty modified, unmerged, stashed); `.skilled/skills/system-skilled-bots/runtime/tests/isolation.vitest.ts:271` a file the bot put in a folder made to hold links keeps the tree as `dirty` with every link intact; `.skilled/skills/system-skilled-bots/runtime/tests/isolation.vitest.ts:285` half-provisioned; `.skilled/skills/system-skilled-bots/runtime/tests/delivery.vitest.ts:255` the real linking step fails on an unlistable folder, the run is refused `worktree-setup-failed`, the tree is kept `half-provisioned` and the notice names it; `.skilled/skills/system-skilled-bots/runtime/tests/isolation.vitest.ts:485` kill test (record kept with reason `dirty`, tree still in `git worktree list`); `.skilled/skills/system-skilled-bots/runtime/tests/isolation.vitest.ts:320` the reaper's numbered lane keeps dirty, unmerged and half-provisioned bot trees; `.skilled/skills/system-skilled-bots/runtime/tests/delivery.vitest.ts:245` the notice names the kept tree, branch and reason | Met | - |
| AC-004 | REQ-004 | Given two concurrent worktree runs, When both start, Then they receive different `NNN` numbers and neither lease key contains a worktree path | `.skilled/skills/system-skilled-bots/runtime/tests/isolation.vitest.ts:460` concurrency case passed: two live child runs got two distinct `NNN` values, and neither lease key nor lock file holds either tree path | Met | - |
| AC-005 | REQ-005 | Given a send whose result is uncertain, When delivery records it, Then the state is `unknown`, no second send is attempted and the run outcome field is unchanged | `.skilled/skills/system-skilled-bots/runtime/tests/delivery.vitest.ts:125` passed: a sender that throws leaves one `unknown` entry and a send counter of 1, a second `deliverRecord` pass sends 0, and the exit stays `converged`. `.skilled/skills/system-skilled-bots/runtime/tests/delivery.vitest.ts:149` passed: with the records folder read-only, the claim file names each refused record write and still stops a second send, and the generation stamp advances once per pass | Met | - |
| AC-006 | REQ-006 | Given a definition with no `isolation` field and no repository default, When the runner starts, Then it applies phase 1's missing-posture rule and never picks a workspace itself | `.skilled/skills/system-skilled-bots/runtime/tests/isolation.vitest.ts:418` passed: a definition with no `isolation` and no default is refused `posture-refused` (`isolation-undeclared`), and the recording naming stub was never called. `.skilled/skills/system-skilled-bots/runtime/tests/isolation.vitest.ts:408`: an unconfigured base is refused `worktree-refused` and no tree is made | Met | - |
| AC-007 | REQ-007 | Given an empty target list, a failed run with an override and a desktop target, When delivery resolves them, Then it writes `not-attempted`, picks the override and records the notice as `attempted` only | `.skilled/skills/system-skilled-bots/runtime/tests/delivery.vitest.ts:54` and `.skilled/skills/system-skilled-bots/runtime/tests/delivery.vitest.ts:62` passed (`not-attempted` for local-only, an empty list and a non-failure refusal; the override picked on a failed run). `.skilled/skills/system-skilled-bots/runtime/tests/delivery.vitest.ts:100` passed: a stub answering `acknowledged` on the desktop channel is stored as `attempted`. `.skilled/skills/system-skilled-bots/runtime/tests/delivery.vitest.ts:76`: the desktop sender records exit 0 as `attempted` and exit 1 as `failed` | Met | - |
| AC-008 | REQ-008 | Given any delivery record, When its body is read, Then it names channel, target, state and evidence and holds no command line or environment value | `.skilled/skills/system-skilled-bots/runtime/tests/delivery.vitest.ts:222` passed: three bodies (completed, parked, failed) hold no env value of 8 or more characters, no prompt text and no command words. Each entry names channel, target, state and evidence (`.skilled/skills/system-skilled-bots/runtime/tests/delivery.vitest.ts:100`). `.skilled/skills/system-skilled-bots/runtime/tests/delivery.vitest.ts:281` withholds a body that holds a secret literal | Met | - |
| AC-009 | REQ-009 | Given the negative worktree fixture, whose shared-path list does not resolve, When the checker runs on it, Then it exits non-zero and prints the worktree invariant id | `.skilled/skills/system-skilled-bots/runtime/tests/bot-check.vitest.ts:120` defect loop passed for `worktree-shared-paths-unresolved` and `isolation-invalid` (exit 1, invariant id printed); `.skilled/skills/system-skilled-bots/runtime/tests/bot-check.vitest.ts:187` per-bot case passed. The checker calls `resolveSharedPaths` from the isolation module (`.skilled/skills/system-skilled-bots/scripts/bot-check.cjs:195`) and restates no list | Met | - |
| AC-010 | REQ-010 | Given this phase's code, When it is searched, Then no path calls `launchctl bootstrap` or writes a plist | `rg -n 'launchctl bootstrap\|\.plist' .skilled/skills/system-skilled-bots/runtime/lib` printed nothing, rc=1 (T020). The install-free removal path is `.skilled/skills/system-skilled-bots/runtime/lib/isolation.ts:695` | Met | - |
| AC-011 | REQ-011 | Given a run that ends `awaiting-decision` and opens one needs-you item, When delivery runs for it twice, Then one notice is sent per target, each record names the item id, and the second pass sends nothing | `.skilled/skills/system-skilled-bots/runtime/tests/delivery.vitest.ts:194` passed: a parked run with targets `desktop` and `desktop:phone` sent 2 notices, each entry carries the item id, and the second pass sent 0. Each body names the item id, bot id, run id and question | Met | - |
| AC-012 | REQ-007 | Given the real desktop channel on the operator's Mac, When one notice is sent through it, Then a notification appears and the channel records `attempted` with evidence `osascript exit 0` | Run once with operator approval on 2026-11-23: the script exited 0 and printed `{"state":"attempted","evidence":"osascript exit 0"}` (`specs/system-skilled-bots/001-headless-bots-first-build/004-worktree-isolation-and-delivery/scratch/live-desktop-notice-result.txt:1`). The on-screen notice is for the operator to confirm. The stubbed sender test `.skilled/skills/system-skilled-bots/runtime/tests/delivery.vitest.ts:76` also passes | Met | - |
| AC-013 | REQ-001, REQ-011 | Given a worktree bot that edits a file and parks as `awaiting-decision`, When its item is answered and the resume runs, Then the parked run's tree is kept as `awaiting-decision`, the resume dispatches in that same tree and sees the edit, and a resume whose kept tree is gone is refused `parked-worktree-missing` with no fresh tree | The negative control failed on the code before the fix: the resume ran in a fresh tree and the stub exited 7 because the edit was missing (`specs/system-skilled-bots/001-headless-bots-first-build/004-worktree-isolation-and-delivery/scratch/resume-negative-control.txt:12`). After the fix `.skilled/skills/system-skilled-bots/runtime/tests/isolation.vitest.ts:533` passed: the resume ran in the parked tree, found the edit and ended `completed`, and its record keeps the tree as `dirty`. `.skilled/skills/system-skilled-bots/runtime/tests/isolation.vitest.ts:554` passed: with the tree removed the resume is refused `parked-worktree-missing`, the stub never ran and no tree was made. `.skilled/skills/system-skilled-bots/runtime/tests/isolation.vitest.ts:576` passed: a Vibe resume's prompt holds the checkout line for the tree its own record names, and a second question keeps that same tree. `.skilled/skills/system-skilled-bots/runtime/tests/isolation.vitest.ts:598` passed: a parked prompt naming another folder is refused `resume-item-invalid` before the record takes the tree, which stays kept. `.skilled/skills/system-skilled-bots/runtime/tests/isolation.vitest.ts:622` passed: a bot that parked in the checkout and now declares a worktree is refused `resume-posture-changed` with no tree made (ADR-008) | Met | - |

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
<!-- FILL: Write Yes or No and one sentence. Name a criterion by its id only when it blocks closure. Never write a count of criteria or an id range, because every added row makes it wrong. GOOD: No. AC-002 is unmet. WEAK: All eight criteria AC-001 to AC-008 are met. -->

**Closeable:** Yes

Every row is Met. AC-012 was closed by one operator-approved live desktop notice on 2026-11-23, and the parked-resume row by the fix ADR-008 records.
<!-- /ANCHOR:closure -->
