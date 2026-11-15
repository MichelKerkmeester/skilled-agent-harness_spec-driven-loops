# Review Iteration 001

## Dimension

Primary dimension: **traceability** (docs against the code they name). Secondary dimensions exercised by the same pass: correctness, maintainability, security.

Review focus addressed: the operator focus asks for a docs-against-code pass over the `docs-metadata` area, including the kill-switch and direct-call switch claims, command offers on refusal, question, history or mention, Vibe command documents, the doctor hooks-file reading, and holdout hygiene. This iteration read `review/review-brief-5.txt` first, reviewed all 14 scope files, and verified their load-bearing claims against the named code. The doctor hooks-file reading (hook-wiring-check) belongs to the `vibe-hooks-doctor` area, so this iteration checked only the doctor routing claims that the `docs-metadata` files make. Holdout hygiene was checked without opening any prompt corpus.

## Dispatcher

- Mode: review, detached fan-out lineage `docs-metadata-5`.
- Session: `fanout-docs-metadata-5-1794760565927-i99t40`, generation 1, lineage mode new.
- Artifact directory: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/lineages/docs-metadata-5`.
- Budget: 60 tool calls, 10 minutes. Consumed: 56 calls, about 4 minutes.
- Doctrine: `.skilled/skills/sk-code/sk-code-review/references/review-core.md` loaded before severity calls.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/changelog/v1.1.0.0.md:1-251`
- `.skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-recommend.md:23-49`
- `.skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/command-meaning-matching.md:26-44`
- `.skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/doctor-command-routing.md:27-39`
- `.skilled/skills/system-skill-advisor/graph-metadata.json:1-80`
- `.skilled/skills/system-skill-advisor/leaf-aliases.json:1-120`
- `.skilled/skills/system-skill-advisor/leaf-manifest.json:1-70`
- `.skilled/skills/system-skill-advisor/manual-testing-playbook/manual-testing-playbook.md:27-363`
- `.skilled/skills/system-skill-advisor/manual-testing-playbook/native-cli-tools/command-offer-fit-gates.md:16-133`
- `.skilled/skills/system-skill-advisor/manual-testing-playbook/cli-hooks-and-plugin/brief-command-policy-word.md:16-198`
- `.skilled/skills/system-skill-advisor/manual-testing-playbook/cli-hooks-and-plugin/vibe-command-documents.md:16-151`
- `.skilled/skills/system-skill-advisor/runtime/tests/manual-testing-playbook.vitest.ts:1-77`
- `.skilled/skills/system-skill-advisor/runtime/tests/README.md:1-215`
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json` (signals and adjacency for `system-skill-advisor`)

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **Meaning-match row count is one behind the generated bridge corpus** -- `.skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/command-meaning-matching.md:26` -- The catalog says `derive-command-bridges.cjs` writes an `embeddingText` for "46 rows in all". The generated artifact it describes carries 47 active TypeScript bridges, all 47 with a non-empty `embeddingText`: `command-bridges.generated.json` reports `counts.typescriptActive=47`, and a field count over `entries` finds 47 embedding texts (36 doctor rows plus 11 metadata rows, including the recently added `command-create-manual-testing-playbook`).
   - Case: a maintainer checks whether a newly added command row is covered by command-meaning matching, reads 46 in the catalog, and stops one row short of the actual TypeScript-served set.
   - Evidence: `[SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json:1]` (`counts` block), and `[SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs:690]` (`commandEmbeddingText` is the writer named by the doc).
   - User impact: the catalog understates the semantic-lane corpus by one row, so a coverage claim about "each command row the TypeScript scorer serves" is false as written.
   - Finding class: instance-only
   - Scope proof: the count appears only at `command-meaning-matching.md:26`; `rg -n "46 rows"` over the 14 scope files returns that line alone, and the generated file is the only artifact the sentence names.
   - Affected surface hints: ["feature catalog: command meaning matching", "generated command bridges", "meaning-match coverage"]
   - Recommendation: state the count as generated, or update it to 47 and name the row added since the sentence was written.

2. **Playbook execution instructions name a directory shape that no longer exists** -- `.skilled/skills/system-skill-advisor/manual-testing-playbook/manual-testing-playbook.md:103` -- "Inputs Required" item 2 tells the operator to find per-feature files under `manual-testing-playbook/NN__category_name/`. The package uses feature-named directories with no numeric prefix (`native-cli-tools/`, `cli-hooks-and-plugin/`, `compat-and-disable/`, `operator-h5/`, `auto-update-daemon/`, `auto-indexing/`, `lifecycle-routing/`, `scorer-fusion/`, `python-compat/`). The same retired numbering survives at line 38, which says the layout "skips slot `09--*`", although no directory carries a slot number.
   - Case: an operator follows the review protocol and looks for `manual-testing-playbook/01__native_cli_tools/`, finds no such directory, and has to reverse-engineer the real layout from the section tables.
   - Evidence: `[SOURCE: .skilled/skills/system-skill-advisor/manual-testing-playbook/manual-testing-playbook.md:103]`; directory listing of `manual-testing-playbook/` shows the nine feature-named directories and no `NN__` form; `[SOURCE: .skilled/skills/system-skill-advisor/manual-testing-playbook/manual-testing-playbook.md:38]`.
   - User impact: the manual-validation contract's first execution step points at a path shape that resolves to nothing, which makes the protocol harder to run exactly as written.
   - Finding class: instance-only
   - Scope proof: `rg -n "NN__category_name|09--"` over the playbook package returns only these two lines; every section table uses the live feature-named paths, so the instruction is the outlier rather than a second convention.
   - Affected surface hints: ["manual testing playbook: inputs", "playbook directory layout", "operator protocol"]
   - Recommendation: replace `NN__category_name/` with "the feature-named category directory" and drop or date-stamp the slot-number note.

3. **Wave 2 schedules a scenario the package says is not authored** -- `.skilled/skills/system-skill-advisor/manual-testing-playbook/manual-testing-playbook.md:155` -- The wave plan runs `CL-001`, `CL-004..CL-010`. The category table marks CL-004 as "not yet authored" at line 194, and `cli-hooks-and-plugin/` holds seven files with no `004-opencode-hook-and-wrapper.md`.
   - Case: an operator executing Wave 2 opens the CL-004 row from the category table, finds no scenario file, and cannot record the `PASS`, `FAIL` or `SKIP` outcome that the result-persistence contract requires.
   - Evidence: `[SOURCE: .skilled/skills/system-skill-advisor/manual-testing-playbook/manual-testing-playbook.md:155]`; `[SOURCE: .skilled/skills/system-skill-advisor/manual-testing-playbook/manual-testing-playbook.md:194]`; directory listing of `manual-testing-playbook/cli-hooks-and-plugin/`.
   - User impact: a release-gate wave cannot be executed as scheduled, so the wave plan and the 53-file inventory disagree about what Wave 2 contains.
   - Finding class: instance-only
   - Scope proof: the wave plan is the only place CL-004 is scheduled; the scenario table is the only place it is declared unauthored, and `rg -n "CL-004"` over the package returns those two lines.
   - Affected surface hints: ["manual testing playbook: wave plan", "CL-004 scenario", "release readiness rule"]
   - Recommendation: schedule `CL-005..CL-010` in Wave 2, or drop CL-004 from the wave list until its file lands.

4. **The upgrade note says the retired create-skill name has no alias while the release note says it still reads** -- `.skilled/skills/system-skill-advisor/changelog/v1.1.0.0.md:251` -- Upgrade Notes says "If you type `/create:skill`: type `/create:sk-skill` instead. The old name has no alias." Six sections earlier the same document says "A typed `/create:skill` now reads as `/create:sk-skill`" and "The retired name lives only in the `RETIRED_COMMANDS` table". The code agrees with the earlier section: `RETIRED_COMMANDS` maps `/create:skill` to `/create:sk-skill` and `typedCommandIn()` returns the mapped name.
   - Case: a maintainer reads only Upgrade Notes, concludes the old spelling is dead, and deletes `RETIRED_COMMANDS` as unused; a prompt that types `/create:skill` then loses the command the earlier section promises.
   - Evidence: `[SOURCE: .skilled/skills/system-skill-advisor/changelog/v1.1.0.0.md:251]`; `[SOURCE: .skilled/skills/system-skill-advisor/changelog/v1.1.0.0.md:104]`; `[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:214]` (the table) and `[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:240]` (the redirection).
   - User impact: two opposite migration instructions in one release note; the one a reader is most likely to act on is the wrong one.
   - Finding class: instance-only
   - Scope proof: both statements are in this one changelog and describe the same typed spelling; `rg -n "create:skill"` over the scope files returns the release note and the two command-attach references, with no third convention.
   - Affected surface hints: ["changelog: upgraded notes", "changelog: retired command", "command-attach RETIRED_COMMANDS"]
   - Recommendation: say "the old name has no command file of its own; typing it is redirected by `RETIRED_COMMANDS`", matching the body section.

5. **The tests README's directory tree omits every command-surfacing suite added by this packet** -- `.skilled/skills/system-skill-advisor/runtime/tests/README.md:95` -- The `## 4. DIRECTORY TREE` block lists 39 `.ts`/`.json` files; the directory holds 91. Every file the block lists exists, but 52 files are unlisted, including `command-attach-guards.vitest.ts`, `command-attach.vitest.ts`, `command-offer.vitest.ts`, `command-transcript-score.vitest.ts`, `command-bridges-drift-guard.vitest.ts` and `command-behaviour-guards.vitest.ts`. The `## 5. KEY FILES` table also omits them.
   - Case: a maintainer diagnosing a refusal-gate regression reads the README tree and the key-files table, finds no `command-attach-guards.vitest.ts`, and concludes the refusal, question, no-edit and small-edit gates have no regression suite.
   - Evidence: `[SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/README.md:95]` (tree start) through line 140; `[SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/README.md:146]` (key-files table start); a file-listing comparison over the directory returns 91 files with 52 unlisted and 0 listed-but-absent; NC-012 names the missing suite at `[SOURCE: .skilled/skills/system-skill-advisor/manual-testing-playbook/native-cli-tools/command-offer-fit-gates.md:123]`.
   - User impact: the tests README cannot route a reader to the regression coverage for the feature this packet changed, which is the README's stated purpose.
   - Finding class: class-of-bug
   - Scope proof: the same omission pattern covers all six command-surfacing suites, so the fix is a family update rather than one line; the 39 listed files all resolve, which proves this is staleness rather than a fictional inventory.
   - Affected surface hints: ["tests README: directory tree", "tests README: key files", "command-attach regression suites"]
   - Recommendation: regenerate the tree from the directory listing, or replace the partial tree with a stable subfolder map and name the command-surfacing suites in the key-files table.

6. **The generated leaf manifest skips the DSH hook README while listing its three siblings** -- `.skilled/skills/system-skill-advisor/leaf-manifest.json:51` -- The leaf list carries `hooks/claude/README.md`, `hooks/lib/README.md` and `hooks/pi/README.md`, and then the two hook contract docs. `hooks/dsh/README.md` exists but is absent from both `leaf-manifest.json` and `leaf-aliases.json`. The cause is authored: `leaf-scopes.json` names the same three sibling READMEs and no DSH entry, so the generator is doing what the scope says.
   - Case: leaf retrieval asks for the DSH prompt-advisor documentation by leaf resource; the manifest and alias projection return nothing, while the parallel Claude, Pi and lib READMEs are reachable.
   - Evidence: `[SOURCE: .skilled/skills/system-skill-advisor/leaf-manifest.json:51]`; `[SOURCE: .skilled/skills/sk-doc/sk-create-skill/references/shared/skill-root-metadata-contract.md:104]` (the manifest is a function of the declared corpus); `hooks/dsh/README.md` exists on disk and `rg -n "hooks/dsh/README"` over the skill returns no manifest or alias row.
   - User impact: the runtime added in this release has an operator README that no leaf-routing surface can reach, unlike every other maintained hook runtime.
   - Finding class: instance-only
   - Scope proof: a set comparison between the manifest and aliases finds 119 identical leaves with 0 missing on disk, so this is a scope omission, not a generator failure; the three sibling README rows prove the intended pattern.
   - Affected surface hints: ["leaf-manifest.json", "leaf-aliases.json", "leaf-scopes.json", "hooks/dsh/README.md"]
   - Recommendation: add `hooks/dsh/README.md` to `leaf-scopes.json` and regenerate both metadata files.

## Traceability Checks

| Protocol | Level | Status | Evidence |
|----------|-------|--------|----------|
| `spec_code` | core | partial | The review target's top level has no `spec.md` reference to the docs-metadata files; phase child `025-release-notes-and-doc-sync` owns the release-note intent. Doc-to-code claims were checked directly instead. |
| `checklist_evidence` | core | notApplicable | No top-level `checklist.md` exists; phase children own their checklists and are outside this lineage's declared scope. |
| `skill_agent` | overlay | pass | The scoped docs describe `system-skill-advisor` behavior; the skill's `SKILL.md` routes readers to the same playbook and catalog packages. |
| `agent_cross_runtime` | overlay | partial | `vibe-command-documents.md` and `brief-command-policy-word.md` name their runtime surfaces and match `hooks/vibe/prompt-advisor.mjs` and `runtime/lib/render.ts`; the Codex, Cursor and Devin shims are outside the scope list and were not re-verified. |
| `feature_catalog_code` | overlay | partial | Four catalog leaves checked against their named code; two findings (row count, changelog alias note) and several confirmed-clean claims. |
| `playbook_capability` | overlay | partial | Playbook inventory, wave plan and scenario contracts checked; two defects (path shape, CL-004) and one clean inventory test. |

## Integration Evidence

Exact surfaces reviewed as evidence for the doc claims:

- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts` — `MODE_COMMANDS`, `TRACKED_COMMANDS`, `RETIRED_COMMANDS`, `SMALL_EDIT_WORDING`, `NO_EDIT_REQUEST`, `COMMAND_DECLINE_LEADS`, `COMMAND_ASK_LEADS`, `MODE_SUFFIX`.
- `.skilled/skills/system-skill-advisor/runtime/lib/render.ts` — `policyWord()`, `parentNamedOnly()`, `PARENT_NAMED_POLICY`.
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts` — `COMMAND_MEANING_MIN_COSINE`, `COMMAND_MEANING_MARGIN`, `readOnlyRouteAllowed()`, `rankMeaningPassedCommandFirst()`.
- `.skilled/skills/system-skill-advisor/hooks/vibe/prompt-advisor.mjs` — `buildAdvisorPart()`, `withCommandDocuments()`, `COMMAND_DOCUMENT_LABEL`.
- `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json` and `derive-command-bridges.cjs` — generated counts and embedding text.
- `.skilled/skills/system-skill-advisor/runtime/lib/advisor-disabled.ts` and `.skilled/hooks/shared/hook-flags.cjs` — the disable switch resolver and its truthy value rule.
- `.skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts` — `compiledRoute`, `effectiveThresholds`, strict input and output records.
- `.skilled/skills/system-skill-advisor/runtime/lib/metrics.ts` — health record caps (200 durable records, 30 summarised).
- `.skilled/skills/system-skill-advisor/leaf-scopes.json` — authored scope that drives the generated manifest.

## Edge Cases

- Generated metadata is not authored truth. Findings 1 and 6 are recorded against the document and the authored scope, not against the generator; the generated files themselves are consistent with their inputs.
- The playbook's `NN__` reference could be read as historical prose. It is reported because it sits in "Inputs Required" under the review protocol, not in a historical note.
- Wave 2's CL-004 entry could be a placeholder for future work. It is reported because the same document already marks the scenario unauthored, so the wave plan and the table describe different packages.
- The changelog's "no alias" line could mean "no command file of its own". The wording still contradicts the body's "now reads as", so the ambiguity is recorded with a low-severity recommendation rather than a code claim.
- Iteration 1 checked claims against named constants and functions; it did not execute the advisor CLI or the vitest suites, because this lineage must not run repo tooling that writes outside its folder. A claim that depends on runtime output is verified by the named code path, not by a live run; that limit is carried forward.
- No prompt corpus was opened. Holdout hygiene holds: the scoped docs contain no holdout prompt text, and the only holdout references in the wider catalog/playbook set are aggregate metric names.

## Confirmed-Clean Surfaces

- Every relative markdown link in the nine scoped markdown files resolves; 0 broken targets.
- `doctor-command-routing.md:69` links DOC-385 to DOC-391, and the doctor playbook holds exactly those seven contiguous IDs, with the endpoint files matching the link text.
- `graph-metadata.json` and `runtime/scripts/skill-graph.json` agree exactly: 32 intent signals in both directions, 0 signal drift, and 0 enhance-edge drift.
- `leaf-manifest.json` and `leaf-aliases.json` carry the same 119 leaves, and every leaf exists on disk.
- The root playbook and `manual-testing-playbook.vitest.ts` agree on the 53-row inventory, the 53-file category tree, and the persistence-contract strings the test asserts.
- `brief-command-policy-word.md` expectations match the command rows: `/doctor:git setup` is `run` plus `read-only`, `/doctor:speckit` is `run` plus `add-only`, and `/doctor:update` is `ask` plus `mutates`, so the child marker applies to exactly the two the scenario names.
- `command-meaning-matching.md` constants and test count match code: 0.72 minimum cosine, 0.02 margin, and 28 `it()` cases in `command-meaning-anchor.vitest.ts`.
- `advisor-recommend.md` cited line anchors are accurate: `skill-advisor-cli-fallback.ts:238` is `includeCompiledRoute: true`, `tools/advisor-recommend.ts:23-24` and `skill-advisor-cli-manifest.ts:57-58` declare the two options, and the schema's `compiledRoute` and `effectiveThresholds` shapes match the prose.
- The kill-switch claim "any truthy value" is consistent with the documented switch vocabulary: `hook-flags.cjs` accepts `1`, `true`, `yes` and `on` after trim and lowercase, and `hook-flags.env.example` defines truthy as that list and shows `=0` as the way to re-enable.
- The `:auto`, `:confirm` and `:autopilot` mode suffixes named in the changelog are exactly the three the `MODE_SUFFIX` pattern accepts.
- The small-edit gate names are live: `SMALL_EDIT_WORDING` contains `typo` and the pattern adds `line \d+`, matching the NC-012 typo case.
- No scope violation occurred: no file outside the lineage directory was created, modified or deleted.

## Ruled Out

- Link rot across the nine scoped documents: every relative target exists.
- Graph metadata drift between `graph-metadata.json` and `skill-graph.json`: none.
- A stale manifest or alias row pointing at a missing file: none; all 119 leaves resolve.
- A stale line anchor in `advisor-recommend.md` for the options it cites: none; all four anchors land on the named declarations.
- A mismatch between the tests README and the files it does list: none; all 39 listed files exist, so the defect is omission rather than invention.
- A kill-switch value-rule mismatch: the "truthy" vocabulary is defined and honoured.
- A `:autopilot` suffix mismatch: the code accepts all three documented suffixes.
- A playbook inventory mismatch: the root document, the category tree and the inventory test agree on 53 scenarios.

## Next Focus

- Dimension: maintainability
- Focus area: `runtime/tests/README.md` inventory and the playbook package structure; decide whether the tests tree should be regenerated or replaced with a stable subfolder map, and whether the playbook path instructions should name the live feature directories.
- Reason: two of iteration 1's six advisories are structural documentation defects in the same two packages, and both need a maintainability read before they can be closed.
- Rotation status: traceability completed for all 14 scope files; correctness, security and maintainability remain.
- Blocked/productive carry-forward: productive — direct claim-to-code verification found every defect cheaply.
- Required evidence: file-listing comparison for the tests README, the playbook directory listing, and the authored `leaf-scopes.json` row set.
- Recovery note: none; the loop has no failed iteration.

Review verdict: PASS
