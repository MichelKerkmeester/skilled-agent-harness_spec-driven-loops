---
title: "Implementation Plan: Pi deep-loop executor support"
description: "Plan for widening EXECUTOR_KINDS to 6 members and scaffolding a fail-closed buildPiLineageCommand fan-out adapter for cli-pi, whose command-construction body is explicitly gated on phase 001's live-confirmed Pi CLI contract rather than a flag guessed by analogy to a sibling CLI."
trigger_phrases:
  - "cli-pi executor support plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/031-cli-pi-creation/002-deep-loop-executor-support"
    last_updated_at: "2026-07-27T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Plan executed via LUNA (codex), re-verified, reviewed by GLM-5.2"
    next_safe_action: "Commit; phase 003 builds on the widened union"
    blockers: ["buildPiLineageCommand/dispatch-model.cjs cli-pi case stay stubbed - real syntax unconfirmed"]
    key_files: ["implementation-summary.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cli-pi-creation-authoring"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Pi deep-loop executor support

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (`executor-config.ts`, `executor-audit.ts`) + Node.js CommonJS (`fanout-run.cjs`, `dispatch-model.cjs`, `profile-validator.cjs`) |
| **Framework** | None — hand-rolled Zod schemas and plain object maps; no shared executor registry |
| **Storage** | None — the executor union and its dependent maps are in-memory constants, hand-synced across the 5 named files |
| **Testing** | Vitest (`executor-config.vitest.ts`, `executor-audit.vitest.ts`, `fanout-run.vitest.ts`, `remediation.vitest.ts`) |

### Overview
Widen the deep-loop runtime's typed executor union from the real, confirmed-live 5 members (`native`, `cli-codex`, `cli-claude-code`, `cli-opencode`, `cli-cursor` — `executor-config.ts` line 11) to 6 by appending `cli-pi`, across the 5 hand-synced files the parent packet names. Unlike the `cli-devin` (029) and `cli-cursor` (030) precedents, `cli-pi`'s own phase 001 has not executed yet, so this plan splits cleanly into work that is buildable now (union widening, matrix scaffolding with a confirmed-safe minimal flag set, binary-availability fail-closed preflight structure, dispatcher/validator parity, regression tests) and work that is explicitly gated on phase 001's live-confirmed non-interactive invocation contract (the adapter's actual command array, the model allowlist's real roster, any sandbox/permission mapping).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented (spec.md, grounded in the real current 5-member union, not a guess).
- [ ] Success criteria measurable (spec.md §5, each SC tied to a concrete check).
- [ ] Dependencies identified — phase 001's not-yet-executed status is named explicitly, not silently assumed complete.

### Definition of Done
- [ ] Every buildable-now REQ (union widening, matrix rows, preflight, dispatcher/validator parity, regression tests) implemented and tested.
- [ ] Every phase-001-gated REQ (command-construction body, model roster, sandbox mapping) is either implemented with a cited confirming source, or explicitly left as a documented, falsifiable gap in `implementation-summary.md` — never silently guessed.
- [ ] Tests passing: the 4 named Vitest files, zero regressions in existing kinds' assertions.
- [ ] Docs updated (spec/plan/tasks/checklist all reflect the same completion state).
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Hand-synced typed-union widening across 5 independent files (no shared registry) — the same pattern `cli-devin` (029) and `cli-cursor` (030) already used to add their kinds.

### Key Components
- **`executor-config.ts`**: accepted-kind and flag-support schema authority (`EXECUTOR_KINDS`, `EXECUTOR_KIND_FLAG_SUPPORT`, `EXECUTOR_WEB_SEARCH_CAPABILITY_MATRIX`), now widened to 6 members. Also gains the scaffolded `PiSupportedModel`/`PI_SUPPORTED_MODELS`/`isPiModelAllowed()` triple, mirroring `CursorSupportedModel`/`CURSOR_SUPPORTED_MODELS`/`isCursorModelAllowed()` (lines 136-156) in shape, deliberately empty/placeholder in content.
- **`executor-audit.ts`**: provenance and recursion-guard metadata (binary/session/state/home-dir/env-prefix maps). Gains a `cli-pi` row in the 3 maps that don't depend on live confirmation (`EXECUTOR_BINARY_BY_KIND`, `EXECUTOR_STATE_ENV_BY_KIND`, `EXECUTOR_DEFAULT_HOME_DIR_BY_KIND`); the 2 that do (`EXECUTOR_SESSION_ENV_BY_KIND`, `EXECUTOR_ENV_PREFIXES_BY_KIND`) stay absent.
- **`fanout-run.cjs`**: process construction. A new `isPiBinaryAvailable()` (mirroring `isCodexBinaryAvailable`/`isCursorBinaryAvailable`, lines 1704-1721) plus a scaffolded `buildPiLineageCommand` join `LINEAGE_COMMAND_ADAPTERS` (lines 1683-1689) — the preflight and error-shape are buildable now; the actual `args` array construction is gated on phase 001.
- **`dispatch-model.cjs`** (model-benchmark scoped dispatcher, already missing `native`/`cli-codex` from its own `KNOWN_EXECUTORS`, lines 156-160) and its sibling **`profile-validator.cjs`** (already missing `cli-codex`, lines 34-39): each gains a `cli-pi` entry in their independently hand-maintained `KNOWN_EXECUTORS` sets — parity for the new kind only, same discipline both precedent phases already documented for the pre-existing gap.

### Data Flow
A fan-out lineage config with `kind: 'cli-pi'` is validated by `parseExecutorConfig` (against the widened `EXECUTOR_KIND_FLAG_SUPPORT['cli-pi']` row) → `buildLineageCommand` dispatches to `LINEAGE_COMMAND_ADAPTERS['cli-pi']` (`buildPiLineageCommand`) → the adapter's `isPiBinaryAvailable` preflight runs first (fail-closed) → command construction proceeds only once phase 001's syntax is known; until then this path is either a documented stub or a `throw`. The model-benchmark path mirrors this through `dispatch-model.cjs`'s `buildSpawnSpec` `case 'cli-pi'`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `executor-config.ts` | Typed-kind + flag-matrix authority (5 members today) | Add `cli-pi` (6th); scaffold `PiSupportedModel`/`PI_SUPPORTED_MODELS`/`isPiModelAllowed()` | `executor-config.vitest.ts`; strict typecheck |
| `executor-audit.ts` | Binary/session/state/home/env-prefix maps, recursion guard | Add `cli-pi` row to the 3 confirmable-now maps; leave 2 gated maps absent | `executor-audit.vitest.ts` |
| `fanout-run.cjs` | Fan-out process-command adapter | New `isPiBinaryAvailable()` + scaffolded `buildPiLineageCommand` + `SPECKIT_STATE_ENV_BY_KIND` row | `fanout-run.vitest.ts` (new absent-binary case) |
| `dispatch-model.cjs` | Model-benchmark scoped dispatcher | Add `cli-pi` to `KNOWN_EXECUTORS`; new `buildSpawnSpec` case (body gated same as fan-out adapter) | `remediation.vitest.ts` |
| `profile-validator.cjs` | Hand-synced mirror of the dispatcher's `KNOWN_EXECUTORS` | Add `cli-pi` in the same commit as `dispatch-model.cjs` | `remediation.vitest.ts` (or a direct import check) |

Required inventories:
- Same-class producers: `rg -n "EXECUTOR_KINDS|KNOWN_EXECUTORS|LINEAGE_COMMAND_ADAPTERS" .opencode/skills/system-deep-loop/` confirms all 5 hand-synced locations before editing (matches the file list already named in spec.md §3).
- Consumers of `ExecutorKind`: `rg -n "ExecutorKind" .opencode/skills/system-deep-loop/ --glob '*.ts' --glob '*.cjs'` to confirm no additional consumer outside the 5 named files silently assumes a fixed-cardinality union.
- Matrix axes: `kind` (6 values after this phase) × `EXECUTOR_KIND_FLAG_SUPPORT` field membership × `EXECUTOR_WEB_SEARCH_CAPABILITY_MATRIX` policy — every existing row for the other 5 kinds must remain byte-identical.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Re-read `../001-pi-contract-pin/implementation-summary.md` (once it exists) for the confirmed non-interactive invocation syntax, exit-code semantics, session-id env var, and model roster.
- [ ] Confirm (or explicitly mark UNKNOWN, needs live verification) whether Pi exposes any sandbox/permission-flag equivalent before touching `EXECUTOR_KIND_FLAG_SUPPORT['cli-pi']`'s `sandboxMode` membership.

### Phase 2: Core Implementation
- [ ] Widen `EXECUTOR_KINDS` to 6; add a `cli-pi` row to `EXECUTOR_KIND_FLAG_SUPPORT` (confirmed-safe fields only: `model`, `timeoutSeconds`, `liveTools`) and `EXECUTOR_WEB_SEARCH_CAPABILITY_MATRIX` (`inherit: true`, all else `false` unless phase 001 confirms otherwise).
- [ ] Scaffold `PiSupportedModel`, `PI_SUPPORTED_MODELS` (empty/placeholder), `isPiModelAllowed()` in `executor-config.ts`.
- [ ] Add `cli-pi` rows to `EXECUTOR_BINARY_BY_KIND`, `EXECUTOR_STATE_ENV_BY_KIND`, `EXECUTOR_DEFAULT_HOME_DIR_BY_KIND` in `executor-audit.ts`; leave `EXECUTOR_SESSION_ENV_BY_KIND`/`EXECUTOR_ENV_PREFIXES_BY_KIND` absent with a documenting comment.
- [ ] Add `cli-pi` to `SPECKIT_STATE_ENV_BY_KIND`; implement `isPiBinaryAvailable()`; scaffold `buildPiLineageCommand` (preflight + fail-closed structure now, command body gated on phase 001) in `fanout-run.cjs`; register it in `LINEAGE_COMMAND_ADAPTERS`.
- [ ] Add `cli-pi` to `dispatch-model.cjs`'s `KNOWN_EXECUTORS` and a new `buildSpawnSpec` case (same gating).
- [ ] Add `cli-pi` to `profile-validator.cjs`'s `KNOWN_EXECUTORS` in the same change.

### Phase 3: Verification
- [ ] Run the 4 focused Vitest files; confirm zero diffs in existing kinds' assertions.
- [ ] Add and pass a new `cli-pi` absent-binary fail-closed test in `fanout-run.vitest.ts`, mirroring the `cli-codex`/`cli-cursor` cases (lines 957, 1074).
- [ ] Add and pass a fail-closed `isPiModelAllowed()` test proving the empty/placeholder allowlist rejects every candidate model.
- [ ] Run strict typecheck on the two changed `.ts` modules.
- [ ] Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh 002-deep-loop-executor-support --strict`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `EXECUTOR_KINDS`/flag-matrix acceptance, audit-map rows, `isPiModelAllowed()` fail-closed behavior | Vitest (`executor-config.vitest.ts`, `executor-audit.vitest.ts`) |
| Integration | `buildLineageCommand`/`buildPiLineageCommand` absent-binary fail-closed path; `dispatch-model.cjs`/`profile-validator.cjs` `KNOWN_EXECUTORS` parity | Vitest (`fanout-run.vitest.ts`, `remediation.vitest.ts`) |
| Manual | A live `pi --version` + scoped-`PATH` smoke check, once phase 001 has installed `pi` | Terminal, optional, not a required gate for this phase |

Reuse the focused-Vitest-first strategy the `027-cli-codex-revival`, `029-cli-devin-revival`, and `030-cli-cursor-creation` precedents all used: run the 4 named test files directly before any wider suite. Mirror `fanout-run.vitest.ts`'s existing `cli-codex`/`cli-cursor` absent-binary cases (lines 957, 1074) 1:1 for `cli-pi`, including the "does not depend on exit code" framing from the `cli-cursor` case. Do not run a live billed `pi` dispatch as part of this phase's automated tests — `pi` is not installed in this environment and this phase is planning-only.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 001 (`001-pi-contract-pin`) | Internal | Planned (not yet executed) | `buildPiLineageCommand`'s command-construction body, the real model roster, and any sandbox mapping stay explicitly gated/stubbed; the structural/scaffolding work still ships independently. |
| `pi` binary availability in dev/CI `PATH` | External | Not installed in this environment (phase 001 owns install) | The fail-closed preflight (REQ-006) is exactly what protects callers when it's absent — this is not a blocker for shipping the preflight itself. |
| `https://pi.dev/models` live content | External (unfetched) | Yellow — cited as a real URL, content never fetched during this phase's research | `PI_SUPPORTED_MODELS` ships empty/placeholder; phase 009 owns fetching and populating it. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A later live-verification (phase 001, or a re-run of this phase once phase 001 lands) finds the scaffolded flag-support row, matrix defaults, or preflight shape materially wrong for Pi's real contract.
- **Procedure**: Revert only the `cli-pi` additions to the 5 named files and their 4 test files; the existing 5 kinds are untouched by this phase and need no rollback of their own. No data migration or persisted state is introduced — the audit maps' `Partial<Record<ExecutorKind, ...>>` typing means removing a kind's row degrades gracefully rather than breaking other kinds.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
001 (contract pin, Planned) ──► 002 (this phase: union widening + scaffolding,
                                       command body gated on 001) ──► 003 (skill packet)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| 001 (contract pin) | None | 002's command-construction body, model roster, sandbox mapping |
| 002 (this phase) | 001 (partially — see gating above) | 003 (runtime acceptance) |
| 003 (skill packet) | 002 | 004+ |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup (re-read phase 001, confirm gating status) | Low | Under 30 minutes once phase 001's `implementation-summary.md` exists |
| Core implementation (buildable-now portion) | Medium | One focused session across 5 production files, scoped to the confirmed-safe subset |
| Core implementation (phase-001-gated portion) | Unknown | Cannot be estimated honestly until phase 001's contract is known — may be Low (a simple flag substitution) or Medium-High (an RPC/event-stream protocol implementation) |
| Verification | Medium | Focused Vitest run + 2 new tests + strict typecheck + packet validation |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] No data changes in this phase — no backup required.
- [ ] Phase 001's confirmation status re-checked immediately before implementing the gated portion (REQ-005/REQ-008), not assumed stale-fresh from an earlier read.
- [ ] No feature flag needed — `cli-pi` is opt-in by construction (a lineage must explicitly declare `kind: 'cli-pi'`; no existing config is affected).

### Rollback Procedure
1. Revert the `cli-pi` additions in the 5 named files (git revert of this phase's commit(s)).
2. Confirm the widened `EXECUTOR_KINDS` union and its dependent maps return to exactly 5 members with no orphaned `cli-pi` reference.
3. Re-run the 4 focused Vitest files to confirm the 5 existing kinds are unaffected.
4. No stakeholder notification needed — `cli-pi` is not yet wired into any hub/skill-packet routing (phase 003+), so no external consumer depends on it after this phase alone.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A.
<!-- /ANCHOR:enhanced-rollback -->

---

## RELATED DOCUMENTS
- `spec.md`, `tasks.md`, `checklist.md`
- `../001-pi-contract-pin/` (not yet executed; this phase's command-construction body depends on its output)
- `../../029-cli-devin-revival/002-deep-loop-executor-support/plan.md`, `../../030-cli-cursor-creation/002-deep-loop-executor-support/plan.md` (structural precedent)

