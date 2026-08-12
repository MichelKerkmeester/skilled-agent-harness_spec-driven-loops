---
title: "Feature Specification: Directive Delivery — Startup + Compaction Only (Pi directives-only gap fix)"
description: "Constant advisor directives shown on every cli-pi message. Root-caused: the directives-only advisor-failure fallback was intentionally always-shown, so it repeats whenever the advisor is unavailable in Pi. Fix ships: the fallback now dedups to once per boundary (Pi). Root-cause of the advisor unavailability in cli-pi is a separate open thread."
status: "in-progress"
completion_pct: 0.6
trigger_phrases:
  - "directives every message"
  - "pi directive startup compaction only"
  - "directives-only fallback dedup gap"
  - "boundary-gated directive delivery"
importance_tier: "high"
contextType: "spec"
parent: "../spec.md"
predecessor: "018-fix-code-review-p0-p3-findings-for-directive-lifecycle-delivery"
successor: "None"
---
# Feature Specification: Directive Delivery — Startup + Compaction Only

<!-- SPECKIT_LEVEL: 2 -->

---

## EXECUTIVE SUMMARY

The three constant advisor directives (comment-hygiene, governor, proof-over-appearance) are rendered on **every** Pi message instead of only at startup and after compaction. The operator confirmed this on `cli-pi`. Investigation root-caused it to the directive-lifecycle dedup not covering the advisor's **directives-only fallback brief**, plus a per-process store gap for headless Pi. This packet specifies the problem and a boundary-gated redesign; it changes no runtime code (investigation + plan only, per operator direction).

**Desired behavior:** directives visible only at **session start** and **after compaction**, suppressed on all intermediate turns — ideally the same rule across every runtime, behind the existing feature flag.

---

## 1. PROBLEM

Operator report (cli-pi): the `Directives:` block appears on every prompt in the interactive Pi TUI. Only startup + post-compaction delivery is wanted.

### Directive source (confirmed)

The three directives are owned by `.opencode/skills/system-skill-advisor/mcp-server/lib/render.ts` (`HYGIENE_DIRECTIVE`, `GOVERNOR_DIRECTIVE`, `TERMINAL_PROOF_DIRECTIVE`), appended to the advisor brief, and delivered per-runtime by the user-prompt hooks. Contract: `.opencode/hooks/injection-contract.md`. The Pi `input` hook fires the operator-visible transform every turn.

---

## 2. ROOT CAUSE (proven)

### 2.1 Pi directives-only gap (primary, reproduced)

`decidePiDirectiveDelivery` (`hooks/pi/prompt-advisor.ts`) can only suppress a repeat when `splitPiDirectiveBrief` finds a **head** (an `Advisor: …` route line) before the `Directives:` label. The advisor has three brief shapes:

- `Advisor: … use <skill> …` + `Directives:` — has a head.
- `Advisor: … ambiguous …` + `Directives:` — has a head.
- **`renderAdvisorFallbackDirective` → `Directives:` only** — *no head*, emitted when no advisor brief is available (no route match / advisor unavailable / cold daemon).

When the brief is directives-only, `splitPiDirectiveBrief` returns `null`, so `decidePiDirectiveDelivery` **falls open to full delivery every turn**. Reproduction (`scratchpad/pi-dedup-test.cjs`):

- CASE A (head + directives, persistent store): turn 1 full → turn 2+ **suppressed** ✓
- CASE B (directives-only): **full every turn** ✗ ← the operator's symptom
- CASE C (head + directives, fresh store each turn): **full every turn** ✗

### 2.2 Pi headless per-process gap (secondary)

The dedup store is `compactShadowStore()` on `globalThis` (persists within one process). Interactive Pi keeps one process, so this is fine there. **Headless `pi -p`** spawns a fresh process per turn → the store is empty each turn → CASE C → full every turn.

### 2.3 [SYS] runtimes (needs live verification)

`decideDirectiveLifecycleDelivery` **is wired** in `hooks/claude/user-prompt-submit.ts` (durable file store, default-on via `isDirectiveLifecycleDedupEnabled`). It is shared by Claude/Codex/Cursor/Devin and mirrored by the OpenCode plugin. Earlier the route-only *activation* was retired (`5a7f00fd64`). This session shows directives on nearly every Claude turn, which suggests the [SYS] dedup may also not be suppressing live — to be confirmed per runtime (see plan §Testing). The `reducedContext` path still returns a brief that may retain the directive block; the durable store also depends on a runnable Python helper.

---

## 3. DECISION

Operator decision (2026-08-12): **mask now + root-cause**.

**Shipped (this packet):** extend the existing Pi dedup to cover the directives-only fallback. `splitPiDirectiveBrief` now recognizes a headless `Directives:` block and normalizes it to the same dedup key as a head+directives brief; `decidePiDirectiveDelivery` drops its head requirement. The fallback is therefore shown once and suppressed on identical repeats, re-armed by a lifecycle boundary (`session_start` / `session_compact`) exactly like the head+directives path.

**Design change + tradeoff (accepted):** this reverses the prior intentional fail-open where the advisor-failure fallback was *always* shown. When the advisor is unavailable for a long stretch with no boundary, the guardrail block is no longer re-injected every turn — it is shown once per startup/compaction. The durable framework remains the source of the guardrails and every compaction/resume re-shows them; the kill-switch `SPECKIT_PI_DIRECTIVE_DEDUP=0` restores always-full.

**Open (root-cause thread):** why does cli-pi hit the fallback on *every* turn? The available advisor path always emits an `Advisor: …` head, so a directives-only brief means `renderAdvisorBrief` returned null in Pi. Investigated separately (see implementation-summary §Root-cause).

The broader cross-runtime boundary-gated redesign (plan §1-2), headless durable store, and [SYS] live verification remain deferred follow-ups.

---

## 4. SCOPE

### In scope
- Redesign directive delivery to boundary-gated show-once (Pi + [SYS] + OpenCode), behind `SPECKIT_DIRECTIVE_LIFECYCLE_DEDUP` / `SPECKIT_PI_DIRECTIVE_DEDUP`.
- Cross-runtime behavioral verification (startup shows, repeats suppressed, post-compaction shows again; incl. directives-only and headless `pi -p`).

### Out of scope
- Feature-flagging all ~101 repo hooks — tracked as a separate follow-up packet (see plan §Follow-up).
- Any change to the directive *text* or the advisor routing.

---

## 5. STATUS

**In progress — Pi fallback-dedup shipped.** The directives-only fallback now dedups to once per boundary in Pi (`hooks/pi/prompt-advisor.ts`); the test was updated and the vitest suite passes 10/10. Remaining open: (1) root-cause why cli-pi's advisor returns the fallback every turn; (2) cross-runtime boundary-gated redesign + headless durable store + [SYS] live verification (deferred follow-ups). Kill-switch `SPECKIT_PI_DIRECTIVE_DEDUP=0` restores prior always-full behavior.
