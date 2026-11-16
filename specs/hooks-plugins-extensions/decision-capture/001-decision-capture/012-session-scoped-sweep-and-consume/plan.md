---
title: "Implementation Plan: Phase 12: session-scoped-sweep-and-consume"
description: "The Claude sweep opens the transcript named by CLAUDE_CODE_SESSION_ID. capture-core and the decision-record writer resolve a linked worktree to its primary checkout and still read the worktree's old state folder."
trigger_phrases:
  - "session scoped sweep and consume plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 12: session-scoped-sweep-and-consume

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node ESM and TypeScript |
| **Framework** | decision-capture hook library and the spec-kit continuity writer |
| **Storage** | JSONL queue and consumed log under `.skilled/skills/.state/decision-capture` |
| **Testing** | `node --test`, vitest, and a scratch probe |

### Overview
Three dispatches to gpt-6-luna through cli-codex, per D6, each with literal edits: the sweep, capture-core, and the writer. Each change carries a test that fails on the old code. A scratch HOME and a scratch repository with one linked worktree prove the whole path, per D4.
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
- [x] The decision-capture node suites exit 0 and the probe shows one session and one root
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Shared root resolution

### Key Components
- **`sessionTranscript`** in `sweep-transcript.mjs`: opens `<id>.jsonl` across Claude's project folders, so the cwd the transcript records does not matter.
- **`checkoutRoot`, `primaryCheckout` and `canonicalRoot`** in both `capture-core.mjs` and `decision-record-writer.ts`: the parity test keeps the two copies equal.
- **`worktreeDir` and `worktreeConsumedLogPath`**: read the worktree's old folder so nothing queued there before the change is lost.

### Data Flow
The capture hook queues an answer under the primary checkout's root. A save in any of its worktrees resolves the same root, so its consumed log closes the answer the primary checkout offers.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. Setup reproduces both defects in a scratch probe. Implementation dispatches the three briefs. Verification reruns every suite that loads the changed modules and the probe.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Each new test is run once against the old file to prove it fails there. The probe runs in a scratch HOME and repository, never in this repository's state.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Git 2.31 or later for `--path-format=absolute`. No new package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: a save in a worktree misses an answer its own hook queued. Revert the one commit. Answers written under the primary checkout's root stay readable from it.
<!-- /ANCHOR:rollback -->

---
