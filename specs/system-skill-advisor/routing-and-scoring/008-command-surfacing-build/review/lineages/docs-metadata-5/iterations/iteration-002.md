# Review Iteration 002

## Dimension

Primary dimension: **maintainability**. The pass tested whether the two hand-maintained inventories in the scoped package still describe the files and verdicts they claim, and whether the structural defects raised in iteration 1 have a single root cause or several.

Review focus addressed: the operator focus asks for docs against code across the `docs-metadata` area. This iteration concentrated on the two packages whose structure iteration 1 flagged — the manual-testing playbook and the tests README — and re-checked their inventories against the live tree. It also carried the operator focus's holdout-hygiene and command-offer questions forward without opening any prompt corpus.

## Dispatcher

- Mode: review, detached fan-out lineage `docs-metadata-5`.
- Session: `fanout-docs-metadata-5-1794760565927-i99t40`, generation 1, new lineage.
- Budget: 60 tool calls, 10 minutes. Consumed: 6 calls, about 2 minutes.
- Prior state: 6 open P2 findings, 0 P0, 0 P1, traceability covered.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/manual-testing-playbook/manual-testing-playbook.md:27-363`
- `.skilled/skills/system-skill-advisor/runtime/tests/README.md:54-215`
- `.skilled/skills/system-skill-advisor/runtime/tests/manual-testing-playbook.vitest.ts:44-77`
- `.skilled/skills/system-skill-advisor/manual-testing-playbook/native-cli-tools/command-offer-fit-gates.md:16-133`
- `.skilled/skills/system-skill-advisor/manual-testing-playbook/cli-hooks-and-plugin/brief-command-policy-word.md:16-198`
- `.skilled/skills/system-skill-advisor/manual-testing-playbook/cli-hooks-and-plugin/vibe-command-documents.md:16-151`

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The playbook's scenario verdict set disagrees with its result-persistence contract** -- `.skilled/skills/system-skill-advisor/manual-testing-playbook/manual-testing-playbook.md:30` -- The result-persistence contract says a scenario run is complete only after its "`PASS`, `FAIL` or `SKIP` outcome". The review protocol defines four scenario verdicts and adds `PARTIAL`, then requires triage notes for it: "`PASS`: all acceptance checks true. `PARTIAL`: core behavior works but non-critical evidence or metadata is incomplete." at line 121, and "Triage notes for every `FAIL`, `PARTIAL` or `SKIP`" at line 84. The release rule at line 133 then counts only `PASS` or an approved `SKIP`. No document in the package defines where a `PARTIAL` record lives.
   - Case: an operator runs a scenario whose core behavior works but whose evidence capture is incomplete; the protocol tells them to record `PARTIAL`, and the persistence contract gives that outcome no defined slot, so the run cannot be recorded as complete.
   - Evidence: `[SOURCE: .skilled/skills/system-skill-advisor/manual-testing-playbook/manual-testing-playbook.md:30]`; `[SOURCE: .skilled/skills/system-skill-advisor/manual-testing-playbook/manual-testing-playbook.md:119]`; `[SOURCE: .skilled/skills/system-skill-advisor/manual-testing-playbook/manual-testing-playbook.md:84]`.
   - User impact: the same package defines a verdict and then cannot persist it, which makes the manual-validation record ambiguous at exactly the partial-evidence case the protocol anticipates.
   - Finding class: instance-only
   - Scope proof: `rg -n "PARTIAL"` over the package returns the scenario-verdict definition, the feature-verdict rules and the triage requirement; the persistence contract and release rule name only three outcomes, so this is a vocabulary split inside one document rather than a second convention.
   - Affected surface hints: ["manual testing playbook: result persistence", "manual testing playbook: scenario verdicts", "release readiness rule"]
   - Recommendation: add `PARTIAL` to the persistence contract with its storage rule, or drop it from the scenario verdicts and treat partial evidence as `FAIL`.

## Refined Findings

- DM5-P2-003 (Wave 2 schedules an unauthored scenario): the root cause is that the wave plan and the category table are two hand-maintained inventories of the same 53 files. The plan already drifted from the table. A single generated inventory would have prevented the CL-004 entry.
- DM5-P2-005 (tests README tree): the tree is hand-maintained against 91 files and has drifted by 52. Generating it, or replacing it with a stable subfolder map, removes the recurring cost.

Both refinements are recorded as context for remediation; they are not re-counted as new findings.

## Traceability Checks

| Protocol | Level | Status | Evidence |
|----------|-------|--------|----------|
| `spec_code` | core | partial | No top-level `spec.md` reference to these docs; phase child `025-release-notes-and-doc-sync` owns the release-note intent. |
| `checklist_evidence` | core | notApplicable | No top-level `checklist.md`; phase children own their checklists. |
| `skill_agent` | overlay | pass | The scoped docs remain consistent with the skill's routing and playbook pointers. |
| `agent_cross_runtime` | overlay | partial | Vibe and Claude surfaces checked in iteration 1; Codex, Cursor and Devin remain outside scope. |
| `feature_catalog_code` | overlay | pass | No catalog claim changed; iteration 1's two advisories remain open. |
| `playbook_capability` | overlay | partial | Inventory and verdict vocabulary checked; one new advisory. |

## Integration Evidence

- `manual-testing-playbook.vitest.ts` asserts the 53-row inventory, the 53-file category tree and the persistence-contract strings by exact substring, which is why the `PARTIAL` split survives every test run: the test pins line 30's three outcomes and never reads the verdict section.
- `runtime/tests/README.md` section 3 names 13 subfolders and section 4 draws only 3 of them; the 13 named subfolders all exist, so the topology prose is accurate and the tree is the stale half.
- The central doctor playbook link at `manual-testing-playbook.md:303` resolves to `.skilled/manual-testing-playbook/manual-testing-playbook.md`.

## Edge Cases

- `PARTIAL` could be read as a feature-level verdict only. It is reported because section 5 places it under "Scenario verdict" before the separate "Feature Verdict Rules" section, and section 3 requires triage notes for a `PARTIAL` scenario.
- The wave plan could be read as advisory rather than executable. It is reported because section 6 calls it the "Recommended Wave Plan" for operators and assigns scenario IDs before parallel execution.
- The tests README tree could be intentionally partial. It is reported because its heading is "DIRECTORY TREE" and it lists files rather than a curated subset; a reader cannot tell omission from absence.
- No prompt corpus was opened in this iteration. Holdout hygiene holds; the only holdout references in the package remain aggregate metric names in sibling documents.

## Confirmed-Clean Surfaces

- All 13 subfolders named in `runtime/tests/README.md` section 3 exist.
- All five files named in the same README's sections 4 and 5 exist: `affordance-normalizer.test.ts`, `lane-attribution.test.ts`, `routing-fixtures.affordance.test.ts`, `shadow-sink.vitest.ts` and `tsconfig.tests.json`.
- The central doctor playbook referenced by `manual-testing-playbook.md:303` exists.
- Every section-table scenario link in the root playbook resolves; the playbook inventory test's exact substrings are present in the root document.
- No scope violation occurred; no file outside the lineage directory was written.

## Ruled Out

- A tests-README subfolder that does not exist: none; 13 of 13 named subfolders are present.
- A tests-README key file that does not exist: none; 5 of 5 named files are present.
- A broken central-playbook link: none.
- A second, hidden scenario-verdict vocabulary: none found; the split is between the persistence contract and the verdict section only.

## Next Focus

- Dimension: correctness
- Focus area: the workflow-measure section of the changelog against `runtime/scripts/routing-accuracy/score-command-transcripts.mjs` — the load-rate numerator, the followed-rate numerator, the published path count, and the Vibe journal normalization.
- Reason: the operator focus names the transcript scorer's load, followed-step and offer counting, and that section is the one scoped document whose formulas have not yet been checked against code.
- Rotation status: traceability and maintainability completed; correctness and security remain.
- Blocked/productive carry-forward: productive — the maintainability pass found one new vocabulary split and closed two structural questions.
- Required evidence: the `loadRate` and `followedRate` expressions, the `workflowPath()` return union, and the Vibe journal loader path.
- Recovery note: none; no failed iteration.

Review verdict: PASS
