# Iteration 003 - Traceability

Focus: playbook/catalog cross-reference integrity and validation scenario executability.

## Actions

- Ran the root playbook's deterministic count glob and broke results down by category.
- Resolved playbook markdown links that point into `../../feature_catalog/`.
- Compared the root scenario 136 contract with the dedicated scenario file.

## Findings

### P1-003 - The root playbook release gate expects 380 scenario files, but the current tree has 384

The release rule says scenario coverage must be 100 percent and notes that the playbook "currently contains 380 scenario files" [SOURCE: .opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:140]. The deterministic check exits unless `$TOTAL_FEATURES` equals 380 [SOURCE: .opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:166], and the note repeats the 380 count [SOURCE: .opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:173].

Running the same glob in the current tree returned 384 files. Category 24 is listed in the root playbook [SOURCE: .opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:41] and its README lists scenarios 401-415 [SOURCE: .opencode/skills/system-spec-kit/manual_testing_playbook/24--local-llm-query-intelligence/README.md:60].

Impact: the documented release gate would fail against the current package even before scenario verdicts are evaluated.

Fix: update the expected count, or narrow the script to count only scenario files and not category README files.

Claim adjudication packet:
```json
{
  "findingId": "P1-003",
  "claim": "The documented playbook file-count release gate is stale and fails against the current tree.",
  "evidenceRefs": [
    ".opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:140",
    ".opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:166",
    ".opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:173",
    ".opencode/skills/system-spec-kit/manual_testing_playbook/24--local-llm-query-intelligence/README.md:60"
  ],
  "counterevidenceSought": "Re-ran the exact documented glob and counted files by category.",
  "alternativeExplanation": "The expected count could intentionally lag until category 24 is accepted, but the root already lists category 24 as canonical.",
  "finalSeverity": "P1",
  "confidence": 0.9,
  "downgradeTrigger": "Downgrade if category 24 is explicitly marked out-of-release and the count gate is scoped to exclude it."
}
```

### P1-004 - Five playbook scenarios link to catalog files that do not exist at their referenced paths

The link resolver found five broken playbook-to-catalog links:

- `02--mutation/10-per-record-history-log.md` [SOURCE: .opencode/skills/system-spec-kit/manual_testing_playbook/02--mutation/019-feature-09-direct-manual-scenario-per-memory-history-log.md:55]
- `01--retrieval/006-hybrid-search-pipeline.md` [SOURCE: .opencode/skills/system-spec-kit/manual_testing_playbook/01--retrieval/006-hybrid-search-pipeline.md:60]
- `01--retrieval/007-4-stage-pipeline-architecture.md` [SOURCE: .opencode/skills/system-spec-kit/manual_testing_playbook/01--retrieval/007-4-stage-pipeline-architecture.md:57]
- `14--stress-testing/01-stress-test-cycle.md` [SOURCE: .opencode/skills/system-spec-kit/manual_testing_playbook/14--stress-testing/170-run-stress-cycle.md:146]
- `04--maintenance/036-startup-runtime-compatibility-guards.md` [SOURCE: .opencode/skills/system-spec-kit/manual_testing_playbook/04--maintenance/036-startup-runtime-compatibility-guards.md:59]

Impact: operators using the playbook cannot reliably jump from scenarios to the matching catalog entries.

Fix: update the links to current file names and add a link-integrity check to playbook validation.

Claim adjudication packet:
```json
{
  "findingId": "P1-004",
  "claim": "Five playbook scenario files point to missing feature-catalog targets.",
  "evidenceRefs": [
    ".opencode/skills/system-spec-kit/manual_testing_playbook/02--mutation/019-feature-09-direct-manual-scenario-per-memory-history-log.md:55",
    ".opencode/skills/system-spec-kit/manual_testing_playbook/01--retrieval/006-hybrid-search-pipeline.md:60",
    ".opencode/skills/system-spec-kit/manual_testing_playbook/01--retrieval/007-4-stage-pipeline-architecture.md:57",
    ".opencode/skills/system-spec-kit/manual_testing_playbook/14--stress-testing/170-run-stress-cycle.md:146",
    ".opencode/skills/system-spec-kit/manual_testing_playbook/04--maintenance/036-startup-runtime-compatibility-guards.md:59"
  ],
  "counterevidenceSought": "Checked for likely current catalog targets in adjacent category folders.",
  "alternativeExplanation": "The links may reflect old numbering before catalog renames, but they are still broken for current operators.",
  "finalSeverity": "P1",
  "confidence": 0.95,
  "downgradeTrigger": "Downgrade if a redirect/link resolver intentionally maps legacy catalog paths at render time."
}
```

### P1-005 - Scenario 136's feature file has a malformed validation contract for annotation-name validity

The dedicated scenario file's real user request is malformed and includes a dangling command fragment [SOURCE: .opencode/skills/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/232-feature-catalog-annotation-name-validity.md:18]. Its expected signals repeat the same broken sequence [SOURCE: .opencode/skills/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/232-feature-catalog-annotation-name-validity.md:21].

The root scenario entry has a cleaner lowercase catalog-root command sequence [SOURCE: .opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:2692].

Impact: one of the two scenario files named by the target spec cannot be executed faithfully from its dedicated playbook page.

Fix: regenerate scenario 136 from the root contract and keep the lowercase path casing portable.

Claim adjudication packet:
```json
{
  "findingId": "P1-005",
  "claim": "The dedicated annotation-name validity scenario contains a malformed executable contract.",
  "evidenceRefs": [
    ".opencode/skills/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/232-feature-catalog-annotation-name-validity.md:18",
    ".opencode/skills/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/232-feature-catalog-annotation-name-validity.md:21",
    ".opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:2692"
  ],
  "counterevidenceSought": "Ran annotation-name validation against lowercase feature_catalog.md; the underlying annotation names matched, so the finding is about the scenario contract, not the code annotations.",
  "alternativeExplanation": "On the local case-insensitive filesystem the uppercase path resolves, but the malformed command prose remains broken and the path casing is not portable.",
  "finalSeverity": "P1",
  "confidence": 0.88,
  "downgradeTrigger": "Downgrade if the dedicated scenario is not part of the operator-facing playbook or is regenerated by a renderer before use."
}
```

## Verdict

Three new P1 traceability findings. No P0.

Review verdict: CONDITIONAL
