---
title: "Implementation Plan: Phase 11 - EmbeddingGemma Unification"
description: "Switch source defaults to EmbeddingGemma, update committed config notes, purge active Qwen3 references, and validate the 014 cascade."
trigger_phrases:
  - "011 embeddinggemma unification"
  - "EmbeddingGemma default both surfaces"
  - "Qwen3 purge"
  - "google embeddinggemma cocoindex"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/011-embeddinggemma-unification"
    last_updated_at: "2026-05-13T07:35:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Gemma unification in progress"
    next_safe_action: "Resolve Codex config write blocker"
    blockers:
      - ".codex/config.toml is read-only to this sandbox"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0140110c2a9e0000000000000000000000000000000000000000000000000002"
      session_id: "014-011-embeddinggemma-2026-05-13"
      parent_session_id: null
    completion_pct: 70
    open_questions: []
    answered_questions:
      - "Gate 3 folder? -> User pre-answered existing 014/011"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 11 - EmbeddingGemma Unification

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Python config/settings, TypeScript embedding provider/factory, JSON/TOML runtime config, Markdown packet docs |
| **Framework** | CocoIndex MCP + Spec Kit Memory MCP |
| **Storage** | No live DB mutation in 011; model defaults affect future stores |
| **Testing** | TypeScript build, JSON parse, TOML syntax check if available, ripgrep sweep, strict spec validation |

### Overview
Change the default at the source-of-truth points, then clean the docs/config surface that teaches future users what Setup A means. The registry entries for Qwen remain because explicit opt-in still needs to work, but they stop being the default or current-state recommendation.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Gate 3 answered by user for 014/011
- [x] 010 packet inspected as the local Level-1 template
- [x] Source default locations identified

### Definition of Done
- [ ] All editable runtime config notes updated
- [ ] `.codex/config.toml` blocker resolved or documented
- [ ] Qwen sweep clean except allowed historical entries
- [ ] Shared TypeScript build passes
- [ ] Updated packets strict-validate clean
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Default swap plus documentation reconciliation. No new abstraction. The existing prefix/prompt registries already support EmbeddingGemma.

### Key Components
- `config.py` controls CocoIndex env fallback model id
- `settings.py` controls generated/default user settings
- `hf-local.ts` controls Spec Kit Memory local provider fallback
- `factory.ts` controls provider-default metadata and validation dimension map
- Runtime configs communicate default behavior to MCP users

### Data Flow
Runtime starts MCP server -> config/settings resolve model id -> provider loads model -> 768-dim embeddings land in the appropriate store.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| CocoIndex source | New clone code-search default | Set to `google/embeddinggemma-300m` | grep + Python compile |
| Spec Kit Memory source | New clone memory default | Set hf-local default to ONNX Gemma | TypeScript build |
| Runtime configs | User-visible MCP notes | Replace MiniLM/Nomic default language with Gemma | JSON/TOML validation |
| 014 docs | Continuity and current-state docs | Remove active Qwen current-state claims | strict validate |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Model Identity
- [x] Confirm `shared.py` already maps `google/embeddinggemma-300m` to `InstructionRetrieval`
- [x] Confirm main agent already updated live global YAML and restarted/rebuilt outside repo scope
- [x] Change CocoIndex source defaults
- [x] Change Spec Kit Memory source defaults

### Phase 2: Runtime Notes
- [x] Update OpenCode, MCP, Claude, Gemini runtime config notes
- [B] Update Codex runtime config notes (blocked by read-only `.codex/`)
- [x] Update `.env.example` active examples

### Phase 3: Documentation Sweep
- [ ] Create 011 Level-1 packet docs
- [ ] Update parent metadata and child manifest
- [ ] Update prior packet docs and handover/recipe
- [ ] Confirm Qwen sweep residuals are only allowed historical entries

### Phase 4: Verification
- [ ] Rebuild shared dist
- [ ] Validate updated child packets
- [ ] Validate parent recursively
- [ ] Record blocker if Codex config remains unwritable
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Build | TypeScript shared embeddings | `npx tsc --build` |
| Syntax | JSON configs | `node -e JSON.parse(...)` |
| Syntax | Python defaults | `python -m py_compile` |
| Search | Residual Qwen references | `rg` |
| Spec validation | Updated packets + parent | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 010 code-only cleanup | Internal | Green | Keeps CocoIndex limited to code chunks |
| EmbeddingGemma query prompt registry | Internal | Green | Needed for reasonable query-side behavior |
| `.codex/config.toml` write access | Filesystem | Blocked | Prevents all five runtime configs from being updated in-session |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: EmbeddingGemma default causes unacceptable recall or startup regressions
- **Procedure**: Set explicit environment overrides in the affected runtime or change source defaults back. Existing Qwen registry entries remain available for explicit opt-in, so rollback does not require reintroducing registry code.
<!-- /ANCHOR:rollback -->
