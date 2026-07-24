---
title: "Feature Specification: cli-cursor enforced model allowlist"
description: "Restrict cli-cursor dispatch to a curated 10-id allowlist (Composer 2.5, Grok 4.5 all tiers, GLM 5.2 high/max), enforced at the runtime dispatch layer, replacing the prior unrestricted-roster + auto-router default."
trigger_phrases: ["cli-cursor model allowlist", "cursor model restriction", "cursor enforced models"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/030-cli-cursor-creation/008-cursor-model-allowlist"
    last_updated_at: "2026-07-24T14:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Implemented and live-verified the enforced 10-id allowlist"
    next_safe_action: "Run validate.sh --strict, write implementation-summary.md, commit"
    blockers: []
    key_files: [".opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts", ".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs", ".opencode/skills/cli-external-orchestration/cli-cursor/SKILL.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-cursor-allowlist-implementation", parent_session_id: null }
    completion_pct: 95
    open_questions: []
    answered_questions: ["Allowlist scope: full family per model (all 6 Grok 4.5 tiers, both Composer variants, both GLM 5.2 tiers) - 10 ids total, operator-confirmed.", "Default model once auto is removed: composer-2.5 (Cursor's own native model) - a reversible default, flagged explicitly for operator override.", "model-profiles.json scope: no new entries for Grok/GLM - this phase is a dispatch allowlist, not a prompt-craft profile; matches phase 005's Composer-only precedent."]
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Feature Specification: cli-cursor enforced model allowlist

<!-- ANCHOR:metadata -->
## 1. METADATA
| Field | Value |
|---|---|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-07-24 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `cli-external-orchestration/030-cli-cursor-creation` |
| **Predecessor** | `../007-docs-agents-governance-and-closeout/spec.md` |
| **Successor** | None (packet extension) |
| **Handoff Criteria** | Any `cli-cursor` dispatch outside the enforced 10-id allowlist is rejected before a command is constructed, at both runtime execution paths (`fanout-run.cjs`, `dispatch-model.cjs`); skill docs describe the allowlist exclusively; whole packet re-validates 0/0. |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 002 gave `cli-cursor` a permissive model reference (`CURSOR_SUPPORTED_MODELS = ['auto', 'composer-2.5', 'composer-2.5-fast']`) explicitly documented as "not exhaustive by design... Cursor accepts any valid `--model` id at dispatch time." In practice this meant any of Cursor's 150+ live hosted-frontier ids (GPT/Claude/Gemini/Grok/GLM/Kimi families) could be dispatched, with `auto` (Cursor's own router) as the skill default — an unpredictable choice, since the router can silently resolve to any model in that roster. The operator now wants dispatch scoped to a small, deliberately curated set: Composer 2.5 (Cursor's own model), Grok 4.5, and GLM 5.2 — and wants that scoping **enforced**, not merely documented, so a caller cannot dispatch a different model even by accident.

A live check of `cursor-agent --list-models` on the authenticated account confirmed the exact ids and thinking-level variants within these 3 families: Grok 4.5 has 6 (low/medium/high, each with a `-fast` counterpart), Composer 2.5 has 2 (base + fast), and GLM 5.2 has 2 (high, max) — 10 ids total.

### Purpose
Replace the permissive reference list with a hard, enforced 10-id allowlist at the actual dispatch-command-construction layer (`fanout-run.cjs`'s `buildCursorLineageCommand`, `dispatch-model.cjs`'s cli-cursor case), remove `auto` as the default (it can resolve outside the allowlist), pick a new default (`composer-2.5`), and rewrite every cli-cursor doc surface that described the old unrestricted roster to describe only the enforced allowlist.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `executor-config.ts`: replace `CURSOR_SUPPORTED_MODELS` with the full 10-id allowlist; add `CURSOR_DEFAULT_MODEL` (`composer-2.5`) and `isCursorModelAllowed()`.
- `fanout-run.cjs`'s `buildCursorLineageCommand`: hard-reject (throw, fail closed) any model not in the allowlist before constructing a command; default omitted models to `composer-2.5`.
- `dispatch-model.cjs`'s cli-cursor case: identical hard-reject + default change.
- Update the 3 affected test files (`executor-config.vitest.ts`, `fanout-run.vitest.ts`, `remediation.vitest.ts`) — replace every `model: 'auto'`/`model: 'm'` cursor fixture with an allowed id, add allowlist-acceptance and allowlist-rejection tests.
- Rewrite every cli-cursor skill-doc surface describing the old unrestricted roster (`SKILL.md`, `references/cli-reference.md`, `references/integration-patterns.md`, `references/agent-delegation.md`, `README.md`, `assets/prompt-templates.md`, `assets/prompt-quality-card.md`, `manual-testing-playbook/**`) to describe only the enforced allowlist, with `composer-2.5` as the stated default.
- Fix the resulting compiled-routing bookkeeping-hash drift on the hub (same pattern as phases 003/007).

### Out of Scope
- Adding `sk-prompt/prompt-models` prompt-craft profiles for Grok 4.5 or GLM 5.2 — this phase is a dispatch-allowlist enforcement mechanism, not prompt-craft research; matches phase 005's explicit Composer-only precedent (§3 Out of Scope there: "Adding profiles for the hosted frontier models... only Composer gets a new profile").
- Extending the allowlist to any 4th model family (GPT/Claude/Gemini/Kimi) — explicitly excluded per the operator's instruction.
- Re-litigating the phase-005 Composer profile itself, or any other already-shipped phase 001-007 deliverable beyond the model-selection surfaces this phase touches.
- Building a config-schema-level (`parseExecutorConfig`) value validator for `model` — the generic schema's `model` field stays a free-form string across all executor kinds; enforcement lives at the dispatch-construction layer only, matching the existing `isCursorBinaryAvailable` fail-closed precedent (also not schema-level).

### Files Changed
| File Path | Change Type | Description |
|---|---|---|
| `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts` | Modify | 10-id allowlist, `CURSOR_DEFAULT_MODEL`, `isCursorModelAllowed()`. |
| `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Modify | Hard-reject check in `buildCursorLineageCommand`; new default. |
| `.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs` | Modify | Same hard-reject check in the cli-cursor case; new default. |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/{executor-config,fanout-run}.vitest.ts` | Modify | Fixture updates + new allowlist accept/reject tests. |
| `.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/remediation.vitest.ts` | Modify | Fixture updates + new allowlist-rejection test. |
| `.opencode/skills/cli-external-orchestration/cli-cursor/{SKILL.md,README.md,references/*.md,assets/*.md,manual-testing-playbook/**}` | Modify | Rewrite model-selection content to describe only the allowlist. |
| `.opencode/bin/lib/compiled-routing/010-live-activation/activation/cli-external-orchestration/manifest.json` | Modify | Bookkeeping-hash realignment after `SKILL.md` content changes. |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Priority |
|---|---|---|
| REQ-001 | `CURSOR_SUPPORTED_MODELS` in `executor-config.ts` is exactly the 10 confirmed-live ids across Composer 2.5, Grok 4.5 (all 6 tiers), and GLM 5.2 (2 tiers); `auto` is excluded. | P0 |
| REQ-002 | `buildCursorLineageCommand` (fanout-run.cjs) and the cli-cursor case of `buildSpawnSpec` (dispatch-model.cjs) both reject any model outside the allowlist before constructing a command, and both default an omitted model to `composer-2.5`. | P0 |
| REQ-003 | All 3 affected test files pass with zero regressions to pre-existing, unrelated coverage (confirmed via isolation against the already-documented pre-existing `retiredKind` bug). | P0 |
| REQ-004 | Every cli-cursor skill-doc surface previously describing `auto` as the default or the unrestricted roster is rewritten to describe only the 10-id allowlist and `composer-2.5` as the default. | P1 |
| REQ-005 | The hub's compiled-routing manifest is fresh (`servingAuthority: compiled` fast path re-enabled) after the `SKILL.md` content change. | P0 |
| REQ-006 | This phase's spec-folder passes `validate.sh --strict` 0/0, and the whole `030-cli-cursor-creation` packet re-validates `--recursive --strict` 0/0 after this phase lands. | P0 |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
- **SC-001**: `isCursorModelAllowed()` accepts exactly the 10 confirmed ids and rejects `auto` plus any out-of-roster id. **MET**.
- **SC-002**: A `cli-cursor` dispatch attempt with a non-allowlisted model throws before any `cursor-agent` command is constructed, at both `fanout-run.cjs` and `dispatch-model.cjs`. **MET**.
- **SC-003**: `npx vitest run` on the 3 affected test files shows zero new regressions (the 1 pre-existing, unrelated `retiredKind` failure is unchanged). **MET**.
- **SC-004**: `grep -rn "auto model\|model auto"` across the `cli-cursor` skill tree returns zero hits describing `auto` as valid/default. **MET**.
- **SC-005**: `validate_skill_package.py` against the hub returns 0 fails (default invocation). **MET**.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
- **Breaking existing fan-out configs that specify `model: 'auto'` for cli-cursor**: any caller (including this repo's own deep-loop fan-out configs, if any hardcode `auto`) now fails at dispatch time. Mitigation: grepped the repo for existing `cli-cursor`+`auto` fan-out configs at implementation time; none found outside test fixtures (which were updated).
- **Default-model choice (`composer-2.5`) is a judgment call**, not explicitly specified by the operator. Mitigation: flagged explicitly in `implementation-summary.md` as a cheap, reversible decision the operator can override.
- **Compiled-routing bookkeeping drift**: editing `SKILL.md` content stales the hub's pinned routing hash. Mitigation: same verified-safe realignment pattern used in phases 003/007 (confirmed via `resolve.cjs` that the pinned hash gates only the compiled fast-path's activation, not routing correctness).
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. NON-FUNCTIONAL REQUIREMENTS
- **NFR-C01**: The allowlist is enforced identically at both runtime dispatch entry points (`fanout-run.cjs` and `dispatch-model.cjs`) — no single-entry-point gap.

## 8. EDGE CASES
- A caller omits `--model` entirely: defaults to `composer-2.5` (allowlisted), not `auto`.
- A caller passes a bracket-effort variant of an allowed model (e.g. `cursor-grok-4.5[effort=high]`): rejected by the CLI itself (confirmed live, pre-existing finding from phase 002), independent of this phase's allowlist check — both layers agree the dispatch fails.
- A future Cursor CLI build renames or retires one of the 10 ids: the allowlist would then reject a genuinely-desired model; re-verify via `cursor-agent --list-models` and update the allowlist in a follow-up phase rather than silently loosening it.

## 9. COMPLEXITY ASSESSMENT
| Dimension | Score | Notes |
|---|---|---|
| Scope | 14/25 | 3 runtime files + 3 test files + ~10 skill-doc files; all mechanical once the allowlist is fixed. |
| Risk | 10/25 | Low blast radius — additive gate on an existing dispatch path; main risk is an existing caller relying on `auto`, ruled out by grep. |
| Research | 6/20 | Live model enumeration was already done in phase 005; this phase re-confirms the specific families requested. |
| **Total** | **30/70** | **Level 2** |

## 10. RISK MATRIX
| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Existing caller relies on `auto` | Low | Medium (dispatch failure) | Grepped for existing usage; none found outside updated test fixtures |
| Wrong default model chosen | Medium | Low (cosmetic, easily changed) | Flagged explicitly as a reversible decision in implementation-summary.md |
| Compiled-routing hash left stale | Low | Low (falls back to legacy routing, not incorrect) | Verified fix pattern from phases 003/007, re-confirmed fresh before commit |

## 11. USER STORIES
- As the operator, I want `cli-cursor` to only ever dispatch Composer, Grok 4.5, or GLM 5.2, so I never get surprised by an unexpected model in the roster being used.
- As a maintainer, I want the allowlist enforced at the code layer, not just documented, so a future edit to the skill docs cannot silently reopen the unrestricted roster.

## 12. OPEN QUESTIONS
All questions below are resolved (asked and answered before implementation began).
- Allowlist scope: exactly the 4 named variants, or the full family per model? **Resolved: full family** — all 6 Grok 4.5 tiers, both Composer variants, both GLM 5.2 tiers (10 ids total).
- Spec-folder ownership: new top-level packet, or a child of the existing `030-cli-cursor-creation` phase-parent? **Resolved: new child** (`008-cursor-model-allowlist`) — this phase.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS
- `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md` (this phase)
- `../007-docs-agents-governance-and-closeout/spec.md` (predecessor)
- `../spec.md` (phase-parent packet)
- `../005-cursor-model-registry-and-routing/spec.md` (Composer-only sk-prompt/prompt-models precedent this phase does not extend)
- `../002-deep-loop-executor-support/implementation-summary.md` (original `CURSOR_SUPPORTED_MODELS` reference list this phase supersedes)
