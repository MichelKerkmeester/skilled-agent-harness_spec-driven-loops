---
title: "Feature Specification: Per-Runtime Cheapest-Model Standardization of the CLI Manual-Testing Playbooks"
description: "Standardize every cli-external-orchestration per-runtime manual-testing-playbook scenario onto that runtime's cheapest capable dispatch model, so running the playbooks to validate the injection-bloat hooks in each host is cheap and consistent, while preserving scenarios whose explicit purpose is testing a specific model or reasoning tier."
status: complete
completion_pct: 100
trigger_phrases:
  - "playbook cheapest model"
  - "per-runtime playbook model standardization"
  - "cli playbook model swap"
  - "injection-bloat live test prep"
importance_tier: "important"
contextType: "spec"
_memory:
  continuity:
    packet_pointer: "hooks/002-injection-bloat-reduction/010-playbook-cheapest-model"
    last_updated_at: "2026-08-08T10:47:17Z"
    last_updated_by: "claude"
    recent_action: "Standardized the six per-runtime playbooks onto their cheapest models"
    next_safe_action: "Port the delta to skilled/v4.0.0.0 on operator approval"
    blockers: []
    key_files:
      - ".opencode/skills/cli-external-orchestration/cli-codex/manual-testing-playbook/"
      - ".opencode/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/"
      - ".opencode/skills/cli-external-orchestration/cli-claude-code/manual-testing-playbook/"
    session_dedup:
      fingerprint: "sha256:fd7f1b5d0c69ce0c8c6208868fa272416c8fab748d4352b5294db0bae3382a85"
      session_id: "2026-08-08-hooks-002-010"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Model-under-test scenarios (reasoning-effort tiers, model-dispatch, model-selection, haiku fast classification, deepseek-direct provider) keep their original model because the model IS the thing under test; only scenarios where the model is a dispatch vehicle are re-pointed."
---
# Feature Specification: Per-Runtime Cheapest-Model Standardization of the CLI Manual-Testing Playbooks

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete (all six runtimes standardized and verified) |
| **Created** | 2026-08-08 |
| **Branch** | `sk-code/0131-injection-bloat-impl` |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | 009-testing-doc-alignment |
| **Successor** | 011-playbook-results-automation |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 009 established that the injection-bloat hooks were never exercised live inside their host runtimes and that the manual-testing-playbooks were never run. The per-runtime `cli-external-orchestration` playbooks are the natural vehicle for those live runs, but each names a mix of models — often the more expensive tier (`gpt-5.6-sol`, `deepseek/deepseek-v4-pro`), and in the claude-code case stale Claude 4.6 ids (`claude-sonnet-4-6`, `claude-opus-4-6`). Running them as-is to validate the hooks in each host is needlessly costly and inconsistent across runtimes.

### Purpose
Standardize each runtime's playbook scenarios onto that runtime's cheapest capable dispatch model, per operator direction, so a full per-runtime playbook pass is cheap and uniform. The change is documentation-only (it edits playbook scenario text and command lines); it does not alter any hook, code path, or the frozen shadow-delivery behavior. Scenarios whose explicit purpose is testing a specific model or reasoning tier keep their original model.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The six per-runtime manual-testing-playbook trees under `.opencode/skills/cli-external-orchestration/cli-<runtime>/manual-testing-playbook/`
- Re-pointing the dispatch model token in scenarios where the model is a vehicle, per the per-runtime mapping below
- For codex, aligning the default `model_reasoning_effort` to `high` to match the operator-chosen `LUNA HIGH` combination

### Out of Scope
- Any hook, plugin, spec-gate, advisor, or shadow-delivery code behavior
- Scenarios whose explicit purpose is testing a specific model or reasoning tier (they keep their model)
- Actually running the playbooks in each host (a separate live-execution step)
- The `README.md` and non-playbook docs of each cli skill

### Per-Runtime Model Mapping
| Runtime | Cheapest model (operator-chosen) | Dispatch form written |
|---------|----------------------------------|-----------------------|
| Codex | GPT-5.6 LUNA, high effort | `--model gpt-5.6-luna -c model_reasoning_effort="high" -c service_tier="fast"` |
| Cursor | Composer 2.5 | `--model composer-2.5 --force` |
| Devin | SWE-1.7 | `SWE-1.7` |
| OpenCode | DeepSeek v4 Flash (opencode-go gateway) | `--model opencode-go/deepseek-v4-flash` |
| Pi | DeepSeek v4 Flash (opencode-go gateway) | `opencode-go/deepseek-v4-flash` |
| Claude | Sonnet 5 | `--model claude-sonnet-5` |

### Files to Change
| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `cli-codex/manual-testing-playbook/**` | Modify | `gpt-5.5`/`gpt-5.6-sol`/bare `gpt-5.6` → `gpt-5.6-luna`; default effort → `high` |
| `cli-cursor/manual-testing-playbook/**` | Modify | residual non-composer dispatch models → `composer-2.5` |
| `cli-devin/manual-testing-playbook/**` | Modify | residual `swe-1.6` → `SWE-1.7` |
| `cli-opencode/manual-testing-playbook/**` | Modify | `deepseek/deepseek-v4-pro` → `opencode-go/deepseek-v4-flash` |
| `cli-pi/manual-testing-playbook/**` | Modify | deepseek dispatch → `opencode-go/deepseek-v4-flash` |
| `cli-claude-code/manual-testing-playbook/**` | Modify | `claude-sonnet-4-6`/`claude-opus-4-6` → `claude-sonnet-5` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Each runtime's vehicle-model scenarios dispatch that runtime's operator-chosen cheapest model | A grep of each runtime's playbook tree shows the target model and no residual replaced model outside preserved scenarios |
| REQ-002 | Model-under-test scenarios keep their original model | The `reasoning-effort`, `model-dispatch`, `reasoning-and-models`, model-selection, and deepseek-direct scenarios are unchanged |
| REQ-003 | The change is documentation-only with no code or behavior touched | `git status` shows only `manual-testing-playbook` markdown plus this packet; no runtime source changed |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Each written model id and flag form is valid for its runtime | Each target model string matches the id/flag documented in the runtime's `cli-<runtime>/SKILL.md` |
| REQ-005 | The opencode and pi deepseek dispatch uses the gateway, not the direct DeepSeek API | The written form is `opencode-go/deepseek-v4-flash`, never `deepseek/deepseek-v4-flash` |
| REQ-006 | Stale Claude 4.6 model ids are modernized to the Claude 5 family | No `claude-*-4-6` id remains in a re-pointed claude-code scenario; the target is `claude-sonnet-5` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every vehicle-model scenario across the six runtimes names the operator-chosen cheapest model
- **SC-002**: Every preserved model-under-test scenario is unchanged and still names its original model
- **SC-003**: No runtime source, hook, or shadow-delivery behavior is touched — the diff is playbook markdown plus this packet only
- **SC-004**: Each written model string is valid against its runtime's `SKILL.md`, and opencode/pi resolve to the gateway provider
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A blind find-replace corrupts a persona/prose token or a model-under-test scenario | High | Model tokens are distinctive ids; preserved dirs are excluded by path; a post-edit grep proves no residual and no over-reach |
| Risk | An invalid model id is written, so a later run fails to dispatch | Medium | Each target string is confirmed against the runtime's `SKILL.md` before writing |
| Risk | opencode/pi accidentally point at the direct DeepSeek API | Medium | The gateway prefix `opencode-go/` is asserted by grep; the direct `deepseek/` form is scanned for and must be absent in re-pointed scenarios |
| Dependency | The playbook tree matches `origin/skilled/v4.0.0.0` | High | Confirmed identical before editing, so a later port to v4 is conflict-free |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Should codex scenarios that deliberately use `xhigh` for deeper-validation demonstrations be capped at `high`, or left as intentional exceptions? (Left as exceptions; only the default `medium` tier is raised to `high`.)
- Should the claude-code `ai-council` scenarios that used `opus` for planning quality stay on opus, or move to the cheapest `sonnet-5`? (Moved to `sonnet-5` per the cheapest-model directive; ai-council tests routing, not model tier.)
<!-- /ANCHOR:questions -->
