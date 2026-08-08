---
title: "Implementation Plan: Per-Runtime Cheapest-Model Standardization of the CLI Manual-Testing Playbooks"
description: "Plan for the documentation-only standardization of the six cli-external-orchestration per-runtime manual-testing-playbooks onto their cheapest dispatch models, with model-under-test scenarios preserved and each written model string verified against its runtime SKILL.md."
trigger_phrases:
  - "playbook cheapest model plan"
  - "cli playbook model swap plan"
importance_tier: "important"
contextType: "implementation"
parent: "hooks"
_memory:
  continuity:
    packet_pointer: "hooks/002-injection-bloat-reduction/010-playbook-cheapest-model"
    last_updated_at: "2026-08-08T10:47:17Z"
    last_updated_by: "claude"
    recent_action: "Standardized six runtimes and verified no residual or over-reach"
    next_safe_action: "Port the delta to skilled/v4.0.0.0 on operator approval"
    blockers: []
    key_files:
      - ".opencode/skills/cli-external-orchestration/cli-codex/manual-testing-playbook/"
    session_dedup:
      fingerprint: "sha256:48f89a05bcb4592754da34bd01679f8e76ed38ffbe9fbbf4d52e46883b1c5a24"
      session_id: "2026-08-08-hooks-002-010"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Per-Runtime Cheapest-Model Standardization of the CLI Manual-Testing Playbooks

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown manual-testing-playbooks (RCAF prompts, command lines, verdict tables) |
| **Framework** | Six `cli-external-orchestration` per-runtime playbook trees |
| **Storage** | Flat markdown scenario files; no database |
| **Testing** | Post-edit grep asserts target-model presence, zero residual, and zero over-reach into preserved scenarios |

### Overview
Re-point the dispatch model in every vehicle-model scenario across the six per-runtime playbooks to that runtime's cheapest capable model, standardizing a mix of expensive and stale ids onto one cheap model per runtime. The model is a dispatch vehicle in most scenarios and the thing under test in a minority; the minority is preserved by path. Each target model string is confirmed against its runtime `SKILL.md` before writing, and the opencode/pi deepseek dispatch is pinned to the `opencode-go` gateway rather than the direct DeepSeek API.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Playbook tree confirmed identical to `origin/skilled/v4.0.0.0` (conflict-free later port)
- [x] Per-runtime target model ids confirmed against each `cli-<runtime>/SKILL.md`
- [x] Model-under-test scenarios enumerated for preservation

### Definition of Done
- [x] Every vehicle-model scenario names the operator-chosen cheapest model
- [x] Every preserved scenario is unchanged
- [x] The diff is playbook markdown plus this packet only — no code or behavior touched
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Path-scoped token substitution with a preservation allowlist: distinctive model-id tokens are replaced per runtime, preserved model-under-test directories are excluded, and a post-edit grep proves both completeness (no residual) and containment (no over-reach).

### Key Components
- **Per-runtime substitution**: distinct token sets per runtime (`gpt-5.5`→`gpt-5.6-luna`, `deepseek/deepseek-v4-pro`→`opencode-go/deepseek-v4-flash`, `claude-*-4-6`→`claude-sonnet-5`, etc.).
- **Preservation allowlist**: `reasoning-effort/`, `model-dispatch/`, `reasoning-and-models/`, model-selection, and deepseek-direct scenarios keep their model.
- **Verification grep**: proves target presence, zero residual replaced tokens outside preserved paths, and gateway-not-direct for opencode/pi.

### Data Flow
1. For each runtime, list the vehicle-model scenarios and the preserved paths.
2. Apply the token substitution outside the preserved paths.
3. Grep the tree for the target model (present), the replaced model (absent outside preserved), and the direct DeepSeek form (absent).
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm per-runtime cheapest model ids and flags against each `SKILL.md`
- [x] Inventory real model-token references (boundary-anchored) and the preserved dirs

### Phase 2: Core Implementation
- [x] Codex: `gpt-5.5`/`gpt-5.6-sol`/bare `gpt-5.6` → `gpt-5.6-luna`; default effort `medium` → `high`
- [x] Cursor/Devin: residual non-target dispatch models → `composer-2.5` / `SWE-1.7`
- [x] OpenCode/Pi: deepseek dispatch → `opencode-go/deepseek-v4-flash` (gateway)
- [x] Claude: `claude-sonnet-4-6`/`claude-opus-4-6` → `claude-sonnet-5`

### Phase 3: Verification
- [x] Grep each runtime for target-model presence and zero residual outside preserved paths
- [x] Assert opencode/pi use the gateway, never the direct `deepseek/` API form
- [x] Scope sweep: only playbook markdown plus this packet changed
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Substitution completeness | Target model present, replaced model absent outside preserved paths | `grep -r` |
| Preservation containment | Model-under-test scenarios unchanged | `git diff --stat` on preserved paths |
| Provider correctness | opencode/pi use `opencode-go/` gateway, not `deepseek/` direct | `grep -r` |
| Scope hygiene | Only playbook markdown + this packet changed | `git status --porcelain` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Playbook tree identical to `origin/skilled/v4.0.0.0` | Internal | Confirmed | A later port to v4 would conflict |
| Per-runtime `SKILL.md` model docs | Internal | Confirmed | A wrong model id would break a later dispatch |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A written model id is found invalid, or a preserved scenario was changed by mistake.
- **Procedure**: `git revert` this packet's commit; the edits are documentation-only (playbook model tokens), so a revert restores the prior model strings with no behavior loss.
<!-- /ANCHOR:rollback -->
