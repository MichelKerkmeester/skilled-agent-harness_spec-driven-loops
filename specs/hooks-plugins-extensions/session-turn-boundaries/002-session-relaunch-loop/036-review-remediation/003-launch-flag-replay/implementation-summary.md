---
title: "Implementation Summary: A hop replays the first launch's options"
description: "A relaunch now carries every option the session was started with, such as a permission mode, a sandbox or an extra directory, instead of only the model, effort and name, so a restriction or an unattended setting survives every hop."
trigger_phrases:
  - "launch flag replay implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/036-review-remediation/003-launch-flag-replay"
    last_updated_at: "2026-11-12T12:05:36Z"
    last_updated_by: "generate-context"
    recent_action: "Closed the phase after five fix passes and an SWE review"
    next_safe_action: "Verify nothing; phase closed"
    blockers: []
    key_files:
      - ".skilled/bin/skilled-loop"
      - ".skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs"
      - ".skilled/hooks/session-relaunch/README.md"
    session_dedup:
      fingerprint: "sha256:d5aa060fa8ed55864e109619bc9fdb15abcf02fd3cc822215deec3dec39d7afd"
      session_id: "scaffold-003-launch-flag-replay"
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
| **Spec Folder** | 003-launch-flag-replay |
| **Completed** | 2026-11-12 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A session you start with `--permission-mode plan`, a sandbox setting or an extra directory now keeps that option after a hop. Before this phase the wrapper rebuilt a hop from the model, effort, name, provider and Pi extensions alone, so every other launch option was lost and a restricted session continued without its restriction.

### Phase 3: launch-flag-replay

The wrapper now reads the first launch's argument list once and keeps every option with its values, in order. A hop is today's list for the record-backed settings and the claim seed, followed by those options, or before the `--` separator on Devin. A hop with no extra option is the list it was before.

Three things stay out. The start prompt is replaced by the seed. The settings the relaunch record supplies are emitted once, from the record. The flags on the deny list, which pick, continue, fork or place a session or carry the start prompt, are never repeated. When the wrapper cannot tell whether a word is an option's value or your start prompt, it warns at launch, starts no new session at the hop and prints the manual claim command, because a wrong guess would either hand the seed to that option or rerun the old prompt.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/bin/skilled-loop` | Modified | Adds four per-runtime option tables, a scan that collects the replayed options, the append in `build_relaunch_arguments` for a hop, the Codex config-model capture and the decline for an ambiguous launch |
| `.skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` | Modified | Adds one replay case per runtime arm, the six-arm deny-list case, the record-settings case, the ambiguity case and five input-class cases, and updates one OpenCode expectation |
| `.skilled/hooks/session-relaunch/README.md` | Modified | The wrapper paragraph states the replay rule, the deny list and the ambiguous case |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Luna built the change through `codex exec` in six passes, each test first, and the orchestrator reran every command outside the builder's sandbox, which blocks `ps`. The first failing run is `scratch/red-2.txt`: 9 new tests, 0 pass, 9 fail. The orchestrator's read of the first diff found that every Codex `-c` setting was dropped, that single-value options were treated as repeating and that unknown options were lost, and compared both option tables with all six saved help texts in `scratch/help/` by script. SWE then reviewed the diff read-only through Devin and returned CONDITIONAL with four P1 and four P2. All four P1 and three P2 were confirmed and fixed, with failing runs in `scratch/red-3.txt`, `scratch/red-4.txt`, `scratch/red-5.txt` and `scratch/red-7.txt`. The final runs are `scratch/green.txt` for the wrapper file and `scratch/green-full.txt` for the relaunch suite. The evidence is pinned to the diff range `5dafa313e8..working tree` on branch `worktrees/351-session-relaunch-review-remediation`. Nothing is committed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The replayed options follow the seed instead of replacing the prompt in place | A seed placed before them cannot be read as one more value of a repeating option such as Claude `--add-dir`, and a hop without extra options stays byte for byte what it was |
| Two tables per runtime, taken from each runtime's `--help` | Finding the start prompt needs to know which options take a value, and the shim already keeps its lists the same way |
| An ambiguous launch declines the hop | Guessing wrong either gives the seed to an option or reruns the old prompt, and the manual claim command is a safe way on |
| An unknown option replays as written | A runtime gains flags faster than the tables, and dropping one silently is the defect this phase fixes |
| Codex `-c model=` is carried as the model, never replayed | A hop must not name a model twice, and the launch would otherwise lose a model given only through config |
| An optional value never takes a token that starts with a dash | `--debug --continue` would otherwise replay a deny-listed flag as a value |
| OpenCode's project path is dropped like other positionals | The wrapper changes to the recorded working directory before the hop, so the path is already applied |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --test .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` | PASS: 181 tests, 181 pass, 0 fail, exit 0, in `scratch/green.txt` (103 cases before the phase, 118 after) |
| The nine new cases before the fix | FAIL as required: 9 tests, 0 pass, 9 fail in `scratch/red-2.txt` |
| `--test-name-pattern 'first launch arguments are replayed'` | PASS: 6 pass, 0 fail |
| `--test-name-pattern 'deny list'` | PASS: 1 pass, 0 fail, one case that loops over six arms |
| The four review input classes and the optional-value case | PASS: 4 pass and 1 pass, 0 fail |
| `--test-name-pattern 'manual command'` and `'placeholder'` | PASS: 18 pass and 4 pass, 0 fail, so the manual claim command is unchanged |
| `bash -n .skilled/bin/skilled-loop` | PASS: exit 0, and 9 lines over 100 columns, the count before the phase |
| Both option tables against the six saved help texts | One difference: Claude `--cloud` is listed without a value. It is deny-listed, so nothing changes on a hop |
| `rg -c 'deny list' .skilled/hooks/session-relaunch/README.md` | PASS: prints 1 |
| Relaunch suite, OpenCode plugin suite and Pi vitest suite | PASS: 846 of 846 in `scratch/green-full.txt`, 65 of 65 and 59 of 59, each exit 0 |
| SWE review through Devin, read-only | CONDITIONAL, then all four P1 and three P2 fixed. One P2 stays open as limitation 2 |
| `validate.sh --strict` on this packet | RESULT: PASSED |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The tables go stale as the runtimes add options.** A new option that takes a value and is followed by a bare word makes the wrapper decline the hop and print the manual claim command. Add the option to the table for that runtime in `.skilled/bin/skilled-loop`.
2. **A subcommand's own options are replayed into the root command.** The scan drops every positional, including a subcommand word such as Codex `exec`. The Codex `resume` and `fork` flags are deny-listed, other subcommand-only flags are not. The shell shim never wraps those subcommands, so this needs a direct `skilled-loop` call.
3. **The manual claim command still carries only the record-backed settings.** This phase left its documented shape alone. After a declined hop, add the other launch options back by hand.
4. **Claude `--cloud` sits in the no-value table.** The help lists an optional value. The flag is deny-listed and positionals are dropped, so a hop is the same either way.
<!-- /ANCHOR:limitations -->

---


