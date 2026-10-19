---
title: "Implementation Summary"
description: "Open with a hook: what changed and why it matters. One paragraph, impact first."
trigger_phrases:
  - "phase 6 closure evidence"
  - "session relaunch live round"
  - "deep review 2 remediation summary"
  - "relaunch gap register"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks/023-session-relaunch-loop/006-deep-review-2-remediation"
    last_updated_at: "2026-10-19T00:00:00Z"
    last_updated_by: "closure-pass"
    recent_action: "Recorded the closure evidence for phase 6"
    next_safe_action: "Orchestrator runs the continuity save for this packet"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:bee1fd3b4def90ab7de66f34e4a4dbc83e329b80587d8f6d0f53d5b728182e1b"
      session_id: "closure-006-deep-review-2-remediation"
      parent_session_id: null
    completion_pct: 100
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
| **Spec Folder** | 006-deep-review-2-remediation |
| **Completed** | 2026-10-19 |
| **Level** | 2 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The session relaunch loop now hops hands-free on all four runtimes. A session near its context limit writes a handoff note, ends, and is replaced by a fresh one that claims the note, answers it and closes it, with no operator keystroke in the round. Getting there took two different kinds of work: twelve advisories a static review could prove, and twenty-four gaps only a live session could reveal.

### Phase 6: deep-review-2-remediation

The round-2 review left twelve P2 advisories and no P0 or P1. Five groups: a log line that could truncate silently on a short write, a fallback state directory another user could own, four killer gaps around EPERM, a stale record at timeout, the ancestry check's position and a lock pinned by a reused pid, a shell list that missed fish and four other shells while duplicating a process-tree walk, and a repo-root resolver that read the generic `REPO_ROOT` differently in three places.

All twelve are fixed, each with a test that fails on the pre-phase library and passes on the final code. The resolver now lives in `lib/nudge.cjs` as `resolveRepoRoot` (`nudge.cjs:203`), and the CLI and the Pi adapter call it rather than owning a rule of their own.

The live playbooks then found what code review cannot. A receiver guessed the CLI syntax because a silent success reads like a command that never ran. A nudge asked an operator to answer it by hand on Pi. A re-nudge planned a second note and orphaned the first. Codex rejected two fallback envelope shapes. OpenCode dropped the seed text after the first turn, then dropped the completion step after the claim. Every one is registered as G1 to G25 in `spec.md` section 4.1, fixed with its own test, and proven in a live session.

The loop's own tooling grew a voice too: `prepare` now says the handoff is prepared and the session should stop, which is the single line that cut a Pi hop from three minutes to twenty-eight seconds.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs` | Modified | Throw on a short write, per-user fallback state dir with an ownership check, lock expiry read, a `ps` read bounded by a timeout, and the one `findLoopChildPid` walk |
| `.skilled/hooks/session-relaunch/lib/killer.cjs` | Modified | EPERM means the target is gone, re-read the record at timeout, record above the ancestry check, expiry-based takeover, hop-limit check before a signal, and the documented pid-reuse window |
| `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs` | Modified | Wider live-shell list, delegation to `core.findLoopChildPid`, a call to `nudge.resolveRepoRoot`, help and per-command usage, the prepared-handoff line and the hop-limit decline |
| `.skilled/hooks/session-relaunch/lib/nudge.cjs` | Modified | Owns `resolveRepoRoot`; open-note reuse, ratio wording, the seed text, `completeCommandFor` and the staleness-bounded `handoffPending` |
| `.skilled/hooks/session-relaunch/pi/session-relaunch.ts` | Modified | Calls the shared resolver, decides at `message_end`, delivers at `agent_end`, and delivers its nudge as a follow-up |
| `.opencode/plugins/session-relaunch.js` | Modified | Keeps the seed active until the note is claimed, then swaps in one completion reminder |
| `.skilled/hooks/session-relaunch/claude/context-nudge.mjs`, `claude/stop-arm.mjs`, `codex/shared.mjs`, `codex/stop-arm.mjs`, `hermes/context-nudge.mjs`, `hermes/session-end-arm.mjs` | Modified | Claude, Codex and Hermes follow the nudge state, the hop limit and the fallback envelopes |
| `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json` | Modified | Six session-relaunch rows carry the neighbours' envelope fallback instead of `none` |
| `.claude/settings.json`, `.codex/hooks.json` | Modified | Regenerated from the registry |
| `.skilled/hooks/session-relaunch/tests/*.test.cjs`, `pi/session-relaunch.test.ts`, `.opencode/plugins/tests/session-relaunch.test.cjs` | Modified | One named test per finding and per live gap |
| `.skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs`, `.skilled/hooks/post-edit-quality/lib/post-edit-router.cjs` | Modified | Version checks skip the gitignored `.state` runtime files and keep the tracked concern README |
| `.skilled/hooks/session-relaunch/README.md`, `.skilled/bin/README.md`, `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md` | Modified | The env rename, the install-root fallback and the non-shell detection limit |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-claude.md`, `session-relaunch-pi-opencode.md`, `session-relaunch-command-runtimes.md`, `.skilled/skills/system-spec-kit/feature-catalog/context-preservation/session-relaunch-loop.md` | Modified | Behavior updates and the pointer to where dated results live |
| `.skilled/skills/system-spec-kit/benchmark/reports/2026-10-19--manual-testing-playbook--session-relaunch-live-four-cli/` | Created | The thirteen runs made while the gaps were fixed, with the two early OpenCode failures |
| `.skilled/skills/system-spec-kit/benchmark/reports/2026-10-19--manual-testing-playbook--session-relaunch-final-code/` | Created | The final-code round: four runtimes, four PASS rows |
| `specs/hooks/023-session-relaunch-loop/006-deep-review-2-remediation/evidence/live-runs-2026-10-19/` | Created | 29 pane captures, relaunch logs and the launch commands for the live runs |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The work ran as one change per dispatch, on disjoint files, with the orchestrator re-running every suite outside the builder sandbox before it accepted a lane.

**Build lanes.** The code findings ran as B1 to B6 plus D1 and D2 (DeepSeek V4.1 Flash max through `cli-pi`). The fresh review rv3 then found seven P2s, fixed in a serial chain f1, f5, f2, f7, f3, f4, with the node suite climbing 391, 394, 395, 397, 399, 400 and `fail 0` after each. The live gaps ran as `g` lanes on disjoint files, and the docs as `d` lanes. The rv3 review was read-only on SWE with all four dimensions, including maintainability, and a reproducible `rg` search ledger.

**The red evidence.** A lint-first claim needs a run that fails. The working-tree test files ran against the HEAD `b830fd0276` library — the phases 001 to 005 code, before any change here — in a scratch mirror: 407 tests, 271 pass, 136 fail, exit 1. The failing list is the red record, and it names every 006 finding test and every live-gap test that has one. The per-lane red logs from the round-2 build lanes B1 to B6 were summarized in the run ledger, and the D1 and D2 lane logs were overwritten by later lanes of the same name, so the mirror run is the red evidence of record. It is the same method phase 009 established.

**The live method.** Each gap was reproduced in a real session on a real runtime, in tmux, with a clean env: Claude through its own hook, OpenCode through its plugin, Codex in a scratch clone that carries the worktree changes plus one `[projects]` trust entry, and Pi through its extension. Thirteen runs are recorded, 11 PASS and 2 FAIL, and the two failures are OpenCode runs 1 and 2 on earlier code, kept in the record rather than hidden. Later runs found G24 and G25, which is why the count kept moving. The phase closes on a final round with all four runtimes in parallel on the frozen code and no operator input at all.

**The record.** Dated live results belong in a benchmark run folder, not in a playbook, so the playbook page links to the run and the run folder carries `results.csv`, `source.md`, `README.md` and the outcome files. Raw pane captures and relaunch logs live in this folder's `evidence/live-runs-2026-10-19/`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep the resolver in `nudge.cjs` rather than the core | `resolveRepoRoot` is a nudge concern: the note path is the only thing that needs a repo root. Moving it into `relaunch-core.cjs` would have given the core a dependency it never uses. The CLI and the Pi adapter call the nudge export, so one rule still serves all three readers |
| Take the record read above the ancestry check and document the residual window | Node exposes no pidfd handle, so a pid reaped and reused between any check and the signal cannot be ruled out. Ordering the reads so the ancestry snapshot is last shrinks the window; the comment says so rather than implying the window is closed |
| Give the lock an expiry instead of trusting pid liveness | A reused pid looks like a live killer forever, which pins a loop. An expiry longer than the killer's own hold bound lets a contender take over, and an atomic takeover through a mutex means one winner |
| Close on a frozen-code live round, not on the last green unit run | Every gap in this phase came from a live session and none came from the suite. A unit-green state has already proven it can hide a broken round, so the bar is four runtimes finishing hands-free on code that has not changed since |
| Keep the gap numbers as dispatch labels, not finding ids | G1 to G25 describe what a live run saw, and several were fixed in the same file. Numbering them like review findings would imply a registry that does not exist; `spec.md` section 4.1 is their only home |
| Record G20, G21 and the OpenCode default model as limitations | All three are real, and none is this phase's code. Folding them into the packet's met work would misstate what the hook guarantees, so they are named as framework and runtime limitations with the observation that produced them |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Red mirror against HEAD `b830fd0276` | PASS as evidence: 407 tests, 271 pass, 136 fail, exit 1, with the failing list naming every 006 and live-gap test |
| Relaunch node suite and OpenCode plugin, final code | PASS: `tests 448`, `pass 448`, `fail 0`, exit 0 (re-run at closure) |
| Final gate, 18 steps | PASS: every step rc 0, overall rc 0 |
| Gate counts vs the phase 005 closure (375 / 62 / 21 / 7 / 0 / 0 / 4 of 4) | PASS, every count at or above: node 448/448, pytest 62, Pi relaunch vitest 27/27, registration vitest 7/7, tsc 0, shellcheck 0, drift guards 4/4 |
| Gate extras | PASS: hook-sync 0, runtime mirrors 0, hermes prompts 0, OpenCode plugin import ok, deep-review node 34/34, verify-iteration 31/31, extract-structure 4, readme-manifest PASS, post-edit-router 0, frontmatter-version 0, adapter parity 128/128 |
| Fresh review rv3 | PASS with findings: 0 P0, 0 P1, 7 P2, all seven confirmed by a code read and fixed; none of the twelve original findings reopened |
| Live round 9, frozen code, all four in parallel | PASS: Claude loop 78793 (prepare to SIGTERM 8 s), OpenCode 78816 (13 s), Codex 78834 (16 s, scratch clone), Pi 78800 (28 s). Every receiver claimed, answered and completed its note; zero operator prompts; every wrapper exit 0 |
| Benchmark run folders | PASS: `...session-relaunch-final-code/results.csv` four PASS rows; `...session-relaunch-live-four-cli/results.csv` thirteen rows, 11 PASS and 2 FAIL on earlier OpenCode code |
| Live evidence captured | PASS: 29 files in `evidence/live-runs-2026-10-19/`, covering pane captures, relaunch logs and `launch-commands.txt` |
| Comment hygiene on the changed code | PASS: `check-comment-hygiene.sh` over the 34 changed code files selected from `git status`, exit 0, no finding or packet ids in a comment |
| Codex config restored | PASS: `~/.codex/config.toml` md5 `6ab868eb912ac9d307d5761bf93209ea`, byte-identical to the pre-run backup, no clone trust entry left |
| `repair-derived.cjs --folder <006> --apply` | PASS: exit 0 |
| `validate.sh <006> --strict` | PASS: `RESULT: PASSED`, `Summary: Errors: 0`, exit 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **G20: the framework Gate 3 question reaches a live read-only session.** A live session that never answered Gate 3 is asked it before the handoff note is written, which is a framework prompt and not a hook prompt. It lives in the AGENTS.md gate rules, so the fix belongs to the framework rather than to this loop. Workaround: answer the prompt once, or start the live session with a Gate 3 answer already carried.

2. **G21: the Gate 2 artifact trigger routes the handoff note through sk-doc.** The trigger fires on the first `.md` write, and the sk-doc router answers with a clarify, which stalls a session whose only job is one note. Also a framework behavior. Workaround: the same as G20, answer the clarify or scope the session so the trigger does not apply.

3. **The OpenCode default model fails provider routing.** The default (MiMo through the LLM Gateway) answers "Direct provider routing is not available", so every OpenCode live run selects `openai/gpt-6-luna` explicitly. The loop's code is not involved; a different default model or a fixed gateway would close it.

4. **A linked worktree shows a `[codex-hooks] drift detected` notice at session start.** It is pre-existing and untouched by this phase: `install-codex-hooks.mjs --check` refuses linked worktrees. Every Claude session in this worktree prints it, and it does not affect the loop.

5. **The Pi wrapper exit is not printed in run 8.** Run 8's tmux session was killed before the wrapper printed its exit code; run 5 and run 9 both show a Pi wrapper exit 0 with the decline no-file path, and run 8 left no orphan process. The clean-code round closes it rather than a re-run of the intermediate code.

6. **The code is uncommitted by instruction.** This phase may not commit, push or stash, so the final code is pinned by the frozen worktree state plus `file:line` for every named test and a run folder for every live run, not by a commit SHA. The pre-phase baseline is the explicit HEAD `b830fd0276`.
<!-- /ANCHOR:limitations -->
