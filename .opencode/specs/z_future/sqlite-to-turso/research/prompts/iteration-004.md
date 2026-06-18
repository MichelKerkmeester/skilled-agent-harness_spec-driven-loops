You are one read-only research seat executing iteration 4 of a deep-research loop. Repository root: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public (your CWD).

TOPIC: Revalidate the SQLite-to-Turso migration research (baseline docs written against Turso v0.5.0) against the VENDORED Turso source tree at v0.7.0-pre.6 and current web state.

THIS ITERATION FOCUS: C4 SQL feature gaps
Questions (answer ALL):
- C4a WITH RECURSIVE support at 0.7.0-pre.6 — causal-boost.ts and memo.ts in spec-kit depend on recursive CTEs — gap 6
- C4b CREATE TRIGGER support (outside MVCC mode) — mutation-ledger append-only triggers (prevent_ledger_update/delete) and FTS-sync triggers depend on it — gaps 8/12
- C4c window function status at 0.7.0-pre.6 — gap 14

EVIDENCE SOURCES (in priority order):
1. Vendored Turso source: .opencode/specs/z_future/sqlite-to-turso/external/turso-main/ — start with COMPAT.md, CHANGELOG.md, core/, docs/, bindings/javascript/. Cite as [SOURCE: <repo-relative path>:<line>].
2. Baseline claims to revalidate: .opencode/specs/z_future/sqlite-to-turso/research/"003 - gaps-and-workarounds-sqlite-to-turso.md", "001 - analysis-...".md, "002 - recommendations-...".md.
3. Live-code blocker map: .opencode/specs/z_future/sqlite-to-turso/context/context-report.md.
4. Web (WebSearch/WebFetch) for post-vendor state: Turso releases/issues after v0.7.0-pre.6. Cite URLs.

ALREADY ESTABLISHED (do not re-research): Turso SDK at 0.7.0-pre.6 HAS a .pragma() method (engine-level pragma gaps remain); FTS5 absent — Turso FTS (Tantivy) is experimental-gated via index_method feature flag; NoMergePolicy unconditional; vector indexing status covered by iteration 2.

BUDGET: target 8-11 tool calls, hard max 12. Read-only: do NOT write, edit, or create any files. Do NOT dispatch agents.

RETURN your complete result as markdown with EXACTLY these sections (the state reducer parses them):
# Iteration 4: C4 SQL feature gaps
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
