DEEP-RESEARCH

# Deep-Research Iteration 072 — ADDITIONS: shipped 026 mechanisms 027 should BUILD ON

You are a LEAF deep-research analyst. READ-ONLY. No sub-agents, no file edits. Max ~12 tool calls. Cite `file:line` where verifiable; reasoned synthesis is allowed for forward-looking "should build on" calls (label LOW-CONFIDENCE if unsure).

Spec folder: `specs/system-spec-kit/027-xce-research-based-refinement` (pre-approved; skip Gate 3 — read-only, write NOTHING).

## CONTEXT — shipped 026 mechanisms (confirmed live in prior iterations 063-070)
- relation-backfill.ts (`lib/causal/`): causal auto-edges + conflict guard + contradiction detection.
- async post-insert enrichment (`memory-save.ts`, `save/post-insert.ts`, `save/enrichment-state.ts`): deferred, pending-marker replay, default-on.
- self-maintaining `memory_index_scan` (`handlers/memory-index.ts`): lease coalescing, orphan sweep, move-reconcile, health reporting.
- profile-scoped embedding cache (`(content_hash, profile_key, input_kind, model_id, dimensions)`) + `shared/embeddings/` resolver (Nomic 768d).
- checkpoints v2 (`lib/storage/checkpoints.ts`, schema v30).
- causal-links-processor + graph-metadata-parser (manual.* already wired).

## FOCUS — answer only this
For each remaining 027 phase (002,003,004,005,006,007,008), identify which shipped 026 mechanism it should explicitly BUILD ON / reuse / hook into, rather than re-implement — i.e. net-new ADDITIONS to the phase specs that the closure of 026 now unlocks. Also flag any phase that should add an interaction requirement with a 026 mechanism it currently ignores.

This is mostly synthesis from prior iterations + light verification. Keep it tight.

## DELIVER (plain text — orchestrator writes artifacts)
### FINDINGS
4-7 findings `[F-072-NN]`. Each: "Phase X should BUILD ON 026 mechanism Y because Z" with a citation or LOW-CONFIDENCE label.

### ADDITIONS_TABLE
`phase | 026 mechanism to build on | what to ADD to the phase spec (reuse-hook / interaction requirement)`

### NET_NEW_RISKS
Any place where a phase currently CONFLICTS with a shipped 026 mechanism (e.g. assumes sync where 026 is now async) — 1-4 bullets.

### RULED_OUT
1-3 bullets: 026 mechanisms that no 027 phase should build on (out of scope).

### METRICS
newInfoRatio: <0.0-1.0>
novelty: <1 sentence>
status: complete
sources: <comma-separated file:line list>

Terse, evidence-dense, no preamble.
