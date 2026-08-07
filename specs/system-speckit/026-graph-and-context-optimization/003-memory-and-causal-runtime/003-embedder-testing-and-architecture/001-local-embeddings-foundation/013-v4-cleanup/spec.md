---
title: "Feature Specification: Phase 13 - v4 Cleanup"
description: "Remediate v4 deep-review findings across Voyage guard timing, dtype health visibility, doc currency, config filename notes, and a CocoIndex protocol default."
trigger_phrases:
  - "013 v4 cleanup"
  - "v4 deep-review cleanup"
  - "memory health dtype"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/013-v4-cleanup"
    last_updated_at: "2026-05-13T09:45:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Completed v4 cleanup code and doc fixes"
    next_safe_action: "Run final parent validation before handoff"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0140130c2a9e0000000000000000000000000000000000000000000000000001"
      session_id: "014-013-v4-cleanup-2026-05-13"
      parent_session_id: "014-012-v3-remediation-2026-05-13"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Gate 3 folder? -> User pre-answered new 014/013 packet and scoped writes"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 13 - v4 Cleanup

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-05-13 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 13 |
| **Predecessor** | 012-v3-remediation |
| **Successor** | None |
| **Handoff Criteria** | v4 code/doc findings remediated, shared dist rebuilt, parent strict validation exits 0 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
v4 deep-review found one remaining real startup path where Voyage auto-shadow warnings happened too late, a health-report gap for hf-local dtype, one mutable Python list default, and several documentation/config examples that still described the pre-42aa114e3 or wrong-slug state.

### Purpose
Close the v4 cleanup layer without expanding scope: make provider startup warnings fire before auto-resolution, expose dtype in `memory_health`, let programmatic hf-local callers pass dtype, fix the mutable default, and align 012/parent docs with the shipped 42aa114e3 state.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `factory.ts` startup guard timing and hf-local dtype option pass-through
- `memory_health` embedding provider dtype reporting
- CocoIndex `SearchResult.rankingSignals` default factory
- 012 docs, parent handover, Setup A recipe, and tcpdump comment currency
- 013 Level-1 packet docs and parent metadata registration
- `.codex/config.toml` note patch recorded in 013 scratch if Codex cannot write it directly

### Out of Scope
- GitHub PAT rotation
- 027/001 fork work
- Live daemon mutation
- New embedding model evaluation
- Rewriting earlier historical review iterations

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `shared/embeddings/factory.ts` | Modify + dist rebuild | Early Voyage shadow guard and programmatic dtype option |
| `shared/types.ts`, `providers/hf-local.ts` | Modify + dist rebuild | Dtype metadata/options typing |
| `mcp_server/handlers/memory-crud-health.ts` | Modify | Add dtype to health response |
| `mcp-coco-index/.../protocol.py` | Modify | Replace mutable list default |
| `014/012/**`, `handover.md`, `SETUP_A_RECIPE.md`, `007/.../tcpdump-verify.sh` | Modify | Doc-currency fixes |
| `014/013-v4-cleanup/**` | Create | Packet docs and `.codex` blocker patch |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Voyage auto-shadow guard fires before startup resolution | `getStartupEmbeddingProfile()` and `resolveStartupEmbeddingConfig()` call the warning path before `resolveProvider()` |
| REQ-002 | `memory_health` exposes dtype | `data.embeddingProvider.dtype` reports `q8` for hf-local q8 profiles |
| REQ-003 | 012 docs reflect shipped state | 012 docs say commit 42aa114e3 resolved `.codex` patch state |
| REQ-004 | q8 filename examples use runtime slug | Examples use `context-index__hf-local__onnx-community_embeddinggemma-300m-onnx__768__q8.sqlite` |
| REQ-005 | tcpdump comment references EmbeddingGemma | Qwen-era comment is removed without changing script behavior |
| REQ-006 | Programmatic provider construction accepts dtype | `CreateProviderOptions.dtype` passes through to `HfLocalProvider` |
| REQ-007 | `SearchResult.rankingSignals` avoids mutable default | Uses `msgspec.field(default_factory=list)` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Shared TypeScript build exits 0.
- **SC-002**: Dist grep shows early guard calls, dtype pass-through, and health dtype output.
- **SC-003**: Parent 014 strict validation exits 0.
- **SC-004**: `.codex/config.toml` note update is either applied or captured in `013/scratch/codex-config-patch.md`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS

| Risk | Impact | Mitigation |
|------|--------|------------|
| Guard warning duplicate calls | Low | Existing one-shot `voyageDriftWarned` suppresses repeats |
| Health response shape change | Low | Additive nullable `dtype` field only |
| `.codex` TCC write block | Low | Record exact patch in 013 scratch |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None.
<!-- /ANCHOR:questions -->
