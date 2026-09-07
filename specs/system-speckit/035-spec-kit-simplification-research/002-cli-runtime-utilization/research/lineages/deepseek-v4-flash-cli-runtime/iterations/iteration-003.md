---
title: "Iteration 3: live registry vs script tree — the unregistered and the unwired"
trigger_phrases: []
---
# Iteration 3: Live registry vs script tree — the unregistered and the unwired

## Focus

Q5: with `scripts-registry.json` gone, `lib/validator-registry.json` is the only registry. Verify it against the script tree: is every registered path real, is every dispatched check registered, are there checks in the tree the orchestrator never reaches, and are the helpers sourced rather than standalone-registered? Also disambiguate the two check-links files (root vs rules/).

## Actions Taken

1. Parsed `lib/validator-registry.json` (a top-level LIST of 39 rule objects — not an object with a rules key; the round-one "39 entries" reading matches): 31 unique script_path values. 26 point at `rules/check-*.sh`, 3 at `validation/*.ts` (continuity-freshness, generated-metadata-drift, generated-metadata-integrity), plus the 2 virtual types (native:orchestrator ×1, ts:spec-doc-structure ×5 across rule ids). Existence check: every non-virtual path resolves (the 6 virtual values are the only non-files).
2. Cross-checked every `rules/check-*` file against the registry path set: 31 files in rules/ (28 check scripts + 3 helper files). Unregistered: check-doc-pointers.sh, check-links.sh, and the three helpers (check-canonical-save-helper.cjs, check-grep-convention-helper.mjs, check-metadata-disk-consistency-helper.cjs). The helpers are sourced by their .sh parents (verified: check-canonical-save.sh:13, check-grep-convention.sh:17, check-metadata-disk-consistency.sh:43) — legitimate, not findings.
3. Caller census for the two unregistered check scripts over `.opencode` + `.github` (excluding specs, dist, node_modules): `check-doc-pointers` — ZERO content references anywhere (no registry entry, no checker, no hook, no plugin, no workflow, no README/feature-catalog row, no comment). `check-links` — 8 hits: post-edit-quality/lib/post-edit-router.cjs:40 (execs `rules/check-links.sh` directly), post-edit-quality/README.md:52 (the hook's wikilinks row), rules/README.md, feature-catalog/spec-validation-rule-engine.md:79, feature-catalog/markdown-link-integrity-guard.md:21, cli/check-markdown-links.cjs:6 (comment), and the two check-links files themselves.
4. Read both check-links files: root `cli/check-links.sh` is a compatibility shim ("Delegates to rules/check-links.sh to preserve existing call paths", line 6, exec at 11). `rules/check-links.sh` is the real wikilink checker (sourced run_check + standalone).
5. Read rules/check-doc-pointers.sh header: it asserts every structured doc pointer cited in AGENTS.md resolves on disk; the header even names the harm it prevents ("observed to lead a research lineage to a false conclusion").
6. package.json scripts recount (no round-one numbers): `check` = lint + check-no-mcp-lib-imports + check-api-boundary.sh + check-architecture-boundaries + check-allowlist-expiry + check-source-dist-alignment + the two AST checks; `test` = vitest cli project + legacy + validation lanes; `test:task-enrichment` uses its own config; `check:ast` repeats the two AST checks that `check` already runs.

## Findings

1. **P1 — one rules/ check is dead, unregistered and uncalled**: `rules/check-doc-pointers.sh`. Declared purpose (header, lines 3-8): fail-loud check that every structured doc pointer cited in AGENTS.md resolves on disk. Observed callers: **none found** — zero occurrences of the string `check-doc-pointers` anywhere in `.opencode`/`.github` content (excluding specs/dist/node_modules): not in lib/validator-registry.json (grep count 0), not in rules/README.md, not in the feature catalog, not in any hook/plugin/workflow/command, not referenced by any other check. It is the ONLY rules/ check script in that state; round one's "0 dangling paths, 1 dead-but-registered shim" verdict missed it because it checked registry→script direction and import direction, not script→registry/→caller direction for every rules/ file. Severity P1 (dead — the orchestrator can never reach it; nothing reaches it). Recommendation: **remove** (or register + dispatch it, if AGENTS.md pointer integrity is still wanted — that is a judgment for the package owner, not this audit).

2. **P1 — the root check-links.sh compatibility shim has no surviving call path**: `cli/check-links.sh:6,11` declares itself a compatibility entrypoint "to preserve existing call paths", but the only real caller (`.opencode/hooks/post-edit-quality/lib/post-edit-router.cjs:40`) execs `rules/check-links.sh` directly; the shim's remaining citations are feature-catalog/spec-validation-rule-engine.md:79 ("Standalone checker ... run on demand; not registered with the orchestrator") and a comment in cli/check-markdown-links.cjs:6. No executable caller targets the shim itself. Declared purpose: preserved call path for the wikilink checker. Observed callers: zero executables; documentation only. Severity P1 (dead entry point — same evidence class as doctor.sh, which 007 removed). Recommendation: **remove** — the doc row at spec-validation-rule-engine.md:79 should then name `rules/check-links.sh` (or the row goes; the hook is the consumer).

3. (Verification positive, no finding): registry coherence — all 39 rule ids resolve to real paths (through 31 unique values; 26 rules/ scripts + 3 validation/ TS + 2 virtual types); the three `.cjs`/`.mjs` helpers are sourced by their parents, not standalone entries; the two placeholder/comment-hygiene lanes and the 39-rule dispatch story hold at the file level.

## Questions Answered

- (Q5, resolved) The live registry is complete in the dispatcher→script direction and the helper lanes are legitimate; the script→registry direction exposes exactly two outliers, and one of them (check-doc-pointers.sh) is fully dead.

## Questions Remaining

- Q4: per-file caller verdicts for the corners round one covered in one pass: root shell/cjs entries (check-api-boundary.sh, check-markdown-links.cjs, deploy-mcp.sh, test-council-matrix.sh, validate-command-tree-parity.sh, common.sh), utils/ (20 files, absent from round one's resource-map), tests/ and test-fixtures/ inventory, config/, types/, loaders/ (iteration 4-6).
- Q7: doctor-route vs workflow mirror parity (iteration 7); the retrieval/ and graph/ post-007 state (iteration 8); duplicated helpers across cli/ ../lib/ shared/ (iteration 9).

## What Worked / What Failed

- Worked: the script→registry direction — iterating `rules/` and asking "is this one reachable?" instead of the registry-driven direction round one used.
- Worked: distinguishing the three helper files (sourced → legitimate) from the two check scripts (standalone → must be registered or called).
- Failed: none; no approach exhausted.

## Ruled Out

- check-links.sh (rules/) as dead — it IS the hook's wikilink checker (post-edit-router.cjs:40), just unreachable through the registry by design; documented as such in spec-validation-rule-engine.md:79.

## Sources

[SOURCE: .opencode/skills/system-spec-kit/runtime/cli/lib/validator-registry.json (parsed: 39 ids, 31 unique paths)] [SOURCE: .opencode/skills/system-spec-kit/runtime/cli/rules/ (ls + 3 helper-sourcing lines 13/17/43)] [SOURCE: .opencode/skills/system-spec-kit/runtime/cli/rules/check-doc-pointers.sh:3-8 (header)] [SOURCE: .opencode/skills/system-spec-kit/runtime/cli/check-links.sh:3-11] [SOURCE: .opencode/skills/system-spec-kit/runtime/cli/rules/check-links.sh:1-10] [SOURCE: .opencode/hooks/post-edit-quality/lib/post-edit-router.cjs:40] [SOURCE: .opencode/skills/system-spec-kit/feature-catalog/tooling-and-scripts/spec-validation-rule-engine.md:79] [SOURCE: .opencode/skills/system-spec-kit/runtime/cli/check-markdown-links.cjs:6] [SOURCE: .opencode/skills/system-spec-kit/runtime/cli/package.json (scripts recount)]

## Next Iteration

Iteration 4: the root-level entries and the one-pass corners — check-api-boundary.sh, check-markdown-links.cjs, deploy-mcp.sh, test-council-matrix.sh, validate-command-tree-parity.sh, common.sh, check-command-references (if present) — every root file gets a caller verdict; then utils/ (20 files) which is absent from round one's resource-map entirely.
