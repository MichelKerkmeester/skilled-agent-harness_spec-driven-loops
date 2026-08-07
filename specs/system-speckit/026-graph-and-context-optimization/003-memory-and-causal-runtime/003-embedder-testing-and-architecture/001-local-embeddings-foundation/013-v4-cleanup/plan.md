---
title: "Implementation Plan: Phase 13 - v4 Cleanup"
description: "Plan for v4 cleanup code fixes, doc currency updates, and final validation."
trigger_phrases:
  - "013 v4 cleanup plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/013-v4-cleanup"
    last_updated_at: "2026-05-13T09:45:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Executed v4 cleanup plan"
    next_safe_action: "Run final parent validation before handoff"
    blockers: []
    key_files:
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0140130c2a9e0000000000000000000000000000000000000000000000000002"
      session_id: "014-013-v4-cleanup-2026-05-13"
      parent_session_id: "014-012-v3-remediation-2026-05-13"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 13 - v4 Cleanup

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Python, TOML patch note, Markdown |
| **Framework** | Spec Kit Memory shared embeddings + MCP health handler + CocoIndex MCP protocol |
| **Storage** | sqlite profile filename derives from provider/model/dim/dtype |
| **Testing** | TypeScript build, static greps, strict spec validation |

### Overview
Execute the exact A-G remediation list, then create 013 docs and register the child packet. Keep the `.codex/config.toml` note as a scratch patch if direct writes remain blocked.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Gate 3 pre-answered by user
- [x] v4 finding list supplied with exact target files
- [x] Runtime slug checked against compiled `EmbeddingProfile`

### Definition of Done
- [x] TypeScript source patched for guard timing, dtype metadata, and dtype options
- [x] Python mutable default fixed
- [x] 012/handover/setup docs reflect 42aa114e3 and actual q8 slug
- [x] 013 packet docs and parent metadata registered
- [x] Shared and MCP server dist rebuilds exit 0
- [x] Parent strict validation exits 0
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Surgical cleanup only. Existing provider/profile abstractions stay intact; dtype is threaded through the already-present metadata and profile surfaces.

### Key Components
- `validateConfiguredEmbeddingsProvider()` owns early Voyage shadow warning.
- `HfLocalProvider` owns concrete dtype resolution and metadata.
- `memory_health` builds the external health response from profile/metadata.
- `SearchResult` remains a msgspec struct with safe per-instance defaults.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Code
- A. Add early Voyage shadow guard calls before startup provider resolution.
- B. Add `embeddingProvider.dtype` to `memory_health`.
- F. Add `dtype?: HfLocalDtype` to provider creation options and pass through.
- G. Fix `SearchResult.rankingSignals` mutable default.

### Phase 2: Docs
- C. Update 012 shipped-state docs and parent handover.
- D. Replace wrong q8 filename examples with runtime slug.
- E. Replace Qwen-era tcpdump comment with EmbeddingGemma.
- H. Create 013 docs and register parent metadata.

### Phase 3: Verify
- I. Rebuild shared dist.
- J. Grep dist/source evidence.
- K. Strict-validate 014 parent.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Build | Shared TypeScript embeddings package | `cd .opencode/skills/system-spec-kit/shared && npx tsc --build` |
| Build | MCP server health handler dist | `cd .opencode/skills/system-spec-kit/mcp_server && npm run build` |
| Static evidence | Dist guard/dtype output and Python default | `rg`, `grep` |
| Validation | Parent packet and child docs | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh ... --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Writable `.codex/config.toml` | Apple TCC / sandbox | Blocked in this runtime | exact patch recorded in 013 scratch |
| Shared package tsconfig | Build | Available | required for dist refresh |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- Remove additive `dtype` fields from metadata/health only if consumers reject the new field.
- Revert the startup guard call sites if warnings become noisy; the one-shot guard should make that unnecessary.
- Revert `rankingSignals` to a direct default only if msgspec compatibility fails, then use the msgspec-supported equivalent.
<!-- /ANCHOR:rollback -->
