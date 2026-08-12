---
title: "Implementation Summary: Pi Directives-Only Fallback Dedup"
description: "The advisor-failure fallback brief (directives-only, no route head) now dedups to once per lifecycle boundary in Pi, so the operator-visible guardrail directives stop repeating on every headless-brief turn. Reverses a prior intentional fail-open; kill-switch restores it. Root-cause of the cli-pi advisor unavailability is a separate open thread."
status: "in-progress"
completion_pct: 60
trigger_phrases:
  - "pi directives-only fallback dedup summary"
  - "directives every message fix status"
  - "phase 019 implementation summary"
importance_tier: "high"
contextType: "implementation"
parent: "../spec.md"
_memory:
  continuity:
    packet_pointer: "hooks/002-injection-bloat-reduction/019-pi-directive-startup-compaction-only"
    last_updated_at: "2026-08-12T12:53:56Z"
    last_updated_by: "claude"
    recent_action: "Shipped Pi directives-only fallback dedup; test updated; vitest 10/10 pass"
    next_safe_action: "Root-cause why cli-pi advisor returns fallback every turn"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - ".opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts"
      - ".opencode/hooks/dispatch/pi/directive-dedup.test.ts"
    session_dedup:
      fingerprint: "sha256:d10f681225ab1eaad1c49893444adc680f707698868b018950781965fc2f9ede"
      session_id: "4654af88-ba88-466a-bd14-2fa43ea87923"
      parent_session_id: null
    completion_pct: 60
    open_questions:
      - "Why does cli-pi's advisor return the directives-only fallback on every turn?"
    answered_questions:
      - "Land the fallback-dedup mask now and root-cause in parallel (operator: Both)"
---
# Implementation Summary: Pi Directives-Only Fallback Dedup

<!-- SPECKIT_LEVEL: 2 -->

---

## 1. WHAT SHIPPED

Two surgical edits to `.opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts`:

1. `splitPiDirectiveBrief` now recognizes a **headless** `Directives:` block (the advisor-failure fallback). It normalizes that block to the same separator-prefixed form a head+directives brief produces, so an identical directive block maps to the same dedup key regardless of whether an `Advisor: …` head was present. Head is recorded as empty.
2. `decidePiDirectiveDelivery` drops its `!parts.head.trim()` guard — a directive block is now dedup-eligible whether or not a route head precedes it.

The lifecycle reset path (`session_start` / `session_compact` → `resetPiDirectiveDedupForSession`) is unchanged, so the fallback re-shows once after each boundary and suppresses on the intervening identical repeats.

## 2. BEFORE / AFTER (real module, `node --experimental-strip-types`)

Ran the actual exported `decidePiDirectiveDelivery` against `git show origin:…prompt-advisor.ts` (before) and the patched file (after):

| Case | Before | After | Want |
|---|---|---|---|
| Directives-only, turns 1/2/3 | `F,F,F` (shown every turn) | `F,T,T` | `F,T,T` |
| Head+directives, turns 1/2 | `F,T` | `F,T` | `F,T` (no regression) |
| Kill-switch `SPECKIT_PI_DIRECTIVE_DEDUP=0` | — | `F,F` | `F,F` (fail-open) |
| No directive block (plain route) | — | `F,F` | `F,F` (nothing to gate) |
| Boundary re-show (reset between turns) | — | `F,T,T` → reset → `F,T` | shows at startup + post-compaction only |

`F` = full delivery (directives shown); `T` = suppressed. The `F,F,F` → `F,T,T` transition on the directives-only row is the fix.

## 3. VALIDATION

- `npx vitest run hooks/dispatch/pi/directive-dedup.test.ts` → **10 passed (10)**, including the updated `dedups the advisor-failure fallback (directives-only) to once per boundary` case and the unchanged head+directives, kill-switch, and session-isolation cases.
- Test `directive-dedup.test.ts:81` was rewritten from `never suppresses the advisor-failure fallback` (the old fail-open assertion) to assert the new boundary-dedup behavior.

## 4. DESIGN CHANGE + TRADEOFF (accepted)

The directives-only fallback was **intentionally** always-shown — a fail-open so guardrails are guaranteed when the advisor is unavailable. This packet reverses that: the fallback now shows once per startup/compaction and suppresses between. When the advisor is unavailable for a long stretch with no boundary, the guardrail block is no longer re-injected every turn.

Mitigation: the durable framework (`CLAUDE.md`) remains the source of the guardrails; every compaction/resume re-arms full delivery; and `SPECKIT_PI_DIRECTIVE_DEDUP=0` restores the prior always-full behavior. The operator accepted this tradeoff ("mask now + root-cause").

## 5. ROOT-CAUSE (open thread)

The operator's cli-pi shows directives on **every** message because the advisor returns the directives-only fallback on every turn there. `renderAdvisorBrief` (`mcp-server/lib/render.ts`) always prepends an `Advisor: …` head when it produces a brief; a directives-only brief means it returned `null` and the caller fell back to `renderAdvisorFallbackDirective`. So the deeper question is **why cli-pi's advisor yields nothing usable every turn** (not wired in Pi / daemon unreachable / consistently below threshold). This mask stops the symptom; the root-cause is tracked as `next_safe_action` and investigated next.

## 6. DEFERRED FOLLOW-UPS

- Full cross-runtime boundary-gated redesign (`plan.md` §1-2) replacing the content-diff model.
- Headless `pi -p` durable-store backing so per-process turns dedup (`plan.md` §2).
- [SYS] runtime (Claude/Codex/Cursor/Devin/OpenCode) live verification.
- Feature-flag-all-hooks (`plan.md` §4) — separate packet.
