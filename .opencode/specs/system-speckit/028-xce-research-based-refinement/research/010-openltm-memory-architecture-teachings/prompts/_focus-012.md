
# YOUR NARROW FOCUS — iteration 012 of 15: OpenLTM's document/continuity surface vs our continuity ladder
This is OpenLTM's CLOSEST architectural analog to us — the parts that are document-ish, not row-ish. Read:
- `packages/openltm-core/src/context.ts` — the session-injection envelope builder (the ≤60-line "Restored Project Context" block) and any `context-summary.md` markdown generation
- `packages/openltm-core/src/dao/contextItems.ts` — `context_items` (per-project goal/decision/progress/gotcha): are these row-based or doc-based, and how do they differ from durable `memories`?
- `hooks/src/SessionStart.ts`, `hooks/src/PreCompact.ts` — startup injection + the PreCompact markdown snapshot fallback
- `docs/06-hooks.md`
Compare directly to OUR continuity ladder: `handover.md`, `implementation-summary.md` `_memory.continuity` frontmatter, spec-folder docs, session bootstrap/resume. Which of OpenLTM's continuity/injection mechanisms TRANSFER or are DOC-ANALOG for our markdown-native continuity model? This is the highest-fit surface — mine it hard.
