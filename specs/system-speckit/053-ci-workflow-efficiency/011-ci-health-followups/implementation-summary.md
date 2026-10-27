---
title: "Implementation Summary"
description: "Two flaky tests now fail only for real defects; both pi extensions now lock pi-coding-agent 1.4.0, the host version, with npm audit at 0."
trigger_phrases:
  - "ci health followups implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/053-ci-workflow-efficiency/011-ci-health-followups"
    last_updated_at: "2026-10-27T06:21:05Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Fixed both flakes; lockfiles at pi-coding-agent 1.4.0 with audit 0"
    next_safe_action: "None; the orchestrator lands the commits"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-10-27-053-011-ci-health-followups"
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
| **Spec Folder** | 011-ci-health-followups |
| **Completed** | 2026-10-27 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Two tests that failed CI for reasons unrelated to the change under test now fail only when the code is wrong. Both pi extensions now lock pi-coding-agent 1.4.0, the version the host `pi` runs, and `npm audit` prints 0 in each. The Dependabot target, 0.79.0, was measured first and rejected because it raised the audit from 1 high to 6.

### Phase 11: ci-health-followups

The goal-core test checked that the whole state path held no `pi`. The path lives under a random temp directory, so the check failed whenever the random suffix spelled `pi`. It now checks the state file's own name, which is the part the code under test controls.

The advisor watcher test wrote its new skill 150 ms after start. A trace of a failing run showed chokidar reporting `ready` after 2 ms and then no event at all for the new skill. On macOS the fs.watch stream behind chokidar keeps dropping events for 0.3 to 4 s after `ready`; 15 traced runs needed between 3 and 40 probes of 100 ms. The watcher now exposes `ready`, and the test awaits it and then creates hidden `.armed-probe-*` directories, which the watcher skips, until one is reported. Only then does it write the skill.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/hooks/goal/lib/goal-core.test.cjs` | Modified | Assert on `basename(scope.statePath)` |
| `.skilled/skills/system-skill-advisor/runtime/lib/daemon/watcher.ts` | Modified | Add the `ready` promise to `SkillGraphWatcher` |
| `.skilled/skills/system-skill-advisor/runtime/tests/daemon-watcher-new-root-ingestion.vitest.ts` | Modified | Await `ready` and a probe handshake instead of a fixed sleep |
| `.pi/extensions/*/package-lock.json` | Modified | pi-coding-agent 0.75.3 to 1.4.0 |
| `.pi/extensions/pi-fast-mode-w-subagent-support/package.json` | Modified | Add `"overrides": {"undici": "^8.12.2"}`, because 1.4.0 pins `undici` 8.10.2 |
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
| pi-coding-agent 1.4.0, not 0.79.0 | 0.79.0 pins `undici` 8.3.0 exactly, plus older `ws`, `zod`, `protobufjs` and `brace-expansion`, and raised the audit from 1 high to 6 (5 high, 1 moderate) per extension; 1.4.0 is the version the host `pi` runs, so the lockfiles match the host that loads the extensions |
| `undici` override in fast-mode only | 1.4.0 pins `undici` 8.10.2, below the 8.12.2 fix; pi-cache-optimizer's existing `^8.9.0` override already resolves 8.12.3, so it was left as is |
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
| Extensions at 0.79.0 (rejected): `npm audit` | `6 vulnerabilities (1 moderate, 5 high)` each; tests and typecheck passed |
| Extensions at 1.4.0: `npm ci`, `npm test`, typecheck, check:pack | PASS: pass 118 / fail 0 and `Tests  81 passed (81)`, typecheck and check:pack exit 0 |
| Extensions at 1.4.0: `npm audit` | PASS: `found 0 vulnerabilities` in both; `npm ls undici` resolves 8.12.3 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The `undici` override outlives its need once pi-coding-agent pins 8.12.2 or later.** Drop it from fast-mode's `package.json` on the next bump that clears `npm audit` without it.
2. **A daemon started seconds before a skill is created can miss it on macOS.** The next event on that skill or a restart picks it up.
<!-- /ANCHOR:limitations -->

---
