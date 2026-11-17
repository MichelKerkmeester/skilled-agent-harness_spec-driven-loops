---
title: "Implementation Plan: Phase 15: devin-database-reader"
description: "When a Devin session has no transcript file, the sweep rebuilds it from the message_nodes table of sessions.db into the transcript step shape, so the existing answer and chat readers recover it under the hook's own keys."
trigger_phrases:
  - "devin database reader plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 15: devin-database-reader

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node ESM |
| **Framework** | decision-capture save-time sweeps |
| **Storage** | Devin's `sessions.db`, table `message_nodes`, read-only |
| **Testing** | `node --test` and live two-session probes |

### Overview
An interactive Devin probe settled the key format first. Two briefs with literal edits went to gpt-6-luna through cli-codex, per D6: the reader, then its test. The real probe session then proved recovery and the absence of duplicates.
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
- [x] The decision-capture node suites exit 0 and the real session recovers the hook key once
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Adapter into the existing transcript shape

### Key Components
- **`databaseTranscript`** in `sweep-devin.mjs`: rows to steps, one per message id.
- **`sweepDevinTranscript`**: accepts a ready transcript object.
- **The missing-transcript branch** in the sweep's main path: tries the store, then the hook's queue.

### Data Flow
The sweep picks the session as before. With no transcript file it reads that session's rows, builds steps, and the existing readers pair each question call with its answer by call id, which the shared key builder turns into the hook's key.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. Setup probes the key format live. Implementation dispatches the reader and its test. Verification runs the suites and the real-session check.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The new test is run once against the old file to prove it fails there. The real-session check runs against a scratch copy of Devin's store with no transcript files, so the reader, not the file, supplies the answer.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Devin 3000.12.57 as installed on 2026-11-16, and `node:sqlite`. No new package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: a Devin save records an answer twice or fails on the store. Revert the one commit. The sweep goes back to the hook's queue alone.
<!-- /ANCHOR:rollback -->

---
