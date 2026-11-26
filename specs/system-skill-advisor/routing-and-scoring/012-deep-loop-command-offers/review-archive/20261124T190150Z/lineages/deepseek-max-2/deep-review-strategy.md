---
title: Deep Review Strategy - 012 Deep-Loop Command Offers (deepseek-max-2)
description: Session tracking for the fan-out review lineage deepseek-max-2 over the deep-loop command-offer packet, focused on the traceability protocols.
trigger_phrases:
  - "deep review strategy 012"
  - "command offers review strategy"
importance_tier: normal
contextType: planning
version: 1.0.0.0
---

# Deep Review Strategy - Session Tracking

## 2. TOPIC

Review of `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers` (spec-folder target): the deep-loop command-offer routing that turns a deep research/review ask into a typed command offer in the skill-advisor brief, plus every fix round the packet records, with the operator focus on the sixth round (REQ-023 to REQ-034, AC-030 to AC-042, ADR-005, ADR-006).

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS

- Reworking the scoring model, lane weights or fusion arithmetic beyond what the packet's REQs claim.
- Reviewing packets other than 012; packet 013 appears only where 012 cites it as a dependency.
- Running the repository's suites, build or git commands as proof work: evidence is read from the tree, and tests are read as sources.

---

## 5. STOP CONDITIONS

- `stopPolicy: max-iterations` with `maxIterations: 7`: the loop runs to the cap and convergence is telemetry only.
- Early stop only through the workflow's own blockers (three consecutive failed iterations, pause sentinel, duration).

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
- P1 (Required): 0
- P2 (Suggestions): 12
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED

- Running the 347-case shared fixture through both gate copies read-only (TypeScript through tsx, Python through importlib): it proves the two copies agree on every pinned column in two calls and turned a suspected divergence class into a clean surface (iteration 1)
- Reading a REQ paragraph beside the test that pins it, then counting what the test actually holds: it surfaces a stale count in one pass where re-reading prose would not (iteration 1)
- Resolving every `path:line` cell in the AC table against the tree and printing the line it lands on: anchor drift becomes visible without running the suite (iteration 1)

---

## 9. WHAT FAILED

- Reading `command-attach.ts` top to bottom before the probes: the predicate graph is only judgeable through its outcomes, so the full read cost more than the probe it preceded (iteration 1)
- Treating the AC's cited line numbers as likely correct: three of the four spot-checked anchors were stale, so each citation now needs its line printed before it is trusted (iteration 1)

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **A behaviour defect behind the documentation findings.** Every failing cell was cross-checked against the code it describes; the code holds in each case. The defects are in what the packet says about itself. -- RULED OUT (iteration 7, 1 attempt)
- What was tried: **A behaviour defect behind the documentation findings.** Every failing cell was cross-checked against the code it describes; the code holds in each case. The defects are in what the packet says about itself.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **A closeout that drops a refinement link.** `synthesis-closeout.cjs:406` reads the key the reducer writes. -- RULED OUT (iteration 5, 1 attempt)
- What was tried: **A closeout that drops a refinement link.** `synthesis-closeout.cjs:406` reads the key the reducer writes.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **A closure statement that claims more than its rows allow.** `Closeable: No` matches AC-040's `Unmet`; no other row is `Unmet`. -- RULED OUT (iteration 3, 1 attempt)
- What was tried: **A closure statement that claims more than its rows allow.** `Closeable: No` matches AC-040's `Unmet`; no other row is `Unmet`.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **A corpus count the packet invents.** The baseline file exists and the recorded counts agree with the cells that cite them. -- RULED OUT (iteration 6, 1 attempt)
- What was tried: **A corpus count the packet invents.** The baseline file exists and the recorded counts agree with the cells that cite them.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **A decision record that the code does not implement.** ADR-005 and ADR-006 each describe precisely what the gate, the handler and the Python copy do. -- RULED OUT (iteration 6, 1 attempt)
- What was tried: **A decision record that the code does not implement.** ADR-005 and ADR-006 each describe precisely what the gate, the handler and the Python copy do.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **A derived command offered twice.** The `alreadyOffered` set is seeded and extended in the same pass. -- RULED OUT (iteration 5, 1 attempt)
- What was tried: **A derived command offered twice.** The `alreadyOffered` set is seeded and extended in the same pass.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **A lost typed command when two commands are typed.** `typedCommandIn` returns the longest key by design, and the served head reads the ordered list instead, so the "longest wins" behaviour is not a defect. REQ-025 states this split explicitly. -- RULED OUT (iteration 1, 1 attempt)
- What was tried: **A lost typed command when two commands are typed.** `typedCommandIn` returns the longest key by design, and the served head reads the ordered list instead, so the "longest wins" behaviour is not a defect. REQ-025 states this split explicitly.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **A mode surface the drift guard misses.** The command table, the cue words, the router signals and the shared patterns are all compared. -- RULED OUT (iteration 6, 1 attempt)
- What was tried: **A mode surface the drift guard misses.** The command table, the cue words, the router signals and the shared patterns are all compared.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **A Python/TypeScript predicate divergence.** Both copies agree on all 347 fixture cases; the divergence class that earlier rounds found is not present at the gate layer. -- RULED OUT (iteration 1, 1 attempt)
- What was tried: **A Python/TypeScript predicate divergence.** Both copies agree on all 347 fixture cases; the divergence class that earlier rounds found is not present at the gate layer.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **A refinement that loses its own entry in the reducer.** The same-file fold and the other-file split both behave as decided, and the closeout reads the same link. -- RULED OUT (iteration 5, 1 attempt)
- What was tried: **A refinement that loses its own entry in the reducer.** The same-file fold and the other-file split both behave as decided, and the closeout reads the same link.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **A refusal-verb gap in the gate.** Hunted for a common refusal verb the fixture misses; the nineteen `RUN_ASK_REFUSAL_LEADS` entries plus the `do not even think about` idiom cover the six REQ-023 prompts and the three keep controls, and the conjunction rule (`command-attach.ts:735`) keeps "skip it and deep review the parser" a request. No gap reached the gate. -- RULED OUT (iteration 1, 1 attempt)
- What was tried: **A refusal-verb gap in the gate.** Hunted for a common refusal verb the fixture misses; the nineteen `RUN_ASK_REFUSAL_LEADS` entries plus the `do not even think about` idiom cover the six REQ-023 prompts and the three keep controls, and the conjunction rule (`command-attach.ts:735`) keeps "skip it and deep review the parser" a request. No gap reached the gate.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **A requirement with no acceptance row.** The map is complete in both directions. -- RULED OUT (iteration 6, 1 attempt)
- What was tried: **A requirement with no acceptance row.** The map is complete in both directions.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **A ruled-out direction written as a permanent prohibition.** One-attempt rulings carry a reopen line; only repeated evidence blocks. -- RULED OUT (iteration 5, 1 attempt)
- What was tried: **A ruled-out direction written as a permanent prohibition.** One-attempt rulings carry a reopen line; only repeated evidence blocks.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **A scope breach.** No finding sits outside the pre-bound scope list. -- RULED OUT (iteration 7, 1 attempt)
- What was tried: **A scope breach.** No finding sits outside the pre-bound scope list.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **A Verification Summary that disagrees with the boxes behind it.** Counted mechanically; it agrees. -- RULED OUT (iteration 3, 1 attempt)
- What was tried: **A Verification Summary that disagrees with the boxes behind it.** Counted mechanically; it agrees.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **AC-036 to AC-038 being the only drifted cells.** AC-033, AC-034, AC-044, AC-045 and AC-046 carry the same defect class, so the earlier finding is not an isolated slip. -- RULED OUT (iteration 3, 1 attempt)
- What was tried: **AC-036 to AC-038 being the only drifted cells.** AC-033, AC-034, AC-044, AC-045 and AC-046 carry the same defect class, so the earlier finding is not an isolated slip.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **An uncovered requirement or dimension.** Coverage is complete on both axes. -- RULED OUT (iteration 7, 1 attempt)
- What was tried: **An uncovered requirement or dimension.** Coverage is complete on both axes.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **Command injection through a degraded row's supplied string.** The string is only printed when it is a tracked command owned by (or merged into) the row's own skill; three hostile strings were dropped. -- RULED OUT (iteration 4, 1 attempt)
- What was tried: **Command injection through a degraded row's supplied string.** The string is only printed when it is a tracked command owned by (or merged into) the row's own skill; three hostile strings were dropped.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **Prototype pollution through a compiled route.** Every lookup on the route and on both command tables is an own-key check, and the six malformed shapes all fail closed. -- RULED OUT (iteration 4, 1 attempt)
- What was tried: **Prototype pollution through a compiled route.** Every lookup on the route and on both command tables is an own-key check, and the six malformed shapes all fail closed.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **ReDoS through the loop-ask grammar.** Long repeated prompts stayed under 7 ms; the window bound and the forward-search cache remove the quadratic shape REQ-030 records. -- RULED OUT (iteration 4, 1 attempt)
- What was tried: **ReDoS through the loop-ask grammar.** Long repeated prompts stayed under 7 ms; the window bound and the forward-search cache remove the quadratic shape REQ-030 records.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **REQ-007's compiled-contract staleness.** The recorded digests could have lagged the edited command docs; all 31 recompute. -- RULED OUT (iteration 2, 1 attempt)
- What was tried: **REQ-007's compiled-contract staleness.** The recorded digests could have lagged the edited command docs; all 31 recompute.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **REQ-014 resting on a neighbour's probe.** N9's prompt matches the requirement's quoted prompt exactly, so the row is its own evidence. -- RULED OUT (iteration 2, 1 attempt)
- What was tried: **REQ-014 resting on a neighbour's probe.** N9's prompt matches the requirement's quoted prompt exactly, so the row is its own evidence.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **REQ-022's changelog omission.** The changelog could have failed to name the typed-on-stuck exception or the refusal verbs; both rules are stated at `.skilled/changelog/skilled/v4.2.0.0.md:483` and `:484`, and the brief options at `:212`. -- RULED OUT (iteration 2, 1 attempt)
- What was tried: **REQ-022's changelog omission.** The changelog could have failed to name the typed-on-stuck exception or the refusal verbs; both rules are stated at `.skilled/changelog/skilled/v4.2.0.0.md:483` and `:484`, and the brief options at `:212`.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **Secret exposure through argv.** The prompt travels on stdin. -- RULED OUT (iteration 4, 1 attempt)
- What was tried: **Secret exposure through argv.** The prompt travels on stdin.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS

- A refusal-verb gap in the gate: the nineteen `RUN_ASK_REFUSAL_LEADS` entries plus the `do not even think about` idiom cover the six REQ-023 prompts and the three keep controls, and the conjunction rule keeps "skip it and deep review the parser" a request (iteration 1, evidence: `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:688`)
- A lost typed command when two commands are typed: `typedCommandIn` returning the longest key is the documented split, and the served head reads the ordered list instead (iteration 1, evidence: `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:304`)
- A Python/TypeScript predicate divergence at the gate layer: both copies agree on all 347 fixture cases (iteration 1, evidence: `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:1`)

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- None: this is the last iteration under `stopPolicy: max-iterations`. The synthesis compiles the report from the twelve active findings, both protocol results and the gate summary above. Review verdict: PASS

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT

### Bounded Context Snapshot

- Target pointers: `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts` (offer gate) and its Python mirror `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py`; the shared fixture `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json`; the two deep presentation files and their command docs; the deep-review reducer and closeout scripts under `.skilled/skills/system-deep-loop/runtime/scripts/`.
- Behavior claims: REQ-001 to REQ-046 in `spec.md` §4, SC-001 to SC-006 in §5, the AC table in `acceptance-criteria.md`, and ADR-001 to ADR-009 in `decision-record.md`. The operator focus is the sixth round: REQ-023 to REQ-034, AC-030 to AC-042, ADR-005, ADR-006.
- Reuse and conventions: the gate is one predicate set mirrored in TypeScript and Python; the shared fixture is the only coupling that keeps the two copies from drifting, and probe reruns (`scratch/probes/`) are the recorded measurement channel.
- Review risks and gaps: the scope list is a pre-bound 51-file list; evidence cells in the AC table are the most drift-prone surface; a probe run is not reproducible here, so measured claims are checked against the committed probe output rather than rerun.

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | partial | 1 | REQ-023 to REQ-031 mapped; REQ-031's counts fail (P2-1) |
| `checklist_evidence` | core | partial | 1 | AC-030 to AC-038 opened; AC-036 to AC-038 anchors fail (P2-1..3) |
| `skill_agent` | overlay | notApplicable | - | The target is a spec folder whose implementation is runtime code plus commands, not a skill-owned agent definition |
| `agent_cross_runtime` | overlay | notApplicable | - | No agent definition is claimed by this packet's REQs |
| `feature_catalog_code` | overlay | notApplicable | - | No feature catalog entry is claimed by this packet's REQs |
| `playbook_capability` | overlay | notApplicable | - | No playbook capability is claimed by this packet's REQs |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts | D1, D3 | 1 | 1 | partial |
| .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py | D1, D3 | 1 | 2 | partial |
| .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts | - | - | 0 | pending |
| .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts | - | - | 0 | pending |
| .skilled/skills/system-skill-advisor/runtime/lib/render.ts | - | - | 0 | pending |
| .skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts | D1, D3 | 1 | 0 | partial |
| .skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts | D1, D3 | 1 | 0 | partial |
| .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts | D1, D3 | 1 | 0 | partial |
| .skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts | - | - | 0 | pending |
| .skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts | - | - | 0 | pending |
| .skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json | D1, D3 | 1 | 1 | partial |
| .skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts | - | - | 0 | pending |
| .skilled/skills/system-skill-advisor/runtime/tests/command-attach.vitest.ts | - | - | 0 | pending |
| .skilled/skills/system-skill-advisor/runtime/tests/command-brief-golden.vitest.ts | - | - | 0 | pending |
| .skilled/skills/system-skill-advisor/runtime/tests/command-head-length.vitest.ts | - | - | 0 | pending |
| .skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts | D1, D3 | 1 | 1 | partial |
| .skilled/skills/system-skill-advisor/runtime/tests/render-child-session.vitest.ts | - | - | 0 | pending |
| .skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py | D3 | 1 | 1 | partial |
| .skilled/skills/system-skill-advisor/runtime/tests/cli-degraded-command-contract.vitest.ts | - | - | 0 | pending |
| .skilled/skills/system-skill-advisor/runtime/tests/handlers/advisor-recommend-typed-command.vitest.ts | - | - | 0 | pending |
| .skilled/skills/system-skill-advisor/runtime/tests/handlers/advisor-recommend-duplicate-command.vitest.ts | - | - | 0 | pending |
| .skilled/skills/system-skill-advisor/runtime/tests/scorer/deep-loop-ask-routing.vitest.ts | - | - | 0 | pending |
| .skilled/skills/system-skill-advisor/runtime/tests/scorer/deep-loop-plural-noun.vitest.ts | - | - | 0 | pending |
| .skilled/skills/system-skill-advisor/runtime/tests/scorer/doctor-handoff-command.vitest.ts | - | - | 0 | pending |
| .skilled/skills/system-skill-advisor/runtime/tests/scorer/multi-typed-command-gates.vitest.ts | - | - | 0 | pending |
| .skilled/skills/system-skill-advisor/runtime/tests/scorer/stage-one-loop-subject.vitest.ts | - | - | 0 | pending |
| .skilled/skills/system-skill-advisor/runtime/tests/subprocess-typed-fields.vitest.ts | - | - | 0 | pending |
| .skilled/skills/system-skill-advisor/runtime/tests/typed-on-stuck-serving.vitest.ts | D3 | 1 | 1 | partial |
| .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs | - | - | 0 | pending |
| .skilled/skills/system-deep-loop/runtime/scripts/synthesis-closeout.cjs | - | - | 0 | pending |
| .skilled/skills/system-deep-loop/runtime/tests/unit/reduce-state-refinement-other-file.vitest.ts | - | - | 0 | pending |
| .skilled/skills/system-deep-loop/runtime/tests/unit/synthesis-closeout-refinements.vitest.ts | - | - | 0 | pending |
| .skilled/skills/system-deep-loop/runtime/tests/unit/deep-review-state-reducer.vitest.ts | - | - | 0 | pending |
| .skilled/skills/system-deep-loop/runtime/tests/unit/deep-review-strategy-heading.vitest.ts | - | - | 0 | pending |
| .skilled/skills/system-deep-loop/deep-review/scripts/tests/reduce-state-traceability-and-refines.test.cjs | - | - | 0 | pending |
| .skilled/commands/deep/review.md | - | - | 0 | pending |
| .skilled/commands/deep/research.md | - | - | 0 | pending |
| .skilled/commands/deep/assets/deep-review-presentation.txt | - | - | 0 | pending |
| .skilled/commands/deep/assets/deep-research-presentation.txt | - | - | 0 | pending |
| .skilled/hooks/injection-contract.md | - | - | 0 | pending |
| .skilled/changelog/skilled/v4.2.0.0.md | - | - | 0 | pending |
| specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md | D3 | 1 | 1 | partial |
| specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/plan.md | - | - | 0 | pending |
| specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md | - | - | 0 | pending |
| specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md | D3 | 1 | 3 | partial |
| specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/implementation-summary.md | - | - | 0 | pending |
| specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/decision-record.md | - | - | 0 | pending |
| specs/system-skill-advisor/routing-and-scoring/013-deep-loop-offer-in-hint/spec.md | - | - | 0 | pending |
| specs/system-skill-advisor/routing-and-scoring/013-deep-loop-offer-in-hint/plan.md | - | - | 0 | pending |
| specs/system-skill-advisor/routing-and-scoring/013-deep-loop-offer-in-hint/tasks.md | - | - | 0 | pending |
| specs/system-skill-advisor/routing-and-scoring/013-deep-loop-offer-in-hint/implementation-summary.md | - | - | 0 | pending |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 7
- Convergence threshold: 0.10
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-deepseek-max-2-1795544069299-46zw3s, parentSessionId=2026-11-24T18:14:20.000Z, generation=6, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 24 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=spec_code, checklist_evidence; overlay=skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability
- Started: 2026-11-24T18:16:30Z
<!-- MACHINE-OWNED: END -->
