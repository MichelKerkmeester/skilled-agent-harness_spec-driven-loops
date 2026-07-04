# Iteration 007: feature_catalog_code overlay — goal-opencode-plugin feature catalog parity

## Focus

- Dimension: traceability (overlay: feature_catalog_code)
- Goal: compare the two feature-catalog rows for the goal plugin
  (`.opencode/skills/system-spec-kit/feature_catalog/18--ux-hooks/goal-opencode-plugin.md`
  and
  `.opencode/skills/system-skill-advisor/feature_catalog/07--hooks-and-plugin/goal-opencode-plugin.md`)
  against the on-disk shipped surface (`mk-goal.js` GOAL_ACTIONS,
  test files, command verbs).

## Scorecard

- Dimensions covered: traceability (feature_catalog_code overlay)
- Files reviewed: 2 feature catalog rows + mk-goal.js + 8 test files
- New findings: P0=0 P1=2 P2=1
- Refined findings: 0
- New findings ratio: 1.0 (3/3 — every observation is novel)

## Findings

### P0 Findings

None.

### P1 Findings

- **F024 — Both feature catalogs list 7 of 8 goal-related test files;
  `speckit-goal-offer-contract.test.cjs` is missing from BOTH** —
  `.opencode/skills/system-spec-kit/feature_catalog/18--ux-hooks/goal-opencode-plugin.md:58-64`
  and
  `.opencode/skills/system-skill-advisor/feature_catalog/07--hooks-and-plugin/goal-opencode-plugin.md:61-67`
  enumerate 7 test files each. The on-disk test directory has
  8 goal-related cjs files
  (`.opencode/plugins/tests/`); the missing one is
  `speckit-goal-offer-contract.test.cjs` (106 lines, 4 tests, added
  for the phase 009 `speckit-command-goal-prompt-offer` integration).
  The 8th test file's omission from both catalogs is a
  feature-catalog drift. The audit dossier
  (`scratch/2026-07-03-four-reviewer-audit-findings.md` §D DOC-2)
  flagged a different missing row (`mk-goal-export-contract.test.cjs`)
  which has since been added; this is a different gap the
  audit did not enumerate.
  - Category: traceability
  - Source evidence: line 58-64 (system-spec-kit catalog) and
    line 61-67 (system-skill-advisor catalog) vs
    `ls .opencode/plugins/tests/mk-goal-*.test.cjs speckit-*.cjs`
    which returns 8 files.
  - Affected surface hints: `["both feature catalogs",
    "speckit-goal-offer-contract.test.cjs", "phase 009 catalog update"]`

- **F025 — The two feature-catalog rows describe the same
  `mk-goal-state.test.cjs` test with different scopes;
  system-spec-kit's description matches the file's actual coverage
  better than system-skill-advisor's** —
  system-spec-kit
  (`feature_catalog/18--ux-hooks/goal-opencode-plugin.md:58`) says
  "State, generated prompt fields, injection, caps, and
  sanitization." system-skill-advisor
  (`feature_catalog/07--hooks-and-plugin/goal-opencode-plugin.md:61`)
  says "Session-keyed persistence, tool output and passive
  injection". The system-spec-kit description covers 5 of 21 tests
  in the file (per the test count at
  `iterations/iteration-005.md:73-78`); the system-skill-advisor
  description covers 3. The system-spec-kit description is more
  accurate; the system-skill-advisor description under-represents
  the test file's scope. Cross-runtime parity for the catalog row
  is broken.
  - Category: traceability
  - Source evidence: catalog rows above; `wc -l
    .opencode/plugins/tests/mk-goal-state.test.cjs` = 515 lines,
    21 tests; spot-checks at
    `iterations/iteration-007.md:43-50` show
    sanitizer-hardening and cap tests in the file beyond
    "persistence + tool output + injection".
  - Affected surface hints: `["system-skill-advisor feature catalog",
    "test description parity"]`

### P2 Findings

- **F026 — Audit dossier DOC-2 ("feature-catalog validation table's
  missing `mk-goal-export-contract.test.cjs` row") is now
  obsolete** — the dossier captured a snapshot where the row was
  missing, but both current catalogs list `mk-goal-export-contract.test.cjs`
  (system-spec-kit:60, system-skill-advisor:62). Phase 015's REQ-010
  includes "the feature-catalog validation table lists
  `mk-goal-export-contract.test.cjs`" as a fix, but the row is
  already present. This is the same dossier-drift pattern as
  F010/F012 — the audit captured pre-fix state and the planned
  remediation is now redundant.
  - Category: traceability
  - Source evidence: dossier §D DOC-2;
    feature_catalog/18--ux-hooks/goal-opencode-plugin.md:60;
    feature_catalog/07--hooks-and-plugin/goal-opencode-plugin.md:62.
  - Affected surface hints: `["audit dossier DOC-2",
    "phase 015 REQ-010 (redundant after live state)"]`

## Cross-Reference Results

| Protocol           | Status   | Gate     | Evidence                                       | Notes |
|--------------------|----------|----------|------------------------------------------------|-------|
| spec_code          | partial  | hard     | catalog rows vs mk-goal.js + 8 test files      | 1 missing file (F024), 1 description drift (F025), 1 obsolete audit row (F026) |
| checklist_evidence | n/a      | hard     | not run this iteration                         | Defer |
| skill_agent        | partial  | advisory | catalog rows are skill-managed assets          | F024, F025, F026 |
| agent_cross_runtime| n/a      | advisory | not run this iteration                         | Defer (covered in iteration 006) |
| feature_catalog_code| partial | advisory | this iteration IS the protocol run             | All findings |
| playbook_capability| n/a      | advisory | not run this iteration                         | Defer to iteration 008 |

## Assessment

- newFindingsRatio: 1.0 (3/3 novel)
- dimensionsAddressed: traceability (feature_catalog_code overlay)
- noveltyJustification: F024 was missed by the audit and the
  doc-staleness audit; F025 is a per-test-file description drift
  the audit did not enumerate; F026 is the same dossier-drift
  pattern as F010/F012.

## Ruled Out

- Both catalogs correctly enumerate the 9 GOAL_ACTIONS
  (set, show, clear, complete, pause, history, resume, doctor,
  health) and the 6 valid statuses (active, paused, blocked,
  usage_limited, budget_limited, complete). No drift on the
  action/status surface.
- The verifier-mode table (injected, default-heuristic, default-llm)
  is consistent across both catalogs and the implementation.

## Dead Ends

- Trying to derive test-file coverage gaps by counting tests per
  file: the count is the right metric for the helper-duplication
  finding (F017) but not for feature-catalog parity (the catalog
  rows describe roles, not test counts).

## Recommended Next Focus

Iteration 008: playbook_capability overlay — verify the two manual
testing playbook rows
(`manual_testing_playbook/18--ux-hooks/goal-opencode-plugin.md`
and
`manual_testing_playbook/02--cli-hooks-and-plugin/goal-opencode-plugin.md`)
describe executable scenarios that match the shipped plugin surface.

## Claim Adjudication

```json
{"findingId":"F024","claim":"Both feature catalogs list 7 of 8 goal-related test files; speckit-goal-offer-contract.test.cjs is missing from BOTH.","evidenceRefs":[".opencode/skills/system-spec-kit/feature_catalog/18--ux-hooks/goal-opencode-plugin.md:58-64",".opencode/skills/system-skill-advisor/feature_catalog/07--hooks-and-plugin/goal-opencode-plugin.md:61-67",".opencode/plugins/tests/speckit-goal-offer-contract.test.cjs"],"counterevidenceSought":"Re-grepped both catalog files for 'speckit' or 'speckit-goal-offer-contract'; not present. Re-ran ls on tests/; 8 goal-related files confirmed.","alternativeExplanation":"Could be that the speckit-goal-offer-contract test is intentionally excluded because it's a contract test for a system-spec-kit integration, not a goal-plugin behavior test; but other contract-style tests (export-contract) ARE listed.","finalSeverity":"P1","confidence":0.85,"downgradeTrigger":"If the operator considers the speckit-goal-offer-contract test out of scope for the goal-plugin feature catalog, downgrade to P2."}
{"findingId":"F025","claim":"The two feature-catalog rows describe mk-goal-state.test.cjs with different scopes; system-spec-kit's description matches the file's actual coverage better than system-skill-advisor's.","evidenceRefs":[".opencode/skills/system-spec-kit/feature_catalog/18--ux-hooks/goal-opencode-plugin.md:58",".opencode/skills/system-skill-advisor/feature_catalog/07--hooks-and-plugin/goal-opencode-plugin.md:61",".opencode/plugins/tests/mk-goal-state.test.cjs:515 lines, 21 tests"],"counterevidenceSought":"Re-read both catalog descriptions; confirmed the scope difference. Re-counted tests in mk-goal-state.test.cjs (21).","alternativeExplanation":"Could be that the system-skill-advisor catalog intentionally describes the test at a higher level (less detail) for skill-advisor context; but the convention is per-test-file detailed descriptions.","finalSeverity":"P1","confidence":0.8,"downgradeTrigger":"If the system-skill-advisor catalog intentionally uses less-detailed descriptions, downgrade to P2."}
```

Review verdict: CONDITIONAL