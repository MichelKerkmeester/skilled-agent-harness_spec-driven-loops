# Iteration 004 — OKF specification, deep read and upstream verification

- **Focus (charter 4):** OKF v0.2 deep read: reserved filenames, concept types, `sources`, `generated`, `verified`, `status`, `stale_after`, index and log files, conformance, attested computations; upstream repository check.
- **Status:** complete
- **NewInfoRatio:** 0.85
- **Novelty:** The seed copy is now verified byte-identical to the canonical upstream and to the frozen Knowledge Catalog copy; the reference implementation confirms the spec's trust/staleness semantics in code; the upstream `acme_retail` bundle shows the families exercised in practice (including a deprecated concept and a log with frontmatter).

## Findings

### F1 — VERIFIED: the comparison object is current and singular

- sha256 of `scratch/seed/okf-SPEC.md` = `26aa5da029278939f914e578107242d9607d4f2dc5fe153272b82f9ed1030101`.
- sha256 of `https://raw.githubusercontent.com/GoogleCloudPlatform/open-knowledge-format/main/SPEC.md` = same value (fetch + hash, 2026-10-04).
- sha256 of the frozen `https://raw.githubusercontent.com/GoogleCloudPlatform/knowledge-catalog/main/okf/SPEC.md` = same value.
- The upstream README carries the same redirect notice the seed README opens with; OKF v0.2 (SPEC.md:3) is the version under review. No newer version was observed.

### F2 — Upstream layout: spec + reference agent + bundles + tests

- Top level: `SPEC.md`, `README.md`, `bundles/`, `samples/`, `src/reference_agent/`, `tests/`, `connectors/`, `pyproject.toml` (GitHub tree API, 173 entries).
- `src/reference_agent/` holds `bundle/` (document.py, index.py, paths.py, synthesizer.py), `sources/bigquery.py`, `tools/` (bundle, context, source, web), `viewer/` (HTML/JS visualizer), `web/fetcher.py`, plus two prompt files (`reference_instruction.md`, `web_ingestion_instruction.md`).
- `tests/` covers document, index, bundle tools, BigQuery source, web fetcher/tools, viewer.
- Bundles checked in: `acme_retail`, `ga4`, `crypto_bitcoin`, `stackoverflow` (bundle README lists all four).

### F3 — The reference implementation formalizes summaries of the spec

- `REQUIRED_FRONTMATTER_KEYS = ("type",)` with comment "OKF v0.2 §11: `type` is the only always-required frontmatter key" (`document.py:19`).
- Unterminated frontmatter raises `OKFDocumentError`; no frontmatter at all yields `{frontmatter:{}, body:text}` (document.py parse).
- A timestamp-preserving YAML loader keeps every scalar a string, deliberately avoiding PyYAML's implicit datetime resolution so round-trips do not rewrite author frontmatter (`document.py` `_Loader`).
- `normalize_verified` treats a bare `{by, at}` mapping as a one-element list; `trust_tier` returns `unverified` / `machine-confirmed` / `human-reviewed` from the `human:` actor prefix; `is_stale` returns True iff `now >= stale_after` and ignores date-only values without an explicit UTC offset (`document.py` tail; tests in `tests/test_document.py`).
- Consequence: OKF's trust/lifecycle semantics are executable in ~60 lines — a strong simplicity datapoint for the feasibility analysis (iteration 7).

### F4 — Reserved filenames, structure and v0.2 families (spec text)

- Reserved: `index.md` (directory listing, no frontmatter except a bundle-root `okf_version`) and `log.md` (date-grouped, newest first, ISO `YYYY-MM-DD` headings) at any level; all other `.md` files are concepts (`okf-SPEC.md:134-149`, `okf-SPEC.md:505-553`).
- Concept document: YAML frontmatter + body; required `type`; recommended `title`, `description`, `resource`, `tags`; extensions allowed and must be preserved (`okf-SPEC.md:155-207`).
- Provenance: `sources[]` with `id`/`resource`/`title` + credibility signals `author`, `usage_count`, `last_modified`, sibling `usage_window`; per-claim attribution via footnotes keyed to `sources[].id`; no credibility score stored (`okf-SPEC.md:287-364`).
- Trust: `generated{by,at}` + `verified` (single or list) → trust tiers; independent of each other (`okf-SPEC.md:366-410`).
- Lifecycle: `status: draft|stable|deprecated` (absent ⇒ stable), `stale_after` absolute instant (`okf-SPEC.md:412-434`).
- Links: bundle-relative `/` form recommended; broken links tolerated; `references/` convention for mirrored material/executor/attester code (`okf-SPEC.md:437-486`).
- Actor convention: `producer/version`, `human:<id>`, `process:<id>` (`okf-SPEC.md:489-502`).
- Attested computation: standalone concept with `runtime`, `parameters[]`, optional `computation` path, `executor{resource, receipt[]}`, `attester{resource}`; agent may only fill parameter values, never author the computation; verification ≠ attestation (`okf-SPEC.md:556-734`).
- Conformance (three rules): every non-reserved `.md` has parseable frontmatter; every frontmatter has non-empty `type`; reserved files follow §8/§9. Consumers must not reject missing optional families, unknown types/keys, broken links, or missing index files (`okf-SPEC.md:736-762`).

### F5 — Practice notes from the checked-in bundle

- `bundles/acme_retail/index.md` is a plain sectioned link list with one-line descriptions (exactly §8); every subdirectory has its own `index.md`.
- `bundles/acme_retail/log.md` **carries frontmatter** (`type: Log`, `title:`) even though §9 describes log files as body-only date groups — the spec does not forbid frontmatter on `log.md`, but this is a producer convention beyond the letter of §9. Recorded as an observed divergence, not a conformance failure.
- `bundles/acme_retail/computations/revenue-ytd.md` exercises the full family set: `runtime: bigquery`, typed parameters, executor receipt `[job_id, executed_sql, result]`, attester `attesters/sql_equality.py`, `generated` + `verified` (human), `status: stable`, `stale_after`, two `sources` entries (one internal policy path, one table path), a `# Computation` SQL fence and keyed footnote `[^revenue-policy]`.
- The bundle also demonstrates deprecation-in-place: `metrics/gross-margin-legacy.md` with `status: deprecated` (log entry 2026-04-15).

## Sources

- `[SOURCE: https://github.com/GoogleCloudPlatform/open-knowledge-format]` — canonical home; tree API listed 173 entries.
- `[SOURCE: https://raw.githubusercontent.com/GoogleCloudPlatform/open-knowledge-format/main/SPEC.md]` — sha256 match with seed, verified 2026-10-04.
- `[SOURCE: https://raw.githubusercontent.com/GoogleCloudPlatform/knowledge-catalog/main/okf/SPEC.md]` — frozen snapshot; same sha256.
- `[SOURCE: https://raw.githubusercontent.com/GoogleCloudPlatform/open-knowledge-format/main/src/reference_agent/bundle/document.py]` — required key, verified normalization, trust tiers, staleness.
- `[SOURCE: https://raw.githubusercontent.com/GoogleCloudPlatform/open-knowledge-format/main/tests/test_document.py]` — round-trip, unterminated frontmatter, missing type tests.
- `[SOURCE: https://raw.githubusercontent.com/GoogleCloudPlatform/open-knowledge-format/main/bundles/acme_retail/index.md]`
- `[SOURCE: https://raw.githubusercontent.com/GoogleCloudPlatform/open-knowledge-format/main/bundles/acme_retail/log.md]`
- `[SOURCE: https://raw.githubusercontent.com/GoogleCloudPlatform/open-knowledge-format/main/bundles/acme_retail/computations/revenue-ytd.md]`
- `[SOURCE: scratch/seed/okf-SPEC.md:134-149, 155-207, 287-434, 437-502, 505-553, 556-762]`
- Seed README lines are identical in substance to upstream README (redirect notice present in both).

## Open questions carried forward

- Does the ecosystem beyond the repo (Google Cloud article, community posts, llms.txt, Agent Skills, AGENTS.md) reveal adoption patterns or contradictions? (iteration 5)
- `usage_count`/`usage_window` have no spec-kit counterpart at all — is that signal worth sourcing for spec docs? (iterations 6-7)

## Next focus

Iteration 5 — OKF ecosystem and online resources: the Google Cloud article, Knowledge Catalog, reference agent and visualizer, community write-ups, the LLM-wiki pattern, comparable standards (`llms.txt`, Agent Skills `SKILL.md` frontmatter, `AGENTS.md`). Find and record sources beyond the seed link.

## Negative knowledge (tried, failed / dead ends)

- No dead ends. The upstream `okf/` copy under `knowledge-catalog` is a frozen redirect, not a second spec — investigated and ruled out as a distinct source.
