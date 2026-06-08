You are a senior memory-systems research analyst performing READ-ONLY analysis. Do NOT write, create, edit, or delete any files. Your final answer text IS the deliverable.

# THE CORRECTED LENS FOR THIS PASS (read carefully — it changes the verdicts)
A prior 10-iteration sweep mined OpenLTM but under-weighted a fundamental architectural mismatch. This continuation (iterations 011-015) re-examines OpenLTM through that lens:

- **system-spec-kit Memory is SPEC-DOCUMENTATION-BASED.** The canonical unit of memory is an *authored markdown document* — spec folders (`spec.md`, `plan.md`, `implementation-summary.md` with `_memory.continuity` frontmatter, `handover.md`). Memories are created DELIBERATELY when a human/agent runs a save (`/memory:save` → `generate-context.js`), which writes/updates docs and then INDEXES them. A SQLite index + a separate ollama-nomic-768d vector store sit OVER those docs as a *derived* retrieval layer (with importance tiers, causal edges, FSRS decay, trigger phrases). The document is the source of truth; the database is an index.

- **OpenLTM is ROW-BASED.** The canonical unit of memory is a *row* in a `memories` table, written automatically by `learn()` and by lifecycle hooks that mine facts from transcripts/git. The row IS the memory; there is no authored source document behind it.

This means many OpenLTM mechanisms are intrinsically coupled to the row-write model (e.g. `learn()/reinforce`, `confirm_count`, auto-mining facts into rows, per-row mutation audit) and may NOT transfer to a system whose memories are authored documents. Others are storage-agnostic (secret scrubbing of content; retrieval explainability; index freshness; session-injection snapshots) and DO transfer.

# TARGET — study this (read its source)
OpenLTM, vendored at `specs/system-spec-kit/027-xce-research-based-refinement/external/OpenLtm-main/`. Stack: Bun + TS; SQLite WAL + FTS5 + optional sqlite-vec; lifecycle hooks; janitor; typed graph. All paths below are relative to that `OpenLtm-main/` root — read the real files.

# YOUR JOB THIS PASS
For your assigned focus, judge each candidate teaching with an explicit STORAGE-FIT classification:
- **TRANSFERS** — storage-agnostic; works the same for a doc-based store.
- **DOC-ANALOG** — the idea transfers only if re-shaped for authored docs / the continuity ladder (describe the re-shaping).
- **ROW-COUPLED** — intrinsically tied to OpenLTM's row-write model; does NOT fit our doc-based system (say so plainly; this is first-class negative knowledge).

# YOUR NARROW FOCUS — iteration 013 of 15: Re-test the row-write teachings under the doc lens (skeptical)
The prior pass proposed several WRITE-side teachings that may be row-coupled. Re-test each against our deliberate-save, document-based model — be skeptical and decide TRANSFERS / DOC-ANALOG / ROW-COUPLED with evidence. Read the relevant source:
- `learn/reinforce` idempotency: `packages/openltm-core/src/db.ts` (the `created|reinforced` path, `confirm_count`, `dedup_key`) — does "reinforce a fact-row" have ANY analog when our memory is an authored doc that gets edited + reindexed?
- per-row mutation audit + provenance: `packages/openltm-core/src/dao/provenanceAudit.ts`, `migrations/008_add_memory_provenance.sql`, `009_add_memory_audit.sql` — vs our continuity frontmatter / git history over spec docs. Is a separate audit table redundant for a doc-based store that already has git + continuity?
- dedup of memories: `packages/openltm-core/src/dedup.ts` — does content-hash dedup of rows mean anything when memories are documents?
For each, state plainly whether it survives the doc-based model or is row-coupled negative knowledge. Do not be charitable — the prior pass was too charitable here.
# OUTPUT (markdown, concise, ~600–900 words max)
## Mechanism
How OpenLTM implements this, with `path:line` evidence for every non-trivial claim. Be explicit about whether the mechanism depends on the row-write model or not. UNKNOWN if you cannot verify.

## Storage-fit teachings for system-spec-kit (doc-based)
3–6 bullets. Each bullet EXACTLY this one-line shape:
- **Claim** · <one-sentence idea> · **Evidence** · `path:line`[, `path:line`] · **Storage-fit** · TRANSFERS|DOC-ANALOG|ROW-COUPLED · **Maps-to** · <system-spec-kit surface (spec docs / continuity ladder / index / MCP), or "none — row-coupled"> · **Verdict** · ADOPT|ADAPT|REJECT|DEFER · **Risk** · LOW|MED|HIGH · **Confidence** · 0.00–1.00 · **Re-shaping needed (if DOC-ANALOG)** · <how to fit it to authored docs, or "n/a">

## Row-coupled findings (negative knowledge)
Mechanisms that look appealing but are intrinsically row-write-coupled and should NOT be ported to a doc-based store — each with a one-line reason.

## Open questions
Anything unresolved for the corrected synthesis.

# CONSTRAINTS
No code copying (OpenLTM is MIT — design inspiration only). Every Mechanism claim needs real `path:line` evidence; UNKNOWN when unsure. Be decisive about storage-fit — that is the whole point of this pass. Output only the markdown.
