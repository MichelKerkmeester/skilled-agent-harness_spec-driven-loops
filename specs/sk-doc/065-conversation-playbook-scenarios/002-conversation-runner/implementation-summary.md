---
title: "Implementation Summary: Phase 2: conversation-runner"
description: "Runner, five adapters and MTP-007 built and proven live on all five runtimes; deep-review and alignment findings fixed; second five-runtime pass run."
trigger_phrases:
  - "conversation runner implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/065-conversation-playbook-scenarios/002-conversation-runner"
    last_updated_at: "2026-11-02T21:53:54Z"
    last_updated_by: "generate-context"
    recent_action: "Runner skips a runtime when setup exits 77; scenarios fixed"
    next_safe_action: "Run second-review fixes, then live passes in a frozen worktree"
    blockers: []
    key_files:
      - ".skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs"
      - "specs/sk-doc/065-conversation-playbook-scenarios/002-conversation-runner/spec.md"
    session_dedup:
      fingerprint: "sha256:c767a37c3d2a5c62211c27f59aa9cc84d02628723c939f1cc8bcf352e0641789"
      session_id: "beb6e7b1-5f31-42db-8cd9-f58f27216e79"
      parent_session_id: "fe0c9990-06d3-454e-a8e7-7c7bc649bc49"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-conversation-runner |
| **Status** | Complete |
| **Completed** | 2026-11-02 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A shared runner plays a scenario's `json conversation` script into a real interactive session of Claude Code, OpenCode, Codex, Pi or Devin. Each session runs in a private tmux server inside a guarded scratch project. The runner answers the subject's questions, runs each turn's check and writes the evidence. MTP-007 drives six turns: a single-select, a multi-select, Other, a chat reply, a restart and a compaction. It passed 6/6 on every runtime.

A scenario may now ask for Codex hook trust with `trust_hooks`. The runner then picks "Trust all" only when Codex's review screen counts no more hooks than the scratch project holds, and afterwards removes every trust entry it added under the scratch project. A run that cannot do either fails with a named blocker.

### Files Changed

Paths are relative to `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/` unless they start with a dot.

| File | Action | Purpose |
|------|--------|---------|
| `scripts/run-conversation-scenario.cjs` | Created | CLI, scratch guard, content-hash snapshot, tmux driver, turn loop, five adapters and a test-only `fake` adapter, evidence, matrix, cleanup, opt-in Codex hook trust |
| `scripts/tests/run-conversation-scenario.test.cjs` | Created | Refusal, fake-run, failure, skip, retry, timeout, `REPO_CHANGED`, snapshot, hook-trust, start-up redraw, literal-text and cleanup groups, plus the five adapter screens |
| `scripts/tests/fixtures/fake-subject.cjs` | Created | Line-mode stand-in for a TUI subject |
| `scripts/tests/fixtures/question-screens/` | Created | One recorded question screen per runtime, plus extra states |
| `scripts/validate-playbook-package.cjs` and its test | Modified | `trust_hooks` key, an empty `match` refused, an unclosed `json conversation` fence reported |
| `manual-testing-playbook/conversation-runner/drive-a-scripted-conversation.md` | Created | MTP-007 |
| `references/conversation-scenarios.md`, `references/README.md`, `README.md`, `SKILL.md`, `ROUTER.md`, the snippet template, the conversation snippet template, `changelog/v1.1.0.0.md` | Modified or created | Runner command, schema rows, environment switches, links |
| `.skilled/skills/sk-doc/` `hub-router.json`, `mode-registry.json`, `ROUTER.md`, `graph-metadata.json`, `leaf-manifest.json` | Modified | The routing terms `playbook conversation`, `multi-turn conversation script` and `playbook scenario`, and the new reference leaf |
| `.skilled/bin/lib/compiled-routing/.../sk-doc/manifest.json` and its archived copy | Regenerated | Fresh compiled manifest for the changed routing inputs |
| `.hermes/skills/sk-create-manual-testing-playbook/` | Regenerated | Hermes mirror of the changed `SKILL.md` and `ROUTER.md` |
| `.codex/config.toml` | Modified | `default_mode_request_user_input = true` (decision record Q005) |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Implementation workers wrote the code: DeepSeek through cli-pi while Luna's quota was spent, then `gpt-6-luna` xhigh fast through cli-codex. The orchestrator wrote no runner code beyond two small fixes, each named below. It ran every tmux suite and live run itself, and reviewed every worker diff before running the suite.

1. **Live passes against a worktree.** Other sessions wrote to the main checkout's `specs/` and `.state` folders, which failed three `matrix2` rows `REPO_CHANGED` (`scratch/runs/matrix2/repo-changed-cause.md`). The live passes then ran main's runner with `--repo-root` pointing at a detached numbered worktree of main (decision record Q011). `scratch/runs/matrix3/` read five rows PASS 6/6.
2. **Codex hook trust.** One live proof run (`scratch/runs/trust-proof/`) passed 6/6 and added and removed 22 project trust tables. Its "Trust all" also re-trusted a changed global hook. The orchestrator restored that hook's hash, and the runner gained the hook-count guard (Q012).
3. **Deep review.** Seven Luna iterations (`review/lineages/luna-xhigh/review-report.md`) ended FAIL with 2 P0, 4 P1 and 2 P2. The orchestrator confirmed each finding by reading the code, and workers fixed all eight:

| Finding | Fix |
|---------|-----|
| 001 P0 symlinked runtime project escapes the scratch | `PROJECT_ESCAPED` refusal on a symlink, a wrong realpath or a path inside the repository, checked again after setup |
| 004 P0 Codex ran with its sandbox bypassed | Codex launches and resumes with `--sandbox workspace-write --ask-for-approval never` (Q013); proven live in `scratch/runs/matrix5/codex` |
| 002 P1 SIGINT during setup leaves the setup child | Setup children are tracked and killed on signal; suite group `setup SIGINT cleans up` |
| 003 P1 setup writes precede the baseline | A snapshot before the first guard and after the last; a difference refuses `SETUP_CHANGED_REPO` |
| 005 P1 unreadable snapshot subtrees read as empty | Read errors become snapshot lines and fail the run `SNAPSHOT_INCOMPLETE` |
| 008 P1 cleanup claimed children gone unverified | Tracked groups are terminated and verified; a survivor fails cleanup |
| 006 P2 removed pre-existing trust not restored | Trust tables that went missing are put back |
| 007 P2 AC-005 lacked its `specs` write case | The `repo changed` group now covers a write to `specs/` |

4. **Alignment check.** `/local-skilled-alignment:auto` (run folder `~/.local/state/local-skilled-alignment/Skilled/20261102T114150Z`) found doc gaps, four runner and validator gaps, missing routing vocabulary, a stale compiled manifest and a stale Hermes mirror. All the in-scope findings were fixed. The orchestrator replayed every new routing term through both routing stages and against out-of-domain sentences. It narrowed two terms that sent a chatbot request and a sales-call request to the playbook mode. The recheck (`20261102T125816Z-recheck`) resolved the compiled-route guard and Hermes rows. The four literal doc fixes it lists as open are appends, so their old line stays by design; each new line is in place.
5. **Second live pass.** `matrix4` failed Claude Code `LAUNCH_TIMEOUT`: its trust dialog redraws and moves the cursor, so the runner now answers a start-up screen only once it has held still. `matrix5` passed four rows 6/6, and Pi failed only because the scenario's checks were case-sensitive. The checks now ignore case. `matrix6` passed four rows 6/6, and Codex hit its weekly usage limit before the first answer. Each runtime passed 6/6 on the final runner code in `matrix5` or `matrix6`. After the operator reset Codex's quota, Codex alone passed 6/6 on the final scenario (`scratch/runs/codex-final/`), and Claude Code alone did the same (`scratch/runs/claude-code-final/`).
6. **Orchestrator fixes.** The fake adapter's `launch` gained `process.execPath`. A refused setup no longer writes `setup.log`, which kept the next run in the same evidence folder from being refused. Fix E had introduced that regression, and the suite caught it.
7. **Code standard and in-mode routing pass, after close.** A review against the sk-code JavaScript standard for SKILLED surfaces found 9 required and 17 advisory gaps across the five scripts: no MODULE header, no numbered section dividers, magic numbers, boolean names without `is`/`has`/`are`, silent catch blocks and lines over 120 characters. Three `gpt-6-luna` workers fixed them without changing any message text, exit code or JSON key. The JSON key `outside_project` stays, and only the local variable became `outsideProject`. `fileSize` now rethrows every error except `ENOENT`. The playbook mode's own `ROUTER.md` (1.1.0.0) used to send a conversation request to `UNKNOWN_FALLBACK` and load every resource for every request. It now scores three intents, `ROOT_PLAYBOOK`, `PER_FEATURE_SCENARIO` and `CONVERSATION_SCENARIO`, and loads only the union of their mapped files. `SKILL.md` §2 names the third intent.
8. **Five improvements, after close.** DeepSeek V4.1 Flash through cli-pi and `gpt-6-luna` xhigh fast through cli-codex wrote them, one change per worker, and the orchestrator reviewed each diff.
   - **Write sandbox.** On macOS the runner starts Claude Code, OpenCode, Pi and Devin through `/usr/bin/sandbox-exec`, with writes denied under the repository root, the runner's own checkout and the git common dir. Codex keeps its own sandbox, because one seatbelt profile cannot be applied inside another. `--no-sandbox` turns it off, and `result.json` records the mode. `scratch/runs/matrix7/` passed all five runtimes 6/6 with it on.
   - **Named quota blocker.** A launch or turn that already failed is renamed `QUOTA_EXHAUSTED` when the screen shows a usage-limit message. The Codex wording is proven against the recorded `matrix6` screen, now the fixture `codex-quota.txt`; the other runtimes' wording is unconfirmed live.
   - **Suite isolation.** The SIGINT group's process scan used to see every `fake-subject.cjs` on the machine and failed when another session's suite ran. The fake adapter now passes its project path, and the group scans only its own folder.
   - **One diagnostic helper.** All 17 stderr lines go through `writeDiagnostic`, with byte-identical output.
   - **Scenario style rule.** `SKILL.md` §6 Choosing the Scenario Style now holds the single rule for choosing between a single prompt and a conversation: four ordered questions, the runtime requirements and the cost of each style. The mode router's decision rule, its fallback checklist, the snippet template and both references point to it. `/create:manual-testing-playbook` reads the rule, records each scenario's style and deciding question, writes or deletes the conversation block to match, and runs `validate-playbook-package.cjs`. The confirm mode shows the styles at its plan checkpoint. MTP-008 checks the choice.
   - **Alignment pass on everything playbook-related.** `/local-skilled-alignment:auto` ran as two path-scoped runs, `.skilled/skills/sk-doc` and `.skilled/commands/create`, under `~/.local/state/local-skilled-alignment/Skilled/20261102T165423Z-*`. All lanes and both critics ran on `gpt-6-luna` xhigh fast through `codex exec`, which the conductor dispatched because the workflow's lane runner drives only cli-pi presets. The scope-caused findings were fixed: two missing sk-doc intent signals and the stale compiled advisor graph, `CODEX_HOME` and `TMUX_TMPDIR` missing from `.env.example`, the command classifying styles before reading the rule, the sandbox test failing inside another sandbox, a per-feature scenario request routing to sk-prompt, and no scenario covering the style choice. The recheck resolved four battery rows. The rows still open are the Devin hook mirror the decision-capture session owns, benchmark report links to missing scratch files, the root playbook package violation and the root README examples, all older than this work.
   - **Hub conversation intent.** The sk-doc hub router gained `PLAYBOOK_CONVERSATION`, so a conversation request loads `conversation-scenarios.md` at the hub too, and the 14 hub scenarios list 19 intents. Replay found "manual testing playbook" also matches "testing playbook", which outscored a conversation phrase. The hub keeps both phrases, because its vocabulary check needs them, and gives the conversation intent double weight. The mode router dropped the nested phrases.
9. **Template split, after close.** One snippet template carried a sample `json conversation` block that a single-prompt author was told to delete, and a block left in by mistake passed validation as a real script. The template is now two files. `assets/manual-testing-playbook-snippet-template.md` (1.1.0.0) holds single-prompt scenarios only and points conversation authors to the new file. `assets/manual-testing-playbook-conversation-snippet-template.md` (1.0.0.0) makes the script block required and fills it with `{RUNTIME}`, `{TURN_ID}`, `{FIRST_SEND}` and `{CHECK_COMMAND}`, so an unfilled block fails validation with `unsupported runtime: {RUNTIME}`. The mode router, `SKILL.md`, the references, the `/create:manual-testing-playbook` command assets, the hub router's `PLAYBOOK_CONVERSATION` leaves, `leaf-manifest.json`, the full-load scenario and the quick reference name the right template per style. Luna wrote the edits and the orchestrator reviewed each diff, regenerated the leaf manifest, the compiled manifest and its archived copy, and the Hermes mirror, and reran the playbook, routing and runner checks.
10. **Two question-parsing fixes from the adoption build's live runs, after close.** Live OpenCode and Pi runs showed two parser gaps, and the orchestrator fixed both in `run-conversation-scenario.cjs`. First, a question wrapped over several screen lines used to be read as its last line only, so a `match` written for the full sentence missed it. The Claude Code, Pi and OpenCode parsers now join up to six lines above the first option into one line. Second, an `answer.select` label had to equal an option exactly. `findOptionIndex` now accepts an exact match ignoring case, or else the one option that contains the label, so `Skip` chooses `D) Skip documentation (Recommended)`. A label contained in several options fails the turn as ambiguous. The suite gained the fixture `question-screens/opencode-wrapped.txt` and assertions for both fixes, and it passes 24/24, the same count as before. `references/conversation-scenarios.md` documents both rules in its `match` and `answer.select` rows.
11. **Alignment rerun after the commits, 2026-11-03.** `/local-skilled-alignment:auto` over `cc76603d2f..HEAD` (run folder `~/.local/state/local-skilled-alignment/Skilled/20261103T121629Z`) ran 194 battery rows, four DeepSeek lanes through cli-pi and an Opus critic. The orchestrator fixed every finding this work caused:
   - The runner refuses two turn ids that share an evidence folder, and runs a runtime named twice once. Each change has a suite assertion.
   - `validate-playbook-package.cjs` exempts `.skilled/skills/.state/doctor-update/` paths again. A worker had dropped that branch, which raised eight warnings in the root playbook.
   - The conversation template now says to drop `stage:` with the gold fields when a scenario makes no routing claim. CE-P05 and SD-004 dropped their stage, and the strict topology gate passes for every touched package.
   - Other fixes: stale leaf aliases, four missing section separators, one stale intent list, one unsynced root prompt, one wrong runner path, and one changelog line.
   
   Findings left open:
   - A request to play a conversation scenario that names a runtime routes to `cli-external-orchestration`.
   - Two compiled-vocabulary gaps for the conversation phrases.
   - No suite case for a declared question that never appears.
   - A tmux-less suite still prints PASS.
   - No sk-doc feature-catalog entry for the runner.
   
   The Hermes drift and one undocumented scenario command belong to the decision-capture session. The README and `operator validation` findings predate this range.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Fake-subject core before any live probe | Research section 7.1: milestone M2 needs no quota |
| Content hash, not `git status --ignored` | It sees an append to an existing ignored file |
| `CONVERSATION_RUNTIME` exported to checks | One script can skip a stage that does not apply to a runtime |
| Live passes against a detached worktree | Other sessions write to the main checkout (Q011) |
| Codex sandboxed by its own flag, the other four by `sandbox-exec` | Their adapters have no filesystem sandbox flag (Q013), and a seatbelt profile cannot nest inside Codex's own |
| Trailing `;` typed by key code | tmux reads a trailing `;` as a command separator, measured on tmux 3.8 |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node scripts/tests/run-conversation-scenario.test.cjs` | exit 0, 21 groups PASS including `sandbox policy` and `quota screen`, `adapter screens: PASS (5 runtimes)`, `PASS conversation runner suite` |
| `node scripts/tests/validate-playbook-package.test.cjs` | exit 0, `conversation script regressions: PASS (106 assertions)` |
| Playbook package and fleet | this package PASS 0/0; fleet `packages 56 violations 1 warnings 93`, unchanged; the one violation is the root `.skilled/manual-testing-playbook` package |
| `scratch/runs/matrix3/` | five rows PASS 6/6, exit 0 |
| `scratch/runs/matrix5/` | Claude Code, OpenCode, Codex and Devin PASS 6/6; Pi FAIL on the case-sensitive check (`run-notes.md`) |
| `scratch/runs/matrix6/` | Claude Code, OpenCode, Pi and Devin PASS 6/6; Codex FAIL, weekly usage limit (`run-notes.md`) |
| `scratch/runs/claude-code-final/` | Claude Code alone on the final runner and scenario: PASS 6/6, exit 0, `repo.changed` false |
| `scratch/runs/codex-final/` | Codex alone on the final runner and scenario, after the operator reset its quota: PASS 6/6, exit 0, `repo.changed` false |
| `scratch/runs/matrix7/` | five rows PASS 6/6 with the write sandbox on, exit 0; `sandbox` `seatbelt` for four runtimes and `codex-workspace-write` for Codex |
| `scratch/runs/trust-proof/` | Codex PASS 6/6, `hook_trust.ok` true |
| Cleanup after every live run | `cleanup.ok` true in every `result.json`; no `conv-*` socket left; no `REPO_CHANGED` in `matrix3`, `matrix5`, `matrix6` or `matrix7` |
| Routing | `compiled-route-guard` all fresh, `compiled-route-admission` pass, `ci-hub-vocabulary-source` drift 0, `ci-router-vocabulary-reach` no-reach 0, `parent-skill-check` OK |
| Code standard, five scripts | `verify_alignment_drift.py` `check_file` with exact headers and section dividers: 0 findings each; `check-comment-hygiene.sh` exit 0; `node --check` passes |
| In-mode routing | `parent-skill-check` 12a PASS; replay shows no unrouted leaf and no missing path; `ROUTER.md` and `SKILL.md` `validate_document` 0 issues |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Repository snapshots removed from the evidence.** At the operator's request, the 103 `repo-before.txt`, `repo-after.txt` and `setup-repo-*.txt` files (3.7 GB, full hash listings of `specs/`) were deleted from `scratch/runs/`. Each run's `result.json` still records `repo.changed`. `matrix2/repo-changed-cause.md` keeps the attribution of that run's changes.
2. **Quota wording is proven for Codex only.** `QUOTA_EXHAUSTED` matches Codex's recorded screen. The Claude Code, OpenCode, Pi and Devin patterns follow their known wording and have not been seen live, so a new wording still reads as the original failure.
3. **The write sandbox is macOS only.** Elsewhere `result.json` records `unavailable` and the subject runs unsandboxed. The sandbox denies writes to the repository only; the subject can still write to its own scratch project, its home configuration and temporary folders.
4. **Out of this packet's scope.** The alignment run also reported the root `README.md`, an sk-doc benchmark report's broken links, the root playbook package violation, the Devin hook mirror of the decision-capture session's `ask-capture-posttooluse.mjs`, and a scorer gap in the alignment tool's `run-probes.cjs`.
5. **Do not run two live runs at once** against the same repository root. Each sees the other's evidence writes as `REPO_CHANGED`.
<!-- /ANCHOR:limitations -->
