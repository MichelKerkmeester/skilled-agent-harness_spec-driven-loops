---
title: "Implementation Plan: Consolidate local embedding models to nomic only"
description: "Cleanup plan for reducing local embedding provider registries, dimension defaults, provider mentions, and docs to nomic-only while keeping runtime dimension derivation for unlisted user overrides."
trigger_phrases:
  - "nomic only embedding plan"
  - "unknown model dimension guard plan"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/029-embedding-consolidation-hf-local-server/001-nomic-only-consolidation"
    last_updated_at: "2026-05-29T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored plan for nomic-only registry, dimension, provider, and docs cleanup"
    next_safe_action: "Implement scoped cleanup and verify unknown-model runtime dim behavior"
    blockers: []
    key_files:
      - "shared/embeddings/registry.ts"
      - "shared/embeddings/factory.ts"
      - ".env.example"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000292"
      session_id: "029-001-plan"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Consolidate local embedding models to nomic only

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node ESM), markdown docs |
| **Framework** | `@spec-kit/shared` embeddings + system-spec-kit docs |
| **Storage** | N/A |
| **Testing** | TypeScript compile + embeddings vitest |

### Overview
Trim local embedding model selection down to `nomic-ai/nomic-embed-text-v1.5` in the registry, factory dimension defaults, provider/profile/type copy, and user docs. Keep a graceful unknown-model guard so a user-specified local model absent from the registry can still embed by deriving dimension from runtime output instead of static registry membership.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified (later phases consume the nomic canonical fallback)

### Definition of Done
- [ ] All P0 acceptance criteria met (nomic-only local menu, graceful unknown-model dim, cloud providers intact)
- [ ] TypeScript and embeddings-focused vitest pass
- [ ] Docs updated without rewriting benchmark reports or historical fixtures
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Static menu consolidation plus runtime-observed dimension fallback for explicit user overrides.

### Key Components
- **`registry.ts` MANIFESTS**: retain only the nomic local manifest and keep `getCanonicalFallback('hf-local'|'ollama')` returning nomic.
- **`factory.ts` validation**: keep nomic's 768 dimension as the listed default, but treat absent local registry entries as runtime-resolved rather than invalid.
- **Provider/profile/type copy**: remove local model-menu text while preserving default derivation from `getCanonicalFallback`.
- **Docs**: present nomic as the single local default and document override behavior in environment references.

### Data Flow
Provider selection reads `HF_EMBEDDINGS_MODEL` / `OLLAMA_EMBEDDINGS_MODEL` → canonical fallback supplies nomic when unset → validation accepts listed nomic dimension or defers unlisted explicit model dimension to runtime provider output → vector length assertion guards corruption.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `shared/embeddings/registry.ts` | Local model manifest source | keep only nomic local entry; remove six stale local alternatives | grep removed model names outside excluded history |
| `shared/embeddings/factory.ts` | Static provider dimension guard | reduce local maps to nomic; add graceful unknown-model runtime path | unknown override test embeds with runtime dim |
| `shared/embeddings/providers/ollama.ts` | Local provider default/copy | trim model-menu mentions; keep fallback-derived default | tsc passes |
| `shared/embeddings/providers/hf-local.ts` | Local provider default/copy | trim model-menu mentions; keep fallback-derived default | tsc passes |
| `shared/embeddings/profile.ts`, `shared/types.ts` | User/provider metadata | remove stale local model-menu copy | grep confirms stale local menu removed |
| Docs | Operator guidance | replace stale local examples with nomic-only guidance | docs grep excludes `embeddinggemma-300m` outside historical files |

Inventory: `rg -n 'mxbai|bge-small|bge-large|jina-v3|bge-m3|snowflake|embeddinggemma' shared .env.example .opencode/skills/system-spec-kit --glob '!benchmarks/**'`. Invariant: local defaults are nomic-only, explicit user overrides are runtime-resolved.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Inventory live local model mentions and separate historical benchmark/test-fixture references from active guidance

### Phase 2: Core Implementation
- [ ] Reduce `registry.ts` local MANIFESTS and canonical fallbacks to nomic-only (REQ-001)
- [ ] Reduce `factory.ts` local dimensions to nomic-only and add the graceful unknown-model runtime guard (REQ-002/003)
- [ ] Trim provider/profile/type model-menu references while preserving fallback-derived defaults (REQ-004)
- [ ] Update active docs to nomic-only local guidance without touching historical benchmark reports (REQ-005/008)

### Phase 3: Verification
- [ ] Verify cloud canonical providers are unchanged (REQ-006)
- [ ] Run TypeScript and embeddings-focused vitest
- [ ] Grep active guidance for removed local model names and document intentional exclusions
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | runtime dimension fallback for unlisted explicit local models | vitest |
| Integration | local provider embedding path with nomic default | embeddings vitest |
| Static | TypeScript compile and grep for stale model names outside excluded history | tsc + rg |
| Regression | cloud canonical providers unchanged | existing provider tests |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `getCanonicalFallback` local-provider contract | Internal | Green | Later phases need one canonical local default |
| Provider runtime dimension signal | Internal | Yellow | Unknown-model override must derive dimension after embedding output |
| Historical benchmark/test fixture exclusion | Process | Green | Prevents documentation cleanup from falsifying history |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A local provider override hard-fails, cloud provider fallback changes, or docs/tests reveal stale behavior after cleanup.
- **Procedure**: Restore removed local manifest/dimension entries first, leaving docs cleanup revertable separately; then revert the unknown-model validation path if it is the regression source.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
