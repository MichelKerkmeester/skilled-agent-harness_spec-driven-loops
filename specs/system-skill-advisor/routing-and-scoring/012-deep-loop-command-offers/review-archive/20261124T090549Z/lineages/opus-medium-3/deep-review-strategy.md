---
title: Deep Review Strategy - 012 deep-loop command offers (lineage opus-medium-3)
description: Session tracking for the opus-medium-3 fan-out lineage reviewing the deep-loop offer gate.
importance_tier: normal
contextType: planning
---

# Deep Review Strategy - Session Tracking

## 2. TOPIC
Review: specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers (spec-folder). Operator focus: the deep-loop offer gate in command-attach.ts and the Python fallback in skill_advisor.py, plus the typed-command hint from packet 013.

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS
- Scorer weights and lane tuning outside the deep-loop offer gate.
- Fixing anything: this run reports findings only.

---

## 5. STOP CONDITIONS
- stopPolicy max-iterations: run all 5 iterations; convergence is telemetry only.

---

<!-- ANCHOR:completed-dimensions -->
## 4. COMPLETED DIMENSIONS
- [x] correctness
- [x] security
- [x] traceability
- [x] maintainability

<!-- /ANCHOR:completed-dimensions -->
<!-- ANCHOR:running-findings -->
## 5. RUNNING FINDINGS
- P0 (Blockers): 0
- P1 (Required): 1
- P2 (Suggestions): 9
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED
- Importing command-attach.ts directly with node strip-types and probing edge prompts confirmed behaviour without dist (iteration 1)

---

## 9. WHAT FAILED
- Running skill_advisor.py was skipped: it may write its cache outside the lineage, so Python behaviour is read from source (iteration 1)

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### A doc-to-head mismatch on the option labels: all three surfaces use A `:auto` (Recommended), B `:confirm`, C no loop. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: A doc-to-head mismatch on the option labels: all three surfaces use A `:auto` (Recommended), B `:confirm`, C no loop.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A doc-to-head mismatch on the option labels: all three surfaces use A `:auto` (Recommended), B `:confirm`, C no loop.

### A missing ADR for a Waived or Superseded row: every such row names an ADR present in decision-record.md. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: A missing ADR for a Waived or Superseded row: every such row names an ADR present in decision-record.md.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A missing ADR for a Waived or Superseded row: every such row names an ADR present in decision-record.md.

### Case sensitivity in mode-cue resolution: probes in mixed case resolve the same as lower case. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Case sensitivity in mode-cue resolution: probes in mixed case resolve the same as lower case.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Case sensitivity in mode-cue resolution: probes in mixed case resolve the same as lower case.

### Catastrophic backtracking in the TS gate regexes: five adversarial shapes stayed under 40 ms. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Catastrophic backtracking in the TS gate regexes: five adversarial shapes stayed under 40 ms.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Catastrophic backtracking in the TS gate regexes: five adversarial shapes stayed under 40 ms.

### Prototype-key command injection through `workflowMode`: ruled out by `Object.prototype.hasOwnProperty.call` at `command-attach.ts:865`. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Prototype-key command injection through `workflowMode`: ruled out by `Object.prototype.hasOwnProperty.call` at `command-attach.ts:865`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Prototype-key command injection through `workflowMode`: ruled out by `Object.prototype.hasOwnProperty.call` at `command-attach.ts:865`.

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS
[None yet]

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Max iterations reached. Synthesis next. Review verdict: CONDITIONAL

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT
- Two sibling lineages (opus-medium-1, opus-medium-2) run in parallel; a prior generation was archived under review-archive/20261124T044309Z.

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pending | - | - |
| `checklist_evidence` | core | pending | - | - |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
32 files listed in review-scope-files.txt (code, tests, command docs, 012 and 013 packet docs).
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 5
- Convergence threshold: 0.1
- Session lineage: sessionId=fanout-opus-medium-3-1795495423434-9mvwzq, parentSessionId=2026-11-24T04:43:35.629Z, generation=2, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Per-iteration budget: 24 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Started: 2026-11-24T04:45:03Z
<!-- MACHINE-OWNED: END -->
