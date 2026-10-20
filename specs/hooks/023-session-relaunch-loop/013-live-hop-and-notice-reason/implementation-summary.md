---
title: "Implementation Summary"
description: "The killer's timeout notice now says it timed out and why a manual template was ignored. A sourced shell shim starts every interactive runtime launch under skilled-loop, also in a repository that links .skilled, and the nudge fires only inside the loop. The live hops are still to run."
trigger_phrases:
  - "live hop and notice reason implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/023-session-relaunch-loop/013-live-hop-and-notice-reason"
    last_updated_at: "2026-10-20T05:00:00Z"
    last_updated_by: "worker"
    recent_action: "Added the shell shim and stopped the nudge outside the loop"
    next_safe_action: "Merge worktree 158 to main"
    blockers: []
    key_files:
      - ".skilled/hooks/session-relaunch/lib/killer.cjs"
      - ".skilled/hooks/session-relaunch/tests/killer.test.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-013-live-hop-and-notice-reason"
      parent_session_id: null
    completion_pct: 75
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 013-live-hop-and-notice-reason |
| **Completed** | 2026-10-20 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

When the killer gives up, its desktop notice now tells you why. You no longer need `relaunch.log` to learn that your launch options were dropped.

### Phase 13: live-hop-and-notice-reason

The notice title reads `Session relaunch needs attention (killer timed out)`. When `SKILLED_LOOP_MANUAL_TEMPLATE` holds no note placeholder or more than one, the notice also carries a subtitle: `Manual template ignored:` followed by the reason the killer logs as `killer-manual-template`. A usable or unset template sends no subtitle. The subtitle is JSON-escaped the same way the command is, and the `osascript` call stays best-effort.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/hooks/session-relaunch/lib/killer.cjs` | Modified | Timeout title and template-problem subtitle |
| `.skilled/hooks/session-relaunch/tests/killer.test.cjs` | Modified | Subtitle present and absent assertions, title assertion |
| `.skilled/hooks/session-relaunch/README.md` | Modified | Notice title and subtitle |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-claude.md` | Modified | Title match and evidence for the timeout scenario, outside-loop and shim checks |
| `.skilled/bin/skilled-loop-shell.sh` | Created | Shell shim sourced by zsh or bash |
| `.skilled/hooks/session-relaunch/tests/skilled-loop-shell.test.cjs` | Created | Shim tests under bash and zsh |
| `.skilled/hooks/session-relaunch/lib/nudge.cjs` | Modified | `nudgeDecision` stays quiet outside the loop |
| `.opencode/plugins/session-relaunch.js` | Modified | Comment on the branch only a loop id without a record reaches |
| Adapter, nudge, OpenCode and Pi test files | Modified | Outside-loop cases, and a loop id where a test needs a nudge |
| READMEs, feature catalog entry and index, the other two playbook files, env reference, `/speckit:handoff` | Modified | Shim, symlinked repositories, nudge only inside the loop |

### Every session under the loop

A plain `claude` started in a repository that links `.skilled` used to receive the nudge, write a note, run prepare, exit 3 and stop, with nothing left to relaunch it. Now you add one line to `~/.zshrc` or `~/.bashrc`, `source /path/to/repo/.skilled/bin/skilled-loop-shell.sh`, and a plain `claude`, `pi`, `opencode`, `codex`, `hermes`, `devin` or `cursor-agent` on a terminal starts under the nearest wrapper. A symlinked `.skilled` counts. Subcommands, print and one-shot modes, version, help, piped launches and sessions already in a loop run the binary directly. Outside the loop no adapter nudges any more, so a session that was not started under the wrapper keeps working and auto-compaction stays the fallback. `/speckit:handoff` and prepare's exit 3 still serve an operator who asks for a manual handoff.

The pass-through lists come from each binary's `--help` on this machine. Claude passes `-p`, `--print`, `-v`, `--version`, `-h`, `--help`, `--bg`, `--background`, `--desktop` and `--cloud` and its subcommands from `agents` to `update`. Pi passes `-p`, `--mode`, `--export`, `--list-models`, `--blackhole-export`, version and help, and `install`, `remove`, `uninstall`, `update`, `list`, `config`, `auth` and `mcp`. OpenCode passes version, help and every subcommand from `completion` to `db`. Codex passes `-V`, `--version`, `-h` and `--help` and every subcommand except `resume` and `fork`. Hermes passes `-z`, `--oneshot`, `-Q`, `--quiet`, version and help, and every first word except `chat`. Devin passes `-p`, `--print`, `-V`, `--version`, `-h`, `--help` and `--cloud`, and any leading word, since that is a subcommand or a desktop path. Cursor passes `-p`, `--print`, `-v`, `--version`, `-h`, `--help` and `--list-models` and every subcommand except `agent`, `ls` and `resume`.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A worker in worktree 158 extended the two existing notice tests first and saw both fail on the current killer. It then changed `notifyManualClaim`, updated the README and the playbook scenario, reran the whole gate and swapped in the pre-phase killer to prove the tests red. The orchestrator runs the live hop.

A second worker wrote the outside-loop conformance case and the Pi mirror first and saw all five fail on the current core with the nudge text itself. It added the check to `nudgeDecision`, ran the whole gate, and gave a loop id to the tests that relied on a nudge outside the loop: 37 node tests and 10 Pi tests. Three Pi tests that had stopped testing anything (hop limit, held nudge at the cap, broken core) got one as well. It wrote the 14 shim tests, saw them fail with the shim absent, then built the shim from each runtime's `--help`. The drift guard flagged the shim for missing strict mode, so the resolver's body moved into a subshell under `set -uo pipefail`, which leaves the operator's shell options alone.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The timeout reason goes in the title, the template reason in the subtitle | The brief asked for no subtitle without a template problem, and every notice comes from `recordTimeout`, so the title can say it unconditionally |
| The title keeps its old prefix | The Claude playbook scenario and any operator filter match `Session relaunch needs attention` |
| No new test was added | The two existing notice tests already set up both cases; each gained the assertion it was missing |
| The loop check sits after the threshold check in `nudgeDecision` | Below-threshold tests keep their own reason, and the kill switch and session-id gates still run first in each adapter |
| Only the first argument counts as a subcommand | A later prompt word that matches one stays a prompt, and a wrongly wrapped subcommand only runs under a wrapper that relaunches nothing, while a wrongly passed-through session loses its hop |
| Codex `resume` and `fork`, Cursor `agent`, `ls` and `resume`, and `hermes chat` stay wrapped | Their help says they open an interactive session, so they need the hop as much as a bare launch |
| The resolver runs in a subshell under strict mode | The drift guard requires strict mode, and setting it in a sourced file would change the operator's shell |
| Two OpenCode tests were rewritten, not just given a loop id | One tested the outside-loop branch and now runs under a loop id that names no record, the only way left to reach it. The other tested note reuse through that branch and now asserts the reused note path inside the loop |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --test` on the concern's tests and the OpenCode plugin suite | PASS: 566/566, rc 0 (baseline 566/566) |
| Red swap of the pre-phase killer | FAIL as intended: 2 of 2 notice tests; restored, `cmp` rc 0 |
| `osacompile` on a title and subtitle line | PASS: rc 0 |
| Comment hygiene on the changed code and test | PASS: rc 0; a planted spec path in a scratch file gives rc 1 |
| Claude playbook timeout scenario | PASS |
| `validate_document.py` on the README and the playbook scenario | PASS: rc 0 each |
| Live Claude hop in tmux | PASS: loop 26027, prepare to relaunch in 7 s, note done. Forced timeout: `killer-timeout` after 33 s, record disarmed |
| Final gate after the shim and nudge changes | PASS: node 584/584 rc 0 (566 plus 4 conformance plus 14 shim), Pi vitest 40/40 rc 0, `tsc -p tsconfig.pi.json --noEmit` rc 0 |
| Red swap of HEAD's `nudge.cjs` and plugin, shim moved aside | FAIL as intended: 5 of 5 node cases, 1 of 1 Pi case, 14 of 14 shim tests. Restored, `cmp` rc 0 on all three |
| `shellcheck` on the wrapper and the shim, and `shellcheck -s bash` on the shim | PASS: rc 0 |
| Drift guards | PASS: 4 of 4, no warning in a changed file |
| Doc validators | PASS: `validate_document.py` rc 0 on every touched doc, playbook package 0 violations, catalog checker rc 0, mirror check rc 0 |
| Live hops through the shim in a repository that links `.skilled` | PASS from `AI Systems`: Claude, OpenCode, Hermes, Pi and Codex each relaunched and reached a done note. A plain `claude` outside the loop got no nudge |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **macOS may truncate a long subtitle.** The full reason stays in `relaunch.log` under `killer-manual-template`.
2. **A one-request first turn carries no nudge on OpenCode and Hermes.** Both add the nudge to the next request, so a session that crosses the threshold on its only request hands off on the following one. One Pi run claimed nothing before it was closed, and the rerun passed. Codex in a repository asks once to trust changed hooks before they run.
3. **The pass-through lists are a snapshot.** They come from each runtime's `--help` on 2026-10-20. A new subcommand passes into the wrapper until its list is updated, where it runs once and exits with its own code.
4. **An alias wins over the shim.** A `claude` alias in the shell profile keeps taking precedence, so remove it for the shim to apply.
<!-- /ANCHOR:limitations -->

---
