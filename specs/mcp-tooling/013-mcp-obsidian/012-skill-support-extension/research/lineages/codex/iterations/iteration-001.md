# Iteration 1: Current release and daily-data compatibility baseline

## Focus

Establish the current plugin/version baseline and the accepted daily-data envelope before interpreting older phase notes.

## Actions Taken

1. Inspected the current Health.md Visualizations repository and README.
2. Cross-checked the current Obsidian Community listing and compatibility metadata.
3. Inspected the plugin release history for the latest published version.
4. Compared the current daily-format contract with the older cached README surface.

## Findings

1. Health.md Visualizations 2.1.0 is the current published plugin version; the Community listing reports Obsidian 1.12.0+, desktop and mobile, and an MIT license. [SOURCE: https://community.obsidian.md/plugins/health-md]
2. The plugin accepts JSON, CSV, Markdown, and Obsidian Bases/YAML-frontmatter files. Auto mode dispatches by extension; an explicit format setting can constrain parsing. [SOURCE: https://github.com/CodyBontecou/health-md-visualizations] [SOURCE: https://community.obsidian.md/plugins/health-md]
3. Daily JSON uses a `healthmd.health_data` envelope; legacy/unversioned files are treated as v0, published versions through schema v7 are supported together in one vault, and versions newer than v7 are best-effort rather than rejected outright. [SOURCE: https://github.com/CodyBontecou/health-md-visualizations] [SOURCE: https://community.obsidian.md/plugins/health-md]
4. Every daily record needs a top-level ISO `YYYY-MM-DD` date because filtering uses lexicographic comparisons against that field. CSV expects `Date,Category,Metric,Value,Unit[,Timestamp]` and RFC 4180 quoting; Markdown may use Health.md frontmatter or supported granular tables with an ISO date. [SOURCE: https://community.obsidian.md/plugins/health-md]
5. Canonical source-record CSV rows are counted for diagnostics but not ingested as chart metrics, preventing lossless data from silently duplicating daily summaries. [SOURCE: https://community.obsidian.md/plugins/health-md]

## Questions Answered

- Current release and runtime compatibility baseline.
- Accepted daily file formats and version envelope.

## Questions Remaining

- Exact folder discovery and cache invalidation behavior.
- Render-block contract and date-window semantics.
- Roll-up/data-dictionary/lossless-archive boundaries.
- Apple/Android profile differences and automation edge cases.

## Ruled Out

- Treating the phase's initial v2-era cached README as current: current primary sources expose a substantially expanded v7 contract.
- Assuming newer-than-v7 files are hard failures: the documented behavior is best-effort parsing plus compatibility reporting.

## Dead Ends

- Direct `git ls-remote` access was unavailable in the execution sandbox, so evidence gathering used live primary-source pages through the web retrieval surface.

## Edge Cases

- Ambiguous input: "health-md" can mean the exporter platform or the Obsidian visualization plugin; this run scopes the plugin while consulting exporters only for the file contract.
- Contradictory evidence: cached README pages exposed an older v0-v2 description, while today's repository and Community listing document v0-v7. Current same-day primary sources take precedence.
- Missing dependencies: direct GitHub network access from the shell was unavailable; web retrieval supplied the primary pages.
- Partial success: none.

## Sources Consulted

- https://github.com/CodyBontecou/health-md-visualizations
- https://github.com/CodyBontecou/health-md-visualizations/releases
- https://community.obsidian.md/plugins/health-md

## Assessment

- New information ratio: 1.00
- Novelty justification: all five findings materially extend or correct the phase's starter understanding.

## Reflection

- What worked and why: same-day repository and Community snapshots exposed both schema and runtime metadata.
- What did not work and why: direct git access failed because the sandbox could not resolve github.com.
- What I would do differently: use the Community mirror first when GitHub subdirectory pages are uncached.

## Recommended Next Focus

Map data-folder discovery, nesting, file patterns, format selection, watchers, and compatibility scanning.
