---
title: "Implementation Plan: Pi model registry and routing"
description: "Plan for authoring Pi's sk-prompt/prompt-models registry contribution, extending check-prompt-quality-card-sync.sh's CI gate arrays, and finalizing a fail-closed PI_SUPPORTED_MODELS dispatch allowlist in this same phase rather than a later hardening pass."
trigger_phrases:
  - "cli-pi model registry plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/031-cli-pi-creation/009-pi-model-registry-and-routing"
    last_updated_at: "2026-07-27T11:26:00Z"
    last_updated_by: "claude-code"
    recent_action: "Implemented via LUNA (2 passes, operator-corrected roster), reviewed by GLM-5.2"
    next_safe_action: "Commit; phase 010 proceeds"
    blockers: []
    key_files: ["implementation-summary.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-pi-creation-authoring", parent_session_id: null }
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Pi model registry and routing

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
| **Language/Stack** | JSON (`model-profiles.json`) + Markdown (`references/models/*.md`, `_index.md`) + Bash (`check-prompt-quality-card-sync.sh`) + TypeScript (`executor-config.ts`) + Node/CJS (`fanout-run.cjs`, `dispatch-model.cjs`) |
| **Framework** | sk-prompt `prompt-models` registry + system-skill-advisor CI gate + system-deep-loop runtime dispatch layer |
| **Storage** | Flat-file JSON/Markdown/Bash/TS/CJS under `.opencode/skills/` (no database) |
| **Testing** | `check-prompt-quality-card-sync.sh` (4 static checks) + `npm run typecheck` + `npx vitest run` (3 test files) + `validate.sh --strict` |

### Overview
Resolve whether Pi has a native/default model or is purely provider-passthrough (a live `pi.dev/models` fetch, REQ-001), author the resulting `sk-prompt/prompt-models` contribution (Branch A profile or Branch B bookkeeping), extend `check-prompt-quality-card-sync.sh`'s 3 coverage points for `cli-pi`, and finalize a fail-closed `PI_SUPPORTED_MODELS`/`PI_DEFAULT_MODEL`/`isPiModelAllowed()` allowlist enforced at both `fanout-run.cjs` and `dispatch-model.cjs` - in this one phase, unlike Cursor's precedent which needed a separate later hardening phase (`008-cursor-model-allowlist`).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phase 001's live pi CLI contract facts available. [EVIDENCE: `001-pi-contract-pin/implementation-summary.md`, Complete]
- [x] Phase 002's `buildPiLineageCommand` scaffold exists. [EVIDENCE: `fanout-run.cjs`, confirmed pre-edit]
- [x] Phase 003 has registered `cli-pi` in the hub and shipped `cli-pi/assets/prompt-quality-card.md`. [EVIDENCE: `cli-external-orchestration/graph-metadata.json`, confirmed pre-edit]
- [x] Current `check-prompt-quality-card-sync.sh` state confirmed - confirmed this authoring session, 2026-07-27.
- [x] Current `executor-config.ts` / `fanout-run.cjs` / `dispatch-model.cjs` cli-cursor allowlist pattern confirmed as the structural template to mirror - confirmed this authoring session.

### Definition of Done
- [x] All 4 P0 requirements (REQ-001 through REQ-004) met with evidence. [EVIDENCE: `implementation-summary.md`]
- [x] `check-prompt-quality-card-sync.sh` exits 0. [EVIDENCE: independently re-run, GUARD PASS]
- [x] `tsc --noEmit` (no `typecheck` npm script exists) and `npx vitest run` on the 3 affected test files show 0 new regressions. [EVIDENCE: 169/169 + 30/31 (1 pre-existing unrelated failure), independently re-run]
- [x] `validate.sh --strict` Errors: 0 for this phase folder. [EVIDENCE: main-tree metadata round-trip, recorded in the commit]
- [x] `implementation-summary.md` written with evidence for every REQ in `spec.md`. [EVIDENCE: this phase's implementation-summary.md]
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Registry data restoration/extension (JSON + Markdown + Bash CI gate) plus a fail-closed dispatch-allowlist hardening (TypeScript + 2 Node/CJS dispatch-construction sites). No new runtime abstraction - every touched surface already has a proven shape from the cli-cursor precedent; this phase populates the Pi-specific instance of that shape.

### Key Components
- **`model-profiles.json` / `references/models/*.md` / `_index.md`**: the per-model prompt-craft registry. Gains either a new Pi model entry (Branch A) or `cli-pi` executor rows on already-adopted models (Branch B).
- **`check-prompt-quality-card-sync.sh`**: the CI drift guard. Gains a 4th `cli_cards`/`cli_skills` entry and a `CLI_EXECUTOR_HUB_METADATA` row so CHECK 1/2/4 resolve `cli-pi` correctly.
- **`executor-config.ts`**: gains `PI_SUPPORTED_MODELS` (hard allowlist), `PI_DEFAULT_MODEL` (never `"auto"`), `isPiModelAllowed()` - the canonical TypeScript source both `.cjs` consumers duplicate as plain-JS `Set` literals (matching the established cli-cursor pattern, not a shared dynamic import).
- **`fanout-run.cjs` / `dispatch-model.cjs`**: the two real dispatch-construction entry points. Each gains a fail-closed rejection check before any `pi` command is built.

### Data Flow
`model-profiles.json`'s `recommended_frameworks` presence gates whether CHECK 3/4 treat a model as "adopted" (Branch A only; Branch B's executor-row-only edits on already-adopted models already satisfy CHECK 3/4 by construction). Independently, `PI_SUPPORTED_MODELS` gates what `--model` value a `pi` dispatch may ever carry, checked at the moment a command is constructed - never inferred from the registry data, and never trusting an omitted model to fall through to an unenforced default.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|---------------|
| `model-profiles.json` | Registry data source | Modify (Branch A: add model; Branch B: add executor rows) | `python3 -c "json.load(...)"` parses; diff shows additive-only changes to any touched sibling row |
| `references/models/<id>.md` | Consumer model card | Create (Branch A only) | File exists; `model_id` frontmatter matches the registry id; 8-section shape matches `composer-2.5.md` |
| `references/models/_index.md` | Model index | Modify | New row (Branch A) or explicit bookkeeping-only note (Branch B) |
| `check-prompt-quality-card-sync.sh` (`cli_cards[]`/`cli_skills[]`) | CHECK 1/2 targets | Modify | Script recognizes `cli-pi`'s `prompt-quality-card.md` and `SKILL.md` |
| `check-prompt-quality-card-sync.sh` (`CLI_EXECUTOR_HUB_METADATA`) | CHECK 4 hub-identity resolver | Modify | CHECK 4 passes for every adopted model carrying a `cli-pi` row |
| `executor-config.ts` | Model reference/allowlist source | Harden to enforced allowlist + default + predicate | Typecheck + new unit tests |
| `fanout-run.cjs` | Orchestrated dispatch builder | Add fail-closed model check to `buildPiLineageCommand` | `fanout-run.vitest.ts` |
| `dispatch-model.cjs` | Model-benchmark dispatch builder | Add fail-closed model check to the cli-pi case | `remediation.vitest.ts` |
| `cli-external-orchestration/graph-metadata.json` (shared hub) | CHECK 4 ground truth | Not a consumer of THIS phase - already required to carry `cli-pi` trigger phrases by phase 003 | Re-verified read-only before this phase edits anything |

Required inventories:
- Same-class producers: `rg -n '"executor":\s*"cli-opencode"|"executor":\s*"cli-cursor"' sk-prompt/prompt-models/assets/model-profiles.json` - enumerates every model that might plausibly gain a `cli-pi` row under Branch B; only models Pi is LIVE-confirmed to dispatch are actually touched, not every enumerated candidate.
- Consumers of changed symbols: `rg -n 'cli-pi|CLI_EXECUTOR_HUB_METADATA|PI_SUPPORTED_MODELS|PI_DEFAULT_MODEL|isPiModelAllowed' .opencode/skills/system-skill-advisor/mcp-server/scripts/check-prompt-quality-card-sync.sh .opencode/skills/sk-prompt/prompt-models .opencode/skills/system-deep-loop` - confirms every reference is updated together.
- Matrix axes: {Branch A registry addition, Branch B executor-row bookkeeping} (mutually exclusive, resolved by REQ-001) x {3 CI-gate coverage points} x {2 runtime dispatch entry points} x {3 test files}.
- Algorithm invariant: every `--model` value `buildPiLineageCommand`/`buildSpawnSpec` could ever pass to the real `pi` binary must be a member of `PI_SUPPORTED_MODELS`; the invariant is checked by construction (throw before building args), not by post-hoc validation of the resulting command.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm the phase 001/002/003 predecessor states (pi CLI contract facts; `buildPiLineageCommand` scaffold exists; `cli-pi` registered in the hub with `cli-pi/assets/prompt-quality-card.md` shipped).
- [ ] Snapshot the current `model-profiles.json`, `check-prompt-quality-card-sync.sh`, and `executor-config.ts` for a pre-edit diff baseline.
- [ ] Live-fetch `https://pi.dev/models` (plus Providers/Custom Models/Custom Providers) and resolve Open Question 1 (Branch A vs Branch B) with cited evidence.

### Phase 2: Core Implementation
- [ ] Author the Branch A profile (+ `model-profiles.json` entry + `_index.md` row) OR the Branch B executor-row bookkeeping, per Phase 1's resolution.
- [ ] Add `cli-pi` to `check-prompt-quality-card-sync.sh`'s `cli_cards[]`, `cli_skills[]`, and `CLI_EXECUTOR_HUB_METADATA`; add a `FAMILY` entry if the chosen model id needs one.
- [ ] Finalize `executor-config.ts`'s `PI_SUPPORTED_MODELS`/`PI_DEFAULT_MODEL`/`isPiModelAllowed()` against the live-confirmed roster - no `"auto"`, no guessed id.
- [ ] Add the fail-closed allowlist check to `buildPiLineageCommand` (`fanout-run.cjs`) and the cli-pi case of `buildSpawnSpec` (`dispatch-model.cjs`), mirroring the cli-cursor pattern exactly.
- [ ] Update the 3 affected test files with allowlist accept/reject fixtures and tests for `cli-pi`.

### Phase 3: Verification
- [ ] Run `check-prompt-quality-card-sync.sh`; confirm `GUARD PASS` with `cli-pi` covered in all 4 checks.
- [ ] `npm run typecheck` on the runtime package; confirm 0 errors.
- [ ] `npx vitest run` on the 3 affected test files; confirm 0 new regressions.
- [ ] Grep every new/modified file for the phantom permission-mode wording bug ("auto, dangerous, or dangerous"); confirm 0 matches.
- [ ] Diff any touched sibling model's pre-existing executor rows against the Phase 1 baseline; confirm byte-identical (regression guard).
- [ ] `validate.sh --strict` on this phase folder; Errors: 0.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Static parse | `model-profiles.json` stays well-formed JSON | `python3 -c "json.load(...)"` |
| Static CI gate | 4-check drift guard, including the `CLI_EXECUTOR_HUB_METADATA` / `FAMILY` paths | `check-prompt-quality-card-sync.sh` |
| Type safety | `PI_SUPPORTED_MODELS`/`PI_DEFAULT_MODEL`/`isPiModelAllowed()` compile cleanly | `npm run typecheck` |
| Unit | Allowlist accept/reject at both dispatch entry points, omitted-model default behavior | `npx vitest run` on `executor-config.vitest.ts`, `fanout-run.vitest.ts`, `remediation.vitest.ts` |
| Regression diff | Any touched sibling model's pre-existing executor rows unchanged | `git diff` / manual field comparison against the Phase 1 baseline |
| Wording guard | Phantom permission-mode phrase absent from new prose | `rg -n` |
| Spec validation | Level 2 doc-set structural compliance | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 001 (pi-contract-pin) | Internal | Complete - Pi CLI 0.82.1 installed | Ground truth for the allowlist's dependency on a working `pi` binary being present. |
| Phase 002 (deep-loop-executor-support) | Internal | Complete | `EXECUTOR_KINDS`/`buildPiLineageCommand` scaffold existed and was hardened by this phase. |
| Phase 003 (cli-pi-skill-packet) | Internal | Complete | `cli-pi/assets/prompt-quality-card.md` and the hub's `cli-pi` trigger-phrase registration existed for CHECK 1/2/4 to check. |
| `https://pi.dev/models` (live fetch) | External | Fetched this session; superseded by stronger operator-supplied evidence | Resolved Branch B via a generic public fetch first, then confirmed the exact 7-model roster via the operator's own live-configured Pi model picker screenshot. |
| `check-prompt-quality-card-sync.sh`'s existing 4-check design | Internal | Green (confirmed live this session) | N/A - script is live and correct today for its current 3-executor scope. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: `check-prompt-quality-card-sync.sh` fails post-edit, `npx vitest run` shows a new regression, or a sibling model's existing executor row is found altered.
- **Procedure**: Revert the 9 touched files (registry data, CI gate script, `executor-config.ts`, `fanout-run.cjs`, `dispatch-model.cjs`, 3 test files) to their pre-phase-009 revision via `git checkout`. No runtime state or data migration is touched; the rollback is a pure file revert.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup: confirm predecessors + live-fetch pi.dev/models) ──► Phase 2 (Core: registry + CI gate + allowlist hardening) ──► Phase 3 (Verify: sync gate + typecheck + vitest + validate)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phases 001-003 (external to this folder) | Core |
| Core | Setup | Verify |
| Verify | Core | Phase 010 (manual-testing-playbook) |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low-Medium | 30-45 min (predecessor confirmation + live fetch) |
| Core Implementation | Medium | 2-4 hours (registry/CI-gate edits + allowlist hardening across 2 runtime files + 3 test files - denser than 030/005 alone since this phase folds in 030/008's later hardening) |
| Verification | Low | 45 min-1 hour |
| **Total** | | **3.5-6 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Pre-edit snapshot of `model-profiles.json`, `check-prompt-quality-card-sync.sh`, and `executor-config.ts` taken.
- [ ] No feature flag needed (additive registry data + an additive fail-closed gate on an existing, not-yet-live dispatch path).

### Rollback Procedure
1. Revert the 9 touched files via `git checkout`.
2. Re-run `check-prompt-quality-card-sync.sh` to confirm it returns to its current (pre-phase-009) 3-executor-array state.
3. Confirm no other file changed (`git status` clean outside the declared scope).

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A - flat-file revert only; no persisted runtime state depends on the Pi allowlist existing (cli-pi has no live dispatch history to preserve).
<!-- /ANCHOR:enhanced-rollback -->

---

## RELATED DOCUMENTS
- `spec.md`, `tasks.md`, `checklist.md`
- **Predecessor**: `../008-pi-hook-extension-layer/plan.md`
- **Successor**: `../010-pi-manual-testing-playbook/plan.md`
- `../../030-cli-cursor-creation/005-cursor-model-registry-and-routing/plan.md` (registry-authoring precedent)
- `../../030-cli-cursor-creation/008-cursor-model-allowlist/plan.md` (fail-closed hardening precedent this phase folds in early)
- `../../029-cli-devin-revival/005-devin-model-registry-and-quota/plan.md` (Planned-status structural precedent)
