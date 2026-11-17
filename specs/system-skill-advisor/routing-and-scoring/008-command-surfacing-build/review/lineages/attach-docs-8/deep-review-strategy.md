---
title: Deep Review Strategy - attach-docs-8
description: Review packet for the pass-eight command-surfacing attach-docs area: the typed-command matcher comment, its suffix tests and the CONTRIBUTING rename.
importance_tier: normal
contextType: planning
---

# Deep Review Strategy - attach-docs-8

## 1. OVERVIEW

- **Topic:** Review pass eight of the command-surfacing build, area `attach-docs`.
- **Scope:** the three files named in `review/review-scope-8.txt` under area `attach-docs`, diffed with the scope file's command.
- **Mode:** review, fan-out lineage, autonomous.

## 2. TOPIC

Review pass eight of `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build`, area `attach-docs`: the typed-command matcher comment and suffix tests in the advisor runtime, and this branch's net change to `CONTRIBUTING.md` (the `/create:skill` to `/create:sk-skill` rename).

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS

- The scorer files (`score-command-transcripts.mjs`, `command-transcript-score.vitest.ts`, the routing-accuracy README) belong to the sibling `scorer-8` lineage.
- The root README rename was reviewed in pass seven by `docs-7`; this pass reads only the `CONTRIBUTING.md` net change.
- No code, spec, command or document outside the three scope files is modified by this review.

## 5. STOP CONDITIONS

- Convergence threshold 0.10 on the severity-weighted new-findings ratio.
- Maximum 5 iterations.
- Every configured dimension plus the two required core traceability protocols covered before a legal stop.

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
- Resolved: 1

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED

- Direct diff read of `1c3d62def5a..3416b5e0526` plus a source-reproduced matcher probe: it showed the reworded comment matches the shared suffix union and that every REQ-003 input still resolves. (iteration 1)
- Reading the command argument hints as context, rather than treating the comment as the specification: it separated a comment-accuracy question from a behavior question. (iteration 1)
- A scripted sweep of every `argument-hint` under `.skilled/commands` (46 files): it proved the matcher's seven-token set is exactly the documented union, with no undetected suffix. (iteration 2)
- Comparing `origin/main` to `HEAD` for `CONTRIBUTING.md` rather than reading the working file alone: it isolated the one-line rename and showed no stale occurrence remains. (iteration 2)
- Probing the no-edit gate with a suffix-bearing prompt: it showed the gate is consulted before the suffix branch and still returns no command. (iteration 3)
- Reading the module's import list and every constant table: it confirmed the matcher has no I/O, environment or dynamic-pattern surface. (iteration 3)
- Grepping the test file for every `:with-*` token, rather than assuming the "with-modifier" test covered all three: it found `:with-phases` absent and turned the gap into one actionable P2. (iteration 4)
- Re-reading the active P2's cited lines in the stability pass: it confirmed the finding is unchanged and correctly placed, and that no new finding appeared. (iteration 5)

## 9. WHAT FAILED

- Nothing failed in iteration 1. The behavioral probes were all deterministic and the diff was a one-paragraph comment change.
- Nothing failed in iteration 2. Every named command and suffix token resolved on the first check.
- Nothing failed in iteration 3. Every security probe was deterministic and no exposure was found.
- Nothing failed in iteration 4. The grep found the gap on the first pass; no dead-end probe was needed.
- Nothing failed in iteration 5. The stability re-read found no new finding and the attacher/scorer unions still agree.

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### A broken `CONTRIBUTING.md` command reference: iteration 2 resolved all six names under `.skilled/commands`. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: A broken `CONTRIBUTING.md` command reference: iteration 2 resolved all six names under `.skilled/commands`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A broken `CONTRIBUTING.md` command reference: iteration 2 resolved all six names under `.skilled/commands`.

### A cross-surface suffix divergence: the attacher and the transcript scorer read the same union. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: A cross-surface suffix divergence: the attacher and the transcript scorer read the same union.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A cross-surface suffix divergence: the attacher and the transcript scorer read the same union.

### A documented suffix the matcher refuses: the sweep of all 46 argument hints found no token outside the seven-word set, the same union phase 038's `spec_code` check recorded. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: A documented suffix the matcher refuses: the sweep of all 46 argument hints found no token outside the seven-word set, the same union phase 038's `spec_code` check recorded.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A documented suffix the matcher refuses: the sweep of all 46 argument hints found no token outside the seven-word set, the same union phase 038's `spec_code` check recorded.

### A false `:auto` match inside `:automation` or `:autopilot2`: the negative lookahead rejects a following letter or digit, and the chain cannot settle on a shorter prefix. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:211] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: A false `:auto` match inside `:automation` or `:autopilot2`: the negative lookahead rejects a following letter or digit, and the chain cannot settle on a shorter prefix. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:211]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A false `:auto` match inside `:automation` or `:autopilot2`: the negative lookahead rejects a following letter or digit, and the chain cannot settle on a shorter prefix. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:211]

### A longest-key regression from the suffix branch: `/create:skill-parent:auto` keeps `/create:skill-parent`, because the shorter retired key is rejected by the `-parent` continuation before the suffix rule applies. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:224] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: A longest-key regression from the suffix branch: `/create:skill-parent:auto` keeps `/create:skill-parent`, because the shorter retired key is rejected by the `-parent` continuation before the suffix rule applies. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:224]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A longest-key regression from the suffix branch: `/create:skill-parent:auto` keeps `/create:skill-parent`, because the shorter retired key is rejected by the `-parent` continuation before the suffix rule applies. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:224]

### A missing command name in `CONTRIBUTING.md`: each of the six names resolves to a file, and the six covered include the two doctor commands outside the changed line. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: A missing command name in `CONTRIBUTING.md`: each of the six names resolves to a file, and the six covered include the two doctor commands outside the changed line.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A missing command name in `CONTRIBUTING.md`: each of the six names resolves to a file, and the six covered include the two doctor commands outside the changed line.

### A new exposure from the retired map: the map is fixed data and the accepted limit covers its mention-guard behavior. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: A new exposure from the retired map: the map is fixed data and the accepted limit covers its mention-guard behavior.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A new exposure from the retired map: the map is fixed data and the accepted limit covers its mention-guard behavior.

### A new finding from the stability re-read: the cited lines are unchanged and every probe from iterations 1 to 3 still returns its expected result. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: A new finding from the stability re-read: the cited lines are unchanged and every probe from iterations 1 to 3 still returns its expected result.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A new finding from the stability re-read: the cited lines are unchanged and every probe from iterations 1 to 3 still returns its expected result.

### A prompt-controlled regex injection through the suffix path: the suffix pattern is a constant and no prompt substring is interpolated into it. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: A prompt-controlled regex injection through the suffix path: the suffix pattern is a constant and no prompt substring is interpolated into it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A prompt-controlled regex injection through the suffix path: the suffix pattern is a constant and no prompt substring is interpolated into it.

### A stale `CONTRIBUTING.md` command reference: all six named commands still resolve. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: A stale `CONTRIBUTING.md` command reference: all six named commands still resolve.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A stale `CONTRIBUTING.md` command reference: all six named commands still resolve.

### A stale old-name surface in the changed file: `CONTRIBUTING.md` has no `/create:skill` occurrence left, and the old `create/skill.md` file is gone. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: A stale old-name surface in the changed file: `CONTRIBUTING.md` has no `/create:skill` occurrence left, and the old `create/skill.md` file is gone.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A stale old-name surface in the changed file: `CONTRIBUTING.md` has no `/create:skill` occurrence left, and the old `create/skill.md` file is gone.

### A suffix that escapes the no-edit gate: the gate is consulted first and a suffix-bearing no-edit prompt returns no command. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: A suffix that escapes the no-edit gate: the gate is consulted first and a suffix-bearing no-edit prompt returns no command.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A suffix that escapes the no-edit gate: the gate is consulted first and a suffix-bearing no-edit prompt returns no command.

### A suffix that promotes a non-owner command: the owner check runs after `typedCommandIn` returns the mapped name, and a non-owner top skill still withholds it. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: A suffix that promotes a non-owner command: the owner check runs after `typedCommandIn` returns the mapped name, and a non-owner top skill still withholds it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A suffix that promotes a non-owner command: the owner check runs after `typedCommandIn` returns the mapped name, and a non-owner top skill still withholds it.

### A test that asserts the wrong command for a suffix input: each positive case names the command its hint advertises, and each negative case names an unknown suffix the matcher refuses. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: A test that asserts the wrong command for a suffix input: each positive case names the command its hint advertises, and each negative case names an unknown suffix the matcher refuses.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A test that asserts the wrong command for a suffix input: each positive case names the command its hint advertises, and each negative case names an unknown suffix the matcher refuses.

### Catastrophic backtracking in `MODE_SUFFIX`: every repetition consumes one `:`-prefixed literal, the alternatives are prefix-disambiguated, and the trailing lookahead fails once, so scanning stays linear in prompt length. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:211] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Catastrophic backtracking in `MODE_SUFFIX`: every repetition consumes one `:`-prefixed literal, the alternatives are prefix-disambiguated, and the trailing lookahead fails once, so scanning stays linear in prompt length. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:211]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Catastrophic backtracking in `MODE_SUFFIX`: every repetition consumes one `:`-prefixed literal, the alternatives are prefix-disambiguated, and the trailing lookahead fails once, so scanning stays linear in prompt length. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:211]

### Re-reporting the retired-name refusal limit: this iteration reproduced it and read the packet's accepted-limit row, so it stays out of the active findings. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/027-review-pass-four-remediation/spec.md:212] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Re-reporting the retired-name refusal limit: this iteration reproduced it and read the packet's accepted-limit row, so it stays out of the active findings. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/027-review-pass-four-remediation/spec.md:212]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Re-reporting the retired-name refusal limit: this iteration reproduced it and read the packet's accepted-limit row, so it stays out of the active findings. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/027-review-pass-four-remediation/spec.md:212]

### The comment being inaccurate after the pass-seven rewrite: each sentence was reproduced against the matcher, including the shared-union sentence and the chain example. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: The comment being inaccurate after the pass-seven rewrite: each sentence was reproduced against the matcher, including the shared-union sentence and the chain example.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The comment being inaccurate after the pass-seven rewrite: each sentence was reproduced against the matcher, including the shared-union sentence and the chain example.

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS

[Populated during the loop]

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: none remaining. - Focus area: synthesis. - Reason: iteration 5 reaches `maxIterations: 5`; all four dimensions have a full iteration and the stability pass, and the only active finding is the recorded P2. - Rotation status: correctness, traceability, security and maintainability complete; stability pass complete. - Blocked/productive carry-forward: the P2 matrix gap carries to synthesis as an advisory and a deferred item; nothing is blocked. - Required evidence: none further; the finding carries file:line and the documented input. Review verdict: PASS

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT

### Bounded Context Snapshot

- **Target pointers:** `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts` (lines 197-245, 448-536); `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts` (lines 396-502); `CONTRIBUTING.md:155`.
- **Behavior claims:** commit `3416b5e0526` rewords the matcher comment so a `:with-*` modifier typed on any tracked command still names that command; `CONTRIBUTING.md` renames `/create:skill` to `/create:sk-skill`; every command the file names must exist under `.skilled/commands`.
- **Reuse and conventions:** the generated `TRACKED_COMMANDS`/`COMMAND_ROWS` tables, the `MODE_SUFFIX` chain constant, the shared `commandOnlyMentioned` mention guard, and the pass-seven review report (`review-report.md`) that recorded the accepted limits.
- **Review risks and gaps:** the scope diff for the test file is empty at `1c3d62def5a..3416b5e0526`; the tests were written in phase 038. The recorded limits in `review-brief-8.txt` are not re-reported without a new breaking input. `resource-map.md` is absent, so the Resource Map Coverage Gate is skipped.

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pass | 2 | REQ-003/AC-003 hold for every enumerated suffix; the attacher and transcript scorer read the same union |
| `checklist_evidence` | core | notApplicable | 1 | Phase-parent packet has no `checklist.md`; the pass-eight brief and scope file are the operative checklist |
| `skill_agent` | overlay | notApplicable | 5 | No skill definition in the changed surface |
| `agent_cross_runtime` | overlay | notApplicable | 5 | No agent mirror in the changed surface |
| `feature_catalog_code` | overlay | notApplicable | 5 | No feature-catalog page in the changed surface |
| `playbook_capability` | overlay | notApplicable | 5 | No playbook in the changed surface |
<!-- MACHINE-OWNED: END -->

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts` | correctness, traceability, security, maintainability | 5 | 0 P0, 0 P1, 0 P2 | complete |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts` | correctness, maintainability | 5 | 0 P0, 0 P1, 1 P2 | complete |
| `CONTRIBUTING.md` | traceability, security, maintainability | 5 | 0 P0, 0 P1, 0 P2 | complete |
<!-- MACHINE-OWNED: END -->

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 5
- Convergence threshold: 0.1
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-attach-docs-8-1794832880917-x4m8iz, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 24 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Started: 2026-11-16T12:57:17Z
<!-- MACHINE-OWNED: END -->
