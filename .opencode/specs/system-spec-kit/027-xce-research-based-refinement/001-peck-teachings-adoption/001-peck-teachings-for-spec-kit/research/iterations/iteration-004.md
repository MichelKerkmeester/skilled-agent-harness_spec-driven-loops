# Focus

Q4 / T1: prior art and feasibility risks for adding a mechanical acceptance-criteria coverage gate to spec-kit's completion flow.

# Actions Taken

- Read the deep-research state and strategy to confirm this iteration's focus and prior coverage. [SOURCE: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-peck-teachings-adoption/001-peck-teachings-for-spec-kit/research/deep-research-state.jsonl:1-4`] [SOURCE: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-peck-teachings-adoption/001-peck-teachings-for-spec-kit/research/deep-research-strategy.md:20-25`]
- Re-read the sibling T1 analysis to separate already-known peck lessons from new repo/prior-art evidence. [SOURCE: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-peck-teachings-adoption/001-peck-teachings-for-spec-kit/peck-teachings-analysis.md:58-127`]
- Inspected spec-kit AC, checklist, validation, registry, and rule surfaces: `spec.md.tmpl`, `checklist.md.tmpl`, `validation_rules.md`, `validate.sh`, `validator-registry.json`, `check-section-counts.sh`, and `check-evidence.sh`. [SOURCE: `.opencode/skills/system-spec-kit/templates/manifest/spec.md.tmpl:89-97`] [SOURCE: `.opencode/skills/system-spec-kit/templates/manifest/checklist.md.tmpl:69-76`] [SOURCE: `.opencode/skills/system-spec-kit/scripts/lib/validator-registry.json:203-208`]
- Surveyed external prior art from BDD executable-spec tooling, requirement-traceability tooling, and assertion-strength tooling: Cucumber/Gherkin, Cucumber reporting, behave, OpenFastTrace, and Stryker mutation testing. [SOURCE: https://cucumber.io/docs/gherkin/reference/] [SOURCE: https://cucumber.io/docs/cucumber/reporting/] [SOURCE: https://behave.readthedocs.io/en/latest/tutorial/] [SOURCE: https://raw.githubusercontent.com/itsallcode/openfasttrace/main/README.md] [SOURCE: https://stryker-mutator.io/docs/]
- Attempted SpecFlow/Reqnroll/Azure traceability sources, but the fetcher returned 404/transport errors or a retirement/community redirect; this iteration does not cite those as evidence.

# Findings

1. AC coverage is feasible in spec-kit, but only if it is made explicit instead of inferred. L1/L2 specs already have an `Acceptance Criteria` table column, and L3/L3+ specs already use Given/When/Then acceptance criteria under user stories. That gives a real insertion point for AC IDs and coverage mapping. [SOURCE: `.opencode/skills/system-spec-kit/templates/manifest/spec.md.tmpl:89-97`] [SOURCE: `.opencode/skills/system-spec-kit/templates/manifest/spec.md.tmpl:526-543`] [SOURCE: `.opencode/skills/system-spec-kit/templates/manifest/spec.md.tmpl:765-772`]

2. The current AC/scenario counting surface is too brittle to reuse as the coverage gate. The validation reference says acceptance scenarios are detected as `**Given**` blocks, and the actual `SECTION_COUNTS` rule greps exactly for `**Given**`; the manifest template examples are unbolded `Given [context], When [action], Then [outcome]`. An `AC_COVERAGE` rule should therefore define its own canonical AC syntax/table instead of relying on the existing scenario counter. [SOURCE: `.opencode/skills/system-spec-kit/references/validation/validation_rules.md:851-864`] [SOURCE: `.opencode/skills/system-spec-kit/scripts/rules/check-section-counts.sh:68-75`] [SOURCE: `.opencode/skills/system-spec-kit/templates/manifest/spec.md.tmpl:532-543`] [SOURCE: `.opencode/skills/system-spec-kit/templates/manifest/spec.md.tmpl:771-772`]

3. `EVIDENCE_CITED` is not a sufficient foundation for AC coverage. The reference describes `[Test: ...]` as recognized evidence, but the actual rule accepts generic `[EVIDENCE:]`, `| Evidence:`, checkmarks, `(verified)/(tested)/(confirmed)`, and `[DEFERRED:]`; it does not map evidence to a specific AC or validate test strength. [SOURCE: `.opencode/skills/system-spec-kit/references/validation/validation_rules.md:435-444`] [SOURCE: `.opencode/skills/system-spec-kit/scripts/rules/check-evidence.sh:85-97`] [SOURCE: `.opencode/skills/system-spec-kit/scripts/rules/check-evidence.sh:115-122`]

4. The checklist currently collapses all AC verification into one self-attested box. `CHK-020 [P0] All acceptance criteria met` sits under Testing, with no per-criterion classification, evidence row, or coverage denominator. That matches the sibling analysis's core T1 gap and should be replaced or supplemented by an AC coverage table. [SOURCE: `.opencode/skills/system-spec-kit/templates/manifest/checklist.md.tmpl:69-76`] [SOURCE: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-peck-teachings-adoption/001-peck-teachings-for-spec-kit/peck-teachings-analysis.md:91-105`]

5. BDD prior art supports the AC-as-executable-spec half of the design. Cucumber defines examples/scenarios as both specification/documentation and tests, with Given/When/Then describing context, event, and expected outcome; its guidance says `Then` step definitions should use assertions against observable outcomes. behave similarly maps feature-file steps to Python step implementations and reports feature/scenario/step pass/fail counts. [SOURCE: https://cucumber.io/docs/gherkin/reference/] [SOURCE: https://behave.readthedocs.io/en/latest/tutorial/]

6. BDD reports alone are not enough for a spec-kit completion gate. Cucumber reporting produces pass/fail information for scenarios, and Cucumber/behave can report undefined or failed steps, but neither source proves that every spec-kit AC has a linked, meaningful assertion. This supports using BDD reports as evidence inputs, not as the final verdict. [SOURCE: https://cucumber.io/docs/cucumber/reporting/] [SOURCE: https://behave.readthedocs.io/en/latest/tutorial/]

7. Requirement-traceability prior art supports explicit ID links and CI/build integration. OpenFastTrace describes itself as a requirement tracing suite that checks whether planned specification items were actually implemented and can run from command line or as part of Maven/Gradle build processes. That is the closest external analogue to `AC-id -> evidence -> coverage ratio` in spec-kit. [SOURCE: https://raw.githubusercontent.com/itsallcode/openfasttrace/main/README.md]

8. Assertion-strength is the main false-confidence risk. Stryker's mutation-testing docs explicitly call out that code coverage does not prove test effectiveness and that tests without assertions can inflate coverage; Cucumber also says `Then` steps should use assertions. Peck's anti-gaming rule is aligned with this: weak/no-assertion tests should not count as covered. [SOURCE: https://stryker-mutator.io/docs/] [SOURCE: https://cucumber.io/docs/gherkin/reference/] [SOURCE: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-peck-teachings-adoption/001-peck-teachings-for-spec-kit/peck-teachings-analysis.md:71-77`]

9. Implementation should likely separate two verdicts: a mechanical self-authored table check and an optional read-only reviewer verdict. The validator registry can run a new authored-template rule, and strict validation can convert warnings into exit-2 failures, so a new `AC_COVERAGE` rule is mechanically straightforward. But judging weak assertions, manual exceptions, and partial coverage is better suited to a fresh-context `deep-review`/acceptance-review surface than to regex alone. [SOURCE: `.opencode/skills/system-spec-kit/scripts/lib/validator-registry.json:203-208`] [SOURCE: `.opencode/skills/system-spec-kit/scripts/spec/validate.sh:357-415`] [SOURCE: `.opencode/skills/system-spec-kit/scripts/spec/validate.sh:1047-1059`]

10. A safe T1 refinement is: add stable AC IDs, add a checklist table `AC ID | Classification | Evidence | Reviewer notes`, count `Tested` as covered, count `Partial/Manual/Not covered` separately, compute `covered >= floor(floor_setting * total)` with peck's `0.90` as the default candidate, and start as warning/per-level opt-in before making it completion-blocking. [SOURCE: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-peck-teachings-adoption/001-peck-teachings-for-spec-kit/peck-teachings-analysis.md:109-119`] [SOURCE: `.opencode/skills/system-spec-kit/scripts/spec/validate.sh:930-945`] [SOURCE: `.opencode/skills/system-spec-kit/scripts/spec/validate.sh:1057-1059`]

# Questions Answered

- Q4 is mostly answered. Prior art exists in BDD executable specifications, scenario reporting, requirements traceability, and mutation/assertion-strength tooling.
- The feasible spec-kit shape is an explicit AC traceability table plus a validator-computed threshold, not inference from existing `CHK-020`, `EVIDENCE_CITED`, or `SECTION_COUNTS` signals.
- The highest risks are parser brittleness, generic/self-attested evidence, false confidence from weak assertions, and blocking existing packets too early.

# Questions Remaining

- Q5 remains for iteration 5: rollout/sequencing across T3/T4/T2/T1, including warn-only windows, strict-mode interaction, per-level defaults, and whether T1 should ship in the deferred packet or only be specified here.
- T1 design detail remains deferred: exact AC ID syntax, how manual criteria are counted, whether `Partial` earns any fractional credit, and how a `deep-review` acceptance verdict is stored.

# Next Focus

Iteration 5 should focus Q5: consolidate sequencing and rollout risk across all teachings, with special attention to which pieces can ship as advisory/template changes first and which must remain warn-only or deferred.
