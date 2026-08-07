# L7 Still-Real Batch Verification — Shadow/Feedback Honesty (19 findings)

**Verified:** 2026-06-12 · fresh verifier, all citations re-read from current code
**Result: 19/19 STILL-REAL** (0 moved, 0 overtaken, 0 refuted)

The recent shipped changes (hash-only consumption fingerprints + legacy `prefix:hash` purge at `consumption-logger.ts:170-175`, clean-schema `query_text` probe returning `[]` at `shadow-evaluation-runtime.ts:204-211`, idempotency receipt TTL sweep at `idempotency-receipts.ts:225-227`) are the changes these findings already accounted for — none overturns a finding. Two findings carry material nuance (tri-012, tri-133) noted below.

## Summary Table

| ID | P | Verdict | Fix class | Interlock |
|---|---|---|---|---|
| tri-007 | P1 | STILL-REAL | code-careful | A (replay pool) |
| tri-008 | P1 | STILL-REAL | code-small | A |
| tri-009 | P1 | STILL-REAL | code-careful / doc-only | A |
| tri-011 | P1 | STILL-REAL | code-careful / doc-only | C (shadow pause) |
| tri-012 | P1 | STILL-REAL (nuance) | code-careful | B + C |
| tri-023 | P1 | STILL-REAL | doc-only (retire prose) / code-careful | B (promotion prose) |
| tri-051 | P2 | STILL-REAL | doc-only | A |
| tri-072 | P2 | STILL-REAL | code-small | — |
| tri-073 | P2 | STILL-REAL | code-careful | — |
| tri-101 | P2 | STILL-REAL | doc-only (+ dead-code trim) | — |
| tri-103 | P2 | STILL-REAL | code-careful | A (constructive arm) |
| tri-112 | P2 | STILL-REAL | doc-only | — |
| tri-115 | P2 | STILL-REAL | code-small | C |
| tri-119 | P2 | STILL-REAL | code-small | — |
| tri-133 | P2 | STILL-REAL (narrowed) | doc-only / code-small | B |
| tri-136 | P2 | STILL-REAL | doc-only / code-careful | C |
| tri-137 | P2 | STILL-REAL | doc-only | — |
| tri-152 | P2 | STILL-REAL | doc-only (+ ops move) | — |
| tri-153 | P2 | STILL-REAL | doc-only | — |

All paths below are relative to `.opencode/skills/system-spec-kit/` unless prefixed with `.opencode/specs/`.

## Interlocks

- **Interlock A — replay-pool starvation (tri-007, tri-008, tri-009, tri-051, tri-103).** One design decision resolves five findings: either build the privacy-preserving replay pool (tri-103's building blocks: hashed consumption classes, curated `eval_queries`, feedback labels) or formally document scheduled production replay as disabled (tri-051 doc fix) and accept that `SPECKIT_SHADOW_FEEDBACK` default-on produces no promotion evidence. tri-008's test split follows whichever way is chosen. Choosing the doc-only arm converts tri-007/tri-009 from code-careful to doc-only.
- **Interlock B — unenforceable promotion prose (tri-023, tri-133; tri-012 adjacent).** The 004 spec claims code-enforced gates ("union stays blocked until evidence passes"; "semantic stage runs only when lexical is empty/weak") that the code does not enforce for union promotion or shadow activation. RETIRING the prose — rewording both claims as operator policy / observation-mode criteria — closes tri-023 and tri-133 doc-only, with no new telemetry. Building actual evidence gates instead is code-careful and would also need tri-012's public evidence path. Recommend the retire arm: the union gate is an operator rollout decision, not a runtime invariant the code ever had.
- **Interlock C — retention shadow pause (tri-011, tri-136, tri-115, tri-012).** One decision: is feedback-retention shadow mode a documented *sweep pause* (doc-only: update `feature_catalog/maintenance/memory-retention-sweep.md` + 005 docs) or a transparent *overlay* (code-careful: record audits, then fall through to the baseline TTL delete path)? tri-011 and tri-136 are the same code behavior viewed as bug vs. doc drift — they must resolve together, in one direction. tri-115 (expose `feedbackRetention`/`extendedIds` in the MCP response) is a small independent code fix valuable under either arm.

## Per-Item Notes

### tri-007 (P1) — STILL-REAL
`lib/telemetry/consumption-logger.ts:144-158` creates the clean schema (`query_hash` only, no `query_text`; old tables dropped at 131-142). `lib/feedback/shadow-evaluation-runtime.ts:204-211` returns `[]` when the `query_text` column is absent — the in-code comment (204-207) explicitly says "Until a privacy-preserving replay pool exists, an empty pool (cycle skipped) is the correct outcome". `:423-427` skips the cycle with only a `console.warn`. The feature is still default-on: `lib/search/search-flags.ts:529-532` (`SPECKIT_SHADOW_FEEDBACK` default TRUE, graduated).
**Risk:** a graduated default-on evaluation feature silently never evaluates on any clean-schema install, so promotion evidence for adaptive ranking can never accumulate. **Fix class:** code-careful (replay pool, Interlock A) — or doc-only if the starvation arm is chosen.

### tri-008 (P1) — STILL-REAL
`tests/shadow-evaluation-runtime.vitest.ts:57-70`: `hasShadowEvaluationFixtureSchema()` probes an in-memory DB via `initConsumptionLog()` and gates the suite with `describe.skip` (line 70) unless `query_text` exists. Since `initConsumptionLog` now always produces the clean schema (and drops legacy `query_text` tables), the probe always returns false — the scheduler/replay suite is permanently skipped. Meanwhile `tests/consumption-logger-privacy.vitest.ts:59-63` asserts `query_text` must NOT exist.
**Risk:** zero live test coverage of the scheduler/replay logic in the architecture actually shipped; the skip gate is dead-schema nostalgia. **Fix class:** code-small (split into clean-schema starvation assertions + privacy-safe replay fixture; remove the skip gate). Follows Interlock A's outcome.

### tri-009 (P1) — STILL-REAL
Same root cause as tri-007 from the scheduled-runtime angle: `shadow-evaluation-runtime.ts:204-211` (empty pool) and `:423-427` (cycle skip) mean `runScheduledShadowEvaluationCycle` can never consume clean-schema telemetry. The catalog claim it contradicts is live: `feature_catalog/scoring-and-calibration/shadow-feedback-holdout-evaluation.md:20` still says it "runs the new ranking in parallel on a random 20% of queries" with a weekly scorecard, "Enabled by default" (line 24).
**Risk:** doc/runtime contradiction on a default-on feature. **Fix class:** doc-only if Interlock A starvation arm; code-careful if the pool is built. Dedup note: tri-007 (capability gap), tri-009 (scheduled path), tri-051 (doc drift) are three facets of one defect.

### tri-011 (P1) — STILL-REAL
`lib/governance/memory-retention-sweep.ts:458-484`: when `feedbackRetention.mode === 'shadow'` or `activeBlocked`, the sweep records audits and returns `swept: 0` — before `initHistory` (486) and the baseline TTL delete transaction (493+). Tests lock this in: `tests/feedback-reducers-integration.vitest.ts:211-237` and `:240-252` assert `swept: 0` and unchanged rows; `tests/memory-retention-feedback-learning.vitest.ts:141-168` ("shadow mode writes extend, protect, and delete audits without retention mutation"). The catalog (`feature_catalog/maintenance/memory-retention-sweep.md:18-20`) describes unconditional expiry deletion and never mentions the pause.
**Risk:** turning on a learning/audit flag silently suspends TTL enforcement — expired rows accumulate while operators believe retention is running. **Fix class:** code-careful (fall through to baseline sweep) or doc-only (declare the pause) — must resolve jointly with tri-136 (Interlock C).

### tri-012 (P1) — STILL-REAL (with nuance)
Schema layers are still dryRun-only: `tool-schemas.ts:506` (inputSchema has only `dryRun`), `schemas/tool-input-schemas.ts:336-338` (`memoryRetentionSweepSchema` = `{dryRun}`; strict by default per `:28-32`), `:622` (allowlist `['dryRun']`). Scheduler still passes only `{ dryRun: false }`: `lib/session/session-manager.ts:269` and `:277`. **Nuance/new:** the handler now forwards `feedbackRetention: args?.feedbackRetention` into the lib (`handlers/memory-retention-sweep.ts:41`) — plumbing exists, but the strict zod schema rejects the key before it ever reaches the handler, so the public evidence path is still unreachable. Library-side gating works (`memory-retention-feedback-learning.vitest.ts:183/:201/:248` exercise `shadowEvaluationPassed` source-only).
**Risk:** the docs' "active applies when caller supplies shadow-evaluation evidence" is unreachable through any public surface; the half-wired handler arg invites a future schema change that would accept caller-supplied raw evidence (untrusted promotion input). **Fix class:** code-careful — a stored receipt/gate-id, not raw caller signals (Interlocks B + C).

### tri-023 (P1) — STILL-REAL
`handlers/memory-triggers.ts:183-185`: union mode selected purely from `SPECKIT_SEMANTIC_TRIGGERS_MODE` env; `:541` assigns `results = mergedResults` with no promotion-evidence check anywhere on the path (the only gates are strong-lexical at 474 and weak-lexical at 485). Spec prose still claims a block: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/003-semantic-trigger-fallback/spec.md` promotion note ("Union stays blocked until false-positive, recall, latency, cost, and rollback evidence pass") and What-Needs-Done ("promote to union only on evidence").
**Risk:** any process started with both env vars gets result-affecting union behavior despite docs presenting the block as a safety gate; thresholds tuned for Voyage 1024d remain un-revalidated for the 768d Nomic profile. **Fix class:** doc-only (retire prose to operator policy — recommended, Interlock B) or code-careful (build an evidence gate).

### tri-051 (P2) — STILL-REAL
`feature_catalog/scoring-and-calibration/shadow-feedback-holdout-evaluation.md:18-24` still describes live weekly holdout replay over 20% of queries, "Enabled by default", results logged to `shadow_scoring_log`. `manual_testing_playbook/scoring-and-calibration/shadow-feedback-speckit-shadow-feedback.md:18-24` makes empty `shadow_scoring_log` a FAIL. Current code makes the empty pool the *correct* outcome (`shadow-evaluation-runtime.ts:204-211`, `:423-427`) — a correct install fails the manual test.
**Risk:** validators flag healthy behavior as broken; the catalog misrepresents production capability. **Fix class:** doc-only (Interlock A).

### tri-072 (P2) — STILL-REAL
`lib/feedback/session-trace-causal-reducer.ts:250-253`: dryRun records `reason: 'dry_run'` and `continue`s before `readExistingEdge` (`:255`), the `already_created` skip (`:256-259`), `insertEdge` (`:261-269`), and `manual_protected`/`insert_rejected` classification (`:271-281`). Shadow replay therefore cannot produce the guard evidence the 005/003 plan requires before active rollout.
**Risk:** shadow-evidence drift — promotion case for the causal reducer rests on replays that never exercised the guards. **Fix class:** code-small (move dryRun handling after read-only guard classification; return would-skip reasons without calling `insertEdge`).

### tri-073 (P2) — STILL-REAL
`lib/feedback/feedback-ledger.ts` `FEEDBACK_SCHEMA_SQL` (~128-140) has no uniqueness key; `logFeedbackEvent` inserts every event (`INSERT` at `:196`). `lib/feedback/batch-learning.ts:312-317` computes `weightedHitCount` from raw per-event counts (`data.strong` etc.); only sessions/queries are distinct-counted via Sets (`:321-322`). `lib/feedback/feedback-retention-reducer.ts:111` gates extend decisions on `weightedHitCount >= options.minWeightedHitCount`.
**Risk:** duplicate `result_cited` bursts (retries, replays) inflate `weightedHitCount` and can push rows into `extend` — exactly the inflated-signal path spec 005 (`spec.md:85-87`) said must be gated. Partially mitigated by distinct session/query counts, but the weighted gate itself is unguarded. **Fix class:** code-careful (dedup key or duplicate counter in `aggregateEvents`).

### tri-101 (P2) — STILL-REAL
`feature_catalog/mutation/memory-idempotency-receipts-and-near-duplicate-hints.md:27` still says replay carries `replayed:true`; `manual_testing_playbook/feature-flag-reference/memory-idempotency-replay-and-conflict.md:20` and `:48` make `replayed:true` an expected signal. Current code replays the stored response verbatim: `handlers/memory-save.ts:3483-3485` (`if (lookup.status === 'replay') return lookup.response;`) — no marker added. `before-vs-after.md:71` correctly states there is no marker. Wrinkle: dead plumbing exists (`handlers/save/types.ts:208`, `handlers/save/response-builder.ts:699-700` would copy `result.replayed`, but nothing ever sets it — replay bypasses the response builder entirely).
**Risk:** a correct implementation fails the manual test; the dead plumbing invites someone to "fix" the docs mismatch by setting the marker, breaking verbatim-replay semantics. **Fix class:** doc-only (update catalog + playbook to validate verbatim replay), optionally trim the dead `replayed` plumbing.

### tri-103 (P2) — STILL-REAL
Building blocks all present and unconnected: `lib/telemetry/consumption-logger.ts:346-353` groups hashed query classes (`getConsumptionPatterns`); `lib/eval/eval-db.ts:42-52` stores curated `eval_queries` with raw text in the separate eval DB; `lib/feedback/feedback-ledger.ts` holds query_id/memory_id labels. `shadow-evaluation-runtime.ts` contains zero references to `eval_queries` — its only source is the now-impossible `consumption_log.query_text`.
**Risk:** none directly (design-gap finding); this is the constructive arm of Interlock A. **Fix class:** code-careful (replay-pool abstraction sampling synthetic eval queries by hash/intent class, optional opt-in ephemeral ring buffer).

### tri-112 (P2) — STILL-REAL
`mcp_server/README.md:259` still says "Detection only with no auto-rebuild at this level"; root skill `README.md:922` still says the FTS shadow check "remains detect-only" — then contradicts itself at `:928-930` by documenting the default-on auto-heal. Code: `context-server.ts:381-382` auto-rebuilds unless `SPECKIT_BOOT_FTS_AUTOHEAL=0` (`DETECT-ONLY` log at `:410` only fires when opted out).
**Risk:** operators reading the guardrail docs expect degraded-but-untouched state after corruption; the server actually rewrites the FTS shadow at boot. **Fix class:** doc-only.

### tri-115 (P2) — STILL-REAL
Library result carries the diagnostics: `lib/governance/memory-retention-sweep.ts:79/:81` (type), `:454` `:482` (returns include `feedbackRetention`), `:478/:490+` (`extendedIds`). The MCP handler strips both: `handlers/memory-retention-sweep.ts:71-86` returns only swept/retained/dryRun/durationMs/candidates/deletedIds/protectedCount/protectedIds/ledgerRecorded.
**Risk:** operators cannot see feedback-retention decisions (mode, blocked state, extend/protect counts) from the tool they invoke; behavior is only inferable from audit tables. **Fix class:** code-small (sanitized `feedbackRetention` summary + `extendedIds` in success data when enabled; Interlock C).

### tri-119 (P2) — STILL-REAL
`tool-schemas.ts:490` exposes free-form `sessionId` on memory_validate. `handlers/checkpoints.ts:749` destructures it, `:776` uses it as the adaptive-signal `actor`, `:824-831` passes it into `recordUserSelection`; `lib/eval/ground-truth-feedback.ts:238-247` persists `session_id` verbatim. No trust validation on this path — `resolveTrustedSession` is wired into memory-triggers (`:348`), memory-context (`:1146`), and memory-search (`:831`) handlers, but not checkpoints.ts.
**Risk:** feedback/ground-truth telemetry can be attributed to arbitrary session labels, polluting evaluation data (not a retrieval IDOR — write-attribution only). **Fix class:** code-small (validate via `resolveTrustedSession` like the sibling handlers, or drop caller attribution).

### tri-133 (P2) — STILL-REAL (narrowed)
Spec prose unchanged: 004 `spec.md` §2 ("The semantic stage runs only when lexical is empty/weak") and What-Needs-Done ("Run the semantic stage only when lexical is empty/weak"). Code: the **union** path now does enforce the weak gate (`handlers/memory-triggers.ts:485` → `skipped_lexical_sufficient`), but the **shadow** path (`:561`) runs whenever `enabled && mode==='shadow' && !strongLexicalMatch` — no `isLexicalStageWeak` call — so shadow telemetry still includes lexically sufficient prompts. Narrower than the original framing (union side is fixed) but the documented activation criterion is still violated for shadow.
**Risk:** shadow telemetry skews toward lexically sufficient calls, biasing any promotion evidence built on it; results themselves unaffected. **Fix class:** doc-only (define shadow-observation criteria distinct from union criteria — fits Interlock B's prose retirement) or code-small (add the gate at `:561`).

### tri-136 (P2) — STILL-REAL
Same code as tri-011 (`memory-retention-sweep.ts:433-435` build, `:458-484` early return) viewed as operator-expectation drift: `tests/memory-retention-feedback-learning.vitest.ts:141-168` confirms shadow mode is a sweep *replacement* (audits written, `swept: 0`, `delete_after` untouched), not a transparent overlay, and no doc declares the pause.
**Risk:** as tri-011. **Fix class:** doc-only (document the pause) or code-careful (compose with baseline) — single joint decision with tri-011 (Interlock C).

### tri-137 (P2) — STILL-REAL
`feature_catalog/feature_catalog.md:3019` still says "Default OFF, set `SPECKIT_BATCH_LEARNED_FEEDBACK=true` to enable". Code and current references say ON: `lib/search/search-flags.ts:603-606` (default TRUE, graduated), `mcp_server/ENV_REFERENCE.md:89` and `:359`, `references/config/environment_variables.md:289`.
**Risk:** operators trusting the aggregate catalog believe startup batch-learning audit writes are opt-in when they run by default. **Fix class:** doc-only (fix catalog line; longer-term, single generated source for flag defaults).

### tri-152 (P2) — STILL-REAL
`mcp_server/database/README.md:23` (bullet: pre-migration safety copies and quarantined corrupt DBs live "under `backups/`") and `:31` (backups/ paragraph) describe a lifecycle the runtime directory contradicts: `database/` root currently holds `context-index.sqlite.corrupt-20260606` (373M), `.corrupt-20260612` (465M), `.corrupt-20260612b` (443M), `.pre-repair-20260611` (422M), `.pre-repair-20260612` (465M) — ~2.1GB beside the live DB — while `database/backups/` contains only its README. `backups/README.md:71-79` retention rules govern an empty folder.
**Risk:** operators following the documented retention/cleanup procedure never find the actual large artifacts; disk bloat goes unmanaged. **Fix class:** doc-only (document root-level `.corrupt-*`/`.pre-repair-*` naming + prune rule) and/or ops move into `backups/`.

### tri-153 (P2) — STILL-REAL
`mcp_server/database/vectors/README.md:23` still says "Legacy and experimental shards get deleted once they fall out of the active rotation. This folder is not an archive." The resilience code deliberately retains quarantine triplets: `lib/search/vector-index-store.ts:618-651` (`has_orphan_vector_shard_quarantine`, `build_vector_shard_quarantine_path`) renames bad shards to `.quarantined-*`; the folder currently holds an 80M `context-vectors__ollama__...sqlite.quarantined-20260611T205438888Z-2628` triplet with no documented pruning rule.
**Risk:** the folder becomes an undocumented archive; operators have no safe-prune guidance for quarantined shards. **Fix class:** doc-only (document quarantine lifecycle + prune-after-repair rule).
