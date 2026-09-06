---
title: "Implementation Plan: Phase 4: Live-Follow Log Hygiene"
description: "Track the last reported divergence state in the poll loop and emit only on transition, then cap the log so a long-running follower cannot produce a multi-megabyte file."
trigger_phrases:
  - "live follow log hygiene plan"
  - "state change logging"
  - "edge-triggered divergence report"
  - "LIVE_FOLLOW_LOG_MAX_BYTES cap"
  - "git-live-follow.sh poll loop"
  - "retained generation rotation"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 4: Live-Follow Log Hygiene

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash |
| **Framework** | None |
| **Storage** | Log and pid files under the git common dir |
| **Testing** | Drive the loop against a synthetic diverged repository |

### Overview
Hold the last reported state in a variable, compare before emitting, and add a cap. The safety contract of the follower is untouched.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- The cap policy question is answered

### Definition of Done
- A held divergence emits one entry across many intervals
- Clearing and re-entering the condition emits a second entry
- The log stays within the cap under a long run
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Edge-triggered rather than level-triggered logging, plus a bounded sink.

### Key Components
- The poll loop in `git-live-follow.sh`, currently emitting unconditionally
- The per-checkout log file under the git common dir

### Data Flow
Each poll computes ahead/behind counts. Today those counts are formatted and written every time. After the change they are compared with the last reported pair and written only on transition.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
Answer the cap policy question and build a synthetic diverged repository to drive the loop against.

### Phase 2: Implementation
Add last-state tracking and the transition comparison, then add the cap or rotation.

### Phase 3: Verification
Hold a divergence across many intervals and count lines, clear and re-enter it, then confirm the cap holds under a long run.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Drive the loop against a synthetic repository with a short interval. Count emitted lines while the condition is held, then clear and reintroduce it to prove the transition still reports. Confirm the pid lock and single-follower guarantee are unaffected by rotation.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

None. This phase is independent of the other three.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

A single-file change with no persistent state beyond the log itself. Revert the commit to restore per-poll logging. Existing logs are unaffected by the revert.
<!-- /ANCHOR:rollback -->

---
