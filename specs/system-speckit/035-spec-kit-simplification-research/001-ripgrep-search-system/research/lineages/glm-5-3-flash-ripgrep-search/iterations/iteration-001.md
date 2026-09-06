# Iteration 1: Generator correctness — roots, exclusions, normalization, malformed input, idempotence

## Focus

`generate-trigger-index.mjs` and its `lib/` dependencies (`corpus.mjs`, `frontmatter.mjs`, `normalize.mjs`, `artifact.mjs`): corpus roots, exclusion policy, normalization contract, malformed-input handling, determinism/idempotence, and freshness of the committed artifact.

## Findings

| # | path:line | Claimed vs actual | Severity | Recommendation |
|---|-----------|-------------------|----------|----------------|
| F1.1 | `.opencode/skills/system-spec-kit/runtime/data/trigger-index.json` (whole artifact) vs fresh build | Claimed: committed index answers Gate 1 over the current corpus. Actual: committed index carries `manifestHash f157b3a2…`; a fresh build today over the same tree produces `9c258934…`; even the committed fixture manifest `fixtures/corpus-manifest.json` carries a third value `49566f34…`. The fixture trio (`corpus-manifest.json`, `generation-diagnostics.json`, `phrase-variants.json`) and `retrofit-convention.mjs`/`lib/corpus.mjs` were regenerated 2026-09-06 16:29 but `runtime/data/trigger-index.json` was not (mtime 11:28-era content). Three mutually inconsistent snapshots exist. | **P1** (stale artifact actively served to every Gate 1 lookup; not P0 because lookups still succeed and shape-assertions pass) | Fix: regenerate the committed index; add a freshness check that fails when any of the four artifacts' manifestHash disagree (the generator already threads one manifestHash through all four — the check is one comparison). |
| F1.2 | `generate-trigger-index.mjs:22-31` (header), empirical | Claimed: "Two runs over one tree must produce byte-identical output". Actual: confirmed — two fresh builds produced byte-identical index files, sha256 `e206012e…` both. Determinism/idempotence holds. | P2 (verified-positive) | Document (no change needed). |
| F1.3 | `lib/artifact.mjs:85-127` | Claimed: fail-closed, atomic publication with read-back validation. Actual: `publishJson` writes a same-directory temp file, re-reads, re-canonicalizes, validates (`validateIndex` re-checks manifestHash/path/phrase counts), then renames; failure removes temp and leaves prior artifact. Confirmed by code read; consistent with the stale-index finding (a failed publish would have left the old index, but mtimes show fixtures were regenerated without the index — a process gap, not a code defect). | P2 (positive) | Document. |
| F1.4 | `lib/corpus.mjs:29-44` vs `lib/corpus.mjs:56-78` | Claimed: `EXCLUSIONS` is the "Human-readable exclusion list recorded in the manifest". Actual: the operational pruning policy is `EXCLUDED_DIR_NAMES` (adds `dist`, not in EXCLUSIONS) and `FIXTURE_DIR_PATTERN` scoped outside `specs/`; `EXCLUSIONS` entries like `**/{fixtures,__fixtures__,test-fixtures,*-fixtures}/** outside specs/` are prose-globs that no code consumes for pruning, and `dist` pruning is invisible in the manifest identity. The manifest therefore attests an exclusion list that is not the policy that ran. | P2 | Fix or simplify: derive `EXCLUSIONS` from `EXCLUDED_DIR_NAMES`/`FIXTURE_DIR_PATTERN` at build time, or drop the glob list from the manifest and name the sets. |
| F1.5 | `lib/normalize.mjs:28-33, 60-76`; lookup observed output | Claimed: candidate gate drops tokens <3 chars, caps 8 tokens. Actual: confirmed via `lookup "ab"` → 0 tokens, exit 1, clean no-hit; empty prompt → exit 1; `--limit` without value → exit 2. Edge inputs behave per contract. | P2 (positive) | Document. |
| F1.6 | `lookup-trigger-index.mjs:131-141`; observed output for "save context memory" | Claimed: `partial` is "a candidate the SQL substring gate admits but the score function rejects". Actual: 1091 candidate phrases admitted, all scored `partial/0.000`; the top-5 results shown are all 0.000 partials ordered by path. With `DEFAULT_LIMIT = 20`, tail slots of every broad query fill with path-ordered zero-score noise, and the result cap pushes real (scored) matches out only when genuine candidates exceed 20 — but a user reading the first lines sees meaningless hits. | P2 | Fix: rank `partial` after scored classes is already true (score sort), but consider excluding score-0 partials from the default listing or capping them; at minimum document that leading 0.000 rows are gate-admitted noise. |
| F1.7 | `lib/corpus.mjs:60-65`, `lib/frontmatter.mjs:42-49`, fresh-build counts | Claimed: one ignored malformed document (captured transcript). Actual: fresh build reports `non-yaml-frontmatter: 1`, `ignoredMalformedDocuments: 1`, `malformedDocuments: 0`, published=true — the single `IGNORED_PATHS` exemption matches exactly one live defect and the diagnostics carry an unmatched-exemption report (`ignoredPathsUnmatched`, `generate-trigger-index.mjs:262-266`) so dead exemptions surface. Well-designed. | P2 (positive) | Document. |
| F1.8 | `generate-trigger-index.mjs:181-215`, `lib/corpus.mjs:14` | Claimed: roots `specs`, `.opencode/skills`, `.opencode/install-guides`; root README and five runtime mirrors deliberately excluded. Actual: `CORPUS_ROOTS` frozen triple matches; `.claude/.codex/.cursor/.devin/.pi` mirrors absent from roots; `.opencode/specs` alias folded to `specs/` (`corpus.mjs:96-110`) and symlinked directories never walked (cycle-safe, `corpus.mjs:186-196`). Consistent. | P2 (positive) | Document. |
| F1.9 | empirical (fresh build stats) | Fresh build: 28,434 docs scanned, 236 MB corpus, 35,281 unique phrases, 21.7 s wall. The generator is a CI-grade build step, not a lookup-time cost; the 4.4 MB diagnostics + 3.9 MB manifest + 3.8 MB index + 2.9 MB variants ≈ 15 MB of committed fixtures for a lexical index over docs. | P2 (observation for utilization scoring) | Note for the simplicity ledger: variants fixture is operator-trace-only (`generate-trigger-index.mjs:296-301` says lookup never reads it); candidate for `--no-variants` default-off or on-demand generation. |

Ruled out this iteration: generator corruption as the cause of F1.1 (two deterministic builds agree; the committed artifact simply predates the fixture refresh — a process/ freshness defect, not nondeterminism). Also ruled out: exclusion-driven corpus narrowing (fresh build scanned 28,434 docs; no silent root drift — `findRepoRoot` delegates to the shared hooks resolver `repo-root.mjs`).

## Sources Consulted

- `.opencode/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs` (full read)
- `.opencode/skills/system-spec-kit/runtime/cli/retrieval/lib/corpus.mjs` (full read)
- `.opencode/skills/system-spec-kit/runtime/cli/retrieval/lib/normalize.mjs` (full read)
- `.opencode/skills/system-spec-kit/runtime/cli/retrieval/lib/artifact.mjs` (full read)
- `.opencode/skills/system-spec-kit/runtime/cli/retrieval/lib/frontmatter.mjs` (partial: constants, categories)
- `.opencode/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs` (full read)
- Empirical: two fresh builds redirected into the lineage dir; sha256 comparisons; committed-index manifestHash reads; lookup edge-input runs (read-only)

## Assessment

- newInfoRatio: 1.0 — first pass over this angle; every finding new to the packet.
- Novelty justification: all nine rows are first-recorded; F1.1 (three-way staleness) was not documented anywhere in the packet.
- Confidence: high for F1.1/F1.2 (hash-level evidence); medium for F1.6 severity (usage-frequency dependent).

## Reflection

- Worked: redirecting all four generator outputs into the lineage dir made freshness/falsifiable comparison possible without touching repo files.
- Failed: nothing; the generator's own CLI made this easy.
- Ruled out: see above.

## Recommended Next Focus

Iteration 2: lookup correctness in depth — tokenization edge cases, candidate gate (`includes` semantics), scoring classes (`scorePhrase` thresholds), spec-folder scope filter, exit codes, `--limit 0` behavior, and the load-time shape assertions on adversarial index input.
