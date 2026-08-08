---
title: "Feature Specification: devin fan-out allowlist parity with the curated catalog"
description: "The deep-loop runtime's enforced cli-devin allowlist rejects the models the curated cli-devin catalog now features (Grok 4.5, SWE-1.7 Lightning, three GLM variants) and still defaults to the adaptive router the catalog dropped."
trigger_phrases:
  - "devin fanout allowlist parity"
  - "devin supported models runtime"
  - "grok via devin fan-out rejected"
  - "devin default model swe runtime"
  - "executor config devin allowlist"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/047-executor-wiring-and-parity/004-devin-fanout-allowlist-parity"
    last_updated_at: "2026-07-30T03:47:10.019Z"
    last_updated_by: "implementer"
    recent_action: "Author spec for the allowlist parity change"
    next_safe_action: "Implement via dispatched executor; update vitest pins; run unit tests"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-044"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: devin fan-out allowlist parity with the curated catalog

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-29 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | None |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | Runtime allowlist and default match the curated catalog; both vitest suites pass |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The cli-devin catalog was curated to four families (GLM-5.2, SWE-1.7, Grok 4.5, DeepSeek V4 Pro) with default `swe`, but the deep-loop runtime's enforced allowlist (`DEVIN_SUPPORTED_MODELS` in `executor-config.ts`) predates that curation. A fan-out naming `grok-4-5-high`, `swe-1-7-lightning`, or the GLM `-max-1m`/`-none`/`-none-1m` variants is hard-rejected even though the docs feature them and the live `devin models list` confirms them, and a dispatch omitting a model still gets the `adaptive` router the catalog dropped.

### Purpose
Make the runtime dispatch surface a superset of the curated catalog: every catalog-featured model id dispatches through `fanout-run.cjs`, and the omitted-model default matches the catalog's `swe`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add the seven catalog-featured ids missing from `DEVIN_SUPPORTED_MODELS`: `grok-4-5-low`, `grok-4-5-medium`, `grok-4-5-high`, `swe-1-7-lightning`, `glm-5-2-max-1m`, `glm-5-2-none`, `glm-5-2-none-1m` (all confirmed on live `devin models list`)
- Flip `DEVIN_DEFAULT_MODEL` from `adaptive` to `swe`
- Update the vitest pins: the allowlist expectation, the omitted-model-default test, and the unsupported-model rejection fixture that currently uses `grok-4-5-high`
- Run both affected unit suites

### Out of Scope
- Pruning the curated-out aliases (`adaptive`, `opus`, `sonnet`, `claude`, `haiku`, `gpt`, `gemini`, `codex`, `swe-1-6`) — kept for now so existing deep-loop configs cannot break; pruning needs a config sweep first (future packet)
- Any change to the PI or CURSOR allowlists — both already match their curated catalogs
- cli-devin skill docs — already aligned under packet 033 in the cli-external-orchestration track

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts` | Modify | Add 7 ids to `DEVIN_SUPPORTED_MODELS`; default → `swe` |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts` | Modify | Update allowlist pin, default-model test, rejection fixture |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/executor-config.vitest.ts` | Modify (if pinned) | Update any devin expectations found |
| `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Modify | The script carries a duplicated devin allowlist/default; align it with executor-config.ts |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All seven catalog-featured ids dispatchable | `isDevinModelAllowed()` accepts each; allowlist test asserts them |
| REQ-002 | Omitted-model default is `swe` | `DEVIN_DEFAULT_MODEL === 'swe'`; default-model test asserts `swe` |
| REQ-003 | Both unit suites pass | `fanout-run.vitest.ts` + `executor-config.vitest.ts` green |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Rejection test still proves enforcement | The unsupported-model fixture uses a genuinely off-list id (not `grok-4-5-high`) and still fails closed |
| REQ-005 | Additive-only for existing configs | No id removed from the allowlist; existing lanes naming `adaptive`/`opus`/etc. keep working |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Both vitest suites pass with the new pins (evidence: test run output)
- **SC-002**: Allowlist content equals the prior list plus exactly the seven new ids; default is `swe`
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Default flip changes behavior of model-less fan-outs | Med | Documented here; `swe` (SWE-1.7 Lightning) is the catalog default and free-tier adjacent; aliases stay available |
| Risk | Concurrent 043 lane edits the same file | Med | Verified clean before implementing; re-verify before commit |
| Dependency | Live `devin models list` id validity | Low | All seven ids read from the live roster this session |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None open. Prune-vs-keep for curated-out aliases decided: keep (additive-only), pruning deferred to a future packet gated on a config sweep.
<!-- /ANCHOR:questions -->
