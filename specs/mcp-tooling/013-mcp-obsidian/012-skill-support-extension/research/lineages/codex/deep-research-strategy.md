# Deep Research Strategy — health-md plugin deep dive

## 1. Overview

Investigate the current Health.md Visualizations plugin and its Health.md companion exporters deeply enough to define a safe, accurate vault file-layer operating contract.

## 2. Topic

health-md plugin deep dive

<!-- ANCHOR:key-questions -->
## 3. Key Questions (remaining)

- [x] What file formats, schema generations, and canonical daily-data semantics does the plugin accept?
- [x] How do folder discovery, file patterns, format selection, caching, and compatibility scanning behave?
- [x] What is the complete `health-viz` block contract, including date variables, appearance, and validation?
- [x] How are roll-ups, the data dictionary, lossless archives, granular tables, and large files handled without double counting or unsafe ingestion?
- [x] Which Apple/Android export differences and file-layer edge cases constrain reliable automation?
<!-- /ANCHOR:key-questions -->

## 4. Non-Goals

- UI automation or visual quality evaluation inside Obsidian.
- Implementing or modifying the plugin or companion applications.
- Medical interpretation, diagnosis, targets, or recommendations.
- Surveying unrelated health or charting plugins.

## 5. Stop Conditions

- Stop at legal convergence under the configured 0.05 threshold after the minimum three iterations and quality guards pass.
- Stop at eight iterations if legal convergence has not occurred.
- Stop earlier when every key question is answered with primary-source evidence and the quality guards pass.

<!-- ANCHOR:answered-questions -->
## 6. Answered Questions

- Iteration 1: release, formats, and v0-v7 daily compatibility.
- Iteration 2: folder discovery, patterns, format selection, watcher cache, and compatibility scan.
- Iteration 3: `health-viz` grammar, dates, appearance, sub-day behavior, and mock fallback.
- Iteration 4: roll-ups, dictionary, lossless archive, granular tables, and bounded preview.
- Iteration 5: Apple/Android profiles, entry notes, permissions, destinations, and privacy.
- Iteration 6: packet-reference drift and remediation priorities.
<!-- /ANCHOR:answered-questions -->

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. What Worked

- Current plugin repository plus Obsidian Community listing exposed both the behavior contract and release metadata.
- Canonical Apple/Android repositories separated producer semantics from plugin consumer behavior.
- A final local-reference audit converted source findings into concrete packet remediation priorities.
<!-- /ANCHOR:what-worked -->

<!-- ANCHOR:what-failed -->
## 8. What Failed

- Direct GitHub CLI/network access was unavailable in the restricted shell, so primary sources were retrieved through web access.
- The linked detailed Apple schema page was unavailable through the web cache; field-level enumeration is not claimed.
- Prior-memory retrieval was unavailable and contributed no evidence.
<!-- /ANCHOR:what-failed -->

<!-- ANCHOR:exhausted-approaches -->
## 9. Exhausted Approaches

- Cached v2-era README material was rejected in favor of current primary sources.
- Treating shared file formats as proof of cross-platform semantic parity was rejected.
- Visual render success alone was rejected as validation because bundled mock data can render.
<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:ruled-out-directions -->
## 10. Ruled Out Directions

- Fabricating health records, placeholders, roll-ups, or inferred metrics.
- Flattening daily, roll-up, dictionary, entry, and raw/lossless layers.
- Using current packet quick-start examples without correction.
- Mapping missing platform or permission data to zero.
<!-- /ANCHOR:ruled-out-directions -->

<!-- ANCHOR:divergence-frontier -->
## 10A. Saturated Directions and Divergence Frontier

- Completed pivots: 5 topic tracks plus one packet-reference audit.
- Saturated: release/schema, discovery/settings, block grammar, ingest layers, platform/exporter boundaries.
- Deferred outside charter: live Obsidian rendering and representative fixture execution.
<!-- /ANCHOR:divergence-frontier -->

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. Carried-Forward Open Questions

None within the research charter.
<!-- /ANCHOR:carried-forward-open-questions -->

<!-- ANCHOR:next-focus -->
## 11. Next Focus

Research complete. Apply the remediation order in `research.md` when the parent workflow edits the reference set.
<!-- /ANCHOR:next-focus -->
<!-- MACHINE-OWNED: END -->

## 12. Known Context

- Primary sources: current plugin repository, Obsidian Community listing, canonical Health.md monorepo, and Android exporter repository.
- The packet reference set contains accurate schema/discovery material but critical drift in examples and validation guidance.
- `resource-map.md` was absent at initialization and is emitted during synthesis.
- Prior-memory retrieval was unavailable, so no memory-derived facts are treated as evidence.

## 13. Research Boundaries

- Completed iterations: 6 of 8 maximum
- Convergence threshold: 0.05
- Stop reason: all questions answered after the minimum-iteration guard, with primary-source and contradiction quality guards passing
- Progressive synthesis: true
- Executor: cli-codex / gpt-5.6-sol
- Session: fanout-codex-1785761188430-s7x969
