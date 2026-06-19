# 05 — Before → After: Every Finding as a Feature Change (Plain-Language)

> **What this is.** Every finding from the 200-iteration research campaign, written as a **feature change with a concrete before vs. after** — so you can see exactly what each subsystem does *today* and what it would do *after the change*. No shorthand required (the codes like `C4-A` / `Q6-C1` are kept only as cross-references to the detailed docs).
>
> **The campaign in one line.** We mined two outside memory systems — **aionforge-memory** (Rust) and **galadriel** (Python) — for concrete improvements to our four internal tools: **Memory MCP** (the memory store), **Code-Graph** (the structural code index), **Skill-Advisor** (which skill to use), and **Deep-Loop** (research/review automation).
>
> **Status: research only.** Nothing here is built or measured. This is the proposed change-set; building any of it is a separate, later decision.

## How to read each entry

```
N. Plain name  (code)  · [NEW] or [EXISTING: …]  · priority
   Do:     the change we'd make
   Before: what happens today
   After:  what happens once changed
   Catch:  the known caveat (only where it changes the decision)
```

- **[NEW]** = a capability that does not exist today. **[EXISTING: off]** = built but switched off. **[EXISTING: unwired]** = built but not connected. **[EXISTING: buggy/partial]** = present but wrong or incomplete.
- **Priority:** **Wave 0** = do first (cheap, safe, reversible, no benchmark). **Wave 1** = small follow-on build. **Wave 2** = bigger / schema-changing. **Prove-first** = don't build until a benchmark justifies it.
- **Every effort/value judgement is an educated guess from reading the code — none is benchmarked.** This is the campaign's single biggest caveat.

---

## Memory MCP (the primary subsystem)

**1. Stable search-result order**  `(ANN tie-stable ORDER BY)` · **[EXISTING: buggy]** · Wave 0
- **Do:** add a stable secondary sort key (the row id) to the four ranked vector-search queries.
- **Before:** when two results are equally close, there's no tie-breaker, so *which* equally-close results survive the cut into final ranking can change from one run to the next.
- **After:** the same query returns the same results in the same order, every time.

**2. Duplicate-save safety net**  `(C4-A)` · **[EXISTING: off]** · Wave 0
- **Do:** turn on the "I already saved this" receipt system (it's built but defaulted off).
- **Before:** if the server crashes between committing a save and acknowledging it, the retry can write the same memory twice.
- **After:** the retry sees the receipt and does nothing — no duplicate.
- **Catch:** only the receipt + content-id half is real; the originally-claimed "replay into the deferred-save path" wiring was disproved — don't budget for it.

**3. Don't crash when the embedding model is down**  `(C9)` · **[EXISTING: unwired]** · Wave 0
- **Do:** route a missing embedding to keyword search and report the degrade.
- **Before:** if the embedding model is unavailable, recall throws an error and returns nothing.
- **After:** recall falls back to keyword-only results and flags `embedder unavailable`. (The fallback code already exists; it's just not connected.)

**4. Break score-ties by content, not row number**  `(C5-B)` · **[EXISTING: partial]** · Wave 0
- **Do:** when results tie on score, tie-break by a content hash instead of the internal row id.
- **Before:** ties resolve by database row id, so the order can shift after a rebuild or on a different machine.
- **After:** the order is derived from content → stable across rebuilds and machines (so a downstream byte-cache stays valid).

**5. Consistent age-decay and channel-blending**  `(C-X1 + C6-A)` · **[EXISTING: partial]** · Wave 0
- **Do:** expose the correct "active-channel" denominator as a named setting; apply age-decay at ranking time from a supplied clock.
- **Before:** zeroing one search channel distorts the ranking-bonus math for the surviving channels; age-decay only kicks in when a memory is actually accessed.
- **After:** blending stays correct when a channel is empty, and older memories rank slightly lower consistently.

**6. Neutralize hidden instructions in recalled notes**  `(C8 — source_kind escaper)` · **[NEW]** · Wave 1 · **the security item**
- **Do:** escape the *content body* of a recalled note so embedded instructions are inert, gated by where the note came from (`source_kind`): pass-through for human-written, escape for agent/import/system.
- **Before:** a remembered note is shown to the assistant verbatim; instructions hidden inside it (e.g. "ignore previous instructions and…") are live, so a poisoned note can hijack the assistant. The "where it came from" tag already reaches the display layer but is **never used** there.
- **After:** recalled content is treated as data, not commands; embedded instructions are neutralized based on the source tag.
- **Catch:** importance depends on the threat model (see Caveats). The broad "this risk is everywhere" version was disproved — this Memory-scoped escaper is the robust shape.

**7. Block injection at capture time too**  `(write-time-injection-filter)` · **[NEW]** · Wave 1
- **Do:** strip/flag prompt-injection markers when content is first saved (fail-closed).
- **Before:** the capture filter only redacts secrets (API keys); a poisoned document saved now will inject the model on later recall.
- **After:** injection markers are caught at the door — a second layer paired with #6.

**8. Turn off graph-expansion for simple lookups**  `(C2-A/B/C — query-class routing)` · **[NEW classifier + EXISTING primitive]** · Wave 1
- **Do:** classify the search shape (find-one-thing vs. trace-everything) and switch graph expansion off for single-hop lookups.
- **Before:** every search expands the graph the same way; expansion hurts precision when you just want one exact thing.
- **After:** single-hop lookups stay precise (no expansion); multi-hop traces keep expansion for recall.

**9. Honest delete report**  `(residual-retention-report)` · **[NEW field]** · Wave 1
- **Do:** have delete return where bytes still physically live.
- **Before:** delete reports "gone," but data remains in dead row-slots + vector tombstones until compaction.
- **After:** delete discloses the residual retention (dead slots, tombstones, WAL) instead of over-claiming.

**10. Don't let always-surface notes starve results**  `(never-truncate-always-surface)` · **[EXISTING: buggy]** · Wave 0/1
- **Do:** stop counting the always-surface prefix against the result limit (never cap it, but never let it crowd out the rest).
- **Before:** the identity/constitutional "always surface these" prefix counts toward the limit and is silently truncated to fit — so it can fill the slice and starve normal results.
- **After:** the prefix is always fully surfaced and normal results aren't starved.

**11. Keep internal rows out of normal recall**  `(system-kind-exclusion)` · **[EXISTING: unused field]** · Wave 0/1
- **Do:** exclude `system`-kind / substrate-internal rows from default recall, with an admin path to see them.
- **Before:** internal system rows can show up in normal recall as noise.
- **After:** they're hidden by default; admins can still surface them.

**12. Anti-lossy summary guard**  `(detail-retention-guard)` · **[NEW guard]** · Wave 1
- **Do:** require a generated summary to retain ≥90% of distinct entities + meet a confidence floor, else don't write it.
- **Before:** a generated summary can quietly drop most of the entities (or be low-confidence) and still replace/accompany the raw.
- **After:** a lossy summary is refused (raw kept) — no silent detail loss.

**13. Background-work health gauges**  `(gauges: pending / failed / lag)` · **[EXISTING: unexposed]** · Wave 0/1
- **Do:** expose three counters from stats that already exist.
- **Before:** no visibility into how much background work is pending, how much failed, or how stale the oldest pending item is.
- **After:** simple gauges show pending count, failed count, and oldest-pending age.

**14. Crash-safe save receipts**  `(transport idempotency)` · **[EXISTING: gap]** · Wave 2
- **Do:** thread the idempotency token through the daemon channel into the save handler.
- **Before:** the receipt is written *after and outside* the save transaction, so a crash in between lets a retry duplicate the secondary index.
- **After:** the replay is recognized inside the transaction → clean no-op, no duplicate index entry.

**15. Bounded background enrichment**  `(enrichment retry-budget + dead-letter)` · **[EXISTING: gap]** · Wave 2
- **Do:** add a per-item retry cap + a terminal "failed" state.
- **Before:** stuck enrichment work replays on every boot, forever (a poison item never gives up).
- **After:** a poison item retries up to a limit, then parks in a "failed" state.

**16. "No longer current" = closed edge, not deletion**  `(C3-A/B/C, C4-B — bi-temporal)` · **[EXISTING flag-on + NEW build]** · Wave 2
- **Do:** model a superseded fact as *closed* (still readable as history) with proper event-time + transaction-time stamps, and add "current / as-of / as-known-at" recall modes; give derived memories a content-based id.
- **Before:** a superseded fact is physically deleted; there's no way to ask "what did memory look like at time X."
- **After:** superseded facts are retired by closing an edge (history-readable), and you can recall memory as-of a past point.
- **Catch:** this is **not** a flag flip (the flag is already on) — it's a read-side build + store reconciliation, and the "purely additive" claim is unverified (no migration spec to check).

**17. Protect labeled memories from auto-forget**  `(forget-allowlist)` · **[NEW protect-list]** · Wave 1
- **Do:** add a 6-label allowlist that shields a memory from the auto-forget sweep (needs a label column).
- **Before:** the auto-forget sweep can reap any eligible low-value memory.
- **After:** labeled memories are protected from reaping.

**18. "What did memory look like back then" tool**  `(memory_history as-of)` · **[EXISTING: unexposed]** · Wave 1
- **Do:** wire the existing library resolver to a tool.
- **Before:** the as-of/lineage resolver exists in code but no tool exposes it.
- **After:** a tool surfaces point-in-time memory views.

**19. Stop the system rewriting its own rulebook**  `(constitutional self-edit / CAS guard)` · **[NEW guard]** · Wave 0
- **Do:** add a "you may not edit your own constitutional row" check + a "only edit if the row still matches the hash you read" precondition.
- **Before:** nothing stops the assistant editing its own protected/constitutional memories — a drifting agent could re-label itself "human" or quietly rewrite its own redlines.
- **After:** a constitutional row can't be self-edited, and concurrent edits can't silently clobber each other.

---

## Code-Graph (the structural code index)

**20. Repair stale code edges**  `(CG-edge-staleness / dependency-transitivity)` · **[EXISTING: buggy]** · Wave 1 · **the real Code-Graph bug**
- **Do:** wire the existing "find this file's dependents" query into the re-index scan loop.
- **Before:** a file whose *dependency* changed — but whose own content didn't — is skipped on re-index, so its edges go stale and are never repaired.
- **After:** when a dependency changes, its dependents re-index too → edges stay fresh. (Note: the skip is content-hash-based, not timestamp-based — an earlier doc said "mtime," now corrected.)

**21. Use the confidence fields in ranking**  `(Q4-C1)` · **[EXISTING: unused fields]** · Wave 0 (needs benchmark)
- **Do:** blend confidence/evidence into rank *additively* (RRF-style).
- **Before:** confidence/evidence are stored and displayed but never affect result order.
- **After:** more-confident results rank higher.
- **Catch:** must be additive, not multiplicative (multiplying by a neutral factor would re-order ties vs. the baseline); needs a benchmark.

**22. Recover from transient parse failures**  `(Q2-C1)` · **[EXISTING: buggy]** · Wave 2
- **Do:** split transient parse failures (retry up to a limit) from fatal ones (permanent).
- **Before:** a file that fails to parse is skipped **permanently** (no retry ceiling; the success-recorder is a dead no-op), so a momentary glitch drops a file forever.
- **After:** transient failures recover on retry; only genuinely-fatal files stay skipped.

**23. Reproducible impact-walk order**  `(det-order)` · **[EXISTING: nondeterministic]** · Wave 0
- **Do:** add one stable tie-break in the walk's finalize step.
- **Before:** walk output order follows database row order, so it varies run-to-run.
- **After:** one tie-break makes impact, dependency, and outline walks reproducible.

**24. Query-seeded impact ranking**  `(Q3-C1 — seeded PageRank)` · **[NEW]** · Wave 2
- **Do:** rank impact by a query-seeded multi-hop walk, reusing 027's existing graph traversal.
- **Before:** impact is ranked only by edge-count / 1-hop degree.
- **After:** impact ranking reflects multi-hop relevance to the query.

**25. Renames keep their lineage**  `(Q1-C2)` · **[NEW edge type]** · Wave 1/2
- **Do:** emit a SUPERSEDES edge on rename instead of delete-and-recreate.
- **Before:** a renamed symbol is deleted and recreated → rename history is lost.
- **After:** the rename is recorded as a supersede edge → lineage preserved.

**26. Index doc + config symbols**  `(Q5-C1)` · **[NEW]** · tier-2
- **Do:** index markdown headings and json/yaml/toml keys as graph nodes.
- **Before:** headings and config keys aren't in the code graph.
- **After:** they're queryable as `heading` / `key` nodes.

**27. Time-travel code edges**  `(Q1-C1)` · **[NEW]** · **DEFERRED-speculative**
- **Before:** re-index hard-deletes edges; there's no "graph as of commit X."
- **After (if ever built):** valid/invalid timestamps on edges enable as-of-commit views.
- **Catch:** deferred — no consumer wants it, its safety is redundant with the shipped readiness gate, and it does **not** fix the real staleness bug (#20).

---

## Skill-Advisor (which skill to use)

**28. Rank-based lane fusion**  `(C3)` · **[EXISTING: weighted-sum]** · Wave 1
- **Do:** import the shared rank-based fusion so lanes combine by rank, not raw score.
- **Before:** lanes are fused by a raw weighted **sum**, which isn't comparable across lanes and relies on fragile float tie-breaks.
- **After:** lanes fuse by rank (RRF) → comparable across lanes and deterministic.

**29. Skip empty lanes**  `(C5)` · **[EXISTING: skew]** · Prove-first
- **Do:** elide a lane that runs but returns empty.
- **Before:** an empty-but-live lane (e.g. mid-rebuild) drags confidence down.
- **After:** empty lanes are dropped instead of skewing the result.
- **Catch:** must distinguish "degraded-empty" (mid-rebuild) from "matched-nothing-empty," or it **over-credits** non-matching skills — so it needs a lane-health signal first; the old "~13%" figure is unsourced.

**30. Detect a stale embedding**  `(advisor embedding-staleness)` · **[EXISTING: blind spot]** · Wave 1
- **Do:** stamp the real embedder version into the projection and compare on load.
- **Before:** the advisor stamps its embedding snapshot "generated now" at load, hiding the case where the embedding model changed underneath it.
- **After:** an embedder-version change is detected and flagged.

**31. Self-tuning lane weights**  `(C4 — bounded Beta)` · **[NEW build]** · Prove-first
- **Do:** add a bounded statistical (Beta) posterior to auto-tune lane weights.
- **Before:** lane weights are tuned by raw frequency, with no statistical bounding and no per-lane attribution.
- **After:** lane weights self-tune within safe statistical bounds.
- **Catch:** there is **no** Beta math to "graduate" — this is a build — and it needs net-new per-lane attribution too.

---

## Deep-Loop (research/review automation)

**32. Fix the crashing research template**  `(Q6-anchor FIX)` · **[EXISTING: buggy]** · Wave 0 · **the one guaranteed win**
- **Do:** add the 7 required section markers to the shipped strategy template.
- **Before:** the template carries **none** of the markers the summarize step requires, so a fresh research loop **crashes on its first reduce**.
- **After:** the loop runs. Pure template edit — no code, no dependencies.

**33. Clean shutdown**  `(graceful-self-stop)` · **[EXISTING: gap]** · Wave 0/1
- **Do:** on interrupt, flush a partial summary marked `stopped`; treat an empty tick as valid convergence.
- **Before:** on interrupt the child processes die silently with no summary, so an interrupted run can read as a clean success; an empty/no-new-findings tick is treated as a failure.
- **After:** an interrupted run is clearly marked stopped, and "nothing new this tick" counts as legitimate convergence.

**34. Requeue abandoned work**  `(orphan-lineage-reset)` · **[EXISTING: detect-only]** · Wave 1
- **Do:** on resume, reset/requeue lineages that started but never finished.
- **Before:** orphaned in-flight lineages are detectable but nothing requeues them.
- **After:** they're requeued on resume.

**35. Refuse a corrupt resume**  `(recover-vs-fresh-gate)` · **[EXISTING: silent-fresh]** · Wave 1
- **Do:** when a resume expects existing state, refuse a missing/empty/corrupt state instead of fresh-initializing.
- **Before:** a resume that should validate state silently starts fresh if the state is gone or corrupt.
- **After:** it refuses and surfaces the problem (proves existing state first).

**36. Retry a failed branch by itself**  `(fan-out transient/fatal retry)` · **[EXISTING: dispatch-once]** · Wave 1
- **Do:** classify the failure (timeout vs. fatal) and re-dispatch only the failed branch with a bounded budget.
- **Before:** a failed parallel lineage is only salvaged after the fact; there's no targeted retry.
- **After:** the one failed branch is retried alone, without re-running its siblings.

**37. The Deep-Loop "trio"**  `(merge-tiebreak / failure-class / pool-gauges)` · **[EXISTING: partial]** · Wave 0
- **Do:** stabilize the merge tie-break, surface the failure-class as labels, add backlog gauges.
- **Before:** merge dedups on `id‖title` (not a true total order); the failure-class is computed then **discarded** before the summary; there are no backlog gauges.
- **After:** deterministic merge order; failure types appear as labels; backlog is observable.
- **Catch:** merge & failure-class are weaker than first billed (ship with that caveat); gauges are clean.

**38. Reliability-weighted learning**  `(D2/D3/D1/Q2)` · **[NEW — core signal absent]** · Prove-first
- **Do:** weight evidence by source reliability in a flood-resistant way; reliability-weight the existing STOP signals.
- **Before:** evidence isn't weighted by source reliability — every input is the neutral value 0.5 — so the STOP decision can be pushed by sheer vote-count.
- **After:** more-reliable sources count for more, and certainty can't be bought with volume.
- **Catch:** the core reliability signal **doesn't exist yet** → build + benchmark before committing. The live integer scorer throws on the fractional inputs this needs (build one decimal primitive + adapters), and D3 *weights* the existing STOP conjunction — it doesn't add a new gate.

---

## Cross-cutting / shared infrastructure

**39. The total-comparator keystone**  · **[NEW shared primitive]** · Wave 0
- **Do:** build one carefully-written comparator that imposes a true total order.
- **Before:** each determinism fix would hand-roll its own ordering, and the default sort isn't a total order (values like `NaN` / `-0` break it).
- **After:** one shared comparator unlocks the whole determinism set. (Content-based ids are a second-tier dependency, not co-equal.)

**40. One shared reliability-math primitive**  · **[NEW shared]** · with #31, #38
- **Do:** build one decimal Beta primitive + thin per-consumer adapters.
- **Before:** the live integer scorer throws on fractional inputs, and each consumer would duplicate the math.
- **After:** Advisor and Deep-Loop share one correct primitive, each adapting the result to its own use.

**41. One named security probe-gate**  `(red-team probe-gate)` · **[NEW aggregator]** · Wave 1
- **Do:** add one CI gate that runs poison/injection/exfiltration probes with a zero-tolerance ceiling, plus a new probe for the deep-loop prompt-pack path.
- **Before:** per-component injection tests exist piecemeal; there's no single gate, and the prompt-pack path is unprobed.
- **After:** one gate enforces injection-resistance across seams, with structured reports.

**42. Warn on a missing freshness fingerprint**  `(fingerprint-absence → WARN)` · **[EXISTING: skip-pass]** · Wave 2
- **Do:** promote the freshness check's silent pass to a warning.
- **Before:** the completion-freshness check **passes** when the fingerprint is absent or all-zero.
- **After:** it warns.
- **Catch:** ~667 existing docs lack a fingerprint, so backfill **before** tightening (it's behind an off-by-default flag, so today's risk is zero).

---

## What we deliberately are NOT changing (and why)

For these, the **before stays the before** — on purpose. Recording the "why" is as valuable as the "do."

| Idea | Why it stays as-is |
|---|---|
| Concurrent-merge / CRDT machinery | Single writer — the conflict-free-merge machinery solves a problem we don't have. |
| Signed memory writes / provenance signatures | No untrusted writer to defend against in a single-tenant store. |
| "Memory palace" spatial model | An organizational metaphor with no traversal/eviction we'd gain from. |
| Author-assigned importance decay | Our existing scheduler (FSRS) is already richer. |
| Lift the save-receipt idea to external API calls (Code-Mode) | Different subsystem; the receipt model can't transfer. *(Flagged: Code-Mode docs say "atomic" but tested behavior is "best-effort, no rollback.")* |
| "Zero-token" retrieval tier | That's prompt-caching — a different thing from retrieval. |
| Quorum/attestation for flag-graduation | Mostly already covered by our shadow-rollout; the quorum half is decorative single-tenant. |
| Enforced namespace isolation | Cross-namespace recall is a **feature** here, not a leak; only an opt-in strict mode would matter. |
| Skill-conflict re-rank `(C1)` + query-class lane weights `(QCR)` | **Deferred** — both fix non-problems today (the conflict arrays are empty in production; no mis-routing is demonstrated). |
| Outcome-weighted skill ranking | **Proxy-only:** there's no signal that records whether a task actually *succeeded* — only whether a recommendation was accepted — so it's a from-scratch build, not a free byproduct. |

**Claims the campaign walked back about its own earlier framing:** "determinism is the one unifying theme" → only **2 of 4** subsystems share it; "just flip the off-switches" → only **one** literal flip exists; "the hidden-instruction risk is everywhere" → **disproved** (it's Memory-specific); "reuse the deep-loop ordering helper" → there is no helper to reuse (must be extracted first); "galadriel's ~84% prompt-cache saving justifies determinism" → **invalid** for our out-of-process server.

---

## Honest caveats (what might be wrong)

- **No numbers are real yet.** Every before/after value is structural inference; the highest open risk is that **nothing has been benchmarked.**
- **The single most-likely-wrong call** is the hidden-instruction (#6) threat model — its importance rests on "can untrusted content actually become a recalled memory?" We found a path where it can (a normal save), but if memories are effectively trusted-author-only, #6 shrinks toward a non-issue.
- **The history-timestamp "additivity" (#16) is unverified** — no migration spec exists; if "current" reads must move off the existing projection, the cost jumps from medium to large.
- **The 006 round has no per-iteration file backup** — its findings live in one consolidated ledger + a 50-row state log (which is why `…/../../001-speckit-memory/research/from-006-sibling-revisit/iterations/` is empty by design; re-validated during the final review).

---

## How this relates to packet 027

027 was the earlier "harden memory/search/infra" effort. The cross-packet revisit (50 iterations) checked all of 028's ideas against 027's **shipped code** and found **028 only adds — it never replaces or contradicts 027** (across ten topics: 6 "extends," 1 "already covered," 3 "doesn't transfer," zero supersedes/contradicts). 027's shipped doctrine even supplies design answers for 028's open items (e.g. 027's always-on secret-scrubber is the ready-made pattern for the hidden-instruction escaper #6).

---

## Where the detailed versions live

- **`01-go-candidates.md`** — the actionable list with effort/seam/file-line detail (the "build me" input).
- **`02-cross-packet-reconciliation.md`** — the full 028-vs-027 comparison.
- **`03-corrections-caveats-and-residuals.md`** — the complete honesty layer.
- **`04-sibling-and-cross-cutting.md`** — the cross-cutting additions from the final 50 iterations.
- **`../roadmap.md`** — the original six-theme tables + the correction addenda.
- **`../../00{1..6}-*/research/research.md`** — the per-subsystem and per-round detailed ledgers.

*Research-only (spec §3). This document describes proposed changes, not committed work.*
