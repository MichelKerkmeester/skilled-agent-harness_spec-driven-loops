# Iteration 3: Render-block grammar, time windows, and validation

## Focus

Document the common `health-viz` contract and its file-layer edge cases, including a mock-data fallback that can mask missing real exports.

## Actions Taken

1. Inspected the live common-key table and bundled-example behavior.
2. Traced literal, dynamic, and frontmatter date resolution.
3. Traced sub-day slicing and aggregate recomputation.
4. Inspected validation errors, click behavior, and appearance overrides.

## Findings

1. A `health-viz` block is line-oriented `key: value` data with `type` required; common optional keys are `width`, `height`, inclusive `from`, inclusive `to`, `last`, and `clickAction`. Renderer-specific keys remain type-dependent. [SOURCE: https://community.obsidian.md/plugins/health-md]
2. `from`, `to`, and renderer `date` fields accept literal ISO dates/datetimes, built-in `{{variable[:format]}}` expressions, and top-level note frontmatter via `{property}` or `${property}`. Raw Templater and Dataview expressions are explicitly unreliable inside the block processor lifecycle. [SOURCE: https://community.obsidian.md/plugins/health-md]
3. `last: N` means N calendar days ending today, or ending at `to` when supplied. Datetimes may include `Z` or `±HH:MM`; timezone-free values follow local `Date.parse` semantics. [SOURCE: https://community.obsidian.md/plugins/health-md]
4. Sub-day filters recompute heart, vitals, sleep, and workout aggregates from sliced samples, but activity and mobility totals remain full-day because the export has no sub-day samples for them. Automation must not present partial-day steps/calories as actually sliced. [SOURCE: https://community.obsidian.md/plugins/health-md]
5. If the default `Health/` folder is missing or empty, the plugin falls back to its bundled deterministic mock dataset. This is useful for demos but dangerous for validation: a chart rendering successfully does not prove that real vault health exports were discovered. [SOURCE: https://community.obsidian.md/plugins/health-md]
6. Canvas charts support hover and `pin|source|daily` clicks; JSON/CSV sources open in a built-in read-only viewer. Appearance overrides include theme/palette aliases and named colors, while invalid dates, missing variables, non-positive `last`, reversed ranges, and empty windows render inline errors. [SOURCE: https://github.com/CodyBontecou/health-md-visualizations] [SOURCE: https://community.obsidian.md/plugins/health-md]

## Questions Answered

- Common render-block grammar, date variables, time slicing, appearance and click overrides, and validation behavior.

## Questions Remaining

- Roll-up/data-dictionary/lossless-archive boundaries and schema-v7 semantics.
- Exporter profiles, granular files, and privacy-sensitive operating constraints.

## Ruled Out

- Injecting raw Templater or Dataview expressions into `health-viz` blocks.
- Assuming successful render proves real data exists when the default folder is empty.
- Claiming partial-day activity totals are recomputed.

## Dead Ends

- None; the live Community mirror exposed the full rendering contract.

## Edge Cases

- Ambiguous input: `{property}` is a Health.md frontmatter reference, while `{{variable}}` is a built-in dynamic date expression.
- Contradictory evidence: none.
- Missing dependencies: bundled mock-data fallback can conceal absent production data and must be checked explicitly.
- Partial success: partial-day slicing is metric-dependent rather than uniformly exact.

## Sources Consulted

- https://community.obsidian.md/plugins/health-md
- https://github.com/CodyBontecou/health-md-visualizations

## Assessment

- New information ratio: 0.92
- Novelty justification: five findings were fully new and the appearance/click finding partially extended prior settings evidence.

## Reflection

- What worked and why: the Community page included exact parser semantics and failure messages rather than only examples.
- What did not work and why: renderer-specific arguments are too numerous for one iteration and belong in the plugin's own visualization reference.
- What I would do differently: future file-layer validation should assert a real source path or disable the mock fallback before judging success.

## Recommended Next Focus

Separate daily summaries, roll-ups, the data dictionary, lossless archives, granular notes, and bounded source previews.
