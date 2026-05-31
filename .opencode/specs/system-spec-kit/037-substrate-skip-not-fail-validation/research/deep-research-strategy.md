---
title: Deep Research Strategy - Substrate skip-not-fail validation
description: Session tracking for adversarial validation of the skip-not-fail-on-live-owner substrate harness fix.
---

# Deep Research Strategy - Session Tracking

## 1. OVERVIEW

### Purpose

Persistent brain for the deep-research session validating the five behavioral claims of the "skip-not-fail on live owner" fix to the substrate stress harness (`run-substrate-stress-harness.mjs` + `substrate-runner-harness.vitest.ts`).

### Usage

- **Init:** Topic, Key Questions, Non-Goals, Stop Conditions, Known Context, Boundaries populated from the research ask.
- **Per iteration:** Executor reads Next Focus, writes evidence; reducer refreshes machine-owned anchor sections.

---

## 2. TOPIC
Validate the behavioral claims of the skip-not-fail-on-live-owner fix to the substrate stress harness. The fix makes `connectSharedClient` record a tolerated `SKIP` (instead of `FAIL`) when a live operator daemon holds the single-writer lease and bridging is disabled. Determine, under adversarial scrutiny with file:line evidence, whether each claim holds and where it can break.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] Q1: Do genuine daemon crashes still FAIL? `liveOwnerForService()` must return null when nothing live owns the lease. Probe: TOCTOU, recycled PID, EPERM-as-alive, foreign-owned ownerPid. → ANSWERED iter 1
- [x] Q2: Does the false-green guard still fire in a clean env? Scenario 410 must be PASS/PARTIAL when daemons connect (no `runner:` SKIP rows). Probe: partial/zombie connect producing an all-SKIP set with no runner row. → ANSWERED iter 2
- [ ] Q3: Does the evidence TSV reproducibly show `runner:* SKIP` with owning pids and a stable explanation?
- [ ] Q4: Is the ~1437 `graph-metadata.json` churn pre-existing + operator background rescans, NOT harness-produced?
- [ ] Q5: Is the `SPECKIT_CODE_GRAPH_MAINTAINER_MODE=true` leak genuinely sidestepped by skip-not-fail, or merely hidden?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Implementing further fixes (findings only; remediation is a separate follow-up).
- Re-running the full stress suite repeatedly for performance numbers.
- Redesigning the harness toward full hermeticity (explicitly deferred option).
- Auditing unrelated stress suites (search-quality, session, matrix).

---

## 5. STOP CONDITIONS
- 5 iterations reached (hard cap), OR
- composite convergence below threshold 0.05 with quality guards passed, OR
- all five key questions answered with file:line evidence and concrete failure scenarios characterized.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Q1: Do genuine daemon crashes still FAIL? `liveOwnerForService()` must return null when nothing live owns the lease. Probe: TOCTOU, recycled PID, EPERM-as-alive, foreign-owned ownerPid. → ANSWERED iter 1
- Q2: Does the false-green guard still fire in a clean env? Scenario 410 must be PASS/PARTIAL when daemons connect (no `runner:` SKIP rows). Probe: partial/zombie connect producing an all-SKIP set with no runner row. → ANSWERED iter 2

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
[None yet]

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
[None yet]

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
[No exhausted approach categories yet]

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
[None yet]

<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Q3: Does the evidence TSV reproducibly show `runner:* SKIP` with owning pids and a stable explanation?

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
- Fix landed this session in `run-substrate-stress-harness.mjs` (added `isPidAlive`, `liveOwnerForService`; reworked `connectSharedClient` catch) and `substrate-runner-harness.vitest.ts` (relaxed 410 guard only on live-owner SKIP).
- Verified: full stress suite 23/23 files, 79/79 tests; TSV shows `runner:* SKIP` with owning pids (mem 57747, code-index 48700).
- Operator daemons hold the single-writer lease at fixed DB dirs (mem: `mcp_server/database/.mk-spec-memory-launcher.json`; code-index: `system-code-graph/mcp_server/database/.code-graph-owner.json`).
- Iteration 1 finding F-005: PID-recycling is the one residual SKIP-masking risk; F-004: TOCTOU not exploitable (synchronous lease read).
- Executor: cli-opencode + `minimax/MiniMax-M2.7-highspeed`.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 5
- Convergence threshold: 0.05
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true
- research/research.md ownership: workflow-owned canonical synthesis output
- Machine-owned sections: reducer controls Sections 3, 6, 7-11 (anchor-fenced)
- Canonical pause sentinel: `research/.deep-research-pause`
- Current generation: 1
- Started: 2026-05-31T08:32:19Z
