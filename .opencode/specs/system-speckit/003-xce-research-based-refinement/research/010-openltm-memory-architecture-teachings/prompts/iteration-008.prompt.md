You are a senior memory-systems research analyst performing READ-ONLY analysis. Do NOT write, create, edit, or delete any files, and do NOT run state-mutating commands. Your final answer text IS the deliverable.

# TARGET — study this (read its source)
OpenLTM, an open-source long-term-memory plugin for AI coding agents, vendored at:
`specs/system-spec-kit/027-xce-research-based-refinement/external/OpenLtm-main/`
Stack: Bun + TypeScript; SQLite (WAL) + FTS5(BM25) + optional sqlite-vec; pluggable embedding providers; lifecycle hooks; janitor maintenance; typed knowledge graph. All file paths below are relative to that `OpenLtm-main/` root — read the actual files before claiming anything.

# CONSUMER — compare against this (what we want to improve)
system-spec-kit Memory: a LOCAL single-user continuity store — SQLite index + a SEPARATE vector store (ollama nomic, 768d); semantic + lexical trigger-phrase matching; importance tiers; causal edges between memories; FSRS-based decay + co-activation; a self-maintaining incremental index; shadow-first learning-feedback reducers; a spec-folder continuity ladder (handover.md / implementation-summary.md continuity frontmatter); a 37-tool MCP surface. Both systems are single-user and local, so the gap is DESIGN, not scale.

# YOUR NARROW FOCUS — iteration 008 of 10: Embedding provider abstraction + graceful degradation
Read (stay scoped to this subsystem):
- `packages/openltm-core/src/providers/` — the embedding-provider interface + openai/gemini/ollama/cohere/openrouter implementations
- `packages/openltm-core/src/dao/embeddings.ts`, `packages/openltm-core/src/embeddings.ts`, `packages/openltm-core/src/janitor/embeddings.ts`
- `packages/openltm-core/src/vec/`
- `migrations/010_memory_embeddings_split.sql`, `migrations/003_embedding_index.sql`
- `docs/04-configuration.md` — provider configuration
Focus on: the pluggable provider interface, degrade-to-FTS5 when no provider is configured, and the SPLIT `memory_embeddings` table (to avoid MCP response bloat). Contrast with our ollama-nomic-768d embedder. We will NOT swap the model — so teachings must rescope TO ollama-nomic (e.g. provider abstraction layer, degradation posture, split-table schema), never replace it.
# GOAL
Find what OpenLTM does DIFFERENTLY than system-spec-kit in THIS subsystem, and what we could copy or learn to improve system-spec-kit (or related systems). Focus on the DELTA — mechanisms, algorithms, schema, or thresholds OpenLTM has that we may lack or do worse. Where our FSRS / causal-edge / self-maintaining design already covers or supersedes it, say so explicitly and verdict REJECT or DEFER. Be skeptical and concrete; do not pad.

# OUTPUT (markdown, concise, ~600–900 words max)
## Mechanism
How OpenLTM implements this subsystem. Cite concrete evidence as `path:line` for every non-trivial claim. Be specific about data structures, formulas, thresholds, and triggers. If you cannot verify a claim from the source, write UNKNOWN.

## Teachings for system-spec-kit
3–7 bullets. Each bullet EXACTLY this one-line shape:
- **Claim** · <one-sentence transferable idea> · **Evidence** · `path:line`[, `path:line`] · **Maps-to** · <system-spec-kit surface, or "new sub-packet"> · **Verdict** · ADOPT|ADAPT|REJECT|DEFER · **Risk** · LOW|MED|HIGH · **Confidence** · 0.00–1.00 · **Why it transfers (or not)** · <rationale vs our single-user / FSRS / causal-edge / self-maintaining design>

## Negative knowledge
What in this subsystem we should NOT copy (design/scale/arch mismatch), each with a one-line reason.

## Open questions
Anything unresolved worth pursuing in synthesis.

# CONSTRAINTS
No code copying (OpenLTM is MIT — design inspiration only). Every Mechanism claim needs real `path:line` evidence; use UNKNOWN when unsure. Output only the markdown analysis — do not write any files.
