---
title: "Implementation Plan: Phase 13: session-signal-sweeps"
description: "Each of four sweeps reads the session its runtime names in a command's environment, and never falls back when that name finds nothing. The Vibe sweep also reads the unified folder. Live two-session probes prove each signal before the sweep relies on it."
trigger_phrases:
  - "session signal sweeps plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 13: session-signal-sweeps

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node ESM |
| **Framework** | decision-capture save-time sweeps |
| **Storage** | Each runtime's own session store, read-only, and the scratch project's queue |
| **Testing** | `node --test` and live two-session probes |

### Overview
A read-only investigation found the variable each runtime sets, from installed sources and binary strings. Five briefs with literal edits went to gpt-6-luna through cli-codex, per D6, one runtime each. Each signal was then probed live in a scratch project, per D4 and D5.
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
- [x] The decision-capture node suites exit 0 and each live probe shows session A
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Signal first, newest session as fallback

### Key Components
- **`signalledTranscript`** in `sweep-codex.mjs`: finds the rollout whose name ends with the thread id.
- **`signalledSession`** in `sweep-dsh.mjs`: finds the session folder named by the id under any project key.
- **`rootOpenCodeSession`** in `sweep-opencode.mjs`: climbs `parent_id` links to the session the operator talks to.
- **`PI_SESSION_FILE`** in `sweep-pi.mjs`: names the file outright.
- **`latestSession`** in `sweep-vibe.mjs`: now reads the root and `unified/`.

### Data Flow
The save runs a sweep through the runtime's own shell tool, so the sweep inherits the variable. A set variable picks the session. An unset one keeps the old choice.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. Setup confirms each signal in installed sources. Implementation dispatches one brief per runtime. Verification reruns the suites and the live probes.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Each new test is run once against the old file to prove it fails there. Each probe opens session A, then session B, then resumes A and runs the old and new sweeps from inside it, so the old sweep shows what the newest-session choice would have read.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Codex 0.169.0, DSH 0.2.2-rc.3, OpenCode 2.3.0 and Pi 1.5.2 as installed on 2026-11-16. No new package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: a save on one of the four runtimes misses answers its own session holds. Revert the one commit. The sweeps go back to the newest session.
<!-- /ANCHOR:rollback -->

---
