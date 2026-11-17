# Deep Review Strategy - doctor-docs pass four

## 1. OVERVIEW

- Session `fanout-doctor-docs-4-1794669272137-9v23rz`, generation 1, lineage mode `new`.
- Detached fan-out lineage for the `doctor-docs` area of command-surfacing review pass four.
- Write surface is this lineage directory only. Review targets are read-only. The repository test suites are not run here: they write temp fixtures outside the lineage, and a single out-of-scope write fails the lineage.
- Holdout hygiene: no `command-prompts.jsonl` or `holdout-prompts.jsonl` is opened; the only prompt material read is a `split: tune` row already materialized in a scratch artifact and the non-holdout tests that name prompts.

## 2. TOPIC

Review the `doctor-docs` files changed since review pass three (`0cdc9fa3ef`, HEAD `400c90e158`) plus the shared docs that describe them:

- `.skilled/commands/create/assets/create-skill-presentation.txt`
- `.skilled/commands/doctor/_routes.yaml`
- `.skilled/commands/doctor/scripts/agents-md-check.cjs`
- `.skilled/commands/doctor/scripts/tests/agents-md-check.test.cjs`

The diff is 4 files, +11/-9. The brief asks five questions: behaviour on claude, codex, opencode, pi, devin and dsh; whether a refusal, question or command mention can still attach or start a mutating command; whether the transcript scorer counts a load, followed step or offer that did not happen; holdout hygiene; and docs that disagree with code.

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS

- No code fixes; findings only.
- No review of files outside the `doctor-docs` area and the shared docs/context named in the scope.
- No prompt-corpus reading, no holdout inspection, no transcript scoring beyond the test contracts already in the tree.
- No re-litigation of the pass-three lineage's carried P1 on `hook-wiring-check.cjs`; that file is outside this pass's area.

## 5. STOP CONDITIONS

- Hard cap: 3 iterations (`config.maxIterations`).
- Convergence threshold 0.10 on the severity-weighted new-findings ratio.
- Stop policy `convergence`; at the cap the stop reason is `maxIterationsReached`.
- Stop early only on the legal-stop gates (dimension coverage + required traceability protocols + evidence/scope/coverage gates).

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

- Tracing the changed A11 detail to its two consumers (the presentation's repair table and the embed engine's router write) found the one actionable gap in an otherwise clean diff. (iteration 1)
- Querying the derived `command-bridges.generated.json` as data, rather than reading a prompt corpus, proved all six removed phrases reached the advisor surface's removal. (iteration 1)
- Comparing the create presentation line against `GATE_3_CHOICE_RELATED` and its parity test proved the canonical wording match without a runtime branch. (iteration 1)
- Reading the derived `commandPolicies` instead of the route prose settled the attach question: every `mutating: mutates` doctor route is `ask`, and only read-only or add-only spec-folder routes are `run`. (iteration 2)
- The refusal/question guards and the spec 016/024 evidence closed the security and traceability passes without a new finding. (iteration 2)

## 9. WHAT FAILED

- The A11-specific troubleshooting row was assumed to cover every A11 finding; it covers missing rows only, so the malformed-row case has no named repair. Recorded as `DR4-P2-001`, not a failed approach. (iteration 1)
- No new finding came from the security or traceability pass; the only active item remains the carried P2. (iteration 2)

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### A cross-runtime defect in the changed create presentation is ruled out: the line is plain text, the canonical constant is shared, and the parity test covers it. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: A cross-runtime defect in the changed create presentation is ruled out: the line is plain text, the canonical constant is shared, and the parity test covers it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A cross-runtime defect in the changed create presentation is ruled out: the line is plain text, the canonical constant is shared, and the parity test covers it.

### A cross-runtime rename gap is ruled out: the command is a symlink on Claude and Cursor, a generated file at the new name on Codex, Pi and DSH, and absent by design on Devin; no old-name command file remains. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: A cross-runtime rename gap is ruled out: the command is a symlink on Claude and Cursor, a generated file at the new name on Codex, Pi and DSH, and absent by design on Devin; no old-name command file remains.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A cross-runtime rename gap is ruled out: the command is a symlink on Claude and Cursor, a generated file at the new name on Codex, Pi and DSH, and absent by design on Devin; no old-name command file remains.

### A hidden-coupling finding on `lines.length - missing.length` is ruled out as a current finding: no input in the check's stated contract produces a wrong count, and the malformed test covers the subtraction. (iteration 3) -- BLOCKED (iteration 3, 1 attempts)
- What was tried: A hidden-coupling finding on `lines.length - missing.length` is ruled out as a current finding: no input in the check's stated contract produces a wrong count, and the malformed test covers the subtraction. (iteration 3)
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A hidden-coupling finding on `lines.length - missing.length` is ruled out as a current finding: no input in the check's stated contract produces a wrong count, and the malformed test covers the subtraction. (iteration 3)

### A maintainability finding on comment hygiene is ruled out: the new comment carries the why and no spec, task or phase label. (iteration 3) -- BLOCKED (iteration 3, 1 attempts)
- What was tried: A maintainability finding on comment hygiene is ruled out: the new comment carries the why and no spec, task or phase label. (iteration 3)
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A maintainability finding on comment hygiene is ruled out: the new comment carries the why and no spec, task or phase label. (iteration 3)

### A maintainability finding on whitespace or conflict markers is ruled out: `git diff --check` over the four changed files is clean. (iteration 3) -- BLOCKED (iteration 3, 1 attempts)
- What was tried: A maintainability finding on whitespace or conflict markers is ruled out: `git diff --check` over the four changed files is clean. (iteration 3)
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A maintainability finding on whitespace or conflict markers is ruled out: `git diff --check` over the four changed files is clean. (iteration 3)

### A mutating command attached or started by a refusal, question or mention is ruled out: mutating doctor routes derive `ask`, and `command-attach.ts:470-483` suppresses no-edit and command-only-mention prompts, with the guards test covering both. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: A mutating command attached or started by a refusal, question or mention is ruled out: mutating doctor routes derive `ask`, and `command-attach.ts:470-483` suppresses no-edit and command-only-mention prompts, with the guards test covering both.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A mutating command attached or started by a refusal, question or mention is ruled out: mutating doctor routes derive `ask`, and `command-attach.ts:470-483` suppresses no-edit and command-only-mention prompts, with the guards test covering both.

### A P0/P1 in the A11 count logic is ruled out: the count is derived from the same arrays that produce the printed lines, and the test's malformed row keeps its rule path so it is not double-counted as missing (`agents-md-check.test.cjs:761-762`). -- BLOCKED (iteration 1, 1 attempts)
- What was tried: A P0/P1 in the A11 count logic is ruled out: the count is derived from the same arrays that produce the printed lines, and the test's malformed row keeps its rule path so it is not double-counted as missing (`agents-md-check.test.cjs:761-762`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A P0/P1 in the A11 count logic is ruled out: the count is derived from the same arrays that produce the printed lines, and the test's malformed row keeps its rule path so it is not double-counted as missing (`agents-md-check.test.cjs:761-762`).

### A P1 on the new sub-track wording is ruled out: the canonical Gate 3 menu and `suggest-subtracks.mjs` own sub-track creation, and the create workflow consumes an existing `spec_path` rather than promising to create one. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: A P1 on the new sub-track wording is ruled out: the canonical Gate 3 menu and `suggest-subtracks.mjs` own sub-track creation, and the create workflow consumes an existing `spec_path` rather than promising to create one.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A P1 on the new sub-track wording is ruled out: the canonical Gate 3 menu and `suggest-subtracks.mjs` own sub-track creation, and the create workflow consumes an existing `spec_path` rather than promising to create one.

### A P1 on the removed doctor phrases is ruled out: the remaining phrases cover each route's core requests, the derived bridge data is in sync, and the hand-off tests pin the generic repair/release prompts as no-match. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: A P1 on the removed doctor phrases is ruled out: the remaining phrases cover each route's core requests, the derived bridge data is in sync, and the hand-off tests pin the generic repair/release prompts as no-match.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A P1 on the removed doctor phrases is ruled out: the remaining phrases cover each route's core requests, the derived bridge data is in sync, and the hand-off tests pin the generic repair/release prompts as no-match.

### A spec/code contradiction on the phrase removal is ruled out: the `a494145dd0` body names the two false-offer reproductions, the `024` tests pin the refusal behavior, and the 016 floors are reported unchanged. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: A spec/code contradiction on the phrase removal is ruled out: the `a494145dd0` body names the two false-offer reproductions, the `024` tests pin the refusal behavior, and the 016 floors are reported unchanged.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A spec/code contradiction on the phrase removal is ruled out: the `a494145dd0` body names the two false-offer reproductions, the `024` tests pin the refusal behavior, and the 016 floors are reported unchanged.

### A test-brittleness finding on the new assertion is ruled out: the test pins the detail contract and the malformed state, and the existing lines keep the rule-path assertion. (iteration 3) -- BLOCKED (iteration 3, 1 attempts)
- What was tried: A test-brittleness finding on the new assertion is ruled out: the test pins the detail contract and the malformed state, and the existing lines keep the rule-path assertion. (iteration 3)
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A test-brittleness finding on the new assertion is ruled out: the test pins the detail contract and the malformed state, and the existing lines keep the rule-path assertion. (iteration 3)

### A transcript-scorer phantom-count finding is ruled out as out of area: the changed files contain no transcript-scoring code; the only scorer-facing change is the manifest-to-bridge data checked above. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: A transcript-scorer phantom-count finding is ruled out as out of area: the changed files contain no transcript-scoring code; the only scorer-facing change is the manifest-to-bridge data checked above.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A transcript-scorer phantom-count finding is ruled out as out of area: the changed files contain no transcript-scoring code; the only scorer-facing change is the manifest-to-bridge data checked above.

### Feature-catalog drift on the doctor routing policy is ruled out: the catalog's gating, `readOnly`, and three-word reach claims match the generated data and the deriver. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Feature-catalog drift on the doctor routing policy is ruled out: the catalog's gating, `readOnly`, and three-word reach claims match the generated data and the deriver.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Feature-catalog drift on the doctor routing policy is ruled out: the catalog's gating, `readOnly`, and three-word reach claims match the generated data and the deriver.

### Re-opening the A11 count arithmetic is ruled out: the count still derives from the same arrays and the malformed test's rule path remains intact. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Re-opening the A11 count arithmetic is ruled out: the count still derives from the same arrays and the malformed test's rule path remains intact.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Re-opening the A11 count arithmetic is ruled out: the count still derives from the same arrays and the malformed test's rule path remains intact.

### The `sk-skill.md` "OpenCode skills" description stays ruled out as pre-existing and defensible: it is not a changed line and the `.skilled/skills` target is the OpenCode-origin skill tree. (iteration 2) -- BLOCKED (iteration 3, 1 attempts)
- What was tried: The `sk-skill.md` "OpenCode skills" description stays ruled out as pre-existing and defensible: it is not a changed line and the `.skilled/skills` target is the OpenCode-origin skill tree. (iteration 2)
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The `sk-skill.md` "OpenCode skills" description stays ruled out as pre-existing and defensible: it is not a changed line and the `.skilled/skills` target is the OpenCode-origin skill tree. (iteration 2)

### The `sk-skill.md` description saying "OpenCode skills" is noted but ruled out as a finding: it predates the rename (the old `skill.md` carried the same line), it is not a changed line, and the command's `.skilled/skills` target is the OpenCode-origin skill tree. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: The `sk-skill.md` description saying "OpenCode skills" is noted but ruled out as a finding: it predates the rename (the old `skill.md` carried the same line), it is not a changed line, and the command's `.skilled/skills` target is the OpenCode-origin skill tree.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The `sk-skill.md` description saying "OpenCode skills" is noted but ruled out as a finding: it predates the rename (the old `skill.md` carried the same line), it is not a changed line, and the command's `.skilled/skills` target is the OpenCode-origin skill tree.

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS

- A holdout-leak finding is ruled out so far: the changed files do not read either prompt corpus; `_routes.yaml` only declares trigger phrases, and the route derivation output was checked without opening a prompt row. (iteration 1)
- A cross-runtime branching defect in the changed presentation is ruled out so far: `create-skill-presentation.txt` is plain text read by every runtime, and the canonical Gate 3 constant it must match lives in one shared module. (iteration 1)
- A P0/P1 in the A11 count logic is ruled out: the count is derived from the same arrays that build the printed lines, and the test's malformed row keeps its rule path so it is not reported missing. (iteration 1)
- A P1 on the removed doctor phrases is ruled out: the remaining phrases cover each route's core requests, the derived bridge data is in sync, and the hand-off test pins the generic repair and release-note prompts as no-match. (iteration 1)
- A P1 on the create sub-track wording is ruled out: the canonical Gate 3 menu and `suggest-subtracks.mjs` own sub-track creation, and the create workflow consumes an existing `spec_path`. (iteration 1)
- A transcript-scorer phantom-count finding is out of area: the changed files contain no transcript-scoring code. (iteration 1)
- A mutating command attached or started by a refusal, question or mention is ruled out: mutating doctor routes derive `ask`, and `command-attach.ts:470-483` suppresses no-edit and command-only-mention prompts, with the guards test covering both. (iteration 2)
- A cross-runtime rename gap is ruled out: the command is a symlink on Claude and Cursor, a generated file at the new name on Codex, Pi and DSH, and absent by design on Devin; no old-name command file remains. (iteration 2)
- A spec/code contradiction on the phrase removal is ruled out: the `a494145dd0` body names the two false-offer reproductions, the `024` tests pin the refusal behavior, and the 016 floors are reported unchanged. (iteration 2)
- Feature-catalog drift on the doctor routing policy is ruled out: the catalog's gating, `readOnly`, and three-word reach claims match the generated data and the deriver. (iteration 2)

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: none remaining; all four dimensions are covered. - Focus area: synthesis only. - Reason: the three-iteration cap is reached, the only active finding is the carried P2, and no new maintainability issue exists. - Rotation status: complete (correctness, security, traceability, maintainability). - Blocked/productive carry-forward: carry `DR4-P2-001` into the report; do not re-enter the ruled-out directions. - Required evidence: the final report's Active Finding Registry, Planning Packet and Audit Appendix. - Recovery note: none. Review verdict: PASS

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT

### Bounded Context Snapshot

- **Target pointers**: the four changed files above; the diff `0cdc9fa3ef..400c90e158` is +11/-9; the changed lines are `agents-md-check.cjs:798-809`, `agents-md-check.test.cjs:763-764`, `_routes.yaml:403-406,797-806`, and `create-skill-presentation.txt:89`.
- **Behavior claims to verify**: A11 now names a malformed row in its detail when nothing is missing; the create Q3 option C matches the canonical `GATE_3_CHOICE_RELATED` constant; the removed `/doctor:setup` and `/doctor:update` phrases keep generic code-repair and release-note questions off those routes; the remaining phrases stay three or more words and still reach their derived bridges; the test suite's A11 malformed case pins the new detail.
- **Reuse and conventions**: A11 states are PASS/FINDING/UNKNOWN/INFO; the doctor presentation owns the repair mapping; `_routes.yaml` is the source of truth for route phrases and mutation class, and `derive-command-bridges.cjs` copies them into `command-bridges.generated.json`; `GATE_3_CHOICE_RELATED` is the canonical Gate 3 option C; `review-core.md` owns P0/P1/P2 reach calibration.
- **Prior context (read-only, outside this area)**: pass-three lineage `doctor-docs-3` carried P1 `DR3-P1-001` on `hook-wiring-check.cjs:264-269` (attached node flag spellings). That file is not in this pass's area; the carried finding is noted for continuity only.
- **Review risks and gaps**: no `resource-map.md` in the packet; the reducer-owned DB and runtime mirror are not exercised; the repo suites are not run because their temp fixtures are outside the lineage write surface; no holdout row is inspected; the derived bridge file is checked as data, not regenerated.

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
[Alignment checks completed across core and overlay protocols]

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | [pending/pass/partial/fail/blocked] | [N] | [details] |
| `checklist_evidence` | core | [pending/pass/partial/fail/blocked] | [N] | [details] |
| `skill_agent` | overlay | [pending/pass/partial/fail/blocked/notApplicable] | [N] | [details] |
| `agent_cross_runtime` | overlay | [pending/pass/partial/fail/blocked/notApplicable] | [N] | [details] |
| `feature_catalog_code` | overlay | [pending/pass/partial/fail/blocked/notApplicable] | [N] | [details] |
| `playbook_capability` | overlay | [pending/pass/partial/fail/blocked/notApplicable] | [N] | [details] |
<!-- MACHINE-OWNED: END -->

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| `.skilled/commands/create/assets/create-skill-presentation.txt` | D1 | 1 | 0 P0, 0 P1, 0 P2 | correctness complete; canonical wording verified |
| `.skilled/commands/doctor/_routes.yaml` | D1, D2, D3 | 2 | 0 P0, 0 P1, 0 P2 | security + traceability complete; policies and phrases verified in derived data |
| `.skilled/commands/doctor/scripts/agents-md-check.cjs` | D1 | 1 | 0 P0, 0 P1, 0 P2 | correctness complete; count arithmetic verified |
| `.skilled/commands/doctor/scripts/tests/agents-md-check.test.cjs` | D1 | 1 | 0 P0, 0 P1, 0 P2 | correctness complete; new assertion verified |
| `.skilled/commands/doctor/assets/doctor-agents-md-presentation.txt` | D1 | 1 | 0 P0, 0 P1, 1 P2 | partial; `DR4-P2-001` repair mapping gap |
| `.skilled/commands/doctor/assets/doctor-agents-md-check.yaml` | D1 | 1 | 0 P0, 0 P1, 0 P2 | correctness complete |
| `.skilled/commands/create/sk-skill.md` | D1 | 1 | 0 P0, 0 P1, 0 P2 | correctness complete |
| `.skilled/commands/create/assets/create-skill-auto.yaml` | D1 | 1 | 0 P0, 0 P1, 0 P2 | correctness complete for the context-save edge |
| `.skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs` | D1 | 1 | 0 P0, 0 P1, 0 P2 | correctness complete |
| `.skilled/skills/system-spec-kit/runtime/tests/hooks/gate-3-menu-parity.test.mjs` | D1 | 1 | 0 P0, 0 P1, 0 P2 | correctness complete |
| `.skilled/skills/system-spec-kit/references/structure/folder-structure.md` | D1 | 1 | 0 P0, 0 P1, 0 P2 | correctness complete for the sub-track edge |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/doctor-helper-handoff.ts` | D1, D2 | 2 | 0 P0, 0 P1, 0 P2 | security + traceability complete for the phrase-domain edge |
| `.skilled/skills/system-skill-advisor/runtime/tests/doctor-helper-handoff.vitest.ts` | D1, D2 | 2 | 0 P0, 0 P1, 0 P2 | security + traceability complete for the no-match cases |
| `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json` | D1, D2, D3 | 2 | 0 P0, 0 P1, 0 P2 | derived-data sync and policy rows verified |
| `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs` | D2 | 2 | 0 P0, 0 P1, 0 P2 | policy derivation verified |
| `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts` | D2 | 2 | 0 P0, 0 P1, 0 P2 | refusal/question guard verified |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts` | D2 | 2 | 0 P0, 0 P1, 0 P2 | refusal/question/request cases verified |
| `.skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/doctor-command-routing.md` | D3 | 2 | 0 P0, 0 P1, 0 P2 | catalog claims match the policy and reach |
| `.skilled/manual-testing-playbook/doctor-commands/doctor-setup-run.md` | D3 | 2 | 0 P0, 0 P1, 0 P2 | typed-command scenario; no removed phrase quoted |
| `.skilled/manual-testing-playbook/doctor-commands/doctor-update-check.md` | D3 | 2 | 0 P0, 0 P1, 0 P2 | typed-command scenario; no removed phrase quoted |
<!-- MACHINE-OWNED: END -->

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 3
- Convergence threshold: 0.10
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-doctor-docs-4-1794669272137-9v23rz, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder (narrowed by `review-scope-4.txt` to the doctor-docs area)
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Started: 2026-11-14T15:26:10Z
<!-- MACHINE-OWNED: END -->
