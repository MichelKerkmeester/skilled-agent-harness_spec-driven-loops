---
title: "Implementation Summary"
description: "Two flaky tests now fail only for real defects; the pi-coding-agent 0.79.0 bump was measured and held because it raises npm audit from 1 high to 5 high per extension."
trigger_phrases:
  - "ci health followups implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/053-ci-workflow-efficiency/011-ci-health-followups"
    last_updated_at: "2026-10-27T06:21:05Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Fixed the goal-core and watcher flakes; held the 0.79.0 lockfiles"
    next_safe_action: "Operator picks the pi-coding-agent version, then land the lockfiles"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-10-27-053-011-ci-health-followups"
      parent_session_id: null
    completion_pct: 67
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
| **Spec Folder** | 011-ci-health-followups |
| **Completed** | Not yet: AC-003 open |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Two tests that failed CI for reasons unrelated to the change under test now fail only when the code is wrong. The Dependabot bump to pi-coding-agent 0.79.0 was applied and measured, and it is held out of the commit because it makes `npm audit` worse.

### Phase 11: ci-health-followups

The goal-core test checked that the whole state path held no `pi`. The path lives under a random temp directory, so the check failed whenever the random suffix spelled `pi`. It now checks the state file's own name, which is the part the code under test controls.

The advisor watcher test wrote its new skill 150 ms after start. A trace of a failing run showed chokidar reporting `ready` after 2 ms and then no event at all for the new skill. On macOS the fs.watch stream behind chokidar keeps dropping events for 0.3 to 4 s after `ready`; 15 traced runs needed between 3 and 40 probes of 100 ms. The watcher now exposes `ready`, and the test awaits it and then creates hidden `.armed-probe-*` directories, which the watcher skips, until one is reported. Only then does it write the skill.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/hooks/goal/lib/goal-core.test.cjs` | Modified | Assert on `basename(scope.statePath)` |
| `.skilled/skills/system-skill-advisor/runtime/lib/daemon/watcher.ts` | Modified | Add the `ready` promise to `SkillGraphWatcher` |
| `.skilled/skills/system-skill-advisor/runtime/tests/daemon-watcher-new-root-ingestion.vitest.ts` | Modified | Await `ready` and a probe handshake instead of a fixed sleep |
| `.pi/extensions/*/package-lock.json` | Not committed | Lockfiles stay at 0.75.3; the 0.79.0 versions are kept outside the repository until AC-003 is decided |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

DeepSeek V4.1 Flash workers made each code edit from a one-change brief, and the conductor reviewed every diff and reran its check. The first watcher brief (await `ready` alone) still failed 1 of 8 runs; the trace above found the cause, and a second brief added the probe handshake. The final state passed the goal-core suite, the watcher suite 5 times in a row, the 3 sibling watcher suites and the advisor typecheck.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Probe handshake in the test, not in the watcher | Proving delivery means writing to the watched tree, which a production daemon must not do; the test owns its tree |
| Keep the `ready` promise | It closes the window where chokidar's initial scan swallows a new directory under `ignoreInitial`, and it costs one listener |
| Hold the 0.79.0 lockfiles | 0.79.0 pins `undici` 8.3.0 exactly, plus older `ws`, `zod`, `protobufjs` and `brace-expansion`; the audit goes from 1 high to 6 (5 high, 1 moderate) in each extension |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --test .skilled/hooks/goal/lib/goal-core.test.cjs` | PASS: `ℹ pass 98`, `ℹ fail 0` |
| Same test, `TMPDIR` containing `pi` | HEAD copy `fail 1`; fixed file `pass 1` |
| `npx vitest run tests/daemon-watcher-new-root-ingestion.vitest.ts`, 5 runs | PASS: `Tests  5 passed (5)` each, exit 0 |
| 3 sibling watcher suites | PASS: `Tests  47 passed (47)` |
| Advisor `npm run typecheck` | PASS: exit 0 |
| Extensions at 0.79.0: `npm test`, typecheck | PASS: 118 and 81 tests, typecheck exit 0 |
| Extensions at 0.79.0: `npm audit` | FAIL: `6 vulnerabilities (1 moderate, 5 high)` each |
| Scratch trial at 1.4.0 | pi-cache-optimizer `found 0 vulnerabilities`; pi-fast-mode-w-subagent-support `2 vulnerabilities (1 moderate, 1 high)` from `undici` 8.10.2, which 1.4.0 pins; tests and typecheck pass in both; adding `"overrides": {"undici": "^8.12.2"}` to the fast-mode copy gave `found 0 vulnerabilities` and 81 passing tests |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The pi-coding-agent version is undecided.** No 0.x release clears the audit, because 0.75.4 to 0.83.0 carry the `undici` advisory. 1.4.0 plus an `undici` override of at least 8.12.2 in pi-fast-mode-w-subagent-support (pi-cache-optimizer already has one) reached `found 0 vulnerabilities` in a scratch copy of each extension, with tests and typecheck passing; it is outside this phase's brief.
2. **A daemon started seconds before a skill is created can miss it on macOS.** The next event on that skill or a restart picks it up.
<!-- /ANCHOR:limitations -->

---
