---
title: "Implementation Summary"
description: "The eight P2 advisories of the OpenCode v1 removal review are closed: a loopback-pinned battery server, the remove-v1 test in CI, definePlugin, corpus-wide parser parity, retired opencode2 vocabulary and corrected phase 001 evidence."
trigger_phrases:
  - "v2 review p2 fixes implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/004-v2-review-p2-fixes"
    last_updated_at: "2026-11-20T16:26:13Z"
    last_updated_by: "generate-context"
    recent_action: "Made the shim passthrough rule honest for attach and mini and passed --completions"
    next_safe_action: "Review the follow-up commit on main"
    packet_purpose: "Purpose: Each advisory is fixed or shown already covered, with a command that proves it, and the gate shows no regression against the baseline taken before the first edit."
    blockers: []
    key_files:
      - "specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/004-v2-review-p2-fixes/implementation-summary.md"
      - ".skilled/bin/skilled-loop-shell.sh"
      - ".skilled/hooks/session-handover/tests/skilled-loop-shell.test.cjs"
      - ".skilled/hooks/session-handover/runtime-behavior.md"
      - ".skilled/skills/system-spec-kit/feature-catalog/context-preservation/session-handover-loop.md"
    session_dedup:
      fingerprint: "sha256:c0d65096eb97b30bf52627617bf72a8cbd2e4682bb0197ca863629131cc810e1"
      session_id: "scaffold-004-v2-review-p2-fixes"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "df9261d4-6090-4b52-892b-db52ff291ccd"
      workspace: "/Users/michelkerkmeester/worktrees/public/492-opencode-shim-passthrough-honesty"
      savedAt: "2026-11-20T16:26:13Z"
      locatorKind: "transcript_path"
      version: 1
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
<!-- FILL: Fill the folder name, the completion date and the level. Use the real date. GOOD: `004-rotate-logs-keep`. Completed 2026-10-24. Level 1. WEAK: Folder: TBD. -->

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-v2-review-p2-fixes |
| **Completed** | 2026-11-20 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

All eight P2 advisories from the third OpenCode v1 removal review are closed. The battery's private server now listens on loopback only, the one `remove-v1` end-to-end test runs in CI, and the plugin builder is named for the v2-only contract it implements.

### Phase 4: v2-review-p2-fixes

Each advisory got the smallest change that removes it, plus a proof that fails without the change. Tests and live docs no longer present `opencode2` as the v2 launcher. The dispatch guards still match any numbered launcher, because narrowing them would let a renamed binary run unaudited. The unmapped-hook advisory turned out to be covered already: `plugin-inventory.test.cjs` sets up every bridged plugin and compares `skippedKeys` with an empty allowlist in CI. What it lacked was a guard against passing on zero plugins, which a missed rename would cause, and that guard is now added.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/plugins/lib/v2-bridge.js` and the 20 plugin entry files | Modified | `dualPlugin` becomes `definePlugin` |
| `.opencode/plugins/tests/` (`v2-bridge`, `plugin-inventory`, the helper, `README.md`) | Modified | Rename; the hook case fails when no plugin is bridged |
| `.opencode/plugins/ARCHITECTURE.md`, `.opencode/plugins/README.md` | Modified | Name `definePlugin` and the classify test in CI |
| `.skilled/commands/doctor/scripts/git-setup-check.cjs`, its test | Modified | Read the renamed export |
| `.skilled/skills/cli-external-orchestration/cli-opencode/references/agent-delegation.md`, `cli-reference.md`, the sk-code security reference, the spec-kit session-handover playbook | Modified | Rename in docs |
| `.skilled/commands/doctor/scripts/opencode-version-battery.cjs`, its test | Modified | `serve` gets `--hostname 127.0.0.1`, and the fake server records argv so the test asserts it |
| `.github/workflows/opencode-v2-battery.yml`, `.github/workflows/README.md` | Modified | The unit step runs `opencode-setup-classify.test.cjs` |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/opencode-dual-dispatch.vitest.ts` | Modified | Parity over the corpus plus the hand-written outputs |
| `.skilled/skills/cli-external-orchestration/cli-opencode/scripts/tests/opencode-models-form.test.cjs` | Modified | Scan `opencode models` only |
| `.opencode/plugins/tests/system-dist-freshness-guard.test.cjs`, `.skilled/hooks/cli-dispatch/lib/dispatch-audit.test.mjs`, `.skilled/hooks/cli-dispatch/pi/dispatch-preflight-lint.ts` and its test | Modified | Numbered-launcher cases use `opencode9` |
| `../001-v1-runtime-code-and-tests/scratch/event-capture.txt`, `../001-v1-runtime-code-and-tests/tasks.md` | Modified | Header names both parts; CHK-041 command narrowed |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The gate in `scratch/gate.sh` ran before the first edit, with the output in `scratch/gate-baseline.txt`. Each fix was then proved on its own. The two mutation checks in `scratch/unmapped-hook-mutation.txt` showed what the inventory test catches. Removing `--hostname` failed the battery test, and the real `--family=v2` battery leg passed on 2.3.2. The workflow's unit step command ran with no `opencode` or `npm` on PATH. The gate then reran from the final tree into `scratch/gate-after.txt`, and the runtime-mirror checks ran in check-only form.

After merge, `/local-doc-alignment` on an `opencode-v2-only` topic (four lanes on `opencode-go/hy4-flash-free#high`) found five doc lines that disagreed with the code. Its critic did not run, because OpenCode Go reported its monthly usage limit, so each line was checked by hand against the code before the fix. `goal-plugin.md` and `goal-carry-over.md` said the wrapper adds `--standalone` when `opencode --help` lists it; `skilled-loop` adds it unless the launch already carries `--standalone` or `--server`, after refusing OpenCode 1. The CO-001 playbook triage named `brew install opencode`; it now names `opencode-setup.sh v2`. The dist-freshness feature-catalog entry said the OpenCode plugin warns through `console.warn`; the plugin has no console call and logs to `dist-freshness-guard.log` and injects a system-context note.

A follow-up closed three loose ends. The plugin inventory key `nativeDual` became `selfRegistered`. It lists the plugins that make no `definePlugin` call and default-export their own OpenCode 2 `{ id, setup }`, so the new name says what they do on the v2-only contract instead of naming the dual-compat era. The JSON key, the helper's return field, its problem messages, two test files, `tests/README.md` and `ARCHITECTURE.md` changed together, with no alias, because every reader is in `.opencode/plugins`. `node --test .opencode/plugins/tests/*.test.cjs` gave 595 of 595 before and after. The doc-alignment critic was rerun on the same run folder with the `deepseek-high` preset (`llmgateway/deepseek-v4.1-flash-1017`, thinking high). `run-lanes.cjs --critic` reads only the config's top-level `critic`, so it ran from a scratch copy of `executors.json` whose `critic` is that preset. It raised four lines. Two were checked and confirmed in `session-handover-loop.md`, and both are fixed: the shell-shim paragraph said every subcommand list comes from `--help`, though the OpenCode list is hand-kept and names subcommands 2.3.2 lacks, and the adapter paragraph did not say the wrapper refuses an OpenCode 1 binary. Two were refuted: `brew install opencode` resolves to the `homebrew/core` formula at 2.3.2, so those lines do not install OpenCode 1. The `session-handover/history` dist in the primary checkout was stale by mtime. It is gitignored, so it was rebuilt in place with `tsc --build --force`, and all seven dist packages then read fresh.

A second follow-up fixed the shell shim itself instead of describing its drift. `.skilled/bin/skilled-loop-shell.sh` said each subcommand list comes from the runtime's `--help`, but its OpenCode arm still named eleven OpenCode 1 words. `scratch/opencode-2.3.2-subcommands.txt` holds `opencode --help </dev/null` from 2.3.2, which lists 18 subcommands, and a per-name probe. Each listed name, plus the `update` alias, prints its own help. `completion`, `attach`, `providers`, `agent`, `web`, `export`, `import`, `github`, `pr`, `plug` and `db` print the top-level help, the same as a made-up word, because 2.3.2 takes an unknown first word as its `[<directory>]` argument. Those words had been opening a session without the loop wrapper. The OpenCode arm is now exactly the 2.3.2 list. Checked against each runtime's live `--help`, the Codex arm lacked `migrate-nfs-db`, new in codex-cli 0.170.0, which is added. Claude 2.1.329, Pi 1.5.2, Cursor and Vibe 3.1.2 matched; Vibe lists `update` in a second Commands block of its help. The comment now says the lists are copied by hand and that Devin needs none, and `runtime-behavior.md` and `session-handover-loop.md` say the same. `skilled-loop-shell.test.cjs` gained one case that passes all 18 names and sends eight retired words to the wrapper, and a Codex passthrough form. The suite went from 41 of 41 (`scratch/loop-shell-tests-before.txt`) to 43 of 43 (`scratch/loop-shell-tests-after.txt`). Against the old shim the new case and the Codex form fail.

A third follow-up fixed two things the shim's passthrough comment got wrong. The comment said a passed-through subcommand does not open a session in this terminal, but OpenCode 2.3.2 `mini` starts "the minimal interactive interface" and Claude 2.1.329 `attach` opens "the background session in this terminal". Both stay passthrough, because the wrapper cannot relaunch either one. `opencode --standalone mini --help </dev/null` parses, so a first launch through the wrapper would start. A hop, though, rebuilds the root command as `opencode --standalone --prompt <seed>` and replays only dash flags. It drops the `mini` word and lands the receiver in the full TUI. It also replays mini-only flags such as `--fork`, `--replay` and `--agent`, which the root `--help` does not list. A Claude hop builds a fresh `claude <seed>` rather than a reattach. `claude --bg` already passes through, so attaching to that same session belongs on the same side. Its session runs in a process the wrapper did not start, and the handover CLI reads the loop id from its own environment. That is the case `runtime-behavior.md` documents for OpenCode's background service, where nothing arms. This part is inferred from the code and that analogue, not observed. The comment, the shim header, `runtime-behavior.md` and `session-handover-loop.md` now say the shim wraps a session the wrapper can relaunch, and they name `attach` and `mini` as sessions it cannot. OpenCode 2.3.2 lists `--completions <shell>` as a global flag that prints a shell completion script, and `opencode --completions zsh` and `--completions=zsh` both print `#compdef opencode`. `skilled_loop_flag_passes` now passes both forms. `skilled-loop-shell.test.cjs` adds `attach some-name` to the Claude passthrough forms and both `--completions` forms to OpenCode's, and keeps `mini`. The suite stayed at 43 of 43 before and after, since the new forms ride the existing passthrough case. Sourced from the old shim, `skilled_loop_opens_session opencode --completions zsh` reports a session for both forms, and the new shim reports none. The other global flags, `--wizard`, `--log-level` and `--print-logs`, were left as they were.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Retire `opencode2` as a v2 name but keep the `opencode\d*` guard breadth (ADR-001) | Q005 chose renaming, and the breadth is what audits a renamed launcher |
| Keep the models-form scan reading only server-form `opencode models` commands | A bare `opencode models <provider>` appears only in dated OpenCode 1 observations, which keep the command as it ran. Reading them flagged five history lines, not defects |
| `--hostname 127.0.0.1`, not a banner check | `opencode serve --help` on 2.3.2 prints `--hostname`, and the banner check the battery already runs stays as a second guard |
| No `dualPlugin` alias (ADR-002) | Every caller is in the repository and changed in the same commit |
| Add one assertion to the inventory hook case and nothing at plugin setup | The case already caught an unmapped key in CI. A console line at setup would corrupt `opencode run --format json`, and a throw would stop a plugin loading |
| Narrow CHK-041 and say so on the line | The command as first written could never print 0, so the record now states the command that does |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Gate, node leg (43 files) | Baseline 837 tests, 836 pass, 0 fail, 1 skipped. After: the same |
| Gate, dispatch-audit vitest | Baseline 133 of 133. After: 133 of 133 |
| Gate, deep-loop runtime opencode subset (13 files) | Baseline 484 passed, 3 skipped. After: the same |
| Gate, Vibe repo-guards | Baseline 28 of 28. After: 28 of 28 |
| Deep-loop runtime, whole suite | Baseline 195 files, 3716 passed, 11 skipped. After: the same |
| Hooks vitest tree and the Pi preflight lint | 509 of 509 across 10 files, and 259 of 259 for the lint suite alone. After only |
| `git-setup-check.test.cjs` | 87 of 87 |
| Battery test without `--hostname` | 48 of 49, the argv assertion fails |
| Real `--family=v2` battery on 2.3.2 | Four PASS legs, all 20 plugin files active, exit 0 |
| Classify step with no `opencode` or `npm` on PATH | 79 of 79, exit 0, nothing left in HOME |
| Runtime mirrors, check-only | 15 in sync, 1 WARN (Codex hook approval is per checkout path), 0 drift |
| `dualPlugin` outside `specs/` | 0 files |
| Comment hygiene in added code lines | No phase, packet, finding or REQ id |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The gate is a reconstruction.** The prior gate's file lists were never recorded, so `scratch/gate.sh` rebuilds them from the CI workflows. Its node total matches the prior 837, and the deep-loop subset differs from the prior 411-test set. The "Claude source clamps prompts" test that failed before did not fail in this worktree, either at baseline or after.
2. **A bare `opencode models <provider>` in a new doc is not caught.** Before this phase the scan flagged a bare `opencode2 models <provider>`. It now reads only server-form commands, so that coverage narrowed. The workaround is review.
3. **The listener sample cannot name the battery's own socket.** Every `opencode` listener sampled during the live leg was on 127.0.0.1, but other sessions also run servers, so which row was the battery's is inferred, not shown.
4. **The hooks vitest tree, git-setup-check and Pi lint have no pre-edit baseline.** They were run after the change only.
<!-- /ANCHOR:limitations -->
