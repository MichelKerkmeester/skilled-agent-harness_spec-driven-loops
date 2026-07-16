---
title: "Changelog: Spec-Kit Data Quality by Default [003-spec-data-quality/root]"
description: "Chronological changelog for the Spec-Kit Data Quality by Default spec root."
trigger_phrases:
 - "root changelog"
 - "packet changelog"
 - "nested changelog"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/root.md | v1.0 -->

## 2026-06-23

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/003-spec-data-quality` (Level 3)

### Summary

The data-quality lineage moved from research to shipped code. Beyond the 28-phase research scaffold, children 029 through 040 landed. The vague-query model benchmark (029), the improvement and generated-JSON quality research (030, 031), the z_future exclusion (032), the generated-metadata build (033 identity-merge-safety, 034 z-exclusion, 035 idempotent-writes, 036 metadata-validator, 037 drift-gate, 038 generator-hardening), the full-repo JSON migration (039) and the flag-graduation benchmark (040). The migration restamped every `description.json` and `graph-metadata.json` in the whole tree to the new format, z_archive included and z_future excluded by operator decision, gated on a byte-stable second run and 2049 folders at zero violations. The benchmark then ran the earn-or-delete reckoning on the thirteen built flags. Twelve graduated to default-ON or enforcing and one, grounding-signal, was deleted as purely informational. The historical 2026-06-22 and 2026-06-21 entries below record the research-scaffold state and are superseded for the shipped phases.

### Verification

- Full-repo JSON migration - COMPLETE, 2049 folders at 0 violations, byte-stable second run, validate-clean
- Flag-graduation benchmark - COMPLETE, twelve flags kept and one deleted under the earn-or-delete bar
- Per-phase changelogs - COMPLETE, one leaf per phase 029 through 040 under this directory

### Follow-Ups

- The research scaffold 001 through 028 stays a future build plan, kept by operator intent. The shipped lineage is 029 through 040.

## 2026-06-22

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/003-spec-data-quality` (Level 3)

### Summary

A round-2 deep review ran 30 iterations across 6 angles as parallel opus seats reading the live system-spec-kit code, not only the 005 docs, and returned the verdict CONDITIONAL. It surfaced roughly 100 findings, 1 design-blocking and about 29 P1 and 40 P2, clustered into six themes. A same-session remediation then fixed every P0 and P1 and the actionable P2 findings across the affected docs. Nothing was built. Every phase stays PLANNED at completion 0, SPECIFIED and not run. The program direction held. The remediation corrected magnitude and metric design, not the tiering.

### Changed

- Truncation law corrected from a cap to a floor across the decision-facing docs. `DEFAULT_MIN_RESULTS = 3` is a never-cut-below-3 minimum guarantee, not a top-3 cap. Confidence truncation is cliff-conditional and returns 3 to 20 and token-budget truncation is the real prod-limiting stage. The surviving direction held, retrieval candidates still need a prod-mode proof because eval-mode gains do not transfer and write-time still ships on cost. Only the every-query-to-3 magnitude was wrong.
- C2 gate (`015-prodmode-recall-gate`) widened from completeRecall@3 alone to the @3/@5/@8 prod-window columns the harness already emits plus an order-sensitive NDCG@K companion with a top1 guard. A promotion now needs a recall rise AND a ranking-quality hold. `run-eval-v2.mjs` is verify-no-change because the export at line 361 already exists, so the gate adds no harness change.
- A4 census (`004-schema-warn-to-error`) re-sized. A real graphMetadataSchema run fails 24 files, 16 excluding archives, not 11. A4 stays unconditional as a DECISION but the error flip is gated on a re-measure-to-zero backfill, and the genuine failing roots are named rather than the 11 nested research-iteration text stubs.
- A3 producer guard (`003-enum-constrain-schemas`) widened to cover all three out-of-enum paths, the normalizeDerivedStatus default and the deriveStatus unknown branch and the deriveImportanceTier raw-tier return, through a dual lenient and strict schema behind a flag seam rather than a bare z.enum swap.
- Over-scaffolding reframed honestly. The buildable-now subset is A4 and the shared engine and A1 and A3. The retrieval tier and the thin novel items are deferred-until-measured behind a real prod read. No phase was deleted and all 28 scaffolds are kept per operator intent.
- Documentation accuracy fixes landed in the tracking doc and the research.md internal counts so the metric rows and tier counts reconcile.

### Verification

- Round-2 deep review - COMPLETE, verdict CONDITIONAL, 30 iterations across 6 angles, all 30 slices returned findings
- Remediation across all six themes - COMPLETE, every P0 and P1 and the actionable P2 fixed across the affected docs
- Recursive validate.sh --strict over the remediated phases - PASS, exit 0
- HVR voice across the remediated docs - PASS, no em-dashes, no prose semicolons, no Oxford commas
- Build status - UNCHANGED, nothing shipped, every phase PLANNED at completion 0

### Follow-Ups

- Build the minimal high-value subset first, 004 and 026 and 001 and 003, then read a prod-mode completeRecall@3/@5/@8 result before scaffolding any retrieval-tier or thin-novel build.
- Keep every retrieval-class phase default-off until that prod read moves and holds NDCG@K and top1, because eval-mode gains do not transfer. The eval lens skips truncation while the prod path applies the cliff-conditional cut over the never-cut-below-3 minimum and the token budget.

## 2026-06-21

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/003-spec-data-quality` (Level 3)

### Summary

This packet ran the full spec-kit data-quality research as the official multi-lineage loop and produced a canonical synthesis. Nothing was shipped. The value is a verified evidence base and a tiered go or no-go program that a build stage can act on without re-deriving the corpus facts.

### Included Phases

| Phase | Status | Summary |
|---|---|---|
| `001-extend-quality-loop-authored` | PENDING | Nothing has shipped yet. This phase is PLANNED and scaffolded only. The spec, plan, tasks, and checklist are authored and the three build seams are described, but no code change has landed and no acceptance criterion has been verified. |
| `002-trigger-propagation-description` | Draft | Status PLANNED. This phase is scaffolded and not yet implemented. No code change has landed and nothing below has shipped. The section describes the change the phase will make once it is built. |
| `003-enum-constrain-schemas` | Draft | Status PLANNED. This phase is scaffolded and not yet implemented. No code change has landed and nothing below has shipped. The section describes the change the phase will make once it is built. |
| `004-schema-warn-to-error` | Draft | Status PLANNED. This phase is scaffolded and not yet implemented. No code change has landed and nothing below has shipped. The section describes the change the phase will make once it is built. |
| `005-trigger-coherence-assertion` | Draft | Status PLANNED. This phase is scaffolded and not yet implemented. No code change has landed and nothing below has shipped. The section describes the change the phase will make once it is built. |
| `006-hvr-style-autofix` | Draft | Status PLANNED. This phase is scaffolded and not yet implemented. No code change has landed and nothing below has shipped. The section describes the change the phase will make once it is built. |
| `007-ears-constraints-req-coverage` | Draft | Nothing is built yet. This phase is PLANNED and scaffolded. The doc set captures the approach so a later build stage can clone the shipped AC_COVERAGE rule into a REQ_COVERAGE gate without re-deriving the seams. The plan, tasks, and checklist hold the verified file references the build will act on. |
| `008-surface-provenance-fields` | Draft | This phase is planned and scaffolded only. Nothing has been built yet. The docs below describe the intended change so a later session can pick it up without re-deriving the seams from the research. |
| `009-content-hash-integrity` | Draft | Status PLANNED. This phase is scaffolded and not yet implemented. No code change has landed and nothing below has shipped. The section describes the change the phase will make once it is built. |
| `010-per-surface-gates` | Draft | Nothing is built yet. This phase is a planned scaffold. The spec, plan, tasks, and checklist are authored and the four gate builds plus the route-validate generalization remain pending. This document records the intended shape so a later session can pick the work up without re-deriving the seams. |
| `011-scheduled-dq-sweep` | Draft | Nothing is built yet. This phase is scaffolded only. The spec, plan, tasks, and checklist are authored and the work is PLANNED. The build is gated on 026-shared-safe-fix-engine landing the engine, the detector registry, and the frozen fixClass allow-list. |
| `012-doctor-dq-route` | Draft | Status is PLANNED. Nothing is built yet. This phase is a scaffold with a spec and the Level-2 doc set, the route code does not exist. This summary records the intended shape so a later session can pick it up without re-deriving the design. |
| `013-retrieval-feedback-edge` | Draft | Nothing is built yet. This phase is a PLANNED scaffold. The spec, plan, tasks, and checklist describe the intended impression-signal feedback edge, and no code is written. The detector module, the seam capture, and the refinement_queue table do not exist yet. |
| `014-chunk-prefix` | Draft | This phase is PLANNED and scaffolded. Nothing is implemented yet. The spec, plan, tasks, and this doc describe the intended work so the next session can pick it up cleanly. No code path has changed and no vector has moved. |
| `015-prodmode-recall-gate` | Draft | Status PLANNED. This phase is scaffolded and not yet implemented. No code change has landed and nothing below has shipped. The section describes the change the phase will make once it is built. |
| `016-answerable-questions-tags` | Draft | Status is PLANNED. This phase is scaffolded and not yet implemented. Nothing in memory-parser.ts or stage2-fusion.ts has changed and no auto-generator exists yet. The text below states the intended behavior so the next implementer can pick it up. |
| `017-metadata-fusion` | Draft | Status PLANNED. This phase is scaffolded and not yet implemented. No code change has landed and nothing below has shipped. The section describes the change the phase will make once it is built. |
| `018-llm-judge-scorer` | Draft | Status PLANNED. This phase is scaffolded and not yet implemented. No code change has landed and nothing below has shipped. The section describes the change the phase will make once it is built. |
| `019-novel-contradiction-detection` | Draft | Nothing is built yet. This packet is a planned scaffold. The spec, plan, tasks and checklist describe a report-only contradiction detector. No detector code exists. This record stays at PLANNED until the build starts. |
| `020-novel-embedding-drift-monitor` | Draft | Nothing is built yet. This phase is a PLANNED scaffold with spec.md and plan.md and the Level 2 doc set in place and no code written. The sections below describe the planned capability so a builder can pick it up, not work that has shipped. |
| `021-novel-example-test-generation` | Draft | Nothing is built yet. This phase is PLANNED and only the spec-kit doc set is scaffolded ahead of the build. The generator described below does not exist in the repo and no requirement prose has been touched. |
| `022-novel-context-budget-assembler` | Draft | Nothing is built yet. This phase is scaffolded and PLANNED. The notes below describe the intended change so the build has a fixed target. No module, no seam edit and no test exists at this point. |
| `023-novel-typed-relation-kg` | Draft | Nothing is built yet. This phase holds the Level-2 doc set and the design, and it waits on implementation. The notes below describe the planned build so a future session can pick it up without re-deriving scope. |
| `024-novel-freshness-decay-queue` | Draft | Nothing is built in this phase yet. The folder is a PLANNED scaffold and the section below describes the intended build, not shipped work. No code, table or registry entry exists yet. |
| `025-novel-per-doc-quality-slas` | Draft | Nothing is built yet. This phase is a PLANNED scaffold. The spec, plan, tasks and checklist describe the intended work, and no code has been written. The phase builds only after a host maintenance queue exists. |
| `026-shared-safe-fix-engine` | Draft | Nothing is built yet. This phase is scaffolded only. The spec, plan, tasks and checklist are authored and the work is PLANNED. The engine is the foundation the program builds first, right after the Stage-0 census, so the front doors A1, B1 and B2 wait on it. |
| `027-retrieval-floor-experiment` | Draft | Status PLANNED. This phase is scaffolded and not yet implemented. No code change has landed and nothing below has shipped. The section describes the change the phase will make once it is built. |
| `028-governance-rollout` | Draft | Nothing has shipped yet. This phase is PLANNED and scaffolded only. The spec, plan, tasks and checklist are authored and the five governance deliverables are described, but no governance document has landed and no acceptance criterion has been verified. |
| `029-vague-query-model-benchmark` | Complete, benchmark | Vague-query model-behavior benchmark over 144 cells across four models. The quality and citation verdict held model-robust, with measured data and a model recommendation. No code shipped. |
| `030-vague-query-improvement-research` | Complete, research | Improvement research that diagnosed a calibration miss and produced twelve ranked proposals. No code modified. |
| `031-generated-metadata-quality-research` | Complete, research | Generated-JSON quality research that diagnosed four safety classes and produced fourteen ranked proposals. The research that drove the 033 through 040 build. No code modified. |
| `032-z-future-always-ignored` | Complete | `z_future` added to the `EXCLUDED_DIRS` set so it is always ignored by the generated-metadata backfill. `z_archive` left untouched. |
| `033-identity-resolver-merge-safety` | Complete, graduated default-on | One specs-root-relative spec-folder identity with non-null parent and unioned children on a merge re-derive, behind `SPECKIT_IDENTITY_MERGE_SAFETY`. Graduated to default-ON after the migration. |
| `034-scoped-backfill-boundary` | Complete, default-on by construction | The `z_*` exclusion from the descriptions cache behind `SPECKIT_GENERATED_METADATA_Z_EXCLUSION`, shipped default-ON with a one-var opt-out because it cannot mass-fail. |
| `035-idempotent-writes-cache-upsert` | Complete, graduated default-on | Skip a description write whose only delta is the volatile stamp plus a targeted aggregate upsert, behind `SPECKIT_IDEMPOTENT_DESCRIPTION_WRITES`. Graduated to default-ON. |
| `036-metadata-validator-status-enum` | Complete, graduated enforcing | The generated-metadata integrity validator and status enum, with `SPECKIT_GENERATED_METADATA_GRANDFATHER` report-only during the migration window then flipped OFF to a hard strict error. |
| `037-drift-gate-synopsis-extractor` | Complete, graduated default-on | One shared synopsis extractor for `description` and `causal_summary`, a `source_doc_hashes` freshness key and a drift gate behind `SPECKIT_GENERATED_METADATA_DRIFT_GATE`. Graduated after the migration re-run wrote the hashes tree-wide. |
| `038-generator-hardening` | Complete, graduated default-on | A graph-metadata `source_fingerprint`, one `listPhaseChildren` enumeration and index-layer telemetry behind `SPECKIT_GENERATOR_HARDENING`. Graduated after the re-run wrote the fingerprint tree-wide. |
| `039-full-repo-json-migration` | Complete | The scoped per-folder migration driver regenerated every `description.json` and `graph-metadata.json` in the whole tree to the new format, `z_archive` included and `z_future` excluded by operator decision. Gated on a byte-stable second run and 2049 folders at 0 violations. This migration earned the flag flips. |
| `040-flag-graduation-benchmark` | Complete | The earn-or-delete benchmark on the thirteen built flags. Twelve graduated to default-ON or enforcing and one, grounding-signal, was deleted as purely informational. |

### Added

- Create the Level 3 packet structure (003-spec-data-quality)
- Decision to research before build documented in decision-record.md
- Benchmarks deferred to the build packet
- No dependency licenses introduced
- No data handling introduced

### Changed

- Record the Stage 0 external-findings brief (research/stage-0-external-findings.md)
- Point the research index at the brief (research/research.md)
- Run validate.sh strict on the packet (spec.md)
- Check HVR voice across the authored docs (spec.md)
- Requirements documented in spec.md
- Technical approach defined in plan.md

### Fixed

- CHK-FIX-001 No actionable code finding here. This packet is research only, so the finding-class rule is not applicable
- CHK-FIX-002 Same-class producer inventory not applicable to a research packet
- CHK-FIX-003 Consumer inventory not applicable to a research packet
- CHK-FIX-004 Security, path, parser and redaction fixes not applicable here
- CHK-FIX-005 Matrix axes not applicable to a research packet
- CHK-FIX-006 Hostile env variant not applicable to a research packet

### Verification

- validate.sh --strict on 003-spec-data-quality - PASS, exit 0
- HVR voice across authored docs - PASS, no em-dashes, no prose semicolons, no Oxford commas
- Source preservation in the brief - PASS, every cited URL retained
- Synthesis convergence - PASS, five lineages across thirty-seven iterations all converged and reconciled into one tiered verdict
- Tier reconciliation - PASS, 1 measured GO, a GO-on-cost cluster (Tier A and B plus 7 novel), 5 CONDITIONAL retrieval items, 18 consolidated NO-GO
- Tasks complete - 5 completed task item(s) recorded

### Files Changed

_No file-level detail recorded._

### Follow-Ups

- Build the program in the order recorded in `028-governance-rollout`. The shared safe-fix engine and the prod-mode recall benchmark land before their dependents.
- Every retrieval-class phase stays default-off until a prod-mode completeRecall@3/@5/@8 read moves and holds NDCG@K and top1, because eval-mode gains do not transfer. The eval lens skips truncation while the prod path applies the cliff-conditional confidence cut over the never-cut-below-3 minimum and the token budget. `DEFAULT_MIN_RESULTS = 3` is a floor not a cap.
- Nothing in this track has shipped. Each child is a scaffold awaiting its build stage.
