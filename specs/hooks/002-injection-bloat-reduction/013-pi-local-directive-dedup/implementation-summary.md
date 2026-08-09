---
title: "Implementation Summary: Pi-Local Directive De-Duplication"
description: "Pi now drops the three constant advisor directives on a confirmed session's proven same-content repeat, keeping the route line and the dispatch directive; fail-open everywhere else."
status: "complete"
completion_pct: 100
trigger_phrases:
  - "pi directive dedup implementation"
  - "pi directive dedup summary"
importance_tier: "high"
contextType: "implementation"
parent: "hooks/002-injection-bloat-reduction"
_memory:
  continuity:
    packet_pointer: "hooks/002-injection-bloat-reduction/013-pi-local-directive-dedup"
    last_updated_at: "2026-08-09T07:30:34Z"
    last_updated_by: "claude"
    recent_action: "Shipped + proved the Pi-local directive dedup; 54/54 tests green"
    next_safe_action: "None; packet complete"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts"
      - ".opencode/hooks/dispatch/pi/directive-dedup.test.ts"
    session_dedup:
      fingerprint: "sha256:2962c88af1b9cde0e817817342bf0b4c6e152b226987dec7a952d4048b0c9157"
      session_id: "2026-08-09-pi-directive-dedup"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: Pi-Local Directive De-Duplication

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 013-pi-local-directive-dedup |
| **Status** | Complete |
| **Created** | 2026-08-09 |
| **Level** | 2 |
| **Completion** | 100% — implemented, 54/54 tests green, guardrail-preservation proven |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

One file changed in runtime (`prompt-advisor.ts`) plus one new test file. The Pi adapter no longer re-prints the three constant advisor directives onto every visible prompt.

1. **The decision.** `decidePiDirectiveDelivery(context, sessionId)` splits the brief on `\nDirectives:` into the dynamic route-line head and the constant directive block. It suppresses the directive block (returning just the head) only when the session id is confirmed, the directive block byte-matches the one already delivered this lifecycle epoch, and the kill-switch is off. A bounded `directiveDedupBySession` map in the adapter's existing store records the block on each full delivery.

2. **The wiring.** The input handler computes `effectiveContext` from the decision before assembling the visible prompt; the Pi dispatch directive is appended separately and always emitted. The `session_start` (resume/fork) and `session_compact` handlers, and the global reset, clear the session's dedup record so the full block is re-delivered after any lifecycle boundary.

<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Traced the operator's "I see this every prompt" to the Pi `[MSG]` transform: the advisor brief is appended to the visible prompt every turn, and the three directives within it are constant. Established through the 002 phase map that the central route-only machine is shadow-only, that Pi was excluded from candidate 004, and that the 007 gate hardcodes zero activation — so the operator chose a Pi-local reduction that touches none of that. Implemented a self-contained per-session dedup, then proved with a vitest suite that suppression happens only on a confirmed same-content repeat and that every lifecycle/dirty/unknown/fallback/kill-switch path re-delivers the full guardrail block.

<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Pi-local dedup, not activating the central 004 machine | The central route-only path is shadow-only, Pi is excluded from candidate 004, and the 007 gate hardcodes zero activated cells + `all-candidate-flags-off`. Activating it would rewrite the program's safety invariants and make Pi the first live cell on its highest-risk runtime. A Pi-local mechanism solves the visible pain without touching that gate or the shadow program. |
| Suppress only on a byte-identical, same-epoch, confirmed-session repeat | Anything less certain risks dropping a live guardrail. Content match handles directive edits; epoch reset handles history loss; confirmed-session handles identity ambiguity — each falls open to full. |
| Always append the Pi dispatch directive | It is Pi-critical (the named "Pi override/preload loss" risk); it is emitted independently of this logic and never suppressed. |
| Default on with a kill-switch | The operator's stated pain is the repetition itself; default-on resolves it without per-session config, and `SPECKIT_PI_DIRECTIVE_DEDUP=0` restores the old behavior. |
| Keep it single-file and reversible | Blast radius stays inside the Pi adapter; `git checkout` and the kill-switch both fully revert. |

<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Branch coverage | PASS — `directive-dedup.test.ts` 10/10: first-full, repeat-suppressed (route kept, block dropped), reset, dirty-content, unknown-session, fallback, kill-switch, isolation, and both lifecycle handlers re-arming. |
| No regression | PASS — full Pi dispatch suite 54/54 (44 prior + 10 new). |
| Type safety | PASS — off-config `tsc` delta versus the original is one benign `Cannot find name 'process'` on the new `isPiDirectiveDedupEnabled`, identical in kind to the pre-existing `isPiCompactDirectivePrototypeEnabled`; resolved under the real config (proven by the passing vitest run). |
| Guardrail preservation | PASS — suppression requires confirmed session + identical block + same epoch; every other path delivers full; dispatch directive always appended. |
| Scope | PASS — only `prompt-advisor.ts` + the new test changed; `policy-plan.ts`, `render.ts`, and the 007 matrix untouched; no cell activated. |

<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Long session without compaction.** On repeat turns the directives live only in the turn-1 prompt retained in history. A very long session that never compacts relies on that retention; a `session_compact` (the event that could summarise history away) re-delivers the full block. This is a weaker per-turn reinforcement than always-full, accepted deliberately to remove the visible repetition.
2. **Pi-only.** This reduces only Pi's visible repetition. The invisible `[SYS]` runtimes still receive the full brief every turn (by design); their reduction remains the central 002 program's shadow-parked concern and is untouched here.

<!-- /ANCHOR:limitations -->
