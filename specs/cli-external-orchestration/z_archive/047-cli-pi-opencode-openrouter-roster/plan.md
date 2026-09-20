---
title: "Implementation Plan: OpenRouter models on cli-pi/cli-opencode"
description: "Add two OpenRouter-routed ids to cli-pi runtime enforcement + both skills' roster docs."
trigger_phrases:
  - "cli-pi opencode openrouter roster plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "specs/cli-external-orchestration/047-cli-pi-opencode-openrouter-roster"
    last_updated_at: "2026-08-17T18:00:00.000Z"
    last_updated_by: "claude"
    recent_action: "Added both OpenRouter ids to cli-pi runtime and both skills' rosters."
    next_safe_action: "Author remaining phase docs and run validation."
    blockers: []
    key_files:
      - "specs/cli-external-orchestration/047-cli-pi-opencode-openrouter-roster/plan.md"
      - ".opencode/skills/cli-external-orchestration/cli-pi/references/providers-and-models.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cli-ext-047-openrouter-roster"
      parent_session_id: null
    completion_pct: 80
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: OpenRouter models on cli-pi/cli-opencode

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript + CommonJS runtime; markdown roster docs |
| **Framework** | system-deep-loop fan-out runtime; cli-external-orchestration skills |
| **Storage** | `executor-config.ts`, `fanout-run.cjs`; skill `references/` |
| **Testing** | runtime vitest (executor-config, fanout-run); node --check; tsc |

### Overview
cli-pi enforces its roster in three synchronized spots (TS allowlist + CJS mirror Set + provider Map); cli-opencode is docs-only. Add the two OpenRouter ids to all cli-pi enforcement spots plus both skills' docs, and extend the Flash max-pin to the `-latest` variant.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] OpenRouter confirmed authenticated in both CLIs. Evidence: `auth.json` provider lists.
- [x] Exact OpenRouter ids known. Evidence: pi `models-store.json` (`deepseek/deepseek-v4-flash-latest`, `openai/gpt-5.6-luna`).

### Definition of Done
- [x] Runtime accepts + routes both ids; tests green. Evidence: `implementation-summary.md` Verification.
- [x] Both skills' rosters updated. Evidence: `providers-and-models.md` OpenRouter sub-sections present.
- [ ] Changes committed on v4. Evidence: pending the commit.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
For cli-pi the model literal keeps its upstream provider path; `PI_MODEL_PROVIDERS` supplies `openrouter`; `buildPiLineageCommand` composes `${provider}/${model}` into the 3-segment OpenRouter selector. cli-opencode passes the fully-qualified `openrouter/<upstream>/<id>` verbatim.

### Key Components
- **`executor-config.ts`** — TS source of truth (`PI_SUPPORTED_MODELS`, `isFlashMaxPinnedModel`).
- **`fanout-run.cjs`** — synchronous CJS mirror (`PI_ALLOWED_MODELS`, `PI_MODEL_PROVIDERS`, plain `isFlashMaxPinnedModel`).
- **Roster docs** — operator-facing model tables in each skill's `providers-and-models.md`.

### Data Flow
`--executor=cli-pi --model=deepseek/deepseek-v4-flash-latest` → allowlist check → provider `openrouter` → `pi -p --offline --model openrouter/deepseek/deepseek-v4-flash-latest --thinking max`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: cli-pi runtime
- [x] Add both ids to `PI_SUPPORTED_MODELS`, `PI_ALLOWED_MODELS`, `PI_MODEL_PROVIDERS`; extend flash-pin. Evidence: grep + green vitest.

### Phase 2: Docs + tests
- [x] Add OpenRouter sub-sections to both `providers-and-models.md`; update cli-opencode SKILL.md + cli-reference.md; fix provider counts; update runtime pi tests. Evidence: OpenRouter rows + passing suites.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Syntax | CJS builder | `node --check` |
| Types | TS allowlist | `tsc --noEmit` |
| Unit | roster + dispatch + pin | `executor-config.vitest.ts`, `fanout-run.vitest.ts` |
| Grep | docs rows present | `rg` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| OpenRouter auth (pi + opencode) | External | Available | Dispatch would fail auth |
| pi/opencode CLIs installed | External | Available | No dispatch surface |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A new id mis-dispatches or breaks the pi allowlist tests.
- **Procedure**: Remove the two ids from `PI_SUPPORTED_MODELS`, `PI_ALLOWED_MODELS`, `PI_MODEL_PROVIDERS`, revert the flash-pin regex, and drop the OpenRouter doc sub-sections. No existing model entry is touched, so the prior roster keeps working.
<!-- /ANCHOR:rollback -->
