---
title: Deep Research Strategy - peck-teachings-adoption planned work
description: Session tracking for deep research into the 028 packet's planned phases.
---

# Deep Research Strategy - Session Tracking

## 1. OVERVIEW

Persistent brain for the deep-research session evaluating what is planned in
`028-peck-teachings-adoption` (T3/T4/T2 + deferred T1). Read at every iteration.

---

## 2. TOPIC
Evaluate the planned adoption of peck teachings into system-spec-kit: phase 002 (T3 — self-check + failure-mode guidance blocks in spec/plan/checklist manifest templates), phase 003 (T4 — broadened current-state-only content discipline as an advisory rule), phase 004 (T2 — read-only constitutional-rule review surface with last-confirmed metadata), and deferred T1 (per-criterion AC-coverage completion gate). For each: feasibility, risks, prior art, and concrete refinements.

---

## 3. KEY QUESTIONS (remaining)
- [ ] Q1 (T3): Should self-check/failure-mode guidance ship as HTML-comment blocks vs tracked `##` sections, given TEMPLATE_HEADERS exact-order enforcement? What prior art exists in spec-kit templates and comparable doc frameworks?
- [ ] Q2 (T4): What severity (INFO vs WARNING) and doc-scope minimize false positives when broadening the current-state-only rule beyond phase parents? How do doc/markdown linters detect "history narrative"?
- [ ] Q3 (T2): What is the right mechanism for a constitutional-rule review surface (metadata field + read-only diagnostic), and how do comparable "always-on rule" systems (linters, policy engines) handle staleness/expiry without auto-deleting rules?
- [ ] Q4 (T1, deferred): What is the prior art for mechanical acceptance-criteria → test coverage mapping with a blocking threshold (e.g., peck's ≥90% floor), and what are the main feasibility risks of adding it to spec-kit's completion gate?
- [ ] Q5 (cross-cutting): What rollout/sequencing risks (warn-only windows, per-level opt-in, strict-mode interaction) apply across these phases?

---

## 4. NON-GOALS
- Implementing any of the phases (this is research only).
- Deep T1 design beyond feasibility/prior-art (T1 is deferred to its own packet).
- Changing spec-kit's core philosophy or recommending peck's minimalism wholesale.

---

## 5. STOP CONDITIONS
- 5 iterations reached, OR
- newInfoRatio below 0.05 (convergence), OR
- all five key questions answered with evidence.

---

## 6. ANSWERED QUESTIONS
[None yet]

---

<!-- MACHINE-OWNED: START -->
## 7. WHAT WORKED
[Populated after iteration 1]

---

## 8. WHAT FAILED
[Populated after iteration 1]

---

## 9. EXHAUSTED APPROACHES (do not retry)
[None yet]

---

## 10. RULED OUT DIRECTIONS
[None yet]

---

## 11. NEXT FOCUS
Iteration 1: Establish feasibility + prior art for Q1 (T3 self-check blocks) and the TEMPLATE_HEADERS interaction. Read the actual spec-kit templates and validation rules in the repo to ground the comment-vs-section trade-off; survey how comparable spec/doc frameworks embed self-check or "definition of done" guidance into templates.

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
Source analysis lives in the sibling report `../peck-teachings-analysis.md` (this packet is phase 001 of 028). Memory MCP is unavailable this session, so no memory_context priming was injected. The four teachings (T1-T4) and their spec-kit gaps are defined in that analysis.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 5
- Convergence threshold: 0.05
- Per-iteration budget: 12 tool calls, 9 minutes
- Executor: cli-opencode openai/gpt-5.5 --variant xhigh (isolated worktree dispatch)
- research/research.md ownership: workflow-owned canonical synthesis output
- Started: deep-research session dr-peck-028-001
