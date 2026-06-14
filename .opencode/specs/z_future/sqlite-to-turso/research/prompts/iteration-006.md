You are one read-only research seat executing iteration 6 of a deep-research loop. Repository root: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public (your CWD).

TOPIC: Revalidate the SQLite-to-Turso migration research (baseline docs written against Turso v0.5.0) against the VENDORED Turso source tree at v0.7.0-pre.6 and current web state.

THIS ITERATION FOCUS: C6 ops and lifecycle
Questions (answer ALL):
- C6a VACUUM support at 0.7.0-pre.6; do file-copy checkpoint snapshots (checkpoints.ts copies the .sqlite file) stay valid? — gap 9
- C6b CDC stability: still unstable/preview? fit to replace mutation-ledger triggers and audit trails? — gap 10
- C6c beta-stability record since v0.5.0: corruption/data-loss issues closed or open, release cadence, signals on 1.0 timeline

EVIDENCE SOURCES (in priority order):
1. Vendored Turso source: .opencode/specs/z_future/sqlite-to-turso/external/turso-main/ — start with COMPAT.md, CHANGELOG.md, core/, docs/, bindings/javascript/. Cite as [SOURCE: <repo-relative path>:<line>].
2. Baseline claims to revalidate: .opencode/specs/z_future/sqlite-to-turso/research/"003 - gaps-and-workarounds-sqlite-to-turso.md", "001 - analysis-...".md, "002 - recommendations-...".md.
3. Live-code blocker map: .opencode/specs/z_future/sqlite-to-turso/context/context-report.md.
4. Web (WebSearch/WebFetch) for post-vendor state: Turso releases/issues after v0.7.0-pre.6. Cite URLs.

ALREADY ESTABLISHED (do not re-research): Turso SDK at 0.7.0-pre.6 HAS a .pragma() method (engine-level pragma gaps remain); FTS5 absent — Turso FTS (Tantivy) is experimental-gated via index_method feature flag; NoMergePolicy unconditional; vector indexing status covered by iteration 2.

BUDGET: target 8-11 tool calls, hard max 12. Read-only: do NOT write, edit, or create any files. Do NOT dispatch agents.

RETURN your complete result as markdown with EXACTLY these sections (the state reducer parses them):
# Iteration 6: C6 ops and lifecycle
## Focus
(one paragraph)
## Findings
(one bullet per finding; EACH bullet starts with NEW|PARTIAL|KNOWN — novelty vs the baseline docs — then for gap questions a verdict UNCHANGED|CHANGED|REFUTED vs the baseline claim, then evidence with [SOURCE: path:line] or URL)
## Ruled Out
(claims/directions now disproven)
## Dead Ends
(searches/sources that yielded nothing)
## Sources Consulted
(complete list: files with line ranges, URLs)
## Reflection
- What worked: ...
- What failed: ...
- Confidence: high|medium|low + why
## Recommended Next Focus
(one sentence)
