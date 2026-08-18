---
title: "Implementation Plan: Add DeepSeek V4 Flash via the Cline provider to the cli-opencode roster"
description: "Docs-only roster add across three cli-opencode files, mirroring the packet-047 OpenRouter pattern; verification by grep + validate.sh."
trigger_phrases:
  - "cline provider roster plan"
  - "cli-opencode cline-pass docs plan"
  - "add cline model roster opencode"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/048-cline-provider-roster/001-cline-deepseek-flash-cli-opencode"
    last_updated_at: "2026-08-18T08:49:05Z"
    last_updated_by: "claude"
    recent_action: "Plan authored; edits applied"
    next_safe_action: "Validate and close phase"
    blockers: []
    key_files:
      - ".opencode/skills/cli-external-orchestration/cli-opencode/references/providers-and-models.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-048-001"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Add DeepSeek V4 Flash via the Cline provider to the cli-opencode roster

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown skill docs (no code) |
| **Framework** | cli-external-orchestration / cli-opencode mode |
| **Storage** | None |
| **Testing** | `opencode models cline-pass --verbose` (evidence source) + `validate.sh --strict` |

### Overview
Add one provider to the cli-opencode roster by editing three docs the exact way packet 047 added OpenRouter: a `### cline-pass` section and effort row in `providers-and-models.md`, plus mentions in `SKILL.md` and the `cli-reference.md` login menu. Content is anchored to live `opencode models cline-pass --verbose` metadata rather than assumption.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Provider confirmed authenticated (`cline-pass`, type api) and model id confirmed via `opencode models cline-pass`
- [x] Reasoning tiers confirmed via `--verbose` (none→xhigh, no max)
- [x] Edit pattern established from packet-047 diff

### Definition of Done
- [x] All acceptance criteria met (REQ-001..004)
- [x] Docs updated across the three files
- [x] `validate.sh --strict` exit 0
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Documentation roster-add — mirror an existing validated precedent (packet 047 OpenRouter).

### Key Components
- **providers-and-models.md**: the per-mode source of truth for provider/model/effort facts.
- **SKILL.md**: discovery keywords + operator-facing model-selection guidance.
- **cli-reference.md**: the provider auth pre-flight and missing-provider login menu.

### Data Flow
Operator runs `opencode models cline-pass` → picks `cline-pass/cline-pass/deepseek-v4-flash` → dispatches `opencode run --model … --variant xhigh`. The roster docs are the human/dispatcher lookup for that chain.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not a bug fix. One same-class inventory was run to confirm no other roster surface enumerates providers:

- `rg -n "openrouter/deepseek/deepseek-v4-flash-latest" .opencode/skills/cli-external-orchestration/cli-opencode` located every place the sibling OpenRouter id appears; Cline was added at the same points (providers-and-models.md, SKILL.md ×2, cli-reference.md).
- Fan-out executor registry (`system-deep-loop/runtime/…`) is intentionally **not** a consumer here (out of scope) — verified `cline-pass` absent from its provider-model map.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm live provider/model/tier metadata via `opencode models cline-pass --verbose`
- [x] Read packet-047 diff to fix the exact edit points

### Phase 2: Core Implementation
- [x] `providers-and-models.md` — `### cline-pass` section + model row
- [x] `providers-and-models.md` §4 — effort-lever row
- [x] `SKILL.md` — keywords, Common alternates, honor-overrides
- [x] `cli-reference.md` — login menu entry

### Phase 3: Verification
- [x] Grep confirms the model id in both roster surfaces
- [x] `validate.sh --strict` exit 0
- [x] Docs match live `--verbose` tiers
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Evidence | Model id + tiers are real | `opencode models cline-pass --verbose` |
| Doc validation | Spec-folder conformance | `validate.sh --strict` |
| Manual | Grep the new id across roster files | `rg` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Cline auth in opencode | External | Green | None for docs; only affects live dispatch |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Roster entry found inaccurate against a later `opencode models cline-pass`.
- **Procedure**: `git revert` / restore the three doc edits; they are additive and isolated (no code paths touched).
<!-- /ANCHOR:rollback -->
