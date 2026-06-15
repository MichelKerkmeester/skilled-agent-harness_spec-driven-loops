---
title: "Feature Specification: MiMo-V2.5-Pro efficiency deep-research via cli-opencode"
description: "Run a deep-research loop (cli-codex gpt-5.5 high/fast) to determine how to best use and maximize the efficiency of MiMo-V2.5-Pro through the cli-opencode dispatch path, producing research.md plus a prioritized delta list for the registry and skill docs."
trigger_phrases:
  - "mimo efficiency deep-research"
  - "mimo-v2.5-pro context budget"
  - "mimo variant behavior research"
importance_tier: "normal"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/126-cli-opencode-mimo-pro-optimization/003-mimo-efficiency-deep-research"
    last_updated_at: "2026-06-01T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Phase-003 research complete; registry backfilled; strict validate PASSED"
    next_safe_action: "Proceed to 004 prompt-framework benchmark"
    blockers: []
    key_files:
      - ".opencode/skills/sk-prompt/assets/model-profiles.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-126-003"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 3: mimo-efficiency-deep-research

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 (research packet) |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-01 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 (follows 001 provider integration; mirrors `120/002`) |
| **Predecessor** | 001-mimo-provider-integration |
| **Successor** | 004-mimo-prompt-framework-benchmark |
| **Handoff Criteria** | `research/research.md` produced with confidence-scored deltas; registry `context_length` + `--variant` notes for `mimo-v2.5-pro` backfilled from confirmed findings |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 001 registered `mimo-v2.5-pro` with placeholder capability metadata (`context_length: null`, `--variant` unverified). We do not yet know MiMo-V2.5-Pro's real context window, reasoning/`--variant` behavior, output-verification quirks, tool-calling style, or quota-pool semantics when driven through cli-opencode — so the registry and skill guidance are incomplete.

### Purpose
Run a deep-research loop (executor: cli-codex `gpt-5.5`, high reasoning, fast tier) on how to best use and maximize the efficiency of MiMo-V2.5-Pro via cli-opencode, mirroring `120/002`. Produce `research.md` (synthesis) plus a prioritized, confidence-scored delta list. Apply the confirmed deltas to the registry and cli-opencode docs.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Deep-research iterations on: context length + active-budget rule, `--variant`/reasoning behavior, output-verification heuristics, tool-calling style, quota-pool semantics, routing heuristics (when to pick MiMo over MiniMax/DeepSeek), and any region/endpoint caveats.
- Synthesis into `research/research.md` + per-iteration files + structured deltas.
- Apply confirmed registry deltas (`context_length`, strengths/weaknesses, `--variant` note) to `model-profiles.json`.

### Out of Scope
- The prompt-framework bake-off (phase 004).
- Live MiMo dispatches for the research itself — research draws on model knowledge + repo evidence + the live probe results, like `120/002` (the benchmark phase owns live dispatches).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `003-.../research/research.md` | Create | Synthesis + delta list |
| `003-.../research/iterations/iteration-NNN.md` | Create | Per-iteration findings |
| `003-.../research/deltas/iter-NNN.jsonl` | Create | Structured per-iteration deltas |
| `.opencode/skills/sk-prompt/assets/model-profiles.json` | Modify | Backfill `mimo-v2.5-pro` context budget + notes (confirmed deltas only) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | research.md produced with deltas | `research/research.md` exists; each delta carries a confidence score + target file |
| REQ-002 | Registry backfilled from confirmed findings only | `model-profiles.json` updates limited to confirmed deltas; unverified items stay null with a note |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Routing heuristics captured | research.md states when to prefer MiMo vs MiniMax vs DeepSeek for cli-opencode dispatch |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `research/research.md` present with a prioritized delta list (P0/P1/P2).
- **SC-002**: Registry deltas applied are traceable to a confirmed finding.
- **SC-003**: `validate.sh --strict` on this folder passes (deep-research markdown is exempt from the per-write strict rule; the folder still validates).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | cli-codex gpt-5.5 (high/fast) research executor | Med — was the intended 120/002 web-research path | codex-cli 0.135.0 lacks `--search`; aborted and switched to the built-in WebSearch tool + live provider metadata + on-machine probe |
| Risk | Public info on a 2026-04 model → some medium/unknown-confidence findings | Med | Current 2026 sources + live `--verbose` provider metadata + probe; flag UNKNOWNs explicitly (`--variant`, subscription window) |
| Risk | Focused synthesis under-explores vs a full 10-iteration loop | Low | Questions tractable from current sources; a full `/deep:start-research-loop` run is available as a deeper follow-up |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Does MiMo-V2.5-Pro honor `--variant` (provider-specific reasoning effort) through the Xiaomi Token Plan endpoint? (Research seeds; confirm against live behavior in 004 if ambiguous.)
- Is there a request-window quota (like MiniMax's 5-hour window) on the Xiaomi Token Plan?
<!-- /ANCHOR:questions -->
