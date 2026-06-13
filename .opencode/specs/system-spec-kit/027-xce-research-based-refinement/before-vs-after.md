# What Changed in Spec Kit Memory: The 027 Refinement

> Research-derived hardening for the memory system and the Spec Kit workflow. Every feature that affects results ships default-off and earns its way on through evidence. Pure protections ship always-on because they are fail-safe.

---

## THE UNIFYING PRINCIPLE

027 came out of a cross-experiment synthesis pass over four research sources: peck (verification discipline), gem-team (agent I/O contracts), memclaw (derived-memory write safety) and OpenLTM (retrieval observability and session continuity). The research surfaced the same pattern repeatedly. New capabilities added to a live memory system carry tail risk, even when the individual change looks correct in isolation. A ranking tweak that breaks recall in an edge case. A retention heuristic that deletes something a user considers permanent. A near-duplicate filter that silently swallows an important write.

The response was a single deployment rule: results-affecting and mutating features ship behind feature flags, defaulting off, with shadow mode available so they can be observed before they change anything. Structural protections, the kind that can only prevent damage, ship always-on.

That rule shaped every section below.

---

## 1. SYSTEM-SPEC-KIT — MEMORY STORE & WORKFLOW

These changes land in the memory store, the retrieval path, and the Spec Kit workflow discipline that governs how that memory is written and verified.

### 1. MEMORY WRITE SAFETY & SECRET REDACTION

**Before**

The memory write path had three gap cases. The automatic-edge strength cap checked only for the literal string `auto` as the creator identifier, so any namespaced variant like `auto-session` bypassed it. An automatic upsert could overwrite a manually curated edge by replacing its `created_by` field and strength. The retention sweep deleted memory rows based on TTL expiry without checking whether the row was constitutional, critical or pinned. Secrets had no interception point: API keys, tokens and JWTs could reach content-hash computation, embedding storage and the full-text search index if they appeared in saved content.

**After**

All four gaps are closed as always-on protections. A shared predicate now governs every cap site, so any `auto-*` namespaced creator gets the same treatment as `auto`. Before an automatic upsert writes, it reads the existing row's `created_by` field. If the existing row was created by a human or another non-automatic actor, the write returns null rather than overwriting the manual record. The retention sweep reads tier, pinned status and access metadata before deleting. Constitutional and critical rows that hit their TTL now get a deny decision recorded in the audit table rather than a deletion.

A fail-closed secret scrubber sits at the head of the parse pipeline. It runs before content-hash computation, before embedding and before full-text storage. AWS keys, GitHub and OpenAI tokens, JWTs, bearer values, private-key blocks and credential assignments are replaced with typed `[REDACTED:<kind>]` markers. If the scrubber itself fails internally, it throws and refuses the write rather than letting content through unchecked.

**Impact**

Manual memory records you create or edit stay yours. Automated callers that read and rewrite the same memory cannot quietly replace provenance or strength. Constitutional rows cannot be expired by a TTL sweep. Secrets saved by mistake do not reach the index.

**Why always-on**

Each of these is a protection, not a feature. None of them enable new behavior. They prevent data loss and credential leakage. There is no valid use case for an automated caller overwriting a manual edge, or for deleting a constitutional row on a timer.

### 2. SOURCE PROVENANCE GUARD

**Before**

Every memory write landed in the store without a server-assigned source label. The code that saved the record knew its own origin, but that knowledge was not persisted. An automated caller could pass any `source_kind` it chose, or pass none at all. There was no enforcement point that prevented an automated writer from overwriting manually authored fields like `title` or `trigger_phrases` on an update.

**After**

Schema migration 35 added a `source_kind` column to the memory index. The server derives this value from context at write time. Callers cannot assert it directly. The enum covers five cases: `human`, `agent`, `system`, `import` and `feedback`. Existing rows were backfilled on migration: manual saves became `human`, index scan entries became `import`, feedback-validator rows became `feedback` and everything else became `system`.

A write-ingress guard runs on every update. When the caller is classified as an automated actor (agent, system or import), the guard checks whether the fields being written are protected. Automated writes that would overwrite protected fields on human-authored rows are skipped at pre-mutation time. The response carries a skipped-hint so the caller knows what happened. Human writes and human-over-automated writes are not restricted.

A later refinement phase (022) closed the remaining gap. The guard could only hold the line for writes that actually carried provenance, and the automated reducer and feedback writers were not tagging themselves, so their writes reached the store untagged. Those writers now inject provenance context at the source through a shared `write-provenance.ts` deriver that defaults to `human` when no tag is present, so a missing tag can never be treated as automated and allowed to overwrite a human edit. With the automated writers tagging themselves, the publication gate no longer excludes machine-authored rows for missing provenance. Two pre-existing guard-coverage gaps that this tagging unblocks are tracked as follow-ons: same-path reindex-retire, and feedback auto-promotion lacking a `source_kind` ingress check.

**Impact**

You can trust that a memory record you authored by hand stays authored by hand. Automated enrichment passes cannot accidentally or silently replace your titles, trigger phrases or content. The mutation ledger now records which actor made each change, keyed by a deduplicated SHA-256 hash so repeated identical mutations do not inflate the audit trail.

**Why always-on**

Provenance is a structural property of every write. There is no scenario where automated overwrite of human-authored fields is the correct outcome. The guard is conservative by default and the human-over-automated write path remains fully open.

### 3. IDEMPOTENCY & NEAR-DUPLICATE DETECTION

**Before**

Retried saves and updates were not idempotent. If a session saved the same memory twice, two rows landed in the index. If a network retry replayed a save request, the result was a duplicate with a new row ID. The index had a deduplication threshold for similarity but no record of which pairs had already been checked.

**After**

Behind the `SPECKIT_MEMORY_IDEMPOTENCY` flag (default off), the memory server now manages idempotency receipts keyed by a server-derived fingerprint over the operation name, content hash and a request fingerprint. A retry of an identical save replays the original stored MCP response verbatim and writes nothing new. There is no `replayed: true` marker on the replayed response, so a replay is indistinguishable from the first call, which is the point of idempotency. A retry with a changed payload fails closed with an `idempotency_key_conflict` response.

The flag-on correctness was hardened in a later refinement phase (023) before any enablement could be considered. Receipts are immutable first-writes: the store uses `ON CONFLICT(receipt_key) DO NOTHING` and reports whether it won the write, so a retry never overwrites the recorded response. The receipt-write guard never leaves behind a receipt that would block a legitimate retry, and when two concurrent first-writes race, the loser looks up the winner's receipt and replays the winner's response rather than diverging.

Near-duplicate detection runs as an advisory check. When a new save matches an existing row above the similarity threshold, the response includes a `near_duplicate_of` hint. The write still proceeds. A `last_dedup_checked_at` short-circuit avoids re-running the check on rows that were recently evaluated.

**Impact**

When enabled, retries stop creating phantom duplicates. The hint surfaces silently similar rows so you can decide whether they should be merged or whether the distinction is intentional. No writes are blocked by the near-duplicate check.

**Why default-off**

The idempotency receipt path requires the embedding coverage to be reliable for near-duplicate checks to be useful. The feature flag holds it back until embedding recall is confirmed healthy across the index. Near-duplicate detection is advisory rather than blocking because false positives on genuinely distinct records would suppress valid saves. The flag-on correctness work in phase 023 was a prerequisite to any enablement, not the enablement itself: the flag stays off pending a dist rebuild and a deliberate enablement decision that still has to settle force-retry-conflict handling and receipt TTL.

### 4. SOFT-DELETE TOMBSTONES & MEMORY LIFECYCLE

**Before**

Deleting a memory record or a causal edge was a hard delete. The active row disappeared and left no trace. If a retention sweep cleaned up stale index entries, those causal edges were gone too. There was no audit trail for what was removed or why.

**After**

Every active causal-edge deletion now leaves a tombstone before the active row is removed. A central sweep helper snapshots matching active edges, writes tombstone rows with a monotonic lifecycle generation per source/target/relation triple, hard-deletes by active edge ID and clears graph caches after the durable deletes. All nine production delete paths route through this helper.

Schema migration 37 added a tombstone partition for memory rows behind `SPECKIT_SOFT_DELETE_TOMBSTONES` (default off). When the flag is on, deletes move rows to the tombstone partition rather than removing them. Health reporting exposes orphan edge samples and tombstone counts.

**Impact**

Causal edge deletes always leave an audit trail now, regardless of the flag setting. You can see what the graph looked like before a sweep, and recovery metadata is present for future restore paths. The memory-row tombstone feature adds the same protection for memory records when enabled.

**Why tombstones always-on for edges, default-off for rows**

Causal edge tombstones are purely additive. They add a row before removing one. There is no behavioral change and no recall impact. Memory-row tombstones require search, list, get, context and trigger handlers to filter `deleted_at IS NULL` before those paths are safe to enable, which is why that feature stays default-off.

### 5. SEMANTIC TRIGGER FALLBACK

**Before**

Trigger matching used lexical search only. A session context string had to contain a substring that matched a trigger phrase for a memory record to surface. There was no fallback for near-miss phrasing, synonyms or rephrased queries that meant the same thing.

**After**

A hybrid matching path is built and ready. Lexical matching remains the primary precision path and runs first. If `SPECKIT_SEMANTIC_TRIGGERS` is set, a second stage computes cosine similarity between the query and stored trigger embeddings (768-dimensional vectors). The handler is a two-stage pipeline: lexical results pass through unmodified, and the semantic stage can supplement them in union mode.

Union mode requires two explicit conditions: the `SPECKIT_SEMANTIC_TRIGGERS_MODE=union` flag and a weak lexical stage result. Both conditions were formally evaluated and union promotion is currently blocked pending collection of live false-positive, recall, latency and cost data on actual 768-dimensional embeddings.

**Impact**

The machinery exists and the test suite confirms it works. Nothing changes in production until you enable the flag. When evidence is collected, the path from shadow mode to union mode is a flag change.

**Why default-off**

Semantic trigger matching can return false positives that would surface unrelated memories in a user's session context. The synthetic test suite proves the machinery is correct, but live behavior with real embedding distributions has not been measured. Union promotion is explicitly blocked until that evidence exists.

### 6. LEARNING FEEDBACK REDUCERS

**Before**

The memory system collected feedback signals (search hits, access counts, weighted scores) but did not act on them. The aggregator computed a score and boost per memory record. Nothing downstream used those signals to adjust retention, strengthen causal edges based on co-access patterns, or protect frequently used records from expiry.

**After**

Three reducers were built, all default-off with shadow mode available.

The aggregator extended its output to include `queryCount`, `firstSeen`, `lastSeen` and `weightedHitCount` per memory record. These fields are read-only and have no behavioral side effects. They give downstream reducers what they need without requiring additional ledger reads.

The causal reducer, behind `SPECKIT_FEEDBACK_CAUSAL_LEARNING` (default off, deferred maintenance mode only), emits weak auto-session edges for memory pairs that co-appear in session traces. It only runs as a background maintenance task, never inline with a write.

The retention reducer, behind `SPECKIT_FEEDBACK_RETENTION_LEARNING` (default off), works through a three-gate safety model. The master flag must be on. The mode must be set to `active`. The caller must supply shadow-evaluation evidence. Shadow mode writes governance audit rows to the `governance_audit` table without touching any retention state. Dry-run mode returns decisions without any writes.

**Impact**

The feedback loop infrastructure is in place. Shadow mode lets you see what decisions the retention reducer would make before it makes them. When you are confident in the evidence, the transition to active mode is a deliberate flag change with an explicit evidence requirement, not an automatic promotion.

**Why all default-off**

The reducers touch retention and causal edge state. A miscalibrated retention reducer could shorten the life of frequently searched records or extend the life of ones that should expire. The shadow-first model means you can observe reducer decisions at scale before any of them take effect.

### 7. INCREMENTAL INDEX & CAUSAL GRAPH FOUNDATION

**Before**

The memory index rescanned every file on each index pass. There was no way to know what had changed since the last scan, which chunks of a file were new, or which downstream records depended on a source that changed. Causal edges had no metadata connecting them to the spec-kit packet lineage that generated them.

**After**

Schema migrations 31 through 33 added three layers. The incremental-index foundation (migration 31) introduced memo records for canonical inputs, dependency edges between memos and chunk metadata columns on the index table. A planning API reports memo hits, chunk hits and dependency-invalidated paths before any parsing or embedding runs. Existing scan behavior is unchanged until a caller uses the planning API.

Causal edge tombstones (migration 32) wrapped every active edge deletion in the tombstone sweep described in section 4.

The metadata-edge promoter (migration 33) reads spec-kit packet metadata, specifically the parent, child and chain relationships authored in `graph-metadata.json`, and promotes them into generated causal edges during index scans. Packet relationships in the spec tree now appear in the causal graph automatically.

A statediff subscriber layer was added on top. Handlers pass durable row actions to a set of subscribers after making their own policy decisions. Subscribers handle cache and hygiene effects, so inline cache invalidation calls inside handler logic were replaced with explicit action-aware subscriptions.

**Impact**

The incremental-index foundation is the prerequisite for future scan performance improvements. The metadata-edge promoter means packet lineage relationships appear in memory search results and causal graph traversal without manual edge creation. The statediff layer makes handler logic easier to reason about: a handler decides policy, passes actions, and subscribers handle consequences.

**Why additive**

All three migrations are strictly additive. Existing databases can apply them safely. Existing scan behavior does not change until a caller opts into the planning API.

### 8. RETRIEVAL OBSERVABILITY

**Before**

Memory search returned results without any explanation of why they were ranked in that order. If a record appeared at position 1 in one session and position 4 in another, there was no way to see what changed in the score breakdown. Contradiction and supersession edges in the causal graph were not surfaced inline with results. Health checks did not report degraded-vector state or how long ago the last maintenance sweep ran.

**After**

Four categories of diagnostic information were added, all behind existing per-call opt-ins.

When `includeTrace: true` is passed to `memory_search`, each result now includes a `why_ranked` breakdown keyed to the document path and anchor. The breakdown comes from the ranker's own row intermediates, not a parallel display formula, so the explanation matches the actual ranking.

When returned documents are linked by existing `contradicts` or `supersedes` causal edges, a compact inline warning appears in the formatted results.

Health and embedder-status responses now report degraded-vector state directly. Maintenance handlers for index scan, embedding reconcile and retention sweep each record their last-run counters in process memory so health can report them without a schema change or persisted write path.

The `debug` context profile now treats `debug` as an `includeTrace` opt-in automatically, so debugging sessions see retrieval diagnostics without explicitly requesting them.

**Impact**

When retrieval behavior looks wrong, you now have a way to check the score breakdown rather than guessing. Contradiction warnings appear inline where you would use them rather than requiring a separate causal graph query.

**Why additive and opt-in**

Ranking, scoring and decay are unchanged. The observability surfaces are read-only. Opt-ins keep the default response payload compact for non-diagnostic calls.

### 9. SESSION CONTINUITY & COMPACTION RESILIENCE

**Before**

The session startup response returned whatever the continuity ladder contained, without counts. If the ladder was large, the restore was unbounded. The compaction hook did not refresh the continuity documents before context was compacted, so a compacted session resumed from potentially stale handover state. Continuity summaries had no consistent shape to help with quick scanning.

**After**

Three surfaces were added together, behind `SPECKIT_AUTHORED_CONTINUITY_SNAPSHOT` (default off).

The startup restore panel now reports explicit restored and omitted counts. You can see how much of the continuity ladder was loaded and how much was trimmed, rather than getting an undifferentiated block of text.

An opt-in authored PreCompact snapshot refreshes `handover.md` and the `_memory.continuity` frontmatter before context compaction runs. The refresh reads the existing ladder docs and rewrites the continuity surfaces from them. It creates zero memory records and makes zero index mutations, so it has no side effects beyond the continuity documents.

Continuity summaries now use a goal/decision/progress/gotcha facet taxonomy. Each summary is organized into four labeled sections so a resuming session can quickly locate what was being worked on, what was decided, where things stand and what to watch out for.

**Impact**

Session handoffs are more compact and easier to scan. The compaction hook can now preserve a current state snapshot before context is lost. Schema v37 is unchanged by this feature.

**Why default-off**

The ENV_REFERENCE documentation for `SPECKIT_AUTHORED_CONTINUITY_SNAPSHOT` was deferred at user direction and the operator documentation is not yet published. The feature ships with tests and a working implementation, ready to enable when documented.

### 10. COMPLETION VERDICT FRESHNESS & VERIFICATION DISCIPLINE

**Before**

Completion claims in spec folders were not verified against whether the files described in the continuity fingerprint had changed since the claim was made. A reviewer agent could read a file, make a judgment and stop. No rule enforced that the reviewer had actually looked at the diff, and no rule prevented an agent from softening a P0 finding in a later iteration.

**After**

A default-off `CONTINUITY_FRESHNESS` validator checks whether a spec folder's completion claim is still valid against the current file state. It recomputes the continuity fingerprint, detects in-scope dirty paths and reports a warning first or an error when `SPECKIT_COMPLETION_FRESHNESS_ENFORCE` is set.

Review agents now carry explicit non-diff read-budget discipline: the reviewer reads the files in scope rather than relying on diff summaries. The `deep-review` skill and agent gained `VERDICT_LOCK` and anti-softening rules that prevent a P0 finding from being downgraded in a later iteration without explicit evidence.

An opt-in acceptance-criteria coverage gate, `AC_COVERAGE`, counts covered acceptance criteria against a configurable floor (default 90%). The rule is INFO severity and is inert unless `SPECKIT_AC_COVERAGE=true`. It accepts `Manual-infeasible` escape hatches when they include rationale text.

**Impact**

A completion claim that was valid yesterday but would not be valid against today's files is now detectable. Review verdicts can be locked so downstream orchestration cannot accidentally promote a softened finding. The acceptance-coverage gate gives a spec folder a quantitative completeness signal when you want one.

**Why default-off**

Both flags (`SPECKIT_COMPLETION_FRESHNESS` and `SPECKIT_AC_COVERAGE`) are opt-in. Enabling them on existing spec folders would produce warnings on folders that predate the rules. The opt-in model lets you apply them to new work first and expand coverage deliberately.

### 11. SEARCH RESILIENCE — VECTOR DURABILITY & THE LEXICAL FALLBACK

**Before**

A live malformed vector shard was observed silently degrading search: the read path trusted a shard that could not actually answer, and returned thin results with no signal. The lexical fallback that backs search when the vector lane is unavailable carried a memory-hungry posting representation and had lost its per-field weighting, so a title or trigger hit ranked no higher than the same term buried in body text. And the BM25 lane truncated results to the caller's limit before it resolved the spec-folder and deprecated-tier filters, so a scoped query could return fewer in-scope results than actually existed.

**After**

The vector read path now detects a shard that fails its integrity and dimension checks, quarantines it rather than serving it, seeds degraded-vector state for observability, and schedules an auto-rebuild with hardened dimension discovery (phase 013). That repair is durable across a restart (phase 020): a repair-pending sentinel is persisted at quarantine, and boot uses a completeness check, the vector rowcount against the index success count rather than a file-exists probe, to decide between resuming a real repair and clearing a stale sentinel on an already-rebuilt shard. The quarantine rename is itself a durable marker, so repair resumes even when no sentinel write could land, and an in-flight guard stops a double boot-attach from scheduling the same rebuild twice.

The lexical fallback was rebuilt as a packed in-memory BM25 engine with typed-array postings and restored BM25F field weighting (phase 014), so title and trigger matches outrank body noise, with packed ranking meeting or beating the legacy engine on the baseline metrics (the restored weighting intentionally re-orders results where the legacy engine had lost the title signal). The realistic-corpus re-validation exposed a 743MB warmup RSS spike against a 150MB budget, which phase 017 cut to a 136.5MB peak-sampled spike, under budget, through no-copy chunked packed postings and Uint8 to Uint16 to Uint32 width promotion, with the packed engine's ranking unchanged by the optimization (warmed-versus-direct identical) and the hard RSS gate re-enabled. The scope-then-limit bug was fixed in phase 021: the lane now over-fetches the candidate set when a scope or database filter is present, resolves the per-candidate metadata in batches that stay under the SQLite parameter limit, applies the filters, and only then truncates to the caller's limit.

**Impact**

A corrupted vector shard no longer silently degrades search, and a crash mid-repair resumes instead of permanently serving an empty shard with health reporting success. The lexical fallback ranks the way it should and warms under its memory budget on a realistic corpus. A scoped search returns its real result set rather than whatever survived an early truncation.

**Why mostly always-on, repair durability inert until adopted**

The detection, quarantine, ranking and scope fixes are corrections to existing behavior and ship as part of the read path. The vector repair durability source fix goes live only after a dist rebuild and daemon recycle, and is otherwise inert.

### 12. SEARCH INTELLIGENCE — WHAT CHANGED AND WHETHER IT WAS WORTH IT

The earlier sub-sections describe each search-related change in its own place — observability, the vector and lexical resilience work, semantic triggers, the incremental-index and metadata-edge foundation, and the BFS traversal consolidation. This sub-section pulls the whole search story into one before/after and answers the question directly: **was the search-intelligence work worth it?** The honest answer has two halves, because the work splits cleanly into resilience-and-correctness (already paying off, always-on) and smarter-ranking (built and staged, deliberately not yet enabled).

**Before — what memory search actually did**

Search was a single lexical lane with sharp edges. Trigger matching was substring-only: a session-context string had to literally contain a trigger phrase, so a rephrase or a synonym surfaced nothing. The vector lane trusted its shards blindly — a malformed shard that could not actually answer was still queried, returned thin results, and reported health as fine, so search silently degraded with no signal. The lexical fallback that backs search when the vector lane is down had lost its BM25F field weighting (a title or trigger hit ranked no higher than the same word buried in body text) and carried a memory-hungry posting representation. The BM25 lane truncated to the caller's limit *before* it applied the spec-folder and deprecated-tier filters, so a scoped query could return fewer in-scope rows than actually existed. Results came back with no explanation of why they ranked where they did, and contradiction or supersession relationships between results were invisible inline. Every index pass rescanned every file, and packet lineage from the spec tree never reached the causal graph.

**After — the resilience and correctness half (always-on, no flag)**

These are corrections to existing behavior. They ship in the read path and need no opt-in:

- **A corrupt vector shard is detected and quarantined instead of served.** The read path runs integrity and dimension checks, quarantines a failing shard, seeds degraded-vector state for health to report, and schedules an auto-rebuild with hardened dimension discovery. The repair is durable across a restart — a persisted sentinel plus a rowcount-completeness check decides between resuming a real repair and clearing a stale one, and the quarantine rename is itself a durable marker so repair resumes even if no sentinel write landed. (The repair-durability source fix is inert until a dist rebuild and daemon recycle adopt it; the detection and quarantine are live now.)
- **The lexical fallback ranks correctly again, under budget.** It was rebuilt as a packed in-memory BM25 engine with typed-array postings and restored BM25F field weighting, so title and trigger matches outrank body noise. Packed ranking meets or beats the legacy engine on the baseline metrics.
- **Scoped search returns its real result set.** The scope-then-limit bug is fixed: the lane over-fetches when a scope or database filter is present, resolves per-candidate metadata in batches under the SQLite parameter limit, applies the filters, and only then truncates.
- **Ranking is explainable.** With `includeTrace: true` (automatic in the `debug` profile), each result carries a `why_ranked` breakdown sourced from the ranker's own intermediates — the explanation matches the actual ranking rather than a parallel display formula. Contradiction and supersession edges between returned documents surface as a compact inline warning.
- **Traversal got faster and lineage-aware.** Two recursive-CTE causal traversals whose join shape defeated the index were replaced by one shared app-level BFS helper (same results, fewer full scans), and the metadata-edge promoter now lifts packet parent/child/chain relationships from `graph-metadata.json` into the causal graph automatically, so spec-tree lineage shows up in search and traversal without hand-authored edges.

**After — the smarter-ranking half (built, tested, staged behind evidence gates)**

These add new intelligence to ranking and retention. Every one ships default-off with shadow mode, by the same doctrine that governs the whole epic:

- **Semantic trigger fallback** computes cosine similarity between a query and stored 768-dimensional trigger embeddings as a second stage behind lexical matching. The machinery is built and the test suite passes. Union promotion (letting the semantic stage supplement weak lexical results) is explicitly blocked pending live false-positive, recall, latency and cost data on real embeddings.
- **Learning feedback reducers** would let co-access patterns strengthen causal edges and let usage protect frequently retrieved rows from expiry. They run shadow-first, writing governance-audit rows without touching state, until evidence justifies activation.
- **Idempotency and near-duplicate detection** stay flag-gated; near-duplicate detection is advisory (it hints, never blocks) and the idempotency receipt path waits on confirmed embedding-recall health.

**Performance**

- **Lexical fallback memory:** the realistic-corpus re-validation first exposed a **743MB warmup RSS spike against a 150MB budget**; the optimization pass cut it to a **136.5MB peak-sampled spike — under budget** — through no-copy chunked packed postings and Uint8→Uint16→Uint32 width promotion, with packed ranking unchanged by the optimization (warmed-versus-direct identical) and the hard RSS gate re-enabled.
- **Ranking quality:** packed BM25F meets or beats the legacy engine on the baseline metrics; the restored field weighting intentionally re-orders results where the legacy engine had lost the title signal.
- **Traversal:** the shared BFS helper removes the full-scan behavior of the old recursive CTEs while preserving results including multi-root fan-in.
- **Concurrency headroom:** the shared daemon IPC client cap was raised from 8 to 64, so session fan-outs no longer saturate the socket and fail bridge probes with spurious exit 75.

**The verdict — is it worth it?**

For the resilience-and-correctness half: unambiguously yes, and it is already paying off in every deployment with no flag to flip. These are not speed-for-its-own-sake optimizations — they fix ways search was quietly *wrong*. A corrupted shard used to degrade recall while reporting healthy; now it is caught. A scoped query used to under-return; now it returns its real set. The fallback used to bury title matches; now it ranks them correctly and does so under a third of its former memory peak. Explainability turns "the ranking looks off" from a guess into a check. The cost was real engineering effort and a measurable RSS regression that had to be chased back under budget, but the payoff is correctness on the path every user already exercises.

For the smarter-ranking half: the honest answer is *a measured bet not yet cashed in — deliberately.* Semantic triggers and learning reducers are the genuinely new intelligence, and they are exactly the kind of results-affecting change the epic's doctrine refuses to ship on faith. They are built, tested, and observable in shadow mode, but their production payoff is zero until live evidence justifies enabling them, because the downside of a miscalibrated semantic match (surfacing an unrelated memory mid-session) or a bad retention reducer (expiring a record you rely on) is worse than the upside of slightly better recall. So the upgrade that makes search *smarter* is staged behind the same gate as everything else; the upgrade that makes search *trustworthy* is live. That split is the whole point of the epic, applied to its own search work.

---

## 2. SYSTEM-SKILL-ADVISOR

The advisor began the epic as the odd subsystem out — it lacked the launcher resilience the other two daemons already had, and it had not yet adopted the write-safety and observability patterns proven in the memory store. Both gaps were closed.

### 1. DAEMON LAUNCHER RESILIENCE (ADVISOR PARITY)

**Before**

The skill-advisor launcher was the odd one out of the three daemon launchers. The spec-memory and code-index launchers had an owner lease and a reconnecting session proxy so a second session bridged the warm daemon instead of spawning a duplicate writer, but the advisor launcher's lease check only reported that a lease was held and did nothing about a dead socket. A hung advisor daemon could strand a session or invite a second writer.

**After**

Phase 019 brought the advisor launcher up to parity. A second session now bridges the live daemon through the session proxy, and a dead-socket respawn decision is acted on: the launcher reaps the dead owner and respawns a replacement under a bootstrap lock, rather than leaving the session stranded or starting a second writer. All three daemon launchers now share the same resilience bar.

**Impact**

The advisor survives a dropped transport the same way the spec-memory and code-index daemons already did. There is never a second writer to the skill graph.

**Why fresh-session only**

A running launcher process keeps its prior `.cjs` resident, so the fix activates on a fresh session. Live adoption is operator-gated.

### 2. CROSS-SUBSYSTEM HARDENING ADOPTED INTO THE ADVISOR

**Cross-subsystem feature adoption (018).** The hardening that 027 landed first in spec-memory was carried into the skill-advisor and code-graph subsystems. The advisor gained prompt-safe attribution and semantic health diagnostics, an automated-edge provenance guard that protects manual and trusted edges, a packed BM25F lexical helper that stays shadow-only until a future promotion decision, one local BFS helper for `transitive_path` and `subgraph`, and default-off feedback calibration reports that are written for inspection rather than consumed by live scoring.

---

## 3. SYSTEM-CODE-GRAPH

The code graph picked up two kinds of work: an internal traversal consolidation that removed full-scan behavior, and the same cross-subsystem hardening pattern that reached the advisor.

### 1. CAUSAL TRAVERSAL BFS

**Causal traversal BFS (012).** Two recursive-CTE graph traversals whose join shape defeated index use were replaced by a single shared app-level BFS helper. Same traversal results, including multi-root fan-in, fewer full scans.

### 2. CROSS-SUBSYSTEM HARDENING ADOPTED INTO CODE GRAPH

Code graph gained default-off tombstone audit rows, one local BFS helper for transitive and blast-radius traversal, `includeTrace`-gated `why_included` breadcrumbs, and a default-off BM25 symbol resolver that suggests candidates only after exact structural matching misses. The pattern is the same as the memory system: observability and internal consolidation can ship directly, while ranking or result-shape changes stay default-off or trace-gated.

---

## 4. CROSS-CUTTING & SHARED INFRASTRUCTURE

These changes span subsystems or live in the shared transport, command, and dependency layers that all three daemons rely on.

### 1. THE SYSTEM-SKILL CLI FRONT-DOORS

This is the headline structural change of the MCP-to-CLI transition, so it is worth being precise about what the CLI tools are, how they work, why they exist, and how they sit alongside MCP rather than replacing it.

**Before**

Three system skills each run a long-lived background daemon: spec-memory (37 tools, the memory store and search), code-index (8 tools, the structural code graph) and skill-advisor (9 tools, skill routing). All three were reachable only through MCP. MCP is the protocol an AI session speaks to those daemons. That meant: if the MCP transport was down, mid-reconnect, or simply not initialized yet, there was no second way in. A shell script could not call the tools. A prompt-time hook had no fallback. A `/doctor` repair command that needed to read memory health had to assume MCP was live. The 54 tools were real and warm in memory, but the only door to them was a door that is not always open.

**After**

Each daemon gained a CLI front-door — `spec-memory.cjs`, `code-index.cjs` and `skill-advisor.cjs` — shipped as stable shims under `.opencode/bin/`. The critical design point: **these are additive IPC clients over the same warm daemons, not new servers and not a reimplementation of the tools.** A CLI call connects to the exact daemon process the MCP session is already using, sends the same request over the same socket, and returns the same result. There is one source of truth (the daemon), now with two doors (MCP and CLI).

How a call works, end to end:

1. The CLI reads a tool manifest that mirrors the daemon's tool surface, so `spec-memory.cjs memory_context --json '{...}'` validates against the same schema the MCP tool uses.
2. It opens the daemon's Unix-domain IPC socket and sends the request as an IPC client. No model, no MCP handshake, no AI session required.
3. The daemon does the work and replies. The CLI prints the result as `json`, `jsonl` or compact `text`.
4. Auto-spawn rules decide what happens when no daemon is warm — and this is where the safety model lives.

The safety model has three rules that matter:

- **Warm-only at prompt time.** When a prompt-time hook uses the CLI (for example, the Claude or Codex session-start and user-prompt hooks reaching for memory context), it probes the socket first and only calls the CLI if the daemon already answers. It never cold-spawns. Cold-spawning a daemon costs hundreds of milliseconds, and paying that on every keystroke-adjacent hook would tax every message. If the daemon is cold, the hook silently skips and the work happens later through the normal path.
- **Cold spawn is allowed only from non-prompt contexts.** Session start, an explicit prewarm, a cron job or other maintenance entrypoints may start a daemon. Prompt-time paths may not.
- **Mutations and maintenance are gated.** Heavy or destructive operations — `code_graph_scan`, `advisor_rebuild`, `skill_graph_scan` — are blocked from prompt-time paths entirely, and the advisor's trusted mutations require an explicit `--trusted` flag. The CLI cannot be used to sneak a rebuild into a hook.

Exit code 75 is the retryable signal: it means the daemon or IPC is unavailable right now, not that the caller did anything wrong. A caller that sees 75 retries after a reconnect, a prewarm, or a short backoff rather than treating it as an error.

The transition was built in stages per CLI — a feasibility pass, a core implementation with the manifest-backed IPC client and auto-spawn, a Vitest hardening suite that locks the safety contracts (warm-only, mutation-gating, single-owner), and a runtime integration pass that wired the warm-only fallback into the Claude and Codex prompt hooks. A tri-daemon spawn drill — all three launchers auto-spawning at once, each holding a single-owner lease with respawn-lock serialization, ending at zero orphan processes — was the program gate for the whole transition. The eleven CLI environment variables are documented in `ENV_REFERENCE.md`, and the MCP registrations were left unchanged throughout.

**Intended use — when to reach for the CLI vs MCP**

- **Inside a live AI session: use MCP.** It is the primary transport, it is already connected, and the tools are native. The CLI is not meant to replace native MCP tool calls in normal agent work.
- **From a shell script, a CI step, or anything outside an AI session: use the CLI.** It is the only way to call the 54 tools without standing up an MCP session.
- **From a prompt-time hook: use the CLI warm-only.** The hook gets memory context or a skill recommendation if the daemon is already warm, and gets out of the way instantly if it is not.
- **As an MCP fallback: use the CLI when the MCP tools are missing, fail to initialize, or return transport errors while the daemon is otherwise expected to be warm.** The project guidance spells out the exact recovery invocations for each daemon (for example `node .opencode/bin/spec-memory.cjs memory_context --json '{"input":"resume previous work","mode":"resume"}'`).

**Benefits**

- **No single point of failure on the transport.** MCP being down no longer means the tools are unreachable. Scripts, hooks, and doctor commands have a second door.
- **One warm daemon, shared by both doors.** Because the CLI bridges the same process MCP uses, there is no duplicate writer, no second index, and no divergence between what a script sees and what the session sees.
- **Fast hooks.** Warm-only means a hook never pays cold-spawn latency; it either answers from a warm daemon or skips.
- **A stable, scriptable surface for all 54 tools** — the full spec-memory (37), code-index (8) and skill-advisor (9) surfaces, at parity with their MCP definitions.

**How it integrates alongside MCP (not instead of it)**

MCP and the CLI are two clients of the same daemons. MCP stays the primary, native transport for AI sessions; the CLI is the additive door for everything MCP cannot reach — scripts, hooks, fallback, and maintenance from the right contexts. They never fork the state: a single owner-leased daemon answers both, and a second session bridges the warm daemon rather than spawning a rival writer. The CLI did not change a single MCP registration. If you remove the CLI shims tomorrow, MCP behaves exactly as before; the CLI only ever added reach.

**Why warm-only at prompt time**

Cold-spawning a daemon from a prompt-time hook would add latency to every message. The warm-only policy keeps hooks fast and predictable. If the daemon is not warm, the hook skips and the next call that genuinely needs the daemon starts it through the normal initialization path, where paying that cost once is acceptable.

### 2. AGENT I/O CONTRACT (GEM-TEAM ADOPTION)

**Before**

Agent handoffs were unstructured prose. When the `@orchestrate` agent dispatched `@context` for a planning sweep, the result was free-form text. When `@debug` handed off to `@code`, there was no typed field carrying the diagnosis confidence level or the proposed fix scope. Agents had no agreed vocabulary for expressing uncertainty or flagging that a handoff was incomplete.

**After**

A typed advisory agent I/O contract was added as a shared reference across three waves. The contract defines five typed groups: DISPATCH headers, RESULT envelopes, HANDOFF payloads, PRE_EXECUTION gates and ADVISORY hints. It carries a schema version and explicit backward-compatibility rules.

Wave 1 propagated optional dispatch headers to the four `@context` planning dispatches in the plan commands. Wave 2 added predicate-scoped pre-execution gates: a debug-to-implementation crossing gate, an API/schema/integration change class gate and a medium/high complexity gate. Wave 3 extended the contract with optional `reviewer_focus` and `spec_drift` fields so a planner can tell a reviewer where to concentrate and flag when implementation has drifted from spec.

All five core agents were updated across all three runtime mirrors (OpenCode, Claude Code and Codex CLI).

**Impact**

Agent handoffs now carry structured context. A debug handoff to code includes the diagnosis confidence and whether the fix scope is narrow or broad. A review dispatch can be pre-loaded with the areas most likely to have drifted. Agents that do not recognize a field degrade gracefully to their existing behavior.

**Why advisory, not enforced**

No runtime parser validates the contract. Advisory metadata that is missing or malformed does not block an otherwise valid agent exchange. Enforcement is a follow-on decision once the contract vocabulary is stable and the team has observed how agents use it in practice.

### 3. RESEARCH-DERIVED DOCTRINE ADOPTIONS

**Before**

Spec Kit's own process rules were authored by the team without external validation. Review agents had no explicit guidance on how much context to read before forming a verdict. The spec folder's validation rules did not include a check for whether completion claims were stale. The framework had no quantitative measure of acceptance-criteria coverage.

**After**

Four research sources contributed specific improvements. Peck contributed seven distinct slices adopted across the system:

The self-check guidance in spec folder templates now includes explicit failure-mode prompts rather than just success checklists.

An advisory `CURRENT_STATE_DISCIPLINE` validation rule checks whether an implementation summary's current-state section reflects file reality rather than intent.

A constitutional rule review cadence was added so the team has a documented process for reviewing and retiring constitutional rules that no longer apply.

A reviewer-prompt benchmark substrate was added for testing reviewer agent prompts against known good and bad code samples.

Reviewer agents now carry explicit non-diff read-budget guidance: a reviewer reads the files in scope rather than relying on summaries of summaries.

Escalation discipline was added to the code skill: specific guidance for root-cause reporting, amendment-path routing and the three-strike escalation case.

The acceptance-coverage gate and completion-freshness validator described in section 1.10 are the final two peck slices.

gem-team contributed the typed agent I/O contract described in section 4.2.

memclaw contributed the provenance guard, idempotency safety and tombstone soft-deletes described in sections 1.2, 1.3 and 1.4.

OpenLTM contributed the retrieval observability surfaces and session continuity improvements described in sections 1.8 and 1.9.

**Impact**

The process improvements are additive to existing workflows. Constitutional rule review is a cadence recommendation, not an enforcement gate. The benchmark substrate gives the team a repeatable way to test reviewer prompt changes before shipping them.

### 4. STORAGE ADAPTER PORTS

**Storage adapter ports (015).** A five-port adapter seam (vector, lexical, traversal, maintenance, contention) now sits over the better-sqlite3 layer. A coupling-grep inventory trends residual direct access down toward the ports, with the hybrid lexical path, BM25 side-index maintenance, and vector-shard lifecycle pragmas kept as documented exceptions rather than forced through the ports. Testability today, room to move the persistence layer later, no caller-visible behavior change.

### 5. COMMAND PRESENTATION & WORKFLOW SEPARATION

**Command presentation and workflow separation (011).** The memory, speckit, create and doctor command families had their workflow routing split from their Markdown presentation contracts. A structural refactor with behavior and rendered output unchanged.

Separately, the daemon-CLI front doors gained a UX hardening pass (016): a freshness-gate fix and offline smoke, per-command help with aliases and clear errors, a unified daemon CLI reference, a hardened fallback envelope and bridge allowlist, and compact output with shell completion. The CLI surface stays at full parity with the daemons (spec-memory 37, code-index 8, skill-advisor 9).

### 6. AUTONOMOUS DEPENDENCY PATCHING

**Autonomous dependency patching (024).** A packet-local shell entrypoint scans the OpenCode skill package roots, runs `npm audit` on each, applies supported override remediation, regenerates lockfiles without executing install scripts, and re-audits. The shipped run found all five roots clean; CI integration remains optional.

### 7. IPC CLIENT CAP HARDENING

**IPC client cap hardening (026).** The shared daemon IPC socket server capped concurrent clients at 8 and refused extras by accepting then instantly closing them — indistinguishable from a dead daemon to probes. Session fan-outs past 8 saturated the cap, so every new session's bridge probe failed with exit 75 and the plugin printed a skip banner that the TUI rendered into the input field. The cap is now 64 in both module copies and pinned in all nine daemon env blocks, and the plugin's skip diagnostic is silent by default (debug-gated, still inspectable via its status tool).

### 8. CODE MODE ORPHAN LIFECYCLE

**Code Mode orphan lifecycle (025).** The mcp-code-mode stdio MCP server previously had no session-lifetime handling, so a hard-killed session left it alive forever at PPID 1 — sixteen such orphans had accumulated and degraded shared daemon infrastructure. The server now exits on stdin EOF, on transport close, or when a 15-second watchdog observes reparenting to PID 1, and the accumulated orphans were reaped to a zero census.

---

## 5. THE VERIFICATION & REMEDIATION PROGRAM

**Before**

The epic had review and research evidence, but not every evidence source had been turned into a terminal work queue. The 120-seat epic sweep left 101 single-seat P1 claims and 119 P2 clusters that were inventoried but not individually verified. The tri-system state after phases 000 through 026 had not yet been swept as a whole across system-spec-kit, system-skill-advisor, and system-code-graph. The later command-adherence work also exposed a measurement hazard: a probe can look like it tested a command while actually sending raw slash text to a model and never loading the command template.

**After**

Phase 027 turned the remaining epic findings into an eight-lane verify-first remediation program. Every lane used the same rule: Fable verification with file and line evidence first, GPT-5.5 implementation only for confirmed findings, then fresh Fable verification of the fix. All eight lanes closed with terminal dispositions recorded in the backlogs: fixed, refuted, waived with a reason, downgraded and triaged, or already fixed. The source summaries record strict lane validation plus package typechecks and touched-suite runs across the remediation waves.

Phase 028 then ran the broader tri-system research program. Fifty read-only research angles covered system-spec-kit, system-code-graph, system-skill-advisor, and cross-system concerns. The final summary records 50/50 iteration reports and 103 P0/P1 claims adjudicated: 48 confirmed, 53 downgraded, and 2 refuted. That registry became the input to the next remediation wave rather than being treated as already true.

Phase 029 applied the stricter pipeline to the deep-research and command-adherence backlog. The highest-risk lane shipped the single-writer kernel lock before the main memory database opens, so a second writer now loses the lock and exits with code 86 instead of corrupting `context-index.sqlite`. The launcher bridges to the live owner. The CLI save lane now uses the shared fail-closed secret scrubber before generated context payloads persist. Query fingerprints became hash-only with legacy prefix rows purged. The command-dashboard lane corrected the probe protocol itself: `opencode run --command memory/search` delivers the command template, while raw slash text does not. Correctly dispatched probes passed the envelope contract 3/3, and the negative control preserved the old failure as a harness check. The code-graph apply lane then closed the destructive-apply safety cluster as one packet: confirm gates happen before snapshots, semantic refusals can happen before rollback churn, rollback target selection is shared, retention protects known-good artifacts, and dry-run previews use the same target selector.

The 029 lane dispositions make the state explicit rather than pretending the program is magically finished. They record closed batches for the single-writer and scrubber work, the L8 command protocol, L3 idempotency, the L4 launcher cluster, multiple advisor and save-continuity waves, the L2 apply-pipeline packet, and the L9 doc/code waves. The latest continuity summary records waves 4 through 8 committed and Fable-verified, with about 186 of 198 items closed, while the remaining queues are named in the lane files.

Phase 030 resolved the residual design units that 029 deferred because each touched a high-blast-radius subsystem. Three items shipped as code. The `memory_health` report was exceeding its 1000-token advisory budget: re-tiered to 1500 tokens per tool and the near-static `exclusionAudit.entries` block gated behind the existing `includeFullReport` flag, with `data.routing` byte-for-byte unchanged. The ingest job-queue lifecycle was generalized into a kind-agnostic `maintenance_jobs` store so `memory_index_scan` can run as an opt-in background task via a new `background` flag, with two new tools (`memory_index_scan_status` and `memory_index_scan_cancel`) expanding the spec-memory surface from 37 to 39. The shadow-evaluation cycle was skipping every run because the clean consumption log keeps no raw query text. It now builds a privacy-preserving synthetic replay corpus from non-reversible signals (intent enum, coarse result-count bucket, counted-never-decoded query hash) where every synthetic query is drawn verbatim from a static seed vocabulary, guarded by a fail-closed privacy check and a SENTINEL test. Three items were disposed without code. The launcher parity port for `mk-code-index` was documented as a staged follow-on rather than mutated: true adoption requires a daemon backend-only mode plus idle-monitor grace and owner-proxy wiring, a multi-stage launcher-critical change that is inert until a fresh session. A proposed spec-to-file crosswalk (tri-163) was refuted because the named `COVERED_BY` edge is a deep-loop context-sweep relation between investigation slices rather than a spec-to-file edge, making a literal crosswalk a category error. And a write-path stress harness (tri-129) was deferred because six existing stress and durability suites already cover the constituent risks in aggregate.

**Impact**

Research outputs now become implementation work only after direct verification. False positives and measurement artifacts are filtered before they can drive code changes. The database corruption class that caused repeated loss is closed at the writer boundary, not papered over after the fact. Destructive code-graph operations have a safer apply pipeline, and command-dashboard behavior is measured against the actual command runtime instead of against raw prompt text.

**Why this is still the same 027 principle**

The principle did not change when the work moved from feature hardening to remediation. Anything that can change results, mutate state, or claim truth is gated by evidence. The remediation waves are not a second doctrine. They are the original doctrine applied to the epic's own findings.

---

## CURRENT STATE

The schema sits at v37. All results-affecting and mutating features are default-off behind feature flags, with shadow modes available where relevant. The always-on protections, provenance guard, secret scrubber, retention-tier basement, manual-edge overwrite guard and causal-edge tombstones, are active in every deployment. The later remediation work adds one more always-on protection at the process boundary: a default-on single-writer database lock with an emergency disable flag.

The everyday call shape of memory retrieval, storage and session startup is unchanged for existing users, and enabling any of the flags is an explicit opt-in with documented environment variables in `ENV_REFERENCE.md`. The read path did get more resilient by default: a malformed vector shard is detected and quarantined rather than served, the lexical fallback ranks with restored field weights under its memory budget, and a scoped search resolves its filters before truncating. None of that needs a flag and none of it changes the response contract for the common path. The vector repair durability and the idempotency flag-on correctness are inert until a dist rebuild adopts them.

The changelog index at `changelog/README.md` and the chronological view at `timeline.md` now cover the original 000 through 026 tracks plus the 027 finding-remediation, 028 tri-system deep-research, 029 deep-research remediation and 030 residual-design-units follow-ons. The manual testing playbook covers the CLI stress scenarios and the new diagnostic surfaces.
