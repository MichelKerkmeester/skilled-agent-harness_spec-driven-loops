---
title: "Implementation Summary"
description: "Codex and Pi sweeps now report a session file they cannot read, every save lists answers left pending by sessions that never saved, Pi shows the pending-answer reminder, and two duplicated code paths now live once in their owners."
trigger_phrases:
  - "gap closure implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/spec-authoring-and-continuity/004-decision-capture/007-gap-closure"
    last_updated_at: "2026-11-02T18:13:25Z"
    last_updated_by: "generate-context"
    recent_action: "Landed the six gap fixes and verified every suite"
    next_safe_action: "Run the deep review with a fix pass, then the alignment check"
    blockers: []
    key_files:
      - ".skilled/hooks/decision-capture/bin/sweep-codex.mjs"
      - ".skilled/hooks/decision-capture/bin/sweep-pi.mjs"
      - ".skilled/hooks/decision-capture/pi/decision-capture.ts"
      - ".opencode/plugins/decision-capture.js"
      - ".skilled/skills/system-spec-kit/runtime/lib/continuity/decision-record-writer.ts"
    session_dedup:
      fingerprint: "sha256:48522b4fe31539b600fb6788f43feeba65cf5408792cbad2a2d90a43bf0cc742"
      session_id: "2cdc1c20-d541-4a71-ba53-999a34105259"
      parent_session_id: null
    completion_pct: 100
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
| **Spec Folder** | 007-gap-closure |
| **Completed** | 2026-11-02 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A save can now tell a failed read from an empty session on every runtime, and it tells you about answers that other sessions left behind. In this repository that listing found 82 answers across four sessions that no save had offered before.

### Phase 7: gap-closure

The Codex and Pi sweeps used to exit 0 with no output when the session file they were pointed at could not be read, which looked the same as "nothing pending". They now print an `error` and exit 1, like the Claude, OpenCode and Devin sweeps. Every save runs the matcher's `--scan-orphans` and names each other session that still holds pending answers. Pi shows the pending count once per new answer at the end of a turn. The OpenCode plugin and the matcher CLI each kept a private copy of logic another module owns; both copies are gone. The second live pass found one more gap: a Pi with pi-plan-build installed also offers a `question` tool, and an answer given there was never queued. Both Pi readers now accept it.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/hooks/decision-capture/bin/sweep-codex.mjs` and its test | Modified | A read error reaches `main()`, which prints `error` and exits 1 |
| `.skilled/hooks/decision-capture/bin/sweep-pi.mjs` and its test | Modified | The same for Pi |
| `.skilled/hooks/decision-capture/pi/decision-capture.ts` and its test | Modified | `turn_end` shows the `takeNudge` count through `ctx.ui.notify` |
| `.skilled/hooks/decision-capture/bin/sweep-opencode.mjs` | Modified | `node:sqlite` loads only when a database opens, so Bun can import the file |
| `.opencode/plugins/decision-capture.js` | Modified | Builds records with `openCodeAnswerRecords`; `answerMap` deleted |
| `.skilled/skills/system-spec-kit/runtime/lib/continuity/decision-record-writer.ts` | Modified | Exports `consumedLogPath` and `readConsumedRows`, the one consumed-log reader |
| `.skilled/skills/system-spec-kit/runtime/api/index.ts` | Modified | Re-exports the reader |
| `.skilled/skills/system-spec-kit/runtime/cli/continuity/match-decision-table.ts` | Modified | Uses the writer's reader; its own filename constant and reader deleted |
| `.skilled/commands/speckit/save.md` | Modified | Orphan listing on every save; the process-question list replaced by one sentence |
| `.skilled/hooks/coverage-rationale.md`, `.skilled/hooks/README.md` | Modified | Decision-capture section; the Codex cell's reason |
| `.skilled/skills/system-spec-kit/feature-catalog/ux-hooks/operator-decision-capture.md` | Modified | Read errors, orphan listing, Pi reminder |
| `../003-codex-and-pi-capture/spec.md` | Modified | NFR-R02 amended |
| `.skilled/hooks/decision-capture/bin/sweep-pi.mjs`, `pi/decision-capture.ts` and their tests | Modified | Both read pi-plan-build's `question` tool as well as `ask_user_question` |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/decision-capture-live-conversation.md` | Modified | Pi checks expect the nudge this phase added |
| `.skilled/hooks/decision-capture/bin/sweep-transcript.mjs`, `sweep-pi.mjs` and their tests | Modified | Deep review: a sweep with no `--transcript` takes only a session whose recorded `cwd` is this project |
| `.skilled/hooks/decision-capture/lib/chat-questions.mjs` | Modified | Deep review: a closing paragraph's question mark inside code or a quote no longer makes a candidate |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/decision-capture-transcript-sweeps.md` | Modified | Deep review: OpenCode and Devin do have live hooks |
| `.skilled/hooks/decision-capture/bin/sweep-devin.mjs` | Modified | Alignment: `node:sqlite` loads only when the database opens, so the live Devin adapter stays silent on Node 22 and 24; the session query accepts the symlinked spelling of the project |
| `.skilled/hooks/decision-capture/bin/sweep-codex.mjs` and its test | Modified | Alignment: the rollout header is read in 64 KB chunks, and its `cwd` is compared by real path |
| `.skilled/hooks/decision-capture/lib/chat-questions.mjs` and its test | Modified | Alignment: candidates past the per-message cap count toward `dropped` |
| `.devin/hooks/ask-capture-posttooluse.mjs` | Created | Alignment: the Devin discovery mirror symlink, made by the runtime mirror sync |
| `.devin/hooks/README.md`, `.pi/extensions/README.md`, `.skilled/hooks/README.md`, `.env.example` | Modified | Alignment: inventories name the decision-capture adapters; `CLAUDE_PROJECT_DIR` is listed |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Each code change went to one worker with a one-change brief: the two sweeps and the Pi reminder to `gpt-6-luna` at xhigh on the fast tier through cli-codex, and, after Luna hit its usage limit during the Pi brief, the OpenCode and consumed-log changes to `deepseek-v4.1-flash-1017` at thinking max through cli-pi, the parent goal's named fallback. The Pi worker had finished its edits before the limit hit; its code and tests were read and rerun. After each return the orchestrator listed every file changed since the brief, read the changed code and reran its suite. The docs were edited by the orchestrator. The three Luna briefs carried no inlined agent persona, which the cli-codex contract requires; the cli-pi briefs did. Every change was checked the same way, so the miss changed no result. The Pi `question` fix came after the live pass, a small change in two files, and the orchestrator wrote it directly rather than through a worker.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| No Codex live hook (ADR-001) | The rollout sweep already finds every answer; a hook would add a mapping for a reminder only |
| No auto-accept for a lone chat candidate (ADR-002) | A probe returned one candidate for an off-topic reply, so the saving model's judgment is load-bearing |
| Lazy SQLite load instead of a new module (ADR-003) | Removes the OpenCode mapping copy without adding a file; a Bun import proves the plugin still loads |
| No Devin reminder | Devin discards Stop-hook output, as 004 recorded, so no reminder can reach a Devin operator |
| Level 2, not the scorer's Level 1 | Every sibling is Level 2, and two CLI exit codes change, which the acceptance criteria close |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Hooks `node --test` over `lib`, `bin`, `claude`, `devin` | PASS: 102 tests, 102 pass, 0 fail (baseline 101) |
| Goal criterion 6, `lib` and `bin` only | PASS: 94 tests, 0 fail |
| Pi vitest | PASS: 10 of 10 (baseline 8) |
| Pi `question` tool | PASS: the failing live session file, swept into a throwaway project, recovers `Amber`; the new sweep test fails with `question` removed from the tool set |
| Deep review, `../review/review-report.md` | CONDITIONAL, 0 P0, 2 P1, 3 P2; four fixed, one declined as a false positive for the symlinked install layout; hooks `node --test` 105 of 105 after the fixes |
| Alignment check on `.skilled/hooks/decision-capture` (31 files) | 21 findings after the critic; this series' were fixed, the rest are outside it or declined in the run report. Hook suites on Node 22, the CI version, 107 of 107 (5 Devin adapter tests failed before); recheck: mirror and env-token rows pass, the two still failing are the root README and another session's playbook package |
| Second live pass, all five runtimes | PASS: every main and kill-switch run plus the Claude sibling run; Pi passed on attempt 3 and Codex on attempt 2, with each failure recorded in `../006-live-conversation-test/implementation-summary.md` |
| OpenCode plugin test, plus inventory, source-root and v2 suites | PASS: 6 of 6, and 81 of 81 |
| Runtime CLI suites (matcher, CLI, save, writer, hook registration) | PASS: 72 of 72 |
| `hook-session-stop.vitest.ts` | PASS: 19 of 19 |
| Runtime typecheck, CLI `tsc`, eslint, build | PASS: each exit 0 |
| `sweep-codex.mjs` and `sweep-pi.mjs --transcript missing.jsonl` | PASS: `{"error":"ENOENT..."}`, exit 1 each; `--transcript /dev/null` prints nothing, exit 0 |
| Bun import of `sweep-opencode.mjs` and the plugin | PASS: both print `loaded` (before: `No such built-in module: node:sqlite`) |
| `--scan-orphans` on this repository | PASS: five lines, `12`, `1`, `7`, `53` and `10` pending answers |
| sk-code quality gate over the 11 changed code files | PASS: `NO_BLOCKER_FOUND`, no findings |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Orphaned answers are named, not recorded.** The save lists other sessions and their counts and writes nothing for them; a save that runs that session's sweep records them.
2. **Devin gets no reminder.** Its Stop-hook output is discarded, so a Devin operator learns of pending answers at the next save.
3. **Pi's reminder needs an interactive session.** A headless run skips it and leaves the count for the next interactive turn.
4. **The Pi `question` path has not run live.** The passing Pi run asked through `ask_user_question`; the `question` fix is proven on the recorded session file and in tests.
5. **The first consumer inventory missed the playbook.** Adding the Pi nudge broke the live scenario's Pi checks, which only the second live pass caught.
6. **Follow-ups outside this series.** `system-spec-kit` has no routing words for operator decisions, so "record my chat reply as a decision" routes nowhere; its advisor metadata is another artifact (parent goal D1). The `.env.example` `CODEX_HOME` line, owned by another session's uncommitted work, does not yet say the Codex sweep reads it.
<!-- /ANCHOR:limitations -->

---
