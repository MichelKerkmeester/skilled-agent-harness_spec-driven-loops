---
title: "Implementation Summary"
description: "A looped session now plans, prepares and consumes its handoff note under one root whichever checkout's CLI it runs. A note that still lands elsewhere is named with a claim command that works, and two checkouts on one machine keep their own wrappers trusted."
trigger_phrases:
  - "cross checkout root pinning implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-handover/002-session-handover-loop/055-cross-checkout-root-pinning"
    last_updated_at: "2026-11-17T19:35:53Z"
    last_updated_by: "generate-context"
    recent_action: "Implemented six cross-checkout relaunch fixes with failing-first tests"
    next_safe_action: "Review the worktree diff, then commit and merge through sk-git"
    packet_purpose: "Purpose: A looped session plans, prepares and consumes its note under one root whichever CLI copy it runs, and a note that still lands elsewhere is named with a claim command that works."
    blockers: []
    key_files:
      - ".skilled/bin/skilled-loop"
      - ".skilled/bin/skilled-loop-shell.sh"
      - ".skilled/hooks/session-handover/bin/session-handover.cjs"
      - ".skilled/hooks/session-handover/lib/nudge.cjs"
      - ".skilled/hooks/session-handover/runtime-behavior.md"
    session_dedup:
      fingerprint: "sha256:d7bb321418831f9fd3267f40a35ee57c7bcac78dd5a34011d0261ed22c7ad20b"
      session_id: "scaffold-055-cross-checkout-root-pinning"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "3ae3d8e4-7b9e-4e6b-a563-896588eb48b6"
      workspace: "/Users/michelkerkmeester/worktrees/public/461-handover-cross-checkout-root"
      savedAt: "2026-11-17T19:35:53Z"
      locatorKind: "transcript_path"
      version: 1
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 055-cross-checkout-root-pinning |
| **Completed** | 2026-11-17 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A session that hands over now finds its note again even when it ran another checkout's hand-over CLI. Before, the wrapper called that note missing, stopped the hop and printed nothing to paste.

### Phase 55: cross-checkout-root-pinning

The wrapper exports `SESSION_HANDOVER_REPO_ROOT` as its own real checkout root before the first launch. Every CLI copy already reads its root from that variable, so a session working in a project with a vendored copy writes its note where the wrapper looks. A caller's own value is kept, and a value inherited from an outer loop is replaced. The commands the adapters print now name the CLI by its absolute path, so they also run from a subdirectory.

When a note still lands outside the loop's root, `consume` reports `outside-root` with both roots instead of `missing`. The wrapper names the note and the two roots and prints a claim command that starts with `SESSION_HANDOVER_REPO_ROOT=<note root>`. In the shell, a second checkout's shim keeps the first checkout trusted, and a pasted `skilled-loop` runs the wrapper for the checkout you stand in.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/bin/skilled-loop` | Modified | Pin the root, name an outside note with a pinned claim command |
| `.skilled/bin/skilled-loop-shell.sh` | Modified | Keep an earlier checkout trusted, prefer the current directory's trusted wrapper |
| `.skilled/hooks/session-handover/bin/session-handover.cjs` | Modified | `outside-root` consume state with `repo_root` and `note_root` |
| `.skilled/hooks/session-handover/lib/nudge.cjs` | Modified | Absolute `CLI_COMMAND`, cancel command built from it |
| `.skilled/hooks/session-handover/claude/handover-stop-arm.mjs` | Modified | Cancel notice built from `CLI_COMMAND` |
| `.skilled/hooks/session-handover/tests/skilled-loop-wrapper-repo-root.test.cjs` | Created | Root pinning and outside-root cases |
| `.skilled/hooks/session-handover/tests/` (five files) | Modified | Two-checkout shim cases, consume and command expectations, harness records the root |
| `.skilled/bin/README.md`, `.skilled/hooks/session-handover/runtime-behavior.md`, `handoff-protocol.md`, `troubleshooting.md`, `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md` | Modified | The pinned root, the outside-root state, the trust carry and the marked startup block |
| `.skilled/hooks/decision-capture/bin/sweep-transcript.mjs` and its test | Modified | The save's decision sweep reads transcripts under `CLAUDE_CONFIG_DIR` when it is set |
| `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify_alignment_drift.py` and its test | Modified | A shell file whose header gives `source` as its usage is exempt from the strict-mode rule |
| `.opencode/plugins/tests/session-handover.test.cjs` | Modified | Expects the save step's writer by its absolute path |
| `.skilled/changelog/skilled/v4.1.0.0.md` | Modified | Five handover fixes and the sweep fix under Smaller fixes, the startup block under Upgrade Notes, this folder in the spec-folder list |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Each fix started with a test run against the unchanged code. The two-checkout shim tests failed 4 of 4. The root tests failed 3 of 4 with the reported `warning: the handoff note is missing; not relaunching`. The command tests failed with exit 1 from outside the checkout. After each change the same tests passed, then the three suites ran in full and were compared with their baselines. The work sits uncommitted in the worktree `worktrees/461-handover-cross-checkout-root`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Pin the root in the wrapper rather than change each adapter | Every root read goes through `resolveRepoRoot()`, which already honors the variable, so one export reaches every CLI copy |
| Replace a root inherited while `SKILLED_LOOP_ID` is set | That value belongs to the outer loop's checkout, and keeping it would send notes there |
| Leave an outside note unread in consume | The loop's root does not vouch for the path, so consume names the roots and leaves the claim to the note's own root |
| Make the absolute path the module's one `CLI_COMMAND` | Every adapter already passes that constant, so the change reaches Claude, Codex, Pi, OpenCode and Vibe without editing each one |
| Keep the shim free of top-level strict mode, and exempt it in the checker by its header | It is sourced into the operator's shell. The checker only looked at the first 80 lines and exempted sourced files by path, so the shim had passed by accident |
| Name the continuity writer by absolute path too | The writer finds its repository from the working directory, so the absolute script path only removes the subdirectory failure |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --test .skilled/hooks/session-handover/tests/*.test.cjs` | PASS, 1065 of 1065 (baseline 1055 of 1055) |
| `node --test .opencode/plugins/tests/session-handover.test.cjs` | PASS, 75 of 75 (baseline 75) |
| `npx vitest run --config hooks/vitest.config.ts` from `.skilled` | PASS, 509 of 509 (baseline 509) |
| `shellcheck` on the wrapper and the shim | Same findings as the unchanged files: 1 info and 3 SC1007 warnings |
| `validate_document.py` on the four edited docs | No new issues. `bin/README.md` reports 0 |
| `run-all-drift-guards.sh` | FAIL on main and here with the same 11 errors, none from this change |
| `python3 test_verify_alignment_drift.py` | PASS, 38 tests (baseline 37) |
| Decision-capture suites | PASS, 145 of 145. The sweep's new case failed first |
| `check_changelog_shape.py` and `hvr_scan.py` on v4.1.0.0 | PASS, 0 hard blockers, 63 spec folders listed |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A note prepared before the upgrade can still be outside.** A loop started on the old wrapper has no pinned root. Its outside note now prints the pinned claim command, so paste that command to continue.
2. **An earlier checkout's external worktrees are not trusted.** Only the last-sourced checkout's linked worktrees are listed. Add another one to `SKILLED_LOOP_TRUSTED_CHECKOUTS` by hand.
<!-- /ANCHOR:limitations -->

---
