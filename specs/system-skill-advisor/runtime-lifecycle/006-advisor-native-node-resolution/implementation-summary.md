---
title: "Implementation Summary"
description: "The advisor now starts on the Node that ran its install when a session uses another Node major. A cold first call under Node 22 against a Node 26 install exits 0 where it exited 75."
trigger_phrases:
  - "advisor native node resolution implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/runtime-lifecycle/006-advisor-native-node-resolution"
    last_updated_at: "2026-11-13T18:11:46Z"
    last_updated_by: "generate-context"
    recent_action: "Committed, merged to main and pushed; recorded operator decisions"
    next_safe_action: "Verify Barter re-pins and drops its overlay for this fix"
    blockers: []
    key_files:
      - ".skilled/bin/skill-advisor.cjs"
      - ".skilled/skills/system-skill-advisor/runtime/package.json"
      - ".skilled/bin/tests/skill-advisor-node.test.cjs"
    session_dedup:
      fingerprint: "sha256:6abed960891d368d628b4e3360ae9f5567053e473f25d71025edb4540d842d0c"
      session_id: "scaffold-006-advisor-native-node-resolution"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "af01c830-4ea5-4abe-b6ed-dd0c4d9b1b45"
      workspace: "/Users/michelkerkmeester/MEGA/Development/Skilled"
      savedAt: "2026-11-13T18:11:46Z"
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
<!-- FILL: Fill the folder name, the completion date and the level. Use the real date. GOOD: `004-rotate-logs-keep`. Completed 2026-10-24. Level 1. WEAK: Folder: TBD. -->

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-advisor-native-node-resolution |
| **Completed** | 2026-11-13 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A first advisor call now works from a session on a different Node major than the install. Under Node 22 against a Node 26 install, a cold `advisor_status` call exits 0 where it exited 75 with `daemon launcher exited with code 1`.

### Start the skill advisor on the Node its native database module was built for

You can open a project whose Node pin differs from the Node that installed the advisor and still get advisor results on the first prompt. The install records its Node, and the wrapper starts the CLI, the launcher and the daemon on that Node whenever the session's ABI differs.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-skill-advisor/runtime/package.json` | Modified | `postinstall` script that writes `node_modules/.advisor-node` |
| `.skilled/bin/skill-advisor.cjs` | Modified | `advisorNode`, the spawn on its result, the guarded entrypoint and the export |
| `.skilled/bin/tests/skill-advisor-node.test.cjs` | Created | Four cases for the Node choice |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A DeepSeek V4.1 Flash worker at max effort made the three file edits from the literal text in `plan.md`. The orchestrating session read the diff, ran the new test, reinstalled and rebuilt the runtime, read the record, repeated the Node 22 cold start on a private socket, stopped the launcher it started and ran both suites. Nothing is committed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Record the Node at install time | The engines range admits three majors and the built module matches one, so the range cannot name the right Node |
| Make the choice in the wrapper only | Every caller reaches the daemon through `skill-advisor.cjs`, and the CLI and the launcher pass their own Node on |
| Keep the session's Node when the recorded binary is gone | A client still works against a running daemon, so failing the call would break a case that works today |
| Use the record path and shape Barter's overlay reads | Barter can drop its overlay on a re-pin without changing its installer first |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Cold `advisor_status` under Node 22.23.4, private socket, before | exit 75, `backend unavailable: daemon launcher exited with code 1` |
| Same command after | PASS, exit 0, `"status": "ok"`. The launcher ran on `v26.13.0/bin/node` |
| `cat node_modules/.advisor-node` after `npm ci` | `{"execPath":"/Users/michelkerkmeester/.nvm/versions/node/v26.13.0/bin/node","modules":"147"}` |
| `node --test .skilled/bin/tests/skill-advisor-node.test.cjs` | PASS, 4 passed of 4 |
| `node --test .skilled/bin/tests/` | PASS, 180 tests, 179 passed, 0 failed, 1 skipped. Baseline 173 tests, 0 failed |
| `npx vitest run` in the runtime | PASS, exit 0, 1722 tests, 1716 passed, 6 skipped |
| Launchers left after the check | 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No advisor suite baseline was taken in this worktree before the edits.** T002 was skipped. The comparison figure is the run on main earlier the same day, 1722 tests with 1716 passed, recorded in `scratch/baseline.txt`.
2. **The record describes the last install.** Rebuilding the native module by hand under another Node leaves the record wrong. Reinstall the runtime to correct it.
3. **An install made before this change has no record.** It behaves as before until the runtime is reinstalled.
4. **The cold start was checked under Node 22 only.** Node 24 fails to load the module the same way before the change, and its cold start after the change was not run.
<!-- /ANCHOR:limitations -->

---
