DEEP-RESEARCH

# Deep-Research Iteration 066 — packet-wide path-drift map (live → corrected)

You are a LEAF deep-research analyst. READ-ONLY. No sub-agents, no file edits. Max ~12 tool calls. Cite `file:line` or "exists/absent" via grep.

Spec folder: `specs/system-spec-kit/027-xce-research-based-refinement` (pre-approved; skip Gate 3 — read-only, write NOTHING).

## CONTEXT
- 027 phase specs cite affected files under `mcp_server/lib/...`. Many have moved. Prior iterations already confirmed live locations: `relation-backfill.ts` → `lib/causal/`, `causal-edges.ts`/`consolidation.ts` → `lib/storage/`, `memory-retention-sweep.ts` → `lib/governance/`, `vector-index-schema.ts` → `lib/search/`.
- The 2026-06-05 audit claimed these drifts: `lib/causal/`→`lib/storage/`, `lib/memory/`→`lib/governance/`, `lib/embeddings/`→`shared/embeddings/`, `lib/triggers/` absent, `lib/storage/vector-index-schema.ts`→`lib/search/vector-index-schema.ts`. NOTE iteration 063/064 showed `lib/causal/` STILL EXISTS (relation-backfill is there) — so the audit's blanket `lib/causal→lib/storage` is WRONG. Resolve the truth.

## FOCUS — answer only this
Produce the AUTHORITATIVE old→live path map for the file families the 027 phase specs depend on. For each, confirm the live location by existence-check.
Do this efficiently:
1. List the real lib tree: `ls .opencode/skills/system-spec-kit/mcp_server/lib/` then `ls` the relevant subdirs (storage, causal, governance, search, parsing, graph, indexing, feedback, embeddings).
2. Also check `shared/embeddings/` location: `ls .opencode/skills/system-spec-kit/shared/ 2>/dev/null; ls .opencode/skills/system-spec-kit/mcp_server/lib/embeddings 2>/dev/null`.
3. Locate the canonical files each phase needs: relation-backfill.ts, causal-edges.ts, consolidation.ts, memory-retention-sweep.ts, vector-index-schema.ts, incremental-index.ts, trigger-matcher.ts (lib/triggers? lib/parsing?), batch-learning.ts, feedback-ledger.ts, the embedding resolver.
4. Grep each 027 phase spec's "Files to Change"/affected paths for which ones are STALE vs live.

## DELIVER (plain text — orchestrator writes artifacts)
### FINDINGS
3-6 findings `[F-066-NN]`. Must explicitly correct or confirm the audit's 5 claimed drifts.

### PATH_MAP
`canonical file | spec-claimed path (if any) | LIVE path | status (OK/STALE)` — one row per file family above.

### PER_PHASE_REPATH
Bullet per phase (002-008) listing which affected-file paths need correcting (or "none").

### RULED_OUT
1-3 bullets (e.g., families that did NOT move).

### METRICS
newInfoRatio: <0.0-1.0>
novelty: <1 sentence>
status: complete
sources: <comma-separated file:line / existence list>

Terse, evidence-dense, no preamble.
