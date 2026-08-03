# Iteration 2: Data discovery, settings, and cache behavior

## Focus

Map how the plugin finds vault data and which settings are safe for a file-layer operator to reason about.

## Actions Taken

1. Inspected the current repository settings table.
2. Cross-checked the same settings on the live Obsidian Community listing.
3. Verified folder nesting and file-pattern examples.
4. Traced documented watcher/cache and compatibility-scan behavior.

## Findings

1. The default data folder is `Health`, but it is a configurable vault-relative path with folder autocomplete. A file-layer agent must read the setting rather than hard-code `Health/` when operating an existing vault. [SOURCE: https://github.com/CodyBontecou/health-md-visualizations] [SOURCE: https://community.obsidian.md/plugins/health-md]
2. Folder structure is opt-in: `Flat` preserves direct-child loading, while `Year`, `Month`, `Week`, `Day`, and `Custom template` enable bounded nested scanning. Custom templates support `{year}`, `{month}`, `{week}`, `{day}`, and `{date}` plus literal segments. [SOURCE: https://github.com/CodyBontecou/health-md-visualizations] [SOURCE: https://community.obsidian.md/plugins/health-md]
3. Even in nested modes, files directly under the data folder remain eligible. This deliberate migration behavior means a vault can contain flat and nested exports simultaneously without moving old files first. [SOURCE: https://github.com/CodyBontecou/health-md-visualizations]
4. `File pattern` is a glob filter, not a filename template; examples range from `*.json` and `health-*.csv` to `2026/**/*.json`. `Data format` can remain `auto` or be pinned to JSON, CSV, Markdown, or Bases. [SOURCE: https://community.obsidian.md/plugins/health-md]
5. Vault create/modify/delete events under the data folder invalidate the plugin cache. The schema-compatibility `Scan now` action is the explicit diagnostic path after exporter settings change; re-exporting history is recommended only when corrected v7 summary or roll-up semantics are needed. [SOURCE: https://github.com/CodyBontecou/health-md-visualizations] [SOURCE: https://community.obsidian.md/plugins/health-md]

## Questions Answered

- Folder discovery, nesting, pattern filtering, format selection, cache invalidation, and compatibility scanning.

## Questions Remaining

- Complete `health-viz` block grammar and filtering behavior.
- Roll-up/data-dictionary/lossless-archive boundaries.
- Exporter profiles and privacy-sensitive file-layer risks.

## Ruled Out

- Hard-coding `Health/` as an invariant path.
- Moving flat files when enabling nested folders; root-level files intentionally continue to load.
- Treating `File pattern` as the exporter's filename template.

## Dead Ends

- None. Repository and Community sources agreed on the settings contract.

## Edge Cases

- Ambiguous input: custom folder templates and file globs are separate settings and must not be conflated.
- Contradictory evidence: none.
- Missing dependencies: the actual per-vault settings file was out of scope; this iteration documents the public contract, not a specific vault value.
- Partial success: none.

## Sources Consulted

- https://github.com/CodyBontecou/health-md-visualizations
- https://community.obsidian.md/plugins/health-md

## Assessment

- New information ratio: 0.90
- Novelty justification: four findings were fully new and one refined the earlier format-dispatch finding.

## Reflection

- What worked and why: the duplicated primary surfaces made settings claims independently checkable.
- What did not work and why: no failure beyond the unavailable vault-specific value, which is intentionally runtime-dependent.
- What I would do differently: inspect an installed plugin `data.json` only during a later vault-specific operation, never infer it here.

## Recommended Next Focus

Document the `health-viz` block grammar, date variables, time slicing, appearance overrides, click behavior, and validation failures.
