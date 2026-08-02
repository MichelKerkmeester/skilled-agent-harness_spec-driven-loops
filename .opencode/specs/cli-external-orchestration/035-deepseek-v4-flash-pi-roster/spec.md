---
title: "Feature Specification: DeepSeek V4 Flash in the cli-pi enforced roster"
description: "Add deepseek-v4-flash to the enforced cli-pi model allowlist so fanout dispatch accepts the model the cli-pi docs already advertise; verify cli-opencode; skip cli-cursor/cli-devin whose providers do not offer the model."
trigger_phrases:
  - "deepseek v4 flash"
  - "cli-pi deepseek flash"
  - "pi supported models allowlist flash"
  - "deepseek-v4-flash fanout"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/035-deepseek-v4-flash-pi-roster"
    last_updated_at: "2026-08-02T06:04:34Z"
    last_updated_by: "implementer"
    recent_action: "Authored spec for adding deepseek-v4-flash to the cli-pi enforced roster"
    next_safe_action: "Packet complete; optional follow-up: sk-prompt-models Flash profile"
    blockers: []
    key_files:
      - "system-deep-loop/runtime/lib/deep-loop/executor-config.ts"
      - "system-deep-loop/runtime/scripts/fanout-run.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-035-deepseek-v4-flash"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: DeepSeek V4 Flash in the cli-pi enforced roster

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
| **Created** | 2026-08-02 |
| **Branch** | `035-deepseek-v4-flash-pi-roster` |


<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The operator asked to add DeepSeek V4 Flash to four cli-external-orchestration modes: cli-cursor, cli-devin, cli-opencode, cli-pi. Live probing of the installed CLIs (2026-08-02) showed the request is only partly realizable, and one part is already done:

- **cli-opencode** — `deepseek/deepseek-v4-flash` is offered live (`opencode models deepseek`) and is **already documented** in `providers-and-models.md`. cli-opencode has no enforced code allowlist (multi-provider master). Nothing to add — verify only.
- **cli-pi** — `deepseek-v4-flash` is offered live (`~/.pi/agent/models-store.json`) and is **already listed** in `providers-and-models.md`, but it is **absent from the enforced allowlist** `PI_SUPPORTED_MODELS` / `PI_ALLOWED_MODELS`. A fanout cli-pi dispatch of `deepseek-v4-flash` is therefore rejected today ("not in the enforced allowlist"), contradicting the doc.
- **cli-cursor** — the Cursor provider offers **zero** DeepSeek models (`cursor-agent --list-models`). The model does not exist on this surface.
- **cli-devin** — Devin's DeepSeek family is **only** V4 Pro (`devin models list`: `deepseek-v4-pro`, uid `deepseek-v4`). No Flash exists on this surface.

### Purpose
Close the cli-pi doc↔enforcement divergence by adding `deepseek-v4-flash` to the enforced pi allowlist (TS source + its CJS mirror + the provider map), keeping the aligned tests and the PI-017 fixture honest, and verifying cli-opencode. Do **not** fabricate a nonexistent model id into the cli-cursor or cli-devin enforced allowlists.


<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add `deepseek-v4-flash` to `PI_SUPPORTED_MODELS` (TS source of truth).
- Add `deepseek-v4-flash` to the `PI_ALLOWED_MODELS` CJS mirror and map `deepseek-v4-flash → deepseek` in `PI_MODEL_PROVIDERS` (both in `fanout-run.cjs`).
- Update the aligned unit tests so they assert the eight-id roster and cover the new provider mapping.
- Update the PI-017 manual-testing fixture (roster count and enumeration).
- Verify cli-opencode already documents Flash correctly (no edit expected).

### Out of Scope
- **cli-cursor / cli-devin** — providers do not offer DeepSeek V4 Flash (operator decision: skip entirely). Adding a nonexistent id would violate the allowlist's "no id here was ever fabricated / read from live" contract.
- **sk-prompt-models prompt-craft profile for Flash** — a separate skill with its own governance; Flash inherits the `deepseek-v4-pro` profile. Noted as an optional follow-up.
- The cli-pi doc's "no enforced allowlist at this layer" framing — pre-existing wording, not this packet's concern.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts | Modify | Add `deepseek-v4-flash` to `PI_SUPPORTED_MODELS` |
| .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs | Modify | Add Flash to `PI_ALLOWED_MODELS` + `PI_MODEL_PROVIDERS` |
| .opencode/skills/system-deep-loop/runtime/tests/unit/executor-config.vitest.ts | Modify | Seven→eight; add Flash to the sorted expected roster |
| .opencode/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts | Modify | Add `deepseek-v4-flash → deepseek` to the provider-map coverage test |
| .opencode/skills/cli-external-orchestration/cli-pi/manual-testing-playbook/model-dispatch/supported-model-allowlist-smoke.md | Modify | Roster count seven→eight; enumerate Flash |


<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Flash is in the enforced pi allowlist | `isPiModelAllowed('deepseek-v4-flash')` is true; `PI_SUPPORTED_MODELS` contains it |
| REQ-002 | Fanout can build a pi Flash command | `buildLineageCommand({kind:'cli-pi', model:'deepseek-v4-flash'})` yields `--model deepseek/deepseek-v4-flash` and does not throw |
| REQ-003 | No fabricated ids on unsupported surfaces | cli-cursor and cli-devin allowlists unchanged; no `deepseek-v4-flash` added there |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | TS source and CJS mirror stay aligned | `PI_ALLOWED_MODELS` (cjs) equals `PI_SUPPORTED_MODELS` (ts); alignment test passes |
| REQ-005 | Tests and PI-017 fixture reflect eight ids | vitest suites pass; fixture says eight and enumerates Flash |
| REQ-006 | cli-opencode Flash documentation verified | `providers-and-models.md` lists `deepseek/deepseek-v4-flash`, confirmed live |


<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `pnpm/npm` vitest for executor-config, fanout-run, and combo-matrix pass with the eight-id pi roster.
- **SC-002**: A fanout cli-pi dispatch naming `deepseek-v4-flash` is no longer rejected by the allowlist gate.
- **SC-003**: cli-cursor and cli-devin remain unchanged; the report states plainly why Flash was not added there.


<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Change touches shipped deep-loop runtime | Broad blast radius | Purely additive (permits a previously-rejected model); reversible by removing entries |
| Risk | Doc/enforcement re-diverge later | Confusion | TS↔CJS alignment test guards drift; fixture updated |
| Dependency | Live model availability | Flash must exist on pi | Confirmed live in `models-store.json` (2026-08-02) |


<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: Change is additive only — no existing pi/opencode/cursor/devin dispatch path changes behavior.

### Maintainability
- **NFR-M01**: The eight-id roster is asserted in one aligned place (TS) and mirrored (CJS) with a guard test, so future drift fails fast.


<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- **Sorted-order insertion**: `deepseek-v4-flash` sorts before `deepseek-v4-pro`; the executor-config sorted-array assertion must place Flash first.
- **First-model representative check**: the combo-matrix representative-args check targets `PI_SUPPORTED_MODELS[0]` (still `deepseek-v4-pro`); Flash is inserted after Pro so that check is unaffected.

### Error Scenarios
- **Flash reasoning behavior**: Flash is latency-optimized; the fanout builder still forwards `--thinking` when a reasoningEffort is set. No evidence this errors on pi (models-store tags `thinkingFormat: deepseek`), so no special-casing is added.


<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- Should `deepseek-v4-flash` get its own sk-prompt-models prompt-craft profile? **RESOLVED: Deferred — out of scope; inherits the deepseek-v4-pro profile.**


<!-- /ANCHOR:questions -->
---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`

<!-- /ANCHOR:related-docs -->
