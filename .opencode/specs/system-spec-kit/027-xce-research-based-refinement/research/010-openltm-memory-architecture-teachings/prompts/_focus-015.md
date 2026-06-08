
# YOUR NARROW FOCUS — iteration 015 of 15: Hooks & automation philosophy — auto-mine vs deliberate save
The deepest doc-vs-row divide: OpenLTM AUTO-MINES memories from session/git events into rows; we create memories DELIBERATELY as authored docs. Read OpenLTM's automation:
- `hooks/src/EvaluateSession.ts` — extracting candidate memories from a transcript at session end
- `hooks/src/UpdateContext.ts` — recording progress mid-session
- `hooks/src/GitCommit.ts` + `hooks/lib/llmExtract.ts` — learning from commits
- `hooks/lib/proposalQueue.ts` — the propose-before-write queue
Ask the hard question: for a DELIBERATE-SAVE, document-based system, what (if anything) about OpenLTM's auto-capture is worth adopting, and what is fundamentally misaligned with authored-doc memory? Specifically re-judge the prior pass's "propose-don't-mutate auto-mined memory admission" teaching: is auto-mining-into-proposals a real win for us, or are we right to keep deliberate authored saves? Decide TRANSFERS / DOC-ANALOG / ROW-COUPLED with evidence, and name any genuinely safe automation (e.g. a PreCompact snapshot, or proposing a handover update — NOT silently minting memory rows).
