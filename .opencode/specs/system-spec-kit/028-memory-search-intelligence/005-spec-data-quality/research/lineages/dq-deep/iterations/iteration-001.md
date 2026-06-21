# Iteration 001 - KQ1: On-write automation in the write path and its data-quality gaps

**Focus:** Map what on-write/validation automation already runs in the spec-kit write path and find where it fails to maximize data quality for retrieval, adherence, and logic.
**newInfoRatio:** 0.90
**Novelty:** First full inventory of the 38-rule validator surface against the three reader jobs; establishes the central gap (shape-only, never content-quality, never refinement).
**Status:** complete

## What I examined
- `scripts/lib/validator-registry.json` (38 rules, full read) [SOURCE: .opencode/skills/system-spec-kit/scripts/lib/validator-registry.json:1-313]
- `scripts/rules/` (31 `check-*.sh` + 2 helpers) and `scripts/validation/` (5 TS validators) [SOURCE: file listing]
- `scripts/spec/` write-path scripts: `validate.sh`, `quality-audit.sh`, `calculate-completeness.sh`, `check-completion.sh`, `recommend-level.sh` [SOURCE: file listing]

## Findings

### F1. The on-write automation is a 38-rule validator registry, and it is entirely shape/presence
Every rule in `validator-registry.json` is a **gate** (error/warn/info), and every one checks *structure, presence, or provenance* — not *content quality*. Grouping:
- **Structure/shape (error):** `FRONTMATTER_VALID`, `ANCHORS_VALID`, `SECTION_COUNTS`, `TEMPLATE_HEADERS`, `TEMPLATE_SOURCE`, `TOC_POLICY`, `FOLDER_NAMING`, `LEVEL_MATCH`, `COMPLEXITY_MATCH`, `SPEC_DOC_INTEGRITY`.
- **Presence (error):** `FILE_EXISTS`, `PLACEHOLDER_FILLED`, `FRONTMATTER_MEMORY_BLOCK`, `SECTION_COUNTS`.
- **Metadata-JSON (warn):** `GRAPH_METADATA_PRESENT`, `GRAPH_METADATA_SHAPE`, `DESCRIPTION_SHAPE`.
- **Evidence/traceability:** `EVIDENCE_CITED` (warn), `AC_COVERAGE` (info, opt-in via `SPECKIT_AC_COVERAGE`), `PRIORITY_TAGS` (warn), `EVIDENCE_MARKER_LINT` (warn, strict-only).
- **Save/continuity integrity (error):** `CANONICAL_SAVE_*` (5 rules), `POST_SAVE_FINGERPRINT`, `CROSS_ANCHOR_CONTAMINATION`, `MERGE_LEGALITY`, `SPEC_DOC_SUFFICIENCY`, `CONTINUITY_FRESHNESS` (warn, strict-only).

### F2. THE GAP: no rule validates the *content* that actually drives retrieval or adherence
The three reader jobs depend on specific fields, and **none of those fields are quality-checked**:
- **Retrieval surface** — `trigger_phrases`, `title`, `description` are the high-weight retrieval fields (parent synthesis confirms field-weighted retrieval). The registry checks that frontmatter *parses* (`FRONTMATTER_VALID`) and that description.json *has the keys* (`DESCRIPTION_SHAPE`), but nothing checks that `trigger_phrases` are distinctive, non-duplicative across the corpus, or aligned to the doc body; nothing checks `description` is specific rather than a generic restatement of the title.
- **Adherence surface** — requirement/constraint phrasing. No rule checks requirements are testable (EARS-shaped) or that constraints carry an always/ask-first/never tier. `AC_COVERAGE` checks linkage exists, not that the AC is well-formed.
- **Logic surface** — the executive summary and the metadata tables are the machine-readable spine. No rule checks the executive summary is present-and-non-empty as a semantic unit (only `SECTIONS_PRESENT`/`SECTION_COUNTS` count headers).

### F3. THE DEEPER GAP: every rule REJECTS; none REFINES
The topic asks for automation that goes "beyond simple code fixes to refining documents." The entire write-path automation is **detect-and-block**. There is zero auto-remediation: no rule normalizes, rewrites, generates, or improves a field. `generate-context.js` generates the two JSONs, but the authored markdown body is never auto-improved. This is the single biggest automation headroom: the corpus has a strong *gate* layer and **no refinement layer**.

### F4. Floor-law placement (inherited)
F2/F3 candidates are adherence/logic/write-time → they **bypass the 3-result truncation floor** (parent doctrine). They ship on cost and structural soundness, no prod-mode proof needed. Only the `trigger_phrases`/`description` *quality* lever touches retrieval, and even then it is write-time field hygiene (improving an already-weighted field) rather than adding floor-cut rows — so its risk profile is far lower than a new-chunk retrieval candidate.

## Dead Ends / Ruled Out
- Treating `DESCRIPTION_SHAPE`/`GRAPH_METADATA_SHAPE` as already-sufficient quality gates: ruled out — they are warn-only and key-presence-only (`validator-registry.json:192-206`), confirming the parent's GO candidate to promote them to real zod schema errors.

## Answers
- **KQ1 answered:** On-write automation = a 38-rule shape/presence validator registry run by `validate.sh`. The data-quality gaps are (a) no semantic-content quality checks on the retrieval/adherence/logic-bearing fields, and (b) no refinement layer at all — detection without remediation.

## Next focus
KQ2: retroactive/sweep automation (reindex, backfill, retention, doctor, ingest) and the missing quality-maximizing retroactive features.
