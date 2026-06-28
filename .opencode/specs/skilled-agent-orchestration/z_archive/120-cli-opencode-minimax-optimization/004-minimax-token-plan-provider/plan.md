---
title: "Implementation Plan: MiniMax Token Plan default provider"
description: "Re-point the default MiniMax path at the Token Plan provider (minimax-coding-plan, MiniMax-M3-highspeed → MiniMax-M2.7-highspeed fallback) across cli-opencode docs + the shared registry, retaining the pay-per-token Direct API (minimax) as a second selectable provider."
trigger_phrases:
  - "minimax token plan plan"
  - "minimax coding plan integration plan"
  - "minimax default provider switch"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/120-cli-opencode-minimax-optimization/004-minimax-token-plan-provider"
    last_updated_at: "2026-06-01T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored phase-004 implementation plan"
    next_safe_action: "Execute edits: registry first, then cli-opencode docs, then sentinel + cards"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/004-minimax-token-plan-provider"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 4: minimax-token-plan-provider

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
Switch the default MiniMax dispatch path from the pay-per-token Direct API to the **Token Plan** subscription, grounded in the live machine's provider names (`minimax-coding-plan` = Token Plan; `minimax` = Direct API). Default model `MiniMax-M3-highspeed`, fallback `MiniMax-M2.7-highspeed`. Touches ~12 doc/metadata/registry files. No runtime code; the user applies opencode provider config in their own env.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Provider names confirmed against the live install (memory: minimax-model-id-drift)

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
Two concurrent providers, default-biased. `minimax-coding-plan` (Token Plan) is the default MiniMax path; `minimax` (Direct API) is the explicit pay-per-token alternative. Mirrors how `opencode-go` (default) and `deepseek` (direct) already coexist for DeepSeek.

### Key Components
- **Shared registry** (`model-profiles.json`): `minimax-m3` (token-plan default, `fallback_target: minimax-2.7`) + dual-executor `minimax-2.7` (token-plan highspeed + direct-api). The fallback router reads `executors[].quota_pool` + `fallback_target`.
- **cli-opencode provider docs**: SKILL.md §3/§4 + cli_reference.md §4/§5 — auth pre-flight (detect `minimax-coding-plan` + `minimax`), setup, model selection, `--variant`, `--agent` caveat.
- **Sentinel + cards + metadata**: discovery surfaces aligned to the new default.

### Data Flow
A caller selects (or defaults to) `--model minimax-coding-plan/MiniMax-M3-highspeed`; cli-opencode runs auth pre-flight against `opencode providers list`; on success dispatches through the Token Plan (Anthropic-compatible endpoint, subscription quota). If M3-highspeed is unavailable or the subscription window is exhausted, the documented fallback is `minimax-coding-plan/MiniMax-M2.7-highspeed`, then the pay-per-token `minimax/MiniMax-M2.7`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase edits a shared schema file (`model-profiles.json`) consumed by the fallback router, so the affected-surface inventory applies.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `sk-prompt/assets/model-profiles.json` | Producer — registry of model→executor paths | update (add `minimax-m3`, dual-executor `minimax-2.7`, bump version) | `jq` parse + entry shape matches existing models |
| `system-spec-kit/.../fallback-router.ts` | Consumer — reads `primary_quota_pool`/`fallback_target`/`executors[].quota_pool` | unchanged (new pool `minimax-token-plan`, `fallback_target: minimax-2.7`) | `rg -n "quota_pool\|fallback_target" fallback-router.ts` confirms it reads, not enumerates |
| `cli-opencode` SKILL.md + cli_reference.md | Docs — provider auth + model selection | update (Token Plan default + Direct API alt) | `rg -n "minimax-coding-plan"` shows new rows |
| `sk-prompt-models` SKILL.md + graph-metadata.json | Discovery sentinel | update (description + triggers) | `rg -n "minimax-coding-plan\|token plan"` shows entries |

Required inventories:
- Same-class producers: `rg -n '"provider"|"quota_pool"' .opencode/skills/sk-prompt/assets/model-profiles.json`.
- Consumers of the registry: `rg -n 'model-profiles|primary_quota_pool|fallback_target' .opencode/skills --glob '*.ts'`.
- Matrix axes: provider (`minimax-coding-plan`, `minimax`) × model (`MiniMax-M3-highspeed`, `MiniMax-M2.7-highspeed`, `MiniMax-M2.7`) × quota_pool (`minimax-token-plan`, `minimax-api`).
- Invariant: registry must remain valid JSON and every model entry must keep required keys (`id`, `executors`, `primary_quota_pool`, `status`).
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Re-read the existing `minimax-2.7` registry entry + `deepseek-v4-pro` dual-executor shape (pattern to mirror)
- [x] Confirm live provider/model ids (memory: minimax-model-id-drift)

### Phase 2: Core Implementation
- [ ] Registry: add `minimax-m3`; revise `minimax-2.7` to dual executor; update description; bump `version`
- [ ] cli-opencode cli_reference.md §4 (pre-flight detects both providers + setup) and §5 (model rows + `--variant`)
- [ ] cli-opencode SKILL.md (auth options, pre-flight tree, login/setup template, model selection, `--agent` caveat)
- [ ] cli-opencode assets (prompt_templates.md, prompt_quality_card.md) + graph-metadata.json triggers
- [ ] sk-prompt-models SKILL.md + description.json + pattern-index.md + README.md + graph-metadata.json triggers
- [ ] sk-prompt/assets/cli_prompt_quality_card.md

### Phase 3: Verification
- [ ] `jq .` on model-profiles.json passes; both graph-metadata.json files valid JSON
- [ ] `rg -n` confirms Token Plan default present; no stale `minimax/MiniMax-M2.7` live-dispatch examples remain (changelogs excepted)
- [ ] `validate.sh --strict` on this folder passes
- [ ] `advisor_rebuild` (or `skill_advisor.py --force-refresh`) so new triggers route
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Schema | `model-profiles.json` + graph-metadata valid JSON + required keys | `jq` |
| Doc presence | Token Plan default rows present; stale id absent from live examples | `rg -n` |
| Spec gate | Folder docs structurally valid | `validate.sh --strict` |
| Routing | New triggers surface the sentinel | `advisor_recommend` / `skill_advisor.py` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Live provider/model ids (`minimax-coding-plan`) | Internal (memory) | Green | None — confirmed on the install |
| `deepseek` dual-provider pattern (cli-opencode) | Internal | Green | None — pattern exists and is stable |
| MiniMax Token Plan live API | External | Green | Already configured on the user's machine; docs land regardless |
| `MiniMax-M3-highspeed` availability on tier | External | Yellow | Default may need to drop to M2.7-highspeed; documented as a live check |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: `model-profiles.json` fails `jq` parse, or strict validate regresses on the folder
- **Procedure**: `git checkout -- <touched files>` (all changes are edits to tracked doc/registry/metadata files; no migrations, no data)
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

- Phase 2 (edits) depends on Phase 1 (live id confirmation + registry-shape re-read).
- T003 (registry) is the source of truth other docs cite, so it lands before T004–T010.
- Phase 3 (verify) depends on all edits landing; `validate.sh --strict` depends on metadata generation (`description.json` + `graph-metadata.json`).
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Scope | Estimate |
|-------|-------|----------|
| Setup | Confirm live ids + re-read registry shape | ~0.1 day |
| Implementation | ~11 doc/registry/metadata edits | ~0.4 day |
| Verification | jq + rg + strict validate + advisor re-index | ~0.1 day |

No code build/test cycle (documentation + registry only).
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

- **Detection**: `jq` parse failure on `model-profiles.json`, strict-validate regression, or a dispatch that resolves the wrong provider.
- **Immediate**: `git checkout -- <touched files>` (all edits are to tracked files; no data, no migrations).
- **Partial**: each file is independently revertible — restore only `model-profiles.json` to the prior single-executor `minimax-2.7`, or only the doc edits, without touching the other.
- **Forward-fix**: if only the M3-highspeed slug is wrong, update the `minimax-m3` executor note + cli_reference §5 row to the confirmed id from `opencode models minimax-coding-plan`.
<!-- /ANCHOR:enhanced-rollback -->

---

<!--
CORE TEMPLATE (~90 lines) + L2 addendums
-->
