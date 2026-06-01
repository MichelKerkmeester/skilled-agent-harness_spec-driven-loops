# Changelog , , ,  006: Comment ephemeral-artifact pointer cleanup

**Shipped**: 2026-05-29
**Commit**: 4b2c5de6a3

## What Changed
- Comment-only sweep removing ~55 sk-code-forbidden ephemeral-artifact pointers from 27 files across the embedding-stack program and adjacent system-spec-kit modules
- Removed spec-folder/number, packet/phase/task/checklist/requirement id, ADR id, review-finding id, and traceability pointers from comments while preserving the durable WHY
- Affected files include: vector-index-store.ts, context-server.ts, reindex.ts, registry.ts, factory.ts, hf-local.ts, bench-dtype-q8-fp16.cjs, embedding-reconcile.ts, types.ts, document-helpers.ts, memory-parser.ts, lineage-state.ts, quality-scorer.ts, api/index.ts, preflight.ts, query-flow-tracker.ts, config.ts, vector-index-schema.ts, retry-budget.ts, trigger-phrase-sanitizer.ts, tool-schemas.ts, shared-payload.ts, mk-spec-memory-launcher.cjs, mk-skill-advisor-launcher.cjs, launcher-ipc-bridge.cjs, mk-code-index-launcher.cjs, generate_report.py
- Zero logic changes, only comment/string text modified

## Why
The sk-code canonical rule forbids code comments from embedding ephemeral-artifact pointers (spec folder/number, packet/phase/task/checklist/requirement id, ADR id, review-finding id, ticket id). When packets are renamed, renumbered, or archived, these become dangling pointers that send readers chasing dead references.

## Verification
- TS build (@spec-kit/shared): Pass
- TS build (@spec-kit/mcp-server): Pass
- CJS syntax (node --check on all 5 touched .cjs): Pass
- Python syntax (python3 -m py_compile generate_report.py): Pass
- Re-audit grep: Pass (only allowed/false-positive matches remain)
- Strict validation (validate.sh --strict): Pass
