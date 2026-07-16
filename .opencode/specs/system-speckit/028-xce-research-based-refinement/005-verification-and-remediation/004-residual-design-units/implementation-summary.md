---
title: "Implementation Summary: Residual 029 Design Units"
description: "Three residual 029 design units resolved: Unit A vector reconcile, Unit B synthetic replay corpus, and the L9/L2 tail shipped and committed; Unit C launcher port documented-as-staged-follow-on; tri-163 refuted; tri-129 deferred; tri-135 already-correct. Built via claude2 Opus 4.8 xhigh seats with orchestrator verify + scoped commits."
trigger_phrases:
  - "residual design units summary"
  - "030 implementation summary"
  - "030 completion state"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-xce-research-based-refinement/005-verification-and-remediation/004-residual-design-units"
    last_updated_at: "2026-06-13T17:40:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Shipped units A/B + tail; Unit C documented; tri-163/129/135 disposed"
    next_safe_action: "Operator decision on optional follow-ons; push branch"
    blockers: []
    key_files:
      - "spec.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:b3db1ff916fb4c6f23bce7c21683241320a90f4d5e406396002455b735916221"
      session_id: "030-implement-2026-06-13"
      parent_session_id: "030-scaffold-populate-2026-06-13"
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 030-residual-design-units |
| **Completed** | Built units committed; dispositions recorded; optional follow-ons flagged |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Every residual unit was driven verify-first: each finding was re-confirmed against current code before any change, and several resolved as already-correct, refuted, or covered-in-aggregate rather than as new code. Three units shipped as code; the rest carry verified dispositions.

### Shipped (committed on branch 028-mcp-to-cli-tool-transition)

- **Unit A — Vector storage truth (tri-105).** The success-coverage divergence was reconciled behind an online backup with the daemon warm: 91 success-missing-active-vector rows reset to retry (re-embedding converged), the separate retry-all-failures op deliberately skipped. Shipped last session.
- **Unit B — Synthetic replay corpus (tri-007/009/103).** The shadow-evaluation cycle skipped every run because the clean consumption_log keeps no raw query text. A privacy-preserving synthetic corpus now builds from non-reversible signals (intent enum, coarse result-count bucket, counted-never-decoded query_hash); every synthetic query is drawn verbatim from the static intent seed vocabulary, with a fail-closed `assertCorpusPrivacy` guard. A SENTINEL test locks the no-raw-text invariant. The synthetic replay passes a null relevance query so labels come from memory-id aggregation, never a text match.
- **tri-138 — memory_health token budget.** The report exceeded its 1000-token budget (advisory hint only, no data lost). Re-tiered to a per-tool 1500 budget and gated the near-static `exclusionAudit.entries` behind the existing `includeFullReport` flag. `data.routing` is byte-for-byte unchanged (pinned by tests and the /doctor read contract).
- **tri-109 — background memory_index_scan.** The ingest job-queue's lifecycle (not its per-file worker) was generalized into a kind-agnostic `maintenance_jobs` store; `memory_index_scan` gained an opt-in `background` flag plus `memory_index_scan_status`/`_cancel` (tool surface 37 to 39). The synchronous default path is unchanged.
- **L9/L2 tail (prior + this session).** tri-117 (graph value metrics), tri-111 (crash-probe receipt), tri-108/113/121/122/158, and the already-correct re-confirmations all landed or were verified.

### Disposed (verified, no code shipped)

- **Unit C — Launcher parity (tri-148): DOCUMENT-as-staged-follow-on (REQ-003 document branch).** Verify-first found the divergence is deeper than porting an exit handler: spec-memory uses a proxy launcher over a socket-only detachable backend, while code-index is a thin shim over an inherit-stdio, dual-transport, tethered daemon with an idle self-exit. True adoption requires a daemon backend-only mode plus idle-monitor adoption-grace (C.2) and owner-proxy + supervision wiring (C.3) behind a default-off flag — a multi-stage, launcher-critical change that is inert until a fresh session and cannot be verified in-session. The verified staged plan (gate harness, then daemon mode, then launcher wiring) and risk register are the deliverable; the launcher mutation is a follow-on packet, not a design-unit.
- **tri-163 — key_files <-> COVERED_BY crosswalk: REFUTED.** `COVERED_BY` is a deep-loop context-sweep relation (SLICE-based, ephemeral, in a separate `deep-loop-graph.sqlite`), not a spec-to-file edge; it is absent from the code-graph and spec-memory subsystems. A literal crosswalk against `key_files` is a category mismatch. A read-only "key_files reality crosswalk" (declared vs on-disk + code-graph) is a defensible reframe, offered for decision, not auto-built.
- **tri-129 — write-path stress harness: DEFER (covered in aggregate).** Six existing stress/durability suites plus the job-queue policy already guard the constituent risks (concurrent saves, single-writer admission, scrub-under-flood, contention, crash-recovery mid-write). The one genuine zero-coverage gap is large-payload bound; the cheapest add (a `large-payload-save-bound-stress` test in `stress_test/substrate/`) is specified for follow-on but not built, because its correct assertion depends on the save path's oversized-content/embedding behavior, which warrants verification first.
- **tri-135 — live-dimension eval harness: ALREADY-CORRECT.** `eval_run_ablation` already evaluates against the live embedding profile/dimension (`eval-reporting.ts` uses the live provider and `withAblationDb` defaults to the active profile DB) and reports quality deltas. Only a cross-profile A/B remains, which is a distinct, separately-deferrable item.

### Files Changed (this session)

| Commit | Scope |
|--------|-------|
| tri-138 | layer-definitions.ts, tool-schemas.ts, memory-crud-health.ts, handler-memory-crud.vitest.ts |
| tri-109 | 18 files: lib/ops/{job-store,sqlite-busy-retry}.ts, memory-index-scan-jobs.ts, memory-index.ts, memory-ingest.ts, job-queue.ts, registration + 2 count guards + ownership map + 2 new test files |
| Unit B | lib/feedback/{shadow-replay-corpus,replay-seed-vocab}.ts, intent-classifier.ts, shadow-evaluation-runtime.ts, 2 test files |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Work was dispatched to parallel claude2 Opus 4.8 xhigh seats: read-only verify-first design seats for every unit, then hard-fenced write seats (tri-109, Unit B) that implemented against the verified designs and self-verified. The orchestrator independently re-verified each result before committing — scope, comment hygiene, typecheck, and the relevant test suites re-run locally, never trusting a seat's self-report — and made all scoped commits. tri-138 was hand-implemented. Each unit's design seat re-confirmed the finding still-real against current code first; that verify-first pass is what surfaced the tri-163 refutation, the tri-135 already-correct, and the tri-129 covered-in-aggregate verdicts.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| tri-163 refuted, not substituted | The named mechanism (COVERED_BY linking spec to files) does not exist; building a different crosswalk without sign-off would be a silent substitution. The reframe is offered as a decision. |
| Unit C documented, launcher not mutated | The full adoption port is multi-stage and launcher-critical (3x historical dual-writer corruption is the risk class), inert until a fresh session, and unverifiable in-session — a follow-on packet, which REQ-003 explicitly permits. |
| tri-129 deferred over speculative build | The constituent risks are covered by six existing suites; the one gap's correct assertion depends on unverified oversized-content behavior, so an honest deferral with a ready spec beats a speculative test. |
| Hand-fence write seats + orchestrator re-verify | Storage/privacy/launcher-adjacent code is high-stakes; the privacy invariant and backward-compat are mechanically gated and re-run locally before commit. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| tri-138: typecheck + handler-memory-crud (routing pin) + token-budget + budget-enforcement + degradedVector suites | PASS (typecheck 0; all green) |
| tri-109: typecheck + 9 suites (job-store, scan-jobs, async-scan backward-compat, both ingest, parity/context-server count guards, ownership lint) | PASS (typecheck 0; 445 tests) |
| Unit B: typecheck + privacy (SENTINEL) + runtime suites | PASS (typecheck 0; 6 tests) |
| Comment hygiene on all changed code | PASS (no finding/ADR/REQ/CHK ids or spec paths) |
| Scoped commits, no database/ runtime files staged | PASS (verified per commit) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Unit B post-review hardening (resolved).** A gpt-5.5 code review found two issues, both fixed. The SQLite hash-bucket cast resolved to 0 so seed selection was degenerate. The bucket now derives from the first hex nibble and varies by fingerprint. The privacy guard also missed the legacy `query_text` field name. It is now an own-key allowlist that fails closed on any field beyond the closed class shape, locked by a new test.
2. **Unit C launcher port is a follow-on packet.** The gate harness and the C.2 daemon-mode / C.3 launcher-wiring changes are specified but not built; code-index daemons still die with their owner until that lands.
3. **Two pre-existing red tests on this branch (not introduced here, surfaced honestly).** (a) `vector-shard-read-path-resilience > "does not double-schedule a pending shard repair"` — proven red at session-start (`ac22c52fde`) via an isolated worktree; a repair never reaches healthy; reverting this session's vector-index-store changes does not fix it (plausibly the live-237 single-writer DB lock, which predates the session). (b) `handler-memory-index-async-scan` was red at HEAD (its scope-governance mock omitted `requiresGovernedIngest`, which `memory-index.ts:360` calls) — fixed incidentally as part of tri-109 with a one-line non-semantic mock stub. Both warrant a separate decision.
4. **Optional follow-ons pending operator decision:** the tri-163 reframe (key_files reality crosswalk), the tri-129 large-payload bound test, the Unit C launcher port packet, and investigating the shard-repair pre-existing failure.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
