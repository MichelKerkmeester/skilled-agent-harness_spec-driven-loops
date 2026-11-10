# Resource Map (emitted from converged deltas)

Session fanout-mimo-1790242274086-9tq1wi | Emitted at synthesis | Sources consulted across 5 iterations with their themes

## Packet evidence

- spec.md (sections 2, 3, 5, 10): problem statement, measured rows, requirements, risks, research questions. Theme: charter and baseline claims to test.
- scratch/harness/data/v3.0.0.0.final.jsonl (356 rows): post-pipeline residual per packet at v3.0.0.0. Theme: residual truth for the older corpus.
- scratch/harness/data/v3.6.0.0.pipeline.jsonl (1,918 rows): same at v3.6.0.0. Theme: residual truth for the larger corpus.

## Harness tooling (read-only)

- scratch/harness/validate-all.cjs: failure semantics (failing = error-status entries, details truncated to 3). Theme: how to read the data.
- scratch/harness/classify.cjs: the MECH projection hypothesis. Theme: the claim widened in iteration 2.
- scratch/harness/agg.cjs: independent tally used for cross-checking counts.
- scratch/harness/bf-pipeline.sh: the measured two-tool pipeline and its --include-archive threading. Theme: order evidence.

## Validator and repair tooling (read-only)

- runtime/lib/validation/orchestrator.ts: TEMPLATE_SOURCE window check, entry classification. Theme: transform shapes.
- runtime/lib/validation/spec-doc-structure.ts, generated-metadata-integrity.ts: structural and sidecar rule implementations.
- runtime/cli/rules/check-status-cross-doc-consistency.sh: pairwise bucket comparison, ENFORCE switch. Theme: F-018 correction.
- runtime/cli/rules/check-grep-convention.sh: helper protocol (status line vs detail severity). Theme: F-013 axis.
- runtime/cli/rules/check-ac-closure.sh: creation-date grandfather cutoff. Theme: the Q3 pattern.
- runtime/cli/rules/check-ac-coverage.sh, check-metadata-disk-consistency.sh, check-graph-metadata-child-drift.sh: enforcement-switch inventory.
- runtime/cli/spec/repair-derived.cjs: FROZEN_TREES rationale, packet-shape gate, DERIVABLE/REDERIVABLE taxonomy, edits-then-rederive ordering law, beyond-reach bucket.
- runtime/cli/continuity/backfill-frontmatter.ts: z_archive exclusion and --include-archive.
- runtime/cli/graph/backfill-graph-metadata.ts: ARCHIVE_SEGMENT_RE over z_archive and z_future, failed[] summary semantics.
- runtime/cli/tests/test-validation-extended.sh: fixture root binding (not the live corpus).

## Git history (read-only)

- Tag trees v3.0.0.0 (2026-03-27) and v3.6.0.0 (2026-06-18): per-rule-id presence, ANCHOR and SPECKIT_TEMPLATE_SOURCE template contract greps. Theme: Q2 provenance.
- git log -S GREP_CONVENTION: earliest appearance 2026-09-04.

## Workflow contracts (read-only)

- .skilled/skills/system-deep-loop/deep-research/SKILL.md and references (loop-protocol, state-jsonl, state-outputs, convergence): record shapes and synthesis contract.
- .skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs: state-write gateway semantics.
- .skilled/skills/system-spec-kit/shared/review-research-paths.cjs: artifact-root resolver (why the reducer cannot target a lineage).
