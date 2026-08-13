---
title: "Verification Checklist: DeepSeek V4 Flash in the cli-pi enforced roster"
description: "Verification evidence for adding deepseek-v4-flash to the enforced pi allowlist and its aligned tests/fixture."
trigger_phrases:
  - "deepseek v4 flash checklist"
  - "pi allowlist verification"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/033-deepseek-v4-flash-pi-roster"
    last_updated_at: "2026-08-02T06:04:34Z"
    last_updated_by: "implementer"
    recent_action: "Verify checklist with evidence"
    next_safe_action: "Packet complete; optional follow-up sk-prompt-models Flash profile"
    blockers: []
    key_files:
      - "system-deep-loop/runtime/lib/deep-loop/executor-config.ts"
      - "system-deep-loop/runtime/scripts/fanout-run.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-035-deepseek-v4-flash"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: DeepSeek V4 Flash in the cli-pi enforced roster

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

- [x] CHK-001 [P0] Flash availability confirmed live per provider
  - **Evidence**: `opencode models deepseek` lists `deepseek/deepseek-v4-flash`; `~/.pi/agent/models-store.json` has `deepseek-v4-flash`; `cursor-agent --list-models` returns 0 DeepSeek; `devin models list` shows only `deepseek-v4-pro`
- [x] CHK-002 [P0] Every pi-roster enumeration located
  - **Evidence**: `grep mimo-v2.5-pro-ultraspeed` found `executor-config.ts`, `fanout-run.cjs`, `executor-config.vitest.ts`, `fanout-run.vitest.ts`, `supported-model-allowlist-smoke.md`
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Flash added to TS source of truth
  - **Evidence**: `PI_SUPPORTED_MODELS` in `executor-config.ts:159` contains `deepseek-v4-flash`
- [x] CHK-011 [P0] CJS mirror + provider map updated
  - **Evidence**: `PI_ALLOWED_MODELS` and `PI_MODEL_PROVIDERS` in `fanout-run.cjs` contain `deepseek-v4-flash` → `deepseek`
- [x] CHK-012 [P1] Typecheck clean
  - **Evidence**: `npm run typecheck` (`tsc --noEmit`) exit 0, no output
- [x] CHK-013 [P1] Change follows existing allowlist pattern
  - **Evidence**: Flash inserted after `deepseek-v4-pro`; no existing entry removed; combo-matrix first-model representative check still targets `deepseek-v4-pro`
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] executor-config vitest passes with eight-id roster
  - **Evidence**: `vitest` suite `PI_SUPPORTED_MODELS / isPiModelAllowed` green; overall `188 passed`
- [x] CHK-021 [P0] fanout-run + combo-matrix vitest pass
  - **Evidence**: `vitest tests/unit/fanout-run.vitest.ts tests/unit/combo-matrix.vitest.ts` green (TS↔CJS alignment + provider-prefixed build)
- [x] CHK-022 [P1] Flash command build confirmed
  - **Evidence**: fanout builds `--model deepseek/deepseek-v4-flash` in the cli-pi adapter provider-map test
- [x] CHK-023 [P1] No regression in existing pi roster
  - **Evidence**: `188 passed (188)`, `0 failed`; representative pi command still `deepseek/deepseek-v4-pro`
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class assigned
  - **Evidence**: `class-of-bug` — doc advertised `deepseek-v4-flash` while enforcement omitted it, fixed in both the TS source and the CJS mirror
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed
  - **Evidence**: `grep mimo-v2.5-pro-ultraspeed` swept all roster producers; only `executor-config.ts` + `fanout-run.cjs` define the pi allowlist
- [x] CHK-FIX-003 [P0] Consumer inventory completed for the changed constant
  - **Evidence**: `grep PI_SUPPORTED_MODELS` importers = `fanout-run.cjs`, `executor-config.vitest.ts`, `combo-matrix.vitest.ts`, `fanout-run.vitest.ts`; all reconciled
- [x] CHK-FIX-004 [P0] Adversarial table tests for security/parser fixes
  - **Evidence**: `[deferred: not a security/path/parser/redaction change; additive allowlist entry only]`
- [x] CHK-FIX-005 [P1] Matrix axes and row count listed
  - **Evidence**: combo-matrix exercises kind×model×sandbox; cli-pi models asserted equal to `PI_SUPPORTED_MODELS`; `188 passed`
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant
  - **Evidence**: `[deferred: no process-wide state read; static allowlist constants only]`
- [x] CHK-FIX-007 [P1] Evidence pinned to explicit source lines
  - **Evidence**: change pinned to `executor-config.ts:159` and the `PI_MODEL_PROVIDERS` entry in `fanout-run.cjs`
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No fabricated model ids
  - **Evidence**: `CURSOR_SUPPORTED_MODELS` / `DEVIN_SUPPORTED_MODELS` in `executor-config.ts` unchanged; `cursor-agent --list-models` and `devin models list` confirm no Flash to add there
- [x] CHK-031 [P0] Allowlist stays fail-closed
  - **Evidence**: `isPiModelAllowed('gpt-3.5-turbo')` still false; `vitest` "rejects an out-of-roster id" green
- [x] CHK-032 [P1] No secrets or credentials touched
  - **Evidence**: `git diff` limited to allowlist constants, tests, fixture, and spec docs
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] PI-017 fixture reflects eight ids
  - **Evidence**: `supported-model-allowlist-smoke.md` count seven→eight and `deepseek-v4-flash` enumerated; stale `sed` range refreshed to `153,174`
- [x] CHK-041 [P1] cli-opencode + cli-pi Flash docs verified
  - **Evidence**: `providers-and-models.md` lists `deepseek/deepseek-v4-flash` (opencode) and `deepseek-v4-flash` (pi)
- [x] CHK-042 [P2] Spec/plan/tasks synchronized
  - **Evidence**: all three reflect the final additive change
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch only
  - **Evidence**: validation logs written only to the session `scratchpad`; no packet temp files
- [x] CHK-051 [P1] scratch cleaned before completion
  - **Evidence**: `git status` shows no packet `scratch/` artifacts under `033-deepseek-v4-flash-pi-roster`
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 10 | 10/10 |
| P1 Items | 10 | 10/10 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-08-02
<!-- /ANCHOR:summary -->
