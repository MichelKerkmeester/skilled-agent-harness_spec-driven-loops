# Tri-System Deep Research — Synthesis

> **Program:** 50 angles, 50 read-only gpt-5.5 (high) iterations over system-spec-kit, system-skill-advisor, and system-code-graph, grounded in the 027 epic. 193 evidence-bearing findings plus 2 live-incident findings. All 103 P0/P1 claims were adjudicated by a 12-seat refute-first verification wave: **48 confirmed (3 P0, 45 P1), 53 downgraded to P2/P3, 2 refuted.** A later fresh-regression re-verification (2026-06-16) refuted all three code P0s against their full function bodies (see §1) — the only standing P0 is the live-incident cold-spawn daemon race. Machine-readable detail: `findings-registry.json`.

<!-- ANCHOR:confirmed-p0 -->
## 1. Confirmed P0

> **Re-verification (2026-06-16, fresh-regression remediation):** the three code P0s below were re-checked against the full function bodies and **refuted** — each cited guard already exists in live code. They are retained struck-through for trail integrity. The standing live-incident P0 (cold-spawn daemon races) is unaffected.

1. ~~**Same-path reindex-retire bypasses the source-kind guard** — `mcp_server/lib/storage/lineage-state.ts:1365-1381`~~ **REFUTED.** `retirePredecessorForActiveReindex` selects `source_kind` (`lineage-state.ts:1374`) and carries manual tiers forward via `RetiredPredecessorCarry` (`lineage-state.ts:1392-1395`, guard comment `:1386-1391`) before deprecating the predecessor; manual rows are not lost.
2. ~~**Feedback auto-promotion overwrites manual tier decisions** — `mcp_server/lib/search/auto-promotion.ts:140-146, 259-262`~~ **REFUTED.** `checkAutoPromotion` rejects manual source kinds (`auto-promotion.ts:178-186`) and the `UPDATE` excludes them in its `WHERE` clause (`auto-promotion.ts:273-278`); a human's tier choice cannot be silently overwritten.
3. ~~**`generate-context.js` lacks the fail-closed secret scrubber `memory_save` has** — `scripts/core/workflow.ts:1424+`~~ **REFUTED.** Lines `1424-1435` perform tree thinning, not persistence; `scrubWorkflowSavePayloadTextFields` runs before persistence (`workflow.ts:1492-1505`, function `:260-272`) scrubbing `contentSlug`, `rawCtxFilename`, `memoryTitle`, `memoryDescription`, `sessionData`, and `collectedData` — parity with the MCP save path.

The standing P0 from the live incident remains: **CLI cold-spawn races can produce multiple orphan daemons double-writing the memory DB** (two corruptions in 12 hours; needs daemon-side single-instance enforcement such as socket-bind-as-lock).
<!-- /ANCHOR:confirmed-p0 -->

<!-- ANCHOR:confirmed-p1 -->
## 2. Confirmed P1 by theme

**Idempotency (flag-ON blockers):** force retries reuse the receipt key across changed payloads; a concurrent changed-payload loser mutates instead of failing or replaying; `memory_update`'s lost-store path ignores the immutable winner. The flag must stay off until these land.

**Save-path parity and continuity:** `generate-context` no longer applies continuity content; `memory_save` and the CLI don't refresh packet metadata (`description.json`/`graph-metadata.json`) the way docs claim; the documented phase-parent `last_active_child` redirect is absent from the `session_resume` ladder; the official handover template doesn't match the handover parser's fields.

**Scoping and session trust:** a raw `specFolder` LIKE widens scoped retrieval; governed-ingest session boundaries are syntactic only; learning tools accept arbitrary `sessionId` targets; session-scoping docs overclaim `E_SESSION_SCOPE` coverage.

**Shadow/feedback machinery:** default-on shadow evaluation has no replayable query pool (post-PII) and its tests self-skip on the clean schema; feedback-retention shadow/blocked modes pause baseline TTL deletion; dry-run and apply read different signal sources; retention evidence is unreachable through the public sweep tool; the union promotion gate is policy text with no enforcing code; shadow telemetry is not durable enough to support the documented promotion criteria.

**Health/observability:** `memory_health` misses active `vec_<dim>` divergence (precisely the blind spot behind the 27-row residue in the recovery).

**Code-graph apply safety:** destructive apply operations can run without `confirm` outside hard-stale state (two distinct paths); `repair-nodes` reports success without the crash-root-cause acknowledgement and cannot actually reparse `parser_skip_list` entries; `rollback-bad-apply` snapshots the current DB before restoring; `prune-excludes` never receives its confidence artifact; the doctor YAML wires `detect_changes` with an invalid empty argument object.

**Code-graph daemon lifecycle:** mk-code-index leases omit the owner `socketPath` so divergent socket envs can't reconnect; its owner-lease heartbeat is non-periodic — both are gaps the spec-memory launcher already closed.

**Advisor:** the local scorer can override an explicitly named skill; the Python fallback substring-matches aliases; nothing refreshes `derived.last_updated_at` at runtime (and the v2 sync timestamp is invisible to the age haircut — the fix shipped this week reads a field nothing maintains); the hook brief misses score-only ambiguity; documented lane-weight env tuning is stripped by the launcher; `SPECKIT_ADVISOR_SHADOW_MODE` has no runtime reader; read-only graph status can mutate corrupt-DB state; `advisor_rebuild` can skip a corrupt SQLite when generation reads live; the routing-corpus scorer resolves the repo root one directory too high.

**Playbook/loop tooling:** the playbook runner counts vendored node_modules docs as scenarios; the release-readiness check doesn't prove linked coverage; deep-loop save phases reference an unwritten temp JSON; the deep-review memory-save protocol documents a rejected CLI mode.

**Doc truth:** the feature catalog claims broad write-ingress protection while two ingress paths remain excluded.
<!-- /ANCHOR:confirmed-p1 -->

<!-- ANCHOR:adjudication -->
## 3. Downgraded and refuted

53 claims were real-but-overstated (downgraded to P2/P3) — mostly doc-drift items where behavior is correct but prose lags, defensive-coding suggestions, and edge conditions requiring unusual states. 2 were refuted outright. 92 analyst-grade P2/P3 findings remain unadjudicated in the registry pool for opportunistic pickup. Per-claim verdicts with proofs: `findings-registry.json`.
<!-- /ANCHOR:adjudication -->

<!-- ANCHOR:recommendations -->
## 4. Recommended remediation order

1. **Security/safety lane (cold-spawn enforcement):** daemon-side single-instance lock for the live-incident race. The three code P0s in this lane were refuted on re-verification (§1) — the source-kind guards and scrubber parity already exist; no remediation needed there.
2. **Code-graph apply-safety lane:** confirm-gating on the destructive paths, honest repair-nodes reporting, rollback snapshot ordering.
3. **Idempotency flag-ON lane:** receipt key variance, loser replay, update-path winner respect — then enablement review.
4. **Lifecycle parity lane:** port the spec-memory launcher's lease/heartbeat/reconnect hardening to mk-code-index.
5. **Advisor correctness lane:** explicit-name override, alias substring, freshness maintenance for `derived.last_updated_at`, dead env readers.
6. **Save/continuity truth lane:** continuity application, metadata refresh, resume redirect, handover template/parser alignment.
7. **Shadow/feedback honesty lane:** either build the privacy-preserving replay pool and durable telemetry, or retire the promotion criteria prose until they are enforceable.
<!-- /ANCHOR:recommendations -->

<!-- ANCHOR:evidence -->
## 5. Evidence

Per-iteration reports in `iterations/iteration-001.md` … `iteration-050.md`; finding rows in `deltas/`; adjudication proofs embedded per finding in `findings-registry.json`. Primary cited sources span `mcp_server/lib/storage/lineage-state.ts`, `mcp_server/lib/search/auto-promotion.ts`, `scripts/core/workflow.ts`, the code-graph apply pipeline, and the advisor scorer/launcher pair.
<!-- /ANCHOR:evidence -->
