---
title: "Feature Specification: MiMo + MiniMax as selectable executors across the deep skills"
description: "Make MiMo-V2.5-Pro and MiniMax cleanly dispatchable as cli-opencode executors in deep-review, deep-research, deep-ai-council, the deep loop, and the deep-improvement benchmark by replacing the hard-coded --agent general with an optional-agent flag and documenting the model examples."
trigger_phrases:
  - "deep skills executor integration"
  - "mimo deep-review deep-research"
  - "opencode agent general fix"
  - "minimax deep loop executor"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/020-cli-opencode-mimo-pro-optimization/002-deep-skills-executor-integration"
    last_updated_at: "2026-06-01T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Phase-002 shipped; vitest 56/56; strict validate PASSED"
    next_safe_action: "Proceed to 003 research"
    blockers: []
    key_files:
      - ".opencode/commands/deep/assets/deep_start-review-loop_auto.yaml"
      - ".opencode/commands/deep/assets/deep_start-research-loop_auto.yaml"
      - ".opencode/skills/deep-improvement/scripts/model-benchmark/dispatch-model.cjs"
      - ".opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-126-002"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 2: deep-skills-executor-integration

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-01 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 (follows 001 provider integration) |
| **Predecessor** | 001-mimo-provider-integration |
| **Successor** | 003-mimo-efficiency-deep-research |
| **Handoff Criteria** | Deep loops dispatch `cli-opencode` without a hard-coded `--agent general`; MiMo + MiniMax documented as selectable executor models; deep-loop-runtime + deep-improvement vitest green |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

The deep skills reach external models through the `cli-opencode` executor kind, which already accepts any `provider/model` string (`EXECUTOR_KINDS` in `deep-loop-runtime/lib/deep-loop/executor-config.ts`; no per-model whitelist for cli-opencode). The one blocker is that the dispatch recipes hard-code `--agent general`:

- `deep_start-review-loop_auto.yaml` → `if_cli_opencode` (line ~893)
- `deep_start-research-loop_auto.yaml` → `if_cli_opencode` (line ~778)
- `deep-improvement/scripts/model-benchmark/dispatch-model.cjs` → cli-opencode arg builder (line ~193; agent defaults to `'general'` at line ~252)

On opencode 1.15.13, `--agent general` emits `! agent "general" is a subagent, not a primary agent. Falling back to default agent` for gateway models (and was observed to be rejected outright for the MiniMax token-plan provider in packet 120). The cli-opencode SKILL.md contract is explicit: **never pass `--agent general`; omit `--agent` and the default agent runs** (state any agent role in the prompt body). Aligning the deep recipes with that contract is exactly what unblocks MiMo + MiniMax as deep-loop executors.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
MiMo-V2.5-Pro and MiniMax cannot be cleanly used as deep-loop executors: every `cli-opencode` dispatch in the deep skills injects `--agent general`, which the current opencode rejects/falls-back-from, producing noisy warnings and (for token-plan providers) failed dispatches. The deep command docs also never list MiMo or MiniMax as selectable `cli-opencode` models, so an operator has no documented way to choose them.

### Purpose
Make MiMo + MiniMax first-class selectable executors across `deep-review`, `deep-research`, `deep-ai-council`, the deep loop, and the `deep-improvement` benchmark by (1) replacing the hard-coded `--agent general` with an optional-agent flag that omits `--agent` for the default/general case, and (2) documenting MiMo + MiniMax model examples in the command setup surfaces.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Replace the hard-coded `--agent general` in the two deep YAML `if_cli_opencode` branches with an `{optional_agent_flag}` render hint: expand to `--agent <name>` only when a non-`general` agent is explicitly configured, else empty.
- Patch `dispatch-model.cjs` so the cli-opencode arg builder omits `--agent` when the agent is `general`/unset; keep `--agent <name>` for explicit non-general agents. Update `remediation.vitest.ts` expectations.
- Confirm `deep_ask-ai-council_{auto,confirm}.yaml` cli-opencode round dispatch does not inject `--agent general` (patch if it does).
- Document MiMo (`xiaomi-token-plan-ams/mimo-v2.5-pro`) + MiniMax (`minimax-coding-plan/MiniMax-M2.7-highspeed`) as cli-opencode executor model examples in the deep command docs' PRE-BOUND SETUP ANSWERS blocks and executor option lists.
- Confirm `executor-config.ts` accepts these models (it does for cli-opencode); add a clarifying note only if needed.

### Out of Scope
- Adding a new `EXECUTOR_KIND` (e.g. `cli-mimo`) — MiMo/MiniMax route through the existing `cli-opencode` kind.
- Changing the default executor (`native`/Opus) of any deep loop.
- The `--dangerously-skip-permissions` / `--pure` flags on the opencode branch — unchanged; only the `--agent` handling changes.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml` | Modify | `if_cli_opencode`: optional-agent flag |
| `.opencode/commands/deep/assets/deep_start-research-loop_auto.yaml` | Modify | `if_cli_opencode`: optional-agent flag |
| `.opencode/skills/deep-improvement/scripts/model-benchmark/dispatch-model.cjs` | Modify | Omit `--agent` when general/unset |
| `.opencode/skills/deep-improvement/scripts/model-benchmark/tests/remediation.vitest.ts` | Modify | Update arg-builder expectations |
| `.opencode/commands/deep/assets/deep_ask-ai-council_auto.yaml` | Modify (if needed) | cli-opencode round dispatch agent handling |
| `.opencode/commands/deep/assets/deep_ask-ai-council_confirm.yaml` | Modify (if needed) | cli-opencode round dispatch agent handling |
| `.opencode/commands/deep/start-review-loop.md` | Modify | PRE-BOUND examples + executor model list |
| `.opencode/commands/deep/start-research-loop.md` | Modify | PRE-BOUND examples + executor model list |
| `.opencode/commands/deep/start-model-benchmark-loop.md` | Modify | PRE-BOUND examples (MiMo executor + model) |
| `.opencode/commands/deep/ask-ai-council.md` | Modify | cli model_set examples |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | No hard-coded `--agent general` in deep cli-opencode dispatch | `rg -n "agent general"` across `deep/assets/*.yaml` + `dispatch-model.cjs` returns no hard-coded dispatch arg; the optional-agent flag renders empty for the default case |
| REQ-002 | Optional non-general agent still supported | When an explicit non-`general` agent (e.g. `orchestrate`) is configured, the rendered command/args include `--agent <name>` |
| REQ-003 | Benchmark dispatcher omits `--agent` for general | `dispatch-model.cjs` cli-opencode args contain `--agent` only for non-general agents; `remediation.vitest.ts` updated + green |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | MiMo + MiniMax documented as selectable cli-opencode executor models | Deep command docs name `xiaomi-token-plan-ams/mimo-v2.5-pro` + `minimax-coding-plan/MiniMax-M2.7-highspeed` in PRE-BOUND blocks / executor lists |
| REQ-005 | Deep-loop runtime + benchmark tests pass | `vitest` in `deep-loop-runtime` + `deep-improvement/scripts/model-benchmark` exit 0 |
| REQ-006 | ai-council cli-opencode round dispatch aligned | Council auto/confirm recipes do not inject `--agent general` for the cli-opencode round |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `rg -n "agent general"` across the deep dispatch paths returns nothing (only an optional, gated flag remains).
- **SC-002**: A dry render of the cli-opencode branch with no agent set produces a command WITHOUT `--agent`; with `orchestrate` set, includes `--agent orchestrate`.
- **SC-003**: `vitest` green in `deep-loop-runtime` + `deep-improvement` model-benchmark.
- **SC-004**: Deep command docs list MiMo + MiniMax cli-opencode models.
- **SC-005**: `validate.sh --strict` on this folder passes (Exit 0).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Dropping `--agent general` changes behavior for existing opencode-go deep dispatches | Low — default agent already runs in that case (warn+fallback today) | Behavior-equivalent for gateway models; strictly removes a warning; vitest covers the arg builder |
| Risk | Test fixtures assert `agent: 'general'` | Med — tests break | Keep `resolved.agent` default; only the emitted args change; update assertions to the new arg shape |
| Dependency | 001 registry entry for MiMo | Low — docs reference the slug | 001 completes first |
| Risk | YAML render-hint contract drift | Low | Mirror the existing `{optional_variant_flag}` render-hint pattern already in the same branch |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Is `--agent general` rejected outright (not just warn+fallback) for the `xiaomi-token-plan-ams` provider, as it was for `minimax-coding-plan`? (Either way the fix — omit `--agent` — is the safe superset; confirm cheaply if a paid probe is warranted.)
- Does any deep loop intentionally rely on `--agent orchestrate` today? (Grep shows only `general`; the optional flag preserves the orchestrate path if ever needed.)
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-001 | Backward compatibility | Existing native / cli-codex / cli-gemini / cli-devin branches untouched |
| NFR-002 | No comment-hygiene violations | Code/YAML edits carry durable WHY only — no spec paths / phase ids / finding ids |
| NFR-003 | Deterministic render | The optional-agent flag follows the same render-hint mechanism as the optional-variant flag |
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- **Agent unset / null**: render empty `--agent` segment (default agent runs).
- **Agent = `general`**: treat as unset (omit `--agent`) — that is the documented contract.
- **Agent = `orchestrate`/`plan`/`ai-council`**: render `--agent <name>` (primary agents accepted at top level).
- **dispatch-model.cjs `TARGET.agent` default**: keep `'general'` in resolved config for record-keeping, but skip emitting the flag.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

Moderate. Small, surgical code/YAML edits across 3 dispatch paths plus doc updates, but the changes touch shared deep-loop runtime behavior, so they are test-gated (vitest) and must preserve the optional non-general agent path. The mechanism (render-hint optional flag) already exists for `--variant` in the same branches, so the pattern is proven.
<!-- /ANCHOR:complexity -->
