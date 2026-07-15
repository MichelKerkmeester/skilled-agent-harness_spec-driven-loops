---
title: "Deep-Review 017-021 Remediation: Search/Output Intelligence, Reindex Cancellation, Maintenance Grace and Cooperative Heavy Phases"
description: "A 50-pass multi-model deep review of 027/002 phases 017-021 returned four PASS and one CONDITIONAL with zero confirmed P0, one confirmed P1 and the rest P2 or doc-drift. The one P1 command-quoting exposure was hardened, five confirmed code defects across the 017 calibration cluster, 018 cancellation accuracy and 021 instrumentation were fixed, and the 017/019/020 scaffold-vs-shipped doc drift was reconciled. Typecheck clean, unit suites 30/30 to 58/58, strict validation green. A follow-on 30-pass gpt-5.5 broaden review then closed nine more fixes — headlined by a default-on cross-tenant retrieval scope leak in retrieval-rescue's Stage-2 injection path — plus a P0 regression test; the rebuilt dist was deployed to the live daemon and a durable wedged-daemon CLI-fallback rule was baked across the deep-loop and review agents."
trigger_phrases:
  - "005/006 deep review 017-021 remediation changelog"
  - "memory search ARGUMENTS quoting fix"
  - "017 021 instrumentation cancellation remediation"
  - "027/006 broaden round retrieval scope leak fix"
importance_tier: "important"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-18

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation` (Level 3)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement`

### Summary

After the 017-021 remediation closed, a 30-pass gpt-5.5-fast xhigh "broaden" review swept three dimensions the earlier passes had not centered — search/retrieval, store/index, and server infrastructure — and surfaced 52 findings. Eight refute-first verifiers triaged them to nine real fixes; the rest were by-design, default-off, or refuted. The headline was a default-on cross-tenant scope leak: `retrieval-rescue`'s Stage-2 lexical-backfill and sibling-injection path re-queried the index without re-applying the governance + `spec_folder` scope filter that the constitutional and community paths already perform, so a scoped search could smuggle cross-scope rows back in through the one injection path that skipped the re-filter. It was fixed and locked behind a new P0 scope-isolation regression test. The nine fixes landed in `55b977951d`, with the full disposition in `review-r2/broaden-synthesis.md` and the synthesis commit `0ac83c99ce`. This session then built the committed source into `dist/` and recycled the live spec-memory daemon onto it — closing the inert-until-recycle follow-up from the 2026-06-17 section — and shipped a durable wedged-daemon CLI-fallback rule across the deep-loop and review agents (`61b5aab102`).

### Changed

- **Search scope isolation.** `retrieval-rescue` re-applies the governance + `spec_folder` scope predicate to Stage-2-injected backfill and sibling rows; the community-fallback path filters members by `spec_folder` prefix; the summary lane pushes scope into SQL so the result cap applies after scoping, with a prefix-aware folder match and an active/expiry gate.
- **Ranking determinism.** `folderBoost` is now part of the rerank cache key — a same-query / different-boost call previously collided on a stale cached result — and its clamp ceiling was corrected from `1.0` to `100` to match the 0-100 similarity scale.
- **Public schema honesty.** `memory_search` gained `retrievalLevel` in its public schema with an accurate description, and `includeArchived` was reworded as the documented no-op it actually is.
- **Store / infra hygiene.** `memory_save` probes the filesystem path only after allowed-root validation; `hf-model-server` asserts socket-directory ownership on first bind; the memory-index stale-cleanup wraps the edge + row delete in a single transaction, row first; and `ENV_REFERENCE.md` drops the stale `tcp://` daemon-IPC claim (the transport is deliberately unix-socket only).
- **Agent resilience (wedged-daemon CLI-fallback).** A durable "NEVER block on a hung MCP call" rule was baked into the eight daemon-using sub-agents across all three runtime mirrors (`.opencode` / `.claude` / `.codex`). Bash-enabled agents (`deep-review`, `deep-research`, `review`, `debug`, `deep-improvement`) fall back to Grep/Read or the warm-daemon CLI front doors; Bash-denied agents (`context`, `deep-context`, `ai-council`) fall back to Grep/Read and report memory/graph unavailability rather than stalling. Committed in `61b5aab102`.

### Fixed

- **[P0] cross-tenant retrieval scope leak** (`lib/search/rerank/retrieval-rescue.ts`): the Stage-2 lexical-backfill and sibling fetches re-queried the index but skipped the scope re-filter that the constitutional and community injection paths run, so a scoped query could return rows outside its tenant / `spec_folder`. The scope predicate is now re-applied to every injected row and a P0 scope-isolation regression test pins the behavior.

### Verification

| Check | Result |
|-------|--------|
| Full package typecheck | PASS (0 errors) |
| Affected unit suites | 448 affected tests PASS + new P0 scope-isolation test |
| Regression baseline | 0 new failures vs known baseline; the 2 pre-existing failing files reproduce identically with the changes stashed |
| Live deploy | `dist/` rebuilt from the committed source; live spec-memory daemon recycled onto it and serving the fresh code (scope-fix present in compiled `retrieval-rescue.js`) |
| Agent-mirror parity | Pre-commit `agent-mirror-sync` gate confirmed all 8 agents' `.opencode` / `.claude` / `.codex` mirrors in sync |
| Refuted / deferred | `memory_delete` id+specFolder (id is a unique PK), session-proxy replay (rowid-idempotent), retention-sweep (logic inverted), atomic-save ordering (startup-recovered); soft-delete tombstone completion is default-off and maintainer-deferred → its own follow-on packet |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `lib/search/rerank/retrieval-rescue.ts` (+ vitest) | Modified | [P0] re-apply governance + `spec_folder` scope to Stage-2-injected rows; new scope-isolation regression test |
| `handlers/memory-search.ts` | Modified | Community-fallback member filtering by `spec_folder` prefix; `retrievalLevel` schema + `includeArchived` wording |
| `lib/search/memory-summaries.ts` | Modified | Scope pushed into SQL, prefix-aware folder match, active/expiry gate |
| `lib/search/pipeline/stage1-candidate-gen.ts`, `lib/search/pipeline/stage2-fusion.ts`, `lib/search/search-utils.ts` | Modified | `folderBoost` cache-key inclusion and clamp-ceiling correction |
| `handlers/memory-save.ts` | Modified | Probe path only after allowed-root validation |
| `handlers/memory-index.ts` | Modified | Single-transaction stale-cleanup (row-first) |
| `.opencode/bin/hf-model-server.cjs` | Modified | Socket-directory ownership assertion on first bind |
| `ENV_REFERENCE.md`, `tool-schemas.ts` | Modified | Drop `tcp://` IPC claim; schema description accuracy |
| 8 agents × 3 runtime mirrors | Modified | Durable wedged-daemon CLI-fallback rule (`61b5aab102`) |

### Follow-Ups

- The inert-until-recycle follow-up from the 2026-06-17 section is **closed**: `dist/` was rebuilt and the live daemon recycled onto it on 2026-06-18. The recycle was not transparent — the daemon child had been reparented to init (PPID 1) with no healthy lease-holder, so the SIGTERM took the shared daemon and its launchers down; it was recovered via a deliberate CLI-front-door cold-start, which left a properly-supervised launcher + daemon pair running the fresh dist.
- **Soft-delete tombstone completion** remains its own dedicated packet: `SPECKIT_SOFT_DELETE_TOMBSTONES` is default-off until recall/list/dedup paths filter `deleted_at IS NULL` (≈8 paths) and the tombstone child-cascade plus tests are in place.

## 2026-06-17

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation` (Level 3)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement`

### Summary

This phase closed the confirmed, code-verified findings from a 50-pass multi-model deep review (deepseek-v4-pro, mimo-v2.5-pro, kimi-k2.7, opus-4.8) of 027/002 phases 017-021 — search and output intelligence, reindex cancellation, maintenance-grace re-election, background embedding, and cooperative heavy phases. The review returned five verdicted syntheses, four PASS and one CONDITIONAL (017), with zero confirmed P0, one confirmed P1, and the remainder P2, doc-drift or test-debt. Every finding was carried into the remediation packet rather than triaged out; only the confirmed ones drove code changes. The single P1 — an unquoted `-- $ARGUMENTS` in the `/memory:search` argument-resolution header — was verified against the renderer's behavior before any edit, found to be a raw string-splice, and quote-hardened. The five confirmed code defects across the 017 calibration cluster, 018 cancellation accuracy and 021 instrumentation were fixed and unit-gated. The 017/019/020 scaffold-vs-shipped doc drift was reconciled to what shipped. The work landed in two commits: `4faff94927` (code, tests and the P1 quoting fix) and `4c14606d66` (the packet, the five syntheses and the 017/019/020 doc-drift reconciliation).

### Added

- `confidence-calibration.vitest.ts`, `job-store-cancel-lifecycle.vitest.ts`, `handler-memory-index-scan-jobs.vitest.ts`, `maintenance-marker.vitest.ts`, `request-quality-aggregation.vitest.ts` and `trigger-embedding-backfill.vitest.ts` coverage closing the missing-unit gaps the review named — the `processBatches` abort path, the `cancelledJobIds` Set lifecycle, the PAV equal-mean pooling, and the request-quality array-length invariant (+28 tests over baseline).
- The five per-folder syntheses for 017 through 021 under `027/002/review/synthesis/`, recording each phase's verdict, confirmed findings and rejected family so the remediation is traceable to its evidence.

### Changed

- 017 calibration cluster hardened in `lib/search/confidence-scoring.ts` and `lib/search/confidence-calibration.ts`: a module-load assertion now pins the `WEIGHT_HEURISTIC + WEIGHT_SCORE_PRIOR === 1.0` invariant that was comment-only, PAV isotonic regression pools adjacent equal-mean blocks with a drift-guard against the offline fit, the calibration-model cache invalidates on file mtime instead of keying on path alone, and the request-quality assessment guards against misaligned parallel arrays.
- 017 recovery-payload hygiene in `lib/search/recovery-payload.ts`: the SQL parameter array is built programmatically from the clause list rather than hand-spread, and the `classifyStatus` final fallback is made explicit.
- The `/memory:search` §0 argument-resolution header in `commands/memory/search.md` now single-quotes the `$ARGUMENTS` substitution, since the renderer was confirmed — binary inspection plus a live probe — to perform a raw string-splice rather than shell-quoting into one token.
- 019/020 doc drift reconciled to shipped reality: the non-existent `mcp_server/bin/...` paths corrected to `.opencode/bin/...`, the maintenance-marker schema documented as `labels[]` (reference-counted, supersedes the stale `jobId` shape), and the marker TTL documented as 180s (was 60s). 017's seven children and the parent advanced from scaffold to shipped, with `completion_pct` moving 0 to 100.

### Fixed

- **[P1] command-contract `$ARGUMENTS` shell exposure** (`commands/memory/search.md`): the unquoted trailing substitution let a query containing shell metacharacters reach the outer shell's glob and command-substitution phase. The renderer was verified to splice raw, so the substitution is now single-quoted and a query containing `*`, `$(…)`, backticks, `;`, `|`, `&` or `>` resolves to the verbatim typed string. A residual remains: a query containing an embedded single quote still needs a renderer-level argv fix; the exposure is bounded to self-injection and is documented.
- **021 empty-files scan branch** (`handlers/memory-index.ts`): the tail phases on the empty-files path were not wrapped in `timedPhase`, so they emitted no per-phase timing log and skipped the per-phase marker refresh that the main path performs. They are now wrapped, restoring instrumentation and marker-refresh symmetry across both reachable paths, and the near-duplicate-repair count that the other phases capture is now recorded rather than discarded.
- **018 `cancelledJobIds` Set leak** (`lib/ops/job-store.ts`): the cancel-tracking Set was never cleared on a terminal `setJobState`, so a cancel-then-fail-while-running entry could persist. The Set is now cleared on every terminal transition, making the "cannot grow without bound" comment literally true. In the same phase, a `'cancelled'` file is now counted distinctly in `handlers/memory-index.ts` instead of falling through to the failure count.
- **021 cancelled-run pending under-report** (`lib/search/trigger-embedding-backfill.ts`): a cancelled trigger-embedding run returned `pendingRemaining`/`pendingRows` as zero because the populated counts land only after the cancel returns. The counts are now recomputed before the cancel path returns so a cancel does not hide committed-but-pending work.
- **020 test-reset on-disk marker** (`lib/storage/maintenance-marker.ts`): `__resetMaintenanceMarkerForTest` cleared the timer and in-memory state but left the on-disk `.maintenance-active.json` behind, leaking state across tests. The reset now removes the on-disk marker.

### Verification

| Check | Result |
|-------|--------|
| Full package typecheck | PASS (0 errors) |
| Unit suites (touched + new) | Baseline 30/30 green → 58/58 green (+28 tests, 0 regressions) |
| Stress suites | 5 suites / 28 tests PASS |
| `validate.sh --strict` on the remediation packet | PASSED (exit 0) |
| `validate.sh --strict` on reconciled 017, 019, 020 | PASSED (exit 0) |
| P1 renderer behavior | Confirmed raw string-splice by binary inspection + live probe before any edit (severity-lock honored) |
| Confirmed-vs-carried separation | Five code defects fixed as confirmed; refuted/already-resolved findings (018 post-restart fast-cancel, 020 atomic-write-throw family, 021 deploy-lag) carried as hardening only, not implemented as fixes |
| Comment hygiene on all changed code | PASS (no finding/ADR/REQ/CHK ids or spec paths) |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `commands/memory/search.md` | Modified | [P1] single-quote the `$ARGUMENTS` substitution after confirming the raw renderer splice |
| `lib/search/confidence-scoring.ts` | Modified | Weight-sum assertion; calibration-cache mtime invalidation; request-quality array guard |
| `lib/search/confidence-calibration.ts` | Modified | PAV equal-mean pooling + drift-guard |
| `lib/search/recovery-payload.ts` | Modified | Programmatic SQL param array; explicit classifyStatus fallback |
| `lib/ops/job-store.ts` | Modified | Clear `cancelledJobIds` on terminal `setJobState` |
| `handlers/memory-index.ts` | Modified | Wrap empty-files tail phases in `timedPhase`; capture near-dup count; count `'cancelled'` distinctly |
| `lib/search/trigger-embedding-backfill.ts` | Modified | Recompute pending counts before cancel returns |
| `lib/storage/maintenance-marker.ts` | Modified | Remove on-disk marker in the test-reset helper |
| Six new vitest files | Created | Abort-path, cancel-Set-lifecycle, scan-jobs, marker, request-quality and trigger-backfill coverage (+28 tests) |
| 017 (7 children + parent), 019, 020 docs + 5 syntheses | Modified/Created | Scaffold-to-shipped reconciliation, path/schema/TTL corrections, verdicted syntheses |

### Follow-Ups

- The P1 residual is a renderer-level argv fix: a `/memory:search` query containing an embedded single quote still breaks the single-quote escaping, because the renderer splices the raw string rather than passing arguments as a quoted argv vector. The exposure is bounded to self-injection and documented; the durable fix belongs in the renderer, not the command template.
- The code fixes are committed and the dist is built, but they are inert until the live spec-memory daemon is recycled to adopt the rebuilt dist. Until that transparent recycle runs, the running daemon serves the pre-fix code.
