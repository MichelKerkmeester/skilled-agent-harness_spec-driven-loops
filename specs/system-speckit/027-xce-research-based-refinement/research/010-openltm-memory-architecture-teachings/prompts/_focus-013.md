
# YOUR NARROW FOCUS — iteration 013 of 15: Re-test the row-write teachings under the doc lens (skeptical)
The prior pass proposed several WRITE-side teachings that may be row-coupled. Re-test each against our deliberate-save, document-based model — be skeptical and decide TRANSFERS / DOC-ANALOG / ROW-COUPLED with evidence. Read the relevant source:
- `learn/reinforce` idempotency: `packages/openltm-core/src/db.ts` (the `created|reinforced` path, `confirm_count`, `dedup_key`) — does "reinforce a fact-row" have ANY analog when our memory is an authored doc that gets edited + reindexed?
- per-row mutation audit + provenance: `packages/openltm-core/src/dao/provenanceAudit.ts`, `migrations/008_add_memory_provenance.sql`, `009_add_memory_audit.sql` — vs our continuity frontmatter / git history over spec docs. Is a separate audit table redundant for a doc-based store that already has git + continuity?
- dedup of memories: `packages/openltm-core/src/dedup.ts` — does content-hash dedup of rows mean anything when memories are documents?
For each, state plainly whether it survives the doc-based model or is row-coupled negative knowledge. Do not be charitable — the prior pass was too charitable here.
