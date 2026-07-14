---
title: "Implementation Plan: MiMo + MiniMax as selectable deep-skills executors"
description: "Remove the hard-coded --agent general from the cli-opencode dispatch paths of the deep skills (four deep YAMLs + the deep-improvement benchmark dispatcher) so MiMo-V2.5-Pro and MiniMax token-plan models dispatch cleanly through the existing cli-opencode executor kind, and document the model examples in the deep command setup surfaces."
trigger_phrases:
  - "deep skills executor integration plan"
  - "mimo minimax deep loop plan"
  - "opencode agent general removal plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/020-cli-opencode-mimo-pro-optimization/002-deep-skills-executor-integration"
    last_updated_at: "2026-06-01T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored phase-002 implementation plan"
    next_safe_action: "Execute edits: four deep YAMLs first, then dispatch-model.cjs + vitest, then docs"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/002-deep-skills-executor-integration"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 2: deep-skills-executor-integration

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | YAML dispatch recipes + CommonJS dispatcher + vitest + Markdown command docs |
| **Framework** | OpenCode deep skills (deep-review, deep-research, deep-ai-council, deep loop, deep-improvement benchmark) |
| **Storage** | `deep-loop-runtime/lib/deep-loop/executor-config.ts` (EXECUTOR_KINDS, no per-model whitelist for cli-opencode) |
| **Testing** | `vitest` (deep-improvement model-benchmark) + `node --check` + `rg` grep checks + spec-kit `validate.sh --strict` |

### Overview
The deep skills already reach external models through the `cli-opencode` executor kind, which accepts any `provider/model` string. The single blocker was a hard-coded `--agent general` on every cli-opencode dispatch: on opencode 1.15.13 `--agent general` warns ("agent general is a subagent, not a primary agent. Falling back to default agent") and falls back for gateway models, and token-plan providers reject it. The executor-config schema has no `agent` field, so the fix is to remove the hard-coded flag (the default agent is the correct one). Touches the four deep dispatch YAMLs, the benchmark dispatcher + its vitest, and four deep command docs. No new EXECUTOR_KIND.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] cli-opencode executor kind confirmed to accept any provider/model (no whitelist)

### Definition of Done
- [x] All acceptance criteria met (REQ-001..006)
- [x] `dispatch-model.cjs` passes `node --check`; model-benchmark vitest green
- [x] `validate.sh --strict` passes on this folder
- [x] checklist.md items verified with evidence
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Optional, gated agent flag. The deep dispatch recipes pass `--agent` to cli-opencode only when an explicit non-`general` primary agent is configured; otherwise the flag is omitted and the default agent runs. This mirrors the `{optional_variant_flag}` render-hint pattern already living in the same `if_cli_opencode` branches. MiMo + MiniMax route through the existing `cli-opencode` kind unchanged — no `cli-mimo` kind, no new whitelist.

### Key Components
- **Deep dispatch YAMLs** (4): the `if_cli_opencode` branch in `deep_start-review-loop_{auto,confirm}.yaml` and `deep_start-research-loop_{auto,confirm}.yaml` — the hard-coded `--agent general` token is removed; the surrounding block structure and the `{optional_variant_flag}` render hint stay intact.
- **Benchmark dispatcher** (`dispatch-model.cjs`): the cli-opencode arg builder changes from always pushing `--agent` to `if (agent && agent !== 'general') args.push('--agent', agent)` — omits `--agent` for the default/unset, keeps it for an explicit non-general primary agent. The resolved `TARGET.agent` default of `'general'` stays for record-keeping.
- **Benchmark vitest** (`remediation.vitest.ts`): a new `describe('cli-opencode --agent handling')` block asserts omit-for-general, omit-for-unset, include-for-explicit-orchestrate.
- **Deep command docs** (4): the cli-opencode invocation line + `executor_model` / `model` PRE-BOUND examples document MiMo (`xiaomi-token-plan-ams/mimo-v2.5-pro`) + MiniMax (`minimax-coding-plan/MiniMax-M2.7-highspeed`).

### Data Flow
An operator selects `cli-opencode` as the executor and sets a `provider/model` such as `xiaomi-token-plan-ams/mimo-v2.5-pro`. The deep recipe renders the cli-opencode dispatch with the `provider/model` string and no `--agent` segment (default case), so opencode runs the default primary agent against that gateway/token-plan model without the subagent warning or the token-plan rejection. If a non-general primary agent is ever explicitly configured, the render/arg builder includes `--agent <name>`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase changes shared deep-loop dispatch behavior consumed by review, research, council, and the benchmark, so the affected-surface inventory applies.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `deep/assets/deep_start-{review,research}-loop_{auto,confirm}.yaml` | Producer — render the cli-opencode dispatch command | update (remove hard-coded `--agent general`; keep block + variant render hint) | `rg -n "agent general"` across `deep/assets/*.yaml` is clean |
| `deep-improvement/.../dispatch-model.cjs` | Producer — build cli-opencode args for the Lane-B benchmark | update (omit `--agent` for general/unset; keep for explicit non-general) | `node --check` OK; vitest arg-builder block green |
| `deep-improvement/.../remediation.vitest.ts` | Consumer — asserts the arg builder shape | update (add `cli-opencode --agent handling` describe block) | full model-benchmark suite green (6 files, 56 tests) |
| `deep-loop-runtime/.../executor-config.ts` | Consumer — defines EXECUTOR_KINDS; cli-opencode accepts any provider/model | unchanged (no `agent` field in schema; no whitelist) | `rg -n "cli-opencode\|agent" executor-config.ts` confirms no agent field |
| `deep/{start-review-loop,start-research-loop,start-model-benchmark-loop,ask-ai-council}.md` | Docs — PRE-BOUND setup + executor model lists | update (document MiMo + MiniMax cli-opencode slugs) | `rg -n "mimo-v2.5-pro\|MiniMax-M2.7-highspeed"` shows the rows |

Required inventories:
- Same-class producers: `rg -n "if_cli_opencode" .opencode/commands/deep/assets/*.yaml`.
- cli-opencode dispatch consumers: `rg -n "cli-opencode" .opencode/skills/deep-loop-runtime --glob '*.ts'` + `dispatch-model.cjs`.
- Matrix axes: dispatch path (review-auto, review-confirm, research-auto, research-confirm, benchmark) × agent state (unset, `general`, explicit non-general) × executor kind (`cli-opencode`).
- Invariant: every edited YAML keeps its `if_cli_opencode` block structure + `{optional_variant_flag}` render hint; the arg builder emits `--agent` only for an explicit non-general agent.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm `cli-opencode` executor kind accepts any provider/model (no whitelist; no `agent` field in `executor-config.ts` schema)
- [x] Re-read the `if_cli_opencode` block + the existing `{optional_variant_flag}` render-hint pattern (the proven mechanism to mirror)

### Phase 2: Core Implementation
- [x] Remove the hard-coded `--agent general` from the `if_cli_opencode` dispatch branch in all four deep YAMLs (review auto/confirm, research auto/confirm); preserve the `{optional_variant_flag}` render hint + block structure
- [x] Patch `dispatch-model.cjs` cli-opencode arg builder to `if (agent && agent !== 'general') args.push('--agent', agent)`
- [x] Add `describe('cli-opencode --agent handling')` (3 tests) to `remediation.vitest.ts`
- [x] Document MiMo + MiniMax as cli-opencode executor models in `start-research-loop.md` + `start-review-loop.md` (invocation line + `executor_model` PRE-BOUND examples)
- [x] Add the same model examples to the PRE-BOUND `model` line in `start-model-benchmark-loop.md` + `ask-ai-council.md`
- [x] Verify the ai-council path: confirm it dispatches seats via an injected `dispatchSeat` and carries no hard-coded `--agent general`/`opencode run` (no edit if clean)

### Phase 3: Verification
- [x] `rg -n "agent general"` across `deep/assets/*.yaml` + `dispatch-model.cjs` is clean
- [x] `node --check dispatch-model.cjs` OK; full model-benchmark vitest green (6 files, 56 tests)
- [x] `validate.sh --strict` on this folder passes
- [x] Confirm native / cli-codex / cli-gemini / cli-claude-code / cli-devin branches untouched
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Grep | No hard-coded `--agent general` in deep cli-opencode dispatch; model examples present | `rg -n` |
| Syntax | `dispatch-model.cjs` parses | `node --check` |
| Unit | cli-opencode arg builder omits/includes `--agent` correctly | `vitest` (model-benchmark) |
| Spec gate | Folder docs structurally valid | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| cli-opencode executor kind accepts any provider/model | Internal | Green | None — confirmed, no whitelist for cli-opencode |
| 001 MiMo provider/registry entry | Internal | Green | Docs reference the slug; 001 completes first |
| `{optional_variant_flag}` render-hint pattern | Internal | Green | None — pattern already exists in the same branch |
| Live MiMo / MiniMax token-plan provider | External | Green | Configured on the user's machine; docs + arg-builder fix land regardless |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: model-benchmark vitest regresses, `node --check` fails, or strict validate regresses on the folder
- **Procedure**: `git checkout -- <touched files>` (all changes are edits to tracked YAML/JS/test/doc files; no migrations, no data)
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

- Phase 2 (edits) depends on Phase 1 (confirming cli-opencode accepts the models + re-reading the render-hint pattern).
- The vitest update (`remediation.vitest.ts`) lands with the `dispatch-model.cjs` change so the suite stays green.
- Phase 3 (verify) depends on all edits landing; `validate.sh --strict` depends on metadata generation (`description.json` + `graph-metadata.json`).
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Scope | Estimate |
|-------|-------|----------|
| Setup | Confirm executor-kind acceptance + re-read render-hint pattern | ~0.1 day |
| Implementation | 4 YAML edits + dispatcher + vitest block + 4 doc edits | ~0.3 day |
| Verification | rg + node --check + vitest + strict validate | ~0.1 day |

Small, surgical edits across the dispatch paths plus doc updates; one test-gated runtime behavior change.
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

- **Detection**: model-benchmark vitest failure, `node --check` failure on `dispatch-model.cjs`, strict-validate regression, or a cli-opencode dispatch that re-emits `--agent general`.
- **Immediate**: `git checkout -- <touched files>` (all edits are to tracked files; no data, no migrations).
- **Partial**: each surface is independently revertible — restore only `dispatch-model.cjs` + its vitest, or only a single deep YAML, or only the doc edits, without touching the others.
- **Forward-fix**: if a deep YAML still renders `--agent general`, re-check the `if_cli_opencode` block for a stray hard-coded token and confirm the `{optional_variant_flag}` render hint is the only flag mechanism left.
<!-- /ANCHOR:enhanced-rollback -->

---

<!--
CORE TEMPLATE (~90 lines) + L2 addendums
-->
