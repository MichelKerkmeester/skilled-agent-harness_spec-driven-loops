# Data Quality Program: Navigation Index

> What this folder is, in one line: a built-out data-quality lineage with 44 verified child folders. Children 001 through 028 preserve the original planned research scaffold, and children 029 through 044 record the shipped benchmark, generated-metadata, migration, flag-graduation and search-quality tail.

---

## Current Navigation

- **Program narrative:** [`../before-vs-after.md`](../before-vs-after.md) explains how this track fits into the wider 028 program.
- **Benchmark and test status:** [`benchmark-and-test-status.md`](benchmark-and-test-status.md) records the local benchmark and verification state.
- **Authoritative rollup:** [`../changelog/003-spec-data-quality/changelog-003-root.md`](../changelog/003-spec-data-quality/changelog-003-root.md) is the source-of-truth rollup for phase status.

---

## 001-028: Original Planned Research Scaffold

The original research program remains intact as planned scaffolding. These folders hold the deep-research recommendations and build contracts, not shipped implementation evidence.

| Range | Folders | Status |
|-------|---------|--------|
| 001-010 | On-write authored-doc and metadata quality checks | Planned scaffold |
| 011-013 | Retroactive automation and `/doctor` data-quality route | Planned scaffold |
| 014-018 | Retrieval-tier search tuning behind the prod-mode measurement gate | Planned scaffold |
| 019-025 | Novel write-surface and quality-analysis ideas | Planned scaffold |
| 026 | Shared safe-fix engine | Planned scaffold |
| 027 | Retrieval floor experiment | Planned scaffold |
| 028 | Governance and rollout plan | Planned scaffold |

The honest read is still the one captured by the review remediation: the buildable-now subset was small, while retrieval-facing candidates wait on production-mode evidence.

---

## Historical 029-032: Research and Benchmark Bridge

| Phase | Folder | Status | Focus |
|-------|--------|--------|-------|
| 029 (historical label) | `vague-query-model-benchmark/` | Complete, benchmark support | Vague-query model-behavior benchmark raw outputs over 144 cells across four models. |
| 030 | `030-vague-query-improvement-research/` | Complete, research | Improvement research that diagnosed a calibration miss and produced ranked proposals. |
| 031 | `031-generated-metadata-quality-research/` | Complete, research | Generated-JSON quality research that drove the 033 through 040 build. |
| 032 | `032-z-future-always-ignored/` | Complete | Added `z_future` to the generated-metadata exclusion rule while leaving `z_archive` covered. |

---

## 033-040: Generated Metadata Build, Migration and Flag Graduation

| Phase | Folder | Status | Focus |
|-------|--------|--------|-------|
| 033 | `033-identity-resolver-merge-safety/` | Complete, graduated default-on | Preserves one specs-root-relative identity with parent and child lineage on re-derive. |
| 034 | `034-scoped-backfill-boundary/` | Complete, default-on by construction | Keeps `z_*` staging out of descriptions cache writes through the scoped backfill boundary. |
| 035 | `035-idempotent-writes-cache-upsert/` | Complete, graduated default-on | Skips volatile-only description rewrites and narrows cache upserts to real deltas. |
| 036 | `036-metadata-validator-status-enum/` | Complete, graduated enforcing | Generated-metadata validator and status enum enforcement. |
| 037 | `037-drift-gate-synopsis-extractor/` | Complete, graduated default-on | Shared synopsis extraction and drift freshness keys. |
| 038 | `038-generator-hardening/` | Complete, graduated default-on | Source fingerprint, one child enumeration path and index-layer telemetry. |
| 039 | `039-full-repo-json-migration/` | Complete | Regenerated every eligible `description.json` and `graph-metadata.json` to the new format. |
| 040 | `040-flag-graduation-benchmark/` | Complete | Earn-or-delete benchmark that kept twelve generated-metadata and verdict flags and deleted one. |

---

## 041-044: Search Quality and Evidence-Gap Wave

| Phase | Folder | Status | Focus |
|-------|--------|--------|-------|
| 041 | `041-search-quality-fixes/` | Complete | Six live search-quality fixes, including the evidence-gap cap bridge and deterministic-ranking flag. |
| 042 | `042-deterministic-ranking-benchmark/` | Complete | Read-only graduation benchmark for the deterministic-ranking flag. |
| 043 | `043-gap-threshold-calibration-benchmark/` | Complete | Threshold sweep proving the Z-score gap detector measured peakedness rather than relevance. |
| 044 | `044-relevance-aware-evidence-gap/` | Complete | Gated relevance-aware evidence-gap detector and re-benchmark. |

---

## 045-049: Re-nested Drift-Audit and Metadata-Integrity Phases (from packet-028 top-level)

Relocated from packet-028 top-level `008-012` to their subject parent and renumbered `045-049` on 2026-07-04, clearing the `001-044` roster. Each was executed and shipped before the move; see the per-child `implementation-summary.md` for evidence.

| Phase | Folder | Status | Focus |
|-------|--------|--------|-------|
| 045 | `045-drift-audit-remediation/` | Complete | Fixed all 75 findings from a GPT-5.5-fast drift audit across 028's other children (formerly top-level `008`). |
| 046 | `046-drift-audit-deep-history-correction/` | Complete | Second-pass doc correction proving the `008` code-gap findings were built, shadow-shipped, benchmarked and deliberately deleted for cause (formerly `009`). |
| 047 | `047-generated-metadata-status-integrity/` | Complete | Fixed a deriveStatus defect mislabeling 213 folders `complete` from doc presence, plus a report-mode `validate.sh --strict` rule (formerly `010`). |
| 048 | `048-create-sh-parent-corruption-fix/` | Complete | Fixed a create.sh append-mode bug that overwrote a parent packet's `description.json`, and repaired the corrupted packet (formerly `011`). |
| 049 | `049-derive-status-explicit-bypass-fix/` | Complete | Closed a second deriveStatus bypass (explicit `status: complete` short-circuit) and wired the MCP validation-orchestrator enforcement flag (formerly `012`). |

---

## 050: Re-nested validate.sh Dist-Freshness Phase (from packet-028 top-level)

Relocated from packet-028 top-level `013` (adopted from standalone packet 030) to its subject parent and renumbered `050` on 2026-07-04. Unlike 045-049 (leaves), this is a phase parent that keeps its two children.

| Phase | Folder | Status | Focus |
|-------|--------|--------|-------|
| 050 | `050-validate-sh-dist-freshness-and-repo-remediation/` | In Progress | validate.sh dist-freshness enforcement (child 001) and the repo-wide `--strict --recursive` remediation sweep (child 002); formerly top-level `013`. |

---

## 051-053: Spec-Metadata Integrity and Archive Coverage

Authored 2026-07-06 as planning specs for a spec-metadata integrity program. Implementation
started; per each child's own `spec.md` METADATA table and `implementation-summary.md`, none is
formally closed out yet (see per-phase Status below). This supersedes the earlier "planning /
implementation not started" characterization of this section — see `context-index.md` §3 for the
consolidated work narrative, including the 10-iteration deep-review verification.

| Phase | Folder | Status | Focus |
|-------|--------|--------|-------|
| 051 | `051-graph-metadata-child-drift-audit-and-harden/` | In Progress | Audit and drift check shipped and verified (21 drifted parents found/classified, `GRAPH_METADATA_CHILD_DRIFT` validate rule added); backfill deferred. |
| 052 | `052-z-archive-metadata-backfill/` | In Progress | 8 of 9 `z_archive` container roots backfilled with `description.json` + `graph-metadata.json` and committable; the 9th is gitignored (on-disk only). |
| 053 | `053-deep-loop-036-037-reindex/` | In Progress | Reindex of the renamed `system-deep-loop/036,037` folders complete and verified; spec-folder completion-save pending. |

---

## Count and Source Notes

The verified disk inventory is 44 child folders `001-*` through `044-*`, plus five leaf phases `045-*` through `049-*` (re-nested from former top-level `008-012`) and one parent phase `050-*` (re-nested from former top-level `013`, keeping its two children), all relocated on 2026-07-04, plus three phases `051-053` authored 2026-07-06 with implementation started and in progress (see § above; each has its own `implementation-summary.md`). Earlier summaries asserting no `045-*`/`050-*` folder exists predate that re-nest. For detailed evidence, read the per-phase child specs and the rollup changelog before relying on older summaries.
