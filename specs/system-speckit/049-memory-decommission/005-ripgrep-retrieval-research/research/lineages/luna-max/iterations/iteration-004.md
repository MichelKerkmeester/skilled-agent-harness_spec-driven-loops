# Iteration 4: parity harness, frozen prompts, and measurable gates

## Focus

This iteration closes the parity and acceptance-design question. It reads the existing trigger/search fixtures and phase-001 task/acceptance contracts, then turns their gaps into a hermetic three-arm harness and explicit performance/failure gates. The max-iterations policy remains authoritative even if a convergence signal reaches the configured threshold.

## Findings

### 1. The current test proves only one happy-path ordering, not parity

The existing hybrid-search test creates a trigger-only mock database, queries one exact phrase, and asserts IDs `[202, 101]` plus the `trigger` source. It does not assert the SQL candidate set, case folding, punctuation normalization, partial-token behavior, scope, archive/expiry filters, malformed input, no-hit semantics, or deterministic ties. `[SOURCE: .opencode/skills/system-spec-kit/mcp-server/tests/hybrid-search.vitest.ts:952-980]` The production lane first normalizes/deduplicates query tokens, limits them to eight, admits substring candidates through `LOWER(trigger_phrases) LIKE '%token%'`, applies active/archive/expiry filters, and then scores/order results. `[SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/search/hybrid-search.ts:734-765,795-837]` The test and source should be compared by behavior, not by fixture count.

**Recommendation:** phase 001's parity harness must compare a full result record, not merely the first result. For every frozen query, capture: normalized query/tokens, candidate path set, returned path set, score class, source label, scope, archive/expiry eligibility, and stable order. Report two-way set differences (`legacyOnly`, `indexOnly`) and first differing rank. A pass requires zero unexplained differences for the exact trigger contract; any deliberate divergence must be a named fixture with an explicit reason.

### 2. The repository already contains useful fixture patterns, but some are semantic tests and must not be mislabeled

`trigger-goldens.json` deliberately includes exact, paraphrase, and distractor variants, including CJK, and labels paraphrases as semantic-trigger-shadow rather than lexical trigger matches. `[SOURCE: .opencode/skills/system-spec-kit/mcp-server/tests/fixtures/trigger-goldens.json:1-58]` `golden-queries.json` includes tokenization and stemming classes whose expected results are empty placeholders, including `running`, `runs`, `tested`, `hybrid-search`, and `memory_index`. `[SOURCE: .opencode/skills/system-spec-kit/mcp-server/tests/fixtures/golden-queries.json:1-32]` These fixtures are valuable negative/edge inputs, but they do not establish a lexical replacement's right to recover paraphrases or stems.

**Recommendation:** split the frozen set into `lexical-parity` and `semantic-boundary` classes. Exact/case/punctuation/substring/scope/archive/expiry cases are parity gates. Paraphrases, stemming, and synonym cases are boundary probes that must remain unsupported or explicitly marked `lexical-only`; they must not lower the exact-lane parity score. CJK and accented text should be retained as Unicode robustness probes, with the harness recording whether matching is expected under the selected tokenizer rather than silently treating a miss as a regression.

### 3. The harness needs three arms and one immutable corpus snapshot

Phase 001 already separates prompt freezing, a live `exactTriggerSearch` baseline, generator work, a parity check, determinism, and a cold lookup check, but the tasks leave their schemas and comparison rules unspecified. `[SOURCE: specs/system-speckit/049-memory-decommission/001-trigger-index-replacement/tasks.md:34-63]` Its acceptance criteria likewise name live parity, fresh-clone determinism, no daemon/database/network, malformed reporting, and sub-200ms lookup without defining the comparison tuple or timing statistic. `[SOURCE: specs/system-speckit/049-memory-decommission/001-trigger-index-replacement/acceptance-criteria.md:55-80]`

**Recommendation:** freeze a corpus manifest before baseline capture. The manifest should contain repository revision or content hash, included relative paths, excluded paths, frontmatter parser version, generated-index schema version, and prompt-set hash. Run these arms against the same manifest:

| Arm | Operation | Required comparison |
|---|---|---|
| Legacy | Call the old `exactTriggerSearch` lane against a snapshot/mock DB populated from the same frontmatter | Candidate set, eligibility filters, score class, and order |
| Index | Load the generated JSON once, apply the specified normalizer/postings/filters | Same tuple, plus diagnostics and index version |
| `rg` | Run the documented read-only command for the relevant retrieval shape, then parse JSONL or paths and apply the wrapper ranker | Expected field/path/line result and deterministic order; never claim `rg` itself ranks relevance |

When the daemon is unavailable, retain a captured baseline with its corpus hash and mark live availability as an environment fact; do not replace a missing baseline with an unverified green result. This follows the phase's explicit note that the daemon is flapping and the baseline is captured first. `[SOURCE: specs/system-speckit/049-memory-decommission/001-trigger-index-replacement/tasks.md:36-38]`

### 4. Freeze a compact but adversarial prompt matrix

The prompt set should be JSON with stable IDs, class, query, expected behavior, and allowed divergence. At minimum freeze these 18 cases:

| ID/class | Example | Expected gate |
|---|---|---|
| exact phrase | `exact recall phrase` | Same eligible paths and order |
| case fold | `EXACT RECALL PHRASE` | Same as exact under case folding |
| punctuation | `exact-recall/phrase` | Same normalized phrase if separators normalize to spaces |
| partial token | `recal` | Preserve SQL `%token%` candidate behavior or document the index superset explicitly |
| multi-word subset | `recall phrase` | Candidate/score class matches baseline |
| short token | `a` and `go` | Match the baseline's token-length rule; do not silently add a new rule |
| >8 tokens | nine distinctive tokens | Prove the first-eight truncation contract and report discarded tokens |
| no hit | `never-present-trigger-9f0` | Empty result, exit 1 only for `rg`, no error |
| scope | same phrase in two packet roots | Only requested scope |
| archived | phrase only under `z_archive` | No result under the active corpus policy |
| expired | expired row with matching phrase | No result |
| malformed | broken YAML delimiter/list | Diagnostic with path/line/reason; no partial publish |
| duplicate | same phrase in two paths | Stable path tie-break, no duplicate path entries |
| Unicode | accented Latin and CJK trigger | Explicit tokenizer expectation and stable result |
| anchor | `ANCHOR:DECISION-pipeline-003` query | Line-addressable result when marker is included |
| body-only | phrase absent from frontmatter but present in prose | Trigger lane no-hit; body `rg` arm may match and is labeled separately |
| generic negative | `session context memory` | No pollution-based promotion; diagnostic if authored as a trigger |
| path edge | nested `NNN-topic-name` and a filename with punctuation | Stable normalized path/line ordering |

The real repository's synthetic fixtures should seed, not replace, this matrix: the semantic paraphrases in `trigger-goldens.json` are boundary probes, not lexical pass criteria. `[INFERENCE: The exact number 18 is a proposed minimum; acceptance should pin the concrete JSON and its hash once phase 001 implements it.]`

### 5. `rg` has distinct output contracts; the wrapper must isolate incompatible flags

For structured line results, use a command shaped like:

```text
rg --no-config --json --fixed-strings --ignore-case \
  --glob '*.md' --glob '!**/z_archive/**' --glob '!**/node_modules/**' \
  -- 'phrase' specs .opencode
```

`--json` emits JSON Lines but is incompatible with `--files`, `-l`, `-c`, and `--count-matches`, so the wrapper must expose separate path/count fast paths rather than combining them. `[SOURCE: https://raw.githubusercontent.com/BurntSushi/ripgrep/master/crates/core/flags/defs.rs:3593-3655]` `-F` makes the query literal, `-i` uses Unicode simple case folding, and `-w` adds word boundaries; `-w` therefore cannot stand in for the SQL substring lane. `[SOURCE: https://raw.githubusercontent.com/BurntSushi/ripgrep/master/crates/core/flags/defs.rs:2224-2251,3037-3090,7436-7473; .opencode/skills/system-spec-kit/mcp-server/lib/search/hybrid-search.ts:804-819]` Ignore files and glob precedence are ambient inputs unless `--no-config` and explicit globs are used. `[SOURCE: https://raw.githubusercontent.com/BurntSushi/ripgrep/master/GUIDE.md:150-219,249-279,478-552]`

Use `--files-with-matches --max-count 1` for a quick path-only probe, `--count` for per-file match counts, and `--json` plus a caller-side line parser for ranking evidence. Do not use `--sort=path` as relevance: ripgrep documents it as path sorting and the implementation makes it single-threaded. `[SOURCE: https://raw.githubusercontent.com/BurntSushi/ripgrep/master/crates/core/flags/defs.rs:1252-1288,2080-2152,4002-4034,6207-6240,6289-6340]` Keep `--multiline` and `--pre` opt-in because multiline can increase memory/time and preprocessing runs a command per file. `[SOURCE: https://raw.githubusercontent.com/BurntSushi/ripgrep/master/crates/core/flags/defs.rs:4238-4294,5489-5527]`

**Recommendation:** define three wrapper recipes (`search`, `quick`, `context/anchor`) with the exact flags and a documented exit mapping: 0 = match, 1 = no match, 2+ = execution/error. Always use `--no-config`, explicit Markdown globs, and explicit archive/node_modules exclusions. For ranking, parse matches and assign deterministic fields in this order: trigger-frontmatter match, title/description match, anchor marker, body line; then exact normalized phrase, phrase containment, token coverage; then relative path and 1-based line. `[INFERENCE: Field priority is a proposed replacement ranking contract; ripgrep supplies evidence lines but not this relevance ordering.]`

### 6. Make timing and determinism measurable rather than asserting “under 200ms”

The phase requires a cold lookup under 200ms and determinism, but the task wording currently says only “cold lookup” and “byte-identical” without isolating process startup, index load, lookup, and filesystem cache effects. `[SOURCE: specs/system-speckit/049-memory-decommission/001-trigger-index-replacement/spec.md:130-151; specs/system-speckit/049-memory-decommission/001-trigger-index-replacement/tasks.md:52-63]` Existing repository benchmarks demonstrate the useful pattern of repeated runs and p50/p95/p99 reporting, while enabling the expensive benchmark only under an explicit environment flag. `[SOURCE: .opencode/skills/system-spec-kit/mcp-server/stress-test/session/gate-d-benchmark-session-resume.vitest.ts:96-107,145-183]`

**Recommendation:** define separate measurements:

1. Generate twice from one manifest; require identical bytes and SHA-256, with sorted paths/phrases and no timestamps. Write to a same-directory temporary file and atomically rename only after all diagnostics pass.
2. Start a fresh process for each of at least 30 cold lookups, measure from process start to result serialization, and report p50, p95, p99, max, machine/runtime, corpus/index bytes, and query ID. Require p95 < 200ms and max < 200ms for the exact single-prompt gate; report warm lookup separately rather than hiding startup in a warm-only loop.
3. Repeat the parity harness twice and compare canonical JSON output byte-for-byte after removing only an explicitly documented duration field.
4. Test with the daemon stopped and network disabled at the harness boundary; prove the commands do not open the database or use embeddings. The no-daemon requirement is already a phase acceptance criterion. `[SOURCE: specs/system-speckit/049-memory-decommission/001-trigger-index-replacement/acceptance-criteria.md:61-80; specs/system-speckit/049-memory-decommission/goal.md:43-55]`

The threshold is a release gate, not a claim that was measured in this research run. `[INFERENCE: The proposed p95-plus-max rule is stricter and more observable than a single minimum; phase 001 should freeze it only after measuring the actual target environment.]`

### 7. Failure modes need fail-closed publication and explicit diagnostics

The parser/editor already distinguishes missing, unclosed, non-YAML, invalid-list, and valid-empty cases, and refuses to rewrite malformed input rather than silently repairing it. `[SOURCE: .opencode/skills/system-spec-kit/scripts/lib/frontmatter-migration.ts:385-469,1378-1432; .opencode/skills/system-spec-kit/shared/parsing/memory-template-contract.ts:139-160,265-270]` Existing vector metadata parsing instead maps invalid JSON/wrong type to an empty list, which is unsafe as an index-build policy because it loses evidence. `[SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/search/vector-index-types.ts:212-226]`

**Recommendation:** require a report row for every skipped file (`path`, `line`, `category`, `reason`, `raw-key` when safe), distinguish valid empty from malformed, and fail before replacing the prior committed index on any non-ignored malformed file. Test stale index, missing index, invalid index JSON/schema, partial temp file, concurrent generation, duplicate path/phrase, path traversal/symlink, CRLF, huge frontmatter, invalid UTF-8, `rg` missing, `rg` exit 1, `rg` exit 2+, query beginning with `-`, ambient config, hidden files, archive/node_modules leakage, `--max-count` truncation, and `--json` non-match/error records. Preserve the last known-good committed index for rollback and print the manifest/index hash in every parity report.

### 8. Ranked specification amendments

**P0 — phase 001 spec:** expand REQ-001 and REQ-005 so “superset” means two-way candidate-set parity plus explicit score/order rules for the current SQL lane, including eight-token truncation, substring candidates, active/archive/expiry filters, and stable ties. Add the frozen manifest/prompt hash, semantic-boundary exclusions, diagnostic schema, atomic publication, and p95/max cold gate to REQ-002/006/007 and the success criteria. `[SOURCE: specs/system-speckit/049-memory-decommission/001-trigger-index-replacement/spec.md:130-162,181-203]`

**P0 — phase 001 plan/tasks/acceptance:** make `retrieval/parity-check.mjs` a three-arm harness with `legacy`, `index`, and `rg` adapters; make T001 define the 18-case JSON schema/hash; make T002 record corpus hash and daemon availability; make T008/T011 assert two-way sets and no leakage; make T010 assert bytes/hash and atomic replacement; make T012 report 30 cold-run percentiles and enforce p95/max; add diagnostics and exit-status cases to T004/T005/T009. `[SOURCE: specs/system-speckit/049-memory-decommission/001-trigger-index-replacement/plan.md:66-104,119-130; specs/system-speckit/049-memory-decommission/001-trigger-index-replacement/tasks.md:34-63; specs/system-speckit/049-memory-decommission/001-trigger-index-replacement/acceptance-criteria.md:55-80]`

**P1 — phase 004 spec/plan/tasks/acceptance:** define the `rg` wrapper's three recipes, `--no-config`/glob policy, exit mapping, field/phrase/path rank tuple, marker/body labels, and negative controls before retrofitting. Add a replayable prompt suite for frontmatter-only, anchor, body-only, malformed, generic, archive, and one-fact-per-line cases. Require zero active-corpus leakage, byte preservation outside intentional marker/frontmatter edits, and idempotent second-pass output. `[SOURCE: specs/system-speckit/049-memory-decommission/004-grep-convention-doc-retrofit/spec.md:99-149,154-160,193-201; specs/system-speckit/049-memory-decommission/004-grep-convention-doc-retrofit/plan.md:54-106; specs/system-speckit/049-memory-decommission/004-grep-convention-doc-retrofit/tasks.md:34-60; specs/system-speckit/049-memory-decommission/004-grep-convention-doc-retrofit/acceptance-criteria.md:55-86]`

## Ruled out this iteration

- Treating semantic paraphrase fixtures as lexical parity; the fixture labels show a separate semantic-trigger-shadow behavior. `[SOURCE: .opencode/skills/system-spec-kit/mcp-server/tests/fixtures/trigger-goldens.json:18-58]`
- Using `--json` with `-l` or `-c`; ripgrep declares these output modes incompatible. `[SOURCE: https://raw.githubusercontent.com/BurntSushi/ripgrep/master/crates/core/flags/defs.rs:3593-3655]`
- Treating `--sort=path` as relevance ranking; it is path order and disables parallelism. `[SOURCE: https://raw.githubusercontent.com/BurntSushi/ripgrep/master/crates/core/flags/defs.rs:6207-6240,6289-6340]`
- Declaring a single warm run to satisfy the cold-start budget; startup, index load, and lookup must be measured separately. `[SOURCE: specs/system-speckit/049-memory-decommission/001-trigger-index-replacement/tasks.md:52-63; .opencode/skills/system-spec-kit/mcp-server/stress-test/session/gate-d-benchmark-session-resume.vitest.ts:96-107,145-183]`

## Next focus

Iteration 5 must perform a final cross-check across all six research questions and produce the complete ranked amendment map, including the phase-002 handoff and any unresolved decisions. It must run despite the declining ratios because `stopPolicy` is `max-iterations`.
