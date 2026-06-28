---
title: "Implementation Plan: Xiaomi Token Plan (Europe) provider + MiMo-V2.5-Pro integration"
description: "Wire the xiaomi-token-plan-ams provider and model mimo-v2.5-pro into cli-opencode docs, the shared small-model registry, and the sk-prompt-models sentinel, mirroring the MiniMax Token Plan wiring as an additive, explicitly-selectable model (no default change)."
trigger_phrases:
  - "mimo provider integration plan"
  - "xiaomi-token-plan-ams plan"
  - "mimo-v2.5-pro integration plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/126-cli-opencode-mimo-pro-optimization/001-mimo-provider-integration"
    last_updated_at: "2026-06-01T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored phase-001 plan"
    next_safe_action: "Execute edits: registry first, then cli-opencode docs, then sentinel + cards"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-126-001"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 1: mimo-provider-integration

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown skill docs + JSON registry/metadata |
| **Framework** | OpenCode skills (cli-opencode, sk-prompt, sk-prompt-models) |
| **Storage** | `sk-prompt/assets/model-profiles.json` (shared small-model registry) |
| **Testing** | `jq` JSON validation + `rg` grep checks + spec-kit `validate.sh --strict` |

### Overview
Register the Xiaomi Token Plan (Europe) provider (`xiaomi-token-plan-ams`) and its text/coding model `mimo-v2.5-pro` as a first-class, explicitly-selectable cli-opencode model — exactly mirroring how MiniMax's Token Plan (`minimax-coding-plan`) was wired in packet 120. The primary live slug is `xiaomi-token-plan-ams/mimo-v2.5-pro` (confirmed responsive on opencode 1.15.13, 2026-06-01, with no `--agent` flag); the free `opencode/mimo-v2.5-free` gateway path is recorded as a cheap-iteration sibling. Touches ~12 doc/metadata/registry files plus a new changelog version. No runtime code; the user applies opencode provider config in their own env. **No default changes**: `opencode-go/deepseek-v4-pro` stays the skill default — MiMo is additive and opt-in.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (spec.md REQ-001..006)
- [x] Success criteria measurable
- [x] Provider/model ids confirmed against the live install (`opencode models xiaomi-token-plan-ams`; live one-shot probe returned cleanly)

### Definition of Done
- [ ] All acceptance criteria met (REQ-001..006)
- [ ] `model-profiles.json` valid JSON; `jq` passes
- [ ] `validate.sh --strict` passes on this folder
- [ ] checklist.md items verified with evidence
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Additive, explicitly-selectable provider. `xiaomi-token-plan-ams` (Xiaomi Token Plan, Europe) is a new subscription-billed path with its own quota pool (`xiaomi-token-plan`), parallel to the existing `minimax-coding-plan` (MiniMax Token Plan) path. MiMo is never a default — callers select `--model xiaomi-token-plan-ams/mimo-v2.5-pro` deliberately. Mirrors how the MiniMax Token Plan model sits alongside the `opencode-go` default without displacing it.

### Key Components
- **Shared registry** (`model-profiles.json`): a `mimo-v2.5-pro` entry (provider `xiaomi-token-plan-ams`, quota_pool `xiaomi-token-plan`, slug `xiaomi-token-plan-ams/mimo-v2.5-pro`, status `active`, `context_length: null`), optionally a free `opencode/mimo-v2.5-free` fallback path, an updated active-rotation description line, and a bumped `version`. The fallback router reads `executors[].quota_pool` + `primary_quota_pool` + `fallback_target` — the contract is unchanged.
- **cli-opencode provider docs**: SKILL.md auth options + §4 pre-flight (detect `xiaomi-token-plan-ams`) + §5 model rows + `--variant` matrix + §6 `--agent` omission note + keyword header; cli_reference.md §4/§5; prompt_templates.md MiMo dispatch contract; prompt_quality_card.md per-model placeholder; graph-metadata.json trigger phrases; a new changelog version file.
- **Sentinel + cards + metadata** (`sk-prompt-models`): SKILL.md activation + dispatch matrix row, description.json, pattern-index.md provider/dispatch row, README.md provider mention, graph-metadata.json trigger phrases — discovery surfaces so the advisor names MiMo.

### Data Flow
A caller selects `--model xiaomi-token-plan-ams/mimo-v2.5-pro`; cli-opencode runs auth pre-flight against `opencode providers list` / `opencode models xiaomi-token-plan-ams`; on success it dispatches through the Xiaomi Token Plan (provider-managed endpoint, subscription quota pool `xiaomi-token-plan`), **omitting `--agent`** (on 1.15.13 `--agent general` warns and falls back to the default agent). For cheap iteration or probing, the documented sibling is the free gateway path `opencode/mimo-v2.5-free` (opencode-go credit pool; v2.5, not -pro tier). The default skill path (`opencode-go/deepseek-v4-pro`) is unaffected.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase edits a shared schema file (`model-profiles.json`) consumed by the fallback router, so the affected-surface inventory applies.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `sk-prompt/assets/model-profiles.json` | Producer — registry of model→executor paths | update (add `mimo-v2.5-pro`, optional `mimo-v2.5-free`, description + version bump) | `jq` parse + entry shape matches the `minimax-m3` model |
| `system-spec-kit/.../fallback-router.ts` | Consumer — reads `primary_quota_pool`/`fallback_target`/`executors[].quota_pool` | unchanged (new pool `xiaomi-token-plan`, `fallback_target: null` unless a free entry is added) | `rg -n "quota_pool\|fallback_target" fallback-router.ts` confirms it reads, not enumerates |
| `cli-opencode` SKILL.md + cli_reference.md | Docs — provider auth + model selection | update (add MiMo as an explicitly-selectable path) | `rg -n "xiaomi-token-plan-ams"` shows new rows |
| `sk-prompt-models` SKILL.md + graph-metadata.json | Discovery sentinel | update (description + triggers) | `rg -n "xiaomi-token-plan-ams\|mimo"` shows entries |

Required inventories:
- Same-class producers: `rg -n '"provider"|"quota_pool"' .opencode/skills/sk-prompt/assets/model-profiles.json`.
- Consumers of the registry: `rg -n 'model-profiles|primary_quota_pool|fallback_target' .opencode/skills --glob '*.ts'`.
- Matrix axes: provider (`xiaomi-token-plan-ams`) × model (`mimo-v2.5-pro`, free sibling `opencode/mimo-v2.5-free`) × quota_pool (`xiaomi-token-plan`, free via opencode-go pool).
- Invariant: registry must remain valid JSON and every model entry must keep required keys (`id`, `executors`, `primary_quota_pool`, `status`).
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Re-read the existing `minimax-m3` / `minimax-2.7` registry entries (pattern to mirror) in `sk-prompt/assets/model-profiles.json`
- [x] Confirm live provider/model ids (`opencode models xiaomi-token-plan-ams`; live probe to `xiaomi-token-plan-ams/mimo-v2.5-pro` returned cleanly)

### Phase 2: Core Implementation
- [ ] Registry: add `mimo-v2.5-pro` (provider `xiaomi-token-plan-ams`, quota_pool `xiaomi-token-plan`, slug `xiaomi-token-plan-ams/mimo-v2.5-pro`, `context_length: null`); optionally add the free `opencode/mimo-v2.5-free` path; update description active-rotation line; bump `version`
- [ ] cli-opencode cli_reference.md §4 (pre-flight detects `xiaomi-token-plan-ams` + setup) and §5 (model rows + `--variant` matrix)
- [ ] cli-opencode SKILL.md (auth options, pre-flight tree, login/setup mention, model selection, `--agent` omission caveat, keyword header)
- [ ] cli-opencode assets (prompt_templates.md MiMo contract, prompt_quality_card.md per-model placeholder) + graph-metadata.json triggers
- [ ] cli-opencode changelog: new `vX.Y.Z.0.md` version file for the MiMo addition
- [ ] sk-prompt-models SKILL.md + description.json + pattern-index.md + README.md + graph-metadata.json triggers

### Phase 3: Verification
- [ ] `jq .` on model-profiles.json passes; both graph-metadata.json files valid JSON
- [ ] `rg -n` confirms the new MiMo rows across cli-opencode + sk-prompt + sentinel; default (`opencode-go/deepseek-v4-pro`) unchanged
- [ ] `validate.sh --strict` on this folder passes
- [ ] `advisor_rebuild` (or `skill_advisor.py --force-refresh`) so new triggers route
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Schema | `model-profiles.json` + graph-metadata valid JSON + required keys | `jq` |
| Doc presence | MiMo selectable rows present; default unchanged | `rg -n` |
| Honesty | `context_length` null, `--variant`/framework marked pending | `rg -n` review |
| Spec gate | Folder docs structurally valid | `validate.sh --strict` |
| Routing | New triggers surface the sentinel | `advisor_recommend` / `skill_advisor.py` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Live provider/model ids (`xiaomi-token-plan-ams/mimo-v2.5-pro`) | Internal (live probe) | Green | None — confirmed on the install 2026-06-01 |
| MiniMax Token Plan wiring (pattern to mirror) | Internal | Green | None — pattern exists and is stable in these same files |
| Xiaomi Token Plan live API | External | Green | Already configured on the user's machine; docs land regardless |
| MiMo `context_length` / `--variant` / best framework | Internal (deferred) | Yellow | Placeholders only — resolved by 126/003 (context + variant) and 126/004 (framework) |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: `model-profiles.json` fails `jq` parse, or strict validate regresses on the folder
- **Procedure**: `git checkout -- <touched files>` (all changes are edits to tracked doc/registry/metadata files plus one new changelog file; no migrations, no data)
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

- Phase 2 (edits) depends on Phase 1 (live id confirmation + registry-shape re-read).
- T003 (registry) is the source of truth other docs cite, so it lands before the cli-opencode + sentinel doc edits.
- Phase 3 (verify) depends on all edits landing; `validate.sh --strict` depends on metadata generation (`description.json` + `graph-metadata.json`).
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Scope | Estimate |
|-------|-------|----------|
| Setup | Confirm live ids + re-read registry shape | ~0.1 day |
| Implementation | ~12 doc/registry/metadata edits + 1 new changelog | ~0.4 day |
| Verification | jq + rg + strict validate + advisor re-index | ~0.1 day |

No code build/test cycle (documentation + registry only).
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

- **Detection**: `jq` parse failure on `model-profiles.json`, strict-validate regression, or a dispatch that resolves the wrong provider/slug.
- **Immediate**: `git checkout -- <touched files>` (all edits are to tracked files; no data, no migrations).
- **Partial**: each file is independently revertible — restore only `model-profiles.json` to drop the `mimo-v2.5-pro` entry, or only the doc edits, without touching the other.
- **Forward-fix**: if the slug is wrong, update the `mimo-v2.5-pro` executor note + cli_reference §5 row to the confirmed id from `opencode models xiaomi-token-plan-ams` (never CamelCase; the live id is lowercase `xiaomi-token-plan-ams/mimo-v2.5-pro`).
<!-- /ANCHOR:enhanced-rollback -->

---

<!--
CORE TEMPLATE (~90 lines) + L2 addendums
-->
