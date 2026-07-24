---
title: "Feature Specification: Cursor model registry and routing"
description: "Add a Composer (Cursor-native model) prompt-craft profile and cli-cursor executor rows to sk-prompt/prompt-models, and wire the check-prompt-quality-card-sync.sh CI gate for cli-cursor - grounded in phase 001's confirmed facts, with the auth-gated live model roster marked TBD."
trigger_phrases: ["cli-cursor model registry", "cursor composer profile", "cursor model routing"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/030-cli-cursor-creation/005-cursor-model-registry-and-routing"
    last_updated_at: "2026-07-24T04:16:30Z"
    last_updated_by: "claude-code"
    recent_action: "Authored phase 005 spec; status Planned"
    next_safe_action: "Author plan.md, tasks.md, checklist.md; wait for phase 003"
    blockers: ["cursor-agent login (auth) blocks live model-roster enumeration; Composer's exact specs are TBD until authenticated"]
    key_files: [".opencode/skills/sk-prompt/prompt-models/assets/model-profiles.json", ".opencode/skills/system-skill-advisor/mcp-server/scripts/check-prompt-quality-card-sync.sh"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-cursor-creation-authoring", parent_session_id: null }
    completion_pct: 0
    open_questions: ["Composer's exact context window, pricing, and version slug are auth-gated (phase 001) - enumerate via cursor-agent models once authenticated before finalizing the profile.", "Whether cli-cursor needs executor rows on every hosted frontier model it can drive, or only on Composer, given the hosted models already carry provider-native profiles."]
    answered_questions: ["Composer is Cursor's own model (the analog to Devin's swe-1.6/Cognition-native), has no existing prompt-models profile, and is only referenced today in references/context-budget.md."]
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Feature Specification: Cursor model registry and routing

<!-- ANCHOR:metadata -->
## 1. METADATA
| Field | Value |
|---|---|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-24 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `cli-external-orchestration/030-cli-cursor-creation` |
| **Predecessor** | `../004-cursor-hook-adapter-layer/spec.md` |
| **Successor** | `../006-cursor-manual-testing-playbook/spec.md` |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`sk-prompt/prompt-models` is this repo's canonical registry of per-model prompt-craft profiles (`assets/model-profiles.json` + `references/models/*.md`), consumed when dispatching to a specific model through any executor. Cursor introduces one genuinely new model to this registry: **Composer**, Cursor's own coding model (the analog to Devin's Cognition-native `swe-1.6`). Composer has no profile today — it is only mentioned in passing in `references/context-budget.md`. Cursor also drives hosted frontier models (gpt/sonnet/opus/gemini/grok) that already carry provider-native behavior, so those need executor-row bookkeeping rather than new profiles.

The `check-prompt-quality-card-sync.sh` CI gate (in `system-skill-advisor/mcp-server/scripts/`) keeps each executor's `prompt-quality-card.md` in sync with the canonical card; it must learn about `cli-cursor` so the new packet's card is covered by the same gate as its siblings.

Critically, the live model roster is **auth-gated** (phase 001): `cursor-agent models`/`--list-models` require account auth this machine lacks, so Composer's exact context window, pricing, and version slug cannot be enumerated yet and must be marked TBD rather than fabricated.

### Purpose
Add a Composer prompt-craft profile grounded in phase 001's confirmed facts (with auth-gated numeric specs marked TBD), record `cli-cursor` as an executor that can drive it and the hosted frontier models, and wire `cli-cursor` into the `check-prompt-quality-card-sync.sh` CI gate — without fabricating any per-model numeric detail the auth gate prevents confirming.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Author `references/models/composer.md` — a Composer prompt-craft profile mirroring the structure of the existing per-model profiles (`glm-5.2.md`, `kimi-k2.7-code.md`, etc.), documenting Composer as Cursor's native coding model with a `Cursor-exclusive` note, its confirmed selection mechanics (`--model composer`-style / Auto router), and TBD placeholders for the auth-gated context window / pricing / exact version slug.
- Add a Composer entry to `assets/model-profiles.json` consistent with the existing entries' shape.
- Record `cli-cursor` as a driving executor for Composer and, per the resolved open question, for the hosted frontier models it can run.
- Wire `cli-cursor` into the `check-prompt-quality-card-sync.sh` CI gate arrays so `cli-cursor/assets/prompt-quality-card.md` is covered by the same sync check as its siblings.

### Out of Scope
- Fabricating Composer's context window, pricing, or exact version slug while the roster is auth-gated — these are TBD placeholders until `cursor-agent models` can be run authenticated.
- Re-creating executor-config.ts's `CURSOR_SUPPORTED_MODELS`/`CursorApprovalMode` — that is phase 002's runtime-typing layer, a different registry from `sk-prompt/prompt-models`.
- Authoring `cli-cursor/assets/prompt-quality-card.md` itself — that is phase 003; this phase only ensures the CI gate covers it.
- Adding profiles for the hosted frontier models (gpt/sonnet/opus/gemini/grok) — they carry provider-native behavior and are driven, not owned, by Cursor; only Composer (Cursor-exclusive) gets a new profile.
- Any dispatch-runtime or fan-out code (phase 002).

### Files to Change
| File Path | Change Type | Description |
|---|---|---|
| `.opencode/skills/sk-prompt/prompt-models/references/models/composer.md` | Create | Composer prompt-craft profile (Cursor-native), auth-gated specs as TBD. |
| `.opencode/skills/sk-prompt/prompt-models/references/models/_index.md` | Modify | Add Composer to the model index. |
| `.opencode/skills/sk-prompt/prompt-models/assets/model-profiles.json` | Modify | Add a Composer entry; note `cli-cursor` as a driving executor. |
| `.opencode/skills/system-skill-advisor/mcp-server/scripts/check-prompt-quality-card-sync.sh` | Modify | Add `cli-cursor` to the executor arrays the sync gate covers. |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Priority |
|---|---|---|
| REQ-001 | `references/models/composer.md` exists, structured like the existing per-model profiles, documenting Composer as Cursor's native/exclusive coding model with its confirmed selection mechanics. | P1 |
| REQ-002 | Composer's auth-gated specs (context window, pricing, exact version slug) are TBD placeholders, explicitly marked "verify at implementation time via `cursor-agent models`", never fabricated. | P0 |
| REQ-003 | `assets/model-profiles.json` gains a Composer entry consistent with the existing entries' shape, with `cli-cursor` recorded as a driving executor. | P1 |
| REQ-004 | `references/models/_index.md` lists Composer. | P2 |
| REQ-005 | `check-prompt-quality-card-sync.sh` includes `cli-cursor` in the executor arrays it covers, so the new packet's `prompt-quality-card.md` is gated identically to its siblings. | P1 |
| REQ-006 | The open question of whether `cli-cursor` needs executor rows on every hosted frontier model or only Composer is resolved (documented) before the model-profiles edits are finalized. | P1 |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
- **SC-001**: `references/models/composer.md` and the `model-profiles.json` Composer entry exist, with every auth-gated numeric field marked TBD, none fabricated.
- **SC-002**: `check-prompt-quality-card-sync.sh` passes with `cli-cursor` included in its coverage arrays.
- **SC-003**: `bash .../validate.sh 005-cursor-model-registry-and-routing --strict` passes 0/0.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
- **Fabricated model specs**: guessing Composer's context window or pricing while auth-gated would ship false data. Mitigation: REQ-002 mandates TBD placeholders and an explicit verify-at-impl-time note.
- **CI gate array drift**: adding `cli-cursor` to one array but not another in `check-prompt-quality-card-sync.sh` would leave the card partially gated. Mitigation: edit all coverage arrays in one pass and run the gate immediately.
- **Dependency — phase 003**: `cli-cursor/assets/prompt-quality-card.md` must exist (phase 003) for the sync gate to have something to check; if 003 hasn't landed, wire the gate array but note the card is pending. Mitigation: sequence after 003, or land the array wiring and let the gate go green once 003 ships.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. NON-FUNCTIONAL REQUIREMENTS
- **NFR-C01**: The Composer profile follows the exact structural shape of the existing `references/models/*.md` profiles — no bespoke section layout.

## 8. EDGE CASES
- Composer is renamed or versioned (e.g. "Composer 2.5" → a later version) between authoring and implementation: the profile's version field is a TBD placeholder resolved at implementation time, not hardcoded to a product-page snapshot.
- `check-prompt-quality-card-sync.sh` runs before phase 003 ships the card: the gate would flag a missing card — expected; land the array wiring in the same window as phase 003's card, or after it.

## 9. COMPLEXITY ASSESSMENT
| Dimension | Score | Notes |
|---|---|---|
| Scope | 10/25 | 1 new profile + 3 small edits; markdown/JSON/shell only. |
| Risk | 8/25 | Low blast radius; main risk is fabricating auth-gated specs, mitigated by TBD discipline. |
| Research | 8/20 | Grounded in phase 001; Composer's exact specs deferred to an authenticated roster enumeration. |
| **Total** | **26/70** | **Level 2** |

## 10. RISK MATRIX
| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Composer specs fabricated instead of TBD | Medium | Medium (false model data) | REQ-002 TBD discipline + verify-at-impl-time note |
| Sync-gate arrays edited inconsistently | Low | Medium (partially-gated card) | Single-pass edit + immediate gate run |

## 11. USER STORIES
- As a dispatcher, I want Composer to have a prompt-craft profile like every other model, so dispatching Cursor with Composer follows the same craft guidance as any other model dispatch.
- As a maintainer, I want `cli-cursor`'s prompt-quality card covered by the same CI sync gate as its siblings, so it cannot silently drift from the canonical card.

## 12. OPEN QUESTIONS
- Composer's exact context window, pricing, and version slug are auth-gated (phase 001) — enumerate via `cursor-agent models` once authenticated before finalizing the profile; TBD until then.
- Does `cli-cursor` need executor rows on every hosted frontier model it can drive, or only on Composer, given the hosted models already carry provider-native profiles? Leaning toward Composer-only plus a driving-executor note, resolved before the `model-profiles.json` edit.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS
- `plan.md`, `tasks.md`, `checklist.md` (this phase)
- `../004-cursor-hook-adapter-layer/spec.md` (predecessor)
- `../006-cursor-manual-testing-playbook/spec.md` (successor)
- `../001-cursor-contract-pin/implementation-summary.md` (confirmed model-roster shape; Composer as Cursor-native; auth-gated enumeration caveat)
- `.opencode/skills/sk-prompt/prompt-models/references/models/glm-5.2.md` (structural precedent for the Composer profile)
- `../../029-cli-devin-revival/005-devin-model-registry-and-quota/spec.md` (structural precedent: adding a CLI-native model + executor rows + CI gate)
