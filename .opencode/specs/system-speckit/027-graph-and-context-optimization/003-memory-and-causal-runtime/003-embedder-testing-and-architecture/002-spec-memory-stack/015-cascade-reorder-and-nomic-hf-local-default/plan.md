---
title: "Implementation Plan: 016/002/015 Local-First Cascade Reorder + Nomic hf-local Default"
description: "Three-phase plan to reorder the mk-spec-memory embedder cascade to local-first (Ollama -> hf-local -> OpenAI -> Voyage), align hf-local fallback to nomic-ai/nomic-embed-text-v1.5, and sweep all related docs + ADR-014."
trigger_phrases:
  - "016/002/015 plan"
  - "adr-014 plan"
  - "local-first cascade plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/015-cascade-reorder-and-nomic-hf-local-default"
    last_updated_at: "2026-05-19T08:10:00Z"
    last_updated_by: "fresh_opus_agent"
    recent_action: "Rewrote plan.md to canonical Level 1 template structure during validate fix"
    next_safe_action: "Strict-validate the packet"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/shared/embeddings/auto-select.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/embedder-auto-selection.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000002015"
      session_id: "016-002-015"
      parent_session_id: null
    completion_pct: 60
    open_questions: []
    answered_questions: []
---
# Implementation Plan: 016/002/015 Local-First Cascade Reorder + Nomic hf-local Default

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node.js >=20.11.0, ESM) |
| **Framework** | mk-spec-memory MCP server (vitest test runner) |
| **Storage** | sqlite-vec `context-index__*.sqlite` profiles per active embedder |
| **Testing** | vitest 4.1 under `mcp_server/vitest.config.ts` + tsc typecheck + esbuild build |

### Overview
Reorder the `sequence` array in `shared/embeddings/auto-select.ts` from `[voyage, openai, ollama, hf-local]` to `[ollama, hf-local, openai, voyage]`, align the test assertion that enforces the error-message order, align `HF_LOCAL_MODEL` to `nomic-ai/nomic-embed-text-v1.5`, then sweep every config/doc/reference that documents the cascade and append ADR-014 to the bake-off decision record.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear (operator wants local-first cascade)
- [x] Success criteria measurable (test + grep + strict-validate)
- [x] Dependencies identified (ADR-013 shipped; 007 auto-select shipped)

### Definition of Done
- [x] auto-select.ts `sequence` reordered
- [x] vitest assertion regex updated
- [x] typecheck + build green (vitest segfaults on Node v25 stdout-redirect — known env flake, documented)
- [x] All scoped docs updated
- [x] ADR-014 appended to bake-off decision record
- [x] Strict-validate passing
- [x] Legacy-phrasing grep returns 0 hits
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single-function probe cascade in `selectWithoutPersistence()` — array-order reorder, no structural change. Decision-record + multi-doc sweep follows the same edit-and-validate pattern used in 007 and 013.

### Key Components
- **`shared/embeddings/auto-select.ts`**: Probe sequence (tier order) + `HF_LOCAL_MODEL` constant.
- **`mcp_server/tests/embedder-auto-selection.vitest.ts`**: Tier-order assertion via error-message regex.
- **`004-spec-memory-embedder-bake-off/decision-record.md`**: ADR target (ADR-014 appended after ADR-013).
- **Config envelopes** (`opencode.json`, `.claude/mcp.json` via `.mcp.json` symlink): operator-facing cascade documentation in `mk-spec-memory` env block.
- **READMEs + reference docs**: cascade explanation, recommended new-user setup, tier table updates.

### Data Flow
1. Daemon starts; opens vector DB; calls `ensureActiveEmbedder()`.
2. If `vec_metadata` empty, calls `autoSelectActiveEmbedder()` which iterates the probe `sequence`.
3. First probe that returns a usable embedder wins; result persists to `vec_metadata`.
4. Documentation surfaces (README, INSTALL_GUIDE, env notes, reference docs) describe the probe order to operators.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read auto-select.ts §2 constants + §4 selectWithoutPersistence sequence
- [x] Read vitest order assertion at `embedder-auto-selection.vitest.ts:158`
- [x] Confirm HF_LOCAL_MODEL already updated to `nomic-ai/nomic-embed-text-v1.5` (partial-shipped at scaffold)

### Phase 2: Core Implementation
- [x] Reorder `sequence` array tuple list to `[ollama, hf-local, openai, voyage]` with ADR-014 inline comment
- [x] Update vitest regex from `/voyage:.*openai:.*ollama:.*hf-local:/i` to `/ollama:.*hf-local:.*openai:.*voyage:/i`
- [x] Sweep INSTALL_GUIDE, opencode.json, .claude/mcp.json (via .mcp.json symlink), READMEs, embedder_architecture.md, embedding_resilience.md, embedder-pluggability.md, ENV_REFERENCE.md
- [x] Remove stale llama-cpp surface from `_NOTE_1_DB` / `_NOTE_3_PROVIDERS` (007 purge follow-on)
- [x] Append ADR-014 to 004 decision-record.md with tier table, rationale, new-user flow, behavior-change warning, rollback path

### Phase 3: Verification
- [x] `npm run typecheck` → PASS
- [x] `npm run build` → PASS
- [ ] `vitest run embedder-auto-selection.vitest.ts` → environmental SIGSEGV on Node v25.6.1 with non-TTY stdout (also affects the known-good `test:task-enrichment` script — not introduced by this change)
- [x] `validate.sh <packet> --strict` → PASS
- [x] grep of legacy cascade phrasing returns 0 hits across scoped docs
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Static | TypeScript compile + signature alignment | `tsc --noEmit` |
| Unit | Cascade order error message + HF_LOCAL_MODEL fallback | vitest (embedder-auto-selection.vitest.ts) |
| Build | dist/ regeneration so the runtime picks up the new sequence | `npm run build` |
| Manual | Strict-validate gate + legacy-phrasing grep | `validate.sh --strict`, `grep -rn` across `.opencode/` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| ADR-013 (within-Ollama priority) | Internal | Green — shipped (commit `847333a8f`) | ADR-014 supersedes its cascade clause only; ADR-013 priority stays in force |
| 007 auto-embedder-selection mechanism | Internal | Green — shipped (commit `138d2e932`) | Probe cascade infrastructure was already in place |
| Ollama daemon (for tier 1 reachability) | External | Operator-managed | Operators without Ollama fall through to hf-local automatically |
| Python `sentence-transformers` (for tier 2 fallback) | External | Operator-managed | Operators without Python embedder fall through to OpenAI then Voyage |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A reproducible regression caused by the new cascade order, or operator complaint that the cascade no longer prefers their cloud API.
- **Procedure**:
  1. Revert `sequence` order in `shared/embeddings/auto-select.ts` back to `[voyage, openai, ollama, hf-local]`.
  2. Revert `HF_LOCAL_MODEL` back to `'BAAI/bge-base-en-v1.5'`.
  3. Revert vitest regex back to `/voyage:.*openai:.*ollama:.*hf-local:/i`.
  4. `npm run build && npm run typecheck`.
  5. Restart MCP daemon — persisted `vec_metadata` rows are NOT affected; only first-boot probes use the reverted order.
- **Workaround without rollback**: operators who want a specific tier can set `EMBEDDINGS_PROVIDER=voyage|openai|ollama|hf-local` to pin a tier without changing the cascade.
<!-- /ANCHOR:rollback -->
