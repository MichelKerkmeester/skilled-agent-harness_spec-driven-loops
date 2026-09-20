---
title: "Feature Specification: DeepSeek V4 Flash pinned to the Max thinking tier"
description: "Pin DeepSeek V4 Flash to its max thinking tier across the external CLI fan-out: cli-pi and cli-opencode force deepseek-v4-flash to --thinking max / --variant max, cli-devin already uses the deepseek-v4-flash-max uid, and the catalogs are corrected (Flash is a reasoning model, not non-reasoning)."
trigger_phrases:
  - "deepseek v4 flash max thinking"
  - "pin deepseek flash to max effort"
  - "flash max only fan-out"
  - "cli-pi cli-opencode flash thinking pin"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/044-deepseek-v4-flash-max-only"
    last_updated_at: "2026-08-16T17:34:05Z"
    last_updated_by: "implementer"
    recent_action: "Authored spec for pinning DeepSeek Flash to the max thinking tier"
    next_safe_action: "Verify fan-out pins Flash to max; docs corrected"
    blockers: []
    key_files:
      - "system-deep-loop/runtime/lib/deep-loop/executor-config.ts"
      - "system-deep-loop/runtime/scripts/fanout-run.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-044-deepseek-flash-max-pin"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Flash Max = deepseek-v4-flash at max thinking (verified reasoning:true) -> pin effort, keep the model"
      - "Below-max Flash dispatch behavior -> force to max"
---
# Feature Specification: DeepSeek V4 Flash pinned to the Max thinking tier

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-08-16 |
| **Branch** | `skilled/v4.0.0.0` |


<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Operator policy: DeepSeek V4 Flash may be dispatched only at its **max thinking tier** — never at a lower effort (high/low/off) and never non-thinking. "Flash Max" is an **effort/thinking level**, not a distinct model id. Live inspection (2026-08-16) settles how it maps onto each surface:

- **DeepSeek V4 Flash is a reasoning model.** `~/.pi/agent/models-store.json` and `opencode models deepseek` / `opencode models opencode-go` all report `reasoning: true` with a `max` entry in the model's `thinkingLevelMap`. The earlier catalog text calling Flash "non-reasoning (`--variant` ignored)" was stale and wrong.
- **cli-pi / cli-opencode** reach the max tier through a flag: pi via `--thinking max`, opencode via `--variant max`. There is **no** separate `deepseek-v4-flash-max` model id on the DeepSeek direct API or the opencode-go gateway (both verified absent, count 0).
- **cli-devin** bakes the tier into the uid: its enforced roster carries only `deepseek-v4-flash-max` (no bare Flash), so it is already max-only.
- **cli-cursor** exposes no DeepSeek model; out of scope.

Today a fan-out lineage may dispatch `deepseek-v4-flash` at any effort (or none), which violates the policy.

### Purpose
Guarantee that every fan-out dispatch of DeepSeek V4 Flash runs at the max thinking tier by pinning the effort in the command builders (force-to-max), correct the catalogs that wrongly call Flash non-reasoning, and document the policy. Do not remove Flash, and do not fabricate a `deepseek-v4-flash-max` id onto the pi/opencode providers that do not offer one.


<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add `isFlashMaxPinnedModel` + `pinReasoningEffortForModel` to `executor-config.ts` (source of truth) and a synchronous mirror in `fanout-run.cjs`.
- Apply the pin in the cli-pi builder (`--thinking`) and the cli-opencode builder (`--variant`): when the model is `deepseek-v4-flash` (bare or provider-prefixed), force the effort to `max`, even when the lineage names none. The recorded `reasoningEffort` reflects the pinned value.
- Add helper unit tests and builder tests (pi + opencode) proving the force-to-max behavior and that non-Flash models are unaffected.
- Correct the cli-pi and cli-opencode catalogs (Flash is a reasoning model; add the max-thinking-pin policy note) and add the policy note to cli-devin.
- Add a changelog entry.

### Out of Scope
- Removing Flash from any roster — Flash stays; only its effort is pinned.
- Fabricating a `deepseek-v4-flash-max` id onto pi/opencode — that id does not exist on those providers (verified live).
- cli-cursor — no DeepSeek model.
- Raw `pi` / `opencode` binary invocations outside the fan-out — the pin lives in the fan-out command builders; a hand-typed dispatch is not gated.
- The pre-existing PI-017 roster-count discrepancy (unrelated to effort).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts | Modify | Add `isFlashMaxPinnedModel` + `pinReasoningEffortForModel` |
| .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs | Modify | Mirror helper; pin Flash effort in the pi (`--thinking`) and opencode (`--variant`) builders |
| .opencode/skills/system-deep-loop/runtime/tests/unit/executor-config.vitest.ts | Modify | Helper unit tests |
| .opencode/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts | Modify | Builder pin tests; update the provider-map assertion for Flash's `--thinking max` |
| .opencode/skills/cli-external-orchestration/cli-pi/references/providers-and-models.md | Modify | Correct Flash to reasoning; add the `--thinking max` pin note |
| .opencode/skills/cli-external-orchestration/cli-opencode/references/providers-and-models.md | Modify | Fix the "non-reasoning" claim; add the `--variant max` pin note |
| .opencode/skills/cli-external-orchestration/cli-devin/references/providers-and-models.md | Modify | Add the Max-thinking-only policy note |
| .opencode/skills/cli-external-orchestration/changelog/ | Add | New changelog entry |


<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Flash is pinned to max on cli-pi | A cli-pi Flash dispatch (any/no effort) yields `--thinking max`; `effectiveConfig.reasoningEffort === 'max'` |
| REQ-002 | Flash is pinned to max on cli-opencode | A cli-opencode `deepseek/deepseek-v4-flash` dispatch yields `--variant max` |
| REQ-003 | Non-Flash models are unaffected | `deepseek-v4-pro` at `high` still dispatches `--thinking high` / `--variant high` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The devin `-max` uid is not matched by the pin | `isFlashMaxPinnedModel('deepseek-v4-flash-max')` is false |
| REQ-005 | TS source and CJS mirror stay aligned | The mirror regex equals the source; suites pass |
| REQ-006 | Catalogs no longer call Flash non-reasoning | cli-pi + cli-opencode catalogs corrected; pin note present; cli-devin note present |


<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: vitest for executor-config, fanout-run (unit), and the cli-adapter stress fanout suite pass with the pin in place.
- **SC-002**: A cli-pi Flash dispatch requested at `high` is observed dispatching `--thinking max` (negative-of-the-old-behavior seen failing before the pin, passing after).
- **SC-003**: cli-cursor unchanged; the report states plainly that `deepseek-v4-flash-max` exists only on cli-devin and that pi/opencode reach the same tier by flag.


<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Change touches shipped deep-loop runtime | Broad blast radius | Small, additive pin; non-Flash paths unchanged; guarded by tests |
| Risk | Force silently upgrades a requested lower effort | A caller asking Flash at `high` gets `max` | Intended per operator decision; the recorded `reasoningEffort` reflects the pinned value for observability |
| Dependency | Flash exposes a `max` thinking level | Pin must map to a real level | Confirmed live: `thinkingLevelMap.max` present on deepseek + opencode-go |


<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: Only Flash dispatch effort changes; every non-Flash pi/opencode/cursor/devin path is unchanged.

### Maintainability
- **NFR-M01**: The pin predicate lives in one TS source of truth with a synchronous CJS mirror, matching the existing allowlist-mirror convention.


<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- **Provider-prefixed ids**: the predicate matches `deepseek-v4-flash` bare (cli-pi) and provider-prefixed (`deepseek/…`, `opencode-go/…`) via `(^|/)deepseek-v4-flash$`.
- **The devin `-max` uid**: `deepseek-v4-flash-max` ends past the anchor, so it is intentionally not matched (devin bakes the tier in and uses a different dispatch path).

### Error Scenarios
- **No effort requested**: a Flash lineage with no `reasoningEffort` still emits `--thinking max` / `--variant max` — "always max" holds even for the default path.


<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- Should raw (non-fan-out) `pi` / `opencode` dispatches also be pinned? **DEFERRED — the pin lives in the fan-out builders; raw binary invocations are out of scope.**


<!-- /ANCHOR:questions -->
---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Record**: See `decision-record.md`

<!-- /ANCHOR:related-docs -->
