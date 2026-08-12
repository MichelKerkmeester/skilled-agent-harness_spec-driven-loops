---
title: "Feature Specification: Directive Delivery — Startup + Compaction Only (Pi directives-only gap fix)"
description: "Constant advisor directives are shown on every message (confirmed on cli-pi). Root-caused to the directives-only fallback brief bypassing Pi dedup, plus a headless per-process store gap. Plans a boundary-gated show-once redesign. Investigation + plan only; no runtime code changed."
status: "planned"
completion_pct: 0
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

Replace the content-diff, head-dependent dedup with a **boundary-gated "show once per startup/compaction"** rule, applied consistently across runtimes and detecting the directive block by its `Directives:` label (not by splitting off a head). Rationale: it directly encodes the operator's desired behavior, removes the directives-only gap, and is trivially auditable. Full design in `plan.md`.

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

**Planned.** Investigation complete and root cause proven; no runtime code changed in this packet. Awaiting operator go-ahead to implement.
