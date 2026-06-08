
# YOUR NARROW FOCUS — iteration 004 of 10: Lifecycle hooks + context-injection envelope
Read (stay scoped to this subsystem):
- `hooks/src/SessionStart.ts`, `hooks/src/UpdateContext.ts`, `hooks/src/EvaluateSession.ts`, `hooks/src/PreCompact.ts`, `hooks/src/GitCommit.ts`
- `hooks/lib/resolveProject.ts`, `hooks/lib/llmExtract.ts`, `hooks/lib/proposalQueue.ts`
- `packages/openltm-core/src/context.ts` — the injection-envelope builder (reported ≤60-line budget)
- `docs/06-hooks.md`
Focus on: the bounded injection envelope, the PreCompact markdown-snapshot fallback, EvaluateSession auto-extraction of candidate memories, and GitCommit backfill. Contrast with our SessionStart hook + spec-folder continuity ladder (handover.md / continuity frontmatter). What's genuinely better in their hook lifecycle?
