---
title: "Implementation Plan: restore max as GLM-5.3-Flash's fan-out thinking tier"
description: "Remove the name-matching xhigh override so both route-bound GLM-5.3-Flash literals fall back to the existing max pin, correct the test assertions that encoded the bug, and leave the already-correct guard test untouched as the negative control."
trigger_phrases:
  - "glm thinking tier plan"
  - "remove xhigh override"
  - "implementation"
  - "plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/061-glm-5-3-flash-thinking-tier-per-route"
    last_updated_at: "2026-09-04T00:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Executed the removal; gate green"
    next_safe_action: "Commit"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "fix-061-glm-thinking-tier"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: restore max as GLM-5.3-Flash's fan-out thinking tier

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript + CommonJS mirror, Markdown catalogs |
| **Framework** | vitest |
| **Storage** | None |
| **Testing** | `npx vitest run` on both guard suites, `npm run typecheck`, `node --check` |

### Overview
The cheapest correct move on the reversal-cost ladder: **remove an addition**. `isFlashMaxPinnedModel` already matches both GLM-5.3-Flash literals and already returns `max`; the August override intercepted that result and replaced it with `xhigh`. Deleting the override and its call restores the correct behavior without adding a single branch.

Provider-aware branching was considered and rejected. It would fail the restraint test — there is no case it handles that removal does not, because both literals reaching this function are already route-bound and Cline's ceiling is enforced elsewhere.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Symptom reproduced: `fanout-run.vitest.ts:1541`, expected `max`, received `xhigh`
- [x] Producer located: `pinReasoningEffortForModel` short-circuits on `isGlmFlashXhighPinnedModel`
- [x] Live ladders captured for all three GLM routes
- [x] Every consumer of the removed symbol inventoried
- [x] Pre-edit baseline captured: `203 passed / 1 failed`

### Definition of Done
- [x] Both suites green; the untouched suite went green on its own
- [x] `node --check` clean; typecheck adds no error in a touched file
- [x] No catalog still claims GLM lacks `max` on any route
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
A pin chain: `pinReasoningEffortForModel` consults predicates in order and returns the first match. The August change put the GLM predicate ahead of the max pin, so it won for every GLM literal. Removing it restores a single-predicate chain.

The invariant worth stating: **the pin function receives a route-bound literal, not a bare model name.** `glm-5.3-flash` means opencode-go and `z-ai/glm-5.3-flash` means OpenRouter, resolved through `PI_MODEL_PROVIDERS`. A predicate that matches on the model name alone is therefore already making a routing claim, and that is exactly how a Cline-only fact escaped onto two other routes.

### Key Components
- **`pinReasoningEffortForModel`** — the chain, in both files.
- **`isFlashMaxPinnedModel`** — unchanged; already correct for both GLM literals.
- **`.pi/models.json` `thinkingLevelMap`** — where Cline's real `xhigh` ceiling lives, untouched.

### Data Flow
Fan-out resolves a literal → `PI_MODEL_PROVIDERS` gives the provider → `pinReasoningEffortForModel` yields `max` → the command builder emits `--thinking max`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

N/A beyond the verification tasks in `tasks.md`. The decisive check is the negative control: `fanout-run.vitest.ts` was red before the change and green after, with an empty diff. A fix that required editing that file would have been suspect.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

N/A — no new dependency. `executor-config.ts` is consumed as TypeScript with no compiled artifact, so nothing needs rebuilding.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a GLM-5.3-Flash dispatch rejects `max`, or a lineage regresses.
- **Procedure**: `git revert <this commit>`. Five files, no state, no migration. Reverting restores the `xhigh` pin and re-reds `fanout-run.vitest.ts`, which is the honest signal that the bug is back.
<!-- /ANCHOR:rollback -->
