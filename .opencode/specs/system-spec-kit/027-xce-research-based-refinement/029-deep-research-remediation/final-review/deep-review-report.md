# 029 Program — 15-Seat Multi-Model Deep Review

**Verdict: CONDITIONAL PASS.** No P0. The security and concurrency floors are independently confirmed solid; the destructive apply-pipeline core, the single-writer DB lock, the secret scrubber's fail-closed contract, and the tri-029 prune blast-radius are all sound. The review surfaced **18 P1 + 33 P2** — overwhelmingly honesty/completeness edges and incomplete corners of the verify-first fixes, not core defects. One P1 (a narrow secret-leak in the scrubber regex) has real production impact and is the only must-fix-now item; the rest are flag-gated, doc-honesty, test-gap, or finish-the-edge work.

Seats: 5× Opus 4.8 (claude2), 5× GPT-5.5 high, 3× DeepSeek v4 Pro (max thinking), 2× MiMo v2.5 Pro (high) — all read-only, orchestrator-reduced. Per-seat raw output: the run logs; consolidated registry below.

## Floors confirmed (independent multi-seat agreement)
- **Security (ds-1):** scrubber fail-closed at all call sites, fingerprint hash-only (legacy prefixes purged), DB lock kernel-fcntl with self-lease guard, idempotency loser carries a visible conflict block, advisor `--trusted` gates enforced, warm-only exits honor 75. No bypass found.
- **Concurrency (ds-2):** lock acquire/release ordering, `ON CONFLICT DO NOTHING`, reconnect/exit-86 — no race P0/P1. Residual lease-cleanup TOCTOU is already acknowledged in-code as a deliberate sub-syscall tradeoff.
- **Apply pipeline (opus-4):** operator destructive ops gated pre-snapshot; `previewRollbackTarget` shares the live selector; retention is post-commit with protected dirs; the tri-029 default artifact is a pure tier-lookup that injects no patterns (blast radius contained).
- **tri-031 adjudicated → HONEST-DOC:** the parser early-sentinel + `recordSuccess` no-op are deliberate anti-self-heal invariants; a retry path would contradict them. Fix the schema to say repair-nodes triages/reports skip-list candidates, don't add retry.

## P1 registry (grouped; file:line + fix)

### A. Secret leak — TOP PRIORITY (only live-impacting item)
- **A1 (opus-2, borderline-P0)** `shared/parsing/secret-scrubber.ts:57` (+google :84): AWS/Google keys ending in `/ + = -` followed by a non-word terminator are NOT redacted (trailing `\b` can't fire, fixed-length blocks backtrack). Probe: `aws_secret_access_key=…/`+newline → 0 redactions, full key persisted durably. ~3% AWS / ~1.5% Google. Fix: drop trailing `\b` / negative-lookahead `(?![A-Za-z0-9/+=])`; add trailing-char regression cases.
- **A2 (ds-3)** `lib/errors/core.ts:198`: `userFriendlyError` `console.error`s the raw unsanitized `error.message` (may carry prompt/paths/keys), bypassing `sanitizeErrorField`. Fix: sanitize/redact before logging.

### B. Finish-the-edge — gaps the review found in this program's own fixes (clean)
- **B1 (gpt-2, tri-038)** `mk-skill-advisor-launcher.cjs:116`: `CHILD_ENV_ALLOWLIST` missing `SPECKIT_ADVISOR_LANE_SHADOW_WEIGHTS_JSON` (read + documented). Add it + bootstrap test.
- **B2 (gpt-2, tri-172)** `validate.ts:163`: derived-freshness only warns on a *stale* `sanitizer_version`, not missing/non-string. Warn whenever `!== current`.
- **B3 (opus-5, tri-189)** `spec-doc-paths.ts:209-218`: `extractSpecFolderFromSpecDocumentPath` lacks a review-report parent-strip → `<pkg>/review/review-report.md` → phantom `<pkg>/review` spec folder. Mirror the research branch.
- **B4 (opus-5, tri-189)** `memory-types.ts:421-433`: `inferDocumentTypeFromPath` omits `review_report` → persists as `'memory'` (weight 0.5 vs 0.6). Add to `BASENAME_BY_DOCUMENT_TYPE` + weight/tier maps.
- **B5 (gpt-1, tri-033/034)** `skill_advisor.py:2009`: `_matches_phrase_boundary` treats `-`/`_` as boundaries → `sk-code-reviewer` false-matches `sk-code` as explicit. Make matching identifier-aware / longest-id-first.
- **B6 (gpt-5, tri-169)** `sk-git/SKILL.md:145`: `noisy_hits` still uses `term in task_text` (substring) not `keyword_present()`. Convert.
- **B7 (gpt-4, tri-161)** `index-scope-policy.ts:177`: `buildLabel` collapses `includeSkills:['sk-code']` and `:true` to the same label. Distinguish allowlist from all.
- **B8 (ds-3, tri-029)** `exclude-rule-classifier.ts:128-140`: prune-excludes silently no-ops when the default artifact is missing + patterns provided ('committed', nothing excluded). Warn/error.

### C. Advisor surface & corruption interlock
- **C1 (opus-1, tri-040/041)** `advisor-status.ts:204`: integrity probe path (caller `workspaceRoot`) can diverge from the writer path (`process.cwd()`) → probe checks wrong/absent file → corrupt DB skips rebuild (fail-open). Probe via the writer's resolver; read the env override live.
- **C2 (ds-3, tri-041)** `advisor-recommend.ts:309` + `advisor-server.ts:143`: recommend path omits `checkArtifactIntegrity` → corrupt DB serves recommendations as 'live'. Cheap/cached integrity on recommend (check once per generation, or only when otherwise 'live').
- **C3 (gpt-3, tri-098)** `advisor-recommend.ts:17`: descriptor + CLI manifest reject `confidenceThreshold`/`uncertaintyThreshold` the handler accepts (CLI exit 64). Add them; add a descriptor-vs-handler-schema parity test (the manifest parity test only proves descriptor==manifest).
- **C4 (gpt-3)** `mk-skill-advisor-bridge.mjs:623`: CLI fallback sends only `topK/...`, so the scorer uses default thresholds while metadata claims caller-supplied. Thread thresholds through (depends on C3).
- **C5 (gpt-4)** `status.ts:228`: code-graph `activeScope` derived from stored fingerprint not `resolveIndexScopePolicy()` → `scopeMismatch` never fires. Compute from resolved.

### D. Apply-pipeline refusal/failure honesty
- **D1 (opus-4, KEY)** `apply-orchestrator.ts:312`: confirm-gate INVERTED — prune medium/low + repair in-dispatch refusals throw into the rollback catch, so omitting `confirm` triggers triplet churn + full reindex and reports 'rolled-back' (more destructive than confirming). Hoist to pre-snapshot gates; return 'aborted' + requiredAction.
- **D2 (opus-4, F2)** `apply-orchestrator.ts:537`: ignores `recovery.status`/`restored`; always 'rollback executed' even on a failed recovery (live triplet stuck in quarantine). Inspect status → 'rollback-failed' + requiredAction.
- **D3 (opus-4, tri-031)** `tool-schemas.ts:161`: repair-nodes schema claims a re-parse the code can't do. Rewrite to triage/report; drop the misleading `scan({incremental:true})`.

### E. Idempotency flag-ON (all gated SPECKIT_MEMORY_IDEMPOTENCY, default OFF)
- **E1 (opus-3)** `memory-save.ts:3483`: A→B→A revert — contentHash receipt replays the cached response before re-index → disk≠index (search serves wrong content); reconciler `classifyRetryVsContent` is dead/unwired. Verify live index matches receipt content_hash before honoring replay.
- **E2 (opus-3)** `memory-save.ts:3476` (+`memory-crud-update.ts:243`): execution-mode flags in the conflict-payload but not the fingerprint → benign flag-flip re-save → hard `idempotency_key_conflict`. Restrict conflict-payload to fingerprint fields or promote the flags.

### F. Eval/battery honesty
- **F1 (gpt-5, tri-158)** `gold-query-verifier.ts:327`: `executeBattery` always runs `outline`, never uses `query`/`expected_count` → broken query/ranking passes. Execute real query semantics + assert, or remove the unused fields.

## P2 summary (33)
- **Systemic comment-hygiene cluster (largest):** forbidden tracking ids in code comments across ~15 files — `C1/C2/H5 FIX` (vector-index-store/schema, composite-scoring), `CHK-069/070` (corrections — one leaks into an API reason string), `F0xx`/`F07-xxx`/`F04-xxx`/`FIX-009-v3`/`REQ-D1-001`/`G-NEW-2`/`SK-004`/`BUG-04` (memory-save, reconsolidation, context-server, session-resume, tree-sitter-parser, query-intent-classifier, rrf-fusion, consumption-logger, code-graph-tools, tool-schemas, …). The pre-commit gate is not catching these. → dedicated cleanup sweep.
- **Test gaps:** handler-level idempotency integration (E1/E2 invisible to CI), apply-pipeline refusal-churn + failed-recovery honesty paths, descriptor-vs-handler parity.
- **Doc/threat-model:** fingerprint "non-reversible" overstated for low-entropy queries (64-bit truncated, no salt); confirm tool-schema omits the prune medium-tier requirement.
- **Minor refinements:** tri-040 status still creates the DB via `getDb()` (use `getDbReadOnly()`); `SecretScrubberError` missing `Object.setPrototypeOf`; operator-rollback known-good snapshot can be re-restored by a second rollback; acknowledged lease-cleanup TOCTOU.

## Round-2 remediation plan (priority order)
1. **Wave A — secret leak (now):** A1 scrubber regex + tests, A2 error-log sanitization, plus `SecretScrubberError` prototype.
2. **Wave B — finish-the-edge (clean, high-confidence):** B1–B8 complete the tri-038/172/189/033/169/161/029 fixes.
3. **Wave C — advisor surface/interlock:** C1–C5.
4. **Wave D — apply-pipeline honesty:** D1 (gate inversion), D2 (recovery status), D3 (tri-031 schema), + the pipeline-safety tests.
5. **Wave E — idempotency flag-ON (careful, blocks safe enablement):** E1/E2 + handler-level tests.
6. **Wave F — comment-hygiene sweep + battery semantics (F1).**

Each wave gets a fresh gpt-5.5 xhigh read-only verification before commit (Fable 5 retired). The held tri-022 (durable shadow telemetry) commits with Wave B.
