---
title: "Feature Specification: RTK Shell-Output Shortening Trial"
description: "Trial RTK (the Rust shell-output shortener bundled with Headroom) on a representative set of our noisy commands, measure savings and correctness, and decide adopt/skip — independent of Headroom proxy/wrap."
trigger_phrases:
  - "rtk shell output trial"
  - "rust token killer trial"
  - "shell output compression"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/029-headroom-utilization/005-rtk-shell-output-trial"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffolded the rtk-shell-output-trial phase"
    next_safe_action: "Obtain the RTK binary and pick representative commands"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-28-029-005-rtk-shell-output-trial"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: RTK Shell-Output Shortening Trial

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
| **Rec** | #5 — RTK shell-output trial |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

Evaluates RTK on its own (Headroom manages the binary via `binaries.py`). RTK shortens noisy command output with claimed 60-90% savings and passes commands through unchanged when it has no filter, so it is safe to trial without the proxy or `wrap`.

**Dependencies**: Independent — does not require the Headroom Python package or the proxy/wrap.

**Status**: Planned — not yet started. Scaffolded as a tracked phase under packet 029.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Our tooling runs many noisy shell commands (git status/diff/log, test runs, builds) whose raw output eats context budget. RTK claims 60-90% reduction on exactly these and is a no-op passthrough when it has no filter, but we have not measured it on our real commands or confirmed it never drops output we depend on.

### Purpose
Trial RTK on a representative set of our noisy commands, measure savings and information fidelity, and make an evidence-based adopt/skip decision — independent of Headroom proxy/wrap.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Obtain the RTK binary (via Headroom `binaries.py` or standalone).
- Run rtk-prefixed vs raw on ≥5 representative commands; measure char/token savings.
- Verify no loss of information our workflows rely on; produce an adopt/skip decision.

### Out of Scope
- Headroom proxy / `wrap` (RTK is evaluated standalone).
- Auto-prefixing all commands repo-wide.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `research/rtk-trial-report.md` | Create | Per-command raw-vs-rtk savings + fidelity + adopt/skip decision |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Measured savings on representative commands | ≥5 commands compared raw vs rtk with char/token deltas recorded |
| REQ-002 | No loss of relied-on information | For each command, confirm rtk output preserves what our workflows consume |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Adopt/skip recommendation | A decision per command class with the measured evidence |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A trial report with measured savings and a per-command adopt/skip call.
- **SC-002**: Any adopted command class is confirmed lossless for our use.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | RTK drops output we need | Lossy on a command we rely on | Diff raw vs rtk; adopt only where fidelity holds |
| Risk | Binary provenance/trust | Running a bundled binary | Verify source/checksum; sandbox the trial |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Standalone RTK binary vs Headroom-managed download — which is cleaner to trial?
- Which command classes (git/test/build) benefit most for our workflows?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent**: `../spec.md`
- **Research basis**: `../001-research/research/research.md`
