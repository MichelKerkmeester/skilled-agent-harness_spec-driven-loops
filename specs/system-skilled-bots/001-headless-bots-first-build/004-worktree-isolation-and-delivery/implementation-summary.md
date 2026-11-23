---
title: "Implementation Summary"
description: "Phase 4 built: a bot that declares isolation: worktree runs in a numbered sk-git worktree under the configured base, outside the checkout, and the tree is removed only when clean and unchanged. Every run now writes at-most-once delivery records, with a local-only value and a desktop notice that can claim only attempted. 35 phase tests pass, the live desktop notice was sent once with operator approval, and a parked worktree run's resume continues in its own tree."
trigger_phrases:
  - "worktree isolation and delivery implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/001-headless-bots-first-build/004-worktree-isolation-and-delivery"
    last_updated_at: "2026-11-23T07:42:57Z"
    last_updated_by: "generate-context"
    recent_action: "Fixed the 004 review findings and the unconfined-refusal tree leak"
    next_safe_action: "Review the second phase 004 report, then commit"
    packet_purpose: "Purpose: A bot that declares `isolation: worktree` runs in its own numbered worktree outside the checkout, and every run tells each declared target what happened, at most once, with a record of each send."
    blockers: []
    key_files:
      - ".skilled/skills/system-skilled-bots/runtime/lib/isolation.ts"
      - ".skilled/skills/system-skilled-bots/runtime/lib/delivery.ts"
      - ".skilled/skills/system-skilled-bots/runtime/lib/runner.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "implement-004-worktree-isolation-and-delivery"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "e69eaf8b-97d2-4d96-ad3f-66a87da7bbe5"
      workspace: "/Users/michelkerkmeester/worktrees/public/system-skilled-bots"
      savedAt: "2026-11-23T07:42:57Z"
      locatorKind: "transcript_path"
      version: 1
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-worktree-isolation-and-delivery |
| **Completed** | Built 2026-11-23. AC-012 closed by the approved live desktop notice the same day. The review's resume finding and four suggestions fixed the same day |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A bot that declares `isolation: worktree` now runs in its own numbered worktree. The tree comes from sk-git's `worktree-naming.sh create`, sits under the configured worktree base outside your checkout, and is removed at the end of the run only when it is clean, still at its base commit and has no stash. Every run now tells its declared targets what happened, at most once, and records each send.

### Phase 4: worktree-isolation-and-delivery

The runner no longer refuses `isolation: worktree`. It makes the tree after its last refusal and just before dispatch, so a refused run never leaves a tree. The child runs with the tree as its working folder. Each shared path is linked from the main checkout and recorded. Before removal, every recorded link is unlinked as a link, so a removal can never walk into the main checkout's dependencies. A dirty, unmerged, stashed, half-provisioned or killed run keeps its tree, and the record names the reason.

Delivery starts only after the terminal record is written. A send is claimed with an exclusive claim file and recorded as `claimed` before the sender runs. An uncertain send is stored as `unknown` and never retried. The desktop notice goes through `osascript` with the title and body as arguments, and it can record `attempted` but never `delivered`. A run that parks a question sends one notice per target, keyed by the needs-you item id. A message that would carry a known secret literal is withheld.

A run that parks a question keeps its tree with the reason `awaiting-decision`. The record carries the tree's path, branch, links and folders, and the resume reads them from the parked run's record and dispatches into that same tree, so it continues the parked edits. A resume whose kept tree is gone, or is no longer a worktree on its branch, is refused as `parked-worktree-missing`, and a posture that changed between park and answer is refused as `resume-posture-changed`; neither ever falls back to a fresh tree (ADR-008).

The checker gains three hard invariants: `worktree-shared-paths-unresolved`, `definition.isolation-invalid` and `delivery-channel-unknown`, each with a negative fixture.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-skilled-bots/runtime/lib/isolation.ts` | Created | Resolve the base and the shared paths, create the tree through sk-git's script, link, inspect, unlink and remove |
| `.skilled/skills/system-skilled-bots/runtime/lib/delivery.ts` | Created | Resolve targets, claim and send once, write the delivery states, the desktop channel |
| `.skilled/skills/system-skilled-bots/runtime/lib/runner.ts` | Modified | Make the tree before dispatch, finish it before the terminal record, deliver after it, keep a killed run's tree, keep a parked run's tree and resume in it |
| `.skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts` | Modified (owned by phase 3) | `checkoutLine` builds the prompt line a child outside the checkout reads, so a resume can check its parked prompt names the tree it works in |
| `.skilled/skills/system-skilled-bots/runtime/lib/posture.ts` | Modified | Honor `worktree`; the refusal lived here, not in the runner (ADR-007) |
| `.skilled/skills/system-skilled-bots/runtime/lib/run-record.ts` | Modified | Optional `evidence.worktree` and `delivery[].itemId`, validated |
| `.skilled/skills/system-skilled-bots/runtime/lib/repo-config.ts` | Modified | Optional `worktreeSharedPaths` key |
| `.skilled/skills/system-skilled-bots/runtime/lib/state-root.ts` | Modified | `deliveryClaimFolder`, and the generation stamp writer moved here from `runner.ts` (re-exported there) so delivery can advance it without importing the runner |
| `.skilled/skills/system-skilled-bots/scripts/bot-check.cjs` | Modified | The worktree, isolation-value and delivery-channel invariants |
| `.skilled/skills/system-skilled-bots/scripts/fixtures/{worktree-shared-paths-unresolved,isolation-invalid,delivery-channel-unknown}/` | Created | One negative fixture per new invariant |
| `.skilled/skills/system-skilled-bots/runtime/tests/isolation.vitest.ts`, `delivery.vitest.ts` | Created | 23 and 12 cases |
| `.skilled/skills/system-skilled-bots/runtime/tests/fixtures/` | Created / modified | `worktree-slow` bot, naming and `osascript` stubs, a child-run driver; the `worktree-posture` body; the codex stub's `STUB:park-edit` directive, which edits and asks, then on resume requires the edit |
| `runtime/tests/{posture,runner,bot-check,run-record,repo-config,state-root}.vitest.ts` | Modified | Two assertions of the old refusal retargeted; one new case each for the contract additions and the checker |
| `scratch/live-desktop-notice.sh` | Created | The live notice check, not run |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Baseline first: the suite printed `Tests 194 passed (194)` and the typecheck exited 0. The two modules came next, then the runner wiring and the checker, then the tests. A dry run of the reaper's numbered lane against bot trees showed that a default base under the state root left trees the reaper reports as "not a numbered branch and folder pair". The base resolution was changed to refuse an unconfigured base (ADR-007 item 4), and the tests were rerun. Two mutation checks confirmed that the removal tests fail when the dirty check or the unlink step is removed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Delivery states `queued` and `claimed` (ADR-006) | spec.md, research.md §10 and the run record contract all use them. Hermes' `pending` and `delivering` map one to one. No tie-break was needed |
| Refuse an unconfigured worktree base | The reaper's numbered lane judges only a tree under the configured base. Any other default leaves trees nobody can reclaim |
| Finish the tree before the terminal record | The notice must say whether the tree was kept, and that is known only after the check |
| Setup problems are refusals, not failures | The runner's rule is that every stop before dispatch is a refusal. Class `operator` for a bad base or list, `environment` for a failed create |
| A killed run's tree is always kept | It may hold half-made work. The record says `dirty` when it is, else `killed` |
| A parked run's tree is kept as `awaiting-decision` and its resume works in it (ADR-008) | The resume must continue the parked work. A missing tree refuses the resume rather than starting fresh |
| The resume checks the parked prompt's checkout line rather than rewriting it | The resume works in the parked tree, so the right line is the parked one. A prompt that names another folder is refused as `resume-item-invalid`, never handed to a child |
| Content in ignored paths is not treated as work (ADR-004) | Counting it would keep nearly every tree. A bot that must keep output writes it to a tracked path or its delivery |
| Delivery checks each record rewrite and stamps once per pass | A refused rewrite is noted in the claim file, which stays the authority on what was sent |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Whole bots suite, `npx vitest run --no-coverage` in `runtime/` | `Test Files 28 passed (28)`, `Tests 250 passed (250)`, exit 0. The total includes the request-pipeline build's new files |
| The two phase files | `Tests 27 passed (27)`, no skipped test, no warning |
| `npm run typecheck` | exit 0 |
| T017: `bots run worktree-posture`, stub executor first on PATH, in a temp repository with `speckit.worktreeBase` set | `bots: worktree-posture run 20261123T061656Z-27edf815 completed`, exit 0. Record: `worktreePath` `<temp>/wtbase/001-bot-worktree-posture`, outside `git rev-parse --show-toplevel`; branch `worktrees/001-bot-worktree-posture`; `worktree.disposition` `removed`; `delivery` `[{"channel":"local-only","target":"local","state":"not-attempted","evidence":null}]`. Afterwards `git worktree list` shows only the main checkout and no `worktrees/*` branch remains |
| Reaper dry run (`--numbered --dry-run --idle-hours 0`) over bot trees | Clean: `verdict=would-reap ... reason=idle`. Dirty: `verdict=keep ... reason=uncommitted or untracked files`. Unmerged: `verdict=keep ... reason=branch is not merged into the live branch` |
| `rg -n 'launchctl bootstrap\|\.plist' runtime/lib` | nothing, rc=1 |
| `rg -n -- '--force\|branch -D' runtime/lib/isolation.ts` | nothing, rc=1 |
| `rg -n 'REQ-\|ADR-\|phase [0-9]' runtime/lib scripts/bot-check.cjs` | nothing, rc=1 |
| This checkout's `git worktree list` | unchanged across the isolation tests, asserted in their `afterAll` |
| `worktree-naming.sh`, `worktree-reaper.sh`, `worktree-session.sh` | `git diff` empty |
| Resume negative control, before the fix | The resume ran in a fresh tree and failed: `expected 'failed' to be 'completed'`, the stub exiting 7 because the parked edit was missing (`scratch/resume-negative-control.txt`) |
| Whole bots suite after the review fixes | `Test Files 29 passed (29)`, `Tests 263 passed (263)`, exit 0, three runs in a row (`scratch/review-fix-suite-1.txt` to `-3.txt`). Baseline 253; the delta of 10 is eight cases from this phase (negative control, missing tree, Vibe resume, stale parked prompt, changed posture, stray folder, real linking failure, refused record write) and two from the request-pipeline phase's own fixes |
| Typecheck after the review fixes | exit 0 (`scratch/review-fix-typecheck.txt`) |
| Live desktop notice (AC-012) | Run once with operator approval on 2026-11-23: exit 0, state `attempted`, evidence `osascript exit 0` (`scratch/live-desktop-notice-result.txt`) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A base must be configured.** A worktree bot is refused until the repository sets `git config speckit.worktreeBase <dir outside the checkout>`, or the run's environment sets `SPECKIT_WORKTREE_BASE`. A base from the environment can be reaped only from a shell that sets it too.
2. **No reclaimer.** Kept trees stay until the operator runs `.skilled/bin/worktree-reaper.sh --numbered`. A scheduled reclaimer is later work.
3. **The desktop notice is unconfirmed.** It records `attempted` at best; the record, not the notice, is the source of truth.
4. **Setup time has no limit yet.** It is measured and written to `evidence.worktree.setupMs`; no real-run baseline exists.
5. **Ignored paths are not work.** A clean tree is removed with whatever sits in its gitignored paths (ADR-004).
6. **A parked tree waits.** It stays on disk until its answer is resumed, or for the reaper after the item expires (ADR-008).
<!-- /ANCHOR:limitations -->

---
