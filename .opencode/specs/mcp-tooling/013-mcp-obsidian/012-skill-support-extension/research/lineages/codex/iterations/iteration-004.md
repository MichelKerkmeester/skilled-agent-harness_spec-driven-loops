# Iteration 4: Summary, roll-up, dictionary, and lossless boundaries

## Focus

Separate the plugin's ingest surfaces so a file-layer operator does not double count data, flatten provenance, or expose giant sensitive payloads.

## Actions Taken

1. Inspected the plugin's current schema-compatibility section.
2. Cross-checked the companion Apple exporter's schema-v7 contract.
3. Traced format-specific lossless behavior.
4. Traced roll-up indexing, dictionary use, granular Markdown, and bounded preview behavior.

## Findings

1. The core chart dataset is the stable daily-summary layer. In schema v6/v7 JSON, `healthmd.healthkit_records` v1 is an embedded authoritative source archive, but the plugin ingests only compact capture status, schema version, record counts, query-status counts, and warnings from it. [SOURCE: https://github.com/CodyBontecou/health-md-visualizations] [SOURCE: https://github.com/CodyBontecou/health-md]
2. UUID relationships, routes, waveforms, clinical payloads, binary attachments, and canonical source records do not enter the in-memory day cache or metric summaries. This is both a double-counting guard and a resource/privacy boundary. [SOURCE: https://github.com/CodyBontecou/health-md-visualizations]
3. Weekly/monthly/yearly `healthmd.rollup_summary` artifacts under `Health/Rollups/` are indexed separately and never become daily chart points. JSON, Markdown, and Bases roll-ups carry v7 semantics; roll-up CSV is an unversioned structural format because its public header lacks a schema-version field. [SOURCE: https://github.com/CodyBontecou/health-md-visualizations] [SOURCE: https://community.obsidian.md/plugins/health-md]
4. Schema v7 corrects VO₂ Max aggregation to choose the latest daily measurement, restores canonical units in extended CSV summary rows, and retains period-calendar timezone labels. Older roll-ups may therefore differ legitimately and should not be silently rewritten. [SOURCE: https://github.com/CodyBontecou/health-md]
5. `_healthmd_data_dictionary.json` maps customized exporter names back to stable aliases, canonical units, metric IDs, and metric types. It is metadata needed for reliable field interpretation, not a daily data point. [SOURCE: https://github.com/CodyBontecou/health-md-visualizations]
6. Format roles are intentionally asymmetric: JSON embeds the authoritative archive; CSV can carry canonical objects as RFC 4180-safe JSON rows; Markdown and Bases show summaries plus archive diagnostics rather than every source object. Markdown without frontmatter may expose supported granular tables but cannot assert schema, canonical units, timezone, or capture completeness. [SOURCE: https://github.com/CodyBontecou/health-md] [SOURCE: https://github.com/CodyBontecou/health-md-visualizations]
7. Large JSON/CSV inputs and lossless files receive compact metadata and bounded previews in the built-in viewer, avoiding full canonical/base64 payload insertion into the DOM. [SOURCE: https://community.obsidian.md/plugins/health-md]

## Questions Answered

- Roll-up separation, dictionary purpose, lossless archive boundaries, granular Markdown limits, and large-file preview behavior.

## Questions Remaining

- Apple/Android export profile differences, individual-entry discovery, authorization gaps, and privacy constraints.

## Ruled Out

- Flattening daily summaries, roll-ups, and source archives into one record stream.
- Treating the data dictionary as health observations.
- Inferring schema, units, timezone, or completeness from metadata-free prose.
- Rewriting older VO₂ roll-ups without explicit migration intent.

## Dead Ends

- GitHub search did not index the detailed schema document, but the current plugin and canonical exporter READMEs independently exposed the required contract.

## Edge Cases

- Ambiguous input: `includeGranularData` is retained as a compatibility setting name even though current Apple copy calls the feature Lossless Health Records.
- Contradictory evidence: the Apple README says new installs default lossless capture on while an adjacent summary sentence describes summary-only starts. This affects exporter onboarding wording, not the plugin parser boundary; confirm the actual app setting when operating a device.
- Missing dependencies: exact roll-up field tables were unavailable through the web cache; semantic rules above are directly documented.
- Partial success: none for plugin behavior; exporter-default wording remains best-effort.

## Sources Consulted

- https://github.com/CodyBontecou/health-md-visualizations
- https://community.obsidian.md/plugins/health-md
- https://github.com/CodyBontecou/health-md

## Assessment

- New information ratio: 0.93
- Novelty justification: six findings were fully new and one bounded an already known large-file concern.

## Reflection

- What worked and why: plugin and exporter sources described opposite sides of the same compatibility boundary.
- What did not work and why: the detailed schema file was uncached, so field-level enumeration is explicitly not claimed.
- What I would do differently: pin a specific exporter commit when authoring long-lived schema tables.

## Recommended Next Focus

Compare Apple and Android export profiles, individual-entry files, authorization-dependent fields, and privacy/security implications for automation.
