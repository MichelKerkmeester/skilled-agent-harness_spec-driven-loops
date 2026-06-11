# What Changed in Spec Kit Memory: The 027 Refinement

> Research-derived hardening for the memory system and the Spec Kit workflow. Every feature that affects results ships default-off and earns its way on through evidence. Pure protections ship always-on because they are fail-safe.

---

## The Unifying Principle

027 came out of a cross-experiment synthesis pass over four research sources: peck (verification discipline), gem-team (agent I/O contracts), memclaw (derived-memory write safety) and OpenLTM (retrieval observability and session continuity). The research surfaced the same pattern repeatedly. New capabilities added to a live memory system carry tail risk, even when the individual change looks correct in isolation. A ranking tweak that breaks recall in an edge case. A retention heuristic that deletes something a user considers permanent. A near-duplicate filter that silently swallows an important write.

The response was a single deployment rule: results-affecting and mutating features ship behind feature flags, defaulting off, with shadow mode available so they can be observed before they change anything. Structural protections, the kind that can only prevent damage, ship always-on.

That rule shaped every section below.

---

## 1. Memory Write Safety and Secret Redaction

**Before**

The memory write path had three gap cases. The automatic-edge strength cap checked only for the literal string `auto` as the creator identifier, so any namespaced variant like `auto-session` bypassed it. An automatic upsert could overwrite a manually curated edge by replacing its `created_by` field and strength. The retention sweep deleted memory rows based on TTL expiry without checking whether the row was constitutional, critical or pinned. Secrets had no interception point: API keys, tokens and JWTs could reach content-hash computation, embedding storage and the full-text search index if they appeared in saved content.

**After**

All four gaps are closed as always-on protections. A shared predicate now governs every cap site, so any `auto-*` namespaced creator gets the same treatment as `auto`. Before an automatic upsert writes, it reads the existing row's `created_by` field. If the existing row was created by a human or another non-automatic actor, the write returns null rather than overwriting the manual record. The retention sweep reads tier, pinned status and access metadata before deleting. Constitutional and critical rows that hit their TTL now get a deny decision recorded in the audit table rather than a deletion.

A fail-closed secret scrubber sits at the head of the parse pipeline. It runs before content-hash computation, before embedding and before full-text storage. AWS keys, GitHub and OpenAI tokens, JWTs, bearer values, private-key blocks and credential assignments are replaced with typed `[REDACTED:<kind>]` markers. If the scrubber itself fails internally, it throws and refuses the write rather than letting content through unchecked.

**Impact**

Manual memory records you create or edit stay yours. Automated callers that read and rewrite the same memory cannot quietly replace provenance or strength. Constitutional rows cannot be expired by a TTL sweep. Secrets saved by mistake do not reach the index.

**Why always-on**

Each of these is a protection, not a feature. None of them enable new behavior. They prevent data loss and credential leakage. There is no valid use case for an automated caller overwriting a manual edge, or for deleting a constitutional row on a timer.

---

## 2. Source Provenance Guard

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

---

## 3. Idempotency and Near-Duplicate Detection

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

---

## 4. Soft-Delete Tombstones and Memory Lifecycle

**Before**

Deleting a memory record or a causal edge was a hard delete. The active row disappeared and left no trace. If a retention sweep cleaned up stale index entries, those causal edges were gone too. There was no audit trail for what was removed or why.

**After**

Every active causal-edge deletion now leaves a tombstone before the active row is removed. A central sweep helper snapshots matching active edges, writes tombstone rows with a monotonic lifecycle generation per source/target/relation triple, hard-deletes by active edge ID and clears graph caches after the durable deletes. All nine production delete paths route through this helper.

Schema migration 37 added a tombstone partition for memory rows behind `SPECKIT_SOFT_DELETE_TOMBSTONES` (default off). When the flag is on, deletes move rows to the tombstone partition rather than removing them. Health reporting exposes orphan edge samples and tombstone counts.

**Impact**

Causal edge deletes always leave an audit trail now, regardless of the flag setting. You can see what the graph looked like before a sweep, and recovery metadata is present for future restore paths. The memory-row tombstone feature adds the same protection for memory records when enabled.

**Why tombstones always-on for edges, default-off for rows**

Causal edge tombstones are purely additive. They add a row before removing one. There is no behavioral change and no recall impact. Memory-row tombstones require search, list, get, context and trigger handlers to filter `deleted_at IS NULL` before those paths are safe to enable, which is why that feature stays default-off.

---

## 5. Semantic Trigger Fallback

**Before**

Trigger matching used lexical search only. A session context string had to contain a substring that matched a trigger phrase for a memory record to surface. There was no fallback for near-miss phrasing, synonyms or rephrased queries that meant the same thing.

**After**

A hybrid matching path is built and ready. Lexical matching remains the primary precision path and runs first. If `SPECKIT_SEMANTIC_TRIGGERS` is set, a second stage computes cosine similarity between the query and stored trigger embeddings (768-dimensional vectors). The handler is a two-stage pipeline: lexical results pass through unmodified, and the semantic stage can supplement them in union mode.

Union mode requires two explicit conditions: the `SPECKIT_SEMANTIC_TRIGGERS_MODE=union` flag and a weak lexical stage result. Both conditions were formally evaluated and union promotion is currently blocked pending collection of live false-positive, recall, latency and cost data on actual 768-dimensional embeddings.

**Impact**

The machinery exists and the test suite confirms it works. Nothing changes in production until you enable the flag. When evidence is collected, the path from shadow mode to union mode is a flag change.

**Why default-off**

Semantic trigger matching can return false positives that would surface unrelated memories in a user's session context. The synthetic test suite proves the machinery is correct, but live behavior with real embedding distributions has not been measured. Union promotion is explicitly blocked until that evidence exists.

---

## 6. Learning Feedback Reducers

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

---

## 7. Incremental Index and Causal Graph Foundation

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

---

## 8. Retrieval Observability

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

---

## 9. Session Continuity and Compaction Resilience

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

---

## 10. Completion Verdict Freshness and Verification Discipline

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

---

## 11. Agent I/O Contract (gem-team Adoption)

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

---

## 12. The Dual-Stack CLI Front-Doors

**Before**

All three memory system daemons, spec-memory (37 tools), code-index (8 tools) and skill-advisor (9 tools), were accessible only through MCP. If the MCP transport was down, unavailable or not yet initialized, there was no way to call the daemons programmatically from a script, a hook or a fallback path.

**After**

Each daemon now has a CLI front-door: `spec-memory.cjs`, `code-index.cjs` and `skill-advisor.cjs` as stable shims under `.opencode/bin/`. Each CLI was built in four stages: a feasibility research pass, a core implementation with a manifest-backed IPC client and auto-spawn, a hardening suite locking critical safety contracts in Vitest, and a runtime integration pass wiring warm-only fallback into Claude and Codex prompt-time hooks.

The CLI path is warm-only for prompt-time hooks: the hook probes the daemon socket first and only calls the CLI if the socket responds. Cold daemon spawning from prompt-time hooks is explicitly blocked. Maintenance operations like `code_graph_scan` and `advisor_rebuild` are blocked from prompt-time paths entirely.

A tri-daemon spawn drill tests all three launchers auto-spawning simultaneously, confirms per-launcher single-owner and respawn-lock serialization and verifies zero orphan processes. This drill was the program gate for the CLI transition.

Eleven new CLI environment variables are documented in `ENV_REFERENCE.md`. The MCP registrations were not changed during the transition window.

**Impact**

Automation scripts, doctor commands and hook fallback paths can now call memory, code-index and skill-advisor tooling without depending on an active MCP session. If MCP is down, the hook silently skips rather than failing. If you are scripting outside an AI session, you have a stable CLI surface for all 54 tools.

**Why warm-only at prompt time**

Cold-spawning a daemon from a prompt-time hook adds latency to every message. The warm-only policy keeps hooks fast. If the daemon is not warm, the hook skips and the next call that needs the daemon can start it through the normal MCP initialization path.

---

## 13. Research-Derived Doctrine Adoptions

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

The acceptance-coverage gate and completion-freshness validator described in section 10 are the final two peck slices.

gem-team contributed the typed agent I/O contract described in section 11.

memclaw contributed the provenance guard, idempotency safety and tombstone soft-deletes described in sections 2, 3 and 4.

OpenLTM contributed the retrieval observability surfaces and session continuity improvements described in sections 8 and 9.

**Impact**

The process improvements are additive to existing workflows. Constitutional rule review is a cadence recommendation, not an enforcement gate. The benchmark substrate gives the team a repeatable way to test reviewer prompt changes before shipping them.

---

## 14. Search Resilience: Vector Durability and the Lexical Fallback

**Before**

A live malformed vector shard was observed silently degrading search: the read path trusted a shard that could not actually answer, and returned thin results with no signal. The lexical fallback that backs search when the vector lane is unavailable carried a memory-hungry posting representation and had lost its per-field weighting, so a title or trigger hit ranked no higher than the same term buried in body text. And the BM25 lane truncated results to the caller's limit before it resolved the spec-folder and deprecated-tier filters, so a scoped query could return fewer in-scope results than actually existed.

**After**

The vector read path now detects a shard that fails its integrity and dimension checks, quarantines it rather than serving it, seeds degraded-vector state for observability, and schedules an auto-rebuild with hardened dimension discovery (phase 013). That repair is durable across a restart (phase 020): a repair-pending sentinel is persisted at quarantine, and boot uses a completeness check, the vector rowcount against the index success count rather than a file-exists probe, to decide between resuming a real repair and clearing a stale sentinel on an already-rebuilt shard. The quarantine rename is itself a durable marker, so repair resumes even when no sentinel write could land, and an in-flight guard stops a double boot-attach from scheduling the same rebuild twice.

The lexical fallback was rebuilt as a packed in-memory BM25 engine with typed-array postings and restored BM25F field weighting (phase 014), so title and trigger matches outrank body noise, with ranking held byte-identical to the prior engine. The realistic-corpus re-validation exposed a 743MB warmup RSS spike against a 150MB budget, which phase 017 cut to a 136.5MB peak-sampled spike, under budget, through no-copy chunked packed postings and Uint8 to Uint16 to Uint32 width promotion, ranking still byte-identical, with the hard RSS gate re-enabled. The scope-then-limit bug was fixed in phase 021: the lane now over-fetches the candidate set when a scope or database filter is present, resolves the per-candidate metadata in batches that stay under the SQLite parameter limit, applies the filters, and only then truncates to the caller's limit.

**Impact**

A corrupted vector shard no longer silently degrades search, and a crash mid-repair resumes instead of permanently serving an empty shard with health reporting success. The lexical fallback ranks the way it should and warms under its memory budget on a realistic corpus. A scoped search returns its real result set rather than whatever survived an early truncation.

**Why mostly always-on, repair durability inert until adopted**

The detection, quarantine, ranking and scope fixes are corrections to existing behavior and ship as part of the read path. The vector repair durability source fix goes live only after a dist rebuild and daemon recycle, and is otherwise inert.

---

## 15. Daemon Launcher Resilience

**Before**

The skill-advisor launcher was the odd one out of the three daemon launchers. The spec-memory and code-index launchers had an owner lease and a reconnecting session proxy so a second session bridged the warm daemon instead of spawning a duplicate writer, but the advisor launcher's lease check only reported that a lease was held and did nothing about a dead socket. A hung advisor daemon could strand a session or invite a second writer.

**After**

Phase 019 brought the advisor launcher up to parity. A second session now bridges the live daemon through the session proxy, and a dead-socket respawn decision is acted on: the launcher reaps the dead owner and respawns a replacement under a bootstrap lock, rather than leaving the session stranded or starting a second writer. All three daemon launchers now share the same resilience bar.

**Impact**

The advisor survives a dropped transport the same way the spec-memory and code-index daemons already did. There is never a second writer to the skill graph.

**Why fresh-session only**

A running launcher process keeps its prior `.cjs` resident, so the fix activates on a fresh session. Live adoption is operator-gated.

---

## 16. Internal Seams and Cross-Subsystem Adoption

These phases changed structure or carried existing patterns into other subsystems without changing user-facing behavior.

**Causal traversal BFS (012).** Two recursive-CTE graph traversals whose join shape defeated index use were replaced by a single shared app-level BFS helper. Same traversal results, including multi-root fan-in, fewer full scans.

**Storage adapter ports (015).** A five-port adapter seam (vector, lexical, traversal, maintenance, contention) now sits over the better-sqlite3 layer. A coupling-grep inventory trends residual direct access down toward the ports, with the hybrid lexical path, BM25 side-index maintenance, and vector-shard lifecycle pragmas kept as documented exceptions rather than forced through the ports. Testability today, room to move the persistence layer later, no caller-visible behavior change.

**Command presentation and workflow separation (011).** The memory, speckit, create and doctor command families had their workflow routing split from their Markdown presentation contracts. A structural refactor with behavior and rendered output unchanged.

**CLI tooling UX (016).** The daemon-CLI front doors gained a freshness-gate fix and offline smoke, per-command help with aliases and clear errors, a unified daemon CLI reference, a hardened fallback envelope and bridge allowlist, and compact output with shell completion. The CLI surface stays at full parity with the daemons (spec-memory 37, code-index 8, skill-advisor 9).

**Cross-subsystem feature adoption (018).** The hardening that 027 landed first in spec-memory was carried into the skill-advisor and code-graph subsystems: observability attribution, a provenance guard, packed BM25, BFS consolidation, feedback calibration, a tombstone audit, `why_included`, and a BM25 symbol resolver. Results-affecting additions ship default-off or shadow-first.

---

## Current State

The schema sits at v37. All results-affecting and mutating features are default-off behind feature flags, with shadow modes available where relevant. The always-on protections, provenance guard, secret scrubber, retention-tier basement, manual-edge overwrite guard and causal-edge tombstones, are active in every deployment.

The everyday call shape of memory retrieval, storage and session startup is unchanged for existing users, and enabling any of the flags is an explicit opt-in with documented environment variables in `ENV_REFERENCE.md`. The read path did get more resilient by default: a malformed vector shard is detected and quarantined rather than served, the lexical fallback ranks with restored field weights under its memory budget, and a scoped search resolves its filters before truncating. None of that needs a flag and none of it changes the response contract for the common path. The vector repair durability and the idempotency flag-on correctness are inert until a dist rebuild adopts them.

The changelog index at `changelog/README.md` links all twenty-four phase tracks (000 through 023) to their detailed change records, and the chronological view lives in `timeline.md`. The manual testing playbook covers the CLI stress scenarios and the new diagnostic surfaces.
