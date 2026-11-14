---
title: "Implementation Summary"
description: "The Claude adapter README, the feature catalog and the Claude playbook now say what the relaunch code does, the core JSDoc names the generated title, seven closed rows carry saved suite evidence and one reversed criterion is superseded by a decision record."
trigger_phrases:
  - "epic review doc fixes implementation summary"
  - "relaunch guard and generated title docs"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/023-epic-review-doc-fixes"
    last_updated_at: "2026-11-14T18:55:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Closed the phase against the tree at 2638731a9d, with the orchestrator's commit left to run"
    next_safe_action: "The orchestrator commits, then runs the commit-scope check named in AC-007"
    blockers: []
    key_files: [".skilled/hooks/session-relaunch/claude/README.md", ".skilled/skills/system-spec-kit/feature-catalog/context-preservation/session-relaunch-loop.md", ".skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-claude.md", ".skilled/hooks/session-relaunch/lib/relaunch-core.cjs"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-023-epic-review-doc-fixes"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Does the app title follow --name for a generated title? The operator-run scenario records the command line and the app title separately, and no run is claimed."
    answered_questions:
      - "Is 002 AC-003 rewritten? No. It is superseded through ADR-001 and keeps its text."
      - "Was the live hop run? No. HS-9 is operator-run and the packet records no result."
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
| **Spec Folder** | 023-epic-review-doc-fixes |
| **Completed** | 2026-11-14 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The documents that describe a relaunch now say what the code does. A reader of the Claude adapter README learns that a failed killer spawn leaves the record armed rather than pending. A reader of the catalog and the Claude playbook finds the question dialog guard and the generated title carry, and the playbook holds one operator-run scenario that walks a real hop through the guard, the packet goal fallback and the title carry.

### Phase 23: epic-review-doc-fixes

Four document findings from the whole-epic review of 2026-11-14 are closed. F3 was a false sentence on a failed killer spawn. F5 was the missing guard and title text in two skill documents. F6 was a stale JSDoc return shape and two stale summary lines in a closed child. F7 was seven acceptance rows marked `Met` on evidence nobody saved.

The spawn-failure row now says the error is logged with stage `spawn` and the record stays armed, which is what `stop-arm.mjs:246` does when it awaits `spawnKiller` and returns `armed` at `:253`. The catalog's Nudge Prepare And Arm section names the `PreToolUse` guard that denies `AskUserQuestion` while a pending record or an armed record with no live killer can still be armed, and its Killer And Wrapper section names the generated title that `prepare` records when there is no renamed title and no launch name.

HS-9 is written for the operator and marked operator-run in its heading and its first line. It walks the denial, the armed record and its lock, the `/goal <slice>` start of the receiver and the `--name "<title> (2)"` carry across one real hop, and it names the evidence to keep and the PASS and FAIL signals. No live hop is claimed.

The core JSDoc now names `generatedName` in the return shape. The child 001 summary carries a dated note on each of its two stale lines: the throwing-read test that phase 020 added, and the parked record that phase 005 made the next prompt withdraw.

Seven acceptance rows gained a dated note that names a saved suite run and its count. Child 002 gained ADR-001, which supersedes AC-003 because the phase that owns the goal reader now reads an over-cap log whole and reaches the fallback that AC-003 expected to be refused.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/hooks/session-relaunch/claude/README.md` | Modified | The `stop-arm.mjs` row says a spawn failure leaves the record armed and the next Stop re-arms it |
| `.skilled/skills/system-spec-kit/feature-catalog/context-preservation/session-relaunch-loop.md` | Modified | One sentence on the question dialog guard at `:51` and one on the generated title carry at `:63` |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-claude.md` | Modified | HS-9, an operator-run hop scenario, at `:944` |
| `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs` | Modified | The `@returns` shape at `:866` names `generatedName`, comment only |
| `.../001-sender-dialog-after-prepare/implementation-summary.md` | Modified | Dated notes on the throwing-read test and the parked record at `:129` and `:131` |
| `.../001-sender-dialog-after-prepare/acceptance-criteria.md` | Modified | AC-005 names the saved run and the test phase 020 added |
| `.../002-packet-goal-fallback/acceptance-criteria.md` | Modified | AC-003 is `Superseded` by ADR-001, AC-007 names the saved run, the closure accepts one superseded row |
| `.../002-packet-goal-fallback/decision-record.md` | Created | ADR-001 records what AC-003 said and why the over-cap read replaced it |
| `.../003-generated-title-carry/acceptance-criteria.md` | Modified | AC-006 names the three saved runs and their counts |
| `.../005-parked-record-escape/acceptance-criteria.md` | Modified | AC-007 names the saved run and its count |
| `.../007-killer-test-margin/acceptance-criteria.md` | Modified | AC-004 names the saved run and its count |
| `.../011-goal-fallback-bound/acceptance-criteria.md` | Modified | AC-004 names the saved run and its count and keeps the earlier count |
| `.../001`, `.../002`, `.../003`, `.../005`, `.../007`, `.../011` and this child | Modified | `repair-derived.cjs --apply` re-derived each `graph-metadata.json` after its Markdown changed |
| `.../023-epic-review-doc-fixes/spec.md`, `tasks.md`, `acceptance-criteria.md`, `goal.md` and this summary | Modified | The build record and its evidence |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Documents and one comment, so the proof is document checks plus the suites the seven rows asked for. The validator baseline ran before the first edit: the four sk-doc checks and the mirror check each exited 0 (`scratch/baseline.txt`). The same five commands ran after the edits and each exited 0 with the baseline warnings unchanged (`scratch/verification.txt`), and the mirror printed `PASS: 256 mirrors across 10 trees are in sync.`.

The three suites ran once on the final tree, each with `env -u AI_SESSION_CHILD -u OPENCODE_DB` in front. The relaunch and OpenCode plugin suite exited 0 with 1555 of 1555 (`scratch/final-suite.txt`), the goal suites exited 0 with 200 of 200 (`scratch/goal-suite.txt`), and the Pi vitest run exited 0 with 62 of 62 (`scratch/pi-suite.txt`).

`scratch/checks.txt` holds the four AC searches. `scratch/citations.txt` resolves every cited `file:line` to the text it describes with `mismatches: 0`, and its resolution pass caught three engine lines the JSDoc edit had moved by one. Editing Markdown in six closed children changed their source fingerprints, so `repair-derived.cjs --apply` ran for each and printed `inspected=1 repaired=1 failed=0`. `validate.sh --strict` then printed `RESULT: PASSED` for all seven folders (`scratch/validate-folders.txt`), and the recursive run printed `RESULT: PASSED` for 24 folders with none failed (`scratch/validate-recursive.txt`).

### The operator-run scenario

HS-9 is a script for a person, not a test. It starts a wrapper in a throwaway checkout with `SESSION_RELAUNCH_THRESHOLD=0.05`, prepares a note, calls `AskUserQuestion` in the same turn, and checks the denial, the armed record and its killer lock, the receiver's `/goal <slice>` start and the `--name "<generated title> (2)"` carry. The packet records it as operator-run and claims no result.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Correct the spawn sentence to "armed" rather than "pending" | `armPendingRecord` returns the armed record whatever the spawn outcome, and the async-error test asserts `status: armed` with one logged `stop-arm-error` |
| Put the guard sentence in Nudge Prepare And Arm and the title sentence in Killer And Wrapper | The guard belongs where arming is described, and the name the wrapper passes belongs where launch arguments are described |
| Cite the file, not a line, for the guard in the catalog | `subagent-guard.mjs` moved several times during this round, and the catalog names behavior rather than a line a later edit can drift |
| Keep the JSDoc edit to the `@returns` block | The function already returned `generatedName`, so only the comment was wrong |
| Append dated notes instead of rewriting the old lines | A closed child's line was true when written, and the note says what changed and which phase changed it |
| Supersede 002 AC-003 instead of rewriting it | The row states the opposite of the shipped rule, and a rewrite would hide that a closed phase changed its claim |
| Mark HS-9 operator-run and claim no result | The check needs a real question dialog and a real generated title, and this worker cannot run either |
| Leave every version field alone | The phase is a document catch-up, and no version bump was in scope |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `rg -c 'A spawn failure leaves the record pending for the next Stop'` on the Claude README | PASS: no output, exit 1, and the row at `:27` says the record is armed (`scratch/checks.txt`) |
| `rg -c 'AskUserQuestion'` and `rg -c 'generatedName'` on the catalog | PASS: each prints 1, at `:51` and `:63` (`scratch/checks.txt`) |
| `rg -c 'operator-run'` and `rg -c 'AskUserQuestion'` on the Claude playbook | PASS: each prints 1, at `:944` and `:946` (`scratch/checks.txt`) |
| `rg -c '@returns \{\{model: string, effort: string, name: string\}\}'` on the core | PASS: no output, exit 1, and `node --check` exits 0 (`scratch/checks.txt`) |
| `rg -c '2026-11'` on the child 001 summary | PASS: prints 8, and the two notes name phase 020 and phase 005 (`scratch/checks.txt`) |
| `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs` | PASS: tests 1555, pass 1555, fail 0, exit 0 (`scratch/final-suite.txt`) |
| `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test .skilled/hooks/goal/**/*.test.cjs .skilled/hooks/goal/**/*.test.mjs` | PASS: tests 200, pass 200, fail 0, exit 0 (`scratch/goal-suite.txt`) |
| `env -u AI_SESSION_CHILD -u OPENCODE_DB npx vitest run --config .skilled/hooks/vitest.config.ts .skilled/hooks/session-relaunch/pi/session-relaunch.test.ts` | PASS: 1 file and 62 tests passed, exit 0 (`scratch/pi-suite.txt`) |
| The four sk-doc checks | PASS: each exit 0, with the baseline warnings unchanged (`scratch/verification.txt`, `scratch/baseline.txt`) |
| `sync-runtime-mirrors.cjs --check` | PASS: `PASS: 256 mirrors across 10 trees are in sync.`, exit 0 (`scratch/verification.txt`) |
| `repair-derived.cjs --apply` on seven folders | PASS: each prints `inspected=1 repaired=1 failed=0` |
| `validate.sh <folder> --strict` on seven folders | PASS: each prints `Errors: 0  Warnings: 0` and `RESULT: PASSED` (`scratch/validate-folders.txt`) |
| `validate.sh <packet> --recursive --strict` | PASS: 24 folders print `RESULT: PASSED`, none prints `RESULT: FAILED`, exit 0 (`scratch/validate-recursive.txt`) |
| `scratch/citations.txt` resolution | PASS: `mismatches: 0`, and the pass corrected three moved engine lines |
| `git status --porcelain -uall` over the edited trees | PASS for the tree: only the allowed documents, the one JSDoc comment, the derived metadata and the `scratch/` files, with no test and no adapter file. The named `git show --name-status FIX` runs after the orchestrator commits |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The live hop is not run.** HS-9 needs a real Claude Code question dialog and a real generated title, so it is operator-run and this packet claims no result. The operator runs it and keeps the evidence the scenario lists.
2. **The commit-scope check waits on the orchestrator.** The orchestrator owns the commit, so `git show --name-status FIX` cannot run here. `git status --porcelain -uall` proves the same set of files on the working tree, and the named check remains the last step after the commit.
3. **The catalog cites a file for the guard, not a line.** `claude/subagent-guard.mjs` moved during this round, and a line citation would drift. The playbook and `scratch/citations.txt` carry the resolved lines.
4. **The JSDoc edit moved four engine lines.** Adding one line at `:866` shifted the `armableRecord` states and the `none` object by one, and `scratch/citations.txt` records the corrected numbers so a reader does not trust the plan's old ones.
5. **The generated title depends on the runtime.** It is read from the `ai-title` entry the Claude transcript holds, so a session whose runtime never writes one carries no generated title and the wrapper renames nothing.
<!-- /ANCHOR:limitations -->

---
