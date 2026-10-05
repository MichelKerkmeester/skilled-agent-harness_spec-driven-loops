# OKF v0.2 Adoption Verdict — system-spec-kit vs Google's Open Knowledge Format

- **Lineage:** `research/lineages/deepseek-flash-max` (detached fan-out executor: cli-pi / opencode-go/deepseek-v4.1-flash, reasoning max)
- **Session:** `fanout-deepseek-flash-max-1791092550011-hh7wyn`, generation 1
- **Iterations:** 10 of 10 (stopPolicy `max-iterations`; stop reason `maxIterationsReached`)
- **Date:** 2026-10-04
- **Scope:** research only; no spec-kit code, template or validator was edited.

## 1. Bottom line

**Interoperate, don't absorb.** system-spec-kit should not adopt OKF as its packet format — its authored contract (levels, anchors, 40 validation rules, completion gates, generated metadata pair) is strictly stronger than OKF's three-rule permissive conformance, and in-place adoption is a multi-thousand-document migration class against a format that renamed two fields between v0.1 and v0.2. Five OKF-derived ideas survive on their own merit; three clusters are rejected on evidence. A one-way export command captures the interoperability value of the ecosystem (370 GitHub repositories observed) with zero corpus migration.

## 2. Ranked verdicts

| # | Recommendation | Verdict | Effort | Risk |
|---|---|---|---|---|
| R1 | Structured provenance block (`sources`-shaped, authored-only) on research/review artifacts + one path-resolution rule | **Adapt** | S/M | Low |
| R2 | One-way packet→OKF bundle export command, opt-in, output outside indexed roots | **Adopt** | M | Low-Med |
| R3 | Freshness marker (`stale_after`-style) on decay-prone artifacts only, one named consumer | **Adapt** | S/M | Med |
| R4 | Actor convention for `last_updated_by` (`human:` / `process:` / `producer/version`) | **Adopt** | S | Low |
| R5 | `type` key on the five core template blocks, optional, no backfill | **Adapt (minimal)** | S | Low value until a consumer exists |
| R6 | `verified` trust tiers and the attestation protocol | **Reject** | — | Second unenforceable truth |
| R7 | Per-folder `index.md` / `log.md` file families | **Reject** | — | Drift class; fail-closed index conflict |
| R8 | In-place OKF conformance on the packet corpus; bundle import | **Reject** | — | Migration class; structurally blocked |

## 3. What OKF v0.2 is (verified)

- OKF v0.2: a directory of markdown files with YAML frontmatter; `type` is the only always-required key; optional provenance (`sources` + credibility signals), trust (`generated`, `verified` → trust tiers), lifecycle (`status`, `stale_after`), and computation (`Attested Computation`) families; reserved `index.md`/`log.md`; permissive three-rule conformance (`scratch/seed/okf-SPEC.md:1-18, 134-149, 155-207, 287-434, 736-762`).
- **The seed copy is byte-identical to the canonical upstream** `GoogleCloudPlatform/open-knowledge-format` SPEC.md and to the frozen `knowledge-catalog/okf/` copy — sha256 `26aa5da0…` for all three (verified 2026-10-04).
- The reference implementation confirms the semantics: type-only requirement, bare-mapping `verified` normalization, trust tiers keyed on `human:`, staleness only with an explicit UTC offset (`src/reference_agent/bundle/document.py`).
- Provenance: announced 2026-06-12 as v0.1, "formalizing the LLM-wiki pattern"; the ecosystem now shows 370 repositories, independent toolchains (Claude Code plugins, MCP servers, Ruby/Rust tooling), and Knowledge Catalog ingest support.

## 4. Why not in-place adoption (adversarial core)

1. **Weaker contract.** OKF conformance requires parseable frontmatter, a non-empty `type`, and reserved-file structure; consumers must not reject missing optional families, unknown types, broken links or missing indexes (`okf-SPEC.md:736-762`). Spec-kit runs 40 registry rules with ERROR/WARNING severities and two completion gates (`validator-registry.json`; `SKILL.md:444-458`).
2. **Self-declared trust.** Trust tiers key on a literal `human:` prefix and are "advisory signals, not access control" (`okf-SPEC.md:409-410`); `usage_count` is coarse and self-reported (`okf-SPEC.md:336-341`). Spec-kit's verification evidence is accountable artifacts (tasks checklist, acceptance criteria, review reports).
3. **Version churn.** v0.1→v0.2 renamed `timestamp`→`generated.at` and the `# Citations` list→`sources` within the same year (`okf-SPEC.md:796-812`); the announcement calls the format "a starting point, not a finished standard".
4. **Deferred enforcement.** The distinctive `Attested Computation` runtime protocol (receipt/verdict formats, attester ABI, sandboxing, caching) is "intentionally left to a future revision" (`okf-SPEC.md:782-793`).
5. **Weak comparability.** 16 conformance-tooling repositories observed, none canonical (UNKNOWN: no certification found); the spec's own sample bundle adds a `log.md` frontmatter convention beyond §9 (observed divergence).
6. **No rigor surface.** OKF contributes no anchors/line addresses, levels, gates, phase system, fingerprints or retrieval tooling — the areas where spec-kit is strongest.
7. **Consumption-side ecosystem.** The 370 repositories overwhelmingly consume bundles; interop needs a producer bridge, not corpus conversion.

## 5. Crosswalk headline (full table in iteration 6)

| OKF field | spec-kit today | Status |
|---|---|---|
| `title`, `description` | identical keys, enforced | Match |
| `type` | filename + packet role | Gap (mapping exists) |
| `sources` + signals | body-citation conventions only | **Largest gap** |
| `generated` | `last_updated_by` + `last_updated_at` + `last_save_at` | Partial |
| `verified` | no doc-level verification events; closure gates verify work | Gap |
| `status` | status field + derived status + consistency rule | Partial |
| `stale_after` | none (strict-only opt-in freshness check) | Gap |
| `usage_count` | `last_accessed_at` telemetry only | Gap |
| actor convention | free-text `last_updated_by` | Gap (cheap) |

Conflicts that block naive adoption: OKF conformance universality vs the 23,413-doc non-archive corpus; reserved `index.md`/`log.md` vs zero existing `log.md` and a fail-closed trigger-index walker (`corpus.mjs:117`); one-file-per-concept vs spec-kit's authored/generated/machine-owned split (`save-workflow.md:296-298`); permissive vs prescriptive validation culture; bundle-absolute vs repo-relative link bases.

## 6. Blast-radius summary (full in iteration 8)

- 4,548 `spec.md` files; 23,413 non-archive docs; 41,265 total under `specs/`.
- Optional additions are additive: `FRONTMATTER_VALID` checks required values only and never rejects unknown keys (`check-frontmatter.sh:105-115`); post-edit hooks are warn-only.
- Required changes are migrations. New file families under `specs/` either carry parseable frontmatter or need an exclusion plus the parity-test update (`corpus.mjs:104,117`; `retrieval-conventions.md:271`).
- Export is zero-surface provided output stays outside `specs/` and indexed roots.
- The skill advisor is outside the blast radius: packet docs feed routing only with `SPECKIT_ADVISOR_DOC_TRIGGERS=true`.

## 7. Proposed shape for phase 002 (adoption-design)

Design only R1-R5, each additive, each with acceptance criteria:

1. **R1 — portable provenance.** Optional `sources:` list on research/review artifacts; `resource` required per entry; `id` required when the body cites it; internal (packet-relative) and external (URL) kinds; one opt-in resolution rule; authored-only owner (never copied into the generated sidecars).
2. **R2 — export bridge.** `export-okf`-style command: role→type mapping (to be fixed in 002), `index.md`/`log.md` emission, bundle-relative link rewrite, output directory outside indexed roots, fixture round-trip test.
3. **R3 — freshness.** One optional staleness instant on decay-prone artifacts (`research.md`, review reports); one named consumer (doctor report or resume warning) chosen at design time; keep out of `_memory.continuity`.
4. **R4 — actor convention.** Document and optionally validate the `human:` / `process:` / `producer/version` prefixes for `last_updated_by`; existing free-text values stay legal.
5. **R5 — optional type.** Add `type` to the five core template frontmatter blocks with a closed vocabulary; no backfill; template version marker bumped.
6. **Non-goals for 002:** no new reserved filenames under `specs/`; no required OKF families; no import; no changes to the 40-rule registry beyond the R1 resolution rule and optional R4 acceptance.

## 8. Convergence report

- Stop reason: **maxIterationsReached** (stopPolicy `max-iterations`; convergence was telemetry only).
- Iterations completed: 10.
- newInfoRatio trend: 0.85, 0.80, 0.80, 0.85, 0.90, 0.75, 0.75, 0.75, 0.65, 0.60 (average 0.77).
- Questions answered: Q1-Q10 of the Research Charter (each iteration answered its focus).
- Quality guards: every repository claim carries `file:line`; every web claim a URL or live-run observation; 11 distinct web sources (article, upstream repo files, knowledge-catalog, GitHub searches, agents.md, llmstxt.org, Anthropic; plus three community repos) — above the five-source floor.
- Residual uncertainty: R2's type vocabulary choice; R3's consumer choice; ecosystem adoption numbers beyond stars; single-model lineage (mitigated by adversarial iteration 9 and citation discipline).

## 9. Source register (web and live-run)

| Source | Contributed |
|---|---|
| `https://cloud.google.com/blog/products/data-analytics/how-the-open-knowledge-format-can-improve-data-sharing` | Announcement, v0.1 framing, design principles, LLM-wiki lineage, Knowledge Catalog ingest |
| `https://github.com/GoogleCloudPlatform/open-knowledge-format` (+ raw SPEC.md, README, tree API, `src/reference_agent/bundle/document.py`, `tests/test_document.py`, `bundles/acme_retail/*`) | Canonical spec (sha256 match), implementation semantics, practice bundle |
| `https://github.com/GoogleCloudPlatform/knowledge-catalog/tree/main/okf` (+ raw SPEC.md/README.md) | Frozen snapshot with redirect notice; sha256 match; repo context |
| `https://api.github.com/search/repositories?q=open+knowledge+format+okf` | 370-repo ecosystem census |
| `https://api.github.com/search/repositories?q=okf+conformance` | 16 conformance-tooling repos; no canonical suite |
| `https://github.com/scaccogatto/okf-skills` | Independent Claude Code toolchain, conformance checker, self-hosting in `.okf/` |
| `https://github.com/zosmaai/pi-llm-wiki` | Independent Obsidian-compatible v0.2 implementation |
| `https://github.com/serradura/okf` | Independent Ruby/MCP/TUI toolchain |
| `https://agents.md/` | Adjacent standard: >60k projects, instruction-file job |
| `https://llmstxt.org/` | Adjacent standard: v2 single-file proposal, Lighthouse audit |
| `https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills` | Adjacent standard: SKILL.md frontmatter, progressive disclosure |
| Live runs (2026-10-04) | Trigger-index lookups (`open knowledge format adoption` → 0 results; `folder structure reference` → 1 exact hit); rg scan → 4 packet docs; sha256 comparisons; corpus counts |

## 10. Open questions

- R2 type vocabulary is a design choice, not evidence — finalize in phase 002.
- R3 ships only if a consumer adopts it (doctor or resume); otherwise drop.
- UNKNOWN: production-scale OKF adoption beyond star counts and Knowledge Catalog.
- The parent run's phase_synthesis merges this lineage with the others; this document is the lineage-canonical synthesis, not the packet merge.

---

## Appendix A. Orchestrator verification and second-lens review

Sections 1 to 10 above are the lineage's own synthesis, copied unchanged. This appendix records what the orchestrating session checked and where an independent Claude-family reviewer, which had no access to the lineage's reasoning, disagreed. Every correction below was re-read in the repository before being written here.

### A.1 What was verified

- The seed `okf-SPEC.md` has the same sha256 as `GoogleCloudPlatform/open-knowledge-format` and `knowledge-catalog/okf`, each beginning `26aa5da0`.
- 228 of 233 `file:line` citations resolve inside their file's length. The other five are shorthand paths to this packet's own files and one upstream file.
- The cited OKF lines (`okf-SPEC.md:405-412`, `736-762`, `782-793`, `796-812`) and the cited spec-kit lines for the completion gates and the retrieval coverage policy say what is claimed.
- 40 validator rules (32 error, 6 warn, 2 info), 4,548 `spec.md` files, the 370 and 16 GitHub search counts, 7 of 7 source URLs returning 200, the agents.md ">60k projects" line, and both trigger-index lookups all reproduce.
- The corpus counts "23,413" and "41,265" are counts of markdown files, not of all files under `specs/`. The run's own files account for the small difference from a re-count.

### A.2 Process defects in the run

- The child wrote its state files by hand instead of using the reducer. Seven state-log entries carry round timestamps after the run ended (06:06Z to 06:26Z), and the registry `createdAt` is 06:30Z against a 06:01Z finish. The runner flagged the first of these as `timestamp_anomaly`.
- The lineage registry has no `keyFindings` array, so the merge carried over 0 findings.
- `newInfoRatio` values are self-reported and unverified.
- The report has 10 sections, not the workflow's 17-section template.

### A.3 Corrections from the second-lens review

Each of these was confirmed by reading the cited lines.

- **R4 was built on a false premise.** `last_updated_by` is not free text. The `FRONTMATTER_MEMORY_BLOCK` rule (error severity) and the continuity writer both require `^[a-z0-9][a-z0-9._-]{1,63}$` (`runtime/lib/validation/spec-doc-structure.ts:827-831`, `runtime/lib/continuity/thin-continuity-record.ts:126,664-665`). `human:x` and `producer/version` both fail it, so R4 needs a validator and writer change, not "no validator change". Its only OKF consumer, trust tiers, is what R6 rejects.
- **R5 overlooked an existing key.** `contextType` already marks the document kind and has no closed vocabulary; 35 values have drifted (`references/structure/grep-convention.md:66,388`). Constraining it and mapping it to OKF `type` on export replaces adding a sixth key.
- **R7's reason was overstated.** A file with no frontmatter is classed `missing-frontmatter`, which is not a fail-closed category; only malformed frontmatter blocks the index build (`runtime/cli/retrieval/lib/frontmatter.mjs:27-47,317`). The last generator run recorded 6,675 such documents and 0 malformed (`runtime/cli/retrieval/fixtures/generation-diagnostics.json`). The timeline add-on (`templates/addons/timeline.md.tmpl`) already covers most of what `log.md` would. The reject verdict can stand on those grounds, not on fail-closed.
- **A citation is off by one.** `corpus.mjs:104` is a blank line; the definition is on line 103.

### A.4 Open disagreements for the design phase

These are judgment calls. They are recorded as disagreements, not averaged.

- **R1:** the reviewer argues `sources` should be generated from existing loop evidence arrays and not hand-authored, to keep one owner per field.
- **R2:** the reviewer argues "Adopt" is too strong while no consumer is named, which is the same bar the report applied to R3 and R5. The 370-repository demand figure comes only from the web.

### A.5 A candidate the report missed

OKF keys citations by stable `id` rather than position because agents rewrite documents (`okf-SPEC.md:359-364`). Spec-kit citations are positional (`file:line`), and `AC_COVERAGE` catches a line past the end of a file but not one that has drifted (`references/validation/validation-rules.md:95`). Spec-kit already has stable keys in its ANCHOR ids. This is unverified as a design and goes to phase 002 as a candidate (R9).

### A.6 Revised verdict list handed to phase 002

This is the orchestrator's judgment on verified evidence, not the lineage's output.

- **R1** Adapt, generated from loop state. Contested (A.4).
- **R2** Adapt, conditional on a named consumer. Contested (A.4).
- **R3** Adapt, unchanged, conditional on a consumer.
- **R4** Adapt, cost corrected to M with validator and writer changes; low value until a consumer exists. Defer unless one does.
- **R5** Adapt in a different shape: constrain `contextType` and map it on export. No new key.
- **R6, R7, R8** Reject. The R7 and R8 reasons are corrected as above.
- **R9** New candidate: stable-key citations. Evaluate in phase 002.
