---
title: Deep Review Strategy - 012 deep-loop command offers (lineage opus-medium-2)
description: Session tracking for the opus-medium-2 fan-out lineage reviewing the deep-loop command-offer gate.
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
- Re-reviewing advisor scoring lanes outside the command-attach path.
- Fixing anything: findings only.

---

## 5. STOP CONDITIONS
- stopPolicy=max-iterations: run all 5 iterations; convergence is telemetry only.

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
- P2 (Suggestions): 6
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED
- Executing command-attach.ts directly under Node type stripping and skill_advisor.py functions directly: exact gate outputs without the missing dist (iteration 1)
- Scaling probes (2k-400k chars) separating linear from per-match quadratic cost, then re-measuring at the 10k schema cap (iteration 2)
- Tracing one claim through every brief path (native, CLI fallback, Python subprocess) into render.ts (iteration 3)
- Differential TS-vs-Python run over fixture prompts and six variants each (iteration 4)
- Executing the deferred-route branch on mixed-cue prompts (iteration 5)

---

## 9. WHAT FAILED
- Live advisor CLI: runtime dist missing in this worktree (exit 69); rebuilding would write outside the lineage (iteration 1)

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### Changelog overclaiming the refusal vocabulary: it names "don't", "never" and "no need to" only, which match RUN_ASK_NEGATED. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Changelog overclaiming the refusal vocabulary: it names "don't", "never" and "no need to" only, which match RUN_ASK_NEGATED.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Changelog overclaiming the refusal vocabulary: it names "don't", "never" and "no need to" only, which match RUN_ASK_NEGATED.

### Hidden drift between the two regex copies on case, apostrophe, punctuation or spacing variants. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Hidden drift between the two regex copies on case, apostrophe, punctuation or spacing variants.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Hidden drift between the two regex copies on case, apostrophe, punctuation or spacing variants.

### No-edit wording beside a typed `/deep:review` ("/deep:review the parser, no edits") keeps the typed command; ruled out as a defect because the reader typed the command and a deep review does not edit the reviewed code. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: No-edit wording beside a typed `/deep:review` ("/deep:review the parser, no edits") keeps the typed command; ruled out as a defect because the reader typed the command and a deep review does not edit the reviewed code.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No-edit wording beside a typed `/deep:review` ("/deep:review the parser, no edits") keeps the typed command; ruled out as a defect because the reader typed the command and a deep review does not edit the reviewed code.

### Prompt-injected `typed: true` flag: the flag is set only by `attachTypedCommand` and by the CLI fallback reading the CLI's own JSON, never from prompt text. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Prompt-injected `typed: true` flag: the flag is set only by `attachTypedCommand` and by the CLI fallback reading the CLI's own JSON, never from prompt text.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Prompt-injected `typed: true` flag: the flag is set only by `attachTypedCommand` and by the CLI fallback reading the CLI's own JSON, never from prompt text.

### Stage-one rule leaking a command: the rule scores only; the command path re-applies the full gate. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Stage-one rule leaking a command: the rule scores only; the command path re-applies the full gate.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Stage-one rule leaking a command: the rule scores only; the command path re-applies the full gate.

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS
- Typed /deep:review beside no-edit wording keeping the command: reader typed it and the loop does not edit reviewed code (iteration 1)
- Prompt-injected typed flag: set only by attachTypedCommand and CLI JSON (iteration 2)

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: none (max iterations reached); synthesis. - Focus area: carry R1-P1-001 / R3-P1-001 to the merge with their downgrade trigger (end-to-end run with a built dist). - Reason: stopPolicy max-iterations. - Rotation status: 4 of 4 dimensions done, plus one cross-reference pass. - Required evidence: n/a. Review verdict: CONDITIONAL

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT
- resource-map.md not present; skipping coverage gate
- Prior generation archived under review-archive/20261124T044309Z (one iteration). Not re-read as evidence; this lineage reviews fresh.

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | partial | 1-5 | REQ-020 served path diverges; 013 REQ-006 fails on Python brief path; D2 loop-name clause narrower |
| `checklist_evidence` | core | partial | 3 | AC-027 evidence covers attachCommand only |
| `skill_agent` | overlay | notApplicable | 4 | no skill/agent surface in scope |
| `agent_cross_runtime` | overlay | notApplicable | 4 | no agent definitions changed |
| `feature_catalog_code` | overlay | notApplicable | 4 | no catalog entries in scope |
| `playbook_capability` | overlay | notApplicable | 4 | no playbook scenarios in scope |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| `.skilled/changelog/skilled/v4.2.0.0.md` | - | - | - | pending |
| `.skilled/commands/deep/assets/deep-research-presentation.txt` | - | - | - | pending |
| `.skilled/commands/deep/assets/deep-review-presentation.txt` | - | - | - | pending |
| `.skilled/commands/deep/research.md` | - | - | - | pending |
| `.skilled/commands/deep/review.md` | - | - | - | pending |
| `.skilled/hooks/injection-contract.md` | - | - | - | pending |
| `.skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts` | - | - | - | pending |
| `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts` | - | - | - | pending |
| `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts` | - | - | - | pending |
| `.skilled/skills/system-skill-advisor/runtime/lib/render.ts` | - | - | - | pending |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts` | - | - | - | pending |
| `.skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts` | - | - | - | pending |
| `.skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts` | - | - | - | pending |
| `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py` | - | - | - | pending |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts` | - | - | - | pending |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-attach.vitest.ts` | - | - | - | pending |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-brief-golden.vitest.ts` | - | - | - | pending |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-head-length.vitest.ts` | - | - | - | pending |
| `.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts` | - | - | - | pending |
| `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json` | - | - | - | pending |
| `.skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py` | - | - | - | pending |
| `.skilled/skills/system-skill-advisor/runtime/tests/render-child-session.vitest.ts` | - | - | - | pending |
| `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md` | - | - | - | pending |
| `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/decision-record.md` | - | - | - | pending |
| `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/implementation-summary.md` | - | - | - | pending |
| `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/plan.md` | - | - | - | pending |
| `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md` | - | - | - | pending |
| `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md` | - | - | - | pending |
| `specs/system-skill-advisor/routing-and-scoring/013-deep-loop-offer-in-hint/implementation-summary.md` | - | - | - | pending |
| `specs/system-skill-advisor/routing-and-scoring/013-deep-loop-offer-in-hint/plan.md` | - | - | - | pending |
| `specs/system-skill-advisor/routing-and-scoring/013-deep-loop-offer-in-hint/spec.md` | - | - | - | pending |
| `specs/system-skill-advisor/routing-and-scoring/013-deep-loop-offer-in-hint/tasks.md` | - | - | - | pending |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 5
- Convergence threshold: 0.1
- Stop policy: max-iterations
- Session lineage: sessionId=fanout-opus-medium-2-1795495423434-9mvwzq, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Per-iteration budget: 24 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Started: 2026-11-24T04:45:13Z
<!-- MACHINE-OWNED: END -->
