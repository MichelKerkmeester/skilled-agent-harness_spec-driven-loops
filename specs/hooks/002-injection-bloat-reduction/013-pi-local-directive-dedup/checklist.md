---
title: "Verification Checklist: Pi-Local Directive De-Duplication"
description: "Verification evidence for the Pi directive dedup; each item marked [x] carries evidence."
trigger_phrases:
  - "pi directive dedup checklist"
  - "pi directive dedup verification"
importance_tier: "normal"
contextType: "general"
parent: "hooks/002-injection-bloat-reduction"
_memory:
  continuity:
    packet_pointer: "hooks/002-injection-bloat-reduction/013-pi-local-directive-dedup"
    last_updated_at: "2026-08-09T07:30:34Z"
    last_updated_by: "claude"
    recent_action: "Recorded verification evidence for the Pi directive dedup"
    next_safe_action: "None; checklist complete"
    blockers: []
    completion_pct: 100
---
# Verification Checklist: Pi-Local Directive De-Duplication

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

- [x] CHK-001 [P0] Requirements documented in spec.md
  - **Evidence**: spec.md:79-89 (REQ-001..006) and spec.md:68-75 (scope excludes policy-plan.ts / render.ts / activation-matrix.json / non-Pi runtimes).
- [x] CHK-002 [P0] Technical approach defined in plan.md
  - **Evidence**: plan.md architecture — pure decision over `(context, sessionId)` + bounded session map, fail-open.

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Adapter transpiles and typechecks
  - **Evidence**: vitest esbuild transpiles the edited adapter; 54/54 pass. Off-config `tsc` delta = one benign `process` artifact identical to the pre-existing sibling `isPiCompactDirectivePrototypeEnabled`.
- [x] CHK-011 [P1] Follows existing adapter patterns
  - **Evidence**: reuses `compactShadowStore`, `receiptSessionKey`, `MAX_PI_RECEIPT_SESSIONS`; kill-switch mirrors `isPiCompactDirectivePrototypeEnabled`.
- [x] CHK-012 [P0] Fail-open on every uncertain path
  - **Evidence**: `npx vitest run pi/directive-dedup.test.ts` 10/10 (unknown-session, fallback, kill-switch cases); early-return guards in prompt-advisor.ts decidePiDirectiveDelivery.
- [x] CHK-013 [P0] Comment hygiene — no ephemeral ids/spec paths in code comments
  - **Evidence**: prompt-advisor.ts dedup block comment (durable WHY, no ids/paths); `git commit` pre-commit hook exit 0.

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P1] First turn full; identical repeat suppressed (route line kept)
  - **Evidence**: `directive-dedup.test.ts` — reducedContext === HEAD, no "Directives:" in output.
- [x] CHK-021 [P0] Re-delivery on lifecycle/dirty/unknown/fallback/kill-switch
  - **Evidence**: tests for per-session reset, directive-text change, unknown session, directives-only fallback, `SPECKIT_PI_DIRECTIVE_DEDUP=0`.
- [x] CHK-022 [P0] Lifecycle handlers re-arm full delivery
  - **Evidence**: `session_compact` and `session_start` handler-wiring tests via mock API.
- [x] CHK-023 [P0] No regression
  - **Evidence**: full Pi dispatch suite 54/54 pass (44 prior + 10 new).

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] The visible directive block is dropped ONLY on a confirmed session's byte-identical, same-epoch repeat; every other path delivers full. Evidence: `decidePiDirectiveDelivery` guards + `directive-dedup.test.ts` first/repeat/dirty cases.
- [x] CHK-FIX-002 [P0] The full directive block is re-delivered after every lifecycle boundary and content change. Evidence: `session_start`/`session_compact` handler-wiring tests + dirty-content test.
- [x] CHK-FIX-003 [P0] The Pi dispatch directive is never suppressed. Evidence: assembly appends `PI_SUBAGENT_DISPATCH_DIRECTIVE` independently of `effectiveContext`; 54/54 dispatch suite green.
- [x] CHK-FIX-004 [P1] No cell in the 007 activation matrix was activated and no shared library changed. Evidence: scoped diff limited to `prompt-advisor.ts` + the new test; `policy-plan.ts`/`render.ts`/`activation-matrix.json` untouched.

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] Guardrail never silently dropped
  - **Evidence**: `npx vitest run pi/` 54/54; decidePiDirectiveDelivery confirmed-session + byte-match guards; assembly appends PI_SUBAGENT_DISPATCH_DIRECTIVE unconditionally.
- [x] CHK-031 [P1] No secrets, no new external surface
  - **Evidence**: prompt-advisor.ts adds no imports and no I/O; only process.env[PI_DIRECTIVE_DEDUP_FLAG] read; `git diff --stat` = 1 runtime file.

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized with implementation
  - **Evidence**: all reflect the shipped `decidePiDirectiveDelivery` + lifecycle resets.
- [x] CHK-041 [P1] Code self-documents the guardrail rationale
  - **Evidence**: `rg -n "Pi-local directive de-duplication" prompt-advisor.ts` — the block comment above PI_DIRECTIVE_DEDUP_FLAG documents the re-delivery conditions.

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files confined to scratchpad
  - **Evidence**: only `prompt-advisor.orig.ts` (tsc negative control) under the session scratchpad; no repo residue.
- [x] CHK-051 [P1] Scoped diff clean
  - **Evidence**: change limited to `prompt-advisor.ts`, the new test, and this packet.

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 8/8 |
| P1 Items | 6 | 6/6 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-08-09
**Verified By**: AI Assistant (Claude)

<!-- /ANCHOR:summary -->
