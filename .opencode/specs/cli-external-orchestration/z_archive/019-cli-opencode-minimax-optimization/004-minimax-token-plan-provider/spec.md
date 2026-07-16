---
title: "Feature Specification: MiniMax Token Plan default provider (+ Direct API retained)"
description: "Make the MiniMax Token Plan (provider minimax-coding-plan, subscription) the default MiniMax path in cli-opencode and the shared registry, defaulting to MiniMax-M3-highspeed with MiniMax-M2.7-highspeed fallback, while keeping the pay-per-token Direct API (provider minimax) as a second selectable provider."
trigger_phrases:
  - "minimax token plan provider"
  - "minimax coding plan default"
  - "minimax m3 highspeed cli-opencode"
  - "minimax direct api fallback"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/019-cli-opencode-minimax-optimization/004-minimax-token-plan-provider"
    last_updated_at: "2026-06-01T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Phase-004 shipped; strict validate PASSED"
    next_safe_action: "User reconfigures the opencode minimax-coding-plan provider in their env"
    blockers: []
    key_files:
      - ".opencode/skills/sk-prompt/assets/model-profiles.json"
      - ".opencode/skills/cli-opencode/SKILL.md"
      - ".opencode/skills/cli-opencode/references/cli_reference.md"
      - ".opencode/skills/sk-prompt-models/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/004-minimax-token-plan-provider"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Replace API or support both? → support both, default Token Plan (user direction)"
      - "Provider structure? → two concurrent providers: minimax-coding-plan (Token Plan, default) + minimax (Direct API, pay-per-token)"
      - "Default/fallback model? → default MiniMax-M3-highspeed, fallback MiniMax-M2.7-highspeed (user direction)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 4: minimax-token-plan-provider

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
| **Phase** | 4 (follows 001 direct-API integration) |
| **Predecessor** | 001-minimax-provider-integration |
| **Successor** | None |
| **Handoff Criteria** | Token Plan (`minimax-coding-plan`) is the default MiniMax path in cli-opencode + registry (`MiniMax-M3-highspeed` default, `MiniMax-M2.7-highspeed` fallback); Direct API retained as `minimax`; `model-profiles.json` valid JSON; strict validate passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

The account holder switched from MiniMax pay-per-token (Direct API) to the **MiniMax Token Plan** (subscription, minimax.io). Phase 001 wired MiniMax in as a *direct-API* provider (`minimax` → `MINIMAX_API_KEY`, model `minimax/MiniMax-M2.7`). This phase re-points the default MiniMax path at the Token Plan while keeping the Direct API selectable.

**Scope Boundary**: Documentation, metadata, and the shared registry only. No runtime code. The actual opencode provider credentials live on the user's machine (`~/.config/opencode/opencode.json` + `opencode auth login`); this packet documents the exact config the user applies — it does not store keys.

**Live-machine ground truth (opencode 1.15.13, observed 2026-06-01):**
- The Token Plan provider is named **`minimax-coding-plan`** (credential shows as "MiniMax Token Plan (minimax.io)").
- Confirmed live ids: `minimax-coding-plan/MiniMax-M2.7` (standard) and `minimax-coding-plan/MiniMax-M2.7-highspeed` ("M2.7 fast").
- The skill's previously documented `minimax/MiniMax-M2.7` id is **stale** → "Model not found."
- `--agent general` is **rejected** on this version (omit `--agent` for MiniMax dispatches). This is opencode version drift vs the skill's pinned v1.3.17.

**Token Plan vs Direct API:**
- **Token Plan** (`minimax-coding-plan`) = subscription billing (requests per 5-hour window). Anthropic-compatible endpoint `https://api.minimax.io/anthropic/v1` (China: `https://api.minimaxi.com/anthropic/v1`) under the hood; configured with `opencode auth login` → MiniMax Token Plan.
- **Direct API** (`minimax`) = pay-per-token. Platform endpoint `https://api.minimax.io/v1`, `MINIMAX_API_KEY`.
- Default model on the Token Plan: `MiniMax-M3-highspeed`; fallback model: `MiniMax-M2.7-highspeed` (account-holder confirmed; M2.7-highspeed independently confirmed live).
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Every MiniMax reference in the repo describes the provider as the **pay-per-token Direct API** (`minimax` → `MINIMAX_API_KEY`, `MiniMax-M2.7`). The account holder is now on the **Token Plan** (provider `minimax-coding-plan`), which is a different provider name, endpoint, billing model, and default model. Dispatching MiniMax with the documented `minimax/MiniMax-M2.7` id now errors ("Model not found") on the live install, and the docs give no Token Plan setup.

### Purpose
Make the **Token Plan** (`minimax-coding-plan`) the default MiniMax provider (`MiniMax-M3-highspeed` default → `MiniMax-M2.7-highspeed` fallback), keep the **Direct API** (`minimax`) as an explicitly selectable second provider, and align every doc/registry/metadata surface accordingly.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Document the `minimax-coding-plan` provider as the Token Plan (Anthropic-compatible endpoint, subscription quota pool `minimax-token-plan`) and make it the default MiniMax path.
- Retain the `minimax` provider as the Direct API (pay-per-token) alternative (`minimax-api` pool, `MINIMAX_API_KEY`).
- Registry: add `minimax-m3` (default, token-plan, `fallback_target: minimax-2.7`); revise `minimax-2.7` to carry both the token-plan highspeed executor (`minimax-coding-plan`) and the direct-api executor (`minimax`); bump `version`.
- Update cli-opencode auth pre-flight, login/setup templates, model-selection + `--variant` tables; record the `--agent` omission + version-drift caveat for MiniMax dispatches.
- Update sentinel (`sk-prompt-models`), quality cards, and `graph-metadata.json` trigger phrases.

### Out of Scope
- Live dispatch / credential setup — user runs `opencode auth login` in their own env.
- Changelog rewrites — historical `changelog/*.md` files record past state and are left intact.
- `fanout-pool.vitest.ts` lineage labels (`minimax-1`) — status labels, not model ids; unchanged. (Per the "Fix 2" follow-up, the `dispatch-model.cjs` fallback default and the `executor-config.vitest.ts` fixture model id WERE updated to the token-plan slug.)
- The cli-opencode skill's overall default model (`opencode-go/deepseek-v4-pro`) — unchanged; only the MiniMax-specific routing changes.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-prompt/assets/model-profiles.json` | Modify | Add `minimax-m3`; revise `minimax-2.7` (dual executor); update registry description; bump version |
| `.opencode/skills/cli-opencode/SKILL.md` | Modify | Auth options, pre-flight tree, login/setup templates, model selection — Token Plan default + Direct API alt + `--agent` caveat |
| `.opencode/skills/cli-opencode/references/cli_reference.md` | Modify | §4 pre-flight + setup; §5 model-selection rows + `--variant` matrix |
| `.opencode/skills/cli-opencode/assets/prompt_templates.md` | Modify | MiniMax dispatch contract → `minimax-coding-plan/MiniMax-M3-highspeed` default |
| `.opencode/skills/cli-opencode/assets/prompt_quality_card.md` | Modify | MiniMax mention alignment |
| `.opencode/skills/cli-opencode/graph-metadata.json` | Modify | Trigger phrases (token plan, coding plan, m3-highspeed) |
| `.opencode/skills/sk-prompt-models/SKILL.md` | Modify | Description, activation triggers, dispatch matrix |
| `.opencode/skills/sk-prompt-models/description.json` | Modify | Description string alignment |
| `.opencode/skills/sk-prompt-models/references/pattern-index.md` | Modify | Provider row alignment |
| `.opencode/skills/sk-prompt-models/README.md` | Modify | Provider mention alignment |
| `.opencode/skills/sk-prompt-models/graph-metadata.json` | Modify | Trigger phrases |
| `.opencode/skills/sk-prompt/assets/cli_prompt_quality_card.md` | Modify | MiniMax mention alignment |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Token Plan is the default MiniMax provider in the registry | `model-profiles.json` parses as valid JSON; `minimax-m3` entry exists with executor provider `minimax-coding-plan`, quota_pool `minimax-token-plan`, slug `MiniMax-M3-highspeed`, status `active`, `fallback_target: "minimax-2.7"`; `version` bumped |
| REQ-002 | Direct API retained as a second selectable provider | `minimax-2.7` entry carries two executors: provider `minimax-coding-plan` (token-plan, `MiniMax-M2.7-highspeed`) AND provider `minimax` (direct API, quota_pool `minimax-api`); registry still valid JSON |
| REQ-003 | cli-opencode docs make Token Plan the default MiniMax path | `cli_reference.md` §5 + SKILL.md model selection show `minimax-coding-plan/MiniMax-M3-highspeed` as the default MiniMax dispatch and `minimax/MiniMax-M2.7` as the pay-per-token alt; §4 pre-flight detects both providers |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Token Plan setup is documented (no fabricated values) | SKILL.md/cli_reference.md show the Anthropic-compatible base URL (`https://api.minimax.io/anthropic/v1`, China variant noted) + `opencode auth login` path; the `--agent` omission + version-drift caveat is recorded |
| REQ-005 | Sentinel + metadata aligned | `sk-prompt-models` SKILL.md/description.json/pattern-index/README name the Token Plan default + Direct API alt; both `graph-metadata.json` files carry token-plan/coding-plan trigger phrases |
| REQ-006 | Quality cards aligned | `cli-opencode/assets/prompt_*` + `sk-prompt/assets/cli_prompt_quality_card.md` MiniMax mentions reflect `minimax-coding-plan/MiniMax-M3-highspeed` default |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `jq . sk-prompt/assets/model-profiles.json` succeeds; `minimax-m3` (active, token-plan, fallback → minimax-2.7) and dual-executor `minimax-2.7` both present.
- **SC-002**: `rg -n "minimax-coding-plan|MiniMax-M3-highspeed|minimax-token-plan" .opencode/skills` returns the new rows across cli-opencode + sk-prompt + sentinel.
- **SC-003**: No remaining doc claims that the *default* MiniMax path is the pay-per-token Direct API, and no live-dispatch example uses the stale `minimax/MiniMax-M2.7` id (changelogs excepted).
- **SC-004**: `validate.sh --strict` on this folder passes (Exit 0).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | `MiniMax-M3-highspeed` not yet on the user's `minimax-coding-plan` tier (live note lists only M2.7 ids) | Med — default dispatch fails if slug absent | Account holder directed M3-highspeed as default; documented `opencode models minimax-coding-plan` as the live check; fallback `MiniMax-M2.7-highspeed` is confirmed live |
| Risk | Registry JSON malformed by hand-edit | High — breaks fallback router for all models | `jq` validate after edit; mirror exact shape of existing entries |
| Dependency | Token Plan endpoint reachability via opencode | Low — already configured on the user's machine (`minimax-coding-plan` credential present) | Docs land regardless; runtime auth is the user's env |
| Risk | Region endpoint mismatch (intl vs China) | Low — wrong region 401s | Document intl default + China variant; warn against mixing |
| Risk | opencode version drift (`--agent general` rejected on 1.15.13 vs pinned v1.3.17) | Low — dispatch rejected if `--agent` passed | Record the omit-`--agent` caveat for MiniMax dispatches |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Does `MiniMax-M3-highspeed` resolve on the user's `minimax-coding-plan` tier? (Live note confirms only M2.7 ids so far; `opencode models minimax-coding-plan` settles it definitively. Fallback is confirmed.)
- Is the Direct API (`minimax`) still configured on the user's machine, or token-plan-only now? (Docs cover both; user adds `minimax` via `opencode auth login` only if they want the pay-per-token path.)
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-001 | Registry stays valid JSON consumable by the fallback router | `jq` parse exits 0; required keys (`id`, `executors`, `primary_quota_pool`, `status`) present on every model |
| NFR-002 | No secrets embedded | Keys referenced by env var name only (`MINIMAX_API_KEY`); subscription key configured via `opencode auth login` |
| NFR-003 | Discoverability | Token Plan trigger phrases present in both `graph-metadata.json` files so the advisor surfaces the sentinel |
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- **M3-highspeed not on tier**: default dispatch fails → documented fallback `MiniMax-M2.7-highspeed` (confirmed live) + `opencode models minimax-coding-plan` check.
- **Token Plan window exhausted (requests/5h)**: route to the Direct API provider `minimax` (pay-per-token) or wait for the rolling reset.
- **Region mismatch**: intl `minimax.io` vs China `minimaxi.com` — documented; do not mix endpoints.
- **`--agent` passed**: rejected on opencode 1.15.13 → contract says omit `--agent` for MiniMax dispatches.
- **Pre-flight grep ambiguity**: the substring `minimax` also matches `minimax-coding-plan` → Direct API detection uses `minimax([^-]|$)` to skip the coding-plan provider.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

Low-to-moderate. No runtime code; the change is documentation plus a shared JSON registry consumed by an existing fallback router whose contract is unchanged. Risk concentrates in the registry JSON (hand-edit, `jq`-gated) and one unverified model slug (account-holder-asserted, fallback confirmed). The cross-file surface is wide (~11 files) but mechanical and mirror-based.
<!-- /ANCHOR:complexity -->

---

<!--
CORE TEMPLATE (~80 lines) + L2 (adds checklist.md)
-->
