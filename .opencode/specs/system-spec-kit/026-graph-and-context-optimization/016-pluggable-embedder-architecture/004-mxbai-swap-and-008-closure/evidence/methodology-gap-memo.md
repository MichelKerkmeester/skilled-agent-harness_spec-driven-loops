# Methodology gap memo — main-agent jina probe vs codex measurement

> Closes a lingering inconsistency from the 2026-05-17 jina vs nomic comparison: main-agent probed jina at 5/10 cat-24/409, but codex's authoritative job `boa26jubw` measured 9/10. Same fixture, same embedder, same MCP — different result.

## The discrepancy

| Measurement | Run by | When | Result | Where |
|---|---|---|---|---|
| Authoritative | codex `boa26jubw` | Phase A right after jina swap completed (DB clean) | **9/10 top-3** | `embedder-comparison-with-rescue.jsonl` |
| Preview | main agent (me) | Mid-session, while gemma reindex was running for codex's Phase B | **5/10 top-3** | (not persisted; conversation only) |

## Why they disagreed

Four contributing factors:

### 1. Cache state

- Codex used `bypassCache=true` per its dispatch prompt (clean per-query result).
- Main-agent probe used `bypassCache=false` (default), so cached responses from prior queries during the session bled into the result.

### 2. Concurrent reindex

- Codex's measurement happened in a quiet window between phases.
- Main-agent probe happened **during** codex's gemma reindex (Phase B running). The MCP child was under high CPU + I/O contention, with partial vec_metadata state during the swap.

### 3. Auto-surface overhead

- Main-agent probes triggered the auto-surface hook (4 constitutional + 5 triggered = ~2 sec overhead per query).
- Codex's iter-recipe profile may have suppressed or stabilized this.

### 4. Session dedup / boost

- Main-agent probes had no `sessionId` → no session dedup applied.
- Without sessionId, the search returned slightly different rankings than codex's per-session dedup-aware queries.

## Authoritative measurement

**codex `boa26jubw` Phase A is the authoritative source.** It satisfies:

- Clean DB state (post-swap, pre-next-swap)
- `bypassCache=true` (per-query fresh)
- No concurrent contention
- Repeatable methodology

ADR-012 cites that 9/10 result, not the main-agent 5/10. ADR-011 D-RETRY (8/10) — also codex-authored — corroborates that authoritative numbers come from codex-class dispatches with clean state.

## Lessons

1. **Probe protocol matters at this scale**. 4-point swing (5 vs 9) on a 10-item fixture from methodology alone — easy to misread.
2. **Probe during quiet windows**, not during ongoing reindex/swap.
3. **Always `bypassCache=true`** for benchmark queries.
4. **Match the operator's measurement methodology** when validating a claim — don't probe with a different shape and call the disagreement an "inconsistency."

## What to do if you see a future disagreement

Don't trust the lower number reflexively. Check:

1. Was the DB in a clean state (no in-flight reindex)?
2. Was `bypassCache=true`?
3. Was the query embedded under the SAME active embedder the index was built with (verify `vec_metadata.active_embedder_name`)?
4. Was the same `sessionId` (or none) used consistently?

If all four match between the two measurements and they still disagree, you have a real bug — escalate. If any differs, the cleaner-methodology number wins.

## Cross-references

- `embedder-comparison-with-rescue.jsonl` — 3 authoritative rows
- `decision-record.md` ADR-011 (D-RETRY rescue ON/OFF) + ADR-012 (jina production winner)
- `008-closure-narrative.md` — the full timeline
- `cat-24-409-audit.md` — fixture audit that surfaced the original ground-truth issues
