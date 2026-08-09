---
title: "Spec: Pi-Headless Fallback Directive De-Duplication"
description: "Planned extension of the Pi-local directive de-duplication so the directives-only fallback is recorded and suppressed on confirmed same-session byte-identical repeats while all fail-open and lifecycle guardrails remain."
status: "complete"
completion_pct: 100
trigger_phrases:
  - "pi headless fallback dedup"
  - "pi directives-only fallback suppression"
  - "pi fallback directive repetition"
  - "Pi fallback repeat reduction"
importance_tier: "high"
contextType: "spec"
parent: "hooks/002-injection-bloat-reduction"
predecessor: "013-pi-local-directive-dedup"
_memory:
  continuity:
    packet_pointer: "hooks/002-injection-bloat-reduction/015-pi-headless-fallback-dedup"
    last_updated_at: "2026-08-09T14:52:48Z"
    last_updated_by: "sol"
    recent_action: "Reconciled headless Pi fallback de-duplication"
    next_safe_action: "None; packet complete"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts"
      - ".opencode/hooks/dispatch/pi/directive-dedup.test.ts"
    session_dedup:
      fingerprint: "sha256:27dbfa81175debe1a0178d5b88ef4391ae19d65f15272e1d1a0b4a5deb9b6e59"
      session_id: "2026-08-09-pi-headless-fallback-dedup"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Spec: Pi-Headless Fallback Directive De-Duplication

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Spec Folder** | 015-pi-headless-fallback-dedup |
| **Status** | Complete |
| **Created** | 2026-08-09 |
| **Level** | 2 |
| **Predecessor** | 013-pi-local-directive-dedup |
| **Successor** | None |
| **Priority** | P1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The Pi-local de-duplication from predecessor phase 013 handles a brief with a dynamic `Advisor:` route-line head followed by the shared `\nDirectives:` block. It does not handle the advisor's directives-only fallback. In `prompt-advisor.ts:199-205`, `splitPiDirectiveBrief` returns `null` when the separator has no head before it, and `decidePiDirectiveDelivery` therefore falls back to full delivery at `prompt-advisor.ts:224-250`.

The fallback begins with `Directives:` and has no route line to retain. The existing test deliberately records the old behavior at `.opencode/hooks/dispatch/pi/directive-dedup.test.ts:86-89`, so every identical fallback repeat currently re-appends the three directives before the independently appended Pi dispatch directive. The research measures that worst-case repeat at about 1,321 bytes and identifies extending 013 to the headless shape as migration step 1 (`research/research.md:58-60, 66-68`).

This phase made the fallback reducible without weakening the safety model. It recorded and compared the exact directive block even when the head was empty, suppressed the whole block only on a confirmed-session byte-identical repeat in the current lifecycle epoch, and left the Pi dispatch directive untouched.

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

In scope: the existing Pi adapter's `splitPiDirectiveBrief`, `decidePiDirectiveDelivery`, input-handler assembly, and lifecycle-reset behavior in `.opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts`. The planned split will recognize both the existing headed form and a brief beginning with `Directives:`; the latter will be represented with an empty head and its exact directive block. The planned decision will record the block on full delivery and suppress it on a confirmed, byte-identical, same-epoch repeat. For a headless repeat, the visible prompt will retain the user text plus the always-appended `PI_SUBAGENT_DISPATCH_DIRECTIVE`.

The focused suite at `.opencode/hooks/dispatch/pi/directive-dedup.test.ts` will be updated so the existing fallback test changes from “never suppresses” to “suppresses an identical confirmed repeat,” with assembly-level coverage that the fallback directives disappear while the dispatch directive remains. Tests will continue to cover unknown or unconfirmed sessions, the kill-switch, directive-text changes, session isolation, `session_start`, and `session_compact`.

Out of scope: the shared renderer, `policy-plan.ts`, the 007 activation matrix, the central 004 delivery-state machine, any non-Pi runtime, the Pi dispatch-directive compaction proposal, the advisor fallback producer, and the OpenCode bridge's separate directive mirror. This phase will not activate a central candidate or change the three directive texts.

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **REQ-001 [P1]** The splitter will recognize the existing headed brief and the headless form whose first bytes are `Directives:`; the headless form will produce an empty head and retain the directive block byte-for-byte.
- **REQ-002 [P0]** On a confirmed session's first full delivery in a lifecycle epoch, the complete directive block will be delivered and recorded. On a later byte-identical repeat in that epoch, a headed brief will retain its route-line head and a headless brief will suppress the entire directive block.
- **REQ-003 [P0]** A headless suppressed repeat will assemble as the user's text plus the always-appended `PI_SUBAGENT_DISPATCH_DIRECTIVE`; the dispatch directive will never be suppressed by this phase.
- **REQ-004 [P0]** Unknown, empty, or otherwise unconfirmed session identity, malformed or unrecognized brief shape, and any decision-path error will fail open to the full brief.
- **REQ-005 [P1]** `SPECKIT_PI_DIRECTIVE_DEDUP=0` and the existing false/off/no spellings will keep full delivery for both headed and headless briefs.
- **REQ-006 [P0]** `session_start` resume/fork boundaries, startup/new initialization, `session_compact`, and the existing global reset will clear the dedup record so the next brief is delivered in full.
- **REQ-007 [P0]** A byte change in the directive block will trigger full delivery and replace the stored block; only the next identical repeat of that new block will become suppressible.
- **REQ-008 [P1]** The focused test suite will replace the predecessor's deliberate fallback non-suppression assertion and will prove the headless decision and final input assembly without changing unrelated Pi behavior.

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001** Unit tests will prove that a headless fallback is full on its first confirmed delivery, suppressed on its identical same-epoch repeat, and full again after a directive-text change or lifecycle reset.
- **SC-002** Unit tests will prove that the old headed behavior remains unchanged: the route line stays visible on suppression, while the directive block is removed only for an exact confirmed repeat.
- **SC-003** Handler-level tests will prove that a suppressed headless repeat contains the user text and `PI_SUBAGENT_DISPATCH_DIRECTIVE`, contains no `Directives:` block, and does not accidentally depend on a truthy route-line head.
- **SC-004** Unknown/unconfirmed sessions, malformed shapes, kill-switch values, resume/fork, compact, and global reset paths will all remain full-delivery paths.
- **SC-005** The measured fallback repeat target will move from approximately 1,321 bytes to approximately 554 bytes for the advisor-plus-dispatch injection, with user text unchanged.
- **SC-006** The existing Pi dispatch suite and applicable type checks will pass after implementation, and the scoped diff will contain no changes to shared renderers, central policy state, activation data, or non-Pi runtimes.

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Accidental full delivery for an empty reduced context.** The current input assembly tests `decision.reducedContext` for truthiness at `prompt-advisor.ts:589-604`. The implementation will need to honor `suppressed: true` even when the reduced head is an empty string; an assembly test will guard the actual prompt shape.
- **Guardrail loss after history compression.** A headless repeat will contain no directive block, so it will rely on the full first-turn brief remaining in context. The existing `session_compact` reset will re-arm full delivery before the next turn, and any lifecycle or identity uncertainty will remain fail-open.
- **Brief-format drift.** The splitter will recognize only the existing headed separator and the exact `Directives:`-first form. Any other shape will remain full-delivery, preserving the predecessor's safe degradation behavior.
- **Directive-text drift.** Exact block comparison will make any content change full-delivery and will seed the new content for its own subsequent repeat; no normalized or partial comparison will be used.
- **State growth.** The planned record will reuse the bounded per-session map and eviction limit already used by the predecessor implementation; no new persistence or dependency will be introduced.

<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None open for planning. The implementation will still need to confirm the final assembled byte count at the handler boundary and verify that the dispatch directive remains present when the reduced context is empty.

<!-- /ANCHOR:questions -->
