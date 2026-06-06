DEEP-RESEARCH

# Deep-Research Iteration 067 — 007 embedding-profile rescope (Voyage/1024d dead → Nomic/768d)

You are a LEAF deep-research analyst. READ-ONLY. No sub-agents, no file edits. Max ~12 tool calls. Cite `file:line`.

Spec folder: `specs/system-spec-kit/027-xce-research-based-refinement` (pre-approved; skip Gate 3 — read-only, write NOTHING).

## CONTEXT
- LIVE embedder (verified): ollama `nomic-embed-text-v1.5` **768-dim**, EMBEDDINGS_PROVIDER=auto, Voyage/OpenAI keys unset. llama-cpp purged; consolidated to Nomic. Cache is profile-scoped (`profile_key` + `input_kind`).
- 027 Phase 007 (`007-semantic-trigger-fallback`) = hybrid lexical+semantic trigger matcher, lexical-first/default-off, semantic shadow→union promotion. Its spec/plan/decision-record assume **Voyage-4 1024-dim** and a reusable Voyage cache.
- The audit said: 007's Voyage/1024 assumption is DEAD; the soft-dep `028/004-code-graph-adoption-eval` folder does NOT exist. Rescope to the active EmbeddingProfile; parameterize threshold/goldens.

## FOCUS — answer only this
Enumerate every Voyage/1024d/embedding-cache-reuse assumption in 007 and produce the rescope to the live Nomic-768d profile-scoped model.
Read:
1. `007-semantic-trigger-fallback/{spec.md,plan.md,decision-record.md,implementation-summary.md}` (grep them for `voyage|1024|embedding|cache|028|coco`).
2. The live embedding profile + cache: grep `profile_key|input_kind|EmbeddingProfile|active_embedder|768|1024` under `.opencode/skills/system-spec-kit/shared/` and `.opencode/skills/system-spec-kit/mcp_server/lib/` (embedding resolver + vector cache).
3. The live trigger matcher (lexical today): grep `trigger-matcher` under mcp_server/lib.

## DELIVER (plain text — orchestrator writes artifacts)
### FINDINGS
3-6 findings `[F-067-NN]`. Cover: every dead Voyage/1024 ref; whether a Voyage cache can be assumed reusable (profile-scoped → NO); the missing 028 soft-dep; what the live EmbeddingProfile/cache key actually is.

### RESCOPE_007
Bullet list: each Voyage/1024/cache assumption → its Nomic-768d/profile-scoped replacement. Include: threshold/goldens parameterization, dim change, cache-key reality, and the replacement for the missing 028/004 eval dependency ("equivalent shadow/promotion evidence").

### COCO_IN_007
Any coco refs in 007 docs (REMOVE/REWRITE) — 007 docs were flagged earlier as containing coco.

### VERDICT
007 = {NEEDS-RESCOPE | ...} + the headline rescope.

### RULED_OUT
1-3 bullets.

### METRICS
newInfoRatio: <0.0-1.0>
novelty: <1 sentence>
status: complete
sources: <comma-separated file:line list>

Terse, evidence-dense, no preamble.
