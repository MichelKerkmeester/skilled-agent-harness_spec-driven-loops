# Iteration 053: Resource-Map Automation

## Focus
Inspected the current resource-map template, extractor, tests, and deep-research emission path to propose stale-reference detection and coverage gates for 027.

## Findings
1. The template already defines the stale-reference vocabulary needed for automation: summary rows include total references and missing-on-disk count, and status values include `OK`, `MISSING`, and `PLANNED`. [SOURCE: .opencode/skills/system-spec-kit/templates/manifest/resource-map.md.tmpl:37-48]
2. The template requires repo-relative paths, one path per row, action/status columns, category precedence, deletion of empty categories without renumbering, and a size budget; these are enough to define lint gates without changing the document shape. [SOURCE: .opencode/skills/system-spec-kit/templates/manifest/resource-map.md.tmpl:171-197]
3. The extractor already normalizes research/review evidence into the same ten categories, computes missing-on-disk counts, emits `Degraded` metadata when rows are skipped, and writes deterministic tables from normalized entries. [SOURCE: .opencode/skills/system-spec-kit/scripts/resource-map/extract-from-evidence.cjs:81-139] [SOURCE: .opencode/skills/system-spec-kit/scripts/resource-map/extract-from-evidence.cjs:148-177]
4. Existing tests prove research-shaped maps count citations per iteration and strip `:line` / `:line-range` suffixes before status checks, so stale-reference detection should reuse that line-anchor normalization instead of treating cited file:line anchors as missing paths. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/scripts/tests/resource-map-extractor.vitest.ts:93-158] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/scripts/tests/resource-map-extractor.vitest.ts:160-198]
5. Deep-research synthesis already has a workflow-owned `--emit-resource-map` pass reading delta JSONL files and writing `resource-map.md`, with an opt-out via `config.resource_map.emit=false`; 027 should extend gates around this path instead of adding agent-owned resource-map edits. [SOURCE: .opencode/skills/deep-research/feature_catalog/loop-lifecycle/006-resource-map-emission.md:18-40] [SOURCE: .opencode/commands/deep/assets/deep_start-research-loop_auto.yaml:996-1004]
6. The current 027 parent map exists as a template-shaped parent aggregate and several child maps exist, but the continuation packet's isolated artifact root has no emitted resource-map yet; the gate should distinguish "not yet synthesized" from stale or missing. [SOURCE: specs/system-spec-kit/027-xce-research-based-refinement/resource-map.md:19-24] [SOURCE: specs/system-spec-kit/027-xce-research-based-refinement/research/027-continuation-21-2026-06-04/research.md:28-30]

## Proposed 027 Gates
- Stale-reference gate: parse resource-map rows, strip line anchors, require every non-`PLANNED` path to resolve or be explicitly `MISSING` with a note.
- Coverage gate: require all sources cited by iteration deltas to appear in the emitted map or be counted in `Degraded rows skipped`.
- Scope gate: require exactly one parent-aggregate or per-child strategy per packet; do not mix both for the same scope.
- Freshness gate: when new deltas exist after resource-map generation time, mark map stale and rerun reducer emission.

## Ruled Out
- Manual-only stale detection was ruled out because the extractor already has file-existence and line-anchor normalization behavior under test. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/scripts/tests/resource-map-extractor.vitest.ts:160-198]
- Agent-owned resource-map authoring was ruled out because the live contract says synthesis triggers reducer emission while iterations keep using reducer/registry/dashboard/strategy refreshes. [SOURCE: .opencode/skills/deep-research/feature_catalog/loop-lifecycle/006-resource-map-emission.md:24-28]

## Dead Ends
- Do not require all ten category headings to be present in research output: tests show research-shaped maps omit empty categories while preserving original category numbers. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/scripts/tests/resource-map-extractor.vitest.ts:137-148]

## Edge Cases
- Ambiguous input: "resource-map automation" could mean template lint, extractor changes, or workflow gates. I selected workflow/lint gates and deferred implementation.
- Contradictory evidence: template wording says deep loops are emitted automatically by phase-013 integration, while current deep-research feature docs name the reducer `--emit-resource-map` path; the reducer path is better supported by live script/YAML evidence. [SOURCE: .opencode/skills/system-spec-kit/templates/manifest/resource-map.md.tmpl:24-30] [SOURCE: .opencode/commands/deep/assets/deep_start-research-loop_auto.yaml:996-1004]
- Missing dependencies: no generated continuation resource-map exists in the isolated artifact root yet.
- Partial success: complete design proposal; no extractor code was changed.

## Sources Consulted
- .opencode/skills/system-spec-kit/templates/manifest/resource-map.md.tmpl:37-48
- .opencode/skills/system-spec-kit/templates/manifest/resource-map.md.tmpl:171-197
- .opencode/skills/system-spec-kit/scripts/resource-map/extract-from-evidence.cjs:81-139
- .opencode/skills/system-spec-kit/scripts/resource-map/extract-from-evidence.cjs:148-177
- .opencode/skills/system-spec-kit/mcp_server/scripts/tests/resource-map-extractor.vitest.ts:93-198
- .opencode/skills/deep-research/feature_catalog/loop-lifecycle/006-resource-map-emission.md:18-40
- .opencode/commands/deep/assets/deep_start-research-loop_auto.yaml:996-1004
- specs/system-spec-kit/027-xce-research-based-refinement/resource-map.md:19-24

## Assessment
- New information ratio: 0.90
- Questions addressed: 053 resource-map automation
- Questions answered: stale-reference and coverage gates can be layered on existing extractor/emission contracts.

## Reflection
- What worked and why: Reading the extractor tests gave concrete gate semantics for line anchors and omitted categories.
- What did not work and why: The continuation packet has no emitted map yet, so live staleness could not be measured.
- What I would do differently: After synthesis, run the extractor against actual 052-060 deltas and compare source coverage to the emitted map.

## Recommended Next Focus
Implement a read-only resource-map verifier that reports missing non-planned paths, uncited delta sources, stale generated timestamps, and mixed aggregate/per-child map strategy.
