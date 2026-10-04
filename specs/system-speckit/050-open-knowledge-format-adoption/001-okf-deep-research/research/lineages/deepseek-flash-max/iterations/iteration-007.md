# Iteration 007 — Candidate ideas and feasibility

- **Focus (charter 7):** For each idea worth taking: touched surfaces, callers, validators, effort and benefit. Candidates tested: typed concepts, per-folder index files, a change log file, provenance and freshness fields, bundle export/import.
- **Status:** complete
- **NewInfoRatio:** 0.75
- **Novelty:** First per-candidate feasibility pass with measured corpus sizes and named touched surfaces; earlier iterations established the surfaces, this one prices the changes.

## Corpus baseline (measured 2026-10-04)

| Measure | Count |
|---|---|
| `.md` files under `specs/` | 41,265 |
| `.md` under `specs/` excluding `z_archive/` | 23,413 |
| `spec.md` files | 4,548 |
| Existing `index.md` anywhere under `specs/` | 10 |
| Existing `log.md` under `specs/` | 0 |
| Packet-local `changelog/` dirs | 30 |
| Docs already carrying a `type:` frontmatter key | 9 |

The retrofit convention itself speaks of "a mechanical pass over 22,000 documents" (`grep-convention.md:88`), consistent with the measured 23,413.

## C1 — Typed concepts (`type` in frontmatter)

- **Shape:** every authored doc declares a semantic type, e.g. `type: Specification`, mirroring OKF's only required field (`okf-SPEC.md:177-188`).
- **Touched surfaces:** `templates/core/*.tmpl` frontmatter blocks (`spec.md.tmpl:2-18`); the five-key canon and its alias table (`grep-convention.md:56-74`); `FRONTMATTER_VALID`'s required-field list (`check-frontmatter.sh:105-109,145`); the retrofit/healer (`heal-spec-docs.cjs:8-19` — heals only derivable values, never authors); `generate-trigger-index.mjs` (corpus walk, `:84-85,133,140`); `graph-metadata.json` `entities[].kind`.
- **Callers:** validator orchestrator, index generator, healer, template renderer.
- **Effort:** S to add the key to templates (optional, no backfill); M/L if required and backfilled across 23,413 docs. `FRONTMATTER_VALID` touches only 5 core docs per packet (`check-frontmatter.sh:35`), so enforcing on spec.md alone is cheap; full-corpus enforcement is not.
- **Benefit:** enables type filtering in retrieval and type-driven validation. Counter-evidence: filename already encodes the document kind, `graph-metadata.entities[].kind` already records `"doc"`, and no consumer asks for a semantic type today.
- **Lean: adapt narrowly** — add `type` to the five core template blocks with a closed vocabulary, do not backfill; skip the 23k retrofit. (Alternative: reject as redundant; refinement in iteration 9.)

## C2 — Per-folder `index.md`

- **Shape:** a generated listing per packet/directory for progressive disclosure (`okf-SPEC.md:507-529`).
- **Touched surfaces:** a new generator script; folder conventions in `folder-structure.md`; the validator registry (40 rules today; likely a `FILE_EXISTS`-style or shape rule for the new file); `LINKS_VALID` (`validator-registry.json:411`) must accept generated links; `TOC_POLICY` unaffected; the trigger index would start indexing the new files unless excluded; `heal-spec-docs`/save writers unaffected.
- **Consumers:** agents browsing a packet; `/speckit:resume` could use a packet index; the Phase Documentation Map already serves parents (`phase-definitions.md:125-137`).
- **Effort:** M — generator plus rule plus docs; risk is per-packet generate/refresh lifecycle (who regenerates when a doc is added?).
- **Benefit:** one-level-at-a-time browsing without reading `description.json`. Counter-evidence: the trigger index plus `rg` answer global navigation; the parent map answers phase navigation; collision risk is small (10 existing `index.md`) but the maintenance lifecycle is new state to keep fresh — exactly the class of drift the validator already polices with fingerprint rules.
- **Lean: reject for now** — the navigation need is already answered by two mechanisms; a new generated file family adds drift surface without a demonstrated consumer. Would revisit only if agents show packet-browse failures.

## C3 — Change log file (`log.md`)

- **Shape:** continuous, date-grouped history at packet level (`okf-SPEC.md:533-553`).
- **Touched surfaces:** new/expanded generator (today's nested changelog is completion-time: `nested-changelog.md:16,37,44-45`); the L3+ `change-log` anchor already exists in spec.md (`spec.md.tmpl:380-385`); trigger index would index it.
- **Effort:** S/M.
- **Benefit:** a maintained "what happened when" record. Counter-evidence: git history is the authoritative change log and already reviewed in PRs; packet-local changelogs cover completion state (30 changelog dirs); implementation-summary covers outcome. A parallel manually-maintained history is a write-obligation the workflow does not currently discharge and would drift.
- **Lean: reject** — duplicate of git + nested changelog; adopt only if a consumer (e.g. resume) needs a machine-readable change feed, which today it does not.

## C4 — Provenance fields (`sources`)

- **Shape:** structured `sources[]` with `resource` and optional `id`/`title`/`author`/`last_modified`, per-claim footnotes (`okf-SPEC.md:287-364`).
- **Touched surfaces:** canonical frontmatter keys (`grep-convention.md:56-74`); five core templates; `FRONTMATTER_VALID` (extra keys already tolerate — the rule never rejects unknown keys; `check-frontmatter.sh` checks required values only); retrofit rules (may create a missing key only where the table permits, `grep-convention.md:82-90`); a possible new rule resolving `sources[].resource` paths (like `AC_COVERAGE` resolves citations, `validation-rules.md:93-104`); research/review loop artifact conventions (this lineage already writes `[SOURCE: …]` by charter).
- **Consumers:** today none — no traversal/validator reads provenance. A consumer must be named or the field is aspiration.
- **Effort:** S for the field definition + template block on research/review docs; M if a resolution rule ships (rule + tests + registry entry).
- **Benefit:** auditability of factual claims; directly supports the repo's own citation discipline (every spec-doc claim already needs evidence under `AC_COVERAGE`, and this session's lineage charter mandates `[SOURCE:]`). A path-resolving rule would catch fabricated citations mechanically.
- **Lean: adapt** — optional `sources` block on research/review artifacts only, plus one resolution check; do not retrofit authored spec docs wholesale.

## C5 — Freshness and verification (`stale_after`, `verified`)

- **Shape:** absolute staleness instant; verification events with actor identities, trust tiers (`okf-SPEC.md:401-434`).
- **Touched surfaces:** templates; `CONTINUITY_FRESHNESS` (existing opt-in strict-only check, `validation-rules.md:57`); save writer payloads (`save-workflow.md:237-258`); graph-metadata `derived` schema under `GENERATED_METADATA_INTEGRITY` (strict-only schema in `cli/validation`) — adding derived fields needs that schema updated; doctor/resume surfaces could consume staleness.
- **Effort:** M for `stale_after` (field + rule + one consumer); M/L for `verified` (identity model, actor convention, observed event storage, no current human-in-the-loop at doc scale).
- **Benefit:** `stale_after` addresses a real failure mode — long-lived research/review artifacts whose claims decay. `verified` addresses trust in machine-authored docs, but spec-kit's current trust signal is the review gate (`/deep:review`, closure gates), and its continuity writer is single-writer BY design; per-doc verification events duplicate that.
- **Lean: adapt `stale_after` narrowly** (research/review artifacts, surfaced by resume/doctor); **reject `verified` for now** — the workflow's verification evidence is task/ach closure (`SKILL.md:444-458`), and an OKF trust tier would be a second, weaker truth.

## C6 — Bundle export / import

- **Shape:** export a packet as an OKF bundle (type mapping, `index.md`/`log.md` emission, bundle-relative links); import an OKF bundle into a packet.
- **Touched surfaces:** a new CLI script only; no validator changes for export (output lands outside the packet); import would create authored docs and therefore touch every rule (placeholders, anchors, levels, links), and cannot represent `description.json`/`graph-metadata.json`/`_memory.continuity` (generated surfaces with no OKF home — iteration 6, section D3).
- **Effort:** M for export (mapping table + link rewrite + one fixture test); L for import (validation integration + provenance/identity questions).
- **Benefit:** export connects spec packets to the 370-repo OKF ecosystem ([iteration 5 F3]) and is additive and reversible; import's benefit is speculative and its conflicts are structural.
- **Lean: adopt export-only** as an opt-in command; **reject import**.

## C7 — Actor convention for `last_updated_by` (small candidate found)

- **Shape:** prefix `human:` / `process:` / `producer/version` (`okf-SPEC.md:489-502`).
- **Touched surfaces:** `save-workflow.md` documented example (`:309`), writer validation (optional), nothing else.
- **Effort:** S. **Benefit:** machine-classifiable author/verifier lineage for continuity. **Lean: adopt** (cheap, no conflict).

## Sources

- `[SOURCE: scratch/seed/okf-SPEC.md:177-188, 287-364, 401-434, 489-502, 507-553]`
- `[SOURCE: .skilled/skills/system-spec-kit/references/structure/grep-convention.md:56-74, 82-90, 88]`
- `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/rules/check-frontmatter.sh:35, 105-109, 145]`
- `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:8-19]`
- `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs:84-85, 133, 140]`
- `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json]` (40 rules; `LINKS_VALID` at :411)
- `[SOURCE: .skilled/skills/system-spec-kit/references/workflows/nested-changelog.md:16, 37, 44-45]`
- `[SOURCE: .skilled/skills/system-spec-kit/references/validation/validation-rules.md:57, 93-104]`
- `[SOURCE: .skilled/skills/system-spec-kit/references/memory/save-workflow.md:237-258, 309]`
- `[SOURCE: .skilled/skills/system-spec-kit/templates/core/spec.md.tmpl:2-18, 380-385]`
- Corpus counts measured with `find`/`rg` over `specs/` on 2026-10-04 (see baseline table).

## Open questions carried forward

- Do the lean verdicts survive the adversarial pass? (iteration 9)
- For the export idea, which type mapping is defensible (filename-derived vs role-derived)? (iteration 10 proposed shape)

## Next focus

Iteration 8 — Compatibility and blast radius: what each candidate does to the 4,548 existing `spec.md` files, validators, templates, hooks, the trigger index and the advisor; additive or migration.

## Negative knowledge (tried, failed / dead ends)

- Import direction investigated and abandoned in this iteration: generated sidecars (`description.json`, `graph-metadata.json`, `_memory.continuity`) have no OKF representation, so a round-trip would lose the metadata the save pipeline depends on. Recorded as structurally blocked, not merely expensive.
