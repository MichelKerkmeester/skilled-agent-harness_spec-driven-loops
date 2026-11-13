---
title: "Implementation Summary"
description: "The README and the Claude playbook now describe what phases 009 to 016 shipped or declined, and the live hop harness removes a session folder the runtime writes back."
trigger_phrases:
  - "handover docs and harness implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/017-handover-docs-and-harness"
    last_updated_at: "2026-11-13T13:50:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Wrote the README sections and playbook checks and fixed the harness late write"
    next_safe_action: "None, the phase is complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-017-handover-docs-and-harness"
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
| **Spec Folder** | 017-handover-docs-and-harness |
| **Completed** | 2026-11-13 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The session-relaunch README and the Claude relaunch playbook now say what the eight phases before this one changed about a hop, and what two of them decided not to build. The live hop harness no longer leaves a sandbox session folder behind when the runtime writes it back after the delete.

### Phase 17: handover-docs-and-harness

You can now read in one place what a hand-over names or carries: the note lines for running workers, schedules and added directories, the permission mode, the session name, the Pi mode, the hold on OpenCode while a sub-agent is busy, and the notice a deferred Claude hop prints. The README also says that a walk over the runtime's descendants and a claim line in the goal start prompt were declined, each with its reason.

The playbook gained a `Hand-Over State Checks` section. Seven checks each run the tests one shipped behaviour added, by title. The eighth is a live hop that starts a backgrounded worker before `prepare` and shows the worker outliving the sender.

`finish-run.sh` used to delete the runtime's project folder once. A receiver that was still shutting down could write the folder back. The script now watches the folder for `FINISH_SETTLE_S` seconds, 15 by default, removes it on each late write and exits 1 when it is still there at the end.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/hooks/session-relaunch/README.md` | Modified | Sections for the behaviour of phases 009 to 016, and the corrected sentence on where a hop's settings come from. |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-claude.md` | Modified | HS-1 to HS-8, two source rows, one sentence in GR-1, version 1.0.22.0. |
| `028-goal-rebind-live-proof-and-docs/scratch/harness/finish-run.sh` | Modified | The settle window and the repeated removal. |
| `028-goal-rebind-live-proof-and-docs/scratch/harness/test-finish-run.sh` | Created | Two cases: a late write, and an empty `project-dir.txt`. |
| `scratch/` | Created | The red and green test runs, the seven check runs, the late-write look and the live worker hop. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The documents were written by `dsh` briefs on DeepSeek V4.1 Flash, one closed phase per brief, each told that the code wins over a phase document. The orchestrator read both diffs, checked the named flags, log lines and functions against the source, and ran every command the playbook section gives.

The harness fix was built test first. The test failed against the old script, passes against the new one, and fails again when the old script is put back.

An Opus sub-agent ran the two live checks on Claude Code 2.1.323. The late-write look ran the old script from an export of the commit before the fix. The worker hop ran the fixed script.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| A settle window, not a wait on a process id | The harness keeps only processes whose command line names the sandbox, and the runtime's does not, so there is no pid to wait on. |
| Exit 1 when the folder is still there | A run that leaves session state behind must not look clean. |
| One suite check per shipped behaviour | Each names the tests its phase added, so a later change that breaks one behaviour fails one check. |
| No check for a declined change | There is nothing to run. The README carries the reason. |
| Other runtimes' behaviours are named, not checked here | The OpenCode and Pi changes belong to the Pi and OpenCode playbook. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `bash .../harness/test-finish-run.sh` | Two `ok - ` lines, then `ok`, exit 0. Against the old script: `FAIL: project folder still present`, exit 1 |
| Seven playbook suite commands | Each exit 0 with `fail 0` (`scratch/hs-checks.txt`) |
| `validate_document.py` on the README and the playbook | `VALID`, `Total issues: 0` for both |
| Playbook version | 1.0.21.0 to 1.0.22.0, `frontmatter-version.mjs bump --base HEAD --check` exit 0 |
| Live worker hop | `PREPARE.exit: 0`, worker on parent pid 1, note claimed and done, `No such file` 15 s after `finish-run.sh` |
| Scope | Only the README, the playbook, `finish-run.sh` and `test-finish-run.sh` changed outside spec folders |
| Strict validation | `RESULT: PASSED` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The one planned look did not show the late write.** With the old script the folder stayed gone in that run. The write was seen in three of phase 016's ten goal hops, which is the evidence the fix rests on.
2. **The fixed script was not seen removing a late write live.** The worker hop ended with no folder and nothing on stderr, so no late write happened in it. The test is what shows the second removal.
3. **The playbook's helper link was not run live.** The live worker hop used a copy of the harness folder to give the patched script its helper.
4. **The Pi and OpenCode playbook has no checks for phases 013 and 015.** This phase names where they belong and does not write them.
<!-- /ANCHOR:limitations -->

---
