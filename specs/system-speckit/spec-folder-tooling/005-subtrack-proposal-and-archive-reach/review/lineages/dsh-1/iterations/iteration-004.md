# Iteration 4 - Maintainability: release notes, manual playback, and test inventory

## Dispatcher

- Mode: review
- Dimension: maintainability
- Review target: `specs/system-speckit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach`
- Artifact directory: `specs/system-speckit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach/review/lineages/dsh-1`
- Operator focus: manifest-scoped documentation alignment; this pass names the structural drift behind the earlier correctness, security, and traceability findings.
- Budget profile: verify (11-13 tool calls). No nested dispatch was performed.

## Files Reviewed

- `.skilled/skills/system-spec-kit/changelog/v2.13.0.0.md`
- `.skilled/skills/system-spec-kit/SKILL.md`
- `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/spec-packet-relocation.md`
- `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/spec-lifecycle-automation.md`
- `.skilled/skills/system-spec-kit/feature-catalog/retrieval/rg-archive-search.md`
- `.skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/spec-packet-relocation.md`
- `.skilled/skills/system-spec-kit/manual-testing-playbook/manual-testing-playbook.md`
- `.skilled/skills/system-spec-kit/README.md`
- `README.md`
- `.skilled/skills/system-spec-kit/runtime/cli/spec/README.md`
- Packet `goal.md` log rows for phases 009 and 010

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The v2.13.0.0 changelog stopped at the phase-005 release and its test counts no longer match the packet** -- `.skilled/skills/system-spec-kit/changelog/v2.13.0.0.md:216` -- The changelog reports 211 files and 2567 tests after the five original suites, and its known-issue paragraph still says a stopped `--renumber` run cannot finish on a rerun. The packet's 2026-11-14 log records 2603 tests passing after phase 010, four additional suites, status 3, late-step resume, mixed-track restore refusal, `archivedPaths`, and the non-`NNN-slug` refusal. The package version remains `2.13.0.0`, so the changelog is the only release-note surface for the current code.

Case: a release reader checks whether the current package supports status 3 or `archivedPaths`. The changelog's exit table stops at 2 and its file/test counts predate phases 006-010, so the reader concludes the later behavior is unreleased even though the code and packet log say it shipped.

- File: `.skilled/skills/system-spec-kit/changelog/v2.13.0.0.md:216`
- Evidence: `[SOURCE: specs/system-speckit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach/goal.md:137]` records 2603 tests after phase 010; `[SOURCE: .skilled/skills/system-spec-kit/changelog/v2.13.0.0.md:67]` still lists only statuses 0, 1, and 2; `[SOURCE: .skilled/skills/system-spec-kit/SKILL.md:5]` still declares version 2.13.0.0.
- User impact: release notes understate the shipped behavior and overstate the test baseline, so operators cannot use the changelog to decide whether a remediation behavior is available.
- Finding class: cross-consumer
- Scope proof: `rg -n "2567 tests|2603|status 3|archivedPaths"` over the changelog and goal log returns the old count and no later behavior; `ls changelog` shows no v2.13.1 or later entry.
- Affected surface hints: ["changelog v2.13.0.0", "package version", "release notes", "test-count baseline"]
- Claim adjudication: not required for P2.

2. **Manual scenario 492 still exercises only the pre-remediation relocation surface** -- `.skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/spec-packet-relocation.md:27` -- The scenario objective, prompt, and commands cover a dry run, a refused archived number, and an applied renumber. They never exercise status 3, a late-step rerun, a case-folded duplicate refusal, the phase-map bare-name rewrite, the pre-archive id rewrite, or the mixed-track restore path. The scenario names only `relocate.vitest.ts` as its test anchor at line 254.

Case: an operator runs the exact 492 prompt and receives PASS, yet the failure modes introduced by phases 006-010 remain untested. A regression in the late-step ledger, status 3, or pre-archive rewrite would not change any of the scenario's expected signals.

- File: `.skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/spec-packet-relocation.md:27`
- Evidence: `[SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/spec-packet-relocation.md:29]` gives the prompt and `:31` the expected signals; both stop at the pre-008 behavior. `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/relocate-real-pipeline.vitest.ts:151]` shows the late-step resume path that the scenario omits.
- User impact: the manual playbook can report a false PASS on the exact relocation command that phases 006-010 changed.
- Finding class: instance-only
- Scope proof: the 492 file is the only relocation scenario registered in the manual playbook (`manual-testing-playbook.md:245`); no second scenario covers the phase 006-010 paths.
- Affected surface hints: ["manual playbook scenario 492", "relocation test anchors", "operator validation coverage"]
- Claim adjudication: not required for P2.

3. **Feature and playbook source inventories still list only `relocate.vitest.ts`** -- `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/spec-packet-relocation.md:91` -- The catalog's "full implementation and test file listings" table names one relocation suite. The manifest contains `relocate-real-pipeline.vitest.ts`, `relocate.vitest.ts`, `archive-track.vitest.ts`, `archive-numbering.vitest.ts`, and `rg-include-archive.vitest.ts`, and the phase-010 suite is the only one that runs the true pipeline writers. The manual scenario's test anchor at line 254 has the same one-suite inventory.

Case: a maintainer follows the catalog to the suite that should cover status 3 and resume. The catalog points at `relocate.vitest.ts`, which stubs the six late writers; the suite that proves the true writers is absent from the inventory.

- File: `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/spec-packet-relocation.md:91`
- Evidence: `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/relocate-real-pipeline.vitest.ts:111]` is the true-writer suite; `[SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/spec-packet-relocation.md:254]` repeats the one-suite anchor; `[SOURCE: specs/system-speckit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach/goal.md:137]` records the phase-010 suite.
- User impact: a maintainer can miss the only end-to-end proof of the remediation contract and treat the stubbed suite as sufficient coverage.
- Finding class: cross-consumer
- Scope proof: `rg -n "relocate-real-pipeline"` over the changed documentation returns no hit; the only mention is the test file itself and the packet log.
- Affected surface hints: ["feature catalog relocation page", "manual playbook test anchors", "release test inventory"]
- Claim adjudication: not required for P2.

## Traceability Checks

### Core Protocols

- `spec_code`: partial. The implementation and packet log agree on phases 006-010; the release notes and manual inventory do not.
- `checklist_evidence`: partial. The packet's completion log is current, but the changelog test count and manual scenario still reflect the phase-005 state.
- `skill_agent`: partial. The SKILL version is unchanged and its quick-reference table omits the relocation command.
- `agent_cross_runtime`: notApplicable; no agent file is in the manifest.
- `feature_catalog_code`: fail. The catalog's current-reality and test listings predate phases 006-010.
- `playbook_capability`: fail. Scenario 492 cannot detect the phase 006-010 behaviors.

## Integration Evidence

- `goal.md:137` says the full CLI suite passed 2603 tests after phase 010; the changelog says 2567 at line 216.
- `relocate-real-pipeline.vitest.ts:111` is the true-writer suite; the catalog and playbook do not list it.
- `manual-testing-playbook/tooling-and-scripts/spec-packet-relocation.md:27-31` covers only the pre-008 plan/refusal/apply path.
- No source file was modified. No build, test, `validate.sh`, or git write command was run.

## Edge Cases

- Not every behavioral omission needs a separate changelog entry; the maintainability finding is specifically the stale test-count/known-issue text and the absence of any later release note, not a demand to rewrite the historical phase-005 prose.
- Manual scenario 492 is an operator contract, not a test suite. A single scenario need not cover every branch, but it should at least exercise one phase-006-010 behavior because its objective names relocation generally.
- The feature catalog may intentionally list a representative suite rather than every file; however the page says "full implementation and test file listings" and the phase-010 suite is the only one that proves the true writers.

## Confirmed-Clean Surfaces

- The packet's `goal.md` log and `spec.md` status rows are current for phases 006-010.
- `runtime/cli/spec/README.md:120` is the current command reference and can absorb the missing detail without changing the producer.
- `relocate-real-pipeline.vitest.ts` exists and is registered in the manifest.
- No maintainability finding requires a code change.

## Ruled Out

- A missing test file: `relocate-real-pipeline.vitest.ts` exists and is in the manifest; the defect is the inventory.
- A wrong package version is not separate from the changelog gap; the missing release note is the actionable issue.
- A manual playbook that must cover every branch: ruled out by the playbook's scenario granularity; one added phase-006/008 case is enough to stop false PASS.

## Next Focus

- Dimension: final cross-check (maintainability already covered)
- Focus area: verify that every earlier P1 still has a live, precise file:line and that no changed surface is left unclassified; confirm which docs need no change.
- Reason: four dimensions are covered, active P1s remain, and the packet is at its last scheduled pass before synthesis.
- Required evidence: registry, iteration narratives, the current command README, and a final inventory of the manifest docs.

## Assessment

Dimensions addressed: maintainability

Review verdict: CONDITIONAL
