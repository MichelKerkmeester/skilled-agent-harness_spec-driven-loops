---
title: "Implementation Summary"
description: "The follow-ups phases 027 and 028 left are closed. The pre-flight test finds shell comments by quote state and checks each prefix grep reads the standalone listing, every note that sends an OpenCode 2 reader to `opencode2 models --standalone` names the prefix to look for, two guards keep it that way, the sk-vision kill-switch tests leave no directory behind, and the plugin playbook snippets that load a plugin in-process run again."
trigger_phrases:
  - "cli opencode docs and vision test cleanup implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/082-opencode-v1-v2-dual-compat/036-cli-opencode-docs-and-vision-test-cleanup"
    last_updated_at: "2026-10-20T22:00:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Recorded the local verification and sent the change to review"
    next_safe_action: "Apply the review verdict, then push to main and confirm CI"
    blockers: []
    key_files:
      - ".skilled/skills/cli-external-orchestration/cli-opencode/scripts/tests/opencode2-models-form.test.cjs"
      - ".skilled/skills/sk-vision/vision-runtime/tests/plugin.test.ts"
      - ".skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/git-preflight-advisory/git-preflight-advisory.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-036-cli-opencode-docs-and-vision-test-cleanup"
      parent_session_id: null
    completion_pct: 80
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 036-cli-opencode-docs-and-vision-test-cleanup |
| **Completed** | In progress |
| **Status** | In Progress |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Five follow-ups from phases 027 and 028 are closed, and two problems found on the way are fixed with them.

### Phase 36: cli-opencode-docs-and-vision-test-cleanup

**Pre-flight comments.** The doc test used to cut a trailing comment at the first ` #` after a line's last quote, so a quote inside the comment kept a fake `grep '^opencode-go/' ... && OPENCODE_GO_OK=1` active. `activeShellLines` now walks each line's quote state and `$(...)` nesting: a `#` starts a comment only outside quotes, unescaped, at the line start, after whitespace or `;|&(`, or after a `)` that closes a plain subshell. Continuations are joined first, with nothing between, as bash does. A provider check then counts only as top-level shell segments, split outside quotes and substitutions: a source, then a `grep '^<provider>/'`, then `&& <NAME>_OK=1`. The source must be `opencode2 models --standalone` itself, or `printf`/`echo` of a variable whose last assignment before the grep is a substitution of the standalone listing alone, optionally quoted, with only redirects inside. A check written inside a quoted string, or a variable reassigned from another command, no longer counts.

**Listing notes.** 43 notes across the cli-opencode docs and one cli-devin reference sent an OpenCode 2 reader to `opencode2 models --standalone` without saying what to look for. Each now tells the reader to check that the listing holds the `<provider>/` prefix of the model they pass to `-m`. A first pass named fixed prefixes, and review showed that was wrong in two ways: some notes said v2 lists no `opencode-go` and then asked for `opencode-go/`, and others checked `llmgateway/` next to a command passing an `opencode-go` model. The MiMo note keeps `llmgateway/`, because its command passes an `llmgateway/` model.

**Two new guards.** One fails on a lowercase `opencode models` or `opencode2 models` command left in prose outside code spans and fenced blocks; none exists today. The other fails on a clause that sends a reader to the standalone listing with a check word and names no prefix. It reads the prefix, filter and grep words from the clause's prose only, so an unrelated command span cannot exempt it. Both scan every shipped doc under the CLI skills and the Hermes copy.

**sk-vision temp directories.** Each kill-switch case pointed `HOOK_FLAGS_CONFIG` at a file inside a fresh `mkdtemp` directory and never removed it. The path now sits under a parent that is never created, so a run adds no `sk-vision-flags-*` entry. Before the change it added 7.

**Playbook snippets.** The follow-up named the `.skilled/plugins/` path in the speckit-completion step 6. That path is a symlink to `.opencode/plugins/` and resolves. What actually failed was the call: `mod.default({ directory })` throws `mod.default is not a function`, because every plugin default-exports `{ id, setup, server }`. Ten such calls in seven playbooks now go through `default.server(...)`. Review found two more calls the first search missed: CO-039 in the goal-hook playbook called `MkGoalPlugin({}, { stateDir })` and read a `__test` property the plugin no longer has, and the codex-watchdog README called `m.default(...)`. CO-039 now calls `server` and takes its helpers from `getGoalCore(server)`, as the plugin tests do. Four hook READMEs expected `ok function` from a load check that now prints `ok object`; they say so. Running the snippets turned up one more break: CO-038's scratch repo held only the sk-git `SKILL.md`. The plugin finds its source root through `skills/system-spec-kit/SKILL.md` and reads its rules from `hard-rules.json`, so step 3 printed no advisory. Step 2 now copies both.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `cli-opencode/scripts/tests/opencode2-models-form.test.cjs` | Modified | Quote-aware comment stripper, listing-source check, prose guard, prefix-note guard and their unit tests |
| 28 Markdown files under `cli-external-orchestration/cli-opencode/` and `cli-devin/references/providers-and-models.md` | Modified | The listing notes name the prefix |
| `sk-vision/vision-runtime/tests/plugin.test.ts` | Modified | The kill-switch switch-file path is never created |
| Seven plugin playbooks in system-spec-kit, sk-code, cli-external-orchestration and cli-opencode | Modified | In-process snippets call `default.server(...)`; CO-038 step 2 copies the rules and the source-root sentinel |
| `cli-opencode/manual-testing-playbook/goal-hook/goal-hook.md`, `.skilled/hooks/codex-watchdog/README.md` | Modified | `server` entry; CO-039 helpers from `getGoalCore` |
| `.skilled/hooks/{codex-watchdog,completion,dist-freshness,session-cleanup}/README.md` | Modified | Load checks expect `ok object` |
| `sk-doc/scripts/tests/code-folder/durable-directory-manifest.json` | Modified | Outside fix: adds `.skilled/hooks/session-relaunch/lib` |
| `../spec.md`, `../graph-metadata.json` | Modified | Phase map, handoff row and child id |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

DeepSeek v4.1 flash at max thinking, through cli-pi on llmgateway, wrote every code and doc change from twelve one-change briefs. I wrote this folder's docs, registered the phase, ran every check below and wrote the mutants. Luna (GPT-6 Luna, max, fast, read-only through cli-codex) reviews the range from the baseline commit `b66382b384`. Round 1 failed with five P1s and one P2, all fixed: the contradictory and mismatched notes, the `$(...)#` stripper gap, the quoted-string and reassigned-variable gaps in the source check, and the two missed plugin calls, plus the missing type-check evidence. Round 2 failed with three P1s and one P2: two more scanner gaps (a hash bash reads mid-word after a continuation, and a substitution that runs a second command after the listing), both fixed; the unrecorded manifest rerun, fixed; and the v2 examples that still pass the default `opencode-go` model, recorded below rather than changed. Round 3 found three more shell spellings the text-level check cannot see and one P2; under the goal's stop rule, scanner spellings found after round 3 are recorded as known limits (Known Limitation 7), and the P2, an unqualified snippet claim in `tasks.md`, is fixed.

**Outside fix.** Main's sk-doc Script Tests job has failed since the hop-history merge `2aee29cd64` (run 39503477757): it added `.skilled/hooks/session-relaunch/lib`, and the frozen durable-directory manifest no longer reproduced. On the coordinator's instruction this phase refreshed the manifest with `test_readme_manifest.py --write`; the diff adds that one directory, the test then passes, and the directory needs no README. Group 037 made the same fix on main in `33455fed8a`, so this phase's commit `0cb9b13564` is content-identical to main's and the merge keeps main's copy. Nothing else from that work was changed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Fix the call form, keep the `.skilled/plugins/` path | The symlink resolves, and the snippets failed on `mod.default(...)`, not on the path |
| Fix all seven playbooks, not only the one the follow-up named | They break the same way, the fix is the same call, and REQ-002 asks every changed snippet to run |
| Fix CO-038 step 2 here | It is one of the changed snippets, and with the call fixed it still printed nothing |
| A switch-file path that is never created, rather than an `afterEach` cleanup | Nothing is created, so nothing can leak, even when a case throws |
| The prose guard matches the lowercase command form only | The capitalised product name "OpenCode models" is ordinary prose |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| cli-opencode script tests | PASS, 21/21 (baseline 13/13) |
| Mutants of the new rules (`scratch/mutation/`) | Each of twelve fails at least 1 test: text-level comment cut, any listing counts, no prose scan, no prefix scan, exemption on the whole clause, no `confirming`, any `)` ends a word, first assignment wins, segments ignore quotes, strip before join, value prefix only, join inserts a space |
| sk-vision `bun test tests` | PASS, 80/80 (baseline 80/80); `sk-vision-flags-*` entries 63 before and 63 after a run (baseline added 7) |
| sk-vision `bunx tsc --noEmit` (`scratch/after/sk-vision-tsc.txt`) | PASS, exit 0 |
| speckit-completion steps 3 and 6 (`scratch/after/speckit-completion.txt`) | Run; step 6 prints `hooks keys: []` with the switch set (baseline: `TypeError`, exit 1) |
| dist-freshness steps 3 and 4 | Run, exit 0 |
| session-cleanup harness | Run, exit 0; the startup warning is injected once and dispose is idempotent |
| completion-sentinel adapter block | Run, exit 0; one advisory line, deduplicated on the repeat |
| post-edit-quality live block | Run, exit 0; the advisory finding is injected |
| cli-dispatch-audit live block | Run, exit 0; the bearer token is logged as `[REDACTED]` |
| CO-039 scratch script and the codex-watchdog kill-switch snippet (`scratch/after/goal-and-hook-readmes.txt`) | CO-039 prints `"verdict":"PASS"`, exit 0; the watchdog snippet prints `ok`, exit 0; all five hook README load checks print `ok object` |
| sk-doc `test_readme_manifest.py` after the manifest refresh (`scratch/after/readme-manifest.txt`) | PASS, `reproduced=True` |
| sk-doc script tests, full run after the refresh (`scratch/after/sk-doc-script-tests.txt`) | PASS, all passed, exit 0 |
| sk-doc rename harness rerun on a quiet worktree (`scratch/after/rename-harness-rerun.txt`) | PASS, 4 tests; the first run failed only because this phase wrote files while it ran |
| CO-038 steps 2 to 4 | Step 3 prints `[commit-scope-drops-untracked]`; step 4 with `SKGIT_ADVISORY=0` prints `{"system":[]}` |
| Playbook validator `--strict` | PASS, exit 0; cli-opencode 72 scenarios, 0 violations |
| Markdown link integrity | PASS, 0 broken links |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Other sk-vision test temp directories.** `tests/host-adapter.test.ts` (`sk-vision-host-`), `tests/runtime/client.test.ts` (`sk-vision-client-`) and the `temporaryDirectory()` helper in `tests/plugin.test.ts` still leave 10 directories per run. They were not a recorded follow-up.
2. **A speckit-completion fixture moved.** Step 3's "Level-2 EVIDENCE_MISSING" fixture now reports `level: 1` and `P0_INCOMPLETE`, so its expected values are stale. The snippet runs; the fixture choice is outside this phase.
3. **The cli-pi twin of CO-038** also copies only the sk-git `SKILL.md` into its scratch repo, so it may print no advisory for the same reason. It drives a Pi extension, not this plugin, and was not run here.
4. **The prefix guard reads wording.** A clause that names a prefix the reader should not look for still passes; review covers that.
5. **The v2 examples still pass the skill default `opencode-go/deepseek-v4.1-flash`.** OpenCode 2 lists no `opencode-go` provider on this machine, so those examples would fail here as written. They show the skill's documented default on both versions; switching an example to another provider is a change to the default the skill's own rule says needs the operator's approval. Every such note now tells the reader to check the listing for the prefix of the model they pass first.
6. **Some READMEs describe a `__test` surface.** `.opencode/plugins/tests/README.md` and `system-spec-kit/runtime/hooks/opencode/README.md` mention `.__test` helpers hanging off a default export. They are prose, not runnable snippets, so this phase left them; the sk-code alignment review of `.opencode/plugins` owns them.
7. **The pre-flight check reads shell text, not a shell parse.** It still misses an escaped delimiter before `#` (`echo foo\;#note; ...` keeps the check after it hidden), joins a backslash followed by spaces as a continuation where bash does not, and accepts a `printf` whose last argument is the verified variable even when its format prints other text, or a variable written by `printf -v`. Each needs a crafted line inside the skill's own pre-flight block; the block itself is run live, which is the stronger check.
<!-- /ANCHOR:limitations -->
