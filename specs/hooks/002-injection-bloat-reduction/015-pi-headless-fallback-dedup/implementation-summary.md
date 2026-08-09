---
title: "Implementation Summary: Pi-Headless Fallback Directive De-Duplication"
description: "Completed implementation summary for Pi directives-only fallback de-duplication and its verified fail-open guardrails."
status: "complete"
completion_pct: 100
trigger_phrases:
  - "pi headless fallback dedup implementation"
  - "pi headless fallback dedup summary"
importance_tier: "high"
contextType: "implementation"
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
      fingerprint: "sha256:6801075baca458d1ac11753d796c1150c4baa280c5cfadb37a5200f38db527f7"
      session_id: "2026-08-09-pi-headless-fallback-dedup"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: Pi-Headless Fallback Directive De-Duplication

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 015-pi-headless-fallback-dedup |
| **Status** | Complete |
| **Created** | 2026-08-09 |
| **Level** | 2 |
| **Completion** | 100% |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The Pi adapter recognized the headless `Directives:`-only brief by returning an empty head from `splitPiDirectiveBrief`. `decidePiDirectiveDelivery` accepted that empty head and returned `reducedContext: ""` for a confirmed same-epoch identical repeat.

The exported `assemblePiPromptText` treated the empty string as no advisor context, so the repeated visible prompt contained only the user text and `PI_SUBAGENT_DISPATCH_DIRECTIVE`. The input handler preserved the empty string through `decision.reducedContext ?? context`.

<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementation changed only `.opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts` and `.opencode/hooks/dispatch/pi/directive-dedup.test.ts`. The focused fallback expectation was changed from repeated full delivery to suppression of an identical confirmed repeat.

Unknown sessions remained fail-open, `SPECKIT_PI_DIRECTIVE_DEDUP=0` retained full delivery, lifecycle or dirty state caused full re-delivery, and the Pi dispatch directive remained unconditional.

<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Planned decision | Why |
|------------------|-----|
| Extend the Pi-local 013 mechanism | The research names headless fallback coverage as migration step 1; the change will stay inside the existing Pi adapter and will not activate the shadow central machine. |
| Represent a headless brief with an empty head and exact block | Byte identity will remain the suppression proof, while an empty head will allow the final prompt to remove the whole advisor block rather than retaining a nonexistent route line. |
| Treat `suppressed` independently from reduced-context truthiness | The headless reduced value will be empty, so the assembly must honor the decision flag or the intended reduction will silently fail. |
| Keep lifecycle, identity, content, and kill-switch guardrails | The phase will preserve full delivery whenever prior-turn history or session identity is uncertain, and `SPECKIT_PI_DIRECTIVE_DEDUP=0` will retain the old behavior. |
| Append the Pi dispatch directive independently | The dispatch directive will remain unconditional and will never be part of the suppressed advisor block. |

<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Pi suite | `cd .opencode/hooks/dispatch && npx vitest run pi/` passed 70 tests. |
| Headless repeat | `directive-dedup.test.ts` proved that an identical confirmed fallback repeat suppressed the `Directives:` block. |
| Final assembly | `assemblePiPromptText` preserved user text plus `PI_SUBAGENT_DISPATCH_DIRECTIVE` when `reducedContext` was `""`. |
| Scope | The implementation remained limited to `prompt-advisor.ts` and `directive-dedup.test.ts`. |

<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

The optimization remained limited to confirmed, byte-identical repeats in the current lifecycle epoch. Unknown identity, lifecycle or dirty state, the kill-switch, and changed directive content continued to trigger full delivery. The dispatch directive was never eligible for suppression.

<!-- /ANCHOR:limitations -->
