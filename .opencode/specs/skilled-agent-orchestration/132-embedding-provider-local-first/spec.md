---
title: "Feature Specification: Embedding Provider Local-First Resolution"
description: "resolveProvider() in the shared embeddings factory resolves cloud providers (OpenAI/Voyage) ahead of the local hf-local fallback in auto mode, contradicting the intended Ollama > HF > OpenAI/Voyage priority that auto-select.ts and getCascadeFallbackOrder already follow. Make the runtime resolver local-first so cloud is opt-in (explicit) or last-resort cascade only."
trigger_phrases:
  - "embedding provider priority"
  - "ollama default embedder"
  - "local-first embeddings"
  - "resolveProvider cloud fallback"
  - "hf-local before openai voyage"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/132-embedding-provider-local-first"
    last_updated_at: "2026-06-02T18:50:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Traced 3 provider-order definitions; only resolveProvider is non-local-first"
    next_safe_action: "Edit resolveProvider + cascade triggers; rebuild shared; run tests"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/shared/embeddings/factory.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "embedding-localfirst-session"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions:
      - "User directive: Ollama > HF > OpenAI/Voyage; ollama is default. Confirmed via /memory_health live provider=ollama."
---
# Feature Specification: Embedding Provider Local-First Resolution

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-06-02 |
| **Branch** | `132-embedding-provider-local-first` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The shared embeddings factory has three provider-order definitions. Two are already local-first (`auto-select.ts` bootstrap cascade and `getCascadeFallbackOrder()`: `ollama → hf-local → openai → voyage`). The third, `resolveProvider()` (the primary runtime resolver), resolves `explicit → persisted-ollama → voyage(if key) → openai(if key) → hf-local(last)` — putting cloud **above** local hf-local in auto mode. When Ollama is unavailable and a cloud API key is present, the system silently uses OpenAI/Voyage instead of the local model, contradicting the intended `Ollama > HF > OpenAI/Voyage` priority and the local-first/egress-conscious design (whose own drift warnings already tell operators to opt into cloud explicitly).

### Purpose
Make `resolveProvider()` local-first so auto mode never silently selects cloud: `ollama → hf-local`, with cloud reachable only via explicit `EMBEDDINGS_PROVIDER` or the existing hf-local→cloud creation-failure cascade.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `resolveProvider()` (factory.ts): remove the auto-mode voyage/openai branches so auto resolves `explicit → persisted-ollama → hf-local`.
- `createEmbeddingsProvider()` (factory.ts): add `hf-local` to the warmup-failure and error-catch fallback triggers so a local creation failure cascades to cloud via `getCascadeFallbackOrder('hf-local') = ['openai','voyage']` (preserving cloud as genuine last-resort).
- Remove the now-dead `isPlaceholderKey` helper (only used by the removed branches).
- Update the stale `it.skip` cloud-preference tests in `embeddings.vitest.ts` to reflect local-first.

### Out of Scope
- `auto-select.ts` bootstrap cascade and `getCascadeFallbackOrder()` — already local-first; no change.
- Persisted active-embedder logic (`resolveActiveOllamaEmbedder`) — unchanged; ollama-default already works.
- Doc wording in install guides / READMEs — handled in the 131 doctor-alignment packet (consumes this change as ground truth).
- Daemon redeploy — live daemon already runs on persisted ollama; this change affects the fallback path only.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/shared/embeddings/factory.ts` | Modify | resolveProvider local-first + createEmbeddingsProvider hf-local cascade trigger + drop dead helper |
| `.opencode/skills/system-spec-kit/mcp_server/tests/embeddings.vitest.ts` | Modify | Update stale skipped cloud-preference tests to local-first |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Auto-mode resolveProvider is local-first | With no explicit provider + no persisted ollama, `resolveProvider().name === 'hf-local'` even when VOYAGE/OPENAI keys are set |
| REQ-002 | Persisted-ollama + explicit override unchanged | `factory-auto-resolution.vitest.ts` (ollama) passes; `EMBEDDINGS_PROVIDER=voyage` still resolves voyage |
| REQ-003 | hf-local failure still cascades to cloud | createEmbeddingsProvider triggers `getCascadeFallbackOrder('hf-local')` on hf-local create/warmup failure in auto mode |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | All three order definitions agree | auto-select.ts, getCascadeFallbackOrder, resolveProvider all express `ollama → hf-local → openai → voyage` |
| REQ-005 | Embedder test suite green | targeted embedder vitest subset passes (isolated DBs) |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: In auto mode, cloud providers are never silently selected; local (ollama→hf-local) is always preferred; cloud is explicit or last-resort cascade only.
- **SC-002**: Embedder test gate passes; `tsc --build` clean; `validate.sh --strict` Errors 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Removing cloud auto-branches makes cloud unreachable when hf-local also fails | No embedder available | hf-local→cloud cascade added to createEmbeddingsProvider; cloud still reachable on local failure (if keys set) |
| Risk | Shared module used by mk-spec-memory AND skill-advisor | Cross-consumer regression | Test gate covers factory resolution; both consumers call the same resolveProvider; behavior change is auto-mode fallback only |
| Risk | Test imports from shared/dist | Stale dist hides the change | Rebuild shared before running tests |
| Dependency | node:sqlite for active-embedder reads in tests | — | Already used by existing passing test |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. L2: NON-FUNCTIONAL REQUIREMENTS

### Security
- **NFR-S01**: Local-first reduces unintended cloud egress (no silent OpenAI/Voyage calls in auto mode) — aligns with the existing egress-monitoring intent.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. L2: EDGE CASES

- No ollama + no hf-local server + cloud key set → hf-local create fails → cascade to cloud (openai→voyage). ✓
- No ollama + no hf-local + no cloud key → cascade empty → throws (nothing available). Acceptable.
- Explicit `EMBEDDINGS_PROVIDER=openai|voyage` → cloud used directly (unchanged).
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | One shared file (2 edits + dead-helper drop) + one test file |
| Risk | 12/25 | Behavioral change to shared infra used by two MCP servers; egress-affecting |
| Research | 6/20 | Full trace of 3 order definitions + test gate identified |
| **Total** | **26/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. Priority + scope confirmed by the user (Reorder code + align docs).
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Verification Checklist**: See `checklist.md`
- **Doc consumer**: packet `131-doctor-install-alignment` (embedding wording reflects this change)
