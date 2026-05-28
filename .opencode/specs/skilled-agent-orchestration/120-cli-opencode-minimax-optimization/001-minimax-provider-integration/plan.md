---
title: "Implementation Plan: MiniMax 2.7 direct-API provider integration"
description: "Mirror the existing deepseek direct-API provider pattern to wire minimax into cli-opencode docs, append a minimax-2.7 registry entry, and surface it via the sk-prompt-small-model sentinel."
trigger_phrases:
  - "minimax provider plan"
  - "minimax-2.7 integration plan"
  - "cli-opencode provider addition"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/120-cli-opencode-minimax-optimization/001-minimax-provider-integration"
    last_updated_at: "2026-05-28T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored phase-001 implementation plan"
    next_safe_action: "Execute the 5 file edits, then verify"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/001-minimax-provider-integration"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 1: minimax-provider-integration

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown skill docs + JSON registry |
| **Framework** | OpenCode skills (cli-opencode, sk-prompt, sk-prompt-small-model) |
| **Storage** | `sk-prompt/assets/model-profiles.json` (shared small-model registry) |
| **Testing** | `jq` JSON validation + `rg` grep checks + spec-kit `validate.sh --strict` |

### Overview
Add MiniMax 2.7 as a direct-API provider by mirroring the existing `deepseek` provider pattern. Touches 5 files: cli-opencode SKILL.md + cli_reference.md (provider docs), sk-prompt model-profiles.json (registry entry), and the sk-prompt-small-model sentinel SKILL.md + graph-metadata.json (discovery). No code/runtime changes — config + documentation only.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Mirror existing provider — replicate the `deepseek` direct-API provider's documentation + registry shape for `minimax`.

### Key Components
- **cli-opencode provider docs**: SKILL.md §3/§4 + cli_reference.md §4/§5 declare auth pre-flight, login shape, model-selection row, `--variant` behavior
- **Shared registry**: `model-profiles.json` `executors[]` entry that the fallback router reads (executor/provider/quota_pool)
- **Sentinel**: `sk-prompt-small-model` SKILL.md description + graph-metadata trigger phrases for discovery

### Data Flow
A caller selects `--model minimax/minimax-2.7`; cli-opencode runs auth pre-flight against `opencode providers list`; on success dispatches through the MiniMax.io direct API using `MINIMAX_API_KEY`. The registry entry lets the fallback router treat `minimax-api` as its own quota pool.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

This phase edits a shared schema file (`model-profiles.json`) consumed by the fallback router, so the affected-surface inventory applies.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `sk-prompt/assets/model-profiles.json` | Producer — registry of model→executor paths | update (append `minimax-2.7`, bump version) | `jq` parse + entry shape matches `deepseek-v4-pro` |
| `system-spec-kit/.../fallback-router.ts` | Consumer — reads `primary_quota_pool`/`fallback_target` | unchanged (new pool `minimax-api`, fail-fast `fallback_target: null`) | `rg -n "quota_pool\|fallback_target" fallback-router.ts` confirms it reads, not enumerates |
| `cli-opencode` SKILL.md + cli_reference.md | Docs — provider auth + model selection | update (mirror `deepseek` rows) | `rg -n "minimax"` shows new rows |
| `sk-prompt-small-model` SKILL.md + graph-metadata.json | Discovery sentinel | update (description + trigger phrases) | `rg -n "minimax"` shows entries |

Required inventories:
- Same-class producers: `rg -n '"provider"|"quota_pool"' .opencode/skills/sk-prompt/assets/model-profiles.json`.
- Consumers of the registry: `rg -n 'model-profiles|primary_quota_pool|fallback_target' .opencode/skills --glob '*.ts' --glob '*.md'`.
- Matrix axes: provider (`minimax`) × model (`minimax-2.7`) × quota_pool (`minimax-api`) — single row, no combinatorial expansion.
- Invariant: registry must remain valid JSON and every model entry must keep the required keys (`id`, `executors`, `primary_quota_pool`, `status`).
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Re-read existing `deepseek` provider rows in cli_reference.md §4/§5 (pattern to mirror)
- [ ] Re-read `deepseek-v4-pro` entry in model-profiles.json (shape to mirror)

### Phase 2: Core Implementation
- [ ] Add `minimax` rows to cli_reference.md §4 (auth pre-flight + login) and §5 (model selection + `--variant`)
- [ ] Add `minimax` to cli-opencode SKILL.md §3/§4
- [ ] Append `minimax-2.7` entry to model-profiles.json + bump `version` to 1.2
- [ ] Update sk-prompt-small-model SKILL.md description + graph-metadata.json trigger phrases

### Phase 3: Verification
- [ ] `jq .` on model-profiles.json passes
- [ ] `rg -n minimax` confirms all rows present
- [ ] `validate.sh --strict` on this folder passes
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Schema | `model-profiles.json` valid JSON + required keys | `jq` |
| Doc presence | New `minimax` rows in cli-opencode docs + sentinel | `rg -n minimax` |
| Spec gate | Folder docs structurally valid | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `deepseek` provider pattern (cli-opencode) | Internal | Green | None — pattern exists and is stable |
| 114's `model-profiles.json` registry | Internal | Green | None — schema is shipped and validated |
| MiniMax.io live API (`MINIMAX_API_KEY`) | External | Yellow | Docs/registry land regardless; live dispatch deferred to user env |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: `model-profiles.json` fails `jq` parse, or strict validate regresses on the folder
- **Procedure**: `git checkout -- <touched files>` (all changes are additive edits to 5 tracked files; no migrations, no data)
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->

