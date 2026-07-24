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
    recent_action: "Composer profile authored + live-verified; sync gate GUARD PASS"
    next_safe_action: "Run validate.sh --strict, write implementation-summary.md, commit"
    blockers: []
    key_files: [".opencode/skills/sk-prompt/prompt-models/assets/model-profiles.json", ".opencode/skills/system-skill-advisor/mcp-server/scripts/check-prompt-quality-card-sync.sh"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-cursor-creation-authoring", parent_session_id: null }
    completion_pct: 95
    open_questions: []
    answered_questions: ["Composer is Cursor's own model (the analog to Devin's swe-1.6/Cognition-native), has no existing prompt-models profile, and is only referenced today in references/context-budget.md.", "Composer's model slugs confirmed live via cursor-agent --list-models (authenticated Pro-tier account, 2026-07-24): composer-2.5 and composer-2.5-fast. Context window and pricing remain unexposed by the CLI even authenticated - stay TBD.", "Composer-only vs. executor rows on every hosted frontier model: Composer-only - model-profiles.json is scoped to the small-model rotation, none of Cursor's hosted frontier ids were already present, and adding them would require new out-of-scope profile entries."]
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
| **Status** | Complete |
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

The live model roster was **auth-gated** at phase-001 authoring time; by this phase, the operator completed `cursor-agent login` and `cursor-agent --list-models` on an authenticated Pro-tier account confirmed the exact slugs `composer-2.5`/`composer-2.5-fast` (2026-07-24). Context window and pricing remain unexposed by the CLI even authenticated and stay TBD rather than fabricated.

### Purpose
Add a Composer prompt-craft profile grounded in phase 001's confirmed facts plus this phase's live authenticated verification (with the still-unexposed numeric specs marked TBD), record `cli-cursor` as the driving executor, and wire `cli-cursor` into the `check-prompt-quality-card-sync.sh` CI gate — without fabricating any per-model numeric detail the CLI does not expose.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Author `references/models/composer-2.5.md` (filename matches the registry `id` exactly, per `check-prompt-quality-card-sync.sh` CHECK 3) — a Composer prompt-craft profile mirroring the structure of the existing per-model profiles (`deepseek-v4-pro.md` as the unbenchmarked-model precedent), documenting Composer as Cursor's native coding model with a `Cursor-exclusive` note, its live-confirmed selection mechanics (`--model composer-2.5`/`composer-2.5-fast`), and TBD placeholders for the still-unexposed context window / pricing.
- Add a Composer entry to `assets/model-profiles.json` consistent with the existing entries' shape.
- Record `cli-cursor` as a driving executor for Composer only (resolved open question — see §12).
- Wire `cli-cursor` into the `check-prompt-quality-card-sync.sh` CI gate arrays so `cli-cursor/assets/prompt-quality-card.md` is covered by the same sync check as its siblings.

### Out of Scope
- Fabricating Composer's context window or pricing — the CLI does not expose these even authenticated, so they remain explicit TBD placeholders.
- Re-creating executor-config.ts's `CURSOR_SUPPORTED_MODELS`/`CursorApprovalMode` — that is phase 002's runtime-typing layer, a different registry from `sk-prompt/prompt-models`.
- Authoring `cli-cursor/assets/prompt-quality-card.md` itself — that is phase 003; this phase only ensures the CI gate covers it.
- Adding profiles for the hosted frontier models (gpt/sonnet/opus/gemini/grok) — they carry provider-native behavior and are driven, not owned, by Cursor; only Composer (Cursor-exclusive) gets a new profile.
- Any dispatch-runtime or fan-out code (phase 002).

### Files to Change
| File Path | Change Type | Description |
|---|---|---|
| `.opencode/skills/sk-prompt/prompt-models/references/models/composer-2.5.md` | Create | Composer prompt-craft profile (Cursor-native), unexposed specs as TBD. |
| `.opencode/skills/sk-prompt/prompt-models/references/models/_index.md` | Modify | Add Composer to the model index. |
| `.opencode/skills/sk-prompt/prompt-models/assets/model-profiles.json` | Modify | Add a Composer entry; note `cli-cursor` as a driving executor. |
| `.opencode/skills/system-skill-advisor/mcp-server/scripts/check-prompt-quality-card-sync.sh` | Modify | Add `cli-cursor` to the executor arrays the sync gate covers. |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Priority |
|---|---|---|
| REQ-001 | `references/models/composer-2.5.md` exists, structured like the existing per-model profiles, documenting Composer as Cursor's native/exclusive coding model with its confirmed selection mechanics. | P1 |
| REQ-002 | Composer's still-unexposed specs (context window, pricing) are TBD placeholders, explicitly marked "verify at implementation time", never fabricated; the version slug IS confirmed (`composer-2.5`/`composer-2.5-fast` via authenticated `cursor-agent --list-models`, 2026-07-24). | P0 |
| REQ-003 | `assets/model-profiles.json` gains a Composer entry consistent with the existing entries' shape, with `cli-cursor` recorded as a driving executor. | P1 |
| REQ-004 | `references/models/_index.md` lists Composer. | P2 |
| REQ-005 | `check-prompt-quality-card-sync.sh` includes `cli-cursor` in the executor arrays it covers, so the new packet's `prompt-quality-card.md` is gated identically to its siblings. | P1 |
| REQ-006 | The open question of whether `cli-cursor` needs executor rows on every hosted frontier model or only Composer is resolved (documented) before the model-profiles edits are finalized. **Resolved: Composer-only.** | P1 |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
- **SC-001**: `references/models/composer-2.5.md` and the `model-profiles.json` Composer entry exist, with every unexposed numeric field marked TBD, none fabricated. **MET** — `grep -n -i "TBD\|unconfirmed" composer-2.5.md` → 4 hits, no fabricated numbers.
- **SC-002**: `check-prompt-quality-card-sync.sh` passes with `cli-cursor` included in its coverage arrays. **MET** — `GUARD PASS` (all 4 checks).
- **SC-003**: `bash .../validate.sh 005-cursor-model-registry-and-routing --strict` passes 0/0.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
- **Fabricated model specs**: guessing Composer's context window or pricing would ship false data. Mitigation: REQ-002 mandates TBD placeholders — confirmed applied (§5 SC-001).
- **CI gate array drift**: adding `cli-cursor` to one array but not another in `check-prompt-quality-card-sync.sh` would leave the card partially gated. Mitigation: edited all 3 coverage points (`cli_cards`, `cli_skills`, `CLI_EXECUTOR_HUB_METADATA`) in one pass and ran the gate immediately — `GUARD PASS`.
- **Dependency — phase 003**: `cli-cursor/assets/prompt-quality-card.md` must exist (phase 003) for the sync gate to have something to check. Resolved — phase 003 landed first (committed `11024cc893`), so the gate had a real card to check from the start.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. NON-FUNCTIONAL REQUIREMENTS
- **NFR-C01**: The Composer profile follows the exact structural shape of the existing `references/models/*.md` profiles — no bespoke section layout.

## 8. EDGE CASES
- Composer is renamed or versioned (e.g. "Composer 2.5" → a later version): the profile filename and registry `id` are both pinned to the live-confirmed `composer-2.5` slug (2026-07-24) — a future rename needs a follow-up phase to add the new slug, not a silent overwrite.
- `check-prompt-quality-card-sync.sh` runs before phase 003 ships the card: not encountered — phase 003 landed before this phase started, so the gate had a real card to check from the start.

## 9. COMPLEXITY ASSESSMENT
| Dimension | Score | Notes |
|---|---|---|
| Scope | 10/25 | 1 new profile + 3 small edits; markdown/JSON/shell only. |
| Risk | 8/25 | Low blast radius; main risk is fabricating auth-gated specs, mitigated by TBD discipline. |
| Research | 8/20 | Grounded in phase 001; Composer's exact specs deferred to an authenticated roster enumeration. |
| **Total** | **26/70** | **Level 2** |

## 10. RISK MATRIX
| Risk | Likelihood | Impact | Mitigation | Outcome |
|---|---|---|---|---|
| Composer specs fabricated instead of TBD | Medium | Medium (false model data) | REQ-002 TBD discipline + verify-at-impl-time note | Avoided — 4 explicit TBD markers, 0 fabricated numbers |
| Sync-gate arrays edited inconsistently | Low | Medium (partially-gated card) | Single-pass edit + immediate gate run | Avoided — `GUARD PASS` all 4 checks |

## 11. USER STORIES
- As a dispatcher, I want Composer to have a prompt-craft profile like every other model, so dispatching Cursor with Composer follows the same craft guidance as any other model dispatch.
- As a maintainer, I want `cli-cursor`'s prompt-quality card covered by the same CI sync gate as its siblings, so it cannot silently drift from the canonical card.

## 12. OPEN QUESTIONS
Both questions below are now resolved.
- Composer's exact version slug: **Resolved** — `composer-2.5`/`composer-2.5-fast`, confirmed via `cursor-agent --list-models` on an authenticated Pro-tier account (2026-07-24), plus a live smoke dispatch returning `pong`. Context window and pricing remain TBD — not exposed by the CLI even authenticated.
- Does `cli-cursor` need executor rows on every hosted frontier model it can drive, or only on Composer? **Resolved: Composer-only.** `model-profiles.json`'s own description scopes it to the small-model rotation; none of Cursor's hosted frontier ids (`gpt-5.6-sol-*`, `claude-opus-4-8-*`, `cursor-grok-4.5-*`) were already present, and adding them would require new profile entries the spec's own §3 Out of Scope already excludes.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS
- `plan.md`, `tasks.md`, `checklist.md` (this phase)
- `../004-cursor-hook-adapter-layer/spec.md` (predecessor)
- `../006-cursor-manual-testing-playbook/spec.md` (successor)
- `../001-cursor-contract-pin/implementation-summary.md` (confirmed model-roster shape; Composer as Cursor-native; auth-gated enumeration caveat)
- `.opencode/skills/sk-prompt/prompt-models/references/models/deepseek-v4-pro.md` (structural precedent for the Composer profile — the unbenchmarked-model shape, chosen over the benchmark-heavy `glm-5.2.md`)
- `../../029-cli-devin-revival/005-devin-model-registry-and-quota/spec.md` (structural precedent: adding a CLI-native model + executor rows + CI gate)
