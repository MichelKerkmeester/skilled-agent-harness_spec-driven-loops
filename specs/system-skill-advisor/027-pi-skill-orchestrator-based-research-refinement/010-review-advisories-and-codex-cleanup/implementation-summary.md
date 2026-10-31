---
title: "Implementation Summary: Closing the Review Advisories and the Codex Hook Cleanup"
description: "Codex now runs each repository hook once, and every phase 6 review advisory is fixed, with seven siblings found on the way. A prompt over 10,000 characters now gets a route instead of the advisor's outage brief."
trigger_phrases:
  - "review advisories closure summary"
  - "codex hook cleanup summary"
  - "advisor long prompt head"
  - "advisor prompt over stdin"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/030-pi-skill-orchestrator-based-research-refinement/010-review-advisories-and-codex-cleanup"
    last_updated_at: "2026-09-27T10:30:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Closed every finding with a verified fix and live proof"
    next_safe_action: "None. The phase is complete"
    blockers: []
    key_files:
      - ".skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts"
      - ".skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts"
      - ".opencode/plugins/system-skill-advisor.js"
      - ".skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts"
      - ".skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py"
      - ".skilled/skills/system-deep-loop/runtime/scripts/synthesis-closeout.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-27-030-010-closeout"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Closing the Review Advisories and the Codex Hook Cleanup

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 010-review-advisories-and-codex-cleanup |
| **Completed** | 2026-09-27 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Codex now starts each repository hook once, and every advisory the phase 6 review left is fixed. So are seven siblings found while verifying those fixes. Two of the siblings were live defects that users hit. Any prompt over 10,000 characters got the advisor's outage brief instead of a route, and confirm-mode research stopped on convergence without its quality guards.

### Phase 10: review-advisories-and-codex-cleanup

**Codex runs each hook once (C1).** On the operator's direction the session ran the removal-only installer against `~/.codex/hooks.json`. It removed the 18 repository copies and kept every third-party entry. The earlier jcode deletion had shifted three third-party SessionStart groups off their trust records. Their trust was restored with the hashes Codex itself reports, through the same config write its `/hooks` review makes. A live `codex exec` from the checkout then started 9 SessionStart, 5 UserPromptSubmit and 6 Stop hooks, and the advisor wrote one record per prompt.

**No advisor caller puts the prompt in argv (R2-P2-001, N2, N4).** Any local process listing could read a prompt from the process table. The advisor CLI now takes `--json -` and reads the same JSON object from stdin, so the hook fallback and the OpenCode plugin send their request there. The compiled-route front door takes `--prompt-stdin`, and the daemon sends the prompt there. A request can name another checkout whose front door predates the flag, so the daemon then attaches no compiled route rather than fall back to argv. The argv forms `--json '<object>'` and `--prompt <text>` still work for anyone who types them.

**A long prompt is routed on its head (N5, N7).** `advisor_recommend` accepts at most 10,000 prompt characters, while the hooks and the plugin sent up to 64 KiB. Every longer prompt failed validation and fell back to the outage brief. The hook producer, the CLI fallback and the plugin now send the first 10,000 characters. The plugin also clamps its request by its JSON-escaped size, so the whole request stays inside `SYSTEM_SKILL_ADVISOR_MAX_PROMPT_BYTES`. A budget too small for any prompt now sends nothing instead of an empty prompt the CLI refuses. The standalone Python CLI had the same gap on its native call. It now sends the first 10,000 UTF-16 code units, the unit JavaScript counts, so an emoji-heavy prompt fits too.

**`advisor_validate` accepts every runtime (F003).** Outcome events from pi, codex, cursor and devin were rejected. The schema, the tool descriptor and the CLI manifest now all take their list from `ADVISOR_RUNTIME_VALUES`.

**Advisor logs stay private (F004).** The metrics directory is created at `0o700` and each log at `0o600`, and a directory or log an older writer left open is tightened. A `chmod` that fails is retried on the next write rather than remembered as done.

**The hook budget cannot outlive the shim (F002, R2-P2-002).** An operator value of `SPECKIT_CLAUDE_HOOK_TIMEOUT_MS` above 2,200 ms let the shim's 2,500 ms kill land first, so the turn got `{}`. The child budget is now the smaller of the operator value and 2,200 ms.

**Deep-loop workflows honor their own contract (F005, N1, N6, R3-P2-002, R1-P2-003).** `--stop-policy=max-iterations` now keeps review confirm and both research workflows running to their ceiling. In research the rule is its own step `3a`, so the default convergence mode cannot skip it. Research confirm had lost the quality-guard body of its step 9 in an earlier parity edit. It is back, and a test now holds each confirm algorithm to its auto twin. The synthesis close-out moved from four inline copies into one script. Review now folds its lineage state logs as research does, so a fan-out review reports its real iteration count.

**Comments state the contract the code keeps (R1-P2-002, R1-P1-001, R3-P2-001, N3).** The Pi dedup comment and the `edit_lines` comment were corrected. A test pins the documented `line_hashes` opt-in, and a non-empty `line_hashes` list must now cover the whole range.

**Dead code is gone (F001).** `shouldTrySkillAdvisorCliFallback` had no caller and was deleted, as was the plugin's `clampPrompt` once the escaped clamp replaced its only call.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `~/.codex/hooks.json`, the operator's global file outside the repository | Modified | The installer removed the 18 repository copies, after a backup |
| `~/.codex/config.toml`, the operator's global file outside the repository | Modified | Three trust records got the hashes Codex reports, after a backup |
| `runtime/schemas/advisor-tool-schemas.ts`, `runtime/tools/advisor-validate.ts`, `runtime/skill-advisor-cli-manifest.ts` | Modified | Outcome event runtimes come from `ADVISOR_RUNTIME_VALUES`, and the prompt limit is the named constant `ADVISOR_PROMPT_MAX_CHARS` |
| `runtime/skill-advisor-cli.ts` | Modified | `--json -` reads the request object from stdin |
| `hooks/lib/skill-advisor-cli-fallback.ts` | Modified | Sends its request over stdin with at most 10,000 prompt characters, and the dead gate is gone |
| `runtime/lib/skill-advisor-brief.ts` | Modified | Routes a long prompt on its head |
| `runtime/scripts/skill_advisor.py` | Modified | The native call sends at most 10,000 UTF-16 code units |
| `.opencode/plugins/system-skill-advisor.js` | Modified | The request goes over stdin, clamped by its escaped size and the prompt limit |
| `runtime/handlers/advisor-recommend.ts`, `.skilled/bin/compiled-route.cjs` | Modified | The front door reads the prompt from stdin, and the daemon skips a front door that predates the flag |
| `runtime/lib/metrics.ts` | Modified | Private directory and log modes, with a failed `chmod` retried |
| `system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts` | Modified | The child budget is the smaller of the operator value and 2,200 ms |
| `hooks/pi/prompt-advisor.ts` | Modified | The dedup comment states the contract the code keeps |
| `.pi/extensions/pi-cache-optimizer/index.ts` | Modified | The `edit_lines` comment, and a non-empty `line_hashes` list must cover the range |
| `system-deep-loop/runtime/scripts/synthesis-closeout.cjs` | Created | One close-out program for review and research |
| `deep-review-auto.yaml`, `deep-review-confirm.yaml`, `deep-research-auto.yaml`, `deep-research-confirm.yaml` under `.skilled/commands/deep/assets/` | Modified | Call the shared script, fold review lineage logs, honor `stop_policy` and restore the research confirm quality guards |
| The two ledger schema type files, `check-ledger-stem-producers.cjs`, the deep-loop scripts README and the compiled `deep/review` and `deep/research` contracts | Modified | Name the new producer and match the edited workflows |
| Advisor tests `advisor-validate`, `skill-advisor-cli-fallback-no-match`, `advisor-brief-producer`, `advisor-recommend-compiled-route-option`, `system-skill-advisor-plugin` and `test_skill_advisor.py` | Modified | One test per behavior change |
| Advisor tests `skill-advisor-cli-json-stdin` and `metrics-file-permissions` | Created | The stdin request and the private log modes |
| `.opencode/plugins/tests/system-skill-advisor.test.cjs`, `user-prompt-submit-shim.vitest.ts`, `hash-verified-edits.test.ts`, `run-now-yaml-control.vitest.ts`, `check-ledger-stem-producers.vitest.ts` | Modified | Tests beside each change |
| `.skilled/bin/tests/compiled-route-front-door.test.cjs`, `system-deep-loop/runtime/tests/unit/stop-policy-yaml-parity.vitest.ts` | Created | The stdin front door, and each confirm algorithm held to its auto twin |
| `hooks/skill-advisor-hook.md`, `hooks/lib/README.md`, the plugin bridge playbook scenario, the `skill-advisor-cli`, `advisor-recommend` and `opencode-plugin-bridge` feature entries, `.skilled/bin/README.md` | Modified | Describe the stdin transports and the prompt limit |
| `evidence/c1/` | Created | Installer, trust and live-run records |

`runtime/` and `hooks/` mean `.skilled/skills/system-skill-advisor/runtime/` and `.skilled/skills/system-skill-advisor/hooks/`.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The orchestrator confirmed each advisory in code at `05231a01ea` before writing a brief. Each fix got a short implementer brief with literal text and a verifier brief with its own checks. Grok 4.7 xhigh fast through cli-cursor implemented, and GPT-6 Luna max fast through cli-codex verified. Every verifier ran a reverse check that the new test fails against the pre-change file. The phase took 22 implementer runs and 21 verifier runs.

The orchestrator treated each verdict as a claim. Five FAIL verdicts found real gaps: the research stop-policy placement, the plugin's byte budget, the metrics `chmod` retry, a comment that still misnamed the fallback and one overbroad doc sentence. Each was fixed and verified again. One finding, the plugin's spawn order, was rejected with Node and Bun evidence. Four BLOCKED or FAIL verdicts came from a verifier's sandbox, a check run beyond its brief or files outside the change. The orchestrator answered each with its own run.

Seven siblings came from verifier observations and the orchestrator's own measurements. Each went into `spec.md` before work on it started, as D4 requires. The Codex cleanup ran on the operator's direction, with both global Codex files backed up first.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Send the prompt over stdin, not in an environment variable or a temp file | Stdin is private to the two processes and needs no cleanup. A temp file needs a private path and a delete |
| Keep `--json '<object>'` and `--prompt <text>` working | People type them and the docs show them. Only the callers moved |
| Attach no compiled route when the front door predates `--prompt-stdin` | D3 forbids argv, and the compiled route is an extra. Losing it on an older checkout costs a hint, not the recommendation |
| Route a long prompt on its first 10,000 characters | Every longer prompt got the outage brief. A head that misses late intent still beats an outage |
| Clamp the plugin request by its escaped size | JSON writes a quote or newline as two bytes and a control character as six, so a prompt clamp alone let the request outgrow its budget |
| Count UTF-16 code units in the Python cut | `advisor_recommend` counts JavaScript string length. An emoji is one Python character and two JavaScript ones |
| Reject the verifier's spawn-order finding | With a missing binary, Node 26.8.2 and Bun 1.3.9 raise ENOENT on the child and no stdin error. Waiting for `spawn` adds a dependency and changes no behavior |
| Take the stricter rule where the two close-out programs had drifted | Review now rejects a symlinked artifact and research keys a finding by `findingId` too. Neither weakens a check |
| Keep an empty `line_hashes` list meaning none | The published schema documents that opt-in. Only a non-empty list that stops short was unsafe |
| Clamp the operator hook budget to 2,200 ms | The shim kills its child at 2,500 ms and keeps 300 ms to start it. A larger budget only let the kill land first |
| Restore trust with the hash Codex reports | Codex keys trust by position and content hash. Its own `/hooks` review writes the same record, so no hash is guessed |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Advisor runtime typecheck (`npm run typecheck`) | PASS, exit 0 |
| Advisor runtime suite (`npx vitest run`, final state) | PASS, 129 files, 971 passed, 6 skipped, 0 failed. The baseline was 127 files, 959 passed and 6 skipped |
| The same suite's first final-state run | 3 tests in `skill-advisor-cli-job-semantics` failed with `daemon launcher exited with code 1`. Verifier reverse checks had left sources newer than the dist, and the launcher refuses to build under vitest. Once the dist was rebuilt, the file passed alone and the whole suite passed |
| Spec-kit typecheck | PASS, exit 0 |
| Spec-kit hook, shim and directive-lifecycle test files | PASS, 237 passed, 7 skipped. The baseline was 236 and 7 |
| Pi dispatch suite (`--config hooks/vitest.config.ts --dir hooks/dispatch/pi`) | PASS, 50 of 50, as at baseline |
| OpenCode plugin tests (`node --test`) | PASS, 35 of 35. The baseline was 31 |
| pi-cache-optimizer typecheck and tests | PASS, 118 of 118. The baseline was 116 |
| Compiled-route bin tests | PASS, admission 29 of 29 as at baseline, plus the new front-door test |
| Ledger stem-producer census | PASS, `"ok": true` |
| Deep-loop suite (`npx vitest run --no-coverage`) | PASS, 155 files, 2708 passed, 8 skipped. The baseline was 154 files, 2701 passed and 8 skipped |
| Python advisor suite (`test_skill_advisor.py`) | PASS, 59 of 59. The baseline was 58 |
| Reverse checks | 21 verifier runs. Each restored the pre-change file, saw the new test fail and restored the fix |
| Live Codex run from the checkout (`evidence/final-state/live-codex-hook-counts.txt`) | 9 SessionStart, 5 UserPromptSubmit and 6 Stop hooks started and completed, with one advisor record for the one prompt. `--check` prints `OK` |
| Long prompt, live (`evidence/final-state/live-checks.txt`) | A 20,000-character prompt through the Claude hook and through the real OpenCode plugin each got `Advisor: live; use sk-code 0.84/0.12 pass.` Before the fix it got the outage brief |
| Prompt off argv, live | `--json -` and `--json '<object>'` return the same three skills. 142 process-table polls during a marked prompt found it in no argv |
| Python CLI long prompt, live | 15,000 ASCII characters and 11,250 characters that JavaScript counts as 11,700 both route natively with `--force-native` |
| `advisor_validate` runtimes, live (`evidence/final-state/live-daemon.txt`) | pi, codex, cursor and devin pass the runtime check, and a bogus runtime is refused with all seven listed. Each probe was refused on a deliberately invalid outcome, so nothing was recorded |
| Advisor daemon | The daemon that predated the fixes had exited by 10:10 UTC, for a reason this session could not find, and no signal came from this session. The launcher that replaced it rebuilt the dist and runs the fixed code |
| Log modes, live | The metrics directory is `0o700`, and the log the final Codex run wrote is `0o600`. Older logs are tightened on their next write |
| Advisor doc validators (`validate_document.py`) | 0 issues on each of the seven docs, as at baseline |
| `validate.sh --strict --recursive` on packet 030 | PASS, `RESULT: PASSED` for all 11 folders, each with 0 errors and 0 warnings |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

None. Every finding has a verified fix, and the advisor daemon serving this checkout runs the fixed code.
<!-- /ANCHOR:limitations -->

---
