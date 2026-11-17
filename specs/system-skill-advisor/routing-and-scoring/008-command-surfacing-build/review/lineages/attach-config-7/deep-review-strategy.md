---
title: Deep Review Strategy - attach-config-7
description: Review pass seven strategy for the typed command matcher, the advisor vitest config and the guarding tests.
importance_tier: normal
contextType: planning
---

# Deep Review Strategy - Session Tracking

## 2. TOPIC

Review pass seven of command surfacing, lineage `attach-config-7`. Area files:
`runtime/lib/command-attach.ts` (typed command matcher, including the chained
`:auto`/`:confirm`/`:autopilot`/`:unattended` and `:with-context`/`:with-phases`/`:with-research`
suffix reading), `runtime/vitest.config.ts` (inherited `AI_SESSION_CHILD` cleared, per-run temp
folder), and the tests that pin a child or parent session plus the new boundary and arena-buffer
tests. Diffs are read with `git -c core.fsmonitor=false diff 85550ee946e 1c3d62def5a -- <path>`.

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS

- Not re-scoring stored transcripts or re-running the routing accuracy scorer.
- Not reviewing the scorer's unsafe-verdict logic, the arena builder's production script, or the
  root README; those are the `scorer-7` and `docs-7` areas.
- Not changing code under review. Findings only.

## 5. STOP CONDITIONS

- Convergence at `convergenceThreshold: 0.1`, or `maxIterations: 3`, whichever comes first.
- Any active P0 keeps the verdict at FAIL and the loop continues under the cap.
- No retry of a direction recorded as exhausted in section 10.

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
- P2 (Suggestions): 2
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED

- Direct diff read plus a reproduction of the changed matcher's exact regexes outside the repository. It proved the positive chain, the unknown-suffix refusal and the boundaries without running the suite or writing outside the lineage. (iteration 1)
- Sweeping every `argument-hint:` line under `.skilled/commands` (46 files) settled the vocabulary question outright: the matcher's set is the complete union, so no missing suffix exists. (iteration 2)
- Reproducing the transcript scorer's `commandParts` split against the same typed input exposed a real downstream parser divergence that a file-local read would have missed. (iteration 2)

## 9. WHAT FAILED

- Nothing failed. Running the repository suite was deliberately not attempted: the lineage write surface forbids cache and temp writes outside it, and the behavior under review is pure string matching. (iteration 1)

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### A false `:auto` match inside `:automation`: the negative lookahead rejects the following letter and the chain cannot back down to zero repetitions, which the existing guard test still pins. [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:449] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: A false `:auto` match inside `:automation`: the negative lookahead rejects the following letter and the chain cannot back down to zero repetitions, which the existing guard test still pins. [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:449]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A false `:auto` match inside `:automation`: the negative lookahead rejects the following letter and the chain cannot back down to zero repetitions, which the existing guard test still pins. [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:449]

### A missing documented suffix: the sweep found none; the matcher's set is the complete union. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:210] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: A missing documented suffix: the sweep found none; the matcher's set is the complete union. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:210]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A missing documented suffix: the sweep found none; the matcher's set is the complete union. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:210]

### A per-command vocabulary requirement in the spec: no spec requirement narrows the suffix set per command, so the shared set is not a spec contradiction. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/goal.md:365] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: A per-command vocabulary requirement in the spec: no spec requirement narrows the suffix set per command, so the shared set is not a spec contradiction. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/goal.md:365]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A per-command vocabulary requirement in the spec: no spec requirement narrows the suffix set per command, so the shared set is not a spec contradiction. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/goal.md:365]

### A security regression from the deleted child flag: the deletion is test-process only and production reads the flag at `render.ts:529`. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:529] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: A security regression from the deleted child flag: the deletion is test-process only and production reads the flag at `render.ts:529`. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:529]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A security regression from the deleted child flag: the deletion is test-process only and production reads the flag at `render.ts:529`. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:529]

### A temp-folder exposure: `mkdtempSync` creates the folder owner-only and the exit handler removes it on normal exit. [SOURCE: .skilled/skills/system-skill-advisor/runtime/vitest.config.ts:17] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: A temp-folder exposure: `mkdtempSync` creates the folder owner-only and the exit handler removes it on normal exit. [SOURCE: .skilled/skills/system-skill-advisor/runtime/vitest.config.ts:17]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A temp-folder exposure: `mkdtempSync` creates the folder owner-only and the exit handler removes it on normal exit. [SOURCE: .skilled/skills/system-skill-advisor/runtime/vitest.config.ts:17]

### Catastrophic backtracking: the only new quantifier is `(?::(?:...))+`, each repetition consumes at least one character, and the alternatives are prefix-disambiguated, so the engine backtracks linearly over a prompt-length slice. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:210] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Catastrophic backtracking: the only new quantifier is `(?::(?:...))+`, each repetition consumes at least one character, and the alternatives are prefix-disambiguated, so the engine backtracks linearly over a prompt-length slice. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:210]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Catastrophic backtracking: the only new quantifier is `(?::(?:...))+`, each repetition consumes at least one character, and the alternatives are prefix-disambiguated, so the engine backtracks linearly over a prompt-length slice. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:210]

### Double reporting the previous review's file-extension limit: not repeated; the recorded limit states the behavior and this iteration found no new input that breaks it. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Double reporting the previous review's file-extension limit: not repeated; the recorded limit states the behavior and this iteration found no new input that breaks it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Double reporting the previous review's file-extension limit: not repeated; the recorded limit states the behavior and this iteration found no new input that breaks it.

### Re-reporting the macOS-only `isolation-check.sh` limit or the `started of offered` limit: neither is touched by this area, and no new input breaks them. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Re-reporting the macOS-only `isolation-check.sh` limit or the `started of offered` limit: neither is touched by this area, and no new input breaks them.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Re-reporting the macOS-only `isolation-check.sh` limit or the `started of offered` limit: neither is touched by this area, and no new input breaks them.

### Regex injection from prompt text: the suffix pattern is a constant and user text is only tested against it; `commandOnlyMentioned` still escapes the command phrase before building its own pattern. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:315] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Regex injection from prompt text: the suffix pattern is a constant and user text is only tested against it; `commandOnlyMentioned` still escapes the command phrase before building its own pattern. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:315]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Regex injection from prompt text: the suffix pattern is a constant and user text is only tested against it; `commandOnlyMentioned` still escapes the command phrase before building its own pattern. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:315]

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS

[Review angles investigated and eliminated, consolidated from iteration dead-end data]

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: none remaining; all four configured dimensions are covered. - Focus area: synthesis. - Reason: iteration 3 reaches `maxIterations: 3`; the cap is a legal terminal stop and the remaining findings are P2 advisories. - Rotation status: correctness, traceability, security and maintainability complete. - Blocked/productive carry-forward: none blocked; direct read plus source-reproduced probes were productive in all three passes. - Required evidence: none further; the two P2 findings carry file:line and a concrete input. - Recovery note: not in recovery. Review verdict: PASS

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT

### Bounded Context Snapshot

- Target pointers: `runtime/lib/command-attach.ts` lines 190-263 (boundary, `MODE_SUFFIX`,
  `typedCommandIn`, `typedCommandForTop`, `attachCommand` deep-loop gate at line 513);
  `runtime/vitest.config.ts` lines 1-32 (temp folder and `AI_SESSION_CHILD`);
  `tests/command-attach-guards.vitest.ts` lines 410-470 (typed command boundaries);
  `tests/doctor-brief-render.vitest.ts` lines 70-96 (child marker); 
  `tests/command-behaviour-guards.vitest.ts` lines 750-800 (arena buffer premise).
- Behavior claims to verify: the matcher reads `:auto`, `:confirm`, `:autopilot`,
  `:unattended` and `:with-context`, `:with-phases`, `:with-research`, including chains in any
  order, as the typed command and refuses any other suffix; the vitest config clears an inherited
  `AI_SESSION_CHILD` and gives each run its own temp folder; tests that assert a parent shape
  pin `childSession: false`.
- Reuse and conventions: `commandRowFor`/`TRACKED_COMMANDS` own-key lookup; `sk-code-review`
  severity doctrine; the recorded limits in `review-brief-7.txt` are settled and not reopened.
- Risks and gaps: `lib/scorer/text.ts` and `scripts/routing-accuracy/score-command-transcripts.mjs`
  carry their own suffix rules; they are outside this lineage's area and only count as
  integration evidence. Graph store writes are skipped so the lineage write surface stays inside
  this folder.

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pass | 2 | Accepted vocabulary equals the union of all 46 command `argument-hint` documents; no documented suffix refused. |
| `checklist_evidence` | core | notApplicable | 1 | Phase-parent packet has no `checklist.md`; scope is the five area files. |
| `skill_agent` | overlay | [pending/pass/partial/fail/blocked/notApplicable] | [N] | [details] |
| `agent_cross_runtime` | overlay | [pending/pass/partial/fail/blocked/notApplicable] | [N] | [details] |
| `feature_catalog_code` | overlay | [pending/pass/partial/fail/blocked/notApplicable] | [N] | [details] |
| `playbook_capability` | overlay | [pending/pass/partial/fail/blocked/notApplicable] | [N] | [details] |
<!-- MACHINE-OWNED: END -->

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts` | D1, D3 | 2 | 1 P2 | complete |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts` | D1, D3 | 2 | 0 | complete |
| `.skilled/skills/system-skill-advisor/runtime/vitest.config.ts` | D1 | 1 | 0 | complete |
| `.skilled/skills/system-skill-advisor/runtime/tests/doctor-brief-render.vitest.ts` | D1 | 1 | 0 | complete |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-behaviour-guards.vitest.ts` | D1 | 1 | 0 | complete |
<!-- MACHINE-OWNED: END -->

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 3
- Convergence threshold: 0.1
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-attach-config-7-1794829999759-g4q8yp, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 24 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Started: 2026-11-16T12:04:52Z
<!-- MACHINE-OWNED: END -->
