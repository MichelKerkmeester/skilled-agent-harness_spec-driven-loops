# 05 — All 200-Iteration Findings & Recommendations (Plain-Language Guide)

> **What this is.** A plain-English, complete tour of everything the 200-iteration research campaign found, written so you don't need to decode the shorthand (`C4-A`, `Q6-C1`, `RRF`…) used in the other synthesis docs. Each item says **what's wrong or missing today → what to do → why it matters → how big → the catch.** The short codes in `(parentheses)` cross-reference the detailed docs (`01`–`04`, `roadmap.md`, the per-child `research.md`).
>
> **The one-sentence summary.** We studied two outside memory systems (**aionforge-memory**, written in Rust; **galadriel**, written in Python) to find concrete, code-located improvements for our four internal tools — **Memory MCP** (the memory store), **Code-Graph** (the structural code index), **Skill-Advisor** (which picks which skill to use), and **Deep-Loop** (the research/review automation) — and this is the ranked result, including the things we decided *not* to do and why.
>
> **Status: research only.** Nothing here has been built or measured. This packet ends at this list; building any of it is a separate, later decision.

---

## Part 1 — Five things to know before reading the list

1. **This was a "prove-it-down" exercise, not a wish-list.** The campaign disproved or shrank more ideas than it added. Big early claims ("determinism is the unifying theme," "just flip the off-switches") were **walked back** after we opened the actual code. Treat that as a feature: what survived is what held up.

2. **No improvement here has a measured before/after number.** Every "high value / low effort" rating is an **educated guess from reading the code**, not a benchmark. If a number appears anywhere (e.g. an old "~13%"), treat it as **unverified** — capture a real baseline before quoting it.

3. **There is exactly one guaranteed, no-risk win.** A shipped template file is missing the markers a tool requires, so the tool crashes on first use. Fixing it is a pure text edit (see Wave 0, item 1). Everything else carries at least a small caveat.

4. **The biggest *security* item is real but its importance depends on a judgment call.** When the assistant is shown a remembered note, instructions hidden inside that note are **not neutralized** — so a poisoned note could hijack the assistant. The fix is clear; whether it's urgent depends on whether "anyone who can save a memory" counts as an attacker in your threat model (see the honest caveats in Part 6).

5. **Everything here *adds to* the previous packet (027); nothing conflicts with it.** Across ten revisited topics, 028 found **zero cases** where its ideas replace or contradict 027's already-shipped work (see Part 7).

---

## Part 2 — The recommendations, by priority

Grouped by **when you'd do them**: Wave 0 = do first (cheap, safe, reversible, no benchmark needed); Wave 1 = small follow-on builds; Wave 2 = bigger or schema-changing; "Prove first" = don't build until a benchmark justifies it.

### Wave 0 — do first (cheap, safe, reversible)

1. **Fix the crashing research template** *(Q6-anchor FIX).* The shipped strategy-template file carries **none** of the 7 section markers the research "reducer" requires, so a fresh research loop **crashes on its first summarize step**. Add the markers. **Pure template edit, no code, no dependencies — the only unconditional win.**

2. **Make searches return results in a stable order** *(ANN tie-stable ORDER BY).* When two vector-search results are equally close, today's query has **no tie-breaker**, so *which* results survive the cut into the final ranking can change run-to-run. Add a stable secondary sort (by id). This is the cheapest determinism win and sits *below* the ranking layer the rest of the campaign focused on, so it was easy to miss.

3. **Stop the system from rewriting its own rulebook** *(constitutional self-edit / CAS guard).* There is **no protection** against the assistant editing its own "constitutional" (protected) memories — a drifting agent could quietly re-label itself or rewrite its own redlines with no second check. Add two guards: "you may not edit your own constitutional row," and "only edit if the row still matches the hash you read" (so two writers can't clobber each other). The code already knows which rows are constitutional; only the checks are missing.

4. **Turn on the duplicate-save safety net** *(C4-A idempotency-receipts default-on).* A built-but-**switched-off** system records "I already saved this" receipts so that a crash-and-retry doesn't save the same thing twice. Turn it on. **Catch:** only the receipt + content-based-id half is real; the originally-claimed "replay into the deferred-save path" wiring was **disproved** — don't budget for it.

5. **Don't crash when the embedding model is down** *(C9 graceful degrade).* Today, if the embedding model is unavailable, **recall throws an error** instead of falling back. The keyword-search fallback already exists in the code — it's just not wired up. Route "no embedding" → keyword search + report "embedder unavailable."

6. **Break score-ties by content, not by row number** *(C5-B).* When results tie on score, today's tie-break uses the internal database row id. Switch to a content-derived hash so the order is **stable across rebuilds and across databases** (a byte-cache downstream will notice). Small, and it reuses an existing hash function.

7. **Make the "older = slightly lower rank" decay consistent** *(C-X1 + C6-A).* Two related ranking fixes: (a) when search blends several signal "channels," zeroing one channel currently distorts the bonus math for the survivors — expose the existing correct denominator as a named setting; (b) apply the age-decay at ranking time from a supplied clock, not only when a memory happens to be accessed.

8. **Add simple health counters** *(gauges: pending / failed / lag).* Expose "how much background work is pending," "how much failed," and "how stale is the oldest pending item" — reusing stats that already exist, no new bookkeeping.

9. **Two small Code-Graph ranking/robustness wins** *(Q4-C1, det-order).* (a) The code-index stores "confidence" and "evidence" on each result but **never uses them in ranking** — blend them in *additively* (not by multiplying, which would scramble ties). *Needs a benchmark.* (b) Make the impact-walk output reproducible with a single stable tie-break that covers all walk modes.

10. **Two recovered Memory fixes** *(never-truncate, system-kind-exclusion).* (a) The "always show the identity/constitutional notes first" prefix **counts toward the result limit but is never itself capped**, so it can silently crowd out the normal results — fix the truncation. (b) Exclude internal "system"-kind rows from normal recall (with an admin path to see them).

### Wave 1 — small follow-on builds (depend on Wave-0 groundwork; no schema change)

- **Neutralize hidden instructions in recalled notes** *(the real C8 — source_kind-gated render escaper).* When a remembered note is shown to the assistant, escape its **content body** so embedded instructions are treated as *data, not commands* — gated by where the note came from (`source_kind`): pass-through for human-written, escape for agent/import/system. The "where it came from" tag already reaches the display layer; it's simply **never used** there today. *(This is the robust, narrow version; the broad "this risk is everywhere" claim was disproved — see Part 5.)*

- **Block injection at save-time too** *(write-time-injection-filter).* The companion to the item above: strip/flag prompt-injection markers **when content is first captured** (today the capture filter only redacts secrets like API keys). Two layers: stop it going in, neutralize it coming out.

- **Turn off graph-expansion for simple lookups** *(C2-C, query-class routing).* "Find this one exact thing" and "trace everything connected" need different search shapes. Expanding the graph for a single-hop lookup **hurts precision**. Reuse the existing primitive to switch expansion off for simple queries.

- **Retry a failed research branch by itself** *(fan-out transient/fatal retry).* When one parallel research "lineage" fails, today the system just salvages files after the fact. Instead, classify the failure (timeout vs fatal) and **re-run only the failed branch** with a bounded budget. The needed failure-ledger already exists.

- **Detect a stale Advisor embedding** *(advisor embedding-staleness).* The Advisor stamps its embedding snapshot as "generated now" every time it loads, which **hides** the case where the embedding model changed underneath it. Stamp the actual model version and compare on load.

- **One named security test gate** *(red-team probe-gate).* Per-component injection defenses + tests already exist piecemeal. Add **one** continuous-integration gate that runs poison/injection/exfiltration probes with a zero-tolerance ceiling, plus one new probe for the deep-loop prompt-pack path.

- **Repair the real "stale code edges" bug** *(CG-edge-staleness / dependency-transitivity).* A file whose **dependency** changed — but whose own content didn't — gets **skipped** during re-indexing, so its edges silently go stale and are never repaired. The query that finds dependents already exists; it's just **not wired into the scan loop**. *(Note: the skip is content-hash-based, not timestamp-based — an earlier doc said "mtime," which was wrong.)*

- **Expose "what did memory look like back then"** *(memory_history as-of tool)* and **protect labeled memories from auto-forget** *(forget-allowlist)* — both small: the first wires up an already-built-but-hidden resolver; the second adds a protect-list (needs a label column).

### Wave 2 — bigger or schema-changing (gated)

- **Make "no longer current" mean closing an edge, not deleting** *(bi-temporal currentness: C3-A/B/C, C4-B).* Model a superseded fact as *closed* (still readable as history) rather than destroyed, with proper event-time + transaction-time timestamps and "show me memory as of time X" modes. **Catch:** the originally-claimed "just flip a flag" is wrong — the flag is already on; this is a **read-side build plus store reconciliation**, and the "additivity" of the timestamp change is **unverified** (no migration spec exists to check).

- **Don't duplicate on a crash-during-save** *(transport idempotency).* The save-receipt is written **after and outside** the save transaction, so a crash in between lets a retry duplicate the secondary index. Thread the idempotency token through the daemon channel into the save handler.

- **Stop the never-ending background retry** *(enrichment retry-budget + dead-letter).* Background enrichment replays stuck work on **every boot, forever**. Add a retry cap and a terminal "failed" state so a poison item gives up.

- **Warn when a freshness fingerprint is missing** *(fingerprint-absence → WARN).* A completion-freshness check currently **passes** when the fingerprint is absent or all-zero. Promote that to a warning. **Catch:** ~667 existing docs lack a fingerprint, so this must be **backfilled before** the check is tightened (it's behind an off-by-default flag, so today's risk is zero).

- **Smarter Code-Graph ranking + parser recovery** *(Q3-C1 PPR, Q2-C1).* (a) Rank code-impact by a query-seeded multi-hop walk instead of just counting edges — reusing 027's existing graph-traversal. (b) A file that fails to parse is currently skipped **permanently**; split transient failures (retry up to a limit) from fatal ones so a temporary glitch doesn't drop a file forever.

### Prove it first — build + benchmark before committing

- **Reliability-weighted learning** *(Deep-Loop D2/D3/D1/Q2).* The idea: weight evidence by how reliable its source is, in a way that can't be flooded by sheer vote-count. **Reality:** the core signal **does not exist yet** — every input is the neutral value 0.5 today — so this is a from-scratch build whose benefit is unmeasured. Don't start until it's built and a small benchmark shows it beats the signals we already have. *(Detail: the live integer scorer actually throws on the fractional inputs this needs, so build one shared decimal primitive + thin adapters; and the STOP decision already combines signals correctly — the job is to *weight* those signals, not add a new gate.)*

- **Advisor auto-tuning** *(C4, C5).* C4 is a **build, not a "graduation"** — there is no statistical (Beta) math in the current estimator to graduate; it's plain frequency counting, and it lacks the per-lane attribution a real auto-tune needs. C5 (skip empty lanes) needs a captured baseline first **and** a correctness guard: naively skipping empty lanes would **over-credit** non-matching skills unless it can tell "lane is mid-rebuild" from "lane genuinely matched nothing" — so it needs a lane-health signal as a prerequisite.

- **Code-Graph time-travel & PageRank** — shared schema migration + the PageRank walk is unbuilt (see the deferrals in Part 5).

---

## Part 3 — Shared building blocks (build once, reuse several times)

- **A proper total-comparator is THE keystone.** Almost every "make it deterministic" fix depends on one carefully-written comparator that imposes a *total order* (the default JavaScript sort does **not** — values like `NaN`/`-0` break it). Build this one thing first; several fixes unlock for free.
- **Content-based ids are second-tier** — needed only by the identity/tie-break subset, not co-equal with the comparator.
- **One shared "reliability" math primitive** (a bounded Beta posterior) serves both the Advisor and Deep-Loop — but build it as **one decimal primitive plus per-user adapters**, because the existing integer version throws on the fractional inputs, and each consumer uses the result differently.
- **One shared validity-window shape** for "current vs historical" serves both Memory and Code-Graph — but **exclude** the retention/time-to-live deletion path (physically deleting old data is the *opposite* of "keep it as closed history").

---

## Part 4 — Findings we almost lost (recovered by the final review)

The campaign tended to carry **one** candidate out of each deep research round and quietly drop its siblings. The final fresh-agent review recovered these — all confirmed in the research record, none previously on any list:

**Memory:**
- **Honest delete report** *(residual-retention-report)* — a delete should report *where bytes still physically live* (dead row slots, vector tombstones until compaction) instead of claiming "gone." Small, additive.
- **Summaries must not silently lose detail** *(detail-retention-guard)* — a generated summary must keep ≥90% of the distinct entities and a minimum source confidence, or it isn't written (the raw stays). Prevents lossy auto-summaries.
- **Refuse a whole erase if any namespace says no** / **safe un-forget** / **don't let the audit log leak the query** *(erasure-cascade, unforget, exfil-audit)* — mostly **deferred** (their full forms need their own packet or a benchmark), but recorded so they aren't lost.

**Deep-Loop:**
- **Exit cleanly on shutdown** *(graceful-self-stop)* — on interrupt, flush a partial summary with a "stopped" marker (today the child processes die silently, so consumers can mis-read an interrupted run as a clean success); and treat an "empty / nothing-new" tick as **valid convergence**, not a failure.
- **Requeue abandoned work on resume** *(orphan-lineage-reset)* — detect lineages that started but never finished and requeue them (the detection exists; the requeue doesn't).
- **Refuse a corrupt resume** *(recover-vs-fresh-gate)* — if a resume expects existing state but finds it missing/corrupt, **refuse** rather than silently starting fresh.

---

## Part 5 — What we deliberately are NOT doing (and why)

These were investigated and **ruled out** — recording the "why" is as valuable as the "do":

- **Concurrent-merge / CRDT machinery** — our store has a single writer; the conflict-free-merge machinery solves a problem we don't have.
- **Signing memory writes / provenance signatures** — there's no untrusted writer to defend against in a single-tenant store.
- **The "memory palace" spatial model** — it's an organizational metaphor with no traversal/eviction we'd gain from.
- **Author-assigned importance decay** — our existing scheduler (FSRS) is already richer.
- **Lifting the save-receipt idea to external API calls (Code-Mode)** — different subsystem; the receipt model can't transfer. *(Side note: a doc bug was flagged — Code-Mode's docs say "atomic" but the tested behavior is "best-effort, no rollback.")*
- **"Zero-token" retrieval tier** — that's prompt-caching, which is a different thing from retrieval.
- **Quorum/attestation for flag-graduation** — mostly already covered by our shadow-rollout; the "quorum" half is decorative for a single-tenant store.
- **Enforced namespace isolation** — cross-namespace recall is a **feature** here, not a leak; only an opt-in strict-isolation mode would be worth flagging.

**Claims the campaign walked back about itself (important honesty):**
- *"Determinism is the one unifying theme"* → only **2 of 4** subsystems genuinely share it.
- *"Just flip the off-switches"* → only **one** candidate is a literal flip; the others need real work.
- *"Skill rankings can learn from task outcomes" (procedural-outcome-ranking)* → **proxy-only**: there is **no signal that records whether a task actually succeeded** — only whether a recommendation was accepted — so this is a from-scratch build, not a free byproduct.
- *"The hidden-instruction risk is everywhere" (cross-cutting C8)* → **disproved**: the Code-Graph display is already escaped + trusted-source, and the deep-loop sink is dead code. The risk is **Memory-specific**, which is why the fix narrowed to the source_kind escaper in Wave 1.
- *"Reuse the deep-loop ordering helper"* → there **is** no reusable helper; it would have to be extracted first.
- *"galadriel's ~84% prompt-cache saving justifies determinism"* → **invalid** for our out-of-process server (that saving is a property of an in-process agent; our server makes no such API calls). Determinism stands on reproducibility/testability instead.

---

## Part 6 — The honest caveats (what might be wrong)

- **No numbers are real yet.** Every value/effort tag is structural inference. The highest open risk across the whole campaign is simply that **nothing has been benchmarked.**
- **The single most-likely-wrong call:** the **hidden-instruction (C8) threat model.** Its importance rests entirely on the question *"can untrusted content actually become a recalled memory?"* — we found a path where it can (via a normal save), but if memories are effectively trusted-author-only, this shrinks toward a non-issue.
- **The "history timestamps are purely additive" claim is unverified** — there's no migration spec to check it against; if "current" reads have to move off the existing projection, the cost jumps from medium to large.
- **The 006 round has no per-iteration backup** — its findings were consolidated directly into one ledger (its raw record is a 50-row state log), so that ledger is the sole source of truth for that round (re-checked during the final review).

---

## Part 7 — How 028 relates to the previous packet (027)

027 was the earlier "harden the memory/search/infra" effort. The cross-packet revisit (50 iterations) checked all of 028's ideas against 027's **shipped code** and found:

- **028 only adds; it never replaces or contradicts 027** — across ten revisited topics: 6 "extends," 1 "already covered," 3 "doesn't transfer," and **zero** supersedes/contradicts.
- **027 even answers 028's open questions** — for example, 027's always-on secret-scrubber is the ready-made *pattern* for the hidden-instruction escaper; 027's "build-it-behind-a-flag isn't the same as shipping value" lesson independently confirms 028's own "stop over-claiming the off-switches" correction.

---

## Part 8 — Quick index by subsystem

| Subsystem | The headline wins | The honest "not yet" |
|---|---|---|
| **Memory MCP** (primary) | stable search order; turn on the duplicate-save net; don't crash without an embedder; the hidden-instruction escaper; honest delete report; don't let always-surface notes starve results | the history-timestamp rebuild (unverified); auto-forget/erasure cascades (own packet) |
| **Code-Graph** | repair the real stale-edge bug; use the confidence fields in ranking; recover from transient parse failures | time-travel edges (no consumer); query-seeded PageRank (unbuilt); closed vocabulary (needs a migration) |
| **Skill-Advisor** | import rank-based fusion; detect a stale embedding | auto-tuning (a build, not a tweak; needs attribution + a baseline); skip-empty-lanes (needs a lane-health signal first) |
| **Deep-Loop** | **the template crash fix**; clean shutdown; requeue abandoned work; retry a failed branch alone | reliability-weighted learning (the core signal doesn't exist yet) |

---

## Where the detailed versions live

- **`01-go-candidates.md`** — the actionable list with effort/seam/file-line detail (the "build me" input).
- **`02-cross-packet-reconciliation.md`** — the full 028-vs-027 comparison.
- **`03-corrections-caveats-and-residuals.md`** — the complete honesty layer.
- **`04-sibling-and-cross-cutting.md`** — the cross-cutting additions from the final 50 iterations.
- **`../roadmap.md`** — the original six-theme tables + the append-only correction addenda.
- **`../../00{1..6}-*/research/research.md`** — the per-subsystem and per-round detailed ledgers.

*Research-only (spec §3). Implementation is a separate, later decision; this document describes findings, not committed work.*
