---
title: "Feature Specification: opencode-go Ox Alpha Free for cli-pi & cli-opencode"
description: "Register the opencode-go Ox Alpha Free (unlimited) model in the cli-pi fan-out roster and the cli-opencode roster docs: allowlist ox-alpha-free in the cli-pi enforcement points, map it to the opencode-go provider, and document both routes."
trigger_phrases:
  - "ox-alpha-free roster"
  - "opencode-go ox alpha"
  - "cli-pi ox-alpha-free"
  - "cli-opencode ox-alpha-free"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/052-opencode-go-ox-alpha-free-roster"
    last_updated_at: "2026-08-22T10:20:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored spec for opencode-go ox-alpha-free in cli-pi and cli-opencode"
    next_safe_action: "Packet complete pending operator review; end-to-end turn deferred by opencode-go monthly quota"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts"
      - ".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-052-opencode-go-ox-alpha-free"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: opencode-go Ox Alpha Free for cli-pi & cli-opencode

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-08-22 |
| **Branch** | `skilled/v4.0.0.0` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The OpenCode Go gateway now offers **Ox Alpha Free (unlimited)**, listed by `opencode models opencode-go` as `opencode-go/ox-alpha-free`. It was undocumented in both CLI roster references and absent from cli-pi's enforced deep-loop fan-out roster (`PI_SUPPORTED_MODELS` and its `fanout-run.cjs` mirror), so a fan-out dispatch of that model on cli-pi was rejected before command construction.

### Purpose
Register `ox-alpha-free` via the `opencode-go` provider so both CLIs can select it: allowlist it in the two synced cli-pi enforcement points, map it to `opencode-go` in the fan-out provider map, and document the route under each skill's `### opencode-go` section.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `executor-config.ts` `PI_SUPPORTED_MODELS` — add `ox-alpha-free`.
- `fanout-run.cjs` `PI_ALLOWED_MODELS` (mirror) — add `ox-alpha-free`; `PI_MODEL_PROVIDERS` — add `ox-alpha-free → opencode-go`.
- cli-pi + cli-opencode `providers-and-models.md` — add a row under the existing `### opencode-go` section.
- Guard tests (`executor-config.vitest.ts`, `fanout-run.vitest.ts`) — extend roster/provider expectations.

### Out of Scope
- cli-cursor / cli-devin — Ox Alpha Free is an opencode-go model, not offered by those providers' rosters.
- Re-pointing or changing any existing model's route.
- Forcing `ox-alpha-free` into pi's cached `models-store.json`. Pi's catalog is machine state; pi already dispatches the model via its custom-model-id fallback, and a catalog refresh (operator-side) clears the benign warning. Not a code change.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts` | Modify | Add `ox-alpha-free` to `PI_SUPPORTED_MODELS` |
| `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Modify | Add `ox-alpha-free` to the mirror + provider map (→ opencode-go) |
| `.opencode/skills/cli-external-orchestration/cli-pi/references/providers-and-models.md` | Modify | Add `ox-alpha-free` row to the `### opencode-go` table |
| `.opencode/skills/cli-external-orchestration/cli-opencode/references/providers-and-models.md` | Modify | Add `opencode-go/ox-alpha-free` row to the `### opencode-go` table |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/executor-config.vitest.ts` | Modify | Extend the exact-roster assertion |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts` | Modify | Extend the `providerByModel` coverage map |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `ox-alpha-free` accepted by the cli-pi fan-out roster | Present in `PI_SUPPORTED_MODELS` AND the `fanout-run.cjs` `PI_ALLOWED_MODELS` mirror (byte-synced; guard asserts equality) |
| REQ-002 | `ox-alpha-free` routes via `opencode-go` in the fan-out provider map | `PI_MODEL_PROVIDERS` maps `ox-alpha-free → opencode-go`; builder emits `pi -p --offline --model opencode-go/ox-alpha-free` |
| REQ-003 | Runtime stays green | `node --check fanout-run.cjs` passes; both guard vitest files pass |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | `ox-alpha-free` documented under `opencode-go` in both skills | A row for the model present in cli-pi and cli-opencode `providers-and-models.md` |
| REQ-005 | Model existence + routing confirmed live | `opencode models opencode-go` lists `opencode-go/ox-alpha-free`; a real dispatch on each CLI reaches the opencode-go gateway (routing confirmed) rather than being rejected as an unknown model |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A deep-loop cli-pi fan-out dispatch of `ox-alpha-free` is accepted and constructed as `opencode-go/ox-alpha-free`.
- **SC-002**: The two enforcement points (`executor-config.ts`, `fanout-run.cjs`) stay in sync; guard tests prove it.
- **SC-003**: Operators find the model under `### opencode-go` in either skill's roster doc.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Mirror drift between `executor-config.ts` and `fanout-run.cjs` | Fan-out rejects an allowlisted model | Guard asserts both rosters equal; add `ox-alpha-free` to both |
| Risk | Missing provider-map entry | Fan-out builds `pi` command with no provider prefix and throws | Add `ox-alpha-free → opencode-go` to `PI_MODEL_PROVIDERS` |
| Risk | pi store staleness | pi warns `Model "ox-alpha-free" not found for provider "opencode-go"` | Benign: pi's custom-model-id fallback still routes it; documented; a pi catalog refresh clears the warning |
| Dependency | opencode-go monthly free-tier quota | A full end-to-end turn could not complete (429 `GoUsageLimitError`, resets ~16 days) at implementation time | Account-level, transient; routing was confirmed independent of quota. Model existence confirmed via `opencode models` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Maintainability
- **NFR-M01**: `executor-config.ts` `PI_SUPPORTED_MODELS` and `fanout-run.cjs` `PI_ALLOWED_MODELS` MUST list identical ids (fail-closed sync invariant).
- **NFR-M02**: Every allowlisted pi model MUST carry a `PI_MODEL_PROVIDERS` entry.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Dispatch
- **pi store-miss warning**: a `pi --model opencode-go/ox-alpha-free` dispatch emits `Warning: Model "ox-alpha-free" not found for provider "opencode-go". Using custom model id.` — pi's cached catalog does not (yet) list the model, but it still routes the custom id to the gateway. Benign; not a failure.
- **opencode-go quota exhaustion**: while the monthly free-tier quota is spent, dispatch reaches the gateway and returns a `429 GoUsageLimitError` (routing confirmed) instead of producing a completion.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- Should `ox-alpha-free` be added to both cli-pi and cli-opencode rosters? **RESOLVED: Yes — operator directive (screenshot of the opencode-go picker entry).**
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Prior art**: `034-opencode-go-flash-qwen-roster`, `047-cli-pi-opencode-openrouter-roster`
<!-- /ANCHOR:related-docs -->
