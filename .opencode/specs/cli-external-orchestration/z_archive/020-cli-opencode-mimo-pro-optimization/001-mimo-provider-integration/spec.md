---
title: "Feature Specification: Xiaomi Token Plan (Europe) provider + MiMo-V2.5-Pro integration"
description: "Wire the xiaomi-token-plan-ams provider and model mimo-v2.5-pro into cli-opencode, the shared small-model registry, and the sk-prompt-models sentinel, mirroring the MiniMax Token Plan wiring."
trigger_phrases:
  - "mimo provider integration"
  - "xiaomi-token-plan-ams"
  - "mimo-v2.5-pro cli-opencode"
  - "mimo registry entry"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/020-cli-opencode-mimo-pro-optimization/001-mimo-provider-integration"
    last_updated_at: "2026-06-01T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Phase-001 shipped; strict validate PASSED"
    next_safe_action: "Proceed to 002 (already implemented) / 003 research"
    blockers: []
    key_files:
      - ".opencode/skills/sk-prompt/assets/model-profiles.json"
      - ".opencode/skills/cli-opencode/SKILL.md"
      - ".opencode/skills/cli-opencode/references/cli_reference.md"
      - ".opencode/skills/sk-prompt-models/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-126-001"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "fallback_target for mimo-v2.5-pro? → null; free opencode/mimo-v2.5-free documented as a cheap-iteration path, not a registry fallback entry"
      - "Xiaomi Token Plan request-window quota like MiniMax's 5h window? → unverified; 126/003 may confirm"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 1: mimo-provider-integration

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
| **Phase** | 1 (foundation) |
| **Predecessor** | None (mirrors `120/001` + `120/004`) |
| **Successor** | 002-deep-skills-executor-integration |
| **Handoff Criteria** | `mimo-v2.5-pro` present in `model-profiles.json` (valid JSON); cli-opencode + sentinel docs show the `xiaomi-token-plan-ams` provider; strict validate passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

The Xiaomi Token Plan (Europe) is configured on the install as provider `xiaomi-token-plan-ams` and exposes a MiMo model family. This phase wires the text/coding model `mimo-v2.5-pro` in as a first-class cli-opencode model — exactly mirroring how MiniMax's Token Plan (`minimax-coding-plan`) was wired in packet 120. Documentation, metadata, and the shared registry only; no runtime code.

**Live-machine ground truth (opencode 1.15.13, observed 2026-06-01):**
- Provider id **`xiaomi-token-plan-ams`** (credential "Xiaomi Token Plan (Europe)", api).
- Confirmed live ids: `xiaomi-token-plan-ams/mimo-v2.5-pro` (target), plus `mimo-v2.5`, `mimo-v2-pro`, `mimo-v2-omni`, `mimo-v2.5-tts*`.
- A live one-shot probe to `xiaomi-token-plan-ams/mimo-v2.5-pro` returned cleanly (no `--agent`).
- Free gateway sibling **`opencode/mimo-v2.5-free`** resolves via opencode-go.
- `--agent general` warns + falls back on this version → omit `--agent` for MiMo dispatches.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
MiMo-V2.5-Pro is reachable on the install (`xiaomi-token-plan-ams/mimo-v2.5-pro`) but is invisible to the framework: it is not a documented cli-opencode provider, is absent from `model-profiles.json`, and the `sk-prompt-models` sentinel never names it. We cannot route to it deliberately and have no usage guidance.

### Purpose
Register the Xiaomi Token Plan (Europe) provider + `mimo-v2.5-pro` model across cli-opencode, the shared registry, and the sentinel, with a `context_length` placeholder (null) pending phase-003 research, so MiMo becomes a deliberately selectable model.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add `mimo-v2.5-pro` to `sk-prompt/assets/model-profiles.json` (executor `cli-opencode`, provider `xiaomi-token-plan-ams`, quota_pool `xiaomi-token-plan`); register the free `opencode/mimo-v2.5-free` path; bump `version`; update the registry description's active-rotation line.
- Update cli-opencode: auth options, §4 pre-flight detection, §5 model rows + `--variant` matrix, §6 agent-flag note, prompt template, quality-card per-model placeholder, graph-metadata trigger phrases, and a new changelog version file.
- Update `sk-prompt-models`: SKILL.md activation + dispatch matrix, description.json, pattern-index.md, README.md, graph-metadata.json trigger phrases.

### Out of Scope
- Determining MiMo's context length / `--variant` behavior / best framework — phases 003 + 004 (placeholders here).
- Deep-skill executor wiring — phase 002.
- MiMo TTS/omni/voice models.
- Changelog rewrites of prior versions.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-prompt/assets/model-profiles.json` | Modify | Add `mimo-v2.5-pro` entry (+ optional `mimo-v2.5-free` fallback); description + version bump |
| `.opencode/skills/cli-opencode/SKILL.md` | Modify | Auth options, pre-flight tree, model-selection, keyword header |
| `.opencode/skills/cli-opencode/references/cli_reference.md` | Modify | §4 pre-flight + setup; §5 model rows + `--variant` matrix |
| `.opencode/skills/cli-opencode/assets/prompt_templates.md` | Modify | MiMo dispatch template (framework TBD → set in 004) |
| `.opencode/skills/cli-opencode/assets/prompt_quality_card.md` | Modify | MiMo per-model override placeholder |
| `.opencode/skills/cli-opencode/graph-metadata.json` | Modify | MiMo/Xiaomi trigger phrases + key topics |
| `.opencode/skills/cli-opencode/changelog/vX.Y.Z.0.md` | Create | New version changelog for the MiMo addition |
| `.opencode/skills/sk-prompt-models/SKILL.md` | Modify | Activation triggers + dispatch matrix row |
| `.opencode/skills/sk-prompt-models/description.json` | Modify | Description + keywords |
| `.opencode/skills/sk-prompt-models/references/pattern-index.md` | Modify | Provider/dispatch row |
| `.opencode/skills/sk-prompt-models/README.md` | Modify | Provider mention |
| `.opencode/skills/sk-prompt-models/graph-metadata.json` | Modify | Trigger phrases |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | MiMo-V2.5-Pro registered in the shared registry | `model-profiles.json` parses as valid JSON; `mimo-v2.5-pro` entry exists with executor provider `xiaomi-token-plan-ams`, quota_pool `xiaomi-token-plan`, slug `xiaomi-token-plan-ams/mimo-v2.5-pro`, status `active`; `version` bumped |
| REQ-002 | cli-opencode documents the provider as a selectable MiMo path | `cli_reference.md` §5 + SKILL.md model selection show `xiaomi-token-plan-ams/mimo-v2.5-pro`; §4 pre-flight detects `xiaomi-token-plan-ams`; `--agent` omission recorded |
| REQ-003 | Sentinel names MiMo | `sk-prompt-models` SKILL.md/description.json/pattern-index name MiMo via the Xiaomi Token Plan; graph-metadata carries MiMo trigger phrases |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Live ids used verbatim (no slug guessing) | Every model string is the lowercase live id `xiaomi-token-plan-ams/mimo-v2.5-pro` confirmed via `opencode models`; no CamelCase invention |
| REQ-005 | Placeholders are honest | `context_length` null with a note that 003 research will confirm; framework note marked "pending 004 benchmark" |
| REQ-006 | Free path documented | `opencode/mimo-v2.5-free` recorded as a cheap-iteration / fallback path |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `jq . model-profiles.json` succeeds; `mimo-v2.5-pro` (active, xiaomi-token-plan pool) present.
- **SC-002**: `rg -n "xiaomi-token-plan-ams|mimo-v2.5-pro|xiaomi-token-plan" .opencode/skills` returns the new rows across cli-opencode + sk-prompt + sentinel.
- **SC-003**: No fabricated capability claims; `context_length` null pending 003.
- **SC-004**: `validate.sh --strict` on this folder passes (Exit 0).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Registry JSON malformed by hand-edit | High — breaks fallback router for all models | `jq` validate after edit; mirror exact shape of `minimax-m3` entry |
| Risk | Slug-case drift (guessing `MiMo-V2.5-Pro`) | Med — dispatch 404s | Use the live lowercase id `mimo-v2.5-pro` verbatim (memory: minimax-model-id-drift) |
| Dependency | Xiaomi provider reachability via opencode | Low — credential already present + probe succeeded | Docs land regardless; runtime auth is the user's env |
| Risk | Premature capability claims (context window, framework) | Med — misleading guidance | Mark null/pending; 003 + 004 fill them |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should `mimo-v2.5-pro` declare `fallback_target` = a `mimo-v2.5-free` entry (opencode-go pool) or null? (Decide from registry conventions during implementation.)
- Does the Xiaomi Token Plan use a request-window quota like MiniMax's 5-hour window? (Note as unverified; 003 may confirm.)
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-001 | Registry stays valid JSON consumable by the fallback router | `jq` parse exits 0; required keys present on every model |
| NFR-002 | No secrets embedded | Provider configured via opencode auth; no keys in repo |
| NFR-003 | Discoverability | MiMo trigger phrases present in graph-metadata so the advisor surfaces the sentinel |
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- **Slug not on tier**: `opencode models xiaomi-token-plan-ams` is the live check; free `opencode/mimo-v2.5-free` is the cheap fallback.
- **`--agent` passed**: warns + falls back on 1.15.13 → contract says omit `--agent` for MiMo dispatches.
- **Pre-flight grep ambiguity**: `xiaomi-token-plan-ams` is a unique substring (no collision risk like `minimax` vs `minimax-coding-plan`).
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

Low-to-moderate. No runtime code; documentation plus a shared JSON registry consumed by an existing fallback router whose contract is unchanged. Risk concentrates in the registry JSON (hand-edit, `jq`-gated). Cross-file surface is wide (~12 files) but mechanical and mirror-based off the MiniMax wiring.
<!-- /ANCHOR:complexity -->
