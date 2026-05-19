---
title: "Implementation Summary: 016/002/015 Local-First Cascade Reorder + Nomic hf-local Default"
description: "Flipped the mk-spec-memory embedder cascade from cloud-first to local-first (Ollama -> hf-local -> OpenAI -> Voyage) and aligned the hf-local fallback to nomic-ai/nomic-embed-text-v1.5 so cascade tier 1 and tier 2 use the same model family."
trigger_phrases:
  - "016/002/015 impl summary"
  - "adr-014 impl summary"
  - "local-first cascade impl summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/002-spec-memory-stack/015-cascade-reorder-and-nomic-hf-local-default"
    last_updated_at: "2026-05-19T08:15:00Z"
    last_updated_by: "fresh_opus_agent"
    recent_action: "Shipped ADR-014 cascade reorder + doc sweep"
    next_safe_action: "Main agent commits per Commit Handoff"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/shared/embeddings/auto-select.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/embedder-auto-selection.vitest.ts"
      - ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/002-spec-memory-stack/004-spec-memory-embedder-bake-off/decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000002015"
      session_id: "016-002-015"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Cascade order — Ollama (1) > hf-local (2) > OpenAI (3) > Voyage (4); local-first per operator directive."
      - "hf-local fallback model — nomic-ai/nomic-embed-text-v1.5 (768d) for cascade consistency with the Ollama default."
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `015-cascade-reorder-and-nomic-hf-local-default` |
| **Completed** | 2026-05-19 |
| **Level** | 1 |
| **ADR shipped** | ADR-014 in `../004-spec-memory-embedder-bake-off/decision-record.md` |
| **Supersedes** | ADR-013's cascade clause only (within-Ollama priority retained) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The mk-spec-memory embedder cascade is now local-first. On a fresh `vec_metadata`, the daemon prefers Ollama first, falls through to a Python `sentence-transformers` fallback (`hf-local`), and only escalates to OpenAI or Voyage when nothing local is reachable — a reversal of the previous cloud-first ordering. A new user with Ollama installed gets all-local embeddings without setting any API key, which is the operator-stated reference profile going forward.

### Local-first cascade reorder (ADR-014)

You now get Ollama embeddings the moment Ollama is reachable, regardless of whether `VOYAGE_API_KEY` or `OPENAI_API_KEY` is set. The probe sequence in `shared/embeddings/auto-select.ts` walks `[ollama, hf-local, openai, voyage]` in order; the first probe that returns a usable embedder wins and gets persisted to `vec_metadata`. Operators who still want a cloud tier set `EMBEDDINGS_PROVIDER=voyage` (or `openai`) explicitly — no infrastructure removed, just a different default.

### Nomic-aligned hf-local fallback

The Python fallback now defaults to `nomic-ai/nomic-embed-text-v1.5` (768d) instead of `BAAI/bge-base-en-v1.5`. This matches the in-Ollama default (`nomic-embed-text-v1.5` from ADR-013), so an operator without Ollama still gets the same embedder family as an operator with Ollama. Cascade fallthrough no longer fragments the production characteristic profile across two unrelated text-embedding families.

### Recommended new-user setup, documented end-to-end

`INSTALL_GUIDE.md`, both READMEs, `embedder_architecture.md`, `embedding_resilience.md`, `embedder-pluggability.md`, `ENV_REFERENCE.md`, and the `mk-spec-memory` env blocks in `opencode.json` + `.claude/mcp.json` now all describe the same flow: install Ollama, `ollama pull nomic-embed-text:v1.5`, start the MCP server. No API keys, no Python setup, all-local.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/shared/embeddings/auto-select.ts` | Modified | Reorder `sequence` tuple list to local-first + ADR-014 inline comment |
| `.opencode/skills/system-spec-kit/shared/embeddings/factory.ts` | Modified | `getCascadeFallbackOrder()` runtime-fallback chain reordered to match ADR-014 |
| `.opencode/skills/system-spec-kit/mcp_server/tests/embedder-auto-selection.vitest.ts` | Modified | Flip error-message-order regex at line 158 to match new tier order |
| `.opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md` | Modified | Rewrote "What Gets Picked" + added "Recommended setup for new users" + behavior-change warning + version-history row |
| `opencode.json` | Modified | `_NOTE_1_DB` + `_NOTE_3_PROVIDERS` + `_NOTE_4_EMBEDDINGS_PROVIDER` + `_NOTE_5_CLOUD_PROVIDERS` rewritten; new `_NOTE_RECOMMENDED_SETUP`; stale llama-cpp wording removed |
| `.claude/mcp.json` | Modified | Same env-block updates as opencode.json (`.mcp.json` is a symlink to this file) |
| `.opencode/skills/system-spec-kit/README.md` | Modified | Requirements paragraph + Embedding Providers tier table + Environment Variables table |
| `.opencode/skills/system-spec-kit/mcp_server/README.md` | Modified | Embedding Provider Cascade section + new-user setup paragraph; removed obsolete auto-migration block |
| `.opencode/skills/system-spec-kit/references/memory/embedder_architecture.md` | Modified | Bootstrap probe tier table flipped; vec_768 entry updated; ADR-014 supersession callout |
| `.opencode/skills/system-spec-kit/references/memory/embedding_resilience.md` | Modified | Bootstrap probe sequence + runtime fallback table reordered |
| `.opencode/skills/system-spec-kit/references/embedder-pluggability.md` | Modified | Added Provider Cascade section (ADR-014) before within-Ollama default; updated default to nomic-v1.5 per ADR-013 |
| `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` | Modified | §15 EMBEDDING prose rewritten; SPECKIT_EMBEDDER_EXECUTION description updated |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/002-spec-memory-stack/004-spec-memory-embedder-bake-off/decision-record.md` | Modified | Appended ADR-014 with rationale, tier table, new-user flow, behavior-change warning, rollback path |
| `.opencode/specs/.../015-cascade-reorder-and-nomic-hf-local-default/spec.md` | Modified | Continuity frontmatter compaction (recent_action / next_safe_action concise) |
| `.opencode/specs/.../015-cascade-reorder-and-nomic-hf-local-default/plan.md` | Rewritten | Conformed to canonical Level 1 plan template (summary/quality-gates/architecture/phases/testing/dependencies/rollback) |
| `.opencode/specs/.../015-cascade-reorder-and-nomic-hf-local-default/tasks.md` | Rewritten | Conformed to canonical Level 1 tasks template (notation/phase-1/phase-2/phase-3/completion/cross-refs) |
| `.opencode/specs/.../015-cascade-reorder-and-nomic-hf-local-default/implementation-summary.md` | Rewritten | This file — canonical Level 1 implementation-summary template with full content |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Sequential phases. Phase 1 was a two-line code change in `auto-select.ts` (`sequence` tuple reorder + the pre-shipped `HF_LOCAL_MODEL` constant) plus a one-line regex flip in the matching vitest. `tsc --noEmit` and `npm run build` both passed clean.

Phase 2 was a 14-file documentation sweep. Every doc that named the cascade tier order got the new sequence; every `_NOTE_*` env-block string in `opencode.json` and `.claude/mcp.json` got rewritten with the local-first language and the recommended new-user setup hook (install Ollama + `ollama pull nomic-embed-text:v1.5`). The stale llama-cpp wording inherited from a pre-007-purge state was removed in the same edits. ADR-014 was appended to the bake-off decision record with the full tier table, rationale, behavior-change warning, and explicit rollback steps.

Phase 3 was `validate.sh --strict` + a global grep against legacy cascade phrasing. Strict-validate caught template-shape issues in plan/tasks/impl-summary (scaffold had used a non-canonical structure); rewriting those three files to the canonical Level 1 templates closed the gap. The grep confirms no doc still carries the cloud-first ordering text.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Reverse cascade to `[ollama, hf-local, openai, voyage]` | Operator wants local-first execution as the new reference profile; cloud APIs remain reachable via explicit `EMBEDDINGS_PROVIDER=` opt-in. |
| Align hf-local default to `nomic-ai/nomic-embed-text-v1.5` (was `BAAI/bge-base-en-v1.5`) | Keeps tier 1 and tier 2 in the same embedder family, so cascade fallthrough does not silently switch model characteristics. |
| Append ADR-014 instead of editing ADR-013 in place | ADR-013 is shipped; superseding only its cascade clause (not its within-Ollama priority) keeps the audit trail intact and lets future readers see the two decisions independently. |
| Document "Recommended new-user setup" in every operator-facing surface | Local-first is only a real default if a fresh user can reach it without docs spelunking — the same paragraph now lives in INSTALL_GUIDE, both READMEs, ENV_REFERENCE, and the env-note JSON for both runtime configs. |
| Strip stale `llama-cpp` wording from `_NOTE_1_DB` / `_NOTE_3_PROVIDERS` / `_NOTE_AUTO_MIGRATION` opportunistically | The 007 packet purged llama-cpp from code but left these strings — keeping them while flipping the cascade would have shipped a confusing mixed-state. |
| Do NOT attempt to "fix" the vitest SIGSEGV under non-TTY stdout | The crash reproduces on the known-good `test:task-enrichment` script too; it is a Node v25.6.1 / vitest 4.1.6 environmental issue, not a regression from this change. Per contract, document and continue. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `cd .opencode/skills/system-spec-kit/scripts && npm run typecheck` | PASS (no output, exit 0) |
| `cd .opencode/skills/system-spec-kit/scripts && npm run build` | PASS (`tsc --build` exit 0) |
| `vitest run embedder-auto-selection.vitest.ts` | FAIL — SIGSEGV (exit 139) under any non-TTY stdout; reproduces on the known-good `test:task-enrichment` script. Pre-existing Node v25.6.1 + vitest 4.1.6 environmental flake, NOT caused by this packet. Regex change is otherwise syntactically valid per typecheck. |
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <packet> --strict` | PASS (after rewriting plan/tasks/impl-summary to canonical Level 1 templates) |
| `grep -rn "voyage > openai > ollama\|Voyage > OpenAI > Ollama\|voyage.*openai.*ollama.*hf-local" .opencode/` | 0 hits outside this packet's own `spec.md` PROBLEM section (which legitimately quotes the old order to motivate the change) and historical sibling packet docs (`007/`, `005/`, `004/decision-record.md` ADR-012, `003-skill-advisor-stack/004/spec.md`, etc.) that document pre-ADR-014 state and are out of scope per spec.md §3 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Vitest cannot be executed in this session** because `node v25.6.1` + `vitest 4.1.6` crash with SIGSEGV whenever stdout is not a TTY. The bug reproduces on every vitest invocation in the repo (verified against `npm run test:task-enrichment`), so it is environmental rather than a regression. The cascade regex change typechecks clean; first opportunity with a working TTY-attached runner should re-run `vitest run embedder-auto-selection.vitest.ts` to confirm.
2. **Existing daemons with persisted `vec_metadata.active_embedder_*` rows are NOT affected** by ADR-014 — the new probe order only fires when `vec_metadata` is empty. Operators who want to migrate an already-persisted Voyage / OpenAI install to Ollama must clear `vec_metadata` (or use the `embedder_set` MCP tool) and rebuild the index.
3. **`MEMORY_AUTO_MIGRATE_HF_TO_LLAMA` env var still appears in the README** — it references the deprecated 007 auto-migration. Out of strict scope for this packet; flagged as discovered scope for a follow-on cleanup.
<!-- /ANCHOR:limitations -->

---

## 7. COMMIT HANDOFF

The following paths were modified or rewritten in this packet. Main agent should stage and commit (no `git add -A` — use explicit paths):

```
.opencode/skills/system-spec-kit/shared/embeddings/auto-select.ts
.opencode/skills/system-spec-kit/shared/embeddings/factory.ts
.opencode/skills/system-spec-kit/mcp_server/tests/embedder-auto-selection.vitest.ts
.opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md
opencode.json
.claude/mcp.json
.opencode/skills/system-spec-kit/README.md
.opencode/skills/system-spec-kit/mcp_server/README.md
.opencode/skills/system-spec-kit/references/memory/embedder_architecture.md
.opencode/skills/system-spec-kit/references/memory/embedding_resilience.md
.opencode/skills/system-spec-kit/references/embedder-pluggability.md
.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/002-spec-memory-stack/004-spec-memory-embedder-bake-off/decision-record.md
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/002-spec-memory-stack/015-cascade-reorder-and-nomic-hf-local-default/spec.md
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/002-spec-memory-stack/015-cascade-reorder-and-nomic-hf-local-default/plan.md
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/002-spec-memory-stack/015-cascade-reorder-and-nomic-hf-local-default/tasks.md
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/002-spec-memory-stack/015-cascade-reorder-and-nomic-hf-local-default/implementation-summary.md
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/002-spec-memory-stack/015-cascade-reorder-and-nomic-hf-local-default/description.json
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/002-spec-memory-stack/015-cascade-reorder-and-nomic-hf-local-default/graph-metadata.json
```

### Discovered scope (NOT modified — operator decision needed)

- `MEMORY_AUTO_MIGRATE_HF_TO_LLAMA` env variable row still present in `.opencode/skills/system-spec-kit/README.md` line ~641; references the 007 deprecated auto-migration. Follow-on cleanup recommended.
- Sibling packet docs (`007-auto-embedder-selection-and-llama-cpp-purge/`, `003-skill-advisor-stack/004-skill-graph-db-writer-cross-wire/spec.md`, `005-context-server-memory-reduction-research/research/iterations/`, etc.) carry the old cascade phrasing as historical record. Per spec.md §3 SCOPE, these are out of scope. Flag as **follow-on needed** only if downstream operators report confusion.

### Follow-on suggestions

- **Run `vitest run mcp_server/tests/embedder-auto-selection.vitest.ts`** in an environment without the Node v25 SIGSEGV (e.g. downgrade to Node 22 LTS or run inside a TTY-attached terminal) to confirm the order regex change passes.
- **Sweep deprecated `MEMORY_AUTO_MIGRATE_HF_TO_LLAMA` references** as a small follow-on packet (3–5 files).
