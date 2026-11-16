---
title: "Implementation Plan: Phase 14: devin-vibe-lock-probe"
description: "The Devin and Vibe sweeps walk their own process ancestry and prefer the session whose lock an ancestor holds. The Devin sweep prints the live queue when a session has no transcript. Live two-session probes proved the lock signal first."
trigger_phrases:
  - "devin vibe lock probe plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 14: devin-vibe-lock-probe

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node ESM |
| **Framework** | decision-capture save-time sweeps |
| **Storage** | Devin's `session_locks/` and `sessions.db`, Vibe's `active/` leases, read-only |
| **Testing** | `node --test` and live two-session probes |

### Overview
A live two-session probe per runtime recorded session A's process ancestry and every live lock before any code changed. Three briefs with literal edits went to gpt-6-luna through cli-codex, per D6. A second, seeded probe then ran the old and new sweeps inside session A.
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
- [x] The decision-capture node suites exit 0 and the seeded probes show session A
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Caller's lock first, newest session as fallback

### Key Components
- **`ancestorPids`** in both sweeps: one `ps -A -o pid=,ppid=` call, walked up from the sweep's own process.
- **`callerSessionIds`** in `sweep-devin.mjs`: lock files whose process id is an ancestor.
- **`callerSessionIds`** in `sweep-vibe.mjs`: lease files whose `process_id` is an ancestor.
- **The missing-transcript branch** in the Devin sweep's main path: prints the chosen session's pending answers.

### Data Flow
The save runs the sweep through the runtime's shell tool, so the runtime process that holds the session's lock is an ancestor of the sweep. A matched session that also ran in this project is read. Otherwise the newest session for the project is read, as before.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. Setup probes the locks live. Implementation dispatches the Devin and Vibe briefs. Verification reruns the suites and a seeded probe.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Each new test is run once against the old file to prove it fails there. The tests spawn the sweep, so the test process is an ancestor and its own id stands in for the runtime's. The Codex sandbox blocks `ps`, so these tests run outside it.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Devin 3000.12.57 and Vibe 3.1.2 as installed on 2026-11-16, and `ps`. No new package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: a Devin or Vibe save reads a session other than its own. Revert the one commit. Both sweeps go back to the newest session.
<!-- /ANCHOR:rollback -->

---
