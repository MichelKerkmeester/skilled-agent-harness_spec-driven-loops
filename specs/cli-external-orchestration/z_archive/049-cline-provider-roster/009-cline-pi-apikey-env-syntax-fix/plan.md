---
title: "Implementation Plan: Fix the cline-pass apiKey placeholder so dispatched pi sessions authenticate"
description: "Replace opencode's {env:VAR} placeholder with pi's ${VAR} syntax in the cline-pass provider block, source the key from ~/.zshenv, and record the failure mode in both config documents."
trigger_phrases:
  - "cline apiKey syntax plan"
  - "pi env placeholder plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/049-cline-provider-roster/009-cline-pi-apikey-env-syntax-fix"
    last_updated_at: "2026-08-25T05:05:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Plan authored; syntax fix applied and proven against an empty auth store"
    next_safe_action: "Validate and close phase"
    blockers: []
    key_files:
      - ".pi/models.json"
      - ".pi/custom-providers.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-049-009"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Fix the cline-pass apiKey placeholder so dispatched pi sessions authenticate

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JSON config (`.pi/models.json`) + Markdown docs + a zsh startup file |
| **Framework** | pi 0.84.3 + cli-external-orchestration (cli-pi) |
| **Storage** | No secret in the repo — the key is environment-sourced from `~/.zshenv` |
| **Testing** | JSON parse, isolated-agent-directory live dispatch, A/B of the two placeholder forms, `validate.sh --strict` |

### Overview
pi resolves config values with `$VAR` / `${VAR}` / `!command`. The cline-pass block used opencode's `{env:VAR}`, which pi passes through as a literal key, so Cline answered 401 for every session that did not have the operator's `/login` credential. Switch to `${CLINE_API_KEY}`, export the key where dispatched shells will inherit it, and write down the trap in both places a future editor will look.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Failure reproduced: isolated agent directory returns 401 while the real one succeeds
- [x] pi's supported config-value syntax read from `docs/custom-provider.md`
- [x] Negative control designed: same conditions, only the placeholder differs

### Definition of Done
- [x] `apiKey` is `${CLINE_API_KEY}`; `.pi/models.json` parses
- [x] A live dispatch authenticates from the environment with an empty auth store
- [x] `CLINE_API_KEY` exported from `~/.zshenv`; both config docs corrected
- [x] `validate.sh --strict` exit 0
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Credential resolution by config-value interpolation. pi builds each custom provider from `.pi/models.json` and resolves the `apiKey` string through its own syntax; an unrecognised placeholder is not an error, it is a literal.

### Key Components
- **`.pi/models.json`**: the `apiKey` value is the root fix.
- **`~/.zshenv`**: the environment source, read by zsh for non-interactive shells, which is what dispatched sessions get.
- **`~/.pi/agent/auth.json`**: the `/login` store; higher precedence, but scoped to the resolved agent directory, which is why it masked the defect.

### Data Flow
pi resolves the provider's `apiKey` at stream time, preferring a stored credential for that provider and otherwise interpolating the config value. The resolved string goes to `https://api.cline.bot/api/v1` as the API key. An unresolved placeholder therefore reaches Cline as a key and is rejected there, not locally.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Same-class inventory of every surface that carries or describes the cline-pass credential:

- `.pi/models.json` — the `apiKey` value (root fix).
- `~/.zshenv` — the environment source for dispatched shells.
- `.pi/custom-providers.md` — the setup document that taught the wrong syntax.
- `.opencode/skills/cli-external-orchestration/cli-pi/references/providers-and-models.md` — the skill-side roster description.
- The other `providers.*` blocks in `.pi/models.json` were inventoried and **excluded**: cline-pass is the only config-declared custom provider, and every other entry is a pi builtin credentialed through pi's `envMap`.
- opencode's cline-pass configuration was inventoried and **excluded**: `{env:...}` is correct there.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Diagnose
- [x] Reproduce both reported symptoms against an isolated agent directory
- [x] Read pi's supported config-value syntax from its own documentation
- [x] Confirm `CLINE_API_KEY` was never exported, so the documented environment route had never run

### Phase 2: Fix
- [x] Replace `{env:CLINE_API_KEY}` with `${CLINE_API_KEY}` (`.pi/models.json`)
- [x] Export `CLINE_API_KEY` from `~/.zshenv` and restrict the file to mode 600
- [x] Correct `.pi/custom-providers.md` and the cli-pi provider reference

### Phase 3: Verify
- [x] A/B the two placeholders under identical isolated conditions
- [x] Dispatch live through a fresh non-interactive zsh with an empty auth store
- [x] `validate.sh --strict` exit 0; no probe residue left behind
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Negative control | The pre-fix placeholder still fails | Isolated `PI_CODING_AGENT_DIR`, empty auth store, live dispatch |
| Positive control | The fixed placeholder authenticates | Same conditions, `${CLINE_API_KEY}` |
| End-to-end | Production config resolves the key from the shell startup file | `zsh -c` dispatch against the real `.pi/models.json` |
| Config integrity | `.pi/models.json` parses | `python3 -c json.load` |
| Doc validation | Spec-folder conformance | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 3 cline-pass provider block | Internal | Green | This corrects that block's `apiKey` |
| A valid Cline key | External | Green | Reused from the existing pi auth store |
| zsh reads `~/.zshenv` for non-interactive shells | External | Green | Verified by dispatching through a fresh `zsh -c` |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The environment-sourced key fails where the stored credential worked.
- **Procedure**: Revert this phase's commit to restore the previous `apiKey` string and doc text, and remove the `CLINE_API_KEY` export from `~/.zshenv`. The `/login` credential in `~/.pi/agent/auth.json` is untouched throughout, so interactive sessions keep working during and after a revert. Config-only; no data to unwind.
<!-- /ANCHOR:rollback -->
