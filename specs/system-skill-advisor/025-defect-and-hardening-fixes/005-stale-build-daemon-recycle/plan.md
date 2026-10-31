---
title: "Implementation Plan: Recycle an advisor daemon that runs code older than the current build"
description: "Compare the running daemon's launch time with the built entrypoint on both the launcher and CLI paths, and reuse the existing respawn path to replace a stale daemon."
trigger_phrases:
  - "stale build daemon recycle plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Recycle an advisor daemon that runs code older than the current build

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | CommonJS launcher, TypeScript CLI |
| **Framework** | Vitest |
| **Storage** | Launcher lease file in the advisor database folder |
| **Testing** | Predicate unit tests, advisor suite, live recycle run |

### Overview
The launcher lease records `startedAt` after the launcher's own build and `childPid` once the daemon runs. A lease with a `childPid` whose `startedAt` is older than the entrypoint's mtime marks a daemon running superseded code.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Detect at the reuse point, replace through the path that already reaps and respawns.

### Key Components
- **Launcher**: `launchedDaemonPredatesBuild`, checked in `bridgeOrReportLeaseHeld` ahead of the bridge
- **Respawn path**: `respawnAfterDeadSocket` gains `diagnostics: false` so a skipped recycle writes nothing to the bridged stream
- **CLI**: `liveDaemonPredatesBuild` and `waitForStaleDaemonRecycle` in `ensureDaemonReady`

### Data Flow
Probe finds a live daemon, the lease predates the build, a launcher reaps and relaunches, the lease shows the replacement, the call connects.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Seven predicate tests cover a stale lease, a current lease, a bootstrapping lease, a missing entrypoint and a missing lease. The advisor suite passes 1012 with 6 skipped, the stress suite 64 of 64 and the package typecheck passes. A live run proved both paths: a launcher started beside a stale daemon reaped it and launched a replacement, and a CLI call after touching the entrypoint replaced the daemon and answered in about a second.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

N/A — record dependencies beyond the components named in the architecture here.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the launcher, CLI and test changes and rebuild the runtime.
<!-- /ANCHOR:rollback -->

---
