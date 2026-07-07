---
title: "Feature Specification: Deep-context native-only default executor pool"
description: "The deep-context loop defaulted to a heterogeneous pool (2 native + paid CLI seats) and named specific models in the user-facing options. This packet makes the default native-only and restructures the pool question to Native / Custom."
trigger_phrases:
  - "deep-context native default pool"
  - "deep-context executor pool default"
  - "native only pool deep-context"
  - "deep-context pool question"
  - "executor pool native default"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/025-deep-context-gathering/006-native-default-executor-pool"
    last_updated_at: "2026-06-07T11:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Set native-only default and restructured the pool question"
    next_safe_action: "Run validate.sh --strict and reconcile completion metadata"
    blockers: []
    key_files:
      - ".opencode/skills/deep-context/assets/deep_context_config.json"
      - ".opencode/commands/deep/start-context-loop.md"
      - ".opencode/commands/deep/assets/deep_start-context-loop_auto.yaml"
      - ".opencode/skills/deep-context/SKILL.md"
      - ".opencode/agents/deep-context.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-134-006-native-default-executor-pool"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "What is the new default? -> native-only (2 @deep-context seats)."
      - "Pool options? -> A) Native only (default), B) Custom (native/CLI/combined)."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Deep-context native-only default executor pool

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-07 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`/deep:start-context-loop` defaulted to a heterogeneous executor pool (`2 native + MiMo + gpt + deepseek`) wired in `deep_context_config.json`. Running the bare command silently spawned paid CLI executors (cost/availability surprise), and the user-facing pool question named specific models/CLIs. The operator wants native to be the safe default and the question to stop enumerating a specific pool.

### Purpose
The default pool is native-only (2 `@deep-context` seats); the pool question offers exactly **A) Native only (default)** and **B) Custom** (native / CLI / combined via flags), with no model names in the options.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `deep_context_config.json` `fanout.executors` → 2 native (native-only).
- Restructure the command's Q-Pool to the Native / Custom wording.
- De-name the heterogeneous pool wherever it was presented as the default (command, both YAMLs, SKILL.md, README.md).
- Soften the agent body so it reads correctly under a native-only default, and re-sync all three runtime mirrors.

### Out of Scope
- Changing `fanout.mode` enum (`by-model-shared-scope`) - it is bound across YAML; 2 native still sweep the shared scope.
- Removing the heterogeneous-pool capability - it stays available via `--executor`/`--executors` (shown as a labeled Custom example).
- The deep-command Phase 0 / setup gating - that is a separate packet.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/deep-context/assets/deep_context_config.json` | Modify | Default `fanout.executors` → 2 native |
| `.opencode/commands/deep/start-context-loop.md` | Modify | Q-Pool A/B wording, default-policy prose, examples, PRE-BOUND marker |
| `.opencode/commands/deep/assets/deep_start-context-loop_{auto,confirm}.yaml` | Modify | `executor_pool` description line (de-named default) |
| `.opencode/skills/deep-context/SKILL.md` | Modify | Description, §3 example relabel, Quick-Ref default-pool row |
| `.opencode/skills/deep-context/README.md` | Modify | Default-executor-pool row |
| `.opencode/agents/deep-context.md` (+ `.claude`/`.codex` mirrors) | Modify | Soften "native + CLI" / "shares heterogeneous pool" to native-default-accurate wording; re-sync mirrors |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Config default is native-only | `fanout.executors` = exactly 2 native seats; `fanout.mode` unchanged |
| REQ-002 | Pool question restructured | Command Q-Pool shows exactly A) Native only (default) / B) Custom; no model names |
| REQ-003 | Heterogeneous pool never presented as the default | command/YAML/SKILL/README say "default = native-only"; het list only under Custom/example labels |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Agent body reads correctly under native default | "native, and optionally CLI" wording; "default pool is native-only" present |
| REQ-005 | Three runtime mirrors stay in sync | `.claude`/`.codex` bodies byte-identical to canonical after the edit; Codex TOML parses |
| REQ-006 | Heterogeneous capability preserved | `--executor`/`--executors` still build a CLI/combined pool; a labeled Custom example remains |

### Acceptance Criteria (Given/When/Then)

- **Given** a bare `/deep:start-context-loop:auto "scope"`, **When** no executor flags are passed, **Then** the resolved pool is 2 native seats.
- **Given** the interactive setup, **When** Q-Pool is shown, **Then** it lists only Native (default) and Custom.
- **Given** any command/YAML/SKILL/README text, **When** grepped for the model list, **Then** it appears only in Custom/example contexts.
- **Given** `--executor=cli-codex --model=gpt-5.5`, **When** the pool resolves, **Then** a heterogeneous pool is still built.
- **Given** the canonical agent edit, **When** mirrors are rebuilt, **Then** all three bodies are byte-identical.
- **Given** the Codex mirror, **When** parsed, **Then** it parses and contains the softened wording.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `jq '.fanout.executors' deep_context_config.json` → 2 native; `mode` still `by-model-shared-scope`.
- **SC-002**: Q-Pool shows exactly the Native / Custom wording; no model names in options or default-policy prose.
- **SC-003**: Mirror body parity holds; Codex TOML parses; `validate.sh --strict` passes for this packet.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Weaker agreement signal from 2 same-model native seats | Med - lower confidence diversity | Operator opt-in to heterogeneous pool via one `--executor` flag; documented |
| Risk | Drift between canonical agent and mirrors | Med - native seat fails in a runtime | Re-sync + parity check (005 convention) |
| Dependency | `fanout.mode` enum bound in YAML | Low | Enum left unchanged; only executors + prose edited |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Native-only default avoids spawning external CLI processes on the common path (faster, cheaper).
- **NFR-P02**: No change to per-iteration sweep mechanics; only pool composition default changes.

### Security
- **NFR-S01**: No surprise paid/authenticated CLI executor invocation on the default path.
- **NFR-S02**: Agent mirrors remain read-only (no contract change).

### Reliability
- **NFR-R01**: Default works with always-available native seats (no provider-auth dependency).
- **NFR-R02**: Heterogeneous pool remains available and unchanged when explicitly requested.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- 0 executor flags: resolves to 2 native (the default).
- 1-seat pool: legal but warned (no agreement signal) - unchanged behavior.
- Explicit CLI/combined flags: builds that pool, mode stays `by-model-shared-scope`.

### Error Scenarios
- Provider not authenticated: only relevant when the operator opts into CLI seats; default path has none.
- Mirror drift after agent edit: caught by the parity re-check.

### State Transitions
- Existing saved configs with a heterogeneous pool: unaffected (only the template default changed).
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 7/25 | 1 config default + prose across ~6 files + agent re-sync |
| Risk | 6/25 | Behavior default change; reversible; no logic change |
| Research | 4/20 | Surface mapped via grep; pattern known |
| **Total** | **17/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None. Default (native-only, 2 seats) and option wording confirmed with the user.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
