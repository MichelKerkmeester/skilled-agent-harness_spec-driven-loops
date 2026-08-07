# Iteration 6: Packet-reference drift audit

## Focus

Audit the existing Health.md reference set against the converged primary-source findings and isolate changes required before it can be trusted as an operating contract.

## Actions Taken

1. Enumerated the packet's Health.md reference, catalog, asset, and playbook surfaces.
2. Read the index, data-model, workflow, and troubleshooting references in full.
3. Compared their examples and safety language with the current plugin README and the five completed research tracks.
4. Classified mismatches by operational impact without modifying any source reference.

## Findings

1. Critical drift: both the index and workflow use a fenced `health-md` block with invented `type: chart`, `metric: step_count`, and `dateRange: last7d` keys. The current plugin requires a `health-viz` fence, a registered visualization `type`, and common `from`/`to`/`last` keys. Copying the packet example will not exercise the documented plugin contract. [SOURCE: https://github.com/CodyBontecou/health-md-visualizations]
2. The reference set repeatedly describes the input as Apple Health only, but the current plugin explicitly supports shared Apple HealthKit/Android Health Connect summary fields with documented partial and platform-only coverage. This can cause agents to reject valid Android daily exports or promise unavailable cross-platform charts. [SOURCE: https://github.com/CodyBontecou/health-md-visualizations] [SOURCE: https://github.com/CodyBontecou/health-md]
3. The current index grants broad AI authority to create, append, and patch export files and roll-ups. That conflicts with the stronger research boundary: health observations must originate from real exports, roll-ups have versioned aggregation semantics, and raw/lossless artifacts should not be rewritten. File-layer work should preserve authentic supplied data, not synthesize health records or recompute canonical exports casually. [SOURCE: https://github.com/CodyBontecou/health-md] [SOURCE: https://github.com/CodyBontecou/health-md-android]
4. The first-time and verification workflows omit the deterministic mock-data fallback. When the default `Health/` folder is absent or empty, a successful render may use bundled examples, so read-back plus a visible chart is not proof that real exports were loaded. Verification must identify an actual source file/path and distinguish bundled data. [SOURCE: https://github.com/CodyBontecou/health-md-visualizations]
5. The references omit individual workout-entry discovery, Android raw-snapshot separation, permission-dependent missing fields, iOS-only mood/medication charts, Android Stand proxy behavior, and the absence of Android-only plugin charts. These gaps make the present troubleshooting flow unable to distinguish a parser failure from expected platform/authorization absence. [SOURCE: https://github.com/CodyBontecou/health-md-visualizations] [SOURCE: https://github.com/CodyBontecou/health-md-android]
6. The index says changing the data folder means moving data, while the plugin separately supports a configurable data-folder path, nested structures, and root-file compatibility. Moving data is one migration choice, not an invariant. The settings surface is also understated: structure, custom template, format, appearance, click behavior, and compatibility scan are relevant beyond path/pattern. [SOURCE: https://github.com/CodyBontecou/health-md-visualizations]
7. Several existing details are accurate and reusable: v0-v7 mixed-vault support, best-effort newer schemas, roll-up separation, dictionary metadata, compact archive diagnostics, nested root-file discovery, watcher invalidation, and bounded previews. The reference set needs correction and expansion, not wholesale replacement. [SOURCE: https://github.com/CodyBontecou/health-md-visualizations] [SOURCE: https://community.obsidian.md/plugins/health-md]

## Questions Answered

- All five topic questions are answered, and the gap between current primary sources and packet guidance is now explicit.

## Questions Remaining

- None within the research charter.

## Ruled Out

- Treating the existing chart example as a valid safe-start template.
- Preserving Apple-only framing for a cross-platform plugin contract.
- Using a successful mock-backed render as proof of real data ingestion.
- Replacing the reference set wholesale when much of its schema/folder guidance remains correct.

## Dead Ends

- None; the local reference set and current primary sources were directly comparable.

## Edge Cases

- Ambiguous input: `type: chart` could look plausible to an operator but is not a current registered visualization type.
- Contradictory evidence: packet guidance says copy an existing block while simultaneously presenting an invalid block as quick start.
- Missing dependencies: visual in-app QA remains outside this research run.
- Partial success: the existing schema and file-discovery sections are substantially correct despite the operational-example defects.

## Sources Consulted

- https://github.com/CodyBontecou/health-md-visualizations
- https://community.obsidian.md/plugins/health-md
- https://github.com/CodyBontecou/health-md
- https://github.com/CodyBontecou/health-md-android
- Local read-only packet references under `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/health-md/`

## Assessment

- New information ratio: 0.58
- Novelty justification: the audit added six actionable packet-gap findings while confirming one reusable cluster from earlier research.

## Reflection

- What worked and why: comparing executable examples first exposed the highest-impact drift immediately.
- What did not work and why: no runtime chart test was in scope, so the invalid example is established against the documented grammar rather than an Obsidian screenshot.
- What I would do differently: keep generated reference examples pinned to tested examples from the plugin repository.

## Recommended Next Focus

Synthesize the stable operating contract and the packet-reference remediation priorities.
