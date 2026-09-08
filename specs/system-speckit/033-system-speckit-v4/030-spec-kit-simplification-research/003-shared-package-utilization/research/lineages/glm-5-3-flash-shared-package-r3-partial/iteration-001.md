# Iteration 1: Cross-skill consumers — what the outside trees import vs what @spec-kit/shared still exports

## Focus

The charter's barrel (`.opencode/skills/system-spec-kit/shared/index.ts`) does not exist (dir listing 10:31:52Z; ENOENT on direct read) — the census (§1 L5) records 009 removed it with the root export. This angle therefore tests the post-remediation reality: the import lines of 8 sampled consumers outside system-spec-kit, judged against the CURRENT export map (`shared/package.json:6-12`) and the actual export surfaces of the targeted shared modules.

## Findings

| # | Claim side | Actual side | Claimed | Actual | Sev | Recommendation |
|---|-----------|-------------|---------|--------|-----|----------------|
| F1.1 | `research/lineages/glm-5-3-flash-shared-package/iterations/iteration-001.md` (F1.1: "system-deep-loop = test-only … zero production imports"), carried uncorrected through the census (`research/confirmed-findings.md` §1, no deep-loop correction) | `.opencode/skills/system-deep-loop/runtime/scripts/check-contract-drift.cjs:12` | Deep-loop consumes the package only from its 3 vitest files; zero production imports. | The production script `check-contract-drift.cjs:12` does `const { parseFrontmatter } = require('@spec-kit/shared/frontmatter/parse-frontmatter.js')`. Either added after the census's 2026-09-07 walk or missed by it; either way the recorded verdict is false today (observed). | P2 | Document: correct the recorded consumer census; deep-loop has ≥1 non-test importer. |
| F1.2 | `shared/package.json:5` (`"type": "module"`) + `:6-12` (every export maps to a `dist/*.js` ESM) + `:19-21` (`engines.node: ">=20.11.0"`) | `.opencode/skills/sk-doc/sk-create-skill/scripts/lib/root-router-contract.cjs:62` and `.opencode/skills/system-deep-loop/runtime/scripts/check-contract-drift.cjs:12` (both CJS `require()` of the `.js` subpath → `dist/frontmatter/parse-frontmatter.js`, which EXISTS: `ls` 10:54:47Z) | Any Node ≥20.11.0 can consume this package. | CommonJS consumers `require()` an ES-module target; synchronous require(ESM) is default only from later Node lines (20.19/22.12 — INFERRED from model knowledge; no node invocation permitted here to verify). Today's dev-Node works; the declared floor understates the requirement. | P2 | Fix (raise the engines floor) or document the require(ESM) requirement next to it. |
| F1.3 | Census §1 L5: "Fixed in 009: barrel and root export removed…" (the recorded fix); round-1 F1.2 recommended retiring the 3 redundant named export entries | `shared/package.json:9-10` (`./compact-merger` → `./dist/compact-merger.js`, `./budget-allocator` → `./dist/budget-allocator.js`) vs `:11-12` (`./*` → `./dist/*.js`) | 009's export-map surgery landed. | It landed half-way: the bare root and `main` are gone (census R1-01, observed here) but TWO of the three redundant named entries survive, each spelling the byte-identical target path the `./*` wildcard already yields. None of the 8 sampled witnesses uses either named form. 009 executed 2 of round-1's 4 recommendations (root+`main`); the census's fix line does not note the survivors. | P2 | Remove: `./compact-merger` and `./budget-allocator` (complete the 009 residual). |
| F1.4 | `system-skill-advisor/mcp-server/lib/embedders/registry.ts:4` + `adapter.ts:4-7` ("Canonical … lives in `@spec-kit/shared`. This file is a thin re-export shim so existing relative-path imports continue to resolve") | `registry.ts:14` and `adapter.ts:10` (`export * from '@spec-kit/shared/…'`) vs the shared surfaces they forward (shared `embeddings/registry.ts:34,46,53,62,71,94,109,145` = 9 exports; shared `embeddings/adapter.ts:17,20,39` = 3) | The shims preserve the advisor's relative-import era. | They forward EVERYTHING: `export *` re-publishes all 9 + 3 shared exports (and silently every future one) into the advisor's internal surface; nothing here greps or tests that parity — the 009-added tests (census R2-round-1: R8-01) cover `jsonc-strip`/`context-types`, not these shims. Noted as mechanics of the census-recorded isolation decision (§1 L7, round-2 R5-01), not re-reported. | P2 | Document: either pin the forwarded surface (named re-exports) or add a drift test of the star. |

## What this angle verified as correct (sampled 8)

1. **Specifier integrity**: all 8 witnesses import via export-map-valid subpaths; zero bare-`@spec-kit/shared` (consistent with the removed root: nothing depended on it) and zero relative/`dist/` bypasses inside the sample. The `./*`→`dist/*` wildcard serves every witnessed import.
2. **Symbol parity**: every named import resolves — `parseFrontmatter` (shared/frontmatter/parse-frontmatter.ts:58) ×3 witnesses; `fuseResultsMulti` + `RankedList`/`RrfItem` (present in `shared/algorithms/rrf-fusion.ts:805-840` export blocks); the advisor's 5+3 socket names (advisor shim `:11-22`) exactly equal the shared module's own exports (`shared/ipc/socket-server.ts:520-528`) — 8/8, no extra, no drift.
3. **The 5 referenced `dist/` targets all exist in this worktree** (10:54:47Z): the production specifier chain resolves HERE; the round-1 worktree Environment rows (census L4/L6) are indeed gone as the census ruled.
4. **The launcher comment teaches true code**: `.opencode/bin/system-skill-advisor-launcher.cjs:286-288` names `MEMORY_DB_PATH` and `resolveConfiguredDatabaseCandidates()` — both live (`shared/embeddings/factory.ts:238,391,394-395`), and the polarity matches (early return when the env var is set; else-branch = the documented realpath fallback; the walk body itself unread — INFERRED consistency).
5. **`fusion.ts`'s shared usage is unchanged** since round-1 F3.2 (`fuseResultsMulti` + 2 types — one value, two types, `fusion.ts:5,46`): the recorded keep holds.
6. `.opencode/bin` remains import-free (the only hit in the tree is the :286-288 comment) — round-1's verdict unchanged.

## Ruled out this iteration

- *Bare-root import breakage after 009's root-export removal*: within the sampled 8, nobody imports the removed surface (all 8 import lines + the tree hit-list; see Sources). Outside the sample: open question 1.
- *Relative/dist-bypass imports persisting in the sampled trees*: none of the 8 witnesses matched the `-e "system-spec-kit/shared"` / `-e "shared/(review-research-paths|gate-3-classifier|dist/)"` patterns — the bypass mechanism survives only outside the sample, if at all (open question 2).

## Open questions

1. 15+ code files hit the search but were sampled out (hard cap): sk-doc's `sk-create-skill/scripts/validate-compiled-routing-scenarios.cjs`, `validate-playbook-package.cjs`, `validate-playbook-topology.cjs`, 2 test files; advisor's `embedders/{index,schema,types}.ts`, `skill-graph/doc-frontmatter.ts`, `skill-graph/skill-graph-db.ts`, `utils/skill-markdown.ts`, 6+ test/fixture files. Whether any of them imports a removed surface or a relative bypass: UNSAMPLED.
2. Round-1's relative-bypass witnesses were not re-read: `runtime/hooks/.../spec-gate-core.mjs:54`, `spec-gate-prebind.mjs:25`, `skill-advisor/.../gate3-corpus-runner.mjs:7` (the cross-skill one), deep-loop `artifact-root.cjs:17-19`. The census says the hooks' relative imports STAY (same package) and 009 added the `./review-research-paths.cjs` export — but whether the deep-loop require was repointed to the specifier or still reaches the source `.cjs` relatively is unresolved here.
3. Are the 5 referenced `dist/` targets content-fresh vs their sources? (Operator asserts stale; unverified in this lane — angle 4 owns it.)
4. Does any advisor code import `SOCKET_FILE_NAME` (exported, `shared/ipc/socket-server.ts:16`), or does only the shared test hold the bin scripts to it (census R4-01)? The advisor shim's forwarded list omits it; the direct-importers were not sampled.
5. The runner-seeded `.executor-state/` directory in this lineage is empty; the runner presumably populates it (runner-owned, not written by this lane).

## Sources consulted

- Import lines, 8 witnesses (rg -n -B3, 10:45:18Z): `bin/system-skill-advisor-launcher.cjs:286-288`, `sk-doc/shared/scripts/frontmatter-version.mjs:29`, `sk-doc/.../root-router-contract.cjs:62`, `deep-loop/runtime/scripts/check-contract-drift.cjs:12`, advisor `embedders/registry.ts:14`, `embedders/adapter.ts:10`, `ipc/socket-server.ts:16,22`, `scorer/fusion.ts:5,46`
- `.opencode/skills/system-spec-kit/shared/package.json` (read: exports/build/test/engines/dependencies, 26 lines)
- Existence + parity: `ls` of 5 dist targets; `rg -n "^export"` over 5 shared targets; `rg` of `factory.ts` symbols; reads: advisor `ipc/socket-server.ts:1-30`, shared `ipc/socket-server.ts:512-547`, shared `algorithms/rrf-fusion.ts:798-842` (all 10:54:47Z)
- Census: `research/confirmed-findings.md` (89 lines, read in full this iteration — the charter's single census call)
- Shared dir listing (10:31:52Z) + the ENOENT read of the gone `shared/index.ts`

## Assessment

- newInfoRatio: 0.9 — the four rows (deep-loop's production importer; the require(ESM)/engines coupling; the surviving redundant entries; the star-forward mechanics) are recorded nowhere in the census or either prior synthesis; the remaining third of the iteration re-confirmed recorded decisions, hence not 1.0.
- Confidence: high for all four rows (each cites both sides at file:line, all read this iteration); the one inferred link is F1.2's Node version floors (marked inline).
- Tool-call accounting: 11 of 12 under the strictest attribution (census read + 2 greps + 5 reads + 3 writes; one discovery grep shared with init). No scripts, no node, no validate.sh, no git; writes: this file, the delta, the state record — all inside the lineage dir.

## Reflection

- Worked: two-sided verification (witness import vs target export) before writing; the -B3 window gaps were closed by reading rather than hedged, which converted the socket/rrf parity questions from UNKNOWN to OBSERVED.
- Failed: the witness-import rg window clipped the advisor socket shim's head; resolved by reading the whole 30-line shim (it turned out to be a third shim, which the -B3 glimpse had disguised as a direct import). The `export *` lines' brevity hid the forwarding mechanic until the shared-side exports were compared.

## Next

Iteration 2 — type duplication: read `shared/context-types.ts` + `shared/types.ts`, then the type declarations at the top of ≤6 consumer files defining same-named/same-field interfaces (places to look: `runtime/cli/core/*.ts`, `runtime/lib/validation/*.ts`); a consumer re-declaring a shape shared already exports is a finding.
