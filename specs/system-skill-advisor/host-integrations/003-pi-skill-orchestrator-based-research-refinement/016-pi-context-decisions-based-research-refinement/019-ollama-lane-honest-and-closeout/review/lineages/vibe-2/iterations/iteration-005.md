# Review Iteration 005

## Dispatcher

- Mode: review (fan-out lineage `vibe-2`)
- Session: `fanout-vibe-2-1795172940208-84a42n`, generation 1, lineageMode `new`
- Focus: Frontier node F-1-002, dimension `traceability`
- Review target type: `files`
- Operator review focus: the commit set `31ffd18beab`, `1ccbb3283c6`, `dc3979eb451`, `86038dfba80`, `c74042fd559`, `571575632a4`, `5c91b2f3f5d`, `0390556ee2b`, and the ten `docs(specs)` commits `2f5fe41bb9e`..`aaaff7dd9df`.

### How this iteration addressed the operator review focus

The focus names `0390556ee2b` as a test change and warns that a test matching new text while leaving behavior unchecked is a finding. This iteration read both halves of that commit against the code they assert and found both honest. It also checked the acceptance criteria that cite the two tests inside the F-1-002 node scope, and found one verification cell claiming a broader match than the recorded evidence supports.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:140,144,516-535,664,693`
- `.opencode/plugins/system-skill-advisor.js:968-969`
- `.opencode/plugins/tests/system-skill-advisor.test.cjs:43-50,1071-1078`
- `.skilled/hooks/session-handover/pi/session-handover.test.ts:43-54`
- `.skilled/skills/system-skill-advisor/runtime/tests/scorer/semantic-shadow-cosine.vitest.ts:236,261-262,286,305-306,312-324`
- `.skilled/skills/system-skill-advisor/runtime/tests/handlers/semantic-outage-degraded.vitest.ts:6-37`
- `specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/019-ollama-lane-honest-and-closeout/acceptance-criteria.md:56,60,65`
- `specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/019-ollama-lane-honest-and-closeout/implementation-summary.md:61,112-124`
- `specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/019-ollama-lane-honest-and-closeout/decision-record.md:35-42`

## Findings - New

### P0 Findings

None.

### P1 Findings

None new. R1-P1-001 from iteration 1 remains active and keeps this run at CONDITIONAL.

### P2 Findings

1. **AC-005 claims the shipped runs match five earlier runs while the recorded evidence covers two** -- `specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/019-ollama-lane-honest-and-closeout/acceptance-criteria.md:60` -- the verification cell reads "Runs 8 and 9 on the shipped code match runs 3 to 7". The ablation table records flip lists for runs 1 and 2 and for runs 3 and 4 only, and its shipped-code row says "flip lists identical to runs 3 and 4" (`implementation-summary.md:112-113,121`). Runs 5, 6 and 7 have no recorded flip list, so the criterion asserts a match against three runs whose evidence does not exist.
   Finding class: `traceability`
   Scope proof: the claim is in the owning packet's acceptance criteria; the contradicting evidence is in the same packet's implementation summary. Both are packet docs the review focus names as traceability context.
   Affected surface hints: `acceptance-criteria.md` AC-005 verification cell, ablation audit trail, packet closure evidence.
   Case: an operator auditing whether the lane's default weight rests on a fresh measurement reads AC-005, sees that runs 8 and 9 match runs 3 through 7, and looks for the flip lists of runs 5, 6 and 7. The summary records none, so the operator cannot reproduce the comparison the criterion claims and cannot tell whether the match was against two runs or five.

## Traceability Checks

| Protocol | Status | Evidence | Summary |
|----------|--------|----------|---------|
| `spec_code` | partial | `acceptance-criteria.md:60`, `implementation-summary.md:121` | AC-003 and AC-004 are verified by real assertions; AC-005 overstates the run set its match covers. Recorded as R5-P2-001. |
| `checklist_evidence` | pass | `acceptance-criteria.md:56-66` | Every criterion row reads `Met` with a named verification; no `Unmet` row remains, matching the packet's completion criterion. |
| `agent_cross_runtime` | notApplicable | `.skilled/agents/` (no `advisor_status` reference) | No agent definition integrates the advisor's status surface, so there is no agent-to-runtime pair to reconcile. |

## Integration Evidence

- `0390556ee2b`, OpenCode half: the test now accepts `observeEmittedAdvisorPolicy(additionalContext`. That is the shipped call — `finishAdvisorDelivery(additionalContext: string, ...)` builds the output and calls `observeEmittedAdvisorPolicy(additionalContext, {...})` (`user-prompt-submit.ts:516-535`). The argument is the emitted text under its new local name, so the widened alternation matches the refactor rather than loosening the check.
- `0390556ee2b`, Pi half: `CONTINUITY_WRITER` is now the quoted absolute path built from `import.meta.url` (`session-handover.test.ts:46-50`). The assertion still compares against the nudge's own text, so a drift in the nudge's path computation fails the test.
- AC-003 is verified by assertion, not by prose: `semantic-shadow-cosine.vitest.ts:305-306` asserts both `[]` and `disabledReason === 'incomplete_skill_vectors'` for the stale-hash case, and `:261-262` does the same for the missing-vector case.
- AC-004 is verified by assertion: `semantic-outage-degraded.vitest.ts:11` asserts `status: 'runtime_degraded'`.
- AC-001 and AC-011 record different skill totals (14 and 15) because they describe different workspaces: `implementation-summary.md:114` is the fresh isolated daemon and `:123` is main after the merge. Not a contradiction.

## Edge Cases

- **Ambiguity: whether a verification cell is a shipped-behavior surface.** The review focus asks for defects in shipped behavior and for doc claims that mislead an operator. A verification cell is what an operator audits closure against, so it is in scope. Recorded as a finding rather than dismissed as prose.
- **Contradiction: AC-005 says runs 3 to 7, the summary says runs 3 and 4.** Both were read; the summary's table is the narrower and better-evidenced claim, so the criterion is the side that overstates.
- **Missing dependency: no recorded flip list for runs 5, 6 and 7.** Recorded as the finding's substance rather than converted into a pass.

## Confirmed-Clean Surfaces

- The OpenCode test change in `0390556ee2b` matches the shipped call site and still checks the emitted text.
- The Pi test change in `0390556ee2b` still compares against the nudge's own text.
- AC-003's token claim is asserted by two test cases, not merely described.
- AC-004's degraded status is asserted directly.
- No acceptance criterion row reads `Unmet`.

## Ruled Out

- **AC-005's "default 0 asserted by the pass bar" misstates which branch ran.** Ruled out: the criterion's Then clause is "the default weight follows the pass bar", and the pass bar failed, so 0 is the correct outcome. The wording is terse, not false.
- **AC-001's 14/14 and AC-011's 15/15 contradict each other.** Ruled out: they describe the fresh isolated daemon and main respectively, and the summary states both.
- **The OpenCode test change loosened the assertion to accept a wrong argument.** Ruled out: `additionalContext` is the parameter that holds the emitted text.
- **The Pi test change made the assertion tautological.** Ruled out: it compares the nudge's text against a path derived from the test file's own location, so a nudge-side drift still fails.

## Next Focus

- Dimension: `maintainability`
- Focus area: frontier node F-1-005, the documentation and diagnostic surfaces the semantic lane exposes, judged for clarity, pattern compliance and safe follow-on change cost.
- Reason: F-1-002 `traceability` is complete; `maintainability` is the last uncovered dimension and the only remaining graph coverage gap besides it.
- Rotation status: F-1-002 `correctness`, `security` and `traceability` complete; F-1-005 `correctness` and `security` complete.
- Blocked/productive carry-forward: productive — reading a test change against its call site is the check the focus asked for and it cleared both halves.
- Required evidence: the advisor's `SKILL.md`, the feature catalog index, and the changelog sections the commits rewrote.
- Recovery note: none.

Review verdict: CONDITIONAL
