# Iteration 3 - Traceability: path JSON, proposal refusal, and phase-007 rewrites

## Dispatcher

- Mode: review
- Dimension: traceability
- Review target: `specs/system-speckit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach`
- Artifact directory: `specs/system-speckit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach/review/lineages/dsh-1`
- Operator focus: manifest-scoped documentation alignment for phases 006 to 010, with the explicit `archivedPaths`, non-`NNN-slug`, bare-name, and pre-archive behaviors as the target.
- Budget profile: verify (11-13 tool calls). No nested dispatch was performed.

## Files Reviewed

- `007-phase-map-and-prearchive-rewrites/goal.md`
- `009-proposal-search-and-routing/goal.md`
- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/rg-wrapper.mjs`
- `.skilled/skills/system-spec-kit/runtime/cli/tests/rg-include-archive.vitest.ts`
- `.skilled/skills/system-spec-kit/runtime/cli/spec/suggest-subtracks.mjs`
- `.skilled/skills/system-spec-kit/runtime/cli/tests/suggest-subtracks.vitest.ts`
- `.skilled/skills/system-spec-kit/runtime/cli/spec/relocate.mjs`
- `.skilled/skills/system-spec-kit/runtime/cli/tests/relocate.vitest.ts`
- `.skilled/skills/system-spec-kit/runtime/cli/tests/archive-track.vitest.ts`
- `.skilled/skills/system-spec-kit/feature-catalog/retrieval/rg-archive-search.md`
- `.skilled/skills/system-spec-kit/references/retrieval/retrieval-conventions.md`
- `.skilled/skills/system-spec-kit/references/structure/folder-structure.md`
- `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/sub-track-proposal.md`
- `.skilled/commands/speckit/search.md`
- `.skilled/commands/speckit/README.txt`
- `.skilled/commands/speckit/assets/search-presentation.txt`
- `README.md`
- `.skilled/skills/system-spec-kit/README.md`
- `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/spec-packet-relocation.md`

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **Archive-search docs omit `archivedPaths` and misstate the path record shape** -- `.skilled/skills/system-spec-kit/feature-catalog/retrieval/rg-archive-search.md:28` -- Phase 009 decision D1 adds `archivedPaths` beside `paths` in the path recipe's JSON record, and the same phase's completion criterion reads both fields. The feature page says only that the `paths` list stays plain strings, that rows in `results` and `counts` carry `archived`, and that "without the flag none of these fields appear, and the report shape is unchanged." The implementation adds `archivedPaths` unconditionally to every path record, including live-only runs, where it is an empty array.

Case: a consumer reads a `path --json` record with `--include-archive`, looks for the archived subset in `paths` or `results`, and never sees `archivedPaths`. The task's own completion check `r.paths.length,(r.archivedPaths||[]).length` reports `2 2`, but the doc describes only one list. On a live-only run the record still carries `archivedPaths: []`, so the claimed unchanged shape is false.

- File: `.skilled/skills/system-spec-kit/feature-catalog/retrieval/rg-archive-search.md:28`
- Evidence: `[SOURCE: specs/system-speckit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach/009-proposal-search-and-routing/goal.md:47]` defines the path JSON check; `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/rg-wrapper.mjs:380]` adds `record.archivedPaths`; `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/rg-include-archive.vitest.ts:138]` asserts it.
- User impact: JSON consumers either ignore the new field and re-filter paths themselves, or mis-handle a record they were told has the old shape; the documented `--json` contract is not the contract the wrapper emits.
- Finding class: cross-consumer
- Scope proof: `rg -n "archivedPaths"` over the changed docs returns zero hits; the implementation and tests are the only occurrences. The same omission appears in `references/retrieval/retrieval-conventions.md:84`, `.skilled/commands/speckit/search.md:116`, `.skilled/commands/speckit/README.txt:105`, `.skilled/commands/speckit/assets/search-presentation.txt:120`, `README.md:1205`, `.skilled/skills/system-spec-kit/README.md:332`, and `feature-catalog/feature-catalog.md:1078`.
- Affected surface hints: ["feature catalog archive page", "retrieval conventions", "search command", "search presentation contract", "root README", "skill README", "command README.txt"]
- Claim adjudication:

```json
{"type":"claim","claim":"Archive-search documentation omits archivedPaths and says the path record is unchanged, while rg-wrapper.mjs always adds archivedPaths and the phase 009 completion criterion reads it.","evidenceRefs":["feature-catalog/retrieval/rg-archive-search.md:28","references/retrieval/retrieval-conventions.md:84",".skilled/commands/speckit/search.md:116",".skilled/commands/speckit/assets/search-presentation.txt:120","009-proposal-search-and-routing/goal.md:47","runtime/cli/retrieval/rg-wrapper.mjs:380","runtime/cli/tests/rg-include-archive.vitest.ts:138"],"counterevidenceSought":"Searched every changed doc for archivedPaths and for any note that the field is internal; no doc names it. Read the wrapper's early record shape to confirm the field is unconditional for path records.","alternativeExplanation":"The page may describe only the human-rendered lists and treat archivedPaths as an internal field; but it explicitly says 'the report shape is unchanged' without the flag, and the field is present in the JSON output.","finalSeverity":"P1","confidence":0.97,"downgradeTrigger":"If the field is documented in an unmodified generated reference that the wrapper's readers are expected to consult, downgrade to P2."}
```

2. **`suggest-subtracks` documentation says there are three no-map cases, but a non-`NNN-slug` packet adds a fourth** -- `.skilled/skills/system-spec-kit/references/structure/folder-structure.md:141` -- Phase 009 requires a packet named like `003_under` to be named, printed with no map, and exited 0. The implementation checks `MAP_PACKET_NAME`, reports every misnamed packet, prints `no map`, and returns. The structure reference says the tool prints no map in exactly three cases, all unrelated to naming, and the feature page's no-map paragraph has the same three-case list.

Case: a track contains `003_under` and enough other packets to cross the threshold. `suggest-subtracks.mjs` prints `track demo: packet 003_under is not NNN-slug and must be renamed first` and `no map`, not a JSON map. A reader who trusts the three-case list expects a map because the track is flat, above threshold, and not already grouped.

- File: `.skilled/skills/system-spec-kit/references/structure/folder-structure.md:141`
- Evidence: `[SOURCE: specs/system-speckit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach/009-proposal-search-and-routing/goal.md:47]` states the non-NNN refusal criterion; `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/suggest-subtracks.mjs:293]` finds misnamed packets; `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/suggest-subtracks.mjs:298]` prints `no map`; `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/suggest-subtracks.vitest.ts:207]` tests the case.
- User impact: an operator with a legacy underscore-named packet gets an unexplained non-answer and may assume the tool or the track is broken, instead of renaming the packet first.
- Finding class: cross-consumer
- Scope proof: `rg -n "prints no map in three cases|three cases"` over the changed docs finds the structure reference and the feature page; both omit the naming case. The same three-case claim appears in `feature-catalog/tooling-and-scripts/sub-track-proposal.md:30`.
- Affected surface hints: ["folder-structure reference", "sub-track feature page", "suggest-subtracks operator guidance"]
- Claim adjudication:

```json
{"type":"claim","claim":"The structure reference and sub-track feature page say suggest-subtracks has exactly three no-map cases, while the implementation and phase 009 criterion add a fourth for non-NNN-slug packet folder names.","evidenceRefs":["references/structure/folder-structure.md:141","feature-catalog/tooling-and-scripts/sub-track-proposal.md:30","009-proposal-search-and-routing/goal.md:47","runtime/cli/spec/suggest-subtracks.mjs:293","runtime/cli/spec/suggest-subtracks.mjs:298","runtime/cli/tests/suggest-subtracks.vitest.ts:207"],"counterevidenceSought":"Counted the branches in proposeRetroactive before the normal threshold and grouping checks; the misnamed branch returns first and is not one of the three listed cases.","alternativeExplanation":"The three-case sentence may predate the phase-009 guard and the exception may be considered a validation diagnostic rather than a no-map case. But the output is still a no-map line and the tool exits 0, so operators need it in the list.","finalSeverity":"P1","confidence":0.94,"downgradeTrigger":"If the docs add the misnamed-packet branch as a fourth case or explicitly defer it to a linked validation page, downgrade to P2."}
```

### P2 Findings

1. **Relocation docs describe only whole-id rewrites and omit the phase-007 bare-name and pre-archive passes** -- `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/spec-packet-relocation.md:44` -- The phase-007 implementation rewrites a phase child's bare folder name in the parent's `spec.md`, `goal.md`, sibling `spec.md` files, and the moved child's summary row, and it rewrites the id a restored packet had before it was archived. The feature page says only that an old id is matched as a whole path and that a longer id is left alone; it never mentions the bare-name pass or the pre-archive alias. The test table at line 91 lists only `relocate.vitest.ts`, not the archive and real-pipeline suites that cover these behaviors.

Case: after `relocate.mjs --renumber <phase parent> --apply`, the parent `spec.md` contains no `003-gamma`, but the feature page's description of "whole old id" rewriting suggests the bare name was out of scope. A reader would not know the parent's map, handoff, and goal documents are also rewritten.

- File: `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/spec-packet-relocation.md:44`
- Evidence: `[SOURCE: specs/system-speckit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach/007-phase-map-and-prearchive-rewrites/goal.md:44]` defines the bare-name rule; `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/relocate.mjs:680]` builds the bare-name edits; `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/relocate.mjs:1029]` adds pre-archive aliases; `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/relocate.vitest.ts:328]` and `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/archive-track.vitest.ts:176]` cover the behavior.
- User impact: an operator reading the feature catalog under-anticipates the documents that will change and may hand-edit the parent's map, or may believe the parent's bare name is intentionally left stale.
- Finding class: cross-consumer
- Scope proof: `rg -n "bare name|pre-archive|preArchive|whole old id"` over the changed docs finds the feature page's whole-id sentence and no bare-name/pre-archive description; the command README at `runtime/cli/spec/README.md:120` also says only "rewrites every whole old id".
- Affected surface hints: ["feature catalog relocation page", "relocation command README", "relocation test inventory"]
- Claim adjudication: not required for P2.

## Traceability Checks

### Core Protocols

- `spec_code`: partial. Phase 009's `archivedPaths` and non-NNN criteria are implemented and tested; the docs do not describe either.
- `checklist_evidence`: pass for the phase-009 criteria rows read here; the implementation and tests match, but the documentation surfaces do not.
- `skill_agent`: partial. `SKILL.md:287` mentions `suggest-subtracks` but not the non-NNN refusal.
- `agent_cross_runtime`: notApplicable; no agent file is in the manifest.
- `feature_catalog_code`: fail. The archive-search and sub-track feature pages omit the new fields/refusals.
- `playbook_capability`: pending; the archive-search and proposal manual scenarios still need comparison in a later iteration.

## Integration Evidence

- `rg-wrapper.mjs:380-382` adds `archivedPaths` beside `paths`; `rg-include-archive.vitest.ts:138-165` asserts both the archived and empty cases.
- `suggest-subtracks.mjs:291-299` checks `MAP_PACKET_NAME`, prints each misnamed folder, then prints `no map` and returns 0.
- `relocate.mjs:680-705` builds bare-name edits; `relocate.mjs:1029` adds pre-archive aliases; the tests at `relocate.vitest.ts:328` and `archive-track.vitest.ts:176` prove both.
- No source file was modified. No build, test, `validate.sh`, or git write command was run.

## Edge Cases

- `archivedPaths` is present even when `--include-archive` is absent, as an empty array. The docs' phrase "without the flag none of these fields appear" is therefore wrong for the path recipe, even though it is true for `archived` on `results`/`counts` rows and for `jsonLane`.
- The non-NNN refusal exits 0, not 2; it is an explained non-answer, not a rejected argument.
- The bare-name pass is limited to a phase whose parent is unchanged; a re-parent leaves the old parent's rows to the phase-row pass. The docs should not imply it applies across `specs/`.

## Confirmed-Clean Surfaces

- `rg-wrapper.mjs:377-385` keeps `paths` as strings and adds `archivedPaths`; the schema version is unchanged.
- `suggest-subtracks.mjs:293-299` reports every misnamed packet before returning.
- `relocate.mjs:1029` adds the pre-archive alias only where the destination is not under `z_archive/` and the live folder is not a holder, per phase 007 D3.
- No network, secret, or shell-injection surface was touched by these documentation gaps.

## Ruled Out

- A code defect in `archivedPaths`: ruled out by `rg-wrapper.mjs:380` and the tests.
- A missing non-NNN guard: ruled out by `suggest-subtracks.mjs:293` and `suggest-subtracks.vitest.ts:207`.
- A pre-archive rewrite failure: ruled out by `relocate.mjs:1029` and `archive-track.vitest.ts:176`.

## Next Focus

- Dimension: maintainability
- Focus area: changelog/catalog/test-inventory drift and duplicated command descriptions across READMEs.
- Reason: the traceability pass found semantic doc gaps; the maintainability pass should name the structural cause so the same drift does not recur.
- Required evidence: `changelog/v2.13.0.0.md`, feature catalog root and leaf, manual playbook scenario 492, root/skill/command READMEs, and the suite inventory.

## Assessment

Dimensions addressed: traceability

Review verdict: CONDITIONAL
