---
title: "Implementation Summary"
description: "Open with a hook: what changed and why it matters. One paragraph, impact first."
trigger_phrases:
  - "computer exposure implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/003-openbot-parity-build/004-computer-exposure"
    last_updated_at: "2026-11-25T07:13:40Z"
    last_updated_by: "template-author"
    recent_action: "Initialized Level 2 template"
    next_safe_action: "Replace continuity placeholders"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-004-computer-exposure"
      parent_session_id: null
    completion_pct: 0
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
| **Spec Folder** | 004-computer-exposure |
| **Completed** | 2026-11-27 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Every dispatched prompt now names where the bot works: `Your working place is <path> on branch <branch>. This run's folder is <runFolder>.`, third in the prompt and before the checkout line. The run record keeps that branch for every dispatched run, shared runs included, and `bots status` ends each row with `branch <name>` and `worktree <path>` when the last run recorded them.

### Phase 4: computer-exposure

You can now tell where an unattended run worked without opening its folder. A worktree run names its tree and the branch the tree was made on, with no extra git call. A shared run reads the checkout's branch once. A detached HEAD or a git that does not answer records null and never stops the run, so the line simply drops its branch clause and the row drops its `branch` part. `bots status --json` carries the same two facts as `lastRun.branch` and `lastRun.worktreePath`, and an index built before this change still opens without `--rebuild`, because the reader turns a missing key into null.

A resumed run is dispatched with its parked prompt, so the runner checks that prompt before dispatch. A prompt parked before the line existed gains it after its spec-folder line. A parked line naming the same directory is replaced with the current one, so it names this run's folder and the branch the checkout is on now. A line naming another directory refuses the run `resume-item-invalid` with the detail `the parked prompt names another working place`, and a resumed tree goes back to waiting for its answer.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts` | Modified | `WORKING_PLACE_PREFIX`, the branch clause and folder marker constants, `WorkingPlace`, `workingPlaceLine` and the `workingPlace` input of `buildBotPrompt` in its slot |
| `.skilled/skills/system-skilled-bots/runtime/lib/isolation.ts` | Modified | `checkoutBranch`, the one git read of a checkout's branch, null on every failure |
| `.skilled/skills/system-skilled-bots/runtime/lib/runner.ts` | Modified | One branch value after `workDir` feeding `evidence.branch` and the prompt, and `placeWorkingLine` for a parked prompt |
| `.skilled/skills/system-skilled-bots/runtime/lib/status-index.ts` | Modified | `RunSummary.worktreePath` and `RunSummary.branch`, filled by `summarizeRecord` |
| `.skilled/skills/system-skilled-bots/runtime/lib/status.ts` | Modified | `LastRun.branch` and `LastRun.worktreePath`, the coalescing read and the two appended row parts |
| `.skilled/skills/system-skilled-bots/runtime/tests/dispatch.vitest.ts` | Modified | Both shapes, the absent case and the slot, with the three prompt goldens compared line by line |
| `.skilled/skills/system-skilled-bots/runtime/tests/isolation.vitest.ts` | Modified | A worktree run's line and cwd, and the isolation-step refusal that keeps its tree |
| `.skilled/skills/system-skilled-bots/runtime/tests/runner.vitest.ts` | Modified | Shared, detached and unreadable branches, a refusal's two nulls and the three parked-prompt outcomes |
| `.skilled/skills/system-skilled-bots/runtime/tests/status-index.vitest.ts` | Modified | The summary fields against the evidence and summary goldens |
| `.skilled/skills/system-skilled-bots/runtime/tests/status.vitest.ts` | Modified | The seven golden rows, the `lastRun` key set and an index built before the change |
| `.skilled/skills/system-skilled-bots/runtime/lib/README.md` | Modified | The `dispatch.ts`, `isolation.ts` and `status.ts` rows |
| `.skilled/skills/system-skilled-bots/bots-status/references/status-and-inbox.md` | Modified | What a row shows, naming `branch <name>` and `worktree <path>` |
| `design/sequences.md` | Modified | Section 3 now replaces a same-path parked line instead of leaving it unchanged |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Cheap workers wrote every change in three internal waves, 16 runs in all, one change per brief, on `cli-mistral-vibe` with `deepseek-flash`. Wave 1 ran three slots at once (`dispatch.ts`, `isolation.ts`, then `status-index.ts` before `status.ts`). Wave 2 ran six (the `runner.ts` pair, three test files and both docs) once the modules they read had passed. Wave 3 ran the runner and isolation tests, which drive the runner end to end. Every run exited 0 with outcome finished, so no run fell back to `cli-pi` and no retry was spent. After each brief the orchestrator ran that brief's checks itself before the next brief in the slot started, and read every diff. The closing gate ran the whole runtime suite, the type-check, every anchored acceptance filter, both scratch `bots status` reads and the fixture parse.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| `RunSummary.worktreePath` and `RunSummary.branch` are optional | `tests/activity.vitest.ts`, which this phase does not own, builds a `RunSummary` literal without them, and a summary stored before this phase has neither key. `summarizeRecord` always writes both, and `LastRun` keeps them required |
| The prefix, the branch clause and the folder marker are exported constants | The resumed-prompt check matches the parked line by exact text, so the runtime holds one copy of each piece of the line |
| A same-path parked line matches on the path alone | REQ-007 corrects a shared checkout whose branch moved, so the check accepts the prefix plus the current path, alone or followed by the branch clause, and refuses any other path |
| One parked-prompt check after the branch is resolved, for both resume kinds | A worktree resume and a shared resume take one code path. The refusal sets a resumed tree back to `kept` for its answer, as the read-only refusal already does |
| The unreadable-branch test puts a `git` wrapper first on the run's PATH | It fails only `--abbrev-ref`, so the result ledger's own git reads still work and the run can prove it still dispatches |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npm test` in the runtime | PASS: `Test Files  39 passed (39)` and `Tests  472 passed (472)`, exit 0, no `failed` line. Baseline 39 and 456. The 16 new tests are the 16 named in this folder |
| `npm run typecheck` | PASS: exit 0 |
| AC-001 to AC-008 anchored filters | PASS: each of the 16 printed `Tests  1 passed` |
| Scratch `bots status` and `bots status --json` on a fresh `mktemp -d` checkout | PASS: both exited 0, the text read `no bots and no open needs-you items` |
| `rg -n "SCHEMA_VERSION = '2'"` | PASS: `55:const SCHEMA_VERSION = '2';` |
| `rg -n 'Your working place is '` over `lib/` | PASS: one line, the constant in `dispatch.ts` |
| The twelve goldens | PASS: every `.json` parsed, no trailing whitespace, each read by the test file its README names |
| `validate.sh --strict` on this folder | PASS: `RESULT: PASSED` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Four grep counts read one line off their wording.** T015's `rg -n 'worktreePath|branch:'` prints three lines, because the optional member is written `branch?:`. T014 counts `workingPlaceLine` in `runner.ts` as one line and CHK-013 as three, but the import puts the name on its own line, so they print two and four. T016's two `worktreePath` lines became three once T017 appended the row part. Each was checked right after its own task.
2. **The design text still compares the whole place half.** `design/prompt-line.md` section 4 and `spec.md` REQ-007 both say the text before `. This run's folder is ` must be equal, which would refuse a shared checkout whose branch moved, while the same paragraphs say that case is corrected. The runner follows the stated outcome and compares the path, and the goal's deviation log records the reading.
3. **No live bot run was read back by hand.** The plan's manual row asks for one real run of each isolation answer read through `bots status`. The runner, isolation and status suites drive `runBot` end to end through the stub executor and read the real record and index, which covers the same path without a model call.
<!-- /ANCHOR:limitations -->
