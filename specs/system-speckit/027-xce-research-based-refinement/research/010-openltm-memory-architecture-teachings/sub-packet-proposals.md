---
title: "Sub-Packet Proposals — OpenLTM Teachings Adoption"
description: "Concrete, scoped change proposals for the surviving OpenLTM teachings (research phase 010), mapped to system-spec-kit surfaces and 027 children. Proposals only — no implementation; each adopted item becomes a separate Gate-3 packet."
---

# Sub-Packet Proposals — OpenLTM Teachings Adoption

Derived from `research.md` §3 (ranked teachings) and §5 (adversarial survivors). **Proposals only** — no code changes here; each accepted item is scoped as its own Gate-3 packet or as an amendment to an existing 027 child. Priority = value × confidence ÷ risk, after adversarial review. Exact child-number assignment (new child vs. amend existing) is an operator decision; confident mappings are noted, the rest are marked "new sub-packet / operator-assign".

OpenLTM is MIT — these are **re-implementations of design patterns**, not code ports.

---

## ★ Continuation correction (iterations 011–015) — apply this filter FIRST

Iterations 011–015 re-tiered every teaching under the fact that **our memory is spec-documentation-based** (authored docs = truth, DB = derived index) while **OpenLTM is row-based** (`db.ts:317-366`). This **supersedes parts of P1–P5 below**. Read this first; the original P1–P5 are kept for traceability with correction annotations.

**Corrected priority order:**

| New rank | Proposal | Storage-fit | Change vs original |
| --- | --- | --- | --- |
| **1** | **Pre-index secret redaction** (was P1) | TRANSFERS | **Unchanged** — still the standout. Amend `002-memory-write-safety`. |
| **2** | **Per-doc content-fingerprint indexing** — hash each spec doc; skip re-embed when unchanged, force re-index/re-embed when it changes; keep FTS in sync via triggers on the derived index + rebuild migrations | DOC-ANALOG (high-fit) | **NEW** (iters 013/014). The best index-layer win for an *edited-document* corpus; folds in the old #9/#11 "rebuildable vectors keyed by model/dim". |
| **3** | **Retrieval/memory observability**, keyed to **doc path/anchor not row IDs** — actual-ranker `why_ranked`, inline `contradicts`/`supersedes` warnings, explicit vector-degradation signal, maintenance counters (was P3) | DOC-ANALOG | Survives, with the doc-anchor re-shaping. |
| **4** | **Continuity/session resilience** — bounded startup restore panel with restored/not-restored status; **PreCompact snapshot that refreshes *authored* continuity docs** (not a DB-derived truth surface); goal/decision/progress/gotcha as a continuity-summary taxonomy (was part of P5) | TRANSFERS / DOC-ANALOG | **Elevated** (iters 012/015). Best architectural fit — markdown is our native format. |
| **5** | **Reshaped capture, opt-in only** (was P2) — auto-mining may only emit **reviewed `handover.md` / `_memory.continuity` doc-patch suggestions** at deliberate save; **never** admit a memory directly; all capture behind default-off gates | DOC-ANALOG | **Re-shaped** — not "propose a memory row" but "propose an authored doc-patch." |

**Dropped to negative knowledge (were P4 / ADAPT, now ROW-COUPLED REJECT):**
- **Narrow `learn/reinforce` write contract + `confirm_count`** — repeated authored-doc saves are deliberate edits or no-ops, not epistemic reinforcement (`db.ts:317-347`).
- **Normalized per-row provenance source-kind** — redundant; the authored doc + git history + continuity frontmatter already carry source traceability (`migrations/008_*`).
- **Per-row before/after audit of canonical content** — that is git's job over docs. *Only* a narrow audit of **derived-index destructive ops** (index repair, retention sweep, MCP delete) survives as DOC-ANALOG.
- **Row dedup/merge, git-diff-to-memory, silent progress rows** — all row-coupled; see `research.md` §8.1.

> The original P1–P5 below predate this correction. Where they conflict with the table above, **the table wins**. Full reasoning: `research.md` §8.

---

## Priority 1 — Memory write-path secret redaction ★ (highest value)

**Teaching #1 (ADOPT, UPHELD-strongest).** OpenLTM runs an ordered regex scrubber at the head of `learn()`, **before** dedup-hash, FTS, embeddings, markdown export, and relation writes, replacing matches with typed markers like `[REDACTED:aws-access-key]` (`secretsScrubber.ts:17`; `db.ts:307,352`).

**Why it transfers:** FSRS, causal edges, and co-activation do nothing once a secret is embedded into the ollama-nomic vector store or written into the SQLite index — the leak is durable and propagates to every downstream cache. Our extraction path has some redaction, but **direct spec-doc save/index paths can still persist raw content** (`research.md` §2, secret-redaction row).

**Proposed scope (new sub-packet, or amend `027/002-memory-write-safety`):**
- A single redaction pass applied on **all** persistence/index entry points (`memory_save`, `memory_index_scan`, embedding + FTS mutation paths), positioned **before** content-hash/dedup, embedding, and FTS write.
- Scrub **all** secret-bearing fields, not just body: title, summary, trigger phrases, provenance strings (avoid OpenLTM's content-only gap — `db.ts:350,382`).
- **Fail-closed**, not fail-open: on scrubber error, refuse the write rather than persist raw text (OpenLTM's `secretsScrubber.ts:100` fail-open is explicitly listed as negative knowledge).
- Typed redaction markers (for operator diagnosis without exposing values).
- **Risk:** MED (false positives / over-redaction) → ship behind a config flag with a redaction audit count surfaced in `memory_health`.

---

## Priority 2 — Propose-don't-mutate for memory admission & dedup

**Teaching #2 (ADOPT, UPHELD scoped).** OpenLTM stages auto-mined memories and duplicate merges as **proposals**, never silent durable mutation (`promote.ts:89`; `dedup.ts:211`; `hooks/lib/proposalQueue.ts:14`).

**Why it transfers:** We already have shadow-first reducers for **feedback weight changes**, but **memory admission** (transcript/git auto-extraction) and **destructive dedup merges** are not equally gated. Blind admission injects noise; blind merge can corrupt causal lineage.

**Proposed scope (extend existing shadow-first learning-feedback subsystem):**
- Route auto-mined memory candidates (any non-explicit-user-save origin) through a **proposed-memory review queue** before durable admission — mirror the existing shadow-reducer gating.
- Make semantic dedup emit **merge proposals**, never auto-merge (avoid OpenLTM's risk and our own — `research.md` §6, 200-char dedupe row); use scoped hashes / atomic upsert keyed by folder+category+actor, not a flat 200-char normalized text key.
- **Negative-knowledge guardrail:** do NOT auto-learn raw git diffs into durable memory (`GitCommit.ts:117`) — route to the same proposal queue with provenance.
- **Risk:** MED · depends on the existing reducer surface.

---

## Priority 3 — Recall & memory observability (bundle)

A cluster of low-risk ADAPT deltas that share a theme ("explain every retrieval path"). Best as **one new sub-packet** with several small surfaces.

| Item | Teaching | Target | Notes |
| --- | --- | --- | --- |
| Actual-ranker `why_ranked` | #3 (ADAPT) | `memory_search(includeTrace)`, `memory_context(profile=debug)` | Extend existing `includeTrace` to emit a compact per-result breakdown of the **actual** fused ranker (vector/BM25/FTS/graph/trigger/FSRS contributions) — NOT a display-only formula (`research.md` §6). |
| Inline contradiction/supersession warnings | #4 (ADAPT) | `memory_search`, `memory_context`, response formatter | We already store `contradicts`/`supersedes`; surface them **where agents consume memories**, not only in graph-debug (`graph.ts:235`). Couple `supersedes` suppression to a verified record state (avoid OpenLTM's no-op `relate()` — `db.ts:603`). |
| Explicit vector-degradation state | #8 (ADAPT) | `embedder_*`, `memory_health`, `memory_search` trace | Surface a **recall-time** degraded signal when the local ollama embedder/shard is unavailable, so answers aren't silently lexical-only (`providers/disabled.ts:12`). |
| Provenance source-kind enum + batch lookup | #6 (ADAPT) | `memory_index`, `memory_save`, `includeTrace` | Controlled source-kind taxonomy (session / scan / import / promotion / janitor) + on-demand batch provenance, not freeform strings only (`migrations/008_*:9`). |
| Maintenance observability | #13 (ADAPT) | `memory_health`, `memory_index_scan`, retention sweep | Last-run counters + stale-candidate reports (no heavy janitor — keep the self-maintaining index as the core; `janitor/index.ts:130`). |

**Risk:** LOW across the bundle.

---

## Priority 4 — Write contract & durable-mutation audit

| Item | Teaching | Target | Notes |
| --- | --- | --- | --- |
| Narrow atomic `learn/reinforce` primitive | #5 (ADAPT) | New small write MCP contract beside `memory_save` | Returns `created\|reinforced\|unchanged` + reinforcement count; requires actor + provenance; capability discovery so other tools needn't understand the full 37-tool surface (`db.ts:321`; `ROADMAP.md:147`). **Reinforcement feeds FSRS/validation strength — NOT a `confirm_count` immortality shield** (`research.md` §6). |
| Slim audit + deletion tombstones | #7 (ADAPT) | Mutation ledger, `memory_delete`, `memory_bulk_delete`, retention sweep | Slim text/metadata before/after snapshots (exclude vector payloads); deletion lineage that survives cleanup (`dao/provenanceAudit.ts:15`). **Fail-closed** audit writes (avoid `db.ts:132` fail-open). |

**Risk:** MED · the `learn/reinforce` contract is a new public seam — version it from day one.

---

## Priority 5 — Resilience & schema hygiene (lower urgency)

| Item | Teaching | Verdict | Notes |
| --- | --- | --- | --- |
| Bounded emergency context envelope + PreCompact snapshot | #9 (ADAPT) | UPHELD | Fixed per-section line budgets with explicit omitted-counts; a durable low-tech markdown snapshot beside the richer hook cache, for compaction/hook-cache-loss resilience (`context.ts:30`; `PreCompact.ts:56`). Complements (does not replace) the continuity ladder. |
| Trigger-deficit → semantic rescue | #10 (ADAPT) | UPHELD (scoped) | Only on the **trigger-first fast paths** (`memory_match_triggers`, `memory_quick_search`): if candidates < target N, backfill semantic candidates before returning (`db.ts:444`). Full `memory_search` is already fused — do not touch it. |
| Vector indexes keyed by model/dim metadata | #11 (ADOPT→ADAPT) | DOWNGRADED | We already reconcile vectors; the only delta is attaching model/dim/status metadata to the active shard for safer reconciliation (`migrations/010_*:5`). Fold into Priority 3/4, don't packet separately. |
| Numbered migrations + checksums + baseline sentinel | #12 (ADAPT) | UPHELD (caveat) | Real auditability gain but **generic engineering hygiene**, not memory-specific. Adopt opportunistically with the next schema change, not as a standalone packet. |

**Deferred (do not packet now):**
- **#14 explicit FTS-rebuild migrations (ADAPT→DEFER):** the self-maintaining incremental index already keeps FTS coverage; explicit rebuild migrations are marginal (`research.md` §5).
- All multi-tenant / fleet / provider-proliferation / graph-UI items — see `research.md` §6 negative knowledge.

---

## Suggested sequencing

1. **P1 (secret redaction)** — ship first; it is a safety gap and largely independent. Amend `027/002-memory-write-safety`.
2. **P2 (propose-don't-mutate admission/dedup)** — builds on the existing shadow-reducer surface.
3. **P3 (observability bundle)** — low risk, high operator value, mostly additive to `includeTrace` / `memory_health`.
4. **P4 (write contract + audit)** — version-locked new seam; do after P1/P2 set the write-path conventions.
5. **P5 (resilience/hygiene)** — opportunistic.

> Each accepted proposal is a separate Gate-3 packet (new child or amendment). This document is research output only — no scope is frozen and no implementation is implied.
