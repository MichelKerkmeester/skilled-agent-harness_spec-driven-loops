---
title: "Implementation Summary: 044 Template contract divergence fix [template:level_2/implementation-summary.md]"
description: "memory_save now accepts canonical spec docs that pass spec-doc health instead of rejecting them for missing generated-memory wrapper sections."
trigger_phrases:
  - "044 implementation summary"
  - "memory_save template contract fix"
  - "strict validate divergence fix"
  - "canonical spec doc dry-run accepted"
importance_tier: "critical"
contextType: "implementation"
status: "complete"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/001-local-embeddings-foundation/045-template-contract-divergence"
    last_updated_at: "2026-05-14T16:49:00Z"
    last_updated_by: "codex"
    recent_action: "Patched memory_save template-contract bypass and verified 040 dry-run acceptance"
    next_safe_action: "No immediate action; future work should keep generated-memory and spec-doc contracts separate"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts"
    completion_pct: 100
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/001-local-embeddings-foundation/045-template-contract-divergence` |
| **Completed** | 2026-05-14 |
| **Level** | 2 |
| **Depends On** | `041-v-rule-cross-spec-overreach` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`memory_save` now treats canonical V2.2 spec docs as spec docs, not as generated-memory wrapper files. The dry-run still reports the wrapper-contract violations for visibility, but those violations stop blocking when the file is a recognized canonical spec document, sufficiency passes, and `specDocHealth.pass` is true.

### Divergence Map

| Contract Surface | Checks Observed | Notes |
|------------------|-----------------|-------|
| `memory_save` template contract | YAML frontmatter keys, valid `trigger_phrases`, blank line after frontmatter, raw Mustache, legacy banners, generated-memory sections `CONTINUE SESSION`, `CANONICAL SOURCES/DOCS`, `OVERVIEW`, `EVIDENCE`, `RECOVERY HINTS`, `MEMORY METADATA`, and related anchor comments | Implemented in `shared/parsing/memory-template-contract.ts`; these are generated-memory wrapper rules. |
| strict `validate.sh --strict` | Required Level files, placeholders, template source headers, template header order, V2.2 anchors, priority tags, frontmatter continuity basics, `_memory` block shape, spec-doc sufficiency, graph metadata | Implemented through shell rules plus `spec-doc-structure.ts`; these are canonical spec-doc rules. |
| Overlap | Frontmatter presence/shape, anchor hygiene, sufficiency-style content checks, graph metadata presence for spec folders | The overlap is conceptual, but the exact required section names differ by document class. |

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts` | Modified | Added canonical spec-doc document types to the template-contract bypass predicate and wired spec-doc health/document type through all call sites. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts` | Modified | Added a dry-run regression proving canonical spec docs can pass despite generated-memory wrapper violations. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/001-local-embeddings-foundation/045-template-contract-divergence/` | Created | Captures the packet, contract map, verification evidence, and binding trace. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The 040 implementation summary reproduced the exact split: strict validation passed, while pre-fix `handleMemorySave({ dryRun: true, skipPreflight: true })` returned `would_pass: false` with `missing_blank_line_after_frontmatter` and six `missing_section` violations. The patch refined the existing bypass predicate instead of adding a parallel path, then verified that malformed generated-memory coverage still passes in the save-pipeline suite.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Chose Path B over Path A | The rejected sections are generated-memory wrapper sections. Requiring them in canonical spec docs would make V2.2 spec docs less canonical, not more. |
| Require `specDocHealth.pass=true` | The bypass needs a positive spec-doc contract signal, not only a file name. |
| Limit bypass to known canonical spec document types | Constitutional memories and generic memory files should keep the original template-contract enforcement. |
| Keep violation details in dry-run output | The diagnostics are still useful. The change is blocking behavior, not observability. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Pre-fix 040 strict validate | PASS: `validate.sh .../041-v-rule-cross-spec-overreach --strict` returned 0 errors and 0 warnings. |
| Pre-fix 040 dry-run | REPRODUCED: `would_pass=false`; `templateContract.valid=false`; violations were `missing_blank_line_after_frontmatter` plus missing `continue-session`, `canonical-docs`, `overview`, `evidence`, `recovery-hints`, and `memory-metadata`. |
| Post-fix 040 dry-run | PASS: `would_pass=true`; summary `Dry-run would pass in manual-fallback mode with deferred indexing.` |
| Focused regression | PASS: `env -u EMBEDDINGS_PROVIDER npx vitest run tests/memory-save-pipeline-enforcement.vitest.ts --testNamePattern "dry-run accepts canonical spec docs"` |
| Full save-pipeline regression | PASS: `env -u EMBEDDINGS_PROVIDER npx vitest run tests/memory-save-pipeline-enforcement.vitest.ts`: 59 tests passed. |
| MCP server typecheck | PASS: `npm run typecheck --workspace=@spec-kit/mcp-server`. |
| Strict validate 037 | PASS: `validate.sh .../037-llama-cpp-embedding-worker-deep-dive --strict`: 0 errors, 0 warnings. |
| Strict validate 040 | PASS: `validate.sh .../041-v-rule-cross-spec-overreach --strict`: 0 errors, 0 warnings. |
| Strict validate 044 | PASS: `validate.sh .../045-template-contract-divergence --strict`: 0 errors, 0 warnings. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Dry-run still labels accepted spec docs as manual-fallback.** That label is existing behavior from missing generated-memory markers. The fix makes it non-blocking for healthy canonical spec docs.
2. **The dry-run was invoked through the local handler because the `memory_save` MCP tool was not exposed in this Codex session.** The handler is the same implementation path behind the MCP tool, and the response envelope is the `memory_save` envelope.
3. **No build artifact was generated.** Typecheck and Vitest passed; build was not needed for this source-level packet and prior local context had dist write permission issues.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:binding-trace -->
## Binding Trace

| Field | Value |
|-------|-------|
| AGENT_RECEIVED | yes |
| SPAWN_AGENT_USED | no |
| GATE_3_ANSWER | E-Phase-044 |
| PACKET_PATH | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/001-local-embeddings-foundation/045-template-contract-divergence` |
| DIAGNOSTIC_STATUS | reproduced |
| ROOT_CAUSE | `memory_save` ran `validateMemoryTemplateContract()` against canonical spec docs and treated generated-memory wrapper sections as blocking even when `evaluateSpecDocHealth()` passed. `validate.sh --strict` correctly validated the V2.2 spec-doc anchors, so the two tools were enforcing different document-class contracts. |
| PROPOSED_FIX | Implemented Path B: keep strict validation unchanged and loosen the `memory_save` manual-fallback template-contract gate only for recognized canonical spec-doc document types with passing sufficiency and `specDocHealth.pass=true`. |
| STRICT_VALIDATE_044 | PASS |
| PHASE_044_STATUS | PASS |
<!-- /ANCHOR:binding-trace -->
