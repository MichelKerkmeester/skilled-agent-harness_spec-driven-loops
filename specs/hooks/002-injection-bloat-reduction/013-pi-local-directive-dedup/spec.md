---
title: "Spec: Pi-Local Directive De-Duplication"
description: "Stop Pi from visibly re-appending the three constant advisor directives onto every prompt, by suppressing them on a confirmed session's proven same-content repeat within a lifecycle epoch, without touching the shadow program or the 007 activation gate."
status: "complete"
completion_pct: 100
trigger_phrases:
  - "pi directive dedup"
  - "pi visible directive repetition"
  - "pi local directive suppression"
  - "SPECKIT_PI_DIRECTIVE_DEDUP"
importance_tier: "high"
contextType: "spec"
parent: "hooks/002-injection-bloat-reduction"
_memory:
  continuity:
    packet_pointer: "hooks/002-injection-bloat-reduction/013-pi-local-directive-dedup"
    last_updated_at: "2026-08-09T07:30:34Z"
    last_updated_by: "claude"
    recent_action: "Shipped the Pi-adapter-local directive dedup with fail-open guardrails"
    next_safe_action: "None; packet complete"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts"
    session_dedup:
      fingerprint: "sha256:c3fb8a78faa0d42acb5578096887fea8f346b3c5855e70b08c17d2d4251cf432"
      session_id: "2026-08-09-pi-directive-dedup"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Spec: Pi-Local Directive De-Duplication

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Spec Folder** | 013-pi-local-directive-dedup |
| **Status** | Complete |
| **Created** | 2026-08-09 |
| **Level** | 2 |
| **Predecessor** | 006-pi-dispatch-and-compaction |
| **Successor** | None |
| **Priority** | P2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The Pi advisor adapter (`prompt-advisor.ts`) appends the advisor brief onto the user's **visible** prompt on every turn. The brief is a dynamic `Advisor: …` route line plus three **constant** directives (comment-hygiene, governor, proof-over-appearance). The route line changes per turn; the three directives never do. Pi is the only runtime that renders the brief on-screen (`[MSG]` via its `input` transform) — every other runtime injects the same text as invisible model-context (`[SYS]`). So a Pi operator sees the identical three directives re-printed on every single prompt.

The central 002 program already models this reduction (candidate 004's `UNSEEN → DELIVERED → SUPPRESSED_SAME` route-only machine), but it is **shadow-only in every runtime** (its route-only render path is computed, logged, and never emitted), Pi was **explicitly excluded** from candidate 004's applicability, and the phase-007 activation gate **hardcodes zero activated cells** and `activationState: 'all-candidate-flags-off'`. Activating the central machine for Pi would mean rewriting those safety invariants and making Pi the program's first-ever live cell on its highest-risk runtime.

The purpose here is narrower and self-contained: reduce the **visible** repetition in Pi alone, using a Pi-adapter-local mechanism that touches neither the central delivery-state machine, `render.ts`, nor the 007 activation matrix — and that never silently drops a guardrail.

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

In scope: a per-session directive-dedup inside `prompt-advisor.ts`. On a **confirmed** session's proven **same-content** repeat within the current lifecycle epoch, the visible brief keeps the dynamic `Advisor:` route line and drops the constant directive block; the Pi dispatch directive is appended separately and is always emitted. Full re-delivery on the first turn of an epoch, any directive-text change, `session_start` (resume/fork), `session_compact`, an unconfirmed session id, or when the kill-switch `SPECKIT_PI_DIRECTIVE_DEDUP=0` is set. A vitest suite proves each branch.

Out of scope: the central delivery-state machine (`policy-plan.ts`), `render.ts` and its shadow route-only path, the phase-007 `activation-matrix.json` and its zero-activation invariants, any runtime other than Pi, and byte reduction on the invisible `[SYS]` runtimes. This packet does not activate any 002 candidate and does not change what those runtimes emit.

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **REQ-001 [P1]** On a confirmed session's second-and-later turn within one lifecycle epoch, when the directive block content is byte-identical to the block already delivered this epoch, the visible brief drops the directive block and keeps the `Advisor:` route line.
- **REQ-002 [P0]** The three directives are re-delivered in full on: the first turn of an epoch; any change to the directive text; `session_start` with reason resume/fork; and `session_compact`. A guardrail is never suppressed across a lifecycle boundary where prior-turn history may be lost.
- **REQ-003 [P0]** Fail-open: an unconfirmed/empty session id, an advisor-failure fallback brief (directives-only, no route line to keep), or any thrown error yields the full brief.
- **REQ-004 [P0]** The Pi subagent dispatch directive is appended independently of this logic and is emitted on every turn, suppressed or not.
- **REQ-005 [P1]** A kill-switch `SPECKIT_PI_DIRECTIVE_DEDUP=0` (or false/off/no) reverts to always-full delivery; the feature is otherwise on by default.
- **REQ-006 [P1]** No change to `policy-plan.ts`, `render.ts`, the 007 activation matrix, or any non-Pi runtime; the central program stays shadow with zero activated cells.

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001** A vitest suite proves: first turn full; identical repeat suppressed (route line kept, directive block dropped); re-delivery after per-session reset, after directive-text change, for unknown session, for the directives-only fallback, and under the kill-switch; session isolation; and that the `session_start`/`session_compact` handlers re-arm full delivery.
- **SC-002** The existing Pi dispatch suite still passes unchanged, and the edited adapter introduces zero new type errors versus its prior revision.

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Guardrail retention across a long session.** On repeat turns the directives live only in the turn-1 prompt still in history; a very long session without a compaction relies on that history. Mitigated: Pi retains prior turns in context, and any `session_compact` (the event that summarises history) re-delivers the full block. The model therefore always holds the current-epoch directives.
- **Brief-format drift.** The split keys on the `\nDirectives:` separator (mirrors `render.ts` `DIRECTIVES_LABEL`). If the format ever changes past that separator, the split returns "not reducible" and the adapter delivers the full brief — a safe degradation, not a silent drop.
- **Dependencies.** None new. Reuses the adapter's existing session store, `receiptSessionKey`, and lifecycle handlers.

<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None open. Default-on with a kill-switch was chosen so the operator's stated visible-repetition pain is resolved without per-session configuration; anyone preferring the old behavior sets `SPECKIT_PI_DIRECTIVE_DEDUP=0`.

<!-- /ANCHOR:questions -->
