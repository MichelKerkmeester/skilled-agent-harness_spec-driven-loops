# Iteration 5: Apple and Android profile boundaries

## Focus

Compare the two exporter profiles, their entry files, platform gaps, permission-sensitive fields, and automation/privacy constraints.

## Actions Taken

1. Read the canonical Health.md monorepo's public-contract inventory.
2. Inspected the Android export, raw snapshot, destination, and individual-entry contracts.
3. Cross-checked the plugin's current platform-support matrix.
4. Traced detailed workout-note discovery and permission-dependent chart behavior.

## Findings

1. Apple v7, Android frozen v4, and Android analytical v5 are explicit independent compatibility profiles. Shared filenames and formats do not make their schema semantics interchangeable. [SOURCE: https://github.com/CodyBontecou/health-md]
2. The Android exporter currently advertises 106 selectable Health Connect metrics and daily Markdown, Bases, JSON, and CSV outputs. Its raw JSON/NDJSON snapshot is a separate immutable archival product, not a daily `HealthData` summary, so it must not be routed into the plugin's daily-data folder as if it were chart input. [SOURCE: https://github.com/CodyBontecou/health-md-android]
3. Apple and Android both emit individual workout and vital-entry notes, while Android additionally documents sleep-stage entry files. The plugin discovers detailed workout notes by `type: workout`, `metric: workouts`, or workout/healthmd tags, then normalizes frontmatter, zones, laps, and splits. Entry files are therefore a distinct discovery surface, not daily-summary replacements. [SOURCE: https://github.com/CodyBontecou/health-md-android] [SOURCE: https://github.com/CodyBontecou/health-md-visualizations]
4. Shared charts render only fields actually present and generally do not substitute zero for missing data. Two explicit Android exceptions/limitations are documented: walking symmetry lacks Apple-only asymmetry and double-support details, and activity rings can derive a Stand proxy from steps when `standHours` is absent. [SOURCE: https://github.com/CodyBontecou/health-md-visualizations]
5. Mood/State of Mind and HealthKit-style medication catalog/dose-event visualizations are iOS-only. Conversely, current plugin releases have no Android-only chart even though Android exports PHR/FHIR resources, planned workouts, and activity intensity. Automation must feature-detect data rather than infer parity from a shared chart name. [SOURCE: https://github.com/CodyBontecou/health-md-visualizations]
6. Workout routes and sample charts require granular data plus route permission or consent. Ordinary vitals and summaries also depend on the user's selected metrics and authorization. Missing output is therefore ambiguous between absent source data, denied permission, unsupported platform semantics, and disabled export selection. [SOURCE: https://github.com/CodyBontecou/health-md-visualizations]
7. Android folder exports can target provider-backed folders through the Storage Access Framework; compatibility API uploads may use HTTP or HTTPS, while raw-snapshot uploads require HTTPS, reject redirects, and remove private temporary artifacts after upload attempts. A local-first product still permits user-selected remote storage or endpoints, so vault automation must treat destination configuration as part of its threat model. [SOURCE: https://github.com/CodyBontecou/health-md-android]
8. Raw/lossless exports can contain source identities, exact timestamps, routes, nested samples, medical FHIR, and other highly sensitive payloads. Keep them outside routine daily-note ingestion, avoid indiscriminate sync/indexing, and expose only bounded diagnostics/previews to Obsidian automation. [SOURCE: https://github.com/CodyBontecou/health-md-android] [SOURCE: https://github.com/CodyBontecou/health-md-visualizations]

## Questions Answered

- Apple/Android profile independence, entry-note roles, authorization ambiguity, platform-only features, and privacy/destination constraints.

## Questions Remaining

- No topic question remains; one packet-reference audit is needed before synthesis.

## Ruled Out

- Treating Apple v7 and Android v4/v5 as one semantic schema.
- Treating Android raw snapshots as daily plugin inputs.
- Substituting zero for unavailable platform fields.
- Assuming local-first means every configured destination is local.

## Dead Ends

- The linked Apple schema page did not render through the web cache. The canonical monorepo inventory and plugin compatibility text were sufficient for the cross-platform boundary; field-level Apple schema enumeration is not claimed here.

## Edge Cases

- Ambiguous input: an empty chart can reflect authorization, export selection, platform absence, or no records.
- Contradictory evidence: none in this iteration.
- Missing dependencies: exact device authorization state is runtime-only and cannot be inferred from exported absence.
- Partial success: Android Stand may be a documented steps-derived proxy rather than native `standHours`.

## Sources Consulted

- https://github.com/CodyBontecou/health-md
- https://github.com/CodyBontecou/health-md-android
- https://github.com/CodyBontecou/health-md-visualizations

## Assessment

- New information ratio: 0.90
- Novelty justification: seven findings were new and one strengthened the previously established archive/privacy boundary.

## Reflection

- What worked and why: the monorepo's explicit profile inventory prevented false cross-platform equivalence, while exporter and plugin docs exposed producer/consumer asymmetries.
- What did not work and why: the Apple schema link was not available through the web cache.
- What I would do differently: test representative Apple and Android fixtures when moving from reference guidance to implementation.

## Recommended Next Focus

Audit the packet's existing Health.md references against the five answered questions and identify documentation drift before synthesis.
