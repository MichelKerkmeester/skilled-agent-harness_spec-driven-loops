---
title: "Feature Specification: OpenRouter DeepSeek-Flash-latest + GPT-5.6-Luna on cli-pi/cli-opencode"
description: "Add OpenRouter-routed DeepSeek V4 Flash (latest) and GPT-5.6 Luna to the cli-pi and cli-opencode rosters, alongside the existing non-OpenRouter entries."
trigger_phrases:
  - "cli-pi openrouter roster"
  - "cli-opencode openrouter model"
  - "deepseek v4 flash latest openrouter"
  - "gpt-5.6 luna openrouter"
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
      - "specs/cli-external-orchestration/047-cli-pi-opencode-openrouter-roster/spec.md"
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts"
      - ".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cli-ext-047-openrouter-roster"
      parent_session_id: null
    completion_pct: 80
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: OpenRouter DeepSeek-Flash-latest + GPT-5.6-Luna on cli-pi/cli-opencode

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
| **Priority** | P2 |
| **Status** | In Progress |
| **Created** | 2026-08-17 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `specs/cli-external-orchestration` |
| **Predecessor** | `046-cli-devin-current-cli-repair` |
| **Successor** | N/A |
| **Handoff Criteria** | Both OpenRouter ids resolve for cli-pi (allowlist + provider map + max-pin) and are documented in both skills' rosters; runtime pi tests green; skill packages unaffected. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
DeepSeek V4 Flash and GPT-5.6 Luna already exist in both rosters, but only via non-OpenRouter providers (`opencode-go`, `openai-codex`, `openai`). OpenRouter — authenticated in both the pi and opencode CLIs (`~/.pi/agent/auth.json`, `~/.local/share/opencode/auth.json`) — was absent from the rosters entirely, and the reference docs still claimed five pi providers when six are authenticated. So an operator could not dispatch **DeepSeek V4 Flash latest** or **GPT-5.6 Luna through OpenRouter** on either CLI.

### Purpose
Add the two OpenRouter-routed ids as **distinct** roster entries (alongside, not replacing, the existing non-OpenRouter ones), and correct the stale provider docs, so both models are legal dispatch targets over OpenRouter. This unblocks a cli-pi deep-research run on the OpenRouter DeepSeek Flash latest model at max thinking.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- cli-pi (dual enforcement): add `deepseek/deepseek-v4-flash-latest` and `openai/gpt-5.6-luna` to `PI_SUPPORTED_MODELS`, `PI_ALLOWED_MODELS`, and `PI_MODEL_PROVIDERS` (→ `openrouter`); extend the Flash max-pin to the `-latest` variant.
- cli-opencode (docs-only): add `openrouter/deepseek/deepseek-v4-flash-latest` and `openrouter/openai/gpt-5.6-luna` rows.
- Correct the stale provider enumeration (5→6, add openrouter) in the cli-pi reference and the cli-opencode auth-preflight.
- Update runtime pi tests for the new roster.

### Out of Scope
- The existing non-OpenRouter deepseek-v4-flash / gpt-5.6-luna entries (unchanged).
- Any cli-opencode runtime change (it has no model allowlist).
- Per-model prompt profiles in `sk-prompt-models/assets/model-profiles.json`.
- The pre-existing cli-devin `--respect-workspace-trust` representative-args test drift (unrelated subsystem).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts` | Update | `PI_SUPPORTED_MODELS` + `isFlashMaxPinnedModel` regex |
| `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Update | `PI_ALLOWED_MODELS`, `PI_MODEL_PROVIDERS`, mirror flash-pin |
| `.opencode/skills/cli-external-orchestration/cli-pi/references/providers-and-models.md` | Update | New OpenRouter §2 sub-section + 5→6 providers |
| `.opencode/skills/cli-external-orchestration/cli-opencode/references/providers-and-models.md` | Update | New OpenRouter §2 sub-section |
| `.opencode/skills/cli-external-orchestration/cli-opencode/SKILL.md` | Update | Model Selection list, keyword line, override example |
| `.opencode/skills/cli-external-orchestration/cli-opencode/references/cli-reference.md` | Update | OpenRouter in the auth-login enumeration |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/{executor-config,fanout-run}.vitest.ts` | Update | New roster ids + dispatch/pin coverage |

### Verification evidence
- `node --check fanout-run.cjs` OK; `tsc --noEmit` shows no errors in touched files.
- `executor-config.vitest.ts` + `fanout-run.vitest.ts` green (195 tests; the two roster-exact assertions updated and passing).
- New ids grep-present in both rosters; `PI_MODEL_PROVIDERS` maps both to `openrouter`; a builder dispatch of `deepseek/deepseek-v4-flash-latest` produces `--model openrouter/deepseek/deepseek-v4-flash-latest --thinking max`.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | cli-pi accepts both ids | `PI_ALLOWED_MODELS` + `PI_SUPPORTED_MODELS` contain both; dispatch does not throw |
| REQ-002 | Both route via OpenRouter | `PI_MODEL_PROVIDERS` maps both to `openrouter`; selector is `openrouter/<upstream>/<id>` |
| REQ-003 | Flash-latest at max thinking | `isFlashMaxPinnedModel('deepseek/deepseek-v4-flash-latest')` is true; dispatch carries `--thinking max` |
| REQ-004 | Runtime tests green | `executor-config` + `fanout-run` vitest pass with the new roster |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-P1 | Rosters documented in both skills | Both `providers-and-models.md` carry an OpenRouter sub-section; provider counts corrected |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- [x] cli-pi runtime accepts both OpenRouter ids. Evidence: `PI_SUPPORTED_MODELS`/`PI_ALLOWED_MODELS` grep + green vitest.
- [x] Both map to `openrouter` and dispatch as 3-segment selectors. Evidence: `PI_MODEL_PROVIDERS` + fanout-run.vitest dispatch assertion.
- [x] Flash-latest pinned to max thinking. Evidence: `isFlashMaxPinnedModel` regex + test.
- [x] Both skills' rosters + provider counts updated. Evidence: OpenRouter sub-sections in both `providers-and-models.md`; SKILL.md + cli-reference.md edits.
- [x] Runtime pi tests green. Evidence: `executor-config.vitest.ts` + `fanout-run.vitest.ts` pass.
- [ ] Changes committed on v4. Evidence: pending the commit.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Slash-containing pi allowlist keys are a new pattern | Selector could double-prefix | `${provider}/${model}` verified to compose `openrouter/deepseek/…` in the builder test |
| Risk | Stale "5 providers" docs mislead | Operator omits openrouter | Corrected to 6 in both reference docs |
| Dependency | OpenRouter auth in pi + opencode | Dispatch fails without it | Confirmed present in both CLIs' auth.json |
<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

### Answered Questions
- **Q**: Distinct ids or repoint existing? **A**: Distinct — the request adds OpenRouter routing alongside the existing opencode-go/openai-codex entries; the slash-in-id form makes them distinct allowlist keys.
- **Q**: Does cli-opencode need a runtime edit? **A**: No — it has no model allowlist; `--model` passes through.

### Open Questions
- None.
<!-- /ANCHOR:questions -->
