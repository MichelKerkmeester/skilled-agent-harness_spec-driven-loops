---
title: "Feature Specification: Phase 5: operational-caveats (contingency)"
description: "CONTINGENCY — document GLM-5.2 dispatch gotchas discovered in real use (reasoning_effort/variant mapping, preserved thinking, tool_stream, tool_choice=auto, 1M-context over-exploration/timeout) across the glm-5.2 profile + cli-opencode. Mirrors 149/006."
trigger_phrases:
  - "glm-5.2 operational caveats"
  - "glm-5.2 dispatch gotchas"
  - "glm-5.2 timeout reasoning effort"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/157-glm-5-2-support/005-operational-caveats"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Documented benchmark-008 latency + transient caveats"
    next_safe_action: "Packet complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-session/005-operational-caveats"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 5: operational-caveats (contingency)

<!-- SPECKIT_LEVEL: 1 -->

> **CONTINGENCY PHASE — EVENT-GATED.** Execute when GLM-5.2 dispatch gotchas actually surface in real use (the way 149's phase 6 documented Kimi's broad-scope over-exploration → 600s-timeout → 0-bytes failure mode AFTER it was hit). This phase is **forward-looking**: the candidate caveats below come from Z.AI docs + the Kimi precedent and MUST be confirmed by real observation before being written as caveats. Do not author speculative gotchas as fact.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 (contingency) |
| **Status** | Complete (contingency triggered) |
| **Created** | 2026-06-28 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 (contingency) |
| **Predecessor** | 001-model-registration (the surfaces this updates) |
| **Trigger Condition** | A real GLM-5.2 dispatch gotcha is observed (timeout, variant/reasoning behavior, thinking/tool quirk) |
| **Handoff Criteria** | The confirmed caveat + mitigation appears in the glm-5.2 profile + cli-opencode, framed as a dated observation |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is a **contingency phase** of the glm-5-2-support specification, mirroring `149-kimi-k2-7-code-support/006-broad-scope-timeout-caveat`.

**Scope Boundary**: Document confirmed GLM-5.2 dispatch gotchas + mitigations in the canonical surfaces (the `glm-5.2.md` profile §2/§5/§6, `model_profiles.json` weaknesses, and a brief caveat on the GLM line in `cli-opencode/SKILL.md`). Observation-driven, additive notes only — no framework/slug change.

**Candidate caveats to confirm (from Z.AI docs + the Kimi precedent — NOT yet observed):**
- **`reasoning_effort` ↔ `--variant` mapping.** GLM-5.2 has official `reasoning_effort` (`high`, `max`); confirm how opencode's `--variant` maps to it and whether `max` is worth the latency for complex coding.
- **Thinking on by default + preserved thinking.** GLM-5.2 enables thinking by default; the Coding Plan endpoint preserves thinking — confirm whether opencode surfaces/returns `reasoning_content` correctly and whether it inflates latency/output.
- **Streaming tool calls need `tool_stream=true`.** Confirm whether opencode's GLM path handles streamed `delta.tool_calls` correctly.
- **`tool_choice` only `auto`.** Confirm opencode does not pass an unsupported `tool_choice` for GLM.
- **1M-context over-exploration / timeout.** Like Kimi's 256k over-exploration risk, GLM-5.2's 1M context may invite many sequential reads on broad scopes → long dispatch / timeout. Confirm and, if real, document the read-cap + larger-timeout mitigation.

**Changelog**:
- When this phase closes, add the matching file to ../changelog/.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The phase-1 profile records GLM-5.2's documented capabilities, but real dispatch behavior (reasoning-effort cost, thinking preservation, tool-streaming, broad-scope timeouts) is only knowable from use. Undocumented gotchas force every future dispatch to re-discover them — exactly the gap 149's Kimi timeout caveat closed.

### Purpose
Capture confirmed GLM-5.2 dispatch gotchas + proven mitigations in the canonical surfaces so future dispatches budget and configure correctly, framed honestly as dated observations rather than speculation.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Confirmed gotcha(s) + mitigation in `sk-prompt-small-model/references/models/glm-5.2.md` (§2/§5/§6) and `assets/model_profiles.json` (weaknesses).
- A brief operational caveat on the GLM line in `cli-opencode/SKILL.md` (and `cli_reference.md` if relevant).

### Out of Scope
- Re-benchmarking GLM-5.2 (this is operational OBSERVATION, not a benchmark).
- Speculative caveats not backed by a real observation.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-prompt-small-model/references/models/glm-5.2.md` | Modify | §2/§5/§6 confirmed gotcha + mitigation |
| `.opencode/skills/sk-prompt-small-model/assets/model_profiles.json` | Modify | weaknesses: the confirmed gotcha |
| `.opencode/skills/cli-opencode/SKILL.md` | Modify | GLM line operational caveat |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The confirmed gotcha + mitigation appear in both skills | glm-5.2.md + model_profiles weaknesses + cli-opencode SKILL.md carry it |
| REQ-002 | Framed as observation, not benchmark | Text dated, n noted, driver isolation stated honestly |
| REQ-003 | Card-sync stays green | `check-prompt-quality-card-sync.sh` exit 0 after additive edits |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `check-prompt-quality-card-sync.sh` stays green after the edits.
- **SC-002**: Both skills name the confirmed gotcha + mitigation; `model_profiles.json` parses.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Over-generalizing from n=few | Misleading caveat | Frame as dated observation; state what was/wasn't isolated (149/006 precedent) |
| Risk | Breaking the card-sync guard | CI red | Additive notes only; run the guard post-edit |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which candidate caveat(s) actually manifest for GLM-5.2 on this install? (Confirm by observation before documenting.)
- Does `--variant max` (reasoning_effort=max) meaningfully change quality vs. latency for complex coding?
<!-- /ANCHOR:questions -->
