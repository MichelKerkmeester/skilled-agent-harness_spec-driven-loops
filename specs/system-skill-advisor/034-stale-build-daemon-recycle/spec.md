---
title: "Feature Specification: Recycle an advisor daemon that runs code older than the current build"
description: "A skill-advisor daemon loads its code once at launch, and both the advisor CLI and the launcher reused a live daemon after a rebuild, so it kept answering with the old code until someone restarted it by hand."
trigger_phrases:
  - "stale build daemon recycle"
  - "advisor daemon predates build"
  - "skill advisor daemon restart after rebuild"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Recycle an advisor daemon that runs code older than the current build

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-05 |
| **Branch** | `worktrees/079-doctor-command-audit` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The advisor daemon is long-lived, one per worktree, and loads its code once. The CLI connects to a live daemon's socket directly and the launcher bridges to a live owner, and neither checked whether the daemon predated the current build. After the sanitizer moved to v2, graph validation kept reporting 14 warnings that every v2 stamp predated v1, because the running daemon still held the v1 code.

### Purpose
The first advisor call after a rebuild reaches a daemon running that build, with no manual restart.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- In the launcher, recycle a launched daemon whose lease `startedAt` is older than `dist/runtime/advisor-server.js`, through the existing reap-and-respawn path, and bridge as before when the recycle is skipped
- In the CLI, when the probe finds such a daemon alive, start a launcher, wait for the lease to show the replacement and then connect
- Keep `SPECKIT_BRIDGE_RESPAWN_DISABLED=1` as the off switch and keep warm-only calls from starting anything

### Out of Scope
- Restarting a daemon on a source change before it is built; the build stays the trigger
- The unexplained cold-start failure seen earlier, which did not recur

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/bin/system-skill-advisor-launcher.cjs` | Modify | Stale-build predicate and recycle before bridging |
| `system-skill-advisor/runtime/skill-advisor-cli.ts` | Modify | Stale-build predicate and recycle wait before connecting |
| `system-skill-advisor/runtime/tests/launcher-stale-build-recycle.vitest.ts` | Create | Predicate tests for both sides |
| `system-skill-advisor/references/runtime/daemon-lease-contract.md` | Modify | Document the stale-build recycle |
| `.skilled/changelog/skilled/v4.0.0.3.md` | Modify | Release note; replaces the restart upgrade note |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A daemon launched before the current build is recycled | After touching the server entrypoint, one CLI call replaces the daemon and answers |
| REQ-002 | A bootstrapping or current daemon is left alone | A lease without `childPid`, or launched after the build, is never flagged |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | A skipped recycle never breaks the call | The launcher bridges to the running daemon with no stdout diagnostic, and the CLI connects to it |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The CLI call after a simulated rebuild returns `ok` and the lease shows a new owner and daemon pid.
- **SC-002**: Later calls reuse the new daemon; nothing recycles twice.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A recycle interrupts a mutating tool in flight on the old daemon | Low | The session proxy replays only safe tools; an interrupted scan or rebuild returns a retryable error and SQLite rolls back its transaction |
| Risk | A supervised daemon that restarted after the build under an older lease is recycled once more | Low | The replacement's lease is fresh, so it happens at most once |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---

