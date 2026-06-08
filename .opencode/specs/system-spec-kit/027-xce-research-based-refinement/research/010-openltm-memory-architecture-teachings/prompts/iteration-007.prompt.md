You are a senior memory-systems research analyst performing READ-ONLY analysis. Do NOT write, create, edit, or delete any files, and do NOT run state-mutating commands. Your final answer text IS the deliverable.

# TARGET — study this (read its source)
OpenLTM, an open-source long-term-memory plugin for AI coding agents, vendored at:
`specs/system-spec-kit/027-xce-research-based-refinement/external/OpenLtm-main/`
Stack: Bun + TypeScript; SQLite (WAL) + FTS5(BM25) + optional sqlite-vec; pluggable embedding providers; lifecycle hooks; janitor maintenance; typed knowledge graph. All file paths below are relative to that `OpenLtm-main/` root — read the actual files before claiming anything.

# CONSUMER — compare against this (what we want to improve)
system-spec-kit Memory: a LOCAL single-user continuity store — SQLite index + a SEPARATE vector store (ollama nomic, 768d); semantic + lexical trigger-phrase matching; importance tiers; causal edges between memories; FSRS-based decay + co-activation; a self-maintaining incremental index; shadow-first learning-feedback reducers; a spec-folder continuity ladder (handover.md / implementation-summary.md continuity frontmatter); a 37-tool MCP surface. Both systems are single-user and local, so the gap is DESIGN, not scale.

# YOUR NARROW FOCUS — iteration 007 of 10: Provenance + audit chain
Read (stay scoped to this subsystem):
- `packages/openltm-core/src/dao/provenanceAudit.ts` — `memory_audit` (append-only who/what/when/before/after) + `memory_provenance` (source kind)
- `migrations/008_add_memory_provenance.sql`, `migrations/009_add_memory_audit.sql`, `migrations/013_add_created_by.sql`, `migrations/014_update_audit_op_check.sql`
- `docs/03-architecture.md` — provenance/audit narrative
Focus on: the provenance source taxonomy (session / git-backfill / evaluate / user-promotion / import) and the append-only audit trail. Contrast with our continuity provenance / `_memory.continuity` frontmatter. Is a structured per-memory audit + provenance source kind a genuine delta worth adopting for a single-user store?
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
