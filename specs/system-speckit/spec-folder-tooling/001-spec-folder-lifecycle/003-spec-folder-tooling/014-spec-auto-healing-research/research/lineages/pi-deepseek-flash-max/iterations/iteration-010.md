# Iteration 10: Pre-v4 corpus evidence, what the eras actually look like

## Focus

Ground the detection design in the corpus itself: measure which old-format classes actually exist in this tree (template header versions, missing generated metadata, non-packet copies), and map each class to the pipeline stage that would own it.

## Actions Taken

- Counted template header versions across `specs/**/*.md` with `rg -o`.
- Counted archived numbered packet directories and how many lack `description.json` or `graph-metadata.json`, excluding the containment baseline and research lineages.
- Counted live top-level packets lacking generated metadata.
- Noted the raw count distortion caused by non-packet copies.

## Findings

1. Template header versions in the corpus are overwhelmingly `v2.2`, but old-version classes exist and are measurable: `resource-map | v1.1` appears 224 times against `resource-map | v2.2` 98 times, plus `handover | v1.0` (66) and `research | v1.0` (48). A version-aware detector has real data to classify, not hypotheticals. [SOURCE: rg count over specs/**/*.md] CONFIRMED
2. Header naming drift is real and breaks naive version detection: the implementation summary template appears as `impl-summary-core | v2.2` (3,618), `implementation-summary-core | v2.2` (176) and `implementation-summary | v2.2` (95); decision-record appears as `decision-record | v2.2` (711) and `decision-record-core | v2.2` (30). Any classifier must normalize names against the level manifest and report unknown spellings as their own class instead of guessing a version. [SOURCE: rg count over specs/**/*.md] CONFIRMED
3. Pre-generated-metadata packets exist in the archive: of 2,281 archived numbered directories (excluding containment and research copies), 74 lack `description.json` and 77 lack `graph-metadata.json`, while live top-level packets have zero missing. These cannot be newly scaffolded packets, because `create.sh` generates both files. [SOURCE: find over specs/**/z_archive/**] CONFIRMED
4. Corpus-wide tooling must exclude non-packet copies or it double-counts massively: including this research lineage's containment baseline (a full copy of `specs/`) inflated the archived-directory count from 2,281 to 8,198. Research lineage directories, scratch fixtures, changelog entries and containment snapshots all need explicit exclusion; `heal-spec-docs.cjs` already maintains a skip list, and its own comment records that its packet-name regex is the fourth copy of the same pattern, so this classifier is a known duplication cost. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:36] CONFIRMED
5. The old-format classes map to existing pipeline stages: no frontmatter at all maps to `fill-frontmatter`; missing or non-matching template headers map to `heal-spec-docs` (proven by anchors); missing generated metadata and stale paths map to `migrate-generated-json` and `repair-derived`; anchor structure has no stage yet (iteration 6); missing required documents stay lane work with the dated note (iteration 7). [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:589] CONFIRMED for the mapping of existing stages, INFERRED for coverage completeness
6. "Pre-v4" is not one era but a bundle of independent ones: pre-frontmatter documents, old template header versions, pre-generated-metadata packets, and possibly flat or non-conforming folder names. A single version verdict would be fiction; the detection census must report per-class counts and let each class route to its own repair stage. [SOURCE: re-derived counts from this iteration] INFERRED from the measured class spread, confirmable by running the census once built

## Ruled Out

- A single "repo version" detector: the corpus holds documents from several template generations at once, including within one repository, so version claims must be per-document class, not per-tree.
- Trusting raw `find` counts for scope: the containment baseline copy proves any unexcluded subtree can multiply the numbers by several times.

## Dead Ends

- Counting archived packets with a plain `find -name 'NNN-*'`: it counts nested phase children and non-packet copies, so a shared classifier is a prerequisite for every planned report.

## Edge Cases

- Ambiguous input: none.
- Contradictory evidence: none; the header counts and the missing-metadata counts are independent indicators that agree on the archive-side concentration.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted

- `rg -o 'SPECKIT_TEMPLATE_SOURCE: ...' specs/**/*.md`
- `find specs/**/z_archive` packet-directory counts with exclusions
- `.skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs`
- `.skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs`

## Assessment

- New information ratio: 0.85 (5 of 6 findings fully new; 1 consolidates the stage mapping and counts as half new)
- Questions addressed: Q3 detection evidence, Q5 census requirements
- Questions answered: none yet

## Recommendations

| ID | Recommendation | Question | Where it lives | Effort | Risk | Files touched | Evidence | Standing | Idempotent? | Reversed by | Changes document prose? |
|----|----------------|----------|----------------|--------|------|---------------|----------|----------|-------------|-------------|--------------------------|
| R-026 | Build the detection census on one shared packet classifier with an explicit exclusion list (containment, research lineages, scratch, changelog, node_modules), and report per-class counts per track; a raw find is not a census | Q3, Q5 | Shared module beside `heal-spec-docs.cjs` or in `runtime/cli/lib` | S to M | Low; read-only, but wrong scope would misreport the corpus | New shared classifier plus report | The raw count inflated 2,281 to 8,198 when containment was included; the regex is already the fourth copy of the same pattern | CONFIRMED defect risk | Yes (read-only) | Delete the script | No |
| R-027 | Classify template versions through the level manifest's canonical names plus a pinned alias table, and report any unmatched header as `unknown-header` rather than inferring a version; include the v1.1 vs v2.2 resource-map split and the three implementation-summary spellings as the first alias cases | Q3 | Census module plus `templates/spec-kit-docs.json` consumers | S | Low; report-only | Census module, alias table | 224 v1.1 vs 98 v2.2 resource maps; three impl-summary headers | CONFIRMED class spread | Yes (read-only) | Delete the script | No |
| R-028 | Route each detected class to its named stage in the census output (fill-frontmatter, heal, anchor repair, repair-derived, migrate, lane), so the operator sees a per-class plan before approving any apply | Q3, Q1 | Census output plus the doctor presentation | S | Low | Census module | Iteration 6-9 stage map | INFERRED presentation, CONFIRMED stages | Yes (read-only) | Delete the script | No |

## Reflection

- What worked and why: two read-only count commands produced hard class evidence, including a real pitfall (containment double-counting) that no design document would have supplied.
- What did not work and why: the first counts were wrong because the lineage's own containment copy sits under `specs/`; excluding it is now a recommendation rather than a footnote.
- What I would do differently: run corpus counts from the repository root with explicit exclusion globs from the start.

## Recommended Next Focus

Iteration 11: begin Q4. Read the branch's own change surfaces in the committed diffs: the trigger-index CI rebuild workflow and its token push, the Gate 3 series-parent tooling, and the template phrase tools as committed, to judge what should be hardened.
