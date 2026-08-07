---
title: "Feature Specification: Rerank reaper env knobs and operator docs [template:level_2/spec.md]"
description: "Wire approved reaper env knobs through the rerank sidecar launcher allowlist and document the lifecycle behavior for operators."
trigger_phrases:
  - "rerank reaper env knobs"
  - "sidecar reaper docs"
  - "reaper telemetry path"
  - "manual debug opt-out"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/019-fix-rerank-sidecar-accumulation-with-three-layer-reaper/004-implement-env-knobs-and-skill-docs"
    last_updated_at: "2026-05-23T08:00:00Z"
    last_updated_by: "codex"
    recent_action: "scaffolded-level-2-packet"
    next_safe_action: "implement-launcher-env-and-doc-updates"
    blockers: []
    key_files:
      - ".opencode/skills/system-rerank-sidecar/scripts/start.sh"
      - ".opencode/skills/system-rerank-sidecar/SKILL.md"
      - ".opencode/skills/system-rerank-sidecar/README.md"
    session_dedup:
      fingerprint: "sha256:0100050040000000000000000000000000000000000000000000000000000000"
      session_id: "010-005-004-rerank-reaper-env-docs"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Spec folder pre-approved by user prompt."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Rerank reaper env knobs and operator docs

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-05-23 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The rerank sidecar reaper implementation exists in the app and launchers, but the shell launcher still needs to forward the approved reaper controls through its explicit env allowlist. Operators also need current docs that explain owner-death self-exit, idle timeout, pre-flight reap, telemetry, and the manual debug opt-out without requiring source-code spelunking.

### Purpose
Expose only the approved reaper knobs through `scripts/start.sh` and document the lifecycle behavior in `SKILL.md`, `README.md`, and this packet's verification runbook.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add approved reaper env knobs to the existing `start.sh` allowlist.
- Document reaper lifecycle, defaults, telemetry path, and manual-debug opt-out in `SKILL.md`.
- Document operator behavior, env knobs, telemetry, and manual debug flow in `README.md`.
- Record an integration smoke procedure for manual post-merge execution.

### Out of Scope
- Python app behavior changes. Completed sibling packets own `rerank_sidecar.py`.
- Launcher implementation changes outside `scripts/start.sh`.
- Test fixture, source, or binary changes outside the named files.
- Git commit creation.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-rerank-sidecar/scripts/start.sh` | Modify | Forward only approved reaper env knobs through the existing scrubbed env allowlist. |
| `.opencode/skills/system-rerank-sidecar/SKILL.md` | Modify | Add lifecycle/env/telemetry guidance while staying under 500 LOC. |
| `.opencode/skills/system-rerank-sidecar/README.md` | Modify | Add operator-facing lifecycle, env, telemetry, and manual-debug docs. |
| `.opencode/specs/.../004-implement-env-knobs-and-skill-docs/*` | Modify | Fill Level 2 packet docs, checklist, and implementation summary. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `start.sh` must pass `RERANK_SIDECAR_REAPER_HEARTBEAT_SECONDS`, `RERANK_SIDECAR_REAPER_DISABLE`, `RERANK_SIDECAR_REAPER_TELEMETRY_PATH`, and `RERANK_SIDECAR_IDLE_TIMEOUT_SECONDS`. | `rg` shows all four names in the explicit allowlist and no blanket pass-through was added. |
| REQ-002 | The launcher must keep rejecting unrelated parent-shell env. | The script continues to exec via `env -i` with explicit `env_args`; unrelated knobs are not forwarded. |
| REQ-003 | `SKILL.md` must document the three-layer reaper lifecycle and defaults. | Docs state heartbeat `45`, idle `1800` seconds, pre-flight reap on launch, telemetry path, and `RERANK_SIDECAR_REAPER_DISABLE=1`. |
| REQ-004 | `README.md` must document operator behavior in present tense without packet jargon. | README states owner death self-exit, 30-minute idle timeout, pre-flight reap, no normal manual `kill -9`, telemetry default, and manual debug opt-out. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | This packet must include a manual integration smoke runbook. | `implementation-summary.md` includes the six-step operator runbook with PID, parent-shell death, heartbeat wait, `ps`, and telemetry verification. |
| REQ-006 | `SKILL.md` must stay below the 500 LOC cap. | `wc -l SKILL.md` is less than or equal to 500. |
| REQ-007 | Packet and parent specs must strict-validate. | Both requested `validate.sh --strict` commands exit 0. |
| REQ-008 | The launcher smoke command must not block completion. | `bash scripts/start.sh --help 2>&1 || true` is executed with a bounded run and documented. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: **Given** a supported reaper env knob is set before launch, **When** `start.sh` builds its scrubbed env, **Then** the knob is included in the explicit allowlist.
- **SC-002**: **Given** an unrelated env var is set in the parent shell, **When** `start.sh` reaches the `env -i` boundary, **Then** the unrelated value is not forwarded.
- **SC-003**: **Given** an operator reads the README, **When** they need normal cleanup behavior, **Then** they learn that owner death, idle timeout, and pre-flight reap are the normal path and manual `kill -9` should not be needed.
- **SC-004**: **Given** an operator needs manual debugging, **When** they read the docs, **Then** they can set `RERANK_SIDECAR_REAPER_DISABLE=1` before launch.
- **SC-005**: **Given** a post-merge operator wants an end-to-end check, **When** they follow `implementation-summary.md`, **Then** they can verify PID exit and a telemetry `reap` event with reason `all-owners-dead`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Completed reaper implementation packets | Docs must match implemented env names and defaults. | Use `RERANK_SIDECAR_REAPER_TELEMETRY_PATH`, heartbeat `45`, idle `1800`, and disable `1` from predecessor docs. |
| Risk | Allowlist broadening | A blanket `RERANK_*` pass-through could reopen env leakage. | Add only four explicit keys to the existing allowlist. |
| Risk | README operator jargon | Operator docs become less useful if they mention packet history. | Use present-tense behavior and remove phase references from modified public docs. |
| Risk | Smoke command may start a long-running server | `start.sh --help` has no help path and may exec uvicorn. | Run with bounded timeout during verification and terminate if needed. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Documentation-only changes must not add runtime overhead.
- **NFR-P02**: Reaper env forwarding must reuse the existing launcher env construction without spawning extra processes.

### Security
- **NFR-S01**: The launcher must preserve `env -i` scrubbing and avoid blanket parent-env forwarding.
- **NFR-S02**: Docs must keep request logs and lifecycle telemetry as separate concepts.

### Reliability
- **NFR-R01**: Operator docs must match default values: heartbeat 45 seconds, idle timeout 1800 seconds, telemetry path under `~/Library/Logs/spec-kit/`.
- **NFR-R02**: Manual debug opt-out must be clearly labeled as an exception to normal cleanup.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty env value: forwarded exactly when the approved key is set, matching existing `add_env_if_set` behavior.
- Unrelated env key: never forwarded through the final `env -i` process boundary.
- Telemetry path override: documented as a path override, not as request logging.

### Error Scenarios
- Missing venv: smoke command may fail before exec; this remains acceptable for the requested `|| true` smoke.
- Port already in use: README still documents port override separately from reaper cleanup.
- Long manual debug session: `RERANK_SIDECAR_REAPER_DISABLE=1` inhibits owner/idle self-reap.

### State Transitions
- Owner death: app self-check exits after heartbeat plus slack when all registered owners are dead.
- Idle process: app exits after 30 minutes without `/warmup` or `/rerank`.
- New launch: launcher pre-flight-reaps stale sidecars before starting or reusing a sidecar.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | Three target files plus packet docs. |
| Risk | 10/25 | Env allowlist and public operator docs need exact names/defaults. |
| Research | 8/20 | Requires predecessor ADR and sibling packet review. |
| **Total** | **30/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
