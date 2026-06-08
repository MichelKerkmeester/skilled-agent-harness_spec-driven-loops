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

# YOUR NARROW FOCUS — iteration 015 of 15: Hooks & automation philosophy — auto-mine vs deliberate save
The deepest doc-vs-row divide: OpenLTM AUTO-MINES memories from session/git events into rows; we create memories DELIBERATELY as authored docs. Read OpenLTM's automation:
- `hooks/src/EvaluateSession.ts` — extracting candidate memories from a transcript at session end
- `hooks/src/UpdateContext.ts` — recording progress mid-session
- `hooks/src/GitCommit.ts` + `hooks/lib/llmExtract.ts` — learning from commits
- `hooks/lib/proposalQueue.ts` — the propose-before-write queue
Ask the hard question: for a DELIBERATE-SAVE, document-based system, what (if anything) about OpenLTM's auto-capture is worth adopting, and what is fundamentally misaligned with authored-doc memory? Specifically re-judge the prior pass's "propose-don't-mutate auto-mined memory admission" teaching: is auto-mining-into-proposals a real win for us, or are we right to keep deliberate authored saves? Decide TRANSFERS / DOC-ANALOG / ROW-COUPLED with evidence, and name any genuinely safe automation (e.g. a PreCompact snapshot, or proposing a handover update — NOT silently minting memory rows).
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
