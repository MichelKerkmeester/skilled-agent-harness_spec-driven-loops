# Deep Review Iteration 009

## Dimension

Maintainability -- PASS A: missing regression coverage, dead code, and test-suite structure for `.opencode/plugins/mk-goal.js` and `.opencode/plugins/__tests__/mk-goal-*.test.cjs`.

## Files Reviewed

- `.opencode/plugins/mk-goal.js:177`
- `.opencode/plugins/mk-goal.js:205`
- `.opencode/plugins/mk-goal.js:264`
- `.opencode/plugins/mk-goal.js:290`
- `.opencode/plugins/mk-goal.js:304`
- `.opencode/plugins/mk-goal.js:1053`
- `.opencode/plugins/mk-goal.js:1057`
- `.opencode/plugins/mk-goal.js:1077`
- `.opencode/plugins/mk-goal.js:1085`
- `.opencode/plugins/mk-goal.js:1350`
- `.opencode/plugins/mk-goal.js:1376`
- `.opencode/plugins/mk-goal.js:1378`
- `.opencode/plugins/mk-goal.js:1513`
- `.opencode/plugins/mk-goal.js:1536`
- `.opencode/plugins/mk-goal.js:1588`
- `.opencode/plugins/mk-goal.js:1625`
- `.opencode/plugins/mk-goal.js:1658`
- `.opencode/plugins/__tests__/mk-goal-state.test.cjs:40`
- `.opencode/plugins/__tests__/mk-goal-state.test.cjs:120`
- `.opencode/plugins/__tests__/mk-goal-state.test.cjs:132`
- `.opencode/plugins/__tests__/mk-goal-state.test.cjs:134`
- `.opencode/plugins/__tests__/mk-goal-state.test.cjs:154`
- `.opencode/plugins/__tests__/mk-goal-supervisor.test.cjs:38`
- `.opencode/plugins/__tests__/mk-goal-supervisor.test.cjs:45`
- `.opencode/plugins/__tests__/mk-goal-supervisor.test.cjs:83`
- `.opencode/plugins/__tests__/mk-goal-supervisor.test.cjs:91`
- `.opencode/plugins/__tests__/mk-goal-continuation.test.cjs:116`
- `.opencode/plugins/__tests__/mk-goal-continuation.test.cjs:251`
- `.opencode/plugins/__tests__/mk-goal-tool-path.test.cjs:19`
- `.opencode/plugins/__tests__/mk-goal-export-contract.test.cjs:16`

## Findings by Severity

### P0

None.

### P1

#### DR-009-P1-001 [P1] Current plugin tests do not pin the regression cases for four active behavior/security findings

- File: `.opencode/plugins/__tests__/mk-goal-state.test.cjs:120`
- Claim: The current plugin-test suite has only partial or adjacent assertions for `DR-001-P1-001`, `DR-003-P1-001`, `DR-005-P1-001`, and `DR-006-P1-001`; it would not reliably fail if those fixes regressed in the specific ways already reported.
- Evidence: The injection test renders with `maxInjectionChars: 220` and asserts structural lines and ellipsis, but it never asserts `clippedBlock.length <= 220`, while `renderGoalInjection` returns `buildBlock(sanitizePromptText(...))` without a final whole-block clamp [SOURCE: `.opencode/plugins/__tests__/mk-goal-state.test.cjs:120`, `.opencode/plugins/__tests__/mk-goal-state.test.cjs:132`, `.opencode/plugins/mk-goal.js:1376`, `.opencode/plugins/mk-goal.js:1378`]. The sanitizer test covers active-goal markers, role labels, backticks, and two instruction-reset phrases, but it does not assert broader instruction-smuggling or semantic prompt-injection variants behind `DR-005-P1-001` [SOURCE: `.opencode/plugins/__tests__/mk-goal-state.test.cjs:134`, `.opencode/plugins/__tests__/mk-goal-state.test.cjs:154`, `.opencode/plugins/mk-goal.js:177`, `.opencode/plugins/mk-goal.js:185`]. Supervisor tests cover secret redaction for verifier-returned evidence but not a thrown verifier exception message, which is the unredacted path in `DR-006-P1-001` [SOURCE: `.opencode/plugins/__tests__/mk-goal-supervisor.test.cjs:38`, `.opencode/plugins/__tests__/mk-goal-supervisor.test.cjs:45`, `.opencode/plugins/__tests__/mk-goal-supervisor.test.cjs:83`, `.opencode/plugins/mk-goal.js:1053`, `.opencode/plugins/mk-goal.js:1057`]. Continuation tests cover gate behavior directly but do not integrate a slow verifier, replacement goal, and subsequent continuation attempt on the same `session.idle` path that produced `DR-003-P1-001` [SOURCE: `.opencode/plugins/__tests__/mk-goal-continuation.test.cjs:116`, `.opencode/plugins/__tests__/mk-goal-continuation.test.cjs:251`, `.opencode/plugins/mk-goal.js:1536`, `.opencode/plugins/mk-goal.js:1588`, `.opencode/plugins/mk-goal.js:1592`].
- Counterevidence sought: Exact-search pass across all six `mk-goal-*.test.cjs` files for `maxInjectionChars`, `renderGoalInjection`, prompt-injection terms, `Verifier failed`, and `maybeContinueGoal` found adjacent tests but no whole-block length assertion, thrown-exception secret fixture, or integrated stale-verifier race test.
- Alternative explanation: Some gaps are expected because the known bugs were found by review before fixes were implemented. That does not reduce the maintainability risk: a remediation branch can appear green while reintroducing the same behavior.
- Final severity: P1.
- Confidence: 0.88.
- Downgrade trigger: Downgrade to P2 if remediation adds focused regression tests for the four specific behaviors or if the affected code is removed rather than fixed.
- Finding class: test-isolation / class-of-bug.
- Scope proof: The six test files cover state, lifecycle, supervisor, continuation, tool-path, and export contract; none covers the four exact regression scenarios above.
- Recommendation: Add focused regression assertions before or alongside fixes: whole injection block cap, semantic sanitizer bypass fixture, verifier exception secret fixture, and a stale verifier replacement/continuation integration test.

#### DR-009-P1-002 [P1] Prompt-enhancement tests lock CRAFT and DEPTH but not the required RICCE metadata contract

- File: `.opencode/plugins/__tests__/mk-goal-state.test.cjs:40`
- Claim: The active `DR-004-P1-001` metadata mismatch would not be caught by the current tests because they assert `framework=CRAFT+TIDD-EC`, `methodology=DEPTH`, and CLEAR score fields but never assert a RICCE marker or equivalent metadata field.
- Evidence: `buildEnhancedGoalPrompt` returns `promptEnhancement` with version, methodology, mode, framework, perspectives, CLEAR score, max chars, and char count [SOURCE: `.opencode/plugins/mk-goal.js:290`, `.opencode/plugins/mk-goal.js:304`]. The state and tool-path tests assert framework, methodology, CLEAR score, prompt length, and status output metadata, but exact search found no `RICCE`/`ricce` assertion in the test suite [SOURCE: `.opencode/plugins/__tests__/mk-goal-state.test.cjs:40`, `.opencode/plugins/__tests__/mk-goal-state.test.cjs:41`, `.opencode/plugins/__tests__/mk-goal-state.test.cjs:42`, `.opencode/plugins/__tests__/mk-goal-tool-path.test.cjs:33`, `.opencode/plugins/__tests__/mk-goal-tool-path.test.cjs:39`].
- Counterevidence sought: Searched the plugin tests for `RICCE|ricce` and reviewed the prompt metadata assertions in state and tool-path tests.
- Alternative explanation: RICCE may be documented as a conceptual method rather than a stored metadata key, but the prior finding says phase 007 requires stored prompt metadata to name RICCE; current tests do not adjudicate that contract.
- Final severity: P1.
- Confidence: 0.9.
- Downgrade trigger: Downgrade if the phase 007 acceptance criterion is amended to remove stored RICCE metadata or tests are added that assert the agreed metadata shape.
- Finding class: test-isolation / spec-contract coverage.
- Scope proof: The only prompt-enhancement assertions are in `mk-goal-state.test.cjs` and `mk-goal-tool-path.test.cjs`; neither names RICCE.
- Recommendation: Add a prompt-enhancement metadata regression test that asserts the required RICCE contract explicitly rather than relying on adjacent CRAFT/DEPTH checks.

#### DR-009-P1-003 [P1] Command and overlay documentation drift has no regression harness in the current test suite

- File: `.opencode/plugins/__tests__/mk-goal-export-contract.test.cjs:16`
- Claim: The current `mk-goal-*.test.cjs` suite imports only the plugin module and never validates command markdown, command filename normalization, feature catalogs, or manual-testing playbooks, so `DR-002-P1-001`, `DR-007-P1-001`, `DR-008-P1-001`, and the related unknown-verb contract drift can recur without any test failing.
- Evidence: Every test file imports `../mk-goal.js` through `pathToFileURL` and then exercises plugin helpers or plugin tools; the export-contract test only checks module export shape [SOURCE: `.opencode/plugins/__tests__/mk-goal-export-contract.test.cjs:13`, `.opencode/plugins/__tests__/mk-goal-export-contract.test.cjs:16`, `.opencode/plugins/__tests__/mk-goal-tool-path.test.cjs:19`, `.opencode/plugins/__tests__/mk-goal-state.test.cjs:16`]. The tool-path test proves `executeGoalAction`/`executeGoalStatus`, but it never reads `.opencode/commands/goal_opencode.md`, `.opencode/commands/opencode_goal.md`, feature catalogs, or playbooks [SOURCE: `.opencode/plugins/__tests__/mk-goal-tool-path.test.cjs:27`, `.opencode/plugins/__tests__/mk-goal-tool-path.test.cjs:36`, `.opencode/plugins/__tests__/mk-goal-tool-path.test.cjs:41`].
- Counterevidence sought: Searched all six plugin tests for command names and stale command-surface terms; no command-doc/catalog/playbook validation appeared.
- Alternative explanation: Documentation/catalog validation may live outside `.opencode/plugins/__tests__`, but the iteration scope files named this six-file suite, and no corresponding test surface was present there.
- Final severity: P1.
- Confidence: 0.85.
- Downgrade trigger: Downgrade if an existing non-`mk-goal-*.test.cjs` validator is wired into the same CI gate and checks command markdown names plus catalog/playbook command references.
- Finding class: matrix/evidence / documentation-contract coverage.
- Scope proof: The scoped test suite has no file corresponding to the command markdown or overlay catalog/playbook surfaces that produced the active drift findings.
- Recommendation: Add a lightweight command/overlay contract test or spec validator that reads the command file and catalog/playbook references and asserts one canonical command surface and expected unknown-verb behavior.

### P2

#### DR-009-P2-001 [P2] Graph-metadata deliverable drift is not covered by a phase metadata regression check

- File: `.opencode/plugins/__tests__/mk-goal-export-contract.test.cjs:16`
- Evidence: The current scoped tests are plugin-centric and do not read any phase `graph-metadata.json`, so `DR-007-P2-001` can recur when generated metadata lists non-deliverable or stale key files [SOURCE: `.opencode/plugins/__tests__/mk-goal-export-contract.test.cjs:16`, `.opencode/plugins/__tests__/mk-goal-state.test.cjs:16`, `.opencode/plugins/__tests__/mk-goal-tool-path.test.cjs:19`].
- Finding class: test-isolation / metadata-contract coverage.
- Scope proof: No scoped test file corresponds to phase metadata validation.
- Recommendation: Add a small metadata-shape or phase-output validator for the packet's phase folders, or explicitly rely on a documented system-spec-kit validator if one is already authoritative for this metadata class.

## Coverage Matrix for Prior Findings

- `DR-001-P1-001`: partially covered by `mk-goal-state.test.cjs`, but missing whole-block `maxInjectionChars` assertion.
- `DR-002-P1-001`: no scoped regression test; command docs are not loaded by the suite.
- `DR-003-P1-001`: no scoped regression test for stale verifier plus replacement plus continuation.
- `DR-004-P1-001`: no RICCE metadata assertion.
- `DR-004-P2-001`: no scoped command markdown parser/contract test.
- `DR-005-P1-001`: partial sanitizer tests only; no broader semantic instruction-smuggling fixture.
- `DR-006-P1-001`: normal evidence redaction tested; thrown verifier exception text is not.
- `DR-007-P1-001`: no command-name normalization or docs-vs-live-file test.
- `DR-007-P2-001`: no graph metadata key-file validation in scoped tests.
- `DR-008-P1-001`: no feature-catalog/playbook command-reference validation in scoped tests.

## Dead Code and Pattern Scan

- No actionable `TODO`, `FIXME`, `XXX`, or `HACK` marker was found in `.opencode/plugins/mk-goal.js`; the only `TODO` text is part of placeholder detection in `scoreEnhancedGoalPrompt` [SOURCE: `.opencode/plugins/mk-goal.js:222`].
- The exported plugin factory wires `event`, `experimental.chat.system.transform`, `mk_goal`, and `mk_goal_status`; the `__test` surface exposes pure helpers used by the six tests [SOURCE: `.opencode/plugins/mk-goal.js:1513`, `.opencode/plugins/mk-goal.js:1611`, `.opencode/plugins/mk-goal.js:1620`, `.opencode/plugins/mk-goal.js:1625`, `.opencode/plugins/mk-goal.js:1658`]. No dead exported helper finding was recorded this iteration.
- The scoped tests import from `../mk-goal.js`; no stale plugin import path was found [SOURCE: `.opencode/plugins/__tests__/mk-goal-state.test.cjs:16`, `.opencode/plugins/__tests__/mk-goal-supervisor.test.cjs:28`, `.opencode/plugins/__tests__/mk-goal-continuation.test.cjs:34`, `.opencode/plugins/__tests__/mk-goal-tool-path.test.cjs:19`, `.opencode/plugins/__tests__/mk-goal-export-contract.test.cjs:13`].

## Traceability Checks

- `spec_code`: Not re-run as a new traceability pass; coverage was derived from active finding registry and scoped plugin/test evidence.
- `checklist_evidence`: Not applicable; scoped phase folders remain Level 1 packets without `checklist.md` per prior strategy state.
- `feature_catalog_code`: Coverage gap found because scoped tests do not validate catalog command references.
- `playbook_capability`: Coverage gap found because scoped tests do not validate playbook command references.
- Code graph: stale; graphless fallback used via direct reads and exact searches.

## SCOPE VIOLATIONS

None. Reviewed code/test files were read-only; writes were limited to the review packet artifacts.

## Verdict

CONDITIONAL. This maintainability pass found 3 new P1 regression-coverage gaps and 1 new P2 metadata-validation gap; no P0 finding was identified.

## Next Dimension

Maintainability PASS B: UX gaps and automation/integration gaps, with the same exclusion for `032-goal-opencode-plugin/009-speckit-command-goal-prompt-offer/**`.

Review verdict: CONDITIONAL
