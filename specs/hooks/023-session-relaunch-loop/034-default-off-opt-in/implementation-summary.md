---
title: "Implementation Summary"
description: "Session relaunch hooks now ship off and run only when SYSTEM_SESSION_RELAUNCH_ENABLED is set, while every other hook concern stays on by default."
trigger_phrases:
  - "default off opt in implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks/023-session-relaunch-loop/034-default-off-opt-in"
    last_updated_at: "2026-10-25T19:20:00Z"
    last_updated_by: "closeout-worker"
    recent_action: "Added the Hermes file opt-in test and verified all eleven acceptance criteria"
    next_safe_action: "Commit the worktree diff when the operator approves"
    blockers: []
    key_files:
      - ".skilled/hooks/shared/hook-flags.cjs"
      - ".skilled/hooks/shared/hook-flags.sh"
      - ".skilled/hooks/shared/hook-flags.test.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-034-default-off-opt-in"
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
| **Spec Folder** | 034-default-off-opt-in |
| **Completed** | 2026-10-25 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A fresh clone no longer gets context nudges, Stop arming or the Claude compact pointer. The session-relaunch hooks now stay off until you set `SYSTEM_SESSION_RELAUNCH_ENABLED=1`, and every other hook concern keeps running by default.

### Session relaunch hooks off by default, opt in with SYSTEM_SESSION_RELAUNCH_ENABLED

The shared resolver gained a default-off concern map with one entry, `session-relaunch` to `SYSTEM_SESSION_RELAUNCH_ENABLED`. You turn the handover on in `.skilled/hooks/hook-flags.env` or the environment, and the environment wins for the same key. `SYSTEM_SESSION_RELAUNCH_DISABLED` and the master switch still turn it off, even with the enable flag set. The `.mjs` and `.ts` readers re-export the same function, and the shell reader carries the same rule.

If you used the handover before, add `SYSTEM_SESSION_RELAUNCH_ENABLED=1` to your own `hook-flags.env` after this lands, or the loop goes quiet and auto-compaction takes over again.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/hooks/shared/hook-flags.cjs` | Modified | `DEFAULT_OFF` map and the enable check after the kill switches |
| `.skilled/hooks/shared/hook-flags.mjs` | Modified | Exports `DEFAULT_OFF` |
| `.skilled/hooks/shared/hook-flags.ts` | Modified | Exports `DEFAULT_OFF` with its type |
| `.skilled/hooks/shared/hook-flags.sh` | Modified | `hook_enabled session-relaunch` also needs the enable flag |
| `.skilled/hooks/shared/hook-flags.test.cjs` | Modified | Six new resolver tests: default off, env, file, kill switch, facades, node and shell parity |
| `.skilled/hooks/session-relaunch/tests/*.test.cjs` | Modified | Sandboxes opt in; new silence tests in `claude-adapters.test.cjs` and `session-relaunch-cli.test.cjs`; a production-shape Hermes arm test in `hermes-adapters.test.cjs` that opts in through the flags file only |
| `.opencode/plugins/tests/session-relaunch.test.cjs` | Modified | Opts in |
| `.skilled/hooks/session-relaunch/pi/session-relaunch.test.ts` | Modified | Opts in |
| `README.md`, `.env.example`, `.skilled/hooks/hook-flags.env.example` | Modified | Name the enable flag as the way on and the kill switch as the way off |
| `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md`, `.skilled/commands/doctor/assets/doctor-env.yaml` | Modified | New `SYSTEM_SESSION_RELAUNCH_ENABLED` row; `hook-flags.env` is an eligible destination for enable flags |
| `.skilled/hooks/session-relaunch/README.md`, `.skilled/hooks/shared/README.md`, `.skilled/hooks/README.md` | Modified | Switch tables and the default-off rule |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-*.md` (3 files) | Modified | Every live command sets the enable flag |
| `specs/hooks/023-session-relaunch-loop/028-goal-rebind-live-proof-and-docs/scratch/harness/run-hop.sh` | Modified | Sender launch line and `prepare` call set `SYSTEM_SESSION_RELAUNCH_ENABLED=1` |
| `specs/hooks/023-session-relaunch-loop/028-goal-rebind-live-proof-and-docs/scratch/harness/run-codex.sh` | Modified | Sender launch line sets `SYSTEM_SESSION_RELAUNCH_ENABLED=1` |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The new tests were written first and failed on the old resolver: 5 of 27 hook-flags tests (`scratch/red-flags.txt`, exit 1) and 2 of 3 adapter tests (`scratch/red-adapters.txt`, exit 1). The Hermes file opt-in test was proven red by removing the `DEFAULT_OFF` entry, which made the empty-file case arm (`scratch/red-hermes-arm.txt`, exit 1); the resolver was then restored and `cmp` against the backup exited 0. After the change every gate was rerun at closeout from the final worktree state, with outputs saved under `scratch/closeout-*.txt`. Nothing is committed: the evidence is the uncommitted diff on top of `933d71235f` in worktree `225-session-relaunch-default-off`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Leave `hermes/session-end-arm.mjs` unchanged | Its entrypoint calls `armPendingRecord(payload)` with no env seam, so the resolver reads the file. The test at `hermes-adapters.test.cjs:606` arms with the flag only in the file and arms nothing with an empty file |
| Check the enable flag after the kill switches | A kill switch or the master switch must win over the opt-in, so the enable check runs only once nothing has disabled the concern |
| Opt the existing tests in through their sandbox env | One line per sandbox keeps every existing assertion as it was |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --test .skilled/hooks/shared/hook-flags.test.cjs` | PASS, 27/27, exit 0 (baseline 21) |
| Same, with `SYSTEM_SESSION_RELAUNCH_ENABLED=1` in the shell | PASS, 27/27, exit 0 |
| `node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/session-relaunch.test.cjs` | PASS, 872/872, exit 0 (baseline 868) |
| `npx vitest run --config .skilled/hooks/vitest.config.ts .skilled/hooks/session-relaunch/pi/session-relaunch.test.ts` | PASS, 54/54, exit 0 (baseline 54) |
| `bash -n` on `run-hop.sh` and `run-codex.sh` | PASS, both exit 0 |
| Resolver one-liner | default off `false`, with the flag `true`, flag plus kill switch `false`, `spec-gate` default `true` |
| Four-reader probe, seven rows | 0 mismatches across `.cjs`, `.mjs`, `.ts` and `.sh` |
| Doc grep, 11 files | The flag is named in every file; no line says session-relaunch is on by default |
| Acceptance criteria | 11 of 11 Met |
| `validate.sh --strict` | `RESULT: PASSED` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **`prepare` outside the loop.** It still prints the manual claim command before it checks the concern, as spec.md section 10 leaves open.
2. **Operators who used the loop.** After the merge their checkout goes quiet until they add `SYSTEM_SESSION_RELAUNCH_ENABLED=1` to `hook-flags.env`.
<!-- /ANCHOR:limitations -->

---

