# Iteration 8: Residual Claim Verification — Rule Count, Chart Forms, Diagram Types

## Focus

All five key questions are ticked in strategy §3 and the registry lists no open questions, so the dispatch's next-focus line is the placeholder `[All tracked questions are resolved]`. Per the focus rule, this iteration investigated the lowest-coverage area instead of inventing a new question.

That area is the residue of the Q4 claim audit: iteration 6 explicitly left three numeric claims unverified rather than wrong — "42 validation rules", "29 chart forms" and "27 diagram types" — and recorded that the rule count could not be established by the method it tried. A README rewrite that carries an UNKNOWN in its Spec Kit section is not finished, so the narrowest useful pass is to settle those three numbers against their authoritative sources and record why the earlier attempt failed.

## Actions Taken

1. Read the run config, the state projection, the strategy and the findings registry to fix the iteration number, the exhausted-approach list and the lifecycle branch (`new`).
2. Located every README occurrence of the three claims by pattern search, so the verification would bind to the exact lines a rewrite must preserve or change: `README.md:153`, `:403`, `:405`, `:410`, `:809` for the rule count; `README.md:918`, `:919`, `:1309`, `:1310` for the chart and diagram counts.
3. Enumerated `.skilled/skills/system-spec-kit/runtime/cli/rules/` and classified its 44 entries: 33 `check-*.sh` entry points, 8 `.cjs` helpers, 2 `.mjs` helpers and one `README.md`. This confirmed the directory is a script collection, not a rule registry, and reproduced the shape that defeated the iteration-6 grep.
4. Followed `VALIDATOR_REGISTRY_JSON` from `validate.sh` to `.skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json` and read its structure: a top-level array of 42 objects, each with `rule_id`, `severity`, `category`, `script_path`, `description` and `aliases`.
5. Counted the registry by category and severity, and printed every `rule_id` and every `severity: warn` entry.
6. Counted the diagram type files under `sk-design-diagram/references/types/` and read the chart catalog's machine-read index between its `CHART_CATALOG` sentinels.

## Findings

1. **The "42 validation rules" claim is correct, and the authoritative source is a JSON registry rather than the rules directory or the reference doc.** `validate.sh` binds `VALIDATOR_REGISTRY_JSON` to `runtime/cli/lib/validator-registry.json`, and that file is a top-level array of exactly 42 objects. The category split is 23 `authored_template`, 13 `operational_runtime` and 6 `structural`. The four README occurrences (`README.md:153`, `:403`, `:410`, `:809`) and the `validate.sh` usage note therefore all stand; the rewrite must not "correct" this number. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json:1] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh:20]

2. **The "eight of them only warn" claim is also correct, and the README names two examples rather than the full set.** Exactly eight registry entries carry `severity: warn`: `FRONTMATTER_VALUES`, `SOURCE_TAGS`, `MEASURED_BEHAVIOR`, `GRAPH_METADATA_PRESENT`, `GRAPH_METADATA_CHILD_DRIFT`, `GRAPH_METADATA_SHAPE`, `DESCRIPTION_SHAPE` and `LINKS_VALID`. `README.md:405` names `FRONTMATTER_VALUES` and `SOURCE_TAGS` as "two of those worth knowing", which is an example selection, not a completeness claim, so it does not overstate. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json:1] [SOURCE: README.md:405]

3. **The reference doc documents 16 of the 42 rules, which is why the earlier count produced a wrong number.** `validation-rules.md` §2 RULE SUMMARY lists 16 rule ids from `FILE_EXISTS` to `MEASURED_BEHAVIOR`, and its later sections expand only some of those. A doc-based count therefore understates by 26, while a directory-based count sees 33 entry points plus 10 helpers and matches nothing. The durable rule for the rewrite and for future audits: the rule count lives in `validator-registry.json`, and neither `references/validation/validation-rules.md` nor `runtime/cli/rules/` is a count source. [SOURCE: .skilled/skills/system-spec-kit/references/validation/validation-rules.md:56] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/rules/README.md:1]

4. **"29 chart forms" is correct and is enforced in both directions by the catalog contract.** The machine-read index between the `CHART_CATALOG:BEGIN` and `CHART_CATALOG:END` sentinels holds 29 id rows, from `histogram` through `heat-matrix`. The catalog's own contract states that the corpus check verifies every `id` resolves to a file that identifies itself with the same id, and every chart form on disk appears in the index, so the row count is a maintained invariant rather than prose. [SOURCE: .skilled/skills/sk-design/sk-design-chart/references/catalog.md:48] [SOURCE: .skilled/skills/sk-design/sk-design-chart/references/catalog.md:82]

5. **"27 diagram types" is correct, with the type files and the feature catalog agreeing.** `sk-design-diagram/references/types/` holds 27 `type-*.md` files, the type-selection feature doc lists "`references/types/type-*.md` (27 files)" as the conditional per-type resource, and the v1.0.0.0 changelog states the references cover 27 types. Three independent statements and a directory count agree. [SOURCE: .skilled/skills/sk-design/sk-design-diagram/feature-catalog/diagram-generation/type-selection-and-routing.md:46] [SOURCE: .skilled/skills/sk-design/sk-design-diagram/changelog/v1.0.0.0.md:25]

## Ruled Out

- **Counting rule ids by grepping quoted uppercase strings under `runtime/cli/rules`.** Already blocked in strategy §9 after iteration 6; this iteration confirms the reason from the other side. The directory holds 33 `check-*.sh` entry points plus 10 helpers, and the rule identity lives in a sibling JSON registry, so no grep over that directory can produce a rule count.
- **Counting rules from `references/validation/validation-rules.md`.** The doc's §2 table documents 16 rules, so it understates the registry by 26. It is a reader's guide to selected rules, not the registry.
- **Editing `research/research.md` to fold in Q3 and this iteration's verifications.** `progressiveSynthesis` is true in config, but this dispatch's allowed-write list names only `iterations/iteration-008.md` and `deltas/iter-008.jsonl`, so the edit was not executed. Recorded under SCOPE VIOLATIONS for the workflow owner.

## Dead Ends

- None. Every action produced usable evidence, and the three unverified claims are now settled.

## Edge Cases

- Ambiguous input: the dispatch's focus line is the placeholder `[All tracked questions are resolved]`. Selected the lowest-coverage area named by the prior audit (the three unverified numeric claims) and recorded the alternative — pure convergence with no research — as not taken.
- Contradictory evidence: none. The registry, the catalog sentinels, the diagram type directory and the feature catalog all agree with the README claims.
- Missing dependencies: none. `resource-map.md` is absent by config (`resource_map_present: false`), so the coverage gate is skipped rather than failed.
- Partial success: none. The rule count, the warn-only count, the chart-form count and the diagram-type count are each established from a source that enumerates them.

## SCOPE VIOLATIONS

- **Would-be mutation: `research/research.md`.** Config sets `progressiveSynthesis: true`, which normally authorises appending iteration findings to the synthesis. This dispatch's allowed-write list does not include that path, so no edit was made. The concrete consequence is that the synthesis is one iteration behind: its §5 OPEN QUESTIONS still lists Q3 and Q4 as open although both were answered in iterations 6 and 7, and it has no Q3 section carrying the per-runtime adapter map. The workflow owner or the synthesis step must fold in iteration 7's Q3 close-out and this iteration's verifications. No file outside the allowed-write list was modified.

## Sources Consulted

- `README.md:153`, `:403`, `:405`, `:410`, `:809`, `:918`, `:919`, `:1309`, `:1310`
- `.skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh:20`
- `.skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json` (42 entries; ids, categories, severities)
- `.skilled/skills/system-spec-kit/runtime/cli/rules/README.md` and the directory's 44-entry listing
- `.skilled/skills/system-spec-kit/references/validation/validation-rules.md:52-71`
- `.skilled/skills/sk-design/sk-design-chart/references/catalog.md:48-82`
- `.skilled/skills/sk-design/sk-design-diagram/references/types/` (27 `type-*.md` files)
- `.skilled/skills/sk-design/sk-design-diagram/feature-catalog/diagram-generation/type-selection-and-routing.md:46`
- `.skilled/skills/sk-design/sk-design-diagram/changelog/v1.0.0.0.md:25`
- `specs/system-speckit/runtime-and-release/004-v4-release-line-research/025-root-readme-rewrite/research/iterations/iteration-006.md`, `iteration-007.md`

## Assessment

- New information ratio: 0.60
- Questions addressed: none open; residual claims from Q4
- Questions answered: none (Q1-Q5 were already answered)

## Reflection

- What worked and why: following the `VALIDATOR_REGISTRY_JSON` variable out of `validate.sh` replaced guessing with a pointer. One `grep` for the assignment gave the exact path, and the registry then answered the count, the category split and the warn-only subset in a single `jq` pass. The earlier failure was not a bad grep — it was searching the wrong artefact, because the script directory and the prose doc are both derived from a registry neither of them is.
- What did not work and why: the first `jq` probe assumed the registry had a `rules` key and an `id` field, so it errored twice before `keys` showed a top-level array with `rule_id`. Two calls were spent on schema guesses that one `keys` call would have answered first. The same shape mistake as iteration 3's `workflowModes` probe, now on a different file.
- What I would do differently: run `jq 'keys'` (or `jq 'type'`) before any field-specific query, every time. The iteration-3 lesson was recorded for `mode-registry.json` only; it generalises to every JSON probe and should be applied as a habit, not a per-file note.

## Questions Answered

- None. All five key questions were answered before this iteration (Q1 iteration 2, Q2 iteration 4, Q5 iteration 5, Q4 iteration 6, Q3 iteration 7).

## Questions Remaining

- None. The three numeric claims the Q4 audit left unverified are now settled, and the strategy §5 stop condition (all key questions answered plus Q3 cross-checked against every runtime directory) is met.

## Next Focus

Convergence and synthesis, not new research. The remaining work is assembly: fold iteration 7's three-form hook adapter model (with its verified counts Claude 32, Codex 27, Cursor 25, Devin 29, OpenCode 20, Pi 22, DSH 22 registered, Vibe 18) and this iteration's four verified numbers into `research/research.md`, correct its stale §5 open-questions list, then write the README from the Q5 tier order. The only research-adjacent item left is a product decision, not a fact: `sk-design` has no top-level `README.md`, so the root catalog cannot shrink its `sk-design` row to a skill README until one exists.
