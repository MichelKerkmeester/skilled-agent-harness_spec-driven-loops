---
title: "Implementation Plan: Route the cli-pi DeepSeek V4 Flash fan-out literal through the DevPass LLM Gateway"
description: "One map value moves from opencode-go to llmgateway; every comment, test pin and roster row that asserted the old mapping follows, and the route is proven by a direct dispatch before the fan-out relies on it."
trigger_phrases:
  - "implementation plan"
  - "devpass deepseek route plan"
  - "provider map flip"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Route the cli-pi DeepSeek V4 Flash fan-out literal through the DevPass LLM Gateway

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | CommonJS fan-out driver plus a TypeScript constants module under `system-deep-loop/runtime` |
| **Framework** | deep-loop fan-out lineage command builders |
| **Storage** | None |
| **Testing** | `vitest` unit suites plus one live `pi` dispatch against the gateway |

### Overview
The fix is one map value, the same shape as packet 041. The rest of the diff is the comments, test pins and roster rows that documented the old mapping, corrected in the same commit so no reader meets a contradiction. The route was proven by a direct dispatch that returned the requested token before any lane depended on it.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One literal, one provider: the command builder composes `${provider}/${model}` in one place and the map is the only routing decision.

### Key Components
- **`PI_MODEL_PROVIDERS`**: the map that names the provider per literal
- **`isFlashMaxPinnedModel`**: unchanged; the literal already matched and DevPass offers `max`

### Data Flow
Lineage model literal → provider map → `pi --model llmgateway/<literal> --thinking max`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The cli-pi adapter cases and the executor-config suite | vitest |
| Integration | A direct `pi` dispatch on the route, read by output text | pi |
| Manual | Residue search for the old mapping in comments and the roster | grep |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Packet 041's `cli-pi` env allowlist entry | Internal | Green | Without it the dispatch would lose the gateway credential |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: DevPass stops serving the model, or a fan-out consumer needs the opencode-go route
- **Procedure**: `git revert` the single commit
<!-- /ANCHOR:rollback -->
