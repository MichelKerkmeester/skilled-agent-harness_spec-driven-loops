---
title: "Tasks: wire DevPass into cli-pi by config"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "devpass pi provider"
  - "llmgateway pi config"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/062-devpass-pi-custom-provider"
    last_updated_at: "2026-09-04T00:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "All tasks complete; verified against a scrubbed environment"
    next_safe_action: "None - work is complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-062-devpass-pi"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: wire DevPass into cli-pi by config

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm pi has no llmgateway builtin [evidence: `grep -rn llmgateway .pi/` returns nothing; `pi --version` = 0.84.3]
- [x] T002 Locate the credential without exposing it [evidence: opencode auth store holds `llmgateway` `{type:"api", key:<48 chars>}`; no `LLMGATEWAY_API_KEY` in the environment]
- [x] T003 Read the cline-pass precedent rather than recalling it [evidence: packet 049 phases 003, 006, 009 — `openai-completions` requirement, verbatim-id rule, `${VAR}` vs `{env:VAR}`]
- [x] T004 Settle the wire id format by negative control [evidence: live API — `"model":"deepseek-v4-flash"` → HTTP 200 (upstream `gonka24/deepseek-v4-flash`); `"model":"llmgateway/deepseek-v4-flash"` → HTTP 400 `Provider llmgateway does not support model deepseek-v4-flash`]
- [x] T005 Confirm the other three bare ids on the wire [evidence: vision-exp → 200 `deepseek/deepseek-v4-flash-vision-exp`; glm-5.3-flash → 200 `zai/glm-5.3-flash`; gemini-3.8-flash → 200 `google-vertex/gemini-3.8-flash`]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 Add the `providers.llmgateway` block with four models and per-model ladders (`.pi/models.json`) [evidence: `openai-completions`; `${LLMGATEWAY_API_KEY}`; no provider-level `thinkingFormat`]
- [x] T007 Add the four picker entries (`.pi/settings.json`)
- [x] T008 Preserve operator formatting on both files [evidence: text-level insert, not a JSON round-trip; `models.json` keeps its no-trailing-newline form; both `JSON.parse` clean]
- [x] T009 Document the provider, stating the bare-id rule against the Cline inversion (`.pi/custom-providers.md` §3; key section generalized; verify/remove extended; sections renumbered)
- [x] T010 Add the roster section (`cli-pi/references/providers-and-models.md`)
- [x] T011 Correct the residual "same ceiling on every route" GLM claim left in the cline-pass section (`cli-pi/references/providers-and-models.md`)
- [x] T012 Export `LLMGATEWAY_API_KEY` (`~/.zshenv`) [evidence: set by the operator; a fresh non-interactive `zsh -c` sees it at 48 chars]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Provider loads [evidence: `pi --list-models` shows four `llmgateway` rows with the declared context and output limits]
- [x] T014 Live dispatch, all four at their own ceilings [evidence: `deepseek-v4-flash` max → `DEVPASS-PI-OK`; `deepseek-v4-flash-vision-exp` max → `PI-VIS`; `glm-5.3-flash` max → `PI-GLM`; `gemini-3.8-flash` high → `PI-GEM`]
- [x] T015 Prove the credential came from config, not a stored login [evidence: pi's auth store lists minimax, xiaomi, deepseek, opencode-go, openrouter, cline-pass, openai-codex — no `llmgateway`, so the env reference is the only path that could have resolved]
- [x] T016 No secret in any tracked file [evidence: `apiKey` is the `${LLMGATEWAY_API_KEY}` reference; the key was passed only through a process env var during testing]
- [x] T017 Confirm a dispatched shell authenticates without an inline export [evidence: `env -u LLMGATEWAY_API_KEY zsh -c '... pi -p ...'` — the variable was scrubbed from the parent environment so `~/.zshenv` was the only source, and the dispatch returned `ZSHENV-OK`]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks `[x]` [evidence: T001-T017, no `[B]` remaining]
- [x] Every model id proven by live dispatch, not inferred from the sibling block
- [x] Both `.pi` files valid and formatted as the operator keeps them
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
