---
title: Deep Review Strategy - attach-config-9
description: Review pass nine strategy for the typed command matcher, the advisor vitest config and the guarding tests.
importance_tier: normal
contextType: planning
---

# Deep Review Strategy - Session Tracking

## 2. TOPIC

Review pass nine of command surfacing, lineage `attach-config-9`. Area files per
`review/review-scope-9.txt`: `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts`
(typed command matcher and its chained `:auto`/`:confirm`/`:autopilot`/`:unattended` plus
`:with-context`/`:with-phases`/`:with-research` suffix reading), `runtime/vitest.config.ts`
(inherited `AI_SESSION_CHILD` cleared, per-run temp folder exported through TMPDIR, TEMP and TMP),
`runtime/tests/command-attach-guards.vitest.ts` (suffix chain pins) and
`runtime/tests/doctor-brief-render.vitest.ts` (child and parent brief shapes). Each diff is read with
`git -c core.fsmonitor=false diff 85550ee946e 05f776202e0 -- <path>`, then the whole file at
`05f776202e0`.

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS

- Not re-scoring stored transcripts, not building the arena, not running the advisory suite; those
  surfaces belong to `scorer-9`, `arena-config-9` and `docs-9`.
- Not re-reporting a recorded limit: the `:suffix.md` extension read, the heredoc redirect read and
  the macOS-only `isolation-check.sh` are settled unless a new input breaks them.
- Not changing code under review. Findings only, inside this lineage folder.

## 5. STOP CONDITIONS

- Convergence at `convergenceThreshold: 0.1`, or `maxIterations: 8`, whichever comes first.
- Any active P0 keeps the verdict at FAIL.
- No retry of a direction recorded as exhausted in section 9.

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
- P2 (Suggestions): 1
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED

- Importing the area source directly with node's type stripping and calling `typedCommandIn`, `commandOnlyMentioned`, `typedCommandForTop` and `attachCommand` on a probe matrix. The module imports nothing, so the probe exercised the reviewed code itself rather than a transcription, and it settled the chain, the boundaries, the refusal leads and the deep-loop gate in one pass. (iteration 1)
- Sweeping every `AI_SESSION_CHILD` reference under the advisor runtime (8 files, 22 matches) instead of judging the config line alone. It proved that each test which needs the child shape injects the flag, so a process-wide clear cannot weaken a boundary assertion. (iteration 2)
- Comparing the source pattern against an unanchored variant on the suite's own negative inputs. That separated a property the tests actually prove from one they only appear to prove, which is how the single P2 in this pass was found instead of assumed away. (iteration 3)
- Rebuilding the state picture from the files instead of from memory: registry, state log, deltas and narrative were each read back and compared. It caught a reducer-derived dimension mislabel, which a narrative-only check would have left standing. (iteration 4)

## 9. WHAT FAILED

- Nothing failed. The advisor suite was deliberately not run: the lineage write surface forbids the cache and fixture writes a suite run makes, and the changed behaviour is pure string matching that a direct call proves. (iteration 1)

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### A false `:auto` match inside `:automation`: re-checked; the trailing lookahead rejects the following letter and the chain cannot back down to zero repetitions. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:211] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: A false `:auto` match inside `:automation`: re-checked; the trailing lookahead rejects the following letter and the chain cannot back down to zero repetitions. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:211]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A false `:auto` match inside `:automation`: re-checked; the trailing lookahead rejects the following letter and the chain cannot back down to zero repetitions. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:211]

### A false positive on `AC9-P2-001`: re-read the pattern and the four existing negatives; only a chain behind an unknown leading segment separates anchored from unanchored, so the finding stands. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: A false positive on `AC9-P2-001`: re-read the pattern and the four existing negatives; only a chain behind an unknown leading segment separates anchored from unanchored, so the finding stands.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A false positive on `AC9-P2-001`: re-read the pattern and the four existing negatives; only a chain behind an unknown leading segment separates anchored from unanchored, so the finding stands.

### A further correctness defect in the chain: the full probe matrix from iteration 1 still matches the documented contract. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: A further correctness defect in the chain: the full probe matrix from iteration 1 still matches the documented contract.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A further correctness defect in the chain: the full probe matrix from iteration 1 still matches the documented contract.

### A further security defect in the config: the iteration-2 sweep over every `AI_SESSION_CHILD` reference still shows each child-shape test injecting the flag. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: A further security defect in the config: the iteration-2 sweep over every `AI_SESSION_CHILD` reference still shows each child-shape test injecting the flag.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A further security defect in the config: the iteration-2 sweep over every `AI_SESSION_CHILD` reference still shows each child-shape test injecting the flag.

### A hook child inheriting the cleared flag: the hook path's own test launches with the flag set and asserts the child lacks it. [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/measure-brief-cost.vitest.ts:130] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: A hook child inheriting the cleared flag: the hook path's own test launches with the flag set and asserts the child lacks it. [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/measure-brief-cost.vitest.ts:130]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A hook child inheriting the cleared flag: the hook path's own test launches with the flag set and asserts the child lacks it. [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/measure-brief-cost.vitest.ts:130]

### A missing documented suffix: the 46-file sweep found none; the matcher's set is the complete union. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:211] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: A missing documented suffix: the 46-file sweep found none; the matcher's set is the complete union. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:211]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A missing documented suffix: the 46-file sweep found none; the matcher's set is the complete union. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:211]

### A per-command vocabulary requirement in the packet: no requirement narrows the suffix set per command, and the rewritten comment now states the shared-set rule instead of claiming per-command documentation. The previous pass's P2 on that comment is therefore resolved by the diff. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:206] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: A per-command vocabulary requirement in the packet: no requirement narrows the suffix set per command, and the rewritten comment now states the shared-set rule instead of claiming per-command documentation. The previous pass's P2 on that comment is therefore resolved by the diff. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:206]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A per-command vocabulary requirement in the packet: no requirement narrows the suffix set per command, and the rewritten comment now states the shared-set rule instead of claiming per-command documentation. The previous pass's P2 on that comment is therefore resolved by the diff. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:206]

### A second environment dependency in the brief renderer that the test config forgets: `render.ts` reads only `AI_SESSION_CHILD`, and the config clears exactly that name. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:529] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: A second environment dependency in the brief renderer that the test config forgets: `render.ts` reads only `AI_SESSION_CHILD`, and the config clears exactly that name. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:529]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A second environment dependency in the brief renderer that the test config forgets: `render.ts` reads only `AI_SESSION_CHILD`, and the config clears exactly that name. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:529]

### A security regression from clearing the child flag: the clear is test-process only, production still reads the flag at `render.ts:529`, and the suite's child assertions inject the flag rather than inheriting it. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:529] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: A security regression from clearing the child flag: the clear is test-process only, production still reads the flag at `render.ts:529`, and the suite's child assertions inject the flag rather than inheriting it. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:529]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A security regression from clearing the child flag: the clear is test-process only, production still reads the flag at `render.ts:529`, and the suite's child assertions inject the flag rather than inheriting it. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:529]

### A spec contradiction in `spec.md`: the only command-related criterion is that no typed command is ambiguous with its own owner, which `typedCommandForTop`'s ownership gate still enforces. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/spec.md:172] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: A spec contradiction in `spec.md`: the only command-related criterion is that no typed command is ambiguous with its own owner, which `typedCommandForTop`'s ownership gate still enforces. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/spec.md:172]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A spec contradiction in `spec.md`: the only command-related criterion is that no typed command is ambiguous with its own owner, which `typedCommandForTop`'s ownership gate still enforces. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/spec.md:172]

### A stale copy of the suffix set inside this area: `MODE_SUFFIX` is the only suffix pattern in the file; no second constant drifted. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:211] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: A stale copy of the suffix set inside this area: `MODE_SUFFIX` is the only suffix pattern in the file; no second constant drifted. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:211]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A stale copy of the suffix set inside this area: `MODE_SUFFIX` is the only suffix pattern in the file; no second constant drifted. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:211]

### A state-integrity defect after the dimension correction: registry, state log, deltas and narrative now agree on one P2 in maintainability. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: A state-integrity defect after the dimension correction: registry, state log, deltas and narrative now agree on one P2 in maintainability.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A state-integrity defect after the dimension correction: registry, state log, deltas and narrative now agree on one P2 in maintainability.

### A temp-folder exposure: carried forward and re-checked against the new three-variable export. `mkdtempSync` creates the directory owner-only, and adding `TEMP` and `TMP` points more children at that same protected folder rather than widening it. No new input reopens the direction. [SOURCE: .skilled/skills/system-skill-advisor/runtime/vitest.config.ts:16] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: A temp-folder exposure: carried forward and re-checked against the new three-variable export. `mkdtempSync` creates the directory owner-only, and adding `TEMP` and `TMP` points more children at that same protected folder rather than widening it. No new input reopens the direction. [SOURCE: .skilled/skills/system-skill-advisor/runtime/vitest.config.ts:16]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A temp-folder exposure: carried forward and re-checked against the new three-variable export. `mkdtempSync` creates the directory owner-only, and adding `TEMP` and `TMP` points more children at that same protected folder rather than widening it. No new input reopens the direction. [SOURCE: .skilled/skills/system-skill-advisor/runtime/vitest.config.ts:16]

### Catastrophic backtracking in the repeated group: carried forward from the prior pass and re-checked, because the group is now quantified. Each repetition consumes at least one character after a mandatory `:`, the alternatives are prefix-distinct apart from `auto`/`autopilot`, and that pair costs one backtrack per repetition, so the engine works in linear time over a prompt-length slice. No new input reopens it. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:211] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Catastrophic backtracking in the repeated group: carried forward from the prior pass and re-checked, because the group is now quantified. Each repetition consumes at least one character after a mandatory `:`, the alternatives are prefix-distinct apart from `auto`/`autopilot`, and that pair costs one backtrack per repetition, so the engine works in linear time over a prompt-length slice. No new input reopens it. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:211]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Catastrophic backtracking in the repeated group: carried forward from the prior pass and re-checked, because the group is now quantified. Each repetition consumes at least one character after a mandatory `:`, the alternatives are prefix-distinct apart from `auto`/`autopilot`, and that pair costs one backtrack per repetition, so the engine works in linear time over a prompt-length slice. No new input reopens it. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:211]

### Re-reporting the macOS-only `isolation-check.sh` limit or the `started of offered` limit: neither is touched by this area and no new input breaks either. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Re-reporting the macOS-only `isolation-check.sh` limit or the `started of offered` limit: neither is touched by this area and no new input breaks either.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Re-reporting the macOS-only `isolation-check.sh` limit or the `started of offered` limit: neither is touched by this area and no new input breaks either.

### Re-reporting the recorded file-extension limit as a behaviour defect: not repeated; no new input breaks the record. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/goal.md:370] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Re-reporting the recorded file-extension limit as a behaviour defect: not repeated; no new input breaks the record. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/goal.md:370]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Re-reporting the recorded file-extension limit as a behaviour defect: not repeated; no new input breaks the record. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/goal.md:370]

### Regex injection from prompt text: the pattern is a constant, the prompt is only matched against it, and `commandOnlyMentioned` still escapes the command phrase before building its own pattern. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:417] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Regex injection from prompt text: the pattern is a constant, the prompt is only matched against it, and `commandOnlyMentioned` still escapes the command phrase before building its own pattern. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:417]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Regex injection from prompt text: the pattern is a constant, the prompt is only matched against it, and `commandOnlyMentioned` still escapes the command phrase before building its own pattern. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:417]

### Secrets reaching a behaviour turn now that the flag is cleared: the turn environment is allowlisted by name and prefix, independent of this config. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs:1033] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Secrets reaching a behaviour turn now that the flag is cleared: the turn environment is allowlisted by name and prefix, independent of this config. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs:1033]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Secrets reaching a behaviour turn now that the flag is cleared: the turn environment is allowlisted by name and prefix, independent of this config. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs:1033]

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 10. RULED OUT DIRECTIONS

[Populated as iterations rule directions out]

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: none remaining; all four configured dimensions are complete. - Focus area: synthesis -- compile `review-report.md` from the registry and the iteration files, derive the verdict from the registry, and close the run. - Reason: the convergence signals and the coverage-age signal are both satisfied at this record; the remaining work is synthesis, not another review pass. - Rotation status: correctness, security, traceability and maintainability complete; one active P2 advisory. - Blocked/productive carry-forward: nothing blocked; the direct-read, sweep and variant-comparison approaches were productive from the first pass. - Required evidence: none further; the single P2 carries file:line, a concrete input and a reproduction. - Recovery note: not in recovery. Review verdict: PASS

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT

### Bounded Context Snapshot

- Target pointers: `runtime/lib/command-attach.ts` (boundary comment 197-212, `MODE_SUFFIX` 211,
  `typedCommandIn` 219-244, `typedCommandForTop` 259-269, `commandOnlyMentioned` 436-470,
  `attachCommand` 483-536); `runtime/vitest.config.ts` 1-35 (temp folder, `AI_SESSION_CHILD`);
  `tests/command-attach-guards.vitest.ts` 415-470 (typed command boundaries);
  `tests/doctor-brief-render.vitest.ts` 76-100 (child/parent policy word).
- Behavior claims to verify: a tracked command followed by `:auto`, `:confirm`, `:autopilot`,
  `:unattended`, `:with-context`, `:with-phases` or `:with-research` reads as that command, in any
  chain order and on any tracked command; an unknown suffix reads as no command; the suite run
  clears an inherited `AI_SESSION_CHILD` and confines every temp write to one per-run folder.
- Reuse and conventions: `sk-code-review` severity doctrine; own-key lookup for generated tables;
  `render.ts:529` is the only renderer env read.
- Review risks and gaps: the transcript scorer, `lib/scorer/text.ts`, `scripts/skill_advisor.py` and
  `lib/render.ts` are integration surfaces owned by other areas; they are read as evidence only.
  The coverage graph is the shared deep-loop database, written through `upsert.cjs` because the
  brief names it as the persistence step.

## 14. CROSS-REFERENCE STATUS

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | [pending] | [N] | [details] |
| `checklist_evidence` | core | [pending] | [N] | [details] |
| `skill_agent` | overlay | [pending] | [N] | [details] |
| `agent_cross_runtime` | overlay | [pending] | [N] | [details] |
| `feature_catalog_code` | overlay | [pending] | [N] | [details] |
| `playbook_capability` | overlay | [pending] | [N] | [details] |

## 15. FILES UNDER REVIEW

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts` | D1, D2, D3, D4 | 3 | 0 | complete |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts` | D1, D2, D3, D4 | 3 | 1 P2 | complete |
| `.skilled/skills/system-skill-advisor/runtime/vitest.config.ts` | D1, D2, D4 | 3 | 0 | complete |
| `.skilled/skills/system-skill-advisor/runtime/tests/doctor-brief-render.vitest.ts` | D1, D2, D3, D4 | 3 | 0 | complete |

## 16. REVIEW BOUNDARIES

- Max iterations: 8
- Convergence threshold: 0.1
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-attach-config-9-1794835877856-5ghgm4, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 24 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Started: 2026-11-16T13:43:33Z
