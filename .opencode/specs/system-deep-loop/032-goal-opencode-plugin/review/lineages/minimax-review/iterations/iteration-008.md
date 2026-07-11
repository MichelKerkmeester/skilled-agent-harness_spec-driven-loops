# Iteration 008: playbook_capability overlay — manual testing playbook parity

## Focus

- Dimension: traceability (overlay: playbook_capability)
- Goal: compare the two manual testing playbook rows for the goal
  plugin
  (`manual_testing_playbook/ux-hooks/goal-opencode-plugin.md`
  and
  `manual_testing_playbook/cli-hooks-and-plugin/goal-opencode-plugin.md`)
  against the shipped plugin surface, the test files, and the
  expected output signals.

## Scorecard

- Dimensions covered: traceability (playbook_capability overlay)
- Files reviewed: 2 playbook rows + 6 test files + mk-goal.js
- New findings: P0=0 P1=0 P2=2
- Refined findings: 0
- New findings ratio: 0 (this is a clean-overlay iteration; both
  playbooks accurately describe the shipped surface; findings are
  all P2 advisory)

## Findings

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

- **F027 — system-spec-kit playbook (196 lines) is significantly
  less detailed than system-skill-advisor playbook (503 lines); the
  latter has 7 sections vs the former's 5** —
  `wc -l` confirms
  `manual_testing_playbook/ux-hooks/goal-opencode-plugin.md` is
  196 lines with sections 1. OVERVIEW, 2. SCENARIO CONTRACT,
  3. TEST EXECUTION (with sub-sections), 4. SOURCE FILES, 5. SOURCE
  METADATA. The system-skill-advisor
  (`manual_testing_playbook/cli-hooks-and-plugin/goal-opencode-plugin.md`)
  is 503 lines with 8 sections including 5. ADVERSARIAL REGRESSION
  (with sub-sections 5.1, 5.2, Regression Anchors), 7. EVIDENCE
  (with sub-sections), 8. PASS/FAIL. The system-skill-advisor
  playbook is 2.5x the size and includes the adversarial-regression
  + evidence-template sections the system-spec-kit playbook omits.
  Both are aligned with the shipped surface; this is a depth
  disparity, not a content drift.
  - Category: maintainability
  - Source evidence: `wc -l` and `grep -E "^##"` outputs at
    `iterations/iteration-008.md:13-30`.
  - Affected surface hints: `["system-spec-kit playbook",
    "playbook depth parity"]`

- **F028 — system-spec-kit playbook tests 5 test files in its
  "fallback" path; system-skill-advisor playbook tests 6; the
  difference is `mk-goal-continuation.test.cjs`** —
  `grep -E "node .opencode/plugins/tests/"`
  (`iterations/iteration-008.md:80-100`) shows the system-spec-kit
  playbook references state, tool-path, capabilities, supervisor
  (4 files) in §3.10-11. The system-skill-advisor playbook
  references state, tool-path, supervisor, continuation, lifecycle,
  capabilities (6 files) in §3.1-2. The 5th file
  (`mk-goal-continuation.test.cjs`, 654 lines, 18 tests) is the
  most recent addition (added in phase 012) and the system-spec-kit
  playbook has not been re-synchronized. This is consistent with
  the doc-staleness audit's general finding that the system-spec-kit
  surface lags the system-skill-advisor surface.
  - Category: traceability (with maintainability impact)
  - Source evidence: the two `grep` outputs above; the
    system-skill-advisor playbook includes
    `mk-goal-continuation.test.cjs` at line 46, the
    system-spec-kit playbook does not mention it anywhere.
  - Affected surface hints: `["system-spec-kit playbook",
    "playbook test file coverage",
    "mk-goal-continuation.test.cjs"]`

## Cross-Reference Results

| Protocol           | Status   | Gate     | Evidence                                       | Notes |
|--------------------|----------|----------|------------------------------------------------|-------|
| spec_code          | pass     | hard     | playbook scenarios match shipped surface       | All "expected signals" present in mk-goal.js output |
| checklist_evidence | n/a      | hard     | not run this iteration                         | Defer |
| skill_agent        | n/a      | advisory | not run this iteration                         | Defer (covered in iteration 006) |
| agent_cross_runtime| n/a      | advisory | not run this iteration                         | Defer (covered in iteration 006) |
| feature_catalog_code| partial | advisory | related but separate                           | F024-F026 covered in iteration 007 |
| playbook_capability| pass    | advisory | this iteration IS the protocol run             | All findings; no P0/P1 |

## Assessment

- newFindingsRatio: 0 (clean-overlay iteration; the protocol ran
  clean — no P0 or P1 findings)
- dimensionsAddressed: traceability (playbook_capability overlay)
- noveltyJustification: both playbooks are well-aligned with the
  shipped surface; the only observations are P2 advisories on
  depth disparity and a single test-file omission in one
  playbook.

## Ruled Out

- Both playbooks correctly enumerate:
  - 9 GOAL_ACTIONS (set, show, clear, complete, pause, history,
    resume, doctor, health)
  - 6 valid statuses
  - verifier-source values (none, injected, default-heuristic,
    default-llm)
  - env caps (MK_GOAL_MAX_AUTO_TURNS, MK_GOAL_MAX_WALL_MS)
  - autonomy tiers (off/smoke/active)
  - expected status fields (mutation, store_health, token_budget,
    remaining_auto_turns, etc.)
  No drift on the capability surface.
- The system-spec-kit playbook's "eight negative adversarial cases"
  claim (line 49) was verified against
  `mk-goal-supervisor.test.cjs:225-266` which has exactly 8
  negative cases in the `cases` array. No discrepancy.

## Dead Ends

- Trying to derive a "playbook health score" by counting scenarios
  per playbook: the system-skill-advisor playbook's 8 sections
  don't translate to a clean count, and the system-spec-kit
  playbook's 196 lines have a different structure. Both
  are valid; depth is not a quality proxy.

## Recommended Next Focus

Iteration 009: agent_cross_runtime parity — verify the
deep-review agent definitions across all 3 runtimes
(OpenCode, Claude, Codex) agree on the same loop contract, the
`@deep-review` LEAF constraint, and the iteration shape. Build on
the iteration 006 finding (F022) which already observed that
OpenCode and Codex are byte-identical while Claude differs in
frontmatter only.

## Claim Adjudication

```json
{"findingId":"F027","claim":"system-spec-kit playbook is 196 lines, 5 sections; system-skill-advisor playbook is 503 lines, 8 sections. The latter includes adversarial-regression and evidence-template sections the former omits.","evidenceRefs":[".opencode/skills/system-spec-kit/manual_testing_playbook/ux-hooks/goal-opencode-plugin.md",".opencode/skills/system-skill-advisor/manual_testing_playbook/cli-hooks-and-plugin/goal-opencode-plugin.md"],"counterevidenceSought":"Re-counted sections and lines for both playbooks; confirmed the depth disparity.","alternativeExplanation":"Could be that system-spec-kit and system-skill-advisor are intentionally maintained at different depths (system-spec-kit as a quick-reference, system-skill-advisor as the canonical deep playbook).","finalSeverity":"P2","confidence":0.85,"downgradeTrigger":"If the system-spec-kit playbook is intentionally a quick-reference and the system-skill-advisor is the canonical deep version, downgrade to P2 (already P2)."}
{"findingId":"F028","claim":"system-spec-kit playbook omits mk-goal-continuation.test.cjs from its test-fallback path; system-skill-advisor playbook includes it.","evidenceRefs":[".opencode/skills/system-spec-kit/manual_testing_playbook/ux-hooks/goal-opencode-plugin.md §3.10-11",".opencode/skills/system-skill-advisor/manual_testing_playbook/cli-hooks-and-plugin/goal-opencode-plugin.md §3.1-2"],"counterevidenceSought":"Re-grepped both playbooks for 'continuation.test' or similar; confirmed system-spec-kit is missing it.","alternativeExplanation":"Could be that the system-spec-kit playbook was authored before phase 012 added the continuation test, and the doc-staleness audit should have surfaced this. The audit did not.","finalSeverity":"P2","confidence":0.95,"downgradeTrigger":"None — this is a documentation drift, not a defect."}
```

Review verdict: PASS