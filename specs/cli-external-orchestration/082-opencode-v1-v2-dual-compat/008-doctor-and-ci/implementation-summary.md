---
title: "Implementation Summary"
description: "A two-version doctor battery now proves, on OpenCode 1.19.3 and 2.0.32, that every repo plugin loads and is active and that the repo's skills are visible, with a CI workflow that runs it per pinned version."
trigger_phrases:
  - "doctor and ci implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/082-opencode-v1-v2-dual-compat/008-doctor-and-ci"
    last_updated_at: "2026-10-19T00:40:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Closed the phase docs from the live battery runs"
    next_safe_action: "Phase complete. Start phase 009, sk-code-opencode alignment"
    blockers: []
    key_files:
      - ".skilled/commands/doctor/scripts/opencode-version-battery.cjs"
      - ".skilled/commands/doctor/scripts/tests/opencode-version-battery.test.cjs"
      - ".skilled/commands/doctor/scripts/git-setup-check.cjs"
      - ".skilled/command-support/doctor/scripts/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-008-doctor-and-ci"
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
| **Spec Folder** | 008-doctor-and-ci |
| **Status** | Complete |
| **Completed** | 2026-10-19 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The repo can now prove, with one command, that its OpenCode plugins work on each pinned version, and CI can run the same proof per version.

### Phase 8: doctor-and-ci

`opencode-version-battery.cjs` picks the binary for each family from its parsed `--version`, never from its name. On OpenCode 1 it checks discovery, every top-level plugin file listed by `debug config`, and load, an import harness that loads each plugin through its v1 entry in a child process. On OpenCode 2 it starts its own private `serve` on a free loopback port with a throwaway database and data folder. It reads `/api/plugin` until two non-zero counts match, requires every plugin under the root to be `active`, reads `/api/skill`, and stops the server on every exit path, a signal included. It never touches the shared service and never prints the server's password. Exits are 0 pass, 1 fail, 2 usage or crash, 3 degraded or skipped, and a family that is not installed is SKIP, never FAIL.

The CI workflow installs each pinned package in its own npm prefix, builds the sk-vision bundle the plugin symlink needs, runs the battery per version, and has a `both` job that asserts the two names resolve to separate binaries. It stays untracked in this phase.

The build also found and fixed a regression from phase 2: git-setup-check could not see the OpenCode git adapter once it was wrapped in `dualPlugin(...)`, so `/doctor:git` reported it as not registered.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/commands/doctor/scripts/opencode-version-battery.cjs` | Created | The battery, 897 lines |
| `.skilled/commands/doctor/scripts/tests/opencode-version-battery.test.cjs` | Created | 26 fixture tests, including a fake-server password test |
| `.skilled/commands/doctor/scripts/git-setup-check.cjs` | Modified | Resolve the adapter inside `dualPlugin(...)` |
| `.skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs` | Modified | One test for the wrapped export |
| `.skilled/command-support/doctor/scripts/README.md` | Modified | The battery's flags, legs, exits and mutation boundary |
| `.github/workflows/opencode-dual-version.yml` | Created, untracked | The CI workflow, not committed in this phase |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The probes came first and changed the design. OpenCode 1.19.3 logs no plugin line at any level and reports no broken plugin, so the planned log window could not exist. The v1 legs became `debug config` discovery and an import harness, as phase 1 had already decided. A private v2 server answered with all 16 plugins active after a short warm-up, so the battery uses one instead of the shared service (decisions 2 and 3).

DeepSeek wrote the tests, the battery, the workflow and the README rows against a written contract, and Luna reviewed each (decision 0). The suite failed 24 of 24 against a stub before the battery existed. Three fix rounds followed. Fix 1 sent collector stdout to files, because OpenCode 1.19.3 cuts piped stdout at exactly 65,536 bytes. Fix 2 added signal cleanup and the sk-vision path filter. Fix 3 closed a cleanup race, which the orchestrator finished with one shared cleanup promise (decisions 14, 17, 20 and 21).

Every live run was bracketed by a process listing, and every pair matched.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| v1 legs are discovery plus an import harness (decision 2) | OpenCode 1.19.3 gives no per-plugin signal, so a log oracle cannot exist |
| v2 uses a private `serve`, never the shared service (decision 3) | It reports the same plugin state and leaves the operator's service alone |
| Collectors read stdout from files (decision 14) | OpenCode 1.19.3 truncates piped stdout at 65,536 bytes |
| The route doc and `_routes.yaml` entry wait for Q1 (decisions 4 and 15) | Any `.md` under `.skilled/commands/` registers as a live command, which needs the route, its asset and the catalog rows |
| git-setup-check joins the scope (decision 12) | The regression is this packet's own, and the doctor suite must be green |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| v1 live (T015): `scratch/live/battery-v1.json` | Every leg PASS, exit 0 |
| v2 live (T016): `scratch/live/battery-v2.json`, `battery-both-fix3.json` | Every leg PASS, exit 0, on the final code too |
| Broken copy (T017): `scratch/live/broken-v1.json`, `broken-v2.json` | Exit 1 on each, naming `sk-git-message-gate.js` |
| Signals: `scratch/live/signals.txt` | SIGTERM exits 143 and SIGINT 130, the private server gone and no folder left |
| Fixture suite and doctor suite (T014): `scratch/run-all-after.txt` | 26 of 26; 380 of 380, exit 0, against 350 of 353 at baseline |
| actionlint (T018): `scratch/static-checks.txt` | Exit 0, no output |
| Process lists (T019): `scratch/live/process-*.txt` | Identical before and after every run |
| Review: `scratch/review-verify2-luna.txt` | PASS, no open P0 or P1 (decision 23) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **`/doctor:opencode` is not a command yet.** The battery runs as a script; the command file and its route entry wait for the operator's answer to Q1.
2. **The workflow has never run in CI.** It passes actionlint, and DeepSeek reports running its launcher and assert steps locally, which the orchestrator did not repeat. It stays untracked until it is committed and pushed.
3. **The import harness runs each plugin's v1 factory.** Whatever a plugin does when it loads happens during the check.
4. **A signal during a v1 collector's spawn can leave its small temporary folder,** because only the private server's step installs signal handlers.
<!-- /ANCHOR:limitations -->

---
