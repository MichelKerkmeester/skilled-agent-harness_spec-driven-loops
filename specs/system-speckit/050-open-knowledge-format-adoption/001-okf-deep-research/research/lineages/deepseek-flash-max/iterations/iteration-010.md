# Iteration 010 — Synthesis: ranked recommendations

- **Focus (charter 10):** Ranked recommendations, each adopt, adapt or reject, with evidence, effort, risk and a proposed shape for phase 002.
- **Status:** complete
- **NewInfoRatio:** 0.60
- **Novelty:** Terminal ranking that resolves every prior lean verdict; states the format-level relationship (interoperate, don't absorb) and the phase-002 package.

## Ranked verdict list

| # | Recommendation | Verdict | Effort | Risk | Evidence |
|---|---|---|---|---|---|
| R1 | Structured provenance block (`sources`-shaped, `id`/`resource`/`title`/`author` optional, authored-only) on research/review artifacts, plus one path-resolution rule | **Adapt** | S/M | Low: additive; risk only if it spreads to generated sidecars | iter 6 §A (`sources` gap), 7 C4, 8 C4, 9 P1 |
| R2 | One-way bundle export command (packet → OKF bundle), opt-in, output outside indexed roots | **Adopt** | M | Low-medium: mapping vocabulary and output-dir discipline; reversible | iter 5 F3, 7 C6, 8 C6, 9 A8 |
| R3 | Freshness marker (`stale_after`-style instant) on decay-prone artifacts only; surfaced by doctor/resume; never in generated sidecars | **Adapt** | S/M | Medium: needs exactly one consumer or it decays; keep out of `_memory.continuity` | iter 6 §A, 7 C5, 8 C5, 9 P2 |
| R4 | Actor convention for `last_updated_by` (`human:` / `process:` / `producer/version`) | **Adopt** | S | Low | iter 7 C7, 8 C7; `okf-SPEC.md:489-502` |
| R5 | `type` key on the five core template blocks, optional, closed vocabulary, no backfill | **Adapt (minimal)** | S | Low value unless a consumer appears; cheap enough to hold | iter 7 C1, 8 C1 |
| R6 | `verified` trust tiers and the attestation protocol | **Reject** | — | Second, unenforceable truth vs closure gates; protocol deferred by the spec itself | iter 7 C5, 8 C5, 9 A2/A4; `okf-SPEC.md:409-410,782-793` |
| R7 | Per-folder `index.md` and `log.md` as new file families | **Reject** | — | New drift class; collides with fail-closed index walker; duplicates Phase Documentation Map / changelogs | iter 7 C2/C3, 8 C2/C3, 9 A6 |
| R8 | In-place OKF conformance on the packet corpus; bundle import | **Reject** | — | Multi-thousand-doc migration class; import structurally blocked | iter 6 §D, 7 neg, 8 C6, 9 A1 |

## Format-level relationship

**Interoperate, don't absorb.** system-spec-kit keeps its authored contract (levels, anchors, gates, sidecars) and gains a producer-side bridge to the OKF ecosystem. Every adopted idea (R1-R5) is separable from OKF: removing the format dependency would not remove the value. The one idea that is not separable — conversion of the packet corpus into OKF concepts — is rejected on cost and contract grounds.

## Proposed shape for phase 002 (adoption-design)

Phase 002 should design exactly R1-R5 as additive features, each with acceptance criteria, and carry these non-goals:

1. **R1 contract:** optional top-level `sources:` list with required `resource` per entry; `id` required when the body cites the source; kinds: `internal` (packet-relative path) and `external` (URL). One new opt-in rule resolves each `resource` and reports unresolved entries; no retrofitting of existing docs. Owner: author; never copied into `description.json`/`graph-metadata.json`.
2. **R2 contract:** `export-okf` (name illustrative) reads a packet, maps document roles to a type vocabulary (`spec.md` → `Specification`, `plan.md` → `Plan`, `tasks.md` → `Task List`, `acceptance-criteria.md` → `Acceptance Criteria`, `implementation-summary.md` → `Implementation Summary`, research/review artifacts → `Research`, `Review Report`), emits `index.md`/`log.md`, rewrites repo-relative links to bundle-relative, writes to an operator-chosen directory outside `specs/` and outside indexed roots, and is covered by a fixture round-trip test.
3. **R3 contract:** one optional key on `research.md`/review reports only; consumer named at design time (doctor report and resume warning are the candidates); no writer change required; precedence rule if both key and generated freshness exist.
4. **R4 contract:** writer documentation plus optional validation acceptance of the three prefixes; existing free-text values remain legal.
5. **R5 contract:** add `type` to the five core template frontmatter blocks; optional for validation; template version marker bumped; no corpus backfill; consumer deferred until one is named.
6. **Phase-002 non-goals:** no new reserved filenames under `specs/`; no required OKF family; no import; no changes to the 40-rule registry beyond the single R1 resolution rule and any R4 acceptance check.

## Residual uncertainty

1. R2's type vocabulary is a design choice, not an evidence-backed mapping; phase 002 must pick and record it. (UNKNOWN until then.)
2. R3's consumer choice determines its value; if neither doctor nor resume adopts it, the key should not ship.
3. The ecosystem census used GitHub search only (no web search engine); adoption numbers beyond stars are UNKNOWN.
4. Single-model lineage risk stands: mitigations were the adversarial iteration and per-claim citations, but a second executor lineage may reach different weights.

## Sources

- Cumulative: iterations 1-9 sources; no new retrieval in this iteration beyond consolidation.
- `[SOURCE: iterations/iteration-001.md … iteration-009.md]` (this lineage).

## Next focus

None — maxIterations reached. Synthesis written to `research.md`.
