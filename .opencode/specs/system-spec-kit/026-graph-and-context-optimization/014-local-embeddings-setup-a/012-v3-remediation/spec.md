---
title: "Feature Specification: Phase 12 - v3 Remediation"
description: "Remediate still-valid P0/P1 findings from 014 review-report-v3, flip memory-side hf-local dtype default to q8, restore launcher parity, and align Setup A docs."
trigger_phrases:
  - "012 v3 remediation"
  - "q8 system default"
  - "review-report-v3 remediation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-setup-a/012-v3-remediation"
    last_updated_at: "2026-05-13T08:30:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Shipped in 42aa114e3 with main-agent .codex patch"
    next_safe_action: "Use 013 for v4 cleanup follow-up"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0140120c2a9e0000000000000000000000000000000000000000000000000001"
      session_id: "014-012-v3-remediation-2026-05-13"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Gate 3 folder? -> User pre-answered existing 014/012 to be created"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 12 - v3 Remediation

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Complete (shipped 2026-05-13 in 42aa114e3) |
| **Created** | 2026-05-13 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 12 of 12 |
| **Predecessor** | 009-cocoindex-ipc-fix + 011-embeddinggemma-unification |
| **Successor** | None |
| **Handoff Criteria** | q8 default and v3 remediation shipped in 42aa114e3; strict validation exits 0 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

`review/review-report-v3.md` found drift after the Setup A cascade: memory dtype defaults still favored fp32, some launchers bypassed `.env.local`, dtype was not part of the memory DB profile key, Voyage auto-resolution warned too late, the tcpdump script used a Linux interface, CocoIndex search-only paths trusted client roots, and several child docs still described older Qwen/fp32 states.

This packet is the scoped remediation layer. It does not rotate leaked PATs, touch live daemons, or fork 027 work.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Setup A's shipped behavior and its documentation drifted from the intended local default. New clones could still inherit fp32 memory-side RAM usage, stale launcher paths, dtype-mixed DB filenames, and stale docs that pointed at Qwen-era assumptions.

### Purpose
Make q8 the memory-side system default, ensure dtype changes create distinct DB files, move provider-drift warnings before auto-resolution chooses Voyage, harden CocoIndex search-only validation, and reconcile packet docs so 014 describes the current shipped state.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- q8 memory-side dtype default and docs/config notes
- dtype included in `EmbeddingProfile` slug/JSON/equality/filename behavior
- launcher parity for Claude/Gemini/Codex configs; `.codex` patch shipped by main agent because Apple TCC blocks Codex self-writes
- Voyage auto-shadow warning before provider resolution builds info
- macOS tcpdump `pktap` script fix
- CocoIndex search-only `project_root` validation and unloaded status count
- 014 parent, 002/006/009/011 docs, setup recipe, handover, 012 docs

### Out of Scope
- GitHub PAT rotation
- Live CocoIndex daemon mutation
- `.env` secret edits
- 027/001 fork work
- Source files outside the user-approved scope

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `shared/embeddings/**` | Modify + dist rebuild | q8 default, dtype profile key, Voyage guard timing |
| `mcp-coco-index/.../daemon.py` | Modify | search-only root validation and unloaded DB status count |
| `.claude/mcp.json`, `.gemini/settings.json` | Modify | route through `spec-kit-memory-launcher.cjs` |
| `.codex/config.toml` | Modified | main agent applied launcher route and q8 filename note in 42aa114e3 |
| `.env.example` | Modify | dtype override docs |
| `014/** docs` | Modify/Create | current-state alignment and 012 packet docs |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | q8 is the memory-side system default | `resolveDtype()` defaults to q8 and `.env.example` documents fp32/q4 overrides |
| REQ-002 | Launchers load `.env.local` | Claude/Gemini/Codex route through launcher; `.codex` patch shipped in 42aa114e3 |
| REQ-003 | dtype is part of the memory profile key | hf-local DB filename includes `__q8` and profile JSON/equality include dtype |
| REQ-004 | Voyage guard fires before auto shadowing | `validateConfiguredEmbeddingsProvider()` and startup dimension path warn before info building |
| REQ-005 | macOS tcpdump script is valid | `tcpdump-verify.sh` uses `pktap` with `TCPDUMP_IFACE` override |
| REQ-006 | CocoIndex search-only roots are validated | `project_root` resolves inside home and rejects `..` segments before sqlite open |
| REQ-007 | Unloaded project status reads disk DB | status opens existing `target_sqlite.db` read-only and counts chunks/files/languages |
| REQ-008 | Docs match terminal state | 002/006/009/011/parent/setup/handover docs describe EmbeddingGemma q8/bf16 and current status |
| REQ-009 | Parent metadata includes 012 | parent `children_ids` and phase map include 012 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: New memory-side clones use q8 unless `HF_EMBEDDINGS_DTYPE` overrides it.
- **SC-002**: q8/fp32/q4 memory vectors cannot share one sqlite profile filename.
- **SC-003**: Writable runtime configs use `spec-kit-memory-launcher.cjs`.
- **SC-004**: CocoIndex search-only mode rejects out-of-home project roots.
- **SC-005**: Parent strict validation exits 0 errors / 0 warnings.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Codex cannot directly edit its own `.codex/config.toml` under Apple TCC | Low | Main agent applied the patch in 42aa114e3; future Codex-only note changes should record a scratch patch |
| Risk | dtype in slug changes active DB filename | Medium | Intended behavior; prevents mixed precision reuse |
| Risk | sqlite-vec extension unavailable for unloaded status | Low | Fall back to current 0-count behavior and log clearer refresh message |
| Dependency | TypeScript build | Required | Run `npx tsc --build` from shared package |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

(none)
<!-- /ANCHOR:questions -->
