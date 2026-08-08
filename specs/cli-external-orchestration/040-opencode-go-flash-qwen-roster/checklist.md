---
title: "Verification Checklist: opencode-go Flash + Qwen 3.8 Max roster"
description: "Verification Date: 2026-08-07"
trigger_phrases:
  - "verification"
  - "checklist"
  - "opencode-go roster"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/040-opencode-go-flash-qwen-roster"
    last_updated_at: "2026-08-07T13:25:40Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Verified all P0/P1 items with evidence"
    next_safe_action: "Packet complete; no further action pending"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts"
      - ".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-040-opencode-go-flash-qwen"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: opencode-go Flash + Qwen 3.8 Max roster

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md [evidence: `spec.md` REQ-001..005 present]
- [x] CHK-002 [P0] Enforcement points + sync invariant identified [evidence: `executor-config.ts` + `fanout-run.cjs` mirror located]
- [x] CHK-003 [P1] opencode-go availability confirmed [evidence: `opencode models` lists both `opencode-go/` ids]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `qwen3.8-max` in both synced allowlists (REQ-001) [evidence: `grep -c qwen3.8-max executor-config.ts`=1, `fanout-run.cjs`=2]
- [x] CHK-011 [P0] Provider map routes both via opencode-go (REQ-002) [evidence: `PI_MODEL_PROVIDERS` has `['qwen3.8-max','opencode-go']` + `['deepseek-v4-flash','opencode-go']`]
- [x] CHK-012 [P0] fanout module syntactically valid (REQ-003) [evidence: `node --check fanout-run.cjs` exit 0]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Guard tests green (REQ-003) [evidence: `npx vitest run` executor-config + fanout = `186 passed`]
- [x] CHK-021 [P0] Live dispatch of both models (REQ-005) [evidence: `opencode run --model opencode-go/qwen3.8-max` and `opencode-go/deepseek-v4-flash` returned OK at exit 0]
- [x] CHK-022 [P1] pi route live-verified [evidence: `pi --provider opencode-go --model qwen3.8-max -p` returned OK]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Both enforcement points updated in sync (no drift) [evidence: `PI_SUPPORTED_MODELS` and `PI_ALLOWED_MODELS` both gained `qwen3.8-max`]
- [x] CHK-FIX-002 [P0] Every allowlisted model has a provider-map entry [evidence: `PI_MODEL_PROVIDERS` covers all 9 ids incl `qwen3.8-max`]
- [x] CHK-FIX-003 [P1] Guard tests re-pinned to the new roster [evidence: `executor-config.vitest.ts` nine-id assertion + `fanout-run.vitest.ts` providerByModel updated]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets added [evidence: `git diff` is roster/doc text only; no keys]
- [x] CHK-031 [P1] No unconfirmed model ids fabricated [evidence: both ids confirmed live via `opencode models` + real dispatch]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `### opencode-go` in both roster docs (REQ-004) [evidence: cli-pi + cli-opencode `providers-and-models.md` sections added]
- [x] CHK-041 [P1] Provider count reconciled [evidence: cli-pi doc updated `four`→`five authenticated providers`]
- [x] CHK-042 [P2] Spec/plan/tasks/checklist/implementation-summary synchronized [evidence: all five docs describe the same roster + doc change]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] No temp files outside scratch/ [evidence: `git status` shows only the 6 runtime/doc files + this packet]
- [x] CHK-051 [P1] Packet path + naming ok [evidence: validator `FOLDER_NAMING` passes for `040-opencode-go-flash-qwen-roster`]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 10 | 10/10 |
| P1 Items | 8 | 8/8 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-08-07
**Verified By**: AI Assistant (Claude)
<!-- /ANCHOR:summary -->
