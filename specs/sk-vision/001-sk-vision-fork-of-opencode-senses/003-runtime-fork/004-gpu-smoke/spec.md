---
title: "Feature Specification: sk-vision GPU smoke"
description: "Optional JSON-RPC load then status against the copied runtime. ping is not the smoke. SKIP allowed when hardware is absent."
trigger_phrases:
  - "sk-vision gpu smoke"
  - "sk-vision load status"
  - "sk-vision moondream2"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-vision/001-sk-vision-fork-of-opencode-senses/003-runtime-fork/004-gpu-smoke"
    last_updated_at: "2026-08-16T07:45:00.000Z"
    last_updated_by: "cursor-grok"
    recent_action: "Authored nested-phase copy pack and L1 suite."
    next_safe_action: "004-opencode-adapter/001-plugin-reexport"
    blockers: []
    key_files:
      - "spec.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-001-sk-vision-fork-of-opencode-senses-003-runtime-fork-004-gpu-smoke"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: sk-vision GPU smoke

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-08-16 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 4 |
| **Predecessor** | 003-build-and-tests |
| **Successor** | None |
| **Handoff Criteria** | Either status shows model_loaded after load, or implementation-summary records SKIP plus hardware note. Packet close does not require GPU. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of `003-runtime-fork`.

**Scope Boundary**: Optional smoke only. No host adapters. No ping-as-pass.

**Dependencies**:
- 003-build-and-tests dist/plugin.js exists.

**Deliverables**:
- PASS load+status evidence, or SKIP with hardware note.

**Changelog**:
- When this phase closes, refresh the matching file in the parent changelog using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
004/005 attach smokes need a known GPU result. Absent hardware must not block 003 close.

### Purpose
Run load then status, or record SKIP. ping is not the smoke.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- NDJSON load then status
- Record SKIP with hardware note if NVIDIA Ampere+ or Apple Silicon is absent

### Out of Scope
- Treating ping as pass
- Requiring GPU to close this parent
- Host adapters
- npm publish

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `implementation-summary.md` | Modify | PASS evidence or SKIP note |

### Implementer copy pack (follow exactly)

Stop and report if any of these is true: dist/plugin.js is missing and no tsc substitute was documented; you are about to treat `ping` as the smoke; you are about to fail the parent solely for missing GPU.

NDJSON over the Python daemon stdin/stdout. Protocol from dump `python/runtime.py`:

Request: `{"id": 1, "method": "load", "params": {}}`
Then: `{"id": 2, "method": "status", "params": {}}`

Pass when `status` shows `model_loaded: true` (or equivalent) after `load`. First `load` may download ~3.9 GB from Hugging Face and provision `~/.cache/sk-vision/venv`. Hardware: NVIDIA Ampere+ or Apple Silicon. 6 GB VRAM is enough for `moondream2`. If hardware is absent, write SKIP plus the hardware note in implementation-summary. `{"method":"ping"}` is not the smoke.

Default model remains `moondream2`.

Close this child with:

```bash
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh specs/sk-vision/001-sk-vision-fork-of-opencode-senses/003-runtime-fork/004-gpu-smoke --strict
```
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Smoke is load then status, not ping | Evidence shows those two methods or SKIP |
| REQ-002 | SKIP allowed | Missing GPU does not fail the parent |
| REQ-003 | No host adapters | plugins/ and .pi/extensions/ untouched |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-P1 | No extra scope | Files outside Files to Change stay untouched |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- [x] PASS load+status OR SKIP with hardware note — PASS: `model_loaded: true`, device `mps`, model `moondream2` (see implementation-summary.md)
- [x] ping is not recorded as the smoke — only `load` and `status` sent
- [x] This child validate.sh --strict — RESULT: PASSED (0 errors, 0 warnings); orchestrator exit 0; wrapper exit 2 from repo-wide COMMAND_TREE_PARITY
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | First load downloads ~3.9 GB | Med | Tell the operator; do not hide |
| Risk | Using ping | High | Stop rule |
| Dependency | Build artifact | High | Stop if dist/plugin.js missing |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

### Answered Questions
- **Q**: Is GPU required to close 003? **A**: No. SKIP is allowed.

### Open Questions
- None.
<!-- /ANCHOR:questions -->
