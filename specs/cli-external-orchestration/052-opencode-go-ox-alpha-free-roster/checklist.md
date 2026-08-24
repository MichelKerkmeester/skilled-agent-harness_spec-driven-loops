---
title: "Verification Checklist: Ox Alpha via OpenRouter roster"
description: "Verification Date: 2026-08-22"
trigger_phrases:
  - "verification"
  - "checklist"
  - "ox-alpha roster"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/052-opencode-go-ox-alpha-free-roster"
    last_updated_at: "2026-08-22T11:20:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Verified all P0/P1 items with evidence (openrouter route)"
    next_safe_action: "Commit when operator approves"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts"
      - ".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-052-opencode-go-ox-alpha-free"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Ox Alpha via OpenRouter roster

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

- [x] CHK-001 [P0] Requirements documented in spec.md [evidence: `spec.md` REQ-001..006 present]
- [x] CHK-002 [P0] Enforcement points + OpenRouter policy sites identified [evidence: `grep -rn "OpenRouter.*Flash"` located roster in 2 files + policy in 2 comments + 2 blockquotes]
- [x] CHK-003 [P0] Zen ruled out, OpenRouter confirmed [evidence: `opencode/ox-alpha*` → Model not found; `openrouter/stealth/ox-alpha` → PONG]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `stealth/ox-alpha` in both synced allowlists (REQ-001) [evidence: executor-config=2, fanout-run=2 occurrences]
- [x] CHK-011 [P0] Provider map routes it via openrouter (REQ-002) [evidence: `PI_MODEL_PROVIDERS` has `['stealth/ox-alpha','openrouter']`]
- [x] CHK-012 [P0] opencode-go ox fully removed (REQ-003) [evidence: `grep -c ox-alpha-free` both runtime files = 0]
- [x] CHK-013 [P0] fanout module syntactically valid (REQ-004) [evidence: `node --check fanout-run.cjs` exit 0]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Guard tests green (REQ-004) [evidence: `npx vitest run` = 199 passed]
- [x] CHK-021 [P0] Builder wiring probe (REQ-002) [evidence: emits `pi -p --offline --model openrouter/stealth/ox-alpha probe`]
- [x] CHK-022 [P1] Live dispatch both CLIs (REQ-006) [evidence: `opencode run` + `pi` of `openrouter/stealth/ox-alpha` each returned `PONG`]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Both enforcement points updated in sync (no drift) [evidence: mirror-sync guard green; both gained `stealth/ox-alpha`, both lost `ox-alpha-free`]
- [x] CHK-FIX-002 [P0] Every allowlisted model has a provider-map entry [evidence: `PI_MODEL_PROVIDERS` covers all ids incl `stealth/ox-alpha`]
- [x] CHK-FIX-003 [P1] Guard tests re-pinned to the new roster [evidence: `executor-config.vitest.ts` exact-roster + `fanout-run.vitest.ts` providerByModel swapped; `npx vitest run` 199 passed]
- [x] CHK-FIX-004 [P1] OpenRouter policy relaxed consistently [evidence: `grep -rn "Flash + Ox Alpha"` returns 2 code comments + 2 doc blockquotes]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets added [evidence: `git diff` is roster/doc text only; no keys]
- [x] CHK-031 [P1] No unconfirmed model ids fabricated [evidence: `openrouter/stealth/ox-alpha` confirmed live via `opencode models` + real `PONG` turns; zen ox NOT added because it does not exist]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `openrouter/stealth/ox-alpha` row under `### openrouter` in both docs (REQ-005) [evidence: cli-pi + cli-opencode `providers-and-models.md`]
- [x] CHK-041 [P1] opencode-go ox rows removed from both docs [evidence: `grep -c "opencode-go/ox-alpha"` = 0 in both providers-and-models.md]
- [x] CHK-042 [P2] Spec/plan/tasks/checklist/implementation-summary synchronized on the openrouter route [evidence: all five docs describe the same route + policy relaxation]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] No temp files outside scratch/ [evidence: `git status` shows only the 6 runtime/doc files + this packet]
- [x] CHK-051 [P1] Packet path + naming ok [evidence: slug matches `^[0-9]{3}-[a-z0-9-]+$`; slug kept from original framing, content states the OpenRouter route]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 10 | 10/10 |
| P1 Items | 9 | 9/9 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-08-22
**Verified By**: AI Assistant (Claude)
<!-- /ANCHOR:summary -->
