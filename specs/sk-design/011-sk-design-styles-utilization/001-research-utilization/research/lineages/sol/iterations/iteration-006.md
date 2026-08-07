# Iteration 6: Minimal Repository-Native Retrieval Tooling Lifecycle

## Focus

This iteration specified the smallest repository-native build, query, refresh, validation, and corpus-change lifecycle that can make the style corpus usable without making a database canonical, hiding stale data, or moving taste policy into the hub/query engine. The focus follows strategy `NEXT FOCUS` exactly and avoids all blocked approaches.

## Findings

1. **Use one checked generated manifest over canonical captured artifacts, with every other index disposable.** Canonical inputs are `styles/_manifest.json` crawl state plus each captured bundle's `DESIGN.md`, `design-tokens.json`, `source.md`, and canonical provenance JSON; CSS/Tailwind remain hydratable artifacts but need only path/hash/byte metadata in the retrieval projection. The extractor already separates lastmod-keyed resumable crawl state from generated style folders, while the advisor establishes a byte-stable generated-manifest/derived-runtime split. The minimal lifecycle is therefore `capture -> build/check manifest -> query candidate cards -> hydrate selected fields`; an optional FTS projection is rebuilt from the manifest generation and is never source of truth. [SOURCE: .opencode/skills/sk-design/styles/_harness/README.md:17-28,37-49,64-76,91-96] [SOURCE: .opencode/skills/system-skill-advisor/SKILL.md:87-88,307-312]

   **Proposed single-tool surface:** `style-library.mjs build --write|--check`, `query`, and `hydrate`. `build --write` is maintainer-only; ordinary mode calls are read-only. This is one executable and one committed output (`styles/_retrieval-manifest.json`), not a service.

2. **The committed projection needs a small deterministic v1 schema with two hash levels.** A header should contain `schemaVersion`, `generationHash`, `crawlManifestHash`, `recordCount`, and sorted `styles[]`; volatile timestamps stay out of byte-stable content. Each style record should contain stable id/slug/status, title/thesis excerpt, token-axis names/counts, generic capability flags (`coherent-reference`, `tokens`, `motion-sections`, `constraints`, `calibration`), provenance/license-known state, section pointers, and sorted artifact records `{path, bytes, sha256}`. `contentHash` is SHA-256 over sorted relative-path/raw-byte pairs for the canonical inputs; `generationHash` is SHA-256 over the schema version, crawl-manifest hash, and sorted `(id, contentHash)` pairs. Repository status code already stores source path/content hash and recomputes SHA-256 to classify missing, changed, and fresh sources. [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/handlers/skill-graph/status.ts:114-151,164-204] [SOURCE: .opencode/skills/system-skill-advisor/SKILL.md:87-88] [INFERENCE: applying the repository's byte-stable projection and content-hash freshness contracts to the style bundle boundary]

3. **Hash all core source bytes, but incrementally reparse only changed records; publish only a quiescent generation.** The old manifest supplies per-artifact hashes. A build enumerates a sorted input set, hashes every canonical input, reparses only added/changed styles, drops removed styles, and reuses unchanged derived fields. It then repeats the input-set fingerprint; any pre/post mismatch aborts with `corpus-changing` and leaves the prior manifest intact. A successful write uses an adjacent temporary file plus atomic rename. `--check` generates in memory, byte-compares with the committed manifest, reports added/changed/removed ids, and never writes. This is simpler than a watcher: the current bounded inventory found 1,235 complete core bundles and 39,434,637 core bytes in 51.09 ms; the prior compact-manifest prototype derived 1,034 rows in 171.1 ms. [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/findings-registry.json:383-399,455-488] [SOURCE: .opencode/skills/.completion-sentinel-state/README.md:115-119] [INFERENCE: bounded read-only Python inventory at 2026-07-18T10:11:54.313Z plus the active-crawl evidence requires pre/post quiescence rather than a long-lived watcher]

4. **Modes should submit generic candidate and hydration requirements; neither the hub nor engine should encode taste.** The hub routes to a mode only. The mode calls `query` with `{mode, text, needs, axes, exclusions, limit, maxCardBytes}`; `mode` is observability, while filtering is driven by generic capabilities. Candidate cards return `{styleId, generationHash, contentHash, title, thesis, tokenAxes, capabilities, provenance, licenseStatus, scoreBreakdown, estimatedHydrationBytes, warnings}`. After the mode chooses one candidate, `hydrate` requires the same `generationHash` and accepts generic includes/axes/max-bytes. Suggested mode requests are: interface=`coherent-reference+provenance`; foundations=`tokens` plus requested axes; motion=`motion-sections`; audit=`constraints+provenance`; md-generator=`calibration` with `maxReferences:1`. This preserves prior measured candidate-card efficiency (five cards: 1,357-1,582 bytes/mode; selected hydration median: 4,803 bytes) and keeps selection judgment in each mode. [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/findings-registry.json:194-297,437-452,511-528] [SOURCE: .opencode/skills/system-skill-advisor/SKILL.md:99-115,164-190,232-290] [INFERENCE: capability fields are a generic transport projection of the already-established per-mode consumption contract]

5. **Staleness must be explicit and recover through live source truth, never silent stale use.** Query startup verifies the committed manifest generation; hydrate re-hashes the selected artifacts. A fresh, matching FTS cache may rank eligible rows. A missing/stale FTS cache falls back to manifest filters plus a bounded live `DESIGN.md` scan and returns `degraded:true`, `fallback:"source-scan"`, and the live generation hash. A stale manifest triggers the same live scan and disables cache use; if source scanning or selected-artifact verification fails, the command returns `unavailable`/`generation-mismatch` and no hydrated reference. This fallback is proportionate: the prior full scan read 20,378,783 bytes in 32.71-33.35 ms, while FTS5 used about 29.1 MB and answered in 0.054-0.203 ms. [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/findings-registry.json:401-452] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/handlers/skill-graph/status.ts:164-204] [INFERENCE: source scan is a safe degraded path only when its status and generation are surfaced]

6. **Validation should be cheap and local; network capture and semantic infrastructure are deferred.** Required fixtures are: byte-stable `build --check`; add/change/delete invalidation; pre/post mutation abort; missing/stale FTS fallback; generation-mismatch hydration refusal; deterministic card ordering/tie-breaks; per-mode generic request snapshots; and prior anti-slop evidence rows attached to hydrated references. Run them plus manifest `--check` on PRs touching `styles/**`, the tool, or mode contracts. Run the extractor's browser-backed `--self-test` only for capture/harness changes because it recaptures a live page and can hit 429s. [SOURCE: .opencode/skills/sk-design/styles/_harness/README.md:78-89,98-106] [SOURCE: .opencode/skills/system-skill-advisor/SKILL.md:87-88] [INFERENCE: local deterministic checks cover retrieval integrity; network capture validates a different boundary]

   | Component | Rough implementation effort | Runtime/storage evidence | Decision |
   |---|---:|---|---|
   | Deterministic schema, generator, hashes, incremental reuse, atomic `--write/--check` | 2-3 engineer-days | Prior 1,034-row prototype: 171.1 ms and 502,895 bytes; current input inventory: 51.09 ms over 39.4 MB | Build first |
   | Generic query cards, mode-supplied capabilities, hydrate with generation/byte guards | 2-3 engineer-days | Five cards: 1.36-1.58 KB/mode; median hydration: 4.8 KB | Build first |
   | Fixtures, CI selector, source-scan degradation/refusal paths | 1-2 engineer-days | Prior source scan: about 33 ms over 20.4 MB | Build first |
   | Disposable SQLite FTS5 projection | +1-2 engineer-days | Build: 179.7 ms; storage: about 29.1 MB; query: 0.054-0.203 ms | Optional add-on after baseline |
   | Embeddings, watcher/daemon, network service | Not estimated for this build | No generation-bound semantic lift evidence; sub-second local rebuilds remove watcher justification | Defer |

   The baseline is therefore roughly **5-8 engineer-days**, or **6-10 with optional FTS**, as a planning estimate rather than observed labor. The measured corpus costs come from prior pinned benchmarks and this iteration's bounded inventory. [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/findings-registry.json:383-452,511-528] [INFERENCE: component effort ranges reflect one Node CLI, one generated schema, and local fixture coverage; they require implementation planning to confirm]

## Ruled Out

- A filesystem watcher or daemon: full bounded inventory is 51.09 ms and prior generation was 171.1 ms, so lifecycle complexity has no measured justification. [INFERENCE: current bounded inventory and prior benchmark in findings-registry.json:383-399]
- A committed SQLite/FTS database: it is larger than the compact manifest, environment-dependent, and fully derivable. [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/findings-registry.json:401-417]
- Semantic embeddings in the first build: semantic lift is still unmeasured on a generation-bound labeled holdout. [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/findings-registry.json:531-548]
- Per-mode taste rules in the hub or engine: mode-supplied generic requirements preserve the hub's routing boundary. [SOURCE: .opencode/skills/system-skill-advisor/SKILL.md:164-190,232-290] [INFERENCE: generic capabilities avoid central taste policy]
- Mandatory live Refero/browser tests in ordinary PR CI: the extractor already isolates that network-sensitive check behind `--self-test`. [SOURCE: .opencode/skills/sk-design/styles/_harness/README.md:98-106]

## Dead Ends

- Promote “watcher/daemon-based refresh for this corpus” to exhausted unless future profiling shows build/check latency above the interactive budget.
- Keep “semantic ranking before a labeled, generation-bound evaluation” blocked; changing the storage wrapper does not resolve the missing evidence.
- Do not retry “database as canonical state”; only a disposable generation-bound projection is justified.

## Edge Cases

- Ambiguous input: none; the strategy and dispatch named the same tooling-lifecycle focus.
- Contradictory evidence: none; active-crawl evidence and current completed-bundle inventory are reconciled by generation hashes and quiescent publish rather than by treating a count as permanent.
- Missing dependencies: none; FTS5 is optional and the specified source-scan path remains available.
- Partial success: none; the tooling question is fully answered, while substrate relevance and strategy ranking remain separate open questions.

## Sources Consulted

- `.opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/deep-research-config.json:1-75`
- `.opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/deep-research-state.jsonl:1-7`
- `.opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/deep-research-strategy.md:11-192`
- `.opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/findings-registry.json:8-548`
- `.opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/prompts/iteration-6.md:6-48`
- `.opencode/skills/sk-design/styles/_harness/README.md:13-112`
- `.opencode/skills/system-skill-advisor/SKILL.md:80-319`
- `.opencode/skills/system-skill-advisor/mcp_server/handlers/skill-graph/status.ts:114-213`
- Repository grep results for manifest/check/hash/atomic/freshness patterns, including `.opencode/skills/.completion-sentinel-state/README.md:115-119`.
- Bounded read-only Python corpus inventory output at `2026-07-18T10:11:54.313Z`.

## Assessment

- New information ratio: 0.93
- Questions addressed: ["What index build, query, refresh, validation, and corpus-change tooling is justified by the repository's existing patterns?"]
- Questions answered: ["What index build, query, refresh, validation, and corpus-change tooling is justified by the repository's existing patterns?"]
- Novelty accounting: 4 of 6 findings were fully new and 2 partially operationalized prior architecture; `(4 + 0.5*2) / 6 = 0.83`, plus the 0.10 simplicity bonus for closing the tooling question, rounded to 0.93.

## Reflection

- What worked and why: Reusing pinned corpus benchmarks and reading only the exact repository generator, crawl, and freshness anchors made the lifecycle concrete without repeating broad corpus scans.
- What did not work and why: The initial broad grep returned substantial unrelated stale/atomic matches; it was useful only for locating one atomic-write precedent and was not used as a ranking survey.
- What I would do differently: Start directly from the prior registry's known native precedents and read only the generator implementation plus one atomic-publish helper if a future iteration needs implementation-level pseudocode.

## Recommended Next Focus

Rank the remaining utilization strategies by leverage, build cost, and risk: (1) manifest/cards/hydration baseline, (2) optional FTS, (3) human-labeled relevance evaluation, and (4) semantic reranking only if the labeled ablation proves lift. Include licensing/provenance and extraction-fidelity gates, and state which strategy can ship first without waiting for the still-open relevance experiment.
