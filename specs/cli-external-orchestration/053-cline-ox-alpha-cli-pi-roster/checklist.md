---
title: "Verification Checklist: Ox Alpha via the Cline provider for cli-pi"
description: "Verification Date: 2026-08-24"
trigger_phrases:
  - "verification"
  - "checklist"
  - "cline ox-alpha cli-pi"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/053-cline-ox-alpha-cli-pi-roster"
    last_updated_at: "2026-08-24T10:18:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "All P0/P1/P2 items verified with evidence (10/8/1)"
    next_safe_action: "Commit when operator approves"
    blockers: []
    key_files:
      - ".pi/models.json"
      - ".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-053-cline-ox-alpha-cli-pi"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Ox Alpha via the Cline provider for cli-pi

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

- [x] CHK-001 [P0] Requirements documented in spec.md [evidence: `spec.md` REQ-001..007 present]
- [x] CHK-002 [P0] Fan-out enforcement points + guard sites identified [evidence: `PI_SUPPORTED_MODELS`, `PI_ALLOWED_MODELS`, `PI_MODEL_PROVIDERS`, 3 guard tests located]
- [x] CHK-003 [P0] Ox Alpha facts confirmed from a real source [evidence: pi model store (`~/.pi/agent/models-store.json`) — `contextWindow` 1000000, `maxTokens` 131072, `reasoning: true`]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `x-ai/ox-alpha` in both synced allowlists (REQ-003) [evidence: `PI_SUPPORTED_MODELS` + `PI_ALLOWED_MODELS`; byte-sync guard green]
- [x] CHK-011 [P0] Provider map routes it via cline-pass (REQ-004) [evidence: `PI_MODEL_PROVIDERS` has `['x-ai/ox-alpha','cline-pass']`; builder emits `cline-pass/x-ai/ox-alpha`]
- [x] CHK-012 [P0] `.pi` config carries the model + three-segment enabledModels id (REQ-001/002) [evidence: models.json block + `cline-pass/x-ai/ox-alpha` in enabledModels; `pi --list-models` row]
- [x] CHK-013 [P0] fanout module syntactically valid (REQ-005) [evidence: `node --check fanout-run.cjs` exit 0]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Guard tests green (REQ-005) [evidence: `executor-config.vitest.ts` + `fanout-run.vitest.ts` = 199 passed / 0 failed]
- [x] CHK-021 [P0] Builder wiring probe emits the 3-segment selector (REQ-004) [evidence: `["-p","--offline","--model","cline-pass/x-ai/ox-alpha","probe"]`]
- [x] CHK-022 [P1] Live Cline dispatch returns a real reply (REQ-007) [evidence: `cline-pass/x-ai/ox-alpha` returned `PONG` at `xhigh` and `off`]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Both enforcement points updated in sync (no drift) [evidence: mirror-sync guard green; both gained `x-ai/ox-alpha`]
- [x] CHK-FIX-002 [P0] Every allowlisted model has a provider-map entry [evidence: `PI_MODEL_PROVIDERS` covers `x-ai/ox-alpha`; combo-matrix constructs the cli-pi id]
- [x] CHK-FIX-003 [P1] Guard tests re-pinned to the new roster [evidence: exact-roster + `providerByModel` swapped; `199 passed / 0 failed`]
- [x] CHK-FIX-004 [P1] Cline `xhigh`-ceiling policy stated consistently (no `max`) [evidence: models.json map, custom-providers.md, cli-pi roster all state `xhigh` top / no `max`]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets added (diff is roster/config/doc text only) [evidence: `apiKey` stays `{env:CLINE_API_KEY}`; no key in diff]
- [x] CHK-031 [P1] No unconfirmed model id fabricated (slug live-verified before completion) [evidence: `x-ai/ox-alpha` returned a real `PONG`; the two wrong guesses 404'd and were discarded]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Ox Alpha section in `.pi/custom-providers.md` §2 (REQ-006) [evidence: §2 lists Ox Alpha across overview/where/dispatch/thinking/verify/remove + prefix gotcha]
- [x] CHK-041 [P1] Ox Alpha row under `### cline-pass` in the cli-pi roster (REQ-006) [evidence: table row + `x-ai/` gotcha]
- [x] CHK-042 [P2] Spec/plan/tasks/checklist/implementation-summary synchronized on the Cline route [evidence: all 5 docs use `x-ai/ox-alpha` / `cline-pass/x-ai/ox-alpha`]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] No temp files outside scratch/ [evidence: `git status` shows only the 8 runtime/config/doc files + this packet]
- [x] CHK-051 [P1] Packet path + naming ok (slug matches `^[0-9]{3}-[a-z0-9-]+$`) [evidence: `053-cline-ox-alpha-cli-pi-roster`]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 10 | 10/10 |
| P1 Items | 8 | 8/8 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-08-24
**Verified By**: AI Assistant (Claude)
<!-- /ANCHOR:summary -->
