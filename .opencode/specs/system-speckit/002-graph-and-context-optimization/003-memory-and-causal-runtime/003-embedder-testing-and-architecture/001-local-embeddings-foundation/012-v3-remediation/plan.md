---
title: "Implementation Plan: Phase 12 - v3 Remediation"
description: "A-I remediation plan covering code fixes, documentation alignment, and final validation."
trigger_phrases:
  - "012 v3 remediation plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/012-v3-remediation"
    last_updated_at: "2026-05-13T08:30:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Implementation plan executed and strict validation passed"
    next_safe_action: "Main agent commits the 012 remediation bundle"
    blockers:
      - "None"
    key_files:
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0140120c2a9e0000000000000000000000000000000000000000000000000002"
      session_id: "014-012-v3-remediation-2026-05-13"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 12 - v3 Remediation

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Python, JSON/TOML config, shell, Markdown |
| **Framework** | Spec Kit Memory shared embeddings + CocoIndex daemon |
| **Storage** | sqlite profile filename derives from provider/model/dim/dtype |
| **Testing** | TypeScript build, grep checks, strict spec validation |

### Overview
Execute the exact A-I remediation list from the dispatch. Code first, docs second, validation last. Do not touch live daemons or secrets.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Gate 3 pre-answered by user
- [x] v3 finding list supplied
- [x] Scope boundaries explicit

### Definition of Done
- [x] TypeScript dist rebuild exits 0 after final edits
- [x] dtype filename grep finds dist evidence
- [x] parent strict validation exits 0 errors / 0 warnings
- [x] `.codex` blocker resolved by main-agent patch in 42aa114e3
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Surgical remediation. No new services or broad refactors.

### Key Components
- `HfLocalProvider.resolveDtype()` owns dtype default selection.
- `EmbeddingProfile` owns profile slugs and DB filename derivation.
- `factory.ts` owns startup/provider resolution and Voyage drift warnings.
- CocoIndex `ProjectRegistry` owns daemon search/status boundaries.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Code and Config
- A. Flip hf-local dtype default fp32 to q8; rebuild dist.
- B. Route launchers through `spec-kit-memory-launcher.cjs`; `.codex` was applied by main agent because Apple TCC blocks self-writes.
- C. Add dtype to `EmbeddingProfile` and startup profile construction.
- D. Add pre-resolution Voyage shadow warning.
- E. Switch tcpdump script from `any` to `pktap`.
- F. Validate CocoIndex search-only `project_root`.
- G. Read unloaded CocoIndex sqlite status directly when possible.

### Phase 2: Docs
- H. Align 011, parent docs, setup recipe, 002 dimension claims, 006/009 baseline mentions, and handover.
- I. Append 012 to parent graph metadata.
- J. Create this Level-1 012 packet.

### Phase 3: Verify
- K. Rebuild shared dist and run parent strict validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Build | TypeScript shared embeddings | `npx tsc --build` |
| Static | launcher and dtype evidence | `rg`, `grep` |
| Validation | Spec packet contracts | `validate.sh <014-parent> --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Writable `.codex/config.toml` | Apple TCC | Resolved | main-agent patch shipped in 42aa114e3 |
| sqlite-vec Python module | Runtime optional | Unknown | fallback status message/log if unavailable |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- Set `HF_EMBEDDINGS_DTYPE=fp32` in `.env.local` to restore full precision.
- Revert `EmbeddingProfile` slug change only if mixed-dtype DB reuse is explicitly accepted.
- Revert launcher paths to `dist/context-server.js` only if `.env.local` loading is no longer required.
<!-- /ANCHOR:rollback -->
