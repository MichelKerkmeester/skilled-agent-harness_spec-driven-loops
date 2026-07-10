---
title: "Feature Specification: Isolated Install + CacheAligner Detector"
description: "Install Headroom in an isolated, telemetry-off environment and run CacheAligner (detector-only, never mutates) over captured prompts to produce a real findings report, cross-checked against the 002 manual audit."
trigger_phrases:
  - "cachealigner detector"
  - "headroom isolated install"
  - "cache aligner findings"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-headroom-utilization/004-cachealigner-detector"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffolded the cachealigner-detector phase"
    next_safe_action: "Stand up an isolated Headroom venv with telemetry off"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-28-029-004-cachealigner-detector"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Isolated Install + CacheAligner Detector

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Planned |
| **Created** | 2026-06-28 |
| **Branch** | `system-speckit/154-design-context-loading` |
| **Parent Spec** | ../spec.md |
| **Rec** | #3+#4 — Install + CacheAligner detector |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

Turns the 002 manual audit into a tool-backed report. CacheAligner is detector-only by design — `cache_aligner.py:214` never mutates, moves, or normalizes messages. The isolated install here is reused by 006. The opentelemetry import the research hit is just a normal pip dependency (`pyproject.toml:59`), resolved by a proper install.

**Dependencies**: Independent install. Complements 002 (feeds its audit). The install is reused by 006.

**Status**: Planned — not yet started. Scaffolded as a tracked phase under packet 029.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
We want CacheAligner findings as a proper report rather than a manual grep, which requires actually running Headroom. The research could not run live Headroom because it read raw source without installing dependencies (the `opentelemetry` import failed). A clean isolated install resolves that, and CacheAligner is the safest first feature because it never mutates messages.

### Purpose
Install Headroom in an isolated, telemetry-off, offline environment and run CacheAligner detector-only over captured prompts, feeding the findings into the 002 audit.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A throwaway venv install with minimal extras and telemetry/update off, offline.
- Run `CacheAligner.apply()` on captured/sample prompts; collect `VolatileFinding` output.
- Confirm detector-only: input message bytes are unchanged after apply.

### Out of Scope
- Any compression (006).
- Wiring CacheAligner into the live runtime.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `research/install-notes.md` | Create | Isolated install recipe + clean-room env vars |
| `research/cachealigner-findings.md` | Create | CacheAligner detector findings + input-unchanged proof |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Isolated install succeeds with telemetry off | venv installs; `HEADROOM_TELEMETRY=off`, `HEADROOM_UPDATE_CHECK=off`, offline env active |
| REQ-002 | CacheAligner runs detector-only | Findings emitted; input message bytes byte-identical before/after apply |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Cross-check against the 002 manual audit | Tool findings reconciled with the manual volatile-token audit |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A CacheAligner findings report exists from a real run.
- **SC-002**: Detector-only confirmed — apply() leaves input bytes unchanged.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Install pulls heavy/ML deps | Slow, large env | Use minimal extras needed for CacheAligner only; avoid `[ml]` |
| Risk | Telemetry/network leakage | Privacy drift | Clean-room env vars; offline; verify no beacon |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which minimal extras does CacheAligner require (avoid the ML model)?
- Which captured prompts best represent our cached prefix?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent**: `../spec.md`
- **Research basis**: `../001-research/research/research.md`
