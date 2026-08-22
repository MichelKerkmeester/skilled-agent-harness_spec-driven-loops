---
title: "Verification Checklist: opencode-go Ox Alpha Free roster"
description: "Verification Date: 2026-08-22"
trigger_phrases:
  - "verification"
  - "checklist"
  - "ox-alpha-free roster"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/052-opencode-go-ox-alpha-free-roster"
    last_updated_at: "2026-08-22T10:20:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Verified all P0/P1 items with evidence"
    next_safe_action: "Packet complete pending operator review"
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
# Verification Checklist: opencode-go Ox Alpha Free roster

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
- [x] CHK-002 [P0] Enforcement points + sync invariant identified [evidence: `executor-config.ts` + `fanout-run.cjs` mirror located; 034 prior art]
- [x] CHK-003 [P1] opencode-go availability confirmed [evidence: `opencode models opencode-go` lists `opencode-go/ox-alpha-free`]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `ox-alpha-free` in both synced allowlists (REQ-001) [evidence: `grep -c "'ox-alpha-free'" executor-config.ts`=1, `grep -c ox-alpha-free fanout-run.cjs`=2 (mirror + provider map)]
- [x] CHK-011 [P0] Provider map routes it via opencode-go (REQ-002) [evidence: `PI_MODEL_PROVIDERS` has `['ox-alpha-free','opencode-go']`]
- [x] CHK-012 [P0] fanout module syntactically valid (REQ-003) [evidence: `node --check fanout-run.cjs` exit 0]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Negative control observed before test edit [evidence: pre-edit run failed ONLY on `PI_SUPPORTED_MODELS` exact-roster assertion, diff showed `+ "ox-alpha-free"`]
- [x] CHK-021 [P0] Guard tests green (REQ-003) [evidence: `npx vitest run` executor-config + fanout = `199 passed`]
- [x] CHK-022 [P0] Builder wiring probe (REQ-002) [evidence: `buildLineageCommand` emits `pi -p --offline --model opencode-go/ox-alpha-free probe`]
- [x] CHK-023 [P1] Live dispatch routing (REQ-005) [evidence: pi reached the gateway (429 `GoUsageLimitError`); `opencode run` selected `build · ox-alpha-free`. Full turn deferred by monthly quota — documented]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Both enforcement points updated in sync (no drift) [evidence: `PI_SUPPORTED_MODELS` and `PI_ALLOWED_MODELS` both gained `ox-alpha-free`; fanout mirror-sync test green]
- [x] CHK-FIX-002 [P0] Every allowlisted model has a provider-map entry [evidence: `PI_MODEL_PROVIDERS` covers all 11 ids incl `ox-alpha-free`]
- [x] CHK-FIX-003 [P1] Guard tests re-pinned to the new roster [evidence: `executor-config.vitest.ts` 11-id assertion + `fanout-run.vitest.ts` providerByModel updated]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets added [evidence: `git diff` is roster/doc text only; no keys]
- [x] CHK-031 [P1] No unconfirmed model ids fabricated [evidence: `opencode-go/ox-alpha-free` confirmed live via `opencode models opencode-go` + a real dispatch that the gateway recognized]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `ox-alpha-free` row under `### opencode-go` in both roster docs (REQ-004) [evidence: cli-pi + cli-opencode `providers-and-models.md` rows added]
- [x] CHK-041 [P1] pi store-staleness caveat documented [evidence: cli-pi row records the benign `Using custom model id` warning + catalog-refresh note]
- [x] CHK-042 [P2] Spec/plan/tasks/checklist/implementation-summary synchronized [evidence: all five docs describe the same roster + doc change and the same quota caveat]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] No temp files outside scratch/ [evidence: `git status` shows only the 6 runtime/doc files + this packet]
- [x] CHK-051 [P1] Packet path + naming ok [evidence: `052-opencode-go-ox-alpha-free-roster` matches `^[0-9]{3}-[a-z0-9-]+$`; sits under the cli-external-orchestration track]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 9/9 |
| P1 Items | 8 | 8/8 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-08-22
**Verified By**: AI Assistant (Claude)
**Caveat**: A full end-to-end model turn was not completed because the opencode-go monthly free-tier quota was exhausted (429 `GoUsageLimitError`, resets ~16 days). Model existence and routing were confirmed independently; a completion turn can be re-run after the quota resets or with balance enabled.
<!-- /ANCHOR:summary -->
