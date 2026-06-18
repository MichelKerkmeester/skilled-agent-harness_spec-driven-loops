# Iteration 017 — Angle 17

**Angle:** Feature-flag truth: ENV_REFERENCE's 179 documented variables vs code-declared flags — automated diff tooling as a guard.

**Summary:** The documented ENV_REFERENCE surface is not truth-synchronized with code: its headline count is stale, active runtime env switches are missing, and the governance checks are manual/static rather than automated. A generated diff guard with explicit allowlists would turn this from advisory documentation into enforceable drift protection.

**Findings kept:** 4

## [P1][DOC-DRIFT] ENV_REFERENCE unique-variable count is stale

- Evidence: .opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:127 claims "Total unique variables documented: 179"; command `node - <<'NODE' ... parse /^| `([^`]+)`/ table rows ... NODE` output: `{"documentedTableVars":233,...}`
- Detail: The canonical reference claims 179 documented variables, but a direct parse of its own variable table rows finds 233 unique variables. The same document also says it is generated from source analysis at line 633, so the stale count weakens operator trust in the reference.
- Fix sketch: Regenerate the count from the rendered table during docs generation and fail CI when the literal count diverges.

## [P1][DOC-DRIFT] Runtime env flags are missing from ENV_REFERENCE

- Evidence: Command `node - <<'NODE' ... scan runtime .ts/.js/.cjs/.sh env refs and compare to ENV_REFERENCE table vars ... NODE` output: `runtimeEnvRefs: 384`, `undocumentedRuntimeRefs: 178`, selected misses include `SPECKIT_CODE_GRAPH_BM25_SYMBOL_RESOLVER` at `.opencode/skills/system-code-graph/mcp_server/lib/symbol-bm25-resolver.ts:6`, `SPECKIT_CODE_GRAPH_TOMBSTONES` at `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:227`, and `SPECKIT_BOOT_FTS_AUTOHEAL` at `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:379`.
- Detail: ENV_REFERENCE claims to cover all SPECKIT variables, but active runtime switches are not documented there. The omissions include operator-impacting controls for boot FTS auto-heal, code-graph tombstone auditing, and BM25 symbol resolver behavior.
- Fix sketch: Add an env-reference audit script with an allowlist for intentionally private/test-only variables, then document or explicitly exempt every remaining runtime env reference.

## [P2][BROKEN-FEATURE] Feature-flag governance guard is manual, not automated

- Evidence: .opencode/skills/system-spec-kit/manual_testing_playbook/17--governance/feature-flag-governance.md:36-40 lists pseudo-steps `enumerate flags`, `verify each flag row`, `record any flag`; line 57 says to diff code-declared flags against ENV_REFERENCE; `grep` for `ENV_REFERENCE\.md|Total unique variables documented` in `.opencode/skills/system-spec-kit/mcp_server/tests` returned `No files found`.
- Detail: The governance scenario describes the right invariant, but there is no executable guard enforcing it. Existing tests cover selected catalog mappings, not the ENV_REFERENCE-vs-code truth surface.
- Fix sketch: Promote the manual scenario into a Vitest or Node CLI checker that extracts code-declared env vars, parses ENV_REFERENCE, reports missing/stale rows, and runs in the normal test suite.

## [P2][DOC-DRIFT] Flag ceiling test falsely claims full search-flags coverage

- Evidence: .opencode/skills/system-spec-kit/mcp_server/tests/flag-ceiling.vitest.ts:30 says `All SPECKIT_* feature flags from search-flags.ts`; lines 33-52 list only 18 flags; lines 193-197 claim all active flags are covered; `.opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts:637-724` alone declares additional active gates such as `SPECKIT_QUERY_CONCEPT_EXPANSION`, `SPECKIT_GRAPH_FALLBACK`, `SPECKIT_RESULT_PROVENANCE`, and `SPECKIT_INTENT_AUTO_PROFILE`.
- Detail: The test is a static hand-maintained inventory and has drifted far behind the actual `search-flags.ts` surface. It can pass while missing many active feature gates, so it does not function as a truth guard.
- Fix sketch: Derive the tested flag list from `search-flags.ts` or from a shared registry instead of maintaining a manual array.
