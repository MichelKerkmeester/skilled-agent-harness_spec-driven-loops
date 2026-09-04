---
title: "Feature Specification: GLM-5.3-Flash tops out at max on OpenRouter and opencode-go, not xhigh"
description: "A 2026-08-29 fix pinned every GLM-5.3-Flash route to thinking tier xhigh on the belief that xhigh was the model's top tier. It is not: on OpenRouter and opencode-go the ladder is low/high/max with no xhigh at all, so both fan-out routes were dispatching a tier their provider does not offer. The xhigh ceiling is real but Cline-only, and the Cline route never reaches this code."
trigger_phrases:
  - "glm-5.3-flash max not xhigh"
  - "glm thinking tier per route"
  - "fanout glm pin regression"
  - "isGlmFlashXhighPinnedModel"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/061-glm-5-3-flash-thinking-tier-per-route"
    last_updated_at: "2026-09-04T00:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Removed the xhigh pin; both guard suites green at 204/204"
    next_safe_action: "Commit; no follow-up required"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts"
      - ".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "fix-061-glm-thinking-tier"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: GLM-5.3-Flash tops out at max on OpenRouter and opencode-go, not xhigh

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-04 |
| **Branch** | `skilled/v4.0.0.0` |

> **Level basis.** `recommend-level.sh --loc 40 --files 5 --api` scored 21/100, Level 0. Taken to Level 1 deliberately: the change alters live dispatch behavior on a runtime contract shared by every pi fan-out lineage, and the scoring inputs do not see that. Where the script and judgment differ, the rule is to go higher.

> **Found, not planned.** This defect surfaced as a red baseline while preparing packet `060`. The baseline was captured before the first edit precisely so a pre-existing failure could not be mistaken for a new one — and it caught this.
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Commit `d47d73f8bb` (2026-08-29), *"fix(deep-loop): pin GLM-5.3-Flash to xhigh, its real top tier, not max"*, added `isGlmFlashXhighPinnedModel` to `executor-config.ts` and its mirror in `fanout-run.cjs`, forcing every model literal matching `glm-5.3-flash` to dispatch at `--thinking xhigh`.

The premise is wrong for both routes that reach that code. Live `opencode models <provider> --verbose` on 2026-09-04:

| Route | Variant ladder | Has `xhigh`? |
|-------|----------------|--------------|
| `openrouter/z-ai/glm-5.3-flash` | `low`, `high`, `max` | No |
| `opencode-go/glm-5.3-flash` | `low`, `high`, `max` | No |
| `llmgateway/glm-5.3-flash` | `none`→`minimal`→`low`→`medium`→`high`→`xhigh`→`max` | Yes |

So the runtime was sending a tier neither fan-out provider offers, while `max` — the real ceiling on both — was being actively suppressed. The commit inverted the situation it set out to fix.

The mechanism behind the mistake: **a top tier is a property of the route, not of the model name.** GLM-5.3-Flash genuinely does top out at `xhigh` on Cline, which is where the belief came from. But the Cline route is direct-dispatch under its own `.pi` tier map and never reaches the pin, so a name-matching predicate generalized a Cline-only fact across two routes it does not describe.

The regression shipped with a test that contradicted it. `fanout-run.vitest.ts:1541` asserts `max` and has been failing since 2026-08-29; `executor-config.vitest.ts:888-891` was updated to assert `xhigh`. Two suites in the same repo encoded opposite answers, and the red one was the correct one.

### Purpose
Restore `max` on the two routes that have it, keep `xhigh` where it is genuinely the ceiling, and make the surrounding docs and comments state the per-route rule so the same over-generalization is harder to repeat.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Delete `isGlmFlashXhighPinnedModel` and its call from `pinReasoningEffortForModel` in both `executor-config.ts` and the `fanout-run.cjs` mirror. GLM-5.3-Flash falls back to `isFlashMaxPinnedModel`, which already matches both literals and yields `max`.
- Correct the `executor-config.vitest.ts` assertions that encoded the bug, and drop the now-dead import.
- Correct the four catalog rows in cli-opencode and cli-pi that repeat "no `max` variant on any route".
- State the per-route rule in the code comments and both catalogs.

### Out of Scope
- **`fanout-run.vitest.ts`.** Deliberately untouched. It already asserted the correct answer, so leaving it alone makes it the negative control: it was red before the fix and green after, without being edited.
- **Adding provider-aware branching.** Unnecessary. Both literals reaching the pin are route-bound — the bare one is opencode-go's, the vendor-prefixed one is OpenRouter's — so removing the override *is* the per-route outcome. Cline's ceiling already lives in `.pi/models.json`'s `thinkingLevelMap`, which maps `max` to null and `xhigh` to `xhigh` and is correct as written.
- **The DevPass `llmgateway` GLM route.** It has both tiers and belongs to packet `060`, which is not yet implemented.
- **Reverting `d47d73f8bb` wholesale.** Its DeepSeek half is correct; only the GLM generalization is wrong.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts` | Modify | Remove the xhigh predicate and its call; comment states the per-route rule |
| `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Modify | Same removal in the mirror, comment kept in sync |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/executor-config.vitest.ts` | Modify | Four GLM assertions `xhigh` → `max`; dead import dropped; `glm-5.1` pass-through case added |
| `.opencode/skills/cli-external-orchestration/cli-opencode/references/providers-and-models.md` | Modify | Two rows corrected to the `low`/`high`/`max` ladder |
| `.opencode/skills/cli-external-orchestration/cli-pi/references/providers-and-models.md` | Modify | Two rows corrected likewise |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria | Status |
|----|-------------|---------------------|--------|
| REQ-001 | Both fan-out GLM routes dispatch at `max` | `pinReasoningEffortForModel` returns `max` for `glm-5.3-flash`, `z-ai/glm-5.3-flash` and `opencode-go/glm-5.3-flash` | Met |
| REQ-002 | The previously-red test passes without being edited | `fanout-run.vitest.ts` green; `git diff --stat` on it is empty | Met |
| REQ-003 | Both runtime files stay in sync | The mirror carries the same predicate set; `node --check` clean | Met |
| REQ-004 | The whole gate is green, measured as a delta | Baseline `203 passed / 1 failed` → after `204 passed / 0 failed`; `tsc` adds no error in a touched file | Met |
| REQ-005 | No surface still claims GLM has no `max` on any route | `rg` over both catalogs returns no such sentence outside changelogs | Met |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A pi fan-out lineage on GLM-5.3-Flash sends `--thinking max`, a tier both providers list.
- **SC-002**: The repo no longer contains two test suites asserting opposite answers to the same question.
- **SC-003**: Code comments and both catalogs state that the ceiling is per-route, naming Cline as the `xhigh` case, so the next reader does not re-generalize it.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Cline GLM regresses to `max`, which it lacks | A Cline dispatch would send an unavailable tier | Cline's ceiling is enforced by `.pi/models.json` `thinkingLevelMap` (`max` → null), untouched here; the Cline literal is not in the fan-out roster |
| Risk | The fix is a test edit that hides the bug | The failure would stop appearing without being fixed | The reverse holds: the red test was left untouched and went green on its own. The edited assertions were the ones encoding the bug |
| Risk | Behavior change reaches live lineages unannounced | Fan-out effort silently changes | Operator directed the change explicitly; it is a single revertible commit |
| Dependency | None | — | Docs, two constants and test fixtures only |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- **Was the old pin erroring or silently degrading?** **UNKNOWN.** No dispatch of `--thinking xhigh` against openrouter or opencode-go was attempted, so whether the provider rejected it or quietly ignored it is unverified. It does not change the fix — `max` is correct either way — but it does determine whether fan-out runs since 2026-08-29 were degraded, and that is worth knowing before trusting their output.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Implementation Summary**: See `implementation-summary.md`
- **Origin**: `060-devpass-roster-vision-gemini-3-8` — its pre-edit baseline exposed this
- **Superseded commit**: `d47d73f8bb` (2026-08-29), GLM half only
<!-- /ANCHOR:related-docs -->
