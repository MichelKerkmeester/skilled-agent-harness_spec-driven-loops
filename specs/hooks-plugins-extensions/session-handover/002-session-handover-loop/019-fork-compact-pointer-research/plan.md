---
title: "Implementation Plan: Phase 19: fork-compact-pointer-research"
description: "Gate the Claude compact-pointer hook so a forked sub-agent's compaction skips the parent's note and nudge level, proved by adapter tests and a replay of the six recorded fires."
trigger_phrases:
  - "fork compact pointer research plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 19: fork-compact-pointer-research

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JavaScript (Node built-ins, `.mjs` hook) |
| **Framework** | Claude Code SessionStart hook |
| **Storage** | Runtime state directory and Claude transcript files, read only |
| **Testing** | node:test |

### Overview
Research first: a 10-iteration DeepSeek run, the orchestrator's check against the transcripts, and an independent Opus review. The fix then gates the hook on three conditions before it touches any state: a transcript path is present, the transcript is named after the session, and no fork under the session's `subagents/` folder compacted in the last 5 seconds.
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
- [x] Tests passing
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Guard clauses at the top of an existing hook

### Key Components
- **`forkCompactedRecently`**: reads the tail of each recently written `agent-*.jsonl` under the session's `subagents/` folder and reports a compaction record from the last 5 seconds.
- **`main()` guards**: three skips, each logged as `compact-pointer-skipped` with a reason, ahead of the nudge reset.

### Data Flow
SessionStart payload, then the source and session-id checks, then the three new guards, then the nudge reset, the prepared-hop check, the open-note lookup and the pointer.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Tests were written first and failed 3 of 36 against the old hook. A replay script rebuilt each fork transcript as it stood at each of the six recorded fires and ran `forkCompactedRecently` against it.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

N/A — record dependencies beyond the components named in the architecture here.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the three-file change. Without it the hook returns to pointing forks at the parent's note, which the forks have so far refused.
<!-- /ANCHOR:rollback -->

---

