---
title: Deep Research Strategy - Goal Isolation
description: Runtime tracking for cross-runtime goal-state isolation research across three forced-depth iterations.
trigger_phrases:
  - "goal isolation research"
  - "goal state isolation strategy"
importance_tier: normal
contextType: planning
version: 1.14.0.19
---

# Deep Research Strategy - Session Tracking

## 1. OVERVIEW

### Purpose

Serves as the persistent brain for the cross-runtime goal-state isolation research session. Records what to investigate, what worked, what failed, and where to focus next.

### Usage

- **Init:** Populated during initialization with topic, key questions, and boundaries.
- **Per iteration:** Agent reads Next Focus, writes iteration evidence, and the reducer refreshes machine-owned sections.
- **Protection:** Machine-owned sections controlled by reducer; analyst sections are stable.

---
## 2. TOPIC

Cross-runtime goal-state isolation for simultaneous Pi and other runtime sessions

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] Which files own the current active-goal state for each registered runtime (Pi, Cursor, OpenCode, Devin, Claude Code, Codex)?
- [x] What native session-identity surfaces does each runtime expose — and which are usable for automated goal scoping without a user-supplied id?
- [x] How does the current Pi goal plugin store, inject, verify, pause, complete, and clear goal state?
- [x] Does the current Devin adapter still work against the latest runtime; if not, should it be restored or removed?
- [x] What cross-session collision scenario reproduces the leak in Pi, and what is the minimal structural fix?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Implementing runtime code changes.
- Supporting multiple simultaneously selected goals inside one session.
- Auto-assigning the legacy singleton to any live session.
- Designing a multi-user or multi-machine goal synchronization system.

---

## 5. STOP CONDITIONS
- Max iterations (3) reached (hard cap per --stop-policy=max-iterations).
- Convergence threshold of 0.05 reached only after minIterations floor clears.
- Three consecutive errors without recovery.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Which files own the current active-goal state for each registered runtime (Pi, Cursor, OpenCode, Devin, Claude Code, Codex)?
- What native session-identity surfaces does each runtime expose — and which are usable for automated goal scoping without a user-supplied id?
- How does the current Pi goal plugin store, inject, verify, pause, complete, and clear goal state?
- Does the current Devin adapter still work against the latest runtime; if not, should it be restored or removed?
- What cross-session collision scenario reproduces the leak in Pi, and what is the minimal structural fix?

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- Direct filesystem inspection (`ls`, `glob`) plus git history confirmed the Devin adapter's decommission status definitively — the negative result (no files) combined with the positive result (git shows a deletion commit) forms a strong evidence pair. Reading `resolveStateDir` in full context revealed it is architecturally designed for a single shared file, not a bug awaiting a fix. (iteration 2)

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- Nothing failed this iteration. All targeted files were present and readable. (iteration 2)

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### Looking for per-session UUIDs in Cursor/Pi hook payloads — none exposed at the level the adapters can read. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Looking for per-session UUIDs in Cursor/Pi hook payloads — none exposed at the level the adapters can read.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for per-session UUIDs in Cursor/Pi hook payloads — none exposed at the level the adapters can read.

### None this iteration — first pass was comprehensive mapping, not elimination. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: None this iteration — first pass was comprehensive mapping, not elimination.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None this iteration — first pass was comprehensive mapping, not elimination.

### Searching for a `runtime`-based path in `resolveStateDir` — confirmed absent. The function has no runtime parameter and no per-runtime path branching. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Searching for a `runtime`-based path in `resolveStateDir` — confirmed absent. The function has no runtime parameter and no per-runtime path branching.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Searching for a `runtime`-based path in `resolveStateDir` — confirmed absent. The function has no runtime parameter and no per-runtime path branching.

### The bounded context snapshot's hypothesized paths (`src/shared/goals/`, `src/cli/plugins/goal-*.ts`, `src/runtimes/*/goal-adapter.*`) do not exist — these are stale hypotheses from packets 032 and 034 that should not be reinvestigated. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: The bounded context snapshot's hypothesized paths (`src/shared/goals/`, `src/cli/plugins/goal-*.ts`, `src/runtimes/*/goal-adapter.*`) do not exist — these are stale hypotheses from packets 032 and 034 that should not be reinvestigated.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The bounded context snapshot's hypothesized paths (`src/shared/goals/`, `src/cli/plugins/goal-*.ts`, `src/runtimes/*/goal-adapter.*`) do not exist — these are stale hypotheses from packets 032 and 034 that should not be reinvestigated.

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- None this iteration — first pass was comprehensive mapping, not elimination. (iteration 1)
- The bounded context snapshot's hypothesized paths (`src/shared/goals/`, `src/cli/plugins/goal-*.ts`, `src/runtimes/*/goal-adapter.*`) do not exist — these are stale hypotheses from packets 032 and 034 that should not be reinvestigated. (iteration 1)
- Looking for per-session UUIDs in Cursor/Pi hook payloads — none exposed at the level the adapters can read. (iteration 2)
- Searching for a `runtime`-based path in `resolveStateDir` — confirmed absent. The function has no runtime parameter and no per-runtime path branching. (iteration 2)

<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergence-frontier -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
[None yet]

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

### Bounded Context Snapshot

- Source pointers: Tracked goal core (`src/shared/goals/`), CLI plugins (`src/cli/plugins/goal-*.ts`), runtime adapters per `src/runtimes/*/goal-adapter.*`)
- Reuse candidates: Existing hook system, session-id utilities, `active-goal.json` read/write paths
- Integration points: Pi session hooks, Cursor goal management, OpenCode per-session store, Devin adapter, Claude Code + Codex goal registration
- Constraints and risks: Historical packets 032 and 034 may overstate current runtime support; treat as hypotheses. Do not modify source files during research.
- Prior context: Not loaded (Spec Kit Memory daemon unavailable).

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 3 (hard cap via --stop-policy=max-iterations)
- Convergence threshold: 0.05
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true (default)
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: resume, restart (live); fork, completed-continue (deferred)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A
- Divergent pivots: supported but not expected in 3-iteration forced-depth run
- Canonical pause sentinel: research/.deep-research-pause
- Current generation: 1
- Started: 2026-08-10T11:52:01.209Z
