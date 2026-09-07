---
title: Deep Research Strategy - Routing Perfection (glm lineage)
description: Lineage-scoped strategy for the detached fan-out research run on skill-routing reliability.
trigger_phrases:
  - "routing perfection research"
  - "skill routing fanout"
importance_tier: normal
contextType: planning
version: 1.0.0
---

# Deep Research Strategy - Session Tracking (glm lineage)

## 1. OVERVIEW

### Purpose

Tracks the five-iteration fan-out research run into why phrases a hub's router advertises fail to reach that hub, and what would fix it. Executor: cli-pi, model glm-5.3-flash. This lineage is one of two parallel detached lineages (glm, luna) sharing the dispatch prompt at
specs/system-skill-advisor/024-routing-perfection-research/research/dispatch-prompt.md.

### Usage

The executor reads Next Focus before each iteration, appends the iteration heading to research.md, and refreshes the machine-owned sections after each iteration. The packet-level reducer CLI is out of the lineage's write surface, so these sections are maintained inline by the executor with the same anchors.

## 2. TOPIC
Perfect skill routing across the fleet: why a phrase a hub's router advertises fails to reach that hub, and what would fix it.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)

- [ ] Q1 (Angle 1): What does the scoring function do with phrase length, and is the short-phrase failure a deliberate specificity gate or a normalization artifact? Does a principled fix exist that does not lower the bar globally?
- [ ] Q2 (Angle 2): Does a principled cross-hub arbitration exist for review verbs and single common words (artifact-type discriminator, hub-owned verb classes, negative signals), and what would it cost?
- [ ] Q3 (Angle 3): What invariant should hold between a hub's stage-one intent_signals vocabulary and its stage-two router INTENT_SIGNALS, such that an advertised-but-unreachable phrase is caught without flagging bare common words?
- [ ] Q4 (Angle 4): Does compiled routing address any of angles 1-3 or is it orthogonal? What does joining cost and what does it buy?
- [ ] Q5 (Angle 5): What should the routing gate assert, what must it never fail on, and how does it avoid proving only what its baseline samples?
<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Not lowering the confidence threshold (0.8): considered and rejected upstream; trades one failure mode for a worse one.
- Not adding vocabulary to any hub. This is research; a later packet implements.
- Not producing an implementation plan, spec, or task list. Findings only.
- Not re-deriving the measured facts given as inputs in the dispatch prompt (advisor generation 679: 439 declared phrases, 19 wrong-hub, 136 no-reach; description.json keywords move nothing; 0.8 bar with many passes at exactly 0.82; sk-design 159 intent_signals vs cli-external-orchestration 29 for 51 router phrases).

## 5. STOP CONDITIONS
- config.maxIterations (5) reached, with stopReason maxIterationsReached recorded at synthesis (forced-depth stop policy).
- An angle fully answered before the budget is spent may conclude early only per the dispatch prompt's explicit stop-early allowance; convergence before the cap is telemetry only.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
[None yet -- populated as iterations answer questions]
<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
[First iteration -- populated after iteration 1 completes]
<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
[First iteration -- populated after iteration 1 completes]
<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
[Populated when an approach has been tried from multiple angles without success]

### Vocabulary addition -- BLOCKED (iteration 0, 2 prior attempts outside this lineage)
- What was tried: adding keywords to description.json to move scores.
- Why blocked: measured twice upstream to move nothing; 9 of 14 sampled phrases absent from intent_signals routed correctly anyway, so membership is neither necessary nor sufficient.
- Do NOT retry: keyword-stuffing description.json.

### Threshold lowering -- BLOCKED (prior work, outside this lineage)
- What was tried: lowering the 0.8 confidence bar to admit short phrases.
- Why blocked: trades false-negative routing for false-positive routing; upstream rejected it as strictly worse.
- Do NOT retry: threshold reduction as the fix for short phrases.
<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- description.json keyword additions: measured to not move scores (upstream, twice). (iteration 0, evidence: dispatch-prompt.md measured facts)
- Confidence-bar reduction: upstream rejected; documented as a non-goal. (iteration 0, evidence: dispatch-prompt.md DO NOT list)
<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: all five angles
<!-- /ANCHOR:divergence-frontier -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
[Self-owned open questions from iteration write-back -- populated after iteration 1 completes]
<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Iteration 1: Angle 1 -- the scorer's shape. Locate the scoring function under .opencode/skills/system-skill-advisor/mcp-server/, establish what phrase length does to a score, and probe live with skill-advisor.cjs advisor_recommend on the short-phrase set and their longer forms.
<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->

## 12. KNOWN CONTEXT

### Bounded Context Snapshot

- Source pointers: scorer under .opencode/skills/system-skill-advisor/mcp-server/ (advisor-server.ts, lib/, handlers/); per-hub contracts at .opencode/skills/<hub>/{graph-metadata.json,hub-router.json,ROUTER.md,mode-registry.json} for sk-design, sk-doc, sk-code, mcp-tooling, system-deep-loop, cli-external-orchestration; reachability probe at .opencode/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs; compiled router at .opencode/bin/compiled-route.cjs.
- Prior work to read, not repeat: specs/sk-design/018-sk-design-parent-v2/011-router-vocabulary-repair/scratch/ (raw per-hub scans, compiled-routing gap note).
- Integration points: advisor daemon (skill-graph-daemon-lease.sqlite under .opencode/skills/.state/advisor/), hub hub-router.json INTENT_SIGNALS blocks, graph-metadata.json intent_signals arrays.
- Constraints and risks: reads anywhere, writes only inside the lineage directory; no generate-context.js, no validate.sh, no git writes; reducer CLI resolves outside the lineage so reducer steps are fulfilled inline.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 5
- Convergence threshold: 0.05 (telemetry only under the forced-depth stop policy)
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true (research.md grows per iteration)
- research.md ownership: workflow-owned canonical synthesis output, appended per iteration under its own heading
- Machine-owned sections: executor-maintained under the reducer's anchors (reducer CLI out of write surface)
- Current generation: 1
- Started: 2026-09-07T05:29:18Z
