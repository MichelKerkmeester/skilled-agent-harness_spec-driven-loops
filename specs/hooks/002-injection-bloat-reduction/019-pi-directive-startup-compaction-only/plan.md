---
title: "Implementation Plan: Boundary-Gated Directive Delivery"
description: "Plan for closing the Pi directives-only dedup gap. Shipped the minimal mask (fallback now dedups to once per boundary in Pi); the broader cross-runtime boundary-gated redesign and headless durable store remain deferred follow-ups."
status: "in-progress"
completion_pct: 0.6
trigger_phrases:
  - "boundary-gated directive delivery plan"
  - "pi directives-only fix plan"
importance_tier: "high"
contextType: "plan"
parent: "../spec.md"
predecessor: "018-fix-code-review-p0-p3-findings-for-directive-lifecycle-delivery"
successor: "None"
---
# Implementation Plan: Boundary-Gated Directive Delivery

<!-- SPECKIT_LEVEL: 2 -->

---

## 1. FIX DESIGN — "show once per boundary"

Track, per session, whether the directive block has been delivered since the last boundary. Reset the flag on `session_start` (startup) and `session_compact`. Deliver once after each boundary; suppress otherwise. Detect the directive block by the `Directives:` label so a **directives-only** brief is handled identically to a head+directives brief.

Pseudocode (per user-prompt turn):

```
if !dedupEnabled: deliver full            # kill-switch → always full (fail-open)
key = sessionKey(ctx); if !key: deliver full
if brief does not contain DIRECTIVES_LABEL: deliver full   # nothing to gate
if store.shownSince[key] == true:
    strip the directive block, keep any advisor head/route line   # suppress
else:
    store.shownSince[key] = true; deliver full                    # first-after-boundary
# any thrown error → deliver full (guardrail never silently dropped)

on session_start / session_compact:  store.shownSince[key] = false
```

Key differences from today:
- **No head requirement** — split on `DIRECTIVES_LABEL` and drop the block; if there is no head, suppressing yields an empty contribution (correct for Pi directives-only).
- **Boundary-driven, not content-diff** — removes false re-delivery on incidental brief changes.
- Keep fail-open on every uncertain path.

## 2. PER-RUNTIME APPLICATION

| Runtime | Hook | Change |
|---|---|---|
| Pi (interactive + headless) | `hooks/pi/prompt-advisor.ts` (`decidePiDirectiveDelivery`) | Gate on the boundary flag; handle directives-only. For headless `pi -p` persistence, back the flag with the durable store (not only `globalThis`), or accept per-process full delivery and document it. |
| Claude / Codex / Cursor / Devin | `hooks/claude/user-prompt-submit.ts` (`decideDirectiveLifecycleDelivery`) | Ensure the reduced context actually drops the directive block after the first post-boundary delivery; verify the durable store is healthy. |
| OpenCode | `plugins/mk-skill-advisor.js` mirror | Mirror the same boundary-gated rule. |

Store: reuse `directive-lifecycle-*` durable store for cross-process (headless) correctness; keep `globalThis` fast-path for interactive.

## 3. TESTING PLAN (the "test across runtimes" ask)

For **each** of Pi, Claude, Codex, Cursor, Devin, OpenCode, prove:
1. **Startup** turn → directives visible.
2. **Repeat** turns (2..N, same session) → directives suppressed.
3. **After compaction** → directives visible once, then suppressed again.
4. **Directives-only brief** (force no-route / advisor-unavailable) → still suppressed on repeats (the current bug).
5. **Kill-switch** (`SPECKIT_DIRECTIVE_LIFECYCLE_DEDUP=0` / `SPECKIT_PI_DIRECTIVE_DEDUP=0`) → always full.
6. Pi **headless** `pi -p` across turns → suppressed on repeats (needs durable-store backing).

Evidence: capture the injected `[SYS]`/transform per turn (Claude transcript JSONL; Pi transform output) and assert the directive block presence/absence.

## 4. FOLLOW-UP (separate packet)

Feature-flag all ~101 hooks (13 Pi + 40 OpenCode + 48 advisor/spec-kit runtime): a hook registry + per-hook env flag + master switch. Larger, repo-wide; not part of this fix.

## 5. STATUS

**Shipped (minimal mask):** `splitPiDirectiveBrief` + `decidePiDirectiveDelivery` in `hooks/pi/prompt-advisor.ts` now dedup the directives-only fallback to once per boundary. Test `directive-dedup.test.ts` updated; vitest 10/10 pass. Real-module before/after captured in `implementation-summary.md`.

**Deferred (follow-ups):** the full boundary-gated redesign in §1-2 (flag-tracked replacement of the content-diff model), the headless `pi -p` durable-store backing (§2 / §3 case 6), [SYS] live verification (§2), and the root-cause of why cli-pi's advisor returns the fallback every turn. The §4 feature-flag-all-hooks item remains a separate packet.

Reproduction harness: `pi-dedup-test.cjs` (CASE A/B/C).
