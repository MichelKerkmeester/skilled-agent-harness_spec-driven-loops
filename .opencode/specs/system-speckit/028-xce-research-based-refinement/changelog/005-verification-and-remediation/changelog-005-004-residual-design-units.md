---
title: "Residual Design Units: Vector Reconcile, Synthetic Replay Corpus and Background Index Scan"
description: "Three residual 029 design units resolved: tri-138 re-tiered the memory_health token budget, tri-109 generalized the ingest job-queue into a kind-agnostic maintenance store with background indexing, Unit B wired a privacy-preserving synthetic replay corpus into the shadow-evaluation scheduler and Unit C plus two defer-bucket items were disposed without code."
trigger_phrases:
  - "005/004 residual design units changelog"
  - "tri-109 background memory index scan"
  - "synthetic replay corpus changelog"
  - "tri-138 memory health budget"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-13

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/004-residual-design-units` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement`

### Summary

This phase resolved the residual design units that 005/003 deferred because each touched a high-blast-radius subsystem. Three units shipped as code and three items were disposed by verify-first reasoning with no code written. Work was dispatched to parallel claude2 Opus 4.8 xhigh read-only design seats. The orchestrator independently re-verified each result before committing, never trusting a seat's self-report. Unit A (vector reconcile) and the L9 tail items landed in the prior session. This session shipped tri-138, tri-109 and Unit B, then recorded terminal dispositions for Unit C, tri-163, tri-129 and tri-135.

### Added

- `memory_index_scan_status` and `memory_index_scan_cancel` tools, expanding the spec-memory tool surface from 37 to 39.
- `maintenance_jobs` kind-agnostic store in `lib/ops/job-store.ts` and `memory-index-scan-jobs.ts`, which generalizes the ingest job-queue lifecycle so any maintenance job can run as an opt-in background task.
- Privacy-preserving synthetic replay corpus in `lib/feedback/shadow-replay-corpus.ts` and `replay-seed-vocab.ts`, keyed by intent enum and coarse result-count bucket with a counted-never-decoded query hash; every synthetic query is drawn verbatim from a static seed vocabulary.
- `assertCorpusPrivacy` fail-closed guard and a SENTINEL test locking the no-raw-query-text invariant in `shadow-replay-corpus-privacy.vitest.ts`.
- Staged follow-on plan for Unit C (launcher parity for mk-code-index): gate harness, daemon-backend-only mode and owner-proxy wiring, each as a separate multi-stage step with a default-off flag.
- Verified disposition records for tri-163 (refuted), tri-129 (deferred covered-in-aggregate) and tri-135 (already-correct).

### Changed

- `memory_health` re-tiered from a 1000-token to a 1500-token per-tool budget; `exclusionAudit.entries` gated behind the existing `includeFullReport` flag; `data.routing` is byte-for-byte unchanged.
- `memory_index_scan` gained an opt-in `background` flag; the synchronous default path is unchanged.
- `shadow-evaluation-runtime.ts` updated to consume the synthetic corpus for replay instead of skipping every run due to missing raw query text.
- `intent-classifier.ts` updated to expose the intent enum consumed by the corpus builder.

### Fixed

- Shadow-evaluation cycle no longer skips every run: the clean consumption log has no raw query text, so the old path produced an empty corpus on every iteration; the synthetic corpus now supplies it with non-reversible signals.
- `handler-memory-index-async-scan` test suite was red at HEAD because its scope-governance mock omitted `requiresGovernedIngest`; fixed incidentally as part of tri-109 with a one-line non-semantic mock stub.
- A post-implementation gpt-5.5 review hardened Unit B: the privacy guard is now a fail-closed own-key allowlist (the prior denylist missed the legacy `query_text` name) and the hash-bucket index derives from the first hex nibble so seed selection varies by fingerprint instead of collapsing to the first seed. The tri-109 background dispatcher now records an error-envelope result as a failed job and no longer leaks an unhandled rejection on a failed progress write.

### Verification

| Check | Result |
|-------|--------|
| tri-138: typecheck + handler-memory-crud routing-pin + token-budget + budget-enforcement + degradedVector suites | PASS (typecheck 0; all suites green) |
| tri-109: typecheck + 9 suites (job-store, scan-jobs, async-scan backward-compat, both ingest suites, parity/context-server count guards, ownership lint) | PASS (typecheck 0; 445 tests) |
| Unit B: typecheck + privacy SENTINEL + runtime suites | PASS (typecheck 0; 6 tests) |
| Comment hygiene on all changed code | PASS (no finding/ADR/REQ/CHK ids or spec paths) |
| Scoped commits, no database or runtime files staged unintentionally | PASS (verified per commit) |
| tri-163 refuted | Confirmed: COVERED_BY is a deep-loop context-sweep relation (ephemeral, separate graph), not a spec-to-file edge; a literal crosswalk is a category error |
| tri-129 deferred covered-in-aggregate | Confirmed: six existing stress and durability suites cover the constituent risks; the one genuine gap (large-payload bound) is specified for a follow-on test |
| tri-135 already-correct | Confirmed: eval_run_ablation already evaluates against the live embedding profile via the live provider and withAblationDb defaults |
| Unit C documented as staged follow-on | Confirmed: the full adoption port (daemon backend-only mode plus idle-monitor grace plus launcher wiring) is multi-stage, launcher-critical and inert until a fresh session |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `lib/ops/job-store.ts` | Created | Kind-agnostic maintenance-job store |
| `memory-index-scan-jobs.ts` | Created | Background scan job implementation |
| `memory-index.ts` | Modified | Background flag and job dispatch |
| `memory-ingest.ts` | Modified | Generalized lifecycle hooks |
| `job-queue.ts` | Modified | Kind-agnostic registration |
| `lib/feedback/shadow-replay-corpus.ts` | Created | Privacy-preserving synthetic corpus builder |
| `lib/feedback/replay-seed-vocab.ts` | Created | Static intent seed vocabulary |
| `intent-classifier.ts` | Modified | Intent enum exposed for corpus |
| `shadow-evaluation-runtime.ts` | Modified | Corpus integration |
| `layer-definitions.ts` | Modified | 1500-token budget and includeFullReport gate |
| `tool-schemas.ts` | Modified | New tool registrations (status, cancel) |
| `memory-crud-health.ts` | Modified | exclusionAudit.entries gated |
| `handler-memory-crud.vitest.ts` | Modified | Routing-pin and budget-enforcement tests |
| Two new test files (corpus privacy, scan-jobs) | Created | SENTINEL + job-lifecycle coverage |

### Follow-Ups

- Unit C launcher port is a follow-on packet: the gate harness and the C.2 daemon-mode plus C.3 launcher-wiring changes are specified but not built; code-index daemons still exit with their owner until that packet lands.
- tri-163 reframe: a read-only key_files reality crosswalk (declared vs on-disk plus code-graph) is offered as a defensible reframe, pending operator decision.
- tri-129 large-payload bound test: specified for follow-on once oversized-content and embedding behavior in the save path is verified.
- Pre-existing branch red test: `vector-shard-read-path-resilience > "does not double-schedule a pending shard repair"` was red at session start and remains so; unrelated to this session's changes and warrants a separate investigation.
