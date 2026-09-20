---
title: "Feature Specification: Ox Alpha for cli-pi & cli-opencode (OpenRouter route)"
description: "Register the Ox Alpha model in the cli-pi and cli-opencode rosters via the OpenRouter provider (openrouter/stealth/ox-alpha). The opencode-go/ox-alpha-free route was added first, then dropped per operator decision; the opencode zen provider has no ox model."
trigger_phrases:
  - "ox-alpha roster"
  - "openrouter stealth ox-alpha"
  - "cli-pi ox-alpha"
  - "cli-opencode ox-alpha"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/052-opencode-go-ox-alpha-free-roster"
    last_updated_at: "2026-08-22T11:20:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Reframed packet: dropped opencode-go route, added openrouter/stealth/ox-alpha"
    next_safe_action: "Commit when operator approves"
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
# Feature Specification: Ox Alpha for cli-pi & cli-opencode (OpenRouter route)

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

> **Folder-name note:** the slug still reads `opencode-go-ox-alpha-free-roster` from the packet's original framing. The delivered route is **OpenRouter**, not opencode-go — see Scope. The slug is kept as a stable identifier only.
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The **Ox Alpha** model needed to be dispatchable from cli-pi and cli-opencode. It first appeared in the operator's opencode picker under the OpenCode Go gateway as `opencode-go/ox-alpha-free`, so that route was added. The operator then decided to **drop the opencode-go route** and instead route Ox Alpha through **OpenRouter**. A live check confirmed the OpenCode zen provider (`opencode`) offers **no** ox model, so zen is not a viable route.

### Purpose
Register Ox Alpha via OpenRouter (`openrouter/stealth/ox-alpha`) in both CLIs: allowlist it in the two synced cli-pi enforcement points mapped to the `openrouter` provider, relax the cli-pi "OpenRouter = DeepSeek Flash only" policy to permit it, remove the earlier opencode-go/ox-alpha-free entries, and document the route in both skills.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `executor-config.ts` `PI_SUPPORTED_MODELS` — remove `ox-alpha-free`; add `stealth/ox-alpha` (OpenRouter literal keeps its upstream path).
- `fanout-run.cjs` `PI_ALLOWED_MODELS` (mirror) + `PI_MODEL_PROVIDERS` — same removal/addition; map `stealth/ox-alpha → openrouter`.
- Relax the "OpenRouter = DeepSeek Flash only" policy (comments in both files, blockquotes in both docs) to "Flash + Ox Alpha".
- cli-pi + cli-opencode `providers-and-models.md` — drop the opencode-go ox row; add the OpenRouter `stealth/ox-alpha` row.
- Guard tests (`executor-config.vitest.ts`, `fanout-run.vitest.ts`) — swap the roster/provider pins.

### Out of Scope
- The **opencode zen** (`opencode`) provider — it has no ox model (live `opencode models opencode` + two `Model not found` dispatch errors); nothing to add.
- Any other OpenRouter model — the allowlist stays limited to Flash + Ox Alpha.
- cli-cursor / cli-devin — their rosters do not carry Ox Alpha.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts` | Modify | `PI_SUPPORTED_MODELS`: −`ox-alpha-free`, +`stealth/ox-alpha`; relax OpenRouter policy comment |
| `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Modify | Mirror + provider map: −opencode-go ox, +`stealth/ox-alpha → openrouter` |
| `.opencode/skills/cli-external-orchestration/cli-pi/references/providers-and-models.md` | Modify | Drop opencode-go ox row; add OpenRouter ox row; relax blockquote |
| `.opencode/skills/cli-external-orchestration/cli-opencode/references/providers-and-models.md` | Modify | Drop opencode-go ox row; add OpenRouter ox row; relax blockquote |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/executor-config.vitest.ts` | Modify | Exact-roster assertion swap |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts` | Modify | `providerByModel` coverage swap |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `stealth/ox-alpha` accepted by the cli-pi fan-out roster | Present in `PI_SUPPORTED_MODELS` AND the `fanout-run.cjs` `PI_ALLOWED_MODELS` mirror (byte-synced; guard asserts equality) |
| REQ-002 | `stealth/ox-alpha` routes via `openrouter` | `PI_MODEL_PROVIDERS` maps `stealth/ox-alpha → openrouter`; builder emits `pi -p --offline --model openrouter/stealth/ox-alpha` |
| REQ-003 | opencode-go ox fully removed | No `ox-alpha-free` remains in either enforcement file or either roster doc |
| REQ-004 | Runtime stays green | `node --check fanout-run.cjs` passes; both guard vitest files pass |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Ox Alpha documented under OpenRouter in both skills | A row for `openrouter/stealth/ox-alpha` present in cli-pi and cli-opencode `providers-and-models.md`; blockquotes updated to "Flash + Ox Alpha" |
| REQ-006 | Route confirmed live on both CLIs | `opencode run` and `pi` dispatches of `openrouter/stealth/ox-alpha` each complete a real turn (returned `PONG`) |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A deep-loop cli-pi fan-out dispatch of `stealth/ox-alpha` is accepted and constructed as `openrouter/stealth/ox-alpha`.
- **SC-002**: The two enforcement points stay in sync; guard tests prove it; no opencode-go ox residue remains.
- **SC-003**: Operators find Ox Alpha under `### openrouter` in either skill's roster doc.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Relaxing the OpenRouter allowlist too far | Unintended models routed via OpenRouter | Allowlist stays exactly Flash + Ox Alpha; blockquotes and comments state the two-model limit |
| Risk | Mirror drift between `executor-config.ts` and `fanout-run.cjs` | Fan-out rejects an allowlisted model | Guard asserts both rosters equal |
| Risk | Missing provider-map entry | Builder throws at command construction | `PI_MODEL_PROVIDERS` gains `stealth/ox-alpha → openrouter` |
| Dependency | OpenRouter provider auth | Cannot dispatch | Confirmed live — real `PONG` turns on both CLIs 2026-08-22 |
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
- **OpenRouter 3-segment id**: the pi roster literal is `stealth/ox-alpha` (keeps the upstream path), so `${provider}/${model}` composes the three-segment `openrouter/stealth/ox-alpha` selector — the same shape as the DeepSeek Flash `-latest` entry.
- **Not a reasoning model**: Ox Alpha carries no thinking/variant pin, unlike the OpenRouter DeepSeek Flash entry.
- **Zen has no ox**: `opencode/ox-alpha-free` and `opencode/ox-alpha` both return `Model not found` — the zen provider is not a route.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- Which provider should carry Ox Alpha? **RESOLVED: OpenRouter (`openrouter/stealth/ox-alpha`), both CLIs. opencode-go dropped per operator; zen has no ox model.**
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Prior art**: `034-opencode-go-flash-qwen-roster`, `047-cli-pi-opencode-openrouter-roster`
<!-- /ANCHOR:related-docs -->
